import mongoose, { Schema } from "mongoose";

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
type I_getSchemaType = typeof String | typeof Number | typeof Boolean | typeof Date | typeof Map |I_schema;
export type I_api = {
    path: string,
    method: 'post' | 'get' | 'put' | 'delete',
    body?: string, errorResult: any, successResult: string | I_schemaDefinition | I_schemaDefinitionOption, description: string, queryParam?: string, getResult: string,
    fn: (p: { req: Request, res: Response, reqUser: any, body: any }) => any
};
export type I_entity = { schema?: I_schemaDefinition | string, path?: string, requiredToken?: boolean, apis: I_api[] };
export type I_entities = { [entityName: string]: I_entity }

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
            if(key === 'organization'){debugger}
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
            return this.validateObjectBySchema(sdo.type, `${key}.type`, value || {});
        }
        if (value !== undefined && !this.isValidType(value, sdo.type as 'string' | 'number' | 'boolean' | 'date')) {
            return `property "${key}" is not of type ${sdo.type}, value is ${JSON.stringify(value,null,3)}`;
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
        if(value === undefined){
            if (sdo.required === true) {return sdo.def}
        }
        else {return value}
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
    schemaToTS = (scm: I_schemaDefinition | I_schemaDefinitionOption | string,caller:string): { success: boolean, result: string } => {
        const { dif,ref } = this.getSchemaByRefrence(scm);
        if(ref){return {success:true,result:ref}}
        else if (dif.type) { return this.schemaDefinitionOptionToTS(scm as I_schemaDefinitionOption) }
        else { return this.schemaDefinitionToTS(scm as I_schemaDefinition) }
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
            return {
                success: true,
                result: sdo.enum.map((value: any) => (typeof value === 'string' ? `'${value}'` : value.toString())).join(' | ')
            }
        }
        if (['string', 'number', 'boolean', 'date'].indexOf(sdo.type) !== -1) {
            return this.simpleTypeToTS(sdo.type as any, !!sdo.required)
        }
        else {
            return this.schemaToTS(sdo.type,'schemaDefinitionOptionToTS')
        }
    }
    bodyParamToString = (api: I_api): { success: boolean, result: string } => {
        let res: string = ''
        if (api.body) {
            let scm;
            if(typeof api.body === 'string'){scm = this.schemas[api.body];}
            else {scm = api.body}
            const { success, result } = this.schemaToTS(scm,'bodyParamToString')
            if (!success) { return { success: false, result } }
            res = `body:${api.body}`
        }
        if (api.queryParam) { res += `${res ? ',' : ''}${api.queryParam}`; }
        return { success: true, result: res };
    }
    getReturnTypeString = (api: I_api): { success: boolean, result: string } => {
        let scm;
        if(typeof api.successResult === 'string'){scm = this.schemas[api.successResult]}
        else {scm = api.successResult}
        const { success, result } = this.schemaToTS(scm,'getReturnTypeString');
        if (!success) { return { success: false, result } }
        return { success: true, result: `:Promise<${JSON.stringify(api.errorResult)} | ${typeof api.successResult === 'string'?api.successResult:result}>` }
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
            const { success, result } = this.schemaToTS(scm,'getInterfaces');
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