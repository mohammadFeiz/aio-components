import { createRef, useEffect, useState, FC, createContext, useContext, useRef, ReactNode } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import $ from 'jquery';
import './index.css';
import anime from "animejs/lib/anime.es.js";
export type AP_props = { rtl?: boolean, id?: string }
export type AP_position = 'fullscreen' | 'center' | 'popover' | 'left' | 'right' | 'top' | 'bottom'
export type AP_attrsKey = 'backdrop' | 'modal' | 'header' | 'body' | 'footer';
export type AP_header = ((p: { removeModal: () => void, state: any, setState: any }) => ReactNode) | {
    title?: string,
    subtitle?: string,
    before?: ReactNode,
    after?: ReactNode,
    onClose?: boolean | ((p: { state: any, setState: (state: any) => void }) => void),
    attrs?: any
}
export type AP_body = (p: { removeModal: () => void, state?: any, setState?: (state: any) => void }) => ReactNode
export type AP_footer = (p: { state: any, setState: (v: any) => void, removeModal: () => void }) => ReactNode
type AP_setAttrs = (mode: AP_attrsKey) => any
export type AP_modal = {
    getTarget?: () => any,
    pageSelector?: string,
    limitTo?: string,
    maxHeight?: number | 'string',
    fixStyle?: (o: any, p: { targetLimit: any, pageLimit: any }) => any,
    rtl?: boolean,
    id?: string,
    onClose?: boolean | (() => void),
    position?: AP_position,
    header?: AP_header,
    state?: any,
    footer?: AP_footer,
    body?: AP_body,
    animate?: boolean,
    fitHorizontal?: boolean,
    setAttrs?: AP_setAttrs
}
export type AP_alert = {
    icon?: false | ReactNode,
    position?: AP_position,
    type: 'success' | 'error' | 'warning' | 'info',
    text?: ReactNode,
    subtext?: string,
    time?: number,
    className?: string,
    closeText?: string,
    animate?: boolean,
    onClose?: boolean | (() => void),
}
export type AP_snackebar = {
    id?: string,
    text: string,
    subtext?: string,
    icon?: ReactNode,
    time?: number,
    action?: { text: string, onClick: () => void },
    type: 'success' | 'error' | 'warning' | 'info',
    verticalAlign?: 'start' | 'end',
    horizontalAlign?: 'start' | 'center' | 'end',
    onClose?: boolean | (() => void),
    attrs?: any
}
export type AP_highlight = {
    dom: any,
    html: ReactNode,
    onClick?: () => void,
    mouseAccess?: boolean,
    attrs?: any,
    padding?: number,
    easing?: number | AP_easing,
    duration?: number
}
export type AP_confirm = { title?: string, subtitle?: string, text?: ReactNode, submitText?: string, canselText?: string, onSubmit?: () => Promise<boolean>, onCansel?: () => void, setAttrs?: AP_setAttrs }
export type AP_prompt = { title?: string, subtitle?: string, text?: string, submitText?: string, canselText?: string, onSubmit?: (text: string) => Promise<boolean>, onCansel?: () => void, setAttrs?: AP_setAttrs }
type AP_Popup_temp = { dom: any, backdropDom: any, dui?: string, isDown: boolean, }
const CTX = createContext({} as any)

