import React, { Component,createRef, useState } from 'react';
import DOC from '../../../resuse-components/doc.tsx';
import AIODoc from '../../../npm/aio-documentation/aio-documentation.js';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom.js';
import AIOInput,{AI, AI_slider_label, AI_slider_point, AI_slider_scale} from '../../../npm/aio-input/index.tsx';
import './doc-aio-input-slider.css';
import {Icon} from '@mdi/react';
import { mdiHumanMale,mdiHumanFemale, mdiAbTesting, mdiFile, mdiAccount, mdiAccountAlert, mdiCircle, mdiCircleMedium} from '@mdi/js';
export default function DOC_AIOInput_Slider(props) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items:()=>[
                    { text: 'value', id: 'value', render: () => <Value /> },
                    { text: 'onChange', id: 'onChange', render: () => <OnChange /> },
                    { text: 'start end min max', id: 'startendminmax', render: () => <StartEndMinMax /> },
                    { text: 'multiple', id: 'multiple', render: () => <Multiple /> },
                    { text: 'direction', id: 'direction', render: () => <Direction /> },
                    { text: 'grooveAttrs', id: 'grooveAttrs', render: () => <GrooveAttrs /> },
                    { text: 'point', id: 'point', render: () => <Point /> },
                    { text: 'line', id: 'line', render: () => <Line /> },
                    { text: 'label', id: 'label', render: () => <Label /> },
                    { text: 'scale', id: 'scale', render: () => <Scale /> },
                ]
            }}
        />
    )
    
}

