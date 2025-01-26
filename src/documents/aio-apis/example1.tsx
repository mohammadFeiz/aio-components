import { FC, useEffect, useState } from "react";
import AIOApis from "../../npm/aio-apis";
type I_data = {name:string,family:string}
const GetResult:FC = ()=>{
    const token = 'fdglk4h5n6lk4h3lk45hl3k'
    const [apis] = useState<APIS>(new APIS(token)) 
    const [data,setData] = useState<I_data>()
    const getData = async ()=>{
        const res = await apis.getData1()
        if(res.success){setData(res.result as I_data)}
    }
    useEffect(()=>{
        getData()
    },[])
    if(!data){return null}
    return <>{JSON.stringify(data)}</>
}
export default GetResult
class APIS extends AIOApis {
    constructor(token:string) {
        super({
            token,
            id: 'testexample1',
            onCatch: (response) => response.response.data.message,
            getResult: (response) => response.data,
            errorResult:false,
        });
    }
    getData1 = async ():Promise<{success:boolean,result:{name:string,family:string} | false}> => {
        return await this.request({
            name:'getData1',
            description:'get data 1',
            url:'/api-url',
            method:'get',
        })
    }
}