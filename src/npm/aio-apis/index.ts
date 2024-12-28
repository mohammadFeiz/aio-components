import Axios from 'axios';
import AIOPopup from './../../npm/aio-popup';
import AIOLoading from './../../npm/aio-loading';
type AA_method = 'post' | 'get' | 'delete' | 'put' | 'patch';
type I_getErrorMessage = (err: any, config: AA_api) => string;
type AA_isSuccess = (response: any, confing: AA_api) => string | true;
type AA_cache = { name: string, time: number };
type I_getSuccessMessage = true | ((response: any, result: any) => string | undefined)
type I_messageType = 'alert' | 'snackebar' | 'console' | 'none'
export type AA_props = {
    id: string,
    token: string,
    loader?: string,
    getErrorMessage?: I_getErrorMessage,
    getSuccessMessage?:I_getSuccessMessage,
    isSuccess?: AA_isSuccess,
    getSuccessResult?: (response: any) => any,
    getErrorResult?: (response: any) => any,
    lang: 'en' | 'fa',
    messageTime?: number,
    errorMessageType?: I_messageType
}
export type AA_api = {
    description: string,
    method: AA_method,
    url: string,
    getSuccessResult?: (response: any) => any,
    getErrorResult?: (response: any) => any,
    getSuccessMessage?: I_getSuccessMessage,
    errorMessageType?: I_messageType,
    successMessageType?: I_messageType,
    body?: any,
    getErrorMessage?: I_getErrorMessage,
    isSuccess?: AA_isSuccess,
    cache?: AA_cache,
    loading?: boolean,
    loadingParent?: string,
    headers?: any,
    messageTime?: number,
}
type AA_alertType = 'success' | 'error' | 'warning' | 'info'
export default class AIOApis {
    props: AA_props;
    storage: Storage;
    aioLoading: AIOLoading;
    popup: AIOPopup;
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
    addAlert = (p: { type: AA_alertType, text: string, subtext?: string, time?: number, messageType: I_messageType }) => {
        let { type, text, subtext, time } = p;
        if (p.messageType === 'console') { console.log(text, subtext) }
        else if (p.messageType === 'alert') { this.popup.addAlert({ type, text, subtext, time, className: 'aio-apis-popup', closeText: this.props.lang === 'fa' ? 'بستن' : 'Close' }) }
        else { this.popup.addSnackebar({ type, text, subtext, time }) }
    }
    renderPopup = () => this.popup.render()
    setStorage = (name: string, value: any) => this.storage.save(name, value)
    getStorage = (name: string, def?: any) => this.storage.load(name, def);
    removeStorage = (name: string) => this.storage.remove(name)
    handleCacheVersions = (cacheVersions: { [key: string]: number }): { [key: string]: boolean } => {
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
    responseToResult = async (api: AA_api): Promise<{ success: boolean, result: any, response: any }> => {
        const { getSuccessResult = this.props.getSuccessResult,getErrorMessage = this.props.getErrorMessage } = api;
        if (!getErrorMessage) {
            const message = `
                missing getErrorMessage in api: ${api.description},
                you should set getErrorMessage in api or in props of AIOApis    
            `
            alert(message)
            return { success: false, result: message, response: {} }
        }
        if (!getSuccessResult) {
            const message = `
                missing getSuccessResult in api: ${api.description},
                you should set getSuccessResult in api or in props of AIOApis    
            `
            alert(message)
            return { success: false, result: message, response: {} }
        }
        try {
            let response = await Axios({ method: api.method, url: api.url, data: api.body, headers: api.headers })
            let success = (api.isSuccess as AA_isSuccess)(response, api);
            if (typeof success === 'string') { return { success: false, result: success, response } }
            return { success: true, result: getSuccessResult(response), response };
        }
        catch (response: any) {
            let message = getErrorMessage(response, api);
            if (!message) { message = response.message }
            return { success: false, result: message, response }
        }
    }
    showErrorMessage = (message: string, api: AA_api) => {
        const { errorMessageType = this.props.errorMessageType || 'alert',messageTime = this.props.messageTime } = api;
        if (errorMessageType === 'none') { return }
        let text: string = this.props.lang === 'fa' ? `${api.description} با خطا روبرو شد` : `An error was occured in ${api.description}`;
        let subtext = message
        this.addAlert({ type: 'error', text, subtext, time: messageTime, messageType:errorMessageType });
    }
    showSuccessMessage = (response: any, result: any, api: AA_api) => {
        const {getSuccessMessage  = this.props.getSuccessMessage} = api;
        if (!getSuccessMessage) { return }
        const { messageTime = this.props.messageTime, successMessageType = 'alert' } = api;
        const text = this.props.lang === 'fa' ? `${api.description} با موفقیت انجام شد` : `${api.description} was successfull`
        let subtext: string = getSuccessMessage === true ? '' : getSuccessMessage(response, result) || '';
        this.addAlert({ type: 'success', text, subtext: subtext as string, time: messageTime, messageType:successMessageType });
    }
    request = async (api: AA_api): Promise<any> => {
        const {
            isSuccess = this.props.isSuccess || (() => true),
            loading = true,
            getErrorResult = this.props.getErrorResult
        } = api;
        if (api.cache) {
            let res = this.storage.load(api.cache.name, undefined, api.cache.time);
            if (res !== undefined) { return res }
        }
        const id: string = 'aa' + Math.round(Math.random() * 100000)
        if (api.loading) { this.aioLoading.show(id, api.loadingParent); }
        let { success, result, response } = await this.responseToResult({ ...api, isSuccess })
        if (!success) {
            if (!getErrorResult) {
                const message = `
                missing getErrorResult in api: ${api.description},
                you should set getErrorResult in api or in props of AIOApis    
            `
                alert(message)
                return 
            }
            this.showErrorMessage(result, api);
            return getErrorResult(response)
        }
        this.showSuccessMessage(response, result, api);
        if (api.cache) { this.storage.save(api.cache.name, result) }
        if (loading) { this.aioLoading.hide(id) }
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
        this.clear = () => { this.model = {}; this.time = {}; this.saveStorage(this.model, this.time) }
        this.getModel = () => JSON.parse(JSON.stringify(this.model))
        this.init()
    }
}