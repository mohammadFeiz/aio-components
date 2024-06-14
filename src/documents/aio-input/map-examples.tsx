import { Component,FC, useState } from "react"
import AIOInput,{ I_Map_area,I_Map_marker,AI } from "../../npm/aio-input"
import Code from '../../npm/code/index';
import RVD,{ I_RVD_node } from './../../npm/react-virtual-dom/index.tsx';
import {mdiChevronLeft, mdiChevronRight,mdiOfficeBuilding,mdiGift, mdiMinusThick, mdiPlusThick } from "@mdi/js"
import { Storage } from "../../npm/aio-utils/index.tsx";
import Icon from '@mdi/react';
const MapExamples:FC = ()=>{
    let [examples] = useState<any>([
        ['apiKeys',APIKeys],
        ['draggable',Draggable],
        ['traffic',Traffic],
        ['onClick',OnClick],
        ['title',Title],
        ['marker',Marker],
        ['value zoom',ValueZoom],
        ['onChange',OnChange],
        ['area',Area],
        ['markers',Markers],
        ['search',Search],
        ['popupConfig',PopupConfig]
    ])
    let [numbers] = useState<number[]>(new Array(examples.length).fill(0).map((o,i)=>i))
    let [setting,SetSetting] = useState<any>(new Storage(`treeexamplessetting`).load('setting',{
        show:0
    }))
    function setSetting(setting:any){
        new Storage('treeexamplessetting').save('setting',setting)
        SetSetting(setting)
    }
    function changeShow(dir: 1 | -1 ){
        let newShow:number = setting.show + dir;
        if(newShow < -1){newShow = examples.length - 1 }
        if(newShow > examples.length - 1){newShow = -1}
        setSetting({...setting,show:newShow})
    }
    function setting_node(){
        let btnstyle = {background:'none',border:'none'}
        return {
            className:'p-12',
            html:(
                <AIOInput
                    type='form'
                    value={{...setting}}
                    onChange={(newSetting)=>setSetting({...newSetting})}
                    node={{
                        dir:'h',
                        childs:[
                                {flex:1},
                            {
                                input:{
                                    type:'select',options:numbers,before:'Show:',
                                    option:{
                                        text:(option:any)=>option === -1?"all":examples[option][0],
                                        value:'option'
                                    },
                                    popover:{
                                        maxHeight:'100vh'
                                    }
                                },
                                field:'value.show'
                            },
                            {className:'align-vh',html:<button type='button' style={btnstyle} onClick={()=>changeShow(-1)}><Icon path={mdiMinusThick} size={1}/></button>},
                            {className:'align-vh',html:<button type='button' style={btnstyle} onClick={()=>changeShow(1)}><Icon path={mdiPlusThick} size={1}/></button>}
                        ]
                    }}
                />
            )
        }
    }
    function render_node(){
        let rows = [
            {name:'mohammad',family:'feiz',age:38,id:0},
            {name:'john',family:'doe',age:30,id:1},
        ]
        let rowsCode = `
let [rows,setRows] = useState([
    {name:'mohammad',family:'feiz',age:38,id:0},
    {name:'john',family:'doe',age:30,id:1},
])
        `
        return {
            key:JSON.stringify(setting),
            className:'ofy-auto flex-1 p-12',
            column:examples.map((o:any,i:number)=>{
                let [title,COMP,cond] = o;
                if(cond === false){return {}}
                if(setting.show !== -1 && setting.show !== i){return {}}
                return {
                    html:(
                        <div className='w-100'>
                            <h3>{`${i} - ${title}`}</h3>
                            <COMP rows={rows} rowsCode={rowsCode}/>
                        </div>
                    )
                }
            })
        }
    }
    return (<RVD rootNode={{className:'h-100',column:[setting_node(),render_node()]}}/>)   
}
export default MapExamples
class APIKeys extends Component {
    render() {
        return (
            <div className='example'>
                {
                    Code(`
AIOInput.defaults.mapApiKeys = {
    map:'web.0a2aa5f83d314a8c9916473aa0e01438',
    service:'service.09a2234e299a4ff585007b2894df9fca',
}
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
}
const Draggable:FC = ()=> {
    let p1:AI = {type:'map'}
    let p2:AI = {type:'map',mapConfig:{draggable:false}}
    return (
        <div className='example'>
            <AIOInput key='p1' {...p1}/>
            {
                Code(`
<AIOInput type='map'/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
            {/* <AIOInput key='p2' {...p2}/>
            {
                Code(`
<AIOInput type='map' mapConfig={{draggable:false}}/>
                `)
            } */}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
    
}
const Traffic:FC = ()=> {
    let p:AI = {type:'map',mapConfig:{traffic:true}}
    return (
        <div className='example'>
            <AIOInput {...p}/>
            {
                Code(`
<AIOInput type='map' mapConfig={{traffic:true}}/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
const OnClick:FC = ()=> {
    let p:AI = {type:'map',attrs:{onClick:()=>alert('you clicked map')}}
    return (
        <div className='example'>
            <AIOInput {...p}/>
            {
                Code(`
<AIOInput type='map' attrs={{onClick:()=>alert('you clicked map')}}/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
const Title:FC = ()=> {
    let p:AI = {type:'map',mapConfig:{title:'نمایش موقعیت'}}
    return (
        <div className='example'>
            <AIOInput {...p}/>
            {
                Code(`
<AIOInput type='map' mapConfig={{title:'نمایش موقعیت'}}/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
const Marker:FC = ()=> {
    function getMarker(){
        return (
            <div className='flex fd-column align-h w-24'>
                <div className='w-10 h-10 br-100' style={{background:'#4AA45D'}}></div>
                <div className='w-2 h-16 bg-0'></div>
            </div>
        )
    }
    let p1:AI = {type:'map'}
    let p2:AI = {type:'map',mapConfig:{marker:false}}
    let p3:AI = {type:'map',mapConfig:{marker:{size:16,color:'transparent',html:getMarker()}}}
    return (
        <div className='example'>
            {getMarker()}
            <AIOInput {...p1}/>
            {
                Code(`
<AIOInput type='map'/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
            <AIOInput {...p2}/>
            {
                Code(`
<AIOInput type='map' mapConfig={{marker:false}}/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
            <AIOInput {...p3}/>
            {
                Code(`
<AIOInput type='map' mapConfig={{marker:{size:16,color:'transparent',html:getMarker()}}}/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function ValueZoom() {
    let [value,setValue] = useState<{lat:number,lng:number,zoom:number}>({lat:35.694739,lng:51.394097,zoom:14})
    function ctrl_node(p:{field:'lat'|'lng'|'zoom',step:number,toFixed:number}){
        let {field,step,toFixed} = p;
        let props:I_CTRL = {onChange:(v)=>setValue({...value,[field]:v}),toFixed,field,value:value[field],step}
        return {html:<CTRL {...props}/>}
    }
    function renderMap(){
        let {zoom,lat,lng} = value;
        let p:AI = {type:'map',mapConfig:{zoom},value:{lat,lng}}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            <RVD
                rootNode={{
                    row:[
                        ctrl_node({field:'lat',step:0.001,toFixed:6}),
                        ctrl_node({field:'lng',step:0.001,toFixed:6}),
                        ctrl_node({field:'zoom',step:0.001,toFixed:6})
                    ]
                }}
            />
            {renderMap()}
            {
                Code(`
<AIOInput type='map' mapConfig={{zoom:${value.zoom}}} value={{lat:${value.lat},lng:${value.lng}}}/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function OnChange() {
    let [value,setValue] = useState({lat:35.694739,lng:51.394097})
    let p:AI = {type:'map',value,onChange:(value)=>setValue(value)}
    return (
        <div className='example'>
            <span>{`latitude = ${value.lat}`}</span>
            <span>{`longitude = ${value.lng}`}</span>
            <AIOInput {...p}/>
            {
                Code(`
<AIOInput type='map' value={{lat,lng}} onChange={({lat,lng})=>this.setState({lat,lng})}/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
type I_CTRL = {field:string,value:any,step:number,toFixed:number,onChange:(obj:any)=>void}
function CTRL(props:{field:any,step:number,toFixed:number,onChange:any,value:any}){
    let {field,step,toFixed,onChange,value} = props;
    function change(dir:1 | -1){
        let result = value + (dir * step);
        result = +result.toFixed(toFixed)
        onChange(result)
    }
    return (
        <RVD
            rootNode={{
                style:{border:'1px solid #ddd',padding:12},
                className:'fs-12',
                row:[
                    {html:field,className:'align-v bold'},
                    {size:12},
                    {
                        row:[
                            {html:<button onClick={()=>change(-1)}><Icon size={1} path={mdiChevronLeft}/></button>},
                            {html:value,size:120,className:'align-vh'},
                            {html:<button onClick={()=>change(1)}><Icon size={1} path={mdiChevronRight}/></button>}
                        ]
                    }
                ]
            }}
        />
    )
}
function Area() {
    let [area,setArea] = useState<I_Map_area>({lat:35.698739,lng:51.345097,radius:2000,color:'orange',opacity:0.2})
    function ctrl_node(p:{field:keyof I_Map_area,step:number,toFixed:number}):I_RVD_node{
        let {field,step,toFixed} = p;
        let props:I_CTRL = {field,value:area[field],step,toFixed,onChange:(v)=>setArea({...area,[field]:v})}
        return {html:<CTRL {...props}/>}
    }
    function opacity_node():I_RVD_node{
        let p:AI = {
            type:'range',attrs:{style:{width:'100%'}},value:[area.opacity],step:0.1,start:0,end:1,
            onChange:(opacity)=>{
                setArea({...area,opacity})
            }
        }
        return {
            className:'flex-1 p-12',
            style:{border:'1px solid #ddd'},
            row:[
                {html:'opacity',className:'align-v bold'},
                {flex:1,html:(<AIOInput {...p}/>)}
            ]
        }
    }
    function color_node(){
        return {
            flex:1,
            style:{border:'1px solid #ddd',padding:12},
            row:[
                {html:'color',className:'align-v bold'},
                {size:12},
                {
                    flex:1,
                    html:(
                        <AIOInput
                            type='color' attrs={{style:{width:'100%'}}} value={area.color}
                            onChange={(color)=>setArea({...area,color})}
                        />
                    )
                },
            ]
        }
    }
    function renderMap(){
        let p:AI = {type:'map',mapConfig:{area}}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            <RVD
                rootNode={{
                    column:[
                        {className:'gap-36',row:[ctrl_node({field:'lat',step:0.001,toFixed:6}),ctrl_node({field:'lng',step:0.001,toFixed:6}),ctrl_node({field:'radius',step:100,toFixed:0})]},
                        {row:[opacity_node(),{size:24},color_node()]}
                    ]
                }}
            />
            {renderMap()}
            {
                Code(`
....
let = area:{
lat:${area.lat},
lng:${area.lng},
radius:${area.radius},
color:${area.color},
opacity:${area.opacity}
}
<AIOInput type='map'mapConfig={{area}}/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Markers() {
    let [markers,setMarkers] = useState<I_Map_marker[]>([
        {
            lat:35.698739,lng:51.345097,size:30,color:'orange',
            html:<Icon path={mdiOfficeBuilding} size={1}/>,
            popup:({lat,lng})=>lat
        },
        {
            lat:35.698739,lng:51.322097,size:30,color:'red',
            html:<Icon path={mdiOfficeBuilding} size={1}/>,
            popup:({lat,lng})=>lat
        },
        {
            lat:35.696739,lng:51.355097,size:30,color:'red',
            html:<Icon path={mdiGift} size={1}/>,
            text:<div style={{color:'#fff',background:'red',padding:'0 12px'}}>this is my text</div>,
            popup:({lat,lng})=>lat
        }
    ])
    function ctrl_node(p:{field:keyof I_Map_marker,index:number,toFixed:number,step:number}){
        let {field,index,toFixed,step} = p;
        let value = markers[index][field];
        let props:I_CTRL = {field,value,step,toFixed,onChange:(v)=>setMarkers(markers.map((o:I_Map_marker,i:number)=>index === i?{...markers[i],[field]:v}:o))}
        return {html:<CTRL {...props}/>}
    }
    function renderMap(){
        let p:AI = {type:'map',mapConfig:{markers,address:false}}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            <RVD
                rootNode={{
                    className:'gap-36',
                    row:[
                        ctrl_node({field:'lat',index:0,toFixed:6,step:0.001}),
                        ctrl_node({field:'lng',index:0,toFixed:6,step:0.001}),
                        ctrl_node({field:'size',index:0,toFixed:0,step:1}),
                    ]
                }}
            />
            {renderMap()}
            {
                Code(`
ler markers = [
    {
        lat:${markers[0].lat},
        lng:${markers[0].lng},
        size:${markers[0].size},
        color:'orange',
        html:<Icon path={mdiOfficeBuilding} size={1}/>,
        popup:(marker)=>marker.latitude
    },
    {
        lat:35.698739,lng:51.322097,size:30,color:'red',
        html:<Icon path={mdiOfficeBuilding} size={1}/>,
        popup:({lat,lng})=>lat
    },
    {
        lat:35.696739,lng:51.355097,size:30,color:'red',
        html:<Icon path={mdiGift} size={1}/>,
        text:<div style={{color:'#fff',background:'red',padding:'0 12px'}}>this is my text</div>,
        popup:({lat,lng})=>lat
    }
]
<AIOInput type='map' mapConfig={{markers}}/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Search () {
    let [value,setValue] = useState({lat:35.694739,lng:51.394097})
    function renderMap(){
        let p:AI = {type:'map',value,onChange:({lat,lng})=>setValue({lat,lng}),mapConfig:{search:'جستجو'}}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            <span>{`latitude = ${value.lat}`}</span>
            <span>{`longitude = ${value.lng}`}</span>
            {renderMap()}
            {
                Code(`
let [value,setValue] = useState({lat:35.694739,lng:51.394097})
return (
    <AIOInput 
        type='map'
        value={value} 
        onChange={({lat,lng})=>setValue({lat,lng})}
        mapConfig={{search:true}}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function PopupConfig() {
    let [value,setValue] = useState({lat:35.694739,lng:51.394097})
    function renderMap(){
        let p:AI = {type:'map',value,onChange:(value)=>setValue(value),popupConfig:{title:'انتخاب موقعیت'}}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            <span>{`latitude = ${value.lat}`}</span>
            <span>{`longitude = ${value.lng}`}</span>
            {renderMap()}
            {
                Code(`
<AIOInput 
    type='map' 
    value={{lat,lng}} 
    onChange={({lat,lng})=>this.setState({lat,lng})} 
    popupConfig={{title:'انتخاب موقعیت'}}
/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}



