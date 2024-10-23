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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRandomNumber = exports.GetArray = exports.CalculateDistance = exports.SplitNumber = exports.AIODate = void 0;
var express_1 = require("express");
//@ts-ignore
var mongoose_1 = require("mongoose");
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
var body_parser_1 = require("body-parser");
var cookie_parser_1 = require("cookie-parser");
var cors_1 = require("cors");
var AIOExpress = /** @class */ (function () {
    function AIOExpress(p) {
        var _this = this;
        this.tokenBaseDic = {};
        this.tokenLessDic = {};
        this.getModel = function (key) { return _this.models[key]; };
        this.addEntity = function (entity) { return _this.handleEntity(entity); };
        this.fixPath = function (path) { return path[0] !== '/' ? "/".concat(path) : path; };
        this.start = function () {
            _this.app.use((0, cors_1.default)());
            _this.app.use(body_parser_1.default.json());
            _this.app.use((0, cookie_parser_1.default)());
            _this.app.use(body_parser_1.default.urlencoded({ extended: true }));
            _this.connectToMongoose();
            if (_this.AuthRouter && _this.p.auth) {
                var path = _this.p.auth.path;
                _this.app.use(_this.fixPath(path), _this.AuthRouter);
            }
            // Routes without token
            for (var name_1 in _this.tokenLessDic) {
                _this.app.use(_this.tokenLessDic[name_1], _this.routers[name_1]);
            }
            // Middleware JWT
            _this.app.use(_this.jwt);
            // Routes with token
            for (var name_2 in _this.tokenBaseDic) {
                var path = _this.tokenBaseDic[name_2];
                var router = _this.routers[name_2];
                _this.app.use(path, router);
            }
            _this.app.listen(_this.env.port, function () {
                console.log("Server running on port ".concat(_this.env.port));
            });
        };
        this.connectToMongoose = function () {
            var url = _this.env.mongoUrl;
            mongoose_1.default
                .connect(url)
                .then(function () { return console.log('MongoDB connected'); })
                .catch(function (err) { return console.log(err); });
        };
        this.getSchema = function (schemaObj) {
            var fields = {}; // برای نگه‌داری فیلدهای mongoose
            // پیمایش درون fields برای تعریف فیلدها
            Object.keys(schemaObj).forEach(function (fieldKey) {
                var fieldConfig = schemaObj[fieldKey];
                // تنظیمات فیلد برای mongoose
                var mongooseField = {
                    type: { 'string': String, 'boolean': Boolean, 'number': Number, 'date': Date, 'object': mongoose_1.default.Schema.Types.Mixed }[fieldConfig.type],
                    required: !!fieldConfig.required,
                    unique: !!fieldConfig.unique,
                };
                if (fieldConfig.def !== undefined)
                    mongooseField.default = fieldConfig.def;
                if (fieldConfig.ref)
                    mongooseField.ref = fieldConfig.ref;
                if (fieldConfig.options)
                    mongooseField.enum = fieldConfig.options;
                if (fieldConfig.minLength)
                    mongooseField.minLength = fieldConfig.minLength;
                if (fieldConfig.maxLength)
                    mongooseField.maxLength = fieldConfig.maxLength;
                if (fieldConfig.min)
                    mongooseField.min = fieldConfig.min;
                if (fieldConfig.max)
                    mongooseField.max = fieldConfig.max;
                if (fieldConfig.index !== undefined)
                    mongooseField.index = fieldConfig.index;
                if (fieldConfig.validate) {
                    mongooseField.validate = { validator: fieldConfig.validate, message: fieldConfig.errorMessage || 'Validation failed' };
                }
                // اضافه کردن فیلد به fields
                fields[fieldKey] = mongooseField;
            });
            // ساخت اسکیما با استفاده از فیلدهای تنظیم شده
            var schema = new mongoose_1.default.Schema(fields, {
                timestamps: true, // اضافه کردن زمان‌های create و update
                toJSON: { virtuals: true }, // فعال‌سازی فیلدهای مجازی در خروجی JSON
                toObject: { virtuals: true }, // فعال‌سازی فیلدهای مجازی در خروجی Object
            });
            return schema;
        };
        this.getTotal = function (name) { return __awaiter(_this, void 0, void 0, function () {
            var model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model = this.getModel(name);
                        return [4 /*yield*/, model.countDocuments({})];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.getNewPassword = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var isMatch, hashedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.default.compare(p.oldPassword, p.userPassword)];
                    case 1:
                        isMatch = _a.sent();
                        if (!isMatch) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, bcryptjs_1.default.hash(p.newPassword, 10)];
                    case 2:
                        hashedPassword = _a.sent();
                        return [2 /*return*/, hashedPassword];
                }
            });
        }); };
        this.initJwt = function (req, res, next) {
            if (!_this.p.auth) {
                return;
            }
            var token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Access denied. No token provided.', success: false });
            }
            jsonwebtoken_1.default.verify(token, _this.env.secretKey, function (err, decoded) {
                if (err) {
                    return res.status(401).json({ message: 'Invalid token or token is expired.' });
                }
                req.user = decoded;
                next();
            });
        };
        this.getExpiresIn = function () {
            if (!_this.p.auth) {
                return '';
            }
            var tokenTime = _this.p.auth.tokenTime;
            var unit = tokenTime.unit, value = tokenTime.value;
            return "".concat(value).concat(unit);
        };
        this.handleAuth = function () {
            if (!_this.p.auth) {
                return;
            }
            var _a = _this.p.auth, schema = _a.schema, registerExeption = _a.registerExeption;
            var scm = __assign(__assign({}, schema), { password: { type: 'string', required: true }, userName: { type: 'string', required: true, unique: true } });
            var authSchema = _this.getSchema(scm);
            authSchema.methods.matchPassword = function (enteredPassword) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bcryptjs_1.default.compare(enteredPassword, this.password)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            };
            _this.AuthModel = mongoose_1.default.model(_this.p.auth.name, authSchema);
            // Register Route
            var registerFn = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, userName, password, userProps, existingUser, defModel, prop, _b, required, def, val, exep, status_1, message, hashedPassword, userModel, newUser, err_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!this.AuthModel) {
                                return [2 /*return*/, res.status(400).json({ message: 'class error 23423' })];
                            }
                            _a = req.body, userName = _a.userName, password = _a.password, userProps = _a.userProps;
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 7, , 8]);
                            return [4 /*yield*/, this.AuthModel.findOne({ userName: userName })];
                        case 2:
                            existingUser = _c.sent();
                            if (existingUser) {
                                return [2 /*return*/, res.status(403).json({ message: 'User with this username already exists' })];
                            }
                            if (!password || !userName) {
                                return [2 /*return*/, res.status(403).json({ message: 'Missing username or password' })];
                            }
                            defModel = {};
                            for (prop in schema) {
                                if (prop === 'userName' || prop === 'password')
                                    continue;
                                _b = schema[prop], required = _b.required, def = _b.def;
                                if (required) {
                                    if (userProps[prop] === undefined) {
                                        return [2 /*return*/, res.status(400).json({ message: "register missing ".concat(prop) })];
                                    }
                                }
                                val = userProps[prop];
                                val = val === undefined ? def : val;
                                if (val !== undefined) {
                                    defModel[prop] = val;
                                }
                            }
                            if (!registerExeption) return [3 /*break*/, 4];
                            return [4 /*yield*/, registerExeption({ userName: userName, password: password, userProps: userProps })];
                        case 3:
                            exep = _c.sent();
                            if (exep) {
                                status_1 = exep.status, message = exep.message;
                                return [2 /*return*/, res.status(status_1).json({ message: message, success: false })];
                            }
                            _c.label = 4;
                        case 4: return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                        case 5:
                            hashedPassword = _c.sent();
                            userModel = __assign(__assign({}, defModel), { password: hashedPassword, userName: userName });
                            newUser = new this.AuthModel(userModel);
                            return [4 /*yield*/, newUser.save()];
                        case 6:
                            _c.sent();
                            return [2 /*return*/, res.status(201).json({ message: 'User registered successfully', user: userModel })];
                        case 7:
                            err_1 = _c.sent();
                            return [2 /*return*/, res.status(500).json({ message: 'Error registering user', error: err_1.message })];
                        case 8: return [2 /*return*/];
                    }
                });
            }); };
            _this.AuthRouter.post('/register', registerFn);
            var loginFn = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, userName, password, user, _b, secretKey, token, err_2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!this.AuthModel) {
                                return [2 /*return*/];
                            }
                            _a = req.body, userName = _a.userName, password = _a.password;
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.AuthModel.findOne({ userName: userName })];
                        case 2:
                            user = _c.sent();
                            _b = !user;
                            if (_b) return [3 /*break*/, 4];
                            return [4 /*yield*/, user.matchPassword(password)];
                        case 3:
                            _b = !(_c.sent());
                            _c.label = 4;
                        case 4:
                            if (_b) {
                                return [2 /*return*/, res.status(400).json({ message: 'Invalid username or password' })];
                            }
                            secretKey = this.env.secretKey;
                            token = jsonwebtoken_1.default.sign({ id: user._id }, secretKey, { expiresIn: this.getExpiresIn() });
                            return [2 /*return*/, res.status(200).json({ message: 'Login successful', token: token, user: user })];
                        case 5:
                            err_2 = _c.sent();
                            return [2 /*return*/, res.status(500).json({ message: 'Error logging in', error: err_2.message })];
                        case 6: return [2 /*return*/];
                    }
                });
            }); };
            // Login Route
            _this.AuthRouter.post('/login', loginFn);
            _this.AuthRouter.get('/checkToken', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var token;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    if (!this.p.auth) {
                        return [2 /*return*/];
                    }
                    try {
                        token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
                        jsonwebtoken_1.default.verify(token, this.env.secretKey, function (err, decoded) {
                            if (err) {
                                return _this.setResult({ res: res, message: 'Token is invalid', success: false, status: 401 });
                            }
                            return _this.setResult({ res: res, message: 'authorized', success: true, status: 201 });
                        });
                    }
                    catch (err) {
                        return [2 /*return*/, this.setResult({ res: res, status: 500, success: false, message: err.message })];
                    }
                    return [2 /*return*/];
                });
            }); });
        };
        this.handleEntity = function (entity) {
            var name = entity.name, schema = entity.schema, apis = entity.apis, _a = entity.requiredToken, requiredToken = _a === void 0 ? true : _a, path = entity.path;
            var dicName = requiredToken ? 'tokenBaseDic' : 'tokenLessDic';
            _this[dicName][name] = _this.fixPath(path);
            if (schema) {
                try {
                    var entitySchema = _this.getSchema(schema), entityModel = mongoose_1.default.model(name, entitySchema);
                    _this.models[name] = entityModel;
                }
                catch (err) {
                    console.error("Error creating model for entity ".concat(name, ":"), err.message);
                    return;
                }
            }
            try {
                _this.routers[name] = express_1.default.Router();
                var _loop_1 = function (api) {
                    var path_1 = api.path, method = api.method, fn = api.fn;
                    _this.routers[name][method](_this.fixPath(path_1), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var reqUser, reqUserId, result, err_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, this.getUserByReq(req)];
                                case 1:
                                    reqUser = _a.sent();
                                    reqUserId = req.user.id;
                                    if (reqUser === null) {
                                        return [2 /*return*/, { success: false, message: 'req user not found', status: 403 }];
                                    }
                                    if (typeof reqUser === 'string') {
                                        return [2 /*return*/, { success: false, message: reqUser, status: 403 }];
                                    }
                                    return [4 /*yield*/, fn(req, res, reqUser, reqUserId)];
                                case 2:
                                    result = _a.sent();
                                    return [2 /*return*/, this.setResult(__assign(__assign({}, result), { res: res }))];
                                case 3:
                                    err_3 = _a.sent();
                                    return [2 /*return*/, res.status(500).json({ message: err_3.message, success: false })];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                };
                for (var _i = 0, apis_1 = apis; _i < apis_1.length; _i++) {
                    var api = apis_1[_i];
                    _loop_1(api);
                }
            }
            catch (err) {
                console.error("Error creating router for entity ".concat(name, ":"), err.message);
            }
        };
        this.setResult = function (p) {
            return p.res.status(p.status).json({ message: p.message, success: p.success, value: p.value });
        };
        this.getUserByReq = function (req) { return __awaiter(_this, void 0, void 0, function () {
            var userId, user, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this.AuthModel) {
                            return [2 /*return*/, null];
                        }
                        userId = req.user.id;
                        return [4 /*yield*/, this.AuthModel.findById(userId)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                    case 2:
                        err_4 = _a.sent();
                        return [2 /*return*/, err_4.message];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // mongoose.set('debug', true);
        this.p = p;
        this.env = {
            mongoUrl: p.env.mongoUrl,
            secretKey: p.env.secretKey,
            port: p.env.port,
        },
            this.models = {};
        this.routers = {};
        this.app = (0, express_1.default)();
        this.AuthRouter = express_1.default.Router();
        this.jwt = this.initJwt;
        if (p.auth) {
            this.handleAuth();
        }
        this.gcrud = new GCRUD({ getModel: this.getModel });
        this.getRow = this.gcrud.getRow;
        this.getRows = this.gcrud.getRows;
        this.addRow = this.gcrud.addRow;
        this.editRow = this.gcrud.editRow;
        this.addOrEditRow = this.gcrud.addOrEditRow;
        this.editRows = this.gcrud.editRows;
        this.removeRow = this.gcrud.removeRow;
        this.removeRows = this.gcrud.removeRows;
        this.getUser = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.AuthModel) {
                            return [2 /*return*/, 'auth model is not set'];
                        }
                        if (!p.req) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getUserByReq(p.req)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.getRow(__assign({ model: this.AuthModel }, p))];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, res === null || typeof res === 'string' ? res : res];
                }
            });
        }); };
        this.getUsers = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.AuthModel) {
                            return [2 /*return*/, 'auth model is not set'];
                        }
                        return [4 /*yield*/, this.getRows(__assign({ model: this.AuthModel }, p))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, typeof res === 'string' ? res : res];
                }
            });
        }); };
        this.addUser = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.AuthModel) {
                            return [2 /*return*/, 'auth model is not set'];
                        }
                        return [4 /*yield*/, this.addRow({ model: this.AuthModel, newValue: p.newValue })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, typeof res === 'string' ? res : res];
                }
            });
        }); };
        this.editUser = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.AuthModel) {
                            return [2 /*return*/, 'auth model is not set'];
                        }
                        return [4 /*yield*/, this.editRow({ model: this.AuthModel, newValue: p.newValue, id: p.id })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, typeof res === 'string' ? res : res];
                }
            });
        }); };
        this.editUsers = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.AuthModel) {
                            return [2 /*return*/, 'auth model is not set'];
                        }
                        return [4 /*yield*/, this.editRows(__assign(__assign({ model: this.AuthModel }, p), { newValue: p.newValue }))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        }); };
        this.removeUser = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.AuthModel) {
                            return [2 /*return*/, 'auth model is not set'];
                        }
                        return [4 /*yield*/, this.removeRow(__assign({ model: this.AuthModel }, p))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, typeof res === 'string' ? res : res];
                }
            });
        }); };
        this.removeUsers = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.AuthModel) {
                            return [2 /*return*/, 'auth model is not set'];
                        }
                        return [4 /*yield*/, this.removeRows(__assign({ model: this.AuthModel }, p))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        }); };
    }
    return AIOExpress;
}());
exports.default = AIOExpress;
var GCRUD = /** @class */ (function () {
    function GCRUD(p) {
        var _this = this;
        this.getModelByP = function (p) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!p.model) return [3 /*break*/, 1];
                    _a = p.model;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, this.getModel(p.entityName)];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3: return [2 /*return*/, _a];
            }
        }); }); };
        this.getRow = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var model, res, res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getModelByP(p)];
                    case 1:
                        model = _a.sent();
                        if (!p.id) return [3 /*break*/, 3];
                        return [4 /*yield*/, model.findById(p.id)];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 3:
                        if (!p.search) return [3 /*break*/, 5];
                        return [4 /*yield*/, model.findOne(p.search)];
                    case 4:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 5: return [2 /*return*/, "Error in get row: please send search object or id for search"];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        return [2 /*return*/, "Error in get row: ".concat(error_1.message)];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        this.getRows = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var model, res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getModelByP(p)];
                    case 1:
                        model = _a.sent();
                        if (!(p.ids && p.ids.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, model.find({ _id: { $in: p.ids } })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        if (!p.search) return [3 /*break*/, 5];
                        return [4 /*yield*/, model.find(p.search)];
                    case 4:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 5: return [2 /*return*/, []];
                    case 6:
                        error_2 = _a.sent();
                        return [2 /*return*/, "Error in getRows: ".concat(error_2.message)];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        this.addRow = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var model, newRecord, err_5, res, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        model = void 0, newRecord = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getModelByP(p)];
                    case 2:
                        model = _a.sent();
                        newRecord = new model(p.newValue);
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        return [2 /*return*/, err_5.message];
                    case 4: return [4 /*yield*/, newRecord.save().then(function (res) { })
                            .catch(function (err) { return "Error in adding row : ".concat(err); })];
                    case 5:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 6:
                        error_3 = _a.sent();
                        return [2 /*return*/, "Error in adding row: ".concat(error_3.message)];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        this.editRow = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var model, exist, updatedRecord, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getModelByP(p)];
                    case 1:
                        model = _a.sent();
                        return [4 /*yield*/, this.getRow(p)];
                    case 2:
                        exist = _a.sent();
                        if (exist === null) {
                            return [2 /*return*/, 'Record not found'];
                        }
                        if (typeof exist === 'string') {
                            return [2 /*return*/, exist];
                        }
                        return [4 /*yield*/, model.findByIdAndUpdate(exist._id, p.newValue, { new: true })];
                    case 3:
                        updatedRecord = _a.sent();
                        if (!updatedRecord) {
                            return [2 /*return*/, 'Record not found'];
                        }
                        return [2 /*return*/, updatedRecord];
                    case 4:
                        error_4 = _a.sent();
                        throw new Error("Error updating record: ".concat(error_4.message));
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.addOrEditRow = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var model, existingRecord, updatedRecord, newRecord, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, this.getModelByP(p)];
                    case 1:
                        model = _a.sent();
                        existingRecord = void 0;
                        if (!(p.id !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, model.findById(p.id)];
                    case 2:
                        existingRecord = _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!p.search) return [3 /*break*/, 5];
                        return [4 /*yield*/, model.findOne(p.search)];
                    case 4:
                        existingRecord = _a.sent();
                        return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, 'addOrEditRow should get id our search object as parameter'];
                    case 6:
                        if (!(existingRecord !== null)) return [3 /*break*/, 8];
                        return [4 /*yield*/, model.findByIdAndUpdate(existingRecord._id, p.newValue, { new: true })];
                    case 7:
                        updatedRecord = _a.sent();
                        return [2 /*return*/, updatedRecord];
                    case 8:
                        newRecord = new model(p.newValue);
                        return [4 /*yield*/, newRecord.save()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, newRecord];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_5 = _a.sent();
                        return [2 /*return*/, "Error adding or updating record: ".concat(error_5.message)];
                    case 12: return [2 /*return*/];
                }
            });
        }); };
        this.editRows = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var model, query, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getModelByP(p)];
                    case 1:
                        model = _a.sent();
                        query = void 0;
                        if (p.ids && p.ids.length > 0) {
                            query = { _id: { $in: p.ids } };
                        }
                        else {
                            query = p.search;
                        }
                        return [4 /*yield*/, model.updateMany(query, { $set: p.newValue })];
                    case 2:
                        result = _a.sent();
                        if (result.modifiedCount === 0) {
                            return [2 /*return*/, 'No records found to update'];
                        }
                        return [2 /*return*/, result.modifiedCount]; // تعداد رکوردهای ویرایش شده
                    case 3:
                        error_6 = _a.sent();
                        throw new Error("Error updating records: ".concat(error_6.message));
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.removeRow = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var model, query, deletedRecord, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getModelByP(p)];
                    case 1:
                        model = _a.sent();
                        query = void 0;
                        if (p.id) {
                            query = { _id: p.id };
                        }
                        else if (p.search) {
                            query = p.search;
                        }
                        else {
                            return [2 /*return*/, 'No criteria provided for deletion'];
                        }
                        return [4 /*yield*/, model.findOneAndDelete(query)];
                    case 2: return [4 /*yield*/, _a.sent()];
                    case 3:
                        deletedRecord = _a.sent();
                        if (!deletedRecord) {
                            return [2 /*return*/, 'Record not found'];
                        }
                        return [2 /*return*/, deletedRecord];
                    case 4:
                        error_7 = _a.sent();
                        throw new Error("Error deleting record: ".concat(error_7.message));
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.removeRows = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var model, query, result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getModelByP(p)];
                    case 1:
                        model = _a.sent();
                        query = void 0;
                        if (p.ids && p.ids.length > 0) {
                            query = { _id: { $in: p.ids } };
                        }
                        else {
                            query = p.search;
                        }
                        return [4 /*yield*/, model.deleteMany(query)];
                    case 2:
                        result = _a.sent();
                        if (result.deletedCount === 0) {
                            return [2 /*return*/, 'No records found to delete'];
                        }
                        return [2 /*return*/, result.deletedCount];
                    case 3:
                        error_8 = _a.sent();
                        throw new Error("Error deleting records: ".concat(error_8.message));
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getModel = p.getModel;
    }
    return GCRUD;
}());
var AIODate = /** @class */ (function () {
    function AIODate() {
        var _this = this;
        this.toMiliseconds = function (p) {
            var _a = p.day, day = _a === void 0 ? 0 : _a, _b = p.hour, hour = _b === void 0 ? 0 : _b, _c = p.minute, minute = _c === void 0 ? 0 : _c, _d = p.second, second = _d === void 0 ? 0 : _d;
            var res = 0;
            res += day * 24 * 60 * 60 * 1000;
            res += hour * 60 * 60 * 1000;
            res += minute * 60 * 1000;
            res += second * 1000;
            return res;
        };
        this.isMatch = function (date, matchers) {
            date = _this.convertToArray(date);
            for (var i = 0; i < matchers.length; i++) {
                var matcher = matchers[i], type = void 0, targets = void 0;
                try {
                    var a = matcher.split(',');
                    type = a[0];
                    targets = a.slice(1, a.length);
                }
                catch (_a) {
                    return false;
                }
                if (type === '<') {
                    for (var i_1 = 0; i_1 < targets.length; i_1++) {
                        if (_this.isLess(date, targets[i_1])) {
                            return true;
                        }
                    }
                }
                else if (type === '>') {
                    for (var i_2 = 0; i_2 < targets.length; i_2++) {
                        if (_this.isGreater(date, targets[i_2])) {
                            return true;
                        }
                    }
                }
                else if (type === '<=') {
                    for (var i_3 = 0; i_3 < targets.length; i_3++) {
                        if (_this.isEqual(date, targets[i_3])) {
                            return true;
                        }
                        if (_this.isLess(date, targets[i_3])) {
                            return true;
                        }
                    }
                }
                else if (type === '>=') {
                    for (var i_4 = 0; i_4 < targets.length; i_4++) {
                        if (_this.isEqual(date, targets[i_4])) {
                            return true;
                        }
                        if (_this.isGreater(date, targets[i_4])) {
                            return true;
                        }
                    }
                }
                else if (type === '=') {
                    for (var i_5 = 0; i_5 < targets.length; i_5++) {
                        if (_this.isEqual(date, targets[i_5])) {
                            return true;
                        }
                    }
                }
                else if (type === '!=') {
                    for (var i_6 = 0; i_6 < targets.length; i_6++) {
                        if (!_this.isEqual(date, targets[i_6])) {
                            return true;
                        }
                    }
                }
                else if (type === '<>') {
                    if (targets[0] && targets[1]) {
                        var start = void 0, end = void 0;
                        if (_this.isLess(targets[0], targets[1])) {
                            start = targets[0];
                            end = targets[1];
                        }
                        else {
                            start = targets[1];
                            end = targets[0];
                        }
                        if (_this.isGreater(date, start) && _this.isLess(date, end)) {
                            return true;
                        }
                    }
                }
                else if (type === '<=>') {
                    if (targets[0] && targets[1]) {
                        var start = void 0, end = void 0;
                        if (_this.isLess(targets[0], targets[1])) {
                            start = targets[0];
                            end = targets[1];
                        }
                        else {
                            start = targets[1];
                            end = targets[0];
                        }
                        if (_this.isGreater(date, start) && _this.isLess(date, end)) {
                            return true;
                        }
                        if (_this.isEqual(date, start) || _this.isEqual(date, end)) {
                            return true;
                        }
                    }
                }
                else if (type === '!<>') {
                    if (targets[0] && targets[1]) {
                        var start = void 0, end = void 0;
                        if (_this.isLess(targets[0], targets[1])) {
                            start = targets[0];
                            end = targets[1];
                        }
                        else {
                            start = targets[1];
                            end = targets[0];
                        }
                        if (!_this.isGreater(date, start) || !_this.isLess(date, end)) {
                            return true;
                        }
                    }
                }
                else if (type === '!<=>') {
                    if (targets[0] && targets[1]) {
                        var start = void 0, end = void 0;
                        if (_this.isLess(targets[0], targets[1])) {
                            start = targets[0];
                            end = targets[1];
                        }
                        else {
                            start = targets[1];
                            end = targets[0];
                        }
                        if (!_this.isEqual(date, start) && !_this.isEqual(date, end) && (_this.isLess(date, start) || _this.isGreater(date, end))) {
                            return true;
                        }
                    }
                }
                else if (type === 'w') {
                    var w = _this.getWeekDay(date).index;
                    for (var i_7 = 0; i_7 < targets.length; i_7++) {
                        if (w === +targets[i_7]) {
                            return true;
                        }
                    }
                }
                else if (type === '!w') {
                    var w = _this.getWeekDay(date).index;
                    for (var i_8 = 0; i_8 < targets.length; i_8++) {
                        if (w !== +targets[i_8]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        this.convertToArray = function (date, jalali) {
            if (!date) {
                return [];
            }
            var list;
            if (Array.isArray(date)) {
                list = __spreadArray([], date, true);
            }
            else if (typeof date === 'string') {
                if (date.indexOf("T") !== -1) {
                    //"2015-03-25T12:00:00Z"
                    var _a = date.split("T"), d1 = _a[0], t1 = _a[1];
                    var t2 = t1.split(".")[0];
                    var t3 = t2.split(':');
                    var d2 = d1.split('-');
                    list = __spreadArray(__spreadArray(__spreadArray([], d2.map(function (o) { return +o; }), true), t3.map(function (o) { return +o; }), true), [0], false);
                }
                else {
                    list = date.split(_this.getSplitter(date)).map(function (o) { return +o; });
                }
            }
            else if (typeof date === 'number') {
                var d = new Date(date);
                var year = d.getFullYear();
                var month = d.getMonth() + 1;
                var day = d.getDate();
                var hour = d.getHours();
                var minute = d.getMinutes();
                var second = d.getSeconds();
                var miliseconds = d.getMilliseconds();
                var tenthsecond = Math.round(miliseconds / 100);
                list = [year, month, day, hour, minute, second, tenthsecond];
            }
            else if (typeof date === 'object') {
                if (typeof date.getMonth === 'function') {
                    var dateObject = date;
                    var year = dateObject.getFullYear();
                    var month = dateObject.getMonth() + 1;
                    var day = dateObject.getDate();
                    var hour = dateObject.getHours();
                    var minute = dateObject.getMinutes();
                    var second = dateObject.getSeconds();
                    var miliseconds = dateObject.getMilliseconds();
                    var tenthsecond = Math.round(miliseconds / 100);
                    list = [year, month, day, hour, minute, second, tenthsecond];
                }
                else {
                    var today = _this.getToday(jalali);
                    var dateObject = date;
                    return [
                        dateObject.year === undefined ? today[0] : dateObject.year,
                        dateObject.month === undefined ? today[1] : dateObject.month,
                        dateObject.day === undefined ? today[2] : dateObject.day,
                        dateObject.hour === undefined ? today[3] : dateObject.hour,
                        dateObject.minute === undefined ? today[4] : dateObject.minute,
                        dateObject.second === undefined ? today[5] : dateObject.second,
                    ];
                }
            }
            else {
                return [];
            }
            if (jalali) {
                var _b = _this.toJalali([list[0], list[1], list[2]]), year = _b[0], month = _b[1], day = _b[2];
                list[0] = year;
                list[1] = month;
                list[2] = day;
            }
            return list;
        };
        this.compaire = function (o1, o2) {
            o1 = _this.convertToArray(o1);
            o2 = _this.convertToArray(o2);
            var compaireKey = 'equal';
            for (var i = 0; i < o1.length; i++) {
                if (isNaN(o2[i])) {
                    o2[i] = o1[i];
                }
                var a = o1[i];
                var b = o2[i] || 0;
                if (a < b) {
                    compaireKey = 'less';
                    break;
                }
                if (a > b) {
                    compaireKey = 'greater';
                    break;
                }
            }
            return compaireKey;
        };
        this.isLess = function (o1, o2) { return _this.compaire(o1, o2) === 'less'; };
        this.isEqual = function (o1, o2) { return _this.compaire(o1, o2) === 'equal'; };
        this.isGreater = function (o1, o2) { return _this.compaire(o1, o2) === 'greater'; };
        this.isBetween = function (o1, _a) {
            var o2 = _a[0], o3 = _a[1];
            return _this.compaire(o1, o2) === 'greater' && _this.compaire(o1, o2) === 'less';
        };
        this.isToday = function (date) { return _this.isEqual(date, _this.getToday(_this.isJalali(date))); };
        this.getDateByDeltaMiliseconds = function (date, miliseconds) { return _this.convertToArray(_this.getTime(date) + miliseconds); };
        this.getWeekDay = function (date) {
            var dateArray = _this.convertToArray(date);
            var jalali = _this.isJalali(dateArray);
            dateArray = _this.toGregorian(date);
            var index = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).getDay();
            if (jalali) {
                index += 1;
                index = index % 7;
            }
            return { weekDay: _this.getWeekDays(jalali)[index], index: index };
        };
        this.isJalali = function (date) { return _this.convertToArray(date)[0] < 1700 ? true : false; };
        this.getWeekDays = function (jalali) {
            return [
                ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
                ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
            ][jalali ? 0 : 1];
        };
        this.toGregorian = function (date) {
            if (!date) {
                return [];
            }
            var arr = _this.convertToArray(date);
            var jalali = _this.isJalali(arr);
            if (!jalali) {
                return arr;
            }
            var jy = arr[0], jm = arr[1], jd = arr[2];
            var sal_a, gy, gm, gd, days;
            jy += 1595;
            days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
            gy = 400 * ~~(days / 146097);
            days %= 146097;
            if (days > 36524) {
                gy += 100 * ~~(--days / 36524);
                days %= 36524;
                if (days >= 365)
                    days++;
            }
            gy += 4 * ~~(days / 1461);
            days %= 1461;
            if (days > 365) {
                gy += ~~((days - 1) / 365);
                days = (days - 1) % 365;
            }
            gd = days + 1;
            sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++)
                gd -= sal_a[gm];
            arr[0] = gy;
            arr[1] = gm;
            arr[2] = gd;
            return arr;
        };
        this.pattern = function (date, pattern, jalali) {
            if (jalali === void 0) { jalali = _this.isJalali(date); }
            date = _this.convertToArray(date, jalali);
            var year = date[0], month = date[1], day = date[2], hour = date[3], minute = date[4], second = date[5], tenthsecond = date[6];
            pattern = pattern.replace('{year}', year.toString());
            if (typeof month === 'number') {
                pattern = pattern.replace('{month}', _this.get2Digit(month));
            }
            if (typeof day === 'number') {
                pattern = pattern.replace('{day}', _this.get2Digit(day));
            }
            if (typeof hour === 'number') {
                pattern = pattern.replace('{hour}', _this.get2Digit(hour));
            }
            if (typeof minute === 'number') {
                pattern = pattern.replace('{minute}', _this.get2Digit(minute));
            }
            if (typeof second === 'number') {
                pattern = pattern.replace('{second}', _this.get2Digit(second));
            }
            if (typeof tenthsecond === 'number') {
                pattern = pattern.replace('{tenthsecond}', _this.get2Digit(tenthsecond));
            }
            if (pattern.indexOf('{monthString}') !== -1) {
                pattern = pattern.replace('{monthString}', _this.getMonths(jalali)[month - 1]);
            }
            if (pattern.indexOf('{weekDay}') !== -1) {
                var weekDays = _this.getWeekDays(jalali);
                var index = _this.getWeekDay(date).index;
                pattern = pattern.replace('{weekDay}', weekDays[index]);
            }
            return pattern;
        };
        this.get2Digit = function (n) {
            var ns;
            try {
                ns = n.toString();
            }
            catch (_a) {
                return n.toString();
            }
            if (ns.length === 1) {
                ns = '0' + n;
            }
            return ns;
        };
        this.getMonths = function (jalali) {
            return [
                ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',],
                ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
            ][jalali ? 0 : 1];
        };
        this.toJalali = function (date) {
            var arr = _this.convertToArray(date);
            var jalali = _this.isJalali(arr);
            if (jalali) {
                return arr;
            }
            var gy = arr[0], gm = arr[1], gd = arr[2];
            var g_d_m, jy, jm, jd, gy2, days;
            g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            gy2 = (gm > 2) ? (gy + 1) : gy;
            days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
            jy = -1595 + (33 * ~~(days / 12053));
            days %= 12053;
            jy += 4 * ~~(days / 1461);
            days %= 1461;
            if (days > 365) {
                jy += ~~((days - 1) / 365);
                days = (days - 1) % 365;
            }
            if (days < 186) {
                jm = 1 + ~~(days / 31);
                jd = 1 + (days % 31);
            }
            else {
                jm = 7 + ~~((days - 186) / 30);
                jd = 1 + ((days - 186) % 30);
            }
            arr[0] = jy;
            arr[1] = jm;
            arr[2] = jd;
            return arr;
        };
        this.getSplitter = function (value) {
            var splitter = '/';
            for (var i = 0; i < value.length; i++) {
                if (isNaN(parseInt(value[i]))) {
                    return value[i];
                }
            }
            return splitter;
        };
        this.getTime = function (date, jalali) {
            if (jalali === void 0) { jalali = _this.isJalali(date); }
            if (!date) {
                return 0;
            }
            if (typeof date === 'number') {
                return date;
            }
            date = _this.convertToArray(date);
            var year = date[0], _a = date[1], month = _a === void 0 ? 1 : _a, _b = date[2], day = _b === void 0 ? 1 : _b, _c = date[3], hour = _c === void 0 ? 0 : _c, _d = date[4], minute = _d === void 0 ? 0 : _d, _e = date[5], second = _e === void 0 ? 0 : _e, _f = date[6], tenthsecond = _f === void 0 ? 0 : _f;
            if (jalali) {
                date = _this.toGregorian([year, month, day, hour, minute, second, tenthsecond]);
            }
            var time = new Date(date[0], date[1] - 1, date[2]).getTime();
            time += hour * 60 * 60 * 1000;
            time += minute * 60 * 1000;
            time += second * 1000;
            time += tenthsecond * 100;
            return time;
        };
        this.getNextTime = function (date, offset, jalali) {
            if (jalali === void 0) { jalali = _this.isJalali(date); }
            if (!offset) {
                return _this.convertToArray(date);
            }
            var time = _this.getTime(date, jalali);
            time += offset;
            var dateArray = _this.convertToArray(time);
            if (jalali) {
                var _a = _this.toJalali(dateArray), jy = _a[0], jm = _a[1], jd = _a[2];
                dateArray[0] = jy;
                dateArray[1] = jm;
                dateArray[2] = jd;
            }
            return dateArray;
        };
        this.getMonthDaysLength = function (date) {
            if (!date) {
                return 0;
            }
            var _a = _this.convertToArray(date), year = _a[0], month = _a[1];
            var jalali = _this.isJalali([year, month]);
            if (jalali) {
                return [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, [1, 5, 9, 13, 17, 22, 26, 30].indexOf(year % 33) === -1 ? 29 : 30][month - 1];
            }
            else {
                return new Date(year, month - 1, 0).getDate();
            }
        };
        this.getYearDaysLength = function (date) {
            if (!date) {
                return 0;
            }
            var year = _this.convertToArray(date)[0], res = 0;
            for (var i = 1; i <= 12; i++) {
                res += _this.getMonthDaysLength([year, i]);
            }
            return res;
        };
        this.getYesterday = function (date) {
            var _a = _this.convertToArray(date), year = _a[0], month = _a[1], day = _a[2];
            var newYear = year, newMonth = month, newDay = day;
            if (day === 1) {
                if (month === 1) {
                    newYear = newYear - 1;
                    newMonth = 12;
                    newDay = _this.getMonthDaysLength([newYear, newMonth]);
                }
                else {
                    newMonth = newMonth - 1;
                    newDay = _this.getMonthDaysLength([newYear, newMonth]);
                }
            }
            else {
                newDay = newDay - 1;
            }
            return [newYear, newMonth, newDay];
        };
        this.getTomarrow = function (date) {
            var _a = _this.convertToArray(date), year = _a[0], month = _a[1], day = _a[2];
            var newYear = year, newMonth = month, newDay = day;
            var daysLength = _this.getMonthDaysLength(date);
            if (day === daysLength) {
                if (month === 12) {
                    newYear = newYear + 1;
                    newMonth = 1;
                    newDay = 1;
                }
                else {
                    newMonth = newMonth + 1;
                    newDay = 1;
                }
            }
            else {
                newDay = newDay + 1;
            }
            return [newYear, newMonth, newDay];
        };
        this.getDaysOfWeek = function (date, pattern) {
            if (!date) {
                return [];
            }
            var dateArray = _this.convertToArray(date);
            var index = _this.getWeekDay(dateArray).index;
            var firstDay = __spreadArray([], dateArray, true);
            for (var i = 0; i < index; i++) {
                firstDay = _this.getYesterday(firstDay);
            }
            var res = [];
            for (var i = 0; i < 7; i++) {
                res.push(firstDay);
                firstDay = _this.getTomarrow(firstDay);
            }
            if (pattern) {
                return res.map(function (o) { return _this.getDateByPattern(o, pattern); });
            }
            return res;
        };
        this.getDatesBetween = function (date, otherDate, step) {
            if (step === void 0) { step = 24 * 60 * 60 * 1000; }
            if (!date || !otherDate) {
                return [];
            }
            date = _this.convertToArray(date);
            otherDate = _this.convertToArray(otherDate);
            if (!_this.isGreater(otherDate, date)) {
                return [];
            }
            var delta = _this.getDelta(date, otherDate);
            var length = delta.miliseconds / step;
            if (isNaN(length) || length > 1000) {
                console.error('AIODate().getDatesBetween() => too many dates');
                return [];
            }
            var nextDate = _this.getNextTime(date, step);
            var res = [];
            while (_this.isLess(nextDate, otherDate)) {
                res.push(nextDate);
                nextDate = _this.getNextTime(nextDate, step);
            }
            return res;
        };
        this.getDelta = function (date, otherDate, unit) {
            var dif = _this.getTime(date) - _this.getTime(otherDate || _this.getToday());
            return _this.convertMiliseconds(-dif, unit);
        };
        this.convertMiliseconds = function (miliseconds, unit) {
            if (miliseconds === void 0) { miliseconds = 0; }
            if (unit === void 0) { unit = 'day'; }
            var type;
            if (miliseconds < 0) {
                type = 'passed';
                miliseconds = -miliseconds;
            }
            else if (miliseconds > 0) {
                type = 'remaining';
            }
            else {
                type = 'now';
            }
            var index = ['day', 'hour', 'minute', 'second', 'tenthsecond', 'milisecond'].indexOf(unit);
            var day = 0, hour = 0, minute = 0, second = 0, tenthsecond = 0;
            var dif = miliseconds;
            if (index <= 0) {
                day = Math.floor(dif / (24 * 60 * 60 * 1000));
                dif -= day * (24 * 60 * 60 * 1000);
            }
            if (index <= 1) {
                hour = Math.floor(dif / (60 * 60 * 1000));
                dif -= hour * (60 * 60 * 1000);
            }
            if (index <= 2) {
                minute = Math.floor(dif / (60 * 1000));
                dif -= minute * (60 * 1000);
            }
            if (index <= 3) {
                second = Math.floor(dif / (1000));
                dif -= second * (1000);
            }
            if (index <= 4) {
                tenthsecond = Math.floor(dif / (100));
            }
            return { day: day, hour: hour, minute: minute, second: second, tenthsecond: tenthsecond, miliseconds: miliseconds, type: type };
        };
        this.getDaysOfMonth = function (date, pattern) {
            if (!date) {
                return [];
            }
            var dateArray = _this.convertToArray(date);
            var daysLength = _this.getMonthDaysLength(date);
            var firstDay = [dateArray[0], dateArray[1], 1];
            var res = [];
            for (var i = 0; i < daysLength; i++) {
                res.push(firstDay);
                firstDay = _this.getTomarrow(firstDay);
            }
            if (pattern) {
                return res.map(function (o) { return _this.getDateByPattern(o, pattern); });
            }
            return res;
        };
        this.getLastDayOfMonth = function (date) {
            var dateArray = _this.convertToArray(date);
            var length = _this.getMonthDaysLength(dateArray);
            var lastDay = [dateArray[0], dateArray[1], length];
            return lastDay;
        };
        this.getDateByPattern = function (date, pattern) { return _this.pattern(date, pattern); };
        this.getToday = function (jalali) {
            var date = new Date();
            var dateArray = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), Math.round(date.getMilliseconds() / 100)];
            if (jalali) {
                dateArray = _this.toJalali(dateArray);
            }
            return dateArray;
        };
        this.getDayIndex = function (date, unit) {
            date = _this.convertToArray(date);
            if (unit === 'week') {
                var days = _this.getDaysOfWeek(date);
                for (var i = 0; i < days.length; i++) {
                    var _a = days[i], year = _a[0], month = _a[1], day = _a[2];
                    if (year !== date[0] || month !== date[1] || day !== date[2]) {
                        continue;
                    }
                    return i;
                }
            }
            if (unit === 'month') {
                return date[2] - 1;
            }
            if (unit === 'year') {
                var res = 0;
                for (var i = 0; i < date[1] - 1; i++) {
                    res += _this.getMonthDaysLength(date);
                }
                res += date[1];
                return res - 1;
            }
            return 0;
        };
    }
    return AIODate;
}());
exports.AIODate = AIODate;
function SplitNumber(price, count, splitter) {
    if (!price) {
        return '';
    }
    count = count || 3;
    splitter = splitter || ',';
    var str = price.toString();
    var dotIndex = str.indexOf('.');
    if (dotIndex !== -1) {
        str = str.slice(0, dotIndex);
    }
    var res = '';
    var index = 0;
    for (var i = str.length - 1; i >= 0; i--) {
        res = str[i] + res;
        if (index === count - 1) {
            index = 0;
            if (i > 0) {
                res = splitter + res;
            }
        }
        else {
            index++;
        }
    }
    return res;
}
exports.SplitNumber = SplitNumber;
function toRadians(degree) {
    return degree * (Math.PI / 180);
}
function CalculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the Earth in kilometers
    var dLat = toRadians(lat2 - lat1);
    var dLon = toRadians(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;
    return distance;
}
exports.CalculateDistance = CalculateDistance;
function GetArray(count, fn) {
    fn = fn || (function (index) { return index; });
    return new Array(count).fill(0).map(function (o, i) { if (fn)
        return fn(i); });
}
exports.GetArray = GetArray;
function GetRandomNumber(from, to) { return from + Math.round(Math.random() * (to - from)); }
exports.GetRandomNumber = GetRandomNumber;
