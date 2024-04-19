import React, { Component, useEffect, useRef, useState } from 'react';
import { Swip } from '../../npm/aio-utils/index.tsx';
import { I_Swip, I_Swip_mousePosition } from '../../npm/aio-utils/types.tsx';
import DOC from '../../resuse-components/doc.tsx';
import AIODoc from '../../npm/aio-documentation/aio-documentation.js';
import $ from 'jquery';
import AIOInput from '../../npm/aio-input/aio-input.js';
export default function DOC_AIOValidation(props) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'Basic', id: 'Basic', render: () => <Basic key='basic' /> },
                    { text: 'insideX insideY', id: 'insideXY', render: () => 
                        <Basic 
                            key='insideXY'
                            props={{insideX:true,insideY:true}} 
                            propsCode={
            `insideX:true,
            insideY:true`
                            }
                        /> 
                    },
                    { text: 'stepX stepY (boolean)', id: 'StepXYBoolean', render: () => 
                        <Basic 
                            key='stepXYBoolean'
                            props={{insideX:true,insideY:true,stepX:true,stepY:true}} 
                            propsCode={
            `insideX:true,
            insideY:true
            stepX:true,
            stepY:true`
                            }
                        /> 
                    },
                    { text: 'stepX stepY (number)', id: 'StepXYNumber', render: () => 
                        <Basic 
                            key='stepXYNumber'
                            props={{insideX:true,insideY:true,stepX:25,stepY:25}} 
                            propsCode={
            `insideX:true,
            insideY:true
            stepX:25,
            stepY:25`
                            }
                        /> 
                    },
                    { text: 'speedX speedY', id: 'speedXY', render: () => 
                        <Basic 
                            key='speedXY'
                            props={{insideX:true,insideY:true,speedX:2,speedY:2}} 
                            propsCode={
            `insideX:true,
            insideY:true
            speedX:2,
            speedY:2`
                            }
                        /> 
                    },
                    { text: 'reverseX reverseY', id: 'reverseXY', render: () => 
                        <Basic 
                            key='reverseXY'
                            left={200}
                            top={200}
                            props={{insideX:true,insideY:true,reverseX:2,reverseY:2}} 
                            propsCode={
            `insideX:true,
            insideY:true
            reverseX:true,
            reverseY:true`
                            }
                        />
                    },
                    { text: 'minX minY maxX maxY', id: 'minmax', render: () => 
                        <Basic 
                            key='minmax'
                            props={{insideX:true,insideY:true,minX:100,maxX:300,minY:100,maxY:300}} 
                            propsCode={
            `insideX:true,
            insideY:true
            minX:100,
            minY:100,
            maxX:300,
            maxY:300`
                    }
                /> 
                    },
                    { text: 'multi use', id: 'multiuse', render: () => <MultiUse /> },
                    { text: 'id', id: 'id', render: () => <Id /> },
                    { text: 'mousePopsition', id: 'mousePostion', render: () => <MousePosition /> },
                ]
            }}
        />
    )
}

