export type I_RVD_node = {
    align?:'v' | 'h' | 'vh',
    gap?:number,
    size?:number,
    flex?:number,
    html?:React.ReactNode | (()=>React.ReactNode),
    row?:I_RVD_node[],
    column?:I_RVD_node[],
    attrs?:any,
    className?:string,
    style?:any,
    onClick?:(e:any)=>void,
    show?:boolean
} | false