type AP_align = {
    dom: any,
    target: any,
    fitHorizontal?: boolean,
    fixStyle?: (o: any, p: { targetLimit: any, pageLimit: any }) => any,
    attrs?: any,
    pageSelector?: string,
    limitTo?: string,
    rtl?: boolean,
}
function Align(p: AP_align) {
    let { dom, target, fitHorizontal, fixStyle = (o) => o, attrs = {}, pageSelector, rtl, limitTo } = p;
    let $$ = {
        getDomLimit(dom: any, type: 'popover' | 'page' | 'target') {
            let offset = dom.offset();
            let left = offset.left - window.pageXOffset;
            let top = offset.top - window.pageYOffset;
            if (pageSelector && type !== 'page') {
                let page = $(pageSelector);
                try {
                    let { left: l, top: t } = page.offset() || { left: 0, top: 0 }
                    l -= window.scrollX;
                    t -= window.scrollY;
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
        getRelatedToLmit() {
            if (!limitTo) { return }
            let elem = dom.parents(limitTo);
            if (!elem.length) { return }
            let offset = elem.offset();
            let left = offset.left - window.pageXOffset;
            let top = offset.top - window.pageYOffset;
            let width = elem.outerWidth();
            let height = elem.outerHeight();
            let right = left + width;
            let bottom = top + height;
            return { left, top, right, bottom, width, height }
        },
        align() {
            let pageLimit = $$.getPageLimit();
            let targetLimit = $$.getDomLimit(target, 'target');
            let domLimit = $$.getDomLimit(dom, 'popover');
            let overflowY;
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
            let finalStyle = { left: domLimit.left, top: domLimit.top, width: domLimit.width, overflowY, ...attrs.style }
            return fixStyle(finalStyle, { targetLimit, pageLimit })
        }
    }
    return $$.align();
}

const CloseIcon: FC = () => {
    return (
        <svg viewBox="0 0 24 24" role="presentation" style={{ width: '1.2rem', height: '1.2rem' }}><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" style={{ fill: 'currentcolor' }}></path></svg>
    )
}
function AddToAttrs(attrs: any, p: any) {
    attrs = attrs || {};
    let { style } = p;
    let attrClassName = attrs.className ? attrs.className.split(' ') : [];
    let className = p.className ? (Array.isArray(p.className) ? p.className : p.className.split(' ')) : [];
    let classNames = [...attrClassName, ...className.filter((o: any) => !!o)];
    let newClassName = classNames.length ? classNames.join(' ') : undefined
    let newStyle = { ...attrs.style, ...style };
    return { ...attrs, className: newClassName, style: newStyle, ...p.attrs }
}
type I_CTX = {
    rtl: boolean,
    snackebarItems: AP_snackebar[],
    removeSnackebar: I_removeSnackebar
    removeModal: I_removeModal
    highlight?: AP_highlight
    //close: () => void, state: any, setState: (v: any) => void 
}
type I_removeModal = (arg?: string) => void;
type I_AddAlert = (p: AP_alert) => void
type I_addModal = (o: AP_modal) => void
type I_removeSnackebar = (id: string) => void
const usePopup = (props: AP_props) => {
    let [modals, setModals] = useState<AP_modal[]>([]);
    let modalsRef = useRef(modals)
    modalsRef.current = modals;
    const getModals = () => modalsRef.current
    const [snackebarItems, setSnackebarItems] = useState<AP_snackebar[]>([]);
    const snackebarItemsRef = useRef(snackebarItems);
    snackebarItemsRef.current = snackebarItems
    const [highlight, setHighlight] = useState<AP_highlight>()
    const addModal: I_addModal = (o: AP_modal) => {
        if (o.id === undefined) { o.id = 'popup' + Math.round(Math.random() * 1000000) }
        let newModal: AP_modal = o
        setModals(prevModals => {
            let newModals: AP_modal[] = prevModals.filter(({ id }) => id !== o.id);
            return [...newModals, newModal]
        })
    }
    const removeModal: I_removeModal = async (arg = 'last') => {
        if (arg === 'all') { setModals([]); return }
        if (!modalsRef.current.length) { return }
        if (arg === 'last') { arg = modalsRef.current[modalsRef.current.length - 1].id }
        let modal: AP_modal | undefined = modalsRef.current.find((o: AP_modal) => o.id === arg);
        if (!modal) { return }
        $(`[data-id=${arg}]`).addClass('not-mounted');
        setTimeout(() => {
            if (modal && typeof modal.onClose === 'function') { modal.onClose() }
            setModals(prevModals => prevModals.filter((o) => o.id !== arg))
        }, 300)
    }
    const addSnackebar = (item: AP_snackebar) => {
        let items = snackebarItemsRef.current;
        let newItems: AP_snackebar[] = [...items, { ...item, id: 'a' + Math.round(Math.random() * 1000000000) }]
        setSnackebarItems(newItems)
    }
    const removeSnackebar: I_removeSnackebar = (id) => {
        const items = snackebarItemsRef.current;
        const item = items.find((o) => o.id === id);
        if (!item || item.onClose === false) { return }
        let newItems: AP_snackebar[] = items.filter((o: AP_snackebar, i) => o.id !== id)
        setSnackebarItems(newItems)
        if (typeof item.onClose === 'function') { item.onClose() }
    }
    const addAlert: I_AddAlert = (obj) => Alert(obj)
    function addHighlight(highlight: AP_highlight) {setHighlight(highlight)}
    function removeHighlight() {setHighlight(undefined)}
    const addConfirm = (obj: AP_confirm) => {
        let { title, subtitle, text, submitText = 'Yes', canselText = 'No', onSubmit, onCansel = () => { }, setAttrs = () => { return {} } } = obj;
        let config: AP_modal = {
            position: 'center',
            setAttrs: (key) => {
                let attrs = setAttrs(key)
                if (key === 'modal') {
                    return AddToAttrs(attrs, { className: 'aio-popup-confirm' })
                }
                return attrs
            },
            header: { title, subtitle },
            body: () => text,
            footer: () => {
                return (
                    <>
                        <button type='button' onClick={() => { onCansel(); removeModal() }}>{canselText}</button>
                        <button type='button' className='active' onClick={async () => {
                            if (!onSubmit) { return }
                            let res: boolean = await onSubmit();
                            if (res !== false) { removeModal() }
                        }}>{submitText}</button>
                    </>
                )
            }
        }
        addModal(config)
    }
    const addPrompt = (obj: AP_prompt) => {
        let { title, subtitle, text, submitText = 'Submit', canselText = 'close', onSubmit, onCansel = () => { }, setAttrs = () => { return {} } } = obj;
        let config: AP_modal = {
            position: 'center',
            setAttrs: (key) => {
                let attrs = setAttrs(key)
                if (key === 'modal') {
                    return AddToAttrs(attrs, { className: 'aio-popup-prompt' })
                }
                return attrs
            },
            state: { temp: '' },
            header: { title, subtitle },
            body: ({ state, setState }) => {
                return (
                    <textarea
                        placeholder={text} value={state.temp}
                        onChange={(e) => { if (setState) { setState({ temp: e.target.value }) } }} />
                )
            },
            footer: ({ state, setState }: { state: any, setState: (v: any) => void }) => {
                return (
                    <>
                        <button type='button' onClick={() => { onCansel(); removeModal() }}>{canselText}</button>
                        <button
                            type='button' className='active'
                            onClick={async () => {
                                if (!onSubmit) { return }
                                let res = await onSubmit(state.temp);
                                if (res !== false) { removeModal() }
                                else { setState({ temp: '' }) }
                            }}
                            disabled={!state.temp}
                        >{submitText}</button>
                    </>
                )
            }
        }
        addModal(config)
    }
    const getContext = (): I_CTX => {
        return {
            rtl: !!props.rtl,
            snackebarItems: snackebarItemsRef.current,
            removeSnackebar, removeModal
        }
    }
    const render = () => {
        return (
            <CTX.Provider value={getContext()}>
                {
                    modalsRef.current.map((modal: AP_modal, i: number) => {
                        return (<Popup key={modal.id} modal={modal} isLast={i === modalsRef.current.length - 1} />)
                    })
                }
                {snackebarItems.map((item: AP_snackebar, i) => <SnackebarItem item={item} index={i} key={item.id} />)}
                {!!highlight && <Highlight highlight={highlight} />}
            </CTX.Provider>
        )
    }
    return { addAlert, addSnackebar, removeModal, addModal, getModals,addHighlight,removeHighlight,render,addConfirm,addPrompt }
}
export default usePopup;
const POPUPCTX = createContext({} as any)
type I_POPUPCTX = {
    mainContext: I_CTX,
    modal: AP_modal,
    isLast: boolean,
    state: any,
    setState: (v: any) => void,
    onKeyDown: any
}
type AP_Popup = { modal: AP_modal, isLast: boolean }
const Popup: FC<AP_Popup> = ({ modal, isLast }) => {
    const mainContext: I_CTX = useContext(CTX);
    let { setAttrs = () => { return {} }, id, position = 'fullscreen', getTarget, maxHeight, fixStyle = (o) => o } = modal;
    let [temp] = useState<AP_Popup_temp>({ dom: createRef(), backdropDom: createRef(), dui: undefined, isDown: false })
    let [popoverStyle, setPopoverStyle] = useState({})
    let [state, setState] = useState(modal.state)
    let attrs = setAttrs('modal') || {}
    const firstMount = useRef(false);
    useEffect(() => () => { $(window).unbind('click', handleBackClick) })
    useEffect(() => {
        //be khatere 300 mili sanie transitioni ke popup dare bayad inja bish az oon 300 milisanie vaghfe bedim ta dorost update beshe andaze ha 
        let newStyle: any = position === 'popover' ? getPopoverStyle() : {}
        console.log('updatedStyle.top', newStyle.top)
        setPopoverStyle(newStyle)
        if (getTarget) {
            temp.dui = 'a' + (Math.round(Math.random() * 10000000));
            let target = getTarget();
            target.attr('data-id', temp.dui)
        }
        setTimeout(() => {
            let popup = $(temp.dom.current)
            popup.removeClass('not-mounted')
            $(temp.backdropDom.current).removeClass('not-mounted')
            popup.focus();
        }, 0)
        $(window).unbind('click', handleBackClick)
        $(window).bind('click', handleBackClick)
    }, [])
    function handleBackClick(e: any) {
        //در مود پاپاور اگر هر جایی غیر از اینپوت و پاپاور کلیک شد پاپاپ رو ببند
        if (!temp.dui) { return }
        let target = $(e.target)
        if (position !== 'popover' || target.attr('data-id') === temp.dui || target.parents(`[data-id=${temp.dui}]`).length) { return }
        close();
    }

    function getModalProps(): AP_align {
        let style: any = { ...popoverStyle, ...attrs.style }
        let ev = "ontouchstart" in document.documentElement ? 'onTouchStart' : 'onMouseDown'
        return { ...attrs, ref: temp.dom, "data-id": modal.id, tabIndex: 0, onKeyDown, [ev]: mouseDown, className: getClassName(), style: { ...style } }
    }
    function getPopoverStyle(): { [key: string]: any } {
        if (!getTarget) { return {} }
        let target = getTarget();
        if (!target || !target.length) { return {} }
        let popup = $(temp.dom.current);
        let p = { dom: popup, target, fitHorizontal: modal.fitHorizontal, fixStyle, pageSelector: modal.pageSelector, limitTo: modal.limitTo, attrs, rtl: mainContext.rtl }
        let style = Align(p)
        let res = { ...style, position: 'absolute' }
        if (maxHeight) { res.maxHeight = maxHeight }
        return res
    }
    function onKeyDown(e: any) {
        if (!isLast) { return }
        let code = e.keyCode;
        if (code === 27) { mainContext.removeModal() }
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
        className += mainContext.rtl ? ' rtl' : ' ltr'
        if (firstMount) { className += ' not-mounted' }
        if (attrs.className) { className += ' ' + attrs.className }
        return className
    }
    const getContext = (): I_POPUPCTX => ({ mainContext, modal, isLast, state, setState, onKeyDown })
    return (
        <POPUPCTX.Provider value={getContext()}>
            <ModalBackdrop
                content={<div {...getModalProps()}><ModalHeader /><ModalBody /><ModalFooter /></div>}
                firstMount={!!firstMount} ref={temp.backdropDom} isDown={temp.isDown}
            />
        </POPUPCTX.Provider>
    )
}
const ModalBackdrop: FC<{ content: ReactNode, firstMount: boolean, ref: any, isDown: boolean }> = ({ content, firstMount, ref, isDown }) => {
    let { mainContext, modal, onKeyDown }: I_POPUPCTX = useContext(POPUPCTX);
    let { setAttrs = () => { return {} }, id, position = 'fullscreen' } = modal;
    const [attrs] = useState<any>(setAttrs('backdrop') || {})
    function backClick(e: Event) {
        if (isDown) { return }
        e.stopPropagation();
        let target = $(e.target as any);
        if (!target.hasClass('aio-popup-backdrop')) { return }
        mainContext.removeModal()
    }
    function getProps() {
        let className = 'aio-popup-backdrop';
        className += ` aio-popup-position-${position}`
        className += mainContext.rtl ? ' rtl' : ' ltr'
        if (firstMount) { className += ' not-mounted' }
        return AddToAttrs(attrs, { className, attrs: { ref, onKeyDown, tabIndex: 0, ['data-id']: id, onClick: attrs.onClick ? attrs.onClick : backClick } })
    }
    return <div {...getProps()}>{content}</div>
}
const ModalHeader: FC = () => {
    let { mainContext, modal, state, setState }: I_POPUPCTX = useContext(POPUPCTX);
    if (!modal.header) { return null }
    let { setAttrs = () => { return {} } } = modal;
    let attrs = setAttrs('header') || {};
    if (typeof modal.header === 'function') { return modal.header({ removeModal: mainContext.removeModal, state, setState }) as any }
    if (typeof modal.header !== 'object') { return null }
    return (
        <div {...AddToAttrs(attrs, { className: 'aio-popup-header' })}>
            <ModalHeaderElement key='before' type='before' />
            <ModalHeaderElement key='title' type='title' />
            <ModalHeaderElement key='after' type='after' />
            <ModalClose />
        </div>
    )
}
const ModalHeaderElement: FC<{ type: 'before' | 'after' | 'title' }> = ({ type }) => {
    let { modal }: I_POPUPCTX = useContext(POPUPCTX), { header } = modal;
    if (typeof header === 'function' || !header) { return null }
    if (!header[type]) { return null }
    return <div className={`aio-popup-header-${type}`}>{header[type]}</div>
}
const ModalClose: FC = () => {
    let { modal, state, setState, mainContext }: I_POPUPCTX = useContext(POPUPCTX), { header } = modal;
    if (typeof header === 'function' || !header) { return null }
    if (header.onClose === false) { return null }
    return <div className={`aio-popup-header-close`} onClick={(e) => {
        e.stopPropagation(); e.preventDefault();
        if (typeof header.onClose === 'function') { header.onClose({ state, setState }) }
        else { mainContext.removeModal(modal.id) }
    }}><CloseIcon /></div>
}
const ModalBody: FC = () => {
    const { mainContext, state, setState, modal }: I_POPUPCTX = useContext(POPUPCTX);
    let { body = () => null, setAttrs = () => { return {} } } = modal;
    let attrs = setAttrs('body') || {}
    const param: { removeModal: () => void, state: any, setState: (v: any) => void } = { removeModal: mainContext.removeModal, state, setState }
    let content: ReactNode = body(param);
    if (!content || content === null) { return null }
    return (<div {...AddToAttrs(attrs, { className: 'aio-popup-body aio-popup-scroll' })}>{content}</div>)
}
const ModalFooter: FC = () => {
    const { mainContext, modal, state, setState }: I_POPUPCTX = useContext(POPUPCTX);
    let { setAttrs = () => { return {} }, footer } = modal;
    if (!footer) { return null }
    let Attrs = setAttrs('footer') || {};
    const attrs = AddToAttrs(Attrs, { className: 'aio-popup-footer' })
    return <div {...attrs}>{footer({ state, setState, removeModal: mainContext.removeModal })}</div>
}
export type AP_SnackebarItem = { item: AP_snackebar, index: number }
type I_getSvg = (type: AP_snackebar["type"]) => ReactNode
const SBCTX = createContext({} as any);
type I_SBCTX = { mainContext: I_CTX, item: AP_snackebar, index: number, mounted: boolean, remove: () => void, getSvg: I_getSvg }
const SnackebarItem: FC<AP_SnackebarItem> = (props) => {
    const mainContext: I_CTX = useContext(CTX)
    let { item } = props;
    let { time = 8, id, verticalAlign = 'end', horizontalAlign = 'center' } = item;
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
        setTimeout(() => mainContext.removeSnackebar(id as string), 200)
    }
    const getSvg: I_getSvg = (type) => { return type === 'error' || type === 'warning' || type === 'info' ? <InfoSvg /> : <SuccessSvg /> }
    const getContext = (): I_SBCTX => {
        return { mainContext, remove, item: props.item, index: props.index, mounted, getSvg }
    }
    return (<SBCTX.Provider value={getContext()}><SnackebarContainer /></SBCTX.Provider>)
}
const SnackebarContainer: FC = () => {
    const { mainContext, mounted, index, item, remove }: I_SBCTX = useContext(SBCTX);
    const { rtl } = mainContext;
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
    let { onClose, verticalAlign = 'end', horizontalAlign = 'center' } = item;
    let className = 'aio-popup-snackebar-item-container';
    className += ` aio-popup-snackebar-item-container-horizontal-align-${horizontalAlign}`
    if (mounted) { className += ' mounted'; }
    if (rtl) { className += ' rtl'; }
    let style = getOffsetStyle(index);
    let p = { 'data-vertical-align': verticalAlign, className, style, onClick: onClose === false ? undefined : () => remove() }
    return <div {...p}><SnackebarCard /></div>
}
const SnackebarCard: FC = () => {
    const { item }: I_SBCTX = useContext(SBCTX);
    let { type, attrs = {} } = item;
    let className = 'aio-popup-snackebar-item';
    className += ` aio-popup-snackebar-item-${type}`
    if (attrs.className) { className += ` ${attrs.className}` }
    let p = { ...attrs, className, style: attrs.style }
    return (<div {...p}><SnackebarIcon /><SnackebarText /><SnackebarAction /><SnackebarBar /></div>)
}
const SnackebarIcon: FC = () => {
    const { getSvg, item }: I_SBCTX = useContext(SBCTX)
    return <div className={`aio-popup-snackebar-item-icon`}>{!!item.icon ? item.icon : getSvg(item.type)}</div>
}
const SnackebarText: FC = () => {
    const { item }: I_SBCTX = useContext(SBCTX)
    return (
        <div className='aio-popup-snackebar-item-text'>
            <div className='aio-popup-snackebar-item-uptext'>{item.text}</div>
            {!!item.subtext && <div className='aio-popup-snackebar-item-subtext'>{item.subtext}</div>}
        </div>
    )
}
const SnackebarAction: FC = () => {
    const { item, remove }: I_SBCTX = useContext(SBCTX)
    const { action } = item;
    if (!action || !action.text) { return null }
    let p = {
        className: 'aio-popup-snackebar-item-action',
        onClick: (e: any) => { e.stopPropagation(); if (action) { action.onClick() } remove() }
    }
    return (<button {...p}>{action.text}</button>)
}
const SnackebarBar: FC = () => {
    const { item }: I_SBCTX = useContext(SBCTX)
    return <div className='aio-popup-snackebar-bar' style={{ transition: `${item.time || 8}s linear` }}></div>
}
function Alert(props: AP_alert) {
    let { icon, type = '', text = '', subtext = '', time = 10, className, closeText = 'بستن', position = 'center', onClose } = props;
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
      <div class='aio-popup-alert-container not-mounted ${$$.id} aio-popup-alert-container-${position}${!!className ? ` ${className}` : ''}'>
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
            setTimeout(() => {
                if (typeof onClose === 'function') { onClose() }
                if (onClose === false) { return }
                $('.' + $$.id).remove()
            }, 200);
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
type AP_easing = 'linear' | 'easeInQuad' | 'easeInCubic' | 'easeInQuart' | 'easeInQuint' | 'easeInSine' | 'easeInExpo' | 'easeInCirc' | 'easeInBack' | 'easeOutQuad' | 'easeOutCubic' | 'easeOutQuart' | 'easeOutQuint' | 'easeOutSine' | 'easeOutExpo' |
    'easeOutCirc' | 'easeOutBack' | 'easeInBounce' | 'easeInOutQuad' | 'easeInOutCubic' | 'easeInOutQuart' | 'easeInOutQuint' | 'easeInOutSine' | 'easeInOutExpo' | 'easeInOutCirc' | 'easeInOutBack' | 'easeInOutBounce' |
    'easeOutBounce' | 'easeOutInQuad' | 'easeOutInCubic' | 'easeOutInQuart' | 'easeOutInQuint' | 'easeOutInSine' | 'easeOutInExpo' | 'easeOutInCirc' | 'easeOutInBack' | 'easeOutInBounce'
type AP_limit = { Left: number, Top: number, Width: number, Height: number, TopSpace: number, BottomSpace: number }
const Highlight: FC<{ highlight: AP_highlight }> = ({ highlight }) => {
    const [limit, setLimit] = useState<AP_limit>({ Left: 0, Top: 0, Width: 0, Height: 0, TopSpace: 0, BottomSpace: 0 })
    const limitRef = useRef(limit);
    limitRef.current = limit;
    useEffect(() => {
        setTimeout(() => {
            try {
                const { dom, duration = 1200 } = highlight
                dom[0].scrollIntoView();
                let newLimit: AP_limit = getHLLimit(highlight)
                let easing = getEasing(highlight)
                let obj: any = {
                    ...newLimit,
                    targets: [{ ...limitRef.current }],
                    duration,
                    update: (p: any) => {
                        const { animatables } = p;
                        setLimit({ ...animatables[0].target })
                    }
                }
                if (easing) { obj.easing = easing }
                anime(obj);
            }
            catch {alert(`aio-highlighter error => connot find dom`)}
        }, 0)
    })
    function getArrowIcon(props: { [key: string]: any }): ReactNode {
        return (
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 512 512" {...props}>
                <g>
                    <path d="M242.1,45.2c7.7-7.7,20.2-7.7,27.8-0.1l0.1,0.1l236.3,236.3c7.7,7.7,7.7,20.2,0,27.9c-7.7,7.7-20.2,7.7-27.9,0
            L256,86.9L33.7,309.3c-7.7,7.7-20.2,7.7-27.9,0c-7.7-7.7-7.7-20.2,0-27.9L242.1,45.2z"/>
                    <path d="M242.1,202.7c7.7-7.7,20.2-7.7,27.8-0.1l0.1,0.1L506.2,439c7.7,7.7,7.7,20.2,0,27.9c-7.7,7.7-20.2,7.7-27.9,0
            L256,244.5L33.7,466.9c-7.7,7.7-20.2,7.7-27.9,0c-7.7-7.7-7.7-20.2,0-27.9L242.1,202.7z"/>
                </g>
            </svg>
        )
    }
    function getArrow(dir: 'top' | 'bottom', left: number, width: number): ReactNode {
        let center = left + width / 2, Left = center - 12;
        let style = { position: 'absolute', height: 24, width: 24, left: Left }
        let props = { width: 24, height: 24, style, className: `aio-popup-highlight-arrow-${dir}` }
        return (<div className="aio-popup-highlight-arrow">{getArrowIcon(props)}</div>)
    }
    function getHtml(dir: 'top' | 'bottom'): ReactNode {
        if (!highlight.html) { return '' }
        let column: ReactNode;
        let html = highlight.html || '';
        let space = <div className="aio-popup-highlight-space"></div>;
        let content = <div className="aio-popup-highlight-html">{html}</div>
        let arrow = getArrow(dir, limitRef.current.Left, limitRef.current.Width);
        if (dir === 'top') { column = <>{space}{content}{arrow}</> }
        else { column = <>{arrow}{content}{space}</> }
        return <div className="aio-popup-highlight-html-container">{column}</div>
    }
    function click() {
        if (highlight.mouseAccess) { return }
        if (highlight.onClick) { highlight.onClick() }
    }
    function vMask_node(type: 'top' | 'bottom' | 'left' | 'right'): ReactNode {
        let html: ReactNode = '', size: number = 0, className = 'aio-popup-highlight-mask'
        let dir = type === 'top' || type === 'bottom' ? 'height' : 'width'
        let limit = limitRef.current;
        if (type === 'top') {
            size = limit.Top;
            if (limit.TopSpace > limit.BottomSpace) { html = getHtml('top') }
        }
        else if (type === 'bottom') {
            className += ' aio-popup-highlight-mask-flex';
            if (limit.TopSpace <= limit.BottomSpace) { html = getHtml('bottom') }
        }
        else if (type === 'left') { size = limit.Left; }
        else { className += ' aio-popup-highlight-mask-flex'; }
        return (<div className={className} style={{ [dir]: size }} onClick={() => click()}>{html}</div>)
    }
    function focus_node(): ReactNode {
        const cls1 = "aio-popup-highlight-focus-container", cls2 = 'aio-popup-highlight-focus';
        return (<div style={{ width: limit.Width }} className={cls1} onClick={click}><div className={cls2}></div></div>)
    }
    function main_node(): ReactNode {
        return <div className="aio-popup-highlight-main" style={{ height: limit.Height }}>{vMask_node('left')}{focus_node()}{vMask_node('right')}</div>
    }
    function getStyle() { return { pointerEvents: highlight.mouseAccess ? 'none' : 'all' } }
    const attrs = AddToAttrs(highlight.attrs, { className: 'aio-popup-highlight', style: getStyle() })
    return (<div {...attrs}>{vMask_node('top')}{main_node()}{vMask_node('bottom')}</div>)
}


function getHLLimit(highlight: AP_highlight): AP_limit {
    const { padding = 6, dom } = highlight
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
    let BottomSpace = pageHeight - (top + height)
    let res: AP_limit = { Left, Top, Width, Height, TopSpace, BottomSpace };
    return res
}
function getEasing(highlight: AP_highlight) {
    const { easing } = highlight;
    var easingNames = [
        'linear',
        'easeInQuad',//1
        'easeInSine',//5
        'easeInCirc',//7
        'easeInBack',//8
        'easeOutQuad',//9
        'easeOutSine',//13
        'easeOutCirc',//15
        'easeInOutQuad',//18
        'easeInOutSine',//22
        'easeInOutBack',//25
        'easeOutBounce',//27
    ]
    if (typeof easing === 'number') {
        let res = easingNames[easing]
        return res || easingNames[0]
    }
    return easing

}
const InfoSvg: FC = () => {
    const d = "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
    return (
        <svg viewBox="0 0 24 24" role="presentation" style={{ width: '1.2rem', height: '1.2rem' }}>
            <path d={d} style={{ fill: 'currentcolor' }}></path>
        </svg>
    )
}
const SuccessSvg: FC = () => {
    const d = "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
    return (
        <svg viewBox="0 0 24 24" role="presentation" style={{ width: '1.2rem', height: '1.2rem' }}>
            <path d={d} style={{ fill: 'currentcolor' }}></path>
        </svg>
    )
}
