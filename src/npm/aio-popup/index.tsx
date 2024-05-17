import React, { Component, createRef, useEffect, useState, isValidElement, FC, createContext, useContext, useRef, forwardRef, useImperativeHandle } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Icon } from '@mdi/react';
import { mdiClose, mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import $ from 'jquery';
import './index.css';
import { AddToAttrs } from '../aio-utils';
export type AP_props = {rtl?:boolean,id?:string}
export type AP_position = 'fullscreen' | 'center' | 'popover' | 'left' | 'right' | 'top' | 'bottom'
export type AP_attrsKey = 'backdrop'|'modal'|'header'|'body'|'footer';
export type AP_header = ((p:{close:()=>void,state:any,setState:any})=>React.ReactNode) | {
  title?:string,
  subtitle?:string,
  before?:React.ReactNode,
  after?:React.ReactNode,
  onClose?:boolean | ((p:{state:any,setState:(state:any)=>void})=>void),
  attrs?:any
}
export type AP_body = (p:{close:()=>void,state?:any,setState?:(state:any)=>void})=>React.ReactNode
export type AP_footer = (p:{state:any,setState:(v:any)=>void,close:()=>void})=>React.ReactNode
type AP_setAttrs = (mode:AP_attrsKey)=>any
export type AP_modal = {
    getTarget?:()=>any,
    pageSelector?:string,
    limitTo?:string,
    maxHeight?:number | 'string',
    fixStyle?:(o:any,p:{targetLimit:any,pageLimit:any})=>any,
    fitTo?:string,
    rtl?:boolean,
    id?:string,
    onClose?:boolean | (()=>void),
    position?:AP_position,
    header?:AP_header,
    state?:any,
    footer?:AP_footer,
    body?:AP_body,
    animate?:boolean,
    fitHorizontal?:boolean,
    setAttrs?:AP_setAttrs
}
export type AP_alert = { 
  icon?:false | React.ReactNode,
  position?:AP_position,
  type:'success'|'error'|'warning'|'info',
  text?:React.ReactNode,
  subtext?:string,
  time?:number,
  className?:string,
  closeText?:string,
  animate?:boolean
}

export type AP_snackebar = {
  id?:string,
  text:string,
  subtext?:string,
  icon?:React.ReactNode,
  time?:number,
  action?:{text:string,onClick:()=>void},
  type:'success'|'error'|'warning'|'info',
  verticalAlign?:'start' | 'end',
  horizontalAlign?:'start' | 'center' | 'end',
  onClose?:false
  attrs?:any
}
export type AP_confirm = {title?:string,subtitle?:string,text?:React.ReactNode,submitText?:string,canselText?:string,onSubmit?:()=>Promise<boolean>,onCansel?:()=>void,setAttrs?:AP_setAttrs}
export type AP_prompt = {title?:string,subtitle?:string,text?:string,submitText?:string,canselText?:string,onSubmit?:(text:string)=>Promise<boolean>,onCansel?:()=>void,setAttrs?:AP_setAttrs}
export type AP_Snackebar = {getActions:(p:{add:(item:AP_snackebar)=>void})=>void,rtl:boolean}
export type AP_SnackebarItem = {
  item:AP_snackebar,
  onRemove:(id:string)=>void,
  index:number,
  rtl:boolean
}
export default class AIOPopup {
  rtl?: boolean;
  render: () => React.ReactNode;
  addModal: (p: AP_modal) => void;
  addAlert: (p: AP_alert) => void;
  removeModal: (arg?: string) => void;
  addSnackebar: (p: AP_snackebar) => void;
  getModals: () => AP_modal[];
  addConfirm: (p: AP_confirm) => void;
  addPrompt: (p: AP_prompt) => void;
  popupId?: string;
  popupsRef:React.RefObject<typeof Popups>;
  constructor(obj?: AP_props) {
    let { rtl = false } = obj || {}
    this.rtl = rtl;
    this.addSnackebar = () => { };
    this.popupsRef = createRef()
    this.getModals = ()=>{
      let comp:any = this.popupsRef.current
      if(comp === null){return []}
      return comp.getModals() || []
    }
    this.addModal = (modal:AP_modal)=>{
      let comp:any = this.popupsRef.current
      if(comp === null){return}
      comp.addModal(modal)
    }
    this.removeModal = (arg)=>{
      let comp:any = this.popupsRef.current
      if(comp === null){return}
      comp.removeModal(arg)
    }
    this.render = () => {
      let snackebarProps: AP_Snackebar = {rtl,getActions: ({ add }) => this.addSnackebar = add}
      return (<><Popups rtl={rtl} ref={this.popupsRef} /><Snackebar {...snackebarProps} /></>)
    }
    this.addAlert = (obj) => Alert(obj);
    this.addConfirm = (obj: AP_confirm) => {
      let { title, subtitle, text, submitText = 'Yes', canselText = 'No', onSubmit, onCansel = () => { }, setAttrs = ()=>{return {}} } = obj;
      let config: AP_modal = {
        position: 'center',
        setAttrs:(key)=>{
          let attrs = setAttrs(key)
          if(key === 'modal'){
            return AddToAttrs(attrs,{className:'aio-popup-confirm'})
          }
          return attrs
        },
        header: { title, subtitle },
        body:()=>text,
        footer: ()=>{
          return (
            <>
              <button type='button' onClick={()=>{onCansel(); this.removeModal()}}>{canselText}</button>
              <button type='button' className='active' onClick={async ()=>{
                if (!onSubmit) { return }
                let res: boolean = await onSubmit();
                if (res !== false) { this.removeModal() }
              }}>{submitText}</button>
            </>
          )
        }
      }
      this.addModal(config)
    }
    this.addPrompt = (obj: AP_prompt) => {
      let { title, subtitle, text, submitText = 'تایید', canselText = 'بستن', onSubmit, onCansel = () => { }, setAttrs = ()=>{return {}} } = obj;
      let config: AP_modal = {
        position: 'center',
        setAttrs:(key)=>{
          let attrs = setAttrs(key)
          if(key === 'modal'){
            return AddToAttrs(attrs,{className:'aio-popup-prompt'})
          }
          return attrs
        },
        state: { temp: '' },
        header: { title, subtitle },
        body:({state,setState})=>{
          return (
            <textarea
              placeholder={text} value={state.temp}
              onChange={(e) => {if (setState) { setState({ temp: e.target.value }) }}} />
          )
        },
        footer:({state,setState}:{ state: any, setState: (v: any) => void })=>{
          return (
            <>
              <button type='button' onClick={()=>{onCansel(); this.removeModal()}}>{canselText}</button>
              <button 
                type='button' className='active' 
                onClick={async ()=>{
                  if (!onSubmit) { return }
                  let res = await onSubmit(state.temp);
                  if (res !== false) { this.removeModal() }
                  else { setState({ temp: '' }) }
                }}
                disabled={!state.temp}
              >{submitText}</button>
            </>
          )
        }
      }
      this.addModal(config)
    }
  }
}
type AP_Popups = {ref:any,rtl:boolean}
const Popups:FC<AP_Popups> = forwardRef((props,ref)=> {
  let [modals,setModals] = useState<AP_modal[]>([])
  let modalsRef = useRef(modals)
  modalsRef.current = modals;
  let { rtl } = props;
  useImperativeHandle(ref,()=>({
    addModal,removeModal,getModals:()=>modalsRef.current
  }))

  function addModal(o: AP_modal) {
    if (o.id === undefined) { o.id = 'popup' + Math.round(Math.random() * 1000000) }
    let newModal: AP_modal = o
    setModals(prevModals => {
      let newModals: AP_modal[] = prevModals.filter(({ id }) => id !== o.id);
      return [...newModals,newModal]
    })
  }
  async function removeModal(arg: string | undefined = 'last') {
    if (arg === 'all') {setModals([]); return}
    if (!modalsRef.current.length) { return }
    if (arg === 'last') { arg = modalsRef.current[modalsRef.current.length - 1].id }
    let modal: AP_modal | undefined = modalsRef.current.find((o: AP_modal) => o.id === arg);
    if (!modal) { return }
    $(`[data-id=${arg}]`).addClass('not-mounted');
    setTimeout(()=>{
      if (typeof modal.onClose === 'function') { modal.onClose() }
      setModals(prevModals => prevModals.filter((o) => o.id !== arg))
    },300)
  }
  function getModals() {
    return modalsRef.current.map((modal: AP_modal, i) => {
      return (
        <Popup
          key={modal.id} modal={modal} rtl={rtl}
          isLast={i === modalsRef.current.length - 1}
          onClose={() => removeModal(modal.id)}
        />
      )
    })
  }
  let Modals:React.ReactNode[] = getModals();
  return !Modals.length?null:<>{Modals}</>
})
type AP_Popup_temp = {dom: any,backdropDom: any,dui?: string,isDown: boolean,}
type I_CTX = {close:()=>void,state:any,setState:(v:any)=>void}
const CTX = createContext({} as any)
type AP_Popup = {modal:AP_modal,rtl:boolean,isLast:boolean,onClose:()=>void}
function Popup(props: AP_Popup) {
  let { modal, rtl, onClose, isLast } = props;
  let { setAttrs = ()=>{return {}}, id, position = 'fullscreen', body, getTarget,maxHeight, fixStyle = (o) => o, fitTo } = modal;
  let [temp] = useState<AP_Popup_temp>({dom: createRef(),backdropDom: createRef(),dui: undefined,isDown: false})
  let [popoverStyle, setPopoverStyle] = useState({})
  let [state, setState] = useState(modal.state)
  let attrs = setAttrs('modal') || {}
  let backdropAttrs = setAttrs('backdrop') || {}
  const firstMount = useRef(false);
  async function close() {
    onClose();
  }
  useEffect(() => () => {$(window).unbind('click', handleBackClick)})
  useEffect(() => {
    //be khatere 300 mili sanie transitioni ke popup dare bayad inja bish az oon 300 milisanie vaghfe bedim ta dorost update beshe andaze ha 
      let newStyle:any = position === 'popover' ? getPopoverStyle() : {}
      console.log('updatedStyle.top',newStyle.top)
      setPopoverStyle(newStyle)
    if (getTarget) {
      temp.dui = 'a' + (Math.round(Math.random() * 10000000));
      let target = getTarget();
      target.attr('data-id', temp.dui)
    }
    setTimeout(()=>{
      let popup = $(temp.dom.current)
      popup.removeClass('not-mounted')
      $(temp.backdropDom.current).removeClass('not-mounted')
      popup.focus();
    },0)
    $(window).unbind('click', handleBackClick)
    $(window).bind('click', handleBackClick)
  }, [])
  function handleBackClick(e: any) {
    //در مود پاپاور اگر هر جایی غیر از اینپوت و پاپاور کلیک شد پاپاپ رو ببند
    if (!temp.dui) { return }
    let target = $(e.target)
    if (position !== 'popover' || target.attr('data-id') === temp.dui || target.parents(`[data-id=${temp.dui}]`).length) {return}
    close();
  }
  
  function getBackdropProps() {
    let className = 'aio-popup-backdrop';
    className += ` aio-popup-position-${position}`
    className += rtl ? ' rtl' : ' ltr'
    if(firstMount){className += ' not-mounted'}
    return AddToAttrs(
      backdropAttrs,
      {
        className,
        attrs:{
          ref:temp.backdropDom,onKeyDown:keyDown,tabIndex:0,['data-id']: id,
          onClick:backdropAttrs.onClick?backdropAttrs.onClick:backClick
        }
      }
    )
  }
  function getModalProps():AP_align{
    let style: any = { ...popoverStyle, ...attrs.style }
    let ev = "ontouchstart" in document.documentElement ? 'onTouchStart' : 'onMouseDown'
    return {...attrs,ref:temp.dom,"data-id":modal.id,tabIndex:0,onKeyDown:keyDown,[ev]:mouseDown,className:getClassName(),style:{...style}}
  }
  function backClick(e: Event) {
    if (temp.isDown) { return }
    e.stopPropagation();
    let target = $(e.target as any);
    if (!target.hasClass('aio-popup-backdrop')) { return }
    close()
  }
  function getPopoverStyle():{[key:string]:any} {
    if (!getTarget) { return {} }
    let target = getTarget();
    if (!target || !target.length) { return {} }
    let popup = $(temp.dom.current);
    let p = { dom: popup, target, fitHorizontal:modal.fitHorizontal, fixStyle, pageSelector:modal.pageSelector,limitTo:modal.limitTo, fitTo, attrs, rtl }
    let style = Align(p)
    let res = { ...style, position: 'absolute' }
    if(maxHeight){res.maxHeight = maxHeight}
    return res
  }
  function keyDown(e: any) {
    if (!isLast) { return }
    let code = e.keyCode;
    if (code === 27) {onClose()}
  }
  function mouseUp() {
    setTimeout(() => temp.isDown = false, 0);
  }
  function mouseDown(e: any) {
    $(window).unbind('mouseup', mouseUp);
    $(window).bind('mouseup', mouseUp);
    temp.isDown = true
  }
  function getClassName() {
    let className = 'aio-popup';
    className += rtl ? ' rtl' : ' ltr'
    if(firstMount){className += ' not-mounted'}
    if (attrs.className) { className += ' ' + attrs.className }
    return className
  }
  function getContext():I_CTX{return {close,state,setState}}
  return (
    <CTX.Provider value={getContext()}>
      <div {...getBackdropProps()}>
        <div {...getModalProps()}>
          {!!modal.header && <ModalHeader modal={modal}/>} 
          <ModalBody modal={modal}/>
          {!!modal.footer && <div {...AddToAttrs(setAttrs('footer'),{className:'aio-popup-footer'})}>{modal.footer({state,setState,close})}</div>}
        </div> 
      </div>
    </CTX.Provider>
  )
}
const ModalHeader:FC<{modal:AP_modal}> = (props) => {
  let context:I_CTX = useContext(CTX);
  let { modal } = props;
  let { state, setState } = context;
  let {setAttrs = ()=>{return {}}} = modal;
  let attrs = setAttrs('modal') || {};
  if(typeof modal.header === 'function'){return modal.header({close:context.close,state,setState}) as any}
  if (typeof modal.header !== 'object') { return null }
  let cls = 'aio-popup-header'
  let { title, subtitle, onClose,before,after } = modal.header;
  function close(e: any) {
    e.stopPropagation(); e.preventDefault();
    if (typeof onClose === 'function') { onClose({ state, setState }) } else { context.close() }
  }
  function title_node(): React.ReactNode {
    if (!subtitle) {return <div className={`${cls}-title`} style={{display:'flex',alignItems:'center',flex:1}}>{title}</div>}
    else {
      return (
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',flex:1}}>
          <div className={`${cls}-title`}>{title}</div>
          <div className={`${cls}-subtitle`}>{subtitle}</div>
        </div>
      )
    }
  }
  return (
    <div {...AddToAttrs(attrs,{className:cls})}>
      {before !== undefined && <div className={`${cls}-before`} onClick={(e) => close(e)}>{before}</div>}
      {!!title && title_node()}
      {after !== undefined && <div className={`${cls}-after`} onClick={(e) => close(e)}>{after}</div>} 
      {onClose !== false && <div className={`${cls}-close-button`} onClick={(e) => close(e)}><Icon path={mdiClose} size={0.8} /></div>}
    </div>
  )
}
const ModalBody:FC<{modal:AP_modal}> = (props) => {
  let {state,setState,close}:I_CTX = useContext(CTX);
  let {modal} = props;
  let {body = ()=>null,setAttrs = ()=>{return {}}} = modal;
  let attrs = setAttrs('body') || {}
  let content:React.ReactNode = body({ close, state, setState });
  if(!content || content === null){return null}
  return (<div {...AddToAttrs(attrs,{className:'aio-popup-body aio-popup-scroll'})}>{content}</div>)
}
function Alert(props: AP_alert) {
  let { icon, type = '', text = '', subtext = '', time = 10, className, closeText = 'بستن', position = 'center' } = props;
  let $$ = {
    id: '',
    time: 0,
    getId() {
      return 'aa' + Math.round((Math.random() * 100000000))
    },
    getBarRender() {
      return `<div class='aio-popup-time-bar' style="width:${$$.time}%;"></div>`
    },
    updateBarRender() {
      $(`.aio-popup-alert-container.${$$.id} .aio-popup-time`).html($$.getBarRender())
    },
    getRender() {
      return (`
      <div class='aio-popup-alert-container not-mounted ${$$.id} aio-popup-alert-container-${position}'>
        <div class='aio-popup-alert aio-popup-alert-${type}'>
          <div class='aio-popup-alert-header'>${$$.getIcon()}</div>
          <div class='aio-popup-alert-body aio-popup-scroll'>
            <div class='aio-popup-alert-text'>${ReactDOMServer.renderToStaticMarkup(text as any)}</div>
            <div class='aio-popup-alert-subtext'>${subtext}</div>
          </div>
          <div class='aio-popup-alert-footer'>
            <button class='aio-popup-alert-close ${$$.id}'>${closeText}</button>
          </div>
          <div class='aio-popup-time'></div>
        </div>
      </div>
    `)
    },
    close() {
      $$.toggleClass(false)
      setTimeout(() => $('.' + $$.id).remove(), 200);
    },
    getIcon() {
      if (icon === false) { return '' }
      return icon || {
        error: (`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>`),
        warning: (`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"></path></svg>`),
        info: (`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"></path></svg>`),
        success: (`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"></path></svg>`)
      }[type] || ''
    },
    startTimer() {
      setTimeout(() => {
        if ($$.time >= 100) { $$.time = 100; $$.close(); return }
        $$.time += 2;
        $$.updateBarRender();
        $$.startTimer();
      }, time / 50 * 1000)
    },
    toggleClass(mount: boolean) {
      let dom = $(`.${$$.id}`);
      if (mount) {
        setTimeout(() => dom.removeClass('not-mounted'), 0)
      }
      else { dom.addClass('not-mounted') }
    },
    render() {
      $('body').append($$.getRender());
      $('button.' + $$.id).off('click', $$.close);
      $('button.' + $$.id).on('click', $$.close)
      $$.toggleClass(true)
    }
  }
  $$.id = $$.getId();
  $$.render();
  if (time) { $$.startTimer(); }
}
class Snackebar extends Component<AP_Snackebar, { items: AP_snackebar[] }> {
  constructor(props: AP_Snackebar) {
    super(props);
    this.state = { items: [] }
    props.getActions({ add: this.add.bind(this) })
  }
  add(item: AP_snackebar) {
    let { items } = this.state;
    let newItems: AP_snackebar[] = [...items, { ...item, id: 'a' + Math.round(Math.random() * 1000000000) }]
    this.setState({ items: newItems })
  }
  remove(id: string) {
    let { items } = this.state;
    let newItems: AP_snackebar[] = items.filter((o: AP_snackebar, i) => o.id !== id)
    this.setState({ items: newItems })
  }
  render() {
    let { items } = this.state;
    let { rtl } = this.props;
    return (
      <>
        {
          items.map((item: AP_snackebar, i) => {
            let p: AP_SnackebarItem = { rtl, item, index: i, onRemove: (id: string) => this.remove(id) }
            return (
              <SnackebarItem {...p} key={item.id} />
            )
          })
        }
      </>
    )
  }
}
function SnackebarItem(props: AP_SnackebarItem) {
  let { item, onRemove, index, rtl } = props;
  let { time = 8, id, text, type, subtext, action, onClose, verticalAlign = 'end', horizontalAlign = 'center', icon, attrs = {} } = item;
  if (verticalAlign !== 'start' && verticalAlign !== 'end') {
    verticalAlign = 'end';
    console.error('aio-popup error => snackebar item .verticalAlign should be "start" or "end"')
  }
  if (horizontalAlign !== 'start' && horizontalAlign !== 'end' && horizontalAlign !== 'center') {
    horizontalAlign = 'center';
    console.error('aio-popup error => snackebar item .horizontalAlign should be "start" or "end" or "center"')
  }
  let [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
    setTimeout(() => remove(), time * 1000)
  }, [])
  function remove() {
    setMounted(false)
    setTimeout(() => {
      onRemove(id as string);
    }, 200)
  }
  function info_svg() { return (<svg viewBox="0 0 24 24" role="presentation" style={{ width: '1.2rem', height: '1.2rem' }}><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" style={{ fill: 'currentcolor' }}></path></svg>) }
  function success_svg() { return (<svg viewBox="0 0 24 24" role="presentation" style={{ width: '1.2rem', height: '1.2rem' }}><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" style={{ fill: 'currentcolor' }}></path></svg>) }
  function getSvg(type: 'error' | 'warning' | 'info' | 'success') { return type === 'error' || type === 'warning' || type === 'info' ? info_svg() : success_svg() }
  function getOffsetStyle(index: number) {
    let els = $('.aio-popup-snackebar-item-container'), sum = { start: 12, end: 12 };
    for (let i = 0; i < index; i++) {
      let dom = els.eq(i) as any;
      let height = dom.height() + 6;
      let va: 'start' | 'end' = dom.attr('data-vertical-align');
      sum[va] += height;
    }
    return {
      [verticalAlign === 'start' ? 'top' : 'bottom']: sum[verticalAlign]
    }
  }
  function text_node() {
    return (
      <div className='aio-popup-snackebar-item-text'>
        <div className='aio-popup-snackebar-item-uptext'>{text}</div>
        {!!subtext && <div className='aio-popup-snackebar-item-subtext'>{subtext}</div>}
      </div>
    )
  }
  function container_node() {
    let className = 'aio-popup-snackebar-item-container';
    className += ` aio-popup-snackebar-item-container-horizontal-align-${horizontalAlign}`
    if (mounted) { className += ' mounted'; }
    if (rtl) { className += ' rtl'; }
    let style = getOffsetStyle(index);
    let p = { 'data-vertical-align': verticalAlign, className, style, onClick: onClose === false ? undefined : () => remove() }
    return (<div {...p}>{item_node()}</div>)
  }
  function item_node() {
    let className = 'aio-popup-snackebar-item';
    className += ` aio-popup-snackebar-item-${type}`
    if (attrs.className) { className += ` ${attrs.className}` }
    let p = { ...attrs, className, style: attrs.style }
    return (<div {...p}>{icon_node()} {text_node()} {action_node()} {bar_node()}  </div>)
  }
  function bar_node() { return (<div className='aio-popup-snackebar-bar' style={{ transition: `${time}s linear` }}></div>) }
  function action_node() {
    if (!action || !action.text) { return null }
    let p = {
      className: 'aio-popup-snackebar-item-action',
      onClick: (e: any) => { e.stopPropagation(); action.onClick(); remove() }
    }
    return (<button {...p}>{action.text}</button>)
  }
  function icon_node() { return <div className={`aio-popup-snackebar-item-icon`}>{!!icon ? icon : getSvg(type)}</div> }
  return container_node()
}
//id,onClose,backdrop,getTarget,position,fixStyle,attrs,fitHorizontal,pageSelector,rtl,body
type AP_align = {
  dom: any,
  target: any,
  fitHorizontal?: boolean,
  fixStyle?: (o: any, p: { targetLimit: any, pageLimit: any }) => any,
  attrs?: any,
  pageSelector?: string,
  limitTo?:string,
  rtl?: boolean,
  fitTo?: string
}
function Align(p: AP_align) {
  let { dom, target, fitHorizontal, fixStyle = (o) => o, attrs = {}, fitTo, pageSelector, rtl,limitTo } = p;
  let $$ = {
    getDomLimit(dom: any, type: 'popover' | 'page' | 'target') {
      if (fitTo && type === 'popover') {
        let parent = dom.parents(fitTo);//notice be jaye target dom
        if (parent.length) {
          let { left, top } = parent.offset()
          let width = parent.width();
          let height = parent.height();
          let right = left + width;
          let bottom = top + height;
          return { left, top, right, bottom, width, height };
        }
      }
      let offset = dom.offset();
      let left = offset.left - window.pageXOffset;
      let top = offset.top - window.pageYOffset;
      if (pageSelector && type !== 'page') {
        let page = $(pageSelector);
        try {
          let { left: l, top: t } = page.offset() || {left:0,top:0}
          left -= l;
          top -= t;
        }
        catch { }
        
      }
      let width = dom.outerWidth();
      let height = dom.outerHeight();
      let right = left + width;
      let bottom = top + height;
      return { left, top, right, bottom, width, height };
    },
    getPageLimit() {
      let page = pageSelector ? $(pageSelector) : undefined;
      page = Array.isArray(page) && page.length === 0 ? undefined : page;
      let bodyWidth = window.innerWidth;
      let bodyHeight = window.innerHeight;
      let pageLimit = page ? $$.getDomLimit(page, 'page') : { left: 0, top: 0, right: bodyWidth, bottom: bodyHeight };
      if (pageLimit.left < 0) { pageLimit.left = 0; }
      if (pageLimit.right > bodyWidth) { pageLimit.right = bodyWidth; }
      if (pageLimit.top < 0) { pageLimit.top = 0; }
      if (pageLimit.bottom > bodyHeight) { pageLimit.bottom = bodyHeight; }
      return pageLimit;
    },
    getRelatedToLmit(){
      if(!limitTo){return}
      let elem = dom.parents(limitTo);
      if(!elem.length){return}
      let offset = elem.offset();
      let left = offset.left - window.pageXOffset;
      let top = offset.top - window.pageYOffset;
      let width = elem.outerWidth();
      let height = elem.outerHeight();
      let right = left + width;
      let bottom = top + height;
      return {left,top,right,bottom,width,height}
    },
    align() {
      let pageLimit = $$.getPageLimit();
      let targetLimit = $$.getDomLimit(target, 'target');
      let domLimit = $$.getDomLimit(dom, 'popover');
      let overflowY;
      if (!fitTo) {
        domLimit.top = targetLimit.bottom
        domLimit.bottom = domLimit.top + domLimit.height;
        if (fitHorizontal) {
          domLimit.width = targetLimit.width;
          domLimit.left = targetLimit.left;
          domLimit.right = targetLimit.left + targetLimit.width
        }
        else {
          let relatedToLimit = $$.getRelatedToLmit()
          let parentLimit = relatedToLimit || pageLimit;
          //اگر راست به چپ باید باشد
          if (rtl) {
            //راست المان را با راست هدف ست کن
            domLimit.right = targetLimit.right;
            //چپ المان را بروز رسانی کن
            domLimit.left = domLimit.right - domLimit.width;
            //اگر المان از سمت چپ از صفحه بیرون زد سمت چپ المان را با سمت چپ صفحه ست کن
            if (domLimit.left < parentLimit.left) { domLimit.left = parentLimit.left; }
          }
          //اگر چپ به راست باید باشد
          else {
            //چپ المان را با چپ هدف ست کن
            domLimit.left = targetLimit.left;
            //راست المان را بروز رسانی کن
            domLimit.right = domLimit.left + domLimit.width;
            //اگر المان از سمت راست صفحه بیرون زد سمت چپ المان را با پهنای المان ست کن
            if (domLimit.right > parentLimit.right) { domLimit.left = parentLimit.right - domLimit.width; }
          }
        }
        //اگر المان از سمت پایین صفحه بیرون زد
        if (domLimit.bottom > pageLimit.bottom) {
          if (domLimit.height > targetLimit.top - pageLimit.top) { domLimit.top = pageLimit.bottom - domLimit.height; }
          else { domLimit.top = targetLimit.top - domLimit.height; }
        }
        else { domLimit.top = targetLimit.bottom; }
        if (domLimit.height > pageLimit.bottom - pageLimit.top) {
          domLimit.top = 6;
          domLimit.bottom = undefined;
          domLimit.height = pageLimit.bottom - pageLimit.top - 12;
          overflowY = 'auto';
        }
      }
      let finalStyle = { left: domLimit.left, top: domLimit.top, width: domLimit.width, height: !!fitTo ? domLimit.height : undefined, overflowY, ...attrs.style }
      return fixStyle(finalStyle, { targetLimit, pageLimit })
    }
  }
  return $$.align();
}