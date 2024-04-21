import React, { Component, createRef, createContext, useState, useEffect, useContext } from 'react';
import AIOInput from './../../npm/aio-input/index.tsx';
import AIOCanvas from './../aio-canvas/index.tsx';
import { EventHandler } from '../aio-utils/index.tsx';
import $ from 'jquery';
import './index.css';
type I_chart_filter = { start?: number, end?: number, labelSpace?: number, count?: number, filter?: { start: any, end: any, p1: any, p2: any } }
type I_chart_temp = {
    Canvas: AIOCanvas,
    elements: { points: any[], rects: any[], all: any[] },
    moved: boolean,
    mouseDownDetail: {
        target?: 'point' | 'filter',
        key?: any,
        value?: any
    },
    keyDictionary: { [key: string]: any }[],
    dom: any,
    touch: boolean,
    details: {
        min?: number,
        max?: number,
        axisToD?: { x: 'key' | 'value', y: 'key' | 'value' },
        dToAxis?: { key: 'x' | 'y', value: 'x' | 'y' }
        range?: { x: I_chart_filter, y: I_chart_filter },
        keysDictionary?: { [key: string]: number },
        barCount?: number,
        barWidth?: number,
        xZoom?: boolean,
        yZoom?: boolean,
        labelSpace?: number
    },
    mouseDetail: I_chart_mouseDetail,
    transition: number
}
type I_axis = 'x' | 'y'
type I_chart_data = {
    points: any[],
    title: string,
    type: 'line' | 'bar',
    color?: 'string',
    editable?: boolean
}
type I_chart_line = { dash?: [number, number], lineWidth?: number, color?: string, key?: [any, any], value: [any, any] }
type I_chart_mouseDetail = {
    x?: any, y?: any, key?: any, value?: any, addDataIndexes?: number[], target?: 'point', px?: number, py?: number, cx?: number, cy?: number, nearestPoint?: any,
    label?: { key: string, value: string, x?: any, y?: any },dataIndex?:number,
    keyIndex?: number,pointIndex?:number
}
type I_chart_axis = {
    size?: number, edit?: (o: string) => string, zoom?: boolean, gridColor?: string, title?: string,
}
type I_chart_parameter = { point: any, key: any, value: any, dataIndex: number, pointIndex: number, drag?: boolean }
type I_Chart = {
    filter?: {
        key?: number[],
        value?: number[]
    },
    data: I_chart_data[],
    keys: any[],
    translate?: (v: string) => string,
    labelSize?: number,
    precision?: number,
    keyAxis?: I_chart_axis,
    valueAxis?: I_chart_axis,
    hideInterfere?: boolean,
    clickRadius?: number,
    reverse?: boolean,
    lines?: I_chart_line[],
    barWidth?: number,
    addPopup?: boolean,
    attrs?: any,
    onAdd?: (md: I_chart_mouseDetail) => void,
    onChange?: (p: I_chart_parameter) => void,
    onRemove?: (p: I_chart_parameter) => void,
    multiselect?: (points: any[]) => void,
    zoomColor?: string,
    html?: (elements: any, p: any) => React.ReactNode,
    rtl?: boolean
}
type I_chart_popup = {
    disabled?: boolean,
    dataIndex: number,
    pointIndex?: number,
    dataIndexes: number[],
    dynamicValue: number,
    staticValue: any,
    onEdit?: (p: I_chart_parameter) => void,
    onRemove?: (p:I_chart_parameter) => void,
    title: string,
    onAdd?: (md: I_chart_mouseDetail) => void,

}
var RChartContext = createContext({} as any);
export default function RChart(props: I_Chart) {
    let {
        keys, translate = (v) => v, labelSize = 30, keyAxis = {}, valueAxis = {}, precision = 0, hideInterfere, clickRadius = 12, reverse, lines = [], barWidth = 80,
        onChange, onRemove, onAdd, addPopup, attrs = {}, multiselect, zoomColor = '#ddd', html = () => '', rtl
    } = props;
    let [temp] = useState<I_chart_temp>({
        Canvas: new AIOCanvas(),
        elements: { points: [], rects: [], all: [] },
        mouseDownDetail: {},
        dom: createRef(),
        details: { min: Infinity, max: -Infinity },
        touch: 'ontouchstart' in document.documentElement,
        moved: false,
        mouseDetail: {},
        transition: 0,
        keyDictionary: []
    })
    let [filter, setFilter] = useState<{
        key?: number[],
        value?: number[]
    }>(props.filter || { key: [], value: [] })
    let [popup, setPopup] = useState<I_chart_popup | false>(false)
    let [dataHide, setDataHide] = useState<{ [key: string]: boolean }>({})
    let [data, setData] = useState<I_chart_data[]>(props.data || [])
    function getCanvasSize(axis: I_axis): number {
        return temp.Canvas[axis === 'x' ? 'width' : 'height']
    }
    useEffect(() => {
        $('body').on('mouseout', '.r-chart-canvas', () => {
            $('.r-chart-popup-container').html('');
            $('.r-chart-line').css({ display: 'none' })
        })
        if (temp.touch) {
            EventHandler('window', 'mouseup', () => {
                $('.r-chart-popup-container').html('')
                $('.r-chart-line').css({ display: 'none' })
            })
        }
    }, [])
    function getGap(length) { return Math.max(0.5, Math.round(length / 10)) }

    function normal_getArea(points, color, areaColor) {
        let area;
        area = { type: 'Line', points: points.slice(), fill: [0, 0, 0, -getCanvasSize(temp.details.dToAxis.value), ['0 ' + areaColor, '1 ' + color]] };
        area.points.splice(0, 0, [points[0][0], 0]);
        area.points.push([points[points.length - 1][0], 0]);
        return area;
    }
    function reverse_getArea(points, color, areaColor) {
        let area = { type: 'Line', points: points.slice(), fill: [0, 0, getCanvasSize(temp.details.dToAxis.value), 0, ['0 ' + 'rgba(255,255,255,0)', '1 ' + color]] };
        area.points.splice(0, 0, [0, points[0][1]]);
        area.points.push([0, points[points.length - 1][1]]);
        return area;
    }
    function getArea(points, color, areaColor = 'rgba(255,255,255,0)') {
        return reverse ? reverse_getArea(points, color, areaColor) : normal_getArea(points, color, areaColor)
    }
    function value_getPercentByValue(axis, point:any = {}) {
        var { start, end } = temp.details.range[axis];
        return 100 * (point._value - start) / (end - start)
    }
    function key_getPercentByValue(axis, point:any = {}) {
        let { start, end } = temp.details.range[axis];
        return 100 * (point._keyIndex - start) / (end - start)
    }
    function getPercentByValue(axis, point) {
        return temp.details.axisToD[axis] === 'key' ? key_getPercentByValue(axis, point) : value_getPercentByValue(axis, point)
    }
    function changeFilter(axis, p1, p2) {
        return temp.details.axisToD[axis] === 'key' ? key_changeFilter(p1, p2) : value_changeFilter(p1, p2);
    }

    function value_changeFilter(p1, p2) {
        setFilter({ ...filter, value: [p1, p2] });
    }
    function key_changeFilter(p1, p2) {
        filter.key = [keys[p1], keys[p2]];
        setFilter({ ...filter, key: [keys[p1], keys[p2]] });
    }
    function getLimitTypeNumber(data) {
        var min = Infinity, max = -Infinity;
        for (var i = 0; i < data.length; i++) {
            var { points = [], getValue = (o) => o.y } = data[i];
            for (var j = 0; j < points.length; j++) {
                let point = points[j];
                let value = getValue(point);
                if (value < min) { min = value; }
                if (value > max) { max = value; }
            }
        }
        return { min, max };
    }
    function getAxisSize() {
        let { size: x = 40 } = keyAxis;
        let { size: y = 50 } = valueAxis;
        return [x, y]
    }
    //تمامی اطلاعات لازم روی هر نقطه درج میشود با یک لوپ
    //مشخص می شود هر کلید دارای چه نقاطی است برای تشخیص قابل اد بودن
    function getValueByField(point, field) {
        try {
            let type = typeof field;
            if (type === 'function') { return field(point); }
            if (type === 'string') {
                if (field.indexOf('.') !== -1 && (field.indexOf('point') !== -1 || field.indexOf('props') !== -1)) {
                    let result;
                    eval('result = ' + field);
                    return result;
                }
                return field;
            }
            return field;
        }
        catch { return; }
    }
    function setPointDetails(data, dataIndex, point, pointIndex) {
        let { edit: keyEdit = (a) => a } = keyAxis as I_chart_axis;
        let { edit: valueEdit = (a) => a } = valueAxis as I_chart_axis;
        let { getKey = (o) => o.x, getValue = (o) => o.y } = data;
        point._key = getKey(point);
        point._value = getValue(point);
        if (isNaN(point._value)) { return false }
        if (typeof point._key !== 'string') { return false }
        point._keyIndex = temp.details.keysDictionary[point._key];
        if (point._keyIndex === undefined) { return false; }
        point._px = getPercentByValue('x', point);
        point._py = getPercentByValue('y', point);
        point._dataIndex = dataIndex;
        point._pointIndex = pointIndex;
        point._label = {
            key: keyEdit(point._key),
            value: valueEdit(point._value.toFixed(precision))
        };
        temp.keyDictionary[dataIndex][point._key] = { ...point };

    }
    function getText(data, point) {
        let { pointText, pointTextStyle } = data;
        let text = getValueByField(point, pointText)
        if (text) {
            let textStyle = getValueByField(point, pointTextStyle) || {}
            let { fontSize = 16, color = '#444', left = 0, top = 0, rotate, align } = textStyle;
            return {
                type: 'Group', x: point._px + '%', y: point._py + '%', rotate,
                items: [{ type: 'Text', text, fontSize, fill: color, x: left, y: top, align }]
            }
        }
        return false
    }
    function getPoint(data, dataIndex, point, pointIndex) {
        let { color = '#000', lineWidth = 1, pointRadius, pointStroke, pointFill, pointStrokeWidth, pointDash, lineDash, pointSlice } = data;
        let radius = getValueByField(point, pointRadius);
        if (!radius) { return false; }
        let stroke = getValueByField(point, pointStroke) || color;
        let fill = getValueByField(point, pointFill) || '#fff';
        let strokeWidth = getValueByField(point, pointStrokeWidth) || lineWidth;
        let dash = getValueByField(point, pointDash);
        let slice = getValueByField(point, pointSlice);
        let space = -Infinity;
        if (hideInterfere) {
            let center = getCanvasSize('x') * point._px / 100;
            let left = center - radius - strokeWidth / 2;
            if (left > space) { space = center + radius + strokeWidth / 2; }
            else { return false; }
        }
        return {
            type: 'Group', x: point._px + '%', y: point._py + '%', dataIndex, pointIndex,
            items: [
                { type: 'Arc', r: clickRadius, fill: 'rgba(0,0,0,0)', onMouseDown: pointMouseDown, dataIndex, pointIndex },
                { type: 'Arc', r: radius, lineWidth: strokeWidth * 2, fill, stroke, dash, slice }
            ]
        };
    }
    function getGridLines(axis) {
        let Axis = (temp.details.axisToD[axis] === 'key' ? keyAxis : valueAxis) as I_chart_axis;
        var color = Axis.gridColor;
        if (!color) { return [] }
        var range = temp.details.range[axis];
        if (!range) { return [] }
        var { start, step, end } = range;
        var value = Math.round((start - step) / step) * step, gridLines = [];
        var d = temp.details.axisToD[axis];
        if (d === 'key') {
            while (value <= end) {
                if (value >= start) {
                    if (keys[value]) { gridLines.push(getLine({ color, key: keys[value] })) }
                }
                value += step;
            }
        }
        else {
            while (value <= end) {
                if (value >= start) { gridLines.push(getLine({ color, value })) }
                value += step;
            }
        }
        return gridLines;
    }
    function getLine(line: { dash?: number[], lineWidth?: number, color?: string, key?: any, value?: any }) {
        let { dash, lineWidth, color = 'red', key = [false, false], value = [false, false] } = line;
        let axisKey = temp.details.dToAxis.key;
        let axisValue = temp.details.dToAxis.value;
        if (!Array.isArray(key)) { key = [key, key] }
        if (!Array.isArray(value)) { value = [value, value] }
        let [startKey, endKey] = key;
        let [startValue, endValue] = value;
        let sk = startKey === false ? 0 : getPercentByValue(axisKey, { _keyIndex: temp.details.keysDictionary[startKey] });
        let ek = endKey === false ? 100 : getPercentByValue(axisKey, { _keyIndex: temp.details.keysDictionary[endKey] });
        let sv = startValue === false ? 0 : getPercentByValue(axisValue, { _value: startValue });
        let ev = endValue === false ? 100 : getPercentByValue(axisValue, { _value: endValue });
        let points = axisKey === 'x' ?
            [[sk + '%', sv + '%'], [ek + '%', ev + '%']] :
            [[sv + '%', sk + '%'], [ev + '%', ek + '%']];
        return { stroke: color, lineWidth, points, type: 'Line', dash }
    }
    function getElements() {
        temp.keyDictionary = data.map(() => { return {} });
        let xGridLines = getGridLines('x');
        let yGridLines = getGridLines('y');
        let indicators = lines.map((o) => getLine(o));
        let Elements = {
            all: [...xGridLines, ...yGridLines, ...indicators],
            xGridLines, yGridLines, indicators, areas: [], rects: [], lines: [], points: [], texts: []
        }
        let barCounter = 0;
        for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
            let { points, title, type = 'line' } = data[dataIndex];
            if (title && dataHide[title]) { continue; }
            if (!points || !Array.isArray(points) || points.length === 0) { continue; }
            if (type === 'line') {
                let res = getLineChart(data[dataIndex], dataIndex);
                for (let prop in res) {
                    Elements[prop] = [...Elements[prop], ...res[prop]]
                    Elements.all = [...Elements.all, ...res[prop]]
                }
            }
            else if (type === 'bar') {
                let res = getBarChart(data[dataIndex], dataIndex, barCounter);
                for (let prop in res) {
                    Elements[prop] = [...Elements[prop], ...res[prop]]
                    Elements.all = [...Elements.all, ...res[prop]]
                }
                barCounter++;
            }
        }
        this.lastData = data;
        temp.elements = Elements;
    }
    function getLineChart(data, dataIndex) {
        let lines = [], areas = [], points = [], texts = [];
        let { color = '#000', lineWidth = 1, lineDash, areaColor } = data;
        let Line = { type: 'Line', points: [], lineWidth, stroke: color, dash: lineDash };
        for (let pointIndex = 0; pointIndex < data.points.length; pointIndex++) {
            let point = data.points[pointIndex];
            if (setPointDetails(data, dataIndex, point, pointIndex) === false) { continue }
            let textResult = getText(data, point);
            if (textResult) { texts.push(textResult) }
            Line.points.push([point._px + '%', point._py + '%']);
            let pointElement = getPoint(data, dataIndex, point, pointIndex)
            if (pointElement) { points.push(pointElement) }
        }
        if (lineWidth) { lines.push(Line) }
        if (areaColor && Line.points.length) { areas.push(getArea(Line.points, color, areaColor)) }
        return { lines, areas, points, texts }
    }
    function getBarChart(data, dataIndex, barCounter) {
        let texts = [], rects = [];
        for (var pointIndex = 0; pointIndex < data.points.length; pointIndex++) {
            let point = data.points[pointIndex];
            if (setPointDetails(data, dataIndex, point, pointIndex) === false) { continue }
            let textResult = getText(data, point);
            if (textResult) { texts.push(textResult) }

            let { color } = data;
            let { barCount, barWidth } = temp.details;
            let rect: {
                type: 'Rectangle', dataIndex: number, pointIndex: number, onMouseDown?: any, fill: string, width?: any, height?: any, x?: any, y?: any, pivot?: any
            } = { type: 'Rectangle', dataIndex, pointIndex, onMouseDown: pointMouseDown, fill: color };
            let pivot = barWidth * (barCount / 2 - barCounter) + '%';
            if (!reverse) { rect = { ...rect, width: barWidth + '%', height: point._py + '%', x: point._px + '%', pivot: [pivot, 0] }; }
            else { rect = { ...rect, width: point._px + '%', height: barWidth + '%', y: point._py + '%', pivot: [0, pivot] }; }
            rects.push(rect)
        }
        return { texts, rects }
    }
    function getDetails() {
        let d = temp.details;
        if (!d.axisToD) {
            if (!reverse) {
                d.axisToD = { x: 'key', y: 'value' }; d.dToAxis = { key: 'x', value: 'y' };
                d.xZoom = !!keyAxis.zoom;
                d.yZoom = !!valueAxis.zoom;
            }
            else {
                d.axisToD = { x: 'value', y: 'key' }; d.dToAxis = { key: 'y', value: 'x' };
                d.yZoom = !!keyAxis.zoom;
                d.xZoom = !!valueAxis.zoom;
            }
        } //نوع چارت و تابع گرفتن درصد با مقدار یکبار تایین می شود
        if (temp.mouseDownDetail.target !== 'point') {
            if (temp.mouseDownDetail.target !== 'filter') {
                var limit = this.getLimitTypeNumber(data);
                temp.details.min = limit.min;
                temp.details.max = limit.max;
                d.keysDictionary = {};
                for (let i = 0; i < keys.length; i++) {
                    d.keysDictionary[keys[i]] = i;
                }
            }
            temp.details.range = { x: getRange('x'), y: getRange('y') };
            temp.details.labelSpace = temp.details.range[d.dToAxis.key].labelSpace;
        }
        d.barCount = data.filter((d) => d.type === 'bar').length;
        d.barWidth = barWidth / d.range[d.dToAxis['key']].count / d.barCount;
    }
    function value_getRange(axis: I_axis) {
        var { min, max, axisToD } = temp.details;
        let Filter = filter[axisToD[axis]];
        var size = getCanvasSize(axis);
        if (min === undefined || max === undefined) { return {}; }
        var range = max - min, i = 1;
        var start, step, end;
        if (range === 0) {
            if (min < 0) { start = 2 * min; step = Math.abs(min); end = 0; }
            else if (min > 0) { start = 0; step = min; end = 2 * min; }
            else { start = -1; step = 1; end = 1; }
        }
        else {
            while (range / 10 > 1) { i *= 10; range /= 10; }
            if (range >= 0 && range <= 3) { step = 0.2 * i; }
            else { step = i; }
            start = Math.round(min / step) * step - step;
            end = Math.round(max / step) * step + step;
        }
        var count = (end - start) / step;
        var maxCount = size ? Math.ceil(size / 60) : 10;
        while (count > maxCount) { step *= 2; count = (end - start) / step; }
        var [fs = start, fe = end] = Filter;
        if (fs < start) { fs = start; }
        if (fe > end) { fe = end; }
        var filteredRange = { start, end, step, p1: fs, p2: fe }
        return { start: fs, step, end: fe, filter: filteredRange };
    }
    function key_getRange(axis: I_axis) {
        let { axisToD } = temp.details;
        let Filter = filter[axisToD[axis]];
        let LabelSize;
        if (axis === 'x') { LabelSize = labelSize; }
        else { LabelSize = 30; }
        let canvasSize = getCanvasSize(axis)
        let fs = Filter[0] ? keys.indexOf(Filter[0]) : 0;
        let fe = Filter[1] ? keys.indexOf(Filter[1]) : keys.length - 1;
        if (fs === -1) { fs = 0; }
        if (fe === -1) { fe = keys.length - 1; }
        let filteredRange = { start: 0, end: keys.length - 1, p1: fs, p2: fe };
        let count = fe - fs + 1;
        let gap = getGap(count);
        let labelSpace = canvasSize / count;
        let approveCount = Math.floor(canvasSize / LabelSize);
        approveCount = approveCount < 1 ? 1 : approveCount;
        let labelStep = Math.floor(count / approveCount);
        labelStep = labelStep < 1 ? 1 : labelStep;
        return {
            start: fs - gap, step: labelStep, end: fe + gap, count, filter: filteredRange, labelSpace
        };
    }
    function getRange(axis) {
        return temp.details.axisToD[axis] === 'key' ? key_getRange(axis) : value_getRange(axis);
    }
    function pointMouseDown(e, pos, obj) {
        var { dataIndex, pointIndex } = obj;
        let { data } = this.state;
        if (!onChange || data[dataIndex].editable === false) { return; }
        this.getMouseDetail(pos);
        var point = data[dataIndex].points[pointIndex];
        temp.mouseDownDetail = { target: 'point', key: point._key, value: point._value };
        if (onChange && data[dataIndex].draggable !== false) {
            EventHandler('window', 'mousemove', pointMouseMove)
        }
        if (onChange || onRemove) {
            EventHandler('window', 'mouseup', pointMouseUp)
        }
        this.so = { dataIndex, pointIndex, x: temp.mouseDetail.x, y: temp.mouseDetail.y };
        temp.moved = false;
    }
    function pointMouseMove() {
        let point = data[this.so.dataIndex].points[this.so.pointIndex];
        var { dToAxis } = temp.details;
        if (!temp.moved) {
            if (Math.abs(temp.mouseDetail[dToAxis.value] - this.so[dToAxis.value]) < 8) { return; }
            if (point._value === temp.mouseDetail.value) { return; }
        }
        temp.moved = true;
        onChange({ point, key: point._key, value: temp.mouseDetail.value, dataIndex: this.so.dataIndex, pointIndex: this.so.pointIndex, drag: true });
    }
    function pointMouseUp() {
        EventHandler('window', 'mousemove', pointMouseMove, 'unbind')
        EventHandler('window', 'mouseup', pointMouseUp, 'unbind');
        temp.mouseDownDetail = {};
        var { onRemove } = this.props;
        var point = data[this.so.dataIndex].points[this.so.pointIndex];
        if (!temp.moved) {
            var title = !onChange ? translate('Remove Point') : translate('Edit Point');
            setPopup({
                disabled: onRemove && !onChange,
                dataIndex: this.so.dataIndex, pointIndex: this.so.pointIndex,
                dataIndexes: [this.so.dataIndex],
                dynamicValue: point._value, staticValue: temp.mouseDetail.key,
                onEdit: onChange, onRemove, title
            })
            return;
        }
        var obj = { point, key: point._key, value: temp.mouseDetail.value, dataIndex: this.so.dataIndex, pointIndex: this.so.pointIndex, drag: false };
        if (onChange) { onChange(obj) }
    }
    //کلیک روی بک گراند چارت
    function mouseDown(e, pos) {
        if ('ontouchstart' in document.documentElement) {
            this.eventHandler('window', 'mouseup', $.proxy(this.addMouseUp, this));
            this.getMouseDetail(pos);
            return;
        }
        this.mouseDownKey = temp.mouseDetail.key;
        // اگر مد افزودن فعال بود و در موقعیت فعلی موس دیتا یا دیتا هایی آمادگی دریافت نقطه جدید در این موقعیت را داشتند
        if (onAdd && temp.mouseDetail.addDataIndexes.length) {
            this.eventHandler('window', 'mouseup', $.proxy(this.addMouseUp, this));
        }
        if (multiselect && temp.mouseDetail.target !== 'point') {
            this.multiselect = {};
            this.multiselect.selectRect = $(temp.dom.current).find('.r-chart-multiselect');
            if (reverse) {
                this.multiselect.selectRect.css({ display: 'block', top: temp.mouseDetail.py + '%', height: '0%', width: '100%', left: 0 })
                this.multiselect.position = temp.mouseDetail.py;
            }
            else {
                this.multiselect.selectRect.css({ display: 'block', left: temp.mouseDetail.px + '%', width: '0%', height: '100%', top: 0 })
                this.multiselect.position = temp.mouseDetail.px;
            }
            this.eventHandler('window', 'mousemove', $.proxy(this.multiselectMove, this));
            this.eventHandler('window', 'mouseup', $.proxy(this.multiselectUp, this));

        }
    }
    function addMouseUp() {
        this.eventHandler('window', 'mouseup', this.addMouseUp, 'unbind');
        if (temp.touch) {
            if (temp.mouseDetail.addDataIndexes.length === 0) {
                return;
            }
        }
        else { if (temp.mouseDetail.key !== this.mouseDownKey) { return; } }
        if (addPopup === false) { onAdd(temp.mouseDetail) }
        else {
            setPopup({
                dataIndexes: temp.mouseDetail.addDataIndexes,
                dataIndex: temp.mouseDetail.addDataIndexes[0],
                dynamicValue: temp.mouseDetail.value,
                staticValue: temp.mouseDetail.key,
                onAdd, title: translate('Add Point'),
            })
        }
    }
    function multiselectMove() {
        var { reverse } = this.props;
        var m = this.multiselect;
        if (temp.mouseDetail.key === this.mouseDownKey) { return; }
        if (!reverse) {
            var mp = temp.mouseDetail.px;
            if (mp < m.position) { m.end = m.position; m.start = mp; }
            else { m.start = m.position; m.end = mp; }
            m.selectRect.css({ width: (m.end - m.start) + '%', left: m.start + '%' })
        }
        else {
            var mp = temp.mouseDetail.py;
            if (mp < m.position) { m.end = m.position; m.start = mp; }
            else { m.start = m.position; m.end = mp; }
            var obj = { height: (m.end - m.start) + '%', top: (m.start + 100) + '%' };
            m.selectRect.css(obj)
        }

    }
    function hideSelectRect() {
        if (!this.multiselect || !this.multiselect.selectRect) { return; }
        this.multiselect.selectRect.css({ display: 'none' });
    }
    function multiselectUp() {
        this.eventHandler('window', 'mousemove', multiselectMove, 'unbind');
        this.eventHandler('window', 'mouseup', multiselectUp, 'unbind');
        if (!this.multiselect.start || !this.multiselect.end ||
            Math.abs(this.multiselect.start - this.multiselect.end) < 3) { hideSelectRect(); return; }
        var points = getPointsBySelectRect();
        if (points.length !== 0) { multiselect(points); }
        hideSelectRect();
    }
    function getPointsBySelectRect() {
        let { start, end } = this.multiselect;
        var result = [];
        for (let i = 0; i < temp.elements.points.length; i++) {
            let point = temp.elements.points[i];
            let { dataIndex, pointIndex } = point;
            if (data[dataIndex].editable === false) { continue; }
            let percent = parseFloat(point[temp.details.dToAxis['key']]);
            if (percent < start || percent > end) { continue; }
            result.push([dataIndex, pointIndex]);
        }
        for (let i = 0; i < temp.elements.rects.length; i++) {
            let point = temp.elements.rects[i];
            let { dataIndex, pointIndex } = point;
            if (data[dataIndex].editable === false) { continue; }
            let percent = parseFloat(point[temp.details.dToAxis['key']]);
            if (percent < start || percent > end) { continue; }
            result.push([dataIndex, pointIndex]);
        }
        return result;
    }
    function changePopup(obj) {
        setPopup({ ...popup, ...obj });
    }
    function getHeader() {
        let [x, y] = getAxisSize();
        return (
            <div className='r-chart-title' style={{ paddingLeft: y + 'px' }}>
                {data.filter((d) => d.title !== undefined).map((d, i) => {
                    let { color, title } = d;
                    let style = !dataHide[d.title] ? { background: color } : { boxShadow: `inset 0 0 0 2px ${color}` };
                    return (
                        <div key={i} className='r-chart-title-item' onClick={() => setDataHide({ ...dataHide, [title]: !(dataHide[title] || false) })}>
                            <div className='r-chart-title-color' style={style}></div>
                            <div className='r-chart-title-text'>{d.title || 'untitle'}</div>
                        </div>
                    )
                })}
            </div>
        )
    }
    function getLabelSlider(axis) {
        var { range, xZoom, yZoom, axisToD } = temp.details;
        if (!range || !range[axis]) { return null; }
        var { start, end, step, labelSpace } = temp.details.range[axis];
        var dAxis = axisToD[axis];
        let Axis = dAxis === 'key' ? keyAxis : valueAxis;
        let { edit = (a) => a } = Axis;
        if (dAxis === 'key') {
            temp.transition = Math.min(labelSpace / 100, 0.3);
        }
        var labelStyle = { x: { top: xZoom ? '24px' : '14px' }, y: { left: 'unset', right: yZoom ? '16px' : '8px', justifyContent: 'flex-end' } };
        var { labelRotate } = this.props;
        var d = axisToD[axis];
        return (
            <AIOInput type='slider'
                point={() => { return { labelShow: false, attrs: { style: { display: 'none' } } } }}
                className='labelSlider'
                style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', padding: 0 }}
                grooveAttrs={{ style: { display: 'none' } }}
                direction={axis === 'x' ? 'right' : 'top'} start={start} end={end}
                label={{
                    step,
                    attrs: () => { return { style: { fontSize: 'inherit', ...labelStyle[axis] } } },
                    rotate: axis === 'y' ? 0 : labelRotate,
                    html: (value) => edit(d === 'key' ? keys[value] || '' : value)
                }}
                line={(index, active) => { return { attrs: { style: { opacity: 0 } } } }}
            />
        )
    }
    function filterMouseDown(e) {
        e.preventDefault();
        temp.mouseDownDetail.target = 'filter';
        let container = $(temp.dom.current);
        let filterButtons = container.find('.r-chart-filterSlider-button');
        filterButtons.addClass('active');
        EventHandler('window', 'mouseup', filterMouseUp);
    }
    function filterMouseUp() {
        temp.mouseDownDetail = {};
        let container = $(temp.dom.current);
        let filterButtons = container.find('.r-chart-filterSlider-button');
        filterButtons.removeClass('active');
        EventHandler('window', 'mouseup', filterMouseUp, 'unbind');
    }
    function getFilterSlider(axis) {
        var { axisToD } = temp.details;
        var d = axisToD[axis];
        let Axis = d === 'key' ? keyAxis : valueAxis;
        let { edit = (a) => a } = Axis;
        var { zoom } = Axis;
        if (!zoom) { return null; }
        var { range } = temp.details;
        if (!range || !range[axis]) { return null; }
        var { p1, p2, start, end } = range[axis].filter;
        var style = {
            x: { width: '100%', height: '16px', padding: '0 12px', top: '2px', opacity: 1 },
            y: { width: '16px', height: '100%', padding: '12px 0', right: '0px', opacity: 1 }
        }
        return (
            <AIOInput type='slider' direction={axis === 'x' ? 'right' : 'top'} start={start} end={end} multiple={true}
                className='filterSlider'
                style={{ position: 'absolute', ...style[axis] }}
                value={[p1, p2]}
                point={(index, value) => {
                    let labelHtml = edit(d === 'key' ? keys[value] : value)
                    return {
                        html: (
                            <div
                                className={'r-chart-filterSlider-button r-chart-filterSlider-button-' + axis}
                                onTouchStart={filterMouseDown}
                                onMouseDown={filterMouseDown}
                                style={{ background: zoomColor, border: `1px solid ${zoomColor}` }}
                            ></div>
                        ),
                        attrs: {
                            style: {
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '30px', height: '30px', borderRadius: '0px', background: 'none'
                            }
                        },
                        labelHtml
                    }
                }}
                line={(index) => {
                    let style;
                    if (index !== 0) {
                        style = { [axis === 'y' ? 'width' : 'height']: '1px', background: zoomColor }
                    }
                    return { attrs: { style } }
                }}
                onChange={(points) => changeFilter(axis, points[0], points[1])}
                grooveAttrs={{ style: { display: 'none' } }}
            />
        )
    }
    function getAddableDataIndexes(key) {
        if (key === undefined) { return [] }
        var indexes = [];
        for (let i = 0; i < data.length; i++) {
            let { editable } = data[i];
            if (editable === false || temp.keyDictionary[i][key] !== undefined) { continue; }
            indexes.push(i);
        }
        return indexes;
    }
    function getNearestPointToMouse({ key, value }) {
        let res = false;
        let dif = Infinity;
        for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
            let keyObj = temp.keyDictionary[dataIndex][key];
            if (keyObj === undefined) { continue; }
            let pointIndex = keyObj._pointIndex;
            let point = data[dataIndex].points[pointIndex];
            let Dif = Math.abs(point._value - value);
            if (Dif <= dif) {
                res = { ...point, ...keyObj };
                dif = Dif;
            }
        }
        return res;
    }
    function getMouseDetail(pos) {
        if (!pos) { return; }
        let { edit: keyEdit = (a) => a } = keyAxis;
        let { edit: valueEdit = (a) => a } = valueAxis;
        let { x, y, px, py } = pos;
        let client = temp.Canvas.canvasToClient([x, y]);
        let cx = client[0] + getAxisSize()[1];
        let cy = client[1];
        let { key = '', keyIndex, value } = getValueByPercent({ x: px, y: py });
        let label = { key: key !== '' ? keyEdit(key) : '', value: valueEdit(value) };
        label[temp.details.dToAxis.key] = label.key;
        label[temp.details.dToAxis.value] = label.value;
        if (temp.mouseDownDetail.target === 'point') { key = temp.mouseDownDetail.key; }
        temp.mouseDetail = {
            x, y,//canvas mouse position (px)
            px, py,//canvas mouse position (%)
            cx, cy,//client mouse position on canvas
            key, value, keyIndex,
            nearestPoint: getNearestPointToMouse({ key, value }),
            addDataIndexes: onAdd && temp.mouseDownDetail.target !== 'point' ? this.getAddableDataIndexes(key) : [],
            label
        }
    }
    function getValueByPercent(obj) {
        let { range, dToAxis } = temp.details;
        let result: { key: any, value: any, keyIndex: number } = { keyIndex: -1, key: '', value: '' };
        let axisKey = dToAxis.key, axisValue = dToAxis.value;
        if (range[axisKey]) {
            let { start, end } = range[axisKey];
            result.keyIndex = Math.round((end - start) * obj[axisKey] / 100 + start);
            result.key = keys[result.keyIndex];
        }
        if (range[axisValue]) {
            let { start, end } = range[axisValue];
            result.value = parseFloat(((end - start) * obj[axisValue] / 100 + start).toFixed(precision))
        }
        return result;
    }
    function renderMouseLabels(dom) {//خطوط و لیبل های موقعیت موس
        let { cx, cy, label, addDataIndexes } = temp.mouseDetail;
        let horLine = dom.find('.r-chart-horizontal-line'), verLine = dom.find('.r-chart-vertical-line');
        horLine.css({ display: 'block', top: cy + 'px' });
        verLine.css({ display: 'flex', left: cx + 'px' });
        horLine.html(`<div style="padding-right:${temp.details.yZoom ? '16' : '8'}px;">${label.y}</div>`);
        verLine.html(`<div style="top:calc(100% + ${temp.details.xZoom ? '14' : '4'}px);">${label.x}</div>`);
        if (!addDataIndexes.length) { return; }
        let container = dom.find('.r-chart-add-popup');
        let addIndicator = `<div class="add-indicator" style="background:${data[addDataIndexes[0]].color}">+</div>`;
        container.css({ left: cx, top: cy - (temp.touch ? 40 : 0) });
        container.html(`<div class="r-chart-popup">${addIndicator}${label.x} ${label.y}</div>`);
    }
    function renderPointLabels(dom) {//لیبل های نزدیک ترین نقطه به موس
        let { nearestPoint } = temp.mouseDetail;
        if (!nearestPoint) { return; }
        let container = dom.find('.r-chart-detail-popup');
        container.css({ left: `${nearestPoint._px}%`, top: 'unset', bottom: `${nearestPoint._py}%`, transition: (temp.mouseDownDetail.target === 'point' ? 0 : temp.transition) + 's' });
        container.html('<div class="r-chart-popup">' + nearestPoint._label.key + '  ' + nearestPoint._label.value + '</div>');
    }
    function getDataStrigify() { return temp.mouseDetail.target !== 'point' ? JSON.stringify(props.data) : 'a' }
    function getStyle() {
        let [x, y] = getAxisSize();
        let res: any = { gridTemplateColumns: `${y}px auto`, gridTemplateRows: `auto ${x}px`, direction: 'ltr' }
        return res
    }
    useEffect(() => {
        getDetails();
        getElements();
        setData(props.data);
    }, [getDataStrigify()])
    let d = temp.details;
    let yls = getLabelSlider('y');
    let yfs = getFilterSlider('y');
    let xls = getLabelSlider('x');
    let xfs = getFilterSlider('x');
    let HTML = html(temp.elements, d);
    let axisSize = this.getAxisSize();
    function getPopup() {
        if (!popup) { return null }
        let p: I_ChartEdit = {
            popup,
            changePopup,
            closePopup: () => {
                setPopup(false)
                hideSelectRect();
            }
        }
        return <RChartEdit {...p} />
    }

    function getContext() {
        let context: I_chart_context = {
            keyAxis, valueAxis, keys, data, rtl: !!rtl, translate
        }
        return context
    }
    return (
        <RChartContext.Provider value={getContext()}>
            <div {...attrs} className={'r-chart' + (attrs.className ? ' ' + attrs.className : '')} ref={temp.dom}>
                {this.getHeader()}
                <div className='r-chart-container' style={getStyle()}>
                    <RChartLine dir='horizontal' axisSize={axisSize} />
                    <RChartLine dir='vertical' axisSize={axisSize} />
                    {onAdd && <div className={'r-chart-popup-container r-chart-add-popup'}></div>}
                    {getPopup()}
                    <div className='r-chart-axis r-chart-axis-y'>{yls} {yfs}</div>
                    <div className='r-chart-canvas'>
                        {HTML}
                        <div className='r-chart-multiselect'></div>
                        {temp.Canvas.render({
                            screenPosition: ['50%', '50%'],
                            items: temp.elements.all,
                            attrs: {
                                onMouseMove: (e, pos) => {
                                    getMouseDetail(pos);
                                    let dom = $(temp.dom.current);
                                    dom.find('.r-chart-popup-container').html('');
                                    renderMouseLabels(dom)
                                    renderPointLabels(dom);
                                },
                                onMouseDown: mouseDown
                            }
                        })}
                        <div className={'r-chart-popup-container r-chart-detail-popup'}></div>
                    </div>
                    <div className='r-chart-corner'></div>
                    <div className='r-chart-axis r-chart-axis-x'>{xls} {xfs}</div>
                </div>
            </div>
        </RChartContext.Provider>
    )
}
type I_chart_context = {
    keyAxis: I_chart_axis,
    valueAxis: I_chart_axis,
    keys: any[],
    data: I_chart_data[],
    rtl: boolean, translate: (v: any) => string
}
type I_RChartLine = {
    dir: 'horizontal' | 'vertical'
    axisSize: number
}
function RChartLine(props: I_RChartLine) {
    let { dir, axisSize } = props;
    let style = dir === 'horizontal' ? { width: `calc(100% - ${axisSize[1]}px)` } : { height: `calc(100% - ${axisSize[0]}px)` }
    return (
        <div className={`r-chart-${dir}-line r-chart-line`} style={style}></div>
    )
}
type I_ChartEdit = {
    popup: I_chart_popup,
    closePopup: () => void,
    changePopup: (obj: { [key in keyof I_chart_popup]?: any }) => void
}
function RChartEdit(props: I_ChartEdit) {
    var { popup, changePopup, closePopup } = props;
    let { keyAxis, valueAxis, keys, data, rtl, translate }: I_chart_context = useContext(RChartContext);
    let [temp] = useState({
        dom: createRef()
    })
    useEffect(() => {
        $(temp.dom.current).find('input').eq(0).focus().select();
    }, [])
    let { title: keyTitle = 'untitle' } = keyAxis;
    let { title: valueTitle = 'untitle' } = valueAxis;
    return (
        <div className='r-chart-edit' ref={temp.dom as any} style={{ direction: rtl ? 'rtl' : 'ltr' }}>
            <div className='r-chart-edit-backdrop' onClick={closePopup}></div>
            <div className='r-chart-edit-header'>
                <div className='r-chart-edit-title'>{popup.title}</div>
                <div className='r-chart-edit-close' onClick={closePopup}></div>
            </div>
            <div className='r-chart-edit-body'>
                <div className='r-chart-edit-data-list'>
                    {
                        popup.dataIndexes.map((index) => {
                            if (data[index].editable === false) { return false; }
                            return (
                                <div
                                    onClick={() => changePopup({ dataIndex: index })}
                                    className={`r-chart-edit-data-list-item${popup.dataIndex === index ? ' active' : ''}`}
                                    key={index}
                                    style={{ color: data[index].color, background: data[index].color }}
                                ></div>
                            )
                        }).filter((d) => d !== false)
                    }
                </div>
                {
                    popup.staticValue !== undefined &&
                    <div className='r-chart-edit-item'>
                        <div className="r-chart-edit-label" title={keyTitle}>{keyTitle + ' : '}</div>
                        <div className="r-chart-detail-value">{popup.staticValue}</div>
                    </div>
                }
                {
                    popup.dynamicValue !== undefined &&
                    <div className='r-chart-edit-item'>
                        <div className="r-chart-edit-label" title={valueTitle}>{valueTitle + ' : '}</div>
                        <input
                            disabled={popup.disabled}
                            className='r-chart-edit-tag' type='number' value={popup.dynamicValue}
                            onChange={(e) => {
                                if (!popup.onEdit && !popup.onAdd) { return; }
                                changePopup({ dynamicValue: parseFloat(e.target.value) })
                            }}
                        />
                    </div>
                }
            </div>
            <div className='r-chart-edit-footer'>
                {
                    popup.onAdd &&
                    <button
                        className='r-chart-edit-button'
                        onClick={() => {
                            let points = data[popup.dataIndex].points;
                            let index = keys.indexOf(popup.staticValue);
                            let pointIndex = points.length;
                            for (let i = 0; i < points.length; i++) {
                                let point = points[i];
                                if (point._keyIndex > index) {
                                    pointIndex = i;
                                    break;
                                }
                            }
                            popup.onAdd({ key: popup.staticValue, value: popup.dynamicValue, dataIndex: popup.dataIndex, pointIndex });
                            closePopup();
                        }}
                    >{translate('Add')}</button>
                }
                {
                    popup.onRemove &&
                    <button
                        className='r-chart-edit-button'
                        onClick={() => {
                            let point = data[popup.dataIndex].points[popup.pointIndex];
                            popup.onRemove({ point, key: point._key, value: point._value, dataIndex: popup.dataIndex, pointIndex: popup.pointIndex }); closePopup();
                        }}
                    >{translate('Remove')}</button>
                }
                {
                    popup.onEdit &&
                    <button
                        className='r-chart-edit-button'
                        onClick={() => {
                            let point = data[popup.dataIndex].points[popup.pointIndex];
                            popup.onEdit({ point, key: point._key, value: popup.dynamicValue, dataIndex: popup.dataIndex, pointIndex: popup.pointIndex }); closePopup();
                        }}
                    >{translate('Edit')}</button>
                }
            </div>
        </div>
    )
}
export function getFakeData(x = 100, y = 100) {
    var points = [];
    var keys = [];
    for (var i = 0; i < x; i += 1) {
        y += Math.round(Math.random() * 10 - 5);
        points.push({ x: i.toString(), y: y });
        keys.push(i.toString());
    }
    return { points, keys }
}

