import Axios from 'axios';
import {Alert,Loading} from './../../npm/aio-popup';
import {Storage,MockApi} from './../../npm/aio-utils';

export type AA_api = {
    description: string,
    getResult:string,
    onCatch:string,
    name: string,
    method: 'post' | 'get' | 'delete' | 'put' | 'patch',
    url: string,
    body?: any,
    loading?: boolean,
    cache?: { name: string, expiredIn?: number, interval?: number },//AA_cache
    mock?: { delay: number, methodName: string },
    showMessage?: (obj:{response:any,success:boolean,result:any}) => { type: 'success' | 'warning' | 'error' | 'info', time?: number, text: string, subtext?: string } | false
    headers?: any,
    token?: string,
    loader?: string, loadingParent?: string,
    mapResult?:(data:any)=>any
}
type I_getResult = (response: any,api:AA_api) => any
type I_onCatch = (err: any, api: AA_api) => string
type I_cachedApi = {
    api: AA_api,
    value: any,
}
export default class AIOApis {
    props: {
        id: string,
        token: string,
        loader?: string,
        getResult:{
            [getResultMethod:string]:I_getResult
        },
        onCatch: {
            [onCatchMethod:string]:I_onCatch
        },
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
        getResult:{
            [getResultMethod:string]:(response: any,api:AA_api) => any
        },
        onCatch: {
            [onCatchMethod:string]:(err: any, api: AA_api) => string
        },
        headers?: any,
        lang?: 'en' | 'fa'
    }) {
        console.log('aio-apis constructor')
        this.props = props
        const storage = new Storage(props.id);
        this.token = props.token;
        this.setToken(props.token);
        this.cache = new Cache(storage, async (cachedApi: I_cachedApi) => await this.getResult(cachedApi.api, true))
        this.getCachedValue = this.cache.getCachedValue;
        this.updateCache = this.cache.updateCacheValue;
        this.setCache = this.cache.setCache;
        this.removeCache = this.cache.removeCache;
    }
    setToken = (token: string) => {
        let res = token || this.props.token;
        if (res) { Axios.defaults.headers.common['Authorization'] = `Bearer ${res}`; }
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
    checkMissing = (field:'onCatch' | 'getResult',api:AA_api)=>{
        const methodName = api[field]
        if(typeof methodName !== 'string'){
            const errorMessage = `AIOApis error => missing onCatch in api(${api.name})`
            return {result:errorMessage,errorText:`missing onCatch in api(${api.name})`,success:false,response:{}}
        }
        if(!this.props[field] || !this.props[field][methodName]){
            const errorMessage = `AIOApis error => missing onCatch.${field} function`
            return {result:errorMessage,errorText:`there in any function by name=${methodName} in api(${api.name})`,success:false,response:{}}
        }
    }
    private responseToResult = async <T>(api: AA_api): Promise<{ result: T | string, success: boolean,response:any,errorText?:string }> => {
        const { headers = this.props.headers } = api;
        const checkOnCatch = this.checkMissing('onCatch',api);
        if(checkOnCatch){return checkOnCatch}
        const checkGetResult = this.checkMissing('getResult',api);
        if(checkGetResult){return checkGetResult}
        const onCatch = this.props.onCatch[api.onCatch]
        const getResult = this.props.getResult[api.getResult]
        try {
            let response = await Axios({ method: api.method, url: api.url, data: api.body, headers })
            try{return {success:true,result:getResult(response,api),response}}
            catch(err:any){return {success:false,result:err.message,response}}         
        }
        catch (response: any) {
            try{return { errorText:this.getTextByDescription(api),result: onCatch(response, api), success: false,response }}
            catch(err:any){return { result: err.message, success: false,response,errorText:'onCatch fuction error in api(${api.name})' }}
        }
    }
    private getTextByDescription = (api:AA_api):string=>{
        const {description} = api;
        return this.props.lang === 'fa' ? `${description} با خطا روبرو شد` : `An error was occured in ${description}`;
    }
    private showErrorMessage = (p: { errorMessage: string,errorText:string, api: AA_api }) => {
        if (!p.errorMessage) { return }
        this.addAlert({ type: 'error', text:p.errorText, subtext: p.errorMessage });
    }
    private getResult = async <T>(api: AA_api, isCalledByCache?: boolean): Promise<{success:boolean,result:T | string,isLoading:boolean}> => {
        if (this.apisThatAreInLoadingTime[api.name]) { return {success:false,result:'api is requesting',isLoading:true} }
        const {
            loading = true,
            loader = this.props.loader,
            token = this.props.token
        } = api;
        if (this.token !== token) { this.setToken(token) }
        //if not check !isCalledByCache then will infinite loop between updateCache and request
        if (api.mock && !!(this as any)[api.mock.methodName]) {
            const methodName = api.mock.methodName;
            MockApi({ url: api.url, delay: api.mock.delay, method: api.method, getResult: (config) => (this as any)[methodName](config) })
        }
        if (!isCalledByCache) {
            if (api.cache) {
                let cachedValue = this.cache.getCachedValue(api.name, api.cache.name);
                if (cachedValue !== undefined) {
                    console.log(`AIOApis => get result of api by api.name='${api.name}' and cache.name='${api.cache.name}' from cache`)
                    return {success:true,result:cachedValue,isLoading:false}
                }
            }
            else {
                this.cache.removeCache(api.name)
            }
        }
        const loadingKey: string = 'aa' + Math.round(Math.random() * 100000)
        const aioLoading = new Loading(loader)
        if (loading) { aioLoading.show(loadingKey, api.loadingParent); }
        this.apisThatAreInLoadingTime[api.name] = true
        let { result, errorText, success,response } = await this.responseToResult<T>({ ...api })
        if(api.showMessage){
            const config = api.showMessage({response,result,success})
            if(config !== false){this.addAlert(config)}
        }
        this.apisThatAreInLoadingTime[api.name] = false
        if (loading) { aioLoading.hide(loadingKey) }
        if (!!errorText && !success && api.showMessage === undefined) { 
            this.showErrorMessage({ errorMessage:result as string,errorText, api }); 
        }
        if (success && api.cache) {
            const cacheObj: I_cachedApi = { api, value: result }
            this.cache.setCache(api.name, api.cache.name, cacheObj)
        }
        return {success,result,isLoading:false} 
    };
    request = async <T>(api: AA_api): Promise<{success:boolean,result:T | string,isLoading:boolean}> => {
        const {success,result,isLoading} = await this.getResult<T>(api);
        if (isLoading) { return {success:false,result:'api is requesting',isLoading:true} }
        if(!success || !api.mapResult){return {success,result,isLoading}}
        try{return {success:true,result:api.mapResult(result),isLoading}}
        catch(err:any){
            let text = this.getTextByDescription(api)
            this.addAlert({type:'error',text,subtext:err.message});
            return {success:false,result:err.message,isLoading}
        }   
    }
}

