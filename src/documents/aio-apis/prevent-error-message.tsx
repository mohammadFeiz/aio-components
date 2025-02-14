import { FC, useState } from "react"
import AIOApis, { useInstance } from "../../npm/aio-apis"
import { Code } from "../../npm/aio-component-utils"

type I_user = { name: string, family: string }
const PreventErrorMessage: FC = () => {
    const token='fdyte646345345vfgvd'
    const base_url = 'http://my-apis'
        
    const apis = useInstance<Apis>(new Apis({ token, base_url }))
    const [users, setUsers] = useState<I_user[]>()
    const getData = async () => {
        const res = await apis.getUsers()
        if (res) { setUsers(res) }
    }
    return (
        <div className="example flex-col- gap-12-">
            <h3>In this example response is</h3>
            {
                Code(`
{
    response:{ 
        status: 400, 
        data: { message: 'you cannot do this action' } 
    }
}
                `)
            }
            <h3>implement apis class</h3>
            {
                Code(`
type I_user = { name: string, family: string }
                `)
            }
            {
                Code(`
import AIOApis from 'aio-apis';
class Apis extends AIOApis {
    base_url:string;
    constructor(props: { token: string, base_url: string }) {
        super({
            id: 'apitest',
            token: props.token,
            onCatch: (response) => response.response.data.message
        })
        this.base_url = props.base_url;
    }
    getUsers = async () => {
        return await this.request<I_user[]>({
            name: 'getUsers',
            description: 'get users',
            method: 'get',
            url: ${'`${this.base_url}/users/getUser`'},
            onSuccess: (response) => response.data,
            onError:()=>false,
        })
    }
}
                    `)
            }
            <h3>use apis class in React</h3>
            {
                Code(`
import { useInstance } from '../../npm/aio-apis/index.ts';
const App: FC = () => {
    const token='fdyte646345345vfgvd'
    const base_url = 'http://my-apis'
    const apis = useInstance<Apis>(new Apis({ token, base_url }))
    const [users, setUsers] = useState<I_user[]>()
    const getData = async () => {
        const res = await apis.getUsers()
        if (res) { setUsers(res) }
    }
    return (
        <div className="example flex-col- gap-12-">
            <button className='w-fit-' onClick={() => getData()}>Call Api</button>
            {
                !!users &&
                JSON.stringify(users,null,4)
            }
            {
                !users && <div>users not fetched</div>
            }
            
        </div>
    )
}
                    
                `)
            }
            <button className='w-fit-' onClick={() => getData()}>Call Api</button>
            {
                !!users &&
                JSON.stringify(users,null,4)
            }
            {
                !users && <div>users not fetched</div>
            }
            
        </div>
    )
}
export default PreventErrorMessage
class Apis extends AIOApis {
    base_url:string;
    constructor(props: { token: string, base_url: string }) {
        super({
            id: 'apitest',
            token: props.token,
            onCatch: (response) => response.response.data.message
        })
        this.base_url = props.base_url
    }
    mockError = () => {
        return { status: 400, data: { message: 'you cannot do this action' } }
    }
    mockSuccess = () => {
        return { 
            status: 200, 
            data: [
                { name: 'david', family: 'anderson' },
                { name:'john',family:'doe'}
            ]
        }
    }
    getUsers = async () => {
        return await this.request<I_user[]>({
            name: 'getUsers',
            mock: { delay: 2000, methodName: 'mockError' },
            description: 'get users',
            method: 'get',
            url: `${this.base_url}/users/getUsers`,
            onError:()=>false,
            onSuccess: (response) => response.data
        })
    }
}