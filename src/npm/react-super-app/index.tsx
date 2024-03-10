import React, { Component, useEffect, useState } from 'react';
import AIOStorage from '../aio-storage/aio-storage';
import { Icon } from '@mdi/react';
import { mdiMenu, mdiChevronRight, mdiChevronLeft, mdiChevronDown } from '@mdi/js';
import RVD from '../react-virtual-dom/react-virtual-dom';
import AIOPopup from '../aio-popup/aio-popup';
import './index.css';
import { I_RSA_Navigation, I_RSA_props, I_ReactSuperApp, I_rsa_navItem } from './types';
import { I_RVD_node } from '../react-virtual-dom/types';

export default class RSA {
  backButtonCallBack:true | Function;
  rootProps:I_RSA_props;
  popup:any;
  constructor(props:I_RSA_props) {
    RSAValidate(props || {});
    let { rtl, maxWidth,nav,side,title,subtitle,headerContent,header,body,id,theme } = props;
    this.rootProps = props;
    this.backButtonCallBack = true;
    this.popup = new AIOPopup({ rtl })
    this.props = {
      maxWidth,nav,side,title,subtitle,headerContent,header,body,id,theme,
      getActions:({getNavId,setNavId,openSide,closeSide})=>{
        this.getNavId = getNavId;
        this.setNavId = setNavId;
        this.openSide = openSide;
        this.closeSide = closeSide;
      }
    }
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
  setBackButtonCallBack = (backButtonCallBack)=>this.backButtonCallBack = backButtonCallBack;
  render = () => <ReactSuperApp rootProps={this.rootProps} popup={this.popup}/>
  addModal = (obj) => this.props.popup.addModal(obj);
  addAlert = (obj) => this.props.popup.addAlert(obj);
  removeModal = (obj) => this.props.popup.removeModal(obj);
  addSnakebar = (obj) => this.props.popup.addSnakebar(obj);
  addConfirm = (obj) => this.props.popup.addConfirm(obj);
  addPrompt = (obj) => this.props.popup.addPrompt(obj);
  
}
function ReactSuperApp(props:I_ReactSuperApp) {
  let {rootProps,getActions,popup} = props
  let {splash,splashTime = 7000,id,nav,header,headerContent,side,title,subtitle = ()=>'',rtl, className: cls,body} = rootProps;
  let [showSplash,setShowSplash] = useState<boolean>(!!splash);
  let [storage] = useState(AIOStorage('rsa-cache-' + id))
  let navItems = typeof nav.items === 'function'?nav.items():nav.items;
  let [navId,SETNAVID] = useState<false | string>(false)
  useEffect(()=>{
    let navId = (nav.cache?initNavId(storage.load({name:'navId',def:initNavId()})):initNavId())
    SETNAVID(navId);
    if (splash) { setTimeout(() => setShowSplash(false), splashTime) }
    getActions({openSide,closeSide,setNavId,getNavId})
  },[])
  function initNavId(id?:string) {
    if (id) {if (getNavById(id) !== false) { return id }}
    if (nav.id) {if (this.getNavById(nav.id) !== false) { return nav.id }}
    return navItems.filter(({ show = () => true }) => show())[0].id;
  }
  function getNavId(){return navId}
  function setNavId(navId:string){
    if(nav.cache){storage.save({name:'navId',value:navId})}
    SETNAVID(navId)
  }
  function header_node(activeNav):I_RVD_node {
    let Header = typeof header === 'function'?header():header;
    if (Header === false) { return {} }
    if(Header){return {style: { flex: 'none', width: '100%' }, className: 'rsa-header of-visible align-v',html: Header}}
    let Title:string;
    if(title){Title = title(activeNav)}
    else {Title = activeNav?activeNav.text:''}
    let Subtitle:string = subtitle(activeNav);
    if(!Title && !side && !headerContent){return {}}
    return {
      style: { flex: 'none'}, className: 'rsa-header of-visible align-v w-100',
      row: [
        { size: 60, show: !!side, html: <Icon path={mdiMenu} size={1} />, className: 'align-vh',onClick: () => openSide()},
        {
          show: !!Title,
          column:[
            {  html: Title, className: 'rsa-header-title' },
            {  show:!!Subtitle,html: Subtitle, className: 'rsa-header-subtitle' }
          ]
        },
        {show:!!title || !!side ,flex:1},
        { flex: !!title || !!side?undefined:1, show: !!headerContent, html: () => headerContent(), className: 'of-visible' },
      ]
    }
  }
  let navResult = false;
  function getNavById(id) {
    navResult = false;
    getNavById_req(navItems, id);
    return navResult;
  }
  function getNavById_req(items, id) {
    if (navResult) { return; }
    for (let i = 0; i < items.length; i++) {
      if (navResult) { return; }
      let item = items[i];
      let { show = () => true } = item;
      if (!show()) { continue }
      if (item.id === id) { navResult = item; break; }
      let navItems = typeof item.items === 'function'?item.items():item.items
      if (navItems) {getNavById_req(navItems, id);}
    }
  }
  function navigation_node(type:'bottom' | 'side'):I_RVD_node {
    if (!nav || !navItems || !navItems.length) { return {} }
    let props:I_RSA_Navigation = { nav, navId, setNavId, type, rtl }
    return { className: 'of-visible' + (type === 'bottom'?' rsa-bottom-menu-container':''), html: (<Navigation {...props} navItems={navItems}/>) };
  }
  function page_node(navItem:I_rsa_navItem | boolean):I_RVD_node {
    let content = body(navItem as I_rsa_navItem);
    let activeNav = getNavById(navId);
    return {
      flex: 1,
      column: [
        header_node(activeNav),
        { flex: 1, html: <div className='rsa-body'>{content}</div> },
        navigation_node('bottom')
      ]
    }
  }

  function renderMain() {
    let navItem = getNavById(navId);
    let className = 'rsa-main';
    className += cls ? ' ' + cls : '';
    className += rtl ? ' rtl' : ' ltr';
    let rootNode:I_RVD_node = { className }
    rootNode.row = [navigation_node('side'), page_node(navItem)]
    return (<RVD rootNode={rootNode} />)
  }
  function openSide() {
    popup.addModal({
      position: rtl ? 'right' : 'left', id: 'rsadefaultsidemodal',
      backdrop:{attrs:{className:'rsa-sidemenu-backdrop'}},
      body: { render: ({ close }) => renderSide(close) },
    })
  }
  function closeSide(){popup.removeModal('rsadefaultsidemodal')}
  function renderSide(close) {
    let items = typeof side.items === 'function'?side.items():side.items;
    return <SideMenu {...side} items={items} rtl={rtl} onClose={() => close()} />
  }
  let { className, maxWidth,theme } = this.props;
  return (
    <div className={`rsa-container` + (className ? ' ' + className : '') + (theme ? ' ' + theme : '')} style={{direction:rtl?'rtl':'ltr'}}>
      <div className='rsa' style={{ maxWidth }}>
        {renderMain()}
        {popup.render()}
        {showSplash && splash()}
      </div>
    </div>
  );
}
function Navigation(props:I_RSA_Navigation) {
  let [openDic,setOpenDic] = useState({})
  function header_node() {
    let { nav } = this.props;
    if (!nav.header) { return { size: 12 } }
    return { html: nav.header() };
  }
  function footer_node() {
    let { nav } = this.props;
    if (!nav.footer) { return { size: 12 } }
    return { html: nav.footer() };
  }
  function items_node(navItems, level) {
    return {
      flex: 1, className: 'ofy-auto',
      column: navItems.filter(({ show = () => true }) => show()).map((o, i) => {
        if (o.items) {
          let { openDic } = this.state;
          let open = openDic[o.id] === undefined ? true : openDic[o.id]
          let column = [this.item_node(o, level)]
          if (open) { column.push(this.items_node(o.items, level + 1)) }
          return { column }
        }
        return this.item_node(o, level)
      })
    }
  }
  function toggle(id) {
    let { openDic } = this.state;
    let open = openDic[id] === undefined ? true : openDic[id]
    this.setState({ openDic: { ...openDic, [id]: !open } })
  }
  function text_node({text,marquee},type) {
    text = typeof text === 'function' ? text() : text; 
    let html;
    if (!marquee) { html = text }
    else {
      html = <marquee behavior='scroll' scrollamount={3} direction='right'>{text}</marquee>
    }
    if(type === 'side'){return { html, className: 'align-v' }}
    if(type === 'bottom'){return { html, className: 'rsa-bottom-menu-item-text align-vh' }}
  }
  function item_node(o, level = 0) {
    let { setNavId, navId, rtl,nav } = this.props;
    let { openDic } = this.state;
    let { id, icon, items ,disabled} = o;
    let active = id === navId;
    let open = openDic[id] === undefined ? true : openDic[id]
    return {
      className: 'rsa-navigation-item' + (active ? ' active' : ''), onClick: disabled?undefined:() => items ? this.toggle(id) : setNavId(id),
      row: [
        { size: level * 16 },
        { show:nav.nested === true,size: 24, html: items ? <Icon path={open ? mdiChevronDown : (rtl ? mdiChevronLeft : mdiChevronRight)} size={1} /> : '', className: 'align-vh' },
        { show: !!icon, size: 48, html: () => typeof icon === 'function' ? icon(active) : icon, className: 'align-vh' },
        this.text_node(o,'side')
      ]
    }
  }
  function bottomMenu_node(o) {
    let { icon, id,disabled } = o;
    let { navId, setNavId } = this.props;
    let active = id === navId;
    return {
      flex: 1, className: 'rsa-bottom-menu-item of-visible' + (active ? ' active' : ''), onClick: disabled?undefined:() => setNavId(id),
      column: [
        { show: !icon,flex: 1 },
        { show: !!icon,flex: 2 },
        { show: !!icon, html: () => typeof icon === 'function' ? icon(active) : icon, className: 'of-visible rsa-bottom-menu-item-icon align-vh' },
        { show: !!icon,flex: 1 },
        this.text_node(o,'bottom'),
        { flex: 1 }
      ]
    }
  }
  let { type, navItems } = this.props;
  if (type === 'bottom') {
    return (<RVD rootNode={{ className: 'rsa-bottom-menu', hide_sm: true, hide_md: true, hide_lg: true, row: navItems.filter(({ show = () => true }) => show()).map((o) => this.bottomMenu_node(o)) }} />)
  }
  return (<RVD rootNode={{ hide_xs: true, className: 'rsa-navigation', column: [this.header_node(), this.items_node(navItems, 0),this.footer_node()] }} />);
}
class SideMenu extends Component {
  header_node() {
    let { header } = this.props;
    if (!header) { return false }
    return { html: header(), className: 'rsa-sidemenu-header' };
  }
  items_node() {
    let { items, onClose } = this.props;
    return {
      flex: 1,
      column: items.map((o, i) => {
        let { icon = () => <div style={{ width: 12 }}></div>, text, attrs = {}, onClick = () => { }, show = () => true } = o;
        let Show = show();
        return {
          style:attrs.style,
          show: Show !== false, size: 36, className: 'rsa-sidemenu-item' + (attrs.className ? ' ' + attrs.className : ''), onClick: () => { onClick(o); onClose() },
          row: [
            { size: 48, html: typeof icon === 'function'?icon():icon, className: 'align-vh' },
            { html: text, className: 'align-v' }
          ]
        }
      })
    }
  }
  footer_node() {
    let { footer } = this.props;
    if (!footer) { return false }
    return { html: footer(), className: 'rsa-sidemenu-footer' };
  }
  componentDidMount() {
    setTimeout(() => this.setState({ open: true }), 0)
  }
  render() {
    let { attrs = {} } = this.props;
    return (
      <RVD
        rootNode={{
          attrs,
          className: 'rsa-sidemenu' + (attrs.className ? ' ' + attrs.className : ''),
          column: [this.header_node(), this.items_node(), this.footer_node()]
        }}
      />
    );
  }
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
function RSAValidate(props){
  let error = RSAValidateError(props);
  if(error){alert(error)}
}

function RSAValidateError(props){
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
function RSAValidateSide(side){
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
    let item = side.items[i];
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
function RSAValidateNav(nav){
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
        valid nav properties are ${nav_validProps.split(' - ')}
      `
    }
  }
  if(nav.id && typeof nav.id !== 'string'){return `react-super-app error => exist nav.id should be an string`}
  if(!nav.items || (!Array.isArray(nav.items) && typeof nav.items !== 'function')){return `
    react-super-app error => nav.items should be an array or function.
  `}
  let itemsError = RSAValidateNavItems(nav.items)
  if(itemsError){return itemsError}
}
function RSAValidateNavItems(items = [],path = 'nav'){
  let navItemError = `
    nav item should be an object contain 
    ${RSANavItemInterface}
  `
  for(let i = 0; i < items.length; i++){
    let item = items[i];
    let {id,text,show = ()=>true,render} = item;
    let usedIds = [];
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
    let itemsError = RSAValidateNavItems(item.items,path + `.items[${i}]`);
    if(itemsError){return itemsError}
  }
}