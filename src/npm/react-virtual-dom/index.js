"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCard = exports.renderCardsRow = exports.renderCards = exports.animate = void 0;
var react_1 = require("react");
var jquery_1 = require("jquery");
require("./index.css");
var RVDContext = (0, react_1.createContext)({});
function ReactVirtualDom(props) {
    var rootNode = props.rootNode;
    var temp = (0, react_1.useState)({})[0];
    function getTemp(key) { return temp[key]; }
    function setTemp(key, value) { temp[key] = value; }
    var _a = (0, react_1.useState)(props.state), state = _a[0], changeState = _a[1];
    var setState = function (key, value) {
        var _a;
        return changeState(typeof key === 'string' ? __assign(__assign({}, state), (_a = {}, _a[key] = value, _a)) : key);
    };
    var rootNodeProps = { node: rootNode, index: 0, level: 0 };
    var context = { getTemp: getTemp, setTemp: setTemp, rootProps: props, state: state, setState: setState };
    return (<RVDContext.Provider value={context}><RVDNode {...rootNodeProps}/></RVDContext.Provider>);
}
exports.default = ReactVirtualDom;
function RVDNode(props) {
    var context = (0, react_1.useContext)(RVDContext);
    var rootProps = context.rootProps, state = context.state, setState = context.setState;
    var parent = props.parent, index = props.index, level = props.level;
    function getHtml(node) {
        var _a = node.html, html = _a === void 0 ? '' : _a, loading = node.loading;
        html = typeof html === 'function' ? html({ state: state, setState: setState }) : html;
        var res;
        if (loading && html) {
            res = (<><div style={{ opacity: 0 }}>{html}</div><div className='rvd-loading'></div></>);
        }
        else {
            res = html;
        }
        return res;
    }
    function getChilds(node) {
        var childs = [];
        if (node.row) {
            childs = typeof node.row === 'function' ? node.row({ state: state, setState: setState }) : node.row;
        }
        else if (node.column) {
            childs = typeof node.column === 'function' ? node.column({ state: state, setState: setState }) : node.column;
        }
        else if (node.grid) {
            var _a = node.gridCols, gridCols = _a === void 0 ? 2 : _a;
            var grid = typeof node.grid === 'function' ? node.grid({ state: state, setState: setState }) : node.grid;
            for (var i = 0; i < grid.length; i += gridCols) {
                var row = [];
                var gridRow = typeof node.gridRow === 'function' ? node.gridRow(i) : node.gridRow;
                for (var j = i; j < i + gridCols; j++) {
                    if (grid[j]) {
                        row.push(grid[j]);
                    }
                }
                childs.push(__assign({ row: __spreadArray([], row, true) }, gridRow));
            }
            node.column = __spreadArray([], childs, true);
        }
        return childs;
    }
    function getNodeClasses(node, parent) {
        var res = [];
        if (parent && parent.nodeClasses) {
            res = __spreadArray([], parent.nodeClasses, true);
        }
        if (node.nodeClass) {
            res = __spreadArray(__spreadArray([], res, true), [node.nodeClass], false);
        }
        return res;
    }
    function isLoading(node, parent) {
        if (typeof node.loading === 'boolean') {
            return node.loading;
        }
        return parent ? !!parent.loading : false;
    }
    function getNode() {
        var node = props.node;
        if (rootProps.editNode) {
            node = rootProps.editNode(node, parent);
        }
        node.loading = isLoading(node, parent);
        node.nodeClasses = getNodeClasses(node, parent);
        return node;
    }
    function getContent(node) {
        var content;
        var childs = getChilds(node);
        if (childs.length) {
            content = childs.map(function (o, i) {
                var key = o.key === undefined ? i : o.key;
                var p = { node: o, index: i, level: level + 1, parent: node };
                return <RVDNode key={key} {...p}/>;
            });
        }
        else {
            content = getHtml(node);
        }
        return content;
    }
    if (!props.node || props.node === null) {
        return null;
    }
    if ((typeof props.node.show === 'function' ? props.node.show() : props.node.show) === false) {
        return null;
    }
    var node = getNode();
    var content = getContent(node);
    var attrs = new RVDAttrs({ node: node, parent: parent, level: level, index: index, context: context }).getAttrs();
    var gap = getGap({ node: node, parent: parent, dataId: attrs['data-id'], rtl: rootProps.rtl, index: index, level: level, context: context });
    return (<>
            <div {...attrs}>{content}</div>
            {gap !== null && gap}
        </>);
}
var RVDAttrs = /** @class */ (function () {
    function RVDAttrs(props) {
        var _this = this;
        this.getStyle = function () {
            var _a = _this.node, size = _a.size, flex = _a.flex, _b = _a.attrs, attrs = _b === void 0 ? {} : _b;
            var style = __assign({}, (_this.node.style || attrs.style || {}));
            if (size !== undefined) {
                if (_this.parent) {
                    if (_this.parent.row) {
                        style.width = size;
                        flex = undefined;
                    }
                    else if (_this.parent.column || _this.parent.grid) {
                        style.height = size;
                        flex = undefined;
                    }
                }
            }
            return __assign({ flex: flex }, style);
        };
        this.getOnClick = function () {
            var _a = _this.node, onClick = _a.onClick, _b = _a.attrs, attrs = _b === void 0 ? {} : _b, loading = _a.loading;
            if (loading) {
                return;
            }
            return onClick || attrs.onClick;
        };
        this.getDragAttrs = function () {
            var isReorder = _this.parent && _this.parent.reOrder && Array.isArray(_this.parent.data);
            var isDragable = _this.node.onDrag || _this.node.onDrop;
            if (!isReorder && !isDragable) {
                return {};
            }
            var _a = _this.context, rootProps = _a.rootProps, getTemp = _a.getTemp, setTemp = _a.setTemp;
            var dragHandleClassName = rootProps.dragHandleClassName;
            var res = {};
            res.draggable = true;
            res.onDragStart = function (e) {
                if (dragHandleClassName) {
                    if (!(0, jquery_1.default)(e.target).hasClass(dragHandleClassName) && (0, jquery_1.default)(e.target).parents('.' + dragHandleClassName).length === 0) {
                        return;
                    }
                }
                if (isReorder) {
                    setTemp('dragIndex', _this.index);
                }
                else if (_this.node.onDrag) {
                    _this.node.onDrag(e);
                }
            };
            res.onDragOver = function (e) { return e.preventDefault(); };
            res.onDrop = function (e) {
                if (isReorder) {
                    var dragIndex = getTemp('dragIndex');
                    if (dragIndex === false || dragIndex === _this.index) {
                        return;
                    }
                    _this.parent.reOrder(ReOrder({ data: _this.parent.data, fromIndex: dragIndex, toIndex: _this.index }), dragIndex, _this.index);
                    setTemp('dragIndex', false);
                }
                else if (_this.node.onDrop) {
                    _this.node.onDrop(e);
                }
            };
            return res;
        };
        this.getClassName = function () {
            var _a = _this.context.rootProps.classes, classes = _a === void 0 ? {} : _a;
            var res = 'rvd';
            if (_this.level === 0) {
                res += ' rvd-root';
            }
            var _b = _this.node, _c = _b.attrs, attrs = _c === void 0 ? {} : _c, nodeClass = _b.nodeClass, nodeClasses = _b.nodeClasses, row = _b.row, column = _b.column, grid = _b.grid, loading = _b.loading, wrap = _b.wrap;
            if (_this.node.className) {
                var className = void 0;
                if (Array.isArray(_this.node.className)) {
                    className = _this.node.className.filter(function (cls) { return !!cls && typeof cls === 'string'; }).join(' ');
                }
                else {
                    className = _this.node.className;
                }
                var dcls = classes[className];
                if (typeof dcls === 'function') {
                    className = dcls(_this.node, _this.parent);
                }
                else if (typeof dcls === 'string') {
                    className = dcls;
                }
                if (className && typeof className === 'string') {
                    res += ' ' + className;
                }
            }
            if (wrap) {
                res += ' wrap';
            }
            if (nodeClass) {
                res += ' ' + nodeClasses.join('-');
            }
            if (!!attrs.onClick) {
                res += ' pointer';
            }
            if (_this.node.align) {
                res += " align-".concat(_this.node.align);
            }
            if (row) {
                res += ' rvd-row';
            }
            else if (column || grid) {
                res += ' rvd-column';
            }
            if (loading) {
                res += ' rvd-parent-loading';
            }
            var hideClassName = getHideClassName(_this.node);
            if (hideClassName) {
                res += ' ' + hideClassName;
            }
            return res;
        };
        this.getLongTouchAttrs = function (dataId) {
            var longTouch = _this.node.longTouch;
            var setTemp = _this.context.setTemp;
            if (typeof longTouch !== 'function') {
                return {};
            }
            var res = {};
            res['ontouchstart' in document.documentElement ? 'onTouchStart' : 'onMouseDown'] = function (e) {
                setTemp('lt', dataId);
                setTemp(dataId + 'callback', longTouch);
                _this.timer();
                eventHandler('mouseup', _this.longTouchMouseUp);
            };
            return res;
        };
        this.timer = function () {
            var _a = _this.context, setTemp = _a.setTemp, getTemp = _a.getTemp;
            var lt = getTemp('lt');
            setTemp('time', 0);
            setTemp(lt + 'interval', setInterval(function () {
                var time = getTemp('time');
                time++;
                setTemp('time', time);
                if (time > 50) {
                    clearInterval(getTemp(lt + 'interval'));
                    var callback = getTemp(lt + 'callback');
                    callback();
                }
            }, 10));
        };
        this.longTouchMouseUp = function () {
            var getTemp = _this.context.getTemp;
            eventHandler('mouseup', _this.longTouchMouseUp, 'unbind');
            var lt = getTemp('lt');
            clearInterval(getTemp(lt + 'interval'));
        };
        this.getAttrs = function () {
            var attrs = _this.node.attrs ? __assign({}, _this.node.attrs) : {};
            var dataId = 'a' + Math.random();
            attrs['data-id'] = dataId;
            attrs.style = _this.getStyle();
            attrs.onClick = _this.getOnClick();
            attrs = __assign(__assign({}, attrs), _this.getDragAttrs());
            attrs.className = _this.getClassName();
            attrs = __assign(__assign({}, attrs), _this.getLongTouchAttrs(dataId));
            return attrs;
        };
        var node = props.node, parent = props.parent, level = props.level, index = props.index, context = props.context;
        this.node = node;
        this.parent = parent;
        this.level = level;
        this.index = index;
        this.context = context;
    }
    return RVDAttrs;
}());
function animate(type, selector, callback) {
    if (type === 'removeV') {
        (0, jquery_1.default)(selector).animate({ opacity: 0 }, 250).animate({ height: 0, padding: 0, margin: 0 }, 200, callback);
    }
    else if (type === 'removeH') {
        (0, jquery_1.default)(selector).animate({ opacity: 0 }, 250).animate({ width: 0, padding: 0, margin: 0 }, 200, callback);
    }
    else if (type === 'removeL') {
        (0, jquery_1.default)(selector).animate({ right: '100%' }, 250).animate({ height: 0, width: 0, padding: 0, margin: 0 }, 200, callback);
    }
    else if (type === 'remove') {
        (0, jquery_1.default)(selector).animate({ opacity: 0 }, 250).animate({ width: 0, height: 0, padding: 0, margin: 0 }, 200, callback);
    }
}
exports.animate = animate;
function eventHandler(event, action, type) {
    if (type === void 0) { type = 'bind'; }
    event = 'ontouchstart' in document.documentElement ? { mousemove: "touchmove", mouseup: "touchend" }[event] : event;
    (0, jquery_1.default)(window).unbind(event, action);
    if (type === 'bind') {
        (0, jquery_1.default)(window).bind(event, action);
    }
}
function getGap(p) {
    var node = p.node, _a = p.parent, parent = _a === void 0 ? {} : _a, dataId = p.dataId, rtl = p.rtl, index = p.index, level = p.level, context = p.context;
    var $$ = {
        getClient: function (e) { return 'ontouchstart' in document.documentElement ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY }; },
        mouseMove: function (e) {
            var _a;
            var _b = this.so, pos = _b.pos, size = _b.size;
            var client = this.getClient(e);
            var axis = parent.row ? 'x' : 'y';
            var offset = (client[axis] - pos[axis]) * (rtl ? -1 : 1);
            //if (offset % 24 !== 0) { return }
            this.so.newSize = offset + size;
            var panel = (0, jquery_1.default)('[data-id="' + dataId + '"]');
            panel.css((_a = {}, _a[{ 'x': 'width', 'y': 'height' }[axis]] = this.so.newSize, _a));
        },
        mouseUp: function () {
            eventHandler('mousemove', this.mouseMove, 'unbind');
            eventHandler('mouseup', this.mouseUp, 'unbind');
            var newSize = this.so.newSize;
            node.onResize(newSize);
        },
        getGap: function () {
            var _this = this;
            var gap = parent.gap;
            gap = typeof gap === 'function' ? gap({ node: node, parent: parent, index: index, level: level }) : gap;
            if (!gap || !parent) {
                return null;
            }
            var gapAttrs = {
                draggable: false,
                onDragStart: function (e) { e.preventDefault(); return false; }
            };
            if (node.size && node.onResize) {
                gapAttrs['ontouchstart' in document.documentElement ? 'onTouchStart' : 'onMouseDown'] = function (e) {
                    _this.so = { pos: _this.getClient(e), size: node.size };
                    eventHandler('mousemove', jquery_1.default.proxy(_this.mouseMove, _this));
                    eventHandler('mouseup', jquery_1.default.proxy(_this.mouseUp, _this));
                };
            }
            var className = 'rvd-gap';
            if (gap.className) {
                className += ' ' + gap.className;
            }
            var p = { node: __assign(__assign({}, gap), { className: className, attrs: __assign(__assign({}, gap.attrs), gapAttrs) }), parent: parent, level: level, index: index, context: context };
            var Attrs = new RVDAttrs(p);
            var attrs = Attrs.getAttrs();
            var _a = gap.html, html = _a === void 0 ? '' : _a;
            if (node.loading) {
                html = '';
            }
            return <div {...attrs}>{html}</div>;
        }
    };
    return $$.getGap();
}
function getHideClassName(node) {
    var hide_xs, hide_sm, hide_md, hide_lg, className;
    if (node.show_xs) {
        hide_xs = false;
        hide_sm = true;
        hide_md = true;
        hide_lg = true;
    }
    if (node.hide_xs) {
        hide_xs = true;
    }
    if (node.show_sm) {
        hide_xs = true;
        hide_sm = false;
        hide_md = true;
        hide_lg = true;
    }
    if (node.hide_sm) {
        hide_sm = true;
    }
    if (node.show_md) {
        hide_xs = true;
        hide_sm = true;
        hide_md = false;
        hide_lg = true;
    }
    if (node.hide_md) {
        hide_md = true;
    }
    if (node.show_lg) {
        hide_xs = true;
        hide_sm = true;
        hide_md = true;
        hide_lg = false;
    }
    if (node.hide_lg) {
        hide_lg = true;
    }
    if (hide_xs) {
        className += ' rvd-hide-xs';
    }
    if (hide_sm) {
        className += ' rvd-hide-sm';
    }
    if (hide_md) {
        className += ' rvd-hide-md';
    }
    if (hide_lg) {
        className += ' rvd-hide-lg';
    }
    return className;
}
function Cls(key, CLASSNAME) {
    var className = "rvd-".concat(key);
    if (CLASSNAME) {
        className += ' ' + CLASSNAME;
    }
    return className;
}
function renderCards(p) {
    var _a = p.items, items = _a === void 0 ? [] : _a, gap = p.gap, _b = p.attrs, attrs = _b === void 0 ? {} : _b;
    return (<ReactVirtualDom rootNode={{
            className: Cls('cards-container', attrs.className),
            column: [
                {
                    className: Cls('cards'), style: { gap: gap },
                    column: items.map(function (o) {
                        return {
                            style: { gap: gap }, row: o.map(function (card) { return { className: 'of-visible', flex: 1, html: renderCard(card) }; })
                        };
                    })
                }
            ]
        }}/>);
}
exports.renderCards = renderCards;
function renderCardsRow(rows, gap) {
    if (rows === void 0) { rows = []; }
    return (<ReactVirtualDom rootNode={{
            className: Cls('cards-row-container'),
            column: [
                {
                    className: Cls('cards-row', 'of-visible'), style: { gap: gap },
                    row: rows.map(function (card) { return { className: 'of-visible', html: renderCard(card) }; })
                }
            ]
        }}/>);
}
exports.renderCardsRow = renderCardsRow;
function renderCard(p) {
    var text = p.text, subtext = p.subtext, uptext = p.uptext, _a = p.attrs, attrs = _a === void 0 ? {} : _a, before = p.before, after = p.after, header = p.header, footer = p.footer, justify = p.justify, _b = p.classes, classes = _b === void 0 ? {} : _b;
    return (<ReactVirtualDom rootNode={{
            attrs: attrs,
            onClick: attrs.onClick, className: Cls('card', attrs.className) + (justify ? ' justify' : ''), style: attrs.style,
            column: [
                { show: !!header && !Array.isArray(header), html: header, className: Cls('card-header', classes.header) },
                {
                    show: !!Array.isArray(header), className: Cls('card-header', classes.header),
                    row: function () { return [{ html: header[0] }, { flex: 1 }, { html: header[1] }]; }
                },
                {
                    className: Cls('card-body', classes.body),
                    row: [
                        { show: !!before, html: function () { return before; }, align: 'vh', className: Cls('card-before', classes.before) },
                        {
                            flex: 1, align: 'v',
                            column: [
                                { show: !!uptext, html: uptext, className: Cls('card-uptext', classes.uptext) },
                                { html: text, className: Cls('card-text', classes.text) },
                                { show: !!subtext, html: function () { return subtext; }, className: Cls('card-subtext', classes.subtext) }
                            ]
                        },
                        { show: !!after, html: function () { return after; }, align: 'vh', className: Cls('card-after', classes.after) }
                    ]
                },
                { show: !!footer && !Array.isArray(footer), html: footer, className: Cls('card-footer', classes.footer) },
                {
                    show: !!Array.isArray(footer), className: Cls('card-footer', classes.footer),
                    row: function () { return [{ html: footer[0] }, { flex: 1 }, { html: footer[1] }]; }
                }
            ]
        }}/>);
}
exports.renderCard = renderCard;
function ReOrder(p) {
    var data = p.data, fromIndex = p.fromIndex, toIndex = p.toIndex;
    var from = data[fromIndex];
    var newData = data.filter(function (o, i) { return i !== fromIndex; });
    newData.splice(toIndex, 0, from);
    return newData;
}
