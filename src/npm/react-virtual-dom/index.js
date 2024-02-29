import React, { Fragment } from "react";
import $ from 'jquery';
import "./index.css";
let RVDCLS = {
  rvd: 'rvd', pointer: 'rvd-pointer', gap: 'rvd-gap', justify: 'rvd-justify', align: 'rvd-align',
  row: 'rvd-row', column: 'rvd-column', hidexs: 'rvd-hide-xs', hidesm: 'rvd-hide-sm', hidemd: 'rvd-hide-md', hidelg: 'rvd-hide-lg'
}
export default function ReactVirtualDom(props) {
  let {layout,dragHandleClassName, onDragStart = () => { },onSwap = () => { }, onDrop = () => { },layouts = {},rtl,getLayout} = props;
  let temp = {};
  function getAlignClassName(node){
    let res;
    if (node.align === 'v') { res = node.column ? RVDCLS.justify : RVDCLS.align; }
    else if (node.align === 'h') { res = node.column ? RVDCLS.align : RVDCLS.justify; }
    else if (node.align === 'vh' || node.align === 'hv') { res = `${RVDCLS.justify} ${RVDCLS.align}`; }
    return res
  }
  function getClassName(isRoot, node, attrs = {}) {
    let res = RVDCLS.rvd;
    if (isRoot) { res += ' rvd-root' }
    let className = node.className || attrs.className
    if (className) { res += ' ' + className }
    if (!!attrs.onClick) { res += ' ' + RVDCLS.pointer; }
    let alignClassName = getAlignClassName(node);
    if(alignClassName){res += ' ' + alignClassName}
    if (node.row) { res += ' ' + RVDCLS.row }
    else if (node.column || node.grid) { res += ' ' + RVDCLS.column }
    let hideClassName = getHideClassName(node);
    if(hideClassName){res += ' ' + hideClassName}
    return res;
  }
  function getChilds(node){
    let childs = [];
    if (node.row) { childs = typeof node.row === 'function' ? node.row() : node.row; }
    else if (node.column) { childs = typeof node.column === 'function' ? node.column() : node.column }
    else if (node.grid) {
      let { gridCols = 2 } = node;
      let grid = typeof node.grid === 'function' ? node.grid() : node.grid;
      for (let i = 0; i < grid.length; i += gridCols) {
        let row = [];
        let gridRow = typeof node.gridRow === 'function' ? node.gridRow(i) : node.gridRow;
        for (let j = i; j < i + gridCols; j++) {if (grid[j]) { row.push(grid[j]) }}
        childs.push({row: [...row], ...gridRow})
      }
      node.column = [...childs]
    }
    return childs;
  }
  function getStyle(node,parent,attrs){
    let { size, flex } = node,{row,column,grid} = parent;
    let style = {...(node.style || attrs.style || {})};
    if(size !== undefined){
      if (row) {style.width = size; flex = undefined}
      else if (column || grid) {style.height = size; flex = undefined }
    }
    return { flex, ...style }
  }
  function getDragAttrs(node){
    let {dragId} = node;
    if(dragId === undefined){return {}}
    let res = {};
    res.draggable = true;
    res.onDragStart = (e) => {
      if (dragHandleClassName) {
        if (!$(e.target).hasClass(dragHandleClassName) && $(e.target).parents('.' + dragHandleClassName).length === 0) { return; }
      }
      onDragStart(dragId)
      temp.dragId = dragId;
    }
    res.onDragOver = (e) => e.preventDefault();
    res.onDrop = () => {
      if (temp.dragId === dragId) { return; }
      onSwap(temp.dragId, dragId);
      onDrop(dragId);
      temp.dragId = false
    }
    return res;
  }
  function getOnClick(node){
    if(node.loading){return}
    let { onClick, egg,attrs = {} } = node;
    if (egg) { return (() => eggHandler(egg)) }
    return onClick || attrs.onClick; 
  }
  function getLongTouchAttrs(node,dataId){
    let { longTouch } = node;
    if(typeof longTouch !== 'function'){return {}}
    let res = {};
    res['ontouchstart' in document.documentElement ? 'onTouchStart' : 'onMouseDown'] = (e) => {
      temp.lt = dataId;
      temp[dataId + 'callback'] = longTouch;
      timer()
      eventHandler('mouseup', longTouchMouseUp);
    }
    return res
  }
  function timer() {
    temp.time = 0;
    temp[temp.lt + 'interval'] = setInterval(() => {
      temp.time++;
      if (temp.time > 50) {
        clearInterval(temp[temp.lt + 'interval']);
        temp[temp.lt + 'callback']()
      }
    }, 10)
  }
  function longTouchMouseUp() {
    eventHandler('mouseup', longTouchMouseUp, 'unbind');
    clearInterval(temp[temp.lt + 'interval']);
  }
  function getAttrs(node,isRoot){
    let attrs = node.attrs?{...node.attrs}:{};
    let dataId = 'a' + Math.random()
    attrs['data-id'] = dataId;
    attrs.style = getStyle(node,parent,attrs)
    attrs.onClick = getOnClick(node);
    attrs = {...attrs,...getDragAttrs(node)};
    attrs.className = getClassName(isRoot, node, attrs);
    attrs = {...attrs,...getLongTouchAttrs(node,dataId)};
    return attrs
  }
  function getHtml(node,parent){
    let { html = '',loading} = node;
    html = typeof html === 'function' ? html() : html;
    if (typeof html === 'string' && layouts[html]) {html = layouts[html](node,parent)}
    if (loading && html) {html = (<><div style={{ opacity: 0 }}>{html}</div><div className='rvd-loading'></div></>)}
    return html
  }
  function isLoading(node,parent = {}){
    if(typeof node.loading === 'boolean'){return node.loading}
    return !!parent.loading;
  }
  function getNode(node,parent){
    if(!node || node === null){return false}
    if(Array.isArray(node)){alert('rvd error => node cannot be an array'); return false}
    if(typeof node !== 'object'){alert('rvd error => node should be an object'); return false}
    if(typeof node.layout === 'string'){
      if(layouts[node.layout]){
        return getNode(layouts[node.layout](node,parent),parent)
      }
      else {return false}
    }
    return node 
  }
  function getLayout(obj, index, parent, isRoot) {
    let node = getNode(obj);
    if (node === false) { return '' }
    if ((typeof node.show === 'function' ? node.show() : node.show) === false) { return '' }
    if (getLayout) { node = getLayout(node, parent) }
    node.loading = isLoading(node,parent);
    let content;
    let childs = getChilds(node);
    if(childs.length){content = childs.map((o, i) => {
      let parent = node;
      return <Fragment key={i}>{getLayout(o, i, parent, false)}</Fragment>
    })}
    else {content = getHtml(node,parent)}
    let attrs = getAttrs(node,isRoot);
    let gap = getGap({node, parent, dataId:attrs['data-id'],rtl,index});
    return (<Fragment key={index}><div {...attrs}>{content}</div>{ gap !== false && <div {...gap.attrs}>{gap.content}</div>}</Fragment>)
  }
  function eggHandler({ callback = () => { }, count = 10 }) {
    temp.eggCounter = temp.eggCounter || 0;
    temp.eggCounter++;
    if (temp.eggCounter >= count) { callback() }
    clearTimeout(temp.timeOut);
    temp.timeOut = setTimeout(() => temp.eggCounter = 0, 500)
  }
  return getLayout(layout, 0, undefined, true);
}
export function RVDRemoveV(selector, callback) {
  $(selector).animate({ opacity: 0 }, 100).animate({ height: 0, padding: 0 }, 150, callback);
}
export function RVDRemoveH(selector, callback) {
  $(selector).animate({ opacity: 0 }, 100).animate({ width: 0, padding: 0 }, 150, callback);
}
export function RVDRemove(selector, callback) {
  $(selector).animate({ opacity: 0 }, 200, callback);
}
function eventHandler(event, action, type = 'bind') {
  event = 'ontouchstart' in document.documentElement ? { mousemove: "touchmove", mouseup: "touchend" }[event] : event;
  $(window).unbind(event, action);
  if (type === 'bind') { $(window).bind(event, action) }
}
function getGap({node, parent = {}, dataId,rtl,index}) {
  let $$ = {
    getClient(e) { return 'ontouchstart' in document.documentElement ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY } },
    mouseMove(e) {
      var { pos, axis, size, dataId } = this.so;
      var client = this.getClient(e);
      var offset = (client[axis] - pos[axis]) * (rtl ? -1 : 1);
      if (offset % 24 !== 0) { return }
      this.so.newSize = offset + size;
      var panel = $('[data-id="' + dataId + '"]');
      panel.css({ [{ 'x': 'width', 'y': 'height' }[axis]]: this.so.newSize })
    },
    mouseUp() {
      eventHandler('mousemove', this.mouseMove, 'unbind');
      eventHandler('mouseup', this.mouseUp, 'unbind');
      var { onResize, newSize } = this.so;
      onResize(newSize);
    },
    getClassName(cls) {
      let className = RVDCLS.gap;
      if (cls) { className += ' ' + cls }
      let hideClassName = getHideClassName(node)
      return className + (hideClassName ? ' ' + hideClassName : '');
    },
    getGap() {
      let {gap} = parent,style = {}, axis;
      if(!gap){return false}
      let res = typeof gap === 'function' ? gap(node, parent,index) : gap;
      let size,content = '',attrs = {};
      if(typeof res === 'object'){
        size = res.size;
        content = res.content === undefined?'':res.content;
        attrs = res.attrs || {};
      }
      else {size = res;}
      if(!size){return false}
      if (parent.row) {axis = 'x'; style.width = size;}
      else if (parent.column || parent.grid) {axis = 'y'; style.height = size;}
      else { return false }
      style = { ...style, ...attrs.style }
      attrs = {
        ...attrs,
        className: this.getClassName(attrs.className), style, draggable: false,
        onDragStart: (e) => { e.preventDefault(); return false }
      };
      if (node.size && node.onResize) {
        attrs.style.cursor = axis === 'x'?'col-resize':'row-resize';
        attrs['ontouchstart' in document.documentElement ? 'onTouchStart' : 'onMouseDown'] = (e) => {
          this.so = { pos: this.getClient(e), onResize:node.onResize, axis, size:node.size, dataId };
          eventHandler('mousemove', $.proxy(this.mouseMove, this));
          eventHandler('mouseup', $.proxy(this.mouseUp, this));
        }
      }
      return {attrs,content};
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
function Cls(key, CLASSNAME) {
  let className = `rvd-${key}`;
  if (CLASSNAME) { className += ' ' + CLASSNAME }
  return className;
}
export function renderCards({ items = [], gap, attrs = {} }) {
  return (
    <ReactVirtualDom
      layout={{
        className: Cls('cards-container', attrs.className),
        column: [
          {
            className: Cls('cards'), style:{gap},
            column: items.map((o) => {
              return {
                style:{gap}, row: o.map((card) => {return {className: 'of-visible', flex: 1, html: renderCard(card)}})
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
      layout={{
        className: Cls('cards-row-container'),
        column: [
          {
            className: Cls('cards-row', 'of-visible'), style:{gap},
            row: rows.map((card) => {return {className: 'of-visible',html: renderCard(card)}})
          }
        ]
      }}
    />
  )
}
export function renderCard({ text, subtext, uptext, attrs = {}, before, after, header, footer, justify,classes = {} }) {
  return (
    <ReactVirtualDom
      layout={{
        attrs, onClick: attrs.onClick, className: Cls('card', attrs.className) + (justify ? ' justify' : ''), style: attrs.style,
        column: [
          { show: !!header && !Array.isArray(header), html: header, className: Cls('card-header',classes.header) },
          {
            show: !!Array.isArray(header), className: Cls('card-header',classes.header),
            row: () => [{ html: header[0] }, { flex: 1 }, { html: header[1] }]
          },
          {
            className: Cls('card-body',classes.body),
            row: [
              { show: !!before, html: () => before, align: 'vh', className: Cls('card-before',classes.before) },
              {
                flex: 1, align: 'v',
                column: [
                  { show: !!uptext, html: uptext, className: Cls('card-uptext',classes.uptext) },
                  { html: text, className: Cls('card-text',classes.text) },
                  { show: !!subtext, html: () => subtext, className: Cls('card-subtext',classes.subtext) }
                ]
              },
              { show:!!after,html: ()=>after, align: 'vh', className: Cls('card-after',classes.after) }
            ]
          },
          { show: !!footer && !Array.isArray(footer), html: footer, className: Cls('card-footer',classes.footer) },
          {
            show: !!Array.isArray(footer), className: Cls('card-footer',classes.footer),
            row: () => [{ html: footer[0] }, { flex: 1 }, { html: footer[1] }]
          }
        ]
      }}
    />
  )
}