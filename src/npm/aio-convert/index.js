"use strict";
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
var exceljs_1 = require("exceljs");
var file_saver_1 = require("file-saver");
var AIOConvert = /** @class */ (function () {
    function AIOConvert() {
        var _this = this;
        this.excelStyle = new ExcelStyle();
        this.file2workbook = function (file) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var reader;
                        var _this = this;
                        return __generator(this, function (_a) {
                            reader = new FileReader();
                            reader.onload = function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var data, workbook, error_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            data = new Uint8Array(e.target.result), workbook = new exceljs_1.default.Workbook();
                                            return [4 /*yield*/, workbook.xlsx.load(data)];
                                        case 1:
                                            _a.sent();
                                            resolve({ success: true, result: workbook });
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_1 = _a.sent();
                                            reject({ success: false, result: "Error processing Excel file: ".concat(error_1.message || error_1) });
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            reader.onerror = function (error) { reject({ success: false, result: "File reading error: ".concat(error.message || error) }); };
                            reader.readAsArrayBuffer(file);
                            return [2 /*return*/];
                        });
                    }); })];
            });
        }); };
        this.file2worksheet = function (file) { return __awaiter(_this, void 0, void 0, function () {
            var _a, success, result, worksheet;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.file2workbook(file)];
                    case 1:
                        _a = _b.sent(), success = _a.success, result = _a.result;
                        if (success === false) {
                            return [2 /*return*/, { success: false, result: result }];
                        }
                        worksheet = result.getWorksheet(1);
                        return [2 /*return*/, { success: true, result: worksheet }];
                }
            });
        }); };
        this.getHeaders = function (worksheet) {
            var headers = worksheet.getRow(1).values;
            if (!Array.isArray(headers)) {
                return [];
            }
            return headers.slice(1).map(function (o) { return o === undefined ? '' : o.toString(); }); // حذف index 0
        };
        this.getJson = function (worksheet) {
            var jsonData = [];
            var headers = _this.getHeaders(worksheet);
            worksheet.eachRow(function (row, rowIndex) {
                if (rowIndex > 1) {
                    var rowData_1 = {};
                    row.values.forEach(function (value, colIndex) {
                        var header = headers[colIndex];
                        if (header) {
                            rowData_1[header] = value;
                        }
                    });
                    jsonData.push(rowData_1);
                }
            });
            return { headers: headers, jsonData: jsonData };
        };
        this.excel2json = function (file) { return __awaiter(_this, void 0, void 0, function () {
            var _a, success, result, jsonData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.file2worksheet(file)];
                    case 1:
                        _a = _b.sent(), success = _a.success, result = _a.result;
                        if (success === false) {
                            return [2 /*return*/, { success: false, result: result }];
                        }
                        jsonData = this.getJson(result).jsonData;
                        return [2 /*return*/, { success: true, result: jsonData }];
                }
            });
        }); };
        this.validateHeaders = function (headers, columns) {
            var errors = [];
            columns.forEach(function (column) {
                if (!headers.includes(column)) {
                    var same = headers.find(function (ec) { return column.replace(/\s+/g, '') === ec.replace(/\s+/g, ''); });
                    var styleStr = 'style="background: #b7b7b750;padding: 6px;border-radius: 6px;font-size: 10px;margin-bottom:3px;"';
                    if (same) {
                        var str1 = 'در فایل اکسل ستون';
                        var str2 = "<highlight style='background:#ff000038;'>\"".concat(same, "\"</highlight>");
                        var str3 = "\u0628\u0627\u06CC\u062F \u0628\u0627 \u0633\u062A\u0648\u0646";
                        var str4 = "<highlight style='background:#00ff5a38;'>\"".concat(column, "\"</highlight>");
                        var str5 = "\u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646 \u0634\u0648\u062F";
                        errors.push("<li ".concat(styleStr, ">").concat(str1, " ").concat(str2, " ").concat(str3, " ").concat(str4, " ").concat(str5, "</li>"));
                    }
                    else {
                        errors.push("<li ".concat(styleStr, ">\u0633\u062A\u0648\u0646 \"").concat(column, "\" \u062F\u0631 \u0641\u0627\u06CC\u0644 \u0627\u06A9\u0633\u0644 \u0645\u0648\u062C\u0648\u062F \u0646\u06CC\u0633\u062A.</li>"));
                    }
                }
            });
            return errors;
        };
        this.downloadFile = function (file, fileName) {
            var blob = new Blob([file], { type: 'application/octet-stream' });
            if (!fileName) {
                var pr = window.prompt('نام فایل جدید را وارد کنید');
                pr = !pr || pr === null ? 'untitle' : pr;
                fileName = pr;
            }
            (0, file_saver_1.saveAs)(blob, "".concat(fileName, ".xlsx"));
        };
        this.getTemplateByKeys = function (p) { return __awaiter(_this, void 0, void 0, function () {
            var jsonRow, _i, _a, key, v;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        jsonRow = {};
                        for (_i = 0, _a = p.keys; _i < _a.length; _i++) {
                            key = _a[_i];
                            v = key[p.type];
                            if (v !== undefined) {
                                jsonRow[v] = key.defaultValue === undefined ? '' : key.defaultValue;
                            }
                        }
                        return [4 /*yield*/, this.json2excel([jsonRow])];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        }); };
        this.fix = function (key) {
            try {
                key = key.replace(/['"]/g, '');
            }
            catch (_a) { }
            try {
                key = key.trim();
            }
            catch (_b) { }
            return key;
        };
        this.fixRowKeys = function (row) {
            var res = {};
            for (var prop in row) {
                res[_this.fix(prop)] = row[prop];
            }
            return res;
        };
        this.convertJson = function (p) {
            var jsonData = p.jsonData, keys = p.keys, from = p.from, to = p.to, _a = p.extend, extend = _a === void 0 ? function (row) { return row; } : _a;
            return jsonData.map(function (row, i) {
                row = _this.fixRowKeys(row);
                var res = {};
                for (var j = 0; j < keys.length; j++) {
                    var key = keys[j], f = key[from], t = key[to];
                    var _a = key.nullValue, nullValue = _a === void 0 ? function () { return null; } : _a;
                    if (t === undefined || f === undefined) {
                        continue;
                    }
                    var cellValue = row[f];
                    cellValue = cellValue === undefined ? nullValue(i) : cellValue;
                    res[t] = cellValue;
                }
                res = extend(res, i);
                return res;
            });
        };
        this.excel2excel = function (file, styleList) { return __awaiter(_this, void 0, void 0, function () {
            var _a, success, result, workbook, excel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.file2workbook(file)];
                    case 1:
                        _a = _b.sent(), success = _a.success, result = _a.result;
                        if (success === false) {
                            return [2 /*return*/, { success: false, result: result }];
                        }
                        workbook = result;
                        return [4 /*yield*/, this.workbook2excel(workbook, styleList)];
                    case 2:
                        excel = _b.sent();
                        return [2 /*return*/, { success: true, result: excel }];
                }
            });
        }); };
        this.workbook2excel = function (workbook, styleList) { return __awaiter(_this, void 0, void 0, function () {
            var worksheet, headers, dic, i, buffer, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        worksheet = workbook.getWorksheet(1);
                        if (!worksheet) {
                            return [2 /*return*/, { success: false, result: 'cannot file worksheet' }];
                        }
                        headers = this.getHeaders(worksheet);
                        dic = {};
                        for (i = 0; i < headers.length; i++) {
                            dic[headers[i]] = i;
                        }
                        (styleList || []).forEach(function (_a) {
                            var rowIndex = _a.rowIndex, field = _a.field, style = _a.style;
                            var columnIndex = dic[field] + 1;
                            var cell = worksheet.getRow(rowIndex + 1).getCell(columnIndex);
                            if (style) {
                                _this.excelStyle.setCellStyle(cell, style);
                            }
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 2:
                        buffer = _a.sent();
                        return [2 /*return*/, { success: true, result: buffer }];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, { success: false, result: err_1.message }];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.json2excel = function (jsonData, styleList) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var workbook, worksheet_1, dic_1, _a, success, result, err_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    workbook = new exceljs_1.default.Workbook();
                                    worksheet_1 = workbook.addWorksheet('Sheet1');
                                    dic_1 = {};
                                    worksheet_1.columns = Object.keys(jsonData[0]).map(function (key, i) {
                                        dic_1[key] = i;
                                        return { header: key, key: key };
                                    });
                                    jsonData.forEach(function (row) { return worksheet_1.addRow(row); });
                                    return [4 /*yield*/, this.workbook2excel(workbook, styleList)];
                                case 1:
                                    _a = _b.sent(), success = _a.success, result = _a.result;
                                    if (success === false) {
                                        reject({ success: false, result: result });
                                    }
                                    else {
                                        resolve({ success: true, result: result });
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_2 = _b.sent();
                                    reject({ success: false, result: err_2.message });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); };
    }
    return AIOConvert;
}());
exports.default = AIOConvert;
var ExcelStyle = /** @class */ (function () {
    function ExcelStyle() {
        var _this = this;
        this.cssToARGB = function (cssColor) {
            var alpha = 'FF';
            if (cssColor.startsWith('#')) {
                var hex = cssColor.replace('#', '');
                if (hex.length === 3) {
                    hex = hex.split('').map(function (ch) { return ch + ch; }).join('');
                }
                return alpha + hex.toUpperCase();
            }
            else if (cssColor.startsWith('rgb')) {
                var match = cssColor.match(/\d+/g);
                if (match) {
                    var _a = match.map(function (num) { return parseInt(num).toString(16).padStart(2, '0'); }), r = _a[0], g = _a[1], b = _a[2];
                    return alpha + r.toUpperCase() + g.toUpperCase() + b.toUpperCase();
                }
            }
            return '';
        };
        this.getExcelBorderStyle = function (cssBorder) {
            var _a = cssBorder.split(' '), borderWidth = _a[0], borderStyle = _a[1], borderColor = _a[2];
            var px = +borderWidth;
            if (px < 1) {
                px = 1;
            }
            else if (px > 3) {
                px = 3;
            }
            var sizeStr = ['thin', 'medium', 'thick'][px - 1];
            return { style: sizeStr, color: { argb: _this.cssToARGB(borderColor) } };
        };
        this.setCellStyle = function (cell, style) {
            if (style.background) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: _this.cssToARGB(style.background) } };
            }
            var font = {};
            var hasFont = false;
            if (style.fontWeight === 'bold') {
                font.bold = true;
                hasFont = true;
            }
            if (style.fontFamily) {
                font.name = style.fontFamily;
                hasFont = true;
            }
            if (style.fontSize) {
                font.size = style.fontSize;
                hasFont = true;
            }
            if (style.color) {
                font.color = { argb: _this.cssToARGB(style.color) };
                hasFont = true;
            }
            if (hasFont) {
                cell.font = font;
            }
            var border = {};
            var hasBorder = false;
            if (style.borderTop) {
                border.top = _this.getExcelBorderStyle(style.borderTop);
                hasBorder = true;
            }
            if (style.borderBottom) {
                border.bottom = _this.getExcelBorderStyle(style.borderBottom);
                hasBorder = true;
            }
            if (style.borderLeft) {
                border.left = _this.getExcelBorderStyle(style.borderLeft);
                hasBorder = true;
            }
            if (style.borderRight) {
                border.right = _this.getExcelBorderStyle(style.borderRight);
                hasBorder = true;
            }
            if (hasBorder) {
                cell.border = border;
            }
            var align = {};
            var hasAlign = false;
            if (style.alignItems) {
                align.vertical = { 'center': 'middle', 'flex-start': 'top', 'flex-end': 'bottom' }[style.alignItems];
                hasAlign = true;
            }
            if (style.justifyContent) {
                align.vertical = { 'center': 'center', 'flex-start': 'left', 'flex-end': 'right' }[style.justifyContent];
                hasAlign = true;
            }
            if (style.flexWrap === 'wrap') {
                align.wrapText = true;
            }
            if (hasAlign) {
                cell.alignment = align;
            }
            if (style.display === 'none') {
                cell.hidden = true;
            }
        };
    }
    return ExcelStyle;
}());
