import React,{Component} from 'react';
import {Icon} from '@mdi/react';
import {mdiClose,mdiPlusThick} from '@mdi/js';
import Input from './input';
import AIListContext from './list-context';
import './list.css';

export default class List extends Component{
    add(){
      let {columns,list,onChange} = this.props;
      let newItem = {};
      for(let i = 0; i < columns.length; i++){
        let {field} = columns[i];
        newItem[field] = '';
      }
      onChange([newItem,...list])
    }
    change(value,field,row){
      let {onChange,list} = this.props;
      onChange(list.map((o)=>o.id !== row.id?o:{...o,[field]:value}))
    }
    remove(id){
      let {onChange,list} = this.props;
      onChange(list.filter((o)=>o.id !== id))
    }
    dragStart(e,row){
      this.start = row;
    }
    dragOver(e,row){
      e.preventDefault();
    }
    getIndexById(id){
      let {list} = this.props;
      for(let i = 0; i < list.length; i++){
        if(list[i].id === id){return i}
      }
    }
    drop(e,row){
      if(this.start.id === undefined){return}
      if(this.start.id === row.id){return}
      let {onChange,list} = this.props;
      let newList = list.filter((o)=>o.id !== this.start.id);
      let placeIndex = this.getIndexById(row.id);
      newList.splice(placeIndex,0,this.start)
      onChange(newList)
    }
    getContext(){
      return {
        add:this.add.bind(this),
        change:this.change.bind(this),
        remove:this.remove.bind(this),
        dragStart:this.dragStart.bind(this),
        dragOver:this.dragOver.bind(this),
        drop:this.drop.bind(this)
       }
    }
    render(){
      let {columns,list,title} = this.props;
      return (
        <AIListContext.Provider value={this.getContext()}>
          <div className='aio-input-list'>
            <ListToolbar title={title}/>
            <ListHeader columns={columns}/>
            {
              list.map((o,i)=>{
                let {id = 'ailr' + Math.round(Math.random() * 10000000)} = o;
                o.id = id;
                return <ListRow key={id} row={o} columns={columns} rowIndex={i}/>
              })
            }
          </div>  
        </AIListContext.Provider>
        
      )
    }
  }
  class ListToolbar extends Component{
    static contextType = AIListContext;
    render(){
      let {add} = this.context;
      let {title} = this.props;
      return (
        <div className='aio-input-list-toolbar'>
          <div className='aio-input-list-toolbar-title'>{title}</div>
          <div className='aio-input-list-toolbar-add' onClick={()=>add()}>
            <Icon path={mdiPlusThick} size={0.8}/>
          </div>  
        </div>
      )
    }
  }
  class ListHeader extends Component{
    render(){
      let {columns} = this.props;
      return (
        <div className='aio-input-list-header'>
          {
            columns.map((o,i)=>{
              let {title,size,id = 'ailc' + Math.round(Math.random() * 10000000)} = o;
              o.id = id;
              return <ListTitle key={id} size={size} title={title}/>
            })
          }
          <button className='aio-input-list-remove'></button>
        </div>
      )
    }
  }
  class ListTitle extends Component{
    render(){
      let {size,title} = this.props;
      return (
        <div className='aio-input-list-title' style={{width:size?size:undefined,flex:size?undefined:1}}>
          {title}
        </div>
      )
    }
  }
  class ListRow extends Component{
    static contextType = AIListContext;
    render(){
      let {remove,dragStart,dragOver,drop} = this.context;
      let {row,columns} = this.props;
      return (
        <div className='aio-input-list-row' draggable={true} onDragStart={(e)=>dragStart(e,row)} onDragOver={(e)=>dragOver(e,row)} onDrop={(e)=>drop(e,row)}>
          {
            columns.map((column,i)=>{
              let {field,size} = column;
              return <ListCell key={row.id + ' ' + column.id} row={row} field={field} size={size}/>
            })
          }
          <button className='aio-input-list-remove' onClick={()=>remove(row.id)}><Icon path={mdiClose} size={0.8}/></button>
        </div>
      )
    }
  }
  class ListCell extends Component{
    static contextType = AIListContext;
    render(){
      let {change} = this.context;
      let {row,field,size} = this.props;
      return (
        <div className='aio-input-list-cell' style={{width:size?size:undefined,flex:size?undefined:1}}>
          <Input type='text' value={row[field] || ''} onChange={(value)=>change(value,field,row)}/>
        </div>
      )
    }
  }
  