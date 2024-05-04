import React,{ createContext, useContext, useEffect, useRef, useState } from "react";
import { AI, AI_context, AI_date_unit, I_Calendar, I_DPArrow, I_DPCell, I_DPCellWeekday, I_DPContext, I_DPHeaderDropdown, I_DP_activeDate } from "./types";
import {AICTX,Def,I} from './utils';
import AIOInput from ".";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
const DPContext = createContext({} as any);
export default function Calendar(props: I_Calendar) {
    let { rootProps,DATE}: AI_context = useContext(AICTX);
    let { onClose } = props;
    let { unit = Def('date-unit'), jalali, value,disabled,size = Def('date-size'),theme = Def('theme'), translate = (text) => text,onChange = () => { }, changeClose } = rootProps;
    let [months] = useState(DATE.getMonths(jalali));
    let [today] = useState(DATE.getToday(jalali))
    let [todayWeekDay] = useState(DATE.getWeekDay(today).weekDay)
    let [initValue] = useState(getInitValue())
    function getInitValue() {
        let date = !value || value === null ? today : value;
        let [year, month, day] = DATE.convertToArray(date)
        return { year, month, day }
    }
    let [thisMonthString] = useState(months[today[1] - 1])
    let [activeDate, setActiveDate] = useState<I_DP_activeDate>({ ...initValue });
    let adRef = useRef(activeDate);
    adRef.current = activeDate
    function trans(text:string) {
        if (text === 'Today') {
            if (unit === 'month') { text = 'This Month' }
            else if (unit === 'hour') { text = 'This Hour' }
        }
        let obj:any = { 'Clear': 'حذف', 'This Hour': 'ساعت کنونی', 'Today': 'امروز', 'This Month': 'ماه جاری','Select Year':'انتخاب سال' }
        let res;
        if (jalali && obj[text]) { res = obj[text] }
        return translate(text)
    }
    function changeActiveDate(obj:'today' | {[key in 'year'|'month'|'day']?:number}) {
        let newActiveDate;
        if (obj === 'today') {
            let [year, month, day] = today;
            newActiveDate = { year, month, day: unit === 'month' ? 1 : day };
        }
        else { newActiveDate = { ...activeDate, ...obj } }
        setActiveDate(newActiveDate)
    }
    function getPopupStyle() {
        return {
            width: size, fontSize: size / 17, background: theme[1], color: theme[0], stroke: theme[0],
            cursor: disabled === true ? 'not-allowed' : undefined,
        };
    }
    function getContext() {
        let context: I_DPContext = {
            changeActiveDate,DATE,
            translate: trans, rootProps, activeDate:adRef.current,
            today, todayWeekDay, thisMonthString,months,
            onChange: (p:{ year?:number, month?:number, day?:number, hour?:number }) => {
                let { year = 1000, month = 1, day = 1, hour = 0 } = p;
                let dateArray = [year, month, day, hour];
                let jalaliDateArray = !jalali ? DATE.toJalali(dateArray) : dateArray;
                let gregorianDateArray = jalali ? DATE.toGregorian(dateArray) : dateArray;
                let { weekDay, index: weekDayIndex } = unit === 'month' ? { weekDay: null, index: null } : DATE.getWeekDay(dateArray)
                let get2digit = (v:number) => {
                    if (v === undefined) { return }
                    let vn:string = v.toString();
                    return vn.length === 1 ? `0${vn}` : vn
                }
                let dateString;
                let splitter = typeof value === 'string' ? DATE.getSplitter(value) : '/';
                if (unit === 'month') { dateString = `${year}${splitter}${get2digit(month)}` }
                else if (unit === 'day') { dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}` }
                else if (unit === 'hour') { dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}${splitter}${get2digit(hour)}` }
                let monthString = months[month - 1];
                let jalaliMonthString = !jalali ? DATE.getMonths(true)[month - 1] : monthString;
                let gregorianMonthString = jalali ? DATE.getMonths(false)[month - 1] : monthString;
                let props = {
                    months, jalaliDateArray, gregorianDateArray, dateArray, weekDay, weekDayIndex, dateString,
                    year, month, day, hour, monthString, jalaliMonthString, gregorianMonthString,
                }
                onChange(dateString, props);
                if (changeClose && onClose) { onClose() }
            }
        }
        return context
    }
    return (
        <DPContext.Provider value={getContext()}>
            <div className='aio-input-date-container' style={{ display: 'flex' }}>
                <div className='aio-input-date-calendar aio-input-date-theme-bg1 aio-input-date-theme-color0 aio-input-date-theme-stroke0' style={getPopupStyle()}>
                    <DPHeader /><DPBody /><DPFooter />
                </div>
                <DPToday />
            </div>
        </DPContext.Provider>
    );
}
function DPToday() {
    let { rootProps, translate, today, todayWeekDay, thisMonthString }: I_DPContext = useContext(DPContext);
    let { theme = Def('theme'), jalali, unit = Def('date-unit'), size = Def('date-size') } = rootProps;
    return (
        <div className='aio-input-date-today aio-input-date-theme-color1 aio-input-date-theme-bg0' style={{ width: size / 2, color: theme[1], background: theme[0] }}>
            <div style={{ fontSize: size / 13 }}>{translate('Today')}</div>
            {
                (unit === 'day' || unit === 'hour') &&
                <>
                    <div style={{ fontSize: size / 11 }}>{!jalali ? todayWeekDay.slice(0, 3) : todayWeekDay}</div>
                    <div style={{ fontSize: size / 12 * 4, height: size / 12 * 4 }}>{today[2]}</div>
                    <div style={{ fontSize: size / 11 }}>{!jalali ? thisMonthString.slice(0, 3) : thisMonthString}</div>
                </>
            }
            {unit === 'month' && <div style={{ fontSize: size / 8 }}>{!jalali ? thisMonthString.slice(0, 3) : thisMonthString}</div>}
            <div style={{ fontSize: size / 11 }}>{today[0]}</div>
            {unit === 'hour' && <div style={{ fontSize: size / 10 }}>{today[3] + ':00'}</div>}
        </div>
    )
}
function DPFooter() {
    let {rootProps, changeActiveDate, translate}:I_DPContext = useContext(DPContext);
    let { disabled, onChange = () => { }, size = Def('date-size'),deSelect } = rootProps;
    if (disabled) { return null }
    let buttonStyle = { padding: `${size / 20}px 0`,fontFamily:'inherit' };
    return (
        <div className='aio-input-date-footer' style={{ fontSize: size / 13 }}>
            {!!deSelect && <button style={buttonStyle} onClick={() => typeof deSelect === 'function'?deSelect():onChange(undefined)}>{translate('Clear')}</button>}
            <button style={buttonStyle} onClick={() => changeActiveDate('today')}>{translate('Today')}</button>
        </div>
    )
}
function DPBody() {
    let {rootProps, activeDate}:I_DPContext = useContext(DPContext);
    let { unit = Def('date-unit'),jalali,size = Def('date-size') } = rootProps;
    function getStyle() {
        var columnCount = { hour: 4, day: 7, month: 3,year:1 }[unit as AI_date_unit];
        var rowCount = { hour: 6, day: 7, month: 4,year:1 }[unit as AI_date_unit];
        var padding = size / 18, fontSize = size / 15, a = (size - padding * 2) / columnCount;
        var rowHeight = { hour: size / 7, day: a, month: size / 6, year: size / 7 }[unit as AI_date_unit];
        var gridTemplateColumns = '', gridTemplateRows = '';
        for (let i = 1; i <= columnCount; i++) { gridTemplateColumns += a + 'px' + (i !== columnCount ? ' ' : '') }
        for (let i = 1; i <= rowCount; i++) { gridTemplateRows += (rowHeight) + 'px' + (i !== rowCount ? ' ' : '') }
        let direction:'ltr'|'rtl' = !jalali ? 'ltr' : 'rtl';
        return { gridTemplateColumns, gridTemplateRows, direction, padding, fontSize }
    }
    return (
        <div className='aio-input-date-body' style={getStyle()}>
            {unit === 'hour' && new Array(24).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year as number, activeDate.month as number, activeDate.day as number, i]} />)}
            {unit === 'day' && <DPBodyDay />}
            {unit === 'month' && new Array(12).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year as number, i + 1]} />)}
        </div>
    )
}
function DPBodyDay() {
    let {rootProps, activeDate,DATE}:I_DPContext = useContext(DPContext);
    let { theme = Def('theme'), jalali } = rootProps;
    let firstDayWeekDayIndex = DATE.getWeekDay([activeDate.year as number, activeDate.month as number, 1]).index;
    let daysLength = DATE.getMonthDaysLength([activeDate.year as number, activeDate.month as number]);
    let weekDays = DATE.getWeekDays(jalali);
    return (<>
        {weekDays.map((weekDay, i) => <DPCellWeekday key={'weekday' + i} weekDay={weekDay} />)}
        {new Array(firstDayWeekDayIndex).fill(0).map((o, i) => <div key={'space' + i} className='aio-input-date-space aio-input-date-cell aio-input-date-theme-bg1' style={{ background: theme[1] }}></div>)}
        {new Array(daysLength).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year || 0, activeDate.month || 0, i + 1]} />)}
        {new Array(42 - (firstDayWeekDayIndex + daysLength)).fill(0).map((o, i) => <div key={'endspace' + i} className='aio-input-date-space aio-input-date-cell aio-input-date-theme-bg1' style={{ background: theme[1] }}></div>)}
    </>)
}
function DPCellWeekday(props:I_DPCellWeekday) {
    let {rootProps, translate}:I_DPContext = useContext(DPContext);
    let { theme = Def('theme'), jalali } = rootProps;
    let { weekDay } = props;
    return (
        <div className='aio-input-date-weekday aio-input-date-cell aio-input-date-theme-bg1 aio-input-date-theme-color0' style={{ background: theme[1], color: theme[0] }}>
            <span>{translate(weekDay.slice(0, !jalali ? 2 : 1))}</span>
        </div>
    )
}
function DPCell(props:I_DPCell) {
    let {rootProps, translate, onChange,DATE}:I_DPContext = useContext(DPContext);
    let { disabled, dateAttrs, theme = Def('theme'), value, jalali, unit = Def('date-unit')} = rootProps;
    let { dateArray } = props;
    function getClassName(isActive:boolean, isToday:boolean, isDisabled:boolean, className?:string) {
        var str = 'aio-input-date-cell';
        if (isDisabled) { str += ' aio-input-date-disabled' }
        if (isActive) { str += ' aio-input-date-active aio-input-date-theme-bg0 aio-input-date-theme-color1'; }
        if (isToday) { str += ' today aio-input-date-theme-border0'; }
        if (className) { str += ' className'; }
        return str;
    }
    let isActive = !value ? false : DATE.isEqual(dateArray, value);
    let isToday = DATE.isEqual(dateArray, DATE.getToday(jalali))
    let isDateDisabled = !Array.isArray(disabled) ? false : DATE.isMatch(dateArray, disabled);
    let isDisabled = disabled === true || isDateDisabled;
    let Attrs:any = {}
    if (dateAttrs) { 
        Attrs = dateAttrs({ dateArray, isToday, isDisabled, isActive, isMatch: (o) => DATE.isMatch(dateArray, o) })
        Attrs = Attrs || {} 
    }
    let className = getClassName(isActive, isToday, isDisabled, Attrs.className);
    let onClick = isDisabled ? undefined : () => { onChange({ year: dateArray[0], month: dateArray[1], day: dateArray[2], hour: dateArray[3] }) };
    let style:any = {}
    if (!isDisabled) { style.background = theme[1]; }
    if (className.indexOf('aio-input-date-active') !== -1) {
        style.background = theme[0];
        style.color = theme[1];
    }
    if (className.indexOf('today') !== -1) { style.border = `1px solid ${theme[0]}` }
    style = { ...style, ...Attrs.style }
    let text;
    if (unit === 'hour') { text = dateArray[3] + ':00' }
    else if (unit === 'day') { text = dateArray[2] }
    else if (unit === 'month') {
        let months = DATE.getMonths(jalali);
        text = translate(!jalali ? months[dateArray[1] - 1].slice(0, 3) : months[dateArray[1] - 1])
    }
    return <div style={style} onClick={onClick} className={className}>{isDisabled ? <del>{text}</del> : text}</div>
}
function DPHeaderItem(props:{unit:'year'|'month'}){
    let {unit} = props;
    let {rootProps,activeDate,months}:I_DPContext = useContext(DPContext);
    let {theme = Def('theme')} = rootProps;
    if(!activeDate || !activeDate[unit]){return null}
    let text = unit === 'year'?activeDate.year:months[(activeDate[unit] as number) - 1]
    let POPUP = unit === 'year'?DPYearsPopup:DPMonthsPopup;
    let p:AI = {
        type:'button',text,justify:true,caret:false,
        attrs: { className: 'aio-input-date-dropdown' },
        popover:{
            fitTo:'.aio-input-date-calendar aio-input-date-theme-bg1 aio-input-date-theme-color0',
            attrs:{style:{background: theme[1], color: theme[0]}},
            body:{
                render:({close})=><POPUP onClose={close}/>
            }
        }
    }
    return (<AIOInput {...p}/>)
}
function DPYearsPopup(props:{onClose:()=>void}){
    let {onClose} = props;
    let { rootProps,translate,activeDate,changeActiveDate }: I_DPContext = useContext(DPContext);
    let { jalali,size = Def('date-size'),theme = Def('theme') } = rootProps;
    let [start, setStart] = useState<number>(Math.floor((activeDate.year as number) / 10) * 10);
    let [value,setValue] = useState<number>(activeDate.year as number);
    useEffect(()=>{setValue(activeDate.year as number)},[activeDate.year])
    function changePage(dir:1 | -1) {
        let newStart = start + (dir * 10)
        setStart(newStart);
    }
    function changeValue(v:number){
        setValue(v);
        changeActiveDate({year:v});
        onClose();
    }
    function getCells(start:number) {
        let cells = [];
        for (let i = start; i < start + 10; i++) {
            let active = i === value;
            let className = 'aio-input-date-cell'
            if(active){className += ' aio-input-date-active aio-input-date-theme-bg0 aio-input-date-theme-color1'}
            else {className += ' aio-input-date-theme-bg1 aio-input-date-theme-color0'}
            let p = {style:active?{background:theme[0],color:theme[1]}:{background:theme[1],color:theme[0]},className,onClick:() => changeValue(i)}
            cells.push(<div {...p} key={i}>{i}</div>)
        }
        return cells
    }
    function getBodyStyle() {
        var columnCount = 3;
        var rowCount = 4;
        var padding = size / 18, fontSize = size / 15, a = (size - padding * 2) / columnCount;
        var rowHeight = size / 6;
        var gridTemplateColumns = '', gridTemplateRows = '';
        for (let i = 1; i <= columnCount; i++) { gridTemplateColumns += a + 'px' + (i !== columnCount ? ' ' : '') }
        for (let i = 1; i <= rowCount; i++) { gridTemplateRows += (rowHeight) + 'px' + (i !== rowCount ? ' ' : '') }
        let direction:'ltr'|'rtl' = !jalali ? 'ltr' : 'rtl';
        return { gridTemplateColumns, gridTemplateRows, direction, padding, fontSize }
    }
    return (
        <div className='aio-input-date-years'>
            <div className='aio-input-date-years-header'>
                <DPArrow type='minus' onClick={() => changePage(-1)} />
                <div className='aio-input-date-years-label' style={{fontSize:size / 15}}>{translate('Select Year')}</div>
                <DPArrow type='plus' onClick={() => changePage(1)} />
            </div>
            <div style={getBodyStyle()} className='aio-input-date-years-body'>{getCells(start)}</div>
        </div>
    )
}
function DPMonthsPopup(props:{onClose:()=>void}){
    let {onClose} = props; 
    let { rootProps,DATE,changeActiveDate,activeDate }: I_DPContext = useContext(DPContext);
    let { jalali,size = Def('date-size'),theme = Def('theme') } = rootProps;
    let [months] = useState<string[]>(DATE.getMonths(jalali));
    let month = activeDate.month;
    function changeValue(v:number){
        changeActiveDate({month:v});
        onClose()
    }
    function getCells() {
        let cells = [];
        for (let i = 1; i <= 12; i++) {
            let active = i === month;
            let className = 'aio-input-date-cell'
            if(active){className += ' aio-input-date-active aio-input-date-theme-bg0 aio-input-date-theme-color1'}
            else {className += ' aio-input-date-theme-bg1 aio-input-date-theme-color0'}
            let p = {style:active?{background:theme[0],color:theme[1]}:{background:theme[1],color:theme[0]},className,onClick:() => changeValue(i)}
            cells.push(<div {...p} key={i}>{months[i - 1].slice(0,3)}</div>)
        }
        return cells
    }
    function getBodyStyle() {
        var columnCount = 3;
        var rowCount = 4;
        var padding = size / 18, fontSize = size / 15, a = (size - padding * 2) / columnCount;
        var rowHeight = size / 6;
        var gridTemplateColumns = '', gridTemplateRows = '';
        for (let i = 1; i <= columnCount; i++) { gridTemplateColumns += a + 'px' + (i !== columnCount ? ' ' : '') }
        for (let i = 1; i <= rowCount; i++) { gridTemplateRows += (rowHeight) + 'px' + (i !== rowCount ? ' ' : '') }
        let direction:'ltr'|'rtl' = !jalali ? 'ltr' : 'rtl';
        return { gridTemplateColumns, gridTemplateRows, direction, padding, fontSize }
    }
    return (
        <div className='aio-input-date-months'>
            <div style={getBodyStyle()} className='aio-input-date-years-body'>{getCells()}</div>
        </div>
    )
}
function DPHeader() {
    let { rootProps,activeDate, changeActiveDate,DATE }: I_DPContext = useContext(DPContext);
    let { size = Def('date-size'), unit = Def('date-unit') } = rootProps;
    function getDays():React.ReactNode {
        if(!activeDate || !activeDate.year || !activeDate.month){return null}
        let daysLength = DATE.getMonthDaysLength([activeDate.year, activeDate.month]);
        let options = new Array(daysLength).fill(0).map((o, i) => { return { text: (i + 1).toString(), value: i + 1 } })
        let p:I_DPHeaderDropdown = { value: activeDate.day, options, onChange: (day) => changeActiveDate({ day }) }
        return <DPHeaderDropdown {...p} />
    }
    return (
        <div className='aio-input-date-header' style={{ height: size / 4 }}>
            <DPArrow type='minus' />
            <div className='aio-input-date-select' style={{ fontSize: Math.floor(size / 12) }}>
                <DPHeaderItem unit='year'/>
                {unit !== 'month' ? <DPHeaderItem unit='month'/> : null}
                {unit === 'hour' ? getDays() : null}
            </div>
            <DPArrow type='plus' />
        </div>
    )
}
function DPHeaderDropdown(props: I_DPHeaderDropdown) {
    let { rootProps }: I_DPContext = useContext(DPContext);
    let { value, options, onChange } = props;
    let { size = Def('date-size'), theme = Def('theme') } = rootProps;
    let p: AI = {
        value, options, onChange, caret: false, type: 'select',
        attrs: { className: 'aio-input-date-dropdown aio-input-date-theme-bg1 aio-input-date-theme-color0' },
        option:{style:()=>{return { height: size / 6, background: theme[1], color: theme[0] }} },
    }
    return (<AIOInput {...p} />)
}
function DPArrow(props: I_DPArrow) {
    let { rootProps, changeActiveDate, activeDate,DATE }: I_DPContext = useContext(DPContext);
    let { type, onClick } = props;
    let { jalali, unit = Def('date-unit'), size = Def('date-size'), theme = Def('theme') } = rootProps;
    function change() {
        if (onClick) { onClick(); return }
        let offset = (!jalali ? 1 : -1) * (type === 'minus' ? -1 : 1);
        let date = [activeDate.year as number, activeDate.month as number, activeDate.day as number]
        if (unit === 'month') { changeActiveDate({ year: (activeDate.year as number) + offset }) }
        if (unit === 'day') { 
            let next = DATE.getNextTime(date,offset * 24 * 60 * 60 * 1000,jalali);
            changeActiveDate({ year: next[0], month: next[1] }) 
        }
        if (unit === 'hour') { 
            let next = DATE.getNextTime(date,offset * 60 * 60 * 1000,jalali);
            changeActiveDate({ year: next[0], month: next[1], day: next[2] }) 
        }
    }
    function getIcon() {return I(type === 'minus' ? mdiChevronLeft : mdiChevronRight,1,{style:{ color: theme[0] },className:'aio-input-date-theme-color0'})}
    return (<div className='aio-input-date-arrow' style={{ width: size / 6, height: size / 6 }} onClick={() => change()}>{getIcon()}</div>)
}