function Basic(p:{props?:{[key in keyof I_Swip ]?:any},propsCode?:string,left?:number,top?:number}) {
    let {props = {},propsCode = ''} = p;
    let [left, setLeft] = useState<number>(p.left || 0)
    let [top, setTop] = useState<number>(p.top || 0)
    let ref = useRef({left,top});
    ref.current = {left,top}
    function bindSwip() {
        new Swip({
            dom: () => $('.box'),
            parent:()=>$('.parent'),
            start: () => [ref.current.left, ref.current.top],
            move: ({ change }) => {
                setLeft(change.x)
                setTop(change.y)
            },
            ...props
        })

    }
    useEffect(() => {
        bindSwip()
    }, [])
    return (
        <div className='example'>
            <div className='parent' style={{ background: 'yellow', width: '100%', height: 500, position: 'relative', flexShrink: 0 }}>
                <div className='box' style={{ position: 'absolute', width: 50, height: 50, left, top, background: 'red' }}></div>
            </div>
            {
                AIODoc().Code(`
function Example(){
    let [left, setLeft] = useState<number>(0)
    let [top, setTop] = useState<number>(0)
    let ref = useRef({left,top});
    ref.current = {left,top}
    function bindSwip() {
        new Swip({
            dom: () => $('.box'),
            parent:()=>$('.parent'),
            start: () => [ref.current.left, ref.current.top],
            move: ({ change }) => {
                setLeft(change.x)
                setTop(change.y)
            },
            ${propsCode}
        })

    }
    useEffect(() => {
        bindSwip()
    }, [])
    return (
        <div className='example'>
            <div className='parent' style={{ background: 'yellow', width: '100%', height: 500, position: 'relative', flexShrink: 0 }}>
                <div className='box' style={{ position: 'absolute', width: 50, height: 50, left, top, background: 'red' }}></div>
            </div>
        </div>
    )
}
                    `)
            }
        </div>
    )
}
function MultiUse() {
    let [boxes, setBoxes] = useState<{ left: number, top: number }[]>([{ left: 100, top: 100 }, { left: 200, top: 100 }, { left: 300, top: 100 }])
    let ref = useRef(boxes)
    ref.current = boxes;
    function bindSwip() {
        for (let i = 0; i < boxes.length; i++) {
            new Swip({
                dom: () => $('.box-' + i),
                parent:()=> $('.parent'),
                start: () => {
                    let { left, top } = ref.current[i];
                    return [left, top]
                },
                move: ({ change }) => {
                    setBoxes(ref.current.map((o,index)=>index === i?{left:change.x,top:change.y}:o))
                }
            })
        }


    }
    useEffect(() => {
        bindSwip()
    }, [])
    return (
        <div className='example'>
            <div className='parent' style={{ background: 'yellow', width: '100%', height: 500, flex: 1, position: 'relative' }}>
                {boxes.map(({ left, top }, i) => {
                    return (
                        <div key={i} className={`box box-${i}`} style={{ position: 'absolute', width: 50, height: 50, left, top, background: 'red' }}></div>
                    )
                })}

            </div>
            {
                AIODoc().Code(`
function Example(){
    let [boxes, setBoxes] = useState<{ left: number, top: number }[]>([{ left: 100, top: 100 }, { left: 200, top: 100 }, { left: 300, top: 100 }])
    let ref = useRef(boxes)
    ref.current = boxes;
    function bindSwip() {
        for (let i = 0; i < boxes.length; i++) {
            new Swip({
                dom: () => $('.box-' + i),
                parent:()=> $('.parent'),
                start: () => {
                    let { left, top } = ref.current[i];
                    return [left, top]
                },
                move: ({ change }) => {
                    this.setBoxes(ref.current.map((o,index)=>index === i?{left:change.x,top:change.y}:o))
                }
            })
        }
    }
    useEffect(() => {
        bindSwip()
    }, [])
    return (
        <div className='example'>
            <div className='parent' style={{ background: 'yellow', width: '100%', height: 500, flex: 1, position: 'relative' }}>
                {boxes.map(({ left, top }, i) => {
                    return (
                        <div key={i} className={"box box" + i} style={{ position: 'absolute', width: 50, height: 50, left, top, background: 'red' }}></div>
                    )
                })}
            </div>
        </div>
    )
}  
                    `)
            }
        </div>
    )
}
function Id() {
    let [boxes, setBoxes] = useState([
        { left: 100, top: 100, id: '0' }, 
        { left: 200, top: 100, id: '1' }, 
        { left: 300, top: 100, id: '2' }
    ])
    let ref = useRef(boxes)
    ref.current = boxes;
    function bindSwip() {
        for (let i = 0; i < ref.current.length; i++) {
            let box = ref.current[i]
            new Swip({
                dom: () => $('.box-' + box.id),
                parent: () => $('.parent'),
                start: () => {
                    let { left, top } = ref.current.find((o) => o.id === box.id);
                    return [left, top]
                },
                move: ({ change }) => {
                    setBoxes(ref.current.map((o)=>o.id === box.id?{...o,left:change.x,top:change.y}:o))
                }

            })
        }
    }
    useEffect(() => {
        bindSwip()
    }, [])
    return (
        <div className='example'>
            <div className='parent' style={{ background: 'yellow', width: '100%', height: 500, flex: 1, position: 'relative' }}>
                {boxes.map(({ left, top, id }) => {
                    return (
                        <div key={id} className={`box box-${id}`} style={{ position: 'absolute', width: 50, height: 50, left, top, background: 'red' }}></div>
                    )
                })}

            </div>
            {
                AIODoc().Code(`
function Example(){
    let [boxes, setBoxes] = useState([
        { left: 100, top: 100, id: '0' }, 
        { left: 200, top: 100, id: '1' }, 
        { left: 300, top: 100, id: '2' }
    ])
    let ref = useRef(boxes)
    ref.current = boxes;
    function bindSwip() {
        for (let i = 0; i < ref.current.length; i++) {
            let box = ref.current[i]
            new Swip({
                dom: () => $('.box-' + box.id),
                parent: () => $('.parent'),
                start: () => {
                    let { left, top } = ref.current.find((o) => o.id === box.id);
                    return [left, top]
                },
                move: ({ change }) => {
                    setBoxes(ref.current.map((o)=>o.id === box.id?{...o,left:change.x,top:change.y}:o))
                }

            })
        }
    }
    useEffect(() => {
        bindSwip()
    }, [])
    return (
        <div className='example'>
            <div className='parent' style={{ background: 'yellow', width: '100%', height: 500, flex: 1, position: 'relative' }}>
                {boxes.map(({ left, top, id }) => {
                    return (
                        <div key={id} className={"box box" + id} style={{ position: 'absolute', width: 50, height: 50, left, top, background: 'red' }}></div>
                    )
                })}
            </div>
        </div>
    )
} 
                    `)
            }
        </div>
    )
}
function MousePosition() {
    let [mousePosition, setMousePosition] = useState<I_Swip_mousePosition>({x:0,y:0,clientX:0,clientY:0,xp:0,yp:0})
    function bindSwip() {
        new Swip({
            dom: () => $('.parent'),
            page:()=>$('.example'),
            start: ({ mousePosition }) => {
                setMousePosition(mousePosition)
                return [0, 0]
            },
            move: ({ mousePosition }) => {
                setMousePosition(mousePosition)
            }
        })
    }
    useEffect(() => {
        bindSwip()
    }, [])
    let style = { background: 'dodgerblue', color: '#fff', padding: '0 6px', margin: 3, width: 110, fontSize: 12 }
    return (
        <div className='example'>
            <>
                <div className='parent' style={{ border: '1px solid', width: 500, height: 500, flex: 1, position: 'relative' }}></div>
                <div style={{ display: 'flex' }}>
                    <span style={style}>{`x : ${mousePosition.x}`}</span>
                    <span style={style}>{`y : ${mousePosition.y}`}</span>
                    <span style={style}>{`clientX : ${mousePosition.clientY}`}</span>
                    <span style={style}>{`clientY : ${mousePosition.clientX}`}</span>
                    <span style={style}>{`xp : ${mousePosition.xp} %`}</span>
                    <span style={style}>{`yp : ${mousePosition.yp} %`}</span>
                </div>
            </>
            {
                AIODoc().Code(`
import React,{Component} from 'react';
import Swip from 'aio-swip';

class Example1 extends Component{
    constructor(props){
        super(props);
        this.state = {mousePosition:{}}
    }
    componentDidMount(){
        Swip({
            dom:$('.parent'),
            start:({mousePosition})=>{
                this.setState({mousePosition});
                return [0,0]
            },
            move:({mousePosition})=>{
                this.setState({mousePosition})
            }
        })
    }
    render(){
        let {left,top,view} = this.state;
        return (
            <>
                <div className='parent' style={{border:'1px solid',width:500,height:500,flex:1,position:'relative'}}></div>
                <div style={{display:'flex'}}>
                    <span className='tag'>{'x : ' + mousePosition.x}</span>
                    <span className='tag'>{'y : ' + mousePosition.x}</span>
                    <span className='tag'>{'clientX : ' + mousePosition.clientY}</span>
                    <span className='tag'>{'clientY : ' + mousePosition.clientX}</span>
                    <span className='tag'>{'xp : ' + mousePosition.xp + ' %'}</span>
                    <span className='tag'>{'yp : ' + mousePosition.yp + ' %'}</span>
                </div>
            </>
        )
    }
}                    
                    `)
            }
        </div>
    )
}






