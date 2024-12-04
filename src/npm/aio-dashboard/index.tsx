import { createContext, createRef, FC, MutableRefObject, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { AddToAttrs, GetArray, GetPercentByValue } from "../aio-utils";
import Canvas from './../../npm/aio-canvas';
import { I_canvas_item, I_canvas_props } from "../aio-canvas/types";
import $ from 'jquery';
import './index.css';
import { AI_point, AISlider, AISpinner, I_rangeConfig } from "../aio-input";
const ChartCtx = createContext({} as any)
type I_chart_range = [number, string][]
type I_chart_size = { x: number, y: number }
type I_chart_axis = { start: number, end: number, size: number, padding?: number[], getLabel: (v: number) => string, rotate?: number, gridLineColor?: string, zoom?: boolean }
type I_chart_label_detail = { label: ReactNode, offset: number }
type I_getPointStyle = (point: any) => I_chart_point_style;
type I_getLineStyle = () => I_chart_line_style
type I_chart_point_style = { lineWidth?: number, r?: number, dash?: number[], stroke?: string, fill?: string }
type I_chart_line_style = { lineWidth?: number, dash?: number[], stroke?: string }
type I_chart_data_detail = {
    points: I_chart_point_detail[], type: 'line' | 'bar', lineStyle: I_chart_line_style, getPointText?: I_getPointText,
    barCount: number, barIndex: number, areaPoints: number[][], areaColors?: [string, string]
}
type I_rangeDetail = { offset: number, height: number, color: string }
type I_chart_point_detail = {
    x: { value: number, percent: number, offset: number, label: ReactNode, size: number },
    y: { value: number, percent: number, offset: number, label: ReactNode, size: number },
    pointStyle?: I_chart_point_style, rangeDetails: I_rangeDetail[]
}
type I_getPointText = (point: I_chart_point_detail) => {
    text: string,
    style?: { fontSize?: number, rotate?: number, fill?: string, offset?: number }
} | undefined
type I_chart_data = {
    color?:string,
    title?:string,
    points: any[],
    getX: (point: any) => number,
    getY: (point: any) => number,
    getRanges?: (point: any) => I_chart_range | undefined,
    getPointStyle?: I_getPointStyle,
    getLineStyle?: I_getLineStyle,
    getPointText?: I_getPointText,
    type: 'line' | 'bar',
    areaColors?: [string, string]
}
export type I_Chart = {
    datas: I_chart_data[],
    xAxis: I_chart_axis,
    yAxis: I_chart_axis,
    attrs?:any
}
type I_filter = { x: number[], y: number[] }
type I_ctx = {
    rootProps: I_Chart,
    changeFilter: (axis: 'x' | 'y', newFilter: number[]) => void,
    filter: I_filter, setFilterMouseDownRef: (v: boolean) => void, getFilterMouseDownRef: () => boolean
}
const Chart: FC<I_Chart> = (props) => {
    const propsRef = useRef(props)
    propsRef.current = props;
    const [dom] = useState<any>(createRef())
    const [curh] = useState<any>(createRef())
    const [curv] = useState<any>(createRef())
    const [curhl] = useState<any>(createRef())
    const [curvl] = useState<any>(createRef())
    const [tooltipRef] = useState<any>(createRef())
    const [canvas] = useState<Canvas>(new Canvas())
    const [canvasItems, setCanvasItems] = useState<I_canvas_item[]>([])
    const dataDetailsRef = useRef<I_chart_data_detail[]>([])
    const getXLabelsDetailRef = useRef<I_chart_label_detail[]>([])
    const getYLabelsDetailRef = useRef<I_chart_label_detail[]>([])
    const sizeRef = useRef<any>()
    let [filter, setFilter] = useState<I_filter>({ x: [props.xAxis.start, props.xAxis.end], y: [props.yAxis.start, props.yAxis.end] })
    const filterRef = useRef(filter)
    filterRef.current = filter
    const [chartClass] = useState<ChartData>(new ChartData({
        getFilter: () => filterRef.current,
        getProps: () => propsRef.current

    }))
    let [timeout] = useState<any>()
    let [timeout1] = useState<any>()
    const filterMouseDownRef = useRef(false)
    const calcTemp = useRef()
    function setFilterMouseDownRef(v: boolean) {
        filterMouseDownRef.current = v
    }
    function getFilterMouseDownRef() {
        return filterMouseDownRef.current
    }
    function changeFilter(axis: 'x' | 'y', newFilter: number[]) {
        const stateFilter = { ...filter, [axis]: newFilter };
        filter = stateFilter
        setFilter(filter)
        update();
    }
    function updateLabels() {
        clearTimeout(timeout1)
        timeout1 = setTimeout(() => {
            let container = $(dom.current);
            let labels = container.find('.aio-chart-horizontal-label-text');
            if (!labels.length) { return; }
            let firstLabel: any = labels.eq(0);
            let firstLabelHProp = firstLabel.attr('data-rotated') === 'yes' ? 'height' : 'width';
            let end = firstLabel.offset().left + (firstLabel[firstLabelHProp]());
            for (let i = 1; i < labels.length; i++) {
                let label: any = labels.eq(i);
                let hProp = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
                label.css({ display: 'flex' })
                let left = label.offset().left
                let width = label[hProp]();
                if (left < end + 5) { label.css({ display: 'none' }) }
                else { end = left + width; }
            }
        }, 100)
    }
    function getXLabelsDetail(size: I_chart_size): I_chart_label_detail[] {
        const res: I_chart_label_detail[] = [];
        const f = filter.x;
        const start = f[0], end = f[1];
        for (let key = start; key <= end; key++) {
            const { offset, label } = chartClass.getPointDetail({axis:'x', value:key, size})
            res.push({ offset, label })
        }
        return res
    }
    function clientSizeToCanvasSize(axis: 'x' | 'y', size: I_chart_size) {
        if (axis === 'x') {
            const bottom = canvas.clientToCanvas([0, 0])[1];
            const top = canvas.clientToCanvas([0, size[axis as any === 'x' ? 'y' : 'x']])[1]
            return top - bottom
        }
        else {
            const left = canvas.clientToCanvas([0, 0])[0];
            const right = canvas.clientToCanvas([size[axis as any === 'x' ? 'y' : 'x'], 0])[0]
            return right - left
        }
    }
    function getGridLines(axis: 'x' | 'y', size: I_chart_size): I_canvas_item[] {
        const { gridLineColor = axis === 'y' ? '#ddd' : undefined } = props[`${axis}Axis`]
        if (!gridLineColor) { return [] }
        const csize: number = clientSizeToCanvasSize(axis, size)
        const color = 'red';
        if (!color) { return [] }
        const labels = axis === 'x' ? getXLabelsDetailRef.current : getYLabelsDetailRef.current
        const gridLines: I_canvas_item[] = [];
        for (let i = 0; i < labels.length; i++) {
            const { offset } = labels[i];
            if (axis === 'y') {
                gridLines.push({ type: 'Line', points: [[0, offset], [csize, offset]], stroke: gridLineColor })
            }
            else {
                gridLines.push({ type: 'Line', points: [[offset, 0], [offset, csize]], stroke: gridLineColor })
            }
        }
        return gridLines;
    }
    function getYLabelsDetail(size: I_chart_size) {
        const f = filter.y;
        const start = f[0], end = f[1];
        let step = (end - start) / 10;
        const magnitude = Math.pow(10, Math.floor(Math.log10(step)));
        step = Math.round(step / magnitude) * magnitude;
        if(size.y < 240){step *= 2}
        const labels: I_chart_label_detail[] = [];
        for (let i = start; i <= end; i += step) {
            const { offset, label } = chartClass.getPointDetail({axis:'y', value:+i.toFixed(3), size})
            labels.push({ offset, label });
        }
        return labels;
    }

    function getElements(dataDetails: I_chart_data_detail[], size: I_chart_size) {
        let lines: I_canvas_item[] = [], points: I_canvas_item[] = [], rects: I_canvas_item[] = [], texts: I_canvas_item[] = [], areas: I_canvas_item[] = [];
        for (let i = 0; i < dataDetails.length; i++) {
            const detail = dataDetails[i];
            if (detail.type === 'line') {
                const { pointElements, lineElement, textElements, areaElement } = getLineChartElements(detail, size)
                lines.push(lineElement)
                if (areaElement) { areas.push(areaElement) }
                texts = [...texts, ...textElements];
                points = [...points, ...pointElements]
            }
            else {
                rects = [...rects, ...getBarChartElements(detail, size)]
            }
        }
        const gridLines = getGridLines('y', size)
        return [...gridLines, ...areas, ...rects, ...lines, ...points, ...texts]
    }
    function getLineChartElements(detail: I_chart_data_detail, size: I_chart_size): {
        pointElements: I_canvas_item[], lineElement: I_canvas_item, textElements: I_canvas_item[], areaElement?: I_canvas_item
    } {
        const { lineWidth, dash, stroke } = detail.lineStyle;
        const pointElements: I_canvas_item[] = []
        const textElements: I_canvas_item[] = [];
        const lineElement: I_canvas_item = { points: [], type: "Line", lineWidth, dash, stroke };
        const areaElement: I_canvas_item | undefined = detail.areaColors ? getArea(detail.areaPoints, detail.areaColors, size) : undefined
        for (let i = 0; i < detail.points.length; i++) {
            const p = detail.points[i];
            (lineElement.points as any).push([p.x.offset, p.y.offset])
            if (p.pointStyle) { pointElements.push({ type: 'Arc', x: p.x.offset, y: p.y.offset, ...p.pointStyle }) }
            const text = detail.getPointText ? detail.getPointText(p) : undefined
            if (text) {
                const style = text.style || {}
                const { fontSize = 12, offset = 12, fill = '#000', rotate = 0 } = style
                textElements.push({ type: 'Text', text: text.text, x: p.x.offset, y: p.y.offset + offset, fontSize, rotate, fill, align: [0, 1] })
            }
        }
        return { pointElements, lineElement, textElements, areaElement }
    }
    function getBarChartElements(detail: I_chart_data_detail, size: I_chart_size): I_canvas_item[] {
        const rectElements: I_canvas_item[] = []
        for (let i = 0; i < detail.points.length; i++) {
            const { x, y, pointStyle, rangeDetails } = detail.points[i];
            const step = (x.size * detail.barCount) / (detail.barCount * 2);
            const start = x.offset - (x.size * detail.barCount / 2);
            const offsetX = start + (step * detail.barIndex * 2)
            if (rangeDetails.length) {
                for (let i = 0; i < rangeDetails.length; i++) {
                    const { offset, height, color } = rangeDetails[i];
                    rectElements.push({ type: 'Rectangle', x: offsetX, y: offset, width: x.size, height, ...{ ...pointStyle, fill: color } })
                }
            }
            else {
                rectElements.push({ type: 'Rectangle', x: offsetX, y: y.offset, width: x.size, height: y.size, ...pointStyle })
            }
        }
        return rectElements
    }
    useEffect(() => {
        $(window).on('resize', resize)
    }, [])
    function resize() {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            update()
        }, 350)
    }
    function getCornerStyle() { return { width: props.yAxis.size, height: props.xAxis.size } }
    function update() {
        const parentElement = $(dom.current);
        const canvasElement = parentElement.find('canvas');
        const size: I_chart_size = { x: canvasElement.width(), y: canvasElement.height() }
        sizeRef.current = size
        const dataDetails = chartClass.getDataDetails(props.datas, size);
        getXLabelsDetailRef.current = getXLabelsDetail(size)
        getYLabelsDetailRef.current = getYLabelsDetail(size)
        dataDetailsRef.current = dataDetails;
        const items = getElements(dataDetails, size);
        setCanvasItems(items);
        setTimeout(() => updateLabels(), 5)
    }
    function getArea(areaPoints: number[][], areaColor: [string, string], size: I_chart_size): I_canvas_item {
        return { type: 'Line', points: areaPoints, fill: [0, 0, 0, -size.y, ['0 ' + areaColor[0], '1 ' + areaColor[1]]] as any };
    }
    function getXLabelByValue(value: number, size: number): { label: ReactNode, offset: number } {
        const { padding = [36, 36], getLabel = (v) => v } = props.xAxis;
        const start = filter.x[0]
        const end = filter.x[1];
        const step: number = (size - (padding[0] + padding[1])) / (end - start)
        if (value < padding[0]) { return getXLabelsDetailRef.current[start] }
        if (value > size - padding[1]) { return getXLabelsDetailRef.current[end] }
        const index = Math.round((value - padding[0]) / step);
        const label = getLabel(index);
        const offset = getXLabelsDetailRef.current[index].offset
        console.log('offset', offset)
        return { label, offset }
    }
    function getYLabelByValue(value: number, size: number): { label: ReactNode, offset: number } {
        const { start, end, padding = [0, 0], getLabel = (v) => v } = props.yAxis;
        const step: number = (size - (padding[0] + padding[1])) / (end - start)
        if (value < padding[0]) { return getYLabelsDetailRef.current[start] }
        if (value > size - padding[1]) { return getYLabelsDetailRef.current[end] }
        const index = Math.round((value - padding[0]) / step);
        const label = getLabel(index);
        const offset = value
        return { label, offset }
    }
    function getLabelIndex(pos: number, size: number, padding: number[], length: number) {
        return Math.round((pos - padding[0]) * (length - 1) / (size - padding[0] - padding[1]))
    }
    useEffect(() => { update() }, [])
    function getContext(): I_ctx {
        return {
            rootProps: props,
            changeFilter, filter, setFilterMouseDownRef, getFilterMouseDownRef
        }
    }
    // function search(list:any[],getValue:(record:any)=>number,result:number,dif = {value:Infinity,index:undefined}){
    //     const halfIndex = Math.ceil(list.length / 2);
    //     const halfValue = getValue(list[halfIndex])
    //     const difValue = Math.abs(halfValue - result)
    //     const newDif = dif.value{value:difValue,index:halfIndex}
    //     if(halfValue < result){
    //         return search(list.slice(halfIndex,list.length),getValue,result,newDif)
    //     }
    //     else if(halfValue > result){
    //         return search(list.slice(halfIndex,list.length),getValue,result)
    //     }
    // }
    function getTooltip(xLabel:ReactNode,labels:{color:string,label:ReactNode}[]){
        return (
            `
                <div class="aio-chart-tooltip">
                    <div class="aio-chart-tooltip-title">${xLabel}</div>
                    ${
                        labels.map(({label,color})=>{
                            return (
                                `
                                    <div class='aio-chart-tooltip-item'>
                                        <div style="width:10px;height:10px;background:${color}"></div>
                                        <div>${label}</div>
                                    </div>
                                `
                            )
                        })
                    }
                    <div class="aio-chart-tooltip-arrow"></div>
                </div>
            `
        )
    }
    const attrs = AddToAttrs(props.attrs,{className:'aio-chart',attrs:{ref:dom}})
    return (
        <ChartCtx.Provider value={getContext()}>
            <div {...attrs}>
                <div className="aio-chart-top">
                    <YLabels yLabels={getYLabelsDetailRef.current} curhl={curhl} />
                    <div className="aio-chart-canvas">
                        {canvas.render({
                            items: canvasItems,
                            //grid: [10, 10, '#eee'], 
                            screenPosition: ['50%', '50%'],
                            attrs: {
                                onMouseMove: ({ mousePosition }) => {
                                    if (sizeRef.current === undefined) { return }
                                    const { x, y } = mousePosition
                                    const w = sizeRef.current.x, h = sizeRef.current.y
                                    const { label: xLabel, offset: xOffset } = getXLabelByValue(x, w);
                                    const { label: yLabel, offset: yOffset } = getYLabelByValue(y, h);
                                    const vlc = $(curvl.current)
                                    const hlc = $(curhl.current)
                                    const tooltipElement = $(tooltipRef.current)
                                    vlc.find('.aio-chart-cursor-label-v').html(xLabel)
                                    hlc.find('.aio-chart-cursor-label-h').html(yLabel)
                                    console.log(xOffset, yOffset)
                                    const {y:ty,labels} = chartClass.getTooltip(xOffset,yOffset)
                                    const tooltip = getTooltip(xLabel,labels)
                                    tooltipElement.css({ left: xOffset, bottom: ty,display:'flex' })
                                    tooltipElement.html(tooltip)
                                    vlc.css({ left: x, display: 'flex' });
                                    hlc.css({ bottom: y, display: 'flex' });
                                    $(curh.current).css({ bottom: y, display: 'block' })
                                    $(curv.current).css({ left: x, display: 'block' })

                                },
                                onMouseLeave: () => {
                                    $(curh.current).css({ display: 'none' })
                                    $(curv.current).css({ display: 'none' })
                                    $(curhl.current).css({ display: 'none' })
                                    $(curvl.current).css({ display: 'none' })
                                    $(tooltipRef.current).css({ display: 'none' })
                                }
                            }
                        })}
                        <div className="aio-chart-cursor-line aio-chart-cursor-line-h" ref={curh}></div>
                        <div className="aio-chart-cursor-line aio-chart-cursor-line-v" ref={curv}></div>
                        <div className="aio-chart-tooltip-container" ref={tooltipRef}></div>
                    </div>
                </div>
                <div className="aio-chart-bottom">
                    <div className="aio-chart-corner" style={getCornerStyle()}></div>
                    <XLabels xLabels={getXLabelsDetailRef.current} curvl={curvl} />
                </div>
            </div>
        </ChartCtx.Provider>
    )
}
export { Chart }
const XLabels: FC<{ xLabels: I_chart_label_detail[], curvl: any }> = ({ xLabels, curvl }) => {
    const { rootProps, filter, changeFilter, setFilterMouseDownRef }: I_ctx = useContext(ChartCtx)
    const { xAxis } = rootProps
    const { rotate, size, getLabel = (v) => v, zoom } = xAxis;
    function getAxisStyle() {
        let style: any = { height: size };
        return style
    }
    function getLabelsStyle() {
        let style: any = {}
        if (rotate) { style.alignItems = 'flex-start' }
        return style
    }
    function getLabelStyle(labelDetail: I_chart_label_detail) {
        let style: any = { left: labelDetail.offset }
        if (rotate) {
            style.transform = `rotate(${rotate}deg)`;
            style.justifyContent = rotate > 0 ? 'flex-start' : 'flex-end';
            style.height = 'fit-content';
        }
        return style
    }
    return (
        <div className="aio-chart-axis aio-chart-horizontal-axis" style={getAxisStyle()}>
            <div className="aio-chart-cursor-label-container aio-chart-cursor-label-container-v" ref={curvl}>
                <div className="aio-chart-cursor-label aio-chart-cursor-label-v"></div>
            </div>
            <div className="aio-chart-horizontal-labels" style={getLabelsStyle()}>
                {
                    xLabels.map((o, i) => {
                        return (
                            <div key={i} className="aio-chart-horizontal-label" style={getLabelStyle(o)}>
                                <div className="aio-chart-horizontal-label-text" data-rotated={rotate ? 'yes' : 'no'}>{o.label}</div>
                            </div>
                        )
                    })
                }
            </div>
            {
                !!zoom &&
                <AISlider
                    multiple={true} size={0}
                    style={{ background: 'none' }}
                    start={xAxis.start} end={xAxis.end}
                    value={[...filter.x]}
                    onChange={(v) => changeFilter('x', v)}
                    fill={() => {
                        return {
                            thickness: 16,
                            style: { opacity: 0.2 }
                        }
                    }}
                    point={(index, p) => {
                        const { value } = p;
                        const label = getLabel(value)
                        return {
                            html: (
                                <div className="aio-chart-horizontal-filter-value">{label}</div>
                            ),
                            attrs: {
                                style: { background: 'red' },
                                onMouseDown: () => { setFilterMouseDownRef(true) },
                                onMouseUp: () => { setFilterMouseDownRef(false) }
                            }
                        }
                    }}
                />
            }
        </div>
    )
}

