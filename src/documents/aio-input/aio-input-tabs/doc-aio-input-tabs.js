import React, { Component, useState } from 'react';
import DOC from '../../../resuse-components/doc';
import AIODoc from '../../../npm/aio-documentation/aio-documentation';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom';
import AIOStorage from './../../../npm/aio-storage/aio-storage';
import AIOInput from '../../../npm/aio-input/aio-input';
import './doc-aio-input-tabs.css';
import {Icon} from '@mdi/react';
import { mdiAccount } from '@mdi/js';
export default class DOC_AIOInput_Tabs extends Component {
    render() {
        let items = [
            ['basic',Basic],
            ['before',Before],
            ['after',After],
            ['optionStyle',[['object',OptionStyleOBJ],['function',OptionStyleFN]]],
            ['optionJustify',OptionJustify],
            ['optionText(function)',OptionTextFN],
            ['optionValue(function)',OptionValueFN],
            ['optionBefore',[['function',OptionBeforeFN],['html',OptionBeforeHTML],['string',OptionBeforeSTR]]],
            ['optionAfter',[['function',OptionAfterFN],['html',OptionAfterHTML],['string',OptionAfterSTR]]],
            ['optionSubtext',[['function',OptionSubtextFN],['html',OptionSubtextHTML],['string',OptionSubtextSTR]]]
            

        ]

        return (
            <DOC
                {...this.props}
                navId='apiKeys'
                nav={{
                    nested:true,
                    items:items.map(([title,Comp])=>{
                        if(Array.isArray(Comp)){
                            return { text: title, id: title, items: Comp.map(([Title,COMP])=>{return { text: Title, id: title + Title, render: () => <COMP/> }}) }
                        }
                        else {
                            return { text: title, id: title, render: () => <Comp/> }
                        }
                        
                    })
                }}
            />
        )
    }
}
function Base({props = {}}){
    let [tab,setTab] = useState('1')
    return (
        <AIOInput
            type='tabs' value={tab} onChange={(tab)=>setTab(tab)}
            options={[
                {name:'Google',id:'1'},
                {name:'Microsoft',id:'2'},
                {name:'Oracle',id:'3'},
                {name:'Facebook',id:'4'},
            ]}
            optionText='option.name'
            optionValue='option.id'
            {...props}
        />
    )
}
function Code({text}){
    function getCode(){
        return AIODoc().Code(`
import React,{useState} from 'react';
import AIOInput from 'aio-input';
export default function App(){
    let [tab,setTab] = useState('1')
    return (
        <AIOInput
            type='tabs'
            value={tab}
            onChange={(tab)=>setTab(tab)}
            options={[
                {name:'Google',id:'1'},
                {name:'Microsoft',id:'2'},
                {name:'Oracle',id:'3'},
                {name:'Facebook',id:'4'},
            ]}
            optionText='option.name'
            optionValue='option.id'
            ////////////// this part changes /////////////////
            ${text?text:''}
            //////////////////////////////////////////////////
        />
    )
}
    `)
    }
    function code_layout(){
        return {html:getCode()}
    }
    return (
        <RVD
            layout={{
                column:[
                    code_layout(),
                ]
            }}
        />
    )
}
function Splitter(){
    return <div style={{marginTop:24}} className='aio-component-splitter'></div>
}
function Basic(){
    return (
        <div className='example'>
            <Base/>
            <Code text=''/>
        </div>
    )
}
function Before(){
    return (
        <div className='example'>
            <Base props={{
                before:<Icon path={mdiAccount} size={1}/>
            }}/>
            <Code 
                text={
`before={<Icon path={mdiAccount} size={1}/>}`
                }
            />
        </div>
    )
}
function After(){
    return (
        <div className='example'>
            <Base props={{
                after:<button>after</button>
            }}/>
            <Code 
                text={
`after={<button>after</button>}`
                }
            />
        </div>
    )
}
function OptionStyleOBJ(){
    return (
        <div className='example'>
            <Base props={{
                optionStyle:{flex:1},
            }}/>
            <Code 
                text={
`optionStyle={{flex:1}}`
                }
            />
        </div>
    )
}
function OptionStyleFN(){
    return (
        <div className='example'>
            <Base props={{
                optionStyle:(option)=>{
                    if(option.name === 'Microsoft'){return {fontWeight:'bold'}}
                },
            }}/>
            <Code 
                text={
`optionStyle={(option)=>{
                if(option.name === 'Microsoft'){return {fontWeight:'bold'}}
            }}`
                }
            />
        </div>
    )
}
function OptionJustify(){
    return (
        <div className='example'>
            <Base props={{
                optionStyle:{flex:1},
                optionJustify:true
            }}/>
            <Code 
                text={
`optionStyle={{flex:1}}
            optionJustify={true}`
                }
            />
        </div>
    )
}
function OptionTextFN(){
    return (
        <div className='example'>
            <Base props={{
                optionText:(option)=>option.name
            }}/>
            <Code 
                text={
`optionText={(option)=>option.name}`
                }
            />
        </div>
    )
}
function OptionValueFN(){
    return (
        <div className='example'>
            <Base props={{
                optionValue:(option)=>option.id
            }}/>
            <Code 
                text={
`optionValue={(option)=>option.id}`
                }
            />
        </div>
    )
}

