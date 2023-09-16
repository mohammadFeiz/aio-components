import React,{useReducer,createContext,useContext,useState,createRef,useEffect} from "react";
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from "../../npm/aio-input/aio-input";
import AIOCanvas from './../../npm/aio-canvas/aio-canvas';
import AIOSwip from './../../npm/aio-swip/aio-swip';
import {Icon} from '@mdi/react';
import AIODoc from './../../npm/aio-documentation/aio-documentation';
import { mdiChevronDown, mdiChevronLeft, mdiChevronRight, mdiChevronUp, mdiCircle, mdiCircleMedium, mdiCircleSmall, mdiClose, mdiCodeJson, mdiContentCopy, mdiDelete, mdiEye, mdiEyeOff, mdiPlusThick } from "@mdi/js";
import './index.css';
import $ from 'jquery';
import { Component } from "react";
const CTX = createContext()
function Reducer(state,action){
    return {...state,[action.key]:action.value}
}
export default function DOC_AIO_Canvas({goToHome}){
    let [state,dispatch] = useReducer(Reducer,{
        items:[
            
        ],
        Canvas:new AIOCanvas(),
        types:['Group','Arc','Rectangle','Line','NGon','Triangle'],
        activeItemId:false,
        activePointIndex:false
    })
    let startDragId;
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
    function getNewId(){return 'aa' + Math.round(Math.random() * 10000000);}
    function getItemById(ids){
        let {items} = state;
        let result;
        for(let i = 0; i < ids.length; i++){
            result = items.find((o)=>o.id[i] === ids[i]);
            if(result){items = result.items;}
        }
        return result
    }
    function getParentById(id){
        if(id.length === 1){return false}
        return getItemById(id.slice(0,id.length - 1));
    }
    function changeItems(newItems){
        state.items = newItems;
        dispatch({key:'items',value:newItems})
    }
    function changeItem(p,obj){
        let {items} = state;
        let item = Array.isArray(p)?getItemById(p):p;
        for(let prop in obj){item[prop] = obj[prop]}
        changeItems(items)
    }
    function addNewItem(type,parent){
        let id = getNewId();
        let newItem = {
            type,id:parent?[...parent.id,id]:[id],name:type + Math.round(Math.random() * 10000000),show:true,
            events:{
                'click':()=>alert()
            }
        }
        if(type === 'Arc'){
            newItem = {...newItem,r:100}
        }
        else if(type === 'Rectangle'){
            newItem = {...newItem,width:100,height:100}
        }
        else if(type === 'Group'){
            newItem = {...newItem,items:[],sequence:[],open:true}
        }
        else if(type === 'Line'){
            newItem = {...newItem,points:[]}
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
        if(parent){
            let newItems = parent.items.filter((o)=>o.id.toString() !== item.id.toString());
            changeItem(parent,{items:newItems});
            if(newItems.length){setActiveItemId(newItems[newItems.length - 1].id)}
            else {setActiveItemId(false)}
        }
        else {
            let newItems = items.filter((o)=>o.id.toString() !== item.id.toString())
            changeItems(newItems);
            if(newItems.length){setActiveItemId(newItems[newItems.length - 1].id)}
            else {setActiveItemId(false)}
        }
    }
    function cloneItem(item){
        item = JSON.parse(JSON.stringify(item))
        let parent = getParentById(item.id);
        let newId = parent?[...parent.id,getNewId()]:[getNewId()]
        let newItem = {...item,id:newId,name:item.name + '-c'};
        if(newItem.type === 'Group'){rebuildChilds(newId,newItem.items)}
        addItem(newItem,parent)
    }
    function rebuildChilds(parentId,items = [],changeName = true){
        for(let i = 0; i < items.length; i++){
            let item = items[i];
            let {type} = item;
            if(changeName){item.name = item.name + '-c'}
            let newId = [...parentId,getNewId()]
            item.id = newId;
            if(type === 'Group'){
                rebuildChilds(newId,item.items)
            }
        }
    }

    function setActiveItemId(id){
        dispatch({key:'activeItemId',value:id})
        setActivePointIndex(false)
    }
    function setActivePointIndex(index){
        state.activePointIndex = index;
        dispatch({key:'activePointIndex',value:index})
    }
    function getActivePoint(){
        let {activeItemId,activePointIndex} = state;
        if(activeItemId === false || activePointIndex === false){return false}
        let activeItem = getItemById(activeItemId);
        return activeItem.points[activePointIndex];
    }
    function changeActivePoint([x,y]){
        let {items} = state;
        let activePoint = getActivePoint();
        activePoint[0] = x;
        activePoint[1] = y;
        changeItems(items);
    }
    function removePoint(item,pointIndex){
        let {items} = state;
        item.points.splice(pointIndex,1);
        changeItems(items);
        setActivePointIndex(false)
    }
    function getContext(){
        return {
            ...state,
            onMount:()=>dispatch({key:'mounted',value:true}),
            goToHome,
            changeItem,
            addNewItem,
            addItem,removeItem,cloneItem,getItemById,removePoint,setActivePointIndex,getActivePoint,changeActivePoint,
            setActiveItemId,
            dragStart:(id)=>{
                startDragId = id;
            },
            drop:(id)=>{
                if(id.toString() === startDragId.toString()){return}
                let startItem = getItemById(startDragId)
                let endItem = getItemById(id)
                if(endItem.type === 'Group'){
                    removeItem(startItem);
                    let newItems = endItem.items.concat(startItem);
                    rebuildChilds(endItem.id,newItems,false)
                    changeItem(endItem,{items:newItems});
                }
            }
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
                    ]
                }}
            />
        </CTX.Provider>
    )
}

