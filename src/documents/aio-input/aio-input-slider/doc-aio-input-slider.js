import React, { Component,createRef } from 'react';
import DOC from '../../../resuse-components/doc';
import AIODoc from '../../../npm/aio-documentation/aio-documentation';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from '../../../npm/aio-input/aio-input';
import './doc-aio-input-slider.css';
import {Icon} from '@mdi/react';
import { mdiHumanMale,mdiHumanFemale, mdiAbTesting, mdiFile, mdiAccount} from '@mdi/js';
export default class DOC_AIOInput_Slider extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='valueStyle'
                navs={[
                    { text: 'value', id: 'value', COMPONENT: () => <Value /> },
                    { text: 'onChange', id: 'onChange', COMPONENT: () => <OnChange /> },
                    { text: 'start end min max', id: 'startendminmax', COMPONENT: () => <StartEndMinMax /> },
                    { text: 'showValue', id: 'showValue', COMPONENT: () => <ShowValue /> },
                    { text: 'multiple', id: 'multiple', COMPONENT: () => <Multiple /> },
                    { text: 'direction', id: 'direction', COMPONENT: () => <Direction /> },
                    { text: 'pointStyle', id: 'pointStyle', COMPONENT: () => <PointStyle /> },
                    { text: 'valueStyle', id: 'valueStyle', COMPONENT: () => <ValueStyle /> },
                    { text: 'lineStyle', id: 'lineStyle', COMPONENT: () => <LineStyle /> },
                    { text: 'fillStyle', id: 'fillStyle', COMPONENT: () => <FillStyle /> },
                    { text: 'label', id: 'label', COMPONENT: () => <Label /> },
                    { text: 'scale', id: 'scale', COMPONENT: () => <Scale /> },
                ]}
            />
        )
    }
}





