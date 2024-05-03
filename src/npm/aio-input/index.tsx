/**varsion 8.1.3 */
import React, { createRef, useContext, createContext, useState, useEffect, useRef, FC } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import {
    mdiChevronDown, mdiLoading, mdiAttachment, mdiClose, mdiCircleMedium, mdiMagnify,
    mdiPlusThick, mdiChevronLeft, mdiImage, mdiEye, mdiEyeOff, mdiDownloadOutline, mdiDotsHorizontal,
    mdiChevronRight,
    mdiDelete,
    mdiCircleSmall
} from "@mdi/js";
import $ from 'jquery';
import { AIODate, GetClient, EventHandler, Swip, DragClass, I_Swip_parameter } from './../aio-utils';
import RVD from './../../npm/react-virtual-dom/index.tsx';
import AIOPopup from './../../npm/aio-popup/index.tsx';
import AIOStorage from './../../npm/aio-storage/index.tsx';
import './index.css';
import { I_RVD_node } from '../react-virtual-dom/types';
import { AP_modal } from '../aio-popup/types';
import {
    AI, AI_FormContext, AI_FormInput, AI_FormItem, AI_Options, AI_Popover_props, AI_context, AI_formItem, AI_indent, AI_option, AI_optionKey,
    AI_timeUnits, AI_time_unit, AI_type, AI_types, AV_item, AV_operator, AV_props, I_Calendar, I_Drag, I_FileItem, I_Layout,
    I_Multiselect, I_Tag, I_Tags, I_TimePopver, I_list_temp, type_time_value
} from './types.tsx';
import { AICTX, Def, I, addToAttrs } from './utils.js';
import Calendar from './date.tsx';
import Range from './range.tsx';
import Table from './table.tsx';
import Map from './map.tsx';
export default function AIOInput(props: AI) {
    let [types] = useState<AI_types>(getTypes(props))
    let [DATE] = useState<AIODate>(new AIODate())
    props = getDefaultProps(props, types)
    let { type, value, onChange, attrs = {} } = props;
    let [parentDom] = useState<any>(createRef())
    let [datauniqid] = useState('aiobutton' + (Math.round(Math.random() * 10000000)))
    let [temp] = useState<any>({
        getPopover: initGetPopover()
    });

    function initGetPopover() {
        let p: AI_Popover_props = { getRootProps: () => props, id: datauniqid, toggle, types }
        let res = new Popover(p).getFn()
        return res;
    }
    let [popup] = useState(getPopup(AIOPopup))
    function getPopup(ctor: { new(p?: { rtl?: boolean }): AIOPopup }): AIOPopup {
        return new ctor({ rtl: props.rtl })
    }
    let [open, setOpen] = useState<boolean>(!!props.open);
    let [showPassword, SetShowPassword] = useState<boolean>(false);
    function setShowPassword(state?: boolean) { SetShowPassword(state === undefined ? !showPassword : state) }
    let [DragOptions] = useState<I_Drag>(
        new DragClass({
            className: 'aio-input-option',
            onChange: (newOptions, from, to) => { if (typeof props.onSwap === 'function') { props.onSwap(newOptions, from, to) } }
        })
    )
    function getSelectText() {
        let { options = [] } = props;
        options = typeof options === 'function' ? options() : options
        let option = options.find((option) => value === undefined ? false : getOptionProp({ props, option, key: 'value' }) === value);
        if (option === undefined) { return }
        return getOptionProp({ props: props, option, key: 'text' })
    }
    function toggle(popover: any) {
        let open = !!popup.getModals().length
        if (!!popover === !!open) { return }
        setOpen(!!popover)
        if (popover) { popup.addModal(popover); }
        else {
            popup.removeModal();
            setTimeout(() => {
                let parent = $(parentDom.current)
                $(parentDom.current).focus()
            }, 0)
        }
    }
    function click(e: any, dom: any) {
        if (type === 'checkbox') { if (onChange) { onChange(!value) } }
        else if (temp.getPopover) { toggle(temp.getPopover(dom, props.options)) }
        else if (typeof props.onClick === 'function') { props.onClick() }
        else if (attrs.onClick) { attrs.onClick(); }
    }
    function optionClick(option: AI_option) {
        let { attrs = {}, onClick, close, text } = option;
        if (onClick) { onClick(option.object); }
        else if (attrs.onClick) { attrs.onClick(option); }
        else if (onChange) {
            if (types.isInput) { /*do nothing*/ }
            else if (types.isMultiple) {
                let { maxLength } = props, newValue;
                if (value.indexOf(option.value) === -1) { newValue = value.concat(option.value) }
                else { newValue = value.filter((o: any) => o !== option.value) }
                while (maxLength && newValue.length > maxLength) {
                    newValue = newValue.slice(1, newValue.length)
                }
                onChange(newValue)
            }
            else {
                if (option.value !== props.value) { onChange(option.value, option) }
                else if (props.deSelect === true) { onChange(undefined, option) }
                else if (typeof props.deSelect === 'function') { props.deSelect() }
            }
        }
        if (close) { toggle(false) }
    }
    function getContext(): AI_context {
        let context: AI_context = {
            rootProps: { ...props, value }, datauniqid, touch: 'ontouchstart' in document.documentElement,
            DragOptions, open, click, optionClick, types, showPassword, setShowPassword, DATE
        }
        return context
    }
    let render: { [key in AI_type]: () => React.ReactNode } = {
        acardion: () => <Acardion options={getOptions({ rootProps: props, types })} />,
        tree: () => <Tree />,
        list: () => <List />,
        range: () => <Range />,
        file: () => <File />,
        select: () => <Layout properties={{ text: props.text || getSelectText() }} />,
        button: () => <Layout />,
        multiselect: () => <Multiselect options={getOptions({ rootProps: props, types })} />,
        radio: () => <Layout properties={{ text: <Options /> }} />,
        tabs: () => <Layout properties={{ text: <Options /> }} />,
        buttons: () => <Layout properties={{ text: <Options /> }} />,
        checkbox: () => <Layout />,
        date: () => <Layout properties={{ text: getDateText(props) }} />,
        image: () => <Layout properties={{ text: <Image /> }} />,
        map: () => <Layout properties={{ text: <Map /> }} />,
        table: () => <Table />,
        text: () => <Layout properties={{ text: <Input /> }} />,
        password: () => <Layout properties={{ text: <Input /> }} />,
        textarea: () => <Layout properties={{ text: <Input /> }} />,
        number: () => <Layout properties={{ text: <Input /> }} />,
        color: () => <Layout properties={{ text: <Input /> }} />,
        form: () => <Form />,
        time: () => <Time />
    }
    if (!type || !render[type]) { return null }
    return (<AICTX.Provider key={datauniqid} value={getContext()}>{render[type]()}{popup.render()}</AICTX.Provider>)
}
function Time() {
    let { rootProps, DATE }: AI_context = useContext(AICTX);
    let { value: Value = {}, attrs: Attrs, jalali, onChange, unit = { year: true, month: true, day: true } } = rootProps;
    if (typeof unit !== 'object') { unit = { year: true, month: true, day: true } }
    let [today] = useState(getToday())
    let [value, setValue] = useState(getValue())
    useEffect(() => { setValue(getValue()) }, [JSON.stringify(rootProps.value)])
    let valueRef = useRef(value);
    valueRef.current = value;
    function getToday() {
        let today = DATE.getToday(jalali);
        return { year: today[0], month: today[1], day: today[2], hour: today[3], minute: today[4], second: today[5] }
    }
    function getValue() {
        let newValue: any = {};
        let u: AI_timeUnits;
        unit = unit as AI_time_unit
        for (u in unit) {
            if (unit[u] === true) {
                let v = Value[u];
                let min: number = { year: 1000, month: 1, day: 1, hour: 0, minute: 0, second: 0 }[u] as number
                let max: number = { year: 3000, month: 12, day: 31, hour: 23, minute: 59, second: 59 }[u] as number
                if (v !== undefined && typeof v !== 'number' || v < min || v > max) {
                    alert(`aio input error => in type time value.${u} should be an number between ${min} and ${max}`)
                }
                let res: number = v === undefined ? today[u] : v;
                newValue[u] = res;
            }
        }
        return newValue;
    }
    function getTimeText(obj: any) {
        if (rootProps.text) {
            let res = value ? DATE.getDateByPattern(value, rootProps.text as string) : ''
            return res
        }
        let text = [], dateArray = [];
        if (obj.year !== undefined) { dateArray.push(D2S(obj.year)) }
        if (obj.month !== undefined) { dateArray.push(D2S(obj.month)) }
        if (obj.day !== undefined) { dateArray.push(D2S(obj.day)) }
        if (dateArray.length) { text.push(dateArray.join('/')) }
        let timeArray = []
        if (obj.hour !== undefined) { timeArray.push(D2S(obj.hour)) }
        if (obj.minute !== undefined) { timeArray.push(D2S(obj.minute)) }
        if (obj.second !== undefined) { timeArray.push(D2S(obj.second)) }
        if (timeArray.length) { text.push(timeArray.join(':')) }
        return text.join(' ');
    }
    function renderButton() {
        let { onChange, style, popover = {}, className } = rootProps;
        let attrs = addToAttrs(Attrs, { className: ['aio-input-time', className], style: { ...style, direction: 'ltr' } })
        let text: string = getTimeText(value)
        let p: AI = {
            ...rootProps, text, attrs, type: 'button',
            popover: !onChange ? undefined : {
                position: 'center', ...popover, attrs: addToAttrs(popover.attrs, { className: 'aio-input-time-popover' }),
                body: { render: ({ close }) => renderPopover(close) }
            }
        }
        return <AIOInput {...p} />
    }
    function renderPopover(close: () => void) {
        let p: I_TimePopver = { value: valueRef.current, onChange, onClose: close }
        return <TimePopover {...p} />
    }
    return renderButton()
}
class Popover {
    props: AI_Popover_props;
    isActive: boolean;
    constructor(props: AI_Popover_props) {
        this.props = props;
        this.isActive = this.getIsActive();
    }
    getIsActive = () => {
        let { getRootProps } = this.props;
        let { popover, type, options } = getRootProps();
        if (type === 'date' || type === 'select' || type === 'multiselect') { return true }
        if (type === 'button') { return !!popover }
        if (type === 'text' || type === 'number' || type === 'textarea') { return !!options }
        return false
    }
    getFn = () => {
        if (!this.isActive) { return }
        let { getRootProps, toggle, id } = this.props, rootProps = getRootProps()
        return (dom: any) => {
            let popover: AP_modal = { ...(rootProps.popover || {}) }
            let { rtl, type } = rootProps;
            let { body = {} } = popover;
            let backdrop = !popover.backdrop ? {} : popover.backdrop;
            backdrop = { ...backdrop, attrs: addToAttrs(backdrop.attrs, { className: 'aio-input-backdrop ' + id }) }
            let target: React.ReactNode = $(dom.current)
            let config: AP_modal = {
                //props that have default but can change by user
                position: 'popover',
                fitHorizontal: ['multiselect', 'text', 'number', 'textarea'].indexOf(type) !== -1,
                //props that havent default but can define by user(header,footer,fitTo,fixStyle)
                ...popover,
                //props that cannot change by user
                backdrop,
                onClose: () => toggle(false),
                body: {
                    ...body,
                    render: ({ close }) => {
                        if (rootProps.type === 'button') { return (body.render || (() => ''))({ close }) }
                        else if (rootProps.type === 'date') { let p: I_Calendar = { onClose: close }; return <Calendar {...p} /> }
                        else { return body.render ? body.render({ close }) : <Options /> }
                    }
                },
                pageSelector: '.aio-input-backdrop.' + id,
                getTarget: () => target,
                attrs: addToAttrs(popover.attrs, { className: `aio-input-popover aio-input-popover-${rtl ? 'rtl' : 'ltr'}` })
            }
            return config;
        }
    }
}
function TimePopover(props: I_TimePopver) {
    let { DATE }: AI_context = useContext(AICTX)
    let { lang = 'fa', onChange, onClose } = props;
    let [startYear] = useState(props.value.year ? props.value.year - 10 : undefined);
    let [endYear] = useState(props.value.year ? props.value.year + 10 : undefined);
    let [value, setValue] = useState<type_time_value>({ ...props.value })
    function change(obj: { [key in AI_timeUnits]?: number }) {
        setValue({ ...value, ...obj })
    }
    function translate(key: AI_timeUnits | 'Submit') {
        return lang === 'fa' ? { 'year': 'سال', 'month': 'ماه', 'day': 'روز', 'hour': 'ساعت', 'minute': 'دقیقه', 'second': 'ثانیه', 'Submit': 'ثبت' }[key] : key
    }
    function getTimeOptions(type: AI_timeUnits): { text: number, value: number }[] {
        let { year, month, day } = value;
        if (type === 'year' && startYear && endYear) { return new Array(endYear - startYear + 1).fill(0).map((o, i) => { return { text: i + startYear, value: i + startYear } }) }
        if (type === 'day' && day) {
            let length = !year || !month ? 31 : DATE.getMonthDaysLength([year, month]);
            if (day > length) { change({ day: 1 }) }
            return new Array(length).fill(0).map((o, i) => { return { text: i + 1, value: i + 1 } })
        }
        if (type === 'month') { return new Array(12).fill(0).map((o, i) => { return { text: i + 1, value: i + 1 } }) }
        return new Array(type === 'hour' ? 24 : 60).fill(0).map((o, i) => { return { text: i, value: i } })
    }
    function layout(type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'): I_RVD_node {
        if (typeof value[type] !== 'number') { return {} }
        let options = getTimeOptions(type);
        let p: AI = { type: 'list', value: value[type], options, size: 48, width: 72, onChange: (v) => change({ [type]: v }) }
        return {
            column: [
                { html: translate(type), className: 'align-vh', size: 36 },
                { html: (<AIOInput {...p} />) }
            ]
        }
    }
    function submit() {
        if (onChange) { onChange(value); }
        onClose();
    }
    return (
        <RVD
            rootNode={{
                className: 'dir-ltr',
                column: [
                    { className: 'm-b-12 align-h', row: [layout('year'), layout('month'), layout('day'), layout('hour'), layout('minute'), layout('second')] },
                    { html: <button className='ai-style-3' style={{ height: 36, fontSize: 12 }} onClick={submit}>{translate('Submit')}</button> }
                ]
            }}
        />
    )
}
function Image() {
    let { rootProps }: AI_context = useContext(AICTX);
    let [popup] = useState(new AIOPopup());
    let { value, width, height, onChange, disabled, placeholder, preview, deSelect } = rootProps;
    let [url, setUrl] = useState<string>();
    let dom: any = createRef()
    // if(typeof value === 'object'){
    //     let fr = new FileReader();
    //     fr.onload = function () {
    //         $(dom.current).attr('src',fr.result)
    //     }
    //     fr.readAsDataURL(value);
    // }
    useEffect(() => {
        if (!value || value === null) { if (url !== value) { setUrl('') } }
        else if (typeof value === 'object') { changeUrl(value) }
        else if (typeof value === 'string') { if (url !== value) { setUrl(value) } }
    })
    function changeUrl(file: any, callback?: Function) {
        try {
            let fr = new FileReader();
            fr.onload = function () {
                if (url !== fr.result) {
                    setUrl(fr.result as any);
                    if (callback) { callback(fr.result) }
                }
            }
            fr.readAsDataURL(file);
        }
        catch { }
    }
    function onPreview(e: any) {
        e.stopPropagation(); e.preventDefault(); openPopup()
    }
    function openPopup() {
        popup.addModal({
            position: 'center',
            header: { title: '', onClose: (e) => popup.removeModal() },
            body: {
                render: () => {
                    let src = $(dom.current).attr('src')
                    return (<div className='aio-input-image-preview-popup'><img src={src} alt={placeholder} /></div>)
                }
            }
        })
    }
    let IMG = url ? (
        <>
            <img
                ref={dom as any}
                src={url}
                alt={placeholder}
                style={{ objectFit: 'contain', cursor: !onChange ? 'default' : undefined }}
                width={width}
                height={height}
                onClick={!!onChange ? undefined : onPreview}
            />
            {
                !!deSelect &&
                <div
                    onClick={(e) => {
                        e.stopPropagation(); e.preventDefault();
                        if (typeof deSelect === 'function') { deSelect() }
                        else if (onChange) { onChange(undefined) }

                    }}
                    className='aio-input-image-remove'
                >{I(mdiClose, 1)}</div>}
            {preview && !!onChange && <div onClick={(e) => onPreview(e)} className='aio-input-image-preview'>{I(mdiImage, 1)}</div>}
            {popup.render()}
        </>
    ) : <span className='aio-input-image-placeholder' style={{ width, height }}>{placeholder}</span>
    if (!onChange) {
        return IMG
    }
    let p: AI = {
        disabled,
        type: 'file', justify: true, text: IMG, attrs: { style: { width: '100%', height: '100%', padding: 0 } },
        onChange: (file) => changeUrl(file, (url: string) => onChange(url))
    }
    return (<AIOInput {...p} />)
}
function File() { return (<div className='aio-input-file-container'><Layout /><FileItems /></div>) }
function InputFile() {
    let { rootProps, types }: AI_context = useContext(AICTX);
    let { value = [], onChange = () => { }, disabled } = rootProps;
    function change(e: any) {
        let Files = e.target.files;
        let result;
        if (types.isMultiple) {
            result = [...value];
            let names = result.map(({ name }) => name);
            for (let i = 0; i < Files.length; i++) {
                let file = Files[i];
                if (names.indexOf(file.name) !== -1) { continue }
                result.push({ name: file.name, size: file.size, file })
            }
        }
        else { result = Files.length ? Files[0] : undefined }
        onChange(result)
    }
    let props = { disabled: disabled === true, type: 'file', style: { display: 'none' }, multiple: types.isMultiple, onChange: (e: any) => change(e) }
    return <input {...props} />
}
function FileItems() {
    let { rootProps }: AI_context = useContext(AICTX);
    let { value, rtl } = rootProps;
    let files = [];
    if (Array.isArray(value)) { files = value }
    else if (value) { files = [value] }
    else { return null }
    if (!files.length) { return null }
    let Files = files.map((file, i) => { let p: I_FileItem = { file, index: i }; return <FileItem key={i} {...p} /> })
    return (<div className='aio-input-files' style={{ direction: rtl ? 'rtl' : 'ltr' }}>{Files}</div>)
}
function FileItem(props: I_FileItem) {
    let { rootProps }: AI_context = useContext(AICTX);
    let { onChange = () => { }, value = [] } = rootProps;
    let { file, index } = props;
    function getFile(file: any): { minName: string, sizeString: string | false } {
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
            else { minName = filename; }
            let size = fileSize;
            if (!size) { return { minName, sizeString: false } }
            let gb = size / (1024 * 1024 * 1024), mb = size / (1024 * 1024), kb = size / 1024;
            if (gb >= 1) { sizeString = gb.toFixed(2) + ' GB'; }
            else if (mb >= 1) { sizeString = mb.toFixed(2) + ' MB'; }
            else if (kb >= 1) { sizeString = kb.toFixed(2) + ' KB'; }
            else { sizeString = size + ' byte' }
            return { minName, sizeString }
        }
        catch { return { minName: 'untitle', sizeString: false } }
    }
    function remove(index: number) {
        let newValue = [];
        for (let i = 0; i < value.length; i++) {
            if (i === index) { continue }
            newValue.push(value[i])
        }
        onChange(newValue);
    }
    function renderString(minName: string, sizeString: string | false) {
        let size;
        if (sizeString === false) { size = '' }
        else { size = ` ( ${sizeString})` }
        return `${minName}${size}`
    }
    let { minName, sizeString } = getFile(file);
    let { url, name } = file;
    return (
        <div className='aio-input-file' style={{ cursor: url ? 'pointer' : 'default' }}>
            <div className='aio-input-file-icon'>
                {I(url ? mdiDownloadOutline : mdiAttachment, .8)}
            </div>
            <div className='aio-input-file-name' onClick={() => {
                if (url) { DownloadUrl(url, name) }
            }}>
                {renderString(minName, sizeString)}
            </div>
            <div className='aio-input-file-icon' onClick={() => remove(index)}>{I(mdiClose, .7)}</div>
        </div>
    )
}
function Multiselect(props: I_Multiselect) {
    let { options = [] } = props;
    let { rootProps }: AI_context = useContext(AICTX);
    let { style = {} } = rootProps.attrs || {};
    return (<div className={'aio-input-multiselect-container'} style={{ width: style.width }}><Layout /><Tags options={options} /></div>)
}
function Tags(props: I_Tags) {
    let { options = [] } = props;
    let { rootProps }: AI_context = useContext(AICTX);
    let { value = [], rtl, hideTags, disabled } = rootProps;
    if (!value.length || hideTags) { return null }
    let tags = value.map((o: AI_option, i: number) => {
        let option = options.find((option: AI_option) => o === option.value)
        if (option === undefined) { return null }
        return <Tag key={i} value={o} option={option} />
    })
    return !tags.length ? null : <div className={`aio-input-tags${rtl ? ' rtl' : ''}${disabled ? ' disabled' : ''}`}>{tags}</div>
}
function Tag(props: I_Tag) {
    let { rootProps }: AI_context = useContext(AICTX);
    let { onChange = () => { } } = rootProps;
    let { option, value } = props;
    let { text, tagAttrs = {}, tagBefore = I(mdiCircleMedium, 0.7), tagAfter, disabled } = option;
    let onRemove = disabled ? undefined : () => { onChange(rootProps.value.filter((o: any) => o !== value)) }
    return (
        <div {...tagAttrs} className={'aio-input-tag' + (tagAttrs.className ? ' ' + tagAttrs.className : '') + (disabled ? ' disabled' : '')} style={tagAttrs.style}>
            <div className='aio-input-tag-icon'>{tagBefore}</div>
            <div className='aio-input-tag-text'>{text}</div>
            {tagAfter !== undefined && <div className='aio-input-tag-icon'>{tagAfter}</div>}
            <div className='aio-input-tag-icon' onClick={onRemove}>{I(mdiClose, 0.7)}</div>
        </div>
    )
}
function Input() {
    let { rootProps, types, showPassword }: AI_context = useContext(AICTX)
    let { type } = rootProps;
    let {
        min, max, swip, onChange, blurChange, maxLength = Infinity, justNumber, filter = [], delay = 400, disabled, options, placeholder,
        inputAttrs, spin = true, justify
    } = rootProps;
    let [dom] = useState<any>(createRef())
    let [temp] = useState<any>({ atimeout: undefined, btimeout: undefined, clicked: false })
    let [datauniqid] = useState(`ac${Math.round(Math.random() * 100000)}`)
    let [value, setValue] = useState<any>(rootProps.value || '');
    let valueRef = useRef(value);
    valueRef.current = value;
    function setSwip() {
        if (type === 'number' && swip) {
            new Swip({
                speedY: swip, reverseY: true, minY: min, maxY: max,
                dom: () => $(dom.current),
                start: () => {
                    let vref = +valueRef.current
                    vref = isNaN(vref) ? 0 : vref
                    return [0, vref]
                },
                move: (p: I_Swip_parameter) => {
                    let { y } = p.change || { y: 0 };
                    if (min !== undefined && y < min) { y = min; }
                    if (max !== undefined && y > max) { y = max }
                    change(y, onChange)
                }
            })
        }
    }
    useEffect(() => { setSwip() }, [])
    function getValidValue() {
        let v = rootProps.value;
        if (type === 'number' && !isNaN(+v)) {
            v = +v;
            if (typeof min === 'number' && v < min) { v = min }
            else if (typeof max === 'number' && v > max) { v = max }
        }
        return v
    }
    function update() {
        clearTimeout(temp.atimeout);
        temp.atimeout = setTimeout(() => {
            let v = getValidValue();
            if (v !== value) { setValue(v) }
        }, 500);
    }
    useEffect(() => {
        update()
    }, [rootProps.value])
    function convertPersianDigits(value: string) {
        try {
            value = value.toString();
            let res: string = '';
            for (let i = 0; i < value.length; i++) {
                let dic: any = {
                    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9"
                }
                res += dic[value[i]] || value[i];
            }
            value = res;
        }
        catch { }
        return value
    }
    function change(value: any, onChange?: (value: any) => void) {
        if (types.hasKeyboard) {
            if (value) {
                value = convertPersianDigits(value);
                if ((type === 'text' || type === 'textarea' || type === 'password') && justNumber) {
                    value = value.toString();
                    let lastChar = value[value.length - 1];
                    if (lastChar === ' ' || isNaN(+lastChar)) {
                        if (Array.isArray(justNumber)) {
                            if (justNumber.indexOf(lastChar) === -1) { value = value.slice(0, value.length - 1) }
                        }
                        else { value = value.slice(0, value.length - 1) }
                    }
                }
                if ((type === 'text' || type === 'textarea' || type === 'password') && filter.length) {
                    value = value.toString();
                    let lastChar = value[value.length - 1];
                    for (let i = 0; i < filter.length; i++) {
                        let char = filter[i].toString();
                        if (char === 'symbol') {
                            if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(lastChar)) { value = value.slice(0, value.length - 1); break }
                        }
                        else if (char === 'number') {
                            if (!isNaN(+lastChar)) { value = value.slice(0, value.length - 1); break }
                        }
                        else if (char === 'string') {
                            if (isNaN(+lastChar)) { value = value.slice(0, value.length - 1); break }
                        }
                        else {
                            if (char === lastChar) { value = value.slice(0, value.length - 1); break }
                        }
                    }
                }
                if ((type === 'text' || type === 'textarea' || type === 'password') && value.toString().length > maxLength) {
                    value = value.toString().slice(0, maxLength);
                }
            }
        }
        if (rootProps.type === 'number') { if (value && !isNaN(+value)) { value = +value; } }
        setValue(value);
        if (!blurChange && onChange) {
            clearTimeout(temp.btimeout);
            temp.btimeout = setTimeout(() => onChange(value), 500);
        }
    }
    function click() {
        if (temp.clicked) { return }
        temp.clicked = true;
        $(dom.current).focus().select();
    }
    function blur(onChange?: (value: any) => void) {
        temp.clicked = false
        if (blurChange && onChange) { onChange(value) }
    }
    function getInputAttrs() {
        let InputAttrs = addToAttrs(inputAttrs, {
            className: !spin ? 'no-spin' : undefined,
            style: justify ? { textAlign: 'center' } : undefined
        })
        let p = {
            ...InputAttrs, value, type, ref: dom, disabled, placeholder, list: rootProps.options ? datauniqid : undefined,
            onClick: (e: any) => click(),
            onChange: onChange ? (e: any) => change(e.target.value, onChange) : undefined,
            onBlur: () => blur(onChange)
        }
        if (type === 'password' && showPassword) { p = { ...p, type: 'text', style: { ...p.style, textAlign: 'center' } } }
        if (justNumber === true) {
            p.pattern = "\d*";
            p.inputMode = "numeric";
        }
        return p;
    }
    let attrs = getInputAttrs()
    if (!attrs.onChange) { return value }
    else if (type === 'color') {
        let options: AI_option[] = getOptions({ rootProps, types })
        return (
            <label style={{ width: '100%', height: '100%', background: value }}>
                <input {...attrs} style={{ opacity: 0 }} opacity rgba cmyk hsla />
                {!!options.length && <datalist id={datauniqid}>{options.map((o: AI_option) => <option value={o.value} />)}</datalist>}
            </label>
        )
    }
    else if (type === 'textarea') { return <textarea {...attrs} /> }
    else { return (<input {...attrs} />) }
}

