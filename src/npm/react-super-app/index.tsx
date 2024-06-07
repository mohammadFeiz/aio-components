import React, { useEffect, useState } from 'react';
import {Storage} from '../aio-utils/index.tsx';
import { Icon } from '@mdi/react';
import { mdiMenu, mdiChevronRight, mdiChevronLeft, mdiChevronDown } from '@mdi/js';
import AIOPopup, { AP_alert, AP_confirm, AP_modal, AP_prompt, AP_snackebar } from './../../npm/aio-popup/index.tsx';
import './index.css';
type RN = React.ReactNode
export type I_RSA_props = {
  rtl?:boolean, 
  maxWidth?:number,
  id:string,
  nav:I_RSA_nav,
  side?:I_RSA_side,
  title?:(nav:I_RSA_navItem)=>string,
  subtitle?:(nav:I_RSA_nav)=>string,
  headerContent?:()=>React.ReactNode,
  header?:false | React.ReactNode | (()=>React.ReactNode),
  body:(activeNavItem:I_RSA_navItem)=>React.ReactNode
  theme?:any,
  splashTime?:number,
  splash?:()=>React.ReactNode,
  className?:string,
}
export type I_RSA_setNavId = (navId:string)=>void
export type I_RSA_getNavId = ()=>string;
export type I_RSA_render = ()=>React.ReactNode
export type I_RSA_closeSide = ()=>void
export type I_RSA_openSide = ()=>void
export type I_RSA_navItem = {
  id:string,
  marquee?:boolean,
  disabled?:boolean,
  text:string | (()=>string),
  icon?:React.ReactNode | (()=>React.ReactNode),
  items?:I_RSA_navItem[],
  show?:()=>boolean,
  render?:()=>React.ReactNode
}
export type I_RSA_nav = {
  items:()=>I_RSA_navItem[]
  id?:string,
  header?:()=>React.ReactNode,
  footer?:()=>React.ReactNode,
  cache?:boolean,
  nested?:boolean
}
export type I_RSA_sideItem = {
  icon?:React.ReactNode | (()=>React.ReactNode),
  text:string,
  attrs?:any,
  show?:()=>boolean,
  onClick:Function
}
export type I_RSA_side = {
  items:I_RSA_sideItem[] | (()=>I_RSA_sideItem[]),
  header?:()=>React.ReactNode,
  footer?:()=>React.ReactNode,
  attrs?:any
}
export type I_ReactSuperApp = {
  rootProps:I_RSA_props,
  getActions:(p:any)=>void,
  popup:AIOPopup
}
export type I_RSA_Navigation = {
  nav:I_RSA_nav,navId:string, setNavId:(navId:string)=>void,rtl:boolean,navItems:I_RSA_navItem[],type:'bottom'|'side'
}
export type I_RSA_SideMenu = {
  attrs:any,header?:()=>React.ReactNode,items:I_RSA_sideItem[], onClose:()=>void,footer?:()=>React.ReactNode
}

