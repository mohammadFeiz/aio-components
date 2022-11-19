import React,{Component} from 'react';
import AIOLoading from './../../npm/aio-loading/aio-loading';
import Form from './../../npm/aio-form-react/aio-form-react';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import DOC from '../../resuse-components/doc';
export default class DOC_AIOForm extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='spin4'
                navs={[
                    {icon:()=><AIOLoading config={{name:'spin1',size:24}} />,text:'spin1',id:'spin1',COMPONENT:()=><MSF key='spin1' name='spin1'/>},
                    {icon:()=><AIOLoading config={{name:'spin2',size:24,thickness:3}} />,text:'spin2',id:'spin2',COMPONENT:()=><MSF key='spin2' name='spin2'/>},
                    {icon:()=><AIOLoading config={{name:'spin3',size:24,thickness:3}} />,text:'spin3',id:'spin3',COMPONENT:()=><MSF key='spin3' name='spin3'/>},
                    {icon:()=><AIOLoading config={{name:'spin4',size:34,thickness:[3,7]}} />,text:'spin4',id:'spin4',COMPONENT:()=><MSF key='spin4' name='spin4'/>},
                    {icon:()=><AIOLoading config={{name:'spin5',size:34,thickness:3}} />,text:'spin5',id:'spin5',COMPONENT:()=><MSF key='spin5' name='spin5'/>},
                    {icon:()=><AIOLoading config={{name:'dots1',size:24,thickness:8}} />,text:'dots1',id:'dots1',COMPONENT:()=><MSF key='dots1' name='dots1'/>},
                    {icon:()=><AIOLoading config={{name:'dots2',size:24,count:8}} />,text:'dots2',id:'dots2',COMPONENT:()=><MSF key='dpts2' name='dots2'/>},
                    {icon:()=><AIOLoading config={{name:'cubes1',size:34}} />,text:'cubes1',id:'cubes1',COMPONENT:()=><MSF key='cubes1' name='cubes1'/>},
                    {icon:()=><AIOLoading config={{name:'cubes2',size:34}} />,text:'cubes2',id:'cubes2',COMPONENT:()=><MSF key='cubes2' name='cubes2'/>},
                    {icon:()=><AIOLoading config={{name:'cubes3',size:34}} />,text:'cubes3',id:'cubes3',COMPONENT:()=><MSF key='cubes3' name='cubes3'/>},
                    {icon:()=><AIOLoading config={{name:'orbit',size:36,thickness:1}} />,text:'orbit',id:'orbit',COMPONENT:()=><MSF key='orbit' name='orbit'/>},
                    {icon:()=><AIOLoading config={{name:'puls',size:24,fill:'#000'}} />,text:'puls',id:'puls',COMPONENT:()=><MSF key='puls' name='puls'/>},
                    {icon:()=><AIOLoading config={{name:'puls1',size:36}} />,text:'puls1',id:'puls1',COMPONENT:()=><MSF key='puls1' name='puls1'/>}
                ]}
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
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.thickness',label:'thickness',start:1,end:30},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'spin2'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.thickness',label:'thickness',start:1,end:30},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'color',field:'model.model.empty',label:'empty'},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'spin3'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.thickness',label:'thickness',start:1,end:30},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'color',field:'model.model.empty',label:'empty'},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'spin4'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.thickness[0]',label:'width',start:1,end:30},
                {type:'slider',field:'model.model.thickness[1]',label:'height',start:1,end:30},
                {type:'slider',field:'model.model.round',label:'round',start:1,end:36},
                {type:'slider',field:'model.model.count',label:'count',start:2,end:24},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'spin5'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.thickness',label:'thickness',start:1,end:24},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'dots1'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.thickness',label:'thickness',start:1,end:30},
                {type:'slider',field:'model.model.gap',label:'gap',start:1,end:30},
                {type:'slider',field:'model.model.count',label:'count',start:2,end:12},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'dots2'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.thickness',label:'thickness',start:1,end:30},
                {type:'slider',field:'model.model.count',label:'count',start:2,end:12},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'cubes1'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.gap',label:'gap',start:0,end:30},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'cubes2'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.gap',label:'gap',start:0,end:30},
                {type:'slider',field:'model.model.count',label:'count',start:2,end:20},
                {type:'slider',field:'model.model.thickness[0]',label:'width',start:1,end:60},
                {type:'slider',field:'model.model.thickness[1]',label:'height',start:1,end:60},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'slider',field:'model.model.delay',label:'delay',start:0.1,end:1,step:0.1},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'cubes3'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.gap',label:'gap',start:0,end:24},
                {type:'slider',field:'model.model.type',label:'Type',start:1,end:5},
                {type:'slider',field:'model.model.count',label:'Count',start:3,end:7},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'orbit'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.gap',label:'gap',start:0,end:30},
                {type:'slider',field:'model.model.count',label:'count',start:1,end:20},
                {type:'slider',field:'model.model.thickness',label:'thickness',start:1,end:20},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'slider',field:'model.model.delay',label:'delay',start:0.1,end:1,step:0.1},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'puls'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.thickness',label:'thickness',start:1,end:20},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
        if(name === 'puls1'){
            return [
                {type:'number',field:'model.model.size',label:'size'},
                {type:'slider',field:'model.model.duration',label:'duration',start:0.1,end:3,step:0.1},
                {type:'color',field:'model.model.fill',label:'fill'},
                {type:'color',field:'model.background',label:'background'},
            ]
        }
    }
    form_layout(){
      let {config} = this.state;
      let props = {model:config,inputs:this.getInputs()}
      console.log(props)
      return {
        html:(
          <Form
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
        flex:1,align:'vh',style:{background},
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
      return (<RVD layout={{row:[this.form_layout(),this.body_layout()]}}/>)
    }
  }


