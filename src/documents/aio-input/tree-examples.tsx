import React, { FC, useContext, useRef, useState } from "react"
import AIOInput, { AITree } from "../../npm/aio-input"
import {Code} from './../../npm/aio-components';
import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiChevronDown, mdiChevronLeft, mdiChevronRight, mdiCircleOutline, mdiDiamond, mdiEmoticonHappyOutline, mdiEye, mdiFolder, mdiGauge, mdiHeart, mdiMinusBoxMultiple, mdiMinusBoxOutline, mdiMinusThick, mdiPlusBoxOutline, mdiPlusThick } from "@mdi/js"
import Icon from '@mdi/react';
import Example, { ExampleContext, I_ExampleContext } from "./example.tsx";
const TreeExamples:FC = ()=>{
    let [examples] = useState<any>([
        ['Basic',()=><Basic/>],
        ['before',()=><Before/>],
        ['subtext',()=><Subtext/>],
        ['childs',()=><Childs/>],
        ['check',()=><Check/>],
        ['click and toggleIcon',()=><ClickAndToggleIcon/>],
        ['customize toggleIcon',()=><CustomizeToggleIcon/>],
        ['onAdd,onRemove,onChange',()=><AddRemove/>],
        ['size',()=><Size/>],
        ['indent',()=><Indent/>],
        ['actions',()=><Actions/>],
        ['Complete features',()=><Complete/>],
        ['input',()=><Input/>],
        ['Create Side menu',()=><SideMenu/>],
        
    ])
    return (<Example type='tree' examples={examples}/>) 
}
export default TreeExamples
function getValue(){
    return [
        {
            name:'row-0',id:'row-0',
            childs:[
                {name:'row0-0',id:'row0-0',active:true},
                {name:'row0-1',id:'row0-1'},
                {
                    name:'row0-2',id:'row0-2',
                    childs:[
                        {name:'row0-2-0',id:'row0-2-0'},
                        {name:'row0-2-1',id:'row0-2-1',active:true},
                        {name:'row0-2-2',id:'row0-2-2'}                
                    ]
                },
                {name:'row0-3',id:'row0-3'}        
            ]
        },
        {name:'row-1',id:'row-1'},
        {name:'row-2',id:'row-2',active:true},
        {name:'row-3',id:'row-3'}
    ]
}
function ModelCode(setting:any,code?:string){
    if(!setting.showCode){return null}
    if(code){return Code(code)} 
    return (
        Code(

`const [value,setValue] = useState([
    {
        name:'row-0',id:'row-0',
        childs:[
            {name:'row0-0',id:'row0-0',active:true},
            {name:'row0-1',id:'row0-1'},
            {
                name:'row0-2',id:'row0-2',
                childs:[
                    {name:'row0-2-0',id:'row0-2-0'},
                    {name:'row0-2-1',id:'row0-2-1',active:true},
                    {name:'row0-2-2',id:'row0-2-2'}                
                ]
            },
            {name:'row0-3',id:'row0-3'}        
        ]
    },
    {name:'row-1',id:'row-1'},
    {name:'row-2',id:'row-2',active:true},
    {name:'row-3',id:'row-3'}
])`
                    )
    ) 
        
}

function Basic(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    return (
        <div>
            <AIOInput 
                type='tree' rtl={true}
                value={[...value]}
                option={{text:'option.name',value:'option.id'}}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{text:'option.name',value:'option.id'}}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}
function Before(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    return (
        <div>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id',
                    before:(option,details)=>{
                        let color = ['#ffee17','#ddaa28','#bb88aa'][details.level || 0]
                        return <Icon path={mdiFolder} size={0.6} color={color}/>
                    }
                }}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id',
        before:(option,details)=>{
            let color = ['#ffee17','#ddaa28','#bb88aa'][details.level || 0]
            return <Icon path={mdiFolder} size={0.6} color={color}/>
        }
    }}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}
function Subtext(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    return (
        <div>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id',
                    subtext:(option)=>option.id,
                }}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id',
        subtext:(option)=>option.id,
    }}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}
