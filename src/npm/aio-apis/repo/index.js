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
import { Stall, Storage } from 'aio-utils';
import { useRef } from 'react';
export default class AIOApis {
    constructor(props) {
        this.currentError = '';
        this.apisThatAreInLoadingTime = {};
        this.setToken = (token) => {
            if (token && token === this.token) {
                Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        };
        this.addAlert = (p) => {
            let { type, text, subtext, time } = p;
            Alert({ type, text, subtext, time, className: 'aio-apis-popup', closeText: this.props.lang === 'fa' ? 'بستن' : 'Close' });
        };
        this.getUrlQueryParam = (params) => {
            if (typeof params === 'string') {
                return `/${params}`;
            }
            else if (typeof params === 'object' && params !== null) {
                const queryString = Object.keys(params)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                    .join('&');
                return `?${queryString}`;
            }
            return '';
        };
        this.responseToResult = (api) => __awaiter(this, void 0, void 0, function* () {
            const { headers = this.props.headers, onSuccess } = api;
            const { onCatch } = this.props;
            if (!onCatch) {
                const errorMessage = `
                missing onCatch in api: ${api.description},
                you should set onCatch in api or in props of AIOApis    
            `;
                return { result: false, errorMessage, success: false, response: {} };
            }
            try {
                let response = yield Axios({ method: api.method, url: api.url, data: api.body, headers });
                try {
                    return { result: onSuccess(response), success: true, response, errorMessage: '' };
                }
                catch (err) {
                    return { result: err.message, success: false, response, errorMessage: '' };
                }
            }
            catch (response) {
                try {
                    return { result: false, errorMessage: onCatch(response, api), success: false, response };
                }
                catch (err) {
                    return { result: false, errorMessage: err.message, success: false, response };
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
            if (api.mock && !!this[api.mock.methodName]) {
                const methodName = api.mock.methodName;
                handleMockApi({ url: api.url, delay: api.mock.delay, method: api.method, result: (config) => this[methodName](config) });
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
                return false;
            }
            this.setToken(api.token || this.props.token);
            this.handleMock(api);
            if (api.cache) {
                let cachedValue = this.cache.getCachedValue(api.name, api.cache.name);
                if (cachedValue !== undefined) {
                    return api.onSuccess(cachedValue);
                }
            }
            else {
                this.cache.removeCache(api.name);
            }
            this.loading(api, true);
            this.apisThatAreInLoadingTime[api.name] = true;
            let { result, errorMessage, success, response } = yield this.responseToResult(api);
            this.loading(api, false);
            this.apisThatAreInLoadingTime[api.name] = false;
            if (!success) {
                let message = errorMessage;
                if (api.onError) {
                    message = api.onError(response, message);
                }
                if (typeof message === 'string') {
                    this.currentError = message;
                    if (!isRetry) {
                        let text = this.props.lang === 'fa' ? `${api.description} با خطا روبرو شد` : `An error was occured in ${api.description}`;
                        this.addAlert({ type: 'error', text, subtext: message });
                    }
                }
            }
            else if (api.cache) {
                this.cache.setCache(api.name, api.cache.name, { api, value: response });
            }
            return result;
        });
        this.retries = (api, times) => __awaiter(this, void 0, void 0, function* () {
            const retries = [0, ...times];
            return yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < retries.length; i++) {
                    yield Stall(retries[i]);
                    if (i < retries.length - 1) {
                        const res = yield this.requestFn(api, true);
                        if (res !== false) {
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
                        resolve(res);
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
    }
}
function handleMockApi(p) {
    // const methodRes = {'get':'onGet','post':'onPost'}[p.method]
    // const fn = (mock as any)[methodRes]
    const mock = new MockAdapter(Axios);
    if (p.method === 'get') {
        mock.resetHandlers();
        mock.onGet(p.url).replyOnce((config) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const { status, data } = p.result(config);
                    resolve([status, data]);
                    mock.restore();
                }, p.delay);
            });
        });
    }
    if (p.method === 'post') {
        mock.resetHandlers();
        mock.onPost(p.url).replyOnce((config) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const { status, data } = p.result(config);
                    resolve([status, data]);
                    mock.restore();
                }, p.delay);
            });
        });
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
export const useInstance = (inst) => {
    let res = useRef(null);
    if (res.current === null) {
        res.current = inst;
    }
    return res.current;
};
