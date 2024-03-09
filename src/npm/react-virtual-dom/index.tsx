import React, { Fragment, createContext, useCallback, useContext, useState } from "react";
import $ from 'jquery';
import "./index.css";
let RVDCLS = {
    rvd: 'rvd', pointer: 'rvd-pointer', gap: 'rvd-gap',
    row: 'rvd-row', column: 'rvd-column', hidexs: 'rvd-hide-xs', hidesm: 'rvd-hide-sm', hidemd: 'rvd-hide-md', hidelg: 'rvd-hide-lg'
}
const RVDContext = createContext({} as I_RVD_context);
export type I_RVD_node = {
    align?: 'v' | 'h' | 'vh',
    gap?: number | {size:number,content?:React.ReactNode,attrs?:any} | ((node:I_RVD_node,parent:I_RVD_node,index:number)=>{size:number,content?:React.ReactNode,attrs?:any}),
    data?:any,
    reOrder?: (newData:any[],fromDragIndex: number, toDragIndex: number) => void,
    longTouch?:()=>void,
    size?: number,
    flex?: number,
    html?: React.ReactNode | ((obj:any) => React.ReactNode),
    row?: I_RVD_node[] | ((obj:any)=>I_RVD_node[]),
    column?: I_RVD_node[] | ((obj:any)=>I_RVD_node[]),
    grid?: I_RVD_node[] | ((obj:any)=>I_RVD_node[]),
    gridCols?:number,
    gridRow?:I_RVD_node[] | ((obj:any)=>I_RVD_node[]),
    layout?: string,
    nodeClass?:string,
    nodeClasses?:string[],
    attrs?: any,
    className?: string | ((string | false)[]),
    style?: any,
    onClick?: (e: any) => void,
    show?: boolean | (() => boolean),
    loading?: boolean,
    key?:string | number,
    id?:string | number,
}
export type I_RVD_editNode = (node: I_RVD_node, parent: I_RVD_node) => I_RVD_node;
export type I_RVD_classes = {[key:string]:string|((node:I_RVD_node,parent:I_RVD_node)=>string)}
export type I_RVD_props = {rootNode: I_RVD_node,dragHandleClassName?: string,classes?:I_RVD_classes,rtl?: boolean,state?:any,editNode?: I_RVD_editNode}
type I_RVD_getTemp = (key:string)=>any;
type I_RVD_setTemp = (key:string,value:any)=>void;
type I_RVD_state = any;
type I_RVD_setState = (key:any,value?:any)=>void
type I_RVD_temp = { dragIndex?:false | number, lt?: string, time?: number, timeOut?: any }
type I_RVD_context = {getTemp:I_RVD_getTemp,setTemp:I_RVD_setTemp,rootProps:I_RVD_props,state:I_RVD_state,setState:I_RVD_setState}
export default function ReactVirtualDom(props: I_RVD_props) {
    let {rootNode} = props;
    let [temp] = useState<I_RVD_temp>({});
    function getTemp(key){return temp[key];}
    function setTemp(key,value){temp[key] = value;}
    let [state,changeState] = useState<any>(props.state)
    let setState = (key:any,value:any)=>changeState(typeof key === 'string'?{...state,[key]:value}:key)
    let rootNodeProps:I_RVDNode = {node:rootNode,index:0,level:0};
    let context:I_RVD_context = {getTemp,setTemp,rootProps:props,state,setState};
    return (<RVDContext.Provider value={context}><RVDNode {...rootNodeProps}/></RVDContext.Provider>)
}
type I_RVDNode = {node: I_RVD_node, index: number, parent?: I_RVD_node, level: number}
function RVDNode(props:I_RVDNode){
    let context:I_RVD_context = useContext(RVDContext);
    let {rootProps,state,setState} = context;
    let {parent,index, level} = props;
    function getHtml(node:I_RVD_node) {
        let { html = '', loading } = node;
        html = typeof html === 'function' ? html({state,setState}) : html;
        let res:React.ReactNode;
        if (loading && html) { res = (<><div style={{ opacity: 0 }}>{html}</div><div className='rvd-loading'></div></>) }
        else{res = html}
        return res
    }
    function getChilds(node:I_RVD_node) {
        let childs = [];
        if (node.row) { childs = typeof node.row === 'function' ? node.row({state,setState}) : node.row; }
        else if (node.column) { childs = typeof node.column === 'function' ? node.column({state,setState}) : node.column }
        else if (node.grid) {
            let { gridCols = 2 } = node;
            let grid = typeof node.grid === 'function' ? node.grid({state,setState}) : node.grid;
            for (let i = 0; i < grid.length; i += gridCols) {
                let row = [];
                let gridRow = typeof node.gridRow === 'function' ? node.gridRow(i) : node.gridRow;
                for (let j = i; j < i + gridCols; j++) { if (grid[j]) { row.push(grid[j]) } }
                childs.push({ row: [...row], ...gridRow })
            }
            node.column = [...childs]
        }
        return childs;
    }
    function getNodeClasses(node:I_RVD_node,parent:I_RVD_node){
        let res:string[] = [];
        if(parent && parent.nodeClasses){res = [...parent.nodeClasses]}
        if(node.nodeClass){res = [...res,node.nodeClass]}
        return res; 
    }
    function isLoading(node: I_RVD_node, parent: I_RVD_node): boolean {
        if (typeof node.loading === 'boolean') { return node.loading }
        return parent ? !!parent.loading : false;
    }
    function getNode():I_RVD_node{
        let {node} = props;
        if (!node || node === null) { node = {} }
        if ((typeof node.show === 'function' ? node.show() : node.show) === false) { return null }
        if (rootProps.editNode) { node = rootProps.editNode(node, parent) }
        node.loading = isLoading(node, parent);
        node.nodeClasses = getNodeClasses(node,parent)
        return node
    }
    function getContent(node:I_RVD_node){
        let content:React.ReactNode;
        let childs = getChilds(node);
        if (childs.length) {
            content = childs.map((o, i) => {
                let key = o.key === undefined?i:o.key
                let p:I_RVDNode = {node:o,index:i,level:level + 1,parent:node}
                return <RVDNode key={key} {...p}/>
            })
        }
        else { content = getHtml(node) }
        return content
    }
    let node = getNode()
    let content = getContent(node)
    let attrs = new RVDAttrs({node,parent, level,index,context}).getAttrs();
    let gap = getGap({ node, parent, dataId: attrs['data-id'], rtl:rootProps.rtl, index,state,setState });
    return (
        <>
            <div {...attrs}>{content}</div>
            {gap !== false && <div {...gap.attrs}>{gap.content}</div>}
        </>
    )
}
type I_RVDAttrs = {
    node:I_RVD_node,parent:I_RVD_node,level:number,index:number,context:I_RVD_context
}
class RVDAttrs{
    node:I_RVD_node;
    parent:I_RVD_node;
    level:number;
    index:number;
    context:I_RVD_context;
    constructor(props:I_RVDAttrs){
        let {node,parent,level,index,context} = props;
        this.node = node;
        this.parent = parent;
        this.level = level;
        this.index = index;
        this.context = context;
    }
    getStyle = () => {
        let { size, flex,attrs = {} } = this.node;
        let style = { ...(this.node.style || attrs.style || {}) };
        if (size !== undefined) {
            if(this.parent){
                if (this.parent.row) { style.width = size; flex = undefined }
                else if (this.parent.column || this.parent.grid) { style.height = size; flex = undefined }
            }
        }
        return { flex, ...style }
    }
    getOnClick = () => {
        let { onClick, attrs = {},loading } = this.node;
        if (loading) { return }
        return onClick || attrs.onClick;
    }
    getDragAttrs = () => {
        if (!this.parent || !this.parent.reOrder || !Array.isArray(this.parent.data)) { return {} }
        let {rootProps,getTemp,setTemp} = this.context;
        let {dragHandleClassName} = rootProps;
        let res: any = {};
        res.draggable = true;
        res.onDragStart = (e) => {
            if (dragHandleClassName) {
                if (!$(e.target).hasClass(dragHandleClassName) && $(e.target).parents('.' + dragHandleClassName).length === 0) { return; }
            }
            setTemp('dragIndex',this.index);
        }
        res.onDragOver = (e) => e.preventDefault();
        res.onDrop = () => {
            let dragIndex = getTemp('dragIndex');
            if (dragIndex === false || dragIndex === this.index) { return; }
            this.parent.reOrder(ReOrder({data:this.parent.data,fromIndex:dragIndex, toIndex:this.index}),dragIndex, this.index);
            setTemp('dragIndex',false)
        }
        return res;
    }
    getClassName = () => {
        let {classes = {}} = this.context.rootProps;
        let res = RVDCLS.rvd;
        if (this.level === 0) { res += ' rvd-root' }
        let {attrs = {},nodeClass,nodeClasses,row,column,grid,loading} = this.node
        if (this.node.className) {
            let className:string;
            if(Array.isArray(this.node.className)){className = this.node.className.filter((cls)=>!!cls && typeof cls === 'string').join(' ')}
            else{className = this.node.className}
            let dcls = classes[className];
            if(typeof dcls === 'function'){className = dcls(this.node,this.parent)}
            else if(typeof dcls === 'string'){className = dcls;}
            if(className && typeof className === 'string'){res += ' ' + className;}  
        }
        if(nodeClass){res += ' ' + nodeClasses.join('-')}
        if (!!attrs.onClick) { res += ' ' + RVDCLS.pointer; }
        if(this.node.align){res += ` align-${this.node.align}`}
        if (row) { res += ' ' + RVDCLS.row }
        else if (column || grid) { res += ' ' + RVDCLS.column }
        if(loading){res += ' rvd-parent-loading'}
        let hideClassName = getHideClassName(this.node);
        if (hideClassName) { res += ' ' + hideClassName }
        return res;
    }
    getLongTouchAttrs = (dataId) => {
        let { longTouch } = this.node;
        let {setTemp} = this.context;
        if (typeof longTouch !== 'function') { return {} }
        let res = {};
        res['ontouchstart' in document.documentElement ? 'onTouchStart' : 'onMouseDown'] = (e) => {
            setTemp('lt',dataId);
            setTemp(dataId + 'callback',longTouch);
            this.timer()
            eventHandler('mouseup', this.longTouchMouseUp);
        }
        return res
    }
    timer = () => {
        let {setTemp,getTemp} = this.context;
        let lt = getTemp('lt');
        setTemp('time',0)
        setTemp(lt + 'interval',setInterval(() => {
            let time = getTemp('time')
            time++;
            setTemp('time',time);
            if (time > 50) {
                clearInterval(getTemp(lt + 'interval'));
                let callback = getTemp(lt + 'callback')
                callback()
            }
        }, 10)) 
    }
    longTouchMouseUp = () => {
        let {getTemp} = this.context;
        eventHandler('mouseup', this.longTouchMouseUp, 'unbind');
        let lt = getTemp('lt');
        clearInterval(getTemp(lt + 'interval'));
    }
    getAttrs = () => {
        let attrs = this.node.attrs ? { ...this.node.attrs } : {};
        let dataId = 'a' + Math.random()
        attrs['data-id'] = dataId;
        attrs.style = this.getStyle()
        attrs.onClick = this.getOnClick();
        attrs = { ...attrs, ...this.getDragAttrs() };
        attrs.className = this.getClassName();
        attrs = { ...attrs, ...this.getLongTouchAttrs(dataId) };
        return attrs
    }
    
}
export function animate(type, selector,callback) {
    if(type === 'removeV'){
        $(selector).animate({ opacity: 0 }, 250).animate({ height: 0,padding:0,margin:0 }, 200, callback);
    } 
    else if(type === 'removeH'){
        $(selector).animate({ opacity: 0 }, 250).animate({ width: 0, padding: 0,margin:0 }, 200, callback);
    }
    else if(type === 'removeL'){
        $(selector).animate({ right: '100%' }, 250).animate({ height: 0,width:0, padding: 0,margin:0 }, 200, callback);
    }
    else if(type === 'remove'){
        $(selector).animate({ opacity: 0 }, 250).animate({ width: 0, height:0,padding: 0,margin:0 }, 200, callback);
    }
    
}
function eventHandler(event, action, type = 'bind') {
    event = 'ontouchstart' in document.documentElement ? { mousemove: "touchmove", mouseup: "touchend" }[event] : event;
    $(window).unbind(event, action);
    if (type === 'bind') { $(window).bind(event, action) }
}
function getGap(p: { node: any, parent: any, dataId: string, rtl: boolean, index: number,state:any,setState:(p:any,value?:any)=>void }) {
    let { node, parent = {}, dataId, rtl, index,state,setState } = p;
    let $$ = {
        getClient(e) { return 'ontouchstart' in document.documentElement ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY } },
        mouseMove(e) {
            var { pos, axis, size, dataId } = this.so;
            var client = this.getClient(e);
            var offset = (client[axis] - pos[axis]) * (rtl ? -1 : 1);
            //if (offset % 24 !== 0) { return }
            this.so.newSize = offset + size;
            var panel = $('[data-id="' + dataId + '"]');
            panel.css({ [{ 'x': 'width', 'y': 'height' }[axis]]: this.so.newSize })
        },
        mouseUp() {
            eventHandler('mousemove', this.mouseMove, 'unbind');
            eventHandler('mouseup', this.mouseUp, 'unbind');
            let { onResize, newSize } = this.so;
            onResize(newSize);
        },
        getClassName(cls) {
            let className = RVDCLS.gap;
            if (cls) { className += ' ' + cls }
            let hideClassName = getHideClassName(node)
            return className + (hideClassName ? ' ' + hideClassName : '');
        },
        getGap() {
            let { gap } = parent, style: any = {}, axis;
            if (!gap) { return false }
            let res = typeof gap === 'function' ? gap(node, parent, index) : gap;
            let size, content = '', attrs: any = {};
            if (typeof res === 'object') {
                size = res.size;
                content = res.content === undefined ? '' : res.content;
                attrs = res.attrs || {};
            }
            else { size = res; }
            if (!size) { return false }
            if (parent.row) { axis = 'x'; style.width = size; }
            else if (parent.column || parent.grid) { axis = 'y'; style.height = size; }
            else { return false }
            style = { ...style, ...attrs.style }
            attrs = {
                ...attrs,
                className: this.getClassName(attrs.className), style, draggable: false,
                onDragStart: (e) => { e.preventDefault(); return false }
            };
            if (node.size && node.onResize) {
                attrs.style.cursor = axis === 'x' ? 'col-resize' : 'row-resize';
                attrs['ontouchstart' in document.documentElement ? 'onTouchStart' : 'onMouseDown'] = (e) => {
                    this.so = { pos: this.getClient(e), onResize: node.onResize, axis, size: node.size, dataId };
                    eventHandler('mousemove', $.proxy(this.mouseMove, this));
                    eventHandler('mouseup', $.proxy(this.mouseUp, this));
                }
            }
            return { attrs, content };
        }
    }
    return $$.getGap()
}
function getHideClassName(node) {
    let hide_xs, hide_sm, hide_md, hide_lg, className;
    if (node.show_xs) { hide_xs = false; hide_sm = true; hide_md = true; hide_lg = true; }
    if (node.hide_xs) { hide_xs = true; }
    if (node.show_sm) { hide_xs = true; hide_sm = false; hide_md = true; hide_lg = true; }
    if (node.hide_sm) { hide_sm = true; }
    if (node.show_md) { hide_xs = true; hide_sm = true; hide_md = false; hide_lg = true; }
    if (node.hide_md) { hide_md = true; }
    if (node.show_lg) { hide_xs = true; hide_sm = true; hide_md = true; hide_lg = false; }
    if (node.hide_lg) { hide_lg = true; }
    if (hide_xs) { className += ' ' + RVDCLS.hidexs; }
    if (hide_sm) { className += ' ' + RVDCLS.hidesm; }
    if (hide_md) { className += ' ' + RVDCLS.hidemd; }
    if (hide_lg) { className += ' ' + RVDCLS.hidelg; }
    return className;
}
function Cls(key:string, CLASSNAME?:string) {
    let className = `rvd-${key}`;
    if (CLASSNAME) { className += ' ' + CLASSNAME }
    return className;
}
export function renderCards(p: { items: any[], gap?: number, attrs: any }) {
    let { items = [], gap, attrs = {} } = p;
    return (
        <ReactVirtualDom
            rootNode={{
                className: Cls('cards-container', attrs.className),
                column: [
                    {
                        className: Cls('cards'), style: { gap },
                        column: items.map((o) => {
                            return {
                                style: { gap }, row: o.map((card) => { return { className: 'of-visible', flex: 1, html: renderCard(card) } })
                            }
                        })
                    }
                ]
            }}
        />
    )
}
export function renderCardsRow(rows = [], gap) {
    return (
        <ReactVirtualDom
            rootNode={{
                className: Cls('cards-row-container'),
                column: [
                    {
                        className: Cls('cards-row', 'of-visible'), style: { gap },
                        row: rows.map((card) => { return { className: 'of-visible', html: renderCard(card) } })
                    }
                ]
            }}
        />
    )
}
export function renderCard(p:{ text?:React.ReactNode, subtext?:React.ReactNode, uptext?:React.ReactNode, attrs?:any, before?:React.ReactNode, after?:React.ReactNode, header?:React.ReactNode, footer?:React.ReactNode, justify?:boolean, classes?:any }) {
    let { text, subtext, uptext, attrs = {}, before, after, header, footer, justify, classes = {} } = p;
    return (
        <ReactVirtualDom
            rootNode={{
                attrs, onClick: attrs.onClick, className: Cls('card', attrs.className) + (justify ? ' justify' : ''), style: attrs.style,
                column: [
                    { show: !!header && !Array.isArray(header), html: header, className: Cls('card-header', classes.header) },
                    {
                        show: !!Array.isArray(header), className: Cls('card-header', classes.header),
                        row: () => [{ html: header[0] }, { flex: 1 }, { html: header[1] }]
                    },
                    {
                        className: Cls('card-body', classes.body),
                        row: [
                            { show: !!before, html: () => before, align: 'vh', className: Cls('card-before', classes.before) },
                            {
                                flex: 1, align: 'v',
                                column: [
                                    { show: !!uptext, html: uptext, className: Cls('card-uptext', classes.uptext) },
                                    { html: text, className: Cls('card-text', classes.text) },
                                    { show: !!subtext, html: () => subtext, className: Cls('card-subtext', classes.subtext) }
                                ]
                            },
                            { show: !!after, html: () => after, align: 'vh', className: Cls('card-after', classes.after) }
                        ]
                    },
                    { show: !!footer && !Array.isArray(footer), html: footer, className: Cls('card-footer', classes.footer) },
                    {
                        show: !!Array.isArray(footer), className: Cls('card-footer', classes.footer),
                        row: () => [{ html: footer[0] }, { flex: 1 }, { html: footer[1] }]
                    }
                ]
            }}
        />
    )
}
function ReOrder(p:{data:any[],fromIndex:number,toIndex:number}){
    let {data,fromIndex,toIndex} = p;
    let from = data[fromIndex];
    let newData = data.filter((o,i) => i !== fromIndex);
    newData.splice(toIndex, 0, from)
    return newData;
}