/// <reference types="cookie-parser" />
import { NextFunction, Request, Response } from 'express';
import { Model, Schema } from 'mongoose';
export type I_AIOExpress = {
    auth?: I_auth;
    env: {
        mongoUrl: string;
        port: string;
        secretKey: string;
    };
    uiDoc?: boolean;
};
export type I_auth = {
    schema?: I_schemaDefinition;
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
    schema?: I_schemaDefinition | string;
    path?: string;
    requiredToken?: boolean;
    apis: I_api[];
};
export type I_entities = {
    [entityName: string]: I_entity;
};
export type I_api = {
    path: string;
    method: 'post' | 'get' | 'put' | 'delete';
    body?: string;
    errorResult: any;
    successResult: string | I_schemaDefinition | I_schemaDefinitionOption;
    description: string;
    queryParam?: string;
    getResult: string;
    fn: (p: {
        req: Request;
        res: Response;
        reqUser: any;
        body: any;
    }) => any;
};
type I_setResult = (p: {
    res: Response;
    status: number;
    message: string;
    success: boolean;
    value?: any;
}) => any;
type I_schemas = {
    [key: string]: (I_schemaDefinition | I_schemaDefinitionOption);
};
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
    private AIOSchemaInstance;
    schemas: I_schemas;
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
    log: (message: string, color?: 'green' | 'red' | 'yellow') => void;
    getModel: I_getModel;
    fixPath: (path: string) => string;
    start: () => void;
    connectToMongoose: () => void;
    getTotal: (name: string) => Promise<number>;
    getNewPassword: (p: {
        userPassword: string;
        oldPassword: string;
        newPassword: string;
    }) => Promise<string | false>;
    initJwt: (req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
    getExpiresIn: () => string;
    getSchemaByRefrence: (schema: I_schemaDefinitionOption | I_schemaDefinition | string) => {
        dif: I_schemaDefinitionOption | I_schemaDefinition;
        ref: string;
    };
    handleAuth: () => void;
    addSchema: (name: string, scm: I_schemaDefinition | I_schemaDefinitionOption) => void;
    getSchemaDefinition: (schema: string | I_schemaDefinition, entityName: string) => I_schemaDefinition;
    addEntities: (entities: I_entities) => void;
    private addEntity;
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
    fixId: (row: any) => any;
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
export type I_schemaDefinition = {
    [field: string]: I_schemaDefinitionOption | string;
};
export type I_schema = Schema;
export type I_schemaType = I_schemaDefinition | string | I_schemaType[];
export type I_schemaDefinitionOption = {
    type: I_schemaType;
    of?: I_schemaType;
    required?: boolean;
    def?: any;
    enum?: any[];
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
type I_getSchemaType = typeof String | typeof Number | typeof Boolean | typeof Date | typeof Map | I_schema;
export declare class AIOSchema {
    schemas: {
        [key: string]: I_schemaDefinition | I_schemaDefinitionOption;
    };
    getSchemaByRefrence: (schema: I_schemaDefinitionOption | I_schemaDefinition | string) => {
        dif: I_schemaDefinitionOption | I_schemaDefinition;
        ref: string;
    };
    isSchemaRowSchema: (schemaDefinitionOption: I_schemaDefinitionOption) => boolean;
    isSchemaRowMap: (schemaDefinitionOption: I_schemaDefinitionOption) => boolean;
    getSchemaType: (type: I_schemaType) => I_getSchemaType;
    getSchema: (scm: I_schemaDefinition) => I_schema;
    validateObjectBySchema: (scm: I_schemaDefinition | I_schemaDefinitionOption, key: string, value: any) => string;
    validateObjectBySchemaDefinition: (scm: I_schemaDefinition, parentKey: string, obj: {
        [key: string]: any;
    }) => string | undefined;
    validateValueBySchemaDefinitionOption: (sdo: I_schemaDefinitionOption, key: string, value: any) => string | undefined;
    isValidType: (value: any, schemaType: 'string' | 'number' | 'boolean' | 'date') => boolean;
    getDefaultValueBySchema: (scm: I_schemaDefinition | I_schemaDefinitionOption, value: {
        [key: string]: any;
    }) => {
        [key: string]: any;
    };
    getDefaultObjectBySchemaDefinition: (scm: I_schemaDefinition, obj: {
        [key: string]: any;
    }) => {
        [key: string]: any;
    };
    getDefaultValueBySchemaDefinitionOption: (sdo: I_schemaDefinitionOption, value: any) => {
        [key: string]: any;
    };
    schemaDefinitionToTS: (scm: I_schemaDefinition) => {
        success: boolean;
        result: string;
    };
    simpleTypeToTS: (type: 'string' | 'number' | 'boolean' | 'date', required: boolean) => {
        success: boolean;
        result: string;
    };
    schemaToTS: (scm: I_schemaDefinition | I_schemaDefinitionOption | string, caller: string) => {
        success: boolean;
        result: string;
    };
    schemaDefinitionOptionToTS: (SDO: I_schemaDefinitionOption) => {
        success: boolean;
        result: string;
    };
    bodyParamToString: (api: I_api) => {
        success: boolean;
        result: string;
    };
    getReturnTypeString: (api: I_api) => {
        success: boolean;
        result: string;
    };
    getMethodsString: (entities: I_entities) => {
        success: boolean;
        result: string;
    };
    getInterfaces: () => {
        success: boolean;
        result: string;
    };
    generateUIDoc: (entities: I_entities) => {
        success: boolean;
        result: string;
    };
}
