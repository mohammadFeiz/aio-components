import express, { NextFunction, Router, RequestHandler, Request, Response } from 'express';
import type { Express } from 'express';
//@ts-ignore
import mongoose, { ClientSession, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import Agenda from 'agenda';
import cookieParser from 'cookie-parser';
import cors from 'cors';
export type I_AIOExpress = { auth?: I_auth, env: { mongoUrl: string, port: string, secretKey: string }, uiDoc?: boolean };
export type I_response<T> = { status: number, success: boolean, message?: string, value?: T }
export type I_auth = {
    schema?: I_schemaDefinition,
    name: string,
    path: string,
    tokenTime: { unit: 's' | 'm' | 'h' | 'd', value: number },
    registerExeption?: (p: { userName: string, password: string, userProps: any }) => Promise<{ status?: number, message?: string, userName?: string, password?: string, userProps?: any } | void>,
    loginExeption?: (p: { user: any, token: string }) => Promise<{ status?: number, message?: string, user?: any } | void>
};
type I_transaction = <T>(callback: (session: ClientSession) => Promise<T | string>) => Promise<T | string>
type I_row = { [key: string]: any }
type I_getModel = (key: string) => Model<any>
export type I_entity = { schema?: I_schemaDefinition | string, path?: string, requiredToken?: boolean, apis: I_api[] };
export type I_entities = { [entityName: string]: I_entity }
export type I_queryParam = { [key: string]: any }
export type I_api = {
    path: string,
    method: 'post' | 'get' | 'put' | 'delete',
    body?: string,
    successResultType: string,
    errorResultType: string,
    configStr: string,
    description: string,
    queryString?: string,
    checkAccess?: (p: { reqUser: any, body: any, queryParam: I_queryParam }) => Promise<void | string | { [key: string]: any }>
    fn: (p: { req: Request, res: Response, reqUser: any, body: any, accessBody: any, queryParam: I_queryParam }) => Promise<I_response<any>>
};
type I_setResult = (p: { res: Response, status: number, message: string, success: boolean, value?: any }) => any
type I_schemas = { [key: string]: (I_schemaDefinition | I_schemaDefinitionOption) }
type I_record<T> = T & {id:string} & Document
class AIOExpress<I_User> {
    private app: Express;
    private p: I_AIOExpress;
    private jwt: (req: Request, res: Response, next: NextFunction) => void;
    private AuthRouter: Router;
    private AuthModel?: Model<any>;
    private models: { [key: string]: Model<any> };
    private routers: { [key: string]: Router };
    private tokenBaseDic: { [key: string]: string } = {};
    private tokenLessDic: { [key: string]: string } = {};
    private AIOSchemaInstance: AIOSchema = new AIOSchema();
    schemas: I_schemas = {}
    env: { mongoUrl: string, port: string, secretKey: string };
    gcrud: GCRUD;
    getRow: GCRUD["getRow"];
    getRows: GCRUD["getRows"];
    addRow: GCRUD["addRow"];
    editRow: GCRUD["editRow"];
    addOrEditRow: GCRUD["addOrEditRow"];
    editRows: GCRUD["editRows"];
    removeRow: GCRUD["removeRow"];
    removeRows: GCRUD["removeRows"];
    getUser: (p: { id?: any, search?: Partial<I_User> }) => Promise<null | I_record<I_User> | string>;
    getUsers: (p: { ids?: any[], search?: Partial<I_User> }) => Promise<I_record<I_User>[] | string>;
    addUser: (p: { newValue: I_User, session?: ClientSession }) => Promise<I_record<I_User> | string>
    editUser: (p: { id: any, newValue: Partial<I_User>, session?: ClientSession }) => Promise<I_record<I_User> | string>
    editUsers: (p: { ids?: any[], search?: Partial<I_User>, newValue: Partial<I_User>, session?: ClientSession }) => Promise<string | number>
    removeUser: (p: { id?: any, search?: Partial<I_User>, session?: ClientSession }) => Promise<I_record<I_User> | string | null>
    removeUsers: (p: { ids?: any[], search?: Partial<I_User>, session?: ClientSession }) => Promise<number | string>
    changeUserPassword: (p: { oldPassword: string | false, newPassword: string, userId: string }) => Promise<true | string>
    agenda: Agenda;
    constructor(p: I_AIOExpress) {
        // mongoose.set('debug', true);
        this.p = p;
        this.env = { mongoUrl: p.env.mongoUrl as string, secretKey: p.env.secretKey as string, port: p.env.port as string }
        this.models = {}
        this.routers = {}
        this.app = express();
        this.AuthRouter = express.Router();
        this.jwt = this.initJwt;
        if (p.auth) { this.handleAuth(); }
        this.gcrud = new GCRUD({ getModel: this.getModel, getAuthModel: () => this.AuthModel as Model<any> })
        this.getRow = this.gcrud.getRow;
        this.getRows = this.gcrud.getRows;
        this.addRow = this.gcrud.addRow;
        this.editRow = this.gcrud.editRow;
        this.addOrEditRow = this.gcrud.addOrEditRow;
        this.editRows = this.gcrud.editRows;
        this.removeRow = this.gcrud.removeRow;
        this.removeRows = this.gcrud.removeRows;
        this.getUser = async (p) => await this.getRow<I_User>({ ...p, entityName: 'auth' })
        this.getUsers = async (p) => await this.getRows<I_User>({ ...p, entityName: 'auth' })
        this.addUser = async (p) => {
            const newValue: any = p.newValue;
            const hashedPassword = await bcrypt.hash(newValue.password, 10);
            newValue.password = hashedPassword;
            const res = await this.addRow<I_User>({ ...p,newValue, entityName: 'auth' })
            return typeof res === 'string' ? res : res
        }
        this.editUser = async (p) => await this.editRow<I_User>({ ...p, entityName: 'auth' })
        this.editUsers = async (p) => await this.editRows<I_User>({ ...p, newValue: p.newValue, entityName: 'auth' })
        this.removeUser = async (p) =>await this.removeRow<I_User>({ ...p, entityName: 'auth' })
        this.removeUsers = async (p) => await this.removeRows<I_User>({ ...p, entityName: 'auth' })
        this.changeUserPassword = async (p) => {
            try {
                const user = await this.getUser({id:p.userId});
                if(user === null){return 'user not found'}
                if(typeof user === 'string'){return user}
                const newPasswrod = await this.getNewPassword({userPassword:user.id,oldPassword:p.oldPassword,newPassword:p.newPassword});
                if (newPasswrod === false) { return 'old password is not match' }
                const newValue: any = { password: newPasswrod }
                const res = await this.editUser({ id: p.userId, newValue })
                if (typeof res === 'string') { return res }
                else { return true }
            }
            catch (err: any) { return err.message }
        }
        const agenda = new Agenda({ db: { address: this.env.mongoUrl } });
        this.agenda = agenda
    }
    getModel: I_getModel = (key) => this.models[key]
    log = (message: string, color?: 'green' | 'red' | 'yellow' | 'orange') => {
        if (color === "green") { console.log('\x1b[32m%s\x1b[0m', message) }
        else if (color === "yellow") { console.log('\x1b[33m%s\x1b[0m', message) }
        else if (color === "red") { console.log('\x1b[31m%s\x1b[0m', message) }
        else if (color === "orange") { console.log('\x1b[38;5;208m%s\x1b[0m', message) }        
        else { console.log(message) }
    }
    start = async () => {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(cookieParser() as RequestHandler);
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.connectToMongoose();
        if (this.AuthRouter && this.p.auth) { this.app.use(this.fixPath(this.p.auth.path), this.AuthRouter); }
        // Routes without token
        for (let name in this.tokenLessDic) { this.app.use(this.tokenLessDic[name], this.routers[name]) }
        // Middleware JWT
        this.app.use(this.jwt);
        // Routes with token
        for (let name in this.tokenBaseDic) {
            const path = this.tokenBaseDic[name]
            const router = this.routers[name];
            this.app.use(path, router)
        }
        await this.agenda.start();
        this.app.listen(this.env.port, () => { console.log(`Server running on port ${this.env.port}`) });
    };
    transaction: I_transaction = async (callback) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const result = await callback(session);
            if (typeof result === "string") {
                await session.abortTransaction();
                session.endSession();
                console.error("Callback error:", result);
                return result;
            }
            await session.commitTransaction();
            session.endSession();
            return result;
        } catch (error: any) {
            await session.abortTransaction();
            session.endSession();
            console.error("Transaction failed:", error.message);
            return error.message;
        }
    };
    schedule = async (p: { callAt: number, callback: () => Promise<void>, jobName: string, version: string }) => {
        try {
            const existingJobs = await this.agenda.jobs({ name: p.jobName });
            if (existingJobs.length > 0) {
                const job = existingJobs[0];
                if (job.attrs.data.version === p.version) {
                    console.log(`job with name ${p.jobName} and version ${p.version} is already exist.`);
                    return;
                } else {
                    await this.agenda.cancel({ name: p.jobName });
                    console.log(`job with name ${p.jobName} and last version removed.`);
                }
            }
            this.agenda.define(p.jobName, async (job: any) => await p.callback());
            const executionDate = new Date(p.callAt);
            await this.agenda.schedule(executionDate, p.jobName, { version: p.version });
            console.log(`job ${p.jobName} for time ${executionDate} and version ${p.version} scheduled.`);
        }
        catch (error: any) { console.error(`خطا در زمان‌بندی شغل: ${error.message}`) }
    }
    stopSchedule = async (name: string) => {
        try {
            const result = await this.agenda.cancel({ name });
            if (result) { console.log(`شغل با نام ${name} با موفقیت حذف شد.`) }
            else { console.log(`شغلی با نام ${name} پیدا نشد.`) }
        }
        catch (error: any) { console.error(`خطا در حذف شغل: ${error.message}`) }
    };
    connectToMongoose = () => {
        const url: string = this.env.mongoUrl;
        mongoose
            .connect(url)
            .then(() => console.log('MongoDB connected'))
            .catch((err: any) => console.log(err));
    };
    getTotal = async (name: string): Promise<number> => await this.getModel(name).countDocuments({})
    getNewPassword = async (p: { userPassword: string, oldPassword: string | false, newPassword: string }): Promise<string | false> => {
        if(p.oldPassword !== false){
            const isMatch = await bcrypt.compare(p.oldPassword, p.userPassword);
            if (!isMatch) { return false }
        }
        const hashedPassword: string = await bcrypt.hash(p.newPassword, 10);
        return hashedPassword
    }
    initJwt = (req: any, res: Response, next: NextFunction) => {
        if (!this.p.auth) { return }
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) { return res.status(401).json({ message: 'Access denied. No token provided.', success: false }); }
        jwt.verify(token, this.env.secretKey, (err: any, decoded: any) => {
            if (err) { return res.status(401).json({ message: 'Invalid token or token is expired.' }); }
            req.user = decoded; next();
        });
    };
    getExpiresIn = (): string => {
        if (!this.p.auth) { return ''; }
        const { tokenTime } = this.p.auth, { unit, value } = tokenTime;
        return `${value}${unit}`
    }
    getSchemaByRefrence = (schema: I_schemaDefinitionOption | I_schemaDefinition | string): { dif: I_schemaDefinitionOption | I_schemaDefinition, ref: string } => {
        if (typeof schema === 'string') { return { dif: this.schemas[schema], ref: schema } }
        return { dif: schema, ref: '' }
    }
    handleAuth = () => {
        if (!this.p.auth) { return; }
        const { registerExeption, loginExeption } = this.p.auth;
        const { dif } = this.getSchemaByRefrence(this.p.auth.schema || {})
        const schema = dif as I_schemaDefinition
        const scm: I_schemaDefinition = { ...schema, password: { type: 'string', required: true }, userName: { type: 'string', required: true, unique: true } }
        const authSchema = this.AIOSchemaInstance.getSchema(scm);
        authSchema.methods.matchPassword = async function (enteredPassword: string) {
            return await bcrypt.compare(enteredPassword, this.password);
        };
        this.AuthModel = mongoose.model(this.p.auth.name, authSchema);
        const registerFn: any = async (req: Request, res: Response): Promise<express.Response | void> => {
            if (!this.AuthModel) { return res.status(400).json({ message: 'class error 23423' }); }
            const { userName, password, userProps = {} } = req.body;
            try {
                const existingUser = await this.AuthModel.findOne({ userName });
                if (existingUser) { return res.status(403).json({ message: 'User with this username already exists' }); }
                if (!password || !userName) { return res.status(403).json({ message: 'Missing username or password' }); }
                let defModel: any = {};
                if (schema) {
                    defModel = this.AIOSchemaInstance.getDefaultValueBySchema(schema, { ...userProps, userName, password });
                    const message = this.AIOSchemaInstance.validateObjectBySchema(schema, '', defModel);
                    if (typeof message === 'string') { return res.status(400).json({ message, success: false }); }
                }
                if (registerExeption) {
                    const exep = await registerExeption({ userName, password, userProps });
                    if (exep) {
                        if (exep.status) { return res.status(exep.status).json({ message: exep.message, success: false }); }
                        if (exep.userName) { }
                    }
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const userModel = { ...defModel, password: hashedPassword, userName };
                const newUser = new this.AuthModel(userModel);
                await newUser.save();
                return res.status(201).json({ message: 'User registered successfully', user: userModel });
            }
            catch (err: any) { return res.status(500).json({ message: 'Error registering user', error: err.message }) }
        };
        this.AuthRouter.post('/register', registerFn);
        const loginFn: any = async (req: Request, res: Response) => {
            if (!this.AuthModel) { return; }
            const { userName, password } = req.body;
            try {
                let user = await this.AuthModel.findOne({ userName });
                if (!user || !(await user.matchPassword(password))) {
                    return res.status(400).json({ message: 'Invalid username or password' });
                }
                const secretKey: string = this.env.secretKey;
                const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: this.getExpiresIn() });
                if (loginExeption) {
                    const exep = await loginExeption({ user, token });
                    if (exep) {
                        if (exep.status) { return res.status(exep.status).json({ message: exep.message, success: false }); }
                        if (exep.user) {
                            let newUser = user.toObject()
                            for (let prop in exep.user) { newUser[prop] = exep.user[prop] }
                            return res.status(200).json({ message: 'Login successful', token, user: newUser });
                        }
                    }
                }
                return res.status(200).json({ message: 'Login successful', token, user });
            } catch (err: any) {
                return res.status(500).json({ message: 'Error logging in', error: err.message });
            }
        };
        this.AuthRouter.post('/login', loginFn);
        this.AuthRouter.get('/checkToken', async (req: Request, res: Response) => {
            if (!this.p.auth) { return }
            try {
                const token = req.headers['authorization']?.split(' ')[1] || ''; // استخراج توکن از هدر
                jwt.verify(token, this.env.secretKey as string, async (err: any, decoded: any) => {
                    if (err) { return this.setResult({ res, message: 'Token is invalid', success: false, status: 401 }) }
                    if (this.AuthModel) {
                        const reqUserId = decoded.id;
                        const reqUser = await this.getUser({ id: reqUserId });
                        if (reqUser === null) { return this.setResult({ res, message: 'User Not Found', success: false, status: 401 }) }
                        if (typeof reqUser === 'string') { return this.setResult({ res, message: reqUser, success: false, status: 401 }) }
                    }
                    return this.setResult({ res, message: 'authorized', success: true, status: 201 })
                });
            }
            catch (err: any) { return this.setResult({ res, status: 500, success: false, message: err.message }) }
        })
    };
    addSchema = (name: string, scm: I_schemaDefinition | I_schemaDefinitionOption) => {
        this.schemas[name] = scm;
        this.AIOSchemaInstance.schemas = this.schemas;
    }
    getSchemaDefinition = (schema: string | I_schemaDefinition, entityName: string): I_schemaDefinition => {
        if (typeof schema === 'string') {
            const scm = this.schemas[schema]
            if (!!scm.type) { console.error(`Error in entity ${entityName} . schema is not valid . route schemas cannot get type property`); }
            return scm as I_schemaDefinition
        }
        return schema
    }
    addEntities = (entities: I_entities) => {
        if (this.p.uiDoc) {
            const { success, result } = this.AIOSchemaInstance.generateUIDoc(entities);
            const message = success ? 'generate ui doc was successful!!!' : 'error in generate ui doc!!!';
            const color = success ? 'green' : 'red'
            this.log(message, color);
            this.log(result, 'yellow');
        }
        this.log(this.AIOSchemaInstance.getApiTypes(entities), 'orange');
        for (let prop in entities) { this.addEntity(entities[prop], prop) }
    }
    fixPath = (path: string, queryString?: string) => (path[0] !== '/' ? `/${path}` : path) + (queryString || '')
    private addEntity = (entity: I_entity, name: string) => {
        const { schema, apis, requiredToken = true } = entity;
        const dicName = requiredToken ? 'tokenBaseDic' : 'tokenLessDic';
        this[dicName][name] = this.fixPath(entity.path || `/${name}`);
        if (schema) {
            try {
                const dif = this.getSchemaDefinition(schema, name);
                const removedIdDif: any = {}
                for (let prop in dif) { if (prop !== 'id') { removedIdDif[prop] = dif[prop] } }
                const entitySchema = this.AIOSchemaInstance.getSchema(removedIdDif);
                const entityModel = mongoose.model(name, entitySchema);
                this.models[name] = entityModel;
            }
            catch (err: any) {
                console.error(`Error creating model for entity ${name}:`, err.message); return;
            }
        }
        try {
            this.routers[name] = express.Router();
            for (let api of apis) {
                const { path, method, fn, queryString } = api;
                const url = this.fixPath(path, queryString);
                this.routers[name][method](url, async (req: Request, res: Response) => {
                    try {
                        const reqUser = await this.getUserByReq(req);
                        if (reqUser === null) { return this.setResult({ res, success: false, message: 'req user not found', status: 401 }) }
                        let body: any = { ...(req.body || {}) };
                        if (method === 'post' && !api.body) { return this.setResult({ status: 403, success: false, message: 'missing api.body in backend app', res }) }
                        const queryParam = this.processUrl(req);
                        if (api.body) {
                            let scm = this.schemas[api.body];
                            if (!scm) {console.log(`${api.body} in not defined by addSchema`)}
                            let message = this.AIOSchemaInstance.validateObjectBySchema(scm, '', req.body);
                            if (typeof message === 'string') {
                                message = `in request body : ${message}`
                                return this.setResult({ status: 400, success: false, message, res })
                            }
                        }
                        if (typeof reqUser === 'string') { return { success: false, message: reqUser, status: 403 } }
                        let accessBody;
                        if (api.checkAccess) {
                            let result = await api.checkAccess({ reqUser, body, queryParam });
                            if (typeof result === 'string') { return res.status(403).json({ message: result, success: false }); }
                            else if (result) {
                                accessBody = result
                            }
                        }
                        const result = await fn({ req, res, reqUser, body, accessBody, queryParam })
                        return this.setResult({ ...result, res, message: result.message || '' })
                    }
                    catch (err: any) { return res.status(500).json({ message: err.message, success: false }); }
                });
            }
        }
        catch (err: any) {
            console.error(`Error creating router for entity ${name}:`, err.message);
        }
    };
    processUrl = (req: Request): { [key: string]: any } => {
        if (Object.keys(req.params).length > 0) { return req.params }
        if (Object.keys(req.query).length > 0) { return req.query; }
        return {};
    }
    setResult: I_setResult = (p) => {
        return p.res.status(p.status).json({ message: p.message, success: p.success, value: p.value });
    }
    getUserByReq = async (req: Request): Promise<I_User | null | string> => {
        try {
            if (!this.AuthModel) { return null }
            const userId = (req as any).user.id
            const user: null | I_User = await this.AuthModel.findById(userId);
            return user
        }
        catch (err: any) { return err.message }
    }
}

