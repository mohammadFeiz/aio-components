export type I_RSA_props = {
    rtl?:boolean, 
    maxWidth?:number,
    id:string,
    nav:I_RSA_nav,
    side?:I_RSA_side,
    title?:(nav:I_RSA_nav)=>string,
    subtitle?:(nav:I_RSA_nav)=>string,
    headerContent?:()=>React.ReactNode,
    header?:false | React.ReactNode | (()=>React.ReactNode),
    body:(activeNavItem:I_RSA_navItem)=>React.ReactNode
    theme?:any,
    splashTime?:number,
    splash?:()=>React.ReactNode,
    className?:string,
}
export type I_RSA_addAlert_param = {type:'error' | 'success',text:string,subtext?:string}
export type I_RSA_addAlert = (p:I_RSA_addAlert_param)=>void;
export type I_RSA_setNavId = (navId:string)=>void
export type I_RSA_getNavId = ()=>string;
export type I_RSA_removeModal = (id?:string)=>void;
export type I_RSA_render = ()=>React.ReactNode
export type I_RSA_addModal_param = {
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
export type I_RSA_addModal = (p:I_RSA_addModal_param)=>void
export type I_RSA_addConfirm_param = {
    title:string,
    text:string,
    onSubmit:()=>Promise<boolean>,
    subtitle?:string,
    submitText?:string,
    canselText?:string,
    onCansel?:()=>void,
    attrs?:any
}
export type I_RSA_addConfirm = (p:I_RSA_addConfirm_param)=>void
export type I_RSA_addSnakebar_param = {
    type:'info' | 'warning' | 'error' | 'success',
    text:string,
    subtext?:string,
    time?:number,
    rtl?:boolean,
    action?:{text:string,onClick:()=>void},
    onClose?:false | (()=>void)
}
export type I_RSA_addSnakebar = (p:I_RSA_addSnakebar_param)=>void
export type I_RSA_closeSide = ()=>void
export type I_RSA_openSide = ()=>void
export type I_RSA_addPrompt = (p:any)=>void;
export type I_RSA = {
    setNavId:I_RSA_setNavId,
    addModal:I_RSA_addModal,
    removeModal:I_RSA_removeModal,
    addSnakebar:I_RSA_addSnakebar,
    closeSide:I_RSA_closeSide,
    getNavId:I_RSA_getNavId,
    addConfirm:I_RSA_addConfirm,
    addAlert:I_RSA_addAlert,
    openSide:I_RSA_openSide,
    render:I_RSA_render,
}
export type I_RSA_navItem = {
    id:string,
    text:string | (()=>string),
    icon?:React.ReactNode | (()=>React.ReactNode),
    items?:I_RSA_navItem[],
    show?:()=>boolean,
    render?:()=>React.ReactNode
}
export type I_RSA_nav = {
    items:()=>I_RSA_navItem[]
    id?:string,
    header?:()=>React.ReactNode,
    footer?:()=>React.ReactNode,
    cache?:boolean,
    nested?:boolean
}
export type I_RSA_sideItem = {
    icon?:React.ReactNode | (()=>React.ReactNode),
    text:string,
    attrs?:any,
    show?:()=>boolean,
    onClick:Function
}
export type I_RSA_side = {
    items:I_RSA_sideItem[] | (()=>I_RSA_sideItem[]),
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
    nav:I_RSA_nav,navId:string, setNavId:(navId)=>void,rtl:boolean,navItems:I_RSA_navItem[],type:'bottom'|'side'
}
export type I_RSA_SideMenu = {
    attrs:any,header?:()=>React.ReactNode,items:I_RSA_sideItem[], onClose:()=>void,footer?:()=>React.ReactNode
}
