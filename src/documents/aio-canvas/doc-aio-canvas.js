import React,{useReducer,createContext,useContext,useState} from "react";
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from "../../npm/aio-input/aio-input";
import Canvas from './../../npm/aio-canvas/aio-canvas';
import {Icon} from '@mdi/react';
import AIODoc from './../../npm/aio-documentation/aio-documentation';
import { mdiChevronDown, mdiChevronLeft, mdiChevronRight, mdiChevronUp, mdiCircle, mdiClose, mdiCodeJson, mdiContentCopy, mdiDelete, mdiEye, mdiEyeOff, mdiPlusThick } from "@mdi/js";
import './index.css';
const CTX = createContext()
function Reducer(state,action){
    return {...state,[action.key]:action.value}
}
export default function DOC_AIO_Canvas(){
    let [state,dispatch] = useReducer(Reducer,{
        items:[],
        types:['Group','Arc','Rectangle'],
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
    function getNewId(){return 'aa' + Math.round(Math.random() * 10000000);}
    function getItemById(ids){
        let {items} = state;
        let result;
        for(let i = 0; i < ids.length; i++){
            result = items.find((o)=>o.id[i] === ids[i]);
            items = result.items;
        }
        return result
    }
    function getParentById(id){
        if(id.length === 1){return false}
        return getItemById(id.slice(0,id.length - 1));
    }
    function changeItems(newItems){dispatch({key:'items',value:newItems})}
    function changeItem(item,obj){
        let {items} = state;
        for(let prop in obj){
            item[prop] = obj[prop]
        }
        dispatch({key:'items',value:items})
    }
    function addNewItem(type,parent){
        let id = getNewId();
        let newItem = {type,id:parent?[...parent.id,id]:[id],name:type + Math.round(Math.random() * 10000000),x:0,y:0,lineWidth:1,show:true,rotate:0}
        if(type === 'Arc'){
            newItem = {...newItem,r:100}
        }
        else if(type === 'Rectangle'){
            newItem = {...newItem,width:100,height:100}
        }
        else if(type === 'Group'){
            newItem = {...newItem,items:[],open:true}
        }
        addItem(newItem,parent)
    }
    function addItem(newItem,parent){
        let {items} = state;
        if(parent){changeItem(parent,{items:[...parent.items,newItem]})}
        else {changeItems(items.concat(newItem))}
    }
    function removeItem(item){
        let {items} = state;
        let parent = getParentById(item.id);
        if(parent){changeItem(parent,{items:parent.items.filter((o)=>o.id.toString() !== item.id.toString())})}
        else {changeItems(items.filter((o)=>o.id.toString() !== item.id.toString()))}
        setActiveItemId(false)
    }
    function cloneItem(item){
        let parent = getParentById(item.id);
        let newId = parent?[...parent.id,getNewId()]:[getNewId()]
        let newItem = {...item,id:newId,name:item.name + ' (clone)'};
        addItem(newItem,parent)
    }
    function setActiveItemId(id){
        debugger
        if(!state.activeItemId){dispatch({key:'activeItemId',id})}
        else if(state.activeItemId.toString() !== id.toString()){
            dispatch({key:'activeItemId',id})
        }
    }
    function getContext(){
        return {
            ...state,
            changeItem,
            addNewItem,
            addItem,removeItem,cloneItem,getItemById,
            setActiveItemId
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
    let {items} = useContext(CTX);
    function header_layout(){
        return {html:<Items_Header/>}
    }
    function body_layout(){
        return {flex:1,html:<Items_Body items={items} level={0}/>}
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
    return (
        <RVD
            layout={{
                className:'aioc-items-header',
                row:[
                    {
                        size:36,html:<AddItem/>,align:'vh'
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
function AddItem(props = {}){
    let {parent} = props;
    let {types,addNewItem} = useContext(CTX)
    return (
        <AIOInput
            type='select' caret={false}
            text={<Icon path={mdiPlusThick} size={.7}/>}
            options={types}
            optionText='option'
            optionValue='option'
            popover={{
                attrs:{style:{color:'#333'}}
            }}
            onChange={(type)=>addNewItem(type,parent)}
        />
    )
}
function Items_Body({items,level}){
    return (
        <RVD
            layout={{
                column:items.map((item,i)=>{
                    return {
                        column:[
                            {html:<Item key={item.id} item={item} level={level}/>},
                            {show:item.type === 'Group',html:()=><Items_Body items={item.items} level={level + 1}/>}
                        ]
                    }
                })
            }}
        />
    )
}
function Item({item,level}){
    let {changeItem,activeItemId,setActiveItemId} = useContext(CTX)
    return (
        <AIOInput
            className={'aioc-item' + (activeItemId === item.id?' active':'')}
            before={<Icon path={item.type === 'Group'?(item.open?mdiChevronDown:mdiChevronRight):mdiCircle} size={.8} onClick={item.type !== 'Group'?undefined:(e)=>{
                e.stopPropagation();
                changeItem(item,{open:!item.open})
            }}/>}
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
            style={{paddingLeft:level * 12}}
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
    let {activeItemId,items,changeItem,setActiveItemId,removeItem,cloneItem,getItemById} = useContext(CTX);
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
                {show:activeItem.type === 'Group',html:<AddItem parent={activeItem}/>,align:'vh',size:24},
                {html:<Icon path={mdiContentCopy} size={.7}/>,align:'vh',onClick:()=>cloneItem(activeItem),size:24},
                {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',onClick:()=>removeItem(activeItem),size:24}
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
                                show:activeItem.type === 'Rectangle',
                                row:[
                                    {input:{type:'number'},field:'value.corner[0]',label:'corner'},
                                    {input:{type:'number'},field:'value.corner[1]',label:'corner'},
                                    {input:{type:'number'},field:'value.corner[2]',label:'corner'},
                                    {input:{type:'number'},field:'value.corner[3]',label:'corner'}, 
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{corner:undefined})},
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
    if(!activeItemId){return null}
    let activeItem = getItemById(activeItemId)
    return (
        <RVD
            layout={{
                className:'aioc-setting',
                column:[
                    header_layout(activeItem),
                    form_layout(activeItem),
                    code_layout(activeItem),
                    footer_layout(activeItem),
                    
                ]
            }}
        />
    )
}