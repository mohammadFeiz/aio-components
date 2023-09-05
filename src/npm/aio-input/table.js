import React,{Component,useContext,createRef,Fragment,useMemo} from 'react';
import {Icon} from '@mdi/react';
import {mdiArrowUp, mdiArrowDown,mdiSort,mdiClose,mdiFileExcel,mdiMagnify,mdiPlusThick} from '@mdi/js';
import AIOInput from './aio-input';
import AITableContext from './table-context';
import ExportToExcel from '../aio-functions/export-to-excel';
import AIODate from '../aio-date/aio-date';
import Search from '../aio-functions/search';
import $ from 'jquery';
import './table.css';
//column schema
//title,value,width,minWidth,justify,type,onChange,cellAttrs,subtext,before,after
export default class Table extends Component{
    constructor(props){
      super(props);
      this.dom = createRef();
      let Sort = new SortClass({
        getProps:()=>this.props,
        getState:()=>this.state,
        setState:(obj)=>this.setState(obj),
      })
      let {columns = []} = props;
      let searchColumns = [];
      let updatedColumns = columns.map((o)=>{
        let {id = 'aitc' + Math.round(Math.random() * 1000000),sort,search} = o;
        o._id = id;
        sort = sort === true?{}:sort;
        let column = {...o,sort};
        if(search){searchColumns.push(column)}
        return column
      })
      this.state = {
        searchValue:'',
        columns:updatedColumns,
        searchColumns,
        sorts:[],Sort,
        getDynamics:({value,row,column,def,rowIndex})=>{
          if(value === undefined){return def}
          if(typeof value === 'function'){return value({row,column,rowIndex})}
          let result = value;
          if(typeof value === 'string'){
            let {getValue = {}} = this.props;
            if(getValue[value]){result = getValue[value]({row,column,rowIndex})}
            else if(value.indexOf('row.') !== -1){try {eval(`result = ${value}`);}catch{result = ''}}
          }
          return result === undefined?def:result;
        },
        setRows:(rows)=>{
          let {onChange} = this.props;
          onChange(rows);
        },
        setCell:(row,column,value)=>{
          if(column.onChange){column.onChange({value,row,column})}
          else{
            let {setRows} = this.state;
            let {rows} = this.props;
            row = JSON.parse(JSON.stringify(row));
            eval(`${column.value} = value`);
            setRows(rows.map((o)=>o._id !== row._id?o:row))
          }
        }
      }
    }
    componentDidMount(){
      let {columns,Sort} = this.state;
      this.setState({sorts:Sort.initiateSortsByColumns(columns)})
    }
    add(){
      let {onAdd} = this.props,{setRows} = this.state;
      if(typeof onAdd === 'function'){onAdd();}
      else if(typeof onAdd === 'object'){setRows([onAdd,...this.props.rows])} 
    }
    remove(row,index){
      let {onRemove,rows} = this.props,{setRows} = this.state;
      if(typeof onRemove === 'function'){onRemove(row);}
      else if(onRemove === true){setRows(rows.filter((o,i)=>o._id !== row._id));} 
    }
    exportToExcel(){
      let {excel} = this.props,list = [];
      let {rows} = this.props;
      let {getDynamics,columns} = this.state;
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
    dragStart(e,row){this.start = row;}
    dragOver(e,row){e.preventDefault();}
    getIndexById(rows,id){for(let i = 0; i < rows.length; i++){if(rows[i]._id === id){return i}}}
    drop(e,row){
      if(this.start._id === undefined){return}
      if(this.start._id === row._id){return}
      let {onSwap} = this.props,{setRows} = this.state;
      let {rows} = this.props;
      let newRows = rows.filter((o)=>o._id !== this.start._id);
      let placeIndex = this.getIndexById(rows,row._id);
      newRows.splice(placeIndex,0,this.start)
      if(typeof onSwap === 'function'){onSwap({newRows,from:{...this.start},to:row})}
      else{setRows(newRows)}
    }
    getSearchedRows(rows){
      let {onSearch} = this.props;
      if(onSearch !== true){return rows}
      let {searchColumns,searchValue,getDynamics} = this.state;
      if(!searchColumns.length || !searchValue){return rows}
      return Search(rows,searchValue,(row,index)=>{
        let str = '';
        for(let i = 0; i < searchColumns.length; i++){
          let column = searchColumns[i];
          let value = getDynamics({value:column.value,row,def:'',column,rowIndex:index});
          if(value){str += value + ' '}
        }
        return str
      })
    }
    getRows(){
      let {Sort} = this.state;
      let {rows = [],paging:p} = this.props;
      let searchedRows = this.getSearchedRows(rows);
      let sortedRows = Sort.getSortedRows(searchedRows);
      let pagedRows = p && !p.serverSide?sortedRows.slice((p.number - 1) * p.size,p.number * p.size):sortedRows;
      return {rows,searchedRows,sortedRows,pagedRows}
    }
    //calculate style of cells and title cells
    getCellStyle({row,rowIndex,column,type}){
      let {getDynamics} = this.state;
      let width = getDynamics({value:column.width});
      let minWidth = getDynamics({value:column.minWidth});
      let style = {width:width?width:undefined,flex:width?undefined:1,minWidth}
      if(type === 'cell'){
        let cellAttrs = getDynamics({value:column.cellAttrs,column,row,rowIndex,def:{}});
        return {...style,...cellAttrs.style}
      }
      else if(type === 'title'){
        let titleAttrs = getDynamics({value:column.titleAttrs,column,def:{}});
        return {...style,...titleAttrs.style}
      }
    }
    getTitleAttrs(column){
      let {getDynamics} = this.state;
      let titleAttrs = getDynamics({value:column.titleAttrs,column,def:{}});
      let justify = getDynamics({value:column.justify,def:false});
      let className = 'aio-input-table-title' + (justify?' aio-input-table-title-justify':'') + (titleAttrs.className?' ' + titleAttrs.className:'')
      let style = this.getCellStyle({column,type:'title'})
      let title = getDynamics({value:column.title,def:''})
      return {...titleAttrs,style,className,title}
    }
    getCellAttrs({row,rowIndex,column}){
      let {getDynamics} = this.state;
      let cellAttrs = getDynamics({value:column.cellAttrs,column,row,rowIndex,def:{}});
      let justify = getDynamics({value:column.justify,row,rowIndex,def:false});
      let className = 'aio-input-table-cell' + (justify?' aio-input-table-cell-justify':'') + (cellAttrs.className?' ' + cellAttrs.className:'')
      let style = this.getCellStyle({row,rowIndex,column,type:'cell'})
      return {...cellAttrs,style,className}
    }
    getRowAttrs(row,rowIndex){
      let {rowAttrs = ()=>{return {}},onSwap} = this.props;
      let attrs = rowAttrs({row,rowIndex});
      let obj = {...attrs,className:'aio-input-table-row' + (attrs.className?' ' + attrs.className:'')}
      if(!!onSwap){obj = {...obj,draggable:true,onDragStart:(e)=>this.dragStart(e,row),onDragOver:(e)=>this.dragOver(e,row),onDrop:(e)=>this.drop(e,row)}}
      return obj;
    }
    getCellContent({row,rowIndex,column}){
      let {getDynamics,setCell} = this.state;
      let template = getDynamics({value:column.template,row,rowIndex,column}); 
      if(template !== undefined){return template}
      let props = {
        ...column,
        value:getDynamics({value:column.value,row,rowIndex,column}), 
        options:getDynamics({value:column.options,row,rowIndex,column}),  
        type:getDynamics({value:column.type,row,rowIndex,column,def:'text'}),
        subtext:getDynamics({value:column.subtext,row,rowIndex,column}), 
        before:getDynamics({value:column.before,row,rowIndex,column}), 
        after:getDynamics({value:column.after,row,rowIndex,column}),
        onChange:(value)=>setCell(row,column,value),
      }
      return <AIOInput {...props}/>
    }
    search(searchValue){
      let {onSearch} = this.props;
      if(onSearch === true){this.setState({searchValue})}
      else {onSearch(searchValue)}
    }
    getContext(ROWS){
      let {rowGap,columnGap} = this.props;
      let context = {
        ROWS,
        props:{...this.props},
        state:{...this.state},
        parentDom:this.dom,
        SetState:(obj)=>this.setState(obj),
        getTitleAttrs:this.getTitleAttrs.bind(this),
        getCellAttrs:this.getCellAttrs.bind(this),
        getRowAttes:this.getRowAttrs.bind(this),
        getCellContent:this.getCellContent.bind(this),
        add:this.add.bind(this),
        remove:this.remove.bind(this),
        search:this.search.bind(this),
        exportToExcel:this.exportToExcel.bind(this),
        RowGap:<div className='aio-input-table-border-h' style={{height:rowGap}}></div>,
        ColumnGap:<div className='aio-input-table-border-v' style={{width:columnGap}}></div>,
      }
      return context
    }
    render(){
      let {paging,attrs = {}} = this.props;
      let ROWS = this.getRows();
      return (
        <AITableContext.Provider value={this.getContext(ROWS)}>
          <div {...attrs} ref={this.dom} className={'aio-input-table' + (attrs.className?' ' + attrs.className:'')}>
            <TableToolbar/>
            <div className='aio-input-table-unit'><TableHeader/><TableRows/></div>
            {paging?<TablePaging paging={paging}/>:''}
          </div>  
        </AITableContext.Provider>
      )
    }
  }
  function TablePaging(props){
    let {ROWS} = useContext(AITableContext)
    function fix(paging){
      let {number,size = 20,length = 0,sizes = [1,5,10,15,20,30,50,70,100],serverSide} = paging
      if(!serverSide){length = ROWS.sortedRows.length}
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
  function TableRows(){
    let {props,ROWS} = useContext(AITableContext)
    let {rowTemplate,rowAfter = ()=>null,rowBefore = ()=>null} = props;
    function getContent(){
      let rows = ROWS.pagedRows;
      if(props.rowsTemplate){
        return props.rowsTemplate(rows)
      }
      if(rows.length){
        return rows.map((o,i)=>{
          let {id = 'ailr' + Math.round(Math.random() * 10000000)} = o;
          o._id = o._id === undefined? id:o._id;
          let isLast = i === rows.length - 1,Row;
          if(rowTemplate){Row = rowTemplate({row:o,rowIndex:i,isLast})}
          else {Row = <TableRow key={id} row={o} rowIndex={i} isLast={isLast}/>}
          return (<Fragment key={id}>{rowBefore({row:o,rowIndex:i})}{Row}{rowAfter({row:o,rowIndex:i})}</Fragment>)
        })
      }
      let {placeholder = 'there is not any items'} = props;
      return <div style={{width:'100%',textAlign:'center',padding:12}}>{placeholder}</div>
    }
    return <div className='aio-input-table-rows'>{getContent()}</div>
  }
  function TableToolbar(){
    let {add,exportToExcel,RowGap,props,state,search} = useContext(AITableContext);
    let {toolbarAttrs = {},toolbar,onAdd,excel,onSearch} = props;
    let {sorts} = state;
    if(!onAdd && !excel && !toolbar && !onSearch && !sorts.length){return null}
    return (
      <>
        <div {...toolbarAttrs} className={'aio-input-table-toolbar' + (toolbarAttrs.className?' ' + toolbarAttrs.className:'')}>
          {toolbar && <div className='aio-input-table-toolbar-content'>{toolbar}</div>}
          <div className='aio-input-table-search'>
            {!!onSearch && <AIOInput type='text' onChange={(value)=>search(value)} after={<Icon path={mdiMagnify} size={1}/>}/>}
          </div>
          {state.Sort.getSortButton()}
          {!!excel && <div className='aio-input-table-toolbar-icon' onClick={()=>exportToExcel()}><Icon path={mdiFileExcel} size={0.8}/></div>}
          {!!onAdd && <div className='aio-input-table-toolbar-icon' onClick={()=>add()}><Icon path={mdiPlusThick} size={0.8}/></div>}
          
        </div>
        {RowGap}
      </>
    )
  }
  function TableHeader(){
    let {RowGap,props,state} = useContext(AITableContext);
    let {headerAttrs = {},onRemove} = props;
    let {columns} = state;
    let Titles = columns.map((o,i)=><TableTitle key={o._id} column={o} isLast={i === columns.length - 1}/>);
    let RemoveTitle = !onRemove?null:<button className='aio-input-table-remove'></button>;
    let className = 'aio-input-table-header' + (headerAttrs.className?' ' + headerAttrs.className:'');
    return (<><div {...{...headerAttrs,className}}>{Titles}{RemoveTitle}</div>{RowGap}</>)
  }
  function TableTitle({column,isLast}){
    let {ColumnGap,getTitleAttrs} = useContext(AITableContext);
    let attrs = getTitleAttrs(column);
    return (
      <>
        <div {...attrs}>{attrs.title}</div>
        {!isLast && ColumnGap}
      </>
    )
  }
  function TableRow({row,isLast,rowIndex}){
    let {remove,RowGap,props,state,getRowAttes} = useContext(AITableContext);
    function getCells(){
      return state.columns.map((column,i)=>{
        let key = row._id + ' ' + column._id;
        let isLast = i === state.columns.length - 1;
        return (<TableCell isLast={isLast} key={key} row={row} rowIndex={rowIndex} column={column}/>)
      })
    }
    return (
      <>
        <div key={row._id} {...getRowAttes(row,rowIndex)}>
          {getCells(row,rowIndex)}
          {props.onRemove?<button className='aio-input-table-remove' onClick={()=>remove(row)}><Icon path={mdiClose} size={0.8}/></button>:null}
        </div>
        {!isLast && RowGap}
      </>
    )
  }
  const TableCell = ({row,rowIndex,column,isLast})=>{
    let context = useContext(AITableContext);
    let {ColumnGap,getCellAttrs,getCellContent} = context;
    let content = getCellContent({row,rowIndex,column});
    return (
      <Fragment key={row._id + ' ' + column._id}>
        <div {...getCellAttrs({row,rowIndex,column})} >{content}</div>
        {!isLast && ColumnGap}
      </Fragment>
    )
    
  }
  class SortClass{
    constructor({getProps,getState,setState}){
      this.getProps = getProps;
      this.getState = getState;
      this.setState = setState;
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
      if(onChangeSort){
        let res = await onChangeSort(sorts)
        if(res !== false){this.setState({sorts});}
      }
      else{
        this.setState({sorts});
        let activeSorts = sorts.filter((sort)=>sort.active !== false);
        if(activeSorts.length){
          let {setRows} = this.getState();
          let {rows} = this.getProps();
          setRows(this.sort(rows,activeSorts))
        }
      }
    }
    getSortedRows = (rows) => {
      if(this.initialSort){return rows}
      let {onChangeSort} = this.getProps();
      let {setRows,sorts} = this.getState();
      if(onChangeSort){return rows}
      let activeSorts = sorts.filter((sort)=>sort.active !== false);
      if(!activeSorts.length){return rows}
      if(rows.length){this.initialSort = true; setRows(this.sort(rows,activeSorts))}
      else{return rows;}
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
          if(type === 'datepicker'){value = AIODate().getTime(value);}
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
    getSortButton(){
      let {sorts} = this.getState();
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