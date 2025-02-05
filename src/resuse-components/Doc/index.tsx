import {ReactNode} from "react";
import { AI_sidenavItem, AIApp } from "../../npm/aio-components";
export type I_DOC = {name:string,goToHome:()=>void,items:AI_sidenavItem[],body:(v?:string)=>ReactNode}
export default function DOC(props:I_DOC){
    let {items,body,name,goToHome} = props;
    return (
        <AIApp
            sidenav={{
                items,
                header:name
            }}
            header={(sidenavValue)=>{
                return (
                    <div className="flex-row-">
                        {sidenavValue}
                        <div className="flex-1-"></div>
                        <button className="msf" onClick={goToHome}>Home</button>
                    </div>
                )
            }}
            body={body}
        />
    )
}
