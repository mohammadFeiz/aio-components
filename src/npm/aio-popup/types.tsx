export type AP_props = {rtl?:boolean,id?:string}
export type AP_position = 'fullscreen' | 'center' | 'popover' | 'left' | 'right' | 'top' | 'bottom'
export type AP_header = {
  title?:string,subtitle?:string,buttons?:AP_modal_button[],onClose?:boolean | ((p:{state:any,setState:(state:any)=>void})=>void),backButton?:()=>void,attrs?:any
}
export type AP_backdrop = false | {attrs?:any,close?:boolean}
export type AP_body = {render?:(p:{close:()=>void,state?:any,setState?:(state:any)=>void})=>React.ReactNode,attrs?:any}
export type AP_footer = React.ReactNode | {attrs?:any,buttons?:AP_modal_button[]}

export type AP_modal = {
    getTarget?:()=>any,
    pageSelector?:string,
    fixStyle?:(o:any,p:{targetLimit:any,pageLimit:any})=>any,
    fitTo?:string,
    rtl?:boolean,
    id?:string,
    onClose?:boolean | (()=>void),
    position?:AP_position,
    attrs?:any,
    backdrop?:AP_backdrop,
    header?:AP_header,
    state?:any,
    footer?:AP_footer,
    body?:AP_body,
    animate?:boolean,
    fitHorizontal?:boolean
}
export type AP_alert = { 
  icon?:false | React.ReactNode,
  position?:AP_position,
  type:'success'|'error'|'warning'|'info',
  text?:React.ReactNode,
  subtext?:string,
  time?:number,
  className?:string,
  closeText?:string,
  animate?:boolean
}

export type AP_snackebar = {
  icon?:React.ReactNode,
  id?:string,
  time?:number,
  text:string,
  subtext?:string,
  action?:{text:string,onClick:()=>void},
  type:'success'|'error'|'warning'|'info',
  verticalAlign?:'start' | 'end',
  horizontalAlign?:'start' | 'center' | 'end',
  onClose?:false
  rtl?:boolean,
  attrs?:any
}
export type AP_confirm = {title?:string,subtitle?:string,text?:React.ReactNode,submitText?:string,canselText?:string,onSubmit?:()=>Promise<boolean>,onCansel?:()=>void,attrs?:any}
export type AP_prompt = {title?:string,subtitle?:string,text?:string,submitText?:string,canselText?:string,onSubmit?:(text:string)=>Promise<boolean>,onCansel?:()=>void,attrs?:any}
export type AP_modal_button = [text:React.ReactNode,attrs?:any | ((p:{state:any,setState:(v:any)=>void})=>any)]
export type AP_Popups = {
  getActions:(p:{
    removeModal:(p?:string,animate?:boolean)=>void,
    addModal:(p:AP_modal)=>void,
    getModals:()=>AP_modal[]
  })=>void,
  rtl:boolean,
  id?:string
}

export type AP_Popup = {
  modal:AP_modal,
  rtl:boolean,
  index:number,
  isLast:boolean,
  onClose:()=>void,
  removeModal:(p?:string,animate?:boolean)=>void,
}

export type AP_ModalHeader = {
  rtl:boolean,header:AP_header,handleClose:()=>void,state:any,setState:(state:any)=>void
}

export type AP_ModalBody = {
  body?:AP_body,
  handleClose:()=>void,
  updatePopoverStyle:()=>void,
  state:any,setState:(state:any)=>void
}

export type AP_Snackebar = {getActions:(p:{add:(item:AP_snackebar)=>void})=>void,rtl:boolean}

export type AP_SnackebarItem = {
  item:AP_snackebar,
  onRemove:(id:string)=>void,
  index:number,
  rtl:boolean
}
