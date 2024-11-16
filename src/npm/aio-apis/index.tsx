import React from 'react';
import Axios from 'axios';
import AIOPopup from './../../npm/aio-popup';
import './index.css';
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
    id: string, getAppState?: () => any, token?: string, loader?: () => React.ReactNode,
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

type AA_getStorage = (name: string, def?: any) => any;
type AA_setStorage = (key: string, value: any) => void;
type AA_removeStorage = (key: string) => void;
type AA_setToken = (token?: string) => void;
type AA_handleLoading = (state: boolean, apiName: string, config: AA_apiSetting) => void;
type AA_messageParameter = { result: any, message: AA_message, description: string }
export type AA_api = AA_apiSetting & {
    method?: AA_method,
    url: string,
    body?: any,
    parameter?:any,
    getResult?: (response: any) => any,
};
type AA_request_params = {
    body?: any,
    method: AA_method,
    url: string,
    config?: AA_apiSetting,
    getResult: (response: any) => any,
    parameter?: any
};
export default class AIOApis {
    storage: Storage;
    request: (setting: AA_api) => any;
    getAppState: () => any;
    setStorage: AA_setStorage;
    getStorage: AA_getStorage;
    removeStorage: AA_removeStorage;
    setToken: AA_setToken;
    getLoading: (id: string) => string;
    handleLoading: AA_handleLoading;
    responseToResult: (p: AA_request_params) => Promise<any>;
    requestFn: (p: AA_request_params) => Promise<any>;
    addAlert: (p: { type: 'success' | 'error' | 'warning' | 'info', text: string, subtext?: string, time?: number,alertType?:'alert' | 'snackebar' }) => void;
    handleCacheVersions: (cacheVersions: { [key: string]: number }) => { [key: string]: boolean };
    showErrorMessage: (m: AA_messageParameter) => void;
    showSuccessMessage: (m: AA_messageParameter) => void;
    constructor(props: AA_props) {
        let { id, getAppState = () => { }, loader, lang = 'en' } = props
        let storage: Storage = new Storage(id);
        this.storage = storage;
        this.getAppState = getAppState;
        this.setStorage = (name: string, value: any) => storage.save(name, value)
        this.getStorage = (name, def) => storage.load(name, def);
        this.removeStorage = (name) => storage.remove(name)
        this.setToken = (token?: string) => {
            let res = token || props.token;
            if (res) { Axios.defaults.headers.common['Authorization'] = `Bearer ${res}`; }
        }
        this.addAlert = (p) => {
            let { type, text, subtext, time,alertType = 'alert' } = p;
            if (alertType === 'alert') { new AIOPopup().addAlert({ type, text, subtext, time,className:'aio-apis-popup' }) }
            else { new AIOPopup().addSnackebar({ type, text, subtext, time }) }
        }
        this.getLoading = (id) => {
            console.log(`aio-service show loading by ${id}`)
            return (`
              <div class="aio-service-loading" id="aio-service-${id}">
                <div class="aio-service-loading-0">
                  <div class="aio-service-loading-1">
                    <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.0s infinite normal none running aioserviceloading;"></div>
                    <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.1s infinite normal none running aioserviceloading;"></div>
                    <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.2s infinite normal none running aioserviceloading;"></div>
                    <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.3s infinite normal none running aioserviceloading;"></div>
                    <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.4s infinite normal none running aioserviceloading;"></div>
                  </div>
                </div>
              </div>
            `)
        }
        this.handleLoading = (state, apiName, config) => {
            let { loading = true, loadingParent = 'body' } = config;
            if (!loading) { return; }
            if (state) {
                let loadingStr = loader ? `<div class="aio-service-loading" id="aio-service-${apiName}">${loader()}</div>` : this.getLoading(apiName);
                let parent = document.querySelector(loadingParent);
                if (parent) {parent.insertAdjacentHTML('beforeend', loadingStr);}
            } else {
                let loadingDom = document.getElementById('aio-service-' + apiName);
                if (!loadingDom) {loadingDom = document.querySelector('.aio-service-loading');}
                if (loadingDom) {loadingDom.remove();}
            }
        }
        this.handleCacheVersions = (cacheVersions: { [key: string]: number }) => {
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
        this.showErrorMessage = (m) => {
            let { result, message, description } = m;
            if (message.error === false) { return }
            let text: string;
            if (typeof message.error === 'string') { text = message.error }
            else { text = lang === 'fa' ? `${description} با خطا روبرو شد` : `An error was occured in ${description}` }
            this.addAlert({ type: 'error', text, subtext: result, time:message.time,alertType:message.type });
        }
        this.showSuccessMessage = (m) => {
            let { result, message, description } = m;
            if (!message.success) { return }
            let subtext = typeof message.success === 'function' ? message.success(result) : message.success;
            if (subtext === true) { subtext = '' }
            this.addAlert({ type: 'success', text: lang === 'fa' ? `${description} با موفقیت انجام شد` : `${description} was successfull`, subtext: subtext as string, time:message.time,alertType:message.type });
        }
        this.responseToResult = async (p) => {
            let { url, method, body, getResult, config = {} } = p;
            let { onCatch = props.onCatch, getError = props.getError } = config;
            try {
                let response = await Axios[method](url, body !== undefined ? body : undefined)
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
        this.requestFn = async (p) => {
            let { config = {}, parameter } = p;
            const id: string = 'aa' + Math.round(Math.random() * 100000)
            let { onError, onSuccess, errorResult, cache, message = {}, description = id, token } = config;
            if (cache) { let res = this.storage.load(cache.name, undefined, cache.time); if (res !== undefined) { return res } }
            this.setToken(token);
            this.handleLoading(true, id, config);
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
            this.handleLoading(false, id, config);
            return result;
        };
        this.request = async (setting: AA_api) => {
            let { url,body,description, message, loading, loadingParent, token, onError, onSuccess, errorResult, cache,parameter } = setting;
            let onCatch = setting.onCatch || props.onCatch; 
            let getError = setting.getError || props.getError; 
            let config = { description, message, loading, loadingParent, token, onError, onSuccess, onCatch, getError, errorResult, cache }
            let getResult = typeof setting.getResult === 'function' ? setting.getResult : () => { }
            return await this.requestFn({
                parameter, config, method: !setting.method ? 'post' : setting.method, body, url, getResult
            })
        }
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