import React,{Component} from "react";
import './App.css'
import DOC_AIOButton from "./documents/aio-button/doc-aio-button";
import DOC_AIOValidation from "./documents/aio-validation/doc-aio-validation";
export default class AIOComponents extends Component{
  constructor(props){
    super(props);
    this.state = {
      part:'aio-button',
      parts:{
        'aio-button':{name:'aio-button',Render:DOC_AIOButton},
        'aio-validation':{name:'aio-validation',Render:DOC_AIOValidation}
      }
    }
  }
  part(){
    let {parts,part} = this.state;
    let {Render} = parts[part]
    let props = {
      goToHome:()=>this.setState({part:false})
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