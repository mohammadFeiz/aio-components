import React,{Component,useContext} from 'react';
import {Icon} from '@mdi/react';
import {mdiClose,mdiFileExcel,mdiPlusThick} from '@mdi/js';
import AIOInput from './aio-input';
import AITableContext from './table-context';
import ExportToExcel from '../aio-functions/export-to-excel';
import './table.css';
//column schema
//title,value,size,minSize,justify,type,onChange,cellAttrs,subtext,before,after
export default class Table extends Component{
    constructor(props){
      super(props);
      let {columns = []} = props;
      this.state = {columns:columns.map((o)=>{return {...o,_id:'aitc' + Math.round(Math.random() * 1000000)}})}
    }
    getDynamics({value,row,column,def,rowIndex}){
      if(value === undefined){return def}
      if(typeof value === 'function'){return value({row,column,rowIndex})}
      let result = value;
      if(typeof value === 'string'){
        let {getValue = {}} = this.props;
        if(getValue[value]){result = getValue[value]({row,column,rowIndex})}
        else if(value.indexOf('row.') !== -1){
          try {
            let evalText = `result = ${value}`;
            eval(evalText);
          }
          catch{result = ''}
        }
      }
      if(result === undefined){result = def}
      return result;
    }
    add(){
      let {rows,onChange,onAdd} = this.props;
      if(typeof onAdd === 'function'){onAdd();}
      else if(onAdd && onChange){onChange([onAdd,...rows])} 
    }
    remove(row,index){
      let {rows,onChange,onRemove} = this.props;
      if(typeof onRemove === 'function'){onRemove(row);}
      else if(onRemove && onChange){onChange(rows.filter((o,i)=>{
        if(Array.isArray(o)){return i !== index}
        if(typeof o === 'object'){return o._id !== row._id}
        return row !== o
      }));} 
    }
    exportToExcel(){
      let {rows,excel} = this.props;
      let {columns} = this.state;
      let list = []
      for(let i = 0; i < rows.length; i++){
        let row = rows[i]
        let json = {};
        for(let j = 0; j < columns.length; j++){
          let column = columns[j];
          let {title,excel,value} = column;
          if(excel){
            json[typeof excel === 'string'?excel:title] = this.getDynamics({value,row,column,rowIndex:i})
          }
        }
        list.push(json)  
      }
      ExportToExcel(list,{promptText:typeof excel === 'string'?excel:'Inter Excel File Name'})
    }
    change(value,field,row){
      let {onChange,rows} = this.props;
      row = JSON.parse(JSON.stringify(row));
      let evalText = `${field} = value`;
      eval(evalText);
      onChange(rows.map((o)=>o._id !== row._id?o:row))
    }
    dragStart(e,row){
      this.start = row;
    }
    dragOver(e,row){
      e.preventDefault();
    }
    getIndexById(id){
      let {rows} = this.props;
      for(let i = 0; i < rows.length; i++){
        if(rows[i]._id === id){return i}
      }
    }
    drop(e,row){
      if(this.start._id === undefined){return}
      if(this.start._id === row._id){return}
      let {onChange,rows} = this.props;
      let newRows = rows.filter((o)=>o._id !== this.start._id);
      let placeIndex = this.getIndexById(row._id);
      newRows.splice(placeIndex,0,this.start)
      onChange(newRows)
    }
    getContext(){
      let {onChange,placeholder = 'there is not any items',rowAttrs,headerAttrs,onAdd,onRemove,excel} = this.props;
      let {columns} = this.state;
      let context = {
        columns,getDynamics:this.getDynamics.bind(this),
        placeholder,rowAttrs,headerAttrs
      }
      if(excel){context.exportToExcel = this.exportToExcel.bind(this)}
      if(!!onRemove){context.remove = this.remove.bind(this)}
      if(!!onAdd){context.add = this.add.bind(this)}
      if(typeof onChange === 'function'){
        context = {
          ...context,
          change:this.change.bind(this),
          dragStart:this.dragStart.bind(this),
          dragOver:this.dragOver.bind(this),
          drop:this.drop.bind(this)
        }
      }
      return context
    }
    
