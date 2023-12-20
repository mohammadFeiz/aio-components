import React,{Component} from 'react';
import {Swip} from '../../npm/aio-utils/aio-utils';
import DOC from '../../resuse-components/doc';
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
        this.state = {left:0,top:0,view:'preview'}
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
        let {left,top,view} = this.state;
        return (
            <div className='example' style={{display:'flex',flexDirection:'column'}}>
                <AIOInput 
                    type='radio' value={view} 
                    options={[
                        {text:'preview',value:'preview'},
                        {text:'code',value:'code'}
                    ]} 
                    onChange={(view)=>{
                        if(view === 'preview'){this.bindSwip()}
                        this.setState({view})
                    }}
                />
                {
                    view === 'preview' && 
                    <div className='parent' style={{background:'yellow',width:'100%',height:'100%',position:'relative',left:0,top:0}}>
                        <div className='box' style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                    </div>
                }
                {
                    view === 'code' && 
                    <pre style={{flex:1,overflowY:'auto'}}>{`
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
                    `}</pre>
                }
            </div>
        )
    }
}
class StepXStepY extends Component{
    constructor(props){
        super(props);
        this.state = {left:0,top:0,view:'preview'}
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
        let {left,top,view} = this.state;
        return (
            <div className='example' style={{display:'flex',flexDirection:'column'}}>
                <AIOInput 
                    type='radio' value={view} 
                    options={[
                        {text:'preview',value:'preview'},
                        {text:'code',value:'code'}
                    ]} 
                    onChange={(view)=>{
                        if(view === 'preview'){this.bindSwip()}
                        this.setState({view})
                    }}
                />
                {
                    view === 'preview' && 
                    <div className='parent' style={{background:'yellow',width:'100%',height:'100%',position:'relative',left:0,top:0}}>
                        <div className='box' style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                    </div>
                }
                {
                    view === 'code' && 
                    <pre style={{flex:1,overflowY:'auto'}}>{`
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
                    `}</pre>
                }
            </div>
        )
    }
}
class SpeedXSpeedY extends Component{
    constructor(props){
        super(props);
        this.state = {left:0,top:0,view:'preview'}
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
        let {left,top,view} = this.state;
        return (
            <div className='example' style={{display:'flex',flexDirection:'column'}}>
                <AIOInput 
                    type='radio' value={view} 
                    options={[
                        {text:'preview',value:'preview'},
                        {text:'code',value:'code'}
                    ]} 
                    onChange={(view)=>{
                        if(view === 'preview'){this.bindSwip()}
                        this.setState({view})
                    }}
                />
                {
                    view === 'preview' && 
                    <div className='parent' style={{background:'yellow',width:'100%',height:'100%',position:'relative',left:0,top:0}}>
                        <div className='box' style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                    </div>
                }
                {
                    view === 'code' && 
                    <pre style={{flex:1,overflowY:'auto'}}>{`
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
            stepX:50,
            stepY:50,
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
                    `}</pre>
                }
            </div>
        )
    }
}
class MultiUse extends Component{
    constructor(props){
        super(props);
        this.state = {boxes:[{left:100,top:100},{left:200,top:100},{left:300,top:100}],view:'preview'}
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
        let {boxes,view} = this.state;
        return (
            <div className='example' style={{display:'flex',flexDirection:'column'}}>
                <AIOInput 
                    type='radio' value={view} 
                    options={[
                        {text:'preview',value:'preview'},
                        {text:'code',value:'code'}
                    ]} 
                    onChange={(view)=>{
                        if(view === 'preview'){this.bindSwip()}
                        this.setState({view})
                    }}
                />
                {
                    view === 'preview' && 
                    <div className='parent' style={{background:'yellow',width:'100%',height:'100%',flex:1,position:'relative'}}>
                        {boxes.map(({left,top},i)=>{
                            return (
                                <div key={i} className={`box box-${i}`} style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                            )
                        })}
            
                    </div>
                }
                {
                    view === 'code' && 
                    <pre style={{flex:1,overflowY:'auto'}}>{`
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
                    `}</pre>
                }
            </div>
        )
    }
}
class Id extends Component{
    constructor(props){
        super(props);
        this.state = {boxes:[{left:100,top:100},{left:200,top:100},{left:300,top:100}],view:'preview'}
    }
    componentDidMount(){this.bindSwip();}
    bindSwip(){
        let {boxes} = this.state;
        for(let i = 0; i < boxes.length; i++){
            Swip({
                id:i,
                dom:()=>$('.box-' + i),
                start:({id})=>{
                    let {left,top} = boxes[i];
                    return [left,top]
                },
                move:({x,y,id})=>{
                    this.changePosition(x,y,id)
                },
                end:({id})=>{
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
        let {boxes,view} = this.state;
        return (
            <div className='example' style={{display:'flex',flexDirection:'column'}}>
                <AIOInput type='radio' options={[{text:'preview',value:'preview'},{text:'code',value:'code'}]} value={view} onChange={(view)=>this.setState({view})}/>
                {
                    view === 'preview' && 
                    <div className='parent' style={{background:'yellow',width:'100%',height:'100%',flex:1,position:'relative'}}>
                        {boxes.map(({left,top},i)=>{
                            return (
                                <div key={i} className={`box box-${i}`} style={{position:'absolute',width:50,height:50,left,top,background:'red'}}></div>
                            )
                        })}
            
                    </div>
                }
                {
                    view === 'code' && 
                    <pre style={{flex:1,overflowY:'auto'}}>{`
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
                parameter:{index:i},
                dom:$('.box-' + i),
                start:()=>{
                    let {left,top} = boxes[i];
                    return [left,top]
                },
                move:({x,y,parameter})=>{
                    this.changePosition(x,y,parameter.index)
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
                    `}</pre>
                }
            </div>
        )
    }
}
class MousePosition extends Component{
    state = {mousePosition:{},view:'preview'}
    componentDidMount(){this.bindSwip();}
    bindSwip(){
        Swip({
            dom:()=>$('.parent'),
            start:({mousePosition})=>{
                this.setState({mousePosition})
            },
            move:({mousePosition})=>{
                this.setState({mousePosition})
            }
        })
    }
    render(){
        let {view,mousePosition} = this.state;
        return (
            <div className='example' style={{display:'flex',flexDirection:'column'}}>
                <AIOInput 
                    type='radio' value={view} 
                    options={[
                        {text:'preview',value:'preview'},
                        {text:'code',value:'code'}
                    ]} 
                    onChange={(view)=>{
                        if(view === 'preview'){this.bindSwip()}
                        this.setState({view})
                    }}
                />
                {
                    view === 'preview' && 
                    (
                        <>
                            <div className='parent' style={{border:'1px solid',width:500,height:500,flex:1,position:'relative'}}></div>
                            <p>{`x : ${mousePosition.x}`}</p>
                            <p>{`y : ${mousePosition.x}`}</p>
                            <p>{`clientX : ${mousePosition.clientY}`}</p>
                            <p>{`clientY : ${mousePosition.clientX}`}</p>
                            <p>{`xp : ${mousePosition.xp} %`}</p>
                            <p>{`yp : ${mousePosition.yp} %`}</p>
                        </>
                    )
                    
                }
                {
                    view === 'code' && 
                    <pre style={{flex:1,overflowY:'auto'}}>{`
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
                this.setState({mousePosition})
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
                <p>{'x : ' + mousePosition.x}</p>
                <p>{'y : ' + mousePosition.x}</p>
                <p>{'clientX : ' + mousePosition.clientY}</p>
                <p>{'clientY : ' + mousePosition.clientX}</p>
                <p>{'xp : ' + mousePosition.xp + ' %'}</p>
                <p>{'yp : ' + mousePosition.yp + ' %'}</p>
            </>
        )
    }
}                    
                    `}</pre>
                }
            </div>
        )
    }
}






