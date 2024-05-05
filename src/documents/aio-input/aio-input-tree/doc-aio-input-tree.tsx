import React, { useState } from "react"
import DOC from "../../../resuse-components/doc"
import AIOInput from "../../../npm/aio-input"
import { AI } from "../../../npm/aio-input/types"
import AIODoc from './../../../npm/aio-documentation/aio-documentation.js';
import { mdiAccount, mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiCheckboxMarkedOutline, mdiEye, mdiFolder } from "@mdi/js"
import Icon from '@mdi/react';
export default function DOC_Tree(props:any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items:()=>[
                    { text: 'Basic', id: 'basic', render: () => <Basic /> },
                    { text: 'before', id: 'before', render: () => <Before /> },
                    { text: 'subtext', id: 'subtext', render: () => <Subtext /> },
                    { text: 'check', id: 'check', render: () => <Check /> },
                    { text: 'onAdd,onRemove,onChange', id: 'addremove', render: () => <AddRemove /> },
                    { text: 'size', id: 'size', render: () => <Size /> },
                    { text: 'indent', id: 'indent', render: () => <Indent /> },
                    { text: 'actions', id: 'actions', render: () => <Actions /> },
                    { text: 'Complete features', id: 'complete', render: () => <Complete /> },
                    { text: 'input', id: 'input', render: () => <Input /> },
                ]
            }}
        />
    )
}
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