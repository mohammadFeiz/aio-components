import React, { Component, createRef, useContext } from 'react';
import AIODate from './../aio-date/aio-date';
import RVD from './../react-virtual-dom/react-virtual-dom';
import AIOValidation from "../aio-validation/aio-validation";
import SearchBox from './search-box';
import Layout from './layout';
import { Icon } from '@mdi/react';
import { mdiChevronRight, mdiClose,mdiCircleMedium } from "@mdi/js";
import Table from './table';
import Slider from './../aio-slider/aio-slider';
import AIOSwip from '../aio-swip/aio-swip';
import DatePicker from './datepicker';
import AIContext from './context';
import AIOPopup from './../../npm/aio-popup/aio-popup';
import $ from 'jquery';
import './aio-input.css';


export default class AIOInput extends Component {
    constructor(props) {
        super(props);
        this.dom = createRef();
        this.datauniqid = 'aiobutton' + (Math.round(Math.random() * 10000000));
        this.popup = new AIOPopup();
        this.getPopover = this.handleGetPopover();
        this.state = {
            backdrop:['text','number','textarea','password'].indexOf(props.type) === -1,
        }
    }
    handleGetPopover(){
        let {type,popover,options} = this.props;
        if (type === 'button' && popover) {
            return (dom)=>{
                let {popover,rtl} = this.props;
                let {backdropAttrs,attrs,render,fixStyle,fitHorizontal,position = 'popover',openRelatedTo} = popover;
                return {
                    rtl,position,attrs,backdrop:{attrs:backdropAttrs},id:'popover',
                    popover:{fixStyle,fitHorizontal,getTarget:()=>$(dom.current),openRelatedTo},
                    body:{render:({close})=>render({close})}
                }
            }
        }
        if (type === 'datepicker') { 
            return (dom)=>{
                let {popover,rtl} = this.props;
                let {backdropAttrs,attrs,fixStyle,fitHorizontal,position = 'popover',openRelatedTo} = popover || {}
                return {
                    rtl,position,attrs,id:'popover',
                    body:{render:()=><DatePicker {...this.props}/>},
                    backdrop:{attrs:backdropAttrs},
                    popover:{fixStyle,fitHorizontal,getTarget:()=>$(dom.current),openRelatedTo}
                }
            }
        }
        if (type === 'select' || type === 'multiselect') { 
            return (dom)=>{
                let {popover,rtl} = this.props;
                let {backdropAttrs,attrs,fixStyle,fitHorizontal = type === 'multiselect',header,footer,position = 'popover',openRelatedTo} = popover || {}
                return {
                    rtl,position,attrs,id:'popover',
                    body:{render:()=>{
                        return (
                            <>
                                {header && header}
                                <Options/>
                                {footer && footer} 
                            </>
                            
                        )
                    },attrs:{style:{flexDirection:'column'}}},
                    backdrop:{attrs:backdropAttrs},
                    popover:{fixStyle,fitHorizontal,getTarget:()=>$(dom.current),openRelatedTo}
                }
            }
        }   
        if(type && options && ['text','number','textarea','password'].indexOf(type) !== -1){
            return (dom)=>{
                let {type,popover,rtl} = this.props;
                let {attrs,fixStyle,fitHorizontal = type === 'multiselect',position = 'popover'} = popover
                return {
                    rtl,position,attrs,backdrop:false,body:{render:()=><Options type={type}/>},id:'popover',
                    popover:{fixStyle,fitHorizontal,getTarget:()=>$(dom.current)}
                }
            }
        }
    }
    dragStart(e) { this.dragIndex = parseInt($(e.target).attr('datarealindex')); }
    dragOver(e) { e.preventDefault(); }
    drop(e) {
        e.stopPropagation();
        let { onSwap } = this.props, from = this.dragIndex, dom = $(e.target);
        if (!dom.hasClass('aio-input-option')) { dom = dom.parents('.aio-input-option'); };
        if (!dom.hasClass('aio-input-option')) { return };
        let to = parseInt(dom.attr('datarealindex'));
        if (from === to) { return }
        onSwap(from, to, this.swap)
    }
    swap(arr, from, to) {
        if (to === from + 1) {
            let a = to;
            to = from;
            from = a;
        }
        let Arr = arr.map((o, i) => { o._testswapindex = i; return o })
        let fromIndex = Arr[from]._testswapindex
        Arr.splice(to, 0, { ...Arr[from], _testswapindex: false })
        return Arr.filter((o) => o._testswapindex !== fromIndex)
    }
    toggle(popover) {
        let open = !!this.popup.getModals().length
        let { onToggle } = this.props;
        if (!!popover === !!open) { return }
        if (popover) { 
            this.popup.addModal(popover);
            $('body').addClass('aio-input-open'); 
        }
        else {
            this.popup.removeModal();
            $('body').removeClass('aio-input-open');
            setTimeout(() => $(this.dom.current).focus(), 0)
        }
        if (onToggle) { onToggle(!!popover) }
    }
    getSelectText() {
        let { options = [] } = this.props;
        let value = this.getProp('value');
        let option = options.find((option) => this.getOptionProp(option, 'value') === value);
        if (option === undefined) { return '' }
        return this.getOptionProp(option, 'text', '')
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
            else if (unit === 'hour') { pattern = `{year}${splitter}{month}${splitter}{day} {hour} : 00` }
            return AIODate().getDateByPattern({ date: list, pattern })
        }
        let calendarType = this.getProp('calendarType', 'gregorian')
        return this.getProp('placeholder', calendarType === 'gregorian' ? 'Select Date' : 'انتخاب تاریخ')
    }
    getProp(key, def) {
        let { type, caret,popover } = this.props;
        if(key === 'attrs'){
            if(['text','textarea','number','password','color'].indexOf(type) !== -1){return {}}
        }
        let propsResult = this.props[key] === 'function' ? this.props[key]() : this.props[key];
        if (key === 'caret') { return caret === false?false:(((type === 'button' && popover) || (type === 'select' || type === 'multiselect' || type === 'datepicker')) ? (caret || true) : false )}
        if (key === 'multiple') { return type === 'multiselect' || (type === 'radio' && !!propsResult)}
        if (key === 'text' && propsResult === undefined) {
            if (type === 'select') { return this.getSelectText() }
            if (type === 'datepicker') { return this.getDatepickerText() }
        }
        if (key === 'value') {
            if (this.getProp('multiple')) {
                if (propsResult === undefined) { return [] }
                return !Array.isArray(propsResult) ? [propsResult] : propsResult
            }
            else { return Array.isArray(propsResult) ? propsResult[0] : propsResult }
        }
        propsResult = propsResult === undefined ? def : propsResult;
        return propsResult;
    }
    getOptionProp(option, key, def) {
        if(key === 'onClick'){return option.onClick}
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
            catch {
                prop = prop
            }
        }
        if (typeof prop === 'function') { return prop(option) }
        if (prop !== undefined) { return prop }
        return def
    }
    click(e,dom) {
        let { type, onChange = () => { }, onClick } = this.props;
        if (type === 'checkbox') { onChange(!this.getProp('value')) }
        else if (this.getPopover) {this.toggle(this.getPopover(dom))}
        else if (onClick) { onClick(); }
    }
    optionClick(option) {
        let { onChange = () => { },type } = this.props;
        let Value = this.getProp('value');
        let { value, onClick, close,text } = option;
        if (onClick) { onClick(value, option); }
        else if(type && ['text','number','textarea','password'].indexOf(type) !== -1){onChange(text)}
        else if (this.getProp('multiple')) {
            if (Value.indexOf(value) === -1) { onChange(Value.concat(value), value, 'add') }
            else { onChange(Value.filter((o) => o !== value), value, 'remove') }
        }
        else { onChange(value, option) }
        if (close) { this.toggle(false) }
    }
    getContext() {
        let { backdrop } = this.state;
        return {
            ...this.props,
            popup:this.popup,
            dragStart:this.dragStart.bind(this),
            dragOver:this.dragOver.bind(this),
            drop:this.drop.bind(this),
            click: this.click.bind(this),
            optionClick: this.optionClick.bind(this),
            datauniqid: this.datauniqid,
            getProp: this.getProp.bind(this),
            getOptionProp: this.getOptionProp.bind(this),
            parentDom: this.dom,
            backdrop
        }
    }
    render_button() { return <Layout /> }
    render_file() { return <Layout /> }
    render_select() { return <Layout /> }
    render_multiselect() { return <Multiselect /> }
    render_radio() { return <Layout text={<Options />} /> }
    render_tabs() { return <Layout text={<Options />} /> }
    render_checkbox() { return <Layout /> }
    render_datepicker() { return <Layout /> }
    render_table() { return <Table {...this.props} /> }
    render_text() { return <Layout text={<Input value={this.getProp('value')}/>} /> }
    render_password() { return <Layout text={<Input value={this.getProp('value')}/>} /> }
    render_textarea() { return <Layout text={<Input value={this.getProp('value')}/>} /> }
    render_number() { return <Layout text={<Input value={this.getProp('value')} />} /> }
    render_color() { return <Layout text={<Input value={this.getProp('value')} />} /> }
    render_slider() { return <Layout text={<InputSlider value={this.getProp('value')}/>} /> }
    render_form() { return <Form {...this.props} /> }
    render() {
        let { type } = this.props;
        if (!type || !this['render_' + type]) { return null }
        return (
            <AIContext.Provider value={this.getContext()}>
                {this['render_' + type]()}
                {this.popup.render()}
            </AIContext.Provider>
        )
    }
}
class InputSlider extends Component{
    static contextType = AIContext;
    change(value){
        let {onChange} = this.context;
        if(value.length === 1){onChange(value[0])}
        else {onChange([value[0],value[1]])}
    }
    render(){
        let {getProp} = this.context;
        let value = getProp('value');
        let rtl = getProp('rtl');
        if(!Array.isArray(value)){value = [value]}
        return (
            <Slider
                direction={rtl?'left':'right'}
                showValue={true}
                value={value}
                onChange={this.change.bind(this)}
            />
        )
    }
}
function Multiselect (){
    let { style = {} } = useContext(AIContext);
    return (<div className={'aio-input-multiselect-container'} style={{ width: style.width }}><Layout /><Tags/></div>)
}
function Tags(){
    let {getProp} = useContext(AIContext);
    let value = getProp('value'),rtl = getProp('rtl');
    if(!value.length || getProp('hideTags', false)){return null}
    return <div className={`aio-input-tags${rtl ? ' rtl' : ''}`}>{value.map((o)=><Tag value={o}/>)}</div>
}  
function Tag({value}) {
    let { getProp, getOptionProp:gop,onChange = () => {}} = useContext(AIContext); 
    function getTagByValue(v) {
        let options = getProp('options', [])
        let option = options.find((option) => v === gop(option, 'value'))
        if (option === undefined) { return }
        let disabled = getProp('disabled');
        return {
            option, disabled,
            text: gop(option, 'text'),value: gop(option, 'value'),tagBefore: gop(option, 'tagBefore'),tagAfter: gop(option, 'tagAfter'),tagAttrs: gop(option, 'tagAttrs', {}),
            onRemove: ()=>{if(!disabled){onChange(getProp('value').filter((o) => o !== v))}}
        }
    }
    let {text,disabled,tagAttrs = {},onRemove,tagBefore = <Icon path={mdiCircleMedium} size={0.7}/>,tagAfter } = getTagByValue(value);
    return (
        <div {...tagAttrs} className={'aio-input-tag' + (tagAttrs.className ? ' ' + tagAttrs.className : '') + (disabled ? ' disabled' : '')} style={tagAttrs.style}>
        <div className='aio-input-tag-icon'>{tagBefore}</div>
        <div className='aio-input-tag-text'>{text}</div>
        {tagAfter !== undefined && <div className='aio-input-tag-icon'>{tagAfter}</div>}
        <div className='aio-input-tag-icon'><Icon path={mdiClose} size={0.7} onClick={onRemove}/></div>
        </div>
    )
}

