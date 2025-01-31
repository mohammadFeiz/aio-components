import { FC, useState } from "react";
import AIOApis from "../../npm/aio-apis";
import { Code } from "../../npm/aio-components";
import { I_mockMethod } from "../../npm/aio-utils";
type I_data = { name: string, family: string,time:number }

const CacheInterval: FC = () => {
    const [apis] = useState<APIS>(getApis)
    function getApis(){
        return new APIS()
    }
    const [data, setData] = useState<I_data | string>()
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
        </div>
    )
}
export default CacheInterval
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
                expiredIn:new Date().getTime() + (40000),
                interval:10000,
                name:'data'
            }
            
        })
    }
}
function classCode() {
    return (
`type I_data = { name: string, family: string,time:number }

class APIS extends AIOApis {
    constructor(token:string) {
        super({
            token,
            id: 'testaioapis',
            onCatch: {
                main:(response) => response.response.data.message,
            }
        });
    }
    getData = async () => {
        return await this.request<{name:string,family:string}>({
            name: 'getData',
            description: 'get data',
            onCatch: 'main',
            url: '/api-url',
            method: 'get',
            getResult: (response: any) => response.data,
            cache:{
                expiredIn:new Date().getTime() + (12000),
                name:'data'
            }
        })
    }
}
const GetResult: FC = () => {
    const [apis] = useState<APIS>(new APIS())
    const [data,setData] = useState<I_data | string>()
    const getData = async () => {
        const res = await apis.getData()
        if(res){setData(res)}
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
        </div>
    )
}`
    )
}