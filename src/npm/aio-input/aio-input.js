import React, { Component, createRef, useContext, createContext, Fragment, useState, useEffect } from 'react';
import AIODate from './../aio-date/aio-date';
import RVD from './../react-virtual-dom/react-virtual-dom';
import AIOValidation from "../aio-validation/aio-validation";
import Search from '../aio-functions/search';
import ExportToExcel from '../aio-functions/export-to-excel';
import DownloadUrl from '../aio-functions/download-url';
import { Icon } from '@mdi/react';
import { mdiChevronDown, mdiLoading, mdiAttachment, mdiChevronRight, mdiClose, mdiCircleMedium, mdiArrowUp, mdiArrowDown, mdiSort, mdiFileExcel, mdiMagnify, mdiPlusThick, mdiChevronLeft, mdiImage, mdiEye, mdiEyeOff, mdiDownloadOutline } from "@mdi/js";
import AIOSwip from '../aio-swip/aio-swip';
import AIOPopup from './../../npm/aio-popup/aio-popup';
import $ from 'jquery';
import './aio-input.css';
class Popover{
    constructor(getProp,id,toggle,getOptions){
        this.getProp = getProp;
        this.getOptions = getOptions;
        this.toggle = toggle;
        this.type = getProp('type');
        this.id = id;
        this.isActive = this.getIsActive();
        if(this.isActive){
            this.rtl = getProp('rtl')
        }
    }
    getRender = (popover)=>{
        if(this.type === 'button'){return ({close})=>popover.render({close})}
        else if(this.type === 'datepicker'){return ({close})=><DatePicker onClose={close} />}
        else {
            return ({close})=>{
                let options = this.getOptions() || [];
                if(!options.length){return null}
                if(popover.render){return popover.render({close,options})}
                return <Options options={options}/>
            }
        }
    }
    getIsActive = ()=>{
        let options = this.getProp('options');
        let popover = this.getProp('popover');
        if(this.type === 'button'){return !!popover}
        if(this.type === 'datepicker'){return true}
        else if(this.type === 'select'){return true}
        else if(this.type === 'multiselect'){return true}
        else if(this.type === 'text'){return !!options}
        else if(this.type === 'number'){return !!options}
        else if(this.type === 'textarea'){return !!options}
        return false        
    }
    getBackdrop = (popover) => {
        let {backdrop = {}} = popover; 
        let {attrs = {}} = backdrop;
        let {className,style = {}} = attrs;
        let newClassName = ('aio-input-backdrop ' + this.id) + (className?' ' + className:'');
        let newStyle = {...style};
        // if(['text','number','textarea'].indexOf(this.type) !== -1){
        //     newStyle = {...newStyle,background:'none',pointerEvents:'none'}
        // }
        let newAttrs = {...attrs,className:newClassName,style:newStyle}
        return { ...backdrop,attrs: newAttrs }
    }
    getBody = (popover,render)=>{
        let {body = {}} = popover;
        return { ...body,render }
    }
    getPopover = (popover,dom)=>{
        let {fixStyle, fitHorizontal = ['multiselect','text','number','textarea'].indexOf(this.type) !== -1} = popover;
        return {fixStyle, fitHorizontal,pageSelector: '.aio-input-backdrop.' + this.id,getTarget: () => $(dom.current)}
    }
    getAttrs = (popover)=>{
        let {attrs = {}} = popover;
        return { ...attrs, className: 'aio-input-popover' + (attrs.className ? ' ' + attrs.className : '') + (this.rtl ? ' aio-input-popover-rtl' : '') }
    }
    getFn = ()=>{
        if(!this.isActive){return}
        return (dom)=>{
            let popover = this.getProp('popover',{})
            let render = this.getRender(popover);
            let body = this.getBody(popover,render)
            let {rtl,position='popover',header,attrs = {}} = popover;
            return {
                onClose:()=>this.toggle(false),
                rtl,header,position, header,
                backdrop:this.getBackdrop(popover),
                body,
                popover: this.getPopover(popover,dom),
                attrs: this.getAttrs(popover)
            }
        }
    }
    
}
const AICTX = createContext();
export default class AIOInput extends Component {
    constructor(props) {
        super(props);
        this.dom = createRef();
        this.datauniqid = 'aiobutton' + (Math.round(Math.random() * 10000000));
        this.popup = new AIOPopup();
        this.getPopover = new Popover(this.getProp.bind(this),this.datauniqid,this.toggle.bind(this),this.getOptions.bind(this)).getFn();
        this.state = {open:this.getProp('open',false),showPassword:false}
        this.isInput = ['text', 'number', 'textarea', 'password'].indexOf(props.type) !== -1
    }
    dragStart(e) { this.dragIndex = parseInt($(e.target).attr('datarealindex')); }
    dragOver(e) { e.preventDefault(); }
    drop(e) {
        e.stopPropagation();
        let from = this.dragIndex, dom = $(e.target);
        if (!dom.hasClass('aio-input-option')) { dom = dom.parents('.aio-input-option'); };
        if (!dom.hasClass('aio-input-option')) { return };
        let to = parseInt(dom.attr('datarealindex'));
        if (from === to) { return }
        this.getProp('onSwap')(from, to, this.swap)
    }
    swap(arr, from, to) {
        if (to === from + 1) { let a = to; to = from; from = a; }
        let Arr = arr.map((o, i) => { o._testswapindex = i; return o })
        let fromIndex = Arr[from]._testswapindex
        Arr.splice(to, 0, { ...Arr[from], _testswapindex: false })
        return Arr.filter((o) => o._testswapindex !== fromIndex)
    }
    getSelectText() {
        let options = this.getProp('options',[])
        let value = this.getProp('value');
        let option = options.find((option) => {
            if(value === undefined){return false}
            return this.getOptionProp(option, 'value') === value
        });
        if (option === undefined) { return  }
        return this.getOptionProp(option, 'text')
    }
    getDatepickerText() {
        let value = this.getProp('value');
        if (value) {
            let unit = this.getProp('unit', 'day');
            let Pattern = this.getProp('pattern');
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
        let calendarType = this.getProp('calendarType', 'gregorian')
        return this.getProp('placeholder', calendarType === 'gregorian' ? 'Select Date' : 'انتخاب تاریخ')
    }
    getProp(key, def) {
        if(key === 'type'){return this.props.type}
        if(key === 'isInput'){return this.isInput}
        if(key === 'props'){return this.props}
        let { type } = this.props;
        let propsResult = this.props[key] === 'function' ? this.props[key]() : this.props[key];
        if(key === 'after'){
            if(type === 'password' && this.getProp('visible')){
                let {showPassword} = this.state;
                return <div className='align-v' onClick={()=>this.toggleShowPassword()}><Icon path={showPassword?mdiEyeOff:mdiEye} size={.8}/></div>
            }
        }
        if (key === 'caret') { 
            if(propsResult === false){return false}
            if(type === 'button'){return !!this.getProp('popover')}
            if(type === 'select' || type === 'multiselect' || type === 'datepicker'){return propsResult || true}
            if(type === 'text' || type === 'number' || type === 'textarea'){
                let options = this.getProp('options');
                if(options){return propsResult || true}
                else{return false}
            }
            return false;
        }
        if (key === 'multiple') { 
            if(type === 'multiselect'){return true}
            if(type === 'radio'){return !!propsResult}
            if(type === 'slider'){return !!propsResult}
            if(type === 'file'){return !!propsResult}
            return false;
        }
        if (key === 'text' && propsResult === undefined) {
            if (type === 'select') { return this.getSelectText() }
            if (type === 'datepicker') { return this.getDatepickerText() }
        }
        if (key === 'value') {
            if (this.getProp('multiple')) {
                if (propsResult === undefined || propsResult === null) { propsResult = [] }
                if(!Array.isArray(propsResult)){
                    console.error(`aio-input error => in type="${type}" by multiple:true value should be an array but is ${propsResult}`)
                    return [propsResult]
                } 
            }
            else {
                if(Array.isArray(propsResult)){
                    console.error(`aio-input error => in type="${type}" by multiple:false|undefined value cannot be an array`)
                    return propsResult[0]
                }
                
            }
            return propsResult;
        }
        propsResult = propsResult === undefined ? def : propsResult;
        return propsResult;
    }
    getOptionProp(option, key, def) {
        let optionResult = typeof option[key] === 'function' ? option[key](option) : option[key]
        if (optionResult !== undefined) { return optionResult }
        let prop = this.props['option' + key[0].toUpperCase() + key.slice(1, key.length)];
        if (typeof prop === 'string') {
            try {
                let props = this.props;
                let value, evalText = 'value = ' + prop;
                eval(evalText);
                return value;
            }
            catch { prop = prop }
        }
        if (typeof prop === 'function') { return prop(option) }
        if (prop !== undefined) { return prop }
        return def
    }
    toggle(popover,e) {
        let open = !!this.popup.getModals().length
        let onToggle = this.getProp('onToggle');
        if (!!popover === !!open) { return }
        if (popover) {
            this.popup.addModal(popover);
            this.setState({open:true})
        }
        else {
            this.popup.removeModal();
            this.setState({open:false})
            setTimeout(() => $(this.dom.current).focus(), 0)
        }
        if (onToggle) { onToggle(!!popover) }
    }
    click(e, dom) {
        let type = this.getProp('type');
        let onChange = this.getProp('onChange',()=>{});
        let attrs = this.getProp('attrs',{});
        if (type === 'checkbox') { onChange(!this.getProp('value')) }
        else if (this.getPopover) { this.toggle(this.getPopover(dom),e) }
        else if (attrs.onClick) { attrs.onClick(); }
    }
    optionClick(option) {
        let onChange = this.getProp('onChange',()=>{});
        let type = this.getProp('type');
        let Value = this.getProp('value');
        let { value, attrs = {}, close, text } = option;
        if (attrs.onClick) { attrs.onClick(value, option); }
        else if (type && ['text', 'number', 'textarea', 'password'].indexOf(type) !== -1) { onChange(text) }
        else if (this.getProp('multiple')) {
            if (Value.indexOf(value) === -1) { onChange(Value.concat(value), value, 'add') }
            else { onChange(Value.filter((o) => o !== value), value, 'remove') }
        }
        else { onChange(value, option) }
        if (close) { this.toggle(false) }
    }
    toggleShowPassword(){this.setState({showPassword:!this.state.showPassword})}
    getOptions() {
        let getProp = this.getProp.bind(this);
        let getOptionProp = this.getOptionProp.bind(this);
        let type = getProp('type');
        function getDefaultOptionChecked(value) {
            if (type === 'multiselect' || type === 'radio') {
                let Value = getProp('value');
                return getProp('multiple') ? Value.indexOf(value) !== -1 : Value === value
            }
        }
        let options = getProp('options', []);
        let result = [];
        let renderIndex = 0;
        let Value = getProp('value')
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let show = getOptionProp(option, 'show')
            if (show === false) { continue }
            let text = getOptionProp(option, 'text');
            if (
                getProp('isInput') && 
                Value && text.toString().indexOf(Value.toString()) !== 0
            ) { continue }
            let value = getOptionProp(option, 'value')
            let attrs = getOptionProp(option, 'attrs',{});
            let obj = {
                text, value,
                checkIcon: getOptionProp(option, 'checkIcon'),
                checked: getOptionProp(option, 'checked', getDefaultOptionChecked(value)),
                before: getOptionProp(option, 'before'),
                after: getOptionProp(option, 'after'),
                center: getOptionProp(option, 'center'),
                subtext: getOptionProp(option, 'subtext'),
                disabled: getOptionProp(option, 'disabled'),
                attrs,
                tagAttrs: getOptionProp(option, 'tagAttrs'),
                tagBefore: getOptionProp(option, 'tagBefore'),
                close: getOptionProp(option, 'close', type !== 'multiselect'),
                tagAfter: getOptionProp(option, 'tagAfter'),
                renderIndex, realIndex: i
            }
            if (value === Value) { obj.className += obj.className ? ' active' : 'active' }////notice
            result.push(obj)
            renderIndex++;
        }
        return result;
    }
    getContext() {
        return {
            ...this.props,
            getOptions:this.getOptions.bind(this),
            open:this.state.open,
            toggleShowPassword:this.toggleShowPassword.bind(this),
            showPassword:this.state.showPassword,
            popup: this.popup,
            dragStart: this.dragStart.bind(this),
            dragOver: this.dragOver.bind(this),
            drop: this.drop.bind(this),
            click: this.click.bind(this),
            optionClick: this.optionClick.bind(this),
            datauniqid: this.datauniqid,
            getProp: this.getProp.bind(this),
            getOptionProp: this.getOptionProp.bind(this),
            parentDom: this.dom,
        }
    }
    D2S(n) { n = n.toString(); return n.length === 1 ? '0' + n : n }
    render_button() { return <Layout /> }
    render_list() {
        return <List getProp={this.getProp.bind(this)} getOptionProp={this.getOptionProp.bind(this)} />
    }
    render_time() {
        let year = this.getProp('year');
        let month = this.getProp('month');
        let day = this.getProp('day');
        let hour = this.getProp('hour');
        let minute = this.getProp('minute');
        let popover = this.getProp('popover',{});
        let onChange = this.getProp('onChange');
        let attrs = this.getProp('attrs',{});
        let { attrs: popoverAttrs = {} } = popover;
        let text = [];
        let dateArray = [];
        if (year) { dateArray.push(this.D2S(year)) }
        if (month) { dateArray.push(this.D2S(month)) }
        if (day) { dateArray.push(this.D2S(day)) }
        if (dateArray.length) { text.push(dateArray.join('/')) }
        if (hour !== undefined) { text.push(`${this.D2S(hour)} : ${this.D2S(minute === undefined ? 0 : minute)}`) }
        return (
            <AIOInput
                caret={false} center={true}
                text={text.join(' ')}
                {...this.props}
                attrs={{...attrs,style:{...attrs.style, direction: 'ltr'}}}
                type='button'
                popover={!onChange ? undefined : {
                    position: 'center', ...popover,
                    attrs: { ...popoverAttrs, className: 'aio-input-time-popover' + (popoverAttrs.className ? ' ' + popoverAttrs.className : '') },
                    render: ({ close }) => {
                        let year = this.getProp('year');
                        let month = this.getProp('month');
                        let day = this.getProp('day');
                        let hour = this.getProp('hour');
                        let minute = this.getProp('minute');
                        let onChange = this.getProp('onChange',()=>{});
                        return (
                            <TimePopover
                                year={year} month={month} day={day} hour={hour} minute={minute}
                                onChange={({ year, month, day, hour, minute }) => onChange({ year, month, day, hour, minute })}
                                onClose={() => close()}
                            />
                        )
                    }
                }}
            />
        )
    }
    render_file() { return <File /> }
    render_select() { return <Layout /> }
    render_multiselect() { return <Multiselect /> }
    render_radio() { return <Layout text={<Options />} /> }
    render_tabs() { return <Layout text={<Options />} /> }
    render_checkbox() { return <Layout /> }
    render_datepicker() { return <Layout /> }
    render_image() { return <Layout text={<Image />} /> }
    render_table() { return <Table getProp={this.getProp.bind(this)} /> }
    render_text() { return <Layout text={<Input/>} /> }
    render_password() { return <Layout text={<Input/>} /> }
    render_textarea() { return <Layout text={<Input/>} /> }
    render_number() { return <Layout text={<Input/>} /> }
    render_color() { return <Layout text={<Input/>} /> }
    render_slider() { return <Layout text={<InputSlider getProp={this.getProp.bind(this)} />} /> }
    render_form() { return <Form getProp={this.getProp.bind(this)} /> }
    render() {
        let type = this.getProp('type');
        let validate = this.getProp('validate',true);
        if(validate){new AIOInputValidate(this.props)}
        if (!type || !this['render_' + type]) { return null }
        return (
            <AICTX.Provider key={this.datauniqid} value={this.getContext()}>
                {this['render_' + type]()}
                {this.popup.render()}
            </AICTX.Provider>
        )
    }
}

