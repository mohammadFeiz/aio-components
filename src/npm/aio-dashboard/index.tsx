import { createRef, FC, ReactNode, useEffect, useState } from "react";
import { GetPercentByValue } from "../aio-utils";
import Canvas from './../../npm/aio-canvas';
import { I_canvas_item, I_canvas_props } from "../aio-canvas/types";
import $ from 'jquery';
import './index.css';
type I_chart_size = {width:number,height:number}
type I_chart_axis = {start:number,end:number,size:number,padding?:number}
type I_chart_data_axis = {
    getValue:(point:any)=>number,
    getLabel:(v:number)=>ReactNode
}
type I_getPointStyle = (data:I_chart_data,point:any)=>I_chart_point_style;
type I_getLineStyle = (data:I_chart_data)=>I_chart_line_style
type I_chart_point_style = {lineWidth?:number,r?:number,dash?:number[],stroke?:string,fill?:string}
type I_chart_line_style = {lineWidth?:number,dash?:number[],stroke?:string}
type I_chart_data_detail = {points:I_chart_point_detail[],type:'line' | 'bar',lineStyle:I_chart_line_style}
type I_chart_point_detail = {
    x:number,y:number,
    xp:number,yp:number,
    xc:number,yc:number,
    w:number,h:number,
    xLabel:ReactNode,yLabel:ReactNode,
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
    yAxis:I_chart_axis
}
const Chart:FC<I_Chart> = (props)=>{
    const [dom] = useState<any>(createRef())
    const [canvas] = useState<Canvas>(new Canvas())
    const [canvasItems,setCanvasItems] = useState<I_canvas_item[]>([])
    
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
        let avilableWidth = size.width - (xPadding * 2);
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
                const {padding:xPadding = 36} = props.xAxis,{padding:yPadding = 0} = props.yAxis;
                const point = data.points[j];
                const x = data.xAxis.getValue(point),y = data.yAxis.getValue(point);
                const xp = GetPercentByValue(props.xAxis.start,props.xAxis.end,x),yp = GetPercentByValue(props.yAxis.start,props.yAxis.end,y);
                const xc = xPadding + ((size.width - xPadding * 2) * xp / 100),yc = yPadding + ((size.height - yPadding * 2) * yp / 100);
                const pointDetail:I_chart_point_detail = {
                    x,y,xp,yp,xc,yc,
                    w:getBarWidth(data,size),h:-yc,
                    xLabel:data.xAxis.getLabel(x),yLabel:data.yAxis.getLabel(y),
                    pointStyle:getDefaultPointStyle(data,point)
                }
                dataDetail.points.push(pointDetail)
            }
            dataDetails.push(dataDetail)
        }
        return dataDetails    
    }
    function getElements(size:I_chart_size){
        const dataDetails = getDataDetails(props.datas,size);
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
            (lineElement.points as any).push([p.xc,p.yc])
            pointElements.push({type:'Arc',x:p.xc,y:p.yc,...p.pointStyle})
        }
        return {pointElements,lineElement}
    }
    function getBarChartElements(detail:I_chart_data_detail,size:I_chart_size):I_canvas_item[]{
        const {lineWidth,dash,stroke} = detail.lineStyle;
        const rectElements:I_canvas_item[] = []
        for(let i = 0; i < detail.points.length; i++){
            const p = detail.points[i];
            rectElements.push({type:'Rectangle',x:p.xc,y:p.yc,pivot:[p.w / 2,0],width:p.w,height:p.h,...p.pointStyle})
        }
        return rectElements
    }
    function getCanvasItems(){
        const parentElement = $(dom.current);
        const canvasElement = parentElement.find('canvas');
        const width = canvasElement.width();
        const height = canvasElement.height();
        const items = getElements({width,height});
        setCanvasItems(items)
    }
    function getVerticalAxisStyle(){return {width:props.yAxis.size}}
    function getHorizontalAxisStyle(){return {height:props.xAxis.size}}
    function getCornerStyle(){return {width:props.yAxis.size,height:props.xAxis.size}}
    useEffect(()=>{getCanvasItems()},[])
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
                <div className="aio-chart-axis aio-chart-horizontal-axis" style={getHorizontalAxisStyle()}></div>
            </div>
        </div>
    )
}
export {Chart}