export default class RSA {
  backButtonCallBack:true | Function;
  rootProps:I_RSA_props;
  popup:AIOPopup;
  getNavId:I_RSA_getNavId;
  setNavId:I_RSA_setNavId;
  removeModal:(id?:string)=>void;
  openSide:I_RSA_openSide;
  closeSide:I_RSA_closeSide;
  addModal:(p:AP_modal)=>void;
  setBackButtonCallBack:(fn:any)=>void;
  render:I_RSA_render;
  addAlert:(p:AP_alert)=>void;
  addSnackebar:(p:AP_snackebar)=>void;
  addConfirm:(p:AP_confirm)=>void;
  addPrompt:(p:AP_prompt)=>void;
  constructor(props:I_RSA_props) {
    RSAValidate(props || {});
    let { rtl} = props;
    this.rootProps = props;
    this.backButtonCallBack = true;
    this.popup = new AIOPopup({ rtl })
    this.removeModal = (obj) => this.popup.removeModal(obj);
    this.addModal = (obj:AP_modal) => this.popup.addModal(obj);
    this.setBackButtonCallBack = (backButtonCallBack)=>this.backButtonCallBack = backButtonCallBack;
    this.getNavId = ()=>''
    this.closeSide = ()=>{}
    this.setNavId = ()=>{}
    this.openSide = ()=>{}
    this.render = () => <ReactSuperApp rootProps={this.rootProps} popup={this.popup} getActions={({getNavId,setNavId,openSide,closeSide})=>{
      this.getNavId = getNavId;
      this.setNavId = setNavId;
      this.openSide = openSide;
      this.closeSide = closeSide;
    }}/>
    this.addAlert = (obj) => this.popup.addAlert(obj);
    this.addSnackebar = (obj:AP_snackebar) => this.popup.addSnackebar(obj);
    this.addConfirm = (obj) => this.popup.addConfirm(obj);
    this.addPrompt = (obj) => this.popup.addPrompt(obj);  
    window.history.pushState({}, '')
    window.onpopstate = () => {
      setTimeout(()=>window.history.pushState({}, ''),100)
      try{
        if(this.backButtonCallBack === true){
          this.removeModal()
        }
        else if(typeof this.backButtonCallBack === 'function'){
          this.backButtonCallBack()
        }
      }
      catch{}
    };  
  }
}
function ReactSuperApp(props:I_ReactSuperApp) {
  let {rootProps,getActions,popup} = props
  let {splash,splashTime = 7000,id,nav,header,headerContent,side,title,subtitle = ()=>'',rtl, className: cls,body,maxWidth} = rootProps;
  let [showSplash,setShowSplash] = useState<boolean>(!!splash);
  let [storage] = useState<Storage>(new Storage('rsa-cache-' + id))
  let navItems = typeof nav.items === 'function'?nav.items():nav.items;
  let [navId,SETNAVID] = useState<false | string>(false)
  useEffect(()=>{
    let navId = (nav.cache?initNavId(storage.load('navId',initNavId())):initNavId())
    SETNAVID(navId);
    if (splash) { setTimeout(() => setShowSplash(false), splashTime) }
    getActions({openSide,closeSide,setNavId,getNavId})
  },[])
  function initNavId(id?:string) {
    if (id) {if (getNavById(id) !== false) { return id }}
    if (nav.id) {if (getNavById(nav.id) !== false) { return nav.id }}
    return navItems.filter(({ show = () => true }) => show())[0].id;
  }
  function getNavId(){return navId}
  function setNavId(navId:string){
    if(nav.cache){storage.save('navId',navId)}
    SETNAVID(navId)
  }
  function header_node(activeNav:I_RSA_navItem | false):RN {
    let Header = typeof header === 'function'?header():header;
    if (Header === false) { return null }
    if(Header){<div className="rsa-header">{Header}</div>}
    let Title:string;
    if(activeNav === false){Title = ''}
    else {
      if(title){Title = title(activeNav)}
      else {
        if(typeof activeNav.text === 'function'){Title = activeNav.text()}
        else {Title = activeNav.text}
      }
    }
    let Subtitle:string = subtitle(nav);
    if(!Title && !side && !headerContent){return null}
    return (
      <div className="rsa-header">
        {!!side && <div className="rsa-side-icon" onClick={() => openSide()}><Icon path={mdiMenu} size={1} /></div>}
        <div className="rsa-header-text">
          {!!Title && <div className="rsa-header-title">{Title}</div>}
          {!!Subtitle && <div className="rsa-header-subtitle">{Subtitle}</div>}
        </div> 
        {!!headerContent && <div className="msf">{(headerContent as any)()}</div> } 
      </div>
    )
  }
  let navResult:I_RSA_navItem | false = false;
  function getNavById(id:string):I_RSA_navItem | false {
    navResult = false;
    getNavById_req(navItems, id);
    return navResult;
  }
  function getNavById_req(items:I_RSA_navItem[], id:string) {
    if (navResult) { return; }
    for (let i = 0; i < items.length; i++) {
      if (navResult) { return; }
      let item:I_RSA_navItem = items[i];
      let { show = () => true } = item;
      if (!show()) { continue }
      if (item.id === id) { navResult = item; break; }
      let navItems = item.items
      if (navItems) {getNavById_req(navItems, id);}
    }
  }
  function navigation_node(type:'bottom' | 'side'):RN {
    if (!nav || !navItems || !navItems.length || navId === false) { return null }
    let props:I_RSA_Navigation = { nav, navId, setNavId, type, rtl:!!rtl,navItems }
    return (<Navigation {...props} navItems={navItems}/>)
  }
  function page_node(navItem:I_RSA_navItem | boolean):RN {
    let content = body(navItem as I_RSA_navItem);
    let activeNav:I_RSA_navItem | false = typeof navId === 'string'?getNavById(navId):false;
    return (
      <div className="rsa-page">
        {header_node(activeNav)}
        <div className="rsa-body">{content}</div>
        {navigation_node('bottom')}
      </div>
    )
  }

  function renderMain():RN {
    if(typeof navId !== 'string'){return null}
    let navItem = getNavById(navId);
    let className = 'rsa-main';
    className += cls ? ' ' + cls : '';
    className += rtl ? ' rtl' : ' ltr';
    return <div className={className}>{navigation_node('side')} {page_node(navItem)}</div>
  }
  function openSide() {
    popup.addModal({
      position: rtl ? 'right' : 'left', id: 'rsadefaultsidemodal',
      setAttrs:(key)=>{if(key === 'backdrop'){return {className:'rsa-sidemenu-backdrop'}}},
      body: ({ close }) => renderSide(close),
    })
  }
  function closeSide(){popup.removeModal('rsadefaultsidemodal')}
  function renderSide(close:()=>void):RN {
    if(!side){return null}
    let items = typeof side.items === 'function'?side.items():side.items;
    let props:I_RSA_SideMenu = {...side,attrs:side.attrs,items,onClose:()=>close()}
    return <SideMenu {...props} />
  }
  return (
    <div className='rsa ai' style={{ maxWidth }}>
      {renderMain()}
      {popup.render()}
      {showSplash && !!splash && splash()}
    </div>
  );
}
function Navigation(props:I_RSA_Navigation) {
  let {nav,navId, setNavId,rtl,navItems,type} = props;
    
  let [openDic,setOpenDic] = useState<{[key:string]:boolean}>({})
  function header_node():RN {
    if (!nav.header) { return null }
    return nav.header()
  }
  function footer_node():RN {
    if (!nav.footer) { return null }
    return nav.footer()
  }
  function items_node(navItems:I_RSA_navItem[], level:number):RN {
    return (
      <div className="rsa-navigation-items">
        {
          navItems.filter(({ show = () => true }) => show()).map((o, i) => {
            if (o.items) {
              let open = openDic[o.id] === undefined ? true : openDic[o.id]
              let column = [item_node(o, level)]
              if (open) { column.push(items_node(o.items, level + 1)) }
              return column
            }
            return item_node(o, level)
          })
        }
      </div>
    )
  }
  function toggle(id:string) {
    let open = openDic[id] === undefined ? true : openDic[id]
    setOpenDic({ ...openDic, [id]: !open })
  }
  function text_node(navItem:I_RSA_navItem,type:'side'|'bottom'):RN {
    let {text,marquee} = navItem;
    text = typeof text === 'function' ? text() : text; 
    let html;
    if (!marquee) { html = text }
    else {html = <marquee behavior='scroll' scrollamount={3} direction='right'>{text}</marquee>}
    if(type === 'side'){return <div className="rsa-navigation-item-text">{html}</div>}
    if(type === 'bottom'){return <div className="rsa-bottom-menu-item-text">{html}</div>}
    return null
  }
  function item_node(o:I_RSA_navItem, level = 0):RN {
    let { id, icon, items ,disabled} = o;
    let active = id === navId;
    let open = openDic[id] === undefined ? true : openDic[id]
    return (
      <div className={'rsa-navigation-item' + (active ? ' active' : '')} onClick={disabled?undefined:() => items ? toggle(id) : setNavId(id)}>
        <div style={{width:level * 16}}></div>
        {
          nav.nested === true &&
          <div className="rsa-toggle">
            {items ? <Icon path={open ? mdiChevronDown : (rtl ? mdiChevronLeft : mdiChevronRight)} size={1} /> : ''}
          </div>
        }
        {
          !!icon &&
          <div className="rsa-navigation-icon">{typeof icon === 'function' ? icon() : icon}</div>
        }
        {text_node(o,'side')}
      </div>
    )
  }
  function bottomMenu_node(o:I_RSA_navItem):RN {
    let { icon, id,disabled } = o;
    let active = id === navId;
    return (
      <div className={'rsa-bottom-menu-item of-visible' + (active ? ' active' : '')} onClick={disabled?undefined:() => setNavId(id)}>
        {!!icon && <div className="rsa-bottom-menu-item-icon">{typeof icon === 'function' ? icon() : icon}</div> }
        {text_node(o,'bottom')}
      </div>
    )
  }
  if (type === 'bottom') {
    return (
      <div className="rsa-bottom-menu-container rsa-show-xs">
        <div className="rsa-bottom-menu">
          {navItems.filter(({ show = () => true }) => show()).map((o) => bottomMenu_node(o))}
        </div>
      </div>
    )
  }
  return (
    <div className="rsa-navigation rsa-hide-xs">
      {header_node()} {items_node(navItems, 0)} {footer_node()}
    </div>
  )
}
function SideMenu(props:I_RSA_SideMenu) {
  let { attrs = {},header,items, onClose,footer } = props;
  function header_node():RN {
    if (!header) { return null }
    return (<div className="rsa-sidemenu-header">{header()}</div>)
  }
  function items_node():RN {
    return (
      <div className="rsa-sidemenu-items">
        {
          items.map((o, i) => {
            let { icon = () => <div style={{ width: 12 }}></div>, text, attrs = {}, onClick = () => { }, show = () => true } = o;
            let Show = show();
            if(Show === false){return null}
            return (
              <div className={'rsa-sidemenu-item' + (attrs.className ? ' ' + attrs.className : '')} style={attrs.style} onClick={()=>{onClick(o); onClose()}}>
                <div className="rsa-sidemenu-item-icon">{typeof icon === 'function'?icon():icon}</div>
                <div className="rsa-sidemenu-item-text">{text}</div>
              </div>
            )
          })
        }
      </div>
    )
  }
  function footer_node():RN {
    if (!footer) { return null }
    return (
      <div className="rsa-sidemenu-footer">{footer()}</div>
    )
  }
  return (
    <div {...attrs} className={'rsa-sidemenu' + (attrs.className ? ' ' + attrs.className : '')}>
      {header_node()} {items_node()} {footer_node()}
    </div>
  )
}
const RSANavInterface = `
{
  id?:string,
  items:[],
  header?:()=>React.ReactNode,
  footer?:()=>React.ReactNode,
  cache?:boolean,
  disabled?:boolean
}
`
const RSANavItemInterface = `
{
  id:string,
  text:string | ()=>string,
  icon?:React.ReactNode || ()=>React.ReactNode,
  items?:[],
  show?:()=>boolean
}
`
function RSAValidate(props:any){
  let error = RSAValidateError(props);
  if(error){alert(error)}
}

