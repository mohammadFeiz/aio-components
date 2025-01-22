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
                    { text: 'Example1', id: 'e1', render: () => <Example1 mock={mock} /> },
                    { text: 'Example2', id: 'e2', render: () => <Example2 mock={mock} /> },
                    { text: 'Example3', id: 'e3', render: () => <Example3 mock={mock} /> },
                    { text: 'Example4', id: 'e4', render: () => <Example4 mock={mock} /> },
                ]
            }}
        />
    )
}

const Apis: FC = () => {
    return null
}
const Example1: FC<{ mock: any }> = ({ mock }) => {
    const [data, setData] = useState<any>()
    const [apis] = useState<APIS>(new APIS())
    const getData = async () => {
        const res = await apis.getData1();
        if (res) { setData(res) }
    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <div className="example">
            {!!data && JSON.stringify(data, null, 4)}
        </div>
    )

}
const Example2: FC<{ mock: any }> = ({ mock }) => {
    const [data, setData] = useState<any>()
    const [apis] = useState<APIS>(new APIS())
    const getData = async () => {
        const res = await apis.getData2();
        if (res) { setData(res) }
    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <div className="example">
            {!!data && JSON.stringify(data, null, 4)}
        </div>
    )

}
const Example3: FC<{ mock: any }> = ({ mock }) => {
    const [data, setData] = useState<any>()
    const [apis] = useState<APIS>(new APIS())
    const getData = async () => {
        const res = await apis.getData3();
        if (res) { setData(res) }
    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <div className="example">
            {!!data && JSON.stringify(data, null, 4)}
        </div>
    )

}
const Example4: FC<{ mock: any }> = ({ mock }) => {
    const [data, setData] = useState<any>()
    const [apis] = useState<APIS>(new APIS())
    const getData = async () => {
        const res = await apis.getData4();
        if (res) { setData(res) }
    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <div className="example">
            {!!data && JSON.stringify(data, null, 4)}
        </div>
    )

}


class APIS extends AIOApis {
    constructor() {
        super({
            token: '',
            id: 'testaioapis',
            lang: 'fa',
            onCatch: (response) => ({
                result: false,
                errorMessage: response.response?.data?.message || 'Unknown error occurred',
            }),
        });
    }
    getData1 = async () => {
        return await this.request({
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
    getData2 = async () => {
        return await this.request({
            mock: {
                delay: 2500,
                result: () => ({ status: 200, data: { name: 'moahmmad', family: 'feiz' } })
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
                return { result: response.data }
            }
        })
    }
    getData3 = async () => {
        return await this.request({
            mock: {
                delay: 2500,
                result: () => ({ status: 200, data: { name: 'moahmmad', family: 'feiz' } })
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
                    result: response.data,
                    successMessage: 'عملیات با موفقیت انجام شد'
                }
            }
        })
    }
    getData4 = async () => {
        return await this.request({
            mock: {
                delay: 2500,
                result: () => ({ status: 400, data: { message: 'you cannot do this action' } })
            },
            description: 'get data',
            method: 'get',
            url: '/data3',
            getResult: (response) => {
                return {
                    result: response.data,
                    successMessage: 'عملیات با موفقیت انجام شد'
                }
            }
        })
    }
}