function OptionBeforeFN(){
    return (
        <div className='example'>
            <Base props={{
                optionBefore:(option)=><div className='badge'>{option.id}</div>
            }}/>
            <Code 
                text={
`optionBefore={(option)=><div className='badge'>{option.id}</div>}`
                }
            />
        </div>
    )
}

function OptionBeforeHTML(){
    return (
        <div className='example'>
            <Base props={{
                optionBefore:<Icon path={mdiAccount} size={.8}/>
            }}/>
            <Code 
                text={
`optionBefore={<Icon path={mdiAccount} size={.8}/>}`
                }
            />
        </div>
    )
}
function OptionBeforeSTR(){
    return (
        <div className='example'>
            <Base props={{
                optionBefore:'option.id'
            }}/>
            <Code 
                text={
`optionBefore='option.id'`
                }
            />
        </div>
    )
}

function OptionAfterFN(){
    return (
        <div className='example'>
            <Base props={{
                optionAfter:(option)=><div className='badge'>{option.id}</div>
            }}/>
            <Code 
                text={
`optionAfter={(option)=><div className='badge'>{option.id}</div>}`
                }
            />
        </div>
    )
}

function OptionAfterHTML(){
    return (
        <div className='example'>
            <Base props={{
                optionAfter:<Icon path={mdiAccount} size={.8}/>
            }}/>
            <Code 
                text={
`optionAfter={<Icon path={mdiAccount} size={.8}/>}`
                }
            />
        </div>
    )
}
function OptionAfterSTR(){
    return (
        <div className='example'>
            <Base props={{
                optionAfter:'option.id'
            }}/>
            <Code 
                text={
`optionAfter='option.id'`
                }
            />
        </div>
    )
}
function OptionSubtextFN(){
    return (
        <div className='example'>
            <Base props={{
                optionSubtext:(option)=>option.name
            }}/>
            <Code 
                text={
`optionAfter={(option)=>option.name}`
                }
            />
        </div>
    )
}

function OptionSubtextHTML(){
    return (
        <div className='example'>
            <Base props={{
                optionSubtext:'subtext'
            }}/>
            <Code 
                text={
`optionAfter='subtext'`
                }
            />
        </div>
    )
}
function OptionSubtextSTR(){
    return (
        <div className='example'>
            <Base props={{
                optionSubtext:'"option " + option.id',
            }}/>
            <Code 
                text={
`optionAfter='"option " + option.id'`
                }
            />
        </div>
    )
}