export class Gauge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Canvas: new AIOCanvas()
        }
        this.getDetails();
    }
    getPercentByValue(value, start, end) { return 100 * (value - start) / (end - start) }
    getDetails() {
        var { angle, start, end, direction } = this.props;
        this.scales = this.getScales();
        this.labels = this.getLabels();
        this.slice = direction === 'clock' ? [this.getAngleByValue(end), this.getAngleByValue(start)] : [this.getAngleByValue(start), this.getAngleByValue(end)];
        this.circles = this.getCircles();
    }
    getAngleByValue(value) {
        var { direction, start, end, angle, rotate } = this.props;
        var percent = this.getPercentByValue(value, start, end);
        var valueAngle = angle / 100 * percent;
        if (direction === 'clock') {
            return 90 + angle / 2 - valueAngle + rotate;
        }
        return 90 - angle / 2 + valueAngle + rotate;
    }

    getRanges() {
        var { direction, ranges = [], radius, thickness } = this.props;
        if (!thickness) { return [] }
        var Ranges = (typeof ranges === 'function' ? ranges(this.props) : ranges).map((r, i) => {
            let { value, color, lineCap } = r;
            value = parseFloat(value);
            if (isNaN(value)) { console.error(`r-gauger error: ranges[${i}].value is undefined or not an number`) }
            return { color, angle: this.getAngleByValue(value), lineCap }
        })
        var circles = [];
        for (var i = 0; i < Ranges.length; i++) {
            var { color, angle, lineCap } = Ranges[i];
            var startAngle = i === 0 ? this.getAngleByValue(this.props.start) : Ranges[i - 1].angle;
            var endAngle = angle;
            var slice;
            if (direction === 'clock') {
                slice = [endAngle, startAngle]
            }
            else {
                slice = [startAngle, endAngle]
            }
            circles.push({ type: 'Arc', lineCap, r: radius, slice, stroke: color, lineWidth: thickness })
        }
        return circles.reverse();
    }
    getCircles() {
        var { circles } = this.props;
        if (!circles || circles.length === 0) { return [] }
        return circles.map((c) => {
            return { type: 'Arc', r: c.radius, lineWidth: c.lineWidth, stroke: c.stroke, fill: c.fill, lineCap: c.lineCap, slice: c.slice ? this.slice : undefined }
        });

    }
    getLabels() {
        var { start, end, label, radius, thickness, angle: mainAngle } = this.props;
        if (!label) { return [] }
        if (!Array.isArray(label)) { label = [label] }
        if (!label.length) { return [] }
        var labels = {};
        for (let i = 0; i < label.length; i++) {
            if (!label[i].step) { continue }
            let { step, edit, min, max } = label[i];
            if (typeof min !== 'number') { min = start }
            if (typeof max !== 'number') { max = end }
            step = this.getValueByField(step);
            min = this.getValueByField(min);
            max = this.getValueByField(max);
            if (min < start) { min = start }
            if (min > end) { min = end }
            if (max < start) { max = start }
            if (max > end) { max = end }
            let value = label[i].start === undefined ? Math.round(min / step) * step : label[i].start;
            while (value <= max) {
                let { offset = 0, color = '#000', fontSize = 10 } = label[i];
                offset = this.getValueByField(offset, value)
                color = this.getValueByField(color, value);
                fontSize = this.getValueByField(fontSize, value);
                let pivot = offset ? -offset : -(radius - thickness / 2);
                if (!labels[value]) {
                    let angle = this.getAngleByValue(value);

                    labels[value] = {
                        rotate: angle, pivot: [pivot, 0], type: 'Group',
                        items: [{ type: 'Text', text: edit ? edit(value) : value, fill: color, stroke: 'transparent', rotate: -angle, fontSize }]
                    }
                }
                value += step;
            }
        }
        let res = [];
        for (let prop in labels) { res.push(labels[prop]) }
        if (mainAngle === 360 && res[res.length - 1].rotate % 90 === 0) { res.pop(); }
        return res;
    }
    getScales() {
        var { start, end, scale, radius, thickness } = this.props;
        if (!Array.isArray(scale)) { scale = [scale] }
        let scales = {}
        for (let i = 0; i < scale.length; i++) {
            if (!scale[i].step) { continue }
            let { step, min, max } = scale[i];
            if (typeof min !== 'number') { min = start }
            if (typeof max !== 'number') { max = end }
            step = this.getValueByField(step);
            min = this.getValueByField(min);
            max = this.getValueByField(max);
            if (min < start) { min = start }
            if (min > end) { min = end }
            if (max < start) { max = start }
            if (max > end) { max = end }
            let value = scale[i].start === undefined ? Math.round(min / step) * step : scale[i].start;
            while (value <= max) {
                let { offset = 0, color = '#000', width, height = 5, lineCap } = scale[i];
                offset = this.getValueByField(offset, value)
                color = this.getValueByField(color, value);
                width = this.getValueByField(width, value);
                height = this.getValueByField(height, value);
                lineCap = this.getValueByField(lineCap);
                let pivot = offset ? -offset : -(radius - height - thickness / 2);
                if (!scales[value]) {
                    let angle = this.getAngleByValue(value);
                    scales[value] = { type: 'Line', stroke: color, lineCap, points: [[0, 0], [height, 0]], lineWidth: width, pivot: [pivot, 0], rotate: angle }
                }
                value += step;
            }
        }
        let res = [];
        for (let prop in scales) { res.push(scales[prop]) }
        return res;
    }
    getHandles() {
        var { handle } = this.props;
        if (!handle) { return []; }
        return Array.isArray(handle) ? handle.map((h) => this.getHandle(h)) : [this.getHandle(handle)];
    }
    getHandle(handle) {
        var { start, end, radius, thickness } = this.props;
        var { value = false, offset = 0, color = '#000', width = 4, height = (radius - thickness / 2), radius: handleRadius = 4 } = handle;
        offset = this.getValueByField(offset, value);
        color = this.getValueByField(color, value);
        width = this.getValueByField(width, value);
        height = this.getValueByField(height, value);
        handleRadius = this.getValueByField(handleRadius, value);
        var angle = this.getAngleByValue(value);
        return {
            type: 'Group',
            items: [
                { type: 'Line', fill: color, points: [[0, -width / 2], [height, 0], [0, width / 2]], lineWidth: 0, pivot: [-offset, 0], rotate: angle, close: true, stroke: 'transparent' },
                { type: 'Arc', r: handleRadius, fill: color, stroke: 'transparent' }
            ]
        }
    }
    getTexts() {
        var { text } = this.props;
        if (!text) { return []; }
        var texts = Array.isArray(text) ? text.map((t) => this.getText(t)) : [this.getText(text)];
        return texts;
    }
    getValueByField(field, value) {
        let props = this.props;
        try {
            let type = typeof field;
            if (type === 'function') { return field(props); }
            if (type === 'string') {
                if (field.indexOf('props.') === 0 || field.indexOf('value') === 0) {
                    let result;
                    eval('result = ' + field);
                    return result;
                }
                return field;
            }
            return field;
        }
        catch { return; }
    }
    getText(text) {
        var { value, top = 20, left = 0, fontSize = 10, fontFamily = 'arial', color = '#000', rotate = 0 } = text;
        value = this.getValueByField(value);
        top = this.getValueByField(top);
        left = this.getValueByField(left);
        fontSize = this.getValueByField(fontSize);
        fontFamily = this.getValueByField(fontFamily);
        color = this.getValueByField(color);
        if (!Array.isArray(color)) { color = [color] }
        let [fill, stroke] = color;
        rotate = this.getValueByField(rotate);
        return {
            type: 'Text', text: typeof value === 'function' ? value(this.props) : value, x: left, y: -top, rotate, fontSize, fontFamily, fill, stroke
        }
    }
    getItems() { return this.props.customShapes.concat(this.circles, this.getRanges(), this.labels, this.scales, this.getTexts(), this.getHandles()) }
    getStyle() {
        var Style = { ...this.props.style };
        Style.width = Style.width;
        Style.height = Style.height;
        return Style;
    }
    render() {
        var { dynamic, position, id, className } = this.props;
        let { Canvas } = this.state;
        if (dynamic) { this.getDetails(); }
        return (
            Canvas.render({
                className: `r-gauger${className ? ' ' + className : ''}`, id, items: this.getItems(), style: this.getStyle(), screenPosition: position
            })
        )
    }
}
Gauge.defaultProps = { angle: 180, rotate: 0, start: 0, end: 100, thickness: 10, radius: 70, scale: {}, direction: 'clock', position: [0, 0], customShapes: [] }