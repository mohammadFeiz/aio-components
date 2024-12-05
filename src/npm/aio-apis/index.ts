import Axios from 'axios';
import AIOPopup from '../aio-popup';
import AIOLoading from '../aio-loading';
type AA_method = 'post' | 'get' | 'delete' | 'put' | 'patch';
type AA_onCatch = (err: any, config: AA_api) => string;
type AA_isSuccess = (response: any, confing: AA_api) => string | true;
type AA_cache = { name: string, time: number };
type AA_successMessage = true | ((response:any,result:any)=>string | undefined)
type AA_errorMessage = false | ((response:any)=>string | undefined)
export type AA_props = {
    id: string, 
    token: string, 
    loader?: string,
    onCatch: AA_onCatch, 
    isSuccess: AA_isSuccess,
    lang: 'en' | 'fa',
    messageTime?:number,
    messageType?:'alert' | 'snackebar'
}
export type AA_api = {
    description: string,
    method: AA_method,
    url: string,
    getSuccessResult: (response: any) => any,
    getErrorResult:(response: any) => any,
    getSuccessMessage?:AA_successMessage,
    getErrorMessage?:AA_errorMessage,
    body?: any,
    onCatch?: AA_onCatch,
    isSuccess?:AA_isSuccess,
    cache?: AA_cache,
    loading?: boolean,
    loadingParent?: string,
    headers?:any,
    messageTime?:number,
    messageType?:'alert' | 'snackebar'
}
type AA_alertType = 'success' | 'error' | 'warning' | 'info'
export default class AIOApis {
    props:AA_props;
    storage: Storage;
    aioLoading:AIOLoading;
    popup:AIOPopup;
    constructor(props: AA_props) {
        this.props = props
        this.aioLoading = new AIOLoading(props.loader)
        this.storage = new Storage(props.id);
        this.popup = new AIOPopup()
        this.setToken(props.token);
    }
    setToken = (token?: string) => {
        let res = token || this.props.token;
        if (res) { Axios.defaults.headers.common['Authorization'] = `Bearer ${res}`; }
    }
    addAlert = (p:{ type: AA_alertType, text: string, subtext?: string, time?: number,messageType:'alert' | 'snackebar' }) => {
        let { type, text, subtext, time } = p;
        const {messageType = 'alert'} = this.props;
        if (messageType === 'alert') { this.popup.addAlert({ type, text, subtext, time,className:'aio-apis-popup' }) }
        else { this.popup.addSnackebar({ type, text, subtext, time }) }
    }
    renderPopup = ()=>this.popup.render()
    setStorage = (name: string, value: any) => this.storage.save(name, value)
    getStorage = (name:string, def?:any) => this.storage.load(name, def);
    removeStorage = (name:string) => this.storage.remove(name)
    handleCacheVersions = (cacheVersions: { [key: string]: number }):{ [key: string]: boolean } => {
        let def: any = {};
        for (let prop in cacheVersions) { def[prop] = 0 }
        let storedCacheVersions = this.getStorage('storedCacheVersions', def);
        let diffrences: any = {};
        for (let prop in cacheVersions) {
            if (storedCacheVersions[prop] === undefined) { continue }
            if (storedCacheVersions[prop] !== cacheVersions[prop]) {
                diffrences[prop] = true;
                this.removeStorage(prop)
            }
            else { diffrences[prop] = false; }
        }
        this.setStorage('storedCacheVersions', cacheVersions);
        return diffrences;
    }
    responseToResult = async (api: AA_api):Promise<{success:boolean,result:any,response:any}> => {
        try {
            let response = await Axios({method:api.method,url:api.url,data:api.body,headers:api.headers})
            let success = (api.isSuccess as AA_isSuccess)(response, api);
            if (typeof success === 'string') { return {success:false,result:success,response} }
            return {success:true,result:api.getSuccessResult(response),response};
        }
        catch (response: any) {
            let message = (api.onCatch as AA_onCatch)(response,api);
            if(!message){message = response.message}
            return {success:false,result:message,response}
        }
    }
    showErrorMessage = (response:any,message:string,api:AA_api) => {
        const {getErrorMessage = ()=>message,messageTime = this.props.messageTime,messageType = this.props.messageType || 'alert'} = api;
        if (getErrorMessage === false) { return }
        let text: string = this.props.lang === 'fa' ? `${api.description} با خطا روبرو شد` : `An error was occured in ${api.description}`;
        let subtext = getErrorMessage(response)
        this.addAlert({ type: 'error', text, subtext, time:messageTime,messageType });
    }
    showSuccessMessage = (response:any,result:any,api:AA_api) => {
        if (!api.getSuccessMessage) { return }
        const {messageTime = this.props.messageTime,messageType = this.props.messageType || 'alert'} = api;
        const text = this.props.lang === 'fa' ? `${api.description} با موفقیت انجام شد` : `${api.description} was successfull`
        let subtext:string = api.getSuccessMessage === true?'':api.getSuccessMessage(response,result) || '';
        this.addAlert({ type: 'success', text, subtext: subtext as string, time:messageTime,messageType });
    }
    request = async (api:AA_api):Promise<any> => {
        const {
            onCatch = this.props.onCatch,
            isSuccess = this.props.isSuccess,
            loading = true
        } = api;
        if (api.cache) { 
            let res = this.storage.load(api.cache.name, undefined, api.cache.time); 
            if (res !== undefined) { return res } 
        }
        const id: string = 'aa' + Math.round(Math.random() * 100000)
        if(api.loading){this.aioLoading.show(id, api.loadingParent);}
        let {success,result,response} = await this.responseToResult({...api,onCatch,isSuccess})
        if(!success){
            this.showErrorMessage(response,result,api);
            return api.getErrorResult(response)
        }
        this.showSuccessMessage(response,result,api);
        if (api.cache) { this.storage.save(api.cache.name, result) }
        if(loading){this.aioLoading.hide(id)}
        return result;
    };
}

