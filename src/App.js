import React,{Component} from "react";
import './App.css'
import DOC_AIOInput from "./documents/aio-input/doc-aio-input";
import DOC_AIOValidation from "./documents/aio-validation/doc-aio-validation";
import DOC_AIODatepicker from './documents/aio-datepicker/doc-aio-datepicker';
import DOC_AIOLoading from './documents/aio-loading/doc-aio-loading';
import DOC_AIOTable from './documents/aio-table/doc-aio-table';
import DOC_AIOContentSlider from './documents/aio-content-slider/doc-aio-content-slider';
import DOC_AIOGauge from './documents/aio-gauge/doc-aio-gauge';
import DOC_AIOStorage from './documents/aio-storage/doc-aio-storage';
import DOC_AIOSwip from './documents/aio-swip/doc-aio-swip';
import DOC_AIOColorpicker from './documents/aio-colorpicker/doc-aio-colorpicker';
import DOC_AIOChart from './documents/aio-chart/doc-aio-chart';
import DOC_AIOFloater from './documents/aio-floater/doc-aio-floater';
import Puzzle from './documents/puzzle/index';
import DOC_AIODragList from './documents/aio-drag-list/doc-aio-drag-list';
import DOC_ReactSuperApp from './documents/react-super-app/doc-react-super-app';
import DOC_AIOService from './documents/aio-service/doc-aio-service';

export default class AIOComponents extends Component{
  constructor(props){
    super(props);
    this.state = {
      part:'aio-input',
      parts:{
        'aio-input':{name:'aio-input',Render:DOC_AIOInput},
        'aio-validation':{name:'aio-validation',Render:DOC_AIOValidation},
        'aio-datepicker':{name:'aio-datepicker',Render:DOC_AIODatepicker},
        'aio-loading':{name:'aio-loading',Render:DOC_AIOLoading},
        'aio-table':{name:'aio-table',Render:DOC_AIOTable},
        'aio-content-slider':{name:'aio-content-slider',Render:DOC_AIOContentSlider},
        'aio-gauge':{name:'aio-gauge',Render:DOC_AIOGauge},
        'aio-storage':{name:'aio-storage',Render:DOC_AIOStorage},
        'aio-swip':{name:'aio-swip',Render:DOC_AIOSwip},
        'aio-colorpicker':{name:'aio-colorpicker',Render:DOC_AIOColorpicker},
        'aio-chart':{name:'aio-chart',Render:DOC_AIOChart},
        'aio-floater':{name:'aio-floater',Render:DOC_AIOFloater},
        'puzzle':{name:'puzzle',Render:Puzzle},
        'aio-drag-list':{name:'aio-drag-list',Render:DOC_AIODragList},
        'react-super-app':{name:'react-super-app',Render:DOC_ReactSuperApp},
        'aio-service':{name:'aio-service',Render:DOC_AIOService},


      }
    }
  }
  part(){
    let {parts,part} = this.state;
    let {Render,name} = parts[part]
    let props = {
      goToHome:()=>this.setState({part:false}),
      name
    }
    return <Render {...props}/>
  }
  render(){
    let {part,parts} = this.state;
    if(part){return this.part()}
    return (
      <div className='aio-components'>
        {
          Object.keys(parts).map((o)=>{
            return (<div className='aio-component' onClick={()=>this.setState({part:o})}>{o}</div>)
          })
        }
      </div>
    )
  }
}