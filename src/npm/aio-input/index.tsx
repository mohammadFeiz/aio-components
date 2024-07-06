/////////////dependencies//////////////
import React, { createRef, useContext, createContext, useState, useEffect, useRef, FC, Fragment, ReactNode } from 'react';
import {
    mdiChevronDown, mdiLoading, mdiAttachment, mdiClose, mdiCircleMedium, mdiMagnify,
    mdiPlusThick, mdiImage, mdiEye, mdiEyeOff, mdiDotsHorizontal,
    mdiChevronRight, mdiChevronLeft, mdiArrowDown, mdiArrowUp, mdiFileExcel, mdiSort,
    mdiDelete, mdiCrosshairsGps, mdiCircleSmall,
    mdiCircle
} from "@mdi/js";
import { Icon } from '@mdi/react';
import $ from 'jquery';
import Axios from "axios";
import AIOPopup,{ AP_position,AP_modal } from "./../../npm/aio-popup";
/////////////my dependencies//////////
import { 
    Get2Digit, AIODate, GetClient, EventHandler, Swip, DragClass, I_Swip_parameter, AddToAttrs, Storage, ExportToExcel, I_Swip_mousePosition, 
    getEventAttrs, svgArc, JSXToHTML, HasClass, FilePreview, DownloadFile, ParseString, GetPrecisionCount 
} from './../../npm/aio-utils';
/////////////style//////////////////
import './index.css';
////////////////////////////////////
type RN = ReactNode
const AICTX = createContext({} as any);
const AIOInput: FC<AI> = (props) => {
    let type = props.type,round = props.round;
    let value = props.value
    if (type as any === 'spinner') {
        type = 'range';
        if (!round || typeof round !== 'number') {round = 1;}
    }
    else if (type === 'slider') {type = 'range'; round = 0;}
    else if (type === 'range') {return null;}
    if(type === 'form'){value = {...value}}
    let rootProps: AI = { ...props, type, round,value }
    if(type === 'text' && rootProps.fetchOptions){
        return <SuggestionInput {...rootProps}/>
    }
    return <AIOINPUT {...rootProps} />
}
export default AIOInput
const SuggestionInput: FC<AI> = (props) => {
    const [searchResult, SetSearchResult] = useState<any[]>([])
    const [value, setValue] = useState<string>('')
    async function setSearchResult(newValue: any) {
        setValue(newValue)
        if (!newValue) {
            SetSearchResult([])
            return
        }
        const res: any[] = props.fetchOptions?await props.fetchOptions(newValue):[];
        SetSearchResult(res)
    }
    return (
        <AIOInput
            {...props}
            value={value}
            options={searchResult}
            option={{
                ...props.option,
                onClick: (obj: any,details) => {
                    const text = GetOptionProps({props,option:obj,key:'text',details})
                    setSearchResult(text);
                    if(props.onChange){props.onChange(obj);}
                }
            }}
            fetchOptions={undefined}
            onChange={(newValue) => setSearchResult(newValue)}
        />
    )
}
function AIOINPUT(props: AI) {
    let [types] = useState<AI_types>(getTypes(props))
    let [DATE] = useState<AIODate>(new AIODate())
    props = getDefaultProps(props, types)
    let { type, value, onChange, attrs = {} ,rtl} = props;
    let [parentDom] = useState<any>(createRef())
    let [datauniqid] = useState('aiobutton' + (Math.round(Math.random() * 10000000)))
    let [openPopover] = useState<any>(getOpenPopover);
    let [error,setError]=  useState<string>()
    useEffect(()=>{
        validate()
    },[props.value])
    function validate(){
        const {validations,lang = 'en',label} = props;
        if(!validations){return}
        const title = label || '';
        const res = new AIOValidation({ value, title: title.replace(/\*/g, ''), lang, validations }).validate()
        setError(res)
    }
    function getOpenPopover(){
        if(!types.isDropdown){return false}
        let className = 'aio-input-popover';
        className += ` aio-input-popover-${rtl ? 'rtl' : 'ltr'}`
        if(types.hasOption){className += ' aio-input-dropdown'}
        if(type === 'time'){className += ' aio-input-time-popover'}
        return (dom: any) => {
            let popover: AI_popover = { ...(props.popover || {}) }
            let { type,multiple } = props;
            let { body,limitTo,header,setAttrs = ()=>{return {}},position = 'popover' } = popover;
            let target: RN = $(dom.current)
            let fitHorizontal = ['text', 'number', 'textarea'].indexOf(type) !== -1 || (type === 'select' && !!multiple) || !!popover.fitHorizontal
            let config: AP_modal = {
                //props that have default but can change by user
                position,
                fitHorizontal,
                //props that havent default but can define by user(header,footer,fitTo,fixStyle)
                limitTo,
                header,
                //props that cannot change by user
                onClose: () => toggle(false),
                body: ({ close }) => {
                    if (body) { return body({ close }) }
                    else if (type === 'date') { return <Calendar onClose={close} /> }
                    else if (type === 'time') { return <TimePopover onClose={close} /> }
                    else { return <Options /> }
                },
                pageSelector: '.aio-input-backdrop.' + datauniqid,
                getTarget: () => target,
                setAttrs:(key:'backdrop' | 'modal' | 'header' | 'body' | 'footer')=>{
                    let attrs = setAttrs(key);
                    if(key === 'modal'){
                        return AddToAttrs(attrs, { className })
                    }
                    if(key === 'backdrop'){
                        return AddToAttrs(attrs, { className: 'aio-input-backdrop ' + datauniqid })
                    }
                }
            }
            return config;
        }
    }
    let [popup] = useState(getPopup(AIOPopup))
    function getPopup(ctor: { new(p?: { rtl?: boolean }): AIOPopup }): AIOPopup {
        return new ctor({ rtl: props.rtl })
    }
    let [open, setOpen] = useState<boolean>(!!props.open);
    let [showPassword, SetShowPassword] = useState<boolean>(false);
    function setShowPassword(state?: boolean) { SetShowPassword(state === undefined ? !showPassword : state) }
    let [DragOptions] = useState<DragClass>(
        new DragClass({
            className: 'aio-input-option',
            onChange: (newOptions, from, to) => { if (typeof props.onSwap === 'function') { props.onSwap(newOptions, from, to) } }
        })
    )
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
    function click(e: Event, dom: any) {
        if (type === 'checkbox') { if (onChange) { onChange(!value,e) } }
        else if (openPopover !== false) { toggle(openPopover(dom)) }
        else if (typeof props.onClick === 'function') { props.onClick(e) }
        else if (attrs.onClick) { attrs.onClick(); }
    }
    function optionClick(option: AI_option) {
        let { attrs = {}, onClick, close } = option;
        if (onClick) { onClick(option.object,option.details); }
        else if (attrs.onClick) { attrs.onClick(option); }
        else if (onChange) {
            if (types.isInput) { /*do nothing*/ }
            else if (type === 'tree') {/*do nothing*/ }
            else if (type === 'file') {/*do nothing*/ }
            else if (types.isMultiple) {
                let { multiple } = props, newValue;
                if (value.indexOf(option.value) === -1) { newValue = value.concat(option.value) }
                else { newValue = value.filter((o: any) => o !== option.value) }
                while (typeof multiple === 'number' && newValue.length > multiple) {
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
    function getOptions():{optionsList:any[],optionsDic:{[key:string]:any}}{
        let options:any[] = [];
        if(type === 'date'){
            if(!props.multiple){return {optionsList:[],optionsDic:{}}}
            options = [...props.value]
        }
        else if(typeof props.options === 'function'){options = props.options()}
        else if(props.options){options = props.options}
        else {options = [];}
        return GetOptions({rootProps:props,types,options})
    }
    function getContext(): AI_context {
        let context: AI_context = {
            error,
            options:getOptions(),
            rootProps: { ...props, value }, datauniqid, touch: 'ontouchstart' in document.documentElement,
            DragOptions, open, click, optionClick, types, showPassword, setShowPassword, DATE
        }
        return context
    }
    function getRangeClassName() {
        let { round, vertical } = props;
        if (round) { return 'aio-input-range-round' }
        if (vertical) { return 'aio-input-range-vertical' }
        return 'aio-input-range-horizontal'
    }
    let render: { [key in AI_type]: () => RN } = {
        spinner: () => null,
        slider: () => null,
        acardion: () => <Acardion/>,
        tree: () => <Tree />,
        tags: () => <Layout properties={{ text: <Tags /> }} />,
        list: () => <List />,
        file: () => <File />,
        select: () => <Select/>,
        table: () => <Table />,
        form: () => <Form />,
        checkbox: () => <Layout />,
        button: () => <Layout />,
        range: () => <Layout properties={{ text: <Range />, className: getRangeClassName() }} />,
        radio: () => <Layout properties={{ text: <Options /> }} />,
        tabs: () => <Layout properties={{ text: <Options /> }} />,
        buttons: () => <Layout properties={{ text: <Options /> }} />,
        date: () => <DateInput />,
        time: () => <Layout properties={{ text: getTimeText(props) }} />,
        image: () => <Layout properties={{ text: <Image /> }} />,
        text: () => <Layout properties={{ text: <Input /> }} />,
        password: () => <Layout properties={{ text: <Input /> }} />,
        textarea: () => <Layout properties={{ text: <Input /> }} />,
        number: () => <Layout properties={{ text: <Input /> }} />,
        color: () => <Layout properties={{ text: <Input /> }} />
    }
    if (!type || !render[type]) { return null }
    return (<AICTX.Provider key={datauniqid} value={getContext()}>{render[type]()}{popup.render()}</AICTX.Provider>)
}
function TimePopover(props: { onClose: () => void }) {
    let { DATE, rootProps }: AI_context = useContext(AICTX)
    let { jalali,onChange } = rootProps;
    let { onClose } = props;
    let [value, setValue] = useState<type_time_value>(getTimeByUnit(rootProps))
    let [startYear] = useState(value.year ? value.year - 10 : undefined);
    let [endYear] = useState(value.year ? value.year + 10 : undefined);
    function change(obj: { [key in AI_timeUnits]?: number }) {
        setValue({ ...value, ...obj })
    }
    function translate(key: AI_timeUnits | 'Submit' | 'Now') {
        return !!jalali ? { 'year': 'سال', 'month': 'ماه', 'day': 'روز', 'hour': 'ساعت', 'minute': 'دقیقه', 'second': 'ثانیه', 'Submit': 'ثبت', 'Now': 'اکنون' }[key] : key
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
    function layout(type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'): RN {
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
    function submit() {if (onChange) { onChange(value); }onClose();}
    function now() {setValue(getTimeByUnit(rootProps,true))}
    return (
        <div className='aio-input-time-popover-content'>
            <div className="aio-input-time-popover-body">
                {layout('year')} {layout('month')} {layout('day')} {layout('hour')} {layout('minute')} {layout('second')}
            </div>
            <div className="aio-input-time-popover-footer">
                <button className='aio-input-primary-button' onClick={submit}>{translate('Submit')}</button>
                {rootProps.now !== false && <button className='aio-input-secondary-button' onClick={now}>{translate('Now')}</button>}
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
            position: 'center',header: { title: '', onClose: () => popup.removeModal() },
            body: () => <div className='aio-input-image-preview-popup'><img src={$(dom.current).attr('src')} alt={placeholder as string} /></div>
        })
    }
    let IMG = url ? (
        <>
            <img
                ref={dom as any}
                src={url}
                alt={placeholder as string}
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
    let { value = [], onChange = () => { }, disabled, multiple, inputAttrs } = rootProps;
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
            if(typeof multiple === 'number'){
                while (result.length > multiple) {
                    result = result.slice(1, result.length)
                }
            }
        }
        else { result = Files.length ? Files[0] : undefined }
        onChange(result)
    }
    let props = { disabled: disabled === true, type: 'file', style: { display: 'none' }, multiple: types.isMultiple, onChange: (e: any) => change(e), ...inputAttrs }
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
    let Files = files.map((file, i) => { return <FileItem key={i} file={file} index={i}/> })
    return (<div className='aio-input-files' style={{ direction: rtl ? 'rtl' : 'ltr' }}>{Files}</div>)
}
type AI_FileItem = {file:any,index:number}
const FileItem:FC<AI_FileItem> = (props) => {
    let { rootProps, types }: AI_context = useContext(AICTX);
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
    function download() {
        DownloadFile(file)
    }
    function getIcon() {
        let filePreview;
        if (rootProps.preview) { filePreview = FilePreview(file, { style: { height: '100%' }, height: '100%', onClick: () => download() }) }
        if (filePreview && filePreview !== null) {
            return filePreview;
        }
        return (<div className='aio-input-file-item-icon' onClick={() => download()}>{I(mdiAttachment, .8)}</div>)
    }
    let { minName, sizeString } = getFile(file);
    let { url } = file;

    let {optionsList} = GetOptions({
        rootProps, types,
        options: [{ url, minName, sizeString, index }],
        defaultOptionProps: {
            subtext: () => sizeString,
            text: () => minName,
            before: () => getIcon(),
            after: () => <div className='aio-input-file-item-icon' onClick={(e) => { e.stopPropagation(); e.preventDefault(); remove(index) }}>{I(mdiClose, .7)}</div>
        }
    })
    let option = optionsList[0]
    return <Layout option={option} />
}
function Select() {
    let { rootProps,types,options }: AI_context = useContext(AICTX);
    let {value,hideTags} = rootProps;
    
    let values:any[] = Array.isArray(value)?[...value]:(value !== undefined?[value]:[])
    function getSelectText() {
        if (!values.length) { return }
        let option:AI_option = options.optionsDic['a' + values[0]]
        if (!option) { return }
        return option.text
    }
    if(types.isMultiple){
        return (
            <div className={'aio-input-multiselect-container'}>
                <Layout />
                {!hideTags && !!values.length && <Tags />}
            </div>
        )
    }
    else {return <Layout properties={{ text: rootProps.text || getSelectText() }} />}
}
function DateInput() {
    let { rootProps,types }: AI_context = useContext(AICTX);
    let {value,hideTags} = rootProps;
    
    let values:any[] = Array.isArray(value)?[...value]:(value !== undefined?[value]:[])
    function getDateText() {
        let { value, unit = Def('date-unit'), text, pattern: PT, jalali, placeholder } = rootProps;
        if (value) {
            text = PT !== undefined ? PT : text;
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
    if(types.isMultiple){
        return (
            <div className={'aio-input-multiselect-container'}>
                <Layout properties={{ text: rootProps.text || 'Select Dates' }} />
                {!hideTags && !!values.length && <Tags />}
            </div>
        )
    }
    else {return <Layout properties={{ text: getDateText() }} />}
}
const Tags:FC = () => {
    let { rootProps,options }: AI_context = useContext(AICTX);
    let { value = [], rtl, disabled,onChange = ()=>{} } = rootProps;
    let tags = value.map((o: any, i: number) => {
        let option:AI_option = options.optionsDic['a' + o];
        if (option === undefined) { return null }
        return (
            <Tag 
                onClose={()=>onChange(rootProps.value.filter((rpv: any) => rpv !== o))} 
                key={i} 
                attrs={option.tagAttrs} 
                before={option.tagBefore} 
                after={option.tagAfter} 
                text={option.text} 
                disabled={option.disabled}
            />
        )
    })
    return !tags.length ? null : <div className={`aio-input-tags-container aio-input-scroll${rtl ? ' rtl' : ''}${disabled ? ' disabled' : ''}`}>{tags}</div>
}
type AI_Tag = { attrs?:any,before?:RN,after?:RN,text:RN,disabled?:boolean,onClose?:()=>void }
const Tag:FC<AI_Tag> = (props) => {
    let { attrs,before = I(mdiCircleMedium, 0.7),after,text,disabled,onClose = ()=>{} } = props;
    let close = disabled ? undefined : onClose
    let cls = 'aio-input-tag'
    let Attrs = AddToAttrs(attrs,{className:[cls + ' aio-input-main-bg',disabled?'disabled':undefined]})
    return (
        <div {...Attrs}>
            <div className={`${cls}-icon`}>{before}</div>
            <div className={`${cls}-text`}>{text}</div>
            {after !== undefined && <div className={`${cls}-icon`}>{after}</div>}
            <div className={`${cls}-icon`} onClick={close}>{I(mdiClose, 0.7)}</div>
        </div>
    )
}
function Input() {
    let { rootProps, types, showPassword,options }: AI_context = useContext(AICTX)
    let { type } = rootProps;
    let {
        min, max, swip, onChange, blurChange, maxLength = Infinity, justNumber, filter = [], disabled, placeholder,
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
                try{
                    if (type === 'number' && value.toString().length > maxLength) {
                        value = +value.toString().slice(0, maxLength);
                    }
                }
                catch{}
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
        return (
            <label style={{ width: '100%', height: '100%', background: value }}>
                <input {...attrs} style={{ opacity: 0 }} opacity rgba cmyk hsla />
                {!!options.optionsList.length && <datalist id={datauniqid}>{options.optionsList.map((o: AI_option) => <option value={o.value} />)}</datalist>}
            </label>
        )
    }
    else if (type === 'textarea') { return <textarea {...attrs} /> }
    else { return (<input {...attrs} />) }
}
type AI_form_setValue = (field:string,itemValue:any, validation?:AI_validation)=>void
type AI_FormContext = {
    rootProps:AI,setError:(key:string,value:string | undefined)=>void,getError:(value: any,validation:AI_validation)=>string | undefined,
    getValueByField:(p:{ field:any, def?:any, functional?:boolean, value?:any,node:AI_formNode,formNodeValue?:any })=>any,
    setValue:AI_form_setValue
}
type AI_validation = {validations:string[],label:string}

const Formcontext = createContext({} as any);
const Form: FC = () => {
    let { rootProps }: AI_context = useContext(AICTX);
    let { node, lang, onChange, attrs, style, className,footer,showErrors = true } = rootProps;
    let [errors] = useState<{ [key: string]: string | undefined }>({})
    let [dom] = useState<any>(getDom)
    function getDom(){
        return createRef()
    }
    function getErrorList():string[] { return [...Object.keys(errors).filter((o) => !!errors[o]).map((o) => errors[o] || '')] }
    function getError(value: any,validation:AI_validation) {
        let {validations,label} = validation;
        if (!validations.length) { return '' }
        //در مپ مقدار یک آبجکت است پس لت و ال ان جی در مجموع به یک مقدار بولین مپ می کنیم تا فقط در ریکوآیرد بتوان ارور هندلینگ انجام داد
        //if (input.type === 'map') { value = !!value && !!value.lat && !!value.lng }
        return new AIOValidation({ value, title: label || '', lang, validations }).validate();
    }
    function setError(key: string, value: string | undefined) {
        let newErrors = errors = { ...errors, [key]: value }
        let fixedErrors: { [key: string]: string } = {};
        let prop: string
        for (prop in newErrors) { if (newErrors[prop]) { fixedErrors[prop] = newErrors[prop] as string } }
        errors = fixedErrors;
    }
    function getValueByField(p: { field: any, def?: any, functional?: boolean, value?: any, node: AI_formNode, formNodeValue?: any }) {
        let { field, def, functional, value = rootProps.value || {}, node, formNodeValue } = p;
        let a;
        if (functional && typeof field === 'function') { a = field({ model: value, node, value: formNodeValue }); }
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
            field = field.replace(/\[/g, '.').replace(/\]/g, '');
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
    const setValue:AI_form_setValue = (field,itemValue, validation) => {
        let { value = {} } = rootProps;
        if (!field) {
            alert('aio-input error => in type form there is an form item missing field property')
            return
        }
        let newValue = setValueByField(value, field, itemValue);
        let error:string | undefined;
        if(validation !== undefined){error = getError(itemValue,validation)}
        setError(field, error)
        if (onChange) { onChange({...newValue}, { errors: getErrorList(), newformNodeValue: itemValue }) }
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
    function appendErrors(errors:string[]){
        if(typeof showErrors === 'string'){
            let errorContainer = $(showErrors as string) as any
            if(errors.length){
                let start = '<ul>'
                let end = '</ul>'
                let center = ''
                for(let error of errors){center += `<li>${error}</li>`} 
                errorContainer.html(start + center + end)
            }
            else {errorContainer.html('')}
        }
    }
    useEffect(()=>{
        let footer = $(dom.current).find('.aio-input-form-footer');
        if(footer.length){
            let button = footer.find('button');
            if(button.length){
                console.log('ok')
                let errors:string[] = getErrorList() || [];
                let hasError:boolean = !!errors.length || false;
                if(hasError){
                    button.attr({'disabled':'disabled'})
                    appendErrors(errors)
                }
                else {
                    button.removeAttr('disabled')
                    appendErrors([])
                }
                
            }
        }
    })
    return (
        <Formcontext.Provider value={getContext()}>
            <form {...p} ref={dom}>
                {!!node && <FormNode node={node} isRoot={true} />}
                {!!footer && <article className='aio-input-form-footer'>{footer}</article>}
            </form>
        </Formcontext.Provider>
    )
}
type AI_FormNode = {node:AI_formNode,parentType?:'row'|'column',isRoot?:boolean}
const FormNode: FC<AI_FormNode> = (props) => {
    let { setError }: AI_FormContext = useContext(Formcontext)
    let { node, parentType,isRoot } = props;
    let { html, childs,dir = 'v', input, field, flex, size, show, className, style } = node;
    if (show === false || (typeof show === 'function' && show() === false) ) { return null }
    function getInner(): RN {
        let content
        if (input) { content = <FormInput node={node} setError={(v: string | undefined) => setError(field as string, v)} /> }
        if (html) { content = html; }
        if (childs) { content = childs.map((o: AI_formNode, i: number) => <FormNode key={i} node={o} parentType={dir === 'h'?'row':'column'} />) }
        let p:any = {className:cls,style:{ ...Style, ...style }}
        if(isRoot){return <section {...p}>{content}</section>}
        if(childs){return <fieldset {...p}>{content}</fieldset>}
        return <article {...p}>{content}</article>
    }
    let cls = 'aio-input-form-item'
    if (className) { cls += ' ' + className }
    if (childs && dir === 'h') { cls += ' aio-input-form-item-row' }
    else if (childs && dir === 'v') { cls += ' aio-input-form-item-column' }
    let Style: { [key: string]: number | string } = {};
    if (flex) { Style.flex = flex }
    else if (size) {
        if (parentType === 'row') { Style.width = size }
        else if (parentType === 'column') { Style.height = size }
    }
    
    return <>{getInner()}</>
}
type AI_FormInput = {node:AI_formNode,setError:(v:string | undefined)=>void}
const FormInput: FC<AI_FormInput> = (props) => {
    let { rootProps, getError, getValueByField, setValue }: AI_FormContext = useContext(Formcontext)
    let { rtl, disabled,showErrors = true } = rootProps;
    let { node, setError } = props;
    let { input, label = '', field = '',validations = [] } = node;
    let required = false;
    if(typeof label === 'string' && label[0] === '*'){
        required = true;
        label = label.slice(1,label.length)
    }
    if (!input || !field) { return null }
    let validation:AI_validation = {validations,label}
    function getInputProps(input: AI, node: AI_formNode) {
        let props: AI = {
            rtl, value, type: input.type,
            attrs: {}, inputAttrs: {}, disabled: false, point: (value) => { return { html: value } }
        };
        let prop: keyof AI;
        for (prop in input) {
            let functional = ['options', 'columns'].indexOf(prop) !== -1;
            (props[prop] as any) = getValueByField({ field: input[prop], functional, node, formNodeValue: value })
        }
        props.onChange = async (value) => {
            let res:boolean | undefined | void = true;
            if(input.onChange){
                res = await input.onChange(value) !== false
            }
            if(res === true){setValue(field,value, validation)}
        }
        props.value = value;
        let { attrs = {} } = input;
        for (let prop in attrs) { props.attrs[prop] = getValueByField({ field: attrs[prop], node }) }
        if (disabled) { props.disabled = true; }
        if (['text', 'number', 'password', 'textarea'].indexOf(input.type) !== -1) {
            let { inputAttrs = {} } = input;
            props.inputAttrs = {};
            for (let prop in inputAttrs) { props.inputAttrs[prop] = getValueByField({ field: inputAttrs[prop], node }) }
        }
        let classes = [props.className]
        if (error) { classes.push('has-error') }
        let Attrs = AddToAttrs(props.attrs, { className: error ? 'has-error' : undefined })
        props.attrs = Attrs;
        return props;
    }
    function getDefaultValue(p: AI) {
        if (!!p.multiple) { return [] }
    }
    let value = getValueByField({ field, def: input ? getDefaultValue(input) : undefined, node });
    let error = getError(value,validation)
    setError(error)
    let InputProps: AI = getInputProps(input, node);
    function getLabel(){
        if(typeof label !== 'string'){return null}
        return (
            <section className='aio-input-form-label'>
                {label} {!!required && <div className="aio-input-form-label-star">*</div>}
            </section>
        )
    }
    return (
        <section className='aio-input-form-input'>
            {getLabel()}
            <AIOInput {...InputProps} />
            {error && showErrors === true && <div className='aio-input-form-error'>{error}</div>}
        </section>
    )
}
function Options() {
    let { rootProps, types,options }: AI_context = useContext(AICTX);
    let [searchValue, setSearchValue] = useState('');
    function renderSearchBox(options: AI_option[]) {
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
    function getRenderOptions(options: AI_option[]) {
        return options.map((option:AI_option, i) => {
            if (searchValue) {
                if (option.text === undefined || option.text === '' || option.text === null) { return null }
                if ((option.text as string).indexOf(searchValue) === -1) { return null }
            }
            let p = { option, index: i, searchValue }
            return <Layout {...p} key={i}/>
        });
    }
    if (!options.optionsList.length) { return null }
    let renderOptions = getRenderOptions(options.optionsList);
    let className = `aio-input-options aio-input-scroll aio-input-${rootProps.type}-options`
    if (types.isDropdown) { className += ' aio-input-dropdown-options' }
    return (
        <>
            {renderSearchBox(options.optionsList)}
            <div className={className}>{renderOptions}</div>
        </>
    )
}
export type I_openState = boolean | undefined
export type AI_Layout = {
    option?: AI_option, text?: RN, index?: number,
    properties?: any,indent?:AI_indent,
    toggle?:{open:I_openState},
}
const Layout:FC<AI_Layout> = (props) => {
    let { rootProps, datauniqid, types, touch, DragOptions, click, optionClick, open, showPassword, setShowPassword,error }: AI_context = useContext(AICTX)
    let { option, index, toggle, indent } = props;
    let { type, rtl } = rootProps;
    let [dom] = useState(createRef())
    function getClassName() {
        let cls;
        if (option !== undefined) {
            cls = `aio-input-option aio-input-${type}-option`
            if (types.isMultiple) { cls += ` aio-input-${type}-multiple-option` }
            if (types.isDropdown) { cls += ` aio-input-dropdown-option` }
            if( option.active === true){
                cls += ' active'
                if(type === 'tabs'){cls += ' aio-input-main-color'}
                if(type === 'buttons'){cls += ' aio-input-main-bg'} 
            }
        }
        else {
            cls = `aio-input aio-input-${type}${touch ? ' aio-input-touch' : ''}`;
            if (types.isInput) { cls += ` aio-input-input` }
            if (rootProps.justify) { cls += ' aio-input-justify' }
            if(error){cls += ' has-error'}
            cls += rtl?' aio-input-rtl':' aio-input-ltr'
        }
        if (indent) { cls += ` aio-input-indent-${indent.size}` }
        if (type === 'tree') {
            let size = rootProps.size || Def('tree-size');
            size = Math.round(size / 12) * 12;
            if (size < 24) { size = 24 }
            if (size > 120) { size = 120 }
            cls += ` aio-input-size-${size}`
        }
        if (properties.disabled === true) { cls += ' disabled' }
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
    function Text(): RN {
        let { text, placeholder, subtext, justify } = properties;
        if (text === undefined && placeholder !== undefined) { text = <div className='aio-input-placeholder'>{placeholder}</div> }
        if (text !== undefined) {
            let p = (type: 'value' | 'subtext') => {
                return {
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
        if (checked === undefined) { return null }
        let {multiple} = rootProps;
        if (Array.isArray(checkIcon)) { return checkIcon[checked ? 1 : 0] }
        if(!multiple && type === 'radio'){
            return (
                <div className={'aio-input-check-out aio-input-main-color' + (checked ? ' checked' : '')} style={{ ...checkIcon, background: 'none' }}>
                    {checked && <div className={'aio-input-check-in aio-input-main-bg'} style={{ background: checkIcon.background }}></div>}
                </div>
            );
        }
        return (
            <div className={'aio-input-check-0 aio-input-main-color' + (checked ? ' checked' : '')} style={{ ...checkIcon, background: 'none' }}>
                {checked && <div className='aio-input-main-bg'></div>}
            </div>
        );    
    }
    function BeforeAfter(mode: 'before' | 'after') {
        let res: RN;
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
        let { attrs, disabled, draggable, style } = properties;
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
                    e.preventDefault();
                    if ((props.properties || {}).onClick) { props.properties.onClick() }
                    else { optionClick(option) }
                }
            }
        }
        attrs = AddToAttrs(attrs, {
            className: getClassName(),
            style: { ...style, zIndex }
        })
        let p = { ...attrs, onClick, ref: dom, disabled }
        let options: any[] = typeof rootProps.options === 'function' ? rootProps.options() : (rootProps.options || []);
        if (draggable) { p = { ...p, ...DragOptions.getAttrs(options, index || 0) } }
        if (index) { p['data-index'] = index }
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
        let { checkIcon = obj.checkIcon === undefined?{}:obj.checkIcon } = p;
        let { loading = obj.loading } = p;
        let { attrs = obj.attrs || {} } = p;
        let style = { ...(obj.style || {}), ...p.style }
        let { before = obj.before } = p;
        let { after = obj.after } = p;
        let { footer = (obj as AI).footer } = p;
        let classNames = [obj.className, p.className].filter((o) => !!o)
        let className = classNames.length ? classNames.join(' ') : undefined;
        return { disabled, draggable, text, subtext, placeholder, justify, checked, checkIcon, loading, attrs, style, before, after, className,footer }
    }
    function getToggleIcon(open:I_openState) {
        if (toggle === undefined) { return null }
        if(option && Array.isArray(option.toggleIcon)){
            if(open === false && !!option.toggleIcon[0]){return option.toggleIcon[0]}
            if(open === true && !!option.toggleIcon[1]){return option.toggleIcon[1]}
            if(open === undefined && !!option.toggleIcon[2]){return option.toggleIcon[2]}
        }
        let path;
        if (open === undefined) { path = mdiCircleSmall }
        else if (open === true) { path = mdiChevronDown }
        else { path = mdiChevronRight }
        return <div style={{transform:rootProps.rtl?`scaleX(-1)`:undefined}}>{I(path, 1)}</div>
    }
    function Toggle(indent: AI_indent) {
        if(!option || option.toggleIcon === false){return null}
        if (toggle === undefined) { return null }
        return (<div className="aio-input-toggle" onClick={(e) => { e.stopPropagation(); if(option.details.toggle){option.details.toggle()} }}>
            <div className='aio-input-toggle-icon'>{getToggleIcon(toggle.open)}</div>
            {
                toggle.open === true &&
                <svg className='aio-input-toggle-line aio-input-indent-line'>
                    <path d={`M${indent.size / 2} ${0} L${indent.size / 2} ${indent.height / 2 - 12} Z`}></path>
                </svg>
            }
        </div>)
    }
    function indentIcon(indent: AI_indent, order: number) {
        let { parentIndent, size, level, isLastChild, height } = indent;
        if (!level) { return false }
        let x0 = size / 2, x1 = size, y0 = 0, y1 = height / 2, y2 = height, pathes = [];
        if (order === level - 1) {
            //horizontal line
            pathes.push(<path key={'hl' + order} d={`M${x0} ${y1} L${x1*(rootProps.rtl?-1:1)} ${y1} Z`}></path>)
            //vertical direct line
            pathes.push(<path key={'vdl' + order} d={`M${x0} ${y0} L${x0} ${isLastChild ? y1 : y2} Z`}></path>)
        }
        else {
            //vertical connet line
            if (!parentIndent || !parentIndent.isLastChild) {
                pathes.push(<path key={'vl' + order} d={`M${x0} ${y0} L${x0} ${y2} Z`}></path>)
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
                        <div key={i} className={`aio-input-indent`}>{indentIcon(indent, i)}</div>
                    )
                })}
                {!!toggle && Toggle(indent)}
            </div>
        )
    }
    function Label(){
        if(option){return null}
        const {label} = rootProps
        if(!label){return null}
        let className = 'aio-input-label'
        const required = label[0] === '*'
        if(required){className += ' aio-input-label-required'}
        const finalLabel = required?label.slice(1,label.length):label
        return (<div className={className}>{finalLabel}</div>)
    }
    function getFooter(){
        if(option){return null}
        let text:string = '';
        if(properties.footer !== undefined){text = properties.footer}
        else if(error){text = error}
        if(text !== undefined){return (<div className='aio-input-footer'>{text}</div>)}
    }
    let properties = getProperties();
    let content = (<>
        {Indent()}
        {DragIcon()}
        {CheckIcon()}
        {Label()}
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
            {getFooter()}
        </div>
    )
}
function List() {
    let { rootProps,options }: AI_context = useContext(AICTX);
    let { attrs = {}, size = 36, count = 3, editable = true, stop = 3, decay = 8, onChange = () => { } } = rootProps;
    let optionsLength:number = options.optionsList.length
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
    function getIndexByTop(top: number) { return Math.round(((count * size) - size - (2 * top)) / (2 * size)); }
    function getTopByIndex(index: number) { return (count - 2 * index - 1) * size / 2; }
    function getContainerStyle() { return { top: getTopByIndex(temp.activeIndex) }; }
    function moveDown() {
        if (temp.activeIndex >= optionsLength - 1) { return }
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
    function getLimit() { return { top: getTopByIndex(-1), bottom: getTopByIndex(optionsLength) } }
    function getTrueTop(top: number) {
        let index = getIndexByTop(top);
        if (index < 0) { index = 0 }
        if (index > optionsLength - 1) { index = optionsLength - 1 }
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
        onChange(options.optionsList[index].value, index)
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
            if (Math.abs(deltaY) < stop || index < 0 || index > optionsLength - 1) {
                clearInterval(temp.interval);
                if (index < 0) { index = 0 }
                if (index > optionsLength - 1) { index = optionsLength - 1 }
                let top = getTopByIndex(index);
                setStyle({ top, transition: '0.3s' });
                onChange(options.optionsList[index].value, index)
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
    let fixedOptions = options.optionsList.map((o:AI_option, i:number) => {
        if (o.value === rootProps.value) { temp.activeIndex = i; }
        return (
            <Layout
                key={i}
                option={o}
                index={i}
                properties={{
                    style: { height: size },
                    justify: true
                }}
            />
        )
    });
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
type I_AcardionContext = { 
    isOpen:(id:any)=>boolean,
    rootProps: AI 
}
const AcardionContext = createContext({} as any);
export const Acardion: FC = () => {
    const { rootProps,options }: AI_context = useContext(AICTX);
    const { multiple, vertical = true,value } = rootProps;
    function isOpen(id:any){
        if(!multiple){return id === value}
        else {return (value || []).indexOf(id) !== -1}
    }
    function getContext() {
        let context: I_AcardionContext = {
            rootProps,isOpen
        }
        return context;
    }
    return (
        <AcardionContext.Provider value={getContext()}>
            <div className={`aio-input-acardion aio-input-scroll${vertical ? ' aio-input-acardion-vertical' : ' aio-input-acardion-horizontal'}`}>
                {options.optionsList.map((option: AI_option,i:number) => <AcardionItem key={i} option={option} />)}
            </div>
        </AcardionContext.Provider>
    )
}
type I_AcardionItem = { option: AI_option }
const AcardionItem: FC<I_AcardionItem> = ({option}) => {
    let [mounted,SetMounted] = useState(false);
    const [active,setActive] = useState<boolean>(option.active)
    let [timeout] = useState<any>()
    let Attrs = AddToAttrs(option.attrs, { className: `aio-input-acardion-item` })
    function setMounted(mounted:boolean){
        SetMounted(mounted)
    }
    useEffect(()=>{
        setMounted(true)
    },[])
    useEffect(()=>{
        if(option.active){
            setActive(true);
            setMounted(false);
            timeout = setTimeout(()=>{
                setMounted(true)
            },10)
        }
        else {
            setActive(true);
            setMounted(false);
            timeout = setTimeout(()=>{
                setActive(false)
            },300)
        }
    },[!!option.active])
    return (
        <div {...Attrs}>
            <Layout option={option} />
            {!!active && <AcardionBody option={option} mounted={mounted}/>}
        </div>
    )
}
type I_AcardionBody = { option: AI_option,mounted:boolean }
const AcardionBody:FC<I_AcardionBody> = ({option,mounted})=>{
    const { rootProps }: I_AcardionContext = useContext(AcardionContext);
    let { value } = option;
    let { body } = rootProps;
    let { html, attrs } = (typeof body === 'function' ? body(value) : body) || { html: '' }
    let Attrs = AddToAttrs(attrs,{className:[`aio-input-acardion-body`,mounted?undefined:'not-mounted']})
    return <div {...Attrs}>{html}</div>
}
type I_TreeContext = {
    toggle: (id: string) => void,
    mountedDic: { [id: string]: boolean },
    openDic: { [id: string]: boolean },
    rootProps: AI,
    types: any,
    add: (p?:{parent: any,parentDetails:any})=>void,
    remove: (p:{row: any,index:number, parent?: any,parentDetails?:any})=>void,
    indent: number,
    size: number,
    change: (row: any, newRow: any) => void,
    getChilds: (p:{row: any,details:I_treeRowDetails}) => any[]
}
type I_treeItem = {
    option: AI_option, row: any, parent?: any, parentId?: string,
    id: string, open: boolean, indent: AI_indent, parentOpen: boolean,
    details:I_treeRowDetails
}
type I_treeRowDetails = {level:number,index:number, isLastChild: boolean, isFirstChild: boolean}
const TreeContext = createContext({} as any);
const Tree: FC = () => {
    let { rootProps, types }: AI_context = useContext(AICTX);
    let { onAdd, onRemove, value = [], onChange, size = Def('tree-size'),attrs } = rootProps;
    let [openDic, setOpenDic] = useState<any>({})
    let [mountedDic, setMountedDic] = useState<{ [id: string]: boolean }>({})
    let [indent] = useState<number>(getIndent)
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
    function change(row: any, newRow: any) {
        for (let prop in newRow) { row[prop] = newRow[prop]; }
        if (rootProps.onChange) { rootProps.onChange(rootProps.value) }
    }
    function getChilds(p:{row: any,details:I_treeRowDetails}):any[] {
        let {row,details} = p;
        let childs = []
        try {
            if (rootProps.getChilds) { childs = rootProps.getChilds({row,details}); }
            else { childs = row.childs || [] }
        }
        catch { childs = [] }
        return childs || []
    }
    function setChilds(p:{row: any, details:I_treeRowDetails,childs: any[]}) {
        let {row,childs} = p;
        try {
            if (rootProps.setChilds) { rootProps.setChilds(p) }
            else { row.childs = childs }
        }
        catch { }
    }
    async function add(p?:{parent: any,parentDetails:I_treeRowDetails}) {
        let newRow: any;
        if (typeof onAdd === 'function') { newRow = await onAdd(p) }
        else { newRow = onAdd }
        if (!newRow) { return }
        if (p) {
            let parentChilds:any[] = getChilds({row:p.parent,details:p.parentDetails});
            setChilds({row:p.parent, childs:parentChilds.concat(newRow),details:p.parentDetails});
        }
        else { value.push(newRow) }
        if (onChange) { onChange(value); }
    }
    async function remove(p:{row: any,index:number, parent?: any,parentDetails?:any}) {
        let {index} = p
        let res: boolean;
        if (typeof onRemove === 'function') { res = await onRemove(p) as boolean }
        else { res = true }
        if (!res) { return }
        const details:I_optionDetails = {mainValue:value,index,active:false,toggle:()=>{}}
        if (!p.parent) {
            value = value.filter((o: any) => {
                let rowValue = GetOptionProps({ option: p.row, key: 'value', props: rootProps,details })
                let oValue = GetOptionProps({ option: o, key: 'value', props: rootProps,details })
                return rowValue !== oValue
            })
        }
        else {
            let parentChilds = getChilds({row:p.parent,details:p.parentDetails});
            let newChilds: any[] = parentChilds.filter((o: any) => {
                let rowValue = GetOptionProps({ option: p.row, key: 'value', props: rootProps,details })
                let oValue = GetOptionProps({ option: o, key: 'value', props: rootProps,details })
                return rowValue !== oValue
            });
            setChilds({row:p.parent,details:p.parentDetails, childs:newChilds})
        }
        if (onChange) { onChange(value) }
    }
    function getContext(): I_TreeContext { return { toggle, rootProps, mountedDic, openDic, add, remove, types, indent, size, change, getChilds } }
    let Attrs = AddToAttrs(attrs,{className:['aio-input-tree',rootProps.className],style:rootProps.style})
    return (
        <TreeContext.Provider value={getContext()}>
            <div {...Attrs}><TreeHeader /><TreeBody rows={value} level={0} /></div>
        </TreeContext.Provider>
    )
}
const TreeHeader: FC = () => {
    const { rootProps, add }: I_TreeContext = useContext(TreeContext);
    let { addText = 'add', onAdd } = rootProps;
    if (!onAdd) { return null }
    addText = (typeof addText === 'function' ? addText('header') : addText) || 'add';
    return (<div className="aio-input-tree-header"><button onClick={() => add()}>{I(mdiPlusThick, .8)}{addText}</button></div>)
}
type I_TreeActions = { row: any,index:number, parent?: any,rowDetails:I_treeRowDetails,parentDetails?:I_treeRowDetails }
const TreeActions: FC<I_TreeActions> = (props) => {
    let { row,index, parent,rowDetails,parentDetails } = props;
    let { rootProps, add, remove }: I_TreeContext = useContext(TreeContext);
    let { onAdd, onRemove, removeText = 'Remove' } = rootProps;
    let addText: RN = (typeof rootProps.addText === 'function' ? rootProps.addText(row) : rootProps.addText) || 'Add';
    let options = typeof rootProps.actions === 'function' ? rootProps.actions(row, parent) : rootProps.actions;
    function getOptions() {
        let res = [];
        if (onAdd) { res.push({ text: addText, value: 'add', before: I(mdiPlusThick, 0.7), onClick: () => add({parent:row,parentDetails:rowDetails}) }) }
        let Options = (options || []).map((o) => { return { ...o, onClick: () => { if (o.onClick) { o.onClick(row, parent) } } } })
        res = [...res, ...Options]
        if (onRemove) { res.push({ text: removeText, value: 'remove', before: I(mdiDelete, 0.7), onClick: () => remove({row,index, parent,parentDetails}) }) }
        return res
    }
    let Options = getOptions();
    if (!Options.length) { return null }
    let p: AI = { type: 'select', caret: false, popover: { limitTo: '.aio-input-tree' }, className: 'aio-input-tree-options-button', options: Options, text: I(mdiDotsHorizontal, 0.7) }
    return <AIOInput {...p} />;
}
type I_TreeBody = { rows: any[], level: number, parent?: any, parentId?: string, parentIndent?: AI_indent,parentDetails?:I_treeRowDetails }
const TreeBody: FC<I_TreeBody> = (props) => {
    let { rootProps, types, openDic, mountedDic, indent, size, change, getChilds,toggle }: I_TreeContext = useContext(TreeContext);
    let { rows, level, parent, parentId, parentIndent,parentDetails } = props;
    let parentOpen = parentId === undefined ? true : !!openDic[parentId];
    let mounted = parentId == undefined ? true : mountedDic[parentId];
    let {onAdd,onRemove,actions} = rootProps;
    let properties;
    if(!!onAdd || !!onRemove || !!actions){
        properties = {
            after: (option: AI_option) => {
                let {index,level = 0} = option;
                let isFirstChild = index === 0;
                let isLastChild = index === rows.length - 1;
                let details:I_treeRowDetails = {index,level,isFirstChild,isLastChild}
                return <TreeActions row={option.object} index={index} parent={parent} rowDetails={details} parentDetails={parentDetails}/>
            }
        }
    }
    let {optionsList} = GetOptions({
        rootProps, types, options: rows, level,isOpen:(id:any)=>!!openDic[id],
        change: (row: any, newRow: any) => change(row, newRow),
        properties ,toggle
    })
    function getClassName(){
        let className = 'aio-input-tree-body';
        if(!parent){className += ' aio-input-tree-root'}
        if(parentOpen){className += ' open'}
        className += !mounted ? ' not-mounted' : ' mounted';
        className += ` aio-input-tree-body-level-${level}`
        return className
    }
    return (
        <div className={getClassName()}>
            {optionsList.map((option: any, index: number) => {
                let row = rows[index];
                let id = option.value;
                let details:I_treeRowDetails = {level,index, isLastChild: index === optionsList.length - 1, isFirstChild: index === 0}
                let childs = getChilds({row,details});
                let open = !!openDic[id];
                let item:I_treeItem = {
                    row, option, parent, parentId, id, parentOpen, open,details,
                    indent: { height: size, childsLength: childs.length, size: indent, parentIndent,...details }
                }
                let p = { className: `aio-input-tree-row` }
                return <div {...p} key={id}><TreeRow item={item} /><TreeChilds item={item} /></div>;
            })}
        </div>
    )
}
const TreeRow: FC<{ item: I_treeItem }> = (props) => {
    let { openDic, getChilds }: I_TreeContext = useContext(TreeContext);
    let { item } = props;
    let childs = getChilds(item);
    let open: I_openState = !childs.length ? undefined : (!!openDic[item.id] ? true : false);
    let p: AI_Layout = { 
        indent: item.indent, 
        option: item.option, 
        toggle: { open } 
    };
    return <Layout {...p} />;
}
const TreeChilds: FC<{ item: I_treeItem }> = (props) => {
    let { getChilds }: I_TreeContext = useContext(TreeContext);
    let { row, id, open, indent,details } = props.item, childs = getChilds(props.item);
    if (!open || !childs || !childs.length) { return null }
    return <TreeBody rows={childs} level={indent.level + 1} parent={row} parentId={id} parentIndent={indent} parentDetails={details} />
}
type I_DPContext = {
    translate: (text: string) => string,
    DATE:AIODate,
    rootProps: AI,
    activeDate: I_DP_activeDate,
    changeActiveDate: (obj: 'today' | I_DP_activeDate) => void,
    onChange: (p: { year?: number, month?: number, day?: number, hour?: number }) => void,
    today: any, todayWeekDay: any, thisMonthString: any,months:string[],
}
type I_DP_activeDate = { year?: number, month?: number, day?: number }
const DPContext = createContext({} as any);
export function Calendar(props: { onClose?: () => void }) {
    let { rootProps, DATE }: AI_context = useContext(AICTX);
    let { onClose } = props;
    let { multiple,unit = Def('date-unit'), jalali, value, disabled, size = Def('date-size'), theme = Def('theme'), translate = (text) => text, onChange = () => { }, option = {} } = rootProps;
    let [months] = useState(DATE.getMonths(jalali));
    let [today] = useState(DATE.getToday(jalali))
    let [todayWeekDay] = useState(DATE.getWeekDay(today).weekDay)
    let [thisMonthString] = useState(months[today[1] - 1])
    let [activeDate, setActiveDate] = useState<I_DP_activeDate>(getActiveDate);
    function getDate(){
        let date;
        if(multiple){date = value.length?value[value.length - 1]:undefined}
        else {date = value}
        return date
    }
    function getActiveDate() {
        let date = getDate();
        date = !date || date === null ? today : date;
        let [year, month, day] = DATE.convertToArray(date)
        return { year, month, day }
    }
    let adRef = useRef(activeDate);
    adRef.current = activeDate
    function trans(text: string) {
        if (text === 'Today') {
            if (unit === 'month') { text = 'This Month' }
            else if (unit === 'hour') { text = 'This Hour' }
        }
        let obj: any = { 'Clear': 'حذف', 'This Hour': 'ساعت کنونی', 'Today': 'امروز', 'This Month': 'ماه جاری', 'Select Year': 'انتخاب سال', 'Close': 'بستن' }
        let res;
        if (jalali && obj[text]) { res = obj[text] }
        return translate(text)
    }
    function changeActiveDate(obj: 'today' | { [key in 'year' | 'month' | 'day']?: number }) {
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
    function getSplitter(){
        let date = getDate();
        return typeof date === 'string' ? DATE.getSplitter(date) : '/';
    }
    function getContext() {
        let context: I_DPContext = {
            changeActiveDate, DATE,
            translate: trans, rootProps, activeDate: adRef.current,
            today, todayWeekDay, thisMonthString, months,
            onChange: (p: { year?: number, month?: number, day?: number, hour?: number }) => {
                let { year = 1000, month = 1, day = 1, hour = 0 } = p;
                let dateArray = [year, month, day, hour];
                let jalaliDateArray = !jalali ? DATE.toJalali(dateArray) : dateArray;
                let gregorianDateArray = jalali ? DATE.toGregorian(dateArray) : dateArray;
                let { weekDay, index: weekDayIndex } = unit === 'month' ? { weekDay: null, index: null } : DATE.getWeekDay(dateArray)
                let get2digit = (v: number) => {
                    if (v === undefined) { return }
                    let vn: string = v.toString();
                    return vn.length === 1 ? `0${vn}` : vn
                }
                let dateString:string = '';
                let splitter = getSplitter();
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
                let newValue,index = 0;
                if(multiple){
                    let current:string[] = [];
                    if(value){
                        if(!Array.isArray(value)){current = [value]}
                        else {current = [...value]}
                    }
                    else {current = []}
                    let index = current.indexOf(dateString);
                    if(index === -1){newValue = [...current,dateString]}
                    else{newValue = current.filter((o:string)=>o !== dateString)}
                    if(typeof multiple === 'number'){
                        while (newValue.length > multiple) {
                            newValue = newValue.slice(1, newValue.length)
                        }
                    }
                    index = newValue.length - 1;
                }
                else {
                    index = 0
                    newValue = dateString
                }
                onChange(newValue, props);
                if (onClose) {
                    if (typeof option.close === 'function') { if (option.close(option,{mainValue:newValue,index,active:false,toggle:()=>{}})) { onClose() } }
                }
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
    let { rootProps, changeActiveDate, translate }: I_DPContext = useContext(DPContext);
    let { disabled, onChange = () => { }, size = Def('date-size'), deSelect,multiple } = rootProps;
    if (disabled) { return null }
    let buttonStyle = { padding: `${size / 20}px 0`, fontFamily: 'inherit' };
    return (
        <div className='aio-input-date-footer' style={{ fontSize: size / 13 }}>
            {!!deSelect && <button style={buttonStyle} onClick={() => typeof deSelect === 'function' ? deSelect() : onChange(multiple?[]:undefined)}>{translate('Clear')}</button>}
            <button style={buttonStyle} onClick={() => changeActiveDate('today')}>{translate('Today')}</button>
        </div>
    )
}
function DPBody() {
    let { rootProps, activeDate }: I_DPContext = useContext(DPContext);
    let { unit = Def('date-unit'), jalali, size = Def('date-size') } = rootProps;
    function getStyle() {
        var columnCount = { hour: 4, day: 7, month: 3, year: 1 }[unit as AI_date_unit];
        var rowCount = { hour: 6, day: 7, month: 4, year: 1 }[unit as AI_date_unit];
        var padding = size / 18, fontSize = size / 15, a = (size - padding * 2) / columnCount;
        var rowHeight = { hour: size / 7, day: a, month: size / 6, year: size / 7 }[unit as AI_date_unit];
        var gridTemplateColumns = '', gridTemplateRows = '';
        for (let i = 1; i <= columnCount; i++) { gridTemplateColumns += a + 'px' + (i !== columnCount ? ' ' : '') }
        for (let i = 1; i <= rowCount; i++) { gridTemplateRows += (rowHeight) + 'px' + (i !== rowCount ? ' ' : '') }
        let direction: 'ltr' | 'rtl' = !jalali ? 'ltr' : 'rtl';
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
    let { rootProps, activeDate, DATE }: I_DPContext = useContext(DPContext);
    let { theme = Def('theme'), jalali } = rootProps;
    let firstDayWeekDayIndex = DATE.getWeekDay([activeDate.year as number, activeDate.month as number, 1]).index;
    let daysLength = DATE.getMonthDaysLength([activeDate.year as number, activeDate.month as number]);
    let weekDays = DATE.getWeekDays(jalali);
    return (<>
        {weekDays.map((weekDay:string, i:number) => <DPCellWeekday key={'weekday' + i} weekDay={weekDay} />)}
        {new Array(firstDayWeekDayIndex).fill(0).map((o, i) => <div key={'space' + i} className='aio-input-date-space aio-input-date-cell aio-input-date-theme-bg1' style={{ background: theme[1] }}></div>)}
        {new Array(daysLength).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year || 0, activeDate.month || 0, i + 1]} />)}
        {new Array(42 - (firstDayWeekDayIndex + daysLength)).fill(0).map((o, i) => <div key={'endspace' + i} className='aio-input-date-space aio-input-date-cell aio-input-date-theme-bg1' style={{ background: theme[1] }}></div>)}
    </>)
}
const DPCellWeekday:FC<{weekDay:string}> = (props) => {
    let { rootProps, translate }: I_DPContext = useContext(DPContext);
    let { theme = Def('theme'), jalali } = rootProps;
    let { weekDay } = props;
    return (
        <div className='aio-input-date-weekday aio-input-date-cell aio-input-date-theme-bg1 aio-input-date-theme-color0' style={{ background: theme[1], color: theme[0] }}>
            <span>{translate(weekDay.slice(0, !jalali ? 2 : 1))}</span>
        </div>
    )
}
function DPCell(props: {dateArray:number[]}) {
    let { rootProps, translate, onChange, DATE }: I_DPContext = useContext(DPContext);
    let { disabled, dateAttrs, theme = Def('theme'), value, jalali, unit = Def('date-unit'),multiple } = rootProps;
    let { dateArray } = props;
    function IsActive(){
        if(multiple){return !value.length?false:!!value.find((o:string)=>DATE.isEqual(dateArray, o))}
        else {return !value ? false : DATE.isEqual(dateArray, value);}
    }
    function getClassName(isActive: boolean, isToday: boolean, isDisabled: boolean, className?: string) {
        var str = 'aio-input-date-cell';
        if (isDisabled) { str += ' aio-input-date-disabled' }
        if (isActive) { str += ' aio-input-date-active aio-input-date-theme-bg0 aio-input-date-theme-color1'; }
        else {str += ' aio-input-date-theme-bg1 aio-input-date-theme-color0';}
        if (isToday) { str += ' today aio-input-date-theme-border0'; }
        if (className) { str += ' className'; }
        return str;
    }
    let isActive = IsActive();
    let isToday = DATE.isEqual(dateArray, DATE.getToday(jalali))
    let Attrs: any = {}
    if (dateAttrs) {
        Attrs = dateAttrs({ dateArray, isToday, isActive, isMatch: (o) => DATE.isMatch(dateArray, o) })
        Attrs = Attrs || {}
    }
    let isDisabled = disabled === true || Attrs.disabled === true;
    let className = getClassName(isActive, isToday, isDisabled, Attrs.className);
    let onClick = isDisabled ? undefined : () => { onChange({ year: dateArray[0], month: dateArray[1], day: dateArray[2], hour: dateArray[3] }) };
    let style: any = {}
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
function DPHeaderItem(props: { unit: 'year' | 'month' }) {
    let { unit } = props;
    let { rootProps, activeDate, months }: I_DPContext = useContext(DPContext);
    let { theme = Def('theme'),jalali } = rootProps;
    if (!activeDate || !activeDate[unit]) { return null }
    let text = unit === 'year' ? activeDate.year : months[(activeDate[unit] as number) - 1].substring(0,jalali?10:3)
    let p: AI = {
        type: 'button', text, justify: true, caret: false,
        attrs: { className: 'aio-input-date-dropdown' },
        popover: {
            fitTo: '.aio-input-date-calendar',
            setAttrs:(key)=>{if(key === 'modal'){return { style: { background: theme[1], color: theme[0] } }}},
            body: (close) => <DPHeaderPopup onClose={close} unit={unit} />
        }
    }
    return (<AIOInput {...p} />)
}
const DPHeaderPopup: FC<{ onClose: () => void, unit: 'year' | 'month' }> = (props) => {
    let { onClose, unit } = props;
    let { rootProps, DATE, translate, activeDate, changeActiveDate }: I_DPContext = useContext(DPContext);
    let { jalali, size = Def('date-size'), theme = Def('theme') } = rootProps;
    let [months] = useState<string[]>(DATE.getMonths(jalali));
    let [start, setStart] = useState<number>(Math.floor((activeDate.year as number) / 10) * 10);
    let [year, setYear] = useState<number>(activeDate.year as number);
    let [month, setMonth] = useState<number>(activeDate.month as number);
    useEffect(() => {
        setYear(activeDate.year as number)
        setMonth(activeDate.month as number)
    }, [activeDate.year, activeDate.month])
    function changeValue(v: number) {
        if (unit === 'year') { setYear(v); changeActiveDate({ year: v }); }
        else { setMonth(v); changeActiveDate({ month: v }); }
        onClose()
    }
    function changePage(dir: 1 | -1) {
        let newStart = start + (dir * 10)
        setStart(newStart);
    }
    function getCells() {
        let cells = [];
        if (unit === 'year') {
            for (let i = start; i < start + 10; i++) {
                let active = i === year;
                let className = 'aio-input-date-cell'
                if (active) { className += ' aio-input-date-active aio-input-date-theme-bg0 aio-input-date-theme-color1' }
                else { className += ' aio-input-date-theme-bg1 aio-input-date-theme-color0' }
                let p = { style: active ? { background: theme[0], color: theme[1] } : { background: theme[1], color: theme[0] }, className, onClick: () => changeValue(i) }
                cells.push(<div {...p} key={i}>{i}</div>)
            }
        }
        else {
            for (let i = 1; i <= 12; i++) {
                let active = i === month;
                let className = 'aio-input-date-cell'
                if (active) { className += ' aio-input-date-active aio-input-date-theme-bg0 aio-input-date-theme-color1' }
                else { className += ' aio-input-date-theme-bg1 aio-input-date-theme-color0' }
                let p = { style: active ? { background: theme[0], color: theme[1] } : { background: theme[1], color: theme[0] }, className, onClick: () => changeValue(i) }
                cells.push(<div {...p} key={i}>{months[i - 1].slice(0, 3)}</div>)
            }
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
        let direction: 'ltr' | 'rtl' = !jalali ? 'ltr' : 'rtl';
        return { gridTemplateColumns, gridTemplateRows, direction, padding, fontSize }
    }
    function header_node() {
        if (unit !== 'year') { return null }
        return (
            <div className='aio-input-date-popup-header'>
                <DPArrow type='minus' onClick={() => changePage(-1)} />
                <div className='aio-input-date-popup-label' style={{ fontSize: size / 15 }}>{translate('Select Year')}</div>
                <DPArrow type='plus' onClick={() => changePage(1)} />
            </div>
        )
    }
    function body_node() { return <div style={getBodyStyle()} className='aio-input-date-popup-body'>{getCells()}</div> }
    function footer_node() {
        return (
            <div style={getBodyStyle()} className='aio-input-date-popup-footer'>
                <button onClick={() => onClose()}>{translate('Close')}</button>
            </div>
        )
    }
    return (<div className='aio-input-date-popup'>{header_node()}{body_node()}{footer_node()}</div>)
}
function DPHeader() {
    let { rootProps, activeDate, changeActiveDate, DATE }: I_DPContext = useContext(DPContext);
    let { size = Def('date-size'), unit = Def('date-unit') } = rootProps;
    function getDays(): RN {
        if (!activeDate || !activeDate.year || !activeDate.month) { return null }
        let daysLength = DATE.getMonthDaysLength([activeDate.year, activeDate.month]);
        let options = new Array(daysLength).fill(0).map((o, i) => { return { text: (i + 1).toString(), value: i + 1 } })
        let p: I_DPHeaderDropdown = { value: activeDate.day, options, onChange: (day) => changeActiveDate({ day }) }
        return <DPHeaderDropdown {...p} />
    }
    return (
        <div className='aio-input-date-header' style={{ height: size / 4 }}>
            <DPArrow type='minus' />
            <div className='aio-input-date-select' style={{ fontSize: Math.floor(size / 13) }}>
                <DPHeaderItem unit='year' />
                {unit !== 'month' ? <DPHeaderItem unit='month' /> : null}
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
    let { size = Def('date-size'), theme = Def('theme') } = rootProps;
    let p: AI = {
        value, options, onChange, caret: false, type: 'select',
        attrs: { className: 'aio-input-date-dropdown aio-input-date-theme-bg1 aio-input-date-theme-color0' },
        option: { style: () => { return { height: size / 6, background: theme[1], color: theme[0] } } },
    }
    return (<AIOInput {...p} />)
}
function DPArrow(props: { type: 'minus' | 'plus', onClick?: () => void }) {
    let { rootProps, changeActiveDate, activeDate, DATE }: I_DPContext = useContext(DPContext);
    let { type, onClick } = props;
    let { jalali, unit = Def('date-unit'), size = Def('date-size'), theme = Def('theme') } = rootProps;
    function change() {
        if (onClick) { onClick(); return }
        let offset = (!jalali ? 1 : -1) * (type === 'minus' ? -1 : 1);
        let date = [activeDate.year as number, activeDate.month as number, activeDate.day as number]
        if (unit === 'month') { changeActiveDate({ year: (activeDate.year as number) + offset }) }
        if (unit === 'day') {
            let newDate = [];
            if (date[1] === 1 && offset === -1) { newDate = [date[0] - 1, 12]; }
            else if (date[1] === 12 && offset === 1) { newDate = [date[0] + 1, 1]; }
            else { newDate = [date[0], date[1] + offset] }
            changeActiveDate({ year: newDate[0], month: newDate[1] })
        }
        if (unit === 'hour') {
            let next = DATE.getNextTime(date, offset * 24 * 60 * 60 * 1000, jalali);
            changeActiveDate({ year: next[0], month: next[1], day: next[2] })
        }
    }
    function getIcon() { return I(type === 'minus' ? mdiChevronLeft : mdiChevronRight, 1, { style: { color: theme[0] }, className: 'aio-input-date-theme-color0' }) }
    return (<div className='aio-input-date-arrow' style={{ width: size / 6, height: size / 6 }} onClick={() => change()}>{getIcon()}</div>)
}
const AITableContext = createContext({} as any);
function Table() {
    let { rootProps, DATE }: AI_context = useContext(AICTX);
    let { paging, getValue = {}, value, onChange = () => { }, onAdd, onRemove, excel, onSwap, onSearch, rowAttrs, onChangeSort, className, style } = rootProps;
    let [dom] = useState(createRef())
    let [searchValue, setSearchValue] = useState<string>('')
    let [columns, setColumns] = useState<AI_table_column[]>([]);
    let [searchColumns, setSearchColumns] = useState<AI_table_column[]>([]);
    let [excelColumns, setExcelColumns] = useState<AI_table_column[]>([]);
    let [temp] = useState<type_table_temp>({})
    let [DragRows] = useState<DragClass | false>(!onSwap ? false : new DragClass({
        onChange: (newRows:any[], from:any, to:any) => {
            if (typeof onSwap === 'function') { onSwap(newRows, from, to) }
            else { onChange(newRows) }
        },
        className: 'aio-input-table-row',
    }))
    let [sorts, setSorts] = useState<AI_table_sort[]>([])
    function getColumns() {
        let { columns = [] } = rootProps;
        columns = typeof columns === 'function' ? columns() : columns;
        let searchColumns: AI_table_column[] = [], excelColumns: AI_table_column[] = [];
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
    function getSorts(columns: AI_table_column[]) {
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
                getValue = (row: any) => {
                    let value = getDynamics({ value: column.value, row, column })
                    if (input && input.type === 'date') { value = DATE.getTime(value); }
                    return value
                }
            }
            let type: 'string' | 'number' | 'date';
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
            if (rowIndex) rowIndex += ((number - 1) * size)
        }
        let type = typeof value;
        if (type === 'string') {
            let result = value;
            let param: AI_table_param = { row, column: column as AI_table_column, rowIndex: rowIndex as number }
            if (getValue[value]) { result = getValue[value](param) }
            else if (value.indexOf('row.') !== -1) { try { eval(`result = ${value}`); } catch { result = '' } }
            return result === undefined ? def : result;
        }
        if (type === 'undefined') { return def }
        if (type === 'function') { return value({ row, column, rowIndex }) }
        return value === undefined ? def : value
    }
    useEffect(() => {
        let columns: AI_table_column[] = getColumns();
        getSorts(columns);
    }, [])
    function add() { typeof onAdd === 'function' ? onAdd() : onChange([{ ...onAdd }, ...value]) }
    function remove(row: any, index: number) {
        let action = () => onChange(value.filter((o: any) => o._id !== row._id));
        typeof onRemove === 'function' ? onRemove({ row, action, rowIndex: index }) : action();
    }
    function exportToExcel() {
        let list = [];
        for (let i = 0; i < value.length; i++) {
            let row = value[i], json: any = {};
            for (let j = 0; j < excelColumns.length; j++) {
                let column = excelColumns[j], { excel, value } = column;
                let key:string = '';
                if(excel === true){
                    if(typeof column.title === 'string'){key  = column.title}
                    else {key = 'untitle'}
                }
                else if(typeof excel === 'string'){key = excel}
                else {continue}
                json[key] = getDynamics({ value, row, column, rowIndex: i })
            }
            list.push(json)
        }
        ExportToExcel(list, { promptText: typeof excel === 'string' ? excel : 'Inter Excel File Name' })
    }
    function getSearchedRows(rows: { [key: string]: any }[]) {
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
    function sortRows(rows: { [key: string]: any }[], sorts: AI_table_sort[]) {
        if (!rows) { return [] }
        if (!sorts || !sorts.length) { return rows }
        return rows.sort((a, b) => {
            for (let i = 0; i < sorts.length; i++) {
                let { dir, getValue } = sorts[i];
                if (!getValue) { return 0 }
                let aValue = getValue(a), bValue = getValue(b);
                if (aValue < bValue) { return -1 * (dir === 'dec' ? -1 : 1); }
                if (aValue > bValue) { return 1 * (dir === 'dec' ? -1 : 1); }
                if (i === sorts.length - 1) { return 0; }
            }
            return 0;
        });
    }
    function getSortedRows(rows: { [key: string]: any }[]) {
        if (temp.isInitSortExecuted) { return rows }
        if (onChangeSort) { return rows }
        let activeSorts = sorts.filter((sort) => sort.active !== false);
        if (!activeSorts.length || !rows.length) { return rows }
        temp.isInitSortExecuted = true;
        let sortedRows = sortRows(rows, activeSorts);
        onChange(sortedRows);
        return sortedRows;
    }
    function getRows(): AI_table_rows {
        let searchedRows = getSearchedRows(value);
        let sortedRows = getSortedRows(searchedRows);
        let pagedRows = paging && !paging.serverSide ? sortedRows.slice((paging.number - 1) * paging.size, paging.number * paging.size) : sortedRows;
        return { rows: value, searchedRows, sortedRows, pagedRows }
    }
    //calculate style of cells and title cells
    function getCellStyle(column: AI_table_column) {
        let width = getDynamics({ value: column.width });
        let minWidth = getDynamics({ value: column.minWidth });
        return { width: width ? width : undefined, flex: width ? undefined : 1, minWidth }
    }
    function getCellAttrs(p: { row: any, rowIndex: number, column: AI_table_column, type: 'title' | 'cell' }) {
        let { row, rowIndex, column, type } = p;
        let { cellAttrs, titleAttrs } = column;
        let attrs = getDynamics({ value: type === 'title' ? titleAttrs : cellAttrs, column, def: {}, row, rowIndex });
        let justify = getDynamics({ value: column.justify, def: false });
        let cls = `aio-input-table-${type}` + (justify ? ` aio-input-table-${type}-justify` : '')
        attrs = AddToAttrs(attrs, { className: cls, style: getCellStyle(column) });
        if (type === 'title') { attrs.title = getDynamics({ value: column.title, def: '' }) }
        return { ...attrs }
    }
    function getRowAttrs(row: any, rowIndex: number) {
        let attrs = rowAttrs ? rowAttrs({ row, rowIndex }) : {};
        let obj = AddToAttrs(attrs, { className: 'aio-input-table-row' })
        if (DragRows !== false) { obj = { ...obj, ...DragRows.getAttrs(value, rowIndex) } }
        return obj;
    }
    function search(searchValue: string) {
        if (onSearch === true) { setSearchValue(searchValue) }
        else if (typeof onSearch === 'function') { onSearch(searchValue) }
    }
    function getContext(ROWS: AI_table_rows) {
        let context: type_table_context = {
            ROWS, rootProps, columns, sorts, setSorts, sortRows, excelColumns, getCellAttrs, getRowAttrs,
            add, remove, search, exportToExcel, getDynamics
        }
        return context
    }
    let ROWS: AI_table_rows = getRows();
    let attrs = AddToAttrs(rootProps.attrs, { className: ['aio-input aio-input-table', className], style: rootProps.style, attrs: { ref: dom } })
    return (
        <AITableContext.Provider value={getContext(ROWS)}>
            <div {...attrs}>
                <TableToolbar />
                <div className='aio-input-table-unit aio-input-scroll'><TableHeader /><TableRows /></div>
                {paging ? <TablePaging /> : ''}
            </div>
        </AITableContext.Provider>
    )
}
function TableGap(props: { dir: 'h' | 'v' }) {
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
    let [temp] = useState<{ timeout: any, start: any, end: any, pages: any }>({ timeout: undefined, start: undefined, end: undefined, pages: 0 })
    function fix(paging: AI_table_paging): AI_table_paging {
        if (typeof rootProps.onChangePaging !== 'function') {
            alert('aio-input error => in type table you set paging but forget to set onChangePaging function prop to aio input')
            return { number: 0, size: 0 };
        }
        let { number, size = 20, length = 0, sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100], serverSide } = paging
        if (!serverSide) { length = ROWS.sortedRows.length }
        if (sizes.indexOf(size) === -1) { size = sizes[0] }
        let pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        let start = number - 3, end = number + 3;
        temp.start = start; temp.end = end; temp.pages = pages;
        return { ...paging, length, number, size, sizes }
    }
    let [paging, setPaging] = useState<AI_table_paging>(fix(rootProps.paging || { size: 0, number: 0 }));
    useEffect(() => {
        if (rootProps.paging) { setPaging(fix(rootProps.paging)) }
    }, [(rootProps.paging || { size: 0, number: 0, length: 0 }).size, (rootProps.paging || { size: 0, number: 0, length: 0 }).number, (rootProps.paging || { size: 0, number: 0, length: 0 }).length])
    function changePaging(obj: { [key in keyof AI_table_paging]?: any }) {
        let newPaging: AI_table_paging = fix({ ...paging, ...obj });
        setPaging(newPaging);
        if (rootProps.onChangePaging) {
            if (newPaging.serverSide) {
                clearTimeout(temp.timeout);
                temp.timeout = setTimeout(() => {
                    //be khatere fahme payine typescript majbooram dobare in shart ro bezanam
                    if (rootProps.onChangePaging) { rootProps.onChangePaging(newPaging) }
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
            type: 'select', value: size, options: sizes, option: { text: 'option', value: 'option' },
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
    else { return null }
    return <div className='aio-input-table-rows'>{content}</div>
}
function TableToolbar() {
    let { add, exportToExcel, sorts, sortRows, setSorts, search, rootProps, excelColumns }: type_table_context = useContext(AITableContext);
    let { toolbarAttrs, toolbar, onAdd, onSearch, onChangeSort, onChange = () => { }, value, addText } = rootProps;
    toolbarAttrs = AddToAttrs(toolbarAttrs, { className: 'aio-input-table-toolbar' })
    if (!onAdd && !toolbar && !onSearch && !sorts.length && !excelColumns.length) { return null }
    function changeSort(sortId: string, changeObject: any) {
        let newSorts = sorts.map((sort) => {
            if (sort.sortId === sortId) {
                let newSort = { ...sort, ...changeObject }
                return newSort;
            }
            return sort
        });
        changeSorts(newSorts)
    }
    async function changeSorts(sorts: AI_table_sort[]) {
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
        let p: AI = {
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
                close: () => false,
                value: 'option.sortId',
                after: (option: any) => {
                    let { dir = 'dec', sortId } = option;
                    return (
                        <div onClick={(e) => { e.stopPropagation(); changeSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' }) }}>
                            {I(dir === 'dec' ? mdiArrowDown : mdiArrowUp, 0.8)}
                        </div>
                    )
                }
            },
            attrs: { className: 'aio-input-table-toolbar-button' },
            text: I(mdiSort, 0.7),
            onSwap: (newSorts, from, to) => changeSorts(newSorts),
            onChange: (value, option) => changeSort(value, { active: !option.checked })
        }
        return (
            <AIOInput {...p} key='sortbutton' />
        )
    }
    function getAddText() {
        let { addText } = rootProps;
        if (!rootProps.addText) { return I(mdiPlusThick, 0.8) }
        if (typeof addText === 'function') {
            return addText(value)
        }
        return addText
    }
    return (
        <>
            <div {...toolbarAttrs}>
                {toolbar && <div className='aio-input-table-toolbar-content'>{typeof toolbar === 'function' ? toolbar() : toolbar}</div>}
                <div className='aio-input-table-search'>
                    {!!onSearch && <AIOInput type='text' onChange={(value) => search(value)} after={I(mdiMagnify, 0.7)} />}
                </div>
                {button()}
                {!!excelColumns.length && <div className='aio-input-table-toolbar-button' onClick={() => exportToExcel()}>{I(mdiFileExcel, 0.8)}</div>}
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
function TableTitle(p: { column: AI_table_column, isLast: boolean }) {
    let { column, isLast } = p;
    let { getCellAttrs } = useContext(AITableContext);
    let attrs = getCellAttrs({ column, type: 'title' });
    return (<><div {...attrs}>{attrs.title}</div>{!isLast && <TableGap dir='v' />}</>)
}
function TableRow(p: { row: any, isLast: boolean, rowIndex: number }) {
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
                {onRemove ? <><TableGap dir='v' /><button className='aio-input-table-remove' onClick={() => remove(row, rowIndex)}>{I(mdiClose, 0.8)}</button></> : null}
            </div>
            <TableGap dir='h' />
        </>
    )
}
const TableCell = (p: { row: any, rowIndex: number, column: AI_table_column, isLast: boolean }) => {
    let { row, rowIndex, column, isLast } = p;
    let { getCellAttrs, rootProps, getDynamics }: type_table_context = useContext(AITableContext);
    let { onChange = () => { }, value = [] } = rootProps;
    function setCell(row: any, column: AI_table_column, cellNewValue: any) {
        if (column.input && column.input.onChange) {
            column.input.onChange({ value: cellNewValue, row, column })
        }
        else {
            row = JSON.parse(JSON.stringify(row));
            eval(`${column.value} = cellNewValue`);
            onChange(value.map((o: any) => o._id !== row._id ? o : row))
        }
    }
    let contentProps: AI_TableCellContent = { row, rowIndex, column, onChange: column.input ? (value) => setCell(row, column, value) : undefined };
    let key = row._id + ' ' + column._id;
    return (
        <Fragment key={key}>
            <div {...getCellAttrs({ row, rowIndex, column, type: 'cell' })} >
                <TableCellContent {...contentProps} key={key} />
            </div>
            {!isLast && <TableGap dir='v' />}
        </Fragment>
    )
}
type AI_TableCellContent = {row:any,column:AI_table_column,rowIndex:number,onChange?:(newValue:any)=>void}
function TableCellContent(props: AI_TableCellContent) {
    let { row, column, rowIndex, onChange } = props;
    let { getDynamics }: type_table_context = useContext(AITableContext);
    let template = getDynamics({ value: column.template, row, rowIndex, column });
    if (template !== undefined) { return template }
    let input: AI = getDynamics({ value: column.input, row, rowIndex, column });
    let value = getDynamics({ value: column.value, row, rowIndex, column })
    if (!input) { return value }
    //justify baraye input ast amma agar rooye column set shode va input set nashode be input bede
    input.justify = input.justify || getDynamics({ value: column.justify, row, rowIndex, column });
    let convertedInput: any = { type: 'text' }
    for (let property in input) {
        let prop: (keyof AI) = property as keyof AI;
        let res: any = input[prop];
        if (['onChange', 'onClick'].indexOf(prop) !== -1) { convertedInput[prop] = res }
        else { convertedInput[prop] = getDynamics({ value: res, row, rowIndex, column }) }
    }
    let p: AI = { ...convertedInput, value, onChange, type: input.type }
    return (<AIOInput {...p} key={row._id + ' ' + column._id} />)
}
function AIOInputSearch(items: any[], searchValue: string, getValue?: (o: any, index: number) => any) {
    if (!searchValue) { return items }
    function isMatch(keys: string[], value: string) {
        for (let i = 0; i < keys.length; i++) {
            if (value.indexOf(keys[i]) === -1) { return false }
        }
        return true
    }
    let keys = searchValue.split(' ');
    return items.filter((o, i) => isMatch(keys, getValue ? getValue(o, i) : o))
}
type AI_sbp = (size: number, conf?: {half?:boolean,min?:number,max?:number,range?:number}) => number;
type AI_cbs = (str: string,type:'offset'|'radius') => { thickness: number, color: string, roundCap: boolean, full: boolean, radius: number }
type AI_rbs = (str: string) => { thickness: number, color: string, roundCap: boolean, offset: number }
export type I_RangeContext = {
    getXPByValue: (value: number) => number,
    fixAngle: (angle: number) => number,
    getAngleByValue: (value: number, extra?: number) => number,
    isValueDisabled: (value: number) => boolean,
    getSide: () => 'left' | 'right' | 'top' | 'bottom',
    getOffset: () => 'top' | 'left',
    rootProps: AI, dom: any, value: number[],
    getDefaultOffset: (type: 'point' | 'label' | 'scale') => number,
    getCircleByStr: AI_cbs, getRectByStr: AI_rbs,
    sbp: AI_sbp
}
const RangeContext = createContext({} as any)
const Range: FC = () => {
    let { rootProps }: AI_context = useContext(AICTX);
    let {
        start = 0, end = 360, min = start, max = end, step = 1, reverse, round, vertical,
        multiple, text, onChange, size = Def('range-size'), disabled, className, labels = [], rotate = 0
    } = rootProps;
    let [temp] = useState<any>({ dom: createRef(), start: 0, index: false })
    function getValidValue(value: number[]): number[] {
        if (!Array.isArray(value)) { value = [value || 0] }
        for (let i = 0; i < value.length; i++) {
            let point = value[i] || 0;
            point = Math.round((point - start) / step) * step + start;
            point = +point.toFixed(GetPrecisionCount(step))
            if (point < min) { point = min; }
            if (point > max) { point = max; }
            value[i] = point;
        }
        return value
    }
    let value: number[] = getValidValue(rootProps.value);
    let valueRef = useRef(value);
    valueRef.current = value;
    let [disabledDic, setDisabledDic] = useState(getDisabledDic())
    function getDisabledDic() {
        if (!Array.isArray(disabled)) { return {} }
        let res: { [key: string]: boolean } = {}
        for (let i = 0; i < disabled.length; i++) {
            let key = 'a' + disabled[i];
            res[key] = true
        }
        return res
    }
    useEffect(() => { setDisabledDic(getDisabledDic()) }, [JSON.stringify(disabled)])
    useEffect(() => {
        if(!onChange){return}
        clearTimeout(temp.timeOut)
        temp.timeOut = setTimeout(()=>{
            new Swip({
                reverseX: !!reverse,
                //vertical condition
                reverseY: !!reverse && !!vertical,
                dom: () => $(temp.dom.current),
                start: (p:{event:Event}) => {
                    let { event } = p;
                    if(event.target !== null){
                        let target = $(event.target);
                        if (HasClass(target, 'ai-range-point')) {
                            let index: string = target.attr('data-index') || '0';
                            temp.index = +index;
                        }
                        else {
                            temp.index = false
                        }
                        temp.start = [...valueRef.current];
                    }
                    return [0, 0];
                },
                move: (p:I_Swip_parameter) => {
                    let { change, mousePosition } = p;
                    if (change) { changeHandle({ dx: change.dx, dy: change.dy, deltaCenterAngle: change.deltaCenterAngle, centerAngle: mousePosition.centerAngle }) }
                },
                onClick: function (p:I_Swip_parameter) { click(p.mousePosition) }
            })
        },100)
    }, [changeHandle])
    function getDefaultOffset(type: 'point' | 'label' | 'scale',) {
        if (type === 'point') { return round ? 100 : 0 }
        if (type === 'label') { return round ? 116 : 14 }
        if (type === 'scale') { return round ? 100 : 14 }
        return 0
    }
    function changeValue(newValue: number[]) {
        if (!onChange) { return }
        newValue = getValidValue(newValue)
        onChange(!!multiple ? newValue : newValue[0])
    }
    function click(mousePosition: I_Swip_mousePosition) {
        if (disabled === true || temp.index !== false) { return }
        let value = valueRef.current;
        let clickedValue: number;
        //vertical condition
        if (round) { clickedValue = getValueByAngle(mousePosition.centerAngle); }
        else { clickedValue = getValueByXP(mousePosition[vertical ? 'yp' : 'xp']); }
        if (clickedValue < value[value.length - 1] && clickedValue > value[0]) { return }
        if (clickedValue < value[0]) { change1Unit(-1) }
        else { change1Unit(1) }
    }
    function isValueValid(value: number[]): boolean {
        for (let i = 0; i < value.length; i++) { if (isValueDisabled(value[i])) { return false } }
        return true
    }
    const sbp: AI_sbp = (value, p = {}) => {
        let {half = false,range = size / (half?2:1)} = p;
        let res:number = range * value / 100;
        let {min,max} = p;
        if(min !== undefined && res < min){res = min}
        if(max !== undefined && res > max){res = max}
        return res
    }
    const getCircleByStr: AI_cbs = (str:string,type) => {
        let [ticknessStr, offsetStr, colorStr, roundCapStr, fullStr] = str.split(' ');
        let thickness = 1, radius = 0, roundCap = false, color = '#000', full = true;
        try {
            let thicknessValue = +ticknessStr;
            if (isNaN(thicknessValue)) { thicknessValue = 1 }
            thickness = thicknessValue;
            let offsetValue = +offsetStr;
            if (isNaN(offsetValue)) { offsetValue = 0 }    
            let defaultRadius = size / 2 - thickness / 2;
            if(type === 'offset'){radius = defaultRadius - offsetValue;}
            else {radius = offsetValue;}
            if(radius > defaultRadius){radius = defaultRadius}
            if(radius < thickness / 2){radius = thickness / 2}
            if (roundCapStr === '1') { roundCap = true }
            else { roundCap = false }
            if (fullStr === '1') { full = true }
            else { full = false }
            color = colorStr
        }
        catch { }
        return { thickness, radius, color, roundCap, full }
    }
    const getRectByStr: AI_rbs = (str) => {
        let [ticknessStr, offsetStr, colorStr, roundCapStr] = str.split(' ');
        let thickness = 1, offset = 0, roundCap = false, color = '#000', full = true;
        try {
            let thicknessValue = +ticknessStr;
            if (isNaN(thicknessValue)) { thicknessValue = 1 }
            thickness = thicknessValue;
            let offsetValue = +offsetStr;
            if (isNaN(offsetValue)) { offsetValue = 0 }
            let defaultOffset = (size / 2) - (thickness / 2);
            offset = defaultOffset - offsetValue
            if(offset > size - thickness / 2){offset = size - thickness / 2}
            if(offset < thickness / 2){offset = thickness / 2}
            if (roundCapStr === '1') { roundCap = true }
            else { roundCap = false }
            color = colorStr
        }
        catch { }
        return { thickness, offset, color, roundCap }
    }
    function change1Unit(dir: 1 | -1): void {
        let value = valueRef.current;
        let newValue = [...value];
        let lastValue = JSON.stringify(newValue)
        newValue = moveAll(newValue, dir * step);
        while (!isValueValid(newValue) && JSON.stringify(newValue) !== lastValue) {
            lastValue = JSON.stringify(newValue)
            newValue = moveAll(newValue, dir * step)
        }
        changeValue(newValue)
    }
    function changeHandle(obj: { dx: number, dy: number, deltaCenterAngle: number, centerAngle: number }): void {
        if (disabled === true) { return }
        let newValue = getChangedValue(obj);
        changeValue(newValue)
    }
    function getIndexLimit(index: number) {
        let value = valueRef.current;
        let before: number, after: number;
        if (index === 0) { before = start }
        else { before = value[index - 1] }
        if (index === value.length - 1) { after = end }
        else { after = value[index + 1] }
        return { before, after }
    }
    function moveAll(newValue: number[], offset: number, ifFailedReturnOriginalValue?: boolean): number[] {
        let res = newValue.map((o: number) => o + offset)
        if (res[0] < start || res[res.length - 1] > end) {
            return ifFailedReturnOriginalValue ? valueRef.current : newValue
        }
        return res;
    }
    function getChangedValue(obj: { dx: number, dy: number, deltaCenterAngle: number, centerAngle: number }): number[] {
        let { dx, dy, deltaCenterAngle, centerAngle } = obj;
        let startValue = [...temp.start];
        let index = temp.index;
        //agar faghat yek point darim har koja mousedown shod farz kon rooye oon point mousedown karde im
        if (startValue.length === 1 && index === false) { index = 0 }
        let res;
        if (index === false) {
            let deltaValue;
            if (round) {
                let v = deltaCenterAngle * (end - start) / 360;
                v = Math.round(v / step) * step;
                deltaValue = v;
            }
            else { deltaValue = Math.round(getValueByXP(getXPByX(vertical ? dy : dx)) / step) * step; }
            let newValue = moveAll(startValue, deltaValue, true);
            res = !isValueValid(newValue) ? valueRef.current : newValue;
        }

        else {
            let { before, after } = getIndexLimit(index)
            let newUnitValue: number;
            if (round) {
                newUnitValue = Math.round(getValueByAngle(centerAngle) / step) * step;
            }
            else {
                let deltaValue = Math.round(getValueByXP(getXPByX(vertical ? dy : dx)) / step) * step;
                newUnitValue = startValue[index] + deltaValue;
            }
            if (newUnitValue > after) { newUnitValue = after }
            if (newUnitValue < before) { newUnitValue = before }
            if (isValueDisabled(newUnitValue)) {
                newUnitValue = valueRef.current[index]
            }
            startValue[index] = newUnitValue;
            res = startValue;
        }
        return res
    }
    function getSide() {
        if (vertical) { return reverse ? 'bottom' : 'top' }
        return reverse ? 'right' : 'left'
    }
    function getOffset() {
        return vertical ? 'left' : 'top'
    }
    function isValueDisabled(value: number): boolean { return !!disabledDic[`a${value}`] }
    function getRootClassName() {
        let cls = 'ai-range';
        if (round) { cls += ' ai-range-round' }
        else { cls += ` ai-range-${vertical ? 'vertical' : 'horizontal'}` }
        if (className) { cls += ' ' + className }
        if (reverse) { cls += ' ai-range-reverse' }
        return cls
    }
    function getRootStyle(){
        let { style } = rootProps;
        let res:any;
        if(round){res = { width: size, height: size }}
        else if(vertical){res = { width:size }}
        else {res = { height:size }}
        return { ...res,...style, }
    }
    function getRootProps(){
        let { attrs = {} } = rootProps;
        let rootStyle = getRootStyle();
        return AddToAttrs(attrs, { className: getRootClassName(), style: rootStyle, attrs: { ref: temp.dom } })
    }
    function root_node(): RN {
        return (
            <div {...getRootProps()}>
                <RangeGroove/>
                {text !== undefined && <div className='ai-range-text' key='rangetext'>{typeof text === 'function' ? text() : text}</div>}
                {!round && <Fragment key='rangefill'><RangeRanges /><RangeFills /></Fragment>}
                <RangeSvg />
                {labels.map((label:AI_label,i:number)=><RangeLabel key={i} label={label} />)}
                {value.map((itemValue, i) => <RangeValueContainer index={i} itemValue={itemValue} key={'rangecontainervalue' + i} />)}
            </div>
        )
    }
    function fixValueInEmpty(value: number) {
        round = round || 1;
        let fill = round;
        let empty = 1 - fill;
        let emptyValue = empty * (end - start) / fill;
        if (value > end + emptyValue / 2) {
            value = start - emptyValue + value - end
        }
        return value;
    }
    function getValueByAngle(angle: number) {
        let fillAngle = 360 * (round || 1);
        let emptyAngle = 360 - fillAngle;
        if (reverse) { angle = 180 - angle }
        angle -= rotate;
        angle -= emptyAngle / 2;
        angle -= 90;
        angle = fixAngle(angle);
        let res = angle * (end - start) / fillAngle;
        res = fixValueInEmpty(res);
        return res
    }
    function getAngleByValue(value: number, ang?: number) {
        let fillAngle = 360 * (round as number);
        let emptyAngle = 360 - fillAngle;
        let res = value * fillAngle / (end - start);
        res += 90; res += emptyAngle / 2;
        res += rotate;
        res += (ang || 0)
        return reverse ? res = 180 - res : res;
    }
    function fixAngle(angle: number): number { angle = angle % 360; return angle < 0 ? angle = 360 + angle : angle }
    function getXPByValue(value: number): number { return 100 * (value - start) / (end - start); }
    function getValueByXP(xp: number): number { return xp * (end - start) / 100; }
    function getXPByX(x: number): number { return x * 100 / ($(temp.dom.current)[vertical ? 'height' : 'width']() as number); }
    function getContext() {
        let context: I_RangeContext = {
            getXPByValue, rootProps, fixAngle, getAngleByValue, dom: temp.dom, getCircleByStr, getRectByStr,
            isValueDisabled, value: valueRef.current, getSide, getOffset, getDefaultOffset, sbp
        }
        return context;
    }
    return (<RangeContext.Provider value={getContext()}>{root_node()}</RangeContext.Provider>)
}
const RangeGroove:FC = ()=>{
    let {rootProps}:I_RangeContext = useContext(RangeContext);
    const attrs = AddToAttrs(rootProps.grooveAttrs,{className:'ai-range-groove'})
    if(rootProps.round){
        return null
    }
    else {
        return <div {...attrs}></div>
    }
    
}
type I_RangeValue = {value:number,disabled:boolean,angle:number,index:number,parentDom:any}
const RangeSvg: FC = () => {
    let { rootProps,value }: I_RangeContext = useContext(RangeContext);
    let { round, ranges = [], circles = [], size = Def('range-size'),end = 360 } = rootProps;
    if (!round || (!(ranges || [0]).length && !circles.length)) { return null }
    let pathes = [<RangeCircles />, <RangeRanges />]
    return (<svg style={{ position: 'absolute', left: 0, top: 0 }} width={size} height={size}>{pathes}</svg>)
}
const RangeCircles: FC = () => {
    let { rootProps, getCircleByStr }: I_RangeContext = useContext(RangeContext);
    let { start = 0, end = 360, circles = [], size = Def('range-size') } = rootProps;
    let pathes = []
    for (let i = 0; i < circles.length; i++) {
        let from = start, to = end
        let { thickness, color, radius, roundCap, full } = getCircleByStr(circles[i],'radius')
        let p: I_RangeArc = { thickness, color, from, to, radius, full, roundCap };
        pathes.push(<RangeArc {...p} />);
    }
    return <>{pathes}</>;
}
const RangeFills: FC = () => {
    let { rootProps, value }: I_RangeContext = useContext(RangeContext);
    let { start = 0, fill, round } = rootProps;
    if (round || fill === false) { return null }
    let limit = value.length === 1 ? [start, value[0]] : [...value];
    let res: RN[] = [];
    for (let i = 1; i < limit.length; i++) {
        let { thickness, style, className: fillClassName, color } = (typeof fill === 'function' ? fill(i) : fill) || {};
        let from = limit[i - 1];
        let to = limit[i];
        let className = 'ai-range-fill';
        if (fillClassName) { className += ' ' + fillClassName }
        let p: I_RangeRect = { thickness, color, from, to, className, style }
        res.push(<RangeRect {...p} key={'fill' + i} />)
    }
    return <>{res}</>
}
const RangeRanges: FC = () => {
    let { rootProps, getCircleByStr, getRectByStr }: I_RangeContext = useContext(RangeContext);
    let { start = 0, ranges = [], round } = rootProps;
    let res = [], from = start, list = ranges;
    for (let i = 0; i < list.length; i++) {
        let [value, config] = list[i];
        let to = value
        let rangeItem: RN
        if (round) {
            let { thickness, color, radius, roundCap } = getCircleByStr(config,'offset')
            let p: I_RangeArc = { thickness, color, from, to, radius, roundCap, full: false }
            rangeItem = <RangeArc {...p} />
        }
        else {
            let { thickness, color, offset, roundCap } = getRectByStr(config)
            let p: I_RangeRect = { thickness, color, from, to, offset, roundCap, className: 'ai-range-range' }
            rangeItem = <RangeRect {...p} key={'range' + i} />
        }
        res.push(rangeItem);
        from = to;
    }
    return <>{res}</>
}
type I_RangeValueContainer = {itemValue:number,index:number}
const RangeValueContainer: FC<I_RangeValueContainer> = (props) => {
    let { rootProps, isValueDisabled, fixAngle, getAngleByValue, getXPByValue, dom, getSide }: I_RangeContext = useContext(RangeContext);
    let { itemValue, index } = props;
    let { round } = rootProps;
    let angle = fixAngle(getAngleByValue(itemValue));
    function containerProps() {
        let style: any;
        if (!round) { style = { [getSide()]: getXPByValue(itemValue) + '%' } }
        else { style = { transform: `rotate(${angle}deg)` } }
        return { className: 'ai-range-value-container', draggable: false, style }
    }
    let PROPS: I_RangeValue = {
        value: itemValue, index, disabled: isValueDisabled(itemValue),
        angle, parentDom: dom
    }
    return (<div {...containerProps()}><RangeHandle {...PROPS} key='handle' /> <RangePoint {...PROPS} key='point' /></div>)
}
type I_RangeRect = {thickness?:number,color?:string,from:number,to:number,className?:string,style?:any,offset?:number,roundCap?:boolean}
const RangeRect: FC<I_RangeRect> = ({ thickness, color, from, to, className, style, offset, roundCap }) => {
    let { getXPByValue, rootProps, getSide }: I_RangeContext = useContext(RangeContext);
    let { vertical } = rootProps, startSide = getXPByValue(from), endSide = getXPByValue(to);
    let bigSizeStyle = { [vertical ? 'height' : 'width']: (endSide - startSide) + '%' }
    let smallSizeStyle = { [vertical ? 'width' : 'height']: thickness }
    let mainSideStyle = { [getSide()]: startSide + '%' }
    let otherSideStyle = offset ? {[vertical?'left':'top']: offset } : {}
    let borderRadiusStyle = roundCap ? { borderRadius: '100%' } : {}
    let colorStyle = { background: color }
    let Style: any = { ...bigSizeStyle, ...smallSizeStyle, ...mainSideStyle, ...otherSideStyle, ...borderRadiusStyle, ...colorStyle, ...style }
    return <div className={className} style={Style} />
}
type I_RangeArc = {thickness:number,color:string,from:number,to:number,radius:number,full?:boolean,roundCap?:boolean}
const RangeArc: FC<I_RangeArc> = ({ thickness, color, from, to, radius, full, roundCap }) => {
    let { fixAngle, getAngleByValue, rootProps }: I_RangeContext = useContext(RangeContext);
    let { size = Def('range-size'), reverse } = rootProps;
    let a, b;
    let x = size / 2, y = size / 2;
    if (full) { a = 0; b = 360; }
    else {
        let startAngle = fixAngle(getAngleByValue(from) + 90);
        let endAngle = fixAngle(getAngleByValue(to) + 90);
        if (endAngle === 0) { endAngle = 360 }
        a = startAngle;
        b = endAngle;
        if (reverse) { b = startAngle; a = endAngle }
    }
    return <path key={`from${from}to${to}`} d={svgArc(x, y, radius, a, b)} stroke={color} strokeWidth={thickness} fill='transparent' strokeLinecap={roundCap ? 'round' : undefined} />
}
const RangePoint: FC<I_RangeValue> = (props) => {
    let { rootProps, getOffset, sbp }: I_RangeContext = useContext(RangeContext);
    let [temp] = useState<any>({ dom: createRef() })
    let { value, disabled, angle, index, parentDom } = props;
    if (rootProps.point === false) { return null }
    let { round,size = Def('range-size') } = rootProps;
    let point = (rootProps.point || (() => { }))(value, { disabled, angle, value, index }) || {}
    let { attrs = {},html = value, offset = 0 } = point;
    let zIndexAttrs = getEventAttrs('onMouseDown', () => {
        let containers = $(parentDom.current).find('ai-range-value-container');
        containers.css({ zIndex: 10 });
        containers.eq(index).css({ zIndex: 100 })
    })
    let containerStyle,pointStyle = {...attrs.style}
    if (round) {containerStyle = { left: size / 2 + offset, transform: `rotate(${-angle}deg)` }}
    else {containerStyle = { [getOffset()]: offset } }
    let containerProps = { ref: temp.dom, className: 'ai-range-point-container', style: containerStyle, draggable: false }
    let pointProps = AddToAttrs(attrs, { className: ['ai-range-point'], style:pointStyle, attrs: { draggable: false, 'data-index': index, ...zIndexAttrs } })
    return (<div {...containerProps} key={'rangepoint' + index}><div {...pointProps}>{html}</div></div>)
}
const RangeHandle: FC<I_RangeValue> = (props) => {
    let {rootProps,sbp}:I_RangeContext = useContext(RangeContext);
    let {  value, angle, disabled, index } = props;
    let { handle = (() => { }), round } = rootProps;
    if (handle === false || !round) { return null }
    if (handle && typeof handle !== 'function') {
        alert(`aio-input error => in type round, handle props should be a function,
        handle type = (value:number,{disabled:boolean,angle:number})=>{attrs:any}`)
        return null
    }
    let { sharp = false,thickness = 10, size:handleSize = 90, color = '#000', offset = 0 } = handle(value, { angle, disabled, value }) || {}
    let width = sbp(handleSize,{half:true});
    let height = sbp(thickness,{half:true})
    function getStyle(){
        if(sharp){
            return {
                [width < 0 ? 'borderRight' : 'borderLeft']: `${Math.abs(width)}px solid ${color}`,
                borderTop: `${height / 2}px solid transparent`,
                borderBottom: `${height / 2}px solid transparent`,
                left: offset
            }
        }
        else {return {width,height,left: offset,background:color}}
    }
    let PROPS = AddToAttrs({}, {
        className: 'aio-input-handle', style: getStyle(), attrs: { draggable: false }
    })
    return (<div {...PROPS} key={'rangehandle' + index}></div>)
}
type I_RangeLabel = {label:AI_label}
const RangeLabel: FC<I_RangeLabel> = (props) => {
    let { dom, rootProps }: I_RangeContext = useContext(RangeContext)
    let { label } = props;
    let {zIndex,dynamic,step,list = []} = label;
    let { round, start = 0, end = 360, reverse, vertical } = rootProps;
    let [def] = useState<RN>(getDef);
    function getDef() { return RENDER(true) }
    function getList(): number[] {
        let res: number[] = [];
        if (step) {
            let {start:lstart = start,end:lend = end} = label;
            for (let i = lstart; i <= lend; i+=step) {res.push(i)}
        }
        for (let i = 0; i < list.length; i++) {
            if (res.indexOf(list[i]) === -1) { res.push(list[i]) }
        }
        return res;
    }
    function updateLabels() {
        if (round || !label.autoHide || vertical) { return }
        let container = $(dom.current);
        let labels = container.find('.ai-range-label');
        if (!labels.length) { return; }
        let firstLabel: any = labels.eq(0);
        let firstLabelHProp = firstLabel.attr('data-rotated') === 'yes' ? 'height' : 'width';
        let end = firstLabel.offset().left + (!reverse ? firstLabel[firstLabelHProp]() : 0);
        for (let i = 1; i < labels.length; i++) {
            let label: any = labels.eq(i);
            let hProp = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
            label.css({ display: 'flex' })
            let left = label.offset().left
            let width = label[hProp]();
            let right = left + width;
            if (!reverse) {
                if (left < end + 5) { label.css({ display: 'none' }) }
                else { end = left + width; }
            }
            else {
                if (right > end - 5) { label.css({ display: 'none' }) }
                else { end = left; }
            }
        }
    }
    useEffect(() => { $(window).on('resize', updateLabels) }, [])
    useEffect(() => { updateLabels() })
    function RENDER(init: boolean): RN {
        if (!init && !dynamic) {return def}
        return (
            <div className='ai-range-labels' style={{zIndex}}>
                {getList().map((itemValue) => <RangeLabelItem key={itemValue} label={label} itemValue={itemValue} />)}
            </div>
        )
    }
    return <>{RENDER(false)}</>
}
export type I_RangeLabelItem = {label:AI_label,itemValue:number}
const RangeLabelItem: FC<I_RangeLabelItem> = (props) => {
    let { rootProps, isValueDisabled, fixAngle, getAngleByValue, getXPByValue, getSide }: I_RangeContext = useContext(RangeContext);
    let { label, itemValue } = props;
    let { round, vertical,size = Def('range-size') } = rootProps;
    let angle: number;
    if (round) { angle = fixAngle(getAngleByValue(itemValue)) }
    let disabled = isValueDisabled(itemValue);
    function getContainerStyle(distance: any) {
        if (round) { return { transform: `rotate(${angle}deg)` } }
        else {return { [getSide()]: getXPByValue(itemValue) + '%', ...distance }}
    }
    function getTextStyle(item: AI_labelItem, distance: any) {
        let res: any = {};
        if (round) {
            res = {...res,...distance}
            if (item.fixAngle) {res = {...res,transform:`rotate(${-angle}deg)`}}
        }
        return { width:0,height:0,...res };
    }
    function getDetails() {
        let item: AI_labelItem = label.setting(itemValue, { disabled, angle });
        let { offset = 0, html = '' } = item;
        let distance = {[round || vertical?'left':'top']:size / 2 + offset}
        let containerStyle = getContainerStyle(distance);
        let containerProps = { className: `ai-range-label-container`, style: containerStyle, draggable: false };
        let textProps = AddToAttrs({}, { className: [`ai-range-label`], style: getTextStyle(item, distance), attrs: { draggable: false } })
        return { html, textProps, containerProps }
    }
    let { html, textProps, containerProps } = getDetails();
    return (<div {...containerProps}><div {...textProps}>{html}</div></div>)
}
const MapContext = createContext({} as any);

export type AI_Sidemenu = {
    items:AI_Sidemenu_item[],
    onChange:(item:AI_Sidemenu_item)=>void,
    option?:any,
    type?:'hover' | 'normal' | 'icon',
    className?:string,
    style?:any,
    attrs?:any
}
export type AI_Sidemenu_item = {
    text:RN,
    value:string,
    badge?:AI_Sidemenu_badge | AI_Sidemenu_badge[],
    icon:RN,
    items?:AI_Sidemenu_item[],
    onClick?:()=>void
}
export type AI_Sidemenu_badge = {
    text:string,circle?:boolean,
    color:'red'|'green'|'blue'|'grey'|'white'|'orange'|'yellow',
}
export const SideMenu:FC<AI_Sidemenu> = (props) => {
    let {items = [],onChange,option = {},type = 'normal'} = props;
    let cls = 'aio-input-sidemenu'
    function getBadge(item:AI_Sidemenu_item){
        let {badge} = item;
        if(!badge){badge = []}
        if(!Array.isArray(badge)){badge = [badge]}
        if(!badge.length){return []}
        let res:RN[] = []
        for(let i = 0; i < badge.length; i++){
            let {text,color = 'red',circle} = badge[i]
            res.push(<div className={`${cls}-badge ${cls}-align ${cls}-badge-${color}${circle?' ' + cls + `-badge-circle`:''}`}>{text}</div>)
        }
        return res
    }
    function getAfter(option:AI_Sidemenu_item,details:I_optionDetails){
        let {items = []} = option;
        let open = details.isOpen?details.isOpen(option.value):false;
        let badge:RN[] = getBadge(option);
        return (
            <div className={`${cls}-after ${cls}-align`}>
                {!!badge.length && badge}
                {!!items.length && <Icon path={open?mdiChevronDown:mdiChevronRight} size={0.7}/>}
            </div>
        )
    }
    function getBefore(option:any,details:any){
        let {icon = <Icon path={mdiCircle} size={0.6}/>} = option;
        if(!icon){return null}
        return (
            <div className={`${cls}-before`}>
                <div className={`${cls}-icon ${cls}-align`}>{icon}</div>
            </div>
        )
    }
    const defaultOption = {
        text:'option.text',
        value:'option.value',
        toggleIcon:()=>false,
        after:(option:AI_Sidemenu_item,details:I_optionDetails)=>getAfter(option,details),
        before:(option:AI_Sidemenu_item,details:I_optionDetails)=>getBefore(option,details),
        onClick:(option:AI_Sidemenu_item,details:I_optionDetails)=>{
            let {items = []} = option;
            if(!!items.length){if(details.toggle){details.toggle()}}
            else if(option.onClick){option.onClick()}
            else if(onChange){onChange(option)}
        },
        className:(option:AI_Sidemenu_item,details:I_optionDetails)=>`${cls}-row-level-${details.level}`
    }
    let finalOptions = {
        ...defaultOption,...option,
        className:(item:AI_Sidemenu_item,details:I_optionDetails)=>{
            let className = `${cls}-row-level-${details.level}`
            if(typeof option.className === 'function'){
                const res = option.className(item,details)
                if(res){className += ' ' + res}
            }
            return className
        }
    }
    const attrs = AddToAttrs(props.attrs,{className:[cls,`aio-input-sidemenu-${type}`,props.className]})
    return (
        <AIOInput
            {...attrs}
            className={attrs.className}
            type='tree'
            size={48}
            value={[...items]}
            getChilds={(p:{row:AI_Sidemenu_item})=>p.row.items || []}
            option={finalOptions}
            indent={0}
        />
    )
}
export type AI_timeUnits = 'year'|'month'|'day'|'hour'|'minute'|'second'
export type AV_operator = 'contain' | '!contain' | 'required' | '=' | '!=' | '>' | '!>' | '>=' | '!>=' | '<' | '!<' | '<=' | '!<=' | 'startBy'
export type AV_props = {lang?:'fa'|'en',title:string,value:any,validations:AV_item[]}
export type AV_item = string
export class AIOValidation {
    contain: (target: any, value: any) => {result:boolean,unit:any};
    startBy: (target: any, value: any) => {result:boolean,unit:any};
    equal: (target: any, value: any,equal?:boolean) => {result:boolean,unit:any};
    less: (target: any, value: any,equal?:boolean) => {result:boolean,unit:any};
    greater: (target: any, value: any,equal?:boolean) => {result:boolean,unit:any};
    between: (targets:any[], value:any,equal?:boolean)=>{result:boolean,unit:any};
    getMessage: (p:{operator: AV_operator, target: string, message?: string,title?:string,unit: string}) => string;
    translate: (operator: AV_operator) => string
    getResult: (p: { target: any, title: string,message?:string, value: any, operator: AV_operator }) => string | undefined
    getValidation: () => string | undefined;
    validate: () => string | undefined;
    fnMapper:(operatorName:any)=>string;
    boolKey:(key:'more' | 'less')=>string;
    boolDic:any;
    getUnit:(value:any)=>string;
    constructor(props: AV_props) {
        let { lang = 'en',value } = props;
        let isDate = typeof value === 'string' && value.indexOf('/') !== -1;
        this.boolDic = isDate?{more:{en:'after',fa:'بعد از'},less:{en:'before',fa:'قبل از'}}:{more:{en:'more',fa:'بیشتر'},less:{en:'less',fa:'کمتر'}}
        this.boolKey = (key)=>this.boolDic[key][lang]
        let DATE = new AIODate();
        this.contain = (target, value) => {
            let result
            if (Array.isArray(value)) { result = value.indexOf(target) !== -1 }
            else if (target === 'number') { result = /\d/.test(value);}
            else if (target === 'letter') { result = /[a-zA-Z]/.test(value);}
            else if (target === 'uppercase') { result = /[A-Z]/.test(value);}
            else if (target === 'lowercase') { result = /[a-z]/.test(value);}
            else if (target === 'symbol') { result = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value);}
            else if (typeof target.test === 'function') { result = target.test(value);}
            else { result = value.indexOf(target) !== -1;}
            return {result,unit:''}
        }
        this.startBy = (target, value)=>({result:value.indexOf(target) === 0,unit:''})
        this.equal = (target, value) => {
            let valueType = Array.isArray(value) ? 'array' : typeof value;
            let targetType = typeof target;
            let result,unit;
            if (isDate) { result = DATE.isEqual(value, typeof target === 'number'?target.toString():target); unit = '' }
            else if ((valueType === 'array' || valueType === 'string') && targetType === 'number') { result = value.length === target; unit = this.getUnit(value) }
            else { result = JSON.stringify(value) === JSON.stringify(target); unit = '' }
            return {result,unit}
        }
        this.less = (target, value,equal) => {
            let valueType = Array.isArray(value) ? 'array' : typeof value;
            let targetType = typeof target;
            let result,unit = '';
            if (isDate) { result = DATE.isLess(value, typeof target === 'number'?target.toString():target); unit = '' }
            else if (targetType === 'number' && valueType === 'number') { result = value < target; unit = '' }
            else if ((valueType === 'array' || valueType === 'string') && targetType === 'number') { result = value.length < target; unit = this.getUnit(value) }
            else { result = false; unit = ''; }
            return {result:equal?result || this.equal(target,value).result:result,unit};
        }
        this.greater = (target, value,equal) => {
            let valueType = Array.isArray(value) ? 'array' : typeof value;
            let targetType = typeof target;
            let result,unit;
            if (isDate) { result = DATE.isGreater(value, typeof target === 'number'?target.toString():target); unit = '' }
            else if (targetType === 'number' && valueType === 'number') { result = value > target; unit = '' }
            else if ((valueType === 'array' || valueType === 'string') && targetType === 'number') { result = value.length > target; unit = this.getUnit(value) }
            else { result = false; unit = '' }
            return {result:equal?result || this.equal(target,value).result:result,unit};
        }
        this.between = (targets, value,equal) => {
            let res1 = this.greater(targets[0],value).result
            let res2 = this.less(targets[1],value).result
            let result = !!res1 && !!res2
            return {result:equal?(result || this.equal(targets[0],value).result ||this.equal(targets[1],value).result):result,unit:''}
        }
        this.translate = (operator):string => {
            
            let dict = {
                'contain': { en: `should be contain`, fa: `باید شامل` },
                '!contain': { en: `should not be contain`, fa: `نمی تواند شامل` },
                '>': { en: `should be ${this.boolKey('more')} than`, fa: `باید ${this.boolKey('more')} از` },
                '!>': { en: `could not be ${this.boolKey('more')} than`, fa: `نباید ${this.boolKey('more')} از` },
                '>=': { en: `should be ${this.boolKey('more')} than or equal`, fa: `باید ${this.boolKey('more')} یا مساوی` },
                '!>=': { en: `could not be ${this.boolKey('more')} than or equal`, fa: `نباید ${this.boolKey('more')} یا مساوی` },
                '<': { en: `should be ${this.boolKey('less')} than`, fa: `باید ${this.boolKey('less')} از` },
                '!<': { en: `could not be ${this.boolKey('less')} than`, fa: `نباید ${this.boolKey('less')} از` },
                '<=': { en: `should be ${this.boolKey('less')} than or equal`, fa: `باید ${this.boolKey('less')} یا مساوی` },
                '!<=': { en: `could not be ${this.boolKey('less')} than or equal`, fa: `نباید ${this.boolKey('less')} یا مساوی` },
                '=': { en: `should be equal`, fa: `باید برابر` },
                '!=': { en: `cannot be equal`, fa: `نمی تواند برابر` },
                'startBy': { en: `should start by`, fa: `باید در ابتدا شامل` },
                'required': { en: '', fa: '' }
            }
            return dict[operator][lang]
        }
        this.fnMapper = (operatorName:any)=>{
            let dict:any = {
                'contain': 'contain','!contain': 'contain','startBy':'startBy',
                '!=': 'equal','=': 'equal',
                '<': 'less','<=': 'less','!<': 'less','!<=': 'less',
                '>': 'greater','>=': 'greater','!>': 'greater','!>=': 'greater',
                '<>': 'between','<=>':'between','!<>': 'between','!<=>':'between'
            }
            return dict[operatorName]
        }
        this.getMessage = (p) => {
            let {operator, target, unit,title,message} = p;
            if (message) { return message }
            let operatorName = this.translate(operator)
            let res = `${title} ${operatorName} ${target} ${unit}` + (props.lang === 'fa' ? ' باشد' : '')
            return res.trim()
        }
        this.getResult = (p) => {
            let { target, message,title, value, operator } = p;
            let operatorName: string = operator, not = false,equal = operator.indexOf('=') !== -1;
            let notIndex = operatorName.indexOf('!');
            if (notIndex === 0) {
                not = true;
                operatorName = operator.slice(1, operator.length);
            }
            let fn: any = (this as any)[this.fnMapper(operatorName)];
            let {result,unit} = fn(target, value,equal)
            if ((not && result) || (!not && !result)) { return this.getMessage({operator, target, message,title, unit}) }
        }
        this.getUnit = (value)=>{
            let unit = '';
            if (Array.isArray(value)) { unit = lang === 'fa' ? 'مورد' : 'items(s)' }
            else if (typeof value === 'string') { unit = lang === 'fa' ? 'کاراکتر' : 'character(s)' }
            return unit;
        }
        this.getValidation = () => {
            let { value, validations = [] } = props;
            for (let i = 0; i < validations.length; i++) {
                let [operator, target, text ] = validations[i].split(',');
                let otherTarget;
                let title:string = props.title,message:string = '';
                if(text){
                    if(text[0] === 'title(' && text[text.length - 1] === ')'){title = text.slice(6,text.length - 1)}
                    else if(text[0] === 'message(' && text[text.length - 1] === ')'){message = text.slice(8,text.length - 1)}
                    else {otherTarget = ParseString(text)}
                }
                let result;
                if (operator === 'required') {
                    if (value === undefined || value === null || value === '' || value === false || value.length === 0) {
                        if (lang === 'en') { return `${title} is required` }
                        if (lang === 'fa') { return `وارد کردن ${title} ضروری است` }
                    }
                }    
                else {
                    let isBetween = operator.indexOf('<') !== -1 && operator.indexOf('>') !== -1
                    target = ParseString(target);
                    let Target;
                    if(isBetween){Target = [target,otherTarget]}
                    else {Target = target}
                    result = this.getResult({ operator:operator as AV_operator, target:Target, title,message, value })
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
export function AIOInput_defaultProps(p:{[key in ('mapApiKeys')]?:any}) {
    let storage: Storage = new Storage('aio-input-storage');
    for(let prop in p){storage.save(prop,(p as any)[prop])}
}
function getTypes(props: AI) {
    function isDropdown() {
        if (['select', 'date', 'time'].indexOf(type) !== -1) { return true }
        if (['text', 'number', 'textarea'].indexOf(type) !== -1 && props.options) { return true }
        if (type === 'button' && props.popover) { return true }
        return false
    }
    let { type, multiple } = props;
    let isMultiple;
    if (type === 'table' || type === 'tags') { isMultiple = true }
    else if (['radio','range','file','buttons','select','date','acardion'].indexOf(type) !== -1) { isMultiple = !!multiple }
    else { isMultiple = false };
    return {
        isMultiple,
        isInput: ['text', 'number', 'textarea', 'password'].indexOf(type) !== -1,
        isDropdown: isDropdown(),
        hasOption: ['text', 'number', 'textarea', 'color', 'select', 'radio', 'tabs', 'list', 'buttons','tags'].indexOf(type) !== -1,
        hasPlaceholder: ['text', 'number', 'textarea', 'color', 'select', 'table', 'image', 'date'].indexOf(type) !== -1,
        hasKeyboard: ['text', 'textarea', 'number', 'password'].indexOf(type) !== -1,
        hasText: ['checkbox', 'button', 'select'].indexOf(type) !== -1,
        hasSearch: ['table', 'select'].indexOf(type) !== -1
    }
}

function getDefaultProps(props: AI, types: AI_types) {
    let valueType = Array.isArray(props.value) ? 'array' : typeof props.value;
    props = { ...props }
    if (props.type === 'select') {
        if (!!props.multiple) {
            if (!props.text) { props.text = 'Select Items' }
        }
    }
    else if (props.type === 'time') {
        if (!props.value) { props.value = {} }
    }
    else if (props.type === 'acardion') {
        props.deSelect = true
    }
    else if (props.type === 'date') {
        if (props.multiple) { props.option = {...props.option,text:'option',value:'option'} }
    }
    if (props.loading === true) { props.disabled = true }
    if (types.isMultiple) {

        if (!props.value) { props.value = [] }
        else if (valueType !== 'array') { props.value = [props.value] }
    }
    else {
        if (props.type === 'tree') { }
        else if (valueType === 'array') { props.value = props.value[0] }
    }
    return props;
}

function Def(prop: string) {
    let res = {
        'theme': [],
        'date-size': 180,
        'tree-size': 36,
        'range-size': 72,
        'date-unit': 'day'
    }[prop]
    return res as any
}
function I(path: any, size: number, p?: any) {
    return <Icon path={path} size={size} {...p} />
}
type I_GetOptions = {
    rootProps: AI, 
    types: AI_types, 
    options: any[], 
    properties?: any, 
    level?: number, 
    toggle?:(id:any)=>void,
    change?: (row: any, newRow: any) => void, 
    isOpen?:(id:any)=> boolean | undefined,
    defaultOptionProps?: AI_optionProp
}
function GetOptions(p:I_GetOptions): AI_options {
    let { options,rootProps, types, properties = {}, level,isOpen, change, defaultOptionProps,toggle } = p;
    let { deSelect } = rootProps;
    let result = [];
    let dic:AI_optionDic = {}
    let draggable: boolean = types.isDropdown && types.hasOption && !!rootProps.onSwap;
    function getDefaultOptionChecked(v: any) {
        if (rootProps.type === 'select' && types.isMultiple) { return rootProps.value.indexOf(v) !== -1 }
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
    function isActive(optionValue:any):boolean{
        if (types.isMultiple) {return rootProps.value.indexOf(optionValue) !== -1}
        else {return optionValue === rootProps.value}
    }
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let details: I_optionDetails = { 
            defaultOptionProps,index: i,active:false,mainValue:rootProps.value, level,isOpen, 
            change: change ? (newRow: any) => { change(option, newRow) } : undefined,
        };
        let disabled = !!rootProps.disabled || !!rootProps.loading || !!GetOptionProps({ props: rootProps, option, key: 'disabled', details });
        //ghabl az har chiz sharte namayesh ro check kon
        let show = GetOptionProps({ props: rootProps, option, key: 'show', details })
        if (show === false) { continue }
        let optionValue = GetOptionProps({ props: rootProps, option, key: 'value', details })
        let active = isActive(optionValue);
        let text = GetOptionProps({ props: rootProps, option, key: 'text', details });
        //hala ke value ro dari active ro rooye details set kon ta baraye gereftane ettelaat active boodan moshakhas bashe
        details.active = active;
        details.toggle = toggle?()=> toggle(optionValue):undefined;
        let attrs = GetOptionProps({ props: rootProps, option, key: 'attrs', def: {}, details });
        let defaultChecked = getDefaultOptionChecked(optionValue)
        let checked = GetOptionProps({ props: rootProps, option, key: 'checked', def: defaultChecked, details })
        //object:option => do not remove mutability to use original value of option in for example tree row
        let obj:AI_option = {
            active,
            object: option, show,
            loading: rootProps.loading,
            attrs, text, value: optionValue, disabled, draggable,
            checkIcon: GetOptionProps({ props: rootProps, option, key: 'checkIcon', details }) || rootProps.checkIcon,
            checked,
            toggleIcon: GetOptionProps({ props: rootProps, option, def:true,key: 'toggleIcon', details }),
            before: GetOptionProps({ props: rootProps, option, key: 'before', details }),
            after: GetOptionProps({ props: rootProps, option, key: 'after', details }),
            justify: GetOptionProps({ props: rootProps, option, key: 'justify', details }),
            subtext: GetOptionProps({ props: rootProps, option, key: 'subtext', details }),
            onClick: GetOptionProps({ props: rootProps, option, key: 'onClick', preventFunction: true, details }),
            className: GetOptionProps({ props: rootProps, option, key: 'className', details }),
            style: GetOptionProps({ props: rootProps, option, key: 'style', details }),
            tagAttrs: GetOptionProps({ props: rootProps, option, key: 'tagAttrs', details }),
            tagBefore: GetOptionProps({ props: rootProps, option, key: 'tagBefore', details }),
            close: GetOptionProps({ props: rootProps, option, key: 'close', def: !types.isMultiple, details }),
            tagAfter: GetOptionProps({ props: rootProps, option, key: 'tagAfter', details }),
            index: i,
            details,
        }
        let OBJ:any = updateOptionByProperties(obj);
        result.push(OBJ)
        dic['a' + OBJ.value] = OBJ;
    }
    return {optionsList:result,optionsDic:dic};
}
type I_GetOptionProps = { 
    defaultOptionProps?: AI_optionProp, 
    props: AI, 
    option: AI_option, 
    key: AI_optionKey, 
    def?: any, 
    preventFunction?: boolean, 
    details:I_optionDetails
}
function GetOptionProps(p:I_GetOptionProps) {
    let { props, option, key, def, preventFunction, details, defaultOptionProps = {} } = p;
    let optionResult = typeof option[key] === 'function' && !preventFunction ? option[key](option, details) : option[key]
    if (optionResult !== undefined) { return optionResult }
    let prop = (props.option || {})[key];
    prop = prop === undefined ? defaultOptionProps[key] : prop
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
function getTimeByUnit(rootProps:AI,justToday?: boolean) {
    let { value = {}, jalali, unit = { year: true, month: true, day: true } } = rootProps;
    function getToday() {
        let today = new AIODate().getToday(jalali);
        return { year: today[0], month: today[1], day: today[2], hour: today[3], minute: today[4], second: today[5] }
    }
    let today = getToday();
    let newValue: any = {};
    let u: AI_timeUnits;
    unit = unit as AI_time_unit
    for (u in unit) {
        if (unit[u] === true) {
            let v = value[u];
            let min: number = { year: 1000, month: 1, day: 1, hour: 0, minute: 0, second: 0 }[u] as number
            let max: number = { year: 3000, month: 12, day: 31, hour: 23, minute: 59, second: 59 }[u] as number
            if (v !== undefined && typeof v !== 'number' || v < min || v > max) {
                alert(`aio input error => in type time value.${u} should be an number between ${min} and ${max}`)
            }
            let res: number = v === undefined || justToday ? today[u] : v;
            newValue[u] = res;
        }
    }
    return newValue;
}
function getTimeText(rootProps:AI) {
    let value = getTimeByUnit(rootProps);
    if (!value) {
        if (typeof rootProps.placeholder === 'string') { return rootProps.placeholder }
        if (typeof rootProps.text === 'string') { return rootProps.text }
        return ''
    }
    if (rootProps.pattern) { return new AIODate().getDateByPattern(value, rootProps.pattern as string) }
    if (rootProps.text !== undefined) { return rootProps.text as string }
    let text = [], dateArray = [];
    if (value.year !== undefined) { dateArray.push(Get2Digit(value.year)) }
    if (value.month !== undefined) { dateArray.push(Get2Digit(value.month)) }
    if (value.day !== undefined) { dateArray.push(Get2Digit(value.day)) }
    if (dateArray.length) { text.push(dateArray.join('/')) }
    let timeArray = []
    if (value.hour !== undefined) { timeArray.push(Get2Digit(value.hour)) }
    if (value.minute !== undefined) { timeArray.push(Get2Digit(value.minute)) }
    if (value.second !== undefined) { timeArray.push(Get2Digit(value.second)) }
    if (timeArray.length) { text.push(timeArray.join(':')) }
    return text.join(' ');
}


export type AI_type = 'text' | 'number' | 'textarea' | 'password' | 'select' | 'tree'|'spinner' |'slider'|'tags' |
    'button' | 'date' | 'color' | 'radio' | 'tabs' | 'list' | 'table' | 'image' | 'file'  | 'checkbox' | 'form' | 'time' | 'buttons' | 'range' | 'acardion'
export type AI_optionKey = (
    'attrs' | 'text' | 'value' | 'disabled' | 'checkIcon' | 'checked' | 'before' | 'after' | 'justify' | 'subtext' | 'onClick' | 
    'className' |  'style' |  'tagAttrs' | 'tagBefore' | 'tagAfter' | 'close' | 'show' | 'toggleIcon' 
)
export type AI_formNode = {
    field?:string,
    label?:string,
    addressField?:string,
    footer?:RN,
    input?:AI,
    labelAttrs?:any,
    errorAttrs?:any,
    validations?:any[],
    childs?:AI_formNode[],
    dir?:'h' | 'v',//if there is property row or column,
    html?:RN,
    className?:string,
    style?:any,
    attrs?:any,
    show?:boolean | (()=>boolean),
    flex?:number,
    size?:number
}
export type AI_table_column = {
    title?: any,
    value?: any,
    sort?: true | AI_table_sort,
    search?: boolean,
    id?: string,
    _id?: string,
    width?: any,
    minWidth?: any,
    input?: AI,
    onChange?: (newValue: any) => void,
    titleAttrs?:{[key:string]:any} | string,
    template?:string | ((p:{row:any,column:AI_table_column,rowIndex:number})=>RN),
    excel?: string | boolean,
    justify?:boolean,
    cellAttrs?:{[key:string]:any} | ((p:{row:any,rowIndex:number,column:AI_table_column})=>any) | string
}
export type AI_date_unit = 'year' | 'month' | 'day' | 'hour';
export type AI_time_unit = {[key in ('year' | 'month' | 'day' | 'hour' | 'minute' | 'second')]?:boolean}
export type AI = {
    actions?:({[key in keyof AI_option]?:any}[]) | ((row:any,parent:any)=>{[key in keyof AI_option]?:any}[]),
    addText?:RN | ((value:any)=>RN),
    after?: RN | ((p?:any) => RN),
    attrs?: any,
    blurChange?: boolean,
    before?: RN | ((p?:any) => RN),
    body?:(value?:any)=>{attrs?:any,html?:RN},//form,acardion
    caret?: boolean | RN,
    checkIcon?: AI_checkIcon,
    circles?:string[],
    className?:string,
    columnGap?: number,
    columns?: AI_table_column[] | ((p?:any)=>AI_table_column[]),
    count?: number,//list
    data?:any,
    dateAttrs?:(p:{dateArray:number[], isToday:boolean, isActive:boolean, isMatch:(p:any[])=>boolean})=>any,//date
    decay?: number,//list
    delay?: number,
    deSelect?:any,
    disabled?: boolean | any[],
    editable?:boolean,
    end?:number,//range
    endYear?: string | number,//date
    errorAttrs?:any,//form
    excel?: string,
    fetchOptions?:(text:string)=>Promise<any[]>
    fill?:false | AI_fill | ((index:number)=>AI_fill),
    filter?: string[],
    footer?:RN,//form
    getChilds?:(p:{row:any,details:I_treeRowDetails})=>any[],//tree
    getErrors?:(p:string[])=>void,//form
    getValue?: { [key: string]: (p: AI_table_param) => any },
    grooveAttrs?:{[key:string]:any},
    handle?:AI_range_handle,//range
    headerAttrs?: any,
    height?: number | string,
    hideTags?: boolean,
    indent?:number,
    initialDisabled?:boolean,//form
    inputAttrs?: any,
    node?:AI_formNode,//form
    jalali?: boolean,
    justify?: boolean,
    justNumber?: boolean | (string[]),
    label?:string,
    labels?:AI_labels,//range
    labelAttrs?:any,//form
    lang?:'fa' | 'en',//form,
    line?:(index:number,active:boolean)=>{
        attrs?:any,
        html?:RN
    }
    loading?: boolean | RN,
    max?: number,//slider,number
    maxLength?: number,
    min?: number,//slider,number
    move?: any,//list
    multiple?: boolean | number,
    now?:boolean,
    onAdd?: {[key:string]:any} | ((p?:any) => Promise<boolean | void | undefined>),
    onChange?: ((newValue: any, p?: any) => undefined | boolean | void) | ((newValue: any, p?: any) => Promise<undefined | boolean | void>),
    onChangePaging?: (newPaging: AI_table_paging) => void,
    onChangeSort?: (sorts: AI_table_sort[]) => Promise<boolean>,
    onClick?:(e:Event)=>void,
    onRemove?: true | ((p: { row: any, action?: Function, rowIndex?: number,parent?:any }) => Promise<boolean | void>),
    onSwap?: true | ((newValue: any[], startRow: any, endRow: any) => void),
    onSearch?: true | ((searchValue: string) => void),
    open?: boolean,
    options?: any[] | ((p?:any)=>any[]),
    option?:AI_optionProp,
    paging?: AI_table_paging,
    pattern?:string,
    placeholder?: ReactNode,
    popover?: AI_popover,//notice get type from aio popup
    point?:false | AI_point,//range
    preview?:boolean,
    ranges?:[number,string][],
    removeText?:string,
    reverse?:boolean,
    rotate?:number,
    round?:number,
    rowAfter?: (p: { row: any, rowIndex: number }) => RN,
    rowAttrs?: (p: { row: any, rowIndex: number }) => any,
    rowBefore?: (p: { row: any, rowIndex: number }) => RN,
    rowGap?: number,
    rowsTemplate?: (rows: any[]) => RN,
    rowTemplate?: (p: { row: any, rowIndex: number, isLast: boolean }) => RN,
    rtl?: boolean,
    search?: string,
    setChilds?:(p:{row:any,childs:any[],details:I_treeRowDetails})=>void,//tree
    showErrors?:boolean | string,
    size?: number,//list,date
    spin?: boolean,
    start?:number,//range
    startYear?: string | number,//date
    step?:number,//range
    stop?: number,//list
    style?: any,
    swip?: number,
    subtext?: RN | (() => RN),
    text?: RN | (() => RN)
    theme?: string[],//date
    toolbar?: RN | (() => RN),
    toolbarAttrs?: any,
    translate?: (text: string) => string,//date,
    type: AI_type,
    unit?: AI_date_unit | AI_time_unit,
    validations?:any[],
    value?: any,
    vertical?:boolean,
    width?: number | string,
    
}
export type AI_popover = {
    position?:AP_position,
    fitHorizontal?:boolean,
    body?:(close:any)=>RN,
    limitTo?:string,
    fitTo?:string,
    header?:{
        attrs?:any,
        title?:string,
        subtitle?:string,
        onClose?:boolean,
        before?:RN,
        after?:RN
    },
    maxHeight?:number | string,
    pageSelector?:string,
    setAttrs?:(key:'backdrop' | 'modal' | 'header' | 'body' | 'footer')=>any
}
type I_optionDetails = {
    index: number, level?: number, change?: (v: any) => any,mainValue:any,active:boolean,defaultOptionProps?:{[key:string]:any},
    isOpen?:(id:any)=>boolean | undefined,toggle?:()=>void
}
export type AI_optionProp = {[key in AI_optionKey]?:string | ((option:any,details:I_optionDetails)=>any)}
export type AI_table_param = {row:any,column:AI_table_column,rowIndex:number}
export type AI_date_trans = 'Today' | 'Clear' | 'This Hour' | 'Today' | 'This Month' | 'Select Year'

export type AI_point = (index:number,p:any)=>{
    offset?:number,
    html?:RN,
    attrs?:any
}
export type AI_labels = AI_label[]
export type AI_label = {
    list?:number[],
    start?:number,
    end?:number,
    step?:number,
    dynamic?:boolean,
    autoHide?:boolean,
    zIndex?:number,
    setting:(value:number,p:{angle:number,disabled:boolean})=>AI_labelItem
}
export type AI_labelItem = {
    offset?:number,
    fixAngle?:boolean,
    html?:RN
}
export type AI_range_handle = ((value:number,p:any)=>AI_range_handle_config) | false
export type AI_range_handle_config = {
    thickness?:number,
    size?:number,
    color?:string,
    offset?:number,
    sharp?:boolean
}
export type AI_fill = {thickness?:number,color?:string,className?:string,style?:any}
//notice
//use global fixed options in List
//create list document 
//define popover type by aio popup
export type AI_checkIcon = Object | [RN,RN];
export type AI_option = {
    object:any,
    active:boolean,
    show:any,
    checked: boolean,
    checkIcon: AI_checkIcon,
    after: RN | ((p?:any) => RN),
    before: RN | ((p?:any) => RN),
    draggable: boolean,
    text: RN,
    subtext: RN,
    justify: boolean,
    loading: boolean | RN,
    disabled: boolean,
    attrs: any,
    className:string,
    style: any,
    value:any,
    tagAttrs:any,
    tagBefore:any,
    tagAfter:any,
    toggleIcon:boolean | RN[],
    onClick?:(o1:any,o2?:any)=>void,
    close?:boolean,
    level?:number,
    index:number,
    details:I_optionDetails
}
export type AI_optionDic = {[key:string]:AI_option}
export type AI_options = {optionsList:AI_option[],optionsDic:AI_optionDic}
export type AI_getProp_param = { key: string, def?: any, preventFunction?: boolean };
export type AI_getProp = (p: AI_getProp_param) => any;
export type AI_addToAttrs = (attrs: any, p: { className?: string | (any[]), style?: any,attrs?:any }) => any
export type AI_context = {
    rootProps: AI,
    showPassword: boolean,
    setShowPassword: (v?: boolean) => void,
    DragOptions: DragClass,
    datauniqid: string,
    touch: boolean,
    open: boolean,
    click: (e: any, dom: any) => void,
    optionClick: (option: AI_option,p?:any) => void,
    types: AI_types,
    DATE:AIODate,
    options:AI_options,
    error?:string
}
export type AI_types = {
    isMultiple: boolean,
    isInput: boolean,
    isDropdown: boolean,
    hasOption: boolean,
    hasPlaceholder: boolean,
    hasKeyboard: boolean,
    hasText: boolean,
    hasSearch: boolean
}
export type AI_table_sort = {
    active?: boolean, dir?: 'dec' | 'inc', title?: RN, type?: 'string' | 'number', sortId?: string, getValue?: (row: any) => any
}
export type type_table_temp = { start?: any, isInitSortExecuted?: boolean }
export type AI_table_paging = {
    serverSide?: boolean,
    number: number,
    size: number,
    length?: number,
    sizes?: number[]
}
export type AI_table_rows = { rows: any[], searchedRows:any[], sortedRows:any[], pagedRows:any[] }
export type type_table_getCellAttrs = (p: { row: any, rowIndex: number, column: AI_table_column, type: 'title' | 'cell' }) => any;
export type type_table_context = {
    rootProps: AI,
    columns: AI_table_column[],
    ROWS: { rows: any[], searchedRows: any[], sortedRows: any[], pagedRows: any[] },
    add: () => void, remove: (row: any, index: number) => void, search: (searchValue: string) => void,
    exportToExcel: () => void,
    sorts: AI_table_sort[],
    setSorts: (newSorts: AI_table_sort[]) => void,
    sortRows: (rows: any[], sorts: AI_table_sort[]) => any[],
    excelColumns: AI_table_column[],
    getRowAttrs: (row: any, rowIndex: number) => any,
    getCellAttrs: type_table_getCellAttrs,
    getDynamics:any
}
export type AI_Popover_props = {
    getRootProps: () => AI, id: string, toggle: (popover: any) => void,types:AI_types
}
export type type_time_value = { year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number }

export type AI_indent = {size:number,isLastChild:boolean,isFirstChild:boolean,childsLength:number,level:number,index:number,parentIndent?:AI_indent,height:number}

export type I_list_temp = {
    dom:any,
    activeIndex:number,
    interval:any,
    moved:boolean,
    lastY:number,
    deltaY:number,
    so:{ y: number, top: number, newTop?: number, limit: { top: number, bottom: number } }
}

