/**varsion 8.1.3 */
import React, { Component, createRef, useContext, createContext, Fragment, useState, useEffect } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Axios from 'axios';
import { Icon } from '@mdi/react';
import {
    mdiChevronDown, mdiLoading, mdiAttachment, mdiChevronRight, mdiClose, mdiCircleMedium, mdiArrowUp, mdiArrowDown,
    mdiSort, mdiFileExcel, mdiMagnify, mdiPlusThick, mdiChevronLeft, mdiImage, mdiEye, mdiEyeOff, mdiDownloadOutline,
    mdiCrosshairsGps,
    mdiDotsHorizontal
} from "@mdi/js";
import $ from 'jquery';
import AIODate from './../../npm/aio-date/aio-date';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOPopup from './../../npm/aio-popup/aio-popup';
import AIOStorage from './../../npm/aio-storage/aio-storage';
import './index.css';
import { I_RVD_node } from '../react-virtual-dom/types';
const AICTX = createContext({} as any);
export type I_AIOInput_type = 'text' | 'number' | 'textarea' | 'password' | 'select' | 'multiselect' | 'map' |
    'button' | 'datepicker' | 'color' | 'radio' | 'tabs' | 'list' | 'table' | 'image' | 'file' | 'slider' | 'checkbox' | 'form' | 'time'
