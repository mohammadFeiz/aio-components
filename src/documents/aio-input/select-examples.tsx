import React, { FC, useState } from "react"
import { mdiAccount, mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiHumanFemale, mdiHumanMale, mdiMinusThick, mdiPlusThick } from "@mdi/js"
import {Icon} from "@mdi/react"
import AIOInput from "../../npm/aio-input";
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import { Storage } from "../../npm/aio-utils";
import RVD from '../../npm/react-virtual-dom/index';
import { AI } from "../../npm/aio-input/types";
type I_exampleTypes = 'select' | 'radio' | 'tabs' | 'buttons'
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
const optionsCode = `[
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
const SelectExamples:FC<{type:I_exampleTypes}> = ({type}) => {
    let [examples] = useState<any>([
        ['before',()=><Before type={type}/>],
        ['after',()=><After type={type}/>],
        ['subtext',()=><Subtext type={type}/>],
        ['disabled',()=><Disabled type={type}/>],
        ['loading',()=><Loading type={type}/>],
        ['text',()=><Text type={type}/>,['select'].indexOf(type) !== -1],
        ['multiple',()=><Multiple type={type}/>,['radio','buttons','select'].indexOf(type) !== -1],
        ['multiple (number)',()=><MultipleNumber type={type}/>,['radio','buttons','select'].indexOf(type) !== -1],
        ['checkIcon (array)',()=><CheckIconArray type={type}/>,['radio','select'].indexOf(type) !== -1],
        ['checkIcon (css object)',()=><CheckIconObject type={type}/>,['radio','select'].indexOf(type) !== -1],
        [
            'option.before',
            ()=>(
                <Options 
                    type={type}
                    option={{
                        before:()=><Icon path={mdiAccount} size={0.8}/>
                    }}
                    optionCode={
`before:()=><Icon path={mdiAccount} size={0.8}/>`
                    }
                />
            ),
        ],
        [
            'option.after',
            ()=>(
                <Options 
                    type={type}
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
                    type={type}
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
                    type={type}
                    option={{
                        close:()=>true
                    }}
                    optionCode={
`close:()=>true`
                    }
                />
            ),
            ['select'].indexOf(type) !== -1
        ],
        [
            'option.justify',
            ()=>(
                <Options 
                    type={type}
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
                    type={type}
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
                    type={type}
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
                    type={type}
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
                    type={type}
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
                    type={type}
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
                    type={type}
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
            'popover',
            ()=>(
                <Options 
                    type={type}
                    props={{
                        type,
                        popover:{
                            fitHorizontal:true,
                            setAttrs:(key)=>{
                                if(key === 'backdrop'){
                                    return {
                                        style:{
                                            background:'rgba(0,0,0,0.8)'
                                        }
                                    }
                                }
                                if(key === 'modal'){
                                    return {
                                        style:{
                                            background:'#f2f2f2',
                                            minWidth:240
                                        }
                                    }
                                }
                            }
                        }
                    }}
                    propsCode={
            `popover:{
                fitHorizontal:true,
                setAttrs:(key)=>{
                    if(key === 'backdrop'){
                        return {
                            style:{
                                background:'rgba(0,0,0,0.8)'
                            }
                        }
                    }
                    if(key === 'modal'){
                        return {
                            style:{
                                background:'#f2f2f2',
                                minWidth:240
                            }
                        }
                    }
                }
            }`
                    }
                />
            ),
            ['select'].indexOf(type) !== -1
        ],
        [
            'option.tagAttrs',
            ()=>(
                <Options 
                    type={type}
                    props={{
                        type,
                        multiple:true
                    }}
                    propsCode={
            `multiple={true}`
                    }
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
                    type={type}
                    props={{
                        type,
                        multiple:true
                    }}
                    propsCode={
            `multiple={true}`
                    }
                    
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
                    type={type}
                    props={{
                        type,
                        multiple:true
                    }}
                    propsCode={
            `multiple={true}`
                    }
                    
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
        ['hideTags',()=><HideTags/>],
          
    ])
    


    let [numbers] = useState<number[]>(new Array(examples.length + 1).fill(0).map((o,i)=>i - 1))
    let [setting,SetSetting] = useState<any>(new Storage(`selectexamplessetting`).load('setting',{
        show:-1
    }))
    function setSetting(setting:any){
        new Storage(`selectexamplessetting`).save('setting',setting)
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
                                        setAttrs:(key)=>{
                                            if(key === 'modal'){
                                                return {
                                                    style:{maxHeight:'100vh'}
                                                }
                                            }
                                        }
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
export default SelectExamples
const Before:FC<{type:I_exampleTypes}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} 
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                before={<Icon path={mdiAccount} size={0.8}/>}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    before={<Icon path={mdiAccount} size={0.8}/>}
/>
        `)}
        </div> 
    )
}
const After:FC<{type:I_exampleTypes}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} 
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                after={<div className='badge'>{12}</div>}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    after={<div className='badge'>{12}</div>}
/>
        `)}
        </div> 
    )
}
const Subtext:FC<{type:I_exampleTypes}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} 
                value={value}
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                onChange={(newValue)=>setValue(newValue)}
                subtext='My subtext'
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    subtext='My subtext'
/>
        `)}
        </div> 
    )
}
const Disabled:FC<{type:I_exampleTypes}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} 
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
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    disabled={true}
/>
        `)}
        </div> 
    )
}
const Loading:FC<{type:I_exampleTypes}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} 
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
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    loading={true}
/>
        `)}
        </div> 
    )
}
const Text:FC<{type:I_exampleTypes}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} 
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
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    text='My Text'      
/>
        `)}
        </div> 
    )
}
const Multiple:FC<{type:I_exampleTypes}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} 
                multiple={true}
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    multiple={true}
/>
        `)}
        </div> 
    )
}
const MultipleNumber:FC<{type:I_exampleTypes}> = ({type})=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type={type} 
                options={textOptions}
                option={{
                    text:'option.name',
                    value:'option.id'
                }}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                multiple={6}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    multiple={true}
    maxLength={6}
/>
        `)}
        </div> 
    )
}

const CheckIconArray:FC<{type:I_exampleTypes}> = ({type})=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type={type}
                multiple={type === 'select'}
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
    type='${type}'
    options={${optionsCode}} 
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
const CheckIconObject:FC<{type:I_exampleTypes}> = ({type})=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type={type} 
                multiple={type === 'select'}
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
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    checkIcon={{background:'orange',borderRadius:4,border:'1px solid orange',width:16,height:16,padding:2}}
/>
        `)}
        </div> 
    )
}

const Options:FC<{type:I_exampleTypes,option?:any,optionCode?:string,props?:AI,propsCode?:string}> = ({type,option = {},optionCode,props={},propsCode})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                options={textOptions}   
                option={{
                    text:'option.name',
                    value:'option.id',
                    ...option
                }}
                {...props}
                type={type} 
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    ${optionsCode}
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
 
const HideTags:FC = ()=> {
    const [value,setValue] = useState<number[]>([])
    return (
        <div className='example'>
            <AIOInput
                type='select'
                multiple={true} 
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
    type='select'
    multiple={true} 
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    hideTags={true}
/>
        `)}
        </div> 
    )
}