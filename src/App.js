import React,{Component} from "react";
import './App.css'
import DOC_AIOButton from "./documents/aio-button/doc-aio-button";
import DOC_AIOValidation from "./documents/aio-validation/doc-aio-validation";
import DOC_AIOForm from './documents/aio-form/doc-aio-form';
import DOC_AIODatepicker from './documents/aio-datepicker/doc-aio-datepicker';
import DOC_AIODate from './documents/aio-date/doc-aio-date';
export default class AIOComponents extends Component{
  constructor(props){
    super(props);
    this.state = {
      part:'aio-date',
      parts:{
        'aio-button':{name:'aio-button',Render:DOC_AIOButton},
        'aio-validation':{name:'aio-validation',Render:DOC_AIOValidation},
        'aio-form':{name:'aio-form',Render:DOC_AIOForm},
        'aio-datepicker':{name:'aio-datepicker',Render:DOC_AIODatepicker},
        'aio-date':{name:'aio-date',Render:DOC_AIODate}
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