export type I_AIOInput_optionKey = (
    'attrs' | 'text' | 'value' | 'disabled' | 'checkIcon' | 'checked' | 'before' | 'after' | 'justify' | 'subtext' | 'onClick' | 
    'className' |  'style' |  'tagAttrs' | 'tagBefore' | 'tagAfter' | 'close'
)
type I_AIOInput_popover = { 
    attrs?: any, 
    fixStyle?: (style: any) => any, 
    fitHorizontal?: boolean, 
    position?: 'fullscreen' | 'popover' | 'center' | 'left' | 'top' | 'right' | 'bottom', 
    header?: {title?:React.ReactNode,subtitle?:React.ReactNode,attrs?:any,onClose?:boolean | (()=>void)},
    pageSelector?:string,
    body?:{render?:(p:{close:()=>void})=>React.ReactNode}
}
export type I_AIOInput = {
    rtl?: boolean,
    popover?: I_AIOInput_popover,//notice get type from aio popup
    type: I_AIOInput_type,
    multiple?: boolean,
    value?: any,
    visible?: boolean,
    open?: boolean,
    unit?: 'year' | 'month' | 'day' | 'hour',
    calendarType?: 'gregorian' | 'jalali',
    pattern?: string,
    placeholder?: string,
    className?:string,
    width?: number, //list
    height?: number,
    style?: any,
    onChange?: (newValue: any, p?: any) => void,
    disabled?: boolean,
    loading?: boolean | React.ReactNode,
    min?: number,//slider,number
    max?: number,//slider,number
    start?:number,//slider
    end?:number,//slider
    step?:number,//slider
    swip?: boolean,
    blurChange?: boolean,
    maxLength?: number,
    justNumber?: boolean,
    filter?: string[],
    delay?: number,
    inputAttrs?: any,
    spin?: boolean,
    justify?: boolean,
    hideTags?: boolean,
    attrs?: any,
    columns?: type_table_column[],
    paging?: type_table_paging,
    rowGap?: number,
    columnGap?: number,
    onChangeSort?: (sorts: type_table_sort[]) => Promise<boolean>,
    toolbarAttrs?: any,
    toolbar?: React.ReactNode | (() => React.ReactNode),
    getValue?: { [key: string]: (p: { row: any, column: type_table_column, rowIndex: number }) => any },
    onAdd?: Object | (() => void),
    onRemove?: true | ((p: { row: any, action: Function, rowIndex: number }) => void),
    excel?: string,
    onSwap?: true | ((newValue: any[], startRow: any, endRow: any) => void),
    onSearch?: true | ((searchValue: string) => void),
    rowAttrs?: (p: { row: any, rowIndex: number }) => any,
    rowTemplate?: (p: { row: any, rowIndex: number, isLast: boolean }) => React.ReactNode,
    rowsTemplate?: (rows: any[]) => React.ReactNode,
    rowAfter?: (p: { row: any, rowIndex: number }) => React.ReactNode,
    rowBefore?: (p: { row: any, rowIndex: number }) => React.ReactNode,
    headerAttrs?: any,
    after?: React.ReactNode | (() => React.ReactNode),
    before?: React.ReactNode | (() => React.ReactNode),
    options?: any[],
    option?:{[key in I_AIOInput_optionKey]?:I_AIOInput_optionProp},
    direction?: 'left' | 'right' | 'top' | 'bottom',
    checkIcon?: I_AIOInput_checkIcon,
    caret?: boolean | React.ReactNode,
    text?: React.ReactNode | (() => React.ReactNode)
    subtext?: React.ReactNode | (() => React.ReactNode),
    move?: any,//list
    count?: number,//list
    size?: number,//list,datepicker
    editable?: boolean,//list
    stop?: number,//list
    decay?: number,//list
    startYear?: string | number,//datepicker
    endYear?: string | number,//datepicker
    translate?: (text: string) => string,//datepicker,
    theme?: string[],//datepicker
    search?: string,
    dateAttrs?:(p:{dateArray:number[], isToday:boolean, isDisabled:boolean, isActive:boolean, isMatch:(p:any[])=>boolean})=>any,//datepicker
    dateDisabled?:string[],
    close?:boolean,//datepicker
    preview?:boolean,
    footer?:{
        layout?:(p:{disabled:boolean,errors:string[],reset:()=>void})=>React.ReactNode,
        onSubmit?:()=>void,onClose?:()=>void,reset?:boolean,attrs?:any,submitText?:string,closeText?:string,resetText?:string,
        before?:React.ReactNode,after?:React.ReactNode
    },//form
    body?:{attrs?:any},//form
    getErrors?:(p:string[])=>void,//form
    initialDisabled?:boolean,//form
    inputs?:any,//form
    labelAttrs?:any,//form
    errorAttrs?:any,//form
    lang?:'fa' | 'en',//form,
    lineAttrs?:any,//slider
    pointLabel?:(index:number,value:number)=>{html?:React.ReactNode,attrs?:any,show?:boolean | 'inline'},
    point?:(index:number,value:number)=>{attrs?:any,html?:React.ReactNode},
    line?:{
        attrs?:(index:number,active:boolean)=>any,
        text?:(index:number,active:boolean)=>string
    }
    label?:{
        step?:number,
        list?:number[],
        attrs?:(value:number)=>Object,
        html?:(value:number)=>React.ReactNode,
        rotate?:number | ((value:number)=>number)
    },
    scale?:{
        step?:number,
        list?:number[],
        attrs?:(value:number)=>React.ReactNode,
        html?:(value:number)=>React.ReactNode  
    },
    mapConfig?:I_Map_config,
    popupConfig?:I_Map_config
}
//notice
//use global fixed options in List
//create list document 
//define popover type by aio popup
export type I_AIOInput_checkIcon = ((checked: boolean) => React.ReactNode) | Object;
export type I_AIOInput_optionProp = string | ((option: I_AIOInput_option,p?:any) => any)
export type I_AIOInput_getOptionProp = (option: any, key: string, def?: any, preventFunction?: boolean) => any;
export type I_AIOInput_temp = { dragIndex?: number }
export type I_AIOInput_option = {
    object:any,
    checked: boolean,
    checkIcon: I_AIOInput_checkIcon,
    after: React.ReactNode | (() => React.ReactNode),
    before: React.ReactNode | (() => React.ReactNode),
    draggable: boolean,
    text: React.ReactNode,
    subtext: React.ReactNode,
    justify: boolean,
    loading: boolean | React.ReactNode,
    disabled: boolean,
    attrs: any,
    style: any
}
export type I_AIOInput_getProp_param = { key: string, def?: any, preventFunction?: boolean };
export type I_AIOInput_getProp = (p: I_AIOInput_getProp_param) => any;
export type I_AIOInput_addToAttrs = (attrs: any, p: { className?: string, style?: any, stylePriority?: boolean }) => any
export type I_AIOInput_context = {
    rootProps: I_AIOInput,
    showPassword: boolean,
    setShowPassword: (v?: boolean) => void,
    getOptionProp: I_AIOInput_getOptionProp,
    Drag: I_Drag,
    datauniqid: string,
    touch: boolean,
    open: boolean,
    click: (e: any, dom: any) => void,
    optionClick: (option: I_AIOInput_option) => void,
    types: {
        isMultiple: boolean,
        isInput: boolean,
        isDropdown: boolean,
        hasOption: boolean,
        hasPlaceholder: boolean,
        hasKeyboard: boolean,
        hasText: boolean,
        hasSearch: boolean
    }
}
type I_Drag = { start: (e: any) => void, over: (e: any) => void, drop: (e: any) => void }
export default function AIOInput(props: I_AIOInput) {
    let { type, onChange, value, attrs = {} } = props;
    let [types] = useState(getTypes(props))
    let [parentDom] = useState(createRef())
    let [datauniqid] = useState('aiobutton' + (Math.round(Math.random() * 10000000)))
    let [temp] = useState<any>({
        getPopover:initGetPopover()
    });
    function initGetPopover() {
        let p: I_AIOInput_Popover_props = { getRootProps: () => props, id: datauniqid, toggle,types }
        let res = new Popover(p).getFn()
        return res;
    }
    let [popup] = useState(new AIOPopup())
    let [open, setOpen] = useState<boolean>(!!props.open);
    let [showPassword, SetShowPassword] = useState<boolean>(false);
    function setShowPassword(state?: boolean) { SetShowPassword(state === undefined ? !showPassword : state) }
    let [Drag] = useState<I_Drag>(new DragClass({ rootProps: props }))
    function getSelectText() {
        let { options = [], value } = props;
        let option = options.find((option) => value === undefined ? false : getOptionProp(option, 'value') === value);
        if (option === undefined) { return }
        return getOptionProp(option, 'text')
    }
    function toggle(popover: any) {
        let open = !!popup.getModals().length
        if (!!popover === !!open) { return }
        setOpen(!!popover)
        if (popover) { popup.addModal(popover); }
        else { popup.removeModal(); setTimeout(() => $(parentDom.current).focus(), 0) }
    }
    function click(e, dom) {
        if (type === 'checkbox') { if (onChange) { onChange(!value) } }
        else if (temp.getPopover) {toggle(temp.getPopover(dom,props.options))}
        else if (attrs.onClick) { attrs.onClick(); }
    }
    function optionClick(option) {
        let { attrs = {}, onClick, close, text } = option;
        if (onClick) { onClick(option); }
        else if (attrs.onClick) { attrs.onClick(option); }
        else if (onChange) {
            if (types.isInput) { /*do nothing*/}
            else if (types.isMultiple) {
                if (value.indexOf(option.value) === -1) { onChange(value.concat(option.value)) }
                else { onChange(value.filter((o) => o !== option.value)) }
            }
            else { onChange(option.value, option) }
        }
        if (close) { toggle(false) }
    }
    function getOptionProp(option: I_AIOInput_option, key: string, def?: any, preventFunction?: boolean) {
        let optionResult = typeof option[key] === 'function' && !preventFunction ? option[key](option, props) : option[key]
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
            let res = prop(option, props);
            return res === undefined ? def : res;
        }
        return prop !== undefined ? prop : def;
    }
    function getContext(): I_AIOInput_context {
        let context: I_AIOInput_context = {
            rootProps: props, datauniqid,touch: 'ontouchstart' in document.documentElement,
            Drag, open, click, optionClick,types,showPassword, setShowPassword,getOptionProp
        }
        return context
    }
    function getTimeText(obj) {
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
    let render = {
        list: () => <List />,
        file: () => <File />,
        select: () => <Layout properties={{text:props.text || getSelectText()}}/>,
        button: () => <Layout />,
        multiselect: () => <Multiselect />,
        radio: () => <Layout properties={{text:<Options />}} />,
        tabs: () => <Layout properties={{text:<Options />}} />,
        checkbox: () => <Layout />,
        datepicker: () => <Layout properties={{text:getDatepickerText(props)}}/>,
        image: () => <Layout properties={{text:<Image />}} />,
        map: () => <Layout properties={{text:<Map />}} />,
        table: () => <Table />,
        text: () => <Layout properties={{text:<Input />}} />,
        password: () => <Layout properties={{text:<Input />}} />,
        textarea: () => <Layout properties={{text:<Input />}} />,
        number: () => <Layout properties={{text:<Input />}} />,
        color: () => <Layout properties={{text:<Input />}} />,
        slider: () => <Layout properties={{text:<Slider />}} />,
        form: () => <Form />,
        time: () => {
            let getProps = () => {
                let { calendarType, onChange, style } = props;
                let today = AIODate().getToday({ calendarType });
                let todayObject = { year: today[0], month: today[1], day: today[2], hour: today[3], minute: today[4], second: today[5] }
                let value = props.value || {};
                for (let prop in value) { if (value[prop] === true) { value[prop] = todayObject[prop] } }
                let popover = props.popover || {};
                let className = 'aio-input-time';
                className += props.className ? ' ' + props.className : '';
                return { text: getTimeText(value), attrs: addToAttrs(props.attrs, { style: { direction: 'ltr' } }), popover, onChange, value, className, style }
            }
            let { text, attrs, popover = {}, onChange, className, style } = getProps()
            return (
                <AIOInput
                    caret={false} text={text} {...props} attrs={attrs} type='button' className={className} style={style}
                    popover={!onChange ? undefined : {
                        position: 'center', ...popover, attrs: addToAttrs(popover.attrs, { className: 'aio-input-time-popover' }),
                        body:{render: ({ close }) => <TimePopover value={getProps().value} onChange={(obj) => onChange(obj)} onClose={() => close()} />}
                    }}
                />
            )
        }
    }
    if (!type || !render[type]) { return null }
    return (<AICTX.Provider key={datauniqid} value={getContext()}>{render[type]()}{popup.render()}</AICTX.Provider>)
}
export type I_AIOInput_Popover_props = {
    getRootProps: () => I_AIOInput, id: string, toggle: (popover: any) => void,types:any
}
class Popover {
    props: I_AIOInput_Popover_props;
    isActive: boolean;
    constructor(props: I_AIOInput_Popover_props) {
        this.props = props;
        this.isActive = this.getIsActive();
    }
    getIsActive = () => {
        let { getRootProps } = this.props;
        let { popover, type, options } = getRootProps();
        if (type === 'datepicker' || type === 'select' || type === 'multiselect') { return true }
        if (type === 'button') { return !!popover }
        if (type === 'text' || type === 'number' || type === 'textarea') { return !!options }
        return false
    }
    getBackdrop = (popover) => {
        let { id } = this.props, { backdrop = {} } = popover;
        return { ...backdrop, attrs: addToAttrs(backdrop.attrs, { className: 'aio-input-backdrop ' + id }) }
    }
    getPopover = (popover, dom) => {
        let { getRootProps, id } = this.props;
        let { type } = getRootProps();
        let { fixStyle, fitHorizontal = ['multiselect', 'text', 'number', 'textarea'].indexOf(type) !== -1 } = popover;
        return { fixStyle, fitHorizontal, pageSelector: '.aio-input-backdrop.' + id, getTarget: () => $(dom.current) }
    }
    getFn = () => {
        if (!this.isActive) { return }
        let { getRootProps, toggle } = this.props,rootProps = getRootProps()
        return (dom:any) => {
            let popover = { ...(rootProps.popover || {}) }
            let { rtl } = rootProps;
            let { position = 'popover', header,body = {} } = popover;
            return {
                onClose: () => toggle(false),rtl, header, position,backdrop: this.getBackdrop(popover),
                body:{
                    ...body,
                    render:({close})=>{
                        if (rootProps.type === 'button') { return body.render({ close }) }
                        else if (rootProps.type === 'datepicker') { let p:I_Calendar = {onClose:close}; return <Calendar {...p} /> }
                        else {return body.render?body.render({ close }):<Options />}
                    }
                },
                popover: this.getPopover(popover, dom),
                attrs: addToAttrs(popover.attrs, { className: `aio-input-popover aio-input-popover-${rtl ? 'rtl' : 'ltr'}` })
            }
        }
    }
}
export type type_time_value = { year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number }
export type I_TimePopver = { lang?: 'en' | 'fa', value: type_time_value, onChange: (value: type_time_value) => void, onClose: () => void }
function TimePopover(props: I_TimePopver) {
    let { lang = 'fa', onChange, onClose } = props;
    let [startYear] = useState(props.value.year ? props.value.year - 10 : undefined);
    let [endYear] = useState(props.value.year ? props.value.year + 10 : undefined);
    let [value, setValue] = useState<type_time_value>({ ...props.value })
    function change(obj) { setValue({ ...value, ...obj }) }
    function translate(key) {
        return lang === 'fa' ? { 'year': 'سال', 'month': 'ماه', 'day': 'روز', 'hour': 'ساعت', 'minute': 'دقیقه', 'second': 'ثانیه', 'Submit': 'ثبت' }[key] : key
    }
    function getTimeOptions(type) {
        let { year, month, day } = value;
        if (type === 'year') { return new Array(endYear - startYear + 1).fill(0).map((o, i) => { return { text: i + startYear, value: i + startYear } }) }
        if (type === 'day') {
            let length = !year || !month ? 31 : AIODate().getMonthDaysLength({ date: [year, month] });
            if (day > length) { change({ day: 1 }) }
            return new Array(length).fill(0).map((o, i) => { return { text: i + 1, value: i + 1 } })
        }
        if (type === 'month') { return new Array(12).fill(0).map((o, i) => { return { text: i + 1, value: i + 1 } }) }
        return new Array(type === 'hour' ? 24 : 60).fill(0).map((o, i) => { return { text: i, value: i } })
    }
    function layout(type) {
        if (typeof value[type] !== 'number') { return false }
        return {
            column: [
                { html: translate(type), className: 'align-vh', size: 36 },
                { html: (<AIOInput type='list' value={value[type]} options={getTimeOptions(type)} size={48} width={72} onChange={(v) => change({ [type]: v })} />) }
            ]
        }
    }
    function submit() { onChange(value); onClose(); }
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
    let { rootProps }: I_AIOInput_context = useContext(AICTX);
    let [popup] = useState(new AIOPopup());
    let { value = {}, width, height, onChange, disabled, loading, placeholder, preview } = rootProps;
    let [url, setUrl] = useState<string>();
    let dom = createRef()
    // if(typeof value === 'object'){
    //     let fr = new FileReader();
    //     fr.onload = function () {
    //         $(dom.current).attr('src',fr.result)
    //     }
    //     fr.readAsDataURL(value);
    // }
    useEffect(() => {
        if (value.file) {changeUrl(value.file)}
        else if (typeof value.url === 'string') {if (url !== value.url) { setUrl(value.url) }}
        else { setUrl(undefined) }//notice
    })
    function changeUrl(file:any, callback?:Function) {
        try {
            let fr = new FileReader();
            fr.onload = function () {
                if (url !== fr.result) {
                    setUrl(fr.result as any);
                    if(callback){callback(fr.result)}
                }
            }
            fr.readAsDataURL(file);
        }
        catch { }
    }
    function openPopup() {
        popup.addModal({
            header: {title: '',onClose: (e) => {e.stopPropagation(); e.preventDefault(); popup.removeModal();}},
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
            <img ref={dom as any} src={url} alt={placeholder} style={{ objectFit: 'cover' }} width={width} height={height} />
            {typeof onChange === 'function' && <div onClick={(e) => { e.stopPropagation(); e.preventDefault(); onChange(undefined) }} className='aio-input-image-remove'><Icon path={mdiClose} size={1} /></div>}
            {preview && <div onClick={(e) => { e.stopPropagation(); e.preventDefault(); openPopup() }} className='aio-input-image-preview'><Icon path={mdiImage} size={1} /></div>}
            {popup.render()}
        </>
    ) : <span className='aio-input-image-placeholder'>{placeholder}</span>
    if (!onChange) {
        return IMG
    }
    return (
        <AIOInput
            disabled={!!disabled || !!loading}
            type='file' justify={true} text={IMG} attrs={{ style: { width: '100%', height: '100%', padding: 0 } }}
            onChange={(file) => {
                changeUrl(file, (url) => {
                    onChange({ file, url })
                });
            }}
        />
    )
}
function Multiselect() {
    let { rootProps }: I_AIOInput_context = useContext(AICTX);
    let { style = {} } = rootProps.attrs || {};
    return (<div className={'aio-input-multiselect-container'} style={{ width: style.width }}><Layout /><Tags /></div>)
}
function Tags() {
    let { rootProps, getOptionProp }: I_AIOInput_context = useContext(AICTX);
    let { value = [], rtl, hideTags, options = [] } = rootProps;
    if (!value.length || hideTags) { return null }
    return (
        <div className={`aio-input-tags${rtl ? ' rtl' : ''}`}>
            {
                value.map((o, i) => {
                    let option = options.find((option) => o === getOptionProp(option, 'value'))
                    if (option === undefined) { return null }
                    return <Tag key={i} value={o} option={option} />
                })
            }
        </div>
    )
}
type I_Tag = { option:I_AIOInput_option, value:any }
function Tag(props:I_Tag) {
    let { rootProps, getOptionProp } = useContext(AICTX);
    let {onChange = () => { }} = rootProps;
    let {option,value} = props;
    let text = getOptionProp(option, 'text');
    let tagAttrs = getOptionProp(option, 'tagAttrs', {});
    let tagBefore = getOptionProp(option, 'tagBefore', <Icon path={mdiCircleMedium} size={0.7} />);
    let tagAfter = getOptionProp(option, 'tagAfter');
    let disabled = getOptionProp(option, 'disabled') || rootProps.disabled;
    let onRemove = disabled ? undefined : () => { onChange(rootProps.value.filter((o) => o !== value)) }
    return (
        <div {...tagAttrs} className={'aio-input-tag' + (tagAttrs.className ? ' ' + tagAttrs.className : '') + (disabled ? ' disabled' : '')} style={tagAttrs.style}>
            <div className='aio-input-tag-icon'>{tagBefore}</div>
            <div className='aio-input-tag-text'>{text}</div>
            {tagAfter !== undefined && <div className='aio-input-tag-icon'>{tagAfter}</div>}
            <div className='aio-input-tag-icon' onClick={onRemove}><Icon path={mdiClose} size={0.7} /></div>
        </div>
    )
}
function Input() {
    let { rootProps, types, showPassword }: I_AIOInput_context = useContext(AICTX)
    let { type } = rootProps;
    let {
        min, max, swip, onChange, blurChange, maxLength = Infinity, justNumber, filter = [], delay = 400, disabled, options, placeholder,
        inputAttrs, spin, justify
    } = rootProps;
    let [dom] = useState(createRef())
    let [container] = useState(createRef())
    let [timeout] = useState<any>()
    let [datauniqid] = useState(`ac${Math.round(Math.random() * 100000)}`)
    let [value, setValue] = useState<any>(rootProps.value || '');
    useEffect(() => {
        if (type === 'number' && swip) {
            AIOSwip({
                speedY: 0.2, reverseY: true, minY: min, maxY: max,
                dom: () => $(dom.current),
                start: () => [0, value || 0],
                move: ({ y }) => {
                    if (min !== undefined && y < min) { y = min; }
                    if (max !== undefined && y > max) { y = max }
                    change(y, onChange)
                }
            })
        }
    }, [])
    useEffect(() => { setValue(rootProps.value) }, [rootProps])
    function convertPersianDigits(value) {
        try {
            value = value.toString();
            let res = '';
            for (let i = 0; i < value.length; i++) {
                let dic = {
                    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9"
                }
                res += dic[value[i]] || value[i];
            }
            value = res;
        }
        catch { }
        return value
    }
    function change(value, onChange) {
        if (rootProps.type === 'number') { if (value) { value = +value; } }
        else if (types.hasKeyboard) {
            if (value) {
                value = convertPersianDigits(value);
                if (justNumber) {
                    value = value.toString();
                    let lastChar = value[value.length - 1];
                    if (lastChar === ' ' || isNaN(+lastChar)) {
                        if (Array.isArray(justNumber)) {
                            if (justNumber.indexOf(lastChar) === -1) { value = value.slice(0, value.length - 1) }
                        }
                        else { value = value.slice(0, value.length - 1) }
                    }
                }
                if (filter.length) {
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
                if (value.toString().length > maxLength) {
                    value = value.toString().slice(0, maxLength);
                }
            }
        }
        setValue(value);
        if (!blurChange) {
            clearTimeout(timeout);
            timeout = setTimeout(() => onChange(value), delay);
        }
    }
    function blur(onChange) { if (blurChange) { onChange(value) } }
    function getInputAttrs() {
        let InputAttrs = addToAttrs(inputAttrs, {
            className: !spin ? 'no-spin' : undefined,
            style: justify ? { textAlign: 'center' } : undefined
        })
        let p = {
            ...InputAttrs, value, type, ref: dom, disabled, placeholder,
            onChange: onChange ? (e) => change(e.target.value, onChange) : undefined,
            onBlur: () => blur(onChange)
        }
        if (type === 'color' && options) { p = { ...p, list: datauniqid } }
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
        return (
            <label style={{ width: '100%', height: '100%', background: value }}>
                <input {...attrs} style={{ opacity: 0 }} />
                {options && <datalist id={datauniqid}>{options.map((o) => <option value={o} />)}</datalist>}
            </label>
        )
    }
    else if (type === 'textarea') { return <textarea {...attrs} /> }
    else { return (<input {...attrs} />) }
}
function Form() {
    let {rootProps}:I_AIOInput_context = useContext(AICTX)
    let {onChange ,getErrors,body,inputs,footer, initialDisabled,rtl, disabled,labelAttrs,errorAttrs,lang,attrs} = rootProps;
    let [initialValue] = useState<any>(JSON.stringify(rootProps.value))
    let [value,setValue] = useState(rootProps.value || {})
    let [errors] = useState({})
    let [reportedErrors] = useState<string>()
    function getValue() {
        let res;
        if(onChange){res = rootProps.value}
        else{res = value}
        return res || {}
    }
    function GetErrors() { return [...Object.keys(errors).filter((o) => !!errors[o]).map((o) => errors[o])] }
    function removeError(field) {
        let newErrors = {}
        for (let prop in errors) { if (prop !== field) { newErrors[prop] = errors[prop] } }
        errors = newErrors
    }
    function SetValue({ itemValue, formItem, field }) {
        //اگر فرم آیتم ارسال شد یعنی در حال تغییر مستقیم توسط یک اینپوت هستیم
        //اگر فیلد ارسال شد یعنی خارج از برنامه داریم یک پروپرتی را چنج می کنیم پس ارور هندلینگ نباید انجام شود
        let Field = field || formItem.field
        let value = getValue();
        let newValue = setValueByField(value, Field, itemValue);
        if (!field) {
            let error = getError(formItem, itemValue)
            if (error) { errors[Field] = error }
            else { removeError(Field) }
        }
        if (onChange) { onChange(newValue, GetErrors()) }
        else { setValue(newValue) }
    }
    function body_node():I_RVD_node {
        let { attrs = {} } = body;
        if (Array.isArray(inputs)) { inputs = { column: inputs.map((o) => input_node(o)) } }
        let className = 'aio-input-form-body';
        if (attrs.className) { className += ' ' + attrs.className }
        let style = attrs.style;
        let res = { flex: 1, className, style, ...inputs }
        return res
    }
    function Reset() {
        if (onChange) { onChange(JSON.parse(initialValue)) }
        else { SetValue(JSON.parse(initialValue) ) }
    }
    function isDisabled(){
        let disabled = false;
        if (!!GetErrors().length) { disabled = true }
        else if (initialDisabled && initialValue === JSON.stringify(getValue())) { disabled = true }
        return disabled
    }
    function footer_node():I_RVD_node {
        if (!footer) { return {} }
        let {onSubmit,onClose,reset,layout,attrs,submitText = 'Submit',closeText = 'Close',resetText = 'Reset',before,after} = footer;
        let disabled = isDisabled();
        if (layout) {
            let html = layout({ reset:Reset,disabled, errors: GetErrors() });
            if(!html || html === null){return {}}
            return { html }
        }
        return {
            className: 'aio-input-form-footer' + (attrs.className ? ' ' + attrs.className : ''), style: attrs.style,
            html: (
                <>
                    {!!before && before}
                    {!!onClose && <button onClick={() => onClose()} className='aio-input-form-close-button aio-input-form-footer-button'>{closeText}</button>}
                    {!!reset && <button onClick={() => Reset()} className='aio-input-form-reset-button aio-input-form-footer-button'>{resetText}</button>}
                    {!!onSubmit && <button disabled={disabled} onClick={() => onSubmit()} className='aio-input-form-submit-button aio-input-form-footer-button'>{submitText}</button>}
                    {!!after && after}
                </>
            )
        }
    }
    function getDefault({ type, multiple }) {
        return { file: [], multiselect: [], radio: multiple ? [] : undefined, slider: multiple ? [] : undefined }[type]
    }
    function getValueByField(p:{ field:string | ((value:any)=>string), def?:any, functional?:boolean, value?:any }) {
        let { field, def, functional, value = getValue() } = p;
        let a;
        if (functional && typeof field === 'function') { a = field(value); }
        else if (typeof field === 'string') {
            if (field.indexOf('value.') !== -1 /*|| field.indexOf('props.') !== -1*/) {
                try { eval(`a = ${field}`); }
                catch { }
            }
            else { a = field }
        }
        else { a = field }
        return a === undefined ? def : a;
    }
    function setValueByField(obj = {}, field, value) {
        try {
            field = field.replaceAll('[', '.');
            field = field.replaceAll(']', '');
        }
        catch { }
        var fields = field.split('.');
        var node = obj;
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
    useEffect(()=>{
        reportErrors()
    })
    function reportErrors() {
        if (!getErrors) { return }
        let errors = GetErrors();
        if (JSON.stringify(errors) !== reportedErrors) {
            getErrors(errors);
            reportedErrors = JSON.stringify(errors)
        }
    }
    function getAttrs(propsAttrs:any = {}, ownAttrs:any = {}) {
        let style = { ...propsAttrs.style, ...ownAttrs.style }
        return { ...propsAttrs, ...ownAttrs, style }
    }
    function getInputProps(input, formItem) {
        let value = getValueByField({ field: formItem.field, def: getDefault(input) });
        let props:I_AIOInput = {
            rtl, value,type:input.type,
            onChange: (value) => {
                if (input.type === 'map' && formItem.addressField && value.address) {
                    setValue({ itemValue: value.address, field: formItem.addressField })
                }
                setValue({ itemValue: value, formItem })
            }, attrs: {},inputAttrs:{},disabled:false,pointLabel:()=>{return {show:'inline'}}
        };
        for (let prop in input) {
            let functional = ['options'].indexOf(prop) !== -1;
            props[prop] = getValueByField({ field: input[prop], functional })
        }
        props.value = value;
        let { attrs = {} } = input;
        for (let prop in attrs) { props.attrs[prop] = getValueByField({ field: attrs[prop] }) }
        if (disabled) { props.disabled = true; }
        if (['text', 'number', 'password', 'textarea'].indexOf(input.type) !== -1) {
            let { inputAttrs = {} } = input;
            props.inputAttrs = {};
            for (let prop in inputAttrs) { props.inputAttrs[prop] = getValueByField({ field: inputAttrs[prop] }) }
        }
        return props;
    }
    function get_node(key, value, attrs):I_RVD_node {
        if (!value) { return {} }
        let cls = 'aio-input-form';
        let className = { 'label': `${cls}-label`, 'footer': `${cls}-item-footer`, 'error': `${cls}-error` }[key];
        attrs = addToAttrs(attrs, { className })
        return { html: value, align: 'v', attrs }
    }
    function input_node(formItem):I_RVD_node {
        let { label, footer, input, flex, size, field } = formItem;
        let value = getValueByField({ field, def: getDefault(input) });
        let error = getError(formItem, value)
        if (error) { errors[field] = error }
        else { errors[field] = undefined }
        let LabelAttrs = getAttrs(labelAttrs, formItem.labelAttrs)
        let ErrorAttrs = getAttrs(errorAttrs, formItem.errorAttrs)
        let InputProps:I_AIOInput = getInputProps(input, formItem);
        return {
            flex, size, className: 'aio-input-form-item',
            column: [
                {
                    flex: 1, className: 'aio-input-form-item-input-container of-visible',
                    column: [
                        get_node('label', label, LabelAttrs),
                        { className: 'aio-input-form-item-input-container of-visible', html: <AIOInput {...InputProps} /> },
                    ]
                },
                footer?{html:footer}:{},
                get_node('error', error, ErrorAttrs)
            ]
        }
    }
    function getError(o, value) {
        let { validations = [], input } = o;
        let { type } = input;
        if (!validations.length || type === 'html') { return '' }
        //در مپ مقدار یک آبجکت است پس لت و ال ان جی در مجموع به یک مقدار بولین مپ می کنیم تا فقط در ریکوآیرد بتوان ارور هندلینگ انجام داد
        if (input.type === 'map') { value = !!value && !!value.lat && !!value.lng }
        let a = {
            value, title: o.label, lang,
            validations: validations.map((a) => {
                let params = a[2] || {};
                let target = typeof a[1] === 'function' ? a[1] : getValueByField({ field: a[1], def: '' });
                let operator = a[0];
                return [operator, target, params]
            })
        }
        return AIOValidation(a);
    }
    attrs = addToAttrs(attrs, { className: 'aio-input-form' + (rtl ? ' aio-input-form-rtl' : '') })
    return (
        <RVD
            editNode={(obj, parent:any = {}) => {
                let show = getValueByField({ field: obj.show, def: true });
                if (show === false) { return false }
                if (obj.input) { return input_node({ ...obj, flex: parent.row && !obj.size && !obj.flex ? 1 : undefined }) }
                if (parent.input) { obj.className = 'of-visible' }
                return { ...obj }
            }}
            rootNode={{ attrs, column: [body_node(), footer_node()] }}
        />
    )
}
type I_Options = {options?:any[]}
function Options(props:I_Options) {
    let { rootProps, types,getOptionProp }:I_AIOInput_context = useContext(AICTX);
    let [searchValue, setSearchValue] = useState('');
    function renderSearchBox(options) {
        if (rootProps.type === 'tabs' || types.isInput || !rootProps.search) { return null }
        if (searchValue === '' && options.length < 10) { return null }
        return (
            <div className='aio-input-search'>
                <input type='text' value={searchValue} placeholder={rootProps.search} onChange={(e) => setSearchValue(e.target.value)} />
                <div className='aio-input-search-icon' onClick={() => { setSearchValue('') }}>
                    <Icon path={searchValue ? mdiClose : mdiMagnify} size={.8} />
                </div>
            </div>
        )
    }
    function getDefaultOptionChecked(v){
        if (rootProps.type === 'multiselect') { return rootProps.value.indexOf(v) !== -1 }
        if (rootProps.type === 'radio') { return types.isMultiple ? rootProps.value.indexOf(v) !== -1 : rootProps.value === v }
    }
    function getOptions() {
        let { options = [] } = rootProps;
        let result = [];
        let renderIndex = 0;
        let draggable = types.isDropdown && types.hasOption && rootProps.onSwap;
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let disabled = !!rootProps.disabled || getOptionProp(option, 'disabled');
            let show = getOptionProp(option, 'show')
            if (show === false) { continue }
            let text = getOptionProp(option, 'text');
            //در اینپوت ها آپشن هایی رو نشون بده که با ولیو مچ هستند
            //if (types.isInput && value && text.toString().indexOf(value.toString()) !== 0) { continue }
            let optionValue = getOptionProp(option, 'value')
            let attrs = getOptionProp(option, 'attrs', {});
            let obj = {
                object:{...option},
                attrs, text, value: optionValue, disabled, draggable,
                checkIcon: getOptionProp(option, 'checkIcon', [], true),
                checked: getOptionProp(option, 'checked', getDefaultOptionChecked(optionValue)),
                before: getOptionProp(option, 'before'),
                after: getOptionProp(option, 'after'),
                justify: getOptionProp(option, 'justify'),
                subtext: getOptionProp(option, 'subtext'),
                onClick: getOptionProp(option, 'onClick', undefined, true),
                className: getOptionProp(option, 'className'),
                style: getOptionProp(option, 'style'),
                tagAttrs: getOptionProp(option, 'tagAttrs'),
                tagBefore: getOptionProp(option, 'tagBefore'),
                close: getOptionProp(option, 'close', rootProps.type !== 'multiselect'),
                tagAfter: getOptionProp(option, 'tagAfter'),
                renderIndex, realIndex: i
            }
            if (optionValue === rootProps.value) { obj.attrs = addToAttrs(obj.attrs, { className: 'active' }) }
            result.push(obj)
            renderIndex++;
        }
        return result;
    }
    function getRenderOptions(options) {
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
    let options = props.options || getOptions();
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
//column schema
//title,value,width,minWidth,justify,type,onChange,cellAttrs,subtext,before,after
export type type_table_column = {
    title?: string,
    value?: any,
    sort?: true | type_table_sort,
    search?: boolean,
    id?: string,
    _id?: string,
    width?: number,
    minWidth?: number,
    input?: I_AIOInput,
    onChange?: (newValue: any) => void,
    excel?: boolean
}
export type type_table_sort = {
    active?: boolean, dir?: 'dec' | 'inc', title?: string, type?: 'string' | 'number', sortId?: string, getValue?: (row: any) => any
}
export type type_table_temp = { start?: any, isInitSortExecuted?: boolean }
export type type_table_paging = {
    serverSide?: boolean,
    number: number,
    size: number,
    length?: number,
    sizes?: number[],
    onChange?: (newPaging: type_table_paging) => void
}
export type type_table_getCellAttrs = (p: { row: any, rowIndex: number, column: type_table_column, type: 'title' | 'cell' }) => any;
export type type_table_context = {
    rootProps: I_AIOInput,
    columns: type_table_column[],
    ROWS: { rows: any[], searchedRows: any[], sortedRows: any[], pagedRows: any[] },
    add: () => void, remove: (row: any, index: number) => void, search: (searchValue: string) => void,
    exportToExcel: () => void,
    sorts: type_table_sort[],
    setSorts: (newSorts: type_table_sort[]) => void,
    sortRows: (rows: any[], sorts: type_table_sort[]) => any[],
    excelColumns: type_table_column[],
    addToAttrs:I_AIOInput_addToAttrs,
    getRowAttrs: (row: any, rowIndex: number) => any,
    getCellAttrs: type_table_getCellAttrs,
    getCellContent: (p: { row: any, rowIndex: number, column: type_table_column }) => React.ReactNode
}
const AITableContext = createContext({} as any);
function Table() {
    let { rootProps }: I_AIOInput_context = useContext(AICTX);
    let { paging, getValue, value, onChange = () => { }, onAdd, onRemove, excel, onSwap, onSearch, rowAttrs, attrs,onChangeSort } = rootProps;
    let [dom] = useState(createRef())
    let [searchValue, setSearchValue] = useState('')
    let [columns, setColumns] = useState<type_table_column[]>();
    let [searchColumns, setSearchColumns] = useState<type_table_column[]>();
    let [excelColumns, setExcelColumns] = useState<type_table_column[]>();
    let [temp] = useState<type_table_temp>({})
    function getColumns() {
        let { columns } = rootProps;
        let searchColumns = [], excelColumn = [];
        let updatedColumns = columns.map((o) => {
            let { id = 'aitc' + Math.round(Math.random() * 1000000), sort, search, excel } = o;
            let column = { ...o, _id: id };
            if (search) { searchColumns.push(column) }
            if (excel) { excelColumns.push(column) }
            return column
        })
        setColumns(updatedColumns);
        setSearchColumns(searchColumns)
        setExcelColumns(excelColumns)
    }
    let [sorts, setSorts] = useState<type_table_sort[]>([])
    function getSorts() {
        let sorts = [];
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            let { _id, input } = column;
            let sort = column.sort === true ? {} : column.sort;
            if (!sort) { continue }
            let { active = false, dir = 'dec' } = sort as type_table_sort;
            let getValue;
            if (sort.getValue) { getValue = sort.getValue }
            else {
                getValue = (row) => {
                    let value = getDynamics({ value: column.value, row, column })
                    if (input && input.type === 'datepicker') { value = AIODate().getTime({ date: value }); }
                    return value
                }
            }
            let type;
            if (input && ['number', 'date', 'slider'].indexOf(input.type) !== -1) { type = 'number' }
            else { type = sort.type || 'string' }
            let sortItem: type_table_sort = { dir, title: sort.title || column.title, sortId: _id, active, type, getValue }
            sorts.push(sortItem)
        }
        return sorts;
    }
    function getDynamics(p: { value: any, row?: any, column?: type_table_column, def?: any, rowIndex?: number }) {
        let { value, row, column, def, rowIndex } = p;
        if (paging) {
            let { serverSide, number, size } = paging;
            if (!serverSide) { rowIndex += ((number - 1) * size) }
        }
        let type = typeof value;
        if (type === 'string') {
            let result = value;
            if (getValue[value]) { result = getValue[value]({ row, column, rowIndex }) }
            else if (value.indexOf('row.') !== -1) { try { eval(`result = ${value}`); } catch { result = '' } }
            return result === undefined ? def : result;
        }
        if (type === 'undefined') { return def }
        if (type === 'function') { return value({ row, column, rowIndex }) }
        return value === undefined ? def : value
    }
    function setCell(row: any, column: type_table_column, cellNewValue?: any) {
        if (column.input && column.input.onChange) { column.input.onChange({ value: cellNewValue, row, column }) }
        else {
            row = JSON.parse(JSON.stringify(row));
            eval(`${column.value} = cellNewValue`);
            onChange(value.map((o) => o._id !== row._id ? o : row))
        }
    }
    useEffect(() => {
        getColumns();
        getSorts();
    }, [])
    function add() {
        if (typeof onAdd === 'function') { onAdd(); }
        else if (typeof onAdd === 'object') { onChange([onAdd, ...value]) }
    }
    function remove(row, index) {
        let action = () => onChange(value.filter((o, i) => o._id !== row._id));
        if (typeof onRemove === 'function') { onRemove({ row, action, rowIndex: index }); }
        else if (onRemove === true) { action(); }
    }
    function exportToExcel() {
        let list = [];
        for (let i = 0; i < value.length; i++) {
            let row = value[i], json = {};
            for (let j = 0; j < excelColumns.length; j++) {
                let column = excelColumns[j], { title, excel, value } = column;
                json[typeof excel === 'string' ? excel : title] = getDynamics({ value, row, column, rowIndex: i })
            }
            list.push(json)
        }
        ExportToExcel(list, { promptText: typeof excel === 'string' ? excel : 'Inter Excel File Name' })
    }
    function dragStart(e, row) { temp.start = row; }
    function dragOver(e, row) { e.preventDefault(); }
    function getIndexById(rows, id) { for (let i = 0; i < rows.length; i++) { if (rows[i]._id === id) { return i } } }
    function drop(e, row) {
        if (temp.start._id === undefined) { return }
        if (temp.start._id === row._id) { return }
        let newValue = value.filter((o) => o._id !== temp.start._id);
        let placeIndex = getIndexById(value, row._id);
        newValue.splice(placeIndex, 0, temp.start)
        if (typeof onSwap === 'function') { onSwap(newValue, { ...temp.start }, row) }
        else { onChange(newValue) }
    }
    function getSearchedRows(rows) {
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
    function sortRows(rows = [], sorts = []) {
        if (!sorts.length) { return rows }
        return rows.sort((a, b) => {
            for (let i = 0; i < sorts.length; i++) {
                let { dir, getValue } = sorts[i];
                let aValue = getValue(a), bValue = getValue(b);
                if (aValue < bValue) { return -1 * (dir === 'dec' ? -1 : 1); }
                if (aValue > bValue) { return 1 * (dir === 'dec' ? -1 : 1); }
                if (i === sorts.length - 1) { return 0; }
            }
            return 0;
        });
    }
    function getSortedRows(rows) {
        if (temp.isInitSortExecuted) { return rows }
        if (onChangeSort) { return rows }
        let activeSorts = sorts.filter((sort) => sort.active !== false);
        if (!activeSorts.length) { return rows }
        if (rows.length) { temp.isInitSortExecuted = true; onChange(sortRows(rows, activeSorts)) }
        else { return rows; }
    }
    function getRows() {
        let searchedRows = getSearchedRows(value);
        let sortedRows = getSortedRows(searchedRows);
        let pagedRows = paging && !paging.serverSide ? sortedRows.slice((paging.number - 1) * paging.size, paging.number * paging.size) : sortedRows;
        return { rows: value, searchedRows, sortedRows, pagedRows }
    }
    //calculate style of cells and title cells
    function getCellStyle(column) {
        let width = getDynamics({ value: column.width });
        let minWidth = getDynamics({ value: column.minWidth });
        return { width: width ? width : undefined, flex: width ? undefined : 1, minWidth }
    }
    function getCellAttrs({ row, rowIndex, column, type }) {
        let attrs = getDynamics({ value: column[`${type}Attrs`], column, def: {}, row, rowIndex });
        let justify = getDynamics({ value: column.justify, def: false });
        let cls = `aio-input-table-${type}` + (justify ? ` aio-input-table-${type}-justify` : '')
        attrs = addToAttrs(attrs, { className: cls, style: getCellStyle(column) });
        if (type === 'title') { attrs.title = getDynamics({ value: column.title, def: '' }) }
        return { ...attrs }
    }
    function getRowAttrs(row, rowIndex) {
        let attrs = rowAttrs ? rowAttrs({ row, rowIndex }) : {};
        let obj = addToAttrs(attrs, { className: 'aio-input-table-row' })
        if (!!onSwap) { obj = { ...obj, draggable: true, onDragStart: (e) => dragStart(e, row), onDragOver: (e) => dragOver(e, row), onDrop: (e) => drop(e, row) } }
        return obj;
    }
    function getCellContent({ row, rowIndex, column }) {
        let template = getDynamics({ value: column.template, row, rowIndex, column });
        if (template !== undefined) { return template }
        let input = getDynamics({ value: column.input, row, rowIndex, column });
        if (!input) { input = { type: 'text' } }
        let convertedInput = {}
        for (let prop in input) {
            if (['onChange', 'onClick'].indexOf(prop) !== -1) { convertedInput[prop] = input[prop] }
            else { convertedInput[prop] = getDynamics({ value: input[prop], row, rowIndex, column }) }
        }
        let value = getDynamics({ value: column.value, row, rowIndex, column })
        let p = { ...convertedInput, value, onChange: column.input ? (value) => setCell(row, column, value) : undefined } as I_AIOInput
        return (<AIOInput {...p} />)
    }
    function search(searchValue) {
        if (onSearch === true) { setSearchValue(searchValue) }
        else { onSearch(searchValue) }
    }
    function getContext(ROWS) {
        let context: type_table_context = {
            ROWS, addToAttrs, rootProps, columns, sorts, setSorts, sortRows, excelColumns, getCellAttrs, getRowAttrs, getCellContent,
            add, remove, search, exportToExcel,
        }
        return context
    }
    let ROWS = getRows();
    return (
        <AITableContext.Provider value={getContext(ROWS)}>
            <div {...attrs} ref={dom} className={'aio-input-table' + (attrs.className ? ' ' + attrs.className : '')}>
                <TableToolbar />
                <div className='aio-input-table-unit'><TableHeader /><TableRows /></div>
                {paging ? <TablePaging /> : ''}
            </div>
        </AITableContext.Provider>
    )
}
export type I_TableGap = { dir: 'h' | 'v' }
function TableGap(props) {
    let { rootProps }: type_table_context = useContext(AITableContext)
    let { rowGap, columnGap } = rootProps;
    let { dir } = props;
    let style;
    if (dir === 'h') { style = { height: rowGap } }
    else { style = { width: columnGap } }
    return <div className={'aio-input-table-border-${dir}'} style={style}></div>
}
function TablePaging() {
    let { ROWS, rootProps }: type_table_context = useContext(AITableContext)
    function fix(paging: type_table_paging) {
        let { number, size = 20, length = 0, sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100], serverSide } = paging
        if (!serverSide) { length = ROWS.sortedRows.length }
        if (sizes.indexOf(size) === -1) { size = sizes[0] }
        let pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        let start = number - 3;
        let end = number + 3;
        setStart(start);
        setEnd(end);

        return { ...paging, length, pages, number, size, sizes, end }
    }
    let [paging, setPaging] = useState<type_table_paging>(fix(rootProps.paging));
    let [start, setStart] = useState<number>(0);
    let [end, setEnd] = useState<number>(0);
    let [pages, setPages] = useState<number>(0);
    let [temp] = useState<{ timeout?: any }>({})
    useEffect(() => {
        setPaging(fix(rootProps.paging));
    }, [rootProps.paging])
    function changePaging(obj) {
        let newPaging = fix({ ...paging, ...obj });
        setPaging(newPaging);
        if (newPaging.serverSide) {
            clearTimeout(temp.timeout);
            temp.timeout = setTimeout(() => newPaging.onChange(newPaging), 800);
        }
        else { newPaging.onChange(newPaging) }
    }
    let { number, size, sizes } = paging;
    let buttons = [];
    let isFirst = true
    for (let i = start; i <= end; i++) {
        if (i < 1 || i > pages) {
            buttons.push(<button key={i} className={'aio-input-table-paging-button aio-input-table-paging-button-hidden'}>{i}</button>)
        }
        else {
            let index;
            if (isFirst) { index = 1; isFirst = false; }
            else if (i === Math.min(end, pages)) { index = pages }
            else { index = i; }
            buttons.push(<button key={index} className={'aio-input-table-paging-button' + (index === number ? ' active' : '')} onClick={() => changePaging({ number: index })}>{index}</button>)
        }
    }
    function changeSizeButton() {
        if (!sizes.length) { return null }
        let p: I_AIOInput = {
            attrs: { className: 'aio-input-table-paging-button aio-input-table-paging-size' },
            type: 'select', value: size, options: sizes, option:{text:'option',value:'option'},
            onChange: (value) => changePaging({ size: value }),
            popover: { fitHorizontal: true },
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
    function getContent() {
        let rows = ROWS.pagedRows || [];
        if (rowsTemplate) { return rowsTemplate(rows) }
        if (rows.length) {
            return rows.map((o, i) => {
                let { id = 'ailr' + Math.round(Math.random() * 10000000) } = o;
                o._id = o._id === undefined ? id : o._id;
                let isLast = i === rows.length - 1, Row;
                if (rowTemplate) { Row = rowTemplate({ row: o, rowIndex: i, isLast }) }
                else { Row = <TableRow key={id} row={o} rowIndex={i} isLast={isLast} /> }
                return (<Fragment key={id}>{rowBefore({ row: o, rowIndex: i })}{Row}{rowAfter({ row: o, rowIndex: i })}</Fragment>)
            })
        }
        if (placeholder) {
            return <div style={{ width: '100%', textAlign: 'center', padding: 12, boxSizing: 'border-box' }}>{placeholder}</div>
        }
        return false
    }
    let content = getContent();
    if (content === false) { return null }
    return <div className='aio-input-table-rows'>{content}</div>
}
function TableToolbar() {
    let { add, exportToExcel, sorts, sortRows, setSorts, search, rootProps, excelColumns }: type_table_context = useContext(AITableContext);
    let { toolbarAttrs, toolbar, onAdd, onSearch, onChangeSort, onChange = () => { }, value } = rootProps;
    toolbarAttrs = addToAttrs(toolbarAttrs, { className: 'aio-input-table-toolbar' })
    if (!onAdd && !toolbar && !onSearch && !sorts.length && !excelColumns.length) { return null }
    function changeSort(sortId, changeObject) {
        let newSorts = sorts.map((sort) => {
            if (sort.sortId === sortId) {
                let newSort = { ...sort, ...changeObject }
                return newSort;
            }
            return sort
        });
        changeSorts(newSorts)
    }
    async function changeSorts(sorts) {
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

    function getSortOption(sort: type_table_sort) {
        let { active, dir = 'dec', title, sortId } = sort;
        return {
            text: title, checked: !!active, close: false, value: sortId,
            after: (
                <div onClick={(e) => { e.stopPropagation(); changeSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' }) }}>
                    <Icon path={dir === 'dec' ? mdiArrowDown : mdiArrowUp} size={0.8}/>
                </div>
            )
        }
    }
    function button() {
        if (!sorts.length) { return null }
        let sortOptions = sorts.map((sort) => getSortOption(sort));
        return (
            <AIOInput
                popover={{ header: { attrs: { className: 'aio-input-table-toolbar-popover-header' }, title: 'Sort', onClose: false }, pageSelector: '.aio-input-table' }}
                key='sortbutton' caret={false} type='select' options={sortOptions}
                attrs={{ className: 'aio-input-table-toolbar-icon' }}
                text={<Icon path={mdiSort} size={0.7} />}
                onSwap={(from, to, swap) => changeSorts(swap(sorts, from, to))}
                onChange={(value, option) => changeSort(value, { active: !option.checked })}
            />
        )
    }
    return (
        <>
            <div {...toolbarAttrs}>
                {toolbar && <div className='aio-input-table-toolbar-content'>{typeof toolbar === 'function' ? toolbar() : toolbar}</div>}
                <div className='aio-input-table-search'>
                    {!!onSearch && <AIOInput type='text' onChange={(value) => search(value)} after={<Icon path={mdiMagnify} size={0.7} />} />}
                </div>
                {button()}
                {!!excelColumns.length && <div className='aio-input-table-toolbar-icon' onClick={() => exportToExcel()}><Icon path={mdiFileExcel} size={0.8} /></div>}
                {!!onAdd && <div className='aio-input-table-toolbar-icon' onClick={() => add()}><Icon path={mdiPlusThick} size={0.8} /></div>}
            </div>
            <TableGap dir='h' />
        </>
    )
}
function TableHeader() {
    let { rootProps, columns }: type_table_context = useContext(AITableContext);
    let { headerAttrs, onRemove } = rootProps;
    headerAttrs = addToAttrs(headerAttrs, { className: 'aio-input-table-header' })
    let Titles = columns.map((o, i) => <TableTitle key={o._id} column={o} isLast={i === columns.length - 1} />);
    let RemoveTitle = !onRemove ? null : <><TableGap dir='v' /><div className='aio-input-table-remove-title'></div></>;
    return <div {...headerAttrs}>{Titles}{RemoveTitle}<TableGap dir='h' /></div>
}
function TableTitle({ column, isLast }) {
    let { getCellAttrs } = useContext(AITableContext);
    let attrs = getCellAttrs({ column, type: 'title' });
    return (<><div {...attrs}>{attrs.title}</div>{!isLast && <TableGap dir='v' />}</>)
}
function TableRow({ row, isLast, rowIndex }) {
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
                {onRemove ? <><TableGap dir='v' /><button className='aio-input-table-remove' onClick={() => remove(row, rowIndex)}><Icon path={mdiClose} size={0.8} /></button></> : null}
            </div>
            <TableGap dir='h' />
        </>
    )
}
const TableCell = ({ row, rowIndex, column, isLast }) => {
    let { getCellAttrs, getCellContent }: type_table_context = useContext(AITableContext);
    let content = getCellContent({ row, rowIndex, column });
    return (
        <Fragment key={row._id + ' ' + column._id}>
            <div {...getCellAttrs({ row, rowIndex, column, type: 'cell' })} >{content}</div>
            {!isLast && <TableGap dir='v' />}
        </Fragment>
    )
}
export type I_Layout = {
    option?: I_AIOInput_option, text?: React.ReactNode, realIndex?: number, renderIndex?: number,
    properties?: any
}
function Layout(props: I_Layout) {
    let { rootProps, datauniqid, types, touch, Drag, click, optionClick, open,showPassword,setShowPassword }: I_AIOInput_context = useContext(AICTX)
    let { option, realIndex, renderIndex } = props;
    let { type, rtl, direction = 'right' } = rootProps;
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
            if (type === 'slider') {
                if (direction === 'top' || direction === 'bottom') { cls += ' aio-input-slider-vertical' }
                else { cls += ' aio-input-slider-horizontal' }
            }
            if (types.isInput) { cls += ` aio-input-input` }
            if (rtl) { cls += ' aio-input-rtl' }

        }
        if (properties.disabled) { cls += ' disabled' }
        cls += ' ' + datauniqid;
        return cls;
    }
    function cls(key) {
        let className = `aio-input-${key}`;
        if (option) { className += ` aio-input-${type}-option-${key}` }
        else { className += ` aio-input-${type}-${key}` }
        return className;
    }
    function Text():React.ReactNode {
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
            else { return <div {...p('value')}>{text}</div> }
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
        if (!types.isDropdown || option) { return null }
        let { caret } = rootProps;
        if (!caret) { return null }
        return <div className='aio-input-caret'>{caret === undefined ? <Icon path={mdiChevronDown} size={.8} /> : caret}</div>
    }
    function CheckIcon() {
        let { checkIcon, checked } = properties;
        if(checked === undefined){return null}
        if (typeof checkIcon === 'function') { return checkIcon(checked) }
        return (
            <div className={'aio-input-check-out' + (checked ? ' checked' : '')} style={{ ...checkIcon, background: 'none' }}>
                {checked && <div className={'aio-input-check-in'} style={{ background: checkIcon.background }}></div>}
            </div>
        );
    }
    function BeforeAfter(mode: 'before' | 'after') {
        let res:React.ReactNode;
        if (mode === 'after' && type === 'password' && rootProps.visible) {
            res = <div className='align-v' onClick={() => setShowPassword()}><Icon path={showPassword ? mdiEyeOff : mdiEye} size={.8} /></div>
        }
        else {let v = properties[mode]; res = typeof v === 'function'?v():v;}
        if (res === undefined) { return null }
        return <div className={cls('before')}>{res}</div>
    }
    function Loading() {
        let { loading } = properties;
        let elem;
        if (!loading) { return null; }
        else if (loading === true) { elem = <Icon path={mdiLoading} spin={0.3} size={.8} /> }
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
            if (option === undefined) { onClick = (e) => { e.stopPropagation(); click(e, dom) } }
            else { onClick = (e) => { e.stopPropagation(); optionClick(option) } }
        }
        attrs = addToAttrs(attrs, {
            className: getClassName(),
            style: { ...style, justifyContent: justify ? 'center' : undefined, zIndex }
        })
        let p = { ...attrs, onClick, ref: dom, disabled }
        if (draggable) {
            p.datarealindex = realIndex;
            p.datarenderindex = renderIndex;
            p.onDragStart = Drag.start;
            p.onDragOver = Drag.over;
            p.onDrop = Drag.drop;
            p.draggable = true;
        }
        return p;
    }
    function getProperties() {
        let p = props.properties || {};
        let obj = option || rootProps; //اگر آپشن بود از آپشن وگر نه از پروپس بخون مقادیر رو
        let { draggable = option?option.draggable:false } = p;
        let { placeholder = !option?rootProps.placeholder:undefined } = p;
        let { checked = option?option.checked:undefined } = p;
        let { disabled = obj.disabled } = p
        let { text = obj.text } = p;
        let { subtext = obj.subtext } = p;
        let { justify = obj.justify } = p;
        let { checkIcon = obj.checkIcon || {} } = p;
        let { loading = obj.loading } = p;
        let { attrs = obj.attrs || {} } = p;
        let { style = obj.style || {} } = p;
        let { before = obj.before} = p;
        let { after = obj.after} = p; 
        return { disabled, draggable, text, subtext, placeholder, justify, checked, checkIcon, loading, attrs, style,before,after }    
    }
    let properties = getProperties();
    let content = (<>
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
function File() { return (<div className='aio-input-file-container'><Layout /><FileItems /></div>) }
function InputFile() {
    let { rootProps, types }: I_AIOInput_context = useContext(AICTX);
    let { value = [], onChange = () => { }, disabled } = rootProps;
    function change(e) {
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
    let props = { disabled, type: 'file', style: { display: 'none' }, multiple: types.isMultiple, onChange: (e) => change(e) }
    return <input {...props} />
}
function FileItems() {
    let {rootProps}:I_AIOInput_context = useContext(AICTX);
    let { value, rtl } = rootProps;
    let files = [];
    if (Array.isArray(value)) { files = value }
    else if (value) { files = [value] }
    else { return null }
    if (!files.length) { return null }
    let Files = files.map((file, i) => {let p:I_FileItem = {file,index:i}; return <FileItem key={i} {...p} />})
    return (<div className='aio-input-files' style={{ direction: rtl ? 'rtl' : 'ltr' }}>{Files}</div>)
}
type I_FileItem = {file:any,index:number}
function FileItem(props:I_FileItem) {
    let {rootProps}:I_AIOInput_context = useContext(AICTX);
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
    function remove(index:number) {
        let newValue = [];
        for (let i = 0; i < value.length; i++) {
            if (i === index) { continue }
            newValue.push(value[i])
        }
        onChange(newValue);
    }
    function renderString(minName, sizeString) {
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
                <Icon path={url ? mdiDownloadOutline : mdiAttachment} size={.8} />
            </div>
            <div className='aio-input-file-name' onClick={() => {
                if (url) { DownloadUrl(url, name) }
            }}>
                {renderString(minName, sizeString)}
            </div>
            <div className='aio-input-file-icon' onClick={() => remove(index)}>
                <Icon path={mdiClose} size={.7} />
            </div>
        </div>
    )
}
const DPContext = createContext({} as any);
type I_DPContext = {
    translate: (text: string) => string,
    rootProps: I_AIOInput,
    activeDate: I_DP_activeDate,
    changeActiveDate: (obj: 'today' | I_DP_activeDate) => void,
    onChange: (p: { year?: number, month?: number, day?: number, hour?: number }) => void,
    today: any, todayWeekDay: any, thisMonthString: any,months:string[]

}
type I_Calendar = { onClose?: () => void }
type I_DP_activeDate = { year?: number, month?: number, day?: number }
function Calendar(props: I_Calendar) {
    let { rootProps }: I_AIOInput_context = useContext(AICTX);
    let { onClose } = props;
    let { unit, calendarType, value,disabled,size,theme, startYear, endYear, translate = (text) => text,onChange = () => { }, close } = rootProps;
    let { getToday, convertToArray, getMonths, getWeekDay } = AIODate();
    let [months] = useState(getMonths({ calendarType }));
    let [today, setToday] = useState(getToday({ calendarType }))
    let [todayWeekDay] = useState(getWeekDay({ date: today }).weekDay)
    let [initValue] = useState(getInitValue())
    function getInitValue() {
        let date = !value || value === null ? today : value;
        let [year, month, day] = convertToArray({ date })
        return { year, month, day }
    }
    let [thisMonthString] = useState(months[today[1] - 1])
    let [activeDate, setActiveDate] = useState<I_DP_activeDate>({ ...initValue });
    function trans(text) {
        if (text === 'Today') {
            if (unit === 'month') { text = 'This Month' }
            else if (unit === 'hour') { text = 'This Hour' }
        }
        let obj = { 'Clear': 'حذف', 'This Hour': 'ساعت کنونی', 'Today': 'امروز', 'This Month': 'ماه جاری', }
        let res = text;
        if (calendarType === 'jalali' && obj[text]) { res = obj[text] }
        return trans(res)
    }
    function changeActiveDate(obj) {
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
            changeActiveDate,
            translate: trans, rootProps, activeDate,
            today, todayWeekDay, thisMonthString,months,
            onChange: ({ year, month, day, hour }) => {
                let dateArray = [year, month, day, hour];
                let jalaliDateArray = calendarType === 'gregorian' ? AIODate().toJalali({ date: dateArray }) : dateArray;
                let gregorianDateArray = calendarType === 'jalali' ? AIODate().toGregorian({ date: dateArray }) : dateArray;
                let { weekDay, index: weekDayIndex } = unit === 'month' ? { weekDay: null, index: null } : AIODate().getWeekDay({ date: dateArray })
                let get2digit = (v) => {
                    if (v === undefined) { return }
                    v = v.toString();
                    return v.length === 1 ? `0${v}` : v
                }
                let dateString;
                let splitter = typeof value === 'string' ? AIODate().getSplitter(value) : '/';
                if (unit === 'month') { dateString = `${year}${splitter}${get2digit(month)}` }
                else if (unit === 'day') { dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}` }
                else if (unit === 'hour') { dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}${splitter}${get2digit(hour)}` }
                let monthString = months[month - 1];
                let jalaliMonthString = calendarType === 'gregorian' ? AIODate().getMonths({ calendarType: 'jalali' })[month - 1] : monthString;
                let gregorianMonthString = calendarType === 'jalali' ? AIODate().getMonths({ calendarType: 'gregorian' })[month - 1] : monthString;
                let props = {
                    months, jalaliDateArray, gregorianDateArray, dateArray, weekDay, weekDayIndex, dateString,
                    year, month, day, hour, monthString, jalaliMonthString, gregorianMonthString,
                }
                onChange(dateString, props);
                if (close) { onClose() }
            }
        }
        return context
    }
    return (
        <DPContext.Provider value={getContext()}>
            <div className='aio-input-datepicker-container' style={{ display: 'flex' }}>
                <div className='aio-input-datepicker-calendar' style={getPopupStyle()}>
                    <DPHeader /><DPBody /><DPFooter />
                </div>
                <DPToday />
            </div>
        </DPContext.Provider>
    );
}
function DPToday() {
    let { rootProps, translate, today, todayWeekDay, thisMonthString }: I_DPContext = useContext(DPContext);
    let { theme, calendarType, unit, size } = rootProps;
    return (
        <div className='aio-input-datepicker-today' style={{ width: size / 2, color: theme[1], background: theme[0] }}>
            <div style={{ fontSize: size / 13 }}>{translate('Today')}</div>
            {
                (unit === 'day' || unit === 'hour') &&
                <>
                    <div style={{ fontSize: size / 11 }}>{calendarType === 'gregorian' ? todayWeekDay.slice(0, 3) : todayWeekDay}</div>
                    <div style={{ fontSize: size / 12 * 4, height: size / 12 * 4 }}>{today[2]}</div>
                    <div style={{ fontSize: size / 11 }}>{calendarType === 'gregorian' ? thisMonthString.slice(0, 3) : thisMonthString}</div>
                </>
            }
            {unit === 'month' && <div style={{ fontSize: size / 8 }}>{calendarType === 'gregorian' ? thisMonthString.slice(0, 3) : thisMonthString}</div>}
            <div style={{ fontSize: size / 11 }}>{today[0]}</div>
            {unit === 'hour' && <div style={{ fontSize: size / 10 }}>{today[3] + ':00'}</div>}
        </div>
    )
}
function DPFooter() {
    let {rootProps, changeActiveDate, translate}:I_DPContext = useContext(DPContext);
    let { disabled, onChange = () => { }, size } = rootProps;
    if (disabled) { return null }
    let buttonStyle = { padding: `${size / 20}px 0` };
    return (
        <div className='aio-input-datepicker-footer' style={{ fontSize: size / 13 }}>
            <button style={buttonStyle} onClick={() => onChange(false)}>{translate('Clear')}</button>
            <button style={buttonStyle} onClick={() => changeActiveDate('today')}>{translate('Today')}</button>
        </div>
    )
}
function DPBody() {
    let {rootProps, activeDate}:I_DPContext = useContext(DPContext);
    let { unit = 'day',calendarType = 'gregorian',size } = rootProps;
    function getStyle() {
        var columnCount = { hour: 4, day: 7, month: 3 }[unit];
        var rowCount = { hour: 6, day: 7, month: 4 }[unit];
        var padding = size / 18, fontSize = size / 15, a = (size - padding * 2) / columnCount;
        var rowHeight = { hour: size / 7, day: a, month: size / 6, year: size / 7 }[unit];
        var gridTemplateColumns = '', gridTemplateRows = '';
        for (let i = 1; i <= columnCount; i++) { gridTemplateColumns += a + 'px' + (i !== columnCount ? ' ' : '') }
        for (let i = 1; i <= rowCount; i++) { gridTemplateRows += (rowHeight) + 'px' + (i !== rowCount ? ' ' : '') }
        let direction:'ltr'|'rtl' = calendarType === 'gregorian' ? 'ltr' : 'rtl';
        return { gridTemplateColumns, gridTemplateRows, direction, padding, fontSize }
    }
    return (
        <div className='aio-input-datepicker-body' style={getStyle()}>
            {unit === 'hour' && new Array(24).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year, activeDate.month, activeDate.day, i]} />)}
            {unit === 'day' && <DPBodyDay />}
            {unit === 'month' && new Array(12).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year, i + 1]} />)}
        </div>
    )
}
function DPBodyDay() {
    let {rootProps, activeDate}:I_DPContext = useContext(DPContext);
    let { theme, calendarType } = rootProps;
    let firstDayWeekDayIndex = AIODate().getWeekDay({ date: [activeDate.year, activeDate.month, 1] }).index;
    let daysLength = AIODate().getMonthDaysLength({ date: [activeDate.year, activeDate.month] });
    let weekDays = AIODate().getWeekDays({ calendarType });
    return (<>
        {weekDays.map((weekDay, i) => <DPCellWeekday key={'weekday' + i} weekDay={weekDay} />)}
        {new Array(firstDayWeekDayIndex).fill(0).map((o, i) => <div key={'space' + i} className='aio-input-datepicker-space aio-input-datepicker-cell' style={{ background: theme[1] }}></div>)}
        {new Array(daysLength).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year, activeDate.month, i + 1]} />)}
        {new Array(42 - (firstDayWeekDayIndex + daysLength)).fill(0).map((o, i) => <div key={'endspace' + i} className='aio-input-datepicker-space aio-input-datepicker-cell' style={{ background: theme[1] }}></div>)}
    </>)
}
type I_DPCellWeekday = {weekDay:string}
function DPCellWeekday(props:I_DPCellWeekday) {
    let {rootProps, translate}:I_DPContext = useContext(DPContext);
    let { theme, calendarType } = rootProps;
    let { weekDay } = props;
    return (
        <div className='aio-input-datepicker-weekday aio-input-datepicker-cell' style={{ background: theme[1], color: theme[0] }}>
            <span>{translate(weekDay.slice(0, calendarType === 'gregorian' ? 2 : 1))}</span>
        </div>
    )
}
type I_DPCell = {dateArray:number[]}
function DPCell(props:I_DPCell) {
    let {rootProps, translate, onChange}:I_DPContext = useContext(DPContext);
    let { disabled, dateAttrs, theme, value, calendarType, unit, dateDisabled } = rootProps;
    let { dateArray } = props;
    function getClassName(isActive, isToday, isDisabled, className) {
        var str = 'aio-input-datepicker-cell';
        if (isDisabled) { str += ' aio-input-datepicker-disabled' }
        if (isActive) { str += ' aio-input-datepicker-active'; }
        if (isToday) { str += ' today'; }
        if (className) { str += ' className'; }
        return str;
    }
    let { isEqual, isMatch, getMonths, getToday } = AIODate();
    let isActive = !value ? false : AIODate().isEqual(dateArray, value);
    let isToday = isEqual(dateArray, getToday({ calendarType }))
    let isDateDisabled = !dateDisabled ? false : isMatch({ date: dateArray, matchers: dateDisabled });
    let isDisabled = disabled || isDateDisabled;
    let Attrs:any = {}
    if (dateAttrs) { 
        Attrs = dateAttrs({ dateArray, isToday, isDisabled, isActive, isMatch: (o) => isMatch({ date: dateArray, matchers: o }) })
        Attrs = Attrs || {} 
    }
    let className = getClassName(isActive, isToday, isDisabled, Attrs.className);
    let onClick = isDisabled ? undefined : () => { onChange({ year: dateArray[0], month: dateArray[1], day: dateArray[2], hour: dateArray[3] }) };
    let style:any = {}
    if (!isDisabled) { style.background = theme[1]; }
    if (className.indexOf('aio-input-datepicker-active') !== -1) {
        style.background = theme[0];
        style.color = theme[1];
    }
    if (className.indexOf('today') !== -1) { style.border = `1px solid ${theme[0]}` }
    style = { ...style, ...Attrs.style }
    let text;
    if (unit === 'hour') { text = dateArray[3] + ':00' }
    else if (unit === 'day') { text = dateArray[2] }
    else if (unit === 'month') {
        let months = getMonths({ calendarType });
        text = translate(calendarType === 'gregorian' ? months[dateArray[1] - 1].slice(0, 3) : months[dateArray[1] - 1])
    }
    return <div style={style} onClick={onClick} className={className}>{isDisabled ? <del>{text}</del> : text}</div>
}
type I_DPYears = {
    value: number, onChange: (newValue: number) => void
}
function DPYears(props: I_DPYears) {
    let { rootProps }: I_DPContext = useContext(DPContext);
    let { calendarType = 'gregorian' } = rootProps;
    let { value, onChange } = props;
    let [start, setStart] = useState<number>(Math.floor(value / 10) * 10);
    function changePage(dir) {
        let newStart = start + (dir * 10)
        setStart(newStart);
        onChange(newStart)
    }
    function getCells() {
        let cells = [];
        for (let i = start; i < start + 10; i++) {
            cells.push(<div className='aio-input-datepicker-years-cell' key={i} onClick={() => onChange(i)}>{i}</div>)
        }
        return cells
    }
    return (
        <div className='aio-input-datepicker-years'>
            <div className='aio-input-datepicker-years-header'>
                <DPArrow type='minus' onClick={() => changePage(-1)} />
                <div style={{ flex: 1 }}></div>
                <DPArrow type='plus' onClick={() => changePage(1)} />
            </div>
            <div className='aio-input-datepicker-years-body'>{getCells()}</div>
        </div>
    )
}
function DPHeader() {
    let { rootProps,activeDate, changeActiveDate, months, translate }: I_DPContext = useContext(DPContext);
    let { size, unit,calendarType } = rootProps;
    function getYears() {
        let p:I_DPYears = {
            value: activeDate.year,onChange: (year) => { changeActiveDate({ year }) }
        }
        return (<DPYears {...p} />)
    }
    function getMonths() {
        let p:I_DPHeaderDropdown = {
            value: activeDate.month, onChange: (month) => { changeActiveDate({ month }) },
            options: months.map((o, i) => { return { value: i + 1, text: translate(calendarType === 'gregorian' ? o.slice(0, 3) : o) } })
        }
        return <DPHeaderDropdown {...p} />
    }
    function getDays() {
        let daysLength = AIODate().getMonthDaysLength({ date: [activeDate.year, activeDate.month] });
        let options = new Array(daysLength).fill(0).map((o, i) => { return { text: (i + 1).toString(), value: i + 1 } })
        let p:I_DPHeaderDropdown = { value: activeDate.day, options, onChange: (day) => changeActiveDate({ day }) }
        return <DPHeaderDropdown {...p} />
    }
    return (
        <div className='aio-input-datepicker-header' style={{ height: size / 4 }}>
            <DPArrow type='minus' />
            <div className='aio-input-datepicker-select' style={{ fontSize: Math.floor(size / 12) }}>
                {getYears()}
                {unit !== 'month' ? getMonths() : null}
                {unit === 'hour' ? getDays() : null}
            </div>
            <DPArrow type='plus' />
        </div>
    )
}
type I_DPHeaderDropdown = { value: any, options: { text: string, value: any }[], onChange: (value: any) => void }
function DPHeaderDropdown(props: I_DPHeaderDropdown) {
    let { rootProps }: I_DPContext = useContext(DPContext);
    let { value, options, onChange } = props;
    let { size, theme } = rootProps;
    let p: I_AIOInput = {
        value, options, onChange, caret: false, type: 'select',
        attrs: { className: 'aio-input-datepicker-dropdown' },
        option:{style:()=>{return { height: size / 6, background: theme[1], color: theme[0] }} },
    }
    return (<AIOInput {...p} />)
}
type I_DPArrow = { type: 'minus' | 'plus', onClick?: () => void }
function DPArrow(props: I_DPArrow) {
    let { rootProps, changeActiveDate, activeDate }: I_DPContext = useContext(DPContext);
    let { type, onClick } = props;
    let { calendarType, unit, size, theme } = rootProps;
    function change() {
        if (onClick) { onClick(); return }
        let offset = (calendarType === 'gregorian' ? 1 : -1) * (type === 'minus' ? -1 : 1);
        let date = [activeDate.year, activeDate.month, activeDate.day]
        let next = AIODate().getByOffset({ date, offset, unit: { 'hour': 'day', 'day': 'month', 'month': 'year' }[unit] })
        if (unit === 'month') { changeActiveDate({ year: next[0] }) }
        if (unit === 'day') { changeActiveDate({ year: next[0], month: next[1] }) }
        if (unit === 'hour') { changeActiveDate({ year: next[0], month: next[1], day: next[2] }) }
    }
    function getIcon() {
        return <Icon path={type === 'minus' ? mdiChevronLeft : mdiChevronRight} size={1} style={{ color: theme[0] }} />
    }
    return (<div className='aio-input-datepicker-arrow' style={{ width: size / 6, height: size / 6 }} onClick={() => change()}>{getIcon()}</div>)

}
const SliderContext = createContext({} as any);
type I_Slider_statics = {getDiff:(x:number,y:number,client:{x:number,y:number})=>number,oriention:'h' | 'v',flexDirection?:'column' | 'column-reverse'}
type I_Slider_context = {
    touch:boolean,value:number[],
    statics:I_Slider_statics,
    rootProps:I_AIOInput,isDown:boolean,
    mouseDown:(e:any,index:number,type:'point' | 'fill')=>void,
    fix:(v:number)=>number,
    getStartByStep:(start:number,step:number)=>number,
    getPercentByValue:(value:number,start:number,end:number)=>number,
    isActive:(index:number)=>boolean
}
function Slider() {
    let {rootProps,touch,types}:I_AIOInput_context = useContext(AICTX);
    let {direction = 'right',step, start, end, min = start, max = end, disabled,attrs = {}, scale,label,multiple} = rootProps;
    let [statics] = useState(getStatics())
    let [dom] = useState(createRef())
    let [isDown,setIsDown] = useState(false)
    let [moved] = useState<boolean>(false);
    let [startOffset] = useState<{ x:number, y:number, size:number, index: number[], value: number[], startLimit: number, endLimit: number }>()
    let value = getValidValue()
    function onChange(value:number[],drag:boolean){
        rootProps.onChange(multiple?[...value]:value[0],drag)
    }
    function getStatics():I_Slider_statics{
        if (direction === 'left') {return {getDiff:function (x, y, client) { return x - client.x; },oriention:'h'}}
        else if (direction === 'right') {return {getDiff:function (x, y, client) { return client.x - x; },oriention:'h'}}
        else if (direction === 'top') {return {getDiff:function (x, y, client) { return y - client.y; },oriention:'v',flexDirection:'column-reverse'}}
        else {return {getDiff:function (x, y, client) { return client.y - y; },oriention:'v',flexDirection:'column'}}
    }
    function getPercentByValue(value, start, end) { return 100 * (value - start) / (end - start); }
    function fix(number) {
        let dotPos = step.toString().indexOf('.');
        let a = dotPos === -1 ? 0 : step.toString().length - dotPos - 1;
        return parseFloat((number).toFixed(a));
    }
    function getStartByStep(start, step) {
        var a = Math.round((start - step) / step) * step;
        while (a < start) { a += step; } return a;
    }
    function getValidValue() {
        let {value} = rootProps;
        if (!Array.isArray(value)) {value = [value || 0]}
        for (var i = 0; i < value.length; i++) {
            var point = value[i] || 0;
            point = Math.round((point - start) / step) * step + start;
            if (point < min) { point = min; }
            if (point > max) { point = max; }
            value[i] = point;
        }
        return value
    }
    function getOffset(x, y, size, e) {return Math.round((end - start) * statics.getDiff(x, y, getClient(e)) / size / step) * step;}
    function getPercents() {
        var percents = value.map((o, i) => [
            getPercentByValue(i ? value[i - 1] : start, start, end),
            getPercentByValue(o, start, end)
        ]);
        percents.push([percents[percents.length - 1][1], 100])
        return percents;
    }
    function decreaseAll(step = rootProps.step) {
        let { min = start } = rootProps;
        let offset = Math.min(step, value[0] - min);
        for (let i = 0; i < value.length; i++) {
            value[i] -= offset;
            value[i] = fix(value[i])
        }
        moved = true;
    }
    function increaseAll(step = rootProps.step) {
        let { max = end } = rootProps;
        let offset = Math.min(step, max - value[value.length - 1]);
        for (let i = 0; i < value.length; i++) {
            value[i] += offset;
            value[i] = fix(value[i])
        }
        moved = true;
    }
    function isActive(index){
        if (value.length === 1 && index === 0) { return true }
        if (value.length > 1 && index !== 0 && index !== value.length) { return true; }
        return false
    }
    function mouseDown(e, index, type) {
        e.preventDefault();
        let { min = start,max = end } = rootProps;
        if (!rootProps.onChange || disabled) { return }
        let { x, y } = getClient(e), DOM = $(dom.current);
        let pointContainers = DOM.find('.aio-slider-point-container');
        let size = DOM.find('.aio-slider-line')[statics.oriention === 'h' ? 'width' : 'height']();
        let length = value.length;
        eventHandler('window', 'mousemove', mouseMove);
        eventHandler('window', 'mouseup', mouseUp);
        moved = false;
        setIsDown(true);
        pointContainers.css({ zIndex: 10 });
        if (type === 'point') {
            let pointContainer = pointContainers.eq(index);
            pointContainer.css({ zIndex: 100 });
            pointContainer.find('.aio-slider-point').addClass('active');
            let current = value[index];
            let before = index === 0 ? min : value[index - 1];
            let after = index === value.length - 1 ? max : value[index + 1]
            startOffset = { x, y, size, index: [index], value: [current], startLimit: before - current, endLimit: after - current }
        }
        else {
            let pointContainer1 = pointContainers.eq(index - 1);
            let pointContainer2 = pointContainers.eq(index);
            pointContainer1.css({ zIndex: 100 });
            pointContainer2.css({ zIndex: 100 });
            let p1 = pointContainer1.find('.aio-slider-point');
            let p2 = pointContainer2.find('.aio-slider-point');
            p1.addClass('active');
            p2.addClass('active');

            if (index === 0) { decreaseAll(); }
            else if (index === length) { increaseAll(); }
            if (index === 0 || index === length) {
                startOffset = {
                    x, y, size,
                    index: value.map((o, i) => i), value: value.map((o) => o),
                    startLimit: min - value[0], endLimit: max - value[length - 1],
                }
            }
            else {
                let point1 = value[index - 1], point2 = value[index];
                let before = index === 1 ? min : value[index - 2];//مقدار قبلی رنج
                let after = index === length - 1 ? max : value[index + 1]; //مقدار بعدی رنج
                startOffset = {
                    x, y, size, index: [index - 1, index],
                    value: [point1, point2], startLimit: before - point1, endLimit: after - point2,
                }
            }
        }
    }
    function mouseMove(e) {
        let { x, y, size, value:v, startLimit, endLimit, index } = startOffset;
        let offset = getOffset(x, y, size, e);
        if (offset < startLimit) { offset = startLimit; }
        else if (offset > endLimit) { offset = endLimit; }
        for (let i = 0; i < v.length; i++) {
            let Index = index[i], Value = v[i], newValue = Value + offset;
            if (value[Index] === newValue) { return; }
            value[Index] = fix(newValue);
        }
        moved = true;
        onChange(value, true);
    }
    function mouseUp() {
        eventHandler('window', 'mousemove', mouseMove, 'unbind');
        eventHandler('window', 'mouseup', mouseUp, 'unbind');
        let points = $(dom.current).find('.aio-slider-point');
        points.removeClass('active');
        setIsDown(false);
        if (moved) { onChange(value, false); }
    }
    function getContext() {
        let context:I_Slider_context = {
            statics,rootProps,mouseDown,touch,value,isDown,fix,getStartByStep,getPercentByValue,isActive
        }
        return context
    }
    function getStyle() {return { direction: 'ltr', flexDirection: statics.flexDirection }}
    function getClassName() {
        let { className } = attrs;
        return `aio-slider ${statics.oriention === 'h'?'horizontal':'vertical'}${className ? ' ' + className : ''}${disabled ? ' disabled' : ''}`;
    }
    let percents = getPercents();
    return (
        <SliderContext.Provider value={getContext()}>
            <div ref={dom as any} style={getStyle() as any} className={getClassName()}>
                <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <SliderLine />
                    {label && <SliderLabels />}
                    {scale && <SliderScales />}
                    {value.map((o, i) => <SliderFill key={i} index={i} percent={percents[i]} />)}
                    <SliderFill key={value.length} index={value.length} percent={percents[value.length]} />
                    {value.map((o, i) => <SliderPoint key={i} index={i} percent={percents[i]} />)}
                </div>
            </div>
        </SliderContext.Provider>
    );
}
function SliderLine() {
    let {rootProps}:I_Slider_context = useContext(SliderContext);
    let {lineAttrs = {}} = rootProps;
    let className = 'aio-slider-line';
    if(lineAttrs.className){className += ' ' + lineAttrs.className}
    let style = lineAttrs.style;
    let p = {...lineAttrs,className,style}
    return (<div {...p}></div>)
}
type I_SliderFill = {percent:number,index:number}
function SliderFill(props:I_SliderFill) {
    let {statics,rootProps,mouseDown,touch,isActive}:I_Slider_context = useContext(SliderContext);
    let { oriention } = statics,{ direction = 'right',line = {} } = rootProps, { percent,index } = props; 
    let [active] = useState<boolean>(isActive(index))
    function getContainerProps(){
        let style:any = {};
        style[{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]] = percent[0] + '%';
        if (oriention === 'h') { style.width = (percent[1] - percent[0]) + '%'; }
        else { style.height = (percent[1] - percent[0]) + '%'; }
        return {
            'data-index': index, className: 'aio-slider-fill-container', style,
            [touch ? 'onTouchStart' : 'onMouseDown']: (e) => mouseDown(e, index, 'fill')
        }
    }
    function getProps(){
        let {attrs:Attrs = ()=>{}} = line;
        let attrs = Attrs(index,active) || {};
        let style = attrs.style;
        let className = 'aio-slider-fill';
        if(active){className += ' aio-slider-fill-active'}
        if(attrs.className){className += ' ' + attrs.className}
        return {...attrs,className,style,'data-index':index}
    }
    let text = line.text?line.text(index,active):'';
    return (
        <div {...getContainerProps()}>
            <div {...getProps()}></div>
            {text !== undefined && <div className='aio-slider-text'>{text}</div>}
        </div>
    );
}
type I_SliderPoint = {percent:number,index:number}
function SliderPoint(props:I_SliderPoint) {
    let {rootProps,isDown,mouseDown,value,touch,fix}:I_Slider_context = useContext(SliderContext);
    let {percent,index} = props;
    let {direction = 'right'} = rootProps;
    let fixValue = fix(value[index]);
    let {attrs = {},html = ''} = (rootProps.point?rootProps.point(index,fixValue):{}) || {}
    let {attrs:labelAttrs = {},html:labelHtml = fixValue,show:labelShow = 'inline'} = (rootProps.pointLabel?rootProps.pointLabel(index,fixValue):{}) || {}
    function getContainerProps(){
        let style = { [{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]]: percent[1] + '%' };
        return {
            style, 'data-index': index, className: 'aio-slider-point-container',
            [touch ? 'onTouchStart' : 'onMouseDown']: (e) => mouseDown(e, index, 'point')
        }
    }
    function getValueProps(){
        let style;
        if (labelShow === false) { style = { display: 'none' } }
        else if (labelShow === true || labelShow === 'inline' || isDown) { style = labelAttrs.style; }
        else { style = { display: 'none' } };
        let className = `aio-slider-value ${'aio-slider-value-' + index}` + (labelShow === 'inline' ? ' aio-slider-value-inline' : '');
        return {style,className}
    }
    function getPointProps(){
        let className = 'aio-slider-point';
        if(attrs.className){className += attrs.className}
        return { ...attrs,className, style: attrs.style, 'data-index': index };
    }
    return (
        <div {...getContainerProps()}>
            {labelShow !== 'inline' && <div {...getPointProps()}>{html}</div>}
            <div {...getValueProps()}>{labelHtml}</div>
        </div>
    );
}
function SliderLabels() {
    let {rootProps, getStartByStep}:I_Slider_context = useContext(SliderContext);
    let {start, end,direction = 'right',label = {}} = rootProps;
    let {step,list} = label;
    let [dom] = useState(createRef())
    useEffect(()=>{
        $(window).on('resize', update)
    },[])
    useEffect(()=>{
        update()
    })
    function getLabelsByStep() {
        let Labels = [];
        let value = getStartByStep(start, step);
        let key = 0;
        while (value <= end) {
            let p:I_SliderLabel = {value}
            Labels.push(<SliderLabel key={key} {...p} />);
            value += step;
            value = parseFloat(value.toFixed(6))
            key++;
        }
        return Labels;
    }
    function getLabels() { return list.map((o) => {let p:I_SliderLabel = {value:o}; return <SliderLabel key={o} {...p} />}) }
    function update() {
        let container = $(dom.current);
        let labels = container.find('.aio-slider-label div');
        if (!labels.length) { return; }
        let firstLabel = labels.eq(0);
        let firstLabelThickness = firstLabel.attr('data-rotated') === 'yes' ? 'height' : 'width';
        if (direction === 'right') {
            let end = firstLabel.offset().left + firstLabel[firstLabelThickness]();
            for (let i = 1; i < labels.length; i++) {
                let label = labels.eq(i);
                let thickness = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
                label.css({ display: 'block' })
                let left = label.offset().left
                let width = label[thickness]();
                if (left < end + 5) {
                    label.css({ display: 'none' })
                }
                else { end = left + width; }
            }
        }
        else if (direction === 'left') {
            var end = firstLabel.offset().left;
            for (let i = 1; i < labels.length; i++) {
                let label = labels.eq(i);
                let thickness = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
                label.css({ display: 'block' })
                let left = label.offset().left
                let width = label[thickness]();
                let right = left + width;
                if (right > end - 5) {
                    label.css({ display: 'none' })
                }
                else { end = left; }
            }
        }
    }
    return (
        <div className='aio-slider-labels' ref={dom as any}>
            {list ? getLabels() : getLabelsByStep()}
        </div>
    );
    
}
type I_SliderLabel = {value:number}
function SliderLabel(props:I_SliderLabel) {
    let {rootProps,getPercentByValue}:I_Slider_context = useContext(SliderContext)
    let {start,end,direction = 'right',label} = rootProps;
    let {html = (o)=>o} = label;
    let {value} = props;
    function getProps() {
        let attrs:any = label.attrs(value);
        attrs = !attrs ? {} : { ...attrs }
        let key = { right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction];
        let style:any = {};
        style[key] = getPercentByValue(value, start, end) + '%';
        if (rotate) {
            style.transform = `rotate(${label.rotate + 'deg'})`;
            style.justifyContent = rotate > 0 ? 'flex-start' : 'flex-end'
        }
        let className = `aio-slider-label`
        if(attrs.className){className += ' ' + attrs.className}
        let onClick = !attrs.onClick?undefined:(e)=>{
            if(attrs.onClick){
                e.stopPropagation();
                attrs.onClick(value,e)
            }
        }
        return {onClick,...attrs,className,style}
    }
    let rotate = (typeof label.rotate === 'function' ? label.rotate(value) : label.rotate) || 0;
    return (
        <div {...getProps()}>
            <div data-rotated={rotate ? 'yes' : 'no'} className='aio-slider-label-text'>{html(value)}</div>
        </div>
    );
}
function SliderScales() {
    let {rootProps,getStartByStep}:I_Slider_context = useContext(SliderContext);
    let {scale = {},start,end} = rootProps;
    let {step,list} = scale;
    let [numbers] = useState<number[]>(getNumbers())
    function getNumbers():number[]{
        let numbers = [],dic = {}
        if(list){
            for(let i = 0; i < list.length; i++){
                if(dic[list[i].toString()] === undefined){numbers.push(i);}
            }
        }
        if(step){
            let value = getStartByStep(start, step);
            while (value <= end) {
                if(dic[value.toString()] === undefined){numbers.push(value);}
                value += step;
            }
        }
        return numbers;
    } 
    function getScales(){
        return numbers.map((o)=>{
            let p:I_SliderScale = {value:o};
            return <SliderScale key={o} {...p}/>
        })
    }
    let scales = getScales();
    return !scales.length?null:<div className='aio-slider-scales'>{scales}</div>
}
type I_SliderScale = {value:number}
function SliderScale(props:I_SliderScale) {
    let {rootProps,getPercentByValue} = useContext(SliderContext);
    let {value} = props;
    let {scale = {},start,end,direction = 'right'} = rootProps;
    let {html = ()=>null} = scale;
    let attrs = (typeof scale.attrs === 'function'?scale.attrs(value):scale.attrs) || {};
    let style = attrs.style;
    style = !style ? {} : { ...style }
    style[{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]] = getPercentByValue(value, start, end) + '%';
    let className = 'aio-slider-scale';
    if(attrs.className){className += ' ' + attrs.className}
    let p = {...attrs,className,style}
    return (<div {...p}>{html(value)}</div>);
}
function List() {
    let { rootProps, getOptionProp }: I_AIOInput_context = useContext(AICTX);
    let { move, size, width, options = [], value, onChange = () => { }, attrs = {}, editable, stop, decay } = rootProps;
    let [touch] = useState('ontouchstart' in document.documentElement);//notice global touch?
    let [dom] = useState(createRef());
    let [activeIndex] = useState<number>(0)
    let [interval] = useState<any>()
    let [moved] = useState<boolean>()
    let [lastY] = useState<number>()
    let [deltaY] = useState<number>()
    let [so] = useState<{ y: number, top: number, newTop?: number, limit: { top: number, bottom: number } }>()
    let [count, setCount] = useState<number>(rootProps.count)
    useEffect(() => { if (move) { move(Move) } }, [])
    useEffect(() => { setBoldStyle(activeIndex) }, [activeIndex])
    function getListOptions() {
        let propsValue = value;
        activeIndex = 0;
        return options.map((option, i) => {
            let value = getOptionProp(option, 'value');
            let text = getOptionProp(option, 'text', '');
            let style = getOptionProp(option, 'style', {});
            if (value === propsValue) { activeIndex = i; }
            let p = { key: i, dataindex: i, className: 'aio-input-list-option', style: { height: size, ...style } }
            return <div {...p}>{text}</div>
        })
    }
    function getIndexByTop(top) { return Math.round(((count * size) - size - (2 * top)) / (2 * size)); }
    function getTopByIndex(index) { return (count - 2 * index - 1) * size / 2; }
    function getContainerStyle() { return { top: getTopByIndex(activeIndex) }; }
    function moveDown() {
        if (activeIndex >= options.length - 1) { return }
        activeIndex++;
        let newTop = getTopByIndex(activeIndex);
        setStyle({ top: newTop });
        setBoldStyle(activeIndex);
    }
    function setBoldStyle(index) {
        $(dom.current).find('.aio-input-list-option').removeClass('active');
        $(dom.current).find('.aio-input-list-option[dataindex=' + (index) + ']').addClass('active');
    }
    function moveUp() {
        if (activeIndex <= 0) { return }
        activeIndex--;
        var newTop = getTopByIndex(activeIndex);
        setStyle({ top: newTop });
        setBoldStyle(activeIndex);
    }
    function keyDown(e) {
        if (!editable) { return }
        if (e.keyCode === 38) { moveUp(); }
        else if (e.keyCode === 40) { moveDown(); }
    }
    function getLimit() { return { top: getTopByIndex(-1), bottom: getTopByIndex(options.length) } }
    function getTrueTop(top) {
        let index = getIndexByTop(top);
        if (index < 0) { index = 0 }
        if (index > options.length - 1) { index = options.length - 1 }
        return getTopByIndex(index);
    }
    function mouseDown(e) {
        if (!editable) { return }
        eventHandler('window', 'mousemove', mouseMove);
        eventHandler('window', 'mouseup', mouseUp);
        clearInterval(interval);
        moved = false;
        let client = getClient(e), y = client[1]
        setStyle({ transition: 'unset' });
        let top = getTop(), index = getIndexByTop(top);
        setBoldStyle(index);
        setStyle({ top, transition: 'unset' });
        onChange(options[index].value, index)
        so = { y, top, limit: getLimit() };
    }
    function getTop() {
        var top = parseInt($(dom.current).find('.aio-input-list-options').css('top'));
        return getTrueTop(top);
    }
    function fixTop(value) {
        let { top, bottom } = so.limit;
        if (value > top) { return top }
        if (value < bottom) { return bottom }
        return value;
    }
    function mouseMove(e) {
        moved = true;
        let client = getClient(e), y = client[1], offset = y - so.y;
        if (lastY === undefined) { lastY = y }
        deltaY = y - lastY;
        lastY = y;
        if (Math.abs(offset) < 20) { deltaY = 3 }
        let newTop = fixTop(so.top + offset), index = getIndexByTop(newTop);
        so.newTop = newTop;
        setBoldStyle(index);
        setStyle({ top: newTop });
    }
    function setStyle(obj) { $(dom.current).find('.aio-input-list-options').css(obj); }
    function mouseUp(e) {
        eventHandler('window', 'mousemove', mouseMove, 'unbind');
        eventHandler('window', 'mouseup', mouseUp, 'unbind');
        if (!moved) { return }
        moved = false;
        Move(deltaY, so.newTop)
    }
    function Move(dy, startTop = getTop()) {
        if (decay < 0) { decay = 0 }
        if (decay > 99) { decay = 99 }
        decay = 1 + decay / 1000;
        interval = setInterval(() => {
            startTop += dy;
            let index = getIndexByTop(startTop);
            if (Math.abs(dy) < stop || index < 0 || index > options.length - 1) {
                clearInterval(interval);
                if (index < 0) { index = 0 }
                if (index > options.length - 1) { index = options.length - 1 }
                let top = getTopByIndex(index);
                setBoldStyle(index);
                setStyle({ top, transition: '0.3s' });
                onChange(options[index].value, index)
                return;
            }
            dy /= decay;
            setStyle({ top: startTop });
        }, 20)
    }
    return (
        <div
            {...rootProps.attrs} ref={dom} tabIndex={0} onKeyDown={(e) => keyDown(e)}
            className={'aio-input-list' + (attrs.className ? ' ' + attrs.className : '')}
            style={{ ...attrs.style, width, height: count * (size) }}
        >
            <div
                className='aio-input-list-options' style={getContainerStyle()}
                onMouseDown={(e) => mouseDown(e)} onTouchStart={(e) => mouseDown(e)}
            >{getListOptions()}</div>
        </div>
    );
}
const MapContext = createContext({} as any);
function Map() {
    let { rootProps }: I_AIOInput_context = useContext(AICTX);
    let { popupConfig, mapConfig, onChange, disabled, attrs, value } = rootProps;
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
    let p:I_MapUnit = { popupConfig, onChange, attrs, value, mapConfig, disabled }
    return <MapUnit {...p} />
}
type I_Map_config = {
    area?:I_Map_area,
    markers?:I_Map_marker[],
    zoom?:number,
    marker?:boolean | I_Map_marker,
    traffic?:boolean,
    zoomControl?:boolean,
    maptype?:any,
    poi?:boolean,
    search?:string,
    title?:string,
    draggable?:boolean,
    address?:boolean,
    submitText?:React.ReactNode,
    isPopup?:boolean
}
export type I_Map_area = {color:string, opacity:number, radius:number, lat:number, lng:number}
export type I_Map_marker = {size?:number,color?:string,html?:React.ReactNode,text?:React.ReactNode,lat?:number,lng?:number,popup?:(marker:I_Map_marker)=>any}
type I_Map_value = {lat:number,lng:number,address?:string}
type I_MapUnit = {
    onClose?:()=>void,
    value:I_Map_value,
    onChange:(value:I_Map_value)=>void,
    mapConfig:I_Map_config,
    popupConfig?:I_Map_config,
    attrs:any,
    disabled:boolean
}
type I_Map_temp = {
    datauniqid:string,
    area:any,
    map:any,
    markers:any[],
    dom:any,
    L:any,
    atimeout:any,
    btimeout:any,
    mapMarker:any,
    lastChange:any
}
type I_Map_coords = {lat:number,lng:number};
type I_mapApiKeys = {map:string,service:string}
type I_Map_context = {
    mapApiKeys:I_mapApiKeys,
    value:I_Map_value,
    flyTo:(coords:I_Map_coords)=>void,
    addressLoading:boolean,
    address:string,
    goToCurrent:()=>void,
    mapConfig:I_Map_config,
    popupConfig:I_Map_config,
    onClose:()=>void,
    onChange:(value:I_Map_value)=>void
}
function MapUnit(props:I_MapUnit) {
    let [mapApiKeys] = useState<I_mapApiKeys>(AIOStorage('aio-input-storage').load({ name: 'mapApiKeys', def: { map: '', service: '' } }));
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
        temp.map.on('click', (e) => {
            if (attrs.onClick) { return }
            if (onChange) { let { lat, lng } = e.latlng; temp.map.panTo({ lat, lng }) }
        });
        temp.map.on('move', (e) => {
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
                (response) => {let { lat, lon } = response; flyTo({lat,lng:lon})},
                (data, status) => console.log('Request failed.  Returned status of', status)
            );
    }
    function handlePermission() {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') { console.log(result.state); }
            else if (result.state === 'prompt') { console.log(result.state); }
            else if (result.state === 'denied') { console.log(result.state); }
        });
    }
    async function getAddress({ lat, lng }) {
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
    async function showPath(path) {
        try { await Axios.post(`https://api.neshan.org/v3/map-matching?path=${path}`, { headers: { 'Api-Key': mapApiKeys.service } }); }
        catch (err) { return '' }
    }
    function flyTo(coords:I_Map_coords) {
        if (!coords) { return }
        let animate = GetDistance(value, coords) > 0.3;
        temp.map.flyTo([coords.lat, coords.lng], zoom, { animate, duration: 1 });
    }
    function panTo(coords:{lat:number,lng:number}) { temp.map.panTo(coords) }
    async function updateAddress(coords) {
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
    function change(value) {
        let {lat,lng} = value;
        onChange({ lat, lng, address });
        updateAddress(value)
    }
    function move(value) {
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
    function header_node():I_RVD_node{return { html: <MapHeader /> }}
    function body_node():I_RVD_node{return { flex: 1, attrs: { ref: temp.dom }, html: '' }}
    function footer_node():I_RVD_node{return { html: <MapFooter /> }}
    return (
        <>
            <MapContext.Provider value={getContext()}>
                <RVD
                    rootNode={{
                        className: 'aio-input-map-container' + (mapConfig.draggable === false ? ' not-draggable' : ''), style: attrs.style,
                        onClick: () => {if (popupConfig) { setShowPopup(true) }},
                        column: [header_node(), body_node(), footer_node()]
                    }}
                />
            </MapContext.Provider>
            {renderPopup()}
        </>
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
    let timeout;
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
    function input_node():I_RVD_node {
        if (!search) { return {} }
        let p:I_AIOInput = {
            type:'text',placeholder:search,className:'aio-input-map-serach-input',value:searchValue,attrs:{ref:dom},options:searchResult,
            before:<div onClick={()=>goToCurrent()} className='align-vh'><Icon path={mdiCrosshairsGps} size={0.6} /></div>,
            after:()=>{
                let path,spin,size,onClick;
                if(loading){path = mdiLoading; spin = 0.4; size = 1;}
                else if(!!showResult && !!searchResult.length){path = mdiClose; size = 0.8; onClick = ()=>{changeSearch('')}}
                else {path = mdiMagnify; size=0.8;}
                return (<div className='aio-input-map-serach-icon align-vh' onClick={onClick}><Icon {...{path,size,spin}} /></div>)
            },
            option:{
                text:'option.title',value:'option.location.x + "-" + option.location.y',close:()=>true,
                subtext:'option.address',
                onClick:(option)=>flyTo({lat:option.object.location.y, lng:option.object.location.x})
            },
            onChange:(searchValue:string)=>changeSearch(searchValue)
        }
        return {className: 'aio-input-map-search',html:<AIOInput {...p}/>}
    }
    function header_node():I_RVD_node {
        if (typeof title !== 'string' && !onClose) { return {} }
        return {
            row: [
                { show: !!onClose, html: <Icon path={mdiChevronRight} size={1} />, className: 'aio-input-map-close align-vh', onClick: () => onClose() },
                { show: typeof title === 'string', html: title, className: 'aio-input-map-title align-v' },
            ]
        }
    }
    if (!search && !title && !onClose) { return null }
    return (
        <RVD
            rootNode={{
                className: 'aio-input-map-header of-visible' + (searchResult && searchResult.length && showResult ? ' aio-input-map-header-open' : ''),
                column: [header_node(), input_node()]
            }}
        />
    )
}
function MapFooter() {
    let {value,addressLoading,address,onClose, onChange,mapConfig = {}}:I_Map_context = useContext(MapContext);
    let { lat, lng } = value;
    function submit_node():I_RVD_node {
        if (!mapConfig.isPopup) { return {} }
        let {submitText = 'Submit'} = mapConfig;
        return { html: (<button className='aio-input-map-submit' onClick={async () => { onChange(value); onClose() }}>{submitText}</button>) }
    }
    function details_node():I_RVD_node {
        if (!mapConfig.address) { return {} }
        return addressLoading?loading_node():{ className:'flex-1',column: [address_node(), coords_node()] }
    }
    function loading_node():I_RVD_node{return { html: <Icon path={mdiLoading} size={1} spin={0.4} />, className: 'align-v flex-1' }}
    function address_node():I_RVD_node{return { html: address, className: 'aio-input-map-address flex-1' }}
    function coords_node():I_RVD_node{return { show: !!lat && !!lng, html: () => `${lat} - ${lng}`, className: 'aio-input-map-coords' }}
    function root_node():I_RVD_node{return {className: 'aio-input-map-footer',row: [details_node(),submit_node()]}}
    if(!mapConfig.isPopup && !mapConfig.address){return null}
    return (<RVD rootNode={root_node()} />)
}
type I_AIOSwip_mousePosition = {x:number,y:number,xp:number,yp:number,clientX:number,clientY:number};
type I_AIOSwip = {
    dom:any,start:(mousePosition:any)=>number[], 
    move:(p:{ dx:number, dy:number, dist:number, x:number, y:number, mousePosition: I_AIOSwip_mousePosition}, e:any ) => void, 
    end?:(p:{ dx: number, dy: number, dist: number }, e:any) => void, 
    speedX?:number, speedY?:number, stepX?:number, stepY?:number, reverseY?:boolean, reverseX?:boolean, minY?:number, maxY?:number, minX?:number, maxX?:number 
}
function AIOSwip(p:I_AIOSwip) {
    let {dom,start,move,end,speedX = 1,speedY = 1,stepX = 1, stepY = 1, reverseY, reverseX, minY, maxY, minX, maxX} = p;
    let a = {
        timeout: undefined,
        count: 0,
        getDom() { return dom() },
        init() {
            a.count++;
            if (a.count > 10) { clearTimeout(a.timeout); return }
            let res = dom();
            if (!res.length) { a.timeout = setTimeout(() => a.init(), 400) }
            else {
                clearTimeout(a.timeout);
                eventHandler(a.getDom(), 'mousedown', $.proxy(this.mouseDown, this))
            }
        },
        getPercentByValue(value, start, end) { return 100 * (value - start) / (end - start) },
        getMousePosition(e) {
            let client = getClient(e), x = client.x - this.left, y = client.y - this.top;
            let xp = this.getPercentByValue(x, 0, this.width), yp = this.getPercentByValue(y, 0, this.height);
            return { xp, yp, clientX: client.x, clientY: client.y, x, y }
        },
        mouseDown(e) {
            let dom = a.getDom();
            let offset = dom.offset();
            this.width = dom.width();
            this.height = dom.height();
            this.left = offset.left;
            this.top = offset.top;
            let mp = this.getMousePosition(e)
            this.so = {
                client: { x: mp.clientX, y: mp.clientY }
            };
            if (!start) { return; }
            let res = start({ ...mp });
            if (!Array.isArray(res)) { return; }
            let x = res[0];
            let y = res[1];
            this.so.x = x;
            this.so.y = y;
            eventHandler('window', 'mousemove', $.proxy(this.mouseMove, this));
            eventHandler('window', 'mouseup', $.proxy(this.mouseUp, this))
        },
        mouseMove(e) {
            let client = getClient(e);
            let dx = client.x - this.so.client.x;
            let dy = client.y - this.so.client.y;
            dx = Math.round(dx * speedX) * (reverseX ? -1 : 1)
            dy = Math.round(dy * speedY) * (reverseY ? -1 : 1)
            dx = Math.floor(dx / stepX) * stepX;
            dy = Math.floor(dy / stepY) * stepY;
            if (dx === this.dx && dy === this.dy) { return }
            this.dx = dx;
            this.dy = dy;
            let dist = Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)))
            this.dist = dist;
            let x, y;
            if (this.so.x !== undefined && this.so.y !== undefined) {
                x = this.so.x + dx;
                y = this.so.y + dy;
                if (minX !== undefined && x < minX) { x = minX }
                if (maxX !== undefined && x > maxX) { x = maxX }
                if (minY !== undefined && y < minY) { y = minY }
                if (maxY !== undefined && y > maxY) { y = maxY }
            }
            move({ dx, dy, dist, x, y, mousePosition: { ...this.getMousePosition(e) } }, e);
        },
        mouseUp(e) {
            eventHandler('window', 'mousemove', this.mouseMove, 'unbind');
            eventHandler('window', 'mouseup', this.mouseUp, 'unbind');
            if(end){end({ dx: this.dx, dy: this.dy, dist: this.dist }, e)} 
        }
    }
    a.init();
}
function AIOInputSearch(items: any[], searchValue: string, getValue?: (o: any, index: number) => any) {
    if (!searchValue) { return items }
    function isMatch(keys, value) {
        for (let i = 0; i < keys.length; i++) {
            if (value.indexOf(keys[i]) === -1) { return false }
        }
        return true
    }
    let keys = searchValue.split(' ');
    return items.filter((o, i) => isMatch(keys, getValue ? getValue(o, i) : o))
}
function ExportToExcel(rows, config:any = {}) { 
    let { promptText = 'Inter Excel File Name' } = config; 
    let o = { 
        fixPersianAndArabicNumbers(str) { 
            if (typeof str !== 'string') { return str } 
            let persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g], 
                arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]; 
            for (var i = 0; i < 10; i++) {str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);} 
            return str; 
        }, 
        getJSON(rows) { 
            let result = []; 
            for (let i = 0; i < rows.length; i++) { 
                let json = rows[i], fixedJson = {}; 
                for (let prop in json) {fixedJson[prop] = this.fixPersianAndArabicNumbers(json[prop])} 
                result.push(fixedJson); 
            } 
            return result; 
        }, 
        export() { 
            let name = window.prompt(promptText); 
            if (!name || name === null || !name.length) { return }; 
            var data = this.getJSON(rows); 
            var arrData = typeof data != "object" ? JSON.parse(data) : data; 
            var CSV = ""; CSV += '\r\n\n'; 
            if (true) { 
                let row = ""; 
                for (let index in arrData[0]) {row += index + ",";} 
                row = row.slice(0, -1); CSV += row + "\r\n"; 
            } 
            for (var i = 0; i < arrData.length; i++) { 
                let row = ""; 
                for (let index in arrData[i]) {row += '"' + arrData[i][index] + '",';} 
                row.slice(0, row.length - 1); CSV += row + "\r\n"; 
            } 
            if (CSV === "") { 
                alert("Invalid data"); return; 
            } 
            var fileName = name.replace(/ /g, "_"); 
            var universalBOM = "\uFEFF"; 
            var uri = "data:text/csv;charset=utf-8," + encodeURIComponent(universalBOM + CSV); 
            let link:any = document.createElement("a"); 
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
async function DownloadUrl(url, name) { fetch(url, { mode: 'no-cors', }).then(resp => resp.blob()).then(blob => { let url = window.URL.createObjectURL(blob); let a = document.createElement('a'); a.style.display = 'none'; a.href = url; a.download = name; document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); }).catch(() => alert('oh no!')); }
function JSXToHTML(html) { return ReactDOMServer.renderToStaticMarkup(html) }
function GetDistance(p1, p2) {
    let { lat: lat1, lng: lon1 } = p1;
    let { lat: lat2, lng: lon2 } = p2;
    let rad = Math.PI / 180;
    let radius = 6371; //earth radius in kilometers
    return Math.acos(Math.sin(lat2 * rad) * Math.sin(lat1 * rad) + Math.cos(lat2 * rad) * Math.cos(lat1 * rad) * Math.cos(lon2 * rad - lon1 * rad)) * radius; //result in Kilometers
}
export function Acardion(props:any = {}) {
    let { items, singleOpen } = props;
    let [openDic, setOpenDic] = useState({})
    function toggle(id) {
        let open = !!openDic[id]
        if (singleOpen) { setOpenDic(open ? {} : { [id]: true }) }
        else { setOpenDic({ ...openDic, [id]: !openDic[id] }) }
    }
    function item_node(o):I_RVD_node {
        let { id } = o;
        let open = !!openDic[id];
        return {
            className: 'aio-input-acardion-item',
            column: [
                item_header_node(o, open),
                item_content_node(o, open)
            ]
        }
    }
    function item_header_node(o, open):I_RVD_node {
        let { name, after, id, headerAttrs = {} } = o;
        let className = 'aio-input-acardion-header';
        if (open) { className += ' open' }
        if (headerAttrs.className) { className += ' ' + headerAttrs.className }
        return {
            className: 'aio-input-acardion-header align-v' + (open ? ' open' : ''),
            row: [
                { html: <Icon path={open ? mdiChevronDown : mdiChevronLeft} size={0.8} />, className: 'aio-input-acardion-toggle align-vh', onClick: () => toggle(id) },
                { html: name, flex: 1, className: 'aio-input-acardion-name' },
                { show: !!after, html: () => typeof after === 'function' ? after(open) : after, className: 'aio-input-acardion-after align-vh' }
            ]
        }
    }
    function item_content_node(o, open):I_RVD_node {
        let { content, contentAttrs = {} } = o;
        if (!open) { return {} }
        return {
            style: contentAttrs.style,
            className: 'aio-input-acardion-content' + (contentAttrs.className ? ' ' + contentAttrs.className : ''),
            html: content()
        }
    }
    return (
        <RVD
            rootNode={{
                className: 'aio-input-acardion',
                column: items.map((o) => item_node(o))
            }}
        />
    )
}
export function Tree(props:any = {}) {
    let { getText, getBefore, getOptions, getSubtext, onAdd, onRemove, data, indent = 12, getOptionBefore, onChange } = props;
    let [openDic, setOpenDic] = useState({})
    function getColumn() { return getColumn_req([...data], 0, undefined); }
    function getColumn_req(model, level, parent) {
        return model.map((o, i) => {
            let childs = o.childs || []
            return {
                style: { paddingRight: level * indent },
                column: [
                    row_node(o, parent),
                    { show: !!childs.length && openDic[o.id] !== false, column: getColumn_req(childs, level + 1, o) }
                ]
            }
        })
    }
    async function add(parent?:any) {
        let obj = await onAdd(parent);
        if (!obj) { return }
        if (parent) { parent.childs = parent.childs || []; parent.childs.push(obj); }
        else { data.push(obj) }
        onChange(data);
    }
    async function remove(o, parent) {
        let res = await onRemove(o, parent);
        if (!res) { return }
        if (!parent) { data = data.filter((row) => row.id !== o.id) }
        else { parent.childs = parent.childs.filter((row) => row.id !== o.id); }
        onChange(data)
    }
    function GetOptions(row, parent) {
        let res = [];
        if (onAdd) {
            res.push({ text: 'افزودن', value: 'add', before: getOptionBefore ? getOptionBefore('add') : undefined, onClick: () => add(row) })
        }
        let options = getOptions ? getOptions(row) : [];
        for (let i = 0; i < options.length; i++) {
            let { text, value, onClick } = options[i];
            res.push({ text, value, before: getOptionBefore ? getOptionBefore(value) : undefined, onClick })
        }
        if (onRemove) {
            res.push({ text: 'حذف', value: 'remove', before: getOptionBefore ? getOptionBefore('remove') : undefined, onClick: () => remove(row, parent) })
        }
        return res
    }
    function row_node(o, parent):I_RVD_node {

        let toggle = o.childs.length ? <Icon path={openDic[o.id] === false ? mdiChevronLeft : mdiChevronDown} size={1} /> : ''
        let Options = () => {
            let options = GetOptions(o, parent)
            if (!options.length) { return false }
            return (<AIOInput key={o.id} type='select' caret={false} style={{ background: 'none' }} options={options} text={<Icon path={mdiDotsHorizontal} size={0.8} />} />)
        }
        let before = getBefore ? getBefore(o, parent) : undefined
        let subtext = getSubtext ? getSubtext(o, parent) : undefined
        let text = getText ? getText(o, parent) : undefined
        let options = Options()
        return {
            className: 'aio-input-tree-row',
            row: [
                { className: 'aio-input-tree-toggle align-vh', html: toggle, onClick: () => setOpenDic({ ...openDic, [o.id]: openDic[o.id] === undefined ? false : !openDic[o.id] }) },
                { className: 'aio-input-tree-before align-vh', show: !!before, html: before },
                {
                    className: 'aio-input-tree-texts align-v flex-1',
                    column: [
                        { html: text, className: 'aio-input-tree-text align-v' },
                        { show: !!subtext, html: subtext, className: 'aio-input-tree-subtext align-v' }
                    ]
                },
                { show: !!options, html: () => options, className: 'aio-input-tree-options align-vh' }
            ]
        }
    }
    function header_node():I_RVD_node {
        if (!onAdd) { return {} }
        return {
            className: 'aio-input-tree-header align-v',
            html: () => <button onClick={() => add()}><Icon path={mdiPlusThick} size={.8} />افزودن</button>
        }
    }
    function body_node():I_RVD_node {
        return { className: 'aio-input-tree-body', column: getColumn() }
    }
    return (<RVD rootNode={{ className: 'aio-input-tree', column: [header_node(), body_node()] }} />)
}
export function AIOValidation(props) {
    let $$ = {
        translate(text) {
            if (!text) { return text }
            let { lang } = props;
            let dict = {
                'should be contain': 'باید شامل',
                'should be before': 'باید قبل از',
                'cannot be after': 'نمی تواند بعد از',
                'should be after': 'باید بعد از',
                'cannot be before': 'نمی تواند قبل از',
                'should not be contain': 'نمی تواند شامل',
                'should be less than': 'باید کمتر از',
                'should be more than': 'باید بیشتر از',
                'could not be more than': 'نباید بزرگ تر از',
                'could not be less than': 'نباید کوچک تر از',
                'character(s)': 'کاراکتر',
                'item(s)': 'مورد',
                'should be equal': 'باید برابر',
                'cannot be equal': 'نمی تواند برابر'
            }
            return lang === 'fa' ? dict[text] : text
        },
        getMessage(target, { be, validation, unit = '' }) {
            let params = validation[2] || {}
            let { title = props.title, target: targetPresentation = target, message } = params;
            if (message) { return message }
            return `${title} ${this.translate(be)} ${JSON.stringify(targetPresentation)} ${unit}` + (props.lang === 'fa' ? ' باشد' : '')
        },
        contain(target, validation, value) {
            let config = { be: 'should be contain', validation };
            if (target === 'number') { if (!/\d/.test(value)) { return this.getMessage('number', config) } }
            else if (target === 'letter') { if (!/[a-zA-Z]/.test(value)) { return this.getMessage('letter', config) } }
            else if (target === 'uppercase') { if (!/[A-Z]/.test(value)) { return this.getMessage('uppercase', config) } }
            else if (target === 'lowercase') { if (!/[a-z]/.test(value)) { return this.getMessage('lowercase', config) } }
            else if (target === 'symbol') { if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value)) { return this.getMessage('symbol', config) } }
            else if (typeof target.test === 'function') { if (!target.test(value)) { return this.getMessage(target.toString(), config) } }
            else { if (value.indexOf(target) === -1 && target !== undefined) { return this.getMessage(target, config) } }
        },
        notContain(target, validation, value) {
            let config = { be: 'should not be contain', validation };
            if (target === 'number') { if (/\d/.test(value)) { return this.getMessage('number', config) } }
            else if (target === 'letter') { if (/[a-zA-Z]/.test(value)) { return this.getMessage('letter', config) } }
            else if (target === 'uppercase') { if (/[A-Z]/.test(value)) { return this.getMessage('uppercase', config) } }
            else if (target === 'lowercase') { if (/[a-z]/.test(value)) { return this.getMessage('lowercase', config) } }
            else if (target === 'symbol') { if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value)) { return this.getMessage('symbol', config) } }
            else if (typeof target.test === 'function') { if (target.test(value)) { return this.getMessage(target.toString(), config) } }
            else { if (value.indexOf(target) !== -1) { return this.getMessage(target, config) } }
        },
        length(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be contain', unit }) }
            if (value && value.length !== target) { return this.getMessage(target, { validation, be: 'should be contain', unit }) }
        },
        notLength(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should not be contain', unit }) }
            if (value && value.length === target) { return this.getMessage(target, { validation, be: 'should not be contain', unit }) }
        },
        lengthLess(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be less than', unit }) }
            if (value && value.length >= target) { return this.getMessage(target, { validation, be: 'should be less than', unit }) }
        },
        lengthLessEqual(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'could not be more than', unit }) }
            if (value && value.length > target) { return this.getMessage(target, { validation, be: 'could not be more than', unit }) }
        },
        lengthMore(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be more than', unit }) }
            if (value && value.length <= target) { return this.getMessage(target, { validation, be: 'should be more than', unit }) }
        },
        lengthMoreEqual(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'could not be less than', unit }) }
            if (value && value.length < target) { return this.getMessage(target, { validation, be: 'could not be less than', unit }) }
        },
        equal(target, validation, value, a, exact) {
            if (exact) { this.getMessage(target, { validation, be: 'should be equal' }) }
            if (JSON.stringify(value) !== JSON.stringify(target)) {
                return this.getMessage(target, { validation, be: 'should be equal' })
            }
        },
        not(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'cannot be equal' }) }
            if (JSON.stringify(value) === JSON.stringify(target)) {
                return this.getMessage(target, { validation, be: 'cannot be equal' })
            }
        },
        dateLess(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be before' }) }
            if (AIODate().isGreater(value, target) || AIODate().isEqual(value, target)) {
                return this.getMessage(target, { validation, be: 'should be before' })
            }
        },
        dateLessEqual(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'cannot be after' }) }
            if (AIODate().isGreater(value, target)) {
                return this.getMessage(target, { validation, be: 'cannot be after' })
            }
        },
        dateMore(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be after' }) }
            if (AIODate().isLess(value, target) || AIODate().isEqual(value, target)) {
                return this.getMessage(target, { validation, be: 'should be after' })
            }
        },
        dateMoreEqual(target, validation, value, a, exact) {
            if (exact) { this.getMessage(target, { validation, be: 'cannot be before' }) }
            if (AIODate().isLess(value, target)) {
                return this.getMessage(target, { validation, be: 'cannot be before' })
            }
        },
        less(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be less than' }) }
            if (typeof value === 'number' && typeof target === 'number' && value >= target) {
                return this.getMessage(target, { validation, be: 'should be less than' })
            }
        },
        lessEqual(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'could not be more than' }) }
            if (typeof value === 'number' && typeof target === 'number' && value > target) {
                return this.getMessage(target, { validation, be: 'could not be more than' })
            }
        },
        more(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be more than' }) }
            if (typeof value === 'number' && typeof target === 'number' && value <= target) {
                return this.getMessage(target, { validation, be: 'should be more than' })
            }
        },
        moreEqual(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'could not be less than' }) }
            if (typeof value === 'number' && typeof target === 'number' && value < target) {
                return this.getMessage(target, { validation, be: 'could not be less than' })
            }
        },
        getResult(fn, target, validation, value, unit) {
            target = Array.isArray(target) ? target : [target];
            if (Array.isArray(target)) {
                let matchedTargets = [];
                let notMatchedTargets = [];
                for (let i = 0; i < target.length; i++) {
                    let result = this[fn](target[i], validation, value, unit)
                    if (!result) { matchedTargets.push(target[i]) }
                    else { notMatchedTargets.push(target[i]) }
                }
                if (matchedTargets.length) { return }
                // if(notMatchedTargets.length > 3){
                //   notMatchedTargets = [notMatchedTargets[0],notMatchedTargets[1],notMatchedTargets[2],'...']
                // }
                return this[fn](notMatchedTargets.join(' or '), validation, value, unit, true)
            }
            else {
                let result = this[fn](target, validation, value, unit)
                if (result) { return result }
            }

        },
        getValidation() {
            let { lang = 'en', value, validations = [] } = props;
            let unit = '';
            if (Array.isArray(value)) { unit = this.translate('item(s)') }
            else if (typeof value === 'string') { unit = this.translate('character(s)') }
            for (let i = 0; i < validations.length; i++) {
                let [type, target, params = {}] = validations[i];
                let result;
                if (type === 'function') {
                    result = target(value);
                }
                else if (type === 'required') {
                    if (value === undefined || value === null || value === '' || value === false || value.length === 0) {
                        let { title = props.title } = params;
                        if (lang === 'en') { return `${title} is required` }
                        if (lang === 'fa') { return `وارد کردن ${title} ضروری است` }
                    }
                }
                else if (type === 'contain') { result = this.getResult('contain', target, validations[i], value) }
                else if (type === '!contain') { result = this.getResult('notContain', target, validations[i], value) }
                else if (type === 'length') { result = this.getResult('length', target, validations[i], value, unit) }
                else if (type === '!length') { result = this.getResult('notLength', target, validations[i], value, unit) }
                else if (type === 'length<') { result = this.getResult('lengthLess', target, validations[i], value, unit) }
                else if (type === 'length<=') { result = this.getResult('lengthLessEqual', target, validations[i], value, unit) }
                else if (type === 'length>') { result = this.getResult('lengthMore', target, validations[i], value, unit) }
                else if (type === 'length>=') { result = this.getResult('lengthMoreEqual', target, validations[i], value, unit) }
                else if (type === '=') { result = this.getResult('equal', target, validations[i], value) }
                else if (type === '!=') { result = this.getResult('not', target, validations[i], value) }
                else if (type === '<') { result = this.getResult('less', target, validations[i], value) }
                else if (type === '<=') { result = this.getResult('lessEqual', target, validations[i], value) }
                else if (type === '>') { result = this.getResult('more', target, validations[i], value) }
                else if (type === '>=') { result = this.getResult('moreEqual', target, validations[i], value) }
                else if (type === 'date<') { result = this.getResult('dateLess', target, validations[i], value) }
                else if (type === 'date<=') { result = this.getResult('dateLessEqual', target, validations[i], value) }
                else if (type === 'date>') { result = this.getResult('dateMore', target, validations[i], value) }
                else if (type === 'date>=') { result = this.getResult('dateMoreEqual', target, validations[i], value) }
                if (result) { return result }
            }
            return ''
        }
    }
    props.translate = props.translate || function (text) { return text }
    props.lang = props.lang || 'en';
    let validation;
    try { validation = $$.getValidation() } catch { validation = '' }
    return validation;
}
export function AIOInputSetStorage(name, value) {
    let storage = AIOStorage('aio-input-storage');
    storage.save({ name, value })
}
export function getFormInputs(fields, path) {
    function getInput(input) { return typeof input === 'string' ? getFormInput(input, path) : input }
    return fields.map((o) => Array.isArray(o) ? { row: o.map((oo) => getInput(oo)) } : getInput(o))
}
export function getFormInput(Field, path) {
    function getOptions(field, path) {
        return {
            militaryservice: () => ['مشمول', 'معاف', 'پایان خدمت'], gender: () => ['مرد', 'زن'], married: () => ['مجرد', 'متاهل'], state: () => Object.keys(getCities()),
            city: () => (value) => {
                let state;
                try { eval(`state = value${path ? '.' + path : ''}.state`) } catch { }
                return !state ? [] : getCities()[state]
            },

        }[field]()
    }
    function getField(field) { return `value${path ? `.${path}` : ''}.${field}` }
    function getBase(field) {
        let list = field.split('_');
        if (list.length >= 3) {
            let inputProps = {}
            if (list[3]) {
                try { inputProps = JSON.parse(list[3]) } catch { }
            }
            return { field: list[0], input: { type: list[1], ...inputProps }, label: list[2], extra: {} }
        }
        let { input, label, extra = {} } = {
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
function getTypes(props) {
    let { type, multiple } = props;
    let isMultiple;
    if (type === 'multiselect' || type === 'table') { isMultiple = true }
    else if (type === 'radio' || type === 'slider' || type === 'file') { isMultiple = !!multiple }
    else { isMultiple = false };
    return {
        isMultiple,
        isInput: ['text', 'number', 'textarea', 'password'].indexOf(type) !== -1,
        isDropdown: ['text', 'number', 'textarea', 'select', 'multiselect', 'button', 'datepicker'].indexOf(type) !== -1,
        hasOption: ['text', 'number', 'textarea', 'color', 'select', 'multiselect', 'radio', 'tabs', 'list'].indexOf(type) !== -1,
        hasPlaceholder: ['text', 'number', 'textarea', 'color', 'select', 'table', 'image', 'datepicker'].indexOf(type) !== -1,
        hasKeyboard: ['text', 'textarea', 'number', 'password'].indexOf(type) !== -1,
        hasText: ['multiselect', 'checkbox', 'button', 'select'].indexOf(type) !== -1,
        hasSearch: ['multiselect', 'table', 'select'].indexOf(type) !== -1
    }
}
class DragClass {
    rootProps: I_AIOInput;
    dragIndex: number;
    constructor(p) {
        this.rootProps = p.rootProps;
        this.dragIndex = undefined;
    }
    start = (e) => { this.dragIndex = parseInt($(e.target).attr('datarealindex')); }
    over = (e) => { e.preventDefault(); }
    drop = (e) => {
        e.stopPropagation();
        let from = this.dragIndex, dom = $(e.target);
        if (!dom.hasClass('aio-input-option')) { dom = dom.parents('.aio-input-option'); };
        if (!dom.hasClass('aio-input-option')) { return };
        let { onSwap, options } = this.rootProps;
        let to = parseInt(dom.attr('datarealindex'));
        if (from === to) { return }
        if (typeof onSwap === 'function') { onSwap(this.swap(options, from, to), from, to) }
    }
    swap = (arr, from, to) => {
        if (to === from + 1) { let a = to; to = from; from = a; }
        let Arr = arr.map((o, i) => { o._testswapindex = i; return o })
        let fromIndex = Arr[from]._testswapindex
        Arr.splice(to, 0, { ...Arr[from], _testswapindex: false })
        return Arr.filter((o) => o._testswapindex !== fromIndex)
    }
}
const addToAttrs: I_AIOInput_addToAttrs = (attrs: any, p: { className?: string, style?: any, stylePriority?: boolean }) => {
    attrs = attrs || {};
    let { className, style, stylePriority = true } = p;
    let classNames = [];
    if (attrs.className) { classNames.push(attrs.className) }
    if (className) { classNames.push(className) }
    let newClassName = classNames.length ? classNames.join(' ') : undefined
    let newStyle = stylePriority ? { ...attrs.style, ...style } : { ...style, ...attrs.style };
    return { ...attrs, className: newClassName, style: newStyle }
}
function getDatepickerText(rootProps:I_AIOInput) {
    let { value, unit = 'day', pattern: Pattern, calendarType, placeholder } = rootProps;
    if (value) {
        let list = AIODate().convertToArray({ date: value });
        let [year, month = 1, day = 1, hour = 0] = list;
        list = [year, month, day, hour];
        let pattern;
        let splitter = AIODate().getSplitter(value)
        if (Pattern) { pattern = Pattern }
        else if (unit === 'month') { pattern = `{year}${splitter}{month}` }
        else if (unit === 'day') { pattern = `{year}${splitter}{month}${splitter}{day}` }
        else if (unit === 'hour') { pattern = `{year}${splitter}{month}${splitter}{day} - {hour} : 00` }
        return <div style={{ direction: 'ltr' }}>{AIODate().getDateByPattern({ date: list, pattern })}</div>
    }
    return placeholder || (calendarType === 'gregorian' ? 'Select Date' : 'انتخاب تاریخ')
}
function D2S(n) { n = n.toString(); return n.length === 1 ? '0' + n : n }
function eventHandler(selector, event, action, type = 'bind') {
    var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" };
    let touch = 'ontouchstart' in document.documentElement
    event = touch ? me[event] : event;
    var element = typeof selector === "string" ? (selector === "window" ? $(window) : $(selector)) : selector;
    element.unbind(event, action);
    if (type === 'bind') { element.bind(event, action) }
}
function getClient(e) { return 'ontouchstart' in document.documentElement && e.changedTouches ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY } }
