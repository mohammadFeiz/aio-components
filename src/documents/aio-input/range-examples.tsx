import { FC, useContext, useState } from "react"
import { mdiAccount, mdiStar } from "@mdi/js"
import { Icon } from "@mdi/react"
import AIOInput, { AITYPE } from "../../npm/aio-input";
import Example, { ExampleContext, I_ExampleContext } from "./example";
type I_exampleType = 'slider' | 'spinner'
const RangeExamples: FC<{ type: I_exampleType }> = ({ type }) => {
    let [examples] = useState<any[]>([
        ['test', ()=><Test type={type}/>],
        ['start step end', ()=><StartStepEnd type={type}/>],
        ['label', ()=><Label type={type}/>],
        ['label (list)', ()=><LabelList type={type}/>],
        ['scale', ()=><Scale type={type}/>],
        ['scale (list)', ()=><ScaleList type={type}/>],
        ['handle (thickness,size,color,offset)',()=> <Handle type={type}/>, type === 'spinner'],
        ['handle (false)', ()=><HandleFalse type={type}/>, type === 'spinner'],
        ['point (attrs)', ()=><PointAttrs type={type}/>],
        ['point (html)', ()=><PointHtml type={type}/>],
        ['point (offset)', ()=><PointOffset type={type}/>],
        ['point (false)', ()=><PointFalse type={type}/>],
        ['disabled', ()=><Disabled type={type}/>],
        ['circles', ()=><Circles type={type}/>, type === 'spinner'],
        ['rotate (-180 deg)', ()=><Rotate_180 type={type}/>, type === 'spinner'],
        ['rotate (-90 deg)',()=> <Rotate_90 type={type}/>, type === 'spinner'],
        ['ranges (static)',()=> <RangesStatic type={type}/>],
        ['ranges (dynamic)', ()=><RangesDynamic type={type}/>],
        ['multiple', ()=><Multiple type={type}/>]
    ])
    return (<Example type={type} examples={examples}/>)
}
export default RangeExamples


function sc(setting: { round?: number, reverse: boolean, vertical: boolean }) {
    let { round, reverse, vertical } = setting
    return (
        `${round ? `round={${round}}` : ''}
${`    reverse={${reverse ? 'true' : 'false'}}`}
${`    vartical={${vertical ? 'true' : 'false'}}`}`
    )
}


