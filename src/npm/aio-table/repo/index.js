var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createContext, createRef, Fragment, useContext, useEffect, useRef, useState } from "react";
import AIOInput from "aio-input";
import * as UT from 'aio-utils';
import usePopup from "aio-popup";
import AIODate from "aio-date";
import { Filterbar, usePaging, useSort } from "aio-component-utils";
import "./index.css";
const Context = createContext({});
const Provider = (p) => _jsx(Context.Provider, { value: p.value, children: p.children });
const useProvider = () => useContext(Context);
const AIOTable = (props) => {
    const popup = usePopup();
    let [dom] = useState(createRef());
    let [searchValue, setSearchValue] = useState('');
    const [columns, setColumns] = useState([]);
    const [searchColumns, setSearchColumns] = useState([]);
    const [excelColumns, setExcelColumns] = useState([]);
    const [filterColumns, setFilterColumns] = useState([]);
    const filterColumnsRef = useRef(filterColumns);
    filterColumnsRef.current = filterColumns;
    const rowsIndexDicRef = useRef({});
    const setRowsIndexDic = (rowsIndexDic) => rowsIndexDicRef.current = rowsIndexDic;
    const getRowsIndexDic = () => rowsIndexDicRef.current;
    const propsRef = useRef(props);
    propsRef.current = props;
    const pagingHook = usePaging({ rows: props.value, paging: props.paging, onChange: props.onChangePaging });
    const tableHook = useTable(() => propsRef.current, () => pagingHook.paging);
    const getIconRef = useRef(new UT.GetSvg());
    const getIcon = getIconRef.current.getIcon;
    const DragColumns = UT.useDrag((dragIndex, dropIndex, reOrder) => setColumns(reOrder(columns, dragIndex, dropIndex)));
    const getGetValue = (sort, column) => {
        if (sort.getValue) {
            return sort.getValue;
        }
        return (row) => {
            const isDate = ['month', 'day', 'hour', 'minute'].indexOf(column.type || 'text') !== -1;
            const cellValue = tableHook.getCellValue({ row, rowIndex: 0, isFirst: false, isLast: false, column, change: () => { }, isDate }, column.value);
            if (isDate) {
                const DATE = new AIODate();
                try {
                    return DATE.getTime(cellValue);
                }
                catch (_a) {
                    return 0;
                }
            }
            return cellValue;
        };
    };
    const getSorts = (columns) => {
        let sorts = [];
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const { _id } = column;
            const sort = column.sort === true ? { sortId: _id } : column.sort;
            if (!sort) {
                continue;
            }
            let { active = false, dir = 'dec', sortId } = sort;
            let sortItem = { dir, title: sort.title || column.title, sortId, active, getValue: getGetValue(sort, column) };
            sorts.push(sortItem);
        }
        return sorts;
    };
    const sortHook = useSort({
        sorts: [],
        rows: propsRef.current.value,
        onChangeRows: props.onChange,
        onChangeSort: props.onChangeSort,
    });
    const isDate = (column) => ['month', 'day', 'hour', 'minute'].indexOf(column.type || 'text') !== -1;
    function getColumns() {
        let { columns = [] } = props;
        let searchColumns = [], excelColumns = [], filterColumns = [];
        let updatedColumns = columns.map((o) => {
            let { id = 'aitc' + Math.round(Math.random() * 1000000), filterId, search, excel } = o;
            let column = Object.assign(Object.assign({}, o), { _id: id });
            if (search) {
                searchColumns.push(column);
            }
            if (excel) {
                excelColumns.push(column);
            }
            if (filterId) {
                filterColumns.push(column);
            }
            return column;
        });
        setColumns(updatedColumns);
        setSearchColumns(searchColumns);
        setExcelColumns(excelColumns);
        setFilterColumns(filterColumns);
        return updatedColumns;
    }
    useEffect(() => {
        const columns = getColumns();
        sortHook.setSorts(getSorts(columns));
    }, []);
    function getTimeText(column, value) {
        if (!value || value === null) {
            return '';
        }
        const t = column.type;
        const DATE = new AIODate();
        let pattern = '{year}/{month}';
        if (t !== 'month') {
            pattern += '/{day}';
            if (t !== 'day') {
                pattern += ' {hour}';
                if (t === 'minute') {
                    pattern += ' : {minute}';
                }
                else {
                    pattern += ' : 00';
                }
            }
        }
        return DATE.getDateByPattern(value, pattern);
    }
    function add() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!props.onAdd) {
                return;
            }
            const res = yield props.onAdd();
            if (res && props.onChange) {
                props.onChange([res, ...props.value]);
            }
        });
    }
    function remove(row, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!props.onRemove) {
                return;
            }
            const res = yield props.onRemove({ row, rowIndex: index });
            if (res === true && props.onChange) {
                props.onChange(props.value.filter((o) => o._id !== row._id));
            }
        });
    }
    function exportToExcel() {
        let list = [];
        if (typeof props.excel === 'function') {
            list = props.excel(props.value);
        }
        else {
            for (let rowIndex = 0; rowIndex < props.value.length; rowIndex++) {
                const isFirst = rowIndex === 0;
                const isLast = rowIndex === props.value.length - 1;
                let row = props.value[rowIndex], json = {};
                for (let j = 0; j < excelColumns.length; j++) {
                    const column = excelColumns[j], { excel } = column;
                    let key = '';
                    if (excel === true) {
                        if (typeof column.title === 'string') {
                            key = column.title;
                        }
                        else {
                            key = 'untitle';
                        }
                    }
                    else if (typeof excel === 'string') {
                        key = excel;
                    }
                    else {
                        continue;
                    }
                    const cellDetail = { row, rowIndex, isFirst, isLast, column, change: () => { }, isDate: isDate(column) };
                    json[key] = tableHook.getCellValue(cellDetail, column.value, '');
                }
                list.push(json);
            }
        }
        UT.ExportToExcel(list, { promptText: typeof props.excel === 'string' ? props.excel : 'Inter Excel File Name' });
    }
    function getSearchedRows(rows) {
        if (props.onSearch !== true) {
            return rows;
        }
        if (!searchColumns.length || !searchValue) {
            return rows;
        }
        const rowsIndexDic = getRowsIndexDic();
        return UT.Search(rows, searchValue, (row) => {
            const { isFirst, isLast, rowIndex } = rowsIndexDic[(row)._id];
            let str = '';
            for (let i = 0; i < searchColumns.length; i++) {
                let column = searchColumns[i];
                const cellDetail = { row, rowIndex, isFirst, isLast, column, change: () => { }, isDate: isDate(column) };
                let cellValue = tableHook.getCellValue(cellDetail, column.value, '');
                if (cellValue) {
                    str += cellValue + ' ';
                }
            }
            return str;
        });
    }
    function getRows() {
        const rows = props.value;
        const rowsIndexDic = {};
        for (let i = 0; i < props.value.length; i++) {
            rowsIndexDic[props.value[i]._id] = { rowIndex: i, isFirst: i === 0, isLast: i === rows.length - 1 };
        }
        setRowsIndexDic(rowsIndexDic);
        let searchedRows = getSearchedRows(rows);
        let sortedRows = sortHook.getSortedRows(searchedRows);
        let pagedRows = pagingHook.getPagedRows(sortedRows);
        return { rows: props.value, searchedRows, sortedRows, pagedRows };
    }
    function search(searchValue) {
        if (props.onSearch === true) {
            setSearchValue(searchValue);
        }
        else if (typeof props.onSearch === 'function') {
            props.onSearch(searchValue);
        }
    }
    const changeCell = (cellDetail, cellNewValue) => {
        if (!props.onChange) {
            return;
        }
        const { column } = cellDetail;
        if (typeof column.value !== 'string' || column.value.indexOf('row.') !== 0) {
            return;
        }
        let row = JSON.parse(JSON.stringify(cellDetail.row));
        const rowId = row._id;
        eval(`${column.value} = cellNewValue`);
        props.onChange(props.value.map((o) => o._id !== rowId ? o : row));
    };
    let ROWS = getRows();
    const { gap = [0, 1] } = props;
    let attrs = UT.AddToAttrs(props.attrs, { className: ['aio-table', props.className], style: Object.assign({ gap: gap[1] }, props.style), attrs: { ref: dom } });
    const context = {
        rootProps: props, getTimeText, isDate, columns, excelColumns, filterColumns, changeCell, tableHook, sortHook, ROWS,
        getRowsIndexDic, add, remove, search, exportToExcel, DragColumns, getIcon, popup,
    };
    return (_jsxs(Provider, { value: context, children: [_jsxs("div", Object.assign({}, attrs, { children: [_jsx(TableToolbar, {}), !!props.filter &&
                        _jsx(Filterbar, { columns: filterColumns, filter: props.filter, columnOption: { text: (column) => column.title, id: (column) => column.filterId, type: (column) => column.type || 'text' } }), _jsxs("div", { className: 'aio-table-unit aio-table-scroll', style: { gap: gap[1] }, children: [_jsx(TableHeader, {}), _jsx(TableRows, {})] }), pagingHook.render()] })), popup.render()] }));
};
export default AIOTable;
const TableRows = () => {
    let { ROWS, rootProps } = useProvider();
    let { rowOption = {}, rowsTemplate, placeholder = 'there is not any items' } = rootProps;
    const { before: rowBefore = () => null, after: rowAfter = () => null, template: rowTemplate, } = rowOption;
    let rows = ROWS.pagedRows || [];
    let content;
    if (rowsTemplate) {
        content = rowsTemplate(rows);
    }
    else if (rows.length) {
        content = rows.map((o, i) => {
            let { id = 'ailr' + Math.round(Math.random() * 10000000) } = o;
            o._id = o._id === undefined ? id : o._id;
            const rowDetail = {
                row: o, rowIndex: i,
                isFirst: i === 0,
                isLast: i === rows.length - 1
            };
            let Row;
            if (rowTemplate) {
                Row = rowTemplate(rowDetail);
            }
            else {
                Row = _jsx(TableRow, { rowDetail: rowDetail }, o._id);
            }
            return (_jsxs(Fragment, { children: [rowBefore(rowDetail), Row, rowAfter(rowDetail)] }, o._id));
        });
    }
    else if (placeholder) {
        content = _jsx("div", { style: { width: '100%', textAlign: 'center', padding: 12, boxSizing: 'border-box' }, children: placeholder });
    }
    else {
        return null;
    }
    const { gap = [0, 1] } = rootProps;
    return _jsx("div", { className: 'aio-table-rows', style: { gap: gap[1] }, children: content });
};
const TableToolbar = () => {
    let { add, exportToExcel, search, rootProps, excelColumns, getIcon, sortHook } = useProvider();
    let { toolbarAttrs, toolbar, onAdd, onSearch, value } = rootProps;
    toolbarAttrs = UT.AddToAttrs(toolbarAttrs, { className: 'aio-table-toolbar' });
    if (!onAdd && !toolbar && !onSearch && !sortHook.sorts.length && !excelColumns.length) {
        return null;
    }
    function getAddText() {
        let { addText } = rootProps;
        if (!rootProps.addText) {
            return getIcon('mdiPlusThick', 0.8);
        }
        return typeof addText === 'function' ? addText(value) : addText;
    }
    return (_jsxs("div", Object.assign({}, toolbarAttrs, { children: [toolbar && _jsx("div", { className: 'aio-table-toolbar-content', children: typeof toolbar === 'function' ? toolbar() : toolbar }), _jsx("div", { className: 'aio-table-search', children: !!onSearch && _jsx(AIOInput, { type: 'text', onChange: (value) => search(value), after: getIcon('mdiMagnify', 0.7) }) }), sortHook.renderSortButton(), !!excelColumns.length && _jsx("div", { className: 'aio-table-toolbar-button', onClick: () => exportToExcel(), children: getIcon('mdiFileExcel', 0.8) }), !!onAdd && _jsx("div", { className: 'aio-table-toolbar-button', onClick: () => add(), children: getAddText() })] })));
};
const TableHeader = () => {
    let { rootProps, columns } = useProvider();
    let { headerAttrs, onRemove, gap = [0, 1] } = rootProps;
    headerAttrs = UT.AddToAttrs(headerAttrs, { className: 'aio-table-header', style: { gap: gap[0] } });
    let Titles = columns.map((o, i) => _jsx(TableTitle, { column: o, isLast: i === columns.length - 1, colIndex: i }, o._id));
    let RemoveTitle = !onRemove ? null : _jsx("div", { className: 'aio-table-remove-title' });
    return _jsxs("div", Object.assign({}, headerAttrs, { children: [Titles, RemoveTitle] }));
};
const TableTitle = (p) => {
    const { column, isLast, colIndex } = p;
    let { tableHook, DragColumns } = useProvider();
    const attrs = Object.assign(Object.assign(Object.assign({}, tableHook.getTitleAttrs(column)), DragColumns.getDragAttrs(colIndex)), DragColumns.getDropAttrs(colIndex));
    return _jsx("div", Object.assign({}, attrs, { children: attrs.title }));
};
const TableRow = (props) => {
    const { rowDetail } = props;
    const { row, rowIndex } = rowDetail;
    const rowId = row._id;
    let { remove, rootProps, columns, tableHook, getIcon, isDate } = useProvider();
    function getCells() {
        return columns.map((column, i) => {
            const key = rowId + ' ' + column._id;
            const cellDetail = Object.assign(Object.assign({}, rowDetail), { column, change: (cellNewValue) => {
                    if (!rootProps.onChange) {
                        return;
                    }
                    if (typeof column.value !== 'string' || column.value.indexOf('row.') !== 0) {
                        return;
                    }
                    let row = JSON.parse(JSON.stringify(cellDetail.row));
                    eval(`${column.value} = cellNewValue`);
                    rootProps.onChange(rootProps.value.map((o) => o._id !== rowId ? o : row));
                }, isDate: isDate(column) });
            const cellValue = tableHook.getCellValue(cellDetail, column.value);
            return (_jsx(TableCell, { cellDetail: cellDetail, cellValue: cellValue }, key));
        });
    }
    let { onRemove } = rootProps;
    return (_jsx(_Fragment, { children: _jsxs("div", Object.assign({}, tableHook.getRowAttrs(props.rowDetail), { children: [getCells(), onRemove ? _jsx("button", { className: 'aio-table-remove', onClick: () => remove(row, rowIndex), children: getIcon('mdiClose', 0.8) }) : null] }), rowId) }));
};
const TableCell = (props) => {
    const { cellDetail, cellValue } = props;
    const { row, column, isLast } = cellDetail;
    const { tableHook, getTimeText } = useProvider();
    const { template, before, after, subtext } = column;
    const rowId = row._id;
    const colId = column._id;
    const isTime = ['month', 'day', 'hour', 'minute'].indexOf(column.type || 'text') !== -1;
    const templateValue = isTime ? getTimeText(cellValue) : tableHook.getCellValue(cellDetail, template);
    const beforeValue = tableHook.getCellValue(cellDetail, before, undefined);
    const afterValue = tableHook.getCellValue(cellDetail, after, undefined);
    const subtextValue = tableHook.getCellValue(cellDetail, subtext, undefined);
    return (_jsx(Fragment, { children: _jsxs("div", Object.assign({}, tableHook.getCellAttrs(props.cellDetail, props.cellValue), { children: [beforeValue !== undefined && _jsx("div", { className: "aio-table-cell-before", children: beforeValue }), _jsxs("div", { className: `aio-table-cell-value${subtext !== undefined ? ' has-subtext' : ''}`, "data-subtext": subtextValue, children: [templateValue !== undefined && templateValue, templateValue === undefined && cellValue] }), afterValue !== undefined && _jsx("div", { className: "aio-table-cell-after", children: afterValue })] })) }, rowId + ' ' + colId));
};
const useTable = (getProps, getPaging) => {
    const DragRows = UT.useDrag((dragData, dropData, reOrder) => {
        const { onSwap, onChange } = getProps();
        const { dragIndex } = dragData;
        const { dropIndex, rows } = dropData;
        const newRows = reOrder(rows, dragIndex, dropIndex);
        const from = rows[dragIndex];
        const to = rows[dropIndex];
        if (typeof onSwap === 'function') {
            onSwap(newRows, from, to);
        }
        else if (onChange) {
            onChange(newRows);
        }
    });
    const getCellValue = (cellDetail, cellValue, def) => {
        const { getValue = {} } = getProps();
        const paging = getPaging();
        if (paging) {
            let { number, size } = paging;
            cellDetail = Object.assign(Object.assign({}, cellDetail), { rowIndex: cellDetail.rowIndex + ((number - 1) * size) });
        }
        let type = typeof cellValue;
        if (type === 'string') {
            const { row } = cellDetail;
            let result = cellValue;
            if (getValue[cellValue]) {
                result = getValue[cellValue](cellDetail);
            }
            else if (cellValue.indexOf('row.') !== -1) {
                try {
                    eval(`result = ${cellValue}`);
                }
                catch (_a) {
                    result = '';
                }
            }
            return result === undefined ? def : result;
        }
        if (type === 'undefined') {
            return def;
        }
        if (type === 'function') {
            return cellValue(cellDetail);
        }
        return cellValue === undefined ? def : cellValue;
    };
    const getColValue = (column, field, def) => {
        const colValue = column[field];
        let type = typeof colValue;
        let result;
        if (type === 'function') {
            result = colValue(column);
        }
        else {
            result = colValue;
        }
        return result === undefined ? def : result;
    };
    const getCellAttrs = (cellDetail, cellValue) => {
        const { column } = cellDetail;
        const attrs = getCellValue(cellDetail, column.attrs, {});
        const justify = getColValue(column, 'justify', false);
        const width = getColValue(column, 'width');
        const minWidth = getColValue(column, 'minWidth');
        const className = `aio-table-cell` + (justify ? ` aio-table-cell-justify` : '');
        const style = { width, minWidth, flex: width ? undefined : 1 };
        return UT.AddToAttrs(attrs, { className, style, attrs: { title: typeof cellValue === 'string' ? cellValue : undefined } });
    };
    const getTitleAttrs = (column) => {
        const attrs = getColValue(column, 'titleAttrs', {});
        const justify = getColValue(column, 'justify', false);
        const width = getColValue(column, 'width');
        const minWidth = getColValue(column, 'minWidth');
        const className = `aio-table-title` + (justify ? ` aio-table-title-justify` : '');
        const style = { width, minWidth, flex: width ? undefined : 1 };
        return UT.AddToAttrs(attrs, { className, style, attrs: { title: typeof column.title === 'string' ? column.title : undefined } });
    };
    const getRowAttrs = (rowDetail) => {
        const { rowOption = {}, onSwap, value, gap = [0, 1] } = getProps();
        const { attrs: rowAttrs } = rowOption;
        const attrs = rowAttrs ? rowAttrs(rowDetail) : {};
        let obj = UT.AddToAttrs(attrs, { className: 'aio-table-row', style: { gap: gap[0] } });
        if (onSwap) {
            obj = Object.assign(Object.assign(Object.assign({}, obj), DragRows.getDragAttrs({ dragIndex: rowDetail.rowIndex })), DragRows.getDropAttrs({ dropIndex: rowDetail.rowIndex, rows: value }));
        }
        return obj;
    };
    return { getCellValue, getColValue, getCellAttrs, getTitleAttrs, getRowAttrs };
};
