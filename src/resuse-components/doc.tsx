import React,{useState} from "react";
import RSA from '../npm/react-super-app/index.tsx';
import {I_RSA, I_RSA_props,I_RSA_nav} from './../npm/react-super-app/types';
export type I_DOC = {name:string,goToHome:()=>void,nav:I_RSA_nav}
export default function DOC(props:I_DOC){
    let {nav,name,goToHome} = props;
    let p:I_RSA_props = {
        id:name,
        nav:{...nav,cache:true,header:()=><div className='part-title'>{name}</div>},
        body:({render})=>{
            if(!render){return null}
            return render()
        },
        headerContent:()=><div className='w-100 flex' style={{justifyContent:'flex-end'}}><button id='go-to-home' onClick={()=>goToHome()}>Home</button></div>
    }
    let [rsa] = useState<I_RSA>(new RSA(p))
    return rsa.render() as any
}
