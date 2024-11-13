import * as ReactDOMServer from 'react-dom/server';
import $ from 'jquery';
import { ReactNode } from 'react';

type I_dateObject = { year?: number, month?: number, day?: number, hour?: number, minute?: number };
export type I_Date = string | number | Date | I_dateObject | number[];
export type I_point = number[]
export type I_line = [I_point, I_point]
export type I_dline = [number, number, number]//x,y,dip
export type I_dip = number
export type I_arc = { x: number, y: number, r: number, slice?: number[] }
export type I_rect = [I_point, I_point]
export function HasClass(target: any, className: string) {
    return target.hasClass(className) || !!target.parents(`.${className}`).length
}
export async function DownloadFile(file: any) {
    let name = file.name;
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const url = corsProxy + (file.url || GetFileUrl(file));
    fetch(url)
        .then(resp => resp.blob())
        .then(blob => {
            let url = GetFileUrl(blob);
            let a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(() => alert('oh no!'));
}
export function GetFileUrl(file: any) {
    return window.URL.createObjectURL(file)
}
export async function Stall(stallTime: number = 3000) {
    await new Promise(resolve => setTimeout(resolve, stallTime));
}
export function FileToBase64(file: any, callback: (result: any) => void) {
    const fileReader = new FileReader();
    fileReader.onload = () => callback(fileReader.result);
    fileReader.readAsDataURL(file);
}
export function GetPrecisionCount(number: number) {
    // Convert the number to a string
    number = number || 0;
    const numberString = number.toString();
    const decimalIndex = numberString.indexOf('.');
    if (decimalIndex === -1) { return 0; }
    return numberString.length - decimalIndex - 1;
}
export function HandleBackButton(callback: () => void = () => { }) {
    window.history.pushState({}, '')
    window.history.pushState({}, '')
    window.onpopstate = function (event) {
        window.history.pushState({}, '');
        callback()
    };
}
export function SortArray(arr: any[], sorts: { getValue: (v: any) => any, inc?: boolean }[]) {
    return arr.slice().sort((a, b) => {
        for (const sort of sorts) {
            const valueA = sort.getValue(a);
            const valueB = sort.getValue(b);         
            const comparison = sort.inc !== false ? valueA - valueB : valueB - valueA;
            if (comparison !== 0) {return comparison;}
        }
        return 0;
    });
}
export function ParseString(str: string): any {
    // Check if the string starts and ends with a quote character
    try {
        if (str.startsWith("{") || str.startsWith('[')) { return JSON.parse(str); }
        else if ((str.startsWith("'") && str.endsWith("'")) || (str.startsWith('"') && str.endsWith('"'))) { return str.slice(1, -1); }
        else { let res = parseFloat(str); return isNaN(res) ? str : res }
    }
    catch { return str }
}
export function ReOrder(data: any[], fromIndex: number, toIndex: number) {
    let from = data[fromIndex];
    let newData = data.filter((o, i) => i !== fromIndex);
    newData.splice(toIndex, 0, from)
    return newData;
}
export class DragClass {
    over: (e: any) => void;
    dragData: any;
    getDragAttrs: (dragData: any) => any;
    getDropAttrs: (dropData: any) => any;
    reOrder: (data: any[], fromIndex: number, toIndex: number) => any[];
    constructor(p: { callback: (dragData: any, dropData: any) => void }) {
        const { callback } = p;
        this.reOrder = (data, fromIndex, toIndex) => ReOrder(data, fromIndex, toIndex)
        this.over = (e) => { e.preventDefault(); }
        this.getDragAttrs = (dragData) => {
            return {
                onDragStart: () => this.dragData = dragData,
                onDragOver: this.over,
                draggable: true
            }
        }
        this.getDropAttrs = (dropData) => {
            return {
                onDragOver: (e: any) => e.preventDefault(),
                onDrop: (e: any) => callback(this.dragData, dropData)
            }
        }
    }
}
export function GetClient(e: any): { x: number, y: number } { return 'ontouchstart' in document.documentElement && e.changedTouches ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY } }
export function ExportToExcel(rows: any[], config: any = {}) {
    let { promptText = 'Inter Excel File Name' } = config;
    let o = {
        fixPersianAndArabicNumbers(str: string): string {
            if (typeof str !== 'string') { return str }
            let persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
                arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
            let i: number;
            for (i = 0; i < 10; i++) { str = str.replace(persianNumbers[i], i.toString()).replace(arabicNumbers[i], i.toString()); }
            return str;
        },
        getJSON(rows: any[]) {
            let result = [];
            for (let i = 0; i < rows.length; i++) {
                let json = rows[i], fixedJson: any = {};
                for (let prop in json) { fixedJson[prop] = this.fixPersianAndArabicNumbers(json[prop]) }
                result.push(fixedJson);
            }
            return result;
        },
        export() {
            let name = window.prompt(promptText);
            if (!name || name === null || !name.length) { return };
            var data = this.getJSON(rows);
            var arrData = typeof data != "object" ? JSON.parse(data) : data;
            var CSV = ""; CSV += '\r\n\n';
            if (true) {
                let row = "";
                for (let index in arrData[0]) { row += index + ","; }
                row = row.slice(0, -1); CSV += row + "\r\n";
            }
            for (var i = 0; i < arrData.length; i++) {
                let row = "";
                for (let index in arrData[i]) { row += '"' + arrData[i][index] + '",'; }
                row.slice(0, row.length - 1); CSV += row + "\r\n";
            }
            if (CSV === "") { alert("Invalid data"); return; }
            var fileName = name.replace(/ /g, "_");
            var universalBOM = "\uFEFF";
            var uri = "data:text/csv;charset=utf-8," + encodeURIComponent(universalBOM + CSV);
            let link: any = document.createElement("a");
            link.href = uri;
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    return o.export();
}
export function SplitNumber(price: number, count?: number, splitter?: string): string {
    if (!price) { return '' }
    count = count || 3;
    splitter = splitter || ',';
    let str = price.toString()
    let dotIndex = str.indexOf('.');
    if (dotIndex !== -1) {
        str = str.slice(0, dotIndex)
    }
    let res = ''
    let index = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        res = str[i] + res;
        if (index === count - 1) {
            index = 0;
            if (i > 0) { res = splitter + res; }
        }
        else { index++ }
    }
    return res
}
export function EventHandler(selector: string, event: 'mousedown' | 'mousemove' | 'mouseup' | 'click', action: any, type?: 'bind' | 'unbind') {
    type = type || 'bind';
    var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend", click: 'click' };
    let touch = 'ontouchstart' in document.documentElement
    let fixedEvent = touch ? me[event] : event;
    var element: any = typeof selector === "string" ? (selector === "window" ? $(window) : $(selector)) : selector;
    element.unbind(fixedEvent, action);
    if (type === 'bind') { element.bind(fixedEvent, action) }
}
export function getValueByStep(p: { value: number, start: number, step: number, end: number }) {
    let { value, start, step, end } = p;
    let res = Math.round((value - start) / step) * step + start;
    if (res < start) { res = start }
    if (res > end) { res = end }
    return res;
}
export function GetPercentByValue(start:number,end:number,value:number):number{return ((100 * value) / (end - start)) + start}
export function URLToJSON(url: string): { [key: string]: any } {
    try { return JSON.parse(`{"${decodeURI(url.split('?')[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`) }
    catch { return {} }
}
export function FileSize(number: number) {
    if (number < 1024) {
        return `${number} bytes`;
    } else if (number >= 1024 && number < 1048576) {
        return `${(number / 1024).toFixed(1)} KB`;
    } else if (number >= 1048576) {
        return `${(number / 1048576).toFixed(1)} MB`;
    }
}
function IsFileTypeValid(file: any): boolean {
    const fileTypes = [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/svg+xml",
        "image/tiff",
        "image/webp",
        "image/x-icon",
    ];
    return fileTypes.includes(file.type);
}
export function FilePreview(file: any, attrs?: any): React.ReactNode {
    if (!IsFileTypeValid(file)) { return null }
    let url: string = GetFileUrl(file);
    return <img src={url} alt={file.name} title={file.name} objectFit='cover' {...attrs} />
}
export function JSXToHTML(jsx: any): string {
    return ReactDOMServer.renderToStaticMarkup(jsx)
}
export async function Copy(text: any) {
    window.navigator.clipboard.writeText(text);
}
export function IsTouch(): boolean {
    return "ontouchstart" in document.documentElement
}
export async function Paste() {
    try {
        return window.navigator.clipboard.read();
    }
    catch (err: any) {
        console.log(err.message)
    }
}
export function Search(items: any[], searchValue: string, getValue: (item: any, index: number) => any = (o) => o): any[] {
    if (!searchValue) { return items }
    function isMatch(keys: string[], value: string) {
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (value.indexOf(key) === -1) { return false }
        }
        return true
    }
    let keys = searchValue.split(' ');
    return items.filter((o, i) => isMatch(keys, getValue(o, i)))
}
export function GenerateComponsition(p: { level?: number, length?: number, childsField?: string, fields: any }) {
    let { level: maxLevel = 4, length = 4, childsField = 'childs', fields = {} } = p;
    let $$ = {
        generate(level = 0, index = '') {
            if (level >= maxLevel) { return [] }
            let res = []
            for (let i = 0; i < length; i++) {
                let newIndex = index + '-' + i;
                let newItem: any = {
                    id: 'aa' + Math.round(Math.random() * 10000),
                    [childsField]: $$.generate(level + 1, newIndex)
                }
                for (let prop in fields) { newItem[prop] = fields[prop] + index }
                res.push(newItem)
            }
            return res
        }
    }
    return $$.generate()
}
export function CalculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
export function getEventAttrs(eventType: 'onMouseDown' | 'onMouseMove' | 'onMouseUp', callback: (e: any) => void) {
    let touch = IsTouch()
    let fixedEvent: string;
    if (touch) { fixedEvent = { 'onMouseDown': 'onTouchStart', 'onMouseMove': 'onTouchMove', 'onMouseUp': 'onTouchEnd' }[eventType]; }
    else { fixedEvent = eventType }
    return { [fixedEvent]: callback }
}
function toRadians(degree: number) {
    return degree * (Math.PI / 180);
}
export function AddToAttrs(attrs: any, p: any) {
    attrs = attrs || {};
    let { style } = p;
    let attrClassName = attrs.className ? attrs.className.split(' ') : [];
    let className = p.className ? (Array.isArray(p.className) ? p.className : p.className.split(' ')) : [];
    let classNames = [...attrClassName, ...className.filter((o: any) => !!o)];
    let newClassName = classNames.length ? classNames.join(' ') : undefined
    let newStyle = { ...attrs.style, ...style };
    return { ...attrs, className: newClassName, style: newStyle, ...p.attrs }
}
// export function JsonValidator(json:any, schema:any) {
//     let $$ = {
//         getType(v) {
//             if (['string', 'number', 'boolean', 'array', 'object', 'null', 'undefined'].indexOf(v) !== -1) { return v }
//             if (Array.isArray(v)) { return 'array' }
//             return typeof v
//         },
//         getSchemaTypes(s) {
//             if (typeof s === 'string' && s.indexOf('|') !== -1) { return s.split('|') }
//             return [s]
//         },
//         compaire(data, schema, propName) {
//             const schemaTypes = this.getSchemaTypes(schema);
//             let type = this.getType(data);
//             let isMatch = false;
//             for (let i = 0; i < schemaTypes.length; i++) {
//                 let st = schemaTypes[i];
//                 if (['string', 'number', 'boolean', 'array', 'object', 'null', 'undefined'].indexOf(st) !== -1) {
//                     if (type === st) { isMatch = true }
//                 }
//                 else if (typeof st === 'object') {
//                     if (type === this.getType(st)) { isMatch = true }
//                 }
//                 else {
//                     if (data === st) { isMatch = true }
//                 }
//             }
//             if (!isMatch) { return `${propName} must be ${schemaTypes.join(' or ')}` }
//         },
//         validate(data, schema, propName = 'data') {
//             let compaireResult = this.compaire(data, schema, propName)
//             if (compaireResult) { return compaireResult }
//             if (typeof schema === 'object') {
//                 if (Array.isArray(data)) {
//                     for (let i = 0; i < data.length; i++) {
//                         let d = data[i];
//                         let s = schema[i] || schema[0];
//                         let res = this.validate(d, s, `${propName}[${i}]`);
//                         if (res) { return res }
//                     }
//                 }
//                 else {
//                     for (let prop in data) {
//                         let d = data[prop];
//                         let s = schema[prop];
//                         let res = this.validate(d, s, `${propName}.${prop}`);
//                         if (res) { return res }
//                     }
//                     for (let prop in schema) {
//                         let d = data[prop];
//                         let s = schema[prop];
//                         let res = this.validate(d, s, `${propName}.${prop}`);
//                         if (res) { return res }
//                     }
//                 }
//             }
//         }
//     }
//     return $$.validate(json, schema)
// }
export type I_Swip_mousePosition = { x: number, y: number, xp: number, yp: number, clientX: number, clientY: number, centerAngle: number };
export type I_Swip_change = {
    x: number, y: number,
    dx: number, dy: number,
    dist: number,
    angle: number,
    deltaCenterAngle: number,
}
export type I_Swip_parameter = {
    change: I_Swip_change, mousePosition: I_Swip_mousePosition, domLimit: I_Swip_domLimit, parentLimit: I_Swip_domLimit, event: any, selectRect?: I_Swip_selectRect,
    isInSelectRect?: I_Swip_isInSelectRect
}
type I_Swip_selectRect_config = { color?: string, enable: () => boolean }
export type I_Swip = {
    dom: () => any,
    parent?: () => any,
    onClick?: (p: I_Swip_parameter) => void,
    page?: () => any,
    start?: (p: I_Swip_parameter) => number[],
    move?: (p: I_Swip_parameter) => void,
    end?: (p: I_Swip_parameter) => void,
    selectRect?: I_Swip_selectRect_config,
    speedX?: number,
    speedY?: number,
    stepX?: number | boolean,
    stepY?: number | boolean,
    reverseY?: boolean,
    reverseX?: boolean,
    minY?: number,
    maxY?: number,
    minX?: number,
    maxX?: number,
    insideX?: boolean,
    insideY?: boolean
}
export type I_Swip_domLimit = {
    width: number, height: number, left: number, top: number, centerX: number, centerY: number, right: number, bottom: number
}
type I_Swip_isInSelectRect = (x: number, y: number) => boolean
type I_Swip_getIsInSelectrect = (selectRect: I_Swip_selectRect) => I_Swip_isInSelectRect
export type I_Swip_selectRect = { left: number, top: number, width: number, height: number };
export type I_Swip_tempSelectRect = { left: number, top: number };
export class Swip {
    p: I_Swip;
    geo: Geo;
    timeout: any;
    count: number;
    domLimit: I_Swip_domLimit;
    parentLimit: I_Swip_domLimit;
    getDom: () => any;
    getParent: () => any;
    init: () => void;
    dx: number;
    dy: number;
    cx: number;
    cy: number;
    dist: number;
    so: { client?: { x: number, y: number }, x?: number, y?: number, sr?: I_Swip_selectRect, tsr?: I_Swip_tempSelectRect };
    getPercentByValue: (value: number, start: number, end: number) => number;
    getMousePosition: (e: any) => I_Swip_mousePosition
    click: (e: any) => void;
    mouseDown: (e: any) => void;
    mouseMove: (e: any) => void;
    mouseUp: (e: any) => void;
    getDOMLimit: (type: 'dom' | 'parent') => I_Swip_domLimit;
    change: I_Swip_change;
    getPage: () => any;
    isMoving: boolean;
    centerAngle: number;
    defaultLimit: I_Swip_domLimit;
    addSelectRect: (x: number, y: number) => void;
    setSelectRect: (width: number, height: number) => void;
    removeSelectRect: () => void;
    selectRect?: I_Swip_selectRect_config;
    getIsInSelectRect: I_Swip_getIsInSelectrect;
    defaultChange: I_Swip_change;
    constructor(p: I_Swip) {
        let { selectRect } = p;
        if (selectRect) {
            let { color = '#96a9bc' } = selectRect;
            this.selectRect = { ...selectRect, color };
        }
        this.defaultChange = { x: 0, y: 0, dx: 0, dy: 0, dist: 0, angle: 0, deltaCenterAngle: 0 }
        this.defaultLimit = { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0, centerX: 0, centerY: 0 }
        this.domLimit = this.defaultLimit;
        this.parentLimit = this.defaultLimit;
        this.change = { x: 0, y: 0, dx: 0, dy: 0, dist: 0, angle: 0, deltaCenterAngle: 0 }
        this.addSelectRect = () => { }
        this.setSelectRect = () => { }
        this.removeSelectRect = () => { }
        this.so = {}
        this.p = p;
        this.geo = new Geo();
        this.timeout = undefined;
        this.count = 0;
        this.getDom = () => p.dom();
        this.getParent = () => p.parent ? p.parent() : undefined;
        this.dx = 0;
        this.dy = 0;
        this.cx = 0;
        this.cy = 0;
        this.dist = 0;
        this.isMoving = false;
        this.centerAngle = 0;
        this.init = () => {
            this.count++;
            if (this.count > 10) { clearTimeout(this.timeout); return }
            let res = this.getDom();
            if (!res.length) { this.timeout = setTimeout(() => this.init(), 400) }
            else {
                clearTimeout(this.timeout);
                EventHandler(this.getDom(), 'mousedown', $.proxy(this.mouseDown, this));
                if (p.onClick) {
                    EventHandler(this.getDom(), 'click', $.proxy(this.click, this));
                }
            }
        }
        this.getPercentByValue = (value, start, end) => { return 100 * (value - start) / (end - start) }
        this.getPage = () => {
            let { page } = this.p;
            return page ? page() : $(window);
        }
        this.getMousePosition = (e: any) => {
            this.domLimit = this.getDOMLimit('dom');
            let page = this.getPage();
            let st = page.scrollTop();
            let sl = page.scrollLeft();
            let client = GetClient(e), x = client.x - this.domLimit.left + sl, y = client.y - this.domLimit.top + st;
            let xp = this.getPercentByValue(x, 0, this.domLimit.width), yp = this.getPercentByValue(y, 0, this.domLimit.height);
            let centerAngle = this.geo.getAngle([
                [this.domLimit.centerX, this.domLimit.centerY],
                [client.x, client.y]
            ])
            let res: I_Swip_mousePosition = { xp, yp, clientX: client.x, clientY: client.y, x, y, centerAngle }
            return res;
        }
        this.getDOMLimit = (type): I_Swip_domLimit => {
            let dom = type === 'dom' ? this.getDom() : this.getParent();
            let offset = dom.offset();
            let DOM = {
                width: dom.width(),
                height: dom.height(),
                left: offset.left,
                top: offset.top,
                centerX: 0,
                centerY: 0
            };
            return {
                ...DOM,
                centerX: DOM.left + DOM.width / 2,
                centerY: DOM.top + DOM.height / 2,
                right: DOM.left + DOM.width,
                bottom: DOM.top + DOM.height
            }
        }
        this.click = (e) => {
            //jeloye click bad az drag ro bayad begirim choon click call mishe 
            if (this.isMoving) { return }
            this.domLimit = this.getDOMLimit('dom');
            this.parentLimit = p.parent ? this.getDOMLimit('parent') : this.defaultLimit;
            let mousePosition = this.getMousePosition(e)
            let clickParams: I_Swip_parameter = {
                mousePosition, domLimit: this.domLimit, parentLimit: this.parentLimit, event: e,
                change: this.defaultChange
            }
            if (p.onClick) { p.onClick(clickParams) }
        }
        this.addSelectRect = (left: number, top: number) => {
            if (!this.selectRect || !this.selectRect.enable()) { return }
            let { color } = this.selectRect;
            let dom = this.getDom();
            this.so.tsr = { left, top };
            this.removeSelectRect();
            dom.append(`<div class="swip-select-rect" style="border:1px dashed ${color};background:${color + '30'};left:${left}px;top:${top}px;position:absolute;width:0;height:0"></div>`)
        }
        this.setSelectRect = (width: number, height: number) => {
            if (!this.selectRect || !this.selectRect.enable()) { return }
            let dom = this.getDom();
            let SR = dom.find('.swip-select-rect');
            let { tsr = { left: 0, top: 0 } } = this.so || {};
            let left = tsr.left;
            let top = tsr.top;
            if (width < 0) {
                left = left + width;
                width = Math.abs(width)
            }
            if (height < 0) {
                top = top + height;
                height = Math.abs(height)
            }
            let newSelectRect: I_Swip_selectRect = { left, top, width, height }
            this.so.sr = newSelectRect;
            SR.css(newSelectRect)
        }
        this.removeSelectRect = () => {
            if (!this.selectRect || !this.selectRect.enable()) { return }
            let dom = this.getDom();
            let selectRect = dom.find('.swip-select-rect');
            selectRect.remove();
        }
        this.mouseDown = (e) => {
            e.stopPropagation();
            this.isMoving = false;
            this.domLimit = this.getDOMLimit('dom');
            this.parentLimit = p.parent ? this.getDOMLimit('parent') : this.defaultLimit;
            let mousePosition = this.getMousePosition(e)
            this.centerAngle = mousePosition.centerAngle;
            this.cx = mousePosition.clientX;
            this.cy = mousePosition.clientY;
            this.so = {
                client: { x: mousePosition.clientX, y: mousePosition.clientY }
            };
            this.addSelectRect(mousePosition.x, mousePosition.y);
            let startParams: I_Swip_parameter = { mousePosition, domLimit: this.domLimit, parentLimit: this.parentLimit, event: e, change: this.defaultChange }
            let res = (p.start || (() => [0, 0]))(startParams);
            if (!Array.isArray(res)) { return; }
            let x = res[0], y = res[1];
            this.so = { ...this.so, x, y }
            EventHandler('window', 'mousemove', $.proxy(this.mouseMove, this));
            EventHandler('window', 'mouseup', $.proxy(this.mouseUp, this))
        }
        this.mouseMove = (e: any) => {
            e.stopPropagation();
            let { speedX = 1, speedY = 1, stepX = 1, stepY = 1, reverseX, reverseY, insideX, insideY } = this.p;
            let mousePosition = this.getMousePosition(e), client = GetClient(e);
            let dx = client.x - this.cx, dy = client.y - this.cy;
            dx = Math.round(dx * speedX) * (reverseX ? -1 : 1)
            dy = Math.round(dy * speedY) * (reverseY ? -1 : 1)
            let deltaCenterAngle = mousePosition.centerAngle - this.centerAngle;
            //if(deltaCenterAngle < 0){deltaCenterAngle += 360}
            if (typeof stepX === 'number') {
                dx = Math.round(dx / stepX) * stepX;
            }
            if (typeof stepY === 'number') {
                dy = Math.round(dy / stepY) * stepY;
            }
            if (dx === this.dx && dy === this.dy) { return }
            this.isMoving = true;
            this.dx = dx; this.dy = dy;
            this.dist = Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
            let angle = this.geo.getAngle([[this.cx, this.cy], [client.x, client.y]])
            this.setSelectRect(dx, dy);
            let x: number = 0, y: number = 0;
            if (this.so.x !== undefined && this.so.y !== undefined) {
                x = this.so.x + dx; y = this.so.y + dy;
                let { minX, minY, maxX, maxY } = this.p;
                if (minX !== undefined && x < minX) { x = minX }
                if (maxX !== undefined && x > maxX) { x = maxX }
                if (minY !== undefined && y < minY) { y = minY }
                if (maxY !== undefined && y > maxY) { y = maxY }
            }
            if (stepX === true) {
                x = Math.round(x / this.domLimit.width) * this.domLimit.width;
            }
            if (stepY === true) {
                y = Math.round(y / this.domLimit.height) * this.domLimit.height;
            }
            if (insideX) {
                if (this.parentLimit) {
                    if (x > this.parentLimit.width - this.domLimit.width) { x = this.parentLimit.width - this.domLimit.width }
                    if (x < 0) { x = 0 }
                }
                else {
                    alert('Swip error => you set insideX prop but missing parent props')
                }
            }
            if (insideY) {
                if (this.parentLimit) {
                    if (y > this.parentLimit.height - this.domLimit.height) { y = this.parentLimit.height - this.domLimit.height }
                    if (y < 0) { y = 0 }
                }
                else {
                    alert('Swip error => you set insideY prop but missing parent props')
                }
            }

            this.change = { x, y, dx, dy, dist: this.dist, angle, deltaCenterAngle }

            let p: I_Swip_parameter = {
                change: this.change,
                mousePosition,
                domLimit: this.domLimit,
                parentLimit: this.parentLimit,
                event: e,
                selectRect: this.so.sr,
                isInSelectRect: this.getIsInSelectRect(this.so.sr || { left: 0, top: 0, width: 0, height: 0 })

            }
            if (this.p.move) { this.p.move(p); }
        }
        this.getIsInSelectRect = (selectRect: I_Swip_selectRect) => {
            let { left, top, width, height } = selectRect;
            return (x: number, y: number) => {
                if (x < left) { return false }
                if (y < top) { return false }
                if (x > left + width) { return false }
                if (y > top + height) { return false }
                return true
            }
        }
        this.mouseUp = (e: any) => {
            e.stopPropagation();
            EventHandler('window', 'mousemove', this.mouseMove, 'unbind');
            EventHandler('window', 'mouseup', this.mouseUp, 'unbind');
            //chon click bad az mouseUp call mishe mouseUp isMoving ro zoodtar false mikone (pas nemitoone jeloye click bad az harekat ro begire), pas bayad in amal ba yek vaghfe anjam beshe
            //jeloye clicke bad az harekat ro migirim ta bad az drag kardan function click call nashe
            setTimeout(() => this.isMoving = false, 10);
            let mousePosition = this.getMousePosition(e);
            this.removeSelectRect();
            let p: I_Swip_parameter = {
                change: this.change,
                event: e,
                domLimit: this.domLimit,
                parentLimit: this.parentLimit,
                mousePosition,
                selectRect: this.so.sr,
                isInSelectRect: this.getIsInSelectRect(this.so.sr || { left: 0, top: 0, width: 0, height: 0 })
            }
            if (this.p.end) { this.p.end(p) }
        }
        this.init()
    }
}
export class AIODate {
    isMatch: (date: I_Date, matchers: string[]) => boolean;
    convertToArray: (date: I_Date, jalali?: boolean) => number[];
    isLess: (date1: I_Date, date2: I_Date) => boolean;
    isGreater: (date1: I_Date, date2: I_Date) => boolean;
    isEqual: (date1: I_Date, date2: I_Date) => boolean;
    isBetween: (date1: I_Date, dates: [I_Date, I_Date]) => boolean;
    compaire: (date1: I_Date, date2: I_Date) => 'less' | 'greater' | 'equal';
    getWeekDay: (date: I_Date) => { weekDay: string, index: number }
    isToday: (date: I_Date) => boolean;
    isJalali: (date: I_Date) => boolean;
    getWeekDays: (jalali?: boolean) => string[];
    toGregorian: (date: I_Date) => number[];
    toJalali: (date: I_Date) => number[];
    pattern: (date: I_Date, pattern: string, jalali?: boolean) => string;
    get2Digit: (n: number) => string;
    getMonths: (jalali?: boolean) => string[];
    getSplitter: (value: string) => string;
    getTime: (date: I_Date, jalali?: boolean) => number;
    getNextTime: (date: I_Date, offset: number, jalali?: boolean) => number[];
    getMonthDaysLength: (date: I_Date) => number;
    getYearDaysLength: (date: I_Date) => number;
    getDaysOfWeek: (date: I_Date, pattern?: string) => any[];
    getDatesBetween: (date: I_Date, otherDate: any, step?: number) => any[];
    getDelta: (date: I_Date, otherDate?: I_Date, unit?: 'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond') => { day: number, hour: number, minute: number, second: number, tenthsecond: number, miliseconds: number, type: 'remaining' | 'passed' | 'now' };
    convertMiliseconds: (miliseconds: number, unit?: 'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond') => { day: number, hour: number, minute: number, second: number, tenthsecond: number, miliseconds: number, type: 'remaining' | 'passed' | 'now' };
    getDaysOfMonth: (date: I_Date, pattern?: string) => any[];
    getLastDayOfMonth: (date: I_Date) => any[];
    getDateByPattern: (date: I_Date, pattern: string) => string;
    getToday: (jalali?: boolean) => number[];
    getDayIndex: (date: I_Date, unit: 'week' | 'year' | 'month') => number;
    getYesterday: (date: I_Date) => I_Date
    getTomarrow: (date: I_Date) => I_Date
    toMiliseconds: (p: { year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number }) => number
    getDateByDeltaMiliseconds: (date: I_Date, miliseconds: number) => number[]
    constructor() {
        this.toMiliseconds = (p) => {
            const { day = 0, hour = 0, minute = 0, second = 0 } = p;
            let res = 0;
            res += day * 24 * 60 * 60 * 1000;
            res += hour * 60 * 60 * 1000;
            res += minute * 60 * 1000;
            res += second * 1000;
            return res
        }
        this.isMatch = (date, matchers) => {
            date = this.convertToArray(date)
            for (let i = 0; i < matchers.length; i++) {
                let matcher = matchers[i], type, targets;
                try {
                    let a = matcher.split(',');
                    type = a[0];
                    targets = a.slice(1, a.length);
                }
                catch { return false }
                if (type === '<') { for (let i = 0; i < targets.length; i++) { if (this.isLess(date, targets[i])) { return true } } }
                else if (type === '>') { for (let i = 0; i < targets.length; i++) { if (this.isGreater(date, targets[i])) { return true } } }
                else if (type === '<=') { for (let i = 0; i < targets.length; i++) { if (this.isEqual(date, targets[i])) { return true } if (this.isLess(date, targets[i])) { return true } } }
                else if (type === '>=') { for (let i = 0; i < targets.length; i++) { if (this.isEqual(date, targets[i])) { return true } if (this.isGreater(date, targets[i])) { return true } } }
                else if (type === '=') { for (let i = 0; i < targets.length; i++) { if (this.isEqual(date, targets[i])) { return true } } }
                else if (type === '!=') { for (let i = 0; i < targets.length; i++) { if (!this.isEqual(date, targets[i])) { return true } } }
                else if (type === '<>') {
                    if (targets[0] && targets[1]) {
                        let start, end;
                        if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                        else { start = targets[1]; end = targets[0]; }
                        if (this.isGreater(date, start) && this.isLess(date, end)) { return true }
                    }
                }
                else if (type === '<=>') {
                    if (targets[0] && targets[1]) {
                        let start, end;
                        if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                        else { start = targets[1]; end = targets[0]; }
                        if (this.isGreater(date, start) && this.isLess(date, end)) { return true }
                        if (this.isEqual(date, start) || this.isEqual(date, end)) { return true }
                    }
                }
                else if (type === '!<>') {
                    if (targets[0] && targets[1]) {
                        let start, end;
                        if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                        else { start = targets[1]; end = targets[0]; }
                        if (!this.isGreater(date, start) || !this.isLess(date, end)) { return true }
                    }
                }
                else if (type === '!<=>') {
                    if (targets[0] && targets[1]) {
                        let start, end;
                        if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                        else { start = targets[1]; end = targets[0]; }
                        if (!this.isEqual(date, start) && !this.isEqual(date, end) && (this.isLess(date, start) || this.isGreater(date, end))) { return true }
                    }
                }
                else if (type === 'w') {
                    let w = this.getWeekDay(date).index;
                    for (let i = 0; i < targets.length; i++) { if (w === +targets[i]) { return true } }
                }
                else if (type === '!w') {
                    let w = this.getWeekDay(date).index;
                    for (let i = 0; i < targets.length; i++) { if (w !== +targets[i]) { return true } }
                }
            }
            return false
        }
        this.convertToArray = (date, jalali) => {
            if (!date) { return [] }
            let list;
            if (Array.isArray(date)) { list = [...date] }
            else if (typeof date === 'string') {
                if (date.indexOf("T") !== -1) {
                    //"2015-03-25T12:00:00Z"
                    let [d1, t1] = date.split("T");
                    let t2 = t1.split(".")[0];
                    let t3 = t2.split(':');
                    let d2 = d1.split('-');
                    list = [...d2.map((o) => +o), ...t3.map((o) => +o), 0]
                }
                else {
                    list = date.split(this.getSplitter(date)).map((o) => +o);
                }
            }
            else if (typeof date === 'number') {
                let d = new Date(date);
                let year = d.getFullYear();
                let month = d.getMonth() + 1;
                let day = d.getDate();
                let hour = d.getHours();
                let minute = d.getMinutes();
                let second = d.getSeconds();
                let miliseconds = d.getMilliseconds();
                let tenthsecond = Math.round(miliseconds / 100);
                list = [year, month, day, hour, minute, second, tenthsecond]
            }
            else if (typeof date === 'object') {
                if (typeof (date as Date).getMonth === 'function') {
                    let dateObject = date as Date;
                    let year = dateObject.getFullYear();
                    let month = dateObject.getMonth() + 1;
                    let day = dateObject.getDate();
                    let hour = dateObject.getHours();
                    let minute = dateObject.getMinutes();
                    let second = dateObject.getSeconds();
                    let miliseconds = dateObject.getMilliseconds();
                    let tenthsecond = Math.round(miliseconds / 100);
                    list = [year, month, day, hour, minute, second, tenthsecond]
                }
                else {
                    let today = this.getToday(jalali);
                    let dateObject = date as { year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number }
                    return [
                        dateObject.year === undefined ? today[0] : dateObject.year,
                        dateObject.month === undefined ? today[1] : dateObject.month,
                        dateObject.day === undefined ? today[2] : dateObject.day,
                        dateObject.hour === undefined ? today[3] : dateObject.hour,
                        dateObject.minute === undefined ? today[4] : dateObject.minute,
                        dateObject.second === undefined ? today[5] : dateObject.second,
                    ]
                }
            }
            else { return [] }
            if (jalali) {
                let [year, month, day] = this.toJalali([list[0], list[1], list[2]]);
                list[0] = year; list[1] = month; list[2] = day;
            }
            return list
        }
        this.compaire = (o1, o2) => {
            o1 = this.convertToArray(o1);
            o2 = this.convertToArray(o2);
            let compaireKey: 'equal' | 'less' | 'greater' = 'equal';
            for (let i = 0; i < o1.length; i++) {
                if (isNaN(o2[i])) { o2[i] = o1[i] }
                let a = o1[i];
                let b = o2[i] || 0;
                if (a < b) { compaireKey = 'less'; break; }
                if (a > b) { compaireKey = 'greater'; break; }
            }
            return compaireKey;
        }
        this.isLess = (o1, o2) => this.compaire(o1, o2) === 'less'
        this.isEqual = (o1, o2) => this.compaire(o1, o2) === 'equal'
        this.isGreater = (o1, o2) => this.compaire(o1, o2) === 'greater'
        this.isBetween = (o1, [o2, o3]) => this.compaire(o1, o2) === 'greater' && this.compaire(o1, o2) === 'less'
        this.isToday = (date) => this.isEqual(date, this.getToday(this.isJalali(date)))
        this.getDateByDeltaMiliseconds = (date: I_Date, miliseconds: number) => this.convertToArray(this.getTime(date) + miliseconds)
        this.getWeekDay = (date) => {
            let dateArray = this.convertToArray(date);
            let jalali = this.isJalali(dateArray);
            dateArray = this.toGregorian(date) as number[]
            let index = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).getDay();
            if (jalali) {
                index += 1;
                index = index % 7;
            }
            return { weekDay: this.getWeekDays(jalali)[index], index };
        }
        this.isJalali = (date) => { return this.convertToArray(date)[0] < 1700 ? true : false }
        this.getWeekDays = (jalali) => {
            return [
                ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
                ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
            ][jalali ? 0 : 1]
        }
        this.toGregorian = (date) => {
            if (!date) { return [] }
            let arr = this.convertToArray(date);
            let jalali = this.isJalali(arr);
            if (!jalali) { return arr }
            let [jy, jm, jd] = arr;
            var sal_a, gy, gm, gd, days;
            jy += 1595; days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
            gy = 400 * ~~(days / 146097); days %= 146097;
            if (days > 36524) { gy += 100 * ~~(--days / 36524); days %= 36524; if (days >= 365) days++; }
            gy += 4 * ~~(days / 1461); days %= 1461;
            if (days > 365) { gy += ~~((days - 1) / 365); days = (days - 1) % 365; }
            gd = days + 1;
            sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
            arr[0] = gy; arr[1] = gm; arr[2] = gd;
            return arr;
        }
        this.pattern = (date, pattern, jalali = this.isJalali(date)) => {
            date = this.convertToArray(date, jalali);
            let [year, month, day, hour, minute, second, tenthsecond] = date;
            pattern = pattern.replace('{year}', year.toString());
            if (typeof month === 'number') { pattern = pattern.replace('{month}', this.get2Digit(month)); }
            if (typeof day === 'number') { pattern = pattern.replace('{day}', this.get2Digit(day)); }
            if (typeof hour === 'number') { pattern = pattern.replace('{hour}', this.get2Digit(hour)); }
            if (typeof minute === 'number') { pattern = pattern.replace('{minute}', this.get2Digit(minute)); }
            if (typeof second === 'number') { pattern = pattern.replace('{second}', this.get2Digit(second)); }
            if (typeof tenthsecond === 'number') { pattern = pattern.replace('{tenthsecond}', this.get2Digit(tenthsecond)); }
            if (pattern.indexOf('{monthString}') !== -1) {
                pattern = pattern.replace('{monthString}', this.getMonths(jalali)[month - 1]);
            }
            if (pattern.indexOf('{weekDay}') !== -1) {
                let weekDays = this.getWeekDays(jalali);
                let { index } = this.getWeekDay(date);
                pattern = pattern.replace('{weekDay}', weekDays[index]);
            }
            return pattern
        }
        this.get2Digit = (n: number) => {
            let ns: string;
            try { ns = n.toString() }
            catch { return n.toString() }
            if (ns.length === 1) { ns = '0' + n }
            return ns
        }
        this.getMonths = (jalali) => {
            return [
                ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',],
                ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
            ][jalali ? 0 : 1]
        }
        this.toJalali = (date) => {
            let arr = this.convertToArray(date);
            let jalali = this.isJalali(arr);
            if (jalali) { return arr }
            let [gy, gm, gd] = arr;
            var g_d_m, jy, jm, jd, gy2, days;
            g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            gy2 = (gm > 2) ? (gy + 1) : gy;
            days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
            jy = -1595 + (33 * ~~(days / 12053)); days %= 12053; jy += 4 * ~~(days / 1461); days %= 1461;
            if (days > 365) { jy += ~~((days - 1) / 365); days = (days - 1) % 365; }
            if (days < 186) { jm = 1 + ~~(days / 31); jd = 1 + (days % 31); } else { jm = 7 + ~~((days - 186) / 30); jd = 1 + ((days - 186) % 30); }
            arr[0] = jy; arr[1] = jm; arr[2] = jd;
            return arr;
        }
        this.getSplitter = (value) => {
            let splitter = '/';
            for (let i = 0; i < value.length; i++) {
                if (isNaN(parseInt(value[i]))) { return value[i] }
            }
            return splitter;
        }
        this.getTime = (date, jalali = this.isJalali(date)) => {
            if (!date) { return 0 }
            if (typeof date === 'number') { return date }
            date = this.convertToArray(date);
            let [year, month = 1, day = 1, hour = 0, minute = 0, second = 0, tenthsecond = 0] = date;
            if (jalali) { date = this.toGregorian([year, month, day, hour, minute, second, tenthsecond]) }
            let time = new Date(date[0], date[1] - 1, date[2]).getTime()
            time += hour * 60 * 60 * 1000;
            time += minute * 60 * 1000;
            time += second * 1000;
            time += tenthsecond * 100;
            return time;
        }
        this.getNextTime = (date, offset, jalali = this.isJalali(date)) => {
            if (!offset) { return this.convertToArray(date) }
            let time: number = this.getTime(date, jalali);
            time += offset;
            let dateArray: number[] = this.convertToArray(time);
            if (jalali) {
                let [jy, jm, jd] = this.toJalali(dateArray);
                dateArray[0] = jy; dateArray[1] = jm; dateArray[2] = jd;
            }
            return dateArray;
        }
        this.getMonthDaysLength = (date) => {
            if (!date) { return 0 }
            let [year, month] = this.convertToArray(date);
            let jalali = this.isJalali([year, month]);
            if (jalali) { return [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, [1, 5, 9, 13, 17, 22, 26, 30].indexOf(year % 33) === -1 ? 29 : 30][month - 1] }
            else { return new Date(year, month - 1, 0).getDate(); }
        }
        this.getYearDaysLength = (date) => {
            if (!date) { return 0 }
            let [year] = this.convertToArray(date);
            let res = 0;
            for (let i = 1; i <= 12; i++) {
                res += this.getMonthDaysLength([year, i])
            }
            return res
        }
        this.getYesterday = (date) => {
            const [year, month, day] = this.convertToArray(date);
            let newYear = year, newMonth = month, newDay = day;
            if (day === 1) {
                if (month === 1) {
                    newYear = newYear - 1;
                    newMonth = 12;
                    newDay = this.getMonthDaysLength([newYear, newMonth])
                }
                else {
                    newMonth = newMonth - 1;
                    newDay = this.getMonthDaysLength([newYear, newMonth])
                }
            }
            else {
                newDay = newDay - 1
            }
            return [newYear, newMonth, newDay]
        }
        this.getTomarrow = (date) => {
            const [year, month, day] = this.convertToArray(date);
            let newYear = year, newMonth = month, newDay = day;
            const daysLength = this.getMonthDaysLength(date)
            if (day === daysLength) {
                if (month === 12) {
                    newYear = newYear + 1;
                    newMonth = 1;
                    newDay = 1
                }
                else {
                    newMonth = newMonth + 1;
                    newDay = 1
                }
            }
            else {
                newDay = newDay + 1
            }
            return [newYear, newMonth, newDay]
        }
        this.getDaysOfWeek = (date, pattern) => {
            if (!date) { return [] }
            let dateArray = this.convertToArray(date);
            let { index } = this.getWeekDay(dateArray);
            let firstDay: I_Date = [...dateArray];
            for (let i = 0; i < index; i++) {
                firstDay = this.getYesterday(firstDay);
            }
            const res: I_Date[] = [];
            for (let i = 0; i < 7; i++) {
                res.push(firstDay)
                firstDay = this.getTomarrow(firstDay)
            }
            if (pattern) { return res.map((o) => this.getDateByPattern(o, pattern)) }
            return res
        }
        this.getDatesBetween = (date, otherDate, step = 24 * 60 * 60 * 1000) => {
            if (!date || !otherDate) { return [] }
            date = this.convertToArray(date);
            otherDate = this.convertToArray(otherDate);
            if (!this.isGreater(otherDate, date)) { return [] }
            let delta = this.getDelta(date, otherDate) as { miliseconds: number };
            let length = delta.miliseconds / step;
            if (isNaN(length) || length > 1000) {
                console.error('AIODate().getDatesBetween() => too many dates');
                return [];
            }
            let nextDate = this.getNextTime(date, step);
            let res = [];
            while (this.isLess(nextDate, otherDate)) {
                res.push(nextDate);
                nextDate = this.getNextTime(nextDate, step);
            }
            return res
        }
        this.getDelta = (date, otherDate, unit) => {
            let dif = this.getTime(date) - this.getTime(otherDate || this.getToday());
            return this.convertMiliseconds(-dif, unit)
        }
        this.convertMiliseconds = (miliseconds = 0, unit = 'day') => {
            let type: 'remaining' | 'passed' | 'now';
            if (miliseconds < 0) { type = 'passed'; miliseconds = -miliseconds }
            else if (miliseconds > 0) { type = 'remaining' }
            else { type = 'now' }
            let index = ['day', 'hour', 'minute', 'second', 'tenthsecond', 'milisecond'].indexOf(unit);
            let day = 0, hour = 0, minute = 0, second = 0, tenthsecond = 0;
            let dif = miliseconds;
            if (index <= 0) {
                day = Math.floor(dif / (24 * 60 * 60 * 1000));
                dif -= day * (24 * 60 * 60 * 1000);
            }
            if (index <= 1) {
                hour = Math.floor(dif / (60 * 60 * 1000));
                dif -= hour * (60 * 60 * 1000);
            }
            if (index <= 2) {
                minute = Math.floor(dif / (60 * 1000));
                dif -= minute * (60 * 1000);
            }
            if (index <= 3) {
                second = Math.floor(dif / (1000));
                dif -= second * (1000);
            }
            if (index <= 4) {
                tenthsecond = Math.floor(dif / (100));
            }
            return { day, hour, minute, second, tenthsecond, miliseconds, type }
        }
        this.getDaysOfMonth = (date, pattern) => {
            if (!date) { return [] }
            let dateArray = this.convertToArray(date);
            let daysLength = this.getMonthDaysLength(date)
            let firstDay: I_Date = [dateArray[0], dateArray[1], 1];
            let res: I_Date[] = []
            for (let i = 0; i < daysLength; i++) {
                res.push(firstDay)
                firstDay = this.getTomarrow(firstDay);
            }

            if (pattern) { return res.map((o) => this.getDateByPattern(o, pattern)) }
            return res
        }
        this.getLastDayOfMonth = (date) => {
            let dateArray: number[] = this.convertToArray(date);
            let length = this.getMonthDaysLength(dateArray);
            let lastDay = [dateArray[0], dateArray[1], length];
            return lastDay
        }
        this.getDateByPattern = (date, pattern) => this.pattern(date, pattern)
        this.getToday = (jalali) => {
            let date = new Date();
            let dateArray: number[] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), Math.round(date.getMilliseconds() / 100)]
            if (jalali) { dateArray = this.toJalali(dateArray) as number[] }
            return dateArray;
        }
        this.getDayIndex = (date, unit) => {
            date = this.convertToArray(date);
            if (unit === 'week') {
                let days = this.getDaysOfWeek(date);
                for (let i = 0; i < days.length; i++) {
                    let [year, month, day] = days[i];
                    if (year !== date[0]) { continue }
                    if (month !== date[1]) { continue }
                    if (day !== date[2]) { continue }
                    return i;
                }
            }
            if (unit === 'month') {
                return date[2] - 1;
            }
            if (unit === 'year') {
                let res = 0;
                for (let i = 0; i < date[1] - 1; i++) {
                    res += this.getMonthDaysLength(date)
                }
                res += date[1];
                return res - 1
            }
            return 0
        }
    }
}
export class Geo {
    getAngle: (l: I_line | I_dline) => number
    getDipAngle: (dip: I_dip) => number
    getLength: (p: I_line) => number
    getPrepDip: (dip: I_dip) => number
    getDip: (l: I_line | I_dline) => I_dip
    getPrepFromLine: (l: I_dline | I_line, point: I_point, offset: number) => I_point
    getLineBySLA: (p1: I_point, length: number, angle: number) => I_line
    getArcByPoints: (arcPoints: I_point[], height?: number) => any
    getAvg: (list: I_point[]) => I_point
    getArcBy3Points: (p1: I_point, p2: I_point, p3: I_point) => I_arc
    getYOnLineByX: (l: I_dline | I_line, X: number) => number
    getXOnLineByY: (l: I_dline | I_line, Y: number) => number
    getMeet: (l1: I_dline | I_line, l2: I_dline | I_line) => I_point | false
    getInnerMeet: (line1: I_line, line2: I_line) => false | I_point
    getDLineByLine: (line: I_line) => I_dline
    getPointsByNGon: (r: number, count: number, corner: number) => I_point[]
    getLineByDLine: (dline: I_dline) => I_line
    tri: (type: 'sin' | 'cos', teta: number) => number
    getPrepToLine: (l: I_dline | I_line, p: I_point) => I_point | false
    getLineType: (line: I_dline | I_line) => 'DLine' | 'Line'
    getLine: (l: I_dline | I_line) => I_line
    getDLine: (l: I_dline | I_line) => I_dline
    setLineByLength: (line: I_line, length: number, from?: 'center' | 'start' | 'end') => I_line
    getParallelLine: (points: I_point[], offset: number) => I_point[]
    getPointsByDivide: (points: I_point[], divide: number) => I_point[]
    fix: (value: number) => number
    setLineByAngle: (line: I_line, angle: number) => I_line
    getNumberByStep: (number: number, step: number) => number
    setLineByOrtho: (line: I_line, ortho: number) => I_line
    rotateSpline: (points: I_point[], angle: number, center: I_point) => I_point[]
    isPointInPath: (points: I_point[], point: I_point) => boolean
    getDXF: (p: { type: 'line' | 'rect' | 'arc', obj: any }[]) => string;
    smooth: (points: I_point[], angle: number) => I_point[]
    constructor() {
        this.getAngle = (l) => {
            let line: I_line = this.getLineType(l) === 'DLine' ? this.getLineByDLine(l as I_dline) : (l as I_line)
            let [p1, p2] = line;
            let deltaX = p2[0] - p1[0];
            let deltaY = p2[1] - p1[1];
            let length = this.getLength([[0, 0], [deltaX, deltaY]]);
            let angle = Math.acos(deltaX / length) / Math.PI * 180;
            angle = Math.sign(deltaY) < 0 ? 360 - angle : angle;
            return parseFloat(angle.toFixed(4));
        }
        this.getLineType = (line) => Array.isArray(line[0]) ? 'Line' : 'DLine'
        this.getLine = (l) => this.getLineType(l) === 'Line' ? l as I_line : this.getLineByDLine(l as I_dline)
        this.getDLine = (l) => this.getLineType(l) === 'DLine' ? l as I_dline : this.getDLineByLine(l as I_line)
        this.getDipAngle = (dip) => this.getAngle([0, 0, dip])
        this.getLength = (line) => Math.sqrt(Math.pow(line[0][0] - line[1][0], 2) + Math.pow(line[0][1] - line[1][1], 2))
        this.getPrepDip = (dip) => -1 / dip
        this.getDip = (l) => {
            let line: I_line = this.getLine(l);
            return line[0][1] - line[1][1] / line[0][0] - line[1][0]
        }
        this.getLineByDLine = (dline) => {
            let [x, y] = dline;
            let X = this.getXOnLineByY(dline, y + 10)
            let Y = this.getYOnLineByX(dline, X)
            return [[x, y], [X, Y]]
        }
        this.getPrepFromLine = (l, point, offset) => {
            if (!offset) { return point; }
            let dline = this.getDLine(l);
            let angle: number = this.getAngle(dline);
            return this.getLineBySLA(point, offset, angle - 90)[1]
        }
        this.getPrepToLine = (l, point) => {
            let dline = this.getDLine(l);
            let prepLine: I_dline = [point[0], point[1], this.getPrepDip(dline[2])]
            return this.getMeet(dline, prepLine);
        }
        this.getLineBySLA = (p1, length, angle) => {
            if (!length) { return [p1, p1] }
            return [p1, [p1[0] + (this.tri('cos', angle) * length), p1[1] + (this.tri('sin', angle) * length)]];
        }
        this.getArcByPoints = (arcPoints, height) => {
            var points = [];
            var stringPoints = [];
            for (var i = 0; i < arcPoints.length; i++) {
                if (i === 3) { break; }
                var point = arcPoints[i];
                var stringPoint = point.toString();
                if (stringPoints.indexOf(stringPoint) !== -1) { continue }
                stringPoints.push(stringPoint);
                points.push(point)
            }
            var p1 = points[0], p2 = points[1], p3 = points[2];
            var changeObject: I_arc = { x: 0, y: 0, r: 0 };
            if (points.length === 1) { changeObject = { r: 0, x: p1[0], y: p1[1] } }
            else if (points.length === 2) {
                let avg = this.getAvg([p1, p2]);
                let dline = this.getDLineByLine([p1, p2])
                let pm = this.getPrepFromLine(dline, avg, height || 0);
                if (height) { changeObject = this.getArcBy3Points(p1, pm, p2); }
                else { changeObject = { r: this.getLength([p1, p2]) / 2, x: avg[0], y: avg[1] } }
            }
            else { changeObject = this.getArcBy3Points(p1, p2, p3); }
            return changeObject
        }
        this.getAvg = (arr) => {
            var x = 0, y = 0, length = arr.length;
            for (var i = 0; i < length; i++) { x += arr[i][0]; y += arr[i][1]; }
            return [x / length, y / length]
        }
        this.getArcBy3Points = (p1, p2, p3) => {
            let dip1: I_dip = this.getPrepDip(this.getDip([p1, p2]));
            let dip2: I_dip = this.getPrepDip(this.getDip([p2, p3]));
            let point1: I_point = this.getAvg([p1, p2]);
            let point2: I_point = this.getAvg([p2, p3])
            let dline1: I_dline = [point1[0], point1[1], dip1]
            let dline2: I_dline = [point2[0], point2[1], dip2]
            let meet = this.getMeet(dline1, dline2);
            if (!meet) { return { x: 0, y: 0, r: 0 }; }
            let x = meet[0], y = meet[1];
            let a1 = this.getAngle([meet, p1]),
                a2 = this.getAngle([meet, p2]),
                a3 = this.getAngle([meet, p3]);
            let slice;
            if (a1 < a2 && a2 < a3) { slice = [a1, a3]; }
            else if (a2 < a3 && a3 < a1) { slice = [a1, a3]; }
            else if (a3 < a1 && a1 < a2) { slice = [a1, a3]; }
            else if (a3 < a2 && a2 < a1) { slice = [a3, a1]; }
            else if (a1 < a3 && a3 < a2) { slice = [a3, a1]; }
            else if (a2 < a1 && a1 < a3) {
                slice = [a3, a1];
            } else { slice = [0, 0]; }
            let arc: I_arc = { x, y, r: this.getLength([p1, [x, y]]), slice };
            return arc
        }
        this.getDLineByLine = (line) => {
            let [p1] = line;
            return [p1[0], p1[1], this.getDip(line)]
        }
        this.getMeet = (l1, l2) => { //get {line1,line2} or {point1,point2,dip1,dip2}
            let dline1 = this.getDLine(l1);
            let dline2 = this.getDLine(l2);
            let [p1x, p1y, dip1] = dline1;
            let [p2x, p2y, dip2] = dline2;
            if (dip1 === dip2) { return false }
            if (Math.abs(dip1) === Infinity) { return [p1x, this.getYOnLineByX(dline2, p1x)] }
            if (Math.abs(dip2) === Infinity) { return [p2x, this.getYOnLineByX(dline1, p2x)] }
            var x = ((dip1 * p1x) - (dip2 * p2x) + p2y - p1y) / (dip1 - dip2);
            var y = dip1 * (x - p1x) + p1y;
            return [x, y]
        }
        this.getInnerMeet = (line1, line2) => {
            let meet = this.getMeet(line1, line2);
            if (meet === false) { return false }
            if (line2[0][0] < line2[1][0]) {
                if (meet[0] < line2[0][0] || meet[0] > line2[1][0]) { return false }
            }
            else {
                if (meet[0] < line2[1][0] || meet[0] > line2[0][0]) { return false }
            }
            if (line2[0][1] < line2[1][1]) {
                if (meet[1] < line2[0][1] || meet[1] > line2[1][1]) { return false }
            }
            else {
                if (meet[1] < line2[1][1] || meet[1] > line2[0][1]) { return false }
            }
            if (line1[0][0] < line1[1][0]) {
                if (meet[0] < line1[0][0] || meet[0] > line1[1][0]) { return false }
            }
            else {
                if (meet[0] < line1[1][0] || meet[0] > line1[0][0]) { return false }
            }
            if (line1[0][1] < line1[1][1]) {
                if (meet[1] < line1[0][1] || meet[1] > line1[1][1]) { return false }
            }
            else {
                if (meet[1] < line1[1][1] || meet[1] > line1[0][1]) { return false }
            }
            return meet;
        }
        this.getYOnLineByX = (l, X) => { // get {x,line} or {x,point,dip}
            let [x, y, dip] = this.getDLine(l);
            if (dip === Infinity) { return 0 }
            return dip * (X - x) + y;
        }
        this.getXOnLineByY = (l, Y) => { // get {y,line} or {y,point,dip}
            let [x, y, dip] = this.getDLine(l);
            if (dip === 0) { return 0 }
            if (dip === Infinity) { return x }
            return (Y - y) / dip + x;
        }
        this.tri = (type, a) => Math[type](a * Math.PI / 180)
        this.getPointsByNGon = (radius, count, corner) => {
            let ang = (180 - (360 / count));
            let w = +(this.tri('cos', ang / 2) * radius).toFixed(6) * 2;
            let h = +(this.tri('sin', ang / 2) * radius).toFixed(6);
            let p1 = [0, -h, corner];
            let p2 = [0 + w / 2, -h, corner];
            let points = [p1, p2];
            let a = 360 / count;
            for (let i = 0; i < count - 1; i++) {
                let p = [points[i + 1][0] + (this.tri('cos', a) * w), points[i + 1][1] + (this.tri('sin', a) * w), corner];
                a += 360 / count;
                points.push(p)
            }
            points.push(p1);
            return points;
        }
        this.setLineByLength = (line, length, side = 'end') => {
            let p1: I_point = [0, 0], p2: I_point = [0, 0], angle = this.getAngle(line);
            if (side === 'center') {
                let center = this.getAvg(line);
                let line1 = this.getLineBySLA(center, length / 2, angle + 180);
                let line2 = this.getLineBySLA(center, length / 2, angle);
                p1 = line1[1]; p2 = line2[1];
            }
            else if (side === 'end') {
                p1 = line[0];
                let newLine = this.getLineBySLA(p1, length, angle);
                p2 = newLine[1];
            }
            else if (side === 'start') {
                p2 = line[1];
                let newLine = this.getLineBySLA(p2, length, angle + 180);
                p1 = newLine[1]
            }
            return [p1, p2];
        }
        this.getParallelLine = (points, offset) => {
            let lines: I_line[] = [];
            let length = points.length;
            if (length === 2) {
                let p1 = this.getPrepFromLine([points[0], points[1]], points[0], offset);
                let p2 = this.getPrepFromLine([points[0], points[1]], points[1], offset);
                return [p1, p2];
            }
            for (var i = 1; i <= length; i++) {
                var point = points[i];
                if (i === length) { break; }
                var beforePoint = points[i - 1];
                var p1 = this.getPrepFromLine([beforePoint, point], beforePoint, offset);
                var p2 = this.getPrepFromLine([beforePoint, point], point, offset);
                lines.push([p1, p2]);
            }
            let res: I_point[] = [];
            length = lines.length;
            for (let i = 0; i < length; i++) {
                let line = lines[i];
                let beforeLine = lines[i - 1];
                if (i === 0) {
                    points.push([line[0][0], line[0][1]]);
                    continue
                }
                let meet = this.getMeet(beforeLine, line);
                if (meet) { res.push(meet); }
                if (i === length - 1) { points.push([line[1][0], line[1][1]]); }
            }
            return res;
        }
        this.getPointsByDivide = (line, divide) => {
            let [p1, p2] = line;
            let deltaX = this.fix(p2[0] - p1[0]), deltaY = this.fix(p2[1] - p1[1]);
            let uX = deltaX / divide, uY = deltaY / divide;
            let points: I_point[] = [];
            for (let i = 1; i < divide; i++) {
                points.push([p1[0] + i * uX, p1[1] + i * uY])
            }
            return points;
        }
        this.fix = (value) => { return parseFloat(value.toFixed(6)) }
        this.setLineByAngle = (line, angle) => {
            let length = this.getLength(line);
            if (!length) { return line }
            angle = angle % 360;
            return this.getLineBySLA([line[0][0], line[0][1]], length, angle);
        }
        this.getNumberByStep = (number, step) => Math.round(number / step) * step
        this.setLineByOrtho = (line, ortho) => this.setLineByAngle(line, this.getNumberByStep(this.getAngle(line), ortho))
        this.rotateSpline = (points, angle, center) => {
            let Points: I_point[] = JSON.parse(JSON.stringify(points));
            for (var i = 0; i < Points.length; i++) {
                let p = Points[i];
                let line: I_line = [[...center], [p[0], p[1]]];
                let lineAngle: number = this.getAngle(line);
                line = this.setLineByAngle(line, angle + lineAngle);
                p[0] = line[1][0];
                p[1] = line[1][1];
            }
            return Points;
        }
        this.isPointInPath = (points, point) => {
            let meets = 0;
            for (let i = 0; i < points.length; i++) {
                let curentPoint = points[i], nextPoint;
                if (i === points.length - 1) { nextPoint = points[0] }
                else { nextPoint = points[i + 1] }
                let meet = this.getInnerMeet([[point[0], point[1]], [9999999999, point[1]]], [[curentPoint[0], curentPoint[1]], [nextPoint[0], nextPoint[1]]]);
                if (meet !== false) { meets++ }
            }
            return meets % 2 !== 0;
        }
        this.smooth = (points, angle) => {
            let p1: I_point | undefined, p2: I_point | undefined, p3: I_point | undefined;
            let res: I_point[] = [];
            let type;
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                if (i === 0) { res.push([point[0], point[1]]); }
                if (!p1) { p1 = [point[0], point[1]]; continue; }
                if (!p2) { p2 = [point[0], point[1]]; continue; }
                if (!p3) { p3 = [point[0], point[1]]; continue; }
                const ang1 = this.getAngle([p1, p2]);
                const ang2 = this.getAngle([p2, p3]);
                const isSmooth: boolean = Math.abs(ang1 - ang2) < angle;
                if (isSmooth) {
                    p2 = [p3[0], p3[1]];
                    p3 = [point[0], point[1]];
                    type = 0
                } else {
                    res.push(p2);
                    p1 = [p2[0], p2[1]];
                    p2 = [p3[0], p3[1]];
                    p3 = [point[0], point[1]];
                    type = 1
                }
                if (i === points.length - 1) {
                    if (type === 1) {
                        res.push([p2[0], p2[1]]);
                    }
                    res.push([point[0], point[1]]);
                }
            }
            return res;
        }
        this.getDXF = (list = []) => {
            var get = {
                line: function (line: I_line) {
                    let [p1, p2] = line;
                    let res = '';
                    res +=
                        "LINE" + "\r\n" +
                        "8" + "\r\n" +
                        "1" + "\r\n" +
                        "62" + "\r\n" +
                        "0" + "\r\n" +
                        "10" + "\r\n" +
                        (p1[0]) + "\r\n" +
                        "20" + "\r\n" +
                        (p1[1]) * -1 + "\r\n" +
                        "30" + "\r\n" +
                        "0.0" + "\r\n" +
                        "11" + "\r\n" +
                        (p2[0]) + "\r\n" +
                        "21" + "\r\n" +
                        (p2[1]) * -1 + "\r\n" +
                        "31" + "\r\n" +
                        "0.0" + "\r\n" +
                        "0" + "\r\n";
                    return res;
                },
                rect: function (rect: I_rect) {
                    let [p1, p2] = rect;
                    var rectangle = '';
                    rectangle += this.line([[p1[0], p1[1]], [p2[0], p2[1]]]);
                    rectangle += this.line([[p2[0], p1[1]], [p2[0], p2[1]]]);
                    rectangle += this.line([[p2[0], p2[1]], [p1[0], p2[1]]]);
                    rectangle += this.line([[p1[0], p2[1]], [p1[0], p1[1]]]);
                    return rectangle;
                },
                arc: function (arc: I_arc) {
                    let { x, y, r, slice = [0, 360] } = arc
                    let res = '';
                    res +=
                        "ARC" + "\r\n" +
                        "8" + "\r\n" +
                        "1" + "\r\n" +
                        "62" + "\r\n" +
                        "0" + "\r\n" +
                        "10" + "\r\n" +
                        (x) + "\r\n" +
                        "20" + "\r\n" +
                        (y) * -1 + "\r\n" +
                        "30" + "\r\n" +
                        "0.0" + "\r\n" +
                        "40" + "\r\n" +
                        (r) + "\r\n" +
                        "50" + "\r\n" +
                        (slice[0]) + "\r\n" +
                        "51" + "\r\n" +
                        (slice[1]) + "\r\n" +
                        "0" + "\r\n";
                    return arc;
                }

            }
            let entities = '';
            for (let i = 0; i < list.length; i++) {
                var { type, obj } = list[i];
                entities += get[type](obj)
            }
            var dxfText =
                "0" + "\r\n" +
                "SECTION" + "\r\n" +
                "2" + "\r\n" +
                "ENTITIES" + "\r\n" +
                "0" + "\r\n";
            dxfText += entities;
            dxfText +=
                "ENDSEC" + "\r\n" +
                "0" + "\r\n" +
                "EOF";
            return dxfText;
        }
    }
}
export function GetCities() {
    return {
        "آذربایجان شرقی": ["اسکو", "اهر", "ایلخچی", "آبش احمد", "آذرشهر", "آقکند", "باسمنج", "بخشایش", "بستان آباد", "بناب", "بناب جدید", "تبریز", "ترک", "ترکمانچای", "تسوج", "تیکمه داش", "جلفا", "خاروانا", "خامنه", "خراجو", "خسروشهر", "خضرلو", "خمارلو", "خواجه", "دوزدوزان", "زرنق", "زنوز", "سراب", "سردرود", "سهند", "سیس", "سیه رود", "شبستر", "شربیان", "شرفخانه", "شندآباد", "صوفیان", "عجب شیر", "قره آغاج", "کشکسرای", "کلوانق", "کلیبر", "کوزه کنان", "گوگان", "لیلان", "مراغه", "مرند", "ملکان", "ملک کیان", "ممقان", "مهربان", "میانه", "نظرکهریزی", "هادی شهر", "هرگلان", "هریس", "هشترود", "هوراند", "وایقان", "ورزقان", "یامچی"],
        "آذربایجان غربی": ["ارومیه", "اشنویه", "ایواوغلی", "آواجیق", "باروق", "بازرگان", "بوکان", "پلدشت", "پیرانشهر", "تازه شهر", "تکاب", "چهاربرج", "خوی", "دیزج دیز", "ربط", "سردشت", "سرو", "سلماس", "سیلوانه", "سیمینه", "سیه چشمه", "شاهین دژ", "شوط", "فیرورق", "قره ضیاءالدین", "قطور", "قوشچی", "کشاورز", "گردکشانه", "ماکو", "محمدیار", "محمودآباد", "مهاباد", "میاندوآب", "میرآباد", "نالوس", "نقده", "نوشین"],
        "اردبیل": ["اردبیل", "اصلاندوز", "آبی بیگلو", "بیله سوار", "پارس آباد", "تازه کند", "تازه کندانگوت", "جعفرآباد", "خلخال", "رضی", "سرعین", "عنبران", "فخرآباد", "کلور", "کوراییم", "گرمی", "گیوی", "لاهرود", "مشگین شهر", "نمین", "نیر", "هشتجین", "هیر"],
        "اصفهان": ["ابریشم", "ابوزیدآباد", "اردستان", "اژیه", "اصفهان", "افوس", "انارک", "ایمانشهر", "آران وبیدگل", "بادرود", "باغ بهادران", "بافران", "برزک", "برف انبار", "بهاران شهر", "بهارستان", "بوئین و میاندشت", "پیربکران", "تودشک", "تیران", "جندق", "جوزدان", "جوشقان و کامو", "چادگان", "چرمهین", "چمگردان", "حبیب آباد", "حسن آباد", "حنا", "خالدآباد", "خمینی شهر", "خوانسار", "خور", "خورزوق", "داران", "دامنه", "درچه", "دستگرد", "دهاقان", "دهق", "دولت آباد", "دیزیچه", "رزوه", "رضوانشهر", "زاینده رود", "زرین شهر", "زواره", "زیباشهر", "سده لنجان", "سفیدشهر", "سگزی", "سمیرم", "شاهین شهر", "شهرضا", "طالخونچه", "عسگران", "علویجه", "فرخی", "فریدونشهر", "فلاورجان", "فولادشهر", "قمصر", "قهجاورستان", "قهدریجان", "کاشان", "کرکوند", "کلیشاد و سودرجان", "کمشچه", "کمه", "کهریزسنگ", "کوشک", "کوهپایه", "گرگاب", "گزبرخوار", "گلپایگان", "گلدشت", "گلشهر", "گوگد", "لای بید", "مبارکه", "مجلسی", "محمدآباد", "مشکات", "منظریه", "مهاباد", "میمه", "نائین", "نجف آباد", "نصرآباد", "نطنز", "نوش آباد", "نیاسر", "نیک آباد", "هرند", "ورزنه", "ورنامخواست", "وزوان", "ونک"],
        "البرز": ["اسارا", "اشتهارد", "تنکمان", "تهران دشت", "چهارباغ", "ساوجبلاغ", "سعید آباد", "شهر جدید هشتگرد", "طالقان", "فردیس", "کرج", "کردان", "کمال شهر", "کوهسار", "گرمدره", "گلبهار", "ماهدشت", "محمدشهر", "مشکین دشت", "نظرآباد", "هشتگرد"],
        "ایلام": ["ارکواز", "ایلام", "ایوان", "آبدانان", "آسمان آباد", "بدره", "پهله", "توحید", "چوار", "دره شهر", "دلگشا", "دهلران", "زرنه", "سراب باغ", "سرابله", "صالح آباد", "لومار", "مهران", "مورموری", "موسیان", "میمه"],
        "بوشهر": ["امام حسن", "انارستان", "اهرم", "آب پخش", "آبدان", "برازجان", "بردخون", "بندردیر", "بندردیلم", "بندرریگ", "بندرکنگان", "بندرگناوه", "بنک", "بوشهر", "تنگ ارم", "جم", "چغادک", "خارک", "خورموج", "دالکی", "دلوار", "ریز", "سعدآباد", "سیراف", "شبانکاره", "شنبه", "عسلویه", "کاکی", "کلمه", "نخل تقی", "وحدتیه"],
        "تهران": ["ارجمند", "اسلامشهر", "اندیشه", "آبسرد", "آبعلی", "باغستان", "باقرشهر", "بومهن", "پاکدشت", "پردیس", "پرند", "پیشوا", "تهران", "جوادآباد", "چهاردانگه", "حسن آباد", "دماوند", "دیزین", "شهر ری", "رباط کریم", "رودهن", "شاهدشهر", "شریف آباد", "شمشک", "شهریار", "صالح آباد", "صباشهر", "صفادشت", "فردوسیه", "فشم", "فیروزکوه", "قدس", "قرچک", "قیامدشت", "کهریزک", "کیلان", "گلستان", "لواسان", "مارلیک", "ملارد", "میگون", "نسیم شهر", "نصیرآباد", "وحیدیه", "ورامین"],
        "چهارمحال و بختیاری": ["اردل", "آلونی", "باباحیدر", "بروجن", "بلداجی", "بن", "جونقان", "چلگرد", "سامان", "سفیددشت", "سودجان", "سورشجان", "شلمزار", "شهرکرد", "طاقانک", "فارسان", "فرادنبه", "فرخ شهر", "کیان", "گندمان", "گهرو", "لردگان", "مال خلیفه", "ناغان", "نافچ", "نقنه", "هفشجان"],
        "خراسان جنوبی": ["ارسک", "اسدیه", "اسفدن", "اسلامیه", "آرین شهر", "آیسک", "بشرویه", "بیرجند", "حاجی آباد", "خضری دشت بیاض", "خوسف", "زهان", "سرایان", "سربیشه", "سه قلعه", "شوسف", "طبس ", "فردوس", "قاین", "قهستان", "محمدشهر", "مود", "نهبندان", "نیمبلوک"],
        "خراسان رضوی": ["احمدآباد صولت", "انابد", "باجگیران", "باخرز", "بار", "بایگ", "بجستان", "بردسکن", "بیدخت", "بینالود", "تایباد", "تربت جام", "تربت حیدریه", "جغتای", "جنگل", "چاپشلو", "چکنه", "چناران", "خرو", "خلیل آباد", "خواف", "داورزن", "درگز", "در رود", "دولت آباد", "رباط سنگ", "رشتخوار", "رضویه", "روداب", "ریوش", "سبزوار", "سرخس", "سفیدسنگ", "سلامی", "سلطان آباد", "سنگان", "شادمهر", "شاندیز", "ششتمد", "شهرآباد", "شهرزو", "صالح آباد", "طرقبه", "عشق آباد", "فرهادگرد", "فریمان", "فیروزه", "فیض آباد", "قاسم آباد", "قدمگاه", "قلندرآباد", "قوچان", "کاخک", "کاریز", "کاشمر", "کدکن", "کلات", "کندر", "گلمکان", "گناباد", "لطف آباد", "مزدآوند", "مشهد", "ملک آباد", "نشتیفان", "نصرآباد", "نقاب", "نوخندان", "نیشابور", "نیل شهر", "همت آباد", "یونسی"],
        "خراسان شمالی": ["اسفراین", "ایور", "آشخانه", "بجنورد", "پیش قلعه", "تیتکانلو", "جاجرم", "حصارگرمخان", "درق", "راز", "سنخواست", "شوقان", "شیروان", "صفی آباد", "فاروج", "قاضی", "گرمه", "لوجلی"],
        "خوزستان": ["اروندکنار", "الوان", "امیدیه", "اندیمشک", "اهواز", "ایذه", "آبادان", "آغاجاری", "باغ ملک", "بستان", "بندرامام خمینی", "بندرماهشهر", "بهبهان", "ترکالکی", "جایزان", "چمران", "چویبده", "حر", "حسینیه", "حمزه", "حمیدیه", "خرمشهر", "دارخوین", "دزآب", "دزفول", "دهدز", "رامشیر", "رامهرمز", "رفیع", "زهره", "سالند", "سردشت", "سوسنگرد", "شادگان", "شاوور", "شرافت", "شوش", "شوشتر", "شیبان", "صالح شهر", "صفی آباد", "صیدون", "قلعه تل", "قلعه خواجه", "گتوند", "لالی", "مسجدسلیمان", "ملاثانی", "میانرود", "مینوشهر", "هفتگل", "هندیجان", "هویزه", "ویس"],
        "زنجان": ["ابهر", "ارمغان خانه", "آب بر", "چورزق", "حلب", "خرمدره", "دندی", "زرین آباد", "زرین رود", "زنجان", "سجاس", "سلطانیه", "سهرورد", "صائین قلعه", "قیدار", "گرماب", "ماه نشان", "هیدج"],
        "سمنان": ["امیریه", "ایوانکی", "آرادان", "بسطام", "بیارجمند", "دامغان", "درجزین", "دیباج", "سرخه", "سمنان", "شاهرود", "شهمیرزاد", "کلاته خیج", "گرمسار", "مجن", "مهدی شهر", "میامی"],
        "سیستان و بلوچستان": ["ادیمی", "اسپکه", "ایرانشهر", "بزمان", "بمپور", "بنت", "بنجار", "پیشین", "جالق", "چابهار", "خاش", "دوست محمد", "راسک", "زابل", "زابلی", "زاهدان", "زهک", "سراوان", "سرباز", "سوران", "سیرکان", "علی اکبر", "فنوج", "قصرقند", "کنارک", "گشت", "گلمورتی", "محمدان", "محمدآباد", "محمدی", "میرجاوه", "نصرت آباد", "نگور", "نوک آباد", "نیک شهر", "هیدوچ"],
        "فارس": ["اردکان", "ارسنجان", "استهبان", "اشکنان", "افزر", "اقلید", "امام شهر", "اهل", "اوز", "ایج", "ایزدخواست", "آباده", "آباده طشک", "باب انار", "بالاده", "بنارویه", "بهمن", "بوانات", "بیرم", "بیضا", "جنت شهر", "جهرم", "جویم", "زرین دشت", "حسن آباد", "خان زنیان", "خاوران", "خرامه", "خشت", "خنج", "خور", "داراب", "داریان", "دبیران", "دژکرد", "دهرم", "دوبرجی", "رامجرد", "رونیز", "زاهدشهر", "زرقان", "سده", "سروستان", "سعادت شهر", "سورمق", "سیدان", "ششده", "شهرپیر", "شهرصدرا", "شیراز", "صغاد", "صفاشهر", "علامرودشت", "فدامی", "فراشبند", "فسا", "فیروزآباد", "قائمیه", "قادرآباد", "قطب آباد", "قطرویه", "قیر", "کارزین (فتح آباد)", "کازرون", "کامفیروز", "کره ای", "کنارتخته", "کوار", "گراش", "گله دار", "لار", "لامرد", "لپویی", "لطیفی", "مبارک آباددیز", "مرودشت", "مشکان", "مصیری", "مهر", "میمند", "نوبندگان", "نوجین", "نودان", "نورآباد", "نی ریز", "وراوی"],
        "قزوین": ["ارداق", "اسفرورین", "اقبالیه", "الوند", "آبگرم", "آبیک", "آوج", "بوئین زهرا", "بیدستان", "تاکستان", "خاکعلی", "خرمدشت", "دانسفهان", "رازمیان", "سگزآباد", "سیردان", "شال", "شریفیه", "ضیاآباد", "قزوین", "کوهین", "محمدیه", "محمودآباد نمونه", "معلم کلایه", "نرجه"],
        "قم": ["جعفریه", "دستجرد", "سلفچگان", "قم", "قنوات", "کهک"],
        "کردستان": ["آرمرده", "بابارشانی", "بانه", "بلبان آباد", "بوئین سفلی", "بیجار", "چناره", "دزج", "دلبران", "دهگلان", "دیواندره", "زرینه", "سروآباد", "سریش آباد", "سقز", "سنندج", "شویشه", "صاحب", "قروه", "کامیاران", "کانی دینار", "کانی سور", "مریوان", "موچش", "یاسوکند"],
        "کرمان": ["اختیارآباد", "ارزوئیه", "امین شهر", "انار", "اندوهجرد", "باغین", "بافت", "بردسیر", "بروات", "بزنجان", "بم", "بهرمان", "پاریز", "جبالبارز", "جوپار", "جوزم", "جیرفت", "چترود", "خاتون آباد", "خانوک", "خورسند", "درب بهشت", "دهج", "رابر", "راور", "راین", "رفسنجان", "رودبار", "ریحان شهر", "زرند", "زنگی آباد", "زیدآباد", "سیرجان", "شهداد", "شهربابک", "صفائیه", "عنبرآباد", "فاریاب", "فهرج", "قلعه گنج", "کاظم آباد", "کرمان", "کشکوئیه", "کهنوج", "کوهبنان", "کیانشهر", "گلباف", "گلزار", "لاله زار", "ماهان", "محمدآباد", "محی آباد", "مردهک", "مس سرچشمه", "منوجان", "نجف شهر", "نرماشیر", "نظام شهر", "نگار", "نودژ", "هجدک", "یزدان شهر"],
        "کرمانشاه": ["ازگله", "اسلام آباد غرب", "باینگان", "بیستون", "پاوه", "تازه آباد", "جوان رود", "حمیل", "ماهیدشت", "روانسر", "سرپل ذهاب", "سرمست", "سطر", "سنقر", "سومار", "شاهو", "صحنه", "قصرشیرین", "کرمانشاه", "کرندغرب", "کنگاور", "کوزران", "گهواره", "گیلانغرب", "میان راهان", "نودشه", "نوسود", "هرسین", "هلشی"],
        "کهگیلویه و بویراحمد": ["باشت", "پاتاوه", "چرام", "چیتاب", "دهدشت", "دوگنبدان", "دیشموک", "سوق", "سی سخت", "قلعه رئیسی", "گراب سفلی", "لنده", "لیکک", "مادوان", "مارگون", "یاسوج"],
        "گلستان": ["انبارآلوم", "اینچه برون", "آزادشهر", "آق قلا", "بندرترکمن", "بندرگز", "جلین", "خان ببین", "دلند", "رامیان", "سرخنکلاته", "سیمین شهر", "علی آباد کتول", "فاضل آباد", "کردکوی", "کلاله", "گالیکش", "گرگان", "گمیش تپه", "گنبدکاووس", "مراوه", "مینودشت", "نگین شهر", "نوده خاندوز", "نوکنده"],
        "لرستان": ["ازنا", "اشترینان", "الشتر", "الیگودرز", "بروجرد", "پلدختر", "چالانچولان", "چغلوندی", "چقابل", "خرم آباد", "درب گنبد", "دورود", "زاغه", "سپیددشت", "سراب دوره", "فیروزآباد", "کونانی", "کوهدشت", "گراب", "معمولان", "مومن آباد", "نورآباد", "ویسیان"],
        "گیلان": ["احمدسرگوراب", "اسالم", "اطاقور", "املش", "آستارا", "آستانه اشرفیه", "بازار جمعه", "بره سر", "بندرانزلی", "پره سر", "پیربازار", "تالش", "توتکابن", "جیرنده", "چابکسر", "چاف و چمخاله", "چوبر", "حویق", "خشکبیجار", "خمام", "دیلمان", "زیباکنار", "رانکوه", "رحیم آباد", "رستم آباد", "رشت", "رضوانشهر", "رودبار", "رودبنه", "رودسر", "سنگر", "سیاهکل", "شفت", "شلمان", "صومعه سرا", "فومن", "کلاچای", "کوچصفهان", "کومله", "کیاشهر", "گوراب زرمیخ", "لاهیجان", "لشت نشا", "لنگرود", "لوشان", "لولمان", "لوندویل", "لیسار", "ماسال", "ماسوله", "مرجقل", "منجیل", "واجارگاه"],
        "مازندران": ["امیرکلا", "ایزدشهر", "آلاشت", "آمل", "بابل", "بابلسر", "بلده", "بهشهر", "بهنمیر", "پل سفید", "تنکابن", "جویبار", "چالوس", "چمستان", "خرم آباد", "خلیل شهر", "خوش رودپی", "دابودشت", "رامسر", "رستمکلا", "رویان", "رینه", "زرگرمحله", "زیرآب", "سادات شهر", "ساری", "سرخرود", "سلمان شهر", "سورک", "شیرگاه", "شیرود", "عباس آباد", "فریدونکنار", "فریم", "قائم شهر", "کتالم", "کلارآباد", "کلاردشت", "کله بست", "کوهی خیل", "کیاسر", "کیاکلا", "گتاب", "گزنک", "گلوگاه", "محمودآباد", "مرزن آباد", "مرزیکلا", "نشتارود", "نکا", "نور", "نوشهر"],
        "مرکزی": ["اراک", "آستانه", "آشتیان", "پرندک", "تفرش", "توره", "جاورسیان", "خشکرود", "خمین", "خنداب", "داودآباد", "دلیجان", "رازقان", "زاویه", "ساروق", "ساوه", "سنجان", "شازند", "غرق آباد", "فرمهین", "قورچی باشی", "کرهرود", "کمیجان", "مامونیه", "محلات", "مهاجران", "میلاجرد", "نراق", "نوبران", "نیمور", "هندودر"],
        "هرمزگان": ["ابوموسی", "بستک", "بندرجاسک", "بندرچارک", "بندرخمیر", "بندرعباس", "بندرلنگه", "بیکا", "پارسیان", "تخت", "جناح", "حاجی آباد", "درگهان", "دهبارز", "رویدر", "زیارتعلی", "سردشت", "سندرک", "سوزا", "سیریک", "فارغان", "فین", "قشم", "قلعه قاضی", "کنگ", "کوشکنار", "کیش", "گوهران", "میناب", "هرمز", "هشتبندی"],
        "همدان": ["ازندریان", "اسدآباد", "برزول", "بهار", "تویسرکان", "جورقان", "جوکار", "دمق", "رزن", "زنگنه", "سامن", "سرکان", "شیرین سو", "صالح آباد", "فامنین", "فرسفج", "فیروزان", "قروه درجزین", "قهاوند", "کبودر آهنگ", "گل تپه", "گیان", "لالجین", "مریانج", "ملایر", "نهاوند", "همدان"],
        "یزد": ["ابرکوه", "احمدآباد", "اردکان", "اشکذر", "بافق", "بفروئیه", "بهاباد", "تفت", "حمیدیا", "خضرآباد", "دیهوک", "رضوانشهر", "زارچ", "شاهدیه", "طبس", "عقدا", "مروست", "مهردشت", "مهریز", "میبد", "ندوشن", "نیر", "هرات", "یزد"]
    }
}
export function Get2Digit(n: number) { let ns: string = n.toString(); return ns.length === 1 ? '0' + ns : ns }
function svgArcRange(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}
export function svgArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    if (startAngle === endAngle || endAngle - startAngle === 360) {
        startAngle = 0; endAngle = 360;
    }
    if (startAngle === 360) { startAngle = 359.99 }
    if (endAngle === 360) { endAngle = 359.99 }
    let start = svgArcRange(x, y, radius, endAngle);
    let end = svgArcRange(x, y, radius, startAngle);

    let largeArcFlag;
    if (endAngle - startAngle < -180) {
        largeArcFlag = '0'
    }
    else if (endAngle - startAngle < 0) {
        //console.log(1)
        largeArcFlag = '1'
    }
    else if (endAngle - startAngle <= 180) {
        //console.log(2)
        largeArcFlag = '0'
    }
    else if (endAngle - startAngle <= 360) {
        //console.log(3)
        largeArcFlag = '1'
    }
    else {
        //console.log(4)
        largeArcFlag = '0'
    }

    let d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}
