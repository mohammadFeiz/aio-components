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
    onDrop?:(e:any)=>void
}
export type I_RVD_editNode = (node: I_RVD_node, parent: I_RVD_node) => I_RVD_node;
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
    node:I_RVD_node,parent:I_RVD_node,level:number,index:number,context:I_RVD_context
}