function Childs(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>([
        {
            name:'row-0',id:'row-0',
            rows:[
                {name:'row0-0',id:'row0-0',active:true},
                {name:'row0-1',id:'row0-1'},
                {
                    name:'row0-2',id:'row0-2',
                    subrows:[
                        {name:'row0-2-0',id:'row0-2-0'},
                        {name:'row0-2-1',id:'row0-2-1',active:true},
                        {name:'row0-2-2',id:'row0-2-2'}                
                    ]
                },
                {name:'row0-3',id:'row0-3'}        
            ]
        },
        {name:'row-1',id:'row-1'},
        {name:'row-2',id:'row-2',active:true},
        {name:'row-3',id:'row-3'}
    ])
    return (
        <div>
            <AIOInput 
                type='tree'
                value={[...value]}
                getChilds={({row,details})=>details.level === 0?row.rows:row.subrows}
                option={{text:'option.name',value:'option.id'}}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    getChilds={({row,details})=>details.level === 0?row.rows:row.subrows}
    option={{text:'option.name',value:'option.id'}}
/>`
                )
            }
            {
                ModelCode(setting,`
let [value,setValue] = useState<any>([
    {
        name:'row-0',id:'row-0',
        rows:[
            {name:'row0-0',id:'row0-0',active:true},
            {name:'row0-1',id:'row0-1'},
            {
                name:'row0-2',id:'row0-2',
                subrows:[
                    {name:'row0-2-0',id:'row0-2-0'},
                    {name:'row0-2-1',id:'row0-2-1',active:true},
                    {name:'row0-2-2',id:'row0-2-2'}                
                ]
            },
            {name:'row0-3',id:'row0-3'}        
        ]
    },
    {name:'row-1',id:'row-1'},
    {name:'row-2',id:'row-2',active:true},
    {name:'row-3',id:'row-3'}
])
                    `)
            }
        </div>
    )
}
function Check(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    return (
        <div>
            <h3>option.checked</h3>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id',
                    checked:(option)=>{
                        return !!option.active
                    }
                }}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id',
        checked:(option)=>{
            return !!option.active
        }
    }}
/>`
                )
            }
            <h3>option.onClick</h3>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id',
                    checked:(option)=>{
                        return !!option.active
                    },
                    onClick:(option)=>{
                        option.active = !option.active;
                        //very important to use ... before value
                        setValue([...value])
                    }                 
                }}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id',
        checked:(option)=>{
            return !!option.active
        },
        onClick:(option)=>{
            option.active = !option.active;
            //very important to use ... before value
            setValue([...value])
        }                 
    }}
/>`
                )
            }
            <h3>checkIcon</h3>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id',
                    checked:(option)=>!!option.active,
                    onClick:(option)=>{
                        option.active = !option.active;
                        //very important to use ... before value
                        setValue([...value])
                    }
                }}
                checkIcon={({checked})=>{
                    return checked?<Icon path={mdiCheckboxMarked} size={0.7} color='#ddd'/>:
                    <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#5400ff'/>
                }}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id',
        checked:(option)=>!!option.active,
        onClick:(option)=>{
            option.active = !option.active;
            //very important to use ... before value
            setValue([...value])
        }
    }}
    checkIcon={({checked})=>{
        return checked?<Icon path={mdiCheckboxMarked} size={0.7} color='#ddd'/>:
        <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#5400ff'/>
    }}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}
function ClickAndToggleIcon(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    const [openDic,setOpenDic] = useState<{[id:string]:boolean}>({})
    const toggleRef = useRef<(id:any)=>void>(()=>{})
    return (
        <div>
            <AIOInput 
                type='tree'
                style={{width:240,background:'#eee'}}
                value={[...value]}
                toggleRef={toggleRef}
                onToggle={(openDic)=>setOpenDic(openDic)}
                toggleIcon={()=>false}
                option={{
                    text:'option.name',
                    value:'option.id',
                    onClick:(option)=>{
                        toggleRef.current(option.id)
                    },
                    after:(option)=>{
                        let {childs = [],id} = option;
                        if(!childs.length){return null}
                        let icon = openDic[id]?mdiChevronDown:mdiChevronLeft
                        return (
                            <Icon path={icon} size={0.8}/>
                        )
                    }
                }}
            />
            {
                code(

`<AIOInput 
    type='tree'
    style={{width:240,background:'#eee'}}
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id',
        toggleIcon:()=>false,
        onClick:(details)=>{if(details.toggle)details.toggle()},
        after:(option)=>{
            let {childs = [],id} = option;
            if(!childs.length){return null}
            let icon = openDic[id]?mdiChevronDown:mdiChevronLeft
            return (
                <Icon path={icon} size={0.8}/>
            )
        }
    }}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}
