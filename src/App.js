import React,{Component} from "react";
import './App.css'
import AIOStorage from './npm/aio-storage/aio-storage';
import DOC_AIOInput from "./documents/aio-input/doc-aio-input";
import DOC_AIOInput_Table from "./documents/aio-input/aio-input-table/doc-aio-input-table";
import DOC_AIOInput_Slider from "./documents/aio-input/aio-input-slider/doc-aio-input-slider";
import DOC_AIOInput_Datepicker from './documents/aio-input/aio-input-datepicker/doc-aio-input-datepicker';
import DOC_AIOInput_Image from './documents/aio-input/aio-input-image/doc-aio-input-image';
import DOC_AIOInput_Form from './documents/aio-input/aio-input-form/doc-aio-input-form';
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
import DOC_ReactSuperApp from './documents/react-super-app/doc-react-super-app';
import DOC_AIOService from './documents/aio-service/doc-aio-service';
import DOC_AIOPopup from './documents/aio-popup/doc-aio-popup';
import DOC_AIOMap from './documents/aio-map/doc-aio-map';
import DOC_AIOCanvas from './documents/aio-canvas/doc-aio-canvas';
import DOC_AIOLogin from './documents/aio-login/doc-aio-login';

export default class AIOComponents extends Component{
  constructor(props){
    super(props);
    this.storage = AIOStorage('aio-componentspart');
    this.state = {
      part:this.storage.load({name:'part',def:'aio-input'}),
      parts:{
        'aio-input':DOC_AIOInput,
        'aio-input-table':DOC_AIOInput_Table,
        'aio-input-slider':DOC_AIOInput_Slider,
        'aio-input-datepicker':DOC_AIOInput_Datepicker,
        'aio-input-image':DOC_AIOInput_Image,
        'aio-input-list':DOC_AIOInput_List,
        'aio-input-form':DOC_AIOInput_Form,
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
        'react-super-app':DOC_ReactSuperApp,
        'aio-service':DOC_AIOService,
        'aio-popup':DOC_AIOPopup,
        'aio-map':DOC_AIOMap,
        'aio-canvas':DOC_AIOCanvas,
        'aio-login':DOC_AIOLogin
      }
    }
  }
  changePart(part){
    this.storage.save({name:'part',value:part})
    this.setState({part})
  }
  part(){
    let {parts,part} = this.state;
    let COMPONENT = parts[part]
    let props = {
      id:part,
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
          Object.keys(parts).map((o)=>{
            return (<div className='aio-component' onClick={()=>this.changePart(o)}>{o}</div>)
          })
        }
      </div>
    )
  }
}