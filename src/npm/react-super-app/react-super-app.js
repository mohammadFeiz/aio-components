import React, { Component,useReducer } from 'react';
import AIOStorage from './../../npm/aio-storage/aio-storage';
import { Icon } from '@mdi/react';
import { mdiMenu, mdiChevronRight, mdiChevronLeft, mdiChevronDown } from '@mdi/js';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOPopup from '../aio-popup/aio-popup';
import './react-super-app.css';
export default class RSA {
  constructor(props = {}) {
    let { rtl, maxWidth,initialState,AppContext,navs,navId,side,title,subtitle } = props;
    this.rtl = rtl;
    this.maxWidth = maxWidth;
    this.AppContext = AppContext;
    this.popup = new AIOPopup({ rtl })
    this.initialState = initialState;
    this.navs = navs;
    this.navId = navId;
    this.side = side;
    this.title = title;
    this.subtitle = subtitle;
  }
  state = {}
  GetState = ()=>this.state;
  render = (props) => {
    return (
      <RSAAPP
        AppContext={this.AppContext}
        updateState={(state)=>this.state = state}
        props={props}
        navs={this.navs}
        side={this.side}
        navId={this.navId}
        rtl={this.rtl}
        popup={this.popup}
        title={this.title}
        subtitle={this.subtitle}
        maxWidth={this.maxWidth}
        initialState={this.initialState}
        getActions={({getNavId,setNavId,openSide,closeSide,SetState})=>{
          this.getNavId = getNavId;
          this.setNavId = setNavId;
          this.openSide = openSide;
          this.closeSide = closeSide;
          this.SetState = SetState;
        }}
      />
    )
  }
  addModal = (obj) => this.popup.addModal(obj);
  removeModal = (obj) => this.popup.removeModal(obj);
  addSnakebar = (obj) => this.popup.addSnakebar(obj);
}
function REDUCER(state,action){
  return {...state,[action.key]:action.value}
}
function RSAAPP({initialState = {},getActions,popup,rtl,maxWidth,AppContext,updateState,navs,side,navId,title,subtitle,props}){
  let [state,dispatch] = useReducer(REDUCER,initialState)
  function SetState(key,value){dispatch({key,value})}
  function GetState(key){return key?state[key]:{...state}}
  function getContext(){return {state:{...state},actions:props.actions,SetState,GetState,...popup}}
  updateState(state)
  let PROPS = {...props,title,subtitle,navs,side,navId,popup,rtl,maxWidth,getActions:(obj)=>getActions({...obj,SetState})} 
  return (<AppContext.Provider value={getContext()}><ReactSuperApp {...PROPS}/></AppContext.Provider>);
}