function TimePopover(props) {
    let { calendarType, lang = 'fa' } = props;
    let [today] = useState(AIODate().getToday({ calendarType }))
    let [year, setYear] = useState(props.year === true ? today[0] : props.year);
    let [startYear] = useState(year ? year - 10 : undefined);
    let [endYear] = useState(year ? year + 10 : undefined);
    let [month, setMonth] = useState(props.month === true ? today[1] : props.month);
    let [day, setDay] = useState(props.day === true ? today[2] : props.day);
    let [hour, setHour] = useState(props.hour === true ? today[3] : props.hour);
    let [minute, setMinute] = useState(props.minute === true ? today[4] : props.minute);
    function translate(key) {
        return lang === 'fa' ? { 'Year': 'سال', 'Month': 'ماه', 'Day': 'روز', 'Hour': 'ساعت', 'Minute': 'دقیقه', 'Submit': 'ثبت' }[key] : key
    }
    function year_layout(year) {
        if (!year) { return false }
        let options = [];
        for (let i = startYear; i <= endYear; i++) {
            options.push({ text: i, value: i })
        }
        return {
            column: [
                { html: translate('Year'), align: 'vh', size: 36 },
                { html: (<AIOInput type='list' value={year} options={options} size={48} width={72} onChange={(year) => setYear(year)} />) }
            ]
        }
    }
    function month_layout(month) {
        if (!month) { return false }
        return {
            column: [
                { html: translate('Month'), align: 'vh', size: 36 },
                {
                    html: (
                        <AIOInput
                            type='list' value={month}
                            options={
                                new Array(12).fill(0).map((o, i) => {
                                    return { text: i + 1, value: i + 1 }
                                })
                            }
                            size={48} width={72} onChange={(month) => setMonth(month)}
                        />
                    )
                }
            ]
        }
    }
    function day_layout(year, month, day) {
        if (!year || !month || !day) { return false }
        let days = AIODate().getMonthDaysLength({ date: [year, month] })
        if (day > days) { day = 1; }
        return {
            column: [
                { html: translate('Day'), align: 'vh', size: 36 },
                {
                    html: (
                        <AIOInput
                            type='list' value={day}
                            options={
                                new Array(days).fill(0).map((o, i) => {
                                    return { text: i + 1, value: i + 1 }
                                })
                            }
                            size={48} width={72} onChange={(day) => setDay(day)}
                        />
                    )
                }
            ]
        }
    }
    function hour_layout(hour) {
        if (hour === undefined) { return false }
        return {
            column: [
                { html: translate('Hour'), align: 'vh', size: 36 },
                {
                    html: (
                        <AIOInput
                            type='list' value={hour}
                            options={
                                new Array(24).fill(0).map((o, i) => {
                                    return { text: i, value: i }
                                })
                            }
                            size={48} width={72} onChange={(hour) => setHour(hour)}
                        />
                    )
                }
            ]
        }
    }
    function minute_layout(minute) {
        if (minute === undefined) { return false }
        return {
            column: [
                { html: translate('Minute'), align: 'vh', size: 36 },
                {
                    html: (
                        <AIOInput
                            type='list' value={minute}
                            options={
                                new Array(60).fill(0).map((o, i) => {
                                    return { text: i, value: i }
                                })
                            }
                            size={48} width={72} onChange={(minute) => setMinute(minute)}
                        />
                    )
                }
            ]
        }
    }
    return (
        <RVD
            layout={{
                style: { direction: 'ltr' },
                column: [
                    { align: 'h', row: [year_layout(year), month_layout(month), day_layout(year, month, day), hour_layout(hour), minute_layout(minute)] },
                    { size: 12 },
                    {
                        html: <button className='ai-style-3' style={{ height: 36, fontSize: 12 }} onClick={() => {
                            props.onChange({ year, month, day, hour, minute })
                            props.onClose()
                        }}>{translate('Submit')}</button>
                    }
                ]
            }}
        />
    )
}
function Image() {
    let { getProp } = useContext(AICTX);
    let [popup] = useState(new AIOPopup());
    let value = getProp('value', '');
    let [url, setUrl] = useState();
    let dom = createRef()
    let width = getProp('width');
    let height = getProp('height');
    let onChange = getProp('onChange');
    let onRemove = getProp('onRemove');
    let placeholder = getProp('placeholder')
    let preview = getProp('preview')
    // if(typeof value === 'object'){
    //     let fr = new FileReader();
    //     fr.onload = function () {
    //         $(dom.current).attr('src',fr.result)
    //     }
    //     fr.readAsDataURL(value);
    // }
    useEffect(() => {
        if (typeof value === 'object') {
            changeUrl(value)
        }
        else if (typeof value === 'string') {
            if (url !== value) { setUrl(value) }
        }
        else if (url !== false) { setUrl(false) }
    })
    function changeUrl(file, callback = () => { }) {
        try {
            let fr = new FileReader();
            fr.onload = function () {
                if (url !== fr.result) {
                    setUrl(fr.result);
                    callback(fr.result)
                }
            }
            fr.readAsDataURL(file);
        }
        catch { }
    }
    function openPopup() {
        popup.addModal({
            header: {
                title: '',
                onClose: (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    popup.removeModal();
                }
            },
            body: {
                render: () => {
                    let src = $(dom.current).attr('src')
                    return (<div className='aio-input-image-preview-popup'><img src={src} alt='' /></div>)
                }
            }
        })
    }
    let IMG = url ? (
        <>
            <img ref={dom} src={url} alt={''} style={{ objectFit: 'cover' }} width={width} height={height} />
            {onRemove && <div onClick={(e) => { e.stopPropagation(); e.preventDefault(); onRemove() }} className='aio-input-image-remove'><Icon path={mdiClose} size={1} /></div>}
            {preview && <div onClick={(e) => { e.stopPropagation(); e.preventDefault(); openPopup() }} className='aio-input-image-preview'><Icon path={mdiImage} size={1} /></div>}
            {popup.render()}
        </>
    ) : <span className='aio-input-image-placeholder'>{placeholder}</span>
    if (!onChange) {
        return IMG
    }
    return (
        <AIOInput
            type='file' center={true} text={IMG} attrs={{style:{ width: '100%', height: '100%', padding: 0 }}}
            onChange={(files) => {
                let file = files[0].file
                changeUrl(file, (url) => onChange({ file, url }));
            }}
        />
    )
}
function InputSlider() {
    let { getProp } = useContext(AICTX)
    let onChange = getProp('onChange');
    function change(value) {
        if (getProp('multiple')) { onChange([...value]) }
        else { onChange(value[0]) }
    }
    let value = getProp('value'), rtl = getProp('rtl');
    if (!Array.isArray(value)) { value = [value] }
    let attrs = getProp('attrs', {})
    let disabled = getProp('disabled');
    let props = {
        attrs,
        value, rtl, start: getProp('start'), end: getProp('end'), step: getProp('step'), min: getProp('min'), max: getProp('max'),
        direction: getProp('direction', rtl ? 'left' : 'right'), showValue: getProp('showValue'), onChange: disabled || !onChange ? undefined : change,
        pointStyle: getProp('pointStyle'), lineStyle: getProp('lineStyle'), fillStyle: getProp('fillStyle'), getPointHTML: getProp('getPointHTML'),
        labelStep: getProp('labelStep'), editLabel: getProp('editLabel'), editValue: getProp('editValue'), labelRotate: getProp('labelRotate'), labelStyle: getProp('labelStyle'),
        scaleStep: getProp('scaleStep'), scaleStyle: getProp('scaleStyle'), getScaleHTML: getProp('getScaleHTML'),
        valueStyle: getProp('valueStyle')
    }
    return (<Slider {...props} />)
}
function Multiselect() {
    let { getProp } = useContext(AICTX);
    let style = getProp('style',{})
    return (<div className={'aio-input-multiselect-container'} style={{ width: style.width }}><Layout /><Tags /></div>)
}
function Tags() {
    let { getProp } = useContext(AICTX);
    let value = getProp('value'), rtl = getProp('rtl');
    if (!value.length || getProp('hideTags', false)) { return null }
    return <div className={`aio-input-tags${rtl ? ' rtl' : ''}`}>{value.map((o) => <Tag value={o} />)}</div>
}
function Tag({ value }) {
    let { getProp, getOptionProp } = useContext(AICTX);
    let onChange = getProp('onChange',()=>{})
    let options = getProp('options', [])
    let option = options.find((option) => value === getOptionProp(option, 'value'))
    if (option === undefined) { return null }
    let text = getOptionProp(option, 'text');
    let tagAttrs = getOptionProp(option, 'tagAttrs', {});
    let tagBefore = getOptionProp(option, 'tagBefore',<Icon path={mdiCircleMedium} size={0.7} />);
    let tagAfter = getOptionProp(option, 'tagAfter');
    let disabled = getOptionProp(option,'disabled') || getProp('disabled');
    let onRemove = disabled?undefined:() => { onChange(getProp('value').filter((o) => o !== value)) }
    return (
        <div {...tagAttrs} className={'aio-input-tag' + (tagAttrs.className ? ' ' + tagAttrs.className : '') + (disabled ? ' disabled' : '')} style={tagAttrs.style}>
            <div className='aio-input-tag-icon'>{tagBefore}</div>
            <div className='aio-input-tag-text'>{text}</div>
            {tagAfter !== undefined && <div className='aio-input-tag-icon'>{tagAfter}</div>}
            <div className='aio-input-tag-icon'><Icon path={mdiClose} size={0.7} onClick={onRemove} /></div>
        </div>
    )
}
class Input extends Component {
    static contextType = AICTX;
    constructor(props) {
        super(props);
        this.dom = createRef();
        this.container = createRef();
        this.datauniqid = `ac${Math.round(Math.random() * 100000)}`;
        this.state = { value:undefined, prevValue: undefined }
    }
    componentDidMount() {
        let {getProp} = this.context;
        let type = getProp('type')
        let min = getProp('min')
        let max = getProp('max')
        let swip = getProp('swip')
        let value = getProp('value');
        this.setState({value,prevValue:value})
        if (type === 'number' && swip) {
            AIOSwip({
                speedY: 0.2,
                dom: $(this.dom.current),
                start: () => this.so = this.state.value || 0,
                move: ({ dx, dy, dist }) => {
                    let newValue = -dy + this.so
                    if (min !== undefined && newValue < min) { return }
                    if (max !== undefined && newValue > max) { return }
                    this.change(newValue)
                }
            })
        }
    }
    componentDidUpdate() {
        let {getProp} = this.context;
        let type = getProp('type')
        let autoHeight = getProp('autoHeight')
        if (type === 'textarea' && autoHeight) {
            let dom = this.dom.current;
            dom.style.height = 'fit-content';
            let scrollHeight = dom.scrollHeight + 'px'
            dom.style.height = scrollHeight;
            dom.style.overflow = 'hidden';
            dom.style.resize = 'none';
        }
        clearTimeout(this.rrt)
        let propsValue = getProp('value')
        if (this.state.prevValue !== propsValue) {
            this.rrt = setTimeout(() => this.setState({ value: propsValue, prevValue: propsValue }), 0)
        }
    }
    change(value,onChange) {
        let {getProp} = this.context;
        let type = getProp('type')
        let blurChange = getProp('blurChange')
        let maxLength = getProp('maxLength', Infinity);
        let justNumber = getProp('justNumber');
        let delay = getProp('delay', 400);
        let filter = getProp('filter', []);
        if (type === 'number') { if (value) { value = +value; } }
        else if (type === 'text' || type === 'textarea' || type === 'password') {
            if (value) {
                if (justNumber) {
                    value = value.toString();
                    let lastChar = value[value.length - 1];
                    if(lastChar === ' ' || isNaN(+lastChar)){
                        if(Array.isArray(justNumber)){
                            if(justNumber.indexOf(lastChar) === -1){value = value.slice(0, value.length - 1)}
                        }
                        else{value = value.slice(0, value.length - 1) }
                    }
                }
                if (filter.length) {
                    value = value.toString();
                    let lastChar = value[value.length - 1];
                    if (filter.indexOf(lastChar) !== -1) { value = value.slice(0, value.length - 1) }
                }
                if (value.toString().length > maxLength) {
                    value = value.toString().slice(0, maxLength);
                }
            }
        }
        this.setState({ value });
        if (!blurChange) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                onChange(value);
            }, delay);
        }
    }
    blur(onChange) {
        let {getProp} = this.context;
        let blurChange = getProp('blurChange')
        if (!blurChange) { return }
        onChange(this.state.value)
    }
    getInputStyle(inputAttrs){
        let {getProp} = this.context;
        let justify = getProp('justify', false);
        let style = {...inputAttrs.style};
        if(justify){style.textAlign = 'center'}
        return style;
    }
    getInputClassName(inputAttrs = {}){
        let classes = [];
        let {getProp} = this.context;
        let spin = getProp('spin');
        if(spin === false){classes.push('no-spin')}
        if(inputAttrs.className){classes.push(inputAttrs.className)}
        return classes.length?classes.join(' '):'';
    }
    getInputAttrs(){
        let {getProp,showPassword} = this.context;
        let { value = '' } = this.state;
        let type = getProp('type');
        let inputAttrs = getProp('inputAttrs', {});
        let disabled = getProp('disabled');
        let placeholder = getProp('placeholder');
        let onChange = getProp('onChange');
        let loading = getProp('loading');
        let p = {
            ...inputAttrs, value, type, ref: this.dom,
            disabled:!!loading || disabled,
            placeholder,
            style:this.getInputStyle(inputAttrs),
            className: this.getInputClassName(inputAttrs),
            onChange: onChange?(e) => this.change(e.target.value,onChange):undefined,
            onBlur: () => this.blur(onChange)
        }
        if(type === 'color'){
            if(getProp('options')){
                p = {...p,list:this.datauniqid}
            }
        }
        if(type === 'password' && showPassword){p = {...p,type:'text',style:{...p.style,textAlign:'center'}}}
        return p;
    }
    render() {
        let {getProp} = this.context;
        let type = getProp('type');
        let { value = '' } = this.state;
        let attrs = this.getInputAttrs()
        if (!attrs.onChange) { return <div className='aio-input-value'>{value}</div> }
        else if (type === 'color') {
            let options = getProp('options');
            return (
                <label style={{ width: '100%', height: '100%', background: value }}>
                    <input {...attrs} style={{ opacity: 0 }} />
                    {
                        options && 
                        <datalist id={this.datauniqid}>
                            {
                                options.map((o)=>{
                                    return <option value={o}/>
                                })
                            }
                        </datalist>
                    }
                </label>
            )
        }
        else if (type === 'textarea') { return <textarea {...attrs} /> }
        else { return (<input {...attrs} />) }
    }
}
class Form extends Component {
    constructor(props) {
        super(props);
        let {getProp} = props;
        this.getProp = getProp;
        let value = this.getProp('value',{})
        let onChange = this.getProp('onChange')
        this.state = { initialValue: JSON.stringify(value) }
        if (!onChange) {
            this.state.value = value;
        }
        this.errors = {}
    }
    getValue() { return this.getProp('onChange') ? this.getProp('value',{}) : this.state.value }
    getErrors() {
        return [...Object.keys(this.errors).filter((o) => !!this.errors[o]).map((o) => this.errors[o])]
    }
    removeError(field) {
        let newErrors = {}
        for (let prop in this.errors) { if (prop !== field) { newErrors[prop] = this.errors[prop] } }
        this.errors = newErrors
    }
    setValue(v, formItem) {
        let onChange = this.getProp('onChange');
        let { field } = formItem;
        let value = this.getValue();
        let newValue = this.setValueByField(value, field, v);
        let error = this.getError(formItem, v)
        if (error) { this.errors[field] = error }
        else { this.removeError(field) }
        if (onChange) { onChange(newValue, this.getErrors()) }
        else { this.setState({ value: newValue }) }
    }
    header_layout() {
        let header = this.getProp('header');
        let title = this.getProp('title');
        let subtitle = this.getProp('subtitle');
        let headerAttrs = this.getProp('headerAttrs',{});
        let onClose = this.getProp('onClose');
        let onBack = this.getProp('onBack');
        if (!header && !title && !onClose && !onBack) { return false }
        return {
            className: 'aio-input-form-header' + (headerAttrs.className ? ' ' + headerAttrs.className : ''), style: headerAttrs.style,
            row: [
                { show: !!onBack, size: 36, html: <Icon path={mdiChevronRight} size={.8} />, align: 'vh', onClick: () => onBack() },
                {
                    show: !!title, align: 'v',
                    column: [
                        { html: title, className: 'aio-input-form-title' },
                        { show: !!subtitle, html: subtitle, className: 'aio-input-form-subtitle' },
                    ]
                },
                { flex: 1, show: !!title },
                { show: !!header, flex: !!title ? undefined : 1, html: () => typeof header === 'function' ? header() : header, align: 'vh' },
                { show: !!onClose, html: <Icon path={mdiClose} size={.8} />, onClick: () => onClose(), className: 'aio-input-form-close-icon' }
            ]
        }
    }
    body_layout() {
        let inputs = this.getProp('inputs');
        if (Array.isArray(inputs)) { inputs = { column: inputs.map((o) => this.input_layout(o)) } }
        let res = { flex: 1, className: 'aio-input-form-body', ...inputs }
        return res
    }
    reset() {
        let onChange = this.getProp('onChange');
        let { initialValue } = this.state;
        if (onChange) { onChange(JSON.parse(initialValue)) }
        else { this.setState({ value: JSON.parse(initialValue) }) }
    }
    footer_layout() {
        let footer = this.getProp('footer');
        let onSubmit = this.getProp('onSubmit');
        let onClose = this.getProp('onClose');
        let footerAttrs = this.getProp('footerAttrs',{});
        let closeText = this.getProp('closeText','Close');
        let resetText = this.getProp('resetText','Reset');
        let submitText = this.getProp('submitText','Submit');
        let reset = this.getProp('reset');
        let { initialValue } = this.state;
        if (footer === false) { return false }
        if (!footer && !onSubmit && !onClose && !reset) { return false }
        let disabled = !!this.getErrors().length || initialValue === JSON.stringify(this.getValue())
        if (footer) {
            let html = typeof footer === 'function' ? footer({ onReset: () => this.reset(), disabled, errors: this.getErrors() }) : footer;
            let className = 'aio-input-form-footer' + (footerAttrs.className ? ' ' + footerAttrs.className : '');
            return { className, style: footerAttrs.style, html }
        }
        return {
            className: 'aio-input-form-footer' + (footerAttrs.className ? ' ' + footerAttrs.className : ''), style: footerAttrs.style,
            row: [
                { show: !!onClose, html: <button onClick={() => onClose()} className='aio-input-form-close-button aio-input-form-footer-button'>{closeText}</button> },
                { show: !!reset, html: <button onClick={() => this.reset()} className='aio-input-form-reset-button aio-input-form-footer-button'>{resetText}</button> },
                { show: !!onSubmit, html: <button disabled={disabled} onClick={() => onSubmit()} className='aio-input-form-submit-button aio-input-form-footer-button'>{submitText}</button> },
            ]
        }
    }
    getDefault({ type, multiple }) {
        return { file: [], multiselect: [], radio: multiple ? [] : undefined, slider: multiple ? [] : undefined }[type]
    }
    getValueByField(field, def) {
        let props = this.getProp('props'), value = this.getValue(), a;
        if (typeof field === 'string') {
            if (field.indexOf('value.') !== -1 || field.indexOf('props.') !== -1) {
                try { eval(`a = ${field}`); }
                catch (err) { a = a; }
            }
            else { a = field }
        }
        else { a = field }
        return a === undefined ? def : a;
    }
    setValueByField(obj = {}, field, value) {
        field = field.replaceAll('[', '.');
        field = field.replaceAll(']', '');
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
    inlineLabel_layout(inlineLabel, attrs) {
        if (!inlineLabel) { return false }
        let { className, style } = attrs;
        return { html: inlineLabel, align: 'v', attrs, style, className: 'aio-input-form-inline-label' + (className ? ' ' + className : '') }
    }
    label_layout(label, attrs) {
        if (!label) { return false }
        let { className, style } = attrs;
        return { html: label, attrs, style, className: 'aio-input-form-label' + (className ? ' ' + className : '') }
    }
    footer_layout(footer, attrs) {
        if (!footer) { return false }
        let { className, style } = attrs;
        return { html: footer, attrs, style, className: 'aio-input-form-item-footer' + (className ? ' ' + className : '') }
    }
    error_layout(error, attrs) {
        if (!error) { return false }
        let { className, style } = attrs;
        return { html: error, attrs, style, className: 'aio-input-form-error' + (className ? ' ' + className : '') }
    }
    componentDidMount() {
        this.reportErrors()
    }
    componentDidUpdate() {
        this.reportErrors()
    }
    reportErrors() {
        let getErrors = this.getProp('getErrors');
        if (!getErrors) { return }
        let errors = this.getErrors();
        if (JSON.stringify(errors) !== this.reportedErrors) {
            getErrors(errors);
            this.reportedErrors = JSON.stringify(errors)
        }
    }
    getAttrs(propsAttrs = {}, ownAttrs = {}) {
        let style = { ...propsAttrs.style, ...ownAttrs.style }
        return { ...propsAttrs, ...ownAttrs, style }
    }
    getInputProps(input,formItem){
        let rtl = this.getProp('rtl');
        let disabled = this.getProp('disabled');
        let value = this.getValueByField(formItem.field, this.getDefault(input));
        let updateInputProps = this.getProp('updateInputProps',(o)=>o)
        let props = {rtl,value,onChange: (value) => this.setValue(value, formItem)};
        for(let prop in input){
            props[prop] = this.getValueByField(input[prop])
        }
        let {attrs = {}} = input;
        props.attrs = {};
        for(let prop in attrs){
            props.attrs[prop] = this.getValueByField(attrs[prop])
        }
        if(disabled){props.disabled = true;}
        if(['text','number','password','textarea'].indexOf(props.type) !== -1){
            let {inputAttrs = {}} = input;
            props.inputAttrs = {};
            for(let prop in inputAttrs){
                props.inputAttrs[prop] = this.getValueByField(inputAttrs[prop])
            }
        }
        return updateInputProps(props);
    }
    input_layout(formItem) {
        let { label, footer, inlineLabel, input, flex, size, field } = formItem;
        let value = this.getValueByField(field, this.getDefault(input));
        let error = this.getError(formItem, value)
        if (error) { this.errors[field] = error }
        else { this.errors[field] = undefined }
        let labelAttrs = this.getAttrs(this.getProp('labelAttrs'), formItem.labelAttrs)
        let errorAttrs = this.getAttrs(this.getProp('errorAttrs'), formItem.errorAttrs)
        let footerAttrs = this.getAttrs(this.getProp('footerAttrs'), formItem.footerAttrs)
        let inputProps = this.getInputProps(input,formItem);
        return {
            flex, size, className: 'aio-input-form-item',
            column: [
                {
                    className:'of-visible',
                    row: [
                        this.inlineLabel_layout(inlineLabel, labelAttrs),
                        {
                            flex: 1, className: 'of-visible',
                            column: [
                                this.label_layout(label, labelAttrs),
                                { html: <AIOInput {...inputProps} />,className:'of-visible' },
                            ]
                        }
                    ]
                },
                this.footer_layout(footer,footerAttrs),
                this.error_layout(error, errorAttrs)
            ]
        }
    }
    getError(o, value, options) {
        let lang = this.getProp('lang','en')
        let { validations = [], input } = o;
        let { type } = input;
        if (!validations.length || type === 'html') { return '' }
        let a = {
            value, title: o.label || o.inlineLabel, lang,
            validations: validations.map((a) => {
                let params = a[2] || {};
                let target = typeof a[1] === 'function' ? a[1] : this.getValueByField(a[1], '');
                let operator = a[0];
                return [operator, target, params]
            })
        }
        return AIOValidation(a);
    }
    render() {
        let rtl = this.getProp('rtl')
        let attrs = this.getProp('attrs',{})
        let {style, className} = attrs;
        return (
            <RVD
                getLayout={(obj, parent = {}) => {
                    let show = this.getValueByField(obj.show, true);
                    if (show === false) { return false }
                    if (obj.input) { return this.input_layout({ ...obj, flex: parent.row && !obj.size && !obj.flex ? 1 : undefined }) }
                    if (parent.input) { obj.className = 'of-visible' }
                    return { ...obj }
                }}
                layout={{
                    style, className: 'aio-input-form' + (rtl ? ' aio-input-form-rtl' : '') + (className ? ' ' + className : ''),
                    column: [this.header_layout(), this.body_layout(), this.footer_layout()]
                }}
            />
        )
    }
}
function Options(props) {
    let context = useContext(AICTX);
    let {getProp,getOptions} = context;
    let type = getProp('type');
    let [searchValue,setSearchValue] = useState('');
    function renderSearchBox(options) {
        let search = getProp('search');
        if (type === 'tabs' || getProp('isInput') || search === false) { return null }
        if (type === 'radio' && !search) { return null }
        if (typeof search !== 'string') { search = 'Search' }
        if (searchValue === '' && options.length < 10) { return null }
        return (
            <div className='aio-input-search'>
                <input type='text' value={searchValue} placeholder={search} onChange={(e) => setSearchValue(e.target.value)} />
                <div className='aio-input-search-icon' onClick={() => { setSearchValue('') }}>
                    <Icon path={searchValue ? mdiClose : mdiMagnify} size={.8} />
                </div>
            </div>
        )
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
    return (
        <>
            {renderSearchBox(options)}
            <div className={`aio-input-options aio-input-${type}-options`}>{renderOptions}</div>
        </>
    )
}
//column schema
//title,value,width,minWidth,justify,type,onChange,cellAttrs,subtext,before,after
const AITableContext = createContext();
class Table extends Component {
    constructor(p) {
        super(p);
        let {getProp} = p;
        this.getProp = getProp;
        this.dom = createRef();
        let Sort = new SortClass({
            getProp,
            getState: () => this.state,
            setState: (obj) => this.setState(obj),
        })
        let columns = this.getProp('columns',[]);
        let searchColumns = [];
        let updatedColumns = columns.map((o) => {
            let { id = 'aitc' + Math.round(Math.random() * 1000000), sort, search } = o;
            o._id = id;
            sort = sort === true ? {} : sort;
            let column = { ...o, sort };
            if (search) { searchColumns.push(column) }
            return column
        })
        this.state = {
            searchValue: '',
            columns: updatedColumns,
            searchColumns,
            sorts: [], Sort,
            getDynamics: ({ value, row, column, def, rowIndex }) => {
                if (value === undefined) { return def }
                if (typeof value === 'function') { return value({ row, column, rowIndex }) }
                let result = value;
                if (typeof value === 'string') {
                    let getValue = this.getProp('getValue',{});
                    if (getValue[value]) { result = getValue[value]({ row, column, rowIndex }) }
                    else if (value.indexOf('row.') !== -1) { try { eval(`result = ${value}`); } catch { result = '' } }
                }
                return result === undefined ? def : result;
            },
            setRows: (rows) => {
                let onChange = this.getProp('onChange');
                onChange(rows);
            },
            setCell: (row, column, value) => {
                if (column.onChange) { column.onChange({ value, row, column }) }
                else {
                    let { setRows } = this.state;
                    let rows = this.getProp('rows');
                    row = JSON.parse(JSON.stringify(row));
                    eval(`${column.value} = value`);
                    setRows(rows.map((o) => o._id !== row._id ? o : row))
                }
            }
        }
    }
    componentDidMount() {
        let { columns, Sort } = this.state;
        this.setState({ sorts: Sort.initiateSortsByColumns(columns) })
    }
    add() {
        let onAdd = this.getProp('onAdd');
        let rows = this.getProp('rows');
        let { setRows } = this.state;
        if (typeof onAdd === 'function') { onAdd(); }
        else if (typeof onAdd === 'object') { setRows([onAdd, ...rows]) }
    }
    remove(row, index) {
        let rows = this.getProp('rows');
        let onRemove = this.getProp('onRemove');
        let { setRows } = this.state;
        if (typeof onRemove === 'function') { onRemove(row); }
        else if (onRemove === true) { setRows(rows.filter((o, i) => o._id !== row._id)); }
    }
    exportToExcel() {
        let excel = this.getProp('excel'), list = [];
        let rows = this.getProp('rows');
        let { getDynamics, columns } = this.state;
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i], json = {};
            for (let j = 0; j < columns.length; j++) {
                let column = columns[j], { title, excel, value } = column;
                if (excel) { json[typeof excel === 'string' ? excel : title] = getDynamics({ value, row, column, rowIndex: i }) }
            }
            list.push(json)
        }
        ExportToExcel(list, { promptText: typeof excel === 'string' ? excel : 'Inter Excel File Name' })
    }
    dragStart(e, row) { this.start = row; }
    dragOver(e, row) { e.preventDefault(); }
    getIndexById(rows, id) { for (let i = 0; i < rows.length; i++) { if (rows[i]._id === id) { return i } } }
    drop(e, row) {
        if (this.start._id === undefined) { return }
        if (this.start._id === row._id) { return }
        let { setRows } = this.state;
        let rows = this.getProp('rows');
        let onSwap = this.getProp('onSwap');
        let newRows = rows.filter((o) => o._id !== this.start._id);
        let placeIndex = this.getIndexById(rows, row._id);
        newRows.splice(placeIndex, 0, this.start)
        if (typeof onSwap === 'function') { onSwap({ newRows, from: { ...this.start }, to: row }) }
        else { setRows(newRows) }
    }
    getSearchedRows(rows) {
        let onSearch = this.getProp('onSearch');
        if (onSearch !== true) { return rows }
        let { searchColumns, searchValue, getDynamics } = this.state;
        if (!searchColumns.length || !searchValue) { return rows }
        return Search(rows, searchValue, (row, index) => {
            let str = '';
            for (let i = 0; i < searchColumns.length; i++) {
                let column = searchColumns[i];
                let value = getDynamics({ value: column.value, row, def: '', column, rowIndex: index });
                if (value) { str += value + ' ' }
            }
            return str
        })
    }
    getRows() {
        let { Sort } = this.state;
        let rows = this.getProp('rows');
        let p = this.getProp('paging');
        let searchedRows = this.getSearchedRows(rows);
        let sortedRows = Sort.getSortedRows(searchedRows);
        let pagedRows = p && !p.serverSide ? sortedRows.slice((p.number - 1) * p.size, p.number * p.size) : sortedRows;
        return { rows, searchedRows, sortedRows, pagedRows }
    }
    //calculate style of cells and title cells
    getCellStyle({ row, rowIndex, column, type }) {
        let { getDynamics } = this.state;
        let width = getDynamics({ value: column.width });
        let minWidth = getDynamics({ value: column.minWidth });
        let style = { width: width ? width : undefined, flex: width ? undefined : 1, minWidth }
        if (type === 'cell') {
            let cellAttrs = getDynamics({ value: column.cellAttrs, column, row, rowIndex, def: {} });
            return { ...style, ...cellAttrs.style }
        }
        else if (type === 'title') {
            let titleAttrs = getDynamics({ value: column.titleAttrs, column, def: {} });
            return { ...style, ...titleAttrs.style }
        }
    }
    getTitleAttrs(column) {
        let { getDynamics } = this.state;
        let titleAttrs = getDynamics({ value: column.titleAttrs, column, def: {} });
        let justify = getDynamics({ value: column.justify, def: false });
        let className = 'aio-input-table-title' + (justify ? ' aio-input-table-title-justify' : '') + (titleAttrs.className ? ' ' + titleAttrs.className : '')
        let style = this.getCellStyle({ column, type: 'title' })
        let title = getDynamics({ value: column.title, def: '' })
        return { ...titleAttrs, style, className, title }
    }
    getCellAttrs({ row, rowIndex, column }) {
        let { getDynamics } = this.state;
        let cellAttrs = getDynamics({ value: column.cellAttrs, column, row, rowIndex, def: {} });
        let justify = getDynamics({ value: column.justify, row, rowIndex, def: false });
        let className = 'aio-input-table-cell' + (justify ? ' aio-input-table-cell-justify' : '') + (cellAttrs.className ? ' ' + cellAttrs.className : '')
        let style = this.getCellStyle({ row, rowIndex, column, type: 'cell' })
        return { ...cellAttrs, style, className }
    }
    getRowAttrs(row, rowIndex) {
        let onSwap = this.getProp('onSwap');
        let rowAttrs = this.getProp('rowAttrs',()=>{return {}});
        let attrs = rowAttrs({ row, rowIndex });
        let obj = { ...attrs, className: 'aio-input-table-row' + (attrs.className ? ' ' + attrs.className : '') }
        if (!!onSwap) { obj = { ...obj, draggable: true, onDragStart: (e) => this.dragStart(e, row), onDragOver: (e) => this.dragOver(e, row), onDrop: (e) => this.drop(e, row) } }
        return obj;
    }
    getCellContent({ row, rowIndex, column }) {
        let { getDynamics, setCell } = this.state;
        let template = getDynamics({ value: column.template, row, rowIndex, column });
        if (template !== undefined) { return template }
        let p = {
            ...column, blurChange: true,
            value: getDynamics({ value: column.value, row, rowIndex, column }),
            options: getDynamics({ value: column.options, row, rowIndex, column }),
            type: getDynamics({ value: column.type, row, rowIndex, column, def: 'text' }),
            subtext: getDynamics({ value: column.subtext, row, rowIndex, column }),
            before: getDynamics({ value: column.before, row, rowIndex, column }),
            after: getDynamics({ value: column.after, row, rowIndex, column }),
            onChange: column.type ? (value) => setCell(row, column, value) : undefined,
        }
        return <AIOInput {...p} />
    }
    search(searchValue) {
        let onSearch = this.getProp('onSearch');
        if (onSearch === true) { this.setState({ searchValue }) }
        else { onSearch(searchValue) }
    }
    getContext(ROWS) {
        let rowGap = this.getProp('rowGap');
        let columnGap = this.getProp('columnGap');
        let context = {
            ROWS,
            getProp:this.getProp,
            state: { ...this.state },
            parentDom: this.dom,
            SetState: (obj) => this.setState(obj),
            getTitleAttrs: this.getTitleAttrs.bind(this),
            getCellAttrs: this.getCellAttrs.bind(this),
            getRowAttes: this.getRowAttrs.bind(this),
            getCellContent: this.getCellContent.bind(this),
            add: this.add.bind(this),
            remove: this.remove.bind(this),
            search: this.search.bind(this),
            exportToExcel: this.exportToExcel.bind(this),
            RowGap: <div className='aio-input-table-border-h' style={{ height: rowGap }}></div>,
            ColumnGap: <div className='aio-input-table-border-v' style={{ width: columnGap }}></div>,
        }
        return context
    }
    render() {
        let paging = this.getProp('paging');
        let attrs = this.getProp('attrs',{});
        let ROWS = this.getRows();
        return (
            <AITableContext.Provider value={this.getContext(ROWS)}>
                <div {...attrs} ref={this.dom} className={'aio-input-table' + (attrs.className ? ' ' + attrs.className : '')}>
                    <TableToolbar />
                    <div className='aio-input-table-unit'><TableHeader /><TableRows /></div>
                    {paging ? <TablePaging /> : ''}
                </div>
            </AITableContext.Provider>
        )
    }
}
function TablePaging() {
    let { ROWS,getProp } = useContext(AITableContext)
    function fix(paging) {
        let { number, size = 20, length = 0, sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100], serverSide } = paging
        if (!serverSide) { length = ROWS.sortedRows.length }
        if (sizes.indexOf(size) === -1) { size = sizes[0] }
        let pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        let start = number - 3;
        let end = number + 3;
        return { ...paging, length, pages, number, size, sizes, start, end }
    }
    let paging = fix(getProp('paging'))
    function changePaging(obj) { paging.onChange({ ...paging, ...obj }) }
    let { rtl, pages, number, size, sizes, start, end } = paging;
    let buttons = [];
    for (let i = start; i <= end; i++) {
        if (i < 1 || i > pages) {
            buttons.push(<button key={i} className={'aio-input-table-paging-button aio-input-table-paging-button-hidden'}>{i}</button>)
        }
        else {
            buttons.push(<button key={i} className={'aio-input-table-paging-button' + (i === number ? ' active' : '')} onClick={() => changePaging({ number: i })}>{i}</button>)
        }
    }
    return (
        <div className='aio-input-table-paging' style={{ direction: rtl ? 'rtl' : 'ltr' }}>
            {buttons}
            {
                sizes.length &&
                <AIOInput
                    className='aio-input-table-paging-button aio-input-table-paging-size'
                    type='select' value={size} options={sizes} optionText='option' optionValue='option'
                    onChange={(value) => changePaging({ size: value })}
                />
            }
        </div>
    )
}
function TableRows() {
    let { getProp, ROWS } = useContext(AITableContext)
    let rowTemplate = getProp('rowTemplate');
    let rowAfter = getProp('rowAfter',() => null);
    let rowBefore = getProp('rowBefore',() => null);
    function getContent() {
        let rows = ROWS.pagedRows;
        let rowsTemplate = getProp('rowsTemplate');
        if (rowsTemplate) {return rowsTemplate(rows)}
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
        let placeholder = getProp('placeholder','there is not any items');
        return <div style={{ width: '100%', textAlign: 'center', padding: 12, boxSizing: 'border-box' }}>{placeholder}</div>
    }
    return <div className='aio-input-table-rows'>{getContent()}</div>
}
function TableToolbar() {
    let { add, exportToExcel, RowGap, getProp, state, search } = useContext(AITableContext);
    let toolbarAttrs = getProp('toolbarAttrs',{});
    let toolbar = getProp('toolbar');
    let onAdd = getProp('onAdd');
    let excel = getProp('excel');
    let onSearch = getProp('onSearch');
    let { sorts } = state;
    if (!onAdd && !excel && !toolbar && !onSearch && !sorts.length) { return null }
    return (
        <>
            <div {...toolbarAttrs} className={'aio-input-table-toolbar' + (toolbarAttrs.className ? ' ' + toolbarAttrs.className : '')}>
                {toolbar && <div className='aio-input-table-toolbar-content'>{typeof toolbar === 'function' ? toolbar() : toolbar}</div>}
                <div className='aio-input-table-search'>
                    {!!onSearch && <AIOInput type='text' onChange={(value) => search(value)} after={<Icon path={mdiMagnify} size={1} />} />}
                </div>
                {state.Sort.getSortButton()}
                {!!excel && <div className='aio-input-table-toolbar-icon' onClick={() => exportToExcel()}><Icon path={mdiFileExcel} size={0.8} /></div>}
                {!!onAdd && <div className='aio-input-table-toolbar-icon' onClick={() => add()}><Icon path={mdiPlusThick} size={0.8} /></div>}

            </div>
            {RowGap}
        </>
    )
}
function TableHeader() {
    let { RowGap, getProp, state } = useContext(AITableContext);
    let headerAttrs = getProp('headerAttrs',{});
    let onRemove = getProp('onRemove');
    let { columns } = state;
    let Titles = columns.map((o, i) => <TableTitle key={o._id} column={o} isLast={i === columns.length - 1} />);
    let RemoveTitle = !onRemove ? null : <button className='aio-input-table-remove'></button>;
    let className = 'aio-input-table-header' + (headerAttrs.className ? ' ' + headerAttrs.className : '');
    return (<><div {...{ ...headerAttrs, className }}>{Titles}{RemoveTitle}{RowGap}</div></>)
}
function TableTitle({ column, isLast }) {
    let { ColumnGap, getTitleAttrs } = useContext(AITableContext);
    let attrs = getTitleAttrs(column);
    return (
        <>
            <div {...attrs}>{attrs.title}</div>
            {!isLast && ColumnGap}
        </>
    )
}
function TableRow({ row, isLast, rowIndex }) {
    let { remove, RowGap, getProp, state, getRowAttes } = useContext(AITableContext);
    function getCells() {
        return state.columns.map((column, i) => {
            let key = row._id + ' ' + column._id;
            let isLast = i === state.columns.length - 1;
            return (<TableCell isLast={isLast} key={key} row={row} rowIndex={rowIndex} column={column} />)
        })
    }
    let onRemove = getProp('onRemove');
    return (
        <>
            <div key={row._id} {...getRowAttes(row, rowIndex)}>
                {getCells(row, rowIndex)}
                {onRemove ? <button className='aio-input-table-remove' onClick={() => remove(row)}><Icon path={mdiClose} size={0.8} /></button> : null}
            </div>
            {!isLast && RowGap}
        </>
    )
}
const TableCell = ({ row, rowIndex, column, isLast }) => {
    let context = useContext(AITableContext);
    let { ColumnGap, getCellAttrs, getCellContent } = context;
    let content = getCellContent({ row, rowIndex, column });
    return (
        <Fragment key={row._id + ' ' + column._id}>
            <div {...getCellAttrs({ row, rowIndex, column })} >{content}</div>
            {!isLast && ColumnGap}
        </Fragment>
    )

}
class SortClass {
    constructor({ getProp, getState, setState }) {
        this.getProp = getProp;
        this.getState = getState;
        this.setState = setState;
    }
    setSort = (sortId, changeObject) => {
        let { sorts } = this.getState();
        let newSorts = sorts.map((sort) => {
            if (sort.sortId === sortId) {
                let newSort = { ...sort, ...changeObject }
                return newSort;
            }
            return sort
        });
        this.setSorts(newSorts)
    }
    setSorts = async (sorts) => {
        let onChangeSort = this.getProp('onChangeSort');
        if (onChangeSort) {
            let res = await onChangeSort(sorts)
            if (res !== false) { this.setState({ sorts }); }
        }
        else {
            this.setState({ sorts });
            let activeSorts = sorts.filter((sort) => sort.active !== false);
            if (activeSorts.length) {
                let { setRows } = this.getState();
                let rows = this.getProp('rows');
                setRows(this.sort(rows, activeSorts))
            }
        }
    }
    getSortedRows = (rows) => {
        if (this.initialSort) { return rows }
        let onChangeSort = this.getProp('onChangeSort');
        let { setRows, sorts } = this.getState();
        if (onChangeSort) { return rows }
        let activeSorts = sorts.filter((sort) => sort.active !== false);
        if (!activeSorts.length) { return rows }
        if (rows.length) { this.initialSort = true; setRows(this.sort(rows, activeSorts)) }
        else { return rows; }
    }
    sort = (rows = [], sorts = []) => {
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
    initiateSortsByColumns = (columns) => {
        let { getDynamics } = this.getState();
        let sorts = [];
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            let { sort, _id, type } = column;
            if (!sort) { continue }
            let { active = true, dir = 'dec' } = sort;
            let getValue = (row) => {
                let value = getDynamics({ value: column.value, row, column })
                if (type === 'datepicker') { value = AIODate().getTime(value); }
                return value
            }
            sorts.push({ dir, title: sort.title || column.title, sortId: _id, active, type, getValue })
        }
        return sorts;
    }
    getSortOption = (sort) => {
        let { active, dir = 'dec', title, sortId } = sort;
        return {
            text: title, checked: !!active, close: false,
            after: (
                <Icon
                    path={dir === 'dec' ? mdiArrowDown : mdiArrowUp} size={0.8}
                    onClick={(e) => { e.stopPropagation(); this.setSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' }) }}
                />
            ),
            onClick: () => this.setSort(sortId, { active: active ? false : true })
        }
    }
    getSortButton() {
        let { sorts } = this.getState();
        if (!sorts.length) { return null }
        let sortOptions = sorts.map((sort) => this.getSortOption(sort));
        return (
            <AIOInput
                popover={{
                    header: <div style={{ padding: '6px 12px' }}>sort</div>,
                    pageSelector: '.aio-input-table'
                }}
                key='sortbutton' caret={false} type='select' options={sortOptions} className='aio-input-table-toolbar-icon'
                text={<Icon path={mdiSort} size={0.7} />}
                onSwap={(from, to, swap) => this.setSorts(swap(sorts, from, to))}
            />
        )
    }
}
class Layout extends Component {
    static contextType = AICTX;
    constructor(p) {
        super(p);
        this.dom = createRef()
    }
    getClassName(label) {
        let { getProp, getOptionProp, datauniqid } = this.context;
        let { option } = this.props;
        let cls;
        let attrs;
        if (option !== undefined) {
            cls = `aio-input-option aio-input-${this.type}-option`
            if (getProp('multiple')) { cls += ` aio-input-${this.type}-multiple-option` }
            attrs = getOptionProp(option, 'attrs')
        }
        else {
            cls = `aio-input aio-input-${this.type}`;
            if (this.type === 'slider') {
                let direction = getProp('direction', 'right')
                if (direction === 'left' || direction === 'right') { cls += ' aio-input-slider-horizontal' }
                else { cls += ' aio-input-slider-vertical' }
            }
            if (getProp('disabled') || getProp('loading')) { cls += ' disabled' }
            attrs = getProp('attrs');
            let rtl = getProp('rtl');
            if (rtl) { cls += ' aio-input-rtl' }

        }
        cls += ' ' + datauniqid;
        cls += label ? ' has-label' : '';
        cls += attrs && attrs.className ? ' ' + attrs.className : '';
        return cls;
    }
    getProps() {
        let { dragStart, dragOver, drop, click, optionClick,open,getProp } = this.context;
        let { option, realIndex, renderIndex } = this.props;
        let { label, center, loading, attrs = {},disabled } = this.properties;
        let zIndex = 0;
        if(open && !option && ['text','number','textarea'].indexOf(this.type) !== -1){
            zIndex = 100000
        }
        let props = {
            ...attrs,
            className: this.getClassName(label),
            onClick: loading || disabled ? undefined : (option === undefined ? (e) => { e.stopPropagation(); click(e, this.dom) } : (e) => { e.stopPropagation(); optionClick(option) }),
            ref: this.dom, disabled, style: {justifyContent: center ? 'center' : undefined, ...attrs.style,zIndex}, 'data-label': label
        }
        if (option && getProp('onSwap')) {
            props.datarealindex = realIndex;
            props.datarenderindex = renderIndex;
            props.onDragStart = dragStart;
            props.onDragOver = dragOver;
            props.onDrop = drop;
            props.draggable = true;
        }
        return props;
    }
    getDefaultChecked() {
        let { getProp } = this.context;
        if (this.type === 'checkbox') { return !!getProp('value') }
    }
    getProperties() {
        let { option, text } = this.props;

        if (!option) {
            let { getProp } = this.context;
            let properties = {
                label: getProp('label'),
                tabIndex: getProp('tabIndex'),
                attrs: getProp('attrs', {}),
                caret: getProp('caret'),
                text: text !== undefined ? text : getProp('text'),
                checkIcon: getProp('checkIcon', []),
                disabled: getProp('disabled'),
                checked: getProp('checked', this.getDefaultChecked()),
                before: getProp('before'),
                placeholder:getProp('placeholder'),
                after: getProp('after'),
                subtext: getProp('subtext'),
                center: getProp('center'),
                loading: getProp('loading')
            }
            return properties
        }
        return option
    }
    getItemClassName(key) {
        let { option } = this.props;
        return `aio-input-${key} aio-input-${option ? `${this.type}-option` : this.type}-${key}`
    }
    text_layout(text,subtext,placeholder,center){
        if(text === undefined && placeholder !== undefined){text = <div className='aio-input-placeholder'>{placeholder}</div>}
        let style = { flex: center ? 'none' : undefined };
        if(text){
            if(subtext){
                return (
                    <div className={`aio-input-content aio-input-${this.type}-content`} style={style}>
                        <div className={this.getItemClassName('value')}>{text}</div>
                        <div className={this.getItemClassName('subtext')}>{subtext}</div>
                    </div>
                )
            }
            else{return <div className={this.getItemClassName('value')} style={style}>{text}</div>}
        }
        else{return <div className='flex-1'></div>}
    }
    render() {
        let {getProp} = this.context;
        this.type = getProp('type')
        let { option } = this.props;
        this.properties = this.getProperties()
        let { checked, checkIcon, before, text, subtext, after, caret,center, placeholder, loading } = this.properties;
        let content = (
            <>
                <CheckIcon {...{ checked, checkIcon, type:this.type, option }} />
                {before !== undefined && <div className={this.getItemClassName('before')}>{before}</div>}
                {this.text_layout(text,subtext,placeholder,center)}
                {after !== undefined && <div className={this.getItemClassName('after')}>{after}</div>}
                {loading && <div className={this.getItemClassName('loading')}>{loading === true ? <Icon path={mdiLoading} spin={0.3} size={.8} /> : loading}</div>}
                {caret && <div className='aio-input-caret'>{caret === true ? <Icon path={mdiChevronDown} size={.8} /> : caret}</div>}
            </>
        )
        let props = this.getProps();
        if (this.type === 'file') { return (<label {...props}>{content}<InputFile /></label>) }
        return (<div {...props}>{content}</div>)
    }
}
class CheckIcon extends Component {
    static contextType = AICTX;
    render() {
        let { gap } = this.context;
        let { checked, checkIcon = [] } = this.props;
        if (checked === undefined) { return null }
        if (typeof checkIcon === 'function') {
            return (
                <>
                    {checkIcon(checked)}
                    <div className='aio-input-gap' style={{ width: gap }}></div>
                </>
            )
        }
        let [outerSize, innerSize, stroke, outerColor = 'dodgerblue', innerColor = outerColor, round = false] = checkIcon;
        return (
            <>
                <div
                    className={'aio-input-check-out' + (checked ? ' checked' : '') + (round ? ' round' : '')}
                    style={{ color: outerColor, width: outerSize, height: outerSize, border: `${stroke}px solid` }}
                >
                    {
                        checked &&
                        <div
                            className={'aio-input-check-in' + (round ? ' round' : '')}
                            style={{ background: innerColor, width: innerSize, height: innerSize }}
                        ></div>}
                </div>
                <div className='aio-input-gap' style={{ width: gap }}></div>
            </>
        );
    }
}
function File() {
    let { getProp } = useContext(AICTX);
    let attrs = getProp('attrs',{})
    return (<div className='aio-input-file-container'><Layout /><FileItems /></div>)
}
export class InputFile extends Component {
    static contextType = AICTX;
    change(e) {
        let { getProp } = this.context;
        let value = getProp('value',[]);
        let onChange = getProp('onChange',()=>{});
        let multiple = getProp('multiple');
        let Files = e.target.files;
        let result;
        if(multiple){
            result = [...value];
            let names = result.map(({ name }) => name);
            for (let i = 0; i < Files.length; i++) {
                let file = Files[i];
                if (names.indexOf(file.name) !== -1) { continue }
                result.push({ name: file.name, size: file.size, file })
            }
        }
        else {
            result = Files.length?Files[0]:undefined
        }
        onChange(result)
    }
    render() {
        let { getProp } = this.context;
        let multiple = getProp('multiple');
        let loading = getProp('loading');
        let disabled = getProp('disabled');
        let props = { disabled:disabled || loading, type: 'file', style: { display: 'none' }, multiple, onChange: (e) => this.change(e) }
        return <input {...props} />
    }
}
export class FileItems extends Component {
    static contextType = AICTX;
    render() {
        let { getProp } = this.context;
        let value = getProp('value'), rtl = getProp('rtl');
        let files = [];
        if(Array.isArray(value)){files = value}
        else if(value){files = [value]}
        else{return null}
        if(!files.length){return null}
        return (
            <div className='aio-input-files' style={{ direction: rtl ? 'rtl' : 'ltr' }}>{files.map((file, i) => <FileItem key={i} file={file} index={i} />)}</div>
        )
    }
}
class FileItem extends Component {
    static contextType = AICTX;
    getFile(file) {
        let filename = file.name || 'untitle';
        let fileSize = file.size || 0;
        let nameLength = 20;
        try {
            let minName, sizeString;
            let lastDotIndex = filename.lastIndexOf('.');
            let name = filename.slice(0, lastDotIndex);
            let format = filename.slice(lastDotIndex + 1, filename.length);
            if (name.length > nameLength) {
                minName = name.slice(0, parseInt(nameLength / 2)) + '...' + name.slice(name.length - parseInt(nameLength / 2), name.length) + '.' + format;
            }
            else { minName = filename; }
            let size = fileSize;
            if(!size){return {minName,sizeString:false}}
            let gb = size / (1024 * 1024 * 1024), mb = size / (1024 * 1024), kb = size / 1024;
            if (gb >= 1) { sizeString = gb.toFixed(2) + ' GB'; }
            else if (mb >= 1) { sizeString = mb.toFixed(2) + ' MB'; }
            else if (kb >= 1) { sizeString = kb.toFixed(2) + ' KB'; }
            else { sizeString = size + ' byte' }
            return { minName, sizeString }
        }
        catch {
            return { minName: 'untitle', sizeString: false }
        }
    }
    remove(index) {
        let {getProp} = this.context;
        let onChange = getProp('onChange',()=>{});
        let value = getProp('value',[])
        let newValue = [];
        for (let i = 0; i < value.length; i++) {
            if (i === index) { continue }
            newValue.push(value[i])
        }
        onChange(newValue);
    }
    renderString(minName,sizeString){
        let size;
        if(sizeString === false){size = ''}
        else {size = ` ( ${sizeString})`}
        return `${minName}${size}`
    }
    render() {
        let { file, index } = this.props;
        let { minName, sizeString } = this.getFile(file);
        let {url,name} = file;
        return (
            <div className='aio-input-file' style={{cursor:url?'pointer':'default'}}>
                <div className='aio-input-file-icon'>
                    <Icon path={url?mdiDownloadOutline:mdiAttachment} size={.8} />
                </div>
                <div className='aio-input-file-name' onClick={() => {
                    if(url){DownloadUrl(url, name)} 
                }}>
                    {this.renderString(minName,sizeString)}
                </div>
                <div className='aio-input-file-icon' onClick={() => this.remove(index)}>
                    <Icon path={mdiClose} size={.7} />
                </div>
            </div>
        )
    }
}
const DPContext = createContext();
class DatePicker extends Component {
    static contextType = AICTX;
    render() {
        let { getProp } = this.context,{ onClose } = this.props
        return (<Calendar getProp={getProp} onClose={onClose} />)
    }
}
class Calendar extends Component {
    constructor(props) {
        super(props);
        let { getProp } = props;
        let calendarType = getProp('calendarType','gregorian');
        let value = getProp('value')
        let { getToday, convertToArray, getMonths, getWeekDay } = AIODate();
        let today = getToday({ calendarType });
        if (!value) { value = today }
        let [year, month, day] = convertToArray({ date: value })
        let months = getMonths({ calendarType });
        this.state = {
            activeDate: { year, month, day }, years: this.getYears(), today,
            todayWeekDay: getWeekDay({ date: today }).weekDay,
            months, thisMonthString: months[today[1] - 1],
        }
    }
    translate(text) {
        let { getProp, translate = (text) => text } = this.props;
        let calendarType = getProp('calendarType','gregorian');
        let unit = getProp('unit','day');
        if (text === 'Today') {
            if (unit === 'month') { text = 'This Month' }
            else if (unit === 'hour') { text = 'This Hour' }
        }
        let obj = { 'Clear': 'حذف', 'This Hour': 'ساعت کنونی', 'Today': 'امروز', 'This Month': 'ماه جاری', }
        let res = text;
        if (calendarType === 'jalali' && obj[text]) { res = obj[text] }
        return translate(res)
    }
    changeActiveDate(obj) {
        let newActiveDate;
        if (obj === 'today') {
            let { today } = this.state;
            let { getProp } = this.props;
            let unit = getProp('unit','day');
            let [year, month, day] = today;
            newActiveDate = { year, month, day: unit === 'month' ? 1 : day };
        }
        else { newActiveDate = { ...this.state.activeDate, ...obj } }
        this.setState({ activeDate: newActiveDate })
    }
    getYears() {
        let start, end;
        let { getProp } = this.props;
        let calendarType = getProp('calendarType','gregorian');
        let startYear = getProp('startYear','-20');
        let endYear = getProp('endYear','+10'); 
        let today = AIODate().getToday({ calendarType });
        if (typeof startYear === 'string' && startYear.indexOf('-') === 0) {
            start = today[0] - parseInt(startYear.slice(1, startYear.length));
        }
        else { start = parseInt(startYear); }
        if (typeof endYear === 'string' && endYear.indexOf('+') === 0) {
            end = today[0] + parseInt(endYear.slice(1, endYear.length));
        }
        else { end = parseInt(endYear); }
        let years = [];
        for (var i = start; i <= end; i++) { years.push(i); }
        return years;
    }
    getPopupStyle() {
        let { getProp } = this.props;
        let disabled = getProp('disabled');
        let size = getProp('size',180);
        let theme = getProp('theme',[])
        return {
            width: size, fontSize: size / 17, background: theme[1], color: theme[0], stroke: theme[0],
            cursor: disabled === true ? 'not-allowed' : undefined,
        };
    }
    getContext() {
        let {getProp} = this.props;
        return {
            ...this.state,
            getProp,
            changeActiveDate: this.changeActiveDate.bind(this),
            translate: this.translate.bind(this),
            SetState: (obj) => this.setState(obj),
            onChange: ({ year, month, day, hour }) => {
                let { getProp,onClose } = this.props;
                let calendarType = getProp('calendarType','gregorian');
                let unit = getProp('unit','day');
                let onChange = getProp('onChange',()=>{});
                let close = getProp('close');
                let value = getProp('value')
        
                let { months } = this.state;
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
    }
    render() {
        return (
            <DPContext.Provider value={this.getContext()}>
                <div className='aio-input-datepicker-container' style={{ display: 'flex' }}>
                    <div className='aio-input-datepicker-calendar' style={this.getPopupStyle()}>
                        <DPHeader /><DPBody /><DPFooter />
                    </div>
                    <DPToday />
                </div>
            </DPContext.Provider>
        );
    }
}
class DPToday extends Component {
    static contextType = DPContext;
    render() {
        let { getProp, translate, today, todayWeekDay, thisMonthString } = this.context;
        let theme = getProp('theme',[])
        let calendarType = getProp('calendarType','gregorian');
        let unit = getProp('unit','day');
        let size = getProp('size',180);
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
}
class DPFooter extends Component {
    static contextType = DPContext;
    render() {
        let { getProp, changeActiveDate, translate } = this.context;
        let onClear = getProp('onClear');
        let disabled = getProp('disabled');
        let size = getProp('size',180);
        if (disabled) { return null }
        let buttonStyle = { padding: `${size / 20}px 0` };
        return (
            <div className='aio-input-datepicker-footer' style={{ fontSize: size / 13 }}>
                {onClear && <button style={buttonStyle} onClick={() => onClear()}>{translate('Clear')}</button>}
                <button style={buttonStyle} onClick={() => changeActiveDate('today')}>{translate('Today')}</button>
            </div>
        )
    }
}
class DPBody extends Component {
    static contextType = DPContext;
    getStyle() {
        let { getProp } = this.context;
        let size = getProp('size',180)
        let calendarType = getProp('calendarType','gregorian');
        let unit = getProp('unit','day');
        var columnCount = { hour: 4, day: 7, month: 3 }[unit];
        var rowCount = { hour: 6, day: 7, month: 4 }[unit];
        var padding = size / 18, fontSize = size / 15,
            a = (size - padding * 2) / columnCount;
        var rowHeight = { hour: size / 7, day: a, month: size / 6, year: size / 7 }[unit];
        var gridTemplateColumns = '', gridTemplateRows = '';
        for (let i = 1; i <= columnCount; i++) {
            gridTemplateColumns += a + 'px' + (i !== columnCount ? ' ' : '')
        }
        for (let i = 1; i <= rowCount; i++) {
            gridTemplateRows += (rowHeight) + 'px' + (i !== rowCount ? ' ' : '')
        }
        let direction = calendarType === 'gregorian' ? 'ltr' : 'rtl';
        return { gridTemplateColumns, gridTemplateRows, direction, padding, fontSize }
    }
    render() {
        let { getProp, activeDate } = this.context;
        let unit = getProp('unit','day');
        return (
            <div className='aio-input-datepicker-body' style={this.getStyle()}>
                {unit === 'hour' && new Array(24).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year, activeDate.month, activeDate.day, i]} />)}
                {unit === 'day' && <DPBodyDay />}
                {unit === 'month' && new Array(12).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year, i + 1]} />)}
            </div>
        )
    }
}
class DPBodyDay extends Component {
    static contextType = DPContext;
    render() {
        let { getProp, activeDate } = this.context;
        let theme = getProp('theme',[])
        let calendarType = getProp('calendarType','gregorian');
        let firstDayWeekDayIndex = AIODate().getWeekDay({ date: [activeDate.year, activeDate.month, 1] }).index;
        var daysLength = AIODate().getMonthDaysLength({ date: [activeDate.year, activeDate.month] });
        let weekDays = AIODate().getWeekDays({ calendarType });
        return (<>
            {weekDays.map((weekDay, i) => <DPCell_Weekday key={'weekday' + i} weekDay={weekDay} />)}
            {new Array(firstDayWeekDayIndex).fill(0).map((o, i) => <div key={'space' + i} className='aio-input-datepicker-space aio-input-datepicker-cell' style={{ background: theme[1] }}></div>)}
            {new Array(daysLength).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year, activeDate.month, i + 1]} />)}
            {new Array(42 - (firstDayWeekDayIndex + daysLength)).fill(0).map((o, i) => <div key={'endspace' + i} className='aio-input-datepicker-space aio-input-datepicker-cell' style={{ background: theme[1] }}></div>)}
        </>)
    }
}
class DPCell_Weekday extends Component {
    static contextType = DPContext;
    render() {
        let { getProp, translate } = this.context;
        let theme = getProp('theme',[])
        let calendarType = getProp('calendarType','gregorian');
        let { weekDay } = this.props;
        return (
            <div className='aio-input-datepicker-weekday aio-input-datepicker-cell' style={{ background: theme[1], color: theme[0] }}>
                <span>{translate(weekDay.slice(0, calendarType === 'gregorian' ? 2 : 1))}</span>
            </div>
        )
    }
}
class DPCell extends Component {
    static contextType = DPContext;
    getClassName(isActive, isToday, isDisabled, className) {
        var str = 'aio-input-datepicker-cell';
        if (isDisabled) { str += ' aio-input-datepicker-disabled' }
        if (isActive) { str += ' aio-input-datepicker-active'; }
        if (isToday) { str += ' today'; }
        if (className) { str += ' className'; }
        return str;
    }
    render() {
        let { getProp, translate } = this.context;
        let disabled = getProp('disabled')
        let dateAttrs = getProp('dateAttrs')
        let theme = getProp('theme',[])
        let onChange = getProp('onChange', () => { })
        let value = getProp('value');
        let calendarType = getProp('calendarType','gregorian');
        let unit = getProp('unit','day');
        let { dateArray } = this.props;
        let { isEqual, isMatch, getMonths, getToday } = AIODate();
        let isActive = !value ? false : AIODate().isEqual(dateArray, value);
        let isToday = isEqual(dateArray, getToday({ calendarType }))
        let isDisabled = typeof disabled === 'boolean' ? disabled : isMatch({ date: dateArray, matchers: disabled })//notice
        let Attrs = {}
        if (dateAttrs) { Attrs = dateAttrs({ dateArray, isToday, isDisabled, isActive, isMatch: (o) => isMatch({ date: dateArray, matchers: o }) }) || {} }
        let className = this.getClassName(isActive, isToday, isDisabled, Attrs.className);
        let onClick = isDisabled ? undefined : () => { onChange({ year: dateArray[0], month: dateArray[1], day: dateArray[2], hour: dateArray[3] }, true) };
        let style = {}
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
}
class DPHeader extends Component {
    static contextType = DPContext;
    getYears() {
        let { activeDate, years, changeActiveDate } = this.context;
        let props = {
            value: activeDate.year, options: years.map((y)=>{return {text:y.toString(),value:y}}),
            onChange: (year) => { changeActiveDate({ year }) }
        }
        return (<DPHeaderDropdown {...props} />)
    }
    getMonths() {
        let { getProp, activeDate, changeActiveDate, months, translate } = this.context;
        let calendarType = getProp('calendarType','gregorian');
        let props = {
            value: activeDate.month, onChange: (month) => { changeActiveDate({ month }) },
            options: months.map((o, i) => { return { value: i + 1, text: translate(calendarType === 'gregorian' ? o.slice(0, 3) : o) } })
        }
        return (<DPHeaderDropdown {...props} />)
    }
    getDays() {
        let { activeDate, changeActiveDate } = this.context;
        let daysLength = AIODate().getMonthDaysLength({ date: [activeDate.year, activeDate.month] });
        let options = new Array(daysLength).fill(0).map((o, i) => { return { text: (i + 1).toString(), value: i + 1 } })
        let props = { value: activeDate.day, options, onChange: (day) => changeActiveDate({ day }) }
        return (<DPHeaderDropdown {...props} />)
    }
    render() {
        let { getProp} = this.context;
        let size = getProp('size',180)
        let unit = getProp('unit','day');
        return (
            <div className='aio-input-datepicker-header' style={{ height: size / 4 }}>
                <DPArrow type='minus' />
                <div className='aio-input-datepicker-select' style={{ fontSize: Math.floor(size / 12) }}>
                    {this.getYears()}
                    {unit !== 'month' ? this.getMonths() : null}
                    {unit === 'hour' ? this.getDays() : null}
                </div>
                <DPArrow type='plus' />
            </div>
        )
    }
}
class DPHeaderDropdown extends Component {
    static contextType = DPContext;
    render() {
        //این شرط فقط در حالت سال رخ میدهد در شرایطی که فقط یک سال قابل انتخاب است
        let {value,options,onChange} = this.props;
        if (this.props.options.length === 1) { return this.props.options[0] }
        let { getProp } = this.context;
        let size = getProp('size',180)
        let theme = getProp('theme',[])
        let props = {
            value,options,onChange, search: false,
            caret: false, type: 'select',
            attrs:{
                className: 'aio-input-datepicker-dropdown'
            },
            optionAttrs:{
                style: { height: size / 6, background: theme[1], color: theme[0] }
            }
        }
        return (<AIOInput {...props} />)
    }
}
class DPArrow extends Component {
    static contextType = DPContext;
    change() {
        let { getProp, years, changeActiveDate, activeDate } = this.context;
        let calendarType = getProp('calendarType','gregorian');
        let unit = getProp('unit','day');
        let { type } = this.props;
        let offset = (calendarType === 'gregorian' ? 1 : -1) * (type === 'minus' ? -1 : 1);
        let date = [activeDate.year, activeDate.month, activeDate.day]
        let next = AIODate().getByOffset({ date, offset, unit: { 'hour': 'day', 'day': 'month', 'month': 'year' }[unit] })
        if (next[0] > years[years.length - 1] || next[0] < years[0]) { return }
        if (unit === 'month') { changeActiveDate({ year: next[0] }) }
        if (unit === 'day') { changeActiveDate({ year: next[0], month: next[1] }) }
        if (unit === 'hour') { changeActiveDate({ year: next[0], month: next[1], day: next[2] }) }
    }
    getIcon() {
        let { getProp } = this.context, { type } = this.props;
        let theme = getProp('theme',[])
        return <Icon path={type === 'minus' ? mdiChevronLeft : mdiChevronRight} size={1} style={{ color: theme[0] }} />
    }
    render() {
        let { size } = this.context;
        return (<div className='aio-input-datepicker-arrow' style={{ width: size / 6, height: size / 6 }} onClick={() => this.change()}>{this.getIcon()}</div>)
    }
}
const SliderContext = createContext();
export class Slider extends Component {
    constructor(props) {
        super(props);
        var { direction } = this.props;
        this.touch = 'ontouchstart' in document.documentElement;
        if (direction === 'left') {
            this.getDiff = function (x, y, client) { return x - client.x; }; this.oriention = 'horizontal';
        }
        else if (direction === 'right') {
            this.getDiff = function (x, y, client) { return client.x - x; }; this.oriention = 'horizontal';
        }
        else if (direction === 'top') {
            this.getDiff = function (x, y, client) { return y - client.y; }; this.oriention = 'vertical'; this.flexDirection = 'column-reverse';
        }
        else {
            this.getDiff = function (x, y, client) { return client.y - y; }; this.oriention = 'vertical'; this.flexDirection = 'column';
        }
        this.dom = createRef();
        this.state = {
            isDown: false,
        }
    }
    getClient(e) { return this.touch ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY } }
    getPercentByValue(value, start, end) { return 100 * (value - start) / (end - start); } //getPercentByValue
    fix(number) {
        let dotPos = this.props.step.toString().indexOf('.');
        let a = dotPos === -1 ? 0 : this.props.step.toString().length - dotPos - 1;
        return parseFloat((number).toFixed(a));
    }
    getStartByStep(start, step) {
        var a = Math.round((start - step) / step) * step;
        while (a < start) { a += step; } return a;
    }
    eventHandler(selector, event, action, type = 'bind') {
        var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" };
        event = this.touch ? me[event] : event;
        var element = typeof selector === "string" ? (selector === "window" ? $(window) : $(selector)) : selector;
        element.unbind(event, action);
        if (type === 'bind') { element.bind(event, action) }
    }
    getValidValue() {
        let { value, start, end, min = start, max = end, step } = this.props;
        for (var i = 0; i < value.length; i++) {
            var point = value[i];
            point = Math.round((point - start) / step) * step + start;
            if (point < min) { point = min; }
            if (point > max) { point = max; }
            value[i] = point;
        }
        return value
    }
    getOffset(x, y, size, e) {
        var { start, end, step } = this.props, client = this.getClient(e);
        return Math.round((end - start) * this.getDiff(x, y, client) / size / step) * step;
    }
    getValue(value, param = this.props) { return typeof value === 'function' ? value(param) : value; }
    getPercents() {
        var { start, end } = this.props;
        var percents = this.value.map((o, i) => [
            this.getPercentByValue(i ? this.value[i - 1] : start, start, end),
            this.getPercentByValue(o, start, end)
        ]);
        percents.push([percents[percents.length - 1][1], 100])
        return percents;
    }
    decreaseAll(step = this.props.step) {
        var start = this.props.start;
        var { min = start } = this.props;
        var offset = Math.min(step, this.value[0] - this.getValue(min));
        for (var i = 0; i < this.value.length; i++) {
            this.value[i] -= offset;
            this.value[i] = this.fix(this.value[i])
        }
        this.moved = true;
    }
    increaseAll(step = this.props.step) {
        var end = this.props.end;
        var { max = end } = this.props;
        var offset = Math.min(step, this.getValue(max) - this.value[this.value.length - 1]);
        for (var i = 0; i < this.value.length; i++) {
            this.value[i] += offset;
            this.value[i] = this.fix(this.value[i])
        }
        this.moved = true;
    }
    mouseDown(e, index, type) {
        e.preventDefault();
        var { start, end, min = start, max = end, onChange, disabled } = this.props;

        if (!onChange || disabled) { return }
        var { x, y } = this.getClient(e), dom = $(this.dom.current);
        var pointContainers = dom.find('.aio-slider-point-container');
        var size = dom.find('.aio-slider-line')[this.oriention === 'horizontal' ? 'width' : 'height']();
        var length = this.value.length;

        this.eventHandler('window', 'mousemove', $.proxy(this.mouseMove, this));
        this.eventHandler('window', 'mouseup', $.proxy(this.mouseUp, this));

        this.moved = false;
        this.setState({ isDown: true });
        pointContainers.css({ zIndex: 10 });

        if (type === 'point') {
            let pointContainer = pointContainers.eq(index);
            pointContainer.css({ zIndex: 100 });
            pointContainer.find('.aio-slider-point').addClass('active');
            var current = this.value[index];
            var before = index === 0 ? min : this.value[index - 1];
            var after = index === this.value.length - 1 ? max : this.value[index + 1]
            this.startOffset = {
                x, y, size, index: [index], value: [current],
                startLimit: before - current, endLimit: after - current,
            }
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

            if (index === 0) { this.decreaseAll(); }
            else if (index === length) { this.increaseAll(); }
            if (index === 0 || index === length) {
                this.startOffset = {
                    x, y, size,
                    index: this.value.map((o, i) => i), value: this.value.map((o) => o),
                    startLimit: min - this.value[0], endLimit: max - this.value[length - 1],
                }
            }
            else {
                var point1 = this.value[index - 1], point2 = this.value[index];
                var before = index === 1 ? min : this.value[index - 2];//مقدار قبلی رنج
                var after = index === length - 1 ? max : this.value[index + 1]; //مقدار بعدی رنج
                this.startOffset = {
                    x, y, size, index: [index - 1, index],
                    value: [point1, point2], startLimit: before - point1, endLimit: after - point2,
                }
            }
        }
    }

