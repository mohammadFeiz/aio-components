import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Alert, Loading } from './../../npm/aio-popup';
import { Stall, Storage } from '../aio-utils';
import { useRef } from 'react';

export type AA_api<T> = {
    description: string,
    name: string,
    method: 'post' | 'get' | 'delete' | 'put' | 'patch',
    url: string,
    body?: any,
    loading?: boolean,
    cache?: { name: string, expiredIn?: number },//AA_cache
    mock?: { delay: number, methodName: string },
    headers?: any,
    token?: string,
    loader?: string, loadingParent?: string,
    onSuccess: (data: any) => T,
    onError?: (response: any, message: string) => string | false,
    retries?: number[]
}
type I_cachedApi<T> = {
    api: AA_api<T>,
    value: any,
}
export default class AIOApis {
    props: {
        id: string,
        token: string,
        loader?: string,
        onCatch: (err: any, api: AA_api<any>) => string,
        headers?: any,
        lang?: 'en' | 'fa'
    };
    token: string;
    currentError:string = '';
    private cache: Cache;
    getCachedValue: Cache["getCachedValue"]
    fetchCachedValue: Cache["fetchCachedValue"]
    removeCache: Cache["removeCache"]
    apisThatAreInLoadingTime: { [apiName: string]: boolean | undefined } = {}
    constructor(props: {
        id: string,
        token: string,
        loader?: string,
        onCatch: (err: any, api: AA_api<any>) => string,
        headers?: any,
        lang?: 'en' | 'fa'
    }) {
        console.log('aio-apis constructor')
        this.props = props
        const storage = new Storage(props.id);
        this.token = props.token;
        this.setToken(props.token);
        this.cache = new Cache(storage, async (cachedApi: I_cachedApi<any>) => await this.callCache(cachedApi.api));
        this.getCachedValue = this.cache.getCachedValue;
        this.fetchCachedValue = this.cache.fetchCachedValue;
        this.removeCache = this.cache.removeCache;
    }
    setToken = (token: string) => {
        if (token && token === this.token) { Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; }
    }
    addAlert = (p: { type: 'success' | 'error' | 'warning' | 'info', text: string, subtext?: string, time?: number }) => {
        let { type, text, subtext, time } = p;
        Alert({ type, text, subtext, time, className: 'aio-apis-popup', closeText: this.props.lang === 'fa' ? 'بستن' : 'Close' })
    }
    getUrlQueryParam = (params?: { [key: string]: string } | string) => {
        if (typeof params === 'string') { return `/${params}`; }
        else if (typeof params === 'object' && params !== null) {
            const queryString = Object.keys(params)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');
            return `?${queryString}`;
        }
        return '';
    }
    private responseToResult = async <T>(api: AA_api<T>): Promise<{ result: T | false, errorMessage: string, success: boolean, response: any }> => {
        const { headers = this.props.headers, onSuccess } = api;
        const { onCatch } = this.props;
        if (!onCatch) {
            const errorMessage = `
                missing onCatch in api: ${api.description},
                you should set onCatch in api or in props of AIOApis    
            `
            return { result: false, errorMessage, success: false, response: {} }
        }
        try {
            let response = await Axios({ method: api.method, url: api.url, data: api.body, headers })
            try { return { result: onSuccess(response), success: true, response, errorMessage: '' } }
            catch (err: any) { return { result: err.message, success: false, response, errorMessage: '' } }
        }
        catch (response: any) {
            try { return { result: false, errorMessage: onCatch(response, api), success: false, response } }
            catch (err: any) { return { result: false, errorMessage: err.message, success: false, response } }
        }
    }
    private loading = (api: AA_api<any>, state: boolean) => {
        const { loading = true, loader = this.props.loader, name, loadingParent } = api;
        if (loading) {
            const aioLoading = new Loading(loader)
            aioLoading[state ? 'show' : 'hide'](name, loadingParent)
        }
    }
    private handleMock = (api: AA_api<any>) => {
        if (api.mock && !!(this as any)[api.mock.methodName]) {
            const methodName = api.mock.methodName;
            handleMockApi({ url: api.url, delay: api.mock.delay, method: api.method, result: (config) => (this as any)[methodName](config) })
        }
    }
    callCache = async (api: AA_api<any>): Promise<any> => {
        if (this.apisThatAreInLoadingTime[api.name]) { return false }
        this.setToken(api.token || this.props.token)
        this.handleMock(api)
        this.apisThatAreInLoadingTime[api.name] = true;
        let { success, response } = await this.responseToResult(api);
        this.apisThatAreInLoadingTime[api.name] = false
        if (success) { return response }
    };
    requestFn = async <T>(api: AA_api<T>,isRetry?:boolean): Promise<T | false> => {
        if (this.apisThatAreInLoadingTime[api.name]) { return false }
        this.setToken(api.token || this.props.token)
        this.handleMock(api)
        if (api.cache) {
            let cachedValue = this.cache.getCachedValue(api.name, api.cache.name);
            if (cachedValue !== undefined) { return api.onSuccess(cachedValue) }
        }
        else { this.cache.removeCache(api.name) }
        this.loading(api, true); this.apisThatAreInLoadingTime[api.name] = true;
        let { result, errorMessage, success, response } = await this.responseToResult(api);
        this.loading(api, false); this.apisThatAreInLoadingTime[api.name] = false;
        if (!success) {
            let message: string | false = errorMessage;
            if (api.onError) { message = api.onError(response, message) }
            if (typeof message === 'string') {
                this.currentError = message
                if(!isRetry){
                    let text: string = this.props.lang === 'fa' ? `${api.description} با خطا روبرو شد` : `An error was occured in ${api.description}`;
                    this.addAlert({ type: 'error', text, subtext: message });
                }
            }
        }
        else if (api.cache) { this.cache.setCache(api.name, api.cache.name, { api, value: response }) }
        return result;
    };
    retries = async <T>(api:AA_api<T>,times:number[]): Promise<T | false> => {
        const retries = [0, ...times] as number[]
        return await new Promise(async (resolve) => {
            for (let i = 0; i < retries.length; i++) {
                await Stall(retries[i])
                if (i < retries.length - 1) {
                    const res = await this.requestFn<T>(api,true)
                    if (res !== false) { return resolve(res); break; }
                    else {
                        console.log(`aio-apis => retries[${i}] failed`)
                        console.log(`api error is : ${this.currentError}`)
                    }
                }
                else { 
                    const res = await this.requestFn<T>(api)
                    resolve(res) 
                }
            }
        })
    }
    request = async <T>(api: AA_api<T>): Promise<T | false> => {
        if (api.retries) {return await this.retries(api,api.retries)}
        else {return await this.requestFn<T>(api)}
    }
}
export type I_mock = {
    url: string,delay: number,
    method: 'post' | 'get' | 'delete' | 'put' | 'patch',
    result: ((body: any) => { status: number, data: any })
}
function handleMockApi(p: I_mock) {
    // const methodRes = {'get':'onGet','post':'onPost'}[p.method]
    // const fn = (mock as any)[methodRes]
    const mock = new MockAdapter(Axios);
    if (p.method === 'get') {
        mock.resetHandlers();
        mock.onGet(p.url).replyOnce((config: any) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const { status, data } = p.result(config)
                    resolve([status, data]);
                    mock.restore();
                }, p.delay);
            });
        });
    }
    if (p.method === 'post') {
        mock.resetHandlers();
        mock.onPost(p.url).replyOnce((config: any) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const { status, data } = p.result(config)
                    resolve([status, data]);
                    mock.restore();
                }, p.delay);
            });
        });
    }

}
type I_callApi = (cachedApi: I_cachedApi<any>) => Promise<any>
class Cache {
    private storage: Storage;
    private callApi: I_callApi;
    constructor(storage: Storage, callApi: I_callApi) {
        this.storage = storage;
        this.callApi = callApi;
    }
    private updateCacheByKey = async (key: string) => {
        if (this.storage.isExpired(key)) { this.storage.remove(key); return; }
        const cachedApi = this.storage.load(key); if (!cachedApi) { return }
        const { api } = cachedApi; if (!api.cache) { return }
        const value = await this.callApi(cachedApi);
        const newCachedApi: I_cachedApi<any> = { api: cachedApi.api, value }
        this.setCache(api.name, api.cache.name as string, newCachedApi)
    }
    getCachedValue = (apiName: string, cacheName: string): any => {
        const key = `${apiName}-${cacheName}`;
        let cachedApi = this.storage.load(key);
        if (cachedApi !== undefined) { return cachedApi.value }
    }
    fetchCachedValue = (apiName: string, cacheName: string) => this.updateCacheByKey(`${apiName}-${cacheName}`)
    setCache = (apiName: string, cacheName: string, cachedApi: I_cachedApi<any>) => {
        const key = `${apiName}-${cacheName}`;
        const expiredIn = cachedApi.api.cache?.expiredIn;
        this.storage.save(key, cachedApi, expiredIn);
    }
    removeCache = (apiName: string, cacheName?: string) => {
        if (cacheName) { this.storage.remove(`${apiName}-${cacheName}`) }
        else {
            const keys = this.storage.getKeys()
            for (let key of keys) {
                if (key.indexOf(`${apiName}-`) === 0) {
                    this.storage.remove(key)
                }
            }
        }
    }
}
export const useInstance = <T extends Record<string, any>>(inst:T):T=>{
    let res = useRef<any>(null)
    if(res.current === null){res.current = inst}
    return res.current
}

