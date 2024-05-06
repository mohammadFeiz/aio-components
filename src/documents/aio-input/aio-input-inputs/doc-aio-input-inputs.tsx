import React, { useRef, useState } from 'react';
import DOC from '../../../resuse-components/doc.tsx';
import AIODoc from '../../../npm/aio-documentation/aio-documentation.js';
import AIOInput, {  } from '../../../npm/aio-input/index.tsx';
import './index.css';
import {Icon} from '@mdi/react';
import { mdiHumanMale,mdiHumanFemale, mdiAbTesting, mdiFile, mdiAccount, mdiChevronDoubleDown, mdiCheck, mdiCheckboxBlank, mdiCheckboxBlankOutline, mdiCheckOutline, mdiCheckboxMarked, mdiClose, mdiAccessPointPlus, mdiAccountSupervisorOutline, mdiAccountBoxMultiple, mdiAccountChild, mdiAccountBadge, mdiAccountCancel, mdiAccountClock, mdiArrowRight, mdiArrowRightBold, mdiAccountArrowDown} from '@mdi/js';
import { AI,AI_table_column } from '../../../npm/aio-input/types.tsx';
import { transform } from 'typescript';
import RangeExamples from './range-examples.tsx';
import DateExamples from './date-examples.tsx';
const types = ['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','buttons','image','range']
export default function DOC_AIOInput_Table(props) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items:()=>[
                    { text: 'properties', id: 'properties', render: () => <Properties /> },
                    ...(types.map((type)=>{
                        return { text: `type:${type}`, id: `type${type}`, render: () => <Input key={type} type={type} /> }
                    }))
                ]
            }}
        />
    )
}
let propDic = {
    value:['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','buttons','image'],
    onChange:['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','buttons','image'],
    text:['select','multiselect','checkbox','date','time'],
    before:['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','buttons','image'],
    after:['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','buttons','image'],
    subtext:['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','buttons','image'],
    disabled:['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','buttons','image'],
    deSelect:['select','tabs','radio','date','buttons','image'],
    loading:['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','buttons','image'],
    attrs:['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','image'],
    style:['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','image'],
    className:['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','image'],
    inputAttrs:['text','number','textarea','password'],
    placeholder:['text','number','textarea','password','select','date','image'],
    justify:['text','number','textarea','password','select','multiselect','color','date','time'],
    maxLength:['text','textarea','password','multiselect','radio'],
    justNumber:['text','textarea','password'],
    filter:['text','textarea','password'],
    checkIcon:['select','multiselect','radio','checkbox'],
    popover:['text','number','textarea','select','multiselect','date','time'],
    caret:['text','textarea','number','select','date','time'],
    options:['text','number','textarea','select','multiselect','tabs','radio','color','buttons'],
    optionAttrs:['text','number','textarea','select','multiselect','tabs','radio','buttons'],
    optionStyle:['text','number','textarea','select','multiselect','tabs','radio','buttons'],
    optionBefore:['text','number','textarea','select','multiselect','tabs','radio','buttons'],
    optionAfter:['text','number','textarea','select','multiselect','tabs','radio','buttons'],
    optionSubtext:['text','number','textarea','select','multiselect','tabs','radio','buttons'],
    optionDisabled:['text','number','textarea','select','multiselect','tabs','radio','buttons'],
    optionChecked:['select'],
    optionOnClick:['text','number','textarea','select','multiselect','tabs','radio','buttons'],
    optionJustify:['text','number','textarea','select','multiselect','tabs','radio','buttons'],
    optionCheckIcon:['select','multiselect','radio'],
    optionClose:['text','number','textarea','select','multiselect'],
    swip:['number'],
    spin:['number'],
    multiple:['radio','buttons'],
    hideTags:['multiselect'],
    tagBefore:['multiselect'],
    tagAfter:['multiselect'],
    tagAttrs:['multiselect'],
    preview:['password','image'],
    theme:['date'],
    unit:['date','time'],
    jalali:['date','time'],
    size:['date'],
    dateDisabled:['date'],
    changeClose:['date'],
    dateAttrs:['date'],
    width:['image'],
    height:['image'],
    
}
const DOC_options = [
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
const DOC_options_code = 
`let options = [
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
function isValidProp(type,prop){
    let Prop = propDic[prop];
    if(!Prop){return false}
    return Prop.indexOf(type) !== -1;
}
function Properties(){
    let [columns] = useState([{title:'property',value:'row.prop',minWidth:96,cellAttrs:()=>{return {style:{padding:0}}}},...getColumns()])
    function getColumns(){
        return propDic.value.map((o)=>{
            let column:AI_table_column = {title:o,width:72,template:({row})=><div style={{color:!!row[o]?'green':'red'}}><Icon path={!!row[o]?mdiCheck:mdiClose} size={0.6}/></div>}
            return column
        })
    }
    let keys = Object.keys(propDic).sort((a,b)=>a < b?-1:0)
    let [rows] = useState(keys.map((prop)=>{
        let a = propDic[prop];
        let row = {prop};
        for(let i = 0; i < a.length; i++){
            row[a[i]] = true;
        }
        return row
    }))
    let p:AI = {type:'table',value:rows,columns,style:{height:'100%',fontSize:10},rowAttrs:()=>{return {style:{height:24}}}}
    return <AIOInput {...p}/>
}
function RenderInput(param:{value:any,description?:string,setValue:(v:any)=>void,title:string,type:any,optionProps?:any,optionCode?:string,props?:{[key in keyof AI]?:AI[key]},code?:string,initialValue?:any}){
    let {title,optionProps,optionCode,props = {},code,initialValue,type,value,setValue,description} = param;
    let [showCode,setShowCode] = useState<boolean>(false)
    
    let hasOption = !!optionProps || type === 'select' || type === 'multiselect' || type === 'tabs' || type === 'radio' || type === 'buttons';
        let p:AI = {
            type,value,onChange:(value)=>setValue(value),className:'my-input',...props,
        }
        let textKey;
        if(type === 'number'){textKey = 'id'}
        else if(type === 'color'){textKey = 'color'}
        else {textKey = 'name'}
        let valueKey;
        if(type === 'color'){valueKey = 'color'}
        else {valueKey = 'id'}
        if(hasOption){
            p.options = props.options || DOC_options;
            p.option = {
                text:`option.${textKey}`,
                value:`option.${valueKey}`,
                onClick:['text','number','textarea','password'].indexOf(type) === -1?undefined:(option)=>{
                    setValue(type === 'number'?option.id:option.name)
                },
                ...optionProps
            }
        }
        return (
            <>
                <h3>{title}</h3>
                {description?<p style={{fontSize:12}}>{description}</p>:''}
                <AIOInput {...p}/>
                {
                    !showCode?'':AIODoc().Code(
`let [value,setValue] = useState(${initialValue?JSON.stringify(initialValue):''});
${hasOption?DOC_options_code:''}
return (
    <AIOInput
        type='${type}'
        value={value}
        onChange={(newValue)=>setValue(newValue)}
        ${
            hasOption?
        `options={options}
        option={{
            text:'option.${textKey}',
            value:'option.${valueKey}',
            ${['text','number','textarea','password'].indexOf(type) === -1?'':`onClick:(option)=>{
                setValue(option.${type === 'number'?'id':'name'})
            },`}
            ${!optionCode?'':optionCode}
        }}`
            :''
        }
        ${!code?'':code}
    />
)
`
                    )
                }
                <button className='show-code' onClick={()=>setShowCode(!showCode)}>{showCode?'Hide Code':'Show Code'}</button>
                <button onClick={()=>console.log(p)}>Log</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
        )
}
function Input({type}){
    let [setting,setSetting] = useState({
        round:true,
        reverse:false,
        vertical:false
    })
    let [list,setList] = useState(getList(setting))    
    function changeSetting(setting){
        setSetting(setting);
        setList(getList(setting))
    }
    function getList(setting){
        let list:any[] = [
            {property:'value',title:'value , onChange'},
    //         {
    //             property:'value',title:'value',show:()=>type === 'image',
    //             initialValue:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg',
    //             code:`value='https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'`
    //         },
    //         ...RangeExamples(setting),
    //         {
    //             property:'width',title:'width',props:{width:120},
    //             code:`width={120}`
    //         },
    //         {
    //             property:'height',title:'height',props:{height:120},
    //             code:`height={200}`
    //         },
    //         {
    //             property:'height',title:'width,height',props:{width:120,height:120},
    //             code:
    //             `width={200}
    //             height={200}`
    //         },
    //         {
    //             property:'before',title:'before',props:{before:<Icon path={mdiAccount} size={1}/>},
    //             code:`before={<Icon path={mdiAccount} size={1}/>}`
    //         },
    //         {
    //             property:'after',title:'after',props:{after:<div className='badge'>12</div>},
    //             code:`after={<div className='badge'>12</div>}`
    //         },
    //         {
    //             property:'text',title:'text',
    //             props:{text:type === 'date' || type === 'time'?'{weekDay} {day} {monthString} {year}':'my text'},
    //             code:`text='${type === 'date' || type === 'time'?'{weekDay} {day} {monthString} {year}':'my text'}'`
    //         },
    //         {
    //             property:'subtext',title:'subtext',
    //             props:{subtext:'this is my subtext',text:type === 'checkbox'?'my text':undefined},
    //             code:`subtext='this is my subtext'`
    //         },
    //         {
    //             property:'inputAttrs',title:'inputAttrs',props:{inputAttrs:{style:{letterSpacing:16}}},
    //             code:`inputAttrs={{style:{letterSpacing:16}}}}'`
    //         },
    //         {
    //             property:'disabled',title:'disabled',props:{disabled:true},
    //             code:`disabled={true}'`
    //         },
    //         {
    //             property:'placeholder',title:'placeholder',props:{placeholder:'this is my placeholder'},
    //             code:`placeholder='this is my placeholder'`
    //         },
    //         {
    //             property:'justify',title:'justify',props:{justify:true},
    //             code:`justify={true}`
    //         },
    //         {
    //             property:'loading',title:'loading',props:{loading:true},
    //             code:`loading={true}`
    //         },
    //         {
    //             property:'justNumber',title:'justNumber:true',props:{justNumber:true},
    //             code:`justNumber={true}`
    //         },
    //         {
    //             property:'justNumber',title:'justNumber:[-]',props:{justNumber:['-']},
    //             code:`justNumber={['-']}`
    //         },
    //         {
    //             property:'maxLength',title:'maxLength',props:{maxLength:6,multiple:type === 'radio'},
    //             code:`${type === 'radio'?'multiple={true} ':''}maxLength={6}`
    //         },
    //         {
    //             property:'spin',title:'spin',props:{spin:false},
    //             description:'Hide spin button',
    //             code:`spin={false}`
    //         },
    //         {
    //             property:'swip',title:'swip',props:{swip:0.05},
    //             code:`swip={0.05}`
    //         },
    //         {
    //             property:'multiple',title:'multiple',props:{multiple:true},
    //             code:`multiple={true}`
    //         },
    //         {
    //             property:'deSelect',title:'deSelect (true)',props:{deSelect:true},
    //             code:`deSelect={true}`
    //         },
    //         {
    //             property:'deSelect',title:'deSelect (function)',
    //             props:(value,setValue)=>{
    //                 return {deSelect:()=>setValue(undefined)}
    //             },
    //             code:`deSelect={()=>setValue(undefined)}`
    //         },
    //         {
    //             property:'deSelect',show:()=>type !== 'date' && type !== 'image',title:'deSelect (object)',
    //             props:{deSelect:{name:'Not Selected',id:undefined}},
    //             code:`deSelect={name:'Not Selected',id:undefined}`
    //         },
    //         {   
    //             property:'hideTags',title:'hideTags',props:{hideTags:true},
    //             code:`hideTags={true}`
    //         },
    //         {
    //             property:'preview',title:'preview',props:{preview:true},
    //                 code:
    //     `preview={true}`
    //         },
    //         {
    //             property:'filter',title:'filter:["a","b","c"]',props:{filter:["a","b","c"]},
    //             code:`filter={["a","b","c"]}`
    //         },
    //         {
    //             property:'attrs',title:'attrs',props:{attrs:{style:{boxShadow:'0 0 12px 2px lightblue'}}},
    //             code:`attrs={{style:{boxShadow:'0 0 12px 2px lightblue'}}}`
    //         },
    //         {
    //             property:'style',title:'style',props:{style:{boxShadow:'0 0 12px 2px lightblue'}},
    //             code:`style={{boxShadow:'0 0 12px 2px lightblue'}}`
    //         },
    //         {
    //             property:'checkIcon',title:'checkIcon (object)',
    //             props:{checkIcon:{border:'1px solid orange',borderRadius:2,background:'orange',width:12,height:12,padding:0}},
    //             optionProps:(value,setValue)=>{
    //                 if(type === 'checkbox'){return}
    //                 return {
    //                     checked:type !== 'select'?undefined:(option)=>option.id === value,
    //                     close:()=>false,    
    //                 }
    //             },
    //             code:
    // `checkIcon={{
    //     border:'1px solid orange',
    //     borderRadius:2,
    //     background:'orange',
    //     width:12,
    //     height:12,
    //     padding:0
    // }}`,
    //                 optionCode:type === 'checkbox'?undefined:
    //                 `${type !== 'select'?'':'checked:(option)=>option.id === value,'}
    //                 close:()=>false,`
    //         },
    //         {
    //             property:'checkIcon',title:'option.checkIcon (array)',
    //             props:{
    //                 checkIcon:[
    //                     <Icon path={mdiCheckboxBlankOutline} size={0.8}/>,
    //                     <Icon path={mdiCheckboxMarked} size={0.8}/>,
    //                 ]
    //             },
    //             code:
    // `checkIcon={[
    //     <Icon path={mdiCheckboxBlankOutline} size={0.8}/>,
    //     <Icon path={mdiCheckboxMarked} size={0.8}/>,
    // ]}`,
    //             optionProps:(value,setValue)=>{
    //                 if(type === 'checkbox'){return}
    //                 return {
    //                     checked:type !== 'select'?undefined:(option)=>option.id === value,
    //                     close:()=>false,
    //                 }
    //             },
    //             optionCode:type === 'checkbox'?undefined:
    //         `${type !== 'select'?'':'checked:(option)=>option.id === value,'}
    //         close:()=>false,`
    //         },
    //         ...DateExamples(type),
    //         {
    //             property:'changeClose',title:'changeClose',props:{changeClose:true},
    //             code:`changeClose={true}`
    //         },
    //         {
    //             property:'options',title:'options',optionProps:{}
    //         },
    //         {
    //             property:'caret',title:'caret = false',props:{caret:false},optionProps:{},
    //             code:`caret:false`
    //         },
    //         {
    //             property:'caret',title:'caret = <html>',optionProps:{},
    //             props:{caret:<Icon path={mdiChevronDoubleDown} size={.7}/>},
    //             code:`caret:<Icon path={mdiChevronDoubleDown} size={.7}/>`,
    //         },
    //         {
    //             property:'optionAttrs',title:'option.attrs (function)',
    //             optionProps:{
    //                 attrs:(option)=>{
    //                     return {
    //                         style:{
    //                             background:'lightblue'
    //                         }
    //                     }
    //                 }
    //             },
    //             optionCode:
    //         `attrs:(option)=>{
    //             return {
    //                 style:{
    //                     background:'lightblue'
    //                 }
    //             }
    //         }`
    //         },
    //         {
    //             property:'optionAttrs',title:'option.attrs (string)',
    //             optionProps:{
    //                 attrs:"{style:{background:'lightblue'}}"
    //             },
    //             optionCode:
    //             `attrs:"{style:{background:'lightblue'}}"`
    //         },
    //         {
    //             property:'optionStyle',title:'option.style (function)',
    //             optionProps:{
    //                 style:(option)=>{
    //                     return {
    //                         background:'lightblue'
    //                     }
    //                 }
    //             },
    //             optionCode:
    //     `style:(option)=>{
    //             return {
    //                 background:'lightblue'
    //             }
    //         }`
    //         },
    //         {
    //             property:'optionStyle',title:'option.style (string)',
    //             optionProps:{
    //                 style:'{background:"lightblue"}'
    //             },
    //             optionCode:
    //         `style:'{background:"lightblue"}'`
    //         },
    //         {
    //             property:'optionChecked',title:'option.checked (function)',
    //             optionProps:(value,setValue)=>{
    //                 return {
    //                     checked:(option)=>option.id === value
    //                 }
    //             },
    //             optionCode:
    //         `checked:(option)=>option.id === value`
    //         },
    //         {
    //             property:'optionTagBefore',title:'option.tagBefore (function)',
    //             optionProps:{
    //                 tagBefore:(option)=><Icon path={mdiAccount} size={0.6}/>
    //             },
    //             optionCode:
    //         `tagBefore:(option)=><Icon path={mdiAccount} size={0.6}/>`
    //         },
    //         {
    //             property:'optionTagAttrs',title:'option.tagAttrs (function)',
    //             optionProps:{
    //                 tagAttrs:(option)=>{
    //                     return {
    //                         style:{background:option.gender === 'male'?'blue':'pink'}
    //                     }
    //                 }
    //             },
    //             optionCode:
    //     `tagAttrs:(option)=>{
    //         return {
    //             style:{background:option.gender === 'male'?'blue':'pink'}
    //         }
    //     }`
    //         },
    //         {
    //             property:'optionTagAfter',title:'option.tagAfter (function)',
    //             optionProps:{
    //                 tagAfter:(option)=><div style={{padding:'0 12px'}}>{option.gender}</div>
    //             },
    //             optionCode:
    //         `tagAfter:(option)=>option.gender`
    //         },
    //         {
    //             property:'optionOnClick',title:'option.onClick',
    //             optionProps:{
    //                 onClick:(option)=>{
    //                     alert('you clicked ' + option.name)
    //                 }
    //             },
    //             optionCode:
    //     `onClick:(option)=>{
    //         alert('you clicked ' + option.name)
    //     }`
    //         },
    //         {
    //             property:'optionJustify',title:'option.justify',
    //             optionProps:{
    //                 justify:true,
    //                 style:()=>{return {flex:1}}
    //             },
    //             props:{options:DOC_options.slice(0,3)},
    //             optionCode:
    //     `justify={true}
    //     style={()=>{return {flex:1}}}`
    //         },
    //         {
    //             property:'optionCheckIcon',title:'option.checkIcon (function returns object)',
    //             optionProps:(value,setValue)=>{
    //                 return {
    //                     checked:(option)=>option.id === value,
    //                     close:()=>false,
    //                     checkIcon:(option)=>{
    //                         return {border:'1px solid orange',borderRadius:2,background:'orange',width:12,height:12,padding:0}
    //                     }
    //                 }
    //             },
    //             optionCode:
    //     `checked:(option)=>option.id === value,
    //     close:()=>false,
    //     checkIcon:(option)=>{
    //         return {
    //             border:'1px solid orange',
    //             borderRadius:2,
    //             background:'orange',
    //             width:12,
    //             height:12,
    //             padding:0
    //         }
    //     }`
    //         },
    //         {
    //             property:'optionCheckIcon',title:'option.checkIcon (function returns array)',
    //             optionProps:(value,setValue)=>{
    //                 return {
    //                     checked:(option)=>option.id === value,
    //                     close:()=>false,
    //                     checkIcon:(option)=>{
    //                         return [
    //                             <Icon path={mdiCheckboxBlankOutline} size={0.8}/>,
    //                             <Icon path={mdiCheckboxMarked} size={0.8}/>,
    //                         ]
    //                     }
    //                 }
    //             },
    //             optionCode:
    //     `checked:(option)=>option.id === value,
    //     close:()=>false,
    //     checkIcon:(option)=>{
    //         return [
    //             <Icon path={mdiCheckboxBlankOutline} size={0.8}/>,
    //             <Icon path={mdiCheckboxMarked} size={0.8}/>,
    //         ]
    //     }`
    //         },
    //         {
    //             property:'optionCheckIcon',title:'option.checkIcon (string object)',
    //             optionProps:(value,setValue)=>{
    //                 return {
    //                     checked:(option)=>option.id === value,
    //                     close:()=>false,
    //                     checkIcon:'{border:"1px solid orange",borderRadius:2,background:"orange",width:12,height:12,padding:0}'
    //                 }
    //             },
    //             optionCode:
    //     `checked:(option)=>option.id === value,
    //     close:()=>false,
    //     checkIcon:'{border:"1px solid orange",borderRadius:2,background:"orange",width:12,height:12,padding:0}'`
    //         },
    //         {
    //             property:'optionSubtext',title:'option.subtext (function)',
    //             optionProps:{
    //                 subtext:(option)=>{
    //                     return option.gender
    //                 }
    //             },
    //             optionCode:
    //     `subtext:(option)=>{
    //             return option.gender
    //         }`
    //         },
    //         {
    //             property:'optionSubtext',title:'option.subtext (string)',
    //             optionProps:{
    //                 subtext:'option.gender'
    //             },
    //             optionCode:
    //         `subtext:'option.gender'`
    //         },
    //         {
    //             property:'optionBefore',title:'option.before (function)',
    //             optionProps:{
    //                 before:(option)=>{
    //                     return <Icon path={option.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>
    //                 }
    //             },
    //             optionCode:
    //     `before:(option)=>{
    //             let path = option.gender === 'male'?mdiHumanMale:mdiHumanFemale;
    //             return <Icon path={path} size={1}/>
    //         }`
    //         },
    //         {
    //             property:'optionBefore',title:'option.before (string)',
    //             optionProps:{
    //                 before:'option.gender'
    //             },
    //             optionCode:
    //         `before:'option.gender'`
    //         },
    //         {
    //             property:'optionAfter',title:'option.after (function)',
    //             optionProps:{
    //                 after:(option)=>{
    //                     return <div className='badge'>{option.gender}</div>
    //                 }
    //             },
    //             optionCode:
    //     `after:(option)=>{
    //             return <div className='badge'>{option.gender}</div>
    //         }`
    //         },
    //         {
    //             property:'optionAfter',title:'option.after (string)',
    //             optionProps:{
    //                 after:'option.gender'
    //             },
    //             optionCode:
    //         `after:'option.gender'`
    //         },
    //         {
    //             property:'optionDisabled',title:'option.disabled (function)',
    //             optionProps:{
    //                 disabled:(option)=>option.gender === 'female'
    //             },
    //             optionCode:
    //         `disabled:(option)=>option.gender === 'female'`
    //         },
    //         {
    //             property:'optionDisabled',title:'option.disabled (string)',
    //             optionProps:{
    //                 disabled:'option.gender === "female"'
    //             },
    //             optionCode:
    //         `disabled:'option.gender === "female"'`
    //         },
    //         {
    //             property:'optionClose',title:'option.close (function)',
    //             optionProps:{
    //                 close:(option)=>false
    //             },
    //             optionCode:
    //         `close:(option)=>false`
    //         },
    //         {
    //             property:'optionClose',title:'option.close (string)',
    //             optionProps:{
    //                 close:'false'
    //             },
    //             optionCode:
    //         `close:'false'`
    //         },
    //         {
    //             property:'popover',title:'popover',
    //             props:{
    //                 popover:{
    //                     position:'center',
    //                     attrs:{
    //                         style:{
    //                             minWidth:240
    //                         }
    //                     },
    //                     backdrop:{
    //                         attrs:{
    //                             style:{
    //                                 background:'rgba(0,0,0,0.8)'
    //                             }
    //                         }
    //                     },
    //                 }
    //             },
    //             optionProps:{},
    //             code:
    // `popover:{
    //     position:'center',
    //     attrs:{
    //         style:{
    //             minWidth:240
    //         }
    //     },
    //     backdrop:{
    //         attrs:{
    //             style:{
    //                 background:'rgba(0,0,0,0.8)'
    //             }
    //         }
    //     },
    // }`
    //         }   
        ]
        let res = list.map((o)=>typeof o === 'function'?o():o)
        return res.filter(({property,show = ()=>true},i)=>{
            if(!show() || (property && !isValidProp(type,property))){return false}
            return true
        })
    }
    let [model,setModel] = useState(getValue())
    function getValue(){
        let model = {};
        for(let i = 0; i < list.length; i++){
            let {initialValue} = list[i];
            model[`value${i}`] = initialValue;
        }
        return model;
    }
    function toolbar(){
        if(type !== 'range'){return null}
        return (
            <div style={{height:36,width:'100%',display:'flex',alignItems:'center',gap:12}}>
                <AIOInput
                    type='checkbox'
                    text='round'
                    value={!!setting.round}
                    onChange={()=>changeSetting({...setting,round:!setting.round})}
                />
                <AIOInput
                    type='checkbox'
                    text='reverse'
                    value={!!setting.reverse}
                    onChange={()=>changeSetting({...setting,reverse:!setting.reverse})}
                />
                <AIOInput
                    type='checkbox'
                    text='vertical'
                    value={!!setting.vertical}
                    onChange={()=>changeSetting({...setting,vertical:!setting.vertical})}
                />
            </div>
        )
    }
    return (
        <div className='example' key={JSON.stringify(setting)}>
           <div style={{position:'absolute',left:0,top:0,width:'100%',height:'100%',display:'flex',flexDirection:'column'}}>
           {toolbar()}
           <div style={{flex:1,overflowY:'auto',padding:12}}>
           {
            list.map((o,i)=>{
                if(o.render){return o.render()}
                let props = typeof o.props === 'function'?o.props(model[`value${i}`],(value)=>setModel({...model,[`value${i}`]:value})):o.props
                let optionProps = typeof o.optionProps === 'function'?o.optionProps(model[`value${i}`],(value)=>setModel({...model,[`value${i}`]:value})):o.optionProps
                let p = {
                    ...o,props,optionProps,initialValue:({...model})[`value${i}`],
                    value:model[`value${i}`],setValue:(value)=>setModel({...model,[`value${i}`]:value}),
                }
                return <RenderInput {...p} type={type} key={type + i}/>
            })
           }
           </div>
           </div>
        </div>
    )
}
