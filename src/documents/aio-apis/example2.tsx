import { FC, useEffect, useRef, useState } from "react";
import AIOApis, { AA_api } from "../../npm/aio-apis";
import { Code } from "../../npm/aio-components";
import { I_mockMethod } from "../../npm/aio-utils";
import { AICheckbox } from "../../npm/aio-input";
type I_data = { name: string, family: string }

const GetResult: FC = () => {
    const [apis] = useState<APIS>(new APIS())
    const [data, setData] = useState<I_data | string>()
    const [error, setError] = useState<string>()
    const getData = async () => {
        const res = await apis.getData()
        if (res) { setData(res) }
    }
    return (
        <div className="example flex-col- gap-12-">
            {Code(classCode())}
            <button className='w-fit-' onClick={() => getData()}>Call Api</button>
            {
                !!data &&
                <>
                    result is:
                    {Code(JSON.stringify(data, null, 4))}
                </>
            }
            {
                !!error &&
                <div style={{ color: 'red' }}>
                    error is:
                    {error}
                </div>
            }
        </div>
    )
}
export default GetResult
class APIS extends AIOApis {
    constructor() {
        super({
            token: '',
            id: 'testaioapis2',
            lang: 'fa',
            onCatch: {
                main: (response) => response.response.data.message
            },
        });
    }
    mockSuccess: I_mockMethod = () => {
        return { status: 200, data: { name: 'mohammad', family: 'feiz',time:new Date().getTime() } }
    }
    getData = async () => {
        return await this.request<I_data>({
            name: 'getData',
            description: 'get data',
            onCatch: 'main',
            url: '/api-url',
            method: 'get',
            mock: { delay: 2500, methodName: 'mockSuccess' },
            getResult: (response: any) => response.data,
            cache:{
                expiredIn:new Date().getTime() + (12000),
                name:'data'
            }
            
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