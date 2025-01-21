import { FC, useEffect, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import { Code } from './../../npm/aio-components';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import AIOApis from '../../npm/aio-apis/index.ts';
export default function DOC_AIOApis(props: any) {
    const [mock] = useState<any>(new MockAdapter(axios))
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'Example 1', id: 'e1', render: () => <Example1 mock={mock} /> }
                ]
            }}
        />
    )
}

const Example1: FC<{ mock: any }> = ({ mock }) => {
    const [data, setData] = useState<any>()
    const [apis] = useState<APIS>(new APIS())
    const getData = async () => {
        const res = await apis.getData();
        if (res) { setData(res) }
    }
    useEffect(() => {
        mock.onGet('/data').reply(400, { message: 'you cannot do this action' }, { delay: 2000 });
        getData()
    }, [])
    return (
        <div className="p-12-">
            api config:
            {
                Code(
                    `
url = /data
method = get
                    `
                )
            }
            imagine response is like this:
            {
                Code(
`{
    response:{
        data:{
            "message": "you cannot do this action"
        },
        status:400
    }
}`
                )
            }
            {
                Code(
                    `
class APIS {
    request: AIOApis["request"]
    constructor() {
        const inst = new AIOApis({ token: '', id: 'testaioapis', lang: 'fa' });
        this.request = inst.request;
    }
    getData = async () => {
        return await this.request({
            description: 'get data',
            method: 'get',
            url: '/data',
            getErrorResult: (response) => false,
            getErrorMessage: (response) => {
                return response.response.data.message
            },
            ....
        })
    }
}
                    `
                )
            }
        </div>
    )

}

class APIS {
    request: AIOApis["request"]
    constructor() {
        const inst = new AIOApis({ token: '', id: 'testaioapis', lang: 'fa' });
        this.request = inst.request;
    }
    getData = async () => {
        return await this.request({
            description: 'get data',
            method: 'get',
            url: '/data',
            getErrorResult: (response) => false,
            getSuccessResult: (response) => {
                return response.data.value
            },
            getErrorMessage: (response) => {
                return response.response.data.message
            }
        })
    }
}
