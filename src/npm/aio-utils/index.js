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
exports.svgArc = exports.Geo = exports.AIODate = exports.Swip = exports.JsonValidator = exports.getEventAttrs = exports.CalculateDistance = exports.GenerateComponsition = exports.Search = exports.Paste = exports.IsTouch = exports.Copy = exports.JSXToHTML = exports.URLToJSON = exports.getValueByStep = exports.EventHandler = exports.SplitNumber = exports.ExportToExcel = exports.GetClient = exports.HandleBackButton = exports.FileToBase64 = exports.stall = exports.DownloadUrl = void 0;
var ReactDOMServer = require("react-dom/server");
var jquery_1 = require("jquery");
function DownloadUrl(url, name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            fetch(url, {
                mode: 'no-cors',
            })
                .then(function (resp) { return resp.blob(); })
                .then(function (blob) {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
                .catch(function () { return alert('oh no!'); });
            return [2 /*return*/];
        });
    });
}
exports.DownloadUrl = DownloadUrl;
function stall() {
    return __awaiter(this, arguments, void 0, function (stallTime) {
        if (stallTime === void 0) { stallTime = 3000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, stallTime); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.stall = stall;
function FileToBase64(file, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function () { return callback(fileReader.result); };
    fileReader.readAsDataURL(file);
}
exports.FileToBase64 = FileToBase64;
function HandleBackButton(callback) {
    if (callback === void 0) { callback = function () { }; }
    window.history.pushState({}, '');
    window.history.pushState({}, '');
    window.onpopstate = function (event) {
        window.history.pushState({}, '');
        callback();
    };
}
exports.HandleBackButton = HandleBackButton;
function GetClient(e) { return 'ontouchstart' in document.documentElement && e.changedTouches ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY }; }
exports.GetClient = GetClient;
function ExportToExcel(rows, config) {
    if (config === void 0) { config = {}; }
    var _a = config.promptText, promptText = _a === void 0 ? 'Inter Excel File Name' : _a;
    var o = {
        fixPersianAndArabicNumbers: function (str) {
            if (typeof str !== 'string') {
                return str;
            }
            var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g], arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
            for (var i = 0; i < 10; i++) {
                str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
            return str;
        },
        getJSON: function (rows) {
            var result = [];
            for (var i = 0; i < rows.length; i++) {
                var json = rows[i], fixedJson = {};
                for (var prop in json) {
                    fixedJson[prop] = this.fixPersianAndArabicNumbers(json[prop]);
                }
                result.push(fixedJson);
            }
            return result;
        },
        export: function () {
            var name = window.prompt(promptText);
            if (!name || name === null || !name.length)
                return;
            var data = this.getJSON(rows);
            var arrData = typeof data != "object" ? JSON.parse(data) : data;
            var CSV = "";
            // CSV += 'title';
            CSV += '\r\n\n';
            if (true) {
                var row = "";
                for (var index in arrData[0]) {
                    row += index + ",";
                }
                row = row.slice(0, -1);
                CSV += row + "\r\n";
            }
            for (var i = 0; i < arrData.length; i++) {
                var row = "";
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }
                row.slice(0, row.length - 1);
                CSV += row + "\r\n";
            }
            if (CSV === "") {
                alert("Invalid data");
                return;
            }
            var fileName = name.replace(/ /g, "_");
            var universalBOM = "\uFEFF";
            var uri = "data:text/csv;charset=utf-8," + encodeURIComponent(universalBOM + CSV);
            var link = document.createElement("a");
            link.href = uri;
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    return o.export();
}
exports.ExportToExcel = ExportToExcel;
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
function EventHandler(selector, event, action, type) {
    if (type === void 0) { type = 'bind'; }
    var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" };
    var touch = 'ontouchstart' in document.documentElement;
    event = touch ? me[event] : event;
    var element = typeof selector === "string" ? (selector === "window" ? (0, jquery_1.default)(window) : (0, jquery_1.default)(selector)) : selector;
    element.unbind(event, action);
    if (type === 'bind') {
        element.bind(event, action);
    }
}
exports.EventHandler = EventHandler;
function getValueByStep(_a) {
    var value = _a.value, start = _a.start, step = _a.step, end = _a.end;
    var res = Math.round((value - start) / step) * step + start;
    if (res < start) {
        res = start;
    }
    if (res > end) {
        res = end;
    }
    return res;
}
exports.getValueByStep = getValueByStep;
function URLToJSON(url) {
    try {
        return JSON.parse("{\"".concat(decodeURI(url.split('?')[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"'), "\"}"));
    }
    catch (_a) {
        return {};
    }
}
exports.URLToJSON = URLToJSON;
function JSXToHTML(jsx) {
    return ReactDOMServer.renderToStaticMarkup(jsx);
}
exports.JSXToHTML = JSXToHTML;
function Copy(text) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            window.navigator.clipboard.writeText(text);
            return [2 /*return*/];
        });
    });
}
exports.Copy = Copy;
function IsTouch() {
    return "ontouchstart" in document.documentElement;
}
exports.IsTouch = IsTouch;
function Paste() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                return [2 /*return*/, window.navigator.clipboard.read()];
            }
            catch (err) {
                console.log(err.message);
            }
            return [2 /*return*/];
        });
    });
}
exports.Paste = Paste;
function Search(items, searchValue, getValue) {
    if (getValue === void 0) { getValue = function (o) { return o; }; }
    if (!searchValue) {
        return items;
    }
    function isMatch(keys, value) {
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (value.indexOf(key) === -1) {
                return false;
            }
        }
        return true;
    }
    var keys = searchValue.split(' ');
    return items.filter(function (o, i) { return isMatch(keys, getValue(o, i)); });
}
exports.Search = Search;
function GenerateComponsition(_a) {
    var _b = _a.level, maxLevel = _b === void 0 ? 4 : _b, _c = _a.length, length = _c === void 0 ? 4 : _c, _d = _a.childsField, childsField = _d === void 0 ? 'childs' : _d, _e = _a.fields, fields = _e === void 0 ? {} : _e;
    var $$ = {
        generate: function (level, index) {
            var _a;
            if (level === void 0) { level = 0; }
            if (index === void 0) { index = ''; }
            if (level >= maxLevel) {
                return [];
            }
            var res = [];
            for (var i = 0; i < length; i++) {
                var newIndex = index + '-' + i;
                var newItem = (_a = {
                        id: 'aa' + Math.round(Math.random() * 10000)
                    },
                    _a[childsField] = $$.generate(level + 1, newIndex),
                    _a);
                for (var prop in fields) {
                    newItem[prop] = fields[prop] + index;
                }
                res.push(newItem);
            }
            return res;
        }
    };
    return $$.generate();
}
exports.GenerateComponsition = GenerateComponsition;
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
function getEventAttrs(eventType, callback) {
    var _a;
    var touch = IsTouch();
    var fixedEvent;
    if (touch) {
        fixedEvent = { 'onMouseDown': 'onTouchStart', 'onMouseMove': 'onTouchMove', 'onMouseUp': 'onTouchEnd' }[eventType];
    }
    else {
        fixedEvent = eventType;
    }
    return _a = {}, _a[fixedEvent] = callback, _a;
}
exports.getEventAttrs = getEventAttrs;
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
function JsonValidator(json, schema) {
    var $$ = {
        getType: function (v) {
            if (['string', 'number', 'boolean', 'array', 'object', 'null', 'undefined'].indexOf(v) !== -1) {
                return v;
            }
            if (Array.isArray(v)) {
                return 'array';
            }
            return typeof v;
        },
        getSchemaTypes: function (s) {
            if (typeof s === 'string' && s.indexOf('|') !== -1) {
                return s.split('|');
            }
            return [s];
        },
        compaire: function (data, schema, propName) {
            var schemaTypes = this.getSchemaTypes(schema);
            var type = this.getType(data);
            var isMatch = false;
            for (var i = 0; i < schemaTypes.length; i++) {
                var st = schemaTypes[i];
                if (['string', 'number', 'boolean', 'array', 'object', 'null', 'undefined'].indexOf(st) !== -1) {
                    if (type === st) {
                        isMatch = true;
                    }
                }
                else if (typeof st === 'object') {
                    if (type === this.getType(st)) {
                        isMatch = true;
                    }
                }
                else {
                    if (data === st) {
                        isMatch = true;
                    }
                }
            }
            if (!isMatch) {
                return "".concat(propName, " must be ").concat(schemaTypes.join(' or '));
            }
        },
        validate: function (data, schema, propName) {
            if (propName === void 0) { propName = 'data'; }
            var compaireResult = this.compaire(data, schema, propName);
            if (compaireResult) {
                return compaireResult;
            }
            if (typeof schema === 'object') {
                if (Array.isArray(data)) {
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        var s = schema[i] || schema[0];
                        var res = this.validate(d, s, "".concat(propName, "[").concat(i, "]"));
                        if (res) {
                            return res;
                        }
                    }
                }
                else {
                    for (var prop in data) {
                        var d = data[prop];
                        var s = schema[prop];
                        var res = this.validate(d, s, "".concat(propName, ".").concat(prop));
                        if (res) {
                            return res;
                        }
                    }
                    for (var prop in schema) {
                        var d = data[prop];
                        var s = schema[prop];
                        var res = this.validate(d, s, "".concat(propName, ".").concat(prop));
                        if (res) {
                            return res;
                        }
                    }
                }
            }
        }
    };
    return $$.validate(json, schema);
}
exports.JsonValidator = JsonValidator;
var Swip = /** @class */ (function () {
    function Swip(p) {
        var _this = this;
        this.p = p;
        this.geo = new Geo();
        this.timeout = undefined;
        this.count = 0;
        this.getDom = function () { return p.dom(); };
        this.getParent = function () { return p.parent(); };
        this.dx = 0;
        this.dy = 0;
        this.cx = 0;
        this.cy = 0;
        this.dist = 0;
        this.isMoving = false;
        this.centerAngle = 0;
        this.init = function () {
            _this.count++;
            if (_this.count > 10) {
                clearTimeout(_this.timeout);
                return;
            }
            var res = _this.getDom();
            if (!res.length) {
                _this.timeout = setTimeout(function () { return _this.init(); }, 400);
            }
            else {
                clearTimeout(_this.timeout);
                EventHandler(_this.getDom(), 'mousedown', jquery_1.default.proxy(_this.mouseDown, _this));
                if (p.onClick) {
                    EventHandler(_this.getDom(), 'click', jquery_1.default.proxy(_this.click, _this));
                }
            }
        };
        this.getPercentByValue = function (value, start, end) { return 100 * (value - start) / (end - start); };
        this.getPage = function () {
            var page = _this.p.page;
            return page ? page() : (0, jquery_1.default)(window);
        };
        this.getMousePosition = function (e) {
            _this.domLimit = _this.getDOMLimit('dom');
            var page = _this.getPage();
            var st = page.scrollTop();
            var sl = page.scrollLeft();
            var client = GetClient(e), x = client.x - _this.domLimit.left + sl, y = client.y - _this.domLimit.top + st;
            var xp = _this.getPercentByValue(x, 0, _this.domLimit.width), yp = _this.getPercentByValue(y, 0, _this.domLimit.height);
            var centerAngle = _this.geo.getAngle([
                [_this.domLimit.centerX, _this.domLimit.centerY],
                [client.x, client.y]
            ]);
            var res = { xp: xp, yp: yp, clientX: client.x, clientY: client.y, x: x, y: y, centerAngle: centerAngle };
            return res;
        };
        this.getDOMLimit = function (type) {
            var dom = type === 'dom' ? _this.getDom() : _this.getParent();
            var offset = dom.offset();
            var DOM = {
                width: dom.width(),
                height: dom.height(),
                left: offset.left,
                top: offset.top,
                centerX: 0,
                centerY: 0
            };
            return __assign(__assign({}, DOM), { centerX: DOM.left + DOM.width / 2, centerY: DOM.top + DOM.height / 2, right: DOM.left + DOM.width, bottom: DOM.top + DOM.height });
        };
        this.click = function (e) {
            //jeloye click bad az drag ro bayad begirim choon click call mishe 
            if (_this.isMoving) {
                console.log('prevent click after move');
                return;
            }
            _this.domLimit = _this.getDOMLimit('dom');
            _this.parentLimit = p.parent ? _this.getDOMLimit('parent') : undefined;
            var mousePosition = _this.getMousePosition(e);
            var clickParams = { mousePosition: mousePosition, domLimit: _this.domLimit, parentLimit: _this.parentLimit, event: e };
            p.onClick(clickParams);
        };
        this.mouseDown = function (e) {
            _this.isMoving = false;
            _this.domLimit = _this.getDOMLimit('dom');
            _this.parentLimit = p.parent ? _this.getDOMLimit('parent') : undefined;
            var mousePosition = _this.getMousePosition(e);
            _this.centerAngle = mousePosition.centerAngle;
            _this.cx = mousePosition.clientX;
            _this.cy = mousePosition.clientY;
            _this.so = {
                client: { x: mousePosition.clientX, y: mousePosition.clientY }
            };
            var startParams = { mousePosition: mousePosition, domLimit: _this.domLimit, parentLimit: _this.parentLimit, event: e };
            var res = (p.start || (function () { return [0, 0]; }))(startParams);
            if (!Array.isArray(res)) {
                return;
            }
            var x = res[0], y = res[1];
            _this.so = __assign(__assign({}, _this.so), { x: x, y: y });
            EventHandler('window', 'mousemove', jquery_1.default.proxy(_this.mouseMove, _this));
            EventHandler('window', 'mouseup', jquery_1.default.proxy(_this.mouseUp, _this));
        };
        this.mouseMove = function (e) {
            var _a = _this.p, _b = _a.speedX, speedX = _b === void 0 ? 1 : _b, _c = _a.speedY, speedY = _c === void 0 ? 1 : _c, _d = _a.stepX, stepX = _d === void 0 ? 1 : _d, _e = _a.stepY, stepY = _e === void 0 ? 1 : _e, reverseX = _a.reverseX, reverseY = _a.reverseY, insideX = _a.insideX, insideY = _a.insideY;
            var mousePosition = _this.getMousePosition(e), client = GetClient(e);
            var dx = client.x - _this.cx, dy = client.y - _this.cy;
            dx = Math.round(dx * speedX) * (reverseX ? -1 : 1);
            dy = Math.round(dy * speedY) * (reverseY ? -1 : 1);
            var deltaCenterAngle = mousePosition.centerAngle - _this.centerAngle;
            //if(deltaCenterAngle < 0){deltaCenterAngle += 360}
            if (typeof stepX === 'number') {
                dx = Math.round(dx / stepX) * stepX;
            }
            if (typeof stepY === 'number') {
                dy = Math.round(dy / stepY) * stepY;
            }
            if (dx === _this.dx && dy === _this.dy) {
                return;
            }
            _this.isMoving = true;
            _this.dx = dx;
            _this.dy = dy;
            _this.dist = Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
            var angle = _this.geo.getAngle([[_this.cx, _this.cy], [client.x, client.y]]);
            var x, y;
            if (_this.so.x !== undefined && _this.so.y !== undefined) {
                x = _this.so.x + dx;
                y = _this.so.y + dy;
                var _f = _this.p, minX = _f.minX, minY = _f.minY, maxX = _f.maxX, maxY = _f.maxY;
                if (minX !== undefined && x < minX) {
                    x = minX;
                }
                if (maxX !== undefined && x > maxX) {
                    x = maxX;
                }
                if (minY !== undefined && y < minY) {
                    y = minY;
                }
                if (maxY !== undefined && y > maxY) {
                    y = maxY;
                }
            }
            if (stepX === true) {
                x = Math.round(x / _this.domLimit.width) * _this.domLimit.width;
            }
            if (stepY === true) {
                y = Math.round(y / _this.domLimit.height) * _this.domLimit.height;
            }
            if (insideX) {
                if (_this.parentLimit) {
                    if (x > _this.parentLimit.width - _this.domLimit.width) {
                        x = _this.parentLimit.width - _this.domLimit.width;
                    }
                    if (x < 0) {
                        x = 0;
                    }
                }
                else {
                    alert('Swip error => you set insideX prop but missing parent props');
                }
            }
            if (insideY) {
                if (_this.parentLimit) {
                    if (y > _this.parentLimit.height - _this.domLimit.height) {
                        y = _this.parentLimit.height - _this.domLimit.height;
                    }
                    if (y < 0) {
                        y = 0;
                    }
                }
                else {
                    alert('Swip error => you set insideY prop but missing parent props');
                }
            }
            _this.change = { x: x, y: y, dx: dx, dy: dy, dist: _this.dist, angle: angle, deltaCenterAngle: deltaCenterAngle };
            var p = {
                change: _this.change,
                mousePosition: mousePosition,
                domLimit: _this.domLimit,
                parentLimit: _this.parentLimit,
                event: e
            };
            if (_this.p.move) {
                _this.p.move(p);
            }
        };
        this.mouseUp = function (e) {
            EventHandler('window', 'mousemove', _this.mouseMove, 'unbind');
            EventHandler('window', 'mouseup', _this.mouseUp, 'unbind');
            //chon click bad az mouseUp call mishe mouseUp isMoving ro zoodtar false mikone (pas nemitoone jeloye click bad az harekat ro begire), pas bayad in amal ba yek vaghfe anjam beshe
            //jeloye clicke bad az harekat ro migirim ta bad az drag kardan function click call nashe
            setTimeout(function () { return _this.isMoving = false; }, 10);
            var mousePosition = _this.getMousePosition(e);
            var p = {
                change: _this.change,
                event: e,
                domLimit: _this.domLimit,
                parentLimit: _this.parentLimit,
                mousePosition: mousePosition,
            };
            if (_this.p.end) {
                _this.p.end(p);
            }
        };
        this.init();
    }
    return Swip;
}());
exports.Swip = Swip;
var AIODate = /** @class */ (function () {
    function AIODate() {
        var _this = this;
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
                if (typeof date.year === 'number') {
                    var dateObject = date;
                    return [dateObject.year, dateObject.month, dateObject.day, dateObject.hour];
                }
                else {
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
            }
            else {
                return false;
            }
            if (jalali) {
                var _b = _this.toJalali([list[0], list[1], list[2]]), year = _b[0], month = _b[1], day = _b[2];
                list[0] = year;
                list[1] = month;
                list[2] = day;
            }
            return list;
        };
        this.isAny = function (o1, o2, key) {
            if (!o1 || !o2) {
                return false;
            }
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
                }
                if (a > b) {
                    compaireKey = 'greater';
                }
            }
            return compaireKey === key;
        };
        this.isLess = function (o1, o2) { return _this.isAny(o1, o2, 'less'); };
        this.isEqual = function (o1, o2) { return _this.isAny(o1, o2, 'equal'); };
        this.isGreater = function (o1, o2) { return _this.isAny(o1, o2, 'greater'); };
        this.isBetween = function (o1, _a) {
            var o2 = _a[0], o3 = _a[1];
            return _this.isAny(o1, o2, 'greater') && _this.isAny(o1, o3, 'less');
        };
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
                return n;
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
                return;
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
            var year = _this.convertToArray(date)[0];
            var res = 0;
            for (var i = 1; i <= 12; i++) {
                res += _this.getMonthDaysLength([year, i]);
            }
            return res;
        };
        this.getDaysOfWeek = function (date, pattern) {
            if (!date) {
                return [];
            }
            var dateArray = _this.convertToArray(date);
            var index = _this.getWeekDay(dateArray).index;
            var startDate = _this.getNextTime([dateArray[0], dateArray[1], dateArray[2]], -(index + 1) * 24 * 60 * 60 * 1000);
            var endDate = _this.getNextTime([dateArray[0], dateArray[1], dateArray[2]], (7 - index) * 24 * 60 * 60 * 1000);
            return _this.getDatesBetween(startDate, endDate, 24 * 60 * 60 * 1000);
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
                return;
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
            var dif = _this.getTime(date) - _this.getTime(otherDate);
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
            var dateArray = _this.convertToArray(date);
            var firstDay = [dateArray[0], dateArray[1], 1];
            var lastDay = _this.getLastDayOfMonth(dateArray);
            var betweenDayes = _this.getDatesBetween(firstDay, lastDay, 24 * 60 * 60 * 1000);
            var result = [firstDay];
            result = result.concat(betweenDayes);
            result.push(lastDay);
            if (pattern) {
                return result.map(function (o) { return _this.getDateByPattern(o, pattern); });
            }
            return result;
        };
        this.getLastDayOfMonth = function (date) {
            var dateArray = _this.convertToArray(date);
            var length = _this.getMonthDaysLength(dateArray);
            var lastDay = [date[0], date[1], length];
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
                    if (year !== date[0]) {
                        continue;
                    }
                    if (month !== date[1]) {
                        continue;
                    }
                    if (day !== date[2]) {
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
        };
    }
    return AIODate;
}());
exports.AIODate = AIODate;
var Geo = /** @class */ (function () {
    function Geo() {
        var _this = this;
        this.getAngle = function (l) {
            var line = _this.getLineType(l) === 'DLine' ? _this.getLineByDLine(l) : l;
            var p1 = line[0], p2 = line[1];
            var deltaX = p2[0] - p1[0];
            var deltaY = p2[1] - p1[1];
            var length = _this.getLength([[0, 0], [deltaX, deltaY]]);
            var angle = Math.acos(deltaX / length) / Math.PI * 180;
            angle = Math.sign(deltaY) < 0 ? 360 - angle : angle;
            return parseFloat(angle.toFixed(4));
        };
        this.getLineType = function (line) { return Array.isArray(line[0]) ? 'Line' : 'DLine'; };
        this.getLine = function (l) { return _this.getLineType(l) === 'Line' ? l : _this.getLineByDLine(l); };
        this.getDLine = function (l) { return _this.getLineType(l) === 'DLine' ? l : _this.getDLineByLine(l); };
        this.getDipAngle = function (dip) { return _this.getAngle([0, 0, dip]); };
        this.getLength = function (line) { return Math.sqrt(Math.pow(line[0][0] - line[1][0], 2) + Math.pow(line[0][1] - line[1][1], 2)); };
        this.getPrepDip = function (dip) { return -1 / dip; };
        this.getDip = function (l) {
            var line = _this.getLine(l);
            return line[0][1] - line[1][1] / line[0][0] - line[1][0];
        };
        this.getLineByDLine = function (dline) {
            var x = dline[0], y = dline[1];
            var X = _this.getXOnLineByY(dline, y + 10);
            var Y = _this.getYOnLineByX(dline, X);
            return [[x, y], [X, Y]];
        };
        this.getPrepFromLine = function (l, point, offset) {
            if (!offset) {
                return point;
            }
            var dline = _this.getDLine(l);
            var angle = _this.getAngle(dline);
            return _this.getLineBySLA(point, offset, angle - 90)[1];
        };
        this.getPrepToLine = function (l, point) {
            var dline = _this.getDLine(l);
            var prepLine = [point[0], point[1], _this.getPrepDip(dline[2])];
            return _this.getMeet(dline, prepLine);
        };
        this.getLineBySLA = function (p1, length, angle) {
            if (!length) {
                return [p1, p1];
            }
            return [p1, [p1[0] + (_this.tri('cos', angle) * length), p1[1] + (_this.tri('sin', angle) * length)]];
        };
        this.getArcByPoints = function (arcPoints, height) {
            var points = [];
            var stringPoints = [];
            for (var i = 0; i < arcPoints.length; i++) {
                if (i === 3) {
                    break;
                }
                var point = arcPoints[i];
                var stringPoint = point.toString();
                if (stringPoints.indexOf(stringPoint) !== -1) {
                    continue;
                }
                stringPoints.push(stringPoint);
                points.push(point);
            }
            var p1 = points[0], p2 = points[1], p3 = points[2];
            var changeObject = { x: 0, y: 0, r: 0 };
            if (points.length === 1) {
                changeObject = { r: 0, x: p1[0], y: p1[1] };
            }
            else if (points.length === 2) {
                var avg = _this.getAvg([p1, p2]);
                var dline = _this.getDLineByLine([p1, p2]);
                var pm = _this.getPrepFromLine(dline, avg, height);
                if (height) {
                    changeObject = _this.getArcBy3Points(p1, pm, p2);
                }
                else {
                    changeObject = { r: _this.getLength([p1, p2]) / 2, x: avg[0], y: avg[1] };
                }
            }
            else {
                changeObject = _this.getArcBy3Points(p1, p2, p3);
            }
            return changeObject;
        };
        this.getAvg = function (arr) {
            var x = 0, y = 0, length = arr.length;
            for (var i = 0; i < length; i++) {
                x += arr[i][0];
                y += arr[i][1];
            }
            return [x / length, y / length];
        };
        this.getArcBy3Points = function (p1, p2, p3) {
            var dip1 = _this.getPrepDip(_this.getDip([p1, p2]));
            var dip2 = _this.getPrepDip(_this.getDip([p2, p3]));
            var point1 = _this.getAvg([p1, p2]);
            var point2 = _this.getAvg([p2, p3]);
            var dline1 = [point1[0], point1[1], dip1];
            var dline2 = [point2[0], point2[1], dip2];
            var meet = _this.getMeet(dline1, dline2);
            if (!meet) {
                return { x: 0, y: 0, r: 0 };
            }
            var x = meet[0], y = meet[1];
            var a1 = _this.getAngle([meet, p1]), a2 = _this.getAngle([meet, p2]), a3 = _this.getAngle([meet, p3]);
            var slice;
            if (a1 < a2 && a2 < a3) {
                slice = [a1, a3];
            }
            else if (a2 < a3 && a3 < a1) {
                slice = [a1, a3];
            }
            else if (a3 < a1 && a1 < a2) {
                slice = [a1, a3];
            }
            else if (a3 < a2 && a2 < a1) {
                slice = [a3, a1];
            }
            else if (a1 < a3 && a3 < a2) {
                slice = [a3, a1];
            }
            else if (a2 < a1 && a1 < a3) {
                slice = [a3, a1];
            }
            else {
                slice = [0, 0];
            }
            var arc = { x: x, y: y, r: _this.getLength([p1, [x, y]]), slice: slice };
            return arc;
        };
        this.getDLineByLine = function (line) {
            var p1 = line[0];
            return [p1[0], p1[1], _this.getDip(line)];
        };
        this.getMeet = function (l1, l2) {
            var dline1 = _this.getDLine(l1);
            var dline2 = _this.getDLine(l2);
            var p1x = dline1[0], p1y = dline1[1], dip1 = dline1[2];
            var p2x = dline2[0], p2y = dline2[1], dip2 = dline2[2];
            if (dip1 === dip2) {
                return false;
            }
            if (Math.abs(dip1) === Infinity) {
                return [p1x, _this.getYOnLineByX(dline2, p1x)];
            }
            if (Math.abs(dip2) === Infinity) {
                return [p2x, _this.getYOnLineByX(dline1, p2x)];
            }
            var x = ((dip1 * p1x) - (dip2 * p2x) + p2y - p1y) / (dip1 - dip2);
            var y = dip1 * (x - p1x) + p1y;
            return [x, y];
        };
        this.getInnerMeet = function (line1, line2) {
            var meet = _this.getMeet(line1, line2);
            if (meet === false) {
                return false;
            }
            if (line2[0][0] < line2[1][0]) {
                if (meet[0] < line2[0][0] || meet[0] > line2[1][0]) {
                    return false;
                }
            }
            else {
                if (meet[0] < line2[1][0] || meet[0] > line2[0][0]) {
                    return false;
                }
            }
            if (line2[0][1] < line2[1][1]) {
                if (meet[1] < line2[0][1] || meet[1] > line2[1][1]) {
                    return false;
                }
            }
            else {
                if (meet[1] < line2[1][1] || meet[1] > line2[0][1]) {
                    return false;
                }
            }
            if (line1[0][0] < line1[1][0]) {
                if (meet[0] < line1[0][0] || meet[0] > line1[1][0]) {
                    return false;
                }
            }
            else {
                if (meet[0] < line1[1][0] || meet[0] > line1[0][0]) {
                    return false;
                }
            }
            if (line1[0][1] < line1[1][1]) {
                if (meet[1] < line1[0][1] || meet[1] > line1[1][1]) {
                    return false;
                }
            }
            else {
                if (meet[1] < line1[1][1] || meet[1] > line1[0][1]) {
                    return false;
                }
            }
            return meet;
        };
        this.getYOnLineByX = function (l, X) {
            var _a = _this.getDLine(l), x = _a[0], y = _a[1], dip = _a[2];
            if (dip === Infinity) {
                return 0;
            }
            return dip * (X - x) + y;
        };
        this.getXOnLineByY = function (l, Y) {
            var _a = _this.getDLine(l), x = _a[0], y = _a[1], dip = _a[2];
            if (dip === 0) {
                return 0;
            }
            if (dip === Infinity) {
                return x;
            }
            return (Y - y) / dip + x;
        };
        this.tri = function (type, a) { return Math[type](a * Math.PI / 180); };
        this.getPointsByNGon = function (radius, count, corner) {
            var ang = (180 - (360 / count));
            var w = +(_this.tri('cos', ang / 2) * radius).toFixed(6) * 2;
            var h = +(_this.tri('sin', ang / 2) * radius).toFixed(6);
            var p1 = [0, -h, corner];
            var p2 = [0 + w / 2, -h, corner];
            var points = [p1, p2];
            var a = 360 / count;
            for (var i = 0; i < count - 1; i++) {
                var p = [points[i + 1][0] + (_this.tri('cos', a) * w), points[i + 1][1] + (_this.tri('sin', a) * w), corner];
                a += 360 / count;
                points.push(p);
            }
            points.push(p1);
            return points;
        };
        this.setLineByLength = function (line, length, side) {
            if (side === void 0) { side = 'end'; }
            var p1, p2, angle = _this.getAngle(line);
            if (side === 'center') {
                var center = _this.getAvg(line);
                var line1 = _this.getLineBySLA(center, length / 2, angle + 180);
                var line2 = _this.getLineBySLA(center, length / 2, angle);
                p1 = line1[1];
                p2 = line2[1];
            }
            else if (side === 'end') {
                p1 = line[0];
                var newLine = _this.getLineBySLA(p1, length, angle);
                p2 = newLine[1];
            }
            else if (side === 'start') {
                p2 = line[1];
                var newLine = _this.getLineBySLA(p2, length, angle + 180);
                p1 = newLine[1];
            }
            return [p1, p2];
        };
        this.getParallelLine = function (points, offset) {
            var lines = [];
            var length = points.length;
            if (length === 2) {
                var p1_1 = _this.getPrepFromLine([points[0], points[1]], points[0], offset);
                var p2_1 = _this.getPrepFromLine([points[0], points[1]], points[1], offset);
                return [p1_1, p2_1];
            }
            for (var i = 1; i <= length; i++) {
                var point = points[i];
                if (i === length) {
                    break;
                }
                var beforePoint = points[i - 1];
                var p1 = _this.getPrepFromLine([beforePoint, point], beforePoint, offset);
                var p2 = _this.getPrepFromLine([beforePoint, point], point, offset);
                lines.push([p1, p2]);
            }
            var res = [];
            length = lines.length;
            for (var i_9 = 0; i_9 < length; i_9++) {
                var line = lines[i_9];
                var beforeLine = lines[i_9 - 1];
                if (i_9 === 0) {
                    points.push([line[0][0], line[0][1]]);
                    continue;
                }
                var meet = _this.getMeet(beforeLine, line);
                if (meet) {
                    res.push(meet);
                }
                if (i_9 === length - 1) {
                    points.push([line[1][0], line[1][1]]);
                }
            }
            return res;
        };
        this.getPointsByDivide = function (line, divide) {
            var p1 = line[0], p2 = line[1];
            var deltaX = _this.fix(p2[0] - p1[0]), deltaY = _this.fix(p2[1] - p1[1]);
            var uX = deltaX / divide, uY = deltaY / divide;
            var points = [];
            for (var i = 1; i < divide; i++) {
                points.push([p1[0] + i * uX, p1[1] + i * uY]);
            }
            return points;
        };
        this.fix = function (value) { return parseFloat(value.toFixed(6)); };
        this.setLineByAngle = function (line, angle) {
            var length = _this.getLength(line);
            if (!length) {
                return line;
            }
            angle = angle % 360;
            return _this.getLineBySLA([line[0][0], line[0][1]], length, angle);
        };
        this.getNumberByStep = function (number, step) { return Math.round(number / step) * step; };
        this.setLineByOrtho = function (line, ortho) { return _this.setLineByAngle(line, _this.getNumberByStep(_this.getAngle(line), ortho)); };
        this.rotateSpline = function (points, angle, center) {
            var Points = JSON.parse(JSON.stringify(points));
            for (var i = 0; i < Points.length; i++) {
                var p = Points[i];
                var line = [__spreadArray([], center, true), [p[0], p[1]]];
                var lineAngle = _this.getAngle(line);
                line = _this.setLineByAngle(line, angle + lineAngle);
                p[0] = line[1][0];
                p[1] = line[1][1];
            }
            return Points;
        };
        this.isPointInPath = function (points, point) {
            var meets = 0;
            for (var i = 0; i < points.length; i++) {
                var curentPoint = points[i], nextPoint = void 0;
                if (i === points.length - 1) {
                    nextPoint = points[0];
                }
                else {
                    nextPoint = points[i + 1];
                }
                var meet = _this.getInnerMeet([[point[0], point[1]], [9999999999, point[1]]], [[curentPoint[0], curentPoint[1]], [nextPoint[0], nextPoint[1]]]);
                if (meet !== false) {
                    meets++;
                }
            }
            return meets % 2 !== 0;
        };
        this.getDXF = function (list) {
            if (list === void 0) { list = []; }
            var get = {
                line: function (line) {
                    var p1 = line[0], p2 = line[1];
                    var res = '';
                    res +=
                        "LINE" + "\r\n" +
                            "8" + "\r\n" +
                            "1" + "\r\n" +
                            "62" + "\r\n" +
                            "0" + "\r\n" +
                            "10" + "\r\n" +
                            (p1[0]) + "\r\n" +
                            "20" + "\r\n" +
                            (p1[1]) * -1 + "\r\n" +
                            "30" + "\r\n" +
                            "0.0" + "\r\n" +
                            "11" + "\r\n" +
                            (p2[0]) + "\r\n" +
                            "21" + "\r\n" +
                            (p2[1]) * -1 + "\r\n" +
                            "31" + "\r\n" +
                            "0.0" + "\r\n" +
                            "0" + "\r\n";
                    return res;
                },
                rect: function (rect) {
                    var p1 = rect[0], p2 = rect[1];
                    var rectangle = '';
                    rectangle += this.line([[p1[0], p1[1]], [p2[0], p2[1]]]);
                    rectangle += this.line([[p2[0], p1[1]], [p2[0], p2[1]]]);
                    rectangle += this.line([[p2[0], p2[1]], [p1[0], p2[1]]]);
                    rectangle += this.line([[p1[0], p2[1]], [p1[0], p1[1]]]);
                    return rectangle;
                },
                arc: function (arc) {
                    var x = arc.x, y = arc.y, r = arc.r, _a = arc.slice, slice = _a === void 0 ? [0, 360] : _a;
                    var res = '';
                    res +=
                        "ARC" + "\r\n" +
                            "8" + "\r\n" +
                            "1" + "\r\n" +
                            "62" + "\r\n" +
                            "0" + "\r\n" +
                            "10" + "\r\n" +
                            (x) + "\r\n" +
                            "20" + "\r\n" +
                            (y) * -1 + "\r\n" +
                            "30" + "\r\n" +
                            "0.0" + "\r\n" +
                            "40" + "\r\n" +
                            (r) + "\r\n" +
                            "50" + "\r\n" +
                            (slice[0]) + "\r\n" +
                            "51" + "\r\n" +
                            (slice[1]) + "\r\n" +
                            "0" + "\r\n";
                    return arc;
                }
            };
            var entities = '';
            for (var i = 0; i < list.length; i++) {
                var _a = list[i], type = _a.type, obj = _a.obj;
                entities += get[type](obj);
            }
            var dxfText = "0" + "\r\n" +
                "SECTION" + "\r\n" +
                "2" + "\r\n" +
                "ENTITIES" + "\r\n" +
                "0" + "\r\n";
            dxfText += entities;
            dxfText +=
                "ENDSEC" + "\r\n" +
                    "0" + "\r\n" +
                    "EOF";
            return dxfText;
        };
    }
    return Geo;
}());
exports.Geo = Geo;
function svgArcRange(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}
function svgArc(x, y, radius, startAngle, endAngle) {
    if (startAngle === endAngle || endAngle - startAngle === 360) {
        startAngle = 0;
        endAngle = 360;
    }
    if (startAngle === 360) {
        startAngle = 359.99;
    }
    if (endAngle === 360) {
        endAngle = 359.99;
    }
    var start = svgArcRange(x, y, radius, endAngle);
    var end = svgArcRange(x, y, radius, startAngle);
    var largeArcFlag;
    if (endAngle - startAngle < -180) {
        console.log(0);
        largeArcFlag = '0';
    }
    else if (endAngle - startAngle < 0) {
        //console.log(1)
        largeArcFlag = '1';
    }
    else if (endAngle - startAngle <= 180) {
        //console.log(2)
        largeArcFlag = '0';
    }
    else if (endAngle - startAngle <= 360) {
        //console.log(3)
        largeArcFlag = '1';
    }
    else {
        //console.log(4)
        largeArcFlag = '0';
    }
    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
    return d;
}
exports.svgArc = svgArc;
