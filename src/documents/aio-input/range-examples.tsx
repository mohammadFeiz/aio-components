import React, { FC, createContext, useContext, useState } from "react"
import { mdiAccount, mdiAccountArrowDown, mdiAccountBadge, mdiAccountBoxMultiple, mdiAccountCancel, mdiAccountChild, mdiAccountClock, mdiAccountSupervisorOutline, mdiHumanMale, mdiMinusThick, mdiPlusThick, mdiStar } from "@mdi/js"
import {Icon} from "@mdi/react"
import AIOInput from "../../npm/aio-input";
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import { Storage } from "../../npm/aio-utils";
import RVD from './../../npm/react-virtual-dom/index';
import { AI_type } from "../../npm/aio-input/types";
type I_exampleType = 'slider' | 'spinner'
type I_setting = {show:number,showCode:boolean,round:number,reverse:boolean,vertical:boolean}
type I_CTX = {setting:I_setting,type:I_exampleType,code:(coe:string)=>React.ReactNode}
const CTX = createContext({} as any)
const RangeExamples:FC<{type:I_exampleType}> = ({type}) => {
    let [examples] = useState<any[]>([
        ['test',Test],
        ['start step end',StartStepEnd],
        ['label',Label],
        ['label (list)',LabelList],
        ['scale',Scale],
        ['scale (list)',ScaleList],
        ['handle (thickness,size,color,offset)',Handle,type === 'spinner'],
        ['handle (false)',HandleFalse,type === 'spinner'],
        ['point (attrs)',PointAttrs],
        ['point (html)',PointHtml],
        ['point (offset)',PointOffset],
        ['point (false)',PointFalse],
        ['disabled',Disabled],
        ['circles',Circles,type === 'spinner'],
        ['rotate (-180 deg)',Rotate_180,type === 'spinner'],
        ['rotate (-90 deg)',Rotate_90,type === 'spinner'],
        ['ranges (static)',RangesStatic],
        ['ranges (dynamic)',RangesDynamic],
        ['multiple',Multiple]
    ])
    let [titles] = useState<string[]>(getTitles)
    function getTitles(){
        let res = ['all'];
        for(let i = 0; i < examples.length; i++){
            let ex = examples[i];
            if(ex[2] !== false){res.push(ex[0])}
        }
        return res
    }
    let [setting,SetSetting] = useState<any>(new Storage(`${type}examplessetting`).load('setting',{
        round:type === 'spinner'?1:0,
        reverse:false,
        vertical:false,
        showCode:true,
        show:'all'
    }))
    function setSetting(setting:any){
        new Storage(`${type}examplessetting`).save('setting',setting)
        SetSetting(setting)
    }
    function changeShow(dir: 1 | -1 ){
        let index = titles.indexOf(setting.show) + dir
        if(index < 0){index = titles.length - 1 }
        if(index > titles.length - 1){index = 0}
        setSetting({...setting,show:titles[index]})
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
                            {show:type === 'slider',input:{type:'checkbox',text:'vertical',min:0,max:1},field:'value.vertical'},
                            {flex:1},
                            {
                                input:{
                                    type:'select',options:titles,before:'Show:',
                                    option:{
                                        text:'option',
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
            style:{fontFamily:'Arial'},
            column:examples.map((o:any,i:number)=>{
                let [title,COMP] = o;
                if(setting.show !== 'all' && setting.show !== title){return {}}
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
    function code(code:string){
        //return <div style={{height:500}}></div>
        return AIODoc().Code(code)
    }
    function getContext(){
        let context:I_CTX = {setting,type,code}
        return context
    }
    return (
        <CTX.Provider value={getContext()}>
            <RVD rootNode={{className:'h-100',column:[setting_node(),render_node()]}}/>
        </CTX.Provider>
    )   
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


const Test:FC = ()=> {
    const {type,code,setting}:I_CTX = useContext(CTX);
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='spinner'
                value={value}
                start={0}
                end={100}
                size={100}
                onChange={setValue}
                labels={[
                    {
                        step:10,
                        setting:(value)=>{
                            let style = value === 50?{color:'orange'}:{}
                            let content = value === 50 ? <Icon path={mdiAccount} size={0.6}/> : value; 
                            return {
                                html: <div style={style}>{content}</div>,
                                color:'#333',
                                offset:20,
                                fixAngle:true
                            };
                        }
                    },
                    {
                        step:2,
                        setting:(value)=>{
                            let offset,height,width,background;
                            if(value % 10 === 0){
                                offset = -5;
                                height = 5;
                                width = 5;
                                background = '#333'
                            }
                            else {
                                offset = -4;
                                height = 2;
                                width = 2;
                                background = '#888';
                            }
                            let style = {height,width,background}
                            return {
                                html:<div style={style}></div>,
                                offset
                            }
                        }
                    }
                ]}
                point={()=>{
                    return {
                        offset:20,
                        attrs:{
                            style:{
                                boxShadow:'0 0 8px 0 rgba(0,0,0,0.4)'
                            }
                        }
                    }
                }}
                handle={(value) => {
                    return {
                        thickness: 12,
                        size: 80,
                        offset: 5,
                        color: '#333',
                        sharp:true
                    }
                }}
                disabled={[0, 25, 75]} // Array of values to disable partially
                circles={[
                    '10 3 #333'
                ]}
                ranges={[
                  [20, '5 10 #ff0000'], // Range from 0 to 20
                  [70, '5 10 orange'], // Range from 20 to 100
                  [100, '5 10 green'] // Range from 20 to 100
                ]}
            />
        </div> 
    )
}
const StartStepEnd:FC = ()=> {
    const {type,code,setting}:I_CTX = useContext(CTX);
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                {...setting}
            />
        {code(`
<AIOInput
    type='${type}' value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const Label:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                size={72}
                labels={[
                    {
                        step:10,
                        setting:(value)=>{
                            return {
                                offset:16,
                                html:(
                                    <div style={{fontSize:14,fontWeight:'bold',color:value === 30?'red':'#000'}}>
                                        {value === 50?<Icon path={mdiAccount} size={0.6}/>:value}
                                    </div>
                                ),
                                fixAngle:!!setting.round
                            }
                        }
                    }
                ]}
                {...setting}
            />
        {code(`
<AIOInput
    type='${type}' 
    value={value} 
    start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    labels={[
        {
            step:10,
            setting:(value)=>{
                return {
                    offset:${setting.round?'60':'75'},
                    html:(
                        <div style={{fontSize:14,fontWeight:'bold',color:value === 30?'red':'#000'}}>
                            {value === 50?<Icon path={mdiAccount} size={0.6}/>:value}
                        </div>
                    ),
                    ${!!setting.round?'fixAngle:true':''}
                }
            }
        }
    ]}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const LabelList:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                labels={[
                    {
                        list:[10,20,50],
                        setting:(value)=>{
                            return {
                                offset:16,
                                html:value,
                                fixAngle:!!setting.round
                            }
                        }
                    }
                ]}
                {...setting}
            />
        {code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    labels={[
        {
            list:[10,20,50],
            setting:(value)=>{
                return {
                    offset:${setting.round?'60':'75'},
                    html:value,
                    ${!!setting.round?'fixAngle:true':''}
                }
            }
        }
    ]}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const Scale:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
    const [value,setValue] = useState<number>()
    let thicknessStr = 'width',sizeStr = 'height';
    if(setting.round || setting.vertical){thicknessStr = 'height'; sizeStr = 'width'}
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                size={120}
                onChange={(newValue)=>setValue(newValue)}
                labels={[
                    {
                        step:1,
                        setting:(value)=>{
                            let size,thickness;
                            if(value % 10 === 0){size = 12; thickness = 3}
                            else if(value % 5 === 0){size = 8; thickness = 2}
                            else {size = 4; thickness = 1}
                            let style:any = {background:value >= 40?'red':'#333'};
                            if(setting.round || setting.vertical){
                                style = {...style,width:size,height:thickness}
                            }
                            else {
                                style = {...style,width:thickness,height:size}
                            }
                            return {
                                html:(
                                    <div style={style}></div>
                                )
                            }  
                        }
                    }
                ]}
                {...setting}
            />
        {code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    labels={[
        {
            step:1,
            setting:(value)=>{
                let ${sizeStr},${thicknessStr};
                if(value % 10 === 0){${sizeStr} = 12; ${thicknessStr} = 3}
                else if(value % 5 === 0){${sizeStr} = 8; ${thicknessStr} = 2}
                else {${sizeStr} = 4; ${thicknessStr} = 1}
                let style:any = {background:value >= 40?'red':'#333',width,height};
                return {
                    offset:50,
                    html:(
                        <div style={style}></div>
                    )
                }  
            }
        }
    ]}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const ScaleList:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
    const [value,setValue] = useState<number>()
    let thicknessStr = 'width',sizeStr = 'height';
    if(setting.round || setting.vertical){thicknessStr = 'height'; sizeStr = 'width'}
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                labels={[
                    {
                        list:[20,30,40,60,80],
                        setting:()=>{
                            let size = 12,thickness = 3;
                            let style:any = {background:'#333'};
                            if(setting.round || setting.vertical){
                                style = {...style,width:size,height:thickness}
                            }
                            else {
                                style = {...style,width:thickness,height:size}
                            }
                            return {
                                html:(
                                    <div style={style}></div>
                                )
                            }  
                        }
                    }
                ]}
                {...setting}
            />
        {code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    labels={[
        {
            list:[20,30,40,60,80],
            setting:()=>{
                return {
                    offset:50,
                    html:<div style={{background:'#333',${sizeStr}:12,${thicknessStr}:3}}></div>
                }  
            }
        }
    ]}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const Handle:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
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
                        thickness:16,
                        size:70,
                        color:'orange',
                        offset:5,
                        sharp:false
                    }
                }}
                {...setting}
            />
        {code(`
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
const HandleFalse:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
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
        {code(`
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
const PointAttrs:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
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
        {code(`
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
const PointHtml:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
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
        {code(`
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
const PointOffset:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
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
                        offset:-25
                    }
                }}
                {...setting}
            />
        {code(`
<AIOInput
    type={type} value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    point={(value,{angle})=>{
        return {
            html:value,
            offset:-25
        }
    }}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const PointFalse:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
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
        {code(`
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
const Disabled:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>(0)
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={12} step={1}
                onChange={(newValue)=>setValue(newValue)}
                disabled={[4,6,7,10,11]}
                point={false}
                fill={false}
                labels={[
                    {
                        step:1,
                        dynamic:true,
                        setting:(val,{disabled,angle})=>{
                            let active = val === value
                            let color,background;
                            if(disabled){color = 'red'}
                            else if(active){color = '#fff'; background = 'dodgerblue'}
                            else {color = '#00ff00'}
                            let style:any = {color,background,padding:3}
                            if(round){
                                let rotate;
                                if(angle < 90){rotate = 0}
                                else if(angle === 90){rotate = -90}
                                else if(angle < 270){rotate = 180}
                                else if(angle === 270){rotate = 90}
                                else {rotate = 0}
                                style.transform = `rotate(${rotate}deg)`
                            }
                            return {
                                html:<div style={style}>{`${val}:00`}</div>,
                                offset:20
                            }
                        }
                    },
                    {
                        step:1,
                        setting:(val,{disabled})=>{
                            let background;
                            if(disabled){background = 'red'}
                            else {background = '#00ff00'}
                            let style = {width:6,height:6,background}
                            return {
                                html:<div style={style}></div>
                            }
                        }
                    }
                ]}
                {...setting}
            />
        {!round?'':code(`
<AIOInput
    type={${type}} value={value} start={0} end={12} step={1}
    onChange={(newValue)=>setValue(newValue)}
    disabled={[4,6,7,10,11]}
    point={false}
    fill={false}
    labels={[
        {
            step:1,
            dynamic:true,
            setting:(val,{disabled,angle})=>{
                let active = val === value
                let color,background;
                if(disabled){color = 'red'}
                else if(active){color = '#fff'; background = 'dodgerblue'}
                else {color = '#00ff00'}
                let style:any = {color,background,padding:3}
                if(round){
                    let rotate;
                    if(angle < 90){rotate = 0}
                    else if(angle === 90){rotate = -90}
                    else if(angle < 270){rotate = 180}
                    else if(angle === 270){rotate = 90}
                    else {rotate = 0}
                    style.transform = ${'`rotate(${rotate}deg)`'}
                }
                return {
                    html:<div style={style}>{${'`${val}:00`'}}</div>,
                    offset:20
                }
            }
        },
        {
            step:1,
            setting:(val,{disabled})=>{
                let background;
                if(disabled){background = 'red'}
                else {background = '#00ff00'}
                let style = {width:6,height:6,background}
                return {
                    html:<div style={style}></div>
                }
            }
        }
    ]}
    {...setting}
/>
        `)}
        {round?'':code(`
<AIOInput
    type={${type}} value={value} start={0} end={12} step={1}
    onChange={(newValue)=>setValue(newValue)}
    disabled={[4,6,7,10,11]}
    point={false}
    fill={false}
    labels={[
        {
            step:1,
            dynamic:true,
            setting:(val,{disabled})=>{
                let active = val === value
                let color,background;
                if(disabled){color = 'red'}
                else if(active){color = '#fff'; background = 'dodgerblue'}
                else {color = '#00ff00'}
                let style:any = {color,background,padding:3}
                return {
                    html:<div style={style}>{${'`${val}:00`'}}</div>,
                    offset:20
                }
            }
        },
        {
            step:1,
            setting:(val,{disabled})=>{
                let background;
                if(disabled){background = 'red'}
                else {background = '#00ff00'}
                let style = {width:6,height:6,background}
                return {
                    html:<div style={style}></div>
                }
            }
        }
    ]}
    {...setting}
/>
        `)}
        </div> 
    )
}
const Circles:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    if(!round){return null}
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                circles={[
                    '2 30 #0054fa',
                    '8 4 #000'
                ]}
                {...setting}
            />
        {code(`
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
const Rotate_180:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    if(!round){return null}
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                rotate={-180}
                labels={[
                    {
                        step:10,
                        setting:(value)=>{
                            return {
                                html:value,
                                fixAngle:true,
                                offset:20
                            }
                        }
                    }
                ]}
                {...setting}
            />
        {code(`
<AIOInput
    type={${type}} 
    value={value} 
    start={0} 
    end={100} 
    step={1}
    onChange={(newValue)=>setValue(newValue)}
    rotate={-180}
    labels={[
        {
            step:10,
            setting:(value)=>{
                return {
                    html:value,
                    offset:20,
                    ${!round?'':'fixAngle:true'}
                }
            }
        }
    ]}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const Rotate_90:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    if(!round){return null}
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                rotate={-90}
                labels={[
                    {
                        step:10,
                        setting:(value)=>{
                            return {
                                html:value,
                                offset:20,
                                fixAngle:true
                            }
                        }
                    }
                ]}
                {...setting}
            />
        {code(`
<AIOInput
    type={${type}} value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    rotate={-90}
    labels={[
        {
            step:10,
            setting:(value)=>{
                return {
                    html:value,
                    offset:20,
                    ${!round?'':'fixAngle:true'}
                }
            }
        }
    ]}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const RangesStatic:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
    let {round,reverse,vertical} = setting
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                fill={false}
                ranges={[
                    [40,'6 0 red'],
                    [60,'6 0 orange'],
                    [80,'6 0 yellow'],
                    [100,'6 0 green'] 
                ]}
                {...setting}
            />
        {code(`
<AIOInput
    type='${type}' 
    value={value} start={0} end={100} step={1}
    onChange={(newValue)=>setValue(newValue)}
    ranges={[
        [40,'6 0 red'],
        [60,'6 0 orange'],
        [80,'6 0 yellow'],
        [100,'6 0 green'] 
    ]}
    ${sc(setting)}
/>
        `)}
        </div> 
    )
}
const RangesDynamic:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
    const [value,setValue] = useState<number>(0)
    function getRanges():any[]{
        let color;
        if(value < 25){color = 'red'}
        else if(value < 50){color = 'orange'}
        else if(value < 75){color = 'yellow'}
        else {color = 'green'}
        return [
            [value as number,`4 0 ${color}`],
            [100,'5 0 #eee']
        ]
    }
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue)=>setValue(newValue)}
                fill={false}
                ranges={getRanges()}
                {...setting}
            />
        {code(`
function getRanges(value):any[]{
    let color;
    if(value < 25){color = 'red'}
    else if(value < 50){color = 'orange'}
    else if(value < 75){color = 'yellow'}
    else {color = 'green'}
    return [
        [value as number,${'`4 0 ${color}`'}],
        [100,'5 0 #eee']
    ]
}
<AIOInput
    type={${type}} 
    value={value} 
    start={0} 
    end={100} 
    step={1}
    onChange={(newValue)=>setValue(newValue)}
    fill={false}
    ranges={getRanges(value)}
    {...setting}
/>
        `)}
        </div> 
    )
}
const Multiple:FC = () => {
    const {type,code,setting}:I_CTX = useContext(CTX);
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
        {code(`
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