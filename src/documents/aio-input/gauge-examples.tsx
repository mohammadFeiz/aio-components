import { FC, useContext, useState } from "react"
import AIOInput from "../../npm/aio-input";
import Example, { ExampleContext, I_ExampleContext } from "./example";
const GaugeExamples: FC = () => {
    let [examples] = useState<any>([
        ['example1', ()=><Example1/>],
        ['example2', ()=><Example2/>],
        ['example3', ()=><Example3/>],
        ['example4', ()=><Example4/>],
        ['example5', ()=><Example5/>],
        ['example6', ()=><Example6/>],
        ['example7', ()=><Example7/>],
        ['example8', ()=><Example8/>],
    ])
    return (<Example type={'gauge' as any} examples={examples}/>)
}
export default GaugeExamples


const Example1: FC = () => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>(25)
    return (
        <div style={{ fontFamily: 'Arial' }}>
            <AIOInput
                type='spinner'
                size={120}
                value={value}
                start={0} end={100} step={1}
                round={0.5}
                onChange={(newValue) => setValue(newValue)}
                handle={false}
                point={false}
                labels={[
                    {
                        step: 10,
                        setting: (value) => {
                            return {
                                offset: 16, fixAngle: true,
                                html: (
                                    <div style={{ fontSize: 10, color: '#999' }}>{value}</div>
                                )
                            }
                        }
                    },
                    {
                        step: 10,
                        setting: (value) => {
                            return {
                                offset: 5,
                                html: (
                                    <div style={{ height: 1, width: 4, background: '#ccc' }}></div>
                                )
                            }
                        }
                    }
                ]}
                ranges={[
                    [value, {thickness:20,offset:0,color:'#eee'}],
                    [100, {thickness:20,offset:0,color:'#eee'}]
                ]}
                text={() => {
                    return (
                        <div className='gauge-html'>
                            <div className='gauge-text'>{`${value}%`}</div>
                            <div className='gauge-subtext'>Metric</div>
                        </div>
                    )
                }}
            />
            {code(`
<AIOInput
    type='spinner' 
    size={120}
    value={value} 
    start={0} end={100} step={1}
    round={0.5}
    onChange={(newValue)=>setValue(newValue)}
    handle={false}
    point={false}
    labels={[
        {
            step:10,
            setting:(value)=>{
                return {
                    offset:16,fixAngle:true,
                    html:(
                        <div style={{fontSize:10,color:'#999'}}>{value}</div>
                    )
                }
            }
        },
        {
            step:10,
            setting:(value)=>{
                return {
                    offset:5,
                    html:(
                        <div style={{height:1,width:4,background:'#ccc'}}></div>
                    )
                }
            }
        }
    ]}
    ranges={[
        [value,'20 0 rgb(140,198,64)'],
        [100,'20 0 #eee']
    ]}
    text={()=>{
        return (
            <div className='gauge-html'>
                <div className='gauge-text'>{${'`${value}%`'}}</div>
                <div className='gauge-subtext'>Metric</div>
            </div>
        )
    }}
/>
        `)}
        </div>
    )
}
const Example2: FC = () => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>(75)
    return (
        <div style={{ fontFamily: 'Arial' }}>
            <AIOInput
                type='spinner'
                size={120}
                value={value}
                start={0} end={100} step={1}
                round={0.75}
                onChange={(newValue) => setValue(newValue)}
                handle={false}
                point={false}
                ranges={[
                    [value, {thickness:20,offset:0,color:'#EE5723'}],
                    [100, {thickness:20,offset:0,color:'#eee'}]
                ]}
                labels={[
                    {
                        step: 10,
                        setting: (value) => {
                            return {
                                offset: 16,
                                fixAngle: true,
                                html: (
                                    <div style={{ fontSize: 10, color: '#999' }}>{value}</div>
                                )
                            }
                        }
                    },
                    {
                        step: 5,
                        setting: (value) => {
                            return {
                                offset: 5,
                                html: (
                                    <div style={{ height: 1, width: 4, background: '#ccc' }}></div>
                                )
                            }
                        }
                    }
                ]}
                text={() => {
                    return (
                        <div className='gauge-html'>
                            <div className='gauge-text'>{`${value}%`}</div>
                            <div className='gauge-subtext'>Metric</div>
                        </div>
                    )
                }}
            />
            {code(`
<AIOInput
    type='spinner' 
    size={120}
    value={value} 
    start={0} end={100} step={1}
    round={0.75}
    onChange={(newValue)=>setValue(newValue)}
    handle={false}
    point={false}
    ranges={[
        [value,'20 0 #EE5723'],
        [100,'20 0 #eee']
    ]}
    labels={[
        {
            step:10,
            setting:(value)=>{
                return {
                    offset:16,
                    fixAngle:true,
                    html:(
                        <div style={{fontSize:10,color:'#999'}}>{value}</div>
                    )
                }
            }
        },
        {
            step:5,
            setting:(value)=>{
                return {
                    offset:5,
                    html:(
                        <div style={{height:1,width:4,background:'#ccc'}}></div>
                    )
                }
            }
        }
    ]}
    text={()=>{
        return (
            <div className='gauge-html'>
                <div className='gauge-text'>{${'`${value}%`'}}</div>
                <div className='gauge-subtext'>Metric</div>
            </div>
        )
    }}
/>
        `)}
        </div>
    )
}

