import React, { Component, createRef } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Icon } from '@mdi/react';
import { mdiClose, mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import $ from 'jquery';
import './aio-popup.css';


export default class AIOPopup {
  constructor(obj = {}){
    this.rtl = obj.rtl
  }
  render = () => {
    return (
      <>
        <Popups
          getActions={({addModal,removeModal,addPopover,removePopover})=>{
            this._addModal = addModal;
            this._removeModal = removeModal;
            this._addPopover = addPopover;
            this._removePopover = removePopover;
          }}
        />
        <AIOSnackeBar rtl={this.rtl} getActions={({add})=>{
          this._addSnakebar = add;
        }}/>
      </>
    )
  }
  addModal = (obj = {})=>{
    if(obj.id === undefined){obj.id = 'popup' + Math.round(Math.random() * 1000000)}
    this._addModal(obj)
  }
  removeModal = (arg)=> this._removeModal(arg);
  addAlert = (obj = {}) => {
    let { icon, type = '', text = '', subtext = '', time = 10, className, closeText = 'بستن' } = obj
    Alert({icon,type,text,subtext,time,className,closeText})
  }
  addSnakebar = (obj = {})=>{
    let {text,index,type,subtext,action = {},time = 6,rtl} = obj;
    this._addSnakebar({text,index,type,subtext,action,time,rtl})
  }
}
class Popups extends Component {
  constructor(props) {
    super(props);
    let { getActions = () => { } } = props
    this.state = {modals: [],popovers:[]}
    getActions({
      removeModal: this.removeModal.bind(this),
      addModal: this.addModal.bind(this),
    })
  }
  onChange(obj) {
    let { onChange = () => { } } = this.props;
    for(let prop in obj){this.state[prop] = obj[prop]}
    this.setState(obj, () => onChange({ ...this.state }))
  }
  addModal(o) {
    let { modals } = this.state;
    let newModals = modals.filter(({ id }) => id !== o.id);
    newModals.push({...o})
    this.onChange({ modals: newModals })
  }
  async removeModal(arg) {
    if (arg === 'all') {this.onChange({ modals: [] }); return}
    let { modals } = this.state;
    let modal = arg !== undefined?modals.find((o) => o.id === arg):modals[modals.length - 1];
    if (!modal) { return }
    let { onClose, id } = modal;
    if(onClose){onClose()}
    else {this.onChange({ modals: modals.filter((o) => o.id !== id) })}
  }
  getModals() {
    let { modals } = this.state;
    let { modalConfig = {} } = this.props;
    if (!modals.length) { return null }
    return modals.map(({popover, 
      blur, position,text,onSubmit, rtl = this.props.rtl, attrs = {}, onClose,backdrop, header,footer, closeType, body, id, animate }, i) => {
      let props = {
        id, animate,backdrop,footer,text,onSubmit,header,popover,
        key: i, blur:i === modals.length - 2,
        ...modalConfig,
        blur, position, rtl, attrs, onClose, closeType, body,index: i,rtl,
        onClose: () => this.removeModal(),
      }
      return <Popup {...props} />
    })
  }
  render() {
    return (
      <>
        {this.getModals()}
      </>
    )
  }
}

class Popup extends Component {
  constructor(props) {
    super(props);
    this.dom = createRef();
    this.dui = 'a' + Math.random();
    this.state = {mounted:props.position === 'popover'?false:props.animate === false,popoverStyle:undefined}
  }
  async onClose() {
    let { onClose } = this.props;
    this.setState({mounted:false});
    setTimeout(()=>onClose(),300)
  }
  componentDidMount(){
    let {position} = this.props;
    let {mounted} = this.state;
    if(!mounted){
      setTimeout(()=>this.setState({
        popoverStyle:position === 'popover'?this.getPopoverStyle():{},
        mounted:true
      }),0)
    }
    
  }
  header_layout() {
    let { rtl,header } = this.props;
    if (typeof header !== 'object') { return false }
    return {html:<ModalHeader rtl={rtl} header={header} handleClose={()=>this.onClose()}/>}
  }
  body_layout(){
    let {body = {}} = this.props;
    let {attrs = {},render} = body;
    let props = {
      handleClose:this.onClose.bind(this),render
    }
    let className = 'aio-popup-body' + (attrs.className?' ' + attrs.className:'') 
    return { attrs:{...attrs,className},html:<ModalBody {...props}/> }
  }
  footer_layout() {
    let {closeText,submitText,onSubmit,footer,type} = this.props;
    let handleClose = this.onClose.bind(this);
    let props = {closeText,submitText,onSubmit,footer,type,handleClose};
    return {html:<ModalFooter {...props}/>}
  }
  getBackDropClassName() {
    let { blur, className: cls,position = 'fullscreen' } = this.props;
    let { mounted } = this.state;
    let className = 'aio-popup-backdrop';
    if (cls) { className += className ? (' ' + cls) : '' }
    if (blur) { className += ' aio-popup-blur' }
    className += ` aio-popup-position-${position}`
    if(!mounted){className += ' not-mounted'}
    return className
  }
  backClick(e) {
    let target = $(e.target);
    let { backdrop = {} } = this.props;
    if (backdrop.close === false) { return }
    if(!target.hasClass('aio-popup-backdrop')){return}
    this.onClose()
  }
  getPopoverStyle(){
    let { popover = {},animate,rtl,attrs = {} } = this.props;
    let {getTarget,openRelatedTo,fitHorizontal,fixStyle = (o) => o} = popover; 
    if(!getTarget) { return {} }
    let target = getTarget();
    if (!target || !target.length) { return {}}
    let popup = $(this.dom.current);
    let style = Align(popup, target, { fixStyle: fixStyle, pageSelector: openRelatedTo, animate, fitHorizontal, style: attrs.style, rtl })
    return {...style,position:'fixed'}
  }
  render() {
    let { rtl, attrs = {}, id,backdrop} = this.props;
    let {mounted,popoverStyle} = this.state
    let backdropProps = {
      className: this.getBackDropClassName(),
      style:backdrop === false?{pointerEvents:'none',background:'none'}:undefined,
      onClick: backdrop === false?undefined:(e) => this.backClick(e),
      'data-popup-id': id,
    }
    let style = { ...popoverStyle,...attrs.style,flex:'none'}
    
    let className = 'aio-popup' + (rtl ? ' rtl' : ' ltr') + (' ' + this.dui) + (!mounted?' not-mounted':'') + (attrs.className?' ' + attrs.className:'');
    return (
      <div {...backdropProps}>
        <RVD
          layout={{
            attrs:{...attrs,ref:this.dom,style:undefined,className:undefined},
            className,style,
            column: [
              this.header_layout(),
              this.body_layout(),
              this.footer_layout()
            ]
          }}
        />
      </div>
    )
  }
}
function ModalHeader({rtl,header,handleClose}){
  if(typeof header !== 'object'){return null}
  let {title,subtitle,buttons = [],onClose,backButton,attrs = {}} = header;
  function close(){if(onClose){onClose()} else{handleClose()}}
  function backButton_layout(){
    if(!backButton || onClose === false){return false}
    let path,style;
    if(rtl){path = mdiChevronRight; style = {marginLeft:12}}
    else {path = mdiChevronLeft; style = {marginRight:12}}
    return { html: <Icon path={path} size={1} />, align: 'vh', onClick: () => onClose() ,style}
  }
  function title_layout(){
    if(!title){return false}
    if(!subtitle){
      return { flex: 1,align: 'v', html: title, className: 'aio-popup-title' }  
    }
    else {
      return { 
        flex: 1, align: 'v',
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
      gap:6,align:'vh',
      row:()=>buttons.map(([text,attrs = {}])=>{
        let {onClick = ()=>{},className} = attrs;
        attrs.className = 'aio-popup-header-button' + (className?' ' + className:'');
        attrs.onClick = ()=> onClick({close:handleClose})
        return {html:(<button {...attrs}>{text}</button>),align:'vh'}
      })
    }
  }
  function close_layout(){
    if(backButton || onClose === false){return false}
    return { html: <Icon path={mdiClose} size={0.8} />, align: 'vh', onClick: () => close(),className:'aio-popup-header-close-button' }
  }
  let className = 'aio-popup-header' + (attrs.className?' ' + attrs.className:'')
  let style = attrs.style;
  return (<RVD layout={{attrs,className,style,row: [backButton_layout(),title_layout(),buttons_layout(),close_layout()]}}/>)
}
function ModalBody({handleClose,render}){
  if(typeof render === 'function'){return render({close:handleClose})}
}
function ModalFooter({type,closeText = 'Close',submitText = 'Submit',footer,handleClose,onSubmit}){
  if(typeof footer !== 'object'){return null}
  let {attrs = {}} = footer;
  let {buttons = []} = footer;
  function buttons_layout(){
    if(!buttons.length){return false}
    return {
      gap:6,align:'vh',
      row:()=>buttons.map(([text,attrs = {}])=>{
        let {onClick = ()=>{},className} = attrs;
        attrs.className = 'aio-popup-footer-button' + (className?' ' + className:'');
        attrs.onClick = ()=> onClick({close:handleClose})
        return {html:(<button {...attrs}>{text}</button>),align:'vh'}
      })
    }
  }
  let className = 'aio-popup-footer' + (attrs.className?' ' + attrs.className:'')
  let style = attrs.style;
  return (<RVD layout={{className,style,...buttons_layout()}}/>)
}


function Alert(obj = {}) {
  let { icon,type,text,subtext,time,className,closeText} = obj;
  let $$ = {
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
            <div class='aio-popup-alert-text'>${ReactDOMServer.renderToStaticMarkup(text)}</div>
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
class AIOSnackeBar extends Component{
  constructor(props){
    super(props);
    this.state = {items:[]}
    props.getActions({add:this.add.bind(this)})
  }
  add(item){
    let {items} = this.state;
    this.setState({items:items.concat({...item,id:'a' + Math.round(Math.random() * 1000000000)})})
  }
  remove(id){
    let {items} = this.state;
    this.setState({items:items.filter((o,i)=>o.id !== id)})
  }
  render(){
    let {items} = this.state;
    let {rtl = false} = this.props;
    return (
      <>
       {
         items.map((item,i)=>{
           return (
             <SnackebarItem key={item.id} rtl={rtl} {...item} index={i} onRemove={(id)=>this.remove(id)}/>
           )
         })
       }
      </>
    )
  }
}

class SnackebarItem extends Component{
  constructor(props){
    super(props);
    this.state = {mounted:false,timer:0,bottom:0}
  }
  componentDidMount(){
    let {time = 8} = this.props;
    setTimeout(()=>this.setState({mounted:true}),0)
    setTimeout(()=>this.remove(),time * 1000)
  }
  remove(){
    let {onRemove,id} = this.props;
    this.setState({mounted:false})
    setTimeout(()=>onRemove(id),200)
  }
  info_svg(){return (<svg viewBox="0 0 24 24" role="presentation" style={{width: '1.2rem',height: '1.2rem'}}><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" style={{fill: 'currentcolor'}}></path></svg>)}
  success_svg(){return (<svg viewBox="0 0 24 24" role="presentation" style={{width: '1.2rem',height: '1.2rem'}}><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" style={{fill: 'currentcolor'}}></path></svg>)}
  getSvg(type){return type === 'error' || type === 'warning' || type === 'info'?this.info_svg():this.success_svg()}
  getBottom(index){
    let els = $('.aio-popup-snakebar-item-container'),sum = 12;
    for(let i = 0; i < index; i++){sum += els.eq(i).height() + 6;}
    return sum
  }
  render(){
    let {mounted} = this.state;
    let {text,index,type,subtext,action,time,rtl} = this.props;
    let bottom = this.getBottom(index)
    return (
      <div onClick={()=>this.remove()} className={'aio-popup-snakebar-item-container' + (mounted?' mounted':'')} style={{bottom,direction:rtl?'rtl':undefined}}>
        <div className={`aio-popup-snakebar-item aio-popup-snakebar-item-${type}`}>
          <div className={`aio-popup-snakebar-item-icon`}>{this.getSvg(type)}</div>
          <div className='aio-popup-snakebar-item-text'>
            <div>{text}</div>
            {!!subtext && <div className='aio-popup-snakebar-item-subtext'>{subtext}</div>}
          </div>
          {!!action.text && <button className='aio-popup-snakebar-item-action' onClick={(e)=>{e.stopPropagation(); action.onClick()}}>{action.text}</button>}
          <div className={`aio-popup-snakebar-bar`} style={{transition:`${time}s linear`,right:rtl?0:'unset',left:rtl?'unset':0}}></div>  
        </div>
      </div>
    )
  }
}
//id,onClose,backdrop,getTarget,position,fixStyle,attrs,fitHorizontal,animate,openRelatedTo,rtl,body
export class Popover extends Component {
  constructor(props) {
    super(props);
    this.dom = createRef();
  }
  handleClose(e) {
    let { id, onClose = () => { } } = this.props;
    let target = $(e.target);
    let datauniqid = target.attr('datauniqid')
    if (datauniqid === id) { return }
    if (target.parents(`[data-uniq-id=${id}]`).length) { return }
    onClose()
  }
  componentDidMount() {
    this.update($(this.dom.current));
    if (this.props.backdrop === false) {
      $(window).on('click', (e) => this.handleClose(e))
    }
  }
  update(popup) {
    let { getTarget, position } = this.props;
    if (position) { return }
    let target = getTarget();
    if (!target || !target.length) { return }
    var { rtl, openRelatedTo, animate, fitHorizontal, attrs = {}, fixStyle = (o) => o } = this.props;
    Align(popup, target, { fixStyle: fixStyle, pageSelector: openRelatedTo, animate, fitHorizontal, style: attrs.style, rtl })
    popup.focus();
  }
  getClassName() {
    let { attrs = {} } = this.props;
    let { className } = attrs;
    let cls = 'aio-popover';
    if (className) { cls += ' ' + className }
    return cls;
  }
  getPopover(){
    let { attrs = {}, body, id } = this.props;
    return <div {...attrs} ref={this.dom} data-uniq-id={id} className={this.getClassName()}>{body()}</div>
  }
  render() {
    var { backdrop,position} = this.props;
    let popOver = this.getPopover()
    if (!backdrop) { return popOver; }
    let {attrs = {}} = backdrop;
    let backdropProps = {
      onClick: (e) => this.handleClose(e),...attrs,
      className: 'aio-popup-backdrop' + (attrs.className?' ' + attrs.className:'') + (position?` aio-popup-position-${position}`:''),
    }
    return <div {...backdropProps}>{popOver}</div>;
  }
}

function Align(dom,target,config = {}){
  let {fitHorizontal,style,fixStyle = (o)=>o,pageSelector,animate,rtl} = config;
  let $$ = {
    getDomLimit(dom){
      let offset = dom.offset();
      let left = offset.left - window.pageXOffset;
      let top = offset.top - window.pageYOffset;
      let width = dom.outerWidth();
      let height = dom.outerHeight();
      let right = left + width;
      let bottom = top + height;
      return {left,top,right,bottom,width,height};
    },
    getPageLimit(dom,pageSelector){
      let page = pageSelector?dom.parents(pageSelector):undefined;
      page = Array.isArray(page) && page.length === 0?undefined:page;
      let bodyWidth = window.innerWidth;
      let bodyHeight = window.innerHeight;
      let pageLimit = page?$$.getLimit(page):{left:0,top:0,right:bodyWidth,bottom:bodyHeight};
      if(pageLimit.left < 0){pageLimit.left = 0;}
      if(pageLimit.right > bodyWidth){pageLimit.right = bodyWidth;}
      if(pageLimit.top < 0){pageLimit.top = 0;}
      if(pageLimit.bottom > bodyHeight){pageLimit.bottom = bodyHeight;}
      return pageLimit;
    },
    align(){
      let pageLimit = $$.getPageLimit(dom,pageSelector);
      let targetLimit = $$.getDomLimit(target);
      let domLimit = $$.getDomLimit(dom); 
      domLimit.top = targetLimit.bottom
      domLimit.bottom = domLimit.top + domLimit.height;  
      if(fitHorizontal){domLimit.width = targetLimit.width}
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
      //اگر المان از سمت پایین صفحه بیرون زد
      if(domLimit.bottom > pageLimit.bottom){
        if(domLimit.height > targetLimit.top - pageLimit.top){domLimit.top = pageLimit.bottom - domLimit.height;}  
        else{domLimit.top = targetLimit.top - domLimit.height;}
      }
      else{domLimit.top = targetLimit.bottom;}
      let overflowY;
      if(domLimit.height > pageLimit.bottom - pageLimit.top){
        domLimit.top = 6;
        domLimit.bottom = undefined;
        domLimit.height = pageLimit.bottom - pageLimit.top - 12;
        overflowY = 'auto';
      }
      let finalStyle = {left:domLimit.left,top:domLimit.top,width:domLimit.width,overflowY,...style}
        console.log(finalStyle)
        return fixStyle(finalStyle,{targetLimit,pageLimit})
    }
  }
  return $$.align();
}