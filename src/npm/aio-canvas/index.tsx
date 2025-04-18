import React, { FC, createRef, useEffect, useRef, useState } from "react";
import { AddToAttrs, EventHandler, GetClient } from '../aio-utils/index'
import Geo from './../../npm/aio-geo';
import $ from "jquery";
import { I_Canvas_temp, I_canvas_canvasSizeToClientSize, I_canvas_canvasToClient, I_canvas_clientSizeToCanvasSize, I_canvas_clientToCanvas, I_canvas_getActions, I_canvas_item, I_canvas_mousePosition, I_canvas_props, I_canvas_screenPosition } from "./types";
export default class Canvas {
  mousePosition: I_canvas_mousePosition
  listenToMousePosition: (mp: I_canvas_mousePosition) => void
  canvasToClient: I_canvas_canvasToClient
  clientToCanvas: I_canvas_clientToCanvas
  canvasSizeToClientSize: I_canvas_canvasSizeToClientSize
  clientSizeToCanvasSize: I_canvas_clientSizeToCanvasSize
  getActions: I_canvas_getActions
  render: (props: I_canvas_props) => React.ReactNode;
  width: number;
  height: number;
  constructor() {
    this.height = 0;
    this.width = 0;
    this.mousePosition = { x: 0, y: 0, px: 0, py: 0, cx: 0, cy: 0 }
    this.listenToMousePosition = (mp) => this.mousePosition = mp
    this.canvasToClient = () => { return [0, 0, 0, 0] }
    this.clientToCanvas = () => { return [0, 0] }
    this.clientSizeToCanvasSize = () => 0
    this.canvasSizeToClientSize = () => 0
    this.getActions = (p) => {
      let { clientToCanvas, canvasToClient, clientSizeToCanvasSize, canvasSizeToClientSize } = p;
      this.clientToCanvas = clientToCanvas;
      this.canvasToClient = canvasToClient;
      this.clientSizeToCanvasSize = clientSizeToCanvasSize
      this.canvasSizeToClientSize = canvasSizeToClientSize
    }
    this.render = (props) => {
      return (
        <CANVAS
          {...props}
          listenToMousePosition={this.listenToMousePosition.bind(this)}
          getActions={(obj) => this.getActions(obj)}
          getSize={(width, height) => { this.width = width; this.height = height; }}
        />
      )
    }
  }
}
const CANVAS: FC<I_canvas_props> = (props) => {
  let { listenToMousePosition, getSize, grid, zoom = 1, onMount = () => { }, getActions, rotateDirection = 'clockwise' } = props;
  const touch = "ontouchstart" in document.documentElement
  const ctxRef = useRef<any>()
  let [temp] = useState<I_Canvas_temp>({
    dom: createRef(),
    timer: 0,
    timeout: undefined,
    axisPosition: [0, 0],
    mousePosition: { x: 0, y: 0, px: 0, py: 0, cx: 0, cy: 0 },
    eventMode: undefined,
    item: undefined,
    startOffset: { x: 0, y: 0, endX: 0, endY: 0 }
  })
  const dataHook = useData()
  function resize() {
    clearTimeout(temp.timeout);
    temp.timeout = setTimeout(() => {
      const dom = $(temp.dom.current);
      const csx = dom.width();
      const csy = dom.height();
      dataHook.set({csx,csy})
    
    }, 300);
  }
  function drawAxes() {
    let dash = [3, 3], stroke = "#000";
    let line1: I_canvas_item = { type: 'Line', dash, stroke, points: [[0, -4002], [0, 4000]] }
    let line2: I_canvas_item = { type: 'Line', dash, stroke, points: [[-4002, 0], [4000, 0]] }
    draw([line1, line2]);
  }
  function update() {
    if (!ctxRef.current) { return }
    var dom = $(temp.dom.current);
    const canvasWidth = dom.width() || 0;
    const canvasHeight = dom.height() || 0;
    if (dom[0] === undefined || dom[0] === null) { return; }
    dom[0].width = canvasWidth;
    dom[0].height = canvasHeight;
    temp.axisPosition = [canvasWidth / 2, canvasHeight / 2];
    if (getSize) { getSize(canvasWidth, canvasHeight); }
    clear();
    setScreen();
    if (grid) { drawAxes() }
    draw(props.items);
  }
  const getScreenDetails = ():{spx:number,spy:number,screenX:number,screenY:number,translateX:number,translateY:number}=>{
    const sp = props.screenPosition || [0,0]
    const spx = getValueByRange(sp[0],0,dataHook.csx)
    const spy = getValueByRange(sp[1],0,dataHook.csy)
    const screenX = -getValueByRange(spx, 0, dataHook.csx / zoom) * zoom;
    const screenY = +getValueByRange(spy, 0, dataHook.csy / zoom) * zoom;
    const translateX = screenX + temp.axisPosition[0]
    const translateY = screenY + temp.axisPosition[1]
    return {spx,spy,screenX,screenY,translateX,translateY}
  }


  function setScreen() {
    let canvas = temp.dom.current;
    const {translateX,translateY} = getScreenDetails()
    const ctx = ctxRef.current
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(translateX, translateY);
    $(canvas).css({ backgroundPosition: translateX + "px " + translateY + "px" });
  }
  function draw(items: I_canvas_item[], parent?: I_canvas_item) {
    parent = parent || {} as I_canvas_item
    const ctx = ctxRef.current
    for (let i = 0; i < items.length; i++) {
      let item: I_canvas_item = getFinalItem({ rotateDirection, item: items[i], parent, lineWidth: props.lineWidth || 1, width: dataHook.csx, height: dataHook.csy });
      if (item.show === false) { continue; }
      ctx.save();
      ctx.beginPath();
      rotate(item.rotate, [item.x || 0, item.y || 0]);
      ctx.globalAlpha = item.opacity;
      ctx.lineCap = item.lineCap;
      ctx.lineJoin = item.lineJoin;
      shadow(item);
      item.dash && ctx.setLineDash(item.dash);
      ctx.lineWidth = (item.lineWidth || 1) * zoom;
      ctx.strokeStyle =
        item.stroke === "random"
          ? getRandomColor().color
          : getColor(item.stroke || '#000', item.pivotedCoords);
      ctx.fillStyle =
        item.fill === "random"
          ? getRandomColor().color
          : getColor(item.fill || '#000', item.pivotedCoords);
      if (item.type === 'Line') { drawLine(item); }
      else if (item.type === 'Arc') { drawArc(item); }
      else if (item.type === 'Group') { drawGroup(item); }
      else if (item.type === 'Image') { drawImage(item); }
      else if (item.type === 'Text') { drawText(item); }
      if (item.showPivot) { showPivot(item.x || 0, item.y || 0); }
      if (temp.eventMode && (item.events || {})[temp.eventMode]) {
        let X = temp.mousePosition.cx;
        let Y = -temp.mousePosition.cy;// in isPointInPath and isPointInStroke value of under axis is positive 
        if (item.fill && ctx.isPointInPath(X, Y)) {
          temp.item = item;
        }
        else if (item.stroke && ctx.isPointInStroke(X, Y)) { temp.item = item }
      }
      ctx.closePath(); ctx.restore();
    }
  }
  function clear() {
    const ctx = ctxRef.current
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, dataHook.csx, dataHook.csy);
    ctx.restore();
  }
  
  function canvasToClient(pos: [number, number]) {
    if (!pos) {
      let res: [number, number, number, number] = [0, 0, 0, 0];
      return res
    }
    let [x, y] = pos;
    x = +getValueByRange(x, 0, dataHook.csx); // if x have % calc base on percent
    y = +getValueByRange(y, 0, dataHook.csy); // if y have % calc base on percent
    const {screenX,screenY} = getScreenDetails()
    let res: [number, number, number, number] = [
      Math.round(screenX + temp.axisPosition[0] + x * zoom),
      Math.round(screenY + temp.axisPosition[1] - y * zoom),
      x, y
    ];
    return res
  }
  function clientToCanvas(pos: [number, number], calcParentOffset = true) {
    let offset: { left: number, top: number } = calcParentOffset ? $(temp.dom.current).offset() || { left: 0, top: 0 } : { left: 0, top: 0 };
    let client: [number, number] = [pos[0] - offset.left + window.pageXOffset, pos[1] - offset.top + window.pageYOffset];
    const {screenX,screenY} = getScreenDetails()
    let res: [number, number] = [
      Math.floor((client[0] - temp.axisPosition[0] - screenX) / zoom),
      -Math.floor((client[1] - temp.axisPosition[1] - screenY) / zoom)
    ];
    return res
  }
  function clientSizeToCanvasSize(clientSize: number) {
    return Math.floor((clientSize) / zoom)
  }
  function canvasSizeToClientSize(canvasSize: number) {
    return Math.round(canvasSize * zoom)
  }
  useEffect(() => { update() })
  useEffect(() => {
    $(window).on("resize", resize);
    ctxRef.current = temp.dom.current.getContext("2d")
    update();
    resize();
    onMount();
    if (getActions) { getActions({ canvasToClient, clientToCanvas, canvasSizeToClientSize, clientSizeToCanvasSize }) }
  }, [])
  function getRandomColor(range?: number) {
    range = (range || 60) as number;
    function getRGB() {
      range = (range) as number;
      return [
        range + Math.round(Math.random() * (255 - range)),
        range + Math.round(Math.random() * (255 - range)),
        range + Math.round(Math.random() * (255 - range))
      ];
    }
    var color = getRGB();
    color[Math.round(Math.random() * 3)] = 0;
    return {
      color: `rgb(${color[0]},${color[1]},${color[2]})`,
      r: color[0],
      g: color[1],
      b: color[2]
    };
  }
  //notice index and length use in eval and seems not used but used
  function getItemsByRepeat(item: I_canvas_item): I_canvas_item[] | false {
    if (!item.repeat || !Array.isArray(item.items)) { return false }
    const res = []
    for (let i = 0; i < item.items.length; i++) {
      let subItem = item.items[i];
      let { showPivot } = subItem;
      for (let j = 0; j < item.repeat; j++) {
        let newItem: I_canvas_item = { ...subItem, isRepeat: j > 0, showPivot: j === 0 ? showPivot : false }
        res.push(newItem)
      }
    }
    return res
  }
  function drawGroup(item: I_canvas_item) {
    let [X, Y] = item.pivotedCoords || [];
    const repeatRes = getItemsByRepeat(item);
    const parent: I_canvas_item = { ...item, x: X, y: Y };
    const fixedItems: I_canvas_item[] = repeatRes === false ? item.items || [] : repeatRes;
    draw(fixedItems, parent);
  }
  function drawText(p: I_canvas_item) {
    let { align = [0, 0], fontSize = 12, fontFamily = 'arial', text = "Text", fill, stroke, pivotedCoords = [] } = p;
    let [X, Y] = pivotedCoords;
    let textAlign = ["right", "center", "left"][align[0] + 1]
    let textBaseline = ["top", "middle", "bottom"][align[1] + 1]
    const ctx = ctxRef.current
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.font = `${fontSize * zoom}px ${fontFamily}`;
    stroke && ctx.strokeText(text, X * zoom, Y * zoom);
    fill && ctx.fillText(text, X * zoom, Y * zoom);
  }
  function drawImage(p: I_canvas_item) {
    let { pivotedCoords = [], width = 0, height = 0, image } = p;
    var [X, Y] = pivotedCoords;
    var fr = new FileReader();
    var img: any;
    const ctx = ctxRef.current
    fr.onload = () => {
      img = new Image();
      img.onload = () => ctx.drawImage(img, X * zoom, Y * zoom, width * zoom, height * zoom);
      img.src = fr.result;
    };
    fr.readAsDataURL(image as any);
  }
  function drawLine(p: I_canvas_item) {
    let { points = [], close, stroke, fill, pivotedCoords } = p;
    if (points.length < 1) { return false; }
    let Coords = pivotedCoords || [0, 0];
    let [X, Y] = Coords;
    let start = [
      +getValueByRange(points[0][0], 0, dataHook.csx) + X,
      -getValueByRange(points[0][1], 0, dataHook.csy) + Y
    ];
    const ctx = ctxRef.current
    ctx.moveTo(start[0] * zoom, start[1] * zoom);
    let beforePoint = points[0];
    for (let i = 1; i < points.length; i++) {
      let [x, y, r] = points[i];
      beforePoint = [x, y];
      let point = [
        +getValueByRange(x, 0, dataHook.csx) + X,
        -getValueByRange(y, 0, dataHook.csy) + Y
      ];
      if (r) {
        let [x, y] = points[i + 1] ? points[i + 1] : points[0];
        let nextPoint = [
          +getValueByRange(x, 0, dataHook.csx) + X,
          -getValueByRange(y, 0, dataHook.csy) + Y
        ];
        ctx.arcTo(point[0] * zoom, point[1] * zoom, nextPoint[0] * zoom, nextPoint[1] * zoom, r * zoom);
      }
      else { ctx.lineTo(point[0] * zoom, point[1] * zoom); }
    }
    if (points.length > 2 && close) {
      ctx.lineTo(start[0] * zoom, start[1] * zoom);
    }
    stroke && ctx.stroke();
    fill && ctx.fill();
  }
  function drawArc(p: I_canvas_item) {
    const ctx = ctxRef.current
    let { pivotedCoords = [], r = 0, slice = [0, 360], fill, stroke } = p;
    let [X, Y] = pivotedCoords;
    ctx.arc(X * zoom, Y * zoom, r * zoom, slice[0] * Math.PI / 180, slice[1] * Math.PI / 180);
    stroke && ctx.stroke();
    fill && ctx.fill();
  }
  function showPivot(x: number, y: number) {
    const ctx = ctxRef.current
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, (360 * Math.PI) / 180);
    ctx.moveTo(x - 15, y);
    ctx.lineTo(x + 15, y);
    ctx.moveTo(x, y - 15);
    ctx.lineTo(x, y + 15);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,100,0,.3)";
    ctx.stroke();
    ctx.closePath();
  }
  function rotate(angle: number = 0, pos: [number, number]) {
    if (angle === 0) { return; }
    const ctx = ctxRef.current
    let [X, Y] = pos;
    angle = angle * Math.PI / 180 * (rotateDirection === "clock" ? 1 : -1);
    let s = Math.sin(angle),
      c = Math.cos(angle);
    ctx.rotate(angle);
    let x = X * c - -Y * s - X;
    let y = -Y - (X * s + -Y * c);
    ctx.translate(x * zoom, y * zoom);
  }
  function getColor(color: string | string[], p?: number[]) {
    const ctx = ctxRef.current
    let [x = 0, y = 0] = p || [];
    if (!color) { return; }
    if (typeof color === "string") { return color; }
    let length = color.length;
    let g;
    if (length === 5) { g = ctx.createLinearGradient(color[0] + x, color[1] + y, color[2] + x, color[3] + y); }
    else if (length === 7) { g = ctx.createRadialGradient(color[0] + x, color[1] + y, color[2], color[3] + x, color[4] + y, color[5]) }
    var stops = color[color.length - 1];
    for (var i = 0; i < stops.length; i++) {
      var s = stops[i].split(" ");
      g.addColorStop(s[0], s[1]);
    }
    return g;
  }
  function shadow(item: I_canvas_item) {
    let { shadow } = item;
    if (!shadow) { return }
    const ctx = ctxRef.current
    ctx.shadowOffsetX = shadow[0]; ctx.shadowOffsetY = shadow[1]; ctx.shadowBlur = shadow[2]; ctx.shadowColor = shadow[3];
  }
  function panmousedown(e: Event) {
    EventHandler("window", "mousemove", panmousemove);
    EventHandler("window", "mouseup", panmouseup);
    const {spx,spy} = getScreenDetails()
    let client = GetClient(e);
    temp.startOffset = { x: client.x, y: client.y, endX: spx, endY: spy };
  }
  function panmouseup() {
    EventHandler("window", "mousemove", panmousemove, "unbind");
    EventHandler("window", "mouseup", panmouseup, "unbind");
  }
  function panmousemove(e: Event) {
    let so = temp.startOffset, coords = GetClient(e);
    let x = (so.x - coords.x) / zoom + so.endX, y = (coords.y - so.y) / zoom + so.endY;
    if (props.onChangeScreenPosition) props.onChangeScreenPosition([x, y]);
  }
  function onMouseDown(e: any) {
    temp.mousePosition = getMousePosition(e);
    temp.eventMode = "onMouseDown";
    update();
    if (temp.item && temp.item.events && temp.item.events.onMouseDown) { temp.item.events.onMouseDown({ event: e, mousePosition: temp.mousePosition, item: temp.item }) }
    else if (props.onChangeScreenPosition) { panmousedown(e) }
    else if (props.onDown) { props.onDown(e,temp.mousePosition) }
    temp.item = undefined; temp.eventMode = false;
  }
  function onMouseUp(e: any) {
    temp.mousePosition = getMousePosition(e);
    temp.eventMode = "onMouseUp";
    update();
    if (temp.item && temp.item.events && temp.item.events.onMouseUp) { temp.item.events.onMouseUp({ event: e, mousePosition: temp.mousePosition, item: temp.item }) }
    else if (props.onUp) { props.onUp(e, temp.mousePosition) }
    temp.item = undefined; temp.eventMode = false;
  }
  function onClick(e: Event) {
    temp.mousePosition = getMousePosition(e);//in onClick calc with no touch
    temp.eventMode = "onClick";
    update();
    if (temp.item && temp.item.events && temp.item.events.onClick) { temp.item.events.onClick({ event: e, mousePosition: temp.mousePosition, item: temp.item }) }
    else if (props.onClick) { props.onClick(e, temp.mousePosition) }
    temp.item = undefined; temp.eventMode = false;
  }
  function onMouseMove(e: any) {
    temp.mousePosition = getMousePosition(e);
    if (props.onMove) { props.onMove(e, temp.mousePosition) }
    if(listenToMousePosition){listenToMousePosition(temp.mousePosition)}
  }

  function getMousePosition(e: Event) {
    let client = GetClient(e);
    let [x, y] = clientToCanvas([client.x, client.y]);
    let [cx, cy] = canvasToClient([x, y])
    return { x, y, px: (x * 100) / dataHook.csx, py: (y * 100) / dataHook.csy, cx, cy };
  }
  const attrs = AddToAttrs(props.attrs,{
    className:[props.className],
    style:props.grid?getBackground({gridX:props.grid[0],gridY:props.grid[1],gridColor:props.grid[2],zoom}):undefined,
    attrs:{
      ref:temp.dom,
      onClick,
      [touch?'onTouchStart':'onMouseDown']:onMouseDown,
      [touch?'onTouchMove':'onMouseMove']:onMouseMove,
      [touch?'onTouchEnd':'onMouseUp']:onMouseUp,
    }
  })
  return <canvas {...attrs} />;
}


