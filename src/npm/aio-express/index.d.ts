/// <reference types="cookie-parser" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { NextFunction, Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
export type I_AIOExpress = {
    auth?: I_auth;
    env: {
        mongoUrl: string;
        port: string;
        secretKey: string;
    };
};
export type I_auth = {
    schema?: I_schema;
    name: string;
    path: string;
    tokenTime: {
        unit: 's' | 'm' | 'h' | 'd';
        value: number;
    };
    registerExeption?: (p: {
        userName: string;
        password: string;
        userProps: any;
    }) => Promise<{
        status: number;
        message: string;
    } | void>;
};
type I_row = {
    [key: string]: any;
};
type I_getModel = (key: string) => Model<any>;
export type I_entity = {
    name: string;
    schema?: I_schema;
    path: string;
    requiredToken?: boolean;
    apis: I_api[];
};
export type I_schema = {
    [key: string]: {
        type: 'string' | 'boolean' | 'number' | 'date' | 'object';
        required?: boolean;
        def?: any;
        options?: any[];
        unique?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        ref?: string;
        index?: boolean;
        validate?: (value: any) => boolean;
        errorMessage?: string;
    };
};
export type I_virtuals = {
    [virtualField: string]: {
        get?: (this: any) => string;
        set?: (this: any) => string;
    };
};
export type I_api = {
    path: string;
    method: 'post' | 'get' | 'put' | 'delete';
    fn: (req: Request, res: Response, reqUser: any, reqUserId: any) => any;
};
type I_setResult = (p: {
    res: Response;
    status: number;
    message: string;
    success: boolean;
    value?: any;
}) => any;
declare class AIOExpress<I_User> {
    private app;
    private p;
    private jwt;
    private AuthRouter;
    private AuthModel?;
    private models;
    private routers;
    private tokenBaseDic;
    private tokenLessDic;
    env: {
        mongoUrl: string;
        port: string;
        secretKey: string;
    };
    gcrud: GCRUD;
    getRow: I_getRow;
    getRows: I_getRows;
    addRow: I_addRow;
    editRow: I_editRow;
    addOrEditRow: I_addOrEditRow;
    editRows: I_editRows;
    removeRow: I_removeRow;
    removeRows: I_removeRows;
    getUser: (p: {
        id?: any;
        search?: I_row;
        req?: Request;
    }) => Promise<null | I_User | string>;
    getUsers: (p: {
        ids?: any[];
        search?: I_row;
    }) => Promise<I_User[] | string>;
    addUser: (p: {
        newValue: I_User;
    }) => Promise<I_User | string>;
    editUser: (p: {
        id: any;
        newValue: Partial<I_User>;
    }) => Promise<I_User | string>;
    editUsers: (p: {
        ids?: any[];
        search?: Partial<I_User>;
        newValue?: Partial<I_User>;
    }) => Promise<string | number>;
    removeUser: (p: {
        id?: any;
        search?: Partial<I_User>;
    }) => Promise<I_User | string>;
    removeUsers: (p: {
        ids?: any[];
        search?: Partial<I_User>;
    }) => Promise<number | string>;
    constructor(p: I_AIOExpress);
    getModel: I_getModel;
    addEntity: (entity: I_entity) => void;
    fixPath: (path: string) => string;
    start: () => void;
    connectToMongoose: () => void;
    getSchema: (schemaObj: I_schema) => mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
        timestamps: true;
        toJSON: {
            virtuals: true;
        };
        toObject: {
            virtuals: true;
        };
    }, any, mongoose.Document<unknown, {}, mongoose.FlatRecord<any>> & mongoose.FlatRecord<any> & Required<{
        _id: unknown;
    }> & {
        __v?: number;
    }>;
    getTotal: (name: string) => Promise<number>;
    getNewPassword: (p: {
        userPassword: string;
        oldPassword: string;
        newPassword: string;
    }) => Promise<string | false>;
    initJwt: (req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
    getExpiresIn: () => string;
    handleAuth: () => void;
    handleEntity: (entity: I_entity) => void;
    setResult: I_setResult;
    getUserByReq: (req: Request) => Promise<I_User | null | string>;
}
export default AIOExpress;
type I_GCRUD = {
    getModel: I_getModel;
};
type I_getRow = (p: {
    model?: Model<any>;
    entityName?: string;
    search?: I_row;
    id?: any;
}) => Promise<null | I_row | string>;
type I_getRows = (p: {
    model?: Model<any>;
    entityName?: string;
    search?: I_row;
    ids?: any[];
}) => Promise<I_row[] | string>;
type I_addRow = (p: {
    model?: Model<any>;
    entityName?: string;
    newValue: I_row;
}) => Promise<I_row | string>;
type I_editRow = (p: {
    model?: Model<any>;
    entityName?: string;
    id?: any;
    search?: I_row;
    newValue: I_row;
}) => Promise<string | I_row>;
type I_addOrEditRow = (p: {
    model?: Model<any>;
    entityName?: string;
    id?: any;
    search?: I_row;
    newValue: I_row;
}) => Promise<string | I_row>;
type I_editRows = (p: {
    model?: Model<any>;
    entityName?: string;
    search?: I_row;
    ids?: any[];
    newValue: I_row;
}) => Promise<string | number>;
type I_removeRow = (p: {
    model?: Model<any>;
    entityName?: string;
    search?: I_row;
    id?: string;
}) => Promise<string | I_row>;
type I_removeRows = (p: {
    model?: Model<any>;
    entityName?: string;
    search?: I_row;
    ids?: any[];
}) => Promise<string | number>;
declare class GCRUD {
    getModel: I_getModel;
    constructor(p: I_GCRUD);
    getModelByP: (p: any) => Promise<any>;
    getRow: I_getRow;
    getRows: I_getRows;
    addRow: I_addRow;
    editRow: I_editRow;
    addOrEditRow: I_addOrEditRow;
    editRows: I_editRows;
    removeRow: I_removeRow;
    removeRows: I_removeRows;
}
export type I_Date = string | number | Date | I_dateObject | number[];
type I_dateObject = {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
};
export declare class AIODate {
    isMatch: (date: I_Date, matchers: string[]) => boolean;
    convertToArray: (date: I_Date, jalali?: boolean) => number[];
    isLess: (date1: I_Date, date2: I_Date) => boolean;
    isGreater: (date1: I_Date, date2: I_Date) => boolean;
    isEqual: (date1: I_Date, date2: I_Date) => boolean;
    isBetween: (date1: I_Date, dates: [I_Date, I_Date]) => boolean;
    compaire: (date1: I_Date, date2: I_Date) => 'less' | 'greater' | 'equal';
    getWeekDay: (date: I_Date) => {
        weekDay: string;
        index: number;
    };
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
    getDelta: (date: I_Date, otherDate?: I_Date, unit?: 'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond') => {
        day: number;
        hour: number;
        minute: number;
        second: number;
        tenthsecond: number;
        miliseconds: number;
        type: 'remaining' | 'passed' | 'now';
    };
    convertMiliseconds: (miliseconds: number, unit?: 'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond') => {
        day: number;
        hour: number;
        minute: number;
        second: number;
        tenthsecond: number;
        miliseconds: number;
        type: 'remaining' | 'passed' | 'now';
    };
    getDaysOfMonth: (date: I_Date, pattern?: string) => any[];
    getLastDayOfMonth: (date: I_Date) => any[];
    getDateByPattern: (date: I_Date, pattern: string) => string;
    getToday: (jalali?: boolean) => number[];
    getDayIndex: (date: I_Date, unit: 'week' | 'year' | 'month') => number;
    getYesterday: (date: I_Date) => I_Date;
    getTomarrow: (date: I_Date) => I_Date;
    toMiliseconds: (p: {
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        minute?: number;
        second?: number;
    }) => number;
    getDateByDeltaMiliseconds: (date: I_Date, miliseconds: number) => number[];
    constructor();
}
export declare function SplitNumber(price: number, count?: number, splitter?: string): string;
export declare function CalculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
export declare function GetArray(count: number, fn?: (index: number) => any): any[];
export declare function GetRandomNumber(from: number, to: number): number;
