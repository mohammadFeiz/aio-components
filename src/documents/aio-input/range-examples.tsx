import React, { FC, useState } from "react"
import { mdiAccount, mdiAccountArrowDown, mdiAccountBadge, mdiAccountBoxMultiple, mdiAccountCancel, mdiAccountChild, mdiAccountClock, mdiAccountSupervisorOutline, mdiHumanMale, mdiMinusThick, mdiPlusThick, mdiStar } from "@mdi/js"
import {Icon} from "@mdi/react"
import AIOInput from "../../npm/aio-input";
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import { Storage } from "../../npm/aio-utils";
import RVD from './../../npm/react-virtual-dom/index';
import { AI_type } from "../../npm/aio-input/types";

const RangeExamples:FC<{type:AI_type}> = ({type}) => {
    let [examples] = useState<any>([
        ['start step end',StartStepEnd],
        ['label (step)',LabelStep],
        ['label (attrs)',LabelAttrs],
        ['label (html)',LabelHtml],
        ['label (offset)',LabelOffset],
        ['label (list)',LabelList],
        ['scale (step)',ScaleStep],
        ['scale (attrs)',ScaleAttrs],
        ['scale (style object)',ScaleStyleObject],
        ['scale (className)',ScaleClassName],
        ['scale (offset)',ScaleOffset],
        ['scale (list)',ScaleList],
        ['scale (html)',ScaleHtml],
        ['handle (width,height,color,offset)',Handle],
        ['handle (false)',HandleFalse],
        ['point (attrs)',PointAttrs],
        ['point (html)',PointHtml],
        ['point (offset)',PointOffset],
        ['point (false)',PointFalse],
        ['disabled',Disabled],
        ['circles',Circles],
        ['rotate (-180 deg)',Rotate_180],
        ['rotate (-90 deg)',Rotate_90],
        ['ranges (array)',RangesArray],
        ['ranges (function)',RangesFunction],
        ['multiple',Multiple]
    ])
    let [numbers] = useState<number[]>(new Array(examples.length + 1).fill(0).map((o,i)=>i - 1))
    let [setting,SetSetting] = useState<any>(new Storage(`${type}examplessetting`).load('setting',{
        round:type === 'spinner'?1:0,
        reverse:false,
        vertical:false,
        show:-1
    }))
    function setSetting(setting:any){
        new Storage(`${type}examplessetting`).save('setting',setting)
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
                            {html:'round',className:'align-v w-48 flex-0'},
                            {show:type === 'spinner',input:{type:'radio',options:[0.25,0.75,1],option:{text:'option',value:'option'}},field:'value.round'},
                            {input:{type:'checkbox',text:'reverse',min:0,max:1},field:'value.reverse'},
                            {show:type === 'range',input:{type:'checkbox',text:'vertical',min:0,max:1},field:'value.vertical'},
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
                let [title,COMP] = o;
                if(setting.show !== -1 && setting.show !== i){return {}}
                return {
                    html:(
                        <div className='w-100'>
                            <h3>{`${i} - ${title}`}</h3>
                            <COMP setting={setting} type={type}/>
                        </div>
                    )
                }
            })
        }
    }
    return (<RVD rootNode={{className:'h-100',column:[setting_node(),render_node()]}}/>)   
}
export default RangeExamples


