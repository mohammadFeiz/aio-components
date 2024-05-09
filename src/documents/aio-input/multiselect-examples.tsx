import React, { FC, useState } from "react"
import { mdiAccount, mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiHumanFemale, mdiHumanMale, mdiMinusThick, mdiPlusThick } from "@mdi/js"
import {Icon} from "@mdi/react"
import AIOInput from "../../npm/aio-input";
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import { Storage } from "../../npm/aio-utils";
import RVD from '../../npm/react-virtual-dom/index';
const textOptions = [
    {name:'john',id:'1',gender:'male',color:'#ff0000'},
    {name:'stephan',id:'2',gender:'male',color:'#ffa500'},
    {name:'edvard',id:'3',gender:'male',color:'#ffff00'},
    {name:'luis',id:'4',gender:'male',color:'#9acd32'},
    {name:'carlos',id:'5',gender:'male',color:'#90ee90'},
    {name:'kate',id:'6',gender:'female',color:'#008000'},
    {name:'fernando',id:'7',gender:'male',color:'#add8e6'},
    {name:'mark',id:'8',gender:'male',color:'#1e90ff'},
    {name:'nicol',id:'9',gender:'female',color:'#0000ff'},
    {name:'lisa',id:'10',gender:'female',color:'#a52a2a'},
    {name:'lucas',id:'11',gender:'male',color:'#000000'},
    {name:'maria',id:'12',gender:'female',color:'#ffc0cb'}
]
const textOptionsCode = `[
    {name:'john',id:'1',gender:'male',color:'#ff0000'},
    {name:'stephan',id:'2',gender:'male',color:'#ffa500'},
    {name:'edvard',id:'3',gender:'male',color:'#ffff00'},
    {name:'luis',id:'4',gender:'male',color:'#9acd32'},
    {name:'carlos',id:'5',gender:'male',color:'#90ee90'},
    {name:'kate',id:'6',gender:'female',color:'#008000'},
    {name:'fernando',id:'7',gender:'male',color:'#add8e6'},
    {name:'mark',id:'8',gender:'male',color:'#1e90ff'},
    {name:'nicol',id:'9',gender:'female',color:'#0000ff'},
    {name:'lisa',id:'10',gender:'female',color:'#a52a2a'},
    {name:'lucas',id:'11',gender:'male',color:'#000000'},
    {name:'maria',id:'12',gender:'female',color:'#ffc0cb'}
]`
const optionCode = 
`option={{
    text:'option.name',
    value:'option.id'
}}`
const MultiselectExamples:FC = () => {
    let [examples] = useState<any>([
        ['before',()=><Before/>],
        ['after',()=><After/>],
        ['subtext',()=><Subtext/>],
        ['disabled',()=><Disabled/>],
        ['loading',()=><Loading/>],
        ['maxLength',()=><MaxLength/>],
        ['text',()=><Text/>],
        ['checkIcon (array)',()=><CheckIconArray/>],
        ['checkIcon (css object)',()=><CheckIconObject/>],
        ['hideTags',()=><HideTags/>],
        [
            'option.before',
            ()=>(
                <Options 
                    option={{
                        before:()=><Icon path={mdiAccount} size={0.8}/>
                    }}
                    optionCode={
`before:()=><Icon path={mdiAccount} size={0.8}/>`
                    }
                />
            )
        ],
        [
            'option.after',
            ()=>(
                <Options 
                    option={{
                        after:()=><div className='badge'>12</div>
                    }}
                    optionCode={
`after:()=><div className='badge'>12</div>`
                    }
                />
            )
        ],
        [
            'option.subtext',
            ()=>(
                <Options 
                    option={{
                        subtext:()=>'this is my subtext'
                    }}
                    optionCode={
`subtext:()=>'this is my subtext'`
                    }
                />
            )
        ],
        [
            'option.close',
            ()=>(
                <Options 
                    option={{
                        close:()=>true
                    }}
                    optionCode={
`close:()=>true`
                    }
                />
            )
        ],
        [
            'option.justify',
            ()=>(
                <Options 
                    option={{
                        justify:()=>true
                    }}
                    optionCode={
`justify:()=>true`
                    }
                />
            )
        ],
        [
            'option.attrs',
            ()=>(
                <Options 
                    option={{
                        attrs:()=>{
                            return {
                                style:{background:'lightblue'}
                            }
                        }
                    }}
                    optionCode={
`attrs:()=>{
    return {
        style:{background:'lightblue'}
    }
}`
                    }
                />
            )
        ],
        [
            'option.className',
            ()=>(
                <Options 
                    option={{
                        className:()=>'my-option'
                    }}
                    optionCode={
`className:()=>'my-option'`
                    }
                />
            )
        ],
        [
            'option.style',
            ()=>(
                <Options 
                    option={{
                        style:()=>{
                            return {
                                background:'lightblue'
                            }
                        }
                    }}
                    optionCode={
`style:()=>{
    return {
        background:'lightblue'
    }
}`
                    }
                />
            )
        ],
        [
            'option.show',
            ()=>(
                <Options 
                    option={{
                        show:(option:any)=>option.gender !== 'male'
                    }}
                    optionCode={
`show:(option:any)=>option.gender !== 'male'`
                    }
                />
            )
        ],
        [
            'option.disabled',
            ()=>(
                <Options 
                    option={{
                        disabled:(option:any)=>option.gender === 'male'
                    }}
                    optionCode={
        `disabled:(option:any)=>option.gender === 'male'`
                    }
                />
            )
        ],
        [
            'option.onClick',
            ()=>(
                <Options 
                    option={{
                        onClick:(option:any)=>alert(JSON.stringify(option))
                    }}
                    optionCode={
        `onClick:(option:any)=>alert(JSON.stringify(option))`
                    }
                />
            )
        ],
        [
            'option.tagAttrs',
            ()=>(
                <Options 
                    option={{
                        tagAttrs:(option:any)=>{
                            return {
                                style:{
                                    background:option.gender === 'male'?'dodgerblue':'pink'
                                }
                            }
                        }
                    }}
                    optionCode={
        `tagAttrs:(option:any)=>{
            return {
                style:{
                    background:option.gender === 'male'?'dodgerblue':'pink'
                }
            }
        }`
                    }
                />
            )
        ],
        [
            'option.tagBefore',
            ()=>(
                <Options 
                    option={{
                        tagBefore:(option:any)=>{
                            return <Icon path={option.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={0.8}/>
                        }
                    }}
                    optionCode={
        `tagBefore:(option:any)=>{
            return <Icon path={option.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={0.8}/>
        }`
                    }
                />
            )
        ],
        [
            'option.tagAfter',
            ()=>(
                <Options 
                    option={{
                        tagAfter:(option:any)=>{
                            return option.gender
                        }
                    }}
                    optionCode={
        `tagAfter:(option:any)=>{
            return option.gender
        }`
                    }
                />
            )
        ],
        [
            'popover',
            ()=>(
                <Options 
                    props={{
                        popover:{
                            position:'center',
                            attrs:{
                                style:{
                                    background:'#f2f2f2',
                                    minWidth:240
                                }
                            },
                            backdrop:{
                                attrs:{
                                    style:{
                                        background:'rgba(0,0,0,0.8)'
                                    }
                                }
                            }
                        }
                    }}
                    propsCode={
            `popover={{
                position:'center',
                attrs:{
                    style:{
                        background:'#f2f2f2',
                        minWidth:240
                    }
                },
                backdrop:{
                    attrs:{
                        style:{
                            background:'rgba(0,0,0,0.8)'
                        }
                    }
                }
            }}`
                    }
                />
            )
        ]        
    ])



    let [numbers] = useState<number[]>(new Array(examples.length + 1).fill(0).map((o,i)=>i - 1))
    let [setting,SetSetting] = useState<any>(new Storage(`multiselectexamplessetting`).load('setting',{
        show:-1
    }))
    function setSetting(setting:any){
        new Storage(`multiselectexamplessetting`).save('setting',setting)
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
                            {COMP()}
                        </div>
                    )
                }
            })
        }
    }
    return (<RVD rootNode={{className:'h-100',column:[setting_node(),render_node()]}}/>)   
}
export default MultiselectExamples
const Before:FC = ()=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                type='multiselect' 
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                before={<Icon path={mdiAccount} size={0.8}/>}
            />
        {AIODoc().Code(`
<AIOInput
    type='multiselect'
    options={${textOptionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    before={<Icon path={mdiAccount} size={0.8}/>}
/>
        `)}
        </div> 
    )
}
const After:FC = ()=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                type='multiselect' 
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                after={<div className='badge'>{12}</div>}
            />
        {AIODoc().Code(`
<AIOInput
    type='multiselect' 
    options={${textOptionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    after={<div className='badge'>{12}</div>}
/>
        `)}
        </div> 
    )
}
const Subtext:FC = ()=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type='multiselect' 
                value={value}
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                onChange={(newValue)=>setValue(newValue)}
                style={{height:60}}
                subtext='My subtext'
            />
        {AIODoc().Code(`
<AIOInput
    type='multiselect' 
    options={${textOptionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    style={{height:60}}
    subtext='My subtext'
/>
        `)}
        </div> 
    )
}
const Disabled:FC = ()=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type='multiselect' 
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                disabled={true} 
            />
        {AIODoc().Code(`
<AIOInput
    type='multiselect' 
    options={${textOptionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    disabled={true}
/>
        `)}
        </div> 
    )
}
const Loading:FC = ()=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type='multiselect' 
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                loading={true}  
            />
        {AIODoc().Code(`
<AIOInput
    type='multiselect' 
    options={${textOptionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    loading={true}
/>
        `)}
        </div> 
    )
}
const MaxLength:FC = ()=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type='multiselect' 
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                maxLength={6}
            />
        {AIODoc().Code(`
<AIOInput
    type='multiselect' 
    options={${textOptionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    maxLength={6}
/>
        `)}
        </div> 
    )
}
const Text:FC = ()=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type='multiselect' 
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                text='My Text'      
            />
        {AIODoc().Code(`
<AIOInput
    type='multiselect' 
    options={${textOptionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    text='My Text'      
/>
        `)}
        </div> 
    )
}
const CheckIconArray:FC = ()=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type='multiselect' 
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                checkIcon={[
                    <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd'/>,
                    <Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff'/>
                ]}
            />
        {AIODoc().Code(`
<AIOInput
    type='multiselect' 
    options={${textOptionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    checkIcon={[
        <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd'/>,
        <Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff'/>
    ]}
/>
        `)}
        </div> 
    )
}
const CheckIconObject:FC = ()=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type='multiselect' 
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                checkIcon={{background:'orange',borderRadius:4,border:'1px solid orange',width:16,height:16,padding:2}}
            />
        {AIODoc().Code(`
<AIOInput
    type='multiselect' 
    options={${textOptionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    checkIcon={{background:'orange',borderRadius:4,border:'1px solid orange',width:16,height:16,padding:2}}
/>
        `)}
        </div> 
    )
}
const HideTags:FC = ()=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type='multiselect' 
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                hideTags={true}
            />
        {AIODoc().Code(`
<AIOInput
    type='multiselect' 
    options={${textOptionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    hideTags={true}
/>
        `)}
        </div> 
    )
}
const Options:FC<{option?:any,optionCode?:string,props?:any,propsCode?:string}> = ({option = {},optionCode,props={},propsCode})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='multiselect' 
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                options={textOptions}   
                option={{
                    text:'option.name',
                    value:'option.id',
                    ...option
                }}
                {...props}

            />
        {AIODoc().Code(`
<AIOInput
    type='text' 
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    ${textOptionsCode}
    option={{
        text:'option.name',
        value:'option.id',
        onClick:(option:any)=>setValue(option.name),
        ${optionCode || ''}
    }}
    ${propsCode || ''}
/>
        `)}
        </div> 
    )
}
 
