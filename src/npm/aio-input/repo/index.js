var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createRef, useContext, createContext, useState, useEffect, useRef, Fragment, isValidElement } from 'react';
import usePopup from "aio-popup";
import * as UT from 'aio-utils';
import AIODate from 'aio-date';
import { Indent, GetSvg } from 'aio-component-utils';
import $ from 'jquery';
import './index.css';
const AICTX = createContext({});
const AIOInput = (props) => {
    let type = props.type, round = props.round;
    let value = props.value;
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
    let rootProps = Object.assign(Object.assign({}, props), { type, round, value });
    if (type === 'text' && rootProps.getOptions) {
        return _jsx(SuggestionInput, Object.assign({}, rootProps));
    }
    return _jsx(AIOINPUT, Object.assign({}, rootProps));
};
export default AIOInput;
const SuggestionInput = (props) => {
    const { getOptions, option = {}, onChange } = props;
    const [searchResult, SetSearchResult] = useState([]);
    const [value, setValue] = useState('');
    function setSearchResult(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            setValue(newValue);
            if (!newValue) {
                SetSearchResult([]);
                return;
            }
            const res = getOptions ? yield getOptions(newValue) : [];
            SetSearchResult(res);
        });
    }
    return (_jsx(AIOInput, Object.assign({}, props, { value: value, options: searchResult, option: Object.assign(Object.assign({}, option), { onClick: (optionOrg, optionDetails) => {
                const text = GetOptionProps({ optionProp: option, key: 'text', optionDetails, optionOrg });
                setSearchResult(text);
                if (onChange) {
                    onChange(text, optionOrg);
                }
            } }), getOptions: undefined, onChange: (newValue) => {
            setSearchResult(newValue);
            if (onChange) {
                onChange(newValue);
            }
        } })));
};
function AIOINPUT(props) {
    let [types] = useState(getTypes(props));
    let [DATE] = useState(new AIODate());
    props = getDefaultProps(props, types);
    let { type, value, onChange, attrs = {}, rtl } = props;
    let [parentDom] = useState(createRef());
    let [datauniqid] = useState('aiobutton' + (Math.round(Math.random() * 10000000)));
    let popup = usePopup({ rtl: props.rtl });
    let [showPassword, SetShowPassword] = useState(false);
    function setShowPassword(state) { SetShowPassword(state === undefined ? !showPassword : state); }
    let [DragOptions] = useState(new UT.DragClass({
        callback: (fromData, toData) => {
            if (typeof props.onSwap === 'function') {
                const { fromIndex } = fromData;
                const { options, toIndex } = toData;
                const sorted = DragOptions.reOrder(options, fromIndex, toIndex);
                props.onSwap(sorted, options[fromIndex], options[toIndex]);
            }
        }
    }));
    function getPopover(dom) {
        let className = 'aio-input-popover';
        className += ` aio-input-popover-${rtl ? 'rtl' : 'ltr'}`;
        if (types.hasOption) {
            className += ' aio-input-dropdown';
        }
        if (props.type === 'time') {
            className += ' aio-input-time-popover';
        }
        const popover = (props.popover || {});
        let body = null;
        if (popover.body) {
            body = popover.body;
        }
        else if (type === 'date') {
            body = _jsx(Calendar, { onClose: popup.removeModal });
        }
        else if (type === 'time') {
            body = _jsx(TimePopover, { onClose: popup.removeModal });
        }
        else {
            body = _jsx(Options, {});
        }
        let obj = Object.assign(Object.assign({}, (props.popover || {})), { position: popover.position || 'popover', fitHorizontal: ['text', 'number', 'textarea'].indexOf(type) !== -1 || (type === 'select' && !!props.multiple) || !!popover.fitHorizontal, onClose: () => closePopup(), body, getTarget: () => $(dom.current), setAttrs: (key) => {
                let attrs = (popover.setAttrs || (() => { return {}; }))(key);
                if (key === 'modal') {
                    return UT.AddToAttrs(attrs, { className });
                }
            } });
        return obj;
    }
    function closePopup() {
        popup.removeModal();
        setTimeout(() => $(parentDom.current).focus(), 0);
    }
    function click(e, dom) {
        if (type === 'checkbox') {
            if (onChange) {
                onChange(!value, e);
            }
        }
        else if (types.isDropdown) {
            let open = !!popup.getModals().length;
            if (open) {
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
        let { attrs = {}, onClick, close } = option;
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
                let { multiple } = props, newValue;
                if (value.indexOf(option.value) === -1) {
                    newValue = value.concat(option.value);
                }
                else {
                    newValue = value.filter((o) => o !== option.value);
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
        let options = [];
        if (type === 'date') {
            if (!props.multiple) {
                return { optionsList: [], optionsDic: {} };
            }
            options = [...props.value];
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
        return GetOptions({ rootProps: props, types, options, optionProp: props.option || {} });
    }
    function getContext() {
        let context = {
            options: getOptions(), popup,
            rootProps: Object.assign(Object.assign({}, props), { value }), datauniqid, touch: 'ontouchstart' in document.documentElement,
            DragOptions, click, optionClick, types, showPassword, setShowPassword, DATE
        };
        return context;
    }
    function getRangeClassName() {
        let { round, vertical } = props;
        if (round) {
            return 'aio-input-range-round';
        }
        if (vertical) {
            return 'aio-input-range-vertical';
        }
        return 'aio-input-range-horizontal';
    }
    const render = {
        spinner: () => null,
        slider: () => null,
        acardion: () => _jsx(Acardion, {}),
        tree: () => _jsx(Tree, {}),
        tags: () => _jsx(Layout, { properties: { text: _jsx(Tags, {}) } }),
        list: () => _jsx(List, {}),
        file: () => _jsx(File, {}),
        select: () => _jsx(Select, {}),
        table: () => _jsx(Table, {}),
        checkbox: () => _jsx(Layout, {}),
        button: () => _jsx(Layout, {}),
        range: () => _jsx(Layout, { properties: { text: _jsx(Range, {}), className: getRangeClassName() } }),
        radio: () => _jsx(Layout, { properties: { text: _jsx(Options, {}) } }),
        tabs: () => _jsx(Layout, { properties: { text: _jsx(Options, {}) } }),
        buttons: () => _jsx(Layout, { properties: { text: _jsx(Options, {}) } }),
        date: () => _jsx(DateInput, {}),
        time: () => _jsx(Layout, { properties: { text: getTimeText(props) } }),
        image: () => _jsx(Layout, { properties: { text: _jsx(Image, {}) } }),
        text: () => _jsx(Layout, { properties: { text: _jsx(Input, {}) } }),
        password: () => _jsx(Layout, { properties: { text: _jsx(Input, {}) } }),
        textarea: () => _jsx(Layout, { properties: { text: _jsx(Input, {}) } }),
        number: () => _jsx(Layout, { properties: { text: _jsx(Input, {}) } }),
        color: () => _jsx(Layout, { properties: { text: _jsx(Input, {}) } })
    };
    if (!type || !render[type]) {
        return null;
    }
    return (_jsxs(AICTX.Provider, { value: getContext(), children: [render[type](), popup.render()] }, datauniqid));
}
function TimePopover(props) {
    const { DATE, rootProps } = useContext(AICTX);
    const { jalali, onChange, size = 12 } = rootProps;
    const { onClose } = props;
    const [value, setValue] = useState(getTimeByUnit(rootProps));
    const startYearRef = useRef(value.year ? value.year - 10 : undefined);
    const endYearRef = useRef(value.year ? value.year + 10 : undefined);
    const change = (obj) => setValue(Object.assign(Object.assign({}, value), obj));
    function translate(key) {
        return !!jalali ? { 'year': 'سال', 'month': 'ماه', 'day': 'روز', 'hour': 'ساعت', 'minute': 'دقیقه', 'second': 'ثانیه', 'Submit': 'ثبت', 'Now': 'اکنون' }[key] : key;
    }
    function getTimeOptions(type) {
        var _a, _b, _c;
        let { year, month, day } = value;
        const sy = startYearRef.current, ey = endYearRef.current;
        if (type === 'year' && sy && ey) {
            return UT.GetArray(ey - sy + 1, (i) => ({ text: i + sy, value: i + sy }), (_a = rootProps.timeStep) === null || _a === void 0 ? void 0 : _a.year);
        }
        if (type === 'day' && day) {
            let length = !year || !month ? 31 : DATE.getMonthDaysLength([year, month]);
            if (day > length) {
                change({ day: 1 });
            }
            return UT.GetArray(length, (i) => { return { text: i + 1, value: i + 1 }; }, (_b = rootProps.timeStep) === null || _b === void 0 ? void 0 : _b.day);
        }
        if (type === 'month') {
            return UT.GetArray(12, (i) => ({ text: i + 1, value: i + 1 }), (_c = rootProps.timeStep) === null || _c === void 0 ? void 0 : _c.month);
        }
        return UT.GetArray(type === 'hour' ? 24 : 60, (i) => ({ text: i, value: i }), rootProps.timeStep ? rootProps.timeStep[type] : undefined);
    }
    function layout(type) {
        if (typeof value[type] !== 'number') {
            return null;
        }
        let options = getTimeOptions(type);
        let p = { type: 'list', value: value[type], options, size: size * 2.5, onChange: (v) => change({ [type]: v }) };
        return (_jsxs("div", { className: "aio-input-time-popover-item", children: [_jsx("div", { className: "aio-input-time-popover-item-title", children: translate(type) }), _jsx(AIOInput, Object.assign({}, p)), _jsx("div", { className: 'aio-input-time-popover-highlight' })] }));
    }
    function setValueByTimeStep(value) {
        return value;
    }
    function submit() { if (onChange) {
        onChange(setValueByTimeStep(value));
    } onClose(); }
    function now() { setValue(getTimeByUnit(rootProps, true)); }
    return (_jsxs("div", { className: 'aio-input-time-popover-content aio-input-time-theme-color aio-input-time-theme-bg', style: { fontSize: size }, children: [_jsxs("div", { className: "aio-input-time-popover-body", children: [layout('year'), " ", layout('month'), " ", layout('day'), " ", layout('hour'), " ", layout('minute'), " ", layout('second')] }), _jsxs("div", { className: "aio-input-time-popover-footer", children: [_jsx("button", { onClick: submit, children: translate('Submit') }), rootProps.now !== false && _jsx("button", { onClick: () => now(), children: translate('Now') })] })] }));
}
function Image() {
    let { rootProps, popup } = useContext(AICTX);
    let { value, attrs, onChange, disabled, placeholder, preview, deSelect, imageAttrs = {} } = rootProps;
    let [url, setUrl] = useState();
    let dom = createRef();
    // if(typeof value === 'object'){
    //     let fr = new FileReader();
    //     fr.onload = function () {
    //         $(dom.current).attr('src',fr.result)
    //     }
    //     fr.readAsDataURL(value);
    // }
    useEffect(() => {
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
            let fr = new FileReader();
            fr.onload = function () {
                if (url !== fr.result) {
                    setUrl(fr.result);
                    if (callback) {
                        callback(fr.result);
                    }
                }
            };
            fr.readAsDataURL(file);
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
            position: 'center', header: { title: '', onClose: () => popup.removeModal() },
            body: _jsx("div", { className: 'aio-input-image-preview-popup', children: _jsx("img", { src: $(dom.current).attr('src') }) })
        });
    }
    let IMG = url ? (_jsxs(_Fragment, { children: [_jsx("img", Object.assign({ ref: dom, src: url, style: { objectFit: 'contain', cursor: !onChange ? 'default' : undefined }, onClick: !!onChange ? undefined : onPreview, height: '100%' }, imageAttrs)), !!deSelect &&
                _jsx("div", { onClick: (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (typeof deSelect === 'function') {
                            deSelect();
                        }
                        else if (onChange) {
                            onChange('');
                        }
                    }, className: 'aio-input-image-remove', children: I('mdiClose', 1) }), preview && !!onChange && _jsx("div", { onClick: (e) => onPreview(e), className: 'aio-input-image-preview', children: I('mdiImage', 1) }), popup.render()] })) : _jsx("span", Object.assign({}, attrs, { className: 'aio-input-image-placeholder', children: placeholder || 'placeholder' }));
    if (!onChange) {
        return IMG;
    }
    let p = {
        disabled,
        justify: true, text: IMG, attrs: { style: { width: '100%', height: '100%', padding: 0 } },
        onChange: (file) => changeUrl(file, (url) => { if (onChange)
            onChange(url); })
    };
    return (_jsx(AIFile, Object.assign({}, p)));
}
function File() { return (_jsxs("div", { className: 'aio-input-file-container', children: [_jsx(Layout, {}), _jsx(FileItems, {})] })); }
function InputFile() {
    let { rootProps, types } = useContext(AICTX);
    let { value = [], onChange = () => { }, disabled, multiple, inputAttrs } = rootProps;
    function change(e) {
        let Files = e.target.files;
        let result;
        if (types.isMultiple) {
            result = [...value];
            let names = result.map(({ name }) => name);
            for (let i = 0; i < Files.length; i++) {
                let file = Files[i];
                if (names.indexOf(file.name) !== -1) {
                    continue;
                }
                result.push({ name: file.name, size: file.size, file });
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
    let props = Object.assign({ disabled: disabled === true, type: 'file', style: { display: 'none' }, multiple: types.isMultiple, onChange: (e) => change(e) }, inputAttrs);
    return _jsx("input", Object.assign({}, props));
}
function FileItems() {
    let { rootProps } = useContext(AICTX);
    let { value, rtl } = rootProps;
    let files = [];
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
    let Files = files.map((file, i) => { return _jsx(FileItem, { file: file, index: i }, i); });
    return (_jsx("div", { className: 'aio-input-files', style: { direction: rtl ? 'rtl' : 'ltr' }, children: Files }));
}
const FileItem = (props) => {
    let { rootProps, types } = useContext(AICTX);
    let { onChange = () => { }, value = [] } = rootProps;
    let { file, index } = props;
    function getFile(file) {
        let filename = file.name || 'untitle';
        let fileSize = file.size || 0;
        let nameLength = 20;
        try {
            let minName, sizeString;
            let lastDotIndex = filename.lastIndexOf('.');
            let name = filename.slice(0, lastDotIndex);
            let format = filename.slice(lastDotIndex + 1, filename.length);
            if (name.length > nameLength) {
                minName = name.slice(0, Math.floor(nameLength / 2)) + '...' + name.slice(name.length - Math.floor(nameLength / 2), name.length) + '.' + format;
            }
            else {
                minName = filename;
            }
            let size = fileSize;
            if (!size) {
                return { minName, sizeString: false };
            }
            let gb = size / (1024 * 1024 * 1024), mb = size / (1024 * 1024), kb = size / 1024;
            if (gb >= 1) {
                sizeString = gb.toFixed(2) + ' GB';
            }
            else if (mb >= 1) {
                sizeString = mb.toFixed(2) + ' MB';
            }
            else if (kb >= 1) {
                sizeString = kb.toFixed(2) + ' KB';
            }
            else {
                sizeString = size + ' byte';
            }
            return { minName, sizeString };
        }
        catch (_a) {
            return { minName: 'untitle', sizeString: false };
        }
    }
    function remove(e, index) {
        return __awaiter(this, void 0, void 0, function* () {
            e.stopPropagation();
            e.preventDefault();
            if (typeof rootProps.onRemove === 'function') {
                const res = yield rootProps.onRemove({ row: value[index], rowIndex: index });
                if (res === false) {
                    return;
                }
            }
            let newValue = [];
            for (let i = 0; i < value.length; i++) {
                if (i === index) {
                    continue;
                }
                newValue.push(value[i]);
            }
            onChange(newValue);
        });
    }
    function download() {
        UT.DownloadFile(file);
    }
    function getIcon() {
        let filePreview;
        if (rootProps.preview) {
            filePreview = UT.FilePreview(file, { onClick: () => download() });
        }
        if (filePreview && filePreview !== null) {
            return filePreview;
        }
        return (_jsx("div", { className: 'aio-input-file-item-icon', onClick: () => download(), children: I('mdiAttachment', .8) }));
    }
    let { minName, sizeString } = getFile(file);
    let { optionsList } = GetOptions({
        rootProps, types,
        options: [{ minName, sizeString, index }],
        optionProp: Object.assign(Object.assign({}, rootProps.option), { subtext: () => sizeString, text: () => minName, before: () => getIcon(), after: () => _jsx("div", { className: 'aio-input-file-item-icon', onClick: (e) => remove(e, index), children: I('mdiClose', .7) }) })
    });
    let option = optionsList[0];
    return _jsx(Layout, { option: option });
};
const Select = () => {
    let { rootProps, types, options } = useContext(AICTX);
    let { value } = rootProps;
    let values = Array.isArray(value) ? [...value] : (value !== undefined ? [value] : []);
    function getSelectText() {
        if (!values.length) {
            return;
        }
        let option = options.optionsDic['a' + values[0]];
        if (!option) {
            return;
        }
        return option.text;
    }
    if (types.isMultiple) {
        return (_jsxs("div", { className: 'aio-input-multiselect-container', children: [_jsx(Layout, {}), !rootProps.hideTags && !!values.length && _jsx(Tags, {})] }));
    }
    else {
        return _jsx(Layout, { properties: { text: rootProps.text || getSelectText() } });
    }
};
const DateInput = () => {
    let { rootProps, types } = useContext(AICTX);
    let { value, hideTags, calendarMode } = rootProps;
    let values = Array.isArray(value) ? [...value] : (value !== undefined ? [value] : []);
    function getDateText() {
        let { value, unit = Def('date-unit'), text, pattern: PT, jalali, placeholder } = rootProps;
        if (value) {
            text = PT !== undefined ? PT : text;
            let DATE = new AIODate();
            let list = DATE.convertToArray(value);
            let [year, month = 1, day = 1, hour = 0] = list;
            list = [year, month, day, hour];
            let splitter = DATE.getSplitter(value);
            let content = '';
            if (text && text !== null) {
                content = text;
            }
            else {
                let pattern = '{}';
                if (unit === 'month') {
                    pattern = `{year}${splitter}{month}`;
                }
                else if (unit === 'day') {
                    pattern = `{year}${splitter}{month}${splitter}{day}`;
                }
                else if (unit === 'hour') {
                    pattern = `{year}${splitter}{month}${splitter}{day} - {hour} : 00`;
                }
                content = DATE.getDateByPattern(list, pattern);
            }
            return _jsx("div", { style: { direction: 'ltr', width: 'fit-content' }, children: content });
        }
        return placeholder || (!jalali ? 'Select Date' : 'انتخاب تاریخ');
    }
    if (calendarMode) {
        return _jsx(Calendar, {});
    }
    if (types.isMultiple) {
        return (_jsxs("div", { className: 'aio-input-multiselect-container', children: [_jsx(Layout, { properties: { text: rootProps.text || 'Select Dates' } }), !hideTags && !!values.length && _jsx(Tags, {})] }));
    }
    else {
        return _jsx(Layout, { properties: { text: getDateText() } });
    }
};
const Tags = () => {
    let { rootProps, options } = useContext(AICTX);
    let { value = [], rtl, disabled, onChange = () => { } } = rootProps;
    let tags = value.map((o, i) => {
        let option = options.optionsDic['a' + o];
        if (option === undefined) {
            return null;
        }
        return (_jsx(Tag, { onClose: () => onChange(rootProps.value.filter((rpv) => rpv !== o)), attrs: option.tagAttrs, before: option.tagBefore, after: option.tagAfter, text: option.text, disabled: option.disabled }, i));
    });
    return !tags.length ? null : _jsx("div", { className: `aio-input-tags-container aio-input-scroll${rtl ? ' rtl' : ''}${disabled ? ' disabled' : ''}`, children: tags });
};
const Tag = (props) => {
    let { attrs, before = I('mdiCircleMedium', 0.7), after, text, disabled, onClose = () => { } } = props;
    let close = disabled ? undefined : onClose;
    let cls = 'aio-input-tag';
    let Attrs = UT.AddToAttrs(attrs, { className: [cls + ' aio-input-main-bg', disabled ? 'disabled' : undefined] });
    return (_jsxs("div", Object.assign({}, Attrs, { children: [_jsx("div", { className: `${cls}-icon`, children: before }), _jsx("div", { className: `${cls}-text`, children: text }), after !== undefined && _jsx("div", { className: `${cls}-icon`, children: after }), _jsx("div", { className: `${cls}-icon`, onClick: close, children: I('mdiClose', 0.7) })] })));
};
const Input = () => {
    const { rootProps, types, showPassword, options } = useContext(AICTX);
    const { type, delay = 500 } = rootProps;
    const { maxLength = Infinity, spin = true } = rootProps;
    let { filter = [] } = rootProps;
    let [dom] = useState(createRef());
    let [temp] = useState({ atimeout: undefined, btimeout: undefined, clicked: false });
    let [datauniqid] = useState(`ac${Math.round(Math.random() * 100000)}`);
    let [value, setValue] = useState(rootProps.value || '');
    let valueRef = useRef(value);
    valueRef.current = value;
    function setSwip() {
        if (type === 'number' && rootProps.swip) {
            new UT.Swip({
                speedY: rootProps.swip, reverseY: true, minY: rootProps.min, maxY: rootProps.max,
                dom: () => $(dom.current),
                start: () => {
                    let vref = +valueRef.current;
                    vref = isNaN(vref) ? 0 : vref;
                    return [0, vref];
                },
                move: (p) => {
                    let { y } = p.change || { y: 0 };
                    if (rootProps.min !== undefined && y < rootProps.min) {
                        y = rootProps.min;
                    }
                    if (rootProps.max !== undefined && y > rootProps.max) {
                        y = rootProps.max;
                    }
                    change(y, rootProps.onChange);
                }
            });
        }
    }
    useEffect(() => { setSwip(); }, []);
    function getValidValue() {
        let v = rootProps.value;
        if (type === 'number') {
            if (v === '') {
                return undefined;
            } //important because +('') is 0
            else if (!isNaN(+v)) {
                v = +v;
                if (typeof rootProps.min === 'number' && v < rootProps.min) {
                    v = rootProps.min;
                }
                else if (typeof rootProps.max === 'number' && v > rootProps.max) {
                    v = rootProps.max;
                }
            }
        }
        return v;
    }
    function update() {
        clearTimeout(temp.atimeout);
        temp.atimeout = setTimeout(() => {
            let v = getValidValue();
            if (v !== value) {
                setValue(v);
            }
        }, delay);
    }
    useEffect(() => { update(); }, [rootProps.value]);
    function change(value, onChange) {
        if (!Array.isArray(filter)) {
            filter = [];
        }
        if (types.hasKeyboard) {
            value = UT.keyboard_filter(value, { maxLength, filter, toPersian: true });
        }
        if (rootProps.type === 'number') {
            if (value === '') {
                value = undefined;
            }
            else {
                value = +value;
            }
        }
        setValue(value);
        if (!rootProps.blurChange && onChange) {
            clearTimeout(temp.btimeout);
            temp.btimeout = setTimeout(() => onChange(value), delay);
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
        $(dom.current).focus().select();
    }
    function blur(onChange) {
        temp.clicked = false;
        if (rootProps.blurChange && onChange) {
            onChange(value);
        }
    }
    function getInputAttrs() {
        let InputAttrs = UT.AddToAttrs(rootProps.inputAttrs, {
            className: !spin ? 'no-spin' : undefined,
            style: rootProps.justify ? { textAlign: 'center' } : undefined
        });
        let p = Object.assign(Object.assign({}, InputAttrs), { value, type, ref: dom, disabled: rootProps.disabled, placeholder: rootProps.placeholder, list: rootProps.options ? datauniqid : undefined, onClick: (e) => click(), onChange: rootProps.onChange ? (e) => change(e.target.value, rootProps.onChange) : undefined, onBlur: () => blur(rootProps.onChange) });
        if (type === 'password' && showPassword) {
            p = Object.assign(Object.assign({}, p), { type: 'text', style: Object.assign(Object.assign({}, p.style), { textAlign: 'center' }) });
        }
        if (filter.length === 1 && filter[0] === 'number') {
            p.pattern = "\d*";
            p.inputMode = "numeric";
        }
        return p;
    }
    let attrs = getInputAttrs();
    if (!attrs.onChange) {
        return value;
    }
    else if (type === 'color') {
        return (_jsxs("label", { style: { width: '100%', height: '100%', background: value }, children: [_jsx("input", Object.assign({}, attrs, { style: { opacity: 0 } })), !!options.optionsList.length && _jsx("datalist", { id: datauniqid, children: options.optionsList.map((o) => _jsx("option", { value: o.value })) })] }));
    }
    else if (type === 'textarea') {
        return _jsx("textarea", Object.assign({}, attrs));
    }
    else {
        return (_jsx("input", Object.assign({}, attrs)));
    }
};
const Options = () => {
    let { rootProps, types, options } = useContext(AICTX);
    let [searchValue, setSearchValue] = useState('');
    let [dom] = useState(createRef());
    let [focused] = useState();
    function renderSearchBox(options) {
        if (rootProps.type === 'tabs' || rootProps.type === 'buttons' || types.isInput || !rootProps.search) {
            return null;
        }
        if (searchValue === '' && options.length < 10) {
            return null;
        }
        return (_jsxs("div", { className: 'aio-input-search', children: [_jsx("input", { type: 'text', value: searchValue, placeholder: rootProps.search, onChange: (e) => setSearchValue(e.target.value) }), _jsx("div", { className: 'aio-input-search-icon', onClick: () => { setSearchValue(''); }, children: I(searchValue ? 'mdiClose' : 'mdiMagnify', .8) })] }));
    }
    function getRenderOptions(options) {
        return options.map((option, i) => {
            if (searchValue) {
                if (option.text === undefined || option.text === '' || option.text === null) {
                    return null;
                }
                if (option.text.indexOf(searchValue) === -1) {
                    return null;
                }
            }
            let p = { option, index: i, searchValue };
            return _createElement(Layout, Object.assign({}, p, { key: i }));
        });
    }
    useEffect(() => {
        try {
            setTimeout(() => $(dom.current).focus(), 30);
        }
        catch (_a) { }
    }, []);
    function keyDown(e) {
        const code = e.keyCode;
        if (code === 40) {
        }
    }
    if (!options.optionsList.length) {
        return null;
    }
    let renderOptions = getRenderOptions(options.optionsList);
    let className = `aio-input-options aio-input-scroll aio-input-${rootProps.type}-options`;
    if (types.isDropdown) {
        className += ' aio-input-dropdown-options';
    }
    return (_jsxs("div", { className: 'aio-input-options-container', ref: dom, tabIndex: 0, onKeyDown: (e) => keyDown(e), children: [renderSearchBox(options.optionsList), _jsx("div", { className: className, children: renderOptions })] }));
};
const CheckIcon = (props) => {
    if (props.checked === undefined) {
        return null;
    }
    if (props.checkIcon) {
        const res = props.checkIcon({ checked: props.checked, row: props.row });
        return res === false ? null : _jsx(_Fragment, { children: res });
    }
    if (props.switch) {
        return (_jsx(AISwitch, Object.assign({}, props.switch, { value: props.checked })));
    }
    return (_jsx("div", { className: 'aio-input-check-out aio-input-main-color' + (props.checked ? ' checked' : '') + (props.round ? ' aio-input-check-round' : ''), style: { background: 'none' }, children: _jsx("div", { className: 'aio-input-main-bg aio-input-check-in' }) }));
};
const Layout = (props) => {
    let { rootProps, datauniqid, types, touch, DragOptions, click, optionClick, showPassword, setShowPassword, popup } = useContext(AICTX);
    let { option, index } = props;
    let { type, rtl } = rootProps;
    let [dom] = useState(createRef());
    const [recognition, setRecognition] = useState();
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            return;
        }
        let { onChange, voice } = rootProps;
        if (!voice || !onChange || !types.hasKeyboard) {
            return;
        }
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = { en: 'en-US', fa: 'fa-IR' }[voice];
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            if (onChange)
                onChange(result);
        };
        recognition.onerror = (event) => {
            console.error('خطا در تشخیص گفتار: ', event.error);
        };
        recognition.onend = () => {
            console.log('تشخیص گفتار پایان یافت.');
        };
        setRecognition(recognition);
        return () => { recognition.stop(); };
    }, []);
    function getClassName() {
        let cls;
        if (option !== undefined) {
            cls = `aio-input-option aio-input-${type}-option`;
            if (types.isMultiple) {
                cls += ` aio-input-${type}-multiple-option`;
            }
            if (types.isDropdown) {
                cls += ` aio-input-dropdown-option`;
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
            cls = `aio-input aio-input-${type}${touch ? ' aio-input-touch' : ''}`;
            if (types.isInput) {
                cls += ` aio-input-input`;
            }
            if (rootProps.justify) {
                cls += ' aio-input-justify';
            }
            cls += rtl ? ' aio-input-rtl' : ' aio-input-ltr';
        }
        if (type === 'tree') {
            let size = rootProps.size || Def('tree-size');
            size = Math.round(size / 12) * 12;
            if (size < 24) {
                size = 24;
            }
            if (size > 120) {
                size = 120;
            }
            cls += ` aio-input-size-${size}`;
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
    function cls(key, hasSubtext) {
        let className = `aio-input-${key}`;
        if (option) {
            className += ` aio-input-${type}-option-${key}`;
        }
        else {
            className += ` aio-input-${type}-${key}`;
        }
        if (hasSubtext) {
            className += ` aio-input-has-subtext`;
        }
        return className;
    }
    function Text() {
        let { text, placeholder, subtext, justify } = properties;
        if (text === undefined && placeholder !== undefined) {
            text = _jsx("div", { className: 'aio-input-placeholder', children: placeholder });
        }
        if (text !== undefined) {
            const className = `${cls('value', !!subtext)}${justify && !types.isInput ? ' aio-input-value-justify' : ''}`;
            return _jsx("div", { className: className, "data-subtext": subtext, children: text });
        }
        else {
            return _jsx("div", { style: { flex: 1 } });
        }
    }
    function keyDown(e) {
        const code = e.keyCode;
        if (code === 13) {
            click(e, dom);
        }
    }
    function DragIcon() {
        if (!properties.draggable) {
            return null;
        }
        return (_jsx("svg", { viewBox: "8 4 10 13", role: "presentation", style: { width: 12, height: '1.8rem' }, children: _jsx("path", { d: "M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z", style: { fill: 'currentcolor' } }) }));
    }
    function Caret() {
        if (!types.isDropdown || option || (types.isInput && !rootProps.options)) {
            return null;
        }
        let { caret } = rootProps;
        if (caret === false) {
            return null;
        }
        return _jsx("div", { className: 'aio-input-caret', children: caret === undefined ? I('mdiChevronDown', .8) : caret });
    }
    function BeforeAfter(mode) {
        let res;
        if (mode === 'after' && type === 'password' && rootProps.preview) {
            res = _jsx("div", { className: 'aio-input-password-preview', onClick: () => setShowPassword(), children: I(showPassword ? 'mdiEyeOff' : 'mdiEye', .8) }, `layout${mode}`);
        }
        else {
            let v = properties[mode];
            res = typeof v === 'function' ? v() : v;
        }
        if (res === undefined) {
            return null;
        }
        return _jsx("div", { className: cls(mode), children: res }, 'layout' + mode);
    }
    function Loading() {
        let { loading } = properties;
        let elem;
        if (!loading) {
            return null;
        }
        else if (loading === true) {
            elem = I('mdiLoading', 0.8, { spin: .8 });
        }
        else {
            elem = loading;
        }
        return _jsx("div", { className: cls('loading'), children: elem });
    }
    function getProps() {
        let { attrs, disabled, draggable, style } = properties;
        let zIndex;
        if (!!popup.getModals().length && !option && ['text', 'number', 'textarea'].indexOf(type) !== -1) {
            zIndex = 100000;
        }
        let onClick;
        //ممکنه این یک آپشن باشه باید دیزیبل پرنتش هم چک بشه تا دیزیبل بشه
        if (!disabled) {
            if (option === undefined) {
                onClick = (e) => { e.stopPropagation(); click(e, dom); };
            }
            else {
                onClick = (e) => {
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
        attrs = UT.AddToAttrs(attrs, {
            className: getClassName(),
            style: Object.assign(Object.assign({}, style), { zIndex })
        });
        let p = Object.assign(Object.assign({ tabIndex: option ? undefined : 1, onKeyDown: keyDown }, attrs), { onClick, ref: dom, disabled });
        let options = typeof rootProps.options === 'function' ? rootProps.options() : (rootProps.options || []);
        if (draggable) {
            p = Object.assign(Object.assign(Object.assign({}, p), DragOptions.getDragAttrs({ fromIndex: index || 0 })), DragOptions.getDropAttrs({ options, toIndex: index || 0 }));
        }
        if (index) {
            p['data-index'] = index;
        }
        return p;
    }
    function getProperties() {
        let p = props.properties || {};
        let obj = option || rootProps; //اگر آپشن بود از آپشن وگر نه از پروپس بخون مقادیر رو
        let { draggable = option ? option.draggable : false } = p;
        let { placeholder = !option ? rootProps.placeholder : undefined } = p;
        let { checked = option ? option.checked : (type === 'checkbox' ? !!rootProps.value : undefined) } = p;
        let { disabled = obj.disabled } = p;
        let { text = obj.text } = p;
        let { subtext = obj.subtext } = p;
        let { justify = obj.justify } = p;
        let { loading = obj.loading } = p;
        let { attrs = obj.attrs || {} } = p;
        let style = Object.assign(Object.assign({}, (obj.style || {})), p.style);
        let { before = obj.before } = p;
        let { after = obj.after } = p;
        let classNames = [obj.className, p.className].filter((o) => !!o);
        let className = classNames.length ? classNames.join(' ') : undefined;
        return { disabled, draggable, text, subtext, placeholder, justify, checked, loading, attrs, style, before, after, className };
    }
    function startVoice() {
        recognition.start();
    }
    function voice() {
        if (!recognition) {
            return null;
        }
        return _jsx("div", { className: 'aio-input-voice', onClick: () => startVoice(), children: I('mdiMicrophoneOutline', 0.8) });
    }
    let properties = getProperties();
    let content = (_jsxs(_Fragment, { children: [DragIcon(), typeof properties.checked === 'boolean' &&
                _jsx(CheckIcon, { round: !rootProps.multiple && type === 'radio', checked: properties.checked, checkIcon: rootProps.checkIcon, row: option || {}, switch: rootProps.switch }), BeforeAfter('before'), Text(), BeforeAfter('after'), Loading(), voice(), Caret()] }));
    let p = getProps();
    if (type === 'file') {
        return (_jsxs("label", Object.assign({}, p, { children: [content, _jsx(InputFile, {})] })));
    }
    return (_jsxs("div", Object.assign({}, p, { children: [content, !!option && type === 'tabs' && _jsx("div", { className: 'aio-input-tabs-option-bar' })] })));
};
const List = () => {
    let { rootProps, options } = useContext(AICTX);
    let { attrs = {}, size = 36, listOptions = { count: 3, editable: true, stop: 3, decay: 8 }, onChange = () => { } } = rootProps;
    let { count = 3, editable = true, stop = 3, decay = 8 } = listOptions;
    let optionsLength = options.optionsList.length;
    let [temp] = useState({
        dom: createRef(),
        activeIndex: 0,
        interval: undefined,
        moved: false,
        lastY: 0,
        deltaY: 0,
        so: { y: 0, top: 0, limit: { top: 0, bottom: 0 } }
    });
    function getStyle() {
        var height = count * (size);
        return { height };
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
        let newTop = getTopByIndex(temp.activeIndex);
        setStyle({ top: newTop });
        setBoldStyle(temp.activeIndex);
    }
    function setBoldStyle(index) {
        $(temp.dom.current).find('.aio-input-list-option').removeClass('active');
        $(temp.dom.current).find('.aio-input-list-option[data-index=' + (index) + ']').addClass('active');
    }
    function moveUp() {
        if (temp.activeIndex <= 0) {
            return;
        }
        temp.activeIndex--;
        let newTop = getTopByIndex(temp.activeIndex);
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
        let index = getIndexByTop(top);
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
        UT.EventHandler('window', 'mousemove', mouseMove, 'bind');
        UT.EventHandler('window', 'mouseup', mouseUp, 'bind');
        clearInterval(temp.interval);
        temp.moved = false;
        let client = UT.GetClient(e);
        let y = client.y;
        setStyle({ transition: 'unset' });
        let top = getTop();
        var index = getIndexByTop(top);
        setBoldStyle(index);
        setStyle({ top, transition: 'unset' });
        onChange(options.optionsList[index].value, index);
        temp.so = { y, top, limit: getLimit() };
    }
    function getTop() {
        var top = parseInt($(temp.dom.current).find('.aio-input-list-options').css('top'));
        return getTrueTop(top);
    }
    function fixTop(value) {
        let { top, bottom } = temp.so.limit;
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
        var client = UT.GetClient(e);
        let y = client.y;
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
        let index = getIndexByTop(newTop);
        temp.so.newTop = newTop;
        setBoldStyle(index);
        setStyle({ top: newTop });
    }
    function setStyle(obj) { $(temp.dom.current).find('.aio-input-list-options').css(obj); }
    function mouseUp() {
        UT.EventHandler('window', 'mousemove', mouseMove, 'unbind');
        UT.EventHandler('window', 'mouseup', mouseUp, 'unbind');
        if (!temp.moved) {
            return;
        }
        temp.moved = false;
        move(temp.deltaY, temp.so.newTop);
    }
    function move(deltaY, startTop = getTop()) {
        if (decay < 0) {
            decay = 0;
        }
        if (decay > 99) {
            decay = 99;
        }
        decay = 1 + decay / 1000;
        temp.interval = setInterval(() => {
            startTop += deltaY;
            let index = getIndexByTop(startTop);
            setBoldStyle(index);
            if (Math.abs(deltaY) < stop || index < 0 || index > optionsLength - 1) {
                clearInterval(temp.interval);
                if (index < 0) {
                    index = 0;
                }
                if (index > optionsLength - 1) {
                    index = optionsLength - 1;
                }
                let top = getTopByIndex(index);
                setStyle({ top, transition: '0.3s' });
                const option = options.optionsList[index];
                onChange(option.value, option.details);
                return;
            }
            deltaY /= decay;
            setStyle({ top: startTop });
        }, 20);
    }
    useEffect(() => { var _a; if ((_a = rootProps.listOptions) === null || _a === void 0 ? void 0 : _a.move) {
        rootProps.listOptions.move(move);
    } }, []);
    useEffect(() => {
        setBoldStyle(temp.activeIndex);
    });
    let fixedOptions = options.optionsList.map((o, i) => {
        if (o.value === rootProps.value) {
            temp.activeIndex = i;
        }
        return (_jsx(Layout, { option: o, index: i, properties: {
                style: { height: size },
                justify: true
            } }, i));
    });
    return (_jsx("div", Object.assign({}, attrs, { ref: temp.dom, tabIndex: 0, onKeyDown: (e) => keyDown(e), className: 'aio-input-list' + (attrs.className ? ' ' + attrs.className : ''), style: Object.assign(Object.assign({}, attrs.style), getStyle()), children: _jsx("div", { className: 'aio-input-list-options', style: getContainerStyle(), onMouseDown: (e) => mouseDown(e), onTouchStart: (e) => mouseDown(e), children: fixedOptions }) })));
};
const AcardionContext = createContext({});
export const Acardion = () => {
    const { rootProps, options } = useContext(AICTX);
    const { multiple, vertical = true, value } = rootProps;
    function isOpen(id) {
        if (!multiple) {
            return id === value;
        }
        else {
            return (value || []).indexOf(id) !== -1;
        }
    }
    function getContext() {
        let context = {
            rootProps, isOpen
        };
        return context;
    }
    return (_jsx(AcardionContext.Provider, { value: getContext(), children: _jsx("div", { className: `aio-input-acardion aio-input-scroll${vertical ? ' aio-input-acardion-vertical' : ' aio-input-acardion-horizontal'}`, children: options.optionsList.map((option, i) => _jsx(AcardionItem, { option: option }, i)) }) }));
};
const AcardionItem = ({ option }) => {
    const active = !!option.details.active;
    let [timeout] = useState();
    let Attrs = UT.AddToAttrs(option.attrs, { className: `aio-input-acardion-item` });
    return (_jsxs("div", Object.assign({}, Attrs, { children: [_jsx(Layout, { option: option }), !!active && _jsx(AcardionBody, { option: option })] })));
};
const AcardionBody = ({ option }) => {
    const { rootProps } = useContext(AcardionContext);
    let { body = () => { } } = rootProps;
    let { html, attrs } = body(option.optionOrg, option.details) || { html: '' };
    let Attrs = UT.AddToAttrs(attrs, { className: [`aio-input-acardion-body`] });
    return _jsx("div", Object.assign({}, Attrs, { children: html }));
};
const TreeContext = createContext({});
const Tree = () => {
    let { rootProps, types } = useContext(AICTX);
    let { onAdd, onRemove, value = [], onChange, size = Def('tree-size'), attrs } = rootProps;
    let [openDic, setOpenDic] = useState({});
    const openDicRef = useRef(openDic);
    openDicRef.current = openDic;
    let [mountedDic, setMountedDic] = useState({});
    const mountedDicRef = useRef(mountedDic);
    mountedDicRef.current = mountedDic;
    let [indent] = useState(getIndent);
    function SetMounted(id) { setMountedDic(Object.assign(Object.assign({}, mountedDicRef.current), { [id]: !mountedDicRef.current[id] })); }
    function SetOpen(id) { setOpenDic(Object.assign(Object.assign({}, openDicRef.current), { [id]: !openDicRef.current[id] })); }
    function getIndent() {
        let { indent = 24 } = rootProps;
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
        let open = !!openDic[id], time = 300;
        if (!open) {
            SetOpen(id);
            setTimeout(() => SetMounted(id), 0);
        }
        else {
            SetMounted(id);
            setTimeout(() => SetOpen(id), time);
        }
    }
    useEffect(() => {
        if (rootProps.toggleRef) {
            rootProps.toggleRef.current = (id) => toggle(id);
        }
    }, [toggle]);
    useEffect(() => {
        if (rootProps.onToggle) {
            rootProps.onToggle(openDic);
        }
    }, [openDic]);
    function change(row, newRow) {
        for (let prop in newRow) {
            row[prop] = newRow[prop];
        }
        if (rootProps.onChange) {
            rootProps.onChange(rootProps.value);
        }
    }
    function getChilds(p) {
        let { row, details } = p;
        let childs = [];
        try {
            if (rootProps.getChilds) {
                childs = rootProps.getChilds({ row, details });
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
        let { row, childs } = p;
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
        return __awaiter(this, void 0, void 0, function* () {
            let newRow;
            if (typeof onAdd === 'function') {
                newRow = yield onAdd(p);
            }
            else {
                newRow = onAdd;
            }
            if (!newRow) {
                return;
            }
            if (p) {
                let parentChilds = getChilds({ row: p.parent, details: p.parentDetails });
                setChilds({ row: p.parent, childs: parentChilds.concat(newRow), details: p.parentDetails });
            }
            else {
                value.push(newRow);
            }
            if (onChange) {
                onChange(value);
            }
        });
    }
    function remove(p) {
        return __awaiter(this, void 0, void 0, function* () {
            let { index } = p;
            let res;
            if (typeof onRemove === 'function') {
                res = (yield onRemove(p));
            }
            else {
                res = true;
            }
            if (!res) {
                return;
            }
            const details = { index, active: false, toggle: () => { } };
            const { option: optionProp = {} } = rootProps;
            if (!p.parent) {
                value = value.filter((o) => {
                    let rowValue = GetOptionProps({ key: 'value', optionProp, optionOrg: p.row, optionDetails: Object.assign(Object.assign({}, details), { rootProps }) });
                    let oValue = GetOptionProps({ key: 'value', optionProp, optionOrg: o, optionDetails: Object.assign(Object.assign({}, details), { rootProps }) });
                    return rowValue !== oValue;
                });
            }
            else {
                let parentChilds = getChilds({ row: p.parent, details: p.parentDetails });
                let newChilds = parentChilds.filter((o) => {
                    let rowValue = GetOptionProps({ key: 'value', optionProp, optionOrg: p.row, optionDetails: Object.assign(Object.assign({}, details), { rootProps }) });
                    let oValue = GetOptionProps({ key: 'value', optionProp, optionOrg: o, optionDetails: Object.assign(Object.assign({}, details), { rootProps }) });
                    return rowValue !== oValue;
                });
                setChilds({ row: p.parent, details: p.parentDetails, childs: newChilds });
            }
            if (onChange) {
                onChange(value);
            }
        });
    }
    function getContext() { return { toggle, rootProps, mountedDic, openDic, add, remove, types, indent, size, change, getChilds }; }
    let Attrs = UT.AddToAttrs(attrs, { className: ['aio-input-tree', rootProps.className, rootProps.rtl ? 'aio-input-tree-rtl' : undefined], style: rootProps.style });
    return (_jsx(TreeContext.Provider, { value: getContext(), children: _jsxs("div", Object.assign({}, Attrs, { children: [_jsx(TreeHeader, {}), _jsx(TreeBody, { rows: value, level: 0 })] })) }));
};
const TreeHeader = () => {
    const { rootProps, add } = useContext(TreeContext);
    let { addText = 'add', onAdd } = rootProps;
    if (!onAdd) {
        return null;
    }
    addText = (typeof addText === 'function' ? addText('header') : addText) || 'add';
    return (_jsx("div", { className: "aio-input-tree-header", children: _jsxs("button", { onClick: () => add(), children: [I('mdiPlusThick', .8), addText] }) }));
};
const TreeActions = (props) => {
    let { row, index, parent, rowDetails, parentDetails } = props;
    let { rootProps, add, remove } = useContext(TreeContext);
    let { onAdd, onRemove, removeText = 'Remove' } = rootProps;
    let addText = (typeof rootProps.addText === 'function' ? rootProps.addText(row) : rootProps.addText) || 'Add';
    let options = typeof rootProps.actions === 'function' ? rootProps.actions(row, parent) : rootProps.actions;
    function getOptions() {
        let res = [];
        if (onAdd) {
            res.push({ text: addText, value: 'add', before: I('mdiPlusThick', 0.7), onClick: () => add({ parent: row, parentDetails: rowDetails }) });
        }
        let Options = (options || []).map((o) => { return Object.assign(Object.assign({}, o), { onClick: () => { if (o.onClick) {
                o.onClick(row, parent);
            } } }); });
        res = [...res, ...Options];
        if (onRemove) {
            res.push({ text: removeText, value: 'remove', before: I('mdiDelete', 0.7), onClick: () => remove({ row, index, parent, parentDetails }) });
        }
        return res;
    }
    let Options = getOptions();
    if (!Options.length) {
        return null;
    }
    let p = { type: 'select', caret: false, popover: { limitTo: '.aio-input-tree' }, className: 'aio-input-tree-options-button', options: Options, text: I('mdiDotsHorizontal', 0.7) };
    return _jsx(AIOInput, Object.assign({}, p));
};
const TreeBody = (props) => {
    let { rootProps, types, openDic, mountedDic, indent, size, change, getChilds, toggle } = useContext(TreeContext);
    let { rows, level, parent, parentId, parentIndent, parentDetails } = props;
    let parentOpen = parentId === undefined ? true : !!openDic[parentId];
    let mounted = parentId == undefined ? true : mountedDic[parentId];
    let { onAdd, onRemove, actions } = rootProps;
    let { optionsList } = GetOptions({
        rootProps, types, options: rows, level, isOpen: (id) => !!openDic[id],
        change: (row, newRow) => change(row, newRow), optionProp: rootProps.option || {}
    });
    if (!!onAdd || !!onRemove || !!actions) {
        optionsList = optionsList.map((o) => {
            let { index, level = 0 } = o.details;
            let isFirstChild = index === 0;
            let isLastChild = index === rows.length - 1;
            let details = { index, level, isFirstChild, isLastChild };
            let after = _jsx(TreeActions, { row: o.optionOrg, index: index, parent: parent, rowDetails: details, parentDetails: parentDetails });
            return Object.assign(Object.assign({}, o), { after });
        });
    }
    function getClassName() {
        let className = 'aio-input-tree-body';
        if (!parent) {
            className += ' aio-input-tree-root';
        }
        if (parentOpen) {
            className += ' open';
        }
        className += !mounted ? ' not-mounted' : ' mounted';
        className += ` aio-input-tree-body-level-${level}`;
        return className;
    }
    return (_jsx("div", { className: getClassName(), children: optionsList.map((option, index) => {
            let row = rows[index];
            let id = option.value;
            let details = { level, index, isLastChild: index === optionsList.length - 1, isFirstChild: index === 0 };
            let childs = getChilds({ row, details });
            let open = !!openDic[id];
            let item = {
                row, option, parent, parentId, id, parentOpen, open, details,
                indent: Object.assign({ height: size, childsLength: childs.length, size: indent, parentIndent }, details)
            };
            return _jsxs(Fragment, { children: [_jsx(TreeRow, { item: item }), _jsx(TreeChilds, { item: item })] }, index);
        }) }));
};
const TreeRow = (props) => {
    let { openDic, getChilds, toggle, rootProps } = useContext(TreeContext);
    let { item } = props;
    let childs = getChilds(item);
    let open = !childs.length ? undefined : (!!openDic[item.id] ? true : false);
    const { row, indent, option } = item;
    const { level, size, height } = indent;
    const { checked } = option;
    const getBefore = () => {
        var _a;
        return [
            _jsx(Indent, { row: row, width: size, height: height, level: level, isLastChild: item.indent.isLastChild, isLeaf: !childs || !childs.length, isParentLastChild: !!((_a = item.indent.parentIndent) === null || _a === void 0 ? void 0 : _a.isLastChild), rtl: !!rootProps.rtl, toggleIcon: rootProps.toggleIcon, open: open, onToggle: () => toggle(item.id) }),
            _jsx(_Fragment, { children: checked === undefined ? null : _jsx(CheckIcon, { checked: checked, checkIcon: rootProps.checkIcon, row: row }) }),
            _jsx(_Fragment, { children: item.option.before || null })
        ];
    };
    let p = { option: Object.assign(Object.assign({}, item.option), { before: getBefore(), checked: undefined }) };
    return _jsx(Layout, Object.assign({}, p));
};
const TreeChilds = (props) => {
    let { getChilds } = useContext(TreeContext);
    let { row, id, open, indent, details } = props.item, childs = getChilds(props.item);
    if (!open || !childs || !childs.length) {
        return null;
    }
    return _jsx(TreeBody, { rows: childs, level: indent.level + 1, parent: row, parentId: id, parentIndent: indent, parentDetails: details });
};
const DPContext = createContext({});
export function Calendar(props) {
    let { rootProps, DATE } = useContext(AICTX);
    let { onClose } = props;
    let { multiple, unit = Def('date-unit'), jalali, value, disabled, size = 12, theme = Def('theme'), translate, onChange = () => { }, option = {} } = rootProps;
    let [months] = useState(DATE.getMonths(jalali));
    let [today] = useState(DATE.getToday(jalali));
    let [todayWeekDay] = useState(DATE.getWeekDay(today).weekDay);
    let [thisMonthString] = useState(months[today[1] - 1]);
    let [activeDate, setActiveDate] = useState(getActiveDate);
    const [popup, setPopup] = useState(null);
    let [popupMounted, setPopupMounted] = useState(false);
    function getDate() {
        let date;
        if (multiple) {
            date = value.length ? value[value.length - 1] : undefined;
        }
        else {
            date = value;
        }
        return date;
    }
    function getActiveDate() {
        let date = getDate();
        date = !date || date === null ? today : date;
        let [year, month, day] = DATE.convertToArray(date);
        return { year, month, day };
    }
    let adRef = useRef(activeDate);
    adRef.current = activeDate;
    function trans(text) {
        if (translate) {
            const res = translate(text);
            if (res) {
                return res;
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
        let obj = { 'Clear': 'حذف', 'This Hour': 'ساعت کنونی', 'Today': 'امروز', 'This Month': 'ماه جاری', 'Select Year': 'انتخاب سال', 'Close': 'بستن' };
        let res = text;
        if (jalali && obj[text]) {
            res = obj[text];
        }
        return res;
    }
    function changePopup(popup) {
        popupMounted = false;
        if (popup === null) {
            setPopupMounted(false);
            setTimeout(() => setPopup(null), 300);
        }
        else {
            setPopup(popup);
            setTimeout(() => setPopupMounted(true), 0);
        }
    }
    function changeActiveDate(obj) {
        let newActiveDate;
        if (obj === 'today') {
            let [year, month, day] = today;
            newActiveDate = { year, month, day: unit === 'month' ? 1 : day };
        }
        else {
            newActiveDate = Object.assign(Object.assign({}, activeDate), obj);
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
        let date = getDate();
        return typeof date === 'string' ? DATE.getSplitter(date) : '/';
    }
    function getContext() {
        let context = {
            changeActiveDate, DATE, changePopup,
            translate: trans, rootProps, activeDate: adRef.current,
            today, todayWeekDay, thisMonthString, months,
            onChange: (p) => {
                let { year = 1000, month = 1, day = 1, hour = 0 } = p;
                let dateArray = [year, month, day, hour];
                let jalaliDateArray = !jalali ? DATE.toJalali(dateArray) : dateArray;
                let gregorianDateArray = jalali ? DATE.toGregorian(dateArray) : dateArray;
                let { weekDay, index: weekDayIndex } = unit === 'month' ? { weekDay: '', index: 0 } : DATE.getWeekDay(dateArray);
                let get2digit = (v) => {
                    if (v === undefined) {
                        return;
                    }
                    let vn = v.toString();
                    return vn.length === 1 ? `0${vn}` : vn;
                };
                let dateString = '';
                let splitter = getSplitter();
                if (unit === 'month') {
                    dateString = `${year}${splitter}${get2digit(month)}`;
                }
                else if (unit === 'day') {
                    dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}`;
                }
                else if (unit === 'hour') {
                    dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}${splitter}${get2digit(hour)}`;
                }
                let monthString = months[month - 1];
                let jalaliMonthString = !jalali ? DATE.getMonths(true)[month - 1] : monthString;
                let gregorianMonthString = jalali ? DATE.getMonths(false)[month - 1] : monthString;
                let props = {
                    months, jalaliDateArray, gregorianDateArray, dateArray, weekDay, weekDayIndex, dateString,
                    year, month, day, hour, monthString, jalaliMonthString, gregorianMonthString
                };
                let newValue, index = 0;
                if (multiple) {
                    let current = [];
                    if (value) {
                        if (!Array.isArray(value)) {
                            current = [value];
                        }
                        else {
                            current = [...value];
                        }
                    }
                    else {
                        current = [];
                    }
                    let index = current.indexOf(dateString);
                    if (index === -1) {
                        newValue = [...current, dateString];
                    }
                    else {
                        newValue = current.filter((o) => o !== dateString);
                    }
                    if (typeof multiple === 'number') {
                        while (newValue.length > multiple) {
                            newValue = newValue.slice(1, newValue.length);
                        }
                    }
                    index = newValue.length - 1;
                }
                else {
                    index = 0;
                    newValue = dateString;
                }
                onChange(newValue, props);
                if (onClose) {
                    if (typeof option.close === 'function') {
                        if (option.close(undefined, { index, rootProps })) {
                            onClose();
                        }
                    }
                }
            }
        };
        return context;
    }
    return (_jsxs(DPContext.Provider, { value: getContext(), children: [_jsxs("div", { className: 'aio-input-date-container aio-input-date-theme-bg', style: { display: 'flex', fontSize: size }, children: [_jsxs("div", { className: 'aio-input-date-calendar', style: getPopupStyle(), children: [_jsx(DPHeader, {}), _jsx(DPBody, {}), _jsx(DPFooter, {})] }), _jsx(DPToday, {})] }), _jsx("div", { className: `aio-input-date-popup-container ${popupMounted ? 'mounted' : 'not-mounted'}`, children: popup })] }));
}
function DPToday() {
    let { rootProps, translate, today, todayWeekDay, thisMonthString } = useContext(DPContext);
    let { theme = Def('theme'), jalali, unit = Def('date-unit') } = rootProps;
    return (_jsxs("div", { className: 'aio-input-date-today aio-input-date-theme-active', style: { color: theme[1], background: theme[0] }, children: [_jsx("div", { className: 'aio-input-date-today-label', children: translate('Today') }), unit !== 'month' && _jsx("div", { className: 'aio-input-date-today-weekday', children: !jalali ? todayWeekDay.slice(0, 3) : todayWeekDay }), unit !== 'month' && _jsx("div", { className: 'aio-input-date-today-day', children: today[2] }), _jsx("div", { className: 'aio-input-date-today-month', children: !jalali ? thisMonthString.slice(0, 3) : thisMonthString }), _jsx("div", { className: 'aio-input-date-today-year', children: today[0] }), unit === 'hour' && _jsx("div", { className: 'aio-input-date-today-year', children: today[3] + ':00' })] }));
}
function DPFooter() {
    let { rootProps, changeActiveDate, translate } = useContext(DPContext);
    let { disabled, onChange = () => { }, deSelect, multiple, now = true } = rootProps;
    if (disabled) {
        return null;
    }
    const buttonClassName = 'aio-input-date-theme-color';
    function clear() {
        if (typeof deSelect === 'function') {
            deSelect();
        }
        else {
            onChange(multiple ? [] : undefined);
        }
    }
    return (_jsxs("div", { className: 'aio-input-date-footer', children: [!!deSelect && _jsx("button", { onClick: () => clear(), className: buttonClassName, children: translate('Clear') }), !!now && _jsx("button", { onClick: () => changeActiveDate('today'), className: buttonClassName, children: translate('Today') })] }));
}
function DPBody() {
    let { rootProps, activeDate } = useContext(DPContext);
    let { unit = Def('date-unit'), jalali } = rootProps;
    function getClassName() {
        let res = 'aio-input-date-body';
        res += ` aio-input-date-body-${unit}`;
        res += ` aio-input-date-${jalali ? 'rtl' : 'ltr'}`;
        //var columnCount = { hour: 4, day: 7, month: 3, year: 1 }[unit as AI_date_unit];
        //var rowCount = { hour: 6, day: 7, month: 4, year: 1 }[unit as AI_date_unit];
        return res;
    }
    return (_jsxs("div", { className: getClassName(), children: [unit === 'hour' && UT.GetArray(24, (i) => _jsx(DPCell, { dateArray: [activeDate.year, activeDate.month, activeDate.day, i] }, 'cell' + i)), unit === 'day' && _jsx(DPBodyDay, {}), unit === 'month' && UT.GetArray(12, (i) => _jsx(DPCell, { dateArray: [activeDate.year, i + 1] }, 'cell' + i))] }));
}
function DPBodyDay() {
    let { rootProps, activeDate, DATE } = useContext(DPContext);
    let { theme = Def('theme'), jalali } = rootProps;
    let firstDayWeekDayIndex = DATE.getWeekDay([activeDate.year, activeDate.month, 1]).index;
    let daysLength = DATE.getMonthDaysLength([activeDate.year, activeDate.month]);
    let weekDays = DATE.getWeekDays(jalali);
    return (_jsxs(_Fragment, { children: [weekDays.map((weekDay, i) => _jsx(DPCellWeekday, { weekDay: weekDay }, 'weekday' + i)), UT.GetArray(firstDayWeekDayIndex, (i) => _jsx("div", { className: 'aio-input-date-space aio-input-date-cell', style: { background: theme[1] } }, 'space' + i)), UT.GetArray(daysLength, (i) => _jsx(DPCell, { dateArray: [activeDate.year || 0, activeDate.month || 0, i + 1] }, 'cell' + i)), UT.GetArray(42 - (firstDayWeekDayIndex + daysLength), (i) => _jsx("div", { className: 'aio-input-date-space aio-input-date-cell', style: { background: theme[1] } }, 'endspace' + i))] }));
}
const DPCellWeekday = (props) => {
    let { rootProps, translate } = useContext(DPContext);
    let { theme = Def('theme'), jalali } = rootProps;
    let { weekDay } = props;
    return (_jsx("div", { className: 'aio-input-date-weekday aio-input-date-cell aio-input-date-theme-color', style: { background: theme[1], color: theme[0] }, children: _jsx("span", { children: translate(weekDay.slice(0, !jalali ? 2 : 1)) }) }));
};
function DPCell(props) {
    let { rootProps, translate, onChange, DATE } = useContext(DPContext);
    let { disabled, dateAttrs, theme = Def('theme'), value, jalali, unit = Def('date-unit'), multiple } = rootProps;
    let { dateArray } = props;
    function IsActive() {
        if (multiple) {
            return !value.length ? false : !!value.find((o) => DATE.isEqual(dateArray, o));
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
            str += ' aio-input-date-active aio-input-date-theme-active';
        }
        else {
            str += ' aio-input-date-theme-color';
        }
        if (isToday) {
            str += ' today aio-input-date-theme-border';
        }
        if (className) {
            str += ` ${className}`;
        }
        return str;
    }
    let isActive = IsActive();
    let isToday = DATE.isEqual(dateArray, DATE.getToday(jalali));
    let isFuture = DATE.isGreater(dateArray, DATE.getToday(jalali));
    let Attrs = {};
    if (dateAttrs) {
        const { unit = 'day' } = rootProps;
        let weekDay = null, weekDayIndex = null, monthString = '';
        if (unit === 'day') {
            const a = DATE.getWeekDay(dateArray);
            weekDay = a.weekDay;
            weekDayIndex = a.index;
        }
        else if (unit === 'month') {
            const months = DATE.getMonths(jalali);
            monthString = months[dateArray[1] - 1];
        }
        Attrs = dateAttrs({ dateArray, isToday, isActive, isFuture, weekDayIndex, weekDay, monthString });
        Attrs = Attrs || {};
    }
    let isDisabled = disabled === true || Attrs.disabled === true;
    let className = getClassName(isActive, isToday, isDisabled, Attrs.className);
    let onClick = isDisabled ? undefined : () => { onChange({ year: dateArray[0], month: dateArray[1], day: dateArray[2], hour: dateArray[3] }); };
    let style = {};
    if (!isDisabled) {
        style.background = theme[1];
        style.color = theme[0];
    }
    if (className.indexOf('aio-input-date-active') !== -1) {
        style.background = theme[0];
        style.color = theme[1];
    }
    if (className.indexOf('today') !== -1) {
        style.border = `1px solid ${theme[0]}`;
    }
    style = Object.assign(Object.assign({}, style), Attrs.style);
    let text;
    if (unit === 'hour') {
        text = dateArray[3] + ':00';
    }
    else if (unit === 'day') {
        text = dateArray[2];
    }
    else if (unit === 'month') {
        let months = DATE.getMonths(jalali);
        text = translate(!jalali ? months[dateArray[1] - 1].slice(0, 3) : months[dateArray[1] - 1]);
    }
    return _jsx("div", { style: style, onClick: onClick, className: className, children: isDisabled ? _jsx("del", { children: text }) : text });
}
function DPHeaderItem(props) {
    let { unit } = props;
    let { rootProps, activeDate, months, changePopup } = useContext(DPContext);
    let { theme = Def('theme'), jalali } = rootProps;
    if (!activeDate || !activeDate[unit]) {
        return null;
    }
    let text = unit === 'year' ? activeDate.year : months[activeDate[unit] - 1].substring(0, jalali ? 10 : 3);
    return (_jsx("button", { type: 'button', className: "aio-input-date-dropdown aio-input-date-theme-color", style: { color: theme[0], background: theme[1] }, onClick: () => changePopup(_jsx(DPHeaderPopup, { onClose: () => changePopup(null), unit: unit })), children: text }));
}
const DPHeaderPopup = (props) => {
    let { onClose, unit } = props;
    let { rootProps, DATE, translate, activeDate, changeActiveDate } = useContext(DPContext);
    let { jalali, theme = Def('theme') } = rootProps;
    let [months] = useState(DATE.getMonths(jalali));
    let [start, setStart] = useState(Math.floor(activeDate.year / 10) * 10);
    let [year, setYear] = useState(activeDate.year);
    let [month, setMonth] = useState(activeDate.month);
    useEffect(() => {
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
        let newStart = start + (dir * 10);
        setStart(newStart);
    }
    function getCells() {
        let cells = [];
        const getCls = (active) => {
            let className = 'aio-input-date-cell';
            if (active) {
                className += ' aio-input-date-active aio-input-date-theme-active';
            }
            else {
                className += ' aio-input-date-theme-color';
            }
            return className;
        };
        if (unit === 'year') {
            for (let i = start; i < start + 10; i++) {
                let active = i === year;
                let p = { style: active ? { background: theme[0], color: theme[1] } : { background: theme[1], color: theme[0] }, className: getCls(active), onClick: () => changeValue(i) };
                cells.push(_createElement("div", Object.assign({}, p, { key: i }), i));
            }
        }
        else {
            for (let i = 1; i <= 12; i++) {
                let active = i === month;
                let p = { style: active ? { background: theme[0], color: theme[1] } : { background: theme[1], color: theme[0] }, className: getCls(active), onClick: () => changeValue(i) };
                let text = months[i - 1];
                if (!jalali) {
                    text = `${text.slice(0, 3)} (${i})`;
                }
                cells.push(_createElement("div", Object.assign({}, p, { key: i }), text));
            }
        }
        return cells;
    }
    function header_node() {
        if (unit !== 'year') {
            return null;
        }
        return (_jsxs("div", { className: 'aio-input-date-popup-header', children: [_jsx(DPArrow, { type: 'minus', onClick: () => changePage(-1) }), _jsx("div", { className: 'aio-input-date-popup-label', children: translate('Select Year') }), _jsx(DPArrow, { type: 'plus', onClick: () => changePage(1) })] }));
    }
    function body_node() { return _jsx("div", { className: 'aio-input-date-popup-body', children: getCells() }); }
    function footer_node() {
        const closeText = translate('Close');
        return (_jsx("div", { className: 'aio-input-date-popup-footer', children: _jsx("button", { className: 'aio-input-date-theme-color', onClick: () => onClose(), children: closeText }) }));
    }
    return (_jsxs("div", { style: { background: theme[0], color: theme[1] }, className: 'aio-input-date-popup aio-input-date-theme-bg' + (jalali ? ' aio-input-date-rtl' : ' aio-input-date-ltr'), children: [header_node(), body_node(), footer_node()] }));
};
function DPHeader() {
    let { rootProps, activeDate, changeActiveDate, DATE } = useContext(DPContext);
    let { unit = Def('date-unit') } = rootProps;
    function getDays() {
        if (!activeDate || !activeDate.year || !activeDate.month) {
            return null;
        }
        let daysLength = DATE.getMonthDaysLength([activeDate.year, activeDate.month]);
        let options = UT.GetArray(daysLength, (i) => ({ text: (i + 1).toString(), value: i + 1 }));
        let p = { value: activeDate.day, options, onChange: (day) => changeActiveDate({ day }) };
        return _jsx(DPHeaderDropdown, Object.assign({}, p));
    }
    return (_jsxs("div", { className: 'aio-input-date-header', children: [_jsx(DPArrow, { type: 'minus' }), _jsxs("div", { className: 'aio-input-date-select', children: [_jsx(DPHeaderItem, { unit: 'year' }), unit !== 'month' ? _jsx(DPHeaderItem, { unit: 'month' }) : null, unit === 'hour' ? getDays() : null] }), _jsx(DPArrow, { type: 'plus' })] }));
}
function DPHeaderDropdown(props) {
    let { rootProps } = useContext(DPContext);
    let { value, options, onChange } = props;
    let { theme = Def('theme') } = rootProps;
    let p = {
        value, options, onChange, caret: false, type: 'select',
        attrs: { className: 'aio-input-date-dropdown aio-input-date-theme-color' },
        option: { style: () => { return { background: theme[1], color: theme[0] }; } },
    };
    return (_jsx(AIOInput, Object.assign({}, p)));
}
function DPArrow(props) {
    let { rootProps, changeActiveDate, activeDate, DATE } = useContext(DPContext);
    let { type, onClick } = props;
    let { jalali, unit = Def('date-unit'), theme = Def('theme') } = rootProps;
    function change() {
        if (onClick) {
            onClick();
            return;
        }
        let offset = type === 'minus' ? -1 : 1;
        let date = [activeDate.year, activeDate.month, activeDate.day];
        if (unit === 'month') {
            changeActiveDate({ year: activeDate.year + offset });
        }
        if (unit === 'day') {
            let newDate = [];
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
            let next = DATE.getNextTime(date, offset * 24 * 60 * 60 * 1000, jalali);
            changeActiveDate({ year: next[0], month: next[1], day: next[2] });
        }
    }
    function getIcon() { return I(type === 'minus' ? 'mdiChevronLeft' : 'mdiChevronRight', 1, { color: theme[0] }); }
    return (_jsx("div", { className: 'aio-input-date-arrow aio-input-date-theme-color', onClick: () => change(), children: getIcon() }));
}
const AITableContext = createContext({});
function Table() {
    let { rootProps, DATE } = useContext(AICTX);
    let { paging, getValue = {}, value, onChange = () => { }, onAdd, onRemove, excel, onSwap, onSearch, rowAttrs, onChangeSort, className, style } = rootProps;
    let [dom] = useState(createRef());
    let [searchValue, setSearchValue] = useState('');
    let [columns, setColumns] = useState([]);
    let [searchColumns, setSearchColumns] = useState([]);
    let [excelColumns, setExcelColumns] = useState([]);
    let [temp] = useState({});
    let [DragRows] = useState(!onSwap ? false : new UT.DragClass({
        callback: (dragData, dropData) => {
            if (DragRows === false) {
                return;
            }
            const { dragIndex } = dragData;
            const { dropIndex, rows } = dropData;
            const newRows = DragRows.reOrder(rows, dragIndex, dropIndex);
            const from = rows[dragIndex];
            const to = rows[dropIndex];
            if (typeof onSwap === 'function') {
                onSwap(newRows, from, to);
            }
            else {
                onChange(newRows);
            }
        }
    }));
    let [sorts, setSorts] = useState([]);
    function getColumns() {
        let { columns = [] } = rootProps;
        columns = typeof columns === 'function' ? columns() : columns;
        let searchColumns = [], excelColumns = [];
        let updatedColumns = columns.map((o) => {
            let { id = 'aitc' + Math.round(Math.random() * 1000000), sort, search, excel } = o;
            let column = Object.assign(Object.assign({}, o), { _id: id });
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
        let sorts = [];
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            let { _id, input } = column;
            let sort = column.sort === true ? {} : column.sort;
            if (!sort) {
                continue;
            }
            let { active = false, dir = 'dec' } = sort;
            let getValue;
            if (sort.getValue) {
                getValue = sort.getValue;
            }
            else {
                getValue = (row) => {
                    let value = getDynamics({ value: column.value, row, column });
                    if (input && input.type === 'date') {
                        value = DATE.getTime(value);
                    }
                    return value;
                };
            }
            let type;
            if (input && ['number', 'date', 'range'].indexOf(input.type) !== -1) {
                type = 'number';
            }
            else {
                type = sort.type || 'string';
            }
            let sortItem = { dir, title: sort.title || column.title, sortId: _id, active, type, getValue };
            sorts.push(sortItem);
        }
        setSorts(sorts);
    }
    function getDynamics(p) {
        let { value, row, column, def, rowIndex } = p;
        if (paging) {
            let { number, size } = paging;
            if (rowIndex)
                rowIndex += ((number - 1) * size);
        }
        let type = typeof value;
        if (type === 'string') {
            let result = value;
            let param = { row, column: column, rowIndex: rowIndex };
            if (getValue[value]) {
                result = getValue[value](param);
            }
            else if (value.indexOf('row.') !== -1) {
                try {
                    eval(`result = ${value}`);
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
            return value({ row, column, rowIndex });
        }
        return value === undefined ? def : value;
    }
    useEffect(() => {
        let columns = getColumns();
        getSorts(columns);
    }, []);
    function add() { typeof onAdd === 'function' ? onAdd() : onChange([Object.assign({}, onAdd), ...value]); }
    function remove(row, index) {
        let action = () => onChange(value.filter((o) => o._id !== row._id));
        typeof onRemove === 'function' ? onRemove({ row, action, rowIndex: index }) : action();
    }
    function exportToExcel() {
        let list = [];
        if (typeof rootProps.excel === 'function') {
            list = rootProps.excel(value);
        }
        else {
            for (let i = 0; i < value.length; i++) {
                let row = value[i], json = {};
                for (let j = 0; j < excelColumns.length; j++) {
                    let column = excelColumns[j], { excel, value } = column;
                    let key = '';
                    if (excel === true) {
                        if (typeof column.title === 'string') {
                            key = column.title;
                        }
                        else {
                            key = 'untitle';
                        }
                    }
                    else if (typeof excel === 'string') {
                        key = excel;
                    }
                    else {
                        continue;
                    }
                    json[key] = getDynamics({ value, row, column, rowIndex: i });
                }
                list.push(json);
            }
        }
        UT.ExportToExcel(list, { promptText: typeof excel === 'string' ? excel : 'Inter Excel File Name' });
    }
    function getSearchedRows(rows) {
        if (onSearch !== true) {
            return rows;
        }
        if (!searchColumns.length || !searchValue) {
            return rows;
        }
        return AIOInputSearch(rows, searchValue, (row, index) => {
            let str = '';
            for (let i = 0; i < searchColumns.length; i++) {
                let column = searchColumns[i];
                let value = getDynamics({ value: column.value, row, def: '', column, rowIndex: index });
                if (value) {
                    str += value + ' ';
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
        return rows.sort((a, b) => {
            for (let i = 0; i < sorts.length; i++) {
                let { dir, getValue } = sorts[i];
                if (!getValue) {
                    return 0;
                }
                let aValue = getValue(a), bValue = getValue(b);
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
        let activeSorts = sorts.filter((sort) => sort.active !== false);
        if (!activeSorts.length || !rows.length) {
            return rows;
        }
        temp.isInitSortExecuted = true;
        let sortedRows = sortRows(rows, activeSorts);
        onChange(sortedRows);
        return sortedRows;
    }
    function getRows() {
        let searchedRows = getSearchedRows(value);
        let sortedRows = getSortedRows(searchedRows);
        let pagedRows = paging && !paging.serverSide ? sortedRows.slice((paging.number - 1) * paging.size, paging.number * paging.size) : sortedRows;
        return { rows: value, searchedRows, sortedRows, pagedRows };
    }
    //calculate style of cells and title cells
    function getCellStyle(column) {
        let width = getDynamics({ value: column.width });
        let minWidth = getDynamics({ value: column.minWidth });
        return { width: width ? width : undefined, flex: width ? undefined : 1, minWidth };
    }
    function getCellAttrs(p) {
        let { row, rowIndex, column, type } = p;
        let { cellAttrs, titleAttrs } = column;
        let attrs = getDynamics({ value: type === 'title' ? titleAttrs : cellAttrs, column, def: {}, row, rowIndex });
        let justify = getDynamics({ value: column.justify, def: false });
        let cls = `aio-input-table-${type}` + (justify ? ` aio-input-table-${type}-justify` : '');
        attrs = UT.AddToAttrs(attrs, { className: cls, style: getCellStyle(column) });
        if (type === 'title') {
            attrs.title = getDynamics({ value: column.title, def: '' });
        }
        return Object.assign({}, attrs);
    }
    function getRowAttrs(row, rowIndex) {
        let attrs = rowAttrs ? rowAttrs({ row, rowIndex }) : {};
        let obj = UT.AddToAttrs(attrs, { className: 'aio-input-table-row' });
        if (DragRows !== false) {
            obj = Object.assign(Object.assign(Object.assign({}, obj), DragRows.getDragAttrs({ dragIndex: rowIndex })), DragRows.getDropAttrs({ dropIndex: rowIndex, rows: value }));
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
        let context = {
            ROWS, rootProps, columns, sorts, setSorts, sortRows, excelColumns, getCellAttrs, getRowAttrs,
            add, remove, search, exportToExcel, getDynamics
        };
        return context;
    }
    let ROWS = getRows();
    let attrs = UT.AddToAttrs(rootProps.attrs, { className: ['aio-input aio-input-table', className], style: rootProps.style, attrs: { ref: dom } });
    return (_jsx(AITableContext.Provider, { value: getContext(ROWS), children: _jsxs("div", Object.assign({}, attrs, { children: [_jsx(TableToolbar, {}), _jsxs("div", { className: 'aio-input-table-unit aio-input-scroll', children: [_jsx(TableHeader, {}), _jsx(TableRows, {})] }), paging ? _jsx(TablePaging, {}) : ''] })) }));
}
function TableGap(props) {
    let { rootProps } = useContext(AITableContext);
    let { rowGap, columnGap } = rootProps;
    let { dir } = props;
    let style;
    if (dir === 'h') {
        style = { height: rowGap };
    }
    else {
        style = { width: columnGap };
    }
    return _jsx("div", { className: `aio-input-table-border-${dir}`, style: style });
}
function TablePaging() {
    let { ROWS, rootProps } = useContext(AITableContext);
    let [temp] = useState({ timeout: undefined, start: undefined, end: undefined, pages: 0 });
    function fix(paging) {
        if (typeof rootProps.onChangePaging !== 'function') {
            alert('aio-input error => in type table you set paging but forget to set onChangePaging function prop to aio input');
            return { number: 0, size: 0 };
        }
        let { number, size = 20, length = 0, sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100], serverSide } = paging;
        if (!serverSide) {
            length = ROWS.sortedRows.length;
        }
        if (sizes.indexOf(size) === -1) {
            size = sizes[0];
        }
        let pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        let start = number - 3, end = number + 3;
        temp.start = start;
        temp.end = end;
        temp.pages = pages;
        return Object.assign(Object.assign({}, paging), { length, number, size, sizes });
    }
    let [paging, setPaging] = useState(fix(rootProps.paging || { size: 0, number: 0 }));
    useEffect(() => {
        if (rootProps.paging) {
            setPaging(fix(rootProps.paging));
        }
    }, [(rootProps.paging || { size: 0, number: 0, length: 0 }).size, (rootProps.paging || { size: 0, number: 0, length: 0 }).number, (rootProps.paging || { size: 0, number: 0, length: 0 }).length]);
    function changePaging(obj) {
        let newPaging = fix(Object.assign(Object.assign({}, paging), obj));
        setPaging(newPaging);
        if (rootProps.onChangePaging) {
            if (newPaging.serverSide) {
                clearTimeout(temp.timeout);
                temp.timeout = setTimeout(() => {
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
    let { number, size, sizes } = paging;
    let buttons = [];
    let isFirst = true;
    for (let i = temp.start; i <= temp.end; i++) {
        if (i < 1 || i > temp.pages) {
            buttons.push(_jsx("button", { className: 'aio-input-table-paging-button aio-input-table-paging-button-hidden', children: i }, i));
        }
        else {
            let index;
            if (isFirst) {
                index = 1;
                isFirst = false;
            }
            else if (i === Math.min(temp.end, temp.pages)) {
                index = temp.pages;
            }
            else {
                index = i;
            }
            buttons.push(_jsx("button", { className: 'aio-input-table-paging-button' + (index === number ? ' active' : ''), onClick: () => changePaging({ number: index }), children: index }, index));
        }
    }
    function changeSizeButton() {
        if (!sizes || !sizes.length) {
            return null;
        }
        let p = {
            attrs: { className: 'aio-input-table-paging-button aio-input-table-paging-size' },
            type: 'select', value: size, options: sizes, option: { text: 'option', value: 'option' },
            onChange: (value) => changePaging({ size: value }),
            popover: { fitHorizontal: true },
        };
        return (_jsx(AIOInput, Object.assign({}, p)));
    }
    return (_jsxs("div", { className: 'aio-input-table-paging', children: [buttons, changeSizeButton()] }));
}
function TableRows() {
    let { ROWS, rootProps } = useContext(AITableContext);
    let { rowTemplate, rowAfter = () => null, rowBefore = () => null, rowsTemplate, placeholder = 'there is not any items' } = rootProps;
    let rows = ROWS.pagedRows || [];
    let content;
    if (rowsTemplate) {
        content = rowsTemplate(rows);
    }
    else if (rows.length) {
        content = rows.map((o, i) => {
            let { id = 'ailr' + Math.round(Math.random() * 10000000) } = o;
            o._id = o._id === undefined ? id : o._id;
            let isLast = i === rows.length - 1, Row;
            if (rowTemplate) {
                Row = rowTemplate({ row: o, rowIndex: i, isLast });
            }
            else {
                Row = _jsx(TableRow, { row: o, rowIndex: i, isLast: isLast }, o._id);
            }
            return (_jsxs(Fragment, { children: [rowBefore({ row: o, rowIndex: i }), Row, rowAfter({ row: o, rowIndex: i })] }, o._id));
        });
    }
    else if (placeholder) {
        content = _jsx("div", { style: { width: '100%', textAlign: 'center', padding: 12, boxSizing: 'border-box' }, children: placeholder });
    }
    else {
        return null;
    }
    return _jsx("div", { className: 'aio-input-table-rows', children: content });
}
function TableToolbar() {
    let { add, exportToExcel, sorts, sortRows, setSorts, search, rootProps, excelColumns } = useContext(AITableContext);
    let { toolbarAttrs, toolbar, onAdd, onSearch, onChangeSort, onChange = () => { }, value, addText } = rootProps;
    toolbarAttrs = UT.AddToAttrs(toolbarAttrs, { className: 'aio-input-table-toolbar' });
    if (!onAdd && !toolbar && !onSearch && !sorts.length && !excelColumns.length) {
        return null;
    }
    function changeSort(sortId, changeObject) {
        let newSorts = sorts.map((sort) => {
            if (sort.sortId === sortId) {
                let newSort = Object.assign(Object.assign({}, sort), changeObject);
                return newSort;
            }
            return sort;
        });
        changeSorts(newSorts);
    }
    function changeSorts(sorts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (onChangeSort) {
                let res = yield onChangeSort(sorts);
                if (res !== false) {
                    setSorts(sorts);
                }
            }
            else {
                setSorts(sorts);
                let activeSorts = sorts.filter((sort) => sort.active !== false);
                if (activeSorts.length) {
                    onChange(sortRows(value, activeSorts));
                }
            }
        });
    }
    function button() {
        if (!sorts.length) {
            return null;
        }
        let p = {
            popover: {
                header: { title: 'Sort', onClose: false },
                setAttrs: (key) => { if (key === 'header') {
                    return { className: 'aio-input-table-toolbar-popover-header' };
                } },
                limitTo: '.aio-input-table'
            },
            caret: false, type: 'select', options: sorts,
            option: {
                text: 'option.title',
                checked: '!!option.active',
                close: () => false,
                value: 'option.sortId',
                after: (option) => {
                    let { dir = 'dec', sortId } = option;
                    return (_jsx("div", { onClick: (e) => {
                            e.stopPropagation();
                            changeSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' });
                        }, children: I(dir === 'dec' ? 'mdiArrowDown' : 'mdiArrowUp', 0.8) }));
                }
            },
            attrs: { className: 'aio-input-table-toolbar-button' },
            text: I('mdiSort', 0.7),
            onSwap: (newSorts, from, to) => changeSorts(newSorts),
            onChange: (value, option) => changeSort(value, { active: !option.checked })
        };
        return (_createElement(AIOInput, Object.assign({}, p, { key: 'sortbutton' })));
    }
    function getAddText() {
        let { addText } = rootProps;
        if (!rootProps.addText) {
            return I('mdiPlusThick', 0.8);
        }
        if (typeof addText === 'function') {
            return addText(value);
        }
        return addText;
    }
    return (_jsxs(_Fragment, { children: [_jsxs("div", Object.assign({}, toolbarAttrs, { children: [toolbar && _jsx("div", { className: 'aio-input-table-toolbar-content', children: typeof toolbar === 'function' ? toolbar() : toolbar }), _jsx("div", { className: 'aio-input-table-search', children: !!onSearch && _jsx(AIOInput, { type: 'text', onChange: (value) => search(value), after: I('mdiMagnify', 0.7) }) }), button(), !!excelColumns.length && _jsx("div", { className: 'aio-input-table-toolbar-button', onClick: () => exportToExcel(), children: I('mdiFileExcel', 0.8) }), !!onAdd && _jsx("div", { className: 'aio-input-table-toolbar-button', onClick: () => add(), children: getAddText() })] })), _jsx(TableGap, { dir: 'h' })] }));
}
function TableHeader() {
    let { rootProps, columns } = useContext(AITableContext);
    let { headerAttrs, onRemove } = rootProps;
    headerAttrs = UT.AddToAttrs(headerAttrs, { className: 'aio-input-table-header' });
    let Titles = columns.map((o, i) => _jsx(TableTitle, { column: o, isLast: i === columns.length - 1 }, o._id));
    let RemoveTitle = !onRemove ? null : _jsxs(_Fragment, { children: [_jsx(TableGap, { dir: 'v' }), _jsx("div", { className: 'aio-input-table-remove-title' })] });
    return _jsxs("div", Object.assign({}, headerAttrs, { children: [Titles, RemoveTitle, _jsx(TableGap, { dir: 'h' })] }));
}
function TableTitle(p) {
    let { column, isLast } = p;
    let { getCellAttrs } = useContext(AITableContext);
    let attrs = getCellAttrs({ column, type: 'title' });
    return (_jsxs(_Fragment, { children: [_jsx("div", Object.assign({}, attrs, { children: attrs.title })), !isLast && _jsx(TableGap, { dir: 'v' })] }));
}
function TableRow(p) {
    let { row, isLast, rowIndex } = p;
    let { remove, rootProps, columns, getRowAttrs } = useContext(AITableContext);
    function getCells() {
        return columns.map((column, i) => {
            let key = row._id + ' ' + column._id;
            let isLast = i === columns.length - 1;
            return (_jsx(TableCell, { isLast: isLast, row: row, rowIndex: rowIndex, column: column }, key));
        });
    }
    let { onRemove } = rootProps;
    return (_jsxs(_Fragment, { children: [_jsxs("div", Object.assign({}, getRowAttrs(row, rowIndex), { children: [getCells(), onRemove ? _jsxs(_Fragment, { children: [_jsx(TableGap, { dir: 'v' }), _jsx("button", { className: 'aio-input-table-remove', onClick: () => remove(row, rowIndex), children: I('mdiClose', 0.8) })] }) : null] }), row._id), _jsx(TableGap, { dir: 'h' })] }));
}
const TableCell = (p) => {
    let { row, rowIndex, column, isLast } = p;
    let { getCellAttrs, rootProps, getDynamics } = useContext(AITableContext);
    let { onChange = () => { }, value = [] } = rootProps;
    function setCell(row, column, cellNewValue) {
        if (column.input && column.input.onChange) {
            column.input.onChange({ value: cellNewValue, row, column });
        }
        else {
            row = JSON.parse(JSON.stringify(row));
            eval(`${column.value} = cellNewValue`);
            onChange(value.map((o) => o._id !== row._id ? o : row));
        }
    }
    let contentProps = { row, rowIndex, column, onChange: column.input ? (value) => setCell(row, column, value) : undefined };
    let key = row._id + ' ' + column._id;
    return (_jsxs(Fragment, { children: [_jsx("div", Object.assign({}, getCellAttrs({ row, rowIndex, column, type: 'cell' }), { children: _createElement(TableCellContent, Object.assign({}, contentProps, { key: key })) })), !isLast && _jsx(TableGap, { dir: 'v' })] }, key));
};
function TableCellContent(props) {
    let { row, column, rowIndex, onChange } = props;
    let { getDynamics } = useContext(AITableContext);
    let template = getDynamics({ value: column.template, row, rowIndex, column });
    if (template !== undefined) {
        return template;
    }
    let input = getDynamics({ value: column.input, row, rowIndex, column });
    let value = getDynamics({ value: column.value, row, rowIndex, column });
    if (!input) {
        return typeof value === 'object' ? '' : value;
    }
    //justify baraye input ast amma agar rooye column set shode va input set nashode be input bede
    input.justify = input.justify || getDynamics({ value: column.justify, row, rowIndex, column });
    let convertedInput = { type: 'text' };
    for (let property in input) {
        let prop = property;
        let res = input[prop];
        if (['onChange', 'onClick'].indexOf(prop) !== -1) {
            convertedInput[prop] = res;
        }
        else {
            convertedInput[prop] = getDynamics({ value: res, row, rowIndex, column });
        }
    }
    let p = Object.assign(Object.assign({}, convertedInput), { value, onChange, type: input.type });
    return (_createElement(AIOInput, Object.assign({}, p, { key: row._id + ' ' + column._id })));
}
function AIOInputSearch(items, searchValue, getValue) {
    if (!searchValue) {
        return items;
    }
    function isMatch(keys, value) {
        for (let i = 0; i < keys.length; i++) {
            if (value.indexOf(keys[i]) === -1) {
                return false;
            }
        }
        return true;
    }
    let keys = searchValue.split(' ');
    return items.filter((o, i) => isMatch(keys, getValue ? getValue(o, i) : o));
}
const RangeContext = createContext({});
const Range = () => {
    let { rootProps } = useContext(AICTX);
    const rootPropsRef = useRef(rootProps);
    rootPropsRef.current = rootProps;
    let { start = 0, end = 360, min = start, max = end, step = 1, reverse, round, vertical, multiple, text, onChange, size = Def('range-size'), disabled, className, labels = [], rotate = 0 } = rootProps;
    let [temp] = useState({ dom: createRef(), start: 0, index: false });
    function getValidValue(value) {
        if (!Array.isArray(value)) {
            value = [value || 0];
        }
        for (let i = 0; i < value.length; i++) {
            let point = value[i] || 0;
            point = Math.round((point - start) / step) * step + start;
            point = +point.toFixed(UT.GetPrecisionCount(step));
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
    let value = getValidValue(rootProps.value);
    let valueRef = useRef(value);
    valueRef.current = value;
    let [disabledDic, setDisabledDic] = useState(getDisabledDic());
    function getDisabledDic() {
        if (!Array.isArray(disabled)) {
            return {};
        }
        let res = {};
        for (let i = 0; i < disabled.length; i++) {
            let key = 'a' + disabled[i];
            res[key] = true;
        }
        return res;
    }
    useEffect(() => { setDisabledDic(getDisabledDic()); }, [JSON.stringify(disabled)]);
    useEffect(() => {
        if (!onChange) {
            return;
        }
        clearTimeout(temp.timeOut);
        temp.timeOut = setTimeout(() => {
            new UT.Swip({
                reverseX: !!reverse,
                //vertical condition
                reverseY: !!reverse && !!vertical,
                dom: () => $(temp.dom.current),
                start: (p) => {
                    const { disabled } = rootPropsRef.current;
                    if (disabled === true) {
                        return false;
                    }
                    let { event } = p;
                    if (event.target !== null) {
                        let target = $(event.target);
                        if (UT.HasClass(target, 'ai-range-point')) {
                            let index = target.attr('data-index') || '0';
                            temp.index = +index;
                        }
                        else {
                            temp.index = false;
                        }
                        temp.start = [...valueRef.current];
                    }
                    return [0, 0];
                },
                move: (p) => {
                    let { change, mousePosition } = p;
                    if (change) {
                        changeHandle({ dx: change.dx, dy: change.dy, deltaCenterAngle: change.deltaCenterAngle, centerAngle: mousePosition.centerAngle });
                    }
                },
                onClick: function (p) {
                    const { disabled } = rootPropsRef.current;
                    if (disabled) {
                        return;
                    }
                    click(p.mousePosition);
                }
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
        let value = valueRef.current;
        let clickedValue;
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
        for (let i = 0; i < value.length; i++) {
            if (isValueDisabled(value[i])) {
                return false;
            }
        }
        return true;
    }
    const sbp = (value, p = {}) => {
        let { half = false, range = size / (half ? 2 : 1) } = p;
        let res = range * value / 100;
        let { min, max } = p;
        if (min !== undefined && res < min) {
            res = min;
        }
        if (max !== undefined && res > max) {
            res = max;
        }
        return res;
    };
    const getCircleByStr = (rc, type) => {
        let thickness = rc.thickness || 1, radius = 0, roundCap = rc.roundCap || false, full = rc.full || false, offset = rc.offset, color = rc.color || '#000', className = rc.className;
        try {
            let thicknessValue = thickness;
            if (isNaN(thicknessValue)) {
                thicknessValue = 1;
            }
            thickness = thicknessValue;
            let offsetValue = offset;
            if (isNaN(offsetValue)) {
                offsetValue = 0;
            }
            let defaultRadius = size / 2 - thickness / 2;
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
        return { thickness, radius, color, roundCap, full, className };
    };
    const getRectByStr = (range) => {
        let { thickness = 1, offset = 0, color = '#000', roundCap = false, className } = range;
        try {
            let thicknessValue = thickness;
            if (isNaN(thicknessValue)) {
                thicknessValue = 1;
            }
            thickness = thicknessValue;
            let offsetValue = offset;
            if (isNaN(offsetValue)) {
                offsetValue = 0;
            }
            let defaultOffset = (size / 2) - (thickness / 2);
            offset = defaultOffset - offsetValue;
            if (offset > size - thickness / 2) {
                offset = size - thickness / 2;
            }
            if (offset < thickness / 2) {
                offset = thickness / 2;
            }
        }
        catch (_a) { }
        return { thickness, offset, color, roundCap, className };
    };
    function change1Unit(dir) {
        let value = valueRef.current;
        let newValue = [...value];
        let lastValue = JSON.stringify(newValue);
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
        let newValue = getChangedValue(obj);
        changeValue(newValue);
    }
    function getIndexLimit(index) {
        let value = valueRef.current;
        let before, after;
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
        return { before, after };
    }
    function moveAll(newValue, offset, ifFailedReturnOriginalValue) {
        let res = newValue.map((o) => o + offset);
        if (res[0] < start || res[res.length - 1] > end) {
            return ifFailedReturnOriginalValue ? valueRef.current : newValue;
        }
        return res;
    }
    function getChangedValue(obj) {
        let { dx, dy, deltaCenterAngle, centerAngle } = obj;
        let startValue = [...temp.start];
        let index = temp.index;
        //agar faghat yek point darim har koja mousedown shod farz kon rooye oon point mousedown karde im
        if (startValue.length === 1 && index === false) {
            index = 0;
        }
        let res;
        if (index === false) {
            let deltaValue;
            if (round) {
                let v = deltaCenterAngle * (end - start) / 360;
                v = Math.round(v / step) * step;
                deltaValue = v;
            }
            else {
                deltaValue = Math.round(getValueByXP(getXPByX(vertical ? dy : dx)) / step) * step;
            }
            let newValue = moveAll(startValue, deltaValue, true);
            res = !isValueValid(newValue) ? valueRef.current : newValue;
        }
        else {
            let { before, after } = getIndexLimit(index);
            let newUnitValue;
            if (round) {
                newUnitValue = Math.round(getValueByAngle(centerAngle) / step) * step;
            }
            else {
                let deltaValue = Math.round(getValueByXP(getXPByX(vertical ? dy : dx)) / step) * step;
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
    function isValueDisabled(value) { return !!disabledDic[`a${value}`]; }
    function getRootClassName() {
        let cls = 'ai-range';
        if (round) {
            cls += ' ai-range-round';
        }
        else {
            cls += ` ai-range-${vertical ? 'vertical' : 'horizontal'}`;
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
        let { style } = rootProps;
        let res;
        if (round) {
            res = { width: size, height: size };
        }
        else if (vertical) {
            res = { width: size };
        }
        else {
            res = { height: size };
        }
        return Object.assign(Object.assign({}, res), style);
    }
    function getRootProps() {
        let { attrs = {} } = rootProps;
        let rootStyle = getRootStyle();
        return UT.AddToAttrs(attrs, { className: getRootClassName(), style: rootStyle, attrs: { ref: temp.dom } });
    }
    function root_node() {
        return (_jsxs("div", Object.assign({}, getRootProps(), { children: [_jsx(RangeGroove, {}), text !== undefined && _jsx("div", { className: 'ai-range-text', children: typeof text === 'function' ? text() : text }, 'rangetext'), !round && _jsxs(Fragment, { children: [_jsx(RangeRanges, {}), _jsx(RangeFills, {})] }, 'rangefill'), _jsx(RangeSvg, {}), labels.map((label, i) => _jsx(RangeLabel, { label: label }, i)), value.map((itemValue, i) => _jsx(RangeValueContainer, { index: i, itemValue: itemValue }, 'rangecontainervalue' + i))] })));
    }
    function fixValueInEmpty(value) {
        round = round || 1;
        let fill = round;
        let empty = 1 - fill;
        let emptyValue = empty * (end - start) / fill;
        if (value > end + emptyValue / 2) {
            value = start - emptyValue + value - end;
        }
        return value;
    }
    function getValueByAngle(angle) {
        let fillAngle = 360 * (round || 1);
        let emptyAngle = 360 - fillAngle;
        if (reverse) {
            angle = 180 - angle;
        }
        angle -= rotate;
        angle -= emptyAngle / 2;
        angle -= 90;
        angle = fixAngle(angle);
        let res = angle * (end - start) / fillAngle;
        res = fixValueInEmpty(res);
        return res;
    }
    function getAngleByValue(value, ang) {
        let fillAngle = 360 * round;
        let emptyAngle = 360 - fillAngle;
        let res = value * fillAngle / (end - start);
        res += 90;
        res += emptyAngle / 2;
        res += rotate;
        res += (ang || 0);
        return reverse ? res = 180 - res : res;
    }
    function fixAngle(angle) { angle = angle % 360; return angle < 0 ? angle = 360 + angle : angle; }
    function getXPByValue(value) { return 100 * (value - start) / (end - start); }
    function getValueByXP(xp) { return xp * (end - start) / 100; }
    function getXPByX(x) { return x * 100 / $(temp.dom.current)[vertical ? 'height' : 'width'](); }
    function getContext() {
        let context = {
            getXPByValue, rootProps, fixAngle, getAngleByValue, dom: temp.dom, getCircleByStr, getRectByStr,
            isValueDisabled, value: valueRef.current, getSide, getOffset, getDefaultOffset, sbp
        };
        return context;
    }
    return (_jsx(RangeContext.Provider, { value: getContext(), children: root_node() }));
};
const RangeGroove = () => {
    let { rootProps } = useContext(RangeContext);
    const attrs = UT.AddToAttrs(rootProps.grooveAttrs, { className: 'ai-range-groove' });
    if (rootProps.round) {
        return null;
    }
    else {
        return _jsx("div", Object.assign({}, attrs));
    }
};
const RangeSvg = () => {
    let { rootProps, value } = useContext(RangeContext);
    let { round, ranges = [], circles = [], size = Def('range-size'), end = 360 } = rootProps;
    if (!round || (!(ranges || [0]).length && !circles.length)) {
        return null;
    }
    let pathes = [_jsx(RangeCircles, {}), _jsx(RangeRanges, {})];
    return (_jsx("svg", { style: { position: 'absolute', left: 0, top: 0 }, width: size, height: size, children: pathes }));
};
const RangeCircles = () => {
    let { rootProps, getCircleByStr } = useContext(RangeContext);
    let { start = 0, end = 360, circles = [], size = Def('range-size') } = rootProps;
    let pathes = [];
    for (let i = 0; i < circles.length; i++) {
        let from = start, to = end;
        let { thickness, color, radius, roundCap, full } = getCircleByStr(circles[i], 'radius');
        let p = { thickness, color, from, to, radius, full, roundCap };
        pathes.push(_jsx(RangeArc, Object.assign({}, p), 'rangecirclearc' + i));
    }
    return _jsx(_Fragment, { children: pathes });
};
const RangeFills = () => {
    let { rootProps, value } = useContext(RangeContext);
    let { start = 0, fill, round } = rootProps;
    if (round || fill === false) {
        return null;
    }
    let limit = value.length === 1 ? [start, value[0]] : [...value];
    let res = [];
    for (let i = 1; i < limit.length; i++) {
        let { thickness, style, className: fillClassName, color } = (typeof fill === 'function' ? fill(i) : fill) || {};
        let from = limit[i - 1];
        let to = limit[i];
        let className = 'ai-range-fill';
        if (fillClassName) {
            className += ' ' + fillClassName;
        }
        let p = { thickness, color, from, to, className, style };
        res.push(_createElement(RangeRect, Object.assign({}, p, { key: 'fill' + i })));
    }
    return _jsx(_Fragment, { children: res });
};
const RangeRanges = () => {
    let { rootProps, getCircleByStr, getRectByStr } = useContext(RangeContext);
    let { start = 0, ranges = [], round, end } = rootProps;
    let res = [], from = start, list = ranges;
    for (let i = 0; i < list.length; i++) {
        let [value, config] = list[i];
        const isFirst = from === start;
        let to = from + value;
        const isLast = to === end;
        let rangeItem;
        if (round) {
            let { thickness, color, radius, roundCap, className } = getCircleByStr(config, 'offset');
            let p = { thickness, color, from, to, radius, roundCap, full: false, className };
            rangeItem = _jsx(RangeArc, Object.assign({}, p), 'rangearc' + i);
        }
        else {
            let { thickness, color, offset, roundCap, className } = getRectByStr(config);
            const cls = UT.classListToString(['ai-range-range', className, isFirst ? 'ai-range-range-first' : '', isLast ? 'ai-range-range-last' : '']);
            let p = { thickness, color, from, to, offset, roundCap, className: cls };
            rangeItem = _createElement(RangeRect, Object.assign({}, p, { key: 'range' + i }));
        }
        res.push(rangeItem);
        from = to;
    }
    return _jsx(_Fragment, { children: res });
};
const RangeValueContainer = (props) => {
    let { rootProps, isValueDisabled, fixAngle, getAngleByValue, getXPByValue, dom, getSide } = useContext(RangeContext);
    let { itemValue, index } = props;
    let { round } = rootProps;
    let angle = fixAngle(getAngleByValue(itemValue));
    function containerProps() {
        let style;
        if (!round) {
            style = { [getSide()]: getXPByValue(itemValue) + '%' };
        }
        else {
            style = { transform: `rotate(${angle}deg)` };
        }
        return { className: 'ai-range-value-container', draggable: false, style };
    }
    let PROPS = {
        value: itemValue, index, disabled: isValueDisabled(itemValue),
        angle, parentDom: dom
    };
    return (_jsxs("div", Object.assign({}, containerProps(), { children: [_createElement(RangeHandle, Object.assign({}, PROPS, { key: 'handle' })), " ", _createElement(RangePoint, Object.assign({}, PROPS, { key: 'point' }))] })));
};
const RangeRect = ({ thickness, color, from, to, className, style, offset, roundCap }) => {
    let { getXPByValue, rootProps, getSide } = useContext(RangeContext);
    let { vertical } = rootProps, startSide = getXPByValue(from), endSide = getXPByValue(to);
    let bigSizeStyle = { [vertical ? 'height' : 'width']: (endSide - startSide) + '%' };
    let smallSizeStyle = { [vertical ? 'width' : 'height']: thickness };
    let mainSideStyle = { [getSide()]: startSide + '%' };
    let otherSideStyle = offset ? { [vertical ? 'left' : 'top']: offset } : {};
    let borderRadiusStyle = roundCap ? { borderRadius: '100%' } : {};
    let colorStyle = { background: color };
    let Style = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, bigSizeStyle), smallSizeStyle), mainSideStyle), otherSideStyle), borderRadiusStyle), colorStyle), style);
    return _jsx("div", { className: className, style: Style });
};
const RangeArc = ({ thickness, color, from, to, radius, full, roundCap, className }) => {
    let { fixAngle, getAngleByValue, rootProps } = useContext(RangeContext);
    let { size = Def('range-size'), reverse } = rootProps;
    let a, b;
    let x = size / 2, y = size / 2;
    if (full) {
        a = 0;
        b = 360;
    }
    else {
        let startAngle = fixAngle(getAngleByValue(from) + 90);
        let endAngle = fixAngle(getAngleByValue(to) + 90);
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
    return _jsx("path", { d: UT.svgArc(x, y, radius, a, b), stroke: color, strokeWidth: thickness, fill: 'transparent', strokeLinecap: roundCap ? 'round' : undefined, className: className }, `from${from}to${to}`);
};
const RangePoint = (props) => {
    let { rootProps, getOffset, sbp } = useContext(RangeContext);
    let [temp] = useState({ dom: createRef() });
    let { value, disabled, angle, index, parentDom } = props;
    if (rootProps.point === false) {
        return null;
    }
    let { round, size = Def('range-size') } = rootProps;
    let point = (rootProps.point || (() => { }))({ disabled, angle, value, index }) || {};
    let { attrs = {}, html = value, offset = 0 } = point;
    let containerStyle, pointStyle = Object.assign({}, attrs.style);
    if (round) {
        containerStyle = { left: size / 2 + offset, transform: `rotate(${-angle}deg)` };
    }
    else {
        containerStyle = { [getOffset()]: offset };
    }
    let containerProps = { ref: temp.dom, className: 'ai-range-point-container', style: containerStyle, draggable: false };
    let pointProps = UT.AddToAttrs(attrs, { className: ['ai-range-point'], style: pointStyle, attrs: { draggable: false, 'data-index': index } });
    pointProps.onMouseDown = (e) => {
        let containers = $(parentDom.current).find('ai-range-value-container');
        containers.css({ zIndex: 10 });
        containers.eq(index).css({ zIndex: 100 });
        if (attrs.onMouseDown) {
            attrs.onMouseDown(e);
        }
    };
    return (_createElement("div", Object.assign({}, containerProps, { key: 'rangepoint' + index }),
        _jsx("div", Object.assign({}, pointProps, { children: html }))));
};
const RangeHandle = (props) => {
    let { rootProps, sbp } = useContext(RangeContext);
    let { value, angle, disabled, index } = props;
    let { handle = (() => { }), round } = rootProps;
    if (handle === false || !round) {
        return null;
    }
    if (handle && typeof handle !== 'function') {
        alert(`aio-input error => in type round, handle props should be a function,
        handle type = (value:number,{disabled:boolean,angle:number})=>{attrs:any}`);
        return null;
    }
    let { sharp = false, thickness = 10, size: handleSize = 90, color = '#000', offset = 0 } = handle(value, { angle, disabled, value }) || {};
    let width = sbp(handleSize, { half: true });
    let height = sbp(thickness, { half: true });
    function getStyle() {
        if (sharp) {
            return {
                [width < 0 ? 'borderRight' : 'borderLeft']: `${Math.abs(width)}px solid ${color}`,
                borderTop: `${height / 2}px solid transparent`,
                borderBottom: `${height / 2}px solid transparent`,
                left: offset
            };
        }
        else {
            return { width, height, left: offset, background: color };
        }
    }
    let PROPS = UT.AddToAttrs({}, {
        className: 'aio-input-handle', style: getStyle(), attrs: { draggable: false }
    });
    return (_createElement("div", Object.assign({}, PROPS, { key: 'rangehandle' + index })));
};
const RangeLabel = (props) => {
    let { dom, rootProps } = useContext(RangeContext);
    let { label } = props;
    let { zIndex, dynamic, step, list = [] } = label;
    let { round, start = 0, end = 360, reverse, vertical } = rootProps;
    let [def] = useState(getDef);
    function getDef() { return RENDER(true); }
    function getList() {
        let res = [];
        if (step) {
            let { start: lstart = start, end: lend = end } = label;
            for (let i = lstart; i <= lend; i += step) {
                res.push(i);
            }
        }
        for (let i = 0; i < list.length; i++) {
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
        let container = $(dom.current);
        let labels = container.find('.ai-range-label');
        if (!labels.length) {
            return;
        }
        let firstLabel = labels.eq(0);
        let firstLabelHProp = firstLabel.attr('data-rotated') === 'yes' ? 'height' : 'width';
        let end = firstLabel.offset().left + (!reverse ? firstLabel[firstLabelHProp]() : 0);
        for (let i = 1; i < labels.length; i++) {
            let label = labels.eq(i);
            let hProp = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
            label.css({ display: 'flex' });
            let left = label.offset().left;
            let width = label[hProp]();
            let right = left + width;
            if (!reverse) {
                if (left < end + 5) {
                    label.css({ display: 'none' });
                }
                else {
                    end = left + width;
                }
            }
            else {
                if (right > end - 5) {
                    label.css({ display: 'none' });
                }
                else {
                    end = left;
                }
            }
        }
    }
    useEffect(() => { $(window).on('resize', updateLabels); }, []);
    useEffect(() => { updateLabels(); });
    function RENDER(init) {
        if (!init && !dynamic) {
            return def;
        }
        return (_jsx("div", { className: 'ai-range-labels', style: { zIndex }, children: getList().map((itemValue) => _jsx(RangeLabelItem, { label: label, itemValue: itemValue }, itemValue)) }));
    }
    return _jsx(_Fragment, { children: RENDER(false) });
};
const RangeLabelItem = (props) => {
    let { rootProps, isValueDisabled, fixAngle, getAngleByValue, getXPByValue, getSide } = useContext(RangeContext);
    let { label, itemValue } = props;
    let { round, vertical, size = Def('range-size') } = rootProps;
    let angle;
    if (round) {
        angle = fixAngle(getAngleByValue(itemValue));
    }
    let disabled = isValueDisabled(itemValue);
    function getContainerStyle(distance) {
        if (round) {
            return { transform: `rotate(${angle}deg)` };
        }
        else {
            return Object.assign({ [getSide()]: getXPByValue(itemValue) + '%' }, distance);
        }
    }
    function getTextStyle(item, distance) {
        let res = {};
        if (round) {
            res = Object.assign(Object.assign({}, res), distance);
            if (item.fixAngle) {
                res = Object.assign(Object.assign({}, res), { transform: `rotate(${-angle}deg)` });
            }
        }
        return Object.assign({ width: 0, height: 0 }, res);
    }
    function getDetails() {
        let item = label.setting(itemValue, { disabled, angle });
        let { offset = 0, html = '' } = item;
        let distance = { [round || vertical ? 'left' : 'top']: size / 2 + offset };
        let containerStyle = getContainerStyle(distance);
        let containerProps = { className: `ai-range-label-container`, style: containerStyle, draggable: false };
        let textProps = UT.AddToAttrs({}, { className: [`ai-range-label`], style: getTextStyle(item, distance), attrs: { draggable: false } });
        return { html, textProps, containerProps };
    }
    let { html, textProps, containerProps } = getDetails();
    return (_jsx("div", Object.assign({}, containerProps, { children: _jsx("div", Object.assign({}, textProps, { children: html })) })));
};
export const AISwitch = ({ colors = [], width = 24, padding = 1, value = false, borderSize = 2, buttonSize = 12, onChange = () => { }, grooveSize = 0, html = () => null, attrs }) => {
    function getContainerStyle() {
        return {
            paddingRight: buttonSize + padding, paddingLeft: padding,
            border: `${borderSize}px solid${colors[0] && colors[1] ? (` ${value ? colors[1] : colors[0]}`) : ''}`
        };
    }
    function getOuterStyle() {
        return { width: width - buttonSize - padding, height: buttonSize + (2 * padding) };
    }
    function getInnerStyle() {
        return { width: buttonSize, height: buttonSize, top: `calc(50% - ${buttonSize / 2}px)`, background: value ? colors[1] : colors[0] };
    }
    function getGrooveStyle() {
        return { position: 'absolute', top: `calc(50% - ${grooveSize / 2}px)`, width: `calc(100% - ${buttonSize + padding * 2}px)`, background: '#ddd', left: padding + buttonSize / 2, height: grooveSize };
    }
    const containerAttrs = UT.AddToAttrs(attrs, {
        className: ['aio-input-switch', !!value ? 'aio-input-main-color' : undefined, !!value ? 'active' : 'deactive'],
        style: getContainerStyle(),
        attrs: { onClick: () => onChange(!value) }
    });
    const innerAttrs = UT.AddToAttrs({}, { className: ['aio-input-switch-inner', !!value ? 'aio-input-main-bg' : undefined, !!value ? 'active' : 'deactive'], style: getInnerStyle() });
    return (_jsxs("div", Object.assign({}, containerAttrs, { children: [!!grooveSize && _jsx("div", { className: "aio-input-switch-groove", style: getGrooveStyle() }), _jsx("div", { className: "aio-input-switch-outer", style: getOuterStyle(), children: _jsx("div", Object.assign({}, innerAttrs, { children: html(!!value) })) })] })));
};
export function AIOInput_defaultProps(p) {
    let storage = new UT.Storage('aio-input-storage');
    for (let prop in p) {
        storage.save(prop, p[prop]);
    }
}
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
    let { type, multiple } = props;
    let isMultiple;
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
        isMultiple,
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
    let valueType = Array.isArray(props.value) ? 'array' : typeof props.value;
    props = Object.assign({}, props);
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
            props.option = Object.assign(Object.assign({}, props.option), { text: 'option', value: 'option' });
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
    let res = {
        'theme': [],
        'date-size': 180,
        'tree-size': 36,
        'range-size': 72,
        'date-unit': 'day'
    }[prop];
    return res;
}
function I(path, size, p) { return new GetSvg().getIcon(path, size, p); }
//isOpen ro baraye tashkhise active(open) boodane node haye tree mifrestim
function GetOptions(p) {
    let { options, rootProps, types, level, isOpen, change, optionProp } = p;
    let { deSelect } = rootProps;
    let result = [];
    let dic = {};
    let draggable = types.isDropdown && types.hasOption && !!rootProps.onSwap;
    function getDefaultOptionChecked(v) {
        if (rootProps.type === 'select' && types.isMultiple) {
            return rootProps.value.indexOf(v) !== -1;
        }
        if (rootProps.type === 'radio') {
            return types.isMultiple ? rootProps.value.indexOf(v) !== -1 : rootProps.value === v;
        }
    }
    if (deSelect && typeof deSelect !== 'function' && deSelect !== true) {
        options = [deSelect, ...options];
    }
    function isActive(optionValue) {
        if (types.isMultiple) {
            return rootProps.value.indexOf(optionValue) !== -1;
        }
        else {
            return optionValue === rootProps.value;
        }
    }
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let optionDetails = {
            index: i, active: false, level, rootProps,
            change: change ? (newRow) => { if (change)
                change(option, newRow); } : undefined,
        };
        let disabled = !!rootProps.disabled || !!rootProps.loading || !!GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'disabled' });
        //ghabl az har chiz sharte namayesh ro check kon
        let show = GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'show' });
        if (show === false) {
            continue;
        }
        let optionValue = GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'value' });
        let active = isActive(optionValue);
        let text = GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'text' });
        //hala ke value ro dari active ro rooye details set kon ta baraye gereftane ettelaat active boodan moshakhas bashe
        optionDetails.active = active;
        let attrs = GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'attrs', def: {} });
        let defaultChecked = getDefaultOptionChecked(optionValue);
        let checked = GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'checked', def: defaultChecked });
        //object:option => do not remove mutability to use original value of option in for example tree row
        let obj = {
            optionOrg: option, show, loading: rootProps.loading,
            attrs, text, value: optionValue, disabled, draggable,
            checked,
            before: GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'before' }),
            after: GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'after' }),
            justify: GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'justify' }),
            subtext: GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'subtext' }),
            onClick: GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'onClick', preventFunction: true }),
            className: GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'className' }),
            style: GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'style' }),
            tagAttrs: GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'tagAttrs' }),
            tagBefore: GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'tagBefore' }),
            close: GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'close', def: !types.isMultiple }),
            tagAfter: GetOptionProps({ optionProp, optionOrg: option, optionDetails, key: 'tagAfter' }),
            details: optionDetails
        };
        result.push(obj);
        dic['a' + obj.value] = obj;
    }
    return { optionsList: result, optionsDic: dic };
}
function GetOptionProps(p) {
    let { optionProp, key, def, preventFunction, optionDetails, optionOrg } = p;
    let optionResult = typeof optionOrg[key] === 'function' && !preventFunction ? optionOrg[key](optionOrg, optionDetails) : optionOrg[key];
    if (optionResult !== undefined) {
        return optionResult;
    }
    let prop = optionProp[key];
    if (typeof prop === 'string') {
        try {
            const option = optionOrg;
            let value;
            eval('value = ' + prop);
            return value;
        }
        catch (_a) { }
    }
    if (typeof prop === 'function') {
        if (!preventFunction) {
            let res = prop(optionOrg, optionDetails);
            return res === undefined ? def : res;
        }
        else {
            return () => prop(optionOrg, optionDetails);
        }
    }
    return prop !== undefined ? prop : def;
}
function getTimeByUnit(rootProps, justToday) {
    let { value = {}, jalali, unit = { year: true, month: true, day: true } } = rootProps;
    function getToday() {
        let today = new AIODate().getToday(jalali);
        return { year: today[0], month: today[1], day: today[2], hour: today[3], minute: today[4], second: today[5] };
    }
    let today = getToday();
    let newValue = {};
    let u;
    for (u in unit) {
        if (unit[u] === true) {
            let v = value[u];
            let min = { year: 1000, month: 1, day: 1, hour: 0, minute: 0, second: 0 }[u];
            let max = { year: 3000, month: 12, day: 31, hour: 23, minute: 59, second: 59 }[u];
            if (v !== undefined && typeof v !== 'number' || v < min || v > max) {
                alert(`aio input error => in type time value.${u} should be an number between ${min} and ${max}`);
            }
            let res = v === undefined || justToday ? today[u] : v;
            const step = rootProps.timeStep && rootProps.timeStep[u] ? rootProps.timeStep[u] : undefined;
            if (step) {
                res = Math.round(res / step) * step;
            }
            newValue[u] = res;
        }
    }
    return newValue;
}
function getTimeText(rootProps) {
    let value = getTimeByUnit(rootProps);
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
        return new AIODate().getDateByPattern(value, rootProps.pattern);
    }
    if (rootProps.text !== undefined) {
        return rootProps.text;
    }
    let text = [], dateArray = [];
    if (value.year !== undefined) {
        dateArray.push(UT.Get2Digit(value.year));
    }
    if (value.month !== undefined) {
        dateArray.push(UT.Get2Digit(value.month));
    }
    if (value.day !== undefined) {
        dateArray.push(UT.Get2Digit(value.day));
    }
    if (dateArray.length) {
        text.push(dateArray.join('/'));
    }
    let timeArray = [];
    if (value.hour !== undefined) {
        timeArray.push(UT.Get2Digit(value.hour));
    }
    if (value.minute !== undefined) {
        timeArray.push(UT.Get2Digit(value.minute));
    }
    if (value.second !== undefined) {
        timeArray.push(UT.Get2Digit(value.second));
    }
    if (timeArray.length) {
        text.push(timeArray.join(':'));
    }
    return text.join(' ');
}
export const MonthCalendar = ({ date, onClick = () => { }, dateAttrs = () => ({}) }) => {
    const DATE = new AIODate();
    const [jalali] = useState(DATE.isJalali(date));
    const [monthStrings] = useState(DATE.getMonths(jalali));
    const [firstDayIndex] = useState(DATE.getWeekDay([date[0], date[1], 1]).index);
    const [monthDaysLength] = useState(DATE.getMonthDaysLength(date));
    function weekDays_layout() { return DATE.getWeekDays(true).map((o) => _jsx("div", { className: "month-calendar-weekday", children: o[0] })); }
    function spaces_layout() { return new Array(firstDayIndex).fill(0).map(() => _jsx("div", { className: "" })); }
    function cells_layout() { return new Array(monthDaysLength).fill(0).map((o, i) => cell_layout([date[0], date[1], i + 1])); }
    function cell_layout(dateArray) {
        const attrs = UT.AddToAttrs(dateAttrs(dateArray), { className: `month-calendar-day`, attrs: { onClick: () => onClick(dateArray) } });
        return (_jsx("div", Object.assign({}, attrs, { children: dateArray[2] })));
    }
    return (_jsxs("div", { className: "month-calendar", children: [_jsx("div", { className: "month-calendar-title", children: monthStrings[date[1] - 1] }), _jsx("div", { className: "month-calendar-weekdays", children: weekDays_layout() }), _jsxs("div", { className: "month-calendar-days", children: [spaces_layout(), " ", cells_layout()] })] }));
};
export const Mask = (props) => {
    const [dom] = useState(createRef());
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
    const [value, setValue] = useState(props.value || '');
    const [values, setValues] = useState(getValues(props.value || ''));
    const valuesRef = useRef(values);
    valuesRef.current = values;
    useEffect(() => {
        setValue(props.value || '');
        setValues(getValues(props.value || ''));
    }, [props.value]);
    function getValues(value) {
        let values = [];
        let temp = value;
        for (let o of props.pattern) {
            if (o[0] === 'number' || o[0] === 'text' || o[0] === 'select') {
                let length = +o[1];
                let value = temp.slice(0, length);
                values.push(value);
                temp = temp.slice(length, temp.length);
            }
            else {
                temp = temp.slice(o[1], temp.length);
            }
        }
        return values;
    }
    function SetValue(values, inputIndex, patternIndex) {
        let tempInputIndex = -1;
        console.log(values);
        let temp = '';
        for (let i = 0; i < props.pattern.length; i++) {
            let o = props.pattern[i];
            if (o[0] === 'number' || o[0] === 'text' || o[0] === 'select') {
                tempInputIndex++;
                let length = +o[1];
                let res = values[tempInputIndex];
                let delta = length - res.length;
                if (delta) {
                    const emp = o[0] === 'number' ? '0' : 'x';
                    for (let j = 0; j < delta; j++) {
                        res = emp + res;
                    }
                    values[tempInputIndex] = res;
                }
                else if (patternIndex === i) {
                    const inputs = $(dom.current).find('.aio-input');
                    let length = inputs.length;
                    inputIndex++;
                    if (inputIndex > length) {
                        inputIndex = 0;
                    }
                    let input = inputs.eq(inputIndex).find('input');
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
        let newValues = valuesRef.current.map((o, j) => inputIndex === j ? value : o);
        SetValue(newValues, inputIndex, patternIndex);
    }
    function getList() {
        let temp = 0;
        return props.pattern.map((o, patternIndex) => {
            let type = o[0];
            let inputIndex = temp;
            if (type === 'text' || type === 'number') {
                let length = +o[1];
                temp++;
                return (_jsx(AIText, { style: { width: length * 10 }, placeholder: new Array(length).fill('x').join(''), maxLength: length, filter: type === 'number' ? ['number'] : undefined, value: valuesRef.current[inputIndex], onChange: (v) => changeValue(v, inputIndex, patternIndex) }));
            }
            else if (type === 'select') {
                let options = o[2];
                temp++;
                return (_jsx(AISelect, { style: { width: 'fit-content' }, options: options, option: { text: 'option', value: 'option' }, value: valuesRef.current[inputIndex], onChange: (v) => changeValue(v, inputIndex, patternIndex) }));
            }
            else {
                return _jsx("div", { className: 'aio-input-mask-gap', children: o[2] || o[0] });
            }
        });
    }
    return (_jsx("div", { className: 'example', children: _jsx("div", { className: 'aio-input-mask', ref: dom, title: value, children: getList() }) }));
};
export const RichText = () => {
    const popup = usePopup();
    const nestedIndexRef = useRef([]);
    const items = {
        tag: 'div', items: [
            { tag: 'h1', html: 'this is my h1' },
            {
                tag: 'ul',
                items: [
                    { tag: 'li', html: 'item1' },
                    { tag: 'li', html: 'item2' }
                ]
            }
        ]
    };
    function inter(e) {
        $('.rich-text-item').removeClass('rich-text-item-hover');
        const target = $(e.target);
        target.addClass('rich-text-item-hover');
        const index = target.attr('data-index');
        const nestedIndex = index ? index.split('-') : [];
        nestedIndexRef.current = nestedIndex.map((o) => +o);
    }
    function itemToHtml(item, nestedIndex) {
        const Tag = item.tag;
        const content = item.html !== undefined ? item.html : (item.items || []).map((h, i) => itemToHtml(h, [...nestedIndex, i]));
        const attrs = UT.AddToAttrs(item.attrs, { className: 'rich-text-item', attrs: { 'data-index': nestedIndex.join('-') } });
        return (_jsx(Tag, Object.assign({}, attrs, { onMouseOver: (e) => inter(e), onClick: (e) => { openModal(nestedIndex); }, children: content })));
    }
    function getItemByNestedIndex() {
        let res = items;
        for (let i = 0; i < nestedIndexRef.current.length; i++) {
            const index = nestedIndexRef.current[i];
            res = res.items[index];
        }
        return res;
    }
    function openModal(nestedIndex) {
        if (nestedIndex.toString() !== nestedIndexRef.current.toString()) {
            return;
        }
        const item = getItemByNestedIndex();
        popup.addModal({
            position: 'center',
            body: (_jsxs("div", { className: "rich-text-options", children: [_jsx("div", { className: "rich-text-option-title", children: item.tag }), _jsx("div", { className: "rich-text-option", children: "Add Child" }), _jsx("div", { className: "rich-text-option", children: "Remove" }), _jsx("div", { className: "rich-text-option", children: "Move Up" }), _jsx("div", { className: "rich-text-option", children: "Move Down" })] }))
        });
    }
    return (_jsxs("div", { className: "msf", children: [_jsx("div", { className: "msf" }), _jsx("div", { className: "msf", children: itemToHtml(items, []) }), _jsx(RichModal, { item: items }), popup.render()] }));
};
const RichModal = (props) => {
    const [item, setItem] = useState(props.item);
    return (_jsxs("div", { className: "rich-text-options", children: [_jsx("div", { className: "rich-text-option-title", children: item.tag }), _jsx(AIButtons, { justify: true, style: { border: '1px solid #ddd' }, options: [
                    { text: 'none', value: undefined, },
                    { text: 'v', value: 'align-v-' },
                    { text: 'h', value: 'align-h-' },
                    { text: 'vh', value: 'align-vh-' }
                ], option: {
                    text: 'none'
                }, value: item.align, onChange: (align) => setItem(Object.assign(Object.assign({}, item), { align })) })] }));
};
export const JoyStick = (props) => {
    const { scale = 1 } = props;
    const [data, setData] = useState();
    useEffect(() => {
        const { x, y, angle, length } = props;
        if (x !== undefined && y !== undefined) {
            setData({ x, y });
        }
        if (angle !== undefined && length !== undefined) {
            const { left, top } = UT.getLeftAndTopByCenterAngleLength([props.size / 2, props.size / 2], angle, length);
            setData({ x: left, y: top });
        }
    }, []);
    if (!data) {
        return null;
    }
    function change(data) {
        let { x, y, length, angle } = data;
        x /= scale;
        y /= scale;
        length /= scale;
        props.onChange({ x, y, length, angle });
    }
    return _jsx(JOYSTICK, { x: data.x * scale, y: data.y * scale, size: props.size, onChange: change, centerOriented: props.centerOriented });
};
const JOYSTICK = ({ size, x, y, onChange, centerOriented }) => {
    const [center] = useState([size / 2, size / 2]);
    const [pos, setPos] = useState([center[0] + x, center[0] + y]);
    const posRef = useRef(pos);
    posRef.current = pos;
    const [dom] = useState(createRef());
    useEffect(() => { new UT.Swip({ dom: () => $(dom.current), start, move, end, maxCenterDistance: size / 2 }); }, []);
    function start() { return posRef.current; }
    function end() { if (centerOriented) {
        onChange({ x: 0, y: 0, length: 0, angle: 0 });
        setPos(center);
    } }
    function move(p) {
        let { x, y, centerAngle, centerDistance } = p.mousePosition;
        setPos([x, y]);
        x -= center[0];
        y -= center[1];
        onChange({ x, y, length: centerDistance, angle: centerAngle });
    }
    return (_jsx("div", { style: { width: size, height: size }, className: 'joy-stick', ref: dom, children: _jsx("div", { style: { left: posRef.current[0], top: posRef.current[1] }, className: 'joy-stick-button', children: _jsx("div", {}) }) }));
};
export const AIText = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'text' }));
export const AINumber = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'number' }));
export const AITextarea = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'textarea' }));
export const AIPassword = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'password' }));
export const AIColor = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'color' }));
export const AISelect = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'select' }));
export const AIRadio = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'radio' }));
export const AITabs = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'tabs' }));
export const AIButtons = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'buttons' }));
export const AITags = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'tags' }));
export const AITree = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'tree' }));
export const AIImage = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'image' }));
export const AIFile = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'file' }));
export const AICheckbox = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'checkbox' }));
export const AIDate = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'date' }));
export const AITime = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'time' }));
export const AISlider = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'slider' }));
export const AISpinner = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'spinner' }));
export const AIAcardion = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'acardion' }));
export const AIList = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'list' }));
export const AITable = (props) => _jsx(AIOInput, Object.assign({}, props, { type: 'table' }));
export const useForm = (p) => {
    function getInitData() { return JSON.parse(JSON.stringify(p.initData)); }
    const [initData] = useState(getInitData);
    const [timerDisabled, setTimerDisabled] = useState(false);
    const fieldChangesRef = useRef({});
    const errorsRef = useRef({});
    const inputsRef = useRef({});
    function setInputsRef(field, input) {
        inputsRef.current = Object.assign(Object.assign({}, inputsRef.current), { [field]: input });
    }
    function getInputByField(field) { return inputsRef.current[field]; }
    const hasError = () => {
        const keys = Object.keys(errorsRef.current);
        return !!keys.filter((o) => !!errorsRef.current[o]).length;
    };
    const isFieldChanged = (field) => !!fieldChangesRef.current[field];
    const [data, setData] = useState(getInitData);
    function getData() { return dataRef.current; }
    const changeData = (data) => {
        dataRef.current = data;
        setData(data);
        if (p.liveSubmit && p.onSubmit) {
            p.onSubmit(data);
        }
    };
    const changeByInput = (input, value) => {
        let newData = Object.assign({}, dataRef.current);
        fieldChangesRef.current = Object.assign(Object.assign({}, fieldChangesRef.current), { [input.field]: true });
        getErrorByInput(input, value);
        UT.setValueByField(newData, input.field, value);
        changeData(newData);
    };
    function changeByField(field, value) {
        const input = getInputByField(field);
        if (!input) {
            return;
        }
        changeByInput(input, value);
    }
    const dataRef = useRef(data);
    dataRef.current = data;
    function setErrorByField(field, error) {
        errorsRef.current = Object.assign(Object.assign({}, errorsRef.current), { [field]: error });
    }
    function getErrorByInput(input, value) {
        const { required = true, label, validateType, field } = input;
        if (required && (value === undefined || value === '' || value === null)) {
            const error = p.fa ? `${label} ضروری است` : `${label} is required`;
            setErrorByField(field, error);
            return error;
        }
        if (validateType === 'email') {
            const res = UT.IsValidEmail(value);
            if (!res) {
                const error = p.fa ? `فرمت ${label} صحیح نیست` : `${label} format is incorrect`;
                setErrorByField(field, error);
                return error;
            }
        }
        if (validateType === 'irMobile') {
            const res = UT.ValidateIrMobile({ value, label, fa: p.fa });
            if (res) {
                const error = res;
                setErrorByField(field, error);
                return error;
            }
        }
        if (validateType === "irNationalCode") {
            const res = UT.IsValidIrNationalCode(value);
            if (!res) {
                const error = p.fa ? `فرمت ${label} صحیح نیست` : `${label} format is incorrect`;
                setErrorByField(field, error);
                return error;
            }
        }
        if (input.validate) {
            const res = input.validate({ data: dataRef.current, value, input, field: input.field });
            if (res) {
                const error = res;
                setErrorByField(field, error);
                return error;
            }
        }
        if (value === 'undefined' || value === '[Object-Object]' || value === 'null' || value === 'NaN') {
            const error = p.fa ? 'این مقدار مجاز نیست' : 'this value is forbidden';
            setErrorByField(field, error);
            return error;
        }
        setErrorByField(field, undefined);
        return undefined;
    }
    function getValueByInput(input) {
        const { field } = input;
        let value;
        if (input.value !== undefined) {
            value = input.value;
        }
        else {
            value = UT.getValueByField(dataRef.current, field);
        }
        return value;
    }
    const getNodeStyle = (node, parentNode) => {
        const res = { flex: node.flex };
        if (parentNode && (parentNode.h || parentNode.v)) {
            res[parentNode.v ? 'height' : 'width'] = node.size;
        }
        return Object.assign(Object.assign({}, res), node.style);
    };
    function getVisibilityClassNames(node) {
        let hide_xs, hide_sm, hide_md, hide_lg, classNames = [];
        if (node.show_xs) {
            hide_xs = false;
            hide_sm = true;
            hide_md = true;
            hide_lg = true;
        }
        if (node.hide_xs) {
            hide_xs = true;
        }
        if (node.show_sm) {
            hide_xs = true;
            hide_sm = false;
            hide_md = true;
            hide_lg = true;
        }
        if (node.hide_sm) {
            hide_sm = true;
        }
        if (node.show_md) {
            hide_xs = true;
            hide_sm = true;
            hide_md = false;
            hide_lg = true;
        }
        if (node.hide_md) {
            hide_md = true;
        }
        if (node.show_lg) {
            hide_xs = true;
            hide_sm = true;
            hide_md = true;
            hide_lg = false;
        }
        if (node.hide_lg) {
            hide_lg = true;
        }
        if (hide_xs) {
            classNames.push('ai-form-hide-xs');
        }
        if (hide_sm) {
            classNames.push('ai-form-hide-sm');
        }
        if (hide_md) {
            classNames.push('ai-form-hide-md');
        }
        if (hide_lg) {
            classNames.push('ai-form-hide-lg');
        }
        return classNames;
    }
    const getNodeClassNames = (node, className, isRoot) => {
        let scrollClassName, alignClassName, rootClassName = isRoot ? 'ai-form' : undefined, visibilityClassNames = getVisibilityClassNames(node);
        if (node.v) {
            scrollClassName = `ai-form-scroll-v`;
            if (node.align === 'v') {
                alignClassName = 'ai-form-justify-center';
            }
            else if (node.align === 'h') {
                alignClassName = 'ai-form-items-center';
            }
            else if (node.align === 'vh') {
                alignClassName = 'ai-form-justify-center ai-form-items-center';
            }
            else if (node.align === 'hv') {
                alignClassName = 'ai-form-justify-center ai-form-items-center';
            }
        }
        else if (node.h) {
            scrollClassName = `ai-form-scroll-h`;
            if (node.align === 'v') {
                alignClassName = 'ai-form-items-center';
            }
            else if (node.align === 'h') {
                alignClassName = 'ai-form-justify-center';
            }
            else if (node.align === 'vh') {
                alignClassName = 'ai-form-justify-center ai-form-items-center';
            }
            else if (node.align === 'hv') {
                alignClassName = 'ai-form-justify-center ai-form-items-center';
            }
        }
        else if (node.html) {
            if (node.align === 'v') {
                alignClassName = 'ai-form-items-center';
            }
            else if (node.align === 'h') {
                alignClassName = 'ai-form-justify-center';
            }
            else if (node.align === 'vh') {
                alignClassName = 'ai-form-justify-center ai-form-items-center';
            }
            else if (node.align === 'hv') {
                alignClassName = 'ai-form-justify-center ai-form-items-center';
            }
        }
        return [rootClassName, className, node.className, scrollClassName, alignClassName, ...visibilityClassNames];
    };
    const getNodeAttrs = (p) => {
        const { node, parentNode, isRoot } = p;
        let className = '';
        if (node.v || node.h) {
            className = `ai-form-${node.v ? 'v' : 'h'}`;
        }
        else if (node.html) {
            className = 'ai-form-html';
        }
        return UT.AddToAttrs(node.attrs, { className: getNodeClassNames(node, className, isRoot), style: getNodeStyle(node, parentNode) });
    };
    const reset = () => {
        const newData = getInitData();
        dataRef.current = newData;
        errorsRef.current = {};
        changeData(newData);
    };
    const getErrorsDic = () => errorsRef.current;
    const getErrorsList = () => {
        const errors = errorsRef.current;
        const keys = Object.keys(errors);
        const strs = keys.filter((o) => !!errors[o]);
        return strs.map((o) => errors[o]);
    };
    const isDataChanged = () => JSON.stringify(initData) !== JSON.stringify(dataRef.current);
    const getContext = () => {
        return {
            rootProps: p, getData, isDataChanged, isFieldChanged, getValueByInput, getErrorByInput, changeData, changeByInput, hasError, getErrorsList, reset,
            getNodeAttrs, getErrorsDic, renderSubmitButton, isSubmitDisabled, setInputsRef
        };
    };
    const getLayout = () => {
        if (!p.getLayout) {
            return null;
        }
        const context = getContext();
        const node = p.getLayout(context);
        //@ts-ignore
        return _jsx(AIFormNode, { node: node, context: context, level: 0, index: 0 });
    };
    const isSubmitDisabled = () => {
        const dataChanged = isDataChanged();
        const error = hasError();
        const isTimerdisabled = !!timerDisabled;
        return !dataChanged || error || !!isTimerdisabled;
    };
    const renderSubmitButton = (text, attrs) => {
        if (p.onSubmit === undefined) {
            console.error('useForm error => for use renderSubmitButton you should set onSubmit props in difinition of useForm hook');
            return null;
        }
        const onClick = () => {
            const onSubmit = p.onSubmit;
            setTimerDisabled(true);
            onSubmit(getData());
            setTimeout(() => setTimerDisabled(false), 3000);
        };
        const disabled = isSubmitDisabled();
        const allAttrs = Object.assign(Object.assign({ type: 'button' }, attrs), { disabled, onClick });
        return _jsx("button", Object.assign({}, allAttrs, { children: text }));
    };
    const renderInput = (input, attrs) => {
        return (_jsx(AIFormInputContainer, { context: getContext(), input: input, attrs: getNodeAttrs({ node: { input, attrs }, isRoot: false }) }));
    };
    const layout = getLayout();
    return { data, changeData, getErrorsDic, getErrorsList, renderLayout: _jsx(_Fragment, { children: layout }), reset, renderSubmitButton, isSubmitDisabled, renderInput, changeByField };
};
const AIFormNode = ({ node, context, level, index, parentNode }) => {
    const [dom, setDom] = useState(null);
    let { show = true, isStatic } = node;
    const getContent = () => {
        if (!show) {
            return null;
        }
        if (Array.isArray(node.h) || Array.isArray(node.v)) {
            return _jsx(AIFormGroup, { node: node, context: context, level: level, index: index, parentNode: parentNode });
        }
        const { getNodeAttrs } = context;
        if (node.html !== undefined) {
            const attrs = getNodeAttrs({ node, isRoot: level === 0, parentNode });
            return (_jsx("div", Object.assign({}, attrs, { children: node.html })));
        }
        if (node.input) {
            const attrs = Object.assign(Object.assign({}, getNodeAttrs({ node, isRoot: false })), { 'data-label': node.input.label });
            return _jsx(AIFormInputContainer, { attrs: attrs, input: node.input, context: context }, node.input.field);
        }
    };
    useEffect(() => {
        if (isStatic) {
            setDom(getContent());
        }
    }, [isStatic]);
    return isStatic ? _jsx(_Fragment, { children: dom }) : _jsx(_Fragment, { children: getContent() });
};
const AIFormGroup = ({ node, context, level, parentNode }) => {
    let { tag = 'div', legend } = node;
    const { getNodeAttrs } = context;
    const content = (_jsxs(_Fragment, { children: [!!legend && tag === 'fieldset' && _jsx("legend", { children: legend }), node[node.v ? 'v' : 'h'].map((o, i) => {
                return (_jsx(AIFormNode, { node: o, parentNode: node, context: context, level: level + 1, index: i }, `level-${level + 1}-index-${i}`));
            })] }));
    const attrs = getNodeAttrs({ node, isRoot: level === 0, parentNode });
    if (level === 0) {
        return (_jsx("form", Object.assign({}, attrs, { children: content })));
    }
    if (tag === 'section') {
        return (_jsx("section", Object.assign({}, attrs, { children: content })));
    }
    if (tag === 'fieldset') {
        return (_jsx("fieldset", Object.assign({}, attrs, { children: content })));
    }
    if (tag === 'p') {
        return (_jsx("p", Object.assign({}, attrs, { children: content })));
    }
    if (tag === 'form') {
        return (_jsx("p", Object.assign({}, attrs, { children: content })));
    }
    return (_jsx("div", Object.assign({}, attrs, { children: content })));
};
const AIFormInputContainer = ({ context, input, attrs }) => {
    const { getValueByInput, getErrorByInput, changeByInput, setInputsRef } = context;
    const { inputAttrs, field } = input;
    setInputsRef(field, input);
    const value = getValueByInput(input);
    const error = getErrorByInput(input, value);
    return (_jsx(RenderInput, { value: value, error: error, input: input, context: context, inputProps: Object.assign(Object.assign({}, input), { inputAttrs: Object.assign(Object.assign({}, inputAttrs), { 'aria-label': field }), value, onChange: (v, details) => {
                if (input.onChange) {
                    input.onChange(v, details);
                }
                else {
                    changeByInput(input, v);
                }
            } }), attrs: attrs }));
};
const RenderInput = (props) => {
    const { context, attrs, input, inputProps, error } = props;
    const { isFieldChanged, rootProps } = context;
    const [dom, setDom] = useState(null);
    useEffect(() => {
        if (input.label === 'width') {
            console.log('rerender input');
            console.log('inputProps', inputProps);
        }
        const { field, label } = input;
        setDom(_jsx(AIFormInput, { required: input.required, showLabel: rootProps.showLabel, input: _jsx(AIOInput, Object.assign({}, inputProps, { type: inputProps.type })), label: label, error: isFieldChanged(field) ? error : undefined, attrs: attrs }));
    }, [JSON.stringify(inputProps, (key, value) => isValidElement(value) ? undefined : value), error]);
    return _jsx(Fragment, { children: dom }, input.field);
};
export const AIFormInput = (props) => {
    const { label, input, action, error, attrs, id, required = true, showLabel = true, className, style } = props;
    const hasHeader = (!!label && !!showLabel) || !!action;
    const Attrs = UT.AddToAttrs(attrs, { className: ["ai-form-input", className], style });
    return (_jsxs("div", Object.assign({}, Attrs, { children: [hasHeader === true &&
                _jsxs("label", { className: "ai-form-input-header", htmlFor: id, children: [!!label && _jsxs("div", { className: "ai-form-input-label", children: [required ? _jsx("div", { className: "ai-form-required", children: "*" }) : null, label] }), !!action && _jsx("div", { className: "ai-form-input-action", onClick: action.fn ? () => action.fn() : (() => { }), children: action.text })] }), _jsx("div", { className: "ai-form-input-body", children: input }), !!error && _jsx("div", { className: "ai-form-input-error", children: error })] })));
};