function sc(setting:{round?:number,reverse:boolean,vertical:boolean}){
    let {round,reverse,vertical} = setting
    return (
`${round?`round={${round}}`:''}
${`    reverse={${reverse?'true':'false'}}`}
${`    vartical={${vertical?'true':'false'}}`}`
    )
}
type I_RS = {setting:{round?:number,reverse:boolean,vertical:boolean},type:'slider' | 'spinner'}
const StartStepEnd:FC<I_RS> = ({setting,type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const LabelStep:FC<I_RS> = ({setting,type}) => {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={8} step={1}
                onChange={(newValue)=>setValue(newValue)}
                labels={{step:2}}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} 
    start={0} 
    end={100} 
    step={1}
    onChange={(newValue)=>setValue(newValue)}
    labels={{step:2}}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const LabelAttrs:FC<I_RS> = ({setting,type}) => {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                labels={{step:10}}
                label={(value)=>{
                    return {
                        attrs:{
                            style:{fontSize:14,fontWeight:'bold',color:value === 5?'red':'#000'}
                        }
                    }
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} 
    start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    labels={{step:10}}
    label={(value)=>{
        return {
            attrs:{
                style:{fontSize:14,fontWeight:'bold',color:value === 5?'red':'#000'}
            }
        }
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const LabelHtml:FC<I_RS> = ({setting,type}) => {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={8} step={1}
                onChange={(newValue)=>setValue(newValue)}
                labels={{step:1}}
                label={(value)=>{
                    return {
                        html:value === 5?<Icon path={mdiAccount} size={0.6}/>:value
                    }
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    labels={{step:1}}
    label={(value)=>{
        return {
            html:value === 5?<Icon path={mdiAccount} size={0.6}/>:value
        }
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const LabelOffset:FC<I_RS> = ({setting,type}) => {
    let {round,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                labels={{step:10}}
                label={()=>{
                    return {offset:round?10:-20}
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    labels={{step:1}}
    label={()=>{
        return {offset:${round?10:-20}}
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const LabelList:FC<I_RS> = ({setting,type}) => {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                labels={{
                    list:[10,20,50]
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    labels={{
        list:[10,20,50]
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const ScaleStep:FC<I_RS> = ({setting,type}) => {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                scales={{
                    step:5
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    scales={{
        step:5
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const ScaleAttrs:FC<I_RS> = ({setting,type}) => {
    let {round,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                scales={{step:1}}
                scale={(value)=>{
                    let a,b;
                    if(value % 10 === 0){a = 12; b = 3}
                    else if(value % 5 === 0){a = 8; b = 2}
                    else {a = 4; b = 1}
                    let background = value >= 40?'red':'#333'   
                    let width,height;
                    if(round || vertical){width = a; height = b}
                    else {width = b; height = a}
                    return {
                        attrs:{
                            style:{width,height,background}
                        }
                    }  
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    scales={{step:1}}
    scale={(value)=>{
        let a,b;
        if(value % 10 === 0){a = 12; b = 3}
        else if(value % 5 === 0){a = 8; b = 2}
        else {a = 4; b = 1}
        let background = value >= 40?'red':'#333'   
        let width,height;
        if(round || vertical){width = a; height = b}
        else {width = b; height = a}
        return {
            attrs:{
                style:{width,height,background}
            }
        }  
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const ScaleStyleObject:FC<I_RS> = ({setting,type}) => {
    let {round,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                scales={{step:1}}
                scale={(value)=>{
                    let a,b;
                    if(value % 10 === 0){a = 12; b = 3}
                    else if(value % 5 === 0){a = 8; b = 2}
                    else {a = 4; b = 1}
                    let background = value >= 40?'red':'#333'   
                    let width,height;
                    if(round || vertical){width = a; height = b}
                    else {width = b; height = a}
                    return {
                        style:{width,height,background}
                    }
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    scales={{step:1}}
    scale={(value)=>{
        let a,b;
        if(value % 10 === 0){a = 12; b = 3}
        else if(value % 5 === 0){a = 8; b = 2}
        else {a = 4; b = 1}
        let background = value >= 40?'red':'#333'   
        let width,height;
        if(round || vertical){width = a; height = b}
        else {width = b; height = a}
        return {
            style:{width,height,background}
        }
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const ScaleClassName:FC<I_RS> = ({setting,type}) => {
    let {round,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                scales={{step:1}}
                scale={(value)=>{
                    let className = 'scale'
                    if(round){className += '-round'}
                    if(vertical){className += '-vertical'}
                    if(value % 10 === 0){className += '-large'}
                    else if(value % 5 === 0){className += '-medium'}
                    else {className += '-small'}
                    className += value >= 40?' scale-red':''
                    return {className}
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    scales={{step:1}}
    scale={(value)=>{
        let className = 'scale'
        if(round){className += '-round'}
        if(vertical){className += '-vertical'}
        if(value % 10 === 0){className += '-large'}
        else if(value % 5 === 0){className += '-medium'}
        else {className += '-small'}
        className += value >= 40?'-red':''
        return {className}
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const ScaleOffset:FC<I_RS> = ({setting,type}) => {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                scales={{step:5}}
                scale={()=>{
                    return {offset:-10}
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    scales={{step:5}}
    scale={()=>{
        return {offset:-10}
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const ScaleList:FC<I_RS> = ({setting,type}) => {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                scales={{
                    list:[20,40,60,80]
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    scales={{
        list:[20,40,60,80]
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const ScaleHtml:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={8} step={1}
                onChange={(newValue)=>setValue(newValue)}
                scales={{step:1}}
                scale={(value:number,p:{angle:number})=>{
                    let {angle} = p
                    let style:any = {
                        width:24,height:24,background:'none',
                        transform:round?`rotate(${-angle}deg)`:undefined
                    }
                    let path = [
                        mdiAccount,
                        mdiAccountClock,
                        mdiAccountCancel,
                        mdiHumanMale,
                        mdiAccountBadge,
                        mdiAccountSupervisorOutline,
                        mdiAccountBoxMultiple,
                        mdiAccountChild,
                        mdiAccountArrowDown
                    ][value]
                    return {style,html:<Icon path={path} size={0.7}/>}
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    scales={{step:1}}
    scale={(value:number,p:{angle:number})=>{
        let {angle} = p
        let style:any = {
            width:24,height:24,background:'none',
            transform:round?${'`rotate(${-angle}deg)`'}:undefined
        }
        let path = [
            mdiAccount,
            mdiAccountClock,
            mdiAccountCancel,
            mdiHumanMale,
            mdiAccountBadge,
            mdiAccountSupervisorOutline,
            mdiAccountBoxMultiple,
            mdiAccountChild,
            mdiAccountArrowDown
        ][value]
        return {style,html:<Icon path={path} size={0.7}/>}
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const Handle:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    if(!round){return null}
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                handle={()=>{
                    return {
                        width:6,
                        color:'orange',
                        height:30,
                        offset:5
                    }
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    handle={()=>{
        return {
            width:6,
            color:'orange',
            height:30,
            offset:5
        }
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const HandleFalse:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    if(!round){return null}
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                handle={false}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    handle={false}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const PointAttrs:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                point={(value,{angle})=>{
                    return {
                        attrs:{
                            style:{
                                height:24,
                                width:24,
                                background:'orange',
                                color:'#fff'
                            }
                        }
                    }
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    point={(value,{angle})=>{
        return {
            attrs:{
                style:{
                    height:24,
                    width:24,
                    background:'orange',
                    color:'#fff'
                }
            }
        }
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const PointHtml:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                point={(value,{angle})=>{
                    return {
                        html:<Icon path={mdiStar} size={1}/>
                    }
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    point={(value,{angle})=>{
        return {
            html:<Icon path={mdiStar} size={1}/>
        }
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const PointOffset:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                point={(value,{angle})=>{
                    return {
                        html:value,
                        offset:-16
                    }
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
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
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const PointFalse:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                point={false}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    point={false}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const Disabled:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={12} step={1}
                onChange={(newValue)=>setValue(newValue)}
                disabled={[4,6,7,10,11]}
                scales={{step:1}}
                scale={(value,{disabled})=>{
                    return {
                        style:{width:6,height:6,background:disabled?'red':'#000'}
                    }
                }}
                labels={{
                    step:1,
                    dynamic:true
                }}
                label={(val,{disabled,value})=>{
                    let active = val === value
                    let color;
                    if(disabled){color = 'red'}
                    else if(active){color = '#fff'}
                    else {color = '#00ff00'}
                    let style:any = {
                        width:40,
                        padding:active?'2px 6px':0,
                        fontSize:10,
                        fontWeight:active?'bold':undefined,
                        background:active?'dodgerblue':undefined,
                        color,
                        fontFamily:'arial',
                    }
                    return {
                        style,
                        html:`${val}:00`
                    }
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    disabled={[4,6,7,10,11]}
    scales={{step:1}}
    scale={(value,{disabled})=>{
        return {
            style:{width:6,height:6,background:disabled?'red':'#000'}
        }
    }}
    labels={{
        step:1,
        dynamic:true
    }}
    label={(val,{disabled,value})=>{
        let active = val === value
        let color;
        if(disabled){color = 'red'}
        else if(active){color = '#fff'}
        else {color = '#00ff00'}
        let style:any = {
            width:40,
            padding:active?'2px 6px':0,
            fontSize:10,
            fontWeight:active?'bold':undefined,
            background:active?'dodgerblue':undefined,
            color,
            fontFamily:'arial',
        }
        return {
            offset:-4,
            style,
            html:${'`${value}:00`'}
        }
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const Circles:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    if(!round){return null}
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                circles={[
                    '4 6 #333',
                    '32 4 #0054fa'
                ]}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    circles={[
        '4 6 #333',
        '30 2 #777'
    ]}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const Rotate_180:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    if(!round){return null}
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                rotate={-180}
                labels={{step:10}}
                label={()=>{
                    return {offset:0}
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    rotate={-180}
    labels={{step:10}}
    label={()=>{
        return {offset:0}
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const Rotate_90:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    if(!round){return null}
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                rotate={-90}
                labels={{step:10}}
                label={()=>{
                    return {offset:0}
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    rotate={-90}
    labels={{step:10}}
    label={()=>{
        return {offset:0}
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const RangesArray:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                ranges={[
                    [40,'6 red'],
                    [60,'6 orange'],
                    [80,'6 yellow'],
                    [100,'6 green'] 
                ]}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    ranges={[
        '40 6 red',
        '60 10 orange',
        '80 14 yellow',
        '100 18 green' 
    ]}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const RangesFunction:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>(0)
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                ranges={(value)=>{
                    return [
                        [value as number,'4 dodgerblue'],
                        [100,'5 #f8f8f8']
                    ]
                }}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    ranges={(value)=>{
        return [
            value + ' 4 dodgerblue',
            '100 5 #f8f8f8'
        ]
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const Multiple:FC<I_RS> = ({setting,type}) => {
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number[]>([10,30])
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                multiple={true}
                {...setting}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    multiple={true}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}