class ReactSuperApp extends Component {
  constructor(props) {
    super(props);
    let { touch = 'ontouchstart' in document.documentElement, splash, splashTime = 7000 } = props;
    this.storage = AIOStorage('rsa-cache');
    window.oncontextmenu = function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
    this.state = {
      navId: this.initNavId(),
      splash,
      showSplash: true,
      confirm: false,
      touch,
      changeTheme: (index) => {
        let { themes } = props;
        this.theme = this.theme || 0;
        if (index === 'init') {
          this.theme = this.storage.load({ name: 'theme', value: 0 });
        }
        else if (typeof (index) === 'number') {
          this.theme = index;
        }
        else {
          this.theme++;
        }
        this.storage.save({ value: this.theme, name: 'theme' });
        if (this.theme > themes.length - 1) { this.theme = 0 }
        let target;
        try {
          target = themes[this.theme] || {};
        }
        catch { target = {} }
        for (let prop in target) {
          document.documentElement.style.setProperty(prop, target[prop]);
        }

      },
      openSide:this.openSide.bind(this),
      closeSide:this.closeSide.bind(this),
      setNavId: this.setNavId.bind(this),
      getNavId:this.getNavId.bind(this)
    }
    if (props.themes) { this.state.changeTheme('init') }
    if (splash) { setTimeout(() => this.setState({ splash: false }), splashTime) }
    props.getActions({ ...this.state })
  }
  getNavId(){return this.state.navId}
  setNavId(navId){this.setState({navId})}
  initNavId() {
    let { navs, navId } = this.props;
    if (!navs) { return false }
    if (navId) {
      let res = this.getNavById(navId);
      if (res !== false) { return navId }
    }
    if (!navs.length) { return false }
    return navs.filter(({ show = () => true }) => show())[0].id;
  }
  header_layout(nav) {
    let { header} = this.props;
    let Header = typeof header === 'function'?header():header;
    if (Header === false) { return false }
    if(Header){return {style: { flex: 'none', width: '100%' }, align: 'v', className: 'rsa-header of-visible',html: Header}}
    let { headerContent, side, title = () => nav?nav.text:'' ,subtitle = ()=>{}} = this.props;
    let Title = title(nav);
    let Subtitle = subtitle(nav);
    if(!Title && !side && !headerContent){return false}
    return {
      style: { flex: 'none', width: '100%' }, align: 'v', className: 'rsa-header of-visible',
      row: [
        { size: 60, show: !!side, html: <Icon path={mdiMenu} size={1} />, align: 'vh', attrs: { onClick: () => this.openSide() } },
        {
          show: !!Title,
          column:[
            {  html: Title, className: 'rsa-header-title' },
            {  show:!!Subtitle,html: Subtitle, className: 'rsa-header-subtitle' }
          ]
        },
        { flex: 1, show: !!headerContent, html: () => headerContent(), className: 'of-visible' },
      ]
    }
  }
  getNavById(id) {
    let { navs } = this.props;
    this.res = false;
    this.getNavById_req(navs, id);
    return this.res;
  }
  getNavById_req(navs, id) {
    if (this.res) { return; }
    for (let i = 0; i < navs.length; i++) {
      if (this.res) { return; }
      let nav = navs[i];
      let { show = () => true } = nav;
      if (!show()) { continue }
      if (nav.id === id) { this.res = nav; break; }
      if (nav.navs) { this.getNavById_req(nav.navs, id); }
    }
  }
  getMainClassName() {
    let { rtl, className: cls } = this.props;
    let className = 'rsa-main';
    className += cls ? ' ' + cls : '';
    className += rtl ? ' rtl' : ' ltr';
    return className;
  }
  navigation_layout(type) {
    let { navs = [], navHeader, rtl } = this.props;
    if (!navs.length) { return false }
    let { navId } = this.state;
    let props = { navs, navHeader, navId, setNavId: (navId) => this.setNavId(navId), type, rtl }
    return { className: 'of-visible', html: (<Navigation {...props} />) };
  }
  page_layout(nav) {
    let { body = () => '' } = this.props;
    let content = body(this.state);
    return {
      flex: 1,
      column: [
        this.header_layout(nav),
        { flex: 1, html: <div className='rsa-body'>{content}</div> },
        this.navigation_layout('bottom')
      ]
    }
  }

