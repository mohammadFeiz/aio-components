import Axios from 'axios';
import AIOPopup from '../aio-popup';
import AIOLoading from '../aio-loading';
type AA_method = 'post' | 'get' | 'delete' | 'put' | 'patch';
type AA_success_fn = (p: { result: any, appState: any, parameter: any }) => string | boolean
type AA_message = {
    error?: boolean | string,
    success?: AA_success_fn | string | boolean,
    time?: number,
    type?: 'alert' | 'snackebar'
}
type AA_onCatch = (err: any, config: AA_apiSetting) => string;
type AA_getError = (response: any, confing: AA_apiSetting) => string | false;
type AA_cache = { name: string, time: number };
export type AA_props = {
    id: string, getAppState?: () => any, token?: string, loader?: string,
    onCatch?: AA_onCatch, getError?: AA_getError,
    lang: 'en' | 'fa',
}
export type AA_apiSetting = {
    description?: string | ((p: any) => string),
    message?: AA_message,
    cache?: AA_cache,
    loading?: boolean,
    loadingParent?: string,
    token?: string,
    onCatch?: AA_onCatch,
    getError?: AA_getError,
    errorResult?: any,
    onError?: (result: string) => void,
    onSuccess?: (result: any) => void,
}

type AA_messageParameter = { result: any, message: AA_message, description: string }
export type AA_api = AA_apiSetting & {
    method?: AA_method,
    url: string,
    body?: any,
    parameter?:any,
    getResult?: (response: any) => any,
    headers?:any
};
type AA_request_params = {
    body?: any,
    method: AA_method,
    url: string,
    config?: AA_apiSetting,
    getResult: (response: any) => any,
    parameter?: any,
    headers?:any
};
type AA_alertType = 'success' | 'error' | 'warning' | 'info'
export default class AIOApis {
    props:AA_props;
    storage: Storage;
    aioLoading:AIOLoading;
    popup:AIOPopup;
    constructor(props: AA_props) {
        let { id, getAppState = () => { }, loader, lang = 'en' } = props
        this.props = {id,getAppState,loader,lang}
        this.aioLoading = new AIOLoading(loader)
        this.storage = new Storage(id);
        this.popup = new AIOPopup()
    }
    setToken = (token?: string) => {
        let res = token || this.props.token;
        if (res) { Axios.defaults.headers.common['Authorization'] = `Bearer ${res}`; }
    }
    addAlert = (p:{ type: AA_alertType, text: string, subtext?: string, time?: number,alertType?:'alert' | 'snackebar' }) => {
        let { type, text, subtext, time,alertType = 'alert' } = p;
        if (alertType === 'alert') { this.popup.addAlert({ type, text, subtext, time,className:'aio-apis-popup' }) }
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
    showErrorMessage = (m:AA_messageParameter) => {
        let { result, message, description } = m;
        if (message.error === false) { return }
        let text: string;
        if (typeof message.error === 'string') { text = message.error }
        else { text = this.props.lang === 'fa' ? `${description} با خطا روبرو شد` : `An error was occured in ${description}` }
        this.addAlert({ type: 'error', text, subtext: result, time:message.time,alertType:message.type });
    }
    showSuccessMessage = (m:AA_messageParameter) => {
        let { result, message, description } = m;
        if (!message.success) { return }
        let subtext = typeof message.success === 'function' ? message.success(result) : message.success;
        if (subtext === true) { subtext = '' }
        this.addAlert({ type: 'success', text: this.props.lang === 'fa' ? `${description} با موفقیت انجام شد` : `${description} was successfull`, subtext: subtext as string, time:message.time,alertType:message.type });
    }
    responseToResult = async (p: AA_request_params):Promise<any> => {
        let { url, method, body, getResult, config = {},headers } = p;
        let { onCatch = this.props.onCatch, getError = this.props.getError } = config;
        try {
            let response = await Axios({method,url,data:body,headers})
            if (response) {
                let error = getError ? getError(response, config) : undefined;
                if (typeof error === 'string') { return error }
            }
            return getResult(response);
        }
        catch (err: any) {
            let error = getError ? getError(err.response || err, config) : undefined;
            if(error){return error}
            let catchResult;
            try { catchResult = onCatch ? onCatch(err, config) : undefined }
            catch (err: any) { catchResult = err.message || err.Message; }
            if (!catchResult) { catchResult = err.message || err.Message }
            return catchResult
        }
    }
    requestFn = async (p: AA_request_params):Promise<any> => {
        let { config = {}, parameter } = p;
        const id: string = 'aa' + Math.round(Math.random() * 100000)
        let { onError, onSuccess, errorResult, cache, message = {}, description = id, token } = config;
        if (cache) { let res = this.storage.load(cache.name, undefined, cache.time); if (res !== undefined) { return res } }
        this.setToken(token);
        if(config.loading){this.aioLoading.show(id, config.loadingParent);}
        let result = await this.responseToResult(p)
        description = typeof description === 'function' ? description(parameter) : description;
        if (typeof result === 'string') {
            this.showErrorMessage({ result, message, description });
            if (onError) { onError(result) }
            result = errorResult
        }
        else {
            this.showSuccessMessage({ result, message, description });
            if (result === undefined) { result = errorResult }
            if (cache) { this.storage.save(cache.name, result) }
            if (onSuccess) { onSuccess(result); }
        }
        if(config.loading){this.aioLoading.hide(id)}
        return result;
    };
    request = async (setting: AA_api) => {
        let { url,body,description, message, loading,headers, loadingParent, token, onError, onSuccess, errorResult, cache,parameter } = setting;
        let onCatch = setting.onCatch || this.props.onCatch; 
        let getError = setting.getError || this.props.getError; 
        let config = { description, message, loading, loadingParent, token, onError, onSuccess, onCatch, getError, errorResult, cache }
        let getResult = typeof setting.getResult === 'function' ? setting.getResult : () => { }
        return await this.requestFn({
            parameter, config, method: !setting.method ? 'post' : setting.method, body, url, getResult,headers
        })
    }
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