export default AIOExpress;
type I_GCRUD = {getModel: I_getModel,getAuthModel: () => Model<any>}
class GCRUD {
    getModel: I_getModel;
    getAuthModel: () => Model<any>
    constructor(p: I_GCRUD) { this.getModel = p.getModel; this.getAuthModel = p.getAuthModel }
    getModelByP = async (p: any) => p.entityName === 'auth' ? this.getAuthModel() : await this.getModel(p.entityName)
    fixId = (row: any) => {
        if (typeof row === 'object' && !Array.isArray(row) && row !== null) { row.id = row._id; }
        return row
    }
    getRow = async <T>(p:{ entityName: string | 'auth', search?: Partial<T>, id?: any }):Promise<null | I_record<T> | string> => {
        try {
            const model = await this.getModelByP(p);
            if (p.id) { const res: I_record<T> | null = await model.findById(p.id); return this.fixId(res) }
            else if (p.search) { const res: I_record<T> | null = await model.findOne(p.search); return this.fixId(res) }
            else { return `Error in get row: please send search object or id for search` }
        }
        catch (error: any) { return `Error in get row: ${error.message}`; }
    }
    getRows = async <T>(p:{ entityName: string, search?: Partial<T>, ids?: any[] }):Promise<I_record<T>[] | string> => {
        try {
            const model = await this.getModelByP(p);
            if (p.ids && p.ids.length > 0) { return await model.find({ _id: { $in: p.ids } }); }
            if (p.search) {
                const res:I_record<T>[] = await model.find(p.search);
                return res.map((o: (T & {id:string})) => this.fixId(o))
            }
            return [];
        }
        catch (error: any) { return `Error in getRows: ${error.message}`; }
    }
    addRow = async <T>(p:{ entityName: string | 'auth', newValue: T, session?: ClientSession }):Promise<I_record<T>  | string> => {
        try {
            let model, newRecord;
            try { model = await this.getModelByP(p); newRecord = new model(p.newValue); }
            catch (err: any) { return err.message }
            const param = p.session ? { session: p.session } : undefined
            const res:T = await newRecord.save(param).catch((err: any) => `Error in adding row : ${err}`);
            const result:I_record<T> = this.fixId(res)
            return result
        }
        catch (error: any) { return `Error in adding row: ${error.message}`; }
    }
    editRow = async <T>(p:{ entityName: string | 'auth', id?: any, search?: Partial<T>, newValue: I_row, session?: ClientSession }):Promise<string | I_record<T>> => {
        try {
            const model = await this.getModelByP(p);
            const exist = await this.getRow(p);
            if (exist === null) { return 'Record not found'; }
            if (typeof exist === 'string') { return exist }
            for (let prop in p.newValue) {
                if (prop === 'id' || prop === '_id') { continue }
                exist[prop as keyof I_record<T>] = p.newValue[prop]
            }
            const updatedRecord = await model.findByIdAndUpdate(exist.id, exist, { new: true, session: p.session });
            if (!updatedRecord) { return 'Record not found'; }
            return this.fixId(updatedRecord);
        }
        catch (error: any) { throw new Error(`Error updating record: ${error.message}`); }
    }
    addOrEditRow = async <T>(p: { entityName: string | 'auth', id?: any, search?: Partial<T>, newValue: T, session?: ClientSession }):Promise<string | I_record<T>> => {
        try {
            const model = await this.getModelByP(p);
            let existingRecord = await this.getRow({entityName:p.entityName,search:p.search,id:p.id});
            if(typeof existingRecord === 'string'){return existingRecord}
            if (existingRecord !== null) {
                const updatedRecord = await model.findByIdAndUpdate(existingRecord.id, p.newValue as any, { new: true, session: p.session });
                return this.fixId(updatedRecord);
            }
            else {
                const newRecord = new model(p.newValue);
                await newRecord.save();
                return this.fixId(newRecord);
            }
        }
        catch (error: any) { return `Error adding or updating record: ${error.message}` }
    }
    editRows = async <T>(p: { entityName: string | 'auth', search?: Partial<T>; ids?: any[]; newValue: Partial<T>, session?: ClientSession }):Promise<string | number> => {
        try {
            const model = await this.getModelByP(p);
            let query;
            if (p.ids && p.ids.length > 0) { query = { _id: { $in: p.ids } }; }
            else { query = p.search; }
            const result = await model.updateMany(query, { $set: p.newValue }, { session: p.session });
            if (result.modifiedCount === 0) { return 'No records found to update'; }
            return result.modifiedCount; // تعداد رکوردهای ویرایش شده
        }
        catch (error: any) { throw new Error(`Error updating records: ${error.message}`); }
    }
    removeRow = async <T>(p: { entityName: string | 'auth', search?: Partial<T>; id?: string, session?: ClientSession }):Promise<string | I_record<T> | null> => {
        try {
            const model = await this.getModelByP(p);
            let query;
            if (p.id) { query = { _id: p.id }; }
            else if (p.search) { query = p.search; }
            else { return 'No criteria provided for deletion'; }
            const deletedRecord = await await model.findOneAndDelete(query, { session: p.session });
            if (!deletedRecord) { return null; }
            return this.fixId(deletedRecord);
        }
        catch (error: any) { throw new Error(`Error deleting record: ${error.message}`); }
    }
    removeRows = async <T>(p: { entityName: string | 'auth', search?: Partial<T>; ids?: any[], session?: ClientSession }):Promise<string | number> => {
        try {
            const model = await this.getModelByP(p);
            let query;
            if (p.ids && p.ids.length > 0) { query = { _id: { $in: p.ids } }; }
            else { query = p.search; }
            const result = await model.deleteMany(query, { session: p.session });
            if (result.deletedCount === 0) { return 'No records found to delete'; }
            return result.deletedCount;
        }
        catch (error: any) { throw new Error(`Error deleting records: ${error.message}`); }
    }
}
export type I_schemaDefinition = { [field: string]: I_schemaDefinitionOption | string }
export type I_schema = Schema;
export type I_schemaType = I_schemaDefinition | string | I_schemaType[]
export type I_schemaDefinitionOption = {
    type: I_schemaType,
    of?: I_schemaType,
    required?: boolean, // فیلد اجباری (پیش‌فرض: true)
    def?: any, // مقدار پیش‌فرض
    enum?: any[], // enum یا مقادیر ممکن
    unique?: boolean, // یکتا بودن مقدار
    minLength?: number, // حداقل طول برای string
    maxLength?: number, // حداکثر طول برای string
    min?: number, // حداقل مقدار برای number
    max?: number, // حداکثر مقدار برای number
    ref?: string, // برای تعریف روابط (مانند ObjectId)
    index?: boolean, // برای ایندکس‌گذاری
    validate?: (value: any) => boolean, // اعتبارسنجی سفارشی
    errorMessage?: string, // پیام خطای سفارشی در صورت اعتبارسنجی ناموفق
}
type I_getSchemaType = typeof String | typeof Number | typeof Boolean | typeof Date | typeof Map | I_schema;
export class AIOSchema {
    schemas: { [key: string]: I_schemaDefinition | I_schemaDefinitionOption } = {};
    getSchemaByRefrence = (schema: I_schemaDefinitionOption | I_schemaDefinition | string): { dif: I_schemaDefinitionOption | I_schemaDefinition, ref: string } => {
        if (typeof schema === 'string') { return { dif: this.schemas[schema], ref: schema } }
        return { dif: schema, ref: '' }
    }
    isSchemaRowSchema = (schemaDefinitionOption: I_schemaDefinitionOption): boolean => {
        const { dif } = this.getSchemaByRefrence(schemaDefinitionOption)
        return !dif.type
    };
    isSchemaRowMap = (schemaDefinitionOption: I_schemaDefinitionOption): boolean => {
        const { dif } = this.getSchemaByRefrence(schemaDefinitionOption)
        return !!dif.of
    };
    getSchemaType = (type: I_schemaType): I_getSchemaType | undefined => {
        if (type === 'string') return String;
        else if (type === 'number') return Number;
        else if (type === 'boolean') return Boolean;
        else if (type === 'null') return;
        else if (type === 'true') return Boolean;
        else if (type === 'false') return Boolean;
        else if (type === 'date') return Date;
        else if (type === 'map') return Map;
        else if (typeof type === 'string') { 
            const schema = this.schemas[type];
            if(!schema){
                return 
            }
            return this.getSchemaType(schema as I_schemaDefinition) 
        }
        else if (Array.isArray(type)) {
            return [this.getSchemaType(type[0])] as any;
        }
        else {return this.getSchema(type)};
    }
    getSchema = (scm: I_schemaDefinition): I_schema => {
        const { dif } = this.getSchemaByRefrence(scm);
        const schemaDefinition = dif as I_schemaDefinition;
        try {
            const fields: any = {};
            Object.keys(schemaDefinition).forEach(fieldKey => {
                let h = this.getSchemaByRefrence(schemaDefinition[fieldKey]);
                const dif = h.dif as I_schemaDefinitionOption;
                if(!dif.type){
                    console.error(`missing schemaDefinitionOption.type`)
                    console.error('schemaDefinition is:',scm)
                    console.error('field is:',fieldKey)
                }
                const type = this.getSchemaType(dif.type)
                if(type === undefined){
                    console.log(`schema.type:'${dif.type}' is not valid for mongooseSchema`)
                    return
                }
                let mongooseSchema: any = {type,required: !!dif.required,unique: !!dif.unique};
                if (dif.def !== undefined) mongooseSchema.default = dif.def;
                if (dif.ref) mongooseSchema.ref = dif.ref;
                if (dif.enum) mongooseSchema.enum = dif.enum;
                if (dif.minLength) mongooseSchema.minLength = dif.minLength;
                if (dif.maxLength) mongooseSchema.maxLength = dif.maxLength;
                if (dif.min) mongooseSchema.min = dif.min;
                if (dif.max) mongooseSchema.max = dif.max;
                if (dif.index !== undefined) mongooseSchema.index = dif.index;
                if (dif.validate) {
                    mongooseSchema.validate = {
                        validator: dif.validate,
                        message: dif.errorMessage || 'Validation failed'
                    };
                }
                fields[fieldKey] = mongooseSchema;
            });
            const schema = new mongoose.Schema(fields, {
                timestamps: true,
                toJSON: { virtuals: true },
                toObject: { virtuals: true },
            });
            return schema;
        } catch (err: any) {
            console.error(`generate schema error by schemaDefinition =>`, err.message);
            console.error(`schemaDefinition is => ${schemaDefinition}`)
            console.error(`defined schema is => ${scm}`)
            return new mongoose.Schema({}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
        }
    }
    validateObjectBySchema = (scm: I_schemaDefinition | I_schemaDefinitionOption, key: string, value: any) => {
        if (typeof scm === 'string') { return 'error 56452435345' }
        if (scm.type) { return this.validateValueBySchemaDefinitionOption(scm as I_schemaDefinitionOption, key, value) }
        else { return this.validateObjectBySchemaDefinition(scm as I_schemaDefinition, key, value) }
    }
    validateObjectBySchemaDefinition = (scm: I_schemaDefinition, parentKey: string, obj: { [key: string]: any }): string | undefined => {
        const { dif } = this.getSchemaByRefrence(scm);
        const schemaDefinition = dif as I_schemaDefinition
        if (typeof schemaDefinition === 'string') { return 'error 5423456' }
        const keys = Object.keys(schemaDefinition);
        for (const key of keys) {
            if (key === 'organization') { debugger }
            const { dif } = this.getSchemaByRefrence(schemaDefinition[key])
            const scm = dif as I_schemaDefinitionOption
            const value = obj[key];
            const res = this.validateObjectBySchema(scm, `${parentKey}.${key}`, value);
            if (typeof res === 'string') { return res }
        }
        return undefined;
    }
    validateValueBySchemaDefinitionOption = (sdo: I_schemaDefinitionOption, key: string, value: any): string | undefined => {
        const { dif } = this.getSchemaByRefrence(sdo);
        sdo = dif as I_schemaDefinitionOption
        if (Array.isArray(sdo.type)) {
            if (!Array.isArray(value)) { return `property "${key}" should be an array`; }
            return this.validateObjectBySchema({ type: sdo.type[0] }, key + '[0]', value[0])
        }
        //اگر required true بود ولی مقدار نداشت
        if (sdo.required && (value === undefined || value === null)) {
            return `property "${key}" is required but not provided`;
        }
        //اگر نوع ردیف آبجکت سازنده ی اسکیما map بود
        if (sdo.type === 'map') {
            if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                return `property "${key}" should be an object (Map)`;
            }
            if (!sdo.of) { return `missing of property but type is map in schemaDefinitionOption by key = ${key}` }
            for (const mapKey in value) {
                return this.validateObjectBySchema({ type: sdo.of, required: true }, key, value[mapKey])
            }
        }
        //اگر تایپ ردیف آبجکت سازنده ی اسکیما خود یک اسکیما بود
        if (typeof sdo.type === 'object') {
            if (sdo.type.type) {
                return 'invalid schema. schema.type.type detected'
            }
            return this.validateObjectBySchema(sdo.type, `${key}.type`, value || {});
        }
        if (value !== undefined && !this.isValidType(value, sdo.type as 'string' | 'number' | 'boolean' | 'date' | 'false' | 'true' | 'null')) {
            return `property "${key}" is not of type ${sdo.type}, value is ${JSON.stringify(value, null, 3)}`;
        }
    }
    isValidType = (value: any, schemaType: 'string' | 'number' | 'boolean' | 'date' | 'false' | 'true' | 'null'): boolean => {
        switch (schemaType) {
            case 'string': return typeof value === 'string';
            case 'number': return typeof value === 'number';
            case 'boolean': return typeof value === 'boolean';
            case 'false': return value === false;
            case 'null': return value === null;
            case 'true': return value === true;
            case 'date': return value instanceof Date;
            default: return true; // انواع دیگر داده‌ها (مثل any) را قبول می‌کنیم
        }
    }
    getDefaultValueBySchema = (scm: I_schemaDefinition | I_schemaDefinitionOption, value: { [key: string]: any }): { [key: string]: any } => {
        if (typeof scm === 'string') { return {} }
        if (scm.type) { return this.getDefaultValueBySchemaDefinitionOption(scm as I_schemaDefinitionOption, value) }
        else { return this.getDefaultObjectBySchemaDefinition(scm as I_schemaDefinition, value) }
    }
    getDefaultObjectBySchemaDefinition = (scm: I_schemaDefinition, obj: { [key: string]: any }): { [key: string]: any } => {
        const { dif } = this.getSchemaByRefrence(scm);
        const schemaDefinition = dif as I_schemaDefinition
        const result: { [key: string]: any } = { ...obj };
        Object.keys(schemaDefinition).forEach((key) => {
            const h = schemaDefinition[key]
            if (typeof h === 'string') { return obj }//chizi ke az this.schemas mikhoonim ghatan string nist
            result[key] = this.getDefaultValueBySchema(h, result[key])
        });
        return result;
    }
    getDefaultValueBySchemaDefinitionOption = (sdo: I_schemaDefinitionOption, value: any): any => {
        const { dif } = this.getSchemaByRefrence(sdo);
        sdo = dif as I_schemaDefinitionOption
        if (value === undefined) {
            if (sdo.required === true) { return sdo.def }
        }
        else { return value }
    }
    schemaDefinitionToTS = (scm: I_schemaDefinition): { success: boolean, result: string } => {
        const { dif } = this.getSchemaByRefrence(scm);
        const schemaDefinition = dif as I_schemaDefinition
        let res: string = `{\n`;
        const schemaKeys: string[] = Object.keys(schemaDefinition);
        for (let i = 0; i < schemaKeys.length; i++) {
            const key = schemaKeys[i];
            const h = schemaDefinition[key]
            const { dif, ref } = this.getSchemaByRefrence(h)
            if (ref) { res += `   ${key}: ${ref},\n` }
            else {
                const sdo = dif as I_schemaDefinitionOption
                const { success, result } = this.schemaDefinitionOptionToTS(sdo)
                if (!success) { return { success: false, result } }
                res += `   ${key}: ${result},\n`
            }
        }
        res += `}`;
        return { success: true, result: res };
    }
    simpleTypeToTS = (type: 'string' | 'number' | 'boolean' | 'date' | 'true' | 'false' | 'null', required: boolean): { success: boolean, result: string } => {
        const getRes = (result: string) => ({ success: true, result: `${result}${required ? '' : ' | undefined'}` })
        switch (type) {
            case 'string': return getRes('string');
            case 'number': return getRes('number');
            case 'boolean': return getRes('boolean');
            case 'null': return getRes('null');
            case 'true': return getRes('true');
            case 'false': return getRes('false');
            case 'date': return getRes('Date');
            default: return getRes('any');
        }
    }
    schemaToTS = (scm: I_schemaDefinition | I_schemaDefinitionOption | string): { success: boolean, result: string } => {
        const { dif, ref } = this.getSchemaByRefrence(scm);
        let res: { success: boolean, result: string };
        if (ref) { res = { success: true, result: ref } }
        else if (dif.type) { res = this.schemaDefinitionOptionToTS(scm as I_schemaDefinitionOption) }
        else { res = this.schemaDefinitionToTS(scm as I_schemaDefinition) }
        if (res.success === true) {
            res.result = res.result.replace(/'null'/g, 'null').replace(/"null"/g, 'null')
        }
        return res
    }
    schemaDefinitionOptionToTS = (SDO: I_schemaDefinitionOption): { success: boolean, result: string } => {
        const { dif } = this.getSchemaByRefrence(SDO);
        const sdo = dif as I_schemaDefinitionOption
        if (Array.isArray(sdo.type)) {
            const { dif, ref } = this.getSchemaByRefrence(sdo.type[0] as any)
            if (ref) { return { success: true, result: `(${ref})[]` }; }
            const { success, result } = this.schemaDefinitionOptionToTS({ type: dif as I_schemaDefinition, required: true })
            if (!success) { return { success: false, result } }
            return { success: true, result: `(${result})[]` };
        }
        if (typeof sdo.type === 'object') {
            if (sdo.type.type) {
                return { success: false, result: 'invalid schema. schema.type.type detected' }
            }
            return this.schemaDefinitionToTS(sdo.type);
        }
        if (sdo.type === 'map') {
            if (!sdo.of) {
                const message = `in this schema definition option type is map but missing of property as schema definition. schema definition row is`
                return { success: false, result: `${message} => ${JSON.stringify(sdo, null, 3)}` }
            }
            const { dif, ref } = this.getSchemaByRefrence(sdo.of as any)
            if (ref) { return { success: true, result: `{[key: string]: ${ref}${sdo.required ? '' : ' | undefined'}}` }; }
            const { success, result } = this.schemaDefinitionOptionToTS({ type: dif as I_schemaDefinition, required: true })
            if (!success) { return { success: false, result } }
            return { success: true, result: `{[key: string]: ${result}${sdo.required ? '' : ' | undefined'}}` };
        }
        if (Array.isArray(sdo.enum)) {
            //notice enum can be schema
            let errors: string[] = [];
            let result = sdo.enum.map((value: any) => {
                if (typeof value === 'string') { return `'${value}'` }
                if (typeof value === 'number') { return `${value}` }
                const { success, result } = this.schemaToTS(value);
                if (success === false) { errors.push(result) }
                return result
            }).join(' | ')
            if (errors.length) {
                return { success: false, result: errors.toString() }
            }
            if (!sdo.required) {
                result = `(${result}) | undefined`
            }
            return { success: true, result }
        }
        if (['string', 'number', 'boolean', 'date', 'true', 'false','null'].indexOf(sdo.type) !== -1) {
            return this.simpleTypeToTS(sdo.type as any, !!sdo.required)
        }
        else {
            return this.schemaToTS(sdo.type)
        }
    }
    bodyParamToString = (api: I_api): { success: boolean, result: string } => {
        let res: string = ''
        if (api.body) {
            let scm = this.schemas[api.body];
            if (!scm) { return {result:`${api.body} is not defined by addSchema`,success:false}}
            res = `body:${api.body}`
        }
        if (api.queryString) { res += `${res ? ',' : ''}queryParam:{[key:string]:string} | string`; }
        return { success: true, result: res };
    }
    getReturnTypeString = (api: I_api): { success: boolean, result: string } => {
        return { success: true, result: `:Promise<(${api.successResultType}) | (${api.errorResultType})>` }
    }
    getUrlString = (name: string, path: string, queryString?: string) => {
        if (!queryString) { return `const url = ${"`${this.base_url}"}${name}${path}${"`"}` }
        return `const url = ${"`${this.base_url}"}${name}${path}${"${this.getUrlQueryParam(queryParam)}"}${"`"}`
    }
    getMethodsString = (entities: I_entities): { success: boolean, result: string } => {
        let res = '';
        for (let name in entities) {
            const { apis } = entities[name];
            for (let api of apis) {
                const { method, configStr, description, queryString } = api;
                const path = api.path[0] !== '/' ? '/' + api.path : api.path;
                const apiName = name + path.replace(/\//g, '_')
                const bodyParamString = this.bodyParamToString(api);
                if (!bodyParamString.success) { return { success: false, result: bodyParamString.result } }
                const returnTypeString = this.getReturnTypeString(api);
                if (!returnTypeString.success) { return { success: false, result: returnTypeString.result } }
                res += `
    ${apiName} = async (${bodyParamString.result})${returnTypeString.result}=>{
        ${this.getUrlString(name, path, queryString)}
        return await this.request({
            url,description:"${description}",method:"${method}",${!api.body ? '' : `body,`}\n
            ${configStr}
        })
    }
                `
            }
        }
        return { success: true, result: res }
    }
    getInterfaces = (): { success: boolean, result: string } => {
        let res: string = ''
        for (let prop in this.schemas) {
            const scm = this.schemas[prop];
            if (typeof scm === 'string') { continue }
            const { success, result } = this.schemaToTS(scm);
            if (!success) { return { success: false, result } }
            res += `
export type ${prop} = ${result};
            `
        }
        
        return { success: true, result: res }
    }
    getApiTypes = (entities:I_entities): string => {
        let res: string = ''
        res += `
express app api types:


        `
        res += `
type I_response<T> = { status: number, success: boolean, message?: string, value: T }
            `
        for (let name in entities) {
            const {apis,path} = entities[name]
            for(let api of apis){
                let {path,successResultType,errorResultType} = api;
                if(path[0] === '/'){path = path.slice(1,path.length)}
                res += `
export type API_${name}_${path} = I_response<(${successResultType}) | (${errorResultType})>;
            `
            }
        }
        
        return res
    }
    generateUIDoc = (entities: I_entities): { success: boolean, result: string } => {
        const methodsString = this.getMethodsString(entities)
        if (!methodsString.success) { return { success: false, result: methodsString.result } }
        const interfaces = this.getInterfaces()
        if (!interfaces.success) { return { success: false, result: interfaces.result } }
        const result = `
import AIOApis from "aio-apis";
type I_APIS = {base_url:string,token:string,logout:()=>void}
${interfaces.result}
export default class APIS {
    request: AIOApis['request'];
    base_url:string;
    constructor(p:I_APIS) {
        this.base_url = p.base_url;
        const inst = new AIOApis({
            id: 'cardexsuperadminapis', token:p.token, lang: 'fa',
            onCatch: (response) => {
                try{return response.response.data.message}
                catch{return response.messge}
            },
            isSuccess: (response) => {
                if(response.status === 401 || response.data.status === 401){p.logout()}
                else if (response.data.success === false) { return response.data.message }
            }
        })
        this.request = inst.request;
    }
    getUrlQueryParam = (params?: { [key: string]: string } | string) => {
        if (typeof params === 'string') { return ${"`/${params}`"}; }
        else if (typeof params === 'object' && params !== null) {
            const queryString = Object.keys(params)
                .map(key => ${"`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`"})
                .join('&');
            return ${"`?${queryString}`"};
        }
        return '';
    }
${methodsString.result}
}
        `
        return { success: true, result }
    }
}

//tanzimate replica set
//1- tavaghofe mongodb => power shel as administrator => net stop MongoDB
//2- dar mahale path\to\mongodb\Server\7.0\bin\mongod.cfg khotoote zir ro zafe kon
//replication:
//replSetName: "rs0"
//3- agar error cannot open file daryaft shod bayad 
//rooye folder rightclick=>properties=>security=>full controll tik bezani rooye hame ye halat ha
//4- power shell as administrator => net start MongoDB
//5- mongod --config "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg"
//6- dar terminale vscode varede mohite mongosh sho => mongosh
//7- dar mongosh => mongod --replSet "rs0"
//8- dar mongosh => rs.initiate()


