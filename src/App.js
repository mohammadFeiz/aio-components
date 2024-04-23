import React,{Component} from "react";
import './App.css'
import AIOStorage from './npm/aio-storage/aio-storage';
import AIOInput, { AIOInputSetStorage } from "./npm/aio-input/index.tsx";
import DOC_AIOInput_Inputs from './documents/aio-input/aio-input-inputs/doc-aio-input-inputs.tsx';
import DOC_AIOInput_Table from "./documents/aio-input/aio-input-table/doc-aio-input-table.tsx";
import DOC_AIOInput_Slider from "./documents/aio-input/aio-input-slider/doc-aio-input-slider";
import DOC_AIOInput_Map from './documents/aio-input/aio-input-map/doc-aio-input-map.tsx';
import DOC_AIOValidation from "./documents/aio-validation/doc-aio-validation";
import DOC_AIOHighlighter from './documents/aio-highlighter/doc-aio-highlighter';
import DOC_AIOLoading from './documents/aio-loading/doc-aio-loading';
import DOC_AIOTable from './documents/aio-table/doc-aio-table';
import DOC_AIOContentSlider from './documents/aio-content-slider/doc-aio-content-slider';
import DOC_AIOGauge from './documents/aio-gauge/doc-aio-gauge';
import DOC_AIOStorage from './documents/aio-storage/doc-aio-storage';
import DOC_AIOSwip from './documents/aio-swip/doc-aio-swip';
import DOC_AIOChart from './documents/aio-chart/doc-aio-chart';
import DOC_AIOFloater from './documents/aio-floater/doc-aio-floater';
import Puzzle from './documents/puzzle/index';
import DOC_AIOInput_List from './documents/aio-input/aio-input-list/doc-aio-input-list';
import DOC_AIOService from './documents/aio-service/doc-aio-service';
import DOC_AIOPopup from './documents/aio-popup/doc-aio-popup';
import DOC_AIOCanvas from './documents/aio-canvas/doc-aio-canvas';
import DOC_AIOLogin from './documents/aio-login/doc-aio-login';
import DOC_AIOShop from './documents/aio-shop/doc-aio-shop.tsx';
import DOC_MSFLoading1 from "./documents/msfloading1/msfloading1";
import DOC_ReactVirtualDom from './documents/react-virtual-dom/doc-react-virtual-dom.tsx';
import Test from './test.tsx';
import T1 from './documents/t1/t1';
import Versions from './versions';
AIOInputSetStorage('mapApiKeys',{
  map:'web.0a2aa5f83d314a8c9916473aa0e01438',
  service:'service.09a2234e299a4ff585007b2894df9fca',
})
export default class AIOComponents extends Component{
  constructor(props){
    super(props);
    this.storage = AIOStorage('aio-componentspart');
    this.state = {
      part:this.storage.load({name:'part',def:'aio-input'}),
      parts:{
        'versions':Versions,
        'aio-input-inputs':DOC_AIOInput_Inputs,
        'aio-input-table':DOC_AIOInput_Table,
        'aio-input-slider':DOC_AIOInput_Slider,
        'aio-input-list':DOC_AIOInput_List,
        'aio-input-map':DOC_AIOInput_Map,
        'aio-highlighter':DOC_AIOHighlighter,
        'aio-validation':DOC_AIOValidation,
        'aio-loading':DOC_AIOLoading,
        'aio-table':DOC_AIOTable,
        'aio-content-slider':DOC_AIOContentSlider,
        'aio-gauge':DOC_AIOGauge,
        'aio-storage':DOC_AIOStorage,
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
      }
    }
  }
  changePart(part){
    this.storage.save({name:'part',value:part})
    this.setState({part})
  }
  part(){
    let {parts,part} = this.state;
    let COMPONENT = parts[part];
    if(!COMPONENT){
      this.changePart(false);
      return
    }
    let props = {
      goToHome:()=>this.changePart(false),
      name:part
    }
    return <COMPONENT {...props}/>
  }
  render(){
    let {part,parts} = this.state;
    if(part){return this.part()}
    return (
      <div className='aio-components'>
        {
          Object.keys(parts).map((o,i)=>{
            return (<div key={i} className='aio-component' onClick={()=>this.changePart(o)}>{o}</div>)
          })
        }
      </div>
    )
  }
}