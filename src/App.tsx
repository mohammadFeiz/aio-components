import React,{FC, useState} from "react";
import './App.css'
import { AIOInput_defaultProps } from "./npm/aio-input/index.tsx";
import DOC_AIOInput from './documents/aio-input/doc-aio-input.tsx';
import DOC_AIOValidation from "./documents/aio-validation/doc-aio-validation.tsx";
import DOC_AIOContentSlider from './documents/aio-content-slider/doc-aio-content-slider.tsx';
import DOC_AIOSwip from './documents/aio-swip/doc-aio-swip.tsx';
import DOC_AIOFloater from './documents/aio-floater/doc-aio-floater.js';
import Puzzle from './documents/puzzle/index';
import DOC_AIOPopup from './documents/aio-popup/doc-aio-popup.tsx';
import DOC_AIOCanvas from './documents/aio-canvas/doc-aio-canvas.tsx';
import DOC_AIOShop from './documents/aio-shop/doc-aio-shop.tsx';
import UIKit from './documents/aio-input/ui-kit/ui-kit.tsx';
import Test from './test.tsx';
import Layout1 from "./documents/aio-input/ui-kit/layout1.tsx";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import './npm/aio-css/aio-css.css';
import DOC_Flip from "./documents/flip/doc-flip.tsx";
import AppContainer from './documents/aio-layout';
import DOC_Map from './documents/map/doc-map.tsx';
import AIFilter from './documents/ai-filter';
import BeenetDoc from "./documents/beenet";
import DOC_Login from './documents/login'
import DOC_AIOCss from './documents/aio-css';
import DOC_AIOSchema from './documents/aio-schema';
import DOC_AIODashboard from './documents/aio-dashboard/doc-aio-dashboard.tsx';
import DOC_RichText from './documents/rich-text';
import DOC_TreeSearch from './documents/tree-search';
export default function AIOComponents(){
  const navigate = useNavigate()
  let [parts] = useState<any>({
    'aio-input':DOC_AIOInput,
    'aio-validation':DOC_AIOValidation,
    'aio-content-slider':DOC_AIOContentSlider,
    'aio-swip':DOC_AIOSwip,
    'aio-floater':DOC_AIOFloater,
    'puzzle':Puzzle,
    'aio-popup':DOC_AIOPopup,
    'aio-canvas':DOC_AIOCanvas,
    'aio-shop':DOC_AIOShop,
    'flip':DOC_Flip,
    'kit':UIKit,
    'Layout1':Layout1,
    'aio-layout':AppContainer,
    'map':DOC_Map,
    'ai filter':AIFilter,
    'beenet':BeenetDoc,
    'Login':DOC_Login,
    'aio-css':DOC_AIOCss,
    'aio-schema':DOC_AIOSchema,
    'aio-dashboard':DOC_AIODashboard,
    'richtext':DOC_RichText,
    'test':Test,
    'tree-search':DOC_TreeSearch
  })
  function goToHome(){
    navigate('/')
  }
  return (
    <Routes>
      <Route path='/' element={<Home parts={parts}/>}/>
      {
        Object.keys(parts).map((o,i)=>{
          let TAG = parts[o];
          let path = `/${o}`
          if(o === 'aio-layout'){path += '/*'}
          return <Route key={i} path={path} element={<TAG name={o} goToHome={goToHome}/>}/>
        })
      }
    </Routes>
  )
}

const Home:FC<{parts:{[key:string]:FC}}> = (props)=>{
  const {parts} = props;
  return (
    <div className='aio-components ai'>
      {
        Object.keys(parts).map((o,i)=>{
          return (<Link key={i} className='aio-component' to={`/${o}`}>{o}</Link>)
        })
      }
    </div>
  )
}