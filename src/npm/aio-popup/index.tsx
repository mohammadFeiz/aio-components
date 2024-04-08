import React, { Component, createRef, useEffect, useRef, useState } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Icon } from '@mdi/react';
import { mdiClose, mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import $ from 'jquery';
import './index.css';
type AP_props = {rtl?:boolean}
type AP_position = 'fullscreen' | 'center' | 'popover' | 'left' | 'right' | 'top' | 'bottom'
type AP_popover = {getTarget?:()=>any,pageSelector?:string,fitHorizontal?:boolean,fixStyle?:(o:any,p:{targetLimit:any,pageLimit:any})=>any,fitTo?:string,rtl?:boolean,attrs?:any}
type AP_header = {
  title?:string,subtitle?:string,buttons?:AP_modal_button[],onClose?:boolean | ((p:{state:any,setState:(state:any)=>void})=>void),backButton?:()=>void,attrs?:any
}
type AP_backdrop = {attrs?:any,close?:boolean}
type AP_body = {render:(p:{close:()=>void,state:any,setState:(state:any)=>void})=>React.ReactNode,attrs?:any}
type AP_footer = {attrs?:any,buttons?:AP_modal_button[]}

export type AP_addModal = {
  id?:string,
  position?:AP_position,
  animate?:boolean,
  popover?:AP_popover,
  attrs?:any,
  backdrop?:AP_backdrop,
  header?:AP_header,
  body:AP_body,
  footer?:AP_footer,
  state?:any,
  onClose?:boolean | (()=>void)
}
type AP_addSnackbar = {
  text:string,type:'success'|'error'|'warning'|'info',subtext?:string,action?:{text:string,onClick:()=>void},time?:number,rtl?:boolean,onClose?:false
}
type AP_addConfirm = {title?:string,subtitle?:string,text?:React.ReactNode,submitText?:string,canselText?:string,onSubmit?:()=>Promise<boolean>,onCansel:()=>void,attrs?:any}
type AP_addPrompt = {title?:string,subtitle?:string,text?:string,submitText?:string,canselText?:string,onSubmit?:(text:string)=>Promise<boolean>,onCansel:()=>void,attrs?:any}
type AP_addAlert = { icon?:false | React.ReactNode,type:'success'|'error'|'warning'|'info',text?:React.ReactNode,subtext?:string,time?:number,className?:string,closeText?:string,animate?:boolean}
export default class AIOPopup {
    rtl:boolean;
    render:()=>React.ReactNode;
    _addModal:(p:AP_addModal)=>void;
    addModal:(p:AP_addModal)=>void;
    addAlert:(p:AP_addAlert)=>void;
    removeModal:(arg?:string,animate?:boolean)=>void;
    _removeModal:(arg?:string,animate?:boolean)=>void;
    addSnackebar:(p:AP_addSnackbar)=>void;
    _addSnackebar:(p:AP_addSnackbar)=>void;
    getModals:()=>AP_modal[];
    _getModals:()=>AP_modal[];
    addConfirm:(p:AP_addConfirm)=>void;
    addPrompt:(p:AP_addPrompt)=>void;
    popupId:string;
    constructor(obj:AP_props){
        let {rtl} = obj || {}
        this.rtl = rtl;
        this.render = () => {
            let popupsProps:AP_Popups = {
                rtl:this.rtl,
                getActions:({addModal,removeModal,getModals})=>{
                    this._addModal = addModal;
                    this._removeModal = removeModal;
                    this._getModals = getModals;
                }
            }
            let snackebarProps:AP_Snackbar = {
                rtl:this.rtl,
                getActions:({add})=>{
                    this._addSnackebar = add;
                }
            }
            return (
                <>
                    <Popups {...popupsProps}/>
                    <Snackbar {...snackebarProps}/>
                </>
            )
        }
        this.addModal = (obj)=>this._addModal(obj);
        this.addAlert = (obj) => Alert(obj);
        this.removeModal = (arg,animate = true)=>{if(this._removeModal){this._removeModal(arg,animate)}};
        this.addSnackebar = (obj:AP_addSnackbar)=>this._addSnackebar(obj)
        this.getModals = ()=>this._getModals()
        this.addConfirm = (obj:AP_addConfirm) => {
          let {title,subtitle,text,submitText = 'بله',canselText = 'خیر',onSubmit,onCansel = ()=>{},attrs = {}} = obj;
          let className = 'aio-popup-confirm';
          if(attrs.className){className += ' ' + attrs.className}
          let config:AP_addModal = {
            position:'center',
            attrs:{...attrs,className},
            header:{title,subtitle},
            backdrop:{attrs:{className:'rsa-backdrop'}},
            body:{render:()=>text},
            footer:{
              buttons:[
                [canselText,{onClick:()=>{onCansel(); this.removeModal()}}],
                [
                  submitText,
                  {
                    onClick:async ()=>{
                      let res = await onSubmit(); 
                      if(res !== false){this.removeModal()}
                    },
                    className:'active'
                  }
                ]
              ]
            }
          }
          this.addModal(config)
        }
        this.addPrompt = (obj:AP_addPrompt) => {
          let {title,subtitle,text,submitText = 'تایید',canselText = 'بستن',onSubmit,onCansel = ()=>{},attrs = {}} = obj;
          let className = 'aio-popup-prompt';
          if(attrs.className){className += ' ' + attrs.className}
          let config:AP_addModal = {
            position:'center',
            attrs:{...attrs,className},
            state:{temp:''},
            header:{title,subtitle},
            backdrop:{attrs:{className:'rsa-backdrop'}},
            body:{render:({state,setState})=><textarea placeholder={text} value={state.temp} onChange={(e)=>setState({temp:e.target.value})}/>},
            footer:{
              buttons:[
                [canselText,{onClick:()=>{onCansel(); this.removeModal()}}],
                [
                  submitText,
                  ({state,setState})=>{
                    return {
                      onClick:async ({state})=>{
                        let res = await onSubmit(state.temp); 
                        if(res !== false){this.removeModal()}
                        else {setState({temp:''})}
                      },
                      disabled:!state.temp,className:'active'
                    }
                  }
                ]
              ]
            }
          }
          this.addModal(config)
        }
        
      }
}
type AP_Popups = {
  getActions:(p:{
    removeModal:(p?:string,animate?:boolean)=>void,
    addModal:(p:AP_addModal)=>void,
    getModals:()=>AP_modal[]
  })=>void,
  rtl:boolean
}
type AP_modal_button = [text:React.ReactNode,attrs?:any]
type AP_modal = {
  id:string,
  onClose?:()=>void,
  popover:any,
  position:AP_position,
  attrs:any,
  backdrop:AP_backdrop, 
  header:AP_header,
  state?:any,
  footer?:AP_footer, 
  body:AP_body, 
  animate:boolean
}
class Popups extends Component<AP_Popups,{modals:AP_modal[]}> {
  constructor(props){
    super(props);
    this.state = {modals:[]}
    props.getActions({
      addModal:this.addModal.bind(this),
      removeModal:this.removeModal.bind(this),
      getModals:this.getModals.bind(this)
    })
  }
  change(obj) {
    for(let prop in obj){this.state[prop] = obj[prop]}
    this.setState(obj)
  }
  
  addModal(o:AP_addModal) {
    let {modals} = this.state;
    if(o.id === undefined){o.id = 'popup' + Math.round(Math.random() * 1000000)}
    let {animate = true} = o;
    let newModals:AP_modal[] = modals.filter(({ id }) => id !== o.id);
    let {popover,position,attrs,backdrop,header,body,id,footer} = o;
    let newModal:AP_modal = {id,popover,attrs,backdrop,header,body,position,animate,footer}
    newModals.push(newModal)
    this.change({modals:newModals})
  }
  async removeModal(arg = 'last',animate = true) {
    if(arg === 'all'){this.setState({modals:[]});}
    else{
      let {modals} = this.state;
      if(!modals.length){return}
      if(arg === 'last'){arg = modals[modals.length - 1].id}
      let parentDom = $(`.aio-popup-backdrop[data-id=${arg}]`);
      let dom = parentDom.find('.aio-popup'); 
      parentDom.addClass('not-mounted');
      dom.addClass('not-mounted');
      setTimeout(()=>{
        let modal:AP_modal = modals.find((o:AP_modal) => o.id === arg);
        if(!modal){return}
        if(modal.onClose){modal.onClose()}
        let newModals:AP_modal[] = modals.filter((o) => o.id !== arg)
        this.change({modals:newModals})
      },animate?300:0)
    }
  }
  getModals() {
    let {modals} = this.state;
    let {rtl} = this.props;
    if (!modals.length) { return null }
    return modals.map((modal:AP_modal, i) => {
      let props:AP_Popup = {
        modal,index: i,isLast: i === modals.length - 1,rtl,
        onClose: () => this.removeModal(modal.id),
        removeModal:this.removeModal.bind(this),//use for remove lastModal by esc keyboard
      }
      return <Popup key={modal.id} {...props} />
    })
  }
  render(){
    return <>{this.getModals()}</>
  }
  
}
type AP_Popup = {
  modal:AP_modal,
  rtl:boolean,
  index:number,
  isLast:boolean,
  onClose:()=>void,
  removeModal:(p?:string,animate?:boolean)=>void,
}
function Popup(props:AP_Popup) {
  let {modal,rtl,onClose,isLast,removeModal} = props; 
  let {attrs = {},popover = {},id,backdrop = {},footer,header,position = 'fullscreen',body,animate} = modal;
  let [temp] = useState({
    dom:createRef(),
    backdropDom:createRef(),
    dui:undefined,
    isDown:false,
    isFirstMount:true

  })
  let [popoverStyle,setPopoverStyle] = useState({})
  let [state,setState] = useState(modal.state)
  async function close() {
    onClose();
  }
  useEffect(()=>{
    return ()=>{
      $(window).unbind('click',handleBackClick)
    }
  })
  function updatePopoverStyle(){
    if(position === 'popover'){
      let ps = getPopoverStyle();
      if(JSON.stringify(ps) !== JSON.stringify(popoverStyle)){
        setPopoverStyle(ps)
      }
    }
  }
  function setMounted(){
    let parentDom = $(`.aio-popup-backdrop[data-id=${id}]`);
    let dom = parentDom.find('.aio-popup'); 
    parentDom.addClass('not-mounted');
    dom.addClass('not-mounted'); 
  }
  useEffect(()=>{
    temp.isFirstMount = false
    setTimeout(()=>{
      setPopoverStyle(position === 'popover'?getPopoverStyle():{})
      setMounted()
    },0)
    if(popover.getTarget){
      temp.dui = 'a' + (Math.round(Math.random() * 10000000));
      let target = popover.getTarget();
      target.attr('data-uniq-id',temp.dui)
    }
    $(window).unbind('click',handleBackClick)
    $(window).bind('click',handleBackClick)
  },[])
  function handleBackClick(e){
    //در مود پاپاور اگر هر جایی غیر از اینپوت و پاپاور کلیک شد پاپاپ رو ببند
    if(!temp.dui){return}
    let target = $(e.target)
    if(position !== 'popover' || target.attr('data-uniq-id') === temp.dui || target.parents(`[data-uniq-id=${temp.dui}]`).length){
      return
    }
    close();
  }
  function header_layout() {
    if (typeof header !== 'object') { return false }
    return {html:<ModalHeader rtl={rtl} header={header} handleClose={()=>close()} state={state} setState={(value)=>setState(value)}/>,className:'of-visible'}
  }
  function body_layout(){
    let p:AP_ModalBody = {body,handleClose:()=>close(),state,setState:((value)=>setState(value)),updatePopoverStyle}
    return { flex:1,html:<ModalBody {...p}/> }
  }
  function footer_layout() {
    let handleClose = close;
    let props = {footer,handleClose,state,setState};
    return {html:<ModalFooter {...props}/>}
  }
  function getBackDropClassName() {
    let className = 'aio-popup-backdrop';
    if(temp.isFirstMount){
      className += ' not-mounted'
    }
    if (backdrop.attrs && backdrop.attrs.className) { className += ' ' + backdrop.attrs.className }
    className += ` aio-popup-position-${position}`
    className += rtl?' rtl':' ltr'
    return className
  }
  function backClick(e) {
    if(temp.isDown){return}
    e.stopPropagation();
    let target = $(e.target);
    if (backdrop.close === false) { return }
    if(!target.hasClass('aio-popup-backdrop')){return}
    close()
  }
  function getPopoverStyle(){
    let {getTarget,pageSelector,fitHorizontal,fixStyle = (o) => o,fitTo} = popover; 
    if(!getTarget) { return {} }
    let target = getTarget();
    if (!target || !target.length) { return {}}
    let popup = $(temp.dom.current);
    let config:AP_popover = { fixStyle, pageSelector,fitTo, fitHorizontal, attrs, rtl }
    let style = Align(popup, target, config)
    return {...style,position:'absolute'}
  }
  function keyDown(e){
    if(!isLast){return}
    let code = e.keyCode;
    if(code === 27){
      removeModal()
    }
  }
  function mouseUp(){
    setTimeout(()=>temp.isDown = false,0);
  }
  function mouseDown(e){
    $(window).unbind('mouseup',mouseUp);
    $(window).bind('mouseup',mouseUp);
    temp.isDown = true
  }
  function getClassName(){
    let className = 'aio-popup';
    if(temp.isFirstMount){
      className += ' not-mounted'
      temp.isFirstMount = false
    }
    className += rtl ? ' rtl' : ' ltr'
    if(attrs.className){className += ' ' + attrs.className}
    return className
  }
  let backdropAttrs = backdrop?backdrop.attrs:{};
  let backdropProps = {
    ...backdropAttrs,['data-id']:id,
    className: getBackDropClassName(),
    onClick: backdrop.close === false?undefined:(e) => backClick(e),
  }
  let style:any = { ...popoverStyle,...attrs.style,flex:'none'}
  let ev = "ontouchstart" in document.documentElement?'onTouchStart':'onMouseDown'
  return (
    <div {...backdropProps} ref={temp.backdropDom} onKeyDown={keyDown} tabIndex={0}>
      <RVD
        rootNode={{
          attrs:{...attrs,ref:temp.dom,style:undefined,className:undefined,'data-uniq-id':temp.dui,[ev]:mouseDown},
          className:getClassName(),style,column: [header_layout(),body_layout(),footer_layout()]
        }}
      />
    </div>
  )
}
type AP_ModalHeader = {
  rtl:boolean,header:AP_header,handleClose:()=>void,state:any,setState:(state:any)=>void
}
function ModalHeader(props:AP_ModalHeader){
  let {rtl,header,handleClose,state,setState} = props;
  if(typeof header !== 'object'){return null}
  let {title,subtitle,buttons = [],onClose,backButton,attrs = {}} = header;
  function close(e){
    e.stopPropagation(); e.preventDefault();
    if(typeof onClose === 'function'){onClose({state,setState})} else{handleClose()}
  }
  function backButton_layout(){
    if(!backButton || onClose === false){return false}
    let path,style;
    if(rtl){path = mdiChevronRight; style = {marginLeft:12}}
    else {path = mdiChevronLeft; style = {marginRight:12}}
    return { html: <Icon path={path} size={1} />, className: 'align-vh', onClick: (e) => close(e) ,style}
  }
  function title_layout(){
    if(!title){return false}
    if(!subtitle){
      return { html: title, className: 'aio-popup-title align-v flex-1' }  
    }
    else {
      return { 
        className: 'align-v flex-1',
        column:[
          {html:title,className: 'aio-popup-title'},
          {html:subtitle,className: 'aio-popup-subtitle'}
        ]  
      }
    }
  }
  function buttons_layout(){
    if(!buttons.length){return false}
    return {
      className:'align-vh gap-6',
      row:()=>buttons.map(([text,attrs = {}])=>{
        let {onClick = ()=>{},className} = attrs;
        let Attrs = {...attrs};
        Attrs.className = 'aio-popup-header-button' + (className?' ' + className:'');
        Attrs.onClick = ()=> onClick({close:handleClose,state,setState})
        return {html:(<button {...Attrs}>{text}</button>),className:'align-vh'}
      })
    }
  }
  function close_layout(){
    if(backButton || onClose === false){return false}
    return { html: <Icon path={mdiClose} size={0.8} />,onClick: (e) => close(e),className:'aio-popup-header-close-button align-vh' }
  }
  let className = 'aio-popup-header' + (attrs.className?' ' + attrs.className:'')
  let style = attrs.style;
  return (<RVD rootNode={{attrs,className,style,row: [backButton_layout(),title_layout(),buttons_layout(),close_layout()]}}/>)
}
type AP_ModalBody = {
  body:AP_body,
  handleClose:()=>void,
  updatePopoverStyle:()=>void,
  state:any,setState:(state:any)=>void
}
function ModalBody(props:AP_ModalBody){
    let {handleClose,body,updatePopoverStyle,state = {},setState} = props;
    let {render,attrs = {}} = body;
    let content = typeof render === 'function'?render({close:handleClose,state,setState}):render;
    useEffect(()=>{
      updatePopoverStyle()
    },[content])
    return (
      <div {...attrs} className={'aio-popup-body' + (attrs.className?' ' + attrs.className:'')}>
        {typeof render === 'function' && content}
      </div>
    )
}
function ModalFooter({footer,handleClose,state,setState}){
  if(typeof footer !== 'object'){return null}
  let {attrs = {},buttons = []} = footer;
  function buttons_layout(){
    if(!buttons.length){return null}
    return buttons.map(([text,attrs = {}])=>{
      let Attrs = typeof attrs === 'function'?{...attrs({state,setState})}:{...attrs};
      let {onClick = ()=>{},className} = Attrs;
      Attrs.className = 'aio-popup-footer-button' + (className?' ' + className:'');
      Attrs.onClick = ()=> onClick({close:handleClose,state,setState})
      return <button {...Attrs}>{text}</button>
    })
  }
  let className = 'aio-popup-footer' + (attrs.className?' ' + attrs.className:'')
  let style = attrs.style;
  return (
    <div className={className} style={style}>
      {buttons_layout()}
    </div>
  )
}

type AP_Alert = AP_addAlert;
function Alert(props:AP_Alert) {
  let { icon,type = '',text = '',subtext = '',time = 10,className,closeText = 'بستن'} = props;
  let $$ = {
    id:undefined,  
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
      <div class='aio-popup-alert-container ${$$.id}${className ? 'aio-popup' + className : ''}'>
        <div class='aio-popup-alert aio-popup-alert-${type}'>
          <div class='aio-popup-alert-header'>${$$.getIcon()}</div>
          <div class='aio-popup-alert-body'>
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
          $('.' + $$.id).remove()
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
              if ($$.time >= 100) { $$.time = 100; $$.close(); return}
              $$.time += 2;
              $$.updateBarRender();
              $$.startTimer();
          }, time / 50 * 1000)
      },
      render() {
          $('body').append($$.getRender());
          $('button.' + $$.id).off('click', $$.close);
          $('button.' + $$.id).on('click', $$.close)
      }
  }
  $$.id = $$.getId();
  $$.render();
  if (time) { $$.startTimer(); }
}
type AP_Snackbar = {getActions:(p:{add:(item:AP_snackbarItem)=>void})=>void,rtl:boolean}
type AP_snackbarItem = {
  id:string,time?:number,subtext?:string,action?:{text:string,onClick:()=>void}
  text:string,type:'success'|'error'|'warning'|'info',
  onClose?:false
}
function Snackbar(props:AP_Snackbar){
  let {getActions,rtl = false} = props;
  let [items,setItems] = useState<AP_snackbarItem[]>([])
  function add(item:AP_snackbarItem){
    setItems(items.concat({...item,id:'a' + Math.round(Math.random() * 1000000000)}))
  }
  useEffect(()=>{getActions({add})},[])
  function remove(id:string){
    setItems(items.filter((o:AP_snackbarItem,i)=>o.id !== id))
  }
  return (
    <>
      {
        items.map((item:AP_snackbarItem,i)=>{
          let p:AP_SnackbarItem = {rtl,item,index:i,onRemove:(id:string)=>remove(id)}
          return (
            <SnackebarItem {...p} key={item.id}/>
          )
        })
      }
    </>
  )
  
}
type AP_SnackbarItem = {
  item:AP_snackbarItem,
  onRemove:(id:string)=>void,
  index:number,
  rtl:boolean
}
function SnackebarItem(props:AP_SnackbarItem){
  let {item,onRemove,index,rtl} = props;
  let {time = 8,id,text,type,subtext,action,onClose} = item;
  let [mounted,setMounted] = useState<boolean>(false)
  useEffect(()=>{
    setTimeout(()=>setMounted(true),0)
    setTimeout(()=>remove(),time * 1000)
  },[])
  function remove(){
    setMounted(false)
    setTimeout(()=>{
      onRemove(id);
    },200)
  }
  function info_svg(){return (<svg viewBox="0 0 24 24" role="presentation" style={{width: '1.2rem',height: '1.2rem'}}><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" style={{fill: 'currentcolor'}}></path></svg>)}
  function success_svg(){return (<svg viewBox="0 0 24 24" role="presentation" style={{width: '1.2rem',height: '1.2rem'}}><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" style={{fill: 'currentcolor'}}></path></svg>)}
  function getSvg(type){return type === 'error' || type === 'warning' || type === 'info'?info_svg():success_svg()}
  function getBottom(index){
    let els = $('.aio-popup-snackebar-item-container'),sum = 12;
    for(let i = 0; i < index; i++){sum += els.eq(i).height() + 6;}
    return sum
  }
  let bottom = getBottom(index)
  return (
    <div onClick={onClose === false?undefined:()=>remove()} className={'aio-popup-snackebar-item-container' + (mounted?' mounted':'')} style={{bottom,direction:rtl?'rtl':undefined}}>
      <div className={`aio-popup-snackebar-item aio-popup-snackebar-item-${type}`}>
        <div className={`aio-popup-snackebar-item-icon`}>{getSvg(type)}</div>
        <div className='aio-popup-snackebar-item-text'>
          <div style={{textAlign:rtl?'right':'left'}}>{text}</div>
          {!!subtext && <div className='aio-popup-snackebar-item-subtext'>{subtext}</div>}
        </div>
        {
          !!action && !!action.text && 
          <button 
            className='aio-popup-snackebar-item-action' 
            onClick={(e)=>{e.stopPropagation(); action.onClick(); remove()}}
          >{action.text}</button>}
        <div className={`aio-popup-snackebar-bar`} style={{transition:`${time}s linear`,right:rtl?0:'unset',left:rtl?'unset':0}}></div>  
      </div>
    </div>
  )
}
//id,onClose,backdrop,getTarget,position,fixStyle,attrs,fitHorizontal,pageSelector,rtl,body
function Align(dom:any,target:any,config:AP_popover){
  let {fitHorizontal,attrs = {},fixStyle = (o)=>o,pageSelector,rtl,fitTo} = config || {};
  let $$ = {
    getDomLimit(dom,type){
      if(fitTo && type === 'popover'){
        let parent = target.parents(fitTo);
        if(parent.length){
          let {left,top} = parent.offset()
          let width = parent.width();
          let height = parent.height();
          let right = left + width;
          let bottom = top + height;
          return {left,top,right,bottom,width,height};    
        }
      }
      let offset = dom.offset();
      let left = offset.left - window.pageXOffset;
      let top = offset.top - window.pageYOffset;
      if(pageSelector && type !== 'page'){
        let page = $(pageSelector);
        try{
          let {left:l,top:t} = page.offset()
          left -= l;
          top -= t;
        }
        catch{}
      }
      let width = dom.outerWidth();
      let height = dom.outerHeight();
      let right = left + width;
      let bottom = top + height;
      return {left,top,right,bottom,width,height};
    },
    getPageLimit(dom){
      let page = pageSelector?$(pageSelector):undefined;
      page = Array.isArray(page) && page.length === 0?undefined:page;
      let bodyWidth = window.innerWidth;
      let bodyHeight = window.innerHeight;
      let pageLimit = page?$$.getDomLimit(page,'page'):{left:0,top:0,right:bodyWidth,bottom:bodyHeight};
      if(pageLimit.left < 0){pageLimit.left = 0;}
      if(pageLimit.right > bodyWidth){pageLimit.right = bodyWidth;}
      if(pageLimit.top < 0){pageLimit.top = 0;}
      if(pageLimit.bottom > bodyHeight){pageLimit.bottom = bodyHeight;}
      return pageLimit;
    },
    align(){
      let pageLimit = $$.getPageLimit(dom);
      let targetLimit = $$.getDomLimit(target,'target');
      let domLimit = $$.getDomLimit(dom,'popover'); 
      let overflowY;
      if(!fitTo){
        domLimit.top = targetLimit.bottom
        domLimit.bottom = domLimit.top + domLimit.height;  
        if(fitHorizontal){
          domLimit.width = targetLimit.width;
          domLimit.left = targetLimit.left;
          domLimit.right = targetLimit.left + targetLimit.width
        }
        else {
          //اگر راست به چپ باید باشد
          if(rtl){
            //راست المان را با راست هدف ست کن
            domLimit.right = targetLimit.right;
            //چپ المان را بروز رسانی کن
            domLimit.left = domLimit.right - domLimit.width;
            //اگر المان از سمت چپ از صفحه بیرون زد سمت چپ المان را با سمت چپ صفحه ست کن
            if(domLimit.left < pageLimit.left){domLimit.left = pageLimit.left;}
          }
          //اگر چپ به راست باید باشد
          else{
            //چپ المان را با چپ هدف ست کن
            domLimit.left = targetLimit.left; 
            //راست المان را بروز رسانی کن
            domLimit.right = domLimit.left + domLimit.width;
            //اگر المان از سمت راست صفحه بیرون زد سمت چپ المان را با پهنای المان ست کن
            if(domLimit.right > pageLimit.right){domLimit.left = pageLimit.right - domLimit.width;}
          }
        }
        
        //اگر المان از سمت پایین صفحه بیرون زد
        if(domLimit.bottom > pageLimit.bottom){
          if(domLimit.height > targetLimit.top - pageLimit.top){domLimit.top = pageLimit.bottom - domLimit.height;}  
          else{domLimit.top = targetLimit.top - domLimit.height;}
        }
        else{domLimit.top = targetLimit.bottom;}
        if(domLimit.height > pageLimit.bottom - pageLimit.top){
          domLimit.top = 6;
          domLimit.bottom = undefined;
          domLimit.height = pageLimit.bottom - pageLimit.top - 12;
          overflowY = 'auto';
        }
      }
      let finalStyle = {left:domLimit.left,top:domLimit.top,width:domLimit.width,height:!!fitTo?domLimit.height:undefined,overflowY,...attrs.style}
      return fixStyle(finalStyle,{targetLimit,pageLimit})
    }
  }
  return $$.align();
}