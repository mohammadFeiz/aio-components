export type I_Swip_mousePosition = { x: number, y: number, xp: number, yp: number, clientX: number, clientY: number,centerAngle:number };
export type I_Swip_change = {
    x:number,y:number,
    dx:number,dy:number,
    dist:number,
    angle:number,
}
export type I_Swip_parameter = {
    change?:I_Swip_change,mousePosition:I_Swip_mousePosition,domLimit:I_Swip_domLimit,parentLimit:I_Swip_domLimit,event:any
}
export type I_Swip = {
    dom: ()=>any, 
    parent?:()=>any,
    onClick?:(p:I_Swip_parameter)=>void,
    page?:()=>any,
    start: (p:I_Swip_parameter) => number[],
    move: (p: I_Swip_parameter) => void,
    end?: (p: I_Swip_parameter) => void,
    speedX?: number, 
    speedY?: number, 
    stepX?: number | boolean, 
    stepY?: number | boolean, 
    reverseY?: boolean, 
    reverseX?: boolean, 
    minY?: number, 
    maxY?: number, 
    minX?: number, 
    maxX?: number,
    insideX?:boolean,
    insideY?:boolean
}
export type I_Swip_domLimit = {
    width:number,height:number,left:number,top:number,centerX:number,centerY:number,right:number,bottom:number
}

export type I_Date = string | number | Date | { year?: number, month?: number, day?: number, hour?: number, minute?: number } | number[];
export type I_point = number[]
export type I_line = [I_point, I_point]
export type I_dline = [number, number, number]//x,y,dip
export type I_dip = number
export type I_arc = { x: number, y: number, r: number, slice?: [number, number] }
export type I_rect = [I_point,I_point]
