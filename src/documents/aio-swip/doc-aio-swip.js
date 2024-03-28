import React,{Component} from 'react';
import {Swip} from '../../npm/aio-utils/aio-utils';
import DOC from '../../resuse-components/doc.tsx';
import AIODoc from './../../npm/aio-documentation/aio-documentation';
import $ from 'jquery';
import AIOInput from '../../npm/aio-input/aio-input';
export default class DOC_AIOValidation extends Component{
    constructor(props){
        super(props);
        this.state = {operator:'date<',value:'1401/4/6',label:'value',lang:'fa',target:'1401/4/4'}
    }
    
    render(){
        return (
            <DOC
                {...this.props}
                nav={{
                    items:[
                        {text:'start() , move() , end()',id:'startmoveend',render:()=><StartMoveEnd/>},
                        {text:'stepX , stepY',id:'stepX StepY',render:()=><StepXStepY/>},
                        {text:'speedX , speedY',id:'speedX speedY',render:()=><SpeedXSpeedY/>},
                        {text:'reverseX , reverseY',id:'reverseX reverseY',render:()=><ReverseXReverseY/>},
                        {text:'minX,minY,maxX,maxY',id:'minmax',render:()=><MinMax/>},
                        {text:'multi use',id:'multiuse',render:()=><MultiUse/>},
                        {text:'id',id:'id',render:()=><Id/>},
                        {text:'mousePopsition',id:'mousePostion',render:()=><MousePosition/>},
                    ]
                }}
            />
        )
    }
}

