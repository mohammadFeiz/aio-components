import { FC, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import { Code } from './../../npm/aio-components';
import AIOApis from '../../npm/aio-apis/index.ts';
import './index.css';
import { I_mockMethod } from '../../npm/aio-utils/index.tsx';
import GetResult from './example1.tsx';
export default function DOC_AIOApis(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'Example1', id: 'e1', render: () => <GetResult /> },
                    { text: 'apis class', id: 'apis', render: () => <Apis /> },
                    { text: 'onCatch , getResult', id: 'onCatch', render: () => <OnCatch_GetResult /> },
                    { text: 'loading', id: 'loading', render: () => <Loading /> },
                    { text: 'loader', id: 'loader', render: () => <Loader /> },
                    { text: 'body', id: 'body', render: () => <Body /> },
                    {
                        text: 'cache', id: 'cache',
                        items: [
                            { text: 'name', id: 'cache_name', render: () => <Cache_Name /> },
                            { text: 'expiredIn', id: 'cache_expiredIn', render: () => <Cache_ExpiredIn /> },
                            { text: 'interval', id: 'cache_interval', render: () => <Cache_Interval /> },
                            { text: 'removeCache', id: 'removeCache', render: () => <RemoveCache /> }
                        ]
                    },
                    { text: 'showMessage', id: 'showMessage', render: () => <ShowMessage /> },
                    { text: 'prevent showMessage', id: 'preventShowMessage', render: () => <PreventShowMessage /> },
                    { text: 'mapResult', id: 'mapResult', render: () => <MapResult /> },
                    { text: 'getResult', id: 'getResult', render: () => <GetResultMethod /> },
                    { text: 'onCatch', id: 'onCatch', render: () => <OnCatchMethod /> },

                ]
            }}
        />
    )
}