function Value() {
    let [value,setValue] = useState<number>(50)
    function renderSlider(){
        let p:AI = {type:'slider',value}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderSlider()}
            {
                AIODoc().Code(`
let [value,setValue] = useState(50)
return <AIOInput type='slider' value={value}/>
                `)
            }
            {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
        </div>
    )
}
function OnChange() {
    let [value,setValue] = useState<number>(50)
    function renderSlider(){
        let p:AI = {type:'slider',value,onChange:(value)=>setValue(value)}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderSlider()}
            {
                AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value}
    onChange={(value)=>setValue(value)}
/>
                `)
            }
            {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
        </div>
    )
}
function StartEndMinMax() {
    let [value,setValue] = useState<number>(50)
    function renderSlider(){
        let p:AI = {
            type:'slider',value,onChange:(value)=>setValue(value),
            start:0,end:100,min:10,max:90
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderSlider()}
            {
                AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value}
    start={0} end={100} min={10} max={90}
    onChange={(value)=>setValue(value)}
/>
                `)
            }
            {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
        </div>
    )
}
function Multiple() {
    let [value1,setValue1] = useState<number[]>([50,70])
    let [value2,setValue2] = useState<number[]>([50,70,90,100])
    function renderSlider(type:'1' | '2'){
        let setValue = type === '1'?setValue1:setValue2;
        let value = type === '1'?value1:value2;
        let p:AI = {type:'slider',multiple:true,value,onChange:(value)=>setValue(value)}
        return <AIOInput {...p}/>
    }
    function getCode(type:'1'|'2'){
        return `
const [value,setValue] = useState(${JSON.stringify(type === '1'?value1:value2)});
<AIOInput 
    type='slider' value={value} multiple={true}
    onChange={(value)=>setValue(value)}
/>       
        `
    }
    return (
        <div className='example'>
            <h3>double value</h3>
            {renderSlider('1')}
            {AIODoc().Code(getCode('1'))}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
            <h3>multi value</h3>
            {renderSlider('2')}
            {AIODoc().Code(getCode('2'))}
        </div>
    )
}
function Direction() {
    let [value,setValue] = useState<number>(50)
    function renderSlider(direction:'left' | 'right' | 'top' | 'bottom'){
        let p:AI = {type:'slider',value,onChange:(value)=>setValue(value),direction}
        return <AIOInput {...p}/>
    }
    function getCode(direction:'left' | 'right' | 'top' | 'bottom'){
        return `
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} direction='${direction}'
    onChange={(value)=>setValue(value)}
/>
                        `
    }
    return (
        <div className='example'>
            <h3>direction:"right"</h3>
            {renderSlider('right')}
            {AIODoc().Code(getCode('right'))}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
            <h3>direction:"left"</h3>
            {renderSlider('left')} 
            {AIODoc().Code(getCode('left'))}
            <h3>direction:"top"</h3>
            {renderSlider('top')} 
            {AIODoc().Code('top')}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
            <h3>direction:"bottom"</h3>
            {renderSlider('bottom')}
            {AIODoc().Code('bottom')}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
            
        </div>
    )
}
function Point() {
    let [value,setValue] = useState<number[]>([50,70])
    function renderSlider(title:string,point:AI_slider_point,code){
        let p:AI = {
            type:'slider',multiple:true,value,onChange:(value)=>setValue(value)
        }
        p.point = point;
        return (
            <>
                <h3>{title}</h3>
                <AIOInput {...p}/>
                {
                    AIODoc().Code(`
let [value,setValue] = useState(50);
return (
    <AIOInput 
        type='slider' value={value} onChange={(value)=>setValue(value)}
        ${code}
    />
)                    
                    `)
                }
            </>
        )
    }
    return (
        <div className='example'>
            {
                renderSlider(
                    'point attrs',
                    (index,value)=>{
                        return {
                            attrs:{
                                style:{
                                    width:8,height:16,borderRadius:2,
                                    background:index === 0?'dodgerblue':'lightblue'
                                }
                            },
                        }
                    },
        `point={(index,value)=>{
            return {
                attrs:{
                    style:{
                        width:8,height:16,borderRadius:2,
                        background:index === 0?'dodgerblue':'lightblue'
                    }
                }
            }
        }`
                )
            }
            {
                renderSlider(
                    'point html',
                    (index,value)=>{
                        return {
                            attrs:{style:{width:24,height:24,background:'#fff',border:'1px solid',color:'#888'}},
                            html:<Icon path={index === 0?mdiAccount:mdiFile} size={.6}/>
                        }
                    },
        `point={(index,value)=>{
            return {
                attrs:{
                    style:{
                        width:24,
                        height:24,
                        background:'#fff',
                        color:'#888',
                        border:'1px solid'
                    }
                },
                html:<Icon path={index === 0?mdiAccount:mdiFile} size={.6}/>
            }
        }`
                )
            }
            {
                renderSlider(
                    'point labelShow = true',
                    (index,value)=>{
                        return {
                            labelShow:true
                        }
                    },
        `point={(index,value)=>{
            return {
                labelShow:true
            }
        }}`
                )
            }
            {
                renderSlider(
                    'point labelShow = false',
                    (index,value)=>{
                        return {
                            labelShow:false
                        }
                    },
        `point={(index,value)=>{
            return {
                labelShow:false
            }
        }}`
                )
            }
            {
                renderSlider(
                    'point labelShow = "inline"',
                    (index,value)=>{
                        return {
                            labelShow:'inline'
                        }
                    },
        `point={(index,value)=>{
            return {
                labelShow:'inline'
            }
        }}`
                )
            }
            {
                renderSlider(
                    'point labelAttes',
                    (index,value)=>{
                        return {
                            labelShow:true,
                            labelAttrs:{
                                style:{
                                    background:'red'
                                }
                            }
                        }
                    },
        `point={(index,value)=>{
            return {
                labelShow:true,
                labelAttrs:{
                    style:{
                        background:'red'
                    }
                }
            }
        }}`
                )
            }
            {
                renderSlider(
                    'point labelHtml',
                    (index,value)=>{
                        return {
                            labelShow:true,
                            labelHtml:value + ' %'
                        }
                    },
        `point={(index,value)=>{
            return {
                labelShow:true,
                labelHtml:(value)=>value + ' %'
            }
        }}`
                )
            }
        </div>
    )
}
function GrooveAttrs() {
    let [value,setValue] = useState<number>(50)
    function renderSlider(){
        let p:AI = {
            type:'slider',value,onChange:(value)=>setValue(value),
            grooveAttrs:{style:{height:6,borderRadius:12}}
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderSlider()}        
            {
                AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    onChange={(value)=>setValue(value)}
    grooveAttrs={style:{height:6,borderRadius:12}}}
/>
                `)
            }
        </div>
    )
}
function Line() {
    let [value,setValue] = useState<number>(50)
    function renderSlider(){
        let p:AI = {
            type:'slider',value,onChange:(value)=>setValue(value),
            line:(index,active)=>{
                if(!active){return}
                let background;
                if(value < 30){background = 'red'}
                else if(value < 60){background = 'orange'}
                else if(value < 90){background = 'yellow'}
                else {background = 'green'}
                let style = {height:6,borderRadius:12,background}
                return {attrs:{style}}
            }
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderSlider()}
            {
                AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    onChange={(value)=>this.setState({value})}
    line={(index,active)=>{
        if(!active){return}
        let style = {height:6,borderRadius:12}
        return {attrs:{style}}
    }}
/>
                `)
            }
        </div>
    )
}
function Label() {
    let [value,setValue] = useState<number>(50)
    function renderSlider(title:string,label:AI_slider_label,code:string){
        let p:AI = {type:'slider',value,onChange:(value)=>setValue(value),label}
        return (
            <>
                <h3>{title}</h3>
                <AIOInput {...p}/>
                <div style={{height:24}}></div>
                {AIODoc().Code(`
const [value,setValue] = useState(50);
return (
    <AIOInput 
        type='slider' value={value} 
        onChange={(value)=>this.setState({value})}
        ${code}
    />
)
                `)}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
            
        )
    }
    return (
        <div className='example'>
            {
                renderSlider(
                    'label.step',
                    {step:10},
                    'label={{step:10}}'
                )
            }
            {
                renderSlider(
                    'label.list',
                    {list:[0,50,70,100]},
                    'label={{list:[0,50,70,100]}}'
                )
            }
            {
                renderSlider(
                    'label.html',
                    {
                        step:10,
                        html:(value)=>{
                            if(value === 0){return 'start'}
                            else if(value === 50){return 'avg'}
                            else if(value === 100){return 'end'}
                            else {return value}
                        }
                    },
                    `
        label={{
            step:10,
            html:(value)=>{
                if(value === 0){return 'start'}
                else if(value === 50){return 'avg'}
                else if(value === 100){return 'end'}
                else {return value}
            }
        }}
                    `
                )
            }
            {
                renderSlider(
                    'label.attrs',
                    {
                        step:10,
                        attrs:(value)=>{
                            let color;
                            if(value < 30){color = 'red'}
                            else if(value < 70){color = 'orange'}
                            else {color = 'green'}
                            return {
                                style:{fontWeight:'bold',color}
                            }
                        }
                    },
                    `
        label={{
            step:10,
            attrs:(value)=>{
                let color;
                if(value < 30){color = 'red'}
                else if(value < 70){color = 'orange'}
                else {color = 'green'}
                return {
                    style:{fontWeight:'bold',color}
                }
            }
        }}
                    `
                )
            }
            {
                renderSlider(
                    'label.rotate',
                    {
                        step:10,
                        rotate:(value)=>90
                    },
                    `
        label={{
            step:10,
            attrs:()=>{
                return {
                    style:{background:value < 30?'red':'green'}
                }
            }
        }}
                    `
                )
            }
        </div>
    )        
}
function Scale() {
    let [value,setValue] = useState<number>(50)
    function renderSlider(title:string,scale:AI_slider_scale,code:string){
        let p:AI = {type:'slider',value,onChange:(value)=>setValue(value),scale}
        return (
            <>
                <h3>{title}</h3>
                <AIOInput {...p}/>
                {
                    AIODoc().Code(`
let [value,setValue] = useState(50);
return (
    <AIOInput 
        type='slider' value={value} 
        onChange={(value)=>this.setState({value})}
        ${code}
    />
)                    
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
        )
    }
    return (
        <div className='example'>
            {
                renderSlider(
                    'scale.step',
                    {
                        step:10
                    },
        `scale={{
            step:10
        }}`
                )
            }
            {
                renderSlider(
                    'scale.list',
                    {
                        list:[0,50,70,100]
                    },
        `scale={{
            list:[0,50,70,100]
        }}`
                )
            }
            {
                renderSlider(
                    'scale.attrs',
                    {
                        step:10,
                        attrs:(value)=>{
                            let background = value < 30?'red':'green'
                            let width = 4,top = 0;
                            let style = {background,width,top}
                            return {
                                style
                            }
                        }
                    },
        `scale={{
            step:10,
            attrs:(value)=>{
                let background = value < 30?'red':'green'
                let width = 4,top = 0;
                let style = {background,width,top}
                return {
                    style
                }
            }
        }}`
                )
            }
            {
                renderSlider(
                    'scale.html',
                    {
                        step:10,
                        attrs:(value)=>{
                            let style = {
                                background:'none',
                                width:24,
                                height:24,
                                top:4
                            }
                            return {
                                style
                            }
                        },
                        html:()=><Icon path={mdiCircleMedium} size={0.6}/>
                    },
        `scale={{
            step:10,
            attrs:(value)=>{
                let style = {
                    background:'none',
                    width:24,
                    height:24,
                    top:4
                }
                return {
                    style
                }
            },
            html:()=><Icon path={mdiCircleMedium} size={0.6}/>
        }}`
                )
            }
        
            {/* <h3>scaleStyle (object)</h3>
            {renderSlider()}
        
            <AIOInput 
                type='slider' value={value} 
                onChange={(value)=>this.setState({value})}
                scaleStep={10}
                scaleStyle={{top:20,width:3,background:'dodgerblue',zIndex:10}}
            />
            {
                AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
type='slider' value={value} 
onChange={(value)=>this.setState({value})}
scaleStep={10}
scaleStyle={{top:20,width:3,background:'dodgerblue',zIndex:10}}
/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
            <h3>scaleStyle (function)</h3>
            {renderSlider()}
        
            <AIOInput 
                type='slider' value={value} 
                onChange={(value)=>this.setState({value})}
                scaleStep={1}
                scaleStyle={(value)=>{
                    if(value % 10 === 0){return {height:12}}
                    if(value % 5 === 0){return {height:8}}
                    return {height:5}
                }}
            />
            {
                AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
type='slider' value={value} 
onChange={(value)=>this.setState({value})}
scaleStep={1}
scaleStyle={(value)=>{
    if(value % 10 === 0){return {height:12}}
    if(value % 5 === 0){return {height:8}}
    return {height:5}
}}
/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
            <h3>getScaleHTML</h3>
            {renderSlider()}
        
            <AIOInput 
                type='slider' value={value} 
                onChange={(value)=>this.setState({value})}
                scaleStep={[0,50,70,100]}
                getScaleHTML={(value)=>{
                    if(value === 0){return <Icon path={mdiAccount} size={1}/>}
                    if(value === 50){return <Icon path={mdiAccount} size={1}/> }
                    if(value === 70){return <Icon path={mdiAccount} size={1}/> }
                    if(value === 100){return <Icon path={mdiAccount} size={1}/> }
                }}
            />
            {
                AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
type='slider' value={value} 
onChange={(value)=>this.setState({value})}
scaleStep={[0,50,70,100]}
getScaleHTML={(value)=>{
    if(value === 0){return <Icon path={mdiAccount} size={1}/>}
    if(value === 50){return <Icon path={mdiAccount} size={1}/> }
    if(value === 70){return <Icon path={mdiAccount} size={1}/> }
    if(value === 100){return <Icon path={mdiAccount} size={1}/> }
}}
/>
                `)
            } */}
        </div>
    )
}