const YLabels: FC<{ yLabels: I_chart_label_detail[], curhl: any }> = ({ yLabels, curhl }) => {
    const { rootProps }: I_ctx = useContext(ChartCtx)
    const { yAxis } = rootProps
    const { size } = yAxis;
    function getAxisStyle() { return { width: size } }
    function getLabelsStyle() {
        let style: any = {}
        return style
    }
    function getLabelStyle(labelDetail: I_chart_label_detail) {
        let style: any = { bottom: labelDetail.offset }
        return style
    }
    return (
        <div className="aio-chart-axis aio-chart-vertical-axis" style={getAxisStyle()}>
            <div className="aio-chart-cursor-label-container aio-chart-cursor-label-container-h" ref={curhl}>
                <div className="aio-chart-cursor-label aio-chart-cursor-label-h"></div>
            </div>
            <div className="aio-chart-vertical-labels" style={getLabelsStyle()}>
                {
                    yLabels.map((o, i) => {
                        return (
                            <div key={i} className="aio-chart-vertical-label" style={getLabelStyle(o)}>
                                {o.label}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
type I_pieRange_style = { thickness?: number, offset?: number, roundCap?: boolean, color: string }
type I_pieRange = {
    value: number,
    style?: I_pieRange_style
}
export const Pie: FC<{ start: number, end: number, ranges: I_pieRange[], rangeStyle?: Omit<I_pieRange_style, 'color'> }> = ({ start, end, ranges, rangeStyle = {} }) => {
    function getRange(r: I_pieRange): [value: number, config: I_rangeConfig] {
        const { value, style } = r;
        const { thickness = 12, offset = 0, roundCap = false, color = '#000' } = { ...rangeStyle, ...style };
        return [value, { thickness, offset, roundCap, color }]
    }
    return (
        <AISpinner
            start={start}
            end={end}
            ranges={ranges.map((o) => getRange(o))}
        />
    )
}
type I_ChartData = { getFilter: () => I_filter, getProps: () => I_Chart }
class ChartData {
    p: I_ChartData
    xDic:{[key:string]:{ys:number[],labels:{color:string,label:ReactNode}[]}} = {};
    constructor(p: I_ChartData) {
        this.p = p
    }
    getDataDetails = (datas: I_chart_data[], size: I_chart_size): I_chart_data_detail[] => {
        let dataDetails: I_chart_data_detail[] = []
        const barCount = datas.filter((data) => data.type === 'bar').length;
        let barIndex = -1;
        this.xDic = {}
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            const { type, getPointText, getRanges = () => { return undefined }, areaColors,color:dataColor = '#000' } = data;
            if (type === 'bar') { barIndex++; }
            let dataDetail: I_chart_data_detail = { points: [], type, lineStyle: this.getDefaultLineStyle(data), getPointText, barCount, barIndex, areaPoints: [], areaColors }
            const filteredPoints = this.getFilteredPoints(data)
            for (let j = 0; j < filteredPoints.length; j++) {
                const { point, x, y } = filteredPoints[j];
                const xDetail = this.getPointDetail({axis:'x',data, value:x, size})
                const yDetail = this.getPointDetail({axis:'y',data, value:y, size})
                const pointDetail: I_chart_point_detail = {
                    x: { ...xDetail},
                    y: { ...yDetail},
                    pointStyle: this.getDefaultPointStyle(data, point),
                    rangeDetails: this.getRanges(data,getRanges,point,size),
                }
                this.addPosition(pointDetail,dataColor)
                if (areaColors) { dataDetail.areaPoints.push([pointDetail.x.offset, pointDetail.y.offset]) }
                dataDetail.points.push(pointDetail)
            }
            if (areaColors) { dataDetail.areaPoints = [[dataDetail.areaPoints[0][0], 0], ...dataDetail.areaPoints, [dataDetail.areaPoints[dataDetail.areaPoints.length - 1][0], 0]] }
            dataDetails.push(dataDetail)
        }
        console.log(this.xDic)
        return dataDetails
    }
    addPosition = (pointDetail:I_chart_point_detail,color:string)=>{
        const {offset:x} = pointDetail.x;
        const {offset:y,label} = pointDetail.y;
        const key = x.toString();
        this.xDic[key] = this.xDic[key] || {ys:[],labels:[]}
        this.xDic[key].ys.push(y);
        this.xDic[key].labels.push({color,label});                
    }
    getTooltip = (x:number,y:number):{y:number,labels:{color:string,label:ReactNode}[]}=>{
        const det = this.xDic[x.toString()]
        if(!det){return {y:0,labels:[]}}
        let res = {y:0,labels:det.labels},min = Infinity;
        for(let i = 0; i < det.ys.length; i++){
            if(Math.abs(det.ys[i] - y) < min){
                res.y = det.ys[i];
                min = det.ys[i];
            }
        }
        return res
    }
    getRanges = (data:I_chart_data,getRanges:any,point:any,size:I_chart_size) => {
        const ranges = getRanges(point);
        if(!ranges){return []}
        const res:any = []
        if (ranges) {
            let lastValue = 0;
            for (let k = 0; k < ranges.length; k++) {
                let [value, color] = ranges[k];
                const { offset: startOffset } = this.getPointDetail({axis:'y', value:lastValue, size})
                const { offset: endOffset } = this.getPointDetail({axis:'y',value, size})
                res.push({ offset: startOffset, height: endOffset - startOffset, color });
                lastValue = value;
            }
        }
        return res
    }
    getDefaultLineStyle = (data: I_chart_data): I_chart_line_style => {
        const { getLineStyle = (() => ({})) } = data;
        const lineStyle: I_chart_line_style = getLineStyle() || {};
        const { lineWidth = 1, dash, stroke = '#333' } = lineStyle
        return { lineWidth, dash, stroke }
    }
    getDefaultPointStyle = (data: I_chart_data, point: any): I_chart_point_style | undefined => {
        const { getPointStyle } = data;
        if (!getPointStyle) { return }
        const pointStyle: I_chart_point_style = getPointStyle(point) || {};
        const { lineWidth = 1, r = 4, dash, stroke = data.type === 'line' ? '#333' : undefined, fill = data.type === 'line' ? '#fff' : '#333' } = pointStyle
        return { lineWidth, r, dash, stroke, fill }
    }
    getFilteredPoints = (data: I_chart_data) => {
        const { points } = data;
        const filter = this.p.getFilter()
        const newPoints: any[] = []
        for (let i = 0; i < points.length; i++) {
            const point = points[i]
            const x = data.getX(point), y = data.getY(point);
            if (x < filter.x[0]) { continue }
            if (x > filter.x[1]) { continue }
            if (y < filter.y[0]) { continue }
            if (y > filter.y[1]) { continue }
            newPoints.push({ x, y, point })
        }
        return newPoints
    }
    getPointDetail = (p:{axis: 'x' | 'y',data?:I_chart_data, value: number, size: I_chart_size}): { percent: number, offset: number, label: string,value:number,size:number } => {
        const filter = this.p.getFilter()
        const props = this.p.getProps();
        const { padding = p.axis === 'x' ? [36, 36] : [0, 0] } = props[`${p.axis}Axis`];
        const f = filter[p.axis];
        const start = f[0], end = f[1];
        const percent = GetPercentByValue(start, end, p.value);
        const avilSize = p.size[p.axis] - (padding[0] + padding[1])
        const offset = padding[0] + avilSize * percent / 100;
        let size = 0;
        if(p.axis === 'x'){
            size = p.data && p.data.type === 'bar'?this.getBarWidth(p.data, p.size):0
        }
        else {
            size = -offset
        }
        return { percent, offset, label: props[`${p.axis}Axis`].getLabel(p.value) ,value:p.value,size}
    }
    getBarWidth = (data: I_chart_data, size: I_chart_size) => {
        const props = this.p.getProps()
        const { datas } = this.p.getProps()
        const { padding: xPadding = [36, 36] } = props.xAxis;
        const barCount = datas.filter((data) => data.type === 'bar').length
        const pointsLength = data.points.length;
        let avilableWidth = size.x - (xPadding[0] + xPadding[1]);
        const gap = avilableWidth / pointsLength / 2;
        avilableWidth -= (pointsLength - 1) * gap;
        return avilableWidth / pointsLength / barCount
    }
}