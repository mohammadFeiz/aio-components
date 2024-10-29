import express, { NextFunction, Router, RequestHandler, Request, Response } from 'express';
import type { Express } from 'express';
//@ts-ignore
import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
export type I_AIOExpress = { auth?: I_auth, env: { mongoUrl: string, port: string, secretKey: string } };
export type I_auth = {
    schema?: I_schema,
    name: string,
    path: string,
    tokenTime: { unit: 's' | 'm' | 'h' | 'd', value: number },
    registerExeption?: (p: { userName: string, password: string, userProps: any }) => Promise<{ status: number, message: string } | void>,
};
type I_row = { [key: string]: any }
type I_getModel = (key: string) => Model<any>
export type I_entity = { name: string, schema?: I_schema, path: string, requiredToken?: boolean, apis: I_api[] };
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
export type I_api = { path: string, method: 'post' | 'get' | 'put' | 'delete', fn: (req: Request, res: Response, reqUser: any,reqUserId:any) => any };
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
    constructor(p: I_AIOExpress) {
        // mongoose.set('debug', true);
        this.p = p;
        this.env = {
            mongoUrl: p.env.mongoUrl as string,
            secretKey: p.env.secretKey as string,
            port: p.env.port as string,
        },
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
    fixPath = (path: string) => path[0] !== '/' ? `/${path}` : path
    start = () => {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(cookieParser() as RequestHandler);
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.connectToMongoose();

        if (this.AuthRouter && this.p.auth) {
            const { path } = this.p.auth;
            this.app.use(this.fixPath(path), this.AuthRouter);
        }

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
        this.app.listen(this.env.port, () => {
            console.log(`Server running on port ${this.env.port}`);
        });
    };

    connectToMongoose = () => {
        const url: string = this.env.mongoUrl;
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
                required: !!fieldConfig.required,
                unique: !!fieldConfig.unique,
            };
            if (fieldConfig.def !== undefined) mongooseField.default = fieldConfig.def;
            if (fieldConfig.ref) mongooseField.ref = fieldConfig.ref;
            if (fieldConfig.options) mongooseField.enum = fieldConfig.options;
            if (fieldConfig.minLength) mongooseField.minLength = fieldConfig.minLength;
            if (fieldConfig.maxLength) mongooseField.maxLength = fieldConfig.maxLength;
            if (fieldConfig.min) mongooseField.min = fieldConfig.min;
            if (fieldConfig.max) mongooseField.max = fieldConfig.max;
            if (fieldConfig.index !== undefined) mongooseField.index = fieldConfig.index;
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
        jwt.verify(token, this.env.secretKey, (err: any, decoded: any) => {
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
        const scm: I_schema = {
            ...schema,
            password: { type: 'string', required: true },
            userName: { type: 'string', required: true, unique: true }
        }
        const authSchema = this.getSchema(scm);
        authSchema.methods.matchPassword = async function (enteredPassword: string) {
            return await bcrypt.compare(enteredPassword, this.password);
        };

        this.AuthModel = mongoose.model(this.p.auth.name, authSchema);

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
                const secretKey: string = this.env.secretKey;
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
                jwt.verify(token, this.env.secretKey as string, (err: any, decoded: any) => {
                    if (err) { return this.setResult({ res, message: 'Token is invalid', success: false, status: 401 }) }
                    return this.setResult({ res, message: 'authorized', success: true, status: 201 })
                });
            }
            catch (err: any) { return this.setResult({ res, status: 500, success: false, message: err.message }) }
        })
    };
    handleEntity = (entity: I_entity) => {
        const { name, schema, apis, requiredToken = true, path } = entity;
        const dicName = requiredToken ? 'tokenBaseDic' : 'tokenLessDic';
        this[dicName][name] = this.fixPath(path);
        if (schema) {
            try {
                const entitySchema = this.getSchema(schema), entityModel = mongoose.model(name, entitySchema);
                this.models[name] = entityModel;
            }
            catch (err: any) { console.error(`Error creating model for entity ${name}:`, err.message); return; }
        }
        try {
            this.routers[name] = express.Router();
            for (let api of apis) {
                const { path, method, fn } = api;
                this.routers[name][method](this.fixPath(path), async (req: Request, res: Response) => {
                    try {
                        const reqUser = await this.getUserByReq(req);
                        const reqUserId = (req as any).user.id;
                        if (reqUser === null) { return { success: false, message: 'req user not found', status: 403 } }
                        if (typeof reqUser === 'string') { return { success: false, message: reqUser, status: 403 } }
                        const result = await fn(req, res, reqUser,reqUserId)
                        return this.setResult({...result,res}) 
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
type I_editRow = (p: { model?: Model<any>, entityName?: string, id?: any, search?:I_row, newValue: I_row }) => Promise<string | I_row>
type I_addOrEditRow = (p: { model?: Model<any>, entityName?: string; id?: any, search?:I_row,newValue: I_row }) => Promise<string | I_row>
type I_editRows = (p: { model?: Model<any>, entityName?: string; search?: I_row; ids?: any[]; newValue: I_row }) => Promise<string | number>
type I_removeRow = (p: { model?: Model<any>, entityName?: string; search?: I_row; id?: string }) => Promise<string | I_row>
type I_removeRows = (p: { model?: Model<any>, entityName?: string; search?: I_row; ids?: any[] }) => Promise<string | number>
class GCRUD {
    getModel: I_getModel;
    constructor(p: I_GCRUD) {this.getModel = p.getModel}
    getModelByP = async (p: any) => p.model ? p.model : await this.getModel(p.entityName)
    getRow: I_getRow = async (p) => {
        try {
            const model = await this.getModelByP(p);
            if (p.id) { const res: I_row | null = await model.findById(p.id); return res }
            else if (p.search) { const res: I_row | null = await model.findOne(p.search); return res }
            else { return `Error in get row: please send search object or id for search` }
        }
        catch (error: any) { return `Error in get row: ${error.message}`; }
    }
    getRows: I_getRows = async (p) => {
        try {
            const model = await this.getModelByP(p);
            if (p.ids && p.ids.length > 0) {return await model.find({ _id: { $in: p.ids } });}
            if (p.search) {
                const res = await model.find(p.search);
                return res;
            }
            return [];
        }
        catch (error: any) { return `Error in getRows: ${error.message}`; }
    }
    addRow: I_addRow = async (p) => {
        try {
            let model,newRecord;
            try{model = await this.getModelByP(p); newRecord = new model(p.newValue);}
            catch(err:any){return err.message}
            const res = await newRecord.save().then((res:any) => {})
            .catch((err:any) => `Error in adding row : ${err}`);
            return res
        }
        catch (error: any) { return `Error in adding row: ${error.message}`; }
    }
    editRow: I_editRow = async (p) => {
        try {
            const model = await this.getModelByP(p);
            const exist = await this.getRow(p);
            if(exist === null){return 'Record not found';}
            if(typeof exist === 'string'){return exist}
            const updatedRecord = await model.findByIdAndUpdate(exist._id, p.newValue, { new: true });
            if (!updatedRecord) { return 'Record not found'; }
            return updatedRecord;
        }
        catch (error: any) { throw new Error(`Error updating record: ${error.message}`); }
    }
    addOrEditRow: I_addOrEditRow = async (p) => {
        try {
            const model = await this.getModelByP(p);
            let existingRecord;
            if(p.id !== undefined){existingRecord = await model.findById(p.id);}
            else if(p.search){existingRecord = await model.findOne(p.search);}
            else {return 'addOrEditRow should get id our search object as parameter'}
            if (existingRecord !== null) {
                const updatedRecord = await model.findByIdAndUpdate(existingRecord._id, p.newValue, { new: true });
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
            return deletedRecord;
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
            for (let i = 0; i < value.length; i++) {if (isNaN(parseInt(value[i]))) { return value[i] }}
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
            let [year] = this.convertToArray(date),res = 0;
            for (let i = 1; i <= 12; i++) {res += this.getMonthDaysLength([year, i])}
            return res
        }
        this.getYesterday = (date) => {
            const [year, month, day] = this.convertToArray(date);
            let newYear = year, newMonth = month, newDay = day;
            if (day === 1) {
                if (month === 1) { newYear = newYear - 1; newMonth = 12; newDay = this.getMonthDaysLength([newYear, newMonth])}
                else {newMonth = newMonth - 1; newDay = this.getMonthDaysLength([newYear, newMonth])}
            }
            else {newDay = newDay - 1}
            return [newYear, newMonth, newDay]
        }
        this.getTomarrow = (date) => {
            const [year, month, day] = this.convertToArray(date);
            let newYear = year, newMonth = month, newDay = day;
            const daysLength = this.getMonthDaysLength(date)
            if (day === daysLength) {
                if (month === 12) {newYear = newYear + 1; newMonth = 1; newDay = 1}
                else {newMonth = newMonth + 1; newDay = 1}
            }
            else {newDay = newDay + 1}
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
            if (index <= 1) {hour = Math.floor(dif / (60 * 60 * 1000)); dif -= hour * (60 * 60 * 1000);}
            if (index <= 2) {minute = Math.floor(dif / (60 * 1000)); dif -= minute * (60 * 1000);}
            if (index <= 3) {second = Math.floor(dif / (1000)); dif -= second * (1000);}
            if (index <= 4) {tenthsecond = Math.floor(dif / (100));}
            return { day, hour, minute, second, tenthsecond, miliseconds, type }
        }
        this.getDaysOfMonth = (date, pattern) => {
            if (!date) { return [] }
            let dateArray = this.convertToArray(date);
            let daysLength = this.getMonthDaysLength(date)
            let firstDay: I_Date = [dateArray[0], dateArray[1], 1];
            let res: I_Date[] = []
            for (let i = 0; i < daysLength; i++) {res.push(firstDay); firstDay = this.getTomarrow(firstDay);}
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
            if (unit === 'month') {return date[2] - 1;}
            if (unit === 'year') {
                let res = 0;
                for (let i = 0; i < date[1] - 1; i++) {res += this.getMonthDaysLength(date)}
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