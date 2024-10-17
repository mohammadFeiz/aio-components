import express, { NextFunction, Router, RequestHandler, Request, Response } from 'express';
import type { Express } from 'express';
import mongoose, { Model, SchemaType } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export type I_AIOExpress = { auth?: I_auth,env:NodeJS.ProcessEnv };
export type I_auth = {
    schema?: I_schema,
    path: string,
    tokenTime: { unit: 's' | 'm' | 'h' | 'd', value: number },
    registerExeption?: (p: { userName: string, password: string, userProps: any }) => Promise<{ status: number, message: string } | void>,
};
type I_row = { [key: string]: any }
type I_getModel = (key: string) => Model<any>
export type I_entity = { name: string, schema: I_schema, path: string, requiredToken?: boolean, apis: I_api[] };
export type I_schema = {
    [key: string]: {
        type: 'string' | 'boolean' | 'number' | 'date' | 'object', // اضافه شدن 'object' برای پشتیبانی از داده‌های تو در تو
        required?: boolean, // فیلد اجباری (پیش‌فرض: true)
        def?: any, // مقدار پیش‌فرض
        options?: any[], // enum یا مقادیر ممکن
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
};
export type I_virtuals = {
    [virtualField: string]: {
        get?: (this: any) => string,
        set?: (this: any) => string;
    }
}
export type I_api = { path: string, method: 'post' | 'get' | 'put' | 'delete', fn: (req: Request, res: Response,reqUser:any) => any };
type I_setResult = (p: { res: Response, status: number, message: string, success: boolean, value?: any }) => any
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
    constructor(p: I_AIOExpress) {
        this.p = p;
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
            const res = await this.addRow({ model: this.AuthModel, newValue: p.newValue as I_row })
            return typeof res === 'string' ? res : res as I_User
        }
        this.editUser = async (p) => {
            if (!this.AuthModel) { return 'auth model is not set' }
            const res = await this.editRow({ model: this.AuthModel, newValue: p.newValue as I_row, id: p.id })
            return typeof res === 'string' ? res : res as I_User
        }
        this.editUsers = async (p) => {
            if (!this.AuthModel) { return 'auth model is not set' }
            const res = await this.editRows({ model: this.AuthModel, ...p, newValue: p.newValue as I_row })
            return res
        }
        this.removeUser = async (p) => {
            if (!this.AuthModel) { return 'auth model is not set' }
            const res = await this.removeRow({ model: this.AuthModel, ...p })
            return typeof res === 'string' ? res : res as I_User
        }
        this.removeUsers = async (p) => {
            if (!this.AuthModel) { return 'auth model is not set' }
            const res = await this.removeRows({ model: this.AuthModel, ...p })
            return res
        }
    }
    getModel: I_getModel = (key) => this.models[key]
    addEntity = (entity: I_entity) => this.handleEntity(entity)
    start = () => {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(cookieParser() as RequestHandler);
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.connectToMongoose();

        if (this.AuthRouter && this.p.auth) {
            const { path } = this.p.auth;
            this.app.use(path, this.AuthRouter);
        }

        // Routes without token
        for (let name in this.tokenLessDic) { this.app.use(this.tokenLessDic[name], this.routers[name]) }
        // Middleware JWT
        this.app.use(this.jwt);
        // Routes with token
        for (let name in this.tokenBaseDic) { this.app.use(this.tokenBaseDic[name], this.routers[name]) }
        this.app.listen(this.p.env.PORT, () => {
            console.log(`Server running on port ${this.p.env.PORT}`);
        });
    };

    connectToMongoose = () => {
        const url:string = this.p.env.MONGO_URL as string;
        mongoose
            .connect(url)
            .then(() => console.log('MongoDB connected'))
            .catch((err: any) => console.log(err));
    };

    getSchema = (schemaObj: I_schema) => {
        const fields: any = {}; // برای نگه‌داری فیلدهای mongoose
        // پیمایش درون fields برای تعریف فیلدها
        Object.keys(schemaObj).forEach(fieldKey => {
            const fieldConfig = schemaObj[fieldKey];

            // تنظیمات فیلد برای mongoose
            let mongooseField: any = {
                type: { 'string': String, 'boolean': Boolean, 'number': Number, 'date': Date, 'object': mongoose.Schema.Types.Mixed }[fieldConfig.type],
                required: fieldConfig.required ?? true,
                default: fieldConfig.def,
                unique: fieldConfig.unique,
                enum: fieldConfig.options,
                minlength: fieldConfig.minLength,
                maxlength: fieldConfig.maxLength,
                min: fieldConfig.min,
                max: fieldConfig.max,
                index: fieldConfig.index,
            };
            if (fieldConfig.ref) mongooseField.ref = fieldConfig.ref;
            if (fieldConfig.validate) { mongooseField.validate = { validator: fieldConfig.validate, message: fieldConfig.errorMessage || 'Validation failed' } }
            // اضافه کردن فیلد به fields
            fields[fieldKey] = mongooseField;
        });
        // ساخت اسکیما با استفاده از فیلدهای تنظیم شده
        const schema = new mongoose.Schema(fields, {
            timestamps: true, // اضافه کردن زمان‌های create و update
            toJSON: { virtuals: true }, // فعال‌سازی فیلدهای مجازی در خروجی JSON
            toObject: { virtuals: true }, // فعال‌سازی فیلدهای مجازی در خروجی Object
        });

        return schema;
    }
    getTotal = async (name: string): Promise<number> => {
        const model = this.getModel(name);
        return await model.countDocuments({});
    }
    getNewPassword = async (p: { userPassword: string, oldPassword: string, newPassword: string }): Promise<string | false> => {
        const isMatch = await bcrypt.compare(p.oldPassword, p.userPassword);
        if (!isMatch) { return false }
        const hashedPassword: string = await bcrypt.hash(p.newPassword, 10);
        return hashedPassword
    }
    initJwt = (req: any, res: Response, next: NextFunction) => {
        if (!this.p.auth) { return }
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.', success: false });
        }
        jwt.verify(token, this.p.env.SECRET_KEY as string, (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token or token is expired.' });
            }
            req.user = decoded;
            next();
        });
    };
    getExpiresIn = (): string => {
        if (!this.p.auth) { return ''; }
        const { tokenTime } = this.p.auth;
        const { unit, value } = tokenTime;
        return `${value}${unit}`
    }
    handleAuth = () => {
        if (!this.p.auth) { return; }
        const { schema, registerExeption } = this.p.auth;
        const fields = schema?.fields || {}
        const scm: I_schema = {
            ...schema,
            password: { type: 'string', required: true },
            userName: { type: 'string', required: true, unique: true }
        }
        const authSchema = this.getSchema(scm);
        authSchema.methods.matchPassword = async function (enteredPassword: string) {
            return await bcrypt.compare(enteredPassword, this.password);
        };

        this.AuthModel = mongoose.model('Users', authSchema);

        // Register Route
        const registerFn: any = async (req: Request, res: Response): Promise<express.Response | void> => {
            if (!this.AuthModel) {
                return res.status(400).json({ message: 'class error 23423' });
            }
            const { userName, password, userProps } = req.body;
            try {
                const existingUser = await this.AuthModel.findOne({ userName });
                if (existingUser) {
                    return res.status(403).json({ message: 'User with this username already exists' });
                }
                if (!password || !userName) {
                    return res.status(403).json({ message: 'Missing username or password' });
                }
                let defModel: any = {};
                for (let prop in schema) {
                    if (prop === 'userName' || prop === 'password') continue;
                    const { required, def } = schema[prop];
                    if (required) {
                        if (userProps[prop] === undefined) {
                            return res.status(400).json({ message: `register missing ${prop}` });
                        }
                    }
                    let val = userProps[prop]
                    val = val === undefined ? def : val;
                    if (val !== undefined) { defModel[prop] = val; }
                }
                if (registerExeption) {
                    const exep = await registerExeption({ userName, password, userProps });
                    if (exep) {
                        const { status, message } = exep;
                        return res.status(status).json({ message, success: false });
                    }
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const userModel = { ...defModel, password: hashedPassword, userName };
                const newUser = new this.AuthModel(userModel);
                await newUser.save();
                return res.status(201).json({ message: 'User registered successfully', user: userModel });
            } catch (err: any) {
                return res.status(500).json({ message: 'Error registering user', error: err.message });
            }
        };
        this.AuthRouter.post('/register', registerFn);

        const loginFn: any = async (req: Request, res: Response) => {
            if (!this.AuthModel) { return; }
            const { userName, password } = req.body;
            try {
                const user = await this.AuthModel.findOne({ userName });
                if (!user || !(await user.matchPassword(password))) {
                    return res.status(400).json({ message: 'Invalid username or password' });
                }
                const secretKey: string = this.p.env.SECRET_KEY as string;
                const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: this.getExpiresIn() });
                return res.status(200).json({ message: 'Login successful', token, user });
            } catch (err: any) {
                return res.status(500).json({ message: 'Error logging in', error: err.message });
            }
        };

        // Login Route
        this.AuthRouter.post('/login', loginFn);
        this.AuthRouter.get('/checkToken', async (req: Request, res: Response) => {
            if (!this.p.auth) { return }
            try {
                const token = req.headers['authorization']?.split(' ')[1] || ''; // استخراج توکن از هدر
                jwt.verify(token, this.p.env.SECRET_KEY as string, (err: any, decoded: any) => {
                    if (err) { return this.setResult({ res, message: 'Token is invalid', success: false, status: 401 }) }
                    return this.setResult({ res, message: 'authorized', success: true, status: 201 })
                });
            }
            catch (err: any) { return this.setResult({ res, status: 500, success: false, message: err.message }) }
        })
    };
    addAuthApi = (api:I_api)=>{
        const {path,method,fn}:I_api = api;
        this.AuthRouter[method](path,async (req:Request,res:Response)=>{
            const reqUser = await this.getUserByReq(req);
            if (reqUser === null) { return { success: false, message: 'req user not found', status: 403 } }
            fn(req, res,reqUser)
        })
    }
    handleEntity = (entity: I_entity) => {
        const { name, schema, apis, requiredToken = true, path } = entity;
        const dicName = requiredToken ? 'tokenBaseDic' : 'tokenLessDic';
        this[dicName][name] = path;
        // ساخت مدل بر اساس اسکیما
        try {
            const entitySchema = this.getSchema(schema);
            const entityModel = mongoose.model(name, entitySchema);
            this.models[name] = entityModel;
        } catch (err: any) {
            console.error(`Error creating model for entity ${name}:`, err.message);
            return;
        }
        try {
            this.routers[name] = express.Router();
            for (let api of apis) {
                const { path, method, fn } = api;
                this.routers[name][method](path, async (req: Request, res: Response) => {
                    try { 
                        const reqUser = await this.getUserByReq(req);
                        if (reqUser === null) { return { success: false, message: 'req user not found', status: 403 } }
                        fn(req, res,reqUser)
                    }
                    catch (err: any) { res.status(500).json({ message: err.message, success: false }); }
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
    getUserByReq = async (req: Request): Promise<I_User | null> => {
        if (!this.AuthModel) { return null }
        const userId = (req as any).user.id
        const user: null | I_User = await this.AuthModel.findById(userId);
        return user
    }
}

export default AIOExpress;
type I_GCRUD = {
    getModel: I_getModel
}
type I_getRow = (p: { model?: Model<any>, entityName?: string, search?: I_row, id?: any }) => Promise<null | I_row | string>
type I_getRows = (p: { model?: Model<any>, entityName?: string, search?: I_row, ids?: any[] }) => Promise<I_row[] | string>
type I_addRow = (p: { model?: Model<any>, entityName?: string, newValue: I_row }) => Promise<I_row | string>
type I_editRow = (p: { model?: Model<any>, entityName?: string, id: any, newValue: I_row }) => Promise<string | I_row>
type I_addOrEditRow = (p: { model?: Model<any>, entityName?: string; id: any; newValue: I_row }) => Promise<string | I_row>
type I_editRows = (p: { model?: Model<any>, entityName?: string; search?: I_row; ids?: any[]; newValue: I_row }) => Promise<string | number>
type I_removeRow = (p: { model?: Model<any>, entityName?: string; search?: I_row; id?: string }) => Promise<string | I_row>
type I_removeRows = (p: { model?: Model<any>, entityName?: string; search?: I_row; ids?: any[] }) => Promise<string | number>
class GCRUD {
    getModel: I_getModel;
    constructor(p: I_GCRUD) {
        this.getModel = p.getModel
    }
    getModelByP = (p: any) => {
        return p.model ? p.model : this.getModel(p.entityName);
    }
    getRow: I_getRow = async (p) => {
        try {
            const model = this.getModelByP(p);
            if (p.id) { const res: I_row | null = await model.findById(p.id); return res }
            else if (p.search) { const res: I_row | null = await model.findOne(p.search); return res }
            else { return `Error in get row: please send search object or id for search` }
        }
        catch (error: any) { return `Error in get row: ${error.message}`; }
    }
    getRows: I_getRows = async (p) => {
        try {
            const model = this.getModelByP(p);
            if (p.ids && p.ids.length > 0) {
                const rows: I_row[] = await model.find({ _id: { $in: p.ids } });
                return rows;
            }
            if (p.search) {
                const rows: I_row[] = await model.find(p.search);
                return rows;
            }
            return [];
        }
        catch (error: any) { return `Error in getRows: ${error.message}`; }
    }
    addRow: I_addRow = async (p) => {
        try {
            const model = this.getModelByP(p);
            const newRecord = new model(p.newValue);
            const res = await newRecord.save();
            return res
        }
        catch (error: any) { return `Error in adding row: ${error.message}`; }
    }
    editRow: I_editRow = async (p) => {
        try {
            const model = this.getModelByP(p);
            const updatedRecord = await model.findByIdAndUpdate(p.id, p.newValue, { new: true });
            if (!updatedRecord) { return 'Record not found'; }
            return updatedRecord;
        }
        catch (error: any) { throw new Error(`Error updating record: ${error.message}`); }
    }
    addOrEditRow: I_addOrEditRow = async (p) => {
        try {
            const model = this.getModelByP(p);
            const existingRecord = await model.findById(p.id);
            if (existingRecord) {
                const updatedRecord = await model.findByIdAndUpdate(p.id, p.newValue, { new: true });
                return updatedRecord;
            }
            else {
                const newRecord = new model(p.newValue);
                await newRecord.save();
                return newRecord;
            }
        }
        catch (error: any) { return `Error adding or updating record: ${error.message}` }
    }
    editRows: I_editRows = async (p) => {
        try {
            const model = this.getModelByP(p);
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
            const model = this.getModelByP(p);
            let query;
            if (p.id) { query = { _id: p.id }; }
            else if (p.search) { query = p.search; }
            else { return 'No criteria provided for deletion'; }
            const deletedRecord = await model.findOneAndDelete(query);
            if (!deletedRecord) { return 'Record not found'; }
            return deletedRecord;
        }
        catch (error: any) { throw new Error(`Error deleting record: ${error.message}`); }
    }
    removeRows: I_removeRows = async (p) => {
        try {
            const model = this.getModelByP(p);
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