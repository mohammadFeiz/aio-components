import {FC, useState} from "react";
import './App.css'
import DOC_AIOInput from './documents/aio-input/doc-aio-input.tsx';
import DOC_AIOValidation from "./documents/aio-validation/doc-aio-validation.tsx";
import DOC_AIOSwip from './documents/aio-swip/doc-aio-swip.tsx';
import DOC_AIOFloater from './documents/aio-floater/doc-aio-floater.js';
import Puzzle from './documents/puzzle/index';
import DOC_AIOPopup from './documents/aio-popup/doc-aio-popup.tsx';
import Test from './test.tsx';
import { Link, Route, Routes, useLocation } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import './npm/aio-css/aio-css.css';
import DOC_Flip from "./documents/flip/doc-flip.tsx";
import DOC_Map from './documents/map/doc-map.tsx';
import AIFilter from './documents/ai-filter';
import BeenetDoc from "./documents/beenet";
import DOC_AIOCss from './documents/aio-css';
import DOC_AIOSchema from './documents/aio-schema';
import DOC_AIODashboard from './documents/aio-dashboard/doc-aio-dashboard.tsx';
import DOC_RichText from './documents/rich-text';
import DOC_TreeSearch from './documents/tree-search';
import DOC_AIOCordova from "./documents/aio-cordova/doc-aio-cordova.tsx";
import Resume from "./documents/resume/index.tsx";
import DOC_AIOSwiper from "./documents/aio-swiper/index.tsx";
import FG from "./documents/form-generator/index.tsx";
import AIOApis from './documents/aio-apis';
import ThreeD from "./documents/three-d/index.tsx";
import DOC_UseForm from "./documents/use-form/index.tsx";
import DOC_Sidenav from "./documents/sidenav/index.tsx";
import Grid from './documents/data-grid'
export default function AIOComponents(){
  const navigate = useNavigate()
  let [parts] = useState<any>({
    'aio-input':DOC_AIOInput,
    'aio-validation':DOC_AIOValidation,
    'aio-swip':DOC_AIOSwip,
    'aio-floater':DOC_AIOFloater,
    'puzzle':Puzzle,
    'aio-popup':DOC_AIOPopup,
    'flip':DOC_Flip,
    'map':DOC_Map,
    'ai filter':AIFilter,
    'beenet':BeenetDoc,
    'aio-css':DOC_AIOCss,
    'aio-schema':DOC_AIOSchema,
    'aio-dashboard':DOC_AIODashboard,
    'richtext':DOC_RichText,
    'cordova':DOC_AIOCordova,
    'resume':Resume,
    'aio-swiper':DOC_AIOSwiper,
    'Form Generator':FG,
    'test':Test,
    'ThreeD':ThreeD,
    'aio-apis':AIOApis,
    'use-form':DOC_UseForm,
    'sidenav':DOC_Sidenav,
    'Grid':Grid,
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