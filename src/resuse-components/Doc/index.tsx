import {ReactNode} from "react";
import { AI_sidenavItem, AIApp } from "../../npm/aio-components";
import './index.css';
export type I_DOC = {name:string,goToHome:()=>void,items:AI_sidenavItem[]}
export default function DOC(props:I_DOC){
    let {items,name,goToHome} = props;
    return (
        <AIApp
            appId={name}
            sidenav={{
                items,
                header:(
                    <div className="h-48- flex-row- align-vh- fs-20-">{name}</div>
                ),
                cache:true,
                attrs:{className:'doc-sidenav'}
            }}
            header={()=>{
                return (
                    <div className="flex-row- w-100- h-48- align-v- p-h-12- brd-b- brd-c-13-">
                        <div className="flex-1-"></div>
                        <button className="h-24- brd-none- br-4-" style={{background:'#0069ff',color:'#fff'}} onClick={goToHome}>Home</button>
                    </div>
                )
            }}
            body={(activeSidenav)=>{
                if(!activeSidenav || !activeSidenav.render){return null}
                return activeSidenav.render()
            }}
        />
    )
}
