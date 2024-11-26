import React, { Component, createRef, useEffect, useState, createContext, useContext, useRef, forwardRef, useImperativeHandle, createElement as _createElement } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import $ from 'jquery';
import './index.css';
import anime from "animejs/lib/anime.es.js";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export default class AIOPopup {
  constructor(obj) {
    _defineProperty(this, "rtl", void 0);
    _defineProperty(this, "render", void 0);
    _defineProperty(this, "addModal", void 0);
    _defineProperty(this, "addHighlight", void 0);
    _defineProperty(this, "removeHighlight", void 0);
    _defineProperty(this, "addAlert", void 0);
    _defineProperty(this, "removeModal", void 0);
    _defineProperty(this, "addSnackebar", void 0);
    _defineProperty(this, "getModals", void 0);
    _defineProperty(this, "addConfirm", void 0);
    _defineProperty(this, "addPrompt", void 0);
    _defineProperty(this, "popupId", void 0);
    _defineProperty(this, "popupsRef", void 0);
    _defineProperty(this, "highlightRef", void 0);
    let {
      rtl = false
    } = obj || {};
    this.rtl = rtl;
    this.addSnackebar = () => {};
    this.popupsRef = /*#__PURE__*/createRef();
    this.highlightRef = /*#__PURE__*/createRef();
    this.getModals = () => {
      let comp = this.popupsRef.current;
      if (comp === null) {
        return [];
      }
      return comp.getModals() || [];
    };
    this.addModal = modal => {
      let comp = this.popupsRef.current;
      if (comp === null) {
        return;
      }
      comp.addModal(modal);
    };
    this.addHighlight = highlight => {
      let comp = this.highlightRef.current;
      if (comp === null) {
        return;
      }
      comp.addHighlight(highlight);
    };
    this.removeModal = arg => {
      let comp = this.popupsRef.current;
      if (comp === null) {
        return;
      }
      comp.removeModal(arg);
    };
    this.removeHighlight = () => {
      let comp = this.highlightRef.current;
      if (comp === null) {
        return;
      }
      comp.removeHighlight();
    };
    this.render = () => {
      let snackebarProps = {
        rtl,
        getActions: ({
          add
        }) => this.addSnackebar = add
      };
      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(Popups, {
          rtl: rtl,
          ref: this.popupsRef
        }), /*#__PURE__*/_jsx(Snackebar, {
          ...snackebarProps
        }), /*#__PURE__*/_jsx(Highlight, {
          ref: this.highlightRef
        })]
      });
    };
    this.addAlert = obj => Alert(obj);
    this.addConfirm = obj => {
      let {
        title,
        subtitle,
        text,
        submitText = 'Yes',
        canselText = 'No',
        onSubmit,
        onCansel = () => {},
        setAttrs = () => {
          return {};
        }
      } = obj;
      let config = {
        position: 'center',
        setAttrs: key => {
          let attrs = setAttrs(key);
          if (key === 'modal') {
            return AddToAttrs(attrs, {
              className: 'aio-popup-confirm'
            });
          }
          return attrs;
        },
        header: {
          title,
          subtitle
        },
        body: () => text,
        footer: () => {
          return /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx("button", {
              type: "button",
              onClick: () => {
                onCansel();
                this.removeModal();
              },
              children: canselText
            }), /*#__PURE__*/_jsx("button", {
              type: "button",
              className: "active",
              onClick: async () => {
                if (!onSubmit) {
                  return;
                }
                let res = await onSubmit();
                if (res !== false) {
                  this.removeModal();
                }
              },
              children: submitText
            })]
          });
        }
      };
      this.addModal(config);
    };
    this.addPrompt = obj => {
      let {
        title,
        subtitle,
        text,
        submitText = 'Submit',
        canselText = 'close',
        onSubmit,
        onCansel = () => {},
        setAttrs = () => {
          return {};
        }
      } = obj;
      let config = {
        position: 'center',
        setAttrs: key => {
          let attrs = setAttrs(key);
          if (key === 'modal') {
            return AddToAttrs(attrs, {
              className: 'aio-popup-prompt'
            });
          }
          return attrs;
        },
        state: {
          temp: ''
        },
        header: {
          title,
          subtitle
        },
        body: ({
          state,
          setState
        }) => {
          return /*#__PURE__*/_jsx("textarea", {
            placeholder: text,
            value: state.temp,
            onChange: e => {
              if (setState) {
                setState({
                  temp: e.target.value
                });
              }
            }
          });
        },
        footer: ({
          state,
          setState
        }) => {
          return /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx("button", {
              type: "button",
              onClick: () => {
                onCansel();
                this.removeModal();
              },
              children: canselText
            }), /*#__PURE__*/_jsx("button", {
              type: "button",
              className: "active",
              onClick: async () => {
                if (!onSubmit) {
                  return;
                }
                let res = await onSubmit(state.temp);
                if (res !== false) {
                  this.removeModal();
                } else {
                  setState({
                    temp: ''
                  });
                }
              },
              disabled: !state.temp,
              children: submitText
            })]
          });
        }
      };
      this.addModal(config);
    };
  }
}
const Popups = /*#__PURE__*/forwardRef((props, ref) => {
  let [modals, setModals] = useState([]);
  let modalsRef = useRef(modals);
  modalsRef.current = modals;
  let {
    rtl
  } = props;
  useImperativeHandle(ref, () => ({
    addModal,
    removeModal,
    getModals: () => modalsRef.current
  }));
  function addModal(o) {
    if (o.id === undefined) {
      o.id = 'popup' + Math.round(Math.random() * 1000000);
    }
    let newModal = o;
    setModals(prevModals => {
      let newModals = prevModals.filter(({
        id
      }) => id !== o.id);
      return [...newModals, newModal];
    });
  }
  async function removeModal(arg = 'last') {
    if (arg === 'all') {
      setModals([]);
      return;
    }
    if (!modalsRef.current.length) {
      return;
    }
    if (arg === 'last') {
      arg = modalsRef.current[modalsRef.current.length - 1].id;
    }
    let modal = modalsRef.current.find(o => o.id === arg);
    if (!modal) {
      return;
    }
    $(`[data-id=${arg}]`).addClass('not-mounted');
    setTimeout(() => {
      if (modal && typeof modal.onClose === 'function') {
        modal.onClose();
      }
      setModals(prevModals => prevModals.filter(o => o.id !== arg));
    }, 300);
  }
  function getModals() {
    return modalsRef.current.map((modal, i) => {
      return /*#__PURE__*/_jsx(Popup, {
        modal: modal,
        rtl: rtl,
        isLast: i === modalsRef.current.length - 1,
        onClose: () => removeModal(modal.id)
      }, modal.id);
    });
  }
  let Modals = getModals();
  return !Modals.length ? null : /*#__PURE__*/_jsx(_Fragment, {
    children: Modals
  });
});
const CTX = /*#__PURE__*/createContext({});
function Popup(props) {
  let {
    modal,
    rtl,
    onClose,
    isLast
  } = props;
  let {
    setAttrs = () => {
      return {};
    },
    id,
    position = 'fullscreen',
    getTarget,
    maxHeight,
    fixStyle = o => o
  } = modal;
  let [temp] = useState({
    dom: /*#__PURE__*/createRef(),
    backdropDom: /*#__PURE__*/createRef(),
    dui: undefined,
    isDown: false
  });
  let [popoverStyle, setPopoverStyle] = useState({});
  let [state, setState] = useState(modal.state);
  let attrs = setAttrs('modal') || {};
  let backdropAttrs = setAttrs('backdrop') || {};
  const firstMount = useRef(false);
  async function close() {
    onClose();
  }
  useEffect(() => () => {
    $(window).unbind('click', handleBackClick);
  });
  useEffect(() => {
    //be khatere 300 mili sanie transitioni ke popup dare bayad inja bish az oon 300 milisanie vaghfe bedim ta dorost update beshe andaze ha 
    let newStyle = position === 'popover' ? getPopoverStyle() : {};
    console.log('updatedStyle.top', newStyle.top);
    setPopoverStyle(newStyle);
    if (getTarget) {
      temp.dui = 'a' + Math.round(Math.random() * 10000000);
      let target = getTarget();
      target.attr('data-id', temp.dui);
    }
    setTimeout(() => {
      let popup = $(temp.dom.current);
      popup.removeClass('not-mounted');
      $(temp.backdropDom.current).removeClass('not-mounted');
      popup.focus();
    }, 0);
    $(window).unbind('click', handleBackClick);
    $(window).bind('click', handleBackClick);
  }, []);
  function handleBackClick(e) {
    //در مود پاپاور اگر هر جایی غیر از اینپوت و پاپاور کلیک شد پاپاپ رو ببند
    if (!temp.dui) {
      return;
    }
    let target = $(e.target);
    if (position !== 'popover' || target.attr('data-id') === temp.dui || target.parents(`[data-id=${temp.dui}]`).length) {
      return;
    }
    close();
  }
  function getBackdropProps() {
    let className = 'aio-popup-backdrop';
    className += ` aio-popup-position-${position}`;
    className += rtl ? ' rtl' : ' ltr';
    if (firstMount) {
      className += ' not-mounted';
    }
    return AddToAttrs(backdropAttrs, {
      className,
      attrs: {
        ref: temp.backdropDom,
        onKeyDown: keyDown,
        tabIndex: 0,
        ['data-id']: id,
        onClick: backdropAttrs.onClick ? backdropAttrs.onClick : backClick
      }
    });
  }
  function getModalProps() {
    let style = {
      ...popoverStyle,
      ...attrs.style
    };
    let ev = "ontouchstart" in document.documentElement ? 'onTouchStart' : 'onMouseDown';
    return {
      ...attrs,
      ref: temp.dom,
      "data-id": modal.id,
      tabIndex: 0,
      onKeyDown: keyDown,
      [ev]: mouseDown,
      className: getClassName(),
      style: {
        ...style
      }
    };
  }
  function backClick(e) {
    if (temp.isDown) {
      return;
    }
    e.stopPropagation();
    let target = $(e.target);
    if (!target.hasClass('aio-popup-backdrop')) {
      return;
    }
    close();
  }
  function getPopoverStyle() {
    if (!getTarget) {
      return {};
    }
    let target = getTarget();
    if (!target || !target.length) {
      return {};
    }
    let popup = $(temp.dom.current);
    let p = {
      dom: popup,
      target,
      fitHorizontal: modal.fitHorizontal,
      fixStyle,
      pageSelector: modal.pageSelector,
      limitTo: modal.limitTo,
      attrs,
      rtl
    };
    let style = Align(p);
    let res = {
      ...style,
      position: 'absolute'
    };
    if (maxHeight) {
      res.maxHeight = maxHeight;
    }
    return res;
  }
  function keyDown(e) {
    if (!isLast) {
      return;
    }
    let code = e.keyCode;
    if (code === 27) {
      onClose();
    }
  }
  function mouseUp() {
    setTimeout(() => temp.isDown = false, 0);
  }
  function mouseDown(e) {
    $(window).unbind('mouseup', mouseUp);
    $(window).bind('mouseup', mouseUp);
    temp.isDown = true;
  }
  function getClassName() {
    let className = 'aio-popup';
    className += rtl ? ' rtl' : ' ltr';
    if (firstMount) {
      className += ' not-mounted';
    }
    if (attrs.className) {
      className += ' ' + attrs.className;
    }
    return className;
  }
  function getContext() {
    return {
      close,
      state,
      setState
    };
  }
  return /*#__PURE__*/_jsx(CTX.Provider, {
    value: getContext(),
    children: /*#__PURE__*/_jsx("div", {
      ...getBackdropProps(),
      children: /*#__PURE__*/_jsxs("div", {
        ...getModalProps(),
        children: [!!modal.header && /*#__PURE__*/_jsx(ModalHeader, {
          modal: modal
        }), /*#__PURE__*/_jsx(ModalBody, {
          modal: modal
        }), !!modal.footer && /*#__PURE__*/_jsx("div", {
          ...AddToAttrs(setAttrs('footer'), {
            className: 'aio-popup-footer'
          }),
          children: modal.footer({
            state,
            setState,
            close
          })
        })]
      })
    })
  });
}
const ModalHeader = props => {
  let context = useContext(CTX);
  let {
    modal
  } = props;
  let {
    state,
    setState
  } = context;
  let {
    setAttrs = () => {
      return {};
    }
  } = modal;
  let attrs = setAttrs('header') || {};
  if (typeof modal.header === 'function') {
    return modal.header({
      close: context.close,
      state,
      setState
    });
  }
  if (typeof modal.header !== 'object') {
    return null;
  }
  let cls = 'aio-popup-header';
  let {
    title,
    subtitle,
    onClose,
    before,
    after
  } = modal.header;
  function close(e) {
    e.stopPropagation();
    e.preventDefault();
    if (typeof onClose === 'function') {
      onClose({
        state,
        setState
      });
    } else {
      context.close();
    }
  }
  function title_node() {
    if (!subtitle) {
      return /*#__PURE__*/_jsx("div", {
        className: `${cls}-title`,
        style: {
          display: 'flex',
          alignItems: 'center',
          flex: 1
        },
        children: title
      });
    } else {
      return /*#__PURE__*/_jsxs("div", {
        className: `${cls}-text`,
        children: [/*#__PURE__*/_jsx("div", {
          className: `${cls}-title`,
          children: title
        }), /*#__PURE__*/_jsx("div", {
          className: `${cls}-subtitle`,
          children: subtitle
        })]
      });
    }
  }
  return /*#__PURE__*/_jsxs("div", {
    ...AddToAttrs(attrs, {
      className: cls
    }),
    children: [before !== undefined && /*#__PURE__*/_jsx("div", {
      className: `${cls}-before`,
      onClick: e => close(e),
      children: before
    }), !!title && title_node(), after !== undefined && /*#__PURE__*/_jsx("div", {
      className: `${cls}-after`,
      onClick: e => close(e),
      children: after
    }), onClose !== false && /*#__PURE__*/_jsx("div", {
      className: `${cls}-close-button`,
      onClick: e => close(e),
      children: /*#__PURE__*/_jsx(CloseIcon, {})
    })]
  });
};
const ModalBody = props => {
  let {
    state,
    setState,
    close
  } = useContext(CTX);
  let {
    modal
  } = props;
  let {
    body = () => null,
    setAttrs = () => {
      return {};
    }
  } = modal;
  let attrs = setAttrs('body') || {};
  const param = {
    close,
    state,
    setState
  };
  let content = body(param);
  if (!content || content === null) {
    return null;
  }
  return /*#__PURE__*/_jsx("div", {
    ...AddToAttrs(attrs, {
      className: 'aio-popup-body aio-popup-scroll'
    }),
    children: content
  });
};
function Alert(props) {
  let {
    icon,
    type = '',
    text = '',
    subtext = '',
    time = 10,
    className,
    closeText = 'بستن',
    position = 'center',
    onClose
  } = props;
  let $$ = {
    id: '',
    time: 0,
    getId() {
      return 'aa' + Math.round(Math.random() * 100000000);
    },
    getBarRender() {
      return `<div class='aio-popup-time-bar' style="width:${$$.time}%;"></div>`;
    },
    updateBarRender() {
      $(`.aio-popup-alert-container.${$$.id} .aio-popup-time`).html($$.getBarRender());
    },
    getRender() {
      return `
      <div class='aio-popup-alert-container not-mounted ${$$.id} aio-popup-alert-container-${position}${!!className ? ` ${className}` : ''}'>
        <div class='aio-popup-alert aio-popup-alert-${type}'>
          <div class='aio-popup-alert-header'>${$$.getIcon()}</div>
          <div class='aio-popup-alert-body aio-popup-scroll'>
            <div class='aio-popup-alert-text'>${ReactDOMServer.renderToStaticMarkup(text)}</div>
            <div class='aio-popup-alert-subtext'>${subtext}</div>
          </div>
          <div class='aio-popup-alert-footer'>
            <button class='aio-popup-alert-close ${$$.id}'>${closeText}</button>
          </div>
          <div class='aio-popup-time'></div>
        </div>
      </div>
    `;
    },
    close() {
      $$.toggleClass(false);
      setTimeout(() => {
        if (typeof onClose === 'function') {
          onClose();
        }
        if (onClose === false) {
          return;
        }
        $('.' + $$.id).remove();
      }, 200);
    },
    getIcon() {
      if (icon === false) {
        return '';
      }
      return icon || {
        error: `<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>`,
        warning: `<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"></path></svg>`,
        info: `<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"></path></svg>`,
        success: `<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"></path></svg>`
      }[type] || '';
    },
    startTimer() {
      setTimeout(() => {
        if ($$.time >= 100) {
          $$.time = 100;
          $$.close();
          return;
        }
        $$.time += 2;
        $$.updateBarRender();
        $$.startTimer();
      }, time / 50 * 1000);
    },
    toggleClass(mount) {
      let dom = $(`.${$$.id}`);
      if (mount) {
        setTimeout(() => dom.removeClass('not-mounted'), 0);
      } else {
        dom.addClass('not-mounted');
      }
    },
    render() {
      $('body').append($$.getRender());
      $('button.' + $$.id).off('click', $$.close);
      $('button.' + $$.id).on('click', $$.close);
      $$.toggleClass(true);
    }
  };
  $$.id = $$.getId();
  $$.render();
  if (time) {
    $$.startTimer();
  }
}
class Snackebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    props.getActions({
      add: this.add.bind(this)
    });
  }
  add(item) {
    let {
      items
    } = this.state;
    let newItems = [...items, {
      ...item,
      id: 'a' + Math.round(Math.random() * 1000000000)
    }];
    this.setState({
      items: newItems
    });
  }
  remove(id, onClose) {
    if (onClose === false) {
      return;
    }
    let {
      items
    } = this.state;
    let newItems = items.filter((o, i) => o.id !== id);
    this.setState({
      items: newItems
    });
    if (typeof onClose === 'function') {
      onClose();
    }
  }
  render() {
    let {
      items
    } = this.state;
    let {
      rtl
    } = this.props;
    return /*#__PURE__*/_jsx(_Fragment, {
      children: items.map((item, i) => {
        let p = {
          rtl,
          item,
          index: i,
          onRemove: id => this.remove(id, item.onClose)
        };
        return /*#__PURE__*/_createElement(SnackebarItem, {
          ...p,
          key: item.id
        });
      })
    });
  }
}
function SnackebarItem(props) {
  let {
    item,
    onRemove,
    index,
    rtl
  } = props;
  let {
    time = 8,
    id,
    text,
    type,
    subtext,
    action,
    onClose,
    verticalAlign = 'end',
    horizontalAlign = 'center',
    icon,
    attrs = {}
  } = item;
  if (verticalAlign !== 'start' && verticalAlign !== 'end') {
    verticalAlign = 'end';
    console.error('aio-popup error => snackebar item .verticalAlign should be "start" or "end"');
  }
  if (horizontalAlign !== 'start' && horizontalAlign !== 'end' && horizontalAlign !== 'center') {
    horizontalAlign = 'center';
    console.error('aio-popup error => snackebar item .horizontalAlign should be "start" or "end" or "center"');
  }
  let [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    setTimeout(() => remove(), time * 1000);
  }, []);
  function remove() {
    setMounted(false);
    setTimeout(() => {
      onRemove(id);
    }, 200);
  }
  function info_svg() {
    return /*#__PURE__*/_jsx("svg", {
      viewBox: "0 0 24 24",
      role: "presentation",
      style: {
        width: '1.2rem',
        height: '1.2rem'
      },
      children: /*#__PURE__*/_jsx("path", {
        d: "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",
        style: {
          fill: 'currentcolor'
        }
      })
    });
  }
  function success_svg() {
    return /*#__PURE__*/_jsx("svg", {
      viewBox: "0 0 24 24",
      role: "presentation",
      style: {
        width: '1.2rem',
        height: '1.2rem'
      },
      children: /*#__PURE__*/_jsx("path", {
        d: "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z",
        style: {
          fill: 'currentcolor'
        }
      })
    });
  }
  function getSvg(type) {
    return type === 'error' || type === 'warning' || type === 'info' ? info_svg() : success_svg();
  }
  function getOffsetStyle(index) {
    let els = $('.aio-popup-snackebar-item-container'),
      sum = {
        start: 12,
        end: 12
      };
    for (let i = 0; i < index; i++) {
      let dom = els.eq(i);
      let height = dom.height() + 6;
      let va = dom.attr('data-vertical-align');
      sum[va] += height;
    }
    return {
      [verticalAlign === 'start' ? 'top' : 'bottom']: sum[verticalAlign]
    };
  }
  function text_node() {
    return /*#__PURE__*/_jsxs("div", {
      className: "aio-popup-snackebar-item-text",
      children: [/*#__PURE__*/_jsx("div", {
        className: "aio-popup-snackebar-item-uptext",
        children: text
      }), !!subtext && /*#__PURE__*/_jsx("div", {
        className: "aio-popup-snackebar-item-subtext",
        children: subtext
      })]
    });
  }
  function container_node() {
    let className = 'aio-popup-snackebar-item-container';
    className += ` aio-popup-snackebar-item-container-horizontal-align-${horizontalAlign}`;
    if (mounted) {
      className += ' mounted';
    }
    if (rtl) {
      className += ' rtl';
    }
    let style = getOffsetStyle(index);
    let p = {
      'data-vertical-align': verticalAlign,
      className,
      style,
      onClick: onClose === false ? undefined : () => remove()
    };
    return /*#__PURE__*/_jsx("div", {
      ...p,
      children: item_node()
    });
  }
  function item_node() {
    let className = 'aio-popup-snackebar-item';
    className += ` aio-popup-snackebar-item-${type}`;
    if (attrs.className) {
      className += ` ${attrs.className}`;
    }
    let p = {
      ...attrs,
      className,
      style: attrs.style
    };
    return /*#__PURE__*/_jsxs("div", {
      ...p,
      children: [icon_node(), " ", text_node(), " ", action_node(), " ", bar_node(), "  "]
    });
  }
  function bar_node() {
    return /*#__PURE__*/_jsx("div", {
      className: "aio-popup-snackebar-bar",
      style: {
        transition: `${time}s linear`
      }
    });
  }
  function action_node() {
    if (!action || !action.text) {
      return null;
    }
    let p = {
      className: 'aio-popup-snackebar-item-action',
      onClick: e => {
        e.stopPropagation();
        if (action) {
          action.onClick();
        }
        remove();
      }
    };
    return /*#__PURE__*/_jsx("button", {
      ...p,
      children: action.text
    });
  }
  function icon_node() {
    return /*#__PURE__*/_jsx("div", {
      className: `aio-popup-snackebar-item-icon`,
      children: !!icon ? icon : getSvg(type)
    });
  }
  return container_node();
}
//id,onClose,backdrop,getTarget,position,fixStyle,attrs,fitHorizontal,pageSelector,rtl,body

