import { createContext, createRef, FC, MutableRefObject, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { AddToAttrs, GetArray, GetPercentByValue } from "../aio-utils";
import Canvas from './../../npm/aio-canvas';
import { I_canvas_item, I_canvas_props } from "../aio-canvas/types";
import $ from 'jquery';
import './index.css';
import { AI_point, AISlider, AISpinner, I_rangeConfig } from "../aio-input";
const ChartCtx = createContext({} as any)
type I_chart_range = [number, string][]
type I_chart_label = { offset: number, text: ReactNode }
type I_chart_size = { x: number, y: number }
type I_chart_axis = { start: number, end: number, size: number, padding?: number[], getLabel: (v: number) => string, rotate?: number, gridLineColor?: string, zoom?: boolean }
type I_chart_label_detail = { text: ReactNode, offset: number }
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
    key:number,value:number,
    keyOffset:number,valueOffset:number,
    keyPercent:number,valuePercent:number,
    keyText:ReactNode,valueText:ReactNode,
    keyBarSize:number,
    valueBarSize:number,
    pointStyle?: I_chart_point_style, rangeDetails: I_rangeDetail[]
}
type I_getPointText = (point: I_chart_point_detail) => {
    text: string,
    style?: { fontSize?: number, rotate?: number, fill?: string, offset?: number }
} | undefined
type I_chart_data = {
    color?: string,
    title?: string,
    points: any[],
    getKey: (point: any) => number,
    getValue: (point: any) => number,
    getRanges?: (point: any) => I_chart_range | undefined,
    getPointStyle?: I_getPointStyle,
    getLineStyle?: I_getLineStyle,
    getPointText?: I_getPointText,
    type: 'line' | 'bar',
    areaColors?: [string, string]
}
export type I_Chart = {
    datas: I_chart_data[],
    keyAxis: I_chart_axis,
    valueAxis: I_chart_axis,
    attrs?: any,
    reverse?:boolean
}
type I_filter = number[]
type I_ctx = {
    rootProps: I_Chart,dic:I_dic,
    changeFilter: (newFilter: number[]) => void,
    filter: I_filter, setFilterMouseDownRef: (v: boolean) => void, getFilterMouseDownRef: () => boolean
}
type I_dic = {x:'key' | 'value',y:'key' | 'value',key:'x' | 'y',value:'x' | 'y'}
const Chart: FC<I_Chart> = (props) => {
    const propsRef = useRef(props)
    propsRef.current = props;
    const [aio_chart_ref] = useState<any>(createRef())
    const [canvas] = useState<Canvas>(new Canvas())
    const [canvasItems, setCanvasItems] = useState<I_canvas_item[]>([])
    const dataDetailsRef = useRef<I_chart_data_detail[]>([])
    const labelDetailsRef = useRef<{ key: I_chart_label_detail[], value: I_chart_label_detail[] }>({ key: [], value: [] })
    const chartSizeRef = useRef<any>()
    let [filter, setFilter] = useState<I_filter>([props.keyAxis.start, props.keyAxis.end])
    const filterRef = useRef(filter)
    filterRef.current = filter
    const [dic] = useState<I_dic>(getDic)
    function getDic():I_dic{
        if(props.reverse){return {x:'value',y:'key',key:'y',value:'x'}}
        else {return {x:'key',y:'value',key:'x',value:'y'}}
    }
    const [chartClass] = useState<ChartData>(new ChartData({
        getFilter: () => filterRef.current,
        getProps: () => propsRef.current,
        getChartSize: () => chartSizeRef.current,
        dic
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
    function changeFilter(newFilter: number[]) {
        filter = newFilter
        setFilter(newFilter)
        update();
    }
    function updateLabels() {
        clearTimeout(timeout1)
        timeout1 = setTimeout(() => {
            let aio_chart = $(aio_chart_ref.current);
            let labels = aio_chart.find('.aio-chart-horizontal-label-text');
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
    function clientSizeToCanvasSize(dir: 'x' | 'y') {
        if (dir === 'x') {
            const bottom = canvas.clientToCanvas([0, 0])[1];
            const top = canvas.clientToCanvas([0, chartSizeRef.current[dir as any === 'x' ? 'y' : 'x']])[1]
            return top - bottom
        }
        else {
            const left = canvas.clientToCanvas([0, 0])[0];
            const right = canvas.clientToCanvas([chartSizeRef.current[dir as any === 'x' ? 'y' : 'x'], 0])[0]
            return right - left
        }
    }
    function getGridLines(dir: 'x' | 'y'): I_canvas_item[] {
        const { gridLineColor = dir === 'y' ? '#ddd' : undefined } = props[`${dic[dir]}Axis`]
        if (!gridLineColor) { return [] }
        const csize: number = clientSizeToCanvasSize(dir)
        const color = 'red';
        if (!color) { return [] }
        const d = dic[dir];
        const labels = labelDetailsRef.current[d];
        const gridLines: I_canvas_item[] = [];
        for (let i = 0; i < labels.length; i++) {
            const { offset } = labels[i];
            if (dir === 'y') {
                gridLines.push({ type: 'Line', points: [[0, offset], [csize, offset]], stroke: gridLineColor })
            }
            else {
                gridLines.push({ type: 'Line', points: [[offset, 0], [offset, csize]], stroke: gridLineColor })
            }
        }
        return gridLines;
    }
    function getKeyLabelsDetail(): I_chart_label_detail[] {
        const res: I_chart_label_detail[] = [];
        const start = filter[0], end = filter[1];
        for (let key = start; key <= end; key++) {
            const { offset, text } = chartClass.getPointDetail({ d: 'key', value: key })
            res.push({ offset, text })
        }
        return res
    }
    function getValueLabelsDetail(size: I_chart_size) {
        const {start,end} = props.valueAxis;
        let step = (end - start) / 10;
        const magnitude = Math.pow(10, Math.floor(Math.log10(step)));
        step = Math.round(step / magnitude) * magnitude;
        if (size[dic.value] < 240) { step *= 2 }
        const labels: I_chart_label_detail[] = [];
        for (let i = start; i <= end; i += step) {
            const { offset, text } = chartClass.getPointDetail({ d: 'value', value: +i.toFixed(3) })
            labels.push({ offset, text });
        }
        return labels;
    }

    function getElements(dataDetails: I_chart_data_detail[]) {
        let lines: I_canvas_item[] = [], points: I_canvas_item[] = [], rects: I_canvas_item[] = [], texts: I_canvas_item[] = [], areas: I_canvas_item[] = [];
        for (let i = 0; i < dataDetails.length; i++) {
            const detail = dataDetails[i];
            if (detail.type === 'line') {
                const { pointElements, lineElement, textElements, areaElement } = getLineChartElements(detail)
                lines.push(lineElement)
                if (areaElement) { areas.push(areaElement) }
                texts = [...texts, ...textElements];
                points = [...points, ...pointElements]
            }
            else {
                rects = [...rects, ...getBarChartElements(detail)]
            }
        }
        const gridLines = getGridLines('y')
        return [...gridLines, ...areas, ...rects, ...lines, ...points, ...texts]
    }
    function getLineChartElements(detail: I_chart_data_detail): {
        pointElements: I_canvas_item[], lineElement: I_canvas_item, textElements: I_canvas_item[], areaElement?: I_canvas_item
    } {
        const { lineWidth, dash, stroke } = detail.lineStyle;
        const pointElements: I_canvas_item[] = []
        const textElements: I_canvas_item[] = [];
        const lineElement: I_canvas_item = { points: [], type: "Line", lineWidth, dash, stroke };
        const areaElement: I_canvas_item | undefined = detail.areaColors ? getArea(detail.areaPoints, detail.areaColors) : undefined
        for (let i = 0; i < detail.points.length; i++) {
            const p = detail.points[i];
            const xOffset = p[`${dic.x}Offset`];
            const yOffset = p[`${dic.y}Offset`];
            (lineElement.points as any).push([xOffset, yOffset])
            if (p.pointStyle) { pointElements.push({ type: 'Arc', x: xOffset, y: yOffset, ...p.pointStyle }) }
            const text = detail.getPointText ? detail.getPointText(p) : undefined
            if (text) {
                const style = text.style || {}
                const { fontSize = 12, offset = 12, fill = '#000', rotate = 0 } = style
                textElements.push({ type: 'Text', text: text.text, x: xOffset, y: yOffset + offset, fontSize, rotate, fill, align: [0, 1] })
            }
        }
        return { pointElements, lineElement, textElements, areaElement }
    }
    function getBarChartElements(detail: I_chart_data_detail): I_canvas_item[] {
        const rectElements: I_canvas_item[] = []
        for (let i = 0; i < detail.points.length; i++) {
            const p = detail.points[i];
            const step = (p.keyBarSize * detail.barCount) / (detail.barCount * 2);
            const start = p.keyOffset - (p.keyBarSize * detail.barCount / 2);
            const keyOffset = start + (step * detail.barIndex * 2)
            if (p.rangeDetails.length) {
                for (let i = 0; i < p.rangeDetails.length; i++) {
                    const { offset, height, color } = p.rangeDetails[i];
                    rectElements.push({ type: 'Rectangle', x: keyOffset, y: offset, width: p.keyBarSize, height, ...{ ...p.pointStyle, fill: color } })
                }
            }
            else {
                const obj:any = { type: 'Rectangle', [props.reverse?'y':'x']: keyOffset, [props.reverse?'x':'y']: p.valueOffset, [props.reverse?'height':'width']: p.keyBarSize, [props.reverse?'width':'height']: p.valueBarSize, ...p.pointStyle }
                rectElements.push(obj)
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
    function getCornerStyle() { return { width: props[`${dic.y}Axis`].size, height: props[`${dic.x}Axis`].size } }
    function update() {
        const aio_chart = $(aio_chart_ref.current);
        const canvasElement = aio_chart.find('canvas');
        const size: I_chart_size = { x: canvasElement.width(), y: canvasElement.height() }
        chartSizeRef.current = size
        const dataDetails = chartClass.getDataDetails(props.datas);
        labelDetailsRef.current = { key: getKeyLabelsDetail(), value: getValueLabelsDetail(size) }
        dataDetailsRef.current = dataDetails;
        const items = getElements(dataDetails);
        setCanvasItems(items);
        setTimeout(() => updateLabels(), 5)
    }
    function getArea(areaPoints: number[][], areaColor: [string, string]): I_canvas_item {
        return { type: 'Line', points: areaPoints, fill: [0, 0, 0, -chartSizeRef.current.y, ['0 ' + areaColor[0], '1 ' + areaColor[1]]] as any };
    }
    function getLabelByCanvasPosition_axis(dir: 'x' | 'y', value: number): I_chart_label {
        const chartSize = chartSizeRef.current[dir];
        const Axis = props[`${dic[dir]}Axis`];
        const d = dic[dir];
        const { padding = dir === 'x' ? [36, 36] : [0, 0], getLabel = (v) => v } = Axis;
        const start = dic[dir] === 'key' ? filter[0] : Axis.start
        const end = dic[dir] === 'key' ? filter[1] : Axis.end
        if (value < padding[0]) { return labelDetailsRef.current[d][start] }
        if (value > chartSize - padding[1]) { return labelDetailsRef.current[d][end] }
        const step: number = (chartSize - (padding[0] + padding[1])) / (end - start)
        const index = Math.round((value - padding[0]) / step);
        const text = getLabel(index);
        const offset = d === 'key' ? labelDetailsRef.current[d][index].offset : value
        return { text, offset }
    }
    function getLabelByCanvasPosition(canvasPos: [number, number]): { x: I_chart_label, y: I_chart_label } {
        return {
            x: getLabelByCanvasPosition_axis('x', canvasPos[0]),
            y: getLabelByCanvasPosition_axis('y', canvasPos[1])
        }
    }
    useEffect(() => { update() }, [])
    function getContext(): I_ctx {
        return {
            rootProps: props,dic,
            changeFilter, filter, setFilterMouseDownRef, getFilterMouseDownRef
        }
    }
    const attrs = AddToAttrs(props.attrs, { className: 'aio-chart', attrs: { ref: aio_chart_ref } })
    function renderCanvas() {
        return canvas.render({
            items: canvasItems,
            //grid: [10, 10, '#eee'], 
            screenPosition: ['50%', '50%'],
            attrs: {
                onMouseMove: ({ mousePosition }) => {
                    if (chartSizeRef.current === undefined) { return }
                    const container = $(aio_chart_ref.current)
                    const { x, y } = mousePosition
                    const { x: xLabel, y: yLabel } = getLabelByCanvasPosition([x, y])
                    chartClass.updateTooltip(xLabel, yLabel, container)
                    chartClass.updateCursor(container, xLabel, yLabel, [x, y])
                },
                onMouseLeave: () => {
                    const container = $(aio_chart_ref.current)
                    chartClass.removeElements(container)
                }
            }
        })
    }
    return (
        <ChartCtx.Provider value={getContext()}>
            <div {...attrs}>
                <div className="aio-chart-top">
                    <YLabels labelDetails={labelDetailsRef.current[dic.y]} />
                    <div className="aio-chart-canvas-container">
                        {renderCanvas()}
                        <CursorLines/>
                        <div className="aio-chart-tooltip-container"></div>
                    </div>
                </div>
                <div className="aio-chart-bottom">
                    <div className="aio-chart-corner" style={getCornerStyle()}></div>
                    <XLabels labelDetails={labelDetailsRef.current[dic.x]} />
                </div>
            </div>
        </ChartCtx.Provider>
    )
}
export { Chart }
const XLabels: FC<{ labelDetails: I_chart_label_detail[] }> = ({ labelDetails }) => {
    const { rootProps, filter, changeFilter, setFilterMouseDownRef,dic }: I_ctx = useContext(ChartCtx)
    const Axis = rootProps[`${dic.x}Axis`]
    const { rotate, size, getLabel = (v) => v, zoom } = Axis;
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
            <CursorLabel axis='y'/>
            <div className="aio-chart-horizontal-labels" style={getLabelsStyle()}>
                {
                    labelDetails.map((o, i) => {
                        return (
                            <div key={i} className="aio-chart-horizontal-label" style={getLabelStyle(o)}>
                                <div className="aio-chart-horizontal-label-text" data-rotated={rotate ? 'yes' : 'no'}>{o.text}</div>
                            </div>
                        )
                    })
                }
            </div>
            {
                !!zoom && dic.key === 'x' &&
                <AISlider
                    multiple={true} size={0}
                    style={{ background: 'none' }}
                    start={Axis.start} end={Axis.end}
                    value={[...filter]}
                    onChange={(v) => changeFilter(v)}
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

const YLabels: FC<{ labelDetails: I_chart_label_detail[] }> = ({ labelDetails }) => {
    const { rootProps,dic }: I_ctx = useContext(ChartCtx)
    const Axis = rootProps[`${dic.y}Axis`]
    const { size } = Axis;
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
            <CursorLabel axis='x'/>
            <div className="aio-chart-vertical-labels" style={getLabelsStyle()}>
                {
                    labelDetails.map((o, i) => {
                        return (
                            <div key={i} className="aio-chart-vertical-label" style={getLabelStyle(o)}>
                                {o.text}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
const CursorLabel: FC<{axis:'x' | 'y'}> = ({axis}) => {
    return (
        <div className={`aio-chart-cursor-label-container aio-chart-cursor-label-container-${axis}`}>
            <div className={`aio-chart-cursor-label aio-chart-cursor-label-${axis}`}></div>
        </div>
    )
}
const CursorLines:FC = ()=>{
    return (
        <>
            <div className="aio-chart-cursor-line aio-chart-cursor-line-x"></div>
            <div className="aio-chart-cursor-line aio-chart-cursor-line-y"></div>
        </>
    )
}  
type I_pieRange_style = { thickness?: number, offset?: number, roundCap?: boolean, color: string }
type I_pieRange = {
    value: number,
    thickness?:number,
    offset?:number,
    roundCap?:boolean,
    color:string
}
type I_Pie = { 
    start: number, 
    size?:number,
    end: number, 
    ranges: I_pieRange[],
    empty?:Omit<I_pieRange,'value'>,
    thickness?:number,
    offset?:number,
    roundCap?:boolean,
    rangeStyle?: I_pieRange_style 
}
export const Pie: FC<I_Pie> = (props) => {
    function getRange(r: I_pieRange): [value: number, config: I_rangeConfig] {
        const { 
            value,
            thickness = props.thickness || 12, 
            offset = props.offset || 0, 
            roundCap = props.roundCap || false, 
            color 
        } = r;
        return [value, { thickness, offset, roundCap, color }]
    }
    function getRanges(){
        const {end,ranges} = props;
        const res = ranges.map((o) => getRange(o))
        if(props.empty && ranges[ranges.length - 1].value < end){
            res.push(getRange({...props.empty,value:end}))
        }
        return res
    }
    return (
        <AISpinner
            size={props.size}
            start={props.start}
            end={props.end}
            ranges={getRanges()}
            handle={false}
            point={false}
            style={{border:'none'}}
        />
    )
}
type I_chart_tooltip = { tooltipY: number, tooltipPoints: { color: string, text: ReactNode }[] }
type I_ChartData = { getFilter: () => I_filter, getProps: () => I_Chart, getChartSize: () => { x: number, y: number },dic:I_dic }
class ChartData {
    p: I_ChartData
    tooltipDic: { [key: string]: { ys: number[], labels: { color: string, text: ReactNode }[] } } = {};
    constructor(p: I_ChartData) {
        this.p = p
    }
    getDataDetails = (datas: I_chart_data[]): I_chart_data_detail[] => {
        const dic = this.p.dic
        let dataDetails: I_chart_data_detail[] = []
        const barCount = datas.filter((data) => data.type === 'bar').length;
        let barIndex = -1;
        this.tooltipDic = {}
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            const { type, getPointText, getRanges = () => { return undefined }, areaColors, color: dataColor = '#000' } = data;
            if (type === 'bar') { barIndex++; }
            let dataDetail: I_chart_data_detail = { points: [], type, lineStyle: this.getDefaultLineStyle(data), getPointText, barCount, barIndex, areaPoints: [], areaColors }
            const filteredPoints = this.getFilteredPoints(data)
            for (let j = 0; j < filteredPoints.length; j++) {
                const fp = filteredPoints[j];
                const {percent:keyPercent,offset:keyOffset,text:keyText,barSize:keyBarSize} = this.getPointDetail({ d: 'key', data, value: fp.key })
                const {percent:valuePercent,offset:valueOffset,text:valueText,barSize:valueBarSize} = this.getPointDetail({ d: 'value', data, value: fp.value })
                const pointDetail: I_chart_point_detail = {
                    key:fp.key,value:fp.value,
                    keyPercent,valuePercent,
                    keyOffset,valueOffset,
                    keyText,valueText,
                    keyBarSize,valueBarSize,
                    pointStyle: this.getDefaultPointStyle(data, fp.point),
                    rangeDetails: this.getRanges(data, getRanges, fp.point),
                }
                this.addPosition(pointDetail, dataColor)
                if (areaColors) { dataDetail.areaPoints.push([pointDetail[`${dic.x}Offset`], pointDetail[`${dic.y}Offset`]]) }
                dataDetail.points.push(pointDetail)
            }
            if (areaColors) { dataDetail.areaPoints = [[dataDetail.areaPoints[0][0], 0], ...dataDetail.areaPoints, [dataDetail.areaPoints[dataDetail.areaPoints.length - 1][0], 0]] }
            dataDetails.push(dataDetail)
        }
        console.log(this.tooltipDic)
        return dataDetails
    }
    addPosition = (pointDetail: I_chart_point_detail, color: string) => {
        const { keyOffset: x,valueOffset: y, valueText:text } = pointDetail;
        const key = x.toString();
        this.tooltipDic[key] = this.tooltipDic[key] || { ys: [], labels: [] }
        this.tooltipDic[key].ys.push(y);
        this.tooltipDic[key].labels.push({ color, text });
    }
    getTooltip = (x: number, y: number): I_chart_tooltip => {
        const det = this.tooltipDic[x.toString()]
        if (!det) { return { tooltipY: 0, tooltipPoints: [] } }
        let res: I_chart_tooltip = { tooltipY: 0, tooltipPoints: det.labels }, min = Infinity;
        for (let i = 0; i < det.ys.length; i++) {
            if (Math.abs(det.ys[i] - y) < min) {
                res.tooltipY = det.ys[i];
                min = det.ys[i];
            }
        }
        return res
    }
    updateTooltip = (xLabel: I_chart_label, yLabel: I_chart_label, container: any) => {
        const { tooltipY, tooltipPoints } = this.getTooltip(xLabel.offset, yLabel.offset)
        const html = (
            `
                <div class="aio-chart-tooltip">
                    <div class="aio-chart-tooltip-title">${xLabel.text}</div>
                    ${tooltipPoints.map(({ text, color }) => {
                return (
                    `
                        <div class='aio-chart-tooltip-item'>
                            <div style="width:10px;height:10px;background:${color}"></div>
                            <div>${text}</div>
                        </div>
                    `
                )
            })
            }
                    <div class="aio-chart-tooltip-arrow"></div>
                </div>
            `
        )
        const tooltipElement = container.find('.aio-chart-tooltip-container');
        tooltipElement.css({ left: xLabel.offset, bottom: tooltipY, display: 'flex' })
        tooltipElement.html(html)
    }
    updateCursor = (container: any, xLabel: I_chart_label, yLabel: I_chart_label, canvasPos: [number, number]) => {
        container.find('.aio-chart-cursor-label-y').html(xLabel.text)
        container.find('.aio-chart-cursor-label-x').html(yLabel.text)
        container.find('.aio-chart-cursor-label-container-y').css({ left: canvasPos[0], display: 'flex' });
        container.find('.aio-chart-cursor-label-container-x').css({ bottom: canvasPos[1], display: 'flex' });
        container.find('.aio-chart-cursor-line-x').css({ bottom: canvasPos[1], display: 'block' })
        container.find('.aio-chart-cursor-line-y').css({ left: canvasPos[0], display: 'block' })
    }
    removeElements = (container: any) => {
        container.find('.aio-chart-cursor-line').css({ display: 'none' })
        container.find('.aio-chart-cursor-label-container').css({ display: 'none' })
        container.find('.aio-chart-tooltip-container').css({ display: 'none' })
    }
    getRanges = (data: I_chart_data, getRanges: any, point: any) => {
        const ranges = getRanges(point);
        if (!ranges) { return [] }
        const res: any = []
        if (ranges) {
            let lastValue = 0;
            for (let k = 0; k < ranges.length; k++) {
                let [value, color] = ranges[k];
                const { offset: startOffset } = this.getPointDetail({ d: 'value', value: lastValue })
                const { offset: endOffset } = this.getPointDetail({ d: 'value', value })
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
    getFilteredPoints = (data: I_chart_data):{key:number,value:number,point:any}[] => {
        const { points } = data;
        const filter = this.p.getFilter()
        const newPoints = []
        for (let i = 0; i < points.length; i++) {
            const point = points[i]
            const key = data.getKey(point), value = data.getValue(point);
            if (key < filter[0]) { continue }
            if (key > filter[1]) { continue }
            newPoints.push({ key, value, point })
        }
        return newPoints
    }
    getPointDetail = (p: { d: 'key' | 'value', data?: I_chart_data, value: number }): { percent: number, offset: number, text: ReactNode, barSize: number } => {
        const filter = this.p.getFilter()
        const props = this.p.getProps();
        const Axis = props[`${p.d}Axis`]
        const dir = this.p.dic[p.d]
        const { padding = p.d === 'key' ? [36, 36] : [0, 0] } = Axis;
        const f = p.d === 'key'?filter:[Axis.start,Axis.end];
        const start = f[0], end = f[1];
        const percent = GetPercentByValue(start, end, p.value);
        const avilSize = this.p.getChartSize()[dir] - (padding[0] + padding[1])
        const offset = padding[0] + avilSize * percent / 100;
        let barSize = 0;
        if (p.d === 'key') {
            barSize = p.data && p.data.type === 'bar' ? this.getBarWidth(p.data) : 0
        }
        else {
            barSize = -offset
        }
        return { percent, offset, text: Axis.getLabel(p.value), barSize }
    }
    getBarWidth = (data: I_chart_data) => {
        const dir = this.p.dic.key
        const props = this.p.getProps()
        const { datas } = this.p.getProps()
        const Axis = props.keyAxis
        const { padding = [36, 36] } = Axis;
        const barCount = datas.filter((data) => data.type === 'bar').length
        const pointsLength = data.points.length;
        let avilableWidth = this.p.getChartSize()[dir] - (padding[0] + padding[1]);
        const gap = avilableWidth / pointsLength / 2;
        avilableWidth -= (pointsLength - 1) * gap;
        return avilableWidth / pointsLength / barCount
    }
}