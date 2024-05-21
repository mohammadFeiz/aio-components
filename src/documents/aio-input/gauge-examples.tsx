import React, { FC, createContext, useContext, useState } from "react"
import { mdiAccount, mdiAccountArrowDown, mdiAccountBadge, mdiAccountBoxMultiple, mdiAccountCancel, mdiAccountChild, mdiAccountClock, mdiAccountSupervisorOutline, mdiHumanMale, mdiMinusThick, mdiPlusThick, mdiStar } from "@mdi/js"
import {Icon} from "@mdi/react"
import AIOInput from "../../npm/aio-input";
import AIODoc from '../../npm/aio-doc/aio-doc';
import { Storage } from "../../npm/aio-utils";
import RVD from './../../npm/react-virtual-dom/index';
const CTX = createContext({} as any)
const GaugeExamples:FC = () => {
    let [examples] = useState<any>([
        ['example1',Example1],
        ['example2',Example2],
        ['example3',Example3],
        ['example4',Example4],
        ['example5',Example5],
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
    let [setting,SetSetting] = useState<any>(new Storage('rangeexamplessetting').load('setting',{
        show:'all',showCode:false
    }))
    function setSetting(setting:any){
        new Storage('rangeexamplessetting').save('setting',setting)
        SetSetting(setting)
    }
    function changeShow(dir: 1 | -1 ){
        let index = titles.indexOf(setting.show) + dir
        if(index < 0){index = titles.length - 1 }
        if(index > titles.length - 1){index = 0}
        setSetting({...setting,show:titles[index]})
    }
    function code(code:string){
        if(!setting.showCode){return null}
        return new AIODoc().Code(code)
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
                                    type:'checkbox',text:'Show Code'
                                },
                                field:'value.showCode'
                            },
                            {
                                input:{
                                    type:'select',options:titles,before:'Show:',
                                    option:{text:'option',value:'option'},
                                    popover:{maxHeight:'100vh'}
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
                if(setting.show !== 'all' && setting.show !== title){return {}}
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
    return (
        <CTX.Provider value={{code}}>
            <RVD rootNode={{className:'h-100',column:[setting_node(),render_node()]}}/>
        </CTX.Provider>
    )   
}
export default GaugeExamples


const Example1:FC = ()=> {
    const {code}:any = useContext(CTX);
    const [value,setValue] = useState<number>(25)
    return (
        <div className='example' style={{fontFamily:'Arial'}}>
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
                    [value,`20 0 rgb(140,198,64)`],
                    [100,`20 0 #eee`]
                ]}
                text={()=>{
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
const Example2:FC = ()=> {
    const {code}:any = useContext(CTX);
    const [value,setValue] = useState<number>(75)
    return (
        <div className='example' style={{fontFamily:'Arial'}}>
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

const Example3:FC = ()=> {
    const {code}:any = useContext(CTX);
    const [value,setValue] = useState<number>(75)
    return (
        <div className='example' style={{fontFamily:'Arial'}}>
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
                    [150,`10 8 green`],
                    [200,`10 8 orange`]
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
const Example4:FC = ()=> {
    const {code}:any = useContext(CTX);
    const [value,setValue] = useState<number>(126)
    return (
        <div className='example' style={{fontFamily:'Arial'}}>
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
const Example5:FC = ()=> {
    const {code}:any = useContext(CTX);
    const [value,setValue] = useState<number>(75)
    return (
        <div className='example' style={{fontFamily:'Arial'}}>
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