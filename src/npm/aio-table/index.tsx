import { createContext, createRef, FC, Fragment, ReactNode, useContext, useEffect, useRef, useState } from "react";
import AIOInput from "../aio-input";
import * as UT from './../../npm/aio-utils';
import usePopup, { I_usePopup } from "../aio-popup";
import "./repo/index.css"
import AIODate from "../aio-date";
import { Filterbar, I_filter, I_paging, I_sort, I_sortHook, usePaging, useSort } from "../aio-component-utils";
type I_rows<T> = { rows: T[], searchedRows: T[], sortedRows: T[], pagedRows: T[] }
type I_rowOption<T, R> = (p: I_rowDetail<T>) => R
type I_cellOption<T, R> = ((p: I_cellDetail<T>) => R) | string;
type I_rowDetail<T> = { row: T, rowIndex: number, isFirst: boolean, isLast: boolean }
type I_cellDetail<T> = I_rowDetail<T> & { column: I_table_column<T>, change: (newRow: T) => void, isDate: boolean }
type I_rowsIndexDic = { [id: string]: { rowIndex: number, isFirst: boolean, isLast: boolean } }
export type I_table_paging = I_paging
export type I_table_sort<T> = I_sort<T>
export type I_table_filter = I_filter
export type I_table_column<T> = {
    title?: any,
    sort?: true | I_table_sort<T>,
    filterId?: string,
    search?: boolean,
    id?: string,
    _id?: string,
    width?: any,
    minWidth?: any,
    excel?: string | boolean,
    justify?: boolean,
    value?: string,
    attrs?: I_cellOption<T, { [attrs: string]: any }>,
    before?: I_cellOption<T, ReactNode>,
    after?: I_cellOption<T, ReactNode>,
    subtext?: I_cellOption<T, ReactNode>,
    template?: I_cellOption<T, ReactNode>,
    titleAttrs?: { [attrs: string]: any },
    type?: 'text' | 'number' | 'month' | 'day' | 'hour' | 'minute'
}
export type I_table<T> = {
    fa?: boolean,
    addText?: ReactNode | ((value: any) => ReactNode),
    columnGap?: number,
    columns?: I_table_column<T>[],
    excel?: string | ((value: any[]) => any[]),
    getValue?: { [key: string]: (p: { row: T, column: I_table_column<T>, rowIndex: number, change: (newRow: T) => void }) => any },
    headerAttrs?: any,
    onAdd?: () => Promise<T | undefined>,
    onRemove?: (p: { row: T, rowIndex?: number }) => Promise<boolean>,
    onChangePaging?: (newPaging: I_table_paging) => void,
    onChangeSort?: (sorts: I_table_sort<T>[]) => Promise<boolean>,
    onSwap?: true | ((newValue: T[], startRow: T, endRow: T) => void),
    onSearch?: true | ((searchValue: string) => void),
    paging?: I_table_paging,
    removeText?: string,
    rowOption?: {
        before?: I_rowOption<T, ReactNode>,
        after?: I_rowOption<T, ReactNode>,
        attrs?: I_rowOption<T, { [attrs: string]: any }>,
        template?: I_rowOption<T, ReactNode>
    },
    cellAttrs?: string | ((p: { row: T, column: I_table_column<T>, rowIndex: number }) => any)
    rowGap?: number,
    rowsTemplate?: (rows: T[]) => ReactNode,
    toolbar?: ReactNode | (() => ReactNode),
    toolbarAttrs?: any,
    tabIndex?: number,
    value: T[],
    onChange?: (v: T[]) => void,
    className?: string,
    style?: any,
    attrs?: any,
    placeholder?: ReactNode,
    filters?:I_table_filter[],
    onChangeFilter?:(newFilters:I_table_filter[])=>undefined | void | I_table_filter[] | true | false
}
type I_context<T> = {
    popup: I_usePopup,
    rootProps: I_table<T>,
    columns: I_table_column<T>[],
    ROWS: I_rows<T>,
    add: () => void, remove: (row: T, index: number) => void, search: (searchValue: string) => void,
    exportToExcel: () => void,
    sortHook: I_sortHook<T>,
    excelColumns: I_table_column<T>[],
    filterColumns: I_table_column<T>[],
    tableHook: I_tableHook<T>,
    getRowsIndexDic: () => I_rowsIndexDic,
    changeCell: I_changeCell<T>,
    DragColumns: UT.I_useDrag,
    getIcon: UT.GetSvg["getIcon"],
    getTimeText: (column: I_table_column<T>, value?: any) => string,
    isDate: (column: I_table_column<T>) => boolean
}
type I_changeCell<T> = (cellDetail: I_cellDetail<T>, cellNewValue: any) => void;
type I_tableHook<T> = {
    getCellValue: (cellDetail: I_cellDetail<T>, cellValue: any, def?: any) => any;
    getColValue: (column: I_table_column<T>, field: keyof I_table_column<T>, def?: any) => any;
    getCellAttrs: (cellDetail: I_cellDetail<T>, cellValue: any) => { [attr: string]: any };
    getTitleAttrs: (column: I_table_column<T>) => any;
    getRowAttrs: (rowDetail: I_rowDetail<T>) => { [attr: string]: any };
}
const Context = createContext<I_context<any>>({} as any);
const Provider = <T,>(p: { value: I_context<T>, children: ReactNode }) => <Context.Provider value={p.value}>{p.children}</Context.Provider>
const useProvider = () => useContext(Context)
const AIOTable = <T,>(props: I_table<T>) => {
    const popup = usePopup()
    let [dom] = useState(createRef())
    let [searchValue, setSearchValue] = useState<string>('')
    const [columns, setColumns] = useState<I_table_column<T>[]>([]);
    const [searchColumns, setSearchColumns] = useState<I_table_column<T>[]>([]);
    const [excelColumns, setExcelColumns] = useState<I_table_column<T>[]>([]);
    const [filterColumns, setFilterColumns] = useState<I_table_column<T>[]>([]);
    const filterColumnsRef = useRef<I_table_column<T>[]>(filterColumns)
    filterColumnsRef.current = filterColumns;
    const rowsIndexDicRef = useRef<I_rowsIndexDic>({})
    const setRowsIndexDic = (rowsIndexDic: I_rowsIndexDic) => rowsIndexDicRef.current = rowsIndexDic
    const getRowsIndexDic = () => rowsIndexDicRef.current
    const propsRef = useRef<I_table<T>>(props)
    propsRef.current = props;
    const pagingHook = usePaging({rows:props.value,paging:props.paging,onChange:props.onChangePaging})
    const tableHook = useTable(() => propsRef.current, () => pagingHook.paging)
    const getIconRef = useRef<UT.GetSvg>(new UT.GetSvg())
    const getIcon = getIconRef.current.getIcon;
    const DragColumns = UT.useDrag((dragIndex, dropIndex, reOrder) => setColumns(reOrder(columns, dragIndex, dropIndex)))
    const getGetValue = (sort: I_table_sort<T>, column: I_table_column<T>):((row:T)=>any) => {
        if (sort.getValue) { return sort.getValue }
        return (row: T) => {
            const isDate = ['month', 'day', 'hour', 'minute'].indexOf(column.type || 'text') !== -1
            const cellValue = tableHook.getCellValue({ row,rowIndex:0,isFirst:false,isLast:false, column, change: () => { }, isDate }, column.value)
            if (isDate) {
                const DATE = new AIODate();
                try { return DATE.getTime(cellValue) }
                catch { return 0 }
            }
            return cellValue
        }
    }
    const getSorts = (columns: I_table_column<T>[]):I_table_sort<T>[] => {
        let sorts:I_table_sort<T>[] = [];
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const { _id } = column;
            const sort = column.sort === true ? { sortId: _id as string } as I_table_sort<T> : column.sort;
            if (!sort) { continue }
            let { active = false, dir = 'dec', sortId } = sort as I_table_sort<T>;
            let sortItem: I_table_sort<T> = { dir, title: sort.title || column.title, sortId, active, getValue: getGetValue(sort, column) }
            sorts.push(sortItem)
        }
        return sorts
    }

    
    const sortHook = useSort<T>({
        sorts:[],
        rows:propsRef.current.value,
        onChangeRows:props.onChange,
        onChangeSort:props.onChangeSort,
    })
    const isDate = (column: I_table_column<T>) => ['month', 'day', 'hour', 'minute'].indexOf(column.type || 'text') !== -1
    function getColumns() {
        let { columns = [] } = props;
        let searchColumns: I_table_column<T>[] = [], excelColumns: I_table_column<T>[] = [], filterColumns: I_table_column<T>[] = [];
        let updatedColumns = columns.map((o: I_table_column<T>) => {
            let { id = 'aitc' + Math.round(Math.random() * 1000000), filterId, search, excel } = o;
            let column = { ...o, _id: id };
            if (search) { searchColumns.push(column) }
            if (excel) { excelColumns.push(column) }
            if (filterId) { filterColumns.push(column) }
            return column
        })
        setColumns(updatedColumns);
        setSearchColumns(searchColumns)
        setExcelColumns(excelColumns);
        setFilterColumns(filterColumns);
        return updatedColumns;
    }
    useEffect(() => {
        const columns = getColumns();
        sortHook.setSorts(getSorts(columns));
    }, [])
    function getTimeText(column: I_table_column<T>, value?: any) {
        if (!value || value === null) { return '' }
        const t = column.type;
        const DATE = new AIODate()
        let pattern = '{year}/{month}'
        if (t !== 'month') {
            pattern += '/{day}'
            if (t !== 'day') {
                pattern += ' {hour}'
                if (t === 'minute') { pattern += ' : {minute}' }
                else { pattern += ' : 00' }
            }
        }
        return DATE.getDateByPattern(value, pattern)
    }

    async function add() {
        if (!props.onAdd) { return }
        const res = await props.onAdd()
        if (res && props.onChange) { props.onChange([res, ...props.value]) }
    }
    async function remove(row: any, index: number) {
        if (!props.onRemove) { return }
        const res = await props.onRemove({ row, rowIndex: index });
        if (res === true && props.onChange) { props.onChange(props.value.filter((o: any) => o._id !== row._id)) }
    }
    function exportToExcel() {
        let list = [];
        if (typeof props.excel === 'function') {
            list = props.excel(props.value)
        }
        else {
            for (let rowIndex = 0; rowIndex < props.value.length; rowIndex++) {
                const isFirst = rowIndex === 0;
                const isLast = rowIndex === props.value.length - 1;
                let row = props.value[rowIndex], json: any = {};
                for (let j = 0; j < excelColumns.length; j++) {
                    const column = excelColumns[j], { excel } = column;
                    let key: string = '';
                    if (excel === true) {
                        if (typeof column.title === 'string') { key = column.title }
                        else { key = 'untitle' }
                    }
                    else if (typeof excel === 'string') { key = excel }
                    else { continue }
                    const cellDetail: I_cellDetail<T> = { row, rowIndex, isFirst, isLast, column, change: () => { }, isDate: isDate(column) }
                    json[key] = tableHook.getCellValue(cellDetail, column.value, '')
                }
                list.push(json)
            }
        }
        UT.ExportToExcel(list, { promptText: typeof props.excel === 'string' ? props.excel : 'Inter Excel File Name' })
    }
    function getSearchedRows(rows: T[]): T[] {
        if (props.onSearch !== true) { return rows }
        if (!searchColumns.length || !searchValue) { return rows }
        const rowsIndexDic = getRowsIndexDic()
        return UT.Search(rows, searchValue, (row) => {
            const { isFirst, isLast, rowIndex } = rowsIndexDic[(row)._id]
            let str = '';
            for (let i = 0; i < searchColumns.length; i++) {
                let column = searchColumns[i];
                const cellDetail: I_cellDetail<T> = { row, rowIndex, isFirst, isLast, column, change: () => { }, isDate: isDate(column) }
                let cellValue = tableHook.getCellValue(cellDetail, column.value, '');
                if (cellValue) { str += cellValue + ' ' }
            }
            return str
        })
    }
    function getRows(): I_rows<T> {
        const rows: T[] = props.value;
        const rowsIndexDic: I_rowsIndexDic = {}
        for (let i = 0; i < props.value.length; i++) {
            rowsIndexDic[(props.value[i] as any)._id] = { rowIndex: i, isFirst: i === 0, isLast: i === rows.length - 1 }
        }
        setRowsIndexDic(rowsIndexDic)
        let searchedRows = getSearchedRows(rows);
        let sortedRows = sortHook.getSortedRows(searchedRows);
        let pagedRows = pagingHook.getPagedRows(sortedRows)
        return { rows: props.value, searchedRows, sortedRows, pagedRows }
    }
    function search(searchValue: string) {
        if (props.onSearch === true) { setSearchValue(searchValue) }
        else if (typeof props.onSearch === 'function') { props.onSearch(searchValue) }
    }
    const changeCell: I_changeCell<T> = (cellDetail, cellNewValue) => {
        if (!props.onChange) { return }
        const { column } = cellDetail;
        if (typeof column.value !== 'string' || column.value.indexOf('row.') !== 0) { return }
        let row = JSON.parse(JSON.stringify(cellDetail.row));
        const rowId = (row as any)._id;
        eval(`${column.value} = cellNewValue`);
        props.onChange(props.value.map((o: any) => o._id !== rowId ? o : row))
    }
    let ROWS: I_rows<T> = getRows();
    let attrs = UT.AddToAttrs(props.attrs, { className: ['aio-table', props.className], style: props.style, attrs: { ref: dom } })
    const context:I_context<T> = {
        rootProps: props, getTimeText, isDate,columns,excelColumns,filterColumns,changeCell,tableHook,sortHook,ROWS,
        getRowsIndexDic,add,remove,search,exportToExcel,DragColumns,getIcon,popup,
    }
    return (
        <Provider value={context}>
            <div {...attrs}>
                <TableToolbar<T> />
                <Filterbar
                    columns={filterColumns} filters={props.filters || []} changeFilters={props.onChangeFilter} 
                    columnOption={{text:(column)=>column.title,id:(column)=>column.filterId as string,type:(column)=>column.type || 'text'}}
                />
                <div className='aio-table-unit aio-table-scroll'><TableHeader<T> /><TableRows<T> /></div>
                {pagingHook.render()}
            </div>
            {popup.render()}
        </Provider>
    )
}
export default AIOTable
const TableGap: FC<{ dir: 'h' | 'v' }> = ({ dir }) => {
    const { rootProps } = useProvider(), { rowGap, columnGap } = rootProps;
    return <div className={`aio-table-border-${dir}`} style={dir === 'h' ? { height: rowGap } : { width: columnGap }}></div>
}
const TableRows = <T,>() => {
    let { ROWS, rootProps } = useProvider()
    let { rowOption = {}, rowsTemplate, placeholder = 'there is not any items' } = rootProps;
    const {
        before: rowBefore = () => null,
        after: rowAfter = () => null,
        template: rowTemplate,

    } = rowOption
    let rows = ROWS.pagedRows || [];
    let content;
    if (rowsTemplate) { content = rowsTemplate(rows) }
    else if (rows.length) {
        content = rows.map((o, i) => {
            let { id = 'ailr' + Math.round(Math.random() * 10000000) } = o;
            o._id = o._id === undefined ? id : o._id;
            const rowDetail: I_rowDetail<T> = {
                row: o, rowIndex: i,
                isFirst: i === 0,
                isLast: i === rows.length - 1
            }
            let Row;
            if (rowTemplate) { Row = rowTemplate(rowDetail) }
            else { Row = <TableRow<T> key={o._id} rowDetail={rowDetail} /> }
            return (<Fragment key={o._id}>{rowBefore(rowDetail)}{Row}{rowAfter(rowDetail)}</Fragment>)
        })
    }
    else if (placeholder) {
        content = <div style={{ width: '100%', textAlign: 'center', padding: 12, boxSizing: 'border-box' }}>{placeholder}</div>
    }
    else { return null }
    return <div className='aio-table-rows'>{content}</div>
}
const TableToolbar = <T,>() => {
    let { add, exportToExcel, search, rootProps, excelColumns, filterColumns, getIcon, sortHook } = useProvider();
    let { toolbarAttrs, toolbar, onAdd, onSearch, value } = rootProps;
    toolbarAttrs = UT.AddToAttrs(toolbarAttrs, { className: 'aio-table-toolbar' })
    if (!onAdd && !toolbar && !onSearch && !sortHook.sorts.length && !excelColumns.length && !filterColumns.length) { return null }

    function getAddText() {
        let { addText } = rootProps;
        if (!rootProps.addText) { return getIcon('mdiPlusThick', 0.8) }
        return typeof addText === 'function' ? addText(value) : addText
    }
    return (
        <>
            <div {...toolbarAttrs}>
                {toolbar && <div className='aio-table-toolbar-content'>{typeof toolbar === 'function' ? toolbar() : toolbar}</div>}
                <div className='aio-table-search'>
                    {!!onSearch && <AIOInput type='text' onChange={(value) => search(value)} after={getIcon('mdiMagnify', 0.7)} />}
                </div>
                {sortHook.renderSortButton()}
                {!!excelColumns.length && <div className='aio-table-toolbar-button' onClick={() => exportToExcel()}>{getIcon('mdiFileExcel', 0.8)}</div>}
                {!!onAdd && <div className='aio-table-toolbar-button' onClick={() => add()}>{getAddText()}</div>}
            </div>
            <TableGap dir='h' />
        </>
    )
}
const TableHeader = <T,>() => {
    let { rootProps, columns } = useProvider();
    let { headerAttrs, onRemove } = rootProps;
    headerAttrs = UT.AddToAttrs(headerAttrs, { className: 'aio-table-header' })
    let Titles = columns.map((o, i) => <TableTitle<T> key={o._id} column={o} isLast={i === columns.length - 1} colIndex={i} />);
    let RemoveTitle = !onRemove ? null : <><TableGap dir='v' /><div className='aio-table-remove-title'></div></>;
    return <div {...headerAttrs}>{Titles}{RemoveTitle}<TableGap dir='h' /></div>
}
const TableTitle = <T,>(p: { column: I_table_column<T>, isLast: boolean, colIndex: number }) => {
    const { column, isLast, colIndex } = p;
    let { tableHook, DragColumns } = useProvider();
    const attrs = {
        ...tableHook.getTitleAttrs(column),
        ...DragColumns.getDragAttrs(colIndex), ...DragColumns.getDropAttrs(colIndex)
    }
    return (<><div {...attrs}>{attrs.title}</div>{!isLast && <TableGap dir='v' />}</>)
}
const TableRow = <T,>(props: { rowDetail: I_rowDetail<T> }) => {
    const { rowDetail } = props;
    const { row, rowIndex } = rowDetail;
    const rowId = (row as any)._id
    let { remove, rootProps, columns, tableHook, getIcon, isDate } = useProvider();
    function getCells() {
        return columns.map((column, i) => {
            const key = rowId + ' ' + column._id;
            const cellDetail: I_cellDetail<T> = {
                ...rowDetail,
                column,
                change: (cellNewValue: any) => {
                    if (!rootProps.onChange) { return }
                    if (typeof column.value !== 'string' || column.value.indexOf('row.') !== 0) { return }
                    let row = JSON.parse(JSON.stringify(cellDetail.row));
                    eval(`${column.value} = cellNewValue`);
                    rootProps.onChange(rootProps.value.map((o: any) => o._id !== rowId ? o : row))
                },
                isDate: isDate(column)
            }
            const cellValue = tableHook.getCellValue(cellDetail, column.value)
            return (<TableCell<T> key={key} cellDetail={cellDetail} cellValue={cellValue} />)
        })
    }
    let { onRemove } = rootProps;
    return (
        <>
            <div key={rowId} {...tableHook.getRowAttrs(props.rowDetail)}>
                {getCells()}
                {onRemove ? <><TableGap dir='v' /><button className='aio-table-remove' onClick={() => remove(row, rowIndex)}>{getIcon('mdiClose', 0.8)}</button></> : null}
            </div>
            <TableGap dir='h' />
        </>
    )
}
const TableCell = <T,>(props: { cellDetail: I_cellDetail<T>, cellValue: any }) => {
    const { cellDetail, cellValue } = props;
    const { row, column, isLast } = cellDetail;
    const { tableHook, getTimeText } = useProvider();
    const { template, before, after, subtext } = column;
    const rowId = (row as any)._id;
    const colId = column._id;
    const isTime = ['month', 'day', 'hour', 'minute'].indexOf(column.type || 'text') !== -1;
    const templateValue = isTime ? getTimeText(cellValue) : tableHook.getCellValue(cellDetail, template);
    const beforeValue = tableHook.getCellValue(cellDetail, before, undefined);
    const afterValue = tableHook.getCellValue(cellDetail, after, undefined);
    const subtextValue = tableHook.getCellValue(cellDetail, subtext, undefined);

    return (
        <Fragment key={rowId + ' ' + colId}>
            <div {...tableHook.getCellAttrs(props.cellDetail, props.cellValue)} >
                {beforeValue !== undefined && <div className="aio-table-cell-before">{beforeValue}</div>}
                <div className={`aio-table-cell-value${subtext !== undefined ? ' has-subtext' : ''}`} data-subtext={subtextValue}>
                    {templateValue !== undefined && templateValue}
                    {templateValue === undefined && cellValue}
                </div>
                {afterValue !== undefined && <div className="aio-table-cell-after">{afterValue}</div>}
            </div>
            {!isLast && <TableGap dir='v' />}
        </Fragment>
    )
}
const useTable = <T,>(getProps: () => I_table<T>, getPaging: () => I_table_paging | undefined): I_tableHook<T> => {
    const DragRows: UT.I_useDrag = UT.useDrag((dragData, dropData, reOrder) => {
        const { onSwap, onChange } = getProps()
        const { dragIndex } = dragData;
        const { dropIndex, rows } = dropData;
        const newRows = reOrder(rows, dragIndex, dropIndex);
        const from = rows[dragIndex];
        const to = rows[dropIndex];
        if (typeof onSwap === 'function') { onSwap(newRows, from, to) }
        else if (onChange) { onChange(newRows) }
    })
    const getCellValue: I_tableHook<T>["getCellValue"] = (cellDetail, cellValue, def) => {
        const { getValue = {} } = getProps()
        const paging = getPaging()
        if (paging) {
            let { number, size } = paging;
            cellDetail = { ...cellDetail, rowIndex: cellDetail.rowIndex + ((number - 1) * size) }
        }
        let type = typeof cellValue;
        if (type === 'string') {
            const { row } = cellDetail;
            let result = cellValue;
            if (getValue[cellValue]) { result = getValue[cellValue](cellDetail) }
            else if (cellValue.indexOf('row.') !== -1) { try { eval(`result = ${cellValue}`); } catch { result = '' } }
            return result === undefined ? def : result;
        }
        if (type === 'undefined') { return def }
        if (type === 'function') { return cellValue(cellDetail) }
        return cellValue === undefined ? def : cellValue
    }
    const getColValue: I_tableHook<T>["getColValue"] = (column, field, def) => {
        const colValue = column[field]
        let type = typeof colValue;
        let result;
        if (type === 'function') { result = colValue(column) }
        else { result = colValue }
        return result === undefined ? def : result
    }
    const getCellAttrs: I_tableHook<T>["getCellAttrs"] = (cellDetail, cellValue) => {
        const { column } = cellDetail;
        const attrs = getCellValue(cellDetail, column.attrs, {});
        const justify = getColValue(column, 'justify', false);
        const width = getColValue(column, 'width');
        const minWidth = getColValue(column, 'minWidth');
        const className = `aio-table-cell` + (justify ? ` aio-table-cell-justify` : '')
        const style = { width, minWidth, flex: width ? undefined : 1 }
        return UT.AddToAttrs(attrs, { className, style, attrs: { title: typeof cellValue === 'string' ? cellValue : undefined } });
    }
    const getTitleAttrs: I_tableHook<T>["getTitleAttrs"] = (column) => {
        const attrs = getColValue(column, 'titleAttrs', {});
        const justify = getColValue(column, 'justify', false);
        const width = getColValue(column, 'width');
        const minWidth = getColValue(column, 'minWidth');
        const className = `aio-table-title` + (justify ? ` aio-table-title-justify` : '')
        const style = { width, minWidth, flex: width ? undefined : 1 }
        return UT.AddToAttrs(attrs, { className, style, attrs: { title: typeof column.title === 'string' ? column.title : undefined } });
    }
    const getRowAttrs: I_tableHook<T>["getRowAttrs"] = (rowDetail: I_rowDetail<T>) => {
        const { rowOption = {}, onSwap, value } = getProps();
        const { attrs: rowAttrs } = rowOption;
        const attrs = rowAttrs ? rowAttrs(rowDetail) : {};
        let obj = UT.AddToAttrs(attrs, { className: 'aio-table-row' })
        if (onSwap) {
            obj = {
                ...obj,
                ...DragRows.getDragAttrs({ dragIndex: rowDetail.rowIndex }),
                ...DragRows.getDropAttrs({ dropIndex: rowDetail.rowIndex, rows: value })
            }
        }
        return obj;
    }
    return { getCellValue, getColValue, getCellAttrs, getTitleAttrs, getRowAttrs }
}
