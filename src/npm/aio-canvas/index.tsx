import React, { createRef, useEffect, useRef, useState } from "react";
import { Geo, EventHandler, GetClient } from '../aio-utils/index'
import $ from "jquery";
import { I_Canvas_temp, I_canvas_canvasToClient, I_canvas_clientToCanvas, I_canvas_getActions, I_canvas_item, I_canvas_items, I_canvas_mousePosition, I_canvas_props, I_canvas_screenPosition } from "./types";
export default class Canvas {
  mousePosition: I_canvas_mousePosition
  listenToMousePosition: (mp: I_canvas_mousePosition) => void
  canvasToClient: I_canvas_canvasToClient
  clientToCanvas: I_canvas_clientToCanvas
  getActions: I_canvas_getActions
  render: (props: I_canvas_props) => React.ReactNode;
  width: number;
  height: number;
  constructor() {
    this.height = 0;
    this.width = 0;
    this.listenToMousePosition = (mp) => this.mousePosition = mp
    this.canvasToClient = () => { return [0, 0, 0, 0] }
    this.clientToCanvas = () => { return [0, 0] }
    this.getActions = (p) => {
      let { clientToCanvas, canvasToClient } = p;
      this.clientToCanvas = clientToCanvas;
      this.canvasToClient = canvasToClient;
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
function CANVAS(props: I_canvas_props) {
  let { listenToMousePosition, attrs = {}, getSize, grid, zoom = 1, onMount = () => { }, getActions, rotateDirection = 'clockwise' } = props;
  let [temp] = useState<I_Canvas_temp>({
    PI: Math.PI / 180,
    geo: new Geo(),
    dom: createRef(),
    width: 0,
    height: 0,
    timer: 0,
    interval: undefined,
    touch: "ontouchstart" in document.documentElement,
    axisPosition: [0, 0],
    mousePosition: { x: 0, y: 0, px: 0, py: 0, cx: 0, cy: 0 },
    ctx: undefined,
    translate: [0, 0],
    screen: [0, 0],
    eventMode: undefined,
    item: undefined,
    startOffset: { x: 0, y: 0, endX: 0, endY: 0 }
  })
  let [screenPosition, SetScreenPosition] = useState<I_canvas_screenPosition>(props.screenPosition || [0, 0])
  let spRef = useRef(screenPosition);
  spRef.current = screenPosition;
  function resize() {
    temp.timer = 0;
    clearInterval(temp.interval);
    temp.interval = setInterval(() => {
      temp.timer++;
      if (temp.timer >= 20) {
        update();
        clearInterval(temp.interval);
      }
    }, 10);
  }
  function drawAxes() {
    let dash = [3, 3], stroke = "#000";
    let line1: I_canvas_item = { type: 'Line', dash, stroke, points: [[0, -4002], [0, 4000]] }
    let line2: I_canvas_item = { type: 'Line', dash, stroke, points: [[-4002, 0], [4000, 0]] }
    draw([line1, line2]);
  }
  function update() {
    var dom = $(temp.dom.current);
    temp.width = dom.width();
    temp.height = dom.height();
    if (dom[0] === undefined || dom[0] === null) { return; }
    dom[0].width = temp.width;
    dom[0].height = temp.height;
    temp.axisPosition = [temp.width / 2, temp.height / 2];
    if (getSize) { getSize(temp.width, temp.height); }
    if (grid) { dom.css(getBackground()); }
    clear();
    setScreen();
    if (grid) { drawAxes() }
    draw();
  }
  function getValueByRange(value, start, end) {
    var Value = typeof value === 'function' ? value() : value;
    var type = typeof Value;
    if (type === undefined) { return start; }
    if (type === "number") { return Value; }
    return start + (parseFloat(Value) * (end - start)) / 100;
  }

  function setScreen() {
    let screenPosition = temp.getScreenPosition();
    let canvas = temp.dom.current;
    temp.screen = [
      -getValueByRange(screenPosition[0], 0, temp.width / zoom) * zoom,
      getValueByRange(screenPosition[1], 0, temp.height / zoom) * zoom
    ]
    temp.translate = [
      (temp.screen[0] + temp.axisPosition[0]),
      (temp.screen[1] + temp.axisPosition[1])
    ];
    temp.ctx.setTransform(1, 0, 0, 1, 0, 0);
    temp.ctx.translate(temp.translate[0], temp.translate[1]);
    $(canvas).css({ backgroundPosition: temp.translate[0] + "px " + temp.translate[1] + "px" });
  }
  function draw(items?: I_canvas_items, parent?: I_canvas_item, index?: number[]) {
    items = items || props.items || [];
    parent = parent || {} as I_canvas_item
    index = index || []
    let Items = typeof items === "function" ? items() : items;
    var ctx = temp.ctx;
    for (let i = 0; i < Items.length; i++) {
      let item: I_canvas_item = getItem(Items[i], parent);
      if (item.show === false) { continue; }
      ctx.save();
      ctx.beginPath();
      rotate(item.rotate, [item.x, item.y]);
      ctx.globalAlpha = item.opacity;
      ctx.lineCap = item.lineCap;
      ctx.lineJoin = item.lineJoin;
      shadow(item);
      item.dash && ctx.setLineDash(item.dash);
      ctx.lineWidth = item.lineWidth * zoom;
      ctx.strokeStyle =
        item.stroke === "random"
          ? getRandomColor().color
          : getColor(item.stroke, item.pivotedCoords);
      ctx.fillStyle =
        item.fill === "random"
          ? getRandomColor().color
          : getColor(item.fill, item.pivotedCoords);
      var Index = index.concat(i);
      if (item.type === 'Line') { drawLine(item); }
      else if (item.type === 'Arc') { drawArc(item); }
      else if (item.type === 'Group') { drawGroup(item, Index); }
      else if (item.type === 'Image') { drawImage(item); }
      else if (item.type === 'Text') { drawText(item); }
      else {
        var str = "items[" + Index.join("].items[") + "]";
        console.error("r-canvas => receive invalid item in " + str + ' :' + JSON.stringify(item));
      }

      if (item.showPivot) {
        showPivot(item.x, item.y);
      }
      if (temp.eventMode && item[temp.eventMode]) {
        let X = temp.mousePosition.x * zoom + temp.axisPosition[0] + temp.screen[0];
        let Y = -temp.mousePosition.y * zoom + temp.axisPosition[1] + temp.screen[1];// in isPointInPath and isPointInStroke value of under axis is positive 
        if (item.fill && ctx.isPointInPath(X, Y)) {
          temp.item = item;
        }
        else if (item.stroke && ctx.isPointInStroke(X, Y)) { temp.item = item }
      }
      ctx.closePath();
      ctx.restore();
    }
  }
  function clear() {
    temp.ctx.save();
    temp.ctx.setTransform(1, 0, 0, 1, 0, 0);
    temp.ctx.clearRect(0, 0, temp.width, temp.height);
    temp.ctx.restore();
  }
  function getBackground() {
    var [x, y, color = "rgba(70,70,70,0.3)"] = grid;
    var a = 100 * zoom;
    var b = x ? getValueByRange(x, 0, temp.width) * zoom + "px" : "100%";
    var c = y ? getValueByRange(y, 0, temp.height) * zoom + "px" : "100%";
    var h1 = `linear-gradient(${color} 0px,transparent 0px)`;
    var v1 = `linear-gradient(90deg,${color} 0px, transparent 0px)`;
    var h2 = `linear-gradient(${color} 1px, transparent 1px)`;
    var v2 = `linear-gradient(90deg,${color} 1px, transparent 1px)`;
    return {
      backgroundImage: `${h1},${v1},${h2},${v2}`,
      backgroundSize: `${a}px ${a}px,${a}px ${a}px,${b} ${c},${b} ${c}`
    };
  }
  function canvasToClient(pos: [number, number]) {
    if (!pos) {
      let res: [number, number, number, number] = [0, 0, 0, 0];
      return res
    }
    let [x, y] = pos;
    x = getValueByRange(x, 0, temp.width); // if x have % calc base on percent
    y = getValueByRange(y, 0, temp.height); // if y have % calc base on percent
    let res: [number, number, number, number] = [
      Math.round(temp.screen[0] + temp.axisPosition[0] + x * zoom),
      Math.round(temp.screen[1] + temp.axisPosition[1] - y * zoom),
      x, y
    ];
    return res
  }
  function clientToCanvas(pos, calcParentOffset = true) {
    let offset = calcParentOffset ? $(temp.dom.current).offset() : { left: 0, top: 0 };
    let client = [pos[0] - offset.left + window.pageXOffset, pos[1] - offset.top + window.pageYOffset];
    let res: [number, number] = [
      Math.floor((client[0] - temp.axisPosition[0] - temp.screen[0]) / zoom),
      -Math.floor((client[1] - temp.axisPosition[1] - temp.screen[1]) / zoom)
    ];
    return res
  }
  useEffect(() => { update() })
  useEffect(() => {
    if (props.onPan === true) {
      temp.getScreenPosition = () => spRef.current
      temp.setScreenPosition = (sp) => SetScreenPosition(sp)
    }
    else if (typeof props.onPan === 'function') {
      temp.getScreenPosition = () => props.screenPosition || [0, 0]
      temp.setScreenPosition = (screenPosition) => {
        if (typeof props.onPan === 'function') { props.onPan(screenPosition) }
      }
    }
    $(window).on("resize", resize);
    temp.ctx = temp.ctx || temp.dom.current.getContext("2d");
    update();
    onMount();
    getActions({ canvasToClient, clientToCanvas })
  }, [])
  function getRandomColor(range?: number) {
    range = range || 60;
    function getRGB() {
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
  function getCoordsByPivot(item) {
    var { pivot, x, y } = item;
    if (!pivot) {
      return [x, y];
    }
    var [px = 0, py = 0] = typeof pivot === "function" ? pivot(item) : pivot;
    return [
      x - getValueByRange(px, 0, temp.width),
      y - (-getValueByRange(py, 0, temp.height))
    ];
  }
  //notice index and length use in eval and seems not used but used
  function getCorner(corner, index) {
    if (!Array.isArray(corner)) { return corner }
    return corner[index] || 0
  }
  function getItem(ITEM: I_canvas_item | (() => I_canvas_item), parent: I_canvas_item) {
    let item: I_canvas_item;
    try { item = JSON.parse(JSON.stringify(typeof ITEM === "function" ? ITEM() : ITEM)) }
    catch { }
    let { x: parentx = 0, y: parenty = 0, opacity: parentOpacity = 1, fill: parentFill, stroke: parentStroke, sequence } = parent || { x: 0, y: 0, sequence: [], opacity: 1 };
    let sequenceProps: I_canvas_item = { type: item.type, fill: parentFill, stroke: parentStroke, rotate: 0, x: 0, y: 0, slice: undefined, opacity: 1, lineWidth: props.lineWidth || 1, r: undefined };
    try {
      for (let i = 0; i < sequence.length; i++) {
        let [prop, statement] = sequence[i].split(':');
        eval(`sequenceProps.${prop} = ${statement}`)
      }
    }
    catch { }
    let originalItem: I_canvas_item = { ...item };
    let { type } = originalItem;
    let {
      fill = sequenceProps.fill,
      stroke = sequenceProps.stroke,
      rotate = sequenceProps.rotate,
      x = sequenceProps.x,
      y = sequenceProps.y,
      slice = sequenceProps.slice,
      opacity = sequenceProps.opacity,
      lineWidth = sequenceProps.lineWidth,
      r = sequenceProps.r,
      lineJoin = 'miter',
      lineCap = 'butt',
      showPivot = false
    } = item;
    let updatedItem: I_canvas_item = { ...item, fill, stroke, rotate, slice, opacity, lineWidth, r, x, y, showPivot, lineJoin: lineJoin as any, lineCap, rect: false };
    if (!updatedItem.stroke && !updatedItem.fill) { updatedItem.stroke = "#000"; }
    //set related props
    updatedItem.rotate = getValueByRange(updatedItem.rotate, 0, 360);
    updatedItem.x = getValueByRange(updatedItem.x, 0, temp.width) + parentx;
    updatedItem.y = -getValueByRange(updatedItem.y, 0, temp.height) + parenty;
    updatedItem.opacity *= parentOpacity;
    updatedItem.pivotedCoords = getCoordsByPivot(updatedItem);
    //converts
    if (type === 'Arc' && updatedItem.arcPoints) {
      let arc = temp.geo.getArcByPoints(updatedItem.arcPoints, updatedItem.arcHeight);
      updatedItem.r = arc.r;
      updatedItem.slice = arc.slice;
      updatedItem.x = arc.x;
      updatedItem.y = -arc.y;
      updatedItem.pivotedCoords = getCoordsByPivot(updatedItem);
    }
    else if (type === 'Rectangle') {
      updatedItem.type = 'Line';
      let { width = 20, height = 20, corner = 0 } = updatedItem;
      width = getValueByRange(width, 0, temp.width);
      height = getValueByRange(height, 0, temp.height);
      updatedItem.rect = true;
      let [x, y] = updatedItem.pivotedCoords;
      updatedItem.points = [
        [x + width / 2, -y],
        [x + width, -y, getCorner(corner, 0)],
        [x + width, -y + height, getCorner(corner, 1)],
        [x, -y + height, getCorner(corner, 2)],
        [x, -y, getCorner(corner, 3)], [x + width / 2, -y, getCorner(corner, 0)]
      ];
    }
    else if (type === 'NGon') {
      updatedItem.type = 'Line';
      let { r = 20, count = 6, corner = 0, x, y } = updatedItem;//notice x,y in ngon should use
      updatedItem.points = temp.geo.getPointsByNGon(r, count, corner as number);
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
    var result = { ...originalItem, ...updatedItem };
    return result;
  }

  function drawGroup(item: I_canvas_item, index: number[]) {
    var [X, Y] = item.pivotedCoords;
    let items: I_canvas_items = [];
    let { repeat = 0 } = item;
    if (repeat) {
      for (let i = 0; i < item.items.length; i++) {
        let itm = item.items[i];
        let { showPivot } = itm;
        for (let j = 0; j < repeat; j++) {
          items.push({ ...itm, isRepeat: j > 0, showPivot: j === 0 ? showPivot : false })
        }
      }
    }
    else { items = item.items; }
    draw(items, { type: 'Group', x: X, y: Y, rotate: item.rotate, opacity: item.opacity, fill: item.fill, stroke: item.stroke, sequence: item.sequence }, index);
  }
  function drawText(p: I_canvas_item) {
    let { align = [0, 0], fontSize = 12, fontFamily = 'arial', text = "Text", fill, stroke, pivotedCoords = [] } = p;
    let [X, Y] = pivotedCoords;
    let textAlign = ["right", "center", "left"][align[0] + 1]
    let textBaseline = ["top", "middle", "bottom"][align[1] + 1]
    temp.ctx.textAlign = textAlign;
    temp.ctx.textBaseline = textBaseline;
    temp.ctx.font = `${fontSize * zoom}px ${fontFamily}`;
    stroke && temp.ctx.strokeText(text, X * zoom, Y * zoom);
    fill && temp.ctx.fillText(text, X * zoom, Y * zoom);
  }
  function drawImage(p: I_canvas_item) {
    let { pivotedCoords = [], width, height, image } = p;
    var [X, Y] = pivotedCoords;
    var fr = new FileReader();
    var img;
    fr.onload = () => {
      img = new Image();
      img.onload = () => temp.ctx.drawImage(img, X * zoom, Y * zoom, width * zoom, height * zoom);
      img.src = fr.result;
    };
    fr.readAsDataURL(image as any);
  }
  function drawLine(p: I_canvas_item) {
    let { points = [], close, stroke, fill, pivotedCoords, rect } = p;
    if (points.length < 1) { return false; }
    let Coords = rect ? [0, 0] : pivotedCoords;
    let [X, Y] = Coords;
    let start = [
      getValueByRange(points[0][0], 0, temp.width) + X,
      -getValueByRange(points[0][1], 0, temp.height) + Y
    ];
    temp.ctx.moveTo(start[0] * zoom, start[1] * zoom);
    let beforePoint = points[0];
    for (let i = 1; i < points.length; i++) {
      let [x, y, r] = points[i];
      beforePoint = [x, y];
      let point = [
        getValueByRange(x, 0, temp.width) + X,
        -getValueByRange(y, 0, temp.height) + Y
      ];
      if (r) {
        let [x, y] = points[i + 1] ? points[i + 1] : points[0];
        let nextPoint = [
          getValueByRange(x, 0, temp.width) + X,
          -getValueByRange(y, 0, temp.height) + Y
        ];
        temp.ctx.arcTo(point[0] * zoom, point[1] * zoom, nextPoint[0] * zoom, nextPoint[1] * zoom, r * zoom);
      }
      else { temp.ctx.lineTo(point[0] * zoom, point[1] * zoom); }
    }
    if (points.length > 2 && close) {
      temp.ctx.lineTo(start[0] * zoom, start[1] * zoom);
    }
    stroke && temp.ctx.stroke();
    fill && temp.ctx.fill();
  }
  function drawArc(p: I_canvas_item) {
    let { pivotedCoords = [], r, slice = [0, 360], fill, stroke } = p;
    let [X, Y] = pivotedCoords;
    r = getValueByRange(r, temp.width, temp.height);
    r = r < 0 ? 0 : r;
    slice = [
      getValueByRange(slice[0], 0, 360),
      getValueByRange(slice[1], 0, 360)
    ];
    if (rotateDirection === "clockwise") {
      let a = slice[0], b = slice[1];
      slice = [-b, -a];
    }
    temp.ctx.arc(X * zoom, Y * zoom, r * zoom, slice[0] * temp.PI, slice[1] * temp.PI);
    stroke && temp.ctx.stroke();
    fill && temp.ctx.fill();
  }
  function showPivot(x, y) {
    temp.ctx.beginPath();
    temp.ctx.arc(x, y, 10, 0, (360 * Math.PI) / 180);
    temp.ctx.moveTo(x - 15, y);
    temp.ctx.lineTo(x + 15, y);
    temp.ctx.moveTo(x, y - 15);
    temp.ctx.lineTo(x, y + 15);
    temp.ctx.lineWidth = 2;
    temp.ctx.strokeStyle = "rgba(255,100,0,.3)";
    temp.ctx.stroke();
    temp.ctx.closePath();
  }
  function rotate(angle: number = 0, pos: [number, number]) {
    if (angle === 0) { return; }
    let [X, Y] = pos;
    angle = angle * temp.PI * (rotateDirection === "clock" ? 1 : -1);
    let s = Math.sin(angle),
      c = Math.cos(angle);
    temp.ctx.rotate(angle);
    let x = X * c - -Y * s - X;
    let y = -Y - (X * s + -Y * c);
    temp.ctx.translate(x * zoom, y * zoom);
  }
  function getColor(color: string | string[], p?: number[]) {
    let [x = 0, y = 0] = p || [];
    if (!color) { return; }
    if (typeof color === "string") { return color; }
    let length = color.length;
    let g;
    if (length === 5) { g = temp.ctx.createLinearGradient(color[0] + x, color[1] + y, color[2] + x, color[3] + y); }
    else if (length === 7) { g = temp.ctx.createRadialGradient(color[0] + x, color[1] + y, color[2], color[3] + x, color[4] + y, color[5]) }
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
    var ctx = temp.ctx;
    ctx.shadowOffsetX = shadow[0]; ctx.shadowOffsetY = shadow[1]; ctx.shadowBlur = shadow[2]; ctx.shadowColor = shadow[3];
  }
  function panmousedown(e) {
    EventHandler("window", "mousemove", panmousemove);
    EventHandler("window", "mouseup", panmouseup);
    let screenPosition = temp.getScreenPosition();
    let client = GetClient(e);
    temp.startOffset = { x: client.x, y: client.y, endX: screenPosition[0], endY: screenPosition[1] };
  }
  function panmouseup() {
    EventHandler("window", "mousemove", panmousemove, "unbind");
    EventHandler("window", "mouseup", panmouseup, "unbind");
  }
  function panmousemove(e) {
    let so = temp.startOffset, coords = GetClient(e);
    let x = (so.x - coords.x) / zoom + so.endX, y = (coords.y - so.y) / zoom + so.endY;
    temp.setScreenPosition([x, y]);
  }
  function onMouseDown(e: any) {
    temp.mousePosition = getMousePosition(e);
    temp.eventMode = "onMouseDown";
    update();
    if (temp.item) { temp.item.onMouseDown({ event: e, mousePosition: temp.mousePosition, item: temp.item }) }
    else if (temp.setScreenPosition) { panmousedown(e) }
    else if (attrs.onMouseDown) { attrs.onMouseDown(e, temp.mousePosition) }
    temp.item = undefined; temp.eventMode = false;
  }
  function onMouseUp(e: any) {
    temp.mousePosition = getMousePosition(e);
    temp.eventMode = "onMouseUp";
    update();
    if (temp.item) { temp.item.onMouseUp({ event: e, mousePosition: temp.mousePosition, item: temp.item }) }
    else if (attrs.onMouseUp) { attrs.onMouseUp(e, temp.mousePosition) }
    temp.item = undefined; temp.eventMode = false;
  }
  function onClick(e) {
    temp.mousePosition = getMousePosition(e);//in onClick calc with no touch
    temp.eventMode = "onClick";
    update();
    if (temp.item) { temp.item.onClick({ event: e, mousePosition: temp.mousePosition, item: temp.item }) }
    else if (attrs.onClick) { attrs.onClick(e, temp.mousePosition) }
    temp.item = undefined; temp.eventMode = false;
  }
  function onMouseMove(e: any) {
    temp.mousePosition = getMousePosition(e);
    if (attrs.onMouseMove) { attrs.onMouseMove({ event: e, mousePosition: temp.mousePosition, item: temp.item }) }
    listenToMousePosition(temp.mousePosition)
  }

  function getMousePosition(e) {
    let client = GetClient(e);
    let [x, y] = clientToCanvas([client.x, client.y]);
    let [cx, cy] = canvasToClient([x, y])
    return { x, y, px: (x * 100) / temp.width, py: (y * 100) / temp.height, cx, cy };
  }
  let p = {
    ...attrs, ref: temp.dom,
    onMouseDown: undefined, onMouseMove: undefined, onMouseUp: undefined,
    onTouchStart: undefined, onTouchMove: undefined, onTouchEnd: undefined
  };
  if (temp.touch) {
    p.onTouchStart = onMouseDown;
    p.onTouchMove = onMouseMove;
    p.onTouchEnd = onMouseUp;
  }
  else {
    p.onMouseDown = onMouseDown;
    p.onMouseMove = onMouseMove;
    p.onMouseUp = onMouseUp;
  }
  p.onClick = onClick
  return <canvas {...p} />;
}
