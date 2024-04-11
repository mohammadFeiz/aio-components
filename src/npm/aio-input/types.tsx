import { AP_modal } from "../aio-popup/types"
import { I_RVD_node } from "../react-virtual-dom/types"

export type AI_type = 'text' | 'number' | 'textarea' | 'password' | 'select' | 'multiselect' | 'map' |
    'button' | 'date' | 'color' | 'radio' | 'tabs' | 'list' | 'table' | 'image' | 'file' | 'slider' | 'checkbox' | 'form' | 'time' | 'buttons' | 'pinch'
export type AI_optionKey = (
    'attrs' | 'text' | 'value' | 'disabled' | 'checkIcon' | 'checked' | 'before' | 'after' | 'justify' | 'subtext' | 'onClick' | 
    'className' |  'style' |  'tagAttrs' | 'tagBefore' | 'tagAfter' | 'close'
)
export type AI_formItem = I_RVD_node & {
    field:string,
    label?:string,
    addressField?:string,
    footer?:React.ReactNode,
    input:AI,
    labelAttrs?:any,
    errorAttrs?:any
}
export type AI_table_column = {
    title?: any,
    value?: any,
    sort?: true | AI_table_sort,
    search?: boolean,
    id?: string,
    _id?: string,
    width?: any,
    minWidth?: any,
    input?: AI,
    onChange?: (newValue: any) => void,
    titleAttrs?:{[key:string]:any} | string,
    template?:string | ((p:{row:any,column:AI_table_column,rowIndex:number})=>React.ReactNode),
    excel?: string,
    justify?:boolean,
    cellAttrs?:{[key:string]:any} | ((p:{row:any,rowIndex:number,column:AI_table_column})=>any) | string
}
export type AI_date_unit = 'year' | 'month' | 'day' | 'hour';
export type AI_time_unit = {[key in ('year' | 'month' | 'day' | 'hour' | 'minute' | 'second')]?:boolean}
export type AI = {
    rtl?: boolean,
    popover?: AP_modal,//notice get type from aio popup
    type: AI_type,
    multiple?: boolean,
    value?: any,
    deSelect?:any,
    editable?:boolean,
    open?: boolean,
    unit?: AI_date_unit | AI_time_unit,
    jalali?: boolean,
    placeholder?: string,
    className?:string,
    width?: number | string, //list
    height?: number | string,
    style?: any,
    onChange?: (newValue: any, p?: any) => void,
    disabled?: boolean,
    loading?: boolean | React.ReactNode,
    min?: number,//slider,number
    max?: number,//slider,number
    swip?: number,
    blurChange?: boolean,
    maxLength?: number,
    justNumber?: boolean | (string[]),
    filter?: string[],
    delay?: number,
    onClick?:()=>void,
    inputAttrs?: any,
    spin?: boolean,
    justify?: boolean,
    hideTags?: boolean,
    attrs?: any,
    columns?: AI_table_column[],
    paging?: AI_table_paging,
    onChangePaging?: (newPaging: AI_table_paging) => void,
    rowGap?: number,
    columnGap?: number,
    onChangeSort?: (sorts: AI_table_sort[]) => Promise<boolean>,
    toolbarAttrs?: any,
    toolbar?: React.ReactNode | (() => React.ReactNode),
    getValue?: { [key: string]: (p: { row: any, column: AI_table_column, rowIndex: number }) => any },
    onAdd?: Object | (() => void),
    onRemove?: true | ((p: { row: any, action: Function, rowIndex: number }) => void),
    excel?: string,
    onSwap?: true | ((newValue: any[], startRow: any, endRow: any) => void),
    onSearch?: true | ((searchValue: string) => void),
    rowAttrs?: (p: { row: any, rowIndex: number }) => any,
    rowTemplate?: (p: { row: any, rowIndex: number, isLast: boolean }) => React.ReactNode,
    rowsTemplate?: (rows: any[]) => React.ReactNode,
    rowAfter?: (p: { row: any, rowIndex: number }) => React.ReactNode,
    rowBefore?: (p: { row: any, rowIndex: number }) => React.ReactNode,
    headerAttrs?: any,
    after?: React.ReactNode | (() => React.ReactNode),
    before?: React.ReactNode | (() => React.ReactNode),
    options?: any[],
    option?:{[key in AI_optionKey]?:AI_optionProp},
    direction?: 'left' | 'right' | 'top' | 'bottom',
    checkIcon?: AI_checkIcon,
    caret?: boolean | React.ReactNode,
    text?: React.ReactNode | (() => React.ReactNode)
    subtext?: React.ReactNode | (() => React.ReactNode),
    move?: any,//list
    count?: number,//list
    size?: number,//list,date
    stop?: number,//list
    decay?: number,//list
    startYear?: string | number,//date
    endYear?: string | number,//date
    translate?: (text: string) => string,//date,
    theme?: string[],//date
    search?: string,
    dateAttrs?:(p:{dateArray:number[], isToday:boolean, isDisabled:boolean, isActive:boolean, isMatch:(p:any[])=>boolean})=>any,//date
    dateDisabled?:string[],
    changeClose?:boolean,//date
    preview?:boolean,
    footer?:{
        layout?:(p:{disabled:boolean,errors:string[],reset:()=>void})=>React.ReactNode,
        onSubmit?:()=>void,onClose?:()=>void,reset?:boolean,attrs?:any,submitText?:string,closeText?:string,resetText?:string,
        before?:React.ReactNode,after?:React.ReactNode
    },//form
    body?:{attrs?:any},//form
    getErrors?:(p:string[])=>void,//form
    initialDisabled?:boolean,//form
    inputs?:any,//form
    labelAttrs?:any,//form
    errorAttrs?:any,//form
    lang?:'fa' | 'en',//form,
    grooveAttrs?:any,//slider
    start?:number,//slider,pinch
    end?:number,//slider,pinch
    step?:number,//slider,pinch
    angle?:number,//pinch
    line?:(index:number,active:boolean)=>{
        attrs?:any,
        html?:React.ReactNode
    }
    point?:AI_point,//slider,pinch
    label?:AI_label,//slider,pinch
    scale?:AI_scale,//slider,pinch
    handle?:{attrs?:any},//pinch
    mapConfig?:I_Map_config,
    popupConfig?:I_Map_config
}
export type AI_point = (index:number,value:number)=>{
    attrs?:any,
    html?:React.ReactNode,
    labelHtml?:React.ReactNode,
    labelShow?:boolean | 'inline',
    labelAttrs?:any
}
export type AI_scale = {
    step?:number,
    list?:number[],
    dynamic?:boolean,
    attrs?:(value:number,p?:any)=>any,
    html?:(value:number,p?:any)=>React.ReactNode  
}
    
