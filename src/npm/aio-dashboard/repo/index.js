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
exports.Pie = exports.Chart = void 0;
var react_1 = require("react");
var aio_utils_1 = require("aio-utils");
var aio_canvas_1 = require("aio-canvas");
var jquery_1 = require("jquery");
require("./index.css");
var aio_input_1 = require("aio-input");
var ChartCtx = (0, react_1.createContext)({});
var Chart = function (props) {
    var propsRef = (0, react_1.useRef)(props);
    propsRef.current = props;
    var aio_chart_ref = (0, react_1.useState)((0, react_1.createRef)())[0];
    var canvas = (0, react_1.useState)(new aio_canvas_1.default())[0];
    var _a = (0, react_1.useState)([]), canvasItems = _a[0], setCanvasItems = _a[1];
    var dataDetailsRef = (0, react_1.useRef)([]);
    var labelDetailsRef = (0, react_1.useRef)({ key: [], value: [] });
    var chartSizeRef = (0, react_1.useRef)();
    var _b = (0, react_1.useState)([props.keyAxis.start, props.keyAxis.end]), filter = _b[0], setFilter = _b[1];
    var filterRef = (0, react_1.useRef)(filter);
    filterRef.current = filter;
    var dic = (0, react_1.useState)(getDic)[0];
    function getDic() {
        if (props.reverse) {
            return { x: 'value', y: 'key', key: 'y', value: 'x' };
        }
        else {
            return { x: 'key', y: 'value', key: 'x', value: 'y' };
        }
    }
    var chartClass = (0, react_1.useState)(new ChartData({
        getFilter: function () { return filterRef.current; },
        getProps: function () { return propsRef.current; },
        getChartSize: function () { return chartSizeRef.current; },
        dic: dic
    }))[0];
    var timeout = (0, react_1.useState)()[0];
    var timeout1 = (0, react_1.useState)()[0];
    var filterMouseDownRef = (0, react_1.useRef)(false);
    var calcTemp = (0, react_1.useRef)();
    function setFilterMouseDownRef(v) {
        filterMouseDownRef.current = v;
    }
    function getFilterMouseDownRef() {
        return filterMouseDownRef.current;
    }
    function changeFilter(newFilter) {
        filter = newFilter;
        setFilter(newFilter);
        update();
    }
    function updateLabels() {
        clearTimeout(timeout1);
        timeout1 = setTimeout(function () {
            var aio_chart = (0, jquery_1.default)(aio_chart_ref.current);
            var labels = aio_chart.find('.aio-chart-horizontal-label-text');
            if (!labels.length) {
                return;
            }
            var firstLabel = labels.eq(0);
            var firstLabelHProp = firstLabel.attr('data-rotated') === 'yes' ? 'height' : 'width';
            var end = firstLabel.offset().left + (firstLabel[firstLabelHProp]());
            for (var i = 1; i < labels.length; i++) {
                var label = labels.eq(i);
                var hProp = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
                label.css({ display: 'flex' });
                var left = label.offset().left;
                var width = label[hProp]();
                if (left < end + 5) {
                    label.css({ display: 'none' });
                }
                else {
                    end = left + width;
                }
            }
        }, 100);
    }
    function clientSizeToCanvasSize(dir) {
        if (dir === 'x') {
            var bottom = canvas.clientToCanvas([0, 0])[1];
            var top_1 = canvas.clientToCanvas([0, chartSizeRef.current[dir === 'x' ? 'y' : 'x']])[1];
            return top_1 - bottom;
        }
        else {
            var left = canvas.clientToCanvas([0, 0])[0];
            var right = canvas.clientToCanvas([chartSizeRef.current[dir === 'x' ? 'y' : 'x'], 0])[0];
            return right - left;
        }
    }
    function getGridLines(dir) {
        var _a = props["".concat(dic[dir], "Axis")].gridLineColor, gridLineColor = _a === void 0 ? dir === 'y' ? '#ddd' : undefined : _a;
        if (!gridLineColor) {
            return [];
        }
        var csize = clientSizeToCanvasSize(dir);
        var color = 'red';
        if (!color) {
            return [];
        }
        var d = dic[dir];
        var labels = labelDetailsRef.current[d];
        var gridLines = [];
        for (var i = 0; i < labels.length; i++) {
            var offset = labels[i].offset;
            if (dir === 'y') {
                gridLines.push({ type: 'Line', points: [[0, offset], [csize, offset]], stroke: gridLineColor });
            }
            else {
                gridLines.push({ type: 'Line', points: [[offset, 0], [offset, csize]], stroke: gridLineColor });
            }
        }
        return gridLines;
    }
    function getKeyLabelsDetail() {
        var res = [];
        var start = filter[0], end = filter[1];
        for (var key = start; key <= end; key++) {
            var _a = chartClass.getPointDetail({ d: 'key', value: key }), offset = _a.offset, text = _a.text;
            res.push({ offset: offset, text: text });
        }
        return res;
    }
    function getValueLabelsDetail(size) {
        var _a = props.valueAxis, start = _a.start, end = _a.end;
        var step = (end - start) / 10;
        var magnitude = Math.pow(10, Math.floor(Math.log10(step)));
        step = Math.round(step / magnitude) * magnitude;
        if (size[dic.value] < 240) {
            step *= 2;
        }
        var labels = [];
        for (var i = start; i <= end; i += step) {
            var _b = chartClass.getPointDetail({ d: 'value', value: +i.toFixed(3) }), offset = _b.offset, text = _b.text;
            labels.push({ offset: offset, text: text });
        }
        return labels;
    }
    function getElements(dataDetails) {
        var lines = [], points = [], rects = [], texts = [], areas = [];
        for (var i = 0; i < dataDetails.length; i++) {
            var detail = dataDetails[i];
            if (detail.type === 'line') {
                var _a = getLineChartElements(detail), pointElements = _a.pointElements, lineElement = _a.lineElement, textElements = _a.textElements, areaElement = _a.areaElement;
                lines.push(lineElement);
                if (areaElement) {
                    areas.push(areaElement);
                }
                texts = __spreadArray(__spreadArray([], texts, true), textElements, true);
                points = __spreadArray(__spreadArray([], points, true), pointElements, true);
            }
            else {
                rects = __spreadArray(__spreadArray([], rects, true), getBarChartElements(detail), true);
            }
        }
        var gridLines = getGridLines('y');
        return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], gridLines, true), areas, true), rects, true), lines, true), points, true), texts, true);
    }
    function getLineChartElements(detail) {
        var _a = detail.lineStyle, lineWidth = _a.lineWidth, dash = _a.dash, stroke = _a.stroke;
        var pointElements = [];
        var textElements = [];
        var lineElement = { points: [], type: "Line", lineWidth: lineWidth, dash: dash, stroke: stroke };
        var areaElement = detail.areaColors ? getArea(detail.areaPoints, detail.areaColors) : undefined;
        for (var i = 0; i < detail.points.length; i++) {
            var p = detail.points[i];
            var xOffset = p["".concat(dic.x, "Offset")];
            var yOffset = p["".concat(dic.y, "Offset")];
            lineElement.points.push([xOffset, yOffset]);
            if (p.pointStyle) {
                pointElements.push(__assign({ type: 'Arc', x: xOffset, y: yOffset }, p.pointStyle));
            }
            var text = detail.getPointText ? detail.getPointText(p) : undefined;
            if (text) {
                var style = text.style || {};
                var _b = style.fontSize, fontSize = _b === void 0 ? 12 : _b, _c = style.offset, offset = _c === void 0 ? 12 : _c, _d = style.fill, fill = _d === void 0 ? '#000' : _d, _e = style.rotate, rotate = _e === void 0 ? 0 : _e;
                textElements.push({ type: 'Text', text: text.text, x: xOffset, y: yOffset + offset, fontSize: fontSize, rotate: rotate, fill: fill, align: [0, 1] });
            }
        }
        return { pointElements: pointElements, lineElement: lineElement, textElements: textElements, areaElement: areaElement };
    }
    function getBarChartElements(detail) {
        var _a;
        var rectElements = [];
        for (var i = 0; i < detail.points.length; i++) {
            var p = detail.points[i];
            var step = (p.keyBarSize * detail.barCount) / (detail.barCount * 2);
            var start = p.keyOffset - (p.keyBarSize * detail.barCount / 2);
            var keyOffset = start + (step * detail.barIndex * 2);
            if (p.rangeDetails.length) {
                for (var i_1 = 0; i_1 < p.rangeDetails.length; i_1++) {
                    var _b = p.rangeDetails[i_1], offset = _b.offset, height = _b.height, color = _b.color;
                    rectElements.push(__assign({ type: 'Rectangle', x: keyOffset, y: offset, width: p.keyBarSize, height: height }, __assign(__assign({}, p.pointStyle), { fill: color })));
                }
            }
            else {
                var obj = __assign((_a = { type: 'Rectangle' }, _a[props.reverse ? 'y' : 'x'] = keyOffset, _a[props.reverse ? 'x' : 'y'] = p.valueOffset, _a[props.reverse ? 'height' : 'width'] = p.keyBarSize, _a[props.reverse ? 'width' : 'height'] = p.valueBarSize, _a), p.pointStyle);
                rectElements.push(obj);
            }
        }
        return rectElements;
    }
    (0, react_1.useEffect)(function () {
        (0, jquery_1.default)(window).on('resize', resize);
    }, []);
    function resize() {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            update();
        }, 350);
    }
    function getCornerStyle() { return { width: props["".concat(dic.y, "Axis")].size, height: props["".concat(dic.x, "Axis")].size }; }
    function update() {
        var aio_chart = (0, jquery_1.default)(aio_chart_ref.current);
        var canvasElement = aio_chart.find('canvas');
        var size = { x: canvasElement.width(), y: canvasElement.height() };
        chartSizeRef.current = size;
        var dataDetails = chartClass.getDataDetails(props.datas);
        labelDetailsRef.current = { key: getKeyLabelsDetail(), value: getValueLabelsDetail(size) };
        dataDetailsRef.current = dataDetails;
        var items = getElements(dataDetails);
        setCanvasItems(items);
        setTimeout(function () { return updateLabels(); }, 5);
    }
    function getArea(areaPoints, areaColor) {
        return { type: 'Line', points: areaPoints, fill: [0, 0, 0, -chartSizeRef.current.y, ['0 ' + areaColor[0], '1 ' + areaColor[1]]] };
    }
    function getLabelByCanvasPosition_axis(dir, value) {
        var chartSize = chartSizeRef.current[dir];
        var Axis = props["".concat(dic[dir], "Axis")];
        var d = dic[dir];
        var _a = Axis.padding, padding = _a === void 0 ? dir === 'x' ? [36, 36] : [0, 0] : _a, _b = Axis.getLabel, getLabel = _b === void 0 ? function (v) { return v; } : _b;
        var start = dic[dir] === 'key' ? filter[0] : Axis.start;
        var end = dic[dir] === 'key' ? filter[1] : Axis.end;
        if (value < padding[0]) {
            return labelDetailsRef.current[d][start];
        }
        if (value > chartSize - padding[1]) {
            return labelDetailsRef.current[d][end];
        }
        var step = (chartSize - (padding[0] + padding[1])) / (end - start);
        var index = Math.round((value - padding[0]) / step);
        var text = getLabel(index);
        var offset = d === 'key' ? labelDetailsRef.current[d][index].offset : value;
        return { text: text, offset: offset };
    }
    function getLabelByCanvasPosition(canvasPos) {
        return {
            x: getLabelByCanvasPosition_axis('x', canvasPos[0]),
            y: getLabelByCanvasPosition_axis('y', canvasPos[1])
        };
    }
    (0, react_1.useEffect)(function () { update(); }, []);
    function getContext() {
        return {
            rootProps: props,
            dic: dic,
            changeFilter: changeFilter,
            filter: filter,
            setFilterMouseDownRef: setFilterMouseDownRef,
            getFilterMouseDownRef: getFilterMouseDownRef
        };
    }
    var attrs = (0, aio_utils_1.AddToAttrs)(props.attrs, { className: 'aio-chart', attrs: { ref: aio_chart_ref } });
    function renderCanvas() {
        return canvas.render({
            items: canvasItems,
            //grid: [10, 10, '#eee'], 
            screenPosition: ['50%', '50%'],
            attrs: {
                onMouseMove: function (_a) {
                    var mousePosition = _a.mousePosition;
                    if (chartSizeRef.current === undefined) {
                        return;
                    }
                    var container = (0, jquery_1.default)(aio_chart_ref.current);
                    var x = mousePosition.x, y = mousePosition.y;
                    var _b = getLabelByCanvasPosition([x, y]), xLabel = _b.x, yLabel = _b.y;
                    chartClass.updateTooltip(xLabel, yLabel, container);
                    chartClass.updateCursor(container, xLabel, yLabel, [x, y]);
                },
                onMouseLeave: function () {
                    var container = (0, jquery_1.default)(aio_chart_ref.current);
                    chartClass.removeElements(container);
                }
            }
        });
    }
    return (<ChartCtx.Provider value={getContext()}>
            <div {...attrs}>
                <div className="aio-chart-top">
                    <YLabels labelDetails={labelDetailsRef.current[dic.y]}/>
                    <div className="aio-chart-canvas-container">
                        {renderCanvas()}
                        <CursorLines />
                        <div className="aio-chart-tooltip-container"></div>
                    </div>
                </div>
                <div className="aio-chart-bottom">
                    <div className="aio-chart-corner" style={getCornerStyle()}></div>
                    <XLabels labelDetails={labelDetailsRef.current[dic.x]}/>
                </div>
            </div>
        </ChartCtx.Provider>);
};
exports.Chart = Chart;
var XLabels = function (_a) {
    var labelDetails = _a.labelDetails;
    var _b = (0, react_1.useContext)(ChartCtx), rootProps = _b.rootProps, filter = _b.filter, changeFilter = _b.changeFilter, setFilterMouseDownRef = _b.setFilterMouseDownRef, dic = _b.dic;
    var Axis = rootProps["".concat(dic.x, "Axis")];
    var rotate = Axis.rotate, size = Axis.size, _c = Axis.getLabel, getLabel = _c === void 0 ? function (v) { return v; } : _c, zoom = Axis.zoom;
    function getAxisStyle() {
        var style = { height: size };
        return style;
    }
    function getLabelsStyle() {
        var style = {};
        if (rotate) {
            style.alignItems = 'flex-start';
        }
        return style;
    }
    function getLabelStyle(labelDetail) {
        var style = { left: labelDetail.offset };
        if (rotate) {
            style.transform = "rotate(".concat(rotate, "deg)");
            style.justifyContent = rotate > 0 ? 'flex-start' : 'flex-end';
            style.height = 'fit-content';
        }
        return style;
    }
    return (<div className="aio-chart-axis aio-chart-horizontal-axis" style={getAxisStyle()}>
            <CursorLabel axis='y'/>
            <div className="aio-chart-horizontal-labels" style={getLabelsStyle()}>
                {labelDetails.map(function (o, i) {
            return (<div key={i} className="aio-chart-horizontal-label" style={getLabelStyle(o)}>
                                <div className="aio-chart-horizontal-label-text" data-rotated={rotate ? 'yes' : 'no'}>{o.text}</div>
                            </div>);
        })}
            </div>
            {!!zoom && dic.key === 'x' &&
            <aio_input_1.AISlider multiple={true} size={0} style={{ background: 'none' }} start={Axis.start} end={Axis.end} value={__spreadArray([], filter, true)} onChange={function (v) { return changeFilter(v); }} fill={function () {
                    return {
                        thickness: 16,
                        style: { opacity: 0.2 }
                    };
                }} point={function (index, p) {
                    var value = p.value;
                    var label = getLabel(value);
                    return {
                        html: (<div className="aio-chart-horizontal-filter-value">{label}</div>),
                        attrs: {
                            style: { background: 'red' },
                            onMouseDown: function () { setFilterMouseDownRef(true); },
                            onMouseUp: function () { setFilterMouseDownRef(false); }
                        }
                    };
                }}/>}
        </div>);
};
var YLabels = function (_a) {
    var labelDetails = _a.labelDetails;
    var _b = (0, react_1.useContext)(ChartCtx), rootProps = _b.rootProps, dic = _b.dic;
    var Axis = rootProps["".concat(dic.y, "Axis")];
    var size = Axis.size;
    function getAxisStyle() { return { width: size }; }
    function getLabelsStyle() {
        var style = {};
        return style;
    }
    function getLabelStyle(labelDetail) {
        var style = { bottom: labelDetail.offset };
        return style;
    }
    return (<div className="aio-chart-axis aio-chart-vertical-axis" style={getAxisStyle()}>
            <CursorLabel axis='x'/>
            <div className="aio-chart-vertical-labels" style={getLabelsStyle()}>
                {labelDetails.map(function (o, i) {
            return (<div key={i} className="aio-chart-vertical-label" style={getLabelStyle(o)}>
                                {o.text}
                            </div>);
        })}
            </div>
        </div>);
};
var CursorLabel = function (_a) {
    var axis = _a.axis;
    return (<div className={"aio-chart-cursor-label-container aio-chart-cursor-label-container-".concat(axis)}>
            <div className={"aio-chart-cursor-label aio-chart-cursor-label-".concat(axis)}></div>
        </div>);
};
var CursorLines = function () {
    return (<>
            <div className="aio-chart-cursor-line aio-chart-cursor-line-x"></div>
            <div className="aio-chart-cursor-line aio-chart-cursor-line-y"></div>
        </>);
};
var Pie = function (props) {
    function getRange(r) {
        var value = r.value, _a = r.thickness, thickness = _a === void 0 ? props.thickness || 12 : _a, _b = r.offset, offset = _b === void 0 ? props.offset || 0 : _b, _c = r.roundCap, roundCap = _c === void 0 ? props.roundCap || false : _c, color = r.color;
        return [value, { thickness: thickness, offset: offset, roundCap: roundCap, color: color }];
    }
    function getRanges() {
        var end = props.end, ranges = props.ranges;
        var res = ranges.map(function (o) { return getRange(o); });
        if (props.empty && ranges[ranges.length - 1].value < end) {
            res.push(getRange(__assign(__assign({}, props.empty), { value: end })));
        }
        return res;
    }
    return (<aio_input_1.AISpinner size={props.size} start={props.start} end={props.end} ranges={getRanges()} handle={false} point={false} style={{ border: 'none' }}/>);
};
exports.Pie = Pie;
var ChartData = /** @class */ (function () {
    function ChartData(p) {
        var _this = this;
        this.tooltipDic = {};
        this.getDataDetails = function (datas) {
            var dic = _this.p.dic;
            var dataDetails = [];
            var barCount = datas.filter(function (data) { return data.type === 'bar'; }).length;
            var barIndex = -1;
            _this.tooltipDic = {};
            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                var type = data.type, getPointText = data.getPointText, _a = data.getRanges, getRanges = _a === void 0 ? function () { return undefined; } : _a, areaColors = data.areaColors, _b = data.color, dataColor = _b === void 0 ? '#000' : _b;
                if (type === 'bar') {
                    barIndex++;
                }
                var dataDetail = { points: [], type: type, lineStyle: _this.getDefaultLineStyle(data), getPointText: getPointText, barCount: barCount, barIndex: barIndex, areaPoints: [], areaColors: areaColors };
                var filteredPoints = _this.getFilteredPoints(data);
                for (var j = 0; j < filteredPoints.length; j++) {
                    var fp = filteredPoints[j];
                    var _c = _this.getPointDetail({ d: 'key', data: data, value: fp.key }), keyPercent = _c.percent, keyOffset = _c.offset, keyText = _c.text, keyBarSize = _c.barSize;
                    var _d = _this.getPointDetail({ d: 'value', data: data, value: fp.value }), valuePercent = _d.percent, valueOffset = _d.offset, valueText = _d.text, valueBarSize = _d.barSize;
                    var pointDetail = {
                        key: fp.key, value: fp.value,
                        keyPercent: keyPercent,
                        valuePercent: valuePercent,
                        keyOffset: keyOffset,
                        valueOffset: valueOffset,
                        keyText: keyText,
                        valueText: valueText,
                        keyBarSize: keyBarSize,
                        valueBarSize: valueBarSize,
                        pointStyle: _this.getDefaultPointStyle(data, fp.point),
                        rangeDetails: _this.getRanges(data, getRanges, fp.point),
                    };
                    _this.addPosition(pointDetail, dataColor);
                    if (areaColors) {
                        dataDetail.areaPoints.push([pointDetail["".concat(dic.x, "Offset")], pointDetail["".concat(dic.y, "Offset")]]);
                    }
                    dataDetail.points.push(pointDetail);
                }
                if (areaColors) {
                    dataDetail.areaPoints = __spreadArray(__spreadArray([[dataDetail.areaPoints[0][0], 0]], dataDetail.areaPoints, true), [[dataDetail.areaPoints[dataDetail.areaPoints.length - 1][0], 0]], false);
                }
                dataDetails.push(dataDetail);
            }
            console.log(_this.tooltipDic);
            return dataDetails;
        };
        this.addPosition = function (pointDetail, color) {
            var x = pointDetail.keyOffset, y = pointDetail.valueOffset, text = pointDetail.valueText;
            var key = x.toString();
            _this.tooltipDic[key] = _this.tooltipDic[key] || { ys: [], labels: [] };
            _this.tooltipDic[key].ys.push(y);
            _this.tooltipDic[key].labels.push({ color: color, text: text });
        };
        this.getTooltip = function (x, y) {
            var det = _this.tooltipDic[x.toString()];
            if (!det) {
                return { tooltipY: 0, tooltipPoints: [] };
            }
            var res = { tooltipY: 0, tooltipPoints: det.labels }, min = Infinity;
            for (var i = 0; i < det.ys.length; i++) {
                if (Math.abs(det.ys[i] - y) < min) {
                    res.tooltipY = det.ys[i];
                    min = det.ys[i];
                }
            }
            return res;
        };
        this.updateTooltip = function (xLabel, yLabel, container) {
            var _a = _this.getTooltip(xLabel.offset, yLabel.offset), tooltipY = _a.tooltipY, tooltipPoints = _a.tooltipPoints;
            var html = ("\n                <div class=\"aio-chart-tooltip\">\n                    <div class=\"aio-chart-tooltip-title\">".concat(xLabel.text, "</div>\n                    ").concat(tooltipPoints.map(function (_a) {
                var text = _a.text, color = _a.color;
                return ("\n                        <div class='aio-chart-tooltip-item'>\n                            <div style=\"width:10px;height:10px;background:".concat(color, "\"></div>\n                            <div>").concat(text, "</div>\n                        </div>\n                    "));
            }), "\n                    <div class=\"aio-chart-tooltip-arrow\"></div>\n                </div>\n            "));
            var tooltipElement = container.find('.aio-chart-tooltip-container');
            tooltipElement.css({ left: xLabel.offset, bottom: tooltipY, display: 'flex' });
            tooltipElement.html(html);
        };
        this.updateCursor = function (container, xLabel, yLabel, canvasPos) {
            container.find('.aio-chart-cursor-label-y').html(xLabel.text);
            container.find('.aio-chart-cursor-label-x').html(yLabel.text);
            container.find('.aio-chart-cursor-label-container-y').css({ left: canvasPos[0], display: 'flex' });
            container.find('.aio-chart-cursor-label-container-x').css({ bottom: canvasPos[1], display: 'flex' });
            container.find('.aio-chart-cursor-line-x').css({ bottom: canvasPos[1], display: 'block' });
            container.find('.aio-chart-cursor-line-y').css({ left: canvasPos[0], display: 'block' });
        };
        this.removeElements = function (container) {
            container.find('.aio-chart-cursor-line').css({ display: 'none' });
            container.find('.aio-chart-cursor-label-container').css({ display: 'none' });
            container.find('.aio-chart-tooltip-container').css({ display: 'none' });
        };
        this.getRanges = function (data, getRanges, point) {
            var ranges = getRanges(point);
            if (!ranges) {
                return [];
            }
            var res = [];
            if (ranges) {
                var lastValue = 0;
                for (var k = 0; k < ranges.length; k++) {
                    var _a = ranges[k], value = _a[0], color = _a[1];
                    var startOffset = _this.getPointDetail({ d: 'value', value: lastValue }).offset;
                    var endOffset = _this.getPointDetail({ d: 'value', value: value }).offset;
                    res.push({ offset: startOffset, height: endOffset - startOffset, color: color });
                    lastValue = value;
                }
            }
            return res;
        };
        this.getDefaultLineStyle = function (data) {
            var _a = data.getLineStyle, getLineStyle = _a === void 0 ? (function () { return ({}); }) : _a;
            var lineStyle = getLineStyle() || {};
            var _b = lineStyle.lineWidth, lineWidth = _b === void 0 ? 1 : _b, dash = lineStyle.dash, _c = lineStyle.stroke, stroke = _c === void 0 ? '#333' : _c;
            return { lineWidth: lineWidth, dash: dash, stroke: stroke };
        };
        this.getDefaultPointStyle = function (data, point) {
            var getPointStyle = data.getPointStyle;
            if (!getPointStyle) {
                return;
            }
            var pointStyle = getPointStyle(point) || {};
            var _a = pointStyle.lineWidth, lineWidth = _a === void 0 ? 1 : _a, _b = pointStyle.r, r = _b === void 0 ? 4 : _b, dash = pointStyle.dash, _c = pointStyle.stroke, stroke = _c === void 0 ? data.type === 'line' ? '#333' : undefined : _c, _d = pointStyle.fill, fill = _d === void 0 ? data.type === 'line' ? '#fff' : '#333' : _d;
            return { lineWidth: lineWidth, r: r, dash: dash, stroke: stroke, fill: fill };
        };
        this.getFilteredPoints = function (data) {
            var points = data.points;
            var filter = _this.p.getFilter();
            var newPoints = [];
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                var key = data.getKey(point), value = data.getValue(point);
                if (key < filter[0]) {
                    continue;
                }
                if (key > filter[1]) {
                    continue;
                }
                newPoints.push({ key: key, value: value, point: point });
            }
            return newPoints;
        };
        this.getPointDetail = function (p) {
            var filter = _this.p.getFilter();
            var props = _this.p.getProps();
            var Axis = props["".concat(p.d, "Axis")];
            var dir = _this.p.dic[p.d];
            var _a = Axis.padding, padding = _a === void 0 ? p.d === 'key' ? [36, 36] : [0, 0] : _a;
            var f = p.d === 'key' ? filter : [Axis.start, Axis.end];
            var start = f[0], end = f[1];
            var percent = (0, aio_utils_1.GetPercentByValue)(start, end, p.value);
            var avilSize = _this.p.getChartSize()[dir] - (padding[0] + padding[1]);
            var offset = padding[0] + avilSize * percent / 100;
            var barSize = 0;
            if (p.d === 'key') {
                barSize = p.data && p.data.type === 'bar' ? _this.getBarWidth(p.data) : 0;
            }
            else {
                barSize = -offset;
            }
            return { percent: percent, offset: offset, text: Axis.getLabel(p.value), barSize: barSize };
        };
        this.getBarWidth = function (data) {
            var dir = _this.p.dic.key;
            var props = _this.p.getProps();
            var datas = _this.p.getProps().datas;
            var Axis = props.keyAxis;
            var _a = Axis.padding, padding = _a === void 0 ? [36, 36] : _a;
            var barCount = datas.filter(function (data) { return data.type === 'bar'; }).length;
            var pointsLength = data.points.length;
            var avilableWidth = _this.p.getChartSize()[dir] - (padding[0] + padding[1]);
            var gap = avilableWidth / pointsLength / 2;
            avilableWidth -= (pointsLength - 1) * gap;
            return avilableWidth / pointsLength / barCount;
        };
        this.p = p;
    }
    return ChartData;
}());
