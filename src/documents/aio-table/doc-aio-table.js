import React,{Component} from 'react';
import Table from './../../npm/aio-table/aio-table';
import DOC from '../../resuse-components/doc';
import model from './model';
export default class DOC_AIOForm extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='showHeader'
                navs={[
                    {text:'simple',id:'simple',COMPONENT:()=><Simple/>},
                    {text:'showHeader',id:'showHeader',COMPONENT:()=><ShowHeader/>},
                ]}
            />
        )
    }
}

class Simple extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    render(){
      let {model} = this.state;
      return (
        <Table
          model={model}
          columns={[
            {title:'Name',field:'row.name'},
            {title:'Gender',field:'row.gender'},
            {title:'Date',field:'row.date'},
            {title:'Age',field:'row.age'}
          ]}
        />
      );
    }
  }
  class ShowHeader extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    render(){
      let {model} = this.state;
      return (
        <Table
          model={model}
          columns={[
            {title:'Name',field:'row.name'},
            {title:'Gender',field:'row.gender'},
            {title:'Date',field:'row.date'},
            {title:'Age',field:'row.age'}
          ]}
          showHeader={false}
        />
      );
    }
  }
  
  