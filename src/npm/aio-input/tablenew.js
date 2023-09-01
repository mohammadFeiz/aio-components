import React,{Component,useContext,createRef,useReducer, useEffect,useState} from 'react';
import {Icon} from '@mdi/react';
import {mdiArrowUp, mdiArrowDown,mdiSort,mdiClose,mdiFileExcel,mdiMagnify,mdiPlusThick} from '@mdi/js';
import AIOInput from './aio-input';
import AITableContext from './table-context';
import ExportToExcel from '../aio-functions/export-to-excel';
import AIODate from '../aio-date/aio-date';
import $ from 'jquery';
import './table.css';
//column schema
//title,value,size,minSize,justify,type,onChange,cellAttrs,subtext,before,after
function TableReducer(state,action){
  return {...state,[action.key]:action.value}
}
function Table(props = {}){
  let Sort = new SortClass({
    getProps:()=>props,
    getState:()=>state,
    dispatch:(obj)=>dispatch(obj),
    getRows:()=>rows
  })
  let start;
  let columns = props.columns.map((o)=>{return {...o,_id:'aitc' + Math.round(Math.random() * 1000000),sort:o.sort === true?{}:o.sort}})
  function getDynamics({value,row,column,def,rowIndex}){
    if(value === undefined){return def}
    if(typeof value === 'function'){return value({row,column,rowIndex})}
    let result = value;
    if(typeof value === 'string'){
      let {getValue = {}} = props;
      if(getValue[value]){result = getValue[value]({row,column,rowIndex})}
      else if(value.indexOf('row.') !== -1){try {eval(`result = ${value}`);}catch{result = ''}}
    }
    return result === undefined?def:result;
  }
  function setRows(rows){props.onChange(rows)}
  function setCell(row,column,value){
    if(column.onChange){column.onChange({value,row,column})}
    else{
      let {setRows} = state;
      let rows = rows;
      row = JSON.parse(JSON.stringify(row));
      eval(`${column.value} = value`);
      setRows(rows.map((o)=>o._id !== row._id?o:row))
    }
  }
  let dom = createRef();
  let [state,dispatch] = useReducer(TableReducer,{
    columns,sorts:[],getDynamics,setRows,setCell
  })
  function getColumns(){
    let {columns} = state;
    return columns;
  }
  function getRows(){
    let {sorts} = state;
    let {rows = [],paging:p} = props;
    let sortedRows = Sort.getSortedRows(rows,sorts);
    if(!sortedRows){
      debugger
      sortedRows = Sort.getSortedRows(rows,sorts)
    }
    return p && !p.serverSide?sortedRows.slice((p.number - 1) * p.size,p.number * p.size):sortedRows;
  }
  function add(){
    let {onAdd} = props,{setRows} = state;
    if(typeof onAdd === 'function'){onAdd();}
    else if(typeof onAdd === 'object'){setRows([onAdd,...rows])} 
  }
  function remove(row,index){
    let {onRemove} = props,{setRows} = state;
    if(typeof onRemove === 'function'){onRemove(row);}
    else if(onRemove === true){setRows(rows.filter((o,i)=>o._id !== row._id));} 
  }
  function exportToExcel(){
    let {excel} = props,list = [];
    let {getDynamics} = state;
    let columns = getColumns();
    for(let i = 0; i < rows.length; i++){
      let row = rows[i],json = {};
      for(let j = 0; j < columns.length; j++){
        let column = columns[j],{title,excel,value} = column;
        if(excel){json[typeof excel === 'string'?excel:title] = getDynamics({value,row,column,rowIndex:i})}
      }
      list.push(json)  
    }
    ExportToExcel(list,{promptText:typeof excel === 'string'?excel:'Inter Excel File Name'})
  }
  function dragStart(e,row){start = row;}
  function dragOver(e,row){e.preventDefault();}
  function getIndexById(rows,id){for(let i = 0; i < rows.length; i++){if(rows[i]._id === id){return i}}}
  function drop(e,row){
    if(start._id === undefined){return}
    if(start._id === row._id){return}
    let {onSwap} = props,{setRows} = state;
    let newRows = rows.filter((o)=>o._id !== start._id);
    let placeIndex = getIndexById(rows,row._id);
    newRows.splice(placeIndex,0,start)
    if(typeof onSwap === 'function'){onSwap({newRows,from:{...start},to:row})}
    else{setRows(newRows)}
  }
  function getContext(){
    let {onSearch,placeholder = 'there is not any items',rowAttrs,headerAttrs,onAdd,onRemove,excel,onSwap,rowGap,columnGap} = props;
    let {sorts} = state;
    let columns = getColumns();
    let context = {
      ...state,
      parentDom:dom,dispatch,sorts,Sort,
      RowGap:<div className='aio-input-table-border-h' style={{height:rowGap}}></div>,
      ColumnGap:<div className='aio-input-table-border-v' style={{width:columnGap}}></div>,
      columns,placeholder,rowAttrs,headerAttrs,onSearch,rows
    }
    if(excel){context.exportToExcel = exportToExcel}
    if(!!onRemove){context.remove = remove}
    if(!!onAdd){context.add = add}
    if(onSwap){context = {...context,dragStart,dragOver,drop}}
    return context
  }
  useEffect(()=>{
    let columns = getColumns();
    dispatch({key:'sorts',value:Sort.initiateSortsByColumns(columns)})
  },[])
  let {toolbar,style,paging,rowTemplate,rowAfter,rowBefore,toolbarAttrs = {}} = props;
  let rows = getRows();
  if(!Array.isArray(rows)){console.error(`aio-input error => in type = "table" , rows prop is not an array`)}
  let Toolbar = <TableToolbar toolbar={toolbar} toolbarAttrs={toolbarAttrs}/>;
  let Paging = paging?<TablePaging paging={paging} rows={rows}/>:''
  let Header = <TableHeader/>;
  let Rows = <TableRows rows={rows} rowTemplate={rowTemplate} rowAfter={rowAfter} rowBefore={rowBefore}/>;
  let TABLE = <div className='aio-input-table-unit'>{Header} {Rows}</div>
  let context = getContext();
  return (
    <AITableContext.Provider value={context}>
      <div ref={dom} className='aio-input-table' style={style}>{Toolbar}{TABLE}{Paging}</div>  
    </AITableContext.Provider>
  )
}
export default Table
  function TablePaging(props){
    function fix(paging){
      let {number,size = 20,length = 0,sizes = [1,5,10,15,20,30,50,70,100]} = paging
      if(sizes.indexOf(size) === -1){size = sizes[0]}
      let pages = Math.ceil(length / size);
      number = number > pages ? pages : number;
      number = number < 1?1:number;
      let start = number - 3;
      let end = number + 3;
      return {...paging,length,pages,number,size,sizes,start,end}
    }
    let paging = fix(props.paging)
    function changePaging(obj){paging.onChange({...paging,...obj})}
    let {rtl,pages,number,size,sizes,start,end} = paging;
    let buttons = [];
    for(let i = start; i <= end; i++){
      if(i < 1 || i > pages){
        buttons.push(<button key={i} className={'aio-input-table-paging-button aio-input-table-paging-button-hidden'}>{i}</button>)
      }
      else{
        buttons.push(<button key={i} className={'aio-input-table-paging-button' + (i === number?' active':'')} onClick={()=>changePaging({number:i})}>{i}</button>)
      }
    }
    return (
      <div className='aio-input-table-paging' style={{direction:rtl?'rtl':'ltr'}}>
        {buttons}
        {
          sizes.length &&
          <AIOInput
            className='aio-input-table-paging-button aio-input-table-paging-size'
            type='select' value={size} options={sizes} optionText='option' optionValue='option'
            onChange={(value)=>changePaging({size:value})}
          />
        }
      </div>
    )
  }
  function TableRows({rows,rowTemplate,rowAfter = ()=>null,rowBefore = ()=>null}){
    function getRows(){
      return rows.map((o,i)=>{
        let {id = 'ailr' + Math.round(Math.random() * 10000000)} = o;
        o._id = id;
        let isLast = i === rows.length - 1,Row;
        if(rowTemplate){Row = rowTemplate({row:o,rowIndex:i,isLast})}
        else {Row = <TableRow key={id} row={o} rowIndex={i} isLast={isLast}/>}
        return (<>{rowBefore({row:o,rowIndex:i})}{Row}{rowAfter({row:o,rowIndex:i})}</>)
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
      let {add,exportToExcel,onSearch,RowGap,sorts,Sort} = this.context;
      let {toolbar,toolbarAttrs} = this.props;
      if(!add && !exportToExcel && !toolbar && !onSearch && !sorts.length){return null}
      return (
        <>
          <div {...toolbarAttrs} className={'aio-input-table-toolbar' + (toolbarAttrs.className?' ' + toolbarAttrs.className:'')}>
            {toolbar && <div className='aio-input-table-toolbar-content'>{toolbar}</div>}
            <div className='aio-input-table-search'>
              {!!onSearch && <AIOInput type='text' onChange={(value)=>onSearch(value)} after={<Icon path={mdiMagnify} size={1}/>}/>}
            </div>
            {Sort.getSortButton(sorts)}
            {
              !!exportToExcel &&
              <div className='aio-input-table-toolbar-icon' onClick={()=>exportToExcel()}><Icon path={mdiFileExcel} size={0.8}/></div>
            }
            {!!add && <div className='aio-input-table-toolbar-icon' onClick={()=>add()}><Icon path={mdiPlusThick} size={0.8}/></div>}
            
          </div>
          {RowGap}
        </>
      )
    }
  }
  class TableHeader extends Component{
    static contextType = AITableContext;
    render(){
      let {remove,columns,headerAttrs = {},RowGap} = this.context;
      let Titles = columns.map((o,i)=><TableTitle key={o._id} column={o} isLast={i === columns.length - 1}/>);
      let RemoveTitle = !remove?null:<button className='aio-input-table-remove'></button>;
      return (
        <>
          <div {...headerAttrs} className={'aio-input-table-header' + (headerAttrs.className?' ' + headerAttrs.className:'')}>{Titles}{RemoveTitle}</div>
          {RowGap}
        </>
      )
    }
  }
  class TableTitle extends Component{
    static contextType = AITableContext;
    render(){
      let {getDynamics:gd,ColumnGap} = this.context;
      let {column,isLast} = this.props;
      let {size:s,title:t,justify:j,minSize:m,titleAttrs:ta} = column;
      let size = gd({value:s}),title = gd({value:t,def:''}),justify = gd({value:j}),minSize = gd({value:m}),titleAttrs = gd({value:ta,column,def:{}});
      return (
        <>
          <div 
            {...titleAttrs}
            className={'aio-input-table-title' + (justify?' aio-input-table-title-justify':'') + (titleAttrs.className?' ' + titleAttrs.className:'')} 
            style={{width:size?size:undefined,flex:size?undefined:1,minWidth:minSize,...titleAttrs.style}}
          >{title}</div>
          {!isLast && ColumnGap}
        </>
      )
    }
  }
  class TableRow extends Component{
    static contextType = AITableContext;
    getCells(columns,row,rowIndex){
      let {getDynamics} = this.context;
      return columns.map((column,i)=>{
        let {size,minSize,cellAttrs,justify,template,subtext,before,after,type,options} = column;
        let gd = (value,def)=>getDynamics({value,row,column,def,rowIndex});
        let value = gd(column.value);
        let key = row._id + ' ' + column._id;
        return (
          <TableCell 
            {...column} isLast={i === columns.length - 1}
            options={gd(options)} size={gd(size)} minSize={gd(minSize)} type={gd(type,'text')}
            attrs={gd(cellAttrs,{})} justify={gd(justify)} template={gd(template)} subtext={gd(subtext)}
            before={gd(before)} after={gd(after)} key={key} row={row} column={column} value={value}
          />
        )
      })
    }
    getRemoveCell(row,remove){
      return !remove?null:<button className='aio-input-table-remove' onClick={()=>remove(row)}><Icon path={mdiClose} size={0.8}/></button>
    }
    getProps(row,rowIndex){
      let {dragStart,dragOver,drop,rowAttrs = ()=>{return {}}} = this.context;
      let attrs = rowAttrs({row,rowIndex});
      let props = {...attrs,className:'aio-input-table-row' + (attrs.className?' ' + attrs.className:'')}
      if(!!dragStart){props = {...props,draggable:true,onDragStart:(e)=>dragStart(e,row),onDragOver:(e)=>dragOver(e,row),onDrop:(e)=>drop(e,row)}}
      return props;
    }
    render(){
      let {columns,remove,RowGap} = this.context;
      let {row,isLast,rowIndex} = this.props;
      let cells = this.getCells(columns,row,rowIndex);
      let removeCell = this.getRemoveCell(row,remove);
      let props = this.getProps(row,rowIndex);
      return (
        <>
          <div {...props}>{cells}{removeCell}</div>
          {!isLast && RowGap}
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
      let {setCell} = this.context;
      let {value,subtext,before,after,type,options,row,column} = this.props;
      return {...this.props,subtext,before,after,type,value,onChange:(value)=>setCell(row,column,value),options}
    }
    getContent(){
      let {column,template} = this.props;
      if(template !== undefined){return template}
      let inputProps = this.getInputProps(column);
      return <AIOInput {...inputProps}/>
    }
    render(){
      let {ColumnGap} = this.context;
      let props = this.getProps();
      return (
        <>
          <div {...props} >{this.getContent()}</div>
          {!props.isLast && ColumnGap}
        </>
      )
    }
  }


  class SortClass{
    constructor({getProps,getState,dispatch,getRows}){
      this.getProps = getProps;
      this.getState = getState;
      this.dispatch = dispatch;
      this.getRows = getRows;
    }
    setSort = (sortId,changeObject) => {
      let {sorts} = this.getState();
      let newSorts = sorts.map((sort)=>{
        if(sort.sortId === sortId){
          let newSort = {...sort,...changeObject}
          return newSort;
        }
        return sort
      });
      this.setSorts(newSorts)
    }
    setSorts = async (sorts) => {
      let {onChangeSort} = this.getProps();
      let {setRows} = this.getState();
      if(onChangeSort){
        let res = await onChangeSort(sorts)
        if(res !== false){this.dispatch({key:'sorts',value:sorts});}
      }
      else{
        this.dispatch({key:'sorts',value:sorts});
        let activeSorts = sorts.filter((sort)=>sort.active !== false);
        if(activeSorts.length){
          setRows(this.sort(this.getRows(),activeSorts))
        }
      }
    }
    getSortedRows = (rows,sorts) => {
      if(this.initialSort){if(!rows){debugger} return rows}
      let {onChangeSort} = this.getProps();
      let {setRows} = this.getState();
      if(onChangeSort){if(!rows){debugger} return rows}
      let activeSorts = sorts.filter((sort)=>sort.active !== false);
      if(!activeSorts.length){if(!rows){debugger} return rows}
      if(rows.length){this.initialSort = true; setRows(this.sort(rows,activeSorts))}
      else{if(!rows){debugger} return rows;}
    }
    sort = (rows = [],sorts = []) => {
      if(!sorts.length){return rows}
      return rows.sort((a,b)=>{
        for (let i = 0; i < sorts.length; i++){
          let {dir,getValue} = sorts[i];
          let aValue = getValue(a),bValue = getValue(b);
          if ( aValue < bValue ){return -1 * (dir === 'dec'?-1:1);}
          if ( aValue > bValue ){return 1 * (dir === 'dec'?-1:1);}
          if(i === sorts.length - 1){return 0;}
        }
        return 0;
      });
    }
    initiateSortsByColumns = (columns) => {
      let {getDynamics} = this.getState();
      let sorts = [];
      for(let i = 0; i < columns.length; i++){
        let column = columns[i];
        let {sort,_id,type} = column;
        if(!sort){continue}
        let {active = true,dir = 'dec'} = sort;
        let getValue = (row)=>{
          let value = getDynamics({value:column.value,row,column})
          if(type === 'date'){value = AIODate().getTime(value);}
          return value
        }
        sorts.push({dir,title:sort.title || column.title,sortId:_id,active,type,getValue})
      }
      return sorts;
    }
    getSortOption = (sort) => {
      let {active,dir = 'dec',title,sortId} = sort;
      return {
        text:title,checked:!!active,close:false,
        after:(
          <Icon 
            path={dir === 'dec'?mdiArrowDown:mdiArrowUp} size={0.8}
            onClick={(e)=>{e.stopPropagation(); this.setSort(sortId,{dir:dir === 'dec'?'inc':'dec'})}} 
          />
        ),
        onClick:()=>this.setSort(sortId,{active:active?false:true})
      }
    }
    getSortButton(sorts){
      if(!sorts.length){return null}
      let sortOptions = sorts.map((sort)=>this.getSortOption(sort));
      return (
        <AIOInput 
          popover={{
            header:<div style={{padding:'6px 12px'}}>sort</div>,
            openRelatedTo:'.aio-input-table'
          }}
          key='sortbutton' caret={false} type='select' options={sortOptions} className='aio-input-table-toolbar-icon'
          text={<Icon path={mdiSort} size={0.7}/>}
          onSwap={(from,to,swap)=>this.setSorts(swap(sorts,from,to))}
        />
      )
    }
  }