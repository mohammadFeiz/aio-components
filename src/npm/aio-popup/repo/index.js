var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createRef, useEffect, useState, createContext, useContext, useRef } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import anime from "animejs/lib/anime.es.js";
import $ from 'jquery';
import './index.css';
const CTX = createContext({});
function Align(p) {
    let { modal, target, fitHorizontal, rtl, limitTo } = p;
    const bodyWidth = window.innerWidth, bodyHeight = window.innerHeight;
    let pageLimit = { left: 0, top: 0, bottom: bodyHeight, right: bodyWidth, width: bodyWidth, height: bodyHeight };
    let targetLimit = getBound(target[0]);
    let domLimit = getBound(modal[0]);
    targetLimit = Object.assign({}, targetLimit);
    domLimit = Object.assign({}, domLimit);
    let overflowY;
    domLimit.top = targetLimit.bottom;
    domLimit.bottom = domLimit.top + domLimit.height;
    if (fitHorizontal) {
        domLimit.width = targetLimit.width;
        domLimit.left = targetLimit.left;
        domLimit.right = targetLimit.left + targetLimit.width;
    }
    else {
        if (limitTo) {
            let elem = modal.parents(limitTo);
            if (elem.length) {
                pageLimit = getBound(elem[0]);
            }
        }
        //اگر راست به چپ باید باشد
        if (rtl) {
            //راست المان را با راست هدف ست کن
            domLimit.right = targetLimit.right;
            //چپ المان را بروز رسانی کن
            domLimit.left = domLimit.right - domLimit.width;
            //اگر المان از سمت چپ از صفحه بیرون زد سمت چپ المان را با سمت چپ صفحه ست کن
            if (domLimit.left < pageLimit.left) {
                domLimit.left = pageLimit.left;
            }
        }
        else {
            //چپ المان را با چپ هدف ست کن
            domLimit.left = targetLimit.left;
            //راست المان را بروز رسانی کن
            domLimit.right = domLimit.left + domLimit.width;
            //اگر المان از سمت راست صفحه بیرون زد سمت چپ المان را با پهنای المان ست کن
            if (domLimit.right > pageLimit.right) {
                domLimit.left = pageLimit.right - domLimit.width;
            }
        }
    }
    //اگر المان از سمت پایین صفحه بیرون زد
    if (domLimit.bottom > pageLimit.bottom) {
        if (domLimit.height > targetLimit.top - pageLimit.top) {
            domLimit.top = pageLimit.bottom - domLimit.height;
        }
        else {
            domLimit.top = targetLimit.top - domLimit.height;
        }
    }
    else {
        domLimit.top = targetLimit.bottom;
    }
    if (domLimit.height > pageLimit.height) {
        domLimit.top = pageLimit.top;
        domLimit.height = pageLimit.height;
        overflowY = 'auto';
    }
    return { left: domLimit.left, top: domLimit.top, width: domLimit.width, overflowY, maxWidth: pageLimit.width };
}
const CloseIcon = () => {
    return (_jsx("svg", { viewBox: "0 0 24 24", role: "presentation", style: { width: '1.2rem', height: '1.2rem' }, children: _jsx("path", { d: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", style: { fill: 'currentcolor' } }) }));
};
function AddToAttrs(attrs, p) {
    attrs = attrs || {};
    let { style } = p;
    let attrClassName = attrs.className ? attrs.className.split(' ') : [];
    let className = p.className ? (Array.isArray(p.className) ? p.className : p.className.split(' ')) : [];
    let classNames = [...attrClassName, ...className.filter((o) => !!o)];
    let newClassName = classNames.length ? classNames.join(' ') : undefined;
    let newStyle = Object.assign(Object.assign({}, attrs.style), style);
    return Object.assign(Object.assign(Object.assign({}, attrs), { className: newClassName, style: newStyle }), p.attrs);
}
const usePopup = (props) => {
    let [modals, setModals] = useState([]);
    const promptTexts = useRef({});
    let modalsRef = useRef(modals);
    modalsRef.current = modals;
    const getModals = () => modalsRef.current;
    const [snackebarItems, setSnackebarItems] = useState([]);
    const snackebarItemsRef = useRef(snackebarItems);
    snackebarItemsRef.current = snackebarItems;
    const [highlight, setHighlight] = useState();
    const addModal = (o) => {
        if (o.id === undefined) {
            o.id = 'popup' + Math.round(Math.random() * 1000000);
        }
        let newModal = o;
        setModals(prevModals => {
            let newModals = prevModals.filter(({ id }) => id !== o.id);
            return [...newModals, newModal];
        });
    };
    const removeModal = (arg) => __awaiter(void 0, void 0, void 0, function* () {
        if (typeof arg !== 'string') {
            arg = 'last';
        }
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
        let modal = modalsRef.current.find((o) => o.id === arg);
        if (!modal) {
            return;
        }
        $(`[data-id=${arg}]`).addClass('not-mounted');
        setTimeout(() => {
            if (modal && typeof modal.onClose === 'function') {
                modal.onClose();
            }
            setModals(prevModals => prevModals.filter((o) => o.id !== arg));
        }, 300);
    });
    const addSnackebar = (item) => {
        let items = snackebarItemsRef.current;
        let newItems = [...items, Object.assign(Object.assign({}, item), { id: 'a' + Math.round(Math.random() * 1000000000) })];
        setSnackebarItems(newItems);
    };
    const removeSnackebar = (id) => {
        const items = snackebarItemsRef.current;
        const item = items.find((o) => o.id === id);
        if (!item || item.onClose === false) {
            return;
        }
        let newItems = items.filter((o, i) => o.id !== id);
        setSnackebarItems(newItems);
        if (typeof item.onClose === 'function') {
            item.onClose();
        }
    };
    const addAlert = (obj) => Alert(Object.assign({ rtl: props === null || props === void 0 ? void 0 : props.rtl }, obj));
    const addHighlight = (highlight) => setHighlight(highlight);
    const removeHighlight = () => setHighlight(undefined);
    const addConfirm = (obj) => {
        let { title, subtitle, text, submitText = 'Yes', canselText = 'No', onSubmit, onCansel = () => { }, setAttrs = () => { return {}; } } = obj;
        const submitAttrs = AddToAttrs(obj.submitAttrs, {
            className: 'active', attrs: {
                onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                    if (!onSubmit) {
                        return;
                    }
                    let res = yield onSubmit();
                    if (res !== false) {
                        removeModal();
                    }
                }),
                type: 'button'
            }
        });
        const canselAttrs = AddToAttrs(obj.canselAttrs, {
            attrs: {
                onClick: () => { onCansel(); removeModal(); },
                type: 'button'
            }
        });
        let config = {
            position: 'center', header: { title, subtitle }, body: _jsx(_Fragment, { children: text }),
            setAttrs: (key) => {
                let attrs = setAttrs(key);
                return key === 'modal' ? AddToAttrs(attrs, { className: 'aio-popup-confirm' }) : attrs;
            },
            footer: (_jsxs(_Fragment, { children: [_jsx("button", Object.assign({}, canselAttrs, { children: canselText })), _jsx("button", Object.assign({}, submitAttrs, { children: submitText }))] }))
        };
        addModal(config);
    };
    const addPrompt = (obj) => {
        const id = 'a' + (Math.round(Math.random() * 100000));
        let { title, text = '', subtitle, submitText = 'Submit', canselText = 'close', onSubmit, onCansel = () => { }, setAttrs = () => { return {}; } } = obj;
        const submitAttrs = AddToAttrs(obj.submitAttrs, {
            className: 'active', attrs: {
                onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                    if (!onSubmit) {
                        return;
                    }
                    const value = promptTexts.current[id];
                    let res = yield onSubmit(value);
                    if (res !== false) {
                        removeModal();
                    }
                    else {
                        const newPromptTexts = {};
                        for (let prop in promptTexts.current) {
                            if (prop !== id) {
                                newPromptTexts[prop] = promptTexts.current[prop];
                            }
                        }
                        promptTexts.current = newPromptTexts;
                    }
                }),
                type: 'button'
            }
        });
        const canselAttrs = AddToAttrs(obj.canselAttrs, { attrs: {
                onClick: () => { onCansel(); removeModal(); },
                type: 'button'
            } });
        let config = {
            position: 'center', header: { title, subtitle },
            setAttrs: (key) => {
                let attrs = setAttrs(key);
                return key === 'modal' ? AddToAttrs(attrs, { className: 'aio-popup-prompt' }) : attrs;
            },
            body: _jsx(Prompt, { change: (value) => promptTexts.current = Object.assign(Object.assign({}, promptTexts.current), { [id]: value }), placeholder: text }),
            footer: (_jsxs(_Fragment, { children: [_jsx("button", Object.assign({}, canselAttrs, { children: canselText })), _jsx("button", Object.assign({}, submitAttrs, { children: submitText }))] }))
        };
        addModal(config);
    };
    const getContext = () => {
        return {
            rtl: !!props && !!props.rtl,
            snackebarItems: snackebarItemsRef.current,
            removeSnackebar, removeModal
        };
    };
    const render = (caller) => {
        return (_jsxs(CTX.Provider, { value: getContext(), children: [modalsRef.current.map((modal, i) => {
                    return (_jsx(Popup, { modal: modal, isLast: i === modalsRef.current.length - 1, renderCaller: caller }, modal.id));
                }), snackebarItems.map((item, i) => _jsx(SnackebarItem, { item: item, index: i }, item.id)), !!highlight && _jsx(Highlight, { highlight: highlight })] }));
    };
    const portal = () => ReactDOM.createPortal(render(), document.body);
    return { addAlert, addSnackebar, removeModal, addModal, getModals, addHighlight, removeHighlight, render, addConfirm, addPrompt, portal };
};
export default usePopup;
const Prompt = ({ change, placeholder }) => {
    const [text, setText] = useState('');
    return (_jsx("textarea", { placeholder: placeholder, value: text, onChange: (e) => { const value = e.target.value; setText(value); change(value); } }));
};
const POPUPCTX = createContext({});
const Popup = ({ modal, isLast, renderCaller }) => {
    const mainContext = useContext(CTX);
    let { setAttrs = () => { return {}; }, id, position = 'fullscreen', getTarget } = modal;
    let [temp] = useState({ dom: createRef(), backdropDom: createRef(), dui: undefined });
    let [popoverStyle, setPopoverStyle] = useState({});
    let modalMouseDown = useRef(false);
    //bar taraf kardane moshkele mozakhrafe click rooye backdrop ke az har ja mouse ro roosh vel mikoni modal baste mishe
    const isModalMouseDown = () => modalMouseDown.current;
    let [state, setState] = useState(modal.state);
    let attrs = setAttrs('modal') || {};
    const firstMount = useRef(false);
    useEffect(() => () => { $(window).unbind('click', handleBackClick); });
    useEffect(() => {
        if (position === 'popover') {
            setPopoverStyle(getPopoverStyle());
        }
        if (getTarget) {
            temp.dui = 'a' + (Math.round(Math.random() * 10000000));
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
        mainContext.removeModal();
    }
    function getModalProps() {
        let style = Object.assign(Object.assign({}, popoverStyle), attrs.style);
        let ev = "ontouchstart" in document.documentElement ? 'onTouchStart' : 'onMouseDown';
        return Object.assign(Object.assign({}, attrs), { ref: temp.dom, "data-id": modal.id, tabIndex: 0, onKeyDown, [ev]: mouseDown, className: getClassName(), style: Object.assign({}, style), onClick: (e) => { e.stopPropagation(); } });
    }
    function getPopoverStyle() {
        if (!getTarget) {
            return {};
        }
        let target = getTarget();
        if (!target || !target.length) {
            return {};
        }
        let p = { modal: $(temp.dom.current), target, fitHorizontal: modal.fitHorizontal, limitTo: modal.limitTo, attrs, rtl: mainContext.rtl };
        let style = Align(p);
        let res = Object.assign(Object.assign({}, style), { position: 'absolute' });
        return res;
    }
    function onKeyDown(e) {
        if (!isLast) {
            return;
        }
        let code = e.keyCode;
        if (code === 27) {
            mainContext.removeModal();
        }
    }
    function mouseUp() {
        setTimeout(() => modalMouseDown.current = false, 0);
    }
    function mouseDown(e) {
        modalMouseDown.current = true;
        $(window).unbind('mouseup', mouseUp);
        $(window).bind('mouseup', mouseUp);
    }
    function getClassName() {
        let className = 'aio-popup';
        className += mainContext.rtl ? ' rtl' : ' ltr';
        if (firstMount) {
            className += ' not-mounted';
        }
        if (attrs.className) {
            className += ' ' + attrs.className;
        }
        return className;
    }
    const getContext = () => ({ modal, isLast, state, setState, onKeyDown });
    return (_jsx(POPUPCTX.Provider, { value: getContext(), children: _jsx(ModalBackdrop, { firstMount: !!firstMount, backdropDom: temp.backdropDom, isModalMouseDown: isModalMouseDown, children: _jsxs("div", Object.assign({}, getModalProps(), { children: [_jsx(ModalHeader, {}), _jsx(ModalBody, {}, modal.id), _jsx(ModalFooter, {})] }), modal.id) }, modal.id) }));
};
const ModalBackdrop = ({ children, firstMount, backdropDom, isModalMouseDown }) => {
    const { removeModal, rtl } = useContext(CTX);
    let { modal, onKeyDown } = useContext(POPUPCTX);
    let { setAttrs = () => { return {}; }, id, position = 'fullscreen' } = modal;
    const [attrs] = useState(setAttrs('backdrop') || {});
    function backClick(e) {
        if (isModalMouseDown()) {
            return;
        }
        if (e.target !== e.currentTarget) {
            return;
        }
        let target = $(e.target);
        if (!target.hasClass('aio-popup-backdrop')) {
            return;
        }
        removeModal();
    }
    function getProps() {
        let className = 'aio-popup-backdrop';
        className += ` aio-popup-position-${position}`;
        className += rtl ? ' rtl' : ' ltr';
        if (firstMount) {
            className += ' not-mounted';
        }
        return AddToAttrs(attrs, { className, attrs: { ref: backdropDom, onKeyDown, tabIndex: 0, ['data-id']: id, onClick: attrs.onClick ? attrs.onClick : backClick } });
    }
    return _jsx("div", Object.assign({}, getProps(), { children: children }));
};
const ModalHeader = () => {
    const { removeModal } = useContext(CTX);
    let { modal, state, setState } = useContext(POPUPCTX);
    if (!modal.header) {
        return null;
    }
    let { setAttrs = () => { return {}; } } = modal;
    let attrs = setAttrs('header') || {};
    if (typeof modal.header === 'function') {
        return modal.header({ removeModal: removeModal, state, setState });
    }
    if (typeof modal.header !== 'object') {
        return null;
    }
    return (_jsxs("div", Object.assign({}, AddToAttrs(attrs, { className: 'aio-popup-header' }), { children: [_jsx(ModalHeaderElement, { type: 'before' }, 'before'), _jsx(ModalHeaderElement, { type: 'title' }, 'title'), _jsx(ModalHeaderElement, { type: 'after' }, 'after'), _jsx(ModalClose, {})] })));
};
const ModalHeaderElement = ({ type }) => {
    let { modal } = useContext(POPUPCTX), { header } = modal;
    if (typeof header === 'function' || !header) {
        return null;
    }
    if (!header[type]) {
        return null;
    }
    return _jsx("div", { className: `aio-popup-header-${type}`, "data-subtitle": type === 'title' ? header.subtitle : undefined, children: header[type] });
};
const ModalClose = () => {
    const { removeModal } = useContext(CTX);
    let { modal, state, setState } = useContext(POPUPCTX), { header } = modal;
    if (typeof header === 'function' || !header) {
        return null;
    }
    if (header.onClose === false) {
        return null;
    }
    return _jsx("div", { className: `aio-popup-header-close`, onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (typeof header.onClose === 'function') {
                header.onClose({ state, setState });
            }
            else {
                removeModal(modal.id);
            }
        }, children: _jsx(CloseIcon, {}) });
};
const ModalBody = () => {
    const { modal } = useContext(POPUPCTX);
    let { body, setAttrs = () => { return {}; } } = modal;
    let attrs = setAttrs('body') || {};
    if (!body || body === null) {
        return null;
    }
    return (_jsx("div", Object.assign({}, AddToAttrs(attrs, { className: 'aio-popup-body aio-popup-scroll' }), { children: body })));
};
const ModalFooter = () => {
    const { modal } = useContext(POPUPCTX);
    let { setAttrs = () => { return {}; }, footer } = modal;
    if (!footer) {
        return null;
    }
    let Attrs = setAttrs('footer') || {};
    const attrs = AddToAttrs(Attrs, { className: 'aio-popup-footer' });
    return _jsx("div", Object.assign({}, attrs, { children: footer }));
};
const SBCTX = createContext({});
const SnackebarItem = (props) => {
    const mainContext = useContext(CTX);
    let { item } = props;
    let { time = 8, id, align = ['right', 'top'] } = item;
    if (align[1] !== 'top' && align[1] !== 'bottom') {
        align[1] = 'top';
    }
    if (align[0] !== 'left' && align[0] !== 'right' && align[0] !== 'center') {
        align[0] = 'right';
    }
    let [mounted, setMounted] = useState(false);
    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
        setTimeout(() => remove(), time * 1000);
    }, []);
    function remove() {
        setMounted(false);
        setTimeout(() => mainContext.removeSnackebar(id), 200);
    }
    const getSvg = (type) => { return type === 'error' || type === 'warning' || type === 'info' ? _jsx(InfoSvg, {}) : _jsx(SuccessSvg, {}); };
    const getContext = () => {
        return { mainContext, remove, item: Object.assign(Object.assign({}, props.item), { time, align }), index: props.index, mounted, getSvg };
    };
    return (_jsx(SBCTX.Provider, { value: getContext(), children: _jsx(SnackebarContainer, {}) }));
};
const SnackebarContainer = () => {
    const { mainContext, mounted, index, item, remove } = useContext(SBCTX);
    const { rtl } = mainContext;
    let { onClose, align = ['right', 'top'] } = item;
    function getOffsetStyle(index) {
        let els = $('.aio-popup-snackebar-item-container'), sum = { top: 12, bottom: 12 };
        for (let i = 0; i < index; i++) {
            let dom = els.eq(i);
            let height = dom.height() + 6;
            let va = dom.attr('data-vertical-align');
            sum[va] += height;
        }
        return {
            [align[1] === 'top' ? 'top' : 'bottom']: sum[align[1]]
        };
    }
    let className = 'aio-popup-snackebar-item-container';
    className += ` aio-popup-snackebar-item-container-horizontal-align-${align[0]}`;
    if (mounted) {
        className += ' mounted';
    }
    if (rtl) {
        className += ' rtl';
    }
    let style = getOffsetStyle(index);
    let p = { 'data-vertical-align': align[1], className, style, onClick: onClose === false ? undefined : () => remove() };
    return _jsx("div", Object.assign({}, p, { children: _jsx(SnackebarCard, {}) }));
};
const SnackebarCard = () => {
    const { item } = useContext(SBCTX);
    let { type, attrs = {} } = item;
    let className = 'aio-popup-snackebar-item';
    className += ` aio-popup-snackebar-item-${type}`;
    if (attrs.className) {
        className += ` ${attrs.className}`;
    }
    let p = Object.assign(Object.assign({}, attrs), { className, style: attrs.style });
    return (_jsxs("div", Object.assign({}, p, { children: [_jsx(SnackebarIcon, {}), _jsx(SnackebarText, {}), _jsx(SnackebarAction, {}), _jsx(SnackebarBar, {})] })));
};
const SnackebarIcon = () => {
    const { getSvg, item } = useContext(SBCTX);
    return _jsx("div", { className: `aio-popup-snackebar-item-icon`, children: !!item.icon ? item.icon : getSvg(item.type) });
};
const SnackebarText = () => {
    const { item } = useContext(SBCTX);
    return (_jsxs("div", { className: 'aio-popup-snackebar-item-text', children: [_jsx("div", { className: 'aio-popup-snackebar-item-uptext', children: item.text }), !!item.subtext && _jsx("div", { className: 'aio-popup-snackebar-item-subtext', children: item.subtext })] }));
};
const SnackebarAction = () => {
    const { item, remove } = useContext(SBCTX);
    const { action } = item;
    if (!action || !action.text) {
        return null;
    }
    let p = {
        className: 'aio-popup-snackebar-item-action',
        onClick: (e) => { e.stopPropagation(); if (action) {
            action.onClick();
        } remove(); }
    };
    return (_jsx("button", Object.assign({}, p, { children: action.text })));
};
const SnackebarBar = () => {
    const { item } = useContext(SBCTX);
    return _jsx("div", { className: 'aio-popup-snackebar-bar', style: { transition: `${item.time || 8}s linear` } });
};
export function Alert(props) {
    let { icon, type = '', title = '', text = '', time = 10, className, closeText = 'Close', onClose, rtl } = props;
    let $$ = {
        id: '',
        time: 0,
        getId() {
            return 'aa' + Math.round((Math.random() * 100000000));
        },
        getBarRender() {
            return `<div class='aio-popup-time-bar' style="width:${$$.time}%;"></div>`;
        },
        updateBarRender() {
            $(`.aio-popup-alert-container.${$$.id} .aio-popup-time`).html($$.getBarRender());
        },
        getRender() {
            return (`
      <div class='aio-popup-alert-container not-mounted ${$$.id} aio-popup-alert-container-center${!!className ? ` ${className}` : ''}'>
        <div class='aio-popup-alert aio-popup-alert-${type}'>
          <div class='aio-popup-alert-header'>${$$.getIcon()}</div>
          <div class='aio-popup-alert-body aio-popup-scroll'>
            <div class='aio-popup-alert-title'>${ReactDOMServer.renderToStaticMarkup(title)}</div>
            <div class='aio-popup-alert-text' style="text-align:${rtl ? 'right' : 'left'}">${text}</div>
          </div>
          <div class='aio-popup-alert-footer'>
            <button class='aio-popup-alert-close ${$$.id}'>${closeText}</button>
          </div>
          <div class='aio-popup-time'></div>
        </div>
      </div>
    `);
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
                error: (`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>`),
                warning: (`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"></path></svg>`),
                info: (`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"></path></svg>`),
                success: (`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"></path></svg>`)
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
            }
            else {
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
const Highlight = ({ highlight }) => {
    const [limit, setLimit] = useState({ Left: 0, Top: 0, Width: 0, Height: 0, TopSpace: 0, BottomSpace: 0 });
    const limitRef = useRef(limit);
    limitRef.current = limit;
    useEffect(() => {
        setTimeout(() => {
            try {
                const { dom, duration = 1200 } = highlight;
                dom[0].scrollIntoView();
                let newLimit = getHLLimit(highlight);
                let easing = getEasing(highlight);
                let obj = Object.assign(Object.assign({}, newLimit), { targets: [Object.assign({}, limitRef.current)], duration, update: (p) => {
                        const { animatables } = p;
                        setLimit(Object.assign({}, animatables[0].target));
                    } });
                if (easing) {
                    obj.easing = easing;
                }
                anime(obj);
            }
            catch (_a) {
                alert(`aio-highlighter error => connot find dom`);
            }
        }, 0);
    });
    function getArrowIcon(props) {
        return (_jsx("svg", Object.assign({ version: "1.1", id: "Layer_1", xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", viewBox: "0 0 512 512" }, props, { children: _jsxs("g", { children: [_jsx("path", { d: "M242.1,45.2c7.7-7.7,20.2-7.7,27.8-0.1l0.1,0.1l236.3,236.3c7.7,7.7,7.7,20.2,0,27.9c-7.7,7.7-20.2,7.7-27.9,0\r\n            L256,86.9L33.7,309.3c-7.7,7.7-20.2,7.7-27.9,0c-7.7-7.7-7.7-20.2,0-27.9L242.1,45.2z" }), _jsx("path", { d: "M242.1,202.7c7.7-7.7,20.2-7.7,27.8-0.1l0.1,0.1L506.2,439c7.7,7.7,7.7,20.2,0,27.9c-7.7,7.7-20.2,7.7-27.9,0\r\n            L256,244.5L33.7,466.9c-7.7,7.7-20.2,7.7-27.9,0c-7.7-7.7-7.7-20.2,0-27.9L242.1,202.7z" })] }) })));
    }
    function getArrow(dir, left, width) {
        let center = left + width / 2, Left = center - 12;
        let style = { position: 'absolute', height: 24, width: 24, left: Left };
        let props = { width: 24, height: 24, style, className: `aio-popup-highlight-arrow-${dir}` };
        return (_jsx("div", { className: "aio-popup-highlight-arrow", children: getArrowIcon(props) }));
    }
    function getHtml(dir) {
        if (!highlight.html) {
            return '';
        }
        let column;
        let html = highlight.html || '';
        let space = _jsx("div", { className: "aio-popup-highlight-space" });
        let content = _jsx("div", { className: "aio-popup-highlight-html", children: html });
        let arrow = getArrow(dir, limitRef.current.Left, limitRef.current.Width);
        if (dir === 'top') {
            column = _jsxs(_Fragment, { children: [space, content, arrow] });
        }
        else {
            column = _jsxs(_Fragment, { children: [arrow, content, space] });
        }
        return _jsx("div", { className: "aio-popup-highlight-html-container", children: column });
    }
    function click() {
        if (highlight.mouseAccess) {
            return;
        }
        if (highlight.onClick) {
            highlight.onClick();
        }
    }
    function vMask_node(type) {
        let html = '', size = 0, className = 'aio-popup-highlight-mask';
        let dir = type === 'top' || type === 'bottom' ? 'height' : 'width';
        let limit = limitRef.current;
        if (type === 'top') {
            size = limit.Top;
            if (limit.TopSpace > limit.BottomSpace) {
                html = getHtml('top');
            }
        }
        else if (type === 'bottom') {
            className += ' aio-popup-highlight-mask-flex';
            if (limit.TopSpace <= limit.BottomSpace) {
                html = getHtml('bottom');
            }
        }
        else if (type === 'left') {
            size = limit.Left;
        }
        else {
            className += ' aio-popup-highlight-mask-flex';
        }
        return (_jsx("div", { className: className, style: { [dir]: size }, onClick: () => click(), children: html }));
    }
    function focus_node() {
        const cls1 = "aio-popup-highlight-focus-container", cls2 = 'aio-popup-highlight-focus';
        return (_jsx("div", { style: { width: limit.Width }, className: cls1, onClick: click, children: _jsx("div", { className: cls2 }) }));
    }
    function main_node() {
        return _jsxs("div", { className: "aio-popup-highlight-main", style: { height: limit.Height }, children: [vMask_node('left'), focus_node(), vMask_node('right')] });
    }
    function getStyle() { return { pointerEvents: highlight.mouseAccess ? 'none' : 'all' }; }
    const attrs = AddToAttrs(highlight.attrs, { className: 'aio-popup-highlight', style: getStyle() });
    return (_jsxs("div", Object.assign({}, attrs, { children: [vMask_node('top'), main_node(), vMask_node('bottom')] })));
};
function getHLLimit(highlight) {
    const { padding = 6, dom } = highlight;
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
    let res = { Left, Top, Width, Height, TopSpace, BottomSpace };
    return res;
}
function getEasing(highlight) {
    const { easing } = highlight;
    var easingNames = [
        'linear',
        'easeInQuad',
        'easeInSine',
        'easeInCirc',
        'easeInBack',
        'easeOutQuad',
        'easeOutSine',
        'easeOutCirc',
        'easeInOutQuad',
        'easeInOutSine',
        'easeInOutBack',
        'easeOutBounce', //27
    ];
    if (typeof easing === 'number') {
        let res = easingNames[easing];
        return res || easingNames[0];
    }
    return easing;
}
const InfoSvg = () => {
    const d = "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z";
    return (_jsx("svg", { viewBox: "0 0 24 24", role: "presentation", style: { width: '1.2rem', height: '1.2rem' }, children: _jsx("path", { d: d, style: { fill: 'currentcolor' } }) }));
};
const SuccessSvg = () => {
    const d = "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z";
    return (_jsx("svg", { viewBox: "0 0 24 24", role: "presentation", style: { width: '1.2rem', height: '1.2rem' }, children: _jsx("path", { d: d, style: { fill: 'currentcolor' } }) }));
};
function getBound(dom) {
    try {
        const res = dom.getBoundingClientRect();
        return { width: res.width, height: res.height, left: res.left, top: res.top, bottom: res.bottom, right: res.right };
    }
    catch (_a) {
        return { width: 0, height: 0, left: 0, top: 0, bottom: 0, right: 0 };
    }
}
export class Loading {
    constructor(loader) {
        this.loader = '0';
        this.getLoader_0 = () => {
            return (`
            <div class="aio-loading-container-0">
                <div class="aio-loading-0">
                    ${new Array(5).fill(0).map((o, i) => this.getLoaderItem_0(`0.${i}`)).join(' ')}
                </div>
            </div>
        `);
        };
        this.getLoaderItem_0 = (ease) => {
            return `<div class="aio-loading-item-0" style="animation: 1s ease-in-out ${ease}s infinite normal none running aioloading0;"></div>`;
        };
        this.getLoader = (id) => {
            let content = '';
            if (this.loader === '0') {
                content = this.getLoader_0();
            }
            else if (typeof this.loader === 'string') {
                content = this.loader;
            }
            return (`<div class="aio-loading" id="aio-loading-${id}">${content}</div>`);
        };
        this.show = (id, parentSelector) => {
            parentSelector = parentSelector || 'body';
            let loadingStr = this.getLoader(id);
            let parent = document.querySelector(parentSelector);
            if (parent) {
                parent.insertAdjacentHTML('beforeend', loadingStr);
            }
        };
        this.hide = (id) => {
            let loadingDom = document.getElementById('aio-loading-' + id);
            if (!loadingDom) {
                loadingDom = document.querySelector('.aio-loading');
            }
            if (loadingDom) {
                loadingDom.remove();
            }
        };
        if (typeof loader === 'string') {
            this.loader = loader;
        }
    }
}
