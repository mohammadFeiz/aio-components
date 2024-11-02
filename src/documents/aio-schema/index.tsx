import { FC, useState } from "react";
import { AIOSchema, I_schemaDefinition } from "./aio-schema";
import Code from "../../code";
import DOC from "../../resuse-components/doc";
import mongoose, { SchemaDefinition, SchemaTypeOptions } from 'mongoose';

const DOC_AIOSchema: FC<{ name: string, goToHome: () => void }> = (props) => {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                nested: true,
                items: () => [
                    { text: 'getDefaultValueBySchema', id: 'getDefaultValueBySchema', render: () => <GetDefaultValueBySchema /> },
                    { text: 'validateObjectBySchema', id: 'validateObjectBySchema', render: () => <ValidateObjectBySchema /> },
                    { text: 'enum', id: 'enum', render: () => <Enum /> },
                    { text: 'ts to schema', id: 'ts2schema', render: () => <TSToSchema /> },

                ]
            }}
        />
    )
}
export default DOC_AIOSchema

const GetDefaultValueBySchema: FC = () => {
    const [aioSchema] = useState<AIOSchema>(new AIOSchema())
    const s_user: I_schemaDefinition = {
        role: { type: "string", required: true, enum: ['superAdmin', 'admin', 'user'] },
        superAdminId: { type: "string", required: false },
        name: { type: "string", required: true },
        email: { type: "string", required: true },
        mobile: { type: "string", required: true },
        interDateString: { type: "string", required: false },
        fingers: { type: "string", required: false, def: '{}' },
        organization: { type: "string", required: true, def: '{}' }
    }
    const userProps = {
        userName: 'msf1364',
        password: '131906',
        mobile: '09123534314',
        email: 'feiz.ms@gmail.com',
        role: 'superAdmin',
        name: 'محمد شریف فیض'
    }
    const defaultValue = aioSchema.getDefaultValueBySchema(s_user, userProps)
    return (
        <>
            {Code(`
const [aioSchema] = useState<AIOSchema>(new AIOSchema())
const s_user:I_schemaDefinition = {
    role: { type: "string", required: true, enum: ['superAdmin', 'admin', 'user'] },
    superAdminId: { type: "string", required: false },
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    mobile: { type: "string", required: true },
    interDateString: { type: "string", required: false },
    fingers: { type: "string", required: false },
    organization: { type: "string", required: true,def:'{}' }
}
const userProps = {
    userName:'msf1364',
    password:'131906',
    mobile:'09123534314',
    email:'feiz.ms@gmail.com',
    role:'superAdmin',
    name:'محمد شریف فیض'
}
const defaultValue = aioSchema.getDefaultValueBySchema(s_user,userProps)
            `)}
            <div className="bold p-h-12 fs-16">Result:</div>
            {Code(JSON.stringify(defaultValue, null, 3))}
        </>
    )
}
const ValidateObjectBySchema: FC = () => {
    const [aioSchema] = useState<AIOSchema>(new AIOSchema())
    const s_user: I_schemaDefinition = {
        role: { type: "string", required: true, enum: ['superAdmin', 'admin', 'user'] },
        superAdminId: { type: "string", required: false },
        name: { type: "string", required: true },
        email: { type: "string", required: true },
        mobile: { type: "string", required: true },
        interDateString: { type: "string", required: false },
        fingers: { type: "string", required: false },
        organization: { type: "string", required: true }
    }
    const value = {
        userName: 'msf1364',
        password: '131906',
        mobile: '09123534314',
        email: 'feiz.ms@gmail.com',
        role: 'superAdmin',
        name: 'محمد شریف فیض'
    }
    const validate = aioSchema.validateObjectBySchema(s_user, 'user', value)
    return (
        <>
            {Code(`
const [aioSchema] = useState<AIOSchema>(new AIOSchema())
const s_user: I_schemaDefinition = {
    role: { type: "string", required: true, enum: ['superAdmin', 'admin', 'user'] },
    superAdminId: { type: "string", required: false },
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    mobile: { type: "string", required: true },
    interDateString: { type: "string", required: false },
    fingers: { type: "string", required: false },
    organization: { type: "string", required: true }
}
const value = {
    userName: 'msf1364',
    password: '131906',
    mobile: '09123534314',
    email: 'feiz.ms@gmail.com',
    role: 'superAdmin',
    name: 'محمد شریف فیض'
}
const validate = aioSchema.validateObjectBySchema(s_user, 'user', value)    
            `)}
            <div className="bold p-h-12 fs-16">Result:</div>
            {Code(JSON.stringify(validate, null, 3))}
        </>
    )
}
const Enum: FC = () => {
    const [aioSchema] = useState<AIOSchema>(new AIOSchema())
    const s_user: I_schemaDefinition = {
        role: { type: "string", required: true, enum: ['superAdmin', 'admin', 'user'] },
        superAdminId: { type: "string", required: false },
        name: { type: "string", required: true },
        email: { type: "string", required: true },
        mobile: { type: "string", required: true },
        interDateString: { type: "string", required: false },
        fingers: { type: "string", required: false },
        organization: { type: "string", required: true }
    }
    const type = {
        type: 'string',
        enum: [s_user, null]
    }
    const { success, result } = aioSchema.schemaToTS(type)
    return (
        <>
            {Code(`
const [aioSchema] = useState<AIOSchema>(new AIOSchema())
const s_user: I_schemaDefinition = {
    role: { type: "string", required: true, enum: ['superAdmin', 'admin', 'user'] },
    superAdminId: { type: "string", required: false },
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    mobile: { type: "string", required: true },
    interDateString: { type: "string", required: false },
    fingers: { type: "string", required: false },
    organization: { type: "string", required: true }
}
const type = {
    type:'string',
    enum:[s_user,'I_user']
}
const {success,result} = aioSchema.schemaToTS(type)   
            `)}
            <div className="bold p-h-12 fs-16">Result:</div>
            {success ? Code(result) : result}
        </>
    )
}