function CustomizeToggleIcon(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    return (
        <div>
            <AIOInput 
                type='tree'
                style={{width:240,background:'#F8F8F8'}}
                value={[...value]}
                toggleIcon={({open})=>{
                    if(open === undefined){return <Icon path={mdiCircleOutline} size={0.3}/>}
                    if(open === true){return <Icon path={mdiPlusBoxOutline} size={0.8}/>}
                    return <Icon path={mdiMinusBoxOutline} size={0.8}/>
                }}
                option={{
                    text:'option.name',
                    value:'option.id',
                    
                }}
            />
            {
                code(

`<AIOInput 
    type='tree'
    style={{width:240,background:'#eee'}}
    value={[...value]}
    toggleIcon={({open})=>{
        if(open === undefined){return <Icon path={mdiCircleOutline} size={0.3}/>}
        if(open === true){return <Icon path={mdiPlusBoxOutline} size={0.8}/>}
        return <Icon path={mdiMinusBoxOutline} size={0.8}/>
    }}
    option={{
        text:'option.name',
        value:'option.id',
        
    }}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}
function AddRemove(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    return (
        <div>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                onAdd={{name:'New Name',value:'a' + Math.round(Math.random())}}
                onRemove={true}
                onChange={(value)=>setValue(value)}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id'
    }}
    onAdd={{name:'New Name',value:'a' + Math.round(Math.random())}}
    onRemove={true}
    onChange={(value)=>setValue(value)}
/>`
                )
            }
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                onAdd={{name:'New Name',value:'a' + Math.round(Math.random())}}
                onRemove={true}
                onChange={(value)=>setValue(value)}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id'
    }}
    onAdd={{name:'New Name',value:'a' + Math.round(Math.random())}}
    onRemove={true}
    onChange={(value)=>setValue(value)}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}
function Size(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    return (
        <div>
            <h3>size:60</h3>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                size={60}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id'
    }}
    size={60}
/>`
                )
            }
            <h3>size:24</h3>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                size={24}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id'
    }}
    size={24}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}
function Indent(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    return (
        <div>
            <h3>indent:48</h3>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                indent={48}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id'
    }}
    indent={48}
/>`
                )
            }
            <h3>indent:24</h3>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                indent={24}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id'
    }}
    indent={24}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}