export type AI_label = {
    step?:number,
    list?:number[],
    dynamic?:boolean,
    attrs?:(value:number,p?:any)=>any,
    html?:(value:number,p?:any)=>React.ReactNode,
    rotate?:number | ((value:number)=>number)
}
    
//notice
//use global fixed options in List
//create list document 
//define popover type by aio popup
export type AI_checkIcon = ((checked: boolean) => React.ReactNode) | Object;
export type AI_optionProp = string | ((option: any,p?:any) => any)
export type AI_option = {
    object:any,
    checked: boolean,
    checkIcon: AI_checkIcon,
    after: React.ReactNode | (() => React.ReactNode),
    before: React.ReactNode | (() => React.ReactNode),
    draggable: boolean,
    text: React.ReactNode,
    subtext: React.ReactNode,
    justify: boolean,
    loading: boolean | React.ReactNode,
    disabled: boolean,
    attrs: any,
    className:string,
    style: any,
    value:any,
    tagAttrs:any,
    tagBefore:any,
    tagAfter:any
}
export type AI_getProp_param = { key: string, def?: any, preventFunction?: boolean };
export type AI_getProp = (p: AI_getProp_param) => any;
export type AI_addToAttrs = (attrs: any, p: { className?: string | (string[]), style?: any,attrs?:any }) => any
export type AI_context = {
    rootProps: AI,
    showPassword: boolean,
    setShowPassword: (v?: boolean) => void,
    DragOptions: I_Drag,
    datauniqid: string,
    touch: boolean,
    open: boolean,
    click: (e: any, dom: any) => void,
    optionClick: (option: AI_option) => void,
    types: AI_types
}
export type AI_types = {
    isMultiple: boolean,
    isInput: boolean,
    isDropdown: boolean,
    hasOption: boolean,
    hasPlaceholder: boolean,
    hasKeyboard: boolean,
    hasText: boolean,
    hasSearch: boolean
}
export type AI_table_sort = {
    active?: boolean, dir?: 'dec' | 'inc', title?: React.ReactNode, type?: 'string' | 'number', sortId?: string, getValue?: (row: any) => any
}
export type type_table_temp = { start?: any, isInitSortExecuted?: boolean }
export type AI_table_paging = {
    serverSide?: boolean,
    number: number,
    size: number,
    length?: number,
    sizes?: number[]
}
export type type_table_getCellAttrs = (p: { row: any, rowIndex: number, column: AI_table_column, type: 'title' | 'cell' }) => any;
export type type_table_context = {
    rootProps: AI,
    columns: AI_table_column[],
    ROWS: { rows: any[], searchedRows: any[], sortedRows: any[], pagedRows: any[] },
    add: () => void, remove: (row: any, index: number) => void, search: (searchValue: string) => void,
    exportToExcel: () => void,
    sorts: AI_table_sort[],
    setSorts: (newSorts: AI_table_sort[]) => void,
    sortRows: (rows: any[], sorts: AI_table_sort[]) => any[],
    excelColumns: AI_table_column[],
    addToAttrs:AI_addToAttrs,
    getRowAttrs: (row: any, rowIndex: number) => any,
    getCellAttrs: type_table_getCellAttrs,
    getDynamics:any
}
export type AI_Popover_props = {
    getRootProps: () => AI, id: string, toggle: (popover: any) => void,types:AI_types
}
export type type_time_value = { year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number }
export type I_TimePopver = { lang?: 'en' | 'fa', value: type_time_value, onChange: (value: type_time_value) => void, onClose: () => void }
export type I_FileItem = {file:any,index:number}
export type I_Multiselect = {options:AI_option[]}
export type I_Tags = {options:AI_option[]}
export type I_Tag = { option:AI_option, value:any }
export type AI_Options = {options?:any[]}
export type I_TableGap = { dir: 'h' | 'v' }