  renderMain() {
    let { navId } = this.state;
    let { navs, style } = this.props;
    let nav = navs ? this.getNavById(navId) : false;
    let layout = { style, className: this.getMainClassName() }
    layout.row = [this.navigation_layout('side'), this.page_layout(nav)]
    return (<RVD layout={layout} />)
  }
  openSide() {
    let { popup, rtl } = this.props;
    popup.addModal({
      position: rtl ? 'right' : 'left', id: 'rsadefaultsidemodal',
      backdrop:{attrs:{className:'rsa-sidemenu-backdrop'}},
      body: { render: ({ close }) => this.renderSide(close) },
    })
  }
  closeSide(){
    let { popup } = this.props;
    popup.removeModal('rsadefaultsidemodal')
  }
  renderSide(close) {
    let { side = {}, rtl } = this.props;
    return <SideMenu {...side} rtl={rtl} onClose={() => close()} />
  }
  render() {
    let { splash } = this.state;
    let { style, className, maxWidth, popup,rtl } = this.props;
    return (
      <div className={`rsa-container` + (className ? ' ' + className : '')} style={{...style,direction:rtl?'rtl':'ltr'}}>
        <div className='rsa' style={{ maxWidth }}>
          {this.renderMain()}
          {popup.render()}
          {splash && splash()}
        </div>
      </div>
    );
  }
}
class Navigation extends Component {
  state = { openDic: {} }
  header_layout() {
    let { navHeader } = this.props;
    if (!navHeader) { return { size: 12 } }
    return { html: navHeader() };
  }
  items_layout(navs, level) {
    return {
      flex: 1, className: 'ofy-auto',
      column: navs.filter(({ show = () => true }) => show()).map((o, i) => {
        if (o.navs) {
          let { openDic } = this.state;
          let open = openDic[o.id] === undefined ? true : openDic[o.id]
          let column = [this.item_layout(o, level)]
          if (open) { column.push(this.items_layout(o.navs, level + 1)) }
          return { gap: 12, column }
        }
        return this.item_layout(o, level)
      })
    }
  }
  toggle(id) {
    let { openDic } = this.state;
    let open = openDic[id] === undefined ? true : openDic[id]
    this.setState({ openDic: { ...openDic, [id]: !open } })
  }
  item_layout(o, level = 0) {
    let { setNavId, navId, rtl } = this.props;
    let { openDic } = this.state;
    let { id, icon, navs } = o;
    let text = typeof o.text === 'function' ? o.text() : o.text;
    let active = id === navId;
    let open = openDic[id] === undefined ? true : openDic[id]
    return {
      className: 'rsa-navigation-item' + (active ? ' active' : ''), attrs: { onClick: () => navs ? this.toggle(id) : setNavId(id) },
      row: [
        { size: level * 16 },
        { show: navs !== undefined, size: 24, html: navs ? <Icon path={open ? mdiChevronDown : (rtl ? mdiChevronLeft : mdiChevronRight)} size={1} /> : '', align: 'vh' },
        { show: !!icon, size: 48, html: () => typeof icon === 'function' ? icon(active) : icon, align: 'vh' },
        { html: text, align: 'v' }
      ]
    }
  }
  bottomMenu_layout({ icon, text, id }) {
    let { navId, setNavId } = this.props;
    let active = id === navId;
    return {
      flex: 1, className: 'rsa-bottom-menu-item of-visible' + (active ? ' active' : ''), attrs: { onClick: () => setNavId(id) },
      column: [
        { show: !icon,flex: 1 },
        { show: !!icon,flex: 2 },
        { show: !!icon, html: () => typeof icon === 'function' ? icon(active) : icon, align: 'vh', className: 'of-visible' },
        { show: !!icon,flex: 1 },
        { html: text, align: 'vh', className: 'rsa-bottom-menu-item-text' },
        { flex: 1 }
      ]
    }
  }
  render() {
    let { type, navs } = this.props;
    if (type === 'bottom') {
      return (<RVD layout={{ className: 'rsa-bottom-menu', hide_sm: true, hide_md: true, hide_lg: true, row: navs.filter(({ show = () => true }) => show()).map((o) => this.bottomMenu_layout(o)) }} />)
    }
    return (<RVD layout={{ hide_xs: true, className: 'rsa-navigation', column: [this.header_layout(), this.items_layout(navs, 0)] }} />);
  }
}
class SideMenu extends Component {
  header_layout() {
    let { header } = this.props;
    if (!header) { return false }
    return { html: header(), className: 'rsa-sidemenu-header' };
  }
  items_layout() {
    let { items, onClose } = this.props;
    return {
      flex: 1, gap: 12,
      column: items.map((o, i) => {
        let { icon = () => <div style={{ width: 12 }}></div>, text, id, className, onClick = () => { }, show = () => true } = o;
        let Show = show();
        return {
          show: Show !== false, size: 36, className: 'rsa-sidemenu-item' + (className ? ' ' + className : ''), onClick: () => { onClick(o); onClose() },
          row: [
            { size: 48, html: typeof icon === 'function'?icon():icon, align: 'vh' },
            { html: text, align: 'v' }
          ]
        }
      })
    }
  }
  footer_layout() {
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
        layout={{
          attrs,
          className: 'rsa-sidemenu' + (attrs.className ? ' ' + attrs.className : ''),
          column: [this.header_layout(), this.items_layout(), this.footer_layout()]
        }}
      />
    );
  }
}
