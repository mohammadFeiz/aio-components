import React,{Component} from 'react';
import DOC from '../../resuse-components/doc';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import Chart from './../../npm/aio-chart/aio-chart';
import AIOInput from './../../npm/aio-input/aio-input';
import './index.css';
export default class DOC_AIOForm extends Component{
    render(){
      let points = [
        {x:'January',y:10},
        {x:'February',y:20},
        {x:'March',y:40},
        {x:'April',y:55},
        {x:'May',y:50},
        {x:'June',y:60},
        {x:'July',y:65},
        {x:'August',y:50},
        {x:'September',y:45},
        {x:'October',y:35},
      ]
      let keys = ['January','February','March','April','May','June','July','August','September','October']
      return (
        <DOC
          {...this.props}
          navId='MultiData'
          navs={[
            {text:'data',id:'data',COMPONENT:()=><Data points={points} keys={keys}/>},
            {text:'MultiData',id:'MultiData',COMPONENT:()=><MultiData points={points} keys={keys}/>},
            {text:'data.color',id:'data.color',COMPONENT:()=><Data_color points={points} keys={keys}/>},
            {text:'data.title',id:'data.title',COMPONENT:()=><Data_title points={points} keys={keys}/>},
            {text:'data.pointRadius',id:'data.pointRadius',COMPONENT:()=><Data_pointRadius points={points} keys={keys}/>},
            {text:'data.pointStrokeWidth',id:'data.pointStrokeWidth',COMPONENT:()=><Data_pointStrokeWidth points={points} keys={keys}/>},
            {text:'data.pointStroke',id:'data.pointStroke',COMPONENT:()=><Data_pointStroke points={points} keys={keys}/>},
            {text:'data.pointFill',id:'data.pointFill',COMPONENT:()=><Data_pointFill points={points} keys={keys}/>},
            {text:'data.pointDash',id:'data.pointDash',COMPONENT:()=><Data_pointDash points={points} keys={keys}/>},
            {text:'data.pointText',id:'data.pointText',COMPONENT:()=><Data_pointText points={points} keys={keys}/>},
            {text:'data.pointTextStyle',id:'data.pointTextStyle',COMPONENT:()=><Data_pointTextStyle points={points} keys={keys}/>},
            {text:'data.lineWidth',id:'data.lineWidth',COMPONENT:()=><Data_lineWidth points={points} keys={keys}/>},
            {text:'data.lineDash',id:'data.lineDash',COMPONENT:()=><Data_lineDash points={points} keys={keys}/>},
            {text:'data.areaColor',id:'data.areaColor',COMPONENT:()=><Data_areaColor points={points} keys={keys}/>},
            {text:'valueAxis',id:'valueAxis',COMPONENT:()=><ValueAxis points={points} keys={keys}/>},
            {text:'lines',id:'lines',COMPONENT:()=><Lines points={points} keys={keys}/>},
            {text:'bar chart',id:'bar chart',COMPONENT:()=><BarChart points={points} keys={keys}/>},
            {text:'barWidth',id:'barWidth',COMPONENT:()=><BarWidth points={points} keys={keys}/>},
            {text:'labelRotate',id:'labelRotate',COMPONENT:()=><LabelRotate points={points} keys={keys}/>},
            {text:'editLabel',id:'editLabel',COMPONENT:()=><EditLabel points={points} keys={keys}/>},


          ]}
        />
      )
    }
}



  

class Data extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class MultiData extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
          },
          {
            color:'dodgerblue',
            points:[
              {x:'January',y:10 + (Math.round(Math.random() * 100))},
              {x:'February',y:20 + (Math.round(Math.random() * 100))},
              {x:'March',y:40 + (Math.round(Math.random() * 100))},
              {x:'April',y:55 + (Math.round(Math.random() * 100))},
              {x:'May',y:50 + (Math.round(Math.random() * 100))},
              {x:'June',y:60 + (Math.round(Math.random() * 100))},
              {x:'July',y:65 + (Math.round(Math.random() * 100))},
              {x:'August',y:50 + (Math.round(Math.random() * 100))},
              {x:'September',y:45 + (Math.round(Math.random() * 100))},
              {x:'October',y:35 + (Math.round(Math.random() * 100))},
            ]
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Data_color extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4'
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4'
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Data_title extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale'
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Data_pointRadius extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Data_pointStrokeWidth extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Data_pointStroke extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3,
            pointStroke:'orange'
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3,
            pointStroke:'orange'
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Data_pointFill extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3,
            pointStroke:'orange',
            pointFill:'lightgreen'
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3,
            pointStroke:'orange',
            pointFill:'lightgreen'
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Data_pointDash extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointStrokeWidth:2,
            pointRadius:6,
            pointStroke:'orange',
            pointFill:'lightgreen',
            pointDash:[3,2]
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:2,
            pointStroke:'orange',
            pointFill:'lightgreen',
            pointDash:[3,2]
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Data_pointText extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3,
            pointStroke:'orange',
            pointFill:'lightgreen',
            pointText:'point.x + " , " + point.y'
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3,
            pointStroke:'orange',
            pointFill:'lightgreen',
            pointText:'point.x + " , " + point.y'
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Data_pointTextStyle extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3,
            pointStroke:'orange',
            pointFill:'lightgreen',
            pointText:'point.x + " , " + point.y',
            pointTextStyle:{fontSize:10,color:'red',top:16}
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3,
            pointStroke:'orange',
            pointFill:'lightgreen',
            pointText:'point.x + " , " + point.y',
            pointTextStyle:{fontSize:10,color:'red',top:16}
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Data_lineWidth extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:[
        {x:'p1',y:10},
        {x:'p2',y:20},
        {x:'p3',y:40},
        {x:'p4',y:10},
        {x:'p5',y:50},
        {x:'p6',y:20},
        {x:'p7',y:90},
        {x:'p8',y:70},
        {x:'p9',y:30},
        {x:'p10',y:70},
      ],
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3,
            lineWidth:3
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            pointStrokeWidth:3,
            lineWidth:3
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Data_lineDash extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            lineDash:[4,3],
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            pointRadius:6,
            lineDash:[4,3]
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}

