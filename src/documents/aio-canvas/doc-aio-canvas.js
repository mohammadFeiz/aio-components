import React,{useReducer,createContext,useContext,useState} from "react";
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from "../../npm/aio-input/aio-input";
import Canvas from './../../npm/aio-canvas/aio-canvas';
import {Icon} from '@mdi/react';
import AIODoc from './../../npm/aio-documentation/aio-documentation';
import { mdiChevronDown, mdiChevronLeft, mdiChevronRight, mdiChevronUp, mdiCircle, mdiClose, mdiCodeJson, mdiDelete, mdiEye, mdiEyeOff, mdiPlusThick } from "@mdi/js";
import './index.css';
const CTX = createContext()
function Reducer(state,action){
    return {...state,[action.key]:action.value}
}
export default function DOC_AIO_Canvas(){
    let [state,dispatch] = useReducer(Reducer,{
        items:[
        ],
        types:['Arc','Rectangle'],
        activeItemId:false
    })
    function header_layout(){
        return {
            html:<Header/>
        }
    }
    function body_layout(){
        return {
            flex:1,
            html:<Body/>
        }
    }
    function footer_layout(){
        return {
            html:<Footer/>
        }
    }
    function getContext(){
        return {
            ...state,
            changeItem:(item,obj)=>{
                let {items} = state;
                for(let prop in obj){
                    item[prop] = obj[prop]
                }
                dispatch({key:'items',value:items})
            },
            addItem:(type)=>{
                let {items} = state;
                let id = 'aa' + Math.round(Math.random() * 10000000);
                let item = {type,id,name:type + Math.round(Math.random() * 10000000),x:0,y:0,lineWidth:1,show:true}
                if(type === 'Arc'){
                    item = {...item,r:100}
                }
                else if(type === 'Rectangle'){
                    item = {...item,width:100,height:100}
                }
                dispatch({key:'items',value:items.concat(item)})
            },
            setActiveItemId:(id)=>dispatch({key:'activeItemId',value:state.activeItemId === id?false:id})
        }
    }
    return (
        <CTX.Provider value={getContext()}>
            <RVD
                layout={{
                    className:'fullscreen aioc',
                    column:[
                        header_layout(),
                        body_layout(),
                        footer_layout()
                    ]
                }}
            />
        </CTX.Provider>
    )
}

function Header(){
    return (
        <RVD
            layout={{
                style:{height:48,background:'lightblue'},
                html:'header'
            }}
        />
    )
}

