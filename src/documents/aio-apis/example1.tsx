import { FC, useEffect, useRef, useState } from "react";
import AIOApis, { AA_api } from "../../npm/aio-apis";
import { Code } from "../../npm/aio-component-utils";
import { I_mockMethod } from "../../npm/aio-utils";
import { AICheckbox } from "../../npm/aio-input";
type I_data = { name: string, family: string }
type I_mockType = 'mockError' | 'mockSuccess'
type I_setting = { 
    successMessage: boolean, 
    errorMessage:boolean,
    mockType: I_mockType ,
    loading:boolean
}
const GetResult: FC = () => {
    const [apis] = useState<APIS>(new APIS())
    const [data, setData] = useState<I_data | string>()
    const [setting, setSetting] = useState<I_setting>({
        successMessage: false, mockType: 'mockError',errorMessage:true,loading:true
    })
    const getData = async () => {
        const res = await apis.getData(setting)
        if (res) { setData(res) }
    }
    return (
        <div className="example flex-col- gap-12-">
            {Code(classCode(setting))}
            <Responses type={setting.mockType} change={(mockType) => setSetting({ ...setting, mockType })} />
            <AICheckbox value={!!setting.successMessage} onChange={(successMessage)=>setSetting({...setting,successMessage})} text="successMessage"/>
            <AICheckbox value={!!setting.errorMessage} onChange={(errorMessage)=>setSetting({...setting,errorMessage})} text="errorMessage"/>
            <AICheckbox value={!!setting.loading} onChange={(loading)=>setSetting({...setting,loading})} text="loading"/>
            <button className='w-fit-' onClick={() => getData()}>Call Api</button>
            {
                !!data &&
                <>
                    result is:
                    {Code(JSON.stringify(data, null, 4))}
                </>
            }
        </div>
    )
}
export default GetResult

const Responses: FC<{ type: I_mockType, change: (v: I_mockType) => void }> = ({ type, change }) => {
    return (
        <div className="flex-row-">
            <div className={`res-option${type === 'mockError' ? ' active' : ''}`} onClick={() => change('mockError')}>
                <Response type='error' />
            </div>
            <div className={`res-option${type === 'mockSuccess' ? ' active' : ''}`} onClick={() => change('mockSuccess')}>
                <Response type='success' />
            </div>
        </div>
    )
}
const Response: FC<{ type: 'error' | 'success' }> = ({ type }) => {
    if (type === 'error') {
        return (
            Code(
                `{ 
    status: 400, 
    data: { 
        message: 'you cannot do this action' 
    } 
}`
            )
        )
    }
    return (
        Code(
            `{ 
    status: 200, 
    data: { 
        name: 'mohammad',family:'feiz' 
    } 
}`
        )
    )
}
class APIS extends AIOApis {
    constructor() {
        super({
            token: '',
            id: 'testaioapis',
            lang: 'fa',
            onCatch: (response) => response.response.data.message
        });
    }
    mockError: I_mockMethod = () => {
        return { status: 400, data: { message: 'you cannot do this action' } }
    }
    mockSuccess: I_mockMethod = () => {
        return { status: 200, data: { name: 'mohammad', family: 'feiz' } }
    }
    getData = async (p: I_setting) => {
        return await this.request<I_data>({
            name: 'getData',
            description: 'get data',
            url: '/api-url',
            method: 'get',
            mock: { delay: 2500, methodName: p.mockType },
            onSuccess: (response: any) => {
                if(p.successMessage){this.addAlert({type:'success',subtext:'عملیات با موفقیت انجام شد',text:'دریافت اطلاعات'})}
                return response.data
            },
            onError:p.errorMessage?undefined:()=>false,
            loading:p.loading?undefined:false
        })
    }
}
function classCode(setting:I_setting) {
    return (
        `class APIS extends AIOApis {
    constructor(token:string) {
        super({
            token,
            id: 'testaioapis',
            onCatch: (response) => response.response.data.message
        });
    }
    getData = async () => {
        return await this.request<{name:string,family:string}>({
            name:'getData',
            description:'get data',
            onSuccess:(response)=>response.data,
            url:'/api-url',
            method:'get',
            ${setting.loading === false?'loading:false,':''}
            ${setting.successMessage?`successMessage:()=>'عملیات با موفقیت انجام شد',`:''}
            ${setting.errorMessage === false?`errorMessage:()=>false,`:''}
            
        })
    }
}

type I_data = { name: string, family: string }
const GetResult: FC = () => {
    const [apis] = useState<APIS>(new APIS())
    const [data,setData] = useState<I_data | string>()
    const [error,setError] = useState<string>()
    const getData = async () => {
        const res = await apis.getData()
        if(res.success){setData(res.result)}
        else {setError(res.result as string)}
    }
    return (
        <div className="example flex-col- gap-12-" key={responseType}>
            <button className='w-fit-' onClick={() => getData()}>Call Api</button>
            {
                !!data && 
                <>
                    result is:
                    {Code(JSON.stringify(data,null,4))}
                </>
            }
            {
                !!error && 
                <div style={{color:'red'}}>
                    error is:
                    {error}
                </div>
            }
        </div>
    )
}

`
    )
}