    mouseMove(e) {
        let { onChange } = this.props;
        var { x, y, size, value, startLimit, endLimit, index } = this.startOffset;
        var offset = this.getOffset(x, y, size, e);
        if (offset < startLimit) { offset = startLimit; }
        else if (offset > endLimit) { offset = endLimit; }
        for (var i = 0; i < value.length; i++) {
            let Index = index[i], Value = value[i], newValue = parseFloat(Value) + offset;
            if (this.value[Index] === newValue) { return; }
            this.value[Index] = this.fix(newValue);
        }
        this.moved = true;
        onChange(this.value, true);
    }
    mouseUp() {
        this.eventHandler('window', 'mousemove', this.mouseMove, 'unbind');
        this.eventHandler('window', 'mouseup', this.mouseUp, 'unbind');
        let { onChange } = this.props;
        var points = $(this.dom.current).find('.aio-slider-point');
        points.removeClass('active');
        this.setState({ isDown: false });
        if (this.moved) { onChange(this.value, false); }
    }
    getContext() {
        return {
            ...this.props,
            touch: this.touch,
            fix: this.fix.bind(this),
            oriention: this.oriention,
            getValue: this.getValue.bind(this),
            isDown: this.state.isDown,
            mouseDown: this.mouseDown.bind(this),
            getStartByStep: this.getStartByStep.bind(this),
            getPercentByValue: this.getPercentByValue.bind(this),
            value: this.value
        };
    }
    getStyle() {
        let { attrs } = this.props;
        let { style = {} } = attrs;
        var obj = { ...style };
        obj = { ...obj };
        obj.direction = 'ltr';
        obj.flexDirection = this.flexDirection;
        return obj
    }
    getClassName() {
        let { attrs, disabled } = this.props, { className } = attrs;
        return `aio-slider ${this.context.oriention}${className ? ' ' + className : ''}${disabled ? ' disabled' : ''}`;
    }
    render() {
        this.value = this.getValidValue();
        this.context = this.getContext();
        var { labelStep, scaleStep, attrs } = this.props;
        var percents = this.getPercents();
        return (
            <SliderContext.Provider value={this.context}>
                <div ref={this.dom} {...attrs} style={this.getStyle()} className={this.getClassName()}>
                    <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <SliderLine />
                        {labelStep && <SliderLabels />}
                        {scaleStep && <SliderScales />}
                        {this.value.map((o, i) => <SliderFill key={i} index={i} percent={percents[i]} />)}
                        <SliderFill key={this.value.length} index={this.value.length} percent={percents[this.value.length]} />
                        {this.value.map((o, i) => <SliderPoint key={i} index={i} percent={percents[i]} />)}
                    </div>
                </div>
            </SliderContext.Provider>
        );
    }
}
Slider.defaultProps = {
    direction: 'right', editLabel: (a) => a, labelStyle: {}, labelRotate: 0,
    value: [0], scaleStyle: {}, style: () => { },
    start: 0, end: 100, step: 1, activegetPointStyle: {}, getText: () => { return '' }, attrs: {},
    pointStyle: {}, lineStyle: {}, fillStyle: {}, valueStyle: {}, textStyle: {}, editValue: (value, index) => value, textStyle: () => { }
}
class SliderLine extends Component {
    static contextType = SliderContext;
    render() {
        var { lineStyle } = this.context;
        return (<div className='aio-slider-line' style={typeof lineStyle === 'function' ? lineStyle(this.context) : lineStyle}></div>)
    }
}
class SliderFill extends Component {
    static contextType = SliderContext;
    getContainerStyle() {
        var { oriention, direction } = this.context, { percent } = this.props;
        var obj = {};
        obj[{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]] = percent[0] + '%';
        if (oriention === 'horizontal') { obj.width = (percent[1] - percent[0]) + '%'; }
        else { obj.height = (percent[1] - percent[0]) + '%'; }
        return obj;
    }

