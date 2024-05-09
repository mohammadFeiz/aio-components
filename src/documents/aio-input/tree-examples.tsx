import React, { FC, useState } from "react"
import AIOInput from "../../npm/aio-input"
import AIODoc from './../../npm/aio-documentation/aio-documentation.js';
import RVD from './../../npm/react-virtual-dom/index.tsx';
import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiEye, mdiFolder, mdiMinusThick, mdiPlusThick } from "@mdi/js"
import { Storage } from "../../npm/aio-utils/index.tsx";
import Icon from '@mdi/react';
const TreeExamples:FC = ()=>{
    let [examples] = useState<any>([
        ['Basic',Basic],
        ['before',Before],
        ['subtext',Subtext],
        ['check',Check],
        ['onAdd,onRemove,onChange',AddRemove],
        ['size',Size],
        ['indent',Indent],
        ['actions',Actions],
        ['Complete features',Complete],
        ['input',Input]
    ])
    let [numbers] = useState<number[]>(new Array(examples.length + 1).fill(0).map((o,i)=>i - 1))
    let [setting,SetSetting] = useState<any>(new Storage(`treeexamplessetting`).load('setting',{
        show:-1
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
                    inputs={{
                        row:[
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
                            <COMP/>
                        </div>
                    )
                }
            })
        }
    }
    return (<RVD rootNode={{className:'h-100',column:[setting_node(),render_node()]}}/>)   
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
function ModelCode(){
    return (
        AIODoc().Code(

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
    let [value,setValue] = useState<any>(getValue)
    return (
        <div className='example'>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
            />
            {
                AIODoc().Code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id'
    }}
/>`
                )
            }
            {ModelCode()}
        </div>
    )
}
function Before(){
    let [value,setValue] = useState<any>(getValue)
    return (
        <div className='example'>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id',
                    before:(option:any,details:any)=>{
                        let color = ['#ffee17','#ddaa28','#bb88aa'][details.level]
                        return <Icon path={mdiFolder} size={0.6} color={color}/>
                    }
                }}
            />
            {
                AIODoc().Code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id',
        before:(option,details)=>{
            let color = ['#ffee17','#ddaa28','#bb88aa'][details.level]
            return <Icon path={mdiFolder} size={0.6} color={color}/>
        }
    }}
/>`
                )
            }
            {ModelCode()}
        </div>
    )
}
function Subtext(){
    let [value,setValue] = useState<any>(getValue)
    return (
        <div className='example'>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id',
                    subtext:(row:any)=>row.id,
                }}
            />
            {
                AIODoc().Code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id',
        subtext:(row)=>row.id,
    }}