const TSToSchema: FC = () => {
    function tsToSchema(typeString: string) {
        const inst = new SchemaGenerator()
        const mongooseSchema = inst.generateSchema(typeString);
        return mongooseSchema
    }
    const typeString = `
{
    name: string;
    age?: number;
    isAdmin: boolean;
    tags: string[];
}`;
    const res = tsToSchema(typeString)
    return (
        Code(JSON.stringify(res, null, 3))
    )
}

class SchemaGenerator {
    // متدی برای تبدیل نوع‌های TypeScript به نوع‌های Mongoose
    private mapTypeToMongoose(type: string): any {
        if (type.endsWith('[]')) {
          const itemType = type.slice(0, -2).trim();
          return [this.mapTypeToMongoose(itemType)]; // استفاده از تابع برای تعیین نوع داخلی آرایه
        }
    
        switch (type) {
          case 'string':
            return String;
          case 'number':
            return Number;
          case 'boolean':
            return Boolean;
          default:
            throw new Error(`Unsupported type: ${type}`);
        }
    }

    // متدی برای تجزیه رشته تایپ و استخراج فیلدها
    private parseType(typeString: string): SchemaDefinition {
        const schema: SchemaDefinition = {};
        const lines = typeString.split(';').map(line => line.trim()).filter(line => line);
        lines.forEach(line => {
            const isOptional = line.includes('?');
            const [keyType, type] = line.split(':').map(s => s.trim());
            const key = keyType.replace('?', '').trim();
            if (!key || !type) {
                throw new Error(`Invalid type format: ${line}`);
            }
            const mongooseType = this.mapTypeToMongoose(type);
            const schemaOptions: SchemaTypeOptions<any> = { type: mongooseType, required: !isOptional };
            schema[key] = schemaOptions;
        });

        return schema;
    }

    // متدی برای ساخت اسکیمای Mongoose
    public generateSchema(typeString: string): any {
        typeString = typeString.trim().replace(/^{|}$/g, '').trim();
        const schemaDefinition = this.parseType(typeString);
        return schemaDefinition;
    }
}