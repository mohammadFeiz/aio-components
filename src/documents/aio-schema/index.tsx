import { FC, useState } from "react";
import { AIOSchema, I_schemaDefinition } from "./aio-schema";
import {Code} from './../../npm/aio-components';
const DOC_AIOSchema:FC = ()=>{
    const [aioSchema] = useState<AIOSchema>(new AIOSchema())
    const s_user:I_schemaDefinition = {
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
        userName:'msf1364',
        password:'131906',
        mobile:'09123534314',
        email:'feiz.ms@gmail.com',
        role:'superAdmin',
        name:'محمد شریف فیض'
    }
    const defaultValue = aioSchema.getDefaultValueBySchema(s_user,userProps)
    const validate = aioSchema.validateObjectBySchema(s_user,'user',defaultValue)
    return (
        <div className="msf">
            <div className="msf">defautValue</div>
            {Code(JSON.stringify(defaultValue,null,3))}
            <div className="msf">Validation message</div>
            {validate} 
        </div>
    )
}
export default DOC_AIOSchema