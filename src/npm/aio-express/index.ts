import express, { NextFunction, Router, RequestHandler, Request, Response } from 'express';
import type { Express } from 'express';
//@ts-ignore
import mongoose, { Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
export type I_AIOExpress = { auth?: I_auth, env: { mongoUrl: string, port: string, secretKey: string }, uiDoc?: boolean };
export type I_auth = {
    schema?: I_schemaDefinition,
    name: string,
    path: string,
    tokenTime: { unit: 's' | 'm' | 'h' | 'd', value: number },
    registerExeption?: (p: { userName: string, password: string, userProps: any }) => Promise<{ status?: number, message?: string, userName?: string, password?: string, userProps?: any } | void>,
    loginExeption?: (p: { user: any, token: string }) => Promise<{ status?: number, message?: string, user?: any } | void>
};
type I_row = { [key: string]: any }
type I_getModel = (key: string) => Model<any>
export type I_entity = { schema?: I_schemaDefinition | string, path?: string, requiredToken?: boolean, apis: I_api[] };
export type I_entities = { [entityName: string]: I_entity }
export type I_api = {
    path: string,
    method: 'post' | 'get' | 'put' | 'delete',
    body?: I_schemaDefinition | I_schemaDefinitionOption | string, errorResult: any, successResult: string | I_schemaDefinition | I_schemaDefinitionOption, description: string, queryParam?: string, getResult: string,
    checkAccess?:(reqUser:any,body:any)=>Promise<void | string | {[key:string]:any}>
    fn: (p: { req: Request, res: Response, reqUser: any, body: any,accessBody:any }) => Promise<{status:number,success:boolean,message?:string,value?:any}>
};
type I_setResult = (p: { res: Response, status: number, message: string, success: boolean, value?: any }) => any
type I_schemas = { [key: string]: (I_schemaDefinition | I_schemaDefinitionOption) }
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
    getRow: I_getRow;
    getRows: I_getRows;
    addRow: I_addRow;
    editRow: I_editRow;
    addOrEditRow: I_addOrEditRow;
    editRows: I_editRows;
    removeRow: I_removeRow;
    removeRows: I_removeRows;
    getUser: (p: { id?: any, search?: I_row, req?: Request }) => Promise<null | I_User | string>;
    getUsers: (p: { ids?: any[], search?: I_row }) => Promise<I_User[] | string>;
    addUser: (p: { newValue: I_User }) => Promise<I_User | string>
    editUser: (p: { id: any, newValue: Partial<I_User> }) => Promise<I_User | string>
    editUsers: (p: { ids?: any[], search?: Partial<I_User>, newValue?: Partial<I_User> }) => Promise<string | number>
    removeUser: (p: { id?: any, search?: Partial<I_User> }) => Promise<I_User | string>
    removeUsers: (p: { ids?: any[], search?: Partial<I_User> }) => Promise<number | string>
    changeUserPassword:(p: { userPassword: string, oldPassword: string, newPassword: string,userId:string })=> Promise<true | string>
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
        this.gcrud = new GCRUD({ getModel: this.getModel })
        this.getRow = this.gcrud.getRow;
        this.getRows = this.gcrud.getRows;
        this.addRow = this.gcrud.addRow;
        this.editRow = this.gcrud.editRow;
        this.addOrEditRow = this.gcrud.addOrEditRow;
        this.editRows = this.gcrud.editRows;
        this.removeRow = this.gcrud.removeRow;
        this.removeRows = this.gcrud.removeRows;
        this.getUser = async (p) => {
            if (!this.AuthModel) { return 'auth model is not set' }
            if (p.req) { return await this.getUserByReq(p.req) }
            const res = await this.getRow({ model: this.AuthModel, ...p })
            return res === null || typeof res === 'string' ? res : res as I_User
        }
        this.getUsers = async (p) => {
            if (!this.AuthModel) { return 'auth model is not set' }
            const res = await this.getRows({ model: this.AuthModel, ...p })
            return typeof res === 'string' ? res : res as I_User[]
        }
        this.addUser = async (p) => {
            if (!this.AuthModel) { return 'auth model is not set' }
            const newValue:any = p.newValue;
            const hashedPassword = await bcrypt.hash(newValue.password , 10);
            newValue.password = hashedPassword;
            const res = await this.addRow({ model: this.AuthModel, newValue })
            return typeof res === 'string' ? res : res as I_User
        }
        this.editUser = async (p) => {
            if (!this.AuthModel) { return 'auth model is not set' }
            const res = await this.editRow({ model: this.AuthModel, newValue: p.newValue as I_row, id: p.id })
            return typeof res === 'string' ? res : res as I_User
        }
        this.editUsers = async (p) => {
            if (!this.AuthModel) { return 'auth model is not set' }
            return await this.editRows({ model: this.AuthModel, ...p, newValue: p.newValue as I_row })
        }
        this.removeUser = async (p) => {
            if (!this.AuthModel) { return 'auth model is not set' }
            const res = await this.removeRow({ model: this.AuthModel, ...p })
            return typeof res === 'string' ? res : res as I_User
        }
        this.removeUsers = async (p) => {
            if (!this.AuthModel) { return 'auth model is not set' }
            return await this.removeRows({ model: this.AuthModel, ...p })
        }
        this.changeUserPassword = async (p)=>{
            try{
                const newPasswrod = await this.getNewPassword(p);
                if(newPasswrod === false){return 'old password is not match'}
                const newValue:any = {password:newPasswrod}
                const res = await this.editUser({id:p.userId,newValue})
                if(typeof res === 'string'){return res}
                else {return true}
            }
            catch(err:any){return err.message}
        }
    }
    log = (message: string, color?: 'green' | 'red' | 'yellow') => {
        if (color === "green") { console.log('\x1b[32m%s\x1b[0m', message) }
        else if (color === "yellow") { console.log('\x1b[33m%s\x1b[0m', message) }
        else if (color === "red") { console.log('\x1b[31m%s\x1b[0m', message) }
        else { console.log(message) }
    }
    getModel: I_getModel = (key) => this.models[key]
    fixPath = (path: string) => path[0] !== '/' ? `/${path}` : path
    start = () => {
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
        this.app.listen(this.env.port, () => { console.log(`Server running on port ${this.env.port}`) });
    };

    connectToMongoose = () => {
        const url: string = this.env.mongoUrl;
        mongoose
            .connect(url)
            .then(() => console.log('MongoDB connected'))
            .catch((err: any) => console.log(err));
    };
    getTotal = async (name: string): Promise<number> => await this.getModel(name).countDocuments({})
    getNewPassword = async (p: { userPassword: string, oldPassword: string, newPassword: string }): Promise<string | false> => {
        const isMatch = await bcrypt.compare(p.oldPassword, p.userPassword);
        if (!isMatch) { return false }
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
                        if (exep.user) { user = exep.user }
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
                jwt.verify(token, this.env.secretKey as string, (err: any, decoded: any) => {
                    if (err) { return this.setResult({ res, message: 'Token is invalid', success: false, status: 401 }) }
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
        for (let prop in entities) { this.addEntity(entities[prop], prop) }
    }
    private addEntity = (entity: I_entity, name: string) => {
        const { schema, apis, requiredToken = true } = entity;
        const dicName = requiredToken ? 'tokenBaseDic' : 'tokenLessDic';
        this[dicName][name] = this.fixPath(entity.path || `/${name}`);
        if (schema) {
            try {
                const entitySchema = this.AIOSchemaInstance.getSchema(this.getSchemaDefinition(schema, name));
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
                const { path, method, fn } = api;
                this.routers[name][method](this.fixPath(path), async (req: Request, res: Response) => {
                    try {
                        const reqUser = await this.getUserByReq(req);
                        if (reqUser === null) { return this.setResult({ res, success: false, message: 'req user not found', status: 401 }) }
                        let body: any = {...(req.body || {})};
                        if (method === 'post' && !api.body) { return this.setResult({ status: 403, success: false, message: 'missing api.body in backend app', res }) }
                        if (api.body) {
                            let scm;
                            if (typeof api.body === 'string') { scm = this.schemas[api.body] }
                            else { scm = api.body }
                            let message = this.AIOSchemaInstance.validateObjectBySchema(scm, '', req.body);
                            if (typeof message === 'string') {
                                message = `in request body : ${message}`
                                return this.setResult({ status: 400, success: false, message, res })
                            }
                        }
                        if (typeof reqUser === 'string') { return { success: false, message: reqUser, status: 403 } }
                        let accessBody;
                        if(api.checkAccess){
                            let result = await api.checkAccess(reqUser,body);
                            if(typeof result === 'string'){return res.status(403).json({ message: result, success: false });}
                            else if(result){
                                accessBody = result
                            }
                        }
                        const result = await fn({ req, res, reqUser, body,accessBody })
                        return this.setResult({ ...result, res,message:result.message || '' })
                    }
                    catch (err: any) { return res.status(500).json({ message: err.message, success: false }); }
                });
            }
        }
        catch (err: any) {
            console.error(`Error creating router for entity ${name}:`, err.message);
        }
    };
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
type I_GCRUD = {
    getModel: I_getModel
}
type I_getRow = (p: { model?: Model<any>, entityName?: string, search?: I_row, id?: any }) => Promise<null | I_row | string>
type I_getRows = (p: { model?: Model<any>, entityName?: string, search?: I_row, ids?: any[] }) => Promise<I_row[] | string>
type I_addRow = (p: { model?: Model<any>, entityName?: string, newValue: I_row }) => Promise<I_row | string>
type I_editRow = (p: { model?: Model<any>, entityName?: string, id?: any, search?: I_row, newValue: I_row }) => Promise<string | I_row>
type I_addOrEditRow = (p: { model?: Model<any>, entityName?: string; id?: any, search?: I_row, newValue: I_row }) => Promise<string | I_row>
type I_editRows = (p: { model?: Model<any>, entityName?: string; search?: I_row; ids?: any[]; newValue: I_row }) => Promise<string | number>
type I_removeRow = (p: { model?: Model<any>, entityName?: string; search?: I_row; id?: string }) => Promise<string | I_row>
type I_removeRows = (p: { model?: Model<any>, entityName?: string; search?: I_row; ids?: any[] }) => Promise<string | number>
class GCRUD {
    getModel: I_getModel;
    constructor(p: I_GCRUD) { this.getModel = p.getModel }
    getModelByP = async (p: any) => p.model ? p.model : await this.getModel(p.entityName)
    fixId = (row: any) => {
        if (typeof row === 'object' && !Array.isArray(row) && row !== null) { row.id = row._id; }
        return row
    }
    getRow: I_getRow = async (p) => {
        try {
            const model = await this.getModelByP(p);
            if (p.id) { const res: I_row | null = await model.findById(p.id); return this.fixId(res) }
            else if (p.search) { const res: I_row | null = await model.findOne(p.search); return this.fixId(res) }
            else { return `Error in get row: please send search object or id for search` }
        }
        catch (error: any) { return `Error in get row: ${error.message}`; }
    }
    getRows: I_getRows = async (p) => {
        try {
            const model = await this.getModelByP(p);
            if (p.ids && p.ids.length > 0) { return await model.find({ _id: { $in: p.ids } }); }
            if (p.search) {
                const res = await model.find(p.search);
                return res.map((o: I_row) => this.fixId(o))
            }
            return [];
        }
        catch (error: any) { return `Error in getRows: ${error.message}`; }
    }
    addRow: I_addRow = async (p) => {
        try {
            let model, newRecord;
            try { model = await this.getModelByP(p); newRecord = new model(p.newValue); }
            catch (err: any) { return err.message }
            const res = await newRecord.save().catch((err: any) => `Error in adding row : ${err}`);
            const result = this.fixId(res)
            return result
        }
        catch (error: any) { return `Error in adding row: ${error.message}`; }
    }
    editRow: I_editRow = async (p) => {
        try {
            const model = await this.getModelByP(p);
            const exist = await this.getRow(p);
            if (exist === null) { return 'Record not found'; }
            if (typeof exist === 'string') { return exist }
            for (let prop in p.newValue) {
                if (prop === 'id' || prop === '_id') { continue }
                exist[prop] = p.newValue[prop]
            }
            const updatedRecord = await model.findByIdAndUpdate(exist.id, exist, { new: true });
            if (!updatedRecord) { return 'Record not found'; }
            return this.fixId(updatedRecord);
        }
        catch (error: any) { throw new Error(`Error updating record: ${error.message}`); }
    }
    addOrEditRow: I_addOrEditRow = async (p) => {
        try {
            const model = await this.getModelByP(p);
            let existingRecord;
            if (p.id !== undefined) { existingRecord = await model.findById(p.id); }
            else if (p.search) { existingRecord = await model.findOne(p.search); }
            else { return 'addOrEditRow should get id our search object as parameter' }
            if (existingRecord !== null) {
                const updatedRecord = await model.findByIdAndUpdate(existingRecord._id, p.newValue, { new: true });
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
    editRows: I_editRows = async (p) => {
        try {
            const model = await this.getModelByP(p);
            let query;
            if (p.ids && p.ids.length > 0) { query = { _id: { $in: p.ids } }; }
            else { query = p.search; }
            const result = await model.updateMany(query, { $set: p.newValue });
            if (result.modifiedCount === 0) { return 'No records found to update'; }
            return result.modifiedCount; // تعداد رکوردهای ویرایش شده
        }
        catch (error: any) { throw new Error(`Error updating records: ${error.message}`); }
    }
    removeRow: I_removeRow = async (p) => {
        try {
            const model = await this.getModelByP(p);
            let query;
            if (p.id) { query = { _id: p.id }; }
            else if (p.search) { query = p.search; }
            else { return 'No criteria provided for deletion'; }
            const deletedRecord = await await model.findOneAndDelete(query);
            if (!deletedRecord) { return 'Record not found'; }
            return this.fixId(deletedRecord);
        }
        catch (error: any) { throw new Error(`Error deleting record: ${error.message}`); }
    }
    removeRows: I_removeRows = async (p) => {
        try {
            const model = await this.getModelByP(p);
            let query;
            if (p.ids && p.ids.length > 0) { query = { _id: { $in: p.ids } }; }
            else { query = p.search; }
            const result = await model.deleteMany(query);
            if (result.deletedCount === 0) { return 'No records found to delete'; }
            return result.deletedCount;
        }
        catch (error: any) { throw new Error(`Error deleting records: ${error.message}`); }
    }
}
export type I_Date = string | number | Date | I_dateObject | number[];
type I_dateObject = { year?: number, month?: number, day?: number, hour?: number, minute?: number };

export class AIODate {
    isMatch: (date: I_Date, matchers: string[]) => boolean;
    convertToArray: (date: I_Date, jalali?: boolean) => number[];
    isLess: (date1: I_Date, date2: I_Date) => boolean;
    isGreater: (date1: I_Date, date2: I_Date) => boolean;
    isEqual: (date1: I_Date, date2: I_Date) => boolean;
    isBetween: (date1: I_Date, dates: [I_Date, I_Date]) => boolean;
    compaire: (date1: I_Date, date2: I_Date) => 'less' | 'greater' | 'equal';
    getWeekDay: (date: I_Date) => { weekDay: string, index: number }
    isToday: (date: I_Date) => boolean;
    isJalali: (date: I_Date) => boolean;
    getWeekDays: (jalali?: boolean) => string[];
    toGregorian: (date: I_Date) => number[];
    toJalali: (date: I_Date) => number[];
    pattern: (date: I_Date, pattern: string, jalali?: boolean) => string;
    get2Digit: (n: number) => string;
    getMonths: (jalali?: boolean) => string[];
    getSplitter: (value: string) => string;
    getTime: (date: I_Date, jalali?: boolean) => number;
    getNextTime: (date: I_Date, offset: number, jalali?: boolean) => number[];
    getMonthDaysLength: (date: I_Date) => number;
    getYearDaysLength: (date: I_Date) => number;
    getDaysOfWeek: (date: I_Date, pattern?: string) => any[];
    getDatesBetween: (date: I_Date, otherDate: any, step?: number) => any[];
    getDelta: (date: I_Date, otherDate?: I_Date, unit?: 'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond') => { day: number, hour: number, minute: number, second: number, tenthsecond: number, miliseconds: number, type: 'remaining' | 'passed' | 'now' };
    convertMiliseconds: (miliseconds: number, unit?: 'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond') => { day: number, hour: number, minute: number, second: number, tenthsecond: number, miliseconds: number, type: 'remaining' | 'passed' | 'now' };
    getDaysOfMonth: (date: I_Date, pattern?: string) => any[];
    getLastDayOfMonth: (date: I_Date) => any[];
    getDateByPattern: (date: I_Date, pattern: string) => string;
    getToday: (jalali?: boolean) => number[];
    getDayIndex: (date: I_Date, unit: 'week' | 'year' | 'month') => number;
    getYesterday: (date: I_Date) => I_Date
    getTomarrow: (date: I_Date) => I_Date
    toMiliseconds: (p: { year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number }) => number
    getDateByDeltaMiliseconds: (date: I_Date, miliseconds: number) => number[]
    constructor() {
        this.toMiliseconds = (p) => {
            const { day = 0, hour = 0, minute = 0, second = 0 } = p;
            let res = 0;
            res += day * 24 * 60 * 60 * 1000;
            res += hour * 60 * 60 * 1000;
            res += minute * 60 * 1000;
            res += second * 1000;
            return res
        }
        this.isMatch = (date, matchers) => {
            date = this.convertToArray(date)
            for (let i = 0; i < matchers.length; i++) {
                let matcher = matchers[i], type, targets;
                try {
                    let a = matcher.split(',');
                    type = a[0];
                    targets = a.slice(1, a.length);
                }
                catch { return false }
                if (type === '<') { for (let i = 0; i < targets.length; i++) { if (this.isLess(date, targets[i])) { return true } } }
                else if (type === '>') { for (let i = 0; i < targets.length; i++) { if (this.isGreater(date, targets[i])) { return true } } }
                else if (type === '<=') { for (let i = 0; i < targets.length; i++) { if (this.isEqual(date, targets[i])) { return true } if (this.isLess(date, targets[i])) { return true } } }
                else if (type === '>=') { for (let i = 0; i < targets.length; i++) { if (this.isEqual(date, targets[i])) { return true } if (this.isGreater(date, targets[i])) { return true } } }
                else if (type === '=') { for (let i = 0; i < targets.length; i++) { if (this.isEqual(date, targets[i])) { return true } } }
                else if (type === '!=') { for (let i = 0; i < targets.length; i++) { if (!this.isEqual(date, targets[i])) { return true } } }
                else if (type === '<>') {
                    if (targets[0] && targets[1]) {
                        let start, end;
                        if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                        else { start = targets[1]; end = targets[0]; }
                        if (this.isGreater(date, start) && this.isLess(date, end)) { return true }
                    }
                }
                else if (type === '<=>') {
                    if (targets[0] && targets[1]) {
                        let start, end;
                        if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                        else { start = targets[1]; end = targets[0]; }
                        if (this.isGreater(date, start) && this.isLess(date, end)) { return true }
                        if (this.isEqual(date, start) || this.isEqual(date, end)) { return true }
                    }
                }
                else if (type === '!<>') {
                    if (targets[0] && targets[1]) {
                        let start, end;
                        if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                        else { start = targets[1]; end = targets[0]; }
                        if (!this.isGreater(date, start) || !this.isLess(date, end)) { return true }
                    }
                }
                else if (type === '!<=>') {
                    if (targets[0] && targets[1]) {
                        let start, end;
                        if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                        else { start = targets[1]; end = targets[0]; }
                        if (!this.isEqual(date, start) && !this.isEqual(date, end) && (this.isLess(date, start) || this.isGreater(date, end))) { return true }
                    }
                }
                else if (type === 'w') {
                    let w = this.getWeekDay(date).index;
                    for (let i = 0; i < targets.length; i++) { if (w === +targets[i]) { return true } }
                }
                else if (type === '!w') {
                    let w = this.getWeekDay(date).index;
                    for (let i = 0; i < targets.length; i++) { if (w !== +targets[i]) { return true } }
                }
            }
            return false
        }
        this.convertToArray = (date, jalali) => {
            if (!date) { return [] }
            let list;
            if (Array.isArray(date)) { list = [...date] }
            else if (typeof date === 'string') {
                if (date.indexOf("T") !== -1) {
                    //"2015-03-25T12:00:00Z"
                    let [d1, t1] = date.split("T");
                    let t2 = t1.split(".")[0];
                    let t3 = t2.split(':');
                    let d2 = d1.split('-');
                    list = [...d2.map((o) => +o), ...t3.map((o) => +o), 0]
                }
                else {
                    list = date.split(this.getSplitter(date)).map((o) => +o);
                }
            }
            else if (typeof date === 'number') {
                let d = new Date(date);
                let year = d.getFullYear();
                let month = d.getMonth() + 1;
                let day = d.getDate();
                let hour = d.getHours();
                let minute = d.getMinutes();
                let second = d.getSeconds();
                let miliseconds = d.getMilliseconds();
                let tenthsecond = Math.round(miliseconds / 100);
                list = [year, month, day, hour, minute, second, tenthsecond]
            }
            else if (typeof date === 'object') {
                if (typeof (date as Date).getMonth === 'function') {
                    let dateObject = date as Date;
                    let year = dateObject.getFullYear();
                    let month = dateObject.getMonth() + 1;
                    let day = dateObject.getDate();
                    let hour = dateObject.getHours();
                    let minute = dateObject.getMinutes();
                    let second = dateObject.getSeconds();
                    let miliseconds = dateObject.getMilliseconds();
                    let tenthsecond = Math.round(miliseconds / 100);
                    list = [year, month, day, hour, minute, second, tenthsecond]
                }
                else {
                    let today = this.getToday(jalali);
                    let dateObject = date as { year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number }
                    return [
                        dateObject.year === undefined ? today[0] : dateObject.year,
                        dateObject.month === undefined ? today[1] : dateObject.month,
                        dateObject.day === undefined ? today[2] : dateObject.day,
                        dateObject.hour === undefined ? today[3] : dateObject.hour,
                        dateObject.minute === undefined ? today[4] : dateObject.minute,
                        dateObject.second === undefined ? today[5] : dateObject.second,
                    ]
                }
            }
            else { return [] }
            if (jalali) {
                let [year, month, day] = this.toJalali([list[0], list[1], list[2]]);
                list[0] = year; list[1] = month; list[2] = day;
            }
            return list
        }
        this.compaire = (o1, o2) => {
            o1 = this.convertToArray(o1);
            o2 = this.convertToArray(o2);
            let compaireKey: 'equal' | 'less' | 'greater' = 'equal';
            for (let i = 0; i < o1.length; i++) {
                if (isNaN(o2[i])) { o2[i] = o1[i] }
                let a = o1[i];
                let b = o2[i] || 0;
                if (a < b) { compaireKey = 'less'; break; }
                if (a > b) { compaireKey = 'greater'; break; }
            }
            return compaireKey;
        }
        this.isLess = (o1, o2) => this.compaire(o1, o2) === 'less'
        this.isEqual = (o1, o2) => this.compaire(o1, o2) === 'equal'
        this.isGreater = (o1, o2) => this.compaire(o1, o2) === 'greater'
        this.isBetween = (o1, [o2, o3]) => this.compaire(o1, o2) === 'greater' && this.compaire(o1, o2) === 'less'
        this.isToday = (date) => this.isEqual(date, this.getToday(this.isJalali(date)))
        this.getDateByDeltaMiliseconds = (date: I_Date, miliseconds: number) => this.convertToArray(this.getTime(date) + miliseconds)
        this.getWeekDay = (date) => {
            let dateArray = this.convertToArray(date);
            let jalali = this.isJalali(dateArray);
            dateArray = this.toGregorian(date) as number[]
            let index = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).getDay();
            if (jalali) {
                index += 1;
                index = index % 7;
            }
            return { weekDay: this.getWeekDays(jalali)[index], index };
        }
        this.isJalali = (date) => { return this.convertToArray(date)[0] < 1700 ? true : false }
        this.getWeekDays = (jalali) => {
            return [
                ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
                ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
            ][jalali ? 0 : 1]
        }
        this.toGregorian = (date) => {
            if (!date) { return [] }
            let arr = this.convertToArray(date);
            let jalali = this.isJalali(arr);
            if (!jalali) { return arr }
            let [jy, jm, jd] = arr;
            var sal_a, gy, gm, gd, days;
            jy += 1595; days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
            gy = 400 * ~~(days / 146097); days %= 146097;
            if (days > 36524) { gy += 100 * ~~(--days / 36524); days %= 36524; if (days >= 365) days++; }
            gy += 4 * ~~(days / 1461); days %= 1461;
            if (days > 365) { gy += ~~((days - 1) / 365); days = (days - 1) % 365; }
            gd = days + 1;
            sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
            arr[0] = gy; arr[1] = gm; arr[2] = gd;
            return arr;
        }
        this.pattern = (date, pattern, jalali = this.isJalali(date)) => {
            date = this.convertToArray(date, jalali);
            let [year, month, day, hour, minute, second, tenthsecond] = date;
            pattern = pattern.replace('{year}', year.toString());
            if (typeof month === 'number') { pattern = pattern.replace('{month}', this.get2Digit(month)); }
            if (typeof day === 'number') { pattern = pattern.replace('{day}', this.get2Digit(day)); }
            if (typeof hour === 'number') { pattern = pattern.replace('{hour}', this.get2Digit(hour)); }
            if (typeof minute === 'number') { pattern = pattern.replace('{minute}', this.get2Digit(minute)); }
            if (typeof second === 'number') { pattern = pattern.replace('{second}', this.get2Digit(second)); }
            if (typeof tenthsecond === 'number') { pattern = pattern.replace('{tenthsecond}', this.get2Digit(tenthsecond)); }
            if (pattern.indexOf('{monthString}') !== -1) {
                pattern = pattern.replace('{monthString}', this.getMonths(jalali)[month - 1]);
            }
            if (pattern.indexOf('{weekDay}') !== -1) {
                let weekDays = this.getWeekDays(jalali);
                let { index } = this.getWeekDay(date);
                pattern = pattern.replace('{weekDay}', weekDays[index]);
            }
            return pattern
        }
        this.get2Digit = (n: number) => {
            let ns: string;
            try { ns = n.toString() }
            catch { return n.toString() }
            if (ns.length === 1) { ns = '0' + n }
            return ns
        }
        this.getMonths = (jalali) => {
            return [
                ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',],
                ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
            ][jalali ? 0 : 1]
        }
        this.toJalali = (date) => {
            let arr = this.convertToArray(date);
            let jalali = this.isJalali(arr);
            if (jalali) { return arr }
            let [gy, gm, gd] = arr;
            var g_d_m, jy, jm, jd, gy2, days;
            g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            gy2 = (gm > 2) ? (gy + 1) : gy;
            days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
            jy = -1595 + (33 * ~~(days / 12053)); days %= 12053; jy += 4 * ~~(days / 1461); days %= 1461;
            if (days > 365) { jy += ~~((days - 1) / 365); days = (days - 1) % 365; }
            if (days < 186) { jm = 1 + ~~(days / 31); jd = 1 + (days % 31); } else { jm = 7 + ~~((days - 186) / 30); jd = 1 + ((days - 186) % 30); }
            arr[0] = jy; arr[1] = jm; arr[2] = jd;
            return arr;
        }
        this.getSplitter = (value) => {
            let splitter = '/';
            for (let i = 0; i < value.length; i++) { if (isNaN(parseInt(value[i]))) { return value[i] } }
            return splitter;
        }
        this.getTime = (date, jalali = this.isJalali(date)) => {
            if (!date) { return 0 }
            if (typeof date === 'number') { return date }
            date = this.convertToArray(date);
            let [year, month = 1, day = 1, hour = 0, minute = 0, second = 0, tenthsecond = 0] = date;
            if (jalali) { date = this.toGregorian([year, month, day, hour, minute, second, tenthsecond]) }
            let time = new Date(date[0], date[1] - 1, date[2]).getTime()
            time += hour * 60 * 60 * 1000; time += minute * 60 * 1000; time += second * 1000; time += tenthsecond * 100;
            return time;
        }
        this.getNextTime = (date, offset, jalali = this.isJalali(date)) => {
            if (!offset) { return this.convertToArray(date) }
            let time: number = this.getTime(date, jalali);
            time += offset;
            let dateArray: number[] = this.convertToArray(time);
            if (jalali) {
                let [jy, jm, jd] = this.toJalali(dateArray);
                dateArray[0] = jy; dateArray[1] = jm; dateArray[2] = jd;
            }
            return dateArray;
        }
        this.getMonthDaysLength = (date) => {
            if (!date) { return 0 }
            let [year, month] = this.convertToArray(date);
            let jalali = this.isJalali([year, month]);
            if (jalali) { return [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, [1, 5, 9, 13, 17, 22, 26, 30].indexOf(year % 33) === -1 ? 29 : 30][month - 1] }
            else { return new Date(year, month - 1, 0).getDate(); }
        }
        this.getYearDaysLength = (date) => {
            if (!date) { return 0 }
            let [year] = this.convertToArray(date), res = 0;
            for (let i = 1; i <= 12; i++) { res += this.getMonthDaysLength([year, i]) }
            return res
        }
        this.getYesterday = (date) => {
            const [year, month, day] = this.convertToArray(date);
            let newYear = year, newMonth = month, newDay = day;
            if (day === 1) {
                if (month === 1) { newYear = newYear - 1; newMonth = 12; newDay = this.getMonthDaysLength([newYear, newMonth]) }
                else { newMonth = newMonth - 1; newDay = this.getMonthDaysLength([newYear, newMonth]) }
            }
            else { newDay = newDay - 1 }
            return [newYear, newMonth, newDay]
        }
        this.getTomarrow = (date) => {
            const [year, month, day] = this.convertToArray(date);
            let newYear = year, newMonth = month, newDay = day;
            const daysLength = this.getMonthDaysLength(date)
            if (day === daysLength) {
                if (month === 12) { newYear = newYear + 1; newMonth = 1; newDay = 1 }
                else { newMonth = newMonth + 1; newDay = 1 }
            }
            else { newDay = newDay + 1 }
            return [newYear, newMonth, newDay]
        }
        this.getDaysOfWeek = (date, pattern) => {
            if (!date) { return [] }
            let dateArray = this.convertToArray(date);
            let { index } = this.getWeekDay(dateArray);
            let firstDay: I_Date = [...dateArray];
            for (let i = 0; i < index; i++) {
                firstDay = this.getYesterday(firstDay);
            }
            const res: I_Date[] = [];
            for (let i = 0; i < 7; i++) {
                res.push(firstDay)
                firstDay = this.getTomarrow(firstDay)
            }
            if (pattern) { return res.map((o) => this.getDateByPattern(o, pattern)) }
            return res
        }
        this.getDatesBetween = (date, otherDate, step = 24 * 60 * 60 * 1000) => {
            if (!date || !otherDate) { return [] }
            date = this.convertToArray(date);
            otherDate = this.convertToArray(otherDate);
            if (!this.isGreater(otherDate, date)) { return [] }
            let delta = this.getDelta(date, otherDate) as { miliseconds: number };
            let length = delta.miliseconds / step;
            if (isNaN(length) || length > 1000) {
                console.error('AIODate().getDatesBetween() => too many dates');
                return [];
            }
            let nextDate = this.getNextTime(date, step);
            let res = [];
            while (this.isLess(nextDate, otherDate)) {
                res.push(nextDate);
                nextDate = this.getNextTime(nextDate, step);
            }
            return res
        }
        this.getDelta = (date, otherDate, unit) => {
            let dif = this.getTime(date) - this.getTime(otherDate || this.getToday());
            return this.convertMiliseconds(-dif, unit)
        }
        this.convertMiliseconds = (miliseconds = 0, unit = 'day') => {
            let type: 'remaining' | 'passed' | 'now';
            if (miliseconds < 0) { type = 'passed'; miliseconds = -miliseconds }
            else if (miliseconds > 0) { type = 'remaining' }
            else { type = 'now' }
            let index = ['day', 'hour', 'minute', 'second', 'tenthsecond', 'milisecond'].indexOf(unit);
            let day = 0, hour = 0, minute = 0, second = 0, tenthsecond = 0;
            let dif = miliseconds;
            if (index <= 0) {
                day = Math.floor(dif / (24 * 60 * 60 * 1000));
                dif -= day * (24 * 60 * 60 * 1000);
            }
            if (index <= 1) { hour = Math.floor(dif / (60 * 60 * 1000)); dif -= hour * (60 * 60 * 1000); }
            if (index <= 2) { minute = Math.floor(dif / (60 * 1000)); dif -= minute * (60 * 1000); }
            if (index <= 3) { second = Math.floor(dif / (1000)); dif -= second * (1000); }
            if (index <= 4) { tenthsecond = Math.floor(dif / (100)); }
            return { day, hour, minute, second, tenthsecond, miliseconds, type }
        }
        this.getDaysOfMonth = (date, pattern) => {
            if (!date) { return [] }
            let dateArray = this.convertToArray(date);
            let daysLength = this.getMonthDaysLength(date)
            let firstDay: I_Date = [dateArray[0], dateArray[1], 1];
            let res: I_Date[] = []
            for (let i = 0; i < daysLength; i++) { res.push(firstDay); firstDay = this.getTomarrow(firstDay); }
            if (pattern) { return res.map((o) => this.getDateByPattern(o, pattern)) }
            return res
        }
        this.getLastDayOfMonth = (date) => {
            let dateArray: number[] = this.convertToArray(date);
            let length = this.getMonthDaysLength(dateArray);
            let lastDay = [dateArray[0], dateArray[1], length];
            return lastDay
        }
        this.getDateByPattern = (date, pattern) => this.pattern(date, pattern)
        this.getToday = (jalali) => {
            let date = new Date();
            let dateArray: number[] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), Math.round(date.getMilliseconds() / 100)]
            if (jalali) { dateArray = this.toJalali(dateArray) as number[] }
            return dateArray;
        }
        this.getDayIndex = (date, unit) => {
            date = this.convertToArray(date);
            if (unit === 'week') {
                let days = this.getDaysOfWeek(date);
                for (let i = 0; i < days.length; i++) {
                    let [year, month, day] = days[i];
                    if (year !== date[0] || month !== date[1] || day !== date[2]) { continue }
                    return i;
                }
            }
            if (unit === 'month') { return date[2] - 1; }
            if (unit === 'year') {
                let res = 0;
                for (let i = 0; i < date[1] - 1; i++) { res += this.getMonthDaysLength(date) }
                res += date[1]; return res - 1
            }
            return 0
        }
    }
}
export function SplitNumber(price: number, count?: number, splitter?: string): string {
    if (!price) { return '' }
    count = count || 3;
    splitter = splitter || ',';
    let str = price.toString()
    let dotIndex = str.indexOf('.');
    if (dotIndex !== -1) {
        str = str.slice(0, dotIndex)
    }
    let res = ''
    let index = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        res = str[i] + res;
        if (index === count - 1) {
            index = 0;
            if (i > 0) { res = splitter + res; }
        }
        else { index++ }
    }
    return res
}
function toRadians(degree: number) {
    return degree * (Math.PI / 180);
}
export function CalculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
export function GetArray(count: number, fn?: (index: number) => any) {
    fn = fn || ((index) => index)
    return new Array(count).fill(0).map((o, i) => { if (fn) return fn(i) })
}
export function GetRandomNumber(from: number, to: number) { return from + Math.round(Math.random() * (to - from)) }

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
    getSchemaType = (type: I_schemaType): I_getSchemaType => {
        if (type === 'string') return String;
        else if (type === 'number') return Number;
        else if (type === 'boolean') return Boolean;
        else if (type === 'date') return Date;
        else if (type === 'map') return Map;
        else if (typeof type === 'string') { return this.getSchemaType(this.schemas[type] as I_schemaDefinition) }
        else if (Array.isArray(type)) return this.getSchemaType(type[0]);
        else return this.getSchema(type);
    }
    getSchema = (scm: I_schemaDefinition): I_schema => {
        const { dif } = this.getSchemaByRefrence(scm);
        const schemaDefinition = dif as I_schemaDefinition;
        try {
            const fields: any = {};
            Object.keys(schemaDefinition).forEach(fieldKey => {
                let h = this.getSchemaByRefrence(schemaDefinition[fieldKey]);
                const dif = h.dif as I_schemaDefinitionOption;
                let mongooseSchema: any = {
                    type: this.getSchemaType(dif.type),
                    required: !!dif.required,
                    unique: !!dif.unique,
                };
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
            console.error(`generate schema error by schemaDefinition =>`, schemaDefinition);
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
        if (value !== undefined && !this.isValidType(value, sdo.type as 'string' | 'number' | 'boolean' | 'date')) {
            return `property "${key}" is not of type ${sdo.type}, value is ${JSON.stringify(value, null, 3)}`;
        }
    }
    isValidType = (value: any, schemaType: 'string' | 'number' | 'boolean' | 'date'): boolean => {
        switch (schemaType) {
            case 'string': return typeof value === 'string';
            case 'number': return typeof value === 'number';
            case 'boolean': return typeof value === 'boolean';
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
    simpleTypeToTS = (type: 'string' | 'number' | 'boolean' | 'date', required: boolean): { success: boolean, result: string } => {
        switch (type) {
            case 'string': return { success: true, result: 'string' + (required ? '' : ' | undefined') };
            case 'number': return { success: true, result: 'number' + (required ? '' : ' | undefined') };
            case 'boolean': return { success: true, result: 'boolean' + (required ? '' : ' | undefined') };
            case 'date': return { success: true, result: 'Date' + (required ? '' : ' | undefined') };
            default: return { success: true, result: 'any' + (required ? '' : ' | undefined') };
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
            if(!sdo.required){
                result = `(${result}) | undefined`
            }
            return { success: true, result }
        }
        if (['string', 'number', 'boolean', 'date'].indexOf(sdo.type) !== -1) {
            return this.simpleTypeToTS(sdo.type as any, !!sdo.required)
        }
        else {
            return this.schemaToTS(sdo.type)
        }
    }
    bodyParamToString = (api: I_api): { success: boolean, result: string } => {
        let res: string = ''
        if (api.body) {
            let scm;
            if (typeof api.body === 'string') { scm = this.schemas[api.body]; }
            else { scm = api.body }
            const { success, result } = this.schemaToTS(scm)
            if (!success) { return { success: false, result } }
            res = `body:${typeof api.body === 'string' ? api.body : result}`
        }
        if (api.queryParam) { res += `${res ? ',' : ''}${api.queryParam}`; }
        return { success: true, result: res };
    }
    getReturnTypeString = (api: I_api): { success: boolean, result: string } => {
        let scm;
        if (typeof api.successResult === 'string') { scm = this.schemas[api.successResult] }
        else { scm = api.successResult }
        const { success, result } = this.schemaToTS(scm);
        if (!success) { return { success: false, result } }
        return { success: true, result: `:Promise<${JSON.stringify(api.errorResult)} | ${typeof api.successResult === 'string' ? api.successResult : result}>` }
    }
    getMethodsString = (entities: I_entities): { success: boolean, result: string } => {
        let res = '';
        for (let name in entities) {
            const { apis } = entities[name];
            for (let api of apis) {
                const { method, errorResult, description, queryParam = '', getResult } = api;
                const path = api.path[0] !== '/' ? '/' + api.path : api.path;
                const apiName = name + path.replace(/\//g, '_')
                const bodyParamString = this.bodyParamToString(api);
                if (!bodyParamString.success) { return { success: false, result: bodyParamString.result } }
                const returnTypeString = this.getReturnTypeString(api);
                if (!returnTypeString.success) { return { success: false, result: returnTypeString.result } }
                res += `
    ${apiName} = async (${bodyParamString.result})${returnTypeString.result}=>{
        return await this.request({
            description:"${description}",method:"${method}",errorResult:${JSON.stringify(errorResult)},
            url:${"`${this.base_url}"}${name}${path}${queryParam}${"`"},
            getResult:${getResult},${!api.body ? '' : `\n            body`}
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
            getError: (response) => {
                if(response.status === 401 || response.data.status === 401){p.logout()}
                else if (response.data.success === false) { return response.data.message }
            }
        })
        this.request = inst.request;
    }
${methodsString.result}
}
        `
        return { success: true, result }
    }
}