type I_storage_model = { [key: string]: any }
type I_storage_time = { [key: string]: number }
class Storage {
    model: I_storage_model;
    time: I_storage_time;
    init: () => void;
    saveStorage: (model: I_storage_model, time: I_storage_time) => void;
    getParent: (field: string) => I_storage_model | undefined;
    removeValueByField: (field: string) => I_storage_model
    setValueByField: (field: string, value: any) => I_storage_model
    getValueByField: (field: string) => any
    save: (field: string, value: any) => I_storage_model
    remove: (field: string, callback?: () => void) => I_storage_model
    load: (field: string, def?: any, time?: number) => any
    clear: () => void
    getModel: () => I_storage_model
    constructor(id: string) {
        this.model = {}
        this.time = {}
        this.init = () => {
            let storage: any = localStorage.getItem('storageClass' + id);
            let timeStorage = localStorage.getItem('storageClassTime' + id);
            let model: I_storage_model, time: I_storage_time;
            if (storage === undefined || storage === null) { model = {} }
            else { model = JSON.parse(storage) }
            if (timeStorage === undefined || timeStorage === null) { time = {} }
            else { time = JSON.parse(timeStorage) }
            this.model = model;
            this.time = time
            this.saveStorage(model, time)
        }
        this.saveStorage = (model, time) => {
            localStorage.setItem('storageClass' + id, JSON.stringify(model));
            localStorage.setItem('storageClassTime' + id, JSON.stringify(time));
        }
        this.getParent = (field) => {
            let fields = field.split('.');
            let parent = this.model;
            for (let i = 0; i < fields.length - 1; i++) {
                parent = parent[fields[i]];
                if (typeof parent !== 'object') { return }
            }
            return parent
        }
        this.removeValueByField = (field: string) => {
            let fields = field.split('.')
            let parent: I_storage_model | undefined = this.getParent(field)
            let lastField: string = fields[fields.length - 1]
            let newParent: I_storage_model = {};
            for (let prop in parent) {
                if (prop !== lastField) { newParent[prop] = parent[prop] }
            }
            fields.pop();
            return this.setValueByField(fields.join('.'), newParent)
        }
        this.setValueByField = (field, value) => {
            if (!field) { this.model = value; return; }
            var fields = field.split('.');
            var parent = this.model;
            for (let i = 0; i < fields.length - 1; i++) {
                let f = fields[i];
                if (parent[f] === undefined) { parent[f] = {} }
                parent = parent[f];
            }
            parent[fields[fields.length - 1]] = value;
            return this.getValueByField(fields[0])
        }
        this.getValueByField = (field) => {
            let fields = field.split('.');
            let model = this.model;
            let parent = { ...model };
            for (let i = 0; i < fields.length - 1; i++) {
                parent = parent[fields[i]];
                if (typeof parent !== 'object') { return }
            }
            return parent[fields[fields.length - 1]]
        }
        this.save = (field, value) => {
            try { value = JSON.parse(JSON.stringify(value)) } catch { value = value; }
            if (!field || field === null) { return {} }
            let res = this.setValueByField(field, value)
            this.time[field] = new Date().getTime();
            this.saveStorage(this.model, this.time);
            return res;
        }
        this.remove = (field, callback = () => { }) => {
            let res = this.removeValueByField(field);
            let newTime: any = {};
            for (let prop in this.time) { if (prop !== field) { newTime[prop] = this.time[prop] } }
            this.time = newTime;
            this.saveStorage(this.model, this.time);
            callback();
            return res;
        }
        this.load = (field, def, time) => {
            let value = this.getValueByField(field);
            if (time && value !== undefined) {
                let thisTime = new Date().getTime();
                let lastTime = this.time[field] || thisTime;
                let dif = Math.abs(thisTime - lastTime);
                if (dif > time) { value = undefined }
            }
            if (value === undefined && def !== undefined) {
                value = typeof def === 'function' ? def() : def;
                this.save(field, def);
            }
            return value;
        }
        this.clear = () => {this.model = {}; this.time = {}; this.saveStorage(this.model, this.time)}
        this.getModel = () => JSON.parse(JSON.stringify(this.model))
        this.init()
    }
}