class Data_areaColor extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            areaColor:'transparent'
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
            areaColor:'transparent'
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class ValueAxis extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys,
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
        valueAxis={{
          gridColor:'#eee',
          title:'amount',
          size:120,
          zoom:true
        }}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
        valueAxis={{
          gridColor:'#eee',
          title:'amount',
          size:120,
          zoom:true
        }}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class Lines extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys,
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
        lines={[
          {key:keys[6],color:'red',dash:[3,3]},
          {key:[keys[2],keys[4]],value:40,color:'blue',dash:[3,3]},
          {key:[keys[1],keys[4]],value:[40,60],color:'orange',dash:[3,3]},
          {value:20,color:'yellow',dash:[3,3]},
        ]}
      />
    )
  }
  code(){
    let {keys} = this.state;
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
        lines={[
          {key:'${keys[6]}',color:'red',dash:[3,3]},
          {key:['${keys[2]}','${keys[4]}'],value:40,color:'blue',dash:[3,3]},
          {key:['${keys[1]}','${keys[4]}'],value:[40,60],color:'orange',dash:[3,3]},
          {value:20,color:'yellow',dash:[3,3]},
        ]}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class BarChart extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys,
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            type:'bar',
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
      />
    )
  }
  code(){
    let {keys} = this.state;
    return (`
      <Chart
        data={[
          {
            type:'bar',
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class BarWidth extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys,
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            type:'bar',
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
        barWidth={50} 
      />
    )
  }
  code(){
    let {keys} = this.state;
    return (`
      <Chart
        data={[
          {
            type:'bar',
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
        barWidth={50} // percent
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class LabelRotate extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys,
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            type:'bar',
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
        labelRotate={45}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            type:'bar',
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
        labelRotate={45}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class EditLabel extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:props.points,
      keys:props.keys,
    }
  }
  preview(){
    let {points,keys} = this.state;
    return (
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
        keyAxis={{
          edit:(label)=>label.slice(0,3)
        }}
        valueAxis={{
          edit:(label)=>label + '%'
        }}
      />
    )
  }
  code(){
    return (`
      <Chart
        data={[
          {
            points,
            color:'#0094D4',
            title:'Sale',
          }
        ]}
        keys={keys}
        keyAxis={{
          edit:(label)=>label.slice(0,3)
        }}
        valueAxis={{
          edit:(label)=>label + '%'
        }}
      />
    `)
  }
  render(){
    return (
      <ChartExample
        preview={()=>this.preview()}
        code={()=>this.code()}
      />
    )
  }
}
class ChartExample extends Component{
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
      size:400,
      html:preview()
    }
  }
  code_layout(){
    let {code} = this.props;
    return {
      flex:1,
      html:(
        <div style={{display:'flex',flexDirection:'column',width:'100%',height:'100%',overflow:'auto',padding:12}}>
          <pre>{`
import React,{Component} from 'react';
import Chart from 'aio-chart'; 

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      points:[
        {x:'p1',y:10},
        {x:'p2',y:20},
        {x:'p3',y:40},
        {x:'p4',y:10},
        {x:'p5',y:50},
        {x:'p6',y:20},
        {x:'p7',y:90},
        {x:'p8',y:70},
        {x:'p9',y:30},
        {x:'p10',y:70},
      ],
      keys:['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10']
    }
  }
  render(){
    let {points,keys} = this.state;
    return (
      <Chart
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
      html:toolbar()
    }
  }
  render(){
    return (
      <RVD
        layout={{
          column:[
            this.tabs_layout(),
            {size:24},
            this.toolbar_layout(),
            this.body_layout()
          ]
        }}
      />
    )
  }
}