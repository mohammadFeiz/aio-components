import React,{Component} from 'react';
import Table from './../../npm/aio-table/aio-table';
import DOC from '../../resuse-components/doc';
import model from './model';
import tree_model from './tree-model';
import {mdiHumanFemale,mdiHumanMale} from '@mdi/js';
import {Icon} from '@mdi/react';
import AIOButton from './../../npm/aio-button/aio-button';
import Slider from './../../npm/aio-slider/aio-slider';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import './index.css';
export default class DOC_AIOForm extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='rowTemplate'
                navs={[
                    {text:'simple',id:'simple',COMPONENT:()=><Simple/>},
                    {text:'showHeader',id:'showHeader',COMPONENT:()=><ShowHeader/>},
                    {text:'excel',id:'excel',COMPONENT:()=><Excel/>},
                    {text:'tree',id:'tree',COMPONENT:()=><Tree/>},
                    {text:'paging',id:'paging',COMPONENT:()=><Paging/>},
                    {text:'paging with onChange',id:'pagingonchange',COMPONENT:()=><PagingOnChange/>},
                    {text:'striped',id:'striped',COMPONENT:()=><Striped/>},
                    {text:'toolbar',id:'toolbar',COMPONENT:()=><Toolbar/>},
                    {text:'rowGap,columnGap',id:'rowGapColumnGap',COMPONENT:()=><RowGapColumnGap/>},
                    {text:'rowTemplate',id:'rowTemplate',COMPONENT:()=><RowTemplate/>},
                    {
                      text:'column properties',id:'column properties',
                      navs:[
                        {text:'column.width',id:'column width',COMPONENT:()=><ColumnWidth/>},  
                        {text:'column.minWidth',id:'column minWidth',COMPONENT:()=><ColumnMinWidth/>},  
                        {text:'toggle,show',id:'column toggleandshow',COMPONENT:()=><ToggleAndShow/>},
                        {text:'column.justify',id:'column justify',COMPONENT:()=><ColumnJustify/>},
                        {text:'column.titleJustify',id:'column titleJustify',COMPONENT:()=><ColumnTitleJustify/>},   
                        {text:'column.cellAttrs',id:'column cellAttrs',COMPONENT:()=><ColumnCellAttrs/>},
                        {text:'column.titleAttrs',id:'column titleAttrs',COMPONENT:()=><ColumnTitleAttrs/>}, 
                        {text:'column.template',id:'column template',COMPONENT:()=><ColumnTemplate/>}, 
                        {text:'column.sort',id:'column sort',COMPONENT:()=><ColumnSort/>},
                        {text:'column.group',id:'column group',COMPONENT:()=><ColumnGroup/>},
                        {text:'column.filter',id:'column filter',COMPONENT:()=><ColumnFilter/>},
                        {text:'column.inlineEdit',id:'column inlineEdit',COMPONENT:()=><ColumnInlineEdit/>},
                        {text:'(before,after,subtext)',id:'column beforeaftersubtext',COMPONENT:()=><ColumnBeforeAfterSubtext/>},
                        {text:'column.storageKey',id:'column storageKey',COMPONENT:()=><ColumnStorageKey/>},
                        
                      ]
                    }
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

  class Tree extends Component {
    constructor(props){
      super(props);
      this.state = {
        model:tree_model
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
            rowChilds='row.childs'
            indent={20}
            rowHeight={36}
            columns={[
              {title:'Name',field:'row.name',treeMode:true},
              {title:'Gender',field:'row.gender'},
              {title:'Date',field:'row.date'},
              {title:'Age',field:'row.age'}
            ]}
          />
          <pre>
            {`
import model from './model';
 
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      model:tree_model
    }
  }
  render(){
    let {model} = this.state;
    return (
      <Table
        rtl={${rtl}}
        model={model}
        rowChilds='row.childs'
        indent={20}
        rowHeight={36}
        columns={[
          {title:'Name',field:'row.name',treeMode:true},
          {title:'Gender',field:'row.gender'},
          {title:'Date',field:'row.date'},
          {title:'Age',field:'row.age'}
        ]}
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
  
  class Paging extends Component {
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
            paging={{
              number:1,
              size:10,
              sizes:[1,5,10,15,20,30,50]
            }}
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
        paging={{
          number:1,
          size:10,
          sizes:[1,5,10,15,20,30,50]
        }}
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

  class PagingOnChange extends Component {
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
            paging={{
              number:1,
              size:10,
              sizes:[1,5,10,15,20,30,50],
              count:100,
              onChange:(obj)=>{
                alert(JSON.stringify(obj))
                return false 
              }
            }}
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
        paging={{
          number:1,
          size:10,
          sizes:[1,5,10,15,20,30,50],
          count:100,
          onChange:(obj)=>{
            alert(JSON.stringify(obj))
            return false 
          }
        }}
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

  class Striped extends Component {
    constructor(props){
      super(props);
      this.state = {
        model,
        striped:'',
        striped_type:false
      }
    }
    render(){
      let {model,striped,striped_type} = this.state;
      let {rtl = false} = this.props;
      return (
        <div className='example doc-aio-table'>
          <div style={{
            position: 'fixed',left: 358,top: 13,display: 'flex',alignItems: 'center'
          }}>
            <AIOButton 
              type='radio'
              options={[
                {text:'false',value:false},
                {text:'true',value:true},
                {text:'color',value:'color'}
              ]}
              value={striped_type}
              onChange={(striped_type)=>this.setState({striped_type})}
            />
            { striped_type === 'color' && <input type='color' value={striped} onChange={(e)=>this.setState({striped:e.target.value})}/>}
          </div>
          <Table
            rtl={rtl}
            model={model}
            striped={striped_type === 'color'?striped:striped_type}
            columns={[
              {title:'Name',field:'row.name'},
              {title:'Gender',field:'row.gender'},
              {title:'Date',field:'row.date'},
              {title:'Age',field:'row.age'}
            ]}
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
        striped={${striped_type === 'color'?striped:striped_type}}
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
            `}
          </pre>
        </div>
      );
    }
  }

  class Toolbar extends Component {
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
            toolbar={()=>{
              return (
                <button>Click Here</button>
              )
            }}
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
        toolbar={()=>{
          return (
            <button>Click Here</button>
          )
        }}
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



  class RowGapColumnGap extends Component {
    constructor(props){
      super(props);
      this.state = {
        model,
        rowGap:1,
        columnGap:1
      }
    }
    render(){
      let {model,rowGap,columnGap} = this.state;
      let {rtl = false} = this.props;
      return (
          <RVD
            layout={{
              column:[
                {
                  align:'v',
                  row:[
                    {size:12},
                    {html:'rowGap'},
                    {
                      flex:1,html:(
                        <Slider 
                          points={[rowGap]} start={0} end={24} onChange={(points)=>this.setState({rowGap:points[0]})} showValue={true}
                            fillStyle={{height:8,background:'dodgerblue'}}
                            lineStyle={{height:12}}
                        />
                      )
                    }
                  ]
                },
                {
                  align:'v',
                  row:[
                    {size:12},
                    {html:'columnGap'},
                    {
                      flex:1,html:(
                        <Slider 
                          points={[columnGap]} start={0} end={24} onChange={(points)=>this.setState({columnGap:points[0]})} showValue={true}
                            fillStyle={{height:8,background:'dodgerblue'}}
                            lineStyle={{height:12}}
                        />
                      )
                    }
                  ]
                },
                {
                  flex:3,row:[
                    {
                      flex:3,html:(
                        <Table
                          rtl={rtl}
                          model={model}
                          rowGap={rowGap}
                          columnGap={columnGap}
                          columns={[
                            {title:'Name',field:'row.name'},
                            {title:'Gender',field:'row.gender'},
                            {title:'Date',field:'row.date'},
                            {title:'Age',field:'row.age'}
                          ]}
                        />
                      )
                    },
                    {
                      scroll:'h',flex:1,html:(
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
        rowGap={${rowGap}}
        columnGap={${columnGap}}
      />
    );
  }
}          
            `}
          </pre>
                      )
                    }
                  ]
                }
              ]
            }}
          />
      );
    }
  }

  class RowTemplate extends Component {
    constructor(props){
      super(props);
      this.state = {
        model,
      }
    }
    getCard(row,detail){
      return (
        <RVD
          layout={{
            style:{height:72,borderRadius:8,background:'dodgerblue',padding:'0 12px',color:'#fff',overflow:'visible',opacity:detail._show === 'relative'?0.5:1,boxShadow:'1px 1px 6px 0px rgba(0,0,0,0.3)'}, 
            column:[
              {flex:1},
              {row:[{html:row.name,align:'v'},{flex:1},{html:row.age,align:'v'}]},
              {flex:1},
              {row:[{html:row.gender,align:'v'},{flex:1},{html:row.date,align:'v'}]},
              {flex:1}
            ]
          }}
        />
      )          
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
          rtl={rtl}
          model={model}
          columns={[
            {title:'Name',field:'row.name',toggle:true},
            {title:'Gender',field:'row.gender',toggle:true,show:false},
            {title:'Date',field:'row.date',toggle:true},
            {title:'Age',field:'row.age',toggle:true}
          ]}
          rowHeight={100}
          rowGap={12}
          rowTemplate={(row,detail)=>this.getCard(row,detail)}
        />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {title:'Name',field:'row.name',toggle:true},
          {title:'Gender',field:'row.gender',toggle:true,show:false},
          {title:'Date',field:'row.date',toggle:true},
          {title:'Age',field:'row.age',toggle:true}
        ]}
      />
    );
  }
}          
            `}
          </pre>
        )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }
  class ColumnWidth extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
            rtl={rtl}
            model={model}
            columns={[
              {title:'Name',field:'row.name'},
              {title:'Gender',field:'row.gender'},
              {title:'Date',field:'row.date'},
              {title:'Age',field:'row.age',width:50}
            ]}
          />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {title:'Age',field:'row.age',width:50}
        ]}
      />
    );
  }
}          
            `}
          </pre>
      )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }


  class ColumnJustify extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
            rtl={rtl}
            model={model}
            columns={[
              {title:'Name',field:'row.name'},
              {title:'Gender',field:'row.gender',justify:true},
              {title:'Date',field:'row.date'},
              {title:'Age',field:'row.age'}
            ]}
          />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {title:'Gender',field:'row.gender',justify:true},
          {title:'Date',field:'row.date'},
          {title:'Age',field:'row.age',width:50}
        ]}
      />
    );
  }
}          
            `}
          </pre>
      )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }


  class ColumnTitleJustify extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
            rtl={rtl}
            model={model}
            columns={[
              {title:'Name',field:'row.name',titleJustify:false},
              {title:'Gender',field:'row.gender',titleJustify:false},
              {title:'Date',field:'row.date',titleJustify:false},
              {title:'Age',field:'row.age',titleJustify:false}
            ]}
          />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {title:'Name',field:'row.name',titleJustify:false},
          {title:'Gender',field:'row.gender',titleJustify:false},
          {title:'Date',field:'row.date',titleJustify:false},
          {title:'Age',field:'row.age',titleJustify:false}
        ]}
      />
    );
  }
}          
            `}
          </pre>
      )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }


  class ColumnMinWidth extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
            rtl={rtl}
            model={model}
            columns={[
              {title:'Name',field:'row.name',width:100,minWidth:100},
              {title:'Gender',field:'row.gender',minWidth:100},
              {title:'Date',field:'row.date',},
              {title:'Age',field:'row.age',width:50}
            ]}
          />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {title:'Name',field:'row.name',width:100,minWidth:100},
          {title:'Gender',field:'row.gender',minWidth:100},
          {title:'Date',field:'row.date',},
          {title:'Age',field:'row.age',width:50}
        ]}
      />
    );
  }
}          
            `}
          </pre>
      )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }

  class ColumnCellAttrs extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
            rtl={rtl}
            model={model}
            columns={[
              {
                title:'Name',field:'row.name',width:100,minWidth:100,
                cellAttrs:()=>{return {className:'hover'}}
              },
              {
                title:'Gender',field:'row.gender',minWidth:100,
                cellAttrs:(row)=>{
                  return {
                    style:{boxShadow:'inset 0 0 8px'},
                    onClick:(row)=>alert(row.gender)
                  }
                }
              },
              {
                title:'Date',field:'row.date'
              },
              {
                title:'Age',field:'row.age',width:50,
                cellAttrs:(row)=>{
                  if(row.age < 25){return {className:'cell-green'}}
                  if(row.age < 35){return {className:'cell-yellow'}}
                  if(row.age < 45){return {className:'cell-orange'}}
                  return {className:'cell-red'}
                }
              }
            ]}
          />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {
            title:'Name',field:'row.name',width:100,minWidth:100,
            cellAttrs:()=>{return {className:'hover'}}
          },
          {
            title:'Gender',field:'row.gender',minWidth:100,
            cellAttrs:(row)=>{
              return {
                style:{boxShadow:'inset 0 0 8px'},
                onClick:(row)=>alert(row.gender)
              }
            }
          },
          {
            title:'Date',field:'row.date'
          },
          {
            title:'Age',field:'row.age',width:50,
            cellAttrs:(row)=>{
              if(row.age < 25){return {className:'cell-green'}}
              if(row.age < 35){return {className:'cell-yellow'}}
              if(row.age < 45){return {className:'cell-orange'}}
              return {className:'cell-red'}
            }
          }
        ]}
      />
    );
  }
}          
            `}
          </pre>
      )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }


  class ColumnTitleAttrs extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
            rtl={rtl}
            model={model}
            columns={[
              {title:'Name',field:'row.name',titleAttrs:{className:'hover'}},
              {title:'Gender',field:'row.gender',titleAttrs:{className:'hover'}},
              {title:'Date',field:'row.date',titleAttrs:{className:'hover'}},
              {title:'Age',field:'row.age',titleAttrs:{className:'hover'}}
            ]}
          />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {title:'Name',field:'row.name',titleAttrs:{className:'hover'}},
          {title:'Gender',field:'row.gender',titleAttrs:{className:'hover'}},
          {title:'Date',field:'row.date',titleAttrs:{className:'hover'}},
          {title:'Age',field:'row.age',titleAttrs:{className:'hover'}}
        ]}
      />
    );
  }
}          
            `}
          </pre>
      )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }


  class ColumnTemplate extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
            rtl={rtl}
            model={model}
            templates={{
              checkbox:(row)=>{
                return <input type='checkbox' value={row.active} onChange={(e)=>{
                  row.active = e.target.checked;
                  this.setState({model})
                }}/>
              },
              age:(row)=>{
                return <input type='range' value={row.age}/> 
              },
              gender:(row)=>{
                return <Icon path={row.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>
              }
            }}
            columns={[
              {template:'checkbox',width:48,justify:true},
              {title:'Name',field:'row.name'},
              {title:'Gender',field:'row.gender',template:'gender'},
              {title:'Date',field:'row.date'},
              {title:'Age',field:'row.age',template:'age'}
            ]}
          />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
        templates={{
          checkbox:(row)=>{
            return <input type='checkbox' value={row.active} onChange={(e)=>{
              row.active = e.target.checked;
              this.setState({model})
            }}/>
          },
          age:(row)=>{
            return <input type='range' value={row.age}/> 
          },
          gender:(row)=>{
            return <Icon path={row.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>
          }
        }}
        columns={[
          {template:'checkbox',width:48,justify:true},
          {title:'Name',field:'row.name'},
          {title:'Gender',field:'row.gender',template:'gender'},
          {title:'Date',field:'row.date'},
          {title:'Age',field:'row.age',template:'age'}
        ]}
      />
    );
  }
}          
            `}
          </pre>
      )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }


  class ColumnSort extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
            rtl={rtl}
            model={model}
            templates={{
              checkbox:(row)=>{
                return <input type='checkbox' value={row.active} onChange={(e)=>{
                  row.active = e.target.checked;
                  this.setState({model})
                }}/>
              },
              age:(row)=>{
                return <input type='range' value={row.age}/> 
              },
              gender:(row)=>{
                return <Icon path={row.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>
              }
            }}
            columns={[
              {title:'Name',field:'row.name',sort:true},
              {title:'Gender',field:'row.gender',sort:true},
              {title:'Date',field:'row.date',sort:true},
              {title:'Age',field:'row.age',sort:true}
            ]}
            setModel={(model)=>this.setState({model})}
          />
      )
    }
    code(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
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
          {title:'Name',field:'row.name',sort:true},
          {title:'Gender',field:'row.gender',sort:true},
          {title:'Date',field:'row.date',sort:true},
          {title:'Age',field:'row.age',sort:true}
        ]}
        setModel={(model)=>this.setState({model})}
      />
    );
  }
}          
            `}
          </pre>
      )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }

  class ColumnGroup extends Component {
    constructor(props){
      super(props);
      this.state = {
        model
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
            rtl={rtl}
            model={model}
            columns={[
              {title:'Name',field:'row.name'},
              {title:'Gender',field:'row.gender',group:true},
              {title:'Date',field:'row.date',sort:true},
              {title:'Age',field:'row.age',sort:true},
              {
                title:'Age Range',group:true,show:false,
                field:(row)=>{
                  if(row.age > 40){return 'High Age'}
                  if(row.age > 30){return 'Mid Age'}
                  return 'Low Age'
                }
              }
            ]}
            setModel={(model)=>this.setState({model})}
          />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {title:'Gender',field:'row.gender',group:true},
          {title:'Date',field:'row.date',sort:true},
          {title:'Age',field:'row.age',sort:true},
          {
            title:'Age Range',group:true,show:false,
            field:(row)=>{
              if(row.age > 40){return 'High Age'}
              if(row.age > 30){return 'Mid Age'}
              return 'Low Age'
            }
          }
        ]}
      />
    );
  }
}          
            `}
          </pre>
      )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }


  class ColumnFilter extends Component {
    constructor(props){
      super(props);
      this.state = {
        model,
        tableSize:600
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
          rtl={rtl}
          model={model}
          columns={[
            {title:'Name',field:'row.name',filter:true},
            {
              title:'Gender',field:'row.gender',
              filter:{
                valueOptions:[
                  {text:'Male',value:'male'},
                  {text:'Female',value:'female'},
                ],
                operators:['equal']
              }
            },
            {type:'date',title:'Date',field:'row.date',filter:true},
            {type:'number',title:'Age',field:'row.age',filter:true}
          ]}
          setModel={(model)=>this.setState({model})}
        />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {title:'Name',field:'row.name',filter:true},
            {
              title:'Gender',field:'row.gender',
              filter:{
                valueOptions:[
                  {text:'Male',value:'male'},
                  {text:'Female',value:'female'},
                ],
                operators:['equal']
              }
            },
            {type:'date',title:'Date',field:'row.date',filter:true},
            {type:'number',title:'Age',field:'row.age',filter:true}
        ]}
      />
    );
  }
}          
            `}
          </pre>
        )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }


  class ColumnInlineEdit extends Component {
    constructor(props){
      super(props);
      this.state = {
        model,
        tableSize:600
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
          rtl={rtl}
          model={model}
          columns={[
            {title:'Name',field:'row.name',inlineEdit:true},
            {title:'Gender',field:'row.gender',inlineEdit:{
              type:'select',
              options:[
                {text:'Male',value:'male'},
                {text:'Female',value:'female'} 
              ]
            }},
            {type:'date',title:'Date',field:'row.date'},
            {type:'number',title:'Age',field:'row.age',inlineEdit:true},
            {
              title:'Activity',justify:true,
              field:'row.active',
              inlineEdit:{type:'checkbox',text:'Active'}
            }
          ]}
          setModel={(model)=>this.setState({model})}
        />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {title:'Name',field:'row.name',inlineEdit:true},
          {
            title:'Gender',field:'row.gender',
            inlineEdit:{
              type:'select',
              options:[
                {text:'Male',value:'male'},
                {text:'Female',value:'female'} 
              ]
            }
          },
          {type:'date',title:'Date',field:'row.date'},
          {type:'number',title:'Age',field:'row.age',inlineEdit:true},
          {
            title:'Activity',justify:true,
            field:'row.active',
            inlineEdit:{type:'checkbox',text:'Active'}
          }
        ]}
      />
    );
  }
}          
            `}
          </pre>
        )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }

  class ColumnBeforeAfterSubtext extends Component {
    constructor(props){
      super(props);
      this.state = {
        model,
        tableSize:600
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
          rtl={rtl}
          model={model}
          columns={[
            {
              title:'Name',field:'row.name',before:'row.gender === "male"?"Mr":"Mrs"',
              after:(row)=>row.gender === 'male'?<Icon path={mdiHumanMale} size={1}/>:<Icon path={mdiHumanFemale} size={1}/>,
              subtext:'row.gender'
            },
            {
              title:'Gender',field:'row.gender',justify:false,
              before:(row)=>row.gender === 'male'?<Icon path={mdiHumanMale} size={1}/>:<Icon path={mdiHumanFemale} size={1}/>
            },
            {title:'Date',field:'row.date'},
            {title:'Age',field:'row.age'}
          ]}
          setModel={(model)=>this.setState({model})}
        />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {
            title:'Name',field:'row.name',before:'row.gender === "male"?"Mr":"Mrs"',
            after:(row)=>row.gender === 'male'?<Icon path={mdiHumanMale} size={1}/>:<Icon path={mdiHumanFemale} size={1}/>,
            subtext:'row.gender'
          },
          {
            title:'Gender',field:'row.gender',justify:false,
            before:(row)=>row.gender === 'male'?<Icon path={mdiHumanMale} size={1}/>:<Icon path={mdiHumanFemale} size={1}/>
          },
          {title:'Date',field:'row.date'},
          {title:'Age',field:'row.age'}
        ]}
      />
    );
  }
}          
            `}
          </pre>
        )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }

  class ToggleAndShow extends Component {
    constructor(props){
      super(props);
      this.state = {
        model,
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
          rtl={rtl}
          model={model}
          columns={[
            {title:'Name',field:'row.name',toggle:true},
            {title:'Gender',field:'row.gender',toggle:true,show:false},
            {title:'Date',field:'row.date',toggle:true},
            {title:'Age',field:'row.age',toggle:true}
          ]}
          setModel={(model)=>this.setState({model})}
        />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {title:'Name',field:'row.name',toggle:true},
          {title:'Gender',field:'row.gender',toggle:true,show:false},
          {title:'Date',field:'row.date',toggle:true},
          {title:'Age',field:'row.age',toggle:true}
        ]}
      />
    );
  }
}          
            `}
          </pre>
        )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }

  class ColumnStorageKey extends Component {
    constructor(props){
      super(props);
      this.state = {
        model,
        tableSize:600
      }
    }
    preview(){
      let {model} = this.state;
      let {rtl = false} = this.props;
      return (
        <Table
          rtl={rtl}
          model={model}
          columns={[
            {type:'text',title:'Name',field:'row.name',filter:true,sort:true,toggle:true,width:200,storageKey:'tcsk-name'},
            {type:'text',title:'Gender',field:'row.gender',filter:true,sort:true,toggle:true,group:true,storageKey:'tcsk-gender'},
            {type:'date',title:'Date',field:'row.date',filter:true,sort:true,toggle:true,storageKey:'tcsk-date'},
            {type:'number',title:'Age',field:'row.age',filter:true,sort:true,toggle:true,storageKey:'tcsk-age'}
          ]}
          setModel={(model)=>this.setState({model})}
        />
      )
    }
    code(){
      let {rtl = false} = this.props;
      return (
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
          {type:'text',title:'Name',field:'row.name',filter:true,sort:true,toggle:true,width:200,storageKey:'tcsk-name'},
          {type:'text',title:'Gender',field:'row.gender',filter:true,sort:true,toggle:true,group:true,storageKey:'tcsk-gender'},
          {type:'date',title:'Date',field:'row.date',filter:true,sort:true,toggle:true,storageKey:'tcsk-date'},
          {type:'number',title:'Age',field:'row.age',filter:true,sort:true,toggle:true,storageKey:'tcsk-age'}
        ]}
      />
    );
  }
}          
            `}
          </pre>
        )
    }
    render(){
      return (
        <TableExample
          preview={()=>this.preview()}
          code={()=>this.code()}
        />
      );
    }
  }


  class TableExample extends Component{
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
          <AIOButton type='tabs' options={tabs} value={tab} onChange={(tab)=>this.setState({tab})}/>
        )
      }
    }
    body_layout(){
      let {preview,code} = this.props;
      let {tab} = this.state;
      return {
        flex:1,
        html:tab === 'preview'?preview():code()
      }
    }

    render(){
      return (
        <RVD
          layout={{
            column:[
              this.tabs_layout(),
              this.body_layout()
            ]
          }}
        />
      )
    }
  }