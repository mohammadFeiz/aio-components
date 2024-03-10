export type I_RSA_props = {
    rtl?:boolean, 
    maxWidth?:number,
    id:string,
    nav:I_rsa_nav,
    side?:I_rsa_side,
    title?:(nav:I_rsa_nav)=>string,
    subtitle?:(nav:I_rsa_nav)=>string,
    headerContent?:()=>React.ReactNode,
    header?:false | React.ReactNode | (()=>React.ReactNode),
    body:(activeNavItem:I_rsa_navItem)=>React.ReactNode
    theme?:any,
    splashTime?:number,
    splash?:()=>React.ReactNode,
    className?:string,
}
export type I_rsa_addModal = {
    position?:'fullscreen' | 'center' | 'popover' | 'left' | 'right' | 'top' | 'bottom',
    id?:string,
    attrs?:any,
    backdrop?:{attrs?:any},
    header?:false | {
        title:string,subtitle?:string,attrs?:any,backButton?:boolean,
        buttons?:[text:React.ReactNode,attrs?:any][]
    },
    body:{render:(p:{state:any,setState:(p:any)=>void})=>React.ReactNode,attrs?:any}
}
export type I_rsa_addSnakebar = {
    type:'info' | 'warning' | 'error' | 'success',
    text:string,
    subtext?:string,
    time?:number,
    rtl?:boolean,
    action?:{text:string,onClick:()=>void},
    onClose?:false | (()=>void)
}
export type I_rsa_addConfirm = {
    title:string,
    text:string,
    onSubmit:()=>Promise<boolean>,
    subtitle?:string,
    submitText?:string,
    canselText?:string,
    onCansel?:()=>void,
    attrs?:any
}
export type I_rsa_addAlert = {type:'error' | 'success',text:string,subtext?:string}
export type I_rsa = {
    setNavId:(navId:string)=>void,
    addModal:(p:I_rsa_addModal)=>void,
    removeModal:(id?:string)=>void,
    addSnakebar:(p:I_rsa_addSnakebar)=>void,
    closeSide:()=>void,
    getNavId:()=>string,
    addConfirm:(p:I_rsa_addConfirm)=>void,
    addAlert:(p:I_rsa_addAlert)=>void,
    openSide:()=>void,
    render:()=>React.ReactNode,
    changeTheme: (index:number) => void
}
export type I_rsa_navItem = {
    id:string,
    text:string | (()=>string),
    icon?:React.ReactNode | (()=>React.ReactNode),
    items?:I_rsa_navItem[],
    show?:()=>boolean,
    render?:()=>React.ReactNode
}
export type I_rsa_nav = {
    items:()=>I_rsa_navItem[]
    id?:string,
    header?:()=>React.ReactNode,
    footer?:()=>React.ReactNode,
    cache?:boolean
}
export type I_rsa_sideItem = {
    icon?:React.ReactNode | (()=>React.ReactNode),
    text:string,
    attrs?:any,
    show?:()=>boolean,
    onClick:Function
}
export type I_rsa_side = {
    items:I_rsa_sideItem[] | (()=>I_rsa_sideItem[]),
    header?:()=>React.ReactNode,
    footer?:()=>React.ReactNode,
    attrs?:any
}
export type I_ReactSuperApp = {
    rootProps:I_RSA_props,
    getActions:(p:any)=>void,
    popup:any
}
export type I_RSA_Navigation = {

}
export type I_RSA_SideMenu = {
    
}