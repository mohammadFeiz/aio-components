import React, { Component, createRef } from 'react';
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
          getActions={({addModal,remove})=>{
            this._addModal = addModal;
            this._remove = remove;
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
  remove = (arg)=> this._remove(arg);
  addConfirm = (obj = {})=>{
    this.addModal({
      id:obj.id,
      attrs:obj.attrs,
      type:obj.type || 'confirm',
      body:()=>obj.text,
      title:obj.title,
      onClose:obj.onClose,
      backClose:obj.backClose,
      backdropAttrs:obj.backdropAttrs,
      footerButtons:obj.footerButtons,
      onClose:obj.onClose,
      animate:obj.animate
    })
  }
  addPrompt = (obj = {})=>{
    this.addModal({
      id:obj.id,
      attrs:obj.attrs,
      type:'prompt',
      title:obj.title,
      text:obj.text,
      onClose:obj.onClose,
      backClose:obj.backClose,
      backdropAttrs:obj.backdropAttrs,
      footerButtons:obj.footerButtons,
      onClose:obj.onClose,
      animate:obj.animate,
      onSubmit:obj.onSubmit
    })
  }
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
    this.state = {modals: []}
    getActions({
      remove: this.remove.bind(this),
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
  async remove(arg) {
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
    return modals.map(({ 
      blur, type,text,onSubmit, rtl = this.props.rtl, attrs = {}, onClose,backClose, title,subtitle, headerButtons,footerButtons, closeType, body, id, animate }, i) => {
      let props = {
        id, animate,backClose,footerButtons,text,onSubmit,
        key: i, blur:i === modals.length - 2,
        ...modalConfig,
        blur, type, rtl, attrs, onClose, title,subtitle, headerButtons, closeType, body,index: i,rtl,
        onClose: () => this.remove(),
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
    this.state = {mounted:props.animate === false,promptValue:''}
  }
  async onClose() {
    let { onClose } = this.props;
    this.setState({mounted:false});
    setTimeout(()=>onClose(),300)
  }
  componentDidMount(){
    let {mounted} = this.props;
    if(mounted === true){return}
    setTimeout(()=>this.setState({mounted:true}),0)
  }
  header_layout() {
    let { title, headerButtons, rtl, closeType = 'close button',subtitle } = this.props;
    if (!title && !headerButtons) { return false }
    return {
      className: 'aio-popup-header',
      row: [
        { show: closeType === 'back button' && this.props.onClose !== false, html: <Icon path={rtl ? mdiChevronRight : mdiChevronLeft} size={1} />, align: 'vh', onClick: () => this.onClose() },
        { show: closeType === 'back button' && this.props.onClose !== false, size: 6 },
        { show:!!title && !subtitle,flex: 1, html: title, align: 'v', className: 'aio-popup-title' },
        { 
          show:!!title && !!subtitle,flex: 1, align: 'v',
          column:[
            {html:title,className: 'aio-popup-title'},
            {html:subtitle,className: 'aio-popup-subtitle'}
          ]  
        },
        {
          show:!!headerButtons,gap:6,align:'vh',
          row:()=>headerButtons.map(([text,attrs = {}])=>{
            let {onClick = ()=>{}} = attrs;
            attrs.onClick = ()=> onClick({close:this.onClose.bind(this)})
            return {attrs,html:text,align:'vh',className:'aio-popup-header-button' + (attrs.className?' ' + attrs.className:''),style:attrs.style}
          })
        },
        { show: closeType === 'close button' && this.props.onClose !== false, size: 48, html: <Icon path={mdiClose} size={0.8} />, align: 'vh', onClick: () => this.onClose() }
      ]
    }
  }
  getFooterButtons(){
    let { type,footerButtons,closeText = 'close',submitText = 'submit'} = this.props;
    if(type === 'prompt'){
      let {promptValue} = this.state;
      let {onSubmit} = this.props;
      if(typeof onSubmit !== 'function'){console.error('aio-popup => addPrompt => onSubmit props is not a function')}
      return [
        [closeText,{onClick:()=>this.onClose(),className:'aio-popup-prompt-close-button'}],
        [submitText,{onClick:onSubmit?()=>onSubmit(promptValue):undefined,disabled:!promptValue,className:'aio-popup-prompt-submit-button'}]
      ]
    }
    return footerButtons
  }
  footer_layout() {
    let footerButtons = this.getFooterButtons()
    if (!footerButtons) { return false }
    return {
      className: 'aio-popup-footer',
      row: [
        {
          gap:6,align:'vh',
          row:()=>footerButtons.map(([text,attrs = {}])=>{
            let {onClick = ()=>{}} = attrs;
            let className = 'aio-popup-footer-button' + (attrs.className?' ' + attrs.className:'');
            attrs.onClick = ()=> onClick({close:this.onClose.bind(this)})
            return {html:(
              <button {...{...attrs,className}}>{text}</button>
            ),align:'vh'}
          })
        }
      ]
    }
  }
  getBackDropClassName() {
    let { blur, className: cls,type = 'fullscreen' } = this.props;
    let className = 'aio-popup-backdrop';
    if (cls) { className += className ? (' ' + cls) : '' }
    if (blur) { className += ' aio-popup-blur' }
    className += ` aio-popup-${type}`
    return className
  }
  backClick(e) {
    let target = $(e.target);
    let { backClose } = this.props;
    if (!backClose) { return }
    if(!target.hasClass('aio-popup-backdrop')){return}
    this.onClose()
  }
  getBody(){
    let {body,type = 'fullscreen',text} = this.props;
    if(type === 'prompt'){
      let {promptValue} = this.state;
      return (
        <textarea placeholder={text} type='text' value={promptValue} onChange={(e)=>this.setState({promptValue:e.target.value})}/>
      )
    }
    return body({close:this.onClose.bind(this)})
  }
  render() {
    let { rtl, attrs = {}, id } = this.props;
    let {mounted} = this.state
    let backdropProps = {
      className: this.getBackDropClassName(),
      onClick: (e) => this.backClick(e),
      'data-popup-id': id,
    }
    let style = { ...attrs.style,flex:'none'}
    let className = 'aio-popup' + (rtl ? ' rtl' : ' ltr') + (' ' + this.dui) + (!mounted?' not-mounted':'') + (attrs.className?' ' + attrs.className:'');
    return (
      <div {...backdropProps}>
        <RVD
          layout={{
            attrs:{...attrs,ref:this.dom,style:undefined,className:undefined},
            className,style,
            column: [
              this.header_layout(),
              { flex: 1, html: <div className='aio-popup-body'>{this.getBody()}</div> },
              this.footer_layout()
            ]
          }}
        />
      </div>
    )
  }
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
            <div class='aio-popup-alert-text'>${text}</div>
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
              if ($$.time >= 100) {
                  $$.time = 100;
                  $$.close();
                  return
              }
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
  info_svg(){
    return (
      <svg viewBox="0 0 24 24" role="presentation" style={{width: '1.2rem',height: '1.2rem'}}><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" style={{fill: 'currentcolor'}}></path></svg>
    )
  }
  success_svg(){
    return (
      <svg viewBox="0 0 24 24" role="presentation" style={{width: '1.2rem',height: '1.2rem'}}><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" style={{fill: 'currentcolor'}}></path></svg>
    )
  }
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
    let { getTarget, popoverSide } = this.props;
    if (popoverSide) { return }
    let target = getTarget();
    if (!target || !target.length) { return }
    var { rtl, openRelatedTo, animate, fitHorizontal, attrs = {}, fixPopupPosition = (o) => o, popupWidth } = this.props;
    Align(popup, target, { fixStyle: fixPopupPosition, pageSelector: openRelatedTo, animate, fitHorizontal, style: attrs.style, rtl })
    popup.focus();
  }
  getClassName() {
    let { attrs = {}, className } = this.props;
    let { className: popupClassName } = attrs;
    let cls = 'aio-popover';
    if (popupClassName) { cls += ' ' + popupClassName }
    else if (className) { cls += ' ' + className }
    return cls;
  }
  getBackClassName() {
    let { backdropAttrs = {}, popoverSide } = this.props;
    let { className: backdropClassName } = backdropAttrs;
    let className = 'aio-popover-backdrop';
    if (backdropClassName) { className += ' ' + backdropClassName }
    if (popoverSide === 'center') { className += ' aio-popover-center' }
    if (popoverSide === 'left') { className += ' aio-popover-left' }
    if (popoverSide === 'right') { className += ' aio-popover-right' }
    if (popoverSide === 'top') { className += ' aio-popover-top' }
    if (popoverSide === 'bottom') { className += ' aio-popover-bottom' }
    if (popoverSide === 'top right') { className += ' aio-popover-topright' }
    if (popoverSide === 'top left') { className += ' aio-popover-topleft' }
    if (popoverSide === 'bottom right') { className += ' aio-popover-bottomright' }
    if (popoverSide === 'bottom left') { className += ' aio-popover-bottomleft' }
    return className;
  }
  //start
  render() {
    var { attrs = {}, body, backdropAttrs = {}, backdrop, id } = this.props;
    let props = {
      className: this.getBackClassName(),
      style: backdropAttrs.style,
      onClick: (e) => this.handleClose(e),
    }
    let popOver = (
      <div {...attrs} ref={this.dom} data-uniq-id={id} className={this.getClassName()}>
        {body()}
      </div>
    )
    if (backdrop === false) { return popOver; }
    return <div {...props}>{popOver}</div>;
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
      if(animate){
        let beforeTop = finalStyle.top + 90,afterTop = finalStyle.top,obj;
        if(animate === true){
          finalStyle.top = beforeTop; finalStyle.opacity = 0;
          obj = {top:afterTop,opacity:1}
        }
        else{obj = animate}
        dom.css(fixStyle(finalStyle,{targetLimit,pageLimit}))
        dom.animate(obj,{duration:100})
      }
      else{
        dom.css(fixStyle(finalStyle,{targetLimit,pageLimit}))
      }
    }
  }
  $$.align();
}