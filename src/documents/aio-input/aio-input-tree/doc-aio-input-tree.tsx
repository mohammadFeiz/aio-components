import React, { useState } from "react"
import DOC from "../../../resuse-components/doc"
import AIOInput from "../../../npm/aio-input"
import { AI } from "../../../npm/aio-input/types"
import { mdiAccount, mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiCheckboxMarkedOutline, mdiEye, mdiFolder } from "@mdi/js"
import Icon from '@mdi/react';
export default function DOC_Tree(props) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items:()=>[
                    { text: 'Basic', id: 'basic', render: () => <Basic /> }
                ]
            }}
        />
    )
}

function Basic(){
    let [value,setValue] = useState<any>([
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
    ])
    let p:AI = {
        type:'tree',
        value:[...value],
        onAdd:{name:'New Name',value:'a' + Math.round(Math.random())},
        onRemove:true,
        onChange:(value)=>setValue(value),
        size:48,
        options:[
            {
                text:'Preview',
                value:'preview',
                before:<Icon path={mdiEye} size={0.7}/>,
                onClick:(row,parent)=>{
                    alert(row.name)
                }
            }
        ],
        option:{
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
        }
    }
    return (
        <div className='example'>
            <AIOInput {...p}/>
        </div>
    )
}