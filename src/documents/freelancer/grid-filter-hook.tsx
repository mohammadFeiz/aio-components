import { useEffect, useState } from "react"
import { I_gridFilter, I_hub, I_row } from "./types"
import Apis from "./apis"

export const useGrid = (p:{currenthub:I_hub,apis:Apis}):I_gridHook=>{
    const [grid, setGrid] = useState<I_row[]>([])
    const [gridFilter, setGridFilter] = useState<I_gridFilter>({hubId: p.currenthub.id,pageSize:10,pageNumber:1,rowsLength:0,advanced: {}})
    const fetchGrid = async (filter:I_gridFilter):Promise<boolean> => {
        const res = await p.apis.grid(filter)
        if(res){
            setGridFilter({...filter,rowsLength:res.length})
            setGrid(res.rows);
            return true
        }
        return false
    }
    useEffect(()=>{
        fetchGrid(gridFilter)
    },[])
    const updateGrid = async (callback?:any)=>{
        setTimeout(()=>()=>{
            fetchGrid(gridFilter)
            if(callback){callback()}
        },300) 
    }
    const resetGridFilter = () => {
        setGridFilter({ hubId: 0, advanced: {},pageSize:10,pageNumber:1,rowsLength:0 })
    }
            
    const changeGridFilter = (newGridFilter:I_gridFilter)=>{
        fetchGrid(newGridFilter); setGridFilter(newGridFilter)
    }
    return {grid,gridFilter,changeGridFilter,resetGridFilter,updateGrid}
}

export type I_gridHook = {
    grid:I_row[],gridFilter:I_gridFilter,changeGridFilter:(newGridFilter:I_gridFilter)=>void,updateGrid:(callback?:any)=>void,
    resetGridFilter:()=>void
}