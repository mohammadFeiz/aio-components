// import React,{Component} from "react";
// import RVD from './../react-virtual-dom/react-virtual-dom';
// import AIOButton from "./aio-button";
// import {Icon} from '@mdi/react';
// import { mdiChevronRight, mdiClose } from "@mdi/js";
// import './form.css';
// export default class Form extends Component{
//     header_layout(){
//         let {header,title,subtitle,headerAttrs = {},onClose,onBack} = this.props;
//         if(!header && !title && !onClose && !onBack){return false}
//         return {
//             className:'aio-input-form-header' + (headerAttrs.className?' ' + headerAttrs.className:''),style:headerAttrs.style,
//             row:[
//                 {show:!!onBack,size:36,html:<Icon path={mdiChevronRight} size={.8}/>,align:'vh',onClick:()=>onBack()},
//                 {
//                     show:!!title,flex:1,
//                     column:[
//                         {flex:1},
//                         {html:title,className:'aio-input-form-title'},
//                         {show:!!subtitle,html:subtitle,className:'aio-input-form-subtitle'},
//                         {flex:1}
//                     ]
//                 },
//                 {flex:!!title?undefined:1,html:header()},
//                 {show:!!onClose,size:36,html:<Icon path={mdiClose} size={.8}/>,align:'vh',onClick:()=>onClose()}
//             ]
//         }
//     }
//     body_layout(){
//         let {inputs} = this.props;
//         if(Array.isArray(inputs)){
//             inputs = {column:inputs.map((o)=>this.input_layout(o))}
//         }
//         let res = {
//             flex:1,className:'aio-input-form-body',...inputs
//         }
//         return res
//     }
//     footer_layout(){
//         let {footer,onSubmit,onClose,footerAttrs = {},closeText = 'Close',submitText='submit'} = this.props;
//         if(!footer && !onSubmit && !onClose){return false}
//         return {
//             className:'aio-input-form-footer' + (footerAttrs.className?' ' + footerAttrs.className:''),style:footerAttrs.style,
//             row:[
//                 {show:!!onClose,html:<button onClick={()=>onClose()} className='aio-input-form-close-button'>{closeText}</button>},
//                 {show:!!onSubmit,html:<button onClick={()=>onSubmit()} className='aio-input-form-submit-button'>{submitText}</button>},
//             ]
//         }
//     }
//     getValue(field){
//         let {model} = this.props;
//         return model[field]
//     }
//     input_layout(obj){
//         let {label,footer,inlineLabel,input,flex,size} = obj;
//         return {
//             flex,size,
//             className:'aio-input-form-item',
//             row:[
//                 {show:!!inlineLabel,html:inlineLabel},
//                 {
//                     flex:1,
//                     column:[
//                         {show:!!label,html:label,className:'aio-input-form-label'},
//                         {html:<AIOButton {...input} value={this.getValue(input.field)}/>},
//                         {show:!!footer,html:footer} 
//                     ]
//                 }
//             ]
//         }
//     }
//     render(){   
//         return (
//             <RVD
//                 getLayout={(obj)=>{
//                     if(obj.input){return this.input_layout({...obj,flex:obj.size?undefined:1})}
//                     return obj
                    
//                 }}
//                 layout={{
//                     className:'aio-input-form',
//                     column:[
//                         this.header_layout(),
//                         this.body_layout(),
//                         this.footer_layout()
//                     ]
//                 }}
//             />
//         )
//     }
// }