class StartMoveEnd extends Component{
    constructor(props){
        super(props);
        this.state = {left:0,top:0}
    }
    componentDidMount(){this.bindSwip();}
    bindSwip(){
        Swip({
            dom:()=>$('.box'),
            parent:'.parent',
            start:()=>{
                let {left,top} = this.state;
                return [left,top]
            },
            move:({dx,dy,x,y})=>{
                this.changePosition(x,y)
            },
            end:()=>{
                let {left,top} = this.state;
                this.changePosition(Math.round(left / 50) * 50,Math.round(top / 50) * 50)
            }
        })
    }
    changePosition(left,top){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        this.setState({left,top})
    }
    render(){
        let {left,top} = this.state;
        return (
            <div className='example'>
                <div className='parent' style={{background:'yellow',width:'100%',height:500,position:'relative',flexShtink:0}}>
                    <div className='box' style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                </div>
                {
                    AIODoc().Code(`
import React,{Component} from 'react';
import {Swip} from 'aio-utils';

class Example1 extends Component{
    constructor(props){
        super(props);
        this.state = {left:0,top:0}
    }
    componentDidMount(){
        Swip({
            dom:$('.box'),
            start:()=>{
                let {left,top} = this.state;
                this.left = left; this.top = top
            },
            move:({dx,dy})=>this.changePosition(this.left + dx,this.top + dy),
            end:()=>{
                let {left,top} = this.state;
                this.changePosition(Math.round(left / 50) * 50,Math.round(top / 50) * 50)
            }
        })
    }
    changePosition(left,top){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        this.setState({left,top})
    }
    render(){
        let {left,top,view} = this.state;
        return (
            <div className='parent'>
                <div className='box'></div>
            </div>
        )
    }
}                    
                    `)
                }
            </div>
        )
    }
}
class StepXStepY extends Component{
    constructor(props){
        super(props);
        this.state = {left:0,top:0}
    }
    componentDidMount(){this.bindSwip();}
    bindSwip(){
        Swip({
            dom:()=>$('.box'),
            start:()=>{
                let {left,top} = this.state;
                return [left,top]
            },
            move:({dx,dy,x,y})=>{
                this.changePosition(x,y)
            },
            stepX:50,
            stepY:50
        })
    }
    changePosition(left,top){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        this.setState({left,top})
    }
    render(){
        let {left,top} = this.state;
        return (
            <div className='example'>
                <div className='parent' style={{background:'yellow',width:'100%',height:500,position:'relative',left:0,top:0}}>
                    <div className='box' style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                </div>
                {
                    AIODoc().Code(`
import React,{Component} from 'react';
import {Swip} from 'aio-utils';

class Example1 extends Component{
    constructor(props){
        super(props);
        this.state = {left:0,top:0}
    }
    componentDidMount(){
        Swip({
            dom:$('.box'),
            start:()=>{
                let {left,top} = this.state;
                this.left = left; this.top = top
            },
            move:({dx,dy})=>{
                this.changePosition(this.left + dx,this.top + dy)
            },
            end:()=>{
                let {left,top} = this.state;
                this.changePosition(Math.round(left / 50) * 50,Math.round(top / 50) * 50)
            },
            stepX:50,
            stepY:50
        })
    }
    changePosition(left,top){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        this.setState({left,top})
    }
    render(){
        let {left,top,view} = this.state;
        return (
            <div 
                className='parent' 
                style={{
                    background:'yellow',
                    width:'100%',
                    height:'100%',
                    position:'relative',
                    left:0,
                    top:0
                }}>
                <div 
                    className='box' 
                        style={{
                            position:'absolute',
                            width:50,
                            height:50,
                            left,
                            top,
                            background:'red'
                        }}
                ></div>
            </div>
        )
    }
}                    
                    `)
                }
            </div>
        )
    }
}
class SpeedXSpeedY extends Component{
    constructor(props){
        super(props);
        this.state = {left:0,top:0}
    }
    componentDidMount(){this.bindSwip();}
    bindSwip(){
        Swip({
            dom:()=>$('.box'),
            start:()=>{
                let {left,top} = this.state;
                return [left,top]
            },
            move:({dx,dy,x,y})=>{
                this.changePosition(x,y)
            },
            speedX:3,
            speedY:3
        })
    }
    changePosition(left,top){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        this.setState({left,top})
    }
    render(){
        let {left,top} = this.state;
        return (
            <div className='example'>
                <div className='parent' style={{background:'yellow',width:'100%',height:500,position:'relative',left:0,top:0}}>
                    <div className='box' style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                </div>
                {
                    AIODoc().Code(`
import React,{Component} from 'react';
import Swip from 'aio-swip';

class Example1 extends Component{
    constructor(props){
        super(props);
        this.state = {left:0,top:0}
    }
    componentDidMount(){
        Swip({
            dom:$('.box'),
            start:()=>{
                let {left,top} = this.state;
                this.left = left; this.top = top
            },
            move:({dx,dy})=>{
                this.changePosition(this.left + dx,this.top + dy)
            },
            end:()=>{
                let {left,top} = this.state;
                this.changePosition(Math.round(left / 50) * 50,Math.round(top / 50) * 50)
            },
            speedX:3,
            speedY:3
        })
    }
    changePosition(left,top){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        this.setState({left,top})
    }
    render(){
        let {left,top,view} = this.state;
        return (
            <div 
                className='parent' 
                style={{
                    background:'yellow',
                    width:'100%',
                    height:'100%',
                    position:'relative',
                    left:0,
                    top:0
                }}>
                <div 
                    className='box' 
                        style={{
                            position:'absolute',
                            width:50,
                            height:50,
                            left,
                            top,
                            background:'red'
                        }}
                ></div>
            </div>
        )
    }
}                    
                    `)
                }
            </div>
        )
    }
}
class ReverseXReverseY extends Component{
    constructor(props){
        super(props);
        this.state = {left:200,top:200}
    }
    componentDidMount(){this.bindSwip();}
    bindSwip(){
        Swip({
            dom:()=>$('.box'),
            start:()=>{
                let {left,top} = this.state;
                return [left,top]
            },
            move:({dx,dy,x,y})=>{
                this.changePosition(x,y)
            },
            reverseX:true,
            reverseY:true
        })
    }
    changePosition(left,top){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        this.setState({left,top})
    }
    render(){
        let {left,top} = this.state;
        return (
            <div className='example'>
                <div className='parent' style={{background:'yellow',width:'100%',height:500,position:'relative',left:0,top:0}}>
                    <div className='box' style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                </div>
                {
                    AIODoc().Code(`
import React,{Component} from 'react';
import Swip from 'aio-swip';

class Example1 extends Component{
    constructor(props){
        super(props);
        this.state = {left:200,top:200}
    }
    componentDidMount(){
        Swip({
            dom:$('.box'),
            start:()=>{
                let {left,top} = this.state;
                this.left = left; this.top = top
            },
            move:({dx,dy})=>{
                this.changePosition(this.left + dx,this.top + dy)
            },
            end:()=>{
                let {left,top} = this.state;
                this.changePosition(Math.round(left / 50) * 50,Math.round(top / 50) * 50)
            },
            reverseX:3,
            reverseY:3
        })
    }
    changePosition(left,top){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        this.setState({left,top})
    }
    render(){
        let {left,top,view} = this.state;
        return (
            <div 
                className='parent' 
                style={{
                    background:'yellow',
                    width:'100%',
                    height:'100%',
                    position:'relative',
                    left:0,
                    top:0
                }}>
                <div 
                    className='box' 
                        style={{
                            position:'absolute',
                            width:50,
                            height:50,
                            left,
                            top,
                            background:'red'
                        }}
                ></div>
            </div>
        )
    }
}                    
                    `)
                }
            </div>
        )
    }
}
class MinMax extends Component{
    constructor(props){
        super(props);
        this.state = {left:200,top:200}
    }
    componentDidMount(){this.bindSwip();}
    bindSwip(){
        Swip({
            dom:()=>$('.box'),
            start:()=>{
                let {left,top} = this.state;
                return [left,top]
            },
            move:({dx,dy,x,y})=>{
                this.changePosition(x,y)
            },
            minX:100,
            maxX:300,
            minY:100,
            maxY:300
        })
    }
    changePosition(left,top){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        this.setState({left,top})
    }
    render(){
        let {left,top} = this.state;
        return (
            <div className='example'>
                <div className='parent' style={{background:'yellow',width:'100%',height:500,position:'relative',left:0,top:0}}>
                    <div className='box' style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                </div>
                {
                    AIODoc().Code(`
import React,{Component} from 'react';
import Swip from 'aio-swip';

class Example1 extends Component{
    constructor(props){
        super(props);
        this.state = {left:200,top:200}
    }
    componentDidMount(){
        Swip({
            dom:$('.box'),
            start:()=>{
                let {left,top} = this.state;
                this.left = left; this.top = top
            },
            move:({dx,dy})=>{
                this.changePosition(this.left + dx,this.top + dy)
            },
            end:()=>{
                let {left,top} = this.state;
                this.changePosition(Math.round(left / 50) * 50,Math.round(top / 50) * 50)
            },
            minX:100,
            maxX:300,
            minY:100,
            maxY:300
        })
    }
    changePosition(left,top){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        this.setState({left,top})
    }
    render(){
        let {left,top,view} = this.state;
        return (
            <div 
                className='parent' 
                style={{
                    background:'yellow',
                    width:'100%',
                    height:'100%',
                    position:'relative',
                    left:0,
                    top:0
                }}>
                <div 
                    className='box' 
                        style={{
                            position:'absolute',
                            width:50,
                            height:50,
                            left,
                            top,
                            background:'red'
                        }}
                ></div>
            </div>
        )
    }
}                    
                    `)
                }
            </div>
        )
    }
}