    render() {
        var { mouseDown, rangeEvents = {}, fillStyle, getText, textStyle, touch, value } = this.context;
        var { index } = this.props;
        var containerProps = {
            'data-index': index, className: 'aio-slider-fill-container',
            [touch ? 'onTouchStart' : 'onMouseDown']: (e) => {
                mouseDown(e, index, 'fill')
            },
            style: this.getContainerStyle()
        }
        for (let prop in rangeEvents) {
            containerProps[prop] = () => rangeEvents[prop](index)
        }
        let text = getText(index, this.context);
        let style, active;
        if (typeof fillStyle === 'function') {
            style = fillStyle(index, this.context);
        }
        else {
            if (value.length === 1 && index === 0) {
                style = fillStyle;
                active = true
            }
            if (value.length > 1 && index !== 0 && index !== value.length) {
                style = fillStyle;
                active = true;
            }
        }
        return (
            <div {...containerProps}>
                <div className={'aio-slider-fill' + (active ? ' aio-slider-fill-active' : '')} style={style} data-index={index}></div>
                {text !== undefined && <div className='aio-slider-text' style={textStyle(index)}>{text}</div>}
            </div>
        );
    }
}
class SliderPoint extends Component {
    static contextType = SliderContext;
    getContainerStyle() {
        var { direction } = this.context, { percent } = this.props;
        return {
            [{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]]: percent[1] + '%'
        };
    }
    getValueStyle() {
        var { showValue, isDown, valueStyle } = this.context;
        var { index } = this.props;
        if (showValue === false) { return { display: 'none' } }
        if (showValue === true || showValue === 'inline' || isDown) { return typeof valueStyle === 'function' ? valueStyle(index, this.context) : valueStyle; }
        return { display: 'none' };
    }
    render() {
        var { value, mouseDown, editValue, pointEvents, getPointHTML, pointStyle, touch, fix, showValue } = this.context;
        var { index } = this.props;
        var point = value[index];
        var props = {
            style: this.getContainerStyle(), 'data-index': index, className: 'aio-slider-point-container',
            [touch ? 'onTouchStart' : 'onMouseDown']: (e) => mouseDown(e, index, 'point')
        };
        for (let prop in pointEvents) { props[prop] = () => pointEvents[prop](index) }
        var pointProps = { className: 'aio-slider-point', style: typeof pointStyle === 'function' ? pointStyle(index, this.context) : pointStyle, 'data-index': index };
        var valueProps = {
            style: this.getValueStyle(),
            className: `aio-slider-value ${'aio-slider-value-' + index}` + (showValue === 'inline' ? ' aio-slider-value-inline' : '')
        };
        let html = getPointHTML ? getPointHTML(index, this.context) : '';
        return (
            <div {...props}>
                {showValue !== 'inline' && <div {...pointProps}>{html}</div>}
                <div {...valueProps}>{editValue(fix(point), index)}</div>
            </div>
        );
    }
}
class SliderLabels extends Component {
    static contextType = SliderContext;
    constructor(props) {
        super(props);
        this.dom = createRef();
        $(window).on('resize', this.update.bind(this))
    }
    getLabelsByStep(labelStep) {
        var { start, label = {}, end, getStartByStep } = this.context;
        var Labels = [];
        var value = getStartByStep(start, labelStep);
        var key = 0;
        while (value <= end) {
            Labels.push(
                <SliderLabel key={key} value={value} />
            );
            value += labelStep;
            value = parseFloat(value.toFixed(6))
            key++;
        }
        return Labels;
    }
    getLabels(labelStep) { return labelStep.map((o) => <SliderLabel key={o} value={o} />) }
    update() {
        var container = $(this.dom.current);
        var labels = container.find('.aio-slider-label div');
        if (!labels.length) { return; }
        var { direction, label = {} } = this.context;
        var firstLabel = labels.eq(0);
        var firstLabelThickness = firstLabel.attr('datarotated') === 'yes' ? 'height' : 'width';
        if (direction === 'right') {
            var end = firstLabel.offset().left + firstLabel[firstLabelThickness]();
            for (var i = 1; i < labels.length; i++) {
                var label = labels.eq(i);
                let thickness = label.attr('datarotated') === 'yes' ? 'height' : 'width';
                label.css({ display: 'block' })
                var left = label.offset().left

                var width = label[thickness]();
                if (left < end + 5) {
                    label.css({ display: 'none' })
                }
                else { end = left + width; }
            }
        }
        else if (direction === 'left') {
            var end = firstLabel.offset().left;
            for (var i = 1; i < labels.length; i++) {
                var label = labels.eq(i);
                let thickness = label.attr('datarotated') === 'yes' ? 'height' : 'width';
                label.css({ display: 'block' })
                var left = label.offset().left
                var width = label[thickness]();
                var right = left + width;
                if (right > end - 5) {
                    label.css({ display: 'none' })
                }
                else { end = left; }
            }
        }
    }
    componentDidMount() { this.update() }
    componentDidUpdate() { this.update() }
    render() {
        let { labelStep } = this.context;
        return (
            <div className='aio-slider-labels' ref={this.dom}>
                {Array.isArray(labelStep) ? this.getLabels(labelStep) : this.getLabelsByStep(labelStep)}
            </div>
        );
    }
}
class SliderLabel extends Component {
    static contextType = SliderContext;
    getStyle(rotate) {
        var { start, end, getPercentByValue, direction, labelStyle } = this.context;
        var { value } = this.props;
        var obj = typeof labelStyle === 'function' ? labelStyle(value, this.context) : labelStyle;
        obj = !obj ? {} : { ...obj }
        let key = { right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction];
        obj[key] = getPercentByValue(value, start, end) + '%';
        if (rotate) {
            obj.transform = `rotate(${rotate + 'deg'})`;
            obj.justifyContent = rotate > 0 ? 'flex-start' : 'flex-end'
        }
        return obj;
    }
    click(e) {
        var { onLabelClick } = this.context;
        e.stopPropagation();
        if (!onLabelClick) { return }
        var { value } = this.props;
        onLabelClick(value);
    }
    render() {
        let { editLabel, labelRotate } = this.context;
        let { value } = this.props;
        let rotate = typeof labelRotate === 'function' ? labelRotate(value) : labelRotate;
        let text;
        try { text = editLabel(value) }
        catch { text = '' }
        return (
            <div onClick={this.click.bind(this)} style={this.getStyle(rotate)} className={`aio-slider-label`}>
                <div datarotated={rotate ? 'yes' : 'no'} className='aio-slider-label-text'>{text}</div>
            </div>
        );
    }
}
class SliderScales extends Component {
    static contextType = SliderContext;
    getScalesByStep(scaleStep) {
        var { start, end, getStartByStep } = this.context;
        var value = getStartByStep(start, scaleStep);
        var key = 0, scales = [];
        while (value <= end) {
            scales.push(<SliderScale value={value} key={key} />);
            value += scaleStep;
            key++;
        }
        return scales;
    }
    getScales(scaleStep) { return scaleStep.map((o) => <SliderScale value={o} key={o} />) }
    render() {
        let { scaleStep } = this.context;
        let scales = Array.isArray(scaleStep) ? this.getScales(scaleStep) : this.getScalesByStep(scaleStep)
        return (<div className='aio-slider-scales'>{scales}</div>);
    }
}
class SliderScale extends Component {
    static contextType = SliderContext;
    getStyle() {
        var { scaleStyle } = this.context;
        var { start, end, direction, getPercentByValue } = this.context, { value } = this.props;
        var obj = typeof scaleStyle === 'function' ? scaleStyle(value, this.context) : scaleStyle;
        obj = !obj ? {} : { ...obj }
        if (!obj) { obj = {} }
        obj[{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]] = getPercentByValue(value, start, end) + '%';
        return obj;
    }
    render() {
        let { getScaleHTML } = this.context, { value } = this.props;
        return (<div className="aio-slider-scale" style={this.getStyle()}>{getScaleHTML && getScaleHTML(value)}</div>);
    }
}
class List extends Component {
    constructor(props) {
        super(props);
        let {getProp,getOptionProp} = props;
        this.getProp = getProp;
        this.getOptionProp = getOptionProp;
        this.touch = 'ontouchstart' in document.documentElement;
        this.dom = createRef();
        let count = this.getProp('count',3);
        let move = this.getProp('move');
        if (move) { move(this.move.bind(this)) }
        this.state = { count }
    }
    eventHandler(selector, event, action, type = 'bind') {
        var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" };
        event = this.touch ? me[event] : event;
        var element = typeof selector === "string" ? (selector === "window" ? $(window) : $(selector)) : selector;
        element.unbind(event, action);
        if (type === 'bind') { element.bind(event, action) }
    }
    getClient(e) {
        try {
            return this.touch && e.changedTouches
                ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
                : [e.clientX, e.clientY];
        }
        catch {
            return this.touch && e.changedTouches
                ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
                : [e.clientX, e.clientY];
        }
    }
    getStyle() {
        let size = this.getProp('size',48);
        let width = this.getProp('width',200);
        var { count } = this.state;
        var height = count * (size);
        return { width, height }
    }
    getOptions() {
        let size = this.getProp('size',48);
        let options = this.getProp('options',[]);
        let propsValue = this.getProp('value');
        this.activeIndex = 0;
        return options.map((option, i) => {
            let value = this.getOptionProp(option, 'value');
            let text = this.getOptionProp(option, 'text', '');
            let style = this.getOptionProp(option, 'style', {});
            if (value === propsValue) { this.activeIndex = i; }
            return <div key={i} dataindex={i} className='aio-input-list-option' style={{ height: size, ...style }}>{text}</div>
        })
    }
    getIndexByTop(top) {
        let size = this.getProp('size',48);
        var { count } = this.state;
        return Math.round(((count * size) - size - (2 * top)) / (2 * size));
    }
    getTopByIndex(index) {
        var { size } = this.props;
        var { count } = this.state;
        return (count - 2 * index - 1) * size / 2;
    }
    getContainerStyle() {
        var style = {
            top: this.getTopByIndex(this.activeIndex)
        };
        return style;
    }

