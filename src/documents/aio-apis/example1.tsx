import { FC, useEffect, useRef, useState } from "react";
import AIOApis from "../../npm/aio-apis";
import { Code } from "../../npm/aio-components";
import { I_mockMethod } from "../../npm/aio-utils";
type I_data = { name: string, family: string }
type I_rt = 'error' | 'success'
const GetResult: FC = () => {
    const [responseType, setResponseType] = useState<I_rt>('error')
    const ref = useRef(responseType)
    ref.current = responseType
    const getResponseType = () => ref.current
    const [apis] = useState<APIS>(new APIS(getResponseType))
    const [data,setData] = useState<I_data | string>()
    const [error,setError] = useState<string>()
    const getData = async () => {
        const res = await apis.getData()
        if(res.success){setData(res.result)}
        else {setError(res.result as string)}
    }
    return (
        <div className="example flex-col- gap-12-" key={responseType}>
            {Code(classCode())}
            <div className="msf">
                <Responses type={responseType} change={(type) => {
                    setResponseType(type)
                    setError(undefined)
                    setData(undefined)
                }} />
            </div>
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
export default GetResult

const Responses: FC<{ type: I_rt, change: (v: I_rt) => void }> = ({ type, change }) => {
    return (
        <div className="flex-row-">
            <div className={`res-option${type === 'error' ? ' active' : ''}`} onClick={() => change('error')}>
                <Response type='error' />
            </div>
            <div className={`res-option${type === 'success' ? ' active' : ''}`} onClick={() => change('success')}>
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
    getResponseType: () => I_rt
    constructor(getResponseType: () => I_rt) {
        super({
            token: '',
            id: 'testaioapis',
            lang: 'fa',
            onCatch: {
                main: (response) => response.response.data.message
            },
            getResult: {
                main: (response) => response.data
            }
        });
        this.getResponseType = getResponseType
    }
    mock = () => {
        const rt = this.getResponseType()
        if (rt === 'error') { return { status: 400, data: { message: 'you cannot do this action' } } }
        return { status: 200, data: { name: 'mohammad', family: 'feiz' } }
    }
    getData = async () => {
        return await this.request<I_data>({
            name: 'getData',
            mock: { delay: 2500, methodName: 'mock' },
            description: 'get data',
            getResult: 'main',
            onCatch: 'main',
            url: '/api-url',
            method: 'get',
        })
    }
}
function classCode() {
    return (
        `class APIS extends AIOApis {
    constructor(token:string) {
        super({
            token,
            id: 'testaioapis',
            onCatch: {
                main:(response) => response.response.data.message,
            },
            getResult: {
                main:(response) => response.data,
            }
        });
    }
    getData = async () => {
        return await this.request<{name:string,family:string}>({
            name:'getData',
            description:'get data',
            getResult:'main',
            onCatch:'main',
            url:'/api-url',
            method:'get',
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