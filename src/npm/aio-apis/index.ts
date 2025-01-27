import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Alert, Loading } from './../../npm/aio-popup';

export type AA_api<T> = {
    description: string,
    name: string,
    method: 'post' | 'get' | 'delete' | 'put' | 'patch',
    url: string,
    body?: any,
    loading?: boolean,
    cache?: { name: string, expiredIn?: number, interval?: number },//AA_cache
    mock?: { delay: number, methodName: string },
    headers?: any,
    token?: string,
    loader?: string, loadingParent?: string,
    getResult: (data: any) => T,
    onError?:(error:string)=>void,
    onSuccess?:(result:T)=>void,
    onCatch:string,
    successMessage?:(p:{response:any,result:T})=>string,
    errorMessage?:(p:{response:any,message:string})=>string | false,
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
        onCatch: {[key:string]:(err: any, api: AA_api<any>) => string},
        headers?: any,
        lang?: 'en' | 'fa'
    };
    token: string;
    private cache: Cache;
    getCachedValue: Cache["getCachedValue"]
    updateCache: Cache["updateCacheValue"]
    setCache: Cache["setCache"]
    removeCache: Cache["removeCache"]
    apisThatAreInLoadingTime: { [apiName: string]: boolean | undefined } = {}
    constructor(props: {
        id: string,
        token: string,
        loader?: string,
        onCatch: {[key:string]:(err: any, api: AA_api<any>) => string},
        headers?: any,
        lang?: 'en' | 'fa'
    }) {
        console.log('aio-apis constructor')
        this.props = props
        const storage = new Storage(props.id);
        this.token = props.token;
        this.setToken(props.token);
        this.cache = new Cache(storage, async (cachedApi: I_cachedApi<any>) => await this.request(cachedApi.api, true))
        this.getCachedValue = this.cache.getCachedValue;
        this.updateCache = this.cache.updateCacheValue;
        this.setCache = this.cache.setCache;
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
        const { headers = this.props.headers, getResult } = api;
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
            try { return { result: getResult(response), success: true, response,errorMessage:'' } }
            catch (err: any) { return { result: err.message, success: false, response,errorMessage:'' } }
        }
        catch (response: any) {
            try { return { result: false, errorMessage: onCatch[api.onCatch](response, api), success: false, response } }
            catch (err: any) { return { result: false, errorMessage: err.message, success: false, response } }
        }
    }
    private showErrorMessage = (p: { errorMessage: string, api: AA_api<any>,response:any }) => {
        const { description } = p.api;
        if (!p.errorMessage) { return }
        let errorMessage = p.errorMessage
        if(p.api.errorMessage){
            const res = p.api.errorMessage({response:p.response,message:p.errorMessage})
            if(res !== false){errorMessage = res}
            else{return}
        }
        let text: string = this.props.lang === 'fa' ? `${description} با خطا روبرو شد` : `An error was occured in ${description}`;
        this.addAlert({ type: 'error', text, subtext: p.errorMessage });
    }
    private loading = (api: AA_api<any>, state: boolean) => {
        const { loading = true, loader = this.props.loader, name, loadingParent } = api;
        if (loading) {
            const aioLoading = new Loading(loader)
            aioLoading[state ? 'show' : 'hide'](name, loadingParent)
        }
        this.apisThatAreInLoadingTime[api.name] = state
    }
    private handleMock = (api: AA_api<any>) => {
        if (api.mock && !!(this as any)[api.mock.methodName]) {
            const methodName = api.mock.methodName;
            handleMockApi({ url: api.url, delay: api.mock.delay, method: api.method, result: (config) => (this as any)[methodName](config) })
        }
    }
    request = async <T>(api: AA_api<T>, isCalledByCache?: boolean): Promise<T | false> => {
        if (this.apisThatAreInLoadingTime[api.name]) { return false}
        this.setToken(api.token || this.props.token)
        this.handleMock(api)
        if (!isCalledByCache) {
            if (api.cache) {
                let cachedValue = this.cache.getCachedValue(api.name, api.cache.name);
                if (cachedValue !== undefined) { return api.getResult(cachedValue) }
            }
            else { this.cache.removeCache(api.name) }
        }
        this.loading(api, true); let { result, errorMessage, success, response } = await this.responseToResult(api); this.loading(api, false)
        if(api.onError && !success){api.onError(errorMessage)}
        if(!!success){
            if(api.onSuccess){api.onSuccess(result as T)}
            if(api.successMessage){
                const res = api.successMessage({response,result:result as T})
                if(res){
                    this.addAlert({type:'success',subtext:res,text:''})
                }
            }
        }
        else { this.showErrorMessage({ errorMessage, api,response }); return result }
        if (success && api.cache) { this.cache.setCache(api.name, api.cache.name, { api, value: response }) }
        return result;
    };
}
export type I_mock = {
    url: string,
    delay: number,
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
    private intervals: { [key: string]: { repeatTime: number, value: any } | undefined } = {};
    constructor(storage: Storage, callApi: I_callApi) {
        this.storage = storage;
        this.callApi = callApi;
        this.handleIntervals()
    }
    private getKey = (cachedApi: I_cachedApi<any>) => `${cachedApi.api.name}-${(cachedApi.api.cache as any).name}`
    private detectIntervalChange = (cachedApi: I_cachedApi<any>) => {
        const interval = cachedApi.api.cache?.interval;
        const existIntervalObject = (this.intervals[this.getKey(cachedApi)] || {}) as any
        return interval !== existIntervalObject.repeatTime
    }
    private handleIntervals = () => {
        console.log('handleIntervals')
        const keys = this.storage.getKeys()
        for (let key of keys) { this.SetInterval(key) }
    }
    private SetInterval = (key: string) => {
        const cachedApi = this.getCachedApi(key);
        if (!cachedApi) { return }
        const { api } = cachedApi, { cache } = api;
        if (!cache) { return }
        if (!this.detectIntervalChange(cachedApi)) { return }
        const { interval = 0 } = cache
        if (interval < 1000) { return }
        this.ClearInterval(key)
        this.intervals[key] = this.intervals[key] || { repeatTime: interval, value: undefined }
        this.intervals[key].value = setInterval(async () => {
            console.log(`AIOApis => call api by api.name='${cachedApi.api.name}' and cache.name='${cachedApi.api?.cache?.name}' by interval (${interval} miliseconds)`)
            this.updateCacheByKey(key)
        }, interval)
    }
    private ClearInterval = (key: string) => {
        clearInterval((this.intervals[key] || {}).value);
        this.intervals[key] = undefined
    }
    private getCachedApi = (key: string): I_cachedApi<any> | undefined => {
        const res = this.storage.load(key)
        return res
    }
    private updateCacheByKey = async (key: string) => {
        if (this.storage.isExpired(key)) { this.removeByKey(key); return; }
        const cachedApi = this.getCachedApi(key); if (!cachedApi) { return }
        const { api } = cachedApi; if (!api.cache) { return }
        const value = await this.callApi(cachedApi);
        const newCachedApi: I_cachedApi<any> = { api: cachedApi.api, value }
        this.setCache(api.name, api.cache.name as string, newCachedApi)
    }
    getCachedValue = (apiName: string, cacheName: string): any => {
        let cachedApi = this.getCachedApi(`${apiName}-${cacheName}`);
        if (cachedApi !== undefined) { return cachedApi.value }
    }
    updateCacheValue = (apiName: string, cacheName: string) => this.updateCacheByKey(`${apiName}-${cacheName}`)
    setCache = (apiName: string, cacheName: string, changeObj: Partial<I_cachedApi<any>>) => {
        const key = `${apiName}-${cacheName}`;
        const cachedApi = this.getCachedApi(key)
        const newCachedApi: I_cachedApi<any> = { ...cachedApi, ...changeObj } as I_cachedApi<any>;
        const expiredIn = newCachedApi.api.cache?.expiredIn;
        this.storage.save(key, newCachedApi, expiredIn);
        if (newCachedApi?.api.cache?.interval) { this.SetInterval(key) }
        else { this.ClearInterval(key) }

    }
    private removeByKey = (key: string) => {
        clearInterval((this.intervals[key] || {}).value);
        this.storage.remove(key)
    }
    removeCache = (apiName: string, cacheName?: string) => {
        if (cacheName) { this.removeByKey(`${apiName}-${cacheName}`) }
        else {
            const keys = this.storage.getKeys()
            for (let key of keys) {
                if (key.indexOf(`${apiName}-`) === 0) {
                    this.removeByKey(key)
                }
            }
        }
    }
}

