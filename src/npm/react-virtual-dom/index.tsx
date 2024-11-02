import React, { createContext, useContext, useEffect, useState } from "react";
import $ from 'jquery';
import "./index.css";
export type I_RVD_node = {
    align?: 'v' | 'h' | 'vh',
    gap?: I_RVD_node | ((p:{node:I_RVD_node,parent:I_RVD_node,index:number,level:number})=>I_RVD_node),
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
    nodeClass?:string,
    wrap?:boolean,
    nodeClasses?:string[],
    attrs?: any,
    className?: string | ((string | false)[]),
    style?: any,
    onClick?: (e: any) => void,
    show?: boolean | (() => boolean),
    loading?: boolean,
    key?:string | number,
    id?:string | number,
    onDrag?:(e:any)=>void,
    onDrop?:(e:any)=>void,
    onResize?:(newSize:number)=>void,
    mountAfter?:number,
    hide_xs?:boolean,
    hide_sm?:boolean,
    hide_md?:boolean,
    hide_lg?:boolean,
    show_xs?:boolean,
    show_sm?:boolean,
    show_md?:boolean,
    show_lg?:boolean,

}
export type I_RVD_editNode = (node: I_RVD_node, parent?: I_RVD_node) => I_RVD_node;
export type I_RVD_classes = {[key:string]:string|((node:I_RVD_node,parent:I_RVD_node)=>string)}
export type I_RVD_props = {rootNode: I_RVD_node,dragHandleClassName?: string,classes?:I_RVD_classes,rtl?: boolean,state?:any,editNode?: I_RVD_editNode}
export type I_RVD_getTemp = (key:string)=>any;
export type I_RVD_setTemp = (key:string,value:any)=>void;
export type I_RVD_state = any;
export type I_RVD_setState = (key:any,value?:any)=>void
export type I_RVD_temp = { dragIndex?:false | number, lt?: string, time?: number, timeOut?: any }
export type I_RVD_context = {getTemp:I_RVD_getTemp,setTemp:I_RVD_setTemp,rootProps:I_RVD_props,state:I_RVD_state,setState:I_RVD_setState}
export type I_RVDNode = {node: I_RVD_node, index: number, parent?: I_RVD_node, level: number}