const Apis: FC = () => {
    return (
        <div className="example">
            {
                Code(
                    `class APIS extends AIOApis {
    constructor() {
        super({
            token: '',
            id: 'testaioapis',
            lang: 'fa'
        });
    }
    getData1 = async ():Promise<{name:string,family:string} | false> => {
        return await this.request({
            id:'getData1',
            mock: {
                delay: 2500,
                result: () => ({ status: 400, data: { message: 'you cannot do this action' } })
            },
            description: 'get data',
            method: 'get',
            url: '/data1',
            onCatch: (response) => {
                return {
                    result: false,
                    errorMessage: response.response.data.message
                }
            },
            getResult: (response) => {
                return {
                    result: response.data
                }
            },
        })
    }
    getData2 = async ():Promise<{name:string,family:string} | false> => {
        return await this.request({
            id:'getData1',
            mock: {
                delay: 2500,
                result: () => ({ status: 400, data: { message: 'you cannot do this action' } })
            },
            description: 'get data',
            method: 'get',
            url: '/data1',
            onCatch: (response) => {
                return {
                    result: false,
                    errorMessage: response.response.data.message
                }
            },
            getResult: (response) => {
                return {
                    result: response.data
                }
            },
        })
    }
}`
                )
            }
        </div>
    )
}
const OnCatch_GetResult: FC = () => {
    const apiName = 'OnCatch_GetResult'
    const responseCode =
        `{ 
        status: 400, 
        data: { 
            message: 'you cannot do this action' 
        } 
    }`
    const propCode =
        `method:'get',`
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} />
}
const Loading: FC = () => {
    const apiName = 'Loading';
    const responseCode = `
{ 
    status: 200, 
    data: { 
        name: 'mohammad',family:'feiz' 
    } 
}`
    const propCode =
        `loading:false`
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} />
}
const Loader: FC = () => {
    const apiName = 'Loader';
    const responseCode = `
{ 
    status: 200, 
    data: { 
        name: 'mohammad',family:'feiz' 
    } 
}`
    const propCode =
        `loading:true,
            loader:(
                <svg class='sdsas' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13,2.03C17.73,2.5 21.5,6.25 21.95,11C22.5,16.5 18.5,21.38 13,21.93V19.93C16.64,19.5 19.5,16.61 19.96,12.97C20.5,8.58 17.39,4.59 13,4.05V2.05L13,2.03M11,2.06V4.06C9.57,4.26 8.22,4.84 7.1,5.74L5.67,4.26C7.19,3 9.05,2.25 11,2.06M4.26,5.67L5.69,7.1C4.8,8.23 4.24,9.58 4.05,11H2.05C2.25,9.04 3,7.19 4.26,5.67M2.06,13H4.06C4.24,14.42 4.81,15.77 5.69,16.9L4.27,18.33C3.03,16.81 2.26,14.96 2.06,13M7.1,18.37C8.23,19.25 9.58,19.82 11,20V22C9.04,21.79 7.18,21 5.67,19.74L7.1,18.37M12,16.5L7.5,12H11V8H13V12H16.5L12,16.5Z" />
                </svg>        
            )`
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} />
}
const Body: FC = () => {
    const apiName = 'Body';
    const responseCode = `
{ 
    status: 200, 
    data: { 
        name: 'mohammad',family:'feiz',message:${'`sent'} id is ${'${body.id}`'}}
    }
}`
    const propCode =
        `method:'post',
            body:{id},`
    const param = `id:string`
    const body = 'id1432234'
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} param={param} body={body} />
}
const Cache_Name: FC = () => {
    const apiName = 'Cache_Name';
    const responseCode = `
{ 
    status: 200, 
    data: { 
        name: 'mohammad',family:'feiz',message:'sent id is id1432234'
    }
}`
    const propCode =
        `method:'get',
            cache:{name:'user1'}`
    const param = `id:string`
    const body = 'id1432234'
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} param={param} body={body} />
}
const Cache_ExpiredIn: FC = () => {
    const apiName = 'Cache_ExpiredIn';
    const responseCode = `
{ 
    status: 200, 
    data: { 
        name: 'mohammad',family:'feiz',message:'sent id is id1432234'
    }
}`
    const propCode =
        `method:'get',
            cache:{
                name:'user1',
                expiredIn:new Date().getTime() + 10000
            }`
    const param = `id:string`
    const body = 'id1432234'
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} param={param} body={body} />
}
const Cache_Interval: FC = () => {
    console.log('call Cache_Interval component')
    const apiName = 'Cache_Interval';
    const responseCode = `
{ 
    status: 200, 
    data: { 
        name: 'mohammad',family:'feiz',message:'sent id is id1432234'
    }
}`
    const propCode =
        `method:'get',
            cache:{
                name:'user1',
                expiredIn:new Date().getTime() + 40000,
                inteval:10 * 1000,
            }`
    const param = `id:string`
    const body = 'id1432234'
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} param={param} body={body} />
}
const RemoveCache: FC = () => {
    const apiName = 'RemoveCache';
    const responseCode = `
{ 
    status: 200, 
    data: { 
        name: 'mohammad',family:'feiz',message:'sent id is id1432234'
    }
}`
    const propCode =
        `method:'get',
            cache:{name:'user1'}`
    const param = `id:string`
    const body = 'id1432234'
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} param={param} body={body} removeCache='user1' />
}

const ErrorResult: FC = () => {
    const apiName = 'ErrorResult'
    const responseCode =
        `{ 
        status: 400, 
        data: { 
            message: 'you cannot do this action' 
        } 
    }`
    const propCode =
        `method:'get',
            errorResult:{}`
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} />
}
const ShowMessage: FC = () => {
    const apiName = 'ShowMessage';
    const responseCode = `
{ 
    status: 200, 
    data: { 
        name: 'mohammad',family:'feiz' 
    } 
}`
    const propCode =
        `showMessage:(response)=>({type:'success',text:'operation was successful',subtext:'sent id is id34532'})`
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} />
}
const PreventShowMessage: FC = () => {
    const apiName = 'PreventShowMessage'
    const responseCode =
        `{ 
        status: 400, 
        data: { 
            message: 'you cannot do this action' 
        } 
    }`
    const propCode =
        `method:'get',
    showMessage:()=>false`
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} />
}
const MapResult: FC = () => {
    const apiName = 'MapResult'
    const responseCode =
        `{ 
    status: 200, 
    data: { 
        items:[
            {
                name:'mohammad',
                family:'feiz'
            }
        ]
    } 
}`
    const propCode =
        `method:'get',
            mapResult:(result)=>result.items[0]`
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} />
}
const GetResultMethod: FC = () => {
    const apiName = 'GetResultMethod'
    const responseCode =
        `{ 
    status: 200, 
    data: { 
        items:[
            {
                name:'mohammad',
                family:'feiz'
            }
        ]
    } 
}`
    const propCode =
        `method:'get',`
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} gm={true} />
}
const OnCatchMethod: FC = () => {
    const apiName = 'OnCatchMethod'
    const responseCode =
        `{ 
        status: 400, 
        data: { 
            messages: [
                {message:'you cannot do this action' }
            ]
        } 
    }`
    const propCode =
        `method:'get',`
    return <Sample apiName={apiName} responseCode={responseCode} propCode={propCode} om={true} />
}