type I_storage_model = { [key: string]: { value: any, saveTime: number, expiredIn: number } }
export class Storage {
    private model: I_storage_model; id: string;
    constructor(id: string) { this.model = {}; this.id = id; this.init() }
    init = () => {
        let storage: any = localStorage.getItem('storageClass' + this.id);
        this.setModel(storage === undefined || storage === null ? {} : JSON.parse(storage))
    }
    copy = (v: any) => JSON.parse(JSON.stringify(v))
    setModel = (model: I_storage_model): I_storage_model => {
        this.model = model; localStorage.setItem('storageClass' + this.id, JSON.stringify(model)); return this.copy(model)
    }
    getNow = () => new Date().getTime();
    save = (field: string, value: any, expiredIn?: number): I_storage_model => {
        if (value === undefined) { return this.copy(this.model) }
        const newModel = { ...this.model }, now = this.getNow();
        newModel[field] = { value, saveTime: now, expiredIn: Infinity }
        if (expiredIn) { newModel[field].expiredIn = expiredIn }
        return this.setModel(newModel);
    }
    remove = (field: string): I_storage_model => {
        const newModel: I_storage_model = {}
        for (let prop in this.model) { if (prop !== field) { newModel[prop] = this.model[prop] } }
        return this.setModel(newModel)
    }
    removeKeyFromObject = (obj: { [key: string]: any }, key: string) => {
        const newObj: { [key: string]: any } = {};
        for (let prop in obj) { if (prop !== key) { newObj[prop] = obj[prop] } }
        return newObj
    }
    isExpired = (field: string): boolean => {
        if (!this.model[field]) { return true }
        return this.model[field].expiredIn < this.getNow()
    }
    load = (field: string, def?: any, expiredIn?: number) => {
        const obj = this.model[field]
        if (!obj) { this.save(field, def, expiredIn); return def }
        const isExpired = this.isExpired(field)
        if (isExpired) { this.save(field, def, expiredIn); return def }
        else { return obj.value }
    }
    clear = (): I_storage_model => this.setModel({})
    download = (file: any, name: string) => {
        if (!name || name === null) { return }
        let text = JSON.stringify(file)
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', name);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    export = () => {
        let name = window.prompt('Please Inter File Name');
        if (name === null || !name) { return; }
        this.download({ model: this.model }, name)
    }
    read = async (file: File): Promise<any> => {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => {
                try { const result = JSON.parse(fr.result as string); resolve(result); }
                catch (error: any) { reject(new Error('Error parsing JSON: ' + error.message)); }
            };
            fr.onerror = () => reject(new Error('Error reading file.'));
            fr.readAsText(file);
        });
    }
    import = async (file: any): Promise<I_storage_model> => {
        const model = await this.read(file)
        if (model === undefined) { return this.model; }
        return this.setModel(model);
    }
    getKeys = (): string[] => Object.keys(this.model)
}