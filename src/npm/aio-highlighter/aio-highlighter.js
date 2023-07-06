import React ,{Component}from "react";
import RVD from './../react-virtual-dom/react-virtual-dom';
import anime from "animejs/lib/anime.es.js";
import $ from 'jquery';
import "./aio-highlighter.css";
export default class AIOHighlighter extends Component {
  constructor(props){
    super(props);
    let {id} = props;
    this.state = {
      limit:{Left:0,Top:0,Width:0,Height:0,TopSpace:0,BottomSpace:0},prevId:id,background:'rgba(0,0,0,0.8)',index:-1,
    }
  }
  componentDidMount(){
    this.update()
  }
  getArrowIcon(props){
    return (
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	      viewBox="0 0 512 512" xml:space="preserve" {...props}>
        <g>
          <path class="st0" d="M242.1,45.2c7.7-7.7,20.2-7.7,27.8-0.1l0.1,0.1l236.3,236.3c7.7,7.7,7.7,20.2,0,27.9c-7.7,7.7-20.2,7.7-27.9,0
            L256,86.9L33.7,309.3c-7.7,7.7-20.2,7.7-27.9,0c-7.7-7.7-7.7-20.2,0-27.9L242.1,45.2z"/>
          <path class="st0" d="M242.1,202.7c7.7-7.7,20.2-7.7,27.8-0.1l0.1,0.1L506.2,439c7.7,7.7,7.7,20.2,0,27.9c-7.7,7.7-20.2,7.7-27.9,0
            L256,244.5L33.7,466.9c-7.7,7.7-20.2,7.7-27.9,0c-7.7-7.7-7.7-20.2,0-27.9L242.1,202.7z"/>
        </g>
      </svg>
    )
  }
  getArrow(dir,left,width){
    let center = left + width / 2;
    let Left = center - 12;
    let style = {position:'absolute',height:24,width:24,left:Left}
    let props = {width:24,height:24,style,className:`aio-highlight-arrow-${dir}`}
    return {
      className:'p-v-12',size:48,
      html:this.getArrowIcon(props)
    }
  }
  getHtml(index,limit,dir){
    let {html} = this.props;
    let column
    if(dir === 'top'){
      column = [
        {flex:1},
        {align:'vh',html:html(index,limit)},
        this.getArrow(dir,limit.Left,limit.Width)
      ]
    }
    else {
      column = [
        this.getArrow(dir,limit.Left,limit.Width),
        {align:'vh',html:html(index,limit)},
        {flex:1}
      ]
    }
    return (
      <RVD
        layout={{
          flex:1,style:{position:'absolute',left:0,top:0,height:'100%',width:'100%'},
          column
        }}
      />
    )
  }
  getDomLimit(dom){
      let {padding} = this.props;
      let offset = dom.offset();
      let left = offset.left - window.pageXOffset;
      let top = offset.top - window.pageYOffset;
      let pageHeight = window.innerHeight;
      let width = dom.outerWidth();
      let height = dom.outerHeight();
      let Top = top - 1 * padding;
      let Left = left - 1 * padding;
      let Width = width + 2 * padding;
      let Height = height + 2 * padding;
      let TopSpace = top;
      let BottomSpace = pageHeight - (top + height)
      return {Left,Top,Width,Height,TopSpace,BottomSpace};
    }
    handleIdChange(){
      let {prevId} = this.state,{dom} = this.props;  
      if(this.props.id !== prevId){
        setTimeout(()=>this.update(dom),0)
    }
  }
  update(){
    let {limit} = this.state,{id} = this.props; 
    var easingNames = [
      'easeInQuad','easeInCubic','easeInQuart','easeInQuint','easeInSine','easeInExpo','easeInCirc','easeInBack','easeOutQuad','easeOutCubic','easeOutQuart','easeOutQuint','easeOutSine','easeOutExpo',
      'easeOutCirc','easeOutBack','easeInBounce','easeInOutQuad','easeInOutCubic','easeInOutQuart','easeInOutQuint','easeInOutSine','easeInOutExpo','easeInOutCirc','easeInOutBack','easeInOutBounce',
      'easeOutBounce','easeOutInQuad','easeOutInCubic','easeOutInQuart','easeOutInQuint','easeOutInSine','easeOutInExpo','easeOutInCirc','easeOutInBack','easeOutInBounce',
    ]
    let next = this.getNextElement();
    if(!next){return}
    let [element,index] = next;
    let newLimit = this.getDomLimit(element)
    anime({
      targets: [limit],Top: newLimit.Top,Left: newLimit.Left,Width: newLimit.Width,Height: newLimit.Height,TopSpace:newLimit.TopSpace,
      BottomSpace:newLimit.BottomSpace,duration: 700,count: 1,loop: false,easing: easingNames[23],update: () => this.setState({})
    });
    this.setState({prevId:id,index})
  }
  getNextElement(){
    let {target,onClose = ()=>{},element} = this.props,{index} = this.state;
    if(typeof target === 'string'){
      let elements = $(target)
      index++;
      if(index >= elements.length){onClose(); return false}
      return [elements.eq(index),index]
    }
    else if(Array.isArray(target)){
      let elements = target.map((o)=>$(o))
      index++;
      if(index >= elements.length){onClose(); return false}
      return [elements[index],index]
    }
    else if(typeof target === 'object'){
      return [target]
    }
  }
  click(){
    this.update(); 
  }
  
  render(){
    let {limit,index} = this.state;
    let {mouseAccess} = this.props;
    this.handleIdChange();
    return (
    <RVD
      layout={{
        className:'fullscreen aio-highlighter',
        style:{pointerEvents:mouseAccess?'none':'all'},
        column:[
          {
            size:limit.Top,align:'vh',className:'aio-highlighter-mask',
            html:limit.TopSpace > limit.BottomSpace?this.getHtml(index,limit,'top'):undefined,
            onClick:()=>this.click(),
          },
          {
            size:limit.Height,
            row:[
              {
                size:limit.Left,className:'aio-highlighter-mask',
                onClick:()=>this.click()
              },
              {
                size:limit.Width,
                html:(<div className='aio-highlighter-focus'></div>)
              },
              {
                flex:1,className:'aio-highlighter-mask',
                onClick:()=>this.click()
              },
            ]
          },
          {
            flex:1,align:'vh',className:'aio-highlighter-mask',
            onClick:()=>this.click(),
            html:limit.TopSpace <= limit.BottomSpace?this.getHtml(index,limit,'bottom'):undefined
          },
        ]
      }}
    />
  );
  }
}
