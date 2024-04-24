import React, { useRef, useState } from 'react';
import DOC from '../../../resuse-components/doc.tsx';
import AIODoc from '../../../npm/aio-documentation/aio-documentation.js';
import AIOInput, {  } from '../../../npm/aio-input/index.tsx';
import './index.css';
import {Icon} from '@mdi/react';
import { mdiHumanMale,mdiHumanFemale, mdiAbTesting, mdiFile, mdiAccount, mdiChevronDoubleDown, mdiCheck, mdiCheckboxBlank, mdiCheckboxBlankOutline, mdiCheckOutline, mdiCheckboxMarked, mdiClose, mdiAccessPointPlus, mdiAccountSupervisorOutline, mdiAccountBoxMultiple, mdiAccountChild, mdiAccountBadge, mdiAccountCancel, mdiAccountClock, mdiArrowRight, mdiArrowRightBold, mdiAccountArrowDown} from '@mdi/js';
import { AI,AI_table_column } from '../../../npm/aio-input/types.tsx';
import { transform } from 'typescript';
const types = ['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','buttons','image','pinch','slider']
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
    className:['text','number','textarea','password','select','multiselect','tabs','radio','color','checkbox','date','time','image','pinch'],
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
    let [list] = useState(getList())    
    function getList(){
        let list:any[] = [
            {property:'value',title:'value , onChange'},
            {
                property:'value',title:'value',show:()=>type === 'image',
                initialValue:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg',
                code:`value='https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'`
            },
            ...PinchExamples(type),
            {
                property:'width',title:'width',props:{width:120},
                code:`width={120}`
            },
            {
                property:'height',title:'height',props:{height:120},
                code:`height={200}`
            },
            {
                property:'height',title:'width,height',props:{width:120,height:120},
                code:
                `width={200}
                height={200}`
            },
            {
                property:'before',title:'before',props:{before:<Icon path={mdiAccount} size={1}/>},
                code:`before={<Icon path={mdiAccount} size={1}/>}`
            },
            {
                property:'after',title:'after',props:{after:<div className='badge'>12</div>},
                code:`after={<div className='badge'>12</div>}`
            },
            {
                property:'text',title:'text',
                props:{text:type === 'date' || type === 'time'?'{weekDay} {day} {monthString} {year}':'my text'},
                code:`text='${type === 'date' || type === 'time'?'{weekDay} {day} {monthString} {year}':'my text'}'`
            },
            {
                property:'subtext',title:'subtext',
                props:{subtext:'this is my subtext',text:type === 'checkbox'?'my text':undefined},
                code:`subtext='this is my subtext'`
            },
            {
                property:'inputAttrs',title:'inputAttrs',props:{inputAttrs:{style:{letterSpacing:16}}},
                code:`inputAttrs={{style:{letterSpacing:16}}}}'`
            },
            {
                property:'disabled',title:'disabled',props:{disabled:true},
                code:`disabled={true}'`
            },
            {
                property:'placeholder',title:'placeholder',props:{placeholder:'this is my placeholder'},
                code:`placeholder='this is my placeholder'`
            },
            {
                property:'justify',title:'justify',props:{justify:true},
                code:`justify={true}`
            },
            {
                property:'loading',title:'loading',props:{loading:true},
                code:`loading={true}`
            },
            {
                property:'justNumber',title:'justNumber:true',props:{justNumber:true},
                code:`justNumber={true}`
            },
            {
                property:'justNumber',title:'justNumber:[-]',props:{justNumber:['-']},
                code:`justNumber={['-']}`
            },
            {
                property:'maxLength',title:'maxLength',props:{maxLength:6,multiple:type === 'radio'},
                code:`${type === 'radio'?'multiple={true} ':''}maxLength={6}`
            },
            {
                property:'spin',title:'spin',props:{spin:false},
                description:'Hide spin button',
                code:`spin={false}`
            },
            {
                property:'swip',title:'swip',props:{swip:0.05},
                code:`swip={0.05}`
            },
            {
                property:'multiple',title:'multiple',props:{multiple:true},
                code:`multiple={true}`
            },
            {
                property:'deSelect',title:'deSelect (true)',props:{deSelect:true},
                code:`deSelect={true}`
            },
            {
                property:'deSelect',title:'deSelect (function)',
                props:(value,setValue)=>{
                    return {deSelect:()=>setValue(undefined)}
                },
                code:`deSelect={()=>setValue(undefined)}`
            },
            {
                property:'deSelect',show:()=>type !== 'date' && type !== 'image',title:'deSelect (object)',
                props:{deSelect:{name:'Not Selected',id:undefined}},
                code:`deSelect={name:'Not Selected',id:undefined}`
            },
            {   
                property:'hideTags',title:'hideTags',props:{hideTags:true},
                code:`hideTags={true}`
            },
            {
                property:'preview',title:'preview',props:{preview:true},
                    code:
        `preview={true}`
            },
            {
                property:'filter',title:'filter:["a","b","c"]',props:{filter:["a","b","c"]},
                code:`filter={["a","b","c"]}`
            },
            {
                property:'attrs',title:'attrs',props:{attrs:{style:{boxShadow:'0 0 12px 2px lightblue'}}},
                code:`attrs={{style:{boxShadow:'0 0 12px 2px lightblue'}}}`
            },
            {
                property:'style',title:'style',props:{style:{boxShadow:'0 0 12px 2px lightblue'}},
                code:`style={{boxShadow:'0 0 12px 2px lightblue'}}`
            },
            {
                property:'checkIcon',title:'checkIcon (object)',
                props:{checkIcon:{border:'1px solid orange',borderRadius:2,background:'orange',width:12,height:12,padding:0}},
                optionProps:(value,setValue)=>{
                    if(type === 'checkbox'){return}
                    return {
                        checked:type !== 'select'?undefined:(option)=>option.id === value,
                        close:()=>false,    
                    }
                },
                code:
    `checkIcon={{
        border:'1px solid orange',
        borderRadius:2,
        background:'orange',
        width:12,
        height:12,
        padding:0
    }}`,
                    optionCode:type === 'checkbox'?undefined:
                    `${type !== 'select'?'':'checked:(option)=>option.id === value,'}
                    close:()=>false,`
            },
            {
                property:'checkIcon',title:'option.checkIcon (array)',
                props:{
                    checkIcon:[
                        <Icon path={mdiCheckboxBlankOutline} size={0.8}/>,
                        <Icon path={mdiCheckboxMarked} size={0.8}/>,
                    ]
                },
                code:
    `checkIcon={[
        <Icon path={mdiCheckboxBlankOutline} size={0.8}/>,
        <Icon path={mdiCheckboxMarked} size={0.8}/>,
    ]}`,
                optionProps:(value,setValue)=>{
                    if(type === 'checkbox'){return}
                    return {
                        checked:type !== 'select'?undefined:(option)=>option.id === value,
                        close:()=>false,
                    }
                },
                optionCode:type === 'checkbox'?undefined:
            `${type !== 'select'?'':'checked:(option)=>option.id === value,'}
            close:()=>false,`
            },
            {
                property:'theme',title:'theme',props:{theme:['lightblue','#666']},
                code:`theme={['lightblue','#666']}`
            },
            {
                property:'unit',show:()=>type === 'date',title:'unit ("month")',props:{unit:'month'},
                code:`unit='month'`
            },
            {
                property:'unit',show:()=>type === 'date',title:'unit ("hour")',props:{unit:'hour'},
                code:`unit='hour'`
            },
            {
                property:'unit',show:()=>type === 'time',title:'unit ({hour:true,minute:true,second:true})',
                props:{unit:{hour:true,minute:true,second:true}},
                code:`unit={hour:true,minute:true,second:true}`
            },
            {
                property:'unit',show:()=>type === 'time',title:'unit ({month:true,day:true})',props:{unit:{month:true,day:true}},
                code:`unit={month:true,day:true}`
            },
            {
                property:'unit',show:()=>type !== 'time',title:'unit ({hour:true,minute:true})',props:{unit:{hour:true,minute:true}},
                code:`unit={hour:true,minute:true}`
            },
            {
                property:'jalali',title:'jalali',props:{jalali:true},
                code:`jalali={true}`
            },
            {
                property:'size',title:'size',props:{size:120},
                code:`size={120}`
            },
            {
                property:'dateDisabled',render:()=><DateDisabled/>
            },
            {
                property:'dateAttrs',title:'dateAttrs (function) (isToday)',
                props:{
                    dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
                        if(isToday){
                            return {
                                style:{background:'orange'}
                            }
                        }
                    }
                },
                code:
    `dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
        if(isToday){
            return {
                style:{background:'orange'}
            }
        }
    }`
            },
            {
                property:'dateAttrs',title:'dateAttrs (function) (isActive)',
                props:{
                    dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
                        if(isActive){
                            return {
                                style:{background:'orange'}
                            }
                        }
                    }
                },
                code:
    `dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
        if(isToday){
            return {
                style:{background:'orange'}
            }
        }
    }`
            },
            {
                property:'dateAttrs',title:'dateAttrs (function) (isDisabled)',
                props:{
                    dateDisabled:['w,6'],
                    dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
                        if(isDisabled){
                            return {
                                style:{border:'1px solid orange'}
                            }
                        }
                    }
                },
                code:
    `dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
        if(isToday){
            return {
                style:{background:'orange'}
            }
        }
    }`
            },
            {
                property:'dateAttrs',title:'dateAttrs (function) (isMatch)',
                props:{
                    dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
                        if(isMatch(['w,6','w,4'])){
                            return {
                                style:{border:'1px solid orange'}
                            }
                        }
                    }
                },
                code:
    `dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
        if(isToday){
            return {
                style:{background:'orange'}
            }
        }
    }`
            },
            {
                property:'changeClose',title:'changeClose',props:{changeClose:true},
                code:`changeClose={true}`
            },
            {
                property:'options',title:'options',optionProps:{}
            },
            {
                property:'caret',title:'caret = false',props:{caret:false},optionProps:{},
                code:`caret:false`
            },
            {
                property:'caret',title:'caret = <html>',optionProps:{},
                props:{caret:<Icon path={mdiChevronDoubleDown} size={.7}/>},
                code:`caret:<Icon path={mdiChevronDoubleDown} size={.7}/>`,
            },
            {
                property:'optionAttrs',title:'option.attrs (function)',
                optionProps:{
                    attrs:(option)=>{
                        return {
                            style:{
                                background:'lightblue'
                            }
                        }
                    }
                },
                optionCode:
            `attrs:(option)=>{
                return {
                    style:{
                        background:'lightblue'
                    }
                }
            }`
            },
            {
                property:'optionAttrs',title:'option.attrs (string)',
                optionProps:{
                    attrs:"{style:{background:'lightblue'}}"
                },
                optionCode:
                `attrs:"{style:{background:'lightblue'}}"`
            },
            {
                property:'optionStyle',title:'option.style (function)',
                optionProps:{
                    style:(option)=>{
                        return {
                            background:'lightblue'
                        }
                    }
                },
                optionCode:
        `style:(option)=>{
                return {
                    background:'lightblue'
                }
            }`
            },
            {
                property:'optionStyle',title:'option.style (string)',
                optionProps:{
                    style:'{background:"lightblue"}'
                },
                optionCode:
            `style:'{background:"lightblue"}'`
            },
            {
                property:'optionChecked',title:'option.checked (function)',
                optionProps:(value,setValue)=>{
                    return {
                        checked:(option)=>option.id === value
                    }
                },
                optionCode:
            `checked:(option)=>option.id === value`
            },
            {
                property:'optionTagBefore',title:'option.tagBefore (function)',
                optionProps:{
                    tagBefore:(option)=><Icon path={mdiAccount} size={0.6}/>
                },
                optionCode:
            `tagBefore:(option)=><Icon path={mdiAccount} size={0.6}/>`
            },
            {
                property:'optionTagAttrs',title:'option.tagAttrs (function)',
                optionProps:{
                    tagAttrs:(option)=>{
                        return {
                            style:{background:option.gender === 'male'?'blue':'pink'}
                        }
                    }
                },
                optionCode:
        `tagAttrs:(option)=>{
            return {
                style:{background:option.gender === 'male'?'blue':'pink'}
            }
        }`
            },
            {
                property:'optionTagAfter',title:'option.tagAfter (function)',
                optionProps:{
                    tagAfter:(option)=><div style={{padding:'0 12px'}}>{option.gender}</div>
                },
                optionCode:
            `tagAfter:(option)=>option.gender`
            },
            {
                property:'optionOnClick',title:'option.onClick',
                optionProps:{
                    onClick:(option)=>{
                        alert('you clicked ' + option.name)
                    }
                },
                optionCode:
        `onClick:(option)=>{
            alert('you clicked ' + option.name)
        }`
            },
            {
                property:'optionJustify',title:'option.justify',
                optionProps:{
                    justify:true,
                    style:()=>{return {flex:1}}
                },
                props:{options:DOC_options.slice(0,3)},
                optionCode:
        `justify={true}
        style={()=>{return {flex:1}}}`
            },
            {
                property:'optionCheckIcon',title:'option.checkIcon (function returns object)',
                optionProps:(value,setValue)=>{
                    return {
                        checked:(option)=>option.id === value,
                        close:()=>false,
                        checkIcon:(option)=>{
                            return {border:'1px solid orange',borderRadius:2,background:'orange',width:12,height:12,padding:0}
                        }
                    }
                },
                optionCode:
        `checked:(option)=>option.id === value,
        close:()=>false,
        checkIcon:(option)=>{
            return {
                border:'1px solid orange',
                borderRadius:2,
                background:'orange',
                width:12,
                height:12,
                padding:0
            }
        }`
            },
            {
                property:'optionCheckIcon',title:'option.checkIcon (function returns array)',
                optionProps:(value,setValue)=>{
                    return {
                        checked:(option)=>option.id === value,
                        close:()=>false,
                        checkIcon:(option)=>{
                            return [
                                <Icon path={mdiCheckboxBlankOutline} size={0.8}/>,
                                <Icon path={mdiCheckboxMarked} size={0.8}/>,
                            ]
                        }
                    }
                },
                optionCode:
        `checked:(option)=>option.id === value,
        close:()=>false,
        checkIcon:(option)=>{
            return [
                <Icon path={mdiCheckboxBlankOutline} size={0.8}/>,
                <Icon path={mdiCheckboxMarked} size={0.8}/>,
            ]
        }`
            },
            {
                property:'optionCheckIcon',title:'option.checkIcon (string object)',
                optionProps:(value,setValue)=>{
                    return {
                        checked:(option)=>option.id === value,
                        close:()=>false,
                        checkIcon:'{border:"1px solid orange",borderRadius:2,background:"orange",width:12,height:12,padding:0}'
                    }
                },
                optionCode:
        `checked:(option)=>option.id === value,
        close:()=>false,
        checkIcon:'{border:"1px solid orange",borderRadius:2,background:"orange",width:12,height:12,padding:0}'`
            },
            {
                property:'optionSubtext',title:'option.subtext (function)',
                optionProps:{
                    subtext:(option)=>{
                        return option.gender
                    }
                },
                optionCode:
        `subtext:(option)=>{
                return option.gender
            }`
            },
            {
                property:'optionSubtext',title:'option.subtext (string)',
                optionProps:{
                    subtext:'option.gender'
                },
                optionCode:
            `subtext:'option.gender'`
            },
            {
                property:'optionBefore',title:'option.before (function)',
                optionProps:{
                    before:(option)=>{
                        return <Icon path={option.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>
                    }
                },
                optionCode:
        `before:(option)=>{
                let path = option.gender === 'male'?mdiHumanMale:mdiHumanFemale;
                return <Icon path={path} size={1}/>
            }`
            },
            {
                property:'optionBefore',title:'option.before (string)',
                optionProps:{
                    before:'option.gender'
                },
                optionCode:
            `before:'option.gender'`
            },
            {
                property:'optionAfter',title:'option.after (function)',
                optionProps:{
                    after:(option)=>{
                        return <div className='badge'>{option.gender}</div>
                    }
                },
                optionCode:
        `after:(option)=>{
                return <div className='badge'>{option.gender}</div>
            }`
            },
            {
                property:'optionAfter',title:'option.after (string)',
                optionProps:{
                    after:'option.gender'
                },
                optionCode:
            `after:'option.gender'`
            },
            {
                property:'optionDisabled',title:'option.disabled (function)',
                optionProps:{
                    disabled:(option)=>option.gender === 'female'
                },
                optionCode:
            `disabled:(option)=>option.gender === 'female'`
            },
            {
                property:'optionDisabled',title:'option.disabled (string)',
                optionProps:{
                    disabled:'option.gender === "female"'
                },
                optionCode:
            `disabled:'option.gender === "female"'`
            },
            {
                property:'optionClose',title:'option.close (function)',
                optionProps:{
                    close:(option)=>false
                },
                optionCode:
            `close:(option)=>false`
            },
            {
                property:'optionClose',title:'option.close (string)',
                optionProps:{
                    close:'false'
                },
                optionCode:
            `close:'false'`
            },
            {
                property:'popover',title:'popover',
                props:{
                    popover:{
                        position:'center',
                        attrs:{
                            style:{
                                minWidth:240
                            }
                        },
                        backdrop:{
                            attrs:{
                                style:{
                                    background:'rgba(0,0,0,0.8)'
                                }
                            }
                        },
                    }
                },
                optionProps:{},
                code:
    `popover:{
        position:'center',
        attrs:{
            style:{
                minWidth:240
            }
        },
        backdrop:{
            attrs:{
                style:{
                    background:'rgba(0,0,0,0.8)'
                }
            }
        },
    }`
            }   
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
    return (
        <div className='example'>
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
    )
}
function PinchExamples(type){
    if(type !== 'pinch' && type !== 'slider'){return []}
    return [
        {
            title:'start step end',
            props:{start:0,end:8,step:2},
            code:
        `start={0} 
        end={8} 
        step={2}`
        },
        {
            title:'label (step)',
            props:{
                start:0,end:8,
                label:{
                    step:1
                }
            },
            code:
        `start={0}
        end={8}
        label={{
            step:1
        }}`
        },
        {
            title:'label (attrs)',
            props:{
                start:0,end:8,
                label:{
                    step:1,
                    attrs:(value)=>{
                        return {
                            style:{fontSize:14,fontWeight:'bold',color:value === 5?'red':'#000'}
                        }
                    }
                }
            },
            code:`
        start={0}
        end={8}
        label={{
            step:1,
            attrs:(value)=>{
                return {
                    style:{fontSize:14,fontWeight:'bold',color:value === 5?'red':'#000'}
                }
            }
        }}
                `
        },
        {
            title:'label (html)',
            props:{
                start:0,end:8,
                label:{
                    step:1,
                    html:(value)=>{
                        return value === 5?<Icon path={mdiAccount} size={0.6}/>:value
                    }
                }
            },
            code:
    `start={0}
    end={8}
    label={{
        step:1,
        html:(value)=>{
            return value === 7?<Icon path={mdiAccount} size={0.5}/>:value
        }
    }}`
        },
        {
            title:'label (offset)',
            props:{
                start:0,end:8,
                label:{
                    step:1,
                    offset:-20
                }
            },
            code:
    `start={0}
    end={8}
    label={{
        step:1,
        offset:-20
    }}`
        },
        {
            title:'label (list)',
            props:{
                start:0,end:8,
                label:{
                    list:[1,2,5]
                }
            },
            code:
    `start={0}
    end={8}
    label={{
        list:[1,2,5]
    }}`
        },
        {
            title:'scale (step)',
            props:{step:5,start:0,end:100,scale:{step:5}},
            code:
        `start={0}
        end={100}
        step={5}
        scale={{
            step:5
        }}`
        },
        ()=>{
            let a = type === 'slider'?'height':'width'
            let b = type === 'slider'?'width':'height'
            return {
                title:'scale (attrs)',
                props:{
                    step:5,
                    start:0,
                    end:60,
                    scale:{
                        step:1,
                        attrs:(value)=>{
                            let a,b;
                            if(value % 10 === 0){b = 12; a = 3}
                            else if(value % 5 === 0){b = 8; a = 2}
                            else {b = 4; a = 1}
                            let background = value >= 40?'red':'#333'
                            return {
                                style:{width:(type === 'slider'?a:b),height:(type === 'slider'?b:a),background}
                            }
                        }
                    }
                },
                code:
        `start={0}
        end={60}
        step={5}
        scale={{
            step:1,
            attrs:(value)=>{
                let width,height;
                if(value % 10 === 0){${a} = 12; ${b} = 3}
                else if(value % 5 === 0){${a} = 8; ${b} = 2}
                else {${a} = 4; ${b} = 1}
                let background = value >= 40?'red':'#333'
                return {
                    style:{width,height,background}
                }
            }
        }}`
            }
        },
        ()=>{
            let a = type === 'slider'?'height':'width'
            let b = type === 'slider'?'width':'height'
            return {
                title:'scale (style function)',
                props:{
                    step:5,
                    start:0,
                    end:60,
                    scale:{
                        step:1,
                        style:(value)=>{
                            let a,b;
                            if(value % 10 === 0){a = 8; b = 3}
                            else if(value % 5 === 0){a = 5; b = 2}
                            else {a = 2; b = 1}
                            let background = value >= 40?'red':'#333'
                            return {width:(type === 'slider'?b:a),height:(type === 'slider'?a:b),background}
                        }
                    }
                },
                code:
        `step={5}
        start={0}
        end={60}
        scale={{
            step:1,
            style:(value)=>{
                let width,height;
                if(value % 10 === 0){${a} = 8; ${b} = 3}
                else if(value % 5 === 0){${a} = 5; ${b} = 2}
                else {${a} = 2; ${b} = 1}
                let background = value >= 40?'red':'#333'
                return {width,height,background}
            }
        }}`
            }
        },
        ()=>{
            let a = type === 'slider'?'height':'width'
            let b = type === 'slider'?'width':'height'
            return {
                title:'scale (style array)',
                props:{
                    step:5,
                    start:0,
                    end:60,
                    scale:{
                        step:1,
                        style:[
                            [{[a]:4,[b]:1,background:"#333"}],
                            [{[a]:8,[b]:2},'value % 5 === 0'],
                            [{[a]:12,[b]:3},'value % 10 === 0'],
                            [{background:"red"},'value >= 40']
                        ]
                    }
                },
                code:
        `step={5}
        start={0}
        end={60}
        scale={{
            step:1,
            style:[
                [{${a}:2,${b}:1,background:"#333"}],
                [{${a}:5,${b}:2},'value % 5 === 0'],
                [{${a}:8,${b}:3},'value % 10 === 0'],
                [{background:"red"},'value >= 40']
            ]
        }}`
            }
        },
        ()=>{
            return {
                title:'scale (className function)',
                props:{
                    step:5,
                    start:0,
                    end:60,
                    scale:{
                        step:1,
                        className:(value)=>{
                            let className = ''
                            if(value % 10 === 0){className = `${type}-scale-large`}
                            else if(value % 5 === 0){className = `${type}-scale-medium`}
                            else {className = `${type}-scale-small`}
                            className += value >= 40?` ${type}-scale-red`:''
                            return className
                        }
                    }
                },
                code:
        `step={5}
        start={0}
        end={60}
        scale={{
            step:1,
            className:(value)=>{
                let className = ''
                if(value % 10 === 0){className = 'scale-large'}
                else if(value % 5 === 0){className = 'scale-medium'}
                else {className = 'scale-small'}
                className += value >= 40?' scale-red':''
                return className
            }
        }}`
            }
        },
        ()=>{
            return {
                title:'scale (className array)',
                props:{
                    step:5,
                    start:0,
                    end:60,
                    scale:{
                        step:1,
                        className:[
                            [`${type}-scale-small`],
                            [`${type}-scale-medium`,'value % 5 === 0',true],
                            [`${type}-scale-large`,'value % 10 === 0',true],
                            [`${type}-scale-red`,'value >= 40']
                        ]
                    }
                },
                code:
        `step={5}
        start={0}
        end={60}
        scale={{
            step:1,
            className:[
                ['scale-small'],
                ['scale-medium','value % 5 === 0',true],
                ['scale-large','value % 10 === 0',true],
                ['scale-red','value >= 40']
            ]
        }}`
            }
        },
        {
            title:'scale (offset)',
            props:{step:5,start:0,end:100,scale:{step:5,offset:-10}},
            code:
        `start={0}
        end={100}
        step={5}
        scale={{
            step:5,
            offset:-10,
        }}`
        },
        {
            title:'scale (list)',
            props:{start:0,end:100,scale:{list:[20,40,60,80]}},
            code:
        `start={0}
        end={100}
        step={5}
        scale={{
            list:[20,40,60,80]
        }}`
        },
        {
            title:'scale(html)',
            props:{
                attrs:{style:{margin:36}},
                start:0,
                end:8,    
                scale:{
                    step:1,
                    style:(value,{angle})=>{
                        return {
                            width:24,height:24,background:'none',
                            transform:type === 'slider'?undefined:`rotate(${-angle}deg)`
                        }
                    },
                    html:(value)=>(
                        <Icon 
                            path={[
                                mdiAccount,
                                mdiAccountClock,
                                mdiAccountCancel,
                                mdiHumanMale,
                                mdiAccountBadge,
                                mdiAccountSupervisorOutline,
                                mdiAccountBoxMultiple,
                                mdiAccountChild,
                                mdiAccountArrowDown
                            ][value]} 
                            size={0.7}
                        />
                    ) 
                }
            },
            code:
        `start={0},
        end={8},    
        scale={{
            step:1,
            style:(value,{angle})=>{
                return {
                    width:24,height:24,background:'none',
                    ${type === 'pinch'?"transform:`rotate(${-angle}deg)`":''}
                }
            },
            html:(value)=>(
                <Icon 
                    path={[
                        mdiAccount,
                        mdiAccountClock,
                        mdiAccountCancel,
                        mdiHumanMale,
                        mdiAccountBadge,
                        mdiAccountSupervisorOutline,
                        mdiAccountBoxMultiple,
                        mdiAccountChild
                    ][value]} 
                    size={0.7}
                />
            ) 
        }}`
        },
        {
            title:'handle (attrs)',show:()=>type === 'pinch',
            props:{
                start:0,
                end:24,
                handle:(val,{disabled,angle,value})=>{
                    return {
                        attrs:{
                            style:{
                                background:'dodgerblue'
                            }
                        }
                    }
                }
            },
            code:
    `start={0}
    end={24}
    handle={{
        attrs:{
            style:{
                background:'dodgerblue'
            }
        }
    }}`
        },
        {
            title:'handle (false)',show:()=>type === 'pinch',
            props:{
                start:0,
                end:24,
                handle:false
            },
            code:
    `start={0}
    end={24}
    handle={false}`
        },
        {
            title:'point (attrs)',
            props:{
                start:0,
                end:24,
                point:(value,{angle})=>{
                    return {
                        attrs:{
                            style:{
                                transform:`rotate(${-angle}deg)`,
                                height:24,
                                width:24,
                                fontSize:10,
                                background:'dodgerblue',
                                color:'#fff'
                            }
                        }
                    }
                }
            },
            code:
    `attrs={{style:{border:'2px solid dodgerblue'}}}
    start={0}
    end={24}
    point={(value,{angle})=>{
        return {
            attrs:{
                style:{
                    transform:'rotate(' + (-angle) + 'deg)',
                    height:24,
                    width:24,
                    left:24,
                    fontSize:10,
                    background:'dodgerblue',
                    color:'#fff'
                }
            }
        }
    }}`
        },
        {
            title:'point (html)',
            props:{
                start:0,
                end:24,
                circles:['35 2 dodgerblue'],
                point:(value,{angle})=>{
                    return {
                        html:value,
                        attrs:{
                            style:{
                                transform:`rotate(${-angle}deg)`,
                                height:24,
                                width:24,
                                fontSize:10,
                                background:'dodgerblue',
                                color:'#fff'
                            }
                        }
                    }
                }
            },
            code:
    `attrs={{style:{border:'2px solid dodgerblue'}}}
    start={0}
    end={24}
    point={(value,{angle})=>{
        return {
            html:value,
            attrs:{
                style:{
                    transform:'rotate(' + (-angle) + 'deg)',
                    height:24,
                    width:24,
                    left:24,
                    fontSize:10,
                    background:'dodgerblue',
                    color:'#fff'
                }
            }
        }
    }}`
        },
        {
            title:'point (offset)',
            props:{
                start:0,
                end:24,
                circles:['35 2 dodgerblue'],
                point:(value,{angle})=>{
                    return {
                        html:value,
                        attrs:{
                            style:{
                                transform:`rotate(${-angle}deg)`,
                                height:24,
                                width:24,
                                fontSize:10,
                                background:'dodgerblue',
                                color:'#fff'
                            }
                        },
                        offset:-16
                    }
                }
            },
            code:
    `attrs={{style:{border:'2px solid dodgerblue'}}}
    start={0}
    end={24}
    point={(value,{angle})=>{
        return {
            html:value,
            attrs:{
                style:{
                    transform:'rotate(' + (-angle) + 'deg)',
                    height:24,
                    width:24,
                    left:24,
                    fontSize:10,
                    background:'dodgerblue',
                    color:'#fff'
                }
            },
            offset:-16
        }
    }}`
        },
        {
            title:'point (false)',
            props:{
                start:0,
                end:24,
                point:false
            },
            code:
    `start={0}
    end={24}
    point={false}`
        },
        {
            title:'disabled',show:()=>type === 'pinch',
            props:{
                attrs:{style:{margin:48}},
                start:0,
                end:12,
                rotate:90,
                disabled:[4,6,7,10,11],
                point:false,
                scale:{
                    step:1,
                    attrs:(val,{disabled})=>{
                        return {
                            style:{width:6,height:6,background:disabled?'red':'#000'}
                        }
                    }
                },
                label:{
                    step:1,
                    dynamic:true,
                    attrs:(val,{disabled,angle,value})=>{
                        let rotate = angle > 90 && angle < 270;
                        let active = val === value
                        let color;
                        if(disabled){color = 'red'}
                        else if(active){color = '#fff'}
                        else {color = '#00ff00'}
                        let style = {
                            width:40,
                            fontSize:10,
                            transform:`rotate(${rotate?180:0}deg)`,
                            fontWeight:active?'bold':undefined,
                            background:active?'dodgerblue':undefined,
                            color,
                            fontFamily:'arial',
                        }
                        return {
                            style
                        }
                    },
                    html:(value,{angle})=>{
                        return `${angle.toFixed(0)}`
                    }
                },
                handle:(val,{disabled,angle,value})=>{
                    return {
                        attrs:{
                            style:{
                                background:'#000'
                            }
                        }
                    }
                }
            },
            code:
            `attrs={{style:{border:'2px solid #000',margin:48}}}
            start={0}
            end={12}
            rotate={-90}
            disabled={[4,6,7,10,11]}
            point={false}
            scale={{
                step:1,
                attrs:(val,{disabled})=>{
                    return {
                        style:{left:48,width:6,height:6,background:disabled?'red':'#000'}
                    }
                }
            }}
            label={{
                step:1,
                dynamic:true,
                attrs:(val,{disabled,angle,value})=>{
                    let rotate = angle > 90 && angle < 270;
                    let active = val === value
                    let color;
                    if(disabled){color = 'red'}
                    else if(active){color = '#fff'}
                    else {color = '#00ff00'}
                    let style = {
                        width:40,
                        fontSize:10,
                        transform:'rotate(' + 180 +'deg)',
                        fontWeight:active?'bold':undefined,
                        background:active?'dodgerblue':undefined,
                        color,
                        fontFamily:'arial',
                    }
                    return {
                        style
                    }
                },
                html:(value)=>{
                    return value +':00'
                }
            }}
            handle={{
                attrs:{
                    style:{
                        background:'#000'
                    }
                }
            }}`
        },
        {
            title:'disabled',show:()=>type === 'slider',
            props:{
                attrs:{style:{margin:12}},
                start:0,
                end:12,
                disabled:[4,6,7,10,11],
                point:false,
                scale:{
                    step:1,
                    attrs:(val,{disabled})=>{
                        return {
                            style:{width:6,height:6,background:disabled?'red':'#000'}
                        }
                    }
                },
                label:{
                    step:1,
                    dynamic:true,
                    offset:16,
                    attrs:(val,{disabled,angle,value})=>{
                        let rotate = angle > 90 && angle < 270;
                        let active = val === value
                        let color;
                        if(disabled){color = 'red'}
                        else if(active){color = '#fff'}
                        else {color = '#00ff00'}
                        let style = {
                            width:40,
                            padding:active?'2px 6px':0,
                            fontSize:10,
                            transform:`rotate(${rotate?180:0}deg)`,
                            fontWeight:active?'bold':undefined,
                            background:active?'dodgerblue':undefined,
                            color,
                            fontFamily:'arial',
                        }
                        return {
                            style
                        }
                    },
                    html:(value)=>{
                        return `${value}:00`
                    }
                }
            },
            code:
        `attrs={{style:{margin:12}}}
        start={0}
        end={12}
        disabled={[4,6,7,10,11]}
        point={false}
        scale={{
            step:1,
            attrs:(val,{disabled})=>{
                return {
                    style:{left:48,width:6,height:6,background:disabled?'red':'#000'}
                }
            }
        }}
        label={{
            step:1,
            dynamic:true,
            offset:16,
            attrs:(val,{disabled,angle,value})=>{
                let rotate = angle > 90 && angle < 270;
                let active = val === value
                let color;
                if(disabled){color = 'red'}
                else if(active){color = '#fff'}
                else {color = '#00ff00'}
                let style = {
                    width:40,
                    padding:active?'2px 6px':0,
                    fontSize:10,
                    transform:'rotate(' + (rotate?180:0) 'deg)',
                    fontWeight:active?'bold':undefined,
                    background:active?'dodgerblue':undefined,
                    color,
                    fontFamily:'arial',
                }
                return {
                    style
                }
            },
            html:(value)=>{
                return value +':00'
            }
        }}`
        },
        {
            title:'circles',show:()=>type === 'pinch',
            props:{
                start:0,
                end:100,
                circles:[
                    '12 24 #aaa',
                    '26 2 #999',
                    
                ]
            },
            code:
    `start={0}
    end={100}
    circles={[
        '30 2 #333',
        '20 2 #777'
    ]}`
        },
        {
            title:'rotate (-180 deg)',show:()=>type === 'pinch',
            props:{
                start:0,
                end:100,
                rotate:-180,
                label:{step:10,offset:0}
            },
            code:
    `start={0}
    end={100}
    label={{step:10,offset:0}}
    rotate={-180}`
        },
        {
            title:'round (0 to 1)',show:()=>type === 'pinch',
            props:{
                start:0,
                end:100,
                round:0.5,
                label:{step:10,offset:0}
            },
            code:
    `start={0}
    end={100}
    rotate:180,
    round={0.5}
    label:{step:10,offset:0}`
        },
        {
            title:'round (0 to 1)',show:()=>type === 'pinch',
            props:{
                start:0,
                end:100,
                round:0.25,
                label:{step:20,offset:0}
            },
            code:
    `start={0}
    end={100}
    round={0.5}
    label:{step:10,offset:0}`
        },
        {
            title:'ranges (array on strings)',
            props:{
                start:0,
                end:100,
                ranges:[
                    '40 6 red',
                    '60 6 orange',
                    '80 6 yellow',
                    '100 6 green'    
                ]
            },
            code:
    `start={0}
    end={100}
    ranges={[
        '40 6 red',
        '60 6 orange',
        '80 6 yellow',
        '100 6 green' 
    ]}`
        },
        {
            title:'ranges (function returns array of strings)',
            props:{
                start:0,
                end:100,
                circles:[],
                handle:false,
                point:(value,{angle})=>{
                    return {
                        attrs:{
                            style:{
                                width:24,height:24,background:'dodgerblue',color:'#fff',transform:`rotate(${-angle}deg)`,fontSize:10
                            }
                        },
                        offset:type === 'pinch'?-15:0,
                        html:value
                    }
                },
                ranges:(value)=>{
                    return [
                        `${value} 4 dodgerblue`,
                        `100 5 #f8f8f8`
                    ]
                }
            },
            code:
    `start={0}
    end={100}
    circles={[]}
    handle={false}
    point={(value,{angle})=>{
        return {
            attrs:{
                style:{
                    width:24,height:24,background:'dodgerblue',color:'#fff',transform:'rotate(' + -angle + 'deg)',fontSize:10
                }
            },
            html:value,    
            ${type === 'pinch'?'offset:-15,':''}
        }
    }}
    ranges={(value)=>{
        return [
            value + '4 dodgerblue',
            '100 5 #f8f8f8'
        ]
    }}`
        },
    ]
}
function DateDisabled(){
    let [value,setValue] = useState()
    let ref = useRef(value);
    ref.current = value;
    let p:AI = {
        type:'table',
        columns:[
            {
                title:'Operator',value:'row.op',width:240,
                cellAttrs:({column})=>{
                    return {style:{padding:0,letterSpacing:column.title === 'Operator'?1:undefined}} 
                }
            },
            {title:'Description',value:'row.des'},
            {
                width:120,template:({row})=>{
                    return <AIOInput type='date' value={ref.current} onChange={(value)=>setValue(value)} disabled={JSON.parse(row.op)}/>
                }
            }
            
        ],
        value:[
            {op:'["<>,2022,2024"]',des:'disabled all dates between 2022 and 2024'},
            {op:'["<=>,2022,2024"]',des:'disabled all dates between and equal 2022 and 2024'},
            {op:'["!<>,2022,2024"]',des:'disabled all dates that is not between 2022 and 2024'},
            {op:'["!<=>,2022,2024"]',des:'disabled all dates that is not between and equal 2022 and 2024'},
            {op:'["=,2022/4/5,2022/6/7,2022/8/12"]',des:'disabled this dates => 2022/4/5,2022/6/7,2022/8/12'},
            {op:'["!=,2022/4/5"]',des:'disabled all dates exept 2022/4/5'},
            {op:'[">,2022/4/5"]',des:'disabled all dates after 2022/4/5'},
            {op:'[">=,2022/4/5"]',des:'disabled 2022/4/5 and all dates after 2022/4/5'},
            {op:'["<,2022/4/5"]',des:'disabled all dates before 2022/4/5'},
            {op:'["<=,2022/4/5"]',des:'disabled 2022/4/5 and all dates before 2022/4/5'},
            {op:'["w,6,4"]',des:'disabled all 4th and 6th weekdays (index from 0)'},
            {op:'["!w,6"]',des:'disabled all days that is not 6th weekdays (index from 0)'},
        ]
    }
    return (
        <>
            <h3>dateDisabled</h3>
            <AIOInput {...p}/>
        </>
    )
}