    moveDown() {
        let options = this.getProp('options',[]);
        if (this.activeIndex >= options.length - 1) { return }
        this.activeIndex++;
        var newTop = this.getTopByIndex(this.activeIndex);
        this.setStyle({ top: newTop });
        this.setBoldStyle(this.activeIndex);
    }
    setBoldStyle(index) {
        $(this.dom.current).find('.aio-input-list-option').removeClass('active');
        $(this.dom.current).find('.aio-input-list-option[dataindex=' + (index) + ']').addClass('active');
    }
    moveUp() {
        if (this.activeIndex <= 0) { return }
        this.activeIndex--;
        var newTop = this.getTopByIndex(this.activeIndex);
        this.setStyle({ top: newTop });
        this.setBoldStyle(this.activeIndex);

    }
    keyDown(e) {
        let editable = this.getProp('editable',true);
        if (!editable) { return }
        if (e.keyCode === 38) {
            this.moveUp();
        }
        else if (e.keyCode === 40) {
            this.moveDown();
        }

    }
    getLimit() {
        let options = this.getProp('options',[]);
        return {
            top: this.getTopByIndex(-1),
            bottom: this.getTopByIndex(options.length)
        }
    }
    getTrueTop(top) {
        let options = this.getProp('options',[]);
        let index = this.getIndexByTop(top);
        if (index < 0) { index = 0 }
        if (index > options.length - 1) { index = options.length - 1 }
        return this.getTopByIndex(index);
    }
    mouseDown(e) {
        let options = this.getProp('options',[]);
        let onChange = this.getProp('onChange',()=>{});
        let editable = this.getProp('editable',true);
        if (!editable) { return }
        this.eventHandler('window', 'mousemove', $.proxy(this.mouseMove, this));
        this.eventHandler('window', 'mouseup', $.proxy(this.mouseUp, this));
        clearInterval(this.interval);
        this.moved = false;
        this.isDown = true;
        var [x, y] = this.getClient(e);
        this.setStyle({ transition: 'unset' });
        let top = this.getTop();
        var index = this.getIndexByTop(top);
        this.setBoldStyle(index);
        this.setStyle({ top, transition: 'unset' });
        onChange(options[index].value, index)
        this.so = { y, top, limit: this.getLimit() };
    }
    getTop() {
        var top = parseInt($(this.dom.current).find('.aio-input-list-options').css('top'));
        return this.getTrueTop(top);
    }
    fixTop(value) {
        let { top, bottom } = this.so.limit;
        if (value > top) { return top }
        if (value < bottom) { return bottom }
        return value;
    }
    mouseMove(e) {
        this.moved = true;
        var [x, y] = this.getClient(e);
        var offset = y - this.so.y;
        if (this.lastY === undefined) { this.lastY = y }
        this.deltaY = y - this.lastY;
        this.lastY = y;
        if (Math.abs(offset) < 20) { this.deltaY = 3 }
        var newTop = this.fixTop(this.so.top + offset);
        let index = this.getIndexByTop(newTop);
        this.so.newTop = newTop;
        this.setBoldStyle(index);
        this.setStyle({ top: newTop });
    }
    setStyle(obj) {
        $(this.dom.current).find('.aio-input-list-options').css(obj);
    }
    mouseUp(e) {
        this.eventHandler('window', 'mousemove', this.mouseMove, 'unbind');
        this.eventHandler('window', 'mouseup', this.mouseUp, 'unbind');
        this.isDown = false;
        if (!this.moved) { return }
        this.moved = false;
        this.move(this.deltaY, this.so.newTop)
    }
    move(deltaY, startTop = this.getTop()) {
        let options = this.getProp('options',[]);
        let onChange = this.getProp('onChange',()=>{});
        let decay = this.getProp('decay',8);
        let stop = this.getProp('stop',3);
        if (decay < 0) { decay = 0 }
        if (decay > 99) { decay = 99 }
        decay = parseFloat(1 + decay / 1000)
        this.interval = setInterval(() => {
            startTop += deltaY;
            let index = this.getIndexByTop(startTop);
            if (Math.abs(deltaY) < stop || index < 0 || index > options.length - 1) {
                clearInterval(this.interval);
                if (index < 0) { index = 0 }
                if (index > options.length - 1) { index = options.length - 1 }
                let top = this.getTopByIndex(index);
                this.setBoldStyle(index);
                this.setStyle({ top, transition: '0.3s' });
                onChange(options[index].value, index)
                return;
            }
            deltaY /= decay;
            this.setStyle({ top: startTop });
        }, 20)
    }
    componentDidUpdate() {
        this.setBoldStyle(this.activeIndex);
    }
    componentDidMount() {
        this.setBoldStyle(this.activeIndex);
    }
    render() {
        let attrs = this.getProp('attrs',{});
        var options = this.getOptions();
        return (
            <div
                {...attrs} ref={this.dom} tabIndex={0} 
                className={'aio-input-list' + (attrs.className ? ' ' + attrs.className : '')}
                onKeyDown={(e) => this.keyDown(e)}
                style={{ ...attrs.style, ...this.getStyle() }}
            >
                <div
                    className='aio-input-list-options'
                    style={this.getContainerStyle()}
                    onMouseDown={(e) => this.mouseDown(e)}
                    onTouchStart={(e) => this.mouseDown(e)}
                >{options}</div>
            </div>
        );
    }
}
class AIOInputValidate{
    constructor(props){
        this.props = props;
        let error = this.getError()
        if(error && !$('.aio-popup-alert-container').length){
            let subtext;
            try{
                subtext = JSON.stringify(props);
            }
            catch{
                subtext = '';
            }
            new AIOPopup().addAlert({text:error,type:'error',subtext})
        }
    }
    varTypes = {
        'object':true,'array':true,'string':true,'number':true,'boolean':true,'undefined':true,'any':true,'function':true,'null':true,
    }
    titr = 'aio-input error =>';
    getTypes = ()=>{
        return [
            'text','number','textarea','color','password','file','image','select','multiselect','table','form',
            'time','datepicker','list','checkbox','radio','tabs'
        ]
    }
    getType = (v)=>{
        if(Array.isArray(v)){return 'array'}
        if(v === null){return 'undefined'}
        return typeof v;
    }
    checkTypes = (value,types)=>{
        if(types === 'any'){return}
        types = types.split('|');
        let res;
        let passed = false;
        for(let i = 0; i < types.length; i++){
            let type = types[i];
            let error = this.checkType(value,type,types)
            if(error){res = error}
            else {passed = true}
        }
        if(!passed){return res}
    }
    checkType = (value,type,types)=>{
        let res = false;
        let valueType = this.getType(value);
        if(this.varTypes[type]){
            if(valueType === type){res = true}
        }
        else {
            try{if(value === JSON.parse(type)){res = true}}
            catch{debugger; if(value === JSON.parse(type)){res = true}}
        }
        if(res === false){
            let res;
            try{res = JSON.stringify(value)}
            catch{res = value}
            return `should be ${types.join('|')} but is ${res}`
        }

    }
    getError = ()=>{
        let types = this.getTypes();
        let {type} = this.props;
        if(types.indexOf(type) === -1){return `${this.titr} ${type} is invalid type`}
        let error = this.getMessage(type);
        if(error){return error}
    }
    getValidateObject = (type)=>{
        let dic = {
            text:{
                type:'"text"',
                inputAttrs:"object|undefined",
                justNumber:"boolean|array|undefined",
                value:'string|number|undefined',
                options:'array|undefined',
                maxLength:'number|undefined',
                filter:'array',
                justify:'boolean|undefined',
                loading:'any',
                before:'any',
                after:'any',
                subtext:'number|string|function',
                caret:'any',
                optionText:'any',
                optionValue:'any',
                optionAttrs:'any',
                popover:'object|undefined',
                disabled:'boolean|undefined',
                placeholder:'any',
            },
            textarea:{
                type:'"textarea"',
                value:'string|number|undefined',
                inputAttrs:"object|undefined",
                caret:'any',
                before:'any',
                after:'any',
                subtext:'number|string|function',
                loading:'any',
                maxLength:'number|undefined',
                options:'array|undefined',
                optionText:'any',
                optionValue:'any',
                optionAttrs:'any',
                popover:'object|undefined',
                disabled:'boolean|undefined',
                placeholder:'any',

            },
            number:{
                type:'"number"',
                inputAttrs:"object|undefined",
                value:'""|number|undefined',
                caret:'any',
                before:'any',
                after:'any',
                subtext:'number|string|function',
                options:'array|undefined',
                optionText:'any',
                optionValue:'any',
                optionAttrs:'any',
                justify:'boolean|undefined',
                loading:'any',
                swip:'boolean|undefined',
                popover:'object|undefined',
                disabled:'boolean|undefined',
                placeholder:'any',

            },
            password:{
                type:'"password"',
                inputAttrs:"object|undefined",
                justNumber:"boolean|array|undefined",
                value:'string|number|undefined',
                maxLength:'number|undefined',
                filter:'array',
                justify:'boolean|undefined',
                loading:'any',
                before:'any',
                after:'any',
                subtext:'number|string|function',
                visible:'boolean|undefined',
                disabled:'boolean|undefined',
                placeholder:'any',

            },
            color:{
                type:'"color"',
                inputAttrs:"object|undefined",
                value:'string|number|undefined',
                loading:'any',
                before:'any',
                after:'any',
                subtext:'number|string|function',
                options:'array|undefined',
                optionText:'any',
                optionValue:'any',
                optionAttrs:'any',
                disabled:'boolean|undefined',
            },
            checkbox:{
                type:'"checkbox"',
                text:'any',
                value:'boolean|undefined',
            },
            radio:{
                type:'"radio"',
                options:'array',
                value:'any',
                multiple:'boolean|undefined',
            },
            select:{
                type:'"select"',
                text:'any',
                options:'array',
                value:'number|string|undefined',
                search:'boolean|undefined',
                caret:'any',
                optionAttrs:'function|string|undefined|object',
                before:'any',
                after:'any',
                subtext:'number|string|function',
                loading:'any',
                optionText:'any',
                optionValue:'any',
                optionAttrs:'any',
                popover:'object|undefined',
                disabled:'boolean|undefined',
                placeholder:'any',
            },
            file:{
                type:'"file"',
                text:'any',
                multiple:'boolean',
                value:'any',
                before:'any',
                after:'any',
                subtext:'number|string|function',
                inputAttrs:"object|undefined",
                loading:'any',
                disabled:'boolean|undefined',
            },
            multiselect:{
                type:'"multiselect"',
                before:'any',
                after:'any',
                subtext:'number|string|function',
                text:'any',
                options:'array',
                optionText:'any',
                optionValue:'any',
                optionAttrs:'any',
                value:'array|undefined',
                popover:'object|undefined',
                hideTags:'boolean|undefined',
                search:'boolean|undefined',
                loading:'any',
                caret:'any',
                disabled:'boolean|undefined',
            },
            form:{
                type:'"form"',
                inputs:'object',
                value:'object',
                labelAttrs:'object|function|undefined',
            },
            datepicker:{
                value:'any',
                type:'"datepicker"',
                caret:'any'
            },
            button:{
                caret:'any'
            }
        }
        let privateObject = dic[type];
        if(!privateObject){return}
        let publicObject = {
            attrs:'object|undefined',onChange:'function',rtl:'boolean|undefined',
        }
        return {...publicObject,...privateObject}
    }
    getMessage = (type) => {
        let validProps = this.getValidateObject(type)
        if(!validProps){
            return `${type} validator is not implement`

        }
        for(let prop in this.props){
            if(!validProps[prop]){return `${this.titr} in type="${type}", ${prop} is invalid props`}
            let error = this.checkTypes(this.props[prop],validProps[prop])
            if(error){
                return `${this.titr} in type="${type}", ${prop} props ${error}`
            }
        }
    }
} 