export type I_RVDAttrs = {
    node:I_RVD_node,parent?:I_RVD_node,level:number,index:number,context:I_RVD_context,mounted?:boolean
}
const RVDContext = createContext({} as I_RVD_context);
export default function ReactVirtualDom(props: I_RVD_props) {
    let {rootNode} = props;
    let [temp] = useState<I_RVD_temp>({});
    function getTemp(key:string){return (temp as any)[key] as any;}
    function setTemp(key:string,value:any){(temp as any)[key] = value;}
    let [state,changeState] = useState<any>(props.state)
    let setState = (key:any,value:any)=>changeState(typeof key === 'string'?{...state,[key]:value}:key)
    let rootNodeProps:I_RVDNode = {node:rootNode,index:0,level:0};
    let context:I_RVD_context = {getTemp,setTemp,rootProps:props,state,setState};
    return (<RVDContext.Provider value={context}><RVDNode {...rootNodeProps}/></RVDContext.Provider>)
}
function RVDNode(props:I_RVDNode){
    let context:I_RVD_context = useContext(RVDContext);
    let {rootProps,state,setState} = context;
    let {parent,index, level} = props;
    let [mounted,setMounted] = useState(false);
    function getHtml(node:I_RVD_node) {
        let { html = '', loading } = node;
        html = (typeof html === 'function' ? html({state,setState}) : html) || '';
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
    function getNodeClasses(node:I_RVD_node,parent?:I_RVD_node){
        let res:string[] = [];
        if(parent && parent.nodeClasses){res = [...parent.nodeClasses]}
        if(node.nodeClass){res = [...res,node.nodeClass]}
        return res; 
    }
    function isLoading(node: I_RVD_node, parent?: I_RVD_node): boolean {
        if (typeof node.loading === 'boolean') { return node.loading }
        return parent ? !!parent.loading : false;
    }
    function getNode():I_RVD_node{
        let {node} = props;
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
    useEffect(()=>{
        if(typeof props.node.mountAfter === 'number'){
            setTimeout(()=>setMounted(true),props.node.mountAfter)
        }
    },[])
    if (!props.node || props.node === null) { return null }
    if ((typeof props.node.show === 'function' ? props.node.show() : props.node.show) === false) { return null }
    let node = getNode()
    let content = getContent(node)
    let attrs = new RVDAttrs({node,parent, level,index,context,mounted}).getAttrs();
    let gap = getGap({ node, parent, dataId: attrs['data-id'], rtl:rootProps.rtl, index,level,context });
    return (
        <>
            <div {...attrs}>{content}</div>
            {gap !== null && gap}
        </>
    )
}
class RVDAttrs{
    node:I_RVD_node;
    parent?:I_RVD_node;
    level:number;
    index:number;
    context:I_RVD_context;
    mounted:boolean;
    constructor(props:I_RVDAttrs){
        let {node,parent,level,index,context,mounted = false} = props;
        this.node = node;
        this.mounted = mounted;
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
        let isReorder = this.parent && this.parent.reOrder && Array.isArray(this.parent.data)
        let isDragable = this.node.onDrag || this.node.onDrop;
        if(!isReorder && !isDragable){return {}}
        let {rootProps,getTemp,setTemp} = this.context;
        let {dragHandleClassName} = rootProps;
        let res: any = {};
        res.draggable = true;
        res.onDragStart = (e:any) => {
            if (dragHandleClassName) {
                if (!$(e.target).hasClass(dragHandleClassName) && $(e.target).parents('.' + dragHandleClassName).length === 0) { return; }
            }
            if(isReorder){setTemp('dragIndex',this.index);}
            else if(this.node.onDrag){this.node.onDrag(e)}
        }
        res.onDragOver = (e:any) => e.preventDefault();
        res.onDrop = (e:any) => {
            if(isReorder){
                let dragIndex = getTemp('dragIndex');
                if (dragIndex === false || dragIndex === this.index) { return; }
                (this.parent as any).reOrder(ReOrder({data:(this.parent as any).data,fromIndex:dragIndex, toIndex:this.index}),dragIndex, this.index);
                setTemp('dragIndex',false)
            }
            else if(this.node.onDrop) {this.node.onDrop(e)}
        }
        return res;
    }
    getClassName = () => {
        let {classes = {}} = this.context.rootProps;
        let res = 'rvd';
        if (this.level === 0) { res += ' rvd-root ai' }
        let {attrs = {},nodeClass,nodeClasses,row,column,grid,loading,wrap,mountAfter} = this.node
        if (this.node.className) {
            let className:string;
            if(Array.isArray(this.node.className)){className = this.node.className.filter((cls)=>!!cls && typeof cls === 'string').join(' ')}
            else{className = this.node.className}
            let dcls:any = classes[className];
            if(typeof dcls === 'function'){className = dcls(this.node,this.parent)}
            else if(typeof dcls === 'string'){className = dcls;}
            if(className && typeof className === 'string'){res += ' ' + className;}  
        }
        if(attrs.className){res += ' ' + attrs.className}
        if(wrap){res += ' wrap'}
        if(nodeClass){res += ' ' + (nodeClasses as any).join('-')}
        if (!!attrs.onClick) { res += ' pointer'; }
        if(this.node.align){res += ` align-${this.node.align}`}
        if (row) { res += ' rvd-row' }
        else if (column || grid) { res += ' rvd-column' }
        if(loading){res += ' rvd-parent-loading'}
        let hideClassName = getHideClassName(this.node);
        if (hideClassName) { res += ' ' + hideClassName }
        if(!this.mounted && typeof mountAfter === 'number'){res += ' not-mounted'}
        return res;
    }
    getLongTouchAttrs = (dataId:string) => {
        let { longTouch } = this.node;
        let {setTemp} = this.context;
        if (typeof longTouch !== 'function') { return {} }
        let res:any = {};
        res['ontouchstart' in document.documentElement ? 'onTouchStart' : 'onMouseDown'] = (e:any) => {
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
export function animate(type:any, selector:any,callback:any) {
    if(Array.isArray(type)){
        for (var i = 0; i < type.length; i++) {
            var [style,time] = type[i];
            $(selector)
                .delay(i === 0 ? 0 : type[i - 1].time) // Add delay based on previous animation time
                .animate(style, time, i === type.length - 1 ? callback : null);
        }
    }
    else if(type === 'removeV'){
        $(selector).animate({ opacity: 0 }, 250).animate({ height: 0,padding:0,margin:0 }, 200, callback);
    } 
    else if(type === 'removeH'){
        $(selector).animate({ opacity: 0 }, 250).animate({ width: 0, padding: 0,margin:0 }, 200, callback);
    }
    else if(type === 'removeL'){
        $(selector).animate({ right: '100%' }, 250).animate({ height: 0,width:0, padding: 0,margin:0 }, 200, callback);
    }
    else if(type === 'removeR'){
        $(selector).animate({ left: '100%' }, 250).animate({ height: 0,width:0, padding: 0,margin:0 }, 200, callback);
    }
    else if(type === 'remove'){
        $(selector).animate({ opacity: 0 }, 250).animate({ width: 0, height:0,padding: 0,margin:0 }, 200, callback);
    }
    
}
function eventHandler(event:any, action:any, type = 'bind') {
    event = 'ontouchstart' in document.documentElement ? ({ mousemove: "touchmove", mouseup: "touchend" } as any)[event] : event;
    $(window).unbind(event, action);
    if (type === 'bind') { $(window).bind(event, action) }
}
function getGap(p: { node: I_RVD_node, parent?: I_RVD_node, dataId: string, rtl?: boolean, index: number,level:number,context:I_RVD_context}) {
    let { node, parent = {}, dataId, rtl, index,level,context } = p;
    let $$:any = {
        getClient(e:any) { return 'ontouchstart' in document.documentElement ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY } },
        mouseMove(e:any) {
            var { pos, size } = this.so;
            var client = this.getClient(e);
            let axis = parent.row?'x':'y';
            var offset = (client[axis] - pos[axis]) * (rtl ? -1 : 1);
            //if (offset % 24 !== 0) { return }
            this.so.newSize = offset + size;
            var panel = $('[data-id="' + dataId + '"]');
            panel.css({ [({ 'x': 'width', 'y': 'height' } as any)[axis]]: this.so.newSize })
        },
        mouseUp() {
            eventHandler('mousemove', this.mouseMove, 'unbind');
            eventHandler('mouseup', this.mouseUp, 'unbind');
            let { newSize } = this.so;
            (node as any).onResize(newSize);
        },
        getGap() {
            let { gap } = parent;
            gap = typeof gap === 'function' ? gap({node, parent, index,level}) : gap;
            if (!gap || !parent) { return null }
            let gapAttrs = {
                draggable:false,
                onDragStart: (e:any) => { e.preventDefault(); return false }
            }
            let className = 'rvd-gap';
            if (node.size && node.onResize) {
                className += (parent as any).row?' col-resize':' row-resize';
                (gapAttrs as any)['ontouchstart' in document.documentElement ? 'onTouchStart' : 'onMouseDown'] = (e:any) => {
                    this.so = { pos: this.getClient(e), size: node.size };
                    eventHandler('mousemove', $.proxy(this.mouseMove, this));
                    eventHandler('mouseup', $.proxy(this.mouseUp, this));
                }
            }
            if(gap.className){className += ' ' + gap.className}
            let p:I_RVDAttrs = {node:{...gap,className,attrs:{...gap.attrs,...gapAttrs}},parent,level,index,context}
            let Attrs = new RVDAttrs(p)
            let attrs = Attrs.getAttrs();
            let {html = ''} = gap;
            if(node.loading){html = ''}
            return <div {...attrs}>{html}</div> 
        }
    }
    return $$.getGap()
}
function getHideClassName(node:I_RVD_node) {
    let hide_xs, hide_sm, hide_md, hide_lg, className = '';
    if (node.show_xs) { hide_xs = false; hide_sm = true; hide_md = true; hide_lg = true; }
    if (node.hide_xs) { hide_xs = true; }
    if (node.show_sm) { hide_xs = true; hide_sm = false; hide_md = true; hide_lg = true; }
    if (node.hide_sm) { hide_sm = true; }
    if (node.show_md) { hide_xs = true; hide_sm = true; hide_md = false; hide_lg = true; }
    if (node.hide_md) { hide_md = true; }
    if (node.show_lg) { hide_xs = true; hide_sm = true; hide_md = true; hide_lg = false; }
    if (node.hide_lg) { hide_lg = true; }
    if (hide_xs) { className += ' rvd-hide-xs'; }
    if (hide_sm) { className += ' rvd-hide-sm'; }
    if (hide_md) { className += ' rvd-hide-md'; }
    if (hide_lg) { className += ' rvd-hide-lg'; }
    return className;
}
function Cls(key:string, CLASSNAME?:string) {
    let className = `rvd-${key}`;
    if (CLASSNAME) { className += ' ' + CLASSNAME }
    return className;
}

function ReOrder(p:{data:any[],fromIndex:number,toIndex:number}){
    let {data,fromIndex,toIndex} = p;
    let from = data[fromIndex];
    let newData = data.filter((o,i) => i !== fromIndex);
    newData.splice(toIndex, 0, from)
    return newData;
}