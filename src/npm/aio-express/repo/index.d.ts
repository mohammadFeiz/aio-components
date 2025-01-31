/// <reference types="cookie-parser" />
import { NextFunction, Request, Response } from 'express';
import mongoose, { ClientSession, Model, Schema } from 'mongoose';
import Agenda from 'agenda';
export type I_AIOExpress = {
    auth?: I_auth;
    env: {
        mongoUrl: string;
        port: string;
        secretKey: string;
    };
    uiDoc?: boolean;
    appName: string;
    fa?: boolean;
};
export type I_response<T> = {
    status: number;
    success: boolean;
    message?: string;
    value?: T;
};
export type I_auth = {
    schema?: I_schemaDefinition;
    name: string;
    path: string;
    loginInputsStr?: string;
    loginConfigStr?: string;
    tokenTime: {
        unit: 's' | 'm' | 'h' | 'd';
        value: number;
    };
    registerExeption?: (p: {
        userName: string;
        password: string;
        properties: any;
    }) => Promise<{
        status?: number;
        message?: string;
        userName?: string;
        password?: string;
        properties?: any;
    } | void>;
    loginExeption?: (p: {
        user: any;
        token: string;
    }) => Promise<{
        status?: number;
        message?: string;
        user?: any;
    } | void>;
};
type I_transaction = <T>(callback: (session: ClientSession) => Promise<T | string>) => Promise<T | string>;
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
export type I_queryParam = {
    [key: string]: any;
};
export type I_api = {
    path: string;
    method: 'post' | 'get' | 'put' | 'delete' | 'patch';
    body?: string;
    returnType: string;
    configStr?: string;
    description: string;
    queryString?: string;
    checkAccess?: (p: {
        reqUser: any;
        body: any;
        queryParam: I_queryParam;
    }) => Promise<void | string | {
        [key: string]: any;
    }>;
    fn: (p: {
        req: Request;
        res: Response;
        reqUser: any;
        body: any;
        accessBody: any;
        queryParam: I_queryParam;
    }) => Promise<I_response<any>>;
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
type I_record<T> = T & {
    id: string;
} & Document;
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
    getRow: GCRUD["getRow"];
    getRows: GCRUD["getRows"];
    addRow: GCRUD["addRow"];
    editRow: GCRUD["editRow"];
    addOrEditRow: GCRUD["addOrEditRow"];
    editRows: GCRUD["editRows"];
    removeRow: GCRUD["removeRow"];
    removeRows: GCRUD["removeRows"];
    getUser: (p: {
        id?: any;
        search?: Partial<I_User>;
    }) => Promise<null | I_record<I_User> | string>;
    getUsers: (p: {
        ids?: any[];
        search?: Partial<I_User>;
    }) => Promise<I_record<I_User>[] | string>;
    addUser: (p: {
        newValue: I_User;
        session?: ClientSession;
    }) => Promise<I_record<I_User> | string>;
    editUser: (p: {
        id: any;
        newValue: Partial<I_User>;
        session?: ClientSession;
    }) => Promise<I_record<I_User> | string>;
    editUsers: (p: {
        ids?: any[];
        search?: Partial<I_User>;
        newValue: Partial<I_User>;
        session?: ClientSession;
    }) => Promise<string | number>;
    removeUser: (p: {
        id?: any;
        search?: Partial<I_User>;
        session?: ClientSession;
    }) => Promise<I_record<I_User> | string | null>;
    removeUsers: (p: {
        ids?: any[];
        search?: Partial<I_User>;
        session?: ClientSession;
    }) => Promise<number | string>;
    changeUserPassword: (p: {
        oldPassword: string | false;
        newPassword: string;
        userId: string;
    }) => Promise<true | string>;
    agenda: Agenda;
    constructor(p: I_AIOExpress);
    getModel: I_getModel;
    log: (message: string, color?: 'green' | 'red' | 'yellow' | 'orange') => void;
    start: () => Promise<void>;
    transaction: I_transaction;
    schedule: (p: {
        callAt: number;
        callback: () => Promise<void>;
        jobName: string;
        version: string;
    }) => Promise<void>;
    stopSchedule: (name: string) => Promise<void>;
    connectToMongoose: () => void;
    getTotal: (name: string) => Promise<number>;
    getNewPassword: (p: {
        userPassword: string;
        oldPassword: string | false;
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
    fixPath: (path: string, queryString?: string) => string;
    private addEntity;
    processUrl: (req: Request) => {
        [key: string]: any;
    };
    setResult: I_setResult;
    getUserByReq: (req: Request) => Promise<I_User | null | string>;
}
export default AIOExpress;
type I_GCRUD = {
    getModel: I_getModel;
    getAuthModel: () => Model<any>;
};
declare class GCRUD {
    getModel: I_getModel;
    getAuthModel: () => Model<any>;
    constructor(p: I_GCRUD);
    getModelByP: (p: any) => Promise<mongoose.Model<any, {}, {}, {}, any, any>>;
    fixId: (row: any) => any;
    getRow: <T>(p: {
        entityName: string | 'auth';
        search?: Partial<T>;
        id?: any;
    }) => Promise<string | I_record<T>>;
    getRows: <T>(p: {
        entityName: string;
        search?: Partial<T>;
        ids?: any[];
    }) => Promise<string | I_record<T>[]>;
    addRow: <T>(p: {
        entityName: string | 'auth';
        newValue: T;
        session?: ClientSession;
    }) => Promise<string | I_record<T>>;
    editRow: <T>(p: {
        entityName: string | 'auth';
        id?: any;
        search?: Partial<T>;
        newValue: I_row;
        session?: ClientSession;
    }) => Promise<string | I_record<T>>;
    addOrEditRow: <T>(p: {
        entityName: string | 'auth';
        id?: any;
        search?: Partial<T>;
        newValue: T;
        session?: ClientSession;
    }) => Promise<string | I_record<T>>;
    editRows: <T>(p: {
        entityName: string | 'auth';
        search?: Partial<T>;
        ids?: any[];
        newValue: Partial<T>;
        session?: ClientSession;
    }) => Promise<string | number>;
    removeRow: <T>(p: {
        entityName: string | 'auth';
        search?: Partial<T>;
        id?: string;
        session?: ClientSession;
    }) => Promise<string | I_record<T>>;
    removeRows: <T>(p: {
        entityName: string | 'auth';
        search?: Partial<T>;
        ids?: any[];
        session?: ClientSession;
    }) => Promise<string | number>;
}
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
    getSchemaType: (type: I_schemaType) => I_getSchemaType | undefined;
    getSchema: (scm: I_schemaDefinition) => I_schema;
    validateObjectBySchema: (scm: I_schemaDefinition | I_schemaDefinitionOption, key: string, value: any) => string;
    validateObjectBySchemaDefinition: (scm: I_schemaDefinition, parentKey: string, obj: {
        [key: string]: any;
    }) => string | undefined;
    validateValueBySchemaDefinitionOption: (sdo: I_schemaDefinitionOption, key: string, value: any) => string | undefined;
    isValidType: (value: any, schemaType: 'string' | 'number' | 'boolean' | 'date' | 'false' | 'true' | 'null') => boolean;
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
    getDefaultValueBySchemaDefinitionOption: (sdo: I_schemaDefinitionOption, value: any) => any;
    schemaDefinitionToTS: (scm: I_schemaDefinition) => {
        success: boolean;
        result: string;
    };
    simpleTypeToTS: (type: 'string' | 'number' | 'boolean' | 'date' | 'true' | 'false' | 'null', required: boolean) => {
        success: boolean;
        result: string;
    };
    schemaToTS: (scm: I_schemaDefinition | I_schemaDefinitionOption | string) => {
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
    getUrlString: (name: string, path: string, queryString?: string) => string;
    getMethodsString: (entities: I_entities) => {
        success: boolean;
        result: string;
    };
    getInterfaces: () => {
        success: boolean;
        result: string;
    };
    getApiTypes: (entities: I_entities) => string;
    generateUIDoc: (entities: I_entities, appName: string) => {
        success: boolean;
        result: string;
    };
}
