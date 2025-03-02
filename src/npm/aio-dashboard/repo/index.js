import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createContext, createRef, useContext, useEffect, useRef, useState } from "react";
import { AddToAttrs, GetPercentByValue } from "aio-utils";
import Canvas from 'aio-canvas';
import $ from 'jquery';
import { AISlider, AISpinner } from "aio-input";
import './index.css';
const ChartCtx = createContext({});
const Chart = (props) => {
    const propsRef = useRef(props);
    propsRef.current = props;
    const [aio_chart_ref] = useState(createRef());
    const [canvas] = useState(new Canvas());
    const [canvasItems, setCanvasItems] = useState([]);
    const dataDetailsRef = useRef([]);
    const labelDetailsRef = useRef({ key: [], value: [] });
    const chartSizeRef = useRef();
    let [filter, setFilter] = useState([0, props.keyAxis.count - 1]);
    const filterRef = useRef(filter);
    filterRef.current = filter;
    const [dic] = useState(getDic);
    function getDic() {
        if (props.reverse) {
            return { x: 'value', y: 'key', key: 'y', value: 'x' };
        }
        else {
            return { x: 'key', y: 'value', key: 'x', value: 'y' };
        }
    }
    const [chartClass] = useState(new ChartData({
        getFilter: () => filterRef.current,
        getProps: () => propsRef.current,
        getChartSize: () => chartSizeRef.current,
        dic
    }));
    let [timeout] = useState();
    let [timeout1] = useState();
    const filterMouseDownRef = useRef(false);
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
        timeout1 = setTimeout(() => {
            let aio_chart = $(aio_chart_ref.current);
            let labels = aio_chart.find('.aio-chart-horizontal-label-text');
            if (!labels.length) {
                return;
            }
            let firstLabel = labels.eq(0);
            let firstLabelHProp = firstLabel.attr('data-rotated') === 'yes' ? 'height' : 'width';
            let end = firstLabel.offset().left + (firstLabel[firstLabelHProp]());
            for (let i = 1; i < labels.length; i++) {
                let label = labels.eq(i);
                let hProp = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
                label.css({ display: 'flex' });
                let left = label.offset().left;
                let width = label[hProp]();
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
            const bottom = canvas.clientToCanvas([0, 0])[1];
            const top = canvas.clientToCanvas([0, chartSizeRef.current[dir === 'x' ? 'y' : 'x']])[1];
            return top - bottom;
        }
        else {
            const left = canvas.clientToCanvas([0, 0])[0];
            const right = canvas.clientToCanvas([chartSizeRef.current[dir === 'x' ? 'y' : 'x'], 0])[0];
            return right - left;
        }
    }
    function getGridLines(dir) {
        const { gridLineColor = dir === 'y' ? '#ddd' : undefined } = props[`${dic[dir]}Axis`];
        if (!gridLineColor) {
            return [];
        }
        const csize = clientSizeToCanvasSize(dir);
        const color = 'red';
        if (!color) {
            return [];
        }
        const d = dic[dir];
        const labels = labelDetailsRef.current[d];
        const gridLines = [];
        for (let i = 0; i < labels.length; i++) {
            const { offset } = labels[i];
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
        const res = [];
        const start = filter[0], end = filter[1];
        for (let key = start; key <= end; key++) {
            const { offset, label } = chartClass.getAxisPointDetail({ d: 'key', value: key });
            res.push({ offset, text: label });
        }
        return res;
    }
    function getValueLabelsDetail(size) {
        const { start, end } = props.valueAxis;
        let step = (end - start) / 10;
        const magnitude = Math.pow(10, Math.floor(Math.log10(step)));
        step = Math.round(step / magnitude) * magnitude;
        if (size[dic.value] < 240) {
            step *= 2;
        }
        const labels = [];
        for (let i = start; i <= end; i += step) {
            const { offset, label } = chartClass.getAxisPointDetail({ d: 'value', value: +i.toFixed(3) });
            labels.push({ offset, text: label });
        }
        return labels;
    }
    function getElements(dataDetails) {
        let lines = [], points = [], rects = [], texts = [], areas = [];
        for (let i = 0; i < dataDetails.length; i++) {
            const detail = dataDetails[i];
            if (detail.type === 'line') {
                const { pointElements, lineElement, textElements, areaElement } = getLineChartElements(detail);
                lines.push(lineElement);
                if (areaElement) {
                    areas.push(areaElement);
                }
                texts = [...texts, ...textElements];
                points = [...points, ...pointElements];
            }
            else {
                rects = [...rects, ...getBarChartElements(detail)];
            }
        }
        const gridLines = getGridLines('y');
        return [...gridLines, ...areas, ...rects, ...lines, ...points, ...texts];
    }
    function getLineChartElements(detail) {
        const { lineWidth, dash, stroke } = detail.dataOption.lineStyle;
        const pointElements = [];
        const textElements = [];
        const lineElement = { points: [], type: "Line", lineWidth, dash, stroke };
        const areaElement = detail.areaColors.length ? getArea(detail.areaPoints, detail.areaColors) : undefined;
        for (let i = 0; i < detail.points.length; i++) {
            const p = detail.points[i];
            const xOffset = p[`${dic.x}Offset`];
            const yOffset = p[`${dic.y}Offset`];
            lineElement.points.push([xOffset, yOffset]);
            pointElements.push(Object.assign(Object.assign({ type: 'Arc', x: xOffset, y: yOffset }, p.pointStyle), { data: {
                    data: p.data,
                    point: p.point,
                    dataIndex: p.dataIndex,
                    pointIndex: p.pointIndex
                }, events: {
                    onClick: props.onPointClick ? (p) => {
                        if (props.onPointClick) {
                            const { data, point, dataIndex, pointIndex } = p.item.data;
                            props.onPointClick({ data, point, dataIndex, pointIndex });
                        }
                    } : undefined
                } }));
            if (p.pointText) {
                const style = p.pointTextStyle || {};
                const { fontSize = 12, offset = 12, fill = '#000', rotate = 0 } = style;
                textElements.push({
                    type: 'Text', text: p.pointText, x: xOffset, y: yOffset + offset, fontSize, rotate, fill, align: [0, 1],
                });
            }
        }
        return { pointElements, lineElement, textElements, areaElement };
    }
    function getBarChartElements(detail) {
        const rectElements = [];
        for (let i = 0; i < detail.points.length; i++) {
            const p = detail.points[i];
            const step = (p.keyBarSize * detail.barCount) / (detail.barCount * 2);
            const start = p.keyOffset - (p.keyBarSize * detail.barCount / 2);
            const keyOffset = start + (step * detail.barIndex * 2);
            if (p.rangeDetails.length) {
                for (let i = 0; i < p.rangeDetails.length; i++) {
                    const { offset, height, color } = p.rangeDetails[i];
                    rectElements.push(Object.assign({ type: 'Rectangle', x: keyOffset, y: offset, width: p.keyBarSize, height }, Object.assign(Object.assign({}, p.pointStyle), { fill: color })));
                }
            }
            else {
                const obj = Object.assign({ type: 'Rectangle', [props.reverse ? 'y' : 'x']: keyOffset, [props.reverse ? 'x' : 'y']: p.valueOffset, [props.reverse ? 'height' : 'width']: p.keyBarSize, [props.reverse ? 'width' : 'height']: p.valueBarSize }, p.pointStyle);
                rectElements.push(obj);
            }
        }
        return rectElements;
    }
    useEffect(() => {
        $(window).on('resize', resize);
    }, []);
    useEffect(() => {
        update();
    }, [props.datas]);
    function resize() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            update();
        }, 350);
    }
    function getCornerStyle() { return { width: props[`${dic.y}Axis`].size, height: props[`${dic.x}Axis`].size }; }
    function update() {
        const aio_chart = $(aio_chart_ref.current);
        const canvasElement = aio_chart.find('canvas');
        const size = { x: canvasElement.width(), y: canvasElement.height() };
        chartSizeRef.current = size;
        const dataDetails = chartClass.getDataDetails(props.datas);
        labelDetailsRef.current = { key: getKeyLabelsDetail(), value: getValueLabelsDetail(size) };
        dataDetailsRef.current = dataDetails;
        const items = getElements(dataDetails);
        setCanvasItems(items);
        setTimeout(() => updateLabels(), 5);
    }
    function getArea(areaPoints, areaColor) {
        return { type: 'Line', points: areaPoints, fill: [0, 0, 0, -chartSizeRef.current.y, ['0 ' + areaColor[0], '1 ' + areaColor[1]]] };
    }
    function getLabelByCanvasPosition_axis(dir, value) {
        const chartSize = chartSizeRef.current[dir];
        const Axis = props[`${dic[dir]}Axis`];
        const d = dic[dir];
        const { padding = dir === 'x' ? [36, 36] : [0, 0], getLabel = (v) => v } = Axis;
        const start = dic[dir] === 'key' ? filter[0] : Axis.start;
        const end = dic[dir] === 'key' ? filter[1] : Axis.end;
        if (value < padding[0]) {
            return labelDetailsRef.current[d][start];
        }
        if (value > chartSize - padding[1]) {
            return labelDetailsRef.current[d][end];
        }
        const step = (chartSize - (padding[0] + padding[1])) / (end - start);
        const index = Math.round((value - padding[0]) / step);
        const text = getLabel(index);
        const offset = d === 'key' ? labelDetailsRef.current[d][index].offset : value;
        return { text, offset };
    }
    function getLabelByCanvasPosition(canvasPos) {
        return {
            x: getLabelByCanvasPosition_axis('x', canvasPos[0]),
            y: getLabelByCanvasPosition_axis('y', canvasPos[1])
        };
    }
    useEffect(() => { update(); }, []);
    function getContext() {
        return {
            rootProps: props, dic,
            changeFilter, filter, setFilterMouseDownRef, getFilterMouseDownRef
        };
    }
    const attrs = AddToAttrs(props.attrs, { className: 'aio-chart', attrs: { ref: aio_chart_ref } });
    function renderCanvas() {
        return canvas.render({
            items: canvasItems,
            //grid: [10, 10, '#eee'], 
            screenPosition: ['50%', '50%'],
            attrs: {
                onMouseMove: ({ mousePosition }) => {
                    if (chartSizeRef.current === undefined) {
                        return;
                    }
                    const container = $(aio_chart_ref.current);
                    const { x, y } = mousePosition;
                    const { x: xLabel, y: yLabel } = getLabelByCanvasPosition([x, y]);
                    chartClass.updateTooltip(xLabel, yLabel, container);
                    chartClass.updateCursor(container, xLabel, yLabel, [x, y]);
                },
                onMouseLeave: () => {
                    const container = $(aio_chart_ref.current);
                    chartClass.removeElements(container);
                },
            }
        });
    }
    return (_jsx(ChartCtx.Provider, { value: getContext(), children: _jsxs("div", Object.assign({}, attrs, { children: [_jsxs("div", { className: "aio-chart-top", children: [_jsx(YLabels, { labelDetails: labelDetailsRef.current[dic.y] }), _jsxs("div", { className: "aio-chart-canvas-container", children: [renderCanvas(), _jsx(CursorLines, {}), _jsx("div", { className: "aio-chart-tooltip-container" })] })] }), _jsxs("div", { className: "aio-chart-bottom", children: [_jsx("div", { className: "aio-chart-corner", style: getCornerStyle() }), _jsx(XLabels, { labelDetails: labelDetailsRef.current[dic.x] })] })] })) }));
};
export { Chart };
const XLabels = ({ labelDetails }) => {
    const { rootProps, filter, changeFilter, setFilterMouseDownRef, dic } = useContext(ChartCtx);
    const Axis = rootProps[`${dic.x}Axis`];
    const { rotate, size, getLabel = (v) => v, zoom } = Axis;
    function getAxisStyle() {
        let style = { height: size };
        return style;
    }
    function getLabelsStyle() {
        let style = {};
        if (rotate) {
            style.alignItems = 'flex-start';
        }
        return style;
    }
    function getLabelStyle(labelDetail) {
        let style = { left: labelDetail.offset };
        if (rotate) {
            style.transform = `rotate(${rotate}deg)`;
            style.justifyContent = rotate > 0 ? 'flex-start' : 'flex-end';
            style.height = 'fit-content';
        }
        return style;
    }
    return (_jsxs("div", { className: "aio-chart-axis aio-chart-horizontal-axis", style: getAxisStyle(), children: [_jsx(CursorLabel, { axis: 'y' }), _jsx("div", { className: "aio-chart-horizontal-labels", style: getLabelsStyle(), children: labelDetails.map((o, i) => {
                    return (_jsx("div", { className: "aio-chart-horizontal-label", style: getLabelStyle(o), children: _jsx("div", { className: "aio-chart-horizontal-label-text", "data-rotated": rotate ? 'yes' : 'no', children: o.text }) }, i));
                }) }), !!zoom && dic.key === 'x' &&
                _jsx(AISlider, { multiple: true, size: 0, style: { background: 'none' }, start: 0, end: Axis.count - 1, value: [...filter], onChange: (v) => changeFilter(v), fill: () => {
                        return {
                            thickness: 16,
                            style: { opacity: 0.2 }
                        };
                    }, point: ({ index, value }) => {
                        const label = getLabel(value);
                        return {
                            html: (_jsx("div", { className: "aio-chart-horizontal-filter-value", children: label })),
                            attrs: {
                                style: { background: 'red' },
                                onMouseDown: () => { setFilterMouseDownRef(true); },
                                onMouseUp: () => { setFilterMouseDownRef(false); }
                            }
                        };
                    } })] }));
};
const YLabels = ({ labelDetails }) => {
    const { rootProps, dic } = useContext(ChartCtx);
    const Axis = rootProps[`${dic.y}Axis`];
    const { size } = Axis;
    function getAxisStyle() { return { width: size }; }
    function getLabelsStyle() {
        let style = {};
        return style;
    }
    function getLabelStyle(labelDetail) {
        let style = { bottom: labelDetail.offset };
        return style;
    }
    return (_jsxs("div", { className: "aio-chart-axis aio-chart-vertical-axis", style: getAxisStyle(), children: [_jsx(CursorLabel, { axis: 'x' }), _jsx("div", { className: "aio-chart-vertical-labels", style: getLabelsStyle(), children: labelDetails.map((o, i) => {
                    return (_jsx("div", { className: "aio-chart-vertical-label", style: getLabelStyle(o), children: o.text }, i));
                }) })] }));
};
const CursorLabel = ({ axis }) => {
    return (_jsx("div", { className: `aio-chart-cursor-label-container aio-chart-cursor-label-container-${axis}`, children: _jsx("div", { className: `aio-chart-cursor-label aio-chart-cursor-label-${axis}` }) }));
};
const CursorLines = () => {
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "aio-chart-cursor-line aio-chart-cursor-line-x" }), _jsx("div", { className: "aio-chart-cursor-line aio-chart-cursor-line-y" })] }));
};
export const Pie = (props) => {
    function getRange(r) {
        const { value, thickness = props.thickness || 12, offset = props.offset || 0, roundCap = props.roundCap || false, color } = r;
        return [value, { thickness, offset, roundCap, color }];
    }
    function getRanges() {
        const { end, ranges } = props;
        const res = ranges.map((o) => getRange(o));
        return res;
    }
    const Attrs = AddToAttrs(props.attrs, { className: ['aio-chart-pie', props.className], style: props.style });
    return (_jsx(AISpinner, { attrs: Attrs, circles: props.circles, size: props.size, start: props.start, end: props.end, ranges: getRanges(), handle: false, point: false, style: { border: 'none' } }));
};
class ChartData {
    constructor(p) {
        this.tooltipDic = {};
        this.getDataOption = (data, dataIndex) => {
            const { dataOption = () => { return {}; } } = this.p.getProps();
            const option = dataOption(data, dataIndex);
            const title = data.title || option.title || '';
            const color = data.color || option.color || '#000';
            const areaColors = data.areaColors || option.areaColors || [];
            const lineStyle = Object.assign(Object.assign({}, option.lineStyle), data.lineStyle);
            const { lineWidth = 1, stroke = '#333', dash } = lineStyle;
            const pointStyle = (point, pointIndex) => {
                const dataOptionPointStyle = (option.pointStyle || (() => { }))(point, pointIndex);
                const dataPointStyle = (data.pointStyle || (() => { }))(point, pointIndex);
                const pointStyle = Object.assign(Object.assign({}, dataOptionPointStyle), dataPointStyle);
                const { lineWidth = 1, r = 4, dash, stroke = data.type === 'line' ? '#333' : undefined, fill = data.type === 'line' ? '#fff' : '#333' } = pointStyle;
                return { lineWidth, r, dash, stroke, fill };
            };
            const pointText = (point, pointIndex) => {
                return (data.pointText || (() => { }))(point, pointIndex) || (option.pointText || (() => { }))(point, pointIndex) || '';
            };
            const pointValue = (point, pointIndex) => {
                return (data.pointValue || (() => { }))(point, pointIndex) || (option.pointValue || (() => { }))(point, pointIndex) || 0;
            };
            const pointRanges = (point, pointIndex) => {
                return (data.pointRanges || (() => { }))(point, pointIndex) || (option.pointRanges || (() => { }))(point, pointIndex) || [];
            };
            const pointTextStyle = (point, pointIndex) => {
                const dataOptionPointTextStyle = (option.pointTextStyle || (() => { }))(point, pointIndex);
                const dataPointTextStyle = (data.pointTextStyle || (() => { }))(point, pointIndex);
                const pointTextStyle = Object.assign(Object.assign({}, dataOptionPointTextStyle), dataPointTextStyle);
                const { fontSize = 12, offset = 12, fill = '#000', rotate = 0 } = pointTextStyle;
                return { fontSize, offset, fill, rotate };
            };
            return {
                pointStyle,
                pointText,
                pointTextStyle,
                pointValue,
                pointRanges,
                lineStyle: { lineWidth, stroke, dash },
                areaColors, title, color, type: data.type, points: data.points
            };
        };
        this.getRangeDetails = (ranges) => {
            if (!ranges) {
                return [];
            }
            const res = [];
            let lastValue = 0;
            for (let k = 0; k < ranges.length; k++) {
                let [value = lastValue, color] = ranges[k];
                if (value === undefined) {
                    continue;
                }
                const { offset: startOffset } = this.getAxisPointDetail({ d: 'value', value: lastValue });
                const { offset: endOffset } = this.getAxisPointDetail({ d: 'value', value });
                res.push({ offset: startOffset, height: endOffset - startOffset, color, value: value - lastValue });
                lastValue = value;
            }
            return res;
        };
        this.getDataDetails = (datas) => {
            const dic = this.p.dic;
            const filter = this.p.getFilter();
            let dataDetails = [];
            const barCount = datas.filter((data) => data.type === 'bar').length;
            let barIndex = -1;
            this.tooltipDic = {};
            for (let dataIndex = 0; dataIndex < datas.length; dataIndex++) {
                const data = datas[dataIndex];
                const dataOption = this.getDataOption(data, dataIndex);
                if (data.type === 'bar') {
                    barIndex++;
                }
                let dataDetail = { points: [], dataOption, barCount, barIndex, areaPoints: [], areaColors: dataOption.areaColors, type: data.type || 'line' };
                for (let pointIndex = filter[0]; pointIndex <= filter[1]; pointIndex++) {
                    const point = data.points[pointIndex];
                    const rangeDetails = this.getRangeDetails(dataOption.pointRanges(point, pointIndex));
                    const { percent: keyPercent, offset: keyOffset, label: keyLabel, barSize: keyBarSize } = this.getAxisPointDetail({ d: 'key', data, value: pointIndex });
                    const { percent: valuePercent, offset: valueOffset, label: valueLabel, barSize: valueBarSize } = this.getAxisPointDetail({ d: 'value', data, value: dataOption.pointValue(point, pointIndex) });
                    const pointDetail = {
                        keyPercent, valuePercent, keyOffset, valueOffset, keyLabel, valueLabel, keyBarSize, valueBarSize,
                        rangeDetails, dataOption,
                        data, dataIndex, point, pointIndex,
                        pointStyle: dataOption.pointStyle(point, pointIndex),
                        pointText: dataOption.pointText(point, pointIndex),
                        pointTextStyle: dataOption.pointTextStyle(point, pointIndex)
                    };
                    dataDetail.points.push(pointDetail);
                    this.addPosition(pointDetail, dataOption.color);
                    if (dataOption.areaColors.length) {
                        dataDetail.areaPoints.push([pointDetail[`${dic.x}Offset`], pointDetail[`${dic.y}Offset`]]);
                    }
                }
                if (dataOption.areaColors.length) {
                    dataDetail.areaPoints = [[dataDetail.areaPoints[0][0], 0], ...dataDetail.areaPoints, [dataDetail.areaPoints[dataDetail.areaPoints.length - 1][0], 0]];
                }
                dataDetails.push(dataDetail);
            }
            return dataDetails;
        };
        this.addPosition = (pointDetail, color) => {
            const { keyOffset: x, valueOffset: y, valueLabel: label, dataOption } = pointDetail;
            const key = x.toString();
            this.tooltipDic[key] = this.tooltipDic[key] || { ys: [], labels: [] };
            this.tooltipDic[key].ys.push(y);
            this.tooltipDic[key].labels.push({ color, label, rangeDetails: pointDetail.rangeDetails, dataOption });
        };
        this.getTooltip = (x, y) => {
            const det = this.tooltipDic[x.toString()];
            if (!det) {
                return { tooltipY: 0, tooltipPoints: [] };
            }
            let res = { tooltipY: 0, tooltipPoints: det.labels }, min = Infinity;
            for (let i = 0; i < det.ys.length; i++) {
                if (Math.abs(det.ys[i] - y) < min) {
                    res.tooltipY = det.ys[i];
                    min = det.ys[i];
                }
            }
            return res;
        };
        this.updateTooltip = (xLabel, yLabel, container) => {
            if (xLabel === undefined || yLabel === undefined) {
                return;
            }
            const { tooltipY, tooltipPoints } = this.getTooltip(xLabel.offset, yLabel.offset);
            const html = (`
                <div class="aio-chart-tooltip">
                    <div class="aio-chart-tooltip-title">${xLabel.text}</div>
                    ${tooltipPoints.map(({ label, color, rangeDetails, dataOption }) => {
                return (`
                                    ${!rangeDetails.length ?
                    `<div class='aio-chart-tooltip-item'>
                                            <div style="width:10px;height:10px;background:${color}"></div>
                                            ${!!dataOption.title ? `<div style='white-space:nowrap'>${dataOption.title}</div>` : ''}
                                            <div>${label}</div>
                                        </div>`
                    : ''}
                                    ${rangeDetails.map((o) => {
                    return (`
                                                    <div class='aio-chart-tooltip-item'>
                                                        <div style="width:10px;height:10px;background:${o.color}"></div>
                                                        <div>${o.value}</div>
                                                    </div>
                                                `);
                }).join('')}
                                `);
            }).join('')}
                    <div class="aio-chart-tooltip-arrow"></div>
                </div>
            `);
            const tooltipElement = container.find('.aio-chart-tooltip-container');
            tooltipElement.css({ left: xLabel.offset, bottom: tooltipY, display: 'flex' });
            tooltipElement.html(html);
        };
        this.updateCursor = (container, xLabel, yLabel, canvasPos) => {
            if (xLabel === undefined || yLabel === undefined) {
                return;
            }
            container.find('.aio-chart-cursor-label-y').html(xLabel.text);
            container.find('.aio-chart-cursor-label-x').html(yLabel.text);
            container.find('.aio-chart-cursor-label-container-y').css({ left: canvasPos[0], display: 'flex' });
            container.find('.aio-chart-cursor-label-container-x').css({ bottom: canvasPos[1], display: 'flex' });
            container.find('.aio-chart-cursor-line-x').css({ bottom: canvasPos[1], display: 'block' });
            container.find('.aio-chart-cursor-line-y').css({ left: canvasPos[0], display: 'block' });
        };
        this.removeElements = (container) => {
            container.find('.aio-chart-cursor-line').css({ display: 'none' });
            container.find('.aio-chart-cursor-label-container').css({ display: 'none' });
            container.find('.aio-chart-tooltip-container').css({ display: 'none' });
        };
        this.getAxisPointDetail = (p) => {
            const filter = this.p.getFilter();
            const props = this.p.getProps();
            const Axis = props[`${p.d}Axis`];
            const dir = this.p.dic[p.d];
            const { padding = p.d === 'key' ? [36, 36] : [0, 0] } = Axis;
            const f = p.d === 'key' ? filter : [Axis.start, Axis.end];
            const start = f[0], end = f[1];
            const percent = GetPercentByValue(start, end, p.value);
            const avilSize = this.p.getChartSize()[dir] - (padding[0] + padding[1]);
            const offset = padding[0] + avilSize * percent / 100;
            let barSize = 0;
            if (p.d === 'key') {
                barSize = p.data && p.data.type === 'bar' ? this.getBarWidth(p.data) : 0;
            }
            else {
                barSize = -offset;
            }
            return { percent, offset, label: Axis.getLabel(p.value), barSize };
        };
        this.getBarWidth = (data) => {
            const dir = this.p.dic.key;
            const props = this.p.getProps();
            const { datas } = this.p.getProps();
            const Axis = props.keyAxis;
            const { padding = [36, 36] } = Axis;
            const barCount = datas.filter((data) => data.type === 'bar').length;
            const pointsLength = data.points.length;
            let avilableWidth = this.p.getChartSize()[dir] - (padding[0] + padding[1]);
            const gap = avilableWidth / pointsLength / 2;
            avilableWidth -= (pointsLength - 1) * gap;
            return avilableWidth / pointsLength / barCount;
        };
        this.p = p;
    }
}
