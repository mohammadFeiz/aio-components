import React, { createContext, createRef, FC, ReactNode, useContext, useEffect, useRef, useState } from "react";
import * as UT from "../aio-utils";
import AIODate from "../aio-date";
import Prism from 'prismjs';
import { AI_optionProp } from "../aio-input/repo";
import { AIFormInput, AINumber, AISelect, AIText, AITime, AITree, SuggestionInput } from "../aio-input";
import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";
import './repo/index.css';
import usePopup, { I_usePopup } from "../aio-popup";
import { FilterRows } from "../aio-utils/repo";
type AI_Indent = {
    level: number, width: number, height: number, rtl: boolean, isLastChild: boolean, isParentLastChild: boolean, row: any, isLeaf: boolean,
    open?: boolean, onToggle?: () => void, toggleIcon?: false | ((p: { row: any, open?: boolean, level: number }) => ReactNode)
}
export const Indent: FC<AI_Indent> = (props) => {
    const { width, height, level, open, row, rtl, isLastChild, isParentLastChild, isLeaf } = props;
    const [indentPathes, setIndentPathes] = useState<ReactNode>(null)
    useEffect(() => { setIndentPathes(getIndentIcons()) }, [level, isLastChild, isParentLastChild])
    const [toggleIcon, setToggleIcon] = useState<ReactNode>(null)
    useEffect(() => { setToggleIcon(getToggleIcon()) }, [open])
    function getIndentIcon(rowIndex: number) {
        if (!level) { return null }
        let x0 = width / 2, x1 = width, y0 = 0, y1 = height / 2, y2 = height, pathes = [];
        if (rowIndex === level - 1) {
            //horizontal line
            pathes.push(<path key={'hl' + rowIndex} d={`M${x0} ${y1} L${x1 * (rtl ? -1 : 1)} ${y1} Z`}></path>)
            //vertical direct line
            pathes.push(<path key={'vdl' + rowIndex} d={`M${x0} ${y0} L${x0} ${isLastChild ? y1 : y2} Z`}></path>)
        }
        else {
            //vertical connet line
            if (!isParentLastChild) {
                pathes.push(<path key={'vl' + rowIndex} d={`M${x0} ${y0} L${x0} ${y2} Z`}></path>)
            }
        }
        return (<svg className='ai-indent-line' width={width} height={height}>{pathes}</svg>)
    }

    const getToggleSvg = () => {
        if (props.toggleIcon) { return props.toggleIcon({ row, level, open }) }
        let path = open === undefined ? 'mdiCircleSmall' : (open ? 'mdiChevronDown' : (rtl ? 'mdiChevronLeft' : 'mdiChevronRight'));
        return new GetSvg().getIcon(path, 1)
    }
    const getIndentIcons = () => {
        const list = new Array(level).fill(0)
        return list.map((o, i) => <div key={i} className={`ai-indent`} style={{ width }}>{getIndentIcon(i)}</div>)
    }
    const getToggleIcon = () => {
        return (
            <div className="ai-toggle" style={{ width }} onClick={(e) => { e.stopPropagation(); if (props.onToggle) { props.onToggle() } }}>
                <div className={`ai-toggle-icon${isLeaf ? ' ai-leaf-icon' : ''}`}>{toggleSvg}</div>
                {
                    open === true &&
                    <svg className='ai-toggle-line ai-indent-line'>
                        <path d={`M${width / 2} ${0} L${width / 2} ${height / 2 - 12} Z`}></path>
                    </svg>
                }
            </div>
        )
    }
    const toggleSvg = getToggleSvg();
    if (toggleSvg === false) { return null }
    return (
        <div className={`ai-indents ai-indent-${height}`}>{indentPathes}{toggleIcon}</div>
    )
}
export class GetSvg {
    getStyle = (color?: string) => {
        const fill = color || "currentcolor"
        return { fill, stroke: fill }
    }
    getSvgStyle = (size?: number) => {
        size = size || 1;
        return { width: `${size * 1.5}rem`, height: `${size * 1.5}rem` }
    }
    fixSvgContent = (content: ReactNode, size?: number, p?: { spin?: number, color?: string }) => {
        const { spin, color } = p || {}
        let res = null;
        if (spin) {
            res = (
                <>
                    <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
                    <g style={{ animation: `${spin}s linear 0s infinite normal none running spin`, transformOrigin: 'center center' }}></g>
                </>
            )
        }
        else { res = content }
        return (<svg viewBox="0 0 24 24" role="presentation" style={this.getSvgStyle(size)}>{res}</svg>)
    }
    getIcon = (path: string, size?: number, p?: { spin?: number, color?: string }) => {
        const { color } = p || {}
        const content = (this as any)[path](color)
        return this.fixSvgContent(content, size, p)
    }
    mdiMenu = (color?: string) => (<><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" style={this.getStyle(color)} /></>)
    mdiClose = (color?: string) => (<><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" style={this.getStyle(color)}></path></>)
    mdiLoading = (color?: string) => <><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" style={this.getStyle(color)}></path><rect width="24" height="24" fill="transparent"></rect></>
    mdiAttachment = (color?: string) => (<><path d="M7.5,18A5.5,5.5 0 0,1 2,12.5A5.5,5.5 0 0,1 7.5,7H18A4,4 0 0,1 22,11A4,4 0 0,1 18,15H9.5A2.5,2.5 0 0,1 7,12.5A2.5,2.5 0 0,1 9.5,10H17V11.5H9.5A1,1 0 0,0 8.5,12.5A1,1 0 0,0 9.5,13.5H18A2.5,2.5 0 0,0 20.5,11A2.5,2.5 0 0,0 18,8.5H7.5A4,4 0 0,0 3.5,12.5A4,4 0 0,0 7.5,16.5H17V18H7.5Z" style={this.getStyle(color)}></path></>)
    mdiCircleMedium = (color?: string) => (<><path d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" style={this.getStyle(color)}></path></>)
    mdiMagnify = (color?: string) => (<><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" style={this.getStyle(color)}></path></>)
    mdiPlusThick = (color?: string) => (<><path d="M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z" style={this.getStyle(color)}></path></>)
    mdiImage = (color?: string) => (<><path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" style={this.getStyle(color)}></path></>)
    mdiEye = (color?: string) => (<><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" style={this.getStyle(color)}></path></>)
    mdiEyeOff = (color?: string) => (<><path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" style={this.getStyle(color)}></path></>)
    mdiDotsHorizontal = (color?: string) => (<><path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" style={this.getStyle(color)}></path></>)
    mdiChevronDown = (color?: string) => (<><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" style={this.getStyle(color)}></path></>)
    mdiChevronRight = (color?: string) => (<><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" style={this.getStyle(color)}></path></>)
    mdiCircleSmall = (color?: string) => (<><path d="M12,10A2,2 0 0,0 10,12C10,13.11 10.9,14 12,14C13.11,14 14,13.11 14,12A2,2 0 0,0 12,10Z" style={this.getStyle(color)}></path></>)
    mdiChevronLeft = (color?: string) => (<><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" style={this.getStyle(color)}></path></>)
    mdiArrowDown = (color?: string) => (<><path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z" style={this.getStyle(color)}></path></>)
    mdiArrowUp = (color?: string) => (<><path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" style={this.getStyle(color)}></path></>)
    mdiFileExcel = (color?: string) => (<><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.8,20H14L12,16.6L10,20H8.2L11.1,15.5L8.2,11H10L12,14.4L14,11H15.8L12.9,15.5L15.8,20M13,9V3.5L18.5,9H13Z" style={this.getStyle(color)}></path></>)
    mdiSort = (color?: string) => (<><path d="M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z" style={this.getStyle(color)}></path></>)
    mdiDelete = (color?: string) => (<><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" style={this.getStyle(color)}></path></>)
    mdiMicrophoneOutline = (color?: string) => (<><path d="M17.3,11C17.3,14 14.76,16.1 12,16.1C9.24,16.1 6.7,14 6.7,11H5C5,14.41 7.72,17.23 11,17.72V21H13V17.72C16.28,17.23 19,14.41 19,11M10.8,4.9C10.8,4.24 11.34,3.7 12,3.7C12.66,3.7 13.2,4.24 13.2,4.9L13.19,11.1C13.19,11.76 12.66,12.3 12,12.3C11.34,12.3 10.8,11.76 10.8,11.1M12,14A3,3 0 0,0 15,11V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V11A3,3 0 0,0 12,14Z" style={this.getStyle(color)}></path></>)
}
type I_AIPanel = { text: string, subtext?: ReactNode, before?: ReactNode, after?: ReactNode, body: ReactNode }
export const AIPanel: FC<I_AIPanel> = ({ text, subtext, before, after, body }) => {
    function header_layout() {
        return (
            <div className="ai-panel-header">
                <div className="ai-panel-before">{!!before && before}</div>
                <div className="ai-panel-texts">
                    <div className="ai-panel-text">{text}</div>
                    {subtext !== undefined && <div className="ai-panel-subtext">{subtext}</div>}
                </div>
                <div className="ai-panel-after">{!!after && after}</div>
            </div>
        )
    }
    function body_layout() { return (<div className="ai-panel-body">{body}</div>) }
    return (<div className="ai-panel">{header_layout()} {body_layout()}</div>)
}
type I_AICard = { text: ReactNode, subtext?: ReactNode, onClick?: () => void, before?: ReactNode, after?: ReactNode, attrs?: any, className?: string, style?: any }
export const AICard: FC<I_AICard> = ({ text, subtext, onClick = () => { }, before, after, attrs, className, style }) => {
    const Attrs = UT.AddToAttrs(attrs, { className: ["ai-card", className], style })
    return (
        <div {...Attrs}>
            {before !== undefined && <div className="ai-card-before" onClick={(e) => e.stopPropagation()}>{before}</div>}
            <div className="ai-card-body" onClick={onClick}>
                <div className="ai-card-text">{text}</div>
                {subtext !== undefined && <div className="ai-card-subtext">{subtext}</div>}
            </div>
            {after !== undefined && <div className="ai-card-after" onClick={(e) => e.stopPropagation()}>{after}</div>}
        </div>
    )
}
type I_AIApp = {
    appName?: string,
    appId: string,
    attrs?: any,
    rtl?: boolean,
    bottomMenu?: {
        options: any[],
        option: {
            value?: (option: any) => string,
            text?: (option: any) => ReactNode,
            uptext?: (option: any) => ReactNode,
            subtext?: (option: any) => ReactNode,
            before?: (option: any) => ReactNode,
            after?: (option: any) => ReactNode,
            show?: (option: any) => boolean,
            active?: (option: any) => boolean,
            onClick?: (option: any) => void,
            attrs?: (option: any) => any,
            className?: (option: any) => string | undefined,
            style?: (option: any) => any
        }
    }
    sidenav?: {
        items: AI_sidenavItem[],
        header?: (minimize: boolean) => ReactNode,
        value?: string,
        cache?: boolean,
        attrs?: any
    },
    body?: ReactNode,
    header?: (sidenavitem?: AI_sidenavItem) => ReactNode | false,
    children?: ReactNode
}
export const AIApp: FC<I_AIApp> = (props) => {
    const [storage] = useState<UT.Storage>(getStorage)
    function getStorage(): UT.Storage { return new UT.Storage('aiapp' + props.appId) }
    const sidenav = useSidenav({ sidenav: props.sidenav, appId: props.appId, storage })
    function header_layout() {
        if (!props.header) { return null }
        const header = props.header(sidenav.active)
        if (header === false) { return null }
        return header
    }
    function getcontent() {
        if (sidenav.active) {
            if (sidenav.active.render) { return sidenav.active.render() }
        }
        return props.body || null
    }
    function body_layout() {
        const content = getcontent()
        return (
            <div className='ai-app-content'>
                {
                    !!props.sidenav &&
                    <div className="ai-app-side">
                        <Sidenav
                            rtl={props.rtl}
                            attrs={props.sidenav.attrs}
                            items={props.sidenav.items}
                            header={props.sidenav.header}
                            value={sidenav.active?.value}
                            onChange={(v) => sidenav.changeActive(v)}
                        />
                    </div>
                }
                <div className="ai-app-center">
                    {header_layout()}
                    <div className="ai-app-body">
                        {content}
                    </div>
                </div>

            </div>
        )
    }
    function bottomMenu_layout() {
        if (!props.bottomMenu) { return null }
        return (<AIBottomMenu bottomMenu={props.bottomMenu} />)
    }
    const attrs = UT.AddToAttrs(props.attrs, { className: 'ai-app' })
    return (
        <div {...attrs}>
            {body_layout()}
            {bottomMenu_layout()}
            {!!props.children && props.children}
        </div>
    )
}
const useSidenav = (props: { sidenav?: I_AIApp["sidenav"], appId: string, storage: UT.Storage }) => {
    const snRes = useRef<any>()
    const [active, setActive] = useState<AI_sidenavItem | undefined>(getSidenavItem)
    function changeActive(active: AI_sidenavItem) {
        if (props.sidenav?.cache) { props.storage.save('navitemvalue', active.value) }
        setActive(active)
    }
    function getSidenavItem(): AI_sidenavItem | undefined {
        if (!props.sidenav) { return }
        const value = props.sidenav.cache ? props.storage.load('navitemvalue', props.sidenav.value) : props.sidenav.value
        const res = getByValue(value)
        return res
    }
    function getByValue(value: string): AI_sidenavItem | undefined {
        if (!props.sidenav || !value) { return }
        snRes.current = undefined;
        getByValue_req(props.sidenav.items, value);
        return snRes.current;
    }
    function getByValue_req(items: AI_sidenavItem[], value: string) {
        if (snRes.current) { return; }
        for (let i = 0; i < items.length; i++) {
            if (snRes.current) { return; }
            let item: AI_sidenavItem = items[i];
            let { show = true } = item;
            if (!show) { continue }
            if (item.value === value) { snRes.current = item; break; }
            let navItems = item.items
            if (navItems) { getByValue_req(navItems, value); }
        }
    }
    return { active, changeActive }
}
type AI_BottomMenu = { bottomMenu: NonNullable<I_AIApp["bottomMenu"]> }
const AIBottomMenu: FC<AI_BottomMenu> = ({ bottomMenu }) => {
    const { options, option } = bottomMenu
    function getProps(item: any, props: string[]): any {
        const res: { [key: string]: any } = {}
        for (let prop of props) {
            res[prop] = (option as any)[prop] ? (option as any)[prop](item) : undefined
        }
        return res
    }
    function item_layout(item: any) {
        if (getProps(item, ['show']).show === false) { return null }
        const { value, text, uptext, subtext, active, before, after, attrs, className, style } = getProps(item, ['value', 'text', 'uptext', 'subtext', 'active', 'before', 'after', 'show', 'attrs', 'className', 'style'])
        const Attrs = UT.AddToAttrs(attrs, {
            className: ['ai-app-bottom-menu-option', active ? 'active' : undefined, className],
            style, attrs: { onClick: () => { if (option.onClick) { option.onClick(item) } } }
        })
        return (
            <div key={value} {...Attrs}>
                {!!before && before}
                <div className="ai-app-bottom-menu-option-body">
                    {text !== undefined && text}
                    {
                        text === undefined &&
                        <>
                            <div className="ai-app-bottom-menu-uptext">{uptext}</div>
                            <div className="ai-app-bottom-menu-subtext">{subtext}</div>
                        </>
                    }
                </div>
                {!!after && after}
            </div>
        )
    }
    return (
        <div className="ai-app-bottom-menu">
            {options.map((o, i) => item_layout(o))}
        </div>
    )
}
export type AI_Sidenav = {
    items: AI_sidenavItem[],
    onChange: (item: AI_sidenavItem) => void,
    className?: string,
    style?: any,
    attrs?: any,
    rtl?: boolean,
    indent?: number,
    header?: (minimize: boolean) => ReactNode,
    value?: string,
    minimize?: boolean

}
export type AI_sidenavItem = {
    text: ReactNode,
    subtext?: ReactNode,
    value: string,
    icon?: ReactNode,
    items?: AI_sidenavItem[],
    onClick?: () => void,
    after?: ReactNode,
    show?: boolean,
    render?: () => ReactNode
}
export const Sidenav: FC<AI_Sidenav> = (props) => {
    let { items = [], onChange, rtl = false, indent = 0, header, value } = props;
    const [minimize, setMinimize] = useState(!!props.minimize)
    const [icons] = useState<GetSvg>(new GetSvg())
    const toggleRef = useRef((id: any) => { })
    function getAfter(option: AI_sidenavItem, active: boolean) {
        let { items = [], after } = option;
        return (
            <div className={`ai-sidenav-item-after`}>
                {!!after && after}
                {
                    !!items.length &&
                    <div className="ai-sidenav-toggle">
                        {icons.getIcon(active ? 'mdiChevronDown' : (rtl ? 'mdiChevronRight' : 'mdiChevronLeft'), 0.7)}
                    </div>
                }
            </div>
        )
    }
    function getBefore(option: any, level: number) {
        let { before } = option;
        if (level > 0 && !before) { before = icons.getIcon('mdiCircleMedium', 0.6) }
        if (!before) { return null }
        return (
            <div className={`ai-sidenav-item-before`}>
                {before}
            </div>
        )
    }
    const defaultOption: AI_optionProp = {
        text: 'option.text',
        value: 'option.value',
        after: (option, { active }) => getAfter(option, !!active),
        before: (option, { level }) => getBefore(option, level || 0),
        onClick: (option) => {
            let { items = [], value } = option;
            if (!!items.length) { toggleRef.current(value) }
            else if (onChange) { onChange(option) }
        },
        show: (option) => {
            const { show = true } = option;
            return show
        }
    }
    let finalOptions: AI_optionProp = {
        ...defaultOption,
        className: (option, { level }) => `ai-sidenav-${level === 0 ? 'item' : 'sub-item'}${value !== undefined && option.value === value ? ' active' : ''}`
    }
    const attrs = UT.AddToAttrs(props.attrs, { className: ['ai-sidenav', props.className, !!minimize ? 'ai-sidenav-minimize' : undefined] })
    return (
        <div {...attrs}>
            {
                !!header &&
                <div className="ai-sidenav-header">{header(minimize)}</div>
            }
            {
                !!props.minimize &&
                <div className="ai-sidenav-minimize-button" onClick={() => setMinimize(!minimize)}>
                    <div className="ai-sidenav-minimize-icon">{icons.getIcon('mdiMenu', 1)}</div>
                </div>
            }
            <div className="ai-sidenav-body">
                <AITree
                    {...attrs}
                    toggleIcon={() => false}
                    className={'ai-sidenav-tree'}
                    size={48}
                    toggleRef={toggleRef}
                    value={[...items]}
                    getChilds={(p: { row: AI_sidenavItem }) => p.row.items || []}
                    option={finalOptions}
                    indent={0}
                />
            </div>
        </div>
    )
}

export type I_MonthCells = {
    year: number, month: number, cellContent: (date: number[], weekDayIndex: number) => ReactNode, weekDayContent?: (v: number) => ReactNode,
    changeMonth: (month: number) => void
}
export const MonthCells: FC<I_MonthCells> = ({ year, month, cellContent, weekDayContent }) => {
    const [DATE] = useState<AIODate>(new AIODate())
    function getDateInfo() {
        const res = {
            monthDaysLength: DATE.getMonthDaysLength([year, month]),
            firstDayIndex: DATE.getWeekDay([year, month, 1]).index,
            monthString: DATE.getMonths(true)[month - 1]
        }
        console.log(res, year, month)
        return res
    }
    const gtc = Math.floor(100 / 7);
    const gridTemplateColumns: string = `${gtc}% ${gtc}% ${gtc}% ${gtc}% ${gtc}% ${gtc}% ${gtc}%`;
    function weekDays_layout() {
        if (!weekDayContent) { return null }
        return (
            <div className="ai-month-grid" style={{ gridTemplateColumns }}>
                {DATE.getWeekDays(true).map((o: string, i: number) => <div key={o} className={`ai-month-weekday`}>{weekDayContent(i)}</div>)}
            </div>
        )
    }
    function spaces_layout() { return new Array(dateInfo.firstDayIndex).fill(0).map((o, i) => <div key={i} className=""></div>) }
    function cells_layout() { return UT.GetArray(dateInfo.monthDaysLength).map((day: number) => cell_layout(day + 1)) }
    function cell_layout(day: number) {
        const date = [year, month, day];
        const weekDayIndex: number = DATE.getWeekDay(date).index;
        return (<div key={day} className="ai-month-cell">{cellContent(date, weekDayIndex)}</div>)
    }
    const dateInfo = getDateInfo()
    return (
        <div className="ai-month">
            <div className="ai-month-body">
                {weekDays_layout()}
                <div className="ai-month-grid" style={{ gridTemplateColumns }}>{spaces_layout()} {cells_layout()}</div>
            </div>
        </div>
    )
}

const PrismCode: FC<{ code: string, language?: 'js' | 'css', style?: any }> = ({ code, language = 'js', style = {} }) => {
    useEffect(() => { Prism.highlightAll() }, [])
    return (
        <div className="aio-doc-code" style={style}>
            <pre style={{ height: '100%', overflow: 'auto' }}>
                <code className={`language-${language}`}>{code}</code>
            </pre>
        </div>
    );
}
export function Code(code: string, language?: 'js' | 'css', style?: any) {
    return <PrismCode code={code} language={language} style={style} />
}


export type I_node = {
    v?: I_node[], h?: I_node[], html?: ReactNode, content?: any, attrs?: any, className?: string, style?: any, show?: boolean,
    flex?: number, size?: number, scroll?: boolean, tag?: 'fieldset' | 'section' | 'div' | 'p' | 'form', legend?: ReactNode, id?: string, isStatic?: boolean,
    align?: 'v' | 'h' | 'vh' | 'hv', hide_xs?: boolean, hide_sm?: boolean, hide_md?: boolean, hide_lg?: boolean, show_xs?: boolean, show_sm?: boolean, show_md?: boolean, show_lg?: boolean
}

export const NodeAttrs = (p: { node: I_node, parentNode?: I_node, isRoot?: boolean }) => {
    const baseClassName = 'rvd'
    const NodeStyle = () => {
        const res: any = { flex: p.node.flex };
        if (p.parentNode && (p.parentNode.h || p.parentNode.v)) {
            res[p.parentNode.v ? 'height' : 'width'] = p.node.size
        }
        return { ...res, ...p.node.style }
    }
    function VisibilityClassNames(): string[] {
        let hide_xs, hide_sm, hide_md, hide_lg, classNames = [];
        if (p.node.show_xs) { hide_xs = false; hide_sm = true; hide_md = true; hide_lg = true; }
        if (p.node.hide_xs) { hide_xs = true; }
        if (p.node.show_sm) { hide_xs = true; hide_sm = false; hide_md = true; hide_lg = true; }
        if (p.node.hide_sm) { hide_sm = true; }
        if (p.node.show_md) { hide_xs = true; hide_sm = true; hide_md = false; hide_lg = true; }
        if (p.node.hide_md) { hide_md = true; }
        if (p.node.show_lg) { hide_xs = true; hide_sm = true; hide_md = true; hide_lg = false; }
        if (p.node.hide_lg) { hide_lg = true; }
        if (hide_xs) { classNames.push(`${baseClassName}-hide-xs`) }
        if (hide_sm) { classNames.push(`${baseClassName}-hide-sm`) }
        if (hide_md) { classNames.push(`${baseClassName}-hide-md`) }
        if (hide_lg) { classNames.push(`${baseClassName}-hide-lg`) }
        return classNames;
    }
    const NodeClassNames = (): (string | undefined)[] => {
        let nodeClassName, scrollClassName, alignClassName, rootClassName = p.isRoot ? baseClassName : undefined, visibilityClassNames = VisibilityClassNames();
        if (p.node.v) {
            nodeClassName = `${baseClassName}-v`
            scrollClassName = `${baseClassName}-scroll-v`
            if (p.node.align === 'v') { alignClassName = `${baseClassName}-justify-center` }
            else if (p.node.align === 'h') { alignClassName = `${baseClassName}-items-center` }
            else if (p.node.align === 'vh') { alignClassName = `${baseClassName}-justify-center ai-form-items-center` }
            else if (p.node.align === 'hv') { alignClassName = `${baseClassName}-justify-center ai-form-items-center` }
        }
        else if (p.node.h) {
            nodeClassName = `${baseClassName}-h`
            scrollClassName = `${baseClassName}-scroll-h`
            if (p.node.align === 'v') { alignClassName = `${baseClassName}-items-center` }
            else if (p.node.align === 'h') { alignClassName = `${baseClassName}-justify-center` }
            else if (p.node.align === 'vh') { alignClassName = `${baseClassName}-justify-center ai-form-items-center` }
            else if (p.node.align === 'hv') { alignClassName = `${baseClassName}-justify-center ai-form-items-center` }
        }
        else if (p.node.html) {
            nodeClassName = `${baseClassName}-html`
            if (p.node.align === 'v') { alignClassName = `${baseClassName}-items-center` }
            else if (p.node.align === 'h') { alignClassName = `${baseClassName}-justify-center` }
            else if (p.node.align === 'vh') { alignClassName = `${baseClassName}-justify-center ai-form-items-center` }
            else if (p.node.align === 'hv') { alignClassName = `${baseClassName}-justify-center ai-form-items-center` }
        }
        return [nodeClassName, rootClassName, p.node.className, scrollClassName, alignClassName, ...visibilityClassNames]
    }
    return UT.AddToAttrs(p.node.attrs, { className: NodeClassNames(), style: NodeStyle() })
}
export const Node: FC<{
    node: I_node, parentNode?: I_node, level: number, index: number, updateNode?: (p: { node: I_node, level: number, parentNode?: I_node }) => I_node
}> = ({ node, level, index, parentNode, updateNode }) => {
    const [dom, setDom] = useState<ReactNode>(null)
    let { show = true, isStatic } = updateNode ? updateNode({ node, level, parentNode }) : node;
    const getContent = (): ReactNode => {
        if (!show) { return null }
        if (Array.isArray(node.h) || Array.isArray(node.v)) {
            return <NodeGroup node={node} level={level} index={index} parentNode={parentNode} />
        }
        if (node.html !== undefined) {
            const attrs = NodeAttrs({ node, isRoot: level === 0, parentNode })
            return (<div {...attrs}>{node.html}</div>)
        }
        return node.content
    }
    useEffect(() => {
        if (isStatic) { setDom(getContent()) }
    }, [isStatic])
    return isStatic ? <>{dom}</> : <>{getContent()}</>
}
const NodeGroup: FC<{
    node: I_node, parentNode?: I_node, level: number, index: number
}> = ({ node, level, parentNode }) => {
    let { tag = 'div', legend } = node;
    const content = (<>
        {!!legend && tag === 'fieldset' && <legend>{legend}</legend>}
        {
            (node as any)[node.v ? 'v' : 'h'].map((o: I_node, i: number) => {
                return (
                    <Node
                        node={o} parentNode={node}
                        key={`level-${level + 1}-index-${i}`}
                        level={level + 1} index={i}
                    />
                )
            })
        }
    </>)
    const attrs = NodeAttrs({ node, isRoot: level === 0, parentNode })
    if (level === 0) { return (<form {...attrs}>{content}</form>) }
    if (tag === 'section') { return (<section {...attrs}>{content}</section>) }
    if (tag === 'fieldset') { return (<fieldset {...attrs}>{content}</fieldset>) }
    if (tag === 'p') { return (<p {...attrs}>{content}</p>) }
    if (tag === 'form') { return (<p {...attrs}>{content}</p>) }
    return (<div {...attrs}>{content}</div>)
}
type I_Flip = { value: string | number, double?: boolean, fontSize?: number }

export class Flip extends React.Component<I_Flip> {
    ref: React.RefObject<any>;
    inst: any;
    constructor(props: I_Flip) {
        super(props);
        this.ref = React.createRef();
    }
    getValue() {
        let value = this.props.value
        if (this.props.double) {
            let str = '';
            try { str = value.toString() } catch { }
            if (str.length === 0) { str = '00' }
            else if (str.length === 1) { str = '0' + str }
            value = str
        }
        return value
    }
    componentDidMount() {
        this.inst = Tick.DOM.create(this.ref.current, {
            value: this.getValue()
        });
    }

    componentDidUpdate() {
        if (this.inst) {
            this.inst.value = this.getValue();
        }

    }

    componentWillUnmount() {
        if (!this.inst) return;
        Tick.DOM.destroy(this.ref.current);
    }

    render() {
        let { fontSize = 24 } = this.props;
        return (
            <div ref={this.ref} className="tick" style={{ fontSize }}>
                <div data-repeat="true" aria-hidden="true">
                    <span data-view="flip">Tick</span>
                </div>
            </div>
        );
    }
}
type I_filter_operator = 'less' | 'more' | 'equal' | 'notEqual' | 'contain' | 'notContain'
type I_filterTrans = (key: I_filter_operator) => string
export type I_filter_saved_item = { name: string, items: I_filter_item[] }

export type I_filter = {
    items: I_filter_item[],
    onChange: (newFilters: I_filter_item[]) => undefined | void | I_filter_item[] | true | false,
    savedItems?: { name: string, items: I_filter_item[] }[],
    changeSavedItems?: (newSavedItems: { name: string, items: I_filter_item[] }[]) => void,
    activeSavedItem?: (v: { name: string, items: I_filter_item[] }) => void,
}
export type I_filter_item = {
    columnId: string,
    operator: I_filter_operator,
    value: any,
    type: 'text' | 'number' | 'month' | 'day' | 'hour' | 'minute'
}
type I_filterType = 'text' | 'number' | 'month' | 'day' | 'hour' | 'minute'
type I_Filterbar<T> = {
    fa?: boolean,
    columns: T[],
    columnOption: {
        text: (column: T) => string,
        id: (column: T) => string,
        type: (column: T) => I_filterType
    },
    filter: I_filter
}
type I_filterColumn = { text: string, id: string, type: I_filterType }
type I_filterContext = {
    addFilter: () => void,
    changeFilter: (index: number, newFilter: I_filter_item) => void,
    removeFilter: (filter: I_filter_item) => void,
    filter: I_filter,
    trans: I_filterTrans,
    getColumnById: (columnId: string) => I_filterColumn,
    columns: I_filterColumn[],
    fa?: boolean,
    popup: I_usePopup,
    openSavedItemsModal: () => void,
    openSaveModal: () => void,
    openRemoveModal: (saveItem: I_filter_saved_item) => void,
    openActiveModal: (saveItem: I_filter_saved_item) => void,
    saveItem: (name: string, isExist: boolean) => void
}

export const Filterbar = <T,>(props: I_Filterbar<T>) => {
    const propsRef = useRef<I_Filterbar<T>>(props)
    propsRef.current = props;
    const popup = usePopup()
    const [columns, setColumns] = useState<I_filterColumn[]>(getColumns)
    useEffect(() => {
        setColumns(getColumns())
    }, [props.columns])
    function getColumns() {
        return props.columns.map((col, i) => {
            const text = props.columnOption.text(col);
            const id = props.columnOption.id(col);
            const type = props.columnOption.type(col);
            return { text, id, type }
        })
    }
    if (!columns.length) { return null }
    const trans: I_filterTrans = (key) => {
        const { fa } = propsRef.current;
        const dic: { [key in I_filter_operator]: string } = {
            'less': fa ? 'کوچک تر از' : 'less than',
            'more': fa ? 'بزرگتر از' : 'more than',
            'equal': fa ? 'برابر' : 'equal',
            'notEqual': fa ? 'مخالف' : 'not equal',
            'contain': fa ? 'شامل باشد' : 'contain',
            'notContain': fa ? 'شامل نباشد' : 'not contain'
        }
        return dic[key]
    }
    const addFilter = () => {
        const { filter } = propsRef.current;
        if (!filter.onChange) { return }
        const newFilters: I_filter_item[] = [{ value: '', operator: 'contain', columnId: columns[0].id, type: columns[0].type }, ...filter.items]
        filter.onChange(newFilters)
    }
    const changeFilter = (index: number, newFilter: I_filter_item) => {
        const { filter } = propsRef.current;
        if (!filter.onChange) { return }
        const newFilters = filter.items.map((o, i) => i === index ? newFilter : o)
        filter.onChange(newFilters)
    }
    const removeFilter = (filterRow: I_filter_item) => {
        const { filter } = propsRef.current;
        if (!filter.onChange) { return }
        filter.onChange(filter.items.filter((o) => o.columnId !== filterRow.columnId))
    }
    const openSavedItemsModal = () => {
        popup.addModal({
            position: 'center', body: <SavedModal />, id: 'savedItems',
            header: { title: props.fa ? 'فیلتر های ذخیره شده' : 'saved filters' },
            setAttrs: (key) => { if (key === 'backdrop') { return { className: 'aio-filter-modal aio-filter-modal-size' } } }
        })
    }
    const openSaveModal = () => {
        popup.addModal({
            header: { title: props.fa ? 'ذخیره فیلتر' : 'Save Filter' }, position: 'center', body: <SaveModal />,
            setAttrs: (key) => { if (key === 'backdrop') { return { className: 'aio-filter-modal' } } }
        })
    }
    const openRemoveModal = (saveItem: I_filter_saved_item) => {
        popup.addConfirm({
            title: props.fa ? 'حذف فیلتر ذخیره شده' : 'remove saved filter',
            text: props.fa ? 'از حذف این آیتم اطمینان دارید؟' : 'are you sure to remove this item?',
            submitText: props.fa ? 'حذف' : 'Remove',
            canselText: props.fa ? 'لغو' : 'Cansel',
            setAttrs: (key) => { if (key === 'backdrop') { return { className: 'aio-filter-modal' } } },
            submitAttrs: { className: 'aio-filter-button aio-filter-active-button' },
            canselAttrs: { className: 'aio-filter-button' },
            onSubmit: async () => {
                const { savedItems = [], changeSavedItems } = propsRef.current.filter
                if (changeSavedItems) { changeSavedItems(savedItems.filter((o) => o.name !== saveItem.name)); }
                return true
            }
        })
    }
    const openActiveModal = (saveItem: I_filter_saved_item) => {
        popup.addConfirm({
            title: props.fa ? 'اعمال فیلتر ذخیره شده' : 'activate saved filter',
            text: props.fa ? 'از فعالسازی این آیتم اطمینان دارید؟' : 'are you sure to activate this item?',
            submitText: props.fa ? 'حذف' : 'activate',
            canselText: props.fa ? 'لغو' : 'Cansel',
            setAttrs: (key) => { if (key === 'backdrop') { return { className: 'aio-filter-modal' } } },
            submitAttrs: { className: 'aio-filter-button aio-filter-active-button' },
            canselAttrs: { className: 'aio-filter-button' },
            onSubmit: async () => {
                const { activeSavedItem } = propsRef.current.filter
                if (activeSavedItem) { activeSavedItem(saveItem); }
                popup.removeModal('savedItems')
                return true
            }
        })
    }
    const saveItem = (name: string, isExist: boolean) => {
        popup.removeModal();
        const { changeSavedItems, savedItems = [], items = [] } = propsRef.current.filter;
        if (!changeSavedItems) { return }
        let newSavedItems: I_filter_saved_item[] = []
        if (isExist) { newSavedItems = savedItems.map((o) => o.name === name ? { name, items } : o) }
        else { newSavedItems = [...savedItems, { name, items }] }
        changeSavedItems(newSavedItems)
    }
    const getColumnById = (columnId: string) => columns.find((o) => o.id === columnId) as I_filterColumn
    const openModal = () => {
        popup.addModal({
            header: { title: 'Filters', after: <FilterToolbar /> },
            position: 'center', body: <FilterModal />,
            setAttrs: (key) => { if (key === 'backdrop') { return { className: 'aio-filter-modal aio-filter-modal-size' } } }
        })
    }
    return (
        <FilterContextProvider value={{
            addFilter, changeFilter, removeFilter, filter: props.filter, trans, getColumnById, columns, fa: props.fa,
            popup, openSavedItemsModal, openSaveModal, openRemoveModal, openActiveModal, saveItem
        }}>
            <div className="aio-filter">
                <button className="aio-filter-icon-button" onClick={openModal}>{new UT.GetSvg().getIcon('mdiFilter', 0.7)}</button>
                <FilterTags rows={props.filter.items} remove={(row) => removeFilter(row)} />
            </div>
            {popup.render()}
        </FilterContextProvider>
    )
}
const FilterTags: FC<{ rows: I_filter_item[], remove?: (row: I_filter_item) => void }> = ({ rows, remove }) => {
    return (
        <div className="aio-filter-tags">
            {rows.map((row, i) => <FilterTag key={i} filterRow={row} remove={remove ? () => remove(row) : undefined} />)}
        </div>
    )
}
const FilterTag: FC<{ filterRow: I_filter_item, remove?: () => void }> = ({ filterRow, remove }) => {
    const { getColumnById, trans } = useFilterContext()
    const column = getColumnById(filterRow.columnId)
    return (
        <div className="aio-filter-tag" onClick={remove}>
            <div className="aio-filter-tag-column">{column.text}</div>
            <div className="aio-filter-tag-operator">{trans(filterRow.operator)}</div>
            <div className="aio-filter-tag-value">{filterRow.value}</div>
            {!!remove && new UT.GetSvg().getIcon('mdiClose', 0.6)}
        </div>
    )
}
const FilterToolbar: FC = () => {
    const { openSaveModal, fa, filter, openSavedItemsModal } = useFilterContext()
    const { savedItems = [] } = filter
    return (
        <div className="aio-filter-toolbar">
            {
                !!filter.changeSavedItems && !!filter.items.length &&
                <div
                    className="aio-filter-icon-button aio-filter-active-button"
                    title={fa ? 'ذخیره فیلتر' : 'Save Filter'}
                    onClick={openSaveModal}
                ><FilterSaveIcon /></div>
            }
            {
                !!filter.savedItems &&
                <button
                    disabled={!savedItems.length}
                    className="aio-filter-button aio-filter-active-button"
                    title={fa ? 'فیلتر های ذخیره شده' : 'Saved Filters'}
                    onClick={openSavedItemsModal}
                ><FilterSavesIcon />{fa ? 'فیلتر های ذخیره شده' : 'Saved Filters'}<div className="aio-filter-badge">{savedItems.length}</div></button>}
        </div>
    )
}
const SaveModal: FC = () => {
    const [name, setName] = useState<string>('')
    const { fa, filter, popup, saveItem } = useFilterContext()
    const { savedItems = [] } = filter;
    const getOptions = async (text: string) => {
        const items = filter.savedItems || []
        return items.filter((item) => {
            if (!text) { return true }
            return item.name.indexOf(text) !== -1
        }).map((item) => ({ text: item.name, value: item.name }))
    }
    const isExist = (name: string): boolean => !!savedItems.find((o) => o.name === name)
    const getAddName = () => {
        const exist = isExist(name)
        if (exist) { return fa ? 'ویرایش' : 'Edit' }
        else { return fa ? 'افزودن' : 'Add' }
    }
    return (
        <div className="aio-filter-save-modal">
            <AIFormInput
                label={fa ? 'نام فیلتر را برای ذخیره وارد کنید' : 'please inter filter name'}
                input={(<SuggestionInput value={name} onChange={(newName) => setName(newName)} getOptions={getOptions} />)}
            />
            <div className="aio-filter-save-modal-footer">
                <button className="aio-filter-button aio-filter-active-button" disabled={!name || name.length < 3} onClick={() => saveItem(name, isExist(name))}>{getAddName()}</button>
                <button className="aio-filter-button" onClick={() => popup.removeModal()}>{fa ? 'لغو' : 'Cansel'}</button>
            </div>
        </div>
    )
}
const SavedModal: FC = () => {
    const { filter } = useFilterContext()
    const { savedItems = [] } = filter;
    return (
        <div className="aio-filter-saved-modal">
            {savedItems?.map((o, i) => <SavedRow key={i} saveItem={o} />)}
        </div>
    )
}
const SavedRow: FC<{ saveItem: I_filter_saved_item }> = ({ saveItem }) => {
    const { filter, openRemoveModal, openActiveModal } = useFilterContext();
    return (
        <div className="aio-filter-saved-row">
            <div className="aio-filter-saved-row-header">
                <div className="aio-filter-saved-name">{saveItem.name}</div>
                {!!filter.changeSavedItems && <div className="aio-filter-icon-button" onClick={() => openRemoveModal(saveItem)}><FilterRemoveIcon /></div>}
                {!!filter.activeSavedItem && <div className="aio-filter-icon-button" onClick={() => openActiveModal(saveItem)}><FilterActiveIcon /></div>}
            </div>
            <div className="aio-filter-saved-row-body">
                <FilterTags rows={saveItem.items} />
            </div>
        </div>
    )
}

const FilterContext = createContext<I_filterContext>({} as any)
const FilterContextProvider = (props: { children: ReactNode, value: I_filterContext }) => <FilterContext.Provider value={props.value}>{props.children}</FilterContext.Provider>
const useFilterContext = () => useContext(FilterContext)
const FilterModal: FC = () => <div className="aio-filter-items"><FilterHeader /><FilterBody /></div>
const FilterHeader = () => {
    const { addFilter } = useFilterContext()
    return (
        <div className="aio-filter-header">
            <button className="aio-filter-add-button" onClick={addFilter}><FilterAddIcon /> Add Filter</button>
        </div>
    )
}
const FilterBody = () => {
    const { filter } = useFilterContext()
    return (
        <div className="aio-filter-body">
            {filter.items.map((filterItem, i) => <FilterRow key={i} filterItem={filterItem} index={i} />)}
        </div>
    )
}
const FilterRow: FC<{ filterItem: I_filter_item, index: number }> = ({ filterItem, index }) => {
    const { operator, columnId, type, value } = filterItem;
    const { columns, changeFilter, removeFilter, trans, getColumnById } = useFilterContext()
    const [operators, setOperators] = useState<I_filter_operator[]>(getOperators)
    useEffect(() => {
        setOperators(getOperators())
    }, [filterItem.type])
    function getOperators() {
        const res: I_filter_operator[] = []
        const operators: I_filter_operator[] = ['less', 'more', 'equal', 'notEqual', 'contain', 'notContain']
        for (let i = 0; i < operators.length; i++) {
            const o = operators[i];
            if ((o === 'less' || o === 'more') && type === 'text') { continue }
            if ((o === 'contain' || o === 'notContain') && type !== 'text') { continue }
            res.push(operators[i])
        }
        return res
    }
    const isTime = ['month', 'day', 'hour', 'minute'].indexOf(type || '') !== -1;
    return (
        <div className="aio-filter-row">
            <AISelect
                options={columns} value={columnId} option={{ text: (column: I_filterColumn) => column.text, value: (column: I_filterColumn) => column.id }}
                onChange={(columnId) => changeFilter(index, { ...filterItem, columnId, type: getColumnById(columnId).type })}
                popover={{ fitHorizontal: true }}
            />
            <AISelect
                options={operators} value={operator} option={{ text: (operator) => trans(operator), value: (operator) => operator }}
                onChange={(operator) => changeFilter(index, { ...filterItem, operator })}
                popover={{ fitHorizontal: true }}
            />
            {type === 'text' && <AIText value={value} onChange={(value) => changeFilter(index, { ...filterItem, value })} />}
            {type === 'number' && <AINumber value={value} onChange={(value) => changeFilter(index, { ...filterItem, value })} />}
            {isTime && <TimeInput filterItem={filterItem} index={index} />}
            <div className="aio-filter-icon-button" onClick={() => removeFilter(filterItem)}><FilterRemoveIcon /></div>
        </div>
    )
}

const TimeInput: FC<{ filterItem: I_filter_item, index: number }> = ({ filterItem, index }) => {
    const { changeFilter, fa } = useFilterContext()
    const [unit] = useState<any>(getUnit)
    function getUnit() {
        const res: any = { year: true, month: true }
        if (filterItem.type !== 'month') { res.day = true; if (filterItem.type !== 'day') { res.hour = true; if (filterItem.type !== 'hour') { res.minute = true } } }
        return res
    }
    const DATE = new AIODate()
    return (
        <AITime
            jalali={!!fa} unit={unit} value={filterItem.value}
            onChange={(value) => changeFilter(index, { ...filterItem, value: DATE.getTime(value) })}
        />
    )
}
const FilterSaveIcon: FC = () => new UT.GetSvg().getIcon('mdiSaveContent', 0.8)
const FilterSavesIcon: FC = () => new UT.GetSvg().getIcon('mdiListBox', 0.8)
const FilterRemoveIcon: FC = () => new UT.GetSvg().getIcon('mdiClose', 0.8)
const FilterActiveIcon: FC = () => new UT.GetSvg().getIcon('mdiCheckBold', 0.8)
const FilterAddIcon: FC = () => new UT.GetSvg().getIcon('mdiPlusThick', 0.7)
export type I_paging = { serverSide?: boolean, number: number, size: number, length?: number, sizes?: number[] }
export type I_pagingHook<T> = {
    render: () => ReactNode;
    getPagedRows: (rows: T[]) => T[];
    changePaging: (obj: Partial<I_paging>) => void
}

export const usePaging = <T,>(p: { rows: T[], paging?: I_paging, onChange?: (newPaging: I_paging) => void }): I_pagingHook<T> => {
    const timeoutRef = useRef<any>()
    const startRef = useRef<any>()
    const endRef = useRef<any>()
    const pagesRef = useRef<any>()
    const getPaging = (paging?:I_paging) => {
        return paging ? fix(paging) : undefined
    }

    function fix(paging: I_paging): I_paging {
        if (typeof p.onChange !== 'function') {
            alert('aio-table error => in type table you set paging but forget to set onChangePaging function prop to aio input')
            return { number: 0, size: 0 };
        }
        let { number, size = 20, length = 0, sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100], serverSide } = paging
        if (!serverSide) {
            length = p.rows.length
        }
        if (sizes.indexOf(size) === -1) { size = sizes[0] }
        let pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        let start = number - 3, end = number + 3;
        startRef.current = start; endRef.current = end; pagesRef.current = pages;
        return { ...paging, length, number, size, sizes }
    }

    const changePaging = (obj: Partial<I_paging>) => {
        const paging = getPaging(p.paging)
        if (!paging) { return }
        let newPaging: I_paging = fix({ ...paging, ...obj });
        if (p.onChange) {
            if (newPaging.serverSide) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    //be khatere fahme payine typescript majbooram dobare in shart ro bezanam
                    if (p.onChange) { p.onChange(newPaging) }
                }, 800);
            }
            else { p.onChange(newPaging) }
        }
    }
    const getPagedRows = (rows: T[]) => {
        const paging = getPaging(p.paging)
        if (!paging || paging.serverSide) { return rows }
        const { size, number } = paging
        return rows.slice((number - 1) * size, number * size)
    }
    function changeSizeButton(sizes:number[],size:number) {
        if (!sizes.length) { return null }
        return (
            <AISelect
                attrs={{ className: 'aio-paging-button aio-paging-size' }} value={size}
                options={sizes} option={{ text: 'option', value: 'option' }} justify={true}
                onChange={(value) => changePaging({ size: value })} popover={{ fitHorizontal: true }}
            />
        )
    }
    const render = () => {
        const paging = getPaging(p.paging)
        if (!paging) { return null }
        if (!p.rows.length) { return null }
        let { number, size, sizes } = paging;
        let buttons = [];
        let isFirst = true
        for (let i = startRef.current; i <= endRef.current; i++) {
            if (i < 1 || i > pagesRef.current) {
                buttons.push(<button key={i} className={'aio-paging-button aio-paging-button-hidden'}>{i}</button>)
            }
            else {
                let index: number;
                if (isFirst) { index = 1; isFirst = false; }
                else if (i === Math.min(endRef.current, pagesRef.current)) { index = pagesRef.current }
                else { index = i; }
                buttons.push(<button key={index} className={'aio-paging-button' + (index === number ? ' active' : '')} onClick={() => changePaging({ number: index })}>{index}</button>)
            }
        }
        return (
            <div className='aio-paging'>
                {buttons}
                {changeSizeButton(sizes || [],size)}
            </div>
        )
    }
    return { render, getPagedRows, changePaging }
}

export type I_sort<T> = {
    active?: boolean,
    dir?: 'dec' | 'inc',
    title?: ReactNode,
    sortId: string,
    getValue?: (row: T) => any
}
export type I_sortHook<T> = {
    sorts: I_sort<T>[],
    setSorts: (v: I_sort<T>[]) => void,
    renderSortButton: () => ReactNode,
    getSortedRows: (rows: T[]) => T[],
    changeSort: (sortId: string, changeObject: Partial<I_sort<T>>) => void,
    changeSorts: (sorts: I_sort<T>[]) => Promise<void>,
}

export const useSort = <T,>(p: { sorts: I_sort<any>[], rows: any[], onChangeRows?: (rows: any) => void, onChangeSort?: (sorts: I_sort<T>[]) => Promise<boolean | undefined> }): I_sortHook<T> => {
    let [sorts, setSorts] = useState<I_sort<T>[]>(p.sorts)
    const getIconRef = useRef<GetSvg["getIcon"]>(new GetSvg().getIcon);
    const isInitSortExecutedRef = useRef<boolean>(false)
    const getSortedRows = (rows: T[]): T[] => {
        if (isInitSortExecutedRef.current) { return rows }
        if (p.onChangeSort) { return rows }
        let activeSorts = sorts.filter((sort) => sort.active !== false);
        if (!activeSorts.length || !rows.length) { return rows }
        isInitSortExecutedRef.current = true;
        let sortedRows = sortRows(rows, activeSorts);
        if (p.onChangeRows) { p.onChangeRows(sortedRows); }
        return sortedRows;
    }

    const sortRows = (rows: T[], sorts: I_sort<T>[]): T[] => {
        if (!rows) { return [] }
        if (!sorts || !sorts.length) { return rows }
        return rows.sort((a, b) => {
            for (let i = 0; i < sorts.length; i++) {
                let { dir, getValue } = sorts[i];
                if (!getValue) { return 0 }
                let aValue = getValue(a), bValue = getValue(b);
                if (aValue < bValue) { return -1 * (dir === 'dec' ? -1 : 1); }
                if (aValue > bValue) { return 1 * (dir === 'dec' ? -1 : 1); }
                if (i === sorts.length - 1) { return 0; }
            }
            return 0;
        });
    }

    const changeSort = (sortId: string, changeObject: Partial<I_sort<T>>) => {
        let newSorts = sorts.map((sort) => {
            if (sort.sortId === sortId) {
                let newSort = { ...sort, ...changeObject }
                return newSort;
            }
            return sort
        });
        changeSorts(newSorts)
    }
    const changeSorts = async (sorts: I_sort<T>[]): Promise<void> => {
        if (p.onChangeSort) {
            let res = await p.onChangeSort(sorts)
            if (res !== false) { setSorts(sorts); }
        }
        else {
            setSorts(sorts);
            let activeSorts = sorts.filter((sort) => sort.active !== false);
            if (activeSorts.length && !!p.onChangeRows) {
                p.onChangeRows(sortRows(p.rows, activeSorts))
            }
        }
    }
    const renderSortArrow = (option: I_sort<T>) => {
        let { dir = 'dec', sortId } = option;
        return (
            <div onClick={(e) => {
                e.stopPropagation();
                if (!sortId) { return }
                changeSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' })
            }}>
                {getIconRef.current(dir === 'dec' ? 'mdiArrowDown' : 'mdiArrowUp', 0.8)}
            </div>
        )
    }
    const renderSortButton = (limitTo?: string) => {
        if (!sorts.length) { return null }
        return (
            <AISelect
                key='sortbutton' caret={false} options={sorts}
                option={{
                    text: (option) => option.title, checked: (option) => !!option.active, close: () => false, value: (option) => option.sortId,
                    after: (option) => renderSortArrow(option),
                    onClick: (option: I_sort<T>) => changeSort(option.sortId, { active: !option.active })
                }}
                popover={{
                    header: { title: 'Sort', onClose: false },
                    setAttrs: (key) => { if (key === 'header') { return { className: 'aio-sort-header' } } },
                    limitTo: limitTo || '.aio-table'
                }}
                attrs={{ className: 'aio-sort-button' }}
                text={getIconRef.current('mdiSort', 0.7)}
                onSwap={(newSorts, from, to) => changeSorts(newSorts)}
            />
        )
    }
    return { sorts, setSorts, renderSortButton, getSortedRows, changeSort, changeSorts }
}


export function DragList<T>({data,onChange,renderItem,listAttrs}:{
    data: T[];listAttrs?:any,onChange: (newList: T[]) => void;
    renderItem: (item: T, index: number) => { inner: React.ReactNode; attrs: any };
}) {
    const [internalData, setInternalData] = useState(data);
    const containerRef = useRef<HTMLDivElement>(null);
    const { getDragAttrs, getDropAttrs } = UT.useDrag(
        (drag, drop, reOrder) => {
            const fromIndex = drag.index;
            const toIndex = drop.index;
            const updated = reOrder(internalData, fromIndex, toIndex);
            setInternalData(updated);
            onChange(updated);
        }
    );
    return (
        <div {...listAttrs} ref={containerRef}>
            {internalData.map((item, index) => {
                const dragAttrs = getDragAttrs({ index });
                const dropAttrs = getDropAttrs({ index });
                const { inner, attrs } = renderItem(item, index);
                const Attrs = { ...attrs, ...dragAttrs, ...dropAttrs };
                return (<div key={index} {...Attrs}>{inner}</div>);
            })}
        </div>
    );
}