class Input extends Component {
    static contextType = AIContext;
    constructor(props) {
        super(props);
        this.dataUniqId = 'ai' + Math.round(Math.random() * 10000000)
        this.dom = createRef();
        this.container = createRef();
        let {value = ''} = props;
        if(value === null){value = ''}
        this.state = { value, prevValue: value }
    }
    componentDidMount() {
        let { type, min, max, swip } = this.context;
        if (type === 'number' && swip) {
            AIOSwip({
                speedY: 0.2,
                dom: $(this.dom.current),
                start: () => {
                    this.so = this.state.value || 0;
                },
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
        let { type, autoHeight, delay = 400 } = this.props;
        if (type === 'textarea' && autoHeight) {
            let dom = this.dom.current;
            dom.style.height = 'fit-content';
            let scrollHeight = dom.scrollHeight + 'px'
            dom.style.height = scrollHeight;
            dom.style.overflow = 'hidden';
            dom.style.resize = 'none';
        }
        clearTimeout(this.rrt)
        if (this.state.prevValue !== this.props.value) {
            this.rrt = setTimeout(() => this.setState({ value: this.props.value,prevValue:this.props.value }), delay + 10)
        }
    }
    change(value) {
        let { type,getProp } = this.context;
        let onChange = getProp('onChange');
        if(!onChange){return}
        let maxLength = getProp('maxLength', Infinity);
        let justNumber = getProp('justNumber');
        let delay = getProp('delay', 400);
        let filter = getProp('filter', []);

        if (type === 'number') { if (value) { value = +value; } }
        else if (type === 'text' || value === 'textarea') {
            if (value) {
                if (justNumber) {
                    value = value.toString();
                    let lastChar = value[value.length - 1];    
                    if (isNaN(+lastChar)) { value = value.slice(0, value.length - 1) }
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
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.onChange(value);
        }, delay);
    }
    render() {
        let { getProp, type } = this.context;
        let { value = '' } = this.state;
        let attrs = getProp('attrs', {});
        let disabled = getProp('disabled', false);
        let placeholder = getProp('placeholder');
        let spin = getProp('spin');
        this.onChange = getProp('onChange');
        let props = {
            ...attrs, value, type, disabled, ref: this.dom,placeholder,
            className: spin === false ? 'no-spin' : '',
            onChange: (e) => this.change(e.target.value)
        }
        if (typeof this.onChange !== 'function') { return <div className='aio-input-value'>{value}</div> }
        else if (type === 'textarea') { return <textarea {...props} /> }
        else { return (<input {...props} />) }
    }
}



class Form extends Component {
    constructor(props){
        super(props);
        let {value = {},onChange} = props;
        this.state = {initialValue:JSON.stringify(props.model)}
        if(!onChange){
            this.state.value = value;
        }
        this.errors = {}
    }
    getValue(){
        let {onChange} = this.props;
        if(onChange){
            let {value = {}} = this.props;
            return value;
        }
        else{
            let {value} = this.state;
            return value;
        }
    }
    getErrors(){
        return [...Object.keys(this.errors).filter((o)=>!!this.errors[o]).map((o)=>this.errors[o])]
    }
    removeError(field){
        let newErrors = {}
        for(let prop in this.errors){
            if(prop !== field){newErrors[prop] = this.errors[prop]}
        }
        this.errors = newErrors
    }
    setValue(v,field,obj){
        let { onChange } = this.props;
        let value = this.getValue();
        let newValue = this.setValueByField(value, field, v);
        let error = this.getError(obj,v)
        if(error){this.errors[field] = error}
        else {
            this.removeError(field)
        }
        if(onChange){onChange(newValue,this.getErrors())}
        else{this.setState({value:newValue})} 
        
    }
    header_layout() {
        let { header, title, subtitle, headerAttrs = {}, onClose, onBack } = this.props;
        if (!header && !title && !onClose && !onBack) { return false }
        return {
            className: 'aio-input-form-header' + (headerAttrs.className ? ' ' + headerAttrs.className : ''), style: headerAttrs.style,
            row: [
                { show: !!onBack, size: 36, html: <Icon path={mdiChevronRight} size={.8} />, align: 'vh', onClick: () => onBack() },
                {
                    show: !!title,
                    column: [
                        { flex: 1 },
                        { html: title, className: 'aio-input-form-title' },
                        { show: !!subtitle, html: subtitle, className: 'aio-input-form-subtitle' },
                        { flex: 1 }
                    ]
                },
                {flex:1,show:!!title},
                { show:!!header,flex: !!title ? undefined : 1, html: ()=>typeof header === 'function'?header():header,align:'vh' },
                { show: !!onClose, html: <Icon path={mdiClose} size={.8} />, onClick: () => onClose(),className:'aio-input-form-close-icon' }
            ]
        }
    }
    body_layout() {
        let { inputs } = this.props;
        if (Array.isArray(inputs)) {
            inputs = { column: inputs.map((o) => this.input_layout(o)) }
        }
        let res = {
            flex: 1, className: 'aio-input-form-body', ...inputs
        }
        return res
    }
    reset(){
        let {onChange} = this.props;
        let {initialValue} = this.state;
        if(onChange){onChange(JSON.parse(initialValue))}
        else {
            this.setState({value:JSON.parse(initialValue)})
        }
    }
    footer_layout() {
        let { footer, onSubmit, onClose, footerAttrs = {}, closeText = 'Close',resetText='reset',submitText = 'submit',reset } = this.props;
        let {initialValue} = this.state;
        if (footer === false) { return false }
        if (!footer && !onSubmit && !onClose && !reset) { return false }
        let disabled = !!this.getErrors().length || initialValue === JSON.stringify(this.getValue())
        if(footer){
            let html = typeof footer === 'function'?footer({onReset:()=>this.reset(),disabled,errors:this.getErrors()}):footer
            return {
                className: 'aio-input-form-footer' + (footerAttrs.className ? ' ' + footerAttrs.className : ''), style: footerAttrs.style,
                html
            }
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
        return {
            file: [],
            multiselect: [],
            radio: multiple ? [] : undefined,
        }[type]
    }
    getValueByField(field, def) {
        let props = this.props;
        let value = this.getValue();
        let a;
        if (typeof field === 'string') {
            if (field.indexOf('value.') !== -1 || field.indexOf('props.') !== -1) {
                try { eval(`a = ${field}`); }
                catch (err) { a = a; }
            }
            else { a = field }
        }
        else { a = typeof field === 'function' ? field() : field }
        if (a === undefined) { return def }
        return a
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
        let { className,style } = attrs;
        return {
            html: inlineLabel, align: 'v', attrs,style,
            className: 'aio-input-form-inline-label' + (className ? ' ' + className : '')
        }
    }
    label_layout(label, attrs) {
        if (!label) { return false }
        let { className,style } = attrs;
        return {
            html: label, attrs,style,
            className: 'aio-input-form-label' + (className ? ' ' + className : '')
        }
    }
    error_layout(error,attrs){
        if(!error){return false}
        let { className,style } = attrs;
        return { 
            html: error,attrs,style,
            className: 'aio-input-form-error' + (className ? ' ' + className : '')
        }
    }
    componentDidMount(){
        let {onChange = ()=>{}} = this.props;
        onChange(this.getValue(),this.errors)
    }
    getAttrs(propsAttrs = {},ownAttrs = {}){
        let style = {...propsAttrs.style,...ownAttrs.style}
        return {...propsAttrs,...ownAttrs,style}
    }
    input_layout(obj) {
        let {rtl,inputAttrs} = this.props;
        let { label, footer, inlineLabel, input, flex, size,field } = obj;
        let value = this.getValueByField(field, this.getDefault(input));
        let error = this.getError(obj,value)
        if(error){this.errors[field] = error}
        else {this.errors[field] = undefined}
        let labelAttrs = this.getAttrs(this.props.labelAttrs,obj.labelAttrs)
        let errorAttrs = this.getAttrs(this.props.errorAttrs,obj.errorAttrs)
        return {
            flex, size,
            className: 'aio-input-form-item',
            column:[
                {
                    row: [
                        this.inlineLabel_layout(inlineLabel, labelAttrs),
                        {
                            flex: 1,className:'of-visible',
                            column: [
                                this.label_layout(label, labelAttrs),
                                { html: <AIOInput {...inputAttrs} {...input} rtl={rtl} value={value} onChange={(value) => this.setValue(value, field,obj)} /> },
                                { show: !!footer, html: footer },
                            ]
                        }
                    ]
                },
                this.error_layout(error,errorAttrs)
            ]
        }
    }
    getError(o, value, options) {
        let { lang = 'en' } = this.props;
        let { validations = [], input } = o;
        let { type } = input;
        if (!validations.length || type === 'html') { return '' }
        let a = {
            value, title: o.label || o.inlineLabel, lang,
            validations: validations.map((a) => {
                let params = a[2] || {};
                let target = typeof a[1] === 'function' ? a[1] : this.getValueByField(a[1],'' );
                let operator = a[0];
                return [operator, target, params]
            })
        }
        let error = AIOValidation(a);
        return error;
    }
    render() {
        let {rtl,style,className} = this.props;
        return (
            <RVD
                getLayout={(obj, parent = {}) => {
                    let show = this.getValueByField(obj.show, true);
                    if(show === false){return false}
                    if (obj.input) {
                        return this.input_layout({ ...obj,flex:parent.row && !obj.size && !obj.flex?1:undefined })
                    }
                    if(parent.input){
                        obj.className = 'of-visible'
                    }
                    return { ...obj }

                }}
                layout={{
                    style,
                    className: 'aio-input-form' + (rtl?' aio-input-form-rtl':'') + (className?' ' + className:''),
                    column: [
                        this.header_layout(),
                        this.body_layout(),
                        this.footer_layout()
                    ]
                }}
            />
        )
    }
}

class Options extends Component {
    static contextType = AIContext;
    constructor(props) {
        super(props);
        this.state = { searchValue: ''};
    }
    getDefaultOptionChecked(type, value) {
        if (type === 'multiselect' || type === 'radio') {
            let { getProp } = this.context;
            let Value = getProp('value');
            return getProp('multiple') ? Value.indexOf(value) !== -1 : Value === value
        }

    }
    getOptions() {
        let { getProp, getOptionProp, type} = this.context;
        let options = getProp('options', []);
        let result = [];
        let renderIndex = 0;
        let isInput = ['text','number','textarea','password'].indexOf(type) !== -1;
        let Value = getProp('value')
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let show = getOptionProp(option, 'show')
            if (show === false) { continue }
            let text = getOptionProp(option, 'text');
            if(isInput && Value && text.indexOf(Value) !== 0){continue}
            let value = getOptionProp(option, 'value')
            let obj = {
                text,
                value,
                attrs: getOptionProp(option, 'attrs',{}),
                checkIcon: getOptionProp(option, 'checkIcon'),
                checked: getOptionProp(option, 'checked', this.getDefaultOptionChecked(type, value)),
                before: getOptionProp(option, 'before'),
                after: getOptionProp(option, 'after'),
                subtext: getOptionProp(option, 'subtext'),
                attrs: getOptionProp(option, 'attrs'),
                tagAttrs: getOptionProp(option, 'tagAttrs'),
                style: getOptionProp(option, 'style'),
                className: getOptionProp(option, 'className',''),
                onClick: getOptionProp(option, 'onClick'),
                disabled: getProp('disabled') || getOptionProp(option, 'disabled'),
                tagBefore: getOptionProp(option, 'tagBefore'),
                close: getOptionProp(option, 'close', type !== 'multiselect'),
                tagAfter: getOptionProp(option, 'tagAfter'),
                renderIndex, realIndex: i
            }
            if (value === Value) { obj.className += obj.className ? ' active' : 'active' }
            result.push(obj)
            renderIndex++;
        }
        return result;
    }
    renderSearchBox(options) {
        let { search, type,isInput } = this.context;
        if (type === 'tabs' || isInput || search === false) { return null }
        if (type === 'radio' && !search) { return null }
        if (typeof search !== 'string') { search = 'Search' }
        let { searchValue } = this.state;
        if (searchValue === '' && options.length < 10) { return null }
        return <SearchBox value={searchValue} onChange={(text) => this.setState({ searchValue: text })} placeholder={search} />
    }
    Options(options) {
        let { searchValue } = this.state;
        let renderIndex = 0;
        return options.map((option, i) => {
            if (searchValue) {
                if (option.text === undefined || option.text === '') { return null }
                if (option.text.indexOf(searchValue) === -1) { return null }
            }
            let props = { key: i, option, renderIndex, realIndex: i, searchValue, selectedText: this.selectedText }
            return <Layout {...props} />
        });
    }
    render() {
        let { type } = this.context;
        let options = this.getOptions();
        if(!options.length){return null}
        let Options = this.Options(options);
        return (
            <>
                {this.renderSearchBox(options)}
                <div className={`aio-input-options aio-input-${type}-options`}>{Options}</div>
            </>
        )
    }
}