    render(){
      let {rows = [],toolbarContent,style} = this.props;
      if(!Array.isArray(rows)){console.error(`aio-input error => in type = "table" , rows prop is not an array`)}
      let Toolbar = <TableToolbar toolbarContent={toolbarContent}/>;
      let Header = <TableHeader/>;
      let Rows = <TableRows rows={rows}/>;
      return (
        <AITableContext.Provider value={this.getContext()}>
          <div className='aio-input-table' style={style}>
            {Toolbar}
            <div className='aio-input-table-unit'>
              {Header}
              {Rows}
            </div>
          </div>  
        </AITableContext.Provider>
      )
    }
  }
  function TableRows({rows}){
    function getRows(){
      return rows.map((o,i)=>{
        let {id = 'ailr' + Math.round(Math.random() * 10000000)} = o;
        o._id = id;
        let isLast = i === rows.length - 1;
        return <TableRow key={id} row={o} rowIndex={i} isLast={isLast}/>
      })
    }
    let {placeholder} = useContext(AITableContext)
    let content;
    if(rows.length){content = getRows()}
    else{content = <div style={{width:'100%',textAlign:'center',padding:12}}>{placeholder}</div>}
    return <div className='aio-input-table-rows'>{content}</div>
  }
  class TableToolbar extends Component{
    static contextType = AITableContext;
    render(){
      let {add,exportToExcel} = this.context;
      let {toolbarContent} = this.props;
      if(!add && !exportToExcel && !toolbarContent){return null}
      return (
        <>
          <div className='aio-input-table-toolbar'>
            <div className='aio-input-table-toolbar-content'>{toolbarContent}</div>
            {
              !!add &&
              <div className='aio-input-table-toolbar-icon' onClick={()=>add()}>
                <Icon path={mdiPlusThick} size={0.8}/>
              </div>
            }
            {
              !!exportToExcel &&
              <div className='aio-input-table-toolbar-icon' onClick={()=>exportToExcel()}>
                <Icon path={mdiFileExcel} size={0.8}/>
              </div>
            }  
          </div>
          <div className='aio-input-table-border-h'></div>
        </>
      )
    }
  }
  class TableHeader extends Component{
    static contextType = AITableContext;
    getTitles(columns){
      return columns.map((o,i)=><TableTitle key={o._id} column={o} isLast={i === columns.length - 1}/>)
    }
    getRemoveTitle(remove){
      if(!remove){return null}
      return <button className='aio-input-table-remove'></button>
    }
    render(){
      let {remove,columns,headerAttrs = {}} = this.context;
      let Titles = this.getTitles(columns);
      let RemoveTitle = this.getRemoveTitle(remove);
      return (
        <>
          <div {...headerAttrs} className={'aio-input-table-header' + (headerAttrs.className?' ' + headerAttrs.className:'')}>{Titles}{RemoveTitle}</div>
          <div className='aio-input-table-border-h'></div>
        </>
      )
    }
  }
  class TableTitle extends Component{
    static contextType = AITableContext;
    render(){
      let {getDynamics} = this.context;
      let {column,isLast} = this.props;
      let size = getDynamics({value:column.size});
      let title = getDynamics({value:column.title,def:''});
      let justify = getDynamics({value:column.justify});
      let minSize = getDynamics({value:column.minSize});
      let titleAttrs = getDynamics({value:column.titleAttrs,column,def:{}});
      return (
        <>
          <div 
            {...titleAttrs}
            className={'aio-input-table-title' + (justify?' aio-input-table-title-justify':'') + (titleAttrs.className?' ' + titleAttrs.className:'')} 
            style={{width:size?size:undefined,flex:size?undefined:1,minWidth:minSize,...titleAttrs.style}}
          >{title}</div>
          {!isLast && <div className='aio-input-table-border-v'></div>}
        </>
      )
    }
  }
  class TableRow extends Component{
    static contextType = AITableContext;
    getCells(columns,row,rowIndex){
      let {change,getDynamics} = this.context;
      return columns.map((column,i)=>{
        let {size,minSize,cellAttrs,justify,template,subtext,before,after,type,options} = column;
        let GetDynamics = (value,def)=>getDynamics({value,row,column,def,rowIndex});
        let value = GetDynamics(column.value);
        let onChange;
        if(column.onChange){onChange = (value)=>column.onChange({value,row,column})}
        else if(change){onChange = (value)=>change(value,column.value,row)}
        let key = row._id + ' ' + column._id;
        return (
          <TableCell 
            {...column}
            options={GetDynamics(options)}
            size={GetDynamics(size)}
            minSize={GetDynamics(minSize)}
            type={GetDynamics(type,'text')}
            attrs={GetDynamics(cellAttrs,{})}
            justify={GetDynamics(justify)}
            template={GetDynamics(template)}
            subtext={GetDynamics(subtext)}
            before={GetDynamics(before)}
            after={GetDynamics(after)}
            onChange={onChange}
            key={key}  
            row={row} column={column} value={value}
            isLast={i === columns.length - 1}
          />
        )
      })
    }
    getRemoveCell(row){
      let {remove} = this.context;
      if(!remove){return null}
      return <button className='aio-input-table-remove' onClick={()=>remove(row)}><Icon path={mdiClose} size={0.8}/></button>
    }
    getProps(row,rowIndex){
      let {dragStart,dragOver,drop,rowAttrs = ()=>{return {}}} = this.context;
      let attrs = rowAttrs({row,rowIndex});
      let props = {
        ...attrs,
        className:'aio-input-table-row' + (attrs.className?' ' + attrs.className:'')
      }
      if(!!dragStart){
        props = {
          ...props,
          draggable:true,
          onDragStart:(e)=>dragStart(e,row),
          onDragOver:(e)=>dragOver(e,row),
          onDrop:(e)=>drop(e,row)
        }
      }
      return props;
    }
    render(){
      let {columns} = this.context;
      let {row,isLast,rowIndex} = this.props;
      let cells = this.getCells(columns,row,rowIndex);
      let removeCell = this.getRemoveCell(row);
      let props = this.getProps(row,rowIndex);
      return (
        <>
          <div {...props}>{cells}{removeCell}</div>
          {!isLast && <div className='aio-input-table-border-h'></div>}
        </>
      )
    }
  }
  class TableCell extends Component{
    static contextType = AITableContext;
    getProps(){
      let {size,minSize,attrs,justify,isLast} = this.props;
      return {
        ...attrs,isLast,
        className:'aio-input-table-cell' + (justify?' aio-input-table-cell-justify':'') + (attrs.className?' ' + attrs.className:''),
        style:{width:size?size:undefined,flex:size?undefined:1,...attrs.style,minWidth:minSize},
      }
    }
    getInputProps(){
      let {value,onChange,subtext,before,after,type,options,row} = this.props;
      return {
        ...this.props,
        subtext,before,after,type,value,onChange,options
      }
    }
    getContent(){
      let {column,template} = this.props;
      if(template !== undefined){return template}
      let inputProps = this.getInputProps(column);
      return <AIOInput {...inputProps}/>
    }
    render(){
      let props = this.getProps();
      return (
        <>
          <div {...props} >
            {this.getContent()}    
          </div>
          {!props.isLast && <div className='aio-input-table-border-v'></div>}
        </>
      )
    }
  }
  