/>`
                )
            }
            {ModelCode()}
        </div>
    )
}
function Check(){
    let [value,setValue] = useState<any>(getValue)
    return (
        <div className='example'>
            <h3>option.checked</h3>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id',
                    checked:(row:any)=>{
                        return !!row.active
                    }
                }}
            />
            {
                AIODoc().Code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id',
        checked:(row)=>{
            return !!row.active
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
                    checked:(row:any)=>{
                        return !!row.active
                    },
                    onClick:(row:any)=>{
                        row.active = !row.active;
                        //very important to use ... before value
                        setValue([...value])
                    }                 
                }}
            />
            {
                AIODoc().Code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id',
        checked:(row)=>{
            return !!row.active
        },
        onClick:(row)=>{
            row.active = !row.active;
            //very important to use ... before value
            setValue([...value])
        }                 
    }}
/>`
                )
            }
            <h3>option.checkIcon</h3>
            <AIOInput 
                type='tree'
                value={[...value]}
                option={{
                    text:'option.name',
                    value:'option.id',
                    checked:(row:any)=>{
                        return !!row.active
                    },
                    onClick:(row:any)=>{
                        row.active = !row.active;
                        //very important to use ... before value
                        setValue([...value])
                    },
                    checkIcon:()=>[<Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd'/>,<Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff'/>],
                    
                }}
            />
            {
                AIODoc().Code(

`<AIOInput 
    type='tree'
    value={[...value]}
    option={{
        text:'option.name',
        value:'option.id',
        checked:(row)=>{
            return !!row.active
        },
        onClick:(row)=>{
            row.active = !row.active;
            //very important to use ... before value
            setValue([...value])
        },
        checkIcon:()=>[<Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd'/>,<Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff'/>],
        
    }}
/>`
                )
            }
            {ModelCode()}
        </div>
    )
}
function AddRemove(){
    let [value,setValue] = useState<any>(getValue)
    return (
        <div className='example'>
            <h3>onAdd onRemove onChange</h3>
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
                AIODoc().Code(

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
            {ModelCode()}
        </div>
    )
}
function Size(){
    let [value,setValue] = useState<any>(getValue)
    return (
        <div className='example'>
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
                AIODoc().Code(

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
                AIODoc().Code(

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
            {ModelCode()}
        </div>
    )
}
function Indent(){
    let [value,setValue] = useState<any>(getValue)
    return (
        <div className='example'>
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
                AIODoc().Code(

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
            <h3>size:24</h3>
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
                AIODoc().Code(

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
            {ModelCode()}
        </div>
    )
}
function Actions(){
    let [value,setValue] = useState<any>(getValue)
    return (
        <div className='example'>
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
                AIODoc().Code(

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
            {ModelCode()}
        </div>
    )
}
function Complete(){
    let [value,setValue] = useState<any>(getValue)
    return (
        <div className='example'>
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
                    checked:(row:any)=>{
                        return !!row.active
                    },
                    subtext:(row:any)=>row.id,
                    before:()=><Icon path={mdiFolder} size={0.6} color='#ffef17'/>,
                    checkIcon:()=>[<Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd'/>,<Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff'/>],
                    onClick:(row:any)=>{
                        row.active = !row.active;
                        //very important to use ... before value
                        setValue([...value])
                    }
                }}
            />
            {
                AIODoc().Code(

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
        checked:(row)=>{
            return !!row.active
        },
        subtext:(row)=>row.id,
        before:()=><Icon path={mdiFolder} size={0.6} color='#ffef17'/>,
        after:(row)=>row.active?'active':'deactive',
        checkIcon:()=>[<Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd'/>,<Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff'/>],
        onClick:(row)=>{
            row.active = !row.active;
            //very important to use ... before value
            setValue([...value])
        }
    }}
/>`
                )
            }
            {ModelCode()}
        </div>
    )
}

function Input(){
    let [value,setValue] = useState<any>(getValue)
    console.log(value)
    return (
        <div className='example'>
            <AIOInput 
                type='tree'
                value={[...value]}
                onChange={(newValue)=>setValue(newValue)}
                option={{
                    text:(row:any,details:any)=>{
                        let {change} = details;
                        return (
                            <AIOInput
                                type='text'
                                before={<Icon path={mdiFolder} size={0.6}/>}
                                value={row.name}
                                onChange={(newName:string)=>{
                                    change({...row,name:newName})
                                }}
                            />
                        )
                    },
                    value:'option.id',
                }}
            />
            {
                AIODoc().Code(

`<AIOInput 
    type='tree'
    value={[...value]}
    onChange={(newValue)=>setValue(newValue)}
    option={{
        text:(row:any,details:any)=>{
            let {change} = details;
            return (
                <AIOInput
                    type='text'
                    before={<Icon path={mdiFolder} size={0.6}/>}
                    value={row.name}
                    onChange={(newName:string)=>{
                        change({...row,name:newName})
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
                    text:(row:any,details:any)=>{
                        let {change} = details;
                        return (
                            <AIOInput
                                type='checkbox'
                                before={<Icon path={mdiFolder} size={0.6}/>}
                                text={row.name}
                                value={!!row.active}
                                onChange={(newActive:boolean)=>change({...row,active:newActive})}
                            />
                        )
                    }
                }}
            />
            {
                AIODoc().Code(

`<AIOInput 
    type='tree'
    value={[...value]}
    onChange={(newValue)=>setValue(newValue)}
    option={{
        value:'option.id',
        text:(row:any,details:any)=>{
            let {change} = details;
            return (
                <AIOInput
                    type='checkbox'
                    before={<Icon path={mdiFolder} size={0.6}/>}
                    text={row.name}
                    value={!!row.active}
                    onChange={(newActive:boolean)=>change({...row,active:newActive})}
                />
            )
        }
    }}
/>`
                )
            }
            {ModelCode()}
        </div>
    )
}