function RSAValidateError(props:any){
  let validProps = ['id','rtl','title','nav','subtitle','body','header','headerContent','maxWidth','side','theme']
  for(let prop in props){
    if(validProps.indexOf(prop) === -1){
      return `
        react-super-app error => invalid props (${prop}). 
        valid properties are 'id','rtl','title','nav','subtitle','body','header','headerContent','maxWidth','side','theme'
      `
    }
  }
  if(props.rtl !== undefined && typeof props.rtl !== 'boolean'){
    return `
        react-super-app error => rtl props should be boolean. 
      `
  }
  if(!props.id || typeof props.id !== 'string'){
    return `
        react-super-app error => id props should be an string but is ${props.id}. 
      `
  }
  if(props.title !== undefined && typeof props.title !== 'function'){
    return `
        react-super-app error => title props should be a functon that get nav item as parameter and returns string. 
      `
  }
  if(props.subtitle !== undefined && typeof props.subtitle !== 'function'){
    return `
        react-super-app error => subtitle props should be a functon that get nav item as parameter and returns string. 
      `
  }
  if(props.headerContent !== undefined && typeof props.headerContent !== 'function'){
    return `
      react-super-app error => headerContent props should be a functon that returns html. 
    `
  }
  if(typeof props.body !== 'function'){
    return `
        react-super-app error => body props should be a funtion that returns html. 
      `
  }
  let navError = RSAValidateNav(props.nav)
  if(navError){return navError}
  let sideError = RSAValidateSide(props.side)
  if(sideError){return sideError}

}
function RSAValidateSide(side:I_RSA_side){
  //type I_Sidemenu_props = {items:I_SideMenu_props_item[],header:()=>React.ReactNode,footer:()=>React.ReactNode,attrs:object}
//type I_SideMene_props_item = {icon?:React.ReactNode | ()=>React.ReactNode,text:String,className?:String,style?:Object,onClick?:()=>void,show?:()=>boolean}
  if(!side){return}
  let side_validProps = ['items','header','footer','attrs']
  for(let prop in side){
    if(side_validProps.indexOf(prop) === -1){
      return `
        react-super-app error => invalid side property (${prop}). 
        valid side properties are 'items','header','footer','attrs'
      `
    }
  }
  let sideItemError = 'each side item should be an object cointan {icon?:React.ReactNode | ()=>React.ReactNode,text:String,attrs?:object,show?:()=>boolean,onClick:function|undefined}'
  if(!side.items || (!Array.isArray(side.items) && typeof side.items !== 'function')){
    return `
      react-super-app error => side.items should be an array of objects or function that returns array of objects 
      ${sideItemError}
    `
  }
  for(let i = 0; i < side.items.length; i++){
    let {items:I} = side;
    let items:I_RSA_sideItem[] = typeof I === 'function'?I():I;
    let item = items[i];
    let {text,show = ()=>true,attrs = {}} = item;
    let sideItem_validProps = ['text','icon','attrs','show','onClick']
    for(let prop in item){
      if(sideItem_validProps.indexOf(prop) === -1){
        return `
          react-super-app error => side.items[${i}].${prop} is not a valid side item property.
          ${sideItemError}
        `
      }
    }
    if(typeof show !== 'function'){
      return `
        react-super-app error => side.items[${i}].show should be a function that returns boolean.
        ${sideItemError}
      `
    }
    if(typeof attrs !== 'object' || Array.isArray(attrs)){
      return `
        react-super-app error => side.items[${i}].attrs should be an object contain dom attributes.
        ${sideItemError}
      `
    }
    if(!text || typeof text !== 'string'){return `react-super-app error => side.items[${i}].text should be an string`}
  }
}
function RSAValidateNav(nav:I_RSA_nav){
  if(typeof nav !== 'object' || Array.isArray(nav)){
    return `
      react-super-app error => nav props should be an object contain ${RSANavInterface}.
      each nav item should be an object contain ${RSANavItemInterface}
    `
  }
  let nav_validProps = ['id','items','header','footer','cache','nested']
  for(let prop in nav){
    if(nav_validProps.indexOf(prop) === -1){
      return `
        react-super-app error => invalid nav property (${prop}). 
        valid nav properties are ${nav_validProps.join(' - ')}
      `
    }
  }
  if(nav.id && typeof nav.id !== 'string'){return `react-super-app error => exist nav.id should be an string`}
  if(!nav.items || typeof nav.items !== 'function'){return `
    react-super-app error => nav.items should be a function that returns array of nav items.
    each nav item type is:
    ${RSANavItemInterface}
  `}
  let navItems:I_RSA_navItem[] = typeof nav.items === 'function'?nav.items():nav.items
  let itemsError = RSAValidateNavItems(navItems || [])
  if(itemsError){return itemsError}
}
function RSAValidateNavItems(items:I_RSA_navItem[],path?:string):string | undefined{
  path = path || 'nav';
  items = items || []
  let navItemError = `
    nav item should be an object contain 
    ${RSANavItemInterface}
  `
  for(let i = 0; i < items.length; i++){
    let item = items[i];
    let {id,text,show = ()=>true,render} = item;
    let usedIds:string[] = [];
    let navItem_validProps = ['id','items','icon','show','text','render','disabled']
    for(let prop in item){
      if(navItem_validProps.indexOf(prop) === -1){
        return `
          react-super-app error => ${path}.items[${i}].${prop} is not a valid nav item property.
          ${navItemError}
        `
      }
    }
    if(render && typeof render !== 'function'){
      return `
        react-super-app error => ${path}.items[${i}].render should be a function that returns html.
        ${navItemError}
      `
    }
    if(typeof show !== 'function'){
      return `
        react-super-app error => ${path}.items[${i}].show should be a function that returns boolean.
        ${navItemError}
      `
    }
    if(!id || typeof id !== 'string'){
      return `
        react-super-app error => ${path}.items[${i}].id should be an string.
        ${navItemError}
      `
    }
    if(usedIds.indexOf(id) !== -1){
      return `
        react-super-app error => ${path}.items[${i}].id is duplicate.
        ${navItemError}
      `
    }
    usedIds.push(item.id)
    if(!text || typeof text !== 'string'){return `react-super-app error => ${path}.items[${i}].text should be an string`}
    let ITEMS:I_RSA_navItem[] = item.items || []
    let itemsError = RSAValidateNavItems(ITEMS,path + `.items[${i}]`);
    if(itemsError){return itemsError}
  }
}