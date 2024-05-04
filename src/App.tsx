import React,{Component, useState} from "react";
import './App.css'
import {Storage} from './npm/aio-utils/index.tsx';
import { AIOInputSetStorage } from "./npm/aio-input/index.tsx";
import DOC_AIOInput_Inputs from './documents/aio-input/aio-input-inputs/doc-aio-input-inputs.tsx';
import DOC_AIOInput_Table from "./documents/aio-input/aio-input-table/doc-aio-input-table.tsx";
import DOC_AIOInput_Map from './documents/aio-input/aio-input-map/doc-aio-input-map.tsx';
import DOC_AIOValidation from "./documents/aio-validation/doc-aio-validation.js";
import DOC_AIOHighlighter from './documents/aio-highlighter/doc-aio-highlighter.tsx';
import DOC_AIOLoading from './documents/aio-loading/doc-aio-loading.js';
import DOC_AIOContentSlider from './documents/aio-content-slider/doc-aio-content-slider.tsx';
import DOC_AIOGauge from './documents/aio-gauge/doc-aio-gauge.js';
import DOC_AIOSwip from './documents/aio-swip/doc-aio-swip.tsx';
import DOC_AIOChart from './documents/aio-chart/doc-aio-chart.tsx';
import DOC_AIOFloater from './documents/aio-floater/doc-aio-floater.js';
import Puzzle from './documents/puzzle/index';
import DOC_AIOInput_List from './documents/aio-input/aio-input-list/doc-aio-input-list.tsx';
import DOC_AIOService from './documents/aio-service/doc-aio-service.js';
import DOC_AIOPopup from './documents/aio-popup/doc-aio-popup.tsx';
import DOC_AIOCanvas from './documents/aio-canvas/doc-aio-canvas.tsx';
import DOC_AIOLogin from './documents/aio-login/doc-aio-login.js';
import DOC_AIOShop from './documents/aio-shop/doc-aio-shop.tsx';
import DOC_MSFLoading1 from "./documents/msfloading1/msfloading1.tsx";
import DOC_ReactVirtualDom from './documents/react-virtual-dom/doc-react-virtual-dom.tsx';
import DOC_Acardion from './documents/aio-input/aio-input-acardion/doc-aio-input-acardion.tsx';
import Test from './test.tsx';
import T1 from './documents/t1/t1.js';
import Versions from './versions.js';
import DOC_Tree from "./documents/aio-input/aio-input-tree/doc-aio-input-tree.tsx";
AIOInputSetStorage('mapApiKeys',{
  map:'web.0a2aa5f83d314a8c9916473aa0e01438',
  service:'service.09a2234e299a4ff585007b2894df9fca',
})
export default function AIOComponents(){
  let [storage] = useState<Storage>(new Storage('aio-componentspart'))
  let [part,setPart] = useState(storage.load('part','aio-input'))
  let [parts] = useState<any>({
    'versions':Versions,
    'aio-input-inputs':DOC_AIOInput_Inputs,
    'aio-input-table':DOC_AIOInput_Table,
    'aio-input-list':DOC_AIOInput_List,
    'aio-input-map':DOC_AIOInput_Map,
    'aio-input-acardion':DOC_Acardion,
    'aio-input-tree':DOC_Tree,
    'aio-highlighter':DOC_AIOHighlighter,
    'aio-validation':DOC_AIOValidation,
    'aio-loading':DOC_AIOLoading,
    'aio-content-slider':DOC_AIOContentSlider,
    'aio-gauge':DOC_AIOGauge,
    'aio-swip':DOC_AIOSwip,
    'aio-chart':DOC_AIOChart,
    'aio-floater':DOC_AIOFloater,
    'puzzle':Puzzle,
    'aio-service':DOC_AIOService,
    'aio-popup':DOC_AIOPopup,
    'aio-canvas':DOC_AIOCanvas,
    'aio-login':DOC_AIOLogin,
    'aio-shop':DOC_AIOShop,
    'react-virtual-dom':DOC_ReactVirtualDom,
    'msfloading1':DOC_MSFLoading1,
    't1':T1,
    'test':Test
  })
  function changePart(part){
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