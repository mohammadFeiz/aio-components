import React,{useReducer,createContext,useContext,useState,createRef,useEffect, useRef} from "react";
import RVD from '../../npm/react-virtual-dom/index.tsx';
import AIOInput from "../../npm/aio-input/index.tsx";
import AIOCanvas from './../../npm/aio-canvas/index.tsx';
import {Swip} from '../../npm/aio-utils/index.tsx';
import {Icon} from '@mdi/react';
import AIODoc from '../../npm/aio-documentation/aio-documentation.js';
import { mdiChevronDown, mdiChevronLeft, mdiChevronRight, mdiChevronUp, mdiCircle, mdiCircleMedium, mdiCircleSmall, mdiClose, mdiCodeJson, mdiContentCopy, mdiDelete, mdiEye, mdiEyeOff, mdiPlusThick } from "@mdi/js";
import './index.css';
import $ from 'jquery';
import { Component } from "react";
import { I_canvas_item, I_canvas_mousePosition, I_canvas_type } from "../../npm/aio-canvas/types.tsx";
import Canvas from "./../../npm/aio-canvas/index.tsx";
const CTX = createContext({} as any)
function Reducer(state,action){
    return {...state,[action.key]:action.value}
}
export type I_context = {
    onMount:()=>void,
    goToHome:()=>void,
    changeItem:(p:I_canvas_item | string[],obj:{[key in keyof I_canvas_item]?:any})=>void,
    addNewItem:(type:I_canvas_type,parent?:I_canvas_item)=>void,
    addItem:(newItem:I_canvas_item,parent:I_canvas_item | false)=>void,
    removeItem:(item:I_canvas_item)=>void,
    cloneItem:(item:I_canvas_item)=>void,
    getItemById:(ids:string[] | false)=>I_canvas_item | undefined,
    removePoint:(item:I_canvas_item,pointIndex:number)=>void,
    setActivePointIndex:(index:number | false)=>void,
    getActivePoint:()=>(number[] | false),
    changeActivePoint:(p:[number,number])=>void,
    setActiveItemId:(id:string)=>void,
    dragStart:(id:string)=>void,
    drop:(id:string[])=>void,
    state:I_state,
    addPoint:(p:number[])=>void
}
export type I_state = {
    items:I_canvas_item[],
    Canvas:Canvas,
    types:('Group'|'Arc'|'Rectangle'|'Line'|'NGon'|'Triangle')[]
    activeItemId:false | string[],
    activePointIndex:false | number,
    mounted:boolean
}
export default function DOC_AIO_Canvas({goToHome}){
    let initialValue:I_state = {
        mounted:false,
        items:[],
        Canvas:new AIOCanvas(),
        types:['Group','Arc','Rectangle','Line','NGon','Triangle'],
        activeItemId:false,
        activePointIndex:false
    }
    let [state,dispatch]:[I_state,any] = useReducer(Reducer,initialValue)
    let startDragId;
    function getNewId():string{return 'aa' + Math.round(Math.random() * 10000000);}
    function getItemById(ids:string[] | false):I_canvas_item | undefined{
        let {items} = state;
        ids = ids || [];
        let result:I_canvas_item;
        for(let i = 0; i < ids.length; i++){
            result = items.find((o)=>o.data.id[i] === ids[i]);
            if(result){items = result.items as I_canvas_item[];}
        }
        return result
    }
    function addPoint(p){

    } 
    function getParentById(id:string[]){
        if(id.length === 1){return false}
        return getItemById(id.slice(0,id.length - 1));
    }
    function changeItems(newItems:I_canvas_item[]){
        state.items = newItems;
        dispatch({key:'items',value:newItems})
    }
    function changeItem(p:I_canvas_item | string[],obj:{[key in keyof I_canvas_item]?:any}){
        let {items} = state;
        let item:I_canvas_item | undefined = Array.isArray(p)?getItemById(p):p;
        for(let prop in obj){item[prop] = obj[prop]}
        changeItems(items)
    }
    function addNewItem(type:I_canvas_type,parent?:I_canvas_item){
        let id:string = getNewId();
        let data = {id:parent?[...parent.data.id,id]:[id],name:type + Math.round(Math.random() * 10000000),open:true}
        let newItem:I_canvas_item = {type,show:true,data,onClick:()=>alert()}
        if(type === 'Arc'){newItem = {...newItem,r:100}}
        else if(type === 'Rectangle'){newItem = {...newItem,width:100,height:100}}
        else if(type === 'Group'){newItem = {...newItem,items:[],sequence:[]}}
        else if(type === 'Line'){newItem = {...newItem,points:[]}}
        addItem(newItem,parent)
    }
    function addItem(newItem:I_canvas_item,parent:I_canvas_item | false){
        let {items} = state;
        if(parent){changeItem(parent,{items:[...(parent.items as I_canvas_item[]),newItem]})}
        else {changeItems(items.concat(newItem))}
    }
    function removeItem(item:I_canvas_item){
        let {items} = state;
        let parent:false | I_canvas_item = getParentById(item.data.id);
        if(parent){
            let newItems = (parent.items as I_canvas_item[]).filter((o)=>o.data.id.toString() !== item.data.id.toString());
            changeItem(parent,{items:newItems});
            if(newItems.length){setActiveItemId(newItems[newItems.length - 1].data.id)}
            else {setActiveItemId(false)}
        }
        else {
            let newItems:I_canvas_item[] = items.filter((o)=>o.data.id.toString() !== item.data.id.toString())
            changeItems(newItems);
            if(newItems.length){setActiveItemId(newItems[newItems.length - 1].data.id)}
            else {setActiveItemId(false)}
        }
    }
    function cloneItem(item:I_canvas_item){
        item = JSON.parse(JSON.stringify(item))
        let parent:I_canvas_item | false = getParentById(item.data.id);
        let newId:string[] = parent?[...parent.data.id,getNewId()]:[getNewId()]
        let newItem:I_canvas_item = {...item,data:{id:newId,name:item.data.name + '-c'}};
        if(newItem.type === 'Group'){rebuildChilds(newId,newItem.items as I_canvas_item[])}
        addItem(newItem,parent)
    }
    function rebuildChilds(parentId:string[],items:I_canvas_item[] = [],changeName:boolean = true){
        for(let i = 0; i < items.length; i++){
            let item:I_canvas_item = items[i];
            let {type} = item;
            if(changeName){item.data.name = item.data.name + '-c'}
            let newId:string[] = [...parentId,getNewId()]
            item.data.id = newId;
            if(type === 'Group'){
                rebuildChilds(newId,item.items as I_canvas_item[])
            }
        }
    }
    function setActiveItemId(id:string | false){
        dispatch({key:'activeItemId',value:id})
        setActivePointIndex(false)
    }
    function setActivePointIndex(index:number | false){
        state.activePointIndex = index;
        dispatch({key:'activePointIndex',value:index})
    }
    function getActivePoint():(number[] | false){
        let {activeItemId,activePointIndex} = state;
        if(activeItemId === false || activePointIndex === false){return false}
        let activeItem = getItemById(activeItemId);
        if(activeItem){return activeItem.points[activePointIndex];}
        return false
    }
    function changeActivePoint([x,y]){
        let {items} = state;
        let activePoint:number[] | false = getActivePoint();
        if(activePoint){
            activePoint[0] = x;
            activePoint[1] = y;
            changeItems(items);
        }
    }
    function removePoint(item:I_canvas_item,pointIndex:number){
        let {items} = state;
        item.points.splice(pointIndex,1);
        changeItems(items);
        setActivePointIndex(false)
    }
    function getContext(){
        let context:I_context = {
            state,
            onMount:()=>dispatch({key:'mounted',value:true}),
            goToHome,
            changeItem,
            addNewItem,
            addPoint,
            addItem,removeItem,cloneItem,getItemById,removePoint,setActivePointIndex,getActivePoint,changeActivePoint,
            setActiveItemId,
            dragStart:(id:string)=>startDragId = id,
            drop:(id:string[])=>{
                if(id.toString() === startDragId.toString()){return}
                let startItem = getItemById(startDragId)
                let endItem = getItemById(id)
                if(startItem && endItem && endItem.type === 'Group'){
                    removeItem(startItem);
                    let newItems:I_canvas_item[] = (endItem.items as any[]).concat(startItem);
                    rebuildChilds(endItem.data.id,newItems,false)
                    changeItem(endItem,{items:newItems});
                }
            }
        }
        return context
    }
    return (
        <CTX.Provider value={getContext()}>
            <RVD rootNode={{className:'fullscreen aioc',column:[{html:<Header/>},{className:'flex-1',html:<Body/>}]}}/>
        </CTX.Provider>
    )
}