export function getValueByField(data: any, field: string, def?: any) {
    let a;
    try { eval(`a = data.${field}`); }
    catch { }
    return a === undefined ? def : a;
}
export function setValueByField(data: any = {}, field: string, value: any) {
    try {
        field = field.replace(/\[/g, '.').replace(/\]/g, '');
    }
    catch { }
    let fields = field.split('.');
    let node = data;
    for (let i = 0; i < fields.length - 1; i++) {
        let f = fields[i];
        if (!f) { continue }
        if (node[f] === undefined) {
            if (isNaN(+fields[i + 1])) { node[f] = {} }
            else { node[f] = []; }
            node = node[f];
        }
        else { node = node[f]; }
    }
    node[fields[fields.length - 1]] = value;
    return data;
}
export function GetArray(count: number, fn?: (index: number) => any,step?:number) {
    fn = fn || ((index) => index)
    if(step){
        const arr = new Array(count).fill(0);
        const res = [];
        for(let i = 0; i < arr.length; i++){
            if(i % step !== 0){continue}
            res.push(fn(i))
        }
        return res
    }
    return new Array(count).fill(0).map((o, i) => fn(i))
}
export function GetRandomNumber(from: number, to: number) { return from + Math.round(Math.random() * (to - from)) }
type I_storage_model = { [key: string]: any }
type I_storage_time = { [key: string]: number }
export class Storage {
    model: I_storage_model;
    time: I_storage_time;
    init: () => void;
    saveStorage: (model: I_storage_model, time: I_storage_time) => void;
    getParent: (field: string) => I_storage_model | undefined;
    removeValueByField: (field: string) => I_storage_model
    setValueByField: (field: string, value: any) => I_storage_model
    getValueByField: (field: string) => any
    save: (field: string, value: any) => I_storage_model
    remove: (field: string, callback?: () => void) => I_storage_model
    load: (field: string, def?: any, time?: number) => any
    clear: () => void
    download: (file: any, name: string) => void
    export: () => void;
    read: (file: any, callback: (model: any) => void) => void
    import: (file: any, callback: () => void) => void
    getModel: () => I_storage_model
    constructor(id: string) {
        this.model = {}
        this.time = {}
        this.init = () => {
            let storage: any = localStorage.getItem('storageClass' + id);
            let timeStorage = localStorage.getItem('storageClassTime' + id);
            let model: I_storage_model, time: I_storage_time;
            if (storage === undefined || storage === null) { model = {} }
            else { model = JSON.parse(storage) }
            if (timeStorage === undefined || timeStorage === null) { time = {} }
            else { time = JSON.parse(timeStorage) }
            this.model = model;
            this.time = time
            this.saveStorage(model, time)
        }
        this.saveStorage = (model, time) => {
            localStorage.setItem('storageClass' + id, JSON.stringify(model));
            localStorage.setItem('storageClassTime' + id, JSON.stringify(time));
        }
        this.getParent = (field) => {
            let fields = field.split('.');
            let parent = this.model;
            for (let i = 0; i < fields.length - 1; i++) {
                parent = parent[fields[i]];
                if (typeof parent !== 'object') { return }
            }
            return parent
        }
        this.removeValueByField = (field: string) => {
            let fields = field.split('.')
            let parent: I_storage_model | undefined = this.getParent(field)
            let lastField: string = fields[fields.length - 1]
            let newParent: I_storage_model = {};
            for (let prop in parent) {
                if (prop !== lastField) { newParent[prop] = parent[prop] }
            }
            fields.pop();
            return this.setValueByField(fields.join('.'), newParent)
        }
        this.setValueByField = (field, value) => {
            if (!field) { this.model = value; return; }
            var fields = field.split('.');
            var parent = this.model;
            for (let i = 0; i < fields.length - 1; i++) {
                let f = fields[i];
                if (parent[f] === undefined) { parent[f] = {} }
                parent = parent[f];
            }
            parent[fields[fields.length - 1]] = value;
            return this.getValueByField(fields[0])
        }
        this.getValueByField = (field) => {
            let fields = field.split('.');
            let model = this.model;
            let parent = { ...model };
            for (let i = 0; i < fields.length - 1; i++) {
                parent = parent[fields[i]];
                if (typeof parent !== 'object') { return }
            }
            return parent[fields[fields.length - 1]]
        }
        this.save = (field, value) => {
            try { value = JSON.parse(JSON.stringify(value)) } catch { value = value; }
            if (!field || field === null) { return {} }
            let res = this.setValueByField(field, value)
            this.time[field] = new Date().getTime();
            this.saveStorage(this.model, this.time);
            return res;
        }
        this.remove = (field, callback = () => { }) => {
            let res = this.removeValueByField(field);
            let newTime: any = {};
            for (let prop in this.time) { if (prop !== field) { newTime[prop] = this.time[prop] } }
            this.time = newTime;
            this.saveStorage(this.model, this.time);
            callback();
            return res;
        }
        this.load = (field, def, time) => {
            let value = this.getValueByField(field);
            if (time && value !== undefined) {
                let thisTime = new Date().getTime();
                let lastTime = this.time[field] || thisTime;
                let dif = Math.abs(thisTime - lastTime);
                if (dif > time) { value = undefined }
            }
            if (value === undefined && def !== undefined) {
                value = typeof def === 'function' ? def() : def;
                this.save(field, def);
            }
            return value;
        }
        this.clear = () => {
            this.model = {};
            this.time = {};
            this.saveStorage(this.model, this.time)
        }
        this.download = (file, name) => {
            if (!name || name === null) { return }
            let text = JSON.stringify(file)
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', name);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
        this.export = () => {
            let name = window.prompt('Please Inter File Name');
            if (name === null || !name) { return; }
            this.download({ model: this.model, time: this.time }, name)
        }
        this.read = (file, callback = () => { }) => {
            var fr = new FileReader();
            fr.onload = () => { try { callback(JSON.parse((fr as any).result)); } catch { return; } }
            fr.readAsText(file);
        }
        this.import = (file, callback = () => { }) => {
            this.read(
                file,
                (obj) => {
                    if (obj === undefined) { return; }
                    let { model, time } = obj;
                    this.model = model;
                    this.time = time;
                    this.saveStorage(this.model, this.time);
                    callback()
                }
            )
        }
        this.getModel = () => {
            return JSON.parse(JSON.stringify(this.model))
        }
        this.init()
    }
}
export function DisabledContextMenu() { window.addEventListener(`contextmenu`, (e) => e.preventDefault()); }
export type AV_operator = 'contain' | 'required' | '=' | '>' | '>=' | '<' | '<=' | 'startBy' | '<>' | '<=>'
export type AV_props = { lang?: 'fa' | 'en', title?: string, value: any, validations: AV_item[] }
type AV_item_object = { target: any, title?: string, message?: string, value: any, operator: AV_operator, not: boolean, equal: boolean, fn: any };
export type AV_item = string | Omit<AV_item_object, 'value' | 'equal' | 'fn'>
type AV_fn = 'less' | 'greater' | 'equal' | 'contain' | 'startBy' | 'required' | 'between'
export class Validation {
    contain: (target: any, value: any) => { result: boolean, unit: any };
    startBy: (target: any, value: any) => { result: boolean, unit: any };
    equal: (target: any, value: any, equal?: boolean) => { result: boolean, unit: any };
    less: (target: any, value: any, equal?: boolean) => { result: boolean, unit: any };
    greater: (target: any, value: any, equal?: boolean) => { result: boolean, unit: any };
    between: (targets: any[], value: any, equal?: boolean) => { result: boolean, unit: any };
    getMessage: (p: { translate: string, target: string, message?: string, title?: string, unit: string }) => string;
    translate: (operator: AV_operator, not: boolean) => string
    getResult: (p: AV_item_object) => string | undefined
    getValidation: () => string | undefined;
    validate: () => string | undefined;
    boolKey: (key: 'more' | 'less') => string;
    boolDic: any;
    getUnit: (value: any) => string;
    constructor(props: AV_props) {
        let { lang = 'en', value } = props;
        let isDate = typeof value === 'string' && value.indexOf('/') !== -1;
        this.boolDic = isDate ? { more: { en: 'after', fa: 'بعد از' }, less: { en: 'before', fa: 'قبل از' } } : { more: { en: 'more', fa: 'بیشتر' }, less: { en: 'less', fa: 'کمتر' } }
        this.boolKey = (key) => this.boolDic[key][lang]
        let DATE = new AIODate();
        this.contain = (target, value) => {
            let result
            if (Array.isArray(value)) { result = value.indexOf(target) !== -1 }
            else if (target === 'number') { result = /\d/.test(value); }
            else if (target === 'letter') { result = /[a-zA-Z]/.test(value); }
            else if (target === 'uppercase') { result = /[A-Z]/.test(value); }
            else if (target === 'lowercase') { result = /[a-z]/.test(value); }
            else if (target === 'symbol') { result = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value); }
            else if (typeof target.test === 'function') { result = target.test(value); }
            else { result = value.indexOf(target) !== -1; }
            return { result, unit: '' }
        }
        this.startBy = (target, value) => ({ result: value.indexOf(target) === 0, unit: '' })
        this.equal = (target, value) => {
            let valueType = Array.isArray(value) ? 'array' : typeof value;
            let targetType = typeof target;
            let result, unit;
            if (isDate) { result = DATE.isEqual(value, typeof target === 'number' ? target.toString() : target); unit = '' }
            else if ((valueType === 'array' || valueType === 'string') && targetType === 'number') { result = value.length === target; unit = this.getUnit(value) }
            else { result = JSON.stringify(value) === JSON.stringify(target); unit = '' }
            return { result, unit }
        }
        this.less = (target, value, equal) => {
            let valueType = Array.isArray(value) ? 'array' : typeof value;
            let targetType = typeof target;
            let result, unit = '';
            if (isDate) { result = DATE.isLess(value, typeof target === 'number' ? target.toString() : target); unit = '' }
            else if (targetType === 'number' && valueType === 'number') { result = value < target; unit = '' }
            else if ((valueType === 'array' || valueType === 'string') && targetType === 'number') { result = value.length < target; unit = this.getUnit(value) }
            else { result = false; unit = ''; }
            return { result: equal ? result || this.equal(target, value).result : result, unit };
        }
        this.greater = (target, value, equal) => {
            let valueType = Array.isArray(value) ? 'array' : typeof value;
            let targetType = typeof target;
            let result, unit;
            if (isDate) { result = DATE.isGreater(value, typeof target === 'number' ? target.toString() : target); unit = '' }
            else if (targetType === 'number' && valueType === 'number') { result = value > target; unit = '' }
            else if ((valueType === 'array' || valueType === 'string') && targetType === 'number') { result = value.length > target; unit = this.getUnit(value) }
            else { result = false; unit = '' }
            return { result: equal ? result || this.equal(target, value).result : result, unit };
        }
        this.between = (targets, value, equal) => {
            let res1 = this.greater(targets[0], value).result
            let res2 = this.less(targets[1], value).result
            let result = !!res1 && !!res2
            return { result: equal ? (result || this.equal(targets[0], value).result || this.equal(targets[1], value).result) : result, unit: '' }
        }
        this.translate = (operator, not): string => {
            let dict;
            if (not) {
                dict = {
                    'contain': { en: `should not be contain`, fa: `نمی تواند شامل` },
                    '>': { en: `could not be ${this.boolKey('more')} than`, fa: `نباید ${this.boolKey('more')} از` },
                    '>=': { en: `could not be ${this.boolKey('more')} than or equal`, fa: `نباید ${this.boolKey('more')} یا مساوی` },
                    '<': { en: `could not be ${this.boolKey('less')} than`, fa: `نباید ${this.boolKey('less')} از` },
                    '<=': { en: `could not be ${this.boolKey('less')} than or equal`, fa: `نباید ${this.boolKey('less')} یا مساوی` },
                    '=': { en: `cannot be equal`, fa: `نمی تواند برابر` },
                    'startBy': { en: `should not start by`, fa: `نباید در ابتدا شامل` },
                    '<>': { en: `should not be between`, fa: `نباید بین` },
                    '<=>': { en: `should not be between`, fa: `نباید بین یا برابر` },
                    'required': { en: '', fa: '' }
                }
            }
            else {
                dict = {
                    'contain': { en: `should be contain`, fa: `باید شامل` },
                    '>': { en: `should be ${this.boolKey('more')} than`, fa: `باید ${this.boolKey('more')} از` },
                    '>=': { en: `should be ${this.boolKey('more')} than or equal`, fa: `باید ${this.boolKey('more')} یا مساوی` },
                    '<': { en: `should be ${this.boolKey('less')} than`, fa: `باید ${this.boolKey('less')} از` },
                    '<=': { en: `should be ${this.boolKey('less')} than or equal`, fa: `باید ${this.boolKey('less')} یا مساوی` },
                    '=': { en: `should be equal`, fa: `باید برابر` },
                    'startBy': { en: `should start by`, fa: `باید در ابتدا شامل` },
                    '<>': { en: `should be between`, fa: `باید بین` },
                    '<=>': { en: `should be between`, fa: `باید بین یا برابر` },
                    'required': { en: '', fa: '' }
                }
            }
            return dict[operator][lang]
        }
        this.getMessage = (p) => {
            let { translate, target, unit, title, message } = p;
            if (message) { return message }
            let res = `${title} ${translate} ${target} ${unit}` + (props.lang === 'fa' ? ' باشد' : '')
            return res.trim()
        }
        this.getResult = (p) => {
            let { target, message, title = '', value, operator, not, equal, fn } = p;
            fn = (this as any)[fn];
            let { result, unit } = fn(target, value, equal)
            if ((not && result) || (!not && !result)) {
                let translate = this.translate(operator, not)
                return !!title ? this.getMessage({ translate, target, message, title, unit }) : undefined
            }
        }
        this.getUnit = (value) => {
            let unit = '';
            if (Array.isArray(value)) { unit = lang === 'fa' ? 'مورد' : 'items(s)' }
            else if (typeof value === 'string') { unit = lang === 'fa' ? 'کاراکتر' : 'character(s)' }
            return unit;
        }
        this.getValidation = () => {
            let { value, validations = [] } = props;
            for (let i = 0; i < validations.length; i++) {
                const v = validations[i];
                let title, target, not, equal, fn, operator, message;
                if (typeof v === 'string') {
                    let res = ValidationTextToObject(v, props.title)
                    title = res.title; target = res.target; not = res.not; equal = res.equal;
                    fn = res.fn; operator = res.operator; message = res.message;
                }
                else {
                    title = v.title; target = v.target; operator = v.operator; message = v.message;
                    let details = getOperatorDetails(operator); equal = details.equal; not = details.not; fn = details.fn;
                }
                if (operator === 'required') {
                    const isNull = value === undefined || value === null || value === '' || value === false || value.length === 0;
                    if (!not && isNull) {
                        if (lang === 'en') { return `${title} is required` }
                        if (lang === 'fa') { return `وارد کردن ${title} ضروری است` }
                    }
                    else if (not && !isNull) {
                        if (lang === 'en') { return `${title} is forbidden` }
                        if (lang === 'fa') { return `وارد کردن ${title} مجاز نیست` }
                    }
                }
                else {
                    let result = this.getResult({ operator: operator as AV_operator, not, target, title, message, value, equal, fn })
                    if (result) { return result }
                }
            }
        }
        this.validate = () => {
            let validation: string | undefined = undefined;
            try { validation = this.getValidation() } catch { validation = undefined }
            return validation;
        }
    }
}
function getOperatorDetails(operator: AV_operator): { fn: AV_fn, not: boolean, equal: boolean } {
    let fn: AV_fn;
    if (operator === 'contain' || operator === 'startBy') { fn = operator }
    else {
        let lessIndex = operator.indexOf('<');
        let moreIndex = operator.indexOf('>');
        if (lessIndex !== -1 && moreIndex !== -1) { fn = 'between'; }
        else if (lessIndex !== -1) { fn = 'less' }
        else if (moreIndex !== -1) { fn = 'greater' }
        else { fn = 'equal' }
    }
    let not = operator.indexOf('!') !== -1;
    let equal = operator.indexOf('=') !== -1;
    return { fn, not, equal }
}
export function ValidationTextToObject(vtext: string, Title?: string) {
    let [operator, target, text] = vtext.split(',');
    let otherTarget;
    let title: string | undefined = Title, message: string = '';
    if (text) {
        if (text.indexOf('title(') === 0 && text[text.length - 1] === ')') { title = text.slice(6, text.length - 1) }
        else if (text.indexOf('message(') === 0 && text[text.length - 1] === ')') { message = text.slice(8, text.length - 1) }
        else { otherTarget = ParseString(text) }
    }
    target = ParseString(target);
    let Target: any = target;
    let { fn, not, equal } = getOperatorDetails(operator as AV_operator);
    if (fn === 'between') { Target = [target, otherTarget]; }
    return { title, target: Target, not, equal, fn, operator: operator as AV_operator, message }
}
type PS_validation = { targets: any[], not: boolean, operator: AV_operator, bool?: PS_bool }
type PS_filter = { field: string, validation: PS_validation | string }
type PS_column = { title: string, field: string };
export function ConvertTextToFilters(sentence: string, columns: any[]): (PS_filter | string)[] {
    const sentences = sentence.split('.');
    const filterItems: PS_filter[] = []
    const inst: ConvertPToFilter = new ConvertPToFilter(columns)
    for (let i = 0; i < sentences.length; i++) {
        const res: PS_filter | false = inst.convert(sentences[i]);
        if (res !== false) { filterItems.push(res) }
    }
    return filterItems
}
type PS_bool = 'و' | 'یا'
class ConvertPToFilter {
    sentence: string = '';
    columns: PS_column[];
    fields: string[] = [];
    titlesDic: { [key: string]: string } = {};
    titles: string[] = [];
    fieldsDic: { [key: string]: boolean } = {};
    not: boolean = false;
    targets: (string | number)[] = [];
    bool?: PS_bool;
    equalWords: string[] = ['مساوی ', 'به اندازه ', 'به میزان ', 'به مقدار ', 'حدود ', 'برابر ']
    lessWords: string[] = ['کوچکتر ', 'کوچک تر ', 'زیر ', 'کمتر ', 'کم تر ', 'قبل از ']
    moreWords: string[] = ['بیشتر ', 'بیش تر ', 'بالای ', 'بیش از ', 'بزرگتر ', 'بزرگ تر ', 'بعد از ']
    betweenWords: string[] = ['بین ']
    notWords: string[] = ['نباشد', 'نباید', 'نباشند', 'نیستند', 'نیست', 'ندارد', 'ندارند', 'نداشته باشد', 'نداشته باشند', 'نشده باشد', 'نشده باشند']
    constructor(columns: PS_column[]) {
        this.columns = columns;
        this.getFieldsAndTitles();
    }
    convert = (sentence: string): PS_filter | false => {
        if (!sentence) { return false }
        this.sentence = sentence;
        this.getTargets();
        const field = this.getField();
        if (!field) { return false }
        const not = this.isNot();
        const operator = this.getOperator();
        if (!operator) { return false }
        return { field, validation: { operator, targets: this.targets, not, bool: this.bool } }
    }
    getField = () => {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if (this.sentence.indexOf(field) !== -1) { return field }
        }
        for (let i = 0; i < this.titles.length; i++) {
            const title = this.titles[i];
            if (this.sentence.indexOf(title) !== -1) { return this.titlesDic[title] }
        }
    }
    getFieldsAndTitles = () => {
        for (let i = 0; i < this.columns.length; i++) {
            const { title, field } = this.columns[i];
            if (field !== undefined) {
                this.fieldsDic[field] = true;
                this.fields.push(field);
                if (title) {
                    this.titlesDic[title] = field;
                    this.titles.push(title)
                }
            }
        }
    }
    getTargets = (): void => {
        const start = this.sentence.indexOf('(') + 1;
        const end = this.sentence.indexOf(')');
        let value = this.sentence.slice(start, end);
        let { text, bool } = this.replaceAndOr(value);
        const values = text.split(` ${bool} `);
        let targets: (string | number)[] = [];
        for (let i = 0; i < values.length; i++) {
            const res: string | number = this.getTarget(values[i]);
            if (res !== undefined) {
                targets.push(res)
            }
        }
        if (targets.length) { this.sentence = this.sentence.replace(/\(.*?\)/g, ''); }
        this.targets = targets;
        this.bool = bool;
    }
    getTarget = (res: string): string | number => {
        let result;
        if (this.fieldsDic[res]) { result = `field_${res}` }
        else if (this.titlesDic[res]) { result = `field_${this.titlesDic[res]}` }
        else {
            const num = +res
            if (isNaN(num)) { result = res.replace(/['"]/g, '') }
            else { result = num }
        }
        return result
    }
    isNot = (): boolean => {
        for (let i = 0; i < this.notWords.length; i++) {
            const word = this.notWords[i];
            if (this.sentence.indexOf(word) !== -1) {
                this.sentence = this.sentence.replace(word, '')
                return true
            }
        }
        return false
    }
    getOperator = (): AV_operator | false => {
        if (!this.targets.length) { return 'required' }
        if (this.sentence.indexOf('مخالف ') !== -1) { return '=' }
        else if (this.sentence.indexOf('نا برابر ') !== -1) { return '=' }
        else if (this.sentence.indexOf('نا مساوی ') !== -1) { return '=' }
        else {
            if (this.sentence.indexOf('شروع شود') !== -1) { return 'startBy' }
            if (this.sentence.indexOf('شامل') !== -1) { return 'contain' }
            let equal: boolean = false;
            for (let i = 0; i < this.equalWords.length; i++) {
                const eo = this.equalWords[i];
                if (this.sentence.indexOf(eo) !== -1) { equal = true; break; }
            }
            for (let i = 0; i < this.betweenWords.length; i++) {
                if (this.sentence.indexOf(this.betweenWords[i]) !== -1) {
                    if (equal) { return '<=>' } else { return '<>' }
                }
            }
            for (let i = 0; i < this.moreWords.length; i++) {
                if (this.sentence.indexOf(this.moreWords[i]) !== -1) {
                    if (equal) { return '>=' } else { return '>' }
                }
            }
            for (let i = 0; i < this.lessWords.length; i++) {
                if (this.sentence.indexOf(this.lessWords[i]) !== -1) {
                    if (equal) { return '<=' } else { return '<' }
                }
            }
            if (!equal) { return false }
            return '='
        }
    }
    replaceAndOr = (text: string): { text: string, bool?: PS_bool } => {
        const firstAndIndex = text.search(/\bو\b/), firstOrIndex = text.search(/\bیا\b/);
        let replaceTarget, bool: PS_bool;
        if (firstAndIndex !== -1 && (firstOrIndex === -1 || firstAndIndex < firstOrIndex)) {
            replaceTarget = /\bیا\b/g;
            bool = "و";
        }
        else if (firstOrIndex !== -1 && (firstAndIndex === -1 || firstOrIndex < firstAndIndex)) {
            replaceTarget = /\bو\b/g;
            bool = "یا";
        }
        else { return { text }; }
        return { text: text.replace(replaceTarget, bool), bool };
    }
}
//فیلتر آرایه ای از آرایه ها باید باشد که آرایه داخلی ها اور و آرایه خارجی ها اند می شوند
export function FilterRows(rows: any[], filters: PS_filter[][]) {
    function getValueByField(row: any, field: string) {
        return row[field];
    }
    function getUnitResult(row: any, field: string, validation: PS_validation): boolean {
        const value = getValueByField(row, field)
        const { targets, operator, not, bool } = validation;
        if (operator === '<>' || operator === '<=>') {
            return !!new Validation({ value, validations: [{ operator, target: targets, not }] })
        }
        else if (targets.length === 1) {
            return !!new Validation({ value, validations: [{ operator, target: targets[0], not }] })
        }
        let foundMatch = false;
        let foundNotMatch = false;
        for (let i = 0; i < targets.length; i++) {
            const res: boolean = !!new Validation({ value, validations: [{ operator, target: targets[i], not }] })
            if (res) {//اگر مچ نبود
                foundNotMatch = true
                if (bool === 'و') { return false }
            }
            else {//اگر مچ بود
                if (bool === 'یا') { return true }
                foundMatch = true;
            }
        }
        if (bool === 'و') { return !foundNotMatch }
        else { return foundMatch }
    }
    function getOrResult(filters: PS_filter[], row: any): boolean {
        for (let i = 0; i < filters.length; i++) {
            const { field, validation } = filters[i];
            let operator: AV_operator, targets: any[], not: boolean, bool: PS_bool | undefined;
            if (typeof validation === 'string') {
                const res = ValidationTextToObject(validation);
                operator = res.operator;
                targets = !Array.isArray(res.target) ? [res.target] : res.target;
                not = res.not;
                bool = 'و'
            }
            else {
                operator = validation.operator;
                targets = validation.targets;
                not = validation.not;
                bool = validation.bool;
            }
            targets = targets.map((t) => {
                if (typeof t === 'string' && t.indexOf('field_') === 0) {
                    return getValueByField(row, t.slice(6, t.length))
                }
                return t;
            })
            const res = getUnitResult(row, field, { targets, not, operator, bool })
            if (res) {//اگر مچ بود
                return true
            }
        }
        return false
    }
    let result: any[] = [];
    const ands: PS_filter[][] = filters;
    for (let i = 0; i < rows.length; i++) {
        let isMatch = true;
        const row = rows[i];
        for (let j = 0; j < ands.length; j++) {
            const and: PS_filter[] = ands[i];
            const res = getOrResult(and, row);
            if (!res) { isMatch = false; break; }
        }
        if (isMatch) { result.push(row) }
    }
    return result;
}
type I_color = any
type I_color_type = 'rgb' | 'hex' | 'array'
export class AIOColors {
    number_to_hex: (number: number) => string;
    getType: (c: I_color) => I_color_type;
    to_array: (c: I_color) => number[];
    between: (c1: I_color, c2: I_color, count: number) => string[];
    getBetween: (v: (string | number)[]) => I_color[]
    to_dark: (c: I_color, percent: number) => I_color;
    to_light: (c: I_color, percent: number) => I_color;
    brightness: (c: I_color, percent: number) => I_color;
    to_hex: (c: I_color) => string;
    to_rgb: (c: I_color) => string;
    log: (c: I_color[]) => void;
    getRandomRGB: (c1?: I_color, c2?: I_color) => string;
    reverse: (c: I_color) => I_color;
    constructor() {
        this.number_to_hex = (num) => {
            const str = num.toString(16); return str.length === 1 ? "0" + str : str;
        }
        this.getType = (c) => {
            if (Array.isArray(c)) { return 'array' }
            return c.indexOf('rgb') !== -1 ? 'rgb' : 'hex';
        }
        this.to_array = (c) => {
            if (Array.isArray(c)) { return c }
            if (c.indexOf('rgb(') === 0) {
                return c.slice(c.indexOf('(') + 1, c.indexOf(')')).split(',').map((o: string) => +o);
            }
            c = c.substr(1);
            let values = c.split(''), r, g, b;
            if (c.length === 3) {
                r = parseInt(values[0] + values[0], 16);
                g = parseInt(values[1] + values[1], 16);
                b = parseInt(values[2] + values[2], 16);
            }
            else if (c.length === 6) {
                r = parseInt(values[0] + values[1], 16);
                g = parseInt(values[2] + values[3], 16);
                b = parseInt(values[4] + values[5], 16);
            }
            return [r, g, b];
        }
        this.between = (c1, c2, count) => {
            let [r1, g1, b1] = this.to_array(c1);
            let [r2, g2, b2] = this.to_array(c2);
            let rDelta = (r2 - r1) / (count - 1);
            let gDelta = (g2 - g1) / (count - 1);
            let bDelta = (b2 - b1) / (count - 1);
            let colors = [];
            for (var i = 0; i < count; i++) {
                let color = `rgb(${Math.round(r1 + rDelta * i)},${Math.round(g1 + gDelta * i)},${Math.round(b1 + bDelta * i)})`;
                colors.push(color)
            }
            return colors;
        }
        this.getBetween = (array) => {
            let res: I_color[] = [];
            let colors: I_color[] = []
            let counts: number[] = []
            for (let i = 0; i < array.length; i++) {
                let a = array[i];
                let b = Array.isArray(a) ? this.to_rgb(a) : a
                if (typeof b === 'string') { colors.push(b) }
                else if (typeof b === 'number') { counts.push(b) }
            }
            for (let i = 0; i < colors.length - 1; i++) {
                const c1 = colors[i];
                const c2 = colors[i + 1];
                const count = counts[i];
                res = [...res, this.between(c1, c2, count)]
            }
            return res
        }
        this.to_dark = (c, percent) => {
            let [r, g, b] = this.to_array(c);
            r = Math.round(r - (r * (percent / 100)))
            g = Math.round(g - (g * (percent / 100)))
            b = Math.round(b - (b * (percent / 100)))
            const type: I_color_type = this.getType(c)
            const key = 'to_' + type as 'to_array' | 'to_hex' | 'to_rgb'
            const fn: any = (this as any)[key]
            return fn([r, g, b])
        }
        this.to_light = (c, percent) => {
            let [r, g, b] = this.to_array(c);
            r = Math.round(r + ((255 - r) * (percent / 100)))
            g = Math.round(g + ((255 - g) * (percent / 100)))
            b = Math.round(b + ((255 - b) * (percent / 100)))
            const type: I_color_type = this.getType(c)
            const key = 'to_' + type as 'to_array' | 'to_hex' | 'to_rgb'
            const fn: any = (this as any)[key]
            return fn([r, g, b])
        }
        this.to_hex = (c) => { return `#${this.to_array(c).map((o) => this.number_to_hex(o)).join('')}`; }
        this.to_rgb = (c) => { return `rgb(${this.to_array(c).toString()})`; }
        this.brightness = (c, percent) => {
            if (percent === 0) { return c }
            if (percent < 0) { return this.to_dark(c, percent * -1) }
            if (percent > 0) { return this.to_light(c, percent) }
        }
        this.log = (c) => {
            for (let i = 0; i < c.length; i++) {
                let color = this.to_rgb(c[i]);
                console.log(`%c ${this.reverse(color)}`, 'background: ' + color + '; color: #000');
            }
        }
        this.getRandomRGB = (c1 = '#000', c2 = '#fff') => {
            const array1 = this.to_array(c1)
            const array2 = this.to_array(c2)
            let r = GetRandomNumber(array1[0], array2[0]);
            let g = GetRandomNumber(array1[1], array2[1]);
            let b = GetRandomNumber(array1[2], array2[2]);
            return this.to_rgb([r, g, b])
        }
        this.reverse = (c) => { return (this as any)['to_' + this.getType(c)](this.to_array(c).map((o) => 255 - o)) }
    }
}
class GetSvg {
    getStyle = (color?: string) => {
        const fill = color || "currentcolor"
        return { fill }
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
    mdiChevronDown = (color?: string) => (<><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" style={this.getStyle(color)}></path></>)
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
    mdiChevronRight = (color?: string) => (<><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" style={this.getStyle(color)}></path></>)
    mdiChevronLeft = (color?: string) => (<><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" style={this.getStyle(color)}></path></>)
    mdiArrowDown = (color?: string) => (<><path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z" style={this.getStyle(color)}></path></>)
    mdiArrowUp = (color?: string) => (<><path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" style={this.getStyle(color)}></path></>)
    mdiFileExcel = (color?: string) => (<><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.8,20H14L12,16.6L10,20H8.2L11.1,15.5L8.2,11H10L12,14.4L14,11H15.8L12.9,15.5L15.8,20M13,9V3.5L18.5,9H13Z" style={this.getStyle(color)}></path></>)
    mdiSort = (color?: string) => (<><path d="M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z" style={this.getStyle(color)}></path></>)
    mdiDelete = (color?: string) => (<><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" style={this.getStyle(color)}></path></>)
    mdiCircleSmall = (color?: string) => (<><path d="M12,10A2,2 0 0,0 10,12C10,13.11 10.9,14 12,14C13.11,14 14,13.11 14,12A2,2 0 0,0 12,10Z" style={this.getStyle(color)}></path></>)
    mdiMicrophoneOutline = (color?: string) => (<><path d="M17.3,11C17.3,14 14.76,16.1 12,16.1C9.24,16.1 6.7,14 6.7,11H5C5,14.41 7.72,17.23 11,17.72V21H13V17.72C16.28,17.23 19,14.41 19,11M10.8,4.9C10.8,4.24 11.34,3.7 12,3.7C12.66,3.7 13.2,4.24 13.2,4.9L13.19,11.1C13.19,11.76 12.66,12.3 12,12.3C11.34,12.3 10.8,11.76 10.8,11.1M12,14A3,3 0 0,0 15,11V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V11A3,3 0 0,0 12,14Z" style={this.getStyle(color)}></path></>)
}
export { GetSvg }



export class getRandomByPriority {
    private list: any[];
    private idField: string;
    constructor(p: { list: any[], priorityField: string, idField: string }) {
        this.idField = p.idField
        this.list = this.getList(p.list, p.priorityField);
    }
    private getList = (list: any[], priorityField: string) => {
        const newList = [];
        for (let i = 0; i < list.length; i++) {
            const row = list[i];
            const priority = row[priorityField] || 1;
            if (!priority) { continue }
            for (let j = 0; j < priority; j++) {
                newList.push(row);
            }
        }
        return newList
    }
    private remove = (index: number, type?: 'remove one' | 'remove all') => {
        if (!type) { return }
        const id = this.list[index][this.idField]
        if (type === 'remove one') { this.list.splice(index, 1) }
        else { this.list = this.list.filter((o) => o[this.idField] !== id) }
    }
    getItem = (type?: 'remove one' | 'remove all') => {
        const randomIndex = GetRandomNumber(0, this.list.length - 1);
        const item = this.list[randomIndex]
        this.remove(item, type)
        return item;
    }
}
export function FakeName(p: { type: 'firstname' | 'lastname' | 'fullname', gender?: 'male' | 'female', lang: 'en' | 'fa' }) {
    const names = {
        firstname_male_fa: [
            'آرمان', 'آرمین', 'آراد', 'آریا', 'ایمان', 'احمد', 'امیر علی', 'امیر', 'اسفندیار', 'اردلان', 'اکبر', 'اسماعیل', 'ابراهیم', 'احسان', 'بهمن', 'باقر', 'بردیا', 'برنا', 'باراد', 'بهروز', 'بیژن', 'پویا', 'پیمان', 'پدرام', 'پارسا', 'پرهام', 'پویان', 'حسن', 'حسین', 'حامد', 'حمید', 'حافظ', 'حسام',
            'خشایار', 'داریوش', 'داوود', 'دانیال', 'رضا', 'رامین', 'رحمت', 'رحمان', 'رحیم', 'رایبد', 'رادمان', 'رادین', 'رضوان', 'ساسان', 'سامان', 'سینا', 'سعید', 'سپهر', 'سجاد', 'سورنا', 'سیروس', 'سالار', 'شریف', 'شهاب', 'شاهین', 'شایان', 'شاهد', 'شهریار', 'صادق', 'عادل', 'علی', 'عباس', 'عماد', 'عرفان', 'علی رضا', 'علی محمد',
            'فرخ', 'فرهاد', 'فرشاد', 'فرشید', 'فرید', 'فربد', 'فرامرز', 'فرزین', 'فراز', 'فاضل', 'کاظم', 'کوروش', 'کریم', 'مجید', 'محمد', 'محمود', 'مصطفی', 'محسن', 'مهران', 'مهدی', 'مهبد', 'ماهور', 'ماهان', 'محمد رضا', 'محمد مهدی', 'مجید رضا', 'محمد حسین',
            'نیما', 'وحید', 'هادی', 'هامون', 'یوسف'
        ],
        firstname_female_fa: [
            'الناز', 'المیرا', 'الهام', 'السا', 'احترام', 'بهار', 'باران', 'بیتا', 'بهناز', 'بهاره', 'بنفشه', 'بهاره', 'پارمیدا', 'پانته آ', 'پریا', 'پروین', 'پرستو', 'پرنیا', 'پریماه', 'پریناز', 'پریسا', 'تهمینه', 'تارا', 'تینا', 'ترنم', 'ترمه', 'جمیله', 'جیران', 'جانان',
            'حمیده', 'حسنی', 'حسنا', 'حمیرا', 'دینا', 'دلارام', 'رها', 'رویا', 'ریما', 'ریحانه', 'راضیه', 'ژیلا', 'ژینا', 'ژاله', 'سمانه', 'ساحل', 'سمیرا', 'سارا', 'سوسن', 'ساناز', 'سیما', 'سهیلا', 'سحر', 'شیما', 'شهلا', 'شهره', 'شهرزاد', 'شیلا',
            'عاطفه', 'عطیه', 'غزل', 'غزاله', 'فرهناز', 'فریده', 'فروزنده', 'فرزانه', 'فرگل', 'فهیمه', 'فرناز', 'فرنگیس', 'فاطمه', 'فرخنده', 'فریماه', 'فرشته', 'کتایون', 'کیمیا', 'کیانا', 'مهنوش', 'مهسا', 'مهناز', 'مهشاد', 'مهشید', 'مینا', 'منا', 'مهرنوش'
        ],
        lastname_fa: [
            'احمدی', 'اردستانی', 'امینی', 'الهی', 'احسانی', 'اشتیاق', 'ابوالحسنی', 'اسماعیلی', 'اختیاری', 'اشراقی', 'اثباتی', 'بقایی', 'براتی', 'بینا', 'باقری', 'بهرامی', 'پیروز', 'پرویزی', 'پهلوانی', 'پیروی', 'پور غلامی', 'پور صمیمی', 'پازوکی', 'پاشایی', 'ترابی', 'تیموری', 'تشکری', 'جمالی', 'جهرمی', 'جلالی', 'جبلی', 'جباری',
            'چنگیزی', 'حمیدی', 'حسنی', 'حسینی', 'حبیبی', 'حیدری', 'خالقی', 'خندان', 'خسروی', 'خاقانی', 'خراسانی', 'دارابی', 'دهنوی', 'دشتی', 'دهستانی', 'زمانی', 'زواری', 'زرندی', 'زنگنه', 'سامانی', 'سلیمانی', 'سپهری', 'سزاوار', 'سرمد', 'سرافراز', 'رضایی', 'رمضانی', 'رحمانی', 'رحمتی', 'رضوانی', 'ربیعی', 'رادمهر', 'ریحانی', 'رستمی', 'رواقی', 'رشیدی', 'رشادی', 'رضوی', 'رفیعی',
            'فقیهی', 'فریدونی', 'فردوسی', 'فرامرزی', 'فرید نیا', 'فرحی', 'فرهمند', 'فرهودی', 'فهیمی', 'فراهانی', 'فاضلی', 'قهرمانی', 'قریبی', 'قوامی', 'قاسمی', 'کاظمی', 'کلهر', 'کرمی', 'کریمی', 'کوچک زاده', 'کمالی', 'کیوانی', 'کلاهدوز', 'کاملی', 'کامیاب', 'گودرزی', 'گرشاسبی', 'گایینی', 'لسانی', 'لرستانی', 'لقمانی', 'لشکری',
            'محمدی', 'مرندی', 'محسنی', 'مجیدی', 'میثاقی', 'مروتی', 'مردانی', 'محمودی', 'مسجد جامعی', 'مصطفوی', 'محلوجی', 'مرادی', 'مهستانی', 'مرودشتی', 'مشکاتی', 'مرتضوی', 'مسعودی', 'مقصودی', 'منافی', 'مطلق', 'منطقی', 'نریمانی', 'نیشابوری', 'نیستانی', 'نبوی', 'ناصری', 'نیمایی', 'ناسوتی', 'ناطقی', 'نشتارودی', 'نوری', 'نور محمدی', 'نوایی', 'نهری', 'نامی', 'نامدار', 'نایینی',
            'وحیدی', 'واسقی', 'ورامینی', 'واصلی', 'واحدی', 'وحدت', 'ورعی', 'والایی', 'وزیری', 'هادیان', 'همراه', 'همایونی', 'هویدا', 'هدایتی', 'هاتفی', 'هشترودی', 'هاشمی', 'یحیوی', 'یاسری', 'یادگار', 'یثربی', 'یونسی', 'یوسفی', 'یارمحمدی', 'یداللهی',
        ],
        firstname_male_en: [],
        firstname_female_en: [],
        lastname_en: []
    }
    const getfirstnames = () => {
        if (p.gender === 'male') { return names[`firstname_male_${p.lang}`] }
        else if (p.gender === 'female') { return names[`firstname_female_${p.lang}`] }
        else { return [...names[`firstname_male_${p.lang}`], ...names[`firstname_female_${p.lang}`]] }
    }
    const getfirstname = () => {
        const firstnames = getfirstnames()
        const index = GetRandomNumber(0, firstnames.length - 1);
        return firstnames[index];
    }
    const getlastname = () => { return names[`lastname_${p.lang}`] }
    if (p.type === "firstname") { return getfirstname() }
    if (p.type === "lastname") { return getlastname() }
    return `${getfirstname()} ${getlastname()}`
}