class APIS extends AIOApis {
    constructor() {
        super({
            token: '',
            id: 'testaioapis',
            lang: 'fa',
            onCatch: {
                main:(response) => response.response.data.message,
                second: (response) => response.response.data.messages[0].message,
            },
            getResult: {
                main:(response) => response.data,
                second: (response) => response.data.items[0],
            },
        });
    }
    mock1: I_mockMethod = () => ({ status: 400, data: { message: 'you cannot do this action' } })
    mock2: I_mockMethod = () => ({ status: 200, data: { name: 'mohammad', family: 'feiz' } })
    mock3: I_mockMethod = (config: any) => {
        const data = JSON.parse(config.data)
        return { status: 200, data: { name: 'mohammad', family: 'feiz', message: `sent id is ${data.id}` } }
    }
    mock4: I_mockMethod = () => {
        const time = new Date().getTime()
        return { status: 200, data: { name: 'mohammad', family: 'feiz', time } }
    }
    mock_MapResult: I_mockMethod = () => {
        return {
            status: 200,
            data: {
                items: [
                    {
                        name: 'mohammad',
                        family: 'feiz'
                    }
                ]
            }
        }
    }
    mock_GetResutMethod: I_mockMethod = () => {
        return {
            status: 200,
            data: {
                items: [
                    {
                        name: 'mohammad',
                        family: 'feiz'
                    }
                ]
            }
        }
    }
    mock_OnCatchMethod: I_mockMethod = () => {
        return {
            status: 400,
            data: {
                messages: [
                    { message: 'you cannot do this action' }
                ]
            }
        }
    }
    OnCatch_GetResult = async () => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock1' }, name: 'OnCatch_GetResult', description: 'get data', method: 'get', url: '/OnCatch_GetResult',
            getResult:'main',onCatch:'main'
        })
    }
    Loading = async () => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock2' }, loading: false, description: 'get data', method: 'get', url: '/Loading',
            getResult:'main',onCatch:'main',
            name: 'Loading'
        })
    }
    Loader = async () => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock2' }, name: 'Loader', description: 'get data', method: 'get', url: '/Loader',
            getResult:'main',onCatch:'main',
            loading: true, loader: (
                `<svg class='sample-loader' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13,2.03C17.73,2.5 21.5,6.25 21.95,11C22.5,16.5 18.5,21.38 13,21.93V19.93C16.64,19.5 19.5,16.61 19.96,12.97C20.5,8.58 17.39,4.59 13,4.05V2.05L13,2.03M11,2.06V4.06C9.57,4.26 8.22,4.84 7.1,5.74L5.67,4.26C7.19,3 9.05,2.25 11,2.06M4.26,5.67L5.69,7.1C4.8,8.23 4.24,9.58 4.05,11H2.05C2.25,9.04 3,7.19 4.26,5.67M2.06,13H4.06C4.24,14.42 4.81,15.77 5.69,16.9L4.27,18.33C3.03,16.81 2.26,14.96 2.06,13M7.1,18.37C8.23,19.25 9.58,19.82 11,20V22C9.04,21.79 7.18,21 5.67,19.74L7.1,18.37M12,16.5L7.5,12H11V8H13V12H16.5L12,16.5Z" />
                </svg>
                `
            )
        })
    }
    Body = async (id: string) => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock3' }, name: 'Body', description: 'get data', method: 'post', url: '/Body',
            getResult:'main',onCatch:'main',
            body: { id }
        })
    }
    Cache_Name = async (id: string) => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock4' }, name: 'Cache_Name', description: 'get data', method: 'get', url: '/Cache_Name', body: { id },
            getResult:'main',onCatch:'main',
            cache: { name: 'user1' }
        })
    }
    Cache_ExpiredIn = async (id: string) => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock4' }, name: 'Cache_ExpiredIn', description: 'get data', method: 'get', url: '/Cache_ExpiredIn', body: { id },
            getResult:'main',onCatch:'main',
            cache: { name: 'user1', expiredIn: new Date().getTime() + 10000 }
        })
    }
    Cache_Interval = async (id: string) => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock4' }, name: 'Cache_Interval', description: 'get data', method: 'get', url: '/Cache_Interval', body: { id },
            getResult:'main',onCatch:'main',
            cache: { name: 'user1', expiredIn: new Date().getTime() + 40000, interval: 10 * 1000 }
        })
    }
    RemoveCache = async (id: string) => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock4' }, name: 'RemoveCache', description: 'get data', method: 'get', url: '/RemoveCache', body: { id },
            getResult:'main',onCatch:'main',
            cache: { name: 'user1' }
        })
    }
    ShowMessage = async () => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock2' }, loading: true, name: 'ShowMessage', description: 'get data', method: 'get', url: '/ShowMessage',
            getResult:'main',onCatch:'main',
            showMessage: (response) => ({ type: 'success', text: 'operation was successful', subtext: 'sent id is id34532' })
        })
    }
    PreventShowMessage = async () => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock1' },
            name: 'PreventShowMessage', description: 'get data', method: 'get', url: '/PreventShowMessage',
            getResult:'main',onCatch:'main',
            showMessage: () => false
        })
    }
    MapResult = async () => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock_MapResult' },
            name: 'MapResult', description: 'get data', method: 'get', url: '/MapResult',
            getResult:'main',onCatch:'main',
            mapResult: (result) => result.items[0]
        })
    }
    GetResultMethod = async () => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock_GetResutMethod' },
            name: 'GetResultMethod', description: 'get data', method: 'get', url: '/GetResultMethod',
            getResult:'second',onCatch:'main',
        })
    }
    OnCatchMethod = async () => {
        return await this.request<{ name: string, family: string }>({
            mock: { delay: 2500, methodName: 'mock_OnCatchMethod' },
            name: 'OnCatchMethod', description: 'get data', method: 'get', url: '/OnCatchMethod',
            getResult:'main',onCatch:'second',
        })
    }


}
type I_Sample = { apiName: string, responseCode: string, propCode: string, param?: string, body?: any, removeCache?: string, gm?: boolean, om?: boolean }
const Sample: FC<I_Sample> = ({ apiName, responseCode, propCode, param, body, removeCache, gm, om }) => {
    console.log('call Sample Component')
    const [data, setData] = useState<any>()
    const [apis] = useState<APIS>(getApis)
    function getApis() {
        console.log('create aio-apis instance')
        return new APIS()
    }
    const getData = async (body: any) => {
        const res = await (apis as any)[apiName](body);
        setData(res)
    }
    return (
        <div className="example">
            {
                Code(
                    `class APIS extends AIOApis {
    constructor() {
        super({
            token: '',
            id: 'testaioapis',
            lang: 'fa',
            onCatch: {
                main:(response) => response.response.data.message,
                second: (response) => response.response.data.messages[0].message,
            },
            getResult: {
                main:(response) => response.data,
                second: (response) => response.data.items[0],
            }
        });
    }
    getData = async (${param || ''}):Promise<{success:boolean,result:{name:string,family:string} | false}> => {
        return await this.request({
            id:'getData',
            getResult:'${!!gm ? `second` : 'main'}'
            onCatch:'${!!om ? `second` : 'main'}'
            url:'/api-url',${propCode ? `\n            ${propCode}` : ''}
        })
    }
    ...
}`
                )
            }
            <h3>{`api response is`}</h3>
            {Code(responseCode)}
            {
                Code(
                    `const [apis] = useState<APIS>(new APIS())
...
const result = await apis.getData()`
                )
            }
            <button onClick={() => getData(body)}>{`click to call apis.getData and see result`}</button><br />
            {!!removeCache && <button onClick={() => apis.removeCache(apiName, removeCache)}>{`click to remove api cache`}</button>}
            {
                !!removeCache && Code(
                    `const apiName = 'getData';
const cacheName = '${removeCache}';
apis.removeCache(apiName,cacheName)`
                )
            }
            {
                data !== undefined &&
                <>

                    <p>{`result is :`}</p>
                    {Code(data === false ? 'false' : JSON.stringify(data, null, 4))}

                </>
            }

        </div>
    )

}