type I_callApi = (cachedApi: I_cachedApi) => Promise<any>
class Cache {
    private storage: Storage;
    private callApi: I_callApi;
    private intervals: { [key: string]: { repeatTime: number, value: any } | undefined } = {};
    constructor(storage: Storage, callApi: I_callApi) {
        this.storage = storage;
        this.callApi = callApi;
        this.handleIntervals()
    }
    private getKey = (cachedApi: I_cachedApi) => `${cachedApi.api.name}-${(cachedApi.api.cache as any).name}`
    private detectIntervalChange = (cachedApi: I_cachedApi) => {
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
    private getCachedApi = (key: string): I_cachedApi | undefined => {
        const res = this.storage.load(key)
        return res
    }
    private updateCacheByKey = async (key: string) => {
        if (this.storage.isExpired(key)) {this.removeByKey(key); return;}
        const cachedApi = this.getCachedApi(key); if (!cachedApi) { return }
        const { api } = cachedApi; if (!api.cache) { return }
        const {result} = await this.callApi(cachedApi);
        const newCachedApi: I_cachedApi = { api: cachedApi.api, value:result }
        this.setCache(api.name, api.cache.name as string, newCachedApi)
    }
    getCachedValue = (apiName: string, cacheName: string): any => {
        let cachedApi = this.getCachedApi(`${apiName}-${cacheName}`);
        if (cachedApi !== undefined) { return cachedApi.value }
    }
    updateCacheValue = (apiName: string, cacheName: string) => this.updateCacheByKey(`${apiName}-${cacheName}`)
    setCache = (apiName: string, cacheName: string, changeObj: Partial<I_cachedApi>) => {
        const key = `${apiName}-${cacheName}`;
        const cachedApi = this.getCachedApi(key)
        const newCachedApi: I_cachedApi = { ...cachedApi, ...changeObj } as I_cachedApi;
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