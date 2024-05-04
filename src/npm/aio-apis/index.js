"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var index_1 = require("./../../npm/aio-utils/index");
var index_2 = require("./../../npm/aio-popup/index");
var jquery_1 = require("jquery");
require("./index.css");
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
var AIOApis = /** @class */ (function () {
    function AIOApis(props) {
        var _this = this;
        var id = props.id, _a = props.getAppState, getAppState = _a === void 0 ? function () { } : _a, baseUrl = props.baseUrl, token = props.token, loader = props.loader, apis = props.apis, _b = props.mock, mock = _b === void 0 ? {} : _b, _c = props.lang, lang = _c === void 0 ? 'en' : _c;
        var storage = new index_1.Storage(id);
        this.storage = storage;
        this.DATE = new index_1.AIODate();
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
            var type = p.type, text = p.text, subtext = p.subtext, message = p.message;
            var time = message.time, _a = message.type, alertType = _a === void 0 ? 'alert' : _a;
            alertType = alertType || 'alert';
            if (alertType === 'alert') {
                new index_2.default().addAlert({ type: type, text: text, subtext: subtext, time: time });
            }
            else {
                new index_2.default().addSnackebar({ type: type, text: text, subtext: subtext, time: time });
            }
        };
        this.dateToString = function (date, pattern) {
            if (pattern === void 0) { pattern = '{year}/{month}/{day}'; }
            return _this.DATE.getDateByPattern(date, pattern);
        };
        this.dateToNumber = function (date) {
            return _this.DATE.getTime(date);
        };
        this.dateToArray = function (date, jalali) {
            return _this.DATE.convertToArray(date, jalali);
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
                var parent_1 = (0, jquery_1.default)(loadingParent);
                parent_1.append(loadingStr);
            }
            else {
                var loadingDom = (0, jquery_1.default)('#aio-service-' + apiName);
                if (!loadingDom.length) {
                    loadingDom = (0, jquery_1.default)('.aio-service-loading');
                }
                loadingDom.remove();
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
            _this.addAlert({ type: 'error', text: text, subtext: result, message: message });
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
            _this.addAlert({ type: 'success', text: lang === 'fa' ? "".concat(description, " \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0646\u062C\u0627\u0645 \u0634\u062F") : "".concat(description, " was successfull"), subtext: subtext, message: message });
        };
        this.responseToResult = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var url, method, body, getResult, _a, config, _b, onCatch, _c, getError, response, error, err_1, catchResult;
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
                        console.log(err_1);
                        return [2 /*return*/, catchResult];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.request = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var id, _a, config, mockResult, parameter, res, onError, onSuccess, errorResult, cache, _b, message, _c, description, token, res, result;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        id = p.id, _a = p.config, config = _a === void 0 ? {} : _a, mockResult = p.mockResult, parameter = p.parameter;
                        if (!(mockResult && typeof mock[id] === 'function')) return [3 /*break*/, 2];
                        this.handleLoading(true, id, config);
                        return [4 /*yield*/, mock[id](parameter)];
                    case 1:
                        res = _d.sent();
                        this.handleLoading(false, id, config);
                        if (config.onSuccess) {
                            config.onSuccess(res);
                        }
                        return [2 /*return*/, res];
                    case 2:
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
                    case 3:
                        result = _d.sent();
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
        this.fn = {};
        var _loop_1 = function (prop) {
            this_1.fn[prop] = function (p, Setting) {
                var setting = apis[prop];
                var _a = Setting || {}, _b = _a.description, description = _b === void 0 ? setting.description : _b, _c = _a.message, message = _c === void 0 ? setting.message : _c, _d = _a.loading, loading = _d === void 0 ? setting.loading : _d, _e = _a.loadingParent, loadingParent = _e === void 0 ? setting.loadingParent : _e, _f = _a.token, token = _f === void 0 ? setting.token : _f, _g = _a.onError, onError = _g === void 0 ? setting.onError : _g, _h = _a.onSuccess, onSuccess = _h === void 0 ? setting.onSuccess : _h, _j = _a.onCatch, onCatch = _j === void 0 ? setting.onCatch : _j, _k = _a.getError, getError = _k === void 0 ? setting.getError : _k, _l = _a.errorResult, errorResult = _l === void 0 ? setting.errorResult : _l, _m = _a.cache, cache = _m === void 0 ? setting.cache : _m, mockResultByCalling = _a.mockResult;
                var getBody = setting.getBody;
                var config = { description: description, message: message, loading: loading, loadingParent: loadingParent, token: token, onError: onError, onSuccess: onSuccess, onCatch: onCatch, getError: getError, errorResult: errorResult, cache: cache };
                var body = typeof getBody === 'function' ? getBody(p) : undefined;
                var url = typeof setting.getUrl === 'function' ? setting.getUrl(baseUrl) : '';
                var getResult = typeof setting.getResult === 'function' ? setting.getResult : function () { };
                var mockResult = !!setting.mockResult || !!mockResultByCalling;
                return _this.request({
                    parameter: p,
                    config: config,
                    mockResult: mockResult,
                    method: !setting.method ? 'post' : setting.method,
                    body: body,
                    url: url,
                    id: prop,
                    getResult: getResult
                });
            };
        };
        var this_1 = this;
        for (var prop in apis) {
            _loop_1(prop);
        }
    }
    return AIOApis;
}());
exports.default = AIOApis;
