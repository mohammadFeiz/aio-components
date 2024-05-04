import React, { Component, createRef, useEffect, useRef, useState, isValidElement, Fragment } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Icon } from '@mdi/react';
import { mdiClose, mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import RVD from './../../npm/react-virtual-dom/index.tsx';
import $ from 'jquery';
import './index.css';
import { AP_ModalBody, AP_ModalHeader, AP_Popup, AP_Popups, AP_Snackebar, AP_SnackebarItem, AP_confirm, AP_prompt, AP_alert, AP_modal, AP_modal_button, AP_props, AP_snackebar, AP_footer } from './types';
import { I_RVD_node } from '../react-virtual-dom/types';

export default class AIOPopup {
  rtl?: boolean;
  render: () => React.ReactNode;
  _addModal: (p: AP_modal) => void;
  addModal: (p: AP_modal) => void;
  addAlert: (p: AP_alert) => void;
  removeModal: (arg?: string, animate?: boolean) => void;
  _removeModal: (arg?: string, animate?: boolean) => void;
  addSnackebar: (p: AP_snackebar) => void;
  _addSnackebar: (p: AP_snackebar) => void;
  getModals: () => AP_modal[];
  _getModals: () => AP_modal[];
  addConfirm: (p: AP_confirm) => void;
  addPrompt: (p: AP_prompt) => void;
  popupId?: string;
  constructor(obj?: AP_props) {
    let { rtl = false, id } = obj || {}
    this.rtl = rtl;
    this._addModal = () => { };
    this._removeModal = () => { };
    this._addSnackebar = () => { };
    this._getModals = () => [];
    this.render = () => {
      let popupsProps: AP_Popups = {
        rtl, id,
        getActions: ({ addModal, removeModal, getModals }) => {
          this._addModal = addModal;
          this._removeModal = removeModal;
          this._getModals = getModals;
        }
      }
      let snackebarProps: AP_Snackebar = {
        rtl,
        getActions: ({ add }) => {
          this._addSnackebar = add;
        }
      }
      return (
        <>
          <Popups {...popupsProps} key={id} />
          <Snackebar {...snackebarProps} />
        </>
      )
    }
    this.addModal = (obj) => {
      this._addModal(obj)
    };
    this.addAlert = (obj) => Alert(obj);
    this.removeModal = (arg, animate = true) => { if (this._removeModal) { this._removeModal(arg, animate) } };
    this.addSnackebar = (obj: AP_snackebar) => this._addSnackebar(obj)
    this.getModals = () => {
      let res = this._getModals()
      return Array.isArray(res) ? res : []
    }
    this.addConfirm = (obj: AP_confirm) => {
      let { title, subtitle, text, submitText = 'Yes', canselText = 'No', onSubmit, onCansel = () => { }, attrs = {} } = obj;
      let className = 'aio-popup-confirm';
      if (attrs.className) { className += ' ' + attrs.className }
      let config: AP_modal = {
        position: 'center',
        attrs: { ...attrs, className },
        header: { title, subtitle },
        backdrop: { attrs: { className: 'rsa-backdrop' } },
        body: { render: () => text },
        footer: {
          buttons: [
            [canselText, { onClick: () => { onCansel(); this.removeModal() } }],
            [
              submitText,
              {
                onClick: async () => {
                  if (!onSubmit) { return }
                  let res: boolean = await onSubmit();
                  if (res !== false) { this.removeModal() }
                },
                className: 'active'
              }
            ]
          ]
        }
      }
      this.addModal(config)
    }
    this.addPrompt = (obj: AP_prompt) => {
      let { title, subtitle, text, submitText = 'تایید', canselText = 'بستن', onSubmit, onCansel = () => { }, attrs = {} } = obj;
      let className = 'aio-popup-prompt';
      if (attrs.className) { className += ' ' + attrs.className }
      let config: AP_modal = {
        position: 'center',
        attrs: { ...attrs, className },
        state: { temp: '' },
        header: { title, subtitle },
        backdrop: { attrs: { className: 'rsa-backdrop' } },
        body: {
          render: ({ state, setState }) => {
            return (
              <textarea
                placeholder={text}
                value={state.temp}
                onChange={(e) => {
                  if (setState) { setState({ temp: e.target.value }) }
                }} />
            )
          }
        },
        footer: {
          buttons: [
            [canselText, { onClick: () => { onCansel(); this.removeModal() } }],
            [
              submitText,
              (p: { state: any, setState: (v: any) => void }) => {
                let { state, setState } = p || {};
                return {
                  onClick: async (p: { state: any, setState: (v: any) => void }) => {
                    if (!onSubmit) { return }
                    let { state } = p;
                    let res = await onSubmit(state.temp);
                    if (res !== false) { this.removeModal() }
                    else { setState({ temp: '' }) }
                  },
                  disabled: !state.temp, className: 'active'
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
class Popups extends Component<AP_Popups, { modals: AP_modal[] }> {
  constructor(props: AP_Popups) {
    super(props);
    this.state = { modals: [] }
    props.getActions({
      addModal: this.addModal.bind(this),
      removeModal: this.removeModal.bind(this),
      getModals: () => this.state.modals
    })
  }
  change(modals: AP_modal[]) {
    let { id } = this.props;
    let oldModals = [...this.state.modals]
    let newModals: AP_modal[] = [...modals]
    if (id === 'main') {
      console.log('old modals', oldModals)
      console.log('new modals', newModals)
    }
    this.setState({ modals: newModals })
  }

  addModal(o: AP_modal) {
    let { modals } = this.state;
    if (o.id === undefined) { o.id = 'popup' + Math.round(Math.random() * 1000000) }
    let newModals: AP_modal[] = modals.filter(({ id }) => id !== o.id);
    let newModal: AP_modal = o
    newModals.push(newModal)
    this.change(newModals)
  }
  async removeModal(arg: string | undefined = 'last', animate = true) {
    if (arg === 'all') {
      this.setState({ modals: [] });
      return
    }
    let { modals } = this.state;
    if (!modals.length) { return }
    if (arg === 'last') { arg = modals[modals.length - 1].id }
    let parentDom = $(`.aio-popup-backdrop[data-id=${arg}]`);
    let dom = parentDom.find('.aio-popup');
    parentDom.addClass('not-mounted');
    dom.addClass('not-mounted');
    setTimeout(() => {
      let modal: AP_modal | undefined = modals.find((o: AP_modal) => o.id === arg);
      if (!modal) { return }
      if (typeof modal.onClose === 'function') { modal.onClose() }
      let newModals: AP_modal[] = modals.filter((o) => o.id !== arg)
      this.change(newModals)
    }, animate ? 300 : 0)
  }
  getModals() {
    let { modals } = this.state;
    let { rtl } = this.props;
    return modals.map((modal: AP_modal, i) => {
      let props: AP_Popup = {
        modal, index: i, isLast: i === modals.length - 1, rtl,
        onClose: () => this.removeModal(modal.id),
        removeModal: this.removeModal.bind(this),//use for remove lastModal by esc keyboard
      }
      return <Popup key={modal.id} {...props} />
    })
  }
  render() {
    let { modals } = this.state;
    let { id } = this.props;
    if (id === 'main') {
      console.log('render', modals.length);
    }
    if (!modals.length) { return null }
    let renderModals = this.getModals();
    return <>{renderModals}</>
  }

}
type AP_Popup_temp = {
  dom: any,
  backdropDom: any,
  dui?: string,
  isDown: boolean,
  isFirstMount: boolean
}
function Popup(props: AP_Popup) {
  let { modal, rtl, onClose, isLast, removeModal } = props;
  let { attrs = {}, id, backdrop = {}, footer, header, position = 'fullscreen', body, fitHorizontal, getTarget, pageSelector,openRelatedTo, fixStyle = (o) => o, fitTo } = modal;
  let [temp] = useState<AP_Popup_temp>({
    dom: createRef(),
    backdropDom: createRef(),
    dui: undefined,
    isDown: false,
    isFirstMount: true

  })
  let [popoverStyle, setPopoverStyle] = useState({})
  let [state, setState] = useState(modal.state)
  async function close() {
    onClose();
  }
  useEffect(() => {
    return () => {
      $(window).unbind('click', handleBackClick)
    }
  })
  function updatePopoverStyle() {
    if (position === 'popover') {
      let ps = getPopoverStyle();
      if (JSON.stringify(ps) !== JSON.stringify(popoverStyle)) {
        setPopoverStyle(ps)
      }
    }
  }
  useEffect(() => {
    temp.isFirstMount = false
    setTimeout(() => {
      setPopoverStyle(position === 'popover' ? getPopoverStyle() : {})
    }, 0)
    if (getTarget) {
      temp.dui = 'a' + (Math.round(Math.random() * 10000000));
      let target = getTarget();
      target.attr('data-uniq-id', temp.dui)
    }
    $(window).unbind('click', handleBackClick)
    $(window).bind('click', handleBackClick)
  }, [])
  function handleBackClick(e: any) {
    //در مود پاپاور اگر هر جایی غیر از اینپوت و پاپاور کلیک شد پاپاپ رو ببند
    if (!temp.dui) { return }
    let target = $(e.target)
    if (position !== 'popover' || target.attr('data-uniq-id') === temp.dui || target.parents(`[data-uniq-id=${temp.dui}]`).length) {
      return
    }
    close();
  }
  function header_node(): I_RVD_node {
    if (typeof header !== 'object') { return {} }
    return { html: <ModalHeader rtl={rtl} header={header} handleClose={() => close()} state={state} setState={(value) => setState(value)} />, className: 'of-visible' }
  }
  function body_node(): I_RVD_node {
    let p: AP_ModalBody = { body, handleClose: () => close(), state, setState: ((value) => setState(value)), updatePopoverStyle }
    return { flex: 1, html: <ModalBody {...p} /> }
  }
  function footer_node(): I_RVD_node {
    let handleClose = close;
    let props = { footer, handleClose, state, setState };
    return { html: <ModalFooter {...props} /> }
  }
  function getBackDropClassName() {
    let className = 'aio-popup-backdrop';
    if (temp.isFirstMount) {
      className += ' not-mounted'
    }
    if (backdrop && backdrop.attrs && backdrop.attrs.className) { className += ' ' + backdrop.attrs.className }
    className += ` aio-popup-position-${position}`
    className += rtl ? ' rtl' : ' ltr'
    return className
  }
  function backClick(e: any) {
    if (temp.isDown) { return }
    e.stopPropagation();
    let target = $(e.target);
    if (backdrop && backdrop.close === false) { return }
    if (!target.hasClass('aio-popup-backdrop')) { return }
    close()
  }
  function getPopoverStyle() {
    if (!getTarget) { return {} }
    let target = getTarget();
    if (!target || !target.length) { return {} }
    let popup = $(temp.dom.current);
    let style = Align({ dom: popup, target, fitHorizontal, fixStyle, pageSelector,openRelatedTo, fitTo, attrs, rtl })
    return { ...style, position: 'absolute' }
  }
  function keyDown(e: any) {
    if (!isLast) { return }
    let code = e.keyCode;
    if (code === 27) {
      removeModal()
    }
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
    if (temp.isFirstMount) {
      className += ' not-mounted'
      temp.isFirstMount = false
    }
    className += rtl ? ' rtl' : ' ltr'
    if (attrs.className) { className += ' ' + attrs.className }
    return className
  }
  let backdropAttrs = backdrop ? backdrop.attrs : {};
  let backdropProps = {
    ...backdropAttrs, ['data-id']: id,
    className: getBackDropClassName(),
    onClick: backdrop === false ? undefined : (backdrop.close === false ? undefined : (e: any) => backClick(e)),
  }
  let style: any = { ...popoverStyle, ...attrs.style, flex: 'none' }
  let ev = "ontouchstart" in document.documentElement ? 'onTouchStart' : 'onMouseDown'
  return (
    <div {...backdropProps} ref={temp.backdropDom} onKeyDown={keyDown} tabIndex={0}>
      <RVD
        rootNode={{
          attrs: { ...attrs, ref: temp.dom, style: undefined, className: undefined, 'data-uniq-id': temp.dui, [ev]: mouseDown },
          className: getClassName(), style, column: [header_node(), body_node(), footer_node()]
        }}
      />
    </div>
  )
}
function ModalHeader(props: AP_ModalHeader) {
  let { rtl, header, handleClose, state, setState } = props;
  if (typeof header !== 'object') { return null }
  let { title, subtitle, buttons = [], onClose, backButton, attrs = {} } = header;
  function close(e: any) {
    e.stopPropagation(); e.preventDefault();
    if (typeof onClose === 'function') { onClose({ state, setState }) } else { handleClose() }
  }
  function backButton_node(): I_RVD_node {
    if (!backButton || onClose === false) { return {} }
    let path, style;
    if (rtl) { path = mdiChevronRight; style = { marginLeft: 12 } }
    else { path = mdiChevronLeft; style = { marginRight: 12 } }
    return { html: <Icon path={path} size={1} />, className: 'align-vh', onClick: (e) => close(e), style }
  }
  function title_node(): I_RVD_node {
    if (!title) { return {} }
    if (!subtitle) {
      return { html: title, className: 'aio-popup-title align-v flex-1' }
    }
    else {
      return {
        className: 'align-v flex-1',
        column: [
          { html: title, className: 'aio-popup-title' },
          { html: subtitle, className: 'aio-popup-subtitle' }
        ]
      }
    }
  }
  function buttons_node(): I_RVD_node {
    if (!buttons.length) { return {} }
    return {
      className: 'align-vh gap-6',
      row: () => buttons.map(([text, attrs = {}]) => {
        let { onClick = () => { }, className } = attrs;
        let Attrs = { ...attrs };
        Attrs.className = 'aio-popup-header-button' + (className ? ' ' + className : '');
        Attrs.onClick = () => onClick({ close: handleClose, state, setState })
        return { html: (<button {...Attrs}>{text}</button>), className: 'align-vh' }
      })
    }
  }
  function close_node(): I_RVD_node {
    if (backButton || onClose === false) { return {} }
    return { html: <Icon path={mdiClose} size={0.8} />, onClick: (e) => close(e), className: 'aio-popup-header-close-button align-vh' }
  }
  let className = 'aio-popup-header' + (attrs.className ? ' ' + attrs.className : '')
  let style = attrs.style;
  return (<RVD rootNode={{ attrs, className, style, row: [backButton_node(), title_node(), buttons_node(), close_node()] }} />)
}
function ModalBody(props: AP_ModalBody) {
  let { handleClose, body, updatePopoverStyle, state = {}, setState } = props;
  let { render, attrs = {} } = body || {};
  let content = typeof render === 'function' ? render({ close: handleClose, state, setState }) : render;
  useEffect(() => {
    updatePopoverStyle()
  }, [content])
  return (
    <div {...attrs} className={'aio-popup-body aio-popup-scroll' + (attrs.className ? ' ' + attrs.className : '')}>
      {typeof render === 'function' && content}
    </div>
  )
}
type AP_ModalFooter = {
  footer: AP_footer, handleClose: () => void, state: any, setState: (v: any) => void
}
function ModalFooter(props: AP_ModalFooter) {
  let { footer, handleClose, state, setState } = props;
  if (isValidElement(footer)) { return footer }
  if (typeof footer !== 'object') { return null }
  let { attrs = {}, buttons = [] } = footer as { attrs?: any, buttons?: AP_modal_button[] };
  function buttons_node() { return !buttons.length ? null : buttons.map((o: AP_modal_button) => button_node(o)) }
  function button_node(p: AP_modal_button) {
    let [text, attrs = {}] = p;
    let Attrs = typeof attrs === 'function' ? { ...attrs({ state, setState }) } : { ...attrs };
    let { onClick = () => { }, className } = Attrs;
    Attrs.className = 'aio-popup-footer-button' + (className ? ' ' + className : '');
    Attrs.onClick = () => onClick({ close: handleClose, state, setState })
    return <button key={text} {...Attrs}>{text}</button>
  }
  let p = { className: 'aio-popup-footer' + (attrs.className ? ' ' + attrs.className : ''), style: attrs.style }
  return (<div {...p}>{buttons_node()}</div>)
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
      let dom = els.eq(i);
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
  openRelatedTo?:string,
  rtl?: boolean,
  fitTo?: string
}
function Align(p: AP_align) {
  let { dom, target, fitHorizontal, fixStyle = (o) => o, attrs = {}, fitTo, pageSelector, rtl,openRelatedTo } = p;
  let $$ = {
    getDomLimit(dom: any, type: 'popover' | 'page' | 'target') {
      if (fitTo && type === 'popover') {
        let parent = target.parents(fitTo);//notice be jaye target dom
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
          let { left: l, top: t } = page.offset()
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
      if(!openRelatedTo){return}
      let elem = dom.parents(openRelatedTo);
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