const Example3: FC = () => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>(75)
    return (
        <div style={{ fontFamily: 'Arial' }}>
            <AIOInput
                type='spinner'
                size={160}
                value={value}
                start={0} end={200} step={1}
                round={0.75}
                onChange={(newValue) => setValue(newValue)}
                point={false}
                handle={() => {
                    return {
                        width: 6,
                        height: 52,
                        color: 'red',
                        offset: 5,
                        sharp: true
                    }
                }}
                ranges={[
                    [150, {thickness:10,offset:8,color:'green'}],
                    [200, {thickness:10,offset:8,color:'orange'}]
                ]}
                circles={[
                    {thickness:1,offset:100,color:'#ccc'},
                    {thickness:3,offset:5,color:'red',full:true}
                ]}
                labels={[
                    {
                        step: 25,
                        setting: (value) => {
                            return {
                                offset: 16,
                                fixAngle: true,
                                html: <div style={{ fontSize: 10, color: '#999' }}>{value}</div>
                            }
                        }
                    },
                    {
                        step: 25,
                        setting: (value) => {
                            return {
                                offset: -5,
                                html: <div style={{ width: 4, height: 1, background: '#aaa' }}></div>
                            }
                        }
                    }
                ]}
            />
            {code(`
<AIOInput
    type='spinner' 
    size={160}
    value={value} 
    start={0} end={200} step={1}
    round={0.75}
    onChange={(newValue)=>setValue(newValue)}
    point={false}
    handle={()=>{
        return {
            width:6,
            height:52,
            color:'red',
            offset:5,
            sharp:true
        }
    }}
    ranges={[
        [150,'10 8 green'],
        [200,'10 8 orange']
    ]}
    circles={[
        '1 100 #ccc',
        '3 5 red 0 1'
    ]}
    labels={[
        {
            step:25,
            setting:(value)=>{
                return {
                    offset:16,
                    fixAngle:true,
                    html:<div style={{fontSize:10,color:'#999'}}>{value}</div>
                }
            }
        },
        {
            step:25,
            setting:(value)=>{
                return {
                    offset:-5,
                    html:<div style={{width:4,height:1,background:'#aaa'}}></div>
                }
            }
        }
    ]}
/>
        `)}
        </div>
    )
}
const Example4: FC = () => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>(126)
    return (
        <div style={{ fontFamily: 'Arial' }}>
            <AIOInput
                type='spinner'
                size={160}
                value={value}
                start={0} end={140} step={1}
                round={1}
                onChange={(newValue) => setValue(newValue)}
                point={false}
                handle={false}
                ranges={[
                    [value, {thickness:8,offset:0,color:'#1367bb',roundCap:true}]
                ]}
                circles={[
                    {thickness:8,offset:80,color:'#ddd',full:true},
                ]}
                rotate={180}
                reverse={true}
                labels={[
                    {
                        step: 20,
                        setting: (value) => {
                            return {
                                html: <div style={{ fontSize: 12, color: '#666', fontFamily: 'Arial' }}>{value}</div>,
                                offset: -28,
                                fixAngle: true
                            }
                        }
                    },
                    {
                        step: 10,
                        setting: (value) => {
                            let width, offset;
                            if (value % 20 === 0) {
                                width = 10;
                                offset = -12;
                            }
                            else {
                                width = 6;
                                offset = -10
                            }
                            let style = { height: 1, width, background: '#444' };
                            return {
                                html: <div style={style}></div>,
                                offset
                            }
                        }
                    }
                ]}
                text={() => <div style={{ fontSize: 10, color: '#000', fontWeight: 'bold' }}>Temperature</div>}
            />
            {code(`
<AIOInput
    type='spinner' 
    size={160}
    value={value} 
    start={0} end={140} step={1}
    round={1}
    onChange={(newValue)=>setValue(newValue)}
    point={false}
    handle={false}
    ranges={[
        [value,'8 0 #1367bb 1']
    ]}
    circles={[
        '8 80 #ddd 0 1',
    ]}
    rotate={180}
    reverse={true}
    labels={[
        {
            step:20,
            setting:(value)=>{
                return {
                    html:<div style={{fontSize:12,color:'#666',fontFamily:'Arial'}}>{value}</div>,
                    offset:-28,
                    fixAngle:true
                }
            }
        },
        {
            step:10,
            setting:(value)=>{
                let width,offset;
                if(value % 20 === 0){
                    width = 10;
                    offset = -12;
                }
                else {
                    width = 6;
                    offset = -10
                }
                let style = {height:1,width,background:'#444'};
                return {
                    html:<div style={style}></div>,
                    offset
                }
            }
        }
    ]}
    text={()=><div style={{fontSize:10,color:'#000',fontWeight:'bold'}}>Temperature</div>}
/>
        `)}
        </div>
    )
}
const Example5: FC = () => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>(75)
    return (
        <div style={{ fontFamily: 'Arial' }}>
            <AIOInput
                type='spinner'
                style={{ border: 'none' }}
                size={120}
                value={value}
                start={0} end={100} step={1}
                round={0.75}
                onChange={(newValue) => setValue(newValue)}
                circles={[{thickness:1,offset:60,color:'#ccc'}]}
                handle={() => {
                    return {
                        thickness: 10,
                        size: -8,
                        color: 'dodgerblue',
                        offset: 60
                    }
                }}
                point={false}
                labels={[
                    {
                        step: 10,
                        setting: (value) => {
                            return {
                                fixAngle: true,
                                offset: 16,
                                html: <div style={{ fontSize: 10, color: '#999' }}>{value}</div>
                            }
                        }
                    },
                    {
                        step: 10,
                        setting: () => {
                            return {
                                offset: 6,
                                html: <div style={{ height: 1, width: 4, background: '#333' }}></div>
                            }
                        }
                    }
                ]}
                text={() => {
                    return (
                        <div className='gauge-html'>
                            <div className='gauge-text'>{`${value}%`}</div>
                            <div className='gauge-subtext'>Metric</div>
                        </div>
                    )
                }}
            />
            {code(`
<AIOInput
    type='spinner' 
    style={{border:'none'}}
    size={120}
    value={value} 
    start={0} end={100} step={1}
    round={0.75}
    onChange={(newValue)=>setValue(newValue)}
    circles={['1 60 #ccc']}
    handle={()=>{
        return {
            thickness:10,
            size:-8,
            color:'dodgerblue',
            offset:60
        }
    }}
    point={false}
    labels={[
        {
            step:10,
            setting:(value)=>{
                return {
                    fixAngle:true,
                    offset:16,
                    html:<div style={{fontSize:10,color:'#999'}}>{value}</div>
                }
            }
        },
        {
            step:10,
            setting:()=>{
                return {
                    offset:6,
                    html:<div style={{height:1,width:4,background:'#333'}}></div>
                }
            }
        }
    ]}
    text={()=>{
        return (
            <div className='gauge-html'>
                <div className='gauge-text'>{${'`${value}%`'}}</div>
                <div className='gauge-subtext'>Metric</div>
            </div>
        )
    }}
/>
        `)}
        </div>
    )
}
const Example6: FC = () => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>(75)
    return (
        <div style={{ fontFamily: 'Arial' }}>
            <AIOInput
                type='spinner'
                style={{ border: 'none' }}
                size={200}
                value={value}
                start={0} end={180} step={1}
                round={0.75}
                onChange={(newValue) => setValue(newValue)}
                handle={() => {
                    return {
                        thickness: 4,
                        size: 80,
                        sharp: true,
                        color: '#444',
                        offset: 0
                    }
                }}
                circles={[
                    {thickness:1,offset:9,color:'#444',roundCap:true,full:true},
                    {thickness:6,offset:2,color:'#444',roundCap:true,full:true}
                ]}
                point={false}
                ranges={[
                    [70, {thickness:3,offset:0,color:'green'}],
                    [100, {thickness:3,offset:0,color:'yellow'}],
                    [140, {thickness:3,offset:0,color:'orange'}],
                    [180, {thickness:3,offset:0,color:'red'}]
                ]}
                labels={[
                    {
                        step: 10,
                        setting: (value) => {
                            let fontSize = 7, color = '#ccc', offset = -28;
                            if (value % 20 === 0) {
                                fontSize = 10; color = '#444'; offset = -30;
                            }
                            if (value >= 140) { color = 'red' }
                            return {
                                fixAngle: true,
                                offset,
                                html: <div style={{ fontSize, color }}>{value}</div>
                            }
                        }
                    },
                    {
                        step: 2,
                        setting: (value) => {
                            let width = 4, height = 1, background = '#999', offset = -18;
                            if (value % 20 === 0) {
                                width = 10; height = 3; background = '#666'; offset = -8;
                            }
                            else if (value % 10 === 0) {
                                width = 6; height = 2; background = '#888'; offset = -12;
                            }
                            if (value >= 140) { background = 'red' }
                            return {
                                offset,
                                html: <div style={{ height, width, background }}></div>
                            }
                        }
                    }
                ]}
                text={() => {
                    return (
                        <div className='gauge-html' style={{ marginTop: 110 }}>
                            <div className='gauge-text'>{`${value}`}</div>
                            <div className='gauge-subtext'>KM/H</div>
                        </div>
                    )
                }}
            />
            {code(`
<AIOInput
    type='spinner' 
    style={{border:'none'}}
    size={200}
    value={value} 
    start={0} end={180} step={1}
    round={0.75}
    onChange={(newValue)=>setValue(newValue)}
    handle={()=>{
        return {
            thickness:4,
            size:80,
            sharp:true,
            color:'#444',
            offset:0
        }
    }}
    circles={[
        '1 9 #444 1 1',
        '6 2 #444 1 1' 
    ]}
    point={false}
    ranges={[
        [70,'3 0 green'],
        [100,'3 0 yellow'],
        [140,'3 0 orange'],
        [180,'3 0 red']
    ]}
    labels={[
        {
            step:10,
            setting:(value)=>{
                let fontSize = 7,color = '#ccc',offset = -28;
                if(value % 20 === 0){
                    fontSize = 10; color = '#444'; offset = -30;
                }
                if(value >= 140){color = 'red'}
                return {
                    fixAngle:true,
                    offset,
                    html:<div style={{fontSize,color}}>{value}</div>
                }
            }
        },
        {
            step:2,
            setting:(value)=>{
                let width = 4,height = 1,background = '#999',offset = -18;
                if(value % 20 === 0){
                    width = 10; height = 3; background = '#666'; offset = -8;
                }
                else if(value % 10 === 0){
                    width = 6; height = 2; background = '#888'; offset = -12;
                }   
                if(value >= 140){background = 'red'}
                return {
                    offset,
                    html:<div style={{height,width,background}}></div>
                }
            }
        }
    ]}
    text={()=>{
        return (
            <div className='gauge-html' style={{marginTop:110}}>
                <div className='gauge-text'>{${'`${ value }`'}}</div>
                <div className='gauge-subtext'>KM/H</div>
            </div>
        )
    }}
/>
        `)}
        </div>
    )
}
const Example7: FC = () => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>(12)
    return (
        <div style={{ fontFamily: 'Arial' }}>
            <AIOInput
                type='spinner'
                style={{ border: 'none' }}
                size={120}
                value={value}
                start={0} end={14} step={1}
                round={0.75}
                onChange={(newValue) => setValue(newValue)}
                handle={() => {
                    return {
                        thickness: 16,
                        size: 52,
                        sharp: true,
                        color: '#222',
                        offset: 0
                    }
                }}
                circles={[
                    {thickness:6,offset:60,color:'#222'},
                    {thickness:8,offset:4,color:'#222',full:true} 
                ]}
                point={false}
                labels={[
                    {
                        step: 2,
                        setting: (value) => {
                            let width = 16, height = 5, background = '#333', offset = -20;
                            return {
                                offset,
                                html: <div style={{ height, width, background,borderRadius:12 }}></div>
                            }
                        }
                    }
                ]}
            />
            {code(`
<AIOInput
    type='spinner'
    style={{ border: 'none' }}
    size={120}
    value={value}
    start={0} end={14} step={1}
    round={0.75}
    onChange={(newValue) => setValue(newValue)}
    handle={() => {
        return {
            thickness: 16,
            size: 52,
            sharp: true,
            color: '#222',
            offset: 0
        }
    }}
    circles={[
        '6 60 #222 0 0',
        '8 4 #222 0 1',
        
    ]}
    point={false}
    labels={[
        {
            step: 2,
            setting: (value) => {
                let width = 16, height = 5, background = '#333', offset = -20;
                return {
                    offset,
                    html: <div style={{ height, width, background,borderRadius:12 }}></div>
                }
            }
        }
    ]}
/>
        `)}
        </div>
    )
}

