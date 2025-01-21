import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AIOPopup from './../../npm/aio-popup';
import AIOLoading from './../../npm/aio-loading';
type AA_method = 'post' | 'get' | 'delete' | 'put' | 'patch';
type I_onCatch = (err: any, config: AA_api) => {errorMessage:string,result:any};
type AA_cache = { name: string, time: number };
type I_messageType = 'alert' | 'snackebar' | 'console' | 'none'
export type AA_props = {
    id: string,
    token: string,
    loader?: string,
    onCatch?: I_onCatch,
    headers?: any,
    lang?: 'en' | 'fa',messageTime?: number,errorMessageType?: I_messageType,successMessageType?: I_messageType,
}
export type AA_api = {
    description: string,
    method: AA_method,
    url: string,
    body?: any,
    loading?: boolean,
    cache?: AA_cache,
    mock?:{
        delay:number,
        result:(data:any)=>{status:number,data:any}
    },
    headers?: any,
    token?: string,
    getResult: (response:any)=>{result:any,successMessage?:string,errorMessage?:string},
    onCatch?: I_onCatch,
    loader?: string,loadingParent?: string,
    lang?: 'en' | 'fa',messageTime?: number,errorMessageType?: I_messageType,successMessageType?: I_messageType,
}
type AA_alertType = 'success' | 'error' | 'warning' | 'info'
export default class AIOApis {
    props: AA_props;
    storage: Storage;
    popup: AIOPopup;
    mock:any;
    token:string;
    constructor(props: AA_props) {
        this.props = props
        this.storage = new Storage(props.id);
        this.popup = new AIOPopup()
        this.token = props.token;
        this.setToken(props.token);
        this.mock = new MockAdapter(Axios) 
    }
    setToken = (token: string) => {
        let res = token || this.props.token;
        if (res) { Axios.defaults.headers.common['Authorization'] = `Bearer ${res}`; }
    }
    addAlert = (p: { type: AA_alertType, text: string, subtext?: string, time?: number, messageType: I_messageType,lang:AA_props["lang"] }) => {
        let { type, text, subtext, time,lang = 'en' } = p;
        if (p.messageType === 'console') { console.log(text, subtext) }
        else if (p.messageType === 'alert') { this.popup.addAlert({ type, text, subtext, time, className: 'aio-apis-popup', closeText: lang === 'fa' ? 'بستن' : 'Close' }) }
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
    responseToResult = async (api: AA_api): Promise<{ result: any,errorMessage?:string,successMessage?:string }> => {
        const { getResult,onCatch = this.props.onCatch,headers = this.props.headers } = api;
        if (!onCatch) {
            const errorMessage = `
                missing onCatch in api: ${api.description},
                you should set onCatch in api or in props of AIOApis    
            `
            return { result: false,errorMessage }
        }
        try {
            let response = await Axios({ method: api.method, url: api.url, data: api.body, headers })
            const {result,errorMessage,successMessage} = getResult(response);
            return {result,errorMessage,successMessage}
        }
        catch (response: any) {
            let {errorMessage,result} = onCatch(response, api);
            return { result,errorMessage }
        }
    }
    showErrorMessage = (p:{errorMessage: string, api: AA_api}) => {
        const { 
            errorMessageType = this.props.errorMessageType || 'alert',
            messageTime = this.props.messageTime,
            lang = this.props.lang,
            description 
        } = p.api;
        if (!p.errorMessage) { return }
        let text: string = this.props.lang === 'fa' ? `${description} با خطا روبرو شد` : `An error was occured in ${description}`;
        this.addAlert({ type: 'error', text, subtext:p.errorMessage, time: messageTime, messageType:errorMessageType,lang });
    }
    showSuccessMessage = (p:{successMessage?: string, api: AA_api}) => {
        const {
            lang = this.props.lang,
            messageTime = this.props.messageTime, 
            successMessageType = 'alert'
        } = p.api;
        if (!p.successMessage) { return }
        this.addAlert({ type: 'success', text:'', subtext: p.successMessage, time: messageTime, messageType:successMessageType,lang });
    }
    request = async (api: AA_api): Promise<any> => {
        const {
            loading = true,
            loader = this.props.loader,
            token = this.props.token
        } = api;
        if(this.token !== token){this.setToken(token)}
        if (api.cache) {
            let res = this.storage.load(api.cache.name, undefined, api.cache.time);
            if (res !== undefined) { return res }
        }
        const id: string = 'aa' + Math.round(Math.random() * 100000)
        if(api.mock){
            handleMockApi(this.mock,{url:api.url,delay:api.mock.delay,method:api.method,result:api.mock.result})
        }
        const aioLoading = new AIOLoading(loader)
        if (loading) { aioLoading.show(id, api.loadingParent); }
        let { result,successMessage,errorMessage } = await this.responseToResult({ ...api })
        if (loading) { aioLoading.hide(id) }
        if (!!errorMessage) {this.showErrorMessage({errorMessage, api}); return result}
        if(!!successMessage){this.showSuccessMessage({successMessage, api});}
        if (api.cache) { this.storage.save(api.cache.name, result) }
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
export type I_mock = {
    url:string,
    delay:number,
    method:AA_method,
    result:((body:any)=>{status:number,data:any})
}
function handleMockApi(mock:any,p:I_mock){
    // const methodRes = {'get':'onGet','post':'onPost'}[p.method]
    // const fn = (mock as any)[methodRes]
    if(p.method === 'get'){
        mock.onGet(p.url).reply((config:any) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const {status,data} = p.result(config)
                    resolve([status, data]);
                }, p.delay); 
            });
        });
    }
    if(p.method === 'post'){
        mock.onPost(p.url).reply((config:any) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const {status,data} = p.result(config)
                    resolve([status, data]);
                }, p.delay); 
            });
        });
    }
}


// type I_useApis_props = {
//     id: string,
//     token: string,
//     loader?: string,
//     onCatch?: I_onCatch,
//     headers?: any,
//     lang?: 'en' | 'fa',
//     messageTime?: number,
//     errorMessageType?: I_messageType,
//     successMessageType?: I_messageType,
//     apis:{[apiName:string]:AA_api}
// }