function SideMenu(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    const toggleRef = useRef<(id:any)=>void>(()=>{})
    let [value] = useState<any>([
        {name:'Dashboard',id:'dashboard'},
        {name:'Components',id:'components'},
        {
            name:'With Suffix',id:'ws',
            childs:[
                {name:'Submenu 1',id:'sm1'},
                {name:'Submenu 2',id:'sm2'},
                {name:'Submenu 3',id:'sm3'}        
            ]
        },
        {
            name:'With Prefix',id:'wp',
            childs:[
                {name:'Submenu 4',id:'sm4'},
                {name:'Submenu 5',id:'sm5'},
                {name:'Submenu 6',id:'sm6'}        
            ]
        }
    ])
    function getAfter(option:any,active:boolean){
        let {childs = []} = option;
        return (
            <div className='tree-after tree-align'>
                {option.id === 'dashboard' && <div className='tree-new'>New</div>}
                {option.id === 'ws' && <div className='tree-badge ws-badge tree-align'>3</div>}
                {!!childs.length && <Icon path={active?mdiChevronDown:mdiChevronRight} size={0.7}/>}
            </div>
        )
    }
    function getBefore(option:any,level:number){
        let icons:any = {
            'dashboard':mdiGauge,
            'components':mdiDiamond,
            'ws':mdiEmoticonHappyOutline,
            'wp':mdiHeart
        }
        return (
            <div className='tree-before'>
                {level === 0 && <div className='tree-icon tree-align'><Icon path={icons[option.id]} size={0.6}/></div>}
                {level === 1 && <Icon path={mdiCircleOutline} size={0.3}/>}
                {option.id === 'wp' && <div className='tree-badge wp-badge tree-align'>3</div>}
            </div>
        )
    }
    return (
        <div>
            <AITree
                className='tree-side'
                size={48}
                value={[...value]}
                toggleRef={toggleRef}
                toggleIcon={()=>false}
                option={{
                    text:'option.name',
                    value:'option.id',
                    after:(option,{active = false})=>getAfter(option,active),
                    before:(option,{level = 0})=>getBefore(option,level),
                    onClick:(option)=>toggleRef.current(option.id),
                    className:(option,{level = 0})=>`tree-row-${level}`
                }}
                indent={0}
            />
            <h3>JSX</h3>
            {
                code(

`function Sidemenu(){
    let [value] = useState([
        {name:'Dashboard',id:'dashboard'},
        {name:'Components',id:'components'},
        {
            name:'With Suffix',id:'ws',
            childs:[
                {name:'Submenu 1',id:'sm1'},
                {name:'Submenu 2',id:'sm2'},
                {name:'Submenu 3',id:'sm3'}        
            ]
        },
        {
            name:'With Prefix',id:'wp',
            childs:[
                {name:'Submenu 4',id:'sm4'},
                {name:'Submenu 5',id:'sm5'},
                {name:'Submenu 6',id:'sm6'}        
            ]
        }
    ])
    function getAfter(option:any,details:any){
        let {childs = []} = option;
        let open = details.isOpen(option.id);
        return (
            <div className='tree-after tree-align'>
                {
                    option.id === 'dashboard' && 
                    <div className='tree-new'>New</div>
                }
                {
                    option.id === 'ws' && 
                    <div className='tree-badge ws-badge tree-align'>3</div>
                }
                {
                    !!childs.length && 
                    <Icon path={open?mdiChevronDown:mdiChevronRight} size={0.7}/>
                }
            </div>
        )
    }
    function getBefore(option:any,details:any){
        let icons:any = {
            'dashboard':mdiGauge,
            'components':mdiDiamond,
            'ws':mdiEmoticonHappyOutline,
            'wp':mdiHeart
        }
        return (
            <div className='tree-before'>
                {
                    details.level === 0 && 
                    <div className='tree-icon tree-align'>
                        <Icon path={icons[option.id]} size={0.6}/>
                    </div>
                }
                {
                    details.level === 1 && 
                    <Icon path={mdiCircleOutline} size={0.3}/>
                }
                {
                    option.id === 'wp' && 
                    <div className='tree-badge wp-badge tree-align'>3</div>
                }
            </div>
        )
    }
    return (
        <AIOInput 
            type='tree'
            className='tree-side'
            size={48}
            value={[...value]}
            toggleIcon={()=>false}
            option={{
                text:'option.name',
                value:'option.id',
                after:(option,{active = false})=>getAfter(option,active),
                before:(option,{level = 0})=>getBefore(option,level),
                onClick:(option)=>toggleRef.current(option.id),
                className:(option,{level = 0})=>${'`tree-row-${level}`'}
            }}
            indent={0}
        />
    )
}`
                )
            }
            <h3>CSS</h3>
            {
                code(
`.tree-side{
    background:linear-gradient(180deg, #16191d, #2c3737);
    color:#ddd;
    width:240px
}
.tree-before{
    display:flex;
    align-items: center;
    gap:6px;
}
.tree-after{
    padding:0 12px;
    height:100%;
    color:#ddd;
    gap:6px;
}
.tree-align{
    display:flex;
    align-items:center;
    justify-content:center;
}
.tree-icon{
    background:rgba(255,255,255,.1);
    width:30px;
    height:30px;
    border-radius:100%;
}
.tree-badge{
    width:18px;
    height:18px;
    border-radius:100%;
    font-size:10px;
}
.wp-badge{
    color:#ddd;
    background:rgba(255,255,255,.35);
}
.ws-badge{
    color:#333;
    background:rgb(224, 187, 19);
}
.tree-new{
    background:Red;
    border-radius:12px;
    padding:3px 6px;
    margin:0 24px;
    font-size:10px;
}
.tree-side .aio-input-tree-body-level-1{
    padding:12px 0;
    background: rgba(255,255,255,0.05);
}
.tree-row-1{
    padding:0 24px;
    height:30px;
}`
                )
            }
            
        </div>
    )
}
function Actions(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    return (
        <div>
            <AIOInput 
                type={'tree'}
                value={[...value]}
                actions={[
                    {
                        text:'Preview',
                        value:'preview',
                        before:<Icon path={mdiEye} size={0.7}/>,
                        onClick:(row:any,parent:any)=>{
                            alert(row.name)
                        }
                    }
                ]}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
            />
            {
                code(

`<AIOInput 
    type={'tree'}
    value={[...value]}
    actions={[
        {
            text:'Preview',
            value:'preview',
            before:<Icon path={mdiEye} size={0.7}/>,
            onClick:(row:any,parent:any)=>{
                alert(row.name)
            }
        }
    ]}
    option={{
        text:'option.name',
        value:'option.id'
    }}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}
function Complete(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    return (
        <div>
            <AIOInput 
                type={'tree'}
                value={[...value]}
                onAdd={{name:'New Name',value:'a' + Math.round(Math.random())}}
                onRemove={true}
                onChange={(value)=>setValue(value)}
                size={48}
                actions={[
                    {
                        text:'Preview',
                        value:'preview',
                        before:<Icon path={mdiEye} size={0.7}/>,
                        onClick:(row:any,parent:any)=>{
                            alert(row.name)
                        }
                    }
                ]}
                option={{
                    text:'option.name',
                    value:'option.id',
                    checked:(option)=>!!option.active,
                    subtext:(option)=>option.id,
                    before:()=><Icon path={mdiFolder} size={0.6} color='#ffef17'/>,
                    onClick:(option)=>{
                        option.active = !option.active;
                        //very important to use ... before value
                        setValue([...value])
                    }
                }}
                checkIcon={({checked})=>{
                    return checked?<Icon path={mdiCheckboxMarked} size={0.7} color='#ddd'/>:
                    <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#5400ff'/>
                }}
                    
            />
            {
                code(

`<AIOInput 
    type={'tree'}
    value={[...value]}
    onAdd={{name:'New Name',value:'a' + Math.round(Math.random())}}
    onRemove={true}
    onChange={(value)=>setValue(value)}
    size={48}
    options={[
        {
            text:'Preview',
            value:'preview',
            before:<Icon path={mdiEye} size={0.7}/>,
            onClick:(row:any,parent:any)=>{
                alert(row.name)
            }
        }
    ]}
    option={{
        text:'option.name',
        value:'option.id',
        checked:(option)=>!!option.active,
        subtext:(option)=>option.id,
        before:()=><Icon path={mdiFolder} size={0.6} color='#ffef17'/>,
        onClick:(option)=>{
            option.active = !option.active;
            //very important to use ... before value
            setValue([...value])
        }
    }}
    checkIcon={({checked})=>{
        return checked?<Icon path={mdiCheckboxMarked} size={0.7} color='#ddd'/>:
        <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#5400ff'/>
    }}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}

function Input(){
    let {code,setting}:I_ExampleContext = useContext(ExampleContext);
    let [value,setValue] = useState<any>(getValue)
    console.log(value)
    return (
        <div>
            <AIOInput 
                type='tree'
                value={[...value]}
                onChange={(newValue)=>setValue(newValue)}
                option={{
                    text:(option,{change = ()=>{}})=>{
                        return (
                            <AIOInput
                                type='text'
                                before={<Icon path={mdiFolder} size={0.6}/>}
                                value={option.name}
                                onChange={(newName:string)=>{
                                    change({...option,name:newName})
                                }}
                            />
                        )
                    },
                    value:'option.id',
                }}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    onChange={(newValue)=>setValue(newValue)}
    option={{
        text:(option,{change = ()=>{}})=>{
            return (
                <AIOInput
                    type='text'
                    before={<Icon path={mdiFolder} size={0.6}/>}
                    value={option.name}
                    onChange={(newName:string)=>{
                        change({...option,name:newName})
                    }}
                />
            )
        },
        value:'option.id',
    }}
/>`
                )
            }
            <AIOInput 
                type='tree'
                value={[...value]}
                onChange={(newValue)=>setValue(newValue)}
                option={{
                    value:'option.id',
                    text:(option,{change = ()=>{}})=>{
                        return (
                            <AIOInput
                                type='checkbox'
                                before={<Icon path={mdiFolder} size={0.6}/>}
                                text={option.name}
                                value={!!option.active}
                                onChange={(newActive:boolean)=>change({...option,active:newActive})}
                            />
                        )
                    }
                }}
            />
            {
                code(

`<AIOInput 
    type='tree'
    value={[...value]}
    onChange={(newValue)=>setValue(newValue)}
    option={{
        value:'option.id',
        text:(option,{change = ()=>{}})=>{
            return (
                <AIOInput
                    type='checkbox'
                    before={<Icon path={mdiFolder} size={0.6}/>}
                    text={option.name}
                    value={!!option.active}
                    onChange={(newActive:boolean)=>change({...option,active:newActive})}
                />
            )
        }
    }}
/>`
                )
            }
            {ModelCode(setting)}
        </div>
    )
}