class Value extends Component {
    preview() {
        return (
            <div className='example'>
                <AIOInput type='slider' value={[50]}/>
                {
                    AIODoc().Code(`
<AIOInput type='slider' value={[50]}/>
                    `)
                }
                {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnChange extends Component {
    constructor(props){
        super(props);
        this.state = {value:50}
    }
    preview() {
        let {value} = this.state;
        return (
            <div className='example'>
                <AIOInput 
                    type='slider' value={value}
                    onChange={(value)=>this.setState({value})}
                />
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class StartEndMinMax extends Component {
    constructor(props){
        super(props);
        this.state = {value:50}
    }
    preview() {
        let {value} = this.state;
        return (
            <div className='example'>
                <AIOInput 
                    type='slider' value={value}
                    start={0} end={100} min={10} max={90}
                    onChange={(value)=>this.setState({value})}
                />
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class ShowValue extends Component {
    constructor(props){
        super(props);
        this.state = {value:50}
    }
    preview() {
        let {value} = this.state;
        return (
            <div className='example'>
                <h3>showValue:undefined</h3>
                <AIOInput 
                    type='slider' value={value}
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value}
    onChange={(value)=>setValue(value)}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>showValue:true</h3>
                <AIOInput 
                    type='slider' value={value} showValue={true}
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} showValue={true}
    onChange={(value)=>setValue(value)}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>showValue:false</h3>
                <AIOInput 
                    type='slider' value={value} showValue={false}
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} showValue={false}
    onChange={(value)=>setValue(value)}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>showValue:"inline"</h3>
                <AIOInput 
                    type='slider' value={value} showValue="inline"
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} showValue="inline"
    onChange={(value)=>setValue(value)}
/>
                    `)
                }
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Multiple extends Component {
    constructor(props){
        super(props);
        this.state = {
            value1:[50,70],
            value2:[50,70,90,100]
        }
    }
    preview() {
        let {value1,value2} = this.state;
        return (
            <div className='example'>
                <h3>double value</h3>
                <AIOInput 
                    type='slider' value={value1} multiple={true}
                    onChange={(value1)=>this.setState({value1})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState([50,70]);
<AIOInput 
    type='slider' value={value} multiple={true}
    onChange={(value)=>setValue(value)}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>multi value</h3>
                <AIOInput 
                    type='slider' value={value2} multiple={true}
                    onChange={(value2)=>this.setState({value2})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState([50,70,90,100]);
<AIOInput 
    type='slider' value={value} multiple={true}
    onChange={(value)=>setValue(value)}
/>
                    `)
                }
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Direction extends Component {
    constructor(props){
        super(props);
        this.state = {value:50}
    }
    preview() {
        let {value} = this.state;
        return (
            <div className='example'>
                <h3>direction:"right"</h3>
                <AIOInput 
                    type='slider' value={value} direction='right'
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} direction='right'
    onChange={(value)=>setValue(value)}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>direction:"left"</h3>
                <AIOInput 
                    type='slider' value={value} direction='left'
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} direction='left'
    onChange={(value)=>setValue(value)}
/>
                    `)
                }
                <h3>direction:"top"</h3>
                <AIOInput 
                    type='slider' value={value} direction='top'
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} direction='top'
    onChange={(value)=>setValue(value)}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>direction:"bottom"</h3>
                <AIOInput 
                    type='slider' value={value} direction='bottom'
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} direction='bottom'
    onChange={(value)=>setValue(value)}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class PointStyle extends Component {
    constructor(props){
        super(props);
        this.state = {value:50,multiValue:[30,70]}
    }
    preview() {
        let {value,multiValue} = this.state;
        return (
            <div className='example'>
                <AIOInput 
                    type='slider' value={value} pointStyle={{width:24,height:24,borderRadius:6}}
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} pointStyle={{width:36,height:36,borderRadius:12}}
    onChange={(value)=>this.setState({value})}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                
                <AIOInput 
                    type='slider' value={multiValue} multiple={true}
                    pointStyle={(index)=>{
                        return {width:24,height:24,borderRadius:6,background:index === 0?'dodgerblue':'red'}
                    }}
                    onChange={(multiValue)=>this.setState({multiValue})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState([30,70]);
<AIOInput 
    type='slider' value={value} multiple={true}
    pointStyle={(index)=>{
        return {width:24,height:24,borderRadius:6,background:index === 0?'dodgerblue':'red'}
    }}
    onChange={(value)=>this.setState({value})}
/>
                    `)
                }
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class ValueStyle extends Component {
    constructor(props){
        super(props);
        this.state = {value:50,multiValue:[30,70]}
    }
    preview() {
        let {value,multiValue} = this.state;
        return (
            <div className='example'>
                <h3>valueStyle (object)</h3>
                <AIOInput 
                    type='slider' value={value} 
                    showValue={true}
                    valueStyle={{fontSize:16,top:-32}}
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    showValue={true}
    valueStyle={{fontSize:16,top:-32}}
    onChange={(value)=>this.setState({value})}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>valueStyle (function)</h3>
                <AIOInput 
                    type='slider' value={multiValue} multiple={true}
                    showValue={true}
                    valueStyle={(index)=>{
                        return {background:index === 0?'red':'pink'}
                    }}
                    onChange={(multiValue)=>this.setState({multiValue})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState([30,70]);
<AIOInput 
    type='slider' value={multiValue} multiple={true}
    showValue={true}
    valueStyle={(index)=>{
        return {background:index === 0?'red':'pink'}
    }}
    onChange={(multiValue)=>this.setState({multiValue})}
/>
                    `)
                }
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class LineStyle extends Component {
    constructor(props){
        super(props);
        this.state = {value:50}
    }
    preview() {
        let {value} = this.state;
        return (
            <div className='example'>
                <AIOInput 
                    type='slider' value={value} lineStyle={{height:6,borderRadius:12}}
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    lineStyle={{height:6,borderRadius:12}}
    onChange={(value)=>this.setState({value})}
/>
                    `)
                }
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class FillStyle extends Component {
    constructor(props){
        super(props);
        this.state = {value:50}
    }
    preview() {
        let {value} = this.state;
        return (
            <div className='example'>
                <AIOInput 
                    type='slider' value={value} 
                    fillStyle={{height:6,borderRadius:12}}
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    fillStyle={{height:6,borderRadius:12}}
    onChange={(value)=>this.setState({value})}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <AIOInput 
                    type='slider' value={value} 
                    fillStyle={(index)=>{
                        return {height:6,borderRadius:12,background:index === 0?'dodgerblue':'red'}
                    }}
                    onChange={(value)=>this.setState({value})}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    fillStyle={(index)=>{
        return {height:6,borderRadius:12,background:index === 0?'dodgerblue':'red'}
    }}
    onChange={(value)=>this.setState({value})}
/>
                    `)
                }
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Label extends Component {
    constructor(props){
        super(props);
        this.state = {value:50}
    }
    preview() {
        let {value} = this.state;
        return (
            <div className='example'>
                <h3>labelStep (number)</h3>
                <AIOInput 
                    type='slider' value={value} 
                    onChange={(value)=>this.setState({value})}
                    labelStep={10}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    onChange={(value)=>this.setState({value})}
    labelStep={10}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>labelStep (Array)</h3>
                <AIOInput 
                    type='slider' value={value} 
                    onChange={(value)=>this.setState({value})}
                    labelStep={[0,50,70,100]}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    onChange={(value)=>this.setState({value})}
    labelStep={[0,50,70,100]}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>editLabel</h3>
                <AIOInput 
                    type='slider' value={value} 
                    onChange={(value)=>this.setState({value})}
                    labelStep={10}
                    editLabel={(value)=>{
                        if(value === 0){return 'start'}
                        else if(value === 50){return 'avg'}
                        else if(value === 100){return 'end'}
                        else {return value}
                    }}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    onChange={(value)=>this.setState({value})}
    labelStep={10}
    editLabel={(value)=>{
        if(value === 0){return 'start'}
        else if(value === 50){return 'avg'}
        else if(value === 100){return 'end'}
        else {return value}
    }}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>labelRotate (number)</h3>
                <AIOInput 
                    type='slider' value={value} 
                    onChange={(value)=>this.setState({value})}
                    labelStep={10}
                    labelRotate={45}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    onChange={(value)=>this.setState({value})}
    labelStep={10}
    labelRotate={45}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>labelRotate (function)</h3>
                <AIOInput 
                    type='slider' value={value} 
                    onChange={(value)=>this.setState({value})}
                    labelStep={10}
                    labelRotate={(value)=>value === 0 || value === 100?90:0}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    onChange={(value)=>this.setState({value})}
    labelStep={10}
    labelRotate={(value)=>value === 0 || value === 100?90:0}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>labelStyle (object)</h3>
                <AIOInput 
                    type='slider' value={value} 
                    onChange={(value)=>this.setState({value})}
                    labelStep={10}
                    labelStyle={{top:40,fontSize:16,color:'dodgerblue'}}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    onChange={(value)=>this.setState({value})}
    labelStep={10}
    labelStyle={{top:40,fontSize:16,color:'dodgerblue'}}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>labelStyle (function)</h3>
                <AIOInput 
                    type='slider' value={value} 
                    onChange={(value)=>this.setState({value})}
                    labelStep={10}
                    labelStyle={(value)=>{
                        return {top:40,fontSize:16,color:value < 40?'red':'dodgerblue'}
                    }}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    onChange={(value)=>this.setState({value})}
    labelStep={10}
    labelStyle={(value)=>{
        return {top:40,fontSize:16,color:value < 40?'red':'dodgerblue'}
    }}
/>
                    `)
                }
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Scale extends Component {
    constructor(props){
        super(props);
        this.state = {value:50}
    }
    preview() {
        let {value} = this.state;
        return (
            <div className='example'>
                <h3>scaleStep (number)</h3>
                <AIOInput 
                    type='slider' value={value} 
                    onChange={(value)=>this.setState({value})}
                    scaleStep={10}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    onChange={(value)=>this.setState({value})}
    scaleStep={10}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>scaleStep (Array)</h3>
                <AIOInput 
                    type='slider' value={value} 
                    onChange={(value)=>this.setState({value})}
                    scaleStep={[0,50,70,100]}
                />
                {
                    AIODoc().Code(`
const [value,setValue] = useState(50);
<AIOInput 
    type='slider' value={value} 
    onChange={(value)=>this.setState({value})}
    scaleStep={[0,50,70,100]}
/>
                    `)
                }
                <h3>scaleStyle (object)</h3>
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
                }
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'preview',
            tabs: [
                { text: 'Preview', value: 'preview' },
                { text: 'Code', value: 'code' }
            ]
        }
    }
    body_layout() {
        let { tab } = this.state;
        return tab === 'preview' ? this.preview_layout() : this.code_layout()
    }
    preview_layout() {
        let { preview } = this.props;
        return {
            flex: 1,
            className: 'p-12',
            html: preview()
        }
    }
    code_layout() {
        let { code, rtl = false } = this.props;
        return {
            flex: 1,
            html: (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'auto' }}>
                    <pre style={{ padding: 12 }}>{AIODoc().Code(code())}</pre>
                </div>
            )
        }
    }
    toolbar_layout() {
        let { toolbar } = this.props;
        if (!toolbar) { return false }
        return {
            html: toolbar()
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    column: [
                        this.toolbar_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}




