import { FC, useState } from "react";
import AIOApis from "../../npm/aio-apis";
import { Code } from "../../npm/aio-component-utils";
import { I_mockMethod } from "../../npm/aio-utils";
type I_data = { name: string, family: string,time:number }

const EditCache: FC = () => {
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
            <button className='w-fit-' onClick={() => apis.fetchCachedValue('getData','data')}>fetch cached value</button>
            <button className='w-fit-' onClick={() => apis.removeCache('getData','data')}>remove cache</button>
            
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
export default EditCache
class APIS extends AIOApis {
    constructor() {
        super({
            token: '',
            id: 'testaioapis2543',
            onCatch: (response) => response.response.data.message
        });
    }
    mockSuccess: I_mockMethod = () => {
        return { status: 200, data: { name: 'mohammad', family: 'feiz',time:new Date().getTime() } }
    }
    getData = async () => {
        return await this.request<I_data>({
            name: 'getData',
            description: 'get data',
            url: '/api-url',
            method: 'get',
            mock: { delay: 2500, methodName: 'mockSuccess' },
            onSuccess: (response: any) => response.data,
            cache:{
                expiredIn:new Date().getTime() + (12000),
                name:'data'
            }
        })
    }
}
function classCode() {
    return (
`type I_data = { name: string, family: string,time:number }

class APIS extends AIOApis {
    constructor() {
        super({
            token: '',
            id: 'testaioapis2543',
            onCatch: (response) => response.response.data.message
        });
    }
    getData = async () => {
        return await this.request<I_data>({
            name: 'getData',
            description: 'get data',
            url: '/api-url',
            method: 'get',
            onSuccess: (response: any) => response.data,
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
            <button 
                className='w-fit-' 
                onClick={() => getData()}
            >Call Api</button>
            <button 
                className='w-fit-' 
                onClick={() => apis.fetchCachedValue('getData','data')}
            >fetch cached value</button>
            <button 
                className='w-fit-' 
                onClick={() => apis.removeCache('getData','data')}
            >remove cache</button>
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