function getValueByRange(value: number | string | (() => number | string), start: number, end: number):number {
  var Value = typeof value === 'function' ? value() : value;
  var type = typeof Value;
  if (type === undefined) { return start; }
  if (typeof Value === "number") { return Value; }
  return start + (parseFloat(Value as string) * (end - start)) / 100;
}
function getCoordsByPivot(item: I_canvas_item, width: number, height: number): [number, number] {
  let { pivot, x = 0, y = 0 } = item;
  if (!pivot) { return [x, y]; }
  let [px = 0, py = 0] = pivot;
  return [x - +getValueByRange(px, 0, width), y - (-getValueByRange(py, 0, height))];
}

function getFinalItem(p: { rotateDirection: 'clock' | 'clockwise', lineWidth: number, width: number, height: number, item: I_canvas_item, parent?: I_canvas_item }) {
  const geo = new Geo()
  function getCorner(corner: number | number[], index: number) {
    if (!Array.isArray(corner)) { return corner }
    return corner[index] || 0
  }
  function getDefaultItem(item: I_canvas_item, parent?: I_canvas_item): I_canvas_item {
    const sequence = parent?.sequence || []
    let sequenceProps: I_canvas_item = {
      type: item.type, fill: parent?.fill, stroke: parent?.stroke, rotate: 0, x: 0, y: 0, slice: undefined, opacity: 1, lineWidth: p.lineWidth, r: undefined
    };
    try {
      for (let i = 0; i < sequence.length; i++) {
        let seqArray: string[] = sequence[i].split(':')
        eval(`sequenceProps.${seqArray[0]} = ${seqArray[1]}`)
      }
    }
    catch { }
    let {
      fill = sequenceProps.fill, stroke = sequenceProps.stroke,
      rotate = sequenceProps.rotate, x = sequenceProps.x, y = sequenceProps.y, r = sequenceProps.r,
      slice = sequenceProps.slice, opacity = sequenceProps.opacity, lineWidth = sequenceProps.lineWidth,
      lineJoin = 'miter', lineCap = 'butt', showPivot = false,
    } = item;
    if (item.type !== 'Group' && !stroke && !fill) { stroke = "#000"; }
    return { ...item, fill, stroke, rotate, slice, opacity, lineWidth, r, x, y, showPivot, lineJoin: lineJoin as any, lineCap };
  }
  function getItemByRelatedProps(item: I_canvas_item, parent?: I_canvas_item): I_canvas_item {
    item.rotate = +getValueByRange(item.rotate || 0, 0, 360);
    item.x = +getValueByRange(item.x || 0, 0, p.width) + (parent?.x || 0);
    item.y = -getValueByRange(item.y || 0, 0, p.height) + (parent?.y || 0);
    item.opacity = (item.opacity || 1) * (parent?.opacity || 1);
    item.pivotedCoords = getCoordsByPivot(item, p.width, p.height);
    return item
  }
  const { type } = p.item;
  let updatedItem = getDefaultItem(p.item, p.parent);
  updatedItem = getItemByRelatedProps(updatedItem)
  //converts
  if (type === 'Arc') {
    if (updatedItem.arcPoints) {
      let arc = geo.getArcByPoints(updatedItem.arcPoints, updatedItem.arcHeight);
      updatedItem.r = arc.r;
      updatedItem.slice = arc.slice;
      updatedItem.x = arc.x;
      updatedItem.y = -arc.y;
      updatedItem.pivotedCoords = getCoordsByPivot(updatedItem, p.width, p.height);
    }
    updatedItem.r = +getValueByRange(updatedItem.r || 0, p.width, p.height);
    updatedItem.r = updatedItem.r < 0 ? 0 : updatedItem.r;
    let { slice = [0, 360] } = updatedItem;
    slice = [+getValueByRange(slice[0], 0, 360), +getValueByRange(slice[1], 0, 360)];
    if (p.rotateDirection === "clockwise") {
      let a = slice[0], b = slice[1];
      slice = [-b, -a];
    }
    updatedItem.slice = slice
  }
  else if (type === 'Rectangle') {
    updatedItem.type = 'Line';
    let { width = 20, height = 20, corner = 0 } = updatedItem;
    width = +getValueByRange(width, 0, width);
    height = +getValueByRange(height, 0, height);
    let [x, y] = updatedItem.pivotedCoords || [0, 0];
    updatedItem.points = [
      [x + width / 2, -y],
      [x + width, -y, getCorner(corner, 0)],
      [x + width, -y + height, getCorner(corner, 1)],
      [x, -y + height, getCorner(corner, 2)],
      [x, -y, getCorner(corner, 3)], [x + width / 2, -y, getCorner(corner, 0)]
    ];
    updatedItem.pivotedCoords = [0, 0]
  }
  else if (type === 'NGon') {
    updatedItem.type = 'Line';
    let { r = 20, count = 6, corner = 0, x, y } = updatedItem;//notice x,y in ngon should use
    updatedItem.points = geo.getPointsByNGon(r, count, corner as number);
  }
  else if (type === 'Triangle') {
    updatedItem.type = 'Line';
    let { corner = 0, width = 50, height = 100, x, y } = updatedItem;//notice x,y in ngon should use
    if (!Array.isArray(corner)) {
      corner = [corner];
    }
    updatedItem.points = [
      [0, 0, 0],
      [width / 2, 0, getCorner(corner, 0)],
      [0, height, getCorner(corner, 1)],
      [-width / 2, 0, getCorner(corner, 2)],
      [0, 0, 0]
    ];
    console.log(updatedItem.points)
  }
  updatedItem.events = p.parent?.events || updatedItem.events
  return updatedItem;
}

type I_data = {csx:number,csy:number}
const useData = () => {
  const [data,setData] = useState<I_data>({csx:0,csy:0})
  const set = (obj:{[key in keyof I_data]:number}) => setData({...data,...obj})
  return { csx:data.csx,csy:data.csy,set}
}


function getBackground(p:{gridX:number,gridY:number,gridColor:string,zoom:number}) {
  var a = 100 * p.zoom;
  var b = (p.gridX * p.zoom) + "px";
  var c = (p.gridY * p.zoom) + "px";
  var h1 = `linear-gradient(${p.gridColor} 0px,transparent 0px)`;
  var v1 = `linear-gradient(90deg,${p.gridColor} 0px, transparent 0px)`;
  var h2 = `linear-gradient(${p.gridColor} 1px, transparent 1px)`;
  var v2 = `linear-gradient(90deg,${p.gridColor} 1px, transparent 1px)`;
  return {
    backgroundImage: `${h1},${v1},${h2},${v2}`,
    backgroundSize: `${a}px ${a}px,${a}px ${a}px,${b} ${c},${b} ${c}`
  };
}