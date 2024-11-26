import { createContext, createRef, FC, MutableRefObject, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { GetPercentByValue } from "../aio-utils";
import Canvas from './../../npm/aio-canvas';
import { I_canvas_item, I_canvas_props } from "../aio-canvas/types";
import $ from 'jquery';
import './index.css';
import { AI_point, AISlider, AISpinner, I_rangeConfig } from "../aio-input";
const ChartCtx = createContext({} as any)
type I_chart_range = [number,string][]
type I_chart_size = { x: number, y: number }
type I_chart_axis = { start: number, end: number, size: number,fontSize?:number, padding?: number[], getLabel: (v: number) => string, rotate?: number, gridLineColor?: string, zoom?: boolean }
type I_chart_label_detail = { label: ReactNode, offset: number }
type I_getPointStyle = (point: any) => I_chart_point_style;
type I_getLineStyle = () => I_chart_line_style
type I_chart_point_style = { lineWidth?: number, r?: number, dash?: number[], stroke?: string, fill?: string }
type I_chart_line_style = { lineWidth?: number, dash?: number[], stroke?: string }
type I_chart_data_detail = { 
    points: I_chart_point_detail[], type: 'line' | 'bar', lineStyle: I_chart_line_style,getPointText?:I_getPointText,
    barCount:number,barIndex:number,areaPoints:number[][],areaColors?:[string,string]
}
type I_rangeDetail = {offset:number,height:number,color:string}
type I_chart_point_detail = {
    x: { value: number, percent: number, offset: number, label: ReactNode, size: number },
    y: { value: number, percent: number, offset: number, label: ReactNode, size: number },
    pointStyle: I_chart_point_style,rangeDetails:I_rangeDetail[]
}
type I_getPointText = (point:I_chart_point_detail)=>{
    text:string,
    style?:{fontSize?:number,rotate?:number,fill?:string,offset?:number}
} | undefined
type I_chart_data = {
    points: any[], 
    getX: (point: any) => number, 
    getY: (point: any) => number,
    getRanges?:(point:any)=>I_chart_range | undefined,
    getPointStyle?: I_getPointStyle,
    getLineStyle?: I_getLineStyle,
    getPointText?:I_getPointText,
    type: 'line' | 'bar',
    areaColors?:[string,string]
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
    const [curh] = useState<any>(createRef())
    const [curv] = useState<any>(createRef())
    const [curhl] = useState<any>(createRef())
    const [curvl] = useState<any>(createRef())
    const [canvas] = useState<Canvas>(new Canvas())
    const [canvasItems, setCanvasItems] = useState<I_canvas_item[]>([])
    const dataDetailsRef = useRef<I_chart_data_detail[]>([])
    const xLabelsRef = useRef<I_chart_label_detail[]>([])
    const yLabelsRef = useRef<I_chart_label_detail[]>([])
    const sizeRef = useRef<any>()
    let [filter, setFilter] = useState<I_filter>({ x: [props.xAxis.start, props.xAxis.end], y: [props.yAxis.start, props.yAxis.end] })
    let [timeout] = useState<any>()
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
            const {type,getPointText,getRanges = ()=>{return undefined},areaColors} = data;
            if(type === 'bar'){barIndex++;}
            let dataDetail: I_chart_data_detail = { points: [], type, lineStyle: getDefaultLineStyle(data),getPointText,barCount,barIndex,areaPoints:[],areaColors }
            const filteredPoints = getFilteredPoints(data)
            for (let j = 0; j < filteredPoints.length; j++) {
                const { point, x, y } = filteredPoints[j];
                const xDetail = getPointDetail('x', x, size)
                const yDetail = getPointDetail('y', y, size)
                const pointDetail: I_chart_point_detail = {
                    x: { ...xDetail, size: getBarWidth(datas,data, size), value: x },
                    y: { ...yDetail, size: -yDetail.offset, value: y },
                    pointStyle: getDefaultPointStyle(data, point),
                    rangeDetails:[],
                }
                if(areaColors){dataDetail.areaPoints.push([pointDetail.x.offset,pointDetail.y.offset])}
                const ranges = getRanges(point);
                if(ranges){
                    let lastValue = 0;
                    for(let k = 0; k < ranges.length; k++){
                        let [value,color] = ranges[k];
                        const {offset:startOffset} = getPointDetail('y', lastValue, size)
                        const {offset:endOffset} = getPointDetail('y', value, size)
                        pointDetail.rangeDetails.push({offset:startOffset,height:endOffset - startOffset,color});
                        lastValue = value;
                    }
                }
                dataDetail.points.push(pointDetail)
            }
            if(areaColors){dataDetail.areaPoints = [[dataDetail.areaPoints[0][0], 0],...dataDetail.areaPoints,[dataDetail.areaPoints[dataDetail.areaPoints.length - 1][0], 0]]}
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
    function updateLabels() {
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
    }
    function getXLabels(size: I_chart_size): I_chart_label_detail[] {
        const res: I_chart_label_detail[] = [];
        const f = filter.x;
        const start = f[0], end = f[1];

        for (let key = start; key <= end; key++) {
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
        const { gridLineColor = axis === 'y'?'#ddd':undefined } = props[`${axis}Axis`]
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
        const labels: I_chart_label_detail[] = [];
        for (let i = start; i <= end; i += step) {
            const { offset, label } = getPointDetail('y', +i.toFixed(3), size)
            labels.push({ offset, label });
        }
        return labels;
    }

    function getElements(dataDetails: I_chart_data_detail[], size: I_chart_size) {
        let lines: I_canvas_item[] = [], points: I_canvas_item[] = [], rects: I_canvas_item[] = [],texts:I_canvas_item[] = [],areas:I_canvas_item[] = [];
        for (let i = 0; i < dataDetails.length; i++) {
            const detail = dataDetails[i];
            if (detail.type === 'line') {
                const { pointElements, lineElement,textElements,areaElement } = getLineChartElements(detail, size)
                lines.push(lineElement)
                if(areaElement){areas.push(areaElement)}
                texts = [...texts,...textElements];
                points = [...points, ...pointElements]
            }
            else {
                rects = [...rects, ...getBarChartElements(detail, size)]
            }
        }
        const gridLines = getGridLines('y', size)
        return [...gridLines,...areas, ...rects, ...lines, ...points,...texts]
    }
    function getLineChartElements(
        detail: I_chart_data_detail, 
        size: I_chart_size
    ): { 
        pointElements: I_canvas_item[], 
        lineElement: I_canvas_item,
        textElements:I_canvas_item[],
        areaElement?:I_canvas_item
    } {
        const { lineWidth, dash, stroke } = detail.lineStyle;
        const pointElements: I_canvas_item[] = []
        const textElements:I_canvas_item[] = [];
        const lineElement: I_canvas_item = { points: [], type: "Line", lineWidth, dash, stroke };
        const areaElement:I_canvas_item | undefined = detail.areaColors?getArea(detail.areaPoints,detail.areaColors,size):undefined
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
        return { pointElements, lineElement,textElements,areaElement }
    }
    function getBarChartElements(detail: I_chart_data_detail, size: I_chart_size): I_canvas_item[] {
        const rectElements: I_canvas_item[] = []
        for (let i = 0; i < detail.points.length; i++) {
            const {x,y,pointStyle,rangeDetails} = detail.points[i];
            const step = (x.size * detail.barCount) / (detail.barCount * 2);
            const start = x.offset - (x.size * detail.barCount / 2);
            const offsetX = start + (step * detail.barIndex * 2)
            if(rangeDetails.length){
                for(let i = 0; i < rangeDetails.length; i++){
                    const {offset,height,color} = rangeDetails[i];
                    rectElements.push({ type: 'Rectangle', x: offsetX, y: offset, width: x.size, height, ...{...pointStyle,fill:color} })
                }
            }
            else {
                rectElements.push({ type: 'Rectangle', x: offsetX, y: y.offset, width: x.size, height: y.size, ...pointStyle })
            }
        }
        return rectElements
    }
    useEffect(()=>{
        $(window).on('resize',resize)
    },[])
    function resize(){
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            update()
        },350)
    }
    function getCornerStyle() { return { width: props.yAxis.size, height: props.xAxis.size } }
    function update() {
        const parentElement = $(dom.current);
        const canvasElement = parentElement.find('canvas');
        const size: I_chart_size = { x: canvasElement.width(), y: canvasElement.height() }
        sizeRef.current = size
        const dataDetails = getDataDetails(props.datas, size);
        xLabelsRef.current = getXLabels(size)
        yLabelsRef.current = getYLabels(size)
        dataDetailsRef.current = dataDetails;
        const items = getElements(dataDetails, size);
        setCanvasItems(items);
        setTimeout(()=>updateLabels(),5)
    }
    function getArea(areaPoints:number[][],areaColor:[string,string],size:I_chart_size):I_canvas_item {
        return { type: 'Line', points: areaPoints, fill: [0, 0, 0, -size.y, ['0 ' + areaColor[0], '1 ' + areaColor[1]]] as any };
    }
    function getXLabelByValue(value:number,size:number){
        const {padding = [36,36],getLabel = (v)=>v} = props.xAxis;
        const start = filter.x[0]
        const end = filter.x[1];
        const step:number = (size - (padding[0] + padding[1])) / (end - start)
        if(value < padding[0]){return getLabel(start)}
        if(value > size - padding[1]){return getLabel(end)}
        const index = Math.round((value - padding[0]) / step);
        return getLabel(index) 
    }
    function getYLabelByValue(value:number,size:number){
        const {start,end,padding = [0,0],getLabel = (v)=>v} = props.yAxis;
        const step:number = (size - (padding[0] + padding[1])) / (end - start)
        if(value < padding[0]){return getLabel(start)}
        if(value > size - padding[1]){return getLabel(end)}
        const index = Math.round((value - padding[0]) / step);
        return getLabel(index) 
    }
    useEffect(() => { update() }, [])
    function getContext(): I_ctx {
        return {
            rootProps: props,
            changeFilter, filter
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
    return (
        <ChartCtx.Provider value={getContext()}>
            <div className="aio-chart" ref={dom}>
                <div className="aio-chart-top">
                    <YLabels yLabels={yLabelsRef.current} curhl={curhl}/>
                    <div className="aio-chart-canvas">
                        {canvas.render({
                            items: canvasItems,
                            //grid: [10, 10, '#eee'], 
                            screenPosition: ['50%', '50%'],
                            attrs:{
                                onMouseMove:({mousePosition})=>{
                                    if(sizeRef.current === undefined){return}
                                    const {x,y} = mousePosition
                                    const w = sizeRef.current.x,h = sizeRef.current.y
                                    const xLabel = getXLabelByValue(x,w);
                                    const yLabel = getYLabelByValue(y,h);
                                    const vlc = $(curvl.current)
                                    const hlc = $(curhl.current)
                                    vlc.find('.aio-chart-cursor-label-v').html(xLabel)
                                    hlc.find('.aio-chart-cursor-label-h').html(yLabel)
                                    vlc.css({left:x,display:'flex'});
                                    hlc.css({bottom:y,display:'flex'});
                                    $(curh.current).css({bottom:y,display:'block'})
                                    $(curv.current).css({left:x,display:'block'})
                                    
                                },
                                onMouseLeave:()=>{
                                    $(curh.current).css({display:'none'})
                                    $(curv.current).css({display:'none'})
                                    $(curhl.current).css({display:'none'})
                                    $(curvl.current).css({display:'none'})
                                }
                            }
                        })}
                        <div className="aio-chart-cursor-line aio-chart-cursor-line-h" ref={curh}></div>
                        <div className="aio-chart-cursor-line aio-chart-cursor-line-v" ref={curv}></div>
                    </div>
                </div>
                <div className="aio-chart-bottom">
                    <div className="aio-chart-corner" style={getCornerStyle()}></div>
                    <XLabels xLabels={xLabelsRef.current} curvl={curvl}/>
                </div>
            </div>
        </ChartCtx.Provider>
    )
}
export { Chart }
const XLabels: FC<{ xLabels: I_chart_label_detail[],curvl:any }> = ({ xLabels,curvl }) => {
    const { rootProps, filter, changeFilter }: I_ctx = useContext(ChartCtx)
    const { xAxis } = rootProps
    const { rotate, size, getLabel = (v) => v, zoom,fontSize = 12 } = xAxis;
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
                <div className="aio-chart-cursor-label aio-chart-cursor-label-v" style={{fontSize}}></div>
            </div>
            <div className="aio-chart-horizontal-labels" style={getLabelsStyle()}>
                {
                    xLabels.map((o,i) => {
                        return (
                            <div key={i} className="aio-chart-horizontal-label" style={getLabelStyle(o)}>
                                <div className="aio-chart-horizontal-label-text" data-rotated={rotate?'yes':'no'} style={{fontSize}}>{o.label}</div>
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

const YLabels: FC<{ yLabels: I_chart_label_detail[],curhl:any }> = ({ yLabels,curhl }) => {
    const { rootProps }: I_ctx = useContext(ChartCtx)
    const { yAxis } = rootProps
    const { size,fontSize = 12 } = yAxis;
    function getAxisStyle() { return { width: size } }
    function getLabelsStyle() {
        let style: any = {}
        return style
    }
    function getLabelStyle(labelDetail: I_chart_label_detail) {
        let style: any = { bottom: labelDetail.offset,fontSize }
        return style
    }
    return (
        <div className="aio-chart-axis aio-chart-vertical-axis" style={getAxisStyle()}>
            <div className="aio-chart-cursor-label-container aio-chart-cursor-label-container-h" ref={curhl}>
                <div className="aio-chart-cursor-label aio-chart-cursor-label-h" style={{fontSize}}></div>
            </div>
            <div className="aio-chart-vertical-labels" style={getLabelsStyle()}>
                {
                    yLabels.map((o,i) => {
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
type I_pieRange_style = {thickness?:number,offset?:number,roundCap?:boolean,color:string}
type I_pieRange = {
    value:number,
    style?:I_pieRange_style
}
export const Pie:FC<{start:number,end:number,ranges:I_pieRange[],rangeStyle?:Omit<I_pieRange_style,'color'>}> = ({start,end,ranges,rangeStyle = {}})=>{
    function getRange(r:I_pieRange):[value:number,config:I_rangeConfig]{
        const {value,style} = r;
        const {thickness = 12,offset = 0,roundCap = false,color = '#000'} = {...rangeStyle,...style};
        return [value,{thickness,offset,roundCap,color}]
    }
    return (
        <AISpinner
            start={start}
            end={end}
            ranges={ranges.map((o)=>getRange(o))}
        />    
    )
}
