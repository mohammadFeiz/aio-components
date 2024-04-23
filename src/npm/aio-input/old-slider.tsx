import React, { useEffect } from "react";
import { createContext, createRef, useContext, useState } from "react";
import { AI_context, I_SliderFill, I_SliderLabel, I_SliderPoint, I_SliderScale, I_Slider_context, I_Slider_statics } from "./types";
import { EventHandler, GetClient } from "../aio-utils";
import $ from 'jquery';
const AICTX = createContext({} as any);
const SliderContext = createContext({} as any);

function RangeSlider() {
    let {rootProps,touch}:AI_context = useContext(AICTX);
    let {direction = 'right',step = 1, start = 0, end = 100, min = start, max = end, disabled,attrs = {}, scale,label,multiple} = rootProps;
    let [statics] = useState(getStatics())
    let [dom] = useState(createRef())
    let [isDown,setIsDown] = useState(false)
    let [moved] = useState<boolean>(false);
    let [startOffset] = useState<{ x:number, y:number, size:number, index: number[], value: number[], startLimit: number, endLimit: number }>()
    let value = getValidValue()
    function onChange(value:number[],drag:boolean){
        rootProps.onChange(multiple?[...value]:value[0],drag)
    }
    function getStatics():I_Slider_statics{
        if (direction === 'left') {return {getDiff:function (x, y, client) { return x - client.x; },oriention:'h'}}
        else if (direction === 'right') {return {getDiff:function (x, y, client) { return client.x - x; },oriention:'h'}}
        else if (direction === 'top') {return {getDiff:function (x, y, client) { return y - client.y; },oriention:'v',flexDirection:'column-reverse'}}
        else {return {getDiff:function (x, y, client) { return client.y - y; },oriention:'v',flexDirection:'column'}}
    }
    function getPercentByValue(value, start, end) { return 100 * (value - start) / (end - start); }
    function fix(number) {
        let dotPos = step.toString().indexOf('.');
        let a = dotPos === -1 ? 0 : step.toString().length - dotPos - 1;
        return parseFloat((number).toFixed(a));
    }
    function getStartByStep(start, step) {
        var a = Math.round((start - step) / step) * step;
        while (a < start) { a += step; } return a;
    }
    function getValidValue() {
        let {value} = rootProps;
        if (!Array.isArray(value)) {value = [value || 0]}
        for (var i = 0; i < value.length; i++) {
            var point = value[i] || 0;
            point = Math.round((point - start) / step) * step + start;
            if (point < min) { point = min; }
            if (point > max) { point = max; }
            value[i] = point;
        }
        return value
    }
    function getOffset(x, y, size, e) {return Math.round((end - start) * statics.getDiff(x, y, GetClient(e)) / size / step) * step;}
    function getPercents() {
        var percents = value.map((o, i) => [
            getPercentByValue(i ? value[i - 1] : start, start, end),
            getPercentByValue(o, start, end)
        ]);
        percents.push([percents[percents.length - 1][1], 100])
        return percents;
    }
    function decreaseAll(Step = step) {
        let offset = Math.min(Step, value[0] - min);
        for (let i = 0; i < value.length; i++) {
            value[i] -= offset;
            value[i] = fix(value[i])
        }
        moved = true;
    }
    function increaseAll(Step = step) {
        let { max = end } = rootProps;
        let offset = Math.min(Step, max - value[value.length - 1]);
        for (let i = 0; i < value.length; i++) {
            value[i] += offset;
            value[i] = fix(value[i])
        }
        moved = true;
    }
    function isActive(index){
        if (value.length === 1 && index === 0) { return true }
        if (value.length > 1 && index !== 0 && index !== value.length) { return true; }
        return false
    }
    function mouseDown(e, index, type) {
        e.preventDefault();
        if (!rootProps.onChange || disabled) { return }
        let { x, y } = GetClient(e), DOM = $(dom.current);
        let pointContainers = DOM.find('.aio-slider-point-container');
        let size = DOM.find('.aio-slider-line')[statics.oriention === 'h' ? 'width' : 'height']();
        let length = value.length;
        EventHandler('window', 'mousemove', mouseMove);
        EventHandler('window', 'mouseup', mouseUp);
        moved = false;
        setIsDown(true);
        pointContainers.css({ zIndex: 10 });
        if (type === 'point') {
            let pointContainer = pointContainers.eq(index);
            pointContainer.css({ zIndex: 100 });
            pointContainer.find('.aio-slider-point').addClass('active');
            let current = value[index];
            let before = index === 0 ? min : value[index - 1];
            let after = index === value.length - 1 ? max : value[index + 1]
            startOffset = { x, y, size, index: [index], value: [current], startLimit: before - current, endLimit: after - current }
        }
        else {
            let pointContainer1 = pointContainers.eq(index - 1);
            let pointContainer2 = pointContainers.eq(index);
            pointContainer1.css({ zIndex: 100 });
            pointContainer2.css({ zIndex: 100 });
            let p1 = pointContainer1.find('.aio-slider-point');
            let p2 = pointContainer2.find('.aio-slider-point');
            p1.addClass('active');
            p2.addClass('active');

            if (index === 0) { decreaseAll(); }
            else if (index === length) { increaseAll(); }
            if (index === 0 || index === length) {
                startOffset = {
                    x, y, size,
                    index: value.map((o, i) => i), value: value.map((o) => o),
                    startLimit: min - value[0], endLimit: max - value[length - 1],
                }
            }
            else {
                let point1 = value[index - 1], point2 = value[index];
                let before = index === 1 ? min : value[index - 2];//مقدار قبلی رنج
                let after = index === length - 1 ? max : value[index + 1]; //مقدار بعدی رنج
                startOffset = {
                    x, y, size, index: [index - 1, index],
                    value: [point1, point2], startLimit: before - point1, endLimit: after - point2,
                }
            }
        }
    }
    function mouseMove(e) {
        let { x, y, size, value:v, startLimit, endLimit, index } = startOffset;
        let offset = getOffset(x, y, size, e);
        if (offset < startLimit) { offset = startLimit; }
        else if (offset > endLimit) { offset = endLimit; }
        for (let i = 0; i < v.length; i++) {
            let Index = index[i], Value = v[i], newValue = Value + offset;
            if (value[Index] === newValue) { return; }
            value[Index] = fix(newValue);
        }
        moved = true;
        console.log(value)
        onChange(value, true);
    }
    function mouseUp() {
        EventHandler('window', 'mousemove', mouseMove, 'unbind');
        EventHandler('window', 'mouseup', mouseUp, 'unbind');
        let points = $(dom.current).find('.aio-slider-point');
        points.removeClass('active');
        setIsDown(false);
        if (moved) { onChange(value, false); }
    }
    function getContext() {
        let context:I_Slider_context = {
            direction,start,end,step,statics,rootProps,mouseDown,touch,value,isDown,fix,getStartByStep,getPercentByValue,isActive
        }
        return context
    }
    function getStyle() {return { direction: 'ltr', flexDirection: statics.flexDirection }}
    function getClassName() {
        let { className } = attrs;
        return `aio-slider ${statics.oriention === 'h'?'horizontal':'vertical'}${className ? ' ' + className : ''}${disabled ? ' disabled' : ''}`;
    }
    let percents = getPercents();
    return (
        <SliderContext.Provider value={getContext()}>
            <div ref={dom as any} style={getStyle() as any} className={getClassName()}>
                <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <SliderLine />
                    {label && <SliderLabels />}
                    {scale && <SliderScales />}
                    {value.map((o, i) => <SliderFill key={i} index={i} percent={percents[i]} />)}
                    <SliderFill key={value.length} index={value.length} percent={percents[value.length]} />
                    {value.map((o, i) => <SliderPoint key={i} index={i} percent={percents[i]} />)}
                </div>
            </div>
        </SliderContext.Provider>
    );
}
function SliderLine() {
    let {rootProps}:I_Slider_context = useContext(SliderContext);
    let {grooveAttrs = {}} = rootProps;
    let className = 'aio-slider-line';
    if(grooveAttrs.className){className += ' ' + grooveAttrs.className}
    let style = grooveAttrs.style;
    let p = {...grooveAttrs,className,style}
    return (<div {...p}></div>)

}
function SliderFill(props:I_SliderFill) {
    let {statics,rootProps,mouseDown,touch,isActive,direction}:I_Slider_context = useContext(SliderContext);
    let { oriention } = statics, { percent,index } = props; 
    let [active] = useState<boolean>(isActive(index))
    let line = rootProps.line?(rootProps.line(index,active) || {}):{};
    function getContainerProps(){
        let style:any = {};
        style[{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]] = percent[0] + '%';
        if (oriention === 'h') { style.width = (percent[1] - percent[0]) + '%'; }
        else { style.height = (percent[1] - percent[0]) + '%'; }
        return {
            'data-index': index, className: 'aio-slider-fill-container', style,
            [touch ? 'onTouchStart' : 'onMouseDown']: (e) => mouseDown(e, index, 'fill')
        }
    }
    function getProps(){
        let {attrs = {}} = line;
        let style = attrs.style;
        let className = 'aio-slider-fill';
        if(active){className += ' aio-slider-fill-active'}
        if(attrs.className){className += ' ' + attrs.className}
        return {...attrs,className,style,'data-index':index}
    }
    let {html} = line;
    return (
        <div {...getContainerProps()}>
            <div {...getProps()}></div>
            {html !== undefined && <div className='aio-slider-text'>{html}</div>}
        </div>
    );
}
function SliderPoint(props:I_SliderPoint) {
    let {rootProps,isDown,mouseDown,value,touch,fix,direction}:I_Slider_context = useContext(SliderContext);
    let {percent,index} = props;
    let fixValue = fix(value[index]);
    let {attrs = {},html = '',labelAttrs = {},labelHtml = fixValue,labelShow = undefined} = (rootProps.point?rootProps.point(index,fixValue):{}) || {}
    function getContainerProps(){
        let style = { [{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]]: percent[1] + '%' };
        return {
            style, 'data-index': index, className: 'aio-slider-point-container',
            [touch ? 'onTouchStart' : 'onMouseDown']: (e) => mouseDown(e, index, 'point')
        }
    }
    function getValueProps(){
        let style;
        if (labelShow === false) { style = { display: 'none' } }
        else if (labelShow === true || labelShow === 'inline' || isDown) { style = labelAttrs.style; }
        else { style = { display: 'none' } };
        let className = `aio-slider-value ${'aio-slider-value-' + index}` + (labelShow === 'inline' ? ' aio-slider-value-inline' : '');
        return {style,className}
    }
    function getPointProps(){
        let className = 'aio-slider-point';
        if(attrs.className){className += ' ' + attrs.className}
        return { ...attrs,className, style: attrs.style, 'data-index': index };
    }
    return (
        <div {...getContainerProps()}>
            {labelShow !== 'inline' && <div {...getPointProps()}>{html}</div>}
            <div {...getValueProps()}>{labelHtml}</div>
        </div>
    );
}
function SliderLabels() {
    let {rootProps, getStartByStep,start,end,direction}:I_Slider_context = useContext(SliderContext);
    let {label = {}} = rootProps;
    let {step,list} = label;
    let [dom] = useState(createRef())
    useEffect(()=>{
        $(window).on('resize', update)
    },[])
    useEffect(()=>{
        update()
    })
    function getLabelsByStep() {
        let Labels = [];
        let value = getStartByStep(start, step);
        let key = 0;
        while (value <= end) {
            let p:I_SliderLabel = {value}
            Labels.push(<SliderLabel key={key} {...p} />);
            value += step;
            value = parseFloat(value.toFixed(6))
            key++;
        }
        return Labels;
    }
    function getLabels() { return list.map((o) => {let p:I_SliderLabel = {value:o}; return <SliderLabel key={o} {...p} />}) }
    function update() {
        let container = $(dom.current);
        let labels = container.find('.aio-slider-label-container div');
        if (!labels.length) { return; }
        let firstLabel = labels.eq(0);
        let firstLabelThickness = firstLabel.attr('data-rotated') === 'yes' ? 'height' : 'width';
        if (direction === 'right') {
            let end = firstLabel.offset().left + firstLabel[firstLabelThickness]();
            for (let i = 1; i < labels.length; i++) {
                let label = labels.eq(i);
                let thickness = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
                label.css({ display: 'block' })
                let left = label.offset().left
                let width = label[thickness]();
                if (left < end + 5) {
                    label.css({ display: 'none' })
                }
                else { end = left + width; }
            }
        }
        else if (direction === 'left') {
            var end = firstLabel.offset().left;
            for (let i = 1; i < labels.length; i++) {
                let label = labels.eq(i);
                let thickness = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
                label.css({ display: 'block' })
                let left = label.offset().left
                let width = label[thickness]();
                let right = left + width;
                if (right > end - 5) {
                    label.css({ display: 'none' })
                }
                else { end = left; }
            }
        }
    }
    return (
        <div className='aio-slider-labels' ref={dom as any}>
            {list ? getLabels() : getLabelsByStep()}
        </div>
    );
    
}
function SliderLabel(props:I_SliderLabel) {
    let {rootProps,getPercentByValue,start,end,direction}:I_Slider_context = useContext(SliderContext)
    let {label} = rootProps;
    let {html = (o)=>o,attrs:Attrs = ()=>{},rotate:Rotate = ()=>0} = label;
    let {value} = props;
    let attrs:any = Attrs(value);
    attrs = !attrs ? {} : { ...attrs }
    let key = { right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction];
    let style:any = {};
    style[key] = getPercentByValue(value, start, end) + '%';
    let rotate = (typeof label.rotate === 'function' ? label.rotate(value) : label.rotate) || 0;
    if (rotate) {
        style.transform = `rotate(${rotate + 'deg'})`;
        style.justifyContent = rotate > 0 ? 'flex-start' : 'flex-end'
    }
    let className = `aio-slider-label-container`
    if(attrs.className){className += ' ' + attrs.className}
    let onClick = !attrs.onClick?undefined:(e)=>{
        if(attrs.onClick){
            e.stopPropagation();
            attrs.onClick(value,e)
        }
    }
    let p = {onClick,...attrs,className,style}
    return (
        <div {...p}>
            <div data-rotated={rotate ? 'yes' : 'no'} style={attrs.style} className='aio-slider-label'>{html(value)}</div>
        </div>
    );
}
function SliderScales() {
    let {rootProps,getStartByStep,start,end}:I_Slider_context = useContext(SliderContext);
    let {scale = {}} = rootProps;
    let {step,list} = scale;
    let [values] = useState<number[]>(getValues())
    function getValues():number[]{
        let numbers = [],dic = {}
        if(list){
            for(let i = 0; i < list.length; i++){
                if(dic[list[i].toString()] === undefined){numbers.push(list[i]);}
            }
        }
        if(step){
            let value = getStartByStep(start, step);
            while (value <= end) {
                if(dic[value.toString()] === undefined){numbers.push(value);}
                value += step;
            }
        }
        return numbers;
    } 
    function getScales(){
        return values.map((o)=>{
            let p:I_SliderScale = {value:o};
            return <SliderScale key={o} {...p}/>
        })
    }
    let scales = getScales();
    return !scales.length?null:<div className='aio-slider-scales'>{scales}</div>
}
function SliderScale(props:I_SliderScale) {
    let {rootProps,getPercentByValue,start,end,direction} = useContext(SliderContext);
    let {value} = props;
    let {scale = {}} = rootProps;
    let {html = ()=>null} = scale;
    let attrs = ((scale.attrs?scale.attrs(value):{}) || {}) || {};
    let style = {};
    style[{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]] = getPercentByValue(value, start, end) + '%';
    let className = 'aio-slider-scale-container';
    if(attrs.className){className += ' ' + attrs.className}
    let p = {...attrs,className,style}
    return (<div {...p}><div className={'aio-slider-scale' + (attrs.className?' ' + attrs.className:'')} style={attrs.style}>{html(value)}</div></div>);
}