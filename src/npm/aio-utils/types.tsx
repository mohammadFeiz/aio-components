export type I_AIOSwip_mousePosition = {x:number,y:number,xp:number,yp:number,clientX:number,clientY:number};
export type I_AIOSwip = {
    dom:any,start:(mousePosition:any)=>number[], 
    move:(p:{ dx:number, dy:number, dist:number, x:number, y:number, mousePosition: I_AIOSwip_mousePosition}, e:any ) => void, 
    end?:(p:{ dx: number, dy: number, dist: number }, e:any) => void, 
    speedX?:number, speedY?:number, stepX?:number, stepY?:number, reverseY?:boolean, reverseX?:boolean, minY?:number, maxY?:number, minX?:number, maxX?:number 
}