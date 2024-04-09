import React,{Component,createRef} from 'react';
import $ from 'jquery';
import "./index.css";
type I_ACS = {autoSlide?:number,items:React.ReactNode[],speed?:number,arrow?:boolean,attrs?:any}
type I_ACS_state = {moving:boolean,left:number,lastLeft:number}
export default class AIOContentSlider extends Component<I_ACS,I_ACS_state> {
  dom:any;
  index:number;
  interval1:any;
  interval2:any;
  so:any;
  autoSlide:number;
  speed:number;
  constructor(props){
    super(props);
    let {autoSlide = 4000,speed = 90} = props;
    if(speed > 99){speed = 99} if(speed < 1){speed = 1} 
    this.dom = createRef();
    this.index = 0;
    this.speed = speed;
    this.autoSlide = autoSlide
    this.state = {left:0,lastLeft:0,moving:false}
    this.auto();
  }
  auto(){
    let {items} = this.props;
    if(!this.autoSlide || items.length < 2){return}
    clearInterval(this.interval1)
    this.interval1 = setInterval(()=>{
      let {moving} = this.state;
      if(moving){return}
      let width = this.getWidth();
      this.scroll(width,1)
    },this.autoSlide)
  }
  getSlides(){
    let {items} = this.props;
    let {moving} = this.state;
    if(!moving){return [items[this.index]]}
    if(items.length < 2){return items;}
    let index = this.index;
    return [
      items[index - 1 < 0?items.length - 1:index - 1],
      items[index],
      items[index + 1 > items.length - 1?0:index + 1] 
    ];
  }
  getWidth(){return $(this.dom.current).width()}
  mouseDown(e){
    let {moving} = this.state;
    let {items} = this.props;
    if(moving || items.length < 2){return}
    let {x} = this.getClient(e);
    let width = this.getWidth();
    this.so = {x,left:-width,width};
    this.setState({left:-width,lastLeft:-width,moving:true})
    this.eventHandler('window','mousemove',$.proxy(this.mouseMove,this));
    this.eventHandler('window','mouseup',$.proxy(this.mouseUp,this));
  }
  setIndex(offset){
    let {items} = this.props;
    this.index += offset;
    if(this.index < 0){this.index = items.length - 1}
    if(this.index > items.length - 1){this.index = 0}
  }
  stopScroll(offset){
    this.auto();
    clearInterval(this.interval2);
    this.setIndex(offset);
    this.setState({moving:false})
  }
  scroll(width,dir){
    let obj = {moving:true,left:-width,lastLeft:-width}
    for(let prop in obj){this.state[prop] = obj[prop]}
    this.startScroll(dir)
  }
  startScroll(offset){
    let step = 5;
    let width = this.getWidth();
    let newLeft = this.state.lastLeft + (-offset * width);
    let dir = -offset * step;
    this.interval2 = setInterval(()=>{
      let {left} = this.state;  
      if(dir > 0 && left >= newLeft){this.stopScroll(offset)}
      else if(dir < 0 && left <= newLeft){this.stopScroll(offset)}
      else{
        let newLeft = left + dir;
        console.log(newLeft,width)
        if(newLeft < -width * 2){newLeft = -width * 2}
        this.setState({left:newLeft})
      }
    },(50 - this.speed * 0.5) / 10)
  }
  mouseMove(e){
    let {x} = this.getClient(e);
    let offset = x - this.so.x;
    if(Math.abs(offset) >= this.so.width - 10){return}
    this.setState({left:this.so.left + offset})
  }
  mouseUp(){
    this.eventHandler('window','mousemove',this.mouseMove,'unbind');
    this.eventHandler('window','mouseup',this.mouseUp,'unbind');
    let {left,lastLeft} = this.state;
    if(left === lastLeft){
      this.stopScroll(0);
      return 
    }
    let newLeft;
    if(left < lastLeft){newLeft = lastLeft - this.so.width;}
    else if(left > lastLeft){newLeft = lastLeft + this.so.width;}
    if(lastLeft === newLeft){return}
    let offset;
    if(newLeft > lastLeft){offset = -1;}
    else{offset = 1;}
    this.startScroll(offset)
  }
  getArrow(type){
    let {arrow = true,items} = this.props;
    if(!arrow || items.length < 2){return null}
    let style= {},html,onClick;
    if(type === 'left'){
      style = {left:0};
      html = (
        <svg key={type} viewBox="0 0 24 24" role="presentation" style={{width: '1.5rem',height: '1.5rem'}}>
          <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" style={{fill: 'currentcolor'}}></path>
        </svg>
      );
      onClick = ()=>{
        if(this.state.moving){return}
        let width = this.getWidth()
        this.scroll(width,-1)
      }
    }
    else {
      style = {right:0};
      html = (
        <svg key={type} viewBox="0 0 24 24" role="presentation" style={{width: '1.5rem',height: '1.5rem'}}>
          <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" style={{fill: 'currentcolor'}}></path>
        </svg>
      );
      onClick = ()=>{
        if(this.state.moving){return}
        let width = this.getWidth()
        this.scroll(width,1);
      }
    }
    return (
      <div className='rh-slider-arrow' style={style} onClick={onClick}>{html}</div>
    )
  }
  getClient(e){
    if('ontouchstart' in document.documentElement){
      if(!e.changedTouches){return {x:0,y:0}}
      return {x: e.changedTouches[0].clientX,y:e.changedTouches[0].clientY }
    }
    return {x:e.clientX,y:e.clientY}
  }
  eventHandler(selector, event, action,type = 'bind'){
    var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" }; 
    event = 'ontouchstart' in document.documentElement ? me[event] : event;
    var element = typeof selector === "string"?(selector === "window"?$(window):$(selector)):selector; 
    element.unbind(event, action); 
    if(type === 'bind'){element.bind(event, action)}
  }
  dots_node(){
    let {items} = this.props;
    return <ReactSliderDots attrs={{}} index={this.index} length={items.length}/>
  }
  slides_node(){
    let {moving,left} = this.state;
    let slides = this.getSlides()
    let style = {left:moving?left:0}
    let p = {
      className:'rh-slider-items',
      style,draggable:false,
      ['ontouchstart' in document.documentElement?'onTouchStart':'onMouseDown']:this.mouseDown.bind(this),
      onDragStart:(e)=>e.preventDefault(),
    }
    return (
      <div {...p}>{slides.map((o,i)=><div key={i} className='rh-slider-item msf'>{o}</div>)}</div>  
    )
  }
  render(){
    let {attrs} = this.props;
    return (
    <div className='rh-slider' {...attrs} ref={this.dom}>
      {this.slides_node()}
      {this.getArrow('left')}
      {this.getArrow('right')}
      {this.dots_node()}
    </div>
    
  );
  }
}


function ReactSliderDots(props) {
  let {attrs = {},rtl,index,length,size,gap,activeColor,deactiveColor} = props;
  return (
    <div {...attrs} className={'react-slider-dots' + (attrs.className?' ' + attrs.className:'')} style={{direction:rtl?'rtl':'ltr',...attrs.style}}>
      <div style={{flex:1}}></div>
      {new Array(length).fill(0).map((o,i) => {
        let active = i === index;
        let style = {width:size,height:size,background:active?activeColor:deactiveColor,margin:gap?`0 ${gap}px`:undefined}
        return (<div key={i} className={'react-slider-dots-item' + (active?' active':'')} style={style}></div>)
      })}
      <div style={{flex:1}}></div>
    </div>
  )
}