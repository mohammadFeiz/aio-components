import { createContext, FC, ReactNode, useContext } from "react"
import { I_tagsHook } from "./types"
import Apis from "./apis"
import { I_usePopup } from "../../npm/aio-popup"

type I_GroupByContext = {
    tagsHook:I_tagsHook,
    openAddTagModal:()=>void,
    openRemoveTagModal:()=>void,
    openRemoveUserModal:(tagId: number, userId: number,callback:()=>void)=>void,
    openAddUserModal:()=>void,
    apis:Apis,popup:I_usePopup
}
const GroupByContext = createContext<I_GroupByContext>({} as any)
export const GroupByProvider:FC<{value:I_GroupByContext,children:ReactNode}> = ({value,children})=>{
    return (
        <GroupByContext.Provider value={value}>{children}</GroupByContext.Provider>
    )
}
export const useGroupByContext = ()=>useContext(GroupByContext)