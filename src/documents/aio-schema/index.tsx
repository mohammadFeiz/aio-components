import { FC, useState } from "react";
import { AIOSchema, I_schemaDefinition } from "./aio-schema";
import Code from "../../code";
import DOC from "../../resuse-components/doc";
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

                ]
            }}
        />
    )
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
    const userProps = {
        userName: 'msf1364',
        password: '131906',
        mobile: '09123534314',
        email: 'feiz.ms@gmail.com',
        role: 'superAdmin',
        name: 'محمد شریف فیض'
    }
    const defaultValue = aioSchema.getDefaultValueBySchema(s_user, userProps)
    const validate = aioSchema.validateObjectBySchema(s_user, 'user', defaultValue)
    return (
        <div className="msf">
            <div className="msf">defautValue</div>
            {Code(JSON.stringify(defaultValue, null, 3))}
            <div className="msf">Validation message</div>
            {validate}
        </div>
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
        fingers: { type: "string", required: false,def:'{}' },
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
const Enum:FC = ()=>{
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
            {success?Code(result):result}
        </>
    )
}