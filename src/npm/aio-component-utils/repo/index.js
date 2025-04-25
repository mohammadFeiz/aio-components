var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as UT from "aio-utils";
import AIODate from "aio-date";
import Prism from 'prismjs';
import { AIFormInput, AINumber, AISelect, AIText, AITime, AITree, SuggestionInput } from "aio-input";
import usePopup from "aio-popup";
import './index.css';
export const Indent = (props) => {
    const { width, height, level, open, row, rtl, isLastChild, isParentLastChild, isLeaf } = props;
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
        let path = open === undefined ? 'mdiCircleSmall' : (open ? 'mdiChevronDown' : (rtl ? 'mdiChevronLeft' : 'mdiChevronRight'));
        return new GetSvg().getIcon(path, 1);
    };
    const getIndentIcons = () => {
        const list = new Array(level).fill(0);
        return list.map((o, i) => _jsx("div", { className: `ai-indent`, style: { width }, children: getIndentIcon(i) }, i));
    };
    const getToggleIcon = () => {
        return (_jsxs("div", { className: "ai-toggle", style: { width }, onClick: (e) => { e.stopPropagation(); if (props.onToggle) {
                props.onToggle();
            } }, children: [_jsx("div", { className: `ai-toggle-icon${isLeaf ? ' ai-leaf-icon' : ''}`, children: toggleSvg }), open === true &&
                    _jsx("svg", { className: 'ai-toggle-line ai-indent-line', children: _jsx("path", { d: `M${width / 2} ${0} L${width / 2} ${height / 2 - 12} Z` }) })] }));
    };
    const toggleSvg = getToggleSvg();
    if (toggleSvg === false) {
        return null;
    }
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
        this.mdiMenu = (color) => (_jsx(_Fragment, { children: _jsx("path", { d: "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z", style: this.getStyle(color) }) }));
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
export const AICard = ({ text, subtext, onClick = () => { }, before, after, attrs, className, style }) => {
    const Attrs = UT.AddToAttrs(attrs, { className: ["ai-card", className], style });
    return (_jsxs("div", Object.assign({}, Attrs, { children: [before !== undefined && _jsx("div", { className: "ai-card-before", onClick: (e) => e.stopPropagation(), children: before }), _jsxs("div", { className: "ai-card-body", onClick: onClick, children: [_jsx("div", { className: "ai-card-text", children: text }), subtext !== undefined && _jsx("div", { className: "ai-card-subtext", children: subtext })] }), after !== undefined && _jsx("div", { className: "ai-card-after", onClick: (e) => e.stopPropagation(), children: after })] })));
};
export const AIApp = (props) => {
    const [storage] = useState(getStorage);
    function getStorage() { return new UT.Storage('aiapp' + props.appId); }
    const sidenav = useSidenav({ sidenav: props.sidenav, appId: props.appId, storage });
    function header_layout() {
        if (!props.header) {
            return null;
        }
        const header = props.header(sidenav.active);
        if (header === false) {
            return null;
        }
        return header;
    }
    function getcontent() {
        if (sidenav.active) {
            if (sidenav.active.render) {
                return sidenav.active.render();
            }
        }
        return props.body || null;
    }
    function body_layout() {
        var _a;
        const content = getcontent();
        return (_jsxs("div", { className: 'ai-app-content', children: [!!props.sidenav &&
                    _jsx("div", { className: "ai-app-side", children: _jsx(Sidenav, { rtl: props.rtl, attrs: props.sidenav.attrs, items: props.sidenav.items, header: props.sidenav.header, value: (_a = sidenav.active) === null || _a === void 0 ? void 0 : _a.value, onChange: (v) => sidenav.changeActive(v) }) }), _jsxs("div", { className: "ai-app-center", children: [header_layout(), _jsx("div", { className: "ai-app-body", children: content })] })] }));
    }
    function bottomMenu_layout() {
        if (!props.bottomMenu) {
            return null;
        }
        return (_jsx(AIBottomMenu, { bottomMenu: props.bottomMenu }));
    }
    const attrs = UT.AddToAttrs(props.attrs, { className: 'ai-app' });
    return (_jsxs("div", Object.assign({}, attrs, { children: [body_layout(), bottomMenu_layout(), !!props.children && props.children] })));
};
const useSidenav = (props) => {
    const snRes = useRef();
    const [active, setActive] = useState(getSidenavItem);
    function changeActive(active) {
        var _a;
        if ((_a = props.sidenav) === null || _a === void 0 ? void 0 : _a.cache) {
            props.storage.save('navitemvalue', active.value);
        }
        setActive(active);
    }
    function getSidenavItem() {
        if (!props.sidenav) {
            return;
        }
        const value = props.sidenav.cache ? props.storage.load('navitemvalue', props.sidenav.value) : props.sidenav.value;
        const res = getByValue(value);
        return res;
    }
    function getByValue(value) {
        if (!props.sidenav || !value) {
            return;
        }
        snRes.current = undefined;
        getByValue_req(props.sidenav.items, value);
        return snRes.current;
    }
    function getByValue_req(items, value) {
        if (snRes.current) {
            return;
        }
        for (let i = 0; i < items.length; i++) {
            if (snRes.current) {
                return;
            }
            let item = items[i];
            let { show = true } = item;
            if (!show) {
                continue;
            }
            if (item.value === value) {
                snRes.current = item;
                break;
            }
            let navItems = item.items;
            if (navItems) {
                getByValue_req(navItems, value);
            }
        }
    }
    return { active, changeActive };
};
const AIBottomMenu = ({ bottomMenu }) => {
    const { options, option } = bottomMenu;
    function getProps(item, props) {
        const res = {};
        for (let prop of props) {
            res[prop] = option[prop] ? option[prop](item) : undefined;
        }
        return res;
    }
    function item_layout(item) {
        if (getProps(item, ['show']).show === false) {
            return null;
        }
        const { value, text, uptext, subtext, active, before, after, attrs, className, style } = getProps(item, ['value', 'text', 'uptext', 'subtext', 'active', 'before', 'after', 'show', 'attrs', 'className', 'style']);
        const Attrs = UT.AddToAttrs(attrs, {
            className: ['ai-app-bottom-menu-option', active ? 'active' : undefined, className],
            style, attrs: { onClick: () => { if (option.onClick) {
                    option.onClick(item);
                } } }
        });
        return (_jsxs("div", Object.assign({}, Attrs, { children: [!!before && before, _jsxs("div", { className: "ai-app-bottom-menu-option-body", children: [text !== undefined && text, text === undefined &&
                            _jsxs(_Fragment, { children: [_jsx("div", { className: "ai-app-bottom-menu-uptext", children: uptext }), _jsx("div", { className: "ai-app-bottom-menu-subtext", children: subtext })] })] }), !!after && after] }), value));
    }
    return (_jsx("div", { className: "ai-app-bottom-menu", children: options.map((o, i) => item_layout(o)) }));
};
export const Sidenav = (props) => {
    let { items = [], onChange, rtl = false, indent = 0, header, value } = props;
    const [minimize, setMinimize] = useState(!!props.minimize);
    const [icons] = useState(new GetSvg());
    const toggleRef = useRef((id) => { });
    function getAfter(option, active) {
        let { items = [], after } = option;
        return (_jsxs("div", { className: `ai-sidenav-item-after`, children: [!!after && after, !!items.length &&
                    _jsx("div", { className: "ai-sidenav-toggle", children: icons.getIcon(active ? 'mdiChevronDown' : (rtl ? 'mdiChevronRight' : 'mdiChevronLeft'), 0.7) })] }));
    }
    function getBefore(option, level) {
        let { before } = option;
        if (level > 0 && !before) {
            before = icons.getIcon('mdiCircleMedium', 0.6);
        }
        if (!before) {
            return null;
        }
        return (_jsx("div", { className: `ai-sidenav-item-before`, children: before }));
    }
    const defaultOption = {
        text: 'option.text',
        value: 'option.value',
        after: (option, { active }) => getAfter(option, !!active),
        before: (option, { level }) => getBefore(option, level || 0),
        onClick: (option) => {
            let { items = [], value } = option;
            if (!!items.length) {
                toggleRef.current(value);
            }
            else if (onChange) {
                onChange(option);
            }
        },
        show: (option) => {
            const { show = true } = option;
            return show;
        }
    };
    let finalOptions = Object.assign(Object.assign({}, defaultOption), { className: (option, { level }) => `ai-sidenav-${level === 0 ? 'item' : 'sub-item'}${value !== undefined && option.value === value ? ' active' : ''}` });
    const attrs = UT.AddToAttrs(props.attrs, { className: ['ai-sidenav', props.className, !!minimize ? 'ai-sidenav-minimize' : undefined] });
    return (_jsxs("div", Object.assign({}, attrs, { children: [!!header &&
                _jsx("div", { className: "ai-sidenav-header", children: header(minimize) }), !!props.minimize &&
                _jsx("div", { className: "ai-sidenav-minimize-button", onClick: () => setMinimize(!minimize), children: _jsx("div", { className: "ai-sidenav-minimize-icon", children: icons.getIcon('mdiMenu', 1) }) }), _jsx("div", { className: "ai-sidenav-body", children: _jsx(AITree, Object.assign({}, attrs, { toggleIcon: () => false, className: 'ai-sidenav-tree', size: 48, toggleRef: toggleRef, value: [...items], getChilds: (p) => p.row.items || [], option: finalOptions, indent: 0 })) })] })));
};
export const MonthCells = ({ year, month, cellContent, weekDayContent }) => {
    const [DATE] = useState(new AIODate());
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
    function cells_layout() { return UT.GetArray(dateInfo.monthDaysLength).map((day) => cell_layout(day + 1)); }
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
export const NodeAttrs = (p) => {
    const baseClassName = 'rvd';
    const NodeStyle = () => {
        const res = { flex: p.node.flex };
        if (p.parentNode && (p.parentNode.h || p.parentNode.v)) {
            res[p.parentNode.v ? 'height' : 'width'] = p.node.size;
        }
        return Object.assign(Object.assign({}, res), p.node.style);
    };
    function VisibilityClassNames() {
        let hide_xs, hide_sm, hide_md, hide_lg, classNames = [];
        if (p.node.show_xs) {
            hide_xs = false;
            hide_sm = true;
            hide_md = true;
            hide_lg = true;
        }
        if (p.node.hide_xs) {
            hide_xs = true;
        }
        if (p.node.show_sm) {
            hide_xs = true;
            hide_sm = false;
            hide_md = true;
            hide_lg = true;
        }
        if (p.node.hide_sm) {
            hide_sm = true;
        }
        if (p.node.show_md) {
            hide_xs = true;
            hide_sm = true;
            hide_md = false;
            hide_lg = true;
        }
        if (p.node.hide_md) {
            hide_md = true;
        }
        if (p.node.show_lg) {
            hide_xs = true;
            hide_sm = true;
            hide_md = true;
            hide_lg = false;
        }
        if (p.node.hide_lg) {
            hide_lg = true;
        }
        if (hide_xs) {
            classNames.push(`${baseClassName}-hide-xs`);
        }
        if (hide_sm) {
            classNames.push(`${baseClassName}-hide-sm`);
        }
        if (hide_md) {
            classNames.push(`${baseClassName}-hide-md`);
        }
        if (hide_lg) {
            classNames.push(`${baseClassName}-hide-lg`);
        }
        return classNames;
    }
    const NodeClassNames = () => {
        let nodeClassName, scrollClassName, alignClassName, rootClassName = p.isRoot ? baseClassName : undefined, visibilityClassNames = VisibilityClassNames();
        if (p.node.v) {
            nodeClassName = `${baseClassName}-v`;
            scrollClassName = `${baseClassName}-scroll-v`;
            if (p.node.align === 'v') {
                alignClassName = `${baseClassName}-justify-center`;
            }
            else if (p.node.align === 'h') {
                alignClassName = `${baseClassName}-items-center`;
            }
            else if (p.node.align === 'vh') {
                alignClassName = `${baseClassName}-justify-center ai-form-items-center`;
            }
            else if (p.node.align === 'hv') {
                alignClassName = `${baseClassName}-justify-center ai-form-items-center`;
            }
        }
        else if (p.node.h) {
            nodeClassName = `${baseClassName}-h`;
            scrollClassName = `${baseClassName}-scroll-h`;
            if (p.node.align === 'v') {
                alignClassName = `${baseClassName}-items-center`;
            }
            else if (p.node.align === 'h') {
                alignClassName = `${baseClassName}-justify-center`;
            }
            else if (p.node.align === 'vh') {
                alignClassName = `${baseClassName}-justify-center ai-form-items-center`;
            }
            else if (p.node.align === 'hv') {
                alignClassName = `${baseClassName}-justify-center ai-form-items-center`;
            }
        }
        else if (p.node.html) {
            nodeClassName = `${baseClassName}-html`;
            if (p.node.align === 'v') {
                alignClassName = `${baseClassName}-items-center`;
            }
            else if (p.node.align === 'h') {
                alignClassName = `${baseClassName}-justify-center`;
            }
            else if (p.node.align === 'vh') {
                alignClassName = `${baseClassName}-justify-center ai-form-items-center`;
            }
            else if (p.node.align === 'hv') {
                alignClassName = `${baseClassName}-justify-center ai-form-items-center`;
            }
        }
        return [nodeClassName, rootClassName, p.node.className, scrollClassName, alignClassName, ...visibilityClassNames];
    };
    return UT.AddToAttrs(p.node.attrs, { className: NodeClassNames(), style: NodeStyle() });
};
export const Node = ({ node, level, index, parentNode, updateNode }) => {
    const [dom, setDom] = useState(null);
    let { show = true, isStatic } = updateNode ? updateNode({ node, level, parentNode }) : node;
    const getContent = () => {
        if (!show) {
            return null;
        }
        if (Array.isArray(node.h) || Array.isArray(node.v)) {
            return _jsx(NodeGroup, { node: node, level: level, index: index, parentNode: parentNode });
        }
        if (node.html !== undefined) {
            const attrs = NodeAttrs({ node, isRoot: level === 0, parentNode });
            return (_jsx("div", Object.assign({}, attrs, { children: node.html })));
        }
        return node.content;
    };
    useEffect(() => {
        if (isStatic) {
            setDom(getContent());
        }
    }, [isStatic]);
    return isStatic ? _jsx(_Fragment, { children: dom }) : _jsx(_Fragment, { children: getContent() });
};
const NodeGroup = ({ node, level, parentNode }) => {
    let { tag = 'div', legend } = node;
    const content = (_jsxs(_Fragment, { children: [!!legend && tag === 'fieldset' && _jsx("legend", { children: legend }), node[node.v ? 'v' : 'h'].map((o, i) => {
                return (_jsx(Node, { node: o, parentNode: node, level: level + 1, index: i }, `level-${level + 1}-index-${i}`));
            })] }));
    const attrs = NodeAttrs({ node, isRoot: level === 0, parentNode });
    if (level === 0) {
        return (_jsx("form", Object.assign({}, attrs, { children: content })));
    }
    if (tag === 'section') {
        return (_jsx("section", Object.assign({}, attrs, { children: content })));
    }
    if (tag === 'fieldset') {
        return (_jsx("fieldset", Object.assign({}, attrs, { children: content })));
    }
    if (tag === 'p') {
        return (_jsx("p", Object.assign({}, attrs, { children: content })));
    }
    if (tag === 'form') {
        return (_jsx("p", Object.assign({}, attrs, { children: content })));
    }
    return (_jsx("div", Object.assign({}, attrs, { children: content })));
};
export const Filterbar = (props) => {
    const propsRef = useRef(props);
    propsRef.current = props;
    const popup = usePopup();
    const [columns, setColumns] = useState(getColumns);
    useEffect(() => {
        setColumns(getColumns());
    }, [props.columns]);
    function getColumns() {
        return props.columns.map((col, i) => {
            const text = props.columnOption.text(col);
            const id = props.columnOption.id(col);
            const type = props.columnOption.type(col);
            return { text, id, type };
        });
    }
    if (!columns.length) {
        return null;
    }
    const trans = (key) => {
        const { fa } = propsRef.current;
        const dic = {
            'less': fa ? 'کوچک تر از' : 'less than',
            'more': fa ? 'بزرگتر از' : 'more than',
            'equal': fa ? 'برابر' : 'equal',
            'notEqual': fa ? 'مخالف' : 'not equal',
            'contain': fa ? 'شامل باشد' : 'contain',
            'notContain': fa ? 'شامل نباشد' : 'not contain'
        };
        return dic[key];
    };
    const addFilter = () => {
        const { filter } = propsRef.current;
        if (!filter.onChange) {
            return;
        }
        const newFilters = [{ value: '', operator: 'contain', columnId: columns[0].id, type: columns[0].type }, ...filter.items];
        filter.onChange(newFilters);
    };
    const changeFilter = (index, newFilter) => {
        const { filter } = propsRef.current;
        if (!filter.onChange) {
            return;
        }
        const newFilters = filter.items.map((o, i) => i === index ? newFilter : o);
        filter.onChange(newFilters);
    };
    const removeFilter = (filterRow) => {
        const { filter } = propsRef.current;
        if (!filter.onChange) {
            return;
        }
        filter.onChange(filter.items.filter((o) => o.columnId !== filterRow.columnId));
    };
    const openSavedItemsModal = () => {
        popup.addModal({
            position: 'center', body: _jsx(SavedModal, {}), id: 'savedItems',
            header: { title: props.fa ? 'فیلتر های ذخیره شده' : 'saved filters' },
            setAttrs: (key) => { if (key === 'backdrop') {
                return { className: 'aio-filter-modal aio-filter-modal-size' };
            } }
        });
    };
    const openSaveModal = () => {
        popup.addModal({
            header: { title: props.fa ? 'ذخیره فیلتر' : 'Save Filter' }, position: 'center', body: _jsx(SaveModal, {}),
            setAttrs: (key) => { if (key === 'backdrop') {
                return { className: 'aio-filter-modal' };
            } }
        });
    };
    const openRemoveModal = (saveItem) => {
        popup.addConfirm({
            title: props.fa ? 'حذف فیلتر ذخیره شده' : 'remove saved filter',
            text: props.fa ? 'از حذف این آیتم اطمینان دارید؟' : 'are you sure to remove this item?',
            submitText: props.fa ? 'حذف' : 'Remove',
            canselText: props.fa ? 'لغو' : 'Cansel',
            setAttrs: (key) => { if (key === 'backdrop') {
                return { className: 'aio-filter-modal' };
            } },
            submitAttrs: { className: 'aio-filter-button aio-filter-active-button' },
            canselAttrs: { className: 'aio-filter-button' },
            onSubmit: () => __awaiter(void 0, void 0, void 0, function* () {
                const { savedItems = [], changeSavedItems } = propsRef.current.filter;
                if (changeSavedItems) {
                    changeSavedItems(savedItems.filter((o) => o.name !== saveItem.name));
                }
                return true;
            })
        });
    };
    const openActiveModal = (saveItem) => {
        popup.addConfirm({
            title: props.fa ? 'اعمال فیلتر ذخیره شده' : 'activate saved filter',
            text: props.fa ? 'از فعالسازی این آیتم اطمینان دارید؟' : 'are you sure to activate this item?',
            submitText: props.fa ? 'حذف' : 'activate',
            canselText: props.fa ? 'لغو' : 'Cansel',
            setAttrs: (key) => { if (key === 'backdrop') {
                return { className: 'aio-filter-modal' };
            } },
            submitAttrs: { className: 'aio-filter-button aio-filter-active-button' },
            canselAttrs: { className: 'aio-filter-button' },
            onSubmit: () => __awaiter(void 0, void 0, void 0, function* () {
                const { activeSavedItem } = propsRef.current.filter;
                if (activeSavedItem) {
                    activeSavedItem(saveItem);
                }
                popup.removeModal('savedItems');
                return true;
            })
        });
    };
    const saveItem = (name, isExist) => {
        popup.removeModal();
        const { changeSavedItems, savedItems = [], items = [] } = propsRef.current.filter;
        if (!changeSavedItems) {
            return;
        }
        let newSavedItems = [];
        if (isExist) {
            newSavedItems = savedItems.map((o) => o.name === name ? { name, items } : o);
        }
        else {
            newSavedItems = [...savedItems, { name, items }];
        }
        changeSavedItems(newSavedItems);
    };
    const getColumnById = (columnId) => columns.find((o) => o.id === columnId);
    const openModal = () => {
        popup.addModal({
            header: { title: 'Filters', after: _jsx(FilterToolbar, {}) },
            position: 'center', body: _jsx(FilterModal, {}),
            setAttrs: (key) => { if (key === 'backdrop') {
                return { className: 'aio-filter-modal aio-filter-modal-size' };
            } }
        });
    };
    return (_jsxs(FilterContextProvider, { value: {
            addFilter, changeFilter, removeFilter, filter: props.filter, trans, getColumnById, columns, fa: props.fa,
            popup, openSavedItemsModal, openSaveModal, openRemoveModal, openActiveModal, saveItem
        }, children: [_jsxs("div", { className: "aio-filter", children: [_jsx("button", { className: "aio-filter-icon-button", onClick: openModal, children: new UT.GetSvg().getIcon('mdiFilter', 0.7) }), _jsx(FilterTags, { rows: props.filter.items, remove: (row) => removeFilter(row) })] }), popup.render()] }));
};
const FilterTags = ({ rows, remove }) => {
    return (_jsx("div", { className: "aio-filter-tags", children: rows.map((row, i) => _jsx(FilterTag, { filterRow: row, remove: remove ? () => remove(row) : undefined }, i)) }));
};
const FilterTag = ({ filterRow, remove }) => {
    const { getColumnById, trans } = useFilterContext();
    const column = getColumnById(filterRow.columnId);
    return (_jsxs("div", { className: "aio-filter-tag", onClick: remove, children: [_jsx("div", { className: "aio-filter-tag-column", children: column.text }), _jsx("div", { className: "aio-filter-tag-operator", children: trans(filterRow.operator) }), _jsx("div", { className: "aio-filter-tag-value", children: filterRow.value }), !!remove && new UT.GetSvg().getIcon('mdiClose', 0.6)] }));
};
const FilterToolbar = () => {
    const { openSaveModal, fa, filter, openSavedItemsModal } = useFilterContext();
    const { savedItems = [] } = filter;
    return (_jsxs("div", { className: "aio-filter-toolbar", children: [!!filter.changeSavedItems && !!filter.items.length &&
                _jsx("div", { className: "aio-filter-icon-button aio-filter-active-button", title: fa ? 'ذخیره فیلتر' : 'Save Filter', onClick: openSaveModal, children: _jsx(FilterSaveIcon, {}) }), !!filter.savedItems &&
                _jsxs("button", { disabled: !savedItems.length, className: "aio-filter-button aio-filter-active-button", title: fa ? 'فیلتر های ذخیره شده' : 'Saved Filters', onClick: openSavedItemsModal, children: [_jsx(FilterSavesIcon, {}), fa ? 'فیلتر های ذخیره شده' : 'Saved Filters', _jsx("div", { className: "aio-filter-badge", children: savedItems.length })] })] }));
};
const SaveModal = () => {
    const [name, setName] = useState('');
    const { fa, filter, popup, saveItem } = useFilterContext();
    const { savedItems = [] } = filter;
    const getOptions = (text) => __awaiter(void 0, void 0, void 0, function* () {
        const items = filter.savedItems || [];
        return items.filter((item) => {
            if (!text) {
                return true;
            }
            return item.name.indexOf(text) !== -1;
        }).map((item) => ({ text: item.name, value: item.name }));
    });
    const isExist = (name) => !!savedItems.find((o) => o.name === name);
    const getAddName = () => {
        const exist = isExist(name);
        if (exist) {
            return fa ? 'ویرایش' : 'Edit';
        }
        else {
            return fa ? 'افزودن' : 'Add';
        }
    };
    return (_jsxs("div", { className: "aio-filter-save-modal", children: [_jsx(AIFormInput, { label: fa ? 'نام فیلتر را برای ذخیره وارد کنید' : 'please inter filter name', input: (_jsx(SuggestionInput, { value: name, onChange: (newName) => setName(newName), getOptions: getOptions })) }), _jsxs("div", { className: "aio-filter-save-modal-footer", children: [_jsx("button", { className: "aio-filter-button aio-filter-active-button", disabled: !name || name.length < 3, onClick: () => saveItem(name, isExist(name)), children: getAddName() }), _jsx("button", { className: "aio-filter-button", onClick: () => popup.removeModal(), children: fa ? 'لغو' : 'Cansel' })] })] }));
};
const SavedModal = () => {
    const { filter } = useFilterContext();
    const { savedItems = [] } = filter;
    return (_jsx("div", { className: "aio-filter-saved-modal", children: savedItems === null || savedItems === void 0 ? void 0 : savedItems.map((o, i) => _jsx(SavedRow, { saveItem: o }, i)) }));
};
const SavedRow = ({ saveItem }) => {
    const { filter, openRemoveModal, openActiveModal } = useFilterContext();
    return (_jsxs("div", { className: "aio-filter-saved-row", children: [_jsxs("div", { className: "aio-filter-saved-row-header", children: [_jsx("div", { className: "aio-filter-saved-name", children: saveItem.name }), !!filter.changeSavedItems && _jsx("div", { className: "aio-filter-icon-button", onClick: () => openRemoveModal(saveItem), children: _jsx(FilterRemoveIcon, {}) }), !!filter.activeSavedItem && _jsx("div", { className: "aio-filter-icon-button", onClick: () => openActiveModal(saveItem), children: _jsx(FilterActiveIcon, {}) })] }), _jsx("div", { className: "aio-filter-saved-row-body", children: _jsx(FilterTags, { rows: saveItem.items }) })] }));
};
const FilterContext = createContext({});
const FilterContextProvider = (props) => _jsx(FilterContext.Provider, { value: props.value, children: props.children });
const useFilterContext = () => useContext(FilterContext);
const FilterModal = () => _jsxs("div", { className: "aio-filter-items", children: [_jsx(FilterHeader, {}), _jsx(FilterBody, {})] });
const FilterHeader = () => {
    const { addFilter } = useFilterContext();
    return (_jsx("div", { className: "aio-filter-header", children: _jsxs("button", { className: "aio-filter-add-button", onClick: addFilter, children: [_jsx(FilterAddIcon, {}), " Add Filter"] }) }));
};
const FilterBody = () => {
    const { filter } = useFilterContext();
    return (_jsx("div", { className: "aio-filter-body", children: filter.items.map((filterItem, i) => _jsx(FilterRow, { filterItem: filterItem, index: i }, i)) }));
};
const FilterRow = ({ filterItem, index }) => {
    const { operator, columnId, type, value } = filterItem;
    const { columns, changeFilter, removeFilter, trans, getColumnById } = useFilterContext();
    const [operators, setOperators] = useState(getOperators);
    useEffect(() => {
        setOperators(getOperators());
    }, [filterItem.type]);
    function getOperators() {
        const res = [];
        const operators = ['less', 'more', 'equal', 'notEqual', 'contain', 'notContain'];
        for (let i = 0; i < operators.length; i++) {
            const o = operators[i];
            if ((o === 'less' || o === 'more') && type === 'text') {
                continue;
            }
            if ((o === 'contain' || o === 'notContain') && type !== 'text') {
                continue;
            }
            res.push(operators[i]);
        }
        return res;
    }
    const isTime = ['month', 'day', 'hour', 'minute'].indexOf(type || '') !== -1;
    return (_jsxs("div", { className: "aio-filter-row", children: [_jsx(AISelect, { options: columns, value: columnId, option: { text: (column) => column.text, value: (column) => column.id }, onChange: (columnId) => changeFilter(index, Object.assign(Object.assign({}, filterItem), { columnId, type: getColumnById(columnId).type })), popover: { fitHorizontal: true } }), _jsx(AISelect, { options: operators, value: operator, option: { text: (operator) => trans(operator), value: (operator) => operator }, onChange: (operator) => changeFilter(index, Object.assign(Object.assign({}, filterItem), { operator })), popover: { fitHorizontal: true } }), type === 'text' && _jsx(AIText, { value: value, onChange: (value) => changeFilter(index, Object.assign(Object.assign({}, filterItem), { value })) }), type === 'number' && _jsx(AINumber, { value: value, onChange: (value) => changeFilter(index, Object.assign(Object.assign({}, filterItem), { value })) }), isTime && _jsx(TimeInput, { filterItem: filterItem, index: index }), _jsx("div", { className: "aio-filter-icon-button", onClick: () => removeFilter(filterItem), children: _jsx(FilterRemoveIcon, {}) })] }));
};
const TimeInput = ({ filterItem, index }) => {
    const { changeFilter, fa } = useFilterContext();
    const [unit] = useState(getUnit);
    function getUnit() {
        const res = { year: true, month: true };
        if (filterItem.type !== 'month') {
            res.day = true;
            if (filterItem.type !== 'day') {
                res.hour = true;
                if (filterItem.type !== 'hour') {
                    res.minute = true;
                }
            }
        }
        return res;
    }
    const DATE = new AIODate();
    return (_jsx(AITime, { jalali: !!fa, unit: unit, value: filterItem.value, onChange: (value) => changeFilter(index, Object.assign(Object.assign({}, filterItem), { value: DATE.getTime(value) })) }));
};
const FilterSaveIcon = () => new UT.GetSvg().getIcon('mdiSaveContent', 0.8);
const FilterSavesIcon = () => new UT.GetSvg().getIcon('mdiListBox', 0.8);
const FilterRemoveIcon = () => new UT.GetSvg().getIcon('mdiClose', 0.8);
const FilterActiveIcon = () => new UT.GetSvg().getIcon('mdiCheckBold', 0.8);
const FilterAddIcon = () => new UT.GetSvg().getIcon('mdiPlusThick', 0.7);
export const usePaging = (p) => {
    const timeoutRef = useRef();
    const startRef = useRef();
    const endRef = useRef();
    const pagesRef = useRef();
    const getPaging = (paging) => {
        return paging ? fix(paging) : undefined;
    };
    function fix(paging) {
        if (typeof p.onChange !== 'function') {
            alert('aio-table error => in type table you set paging but forget to set onChangePaging function prop to aio input');
            return { number: 0, size: 0 };
        }
        let { number, size = 20, length = 0, sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100], serverSide } = paging;
        if (!serverSide) {
            length = p.rows.length;
        }
        if (sizes.indexOf(size) === -1) {
            size = sizes[0];
        }
        let pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        let start = number - 3, end = number + 3;
        startRef.current = start;
        endRef.current = end;
        pagesRef.current = pages;
        return Object.assign(Object.assign({}, paging), { length, number, size, sizes });
    }
    const changePaging = (obj) => {
        const paging = getPaging(p.paging);
        if (!paging) {
            return;
        }
        let newPaging = fix(Object.assign(Object.assign({}, paging), obj));
        if (p.onChange) {
            if (newPaging.serverSide) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    //be khatere fahme payine typescript majbooram dobare in shart ro bezanam
                    if (p.onChange) {
                        p.onChange(newPaging);
                    }
                }, 800);
            }
            else {
                p.onChange(newPaging);
            }
        }
    };
    const getPagedRows = (rows) => {
        const paging = getPaging(p.paging);
        if (!paging || paging.serverSide) {
            return rows;
        }
        const { size, number } = paging;
        return rows.slice((number - 1) * size, number * size);
    };
    function changeSizeButton(sizes, size) {
        if (!sizes.length) {
            return null;
        }
        return (_jsx(AISelect, { attrs: { className: 'aio-paging-button aio-paging-size' }, value: size, options: sizes, option: { text: 'option', value: 'option' }, justify: true, onChange: (value) => changePaging({ size: value }), popover: { fitHorizontal: true } }));
    }
    const render = () => {
        const paging = getPaging(p.paging);
        if (!paging) {
            return null;
        }
        if (!p.rows.length) {
            return null;
        }
        let { number, size, sizes } = paging;
        let buttons = [];
        let isFirst = true;
        for (let i = startRef.current; i <= endRef.current; i++) {
            if (i < 1 || i > pagesRef.current) {
                buttons.push(_jsx("button", { className: 'aio-paging-button aio-paging-button-hidden', children: i }, i));
            }
            else {
                let index;
                if (isFirst) {
                    index = 1;
                    isFirst = false;
                }
                else if (i === Math.min(endRef.current, pagesRef.current)) {
                    index = pagesRef.current;
                }
                else {
                    index = i;
                }
                buttons.push(_jsx("button", { className: 'aio-paging-button' + (index === number ? ' active' : ''), onClick: () => changePaging({ number: index }), children: index }, index));
            }
        }
        return (_jsxs("div", { className: 'aio-paging', children: [buttons, changeSizeButton(sizes || [], size)] }));
    };
    return { render, getPagedRows, changePaging };
};
export const useSort = (p) => {
    let [sorts, setSorts] = useState(p.sorts);
    const getIconRef = useRef(new GetSvg().getIcon);
    const isInitSortExecutedRef = useRef(false);
    const getSortedRows = (rows) => {
        if (isInitSortExecutedRef.current) {
            return rows;
        }
        if (p.onChangeSort) {
            return rows;
        }
        let activeSorts = sorts.filter((sort) => sort.active !== false);
        if (!activeSorts.length || !rows.length) {
            return rows;
        }
        isInitSortExecutedRef.current = true;
        let sortedRows = sortRows(rows, activeSorts);
        if (p.onChangeRows) {
            p.onChangeRows(sortedRows);
        }
        return sortedRows;
    };
    const sortRows = (rows, sorts) => {
        if (!rows) {
            return [];
        }
        if (!sorts || !sorts.length) {
            return rows;
        }
        return rows.sort((a, b) => {
            for (let i = 0; i < sorts.length; i++) {
                let { dir, getValue } = sorts[i];
                if (!getValue) {
                    return 0;
                }
                let aValue = getValue(a), bValue = getValue(b);
                if (aValue < bValue) {
                    return -1 * (dir === 'dec' ? -1 : 1);
                }
                if (aValue > bValue) {
                    return 1 * (dir === 'dec' ? -1 : 1);
                }
                if (i === sorts.length - 1) {
                    return 0;
                }
            }
            return 0;
        });
    };
    const changeSort = (sortId, changeObject) => {
        let newSorts = sorts.map((sort) => {
            if (sort.sortId === sortId) {
                let newSort = Object.assign(Object.assign({}, sort), changeObject);
                return newSort;
            }
            return sort;
        });
        changeSorts(newSorts);
    };
    const changeSorts = (sorts) => __awaiter(void 0, void 0, void 0, function* () {
        if (p.onChangeSort) {
            let res = yield p.onChangeSort(sorts);
            if (res !== false) {
                setSorts(sorts);
            }
        }
        else {
            setSorts(sorts);
            let activeSorts = sorts.filter((sort) => sort.active !== false);
            if (activeSorts.length && !!p.onChangeRows) {
                p.onChangeRows(sortRows(p.rows, activeSorts));
            }
        }
    });
    const renderSortArrow = (option) => {
        let { dir = 'dec', sortId } = option;
        return (_jsx("div", { onClick: (e) => {
                e.stopPropagation();
                if (!sortId) {
                    return;
                }
                changeSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' });
            }, children: getIconRef.current(dir === 'dec' ? 'mdiArrowDown' : 'mdiArrowUp', 0.8) }));
    };
    const renderSortButton = (limitTo) => {
        if (!sorts.length) {
            return null;
        }
        return (_jsx(AISelect, { caret: false, options: sorts, option: {
                text: (option) => option.title, checked: (option) => !!option.active, close: () => false, value: (option) => option.sortId,
                after: (option) => renderSortArrow(option),
                onClick: (option) => changeSort(option.sortId, { active: !option.active })
            }, popover: {
                header: { title: 'Sort', onClose: false },
                setAttrs: (key) => { if (key === 'header') {
                    return { className: 'aio-sort-header' };
                } },
                limitTo: limitTo || '.aio-table'
            }, attrs: { className: 'aio-sort-button' }, text: getIconRef.current('mdiSort', 0.7), onSwap: (newSorts, from, to) => changeSorts(newSorts) }, 'sortbutton'));
    };
    return { sorts, setSorts, renderSortButton, getSortedRows, changeSort, changeSorts };
};
export function DragList({ data, onChange, renderItem, listAttrs }) {
    const [internalData, setInternalData] = useState(data);
    const containerRef = useRef(null);
    const { getDragAttrs, getDropAttrs } = UT.useDrag((drag, drop, reOrder) => {
        const fromIndex = drag.index;
        const toIndex = drop.index;
        const updated = reOrder(internalData, fromIndex, toIndex);
        setInternalData(updated);
        onChange(updated);
    });
    return (_jsx("div", Object.assign({}, listAttrs, { ref: containerRef, children: internalData.map((item, index) => {
            const dragAttrs = getDragAttrs({ index });
            const dropAttrs = getDropAttrs({ index });
            const { inner, attrs } = renderItem(item, index);
            const Attrs = Object.assign(Object.assign(Object.assign({}, attrs), dragAttrs), dropAttrs);
            return (_jsx("div", Object.assign({}, Attrs, { children: inner }), index));
        }) })));
}
export const Signature = ({ attrs = {}, onSave }) => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineCap = 'round';
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#000';
            ctxRef.current = ctx;
        }
    }, []);
    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
            const t = e.touches[0];
            return { x: t.clientX - rect.left, y: t.clientY - rect.top };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const startDraw = (e) => {
        var _a, _b;
        e.preventDefault();
        const pos = getPos(e.nativeEvent);
        (_a = ctxRef.current) === null || _a === void 0 ? void 0 : _a.beginPath();
        (_b = ctxRef.current) === null || _b === void 0 ? void 0 : _b.moveTo(pos.x, pos.y);
        setDrawing(true);
    };
    const draw = (e) => {
        var _a, _b;
        if (!drawing)
            return;
        const pos = getPos(e.nativeEvent);
        (_a = ctxRef.current) === null || _a === void 0 ? void 0 : _a.lineTo(pos.x, pos.y);
        (_b = ctxRef.current) === null || _b === void 0 ? void 0 : _b.stroke();
    };
    const endDraw = () => {
        var _a;
        setDrawing(false);
        (_a = ctxRef.current) === null || _a === void 0 ? void 0 : _a.closePath();
    };
    const clear = () => {
        var _a;
        const canvas = canvasRef.current;
        (_a = ctxRef.current) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, canvas.width, canvas.height);
    };
    const save = () => {
        const canvas = canvasRef.current;
        canvas.toBlob((blob) => {
            if (blob && onSave) {
                const file = new File([blob], 'signature.png', { type: 'image/png' });
                onSave(file);
            }
        }, 'image/png');
    };
    const Attrs = UT.AddToAttrs(attrs, { className: 'ai-signature' });
    return (_jsxs("div", Object.assign({}, Attrs, { children: [_jsx("canvas", { ref: canvasRef, onMouseDown: startDraw, onMouseMove: draw, onMouseUp: endDraw, onMouseLeave: endDraw, onTouchStart: startDraw, onTouchMove: draw, onTouchEnd: endDraw }), _jsxs("div", { className: 'ai-signature-footer', children: [_jsx("button", { className: 'ai-signature-save', onClick: save, children: "\u0630\u062E\u06CC\u0631\u0647" }), _jsx("button", { className: 'ai-signature-clear', onClick: clear, children: "\u067E\u0627\u06A9 \u06A9\u0631\u062F\u0646" })] })] })));
};
