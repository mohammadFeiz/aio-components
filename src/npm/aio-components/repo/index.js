import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { AddToAttrs, GetArray } from "aio-utils";
import AIODate from "aio-date";
import Prism from 'prismjs';
import './index.css';
export const Indent = (props) => {
    const { width, height, level, open, row, rtl, isLastChild, isParentLastChild } = props;
    const [indentPathes, setIndentPathes] = useState(null);
    useEffect(() => { setIndentPathes(getIndentIcons()); }, [level, isLastChild, isParentLastChild]);
    const [toggleIcon, setToggleIcon] = useState(null);
    useEffect(() => { setToggleIcon(getToggleIcon()); }, [open]);
    function getIndentIcon(rowIndex) {
        if (!level) {
            return null;
        }
        let x0 = width / 2, x1 = width, y0 = 0, y1 = height / 2, y2 = height, pathes = [];
        if (rowIndex === level - 1) {
            //horizontal line
            pathes.push(_jsx("path", { d: `M${x0} ${y1} L${x1 * (rtl ? -1 : 1)} ${y1} Z` }, 'hl' + rowIndex));
            //vertical direct line
            pathes.push(_jsx("path", { d: `M${x0} ${y0} L${x0} ${isLastChild ? y1 : y2} Z` }, 'vdl' + rowIndex));
        }
        else {
            //vertical connet line
            if (!isParentLastChild) {
                pathes.push(_jsx("path", { d: `M${x0} ${y0} L${x0} ${y2} Z` }, 'vl' + rowIndex));
            }
        }
        return (_jsx("svg", { className: 'ai-indent-line', width: width, height: height, children: pathes }));
    }
    const getToggleSvg = () => {
        if (props.toggleIcon) {
            return props.toggleIcon({ row, level, open });
        }
        let path = open === undefined ? 'mdiCircleSmall' : (open ? 'mdiChevronDown' : 'mdiChevronRight');
        return new GetSvg().getIcon(path, 1);
    };
    const getIndentIcons = () => {
        const list = new Array(level).fill(0);
        return list.map((o, i) => _jsx("div", { className: `ai-indent`, style: { width }, children: getIndentIcon(i) }, i));
    };
    const getToggleIcon = () => {
        const toggleSvg = getToggleSvg();
        if (toggleSvg === false) {
            return null;
        }
        return (_jsxs("div", { className: "ai-toggle", style: { width }, onClick: (e) => { e.stopPropagation(); if (props.onToggle) {
                props.onToggle();
            } }, children: [_jsx("div", { className: 'ai-toggle-icon', children: toggleSvg }), open === true &&
                    _jsx("svg", { className: 'ai-toggle-line ai-indent-line', children: _jsx("path", { d: `M${width / 2} ${0} L${width / 2} ${height / 2 - 12} Z` }) })] }));
    };
    return (_jsxs("div", { className: `ai-indents ai-indent-${height}`, children: [indentPathes, toggleIcon] }));
};
export class GetSvg {
    constructor() {
        this.getStyle = (color) => {
            const fill = color || "currentcolor";
            return { fill, stroke: fill };
        };
        this.getSvgStyle = (size) => {
            size = size || 1;
            return { width: `${size * 1.5}rem`, height: `${size * 1.5}rem` };
        };
        this.fixSvgContent = (content, size, p) => {
            const { spin, color } = p || {};
            let res = null;
            if (spin) {
                res = (_jsxs(_Fragment, { children: [_jsx("style", { children: `@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }` }), _jsx("g", { style: { animation: `${spin}s linear 0s infinite normal none running spin`, transformOrigin: 'center center' } })] }));
            }
            else {
                res = content;
            }
            return (_jsx("svg", { viewBox: "0 0 24 24", role: "presentation", style: this.getSvgStyle(size), children: res }));
        };
        this.getIcon = (path, size, p) => {
            const { color } = p || {};
            const content = this[path](color);
            return this.fixSvgContent(content, size, p);
        };
        this.mdiClose = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", style: this.getStyle(color) }) }));
        this.mdiLoading = (color) => _jsxs(_Fragment, { children: [_jsx("path", { d: "M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z", style: this.getStyle(color) }), _jsx("rect", { width: "24", height: "24", fill: "transparent" })] });
        this.mdiAttachment = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M7.5,18A5.5,5.5 0 0,1 2,12.5A5.5,5.5 0 0,1 7.5,7H18A4,4 0 0,1 22,11A4,4 0 0,1 18,15H9.5A2.5,2.5 0 0,1 7,12.5A2.5,2.5 0 0,1 9.5,10H17V11.5H9.5A1,1 0 0,0 8.5,12.5A1,1 0 0,0 9.5,13.5H18A2.5,2.5 0 0,0 20.5,11A2.5,2.5 0 0,0 18,8.5H7.5A4,4 0 0,0 3.5,12.5A4,4 0 0,0 7.5,16.5H17V18H7.5Z", style: this.getStyle(color) }) }));
        this.mdiCircleMedium = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z", style: this.getStyle(color) }) }));
        this.mdiMagnify = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z", style: this.getStyle(color) }) }));
        this.mdiPlusThick = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z", style: this.getStyle(color) }) }));
        this.mdiImage = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z", style: this.getStyle(color) }) }));
        this.mdiEye = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z", style: this.getStyle(color) }) }));
        this.mdiEyeOff = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z", style: this.getStyle(color) }) }));
        this.mdiDotsHorizontal = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z", style: this.getStyle(color) }) }));
        this.mdiChevronDown = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", style: this.getStyle(color) }) }));
        this.mdiChevronRight = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z", style: this.getStyle(color) }) }));
        this.mdiCircleSmall = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M12,10A2,2 0 0,0 10,12C10,13.11 10.9,14 12,14C13.11,14 14,13.11 14,12A2,2 0 0,0 12,10Z", style: this.getStyle(color) }) }));
        this.mdiChevronLeft = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z", style: this.getStyle(color) }) }));
        this.mdiArrowDown = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z", style: this.getStyle(color) }) }));
        this.mdiArrowUp = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z", style: this.getStyle(color) }) }));
        this.mdiFileExcel = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.8,20H14L12,16.6L10,20H8.2L11.1,15.5L8.2,11H10L12,14.4L14,11H15.8L12.9,15.5L15.8,20M13,9V3.5L18.5,9H13Z", style: this.getStyle(color) }) }));
        this.mdiSort = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z", style: this.getStyle(color) }) }));
        this.mdiDelete = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z", style: this.getStyle(color) }) }));
        this.mdiMicrophoneOutline = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M17.3,11C17.3,14 14.76,16.1 12,16.1C9.24,16.1 6.7,14 6.7,11H5C5,14.41 7.72,17.23 11,17.72V21H13V17.72C16.28,17.23 19,14.41 19,11M10.8,4.9C10.8,4.24 11.34,3.7 12,3.7C12.66,3.7 13.2,4.24 13.2,4.9L13.19,11.1C13.19,11.76 12.66,12.3 12,12.3C11.34,12.3 10.8,11.76 10.8,11.1M12,14A3,3 0 0,0 15,11V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V11A3,3 0 0,0 12,14Z", style: this.getStyle(color) }) }));
    }
}
export const AIPanel = ({ text, subtext, before, after, body }) => {
    function header_layout() {
        return (_jsxs("div", { className: "ai-panel-header", children: [_jsx("div", { className: "ai-panel-before", children: !!before && before }), _jsxs("div", { className: "ai-panel-texts", children: [_jsx("div", { className: "ai-panel-text", children: text }), subtext !== undefined && _jsx("div", { className: "ai-panel-subtext", children: subtext })] }), _jsx("div", { className: "ai-panel-after", children: !!after && after })] }));
    }
    function body_layout() { return (_jsx("div", { className: "ai-panel-body", children: body })); }
    return (_jsxs("div", { className: "ai-panel", children: [header_layout(), " ", body_layout()] }));
};
export const AICard = ({ text, subtext, onClick, before, after }) => {
    return (_jsxs("div", { className: "ai-card", children: [before !== undefined && _jsx("div", { className: "ai-card-before", onClick: (e) => e.stopPropagation(), children: before }), _jsxs("div", { className: "ai-card-body", onClick: onClick, children: [_jsx("div", { className: "ai-card-text", children: text }), subtext !== undefined && _jsx("div", { className: "ai-card-subtext", children: subtext })] }), after !== undefined && _jsx("div", { className: "ai-card-after", onClick: (e) => e.stopPropagation(), children: after })] }));
};
export const AIApp = (props) => {
    function header_layout() {
        if (!props.header) {
            return null;
        }
        const header = props.header();
        if (header === false) {
            return null;
        }
        return (_jsx("div", { className: "ai-app-header", children: header }));
    }
    function body_layout() {
        return (_jsxs("div", { style: { flex: 1, overflow: 'hidden' }, children: [_jsx("div", { className: "ai-app-side" }), _jsx("div", { className: "ai-app-body", children: props.body() })] }));
    }
    function bottomMenu_layout() {
        return (_jsx(AIBottomMenu, { bottomMenu: props.bottomMenu }));
    }
    const attrs = AddToAttrs(props.attrs, { className: 'ai-app' });
    return (_jsxs("div", Object.assign({}, attrs, { children: [header_layout(), body_layout(), bottomMenu_layout(), !!props.children && props.children] })));
};
const AIAppSide = () => {
    return null;
};
const AIBottomMenu = ({ bottomMenu }) => {
    const { options, onChange } = bottomMenu;
    function item_layout(item) {
        if (item.show === false) {
            return null;
        }
        return (_jsxs("div", { className: `ai-app-bottom-menu-option${item.active ? ' active' : ''}`, onClick: () => onChange(item.value), children: [!!item.before && item.before, _jsxs("div", { className: "ai-app-bottom-menu-option-body", children: [item.text !== undefined && item.text, item.text === undefined &&
                            _jsxs(_Fragment, { children: [_jsx("div", { className: "ai-app-bottom-menu-uptext", children: item.uptext }), _jsx("div", { className: "ai-app-bottom-menu-subtext", children: item.subtext })] })] }), !!item.after && item.after] }, item.value));
    }
    return (_jsx("div", { className: "ai-app-bottom-menu", children: options.map((o, i) => item_layout(o)) }));
};
export const MonthCells = ({ year, month, cellContent, weekDayContent }) => {
    const [DATE] = useState(new AIODate());
    const [monthes] = useState(DATE.getMonths(true));
    function getDateInfo() {
        const res = {
            monthDaysLength: DATE.getMonthDaysLength([year, month]),
            firstDayIndex: DATE.getWeekDay([year, month, 1]).index,
            monthString: DATE.getMonths(true)[month - 1]
        };
        console.log(res, year, month);
        return res;
    }
    const gtc = Math.floor(100 / 7);
    const gridTemplateColumns = `${gtc}% ${gtc}% ${gtc}% ${gtc}% ${gtc}% ${gtc}% ${gtc}%`;
    function weekDays_layout() {
        if (!weekDayContent) {
            return null;
        }
        return (_jsx("div", { className: "ai-month-grid", style: { gridTemplateColumns }, children: DATE.getWeekDays(true).map((o, i) => _jsx("div", { className: `ai-month-weekday`, children: weekDayContent(i) }, o)) }));
    }
    function spaces_layout() { return new Array(dateInfo.firstDayIndex).fill(0).map((o, i) => _jsx("div", { className: "" }, i)); }
    function cells_layout() { return GetArray(dateInfo.monthDaysLength).map((day) => cell_layout(day + 1)); }
    function cell_layout(day) {
        const date = [year, month, day];
        const weekDayIndex = DATE.getWeekDay(date).index;
        return (_jsx("div", { className: "ai-month-cell", children: cellContent(date, weekDayIndex) }, day));
    }
    const dateInfo = getDateInfo();
    return (_jsx("div", { className: "ai-month", children: _jsxs("div", { className: "ai-month-body", children: [weekDays_layout(), _jsxs("div", { className: "ai-month-grid", style: { gridTemplateColumns }, children: [spaces_layout(), " ", cells_layout()] })] }) }));
};
const PrismCode = ({ code, language = 'js', style = {} }) => {
    useEffect(() => { Prism.highlightAll(); }, []);
    return (_jsx("div", { className: "aio-doc-code", style: style, children: _jsx("pre", { style: { height: '100%', overflow: 'auto' }, children: _jsx("code", { className: `language-${language}`, children: code }) }) }));
};
export function Code(code, language, style) {
    return _jsx(PrismCode, { code: code, language: language, style: style });
}
