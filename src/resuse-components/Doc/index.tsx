import {ReactNode} from "react";
import { AI_sidenavItem, AIApp } from "../../npm/aio-component-utils";
import './index.css';
export type I_DOC = {name:string,goToHome:()=>void}
export default function DOC(props:I_DOC & {items:AI_sidenavItem[]}){
    let {items,name,goToHome} = props;
    return (
        <AIApp
            appId={name}
            sidenav={{
                items,
                header:()=>(
                    <div className="h-48- flex-row- align-vh- fs-20- w-100-">{name}</div>
                ),
                cache:true,
                attrs:{className:'doc-sidenav'}
            }}
            header={(active)=>{
                return (
                    <div className="flex-row- w-100- h-48- align-v- p-h-12- brd-b- brd-c-13-">
                        {!!active && <div className="msf">{active.text}</div>}
                        <div className="flex-1-"></div>
                        <button className="h-24- brd-none- br-4-" id='go-to-home' style={{background:'#0069ff',color:'#fff'}} onClick={goToHome}>Home</button>
                    </div>
                )
            }}
        />
    )
}
