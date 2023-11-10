import React,{Component} from "react";
import DOC from './../../resuse-components/doc';
import ACS from './../../npm/aio-content-slider/aio-content-slider';
import AIOInput from './../../npm/aio-input/aio-input';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
export default class DOC_AIOContentSlider extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='autoSlide number'
                nav={{
                  items:[
                    {text:'example',id:'example',render:()=><Preview/>}
                ]
                }}

            />
        )
    }
}

class Preview extends Component{
    state = {speed:80,autoSlide:4000}
    preview(){
        let {speed,autoSlide} = this.state;
        return (
            <ACS
                items={[
                    <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
                    <img src="https://media.slidesgo.com/storage/15750445/futuristic-background-infographics1640619679.jpg" width='100%'/>
                    </div>,
                    <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
                    <img src="https://media.slidesgo.com/storage/92014/upload.png" width='100%'/>
                    </div>,
                    <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
                    <img src="https://media.slidesgo.com/storage/23211385/cyber-futuristic-ai-technology-thesis-defense1658931324.jpg" width='100%'/>
                    </div>,
                ]}
                speed={speed}
                autoSlide={autoSlide}
            />
        )
    }
    code(){
        let {speed,autoSlide} = this.state;
        return (`
        items={[
            <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
            <img src="https://media.slidesgo.com/storage/15750445/futuristic-background-infographics1640619679.jpg" width='100%'/>
            </div>,
            <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
            <img src="https://media.slidesgo.com/storage/92014/upload.png" width='100%'/>
            </div>,
            <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
            <img src="https://media.slidesgo.com/storage/23211385/cyber-futuristic-ai-technology-thesis-defense1658931324.jpg" width='100%'/>
            </div>,
        ]}
        speed={${speed}}
        autoSlide={${autoSlide}}
        `)
    }
    toolbar(){
        return (
            <>
                speed :
                <input type='number' defaultValue={80} onBlur={(e)=>this.setState({speed:+e.target.value})}/>
                ( between 1 and 99 ) --------
                autoSlide :
                <input type='number' defaultValue={4000} onBlur={(e)=>this.setState({autoSlide:+e.target.value})}/>
                ( miliseconds )
            </>
        )
    }
    render(){
        return (
            <Example
              preview={()=>this.preview()}
              code={()=>this.code()}
              toolbar={()=>this.toolbar()}
            />
        );
    }
}


class Example extends Component{
    constructor(props){
      super(props);
      this.state = {
        tab:'preview',
        tabs:[
          {text:'Preview',value:'preview'},
          {text:'Code',value:'code'}
        ]
      }
    }
    tabs_layout(){
      let {tab,tabs} = this.state;
      return {
        html:(
          <AIOInput type='tabs' options={tabs} value={tab} onChange={(tab)=>this.setState({tab})}/>
        )
      }
    }
    body_layout(){
      let {tab} = this.state;
      return tab === 'preview'?this.preview_layout():this.code_layout()
    }
    preview_layout(){
      let {preview} = this.props;
      return {
        flex:1,
        html:preview()
      }
    }
    code_layout(){
      let {code} = this.props;
      return {
        flex:1,
        html:(
          <div style={{display:'flex',flexDirection:'column',width:'100%',height:'100%',overflow:'auto'}}>
            <pre>{`
class App extends Component {
  render(){
    let {model} = this.state;
    return (
      <AIOContentSlider
        ${code()}
      />
    );
  }
}            
            `}</pre>
          </div>
        )
      }
    }
    toolbar_layout(){
      let {toolbar} = this.props;
      if(!toolbar){return false}
      return {
        column:[
            {size:12},
            {html:toolbar()},
            {size:12}
        ]
      }
    }
    render(){
      return (
        <RVD
          layout={{
            column:[
              this.tabs_layout(),
              this.toolbar_layout(),
              this.body_layout()
            ]
          }}
        />
      )
    }
  }