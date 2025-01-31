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
export default class AIOApis {
    constructor(props) {
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
            const { headers = this.props.headers, getResult } = api;
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
                    return { result: getResult(response), success: true, response, errorMessage: '' };
                }
                catch (err) {
                    return { result: err.message, success: false, response, errorMessage: '' };
                }
            }
            catch (response) {
                try {
                    return { result: false, errorMessage: onCatch[api.onCatch](response, api), success: false, response };
                }
                catch (err) {
                    return { result: false, errorMessage: err.message, success: false, response };
                }
            }
        });
        this.showErrorMessage = (p) => {
            const { description } = p.api;
            if (!p.errorMessage) {
                return;
            }
            let errorMessage = p.errorMessage;
            if (p.api.errorMessage) {
                const res = p.api.errorMessage({ response: p.response, message: p.errorMessage });
                if (res !== false) {
                    errorMessage = res;
                }
                else {
                    return;
                }
            }
            let text = this.props.lang === 'fa' ? `${description} با خطا روبرو شد` : `An error was occured in ${description}`;
            this.addAlert({ type: 'error', text, subtext: errorMessage });
        };
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
        this.request = (api, isCalledByCache) => __awaiter(this, void 0, void 0, function* () {
            if (this.apisThatAreInLoadingTime[api.name]) {
                return false;
            }
            this.setToken(api.token || this.props.token);
            this.handleMock(api);
            if (!isCalledByCache) {
                if (api.cache) {
                    let cachedValue = this.cache.getCachedValue(api.name, api.cache.name);
                    if (cachedValue !== undefined) {
                        return api.getResult(cachedValue);
                    }
                }
                else {
                    this.cache.removeCache(api.name);
                }
            }
            this.loading(api, true);
            this.apisThatAreInLoadingTime[api.name] = true;
            let { result, errorMessage, success, response } = yield this.responseToResult(api);
            this.loading(api, false);
            this.apisThatAreInLoadingTime[api.name] = false;
            if (api.onError && !success) {
                api.onError(errorMessage);
            }
            if (!!success) {
                if (api.onSuccess) {
                    api.onSuccess(result);
                }
                if (api.successMessage) {
                    const res = api.successMessage({ response, result: result });
                    if (res) {
                        this.addAlert({ type: 'success', subtext: res, text: '' });
                    }
                }
            }
            else {
                this.showErrorMessage({ errorMessage, api, response });
                return result;
            }
            if (success && api.cache) {
                this.cache.setCache(api.name, api.cache.name, { api, value: response });
            }
            return result;
        });
        console.log('aio-apis constructor');
        this.props = props;
        const storage = new Storage(props.id);
        this.token = props.token;
        this.setToken(props.token);
        this.cache = new Cache(storage, (cachedApi) => __awaiter(this, void 0, void 0, function* () { return yield this.callCache(cachedApi.api); }));
        this.getCachedValue = this.cache.getCachedValue;
        this.fetchCachedValue = this.cache.fetchCachedValue;
        this.editCachedExpiredIn = this.cache.editCachedExpiredIn;
        this.editCachedInterval = this.cache.editCachedInterval;
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
        this.intervals = {};
        this.getKey = (cachedApi) => `${cachedApi.api.name}-${cachedApi.api.cache.name}`;
        this.detectIntervalChange = (cachedApi) => {
            var _a;
            const interval = (_a = cachedApi.api.cache) === null || _a === void 0 ? void 0 : _a.interval;
            const existIntervalObject = (this.intervals[this.getKey(cachedApi)] || {});
            return interval !== existIntervalObject.repeatTime;
        };
        this.SetInterval = (key) => {
            const cachedApi = this.getCachedApi(key);
            if (!cachedApi) {
                return false;
            }
            const { api } = cachedApi, { cache } = api;
            if (!cache) {
                return false;
            }
            if (!this.detectIntervalChange(cachedApi)) {
                return false;
            }
            const { interval = 0 } = cache;
            if (interval < 1000) {
                return false;
            }
            this.ClearInterval(key);
            this.intervals[key] = this.intervals[key] || { repeatTime: interval, value: undefined };
            this.intervals[key].value = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                console.log(`AIOApis => call api by api.name='${cachedApi.api.name}' and cache.name='${(_b = (_a = cachedApi.api) === null || _a === void 0 ? void 0 : _a.cache) === null || _b === void 0 ? void 0 : _b.name}' by interval (${interval} miliseconds)`);
                this.updateCacheByKey(key);
            }), interval);
            return true;
        };
        this.ClearInterval = (key) => {
            clearInterval((this.intervals[key] || {}).value);
            this.intervals[key] = undefined;
        };
        this.getCachedApi = (key) => {
            const res = this.storage.load(key);
            return res;
        };
        this.updateCacheByKey = (key) => __awaiter(this, void 0, void 0, function* () {
            if (this.storage.isExpired(key)) {
                this.removeByKey(key);
                return;
            }
            const cachedApi = this.getCachedApi(key);
            if (!cachedApi) {
                return;
            }
            const { api } = cachedApi;
            if (!api.cache) {
                return;
            }
            debugger;
            const value = yield this.callApi(cachedApi);
            const newCachedApi = { api: cachedApi.api, value };
            this.setCache(api.name, api.cache.name, newCachedApi);
        });
        this.getCachedValue = (apiName, cacheName) => {
            let cachedApi = this.getCachedApi(`${apiName}-${cacheName}`);
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
            if (!this.SetInterval(key)) {
                this.ClearInterval(key);
            }
        };
        this.editCache = (apiName, cacheName, prop, value) => {
            const key = `${apiName}-${cacheName}`;
            const cachedApi = this.getCachedApi(key);
            if (!cachedApi) {
                return;
            }
            const { api } = cachedApi;
            const { cache } = api;
            const newCache = Object.assign(Object.assign({}, cache), { [prop]: value });
            const newCachedApi = Object.assign(Object.assign({}, cachedApi), { api: Object.assign(Object.assign({}, api), { cache: newCache }) });
            this.setCache(apiName, cacheName, newCachedApi);
        };
        this.editCachedExpiredIn = (apiName, cacheName, expiredIn) => {
            this.editCache(apiName, cacheName, 'expiredIn', expiredIn);
        };
        this.editCachedInterval = (apiName, cacheName, interval) => {
            this.editCache(apiName, cacheName, 'interval', interval);
        };
        this.removeByKey = (key) => {
            clearInterval((this.intervals[key] || {}).value);
            this.storage.remove(key);
        };
        this.removeCache = (apiName, cacheName) => {
            if (cacheName) {
                this.removeByKey(`${apiName}-${cacheName}`);
            }
            else {
                const keys = this.storage.getKeys();
                for (let key of keys) {
                    if (key.indexOf(`${apiName}-`) === 0) {
                        this.removeByKey(key);
                    }
                }
            }
        };
        this.storage = storage;
        this.callApi = callApi;
    }
}
export class Storage {
    constructor(id) {
        this.init = () => {
            let storage = localStorage.getItem('storageClass' + this.id);
            this.setModel(storage === undefined || storage === null ? {} : JSON.parse(storage));
        };
        this.copy = (v) => JSON.parse(JSON.stringify(v));
        this.setModel = (model) => {
            this.model = model;
            localStorage.setItem('storageClass' + this.id, JSON.stringify(model));
            return this.copy(model);
        };
        this.getNow = () => new Date().getTime();
        this.save = (field, value, expiredIn) => {
            if (value === undefined) {
                return this.copy(this.model);
            }
            const newModel = Object.assign({}, this.model), now = this.getNow();
            newModel[field] = { value, saveTime: now, expiredIn: Infinity };
            if (expiredIn) {
                newModel[field].expiredIn = expiredIn;
            }
            return this.setModel(newModel);
        };
        this.remove = (field) => {
            const newModel = {};
            for (let prop in this.model) {
                if (prop !== field) {
                    newModel[prop] = this.model[prop];
                }
            }
            return this.setModel(newModel);
        };
        this.removeKeyFromObject = (obj, key) => {
            const newObj = {};
            for (let prop in obj) {
                if (prop !== key) {
                    newObj[prop] = obj[prop];
                }
            }
            return newObj;
        };
        this.isExpired = (field) => {
            if (!this.model[field]) {
                return true;
            }
            return this.model[field].expiredIn < this.getNow();
        };
        this.load = (field, def, expiredIn) => {
            const obj = this.model[field];
            if (!obj) {
                this.save(field, def, expiredIn);
                return def;
            }
            const isExpired = this.isExpired(field);
            if (isExpired) {
                this.save(field, def, expiredIn);
                return def;
            }
            else {
                return obj.value;
            }
        };
        this.clear = () => this.setModel({});
        this.download = (file, name) => {
            if (!name || name === null) {
                return;
            }
            let text = JSON.stringify(file);
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', name);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        };
        this.export = () => {
            let name = window.prompt('Please Inter File Name');
            if (name === null || !name) {
                return;
            }
            this.download({ model: this.model }, name);
        };
        this.read = (file) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const fr = new FileReader();
                fr.onload = () => {
                    try {
                        const result = JSON.parse(fr.result);
                        resolve(result);
                    }
                    catch (error) {
                        reject(new Error('Error parsing JSON: ' + error.message));
                    }
                };
                fr.onerror = () => reject(new Error('Error reading file.'));
                fr.readAsText(file);
            });
        });
        this.import = (file) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.read(file);
            if (model === undefined) {
                return this.model;
            }
            return this.setModel(model);
        });
        this.getKeys = () => Object.keys(this.model);
        this.model = {};
        this.id = id;
        this.init();
    }
}
