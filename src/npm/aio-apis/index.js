"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var aio_popup_1 = require("./../../npm/aio-popup");
require("./index.css");
var AIOApis = /** @class */ (function () {
    function AIOApis(props) {
        var _this = this;
        var id = props.id, _a = props.getAppState, getAppState = _a === void 0 ? function () { } : _a, loader = props.loader, _b = props.lang, lang = _b === void 0 ? 'en' : _b;
        var storage = new Storage(id);
        this.storage = storage;
        this.getAppState = getAppState;
        this.setStorage = function (name, value) { return storage.save(name, value); };
        this.getStorage = function (name, def) { return storage.load(name, def); };
        this.removeStorage = function (name) { return storage.remove(name); };
        this.setToken = function (token) {
            var res = token || props.token;
            if (res) {
                axios_1.default.defaults.headers.common['Authorization'] = "Bearer ".concat(res);
            }
        };
        this.addAlert = function (p) {
            var type = p.type, text = p.text, subtext = p.subtext, time = p.time, _a = p.alertType, alertType = _a === void 0 ? 'alert' : _a;
            if (alertType === 'alert') {
                new aio_popup_1.default().addAlert({ type: type, text: text, subtext: subtext, time: time, className: 'aio-apis-popup' });
            }
            else {
                new aio_popup_1.default().addSnackebar({ type: type, text: text, subtext: subtext, time: time });
            }
        };
        this.getLoading = function (id) {
            console.log("aio-service show loading by ".concat(id));
            return ("\n              <div class=\"aio-service-loading\" id=\"aio-service-".concat(id, "\">\n                <div class=\"aio-service-loading-0\">\n                  <div class=\"aio-service-loading-1\">\n                    <div class=\"aio-service-loading-2\" style=\"animation: 1s ease-in-out 0.0s infinite normal none running aioserviceloading;\"></div>\n                    <div class=\"aio-service-loading-2\" style=\"animation: 1s ease-in-out 0.1s infinite normal none running aioserviceloading;\"></div>\n                    <div class=\"aio-service-loading-2\" style=\"animation: 1s ease-in-out 0.2s infinite normal none running aioserviceloading;\"></div>\n                    <div class=\"aio-service-loading-2\" style=\"animation: 1s ease-in-out 0.3s infinite normal none running aioserviceloading;\"></div>\n                    <div class=\"aio-service-loading-2\" style=\"animation: 1s ease-in-out 0.4s infinite normal none running aioserviceloading;\"></div>\n                  </div>\n                </div>\n              </div>\n            "));
        };
        this.handleLoading = function (state, apiName, config) {
            var _a = config.loading, loading = _a === void 0 ? true : _a, _b = config.loadingParent, loadingParent = _b === void 0 ? 'body' : _b;
            if (!loading) {
                return;
            }
            if (state) {
                var loadingStr = loader ? "<div class=\"aio-service-loading\" id=\"aio-service-".concat(apiName, "\">").concat(loader(), "</div>") : _this.getLoading(apiName);
                var parent_1 = document.querySelector(loadingParent);
                if (parent_1) {
                    parent_1.insertAdjacentHTML('beforeend', loadingStr);
                }
            }
            else {
                var loadingDom = document.getElementById('aio-service-' + apiName);
                if (!loadingDom) {
                    loadingDom = document.querySelector('.aio-service-loading');
                }
                if (loadingDom) {
                    loadingDom.remove();
                }
            }
        };
        this.handleCacheVersions = function (cacheVersions) {
            var def = {};
            for (var prop in cacheVersions) {
                def[prop] = 0;
            }
            var storedCacheVersions = _this.getStorage('storedCacheVersions', def);
            var diffrences = {};
            for (var prop in cacheVersions) {
                if (storedCacheVersions[prop] === undefined) {
                    continue;
                }
                if (storedCacheVersions[prop] !== cacheVersions[prop]) {
                    diffrences[prop] = true;
                    _this.removeStorage(prop);
                }
                else {
                    diffrences[prop] = false;
                }
            }
            _this.setStorage('storedCacheVersions', cacheVersions);
            return diffrences;
        };
        this.showErrorMessage = function (m) {
            var result = m.result, message = m.message, description = m.description;
            if (message.error === false) {
                return;
            }
            var text;
            if (typeof message.error === 'string') {
                text = message.error;
            }
            else {
                text = lang === 'fa' ? "".concat(description, " \u0628\u0627 \u062E\u0637\u0627 \u0631\u0648\u0628\u0631\u0648 \u0634\u062F") : "An error was occured in ".concat(description);
            }
            _this.addAlert({ type: 'error', text: text, subtext: result, time: message.time, alertType: message.type });
        };
        this.showSuccessMessage = function (m) {
            var result = m.result, message = m.message, description = m.description;
            if (!message.success) {
                return;
            }
            var subtext = typeof message.success === 'function' ? message.success(result) : message.success;
            if (subtext === true) {
                subtext = '';
            }
            _this.addAlert({ type: 'success', text: lang === 'fa' ? "".concat(description, " \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0646\u062C\u0627\u0645 \u0634\u062F") : "".concat(description, " was successfull"), subtext: subtext, time: message.time, alertType: message.type });
        };
        this.responseToResult = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var url, method, body, getResult, _a, config, _b, onCatch, _c, getError, response, error, err_1, error, catchResult;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = p.url, method = p.method, body = p.body, getResult = p.getResult, _a = p.config, config = _a === void 0 ? {} : _a;
                        _b = config.onCatch, onCatch = _b === void 0 ? props.onCatch : _b, _c = config.getError, getError = _c === void 0 ? props.getError : _c;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default[method](url, body !== undefined ? body : undefined)];
                    case 2:
                        response = _d.sent();
                        if (response) {
                            error = getError ? getError(response, config) : undefined;
                            if (typeof error === 'string') {
                                return [2 /*return*/, error];
                            }
                        }
                        return [2 /*return*/, getResult(response)];
                    case 3:
                        err_1 = _d.sent();
                        error = getError ? getError(err_1.response || err_1, config) : undefined;
                        if (error) {
                            return [2 /*return*/, error];
                        }
                        catchResult = void 0;
                        try {
                            catchResult = onCatch ? onCatch(err_1, config) : undefined;
                        }
                        catch (err) {
                            catchResult = err.message || err.Message;
                        }
                        if (!catchResult) {
                            catchResult = err_1.message || err_1.Message;
                        }
                        return [2 /*return*/, catchResult];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.requestFn = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var _a, config, parameter, id, onError, onSuccess, errorResult, cache, _b, message, _c, description, token, res, result;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = p.config, config = _a === void 0 ? {} : _a, parameter = p.parameter;
                        id = 'aa' + Math.round(Math.random() * 100000);
                        onError = config.onError, onSuccess = config.onSuccess, errorResult = config.errorResult, cache = config.cache, _b = config.message, message = _b === void 0 ? {} : _b, _c = config.description, description = _c === void 0 ? id : _c, token = config.token;
                        if (cache) {
                            res = this.storage.load(cache.name, undefined, cache.time);
                            if (res !== undefined) {
                                return [2 /*return*/, res];
                            }
                        }
                        this.setToken(token);
                        this.handleLoading(true, id, config);
                        return [4 /*yield*/, this.responseToResult(p)];
                    case 1:
                        result = _d.sent();
                        description = typeof description === 'function' ? description(parameter) : description;
                        if (typeof result === 'string') {
                            this.showErrorMessage({ result: result, message: message, description: description });
                            if (onError) {
                                onError(result);
                            }
                            result = errorResult;
                        }
                        else {
                            this.showSuccessMessage({ result: result, message: message, description: description });
                            if (result === undefined) {
                                result = errorResult;
                            }
                            if (cache) {
                                this.storage.save(cache.name, result);
                            }
                            if (onSuccess) {
                                onSuccess(result);
                            }
                        }
                        this.handleLoading(false, id, config);
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.request = function (setting) { return __awaiter(_this, void 0, void 0, function () {
            var url, body, description, message, loading, loadingParent, token, onError, onSuccess, errorResult, cache, parameter, onCatch, getError, config, getResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = setting.url, body = setting.body, description = setting.description, message = setting.message, loading = setting.loading, loadingParent = setting.loadingParent, token = setting.token, onError = setting.onError, onSuccess = setting.onSuccess, errorResult = setting.errorResult, cache = setting.cache, parameter = setting.parameter;
                        onCatch = setting.onCatch || props.onCatch;
                        getError = setting.getError || props.getError;
                        config = { description: description, message: message, loading: loading, loadingParent: loadingParent, token: token, onError: onError, onSuccess: onSuccess, onCatch: onCatch, getError: getError, errorResult: errorResult, cache: cache };
                        getResult = typeof setting.getResult === 'function' ? setting.getResult : function () { };
                        return [4 /*yield*/, this.requestFn({
                                parameter: parameter,
                                config: config,
                                method: !setting.method ? 'post' : setting.method,
                                body: body,
                                url: url,
                                getResult: getResult
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
    }
    return AIOApis;
}());
exports.default = AIOApis;
var Storage = /** @class */ (function () {
    function Storage(id) {
        var _this = this;
        this.model = {};
        this.time = {};
        this.init = function () {
            var storage = localStorage.getItem('storageClass' + id);
            var timeStorage = localStorage.getItem('storageClassTime' + id);
            var model, time;
            if (storage === undefined || storage === null) {
                model = {};
            }
            else {
                model = JSON.parse(storage);
            }
            if (timeStorage === undefined || timeStorage === null) {
                time = {};
            }
            else {
                time = JSON.parse(timeStorage);
            }
            _this.model = model;
            _this.time = time;
            _this.saveStorage(model, time);
        };
        this.saveStorage = function (model, time) {
            localStorage.setItem('storageClass' + id, JSON.stringify(model));
            localStorage.setItem('storageClassTime' + id, JSON.stringify(time));
        };
        this.getParent = function (field) {
            var fields = field.split('.');
            var parent = _this.model;
            for (var i = 0; i < fields.length - 1; i++) {
                parent = parent[fields[i]];
                if (typeof parent !== 'object') {
                    return;
                }
            }
            return parent;
        };
        this.removeValueByField = function (field) {
            var fields = field.split('.');
            var parent = _this.getParent(field);
            var lastField = fields[fields.length - 1];
            var newParent = {};
            for (var prop in parent) {
                if (prop !== lastField) {
                    newParent[prop] = parent[prop];
                }
            }
            fields.pop();
            return _this.setValueByField(fields.join('.'), newParent);
        };
        this.setValueByField = function (field, value) {
            if (!field) {
                _this.model = value;
                return;
            }
            var fields = field.split('.');
            var parent = _this.model;
            for (var i = 0; i < fields.length - 1; i++) {
                var f = fields[i];
                if (parent[f] === undefined) {
                    parent[f] = {};
                }
                parent = parent[f];
            }
            parent[fields[fields.length - 1]] = value;
            return _this.getValueByField(fields[0]);
        };
        this.getValueByField = function (field) {
            var fields = field.split('.');
            var model = _this.model;
            var parent = __assign({}, model);
            for (var i = 0; i < fields.length - 1; i++) {
                parent = parent[fields[i]];
                if (typeof parent !== 'object') {
                    return;
                }
            }
            return parent[fields[fields.length - 1]];
        };
        this.save = function (field, value) {
            try {
                value = JSON.parse(JSON.stringify(value));
            }
            catch (_a) {
                value = value;
            }
            if (!field || field === null) {
                return {};
            }
            var res = _this.setValueByField(field, value);
            _this.time[field] = new Date().getTime();
            _this.saveStorage(_this.model, _this.time);
            return res;
        };
        this.remove = function (field, callback) {
            if (callback === void 0) { callback = function () { }; }
            var res = _this.removeValueByField(field);
            var newTime = {};
            for (var prop in _this.time) {
                if (prop !== field) {
                    newTime[prop] = _this.time[prop];
                }
            }
            _this.time = newTime;
            _this.saveStorage(_this.model, _this.time);
            callback();
            return res;
        };
        this.load = function (field, def, time) {
            var value = _this.getValueByField(field);
            if (time && value !== undefined) {
                var thisTime = new Date().getTime();
                var lastTime = _this.time[field] || thisTime;
                var dif = Math.abs(thisTime - lastTime);
                if (dif > time) {
                    value = undefined;
                }
            }
            if (value === undefined && def !== undefined) {
                value = typeof def === 'function' ? def() : def;
                _this.save(field, def);
            }
            return value;
        };
        this.clear = function () { _this.model = {}; _this.time = {}; _this.saveStorage(_this.model, _this.time); };
        this.getModel = function () { return JSON.parse(JSON.stringify(_this.model)); };
        this.init();
    }
    return Storage;
}());
