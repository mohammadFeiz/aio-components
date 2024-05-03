import React ,{useEffect, useRef, useState}from "react";
import RVD from '../react-virtual-dom/index.tsx';
import anime from "animejs/lib/anime.es.js";
import "./index.css";
import { I_RVD_node } from "../react-virtual-dom/types.tsx";
type AH_items = (index:number,limit:AH_limit)=>{dom:any,html:React.ReactNode}
type AH_easing = 'linear'|'easeInQuad'|'easeInCubic'|'easeInQuart'|'easeInQuint'|'easeInSine'|'easeInExpo'|'easeInCirc'|'easeInBack'|'easeOutQuad'|'easeOutCubic'|'easeOutQuart'|'easeOutQuint'|'easeOutSine'|'easeOutExpo'|
'easeOutCirc'|'easeOutBack'|'easeInBounce'|'easeInOutQuad'|'easeInOutCubic'|'easeInOutQuart'|'easeInOutQuint'|'easeInOutSine'|'easeInOutExpo'|'easeInOutCirc'|'easeInOutBack'|'easeInOutBounce'|
'easeOutBounce'|'easeOutInQuad'|'easeOutInCubic'|'easeOutInQuart'|'easeOutInQuint'|'easeOutInSine'|'easeOutInExpo'|'easeOutInCirc'|'easeOutInBack'|'easeOutInBounce'
type AH_React = {
  getActions?:(p:{update:()=>void})=>void,
  padding?:number,
  items:AH_items,
  mouseAccess?:boolean,
  style?:any,
  easing?:number | AH_easing,
  duration?:number
}
type AH = {
  items:AH_items,
  padding?:number,
  mouseAccess?:boolean,
  style?:any,
  easing?:number | AH_easing,
  duration?:number
}
export default class AIOHighlighter{
  render:()=>React.ReactNode;
  update:()=>void;
  constructor(props:AH){
    this.update = ()=>{}
    this.render = ()=><AHReact {...props} getActions={({update})=>this.update = update}/>;
  }
}
type AH_limit = {Left:number,Top:number,Width:number,Height:number,TopSpace:number,BottomSpace:number}
function AHReact(props:AH_React) {
  let {getActions,padding = 6,items,mouseAccess,style,easing,duration = 1200} = props;
    
  let [index,setIndex] = useState<number>();
  let [limit,setLimit] = useState<AH_limit>({Left:0,Top:0,Width:0,Height:0,TopSpace:0,BottomSpace:0})
  let limitRef = useRef(limit);
  limitRef.current = limit;
  useEffect(()=>{
    if(getActions){getActions({update})}
    setIndex(0);
    update()
  },[])
  function getDomLimit(dom:any):AH_limit{
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
    let res:AH_limit = {Left,Top,Width,Height,TopSpace,BottomSpace};
    return res
  }
  function getEasing(){
    var easingNames = [
      'linear',
      'easeInQuad',//1
      'easeInSine',//5
      'easeInCirc',//7
      'easeInBack',//8
      'easeOutQuad',//9
      'easeOutSine',//13
      'easeOutCirc',//15
      'easeInOutQuad',//18
      'easeInOutSine',//22
      'easeInOutBack',//25
      'easeOutBounce',//27
    ]
    if(typeof easing === 'number'){
      let res = easingNames[easing]
      return res || easingNames[0]
    }
    return easing
    
  }
  function update(){
    index = (index === undefined?-1:index) + 1;
    let res:any = items(index,limitRef.current);
    if(!res){return}
    try{
      let {dom} = res;
      dom[0].scrollIntoView();
      let newLimit:AH_limit = getDomLimit(dom)
      let easing = getEasing()
      let obj:any = {
        ...newLimit,
        targets: [{...limitRef.current}],
        duration,
        update: ({animatables}) => {
          setLimit({...animatables[0].target})
        }
      }
      if(easing){obj.easing = easing}
      anime(obj);
      setIndex(index)
    }
    catch{
      alert(`
        aio-highlighter error => connot find dom
      `)
    }
  }
  function getArrowIcon(props):React.ReactNode{
    return (
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	      viewBox="0 0 512 512" {...props}>
        <g>
          <path d="M242.1,45.2c7.7-7.7,20.2-7.7,27.8-0.1l0.1,0.1l236.3,236.3c7.7,7.7,7.7,20.2,0,27.9c-7.7,7.7-20.2,7.7-27.9,0
            L256,86.9L33.7,309.3c-7.7,7.7-20.2,7.7-27.9,0c-7.7-7.7-7.7-20.2,0-27.9L242.1,45.2z"/>
          <path d="M242.1,202.7c7.7-7.7,20.2-7.7,27.8-0.1l0.1,0.1L506.2,439c7.7,7.7,7.7,20.2,0,27.9c-7.7,7.7-20.2,7.7-27.9,0
            L256,244.5L33.7,466.9c-7.7,7.7-20.2,7.7-27.9,0c-7.7-7.7-7.7-20.2,0-27.9L242.1,202.7z"/>
        </g>
      </svg>
    )
  }
  function getArrow(dir,left,width):I_RVD_node{
    let center = left + width / 2,Left = center - 12;
    let style = {position:'absolute',height:24,width:24,left:Left}
    let props = {width:24,height:24,style,className:`a-h-arrow-${dir}`}
    return {className:'p-v-12',size:48,html:getArrowIcon(props)}
  }
  function getHtml(dir):React.ReactNode{
    if(index === undefined){return ''}
    let column;
    let res = items(index,limitRef.current);
    if(!res){return null}
    let {html = ''} = res;
    let space = {flex:1};
    let content = {html,className:'a-h-html align-vh'}
    let arrow = getArrow(dir,limitRef.current.Left,limitRef.current.Width);
    if(dir === 'top'){column = [space,content,arrow]}
    else {column = [arrow,content,space]}
    return (<RVD rootNode={{flex:1,className:'a-h-html-container',column}}/>)
  }
  function click(){
    if(mouseAccess){return}
    update()
  }
  function vMask_node(type:'top' | 'bottom' | 'left' | 'right'):I_RVD_node{
    let html:React.ReactNode = '',size:number,className = 'a-h-mask align-vh'
    let limit = limitRef.current;
    if(type === 'top'){
      size = limit.Top;
      if(limit.TopSpace > limit.BottomSpace){html = getHtml('top')}
    }
    else if(type === 'bottom'){
      className += ' flex-1';
      if(limit.TopSpace <= limit.BottomSpace){html = getHtml('bottom')}
    }
    else if(type === 'left'){size = limit.Left;}
    else {className += ' flex-1';}
    return {size,className,html,onClick:()=>click()}
  }
  function focus_node(){return {size:limit.Width,html:(<div className='a-h-focus'></div>),onClick:mouseAccess?undefined:()=>click()}}
  function main_node(){return {size:limit.Height,row:[vMask_node('left'),focus_node(),vMask_node('right')]}}
  return (
    <RVD
      rootNode={{
        className:'a-h',style:{pointerEvents:mouseAccess?'none':'all',...style},
        column:[vMask_node('top'),main_node(),vMask_node('bottom')]
      }}
    />
  );
}
