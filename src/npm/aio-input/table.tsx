import React, { Fragment, createContext, createRef, useContext, useEffect, useState } from "react";
import {AICTX,addToAttrs,I} from './utils'; 
import { AI, AI_TableCellContent, AI_context, AI_table_column, AI_table_paging, AI_table_param, AI_table_rows, AI_table_sort, I_Drag, I_TableGap, type_table_context, type_table_temp } from "./types";
import AIOInput from ".";
import { ExportToExcel,DragClass } from "../aio-utils";
import { mdiArrowDown, mdiArrowUp, mdiClose, mdiFileExcel, mdiMagnify, mdiPlusThick, mdiSort } from "@mdi/js";
const AITableContext = createContext({} as any);
export default function Table() {
    let { rootProps,DATE }: AI_context = useContext(AICTX);
    let { paging, getValue = {}, value, onChange = () => { }, onAdd, onRemove, excel, onSwap, onSearch, rowAttrs,onChangeSort,className,style } = rootProps;
    let [dom] = useState(createRef())
    let [searchValue, setSearchValue] = useState<string>('')
    let [columns, setColumns] = useState<AI_table_column[]>([]);
    let [searchColumns, setSearchColumns] = useState<AI_table_column[]>([]);
    let [excelColumns, setExcelColumns] = useState<AI_table_column[]>([]);
    let [temp] = useState<type_table_temp>({})
    let [DragRows] = useState<I_Drag | false>(!onSwap?false:new DragClass({
        onChange:(newRows,from,to)=>{
            if (typeof onSwap === 'function') { onSwap(newRows, from, to) }
            else { onChange(newRows) }
        },
        className:'aio-input-table-row',
    }))
    let [sorts, setSorts] = useState<AI_table_sort[]>([])
    function getColumns() {
        let {columns = []} = rootProps;
        columns = typeof columns === 'function'?columns():columns;
        let searchColumns:AI_table_column[] = [], excelColumns:AI_table_column[] = [];
        let updatedColumns = columns.map((o) => {
            let { id = 'aitc' + Math.round(Math.random() * 1000000), sort, search, excel } = o;
            let column = { ...o, _id: id };
            if (search) { searchColumns.push(column) }
            if (excel) { excelColumns.push(column) }
            return column
        })
        setColumns(updatedColumns);
        setSearchColumns(searchColumns)
        setExcelColumns(excelColumns);
        return updatedColumns;
    }
    function getSorts(columns:AI_table_column[]) {
        let sorts = [];
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            let { _id, input } = column;
            let sort = column.sort === true ? {} : column.sort;
            if (!sort) { continue }
            let { active = false, dir = 'dec' } = sort as AI_table_sort;
            let getValue;
            if (sort.getValue) { getValue = sort.getValue }
            else {
                getValue = (row:any) => {
                    let value = getDynamics({ value: column.value, row, column })
                    if (input && input.type === 'date') { value = DATE.getTime(value); }
                    return value
                }
            }
            let type:'string' | 'number' | 'date';
            if (input && ['number', 'date', 'range'].indexOf(input.type) !== -1) { type = 'number' }
            else { type = sort.type || 'string' }
            let sortItem: AI_table_sort = { dir, title: sort.title || column.title, sortId: _id, active, type, getValue }
            sorts.push(sortItem)
        }
        setSorts(sorts);
    }
    function getDynamics(p: { value: any, row?: any, column?: AI_table_column, def?: any, rowIndex?: number }) {
        let { value, row, column, def, rowIndex } = p;
        if (paging) {
            let { number, size } = paging;
            if(rowIndex)rowIndex += ((number - 1) * size) 
        }
        let type = typeof value;
        if (type === 'string') {
            let result = value;
            let param:AI_table_param = { row, column:column as AI_table_column, rowIndex:rowIndex as number }
            if (getValue[value]) { result = getValue[value](param) }
            else if (value.indexOf('row.') !== -1) { try { eval(`result = ${value}`); } catch { result = '' } }
            return result === undefined ? def : result;
        }
        if (type === 'undefined') { return def }
        if (type === 'function') { return value({ row, column, rowIndex }) }
        return value === undefined ? def : value
    }
    useEffect(() => {
        let columns:AI_table_column[] = getColumns();
        getSorts(columns);
    }, [])
    function add() {typeof onAdd === 'function'?onAdd():onChange([{...onAdd}, ...value])}
    function remove(row:any, index:number) {
        let action = () => onChange(value.filter((o:any) => o._id !== row._id));
        typeof onRemove === 'function'?onRemove({ row, action, rowIndex: index }):action();
    }
    function exportToExcel() {
        let list = [];
        for (let i = 0; i < value.length; i++) {
            let row = value[i], json:any = {};
            for (let j = 0; j < excelColumns.length; j++) {
                let column = excelColumns[j], { excel, value } = column;
                if(typeof excel !== 'string'){continue}
                json[excel] = getDynamics({ value, row, column, rowIndex: i })
            }
            list.push(json)
        }
        ExportToExcel(list, { promptText: typeof excel === 'string' ? excel : 'Inter Excel File Name' })
    }
    function getSearchedRows(rows:{[key:string]:any}[]) {
        if (onSearch !== true) { return rows }
        if (!searchColumns.length || !searchValue) { return rows }
        return AIOInputSearch(rows, searchValue, (row, index) => {
            let str = '';
            for (let i = 0; i < searchColumns.length; i++) {
                let column = searchColumns[i];
                let value = getDynamics({ value: column.value, row, def: '', column, rowIndex: index });
                if (value) { str += value + ' ' }
            }
            return str
        })
    }
    function sortRows(rows:{[key:string]:any}[], sorts:AI_table_sort[]) {
        if(!rows){return []}
        if (!sorts || !sorts.length) { return rows }
        return rows.sort((a, b) => {
            for (let i = 0; i < sorts.length; i++) {
                let { dir, getValue } = sorts[i];
                if(!getValue){return 0}
                let aValue = getValue(a), bValue = getValue(b);
                if (aValue < bValue) { return -1 * (dir === 'dec' ? -1 : 1); }
                if (aValue > bValue) { return 1 * (dir === 'dec' ? -1 : 1); }
                if (i === sorts.length - 1) { return 0; }
            }
            return 0;
        });
    }
    function getSortedRows(rows:{[key:string]:any}[]) {
        if (temp.isInitSortExecuted) { return rows }
        if (onChangeSort) { return rows }
        let activeSorts = sorts.filter((sort) => sort.active !== false);
        if (!activeSorts.length || !rows.length) { return rows }
        temp.isInitSortExecuted = true; 
        let sortedRows = sortRows(rows, activeSorts);
        onChange(sortedRows);
        return sortedRows;  
    }
    function getRows():AI_table_rows {
        let searchedRows = getSearchedRows(value);
        let sortedRows = getSortedRows(searchedRows);
        let pagedRows = paging && !paging.serverSide ? sortedRows.slice((paging.number - 1) * paging.size, paging.number * paging.size) : sortedRows;
        return { rows: value, searchedRows, sortedRows, pagedRows }
    }
    //calculate style of cells and title cells
    function getCellStyle(column:AI_table_column) {
        let width = getDynamics({ value: column.width });
        let minWidth = getDynamics({ value: column.minWidth });
        return { width: width ? width : undefined, flex: width ? undefined : 1, minWidth }
    }
    function getCellAttrs(p:{ row:any, rowIndex:number, column:AI_table_column, type:'title'|'cell' }) {
        let { row, rowIndex, column, type } = p;
        let {cellAttrs,titleAttrs} = column;
        let attrs = getDynamics({ value: type === 'title'?titleAttrs:cellAttrs, column, def: {}, row, rowIndex });
        let justify = getDynamics({ value: column.justify, def: false });
        let cls = `aio-input-table-${type}` + (justify ? ` aio-input-table-${type}-justify` : '')
        attrs = addToAttrs(attrs, { className: cls, style: getCellStyle(column) });
        if (type === 'title') { attrs.title = getDynamics({ value: column.title, def: '' }) }
        return { ...attrs }
    }
    function getRowAttrs(row:any, rowIndex:number) {
        let attrs = rowAttrs ? rowAttrs({ row, rowIndex }) : {};
        let obj = addToAttrs(attrs, { className: 'aio-input-table-row' })
        if (DragRows !== false) { obj = { ...obj, ...DragRows.getAttrs(value,rowIndex) } }
        return obj;
    }
    function search(searchValue:string) {
        if(onSearch === true) { setSearchValue(searchValue) }
        else if(typeof onSearch === 'function'){ onSearch(searchValue) }
    }
    function getContext(ROWS:AI_table_rows) {
        let context: type_table_context = {
            ROWS, addToAttrs, rootProps, columns, sorts, setSorts, sortRows, excelColumns, getCellAttrs, getRowAttrs,
            add, remove, search, exportToExcel,getDynamics
        }
        return context
    }
    let ROWS:AI_table_rows = getRows();
    let attrs = addToAttrs(rootProps.attrs,{className:['aio-input aio-input-table',className],style:rootProps.style,attrs:{ref:dom}})
    return (
        <AITableContext.Provider value={getContext(ROWS)}>
            <div {...attrs}>
                <TableToolbar />
                <div className='aio-input-table-unit'><TableHeader /><TableRows /></div>
                {paging ? <TablePaging /> : ''}
            </div>
        </AITableContext.Provider>
    )
}
function TableGap(props:I_TableGap) {
    let { rootProps }: type_table_context = useContext(AITableContext)
    let { rowGap, columnGap } = rootProps;
    let { dir } = props;
    let style;
    if (dir === 'h') { style = { height: rowGap } }
    else { style = { width: columnGap } }
    return <div className={`aio-input-table-border-${dir}`} style={style}></div>
}
function TablePaging() {
    let { ROWS, rootProps }: type_table_context = useContext(AITableContext)
    let [temp] = useState<{ timeout: any,start:any,end:any,pages:any }>({timeout:undefined,start:undefined,end:undefined,pages:0})
    function fix(paging: AI_table_paging):AI_table_paging {
        if(typeof rootProps.onChangePaging !== 'function'){
            alert('aio-input error => in type table you set paging but forget to set onChangePaging function prop to aio input')
            return {number:0,size:0};
        }
        let { number, size = 20, length = 0, sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100], serverSide } = paging
        if (!serverSide) { length = ROWS.sortedRows.length }
        if (sizes.indexOf(size) === -1) { size = sizes[0] }
        let pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        let start = number - 3,end = number + 3;
        temp.start = start; temp.end = end; temp.pages = pages;
        return { ...paging, length, number, size, sizes }
    }
    let [paging, setPaging] = useState<AI_table_paging>(fix(rootProps.paging || {size:0,number:0}));
    useEffect(() => {
        if(rootProps.paging){setPaging(fix(rootProps.paging))}
    }, [(rootProps.paging || {size:0,number:0,length:0}).size,(rootProps.paging || {size:0,number:0,length:0}).number,(rootProps.paging || {size:0,number:0,length:0}).length])
    function changePaging(obj:{[key in keyof AI_table_paging]?:any}) {
        let newPaging:AI_table_paging = fix({ ...paging, ...obj });
        setPaging(newPaging);
        if(rootProps.onChangePaging){
            if (newPaging.serverSide) {
                clearTimeout(temp.timeout);
                temp.timeout = setTimeout(() => {
                    //be khatere fahme payine typescript majbooram dobare in shart ro bezanam
                    if(rootProps.onChangePaging){rootProps.onChangePaging(newPaging)}
                }, 800);
            }
            else { rootProps.onChangePaging(newPaging) }
        }
    }
    let { number, size, sizes } = paging;
    let buttons = [];
    let isFirst = true
    for (let i = temp.start; i <= temp.end; i++) {
        if (i < 1 || i > temp.pages) {
            buttons.push(<button key={i} className={'aio-input-table-paging-button aio-input-table-paging-button-hidden'}>{i}</button>)
        }
        else {
            let index;
            if (isFirst) { index = 1; isFirst = false; }
            else if (i === Math.min(temp.end, temp.pages)) { index = temp.pages }
            else { index = i; }
            buttons.push(<button key={index} className={'aio-input-table-paging-button' + (index === number ? ' active' : '')} onClick={() => changePaging({ number: index })}>{index}</button>)
        }
    }
    function changeSizeButton() {
        if (!sizes || !sizes.length) { return null }
        let p: AI = {
            attrs: { className: 'aio-input-table-paging-button aio-input-table-paging-size' },
            type: 'select', value: size, options: sizes, option:{text:'option',value:'option'},
            onChange: (value) => changePaging({ size: value }),
            popover: { fitHorizontal: true},
        }
        return (<AIOInput {...p} />)
    }
    return (
        <div className='aio-input-table-paging'>
            {buttons}
            {changeSizeButton()}
        </div>
    )
}
function TableRows() {
    let { ROWS, rootProps }: type_table_context = useContext(AITableContext)
    let { rowTemplate, rowAfter = () => null, rowBefore = () => null, rowsTemplate, placeholder = 'there is not any items' } = rootProps;
    let rows = ROWS.pagedRows || [];
    let content;
    if (rowsTemplate) { content = rowsTemplate(rows) }
    else if (rows.length) {
        content = rows.map((o, i) => {
            let { id = 'ailr' + Math.round(Math.random() * 10000000) } = o;
            o._id = o._id === undefined ? id : o._id;
            let isLast = i === rows.length - 1, Row;
            if (rowTemplate) { Row = rowTemplate({ row: o, rowIndex: i, isLast }) }
            else { Row = <TableRow key={o._id} row={o} rowIndex={i} isLast={isLast} /> }
            return (<Fragment key={o._id}>{rowBefore({ row: o, rowIndex: i })}{Row}{rowAfter({ row: o, rowIndex: i })}</Fragment>)
        })
    }
    else if (placeholder) {
        content = <div style={{ width: '100%', textAlign: 'center', padding: 12, boxSizing: 'border-box' }}>{placeholder}</div>
    }
    else {return null}
    return <div className='aio-input-table-rows'>{content}</div>
}
function TableToolbar() {
    let { add, exportToExcel, sorts, sortRows, setSorts, search, rootProps, excelColumns }: type_table_context = useContext(AITableContext);
    let { toolbarAttrs, toolbar, onAdd, onSearch, onChangeSort, onChange = () => { }, value,addText } = rootProps;
    toolbarAttrs = addToAttrs(toolbarAttrs, { className: 'aio-input-table-toolbar' })
    if (!onAdd && !toolbar && !onSearch && !sorts.length && !excelColumns.length) { return null }
    function changeSort(sortId:string, changeObject:any) {
        let newSorts = sorts.map((sort) => {
            if (sort.sortId === sortId) {
                let newSort = { ...sort, ...changeObject }
                return newSort;
            }
            return sort
        });
        changeSorts(newSorts)
    }
    async function changeSorts(sorts:AI_table_sort[]) {
        if (onChangeSort) {
            let res = await onChangeSort(sorts)
            if (res !== false) { setSorts(sorts); }
        }
        else {
            setSorts(sorts);
            let activeSorts = sorts.filter((sort) => sort.active !== false);
            if (activeSorts.length) {
                onChange(sortRows(value, activeSorts))
            }
        }
    }

    function button() {
        if (!sorts.length) { return null }
        let p:AI = {
            popover:{ 
                header: { 
                    attrs: { className: 'aio-input-table-toolbar-popover-header' }, 
                    title: 'Sort', 
                    onClose: false 
                }, 
                pageSelector: '.aio-input-table'
            },
            caret:false,type:'select',options:sorts,
            option:{
                text:'option.title',
                checked:'!!option.active',
                close:()=>false,
                value:'option.sortId',
                after:(option)=>{
                    let {dir = 'dec',sortId} = option;
                    return (
                        <div onClick={(e) => { e.stopPropagation(); changeSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' }) }}>
                            {I(dir === 'dec' ? mdiArrowDown : mdiArrowUp,0.8)}
                        </div>
                    )
                }
            },
            attrs:{ className: 'aio-input-table-toolbar-button' },
            text:I(mdiSort,0.7),
            onSwap:(newSorts,from,to) => changeSorts(newSorts),
            onChange:(value, option) => changeSort(value, { active: !option.checked })
        }
        return (
            <AIOInput {...p} key='sortbutton'/>
        )
    }
    function getAddText(){
        let {addText} = rootProps;
        if(!rootProps.addText){return I(mdiPlusThick,0.8)}
        if(typeof addText === 'function'){
            return addText(value)
        }
        return addText
    }
    return (
        <>
            <div {...toolbarAttrs}>
                {toolbar && <div className='aio-input-table-toolbar-content'>{typeof toolbar === 'function' ? toolbar() : toolbar}</div>}
                <div className='aio-input-table-search'>
                    {!!onSearch && <AIOInput type='text' onChange={(value) => search(value)} after={I(mdiMagnify,0.7)} />}
                </div>
                {button()}
                {!!excelColumns.length && <div className='aio-input-table-toolbar-button' onClick={() => exportToExcel()}>{I(mdiFileExcel,0.8)}</div>}
                {!!onAdd && <div className='aio-input-table-toolbar-button' onClick={() => add()}>{getAddText()}</div>}
            </div>
            <TableGap dir='h' />
        </>
    )
}
function TableHeader() {
    let { rootProps, columns }: type_table_context = useContext(AITableContext);
    let { headerAttrs, onRemove } = rootProps;
    headerAttrs = addToAttrs(headerAttrs, { className: 'aio-input-table-header' })
    let Titles = columns.map((o, i) => <TableTitle key={o._id} column={o} isLast={i === columns.length - 1} />);
    let RemoveTitle = !onRemove ? null : <><TableGap dir='v' /><div className='aio-input-table-remove-title'></div></>;
    return <div {...headerAttrs}>{Titles}{RemoveTitle}<TableGap dir='h' /></div>
}
function TableTitle(p:{ column:AI_table_column, isLast:boolean }) {
    let { column, isLast } = p;
    let { getCellAttrs } = useContext(AITableContext);
    let attrs = getCellAttrs({ column, type: 'title' });
    return (<><div {...attrs}>{attrs.title}</div>{!isLast && <TableGap dir='v' />}</>)
}
function TableRow(p:{ row:any, isLast:boolean, rowIndex:number }) {
    let { row, isLast, rowIndex } = p;
    let { remove, rootProps, columns, getRowAttrs }: type_table_context = useContext(AITableContext);
    function getCells() {
        return columns.map((column, i) => {
            let key = row._id + ' ' + column._id;
            let isLast = i === columns.length - 1;
            return (<TableCell isLast={isLast} key={key} row={row} rowIndex={rowIndex} column={column} />)
        })
    }
    let { onRemove } = rootProps;
    return (
        <>
            <div key={row._id} {...getRowAttrs(row, rowIndex)}>
                {getCells()}
                {onRemove ? <><TableGap dir='v' /><button className='aio-input-table-remove' onClick={() => remove(row, rowIndex)}>{I(mdiClose,0.8)}</button></> : null}
            </div>
            <TableGap dir='h' />
        </>
    )
}
const TableCell = (p:{ row:any, rowIndex:number, column:AI_table_column, isLast:boolean }) => {
    let { row, rowIndex, column, isLast } = p;
    let { getCellAttrs,rootProps,getDynamics }: type_table_context = useContext(AITableContext);
    let {onChange = ()=>{},value = []} = rootProps;
    function setCell(row: any, column: AI_table_column, cellNewValue: any) {
        if (column.input && column.input.onChange) { 
            column.input.onChange({ value: cellNewValue, row, column }) 
        }
        else {
            row = JSON.parse(JSON.stringify(row));
            eval(`${column.value} = cellNewValue`);
            onChange(value.map((o:any) => o._id !== row._id ? o : row))
        }
    }
    let contentProps:AI_TableCellContent = { row, rowIndex, column,onChange:column.input?(value)=>setCell(row, column, value):undefined };
    let key = row._id + ' ' + column._id;
    return (
        <Fragment key={key}>
            <div {...getCellAttrs({ row, rowIndex, column, type: 'cell' })} >
                <TableCellContent {...contentProps} key={key}/>
            </div>
            {!isLast && <TableGap dir='v' />}
        </Fragment>
    )
}
function TableCellContent(props:AI_TableCellContent){
    let {row,column,rowIndex,onChange} = props;
    let { getDynamics }: type_table_context = useContext(AITableContext);
    let template = getDynamics({ value: column.template, row, rowIndex, column });
    if (template !== undefined) { return template }
    let input:AI = getDynamics({ value: column.input, row, rowIndex, column });
    let value = getDynamics({ value: column.value, row, rowIndex, column })
    if (!input) { return value }
    //justify baraye input ast amma agar rooye column set shode va input set nashode be input bede
    input.justify = input.justify || getDynamics({ value: column.justify, row, rowIndex, column });
    let convertedInput:any = {type:'text'}
    for (let property in input) {
        let prop:(keyof AI) = property as keyof AI;
        let res:any = input[prop];
        if (['onChange', 'onClick'].indexOf(prop) !== -1) { convertedInput[prop] = res }
        else { convertedInput[prop] = getDynamics({ value: res, row, rowIndex, column }) }
    }
    let p:AI = { ...convertedInput, value, onChange,type:input.type }
    return (<AIOInput {...p} key={row._id + ' ' + column._id} />)
}
function AIOInputSearch(items: any[], searchValue: string, getValue?: (o: any, index: number) => any) {
    if (!searchValue) { return items }
    function isMatch(keys:string[], value:string) {
        for (let i = 0; i < keys.length; i++) {
            if (value.indexOf(keys[i]) === -1) { return false }
        }
        return true
    }
    let keys = searchValue.split(' ');
    return items.filter((o, i) => isMatch(keys, getValue ? getValue(o, i) : o))
}
