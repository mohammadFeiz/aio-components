import { Geo } from "../aio-utils"
export type I_canvas_type = 'Line'|'Image'|'Arc'|'Group'|'Text'|'Rectangle'|'NGon'|'Triangle'
export type I_canvas_eventProps = {event:any, mousePosition:I_canvas_mousePosition,item:I_canvas_item}
export type I_canvas_item = {
  x?:number,y?:number,rotate?:number,pivot?:[number,number],fill?:string,stroke?:string,opacity?:number,lineWidth?:number,
  lineJoin?:'mitter'|'round'|'bevel',lineCap?:'butt'|'round'|'square',dash?:number[],
  sequence?:{prop:string,statement:string}[],slice?:[number,number],r?:number,type:I_canvas_type,items?:I_canvas_items
  align?:[0 |1 | -1,0 |1 | -1],
  fontSize?:number,
  fontFamily?:string,
  text?:string
  width?:number,
  height?:number,
  image?:string,
  points?:number[][],
  repeat?:number,
  showPivot?:boolean,
  rect?:boolean,
  pivotedCoords?:number[],
  arcPoints?:number[][],
  arcHeight?:number,
  corner?:number | number[],
  count?:number,
  show?:boolean,
  shadow?:[number,number,number,string],
  close?:boolean,
  onMouseDown?:(p:I_canvas_eventProps)=>void,
  onMouseMove?:(p:I_canvas_eventProps)=>void,
  onMouseUp?:(p:I_canvas_eventProps)=>void,
  onClick?:(p:I_canvas_eventProps)=>void,
  data?:any,
  events?:any
}
export type I_canvas_items = (I_canvas_item | (()=>I_canvas_item))[] | (()=>(I_canvas_item | (()=>I_canvas_item))[])
export type I_canvas_canvasToClient = (pos:[number,number])=>[number,number,number,number]
export type I_canvas_clientToCanvas = (pos:[number,number],calcParentOffset?:boolean)=>[number,number]
export type I_canvas_mousePosition = {x:number,y:number,px:number,py:number,cx:number,cy:number}
export type I_canvas_screenPosition = (number | string)[];
export type I_canvas_getActions = (p:{clientToCanvas:I_canvas_clientToCanvas,canvasToClient:I_canvas_canvasToClient})=>void
export type I_canvas_props = {
  onPan?:((sp:I_canvas_screenPosition)=>void) | boolean,
  screenPosition?:I_canvas_screenPosition,
  getSize?:(width:number,height:number)=>void,
  grid?:[number,number,string],
  zoom?:number,
  onMount?:()=>void,
  getActions?:I_canvas_getActions,
  items:I_canvas_items,
  lineWidth?:number,
  rotateDirection?:'clock'|'clockwise',
  attrs?:any,
  listenToMousePosition?:(mp:I_canvas_mousePosition)=>void
}

export type I_Canvas_temp = {
  PI:number,
  geo:Geo,
  dom:any,
  width:number,
  height:number,
  touch:boolean,
  getScreenPosition?:()=>[number,number],
  setScreenPosition?:(sp:I_canvas_screenPosition)=>void,
  timer:number,
  interval:any,
  axisPosition:[number,number],
  mousePosition:{x:number, y:number, px:number, py:number,cx:number,cy:number},
  translate:[number,number],
  screen:[number,number],
  ctx:any,
  eventMode:any,
  item?:I_canvas_item,
  startOffset:{x: number,y: number,endX: number,endY: number}
}
