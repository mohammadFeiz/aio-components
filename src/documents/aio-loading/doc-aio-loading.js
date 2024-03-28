import React,{Component} from 'react';
import AIOLoading from './../../npm/aio-loading/aio-loading';
import AIOInput from './../../npm/aio-input/aio-input';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import DOC from '../../resuse-components/doc.tsx';
export default class DOC_AIOForm extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='spin4'
                nav={{
                    items:[
                        {icon:()=><AIOLoading config={{name:'spin1',size:24}} />,text:'spin1',id:'spin1',render:()=><MSF key='spin1' name='spin1'/>},
                        {icon:()=><AIOLoading config={{name:'spin2',size:24,thickness:3}} />,text:'spin2',id:'spin2',render:()=><MSF key='spin2' name='spin2'/>},
                        {icon:()=><AIOLoading config={{name:'spin3',size:24,thickness:3}} />,text:'spin3',id:'spin3',render:()=><MSF key='spin3' name='spin3'/>},
                        {icon:()=><AIOLoading config={{name:'spin4',size:34,thickness:[3,7]}} />,text:'spin4',id:'spin4',render:()=><MSF key='spin4' name='spin4'/>},
                        {icon:()=><AIOLoading config={{name:'spin5',size:34,thickness:3}} />,text:'spin5',id:'spin5',render:()=><MSF key='spin5' name='spin5'/>},
                        {icon:()=><AIOLoading config={{name:'dots1',size:24,thickness:8}} />,text:'dots1',id:'dots1',render:()=><MSF key='dots1' name='dots1'/>},
                        {icon:()=><AIOLoading config={{name:'dots2',size:24,count:8}} />,text:'dots2',id:'dots2',render:()=><MSF key='dpts2' name='dots2'/>},
                        {icon:()=><AIOLoading config={{name:'cubes1',size:34}} />,text:'cubes1',id:'cubes1',render:()=><MSF key='cubes1' name='cubes1'/>},
                        {icon:()=><AIOLoading config={{name:'cubes2',size:34}} />,text:'cubes2',id:'cubes2',render:()=><MSF key='cubes2' name='cubes2'/>},
                        {icon:()=><AIOLoading config={{name:'cubes3',size:34}} />,text:'cubes3',id:'cubes3',render:()=><MSF key='cubes3' name='cubes3'/>},
                        {icon:()=><AIOLoading config={{name:'orbit',size:36,thickness:1}} />,text:'orbit',id:'orbit',render:()=><MSF key='orbit' name='orbit'/>},
                        {icon:()=><AIOLoading config={{name:'puls',size:24,fill:'#000'}} />,text:'puls',id:'puls',render:()=><MSF key='puls' name='puls'/>},
                        {icon:()=><AIOLoading config={{name:'puls1',size:36}} />,text:'puls1',id:'puls1',render:()=><MSF key='puls1' name='puls1'/>}
                    ]
                }}
            />
        )
    }
}
class MSF extends Component{
    constructor(props){
      super(props);
      this.state = {
        config:{
          model:{...this.getInitModel()},
          background:'#ffffff'
        }
        
      }
    }
    getInitModel(){
        return {...{
            'spin1':{size:50,thickness:4,fill:'#000',duration:1},
            'spin2':{size:50,thickness:4,fill:'#000000',empty:'#dddddd',duration:1},
            'spin3':{size:50,thickness:4,fill:'#000000',empty:'#dddddd',duration:1},
            'spin4':{size:80,thickness:[6,18],fill:'#000000',duration:1,count:22,round:4},
            'spin5':{size:60,thickness:3,fill:'#000000',duration:0.8},
            'dots1':{size:50,thickness:8,fill:'#000000',duration:1,gap:1,count:3},
            'dots2':{size:60,thickness:4,fill:'#000000',duration:0.8,count:8},
            'cubes1':{size:60,gap:0,fill:'#000000',duration:1.3},
            'cubes2':{count:5,size:60,gap:3,thickness:[7,30],fill:'#000000',duration:1.3,delay:0.1},
            'cubes3':{duration:1,type:1,fill:'#808080',size:90,gap:1,count:3},
            'orbit':{count:2,size:70,gap:3,thickness:3,fill:'#000000',duration:1.3,delay:0.1},
            'puls':{size:30,thickness:1,fill:'#be65e2',duration:0.5},
            'puls1':{size:50,fill:'#be65e2',duration:1}
        }[this.props.name]}
    }
    getInputs(){
        let {name} = this.props;
        if(name === 'spin1'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:1,end:30},field:'value.model.thickness',label:'thickness'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'spin2'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:1,end:30},field:'value.model.thickness',label:'thickness'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'color'},field:'value.model.empty',label:'empty'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'spin3'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:1,end:30},field:'value.model.thickness',label:'thickness'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'color'},field:'value.model.empty',label:'empty'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'spin4'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:1,end:30},field:'value.model.thickness[0]',label:'width'},
                {input:{type:'slider',start:1,end:30},field:'value.model.thickness[1]',label:'height'},
                {input:{type:'slider',start:1,end:36},field:'value.model.round',label:'round'},
                {input:{type:'slider',start:2,end:24},field:'value.model.count',label:'count'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'spin5'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:1,end:24},field:'value.model.thickness',label:'thickness'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'dots1'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:1,end:30},field:'value.model.thickness',label:'thickness'},
                {input:{type:'slider',start:1,end:30},field:'value.model.gap',label:'gap'},
                {input:{type:'slider',start:2,end:12},field:'value.model.count',label:'count'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'dots2'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:1,end:30},field:'value.model.thickness',label:'thickness'},
                {input:{type:'slider',start:2,end:12},field:'value.model.count',label:'count'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'cubes1'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:0,end:30},field:'value.model.gap',label:'gap'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'cubes2'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:0,end:30},field:'value.model.gap',label:'gap'},
                {input:{type:'slider',start:2,end:20},field:'value.model.count',label:'count'},
                {input:{type:'slider',start:1,end:60},field:'value.model.thickness[0]',label:'width'},
                {input:{type:'slider',start:1,end:60},field:'value.model.thickness[1]',label:'height'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'slider',start:0.1,end:1,step:0.1},field:'value.model.delay',label:'delay'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'cubes3'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:0,end:24},field:'value.model.gap',label:'gap'},
                {input:{type:'slider',start:1,end:5},field:'value.model.input:{type',label:'Type'},
                {input:{type:'slider',start:3,end:7},field:'value.model.count',label:'Count'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'orbit'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:0,end:30},field:'value.model.gap',label:'gap'},
                {input:{type:'slider',start:1,end:20},field:'value.model.count',label:'count'},
                {input:{type:'slider',start:1,end:20},field:'value.model.thickness',label:'thickness'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'slider',start:0.1,end:1,step:0.1},field:'value.model.delay',label:'delay'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'puls'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:1,end:20},field:'value.model.thickness',label:'thickness'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
        if(name === 'puls1'){
            return [
                {input:{type:'number'},field:'value.model.size',label:'size'},
                {input:{type:'slider',start:0.1,end:3,step:0.1},field:'value.model.duration',label:'duration'},
                {input:{type:'color'},field:'value.model.fill',label:'fill'},
                {input:{type:'color'},field:'value.background',label:'background'},
            ]
        }
    }
    form_layout(){
      let {config} = this.state;
      let props = {value:config,inputs:{column:this.getInputs()}}
      console.log(props)
      return {
        html:(
          <AIOInput
            type='form'
            {...props}
            onChange={(config)=>this.setState({config})}
          />
        )
      }
    }
    body_layout(){
      return {flex:1,column:[this.previw_layout(),this.code_layout()]}
    }
    previw_layout(){
      let {config} = this.state;
      let {model,background} = config;
      let {name} = this.props;
      return {
        className:'align-vh flex-1',style:{background},
        html:(
          <AIOLoading key={JSON.stringify(model) + name} config={{...model,name}}/>
        )
      }
    }
    code_layout(){
      let {config} = this.state;
      let {model} = config;
      let {name} = this.props;
      return {
        flex:1,html:(
          <pre style={{padding:12,background:'#333',width:'100%',color:'#fff'}}>
            {`
<AIOLoading
    config={
        ${JSON.stringify({name,...model},null,4)}
    }
/>
            `}
            
          </pre>
        )
      }
    }
    render(){
      return (<RVD rootNode={{row:[this.form_layout(),this.body_layout()]}}/>)
    }
  }


