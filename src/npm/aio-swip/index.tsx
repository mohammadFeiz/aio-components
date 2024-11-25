import Geo from './../../npm/aio-geo';
import { EventHandler,GetClient } from '../aio-utils';
import $ from 'jquery';
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
export default class Swip {
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