const Formcontext = createContext({} as any);
const Form: FC = () => {
    let { rootProps }: AI_context = useContext(AICTX);
    let { inputs, lang, onChange, attrs, style, className } = rootProps;
    let [errors] = useState<{ [key: string]: string | undefined }>({})
    function getErrorList() { return [...Object.keys(errors).filter((o) => !!errors[o]).map((o) => errors[o])] }
    function getError(formItem: AI_formItem, value: any) {
        let { validations = [], input } = formItem;
        if (!validations.length || !input) { return '' }
        //در مپ مقدار یک آبجکت است پس لت و ال ان جی در مجموع به یک مقدار بولین مپ می کنیم تا فقط در ریکوآیرد بتوان ارور هندلینگ انجام داد
        if (input.type === 'map') { value = !!value && !!value.lat && !!value.lng }
        let a: AV_props = { value, title: formItem.label || '', lang, validations }
        return new AIOValidation(a).validate();
    }
    function setError(key: string, value: string | undefined) {
        let newErrors = errors = { ...errors, [key]: value }
        let fixedErrors: { [key: string]: string } = {};
        let prop: string
        for (prop in newErrors) { if (newErrors[prop]) { fixedErrors[prop] = newErrors[prop] as string } }
        errors = fixedErrors;
    }
    function setValueByField(obj: any = {}, field: string, value: any) {
        try {
            field = field.replaceAll('[', '.');
            field = field.replaceAll(']', '');
        }
        catch { }
        let fields = field.split('.');
        let node = obj;
        for (let i = 0; i < fields.length - 1; i++) {
            let f = fields[i];
            if (f === 'value') { continue }
            if (node[f] === undefined) {
                if (isNaN(parseFloat(fields[i + 1]))) { node[f] = {} }
                else { node[f] = []; }
                node = node[f];
            }
            else { node = node[f]; }
        }
        node[fields[fields.length - 1]] = value;
        return obj;
    }
    function getValueByField(p: { field: any, def?: any, functional?: boolean, value?: any, formItem: AI_formItem, formItemValue?: any }) {
        let { field, def, functional, value = rootProps.value || {}, formItem, formItemValue } = p;
        let a;
        if (functional && typeof field === 'function') { a = field({ model: value, formItem, value: formItemValue }); }
        else if (typeof field === 'string') {
            if (field.indexOf('value.') !== -1 || field.indexOf('data.') !== -1) {
                let data = { ...rootProps.data };
                try { eval(`a = ${field}`); }
                catch { }
            }
            else { a = field }
        }
        else { a = field }
        return a === undefined ? def : a;
    }

    function setValue(itemValue: any, formItem: AI_formItem) {
        let { value = {} } = rootProps;
        let field = formItem.field;
        if (!field) {
            alert('aio-input error => in type form there is an form item missing field property')
            return
        }
        let newValue = setValueByField(value, field, itemValue);
        let error = getError(formItem, itemValue)
        setError(field, error)
        if (onChange) { onChange(newValue, { formItem, errors: getErrorList(), newFormItemValue: itemValue }) }
    }

    function getContext() {
        let context: AI_FormContext = {
            rootProps, setValue,
            setError,
            getError, getValueByField
        }
        return context;
    }
    let p = addToAttrs(attrs, { className: ['aio-input-form', className], style })
    return (
        <Formcontext.Provider value={getContext()}>
            <form {...p}>
                <FormItem formItem={inputs} />
            </form>
        </Formcontext.Provider>
    )
}
const FormItem: FC<AI_FormItem> = (props) => {
    let { setError }: AI_FormContext = useContext(Formcontext)
    let { formItem, parentType } = props;
    let { html, row, column, input, field, flex, size, show } = formItem;
    if (show === false) { return null }
    function getInner(): React.ReactNode {
        if (input) { return <FormInput formItem={formItem} setError={(v: string | undefined) => setError(field as string, v)} /> }
        if (html) { return html; }
        if (row) { return row.map((o: AI_formItem, i: number) => <FormItem key={i} formItem={o} parentType='row' />) }
        if (column) { return column.map((o: AI_formItem, i: number) => <FormItem key={i} formItem={o} parentType='column' />) }
    }
    let className = 'aio-input-form-item'
    if (row) { className += ' aio-input-form-item-row' }
    else if (column) { className += ' aio-input-form-item-column' }
    let style: { [key: string]: number | string } = {};
    if (flex) { style.flex = flex }
    else if (size) {
        if (parentType === 'row') { style.width = size }
        else if (parentType === 'column') { style.height = size }
    }
    else {
        style.flex = 1;
    }
    return (<section className={className} style={style}>{getInner()}</section>)
}
const FormInput: FC<AI_FormInput> = (props) => {
    let { rootProps, getError, getValueByField, setValue }: AI_FormContext = useContext(Formcontext)
    let { rtl, disabled } = rootProps;
    let { formItem, setError } = props;
    let { input, label, field } = formItem;
    if (!input) { return null }
    function getInputProps(input: AI, formItem: AI_formItem) {
        let props: AI = {
            rtl, value, type: input.type,
            onChange: (value) => setValue(value, formItem), attrs: {}, inputAttrs: {}, disabled: false, point: (value) => { return { html: value } }
        };
        let prop: keyof AI;
        for (prop in input) {
            let functional = ['options', 'columns'].indexOf(prop) !== -1;
            (props[prop] as any) = getValueByField({ field: input[prop], functional, formItem, formItemValue: value })
        }
        props.value = value;
        let { attrs = {} } = input;
        for (let prop in attrs) { props.attrs[prop] = getValueByField({ field: attrs[prop], formItem }) }
        if (disabled) { props.disabled = true; }
        if (['text', 'number', 'password', 'textarea'].indexOf(input.type) !== -1) {
            let { inputAttrs = {} } = input;
            props.inputAttrs = {};
            for (let prop in inputAttrs) { props.inputAttrs[prop] = getValueByField({ field: inputAttrs[prop], formItem }) }
        }
        let classes = [props.className]
        if (error) { classes.push('has-error') }
        let Attrs = addToAttrs(props.attrs, { className: error ? 'has-error' : undefined })
        props.attrs = Attrs;
        return props;
    }
    function getDefaultValue(p: AI) {
        if (p.multiple) { return [] }
        if (p.type === 'multiselect') { return [] }
    }
    let value = getValueByField({ field, def: input ? getDefaultValue(input) : undefined, formItem });
    let error = getError(formItem, value)
    setError(error)
    let InputProps: AI = getInputProps(input, formItem);
    return (
        <section className='aio-input-form-input'>
            {label && <section className='aio-input-form-label'>{label}</section>}
            <AIOInput {...InputProps} />
            {error && <section className='aio-input-form-error'>{error}</section>}
        </section>
    )
}
function Options(props: AI_Options) {
    let { rootProps, types }: AI_context = useContext(AICTX);
    let [searchValue, setSearchValue] = useState('');
    function renderSearchBox(options: any[]) {
        if (rootProps.type === 'tabs' || rootProps.type === 'buttons' || types.isInput || !rootProps.search) { return null }
        if (searchValue === '' && options.length < 10) { return null }
        return (
            <div className='aio-input-search'>
                <input type='text' value={searchValue} placeholder={rootProps.search} onChange={(e) => setSearchValue(e.target.value)} />
                <div className='aio-input-search-icon' onClick={() => { setSearchValue('') }}>
                    {I(searchValue ? mdiClose : mdiMagnify, .8)}
                </div>
            </div>
        )
    }
    function getRenderOptions(options: any[]) {
        let renderIndex = 0;
        return options.map((option, i) => {
            if (searchValue) {
                if (option.text === undefined || option.text === '') { return null }
                if (option.text.indexOf(searchValue) === -1) { return null }
            }
            let p = { key: i, option, renderIndex, realIndex: i, searchValue }
            return <Layout {...p} />
        });
    }
    let options = props.options || getOptions({ rootProps, types });
    if (!options.length) { return null }
    let renderOptions = getRenderOptions(options);
    let className = `aio-input-options aio-input-${rootProps.type}-options`
    if (types.isDropdown) { className += ' aio-input-dropdown-options' }
    return (
        <>
            {renderSearchBox(options)}
            <div className={className}>{renderOptions}</div>
        </>
    )
}
function Layout(props: I_Layout) {
    let { rootProps, datauniqid, types, touch, DragOptions, click, optionClick, open, showPassword, setShowPassword }: AI_context = useContext(AICTX)
    let { option, realIndex, renderIndex, toggle, indent } = props;
    let { type, rtl } = rootProps;
    let [dom] = useState(createRef())
    function getClassName() {
        let cls;
        if (option !== undefined) {
            cls = `aio-input-option aio-input-${type}-option`
            if (types.isMultiple) { cls += ` aio-input-${type}-multiple-option` }
            if (types.isDropdown) { cls += ` aio-input-dropdown-option` }
        }
        else {
            cls = `aio-input aio-input-${type}${touch ? ' aio-input-touch' : ''}`;
            if (types.isInput) { cls += ` aio-input-input` }
            if (rtl) { cls += ' aio-input-rtl' }
        }
        if (indent) { cls += ` aio-input-indent-${indent.size}` }
        if (properties.disabled) { cls += ' disabled' }
        if (properties.className) { cls += ' ' + properties.className }
        cls += ' ' + datauniqid;
        return cls;
    }
    function cls(key: string) {
        let className = `aio-input-${key}`;
        if (option) { className += ` aio-input-${type}-option-${key}` }
        else { className += ` aio-input-${type}-${key}` }
        return className;
    }
    function Text(): React.ReactNode {
        let { text, placeholder, subtext, justify } = properties;
        if (text === undefined && placeholder !== undefined) { text = <div className='aio-input-placeholder'>{placeholder}</div> }
        if (text !== undefined) {
            let p = (type: 'value' | 'subtext') => {
                return {
                    style: { textAlign: justify ? 'center' : undefined },
                    className: `${cls(type)}${justify && !types.isInput ? ' aio-input-value-justify' : ''}`
                } as any
            }
            if (subtext) {
                return (
                    <div className={`aio-input-content aio-input-${type}-content${justify && !types.isInput ? ' aio-input-content-justify' : ''}`}>
                        <div {...p('value')}>{text}</div><div {...p('subtext')}>{subtext}</div>
                    </div>
                )
            }
            else {
                return <div {...p('value')}>{text}</div>
            }
        }
        else { return <div className='flex-1'></div> }
    }
    function DragIcon() {
        if (!properties.draggable) { return null }
        return (
            <svg viewBox="8 4 10 13" role="presentation" style={{ width: 12, height: '1.8rem' }}>
                <path d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z" style={{ fill: 'currentcolor' }}></path>
            </svg>
        )
    }
    function Caret() {
        if (!types.isDropdown || option || (types.isInput && !rootProps.options)) { return null }
        let { caret } = rootProps;
        if (caret === false) { return null }
        return <div className='aio-input-caret'>{caret === undefined ? I(mdiChevronDown, .8) : caret}</div>
    }
    function CheckIcon() {
        let { checkIcon, checked } = properties;
        if (checked === undefined || (!!checkIcon && typeof checkIcon !== 'object')) { return null }
        if (Array.isArray(checkIcon)) { return checkIcon[checked ? 1 : 0] }
        return (
            <div className={'aio-input-check-out' + (checked ? ' checked' : '')} style={{ ...checkIcon, background: 'none' }}>
                {checked && <div className={'aio-input-check-in'} style={{ background: checkIcon.background }}></div>}
            </div>
        );
    }
    function BeforeAfter(mode: 'before' | 'after') {
        let res: React.ReactNode;
        if (mode === 'after' && type === 'password' && rootProps.preview) {
            res = <div className='align-v' onClick={() => setShowPassword()}>{I(showPassword ? mdiEyeOff : mdiEye, .8)}</div>
        }
        else { let v = properties[mode]; res = typeof v === 'function' ? v() : v; }
        if (res === undefined) { return null }
        return <div className={cls(mode)}>{res}</div>
    }
    function Loading() {
        let { loading } = properties;
        let elem;
        if (!loading) { return null; }
        else if (loading === true) { elem = I(mdiLoading, 0.8, { spin: .8 }) }
        else { elem = loading }
        return <div className={cls('loading')}>{elem}</div>
    }
    function getProps() {
        let { justify, attrs, disabled, draggable, style } = properties;
        let zIndex;
        if (open && !option && ['text', 'number', 'textarea'].indexOf(type) !== -1) {
            zIndex = 100000
        }
        let onClick;
        //ممکنه این یک آپشن باشه باید دیزیبل پرنتش هم چک بشه تا دیزیبل بشه
        if (!disabled) {
            if (option === undefined) { onClick = (e: any) => { e.stopPropagation(); click(e, dom) } }
            else {
                onClick = (e: any) => {
                    e.stopPropagation();
                    if ((props.properties || {}).onClick) { props.properties.onClick() }
                    else { optionClick(option) }
                }
            }
        }
        attrs = addToAttrs(attrs, {
            className: getClassName(),
            style: { ...style, justifyContent: justify ? 'center' : undefined, zIndex }
        })
        let p = { ...attrs, onClick, ref: dom, disabled }
        let options: any[] = typeof rootProps.options === 'function' ? rootProps.options() : (rootProps.options || []);
        if (draggable) { p = { ...p, ...DragOptions.getAttrs(options, realIndex || 0) } }
        return p;
    }
    function getProperties() {
        let p = props.properties || {};
        let obj = option || rootProps; //اگر آپشن بود از آپشن وگر نه از پروپس بخون مقادیر رو
        let { draggable = option ? option.draggable : false } = p;
        let { placeholder = !option ? rootProps.placeholder : undefined } = p;
        let { checked = option ? option.checked : (type === 'checkbox' ? !!rootProps.value : undefined) } = p;
        let { disabled = obj.disabled } = p
        let { text = obj.text } = p;
        let { subtext = obj.subtext } = p;
        let { justify = obj.justify } = p;
        let { checkIcon = obj.checkIcon || {} } = p;
        let { loading = obj.loading } = p;
        let { attrs = obj.attrs || {} } = p;
        let { style = obj.style || {} } = p;
        let { before = obj.before } = p;
        let { after = obj.after } = p;
        let { className = obj.className } = p;
        return { disabled, draggable, text, subtext, placeholder, justify, checked, checkIcon, loading, attrs, style, before, after, className }
    }
    function getToggleIcon() {
        if (toggle === undefined) { return null }
        let path;
        if(toggle.state === 2){path = mdiCircleSmall}
        else if(toggle.state === 1){path = mdiChevronDown}
        else {path = mdiChevronRight}
        return I(path, 1)
    }
    function Toggle(indent:AI_indent) {
        if (toggle === undefined) { return null }
        return (<div className="aio-input-toggle" onClick={(e) => toggle.onClick(e)}>
            <div className='aio-input-toggle-icon'>{getToggleIcon()}</div>
            {
                !!indent.childsLength && 
                <svg className='aio-input-toggle-line aio-input-indent-line'>
                    <path d={`M${indent.size / 2} ${0} L${indent.size / 2} ${6} Z`}></path>
                </svg>
            }
        </div>)
    }
    function indentIcon(indent:AI_indent,order) {
        let {parentIndent,size,level,isLastChild} = indent;
        if (!level) { return false }
        let x0 = size / 2,x1 = size,y0 = 0,y1 = 18,y2 = 36,pathes = [];
        if(order === level - 1){
            //horizontal line
            pathes.push(<path d={`M${x0} ${y1} L${x1} ${y1} Z`}></path>)
            //vertical direct line
            pathes.push(<path d={`M${x0} ${y0} L${x0} ${isLastChild ? y1 : y2} Z`}></path>)
        }
        else {
            //vertical connet line
            if(!parentIndent.isLastChild){
                pathes.push(<path d={`M${x0} ${y0} L${x0} ${y2} Z`}></path>)    
            }
        }
        return (<svg className='aio-input-indent-line'>{pathes}</svg>)
    }
    function Indent() {
        if (!indent) { return null }
        let { level } = indent;
        return (
            <div className="aio-input-indents">
                {new Array(level).fill(0).map((o, i) => {
                    return (
                        <div className={`aio-input-indent`}>{indentIcon(indent,i)}</div>
                    )
                })}
                {!!toggle && Toggle(indent)}
            </div>
        )
    }
    let properties = getProperties();
    let content = (<>
        {Indent()}
        {DragIcon()}
        {CheckIcon()}
        {BeforeAfter('before')}
        {Text()}
        {BeforeAfter('after')}
        {Loading()}
        {Caret()}
    </>)
    let p = getProps();
    if (type === 'file') { return (<label {...p}>{content}<InputFile /></label>) }
    return (
        <div {...p}>
            {content}
            {!!option && type === 'tabs' && <div className='aio-input-tabs-option-bar'></div>}
        </div>
    )
}
function List() {
    let { rootProps }: AI_context = useContext(AICTX);
    let { attrs = {}, size = 36, width, count = 3, editable = true, stop = 3, decay = 8, onChange = () => { } } = rootProps;
    let options: any[] = typeof rootProps.options === 'function' ? rootProps.options() : rootProps.options || [];
    let [temp] = useState<I_list_temp>({
        dom: createRef(),
        activeIndex: 0,
        interval: undefined,
        moved: false,
        lastY: 0,
        deltaY: 0,
        so: { y: 0, top: 0, limit: { top: 0, bottom: 0 } }
    })
    function getStyle() {
        var height = count * (size);
        return { width, height }
    }
    function getOptions() {
        temp.activeIndex = 0;
        return options.map((option: any, i: number) => {
            let value = getOptionProp({ props: rootProps, option, key: 'value' });
            let text = getOptionProp({ props: rootProps, option, key: 'text', def: '' });
            let style = getOptionProp({ props: rootProps, option, key: 'style', def: {} });
            if (value === rootProps.value) { temp.activeIndex = i; }
            return <div key={i} data-index={i} className='aio-input-list-option' style={{ height: size, ...style }}>{text}</div>
        })
    }
    function getIndexByTop(top: number) { return Math.round(((count * size) - size - (2 * top)) / (2 * size)); }
    function getTopByIndex(index: number) { return (count - 2 * index - 1) * size / 2; }
    function getContainerStyle() { return { top: getTopByIndex(temp.activeIndex) }; }
    function moveDown() {
        if (temp.activeIndex >= options.length - 1) { return }
        temp.activeIndex++;
        let newTop = getTopByIndex(temp.activeIndex);
        setStyle({ top: newTop });
        setBoldStyle(temp.activeIndex);
    }
    function setBoldStyle(index: number) {
        $(temp.dom.current).find('.aio-input-list-option').removeClass('active');
        $(temp.dom.current).find('.aio-input-list-option[data-index=' + (index) + ']').addClass('active');
    }
    function moveUp() {
        if (temp.activeIndex <= 0) { return }
        temp.activeIndex--;
        let newTop = getTopByIndex(temp.activeIndex);
        setStyle({ top: newTop });
        setBoldStyle(temp.activeIndex);
    }
    function keyDown(e: any) {
        if (!editable) { return }
        if (e.keyCode === 38) { moveUp(); }
        else if (e.keyCode === 40) { moveDown(); }
    }
    function getLimit() { return { top: getTopByIndex(-1), bottom: getTopByIndex(options.length) } }
    function getTrueTop(top: number) {
        let index = getIndexByTop(top);
        if (index < 0) { index = 0 }
        if (index > options.length - 1) { index = options.length - 1 }
        return getTopByIndex(index);
    }
    function mouseDown(e: any) {
        if (!editable) { return }
        EventHandler('window', 'mousemove', mouseMove);
        EventHandler('window', 'mouseup', mouseUp);
        clearInterval(temp.interval);
        temp.moved = false;
        let client = GetClient(e);
        let y = client.y
        setStyle({ transition: 'unset' });
        let top = getTop();
        var index = getIndexByTop(top);
        setBoldStyle(index);
        setStyle({ top, transition: 'unset' });
        onChange(options[index].value, index)
        temp.so = { y, top, limit: getLimit() };
    }
    function getTop() {
        var top = parseInt($(temp.dom.current).find('.aio-input-list-options').css('top'));
        return getTrueTop(top);
    }
    function fixTop(value: number) {
        let { top, bottom } = temp.so.limit;
        if (value > top) { return top }
        if (value < bottom) { return bottom }
        return value;
    }
    function mouseMove(e: any) {
        temp.moved = true;
        var client = GetClient(e);
        let y = client.y;
        var offset = y - temp.so.y;
        if (temp.lastY === undefined) { temp.lastY = y }
        temp.deltaY = y - temp.lastY;
        temp.lastY = y;
        if (Math.abs(offset) < 20) { temp.deltaY = 3 }
        var newTop = fixTop(temp.so.top + offset);
        let index = getIndexByTop(newTop);
        temp.so.newTop = newTop;
        setBoldStyle(index);
        setStyle({ top: newTop });
    }
    function setStyle(obj: any) { $(temp.dom.current).find('.aio-input-list-options').css(obj); }
    function mouseUp() {
        EventHandler('window', 'mousemove', mouseMove, 'unbind');
        EventHandler('window', 'mouseup', mouseUp, 'unbind');
        if (!temp.moved) { return }
        temp.moved = false;
        move(temp.deltaY, temp.so.newTop)
    }
    function move(deltaY: number, startTop = getTop()) {
        if (decay < 0) { decay = 0 }
        if (decay > 99) { decay = 99 }
        decay = 1 + decay / 1000;
        temp.interval = setInterval(() => {
            startTop += deltaY;
            let index = getIndexByTop(startTop);
            setBoldStyle(index);
            if (Math.abs(deltaY) < stop || index < 0 || index > options.length - 1) {
                clearInterval(temp.interval);
                if (index < 0) { index = 0 }
                if (index > options.length - 1) { index = options.length - 1 }
                let top = getTopByIndex(index);
                setStyle({ top, transition: '0.3s' });
                onChange(options[index].value, index)
                return;
            }
            deltaY /= decay;
            setStyle({ top: startTop });
        }, 20)
    }
    useEffect(() => { if (rootProps.move) { rootProps.move(move) } }, [])
    useEffect(() => {
        setBoldStyle(temp.activeIndex);
    })
    let fixedOptions = getOptions();
    return (
        <div
            {...attrs} ref={temp.dom} tabIndex={0} onKeyDown={(e) => keyDown(e)}
            className={'aio-input-list' + (attrs.className ? ' ' + attrs.className : '')}
            style={{ ...attrs.style, ...getStyle() }}
        >
            <div
                className='aio-input-list-options' style={getContainerStyle()}
                onMouseDown={(e) => mouseDown(e)} onTouchStart={(e) => mouseDown(e)}
            >{fixedOptions}</div>
        </div>
    );
}
async function DownloadUrl(url: string, name: string) { fetch(url, { mode: 'no-cors', }).then(resp => resp.blob()).then(blob => { let url = window.URL.createObjectURL(blob); let a = document.createElement('a'); a.style.display = 'none'; a.href = url; a.download = name; document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); }).catch(() => alert('oh no!')); }
type I_AcardionContext = { toggle: (id: string) => void, mountedDic: { [id: string]: boolean }, openDic: { [id: string]: boolean }, rootProps: AI }
type I_Acardion = { options: AI_option[] }
const AcardionContext = createContext({} as any);
export const Acardion: FC<I_Acardion> = (props) => {
    const { rootProps }: AI_context = useContext(AICTX);
    const { multiple, vertical = true } = rootProps;
    let { options } = props;
    let [openDic, setOpenDic] = useState<any>({})
    let [mountedDic, setMountedDic] = useState<{ [id: string]: boolean }>({})
    function SetMounted(newOpen: boolean, id: string) {
        if (!multiple) { setMountedDic(!newOpen ? {} : { [id]: true }) }
        else { setMountedDic({ ...mountedDic, [id]: !mountedDic[id] }) }
    }
    function SetOpen(newOpen: boolean, id: string) {
        if (!multiple) { setOpenDic(!newOpen ? {} : { [id]: true }) }
        else { setOpenDic({ ...openDic, [id]: !openDic[id] }) }
    }
    function toggle(id: any) {
        let open = !!openDic[id]
        let time = 500
        if (!open) { SetOpen(!open, id); setTimeout(() => SetMounted(!open, id), 0) }
        else { SetMounted(!open, id); setTimeout(() => SetOpen(!open, id), time) }
    }
    function getContext() {
        let context: I_AcardionContext = {
            toggle, rootProps, mountedDic, openDic
        }
        return context;
    }
    return (
        <AcardionContext.Provider value={getContext()}>
            <div className={`aio-input-acardion${vertical ? ' aio-input-acardion-vertical' : ' aio-input-acardion-horizontal'}`}>
                {options.map((option: AI_option) => <AcardionItem option={option} />)}
            </div>
        </AcardionContext.Provider>
    )
}
type I_AcardionItem = { option: AI_option }
const AcardionItem: FC<I_AcardionItem> = (props) => {
    const { openDic, mountedDic, toggle }: I_AcardionContext = useContext(AcardionContext);
    let { option } = props;
    let { value } = option;
    let open = !!openDic[value]
    let mounted = !!mountedDic[value];
    return (
        <div className={`aio-input-acardion-item${open ? ' open' : ''}${!mounted ? ' not-mounted' : ''}`}>
            <Layout option={option} properties={{ onClick: () => toggle(value) }} />
            <AcardionBody option={option} />
        </div>
    )
}
type I_AcardionBody = { option: AI_option }
const AcardionBody: FC<I_AcardionBody> = (props) => {
    let { openDic, rootProps }: I_AcardionContext = useContext(AcardionContext);
    let { option } = props;
    let { text, value } = option;
    let open = !!openDic[value]
    let { body } = rootProps;
    if (!open) { return null }
    let { html } = typeof body === 'function' ? body() : body
    return (<div className={`aio-input-acardion-body`}>{html}</div>)
}
type I_TreeContext = {
    toggle: (id: string) => void,
    mountedDic: { [id: string]: boolean },
    openDic: { [id: string]: boolean },
    rootProps: AI,
    types: any,
    add: any,
    remove: any,
    indent: number
}
//should implement
//inlineEdit
//toggleIcon
type I_treeItem = {
    option: AI_option, row: any, parent?: any, parentId?: string,
    id: string, open: boolean, indent: AI_indent
}
const TreeContext = createContext({} as any);
const Tree: FC = () => {
    let { rootProps, types }: AI_context = useContext(AICTX);
    let { onAdd, onRemove, value = [], onChange } = rootProps;
    let [openDic, setOpenDic] = useState<any>({})
    let [mountedDic, setMountedDic] = useState<{ [id: string]: boolean }>({})
    let [indent] = useState<number>(getIndent)
    console.log(openDic, mountedDic)
    function SetMounted(id: string) { setMountedDic({ ...mountedDic, [id]: !mountedDic[id] }) }
    function SetOpen(id: string) { setOpenDic({ ...openDic, [id]: !openDic[id] }) }
    function getIndent() {
        let { indent = 24 } = rootProps;
        if (typeof indent !== 'number') { indent = 12 }
        indent = Math.round(indent / 6) * 6;
        if (indent < 0) { indent = 0 }
        if (indent > 60) { indent = 60 }
        return indent;
    }
    function toggle(id: any) {
        let open = !!openDic[id], time = 300;
        if (!open) { SetOpen(id); setTimeout(() => SetMounted(id), 0) }
        else { SetMounted(id); setTimeout(() => SetOpen(id), time) }
    }
    async function add(parent?: any) {
        let newRow: any;
        if (typeof onAdd === 'function') { newRow = await onAdd({ parent }) }
        else { newRow = onAdd }
        if (!newRow) { return }
        if (parent) { parent.childs = parent.childs || []; parent.childs.push(newRow); }
        else { value.push(newRow) }
        onChange(value);
    }
    async function remove(row: any, parent: any) {
        let res: boolean;
        if (typeof onRemove === 'function') { res = await onRemove({ row, parent }) as boolean }
        else { res = true }
        if (!res) { return }
        if (!parent) {
            value = value.filter((o: any) => {
                let rowValue = getOptionProp({ option: row, key: 'value', props: rootProps })
                let oValue = getOptionProp({ option: o, key: 'value', props: rootProps })
                return rowValue !== oValue
            })
        }
        else {
            parent.childs = parent.childs.filter((o: any) => {
                let rowValue = getOptionProp({ option: row, key: 'value', props: rootProps })
                let oValue = getOptionProp({ option: o, key: 'value', props: rootProps })
                return rowValue !== oValue
            });
        }
        onChange(value)
    }
    function getContext(): I_TreeContext { return { toggle, rootProps, mountedDic, openDic, add, remove, types, indent } }
    return (
        <TreeContext.Provider value={getContext()}>
            <div className="aio-input-tree"><TreeHeader /><TreeBody rows={value} level={0} /></div>
        </TreeContext.Provider>
    )
}
const TreeHeader: FC = () => {
    const { rootProps, add }: I_TreeContext = useContext(TreeContext);
    let { addText = 'add' } = rootProps;
    return (<div className="aio-input-tree-header"><button onClick={() => add()}>{I(mdiPlusThick, .8)}{addText}</button></div>)
}
type I_TreeOptions = { row: any, parent?: any }
const TreeOptions: FC<I_TreeOptions> = (props) => {
    let { row, parent } = props;
    let { rootProps, add, remove }: I_TreeContext = useContext(TreeContext);
    let { onAdd, onRemove, addText = 'Add', removeText = 'Remove' } = rootProps;
    let options = typeof rootProps.options === 'function' ? rootProps.options({ row, parent }) : rootProps.options;
    function GetOptions() {
        let res = [];
        if (onAdd) { res.push({ text: addText, value: 'add', before: I(mdiPlusThick, 0.7), onClick: () => add(row) }) }
        let Options = (options || []).map((o) => { return { ...o, onClick: () => { if (o.onClick) { o.onClick(row, parent) } } } })
        res = [...res, ...Options]
        if (onRemove) { res.push({ text: removeText, value: 'remove', before: I(mdiDelete, 0.7), onClick: () => remove(row, parent) }) }
        return res
    }
    let Options = GetOptions();
    if (!Options.length) { return null }
    let p: AI = { type: 'select', caret: false, className: 'aio-input-tree-options-button', options: GetOptions(), text: I(mdiDotsHorizontal, 0.7) }
    return <AIOInput {...p} />;
}
type I_TreeBody = { rows: any[], level: number, parent?: any, parentId?: string,parentIndent?:AI_indent }
const TreeBody: FC<I_TreeBody> = (props) => {
    let { rootProps, types, openDic, mountedDic, indent }: I_TreeContext = useContext(TreeContext);
    let { rows, level, parent, parentId,parentIndent } = props;
    let options = getOptions({
        rootProps, types, options: rows, properties: {
            after: (row: AI_option) => <TreeOptions row={row.object} parent={parent} />
        }
    })
    let open = parentId === undefined ? true : !!openDic[parentId];
    let mounted = parentId == undefined ? true : mountedDic[parentId];
    return (
        <div className={`aio-input-tree-body${open ? ' open' : ''}${!mounted ? ' not-mounted' : ''}`}>
            {options.map((option: any, index: number) => {
                let row = rows[index];
                let {childs = []} = row;
                let item: I_treeItem = { 
                    row,option, parent, parentId, id: option.value, open, 
                    indent: { level,childsLength:childs.length, size: indent,index,isLastChild:index === options.length - 1,isFirstChild:index === 0,parentIndent } 
                }
                let p = { className: `aio-input-tree-row` }
                return <div {...p}><TreeRow item={item} /><TreeChilds item={item} /></div>;
            })}
        </div>
    )
}
const TreeRow: FC<{ item: I_treeItem }> = (props) => {
    let { toggle, openDic }: I_TreeContext = useContext(TreeContext);
    let { option, row, id, indent } = props.item;
    let { childs = [] } = row;
    let toggleState: (0 | 1 | 2) = !childs.length ? 2 : (!!openDic[id] ? 1 : 0);
    let p: I_Layout = { indent, option, properties: { onClick: () => { } }, toggle: { state: toggleState, onClick: () => toggle(id) } };
    return <Layout {...p} />;
}
const TreeChilds: FC<{ item: I_treeItem }> = (props) => {
    let { row, id, open,indent } = props.item, { childs = [] } = row;
    if (!open || !childs || !childs.length) { return null }
    return <TreeBody rows={childs} level={indent.level + 1} parent={row} parentId={id} parentIndent={indent} />
}
export class AIOValidation {
    contain: (target: any, value: any) => { result: boolean, targetName: string };
    equal: (target: any, value: any, isDate: boolean) => { result: boolean, targetName: string };
    less: (target: any, value: any, isDate: boolean) => { result: boolean, targetName: string };
    less_equal: (target: any, value: any, isDate: boolean) => { result: boolean, targetName: string };
    greater: (target: any, value: any, isDate: boolean) => { result: boolean, targetName: string };
    greater_equal: (target: any, value: any, isDate: boolean) => { result: boolean, targetName: string };
    getMessage: (operator: AV_operator, targetName: string, validation: AV_item, unit: string) => string;
    translate: (operator: AV_operator) => string
    getResult: (p: { target: any, validation: AV_item, value: any, unit: string, operator: AV_operator }) => string | undefined
    getValidation: () => string | undefined;
    validate: () => string | undefined
    constructor(props: AV_props) {
        let { lang = 'en' } = props;
        let DATE = new AIODate();
        this.contain = (target, value) => {
            let result, targetName;
            if (Array.isArray(value)) { result = value.indexOf(target) !== -1 }
            else if (target === 'number') { result = /\d/.test(value); targetName = 'number'; }
            else if (target === 'letter') { result = /[a-zA-Z]/.test(value); targetName = 'letter'; }
            else if (target === 'uppercase') { result = /[A-Z]/.test(value); targetName = 'uppercase' }
            else if (target === 'lowercase') { result = /[a-z]/.test(value); targetName = 'lowercase' }
            else if (target === 'symbol') { result = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value); targetName = 'symbol' }
            else if (typeof target.test === 'function') { result = target.test(value); targetName = target.toString() }
            else { result = value.indexOf(target) !== -1; targetName = target }
            return { result, targetName }
        }
        this.equal = (target, value, isDate) => {
            let valueType = Array.isArray(value) ? 'array' : typeof value;
            let targetType = Array.isArray(value) ? 'array' : typeof target;
            let result;
            if (isDate) { result = DATE.isEqual(value, target) }
            else if ((valueType === 'array' || valueType === 'string') && targetType === 'number') { result = value.length === target }
            else { result = JSON.stringify(value) === JSON.stringify(target) }
            return { result, targetName: target }
        }
        this.less = (target, value, isDate) => {
            let valueType = Array.isArray(value) ? 'array' : typeof value;
            let targetType = Array.isArray(value) ? 'array' : typeof target;
            let result;
            if (isDate) { result = DATE.isLess(value, target) }
            else if (targetType === 'number' && valueType === 'number') { result = value < target }
            else if ((valueType === 'array' || valueType === 'string') && targetType === 'number') { result = value.length < target }
            else { result = false }
            return { result, targetName: target }
        }
        this.less_equal = (target, value, isDate) => {
            let valueType = Array.isArray(value) ? 'array' : typeof value;
            let targetType = Array.isArray(value) ? 'array' : typeof target;
            let lessResult;
            if (isDate) { lessResult = DATE.isLess(value, target) }
            else if (targetType === 'number' && valueType === 'number') { lessResult = value < target }
            else if ((valueType === 'array' || valueType === 'string') && targetType === 'number') { lessResult = value.length < target }
            else { lessResult = false }
            let { result: equalResult } = this.equal(target, value, isDate)
            return { result: equalResult && lessResult, targetName: target }
        }
        this.greater = (target, value, isDate) => {
            let valueType = Array.isArray(value) ? 'array' : typeof value;
            let targetType = Array.isArray(value) ? 'array' : typeof target;
            let result;
            if (isDate) { result = DATE.isGreater(value, target) }
            else if (targetType === 'number' && valueType === 'number') { result = value > target }
            else if ((valueType === 'array' || valueType === 'string') && targetType === 'number') { result = value.length > target }
            else { result = false }
            return { result, targetName: target }
        }
        this.greater_equal = (target, value, isDate) => {
            let valueType = Array.isArray(value) ? 'array' : typeof value;
            let targetType = Array.isArray(value) ? 'array' : typeof target;
            let greaterResult;
            if (isDate) { greaterResult = DATE.isGreater(value, target) }
            else if (targetType === 'number' && valueType === 'number') { greaterResult = value > target }
            else if ((valueType === 'array' || valueType === 'string') && targetType === 'number') { greaterResult = value.length > target }
            else { greaterResult = false }
            let { result: equalResult } = this.equal(target, value, isDate)
            return { result: equalResult && greaterResult, targetName: target }
        }
        this.translate = (operator) => {
            let dict = {
                contain: { en: 'should be contain', fa: 'باید شامل' },
                not_contain: { en: 'should not be contain', fa: 'نمی تواند شامل' },
                less: { en: 'should be less than', fa: 'باید کمتر از' },
                greater: { en: 'should be more than', fa: 'باید بیشتر از' },
                not_greater: { en: 'could not be more than', fa: 'نباید بزرگ تر از' },
                not_less: { en: 'could not be less than', fa: 'نباید کوچک تر از' },
                equal: { en: 'should be equal', fa: 'باید برابر' },
                not_equal: { en: 'cannot be equal', fa: 'نمی تواند برابر' },
                function: { en: '', fa: '' },
                required: { en: '', fa: '' }
            }
            return dict[operator][lang]
        }
        this.getMessage = (operator, targetName, validation, unit) => {
            let { title = props.title, targetName: TargetName = targetName, message } = validation;
            if (message) { return message }
            return `${title} ${this.translate(operator)} ${TargetName} ${unit}` + (props.lang === 'fa' ? ' باشد' : '')
        }
        this.getResult = (p: { target: any, validation: AV_item, value: any, unit: string, operator: AV_operator }) => {
            let { target, validation, value, unit, operator } = p;
            target = Array.isArray(target) ? target : [target];
            let targetNames = [];
            let error = true;
            let operatorName: string = operator, not = false, isDate = false;
            let dateIndex = operator.indexOf('date_');
            if (dateIndex === 0) {
                isDate = true;
                operatorName = operatorName.slice(dateIndex, operatorName.length);
            }
            let notIndex = operatorName.indexOf('not_');
            if (notIndex === 0) {
                not = true;
                operatorName = operator.slice(notIndex, operator.length);
            }


            for (let i = 0; i < target.length; i++) {
                let fn: any = (this as any)[operatorName];
                let { result, targetName } = fn(target[i], value, isDate)
                if ((not && result) || (!not && !result)) {
                    targetNames.push(targetName);
                }
                else {
                    error = false;
                    break
                }
            }
            if (error) { return this.getMessage(operator, targetNames.join(' or '), validation, unit) }
        }
        this.getValidation = () => {
            let { value, validations = [] } = props;
            let unit = '';
            if (Array.isArray(value)) { unit = lang === 'fa' ? 'کاراکتر' : 'character(s)' }
            else if (typeof value === 'string') { unit = lang === 'fa' ? 'مورد' : 'items(s)' }
            for (let i = 0; i < validations.length; i++) {
                let { operator, target, title = props.title } = validations[i];
                let result;
                if (operator === 'function') {
                    result = target(value);
                }
                else if (operator === 'required') {
                    if (value === undefined || value === null || value === '' || value === false || value.length === 0) {
                        if (lang === 'en') { return `${title} is required` }
                        if (lang === 'fa') { return `وارد کردن ${title} ضروری است` }
                    }
                }
                else {
                    result = this.getResult({ operator, target, validation: validations[i], value, unit })
                }
                if (result) { return result }
            }
            return
        }
        this.validate = () => {
            let validation;
            try { validation = this.getValidation() } catch { validation = '' }
            return validation;
        }
    }
}
export function AIOInputSetStorage(name: string, value: any) {
    let storage: AIOStorage = new AIOStorage('aio-input-storage');
    storage.save(name, value)
}
export function getFormInputs(fields: string[], path?: string) {
    function getInput(input: any) { return typeof input === 'string' ? getFormInput(input, path) : input }
    return fields.map((o) => Array.isArray(o) ? { row: o.map((oo) => getInput(oo)) } : getInput(o))
}
export function getFormInput(Field: string, path?: string) {
    function getOptions(field: string, path?: string) {
        let dic: any = {
            militaryservice: () => ['مشمول', 'معاف', 'پایان خدمت'], gender: () => ['مرد', 'زن'], married: () => ['مجرد', 'متاهل'], state: () => Object.keys(getCities()),
            city: () => (value?: any) => {
                let state;
                try { eval(`state = value${path ? '.' + path : ''}.state`) } catch { }
                return !state ? [] : getCities()[state]
            },

        }
        return dic[field]()
    }
    function getField(field: string) { return `value${path ? `.${path}` : ''}.${field}` }
    function getBase(field: string) {
        let list = field.split('_');
        if (list.length >= 3) {
            let inputProps = {}
            if (list[3]) {
                try { inputProps = JSON.parse(list[3]) } catch { }
            }
            return { field: list[0], input: { type: list[1], ...inputProps }, label: list[2], extra: {} }
        }
        let { input, label, extra = {} }: any = {
            fullname: { input: { type: 'text' }, label: 'نام و نام خانوادگی' },
            firstname: { input: { type: 'text' }, label: 'نام' },
            lastname: { input: { type: 'text' }, label: 'نام خانوادگی' },
            username: { input: { type: 'text' }, label: 'نام کاربری' },
            address: { input: { type: 'textarea' }, label: 'آدرس' },
            email: { input: { type: 'text' }, label: 'ایمیل' },
            father: { input: { type: 'text' }, label: 'نام پدر' },
            phone: { input: { type: 'text', maxLength: 11, justNumber: true }, label: 'شماره تلفن' },
            mobile: { input: { type: 'text', maxLength: 11, justNumber: true }, label: 'شماره همراه' },
            postal: { input: { type: 'text', justNumber: true }, label: 'کد پستی' },
            nationalcode: { input: { type: 'text', maxLength: 10, justNumber: true }, label: 'کد ملی' },
            idnumber: { input: { type: 'text' }, label: 'شماره شناسنامه' },
            cardbank: { input: { type: 'text', justNumber: true, maxLength: 16 }, label: 'شماره کارت' },
            state: { input: { type: 'select' }, label: 'استان' },
            city: { input: { type: 'select' }, label: 'شهر' },
            gender: { input: { type: 'radio' }, label: 'جنسیت' },
            married: { input: { type: 'radio' }, label: 'وضعیت تاهل' },
            password: { input: { type: 'password' }, label: 'رمز عبور' },
            repassword: {
                input: { type: 'password' }, label: 'تکرار رمز عبور',
                extra: { validations: [['=', getField('password'), { message: 'تکرار رمز صحیح نیست' }]] }
            },
            militaryservice: { input: { type: 'radio' }, label: 'وضعیت خدمت' },
            location: {
                input: {
                    type: 'map', mapConfig: { draggable: false, zoomable: false, showAddress: false },
                    popup: { mapConfig: { search: true, title: 'ثبت موقعیت جغرافیایی', zoomable: true, draggable: true } },
                    style: { height: 90, minHeight: 90 }
                },
                label: 'موقعیت جغرافیایی', extra: { addressField: getField('address') }
            },
        }[field];
        return { input, label, extra, field }
    }
    let required = false;
    if (Field.indexOf('*') === 0) { Field = Field.slice(1, Field.length); required = true }
    let { input, label, extra, field } = getBase(Field);
    let inputProps = { ...input }
    if (['select', 'radio'].indexOf(input.type) !== -1) { inputProps = { ...inputProps, optionText: 'option', optionValue: 'option', options: getOptions(field, path) } }
    if (['select'].indexOf(input.type) !== -1) { inputProps = { ...inputProps, popover: { fitHorizontal: true } } }
    return { field: `value${path ? `.${path}` : ''}.${field}`, validations: required ? [['required']] : undefined, label, input: inputProps, ...extra }
}
function getCities() {
    return {
        "آذربایجان شرقی": ["اسکو", "اهر", "ایلخچی", "آبش احمد", "آذرشهر", "آقکند", "باسمنج", "بخشایش", "بستان آباد", "بناب", "بناب جدید", "تبریز", "ترک", "ترکمانچای", "تسوج", "تیکمه داش", "جلفا", "خاروانا", "خامنه", "خراجو", "خسروشهر", "خضرلو", "خمارلو", "خواجه", "دوزدوزان", "زرنق", "زنوز", "سراب", "سردرود", "سهند", "سیس", "سیه رود", "شبستر", "شربیان", "شرفخانه", "شندآباد", "صوفیان", "عجب شیر", "قره آغاج", "کشکسرای", "کلوانق", "کلیبر", "کوزه کنان", "گوگان", "لیلان", "مراغه", "مرند", "ملکان", "ملک کیان", "ممقان", "مهربان", "میانه", "نظرکهریزی", "هادی شهر", "هرگلان", "هریس", "هشترود", "هوراند", "وایقان", "ورزقان", "یامچی"],
        "آذربایجان غربی": ["ارومیه", "اشنویه", "ایواوغلی", "آواجیق", "باروق", "بازرگان", "بوکان", "پلدشت", "پیرانشهر", "تازه شهر", "تکاب", "چهاربرج", "خوی", "دیزج دیز", "ربط", "سردشت", "سرو", "سلماس", "سیلوانه", "سیمینه", "سیه چشمه", "شاهین دژ", "شوط", "فیرورق", "قره ضیاءالدین", "قطور", "قوشچی", "کشاورز", "گردکشانه", "ماکو", "محمدیار", "محمودآباد", "مهاباد", "میاندوآب", "میرآباد", "نالوس", "نقده", "نوشین"],
        "اردبیل": ["اردبیل", "اصلاندوز", "آبی بیگلو", "بیله سوار", "پارس آباد", "تازه کند", "تازه کندانگوت", "جعفرآباد", "خلخال", "رضی", "سرعین", "عنبران", "فخرآباد", "کلور", "کوراییم", "گرمی", "گیوی", "لاهرود", "مشگین شهر", "نمین", "نیر", "هشتجین", "هیر"],
        "اصفهان": ["ابریشم", "ابوزیدآباد", "اردستان", "اژیه", "اصفهان", "افوس", "انارک", "ایمانشهر", "آران وبیدگل", "بادرود", "باغ بهادران", "بافران", "برزک", "برف انبار", "بهاران شهر", "بهارستان", "بوئین و میاندشت", "پیربکران", "تودشک", "تیران", "جندق", "جوزدان", "جوشقان و کامو", "چادگان", "چرمهین", "چمگردان", "حبیب آباد", "حسن آباد", "حنا", "خالدآباد", "خمینی شهر", "خوانسار", "خور", "خورزوق", "داران", "دامنه", "درچه", "دستگرد", "دهاقان", "دهق", "دولت آباد", "دیزیچه", "رزوه", "رضوانشهر", "زاینده رود", "زرین شهر", "زواره", "زیباشهر", "سده لنجان", "سفیدشهر", "سگزی", "سمیرم", "شاهین شهر", "شهرضا", "طالخونچه", "عسگران", "علویجه", "فرخی", "فریدونشهر", "فلاورجان", "فولادشهر", "قمصر", "قهجاورستان", "قهدریجان", "کاشان", "کرکوند", "کلیشاد و سودرجان", "کمشچه", "کمه", "کهریزسنگ", "کوشک", "کوهپایه", "گرگاب", "گزبرخوار", "گلپایگان", "گلدشت", "گلشهر", "گوگد", "لای بید", "مبارکه", "مجلسی", "محمدآباد", "مشکات", "منظریه", "مهاباد", "میمه", "نائین", "نجف آباد", "نصرآباد", "نطنز", "نوش آباد", "نیاسر", "نیک آباد", "هرند", "ورزنه", "ورنامخواست", "وزوان", "ونک"],
        "البرز": ["اسارا", "اشتهارد", "تنکمان", "تهران دشت", "چهارباغ", "ساوجبلاغ", "سعید آباد", "شهر جدید هشتگرد", "طالقان", "فردیس", "کرج", "کردان", "کمال شهر", "کوهسار", "گرمدره", "گلبهار", "ماهدشت", "محمدشهر", "مشکین دشت", "نظرآباد", "هشتگرد"],
        "ایلام": ["ارکواز", "ایلام", "ایوان", "آبدانان", "آسمان آباد", "بدره", "پهله", "توحید", "چوار", "دره شهر", "دلگشا", "دهلران", "زرنه", "سراب باغ", "سرابله", "صالح آباد", "لومار", "مهران", "مورموری", "موسیان", "میمه"],
        "بوشهر": ["امام حسن", "انارستان", "اهرم", "آب پخش", "آبدان", "برازجان", "بردخون", "بندردیر", "بندردیلم", "بندرریگ", "بندرکنگان", "بندرگناوه", "بنک", "بوشهر", "تنگ ارم", "جم", "چغادک", "خارک", "خورموج", "دالکی", "دلوار", "ریز", "سعدآباد", "سیراف", "شبانکاره", "شنبه", "عسلویه", "کاکی", "کلمه", "نخل تقی", "وحدتیه"],
        "تهران": ["ارجمند", "اسلامشهر", "اندیشه", "آبسرد", "آبعلی", "باغستان", "باقرشهر", "بومهن", "پاکدشت", "پردیس", "پرند", "پیشوا", "تهران", "جوادآباد", "چهاردانگه", "حسن آباد", "دماوند", "دیزین", "شهر ری", "رباط کریم", "رودهن", "شاهدشهر", "شریف آباد", "شمشک", "شهریار", "صالح آباد", "صباشهر", "صفادشت", "فردوسیه", "فشم", "فیروزکوه", "قدس", "قرچک", "قیامدشت", "کهریزک", "کیلان", "گلستان", "لواسان", "مارلیک", "ملارد", "میگون", "نسیم شهر", "نصیرآباد", "وحیدیه", "ورامین"],
        "چهارمحال و بختیاری": ["اردل", "آلونی", "باباحیدر", "بروجن", "بلداجی", "بن", "جونقان", "چلگرد", "سامان", "سفیددشت", "سودجان", "سورشجان", "شلمزار", "شهرکرد", "طاقانک", "فارسان", "فرادنبه", "فرخ شهر", "کیان", "گندمان", "گهرو", "لردگان", "مال خلیفه", "ناغان", "نافچ", "نقنه", "هفشجان"],
        "خراسان جنوبی": ["ارسک", "اسدیه", "اسفدن", "اسلامیه", "آرین شهر", "آیسک", "بشرویه", "بیرجند", "حاجی آباد", "خضری دشت بیاض", "خوسف", "زهان", "سرایان", "سربیشه", "سه قلعه", "شوسف", "طبس ", "فردوس", "قاین", "قهستان", "محمدشهر", "مود", "نهبندان", "نیمبلوک"],
        "خراسان رضوی": ["احمدآباد صولت", "انابد", "باجگیران", "باخرز", "بار", "بایگ", "بجستان", "بردسکن", "بیدخت", "بینالود", "تایباد", "تربت جام", "تربت حیدریه", "جغتای", "جنگل", "چاپشلو", "چکنه", "چناران", "خرو", "خلیل آباد", "خواف", "داورزن", "درگز", "در رود", "دولت آباد", "رباط سنگ", "رشتخوار", "رضویه", "روداب", "ریوش", "سبزوار", "سرخس", "سفیدسنگ", "سلامی", "سلطان آباد", "سنگان", "شادمهر", "شاندیز", "ششتمد", "شهرآباد", "شهرزو", "صالح آباد", "طرقبه", "عشق آباد", "فرهادگرد", "فریمان", "فیروزه", "فیض آباد", "قاسم آباد", "قدمگاه", "قلندرآباد", "قوچان", "کاخک", "کاریز", "کاشمر", "کدکن", "کلات", "کندر", "گلمکان", "گناباد", "لطف آباد", "مزدآوند", "مشهد", "ملک آباد", "نشتیفان", "نصرآباد", "نقاب", "نوخندان", "نیشابور", "نیل شهر", "همت آباد", "یونسی"],
        "خراسان شمالی": ["اسفراین", "ایور", "آشخانه", "بجنورد", "پیش قلعه", "تیتکانلو", "جاجرم", "حصارگرمخان", "درق", "راز", "سنخواست", "شوقان", "شیروان", "صفی آباد", "فاروج", "قاضی", "گرمه", "لوجلی"],
        "خوزستان": ["اروندکنار", "الوان", "امیدیه", "اندیمشک", "اهواز", "ایذه", "آبادان", "آغاجاری", "باغ ملک", "بستان", "بندرامام خمینی", "بندرماهشهر", "بهبهان", "ترکالکی", "جایزان", "چمران", "چویبده", "حر", "حسینیه", "حمزه", "حمیدیه", "خرمشهر", "دارخوین", "دزآب", "دزفول", "دهدز", "رامشیر", "رامهرمز", "رفیع", "زهره", "سالند", "سردشت", "سوسنگرد", "شادگان", "شاوور", "شرافت", "شوش", "شوشتر", "شیبان", "صالح شهر", "صفی آباد", "صیدون", "قلعه تل", "قلعه خواجه", "گتوند", "لالی", "مسجدسلیمان", "ملاثانی", "میانرود", "مینوشهر", "هفتگل", "هندیجان", "هویزه", "ویس"],
        "زنجان": ["ابهر", "ارمغان خانه", "آب بر", "چورزق", "حلب", "خرمدره", "دندی", "زرین آباد", "زرین رود", "زنجان", "سجاس", "سلطانیه", "سهرورد", "صائین قلعه", "قیدار", "گرماب", "ماه نشان", "هیدج"],
        "سمنان": ["امیریه", "ایوانکی", "آرادان", "بسطام", "بیارجمند", "دامغان", "درجزین", "دیباج", "سرخه", "سمنان", "شاهرود", "شهمیرزاد", "کلاته خیج", "گرمسار", "مجن", "مهدی شهر", "میامی"],
        "سیستان و بلوچستان": ["ادیمی", "اسپکه", "ایرانشهر", "بزمان", "بمپور", "بنت", "بنجار", "پیشین", "جالق", "چابهار", "خاش", "دوست محمد", "راسک", "زابل", "زابلی", "زاهدان", "زهک", "سراوان", "سرباز", "سوران", "سیرکان", "علی اکبر", "فنوج", "قصرقند", "کنارک", "گشت", "گلمورتی", "محمدان", "محمدآباد", "محمدی", "میرجاوه", "نصرت آباد", "نگور", "نوک آباد", "نیک شهر", "هیدوچ"],
        "فارس": ["اردکان", "ارسنجان", "استهبان", "اشکنان", "افزر", "اقلید", "امام شهر", "اهل", "اوز", "ایج", "ایزدخواست", "آباده", "آباده طشک", "باب انار", "بالاده", "بنارویه", "بهمن", "بوانات", "بیرم", "بیضا", "جنت شهر", "جهرم", "جویم", "زرین دشت", "حسن آباد", "خان زنیان", "خاوران", "خرامه", "خشت", "خنج", "خور", "داراب", "داریان", "دبیران", "دژکرد", "دهرم", "دوبرجی", "رامجرد", "رونیز", "زاهدشهر", "زرقان", "سده", "سروستان", "سعادت شهر", "سورمق", "سیدان", "ششده", "شهرپیر", "شهرصدرا", "شیراز", "صغاد", "صفاشهر", "علامرودشت", "فدامی", "فراشبند", "فسا", "فیروزآباد", "قائمیه", "قادرآباد", "قطب آباد", "قطرویه", "قیر", "کارزین (فتح آباد)", "کازرون", "کامفیروز", "کره ای", "کنارتخته", "کوار", "گراش", "گله دار", "لار", "لامرد", "لپویی", "لطیفی", "مبارک آباددیز", "مرودشت", "مشکان", "مصیری", "مهر", "میمند", "نوبندگان", "نوجین", "نودان", "نورآباد", "نی ریز", "وراوی"],
        "قزوین": ["ارداق", "اسفرورین", "اقبالیه", "الوند", "آبگرم", "آبیک", "آوج", "بوئین زهرا", "بیدستان", "تاکستان", "خاکعلی", "خرمدشت", "دانسفهان", "رازمیان", "سگزآباد", "سیردان", "شال", "شریفیه", "ضیاآباد", "قزوین", "کوهین", "محمدیه", "محمودآباد نمونه", "معلم کلایه", "نرجه"],
        "قم": ["جعفریه", "دستجرد", "سلفچگان", "قم", "قنوات", "کهک"],
        "کردستان": ["آرمرده", "بابارشانی", "بانه", "بلبان آباد", "بوئین سفلی", "بیجار", "چناره", "دزج", "دلبران", "دهگلان", "دیواندره", "زرینه", "سروآباد", "سریش آباد", "سقز", "سنندج", "شویشه", "صاحب", "قروه", "کامیاران", "کانی دینار", "کانی سور", "مریوان", "موچش", "یاسوکند"],
        "کرمان": ["اختیارآباد", "ارزوئیه", "امین شهر", "انار", "اندوهجرد", "باغین", "بافت", "بردسیر", "بروات", "بزنجان", "بم", "بهرمان", "پاریز", "جبالبارز", "جوپار", "جوزم", "جیرفت", "چترود", "خاتون آباد", "خانوک", "خورسند", "درب بهشت", "دهج", "رابر", "راور", "راین", "رفسنجان", "رودبار", "ریحان شهر", "زرند", "زنگی آباد", "زیدآباد", "سیرجان", "شهداد", "شهربابک", "صفائیه", "عنبرآباد", "فاریاب", "فهرج", "قلعه گنج", "کاظم آباد", "کرمان", "کشکوئیه", "کهنوج", "کوهبنان", "کیانشهر", "گلباف", "گلزار", "لاله زار", "ماهان", "محمدآباد", "محی آباد", "مردهک", "مس سرچشمه", "منوجان", "نجف شهر", "نرماشیر", "نظام شهر", "نگار", "نودژ", "هجدک", "یزدان شهر"],
        "کرمانشاه": ["ازگله", "اسلام آباد غرب", "باینگان", "بیستون", "پاوه", "تازه آباد", "جوان رود", "حمیل", "ماهیدشت", "روانسر", "سرپل ذهاب", "سرمست", "سطر", "سنقر", "سومار", "شاهو", "صحنه", "قصرشیرین", "کرمانشاه", "کرندغرب", "کنگاور", "کوزران", "گهواره", "گیلانغرب", "میان راهان", "نودشه", "نوسود", "هرسین", "هلشی"],
        "کهگیلویه و بویراحمد": ["باشت", "پاتاوه", "چرام", "چیتاب", "دهدشت", "دوگنبدان", "دیشموک", "سوق", "سی سخت", "قلعه رئیسی", "گراب سفلی", "لنده", "لیکک", "مادوان", "مارگون", "یاسوج"],
        "گلستان": ["انبارآلوم", "اینچه برون", "آزادشهر", "آق قلا", "بندرترکمن", "بندرگز", "جلین", "خان ببین", "دلند", "رامیان", "سرخنکلاته", "سیمین شهر", "علی آباد کتول", "فاضل آباد", "کردکوی", "کلاله", "گالیکش", "گرگان", "گمیش تپه", "گنبدکاووس", "مراوه", "مینودشت", "نگین شهر", "نوده خاندوز", "نوکنده"],
        "لرستان": ["ازنا", "اشترینان", "الشتر", "الیگودرز", "بروجرد", "پلدختر", "چالانچولان", "چغلوندی", "چقابل", "خرم آباد", "درب گنبد", "دورود", "زاغه", "سپیددشت", "سراب دوره", "فیروزآباد", "کونانی", "کوهدشت", "گراب", "معمولان", "مومن آباد", "نورآباد", "ویسیان"],
        "گیلان": ["احمدسرگوراب", "اسالم", "اطاقور", "املش", "آستارا", "آستانه اشرفیه", "بازار جمعه", "بره سر", "بندرانزلی", "پره سر", "پیربازار", "تالش", "توتکابن", "جیرنده", "چابکسر", "چاف و چمخاله", "چوبر", "حویق", "خشکبیجار", "خمام", "دیلمان", "زیباکنار", "رانکوه", "رحیم آباد", "رستم آباد", "رشت", "رضوانشهر", "رودبار", "رودبنه", "رودسر", "سنگر", "سیاهکل", "شفت", "شلمان", "صومعه سرا", "فومن", "کلاچای", "کوچصفهان", "کومله", "کیاشهر", "گوراب زرمیخ", "لاهیجان", "لشت نشا", "لنگرود", "لوشان", "لولمان", "لوندویل", "لیسار", "ماسال", "ماسوله", "مرجقل", "منجیل", "واجارگاه"],
        "مازندران": ["امیرکلا", "ایزدشهر", "آلاشت", "آمل", "بابل", "بابلسر", "بلده", "بهشهر", "بهنمیر", "پل سفید", "تنکابن", "جویبار", "چالوس", "چمستان", "خرم آباد", "خلیل شهر", "خوش رودپی", "دابودشت", "رامسر", "رستمکلا", "رویان", "رینه", "زرگرمحله", "زیرآب", "سادات شهر", "ساری", "سرخرود", "سلمان شهر", "سورک", "شیرگاه", "شیرود", "عباس آباد", "فریدونکنار", "فریم", "قائم شهر", "کتالم", "کلارآباد", "کلاردشت", "کله بست", "کوهی خیل", "کیاسر", "کیاکلا", "گتاب", "گزنک", "گلوگاه", "محمودآباد", "مرزن آباد", "مرزیکلا", "نشتارود", "نکا", "نور", "نوشهر"],
        "مرکزی": ["اراک", "آستانه", "آشتیان", "پرندک", "تفرش", "توره", "جاورسیان", "خشکرود", "خمین", "خنداب", "داودآباد", "دلیجان", "رازقان", "زاویه", "ساروق", "ساوه", "سنجان", "شازند", "غرق آباد", "فرمهین", "قورچی باشی", "کرهرود", "کمیجان", "مامونیه", "محلات", "مهاجران", "میلاجرد", "نراق", "نوبران", "نیمور", "هندودر"],
        "هرمزگان": ["ابوموسی", "بستک", "بندرجاسک", "بندرچارک", "بندرخمیر", "بندرعباس", "بندرلنگه", "بیکا", "پارسیان", "تخت", "جناح", "حاجی آباد", "درگهان", "دهبارز", "رویدر", "زیارتعلی", "سردشت", "سندرک", "سوزا", "سیریک", "فارغان", "فین", "قشم", "قلعه قاضی", "کنگ", "کوشکنار", "کیش", "گوهران", "میناب", "هرمز", "هشتبندی"],
        "همدان": ["ازندریان", "اسدآباد", "برزول", "بهار", "تویسرکان", "جورقان", "جوکار", "دمق", "رزن", "زنگنه", "سامن", "سرکان", "شیرین سو", "صالح آباد", "فامنین", "فرسفج", "فیروزان", "قروه درجزین", "قهاوند", "کبودر آهنگ", "گل تپه", "گیان", "لالجین", "مریانج", "ملایر", "نهاوند", "همدان"],
        "یزد": ["ابرکوه", "احمدآباد", "اردکان", "اشکذر", "بافق", "بفروئیه", "بهاباد", "تفت", "حمیدیا", "خضرآباد", "دیهوک", "رضوانشهر", "زارچ", "شاهدیه", "طبس", "عقدا", "مروست", "مهردشت", "مهریز", "میبد", "ندوشن", "نیر", "هرات", "یزد"]
    }
}
function getTypes(props: AI) {
    function isDropdown() {
        if (['select', 'multiselect', 'date', 'time'].indexOf(type) !== -1) { return true }
        if (['text', 'number', 'textarea'].indexOf(type) !== -1 && props.options) { return true }
        if (type === 'button' && props.popover) { return true }
        return false
    }
    let { type, multiple } = props;
    let isMultiple;
    if (type === 'multiselect' || type === 'table' || type === 'tree') { isMultiple = true }
    else if (type === 'radio' || type === 'range' || type === 'file' || type === 'buttons') { isMultiple = !!multiple }
    else { isMultiple = false };
    return {
        isMultiple,
        isInput: ['text', 'number', 'textarea', 'password'].indexOf(type) !== -1,
        isDropdown: isDropdown(),
        hasOption: ['text', 'number', 'textarea', 'color', 'select', 'multiselect', 'radio', 'tabs', 'list', 'buttons'].indexOf(type) !== -1,
        hasPlaceholder: ['text', 'number', 'textarea', 'color', 'select', 'table', 'image', 'date'].indexOf(type) !== -1,
        hasKeyboard: ['text', 'textarea', 'number', 'password'].indexOf(type) !== -1,
        hasText: ['multiselect', 'checkbox', 'button', 'select'].indexOf(type) !== -1,
        hasSearch: ['multiselect', 'table', 'select'].indexOf(type) !== -1
    }
}
function getDateText(rootProps: AI) {
    let { value, unit = Def<string>('date-unit'), text, jalali, placeholder } = rootProps;
    if (value) {
        let DATE = new AIODate();
        let list = DATE.convertToArray(value);
        let [year, month = 1, day = 1, hour = 0] = list;
        list = [year, month, day, hour];
        let pattern: string = '{}';
        let splitter = DATE.getSplitter(value)
        if (text && (typeof text === 'string' || typeof text === 'number')) { pattern = text.toString() }
        else if (unit === 'month') { pattern = `{year}${splitter}{month}` }
        else if (unit === 'day') { pattern = `{year}${splitter}{month}${splitter}{day}` }
        else if (unit === 'hour') { pattern = `{year}${splitter}{month}${splitter}{day} - {hour} : 00` }
        return <div style={{ direction: 'ltr' }}>{DATE.getDateByPattern(list, pattern)}</div>
    }
    return placeholder || (!jalali ? 'Select Date' : 'انتخاب تاریخ')
}
function D2S(n: number) { let ns: string = n.toString(); return ns.length === 1 ? '0' + ns : ns }
function getDefaultProps(props: AI, types: AI_types) {
    let valueType = Array.isArray(props.value) ? 'array' : typeof props.value;
    props = { ...props }
    if (props.type === 'multiselect') {
        if (!props.text) { props.text = 'Select Items' }
    }
    else if (props.type === 'time') {
        if (!props.value) { props.value = {} }
    }
    if (props.loading === true) { props.disabled = true }
    if (types.isMultiple) {
        if (!props.value) { props.value = [] }
        else if (valueType !== 'array') { props.value = [props.value] }
    }
    else {
        if (valueType === 'array') { props.value = props.value[0] }
    }
    return props;
}
function getOptions(p: { rootProps: AI, types: AI_types, options?: any[], properties?: any }): AI_option[] {
    let { rootProps, types, properties = {} } = p;
    let { deSelect } = rootProps;
    let options = p.options || rootProps.options || [];
    if (typeof options === 'function') { options = options() }
    let result = [];
    let renderIndex = 0;
    let draggable: boolean = types.isDropdown && types.hasOption && !!rootProps.onSwap;
    function getDefaultOptionChecked(v: any) {
        if (rootProps.type === 'multiselect') { return rootProps.value.indexOf(v) !== -1 }
        if (rootProps.type === 'radio') { return types.isMultiple ? rootProps.value.indexOf(v) !== -1 : rootProps.value === v }
    }
    if (deSelect && typeof deSelect !== 'function' && deSelect !== true) { options = [deSelect, ...options] }
    function updateOptionByProperties(option: AI_option) {
        for (let prop in properties) {
            option[prop] = properties[prop](option)
        }
        return option
    }
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let disabled = !!rootProps.disabled || !!rootProps.loading || !!getOptionProp({ props: rootProps, option, key: 'disabled', renderIndex, realIndex: i });
        let show = getOptionProp({ props: rootProps, option, key: 'show', renderIndex, realIndex: i })
        if (show === false) { continue }
        let text = getOptionProp({ props: rootProps, option, key: 'text', renderIndex, realIndex: i });
        //در اینپوت ها آپشن هایی رو نشون بده که با ولیو مچ هستند
        //if (types.isInput && value && text.toString().indexOf(value.toString()) !== 0) { continue }
        let optionValue = getOptionProp({ props: rootProps, option, key: 'value', renderIndex, realIndex: i })
        let attrs = getOptionProp({ props: rootProps, option, key: 'attrs', def: {}, renderIndex, realIndex: i });
        let defaultChecked = getDefaultOptionChecked(optionValue)
        let checked = getOptionProp({ props: rootProps, option, key: 'checked', def: defaultChecked, renderIndex, realIndex: i })
        //object:option => do not remove mutability to use original value of option in for example tree row
        let obj = {
            object: option, show,
            loading: rootProps.loading,
            attrs, text, value: optionValue, disabled, draggable,
            checkIcon: getOptionProp({ props: rootProps, option, key: 'checkIcon', renderIndex, realIndex: i }) || rootProps.checkIcon,
            checked,
            before: getOptionProp({ props: rootProps, option, key: 'before', renderIndex, realIndex: i }),
            after: getOptionProp({ props: rootProps, option, key: 'after', renderIndex, realIndex: i }),
            justify: getOptionProp({ props: rootProps, option, key: 'justify', renderIndex, realIndex: i }),
            subtext: getOptionProp({ props: rootProps, option, key: 'subtext', renderIndex, realIndex: i }),
            onClick: getOptionProp({ props: rootProps, option, key: 'onClick', preventFunction: true, renderIndex, realIndex: i }),
            className: getOptionProp({ props: rootProps, option, key: 'className', renderIndex, realIndex: i }),
            style: getOptionProp({ props: rootProps, option, key: 'style', renderIndex, realIndex: i }),
            tagAttrs: getOptionProp({ props: rootProps, option, key: 'tagAttrs', renderIndex, realIndex: i }),
            tagBefore: getOptionProp({ props: rootProps, option, key: 'tagBefore', renderIndex, realIndex: i }),
            close: getOptionProp({ props: rootProps, option, key: 'close', def: rootProps.type !== 'multiselect', renderIndex, realIndex: i }),
            tagAfter: getOptionProp({ props: rootProps, option, key: 'tagAfter', renderIndex, realIndex: i }),
            renderIndex, realIndex: i
        }
        if (types.isMultiple) {
            if (rootProps.value.indexOf(optionValue) !== -1) { obj.attrs = addToAttrs(obj.attrs, { className: 'active' }) }
        }
        else {
            if (optionValue === rootProps.value) { obj.attrs = addToAttrs(obj.attrs, { className: 'active' }) }
        }
        result.push(updateOptionByProperties(obj))
        renderIndex++;
    }
    return result;
}
function getOptionProp(p: { props: AI, option: AI_option, key: AI_optionKey, def?: any, preventFunction?: boolean, realIndex?: number, renderIndex?: number }) {
    let { props, option, key, def, preventFunction, realIndex, renderIndex } = p;
    let optionResult = typeof option[key] === 'function' && !preventFunction ? option[key]({ ...option, realIndex, renderIndex }, props) : option[key]
    if (optionResult !== undefined) { return optionResult }
    let prop = (props.option || {})[key];
    if (typeof prop === 'string') {
        try {
            let value;
            eval('value = ' + prop);
            return value;
        }
        catch { }
    }
    if (typeof prop === 'function' && !preventFunction) {
        let res = prop({ ...option, realIndex, renderIndex }, props);
        return res === undefined ? def : res;
    }
    return prop !== undefined ? prop : def;
}