class MultiUse extends Component{
    constructor(props){
        super(props);
        this.state = {boxes:[{left:100,top:100},{left:200,top:100},{left:300,top:100}]}
    }
    componentDidMount(){this.bindSwip();}
    bindSwip(){
        let {boxes} = this.state;
        for(let i = 0; i < boxes.length; i++){
            Swip({
                dom:()=>$('.box-' + i),
                start:()=>{
                    let {left,top} = boxes[i];
                    return [left,top]
                },
                move:({dx,dy,x,y})=>{
                    this.changePosition(x,y,i)
                },
                end:()=>{
                    let {left,top} = boxes[i];
                    this.changePosition(Math.round(left / 50) * 50,Math.round(top / 50) * 50,i)
                    this.setState({boxes})
                }
            })
        }
    }
    changePosition(left,top,index){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        let {boxes} = this.state;
        boxes[index] = {left,top};
        this.setState(boxes)
    }
    render(){
        let {boxes} = this.state;
        return (
            <div className='example'>
                <div className='parent' style={{background:'yellow',width:'100%',height:500,flex:1,position:'relative'}}>
                    {boxes.map(({left,top},i)=>{
                        return (
                            <div key={i} className={`box box-${i}`} style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                        )
                    })}
        
                </div>
                {
                    AIODoc().Code(`
import React,{Component} from 'react';
import Swip from 'aio-swip';

class Example1 extends Component{
    constructor(props){
        super(props);
        this.state = {boxes:[{left:100,top:100},{left:200,top:100},{left:300,top:100}]}
    }
    componentDidMount(){
        let {boxes} = this.state;
        for(let i = 0; i < boxes.length; i++){
            Swip({
                dom:$('.box-' + i),
                start:()=>{
                    let {left,top} = boxes[i];
                    this.left = left; this.top = top
                },
                move:({dx,dy})=>{
                    this.changePosition(this.left + dx,this.top + dy,i)
                },
                end:()=>{
                    let {left,top} = boxes[i];
                    this.changePosition(Math.round(left / 50) * 50,Math.round(top / 50) * 50,i)
                    this.setState({boxes})
                }
            })
        }
    }
    changePosition(left,top,index){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        let {boxes} = this.state;
        boxes[index] = {left,top};
        this.setState(boxes)
    }
    render(){
        let {left,top,view} = this.state;
        return (
            <div 
                className='parent' 
                style={{
                    background:'yellow',
                    width:'100%',
                    height:'100%'
                }}>
                {boxes.map(({left,top},i)=>{
                    return (
                        <div 
                            key={i} 
                            className={'box box-' + i} 
                            style={{
                                position:'absolute',
                                width:50,
                                height:50,
                                left,
                                top,
                                background:'red'
                            }}
                        ></div>
                    )
                })}
            </div>
        )
    }
}                    
                    `)
                }
            </div>
        )
    }
}
class Id extends Component{
    constructor(props){
        super(props);
        this.state = {boxes:[{left:100,top:100,id:'0'},{left:200,top:100,id:'1'},{left:300,top:100,id:'2'}]}
    }
    componentDidMount(){this.bindSwip();}
    bindSwip(){
        let {boxes} = this.state;
        for(let i = 0; i < boxes.length; i++){
            let box = boxes[i]
            Swip({
                dom:()=>$('.box-' + box.id),
                start:()=>{
                    let {boxes} = this.state;
                    let {left,top} = boxes.find((o)=>o.id === box.id);
                    return [left,top]
                },
                move:({x,y})=>{
                    this.changePosition(x,y,box.id)
                },
                
            })
        }
    }
    changePosition(left,top,id){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        let {boxes} = this.state;
        let newBoxes = boxes.map((o)=>o.id === id?{...o,left,top}:o)
        this.setState({boxes:newBoxes})
    }
    render(){
        let {boxes} = this.state;
        return (
            <div className='example'>
                <div className='parent' style={{background:'yellow',width:'100%',height:500,flex:1,position:'relative'}}>
                    {boxes.map(({left,top,id})=>{
                        return (
                            <div key={id} className={`box box-${id}`} style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                        )
                    })}
        
                </div>
                {
                    AIODoc().Code(`
import React,{Component} from 'react';
import Swip from 'aio-swip';

class Example1 extends Component{
    constructor(props){
        super(props);
        this.state = {boxes:[{left:100,top:100},{left:200,top:100},{left:300,top:100}]}
    }
    componentDidMount(){
        let {boxes} = this.state;
        for(let i = 0; i < boxes.length; i++){
            let box = boxes[i]
            Swip({
                dom:()=>$('.box-' + box.id),
                start:()=>{
                    let {boxes} = this.state;
                    let {left,top} = boxes.find((o)=>o.id === box.id);
                    return [left,top]
                },
                move:({x,y})=>{
                    this.changePosition(x,y,box.id)
                },
                
            })
        }
    }
    changePosition(left,top,id){
        let parentWidth = $('.parent').width();
        let parentHeight = $('.parent').height();
        if(left < 0){left = 0;}
        if(left > parentWidth - 50){left = parentWidth - 50;}
        if(top < 0){top = 0;}
        if(top > parentHeight - 50){top = parentHeight - 50;}
        let {boxes} = this.state;
        let newBoxes = boxes.map((o)=>o.id === id?{...o,left,top}:o)
        this.setState({boxes:newBoxes})
    }
    render(){
        let {left,top,view} = this.state;
        return (
            <div className='parent'>
                {boxes.map(({left,top,id})=>{
                    return (<div key={id} className={'box box-' + id}></div>)
                })}
            </div>
        )
    }
}                    
                    `)
                }
            </div>
        )
    }
}
class MousePosition extends Component{
    state = {mousePosition:{}}
    componentDidMount(){this.bindSwip();}
    bindSwip(){
        Swip({
            dom:()=>$('.parent'),
            start:({mousePosition})=>{
                this.setState({mousePosition})
                return [0,0]
            },
            move:({mousePosition})=>{
                this.setState({mousePosition})
            }
        })
    }
    render(){
        let {mousePosition} = this.state;
        let style = {background:'dodgerblue',color:'#fff',padding:'0 6px',margin:3,width:110,fontSize:12}
        return (
            <div className='example'>
                <>
                    <div className='parent' style={{border:'1px solid',width:500,height:500,flex:1,position:'relative'}}></div>
                    <div style={{display:'flex'}}>
                        <span style={style}>{`x : ${mousePosition.x}`}</span>
                        <span style={style}>{`y : ${mousePosition.x}`}</span>
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
}






