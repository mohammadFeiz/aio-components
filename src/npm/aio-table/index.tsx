import { createContext, createRef, FC, Fragment, ReactNode, useContext, useEffect, useRef, useState } from "react";
import AIOInput, { AITYPE } from "../aio-input";
import * as UT from './../../npm/aio-utils';
import "./repo/index.css"
type I_rows<T> = { rows: T[], searchedRows: T[], sortedRows: T[], pagedRows: T[] }
type I_temp = { start?: any, isInitSortExecuted?: boolean }
export type AI_table_param<T> = { row: T, column: I_column<T>, rowIndex: number }

export type I_column<T> = {
    title?: any, value?: any, sort?: true | I_sort<T>, search?: boolean, id?: string, _id?: string, width?: any, minWidth?: any,
    titleAttrs?: { [key: string]: any } | string, template?: string | ((p: { row: T, column: I_column<T>, rowIndex: number,change:(newRow:T)=>void }) => ReactNode),
    excel?: string | boolean, justify?: boolean, cellAttrs?: { [key: string]: any } | ((p: { row: T, rowIndex: number, column: I_column<T> }) => any) | string
}
export type I_sort<T> = { active?: boolean, dir?: 'dec' | 'inc', title?: ReactNode, type?: 'string' | 'number', sortId?: string, getValue?: (row: T) => any }
export type I_context<T> = {
    rootProps: I_AIOTable<T>,
    columns: I_column<T>[],
    ROWS: I_rows<T>,
    add: () => void, remove: (row: T, index: number) => void, search: (searchValue: string) => void,
    exportToExcel: () => void,
    sorts: I_sort<T>[],
    setSorts: (newSorts: I_sort<T>[]) => void,
    sortRows: (rows: T[], sorts: I_sort<T>[]) => T[],
    excelColumns: I_column<T>[],
    getRowAttrs: (row: T, rowIndex: number) => any,
    getCellAttrs: I_getCellAttrs<T>,
    getDynamics: any,
    DragColumns: UT.I_useDrag,
    getIcon:UT.GetSvg["getIcon"]
}
export type I_getCellAttrs<T> = (p: { row: T, rowIndex: number, column: I_column<T>, type: 'title' | 'cell' }) => any;
export type AI_table_paging = { serverSide?: boolean, number: number, size: number, length?: number, sizes?: number[] }
export type I_AIOTable<T> = {
    addText?: ReactNode | ((value: any) => ReactNode),
    columnGap?: number,
    columns?: I_column<T>[],
    excel?: string | ((value: any[]) => any[]),
    getValue?: { [key: string]: (p: {row:T,column:I_column<T>,rowIndex:number,change:(newRow:T)=>void}) => any },
    headerAttrs?: any,
    onAdd?: () => Promise<T | undefined>,
    onChangePaging?: (newPaging: AI_table_paging) => void,
    onChangeSort?: (sorts: I_sort<T>[]) => Promise<boolean>,
    onSwap?: true | ((newValue: T[], startRow: T, endRow: T) => void),
    onSearch?: true | ((searchValue: string) => void),
    paging?: AI_table_paging,
    removeText?: string,
    rowAfter?: (p: { row: T, rowIndex: number }) => ReactNode,
    rowAttrs?: (p: { row: T, rowIndex: number }) => any,
    rowBefore?: (p: { row: T, rowIndex: number }) => ReactNode,
    rowGap?: number,
    rowsTemplate?: (rows: T[]) => ReactNode,
    rowTemplate?: (p: { row: T, rowIndex: number, isLast: boolean }) => ReactNode,//table
    toolbar?: ReactNode | (() => ReactNode),
    toolbarAttrs?: any,
    tabIndex?: number,
    value:T[],
    onChange?:(v:T[])=>void,
    className?:string,
    style?:any,
    attrs?:any,
    onRemove?: true | ((p: { row: T, action?: Function, rowIndex?: number, parent?: T }) => Promise<boolean | void>),
    placeholder?:ReactNode
}
const Context = createContext<I_context<any>>({} as any);
const Provider = <T,>(p:{value:I_context<T>,children:ReactNode})=><Context.Provider value={p.value}>{p.children}</Context.Provider>
const useProvider = ()=>useContext(Context)
const AIOTable = <T,>(rootProps:I_AIOTable<T>) => {
    let { paging, getValue = {}, value, onChange = () => { }, onAdd, onRemove, excel, onSwap, onSearch, rowAttrs, onChangeSort, className } = rootProps;
    let [dom] = useState(createRef())
    let [searchValue, setSearchValue] = useState<string>('')
    let [columns, setColumns] = useState<I_column<T>[]>([]);
    let [searchColumns, setSearchColumns] = useState<I_column<T>[]>([]);
    let [excelColumns, setExcelColumns] = useState<I_column<T>[]>([]);
    const getIconRef = useRef<UT.GetSvg>(new UT.GetSvg())
    const getIcon = getIconRef.current.getIcon;
    let [temp] = useState<I_temp>({})
    const DragRows: UT.I_useDrag = UT.useDrag((dragData, dropData, reOrder) => {
        const { dragIndex } = dragData;
        const { dropIndex, rows } = dropData;
        const newRows = reOrder(rows, dragIndex, dropIndex);
        const from = rows[dragIndex];
        const to = rows[dropIndex];
        if (typeof onSwap === 'function') { onSwap(newRows, from, to) }
        else { onChange(newRows) }
    })
    const DragColumns = UT.useDrag((dragIndex, dropIndex, reOrder) => setColumns(reOrder(columns, dragIndex, dropIndex)))
    let [sorts, setSorts] = useState<I_sort<T>[]>([])
    function getColumns() {
        let { columns = [] } = rootProps;
        let searchColumns: I_column<T>[] = [], excelColumns: I_column<T>[] = [];
        let updatedColumns = columns.map((o: I_column<T>) => {
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
    function getSorts(columns: I_column<T>[]) {
        let sorts = [];
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            let { _id } = column;
            let sort = column.sort === true ? {} : column.sort;
            if (!sort) { continue }
            let { active = false, dir = 'dec' } = sort as I_sort<T>;
            let getValue;
            if (sort.getValue) { getValue = sort.getValue }
            else {getValue = (row: T) => getDynamics({ value: column.value, row, column })}
            let type: 'string' | 'number' | 'date' = sort.type || 'string'
            let sortItem: I_sort<T> = { dir, title: sort.title || column.title, sortId: _id, active, type, getValue }
            sorts.push(sortItem)
        }
        setSorts(sorts);
    }
    function getDynamics(p: { value: any, row?: T, column?: I_column<T>, def?: any, rowIndex?: number }) {
        let { value, row, column, def, rowIndex } = p;
        if (paging) {
            let { number, size } = paging;
            if (rowIndex) rowIndex += ((number - 1) * size)
        }
        let type = typeof value;
        if (type === 'string') {
            let result = value;
            let param: AI_table_param<T> = { row:row as T, column: column as I_column<T>, rowIndex: rowIndex as number }
            if (getValue[value]) {result = getValue[value]({...param,change:()=>{}})}
            else if (value.indexOf('row.') !== -1) { try { eval(`result = ${value}`); } catch { result = '' } }
            return result === undefined ? def : result;
        }
        if (type === 'undefined') { return def }
        if (type === 'function') { return value({ row, column, rowIndex }) }
        return value === undefined ? def : value
    }
    useEffect(() => {getSorts(getColumns());}, [])
    async function add() { 
        if(!onAdd){return}
        const row = await onAdd()
        if(!row){return}
        onChange([{ ...row }, ...value])
    }
    function remove(row: any, index: number) {
        let action = () => onChange(value.filter((o: any) => o._id !== row._id));
        typeof onRemove === 'function' ? onRemove({ row, action, rowIndex: index }) : action();
    }
    function exportToExcel() {
        let list = [];
        if (typeof rootProps.excel === 'function') {
            list = rootProps.excel(value)
        }
        else {
            for (let i = 0; i < value.length; i++) {
                let row = value[i], json: any = {};
                for (let j = 0; j < excelColumns.length; j++) {
                    let column = excelColumns[j], { excel, value } = column;
                    let key: string = '';
                    if (excel === true) {
                        if (typeof column.title === 'string') { key = column.title }
                        else { key = 'untitle' }
                    }
                    else if (typeof excel === 'string') { key = excel }
                    else { continue }
                    json[key] = getDynamics({ value, row, column, rowIndex: i })
                }
                list.push(json)
            }
        }
        UT.ExportToExcel(list, { promptText: typeof excel === 'string' ? excel : 'Inter Excel File Name' })
    }
    function getSearchedRows(rows: T[]):T[] {
        if (onSearch !== true) { return rows }
        if (!searchColumns.length || !searchValue) { return rows }
        return UT.Search(rows, searchValue, (row, index) => {
            let str = '';
            for (let i = 0; i < searchColumns.length; i++) {
                let column = searchColumns[i];
                let value = getDynamics({ value: column.value, row, def: '', column, rowIndex: index });
                if (value) { str += value + ' ' }
            }
            return str
        })
    }
    function sortRows(rows: T[], sorts: I_sort<T>[]) {
        if (!rows) { return [] }
        if (!sorts || !sorts.length) { return rows }
        return rows.sort((a, b) => {
            for (let i = 0; i < sorts.length; i++) {
                let { dir, getValue } = sorts[i];
                if (!getValue) { return 0 }
                let aValue = getValue(a as T), bValue = getValue(b as T);
                if (aValue < bValue) { return -1 * (dir === 'dec' ? -1 : 1); }
                if (aValue > bValue) { return 1 * (dir === 'dec' ? -1 : 1); }
                if (i === sorts.length - 1) { return 0; }
            }
            return 0;
        });
    }
    function getSortedRows(rows: T[]):T[] {
        if (temp.isInitSortExecuted) { return rows }
        if (onChangeSort) { return rows }
        let activeSorts = sorts.filter((sort) => sort.active !== false);
        if (!activeSorts.length || !rows.length) { return rows }
        temp.isInitSortExecuted = true;
        let sortedRows = sortRows(rows, activeSorts);
        onChange(sortedRows);
        return sortedRows;
    }
    function getRows(): I_rows<T> {
        let searchedRows = getSearchedRows(value);
        let sortedRows = getSortedRows(searchedRows);
        let pagedRows = paging && !paging.serverSide ? sortedRows.slice((paging.number - 1) * paging.size, paging.number * paging.size) : sortedRows;
        return { rows: value, searchedRows, sortedRows, pagedRows }
    }
    //calculate style of cells and title cells
    function getCellStyle(column: I_column<T>) {
        let width = getDynamics({ value: column.width });
        let minWidth = getDynamics({ value: column.minWidth });
        return { width: width ? width : undefined, flex: width ? undefined : 1, minWidth }
    }
    const getCellAttrs:I_getCellAttrs<T> = ({ row, rowIndex, column, type }) => {
        let { cellAttrs, titleAttrs } = column;
        let attrs = getDynamics({ value: type === 'title' ? titleAttrs : cellAttrs, column, def: {}, row, rowIndex });
        let justify = getDynamics({ value: column.justify, def: false });
        let cls = `aio-input-table-${type}` + (justify ? ` aio-input-table-${type}-justify` : '')
        attrs = UT.AddToAttrs(attrs, { className: cls, style: getCellStyle(column) });
        if (type === 'title') { attrs.title = getDynamics({ value: column.title, def: '' }) }
        return { ...attrs }
    }
    function getRowAttrs(row: T, rowIndex: number) {
        let attrs = rowAttrs ? rowAttrs({ row, rowIndex }) : {};
        let obj = UT.AddToAttrs(attrs, { className: 'aio-input-table-row' })
        if (onSwap) {
            obj = {
                ...obj,
                ...DragRows.getDragAttrs({ dragIndex: rowIndex }),
                ...DragRows.getDropAttrs({ dropIndex: rowIndex, rows: value })
            }
        }
        return obj;
    }
    function search(searchValue: string) {
        if (onSearch === true) { setSearchValue(searchValue) }
        else if (typeof onSearch === 'function') { onSearch(searchValue) }
    }
    let ROWS: I_rows<T> = getRows();
    let attrs = UT.AddToAttrs(rootProps.attrs, { className: ['aio-input aio-input-table', className], style: rootProps.style, attrs: { ref: dom } })
    return (
        <Provider value={{
            ROWS, rootProps, columns, sorts, setSorts, sortRows, excelColumns, getCellAttrs, getRowAttrs,
            add, remove, search, exportToExcel, getDynamics, DragColumns,getIcon
        }}>
            <div {...attrs}>
                <TableToolbar<T> />
                <div className='aio-input-table-unit aio-input-scroll'><TableHeader<T> /><TableRows<T> /></div>
                {!!paging && !!ROWS.rows.length ? <TablePaging /> : ''}
            </div>
        </Provider>
    )
}
export default AIOTable
const TableGap:FC<{dir: 'h' | 'v'}> = ({dir}) => {
    const { rootProps } = useProvider(),{ rowGap, columnGap } = rootProps;
    return <div className={`aio-input-table-border-${dir}`} style={dir === 'h'?{ height: rowGap }:{ width: columnGap }}></div>
}
function TablePaging() {
    let { ROWS, rootProps } = useProvider()
    let [temp] = useState<{ timeout: any, start: any, end: any, pages: any }>({ timeout: undefined, start: undefined, end: undefined, pages: 0 })
    function fix(paging: AI_table_paging): AI_table_paging {
        if (typeof rootProps.onChangePaging !== 'function') {
            alert('aio-input error => in type table you set paging but forget to set onChangePaging function prop to aio input')
            return { number: 0, size: 0 };
        }
        let { number, size = 20, length = 0, sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100], serverSide } = paging
        if (!serverSide) { length = ROWS.sortedRows.length }
        if (sizes.indexOf(size) === -1) { size = sizes[0] }
        let pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        let start = number - 3, end = number + 3;
        temp.start = start; temp.end = end; temp.pages = pages;
        return { ...paging, length, number, size, sizes }
    }
    let [paging, setPaging] = useState<AI_table_paging>(fix(rootProps.paging || { size: 0, number: 0 }));
    useEffect(() => {
        if (rootProps.paging) { setPaging(fix(rootProps.paging)) }
    }, [(rootProps.paging || { size: 0, number: 0, length: 0 }).size, (rootProps.paging || { size: 0, number: 0, length: 0 }).number, (rootProps.paging || { size: 0, number: 0, length: 0 }).length])
    function changePaging(obj: { [key in keyof AI_table_paging]?: any }) {
        let newPaging: AI_table_paging = fix({ ...paging, ...obj });
        setPaging(newPaging);
        if (rootProps.onChangePaging) {
            if (newPaging.serverSide) {
                clearTimeout(temp.timeout);
                temp.timeout = setTimeout(() => {
                    //be khatere fahme payine typescript majbooram dobare in shart ro bezanam
                    if (rootProps.onChangePaging) { rootProps.onChangePaging(newPaging) }
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
            let index: number;
            if (isFirst) { index = 1; isFirst = false; }
            else if (i === Math.min(temp.end, temp.pages)) { index = temp.pages }
            else { index = i; }
            buttons.push(<button key={index} className={'aio-input-table-paging-button' + (index === number ? ' active' : '')} onClick={() => changePaging({ number: index })}>{index}</button>)
        }
    }
    function changeSizeButton() {
        if (!sizes || !sizes.length) { return null }
        let p: AITYPE = {
            attrs: { className: 'aio-input-table-paging-button aio-input-table-paging-size' },
            type: 'select', value: size, options: sizes, option: { text: 'option', value: 'option' },
            onChange: (value) => changePaging({ size: value }),
            popover: { fitHorizontal: true },
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
const TableRows = <T,>() => {
    let { ROWS, rootProps } = useProvider()
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
            else { Row = <TableRow<T> key={o._id} row={o} rowIndex={i} isLast={isLast} /> }
            return (<Fragment key={o._id}>{rowBefore({ row: o, rowIndex: i })}{Row}{rowAfter({ row: o, rowIndex: i })}</Fragment>)
        })
    }
    else if (placeholder) {
        content = <div style={{ width: '100%', textAlign: 'center', padding: 12, boxSizing: 'border-box' }}>{placeholder}</div>
    }
    else { return null }
    return <div className='aio-input-table-rows'>{content}</div>
}
const TableToolbar = <T,>() => {
    let { add, exportToExcel, sorts, sortRows, setSorts, search, rootProps, excelColumns,getIcon } = useProvider();
    let { toolbarAttrs, toolbar, onAdd, onSearch, onChangeSort, onChange = () => { }, value, addText } = rootProps;
    toolbarAttrs = UT.AddToAttrs(toolbarAttrs, { className: 'aio-input-table-toolbar' })
    if (!onAdd && !toolbar && !onSearch && !sorts.length && !excelColumns.length) { return null }
    function changeSort(sortId: string, changeObject: any) {
        let newSorts = sorts.map((sort) => {
            if (sort.sortId === sortId) {
                let newSort = { ...sort, ...changeObject }
                return newSort;
            }
            return sort
        });
        changeSorts(newSorts)
    }
    async function changeSorts(sorts: I_sort<T>[]) {
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
        let p: AITYPE = {
            popover: {
                header: { title: 'Sort', onClose: false },
                setAttrs: (key) => { if (key === 'header') { return { className: 'aio-input-table-toolbar-popover-header' } } },
                limitTo: '.aio-input-table'
            },
            caret: false, type: 'select', options: sorts,
            option: {
                text: 'option.title',
                checked: '!!option.active',
                close: () => false,
                value: 'option.sortId',
                after: (option) => {
                    let { dir = 'dec', sortId } = option;
                    return (
                        <div onClick={(e) => {
                            e.stopPropagation();
                            changeSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' })
                        }}>
                            {getIcon(dir === 'dec' ? 'mdiArrowDown' : 'mdiArrowUp', 0.8)}
                        </div>
                    )
                }
            },
            attrs: { className: 'aio-input-table-toolbar-button' },
            text: getIcon('mdiSort', 0.7),
            onSwap: (newSorts, from, to) => changeSorts(newSorts),
            onChange: (value, option) => changeSort(value, { active: !option.checked })
        }
        return (
            <AIOInput {...p} key='sortbutton' />
        )
    }
    function getAddText() {
        let { addText } = rootProps;
        if (!rootProps.addText) { return getIcon('mdiPlusThick', 0.8) }
        return typeof addText === 'function'?addText(value):addText
    }
    return (
        <>
            <div {...toolbarAttrs}>
                {toolbar && <div className='aio-input-table-toolbar-content'>{typeof toolbar === 'function' ? toolbar() : toolbar}</div>}
                <div className='aio-input-table-search'>
                    {!!onSearch && <AIOInput type='text' onChange={(value) => search(value)} after={getIcon('mdiMagnify', 0.7)} />}
                </div>
                {button()}
                {!!excelColumns.length && <div className='aio-input-table-toolbar-button' onClick={() => exportToExcel()}>{getIcon('mdiFileExcel', 0.8)}</div>}
                {!!onAdd && <div className='aio-input-table-toolbar-button' onClick={() => add()}>{getAddText()}</div>}
            </div>
            <TableGap dir='h' />
        </>
    )
}
const TableHeader = <T,>() => {
    let { rootProps, columns } = useProvider();
    let { headerAttrs, onRemove } = rootProps;
    headerAttrs = UT.AddToAttrs(headerAttrs, { className: 'aio-input-table-header' })
    let Titles = columns.map((o, i) => <TableTitle<T> key={o._id} column={o} isLast={i === columns.length - 1} colIndex={i} />);
    let RemoveTitle = !onRemove ? null : <><TableGap dir='v' /><div className='aio-input-table-remove-title'></div></>;
    return <div {...headerAttrs}>{Titles}{RemoveTitle}<TableGap dir='h' /></div>
}
const TableTitle = <T,>(p:{ column: I_column<T>, isLast: boolean, colIndex: number }) =>{
    const { column, isLast, colIndex } = p;
    let { getCellAttrs, DragColumns } = useProvider();
    const attrs = { 
        ...getCellAttrs({ column, type: 'title',row:undefined,rowIndex:0 }), 
        ...DragColumns.getDragAttrs(colIndex),...DragColumns.getDropAttrs(colIndex) 
    }
    return (<><div {...attrs}>{attrs.title}</div>{!isLast && <TableGap dir='v' />}</>)
}
const TableRow = <T,>(p:{ row: any, isLast: boolean, rowIndex: number }) => {
    const { row, isLast, rowIndex } = p;
    let { remove, rootProps, columns, getRowAttrs,getIcon } = useProvider();
    function getCells() {
        return columns.map((column, i) => {
            let key = row._id + ' ' + column._id;
            let isLast = i === columns.length - 1;
            return (<TableCell<T> isLast={isLast} key={key} row={row} rowIndex={rowIndex} column={column} />)
        })
    }
    let { onRemove } = rootProps;
    return (
        <>
            <div key={row._id} {...getRowAttrs(row, rowIndex)}>
                {getCells()}
                {onRemove ? <><TableGap dir='v' /><button className='aio-input-table-remove' onClick={() => remove(row, rowIndex)}>{getIcon('mdiClose', 0.8)}</button></> : null}
            </div>
            <TableGap dir='h' />
        </>
    )
}
const TableCell = <T,>(p: { row: any, rowIndex: number, column: I_column<T>, isLast: boolean }) => {
    let { row, rowIndex, column, isLast } = p;
    let { getCellAttrs, rootProps } = useProvider();
    let { onChange = () => { }, value = [] } = rootProps;
    //cellNewValue is used to eval please dont remove it
    function setCell(row: any, column: I_column<T>, cellNewValue: any) {
        row = JSON.parse(JSON.stringify(row));
        eval(`${column.value} = cellNewValue`);
        onChange(value.map((o: any) => o._id !== row._id ? o : row))
    }
    return (
        <Fragment key={row._id + ' ' + column._id}>
            <div {...getCellAttrs({ row, rowIndex, column, type: 'cell' })} >
                <TableCellContent<T> 
                    key={row._id + ' ' + column._id} row={row} rowIndex={rowIndex} column={column}
                    onChange={(value) => setCell(row, column, value)}
                />
            </div>
            {!isLast && <TableGap dir='v' />}
        </Fragment>
    )
}
const TableCellContent = <T,>(props:{ row: T, column: I_column<T>, rowIndex: number, onChange?: (newValue: any) => void }) => {
    let { row, column, rowIndex, onChange } = props;
    let { getDynamics,rootProps } = useProvider();
    const {getValue = {}} = rootProps;
    if (column.template !== undefined) { 
        const p:any = {row,column,rowIndex,change:(newRow:any)=>(onChange || (()=>{}))(newRow)}
        if(typeof column.template === 'string' && getValue[column.template]){return getValue[column.template](p)}
        if(typeof column.template === 'function'){return column.template(p)}
    }
    return getDynamics({ value: column.value, row, rowIndex, column })
}