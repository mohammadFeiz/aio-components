import { createContext } from "react"
import { I_filter, I_row } from "./types"
import { AI_switch } from "../../npm/aio-input"


export type I_CTX = {
    openAddModal:()=>void,
    filter: I_filter,
    changeFilter: (v: I_filter) => void,
    resetFilter: () => void,
    data:I_row[],
    switchConfig:AI_switch,
    options:any
}
const CTX = createContext<I_CTX>({} as any)

const AddEmployeeContext = createContext({} as any)

export {CTX,AddEmployeeContext}