function Header(){
    let {goToHome}:I_context = useContext(CTX)
    return (
        <RVD
            rootNode={{
                style:{background:'lightblue'},className:'align-v p-h-24 h-48',
                row:[{html:'Go To Home',onClick:()=>goToHome()}]
            }}
        />
    )
}
function Body(){
    let {state,getItemById}:I_context = useContext(CTX);
    return (
        <RVD
            rootNode={{
                row:[
                    {size:240,html:<Items/>},
                    {flex:1,html:<Preview/>},
                    {show:!!state.activeItemId,size:240,html:()=><Setting activeItem={getItemById(state.activeItemId)}/>}
                ]               
            }}
        />
    )
}
function Items(){
    let {state}:I_context = useContext(CTX);
    return (
        <RVD 
            rootNode={{
                className:'aioc-items',
                column:[
                    {html:<Items_Header/>},
                    {flex:1,className:'ofy-auto',html:<Items_Body items={state.items} level={0}/>},
                    {size:36,className:'align-v p-h-12',style:{background:'rgba(255,255,255,.2)'},html:'items footer'}
                ]
            }}
        />
    )
}
function Items_Header(){
    return (
        <RVD
            rootNode={{
                className:'aioc-items-header align-v',
                row:[
                    {size:36,html:<AddItem/>,className:'align-vh'},
                    {flex:1},
                    {size:36,html:<Icon path={mdiDelete} size={.7}/>,classNAme:'align-vh'},
                ]
            }}
        />
    )
}
type I_AddItem = {parent?:I_canvas_item}
function AddItem(props:I_AddItem){
    let {parent} = props,{state,addNewItem}:I_context = useContext(CTX)
    return (
        <AIOInput
            type='select' caret={false} className='bg-off'
            text={<Icon path={mdiPlusThick} size={.7}/>}
            options={state.types} 
            option={{
                text:'option',
                value:'option',
                attrs:()=>{return {className:'bg-32'}}
            }}
            popover={{attrs:{style:{color:'#333'}}}}
            onChange={(type)=>addNewItem(type,parent)}
        />
    )
}
function Items_Body({items,level}){
    let {dragStart,drop,state}:I_context = useContext(CTX)
    function item_node(item){
        let active = state.activeItemId && state.activeItemId.toString() === item.id.toString();
        item.showPivot = !!active;            
        return {
            column:[
                {
                    dragId:item.id,html:<Item key={item.id} item={item} level={level} active={active}/>,
                    onDrag:()=>dragStart(item.id),onDrop:()=>drop(item.id)
                },
                {show:item.type === 'Group' && item.open,html:()=><Items_Body items={item.items} level={level + 1}/>}
            ]
        }
    }
    return (<RVD rootNode={{className:'ofy-auto',column:items.map((item,i)=>item_node(item))}}/>)
}
function Item(p:{item:I_canvas_item,level:number,active:boolean}){
    let {item,level,active} = p;
    let {changeItem,setActiveItemId}:I_context = useContext(CTX)
    return (
        <AIOInput
            className={'aioc-item' + (active?' active':'')}
            style={{paddingLeft:level * 12}}
            onClick={()=>setActiveItemId(item.data.id)}
            before={(
                <div onClick={item.type !== 'Group'?undefined:(e)=>{
                    e.stopPropagation();
                    changeItem(item,{data:{...item.data,open:!item.data.open}})
                }}>
                    <Icon path={item.type === 'Group'?(item.data.open?mdiChevronDown:mdiChevronRight):mdiCircleMedium} size={.8}/>
                </div>
            )}
            after={(
                <RVD
                    rootNode={{
                        row:[
                            {size:24,html:<Icon path={item.show === false?mdiEyeOff:mdiEye} size={.7}/>,className:'align-vh',onClick:(e)=>{
                                e.stopPropagation();
                                changeItem(item,{show:!item.show})
                            }}
                        ]
                    }}
                />
            )}
            type='text' value={item.data.name}
            onChange={(name)=>changeItem(item,{data:{...item.data,name}})}
        />
    )
}
function Preview(){
    let {state,onMount,getActivePoint}:I_context = useContext(CTX)
    let activePoint = getActivePoint();
    function mouseMove(){
        let mp:I_canvas_mousePosition = state.Canvas.mousePosition;
        $('.aioc-mouse-position').html(`${mp.x} ${mp.y}`)
        $('.msf').css({left:mp.cx,top:mp.cy})
    }
    function controller(){
        if(!state.mounted || activePoint === false){return null}
        return <PointController key={state.activeItemId + ' ' + state.activePointIndex } x={activePoint[0]} y={activePoint[1]}/>
    }
    function renderCanvas(){
        return state.Canvas.render({
            onMount:()=>onMount(),
            attrs:{
                onMouseMove:()=>mouseMove(),
                style:{position: 'absolute',left: 0,top: 0,width: '100%',height: '100%'},
            },
            grid:[10,10,'#444'],onPan:true,
            items:state.items
        })
    }
    return (
        <>
            <RVD
                rootNode={{
                    column:[
                        {className:'flex-1',html:renderCanvas()},
                        {
                            className:'h-36 c-32 p-h-24',
                            style:{background:'rgba(255,255,255,.2)'},
                            row:[{className:'aioc-mouse-position align-v',html:''}]
                        }
                    ]
                }}
            />
            {controller()}
        </>
    )
}
export type I_PointController_temp = {
    moveDom:any
}
export type I_PointController = {
    x:number,y:number
}
function PointController(props){
    let {state,changeActivePoint,addPoint}:I_context = useContext(CTX)
    let [temp] = useState({
        moveDom:createRef(),
        drawDom:createRef()
    })
    let [coords,setCoords] = useState<[number,number]>([0,0])
    let ref = useRef(coords);
    ref.current = coords;
    useEffect(()=>{
        let {Canvas} = state
        let [x,y] = Canvas.canvasToClient([props.x,props.y]);
        setCoords([x,y])
        new Swip({
            dom:$(temp.moveDom.current),
            start:()=>{
                let coords = ref.current;
                return [coords[0],coords[1]];
            },
            move:({change})=>{
                let {x,y} = change;
                setCoords([x,y])
            },
            end:()=>{
                let p = state.Canvas.clientToCanvas(ref.current,false);
                changeActivePoint(p)
            }
        })
        new Swip({
            dom:$(temp.drawDom.current),
            start:()=>{
                let coords = ref.current;
                return [coords[0],coords[1]];
            },
            move:({change})=>{
                let {x,y} = change;
                setCoords([x,y])
            },
            end:()=>{
                let {Canvas} = this.context;
                let {coords} = this.state;
                let p = Canvas.clientToCanvas(coords,false);
                addPoint(p)
            }
        })
    },[])
    let {Canvas} = this.context;
    if(this.props.x !== this.state.prevX || this.props.y !== this.state.prevY){
        setTimeout(()=>this.setState({coords:Canvas.canvasToClient([this.props.x,this.props.y]),prevX:this.props.x,prevY:this.props.y}),0)
    }
    return (
        <div className='point-controller' style={{left:coords[0],top:coords[1]}}>
            <div ref={temp.moveDom as any} className='point-controller-button-container'><button>Move</button></div>
            <div ref={temp.drawDom as any} className='point-controller-button-container'><button>Draw</button></div>
            <div className='point-controller-button-container'><button>2</button></div>
            <div className='point-controller-button-container'><button>3</button></div>
            <div className='point-controller-button-container'><button>4</button></div>
            <div className='point-controller-button-container'><button>5</button></div>
            <div className='point-controller-button-container'><button>6</button></div>
            <div className='point-controller-button-container'><button>7</button></div>
            
        </div>
    )
}
// function PointController(props){
//     let {Canvas,changeActivePoint} = useContext(CTX);
//     let [dom] = useState(createRef());
//     let [coords,setCoords] = useState(Canvas.canvasToClient([props.x,props.y]));
//     useEffect(()=>{
//         let tempx,tempy;
//         Swip({
//             dom:$(dom.current),
//             start:()=>{tempx = coords[0]; tempy = coords[1];},
//             move:({dx,dy})=>{
//                 setCoords([tempx + dx,tempy + dy])
//             },
//             end:()=>{
//                 let p = Canvas.clientToCanvas(coords);
//                 debugger
//                 changeActivePoint(p)
//             }
//         })
//     },[props.x,props.y])
//     useEffect(()=>{
//         setCoords(Canvas.canvasToClient([props.x,props.y]))
//     },[props.x,props.y])
//     console.log('1',coords)
//     return (
//         <div className='point-controller' style={{left:coords[0],top:coords[1]}}>
//             <div ref={dom} className='point-controller-button-container'><button>Move</button></div>
//             <div className='point-controller-button-container'><button>1</button></div>
//             <div className='point-controller-button-container'><button>2</button></div>
//             <div className='point-controller-button-container'><button>3</button></div>
//             <div className='point-controller-button-container'><button>4</button></div>
//             <div className='point-controller-button-container'><button>5</button></div>
//             <div className='point-controller-button-container'><button>6</button></div>
//             <div className='point-controller-button-container'><button>7</button></div>
            