const Example8: FC = () => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>(12)
    return (
        <div style={{ fontFamily: 'Arial' }}>
            <div className="p-36 bg-0">
            <AIOInput
                type='spinner'
                style={{ border: 'none',background:'#000',borderRadius:0 }}
                size={120}
                value={value}
                start={0} end={80} step={2}
                round={0.75}
                onChange={(newValue) => setValue(newValue)}
                handle={false}
                circles={[
                    {thickness:4,offset:40,color:'#333',roundCap:true,full:true},
                ]}
                point={()=>{
                    return {
                        offset:-32,
                        html:'',
                        attrs:{style:{background:'rgb(118, 255, 0)',width:6,height:6,boxShadow:'0 0 4px 1px rgb(118, 255, 0)'}}
                        
                    }
                }}
                labels={[
                    {
                        step: 2,dynamic:true,
                        setting: (labelValue) => {
                            let width = 12, height = 2, background = '#222', offset = -6;
                            let colors = [
                                "rgb(255,30,0)",
                                "rgb(255,51,0)",
                                "rgb(255,73,0)",
                                "rgb(255,94,0)",
                                "rgb(255,115,0)",
                                "rgb(255,136,0)",
                                "rgb(255,158,0)",
                                "rgb(255,179,0)",
                                "rgb(255,200,0)"
                            ]
                            if(labelValue % 10 === 0){
                                if(labelValue <= value){
                                    background = colors[labelValue / 10];
                                }
                                else{
                                    background = '#666'
                                }
                                height = 5;
                            }
                            return {
                                offset,
                                html: <div style={{ height, width, background }}></div>
                            }
                        }
                    }
                ]}
                text={()=>{
                    return (
                        <div className="flex-col relative fs-24 bold c-16 w-72 h-72 br-100 align-vh" style={{background:'radial-gradient(#333, #0c0c0c)'}}>
                            {value}
                            <div className="absolute fs-12" style={{top:90}}>TREBLE</div>
                        </div>
                    )
                }}
            />
            </div>
            {code(`
<AIOInput
    type='spinner'
    style={{ border: 'none' }}
    size={120}
    value={value}
    start={0} end={14} step={1}
    round={0.75}
    onChange={(newValue) => setValue(newValue)}
    handle={() => {
        return {
            thickness: 16,
            size: 52,
            sharp: true,
            color: '#222',
            offset: 0
        }
    }}
    circles={[
        '6 60 #222 0 0',
        '8 4 #222 0 1',
        
    ]}
    point={false}
    labels={[
        {
            step: 2,
            setting: (value) => {
                let width = 16, height = 5, background = '#333', offset = -20;
                return {
                    offset,
                    html: <div style={{ height, width, background,borderRadius:12 }}></div>
                }
            }
        }
    ]}
/>
        `)}
        </div>
    )
}