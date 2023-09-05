import React,{useReducer,createContext,useContext} from "react";
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from "../../npm/aio-input/aio-input";
import {Icon} from '@mdi/react';
import { mdiCircle, mdiDelete, mdiPlusThick } from "@mdi/js";
import './index.css';
const CTX = createContext()
function Reducer(state,action){
    return {...state,[action.key]:action.value}
}
export default function DOC_AIO_Canvas(){
    let [state,dispatch] = useReducer(Reducer,{
        items:[
            {id:0,name:'my item 0'},
            {id:1,name:'my item 1'},
            {id:2,name:'my item 2'},
            {id:3,name:'my item 3'},
            {id:4,name:'my item 4'},
            {id:5,name:'my item 5'},
            {id:6,name:'my item 6'},
            {id:7,name:'my item 7'},
            {id:8,name:'my item 8'},
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
                let item = {id,name:type + Math.round(Math.random() * 10000000)}
                if(type === 'Arc'){
                    item = {...item,r:100}
                }
                dispatch({key:'items',value:items.concat(item)})
            },
            setActiveItemId:(id)=>dispatch({key:'activeItemId',value:id})
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
            type='text'
            value={item.name}
            onChange={(name)=>changeItem(item,{name})}
            onClick={()=>setActiveItemId(item.id)}
        />
    )
}
function Preview(){
    return (
        <RVD
            layout={{
                html:'preview'
            }}
        />
    )
}
function Setting(){
    return (
        <RVD
            layout={{
                html:'setting'
            }}
        />
    )
}