export type AI_TableCellContent = {row:any,column:AI_table_column,rowIndex:number,onChange?:(newValue:any)=>void}

export type I_Layout = {
    option?: AI_option, text?: React.ReactNode, realIndex?: number, renderIndex?: number,
    properties?: any
}

export type I_DPContext = {
    translate: (text: string) => string,
    rootProps: AI,
    activeDate: I_DP_activeDate,
    changeActiveDate: (obj: 'today' | I_DP_activeDate) => void,
    onChange: (p: { year?: number, month?: number, day?: number, hour?: number }) => void,
    today: any, todayWeekDay: any, thisMonthString: any,months:string[]

}
export type I_Calendar = { onClose?: () => void }
export type I_DP_activeDate = { year?: number, month?: number, day?: number }

export type I_DPCellWeekday = {weekDay:string}

export type I_DPCell = {dateArray:number[]}

export type I_DPYears = {
    value: number, onChange: (newValue: number) => void
}

export type I_DPHeaderDropdown = { value: any, options: { text: string, value: any }[], onChange: (value: any) => void }

export type I_DPArrow = { type: 'minus' | 'plus', onClick?: () => void }

export type I_Slider_statics = {getDiff:(x:number,y:number,client:{x:number,y:number})=>number,oriention:'h' | 'v',flexDirection?:'column' | 'column-reverse'}
export type I_Slider_context = {
    direction:'left'|'right'|'top'|'bottom',
    start:number,end:number,step:number,
    touch:boolean,value:number[],
    statics:I_Slider_statics,
    rootProps:AI,isDown:boolean,
    mouseDown:(e:any,index:number,type:'point' | 'fill')=>void,
    fix:(v:number)=>number,
    getStartByStep:(start:number,step:number)=>number,
    getPercentByValue:(value:number,start:number,end:number)=>number,
    isActive:(index:number)=>boolean
}

export type I_SliderFill = {percent:number,index:number}

export type I_SliderPoint = {percent:number,index:number}

export type I_SliderLabel = {value:number}

export type I_SliderScale = {value:number}

export type I_list_temp = {
    dom:any,
    activeIndex:number,
    interval:any,
    moved:boolean,
    lastY:number,
    deltaY:number,
    so:{ y: number, top: number, newTop?: number, limit: { top: number, bottom: number } }
}

export type I_Map_config = {
    area?:I_Map_area,
    markers?:I_Map_marker[],
    zoom?:number,
    marker?:boolean | I_Map_marker,
    traffic?:boolean,
    zoomControl?:boolean,
    maptype?:any,
    poi?:boolean,
    search?:string,
    title?:string,
    draggable?:boolean,
    address?:boolean,
    submitText?:React.ReactNode,
    isPopup?:boolean
}

export type I_Map_area = {color:string, opacity:number, radius:number, lat:number, lng:number}
export type I_Map_marker = {size?:number,color?:string,html?:React.ReactNode,text?:React.ReactNode,lat?:number,lng?:number,popup?:(marker:I_Map_marker)=>any}
export type I_Map_value = {lat:number,lng:number,address?:string}
export type I_MapUnit = {
    onClose?:()=>void,
    value:I_Map_value,
    onChange:(value:I_Map_value)=>void,
    mapConfig:I_Map_config,
    popupConfig?:I_Map_config,
    attrs:any,
    disabled:boolean
}
export type I_Map_temp = {
    datauniqid:string,
    area:any,
    map:any,
    markers:any[],
    dom:any,
    L:any,
    atimeout:any,
    btimeout:any,
    mapMarker:any,
    lastChange:any
}
export type I_Map_coords = {lat:number,lng:number};
export type I_mapApiKeys = {map:string,service:string}
export type I_Map_context = {
    mapApiKeys:I_mapApiKeys,
    value:I_Map_value,
    flyTo:(coords:I_Map_coords)=>void,
    addressLoading:boolean,
    address:string,
    goToCurrent:()=>void,
    mapConfig:I_Map_config,
    popupConfig:I_Map_config,
    onClose:()=>void,
    onChange:(value:I_Map_value)=>void
}
export type I_Drag = { getAttrs:(list:any[],index:number)=>any }
