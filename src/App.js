import React,{Component} from "react";
import './App.css'
import DOC_AIOButton from "./documents/aio-button/doc-aio-button";
import DOC_AIOValidation from "./documents/aio-validation/doc-aio-validation";
import DOC_AIOForm from './documents/aio-form/doc-aio-form';
import DOC_AIODatepicker from './documents/aio-datepicker/doc-aio-datepicker';
import DOC_AIODate from './documents/aio-date/doc-aio-date';
import DOC_AIOLoading from './documents/aio-loading/doc-aio-loading';
import DOC_AIOTable from './documents/aio-table/doc-aio-table';
import DOC_AIOContentSlider from './documents/aio-content-slider/doc-aio-content-slider';
import DOC_AIOGauge from './documents/aio-gauge/doc-aio-gauge';
import DOC_AIOStorage from './documents/aio-storage/doc-aio-storage';
import DOC_AIOSwip from './documents/aio-swip/doc-aio-swip';
import DOC_AIOColorpicker from './documents/aio-colorpicker/doc-aio-colorpicker';
import DOC_AIOChart from './documents/aio-chart/doc-aio-chart';
export default class AIOComponents extends Component{
  constructor(props){
    super(props);
    this.state = {
      part:'aio-chart',
      parts:{
        'aio-button':{name:'aio-button',Render:DOC_AIOButton},
        'aio-validation':{name:'aio-validation',Render:DOC_AIOValidation},
        'aio-form':{name:'aio-form',Render:DOC_AIOForm},
        'aio-datepicker':{name:'aio-datepicker',Render:DOC_AIODatepicker},
        'aio-date':{name:'aio-date',Render:DOC_AIODate},
        'aio-loading':{name:'aio-loading',Render:DOC_AIOLoading},
        'aio-table':{name:'aio-table',Render:DOC_AIOTable},
        'aio-content-slider':{name:'aio-content-slider',Render:DOC_AIOContentSlider},
        'aio-gauge':{name:'aio-gauge',Render:DOC_AIOGauge},
        'aio-storage':{name:'aio-storage',Render:DOC_AIOStorage},
        'aio-swip':{name:'aio-swip',Render:DOC_AIOSwip},
        'aio-colorpicker':{name:'aio-colorpicker',Render:DOC_AIOColorpicker},
        'aio-chart':{name:'aio-chart',Render:DOC_AIOChart},
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