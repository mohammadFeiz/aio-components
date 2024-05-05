/////////////dependencies//////////////
import React, { createRef, useContext, createContext, useState, useEffect, useRef, FC,Fragment } from 'react';
import {
    mdiChevronDown, mdiLoading, mdiAttachment, mdiClose, mdiCircleMedium, mdiMagnify,
    mdiPlusThick, mdiImage, mdiEye, mdiEyeOff, mdiDownloadOutline, mdiDotsHorizontal,
    mdiChevronRight,mdiChevronLeft,mdiArrowDown, mdiArrowUp, mdiFileExcel, mdiSort,
    mdiDelete,mdiCrosshairsGps,mdiCircleSmall
} from "@mdi/js";
import {Icon} from '@mdi/react';
import $ from 'jquery';
import Axios from "axios";
////////////types//////////////////////
import {
    AI, AI_FormContext, AI_FormInput, AI_FormItem, AI_Options, AI_Popover_props, AI_context, AI_formItem, AI_indent, AI_option, AI_optionKey,
    AI_timeUnits, AI_time_unit, AI_type, AI_types, AV_item, AV_operator, AV_props, I_Calendar, I_Drag, I_FileItem, I_Layout,
    I_Multiselect, I_Tag, I_Tags, I_TimePopver, I_list_temp, type_time_value,
    AI_date_unit, I_DPArrow, I_DPCell, I_DPCellWeekday, I_DPContext, I_DPHeaderDropdown, I_DP_activeDate,
    AI_TableCellContent, AI_table_column, AI_table_paging, AI_table_param, AI_table_rows, AI_table_sort, I_TableGap, type_table_context, type_table_temp,
    AI_scale, AI_scales, I_RangeArc, I_RangeContext, I_RangeItem, I_RangeItems, I_RangeRect, I_RangeValue, I_RangeValueContainer,
    I_MapUnit, I_Map_config, I_Map_context, I_Map_coords, I_Map_marker, I_Map_temp, I_mapApiKeys
} from './types.tsx';
import { AP_modal } from '../aio-popup';
/////////////my dependencies//////////
import { Get2Digit,AIODate, GetClient, EventHandler, Swip, DragClass, I_Swip_parameter,AddToAttrs,Storage,ExportToExcel,I_Swip_mousePosition, getEventAttrs, svgArc,JSXToHTML } from './../aio-utils';
import AIOPopup from './../../npm/aio-popup/index.tsx';
/////////////style//////////////////
import './index.css';
////////////////////////////////////
const AICTX = createContext({} as any);
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
        let option = options.find((option) => value === undefined ? false : GetOptionProps({ props, option, key: 'value' }) === value);
        if (option === undefined) { return }
        return GetOptionProps({ props: props, option, key: 'text' })
    }
    function toggle(popover: any) {
        let open = !!popup.getModals().length
        if (!!popover === !!open) { return }
        setOpen(!!popover)
        if (popover) { popup.addModal(popover); }
        else {
            popup.removeModal();
            setTimeout(() => $(parentDom.current).focus(), 0)
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
            else if(type === 'tree'){/*do nothing*/}
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
        acardion: () => <Acardion options={GetOptions({ rootProps: props, types })} />,
        tree: () => <Tree />,
        list: () => <List />,
        range: () => <Layout properties={{text:<Range />}}/>,
        file: () => <File />,
        select: () => <Layout properties={{ text: props.text || getSelectText() }} />,
        button: () => <Layout />,
        multiselect: () => <Multiselect options={GetOptions({ rootProps: props, types })} />,
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
        if (obj.year !== undefined) { dateArray.push(Get2Digit(obj.year)) }
        if (obj.month !== undefined) { dateArray.push(Get2Digit(obj.month)) }
        if (obj.day !== undefined) { dateArray.push(Get2Digit(obj.day)) }
        if (dateArray.length) { text.push(dateArray.join('/')) }
        let timeArray = []
        if (obj.hour !== undefined) { timeArray.push(Get2Digit(obj.hour)) }
        if (obj.minute !== undefined) { timeArray.push(Get2Digit(obj.minute)) }
        if (obj.second !== undefined) { timeArray.push(Get2Digit(obj.second)) }
        if (timeArray.length) { text.push(timeArray.join(':')) }
        return text.join(' ');
    }
    function renderButton() {
        let { onChange, style, popover = {}, className } = rootProps;
        let attrs = AddToAttrs(Attrs, { className: ['aio-input-time', className], style: { ...style, direction: 'ltr' } })
        let text: string = getTimeText(value)
        let p: AI = {
            ...rootProps, text, attrs, type: 'button',
            popover: !onChange ? undefined : {
                position: 'center', ...popover, attrs: AddToAttrs(popover.attrs, { className: 'aio-input-time-popover' }),
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
            backdrop = { ...backdrop, attrs: AddToAttrs(backdrop.attrs, { className: 'aio-input-backdrop ' + id }) }
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
                attrs: AddToAttrs(popover.attrs, { className: `aio-input-popover aio-input-popover-${rtl ? 'rtl' : 'ltr'}` })
            }
            return config;
        }
    }
}
function TimePopover(props: I_TimePopver) {
    let { DATE,rootProps }: AI_context = useContext(AICTX)
    let {jalali} = rootProps;
    let { lang = 'fa', onChange, onClose } = props;
    let [startYear] = useState(props.value.year ? props.value.year - 10 : undefined);
    let [endYear] = useState(props.value.year ? props.value.year + 10 : undefined);
    let [value, setValue] = useState<type_time_value>({ ...props.value })
    function change(obj: { [key in AI_timeUnits]?: number }) {
        setValue({ ...value, ...obj })
    }
    function translate(key: AI_timeUnits | 'Submit') {
        return !!jalali ? { 'year': 'سال', 'month': 'ماه', 'day': 'روز', 'hour': 'ساعت', 'minute': 'دقیقه', 'second': 'ثانیه', 'Submit': 'ثبت' }[key] : key
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
    function layout(type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'): React.ReactNode {
        if (typeof value[type] !== 'number') { return null }
        let options = getTimeOptions(type);
        let p: AI = { type: 'list', value: value[type], options, size: 48, width: 72, onChange: (v) => change({ [type]: v }) }
        return (
            <div className="aio-input-time-popover-item">
                <div className="aio-input-time-popover-item-title">{translate(type)}</div>
                <AIOInput {...p} />
            </div>
        )
    }
    function submit() {
        if (onChange) { onChange(value); }
        onClose();
    }
    return (
        <div className='aio-input-time-popover-content'>
            <div className="aio-input-time-popover-body">
                {layout('year')} {layout('month')} {layout('day')} {layout('hour')} {layout('minute')} {layout('second')}
            </div>
            <div className="aio-input-time-popover-footer">
                <button onClick={submit}>{translate('Submit')}</button>
            </div>
        </div>
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
        let InputAttrs = AddToAttrs(inputAttrs, {
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
        let options: AI_option[] = GetOptions({ rootProps, types })
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
    let p = AddToAttrs(attrs, { className: ['aio-input-form', className], style })
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
            onChange: (value) => {
                setValue(value, formItem)
            }, 
            attrs: {}, inputAttrs: {}, disabled: false, point: (value) => { return { html: value } }
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
        let Attrs = AddToAttrs(props.attrs, { className: error ? 'has-error' : undefined })
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
    let options = props.options || GetOptions({ rootProps, types });
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
        if (type === 'tree') { 
            let size = rootProps.size || Def('tree-size');
            size = Math.round(size / 12) * 12;
            if(size < 24){size = 24}
            if(size > 120){size = 120}
            cls += ` aio-input-size-${size}` 
        }
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
        attrs = AddToAttrs(attrs, {
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
    function getToggleIcon(state:0|1|2) {
        if (toggle === undefined) { return null }
        let path;
        if(state === 2){path = mdiCircleSmall}
        else if(state === 1){path = mdiChevronDown}
        else {path = mdiChevronRight}
        return I(path, 1)
    }
    function Toggle(indent:AI_indent) {
        if (toggle === undefined) { return null }
        let state = toggle.state;
        return (<div className="aio-input-toggle" onClick={(e) => {e.stopPropagation(); toggle.onClick(e)}}>
            <div className='aio-input-toggle-icon'>{getToggleIcon(state)}</div>
            {
                state === 1 && 
                <svg className='aio-input-toggle-line aio-input-indent-line'>
                    <path d={`M${indent.size / 2} ${0} L${indent.size / 2} ${indent.height / 2 - 12} Z`}></path>
                </svg>
            }
        </div>)
    }
    function indentIcon(indent:AI_indent,order:number) {
        let {parentIndent,size,level,isLastChild,height} = indent;
        if (!level) { return false }
        let x0 = size / 2,x1 = size,y0 = 0,y1 = height / 2,y2 = height,pathes = [];
        if(order === level - 1){
            //horizontal line
            pathes.push(<path d={`M${x0} ${y1} L${x1} ${y1} Z`}></path>)
            //vertical direct line
            pathes.push(<path d={`M${x0} ${y0} L${x0} ${isLastChild ? y1 : y2} Z`}></path>)
        }
        else {
            //vertical connet line
            if(!parentIndent || !parentIndent.isLastChild){
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
    let { attrs = {}, size = 36, count = 3, editable = true, stop = 3, decay = 8, onChange = () => { } } = rootProps;
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
        return { height }
    }
    function getOptions() {
        temp.activeIndex = 0;
        return options.map((option: any, i: number) => {
            let value = GetOptionProps({ props: rootProps, option, key: 'value' });
            let text = GetOptionProps({ props: rootProps, option, key: 'text', def: '' });
            let style = GetOptionProps({ props: rootProps, option, key: 'style', def: {} });
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
    let { html } = (typeof body === 'function' ? body(value) : body) || {html:''}
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
    indent: number,
    size:number,
    change:(row:any,newRow:any)=>void
}
//should implement
//inlineEdit
//toggleIcon
type I_treeItem = {
    option: AI_option, row: any, parent?: any, parentId?: string,
    id: string, open: boolean, indent: AI_indent,parentOpen:boolean,
}
const TreeContext = createContext({} as any);
const Tree: FC = () => {
    let { rootProps, types }: AI_context = useContext(AICTX);
    let { onAdd, onRemove, value = [], onChange,size = Def('tree-size') } = rootProps;
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
    function change(row:any,newRow:any){
        for(let prop in newRow){row[prop] = newRow[prop];}
        if(rootProps.onChange){rootProps.onChange(rootProps.value)}
    }
    async function add(parent?: any) {
        let newRow: any;
        if (typeof onAdd === 'function') { newRow = await onAdd({ parent }) }
        else { newRow = onAdd }
        if (!newRow) { return }
        if (parent) { parent.childs = parent.childs || []; parent.childs.push(newRow); }
        else { value.push(newRow) }
        if(onChange){onChange(value);}
    }
    async function remove(row: any, parent: any) {
        let res: boolean;
        if (typeof onRemove === 'function') { res = await onRemove({ row, parent }) as boolean }
        else { res = true }
        if (!res) { return }
        if (!parent) {
            value = value.filter((o: any) => {
                let rowValue = GetOptionProps({ option: row, key: 'value', props: rootProps })
                let oValue = GetOptionProps({ option: o, key: 'value', props: rootProps })
                return rowValue !== oValue
            })
        }
        else {
            parent.childs = parent.childs.filter((o: any) => {
                let rowValue = GetOptionProps({ option: row, key: 'value', props: rootProps })
                let oValue = GetOptionProps({ option: o, key: 'value', props: rootProps })
                return rowValue !== oValue
            });
        }
        if(onChange){onChange(value)}
    }
    function getContext(): I_TreeContext { return { toggle, rootProps, mountedDic, openDic, add, remove, types, indent,size,change} }
    return (
        <TreeContext.Provider value={getContext()}>
            <div className="aio-input-tree"><TreeHeader /><TreeBody rows={value} level={0} /></div>
        </TreeContext.Provider>
    )
}
const TreeHeader: FC = () => {
    const { rootProps, add }: I_TreeContext = useContext(TreeContext);
    let { addText = 'add',onAdd } = rootProps;
    if(!onAdd){return null}
    addText = (typeof addText === 'function'?addText('header'):addText) || 'add';
    return (<div className="aio-input-tree-header"><button onClick={() => add()}>{I(mdiPlusThick, .8)}{addText}</button></div>)
}
type I_TreeActions = { row: any, parent?: any }
const TreeActions: FC<I_TreeActions> = (props) => {
    let { row, parent } = props;
    let { rootProps, add, remove }: I_TreeContext = useContext(TreeContext);
    let { onAdd, onRemove, removeText = 'Remove' } = rootProps;
    let addText:React.ReactNode = (typeof rootProps.addText === 'function'?rootProps.addText(row):rootProps.addText) || 'Add';
    let options = typeof rootProps.actions === 'function' ? rootProps.actions(row, parent) : rootProps.actions;
    function getOptions() {
        let res = [];
        if (onAdd) { res.push({ text: addText, value: 'add', before: I(mdiPlusThick, 0.7), onClick: () => add(row) }) }
        let Options = (options || []).map((o) => { return { ...o, onClick: () => { if (o.onClick) { o.onClick(row, parent) } } } })
        res = [...res, ...Options]
        if (onRemove) { res.push({ text: removeText, value: 'remove', before: I(mdiDelete, 0.7), onClick: () => remove(row, parent) }) }
        return res
    }
    let Options = getOptions();
    if (!Options.length) { return null }
    let p: AI = { type: 'select', caret: false,popover:{openRelatedTo:'.aio-input-tree'}, className: 'aio-input-tree-options-button', options: Options, text: I(mdiDotsHorizontal, 0.7) }
    return <AIOInput {...p} />;
}
type I_TreeBody = { rows: any[], level: number, parent?: any, parentId?: string,parentIndent?:AI_indent }
const TreeBody: FC<I_TreeBody> = (props) => {
    let { rootProps, types, openDic, mountedDic, indent,size,change }: I_TreeContext = useContext(TreeContext);
    let { rows, level, parent, parentId,parentIndent } = props;
    let options = GetOptions({
        rootProps, types, options: rows,level, 
        change:(row:any,newRow:any)=>change(row,newRow),
        properties: {
            after: (option: AI_option) => <TreeActions row={option.object} parent={parent} />
        }
    })
    let parentOpen = parentId === undefined ? true : !!openDic[parentId];
    let mounted = parentId == undefined ? true : mountedDic[parentId];
    return (
        <div className={`aio-input-tree-body${!parent ? ' aio-input-tree-root' : ''}${parentOpen ? ' open' : ''}${!mounted ? ' not-mounted' : ' mounted'}`}>
            {options.map((option: any, index: number) => {
                let row = rows[index];
                let id = option.value;
                let {childs = []} = row;
                let open = !!openDic[id];
                let item: I_treeItem = { 
                    row,option, parent, parentId, id, parentOpen,open,
                    indent: { height:size,level,childsLength:childs.length, size: indent,index,isLastChild:index === options.length - 1,isFirstChild:index === 0,parentIndent } 
                }
                let p = { className: `aio-input-tree-row` }
                return <div {...p}><TreeRow item={item} /><TreeChilds item={item} /></div>;
            })}
        </div>
    )
}
const TreeRow: FC<{ item: I_treeItem }> = (props) => {
    let { toggle, openDic }: I_TreeContext = useContext(TreeContext);
    let {item} = props;
    let { childs = [] } = item.row;
    let toggleState: (0 | 1 | 2) = !childs.length ? 2 : (!!openDic[item.id] ? 1 : 0);
    let p: I_Layout = { indent:item.indent, option:item.option, toggle: { state: toggleState, onClick: () => toggle(item.id) } };
    return <Layout {...p} />;
}
const TreeChilds: FC<{ item: I_treeItem }> = (props) => {
    let { row, id, open,indent } = props.item, { childs = [] } = row;
    if (!open || !childs || !childs.length) { return null }
    return <TreeBody rows={childs} level={indent.level + 1} parent={row} parentId={id} parentIndent={indent} />
}
const DPContext = createContext({} as any);
function Calendar(props: I_Calendar) {
    let { rootProps,DATE}: AI_context = useContext(AICTX);
    let { onClose } = props;
    let { unit = Def('date-unit'), jalali, value,disabled,size = Def('date-size'),theme = Def('theme'), translate = (text) => text,onChange = () => { }, changeClose } = rootProps;
    let [months] = useState(DATE.getMonths(jalali));
    let [today] = useState(DATE.getToday(jalali))
    let [todayWeekDay] = useState(DATE.getWeekDay(today).weekDay)
    let [initValue] = useState(getInitValue())
    function getInitValue() {
        let date = !value || value === null ? today : value;
        let [year, month, day] = DATE.convertToArray(date)
        return { year, month, day }
    }
    let [thisMonthString] = useState(months[today[1] - 1])
    let [activeDate, setActiveDate] = useState<I_DP_activeDate>({ ...initValue });
    let adRef = useRef(activeDate);
    adRef.current = activeDate
    function trans(text:string) {
        if (text === 'Today') {
            if (unit === 'month') { text = 'This Month' }
            else if (unit === 'hour') { text = 'This Hour' }
        }
        let obj:any = { 'Clear': 'حذف', 'This Hour': 'ساعت کنونی', 'Today': 'امروز', 'This Month': 'ماه جاری','Select Year':'انتخاب سال' }
        let res;
        if (jalali && obj[text]) { res = obj[text] }
        return translate(text)
    }
    function changeActiveDate(obj:'today' | {[key in 'year'|'month'|'day']?:number}) {
        let newActiveDate;
        if (obj === 'today') {
            let [year, month, day] = today;
            newActiveDate = { year, month, day: unit === 'month' ? 1 : day };
        }
        else { newActiveDate = { ...activeDate, ...obj } }
        setActiveDate(newActiveDate)
    }
    function getPopupStyle() {
        return {
            width: size, fontSize: size / 17, background: theme[1], color: theme[0], stroke: theme[0],
            cursor: disabled === true ? 'not-allowed' : undefined,
        };
    }
    function getContext() {
        let context: I_DPContext = {
            changeActiveDate,DATE,
            translate: trans, rootProps, activeDate:adRef.current,
            today, todayWeekDay, thisMonthString,months,
            onChange: (p:{ year?:number, month?:number, day?:number, hour?:number }) => {
                let { year = 1000, month = 1, day = 1, hour = 0 } = p;
                let dateArray = [year, month, day, hour];
                let jalaliDateArray = !jalali ? DATE.toJalali(dateArray) : dateArray;
                let gregorianDateArray = jalali ? DATE.toGregorian(dateArray) : dateArray;
                let { weekDay, index: weekDayIndex } = unit === 'month' ? { weekDay: null, index: null } : DATE.getWeekDay(dateArray)
                let get2digit = (v:number) => {
                    if (v === undefined) { return }
                    let vn:string = v.toString();
                    return vn.length === 1 ? `0${vn}` : vn
                }
                let dateString;
                let splitter = typeof value === 'string' ? DATE.getSplitter(value) : '/';
                if (unit === 'month') { dateString = `${year}${splitter}${get2digit(month)}` }
                else if (unit === 'day') { dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}` }
                else if (unit === 'hour') { dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}${splitter}${get2digit(hour)}` }
                let monthString = months[month - 1];
                let jalaliMonthString = !jalali ? DATE.getMonths(true)[month - 1] : monthString;
                let gregorianMonthString = jalali ? DATE.getMonths(false)[month - 1] : monthString;
                let props = {
                    months, jalaliDateArray, gregorianDateArray, dateArray, weekDay, weekDayIndex, dateString,
                    year, month, day, hour, monthString, jalaliMonthString, gregorianMonthString,
                }
                onChange(dateString, props);
                if (changeClose && onClose) { onClose() }
            }
        }
        return context
    }
    return (
        <DPContext.Provider value={getContext()}>
            <div className='aio-input-date-container' style={{ display: 'flex' }}>
                <div className='aio-input-date-calendar aio-input-date-theme-bg1 aio-input-date-theme-color0 aio-input-date-theme-stroke0' style={getPopupStyle()}>
                    <DPHeader /><DPBody /><DPFooter />
                </div>
                <DPToday />
            </div>
        </DPContext.Provider>
    );
}
function DPToday() {
    let { rootProps, translate, today, todayWeekDay, thisMonthString }: I_DPContext = useContext(DPContext);
    let { theme = Def('theme'), jalali, unit = Def('date-unit'), size = Def('date-size') } = rootProps;
    return (
        <div className='aio-input-date-today aio-input-date-theme-color1 aio-input-date-theme-bg0' style={{ width: size / 2, color: theme[1], background: theme[0] }}>
            <div style={{ fontSize: size / 13 }}>{translate('Today')}</div>
            {
                (unit === 'day' || unit === 'hour') &&
                <>
                    <div style={{ fontSize: size / 11 }}>{!jalali ? todayWeekDay.slice(0, 3) : todayWeekDay}</div>
                    <div style={{ fontSize: size / 12 * 4, height: size / 12 * 4 }}>{today[2]}</div>
                    <div style={{ fontSize: size / 11 }}>{!jalali ? thisMonthString.slice(0, 3) : thisMonthString}</div>
                </>
            }
            {unit === 'month' && <div style={{ fontSize: size / 8 }}>{!jalali ? thisMonthString.slice(0, 3) : thisMonthString}</div>}
            <div style={{ fontSize: size / 11 }}>{today[0]}</div>
            {unit === 'hour' && <div style={{ fontSize: size / 10 }}>{today[3] + ':00'}</div>}
        </div>
    )
}
function DPFooter() {
    let {rootProps, changeActiveDate, translate}:I_DPContext = useContext(DPContext);
    let { disabled, onChange = () => { }, size = Def('date-size'),deSelect } = rootProps;
    if (disabled) { return null }
    let buttonStyle = { padding: `${size / 20}px 0`,fontFamily:'inherit' };
    return (
        <div className='aio-input-date-footer' style={{ fontSize: size / 13 }}>
            {!!deSelect && <button style={buttonStyle} onClick={() => typeof deSelect === 'function'?deSelect():onChange(undefined)}>{translate('Clear')}</button>}
            <button style={buttonStyle} onClick={() => changeActiveDate('today')}>{translate('Today')}</button>
        </div>
    )
}
function DPBody() {
    let {rootProps, activeDate}:I_DPContext = useContext(DPContext);
    let { unit = Def('date-unit'),jalali,size = Def('date-size') } = rootProps;
    function getStyle() {
        var columnCount = { hour: 4, day: 7, month: 3,year:1 }[unit as AI_date_unit];
        var rowCount = { hour: 6, day: 7, month: 4,year:1 }[unit as AI_date_unit];
        var padding = size / 18, fontSize = size / 15, a = (size - padding * 2) / columnCount;
        var rowHeight = { hour: size / 7, day: a, month: size / 6, year: size / 7 }[unit as AI_date_unit];
        var gridTemplateColumns = '', gridTemplateRows = '';
        for (let i = 1; i <= columnCount; i++) { gridTemplateColumns += a + 'px' + (i !== columnCount ? ' ' : '') }
        for (let i = 1; i <= rowCount; i++) { gridTemplateRows += (rowHeight) + 'px' + (i !== rowCount ? ' ' : '') }
        let direction:'ltr'|'rtl' = !jalali ? 'ltr' : 'rtl';
        return { gridTemplateColumns, gridTemplateRows, direction, padding, fontSize }
    }
    return (
        <div className='aio-input-date-body' style={getStyle()}>
            {unit === 'hour' && new Array(24).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year as number, activeDate.month as number, activeDate.day as number, i]} />)}
            {unit === 'day' && <DPBodyDay />}
            {unit === 'month' && new Array(12).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year as number, i + 1]} />)}
        </div>
    )
}
function DPBodyDay() {
    let {rootProps, activeDate,DATE}:I_DPContext = useContext(DPContext);
    let { theme = Def('theme'), jalali } = rootProps;
    let firstDayWeekDayIndex = DATE.getWeekDay([activeDate.year as number, activeDate.month as number, 1]).index;
    let daysLength = DATE.getMonthDaysLength([activeDate.year as number, activeDate.month as number]);
    let weekDays = DATE.getWeekDays(jalali);
    return (<>
        {weekDays.map((weekDay, i) => <DPCellWeekday key={'weekday' + i} weekDay={weekDay} />)}
        {new Array(firstDayWeekDayIndex).fill(0).map((o, i) => <div key={'space' + i} className='aio-input-date-space aio-input-date-cell aio-input-date-theme-bg1' style={{ background: theme[1] }}></div>)}
        {new Array(daysLength).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year || 0, activeDate.month || 0, i + 1]} />)}
        {new Array(42 - (firstDayWeekDayIndex + daysLength)).fill(0).map((o, i) => <div key={'endspace' + i} className='aio-input-date-space aio-input-date-cell aio-input-date-theme-bg1' style={{ background: theme[1] }}></div>)}
    </>)
}
function DPCellWeekday(props:I_DPCellWeekday) {
    let {rootProps, translate}:I_DPContext = useContext(DPContext);
    let { theme = Def('theme'), jalali } = rootProps;
    let { weekDay } = props;
    return (
        <div className='aio-input-date-weekday aio-input-date-cell aio-input-date-theme-bg1 aio-input-date-theme-color0' style={{ background: theme[1], color: theme[0] }}>
            <span>{translate(weekDay.slice(0, !jalali ? 2 : 1))}</span>
        </div>
    )
}
function DPCell(props:I_DPCell) {
    let {rootProps, translate, onChange,DATE}:I_DPContext = useContext(DPContext);
    let { disabled, dateAttrs, theme = Def('theme'), value, jalali, unit = Def('date-unit')} = rootProps;
    let { dateArray } = props;
    function getClassName(isActive:boolean, isToday:boolean, isDisabled:boolean, className?:string) {
        var str = 'aio-input-date-cell';
        if (isDisabled) { str += ' aio-input-date-disabled' }
        if (isActive) { str += ' aio-input-date-active aio-input-date-theme-bg0 aio-input-date-theme-color1'; }
        if (isToday) { str += ' today aio-input-date-theme-border0'; }
        if (className) { str += ' className'; }
        return str;
    }
    let isActive = !value ? false : DATE.isEqual(dateArray, value);
    let isToday = DATE.isEqual(dateArray, DATE.getToday(jalali))
    let isDateDisabled = !Array.isArray(disabled) ? false : DATE.isMatch(dateArray, disabled);
    let isDisabled = disabled === true || isDateDisabled;
    let Attrs:any = {}
    if (dateAttrs) { 
        Attrs = dateAttrs({ dateArray, isToday, isDisabled, isActive, isMatch: (o) => DATE.isMatch(dateArray, o) })
        Attrs = Attrs || {} 
    }
    let className = getClassName(isActive, isToday, isDisabled, Attrs.className);
    let onClick = isDisabled ? undefined : () => { onChange({ year: dateArray[0], month: dateArray[1], day: dateArray[2], hour: dateArray[3] }) };
    let style:any = {}
    if (!isDisabled) { style.background = theme[1]; }
    if (className.indexOf('aio-input-date-active') !== -1) {
        style.background = theme[0];
        style.color = theme[1];
    }
    if (className.indexOf('today') !== -1) { style.border = `1px solid ${theme[0]}` }
    style = { ...style, ...Attrs.style }
    let text;
    if (unit === 'hour') { text = dateArray[3] + ':00' }
    else if (unit === 'day') { text = dateArray[2] }
    else if (unit === 'month') {
        let months = DATE.getMonths(jalali);
        text = translate(!jalali ? months[dateArray[1] - 1].slice(0, 3) : months[dateArray[1] - 1])
    }
    return <div style={style} onClick={onClick} className={className}>{isDisabled ? <del>{text}</del> : text}</div>
}
function DPHeaderItem(props:{unit:'year'|'month'}){
    let {unit} = props;
    let {rootProps,activeDate,months}:I_DPContext = useContext(DPContext);
    let {theme = Def('theme')} = rootProps;
    if(!activeDate || !activeDate[unit]){return null}
    let text = unit === 'year'?activeDate.year:months[(activeDate[unit] as number) - 1]
    let POPUP = unit === 'year'?DPYearsPopup:DPMonthsPopup;
    let p:AI = {
        type:'button',text,justify:true,caret:false,
        attrs: { className: 'aio-input-date-dropdown' },
        popover:{
            fitTo:'.aio-input-date-calendar aio-input-date-theme-bg1 aio-input-date-theme-color0',
            attrs:{style:{background: theme[1], color: theme[0]}},
            body:{
                render:({close})=><POPUP onClose={close}/>
            }
        }
    }
    return (<AIOInput {...p}/>)
}
function DPYearsPopup(props:{onClose:()=>void}){
    let {onClose} = props;
    let { rootProps,translate,activeDate,changeActiveDate }: I_DPContext = useContext(DPContext);
    let { jalali,size = Def('date-size'),theme = Def('theme') } = rootProps;
    let [start, setStart] = useState<number>(Math.floor((activeDate.year as number) / 10) * 10);
    let [value,setValue] = useState<number>(activeDate.year as number);
    useEffect(()=>{setValue(activeDate.year as number)},[activeDate.year])
    function changePage(dir:1 | -1) {
        let newStart = start + (dir * 10)
        setStart(newStart);
    }
    function changeValue(v:number){
        setValue(v);
        changeActiveDate({year:v});
        onClose();
    }
    function getCells(start:number) {
        let cells = [];
        for (let i = start; i < start + 10; i++) {
            let active = i === value;
            let className = 'aio-input-date-cell'
            if(active){className += ' aio-input-date-active aio-input-date-theme-bg0 aio-input-date-theme-color1'}
            else {className += ' aio-input-date-theme-bg1 aio-input-date-theme-color0'}
            let p = {style:active?{background:theme[0],color:theme[1]}:{background:theme[1],color:theme[0]},className,onClick:() => changeValue(i)}
            cells.push(<div {...p} key={i}>{i}</div>)
        }
        return cells
    }
    function getBodyStyle() {
        var columnCount = 3;
        var rowCount = 4;
        var padding = size / 18, fontSize = size / 15, a = (size - padding * 2) / columnCount;
        var rowHeight = size / 6;
        var gridTemplateColumns = '', gridTemplateRows = '';
        for (let i = 1; i <= columnCount; i++) { gridTemplateColumns += a + 'px' + (i !== columnCount ? ' ' : '') }
        for (let i = 1; i <= rowCount; i++) { gridTemplateRows += (rowHeight) + 'px' + (i !== rowCount ? ' ' : '') }
        let direction:'ltr'|'rtl' = !jalali ? 'ltr' : 'rtl';
        return { gridTemplateColumns, gridTemplateRows, direction, padding, fontSize }
    }
    return (
        <div className='aio-input-date-years'>
            <div className='aio-input-date-years-header'>
                <DPArrow type='minus' onClick={() => changePage(-1)} />
                <div className='aio-input-date-years-label' style={{fontSize:size / 15}}>{translate('Select Year')}</div>
                <DPArrow type='plus' onClick={() => changePage(1)} />
            </div>
            <div style={getBodyStyle()} className='aio-input-date-years-body'>{getCells(start)}</div>
        </div>
    )
}
function DPMonthsPopup(props:{onClose:()=>void}){
    let {onClose} = props; 
    let { rootProps,DATE,changeActiveDate,activeDate }: I_DPContext = useContext(DPContext);
    let { jalali,size = Def('date-size'),theme = Def('theme') } = rootProps;
    let [months] = useState<string[]>(DATE.getMonths(jalali));
    let month = activeDate.month;
    function changeValue(v:number){
        changeActiveDate({month:v});
        onClose()
    }
    function getCells() {
        let cells = [];
        for (let i = 1; i <= 12; i++) {
            let active = i === month;
            let className = 'aio-input-date-cell'
            if(active){className += ' aio-input-date-active aio-input-date-theme-bg0 aio-input-date-theme-color1'}
            else {className += ' aio-input-date-theme-bg1 aio-input-date-theme-color0'}
            let p = {style:active?{background:theme[0],color:theme[1]}:{background:theme[1],color:theme[0]},className,onClick:() => changeValue(i)}
            cells.push(<div {...p} key={i}>{months[i - 1].slice(0,3)}</div>)
        }
        return cells
    }
    function getBodyStyle() {
        var columnCount = 3;
        var rowCount = 4;
        var padding = size / 18, fontSize = size / 15, a = (size - padding * 2) / columnCount;
        var rowHeight = size / 6;
        var gridTemplateColumns = '', gridTemplateRows = '';
        for (let i = 1; i <= columnCount; i++) { gridTemplateColumns += a + 'px' + (i !== columnCount ? ' ' : '') }
        for (let i = 1; i <= rowCount; i++) { gridTemplateRows += (rowHeight) + 'px' + (i !== rowCount ? ' ' : '') }
        let direction:'ltr'|'rtl' = !jalali ? 'ltr' : 'rtl';
        return { gridTemplateColumns, gridTemplateRows, direction, padding, fontSize }
    }
    return (
        <div className='aio-input-date-months'>
            <div style={getBodyStyle()} className='aio-input-date-years-body'>{getCells()}</div>
        </div>
    )
}
function DPHeader() {
    let { rootProps,activeDate, changeActiveDate,DATE }: I_DPContext = useContext(DPContext);
    let { size = Def('date-size'), unit = Def('date-unit') } = rootProps;
    function getDays():React.ReactNode {
        if(!activeDate || !activeDate.year || !activeDate.month){return null}
        let daysLength = DATE.getMonthDaysLength([activeDate.year, activeDate.month]);
        let options = new Array(daysLength).fill(0).map((o, i) => { return { text: (i + 1).toString(), value: i + 1 } })
        let p:I_DPHeaderDropdown = { value: activeDate.day, options, onChange: (day) => changeActiveDate({ day }) }
        return <DPHeaderDropdown {...p} />
    }
    return (
        <div className='aio-input-date-header' style={{ height: size / 4 }}>
            <DPArrow type='minus' />
            <div className='aio-input-date-select' style={{ fontSize: Math.floor(size / 12) }}>
                <DPHeaderItem unit='year'/>
                {unit !== 'month' ? <DPHeaderItem unit='month'/> : null}
                {unit === 'hour' ? getDays() : null}
            </div>
            <DPArrow type='plus' />
        </div>
    )
}
function DPHeaderDropdown(props: I_DPHeaderDropdown) {
    let { rootProps }: I_DPContext = useContext(DPContext);
    let { value, options, onChange } = props;
    let { size = Def('date-size'), theme = Def('theme') } = rootProps;
    let p: AI = {
        value, options, onChange, caret: false, type: 'select',
        attrs: { className: 'aio-input-date-dropdown aio-input-date-theme-bg1 aio-input-date-theme-color0' },
        option:{style:()=>{return { height: size / 6, background: theme[1], color: theme[0] }} },
    }
    return (<AIOInput {...p} />)
}
function DPArrow(props: I_DPArrow) {
    let { rootProps, changeActiveDate, activeDate,DATE }: I_DPContext = useContext(DPContext);
    let { type, onClick } = props;
    let { jalali, unit = Def('date-unit'), size = Def('date-size'), theme = Def('theme') } = rootProps;
    function change() {
        if (onClick) { onClick(); return }
        let offset = (!jalali ? 1 : -1) * (type === 'minus' ? -1 : 1);
        let date = [activeDate.year as number, activeDate.month as number, activeDate.day as number]
        if (unit === 'month') { changeActiveDate({ year: (activeDate.year as number) + offset }) }
        if (unit === 'day') { 
            let next = DATE.getNextTime(date,offset * 24 * 60 * 60 * 1000,jalali);
            changeActiveDate({ year: next[0], month: next[1] }) 
        }
        if (unit === 'hour') { 
            let next = DATE.getNextTime(date,offset * 60 * 60 * 1000,jalali);
            changeActiveDate({ year: next[0], month: next[1], day: next[2] }) 
        }
    }
    function getIcon() {return I(type === 'minus' ? mdiChevronLeft : mdiChevronRight,1,{style:{ color: theme[0] },className:'aio-input-date-theme-color0'})}
    return (<div className='aio-input-date-arrow' style={{ width: size / 6, height: size / 6 }} onClick={() => change()}>{getIcon()}</div>)
}
const AITableContext = createContext({} as any);
function Table() {
    let { rootProps,DATE }: AI_context = useContext(AICTX);
    let { paging, getValue = {}, value, onChange = () => { }, onAdd, onRemove, excel, onSwap, onSearch, rowAttrs,onChangeSort,className,style } = rootProps;
    let [dom] = useState(createRef())
    let [searchValue, setSearchValue] = useState<string>('')
    let [columns, setColumns] = useState<AI_table_column[]>([]);
    let [searchColumns, setSearchColumns] = useState<AI_table_column[]>([]);
    let [excelColumns, setExcelColumns] = useState<AI_table_column[]>([]);
    let [temp] = useState<type_table_temp>({})
    let [DragRows] = useState<I_Drag | false>(!onSwap?false:new DragClass({
        onChange:(newRows,from,to)=>{
            if (typeof onSwap === 'function') { onSwap(newRows, from, to) }
            else { onChange(newRows) }
        },
        className:'aio-input-table-row',
    }))
    let [sorts, setSorts] = useState<AI_table_sort[]>([])
    function getColumns() {
        let {columns = []} = rootProps;
        columns = typeof columns === 'function'?columns():columns;
        let searchColumns:AI_table_column[] = [], excelColumns:AI_table_column[] = [];
        let updatedColumns = columns.map((o) => {
            let { id = 'aitc' + Math.round(Math.random() * 1000000), sort, search, excel } = o;
            let column = { ...o, _id: id };
            if (search) { searchColumns.push(column) }
            if (excel) { excelColumns.push(column) }
            return column
        })
        setColumns(updatedColumns);
        setSearchColumns(searchColumns)
        setExcelColumns(excelColumns);
        return updatedColumns;
    }
    function getSorts(columns:AI_table_column[]) {
        let sorts = [];
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            let { _id, input } = column;
            let sort = column.sort === true ? {} : column.sort;
            if (!sort) { continue }
            let { active = false, dir = 'dec' } = sort as AI_table_sort;
            let getValue;
            if (sort.getValue) { getValue = sort.getValue }
            else {
                getValue = (row:any) => {
                    let value = getDynamics({ value: column.value, row, column })
                    if (input && input.type === 'date') { value = DATE.getTime(value); }
                    return value
                }
            }
            let type:'string' | 'number' | 'date';
            if (input && ['number', 'date', 'range'].indexOf(input.type) !== -1) { type = 'number' }
            else { type = sort.type || 'string' }
            let sortItem: AI_table_sort = { dir, title: sort.title || column.title, sortId: _id, active, type, getValue }
            sorts.push(sortItem)
        }
        setSorts(sorts);
    }
    function getDynamics(p: { value: any, row?: any, column?: AI_table_column, def?: any, rowIndex?: number }) {
        let { value, row, column, def, rowIndex } = p;
        if (paging) {
            let { number, size } = paging;
            if(rowIndex)rowIndex += ((number - 1) * size) 
        }
        let type = typeof value;
        if (type === 'string') {
            let result = value;
            let param:AI_table_param = { row, column:column as AI_table_column, rowIndex:rowIndex as number }
            if (getValue[value]) { result = getValue[value](param) }
            else if (value.indexOf('row.') !== -1) { try { eval(`result = ${value}`); } catch { result = '' } }
            return result === undefined ? def : result;
        }
        if (type === 'undefined') { return def }
        if (type === 'function') { return value({ row, column, rowIndex }) }
        return value === undefined ? def : value
    }
    useEffect(() => {
        let columns:AI_table_column[] = getColumns();
        getSorts(columns);
    }, [])
    function add() {typeof onAdd === 'function'?onAdd():onChange([{...onAdd}, ...value])}
    function remove(row:any, index:number) {
        let action = () => onChange(value.filter((o:any) => o._id !== row._id));
        typeof onRemove === 'function'?onRemove({ row, action, rowIndex: index }):action();
    }
    function exportToExcel() {
        let list = [];
        for (let i = 0; i < value.length; i++) {
            let row = value[i], json:any = {};
            for (let j = 0; j < excelColumns.length; j++) {
                let column = excelColumns[j], { excel, value } = column;
                if(typeof excel !== 'string'){continue}
                json[excel] = getDynamics({ value, row, column, rowIndex: i })
            }
            list.push(json)
        }
        ExportToExcel(list, { promptText: typeof excel === 'string' ? excel : 'Inter Excel File Name' })
    }
    function getSearchedRows(rows:{[key:string]:any}[]) {
        if (onSearch !== true) { return rows }
        if (!searchColumns.length || !searchValue) { return rows }
        return AIOInputSearch(rows, searchValue, (row, index) => {
            let str = '';
            for (let i = 0; i < searchColumns.length; i++) {
                let column = searchColumns[i];
                let value = getDynamics({ value: column.value, row, def: '', column, rowIndex: index });
                if (value) { str += value + ' ' }
            }
            return str
        })
    }
    function sortRows(rows:{[key:string]:any}[], sorts:AI_table_sort[]) {
        if(!rows){return []}
        if (!sorts || !sorts.length) { return rows }
        return rows.sort((a, b) => {
            for (let i = 0; i < sorts.length; i++) {
                let { dir, getValue } = sorts[i];
                if(!getValue){return 0}
                let aValue = getValue(a), bValue = getValue(b);
                if (aValue < bValue) { return -1 * (dir === 'dec' ? -1 : 1); }
                if (aValue > bValue) { return 1 * (dir === 'dec' ? -1 : 1); }
                if (i === sorts.length - 1) { return 0; }
            }
            return 0;
        });
    }
    function getSortedRows(rows:{[key:string]:any}[]) {
        if (temp.isInitSortExecuted) { return rows }
        if (onChangeSort) { return rows }
        let activeSorts = sorts.filter((sort) => sort.active !== false);
        if (!activeSorts.length || !rows.length) { return rows }
        temp.isInitSortExecuted = true; 
        let sortedRows = sortRows(rows, activeSorts);
        onChange(sortedRows);
        return sortedRows;  
    }
    function getRows():AI_table_rows {
        let searchedRows = getSearchedRows(value);
        let sortedRows = getSortedRows(searchedRows);
        let pagedRows = paging && !paging.serverSide ? sortedRows.slice((paging.number - 1) * paging.size, paging.number * paging.size) : sortedRows;
        return { rows: value, searchedRows, sortedRows, pagedRows }
    }
    //calculate style of cells and title cells
    function getCellStyle(column:AI_table_column) {
        let width = getDynamics({ value: column.width });
        let minWidth = getDynamics({ value: column.minWidth });
        return { width: width ? width : undefined, flex: width ? undefined : 1, minWidth }
    }
    function getCellAttrs(p:{ row:any, rowIndex:number, column:AI_table_column, type:'title'|'cell' }) {
        let { row, rowIndex, column, type } = p;
        let {cellAttrs,titleAttrs} = column;
        let attrs = getDynamics({ value: type === 'title'?titleAttrs:cellAttrs, column, def: {}, row, rowIndex });
        let justify = getDynamics({ value: column.justify, def: false });
        let cls = `aio-input-table-${type}` + (justify ? ` aio-input-table-${type}-justify` : '')
        attrs = AddToAttrs(attrs, { className: cls, style: getCellStyle(column) });
        if (type === 'title') { attrs.title = getDynamics({ value: column.title, def: '' }) }
        return { ...attrs }
    }
    function getRowAttrs(row:any, rowIndex:number) {
        let attrs = rowAttrs ? rowAttrs({ row, rowIndex }) : {};
        let obj = AddToAttrs(attrs, { className: 'aio-input-table-row' })
        if (DragRows !== false) { obj = { ...obj, ...DragRows.getAttrs(value,rowIndex) } }
        return obj;
    }
    function search(searchValue:string) {
        if(onSearch === true) { setSearchValue(searchValue) }
        else if(typeof onSearch === 'function'){ onSearch(searchValue) }
    }
    function getContext(ROWS:AI_table_rows) {
        let context: type_table_context = {
            ROWS, rootProps, columns, sorts, setSorts, sortRows, excelColumns, getCellAttrs, getRowAttrs,
            add, remove, search, exportToExcel,getDynamics
        }
        return context
    }
    let ROWS:AI_table_rows = getRows();
    let attrs = AddToAttrs(rootProps.attrs,{className:['aio-input aio-input-table',className],style:rootProps.style,attrs:{ref:dom}})
    return (
        <AITableContext.Provider value={getContext(ROWS)}>
            <div {...attrs}>
                <TableToolbar />
                <div className='aio-input-table-unit'><TableHeader /><TableRows /></div>
                {paging ? <TablePaging /> : ''}
            </div>
        </AITableContext.Provider>
    )
}
function TableGap(props:I_TableGap) {
    let { rootProps }: type_table_context = useContext(AITableContext)
    let { rowGap, columnGap } = rootProps;
    let { dir } = props;
    let style;
    if (dir === 'h') { style = { height: rowGap } }
    else { style = { width: columnGap } }
    return <div className={`aio-input-table-border-${dir}`} style={style}></div>
}
function TablePaging() {
    let { ROWS, rootProps }: type_table_context = useContext(AITableContext)
    let [temp] = useState<{ timeout: any,start:any,end:any,pages:any }>({timeout:undefined,start:undefined,end:undefined,pages:0})
    function fix(paging: AI_table_paging):AI_table_paging {
        if(typeof rootProps.onChangePaging !== 'function'){
            alert('aio-input error => in type table you set paging but forget to set onChangePaging function prop to aio input')
            return {number:0,size:0};
        }
        let { number, size = 20, length = 0, sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100], serverSide } = paging
        if (!serverSide) { length = ROWS.sortedRows.length }
        if (sizes.indexOf(size) === -1) { size = sizes[0] }
        let pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        let start = number - 3,end = number + 3;
        temp.start = start; temp.end = end; temp.pages = pages;
        return { ...paging, length, number, size, sizes }
    }
    let [paging, setPaging] = useState<AI_table_paging>(fix(rootProps.paging || {size:0,number:0}));
    useEffect(() => {
        if(rootProps.paging){setPaging(fix(rootProps.paging))}
    }, [(rootProps.paging || {size:0,number:0,length:0}).size,(rootProps.paging || {size:0,number:0,length:0}).number,(rootProps.paging || {size:0,number:0,length:0}).length])
    function changePaging(obj:{[key in keyof AI_table_paging]?:any}) {
        let newPaging:AI_table_paging = fix({ ...paging, ...obj });
        setPaging(newPaging);
        if(rootProps.onChangePaging){
            if (newPaging.serverSide) {
                clearTimeout(temp.timeout);
                temp.timeout = setTimeout(() => {
                    //be khatere fahme payine typescript majbooram dobare in shart ro bezanam
                    if(rootProps.onChangePaging){rootProps.onChangePaging(newPaging)}
                }, 800);
            }
            else { rootProps.onChangePaging(newPaging) }
        }
    }
    let { number, size, sizes } = paging;
    let buttons = [];
    let isFirst = true
    for (let i = temp.start; i <= temp.end; i++) {
        if (i < 1 || i > temp.pages) {
            buttons.push(<button key={i} className={'aio-input-table-paging-button aio-input-table-paging-button-hidden'}>{i}</button>)
        }
        else {
            let index;
            if (isFirst) { index = 1; isFirst = false; }
            else if (i === Math.min(temp.end, temp.pages)) { index = temp.pages }
            else { index = i; }
            buttons.push(<button key={index} className={'aio-input-table-paging-button' + (index === number ? ' active' : '')} onClick={() => changePaging({ number: index })}>{index}</button>)
        }
    }
    function changeSizeButton() {
        if (!sizes || !sizes.length) { return null }
        let p: AI = {
            attrs: { className: 'aio-input-table-paging-button aio-input-table-paging-size' },
            type: 'select', value: size, options: sizes, option:{text:'option',value:'option'},
            onChange: (value) => changePaging({ size: value }),
            popover: { fitHorizontal: true},
        }
        return (<AIOInput {...p} />)
    }
    return (
        <div className='aio-input-table-paging'>
            {buttons}
            {changeSizeButton()}
        </div>
    )
}
function TableRows() {
    let { ROWS, rootProps }: type_table_context = useContext(AITableContext)
    let { rowTemplate, rowAfter = () => null, rowBefore = () => null, rowsTemplate, placeholder = 'there is not any items' } = rootProps;
    let rows = ROWS.pagedRows || [];
    let content;
    if (rowsTemplate) { content = rowsTemplate(rows) }
    else if (rows.length) {
        content = rows.map((o, i) => {
            let { id = 'ailr' + Math.round(Math.random() * 10000000) } = o;
            o._id = o._id === undefined ? id : o._id;
            let isLast = i === rows.length - 1, Row;
            if (rowTemplate) { Row = rowTemplate({ row: o, rowIndex: i, isLast }) }
            else { Row = <TableRow key={o._id} row={o} rowIndex={i} isLast={isLast} /> }
            return (<Fragment key={o._id}>{rowBefore({ row: o, rowIndex: i })}{Row}{rowAfter({ row: o, rowIndex: i })}</Fragment>)
        })
    }
    else if (placeholder) {
        content = <div style={{ width: '100%', textAlign: 'center', padding: 12, boxSizing: 'border-box' }}>{placeholder}</div>
    }
    else {return null}
    return <div className='aio-input-table-rows'>{content}</div>
}
function TableToolbar() {
    let { add, exportToExcel, sorts, sortRows, setSorts, search, rootProps, excelColumns }: type_table_context = useContext(AITableContext);
    let { toolbarAttrs, toolbar, onAdd, onSearch, onChangeSort, onChange = () => { }, value,addText } = rootProps;
    toolbarAttrs = AddToAttrs(toolbarAttrs, { className: 'aio-input-table-toolbar' })
    if (!onAdd && !toolbar && !onSearch && !sorts.length && !excelColumns.length) { return null }
    function changeSort(sortId:string, changeObject:any) {
        let newSorts = sorts.map((sort) => {
            if (sort.sortId === sortId) {
                let newSort = { ...sort, ...changeObject }
                return newSort;
            }
            return sort
        });
        changeSorts(newSorts)
    }
    async function changeSorts(sorts:AI_table_sort[]) {
        if (onChangeSort) {
            let res = await onChangeSort(sorts)
            if (res !== false) { setSorts(sorts); }
        }
        else {
            setSorts(sorts);
            let activeSorts = sorts.filter((sort) => sort.active !== false);
            if (activeSorts.length) {
                onChange(sortRows(value, activeSorts))
            }
        }
    }

    function button() {
        if (!sorts.length) { return null }
        let p:AI = {
            popover:{ 
                header: { 
                    attrs: { className: 'aio-input-table-toolbar-popover-header' }, 
                    title: 'Sort', 
                    onClose: false 
                }, 
                pageSelector: '.aio-input-table'
            },
            caret:false,type:'select',options:sorts,
            option:{
                text:'option.title',
                checked:'!!option.active',
                close:()=>false,
                value:'option.sortId',
                after:(option:any)=>{
                    let {dir = 'dec',sortId} = option;
                    return (
                        <div onClick={(e) => { e.stopPropagation(); changeSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' }) }}>
                            {I(dir === 'dec' ? mdiArrowDown : mdiArrowUp,0.8)}
                        </div>
                    )
                }
            },
            attrs:{ className: 'aio-input-table-toolbar-button' },
            text:I(mdiSort,0.7),
            onSwap:(newSorts,from,to) => changeSorts(newSorts),
            onChange:(value, option) => changeSort(value, { active: !option.checked })
        }
        return (
            <AIOInput {...p} key='sortbutton'/>
        )
    }
    function getAddText(){
        let {addText} = rootProps;
        if(!rootProps.addText){return I(mdiPlusThick,0.8)}
        if(typeof addText === 'function'){
            return addText(value)
        }
        return addText
    }
    return (
        <>
            <div {...toolbarAttrs}>
                {toolbar && <div className='aio-input-table-toolbar-content'>{typeof toolbar === 'function' ? toolbar() : toolbar}</div>}
                <div className='aio-input-table-search'>
                    {!!onSearch && <AIOInput type='text' onChange={(value) => search(value)} after={I(mdiMagnify,0.7)} />}
                </div>
                {button()}
                {!!excelColumns.length && <div className='aio-input-table-toolbar-button' onClick={() => exportToExcel()}>{I(mdiFileExcel,0.8)}</div>}
                {!!onAdd && <div className='aio-input-table-toolbar-button' onClick={() => add()}>{getAddText()}</div>}
            </div>
            <TableGap dir='h' />
        </>
    )
}
function TableHeader() {
    let { rootProps, columns }: type_table_context = useContext(AITableContext);
    let { headerAttrs, onRemove } = rootProps;
    headerAttrs = AddToAttrs(headerAttrs, { className: 'aio-input-table-header' })
    let Titles = columns.map((o, i) => <TableTitle key={o._id} column={o} isLast={i === columns.length - 1} />);
    let RemoveTitle = !onRemove ? null : <><TableGap dir='v' /><div className='aio-input-table-remove-title'></div></>;
    return <div {...headerAttrs}>{Titles}{RemoveTitle}<TableGap dir='h' /></div>
}
function TableTitle(p:{ column:AI_table_column, isLast:boolean }) {
    let { column, isLast } = p;
    let { getCellAttrs } = useContext(AITableContext);
    let attrs = getCellAttrs({ column, type: 'title' });
    return (<><div {...attrs}>{attrs.title}</div>{!isLast && <TableGap dir='v' />}</>)
}
function TableRow(p:{ row:any, isLast:boolean, rowIndex:number }) {
    let { row, isLast, rowIndex } = p;
    let { remove, rootProps, columns, getRowAttrs }: type_table_context = useContext(AITableContext);
    function getCells() {
        return columns.map((column, i) => {
            let key = row._id + ' ' + column._id;
            let isLast = i === columns.length - 1;
            return (<TableCell isLast={isLast} key={key} row={row} rowIndex={rowIndex} column={column} />)
        })
    }
    let { onRemove } = rootProps;
    return (
        <>
            <div key={row._id} {...getRowAttrs(row, rowIndex)}>
                {getCells()}
                {onRemove ? <><TableGap dir='v' /><button className='aio-input-table-remove' onClick={() => remove(row, rowIndex)}>{I(mdiClose,0.8)}</button></> : null}
            </div>
            <TableGap dir='h' />
        </>
    )
}
const TableCell = (p:{ row:any, rowIndex:number, column:AI_table_column, isLast:boolean }) => {
    let { row, rowIndex, column, isLast } = p;
    let { getCellAttrs,rootProps,getDynamics }: type_table_context = useContext(AITableContext);
    let {onChange = ()=>{},value = []} = rootProps;
    function setCell(row: any, column: AI_table_column, cellNewValue: any) {
        if (column.input && column.input.onChange) { 
            column.input.onChange({ value: cellNewValue, row, column }) 
        }
        else {
            row = JSON.parse(JSON.stringify(row));
            eval(`${column.value} = cellNewValue`);
            onChange(value.map((o:any) => o._id !== row._id ? o : row))
        }
    }
    let contentProps:AI_TableCellContent = { row, rowIndex, column,onChange:column.input?(value)=>setCell(row, column, value):undefined };
    let key = row._id + ' ' + column._id;
    return (
        <Fragment key={key}>
            <div {...getCellAttrs({ row, rowIndex, column, type: 'cell' })} >
                <TableCellContent {...contentProps} key={key}/>
            </div>
            {!isLast && <TableGap dir='v' />}
        </Fragment>
    )
}
function TableCellContent(props:AI_TableCellContent){
    let {row,column,rowIndex,onChange} = props;
    let { getDynamics }: type_table_context = useContext(AITableContext);
    let template = getDynamics({ value: column.template, row, rowIndex, column });
    if (template !== undefined) { return template }
    let input:AI = getDynamics({ value: column.input, row, rowIndex, column });
    let value = getDynamics({ value: column.value, row, rowIndex, column })
    if (!input) { return value }
    //justify baraye input ast amma agar rooye column set shode va input set nashode be input bede
    input.justify = input.justify || getDynamics({ value: column.justify, row, rowIndex, column });
    let convertedInput:any = {type:'text'}
    for (let property in input) {
        let prop:(keyof AI) = property as keyof AI;
        let res:any = input[prop];
        if (['onChange', 'onClick'].indexOf(prop) !== -1) { convertedInput[prop] = res }
        else { convertedInput[prop] = getDynamics({ value: res, row, rowIndex, column }) }
    }
    let p:AI = { ...convertedInput, value, onChange,type:input.type }
    return (<AIOInput {...p} key={row._id + ' ' + column._id} />)
}
function AIOInputSearch(items: any[], searchValue: string, getValue?: (o: any, index: number) => any) {
    if (!searchValue) { return items }
    function isMatch(keys:string[], value:string) {
        for (let i = 0; i < keys.length; i++) {
            if (value.indexOf(keys[i]) === -1) { return false }
        }
        return true
    }
    let keys = searchValue.split(' ');
    return items.filter((o, i) => isMatch(keys, getValue ? getValue(o, i) : o))
}
const RangeContext = createContext({} as any)
const Range:FC = () => {
    let {rootProps}:AI_context = useContext(AICTX);
    let {
        start = 0,end = 360,min = start,max = end,step = 1,ranges,circles = [],reverse,round,vertical,
        multiple,text,onChange,size = Def('range-size'),disabled,className,fill,rotate = 0
    } = rootProps;
    let [temp] = useState<any>({dom:createRef(),start:0,index:false})
    function getValidValue(value:number[]):number[] {
        if (!Array.isArray(value)) {value = [value || 0]}
        for (let i = 0; i < value.length; i++) {
            let point = value[i] || 0;
            point = Math.round((point - start) / step) * step + start;
            if (point < min) { point = min; }
            if (point > max) { point = max; }
            value[i] = point;
        }
        return value
    }
    let value:number[] = getValidValue(rootProps.value);
    let valueRef = useRef(value);
    valueRef.current = value;
    let [disabledDic,setDisabledDic] = useState(getDisabledDic())
    function getDisabledDic(){
        if(!Array.isArray(disabled)){return {}}
        let res:{[key:string]:boolean} = {}
        for(let i = 0; i < disabled.length; i++){
            let key = 'a' + disabled[i];
            res[key] = true
        }
        return res
    }
    useEffect(()=>{setDisabledDic(getDisabledDic())},[JSON.stringify(disabled)])
    useEffect(()=>{
        new Swip({
            reverseX:!!reverse,
            //vertical condition
            reverseY:!!reverse && !!vertical,
            dom:()=>$(temp.dom.current),
            start:({event})=>{
                let target = $(event.target);
                if(target.hasClass('ai-range-point')){
                    let index:string = target.attr('data-index') || '0';
                    temp.index = +index;
                }
                else {
                    temp.index = false
                }
                temp.start = [...valueRef.current];
                return [0,0];
            },
            move:({change,mousePosition})=>{
                if(change){changeHandle({dx:change.dx,dy:change.dy,deltaCenterAngle:change.deltaCenterAngle,centerAngle:mousePosition.centerAngle})}
            },
            onClick:function (p){click(p.mousePosition)}
        })
    },[])
    function changeValue(newValue:number[]){
        if(!onChange){return}
        newValue = getValidValue(newValue)
        onChange(multiple?newValue:newValue[0])
    }
    function click(mousePosition:I_Swip_mousePosition){
        if(disabled === true || temp.index !== false){return} 
        let value = valueRef.current;
        let clickedValue:number;
        //vertical condition
        if(round){clickedValue = getValueByAngle(mousePosition.centerAngle);}
        else {clickedValue = getValueByXP(mousePosition[vertical?'yp':'xp']);}
        if(clickedValue < value[value.length - 1] && clickedValue > value[0]){return}
        if(clickedValue < value[0]){change1Unit(-1)}
        else{change1Unit(1)}
    }
    function isValueValid(value:number[]):boolean{
        for(let i = 0; i < value.length; i++){if(isValueDisabled(value[i])){return false}}
        return true
    }
    function change1Unit(dir: 1 | -1):void{
        let value = valueRef.current;
        let newValue = [...value];
        let lastValue = JSON.stringify(newValue)
        newValue = moveAll(newValue,dir * step);
        while(!isValueValid(newValue) && JSON.stringify(newValue) !== lastValue){
            lastValue = JSON.stringify(newValue)
            newValue = moveAll(newValue,dir * step)
        }
        changeValue(newValue)
    }
    function changeHandle(obj:{dx:number,dy:number,deltaCenterAngle:number,centerAngle:number}):void{
        if(disabled === true){return}
        let newValue = getChangedValue(obj);
        changeValue(newValue)
    }
    function getIndexLimit(index:number){
        let value = valueRef.current;
        let before:number,after:number;
        if(index === 0){before = start}
        else {before = value[index - 1]}
        if(index === value.length - 1){after = end}
        else {after = value[index + 1]}
        return {before,after} 
    }
    function moveAll(newValue:number[],offset:number,ifFailedReturnOriginalValue?:boolean):number[]{
        let res = newValue.map((o:number)=>o + offset)
        if(res[0] < start || res[res.length - 1] > end){
            return ifFailedReturnOriginalValue?valueRef.current:newValue
        }
        console.log(res)
        return res;
    }
    function getChangedValue(obj:{dx:number,dy:number,deltaCenterAngle:number,centerAngle:number}):number[]{
        let {dx,dy,deltaCenterAngle,centerAngle} = obj;
        //vertical condition
        let delta = vertical?dy:dx;
        let startValue = [...temp.start];
        let index = temp.index;
        let range = end - start;
        if(index === false){
            let deltaValue;
            if(round){
                let v = deltaCenterAngle * (end - start) / 360;
                v = Math.round(v / step) * step;
                deltaValue = v;
            }
            else {deltaValue = Math.round(getValueByXP(getXPByX(delta)) / step) * step;}
            let newValue = moveAll(startValue,deltaValue,true);
            return !isValueValid(newValue)?valueRef.current:newValue;
        }
        else {
            let {before,after} = getIndexLimit(index)
            let newUnit:number;
            if(round){
                newUnit = getValueByAngle(centerAngle);
                if(newUnit > after || newUnit < before){
                    let deltaAfter = newUnit - after;
                    if(deltaAfter < 0){deltaAfter += range;}
                    let deltaBefore = before - newUnit;
                    if(deltaBefore < 0){deltaBefore += range;}
                    if(deltaAfter < deltaBefore){newUnit = after}
                    else {newUnit = before}
                }
            }
            else {
                let deltaValue = Math.round(getValueByXP(getXPByX(delta)) / step) * step;
                newUnit = startValue[index] + deltaValue;
                if(newUnit > after){newUnit = after}
                if(newUnit < before){newUnit = before}
            }
            if(isValueDisabled(newUnit)){return valueRef.current}
            startValue[index] = newUnit;
            return startValue;
        }
    }
    function getSide(){
        if(vertical){return reverse?'bottom':'top'}
        return reverse?'right':'left'
    }
    function getOffset(){
        return vertical?'left':'top'
    }
    function isValueDisabled(value:number):boolean{return !!disabledDic[`a${value}`]}
    function getRootClassName(){
        let cls = 'ai-range';
        if(round){cls += ' ai-range-round'}
        else {cls += ` ai-range-${vertical?'vertical':'horizontal'}`}
        if(className){cls += ' ' + className}
        if(reverse){cls += ' ai-range-reverse'}
        return cls
    }
    function root_node():React.ReactNode{
        let {style,attrs = {}} = rootProps;
        let rootStyle = !round?{...style}:{...style,width:size,height:size};
        let p = AddToAttrs(attrs,{className:getRootClassName(),style:rootStyle,attrs:{ref:temp.dom}})
        return (
            <div {...p}>
                {text !== undefined && <div className='ai-range-text'>{typeof text === 'function'?text():text}</div>}
                {!round && <><RangeRanges/><RangeFills/></>} 
                <RangeSvg/> 
                <RangeItems key='scale' type='scale'/>
                <RangeItems key='label' type='label'/>
                {value.map((itemValue,i)=><RangeValueContainer index={i} itemValue={itemValue}/>)}
            </div>
        )
    }
    function getValueByAngle(angle:number){
        let fillAngle = 360 * (round as number);
        let emptyAngle = 360 - fillAngle;
        if(reverse){angle = 180 - angle}
        angle -= rotate; angle -= emptyAngle / 2; angle -= 90; angle = fixAngle(angle);
        return angle * (end - start) / fillAngle;
    }
    function getAngleByValue(value:number,ang?:number){
        let fillAngle = 360 * (round as number);
        let emptyAngle = 360 - fillAngle;
        let res = value * fillAngle / (end - start);
        res += 90; res += emptyAngle / 2; res += rotate; res += (ang || 0)
        return reverse?res = 180 - res:res;
    }
    function fixAngle(angle:number):number{angle = angle % 360; return angle < 0?angle = 360 + angle:angle}
    function getXPByValue(value:number):number {return 100 * (value - start) / (end - start);}
    function getValueByXP(xp:number):number{return xp * (end - start) / 100;}
    //vertical condition
    function getXPByX(x:number):number{return x * 100 / ($(temp.dom.current)[vertical?'height':'width']() as number);}
    function getContext(){
        let context:I_RangeContext = {
            getXPByValue,rootProps,fixAngle,getAngleByValue,dom:temp.dom,
            isValueDisabled,value:valueRef.current,getSide,getOffset
        }
        return context;
    }
    return (<RangeContext.Provider value={getContext()}>{root_node()}</RangeContext.Provider>)
}
const RangeSvg:FC = () => {
    let {rootProps}:I_RangeContext = useContext(RangeContext);
    let {round,ranges,circles = [],size = Def('range-size')} = rootProps;
    if(!round || (!(ranges || []).length && !circles.length)){return null}
    let pathes = [<RangeCircles/>,<RangeRanges/>]
    return (<svg style={{position:'absolute',left:0,top:0}} width={size} height={size}>{pathes}</svg>)
}
const RangeCircles:FC = () => {
    let {rootProps}:AI_context = useContext(AICTX);
    let {start = 0,end = 360,circles = [],size = Def('range-size')} = rootProps;
    if(!circles.length){return null}
    let pathes = []
    for(let i = 0; i < circles.length; i++){
        let [stringRadius,stringThickness,color] = circles[i].split(' ');
        let from = start,to = end,radius = +stringRadius,thickness = +stringThickness;
        if(radius > size / 2 - thickness / 2){radius = size / 2 - thickness / 2} 
        radius = Math.round(radius)
        let p:I_RangeArc = {thickness,color,from,to,radius,rotate:90,rootProps};
        pathes.push(<RangeArc {...p}/>);
    }
    return <>{pathes}</>;
}
const RangeFills:FC = () => {
    let {rootProps,value}:I_RangeContext = useContext(RangeContext);
    let {start = 0,fill,round} = rootProps; 
    if(round || fill === false){return null}
    let limit = value.length === 1?[start,value[0]]:[...value]; 
    let res:React.ReactNode[] = [];
    for(let i = 1; i < limit.length; i++){
        let {thickness,style,className:fillClassName,color} = (typeof fill === 'function'?fill(i):fill) || {};
        let from = limit[i - 1];
        let to = limit[i];
        let className = 'ai-range-fill';
        if(fillClassName){className += ' ' + fillClassName}
        let p:I_RangeRect = {thickness,color,from,to,className,style}
        res.push(<RangeRect {...p} key={'fill' + i}/>)
    }
    return <>{res}</>
}
const RangeRanges:FC = () => {
    let {rootProps,value}:I_RangeContext = useContext(RangeContext);
    let {start = 0,end = 360,ranges,round,multiple,size = Def('range-size')} = rootProps; 
    ranges = ranges || [`${end} 2 #ddd`]
    let res = [],from = start,list = (typeof ranges === 'function'?ranges(multiple?value:value[0]):ranges) || [];
    for(let i = 0; i < list.length; i++){
        let [stringValue,stringThickness,color] = list[i].split(' ');
        let to = +stringValue
        let thickness = +stringThickness;
        let radius = (size / 2) - (thickness / 2);
        let rangeItem:React.ReactNode
        if(round){
            let p:I_RangeArc = {thickness,color,from,to,radius,rotate:90,rootProps}
            rangeItem = <RangeArc {...p}/>
        }
        else {
            let p:I_RangeRect = {thickness,color,from,to,className:'ai-range-range'}
            rangeItem = <RangeRect {...p} key={'range' + i}/>
        }
        res.push(rangeItem);
        from = to;
    }
    return <>{res}</>
}
const RangeValueContainer:FC<I_RangeValueContainer> = (props) => {
    let {rootProps,isValueDisabled,fixAngle,getAngleByValue,getXPByValue,dom,getSide}:I_RangeContext = useContext(RangeContext);
    let {itemValue,index} = props;
    let {round} = rootProps;
    let angle = fixAngle(getAngleByValue(itemValue));
    function containerProps(){
        let style:any;
        if(!round){style = {[getSide()]:getXPByValue(itemValue) + '%'}}
        else {style = {transform:`rotate(${angle}deg)`}}
        return {className:'ai-range-value-container',draggable:false,style}
    }    
    let PROPS:I_RangeValue = {
        rootProps,value:itemValue,index,disabled:isValueDisabled(itemValue),
        angle,parentDom:dom
    }
    return (<div {...containerProps()} key={index}><RangeHandle {...PROPS}/> <RangePoint {...PROPS} /></div>)
}
const RangeRect:FC<I_RangeRect> = ({thickness,color,from,to,className,style})=>{
    let {getXPByValue,rootProps,getSide}:I_RangeContext = useContext(RangeContext);
    let {vertical} = rootProps,startSide = getXPByValue(from),endSide = getXPByValue(to);
    let Style:any = {[vertical?'width':'height']:thickness,[getSide()]:startSide + '%',[vertical?'height':'width']:(endSide - startSide) + '%',background:color,...style}
    return <div className={className} style={Style}/>
}
const RangeArc:FC<I_RangeArc> = ({rootProps,thickness,color,from,to,radius,rotate})=>{
    let {fixAngle,getAngleByValue}:I_RangeContext = useContext(RangeContext);
    let {size = Def('range-size'),reverse} = rootProps;
    let startAngle = fixAngle(getAngleByValue(from,rotate));
    let endAngle = fixAngle(getAngleByValue(to,rotate));
    if(endAngle === 0){endAngle = 360}
    let x = size / 2,y = size / 2,a = startAngle, b = endAngle;
    if(reverse){b = startAngle; a = endAngle}
    return <path key={`from${from}to${to}`} d={svgArc(x,y,radius,a,b)} stroke={color} strokeWidth={thickness} fill='transparent'/>
}
const RangePoint:FC<I_RangeValue> = (props) => {
    let {getOffset}:I_RangeContext = useContext(RangeContext);
    let [temp] = useState<any>({dom:createRef()})
    let {rootProps,value,disabled,angle,index,parentDom} = props;
    if(rootProps.point === false){return null}
    let {round,size = 72} = rootProps;
    let point = (rootProps.point || (()=>{}))(value,{disabled,angle,value,index}) || {}
    let {attrs = {},className,style,html = '',offset = 0} = point;
    let zIndexAttrs = getEventAttrs('onMouseDown',()=>{
        let containers = $(parentDom.current).find('ai-range-value-container');
        containers.css({zIndex:10});
        containers.eq(index).css({zIndex:100})
    })
    let containerProps = {ref:temp.dom,className:'ai-range-point-container',style:round?{left:size / 2 + offset}:{[getOffset()]:offset},draggable:false}
    let pointProps = AddToAttrs(attrs,{className:['ai-range-point',className],style,attrs:{draggable:false,'data-index':index,...zIndexAttrs}})
    return (<div {...containerProps}><div {...pointProps}>{html}</div></div>)
}
const RangeHandle:FC<I_RangeValue> = (props) => {
    let {rootProps,value,angle,disabled} = props;
    let {handle = (()=>{}),size = 72,round} = rootProps;
    if(handle === false || !round){return null}
    if(handle && typeof handle !== 'function'){
        alert(`aio-input error => in type round, handle props should be a function,
        handle type = (value:number,{disabled:boolean,angle:number})=>{attrs:any}`)
        return null
    }
    let {attrs = {}} = handle(value,{angle,disabled,value}) || {}
    let PROPS = AddToAttrs(attrs,{className:'aio-input-handle',style:{width:size / 2,...attrs.style},attrs:{draggable:false}})
    return (<div {...PROPS}></div>)
}
const RangeItems:FC<I_RangeItems> = (props) => {
    let {dom,rootProps}:I_RangeContext = useContext(RangeContext)
    let {type} = props;
    let {round,start = 0,end = 360,reverse,vertical} = rootProps;
    let [def_scale] = useState<React.ReactNode>(getDefScale);
    function getDefScale(){return RENDER(true)}
    let [def_label] = useState<React.ReactNode>(getDefLabel);
    function getDefLabel(){return RENDER(true)}
    function getList(item:AI_scales):number[]{
        let {step,list = []} = item,res:number[] = [];
        if(step){
            let endStep = !round || round !== 1;
            let stepLength = Math.floor((end - start) / step) + (endStep?1:0);
            res = new Array(stepLength).fill(0).map((o,i)=>i * step);
        }
        for(let i = 0; i < list.length; i++){
            if(res.indexOf(list[i]) === -1){res.push(list[i])}
        }
        return res;
    }
    function updateLabels() {
        if(round || type !== 'label' || vertical){return}
        let container = $(dom.current);
        let labels = container.find('.ai-range-label');
        if (!labels.length) { return; }
        let firstLabel:any = labels.eq(0);
        let firstLabelHProp = firstLabel.attr('data-rotated') === 'yes' ? 'height' : 'width';
        let end = firstLabel.offset().left + (!reverse?firstLabel[firstLabelHProp]():0);
        for (let i = 1; i < labels.length; i++) {
            let label:any = labels.eq(i);
            let hProp = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
            label.css({ display: 'flex' })
            let left = label.offset().left
            let width = label[hProp]();
            let right = left + width;
            if(!reverse){
                if (left < end + 5) {label.css({ display: 'none' })}
                else { end = left + width; }
            }
            else {
                if (right > end - 5) {label.css({ display: 'none' })}
                else { end = left; }
            }   
        }
    }
    useEffect(()=>{$(window).on('resize', updateLabels)},[])
    useEffect(()=>{updateLabels()})
    function RENDER(init:boolean):React.ReactNode{
        let entity:AI_scales = {label:rootProps.labels,scale:rootProps.scales}[type] as AI_scales
        let setting = {label:rootProps.label,scale:rootProps.scale}[type] || (()=>{return {}})
        if(!entity){return null}
        if(!init && !entity.dynamic){
            let dic:{scale:React.ReactNode,label:React.ReactNode} = {scale:def_scale,label:def_label}
            return dic[type] as React.ReactNode
        }
        return (
            <>
                {
                    getList(entity).map((itemValue,i)=>{
                        return <RangeItem key={type + itemValue} setting={setting} itemValue={itemValue} type={type}/>
                    })
                }
            </>
        )
    }
    return <>{RENDER(false)}</>
}
const RangeItem:FC<I_RangeItem> = (props) => {
    let {value,rootProps,isValueDisabled,fixAngle,getAngleByValue,getXPByValue,getSide,getOffset}:I_RangeContext = useContext(RangeContext);
    let {setting,itemValue,type} = props;
    let {round,size = Def('range-size')} = rootProps;
    let angle:number;
    if(round){angle = fixAngle(getAngleByValue(itemValue))}
    let disabled = isValueDisabled(itemValue);
    function getContainerStyle(distance:any){
        if(round){return {transform:`rotate(${angle}deg)`}}
        else {return {[getSide()]:getXPByValue(itemValue)+'%',...distance}}
    } 
    function getTextStyle(item:AI_scale,distance:any,type:'scale' | 'label'){
        let {attrs = {},style,fixAngle = (type === 'label')} = item;
        if(round){
            let res:any = {};
            if(fixAngle){res.transform = `rotate(${-angle}deg)`}
            return {...res,...distance,...attrs.style,...style}
        }
        return {...attrs.style,...style}
    }
    function getDistanceByOffset(offset:any){
        let def:{[key:string]:number} = {'round-point':-8,'round-label':8,'round-scale':4,'point':0}
        if(offset === undefined){offset = def[`${round?'round-':''}${type}`] || 0;}
        if(!round){
            let sign = offset < 0?'-':'+';
            let distance = offset?`calc(50% ${sign} ${Math.abs(offset)}px)`:undefined;
            return {[getOffset()]:distance}
        }
        else {return {left:size / 2 + offset}}
    }
    function getDetails(setting:(value:number,p:any)=>AI_scale,itemValue:number,type:'scale' | 'label'){
        let item:AI_scale = setting(itemValue,{disabled,angle,value});
        let {offset = !round && type === 'label'?16:0,html = type === 'label'?itemValue:undefined,className,attrs} = item;
        let distance = getDistanceByOffset(offset)
        let text = html;
        let containerStyle = getContainerStyle(distance);
        let containerProps = {className:`ai-range-${type}-container`,style:containerStyle,draggable:false,key:itemValue};
        let textProps = AddToAttrs(attrs,{className:[`ai-range-${type}`,className],style:getTextStyle(item,distance,type),attrs:{draggable:false}})
        return {text,textProps,containerProps}
    }
    let {text,textProps,containerProps} = getDetails(setting,itemValue,type);
    return (<div {...containerProps} key={containerProps.key}><div {...textProps}>{text}</div></div>)
}
const MapContext = createContext({} as any);
function Map() {
    let { rootProps }: AI_context = useContext(AICTX);
    let { popupConfig, mapConfig = {}, onChange = ()=>{}, disabled, attrs, value } = rootProps;
    let [isScriptAdded,setIsScriptAdded] = useState<boolean>(false);
    useEffect(()=>{
        let scr = document.getElementById('aio-input-map-neshan');
        try {
            const script = document.createElement("script");
            script.src = `https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js`;
            script.id = 'aio-input-map-neshan'
            script.onload = () => setIsScriptAdded(true);
            document.body.appendChild(script);
        }
        catch (err) { console.log(err) }
    },[])
    if(!isScriptAdded){return null}
    if (!value) { value = { lat: 35.699739, lng: 51.338097 } }
    if (!value.lat) { value.lat = 35.699739 }
    if (!value.lng) { value.lng = 51.338097 }
    let p:I_MapUnit = { popupConfig, onChange, attrs, value, mapConfig, disabled:disabled === true }
    return <MapUnit {...p} />
}
function MapUnit(props:I_MapUnit) {
    let [mapApiKeys] = useState<I_mapApiKeys>((new Storage('aio-input-storage')).load('mapApiKeys',{ map: '', service: '' }));
    let {onClose,mapConfig = {},onChange = () => { },disabled, attrs = {},popupConfig} = props;
    let {area,zoom:Zoom = 14, traffic = false,markers = [], zoomControl = false, maptype = 'dreamy-gold', poi = true,draggable = true } = mapConfig;
    let [showPopup,setShowPopup] = useState<boolean>(false)
    let [value,setValue] = useState<{lat:number,lng:number}>(props.value)
    let [address,setAddress] = useState<string>('')
    let [addressLoading,setAddressLoading] = useState<boolean>(false)
    let [zoom,setZoom] = useState<number>(Zoom);
    let [mounted,setMounted] = useState<boolean>(false)
    let [temp] = useState<I_Map_temp>({
        datauniqid:'mp' + (Math.round(Math.random() * 10000000)),
        markers:[],
        dom:createRef(),
        map:undefined,
        L:(window as any).L,
        atimeout:undefined,
        btimeout:undefined,
        area:undefined,
        mapMarker:undefined,
        lastChange:undefined
    })
    let [Marker] = useState(new MarkerClass(()=>temp,()=>mapConfig));
    Marker.updateMarkers(markers);
    useEffect(()=>{if(mounted){Marker.addMarkersToMap(value)}},[JSON.stringify(Marker.htmls)])
    let changeView = !!draggable && !disabled;
    //maptype: "dreamy" | 'standard-day'  
    useEffect(()=>{
        let config = {
            key: mapApiKeys.map, maptype, poi, traffic,
            center: [value.lat, value.lng], zoom,
            dragging: !disabled,
            scrollWheelZoom: 'center',
            zoomControl
        }
        temp.map = new temp.L.Map(temp.dom.current, config);
        Marker.addMapMarker(value);
        temp.map.on('click', (e:any) => {
            if (attrs.onClick) { return }
            if (!!onChange) { let { lat, lng } = e.latlng; temp.map.panTo({ lat, lng }) }
        });
        temp.map.on('move', (e:any) => {
            if(!changeView){return}
            let { lat, lng } = e.target.getCenter()
            move({ lat, lng })
        });
        setMounted(true);
        update()
    },[])
    function handleArea() {
        if (temp.area) { temp.area.remove() }
        if (area && temp.L && temp.map) {
            let { color = 'dodgerblue', opacity = 0.1, radius = 1000, lat, lng } = area;
            temp.area = temp.L.circle([lat, lng], { color, fillColor: color, fillOpacity: opacity, radius }).addTo(temp.map);
        }
    }
    function ipLookUp() {
        $.ajax('http://ip-api.com/json')
            .then(
                (response:any) => {let { lat, lon } = response; flyTo({lat,lng:lon})},
                (data:any, status:any) => console.log('Request failed.  Returned status of', status)
            );
    }
    function handlePermission() {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') { console.log(result.state); }
            else if (result.state === 'prompt') { console.log(result.state); }
            else if (result.state === 'denied') { console.log(result.state); }
        });
    }
    async function getAddress(p:I_Map_coords) {
        let { lat, lng } = p;
        try {
            let res = await Axios.get(`https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`, { headers: { 'Api-Key': mapApiKeys.service, Authorization: false } });
            return res.status !== 200 ? '' : res.data.formatted_address;
        }
        catch (err) { return '' }
    }
    function goToCurrent() {
        if ("geolocation" in navigator) {
            handlePermission();
            // check if geolocation is supported/enabled on current browser
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let { latitude: lat, longitude: lng } = position.coords;
                    flyTo({lat, lng});
                },
                (error_message) => { ipLookUp() }
            )
        }
        else { ipLookUp() }
    }
    async function route(from = [35.699739, 51.338097], to = [35.699939, 51.338497]) {
        try {
            let param = { headers: { 'Api-Key': mapApiKeys.service } }
            let url = `https://api.neshan.org/v4/direction?type=car&origin=${from[0]},${from[1]}&destination=${to[0]},${to[1]}`;
            await Axios.get(url, param);
        }
        catch (err) { return '' }
    }
    async function showPath(path:string) {
        try { await Axios.post(`https://api.neshan.org/v3/map-matching?path=${path}`, { headers: { 'Api-Key': mapApiKeys.service } }); }
        catch (err) { return '' }
    }
    function flyTo(coords:I_Map_coords) {
        if (!coords) { return }
        let animate = GetDistance(value, coords) > 0.3;
        temp.map.flyTo([coords.lat, coords.lng], zoom, { animate, duration: 1 });
    }
    function panTo(coords:{lat:number,lng:number}) { temp.map.panTo(coords) }
    async function updateAddress(coords:I_Map_coords) {
        if(!mapConfig.address){return}
        let { lat, lng } = coords;
        clearTimeout(temp.atimeout);
        if(temp.lastChange && lat === temp.lastChange.lat && lng === temp.lastChange.lng){return}
        temp.lastChange = {lat,lng}
        setAddressLoading(true)
        temp.atimeout = setTimeout(async () => {
            let address = await getAddress({ lat, lng });
            setAddress(address);
            setAddressLoading(false);
            onChange({ lat, lng, address });
        }, 1200);
    }
    function change(value:I_Map_coords) {
        let {lat,lng} = value;
        onChange({ lat, lng, address });
        updateAddress(value)
    }
    function move(value:I_Map_coords) {
        if (temp.mapMarker) { temp.mapMarker.setLatLng(value) }
        clearTimeout(temp.atimeout); clearTimeout(temp.btimeout);
        temp.btimeout = setTimeout(async () => {setValue(value); change(value)}, 500);
    }
    function update(){
        flyTo(props.value);  
        handleArea()
        Marker.addMarkersToMap(value);
        updateAddress(value);
    }
    useEffect(()=>{if(mounted){handleArea()}},[JSON.stringify(area || {})])
    useEffect(()=>{if(mounted){update()}},[props.value.lat,props.value.lng,Zoom])
    function getContext() {
        let context:I_Map_context = { mapApiKeys, value,addressLoading,address, flyTo, goToCurrent,onClose,mapConfig,popupConfig,onChange }
        return context;
    }
    function renderPopup() {
        if (showPopup) {
            let props:I_MapUnit = {
                value,
                disabled,
                mapConfig: {...popupConfig,isPopup:true},
                onClose: () => setShowPopup(false),
                attrs: { ...attrs, style: { width: '100%', height: '100%', top: 0, position: 'fixed', left: 0, zIndex: 1000000, ...attrs.style }, onClick: undefined },
                onChange: (obj) => move(obj)
            }
            return <MapUnit {...props} />
        }
        return null
    }
    function header_node():React.ReactNode{return <MapHeader /> }
    function body_node():React.ReactNode{return <div style={{flex:1}} ref={temp.dom}></div>}
    function footer_node():React.ReactNode{return <MapFooter /> }
    return (
            <MapContext.Provider value={getContext()}>
                <div 
                    className={'aio-input-map-container' + (mapConfig.draggable === false ? ' not-draggable' : '')} 
                    style={attrs.style}
                    onClick={ () => {if (popupConfig) { setShowPopup(true) }}}
                >
                    {header_node()} {body_node()} {footer_node()}
                </div>
                {renderPopup()}
            </MapContext.Provider>
    )
}
class MarkerClass{
    getHtml:(marker:I_Map_marker)=>string;
    getHtmls:()=>string[];
    updateMarkers:(markers:I_Map_marker[])=>void;
    getIcon:(html:string)=>any;
    addMapMarker:(value:{lat:number,lng:number})=>void;
    addMarkersToMap:(value:{lat:number,lng:number})=>void;
    markers:I_Map_marker[];
    marker:boolean | string;
    htmls:string[];
    constructor(getTemp:()=>I_Map_temp,getMapConfig:()=>I_Map_config){
        this.markers = [];
        this.htmls = [];
        this.updateMarkers = (markers)=>{
            this.markers = markers;
            this.htmls = this.getHtmls();
        }
        this.getHtml = (marker) => {
            let temp = getTemp();
            let {datauniqid:id} = temp;
            let { size = 20, color = 'orange', html, text,lat,lng } = marker;
            let innerSize = size * 0.4;
            let borderSize = Math.ceil(size / 10);
            let innerTop = Math.round(size / 25);
            let top = `-${(size / 2 + innerSize)}px`;
            let style1 = `transform:translateY(${top});flex-shrink:0;color:${color};width:${size}px;height:${size}px;border:${borderSize}px solid;position:relative;border-radius:100%;display:flex;align-items:center;justify-content:center;`
            let style2 = `position:absolute;left:calc(50% - ${innerSize}px);top:calc(100% - ${innerTop}px);border-top:${innerSize}px solid ${color};border-left:${innerSize}px solid transparent;border-right:${innerSize}px solid transparent;`
            let innerHtml = '', innerText = '';
            if (html) { innerHtml = JSXToHTML(html) }
            if (text) { innerText = JSXToHTML(text) }
            //data-lat va data-lng baraye tashkhise taghire mogheiat az rooye string
            return (`<div class='aio-input-map-marker' data-lat='${lat}' data-lng='${lng}' data-parent='${id}' style="${style1}">${innerHtml}<div class='aio-input-map-marker-text'>${innerText}</div><div style="${style2}"></div></div>`)
        }
        let mapConfig = getMapConfig();
        let {marker = true} = mapConfig;
        this.marker = typeof marker === 'boolean'?marker:this.getHtml(marker);
        this.getHtmls = ()=>{
            return this.markers.map((o:I_Map_marker)=>this.getHtml(o))
        }
        this.getIcon = (html) => {
            if(typeof html !== 'string'){return false}
            let temp = getTemp();
            return { icon: temp.L.divIcon({ html })}
        }
        this.addMarkersToMap = ()=>{
            let m = this.marker;
            if(m === false){return}
            let icon = m === true || m === undefined?undefined:this.getIcon(this.getHtml(m as I_Map_marker))
            return (lat:number,lng:number,temp:I_Map_temp)=>temp.mapMarker = temp.L.marker([lat, lng],icon).addTo(temp.map)
        }
        this.addMapMarker = (value) => {
            let temp = getTemp();
            if(this.marker === false){return}
            let icon = this.marker === true || this.marker === undefined?undefined:this.getIcon(this.marker)
            temp.mapMarker = temp.L.marker([value.lat, value.lng],icon).addTo(temp.map)
        }
        this.addMarkersToMap = (value) => {
            let temp = getTemp();
            if (!temp.map || !temp.L) { return }
            if (temp.markers.length) {
                for (let i = 0; i < temp.markers.length; i++) { temp.markers[i].remove(); }
                temp.markers = [];
            }
            for (let i = 0; i < this.htmls.length; i++) {
                let h = this.htmls[i];
                let icon = this.getIcon(h);
                let { lat = value.lat, lng = value.lng, popup = () => '' } = this.markers[i];
                let pres:any = popup(this.markers[i])
                if (typeof pres !== 'string') { try { pres = pres.toString() } catch { } }
                temp.markers.push(temp.L.marker([lat, lng], icon).addTo(temp.map).bindPopup(pres))
            }
        }
    }
}
function MapHeader() {
    let {value, flyTo, goToCurrent, mapApiKeys,mapConfig = {}, onClose}:I_Map_context = useContext(MapContext);
    let { title, search } = mapConfig;
    let [searchValue, setSearchValue] = useState('');
    let [searchResult, setSearchResult] = useState<{title:string,address:string,location:{x:number,y:number}}[]>([]);
    let [loading, setLoading] = useState(false);
    let [showResult, setShowResult] = useState(false);
    let dom = createRef();
    let timeout:any;
    async function changeSearch(searchValue:string) {
        let { lat, lng } = value;
        setSearchValue(searchValue);
        clearTimeout(timeout);
        if(!searchValue){
            setSearchResult([]);
            return;
        }
        timeout = setTimeout(async () => {
            try {
                let param = { headers: { 'Api-Key': mapApiKeys.service, 'Authorization': false } }
                let url = `https://api.neshan.org/v1/search?term=${decodeURI(searchValue)}&lat=${lat}&lng=${lng}`;
                setLoading(true); let res = await Axios.get(url, param); setLoading(false)
                if (res.status !== 200) { return }
                setSearchResult(res.data.items)
            }
            catch (err) { }
        }, 1000)
    }
    function input_node():React.ReactNode {
        if (!search) { return null }
        let p:AI = {
            type:'text',placeholder:search,className:'aio-input-map-serach-input',value:searchValue,attrs:{ref:dom},options:searchResult,
            before:<div onClick={()=>goToCurrent()} className='align-vh'>{I(mdiCrosshairsGps,0.6)}</div>,
            after:()=>{
                let path,spin,size,onClick;
                if(loading){path = mdiLoading; spin = 0.4; size = 1;}
                else if(!!showResult && !!searchResult.length){path = mdiClose; size = 0.8; onClick = ()=>{changeSearch('')}}
                else {path = mdiMagnify; size=0.8;}
                return (<div className='aio-input-map-serach-icon align-vh' onClick={onClick}>{I(path,size,{spin})}</div>)
            },
            option:{
                text:'option.title',value:'option.location.x + "-" + option.location.y',close:()=>true,
                subtext:'option.address',
                onClick:(option:any)=>flyTo({lat:option.object.location.y, lng:option.object.location.x})
            },
            onChange:(searchValue:string)=>changeSearch(searchValue)
        }
        return (<div className="aio-input-map-search"><AIOInput {...p}/></div>)
    }
    function header_node():React.ReactNode {
        if (typeof title !== 'string' && !onClose) { return null }
        return (
            <div style={{display:'flex'}}>
                {!!onClose && <div className='aio-input-map-close align-vh' onClick={()=>{if(onClose){onClose()}}}>{I(mdiChevronRight,1)}</div>}
            </div>
        )
    }
    if (!search && !title && !onClose) { return null }
    return (
        <div className={'aio-input-map-header of-visible' + (searchResult && searchResult.length && showResult ? ' aio-input-map-header-open' : '')}>
            {header_node()} {input_node()}
        </div>
    )
}
function MapFooter() {
    let {value,addressLoading,address,onClose, onChange,mapConfig = {}}:I_Map_context = useContext(MapContext);
    let { lat, lng } = value;
    function submit_node():React.ReactNode {
        if (!mapConfig.isPopup) { return null }
        let {submitText = 'Submit'} = mapConfig;
        return (<button className='aio-input-map-submit' onClick={async () => { onChange(value); if(onClose){onClose()} }}>{submitText}</button>)
    }
    function details_node():React.ReactNode {
        if (!mapConfig.address) { return null }
        if(addressLoading){return loading_node()}
        return (
            <div style={{flex:1,display:'flex',flexDirection:'column'}}>
                {address_node()} {coords_node()}
            </div>
        )
    }
    function loading_node():React.ReactNode{return <div style={{display:'flex',alignItems:'center',justifyContent:'center',flex:1}}>{I(mdiLoading,1,{spin:0.4})}</div>}
    function address_node():React.ReactNode{return <div className="aio-input-map-address">{address}</div>}
    function coords_node():React.ReactNode{
        if(!lat || !lng){return null}
        <div className="aio-input-map-coords">{`${lat} - ${lng}`}</div>
    }
    if(!mapConfig.isPopup && !mapConfig.address){return null}
    return <div className="aio-input-map-footer">{details_node()} {submit_node()}</div>
}
function GetDistance(p1:I_Map_coords, p2:I_Map_coords) {
    let { lat: lat1, lng: lon1 } = p1;
    let { lat: lat2, lng: lon2 } = p2;
    let rad = Math.PI / 180;
    let radius = 6371; //earth radius in kilometers
    return Math.acos(Math.sin(lat2 * rad) * Math.sin(lat1 * rad) + Math.cos(lat2 * rad) * Math.cos(lat1 * rad) * Math.cos(lon2 * rad - lon1 * rad)) * radius; //result in Kilometers
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
    let storage: Storage = new Storage('aio-input-storage');
    storage.save(name, value)
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
    if (type === 'multiselect' || type === 'table') { isMultiple = true }
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
    let { value, unit = Def('date-unit'), text, jalali, placeholder } = rootProps;
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
        if(props.type === 'tree'){}
        else if (valueType === 'array') { props.value = props.value[0] }
    }
    return props;
}

