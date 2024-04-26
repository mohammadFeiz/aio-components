import React from "react"
import { mdiAccount, mdiAccountArrowDown, mdiAccountBadge, mdiAccountBoxMultiple, mdiAccountCancel, mdiAccountChild, mdiAccountClock, mdiAccountSupervisorOutline, mdiHumanMale } from "@mdi/js"
import {Icon} from "@mdi/react"

export default function RangeExamples({pinch,reverse}){
    let index = 28;
    return [
        {
            title:'start step end',
            props:{reverse:!!reverse,pinch:!!pinch,start:0,end:100,step:1,labels:{step:10}},
            code:
    `start={0} 
    end={100} 
    step={1}
    ${pinch?'pinch={true}':''}`
        },
        {
            title:'label (step)',
            props:{
                reverse:!!reverse,pinch:!!pinch,start:0,end:8,
                labels:{
                    step:1
                }
            },
            code:
    `start={0}
    end={8}
    labels={{
        step:1
    }}
    ${pinch?'pinch={true}':''}
    ${reverse?'reverse={true}':''}`
        },
        {
            title:'label (attrs)',
            props:{
                reverse:!!reverse,pinch:!!pinch,start:0,end:8,
                labels:{step:1},
                label:(value)=>{
                    return {
                        attrs:{
                            style:{fontSize:14,fontWeight:'bold',color:value === 5?'red':'#000'}
                        }
                    }
                }
                
            },
            code:`
        start={0}
        end={8}
        labels={{step:1}},
        label={(value)=>{
            return {
                attrs:{
                    style:{fontSize:14,fontWeight:'bold',color:value === 5?'red':'#000'}
                }
            }
        }}
        ${pinch?'pinch={true}':''}
        ${reverse?'reverse={true}':''}`
        },
        {
            title:'label (html)',
            props:{
                reverse:!!reverse,pinch:!!pinch,start:0,end:8,
                labels:{step:1},
                label:(value)=>{
                    return {
                        html:value === 5?<Icon path={mdiAccount} size={0.6}/>:value
                    }
                }
            },
            code:
    `start={0}
    end={8}
    labels={{step:1}}
    label={(value)=>{
        return {
            html:value === 5?<Icon path={mdiAccount} size={0.6}/>:value
        }
    }}
    ${pinch?'pinch={true}':''}
    ${reverse?'reverse={true}':''}`
        },
        {
            title:'label (offset)',
            props:{
                reverse:!!reverse,pinch:!!pinch,start:0,end:8,
                labels:{step:1},
                label:()=>{
                    return {offset:-20}
                }
            },
            code:
    `start={0}
    end={8}
    labels={{step:1}}
    label={()=>{
        return {offset:-20}
    }}
    ${pinch?'pinch={true}':''}
    ${reverse?'reverse={true}':''}`
        },
        {
            title:'label (list)',
            props:{
                reverse:!!reverse,pinch:!!pinch,start:0,end:8,
                labels:{list:[1,2,5]}
            },
            code:
    `start={0}
    end={8}
    labels={{
        list:[1,2,5]
    }}
    ${pinch?'pinch={true}':''}
    ${reverse?'reverse={true}':''}`
        },
        {
            title:'scale (step)',
            props:{reverse:!!reverse,pinch:!!pinch,step:5,start:0,end:100,scales:{step:5}},
            code:
    `start={0}
    end={100}
    step={5}
    scales={{
        step:5
    }}
    ${pinch?'pinch={true}':''}
    ${reverse?'reverse={true}':''}`
        },
        {
            title:'scale (attrs)',
            props:{
                reverse:!!reverse,pinch:!!pinch,step:5,start:0,end:60,scales:{step:1},
                scale:(value)=>{
                    let width,height;
                    if(value % 10 === 0){height = 12; width = 3}
                    else if(value % 5 === 0){height = 8; width = 2}
                    else {height = 4; width = 1}
                    let background = value >= 40?'red':'#333'   
                    return {
                        attrs:{
                            style:{width:pinch?height:width,height:pinch?width:height,background}
                        }
                    }  
                }
            },
            code:
    `start={0}
    end={60}
    step={5}
    scale={(value)=>{
        let width,height;
        if(value % 10 === 0){height = 12; width = 3}
        else if(value % 5 === 0){height = 8; width = 2}
        else {height = 4; width = 1}
        let background = value >= 40?'red':'#333'   
        return {
            attrs:{
                style:{width:pinch?height:width,height:pinch?width:height,background}
            }
        }  
    }}
    ${pinch?'pinch={true}':''}
    ${reverse?'reverse={true}':''}`
        },
        {
            title:'scale (style object)',
            props:{
                pinch:!!pinch,reverse:!!reverse,
                step:5,
                start:0,
                end:60,
                scales:{step:1},
                scale:(value)=>{
                    let height,width;
                    if(value % 10 === 0){height = 8; width = 3}
                    else if(value % 5 === 0){height = 5; width = 2}
                    else {height = 2; width = 1}
                    let background = value >= 40?'red':'#333'
                    return {
                        style:{width:pinch?height:width,height:pinch?width:height,background}
                    }
                }
            },
            code:
    `step={5}
    start={0}
    end={60}
    scales={{step:1}}
    scale={(value)=>{
        let height,width;
        if(value % 10 === 0){${pinch?'width':'height'} = 8; ${pinch?'height':'width'} = 3}
        else if(value % 5 === 0){${pinch?'width':'height'} = 5; ${pinch?'height':'width'} = 2}
        else {${pinch?'width':'height'} = 2; ${pinch?'height':'width'} = 1}
        let background = value >= 40?'red':'#333'
        return {
            style:{width,height,background}
        }
    }}
    ${pinch?'pinch={true}':''}
    ${reverse?'reverse={true}':''}`
        },
        {
            title:'scale (className string)',
            props:{
                pinch:!!pinch,reverse:!!reverse,
                step:5,
                start:0,
                end:60,
                scales:{step:1},
                scale:(value)=>{
                    let className = ''
                    if(value % 10 === 0){className = `${pinch?'pinch':'slider'}-scale-large`}
                    else if(value % 5 === 0){className = `${pinch?'pinch':'slider'}-scale-medium`}
                    else {className = `${pinch?'pinch':'slider'}-scale-small`}
                    className += value >= 40?` ${pinch?'pinch':'slider'}-scale-red`:''
                    return {className}
                }
            },
            code:
    `step={5}
    start={0}
    end={60}
    scales={{step:1}}
    scale={(value)=>{
        let className = ''
        if(value % 10 === 0){className = '${pinch?'pinch':'slider'}-scale-large'}
        else if(value % 5 === 0){className = '${pinch?'pinch':'slider'}-scale-medium'}
        else {className = '${pinch?'pinch':'slider'}-scale-small'}
        className += value >= 40?' ${pinch?'pinch':'slider'}-scale-red':''
        return {className}
    }}
    ${pinch?'pinch={true}':''}
    ${reverse?'reverse={true}':''}`
        },
        {
            title:'scale (offset)',
            props:{reverse:!!reverse,pinch:!!pinch,step:5,start:0,end:100,scales:{step:5},scale:()=>{return {offset:-10}}},
            code:
        `start={0}
        end={100}
        step={5}
        scales={{step:5}}
        scale={()=>{
            return {offset:-10}
        }}
        ${reverse?'reverse={true}':''}
        ${pinch?'pinch={true}':''}`
        },
        {
            title:'scale (list)',
            props:{reverse:!!reverse,pinch:!!pinch,start:0,end:100,scales:{list:[20,40,60,80]}},
            code:
        `start={0}
        end={100}
        step={5}
        scales={{
            list:[20,40,60,80]
        }}
        ${reverse?'reverse={true}':''}
        ${pinch?'pinch={true}':''}`
        },
        {
            title:'scale(html)',
            props:{
                reverse:!!reverse,pinch:!!pinch,
                style:{margin:36},
                start:0,
                end:8,    
                scales:{step:1},
                scale:(value,{angle})=>{
                    return {
                        style:{
                            width:24,height:24,background:'none',
                            transform:!pinch?undefined:`rotate(${-angle}deg)`
                        },
                        html:<Icon 
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
                    }
                }
            },
            code:
        `style={{margin:36}}
        start={0}
        end={8},   
        scales={{step:1}}
        scale={(value,{angle})=>{
            return {
                style:{
                    width:24,height:24,background:'none',
                    transform:type === 'slider'?undefined:${'`rotate(${-angle}deg)`'}
                },
                html:<Icon 
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
            }
        }}
        ${reverse?'reverse={true}':''}
        ${pinch?'pinch={true}':''}`
        },
        {
            title:'handle (attrs)',show:()=>!!pinch,
            props:{
                pinch:true,
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
    `pinch={true}
    start={0}
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
            title:'handle (false)',show:()=>!!pinch,
            props:{
                pinch:true,
                start:0,
                end:24,
                handle:false
            },
            code:
    `pinch={true}
    start={0}
    end={24}
    handle={false}`
        },
        {
            title:'point (attrs)',
            props:{
                reverse:!!reverse,
                pinch:!!pinch,
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
    }}
    ${reverse?'reverse={true}':''}
    ${pinch?'pinch={true}':''}`
        },
        {
            title:'point (html)',
            props:{
                reverse:!!reverse,
                pinch:!!pinch,
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
    }}
    ${reverse?'reverse={true}':''}
    ${pinch?'pinch={true}':''}`
        },
        {
            title:'point (offset)',
            props:{
                reverse:!!reverse,
                pinch:!!pinch,
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
    }}
    ${reverse?'reverse={true}':''}
    ${pinch?'pinch={true}':''}`
        },
        {
            title:'point (false)',
            props:{
                reverse:!!reverse,
                pinch:!!pinch,
                start:0,
                end:24,
                point:false
            },
            code:
    `start={0}
    end={24}
    point={false}
    ${reverse?'reverse={true}':''}
    ${pinch?'pinch={true}':''}`
        },
        {
            title:'disabled',show:()=>!pinch,
            props:{
                reverse:!!reverse,pinch:!!pinch,
                attrs:{style:{margin:12}},
                start:0,
                end:12,
                disabled:[4,6,7,10,11],
                point:false,
                scales:{step:1},
                scale:(value,{disabled})=>{
                    return {
                        style:{width:6,height:6,background:disabled?'red':'#000'}
                    }
                },
                labels:{
                    step:1,
                    dynamic:true
                },
                label:(val,{disabled,value})=>{
                    let active = val === value
                    let color;
                    if(disabled){color = 'red'}
                    else if(active){color = '#fff'}
                    else {color = '#00ff00'}
                    let style = {
                        width:40,
                        padding:active?'2px 6px':0,
                        fontSize:10,
                        fontWeight:active?'bold':undefined,
                        background:active?'dodgerblue':undefined,
                        color,
                        fontFamily:'arial',
                    }
                    return {
                        offset:16,
                        style,
                        html:`${val}:00`
                    }
                }
            },
            code:
        `attrs={{style:{margin:12}}}
        start={0}
        end={12}
        disabled={[4,6,7,10,11]}
        point={false}
        scales:{step:1},
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
            let style = {
                width:40,
                padding:active?'2px 6px':0,
                fontSize:10,
                fontWeight:active?'bold':undefined,
                background:active?'dodgerblue':undefined,
                color,
                fontFamily:'arial',
            }
            return {
                offset:16,
                style,
                html:${'`${value}:00`'}
            }
        }}
        ${pinch?'pinch={true}':''}
        ${reverse?'reverse={true}':''}`
        },
        {
            title:'disabled',show:()=>!!pinch,
            props:{
                pinch:true,
                attrs:{style:{margin:48}},
                start:0,
                end:12,
                //rotate:180,
                disabled:[4,6,7,10,11],
                point:false,
                rotate:180,
                scales:{step:1},
                scale:(value,{disabled})=>{
                    return {
                        attrs:{
                            style:{width:6,height:6,background:disabled?'red':'#000'}
                        }
                    }
                },
                labels:{
                    step:1,
                    dynamic:true
                },
                label:(val,{disabled,angle,value})=>{
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
                        style,
                        html:`${val}:00`
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
        `pinch={true}
        attrs={{style:{border:'2px solid #000',margin:48}}}
        start={0}
        end={12}
        rotate={180}
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
            title:'circles',show:()=>!!pinch,
            props:{
                pinch:true,
                start:0,
                end:100,
                circles:[
                    '12 24 #aaa',
                    '26 2 #999',  
                ]
            },
            code:
    `pinch={true}
    start={0}
    end={100}
    circles={[
        '30 2 #333',
        '20 2 #777'
    ]}`
        },
        {
            title:'rotate (-180 deg)',show:()=>!!pinch,
            props:{
                pinch:true,
                start:0,
                end:100,
                rotate:-180,
                labels:{step:10},
                label:()=>{
                    return {offset:0}
                }
            },
            code:
    `pinch={true}
    start={0}
    end={100}
    label={{step:10,offset:0}}
    rotate={-180}`
        },
        {
            title:'round (0 to 1)',show:()=>!!pinch,
            props:{
                pinch:true,
                start:0,
                end:100,
                round:0.75,
                labels:{step:10},
                label:()=>{
                    return {
                        offset:10
                    }
                }
            },
            code:
    `pinch={true}
    start={0}
    end={100}
    rotate:180,
    round={0.5}
    label:{step:10,offset:0}`
        },
        {
            title:'round (0 to 1)',show:()=>!!pinch,
            props:{
                pinch:true,
                start:0,
                end:100,
                round:0.5,
                labels:{step:10},
                label:()=>{
                    return {
                        offset:10
                    }
                }
            },
            code:
    `pinch={true}
    start={0}
    end={100}
    rotate:180,
    round={0.5}
    label:{step:10,offset:0}`
        },
        {
            title:'round (0 to 1)',show:()=>!!pinch,
            props:{
                pinch:true,
                start:0,
                end:100,
                round:0.25,
                labels:{step:20},
                label:()=>{
                    return {
                        offset:0
                    }
                }
            },
            code:
    `pinch={true}
    start={0}
    end={100}
    round={0.25}
    label:{step:10,offset:0}`
        },
        {
            title:'ranges (array on strings)',
            props:{
                reverse:!!reverse,
                pinch:!!pinch,
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
    ]}
    ${reverse?'reverse={true}':''}
    ${pinch?'pinch={true}':''}`
        },
        {
            title:'ranges (function returns array of strings)',
            props:{
                reverse:!!reverse,
                pinch:!!pinch,
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
                        html:value,
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
            ${pinch?'offset:-15,':''}
        }
    }}
    ranges={(value)=>{
        return [
            value + '4 dodgerblue',
            '100 5 #f8f8f8'
        ]
    }}
    ${reverse?'reverse={true}':''}
    ${pinch?'pinch={true}':''}`
        },
        {
            title:'multiple',
            initialValue:[0,4],
            props:{reverse:!!reverse,pinch:!!pinch,start:0,end:100,step:1,multiple:true},
            code:
    `start={0} 
    end={100} 
    step={2}
    ${pinch?'pinch={true}':''}`
        }
        
    ].map((o,i)=>{
        return {...o,title:i + ' - ' + o.title}
    }).filter((o,i)=>{
        if(index === undefined){return true}
        return index === i
    })
}