function Header(){
    let {goToHome} = useContext(CTX)
    return (
        <RVD
            layout={{
                style:{height:48,background:'lightblue',padding:'0 24px'},align:'v',
                row:[
                    {html:'Go To Home',onClick:()=>goToHome()}
                ]
            }}
        />
    )
}

function Body(){
    let {activeItemId,getItemById} = useContext(CTX);
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
        if(!activeItemId){return false}
        let activeItem = getItemById(activeItemId)
        return {
            size:240,
            html:<Setting activeItem={activeItem}/>
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
function Items(){
    let {items} = useContext(CTX);
    function header_layout(){
        return {html:<Items_Header/>}
    }
    function body_layout(){
        return {flex:1,className:'ofy-auto',html:<Items_Body items={items} level={0}/>}
    }
    function footer_layout(){
        return {size:36,align:'v',style:{background:'rgba(255,255,255,.2)',padding:'0 12px'},html:'items footer'}
    }
    return (
        <RVD
            layout={{
                className:'aioc-items',
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
    let {dragStart,drop,activeItemId} = useContext(CTX)
    return (
        <RVD
            onDragStart={(startDragId)=>dragStart(startDragId)}
            onDrop={(endDragId)=>drop(endDragId)}
            layout={{
                className:'ofy-auto',
                column:items.map((item,i)=>{
                    let active = activeItemId && activeItemId.toString() === item.id.toString();
                    item.showPivot = !!active;
                    return {
                        column:[
                            {dragId:item.id,html:<Item key={item.id} item={item} level={level} active={active}/>},
                            {show:item.type === 'Group' && item.open,html:()=><Items_Body items={item.items} level={level + 1}/>}
                        ]
                    }
                })
            }}
        />
    )
}
function Item({item,level,active}){
    let {changeItem,setActiveItemId} = useContext(CTX)
    return (
        <AIOInput
            className={'aioc-item' + (active?' active':'')}
            before={<Icon path={item.type === 'Group'?(item.open?mdiChevronDown:mdiChevronRight):mdiCircleMedium} size={.8} onClick={item.type !== 'Group'?undefined:(e)=>{
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
    let {Canvas,items,onMount,mounted,activeItemId,activePointIndex,getActivePoint} = useContext(CTX)
    let activePoint = getActivePoint();
    return (
        <>
        <RVD
            layout={{
                column:[
                    {
                        flex:1,
                        html:(
                            Canvas.render({
                                onMount:()=>onMount(),
                                onPan:true,
                                events:{
                                    onMouseMove:()=>{
                                        let mp = Canvas.mousePosition || {};
                                        $('.aioc-mouse-position').html(`${mp.x} ${mp.y}`)
                                        $('.msf').css({left:mp.cx,top:mp.cy})
                                        
                                    }
                                },
                                grid:[10,10,'#444'],
                                style:{position: 'absolute',left: 0,top: 0,width: '100%',height: '100%'},
                                items
                            })
                        )
                    },
                    {
                        style:{background:'rgba(255,255,255,.2)',height:36,color:'#fff',padding:'0 24px'},
                        row:[
                            {align:'v',className:'aioc-mouse-position',html:''}
                        ]
                    }
                ]
            }}
        />
        {!!mounted && activePoint !== false && <PointController key={activeItemId + ' ' + activePointIndex } x={activePoint[0]} y={activePoint[1]}/>}
        </>
    )
}
class PointController extends Component{
    static contextType = CTX;
    constructor(props){
        super(props);
        this.moveDom = createRef()
        this.drawDom = createRef()
        this.state = {
            coords:[0,0],prevX:props.x,prevY:props.y
        }
        
    }
    componentDidMount(){
        let {Canvas} = this.context;
        let {x,y} = this.props;
        this.setState({coords:Canvas.canvasToClient([x,y])})
        AIOSwip({
            dom:$(this.moveDom.current),
            start:()=>{
                let {coords} = this.state;
                return [coords[0],coords[1]];
            },
            move:({x,y})=>{
                this.setState({coords:[x,y]})
            },
            end:()=>{
                let {Canvas,changeActivePoint} = this.context;
                let {coords} = this.state;
                let p = Canvas.clientToCanvas(coords,false);
                changeActivePoint(p)
            }
        })
        AIOSwip({
            dom:$(this.drawDom.current),
            start:()=>{
                let {coords} = this.state;
                return [coords[0],coords[1]];
            },
            move:({x,y})=>{
                this.setState({coords:[x,y]})
            },
            end:()=>{
                let {Canvas,addPoint} = this.context;
                let {coords} = this.state;
                let p = Canvas.clientToCanvas(coords,false);
                addPoint(p)
            }
        })
    }
    render(){
        let {Canvas} = this.context;
        if(this.props.x !== this.state.prevX || this.props.y !== this.state.prevY){
            setTimeout(()=>this.setState({coords:Canvas.canvasToClient([this.props.x,this.props.y]),prevX:this.props.x,prevY:this.props.y}),0)
        }
        let {coords} = this.state;
        return (
            <div className='point-controller' style={{left:coords[0],top:coords[1]}}>
                <div ref={this.moveDom} className='point-controller-button-container'><button>Move</button></div>
                <div ref={this.drawDom} className='point-controller-button-container'><button>Draw</button></div>
                <div className='point-controller-button-container'><button>2</button></div>
                <div className='point-controller-button-container'><button>3</button></div>
                <div className='point-controller-button-container'><button>4</button></div>
                <div className='point-controller-button-container'><button>5</button></div>
                <div className='point-controller-button-container'><button>6</button></div>
                <div className='point-controller-button-container'><button>7</button></div>
                
            </div>
        )
    }
}
// function PointController(props){
//     let {Canvas,changeActivePoint} = useContext(CTX);
//     let [dom] = useState(createRef());
//     let [coords,setCoords] = useState(Canvas.canvasToClient([props.x,props.y]));
//     useEffect(()=>{
//         let tempx,tempy;
//         AIOSwip({
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
    function header_layout(){
        return {
            className:'aioc-setting-header',align:'v',
            row:[
                {html:`${activeItem.name} ( ${activeItem.type} )`,flex:1},
                {html:<Icon path={mdiCodeJson} size={.7}/>,align:'vh',onClick:()=>setCodeView(!codeView),size:24,style:{height:24,background:codeView?'orange':undefined}},
                {html:<Icon path={mdiClose} size={.7}/>,align:'vh',onClick:()=>setActiveItemId(false),size:24}
            ]
        }
    }
    function footer_layout(){
        return {
            className:'aioc-setting-header',align:'v',
            row:[
                {show:activeItem.type === 'Group',html:<AddItem parent={activeItem}/>,align:'vh',size:24},
                {html:<Icon path={mdiContentCopy} size={.7}/>,align:'vh',onClick:()=>cloneItem(activeItem),size:24},
                {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',onClick:()=>removeItem(activeItem),size:24}
            ]
        }
    }
    function form_layout(){
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
                                show:activeItem.type === 'Rectangle' || activeItem.type === 'Triangle',
                                row:[
                                    {input:{type:'number'},field:'value.width',label:'width'},
                                    {input:{type:'number'},field:'value.height',label:'height'}
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
                                show:activeItem.type === 'Arc' || activeItem.type === 'NGon',
                                row:[
                                    {input:{type:'number'},field:'value.r',label:'radius'},
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{r:undefined})},
                                ]
                            },
                            {
                                show:activeItem.type === 'NGon',input:{type:'number'},field:'value.count',label:'count'
                            },
                            {
                                row:[
                                    {
                                        input:{type:'number'},field:'value.lineWidth',label:'line width'
                                    },
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{lineWidth:undefined})},
                                    {
                                        input:{type:'number'},field:'value.rotate',label:'rotate (deg)'
                                    },
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{rotate:undefined})},
                                    
                                ]
                            },
                            {
                                props:{gap:0},
                                show:activeItem.type === 'Rectangle',
                                row:[
                                    {input:{type:'number'},field:'value.corner[0]',label:'corner'},
                                    {input:{type:'number'},field:'value.corner[1]',label:'a',labelAttrs:{style:{opacity:0}}},
                                    {input:{type:'number'},field:'value.corner[2]',label:'a',labelAttrs:{style:{opacity:0}}},
                                    {input:{type:'number'},field:'value.corner[3]',label:'a',labelAttrs:{style:{opacity:0}}}, 
                                    {size:12},
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{corner:undefined})},
                                ]
                            },
                            {
                                show:activeItem.type === 'NGon',
                                input:{type:'number'},field:'value.corner',label:'corner'
                            },
                            {
                                props:{gap:0},
                                show:activeItem.type === 'Triangle',
                                row:[
                                    {input:{type:'number'},field:'value.corner[0]',label:'corner'},
                                    {input:{type:'number'},field:'value.corner[1]',label:'a',labelAttrs:{style:{opacity:0}}},
                                    {input:{type:'number'},field:'value.corner[2]',label:'a',labelAttrs:{style:{opacity:0}}},
                                    {size:12},
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{corner:undefined})},
                                ]
                            },
                            {
                                show:activeItem.type === 'Arc',
                                row:[
                                    {input:{type:'number'},field:'value.slice[0]',label:'slice from'},
                                    {input:{type:'number'},field:'value.slice[1]',label:'slice to'},
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{slice:undefined})},
                                ]
                            },
                            {
                                row:[
                                    {input:{type:'number'},field:'value.dash[0]',label:'dash fill'},
                                    {input:{type:'number'},field:'value.dash[1]',label:'dash empty'},
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{dash:undefined})},
                                ]
                            },
                            {
                                row:[
                                    {input:{type:'number'},field:'value.pivot[0]',label:'pivot x'},
                                    {input:{type:'number'},field:'value.pivot[1]',label:'pivot y'},
                                    {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingTop:16},onClick:()=>changeItem(activeItem,{pivot:undefined})},
                                ]
                            },
                            {
                                show:activeItem.type === 'Line',
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
                                show:activeItem.type === 'Line',props:{gap:0},
                                column:()=>activeItem.points.map((o,i)=>{
                                    let active = activePointIndex === i;
                                    return {
                                        className:'aioc-setting-line-point' + (active?' active':''),
                                        onClick:()=>setActivePointIndex(i),
                                        row:[
                                            {input:{type:'number'},field:`value.points[${i}][0]`},
                                            {input:{type:'number'},field:`value.points[${i}][1]`},
                                            {input:{type:'number'},field:`value.points[${i}][2]`},
                                            {html:<Icon path={mdiDelete} size={.7}/>,align:'vh',style:{paddingLeft:12},onClick:(e)=>{
                                                e.stopPropagation();
                                                removePoint(activeItem,i)
                                            }},
                                        ]
                                    }
                                })
                            },
                            {
                                row:[
                                    {
                                        show:activeItem.type === 'Group',label:'Repeat Childs',
                                        input:{type:'checkbox'},field:'value.repeatChilds'
                                    },
                                    {
                                        label:'Repeat Count',
                                        input:{type:'number',text:'Repeat'},field:'value.repeat'
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
                                show:activeItem.type === 'Group',props:{gap:0},
                                column:()=>activeItem.sequence.map((o,i)=>{
                                    return {input:{type:'text'},field:`value.sequence[${i}]`}
                                })
                            }
                            
                        ]
                    }}
                />
            )
        }
    }
    function code_layout(){
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
            layout={{
                className:'aioc-setting',
                column:[
                    header_layout(),
                    form_layout(),
                    code_layout(),
                    footer_layout(),
                    
                ]
            }}
        />
    )
}