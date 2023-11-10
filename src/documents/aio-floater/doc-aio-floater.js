import React,{Component} from 'react';
import DOC from '../../resuse-components/doc';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import Floater from './../../npm/aio-floater/aio-floater';
export default class DOC_AIOFloater extends Component{
    render(){
      return (
        <DOC
          {...this.props}
          navId='example4'
          nav={{
            items:[
              {text:'Basic',id:'example',render:()=><Example/>},
              {text:'relations',id:'example2',render:()=><Example2/>},
              {text:'group',id:'example3',render:()=><Example3/>},
              {text:'snap',id:'example4',render:()=><Example4/>}
            ]
          }}
        />
      )
    }
}


class Example extends Component{
  state = {screen:[0,0],zoom:1,
    items:[
      {template:'box',id:'1',text:'this is my text 1 and will show in Floater',left:100,top:100,title:'title1'},
      {template:'box',id:'2',text:'text2',left:100,top:300,title:'title2'},
      {template:'box',id:'3',text:'text3',left:360,top:200,title:'title3'}
    ]
  }
  render(){
    let {items} = this.state;
    return (
      <Floater
        templates={{
          box:(item)=>{
            let {items} = this.state;
            let {text,id,title} = item;
            return (
              <Box text={text} title={title} onRemove={()=>this.setState({items:items.filter((o)=>o.id !== id)})}/>
            )
          }
        }}
        items={items}
        moveHandleClassName='handle'
      />
    )
  }
}

class Example2 extends Component{
  state = {screen:[0,0],zoom:1,
    items:[
      {template:'box',id:'1',text:'this is my text 1 and will show in Floater',left:100,top:100,title:'title1'},
      {template:'box',id:'2',text:'text2',left:100,top:300,title:'title2'},
      {template:'box',id:'3',text:'text3',left:360,top:200,title:'title3',relations:[{to:'1',text:'rel1'},{to:'2',text:'rel2'}]}
    ]
  }
  render(){
    let {items} = this.state;
    return (
      <Floater
        templates={{
          box:(item)=>{
            let {items} = this.state;
            let {text,id,title} = item;
            return (
              <Box text={text} title={title} onRemove={()=>this.setState({items:items.filter((o)=>o.id !== id)})}/>
            )
          }
        }}
        items={items}
        moveHandleClassName='handle'
      />
    )
  }
}
class Example3 extends Component{
  state = {screen:[0,0],zoom:1,
    items:[
      {template:'box',id:'1',text:'this is my text 1 and will show in Floater',left:100,top:100,title:'title1',group:'1'},
      {template:'box',id:'2',text:'text2',left:100,top:300,title:'title2',group:'1'},
      {template:'box',id:'3',text:'text3',left:360,top:200,title:'title3',relations:[{to:'1',text:'rel1'},{to:'2',text:'rel2'}],group:'1'}
    ]
  }
  render(){
    let {items} = this.state;
    return (
      <Floater
        templates={{
          box:(item)=>{
            let {items} = this.state;
            let {text,id,title} = item;
            return (
              <Box text={text} title={title} onRemove={()=>this.setState({items:items.filter((o)=>o.id !== id)})}/>
            )
          }
        }}
        items={items}
        moveHandleClassName='handle'
      />
    )
  }
}

class Example4 extends Component{
  state = {screen:[0,0],zoom:1,
    items:[
      {template:'box',id:'1',text:'this is my text 1 and will show in Floater',left:100,top:100,title:'title1'},
      {template:'box',id:'2',text:'text2',left:100,top:300,title:'title2'},
      {template:'box',id:'3',text:'text3',left:360,top:200,title:'title3'}
    ]
  }
  render(){
    let {items} = this.state;
    return (
      <Floater
        templates={{
          box:(item)=>{
            let {items} = this.state;
            let {text,id,title} = item;
            return (
              <Box text={text} title={title} onRemove={()=>this.setState({items:items.filter((o)=>o.id !== id)})}/>
            )
          }
        }}
        snap={[90,90,'#ddd']}
        items={items}
        moveHandleClassName='handle'
      />
    )
  }
}


class Box extends Component{
  render(){
    let {text,onRemove,title = 'title'} = this.props;
    return (
      <RVD
        layout={{
          className:'handle',
          style:{
            userSelect:'none',
            background:'#fff',
            border:'1px solid #ddd',
            width:180,
            display:'flex',
            alignItems:'center',
            justifyContent:'center'
          },
          column:[
            {
              style:{width:'100%',background:'dodgerblue',color:'#fff'},
              row:[
                {size:12},
                {flex:1,html:title},
                {size:24,html:'X',attrs:{onClick:()=>onRemove()},align:'vh'}
              ]
            },
            {html:text,style:{width:'100%',padding:12}}
          ]
        }}
      />
    )
  }
}