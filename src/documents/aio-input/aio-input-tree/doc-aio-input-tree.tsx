import React, { useState } from "react"
import DOC from "../../../resuse-components/doc"
import AIOInput from "../../../npm/aio-input"
import { AI } from "../../../npm/aio-input/types"
import { mdiAccount, mdiEye } from "@mdi/js"
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
            name:'row0',id:'row-0',
            childs:[
                {name:'row0-0',id:'row0-0',active:true},
                {name:'row0-1',id:'row0-1'},
                {name:'row0-2',id:'row0-2'},        
            ]
        },
        {name:'row1',id:'row1'},
        {name:'row2',id:'row2',active:true},
        {name:'row3',id:'row3'}
    ])
    let p:AI = {
        type:'tree',
        value:[...value],
        onAdd:{name:'New Name',value:'a' + Math.round(Math.random())},
        onRemove:true,
        onChange:(value)=>setValue(value),
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
            checked:(row)=>!!row.active,
            subtext:(row)=>row.id,
            before:()=><Icon path={mdiAccount} size={0.6}/>,
            after:(row)=>row.active?'active':'deactive'
        }
    }
    return (
        <div className='example'>
            <AIOInput {...p}/>
        </div>
    )
}