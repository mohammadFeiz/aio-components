import React, { FC, createContext, createRef, useContext, useEffect, useRef, useState } from "react";
import { AI_context, AI_scale, AI_scales, I_RangeArc, I_RangeContext, I_RangeItem, I_RangeItems, I_RangeRect, I_RangeValue, I_RangeValueContainer } from "./types";
import {AICTX,Def,addToAttrs} from './utils';
import { I_Swip_mousePosition, Swip, getEventAttrs, svgArc } from "../aio-utils";
import $ from 'jquery';
const RangeContext = createContext({} as any)
const Range:FC = () => {
    let {rootProps}:AI_context = useContext(AICTX);
    let {
        start = 0,end = 360,min = start,max = end,step = 1,ranges,circles = [],reverse,round,vertical,
        multiple,text,onChange,size = Def('range-size'),disabled,className,fill,rotate = 0
    } = rootProps;
    let [temp] = useState<any>({dom:createRef(),start:0,index:false})
    function getValidValue(value:number[]):number[] {
        if (!Array.isArray(value)) {value = [value || 0]}
        for (let i = 0; i < value.length; i++) {
            let point = value[i] || 0;
            point = Math.round((point - start) / step) * step + start;
            if (point < min) { point = min; }
            if (point > max) { point = max; }
            value[i] = point;
        }
        return value
    }
    let value:number[] = getValidValue(rootProps.value);
    let valueRef = useRef(value);
    valueRef.current = value;
    let [disabledDic,setDisabledDic] = useState(getDisabledDic())
    function getDisabledDic(){
        if(!Array.isArray(disabled)){return {}}
        let res:{[key:string]:boolean} = {}
        for(let i = 0; i < disabled.length; i++){
            let key = 'a' + disabled[i];
            res[key] = true
        }
        return res
    }
    useEffect(()=>{setDisabledDic(getDisabledDic())},[JSON.stringify(disabled)])
    useEffect(()=>{
        new Swip({
            reverseX:!!reverse,
            //vertical condition
            reverseY:!!reverse && !!vertical,
            dom:()=>$(temp.dom.current),
            start:({event})=>{
                let target = $(event.target);
                if(target.hasClass('aio-input-range-point')){
                    let index:string = target.attr('data-index') || '0';
                    temp.index = +index;
                }
                else {
                    temp.index = false
                }
                temp.start = [...valueRef.current];
                return [0,0];
            },
            move:({change,mousePosition})=>{
                if(change){changeHandle({dx:change.dx,dy:change.dy,deltaCenterAngle:change.deltaCenterAngle,centerAngle:mousePosition.centerAngle})}
            },
            onClick:function (p){click(p.mousePosition)}
        })
    },[])
    function changeValue(newValue:number[]){
        if(!onChange){return}
        newValue = getValidValue(newValue)
        onChange(multiple?newValue:newValue[0])
    }
    function click(mousePosition:I_Swip_mousePosition){
        if(disabled === true || temp.index !== false){return} 
        let value = valueRef.current;
        let clickedValue:number;
        //vertical condition
        if(round){clickedValue = getValueByAngle(mousePosition.centerAngle);}
        else {clickedValue = getValueByXP(mousePosition[vertical?'yp':'xp']);}
        if(clickedValue < value[value.length - 1] && clickedValue > value[0]){return}
        if(clickedValue < value[0]){change1Unit(-1)}
        else{change1Unit(1)}
    }
    function isValueValid(value:number[]):boolean{
        for(let i = 0; i < value.length; i++){if(isValueDisabled(value[i])){return false}}
        return true
    }
    function change1Unit(dir: 1 | -1):void{
        let value = valueRef.current;
        let newValue = [...value];
        let lastValue = JSON.stringify(newValue)
        newValue = moveAll(newValue,dir * step);
        while(!isValueValid(newValue) && JSON.stringify(newValue) !== lastValue){
            lastValue = JSON.stringify(newValue)
            newValue = moveAll(newValue,dir * step)
        }
        changeValue(newValue)
    }
    function changeHandle(obj:{dx:number,dy:number,deltaCenterAngle:number,centerAngle:number}):void{
        if(disabled === true){return}
        let newValue = getChangedValue(obj);
        changeValue(newValue)
    }
    function getIndexLimit(index:number){
        let value = valueRef.current;
        let before:number,after:number;
        if(index === 0){before = start}
        else {before = value[index - 1]}
        if(index === value.length - 1){after = end}
        else {after = value[index + 1]}
        return {before,after} 
    }
    function moveAll(newValue:number[],offset:number,ifFailedReturnOriginalValue?:boolean):number[]{
        let res = newValue.map((o:number)=>o + offset)
        if(res[0] < start || res[res.length - 1] > end){
            return ifFailedReturnOriginalValue?valueRef.current:newValue
        }
        console.log(res)
        return res;
    }
    function getChangedValue(obj:{dx:number,dy:number,deltaCenterAngle:number,centerAngle:number}):number[]{
        let {dx,dy,deltaCenterAngle,centerAngle} = obj;
        //vertical condition
        let delta = vertical?dy:dx;
        let startValue = [...temp.start];
        let index = temp.index;
        let range = end - start;
        if(index === false){
            let deltaValue;
            if(round){
                let v = deltaCenterAngle * (end - start) / 360;
                v = Math.round(v / step) * step;
                deltaValue = v;
            }
            else {deltaValue = Math.round(getValueByXP(getXPByX(delta)) / step) * step;}
            let newValue = moveAll(startValue,deltaValue,true);
            return !isValueValid(newValue)?valueRef.current:newValue;
        }
        else {
            let {before,after} = getIndexLimit(index)
            let newUnit:number;
            if(round){
                newUnit = getValueByAngle(centerAngle);
                if(newUnit > after || newUnit < before){
                    let deltaAfter = newUnit - after;
                    if(deltaAfter < 0){deltaAfter += range;}
                    let deltaBefore = before - newUnit;
                    if(deltaBefore < 0){deltaBefore += range;}
                    if(deltaAfter < deltaBefore){newUnit = after}
                    else {newUnit = before}
                }
            }
            else {
                let deltaValue = Math.round(getValueByXP(getXPByX(delta)) / step) * step;
                newUnit = startValue[index] + deltaValue;
                if(newUnit > after){newUnit = after}
                if(newUnit < before){newUnit = before}
            }
            if(isValueDisabled(newUnit)){return valueRef.current}
            startValue[index] = newUnit;
            return startValue;
        }
    }
    function getSide(){
        if(vertical){return reverse?'bottom':'top'}
        return reverse?'right':'left'
    }
    function getOffset(){
        return vertical?'left':'top'
    }
    function isValueDisabled(value:number):boolean{return !!disabledDic[`a${value}`]}
    function getRootClassName(){
        let cls = 'aio-input-range';
        if(round){cls += ' aio-input-range-round'}
        else {cls += ` aio-input-range-${vertical?'vertical':'horizontal'}`}
        if(className){cls += ' ' + className}
        if(reverse){cls += ' aio-input-range-reverse'}
        return cls
    }
    function root_node():React.ReactNode{
        let {style,attrs = {}} = rootProps;
        let rootStyle = !round?{...style}:{...style,width:size,height:size};
        let p = addToAttrs(attrs,{className:getRootClassName(),style:rootStyle,attrs:{ref:temp.dom}})
        return (
            <div {...p}>
                {text !== undefined && <div className='aio-input-range-text'>{typeof text === 'function'?text():text}</div>}
                {!round && <><RangeRanges/><RangeFills/></>} 
                <RangeSvg/> 
                <RangeItems key='scale' type='scale'/>
                <RangeItems key='label' type='label'/>
                {value.map((itemValue,i)=><RangeValueContainer index={i} itemValue={itemValue}/>)}
            </div>
        )
    }
    function getValueByAngle(angle:number){
        let fillAngle = 360 * (round as number);
        let emptyAngle = 360 - fillAngle;
        if(reverse){angle = 180 - angle}
        angle -= rotate; angle -= emptyAngle / 2; angle -= 90; angle = fixAngle(angle);
        return angle * (end - start) / fillAngle;
    }
    function getAngleByValue(value:number,ang?:number){
        let fillAngle = 360 * (round as number);
        let emptyAngle = 360 - fillAngle;
        let res = value * fillAngle / (end - start);
        res += 90; res += emptyAngle / 2; res += rotate; res += (ang || 0)
        return reverse?res = 180 - res:res;
    }
    function fixAngle(angle:number):number{angle = angle % 360; return angle < 0?angle = 360 + angle:angle}
    function getXPByValue(value:number):number {return 100 * (value - start) / (end - start);}
    function getValueByXP(xp:number):number{return xp * (end - start) / 100;}
    //vertical condition
    function getXPByX(x:number):number{return x * 100 / ($(temp.dom.current)[vertical?'height':'width']() as number);}
    function getContext(){
        let context:I_RangeContext = {
            getXPByValue,rootProps,fixAngle,getAngleByValue,dom:temp.dom,
            isValueDisabled,value:valueRef.current,getSide,getOffset
        }
        return context;
    }
    return (<RangeContext.Provider value={getContext()}>{root_node()}</RangeContext.Provider>)
}
export default Range
const RangeSvg:FC = () => {
    let {rootProps}:I_RangeContext = useContext(RangeContext);
    let {round,ranges,circles = [],size = Def('range-size')} = rootProps;
    if(!round || (!(ranges || []).length && !circles.length)){return null}
    let pathes = [<RangeCircles/>,<RangeRanges/>]
    return (<svg style={{position:'absolute',left:0,top:0}} width={size} height={size}>{pathes}</svg>)
}
const RangeCircles:FC = () => {
    let {rootProps}:AI_context = useContext(AICTX);
    let {start = 0,end = 360,circles = [],size = Def('range-size')} = rootProps;
    if(!circles.length){return null}
    let pathes = []
    for(let i = 0; i < circles.length; i++){
        let [stringRadius,stringThickness,color] = circles[i].split(' ');
        let from = start,to = end,radius = +stringRadius,thickness = +stringThickness;
        if(radius > size / 2 - thickness / 2){radius = size / 2 - thickness / 2} 
        radius = Math.round(radius)
        let p:I_RangeArc = {thickness,color,from,to,radius,rotate:90,rootProps};
        pathes.push(<RangeArc {...p}/>);
    }
    return <>{pathes}</>;
}
const RangeFills:FC = () => {
    let {rootProps,value}:I_RangeContext = useContext(RangeContext);
    let {start = 0,fill,round} = rootProps; 
    if(round || fill === false){return null}
    let limit = value.length === 1?[start,value[0]]:[...value]; 
    let res:React.ReactNode[] = [];
    for(let i = 1; i < limit.length; i++){
        let {thickness,style,className:fillClassName,color} = (typeof fill === 'function'?fill(i):fill) || {};
        let from = limit[i - 1];
        let to = limit[i];
        let className = 'aio-input-range-fill';
        if(fillClassName){className += ' ' + fillClassName}
        let p:I_RangeRect = {thickness,color,from,to,className,style}
        res.push(<RangeRect {...p} key={'fill' + i}/>)
    }
    return <>{res}</>
}
const RangeRanges:FC = () => {
    let {rootProps,value}:I_RangeContext = useContext(RangeContext);
    let {start = 0,end = 360,ranges,round,multiple,size = Def('range-size')} = rootProps; 
    ranges = ranges || [`${end} 2 #ddd`]
    let res = [],from = start,list = (typeof ranges === 'function'?ranges(multiple?value:value[0]):ranges) || [];
    for(let i = 0; i < list.length; i++){
        let [stringValue,stringThickness,color] = list[i].split(' ');
        let to = +stringValue
        let thickness = +stringThickness;
        let radius = (size / 2) - (thickness / 2);
        let rangeItem:React.ReactNode
        if(round){
            let p:I_RangeArc = {thickness,color,from,to,radius,rotate:90,rootProps}
            rangeItem = <RangeArc {...p}/>
        }
        else {
            let p:I_RangeRect = {thickness,color,from,to,className:'aio-input-range-range'}
            rangeItem = <RangeRect {...p} key={'range' + i}/>
        }
        res.push(rangeItem);
        from = to;
    }
    return <>{res}</>
}
const RangeValueContainer:FC<I_RangeValueContainer> = (props) => {
    let {rootProps,isValueDisabled,fixAngle,getAngleByValue,getXPByValue,dom,getSide}:I_RangeContext = useContext(RangeContext);
    let {itemValue,index} = props;
    let {round} = rootProps;
    let angle = fixAngle(getAngleByValue(itemValue));
    function containerProps(){
        let style:any;
        if(!round){style = {[getSide()]:getXPByValue(itemValue) + '%'}}
        else {style = {transform:`rotate(${angle}deg)`}}
        return {className:'aio-input-value-container',draggable:false,style}
    }    
    let PROPS:I_RangeValue = {
        rootProps,value:itemValue,index,disabled:isValueDisabled(itemValue),
        angle,parentDom:dom
    }
    return (<div {...containerProps()} key={index}><RangeHandle {...PROPS}/> <RangePoint {...PROPS} /></div>)
}
const RangeRect:FC<I_RangeRect> = ({thickness,color,from,to,className,style})=>{
    let {getXPByValue,rootProps,getSide}:I_RangeContext = useContext(RangeContext);
    let {vertical} = rootProps,startSide = getXPByValue(from),endSide = getXPByValue(to);
    let Style:any = {[vertical?'width':'height']:thickness,[getSide()]:startSide + '%',[vertical?'height':'width']:(endSide - startSide) + '%',background:color,...style}
    return <div className={className} style={Style}/>
}
const RangeArc:FC<I_RangeArc> = ({rootProps,thickness,color,from,to,radius,rotate})=>{
    let {fixAngle,getAngleByValue}:I_RangeContext = useContext(RangeContext);
    let {size = Def('range-size'),reverse} = rootProps;
    let startAngle = fixAngle(getAngleByValue(from,rotate));
    let endAngle = fixAngle(getAngleByValue(to,rotate));
    if(endAngle === 0){endAngle = 360}
    let x = size / 2,y = size / 2,a = startAngle, b = endAngle;
    if(reverse){b = startAngle; a = endAngle}
    return <path key={`from${from}to${to}`} d={svgArc(x,y,radius,a,b)} stroke={color} strokeWidth={thickness} fill='transparent'/>
}
const RangePoint:FC<I_RangeValue> = (props) => {
    let {getOffset}:I_RangeContext = useContext(RangeContext);
    let [temp] = useState<any>({dom:createRef()})
    let {rootProps,value,disabled,angle,index,parentDom} = props;
    if(rootProps.point === false){return null}
    let {round,size = 72} = rootProps;
    let point = (rootProps.point || (()=>{}))(value,{disabled,angle,value,index}) || {}
    let {attrs = {},className,style,html = '',offset = 0} = point;
    let zIndexAttrs = getEventAttrs('onMouseDown',()=>{
        let containers = $(parentDom.current).find('aio-input-value-container');
        containers.css({zIndex:10});
        containers.eq(index).css({zIndex:100})
    })
    let containerProps = {ref:temp.dom,className:'aio-input-range-point-container',style:round?{left:size / 2 + offset}:{[getOffset()]:offset},draggable:false}
    let pointProps = addToAttrs(attrs,{className:['aio-input-range-point',className],style,attrs:{draggable:false,'data-index':index,...zIndexAttrs}})
    return (<div {...containerProps}><div {...pointProps}>{html}</div></div>)
}
const RangeHandle:FC<I_RangeValue> = (props) => {
    let {rootProps,value,angle,disabled} = props;
    let {handle = (()=>{}),size = 72,round} = rootProps;
    if(handle === false || !round){return null}
    if(handle && typeof handle !== 'function'){
        alert(`aio-input error => in type round, handle props should be a function,
        handle type = (value:number,{disabled:boolean,angle:number})=>{attrs:any}`)
        return null
    }
    let {attrs = {}} = handle(value,{angle,disabled,value}) || {}
    let PROPS = addToAttrs(attrs,{className:'aio-input-handle',style:{width:size / 2,...attrs.style},attrs:{draggable:false}})
    return (<div {...PROPS}></div>)
}
const RangeItems:FC<I_RangeItems> = (props) => {
    let {dom,rootProps}:I_RangeContext = useContext(RangeContext)
    let {type} = props;
    let {round,start = 0,end = 360,reverse,vertical} = rootProps;
    let [def_scale] = useState<React.ReactNode>(getDefScale);
    function getDefScale(){return RENDER(true)}
    let [def_label] = useState<React.ReactNode>(getDefLabel);
    function getDefLabel(){return RENDER(true)}
    function getList(item:AI_scales):number[]{
        let {step,list = []} = item,res:number[] = [];
        if(step){
            let endStep = !round || round !== 1;
            let stepLength = Math.floor((end - start) / step) + (endStep?1:0);
            res = new Array(stepLength).fill(0).map((o,i)=>i * step);
        }
        for(let i = 0; i < list.length; i++){
            if(res.indexOf(list[i]) === -1){res.push(list[i])}
        }
        return res;
    }
    function updateLabels() {
        if(round || type !== 'label' || vertical){return}
        let container = $(dom.current);
        let labels = container.find('.aio-input-range-label');
        if (!labels.length) { return; }
        let firstLabel:any = labels.eq(0);
        let firstLabelHProp = firstLabel.attr('data-rotated') === 'yes' ? 'height' : 'width';
        let end = firstLabel.offset().left + (!reverse?firstLabel[firstLabelHProp]():0);
        for (let i = 1; i < labels.length; i++) {
            let label:any = labels.eq(i);
            let hProp = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
            label.css({ display: 'flex' })
            let left = label.offset().left
            let width = label[hProp]();
            let right = left + width;
            if(!reverse){
                if (left < end + 5) {label.css({ display: 'none' })}
                else { end = left + width; }
            }
            else {
                if (right > end - 5) {label.css({ display: 'none' })}
                else { end = left; }
            }   
        }
    }
    useEffect(()=>{$(window).on('resize', updateLabels)},[])
    useEffect(()=>{updateLabels()})
    function RENDER(init:boolean):React.ReactNode{
        let entity:AI_scales = {label:rootProps.labels,scale:rootProps.scales}[type] as AI_scales
        let setting = {label:rootProps.label,scale:rootProps.scale}[type] || (()=>{return {}})
        if(!entity){return null}
        if(!init && !entity.dynamic){
            let dic:{scale:React.ReactNode,label:React.ReactNode} = {scale:def_scale,label:def_label}
            return dic[type] as React.ReactNode
        }
        return (
            <>
                {
                    getList(entity).map((itemValue,i)=>{
                        return <RangeItem key={type + itemValue} setting={setting} itemValue={itemValue} type={type}/>
                    })
                }
            </>
        )
    }
    return <>{RENDER(false)}</>
}
const RangeItem:FC<I_RangeItem> = (props) => {
    let {value,rootProps,isValueDisabled,fixAngle,getAngleByValue,getXPByValue,getSide,getOffset}:I_RangeContext = useContext(RangeContext);
    let {setting,itemValue,type} = props;
    let {round,size = Def('range-size')} = rootProps;
    let angle:number;
    if(round){angle = fixAngle(getAngleByValue(itemValue))}
    let disabled = isValueDisabled(itemValue);
    function getContainerStyle(distance:any){
        if(round){return {transform:`rotate(${angle}deg)`}}
        else {return {[getSide()]:getXPByValue(itemValue)+'%',...distance}}
    } 
    function getTextStyle(item:AI_scale,distance:any,type:'scale' | 'label'){
        let {attrs = {},style,fixAngle = (type === 'label')} = item;
        if(round){
            let res:any = {};
            if(fixAngle){res.transform = `rotate(${-angle}deg)`}
            return {...res,...distance,...attrs.style,...style}
        }
        return {...attrs.style,...style}
    }
    function getDistanceByOffset(offset:any){
        let def:{[key:string]:number} = {'round-point':-8,'round-label':8,'round-scale':4,'point':0}
        if(offset === undefined){offset = def[`${round?'round-':''}${type}`] || 0;}
        if(!round){
            let sign = offset < 0?'-':'+';
            let distance = offset?`calc(50% ${sign} ${Math.abs(offset)}px)`:undefined;
            return {[getOffset()]:distance}
        }
        else {return {left:size / 2 + offset}}
    }
    function getDetails(setting:(value:number,p:any)=>AI_scale,itemValue:number,type:'scale' | 'label'){
        let item:AI_scale = setting(itemValue,{disabled,angle,value});
        let {offset = !round && type === 'label'?16:0,html = type === 'label'?itemValue:undefined,className,attrs} = item;
        let distance = getDistanceByOffset(offset)
        let text = html;
        let containerStyle = getContainerStyle(distance);
        let containerProps = {className:`aio-input-range-${type}-container`,style:containerStyle,draggable:false,key:itemValue};
        let textProps = addToAttrs(attrs,{className:[`aio-input-range-${type}`,className],style:getTextStyle(item,distance,type),attrs:{draggable:false}})
        return {text,textProps,containerProps}
    }
    let {text,textProps,containerProps} = getDetails(setting,itemValue,type);
    return (<div {...containerProps} key={containerProps.key}><div {...textProps}>{text}</div></div>)
}
