import React, { FC, useState } from "react"
import { mdiAccount, mdiAccountArrowDown, mdiAccountBadge, mdiAccountBoxMultiple, mdiAccountCancel, mdiAccountChild, mdiAccountClock, mdiAccountSupervisorOutline, mdiHumanMale, mdiMinusThick, mdiPlusThick, mdiStar } from "@mdi/js"
import {Icon} from "@mdi/react"
import AIOInput from "../../npm/aio-input";
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import { Storage } from "../../npm/aio-utils";
import RVD from './../../npm/react-virtual-dom/index';

const GaugeExamples:FC = () => {
    let [examples] = useState<any>([
        ['example1',Example1],
        ['example2',Example2],
        ['example3',Example3],
        ['example4',Example4],
        ['example5',Example5],
    ])
    let [numbers] = useState<number[]>(new Array(examples.length + 1).fill(0).map((o,i)=>i - 1))
    let [setting,SetSetting] = useState<any>(new Storage('rangeexamplessetting').load('setting',{
        round:1,
        reverse:false,
        vertical:false,
        show:-1
    }))
    function setSetting(setting:any){
        new Storage('rangeexamplessetting').save('setting',setting)
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
                let [title,COMP] = o;
                if(setting.show !== -1 && setting.show !== i){return {}}
                return {
                    html:(
                        <div className='w-100'>
                            <h3>{`${i} - ${title}`}</h3>
                            <COMP setting={setting}/>
                        </div>
                    )
                }
            })
        }
    }
    return (<RVD rootNode={{className:'h-100',column:[setting_node(),render_node()]}}/>)   
}
export default GaugeExamples