function Body(){
    function items_layout(){
        return {
            size:240,
            html:<Items/>
        }
    }
    function preview_layout(){
        return {
            flex:1,
            html:<Preview/>
        }
    }
    function setting_layout(){
        return {
            size:240,
            html:<Setting/>
        }
    }
    return (
        <RVD
            layout={{
                row:[
                    items_layout(),
                    preview_layout(),
                    setting_layout()
                ]               
            }}
        />
    )
}
function Footer(){
    return (
        <RVD
            layout={{
                style:{background:'yellow',height:48},
                html:'footer'
            }}
        />
    )
}
function Items(){
    function header_layout(){
        return {html:<Items_Header/>}
    }
    function body_layout(){
        return {flex:1,html:<Items_Body/>}
    }
    function footer_layout(){
        return {html:'items footer'}
    }
    return (
        <RVD
            layout={{
                column:[
                    header_layout(),
                    body_layout(),
                    footer_layout()
                ]
            }}
        />
    )
}
function Items_Header(){
    let {types,addItem} = useContext(CTX)
    return (
        <RVD
            layout={{
                className:'aioc-items-header',
                row:[
                    {
                        size:36,html:(
                            <AIOInput
                                type='select' caret={false}
                                text={<Icon path={mdiPlusThick} size={.7}/>}
                                options={types}
                                optionText='option'
                                optionValue='option'
                                popover={{
                                    attrs:{style:{color:'#333'}}
                                }}
                                onChange={(type)=>addItem(type)}
                            />
                        ),align:'vh'
                    },
                    {flex:1},
                    {
                        size:36,html:<Icon path={mdiDelete} size={.7}/>,align:'vh'
                    },
                ]
            }}
        />
    )
}
function Items_Body(){
    let {items} = useContext(CTX);
    return (
        <RVD
            layout={{
                column:items.map((item,i)=>{
                    return {
                        html:<Item key={item.id} item={item}/>
                    }
                })
            }}
        />
    )
}
function Item({item}){
    let {changeItem,activeItemId,setActiveItemId} = useContext(CTX)
    return (
        <AIOInput
            className={'aioc-item' + (activeItemId === item.id?' active':'')}
            before={<Icon path={mdiCircle} size={.4}/>}
            after={(
                <RVD
                    layout={{
                        row:[
                            {size:24,html:<Icon path={item.show === false?mdiEyeOff:mdiEye} size={.7}/>,align:'vh',onClick:(e)=>{
                                e.stopPropagation();
                                changeItem(item,{show:!item.show})
                            }}
                        ]
                    }}
                />
            )}
            type='text'
            value={item.name}
            onChange={(name)=>changeItem(item,{name})}
            onClick={()=>setActiveItemId(item.id)}
        />
    )
}
function Preview(){
    let {items} = useContext(CTX)
    return (
        <RVD
            layout={{
                html:(
                    <Canvas
                        grid={[20,20,'#444']}
                        style={{position: 'absolute',left: 0,top: 0,width: '100%',height: '100%'}}
                        items={items}
                    />
                )
            }}
        />
    )
}
function Setting(){
    let {activeItemId,items,changeItem,setActiveItemId} = useContext(CTX);
    let [codeView,setCodeView] = useState(false);
    function header_layout(activeItem){
        return {
            className:'aioc-setting-header',align:'v',
            row:[
                {html:`${activeItem.name} ( ${activeItem.type} )`,flex:1},
                {html:<Icon path={mdiCodeJson} size={.7}/>,align:'vh',onClick:()=>setCodeView(!codeView),size:24,style:{height:24,background:codeView?'orange':undefined}},
                {html:<Icon path={mdiClose} size={.7}/>,align:'vh',onClick:()=>setActiveItemId(false),size:24}
            ]
        }
    }
    function footer_layout(activeItem){
        return {
            className:'aioc-setting-header',align:'v',
            row:[
                {html:`${activeItem.name} ( ${activeItem.type} )`,flex:1},
                {html:<Icon path={mdiCodeJson} size={.7}/>,align:'vh',onClick:()=>setCodeView(!codeView),size:24,style:{height:24,background:codeView?'orange':undefined}},
                {html:<Icon path={mdiClose} size={.7}/>,align:'vh',onClick:()=>setActiveItemId(false),size:24}
            ]
        }
    }
    function form_layout(activeItem){
        if(codeView){return false}
        return {
            flex:1,
            html:(
                <AIOInput
                    type='form'
                    className='aioc-setting-form'
                    value={activeItem}
                    onChange={(value)=>changeItem(activeItem,value)}
                    inputs={{
                        props:{gap:12},
                        column:[
                            {
                                row:[
                                    {input:{type:'number'},field:'value.x',label:'x'},
                                    {input:{type:'number'},field:'value.y',label:'y'}
                                ]
                            },
                            {
                                row:[
                                    {input:{type:'color'},field:'value.fill',label:'fill'},
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{fill:undefined})},
                                    {input:{type:'color'},field:'value.stroke',label:'stroke'},
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{stroke:undefined})},
                                    
                                ]
                            },
                            {
                                show:activeItem.type === 'Arc',input:{type:'number'},field:'value.r',label:'radius'
                            },
                            {
                                row:[
                                    {
                                        input:{type:'number'},field:'value.lineWidth',label:'line width'
                                    },
                                    {
                                        input:{type:'number'},field:'value.rotate',label:'rotate (deg)'
                                    },
                                ]
                            },
                            {
                                row:[
                                    {input:{type:'number'},field:'value.slice[0]',label:'slice from'},
                                    {input:{type:'number'},field:'value.slice[1]',label:'slice to'},
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{slice:undefined})},
                                ]
                            },
                            
                        ]
                    }}
                />
            )
        }
    }
    function code_layout(activeItem){
        if(!codeView){return false}
        return {
            flex:1,
            html:(
                AIODoc().Code(`${JSON.stringify(activeItem,null,4)}`,'js',{height:'100%'})
                
            )
        }
    }
    if(activeItemId === false){return null}
    let activeItem = items.find((o)=>o.id === activeItemId)
    return (
        <RVD
            layout={{
                className:'aioc-setting',
                column:[
                    header_layout(activeItem),
                    form_layout(activeItem),
                    code_layout(activeItem),

                ]
            }}
        />
    )
}