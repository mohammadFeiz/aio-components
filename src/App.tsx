import React,{Component, useState} from "react";
import './App.css'
import {Storage} from './npm/aio-utils/index.tsx';
import { AIOInputSetStorage } from "./npm/aio-input/index.tsx";
import DOC_AIOInput from './documents/aio-input/doc-aio-input.tsx';
import DOC_AIOValidation from "./documents/aio-validation/doc-aio-validation.tsx";
import DOC_AIOHighlighter from './documents/aio-highlighter/doc-aio-highlighter.tsx';
import DOC_AIOLoading from './documents/aio-loading/doc-aio-loading.tsx';
import DOC_AIOContentSlider from './documents/aio-content-slider/doc-aio-content-slider.tsx';
import DOC_AIOSwip from './documents/aio-swip/doc-aio-swip.tsx';
import DOC_AIOChart from './documents/aio-chart/doc-aio-chart.tsx';
import DOC_AIOFloater from './documents/aio-floater/doc-aio-floater.js';
import Puzzle from './documents/puzzle/index';
import DOC_AIOPopup from './documents/aio-popup/doc-aio-popup.tsx';
import DOC_AIOCanvas from './documents/aio-canvas/doc-aio-canvas.tsx';
import DOC_AIOLogin from './documents/aio-login/doc-aio-login.js';
import DOC_AIOShop from './documents/aio-shop/doc-aio-shop.tsx';
import DOC_MSFLoading1 from "./documents/msfloading1/msfloading1.tsx";
import DOC_ReactVirtualDom from './documents/react-virtual-dom/doc-react-virtual-dom.tsx';
import DOC_AIODoc from './documents/aio-doc/doc-aio-doc.tsx';
import Test from './test.tsx';
AIOInputSetStorage('mapApiKeys',{
  map:'web.0a2aa5f83d314a8c9916473aa0e01438',
  service:'service.09a2234e299a4ff585007b2894df9fca',
})
export default function AIOComponents(){
  let [storage] = useState<Storage>(new Storage('aio-componentspart'))
  let [part,setPart] = useState(storage.load('part','aio-input'))
  let [parts] = useState<any>({
    'aio-input':DOC_AIOInput,
    'aio-highlighter':DOC_AIOHighlighter,
    'aio-validation':DOC_AIOValidation,
    'aio-loading':DOC_AIOLoading,
    'aio-content-slider':DOC_AIOContentSlider,
    'aio-swip':DOC_AIOSwip,
    'aio-chart':DOC_AIOChart,
    'aio-floater':DOC_AIOFloater,
    'puzzle':Puzzle,
    'aio-popup':DOC_AIOPopup,
    'aio-canvas':DOC_AIOCanvas,
    'aio-login':DOC_AIOLogin,
    'aio-shop':DOC_AIOShop,
    'react-virtual-dom':DOC_ReactVirtualDom,
    'aio-doc':DOC_AIODoc,
    'msfloading1':DOC_MSFLoading1,
    'test':Test
  })
  function changePart(part:any){
    storage.save('part',part)
    setPart(part)
  }
  function Part(){
    let COMPONENT = parts[part];
    if(!COMPONENT){
      changePart(false);
      return
    }
    let props = {
      goToHome:()=>changePart(false),
      name:part
    }
    return <COMPONENT {...props}/>
  }
  if(part){return Part()}
  return (
    <div className='aio-components'>
      {
        Object.keys(parts).map((o,i)=>{
          return (<div key={i} className='aio-component' onClick={()=>changePart(o)}>{o}</div>)
        })
      }
    </div>
  )
}