import React from 'react';
import Axios from 'axios';
import { AIODate, Storage } from './../../npm/aio-utils';
import AIOPopup from './../../npm/aio-popup';
import $ from 'jquery';
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
    dateToString: (date: any, pattern?: string) => string;
    dateToNumber: (date: any) => any;
    dateToArray: (date: any, jalali?: boolean) => number[];
    DATE: AIODate;
    constructor(props: AA_props) {
        let { id, getAppState = () => { }, loader, lang = 'en' } = props
        let storage: Storage = new Storage(id);
        this.storage = storage;
        this.DATE = new AIODate()
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
        this.dateToString = (date, pattern = '{year}/{month}/{day}') => {
            return this.DATE.getDateByPattern(date, pattern)
        }
        this.dateToNumber = (date) => {
            return this.DATE.getTime(date)
        }
        this.dateToArray = (date, jalali) => {
            return this.DATE.convertToArray(date, jalali)
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
            let { loading = true, loadingParent = 'body' } = config
            if (!loading) { return }
            if (state) {
                let loadingStr = loader ? `<div class="aio-service-loading" id="aio-service-${apiName}">${loader()}</div>` : this.getLoading(apiName);
                let parent = $(loadingParent);
                parent.append(loadingStr);
            }
            else {
                let loadingDom = $('#aio-service-' + apiName);
                if (!loadingDom.length) { loadingDom = $('.aio-service-loading') }
                loadingDom.remove()
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
                let catchResult;
                try { catchResult = onCatch ? onCatch(err, config) : undefined }
                catch (err: any) { catchResult = err.message || err.Message; }
                if (!catchResult) { catchResult = err.message || err.Message }
                console.log(err);
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