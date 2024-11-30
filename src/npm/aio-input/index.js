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
exports.MonthCells = exports.Mask = exports.AIApp = exports.AIMap = exports.AILogin = exports.AIOLogin_updateCatchedUser = exports.Code = exports.MonthCalendar = exports.AITable = exports.AIList = exports.AIAcardion = exports.AISpinner = exports.AISlider = exports.AITime = exports.AIDate = exports.AICheckbox = exports.AIFile = exports.AIImage = exports.AITree = exports.AITags = exports.AIButtons = exports.AITabs = exports.AIRadio = exports.AISelect = exports.AIColor = exports.AIPassword = exports.AITextarea = exports.AINumber = exports.AIText = exports.AIOInput_defaultProps = exports.AISwitch = exports.AIPanel = exports.AICard = exports.SideMenu = exports.Calendar = exports.Acardion = void 0;
var react_1 = require("react");
var prismjs_1 = require("prismjs");
var axios_1 = require("axios");
var leaflet_1 = require("leaflet");
var react_leaflet_1 = require("react-leaflet");
var jquery_1 = require("jquery");
var aio_popup_1 = require("./../../npm/aio-popup");
var aio_utils_1 = require("./../../npm/aio-utils");
var aio_swip_1 = require("./../../npm/aio-swip");
var aio_date_1 = require("./../../npm/aio-date");
require("leaflet/dist/leaflet.css");
require("./index.css");
var AICTX = (0, react_1.createContext)({});
var AIOInput = function (props) {
    var type = props.type, round = props.round;
    var value = props.value;
    if (type === 'text') {
        if (typeof value !== 'string') {
            value = '';
        }
    }
    else if (type === 'number') {
        if (typeof value !== 'number') {
            value = undefined;
        }
    }
    if (type === 'spinner') {
        type = 'range';
        if (!round || typeof round !== 'number') {
            round = 1;
        }
    }
    else if (type === 'slider') {
        type = 'range';
        round = 0;
    }
    else if (type === 'range') {
        return null;
    }
    var defaultProps = new aio_utils_1.Storage('aio-input-storage').getModel() || {};
    var rootProps = __assign(__assign(__assign({}, props), { type: type, round: round, value: value }), defaultProps);
    if (type === 'text' && rootProps.getOptions) {
        return <SuggestionInput {...rootProps}/>;
    }
    return <AIOINPUT {...rootProps}/>;
};
exports.default = AIOInput;
var SuggestionInput = function (props) {
    var getOptions = props.getOptions, option = props.option, onChange = props.onChange;
    var _a = (0, react_1.useState)([]), searchResult = _a[0], SetSearchResult = _a[1];
    var _b = (0, react_1.useState)(''), value = _b[0], setValue = _b[1];
    function setSearchResult(newValue) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setValue(newValue);
                        if (!newValue) {
                            SetSearchResult([]);
                            return [2 /*return*/];
                        }
                        if (!getOptions) return [3 /*break*/, 2];
                        return [4 /*yield*/, getOptions(newValue)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = [];
                        _b.label = 3;
                    case 3:
                        res = _a;
                        SetSearchResult(res);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<AIOInput {...props} value={value} options={searchResult} option={__assign(__assign({}, option), { onClick: function (optionDetails) {
                var text = GetOptionProps({ rootProps: props, key: 'text', optionDetails: optionDetails });
                setSearchResult(text);
                if (onChange) {
                    onChange(text, optionDetails.option);
                }
            } })} getOptions={undefined} onChange={function (newValue) {
            setSearchResult(newValue);
            if (onChange) {
                onChange(newValue);
            }
        }}/>);
};
function AIOINPUT(props) {
    var types = (0, react_1.useState)(getTypes(props))[0];
    var DATE = (0, react_1.useState)(new aio_date_1.default())[0];
    props = getDefaultProps(props, types);
    var type = props.type, value = props.value, onChange = props.onChange, _a = props.attrs, attrs = _a === void 0 ? {} : _a, rtl = props.rtl;
    var parentDom = (0, react_1.useState)((0, react_1.createRef)())[0];
    var datauniqid = (0, react_1.useState)('aiobutton' + (Math.round(Math.random() * 10000000)))[0];
    var _b = (0, react_1.useState)(), error = _b[0], setError = _b[1];
    (0, react_1.useEffect)(function () {
        validate();
    }, [props.value]);
    function validate() {
        var validations = props.validations, _a = props.lang, lang = _a === void 0 ? 'en' : _a, label = props.label, _b = props.reportError, reportError = _b === void 0 ? function () { } : _b;
        if (!validations) {
            return;
        }
        var res;
        if (typeof validations === 'function') {
            res = validations(value);
        }
        else {
            res = new aio_utils_1.Validation({ value: value, title: (label || '').replace(/\*/g, ''), lang: lang, validations: validations }).validate();
        }
        reportError(res);
        setError(res);
    }
    var _c = (0, react_1.useState)(getPopup(aio_popup_1.default)), popup = _c[0], setPopup = _c[1];
    function getPopup(ctor) {
        return new ctor({ rtl: props.rtl });
    }
    var _d = (0, react_1.useState)(false), showPassword = _d[0], SetShowPassword = _d[1];
    function setShowPassword(state) { SetShowPassword(state === undefined ? !showPassword : state); }
    var DragOptions = (0, react_1.useState)(new aio_utils_1.DragClass({
        callback: function (fromData, toData) {
            if (typeof props.onSwap === 'function') {
                var fromIndex = fromData.fromIndex;
                var options = toData.options, toIndex = toData.toIndex;
                var sorted = DragOptions.reOrder(options, fromIndex, toIndex);
                props.onSwap(sorted, options[fromIndex], options[toIndex]);
            }
        }
    }))[0];
    function getPopover(dom) {
        var className = 'aio-input-popover';
        className += " aio-input-popover-".concat(rtl ? 'rtl' : 'ltr');
        if (types.hasOption) {
            className += ' aio-input-dropdown';
        }
        if (props.type === 'time') {
            className += ' aio-input-time-popover';
        }
        var popover = __assign({}, (props.popover || {}));
        var body = popover.body, limitTo = popover.limitTo, header = popover.header, _a = popover.setAttrs, setAttrs = _a === void 0 ? function () { return {}; } : _a, _b = popover.position, position = _b === void 0 ? 'popover' : _b;
        var target = (0, jquery_1.default)(dom.current);
        var fitHorizontal = ['text', 'number', 'textarea'].indexOf(type) !== -1 || (type === 'select' && !!props.multiple) || !!popover.fitHorizontal;
        var config = {
            //props that have default but can change by user
            position: position,
            fitHorizontal: fitHorizontal,
            //props that havent default but can define by user(header,footer,fixStyle)
            limitTo: limitTo,
            header: header,
            //props that cannot change by user
            onClose: function () { return closePopup(); },
            body: function (o) {
                if (body) {
                    return body(o);
                }
                else if (type === 'date') {
                    return <Calendar onClose={o.close}/>;
                }
                else if (type === 'time') {
                    return <TimePopover onClose={o.close}/>;
                }
                else {
                    return <Options />;
                }
            },
            pageSelector: '.aio-input-backdrop.' + datauniqid, getTarget: function () { return target; },
            setAttrs: function (key) {
                var attrs = setAttrs(key);
                if (key === 'modal') {
                    return (0, aio_utils_1.AddToAttrs)(attrs, { className: className });
                }
                if (key === 'backdrop') {
                    return (0, aio_utils_1.AddToAttrs)(attrs, { className: 'aio-input-backdrop ' + datauniqid });
                }
            }
        };
        return config;
    }
    function closePopup() {
        popup.removeModal();
        setTimeout(function () { return (0, jquery_1.default)(parentDom.current).focus(); }, 0);
    }
    function click(e, dom) {
        if (type === 'checkbox') {
            if (onChange) {
                onChange(!value, e);
            }
        }
        else if (types.isDropdown) {
            var open_1 = !!popup.getModals().length;
            if (open_1) {
                return;
            }
            popup.addModal(getPopover(dom));
        }
        else if (typeof props.onClick === 'function') {
            props.onClick(e);
        }
        else if (attrs.onClick) {
            attrs.onClick();
        }
    }
    function optionClick(option) {
        var _a = option.attrs, attrs = _a === void 0 ? {} : _a, onClick = option.onClick, close = option.close;
        if (onClick) {
            onClick(option.details);
        }
        else if (attrs.onClick) {
            attrs.onClick(option);
        }
        else if (onChange) {
            if (types.isInput) { /*do nothing*/ }
            else if (type === 'tree') { /*do nothing*/ }
            else if (type === 'file') { /*do nothing*/ }
            else if (types.isMultiple) {
                var multiple = props.multiple, newValue = void 0;
                if (value.indexOf(option.value) === -1) {
                    newValue = value.concat(option.value);
                }
                else {
                    newValue = value.filter(function (o) { return o !== option.value; });
                }
                while (typeof multiple === 'number' && newValue.length > multiple) {
                    newValue = newValue.slice(1, newValue.length);
                }
                onChange(newValue, option.details);
            }
            else {
                if (option.value !== props.value) {
                    onChange(option.value, option.details);
                }
                else if (props.deSelect === true) {
                    onChange(undefined, option.details);
                }
                else if (typeof props.deSelect === 'function') {
                    props.deSelect();
                }
            }
        }
        if (close) {
            closePopup();
        }
    }
    function getOptions() {
        var options = [];
        if (type === 'date') {
            if (!props.multiple) {
                return { optionsList: [], optionsDic: {} };
            }
            options = __spreadArray([], props.value, true);
        }
        else if (typeof props.options === 'function') {
            options = props.options();
        }
        else if (props.options) {
            options = props.options;
        }
        else {
            options = [];
        }
        return GetOptions({ rootProps: props, types: types, options: options });
    }
    function getContext() {
        var context = {
            error: error,
            options: getOptions(),
            popup: popup,
            rootProps: __assign(__assign({}, props), { value: value }),
            datauniqid: datauniqid,
            touch: 'ontouchstart' in document.documentElement,
            DragOptions: DragOptions,
            click: click,
            optionClick: optionClick,
            types: types,
            showPassword: showPassword,
            setShowPassword: setShowPassword,
            DATE: DATE
        };
        return context;
    }
    function getRangeClassName() {
        var round = props.round, vertical = props.vertical;
        if (round) {
            return 'aio-input-range-round';
        }
        if (vertical) {
            return 'aio-input-range-vertical';
        }
        return 'aio-input-range-horizontal';
    }
    var render = {
        spinner: function () { return null; },
        slider: function () { return null; },
        acardion: function () { return <exports.Acardion />; },
        tree: function () { return <Tree />; },
        tags: function () { return <Layout properties={{ text: <Tags /> }}/>; },
        list: function () { return <List />; },
        file: function () { return <File />; },
        select: function () { return <Select />; },
        table: function () { return <Table />; },
        checkbox: function () { return <Layout />; },
        button: function () { return <Layout />; },
        range: function () { return <Layout properties={{ text: <Range />, className: getRangeClassName() }}/>; },
        radio: function () { return <Layout properties={{ text: <Options /> }}/>; },
        tabs: function () { return <Layout properties={{ text: <Options /> }}/>; },
        buttons: function () { return <Layout properties={{ text: <Options /> }}/>; },
        date: function () { return <DateInput />; },
        time: function () { return <Layout properties={{ text: getTimeText(props) }}/>; },
        image: function () { return <Layout properties={{ text: <Image /> }}/>; },
        text: function () { return <Layout properties={{ text: <Input /> }}/>; },
        password: function () { return <Layout properties={{ text: <Input /> }}/>; },
        textarea: function () { return <Layout properties={{ text: <Input /> }}/>; },
        number: function () { return <Layout properties={{ text: <Input /> }}/>; },
        color: function () { return <Layout properties={{ text: <Input /> }}/>; }
    };
    if (!type || !render[type]) {
        return null;
    }
    return (<AICTX.Provider key={datauniqid} value={getContext()}>{render[type]()}{popup.render()}</AICTX.Provider>);
}
function TimePopover(props) {
    var _a = (0, react_1.useContext)(AICTX), DATE = _a.DATE, rootProps = _a.rootProps;
    var jalali = rootProps.jalali, onChange = rootProps.onChange, _b = rootProps.size, size = _b === void 0 ? 12 : _b;
    var onClose = props.onClose;
    var _c = (0, react_1.useState)(getTimeByUnit(rootProps)), value = _c[0], setValue = _c[1];
    var startYear = (0, react_1.useState)(value.year ? value.year - 10 : undefined)[0];
    var endYear = (0, react_1.useState)(value.year ? value.year + 10 : undefined)[0];
    function change(obj) {
        setValue(__assign(__assign({}, value), obj));
    }
    function translate(key) {
        return !!jalali ? { 'year': 'سال', 'month': 'ماه', 'day': 'روز', 'hour': 'ساعت', 'minute': 'دقیقه', 'second': 'ثانیه', 'Submit': 'ثبت', 'Now': 'اکنون' }[key] : key;
    }
    function getTimeOptions(type) {
        var _a, _b, _c;
        //@ts-nocheck
        var year = value.year, month = value.month, day = value.day;
        if (type === 'year' && startYear && endYear) {
            return (0, aio_utils_1.GetArray)(endYear - startYear + 1, function (i) { return ({ text: i + startYear, value: i + startYear }); }, (_a = rootProps.timeStep) === null || _a === void 0 ? void 0 : _a.year);
        }
        if (type === 'day' && day) {
            var length_1 = !year || !month ? 31 : DATE.getMonthDaysLength([year, month]);
            if (day > length_1) {
                change({ day: 1 });
            }
            return (0, aio_utils_1.GetArray)(length_1, function (i) { return { text: i + 1, value: i + 1 }; }, (_b = rootProps.timeStep) === null || _b === void 0 ? void 0 : _b.day);
        }
        if (type === 'month') {
            return (0, aio_utils_1.GetArray)(12, function (i) { return ({ text: i + 1, value: i + 1 }); }, (_c = rootProps.timeStep) === null || _c === void 0 ? void 0 : _c.month);
        }
        return (0, aio_utils_1.GetArray)(type === 'hour' ? 24 : 60, function (i) { return ({ text: i, value: i }); }, rootProps.timeStep ? rootProps.timeStep[type] : undefined);
    }
    function layout(type) {
        if (typeof value[type] !== 'number') {
            return null;
        }
        var options = getTimeOptions(type);
        var p = { type: 'list', value: value[type], options: options, size: size * 2.5, onChange: function (v) {
                var _a;
                return change((_a = {}, _a[type] = v, _a));
            } };
        return (<div className="aio-input-time-popover-item">
                <div className="aio-input-time-popover-item-title">{translate(type)}</div>
                <AIOInput {...p}/>
                <div className='aio-input-time-popover-highlight'></div>
            </div>);
    }
    function setValueByTimeStep(value) {
        debugger;
        return value;
    }
    function submit() { if (onChange) {
        onChange(setValueByTimeStep(value));
    } onClose(); }
    function now() { setValue(getTimeByUnit(rootProps, true)); }
    return (<div className='aio-input-time-popover-content aio-input-theme-bg1 aio-input-theme-color0' style={{ fontSize: size }}>
            <div className="aio-input-time-popover-body">
                {layout('year')} {layout('month')} {layout('day')} {layout('hour')} {layout('minute')} {layout('second')}
            </div>
            <div className="aio-input-time-popover-footer">
                <button onClick={submit}>{translate('Submit')}</button>
                {rootProps.now !== false && <button onClick={function () { return now(); }}>{translate('Now')}</button>}
            </div>
        </div>);
}
function Image() {
    var rootProps = (0, react_1.useContext)(AICTX).rootProps;
    var popup = (0, react_1.useState)(new aio_popup_1.default())[0];
    var value = rootProps.value, attrs = rootProps.attrs, onChange = rootProps.onChange, disabled = rootProps.disabled, placeholder = rootProps.placeholder, preview = rootProps.preview, deSelect = rootProps.deSelect, _a = rootProps.imageAttrs, imageAttrs = _a === void 0 ? {} : _a;
    var _b = (0, react_1.useState)(), url = _b[0], setUrl = _b[1];
    var dom = (0, react_1.createRef)();
    // if(typeof value === 'object'){
    //     let fr = new FileReader();
    //     fr.onload = function () {
    //         $(dom.current).attr('src',fr.result)
    //     }
    //     fr.readAsDataURL(value);
    // }
    (0, react_1.useEffect)(function () {
        if (!value || value === null) {
            if (url !== value) {
                setUrl('');
            }
        }
        else if (typeof value === 'object') {
            changeUrl(value);
        }
        else if (typeof value === 'string') {
            if (url !== value) {
                setUrl(value);
            }
        }
    });
    function changeUrl(file, callback) {
        try {
            var fr_1 = new FileReader();
            fr_1.onload = function () {
                if (url !== fr_1.result) {
                    setUrl(fr_1.result);
                    if (callback) {
                        callback(fr_1.result);
                    }
                }
            };
            fr_1.readAsDataURL(file);
        }
        catch (_a) { }
    }
    function onPreview(e) {
        e.stopPropagation();
        e.preventDefault();
        openPopup();
    }
    function openPopup() {
        popup.addModal({
            position: 'center', header: { title: '', onClose: function () { return popup.removeModal(); } },
            body: function () { return <div className='aio-input-image-preview-popup'><img src={(0, jquery_1.default)(dom.current).attr('src')} alt={placeholder}/></div>; }
        });
    }
    var IMG = url ? (<>
            <img ref={dom} src={url} alt={placeholder} style={{ objectFit: 'contain', cursor: !onChange ? 'default' : undefined }} onClick={!!onChange ? undefined : onPreview} height='100%' {...imageAttrs}/>
            {!!deSelect &&
            <div onClick={function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (typeof deSelect === 'function') {
                        deSelect();
                    }
                    else if (onChange) {
                        onChange('');
                    }
                }} className='aio-input-image-remove'>{I('mdiClose', 1)}</div>}
            {preview && !!onChange && <div onClick={function (e) { return onPreview(e); }} className='aio-input-image-preview'>{I('mdiImage', 1)}</div>}
            {popup.render()}
        </>) : <span {...attrs} className='aio-input-image-placeholder'>{placeholder || 'placeholder'}</span>;
    if (!onChange) {
        return IMG;
    }
    var p = {
        disabled: disabled,
        justify: true, text: IMG, attrs: { style: { width: '100%', height: '100%', padding: 0 } },
        onChange: function (file) { return changeUrl(file, function (url) { if (onChange)
            onChange(url); }); }
    };
    return (<exports.AIFile {...p}/>);
}
function File() { return (<div className='aio-input-file-container'><Layout /><FileItems /></div>); }
function InputFile() {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, types = _a.types;
    var _b = rootProps.value, value = _b === void 0 ? [] : _b, _c = rootProps.onChange, onChange = _c === void 0 ? function () { } : _c, disabled = rootProps.disabled, multiple = rootProps.multiple, inputAttrs = rootProps.inputAttrs;
    function change(e) {
        var Files = e.target.files;
        var result;
        if (types.isMultiple) {
            result = __spreadArray([], value, true);
            var names = result.map(function (_a) {
                var name = _a.name;
                return name;
            });
            for (var i = 0; i < Files.length; i++) {
                var file = Files[i];
                if (names.indexOf(file.name) !== -1) {
                    continue;
                }
                result.push({ name: file.name, size: file.size, file: file });
            }
            if (typeof multiple === 'number') {
                while (result.length > multiple) {
                    result = result.slice(1, result.length);
                }
            }
        }
        else {
            result = Files.length ? Files[0] : undefined;
        }
        onChange(result);
    }
    var props = __assign({ disabled: disabled === true, type: 'file', style: { display: 'none' }, multiple: types.isMultiple, onChange: function (e) { return change(e); } }, inputAttrs);
    return <input {...props}/>;
}
function FileItems() {
    var rootProps = (0, react_1.useContext)(AICTX).rootProps;
    var value = rootProps.value, rtl = rootProps.rtl;
    var files = [];
    if (Array.isArray(value)) {
        files = value;
    }
    else if (value) {
        files = [value];
    }
    else {
        return null;
    }
    if (!files.length) {
        return null;
    }
    var Files = files.map(function (file, i) { return <FileItem key={i} file={file} index={i}/>; });
    return (<div className='aio-input-files' style={{ direction: rtl ? 'rtl' : 'ltr' }}>{Files}</div>);
}
var FileItem = function (props) {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, types = _a.types;
    var _b = rootProps.onChange, onChange = _b === void 0 ? function () { } : _b, _c = rootProps.value, value = _c === void 0 ? [] : _c;
    var file = props.file, index = props.index;
    function getFile(file) {
        var filename = file.name || 'untitle';
        var fileSize = file.size || 0;
        var nameLength = 20;
        try {
            var minName_1, sizeString_1;
            var lastDotIndex = filename.lastIndexOf('.');
            var name_1 = filename.slice(0, lastDotIndex);
            var format = filename.slice(lastDotIndex + 1, filename.length);
            if (name_1.length > nameLength) {
                minName_1 = name_1.slice(0, Math.floor(nameLength / 2)) + '...' + name_1.slice(name_1.length - Math.floor(nameLength / 2), name_1.length) + '.' + format;
            }
            else {
                minName_1 = filename;
            }
            var size = fileSize;
            if (!size) {
                return { minName: minName_1, sizeString: false };
            }
            var gb = size / (1024 * 1024 * 1024), mb = size / (1024 * 1024), kb = size / 1024;
            if (gb >= 1) {
                sizeString_1 = gb.toFixed(2) + ' GB';
            }
            else if (mb >= 1) {
                sizeString_1 = mb.toFixed(2) + ' MB';
            }
            else if (kb >= 1) {
                sizeString_1 = kb.toFixed(2) + ' KB';
            }
            else {
                sizeString_1 = size + ' byte';
            }
            return { minName: minName_1, sizeString: sizeString_1 };
        }
        catch (_a) {
            return { minName: 'untitle', sizeString: false };
        }
    }
    function remove(e, index) {
        return __awaiter(this, void 0, void 0, function () {
            var res, newValue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.stopPropagation();
                        e.preventDefault();
                        if (!(typeof rootProps.onRemove === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, rootProps.onRemove({ row: value[index], rowIndex: index })];
                    case 1:
                        res = _a.sent();
                        if (res === false) {
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        newValue = [];
                        for (i = 0; i < value.length; i++) {
                            if (i === index) {
                                continue;
                            }
                            newValue.push(value[i]);
                        }
                        onChange(newValue);
                        return [2 /*return*/];
                }
            });
        });
    }
    function download() {
        (0, aio_utils_1.DownloadFile)(file);
    }
    function getIcon() {
        var filePreview;
        if (rootProps.preview) {
            filePreview = (0, aio_utils_1.FilePreview)(file, { onClick: function () { return download(); } });
        }
        if (filePreview && filePreview !== null) {
            return filePreview;
        }
        return (<div className='aio-input-file-item-icon' onClick={function () { return download(); }}>{I('mdiAttachment', .8)}</div>);
    }
    var _d = getFile(file), minName = _d.minName, sizeString = _d.sizeString;
    var optionsList = GetOptions({
        rootProps: rootProps,
        types: types,
        options: [{ minName: minName, sizeString: sizeString, index: index }],
        defaultOptionProps: {
            subtext: function () { return sizeString; },
            text: function () { return minName; },
            before: function () { return getIcon(); },
            after: function () { return <div className='aio-input-file-item-icon' onClick={function (e) { return remove(e, index); }}>{I('mdiClose', .7)}</div>; }
        }
    }).optionsList;
    var option = optionsList[0];
    return <Layout option={option}/>;
};
function Select() {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, types = _a.types, options = _a.options;
    var value = rootProps.value, hideTags = rootProps.hideTags;
    var values = Array.isArray(value) ? __spreadArray([], value, true) : (value !== undefined ? [value] : []);
    function getSelectText() {
        if (!values.length) {
            return;
        }
        var option = options.optionsDic['a' + values[0]];
        if (!option) {
            return;
        }
        return option.text;
    }
    if (types.isMultiple) {
        return (<div className={'aio-input-multiselect-container'}>
                <Layout />
                {!hideTags && !!values.length && <Tags />}
            </div>);
    }
    else {
        return <Layout properties={{ text: rootProps.text || getSelectText() }}/>;
    }
}
function DateInput() {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, types = _a.types;
    var value = rootProps.value, hideTags = rootProps.hideTags;
    var values = Array.isArray(value) ? __spreadArray([], value, true) : (value !== undefined ? [value] : []);
    function getDateText() {
        var value = rootProps.value, _a = rootProps.unit, unit = _a === void 0 ? Def('date-unit') : _a, text = rootProps.text, PT = rootProps.pattern, jalali = rootProps.jalali, placeholder = rootProps.placeholder;
        if (value) {
            text = PT !== undefined ? PT : text;
            var DATE = new aio_date_1.default();
            var list = DATE.convertToArray(value);
            var year = list[0], _b = list[1], month = _b === void 0 ? 1 : _b, _c = list[2], day = _c === void 0 ? 1 : _c, _d = list[3], hour = _d === void 0 ? 0 : _d;
            list = [year, month, day, hour];
            var splitter = DATE.getSplitter(value);
            var content = '';
            if (text && text !== null) {
                content = text;
            }
            else {
                var pattern = '{}';
                if (unit === 'month') {
                    pattern = "{year}".concat(splitter, "{month}");
                }
                else if (unit === 'day') {
                    pattern = "{year}".concat(splitter, "{month}").concat(splitter, "{day}");
                }
                else if (unit === 'hour') {
                    pattern = "{year}".concat(splitter, "{month}").concat(splitter, "{day} - {hour} : 00");
                }
                content = DATE.getDateByPattern(list, pattern);
            }
            return <div style={{ direction: 'ltr', width: '100%' }}>{content}</div>;
        }
        return placeholder || (!jalali ? 'Select Date' : 'انتخاب تاریخ');
    }
    if (types.isMultiple) {
        return (<div className={'aio-input-multiselect-container'}>
                <Layout properties={{ text: rootProps.text || 'Select Dates' }}/>
                {!hideTags && !!values.length && <Tags />}
            </div>);
    }
    else {
        return <Layout properties={{ text: getDateText() }}/>;
    }
}
var Tags = function () {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, options = _a.options;
    var _b = rootProps.value, value = _b === void 0 ? [] : _b, rtl = rootProps.rtl, disabled = rootProps.disabled, _c = rootProps.onChange, onChange = _c === void 0 ? function () { } : _c;
    var tags = value.map(function (o, i) {
        var option = options.optionsDic['a' + o];
        if (option === undefined) {
            return null;
        }
        return (<Tag onClose={function () { return onChange(rootProps.value.filter(function (rpv) { return rpv !== o; })); }} key={i} attrs={option.tagAttrs} before={option.tagBefore} after={option.tagAfter} text={option.text} disabled={option.disabled}/>);
    });
    return !tags.length ? null : <div className={"aio-input-tags-container aio-input-scroll".concat(rtl ? ' rtl' : '').concat(disabled ? ' disabled' : '')}>{tags}</div>;
};
var Tag = function (props) {
    var attrs = props.attrs, _a = props.before, before = _a === void 0 ? I('mdiCircleMedium', 0.7) : _a, after = props.after, text = props.text, disabled = props.disabled, _b = props.onClose, onClose = _b === void 0 ? function () { } : _b;
    var close = disabled ? undefined : onClose;
    var cls = 'aio-input-tag';
    var Attrs = (0, aio_utils_1.AddToAttrs)(attrs, { className: [cls + ' aio-input-main-bg', disabled ? 'disabled' : undefined] });
    return (<div {...Attrs}>
            <div className={"".concat(cls, "-icon")}>{before}</div>
            <div className={"".concat(cls, "-text")}>{text}</div>
            {after !== undefined && <div className={"".concat(cls, "-icon")}>{after}</div>}
            <div className={"".concat(cls, "-icon")} onClick={close}>{I('mdiClose', 0.7)}</div>
        </div>);
};
function Input() {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, types = _a.types, showPassword = _a.showPassword, options = _a.options;
    var type = rootProps.type, _b = rootProps.delay, delay = _b === void 0 ? 500 : _b;
    var min = rootProps.min, max = rootProps.max, swip = rootProps.swip, onChange = rootProps.onChange, blurChange = rootProps.blurChange, _c = rootProps.maxLength, maxLength = _c === void 0 ? Infinity : _c, justNumber = rootProps.justNumber, _d = rootProps.filter, filter = _d === void 0 ? [] : _d, disabled = rootProps.disabled, placeholder = rootProps.placeholder, inputAttrs = rootProps.inputAttrs, _e = rootProps.spin, spin = _e === void 0 ? true : _e, justify = rootProps.justify;
    var dom = (0, react_1.useState)((0, react_1.createRef)())[0];
    var temp = (0, react_1.useState)({ atimeout: undefined, btimeout: undefined, clicked: false })[0];
    var datauniqid = (0, react_1.useState)("ac".concat(Math.round(Math.random() * 100000)))[0];
    var _f = (0, react_1.useState)(rootProps.value || ''), value = _f[0], setValue = _f[1];
    var valueRef = (0, react_1.useRef)(value);
    valueRef.current = value;
    function setSwip() {
        if (type === 'number' && swip) {
            new aio_swip_1.default({
                speedY: swip, reverseY: true, minY: min, maxY: max,
                dom: function () { return (0, jquery_1.default)(dom.current); },
                start: function () {
                    var vref = +valueRef.current;
                    vref = isNaN(vref) ? 0 : vref;
                    return [0, vref];
                },
                move: function (p) {
                    var y = (p.change || { y: 0 }).y;
                    if (min !== undefined && y < min) {
                        y = min;
                    }
                    if (max !== undefined && y > max) {
                        y = max;
                    }
                    change(y, onChange);
                }
            });
        }
    }
    (0, react_1.useEffect)(function () { setSwip(); }, []);
    function getValidValue() {
        var v = rootProps.value;
        if (type === 'number') {
            if (v === '') {
                return undefined;
            } //important because +('') is 0
            else if (!isNaN(+v)) {
                v = +v;
                if (typeof min === 'number' && v < min) {
                    v = min;
                }
                else if (typeof max === 'number' && v > max) {
                    v = max;
                }
            }
        }
        return v;
    }
    function update() {
        clearTimeout(temp.atimeout);
        temp.atimeout = setTimeout(function () {
            var v = getValidValue();
            if (v !== value) {
                setValue(v);
            }
        }, delay);
    }
    (0, react_1.useEffect)(function () {
        update();
    }, [rootProps.value]);
    function convertPersianDigits(value) {
        try {
            value = value.toString();
            var res = '';
            for (var i = 0; i < value.length; i++) {
                var dic = {
                    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9"
                };
                res += dic[value[i]] || value[i];
            }
            value = res;
        }
        catch (_a) { }
        return value;
    }
    function change(value, onChange) {
        if (types.hasKeyboard) {
            if (value) {
                value = convertPersianDigits(value);
                if ((type === 'text' || type === 'textarea' || type === 'password') && justNumber) {
                    value = value.toString();
                    var lastChar = value[value.length - 1];
                    if (lastChar === ' ' || isNaN(+lastChar)) {
                        if (Array.isArray(justNumber)) {
                            if (justNumber.indexOf(lastChar) === -1) {
                                value = value.slice(0, value.length - 1);
                            }
                        }
                        else {
                            value = value.slice(0, value.length - 1);
                        }
                    }
                }
                if ((type === 'text' || type === 'textarea' || type === 'password') && filter.length) {
                    value = value.toString();
                    var lastChar = value[value.length - 1];
                    for (var i = 0; i < filter.length; i++) {
                        var char = filter[i].toString();
                        if (char === 'symbol') {
                            if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(lastChar)) {
                                value = value.slice(0, value.length - 1);
                                break;
                            }
                        }
                        else if (char === 'number') {
                            if (!isNaN(+lastChar)) {
                                value = value.slice(0, value.length - 1);
                                break;
                            }
                        }
                        else if (char === 'string') {
                            if (isNaN(+lastChar)) {
                                value = value.slice(0, value.length - 1);
                                break;
                            }
                        }
                        else {
                            if (char === lastChar) {
                                value = value.slice(0, value.length - 1);
                                break;
                            }
                        }
                    }
                }
                if ((type === 'text' || type === 'textarea' || type === 'password') && value.toString().length > maxLength) {
                    value = value.toString().slice(0, maxLength);
                }
                try {
                    if (type === 'number' && value.toString().length > maxLength) {
                        value = +value.toString().slice(0, maxLength);
                    }
                }
                catch (_a) { }
            }
        }
        if (rootProps.type === 'number') {
            if (value !== '') {
                value = +value;
            }
            else {
                value = undefined;
            }
        }
        setValue(value);
        if (!blurChange && onChange) {
            clearTimeout(temp.btimeout);
            temp.btimeout = setTimeout(function () { return onChange(value); }, delay);
        }
    }
    function click() {
        if (rootProps.autoHighlight === false) {
            return;
        }
        if (temp.clicked) {
            return;
        }
        temp.clicked = true;
        (0, jquery_1.default)(dom.current).focus().select();
    }
    function blur(onChange) {
        temp.clicked = false;
        if (blurChange && onChange) {
            onChange(value);
        }
    }
    function getInputAttrs() {
        var InputAttrs = (0, aio_utils_1.AddToAttrs)(inputAttrs, {
            className: !spin ? 'no-spin' : undefined,
            style: justify ? { textAlign: 'center' } : undefined
        });
        var p = __assign(__assign({}, InputAttrs), { value: value, type: type, ref: dom, disabled: disabled, placeholder: placeholder, list: rootProps.options ? datauniqid : undefined, onClick: function (e) { return click(); }, onChange: onChange ? function (e) { return change(e.target.value, onChange); } : undefined, onBlur: function () { return blur(onChange); } });
        if (type === 'password' && showPassword) {
            p = __assign(__assign({}, p), { type: 'text', style: __assign(__assign({}, p.style), { textAlign: 'center' }) });
        }
        if (justNumber === true) {
            p.pattern = "\d*";
            p.inputMode = "numeric";
        }
        return p;
    }
    var attrs = getInputAttrs();
    if (!attrs.onChange) {
        return value;
    }
    else if (type === 'color') {
        return (<label style={{ width: '100%', height: '100%', background: value }}>
                <input {...attrs} style={{ opacity: 0 }} opacity rgba cmyk hsla/>
                {!!options.optionsList.length && <datalist id={datauniqid}>{options.optionsList.map(function (o) { return <option value={o.value}/>; })}</datalist>}
            </label>);
    }
    else if (type === 'textarea') {
        return <textarea {...attrs}/>;
    }
    else {
        return (<input {...attrs}/>);
    }
}
function Options() {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, types = _a.types, options = _a.options;
    var _b = (0, react_1.useState)(''), searchValue = _b[0], setSearchValue = _b[1];
    var dom = (0, react_1.useState)((0, react_1.createRef)())[0];
    var focused = (0, react_1.useState)()[0];
    function renderSearchBox(options) {
        if (rootProps.type === 'tabs' || rootProps.type === 'buttons' || types.isInput || !rootProps.search) {
            return null;
        }
        if (searchValue === '' && options.length < 10) {
            return null;
        }
        return (<div className='aio-input-search'>
                <input type='text' value={searchValue} placeholder={rootProps.search} onChange={function (e) { return setSearchValue(e.target.value); }}/>
                <div className='aio-input-search-icon' onClick={function () { setSearchValue(''); }}>
                    {I(searchValue ? 'mdiClose' : 'mdiMagnify', .8)}
                </div>
            </div>);
    }
    function getRenderOptions(options) {
        return options.map(function (option, i) {
            if (searchValue) {
                if (option.text === undefined || option.text === '' || option.text === null) {
                    return null;
                }
                if (option.text.indexOf(searchValue) === -1) {
                    return null;
                }
            }
            var p = { option: option, index: i, searchValue: searchValue };
            return <Layout {...p} key={i}/>;
        });
    }
    (0, react_1.useEffect)(function () {
        try {
            setTimeout(function () { return (0, jquery_1.default)(dom.current).focus(); }, 30);
        }
        catch (_a) { }
    }, []);
    function keyDown(e) {
        var code = e.keyCode;
        if (code === 40) {
        }
    }
    if (!options.optionsList.length) {
        return null;
    }
    var renderOptions = getRenderOptions(options.optionsList);
    var className = "aio-input-options aio-input-scroll aio-input-".concat(rootProps.type, "-options");
    if (types.isDropdown) {
        className += ' aio-input-dropdown-options';
    }
    return (<div className='aio-input-options-container' ref={dom} tabIndex={0} onKeyDown={function (e) { return keyDown(e); }}>
            {renderSearchBox(options.optionsList)}
            <div className={className}>{renderOptions}</div>
        </div>);
}
var Layout = function (props) {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, datauniqid = _a.datauniqid, types = _a.types, touch = _a.touch, DragOptions = _a.DragOptions, click = _a.click, optionClick = _a.optionClick, showPassword = _a.showPassword, setShowPassword = _a.setShowPassword, error = _a.error, popup = _a.popup;
    var option = props.option, index = props.index, toggle = props.toggle, indent = props.indent;
    var type = rootProps.type, rtl = rootProps.rtl;
    var dom = (0, react_1.useState)((0, react_1.createRef)())[0];
    var _b = (0, react_1.useState)(), recognition = _b[0], setRecognition = _b[1];
    (0, react_1.useEffect)(function () {
        if (!('webkitSpeechRecognition' in window)) {
            return;
        }
        var _a = rootProps.lang, lang = _a === void 0 ? 'en' : _a, onChange = rootProps.onChange, voice = rootProps.voice;
        if (!voice || !onChange || !types.hasKeyboard) {
            return;
        }
        // @ts-ignore
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            return;
        }
        var recognition = new SpeechRecognition();
        recognition.lang = { en: 'en-US', fa: 'fa-IR' }[lang];
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.onresult = function (event) {
            var result = event.results[0][0].transcript;
            if (onChange)
                onChange(result);
        };
        recognition.onerror = function (event) {
            console.error('خطا در تشخیص گفتار: ', event.error);
        };
        recognition.onend = function () {
            console.log('تشخیص گفتار پایان یافت.');
        };
        setRecognition(recognition);
        return function () { recognition.stop(); };
    }, []);
    function getClassName() {
        var cls;
        if (option !== undefined) {
            cls = "aio-input-option aio-input-".concat(type, "-option");
            if (types.isMultiple) {
                cls += " aio-input-".concat(type, "-multiple-option");
            }
            if (types.isDropdown) {
                cls += " aio-input-dropdown-option";
            }
            if (option.details.active === true) {
                cls += ' active';
                if (type === 'tabs') {
                    cls += ' aio-input-main-color';
                }
                if (type === 'buttons') {
                    cls += ' aio-input-main-bg';
                }
            }
        }
        else {
            cls = "aio-input aio-input-".concat(type).concat(touch ? ' aio-input-touch' : '');
            if (types.isInput) {
                cls += " aio-input-input";
            }
            if (rootProps.justify) {
                cls += ' aio-input-justify';
            }
            if (error) {
                cls += ' has-error';
            }
            cls += rtl ? ' aio-input-rtl' : ' aio-input-ltr';
        }
        if (indent) {
            cls += " aio-input-indent-".concat(indent.size);
        }
        if (type === 'tree') {
            var size = rootProps.size || Def('tree-size');
            size = Math.round(size / 12) * 12;
            if (size < 24) {
                size = 24;
            }
            if (size > 120) {
                size = 120;
            }
            cls += " aio-input-size-".concat(size);
        }
        if (properties.disabled === true) {
            cls += ' disabled';
        }
        if (properties.className) {
            cls += ' ' + properties.className;
        }
        cls += ' ' + datauniqid;
        return cls;
    }
    function cls(key) {
        var className = "aio-input-".concat(key);
        if (option) {
            className += " aio-input-".concat(type, "-option-").concat(key);
        }
        else {
            className += " aio-input-".concat(type, "-").concat(key);
        }
        return className;
    }
    function Text() {
        var text = properties.text, placeholder = properties.placeholder, subtext = properties.subtext, justify = properties.justify;
        if (text === undefined && placeholder !== undefined) {
            text = <div className='aio-input-placeholder'>{placeholder}</div>;
        }
        if (text !== undefined) {
            var p_1 = function (type) {
                return {
                    className: "".concat(cls(type)).concat(justify && !types.isInput ? ' aio-input-value-justify' : '')
                };
            };
            if (subtext) {
                return (<div className={"aio-input-content aio-input-".concat(type, "-content").concat(justify && !types.isInput ? ' aio-input-content-justify' : '')}>
                        <div {...p_1('value')}>{text}</div><div {...p_1('subtext')}>{subtext}</div>
                    </div>);
            }
            else {
                return <div {...p_1('value')}>{text}</div>;
            }
        }
        else {
            return <div style={{ flex: 1 }}></div>;
        }
    }
    function keyDown(e) {
        var code = e.keyCode;
        console.log(code);
        if (code === 13) {
            click(e, dom);
        }
    }
    function DragIcon() {
        if (!properties.draggable) {
            return null;
        }
        return (<svg viewBox="8 4 10 13" role="presentation" style={{ width: 12, height: '1.8rem' }}>
                <path d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z" style={{ fill: 'currentcolor' }}></path>
            </svg>);
    }
    function Caret() {
        if (!types.isDropdown || option || (types.isInput && !rootProps.options)) {
            return null;
        }
        var caret = rootProps.caret;
        if (caret === false) {
            return null;
        }
        return <div className='aio-input-caret'>{caret === undefined ? I('mdiChevronDown', .8) : caret}</div>;
    }
    function CheckIcon() {
        var checkIcon = properties.checkIcon, checked = properties.checked;
        if (checked === undefined) {
            return null;
        }
        var multiple = rootProps.multiple;
        if (Array.isArray(checkIcon)) {
            return checkIcon[checked ? 1 : 0];
        }
        if (!multiple && type === 'radio') {
            return (<div className={'aio-input-check-out aio-input-main-color' + (checked ? ' checked' : '')} style={__assign(__assign({}, checkIcon), { background: 'none' })}>
                    {checked && <div className={'aio-input-check-in aio-input-main-bg'} style={{ background: checkIcon.background }}></div>}
                </div>);
        }
        return (<div className={'aio-input-check-0 aio-input-main-color' + (checked ? ' checked' : '')} style={__assign(__assign({}, checkIcon), { background: 'none' })}>
                {checked && <div className='aio-input-main-bg'></div>}
            </div>);
    }
    function BeforeAfter(mode) {
        var res;
        if (mode === 'after' && type === 'password' && rootProps.preview) {
            res = <div className='aio-input-password-preview' onClick={function () { return setShowPassword(); }}>{I(showPassword ? 'mdiEyeOff' : 'mdiEye', .8)}</div>;
        }
        else {
            var v = properties[mode];
            res = typeof v === 'function' ? v() : v;
        }
        if (res === undefined) {
            return null;
        }
        return <div className={cls(mode)}>{res}</div>;
    }
    function Loading() {
        var loading = properties.loading;
        var elem;
        if (!loading) {
            return null;
        }
        else if (loading === true) {
            elem = I('mdiLoading', 0.8, { spin: .8 });
        }
        else {
            elem = loading;
        }
        return <div className={cls('loading')}>{elem}</div>;
    }
    function getProps() {
        var attrs = properties.attrs, disabled = properties.disabled, draggable = properties.draggable, style = properties.style;
        var zIndex;
        if (!!popup.getModals().length && !option && ['text', 'number', 'textarea'].indexOf(type) !== -1) {
            zIndex = 100000;
        }
        var onClick;
        //ممکنه این یک آپشن باشه باید دیزیبل پرنتش هم چک بشه تا دیزیبل بشه
        if (!disabled) {
            if (option === undefined) {
                onClick = function (e) { e.stopPropagation(); click(e, dom); };
            }
            else {
                onClick = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if ((props.properties || {}).onClick) {
                        props.properties.onClick();
                    }
                    else {
                        optionClick(option);
                    }
                };
            }
        }
        attrs = (0, aio_utils_1.AddToAttrs)(attrs, {
            className: getClassName(),
            style: __assign(__assign({}, style), { zIndex: zIndex })
        });
        var p = __assign(__assign({ tabIndex: option ? undefined : 1, onKeyDown: keyDown }, attrs), { onClick: onClick, ref: dom, disabled: disabled });
        var options = typeof rootProps.options === 'function' ? rootProps.options() : (rootProps.options || []);
        if (draggable) {
            p = __assign(__assign(__assign({}, p), DragOptions.getDragAttrs({ fromIndex: index || 0 })), DragOptions.getDropAttrs({ options: options, toIndex: index || 0 }));
        }
        if (index) {
            p['data-index'] = index;
        }
        return p;
    }
    function getProperties() {
        var p = props.properties || {};
        var obj = option || rootProps; //اگر آپشن بود از آپشن وگر نه از پروپس بخون مقادیر رو
        var _a = p.draggable, draggable = _a === void 0 ? option ? option.draggable : false : _a;
        var _b = p.placeholder, placeholder = _b === void 0 ? !option ? rootProps.placeholder : undefined : _b;
        var _c = p.checked, checked = _c === void 0 ? option ? option.checked : (type === 'checkbox' ? !!rootProps.value : undefined) : _c;
        var _d = p.disabled, disabled = _d === void 0 ? obj.disabled : _d;
        var _e = p.text, text = _e === void 0 ? obj.text : _e;
        var _f = p.subtext, subtext = _f === void 0 ? obj.subtext : _f;
        var _g = p.justify, justify = _g === void 0 ? obj.justify : _g;
        var _h = p.checkIcon, checkIcon = _h === void 0 ? obj.checkIcon === undefined ? {} : obj.checkIcon : _h;
        var _j = p.loading, loading = _j === void 0 ? obj.loading : _j;
        var _k = p.attrs, attrs = _k === void 0 ? obj.attrs || {} : _k;
        var style = __assign(__assign({}, (obj.style || {})), p.style);
        var _l = p.before, before = _l === void 0 ? obj.before : _l;
        var _m = p.after, after = _m === void 0 ? obj.after : _m;
        var _o = p.footer, footer = _o === void 0 ? obj.footer : _o;
        var classNames = [obj.className, p.className].filter(function (o) { return !!o; });
        var className = classNames.length ? classNames.join(' ') : undefined;
        return { disabled: disabled, draggable: draggable, text: text, subtext: subtext, placeholder: placeholder, justify: justify, checked: checked, checkIcon: checkIcon, loading: loading, attrs: attrs, style: style, before: before, after: after, className: className, footer: footer };
    }
    function getToggleIcon(open) {
        if (toggle === undefined) {
            return null;
        }
        if (option && Array.isArray(option.toggleIcon)) {
            if (open === false && !!option.toggleIcon[0]) {
                return option.toggleIcon[0];
            }
            if (open === true && !!option.toggleIcon[1]) {
                return option.toggleIcon[1];
            }
            if (open === undefined && !!option.toggleIcon[2]) {
                return option.toggleIcon[2];
            }
        }
        var path;
        if (open === undefined) {
            path = 'mdiCircleSmall';
        }
        else if (open === true) {
            path = 'mdiChevronDown';
        }
        else {
            path = 'mdiChevronRight';
        }
        return <div style={{ transform: rootProps.rtl ? "scaleX(-1)" : undefined }}>{I(path, 1)}</div>;
    }
    function Toggle(indent) {
        if (!option || option.toggleIcon === false) {
            return null;
        }
        if (toggle === undefined) {
            return null;
        }
        return (<div className="aio-input-toggle" onClick={function (e) { e.stopPropagation(); toggle === null || toggle === void 0 ? void 0 : toggle.action(); }}>
            <div className='aio-input-toggle-icon'>{getToggleIcon(toggle.state)}</div>
            {toggle.state === true &&
                <svg className='aio-input-toggle-line aio-input-indent-line'>
                    <path d={"M".concat(indent.size / 2, " ").concat(0, " L").concat(indent.size / 2, " ").concat(indent.height / 2 - 12, " Z")}></path>
                </svg>}
        </div>);
    }
    function indentIcon(indent, order) {
        var parentIndent = indent.parentIndent, size = indent.size, level = indent.level, isLastChild = indent.isLastChild, height = indent.height;
        if (!level) {
            return false;
        }
        var x0 = size / 2, x1 = size, y0 = 0, y1 = height / 2, y2 = height, pathes = [];
        if (order === level - 1) {
            //horizontal line
            pathes.push(<path key={'hl' + order} d={"M".concat(x0, " ").concat(y1, " L").concat(x1 * (rootProps.rtl ? -1 : 1), " ").concat(y1, " Z")}></path>);
            //vertical direct line
            pathes.push(<path key={'vdl' + order} d={"M".concat(x0, " ").concat(y0, " L").concat(x0, " ").concat(isLastChild ? y1 : y2, " Z")}></path>);
        }
        else {
            //vertical connet line
            if (!parentIndent || !parentIndent.isLastChild) {
                pathes.push(<path key={'vl' + order} d={"M".concat(x0, " ").concat(y0, " L").concat(x0, " ").concat(y2, " Z")}></path>);
            }
        }
        return (<svg className='aio-input-indent-line'>{pathes}</svg>);
    }
    function Indent() {
        if (!indent) {
            return null;
        }
        var level = indent.level;
        return (<div className="aio-input-indents">
                {(0, aio_utils_1.GetArray)(level, function (i) { return <div key={i} className={"aio-input-indent"}>{indentIcon(indent, i)}</div>; })}
                {!!toggle && Toggle(indent)}
            </div>);
    }
    function Label() {
        if (option) {
            return null;
        }
        var label = rootProps.label;
        if (!label) {
            return null;
        }
        var className = 'aio-input-label';
        var required = label[0] === '*';
        if (required) {
            className += ' aio-input-label-required';
        }
        var finalLabel = required ? label.slice(1, label.length) : label;
        return (<div className={className}>{finalLabel}</div>);
    }
    function getFooter() {
        if (option) {
            return null;
        }
        var text = '';
        if (properties.footer !== undefined) {
            text = properties.footer;
        }
        else if (error && rootProps.showErrors !== false) {
            text = error;
        }
        if (text !== undefined) {
            return (<div className='aio-input-footer'>{text}</div>);
        }
    }
    function startVoice() {
        recognition.start();
    }
    function voice() {
        if (!recognition) {
            return null;
        }
        return <div className='aio-input-voice' onClick={function () { return startVoice(); }}>{I('mdiMicrophoneOutline', 0.8)}</div>;
    }
    var properties = getProperties();
    var content = (<>
        {Indent()}
        {DragIcon()}
        {CheckIcon()}
        {Label()}
        {BeforeAfter('before')}
        {Text()}
        {BeforeAfter('after')}
        {Loading()}
        {voice()}
        {Caret()}
    </>);
    var p = getProps();
    if (type === 'file') {
        return (<label {...p}>{content}<InputFile /></label>);
    }
    return (<div {...p}>
            {content}
            {!!option && type === 'tabs' && <div className='aio-input-tabs-option-bar'></div>}
            {getFooter()}
        </div>);
};
function List() {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, options = _a.options;
    var _b = rootProps.attrs, attrs = _b === void 0 ? {} : _b, _c = rootProps.size, size = _c === void 0 ? 36 : _c, _d = rootProps.listOptions, listOptions = _d === void 0 ? { count: 3, editable: true, stop: 3, decay: 8 } : _d, _e = rootProps.onChange, onChange = _e === void 0 ? function () { } : _e;
    var _f = listOptions.count, count = _f === void 0 ? 3 : _f, _g = listOptions.editable, editable = _g === void 0 ? true : _g, _h = listOptions.stop, stop = _h === void 0 ? 3 : _h, _j = listOptions.decay, decay = _j === void 0 ? 8 : _j;
    var optionsLength = options.optionsList.length;
    var temp = (0, react_1.useState)({
        dom: (0, react_1.createRef)(),
        activeIndex: 0,
        interval: undefined,
        moved: false,
        lastY: 0,
        deltaY: 0,
        so: { y: 0, top: 0, limit: { top: 0, bottom: 0 } }
    })[0];
    function getStyle() {
        var height = count * (size);
        return { height: height };
    }
    function getIndexByTop(top) { return Math.round(((count * size) - size - (2 * top)) / (2 * size)); }
    function getTopByIndex(index) { return (count - 2 * index - 1) * size / 2; }
    function getContainerStyle() { return { top: getTopByIndex(temp.activeIndex) }; }
    function moveDown(e) {
        e.preventDefault();
        if (temp.activeIndex >= optionsLength - 1) {
            return;
        }
        temp.activeIndex++;
        var newTop = getTopByIndex(temp.activeIndex);
        setStyle({ top: newTop });
        setBoldStyle(temp.activeIndex);
    }
    function setBoldStyle(index) {
        (0, jquery_1.default)(temp.dom.current).find('.aio-input-list-option').removeClass('active');
        (0, jquery_1.default)(temp.dom.current).find('.aio-input-list-option[data-index=' + (index) + ']').addClass('active');
    }
    function moveUp() {
        if (temp.activeIndex <= 0) {
            return;
        }
        temp.activeIndex--;
        var newTop = getTopByIndex(temp.activeIndex);
        setStyle({ top: newTop });
        setBoldStyle(temp.activeIndex);
    }
    function keyDown(e) {
        if (!editable) {
            return;
        }
        if (e.keyCode === 38) {
            moveUp();
        }
        else if (e.keyCode === 40) {
            moveDown(e);
        }
    }
    function getLimit() { return { top: getTopByIndex(-1), bottom: getTopByIndex(optionsLength) }; }
    function getTrueTop(top) {
        var index = getIndexByTop(top);
        if (index < 0) {
            index = 0;
        }
        if (index > optionsLength - 1) {
            index = optionsLength - 1;
        }
        return getTopByIndex(index);
    }
    function mouseDown(e) {
        if (!editable) {
            return;
        }
        (0, aio_utils_1.EventHandler)('window', 'mousemove', mouseMove, 'bind');
        (0, aio_utils_1.EventHandler)('window', 'mouseup', mouseUp, 'bind');
        clearInterval(temp.interval);
        temp.moved = false;
        var client = (0, aio_utils_1.GetClient)(e);
        var y = client.y;
        setStyle({ transition: 'unset' });
        var top = getTop();
        var index = getIndexByTop(top);
        setBoldStyle(index);
        setStyle({ top: top, transition: 'unset' });
        onChange(options.optionsList[index].value, index);
        temp.so = { y: y, top: top, limit: getLimit() };
    }
    function getTop() {
        var top = parseInt((0, jquery_1.default)(temp.dom.current).find('.aio-input-list-options').css('top'));
        return getTrueTop(top);
    }
    function fixTop(value) {
        var _a = temp.so.limit, top = _a.top, bottom = _a.bottom;
        if (value > top) {
            return top;
        }
        if (value < bottom) {
            return bottom;
        }
        return value;
    }
    function mouseMove(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('move');
        temp.moved = true;
        var client = (0, aio_utils_1.GetClient)(e);
        var y = client.y;
        var offset = y - temp.so.y;
        if (temp.lastY === undefined) {
            temp.lastY = y;
        }
        temp.deltaY = y - temp.lastY;
        temp.lastY = y;
        if (Math.abs(offset) < 20) {
            temp.deltaY = 3;
        }
        var newTop = fixTop(temp.so.top + offset);
        var index = getIndexByTop(newTop);
        temp.so.newTop = newTop;
        setBoldStyle(index);
        setStyle({ top: newTop });
    }
    function setStyle(obj) { (0, jquery_1.default)(temp.dom.current).find('.aio-input-list-options').css(obj); }
    function mouseUp() {
        (0, aio_utils_1.EventHandler)('window', 'mousemove', mouseMove, 'unbind');
        (0, aio_utils_1.EventHandler)('window', 'mouseup', mouseUp, 'unbind');
        if (!temp.moved) {
            return;
        }
        temp.moved = false;
        move(temp.deltaY, temp.so.newTop);
    }
    function move(deltaY, startTop) {
        if (startTop === void 0) { startTop = getTop(); }
        if (decay < 0) {
            decay = 0;
        }
        if (decay > 99) {
            decay = 99;
        }
        decay = 1 + decay / 1000;
        temp.interval = setInterval(function () {
            startTop += deltaY;
            var index = getIndexByTop(startTop);
            setBoldStyle(index);
            if (Math.abs(deltaY) < stop || index < 0 || index > optionsLength - 1) {
                clearInterval(temp.interval);
                if (index < 0) {
                    index = 0;
                }
                if (index > optionsLength - 1) {
                    index = optionsLength - 1;
                }
                var top_1 = getTopByIndex(index);
                setStyle({ top: top_1, transition: '0.3s' });
                var option = options.optionsList[index];
                onChange(option.value, option.details);
                return;
            }
            deltaY /= decay;
            setStyle({ top: startTop });
        }, 20);
    }
    (0, react_1.useEffect)(function () { var _a; if ((_a = rootProps.listOptions) === null || _a === void 0 ? void 0 : _a.move) {
        rootProps.listOptions.move(move);
    } }, []);
    (0, react_1.useEffect)(function () {
        setBoldStyle(temp.activeIndex);
    });
    var fixedOptions = options.optionsList.map(function (o, i) {
        if (o.value === rootProps.value) {
            temp.activeIndex = i;
        }
        return (<Layout key={i} option={o} index={i} properties={{
                style: { height: size },
                justify: true
            }}/>);
    });
    return (<div {...attrs} ref={temp.dom} tabIndex={0} onKeyDown={function (e) { return keyDown(e); }} className={'aio-input-list' + (attrs.className ? ' ' + attrs.className : '')} style={__assign(__assign({}, attrs.style), getStyle())}>
            <div className='aio-input-list-options' style={getContainerStyle()} onMouseDown={function (e) { return mouseDown(e); }} onTouchStart={function (e) { return mouseDown(e); }}>{fixedOptions}</div>
        </div>);
}
var AcardionContext = (0, react_1.createContext)({});
var Acardion = function () {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, options = _a.options;
    var multiple = rootProps.multiple, _b = rootProps.vertical, vertical = _b === void 0 ? true : _b, value = rootProps.value;
    function isOpen(id) {
        if (!multiple) {
            return id === value;
        }
        else {
            return (value || []).indexOf(id) !== -1;
        }
    }
    function getContext() {
        var context = {
            rootProps: rootProps,
            isOpen: isOpen
        };
        return context;
    }
    return (<AcardionContext.Provider value={getContext()}>
            <div className={"aio-input-acardion aio-input-scroll".concat(vertical ? ' aio-input-acardion-vertical' : ' aio-input-acardion-horizontal')}>
                {options.optionsList.map(function (option, i) { return <AcardionItem key={i} option={option}/>; })}
            </div>
        </AcardionContext.Provider>);
};
exports.Acardion = Acardion;
var AcardionItem = function (_a) {
    var option = _a.option;
    var active = !!option.details.active;
    var timeout = (0, react_1.useState)()[0];
    var Attrs = (0, aio_utils_1.AddToAttrs)(option.attrs, { className: "aio-input-acardion-item" });
    return (<div {...Attrs}>
            <Layout option={option}/>
            {!!active && <AcardionBody option={option}/>}
        </div>);
};
var AcardionBody = function (_a) {
    var option = _a.option;
    var rootProps = (0, react_1.useContext)(AcardionContext).rootProps;
    var _b = rootProps.body, body = _b === void 0 ? function () { } : _b;
    var _c = body(option.details) || { html: '' }, html = _c.html, attrs = _c.attrs;
    var Attrs = (0, aio_utils_1.AddToAttrs)(attrs, { className: ["aio-input-acardion-body"] });
    return <div {...Attrs}>{html}</div>;
};
var TreeContext = (0, react_1.createContext)({});
var Tree = function () {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, types = _a.types;
    var onAdd = rootProps.onAdd, onRemove = rootProps.onRemove, _b = rootProps.value, value = _b === void 0 ? [] : _b, onChange = rootProps.onChange, _c = rootProps.size, size = _c === void 0 ? Def('tree-size') : _c, attrs = rootProps.attrs;
    var _d = (0, react_1.useState)({}), openDic = _d[0], setOpenDic = _d[1];
    var _e = (0, react_1.useState)({}), mountedDic = _e[0], setMountedDic = _e[1];
    var indent = (0, react_1.useState)(getIndent)[0];
    function SetMounted(id) {
        var _a;
        setMountedDic(__assign(__assign({}, mountedDic), (_a = {}, _a[id] = !mountedDic[id], _a)));
    }
    function SetOpen(id) {
        var _a;
        setOpenDic(__assign(__assign({}, openDic), (_a = {}, _a[id] = !openDic[id], _a)));
    }
    function getIndent() {
        var _a = rootProps.indent, indent = _a === void 0 ? 24 : _a;
        if (typeof indent !== 'number') {
            indent = 12;
        }
        indent = Math.round(indent / 6) * 6;
        if (indent < 0) {
            indent = 0;
        }
        if (indent > 60) {
            indent = 60;
        }
        return indent;
    }
    function toggle(id) {
        var open = !!openDic[id], time = 300;
        if (!open) {
            SetOpen(id);
            setTimeout(function () { return SetMounted(id); }, 0);
        }
        else {
            SetMounted(id);
            setTimeout(function () { return SetOpen(id); }, time);
        }
    }
    (0, react_1.useEffect)(function () {
        if (rootProps.toggleRef) {
            rootProps.toggleRef.current = function (id) { return toggle(id); };
        }
    }, [toggle]);
    (0, react_1.useEffect)(function () {
        if (rootProps.onToggle) {
            rootProps.onToggle(openDic);
        }
    }, [openDic]);
    function change(row, newRow) {
        for (var prop in newRow) {
            row[prop] = newRow[prop];
        }
        if (rootProps.onChange) {
            rootProps.onChange(rootProps.value);
        }
    }
    function getChilds(p) {
        var row = p.row, details = p.details;
        var childs = [];
        try {
            if (rootProps.getChilds) {
                childs = rootProps.getChilds({ row: row, details: details });
            }
            else {
                childs = row.childs || [];
            }
        }
        catch (_a) {
            childs = [];
        }
        return childs || [];
    }
    function setChilds(p) {
        var row = p.row, childs = p.childs;
        try {
            if (rootProps.setChilds) {
                rootProps.setChilds(p);
            }
            else {
                row.childs = childs;
            }
        }
        catch (_a) { }
    }
    function add(p) {
        return __awaiter(this, void 0, void 0, function () {
            var newRow, parentChilds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof onAdd === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, onAdd(p)];
                    case 1:
                        newRow = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        newRow = onAdd;
                        _a.label = 3;
                    case 3:
                        if (!newRow) {
                            return [2 /*return*/];
                        }
                        if (p) {
                            parentChilds = getChilds({ row: p.parent, details: p.parentDetails });
                            setChilds({ row: p.parent, childs: parentChilds.concat(newRow), details: p.parentDetails });
                        }
                        else {
                            value.push(newRow);
                        }
                        if (onChange) {
                            onChange(value);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function remove(p) {
        return __awaiter(this, void 0, void 0, function () {
            var index, res, details, parentChilds, newChilds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = p.index;
                        if (!(typeof onRemove === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, onRemove(p)];
                    case 1:
                        res = (_a.sent());
                        return [3 /*break*/, 3];
                    case 2:
                        res = true;
                        _a.label = 3;
                    case 3:
                        if (!res) {
                            return [2 /*return*/];
                        }
                        details = { index: index, active: false, toggle: function () { } };
                        if (!p.parent) {
                            value = value.filter(function (o) {
                                var rowValue = GetOptionProps({ key: 'value', rootProps: rootProps, optionDetails: __assign(__assign({}, details), { option: p.row, rootProps: rootProps }) });
                                var oValue = GetOptionProps({ key: 'value', rootProps: rootProps, optionDetails: __assign(__assign({}, details), { option: o, rootProps: rootProps }) });
                                return rowValue !== oValue;
                            });
                        }
                        else {
                            parentChilds = getChilds({ row: p.parent, details: p.parentDetails });
                            newChilds = parentChilds.filter(function (o) {
                                var rowValue = GetOptionProps({ key: 'value', rootProps: rootProps, optionDetails: __assign(__assign({}, details), { option: p.row, rootProps: rootProps }) });
                                var oValue = GetOptionProps({ key: 'value', rootProps: rootProps, optionDetails: __assign(__assign({}, details), { option: o, rootProps: rootProps }) });
                                return rowValue !== oValue;
                            });
                            setChilds({ row: p.parent, details: p.parentDetails, childs: newChilds });
                        }
                        if (onChange) {
                            onChange(value);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function getContext() { return { toggle: toggle, rootProps: rootProps, mountedDic: mountedDic, openDic: openDic, add: add, remove: remove, types: types, indent: indent, size: size, change: change, getChilds: getChilds }; }
    var Attrs = (0, aio_utils_1.AddToAttrs)(attrs, { className: ['aio-input-tree', rootProps.className], style: rootProps.style });
    return (<TreeContext.Provider value={getContext()}>
            <div {...Attrs}><TreeHeader /><TreeBody rows={value} level={0}/></div>
        </TreeContext.Provider>);
};
var TreeHeader = function () {
    var _a = (0, react_1.useContext)(TreeContext), rootProps = _a.rootProps, add = _a.add;
    var _b = rootProps.addText, addText = _b === void 0 ? 'add' : _b, onAdd = rootProps.onAdd;
    if (!onAdd) {
        return null;
    }
    addText = (typeof addText === 'function' ? addText('header') : addText) || 'add';
    return (<div className="aio-input-tree-header"><button onClick={function () { return add(); }}>{I('mdiPlusThick', .8)}{addText}</button></div>);
};
var TreeActions = function (props) {
    var row = props.row, index = props.index, parent = props.parent, rowDetails = props.rowDetails, parentDetails = props.parentDetails;
    var _a = (0, react_1.useContext)(TreeContext), rootProps = _a.rootProps, add = _a.add, remove = _a.remove;
    var onAdd = rootProps.onAdd, onRemove = rootProps.onRemove, _b = rootProps.removeText, removeText = _b === void 0 ? 'Remove' : _b;
    var addText = (typeof rootProps.addText === 'function' ? rootProps.addText(row) : rootProps.addText) || 'Add';
    var options = typeof rootProps.actions === 'function' ? rootProps.actions(row, parent) : rootProps.actions;
    function getOptions() {
        var res = [];
        if (onAdd) {
            res.push({ text: addText, value: 'add', before: I('mdiPlusThick', 0.7), onClick: function () { return add({ parent: row, parentDetails: rowDetails }); } });
        }
        var Options = (options || []).map(function (o) { return __assign(__assign({}, o), { onClick: function () { if (o.onClick) {
                o.onClick(row, parent);
            } } }); });
        res = __spreadArray(__spreadArray([], res, true), Options, true);
        if (onRemove) {
            res.push({ text: removeText, value: 'remove', before: I('mdiDelete', 0.7), onClick: function () { return remove({ row: row, index: index, parent: parent, parentDetails: parentDetails }); } });
        }
        return res;
    }
    var Options = getOptions();
    if (!Options.length) {
        return null;
    }
    var p = { type: 'select', caret: false, popover: { limitTo: '.aio-input-tree' }, className: 'aio-input-tree-options-button', options: Options, text: I('mdiDotsHorizontal', 0.7) };
    return <AIOInput {...p}/>;
};
var TreeBody = function (props) {
    var _a = (0, react_1.useContext)(TreeContext), rootProps = _a.rootProps, types = _a.types, openDic = _a.openDic, mountedDic = _a.mountedDic, indent = _a.indent, size = _a.size, change = _a.change, getChilds = _a.getChilds, toggle = _a.toggle;
    var rows = props.rows, level = props.level, parent = props.parent, parentId = props.parentId, parentIndent = props.parentIndent, parentDetails = props.parentDetails;
    var parentOpen = parentId === undefined ? true : !!openDic[parentId];
    var mounted = parentId == undefined ? true : mountedDic[parentId];
    var onAdd = rootProps.onAdd, onRemove = rootProps.onRemove, actions = rootProps.actions;
    var optionsList = GetOptions({
        rootProps: rootProps,
        types: types,
        options: rows,
        level: level,
        isOpen: function (id) { return !!openDic[id]; },
        change: function (row, newRow) { return change(row, newRow); },
    }).optionsList;
    if (!!onAdd || !!onRemove || !!actions) {
        optionsList = optionsList.map(function (o) {
            var _a = o.details, index = _a.index, _b = _a.level, level = _b === void 0 ? 0 : _b, option = _a.option;
            var isFirstChild = index === 0;
            var isLastChild = index === rows.length - 1;
            var details = { index: index, level: level, isFirstChild: isFirstChild, isLastChild: isLastChild };
            var after = <TreeActions row={option} index={index} parent={parent} rowDetails={details} parentDetails={parentDetails}/>;
            return __assign(__assign({}, o), { after: after });
        });
    }
    function getClassName() {
        var className = 'aio-input-tree-body';
        if (!parent) {
            className += ' aio-input-tree-root';
        }
        if (parentOpen) {
            className += ' open';
        }
        className += !mounted ? ' not-mounted' : ' mounted';
        className += " aio-input-tree-body-level-".concat(level);
        return className;
    }
    return (<div className={getClassName()}>
            {optionsList.map(function (option, index) {
            var row = rows[index];
            var id = option.value;
            var details = { level: level, index: index, isLastChild: index === optionsList.length - 1, isFirstChild: index === 0 };
            var childs = getChilds({ row: row, details: details });
            var open = !!openDic[id];
            var item = {
                row: row,
                option: option,
                parent: parent,
                parentId: parentId,
                id: id,
                parentOpen: parentOpen,
                open: open,
                details: details,
                indent: __assign({ height: size, childsLength: childs.length, size: indent, parentIndent: parentIndent }, details)
            };
            var p = { className: "aio-input-tree-row" };
            return <div {...p} key={id}><TreeRow item={item}/><TreeChilds item={item}/></div>;
        })}
        </div>);
};
var TreeRow = function (props) {
    var _a = (0, react_1.useContext)(TreeContext), openDic = _a.openDic, getChilds = _a.getChilds, toggle = _a.toggle;
    var item = props.item;
    var childs = getChilds(item);
    var open = !childs.length ? undefined : (!!openDic[item.id] ? true : false);
    var p = {
        indent: item.indent,
        option: item.option,
        toggle: { state: open, action: function () { return toggle(item.id); } }
    };
    return <Layout {...p}/>;
};
var TreeChilds = function (props) {
    var getChilds = (0, react_1.useContext)(TreeContext).getChilds;
    var _a = props.item, row = _a.row, id = _a.id, open = _a.open, indent = _a.indent, details = _a.details, childs = getChilds(props.item);
    if (!open || !childs || !childs.length) {
        return null;
    }
    return <TreeBody rows={childs} level={indent.level + 1} parent={row} parentId={id} parentIndent={indent} parentDetails={details}/>;
};
var DPContext = (0, react_1.createContext)({});
function Calendar(props) {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, DATE = _a.DATE;
    var onClose = props.onClose;
    var multiple = rootProps.multiple, _b = rootProps.unit, unit = _b === void 0 ? Def('date-unit') : _b, jalali = rootProps.jalali, value = rootProps.value, disabled = rootProps.disabled, _c = rootProps.size, size = _c === void 0 ? 12 : _c, _d = rootProps.theme, theme = _d === void 0 ? Def('theme') : _d, translate = rootProps.translate, _e = rootProps.onChange, onChange = _e === void 0 ? function () { } : _e, _f = rootProps.option, option = _f === void 0 ? {} : _f;
    var months = (0, react_1.useState)(DATE.getMonths(jalali))[0];
    var today = (0, react_1.useState)(DATE.getToday(jalali))[0];
    var todayWeekDay = (0, react_1.useState)(DATE.getWeekDay(today).weekDay)[0];
    var thisMonthString = (0, react_1.useState)(months[today[1] - 1])[0];
    var _g = (0, react_1.useState)(getActiveDate), activeDate = _g[0], setActiveDate = _g[1];
    var _h = (0, react_1.useState)(null), popup = _h[0], setPopup = _h[1];
    function getDate() {
        var date;
        if (multiple) {
            date = value.length ? value[value.length - 1] : undefined;
        }
        else {
            date = value;
        }
        return date;
    }
    function getActiveDate() {
        var date = getDate();
        date = !date || date === null ? today : date;
        var _a = DATE.convertToArray(date), year = _a[0], month = _a[1], day = _a[2];
        return { year: year, month: month, day: day };
    }
    var adRef = (0, react_1.useRef)(activeDate);
    adRef.current = activeDate;
    function trans(text) {
        if (translate) {
            var res_1 = translate(text);
            if (res_1) {
                return res_1;
            }
        }
        if (text === 'Today') {
            if (unit === 'month') {
                text = 'This Month';
            }
            else if (unit === 'hour') {
                text = 'This Hour';
            }
        }
        var obj = { 'Clear': 'حذف', 'This Hour': 'ساعت کنونی', 'Today': 'امروز', 'This Month': 'ماه جاری', 'Select Year': 'انتخاب سال', 'Close': 'بستن' };
        var res;
        if (jalali && obj[text]) {
            res = obj[text];
        }
        return res;
    }
    function changePopup(popup) {
        setPopup(popup);
    }
    function changeActiveDate(obj) {
        var newActiveDate;
        if (obj === 'today') {
            var year = today[0], month = today[1], day = today[2];
            newActiveDate = { year: year, month: month, day: unit === 'month' ? 1 : day };
        }
        else {
            newActiveDate = __assign(__assign({}, activeDate), obj);
        }
        setActiveDate(newActiveDate);
    }
    function getPopupStyle() {
        return {
            fontSize: size, background: theme[1], color: theme[0], stroke: theme[0],
            cursor: disabled === true ? 'not-allowed' : undefined,
        };
    }
    function getSplitter() {
        var date = getDate();
        return typeof date === 'string' ? DATE.getSplitter(date) : '/';
    }
    function getContext() {
        var context = {
            changeActiveDate: changeActiveDate,
            DATE: DATE,
            changePopup: changePopup,
            translate: trans,
            rootProps: rootProps,
            activeDate: adRef.current,
            today: today,
            todayWeekDay: todayWeekDay,
            thisMonthString: thisMonthString,
            months: months,
            onChange: function (p) {
                var _a = p.year, year = _a === void 0 ? 1000 : _a, _b = p.month, month = _b === void 0 ? 1 : _b, _c = p.day, day = _c === void 0 ? 1 : _c, _d = p.hour, hour = _d === void 0 ? 0 : _d;
                var dateArray = [year, month, day, hour];
                var jalaliDateArray = !jalali ? DATE.toJalali(dateArray) : dateArray;
                var gregorianDateArray = jalali ? DATE.toGregorian(dateArray) : dateArray;
                var _e = unit === 'month' ? { weekDay: '', index: 0 } : DATE.getWeekDay(dateArray), weekDay = _e.weekDay, weekDayIndex = _e.index;
                var get2digit = function (v) {
                    if (v === undefined) {
                        return;
                    }
                    var vn = v.toString();
                    return vn.length === 1 ? "0".concat(vn) : vn;
                };
                var dateString = '';
                var splitter = getSplitter();
                if (unit === 'month') {
                    dateString = "".concat(year).concat(splitter).concat(get2digit(month));
                }
                else if (unit === 'day') {
                    dateString = "".concat(year).concat(splitter).concat(get2digit(month)).concat(splitter).concat(get2digit(day));
                }
                else if (unit === 'hour') {
                    dateString = "".concat(year).concat(splitter).concat(get2digit(month)).concat(splitter).concat(get2digit(day)).concat(splitter).concat(get2digit(hour));
                }
                var monthString = months[month - 1];
                var jalaliMonthString = !jalali ? DATE.getMonths(true)[month - 1] : monthString;
                var gregorianMonthString = jalali ? DATE.getMonths(false)[month - 1] : monthString;
                var props = {
                    months: months,
                    jalaliDateArray: jalaliDateArray,
                    gregorianDateArray: gregorianDateArray,
                    dateArray: dateArray,
                    weekDay: weekDay,
                    weekDayIndex: weekDayIndex,
                    dateString: dateString,
                    year: year,
                    month: month,
                    day: day,
                    hour: hour,
                    monthString: monthString,
                    jalaliMonthString: jalaliMonthString,
                    gregorianMonthString: gregorianMonthString
                };
                var newValue, index = 0;
                if (multiple) {
                    var current = [];
                    if (value) {
                        if (!Array.isArray(value)) {
                            current = [value];
                        }
                        else {
                            current = __spreadArray([], value, true);
                        }
                    }
                    else {
                        current = [];
                    }
                    var index_1 = current.indexOf(dateString);
                    if (index_1 === -1) {
                        newValue = __spreadArray(__spreadArray([], current, true), [dateString], false);
                    }
                    else {
                        newValue = current.filter(function (o) { return o !== dateString; });
                    }
                    if (typeof multiple === 'number') {
                        while (newValue.length > multiple) {
                            newValue = newValue.slice(1, newValue.length);
                        }
                    }
                    index_1 = newValue.length - 1;
                }
                else {
                    index = 0;
                    newValue = dateString;
                }
                onChange(newValue, props);
                if (onClose) {
                    if (typeof option.close === 'function') {
                        if (option.close({ option: undefined, index: index, rootProps: rootProps })) {
                            onClose();
                        }
                    }
                }
            }
        };
        return context;
    }
    return (<DPContext.Provider value={getContext()}>
            <div className='aio-input-date-container' style={{ display: 'flex', fontSize: size }}>
                <div className='aio-input-date-calendar aio-input-theme-bg1 aio-input-theme-color0 aio-input-theme-stroke0' style={getPopupStyle()}>
                    <DPHeader /><DPBody /><DPFooter />
                </div>
                <DPToday />
            </div>
            {popup}
        </DPContext.Provider>);
}
exports.Calendar = Calendar;
function DPToday() {
    var _a = (0, react_1.useContext)(DPContext), rootProps = _a.rootProps, translate = _a.translate, today = _a.today, todayWeekDay = _a.todayWeekDay, thisMonthString = _a.thisMonthString;
    var _b = rootProps.theme, theme = _b === void 0 ? Def('theme') : _b, jalali = rootProps.jalali, _c = rootProps.unit, unit = _c === void 0 ? Def('date-unit') : _c;
    return (<div className='aio-input-date-today aio-input-theme-color1 aio-input-theme-bg0' style={{ color: theme[1], background: theme[0] }}>
            <div className='aio-input-date-today-label'>{translate('Today')}</div>
            {unit !== 'month' && <div className='aio-input-date-today-weekday'>{!jalali ? todayWeekDay.slice(0, 3) : todayWeekDay}</div>}
            {unit !== 'month' && <div className='aio-input-date-today-day'>{today[2]}</div>}
            <div className='aio-input-date-today-month'>{!jalali ? thisMonthString.slice(0, 3) : thisMonthString}</div>
            <div className='aio-input-date-today-year'>{today[0]}</div>
            {unit === 'hour' && <div className='aio-input-date-today-year'>{today[3] + ':00'}</div>}
        </div>);
}
function DPFooter() {
    var _a = (0, react_1.useContext)(DPContext), rootProps = _a.rootProps, changeActiveDate = _a.changeActiveDate, translate = _a.translate;
    var disabled = rootProps.disabled, _b = rootProps.onChange, onChange = _b === void 0 ? function () { } : _b, deSelect = rootProps.deSelect, multiple = rootProps.multiple, _c = rootProps.now, now = _c === void 0 ? true : _c;
    if (disabled) {
        return null;
    }
    var buttonClassName = 'aio-input-theme-color0';
    function clear() {
        if (typeof deSelect === 'function') {
            deSelect();
        }
        else {
            onChange(multiple ? [] : undefined);
        }
    }
    return (<div className='aio-input-date-footer'>
            {!!deSelect && <button onClick={function () { return clear(); }} className={buttonClassName}>{translate('Clear')}</button>}
            {!!now && <button onClick={function () { return changeActiveDate('today'); }} className={buttonClassName}>{translate('Today')}</button>}
        </div>);
}
function DPBody() {
    var _a = (0, react_1.useContext)(DPContext), rootProps = _a.rootProps, activeDate = _a.activeDate;
    var _b = rootProps.unit, unit = _b === void 0 ? Def('date-unit') : _b, jalali = rootProps.jalali;
    function getClassName() {
        var res = 'aio-input-date-body';
        res += " aio-input-date-body-".concat(unit);
        res += " aio-input-date-".concat(jalali ? 'rtl' : 'ltr');
        //var columnCount = { hour: 4, day: 7, month: 3, year: 1 }[unit as AI_date_unit];
        //var rowCount = { hour: 6, day: 7, month: 4, year: 1 }[unit as AI_date_unit];
        return res;
    }
    return (<div className={getClassName()}>
            {unit === 'hour' && (0, aio_utils_1.GetArray)(24, function (i) { return <DPCell key={'cell' + i} dateArray={[activeDate.year, activeDate.month, activeDate.day, i]}/>; })}
            {unit === 'day' && <DPBodyDay />}
            {unit === 'month' && (0, aio_utils_1.GetArray)(12, function (i) { return <DPCell key={'cell' + i} dateArray={[activeDate.year, i + 1]}/>; })}
        </div>);
}
function DPBodyDay() {
    var _a = (0, react_1.useContext)(DPContext), rootProps = _a.rootProps, activeDate = _a.activeDate, DATE = _a.DATE;
    var _b = rootProps.theme, theme = _b === void 0 ? Def('theme') : _b, jalali = rootProps.jalali;
    var firstDayWeekDayIndex = DATE.getWeekDay([activeDate.year, activeDate.month, 1]).index;
    var daysLength = DATE.getMonthDaysLength([activeDate.year, activeDate.month]);
    var weekDays = DATE.getWeekDays(jalali);
    return (<>
        {weekDays.map(function (weekDay, i) { return <DPCellWeekday key={'weekday' + i} weekDay={weekDay}/>; })}
        {(0, aio_utils_1.GetArray)(firstDayWeekDayIndex, function (i) { return <div key={'space' + i} className='aio-input-date-space aio-input-date-cell aio-input-theme-bg1' style={{ background: theme[1] }}></div>; })}
        {(0, aio_utils_1.GetArray)(daysLength, function (i) { return <DPCell key={'cell' + i} dateArray={[activeDate.year || 0, activeDate.month || 0, i + 1]}/>; })}
        {(0, aio_utils_1.GetArray)(42 - (firstDayWeekDayIndex + daysLength), function (i) { return <div key={'endspace' + i} className='aio-input-date-space aio-input-date-cell aio-input-theme-bg1' style={{ background: theme[1] }}></div>; })}
    </>);
}
var DPCellWeekday = function (props) {
    var _a = (0, react_1.useContext)(DPContext), rootProps = _a.rootProps, translate = _a.translate;
    var _b = rootProps.theme, theme = _b === void 0 ? Def('theme') : _b, jalali = rootProps.jalali;
    var weekDay = props.weekDay;
    return (<div className='aio-input-date-weekday aio-input-date-cell aio-input-theme-bg1 aio-input-theme-color0' style={{ background: theme[1], color: theme[0] }}>
            <span>{translate(weekDay.slice(0, !jalali ? 2 : 1))}</span>
        </div>);
};
function DPCell(props) {
    var _a = (0, react_1.useContext)(DPContext), rootProps = _a.rootProps, translate = _a.translate, onChange = _a.onChange, DATE = _a.DATE;
    var disabled = rootProps.disabled, dateAttrs = rootProps.dateAttrs, _b = rootProps.theme, theme = _b === void 0 ? Def('theme') : _b, value = rootProps.value, jalali = rootProps.jalali, _c = rootProps.unit, unit = _c === void 0 ? Def('date-unit') : _c, multiple = rootProps.multiple;
    var dateArray = props.dateArray;
    function IsActive() {
        if (multiple) {
            return !value.length ? false : !!value.find(function (o) { return DATE.isEqual(dateArray, o); });
        }
        else {
            return !value ? false : DATE.isEqual(dateArray, value);
        }
    }
    function getClassName(isActive, isToday, isDisabled, className) {
        var str = 'aio-input-date-cell';
        if (isDisabled) {
            str += ' aio-input-date-disabled';
        }
        if (isActive) {
            str += ' aio-input-date-active aio-input-theme-bg0 aio-input-theme-color1';
        }
        else {
            str += ' aio-input-theme-bg1 aio-input-theme-color0';
        }
        if (isToday) {
            str += ' today aio-input-theme-border0';
        }
        if (className) {
            str += ' className';
        }
        return str;
    }
    var isActive = IsActive();
    var isToday = DATE.isEqual(dateArray, DATE.getToday(jalali));
    var isFuture = DATE.isGreater(dateArray, DATE.getToday(jalali));
    var Attrs = {};
    if (dateAttrs) {
        var weekDay = null, weekDayIndex = null, monthString = '';
        if (rootProps.unit === 'day') {
            var a = DATE.getWeekDay(dateArray);
            weekDay = a.weekDay;
            weekDayIndex = a.index;
        }
        else if (rootProps.unit === 'month') {
            var months = DATE.getMonths(jalali);
            monthString = months[dateArray[1] - 1];
        }
        Attrs = dateAttrs({ dateArray: dateArray, isToday: isToday, isActive: isActive, isFuture: isFuture, weekDayIndex: weekDayIndex, weekDay: weekDay, monthString: monthString });
        Attrs = Attrs || {};
    }
    var isDisabled = disabled === true || Attrs.disabled === true;
    var className = getClassName(isActive, isToday, isDisabled, Attrs.className);
    var onClick = isDisabled ? undefined : function () { onChange({ year: dateArray[0], month: dateArray[1], day: dateArray[2], hour: dateArray[3] }); };
    var style = {};
    if (!isDisabled) {
        style.background = theme[1];
    }
    if (className.indexOf('aio-input-date-active') !== -1) {
        style.background = theme[0];
        style.color = theme[1];
    }
    if (className.indexOf('today') !== -1) {
        style.border = "1px solid ".concat(theme[0]);
    }
    style = __assign(__assign({}, style), Attrs.style);
    var text;
    if (unit === 'hour') {
        text = dateArray[3] + ':00';
    }
    else if (unit === 'day') {
        text = dateArray[2];
    }
    else if (unit === 'month') {
        var months = DATE.getMonths(jalali);
        text = translate(!jalali ? months[dateArray[1] - 1].slice(0, 3) : months[dateArray[1] - 1]);
    }
    return <div style={style} onClick={onClick} className={className}>{isDisabled ? <del>{text}</del> : text}</div>;
}
function DPHeaderItem(props) {
    var unit = props.unit;
    var _a = (0, react_1.useContext)(DPContext), rootProps = _a.rootProps, activeDate = _a.activeDate, months = _a.months, changePopup = _a.changePopup;
    var _b = rootProps.theme, theme = _b === void 0 ? Def('theme') : _b, jalali = rootProps.jalali;
    if (!activeDate || !activeDate[unit]) {
        return null;
    }
    var text = unit === 'year' ? activeDate.year : months[activeDate[unit] - 1].substring(0, jalali ? 10 : 3);
    return (<button type='button' className="aio-input-date-dropdown aio-input-theme-color0" onClick={function () { return changePopup(<DPHeaderPopup onClose={function () { return changePopup(null); }} unit={unit}/>); }}>{text}</button>);
}
var DPHeaderPopup = function (props) {
    var onClose = props.onClose, unit = props.unit;
    var _a = (0, react_1.useContext)(DPContext), rootProps = _a.rootProps, DATE = _a.DATE, translate = _a.translate, activeDate = _a.activeDate, changeActiveDate = _a.changeActiveDate;
    var jalali = rootProps.jalali, _b = rootProps.theme, theme = _b === void 0 ? Def('theme') : _b;
    var months = (0, react_1.useState)(DATE.getMonths(jalali))[0];
    var _c = (0, react_1.useState)(Math.floor(activeDate.year / 10) * 10), start = _c[0], setStart = _c[1];
    var _d = (0, react_1.useState)(activeDate.year), year = _d[0], setYear = _d[1];
    var _e = (0, react_1.useState)(activeDate.month), month = _e[0], setMonth = _e[1];
    (0, react_1.useEffect)(function () {
        setYear(activeDate.year);
        setMonth(activeDate.month);
    }, [activeDate.year, activeDate.month]);
    function changeValue(v) {
        if (unit === 'year') {
            setYear(v);
            changeActiveDate({ year: v });
        }
        else {
            setMonth(v);
            changeActiveDate({ month: v });
        }
        onClose();
    }
    function changePage(dir) {
        var newStart = start + (dir * 10);
        setStart(newStart);
    }
    function getCells() {
        var cells = [];
        if (unit === 'year') {
            var _loop_1 = function (i) {
                var active = i === year;
                var className = 'aio-input-date-cell';
                if (active) {
                    className += ' aio-input-date-active aio-input-theme-bg0 aio-input-theme-color1';
                }
                else {
                    className += ' aio-input-theme-bg1 aio-input-theme-color0';
                }
                var p = { style: active ? { background: theme[0], color: theme[1] } : { background: theme[1], color: theme[0] }, className: className, onClick: function () { return changeValue(i); } };
                cells.push(<div {...p} key={i}>{i}</div>);
            };
            for (var i = start; i < start + 10; i++) {
                _loop_1(i);
            }
        }
        else {
            var _loop_2 = function (i) {
                var active = i === month;
                var className = 'aio-input-date-cell';
                if (active) {
                    className += ' aio-input-date-active aio-input-theme-bg0 aio-input-theme-color1';
                }
                else {
                    className += ' aio-input-theme-bg1 aio-input-theme-color0';
                }
                var p = { style: active ? { background: theme[0], color: theme[1] } : { background: theme[1], color: theme[0] }, className: className, onClick: function () { return changeValue(i); } };
                cells.push(<div {...p} key={i}>{months[i - 1]}</div>);
            };
            for (var i = 1; i <= 12; i++) {
                _loop_2(i);
            }
        }
        return cells;
    }
    function header_node() {
        if (unit !== 'year') {
            return null;
        }
        return (<div className='aio-input-date-popup-header'>
                <DPArrow type='minus' onClick={function () { return changePage(-1); }}/>
                <div className='aio-input-date-popup-label'>{translate('Select Year')}</div>
                <DPArrow type='plus' onClick={function () { return changePage(1); }}/>
            </div>);
    }
    function body_node() { return <div className='aio-input-date-popup-body'>{getCells()}</div>; }
    function footer_node() {
        return (<div className='aio-input-date-popup-footer'>
                <button className='aio-input-theme-bg0 aio-input-theme-color1' onClick={function () { return onClose(); }}>{translate('Close')}</button>
            </div>);
    }
    return (<div style={{ background: theme[0], color: theme[1] }} className={'aio-input-date-popup' + (jalali ? ' aio-input-date-rtl' : ' aio-input-date-ltr')}>{header_node()}{body_node()}{footer_node()}</div>);
};
function DPHeader() {
    var _a = (0, react_1.useContext)(DPContext), rootProps = _a.rootProps, activeDate = _a.activeDate, changeActiveDate = _a.changeActiveDate, DATE = _a.DATE;
    var _b = rootProps.unit, unit = _b === void 0 ? Def('date-unit') : _b;
    function getDays() {
        if (!activeDate || !activeDate.year || !activeDate.month) {
            return null;
        }
        var daysLength = DATE.getMonthDaysLength([activeDate.year, activeDate.month]);
        var options = (0, aio_utils_1.GetArray)(daysLength, function (i) { return ({ text: (i + 1).toString(), value: i + 1 }); });
        var p = { value: activeDate.day, options: options, onChange: function (day) { return changeActiveDate({ day: day }); } };
        return <DPHeaderDropdown {...p}/>;
    }
    return (<div className='aio-input-date-header'>
            <DPArrow type='minus'/>
            <div className='aio-input-date-select'>
                <DPHeaderItem unit='year'/>
                {unit !== 'month' ? <DPHeaderItem unit='month'/> : null}
                {unit === 'hour' ? getDays() : null}
            </div>
            <DPArrow type='plus'/>
        </div>);
}
function DPHeaderDropdown(props) {
    var rootProps = (0, react_1.useContext)(DPContext).rootProps;
    var value = props.value, options = props.options, onChange = props.onChange;
    var _a = rootProps.theme, theme = _a === void 0 ? Def('theme') : _a;
    var p = {
        value: value,
        options: options,
        onChange: onChange,
        caret: false, type: 'select',
        attrs: { className: 'aio-input-date-dropdown aio-input-theme-bg1 aio-input-theme-color0' },
        option: { style: function () { return { background: theme[1], color: theme[0] }; } },
    };
    return (<AIOInput {...p}/>);
}
function DPArrow(props) {
    var _a = (0, react_1.useContext)(DPContext), rootProps = _a.rootProps, changeActiveDate = _a.changeActiveDate, activeDate = _a.activeDate, DATE = _a.DATE;
    var type = props.type, onClick = props.onClick;
    var jalali = rootProps.jalali, _b = rootProps.unit, unit = _b === void 0 ? Def('date-unit') : _b, _c = rootProps.theme, theme = _c === void 0 ? Def('theme') : _c;
    function change() {
        if (onClick) {
            onClick();
            return;
        }
        var offset = (!jalali ? 1 : -1) * (type === 'minus' ? -1 : 1);
        var date = [activeDate.year, activeDate.month, activeDate.day];
        if (unit === 'month') {
            changeActiveDate({ year: activeDate.year + offset });
        }
        if (unit === 'day') {
            var newDate = [];
            if (date[1] === 1 && offset === -1) {
                newDate = [date[0] - 1, 12];
            }
            else if (date[1] === 12 && offset === 1) {
                newDate = [date[0] + 1, 1];
            }
            else {
                newDate = [date[0], date[1] + offset];
            }
            changeActiveDate({ year: newDate[0], month: newDate[1] });
        }
        if (unit === 'hour') {
            var next = DATE.getNextTime(date, offset * 24 * 60 * 60 * 1000, jalali);
            changeActiveDate({ year: next[0], month: next[1], day: next[2] });
        }
    }
    function getIcon() { return I(type === 'minus' ? 'mdiChevronLeft' : 'mdiChevronRight', 1, { color: theme[0], className: 'aio-input-theme-color0' }); }
    return (<div className='aio-input-date-arrow' onClick={function () { return change(); }}>{getIcon()}</div>);
}
var AITableContext = (0, react_1.createContext)({});
function Table() {
    var _a = (0, react_1.useContext)(AICTX), rootProps = _a.rootProps, DATE = _a.DATE;
    var paging = rootProps.paging, _b = rootProps.getValue, getValue = _b === void 0 ? {} : _b, value = rootProps.value, _c = rootProps.onChange, onChange = _c === void 0 ? function () { } : _c, onAdd = rootProps.onAdd, onRemove = rootProps.onRemove, excel = rootProps.excel, onSwap = rootProps.onSwap, onSearch = rootProps.onSearch, rowAttrs = rootProps.rowAttrs, onChangeSort = rootProps.onChangeSort, className = rootProps.className, style = rootProps.style;
    var dom = (0, react_1.useState)((0, react_1.createRef)())[0];
    var _d = (0, react_1.useState)(''), searchValue = _d[0], setSearchValue = _d[1];
    var _e = (0, react_1.useState)([]), columns = _e[0], setColumns = _e[1];
    var _f = (0, react_1.useState)([]), searchColumns = _f[0], setSearchColumns = _f[1];
    var _g = (0, react_1.useState)([]), excelColumns = _g[0], setExcelColumns = _g[1];
    var temp = (0, react_1.useState)({})[0];
    var DragRows = (0, react_1.useState)(!onSwap ? false : new aio_utils_1.DragClass({
        callback: function (dragData, dropData) {
            if (DragRows === false) {
                return;
            }
            var dragIndex = dragData.dragIndex;
            var dropIndex = dropData.dropIndex, rows = dropData.rows;
            var newRows = DragRows.reOrder(rows, dragIndex, dropIndex);
            var from = rows[dragIndex];
            var to = rows[dropIndex];
            if (typeof onSwap === 'function') {
                onSwap(newRows, from, to);
            }
            else {
                onChange(newRows);
            }
        }
    }))[0];
    var _h = (0, react_1.useState)([]), sorts = _h[0], setSorts = _h[1];
    function getColumns() {
        var _a = rootProps.columns, columns = _a === void 0 ? [] : _a;
        columns = typeof columns === 'function' ? columns() : columns;
        var searchColumns = [], excelColumns = [];
        var updatedColumns = columns.map(function (o) {
            var _a = o.id, id = _a === void 0 ? 'aitc' + Math.round(Math.random() * 1000000) : _a, sort = o.sort, search = o.search, excel = o.excel;
            var column = __assign(__assign({}, o), { _id: id });
            if (search) {
                searchColumns.push(column);
            }
            if (excel) {
                excelColumns.push(column);
            }
            return column;
        });
        setColumns(updatedColumns);
        setSearchColumns(searchColumns);
        setExcelColumns(excelColumns);
        return updatedColumns;
    }
    function getSorts(columns) {
        var sorts = [];
        var _loop_3 = function (i) {
            var column = columns[i];
            var _id = column._id, input = column.input;
            var sort = column.sort === true ? {} : column.sort;
            if (!sort) {
                return "continue";
            }
            var _a = sort, _b = _a.active, active = _b === void 0 ? false : _b, _c = _a.dir, dir = _c === void 0 ? 'dec' : _c;
            var getValue_1 = void 0;
            if (sort.getValue) {
                getValue_1 = sort.getValue;
            }
            else {
                getValue_1 = function (row) {
                    var value = getDynamics({ value: column.value, row: row, column: column });
                    if (input && input.type === 'date') {
                        value = DATE.getTime(value);
                    }
                    return value;
                };
            }
            var type = void 0;
            if (input && ['number', 'date', 'range'].indexOf(input.type) !== -1) {
                type = 'number';
            }
            else {
                type = sort.type || 'string';
            }
            var sortItem = { dir: dir, title: sort.title || column.title, sortId: _id, active: active, type: type, getValue: getValue_1 };
            sorts.push(sortItem);
        };
        for (var i = 0; i < columns.length; i++) {
            _loop_3(i);
        }
        setSorts(sorts);
    }
    function getDynamics(p) {
        var value = p.value, row = p.row, column = p.column, def = p.def, rowIndex = p.rowIndex;
        if (paging) {
            var number = paging.number, size = paging.size;
            if (rowIndex)
                rowIndex += ((number - 1) * size);
        }
        var type = typeof value;
        if (type === 'string') {
            var result = value;
            var param = { row: row, column: column, rowIndex: rowIndex };
            if (getValue[value]) {
                result = getValue[value](param);
            }
            else if (value.indexOf('row.') !== -1) {
                try {
                    eval("result = ".concat(value));
                }
                catch (_a) {
                    result = '';
                }
            }
            return result === undefined ? def : result;
        }
        if (type === 'undefined') {
            return def;
        }
        if (type === 'function') {
            return value({ row: row, column: column, rowIndex: rowIndex });
        }
        return value === undefined ? def : value;
    }
    (0, react_1.useEffect)(function () {
        var columns = getColumns();
        getSorts(columns);
    }, []);
    function add() { typeof onAdd === 'function' ? onAdd() : onChange(__spreadArray([__assign({}, onAdd)], value, true)); }
    function remove(row, index) {
        var action = function () { return onChange(value.filter(function (o) { return o._id !== row._id; })); };
        typeof onRemove === 'function' ? onRemove({ row: row, action: action, rowIndex: index }) : action();
    }
    function exportToExcel() {
        var list = [];
        if (typeof rootProps.excel === 'function') {
            list = rootProps.excel(value);
        }
        else {
            for (var i = 0; i < value.length; i++) {
                var row = value[i], json = {};
                for (var j = 0; j < excelColumns.length; j++) {
                    var column = excelColumns[j], excel_1 = column.excel, value_1 = column.value;
                    var key = '';
                    if (excel_1 === true) {
                        if (typeof column.title === 'string') {
                            key = column.title;
                        }
                        else {
                            key = 'untitle';
                        }
                    }
                    else if (typeof excel_1 === 'string') {
                        key = excel_1;
                    }
                    else {
                        continue;
                    }
                    json[key] = getDynamics({ value: value_1, row: row, column: column, rowIndex: i });
                }
                list.push(json);
            }
        }
        (0, aio_utils_1.ExportToExcel)(list, { promptText: typeof excel === 'string' ? excel : 'Inter Excel File Name' });
    }
    function getSearchedRows(rows) {
        if (onSearch !== true) {
            return rows;
        }
        if (!searchColumns.length || !searchValue) {
            return rows;
        }
        return AIOInputSearch(rows, searchValue, function (row, index) {
            var str = '';
            for (var i = 0; i < searchColumns.length; i++) {
                var column = searchColumns[i];
                var value_2 = getDynamics({ value: column.value, row: row, def: '', column: column, rowIndex: index });
                if (value_2) {
                    str += value_2 + ' ';
                }
            }
            return str;
        });
    }
    function sortRows(rows, sorts) {
        if (!rows) {
            return [];
        }
        if (!sorts || !sorts.length) {
            return rows;
        }
        return rows.sort(function (a, b) {
            for (var i = 0; i < sorts.length; i++) {
                var _a = sorts[i], dir = _a.dir, getValue_2 = _a.getValue;
                if (!getValue_2) {
                    return 0;
                }
                var aValue = getValue_2(a), bValue = getValue_2(b);
                if (aValue < bValue) {
                    return -1 * (dir === 'dec' ? -1 : 1);
                }
                if (aValue > bValue) {
                    return 1 * (dir === 'dec' ? -1 : 1);
                }
                if (i === sorts.length - 1) {
                    return 0;
                }
            }
            return 0;
        });
    }
    function getSortedRows(rows) {
        if (temp.isInitSortExecuted) {
            return rows;
        }
        if (onChangeSort) {
            return rows;
        }
        var activeSorts = sorts.filter(function (sort) { return sort.active !== false; });
        if (!activeSorts.length || !rows.length) {
            return rows;
        }
        temp.isInitSortExecuted = true;
        var sortedRows = sortRows(rows, activeSorts);
        onChange(sortedRows);
        return sortedRows;
    }
    function getRows() {
        var searchedRows = getSearchedRows(value);
        var sortedRows = getSortedRows(searchedRows);
        var pagedRows = paging && !paging.serverSide ? sortedRows.slice((paging.number - 1) * paging.size, paging.number * paging.size) : sortedRows;
        return { rows: value, searchedRows: searchedRows, sortedRows: sortedRows, pagedRows: pagedRows };
    }
    //calculate style of cells and title cells
    function getCellStyle(column) {
        var width = getDynamics({ value: column.width });
        var minWidth = getDynamics({ value: column.minWidth });
        return { width: width ? width : undefined, flex: width ? undefined : 1, minWidth: minWidth };
    }
    function getCellAttrs(p) {
        var row = p.row, rowIndex = p.rowIndex, column = p.column, type = p.type;
        var cellAttrs = column.cellAttrs, titleAttrs = column.titleAttrs;
        var attrs = getDynamics({ value: type === 'title' ? titleAttrs : cellAttrs, column: column, def: {}, row: row, rowIndex: rowIndex });
        var justify = getDynamics({ value: column.justify, def: false });
        var cls = "aio-input-table-".concat(type) + (justify ? " aio-input-table-".concat(type, "-justify") : '');
        attrs = (0, aio_utils_1.AddToAttrs)(attrs, { className: cls, style: getCellStyle(column) });
        if (type === 'title') {
            attrs.title = getDynamics({ value: column.title, def: '' });
        }
        return __assign({}, attrs);
    }
    function getRowAttrs(row, rowIndex) {
        var attrs = rowAttrs ? rowAttrs({ row: row, rowIndex: rowIndex }) : {};
        var obj = (0, aio_utils_1.AddToAttrs)(attrs, { className: 'aio-input-table-row' });
        if (DragRows !== false) {
            obj = __assign(__assign(__assign({}, obj), DragRows.getDragAttrs({ dragIndex: rowIndex })), DragRows.getDropAttrs({ dropIndex: rowIndex, rows: value }));
        }
        return obj;
    }
    function search(searchValue) {
        if (onSearch === true) {
            setSearchValue(searchValue);
        }
        else if (typeof onSearch === 'function') {
            onSearch(searchValue);
        }
    }
    function getContext(ROWS) {
        var context = {
            ROWS: ROWS,
            rootProps: rootProps,
            columns: columns,
            sorts: sorts,
            setSorts: setSorts,
            sortRows: sortRows,
            excelColumns: excelColumns,
            getCellAttrs: getCellAttrs,
            getRowAttrs: getRowAttrs,
            add: add,
            remove: remove,
            search: search,
            exportToExcel: exportToExcel,
            getDynamics: getDynamics
        };
        return context;
    }
    var ROWS = getRows();
    var attrs = (0, aio_utils_1.AddToAttrs)(rootProps.attrs, { className: ['aio-input aio-input-table', className], style: rootProps.style, attrs: { ref: dom } });
    return (<AITableContext.Provider value={getContext(ROWS)}>
            <div {...attrs}>
                <TableToolbar />
                <div className='aio-input-table-unit aio-input-scroll'><TableHeader /><TableRows /></div>
                {paging ? <TablePaging /> : ''}
            </div>
        </AITableContext.Provider>);
}
function TableGap(props) {
    var rootProps = (0, react_1.useContext)(AITableContext).rootProps;
    var rowGap = rootProps.rowGap, columnGap = rootProps.columnGap;
    var dir = props.dir;
    var style;
    if (dir === 'h') {
        style = { height: rowGap };
    }
    else {
        style = { width: columnGap };
    }
    return <div className={"aio-input-table-border-".concat(dir)} style={style}></div>;
}
function TablePaging() {
    var _a = (0, react_1.useContext)(AITableContext), ROWS = _a.ROWS, rootProps = _a.rootProps;
    var temp = (0, react_1.useState)({ timeout: undefined, start: undefined, end: undefined, pages: 0 })[0];
    function fix(paging) {
        if (typeof rootProps.onChangePaging !== 'function') {
            alert('aio-input error => in type table you set paging but forget to set onChangePaging function prop to aio input');
            return { number: 0, size: 0 };
        }
        var number = paging.number, _a = paging.size, size = _a === void 0 ? 20 : _a, _b = paging.length, length = _b === void 0 ? 0 : _b, _c = paging.sizes, sizes = _c === void 0 ? [1, 5, 10, 15, 20, 30, 50, 70, 100] : _c, serverSide = paging.serverSide;
        if (!serverSide) {
            length = ROWS.sortedRows.length;
        }
        if (sizes.indexOf(size) === -1) {
            size = sizes[0];
        }
        var pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        var start = number - 3, end = number + 3;
        temp.start = start;
        temp.end = end;
        temp.pages = pages;
        return __assign(__assign({}, paging), { length: length, number: number, size: size, sizes: sizes });
    }
    var _b = (0, react_1.useState)(fix(rootProps.paging || { size: 0, number: 0 })), paging = _b[0], setPaging = _b[1];
    (0, react_1.useEffect)(function () {
        if (rootProps.paging) {
            setPaging(fix(rootProps.paging));
        }
    }, [(rootProps.paging || { size: 0, number: 0, length: 0 }).size, (rootProps.paging || { size: 0, number: 0, length: 0 }).number, (rootProps.paging || { size: 0, number: 0, length: 0 }).length]);
    function changePaging(obj) {
        var newPaging = fix(__assign(__assign({}, paging), obj));
        setPaging(newPaging);
        if (rootProps.onChangePaging) {
            if (newPaging.serverSide) {
                clearTimeout(temp.timeout);
                temp.timeout = setTimeout(function () {
                    //be khatere fahme payine typescript majbooram dobare in shart ro bezanam
                    if (rootProps.onChangePaging) {
                        rootProps.onChangePaging(newPaging);
                    }
                }, 800);
            }
            else {
                rootProps.onChangePaging(newPaging);
            }
        }
    }
    var number = paging.number, size = paging.size, sizes = paging.sizes;
    var buttons = [];
    var isFirst = true;
    var _loop_4 = function (i) {
        if (i < 1 || i > temp.pages) {
            buttons.push(<button key={i} className={'aio-input-table-paging-button aio-input-table-paging-button-hidden'}>{i}</button>);
        }
        else {
            var index_2;
            if (isFirst) {
                index_2 = 1;
                isFirst = false;
            }
            else if (i === Math.min(temp.end, temp.pages)) {
                index_2 = temp.pages;
            }
            else {
                index_2 = i;
            }
            buttons.push(<button key={index_2} className={'aio-input-table-paging-button' + (index_2 === number ? ' active' : '')} onClick={function () { return changePaging({ number: index_2 }); }}>{index_2}</button>);
        }
    };
    for (var i = temp.start; i <= temp.end; i++) {
        _loop_4(i);
    }
    function changeSizeButton() {
        if (!sizes || !sizes.length) {
            return null;
        }
        var p = {
            attrs: { className: 'aio-input-table-paging-button aio-input-table-paging-size' },
            type: 'select', value: size, options: sizes, option: { text: 'option', value: 'option' },
            onChange: function (value) { return changePaging({ size: value }); },
            popover: { fitHorizontal: true },
        };
        return (<AIOInput {...p}/>);
    }
    return (<div className='aio-input-table-paging'>
            {buttons}
            {changeSizeButton()}
        </div>);
}
function TableRows() {
    var _a = (0, react_1.useContext)(AITableContext), ROWS = _a.ROWS, rootProps = _a.rootProps;
    var rowTemplate = rootProps.rowTemplate, _b = rootProps.rowAfter, rowAfter = _b === void 0 ? function () { return null; } : _b, _c = rootProps.rowBefore, rowBefore = _c === void 0 ? function () { return null; } : _c, rowsTemplate = rootProps.rowsTemplate, _d = rootProps.placeholder, placeholder = _d === void 0 ? 'there is not any items' : _d;
    var rows = ROWS.pagedRows || [];
    var content;
    if (rowsTemplate) {
        content = rowsTemplate(rows);
    }
    else if (rows.length) {
        content = rows.map(function (o, i) {
            var _a = o.id, id = _a === void 0 ? 'ailr' + Math.round(Math.random() * 10000000) : _a;
            o._id = o._id === undefined ? id : o._id;
            var isLast = i === rows.length - 1, Row;
            if (rowTemplate) {
                Row = rowTemplate({ row: o, rowIndex: i, isLast: isLast });
            }
            else {
                Row = <TableRow key={o._id} row={o} rowIndex={i} isLast={isLast}/>;
            }
            return (<react_1.Fragment key={o._id}>{rowBefore({ row: o, rowIndex: i })}{Row}{rowAfter({ row: o, rowIndex: i })}</react_1.Fragment>);
        });
    }
    else if (placeholder) {
        content = <div style={{ width: '100%', textAlign: 'center', padding: 12, boxSizing: 'border-box' }}>{placeholder}</div>;
    }
    else {
        return null;
    }
    return <div className='aio-input-table-rows'>{content}</div>;
}
function TableToolbar() {
    var _a = (0, react_1.useContext)(AITableContext), add = _a.add, exportToExcel = _a.exportToExcel, sorts = _a.sorts, sortRows = _a.sortRows, setSorts = _a.setSorts, search = _a.search, rootProps = _a.rootProps, excelColumns = _a.excelColumns;
    var toolbarAttrs = rootProps.toolbarAttrs, toolbar = rootProps.toolbar, onAdd = rootProps.onAdd, onSearch = rootProps.onSearch, onChangeSort = rootProps.onChangeSort, _b = rootProps.onChange, onChange = _b === void 0 ? function () { } : _b, value = rootProps.value, addText = rootProps.addText;
    toolbarAttrs = (0, aio_utils_1.AddToAttrs)(toolbarAttrs, { className: 'aio-input-table-toolbar' });
    if (!onAdd && !toolbar && !onSearch && !sorts.length && !excelColumns.length) {
        return null;
    }
    function changeSort(sortId, changeObject) {
        var newSorts = sorts.map(function (sort) {
            if (sort.sortId === sortId) {
                var newSort = __assign(__assign({}, sort), changeObject);
                return newSort;
            }
            return sort;
        });
        changeSorts(newSorts);
    }
    function changeSorts(sorts) {
        return __awaiter(this, void 0, void 0, function () {
            var res, activeSorts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!onChangeSort) return [3 /*break*/, 2];
                        return [4 /*yield*/, onChangeSort(sorts)];
                    case 1:
                        res = _a.sent();
                        if (res !== false) {
                            setSorts(sorts);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        setSorts(sorts);
                        activeSorts = sorts.filter(function (sort) { return sort.active !== false; });
                        if (activeSorts.length) {
                            onChange(sortRows(value, activeSorts));
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function button() {
        if (!sorts.length) {
            return null;
        }
        var p = {
            popover: {
                header: {
                    attrs: { className: 'aio-input-table-toolbar-popover-header' },
                    title: 'Sort',
                    onClose: false
                },
                pageSelector: '.aio-input-table'
            },
            caret: false, type: 'select', options: sorts,
            option: {
                text: 'option.title',
                checked: '!!option.active',
                close: function () { return false; },
                value: 'option.sortId',
                after: function (_a) {
                    var option = _a.option;
                    var _b = option.dir, dir = _b === void 0 ? 'dec' : _b, sortId = option.sortId;
                    return (<div onClick={function (e) {
                            e.stopPropagation();
                            changeSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' });
                        }}>
                            {I(dir === 'dec' ? 'mdiArrowDown' : 'mdiArrowUp', 0.8)}
                        </div>);
                }
            },
            attrs: { className: 'aio-input-table-toolbar-button' },
            text: I('mdiSort', 0.7),
            onSwap: function (newSorts, from, to) { return changeSorts(newSorts); },
            onChange: function (value, option) { return changeSort(value, { active: !option.checked }); }
        };
        return (<AIOInput {...p} key='sortbutton'/>);
    }
    function getAddText() {
        var addText = rootProps.addText;
        if (!rootProps.addText) {
            return I('mdiPlusThick', 0.8);
        }
        if (typeof addText === 'function') {
            return addText(value);
        }
        return addText;
    }
    return (<>
            <div {...toolbarAttrs}>
                {toolbar && <div className='aio-input-table-toolbar-content'>{typeof toolbar === 'function' ? toolbar() : toolbar}</div>}
                <div className='aio-input-table-search'>
                    {!!onSearch && <AIOInput type='text' onChange={function (value) { return search(value); }} after={I('mdiMagnify', 0.7)}/>}
                </div>
                {button()}
                {!!excelColumns.length && <div className='aio-input-table-toolbar-button' onClick={function () { return exportToExcel(); }}>{I('mdiFileExcel', 0.8)}</div>}
                {!!onAdd && <div className='aio-input-table-toolbar-button' onClick={function () { return add(); }}>{getAddText()}</div>}
            </div>
            <TableGap dir='h'/>
        </>);
}
function TableHeader() {
    var _a = (0, react_1.useContext)(AITableContext), rootProps = _a.rootProps, columns = _a.columns;
    var headerAttrs = rootProps.headerAttrs, onRemove = rootProps.onRemove;
    headerAttrs = (0, aio_utils_1.AddToAttrs)(headerAttrs, { className: 'aio-input-table-header' });
    var Titles = columns.map(function (o, i) { return <TableTitle key={o._id} column={o} isLast={i === columns.length - 1}/>; });
    var RemoveTitle = !onRemove ? null : <><TableGap dir='v'/><div className='aio-input-table-remove-title'></div></>;
    return <div {...headerAttrs}>{Titles}{RemoveTitle}<TableGap dir='h'/></div>;
}
function TableTitle(p) {
    var column = p.column, isLast = p.isLast;
    var getCellAttrs = (0, react_1.useContext)(AITableContext).getCellAttrs;
    var attrs = getCellAttrs({ column: column, type: 'title' });
    return (<><div {...attrs}>{attrs.title}</div>{!isLast && <TableGap dir='v'/>}</>);
}
function TableRow(p) {
    var row = p.row, isLast = p.isLast, rowIndex = p.rowIndex;
    var _a = (0, react_1.useContext)(AITableContext), remove = _a.remove, rootProps = _a.rootProps, columns = _a.columns, getRowAttrs = _a.getRowAttrs;
    function getCells() {
        return columns.map(function (column, i) {
            var key = row._id + ' ' + column._id;
            var isLast = i === columns.length - 1;
            return (<TableCell isLast={isLast} key={key} row={row} rowIndex={rowIndex} column={column}/>);
        });
    }
    var onRemove = rootProps.onRemove;
    return (<>
            <div key={row._id} {...getRowAttrs(row, rowIndex)}>
                {getCells()}
                {onRemove ? <><TableGap dir='v'/><button className='aio-input-table-remove' onClick={function () { return remove(row, rowIndex); }}>{I('mdiClose', 0.8)}</button></> : null}
            </div>
            <TableGap dir='h'/>
        </>);
}
var TableCell = function (p) {
    var row = p.row, rowIndex = p.rowIndex, column = p.column, isLast = p.isLast;
    var _a = (0, react_1.useContext)(AITableContext), getCellAttrs = _a.getCellAttrs, rootProps = _a.rootProps, getDynamics = _a.getDynamics;
    var _b = rootProps.onChange, onChange = _b === void 0 ? function () { } : _b, _c = rootProps.value, value = _c === void 0 ? [] : _c;
    function setCell(row, column, cellNewValue) {
        if (column.input && column.input.onChange) {
            column.input.onChange({ value: cellNewValue, row: row, column: column });
        }
        else {
            row = JSON.parse(JSON.stringify(row));
            eval("".concat(column.value, " = cellNewValue"));
            onChange(value.map(function (o) { return o._id !== row._id ? o : row; }));
        }
    }
    var contentProps = { row: row, rowIndex: rowIndex, column: column, onChange: column.input ? function (value) { return setCell(row, column, value); } : undefined };
    var key = row._id + ' ' + column._id;
    return (<react_1.Fragment key={key}>
            <div {...getCellAttrs({ row: row, rowIndex: rowIndex, column: column, type: 'cell' })}>
                <TableCellContent {...contentProps} key={key}/>
            </div>
            {!isLast && <TableGap dir='v'/>}
        </react_1.Fragment>);
};
function TableCellContent(props) {
    var row = props.row, column = props.column, rowIndex = props.rowIndex, onChange = props.onChange;
    var getDynamics = (0, react_1.useContext)(AITableContext).getDynamics;
    var template = getDynamics({ value: column.template, row: row, rowIndex: rowIndex, column: column });
    if (template !== undefined) {
        return template;
    }
    var input = getDynamics({ value: column.input, row: row, rowIndex: rowIndex, column: column });
    var value = getDynamics({ value: column.value, row: row, rowIndex: rowIndex, column: column });
    if (!input) {
        return value;
    }
    //justify baraye input ast amma agar rooye column set shode va input set nashode be input bede
    input.justify = input.justify || getDynamics({ value: column.justify, row: row, rowIndex: rowIndex, column: column });
    var convertedInput = { type: 'text' };
    for (var property in input) {
        var prop = property;
        var res = input[prop];
        if (['onChange', 'onClick'].indexOf(prop) !== -1) {
            convertedInput[prop] = res;
        }
        else {
            convertedInput[prop] = getDynamics({ value: res, row: row, rowIndex: rowIndex, column: column });
        }
    }
    var p = __assign(__assign({}, convertedInput), { value: value, onChange: onChange, type: input.type });
    return (<AIOInput {...p} key={row._id + ' ' + column._id}/>);
}
function AIOInputSearch(items, searchValue, getValue) {
    if (!searchValue) {
        return items;
    }
    function isMatch(keys, value) {
        for (var i = 0; i < keys.length; i++) {
            if (value.indexOf(keys[i]) === -1) {
                return false;
            }
        }
        return true;
    }
    var keys = searchValue.split(' ');
    return items.filter(function (o, i) { return isMatch(keys, getValue ? getValue(o, i) : o); });
}
var RangeContext = (0, react_1.createContext)({});
var Range = function () {
    var rootProps = (0, react_1.useContext)(AICTX).rootProps;
    var _a = rootProps.start, start = _a === void 0 ? 0 : _a, _b = rootProps.end, end = _b === void 0 ? 360 : _b, _c = rootProps.min, min = _c === void 0 ? start : _c, _d = rootProps.max, max = _d === void 0 ? end : _d, _e = rootProps.step, step = _e === void 0 ? 1 : _e, reverse = rootProps.reverse, round = rootProps.round, vertical = rootProps.vertical, multiple = rootProps.multiple, text = rootProps.text, onChange = rootProps.onChange, _f = rootProps.size, size = _f === void 0 ? Def('range-size') : _f, disabled = rootProps.disabled, className = rootProps.className, _g = rootProps.labels, labels = _g === void 0 ? [] : _g, _h = rootProps.rotate, rotate = _h === void 0 ? 0 : _h;
    var temp = (0, react_1.useState)({ dom: (0, react_1.createRef)(), start: 0, index: false })[0];
    function getValidValue(value) {
        if (!Array.isArray(value)) {
            value = [value || 0];
        }
        for (var i = 0; i < value.length; i++) {
            var point = value[i] || 0;
            point = Math.round((point - start) / step) * step + start;
            point = +point.toFixed((0, aio_utils_1.GetPrecisionCount)(step));
            if (point < min) {
                point = min;
            }
            if (point > max) {
                point = max;
            }
            value[i] = point;
        }
        return value;
    }
    var value = getValidValue(rootProps.value);
    var valueRef = (0, react_1.useRef)(value);
    valueRef.current = value;
    var _j = (0, react_1.useState)(getDisabledDic()), disabledDic = _j[0], setDisabledDic = _j[1];
    function getDisabledDic() {
        if (!Array.isArray(disabled)) {
            return {};
        }
        var res = {};
        for (var i = 0; i < disabled.length; i++) {
            var key = 'a' + disabled[i];
            res[key] = true;
        }
        return res;
    }
    (0, react_1.useEffect)(function () { setDisabledDic(getDisabledDic()); }, [JSON.stringify(disabled)]);
    (0, react_1.useEffect)(function () {
        if (!onChange) {
            return;
        }
        clearTimeout(temp.timeOut);
        temp.timeOut = setTimeout(function () {
            new aio_swip_1.default({
                reverseX: !!reverse,
                //vertical condition
                reverseY: !!reverse && !!vertical,
                dom: function () { return (0, jquery_1.default)(temp.dom.current); },
                start: function (p) {
                    var event = p.event;
                    if (event.target !== null) {
                        var target = (0, jquery_1.default)(event.target);
                        if ((0, aio_utils_1.HasClass)(target, 'ai-range-point')) {
                            var index = target.attr('data-index') || '0';
                            temp.index = +index;
                        }
                        else {
                            temp.index = false;
                        }
                        temp.start = __spreadArray([], valueRef.current, true);
                    }
                    return [0, 0];
                },
                move: function (p) {
                    var change = p.change, mousePosition = p.mousePosition;
                    if (change) {
                        changeHandle({ dx: change.dx, dy: change.dy, deltaCenterAngle: change.deltaCenterAngle, centerAngle: mousePosition.centerAngle });
                    }
                },
                onClick: function (p) { click(p.mousePosition); }
            });
        }, 100);
    }, [changeHandle]);
    function getDefaultOffset(type) {
        if (type === 'point') {
            return round ? 100 : 0;
        }
        if (type === 'label') {
            return round ? 116 : 14;
        }
        if (type === 'scale') {
            return round ? 100 : 14;
        }
        return 0;
    }
    function changeValue(newValue) {
        if (!onChange) {
            return;
        }
        newValue = getValidValue(newValue);
        onChange(!!multiple ? newValue : newValue[0]);
    }
    function click(mousePosition) {
        if (disabled === true || temp.index !== false) {
            return;
        }
        var value = valueRef.current;
        var clickedValue;
        //vertical condition
        if (round) {
            clickedValue = getValueByAngle(mousePosition.centerAngle);
        }
        else {
            clickedValue = getValueByXP(mousePosition[vertical ? 'yp' : 'xp']);
        }
        if (clickedValue < value[value.length - 1] && clickedValue > value[0]) {
            return;
        }
        if (clickedValue < value[0]) {
            change1Unit(-1);
        }
        else {
            change1Unit(1);
        }
    }
    function isValueValid(value) {
        for (var i = 0; i < value.length; i++) {
            if (isValueDisabled(value[i])) {
                return false;
            }
        }
        return true;
    }
    var sbp = function (value, p) {
        if (p === void 0) { p = {}; }
        var _a = p.half, half = _a === void 0 ? false : _a, _b = p.range, range = _b === void 0 ? size / (half ? 2 : 1) : _b;
        var res = range * value / 100;
        var min = p.min, max = p.max;
        if (min !== undefined && res < min) {
            res = min;
        }
        if (max !== undefined && res > max) {
            res = max;
        }
        return res;
    };
    var getCircleByStr = function (rc, type) {
        var thickness = rc.thickness || 1, radius = 0, roundCap = rc.roundCap || false, full = rc.full || false, offset = rc.offset, color = rc.color || '#000';
        try {
            var thicknessValue = thickness;
            if (isNaN(thicknessValue)) {
                thicknessValue = 1;
            }
            thickness = thicknessValue;
            var offsetValue = offset;
            if (isNaN(offsetValue)) {
                offsetValue = 0;
            }
            var defaultRadius = size / 2 - thickness / 2;
            if (type === 'offset') {
                radius = defaultRadius - offsetValue;
            }
            else {
                radius = offsetValue;
            }
            if (radius > defaultRadius) {
                radius = defaultRadius;
            }
            if (radius < thickness / 2) {
                radius = thickness / 2;
            }
            else {
                roundCap = false;
            }
        }
        catch (_a) { }
        return { thickness: thickness, radius: radius, color: color, roundCap: roundCap, full: full };
    };
    var getRectByStr = function (range) {
        var _a = range.thickness, thickness = _a === void 0 ? 1 : _a, _b = range.offset, offset = _b === void 0 ? 0 : _b, _c = range.color, color = _c === void 0 ? '#000' : _c, _d = range.roundCap, roundCap = _d === void 0 ? false : _d;
        try {
            var thicknessValue = thickness;
            if (isNaN(thicknessValue)) {
                thicknessValue = 1;
            }
            thickness = thicknessValue;
            var offsetValue = offset;
            if (isNaN(offsetValue)) {
                offsetValue = 0;
            }
            var defaultOffset = (size / 2) - (thickness / 2);
            offset = defaultOffset - offsetValue;
            if (offset > size - thickness / 2) {
                offset = size - thickness / 2;
            }
            if (offset < thickness / 2) {
                offset = thickness / 2;
            }
        }
        catch (_e) { }
        return { thickness: thickness, offset: offset, color: color, roundCap: roundCap };
    };
    function change1Unit(dir) {
        var value = valueRef.current;
        var newValue = __spreadArray([], value, true);
        var lastValue = JSON.stringify(newValue);
        newValue = moveAll(newValue, dir * step);
        while (!isValueValid(newValue) && JSON.stringify(newValue) !== lastValue) {
            lastValue = JSON.stringify(newValue);
            newValue = moveAll(newValue, dir * step);
        }
        changeValue(newValue);
    }
    function changeHandle(obj) {
        if (disabled === true) {
            return;
        }
        var newValue = getChangedValue(obj);
        changeValue(newValue);
    }
    function getIndexLimit(index) {
        var value = valueRef.current;
        var before, after;
        if (index === 0) {
            before = start;
        }
        else {
            before = value[index - 1];
        }
        if (index === value.length - 1) {
            after = end;
        }
        else {
            after = value[index + 1];
        }
        return { before: before, after: after };
    }
    function moveAll(newValue, offset, ifFailedReturnOriginalValue) {
        var res = newValue.map(function (o) { return o + offset; });
        if (res[0] < start || res[res.length - 1] > end) {
            return ifFailedReturnOriginalValue ? valueRef.current : newValue;
        }
        return res;
    }
    function getChangedValue(obj) {
        var dx = obj.dx, dy = obj.dy, deltaCenterAngle = obj.deltaCenterAngle, centerAngle = obj.centerAngle;
        var startValue = __spreadArray([], temp.start, true);
        var index = temp.index;
        //agar faghat yek point darim har koja mousedown shod farz kon rooye oon point mousedown karde im
        if (startValue.length === 1 && index === false) {
            index = 0;
        }
        var res;
        if (index === false) {
            var deltaValue = void 0;
            if (round) {
                var v = deltaCenterAngle * (end - start) / 360;
                v = Math.round(v / step) * step;
                deltaValue = v;
            }
            else {
                deltaValue = Math.round(getValueByXP(getXPByX(vertical ? dy : dx)) / step) * step;
            }
            var newValue = moveAll(startValue, deltaValue, true);
            res = !isValueValid(newValue) ? valueRef.current : newValue;
        }
        else {
            var _a = getIndexLimit(index), before = _a.before, after = _a.after;
            var newUnitValue = void 0;
            if (round) {
                newUnitValue = Math.round(getValueByAngle(centerAngle) / step) * step;
            }
            else {
                var deltaValue = Math.round(getValueByXP(getXPByX(vertical ? dy : dx)) / step) * step;
                newUnitValue = startValue[index] + deltaValue;
            }
            if (newUnitValue > after) {
                newUnitValue = after;
            }
            if (newUnitValue < before) {
                newUnitValue = before;
            }
            if (isValueDisabled(newUnitValue)) {
                newUnitValue = valueRef.current[index];
            }
            startValue[index] = newUnitValue;
            res = startValue;
        }
        return res;
    }
    function getSide() {
        if (vertical) {
            return reverse ? 'bottom' : 'top';
        }
        return reverse ? 'right' : 'left';
    }
    function getOffset() {
        return vertical ? 'left' : 'top';
    }
    function isValueDisabled(value) { return !!disabledDic["a".concat(value)]; }
    function getRootClassName() {
        var cls = 'ai-range';
        if (round) {
            cls += ' ai-range-round';
        }
        else {
            cls += " ai-range-".concat(vertical ? 'vertical' : 'horizontal');
        }
        if (className) {
            cls += ' ' + className;
        }
        if (reverse) {
            cls += ' ai-range-reverse';
        }
        return cls;
    }
    function getRootStyle() {
        var style = rootProps.style;
        var res;
        if (round) {
            res = { width: size, height: size };
        }
        else if (vertical) {
            res = { width: size };
        }
        else {
            res = { height: size };
        }
        return __assign(__assign({}, res), style);
    }
    function getRootProps() {
        var _a = rootProps.attrs, attrs = _a === void 0 ? {} : _a;
        var rootStyle = getRootStyle();
        return (0, aio_utils_1.AddToAttrs)(attrs, { className: getRootClassName(), style: rootStyle, attrs: { ref: temp.dom } });
    }
    function root_node() {
        return (<div {...getRootProps()}>
                <RangeGroove />
                {text !== undefined && <div className='ai-range-text' key='rangetext'>{typeof text === 'function' ? text() : text}</div>}
                {!round && <react_1.Fragment key='rangefill'><RangeRanges /><RangeFills /></react_1.Fragment>}
                <RangeSvg />
                {labels.map(function (label, i) { return <RangeLabel key={i} label={label}/>; })}
                {value.map(function (itemValue, i) { return <RangeValueContainer index={i} itemValue={itemValue} key={'rangecontainervalue' + i}/>; })}
            </div>);
    }
    function fixValueInEmpty(value) {
        round = round || 1;
        var fill = round;
        var empty = 1 - fill;
        var emptyValue = empty * (end - start) / fill;
        if (value > end + emptyValue / 2) {
            value = start - emptyValue + value - end;
        }
        return value;
    }
    function getValueByAngle(angle) {
        var fillAngle = 360 * (round || 1);
        var emptyAngle = 360 - fillAngle;
        if (reverse) {
            angle = 180 - angle;
        }
        angle -= rotate;
        angle -= emptyAngle / 2;
        angle -= 90;
        angle = fixAngle(angle);
        var res = angle * (end - start) / fillAngle;
        res = fixValueInEmpty(res);
        return res;
    }
    function getAngleByValue(value, ang) {
        var fillAngle = 360 * round;
        var emptyAngle = 360 - fillAngle;
        var res = value * fillAngle / (end - start);
        res += 90;
        res += emptyAngle / 2;
        res += rotate;
        res += (ang || 0);
        return reverse ? res = 180 - res : res;
    }
    function fixAngle(angle) { angle = angle % 360; return angle < 0 ? angle = 360 + angle : angle; }
    function getXPByValue(value) { return 100 * (value - start) / (end - start); }
    function getValueByXP(xp) { return xp * (end - start) / 100; }
    function getXPByX(x) { return x * 100 / (0, jquery_1.default)(temp.dom.current)[vertical ? 'height' : 'width'](); }
    function getContext() {
        var context = {
            getXPByValue: getXPByValue,
            rootProps: rootProps,
            fixAngle: fixAngle,
            getAngleByValue: getAngleByValue,
            dom: temp.dom,
            getCircleByStr: getCircleByStr,
            getRectByStr: getRectByStr,
            isValueDisabled: isValueDisabled,
            value: valueRef.current,
            getSide: getSide,
            getOffset: getOffset,
            getDefaultOffset: getDefaultOffset,
            sbp: sbp
        };
        return context;
    }
    return (<RangeContext.Provider value={getContext()}>{root_node()}</RangeContext.Provider>);
};
var RangeGroove = function () {
    var rootProps = (0, react_1.useContext)(RangeContext).rootProps;
    var attrs = (0, aio_utils_1.AddToAttrs)(rootProps.grooveAttrs, { className: 'ai-range-groove' });
    if (rootProps.round) {
        return null;
    }
    else {
        return <div {...attrs}></div>;
    }
};
var RangeSvg = function () {
    var _a = (0, react_1.useContext)(RangeContext), rootProps = _a.rootProps, value = _a.value;
    var round = rootProps.round, _b = rootProps.ranges, ranges = _b === void 0 ? [] : _b, _c = rootProps.circles, circles = _c === void 0 ? [] : _c, _d = rootProps.size, size = _d === void 0 ? Def('range-size') : _d, _e = rootProps.end, end = _e === void 0 ? 360 : _e;
    if (!round || (!(ranges || [0]).length && !circles.length)) {
        return null;
    }
    var pathes = [<RangeCircles />, <RangeRanges />];
    return (<svg style={{ position: 'absolute', left: 0, top: 0 }} width={size} height={size}>{pathes}</svg>);
};
var RangeCircles = function () {
    var _a = (0, react_1.useContext)(RangeContext), rootProps = _a.rootProps, getCircleByStr = _a.getCircleByStr;
    var _b = rootProps.start, start = _b === void 0 ? 0 : _b, _c = rootProps.end, end = _c === void 0 ? 360 : _c, _d = rootProps.circles, circles = _d === void 0 ? [] : _d, _e = rootProps.size, size = _e === void 0 ? Def('range-size') : _e;
    var pathes = [];
    for (var i = 0; i < circles.length; i++) {
        var from = start, to = end;
        var _f = getCircleByStr(circles[i], 'radius'), thickness = _f.thickness, color = _f.color, radius = _f.radius, roundCap = _f.roundCap, full = _f.full;
        var p = { thickness: thickness, color: color, from: from, to: to, radius: radius, full: full, roundCap: roundCap };
        pathes.push(<RangeArc {...p}/>);
    }
    return <>{pathes}</>;
};
var RangeFills = function () {
    var _a = (0, react_1.useContext)(RangeContext), rootProps = _a.rootProps, value = _a.value;
    var _b = rootProps.start, start = _b === void 0 ? 0 : _b, fill = rootProps.fill, round = rootProps.round;
    if (round || fill === false) {
        return null;
    }
    var limit = value.length === 1 ? [start, value[0]] : __spreadArray([], value, true);
    var res = [];
    for (var i = 1; i < limit.length; i++) {
        var _c = (typeof fill === 'function' ? fill(i) : fill) || {}, thickness = _c.thickness, style = _c.style, fillClassName = _c.className, color = _c.color;
        var from = limit[i - 1];
        var to = limit[i];
        var className = 'ai-range-fill';
        if (fillClassName) {
            className += ' ' + fillClassName;
        }
        var p = { thickness: thickness, color: color, from: from, to: to, className: className, style: style };
        res.push(<RangeRect {...p} key={'fill' + i}/>);
    }
    return <>{res}</>;
};
var RangeRanges = function () {
    var _a = (0, react_1.useContext)(RangeContext), rootProps = _a.rootProps, getCircleByStr = _a.getCircleByStr, getRectByStr = _a.getRectByStr;
    var _b = rootProps.start, start = _b === void 0 ? 0 : _b, _c = rootProps.ranges, ranges = _c === void 0 ? [] : _c, round = rootProps.round;
    var res = [], from = start, list = ranges;
    for (var i = 0; i < list.length; i++) {
        var _d = list[i], value = _d[0], config = _d[1];
        var to = value;
        var rangeItem = void 0;
        if (round) {
            var _e = getCircleByStr(config, 'offset'), thickness = _e.thickness, color = _e.color, radius = _e.radius, roundCap = _e.roundCap;
            var p = { thickness: thickness, color: color, from: from, to: to, radius: radius, roundCap: roundCap, full: false };
            rangeItem = <RangeArc {...p}/>;
        }
        else {
            var _f = getRectByStr(config), thickness = _f.thickness, color = _f.color, offset = _f.offset, roundCap = _f.roundCap;
            var p = { thickness: thickness, color: color, from: from, to: to, offset: offset, roundCap: roundCap, className: 'ai-range-range' };
            rangeItem = <RangeRect {...p} key={'range' + i}/>;
        }
        res.push(rangeItem);
        from = to;
    }
    return <>{res}</>;
};
var RangeValueContainer = function (props) {
    var _a = (0, react_1.useContext)(RangeContext), rootProps = _a.rootProps, isValueDisabled = _a.isValueDisabled, fixAngle = _a.fixAngle, getAngleByValue = _a.getAngleByValue, getXPByValue = _a.getXPByValue, dom = _a.dom, getSide = _a.getSide;
    var itemValue = props.itemValue, index = props.index;
    var round = rootProps.round;
    var angle = fixAngle(getAngleByValue(itemValue));
    function containerProps() {
        var _a;
        var style;
        if (!round) {
            style = (_a = {}, _a[getSide()] = getXPByValue(itemValue) + '%', _a);
        }
        else {
            style = { transform: "rotate(".concat(angle, "deg)") };
        }
        return { className: 'ai-range-value-container', draggable: false, style: style };
    }
    var PROPS = {
        value: itemValue,
        index: index,
        disabled: isValueDisabled(itemValue),
        angle: angle,
        parentDom: dom
    };
    return (<div {...containerProps()}><RangeHandle {...PROPS} key='handle'/> <RangePoint {...PROPS} key='point'/></div>);
};
var RangeRect = function (_a) {
    var _b, _c, _d, _e;
    var thickness = _a.thickness, color = _a.color, from = _a.from, to = _a.to, className = _a.className, style = _a.style, offset = _a.offset, roundCap = _a.roundCap;
    var _f = (0, react_1.useContext)(RangeContext), getXPByValue = _f.getXPByValue, rootProps = _f.rootProps, getSide = _f.getSide;
    var vertical = rootProps.vertical, startSide = getXPByValue(from), endSide = getXPByValue(to);
    var bigSizeStyle = (_b = {}, _b[vertical ? 'height' : 'width'] = (endSide - startSide) + '%', _b);
    var smallSizeStyle = (_c = {}, _c[vertical ? 'width' : 'height'] = thickness, _c);
    var mainSideStyle = (_d = {}, _d[getSide()] = startSide + '%', _d);
    var otherSideStyle = offset ? (_e = {}, _e[vertical ? 'left' : 'top'] = offset, _e) : {};
    var borderRadiusStyle = roundCap ? { borderRadius: '100%' } : {};
    var colorStyle = { background: color };
    var Style = __assign(__assign(__assign(__assign(__assign(__assign(__assign({}, bigSizeStyle), smallSizeStyle), mainSideStyle), otherSideStyle), borderRadiusStyle), colorStyle), style);
    return <div className={className} style={Style}/>;
};
var RangeArc = function (_a) {
    var thickness = _a.thickness, color = _a.color, from = _a.from, to = _a.to, radius = _a.radius, full = _a.full, roundCap = _a.roundCap;
    var _b = (0, react_1.useContext)(RangeContext), fixAngle = _b.fixAngle, getAngleByValue = _b.getAngleByValue, rootProps = _b.rootProps;
    var _c = rootProps.size, size = _c === void 0 ? Def('range-size') : _c, reverse = rootProps.reverse;
    var a, b;
    var x = size / 2, y = size / 2;
    if (full) {
        a = 0;
        b = 360;
    }
    else {
        var startAngle = fixAngle(getAngleByValue(from) + 90);
        var endAngle = fixAngle(getAngleByValue(to) + 90);
        if (endAngle === 0) {
            endAngle = 360;
        }
        a = startAngle;
        b = endAngle;
        if (reverse) {
            b = startAngle;
            a = endAngle;
        }
    }
    return <path key={"from".concat(from, "to").concat(to)} d={(0, aio_utils_1.svgArc)(x, y, radius, a, b)} stroke={color} strokeWidth={thickness} fill='transparent' strokeLinecap={roundCap ? 'round' : undefined}/>;
};
var RangePoint = function (props) {
    var _a;
    var _b = (0, react_1.useContext)(RangeContext), rootProps = _b.rootProps, getOffset = _b.getOffset, sbp = _b.sbp;
    var temp = (0, react_1.useState)({ dom: (0, react_1.createRef)() })[0];
    var value = props.value, disabled = props.disabled, angle = props.angle, index = props.index, parentDom = props.parentDom;
    if (rootProps.point === false) {
        return null;
    }
    var round = rootProps.round, _c = rootProps.size, size = _c === void 0 ? Def('range-size') : _c;
    var point = (rootProps.point || (function () { }))(value, { disabled: disabled, angle: angle, value: value, index: index }) || {};
    var _d = point.attrs, attrs = _d === void 0 ? {} : _d, _e = point.html, html = _e === void 0 ? value : _e, _f = point.offset, offset = _f === void 0 ? 0 : _f;
    var zIndexAttrs = (0, aio_utils_1.getEventAttrs)('onMouseDown', function () {
        var containers = (0, jquery_1.default)(parentDom.current).find('ai-range-value-container');
        containers.css({ zIndex: 10 });
        containers.eq(index).css({ zIndex: 100 });
    });
    var containerStyle, pointStyle = __assign({}, attrs.style);
    if (round) {
        containerStyle = { left: size / 2 + offset, transform: "rotate(".concat(-angle, "deg)") };
    }
    else {
        containerStyle = (_a = {}, _a[getOffset()] = offset, _a);
    }
    var containerProps = { ref: temp.dom, className: 'ai-range-point-container', style: containerStyle, draggable: false };
    var pointProps = (0, aio_utils_1.AddToAttrs)(attrs, { className: ['ai-range-point'], style: pointStyle, attrs: __assign({ draggable: false, 'data-index': index }, zIndexAttrs) });
    return (<div {...containerProps} key={'rangepoint' + index}><div {...pointProps}>{html}</div></div>);
};
var RangeHandle = function (props) {
    var _a = (0, react_1.useContext)(RangeContext), rootProps = _a.rootProps, sbp = _a.sbp;
    var value = props.value, angle = props.angle, disabled = props.disabled, index = props.index;
    var _b = rootProps.handle, handle = _b === void 0 ? (function () { }) : _b, round = rootProps.round;
    if (handle === false || !round) {
        return null;
    }
    if (handle && typeof handle !== 'function') {
        alert("aio-input error => in type round, handle props should be a function,\n        handle type = (value:number,{disabled:boolean,angle:number})=>{attrs:any}");
        return null;
    }
    var _c = handle(value, { angle: angle, disabled: disabled, value: value }) || {}, _d = _c.sharp, sharp = _d === void 0 ? false : _d, _e = _c.thickness, thickness = _e === void 0 ? 10 : _e, _f = _c.size, handleSize = _f === void 0 ? 90 : _f, _g = _c.color, color = _g === void 0 ? '#000' : _g, _h = _c.offset, offset = _h === void 0 ? 0 : _h;
    var width = sbp(handleSize, { half: true });
    var height = sbp(thickness, { half: true });
    function getStyle() {
        var _a;
        if (sharp) {
            return _a = {},
                _a[width < 0 ? 'borderRight' : 'borderLeft'] = "".concat(Math.abs(width), "px solid ").concat(color),
                _a.borderTop = "".concat(height / 2, "px solid transparent"),
                _a.borderBottom = "".concat(height / 2, "px solid transparent"),
                _a.left = offset,
                _a;
        }
        else {
            return { width: width, height: height, left: offset, background: color };
        }
    }
    var PROPS = (0, aio_utils_1.AddToAttrs)({}, {
        className: 'aio-input-handle', style: getStyle(), attrs: { draggable: false }
    });
    return (<div {...PROPS} key={'rangehandle' + index}></div>);
};
var RangeLabel = function (props) {
    var _a = (0, react_1.useContext)(RangeContext), dom = _a.dom, rootProps = _a.rootProps;
    var label = props.label;
    var zIndex = label.zIndex, dynamic = label.dynamic, step = label.step, _b = label.list, list = _b === void 0 ? [] : _b;
    var round = rootProps.round, _c = rootProps.start, start = _c === void 0 ? 0 : _c, _d = rootProps.end, end = _d === void 0 ? 360 : _d, reverse = rootProps.reverse, vertical = rootProps.vertical;
    var def = (0, react_1.useState)(getDef)[0];
    function getDef() { return RENDER(true); }
    function getList() {
        var res = [];
        if (step) {
            var _a = label.start, lstart = _a === void 0 ? start : _a, _b = label.end, lend = _b === void 0 ? end : _b;
            for (var i = lstart; i <= lend; i += step) {
                res.push(i);
            }
        }
        for (var i = 0; i < list.length; i++) {
            if (res.indexOf(list[i]) === -1) {
                res.push(list[i]);
            }
        }
        return res;
    }
    function updateLabels() {
        if (round || !label.autoHide || vertical) {
            return;
        }
        var container = (0, jquery_1.default)(dom.current);
        var labels = container.find('.ai-range-label');
        if (!labels.length) {
            return;
        }
        var firstLabel = labels.eq(0);
        var firstLabelHProp = firstLabel.attr('data-rotated') === 'yes' ? 'height' : 'width';
        var end = firstLabel.offset().left + (!reverse ? firstLabel[firstLabelHProp]() : 0);
        for (var i = 1; i < labels.length; i++) {
            var label_1 = labels.eq(i);
            var hProp = label_1.attr('data-rotated') === 'yes' ? 'height' : 'width';
            label_1.css({ display: 'flex' });
            var left = label_1.offset().left;
            var width = label_1[hProp]();
            var right = left + width;
            if (!reverse) {
                if (left < end + 5) {
                    label_1.css({ display: 'none' });
                }
                else {
                    end = left + width;
                }
            }
            else {
                if (right > end - 5) {
                    label_1.css({ display: 'none' });
                }
                else {
                    end = left;
                }
            }
        }
    }
    (0, react_1.useEffect)(function () { (0, jquery_1.default)(window).on('resize', updateLabels); }, []);
    (0, react_1.useEffect)(function () { updateLabels(); });
    function RENDER(init) {
        if (!init && !dynamic) {
            return def;
        }
        return (<div className='ai-range-labels' style={{ zIndex: zIndex }}>
                {getList().map(function (itemValue) { return <RangeLabelItem key={itemValue} label={label} itemValue={itemValue}/>; })}
            </div>);
    }
    return <>{RENDER(false)}</>;
};
var RangeLabelItem = function (props) {
    var _a = (0, react_1.useContext)(RangeContext), rootProps = _a.rootProps, isValueDisabled = _a.isValueDisabled, fixAngle = _a.fixAngle, getAngleByValue = _a.getAngleByValue, getXPByValue = _a.getXPByValue, getSide = _a.getSide;
    var label = props.label, itemValue = props.itemValue;
    var round = rootProps.round, vertical = rootProps.vertical, _b = rootProps.size, size = _b === void 0 ? Def('range-size') : _b;
    var angle;
    if (round) {
        angle = fixAngle(getAngleByValue(itemValue));
    }
    var disabled = isValueDisabled(itemValue);
    function getContainerStyle(distance) {
        var _a;
        if (round) {
            return { transform: "rotate(".concat(angle, "deg)") };
        }
        else {
            return __assign((_a = {}, _a[getSide()] = getXPByValue(itemValue) + '%', _a), distance);
        }
    }
    function getTextStyle(item, distance) {
        var res = {};
        if (round) {
            res = __assign(__assign({}, res), distance);
            if (item.fixAngle) {
                res = __assign(__assign({}, res), { transform: "rotate(".concat(-angle, "deg)") });
            }
        }
        return __assign({ width: 0, height: 0 }, res);
    }
    function getDetails() {
        var _a;
        var item = label.setting(itemValue, { disabled: disabled, angle: angle });
        var _b = item.offset, offset = _b === void 0 ? 0 : _b, _c = item.html, html = _c === void 0 ? '' : _c;
        var distance = (_a = {}, _a[round || vertical ? 'left' : 'top'] = size / 2 + offset, _a);
        var containerStyle = getContainerStyle(distance);
        var containerProps = { className: "ai-range-label-container", style: containerStyle, draggable: false };
        var textProps = (0, aio_utils_1.AddToAttrs)({}, { className: ["ai-range-label"], style: getTextStyle(item, distance), attrs: { draggable: false } });
        return { html: html, textProps: textProps, containerProps: containerProps };
    }
    var _c = getDetails(), html = _c.html, textProps = _c.textProps, containerProps = _c.containerProps;
    return (<div {...containerProps}><div {...textProps}>{html}</div></div>);
};
var SideMenu = function (props) {
    var _a = props.items, items = _a === void 0 ? [] : _a, onChange = props.onChange, _b = props.option, option = _b === void 0 ? {} : _b, _c = props.type, type = _c === void 0 ? 'normal' : _c;
    var cls = 'aio-input-sidemenu';
    var toggleRef = (0, react_1.useRef)(function (id) { });
    function getBadge(item) {
        var badge = item.badge;
        if (!badge) {
            badge = [];
        }
        if (!Array.isArray(badge)) {
            badge = [badge];
        }
        if (!badge.length) {
            return [];
        }
        var res = [];
        for (var i = 0; i < badge.length; i++) {
            var _a = badge[i], text = _a.text, _b = _a.color, color = _b === void 0 ? 'red' : _b, circle = _a.circle;
            res.push(<div className={"".concat(cls, "-badge ").concat(cls, "-align ").concat(cls, "-badge-").concat(color).concat(circle ? ' ' + cls + "-badge-circle" : '')}>{text}</div>);
        }
        return res;
    }
    function getAfter(option, active) {
        var _a = option.items, items = _a === void 0 ? [] : _a;
        var badge = getBadge(option);
        return (<div className={"".concat(cls, "-after ").concat(cls, "-align")}>
                {!!badge.length && badge}
                {!!items.length && I(active ? 'mdiChevronDown' : 'mdiChevronRight', 0.7)}
            </div>);
    }
    function getBefore(option) {
        var _a = option.icon, icon = _a === void 0 ? I('mdiCircleMedium', 0.6) : _a;
        if (!icon) {
            return null;
        }
        return (<div className={"".concat(cls, "-before")}>
                <div className={"".concat(cls, "-icon ").concat(cls, "-align")}>{icon}</div>
            </div>);
    }
    var defaultOption = {
        text: 'option.text',
        value: 'option.value',
        toggleIcon: function () { return false; },
        after: function (_a) {
            var option = _a.option, active = _a.active;
            return getAfter(option, !!active);
        },
        before: function (_a) {
            var option = _a.option;
            return getBefore(option);
        },
        onClick: function (_a) {
            var option = _a.option;
            var _b = option.items, items = _b === void 0 ? [] : _b, value = option.value;
            if (!!items.length) {
                toggleRef.current(value);
            }
            else if (option.onClick) {
                option.onClick();
            }
            else if (onChange) {
                onChange(option);
            }
        },
        className: function (_a) {
            var level = _a.level;
            return "".concat(cls, "-row-level-").concat(level);
        }
    };
    var finalOptions = __assign(__assign(__assign({}, defaultOption), option), { className: function (obj) {
            var className = "".concat(cls, "-row-level-").concat(obj.level);
            if (typeof option.className === 'function') {
                var res = option.className(obj);
                if (res) {
                    className += ' ' + res;
                }
            }
            return className;
        } });
    var attrs = (0, aio_utils_1.AddToAttrs)(props.attrs, { className: [cls, "aio-input-sidemenu-".concat(type), props.className] });
    return (<AIOInput {...attrs} className={attrs.className} type='tree' size={48} toggleRef={toggleRef} value={__spreadArray([], items, true)} getChilds={function (p) { return p.row.items || []; }} option={finalOptions} indent={0}/>);
};
exports.SideMenu = SideMenu;
var AICard = function (_a) {
    var text = _a.text, subtext = _a.subtext, onClick = _a.onClick, before = _a.before, after = _a.after;
    return (<div className="aio-input-card">
            {before !== undefined && <div className="aio-input-card-before" onClick={function (e) { return e.stopPropagation(); }}>{before}</div>}
            <div className="aio-input-card-body" onClick={onClick}>
                <div className="aio-input-card-text">{text}</div>
                {subtext !== undefined && <div className="aio-input-card-subtext">{subtext}</div>}
            </div>
            {after !== undefined && <div className="aio-input-card-after" onClick={function (e) { return e.stopPropagation(); }}>{after}</div>}
        </div>);
};
exports.AICard = AICard;
var AIPanel = function (_a) {
    var text = _a.text, subtext = _a.subtext, before = _a.before, after = _a.after, body = _a.body;
    function header_layout() {
        return (<div className="aio-input-panel-header">
                <div className="aio-input-panel-before">{!!before && before}</div>
                <div className="aio-input-panel-texts">
                    <div className="aio-input-panel-text">{text}</div>
                    {subtext !== undefined && <div className="aio-input-panel-subtext">{subtext}</div>}
                </div>
                <div className="aio-input-panel-after">{!!after && after}</div>
            </div>);
    }
    function body_layout() { return (<div className="aio-input-panel-body">{body}</div>); }
    return (<div className="aio-input-panel">{header_layout()} {body_layout()}</div>);
};
exports.AIPanel = AIPanel;
var AISwitch = function (_a) {
    var _b = _a.colors, colors = _b === void 0 ? ['#555', 'orange'] : _b, _c = _a.size, size = _c === void 0 ? [16, 2, 3, 48] : _c, value = _a.value, _d = _a.onChange, onChange = _d === void 0 ? function () { } : _d;
    function getContainerStyle() {
        return {
            paddingRight: size[0] + size[1], paddingLeft: size[1],
            border: "".concat(size[2], "px solid ").concat(value ? colors[1] : colors[0])
        };
    }
    function getOuterStyle() {
        return { width: size[3] - size[0] - size[1], height: size[0] + (2 * size[1]) };
    }
    function getInnerStyle() {
        return { width: size[0], height: size[0], top: "calc(50% - ".concat(size[0] / 2, "px)"), background: value ? colors[1] : colors[0] };
    }
    return (<div className={"aio-input-switch".concat(value ? ' active' : '')} style={getContainerStyle()} onClick={function () { return onChange(!value); }}>
            <div className="aio-input-switch-outer" style={getOuterStyle()}>
                <div className="aio-input-switch-inner" style={getInnerStyle()}></div>
            </div>
        </div>);
};
exports.AISwitch = AISwitch;
function AIOInput_defaultProps(p) {
    var storage = new aio_utils_1.Storage('aio-input-storage');
    for (var prop in p) {
        storage.save(prop, p[prop]);
    }
}
exports.AIOInput_defaultProps = AIOInput_defaultProps;
function getTypes(props) {
    function isDropdown() {
        if (['select', 'date', 'time'].indexOf(type) !== -1) {
            return true;
        }
        if (['text', 'number', 'textarea'].indexOf(type) !== -1 && props.options) {
            return true;
        }
        if (type === 'button' && props.popover) {
            return true;
        }
        return false;
    }
    var type = props.type, multiple = props.multiple;
    var isMultiple;
    if (type === 'table' || type === 'tags') {
        isMultiple = true;
    }
    else if (['radio', 'range', 'file', 'buttons', 'select', 'date', 'acardion'].indexOf(type) !== -1) {
        isMultiple = !!multiple;
    }
    else {
        isMultiple = false;
    }
    ;
    return {
        isMultiple: isMultiple,
        isInput: ['text', 'number', 'textarea', 'password'].indexOf(type) !== -1,
        isDropdown: isDropdown(),
        hasOption: ['text', 'number', 'textarea', 'color', 'select', 'radio', 'tabs', 'list', 'buttons', 'tags'].indexOf(type) !== -1,
        hasPlaceholder: ['text', 'number', 'textarea', 'color', 'select', 'table', 'image', 'date'].indexOf(type) !== -1,
        hasKeyboard: ['text', 'textarea', 'number', 'password'].indexOf(type) !== -1,
        hasText: ['checkbox', 'button', 'select'].indexOf(type) !== -1,
        hasSearch: ['table', 'select'].indexOf(type) !== -1
    };
}
function getDefaultProps(props, types) {
    var valueType = Array.isArray(props.value) ? 'array' : typeof props.value;
    props = __assign({}, props);
    if (props.type === 'select') {
        if (!!props.multiple) {
            if (props.text === undefined) {
                props.text = 'Select Items';
            }
        }
    }
    else if (props.type === 'time') {
        if (!props.value) {
            props.value = {};
        }
    }
    else if (props.type === 'acardion') {
        props.deSelect = true;
    }
    else if (props.type === 'date') {
        if (props.multiple) {
            props.option = __assign(__assign({}, props.option), { text: 'option', value: 'option' });
        }
    }
    if (props.loading === true) {
        props.disabled = true;
    }
    if (types.isMultiple) {
        if (!props.value) {
            props.value = [];
        }
        else if (valueType !== 'array') {
            props.value = [props.value];
        }
    }
    else {
        if (props.type === 'tree') { }
        else if (valueType === 'array') {
            props.value = props.value[0];
        }
    }
    return props;
}
function Def(prop) {
    var res = {
        'theme': [],
        'date-size': 180,
        'tree-size': 36,
        'range-size': 72,
        'date-unit': 'day'
    }[prop];
    return res;
}
function I(path, size, p) { return new aio_utils_1.GetSvg().getIcon(path, size, p); }
//isOpen ro baraye tashkhise active(open) boodane node haye tree mifrestim
function GetOptions(p) {
    var options = p.options, rootProps = p.rootProps, types = p.types, level = p.level, isOpen = p.isOpen, change = p.change, _a = p.defaultOptionProps, defaultOptionProps = _a === void 0 ? {} : _a;
    var deSelect = rootProps.deSelect;
    var result = [];
    var dic = {};
    var draggable = types.isDropdown && types.hasOption && !!rootProps.onSwap;
    function getDefaultOptionChecked(v) {
        if (rootProps.type === 'select' && types.isMultiple) {
            return rootProps.value.indexOf(v) !== -1;
        }
        if (rootProps.type === 'radio') {
            return types.isMultiple ? rootProps.value.indexOf(v) !== -1 : rootProps.value === v;
        }
    }
    if (deSelect && typeof deSelect !== 'function' && deSelect !== true) {
        options = __spreadArray([deSelect], options, true);
    }
    function isActive(optionValue) {
        if (rootProps.type === 'tree') {
            return !!isOpen && !!isOpen(optionValue);
        }
        else if (types.isMultiple) {
            return rootProps.value.indexOf(optionValue) !== -1;
        }
        else {
            return optionValue === rootProps.value;
        }
    }
    var _loop_5 = function (i) {
        var option = options[i];
        var optionDetails = {
            option: option,
            index: i, active: false,
            level: level,
            rootProps: rootProps,
            change: change ? function (newRow) { if (change)
                change(option, newRow); } : undefined,
        };
        var disabled = !!rootProps.disabled || !!rootProps.loading || !!GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'disabled' });
        //ghabl az har chiz sharte namayesh ro check kon
        var show = GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'show' });
        if (show === false) {
            return "continue";
        }
        var optionValue = GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'value' });
        var active = isActive(optionValue);
        var text = GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'text' });
        //hala ke value ro dari active ro rooye details set kon ta baraye gereftane ettelaat active boodan moshakhas bashe
        optionDetails.active = active;
        var attrs = GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'attrs', def: {} });
        var defaultChecked = getDefaultOptionChecked(optionValue);
        var checked = GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'checked', def: defaultChecked });
        //object:option => do not remove mutability to use original value of option in for example tree row
        var obj = {
            show: show,
            loading: rootProps.loading,
            attrs: attrs,
            text: text,
            value: optionValue,
            disabled: disabled,
            draggable: draggable,
            checkIcon: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'checkIcon' }) || rootProps.checkIcon,
            checked: checked,
            toggleIcon: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, def: true, key: 'toggleIcon' }),
            before: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'before' }),
            after: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'after' }),
            justify: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'justify' }),
            subtext: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'subtext' }),
            onClick: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'onClick', preventFunction: true }),
            className: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'className' }),
            style: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'style' }),
            tagAttrs: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'tagAttrs' }),
            tagBefore: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'tagBefore' }),
            close: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'close', def: !types.isMultiple }),
            tagAfter: GetOptionProps({ rootProps: rootProps, optionDetails: optionDetails, defaultOptionProps: defaultOptionProps, key: 'tagAfter' }),
            details: optionDetails
        };
        result.push(obj);
        dic['a' + obj.value] = obj;
    };
    for (var i = 0; i < options.length; i++) {
        _loop_5(i);
    }
    return { optionsList: result, optionsDic: dic };
}
function GetOptionProps(p) {
    var rootProps = p.rootProps, key = p.key, def = p.def, preventFunction = p.preventFunction, optionDetails = p.optionDetails, _a = p.defaultOptionProps, defaultOptionProps = _a === void 0 ? {} : _a;
    var option = optionDetails.option;
    var optionResult = typeof option[key] === 'function' && !preventFunction ? option[key](optionDetails) : option[key];
    if (optionResult !== undefined) {
        return optionResult;
    }
    var prop = (rootProps.option || {})[key];
    prop = prop === undefined ? defaultOptionProps[key] : prop;
    if (typeof prop === 'string') {
        try {
            var value = void 0;
            eval('value = ' + prop);
            return value;
        }
        catch (_b) { }
    }
    if (typeof prop === 'function' && !preventFunction) {
        var res = prop(optionDetails);
        return res === undefined ? def : res;
    }
    return prop !== undefined ? prop : def;
}
function getTimeByUnit(rootProps, justToday) {
    var _a = rootProps.value, value = _a === void 0 ? {} : _a, jalali = rootProps.jalali, _b = rootProps.unit, unit = _b === void 0 ? { year: true, month: true, day: true } : _b;
    function getToday() {
        var today = new aio_date_1.default().getToday(jalali);
        return { year: today[0], month: today[1], day: today[2], hour: today[3], minute: today[4], second: today[5] };
    }
    var today = getToday();
    var newValue = {};
    var u;
    for (u in unit) {
        if (unit[u] === true) {
            var v = value[u];
            var min = { year: 1000, month: 1, day: 1, hour: 0, minute: 0, second: 0 }[u];
            var max = { year: 3000, month: 12, day: 31, hour: 23, minute: 59, second: 59 }[u];
            if (v !== undefined && typeof v !== 'number' || v < min || v > max) {
                alert("aio input error => in type time value.".concat(u, " should be an number between ").concat(min, " and ").concat(max));
            }
            var res = v === undefined || justToday ? today[u] : v;
            var step = rootProps.timeStep && rootProps.timeStep[u] ? rootProps.timeStep[u] : undefined;
            if (step) {
                res = Math.round(res / step) * step;
            }
            newValue[u] = res;
        }
    }
    return newValue;
}
function getTimeText(rootProps) {
    var value = getTimeByUnit(rootProps);
    if (!value) {
        if (typeof rootProps.placeholder === 'string') {
            return rootProps.placeholder;
        }
        if (typeof rootProps.text === 'string') {
            return rootProps.text;
        }
        return '';
    }
    if (rootProps.pattern) {
        return new aio_date_1.default().getDateByPattern(value, rootProps.pattern);
    }
    if (rootProps.text !== undefined) {
        return rootProps.text;
    }
    var text = [], dateArray = [];
    if (value.year !== undefined) {
        dateArray.push((0, aio_utils_1.Get2Digit)(value.year));
    }
    if (value.month !== undefined) {
        dateArray.push((0, aio_utils_1.Get2Digit)(value.month));
    }
    if (value.day !== undefined) {
        dateArray.push((0, aio_utils_1.Get2Digit)(value.day));
    }
    if (dateArray.length) {
        text.push(dateArray.join('/'));
    }
    var timeArray = [];
    if (value.hour !== undefined) {
        timeArray.push((0, aio_utils_1.Get2Digit)(value.hour));
    }
    if (value.minute !== undefined) {
        timeArray.push((0, aio_utils_1.Get2Digit)(value.minute));
    }
    if (value.second !== undefined) {
        timeArray.push((0, aio_utils_1.Get2Digit)(value.second));
    }
    if (timeArray.length) {
        text.push(timeArray.join(':'));
    }
    return text.join(' ');
}
var AIText = function (props) { return <AIOInput {...props} type='text'/>; };
exports.AIText = AIText;
var AINumber = function (props) { return <AIOInput {...props} type='number'/>; };
exports.AINumber = AINumber;
var AITextarea = function (props) { return <AIOInput {...props} type='textarea'/>; };
exports.AITextarea = AITextarea;
var AIPassword = function (props) { return <AIOInput {...props} type='password'/>; };
exports.AIPassword = AIPassword;
var AIColor = function (props) { return <AIOInput {...props} type='color'/>; };
exports.AIColor = AIColor;
var AISelect = function (props) { return <AIOInput {...props} type='select'/>; };
exports.AISelect = AISelect;
var AIRadio = function (props) { return <AIOInput {...props} type='radio'/>; };
exports.AIRadio = AIRadio;
var AITabs = function (props) { return <AIOInput {...props} type='tabs'/>; };
exports.AITabs = AITabs;
var AIButtons = function (props) { return <AIOInput {...props} type='buttons'/>; };
exports.AIButtons = AIButtons;
var AITags = function (props) { return <AIOInput {...props} type='tags'/>; };
exports.AITags = AITags;
var AITree = function (props) { return <AIOInput {...props} type='tree'/>; };
exports.AITree = AITree;
var AIImage = function (props) { return <AIOInput {...props} type='image'/>; };
exports.AIImage = AIImage;
var AIFile = function (props) { return <AIOInput {...props} type='file'/>; };
exports.AIFile = AIFile;
var AICheckbox = function (props) { return <AIOInput {...props} type='checkbox'/>; };
exports.AICheckbox = AICheckbox;
var AIDate = function (props) { return <AIOInput {...props} type='date'/>; };
exports.AIDate = AIDate;
var AITime = function (props) { return <AIOInput {...props} type='time'/>; };
exports.AITime = AITime;
var AISlider = function (props) { return <AIOInput {...props} type='slider'/>; };
exports.AISlider = AISlider;
var AISpinner = function (props) { return <AIOInput {...props} type='spinner'/>; };
exports.AISpinner = AISpinner;
var AIAcardion = function (props) { return <AIOInput {...props} type='acardion'/>; };
exports.AIAcardion = AIAcardion;
var AIList = function (props) { return <AIOInput {...props} type='list'/>; };
exports.AIList = AIList;
var AITable = function (props) { return <AIOInput {...props} type='table'/>; };
exports.AITable = AITable;
var MonthCalendar = function (_a) {
    var date = _a.date, _b = _a.onClick, onClick = _b === void 0 ? function () { } : _b, _c = _a.dateAttrs, dateAttrs = _c === void 0 ? function () { return ({}); } : _c;
    var DATE = new aio_date_1.default();
    var jalali = (0, react_1.useState)(DATE.isJalali(date))[0];
    var monthStrings = (0, react_1.useState)(DATE.getMonths(jalali))[0];
    var firstDayIndex = (0, react_1.useState)(DATE.getWeekDay([date[0], date[1], 1]).index)[0];
    var monthDaysLength = (0, react_1.useState)(DATE.getMonthDaysLength(date))[0];
    function weekDays_layout() { return DATE.getWeekDays(true).map(function (o) { return <div className="month-calendar-weekday">{o[0]}</div>; }); }
    function spaces_layout() { return new Array(firstDayIndex).fill(0).map(function () { return <div className=""></div>; }); }
    function cells_layout() { return new Array(monthDaysLength).fill(0).map(function (o, i) { return cell_layout([date[0], date[1], i + 1]); }); }
    function cell_layout(dateArray) {
        var attrs = (0, aio_utils_1.AddToAttrs)(dateAttrs(dateArray), { className: "month-calendar-day", attrs: { onClick: function () { return onClick(dateArray); } } });
        return (<div {...attrs}>{dateArray[2]}</div>);
    }
    return (<div className="month-calendar">
            <div className="month-calendar-title">{monthStrings[date[1] - 1]}</div>
            <div className="month-calendar-weekdays">{weekDays_layout()}</div>
            <div className="month-calendar-days">{spaces_layout()} {cells_layout()}</div>
        </div>);
};
exports.MonthCalendar = MonthCalendar;
var PrismCode = function (_a) {
    var code = _a.code, _b = _a.language, language = _b === void 0 ? 'js' : _b, _c = _a.style, style = _c === void 0 ? {} : _c;
    (0, react_1.useEffect)(function () { prismjs_1.default.highlightAll(); }, []);
    return (<div className="aio-doc-code" style={style}>
            <pre style={{ height: '100%', overflow: 'auto' }}>
                <code className={"language-".concat(language)}>{code}</code>
            </pre>
        </div>);
};
function Code(code, language, style) {
    return <PrismCode code={code} language={language} style={style}/>;
}
exports.Code = Code;
function AIOLogin_updateCatchedUser(loginId, newUser) {
    var storage = new aio_utils_1.Storage('ai-login' + loginId);
    var storedData = storage.load('data');
    if (!storedData) {
        return newUser;
    }
    var newStoredData = __assign(__assign({}, storedData), { user: newUser });
    return storage.save('data', newStoredData);
}
exports.AIOLogin_updateCatchedUser = AIOLogin_updateCatchedUser;
var AILogin = function (props) {
    var renderApp = props.renderApp, _a = props.translate, translate = _a === void 0 ? function () { } : _a, id = props.id, rememberTime = props.rememberTime, checkToken = props.checkToken, splash = props.splash, _b = props.otpLength, otpLength = _b === void 0 ? 4 : _b;
    var _c = props.validation, validation = _c === void 0 ? function () { return undefined; } : _c;
    var _d = (0, react_1.useState)(), data = _d[0], setData = _d[1];
    var storage = (0, react_1.useState)(new aio_utils_1.Storage('ai-login' + id))[0];
    var _e = (0, react_1.useState)(getModel), model = _e[0], setModel = _e[1];
    var modelRef = (0, react_1.useRef)(model);
    modelRef.current = model;
    var _f = (0, react_1.useState)(getMode()), mode = _f[0], setMode = _f[1];
    function getModeKey() {
        if (props.mode) {
            return props.mode;
        }
        if (props.userpass) {
            return 'userpass';
        }
        if (props.otp) {
            return 'otpnumber';
        }
        return 'userpass';
    }
    function getMode(mode) {
        var res = { inputs: function () { return null; }, key: mode || getModeKey(), title: null, submitText: '', responseUserType: false };
        if (res.key === 'userpass') {
            res.inputs = function () {
                return (<>
                        <exports.AIText {...input_props('userName')}/>
                        <exports.AIPassword {...input_props('password')} preview={true}/>
                    </>);
            };
            res.responseUserType = true;
        }
        else if (res.key === 'register') {
            if (props.register) {
                var inputs_1 = (props.register.inputs || (function () { return []; }))(modelRef.current) || [];
                res.inputs = function () {
                    var model = modelRef.current;
                    return (<>
                        <exports.AIText {...input_props('userName', true)}/>
                        <exports.AIPassword {...input_props('password', true)} preview={true}/>
                        <exports.AIPassword {...{
                        label: props.label('rePassword'), rtl: props.rtl, value: model.register.rePassword, preview: true,
                        onChange: function (v) { return setModel(__assign(__assign({}, model), { register: __assign(__assign({}, model.register), { rePassword: v }) })); }
                    }}/>
                        {inputs_1.map(function (input) {
                            var value = model.register[input.field];
                            return (<AIOInput key={input.field} rtl={props.rtl} label={props.label(input.field)} {...input} value={value} onChange={function (v) {
                                var _a;
                                return setModel(__assign(__assign({}, model), { register: __assign(__assign({}, model.register), (_a = {}, _a[input.field] = v, _a)) }));
                            }}/>);
                        })}
                    </>);
                };
            }
        }
        else if (res.key === 'otpnumber') {
            res.inputs = function () { return <exports.AIText {...input_props('otpNumber')} justNumber={true} maxLength={11}/>; };
        }
        else if (res.key === 'otpcode') {
            res.inputs = function () { return <exports.AIText {...input_props('otpCode')} justNumber={true} maxLength={otpLength}/>; };
            res.responseUserType = true;
        }
        res.submitText = trans(res.key + 'Button');
        res.title = <div className="ai-login-title">{trans(res.key + 'Title')}</div>;
        return res;
    }
    function getModel() {
        var _a;
        var model = { userName: '', password: '', otpNumber: '', otpCode: '', register: { userName: '', password: '', rePassword: '' } };
        if (!props.register) {
            return model;
        }
        if ((_a = props.register) === null || _a === void 0 ? void 0 : _a.defaultValue) {
            var register = {};
            for (var prop in props.register.defaultValue) {
                register[prop] = props.register.defaultValue[prop];
            }
            model.register = register;
        }
        return model;
    }
    var _g = (0, react_1.useState)(true), loading = _g[0], setLoading = _g[1];
    var _h = (0, react_1.useState)(!!splash), splashing = _h[0], setSplashing = _h[1];
    var popup = (0, react_1.useState)(new aio_popup_1.default())[0];
    function trans(key) {
        var dic = {
            registerButton: { en: 'Register', fa: 'ثبت نام' },
            userpassButton: { en: 'Login', fa: 'ورود' },
            otpnumberButton: { en: 'Send Number', fa: 'ارسال شماره همراه' },
            otpcodeButton: { en: 'Login', fa: 'ورود' },
            registerTitle: { en: 'Register', fa: 'ثبت نام' },
            userpassTitle: { en: 'Login', fa: 'ورود' },
            otpcodeTitle: { en: 'OTP Code', fa: 'کد یکبار مصرف' },
            otpnumberTitle: { en: 'Phone Number', fa: 'شماره همراه' },
            switchuserpass: { en: 'login by user name', fa: 'ورود با نام کاربری' },
            switchregister: { en: 'Go To Register', fa: 'ثبت نام' },
            switchotp: { en: 'login by otp', fa: 'ورود با رمز یکبار مصرف' },
            rePasswordMatch: { en: 'Password is not match with Re password', fa: 'رمز عبور با تکرار آن مطابقت ندارد' },
            userNameRequired: { en: 'User Name is required', fa: 'نام کاربری ضروری است' },
            passwordRequired: { en: 'password is required', fa: 'رمز عبور ضروری است' },
            rePasswordRequired: { en: 'Re Password is required', fa: 'تکرار رمز عبور ضروری است' },
            otpNumberRequired: { en: 'Phone Number is required', fa: 'شماره همراه ضروری است' },
            otpCodeLength: { en: "otp code should be ".concat(otpLength, " digit"), fa: "\u06A9\u062F \u06CC\u06A9\u0628\u0627\u0631 \u0645\u0635\u0631\u0641 \u0628\u0627\u06CC\u062F ".concat(otpLength, " \u0631\u0642\u0645 \u0628\u0627\u0634\u062F") },
            registerError: { en: 'Registeration failed', fa: 'ثبت نام با خطا روبرو شد' },
            userpassError: { en: 'login by userName failed', fa: 'ورود با نام کاربری با خطا روبرو شد' },
            otpcodeError: { en: 'login by otp failed', fa: 'ورود با کد یکبار مصرف با خطا روبرو شد' },
            otpnumberError: { en: 'send otp number for receive otp code failed', fa: 'ارسال شماره همراه برای دریافت کد یکبار مصرف با خطا روبرو شد' },
        };
        return translate === 'fa' ? dic[key].fa : translate(key) || dic[key].en;
    }
    function userpassCallback(p) { storage.save('data', p); setData(p); }
    function registerCallback() { window.location.reload(); }
    function otpNumberCallback() { setMode(getMode('otpcode')); }
    function otpCodeCallback(p) { storage.save('data', p); setData(p); }
    function success(response) {
        return __awaiter(this, void 0, void 0, function () {
            var modeKey, callback, onSuccess, message, res, err_1, defaultMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modeKey = mode.key;
                        callback = { userpass: userpassCallback, register: registerCallback, otpnumber: otpNumberCallback, otpcode: otpCodeCallback }[modeKey];
                        return [4 /*yield*/, props.getRequestOptions(modelRef.current, mode.key)];
                    case 1:
                        onSuccess = (_a.sent()).onSuccess;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, onSuccess(response)];
                    case 3:
                        res = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        setAlert({ type: 'error', text: trans(modeKey + 'Error'), subtext: err_1.message });
                        return [2 /*return*/];
                    case 5:
                        if (typeof res === 'string') {
                            message = res;
                        }
                        defaultMessage = {
                            userpass: 'modes.userpass onSuccess props should returns string as error or {user:any,token:string} as success',
                            register: 'modes.register onSuccess props should returns string as error or true as success',
                            otpnumber: 'modes.otp.onSubmitNumber onSuccess props should returns string as error or true as success',
                            otpcode: 'modes.otp.onSubmitCode onSuccess props should returns string as error or {user:any,token:string} as success'
                        }[modeKey];
                        if (mode.responseUserType) {
                            if (typeof res !== 'object' || !res.user || typeof res.token !== 'string') {
                                message = defaultMessage;
                            }
                        }
                        else if (res !== true) {
                            message = defaultMessage;
                        }
                        if (message) {
                            setAlert({ type: 'error', text: trans(modeKey + 'Error'), subtext: message });
                        }
                        else {
                            callback(res);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function submit() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, url, method, body, onCatch;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, props.getRequestOptions(modelRef.current, mode.key)];
                    case 1:
                        _a = _b.sent(), url = _a.url, method = _a.method, body = _a.body, onCatch = _a.onCatch;
                        axios_1.default[method](url, body).then(success).catch(function (response) {
                            if (onCatch) {
                                setAlert({ type: 'error', text: 'Error', subtext: onCatch(response) });
                            }
                            else if (response.message) {
                                setAlert({ type: 'error', text: 'Error', subtext: response.message });
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
    function changeMode(mode) { setModel(getModel()); setMode(getMode(mode)); }
    function mode_props(key) { return { className: 'ai-login-mode', onClick: function () { return changeMode(key); } }; }
    function mode_layout() {
        return (<div className="ai-login-modes">
                {props.userpass && mode.key !== 'userpass' && <button {...mode_props('userpass')}>{trans('switchuserpass')}</button>}
                {props.register && mode.key !== 'register' && <button {...mode_props('register')}>{trans('switchregister')}</button>}
                {props.otp && mode.key !== 'otpnumber' && <button {...mode_props('otpnumber')}>{trans('switchotp')}</button>}
            </div>);
    }
    function input_props(field, isRegister) {
        var model = modelRef.current;
        return {
            label: props.label(field), rtl: props.rtl, value: model[field], onChange: function (v) {
                var _a, _b;
                if (isRegister) {
                    setModel(__assign(__assign({}, model), { register: __assign(__assign({}, model.register), (_a = {}, _a[field] = v, _a)) }));
                }
                else {
                    setModel(__assign(__assign({}, model), (_b = {}, _b[field] = v, _b)));
                }
            }
        };
    }
    function validate() {
        var model = modelRef.current;
        if (mode.key === 'otpcode') {
            if ((model.otpCode || '').length !== otpLength) {
                return trans('otpCodeLength');
            }
        }
        if (mode.key === 'otpnumber') {
            if (!model.otpNumber) {
                return trans('otpNumberRequired');
            }
        }
        if (mode.key === 'userpass') {
            if (!model.userName) {
                return trans('userNameRequired');
            }
        }
        if (mode.key === 'register') {
            if (!model.register.userName) {
                return trans('userNameRequired');
            }
            if (!model.register.password) {
                return trans('passwordRequired');
            }
            if (!model.register.rePassword) {
                return trans('rePasswordRequired');
            }
            if (model.register.password !== model.register.rePassword) {
                return trans('rePasswordMatch');
            }
        }
        return validation(model, mode.key);
    }
    function submit_layout() {
        var message = validate();
        return (<>
            <div className="ai-login-errors">
                {!!message && <div className="ai-login-error">{message}</div>}
            </div>
            <button className='ai-login-submit' disabled={!!message} onClick={function () { return submit(); }}>{mode.submitText}</button>
        </>);
    }
    function form_layout() {
        var title = mode.title, inputs = mode.inputs;
        return (<div className="ai-login-form">{title}{inputs()}{submit_layout()}{mode_layout()}</div>);
    }
    var bf_layout = function (type) {
        var fn = props[type];
        var content = null;
        if (fn) {
            content = fn(mode.key);
        }
        return (<div className={"ai-login-".concat(type)}>{content}</div>);
    };
    function logout() { storage.remove('data'); window.location.reload(); }
    function CheckToken() {
        return __awaiter(this, void 0, void 0, function () {
            var storedData, user, token, _a, url, method, onSuccess, onCatch;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (splash) {
                            setTimeout(function () { setSplashing(false); }, splash.time);
                        }
                        if (props.mock) {
                            setData({ user: props.mock.user, token: props.mock.token });
                            return [2 /*return*/];
                        }
                        storedData = storage.load('data', {}, rememberTime), user = storedData.user, token = storedData.token;
                        return [4 /*yield*/, checkToken(token || '')];
                    case 1:
                        _a = _b.sent(), url = _a.url, method = _a.method, onSuccess = _a.onSuccess, onCatch = _a.onCatch;
                        if (user && token) {
                            axios_1.default[method](url, { headers: { authorization: "Bearer ".concat(token) } })
                                .then(function (response) {
                                var res;
                                try {
                                    res = onSuccess(response);
                                }
                                catch (err) {
                                    setAlert({ type: 'error', text: 'checkToken failed', subtext: err.message });
                                    return;
                                }
                                if (res === true) {
                                    setData({ user: user, token: token });
                                }
                                else if (res === false) {
                                    logout();
                                }
                                else {
                                    setAlert({ type: 'error', text: 'checkToken failed', subtext: 'checkToken props should return string as error or true as token is valid and false as token is invalid' });
                                }
                            })
                                .catch(function (response) {
                                if (response.message) {
                                    setAlert({ type: 'error', text: 'Error', subtext: response.message });
                                }
                                else {
                                    var res = void 0, message = '';
                                    try {
                                        res = onCatch(response);
                                    }
                                    catch (err) {
                                        message = err.message;
                                    }
                                    if (typeof res === 'string') {
                                        message = res;
                                    }
                                    else if (res === false) {
                                        logout();
                                    }
                                    else {
                                        message = 'AILogin checkToken onCatch props should returns string as error or false as invalid token';
                                    }
                                    if (message) {
                                        setAlert({ type: 'error', text: 'checkToken failed', subtext: message });
                                    }
                                }
                            });
                        }
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useEffect)(function () { CheckToken(); }, []);
    function setAlert(p) { popup.addAlert(p); }
    function getContent() {
        if (loading || splashing) {
            return splash ? splash.html : null;
        }
        if (!data) {
            var attrs = (0, aio_utils_1.AddToAttrs)(props.attrs, { className: 'ai-login', style: { direction: props.rtl ? 'rtl' : undefined } });
            return (<div {...attrs}>{bf_layout('before')} {form_layout()} {bf_layout('after')}</div>);
        }
        return renderApp({ token: data.token, user: data.user, logout: logout });
    }
    return (<>{getContent()} {popup.render()}</>);
};
exports.AILogin = AILogin;
var MAPCTX = (0, react_1.createContext)({});
var AIMap = function (props) {
    var _a = props.zoom, zoom = _a === void 0 ? { value: 14 } : _a, _b = props.value, value = _b === void 0 ? [35.699939, 51.338497] : _b, getSearchResult = props.getSearchResult, onSearch = props.onSearch, mapRef = props.mapRef;
    var _c = (0, react_1.useState)(null), map = _c[0], setMap = _c[1];
    if (mapRef) {
        mapRef.current = map;
    }
    var _d = (0, react_1.useState)(value), pos = _d[0], setPos = _d[1];
    var moveTimeout = (0, react_1.useRef)(undefined);
    function move(pos) {
        setPos(pos);
        if (props.onChange) {
            clearTimeout(moveTimeout.current);
            moveTimeout.current = setTimeout(function () { if (props.onChange) {
                props.onChange(pos);
            } }, 600);
        }
    }
    function getDefaultMarkerIcon() {
        return <div className='marker-icon'><div className='marker-icon-circle'></div><div className='marker-icon-arrow'></div></div>;
    }
    function getContext() { return { pos: pos, setMap: setMap, rootProps: props, move: move, getDefaultMarkerIcon: getDefaultMarkerIcon }; }
    (0, react_1.useEffect)(function () {
        if (map !== null) {
            map.setView(value, zoom.value, { animate: false });
        }
        setPos(value);
    }, [value[0] + '-' + value[1] + '-' + zoom.value]);
    return (<MAPCTX.Provider value={getContext()}>
            <div className="ai-map">
                {!!getSearchResult && <MapHeader />}
                <MapBody />
                <MapFooter />
            </div>
        </MAPCTX.Provider>);
};
exports.AIMap = AIMap;
var MapBody = function () {
    var _a = (0, react_1.useContext)(MAPCTX), rootProps = _a.rootProps, pos = _a.pos, setMap = _a.setMap, getDefaultMarkerIcon = _a.getDefaultMarkerIcon;
    var style = rootProps.style, _b = rootProps.zoom, zoom = _b === void 0 ? { value: 14 } : _b, _c = rootProps.dragging, dragging = _c === void 0 ? true : _c, children = rootProps.children, _d = rootProps.shapes, shapes = _d === void 0 ? [] : _d, marker = rootProps.marker, _e = rootProps.markers, markers = _e === void 0 ? [] : _e, whenReady = rootProps.whenReady;
    var defaultStyle = { width: '100%', height: '100%' };
    return (<react_leaflet_1.MapContainer center={pos} style={__assign(__assign({}, defaultStyle), style)} zoom={zoom.value || 14} scrollWheelZoom={zoom.wheel ? 'center' : undefined} zoomControl={zoom.control !== false} attributionControl={true} dragging={dragging} ref={setMap} whenReady={whenReady}>
            <react_leaflet_1.TileLayer url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"/>
            {/* <TileLayer
          url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}"
          attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          accessToken='pk.eyJ1IjoibXNmMTM2NCIsImEiOiJjbTE1MnlpM20wNTJvMmtyNDhjYjIzMXRhIn0.zRM2a68bNyBsYSeIdV8a4A'
        /> */}
            {/* http://leaflet-extras.github.io/leaflet-providers/preview/ */}
            <MapEvents />
            {marker !== false && <MapMarker key='main-marker' pos={pos} html={(0, react_1.isValidElement)(marker) ? marker : getDefaultMarkerIcon()}/>}
            {markers.map(function (marker, i) { return <MapMarker key={"marker-".concat(i)} pos={marker.pos} html={marker.html}/>; })}
            {shapes.map(function (o, i) { return <MapShape key={i} shape={o}/>; })}
            <MapLayers />
            {children}
        </react_leaflet_1.MapContainer>);
};
var MapHeader = function () {
    var _a = (0, react_1.useContext)(MAPCTX), rootProps = _a.rootProps, move = _a.move;
    var getSearchResult = rootProps.getSearchResult, onSearch = rootProps.onSearch;
    var _b = (0, react_1.useState)(''), searchValue = _b[0], setSearchValue = _b[1];
    var _c = (0, react_1.useState)([]), searchResult = _c[0], setSerachResult = _c[1];
    var timeout = (0, react_1.useRef)();
    function changeSearch(searchValue) {
        var _this = this;
        setSearchValue(searchValue);
        clearTimeout(timeout.current);
        timeout.current = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!getSearchResult) return [3 /*break*/, 2];
                        return [4 /*yield*/, getSearchResult(searchValue)];
                    case 1:
                        res = _a.sent();
                        if (Array.isArray(res)) {
                            setSerachResult(res);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }, 1200);
    }
    return (<div className="ai-map-header">
            <AIOInput type='text' value={searchValue} options={(searchResult || [])} before={I('mdiMagnify', 0.8)} onChange={function (searchValue) { return changeSearch(searchValue); }} option={{
            onClick: function (_a) {
                var option = _a.option;
                if (onSearch) {
                    onSearch(option);
                }
            }
        }}/>
        </div>);
};
var MapLayers = function () {
    var rootProps = (0, react_1.useContext)(MAPCTX).rootProps;
    var layers = rootProps.layers;
    if (!layers) {
        return null;
    }
    var _a = layers.position, position = _a === void 0 ? 'topright' : _a, _b = layers.items, items = _b === void 0 ? [] : _b;
    return (<react_leaflet_1.LayersControl position={position}>
            {items.map(function (o, i) {
            var _a = o.shapes, shapes = _a === void 0 ? [] : _a, _b = o.markers, markers = _b === void 0 ? [] : _b, _c = o.active, active = _c === void 0 ? true : _c;
            return (<react_leaflet_1.LayersControl.Overlay name={o.name} checked={active} key={i}>
                            <react_leaflet_1.FeatureGroup>
                                {markers.map(function (marker, j) {
                    return <MapMarker key={j} pos={marker.pos} html={marker.html}/>;
                })}
                                {shapes.map(function (shape, k) {
                    return <MapShape key={k} shape={shape}/>;
                })}
                            </react_leaflet_1.FeatureGroup>
                        </react_leaflet_1.LayersControl.Overlay>);
        })}
        </react_leaflet_1.LayersControl>);
};
var MapShape = function (_a) {
    var shape = _a.shape;
    var _b = shape.style, style = _b === void 0 ? {} : _b, type = shape.type, _c = style.stroke, stroke = _c === void 0 ? {} : _c, _d = style.fill, fill = _d === void 0 ? {} : _d;
    var _e = stroke.width, width = _e === void 0 ? 4 : _e, dash = stroke.dash, _f = stroke.color, strokeColor = _f === void 0 ? 'orange' : _f;
    var _g = fill.color, fillColor = _g === void 0 ? 'orange' : _g, _h = fill.opacity, opacity = _h === void 0 ? 0.3 : _h;
    var pathOptions = { fillColor: fillColor, color: strokeColor, fillOpacity: opacity, weight: width, dashArray: dash };
    if (type === 'circle') {
        var center = shape.center, _j = shape.radius, radius = _j === void 0 ? 100 : _j;
        return (<react_leaflet_1.Circle center={center} pathOptions={pathOptions} radius={radius}/>);
    }
    else if (type === 'rect') {
        return (<react_leaflet_1.Rectangle bounds={shape.points} pathOptions={pathOptions}/>);
    }
    else if (type === 'polyline') {
        return (<react_leaflet_1.Polyline positions={shape.points} pathOptions={pathOptions}/>);
    }
    return null;
};
var MapFooter = function () {
    var _a = (0, react_1.useContext)(MAPCTX), rootProps = _a.rootProps, pos = _a.pos;
    var _b = rootProps.submitText, submitText = _b === void 0 ? 'Submit' : _b, onSubmit = rootProps.onSubmit, footer = rootProps.footer;
    if (!onSubmit && !footer) {
        return null;
    }
    return (<div className="ai-map-footer">
            {!!onSubmit && <button type='button' onClick={function () { return onSubmit(pos); }}>{submitText}</button>}
            <div className="ai-map-footer-html">{footer || null}</div>
        </div>);
};
var MapMarker = function (_a) {
    var pos = _a.pos, html = _a.html;
    var getDefaultMarkerIcon = (0, react_1.useContext)(MAPCTX).getDefaultMarkerIcon;
    function getHtmlIcon(html) {
        return (0, leaflet_1.divIcon)({
            html: (0, aio_utils_1.JSXToHTML)(html),
            className: '', // Optional, for adding custom styles
            iconSize: [32, 32], // size of the icon
            iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
        });
    }
    html = html || getDefaultMarkerIcon();
    var props = { position: pos };
    if (html) {
        props.icon = getHtmlIcon(html);
    }
    return <react_leaflet_1.Marker {...props} animate={false}/>;
};
function MapEvents() {
    var _a = (0, react_1.useContext)(MAPCTX), rootProps = _a.rootProps, move = _a.move;
    var map = (0, react_leaflet_1.useMapEvents)({
        click: function () { return rootProps.onClick ? rootProps.onClick() : undefined; },
        move: function (e) {
            if (rootProps.dragging === false) {
                return;
            }
            var _a = e.target.getCenter(), lat = _a.lat, lng = _a.lng;
            move([lat, lng]);
        },
        zoom: function (e) {
            if (rootProps.onChangeZoom) {
                rootProps.onChangeZoom(e.target._zoom);
            }
        },
        locationfound: function (location) {
            console.log('location found:', location);
        },
        moveend: function (e) {
            if (rootProps.onMoveEnd) {
                rootProps.onMoveEnd(e);
            }
        }
    });
    return null;
}
var AIApp = function (props) {
    function header_layout() {
        if (!props.header) {
            return null;
        }
        var header = props.header();
        if (header === false) {
            return null;
        }
        return (<div className="ai-app-header">{header}</div>);
    }
    function body_layout() {
        return (<div className="ai-app-body">
                {props.body()}
            </div>);
    }
    function bottomMenu_layout() {
        return (<AIBottomMenu bottomMenu={props.bottomMenu}/>);
    }
    var attrs = (0, aio_utils_1.AddToAttrs)(props.attrs, { className: 'ai-app' });
    return (<div {...attrs}>
            {header_layout()}
            {body_layout()}
            {bottomMenu_layout()}
            {!!props.children && props.children}
        </div>);
};
exports.AIApp = AIApp;
var AIBottomMenu = function (_a) {
    var bottomMenu = _a.bottomMenu;
    var options = bottomMenu.options, onChange = bottomMenu.onChange;
    function item_layout(item) {
        if (item.show === false) {
            return null;
        }
        return (<div key={item.value} className={"ai-app-bottom-menu-option".concat(item.active ? ' active' : '')} onClick={function () { return onChange(item.value); }}>
                {!!item.before && item.before}
                <div className="ai-app-bottom-menu-option-body">
                    {item.text !== undefined && item.text}
                    {item.text === undefined &&
                <>
                            <div className="ai-app-bottom-menu-uptext">{item.uptext}</div>
                            <div className="ai-app-bottom-menu-subtext">{item.subtext}</div>
                        </>}
                </div>
                {!!item.after && item.after}

            </div>);
    }
    return (<div className="ai-app-bottom-menu">
            {options.map(function (o, i) { return item_layout(o); })}
        </div>);
};
var Mask = function (props) {
    var dom = (0, react_1.useState)((0, react_1.createRef)())[0];
    // let pattern:I_mask_pattern = [
    //     ['number',4],
    //     ['-',1],
    //     ['number',4],
    //     ['-',1],
    //     ['number',4],
    //     ['-',1],
    //     ['number',4],
    //     ['-',1],
    //     ['select',1,['a','b','c','d','e','f']],
    //     ['-',1,<div style={{width:12,height:12,borderRadius:'100%',background:'red',marginRight:6}}></div>],
    //     ['text',3],
    // ]
    var _a = (0, react_1.useState)(props.value || ''), value = _a[0], setValue = _a[1];
    var _b = (0, react_1.useState)(getValues(props.value || '')), values = _b[0], setValues = _b[1];
    var valuesRef = (0, react_1.useRef)(values);
    valuesRef.current = values;
    (0, react_1.useEffect)(function () {
        setValue(props.value || '');
        setValues(getValues(props.value || ''));
    }, [props.value]);
    function getValues(value) {
        var values = [];
        var temp = value;
        for (var _i = 0, _a = props.pattern; _i < _a.length; _i++) {
            var o = _a[_i];
            if (o[0] === 'number' || o[0] === 'text' || o[0] === 'select') {
                var length_2 = +o[1];
                var value_3 = temp.slice(0, length_2);
                values.push(value_3);
                temp = temp.slice(length_2, temp.length);
            }
            else {
                temp = temp.slice(o[1], temp.length);
            }
        }
        return values;
    }
    function SetValue(values, inputIndex, patternIndex) {
        var tempInputIndex = -1;
        console.log(values);
        var temp = '';
        for (var i = 0; i < props.pattern.length; i++) {
            var o = props.pattern[i];
            if (o[0] === 'number' || o[0] === 'text' || o[0] === 'select') {
                tempInputIndex++;
                var length_3 = +o[1];
                var res = values[tempInputIndex];
                var delta = length_3 - res.length;
                if (delta) {
                    var emp = o[0] === 'number' ? '0' : 'x';
                    for (var j = 0; j < delta; j++) {
                        res = emp + res;
                    }
                    values[tempInputIndex] = res;
                }
                else if (patternIndex === i) {
                    var inputs = (0, jquery_1.default)(dom.current).find('.aio-input');
                    var length_4 = inputs.length;
                    inputIndex++;
                    if (inputIndex > length_4) {
                        inputIndex = 0;
                    }
                    var input = inputs.eq(inputIndex).find('input');
                    if (input.length) {
                        input.focus().select();
                    }
                }
                temp += res;
            }
            else {
                temp += o[0];
            }
        }
        setValue(temp);
        props.onChange(temp);
        setValues(values);
    }
    function changeValue(value, inputIndex, patternIndex) {
        var newValues = valuesRef.current.map(function (o, j) { return inputIndex === j ? value : o; });
        SetValue(newValues, inputIndex, patternIndex);
    }
    function getList() {
        var temp = 0;
        return props.pattern.map(function (o, patternIndex) {
            var type = o[0];
            var inputIndex = temp;
            if (type === 'text' || type === 'number') {
                var length_5 = +o[1];
                temp++;
                return (<exports.AIText style={{ width: length_5 * 10 }} placeholder={new Array(length_5).fill('x').join('')} maxLength={length_5} justNumber={type === 'number'} value={valuesRef.current[inputIndex]} onChange={function (v) { return changeValue(v, inputIndex, patternIndex); }}/>);
            }
            else if (type === 'select') {
                var options = o[2];
                temp++;
                return (<exports.AISelect style={{ width: 'fit-content' }} options={options} option={{ text: 'option', value: 'option' }} value={valuesRef.current[inputIndex]} onChange={function (v) { return changeValue(v, inputIndex, patternIndex); }}/>);
            }
            else {
                return <div className='aio-input-mask-gap'>{o[2] || o[0]}</div>;
            }
        });
    }
    return (<div className='example'>
            <div className='aio-input-mask' ref={dom} title={value}>
                {getList()}
            </div>
        </div>);
};
exports.Mask = Mask;
var MonthCells = function (_a) {
    var year = _a.year, month = _a.month, cellContent = _a.cellContent, weekDayContent = _a.weekDayContent;
    var DATE = (0, react_1.useState)(new aio_date_1.default())[0];
    var monthes = (0, react_1.useState)(DATE.getMonths(true))[0];
    function getDateInfo() {
        var res = {
            monthDaysLength: DATE.getMonthDaysLength([year, month]),
            firstDayIndex: DATE.getWeekDay([year, month, 1]).index,
            monthString: DATE.getMonths(true)[month - 1]
        };
        console.log(res, year, month);
        return res;
    }
    var gtc = Math.floor(100 / 7);
    var gridTemplateColumns = "".concat(gtc, "% ").concat(gtc, "% ").concat(gtc, "% ").concat(gtc, "% ").concat(gtc, "% ").concat(gtc, "% ").concat(gtc, "%");
    function weekDays_layout() {
        if (!weekDayContent) {
            return null;
        }
        return (<div className="month-cells-grid" style={{ gridTemplateColumns: gridTemplateColumns }}>
                {DATE.getWeekDays(true).map(function (o, i) { return <div key={o} className={"month-cells-weekday"}>{weekDayContent(i)}</div>; })}
            </div>);
    }
    function spaces_layout() { return new Array(dateInfo.firstDayIndex).fill(0).map(function (o, i) { return <div key={i} className=""></div>; }); }
    function cells_layout() { return (0, aio_utils_1.GetArray)(dateInfo.monthDaysLength).map(function (day) { return cell_layout(day + 1); }); }
    function cell_layout(day) {
        var date = [year, month, day];
        var weekDayIndex = DATE.getWeekDay(date).index;
        return (<div key={day} className="month-cells-cell">{cellContent(date, weekDayIndex)}</div>);
    }
    var dateInfo = getDateInfo();
    return (<div className="month-cells">
            <div className="month-cells-body">
                {weekDays_layout()}
                <div className="month-cells-grid" style={{ gridTemplateColumns: gridTemplateColumns }}>{spaces_layout()} {cells_layout()}</div>
            </div>
        </div>);
};
exports.MonthCells = MonthCells;
