import { createContext, createRef, FC, MutableRefObject, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { GetPercentByValue } from "../aio-utils";
import Canvas from './../../npm/aio-canvas';
import { I_canvas_item, I_canvas_props } from "../aio-canvas/types";
import $ from 'jquery';
import './index.css';
import { AI_point, AISlider } from "../aio-input";
const ChartCtx = createContext({} as any)
type I_chart_size = { x: number, y: number }
type I_chart_axis = { start: number, step: number, end: number, size: number, padding?: number[], getLabel: (v: number) => string, rotate?: number, gridLineColor?: string, zoom?: boolean }
type I_chart_label_detail = { label: ReactNode, offset: number }
type I_getPointStyle = (point: any) => I_chart_point_style;
type I_getLineStyle = () => I_chart_line_style
type I_chart_point_style = { lineWidth?: number, r?: number, dash?: number[], stroke?: string, fill?: string }
type I_chart_line_style = { lineWidth?: number, dash?: number[], stroke?: string }
type I_chart_data_detail = { 
    points: I_chart_point_detail[], type: 'line' | 'bar', lineStyle: I_chart_line_style,getPointText?:I_getPointText,
    barCount:number,barIndex:number
}
type I_chart_point_detail = {
    x: { value: number, percent: number, offset: number, label: ReactNode, size: number },
    y: { value: number, percent: number, offset: number, label: ReactNode, size: number },
    pointStyle: I_chart_point_style,
}
type I_getPointText = (point:I_chart_point_detail)=>{
    text:string,
    style?:{fontSize?:number,rotate?:number,fill?:string,offset?:number}
} | undefined
type I_chart_data = {
    points: any[], getX: (point: any) => number, getY: (point: any) => number,
    getPointStyle?: I_getPointStyle,
    getLineStyle?: I_getLineStyle,
    getPointText?:I_getPointText,
    type: 'line' | 'bar'
}
export type I_Chart = {
    datas: I_chart_data[],
    xAxis: I_chart_axis,
    yAxis: I_chart_axis,
}
type I_filter = { x: number[], y: number[] }
type I_ctx = {
    rootProps: I_Chart,
    changeFilter: (axis: 'x' | 'y', newFilter: number[]) => void,
    filter: I_filter
}
const Chart: FC<I_Chart> = (props) => {
    const [dom] = useState<any>(createRef())
    const [canvas] = useState<Canvas>(new Canvas())
    const [canvasItems, setCanvasItems] = useState<I_canvas_item[]>([])
    const dataDetailsRef = useRef<I_chart_data_detail[]>([])
    const xLabelsRef = useRef<I_chart_label_detail[]>([])
    const yLabelsRef = useRef<I_chart_label_detail[]>([])
    let [filter, setFilter] = useState<I_filter>({ x: [props.xAxis.start, props.xAxis.end], y: [props.yAxis.start, props.yAxis.end] })
    function changeFilter(axis: 'x' | 'y', newFilter: number[]) {
        const stateFilter = { ...filter, [axis]: newFilter };
        filter = stateFilter
        setFilter(filter)
        update();
    }
    function getDefaultPointStyle(data: I_chart_data, point: any): I_chart_point_style {
        const { getPointStyle = (() => ({})) } = data;
        const pointStyle: I_chart_point_style = getPointStyle(point) || {};
        const { lineWidth = 1, r = 4, dash, stroke = data.type === 'line' ? '#333' : undefined, fill = data.type === 'line' ? '#fff' : '#333' } = pointStyle
        return { lineWidth, r, dash, stroke, fill }
    }
    function getDefaultLineStyle(data: I_chart_data): I_chart_line_style {
        const { getLineStyle = (() => ({})) } = data;
        const lineStyle: I_chart_line_style = getLineStyle() || {};
        const { lineWidth = 1, dash, stroke = '#333' } = lineStyle
        return { lineWidth, dash, stroke }
    }
    function getBarWidth(datas:I_chart_data[],data: I_chart_data, size: I_chart_size) {
        const { padding: xPadding = [36, 36] } = props.xAxis;
        const barCount = datas.filter((data)=>data.type === 'bar').length
        const pointsLength = data.points.length;
        let avilableWidth = size.x - (xPadding[0] + xPadding[1]);
        const gap = avilableWidth / pointsLength / 2;
        avilableWidth -= (pointsLength - 1) * gap;
        return avilableWidth / pointsLength / barCount
    }
    function getFilteredPoints(data: I_chart_data) {
        const { points } = data;
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
    function getDataDetails(datas: I_chart_data[], size: I_chart_size): I_chart_data_detail[] {
        let dataDetails: I_chart_data_detail[] = []
        const barCount = datas.filter((data)=>data.type === 'bar').length;
        let barIndex = -1;
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            if(data.type === 'bar'){barIndex++;}
            let dataDetail: I_chart_data_detail = { points: [], type: data.type, lineStyle: getDefaultLineStyle(data),getPointText:data.getPointText,barCount,barIndex }
            const filteredPoints = getFilteredPoints(data)
            for (let j = 0; j < filteredPoints.length; j++) {
                const { point, x, y } = filteredPoints[j];
                const xOffset = getPointDetail('x', x, size)
                const yOffset = getPointDetail('y', y, size)
                const pointDetail: I_chart_point_detail = {
                    x: { ...xOffset, size: getBarWidth(datas,data, size), value: x },
                    y: { ...yOffset, size: -yOffset.offset, value: y },
                    pointStyle: getDefaultPointStyle(data, point)
                }
                dataDetail.points.push(pointDetail)
            }
            dataDetails.push(dataDetail)
        }
        return dataDetails
    }
    function getPointDetail(axis: 'x' | 'y', value: number, size: I_chart_size): { percent: number, offset: number, label: string } {
        const { padding = axis === 'x' ? [36, 36] : [0, 0] } = props[`${axis}Axis`];
        const f = filter[axis];
        const start = f[0], end = f[1];
        const percent = GetPercentByValue(start, end, value);
        const avilSize = size[axis] - (padding[0] + padding[1])
        const offset = padding[0] + avilSize * percent / 100;
        return { percent, offset, label: props[`${axis}Axis`].getLabel(value) }
    }
    function getXLabels(size: I_chart_size): I_chart_label_detail[] {
        const res: I_chart_label_detail[] = [];
        const f = filter.x;
        const start = f[0], end = f[1];

        for (let key = start; key <= end; key += props.xAxis.step) {
            const { offset, label } = getPointDetail('x', key, size)
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
        const { gridLineColor } = props[`${axis}Axis`]
        if (!gridLineColor) { return [] }
        const csize: number = clientSizeToCanvasSize(axis, size)
        const color = 'red';
        if (!color) { return [] }
        const labels = axis === 'x' ? xLabelsRef.current : yLabelsRef.current
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
    function getYLabels(size: I_chart_size) {
        const f = filter.y;
        const start = f[0], end = f[1];
        let step = (end - start) / 10;
        const magnitude = Math.pow(10, Math.floor(Math.log10(step)));
        step = Math.round(step / magnitude) * magnitude;
        const labels = [];
        const res: I_chart_label_detail[] = [];
        for (let i = start; i <= end; i += step) {
            const { offset, label } = getPointDetail('y', +i.toFixed(3), size)
            labels.push({ offset, label });
        }
        return labels;
    }

    function getElements(dataDetails: I_chart_data_detail[], size: I_chart_size) {
        let lines: I_canvas_item[] = [], points: I_canvas_item[] = [], rects: I_canvas_item[] = [],texts:I_canvas_item[] = [];
        for (let i = 0; i < dataDetails.length; i++) {
            const detail = dataDetails[i];
            if (detail.type === 'line') {
                const { pointElements, lineElement,textElements } = getLineChartElements(detail, size)
                lines.push(lineElement)
                texts = [...texts,...textElements];
                points = [...points, ...pointElements]
            }
            else {
                rects = [...rects, ...getBarChartElements(detail, size)]
            }
        }
        const gridLines = getGridLines('y', size)
        return [...gridLines, ...rects, ...lines, ...points,...texts]
    }
    function getLineChartElements(detail: I_chart_data_detail, size: I_chart_size): { pointElements: I_canvas_item[], lineElement: I_canvas_item,textElements:I_canvas_item[] } {
        const { lineWidth, dash, stroke } = detail.lineStyle;
        const pointElements: I_canvas_item[] = []
        const textElements:I_canvas_item[] = [];
        const lineElement: I_canvas_item = { points: [], type: "Line", lineWidth, dash, stroke };
        for (let i = 0; i < detail.points.length; i++) {
            const p = detail.points[i];
            (lineElement.points as any).push([p.x.offset, p.y.offset])
            pointElements.push({ type: 'Arc', x: p.x.offset, y: p.y.offset, ...p.pointStyle })
            const text = detail.getPointText?detail.getPointText(p):undefined
            if(text){
                const style = text.style || {}
                const {fontSize = 12,offset = 12,fill = '#000',rotate = 0} = style
                textElements.push({type:'Text',text:text.text,x:p.x.offset,y:p.y.offset + offset,fontSize,rotate,fill,align:[0,1]})
            }
        }
        return { pointElements, lineElement,textElements }
    }
    function getBarChartElements(detail: I_chart_data_detail, size: I_chart_size): I_canvas_item[] {
        const rectElements: I_canvas_item[] = []
        for (let i = 0; i < detail.points.length; i++) {
            const p = detail.points[i];
            const step = (p.x.size * detail.barCount) / (detail.barCount * 2);
            const start = p.x.offset - (p.x.size * detail.barCount / 2);
            const offsetX = start + (step * detail.barIndex * 2)
            rectElements.push({ type: 'Rectangle', x: offsetX, y: p.y.offset, width: p.x.size, height: p.y.size, ...p.pointStyle })
        }
        return rectElements
    }
    function getCornerStyle() { return { width: props.yAxis.size, height: props.xAxis.size } }
    function update() {
        const parentElement = $(dom.current);
        const canvasElement = parentElement.find('canvas');
        const size: I_chart_size = { x: canvasElement.width(), y: canvasElement.height() }
        const dataDetails = getDataDetails(props.datas, size);
        xLabelsRef.current = getXLabels(size)
        yLabelsRef.current = getYLabels(size)
        dataDetailsRef.current = dataDetails;
        const items = getElements(dataDetails, size);
        setCanvasItems(items)
    }
    useEffect(() => { update() }, [])
    function getContext(): I_ctx {
        return {
            rootProps: props,
            changeFilter, filter
        }
    }
    return (
        <ChartCtx.Provider value={getContext()}>
            <div className="aio-chart" ref={dom}>
                <div className="aio-chart-top">
                    <YLabels yLabels={yLabelsRef.current} />
                    <div className="aio-chart-canvas">
                        {canvas.render({
                            items: canvasItems,
                            //grid: [10, 10, '#eee'], 
                            screenPosition: ['50%', '50%']
                        })}
                    </div>
                </div>
                <div className="aio-chart-bottom">
                    <div className="aio-chart-corner" style={getCornerStyle()}></div>
                    <XLabels xLabels={xLabelsRef.current} />
                </div>
            </div>
        </ChartCtx.Provider>
    )
}
export { Chart }
const XLabels: FC<{ xLabels: I_chart_label_detail[] }> = ({ xLabels }) => {
    const { rootProps, filter, changeFilter }: I_ctx = useContext(ChartCtx)
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
            <div className="aio-chart-horizontal-labels" style={getLabelsStyle()}>
                {
                    xLabels.map((o) => {
                        return (
                            <div className="aio-chart-horizontal-label" style={getLabelStyle(o)}>
                                {o.label}
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
                    point={(index, p) => {
                        const { value } = p;
                        const label = getLabel(value)
                        return {
                            html: (
                                <div className="aio-chart-horizontal-filter-value">{label}</div>
                            )
                        }
                    }}
                />
            }
        </div>
    )
}

const YLabels: FC<{ yLabels: I_chart_label_detail[] }> = ({ yLabels }) => {
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
            <div className="aio-chart-vertical-labels" style={getLabelsStyle()}>
                {
                    yLabels.map((o) => {
                        return (
                            <div className="aio-chart-vertical-label" style={getLabelStyle(o)}>
                                {o.label}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