function sc(setting:{round?:number,reverse:boolean,vertical:boolean}){
    let {round,reverse,vertical} = setting
    return (
`${round?`round={${round}}`:''}
${`    reverse={${reverse?'true':'false'}}`}
${`    vartical={${vertical?'true':'false'}}`}`
    )
}
const Example1:FC = ()=> {
    const [value,setValue] = useState<number>(25)
    return (
        <div className='example'>
            <AIOInput
                type='spinner' 
                size={120}
                value={value} 
                start={0} end={100} step={1}
                round={0.5}
                onChange={(newValue)=>setValue(newValue)}
                handle={false}
                point={false}
                ranges={[
                    [value,`20 rgb(140,198,64)`],
                    [100,`20 #eee`]
                ]}
                labels={{step:10,dynamic:true}}
                label={()=>{
                    return {
                        style:{fontSize:10,color:'#999'},
                        offset:8
                    }
                }}
                scales={{step:10,dynamic:true}}
                scale={()=>{
                    return {
                        style:{height:1,width:4}
                    }
                }}
                text={()=>{
                    return (
                        <div className='gauge-html'>
                            <div className='gauge-text'>{`${value}%`}</div>
                            <div className='gauge-subtext'>Metric</div>
                        </div>
                    )
                }}
            />
        {AIODoc().Code(`
<AIOInput
    type='spinner' 
    size={120}
    value={value} 
    start={0} end={100} step={1}
    round={0.5}
    onChange={(newValue)=>setValue(newValue)}
    handle={false}
    point={false}
    ranges={[
        [value,${'`20 rgb(140,198,64)`'}],
        [100,${'`20 #eee`'}]
    ]}
    labels={{step:10,dynamic:true}}
    label={()=>{
        return {
            style:{fontSize:10,color:'#999'},
            offset:8
        }
    }}
    scales={{step:10,dynamic:true}}
    scale={()=>{
        return {
            style:{height:1,width:4}
        }
    }}
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
const Example2:FC = ()=> {
    const [value,setValue] = useState<number>(75)
    return (
        <div className='example'>
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
                    [value,`20 #EE5723`],
                    [100,`20 #eee`]
                ]}
                labels={{step:10,dynamic:true}}
                label={()=>{
                    return {
                        style:{fontSize:10,color:'#999'},
                        offset:8
                    }
                }}
                scales={{step:10,dynamic:true}}
                scale={()=>{
                    return {
                        style:{height:1,width:4}
                    }
                }}
                text={()=>{
                    return (
                        <div className='gauge-html'>
                            <div className='gauge-text'>{`${value}%`}</div>
                            <div className='gauge-subtext'>Metric</div>
                        </div>
                    )
                }}
            />
        {AIODoc().Code(`
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
        [value,${'`20 #EE5723`'}],
        [100,${'`20 #eee`'}]
    ]}
    labels={{step:10,dynamic:true}}
    label={()=>{
        return {
            style:{fontSize:10,color:'#999'},
            offset:8
        }
    }}
    scales={{step:10,dynamic:true}}
    scale={()=>{
        return {
            style:{height:1,width:4}
        }
    }}
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

const Example3:FC = ()=> {
    const [value,setValue] = useState<number>(75)
    return (
        <div className='example'>
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
                        offset:5
                    }
                }}
                ranges={[
                    [150,`10 green -4`],
                    [200,`10 orange -4`]
                ]}
                circles={[
                    '2 #ccc 0',
                    '3 red -74 0 1'
                ]}
                labels={{step:25,dynamic:true}}
                label={()=>{
                    return {
                        style:{fontSize:10,color:'#999'},
                        offset:8
                    }
                }}
                scales={{step:25,dynamic:true}}
                scale={()=>{
                    return {
                        style:{height:1,width:4},
                        offset:0
                    }
                }}
                
            />
        {AIODoc().Code(`
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
            offset:5
        }
    }}
    ranges={[
        [150,${'`10 green -4`'}],
        [200,${'`10 orange -4`'}]
    ]}
    circles={[
        '2 #ccc 0',
        '3 red -74 0 1'
    ]}
    labels={{step:25,dynamic:true}}
    label={()=>{
        return {
            style:{fontSize:10,color:'#999'},
            offset:8
        }
    }}
    scales={{step:25,dynamic:true}}
    scale={()=>{
        return {
            style:{height:1,width:4},
            offset:0
        }
    }}
/>
        `)}
        </div> 
    )
}
const Example4:FC = ()=> {
    const [value,setValue] = useState<number>(126)
    return (
        <div className='example'>
            <AIOInput
                type='spinner' 
                size={200}
                value={value} 
                start={0} end={140} step={1}
                round={1}
                onChange={(newValue)=>setValue(newValue)}
                point={false}
                handle={false}
                ranges={[
                    [value,'10 #1367bb -4 1']
                ]}
                circles={[
                    '10 #ddd -4 0 1',
                ]}
                rotate={180}
                reverse={true}
                labels={{step:20,dynamic:true}}
                label={()=>{
                    return {
                        style:{fontSize:12,color:'#666',fontFamily:'Arial'},
                        offset:-50
                    }
                }}
                text={()=><div style={{fontSize:10,color:'#000',fontWeight:'bold'}}>Temperature</div>}
                scales={{step:2,dynamic:true}}
                scale={(scaleValue)=>{
                    let width,offset;
                    if(scaleValue % 20 === 0){
                        width = 10;
                        offset = -28;
                    }
                    else {
                        width = 6;
                        offset = -24
                    }
                    return {
                        style:{height:1,width,background:'#444'},
                        offset
                    }
                }}
            />
        {AIODoc().Code(`
<AIOInput
    type='spinner' 
    size={200}
    value={value} 
    start={0} end={140} step={1}
    round={1}
    onChange={(newValue)=>setValue(newValue)}
    point={false}
    handle={false}
    ranges={[
        [value,'10 #1367bb -4 1']
    ]}
    circles={[
        '10 #ddd -4 0 1',
    ]}
    rotate={180}
    reverse={true}
    labels={{step:20,dynamic:true}}
    label={()=>{
        return {
            style:{fontSize:12,color:'#666',fontFamily:'Arial'},
            offset:-50
        }
    }}
    text={()=><div style={{fontSize:10,color:'#000',fontWeight:'bold'}}>Temperature</div>}
    scales={{step:2,dynamic:true}}
    scale={(scaleValue)=>{
        let width,offset;
        if(scaleValue % 20 === 0){
            width = 10;
            offset = -28;
        }
        else {
            width = 6;
            offset = -24
        }
        return {
            style:{height:1,width,background:'#444'},
            offset
        }
    }}
/>
        `)}
        </div> 
    )
}
const Example5:FC = ()=> {
    const [value,setValue] = useState<number>(75)
    return (
        <div className='example'>
            <AIOInput
                type='spinner' 
                size={120}
                value={value} 
                start={0} end={100} step={1}
                round={0.75}
                onChange={(newValue)=>setValue(newValue)}
                handle={()=>{
                    return {
                        width:10,
                        height:-8,
                        color:'dodgerblue',
                        offset:60
                    }
                }}
                point={false}
                labels={{step:10,dynamic:true}}
                label={()=>{
                    return {
                        style:{fontSize:10,color:'#999'},
                        offset:8
                    }
                }}
                scales={{step:10,dynamic:true}}
                scale={()=>{
                    return {
                        style:{height:1,width:4}
                    }
                }}
                text={()=>{
                    return (
                        <div className='gauge-html'>
                            <div className='gauge-text'>{`${value}%`}</div>
                            <div className='gauge-subtext'>Metric</div>
                        </div>
                    )
                }}

            />
        {AIODoc().Code(`
<AIOInput
    type='spinner' 
    size={120}
    value={value} 
    start={0} end={100} step={1}
    round={0.75}
    onChange={(newValue)=>setValue(newValue)}
    handle={()=>{
        return {
            width:10,
            height:-8,
            color:'dodgerblue',
            offset:60
        }
    }}
    point={false}
    labels={{step:10,dynamic:true}}
    label={()=>{
        return {
            style:{fontSize:10,color:'#999'},
            offset:8
        }
    }}
    scales={{step:10,dynamic:true}}
    scale={()=>{
        return {
            style:{height:1,width:4}
        }
    }}
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