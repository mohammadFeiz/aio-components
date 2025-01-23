import { FC, ReactNode, useEffect, useState } from "react";
import { AddToAttrs, GetArray } from "../aio-utils";
import AIODate from "../aio-date";
import Prism from 'prismjs';
import './repo/index.css';
type AI_Indent = {
    level: number, width: number, height: number, rtl: boolean, isLastChild: boolean, isParentLastChild: boolean, row: any,
    open?: boolean, onToggle?: () => void, toggleIcon?: false | ((p: { row: any, open?: boolean, level: number }) => ReactNode)
}
export const Indent: FC<AI_Indent> = (props) => {
    const { width, height, level, open, row, rtl, isLastChild, isParentLastChild } = props;
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
        let path = open === undefined ? 'mdiCircleSmall' : (open ? 'mdiChevronDown' : 'mdiChevronRight');
        return new GetSvg().getIcon(path, 1)
    }
    const getIndentIcons = () => {
        const list = new Array(level).fill(0)
        return list.map((o, i) => <div key={i} className={`ai-indent`} style={{ width }}>{getIndentIcon(i)}</div>)
    }
    const getToggleIcon = () => {
        const toggleSvg = getToggleSvg();
        if (toggleSvg === false) { return null }
        return (
            <div className="ai-toggle" style={{ width }} onClick={(e) => { e.stopPropagation(); if (props.onToggle) { props.onToggle() } }}>
                <div className='ai-toggle-icon'>{toggleSvg}</div>
                {
                    open === true &&
                    <svg className='ai-toggle-line ai-indent-line'>
                        <path d={`M${width / 2} ${0} L${width / 2} ${height / 2 - 12} Z`}></path>
                    </svg>
                }
            </div>
        )
    }
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
type I_AICard = { text: ReactNode, subtext?: ReactNode, onClick: () => void, before?: ReactNode, after?: ReactNode }
export const AICard: FC<I_AICard> = ({ text, subtext, onClick, before, after }) => {
    return (
        <div className="ai-card">
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
    attrs?: any,
    bottomMenu: {
        options: AI_bottomMenuOption[],
        onChange: (v: string) => void
    }
    body: () => ReactNode,
    header?: () => ReactNode | false,
    children?: ReactNode
}
type AI_bottomMenuOption = { text?: ReactNode, uptext?: ReactNode, subtext?: ReactNode, value: string, before?: ReactNode, after?: ReactNode, show?: boolean, active?: boolean }
export const AIApp: FC<I_AIApp> = (props) => {
    function header_layout() {
        if (!props.header) { return null }
        const header = props.header()
        if (header === false) { return null }
        return (<div className="ai-app-header">{header}</div>)
    }
    function body_layout() {
        return (
            <div className="msf">
                <div className="ai-app-side"></div>
                <div className="ai-app-body">
                    {props.body()}
                </div>
            </div>
        )
    }
    function bottomMenu_layout() {
        return (<AIBottomMenu bottomMenu={props.bottomMenu} />)
    }
    const attrs = AddToAttrs(props.attrs, { className: 'ai-app' })
    return (
        <div {...attrs}>
            {header_layout()}
            {body_layout()}
            {bottomMenu_layout()}
            {!!props.children && props.children}
        </div>
    )
}
const AIAppSide:FC = ()=>{
    return null
}
type AI_BottomMenu = { bottomMenu: I_AIApp["bottomMenu"] }
const AIBottomMenu: FC<AI_BottomMenu> = ({ bottomMenu }) => {
    const { options, onChange } = bottomMenu
    function item_layout(item: AI_bottomMenuOption) {
        if (item.show === false) { return null }
        return (
            <div key={item.value} className={`ai-app-bottom-menu-option${item.active ? ' active' : ''}`} onClick={() => onChange(item.value)}>
                {!!item.before && item.before}
                <div className="ai-app-bottom-menu-option-body">
                    {item.text !== undefined && item.text}
                    {
                        item.text === undefined &&
                        <>
                            <div className="ai-app-bottom-menu-uptext">{item.uptext}</div>
                            <div className="ai-app-bottom-menu-subtext">{item.subtext}</div>
                        </>
                    }
                </div>
                {!!item.after && item.after}

            </div>
        )
    }
    return (
        <div className="ai-app-bottom-menu">
            {options.map((o, i) => item_layout(o))}
        </div>
    )
}
export type I_MonthCells = {
    year: number, month: number, cellContent: (date: number[], weekDayIndex: number) => ReactNode, weekDayContent?: (v: number) => ReactNode,
    changeMonth: (month: number) => void
}
export const MonthCells: FC<I_MonthCells> = ({ year, month, cellContent, weekDayContent }) => {
    const [DATE] = useState<AIODate>(new AIODate())
    const [monthes] = useState<string[]>(DATE.getMonths(true))
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
    function cells_layout() { return GetArray(dateInfo.monthDaysLength).map((day: number) => cell_layout(day + 1)) }
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