import React,{Component} from 'react';
import Form from './../../npm/aio-form-react/aio-form-react';
import Gauge from './../../npm/aio-gauge/aio-gauge';
import StorageClass from './../../npm/aio-storage/aio-storage';
import AIOJson from './../../npm/aio-json/aio-json';
import {Icon} from '@mdi/react';
import { mdiDelete ,mdiPlusThick,mdiClose} from '@mdi/js';
import RVD from '../../npm/react-virtual-dom/react-virtual-dom';
import AIOButton from './../../npm/aio-button/aio-button';
import './index.css';
export default class DOC_AIOGauge extends Component{
    render(){
        return (
            <Input {...this.props}/>
        )
    }
}
class Input extends Component{
    constructor(props) {
        super(props);
        let Storage = StorageClass('gaugegenerator')
        this.state = { 
            mode:'preview',
            Storage,
            gauges:Storage.getList(),
            fileName:'',
            gauge:{
                circles:[{lineWidth:1,stroke:'#555555',radius:50,slice:true}],
                dynamic:true,
                style:{width:150,height:150,background:'#eeeeee'},
                radius:60,angle:220,position:[0,0],rotate:0,thickness:10,direction:'clock',
                text:{value:'My Gauge',fontSize:10,top:10,left:0,color:'#000000',rotate:0},
                start:0,end:100,
                ranges:[
                {value:50,color:'#ff0000'},
                {value:100,color:'#00ff00'}
                ],
                scale:[],
                label:[],
                handle:{value:50,width:3,height:50,radius:3,offset:0,color:'#000000'}
            }
        }
    }
    addRange(e){
        e.stopPropagation()
        var {gauge} = this.state;
        var {ranges,end} = gauge;
        if(ranges.length){ 
          var lastRange = ranges[ranges.length - 1];
          if(lastRange.value >= end){return;}
        }
        ranges.push({value:end,color:'#aaaaaa'})
        this.setState({gauge})
    }
    addCircle(e){
    e.stopPropagation()
    var {gauge} = this.state;
    var {circles} = gauge;
    circles.push({radius:50,color:'#555555',lineWidth:1,slice:false});
    this.setState({gauge})
    }
    addLabel(e){
    e.stopPropagation()
    var {gauge} = this.state;
    var {label} = gauge;
    label.push({step:10,color:'#000000',fontSize:10,offset:0});
    this.setState({gauge})
    }
    removeLabel(index){
    let {gauge} = this.state;
    gauge.label.splice(index,1);
    this.setState({gauge})
    }
    addScale(e){
    e.stopPropagation()
    var {gauge} = this.state;
    var {scale} = gauge;
    scale.push({step:10,color:'#000',width:1,height:6,offset:0});
    this.setState({gauge})
    }
    removeCircle(index){
    let {gauge} = this.state;
    gauge.circles.splice(index,1);
    this.setState({gauge})
    }
    removeScale(index){
    let {gauge} = this.state;
    gauge.scale.splice(index,1);
    this.setState({gauge})
    }     
    removeRange(index){ 
    let {gauge} = this.state;
    gauge.ranges.splice(index,1);
    this.setState({gauge})
    }
    form_ranges(){
    var {gauge} = this.state;
    var {start,end,ranges} = gauge;
    return {
        type:'group',id:'ranges',text:'ranges',
        html:()=>{return (<button className='add-button' onClick={(e)=>this.addRange(e)}>Add Range</button>)},
        inputs:ranges.map((o,i)=>{
        let beforeValue = i === 0?start:ranges[i - 1].value;
        let afterValue = i === ranges.length - 1?end:ranges[i + 1].value;
        let rowKey = 'range' + i;
        return {
            type:'group',
            inputs:[
            {type:'html',html:()=>'range ' + i,rowKey,rowWidth:70},
            {type:'slider',field:`model.ranges[${i}].value`,rowKey,start:beforeValue,end:afterValue},
            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'number',field:`model.ranges[${i}].value`,rowKey,rowWidth:70},
            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'color',field:`model.ranges[${i}].color`,rowKey,rowWidth:46},
            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'html',html:()=><Icon path={mdiClose} size={0.8} onClick={()=>this.removeRange(i)}/>,rowKey,rowWidth:20},
            ]
        }
        })
    }
    }
    form_circles(){
    var {gauge} = this.state;
    var {circles} = gauge;
    return {
        type:'group',id:'circles',text:'circles',
        html:()=>{return (<button className='add-button' onClick={(e)=>this.addCircle(e)}>Add Circle</button>)},
        inputs:circles.map((o,i)=>{
        let rowKey = 'circle' + i;
        return {
            type:'group',
            inputs:[
            {type:'html',html:()=>'circle ' + i,rowKey,rowWidth:70},
            {type:'number',field:`model.circles[${i}].radius`,rowKey},
            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'number',field:`model.circles[${i}].lineWidth`,rowKey},
            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'color',field:`model.circles[${i}].stroke`,rowKey},
            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'checkbox',field:`model.circles[${i}].slice`,rowKey,inputStyle:{padding:0,justifyContent:'center'},rowWidth:20},
            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'html',html:()=><Icon path={mdiClose} size={0.8} onClick={()=>this.removeCircle(i)}/>,rowKey,rowWidth:20}
            ]
        }
        })
    }
    }
    form_style(){
    return {
        type:'group',id:'style',text:'style',
        inputs:[
        {type:'html',html:()=>'start-end',rowKey:'1',rowWidth:70},
        {type:'number',field:'model.start',rowKey:'1'},
        {type:'html',html:()=>'',rowKey:'1',rowWidth:2},
        {type:'number',field:'model.end',rowKey:'1'},

        {type:'html',html:()=>'size',rowKey:'2',rowWidth:70},
        {type:'slider',field:'model.style.width',rowKey:'2',start:30,end:260},
        {type:'html',html:()=>'',rowKey:'2',rowWidth:2},
        {type:'slider',field:'model.style.height',rowKey:'2',start:30,end:260},

        {type:'html',html:()=>'position',rowKey:'3',rowWidth:70},
        {type:'slider',field:'model.position[0]',rowKey:'3',start:0,end:100},
        {type:'html',html:()=>'',rowKey:'3',rowWidth:2},
        {type:'slider',field:'model.position[1]',rowKey:'3',start:0,end:100},
        
        {type:'html',html:()=>'direction',rowKey:'4',rowWidth:70},
        {type:'radio',field:'model.direction',rowKey:'4',options:[{value:'clock',text:'clock'},{value:'clockwise',text:'clockwise'}],optionStyle:{width:"50%"}},
        
        {type:'html',html:()=>'radius',rowKey:'5',rowWidth:70},
        {type:'slider',field:'model.radius',rowKey:'5',start:20,end:130},

        {type:'html',html:()=>'angle',rowKey:'6',rowWidth:70},
        {type:'slider',field:'model.angle',rowKey:'6',start:0,end:360},
        {type:'html',html:()=>'',rowKey:'6',rowWidth:2},
        {type:'slider',field:'model.rotate',rowKey:'6',start:0,end:360},
        
        {type:'html',html:()=>'thickness',rowKey:'7',rowWidth:70},
        {type:'slider',field:'model.thickness',rowKey:'7',start:0,end:70},

        {type:'html',html:()=>'background',rowKey:'8',rowWidth:70},
        {type:'color',field:'model.style.background',rowKey:'8'},
        ]
    }
    }
    form_label(){
    var {gauge} = this.state;
    var {label} = gauge;
    return {
        type:'group',id:'label',text:'label',
        html:()=>{return (<button className='add-label' onClick={(e)=>this.addLabel(e)}>Add Label</button>)},
        inputs:label.map((o,i)=>{
        let rowKey = 'label' + i;
        return {
            type:'group',
            inputs:[
            {type:'number',label:'step',field:`model.label[${i}].step`,rowKey},
            
            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'number',label:'start',field:`model.label[${i}].start`,rowKey},

            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'number',label:'fontSize',field:`model.label[${i}].fontSize`,rowKey,min:2,max:20},

            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'number',label:'offset',field:`model.label[${i}].offset`,rowKey,min:0,max:200},
            
            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'color',label:'color',field:`model.label[${i}].color`,rowKey},

            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'html',html:()=><Icon path={mdiClose} size={0.8} onClick={()=>this.removeLabel(i)}/>,rowKey,rowWidth:20}
            ]
        }
        })
    }
    }
    form_scale(){
    let {gauge} = this.state;
    let {scale} = gauge;
    return {
        type:'group',id:'scale',text:'scale',
        html:()=>{return (<button className='add-scale' onClick={(e)=>this.addScale(e)}>Add Scale</button>)},
        inputs:scale.map((o,i)=>{
        let rowKey = 'scale' + i;
        return {
            type:'group',
            inputs:[
            {type:'number',label:'step',field:`model.scale[${i}].step`,rowKey},

            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'number',label:'width',field:`model.scale[${i}].width`,rowKey,min:0,max:20},
            
            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'number',label:'height',field:`model.scale[${i}].height`,rowKey,min:0,max:30},

            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'number',label:'offset',field:`model.scale[${i}].offset`,rowKey,min:0,max:200},
            
            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'color',label:'color',field:`model.scale[${i}].color`,rowKey},

            {type:'html',html:()=>'',rowKey,rowWidth:2},
            {type:'html',html:()=><Icon path={mdiClose} size={0.8} onClick={()=>this.removeScale(i)}/>,rowKey,rowWidth:20}
            ]
        }
        })
    }
    }
    form_handle(){
    return {
        type:'group',id:'handle',text:'handle',
        inputs:[
        {type:'html',html:()=>'value',rowKey:'17',rowWidth:70},
        {type:'slider',field:'model.handle.value',rowKey:'17',start:'model.start',end:'model.end'},

        {type:'html',html:()=>'width',rowKey:'18',rowWidth:70},
        {type:'slider',field:'model.handle.width',rowKey:'18',start:0,end:50},

        {type:'html',html:()=>'height',rowKey:'19',rowWidth:70},
        {type:'slider',field:'model.handle.height',rowKey:'19',start:0,end:100},
        
        {type:'html',html:()=>'offset',rowKey:'20',rowWidth:70},
        {type:'slider',field:'model.handle.offset',rowKey:'20',start:0,end:60},
        
        {type:'html',html:()=>'radius',rowKey:'21',rowWidth:70},
        {type:'slider',field:'model.handle.radius',rowKey:'21',start:0,end:60},
        
        {type:'html',html:()=>'color',rowKey:'22',rowWidth:70},
        {type:'color',field:'model.handle.color',rowKey:'22'},
        ]
    }
    }
    form_text(){
    return {
        type:'group',id:'text',text:'text',
        inputs:[
        {type:'html',html:()=>'value',rowKey:'23',rowWidth:70},
        {type:'text',field:'model.text.value',rowKey:'23'},
        
        {type:'html',html:()=>'top',rowKey:'24',rowWidth:70},
        {type:'slider',field:'model.text.top',rowKey:'24',start:-100,end:100},
        
        {type:'html',html:()=>'left',rowKey:'25',rowWidth:70},
        {type:'slider',field:'model.text.left',rowKey:'25',start:-100,end:100},
        
        {type:'html',html:()=>'fontSize',rowKey:'26',rowWidth:70},
        {type:'slider',field:'model.text.fontSize',rowKey:'26',start:2,end:40},
        
        {type:'html',html:()=>'rotate',rowKey:'27',rowWidth:70},
        {type:'slider',field:'model.text.rotate',rowKey:'27',start:0,end:360},
        
        {type:'html',html:()=>'color',rowKey:'28',rowWidth:70},
        {type:'color',field:'model.text.color',rowKey:'28'},
        ]
    }
    }
    activeGauge_layout(){
        let {fileName,Storage,gauge} = this.state;
        if(!fileName){return false}
        gauge.start = gauge.start || 0;
        return {
            size:480,
            html:(
                <Form
                    onChange={(gauge)=>{
                    let {fileName} = this.state;
                    Storage.save(gauge,fileName)
                    this.setState({gauge})
                    }}
                    defaults={{
                    slider:{
                        thickness:3,emptyColor:'#1d292c',fillColor:'#105e57',
                        buttonStyle:{background:'#4c525a',height:16,fontSize:10}
                    }
                    }}
                    labelStyle={{height:12,fontSize:10,paddingLeft:12}}
                    style={{padding:6,color:'#fff',background:'#1d292c'}}
                    theme={{checkIconSize:[12,10,1],checkIconColor:['#ff6600']}}
                    inputStyle={{height:20,borderRadius:0,background:'rgba(138, 166, 216, 0.1)',color:'#fff',border:'none',padding:12,fontSize:10}}
                    rowStyle={{height:38,margin:0}}
                    bodyStyle={{padding:0}}
                    model={gauge}
                    inputs={[this.form_ranges(),this.form_circles(),this.form_style(),this.form_label(),this.form_scale(),this.form_handle(),this.form_text()]}
                />
            )
        }
    }
    preview_layout(){
        let {mode} = this.state;
        return {
            flex:1,align:'vh',scroll:'v',style:{background:'#fff'},
            html:this['preview_' + mode]()
        }
    }
    preview_preview(){
        let {fileName} = this.state;
        if(!fileName){return false}
        return (
            <Gauge {...this.state.gauge} position={[this.state.gauge.position[0] + '%',this.state.gauge.position[1] + '%']}/>
        )
    }
    preview_model(){
        let {gauge} = this.state;
        return (
            <AIOJson style={{height:'100%'}} json={gauge} onChange={(gauge)=>this.setState({gauge})}/>
        )
    }
    gauges_layout(){
        let {gauges,fileName,Storage} = this.state;
        return {
            size:240,
            column:gauges.map((name)=>{
                let active = fileName === name;
                return {
                    align:'v',
                    style:{
                        height:36,padding:'0 12px',
                        background:active?'#2e577f':'rgb(138 166 216 / 10%)',
                        color:'#fff',
                        fontSize:12,
                        marginBottom:1
                    },
                    row:[
                        {
                            flex:1,align:'v',style:{height:'100%'},
                            html:name,
                            attrs:{
                                onClick:()=>{
                                    let res = Storage.load(name);
                                    this.setState({gauge:res,fileName:name})
                                }
                            }      
                        },
                        {html:<Icon path={mdiDelete} size={0.7} />,align:'vh',attrs:{onClick:()=>{
                            let {fileName} = this.state;
                            if(name === fileName){fileName = false;}
                            Storage.remove(name);
                            this.setState({fileName,gauges:Storage.getList()})
                        }}}
                    ]
                }
            })
        }
    }
    toolbar_layout(){
        let {gauge,Storage,mode} = this.state;
        return {
            size:48,align:'v',gap:1,
            row:[
                {
                    size:240,
                    html:(
                        <AIOButton 
                            before={<Icon path={mdiPlusThick} size={0.7}/>}
                            text='Add Gauge'
                            style={{background:'#2a59545c',color:'#fff',width:'100%',height:48}}
                            type='button'
                            onClick={()=>{
                                Storage.save(gauge);
                                this.setState({gauges:Storage.getList()})
                            }}
                        />
                    )
                },
                {
                    flex:1,
                    html:(
                        <AIOButton 
                            style={{background:'#2a59545c',color:'#fff',height:48}}
                            type='tabs'
                            value={mode}
                            options={[
                                {text:'Preview',value:'preview'},
                                {text:'Model',value:'model'}
                            ]}
                            onChange={(mode)=>{
                                this.setState({mode})
                            }}
                        />
                    )
                },
                {
                    html:(
                        <AIOButton
                            style={{background:'#2a59545c',color:'#fff',height:48}}
                            type='button'
                            text='Exit'
                            onClick={()=>this.props.goToHome()}
                        />
                    )
                }
            ]
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    style:{position:'fixed',height:'100%',flex:'none',width:'100%',left:0,top:0,background:'#1d292c'},
                    column:[
                        this.toolbar_layout(),
                        {
                            flex:1,
                            row:[
                                this.gauges_layout(),
                                this.preview_layout(),
                                this.activeGauge_layout()
                            ]
                        }
                    ]
                }}
            />
        )
    }
}
