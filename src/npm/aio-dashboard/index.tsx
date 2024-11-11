import { createRef, FC, MutableRefObject, ReactNode, useEffect, useRef, useState } from "react";
import { GetPercentByValue } from "../aio-utils";
import Canvas from './../../npm/aio-canvas';
import { I_canvas_item, I_canvas_props } from "../aio-canvas/types";
import $ from 'jquery';
import './index.css';
type I_chart_size = {x:number,y:number}
type I_chart_axis = {start:number,end:number,size:number,padding?:number}
type I_chart_data_axis = {
    getValue:(point:any)=>number,
    getLabel:(v:number)=>ReactNode
}
type I_chart_label_detail = {text:string,offset:number}
type I_getPointStyle = (data:I_chart_data,point:any)=>I_chart_point_style;
type I_getLineStyle = (data:I_chart_data)=>I_chart_line_style
type I_chart_point_style = {lineWidth?:number,r?:number,dash?:number[],stroke?:string,fill?:string}
type I_chart_line_style = {lineWidth?:number,dash?:number[],stroke?:string}
type I_chart_data_detail = {points:I_chart_point_detail[],type:'line' | 'bar',lineStyle:I_chart_line_style}
type I_chart_keys = {start:number,step:number,end:number}
type I_chart_point_detail = {
    x:{value:number,percent:number,offset:number,label:ReactNode,size:number},
    y:{value:number,percent:number,offset:number,label:ReactNode,size:number},
    pointStyle:I_chart_point_style,
}
type I_chart_data = {
    points:any[],xAxis:I_chart_data_axis,yAxis:I_chart_data_axis,
    getPointStyle?:I_getPointStyle,
    getLineStyle?:I_getLineStyle,
    type:'line' | 'bar'
}
export type I_Chart = {
    datas:I_chart_data[],
    xAxis:I_chart_axis,
    yAxis:I_chart_axis,
    keys:I_chart_keys,
    getKeyLabel:(x:number)=>string
}
const Chart:FC<I_Chart> = (props)=>{
    const [dom] = useState<any>(createRef())
    const [canvas] = useState<Canvas>(new Canvas())
    const [canvasItems,setCanvasItems] = useState<I_canvas_item[]>([])
    const dataDetailsRef = useRef<I_chart_data_detail[]>([])
    const xLabelsRef = useRef<I_chart_label_detail[]>([])
    function getDefaultPointStyle(data:I_chart_data,point:any):I_chart_point_style{
        const {getPointStyle = (()=>({}))} = data; 
        const pointStyle:I_chart_point_style = getPointStyle(data,point) || {};
        const {lineWidth = 1,r = 4,dash,stroke = data.type === 'line'?'#333':undefined,fill = data.type === 'line'?'#fff':'#333'} = pointStyle
        return {lineWidth,r,dash,stroke,fill}
    }
    function getDefaultLineStyle(data:I_chart_data):I_chart_line_style{
        const {getLineStyle = (()=>({}))} = data;
        const lineStyle:I_chart_line_style = getLineStyle(data) || {};
        const {lineWidth = 1,dash,stroke = '#333'} = lineStyle
        return {lineWidth,dash,stroke}
    }
    function getBarWidth(data:I_chart_data,size:I_chart_size){
        const {padding:xPadding = 36} = props.xAxis,{padding:yPadding = 0} = props.yAxis;
        const pointsLength = data.points.length;
        let avilableWidth = size.x - (xPadding * 2);
        const gap = avilableWidth / pointsLength / 2;
        avilableWidth -= (pointsLength - 1) * gap;
        return avilableWidth / pointsLength
    }
    function getDataDetails(datas:I_chart_data[],size:I_chart_size):I_chart_data_detail[]{
        let dataDetails:I_chart_data_detail[] = []
        for(let i = 0; i < datas.length; i++){
            const data = datas[i];
            let dataDetail:I_chart_data_detail = {points:[],type:data.type,lineStyle:getDefaultLineStyle(data)}
            for(let j = 0; j < data.points.length; j++){
                const point = data.points[j];
                const x = data.xAxis.getValue(point),y = data.yAxis.getValue(point);
                const xOffset = getOffsetByValue('x',x,size)
                const yOffset = getOffsetByValue('y',y,size)
                const pointDetail:I_chart_point_detail = {
                    x:{...xOffset,label:data.xAxis.getLabel(x),size:getBarWidth(data,size),value:x},
                    y:{...yOffset,label:data.yAxis.getLabel(y),size:-yOffset.offset,value:y},
                    pointStyle:getDefaultPointStyle(data,point)
                }
                dataDetail.points.push(pointDetail)
            }
            dataDetails.push(dataDetail)
        }
        return dataDetails    
    }
    function getOffsetByValue(axis:'x' | 'y',value:number,size:I_chart_size):{percent:number,offset:number}{
        const {padding = axis === 'x'?36:0,start,end} = props[`${axis}Axis`];
        const p = GetPercentByValue(start,end,value);
        const v = padding + ((size[axis] - padding * 2) * p / 100);
        return {percent:p,offset:v}
    }
    function getXLabels(keys:I_chart_keys,size:I_chart_size):I_chart_label_detail[]{
        const res:I_chart_label_detail[] = [];
        for(let key = keys.start; key <= keys.end; key+=keys.step){
            const {offset} = getOffsetByValue('x',key,size)
            res.push({offset,text:props.getKeyLabel(key)})
        }
        return res
    }
    function getElements(dataDetails:I_chart_data_detail[],size:I_chart_size){
        let lines:I_canvas_item[] = [],points:I_canvas_item[] = [],rects:I_canvas_item[] = [];
        for(let i = 0; i < dataDetails.length; i++){
            const detail = dataDetails[i];
            if(detail.type === 'line'){
                const {pointElements,lineElement} = getLineChartElements(detail,size)
                lines.push(lineElement)
                points = [...points,...pointElements]
            }
            else {
                rects = [...rects,...getBarChartElements(detail,size)]
            }
        }
        return [...rects,...lines,...points]
    }
    function getLineChartElements(detail:I_chart_data_detail,size:I_chart_size):{pointElements:I_canvas_item[],lineElement:I_canvas_item}{
        const {lineWidth,dash,stroke} = detail.lineStyle;
        const pointElements:I_canvas_item[] = []
        const lineElement:I_canvas_item = {points:[],type:"Line",lineWidth,dash,stroke};
        for(let i = 0; i < detail.points.length; i++){
            const p = detail.points[i];
            (lineElement.points as any).push([p.x.offset,p.y.offset])
            pointElements.push({type:'Arc',x:p.x.offset,y:p.y.offset,...p.pointStyle})
        }
        return {pointElements,lineElement}
    }
    function getBarChartElements(detail:I_chart_data_detail,size:I_chart_size):I_canvas_item[]{
        const {lineWidth,dash,stroke} = detail.lineStyle;
        const rectElements:I_canvas_item[] = []
        for(let i = 0; i < detail.points.length; i++){
            const p = detail.points[i];
            rectElements.push({type:'Rectangle',x:p.x.offset,y:p.y.offset,pivot:[p.x.size / 2,0],width:p.x.size,height:p.y.size,...p.pointStyle})
        }
        return rectElements
    }
    function getVerticalAxisStyle(){return {width:props.yAxis.size}}
    function getHorizontalAxisStyle(){return {height:props.xAxis.size}}
    function getCornerStyle(){return {width:props.yAxis.size,height:props.xAxis.size}}
    function update(){
        const parentElement = $(dom.current);
        const canvasElement = parentElement.find('canvas');
        const size:I_chart_size = {x:canvasElement.width(),y:canvasElement.height()}
        const dataDetails = getDataDetails(props.datas,size);
        dataDetailsRef.current = dataDetails;
        const items = getElements(dataDetails,size);
        setCanvasItems(items)
    }
    useEffect(()=>{update()},[])
    return (
        <div className="aio-chart" ref={dom}>
            <div className="aio-chart-top">
                <div className="aio-chart-axis aio-chart-vertical-axis" style={getVerticalAxisStyle()}></div>
                <div className="aio-chart-canvas">
                    {canvas.render({items:canvasItems,grid:[10,10,'#eee'],screenPosition:['50%','50%']})}
                </div>
            </div>
            <div className="aio-chart-bottom">
                <div className="aio-chart-corner" style={getCornerStyle()}></div>
                <div className="aio-chart-axis aio-chart-horizontal-axis" style={getHorizontalAxisStyle()}>
                    <XLabels dataDetails={dataDetailsRef.current}/>
                </div>
            </div>
        </div>
    )
}
export {Chart}
const XLabels:FC<{dataDetails:I_chart_data_detail[]}> = ({dataDetails})=>{
    return (
        <div className="aio-chart-labels-horizontal">
            
        </div>
    )
}