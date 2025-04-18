var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Alert, Loading } from 'aio-popup';
import { Stall, Storage, AddQueryParamsToUrl } from 'aio-utils';
import AIODate from 'aio-date';
import { useRef } from 'react';
export default class AIOApis {
    constructor(props) {
        this.currentError = '';
        this.apisThatAreInLoadingTime = {};
        this.DATE = new AIODate();
        this.getNow = (jalali) => {
            return this.DATE.getToday(jalali);
        };
        this.setToken = (token) => {
            if (token && token === this.token) {
                Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        };
        this.addAlert = (p) => {
            let { type, title, text, time } = p;
            Alert({ type, title, text, time, className: 'aio-apis-popup', closeText: this.props.lang === 'fa' ? 'بستن' : 'Close' });
        };
        this.getUrlQueryParam = (params) => {
            if (typeof params === 'string') {
                return `/${params}`;
            }
            else if (typeof params === 'object' && params !== null) {
                const queryString = Object.keys(params)
                    .filter(key => params[key] !== undefined)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                    .join('&');
                return `?${queryString}`;
            }
            return '';
        };
        this.responseToResult = (api) => __awaiter(this, void 0, void 0, function* () {
            const { headers = this.props.headers } = api;
            const { handleErrorMessage } = this.props;
            if (!handleErrorMessage) {
                const errorMessage = `
                missing onCatch in api: ${api.name},
                you should set onCatch in api or in props of AIOApis    
            `;
                return { errorMessage, success: false, response: false };
            }
            try {
                let finalUrl;
                if (api.queryParams) {
                    finalUrl = AddQueryParamsToUrl(api.url, api.queryParams);
                }
                else {
                    finalUrl = api.url;
                }
                let response = yield Axios({ method: api.method, url: finalUrl, data: api.body, headers });
                try {
                    return { success: true, response, errorMessage: '' };
                }
                catch (err) {
                    return { success: false, response, errorMessage: err.message };
                }
            }
            catch (response) {
                try {
                    let errorMessage = handleErrorMessage(response, api);
                    errorMessage = errorMessage === false ? '' : errorMessage;
                    return { errorMessage, success: false, response };
                }
                catch (err) {
                    return { errorMessage: err.message, success: false, response };
                }
            }
        });
        this.loading = (api, state) => {
            const { loading = true, loader = this.props.loader, name, loadingParent } = api;
            if (loading) {
                const aioLoading = new Loading(loader);
                aioLoading[state ? 'show' : 'hide'](name, loadingParent);
            }
        };
        this.handleMock = (api) => {
            if (!api.mock) {
                return;
            }
            const mock = new MockAdapter(Axios);
            mock.resetHandlers();
            if (api.method === 'get') {
                mock.onGet(api.url).replyOnce((config) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            if (!api.mock) {
                                return;
                            }
                            const { status, data } = api.mock(config);
                            resolve([status, data]);
                            mock.restore();
                        }, api.mockDelay || 3000);
                    });
                });
            }
            else {
                mock.resetHandlers();
                mock.onPost(api.url).replyOnce((config) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            if (!api.mock) {
                                return;
                            }
                            const { status, data } = api.mock(config);
                            resolve([status, data]);
                            mock.restore();
                        }, api.mockDelay || 3000);
                    });
                });
            }
        };
        this.callCache = (api) => __awaiter(this, void 0, void 0, function* () {
            if (this.apisThatAreInLoadingTime[api.name]) {
                return false;
            }
            this.setToken(api.token || this.props.token);
            this.handleMock(api);
            this.apisThatAreInLoadingTime[api.name] = true;
            let { success, response } = yield this.responseToResult(api);
            this.apisThatAreInLoadingTime[api.name] = false;
            if (success) {
                return response;
            }
        });
        this.requestFn = (api, isRetry) => __awaiter(this, void 0, void 0, function* () {
            if (this.apisThatAreInLoadingTime[api.name]) {
                return { success: false, response: {}, errorMessage: 'request is in loading' };
            }
            const lasSuccessRes = this.lsc.get(api, 'always');
            if (lasSuccessRes !== null) {
                return { success: true, response: lasSuccessRes };
            }
            this.setToken(api.token || this.props.token);
            this.handleMock(api);
            if (api.cache) {
                let cachedValue = this.cache.getCachedValue(api.name, api.cache.name);
                if (cachedValue !== undefined) {
                    return { success: true, response: cachedValue };
                }
            }
            else {
                this.cache.removeCache(api.name);
            }
            this.loading(api, true);
            this.apisThatAreInLoadingTime[api.name] = true;
            if (this.props.onBeforeRequest) {
                const { api: newApi, result } = yield this.props.onBeforeRequest(api);
                if (result) {
                    return result;
                }
                if (newApi) {
                    api = newApi;
                }
            }
            let { errorMessage = '', success, response } = yield this.responseToResult(api);
            this.loading(api, false);
            this.apisThatAreInLoadingTime[api.name] = false;
            if (!success) {
                const lasSuccessRes = this.lsc.get(api, 'unsuccess');
                if (lasSuccessRes !== null) {
                    console.log(`api ${api.name} provide last success response`);
                    return { success: true, response: lasSuccessRes };
                }
                let message = errorMessage;
                if (api.showError === false) {
                    message = false;
                }
                if (typeof message === 'string') {
                    this.currentError = message;
                    if (!isRetry) {
                        let title = this.props.lang === 'fa' ? `${api.description} با خطا روبرو شد` : `An error was occured in ${api.description}`;
                        if (api.showError !== false) {
                            this.addAlert({ type: 'error', title, text: message });
                        }
                    }
                }
            }
            else {
                this.lsc.set(api, response);
                if (api.cache) {
                    this.cache.setCache(api.name, api.cache.name, { api, value: response });
                }
            }
            if (this.props.onAfterRequest) {
                const res = yield this.props.onAfterRequest(api, { response, success, errorMessage });
                if (res) {
                    return res;
                }
            }
            return { response, success, errorMessage };
        });
        this.retries = (api, times) => __awaiter(this, void 0, void 0, function* () {
            const retries = [0, ...times];
            return yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < retries.length; i++) {
                    yield Stall(retries[i]);
                    if (i < retries.length - 1) {
                        const res = yield this.requestFn(api, true);
                        if (res.success === true) {
                            return resolve(res);
                            break;
                        }
                        else {
                            console.log(`aio-apis => retries[${i}] failed`);
                            console.log(`api error is : ${this.currentError}`);
                        }
                    }
                    else {
                        const res = yield this.requestFn(api);
                        return resolve(res);
                    }
                }
            }));
        });
        this.request = (api) => __awaiter(this, void 0, void 0, function* () {
            if (api.retries) {
                return yield this.retries(api, api.retries);
            }
            else {
                return yield this.requestFn(api);
            }
        });
        console.log('aio-apis constructor');
        this.props = props;
        const storage = new Storage(props.id);
        this.token = props.token;
        this.setToken(props.token);
        this.cache = new Cache(storage, (cachedApi) => __awaiter(this, void 0, void 0, function* () { return yield this.callCache(cachedApi.api); }));
        this.getCachedValue = this.cache.getCachedValue;
        this.fetchCachedValue = this.cache.fetchCachedValue;
        this.removeCache = this.cache.removeCache;
        this.lsc = new LastSuccess(props.id);
    }
}
class LastSuccess {
    constructor(id) {
        this.isEnable = (api) => !!api.lastSuccess && !!api.lastSuccess.enable;
        this.getFromStroage = (api) => {
            const { expiredIn } = api.lastSuccess || {};
            const value = this.storage.load(api.name, null, expiredIn);
            return value === undefined ? null : value;
        };
        this.get = (api, type) => {
            const { enable, expiredIn, loadIn = 'unsuccess' } = api.lastSuccess || {};
            if (!this.isEnable(api)) {
                return null;
            }
            if (type === 'always' && loadIn === 'always') {
                return this.getFromStroage(api);
            }
            if (type === 'unsuccess' && loadIn === 'unsuccess') {
                return this.getFromStroage(api);
            }
            return null;
        };
        this.set = (api, response) => {
            var _a, _b;
            if (!this.isEnable(api)) {
                return;
            }
            if ((_a = api.lastSuccess) === null || _a === void 0 ? void 0 : _a.saveCondition) {
                const { saveCondition } = api.lastSuccess;
                const cond = saveCondition({ response });
                if (!cond) {
                    return;
                }
            }
            this.storage.save(api.name, response, (_b = api.lastSuccess) === null || _b === void 0 ? void 0 : _b.expiredIn);
        };
        this.storage = new Storage(id + '-last-success');
    }
}
class Cache {
    constructor(storage, callApi) {
        this.updateCacheByKey = (key) => __awaiter(this, void 0, void 0, function* () {
            if (this.storage.isExpired(key)) {
                this.storage.remove(key);
                return;
            }
            const cachedApi = this.storage.load(key);
            if (!cachedApi) {
                return;
            }
            const { api } = cachedApi;
            if (!api.cache) {
                return;
            }
            const value = yield this.callApi(cachedApi);
            const newCachedApi = { api: cachedApi.api, value };
            this.setCache(api.name, api.cache.name, newCachedApi);
        });
        this.getCachedValue = (apiName, cacheName) => {
            const key = `${apiName}-${cacheName}`;
            let cachedApi = this.storage.load(key);
            if (cachedApi !== undefined) {
                return cachedApi.value;
            }
        };
        this.fetchCachedValue = (apiName, cacheName) => this.updateCacheByKey(`${apiName}-${cacheName}`);
        this.setCache = (apiName, cacheName, cachedApi) => {
            var _a;
            const key = `${apiName}-${cacheName}`;
            const expiredIn = (_a = cachedApi.api.cache) === null || _a === void 0 ? void 0 : _a.expiredIn;
            this.storage.save(key, cachedApi, expiredIn);
        };
        this.removeCache = (apiName, cacheName) => {
            if (cacheName) {
                this.storage.remove(`${apiName}-${cacheName}`);
            }
            else {
                const keys = this.storage.getKeys();
                for (let key of keys) {
                    if (key.indexOf(`${apiName}-`) === 0) {
                        this.storage.remove(key);
                    }
                }
            }
        };
        this.storage = storage;
        this.callApi = callApi;
    }
}
export const CreateInstance = (inst) => {
    let res = useRef(null);
    if (res.current === null) {
        res.current = inst;
    }
    return res.current;
};