function Align(p) {
  let {
    dom,
    target,
    fitHorizontal,
    fixStyle = o => o,
    attrs = {},
    pageSelector,
    rtl,
    limitTo
  } = p;
  let $$ = {
    getDomLimit(dom, type) {
      let offset = dom.offset();
      let left = offset.left - window.pageXOffset;
      let top = offset.top - window.pageYOffset;
      if (pageSelector && type !== 'page') {
        let page = $(pageSelector);
        try {
          let {
            left: l,
            top: t
          } = page.offset() || {
            left: 0,
            top: 0
          };
          l -= window.scrollX;
          t -= window.scrollY;
          left -= l;
          top -= t;
        } catch {}
      }
      let width = dom.outerWidth();
      let height = dom.outerHeight();
      let right = left + width;
      let bottom = top + height;
      return {
        left,
        top,
        right,
        bottom,
        width,
        height
      };
    },
    getPageLimit() {
      let page = pageSelector ? $(pageSelector) : undefined;
      page = Array.isArray(page) && page.length === 0 ? undefined : page;
      let bodyWidth = window.innerWidth;
      let bodyHeight = window.innerHeight;
      let pageLimit = page ? $$.getDomLimit(page, 'page') : {
        left: 0,
        top: 0,
        right: bodyWidth,
        bottom: bodyHeight
      };
      if (pageLimit.left < 0) {
        pageLimit.left = 0;
      }
      if (pageLimit.right > bodyWidth) {
        pageLimit.right = bodyWidth;
      }
      if (pageLimit.top < 0) {
        pageLimit.top = 0;
      }
      if (pageLimit.bottom > bodyHeight) {
        pageLimit.bottom = bodyHeight;
      }
      return pageLimit;
    },
    getRelatedToLmit() {
      if (!limitTo) {
        return;
      }
      let elem = dom.parents(limitTo);
      if (!elem.length) {
        return;
      }
      let offset = elem.offset();
      let left = offset.left - window.pageXOffset;
      let top = offset.top - window.pageYOffset;
      let width = elem.outerWidth();
      let height = elem.outerHeight();
      let right = left + width;
      let bottom = top + height;
      return {
        left,
        top,
        right,
        bottom,
        width,
        height
      };
    },
    align() {
      let pageLimit = $$.getPageLimit();
      let targetLimit = $$.getDomLimit(target, 'target');
      let domLimit = $$.getDomLimit(dom, 'popover');
      let overflowY;
      domLimit.top = targetLimit.bottom;
      domLimit.bottom = domLimit.top + domLimit.height;
      if (fitHorizontal) {
        domLimit.width = targetLimit.width;
        domLimit.left = targetLimit.left;
        domLimit.right = targetLimit.left + targetLimit.width;
      } else {
        let relatedToLimit = $$.getRelatedToLmit();
        let parentLimit = relatedToLimit || pageLimit;
        //اگر راست به چپ باید باشد
        if (rtl) {
          //راست المان را با راست هدف ست کن
          domLimit.right = targetLimit.right;
          //چپ المان را بروز رسانی کن
          domLimit.left = domLimit.right - domLimit.width;
          //اگر المان از سمت چپ از صفحه بیرون زد سمت چپ المان را با سمت چپ صفحه ست کن
          if (domLimit.left < parentLimit.left) {
            domLimit.left = parentLimit.left;
          }
        } else {
          //چپ المان را با چپ هدف ست کن
          domLimit.left = targetLimit.left;
          //راست المان را بروز رسانی کن
          domLimit.right = domLimit.left + domLimit.width;
          //اگر المان از سمت راست صفحه بیرون زد سمت چپ المان را با پهنای المان ست کن
          if (domLimit.right > parentLimit.right) {
            domLimit.left = parentLimit.right - domLimit.width;
          }
        }
      }
      //اگر المان از سمت پایین صفحه بیرون زد
      if (domLimit.bottom > pageLimit.bottom) {
        if (domLimit.height > targetLimit.top - pageLimit.top) {
          domLimit.top = pageLimit.bottom - domLimit.height;
        } else {
          domLimit.top = targetLimit.top - domLimit.height;
        }
      } else {
        domLimit.top = targetLimit.bottom;
      }
      if (domLimit.height > pageLimit.bottom - pageLimit.top) {
        domLimit.top = 6;
        domLimit.bottom = undefined;
        domLimit.height = pageLimit.bottom - pageLimit.top - 12;
        overflowY = 'auto';
      }
      let finalStyle = {
        left: domLimit.left,
        top: domLimit.top,
        width: domLimit.width,
        overflowY,
        ...attrs.style
      };
      return fixStyle(finalStyle, {
        targetLimit,
        pageLimit
      });
    }
  };
  return $$.align();
}
const Highlight = /*#__PURE__*/forwardRef((props, ref) => {
  let [open, setOpen] = useState(false);
  let [limit, setLimit] = useState({
    Left: 0,
    Top: 0,
    Width: 0,
    Height: 0,
    TopSpace: 0,
    BottomSpace: 0
  });
  let configRef = useRef();
  const config = configRef.current;
  let limitRef = useRef(limit);
  limitRef.current = limit;
  useImperativeHandle(ref, () => ({
    addHighlight,
    removeHighlight
  }));
  function getDomLimit(dom) {
    const padding = getConfig('padding', 6);
    let offset = dom.offset();
    let left = offset.left - window.pageXOffset;
    let top = offset.top - window.pageYOffset;
    let pageHeight = window.innerHeight;
    let width = dom.outerWidth();
    let height = dom.outerHeight();
    let Top = top - 1 * padding;
    let Left = left - 1 * padding;
    let Width = width + 2 * padding;
    let Height = height + 2 * padding;
    let TopSpace = top;
    let BottomSpace = pageHeight - (top + height);
    let res = {
      Left,
      Top,
      Width,
      Height,
      TopSpace,
      BottomSpace
    };
    return res;
  }
  function getEasing() {
    const easing = getConfig('easing', undefined);
    var easingNames = ['linear', 'easeInQuad',
    //1
    'easeInSine',
    //5
    'easeInCirc',
    //7
    'easeInBack',
    //8
    'easeOutQuad',
    //9
    'easeOutSine',
    //13
    'easeOutCirc',
    //15
    'easeInOutQuad',
    //18
    'easeInOutSine',
    //22
    'easeInOutBack',
    //25
    'easeOutBounce' //27
    ];
    if (typeof easing === 'number') {
      let res = easingNames[easing];
      return res || easingNames[0];
    }
    return easing;
  }
  function removeHighlight() {
    setLimit({
      Left: 0,
      Top: 0,
      Width: 0,
      Height: 0,
      TopSpace: 0,
      BottomSpace: 0
    });
    setOpen(false);
  }
  function addHighlight(config) {
    const {
      dom
    } = config;
    configRef.current = config;
    setOpen(true);
    setTimeout(() => {
      try {
        const duration = getConfig('duration', 1200);
        dom[0].scrollIntoView();
        let newLimit = getDomLimit(dom);
        let easing = getEasing();
        let obj = {
          ...newLimit,
          targets: [{
            ...limitRef.current
          }],
          duration,
          update: p => {
            const {
              animatables
            } = p;
            setLimit({
              ...animatables[0].target
            });
          }
        };
        if (easing) {
          obj.easing = easing;
        }
        anime(obj);
      } catch {
        alert(`
          aio-highlighter error => connot find dom
        `);
      }
    }, 0);
  }
  function getArrowIcon(props) {
    return /*#__PURE__*/_jsx("svg", {
      version: "1.1",
      id: "Layer_1",
      xmlns: "http://www.w3.org/2000/svg",
      x: "0px",
      y: "0px",
      viewBox: "0 0 512 512",
      ...props,
      children: /*#__PURE__*/_jsxs("g", {
        children: [/*#__PURE__*/_jsx("path", {
          d: "M242.1,45.2c7.7-7.7,20.2-7.7,27.8-0.1l0.1,0.1l236.3,236.3c7.7,7.7,7.7,20.2,0,27.9c-7.7,7.7-20.2,7.7-27.9,0 L256,86.9L33.7,309.3c-7.7,7.7-20.2,7.7-27.9,0c-7.7-7.7-7.7-20.2,0-27.9L242.1,45.2z"
        }), /*#__PURE__*/_jsx("path", {
          d: "M242.1,202.7c7.7-7.7,20.2-7.7,27.8-0.1l0.1,0.1L506.2,439c7.7,7.7,7.7,20.2,0,27.9c-7.7,7.7-20.2,7.7-27.9,0 L256,244.5L33.7,466.9c-7.7,7.7-20.2,7.7-27.9,0c-7.7-7.7-7.7-20.2,0-27.9L242.1,202.7z"
        })]
      })
    });
  }
  function getArrow(dir, left, width) {
    let center = left + width / 2,
      Left = center - 12;
    let style = {
      position: 'absolute',
      height: 24,
      width: 24,
      left: Left
    };
    let props = {
      width: 24,
      height: 24,
      style,
      className: `aio-popup-highlight-arrow-${dir}`
    };
    return /*#__PURE__*/_jsx("div", {
      className: "aio-popup-highlight-arrow",
      children: getArrowIcon(props)
    });
  }
  function getHtml(dir) {
    if (!config || !config.html) {
      return '';
    }
    let column;
    let html = config.html || '';
    let space = /*#__PURE__*/_jsx("div", {
      className: "aio-popup-highlight-space"
    });
    let content = /*#__PURE__*/_jsx("div", {
      className: "aio-popup-highlight-html",
      children: html
    });
    let arrow = getArrow(dir, limitRef.current.Left, limitRef.current.Width);
    if (dir === 'top') {
      column = /*#__PURE__*/_jsxs(_Fragment, {
        children: [space, content, arrow]
      });
    } else {
      column = /*#__PURE__*/_jsxs(_Fragment, {
        children: [arrow, content, space]
      });
    }
    return /*#__PURE__*/_jsx("div", {
      className: "aio-popup-highlight-html-container",
      children: column
    });
  }
  function getConfig(field, def) {
    if (!config) {
      return def;
    }
    if (config === null) {
      return def;
    }
    let res = config[field];
    return res === undefined ? def : res;
  }
  function click() {
    if (getConfig('mouseAccess', false)) {
      return;
    }
    if (config !== null && config !== void 0 && config.onClick) {
      config.onClick();
    }
  }
  function vMask_node(type) {
    let html = '',
      size = 0,
      className = 'aio-popup-highlight-mask';
    let dir = type === 'top' || type === 'bottom' ? 'height' : 'width';
    let limit = limitRef.current;
    if (type === 'top') {
      size = limit.Top;
      if (limit.TopSpace > limit.BottomSpace) {
        html = getHtml('top');
      }
    } else if (type === 'bottom') {
      className += ' aio-popup-highlight-mask-flex';
      if (limit.TopSpace <= limit.BottomSpace) {
        html = getHtml('bottom');
      }
    } else if (type === 'left') {
      size = limit.Left;
    } else {
      className += ' aio-popup-highlight-mask-flex';
    }
    return /*#__PURE__*/_jsx("div", {
      className: className,
      style: {
        [dir]: size
      },
      onClick: () => click(),
      children: html
    });
  }
  function focus_node() {
    const mouseAccess = getConfig('mouseAccess', false);
    return /*#__PURE__*/_jsx("div", {
      style: {
        width: limit.Width
      },
      className: "aio-popup-highlight-focus-container",
      onClick: mouseAccess ? undefined : () => click(),
      children: /*#__PURE__*/_jsx("div", {
        className: "aio-popup-highlight-focus"
      })
    });
  }
  function main_node() {
    return /*#__PURE__*/_jsxs("div", {
      className: "aio-popup-highlight-main",
      style: {
        height: limit.Height
      },
      children: [vMask_node('left'), focus_node(), vMask_node('right')]
    });
  }
  if (!open) {
    return null;
  }
  function getStyle() {
    const mouseAccess = getConfig('mouseAccess', false);
    return {
      pointerEvents: mouseAccess ? 'none' : 'all'
    };
  }
  const attrs = AddToAttrs(getConfig('attrs', {}), {
    className: 'aio-popup-highlight',
    style: getStyle()
  });
  return /*#__PURE__*/_jsxs("div", {
    ...attrs,
    children: [vMask_node('top'), main_node(), vMask_node('bottom')]
  });
});
const CloseIcon = () => {
  return /*#__PURE__*/_jsx("svg", {
    viewBox: "0 0 24 24",
    role: "presentation",
    style: {
      width: '1.2rem',
      height: '1.2rem'
    },
    children: /*#__PURE__*/_jsx("path", {
      d: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
      style: {
        fill: 'currentcolor'
      }
    })
  });
};
function AddToAttrs(attrs, p) {
  attrs = attrs || {};
  let {
    style
  } = p;
  let attrClassName = attrs.className ? attrs.className.split(' ') : [];
  let className = p.className ? Array.isArray(p.className) ? p.className : p.className.split(' ') : [];
  let classNames = [...attrClassName, ...className.filter(o => !!o)];
  let newClassName = classNames.length ? classNames.join(' ') : undefined;
  let newStyle = {
    ...attrs.style,
    ...style
  };
  return {
    ...attrs,
    className: newClassName,
    style: newStyle,
    ...p.attrs
  };
}