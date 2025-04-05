import { createContext, FC, ReactNode, useContext } from "react"
import { I_city, I_gridFilter, I_row } from "./types"
import { AI_switch } from "./../../npm/aio-input"
import { I_gridHook } from "./grid-filter-hook"
import { I_usePopup } from "./../../npm/aio-popup"
import Apis from "./apis"


export type I_CTX = {
    openAddModal:()=>void,
    openEditModal:(id:number)=>void,
    openRemoveModal:(id:number)=>void,
    switchConfig:AI_switch,
    options:any
    gridHook:I_gridHook,
    popup:I_usePopup,
    cities:I_city[],
    apis:Apis
}
const CTX = createContext<I_CTX>({} as any)
export const FreelancerProvider:FC<{value:I_CTX,children:ReactNode}> = ({value,children})=>{
    return (
        <CTX.Provider value={value}>
            {children}
        </CTX.Provider>
    )
}
export const useFreelancer = ()=>useContext(CTX)
const AddEmployeeContext = createContext({} as any)

export {CTX,AddEmployeeContext}
