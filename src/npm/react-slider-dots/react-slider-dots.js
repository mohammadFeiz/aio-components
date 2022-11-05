import React from "react";
import "./index.css";

export default function ReactSliderDots(props) {
  let {attrs = {},rtl,index,length,size,gap,activeColor,deactiveColor} = props;
  return (
    <div {...attrs} className={'react-slider-dots' + (attrs.className?' ' + attrs.className:'')} style={{direction:rtl?'rtl':'ltr',...attrs.style}}>
      <div style={{flex:1}}></div>
      {new Array(length).fill(0).map((o,i) => {
        let active = i === index;
        let style = {width:size,height:size,background:active?activeColor:deactiveColor,margin:gap?`0 ${gap}px`:undefined}
        return (<div className={'react-slider-dots-item' + (active?' active':'')} style={style}></div>)
      })}
      <div style={{flex:1}}></div>
    </div>
  )
}
