import React,{Component} from 'react';
import DOC from '../../resuse-components/doc';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import Floater from './../../npm/aio-floater/aio-floater';
import AIOButton from './../../npm/aio-button/aio-button';
export default class DOC_AIOFloater extends Component{
    render(){
      return (
        <DOC
          {...this.props}
          navId='example2'
          navs={[
            {text:'example',id:'example',COMPONENT:()=><Example/>},
            {text:'example2',id:'example2',COMPONENT:()=><Example2/>}
          ]}
        />
      )
    }
}


class Example extends Component{
  state = {screen:[0,0],zoom:1,
    items:[
      this.getItem('1','this is my text 1 and will show in Floater',100,100),
      this.getItem('2','text2',100,300),
      this.getItem('3','text3',300,200)
    ]
  }
  getItem(id,text,left,top){
    return {
      template:(<Box text={text} onRemove={()=>this.setState({items:this.state.items.filter((o)=>o.id !== id)})}/>),
      left,top,id
    }
  }
  render(){
    let {items} = this.state;
    return (
      <Floater
        items={items}
        moveHandleClassName='handle'
      />
    )
  }
}

class Example2 extends Component{
  state = {screen:[0,0],zoom:1,
    items:[
      this.getItem('1','this is my text 1 and will show in Floater',100,100),
      this.getItem('2','text2',100,300),
      this.getItem('3','text3',360,200,[{to:'1',text:'rel1'},{to:'2',text:'rel2'}])
    ]
  }
  getItem(id,text,left,top,relations){
    return {
      template:(<Box text={text} onRemove={()=>this.setState({items:this.state.items.filter((o)=>o.id !== id)})}/>),
      left,top,id,relations
    }
  }
  render(){
    let {items} = this.state;
    return (
      <Floater
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