const Test: FC<{type:I_exampleType}> = ({type}) => {
    const [value, setValue] = useState<number>()
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
                        step: 10,
                        setting: (value) => {
                            let style = value === 50 ? { color: 'orange' } : {}
                            let content = value === 50 ? <Icon path={mdiAccount} size={0.6} /> : value;
                            return {
                                html: <div style={style}>{content}</div>,
                                color: '#333',
                                offset: 20,
                                fixAngle: true
                            };
                        }
                    },
                    {
                        step: 2,
                        setting: (value) => {
                            let offset, height, width, background;
                            if (value % 10 === 0) {
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
                            let style = { height, width, background }
                            return {
                                html: <div style={style}></div>,
                                offset
                            }
                        }
                    }
                ]}
                point={() => {
                    return {
                        offset: 20,
                        attrs: {
                            style: {
                                boxShadow: '0 0 8px 0 rgba(0,0,0,0.4)'
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
                        sharp: true
                    }
                }}
                disabled={[0, 25, 75]} // Array of values to disable partially
                circles={[
                    {thickness:10,offset:3,color:'#ff0000'}
                ]}
                ranges={[
                    [20, {thickness:5,offset:10,color:'red'}], // Range from 0 to 20
                    [70, {thickness:5,offset:10,color:'orange'}], // Range from 20 to 100
                    [100, {thickness:5,offset:10,color:'green'}] // Range from 20 to 100
                ]}
            />
        </div>
    )
}
const StartStepEnd: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
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
const Label: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
                size={72}
                labels={[
                    {
                        step: 10,
                        setting: (value) => {
                            return {
                                offset: 16,
                                html: (
                                    <div style={{ fontSize: 14, fontWeight: 'bold', color: value === 30 ? 'red' : '#000' }}>
                                        {value === 50 ? <Icon path={mdiAccount} size={0.6} /> : value}
                                    </div>
                                ),
                                fixAngle: !!setting.round
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
                    offset:${setting.round ? '60' : '75'},
                    html:(
                        <div style={{fontSize:14,fontWeight:'bold',color:value === 30?'red':'#000'}}>
                            {value === 50?<Icon path={mdiAccount} size={0.6}/>:value}
                        </div>
                    ),
                    ${!!setting.round ? 'fixAngle:true' : ''}
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
const LabelList: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
                labels={[
                    {
                        list: [10, 20, 50],
                        setting: (value) => {
                            return {
                                offset: 16,
                                html: value,
                                fixAngle: !!setting.round
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
                    offset:${setting.round ? '60' : '75'},
                    html:value,
                    ${!!setting.round ? 'fixAngle:true' : ''}
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
const Scale: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    let thicknessStr = 'width', sizeStr = 'height';
    if (setting.round || setting.vertical) { thicknessStr = 'height'; sizeStr = 'width' }
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                size={120}
                onChange={(newValue) => setValue(newValue)}
                labels={[
                    {
                        step: 1,
                        setting: (value) => {
                            let size, thickness;
                            if (value % 10 === 0) { size = 12; thickness = 3 }
                            else if (value % 5 === 0) { size = 8; thickness = 2 }
                            else { size = 4; thickness = 1 }
                            let style: any = { background: value >= 40 ? 'red' : '#333' };
                            if (setting.round || setting.vertical) {
                                style = { ...style, width: size, height: thickness }
                            }
                            else {
                                style = { ...style, width: thickness, height: size }
                            }
                            return {
                                html: (
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
const ScaleList: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    let thicknessStr = 'width', sizeStr = 'height';
    if (setting.round || setting.vertical) { thicknessStr = 'height'; sizeStr = 'width' }
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
                labels={[
                    {
                        list: [20, 30, 40, 60, 80],
                        setting: () => {
                            let size = 12, thickness = 3;
                            let style: any = { background: '#333' };
                            if (setting.round || setting.vertical) {
                                style = { ...style, width: size, height: thickness }
                            }
                            else {
                                style = { ...style, width: thickness, height: size }
                            }
                            return {
                                html: (
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
const Handle: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number>()
    if (!round) { return null }
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
                handle={() => {
                    return {
                        thickness: 16,
                        size: 70,
                        color: 'orange',
                        offset: 5,
                        sharp: false
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
const HandleFalse: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number>()
    if (!round) { return null }
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
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
const PointAttrs: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
                point={(value, { angle }) => {
                    return {
                        attrs: {
                            style: {
                                height: 24,
                                width: 24,
                                background: 'orange',
                                color: '#fff'
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
const PointHtml: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
                point={(value, { angle }) => {
                    return {
                        html: <Icon path={mdiStar} size={1} />
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
const PointOffset: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
                point={(value, { angle }) => {
                    return {
                        html: value,
                        offset: -25
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
const PointFalse: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
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
const Disabled: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number>(0)
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={12} step={1}
                onChange={(newValue) => setValue(newValue)}
                disabled={[4, 6, 7, 10, 11]}
                point={false}
                fill={false}
                labels={[
                    {
                        step: 1,
                        dynamic: true,
                        setting: (val, { disabled, angle }) => {
                            let active = val === value
                            let color, background;
                            if (disabled) { color = 'red' }
                            else if (active) { color = '#fff'; background = 'dodgerblue' }
                            else { color = '#00ff00' }
                            let style: any = { color, background, padding: 3 }
                            if (round) {
                                let rotate;
                                if (angle < 90) { rotate = 0 }
                                else if (angle === 90) { rotate = -90 }
                                else if (angle < 270) { rotate = 180 }
                                else if (angle === 270) { rotate = 90 }
                                else { rotate = 0 }
                                style.transform = `rotate(${rotate}deg)`
                            }
                            return {
                                html: <div style={style}>{`${val}:00`}</div>,
                                offset: 20
                            }
                        }
                    },
                    {
                        step: 1,
                        setting: (val, { disabled }) => {
                            let background;
                            if (disabled) { background = 'red' }
                            else { background = '#00ff00' }
                            let style = { width: 6, height: 6, background }
                            return {
                                html: <div style={style}></div>
                            }
                        }
                    }
                ]}
                {...setting}
            />
            {!round ? '' : code(`
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
            {round ? '' : code(`
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
const Circles: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number>()
    if (!round) { return null }
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
                circles={[
                    {thickness:2,offset:30,color:'#0054fa'},
                    {thickness:8,offset:4,color:'#000'}
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
const Rotate_180: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number>()
    if (!round) { return null }
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
                rotate={-180}
                labels={[
                    {
                        step: 10,
                        setting: (value) => {
                            return {
                                html: value,
                                fixAngle: true,
                                offset: 20
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
                    ${!round ? '' : 'fixAngle:true'}
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
const Rotate_90: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number>()
    if (!round) { return null }
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
                rotate={-90}
                labels={[
                    {
                        step: 10,
                        setting: (value) => {
                            return {
                                html: value,
                                offset: 20,
                                fixAngle: true
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
                    ${!round ? '' : 'fixAngle:true'}
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
const RangesStatic: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
                fill={false}
                ranges={[
                    [40, {thickness:6,offset:0,color:'red'}],
                    [60, {thickness:6,offset:0,color:'orange'}],
                    [80, {thickness:6,offset:0,color:'yellow'}],
                    [100, {thickness:6,offset:0,color:'green'}]
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
const RangesDynamic: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>(0)
    function getRanges(): any[] {
        let color;
        if (value < 25) { color = 'red' }
        else if (value < 50) { color = 'orange' }
        else if (value < 75) { color = 'yellow' }
        else { color = 'green' }
        return [
            [value as number, `4 0 ${color}`],
            [100, '5 0 #eee']
        ]
    }
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
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
const Multiple: FC<{type:I_exampleType}> = ({type}) => {
    const { code, setting }: I_ExampleContext = useContext(ExampleContext);
    let { round, reverse, vertical } = setting
    const [value, setValue] = useState<number[]>([10, 30])
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value} start={0} end={100} step={1}
                onChange={(newValue) => setValue(newValue)}
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