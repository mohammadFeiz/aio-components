import React,{Component} from 'react';
import Table from './../../npm/aio-table/aio-table';
import DOC from '../../resuse-components/doc';
import model from './model';
import './index.css';
export default class DOC_AIOForm extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='excel'
                navs={[
                    {text:'simple',id:'simple',COMPONENT:()=><Simple/>},
                    {text:'showHeader',id:'showHeader',COMPONENT:()=><ShowHeader/>},
                    {text:'excel',id:'excel',COMPONENT:()=><Excel/>},
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
      let {rtl = false} = this.props;
      return (
        <div className='example doc-aio-table'>
          <Table
            rtl={rtl}
            model={model}
            columns={[
              {title:'Name',field:'row.name'},
              {title:'Gender',field:'row.gender'},
              {title:'Date',field:'row.date'},
              {title:'Age',field:'row.age'}
            ]}
            showHeader={false}
          />
          <pre>
            {`
import model from './model';

class App extends Component {
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
        rtl={${rtl}}
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
            `}
          </pre>
        </div>
      );
    }
  }
  
  class Excel extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    render(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <div className='example doc-aio-table'>
          <Table
            rtl={rtl}
            model={model}
            columns={[
              {title:'Name',field:'row.name'},
              {title:'Gender',field:'row.gender'},
              {title:'Date',field:'row.date'},
              {title:'Age',field:'row.age'}
            ]}
            excel={true}
          />
          <pre>
            {`
import model from './model';
 
class App extends Component {
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
        rtl={${rtl}}
        model={model}
        columns={[
          {title:'Name',field:'row.name'},
          {title:'Gender',field:'row.gender'},
          {title:'Date',field:'row.date'},
          {title:'Age',field:'row.age'}
        ]}
        excel={true}
      />
    );
  }
}          
            `}
          </pre>
        </div>
      );
    }
  }
  
  