function Def(prop:string){
    let res = {
        'theme':[],
        'date-size':180,
        'tree-size':36,
        'range-size':72,
        'date-unit':'day'
    }[prop]
    return res as any
}
function I(path:any,size:number,p?:any){
    return <Icon path={path} size={size} {...p}/>
}
function GetOptions(p: { rootProps: AI, types: AI_types, options?: any[], properties?: any,level?:number,change?:(row:any,newRow:any)=>void }): AI_option[] {
    let { rootProps, types, properties = {},level,change } = p;
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
    function updateOptionByProperties(option: any) {
        for (let prop in properties) {
            let res = properties[prop](option)
            option[prop] = res
        }
        return option as AI_option
    }
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let details:any = {renderIndex,realIndex:i,level,change:change?(newRow:any)=>{change(option,newRow)}:undefined};
        let disabled = !!rootProps.disabled || !!rootProps.loading || !!GetOptionProps({ props: rootProps, option, key: 'disabled', ...details });
        let show = GetOptionProps({ props: rootProps, option, key: 'show',...details })
        if (show === false) { continue }
        let text = GetOptionProps({ props: rootProps, option, key: 'text',...details });
        //در اینپوت ها آپشن هایی رو نشون بده که با ولیو مچ هستند
        //if (types.isInput && value && text.toString().indexOf(value.toString()) !== 0) { continue }
        let optionValue = GetOptionProps({ props: rootProps, option, key: 'value',...details })
        let attrs = GetOptionProps({ props: rootProps, option, key: 'attrs', def: {},...details });
        let defaultChecked = getDefaultOptionChecked(optionValue)
        let checked = GetOptionProps({ props: rootProps, option, key: 'checked', def: defaultChecked,...details })
        //object:option => do not remove mutability to use original value of option in for example tree row
        let obj = {
            object: option, show,
            loading: rootProps.loading,
            attrs, text, value: optionValue, disabled, draggable,
            checkIcon: GetOptionProps({ props: rootProps, option, key: 'checkIcon',...details }) || rootProps.checkIcon,
            checked,
            before: GetOptionProps({ props: rootProps, option, key: 'before',...details }),
            after: GetOptionProps({ props: rootProps, option, key: 'after',...details }),
            justify: GetOptionProps({ props: rootProps, option, key: 'justify',...details }),
            subtext: GetOptionProps({ props: rootProps, option, key: 'subtext',...details }),
            onClick: GetOptionProps({ props: rootProps, option, key: 'onClick', preventFunction: true,...details }),
            className: GetOptionProps({ props: rootProps, option, key: 'className',...details }),
            style: GetOptionProps({ props: rootProps, option, key: 'style',...details }),
            tagAttrs: GetOptionProps({ props: rootProps, option, key: 'tagAttrs',...details }),
            tagBefore: GetOptionProps({ props: rootProps, option, key: 'tagBefore',...details }),
            close: GetOptionProps({ props: rootProps, option, key: 'close', def: rootProps.type !== 'multiselect',...details }),
            tagAfter: GetOptionProps({ props: rootProps, option, key: 'tagAfter',...details }),
            renderIndex, realIndex: i
        }
        if (types.isMultiple) {
            if (rootProps.value.indexOf(optionValue) !== -1) { obj.attrs = AddToAttrs(obj.attrs, { className: 'active' }) }
        }
        else {
            if (optionValue === rootProps.value) { obj.attrs = AddToAttrs(obj.attrs, { className: 'active' }) }
        }
        result.push(updateOptionByProperties(obj))
        renderIndex++;
    }
    return result;
}
function GetOptionProps(p: { props: AI, option: AI_option, key: AI_optionKey, def?: any, preventFunction?: boolean, realIndex?: number, renderIndex?: number,level?:number,change?:(v:any)=>any }) {
    let { props, option, key, def, preventFunction, realIndex, renderIndex,level,change } = p;
    let details:any = {realIndex,renderIndex,level,change};
    let optionResult = typeof option[key] === 'function' && !preventFunction ? option[key](option,details ) : option[key]
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
        let res = prop(option, details);
        return res === undefined ? def : res;
    }
    return prop !== undefined ? prop : def;
}