//         </div>
//     )
// }
function Setting({activeItem}){
    let {changeItem,setActiveItemId,activePointIndex,removeItem,cloneItem,removePoint,setActivePointIndex} = useContext(CTX);
    let [codeView,setCodeView] = useState(false);
    function header_node(){
        return {
            className:'aioc-setting-header align-v',
            row:[
                {html:`${activeItem.name} ( ${activeItem.type} )`,flex:1},
                {html:<Icon path={mdiCodeJson} size={.7}/>,className:'align-vh h-24',onClick:()=>setCodeView(!codeView),size:24,style:{background:codeView?'orange':undefined}},
                {html:<Icon path={mdiClose} size={.7}/>,className:'align-vh',onClick:()=>setActiveItemId(false),size:24}
            ]
        }
    }
    function footer_node(){
        return {
            className:'aioc-setting-header align-v',
            row:[
                {show:activeItem.type === 'Group',html:<AddItem parent={activeItem}/>,classNAme:'align-vh',size:24},
                {html:<Icon path={mdiContentCopy} size={.7}/>,className:'align-vh',onClick:()=>cloneItem(activeItem),size:24},
                {html:<Icon path={mdiDelete} size={.7}/>,className:'align-vh',onClick:()=>removeItem(activeItem),size:24}
            ]
        }
    }
    function reset_node(change){
        return {html:<Icon path={mdiDelete} size={.7}/>,className:'align-vh p-t-16',onClick:()=>changeItem(activeItem,change)}
    }
    function form_node(){
        if(codeView){return false}
        return {
            className:'flex-1 p-6',
            html:(
                <AIOInput
                    type='form' attrs={{className:'aioc-setting-form'}} value={activeItem}
                    onChange={(value)=>changeItem(activeItem,value)}
                    inputs={{
                        className:'gap-6',
                        column:[
                            {
                                className:'gap-6',
                                row:[
                                    {input:{type:'number'},field:'value.x',label:'x'},
                                    {input:{type:'number'},field:'value.y',label:'y'}
                                ]
                            },
                            {
                                show:activeItem.type === 'Rectangle' || activeItem.type === 'Triangle',
                                className:'gap-6',
                                row:[
                                    {input:{type:'number'},field:'value.width',label:'width'},
                                    {input:{type:'number'},field:'value.height',label:'height'}
                                ]
                            },
                            {
                                className:'gap-6',
                                row:[
                                    {input:{type:'color'},field:'value.fill',label:'fill'},
                                    reset_node({fill:undefined}),
                                    {input:{type:'color'},field:'value.stroke',label:'stroke'},
                                    reset_node({stroke:undefined})
                                ]
                            },
                            {
                                show:activeItem.type === 'Arc' || activeItem.type === 'NGon',
                                className:'gap-6',
                                row:[
                                    {input:{type:'number'},field:'value.r',label:'radius'},
                                    reset_node({r:undefined})
                                ]
                            },
                            {
                                show:activeItem.type === 'NGon',input:{type:'number'},field:'value.count',label:'count'
                            },
                            {
                                className:'gap-6',
                                row:[
                                    {input:{type:'number'},field:'value.lineWidth',label:'line width'},
                                    reset_node({lineWidth:undefined}),
                                    {input:{type:'number'},field:'value.rotate',label:'rotate (deg)'},
                                    reset_node({rotate:undefined})
                                ]
                            },
                            {
                                show:activeItem.type === 'Rectangle',
                                className:'gap-6',
                                row:[
                                    {input:{type:'number'},field:'value.corner[0]',label:'corner'},
                                    {input:{type:'number'},field:'value.corner[1]',label:'a',labelAttrs:{style:{opacity:0}}},
                                    {input:{type:'number'},field:'value.corner[2]',label:'a',labelAttrs:{style:{opacity:0}}},
                                    {input:{type:'number'},field:'value.corner[3]',label:'a',labelAttrs:{style:{opacity:0}}}, 
                                    {size:12},
                                    reset_node({corner:undefined})
                                ]
                            },
                            {
                                show:activeItem.type === 'NGon',
                                input:{type:'number'},field:'value.corner',label:'corner'
                            },
                            {
                                show:activeItem.type === 'Triangle',
                                className:'gap-6',
                                row:[
                                    {input:{type:'number'},field:'value.corner[0]',label:'corner'},
                                    {input:{type:'number'},field:'value.corner[1]',label:'a',labelAttrs:{style:{opacity:0}}},
                                    {input:{type:'number'},field:'value.corner[2]',label:'a',labelAttrs:{style:{opacity:0}}},
                                    {size:12},
                                    reset_node({corner:undefined})
                                ]
                            },
                            {
                                show:activeItem.type === 'Arc',
                                className:'gap-6',
                                row:[
                                    {input:{type:'number'},field:'value.slice[0]',label:'slice from'},
                                    {input:{type:'number'},field:'value.slice[1]',label:'slice to'},
                                    reset_node({slice:undefined})
                                ]
                            },
                            {
                                className:'gap-6',
                                row:[
                                    {input:{type:'number'},field:'value.dash[0]',label:'dash fill'},
                                    {input:{type:'number'},field:'value.dash[1]',label:'dash empty'},
                                    reset_node({dash:undefined})
                                ]
                            },
                            {
                                className:'gap-6',
                                row:[
                                    {input:{type:'number'},field:'value.pivot[0]',label:'pivot x'},
                                    {input:{type:'number'},field:'value.pivot[1]',label:'pivot y'},
                                    reset_node({pivot:undefined})
                                ]
                            },
                            {
                                show:activeItem.type === 'Line',
                                className:'gap-6',
                                row:[
                                    {
                                        html:(
                                            <button onClick={()=>{
                                                changeItem(activeItem,{points:[...activeItem.points,[0,0,0]]})
                                            }}>Add Point</button>
                                        )
                                    }
                                ]
                            },
                            {
                                show:activeItem.type === 'Line',
                                column:()=>activeItem.points.map((o,i)=>{
                                    let active = activePointIndex === i;
                                    return {
                                        className:'aioc-setting-line-point' + (active?' active':''),
                                        onClick:()=>setActivePointIndex(i),
                                        row:[
                                            {input:{type:'number'},field:`value.points[${i}][0]`},
                                            {input:{type:'number'},field:`value.points[${i}][1]`},
                                            {input:{type:'number'},field:`value.points[${i}][2]`},
                                            {html:<Icon path={mdiDelete} size={.7}/>,className:'align-vh p-l-12',onClick:(e)=>{
                                                e.stopPropagation();
                                                removePoint(activeItem,i)
                                            }},
                                        ]
                                    }
                                })
                            },
                            {
                                show:activeItem.type === 'Group',
                                className:'gap-6',
                                row:[
                                    {
                                        label:'Repeat Childs',
                                        input:{type:'checkbox'},field:'value.repeatChilds'
                                    },
                                    {
                                        label:'Repeat Count',
                                        input:{type:'number'},field:'value.repeat'
                                    },
                                ]
                            },
                            {
                                show:activeItem.type === 'Group',
                                row:[
                                    {
                                        html:(
                                            <button onClick={()=>{
                                                changeItem(activeItem,{sequence:[...activeItem.sequence,'']})
                                            }}>Add Sequence</button>
                                        )
                                    }
                                ]
                            },
                            {
                                show:activeItem.type === 'Group',
                                column:()=>activeItem.sequence.map((o,i)=>{
                                    return {
                                        input:{
                                            type:'text',
                                            after:(
                                                <div onClick={()=>changeItem(activeItem,{sequence:activeItem.sequence.filter((o,index)=>index !== i)})}>
                                                    <Icon path={mdiDelete} size={.8}/>
                                                </div>
                                            )
                                        },
                                        field:`value.sequence[${i}]`
                                    }
                                })
                            }
                            
                        ]
                    }}
                />
            )
        }
    }
    function code_node(){
        if(!codeView){return false}
        return {
            flex:1,
            html:(
                AIODoc().Code(`${JSON.stringify(activeItem,null,4)}`,'js',{height:'100%'})
                
            )
        }
    }
    if(!activeItem){return null}
    return (
        <RVD
            rootNode={{
                className:'aioc-setting',
                column:[
                    header_node(),
                    form_node(),
                    code_node(),
                    footer_node(),
                    
                ]
            }}
        />
    )
}