import * as ReactDOMServer from 'react-dom/server';
import $ from 'jquery';


export type I_Date = string | number | Date | { year?: number, month?: number, day?: number, hour?: number, minute?: number } | number[];
export type I_point = number[]
export type I_line = [I_point, I_point]
export type I_dline = [number, number, number]//x,y,dip
export type I_dip = number
export type I_arc = { x: number, y: number, r: number, slice?: number[] }
export type I_rect = [I_point, I_point]
export function HasClass(target: any, className: string) {
    return target.hasClass(className) || !!target.parents(`.${className}`).length
}
export async function DownloadFile(file:any) {
    let name = file.name;
    let url = GetFileUrl(file)
    fetch(url, {
        mode: 'no-cors',
    })
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
export function GetFileUrl(file:any){
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
export function GetPrecisionCount(number:number) {
    // Convert the number to a string
    number = number || 0;
    const numberString = number.toString();
    const decimalIndex = numberString.indexOf('.');
    if (decimalIndex === -1) {return 0;}
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
export function ParseString(str:string):any{
    // Check if the string starts and ends with a quote character
    try{
        if (str.startsWith("{") || str.startsWith('[')){return JSON.parse(str);}
        else if ((str.startsWith("'") && str.endsWith("'")) || (str.startsWith('"') && str.endsWith('"'))){return str.slice(1, -1);} 
        else {let res = parseFloat(str); return isNaN(res)?str:res}
    }
    catch{return str}
}
export class DragClass {
    dragIndex: number;
    onChange: (list: any[], from: any, to: any) => void;
    start: (e: any) => void;
    over: (e: any) => void;
    drop: (e: any, list: any[]) => void;
    swap: (arr: any[], from: any, to: any) => any[];
    className: string;
    getAttrs: (list: any[], index: number) => any;
    constructor(p: { onChange: (list: any[], from: any, to: any) => void, className: string }) {
        this.dragIndex = 0;
        this.className = p.className;
        this.onChange = p.onChange;
        this.start = (e) => { this.dragIndex = parseInt($(e.target).attr('data-index') as any); }
        this.over = (e) => { e.preventDefault(); }
        this.drop = (e, list) => {
            e.stopPropagation();
            let from = this.dragIndex, dom = $(e.target);
            if (!dom.hasClass(this.className)) { dom = dom.parents(`.${this.className}`); };
            if (!dom.hasClass(this.className)) { return };
            let to = parseInt(dom.attr('data-index') as any);
            if (from === to) { return }
            if (typeof this.onChange === 'function') {
                let newList = this.swap(list, from, to);
                this.onChange(newList, list[from], list[to])
            }
        }
        this.swap = (arr, from, to) => {
            if (to === from + 1) { let a = to; to = from; from = a; }
            let Arr = arr.map((o, i) => { o._testswapindex = i; return o })
            let fromIndex = Arr[from]._testswapindex
            Arr.splice(to, 0, { ...Arr[from], _testswapindex: false })
            return Arr.filter((o) => o._testswapindex !== fromIndex)
        }
        this.getAttrs = (list, index) => {
            return {
                ['data-index']: index,
                onDragStart: this.start,
                onDragOver: this.over,
                onDrop: (e: any) => this.drop(e, list),
                draggable: true
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
    var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend",click:'click' };
    let touch = 'ontouchstart' in document.documentElement
    let fixedEvent = touch ? me[event] : event;
    var element: any = typeof selector === "string" ? (selector === "window" ? $(window) : $(selector)) : selector;
    element.unbind(fixedEvent, action);
    if (type === 'bind') { element.bind(fixedEvent, action) }
}
export function getValueByStep(p:{ value:number, start:number, step:number, end:number }) {
    let { value, start, step, end } = p;
    let res = Math.round((value - start) / step) * step + start;
    if (res < start) { res = start }
    if (res > end) { res = end }
    return res;
}
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
function IsFileTypeValid(file:any):boolean {
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
export function FilePreview(file:any,attrs?:any):React.ReactNode {
    if(!IsFileTypeValid(file)){return null}
    let url:string = GetFileUrl(file);
    return <img src={url} alt={file.name} title={file.name} objectFit='cover' {...attrs}/>
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
    catch (err:any) {
        console.log(err.message)
    }
}
export function Search(items: any[], searchValue: string, getValue: (item: any, index: number) => any = (o) => o): any[] {
    if (!searchValue) { return items }
    function isMatch(keys:string[], value:string) {
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (value.indexOf(key) === -1) { return false }
        }
        return true
    }
    let keys = searchValue.split(' ');
    return items.filter((o, i) => isMatch(keys, getValue(o, i)))
}
export function GenerateComponsition(p:{ level?:number, length?:number, childsField?:string, fields:any }) {
    let { level: maxLevel = 4, length = 4, childsField = 'childs', fields = {} } = p;
    let $$ = {
        generate(level = 0, index = '') {
            if (level >= maxLevel) { return [] }
            let res = []
            for (let i = 0; i < length; i++) {
                let newIndex = index + '-' + i;
                let newItem:any = {
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
export function CalculateDistance(lat1:number, lon1:number, lat2:number, lon2:number) {
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
export function getEventAttrs(eventType: 'onMouseDown' | 'onMouseMove' | 'onMouseUp', callback:(e:any)=>void) {
    let touch = IsTouch()
    let fixedEvent: string;
    if (touch) { fixedEvent = { 'onMouseDown': 'onTouchStart', 'onMouseMove': 'onTouchMove', 'onMouseUp': 'onTouchEnd' }[eventType]; }
    else { fixedEvent = eventType }
    return { [fixedEvent]: callback }
}
function toRadians(degree:number) {
    return degree * (Math.PI / 180);
}
export function AddToAttrs(attrs: any, p: any) {
    attrs = attrs || {};
    let { style } = p;
    let attrClassName = attrs.className ? attrs.className.split(' ') : [];
    let className = p.className ? (Array.isArray(p.className) ? p.className : p.className.split(' ')) : [];
    let classNames = [...attrClassName, ...className.filter((o:any) => !!o)];
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
    change: I_Swip_change, mousePosition: I_Swip_mousePosition, domLimit: I_Swip_domLimit, parentLimit: I_Swip_domLimit, event: any,selectRect?:I_Swip_selectRect,
    isInSelectRect?:I_Swip_isInSelectRect
}
type I_Swip_selectRect_config = {color?:string,enable:()=>boolean}
export type I_Swip = {
    dom: () => any,
    parent?: () => any,
    onClick?: (p: I_Swip_parameter) => void,
    page?: () => any,
    start?: (p: I_Swip_parameter) => number[],
    move?: (p: I_Swip_parameter) => void,
    end?: (p: I_Swip_parameter) => void,
    selectRect?:I_Swip_selectRect_config,
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
type I_Swip_isInSelectRect = (x:number,y:number)=>boolean
type I_Swip_getIsInSelectrect = (selectRect:I_Swip_selectRect)=>I_Swip_isInSelectRect
export type I_Swip_selectRect = {left:number,top:number,width:number,height:number};
export type I_Swip_tempSelectRect = {left:number,top:number};
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
    so: { client?: { x: number, y: number }, x?: number, y?: number,sr?:I_Swip_selectRect,tsr?:I_Swip_tempSelectRect };
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
    defaultLimit:I_Swip_domLimit;
    addSelectRect:(x:number,y:number)=>void;
    setSelectRect:(width:number,height:number)=>void;
    removeSelectRect:()=>void;
    selectRect?:I_Swip_selectRect_config;
    getIsInSelectRect:I_Swip_getIsInSelectrect;
    defaultChange:I_Swip_change;
    constructor(p: I_Swip) {
        let {selectRect} = p;
        if(selectRect){
            let {color = '#96a9bc'} = selectRect;
            this.selectRect = {...selectRect,color}; 
        }
        this.defaultChange = {x: 0, y: 0,dx: 0, dy: 0,dist: 0,angle: 0,deltaCenterAngle: 0}
        this.defaultLimit = {width:0,height:0,left:0,top:0,right:0,bottom:0,centerX:0,centerY:0}
        this.domLimit = this.defaultLimit;
        this.parentLimit = this.defaultLimit;
        this.change = {x:0,y:0,dx:0,dy:0,dist:0,angle:0,deltaCenterAngle:0}
        this.addSelectRect= ()=>{}
        this.setSelectRect= ()=>{}
        this.removeSelectRect= ()=>{}
        this.so = {}
        this.p = p;
        this.geo = new Geo();
        this.timeout = undefined;
        this.count = 0;
        this.getDom = () => p.dom();
        this.getParent = () => p.parent?p.parent():undefined;
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
            let clickParams: I_Swip_parameter = { mousePosition, domLimit: this.domLimit, parentLimit: this.parentLimit, event: e,
                change:this.defaultChange }
            if(p.onClick){p.onClick(clickParams)}
        }
        this.addSelectRect = (left:number,top:number)=>{
            if(!this.selectRect || !this.selectRect.enable()){return}
            let {color} = this.selectRect;
            let dom = this.getDom();
            this.so.tsr = {left,top};
            this.removeSelectRect();
            dom.append(`<div class="swip-select-rect" style="border:1px dashed ${color};background:${color + '30'};left:${left}px;top:${top}px;position:absolute;width:0;height:0"></div>`)
        }
        this.setSelectRect = (width:number,height:number)=>{
            if(!this.selectRect || !this.selectRect.enable()){return}
            let dom = this.getDom();
            let SR = dom.find('.swip-select-rect');
            let {tsr = {left:0,top:0}} = this.so || {};
            let left = tsr.left;
            let top = tsr.top;
            if(width < 0){
                left = left + width;
                width = Math.abs(width)
            }
            if(height < 0){
                top = top + height;
                height = Math.abs(height)
            }
            let newSelectRect:I_Swip_selectRect = {left,top,width,height}
            this.so.sr = newSelectRect;
            SR.css(newSelectRect)
        }
        this.removeSelectRect = ()=>{
            if(!this.selectRect || !this.selectRect.enable()){return}
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
            this.addSelectRect(mousePosition.x,mousePosition.y);
            let startParams: I_Swip_parameter = { mousePosition, domLimit: this.domLimit, parentLimit: this.parentLimit, event: e,change:this.defaultChange }
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
            this.setSelectRect(dx,dy);
            let x:number = 0, y:number = 0;
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
                selectRect:this.so.sr,
                isInSelectRect:this.getIsInSelectRect(this.so.sr || {left:0,top:0,width:0,height:0})

            }
            if (this.p.move) { this.p.move(p); }
        }
        this.getIsInSelectRect = (selectRect:I_Swip_selectRect)=>{
            let {left,top,width,height} = selectRect;
            return (x:number,y:number)=>{            
                if(x < left){return false}
                if(y < top){return false}
                if(x > left + width){return false}
                if(y > top + height){return false}
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
                selectRect:this.so.sr,
                isInSelectRect:this.getIsInSelectRect(this.so.sr || {left:0,top:0,width:0,height:0})
            }
            if (this.p.end) { this.p.end(p) }
        }
        this.init()
    }
}
export class AIODate {
    isMatch: (date: I_Date, matchers: string[]) => boolean;
    convertToArray: (date: I_Date, jalali?: boolean) => number[];
    isAny: (date1: I_Date, date2: I_Date, key: 'less' | 'greater' | 'equal') => boolean;
    isLess: (date1: I_Date, date2: I_Date) => boolean;
    isGreater: (date1: I_Date, date2: I_Date) => boolean;
    isEqual: (date1: I_Date, date2: I_Date) => boolean;
    isBetween: (date1: I_Date, dates: [I_Date, I_Date]) => boolean;
    getWeekDay: (date: I_Date) => { weekDay: string, index: number }
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
    constructor() {
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
                if (typeof (date as { year: number }).year === 'number') {
                    let dateObject = date as { year: number, month: number, day: number, hour: number }
                    return [dateObject.year, dateObject.month, dateObject.day, dateObject.hour]
                }
                else {
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
            }
            else { return [] }
            if (jalali) {
                let [year, month, day] = this.toJalali([list[0], list[1], list[2]]);
                list[0] = year; list[1] = month; list[2] = day;
            }
            return list
        }
        this.isAny = (o1, o2, key) => {
            if (!o1 || !o2) { return false }
            o1 = this.convertToArray(o1);
            o2 = this.convertToArray(o2);
            let compaireKey = 'equal';
            for (let i = 0; i < o1.length; i++) {
                if (isNaN(o2[i])) { o2[i] = o1[i] }
                let a = o1[i];
                let b = o2[i] || 0;
                if (a < b) { compaireKey = 'less' }
                if (a > b) { compaireKey = 'greater' }
            }
            return compaireKey === key
        }
        this.isLess = (o1, o2) => this.isAny(o1, o2, 'less')
        this.isEqual = (o1, o2) => this.isAny(o1, o2, 'equal')
        this.isGreater = (o1, o2) => this.isAny(o1, o2, 'greater')
        this.isBetween = (o1, [o2, o3]) => this.isAny(o1, o2, 'greater') && this.isAny(o1, o3, 'less')
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
        this.get2Digit = (n:number) => {
            let ns:string;
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
        this.getDaysOfWeek = (date, pattern) => {
            if (!date) { return [] }
            let dateArray = this.convertToArray(date);
            let { index } = this.getWeekDay(dateArray);
            let startDate = this.getNextTime([dateArray[0], dateArray[1], dateArray[2]], -(index + 1) * 24 * 60 * 60 * 1000);
            let endDate = this.getNextTime([dateArray[0], dateArray[1], dateArray[2]], (7 - index) * 24 * 60 * 60 * 1000);
            return this.getDatesBetween(startDate, endDate, 24 * 60 * 60 * 1000)
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
            let type:'remaining' | 'passed' | 'now';
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
            let dateArray = this.convertToArray(date);
            let firstDay = [dateArray[0], dateArray[1], 1];
            let lastDay = this.getLastDayOfMonth(dateArray)
            let betweenDayes = this.getDatesBetween(firstDay, lastDay, 24 * 60 * 60 * 1000);
            let result = [firstDay];
            result = result.concat(betweenDayes);
            result.push(lastDay as number[]);
            if (pattern) {
                return result.map((o) => this.getDateByPattern(o, pattern))
            }
            return result;
        }
        this.getLastDayOfMonth = (date) => {
            let dateArray:number[] = this.convertToArray(date);
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
            let p1: I_point = [0,0], p2: I_point = [0,0], angle = this.getAngle(line);
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
function svgArcRange(centerX:number, centerY:number, radius:number, angleInDegrees:number) {
    let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}
export function svgArc(x:number, y:number, radius:number, startAngle:number, endAngle:number) {
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
            let newTime:any = {};
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