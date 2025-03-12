import { createRef, useEffect, useState, FC, createContext, useContext, useRef, ReactNode } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import anime from "animejs/lib/anime.es.js";
import $ from 'jquery';
import './repo/index.css';
export type AP_position = 'fullscreen' | 'center' | 'popover' | 'left' | 'right' | 'top' | 'bottom'
export type AP_attrsKey = 'backdrop' | 'modal' | 'header' | 'body' | 'footer';
export type AP_header = ((p: { removeModal: () => void, state: any, setState: any }) => ReactNode) | {
    title?: string,
    subtitle?: string,
    before?: ReactNode,
    after?: ReactNode,
    onClose?: boolean | ((p: { state: any, setState: (state: any) => void }) => void),
}
type AP_setAttrs = (mode: AP_attrsKey) => any
export type AP_modal = {
    getTarget?: () => any,
    limitTo?: string,
    rtl?: boolean,
    id?: string,
    onClose?: boolean | (() => void),
    position?: AP_position,
    header?: AP_header,
    state?: any,
    footer?: ReactNode,
    body: ReactNode,
    animate?: boolean,
    fitHorizontal?: boolean,
    setAttrs?: AP_setAttrs
}
export type AP_alert = {
    rtl?:boolean,
    icon?: false | ReactNode,
    type: 'success' | 'error' | 'warning' | 'info',
    title?: ReactNode,
    text: string,
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
    align?: ['left' | 'center' | 'right', 'top' | 'bottom'],
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
export type AP_confirm = { title?: string, subtitle?: string, text:string, submitText?: string, canselText?: string, onSubmit?: () => Promise<boolean>, onCansel?: () => void, setAttrs?: AP_setAttrs }
export type AP_prompt = { title?: string, subtitle?: string, submitText?: string, canselText?: string, onSubmit?: (text: string) => Promise<boolean>, onCansel?: () => void, setAttrs?: AP_setAttrs }
type AP_Popup_temp = { dom: any, backdropDom: any, dui?: string }
const CTX = createContext({} as any)

type AP_align = {
    modal: any,
    target: any,
    fitHorizontal?: boolean,
    limitTo?: string,
    rtl?: boolean,
}
function Align(p: AP_align) {
    let { modal, target, fitHorizontal, rtl, limitTo } = p;
    const bodyWidth = window.innerWidth, bodyHeight = window.innerHeight;
    let pageLimit = { left: 0, top: 0, bottom: bodyHeight, right: bodyWidth, width: bodyWidth, height: bodyHeight }
    let targetLimit = getBound(target[0])
    let domLimit = getBound(modal[0])
    targetLimit = { ...targetLimit }
    domLimit = { ...domLimit }
    let overflowY;
    domLimit.top = targetLimit.bottom
    domLimit.bottom = domLimit.top + domLimit.height;
    if (fitHorizontal) {
        domLimit.width = targetLimit.width;
        domLimit.left = targetLimit.left;
        domLimit.right = targetLimit.left + targetLimit.width
    }
    else {
        if (limitTo) {
            let elem = modal.parents(limitTo);
            if (elem.length) {
                pageLimit = getBound(elem[0])
            }
        }
        //اگر راست به چپ باید باشد
        if (rtl) {
            //راست المان را با راست هدف ست کن
            domLimit.right = targetLimit.right;
            //چپ المان را بروز رسانی کن
            domLimit.left = domLimit.right - domLimit.width;
            //اگر المان از سمت چپ از صفحه بیرون زد سمت چپ المان را با سمت چپ صفحه ست کن
            if (domLimit.left < pageLimit.left) { domLimit.left = pageLimit.left; }
        }
        else {
            //چپ المان را با چپ هدف ست کن
            domLimit.left = targetLimit.left;
            //راست المان را بروز رسانی کن
            domLimit.right = domLimit.left + domLimit.width;
            //اگر المان از سمت راست صفحه بیرون زد سمت چپ المان را با پهنای المان ست کن
            if (domLimit.right > pageLimit.right) { domLimit.left = pageLimit.right - domLimit.width; }
        }
    }
    //اگر المان از سمت پایین صفحه بیرون زد
    if (domLimit.bottom > pageLimit.bottom) {
        if (domLimit.height > targetLimit.top - pageLimit.top) { domLimit.top = pageLimit.bottom - domLimit.height; }
        else { domLimit.top = targetLimit.top - domLimit.height; }
    }
    else { domLimit.top = targetLimit.bottom; }
    if (domLimit.height > pageLimit.height) {
        domLimit.top = pageLimit.top;
        domLimit.height = pageLimit.height;
        overflowY = 'auto';
    }
    return { left: domLimit.left, top: domLimit.top, width: domLimit.width, overflowY, maxWidth: pageLimit.width }
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
type AP_CTX = {
    rtl: boolean,
    snackebarItems: AP_snackebar[],
    removeSnackebar: AP_removeSnackebar
    removeModal: AP_removeModal
    highlight?: AP_highlight
    //close: () => void, state: any, setState: (v: any) => void 
}
type AP_removeModal = (arg?: string) => void;
type AP_addAlert = (p: AP_alert) => void
type AP_addSnackebar = (item: AP_snackebar) => void
type AP_addModal = (o: AP_modal) => void
type AP_addHighlight = (highlight: AP_highlight) => void
type AP_removeHighlight = () => void
type AP_removeSnackebar = (id: string) => void
type AP_getModals = () => AP_modal[]
type AP_addConfirm = (item: AP_confirm) => void;
type AP_addPrompt = (item: AP_prompt) => void
type AP_render = (caller?: string) => ReactNode

export type AP_usePopup = {
    addAlert: AP_addAlert,
    addSnackebar: AP_addSnackebar,
    removeModal: AP_removeModal,
    addModal: AP_addModal,
    getModals: AP_getModals,
    addHighlight: AP_addHighlight,
    removeHighlight: AP_removeHighlight,
    render: AP_render,
    addConfirm: AP_addConfirm,
    addPrompt: AP_addPrompt
}
export type I_usePopup = {
    addAlert: AP_addAlert, addSnackebar: AP_addSnackebar, removeModal: AP_removeModal, addModal: AP_addModal, getModals: AP_getModals,
    addHighlight: AP_addHighlight, removeHighlight: AP_removeHighlight, render: AP_render, addConfirm: AP_addConfirm, addPrompt: AP_addPrompt, portal: () => void
}
const usePopup = (props?: { rtl?: boolean, id?: string }): I_usePopup => {
    let [modals, setModals] = useState<AP_modal[]>([]);
    const promptTexts = useRef<{ [key: string]: string }>({})
    let modalsRef = useRef(modals)
    modalsRef.current = modals;
    const getModals = () => modalsRef.current
    const [snackebarItems, setSnackebarItems] = useState<AP_snackebar[]>([]);
    const snackebarItemsRef = useRef(snackebarItems);
    snackebarItemsRef.current = snackebarItems
    const [highlight, setHighlight] = useState<AP_highlight>()
    const addModal: AP_addModal = (o) => {
        if (o.id === undefined) { o.id = 'popup' + Math.round(Math.random() * 1000000) }
        let newModal: AP_modal = o
        setModals(prevModals => {
            let newModals: AP_modal[] = prevModals.filter(({ id }) => id !== o.id);
            return [...newModals, newModal]
        })
    }
    const removeModal: AP_removeModal = async (arg) => {
        if (typeof arg !== 'string') { arg = 'last' }
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
    const addSnackebar: AP_addSnackebar = (item) => {
        let items = snackebarItemsRef.current;
        let newItems: AP_snackebar[] = [...items, { ...item, id: 'a' + Math.round(Math.random() * 1000000000) }]
        setSnackebarItems(newItems)
    }
    const removeSnackebar: AP_removeSnackebar = (id) => {
        const items = snackebarItemsRef.current;
        const item = items.find((o) => o.id === id);
        if (!item || item.onClose === false) { return }
        let newItems: AP_snackebar[] = items.filter((o: AP_snackebar, i) => o.id !== id)
        setSnackebarItems(newItems)
        if (typeof item.onClose === 'function') { item.onClose() }
    }
    const addAlert: AP_addAlert = (obj) => Alert({rtl:props?.rtl,...obj})
    const addHighlight: AP_addHighlight = (highlight) => setHighlight(highlight)
    const removeHighlight: AP_removeHighlight = () => setHighlight(undefined)
    const addConfirm: AP_addConfirm = (obj) => {
        let { title, subtitle,text, submitText = 'Yes', canselText = 'No', onSubmit, onCansel = () => { }, setAttrs = () => { return {} } } = obj;
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
            body: <>{text}</>,
            footer: (
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
        addModal(config)
    }
    const addPrompt: AP_addPrompt = (obj) => {
        const id = 'a' + (Math.round(Math.random() * 100000))
        let { title, subtitle, submitText = 'Submit', canselText = 'close', onSubmit, onCansel = () => { }, setAttrs = () => { return {} } } = obj;
        let config: AP_modal = {
            position: 'center',
            setAttrs: (key) => {
                let attrs = setAttrs(key)
                if (key === 'modal') {
                    return AddToAttrs(attrs, { className: 'aio-popup-prompt' })
                }
                return attrs
            },
            header: { title, subtitle },
            body: <Prompt change={(value: string) => promptTexts.current = { ...promptTexts.current, [id]: value }} />,
            footer: (
                <>
                    <button type='button' onClick={() => { onCansel(); removeModal() }}>{canselText}</button>
                    <button
                        type='button' className='active'
                        onClick={async () => {
                            if (!onSubmit) { return }
                            const value = promptTexts.current[id]
                            let res = await onSubmit(value);
                            if (res !== false) { removeModal() }
                            else {
                                const newPromptTexts: { [key: string]: string } = {}
                                for (let prop in promptTexts.current) {
                                    if (prop !== id) { newPromptTexts[prop] = promptTexts.current[prop] }
                                }
                                promptTexts.current = newPromptTexts
                            }
                        }}
                    >{submitText}</button>
                </>
            )
        }
        addModal(config)
    }
    const getContext = (): AP_CTX => {
        return {
            rtl: !!props && !!props.rtl,
            snackebarItems: snackebarItemsRef.current,
            removeSnackebar, removeModal
        }
    }
    const render: AP_render = (caller?: string) => {
        return (
            <CTX.Provider value={getContext()}>
                {
                    modalsRef.current.map((modal: AP_modal, i: number) => {
                        return (<Popup key={modal.id} modal={modal} isLast={i === modalsRef.current.length - 1} renderCaller={caller} />)
                    })
                }
                {snackebarItems.map((item: AP_snackebar, i) => <SnackebarItem item={item} index={i} key={item.id} />)}
                {!!highlight && <Highlight highlight={highlight} />}
            </CTX.Provider>
        )
    }
    const portal = () => ReactDOM.createPortal(render(), document.body)
    return { addAlert, addSnackebar, removeModal, addModal, getModals, addHighlight, removeHighlight, render, addConfirm, addPrompt, portal }
}
export default usePopup;
const Prompt: FC<{ change: (value: string) => void }> = ({ change }) => {
    const [text, setText] = useState<string>('')
    return (<textarea placeholder={text} value={text} onChange={(e) => { const value = e.target.value; setText(value); change(value) }} />)
}
const POPUPCTX = createContext({} as any)
type AP_POPUPCTX = {
    modal: AP_modal,
    isLast: boolean,
    state: any,
    setState: (v: any) => void,
    onKeyDown: any
}
type AP_Popup = { modal: AP_modal, isLast: boolean, renderCaller?: string }
const Popup: FC<AP_Popup> = ({ modal, isLast, renderCaller }) => {
    const mainContext: AP_CTX = useContext(CTX);
    let { setAttrs = () => { return {} }, id, position = 'fullscreen', getTarget } = modal;
    let [temp] = useState<AP_Popup_temp>({ dom: createRef(), backdropDom: createRef(), dui: undefined })
    let [popoverStyle, setPopoverStyle] = useState({})
    let modalMouseDown = useRef(false)
    //bar taraf kardane moshkele mozakhrafe click rooye backdrop ke az har ja mouse ro roosh vel mikoni modal baste mishe
    const isModalMouseDown = () => modalMouseDown.current;
    let [state, setState] = useState(modal.state)
    let attrs = setAttrs('modal') || {}
    const firstMount = useRef(false);
    useEffect(() => () => { $(window).unbind('click', handleBackClick) })
    useEffect(() => {
        if (position === 'popover') { setPopoverStyle(getPopoverStyle()) }
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
        mainContext.removeModal();
    }

    function getModalProps(): AP_align {
        let style: any = { ...popoverStyle, ...attrs.style }
        let ev = "ontouchstart" in document.documentElement ? 'onTouchStart' : 'onMouseDown'
        return {
            ...attrs, ref: temp.dom, "data-id": modal.id, tabIndex: 0, onKeyDown, [ev]: mouseDown, className: getClassName(),
            style: { ...style },
            onClick: (e: Event) => { e.stopPropagation(); }
        }
    }
    function getPopoverStyle(): { [key: string]: any } {
        if (!getTarget) { return {} }
        let target = getTarget();
        if (!target || !target.length) { return {} }
        let p = { modal: $(temp.dom.current), target, fitHorizontal: modal.fitHorizontal, limitTo: modal.limitTo, attrs, rtl: mainContext.rtl }
        let style = Align(p)
        let res = { ...style, position: 'absolute' }
        return res
    }
    function onKeyDown(e: any) {
        if (!isLast) { return }
        let code = e.keyCode;
        if (code === 27) { mainContext.removeModal() }
    }
    function mouseUp() {
        setTimeout(() => modalMouseDown.current = false, 0)
    }
    function mouseDown(e: any) {
        modalMouseDown.current = true
        $(window).unbind('mouseup', mouseUp);
        $(window).bind('mouseup', mouseUp);
    }
    function getClassName() {
        let className = 'aio-popup';
        className += mainContext.rtl ? ' rtl' : ' ltr'
        if (firstMount) { className += ' not-mounted' }
        if (attrs.className) { className += ' ' + attrs.className }
        return className
    }
    const getContext = (): AP_POPUPCTX => ({ modal, isLast, state, setState, onKeyDown })
    return (
        <POPUPCTX.Provider value={getContext()}>
            <ModalBackdrop
                key={modal.id}
                firstMount={!!firstMount} backdropDom={temp.backdropDom} isModalMouseDown={isModalMouseDown}
            >
                <div key={modal.id} {...getModalProps()}><ModalHeader /><ModalBody key={modal.id}/><ModalFooter /></div>
            </ModalBackdrop>
        </POPUPCTX.Provider>
    )
}
const ModalBackdrop: FC<{ children: ReactNode, firstMount: boolean, backdropDom: any, isModalMouseDown: () => boolean }> = ({ children, firstMount, backdropDom, isModalMouseDown }) => {
    const {removeModal,rtl}:AP_CTX = useContext(CTX)
    let { modal, onKeyDown }: AP_POPUPCTX = useContext(POPUPCTX);
    let { setAttrs = () => { return {} }, id, position = 'fullscreen' } = modal;
    const [attrs] = useState<any>(setAttrs('backdrop') || {})
    function backClick(e: Event) {
        if (isModalMouseDown()) { return }
        if (e.target !== e.currentTarget) { return }
        let target = $(e.target as any);
        if (!target.hasClass('aio-popup-backdrop')) { return }
        removeModal()
    }
    function getProps() {
        let className = 'aio-popup-backdrop';
        className += ` aio-popup-position-${position}`
        className += rtl ? ' rtl' : ' ltr'
        if (firstMount) { className += ' not-mounted' }
        return AddToAttrs(attrs, { className, attrs: { ref: backdropDom, onKeyDown, tabIndex: 0, ['data-id']: id, onClick: attrs.onClick ? attrs.onClick : backClick } })
    }
    return <div {...getProps()}>{children}</div>
}
const ModalHeader: FC = () => {
    const {removeModal}:AP_CTX = useContext(CTX)
    let { modal, state, setState }: AP_POPUPCTX = useContext(POPUPCTX);
    if (!modal.header) { return null }
    let { setAttrs = () => { return {} } } = modal;
    let attrs = setAttrs('header') || {};
    if (typeof modal.header === 'function') { return modal.header({ removeModal: removeModal, state, setState }) as any }
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
    let { modal }: AP_POPUPCTX = useContext(POPUPCTX), { header } = modal;
    if (typeof header === 'function' || !header) { return null }
    if (!header[type]) { return null }
    return <div className={`aio-popup-header-${type}`} data-subtitle={type === 'title' ? header.subtitle : undefined}>{header[type]}</div>
}
const ModalClose: FC = () => {
    const {removeModal}:AP_CTX = useContext(CTX)
    let { modal, state, setState }: AP_POPUPCTX = useContext(POPUPCTX), { header } = modal;
    if (typeof header === 'function' || !header) { return null }
    if (header.onClose === false) { return null }
    return <div className={`aio-popup-header-close`} onClick={(e) => {
        e.stopPropagation(); e.preventDefault();
        if (typeof header.onClose === 'function') { header.onClose({ state, setState }) }
        else { removeModal(modal.id) }
    }}><CloseIcon /></div>
}
const ModalBody: FC = () => {
    const { modal }: AP_POPUPCTX = useContext(POPUPCTX);
    let { body, setAttrs = () => { return {} } } = modal;
    let attrs = setAttrs('body') || {}
    if (!body || body === null) { return null }
    return (<div {...AddToAttrs(attrs, { className: 'aio-popup-body aio-popup-scroll' })}>{body}</div>)
}
const ModalFooter: FC = () => {
    const { modal}: AP_POPUPCTX = useContext(POPUPCTX);
    let { setAttrs = () => { return {} }, footer } = modal;
    if (!footer) { return null }
    let Attrs = setAttrs('footer') || {};
    const attrs = AddToAttrs(Attrs, { className: 'aio-popup-footer' })
    return <div {...attrs}>{footer}</div>
}
export type AP_SnackebarItem = { item: AP_snackebar, index: number }
type AP_getSvg = (type: AP_snackebar["type"]) => ReactNode
const SBCTX = createContext({} as any);
type AP_SBCTX = { mainContext: AP_CTX, item: AP_snackebar, index: number, mounted: boolean, remove: () => void, getSvg: AP_getSvg }
const SnackebarItem: FC<AP_SnackebarItem> = (props) => {
    const mainContext: AP_CTX = useContext(CTX)
    let { item } = props;
    let { time = 8, id, align = ['right', 'top'] } = item;
    if (align[1] !== 'top' && align[1] !== 'bottom') { align[1] = 'top'; }
    if (align[0] !== 'left' && align[0] !== 'right' && align[0] !== 'center') { align[0] = 'right'; }
    let [mounted, setMounted] = useState<boolean>(false)
    useEffect(() => {
        setTimeout(() => setMounted(true), 0)
        setTimeout(() => remove(), time * 1000)
    }, [])
    function remove() {
        setMounted(false)
        setTimeout(() => mainContext.removeSnackebar(id as string), 200)
    }
    const getSvg: AP_getSvg = (type) => { return type === 'error' || type === 'warning' || type === 'info' ? <InfoSvg /> : <SuccessSvg /> }
    const getContext = (): AP_SBCTX => {
        return { mainContext, remove, item: { ...props.item, time, align }, index: props.index, mounted, getSvg }
    }
    return (<SBCTX.Provider value={getContext()}><SnackebarContainer /></SBCTX.Provider>)
}
const SnackebarContainer: FC = () => {
    const { mainContext, mounted, index, item, remove }: AP_SBCTX = useContext(SBCTX);
    const { rtl } = mainContext;
    let { onClose, align = ['right', 'top'] } = item;
    function getOffsetStyle(index: number) {
        let els = $('.aio-popup-snackebar-item-container'), sum = { top: 12, bottom: 12 };
        for (let i = 0; i < index; i++) {
            let dom = els.eq(i) as any;
            let height = dom.height() + 6;
            let va: 'top' | 'bottom' = dom.attr('data-vertical-align');
            sum[va] += height;
        }
        return {
            [align[1] === 'top' ? 'top' : 'bottom']: sum[align[1]]
        }
    }
    let className = 'aio-popup-snackebar-item-container';
    className += ` aio-popup-snackebar-item-container-horizontal-align-${align[0]}`
    if (mounted) { className += ' mounted'; }
    if (rtl) { className += ' rtl'; }
    let style = getOffsetStyle(index);
    let p = { 'data-vertical-align': align[1], className, style, onClick: onClose === false ? undefined : () => remove() }
    return <div {...p}><SnackebarCard /></div>
}
const SnackebarCard: FC = () => {
    const { item }: AP_SBCTX = useContext(SBCTX);
    let { type, attrs = {} } = item;
    let className = 'aio-popup-snackebar-item';
    className += ` aio-popup-snackebar-item-${type}`
    if (attrs.className) { className += ` ${attrs.className}` }
    let p = { ...attrs, className, style: attrs.style }
    return (<div {...p}><SnackebarIcon /><SnackebarText /><SnackebarAction /><SnackebarBar /></div>)
}
const SnackebarIcon: FC = () => {
    const { getSvg, item }: AP_SBCTX = useContext(SBCTX)
    return <div className={`aio-popup-snackebar-item-icon`}>{!!item.icon ? item.icon : getSvg(item.type)}</div>
}
const SnackebarText: FC = () => {
    const { item }: AP_SBCTX = useContext(SBCTX)
    return (
        <div className='aio-popup-snackebar-item-text'>
            <div className='aio-popup-snackebar-item-uptext'>{item.text}</div>
            {!!item.subtext && <div className='aio-popup-snackebar-item-subtext'>{item.subtext}</div>}
        </div>
    )
}
const SnackebarAction: FC = () => {
    const { item, remove }: AP_SBCTX = useContext(SBCTX)
    const { action } = item;
    if (!action || !action.text) { return null }
    let p = {
        className: 'aio-popup-snackebar-item-action',
        onClick: (e: any) => { e.stopPropagation(); if (action) { action.onClick() } remove() }
    }
    return (<button {...p}>{action.text}</button>)
}
const SnackebarBar: FC = () => {
    const { item }: AP_SBCTX = useContext(SBCTX)
    return <div className='aio-popup-snackebar-bar' style={{ transition: `${item.time || 8}s linear` }}></div>
}
export function Alert(props: AP_alert) {
    let { icon, type = '', title = '', text = '', time = 10, className, closeText = 'Close', onClose,rtl } = props;
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
      <div class='aio-popup-alert-container not-mounted ${$$.id} aio-popup-alert-container-center${!!className ? ` ${className}` : ''}'>
        <div class='aio-popup-alert aio-popup-alert-${type}'>
          <div class='aio-popup-alert-header'>${$$.getIcon()}</div>
          <div class='aio-popup-alert-body aio-popup-scroll'>
            <div class='aio-popup-alert-title'>${ReactDOMServer.renderToStaticMarkup(title as any)}</div>
            <div class='aio-popup-alert-text' style="text-align:${rtl?'right':'left'}">${text}</div>
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
            catch { alert(`aio-highlighter error => connot find dom`) }
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
function getBound(dom: any) {
    try {
        const res = dom.getBoundingClientRect()
        return { width: res.width, height: res.height, left: res.left, top: res.top, bottom: res.bottom, right: res.right }
    }
    catch { return { width: 0, height: 0, left: 0, top: 0, bottom: 0, right: 0 } }
}
export class Loading {
    loader: any = '0';
    constructor(loader?: string) {
        if (typeof loader === 'string') { this.loader = loader }
    }
    private getLoader_0 = () => {
        return (`
            <div class="aio-loading-container-0">
                <div class="aio-loading-0">
                    ${new Array(5).fill(0).map((o, i) => this.getLoaderItem_0(`0.${i}`)).join(' ')}
                </div>
            </div>
        `)
    }
    private getLoaderItem_0 = (ease: string) => {
        return `<div class="aio-loading-item-0" style="animation: 1s ease-in-out ${ease}s infinite normal none running aioloading0;"></div>`
    }
    getLoader = (id: string) => {
        let content = ''
        if (this.loader === '0') { content = this.getLoader_0() }
        else if (typeof this.loader === 'string') { content = this.loader }
        return (`<div class="aio-loading" id="aio-loading-${id}">${content}</div>`)
    }
    show = (id: string, parentSelector?: string) => {
        parentSelector = parentSelector || 'body'
        let loadingStr = this.getLoader(id);
        let parent = document.querySelector(parentSelector);
        if (parent) { parent.insertAdjacentHTML('beforeend', loadingStr); }
    }
    hide = (id: string) => {
        let loadingDom = document.getElementById('aio-loading-' + id);
        if (!loadingDom) { loadingDom = document.querySelector('.aio-loading'); }
        if (loadingDom) { loadingDom.remove(); }
    }
}