var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createContext, createRef, Fragment, useContext, useEffect, useRef, useState } from "react";
import AIOInput from "aio-input";
import * as UT from 'aio-utils';
import "./index.css";
const Context = createContext({});
const Provider = (p) => _jsx(Context.Provider, { value: p.value, children: p.children });
const useProvider = () => useContext(Context);
const AIOTable = (rootProps) => {
    let { paging, getValue = {}, value, onChange = () => { }, onAdd, onRemove, excel, onSwap, onSearch, rowAttrs, onChangeSort, className } = rootProps;
    let [dom] = useState(createRef());
    let [searchValue, setSearchValue] = useState('');
    let [columns, setColumns] = useState([]);
    let [searchColumns, setSearchColumns] = useState([]);
    let [excelColumns, setExcelColumns] = useState([]);
    const getIconRef = useRef(new UT.GetSvg());
    const getIcon = getIconRef.current.getIcon;
    let [temp] = useState({});
    const DragRows = UT.useDrag((dragData, dropData, reOrder) => {
        const { dragIndex } = dragData;
        const { dropIndex, rows } = dropData;
        const newRows = reOrder(rows, dragIndex, dropIndex);
        const from = rows[dragIndex];
        const to = rows[dropIndex];
        if (typeof onSwap === 'function') {
            onSwap(newRows, from, to);
        }
        else {
            onChange(newRows);
        }
    });
    const DragColumns = UT.useDrag((dragIndex, dropIndex, reOrder) => setColumns(reOrder(columns, dragIndex, dropIndex)));
    let [sorts, setSorts] = useState([]);
    function getColumns() {
        let { columns = [] } = rootProps;
        let searchColumns = [], excelColumns = [];
        let updatedColumns = columns.map((o) => {
            let { id = 'aitc' + Math.round(Math.random() * 1000000), sort, search, excel } = o;
            let column = Object.assign(Object.assign({}, o), { _id: id });
            if (search) {
                searchColumns.push(column);
            }
            if (excel) {
                excelColumns.push(column);
            }
            return column;
        });
        setColumns(updatedColumns);
        setSearchColumns(searchColumns);
        setExcelColumns(excelColumns);
        return updatedColumns;
    }
    function getSorts(columns) {
        let sorts = [];
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            let { _id } = column;
            let sort = column.sort === true ? {} : column.sort;
            if (!sort) {
                continue;
            }
            let { active = false, dir = 'dec' } = sort;
            let getValue;
            if (sort.getValue) {
                getValue = sort.getValue;
            }
            else {
                getValue = (row) => getDynamics({ value: column.value, row, column });
            }
            let type = sort.type || 'string';
            let sortItem = { dir, title: sort.title || column.title, sortId: _id, active, type, getValue };
            sorts.push(sortItem);
        }
        setSorts(sorts);
    }
    function getDynamics(p) {
        let { value, row, column, def, rowIndex } = p;
        if (paging) {
            let { number, size } = paging;
            if (rowIndex)
                rowIndex += ((number - 1) * size);
        }
        let type = typeof value;
        if (type === 'string') {
            let result = value;
            let param = { row: row, column: column, rowIndex: rowIndex };
            if (getValue[value]) {
                result = getValue[value](Object.assign(Object.assign({}, param), { change: () => { } }));
            }
            else if (value.indexOf('row.') !== -1) {
                try {
                    eval(`result = ${value}`);
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
            return value({ row, column, rowIndex });
        }
        return value === undefined ? def : value;
    }
    useEffect(() => { getSorts(getColumns()); }, []);
    function add() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!onAdd) {
                return;
            }
            const row = yield onAdd();
            if (!row) {
                return;
            }
            onChange([Object.assign({}, row), ...value]);
        });
    }
    function remove(row, index) {
        let action = () => onChange(value.filter((o) => o._id !== row._id));
        typeof onRemove === 'function' ? onRemove({ row, action, rowIndex: index }) : action();
    }
    function exportToExcel() {
        let list = [];
        if (typeof rootProps.excel === 'function') {
            list = rootProps.excel(value);
        }
        else {
            for (let i = 0; i < value.length; i++) {
                let row = value[i], json = {};
                for (let j = 0; j < excelColumns.length; j++) {
                    let column = excelColumns[j], { excel, value } = column;
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
                    json[key] = getDynamics({ value, row, column, rowIndex: i });
                }
                list.push(json);
            }
        }
        UT.ExportToExcel(list, { promptText: typeof excel === 'string' ? excel : 'Inter Excel File Name' });
    }
    function getSearchedRows(rows) {
        if (onSearch !== true) {
            return rows;
        }
        if (!searchColumns.length || !searchValue) {
            return rows;
        }
        return UT.Search(rows, searchValue, (row, index) => {
            let str = '';
            for (let i = 0; i < searchColumns.length; i++) {
                let column = searchColumns[i];
                let value = getDynamics({ value: column.value, row, def: '', column, rowIndex: index });
                if (value) {
                    str += value + ' ';
                }
            }
            return str;
        });
    }
    function sortRows(rows, sorts) {
        if (!rows) {
            return [];
        }
        if (!sorts || !sorts.length) {
            return rows;
        }
        return rows.sort((a, b) => {
            for (let i = 0; i < sorts.length; i++) {
                let { dir, getValue } = sorts[i];
                if (!getValue) {
                    return 0;
                }
                let aValue = getValue(a), bValue = getValue(b);
                if (aValue < bValue) {
                    return -1 * (dir === 'dec' ? -1 : 1);
                }
                if (aValue > bValue) {
                    return 1 * (dir === 'dec' ? -1 : 1);
                }
                if (i === sorts.length - 1) {
                    return 0;
                }
            }
            return 0;
        });
    }
    function getSortedRows(rows) {
        if (temp.isInitSortExecuted) {
            return rows;
        }
        if (onChangeSort) {
            return rows;
        }
        let activeSorts = sorts.filter((sort) => sort.active !== false);
        if (!activeSorts.length || !rows.length) {
            return rows;
        }
        temp.isInitSortExecuted = true;
        let sortedRows = sortRows(rows, activeSorts);
        onChange(sortedRows);
        return sortedRows;
    }
    function getRows() {
        let searchedRows = getSearchedRows(value);
        let sortedRows = getSortedRows(searchedRows);
        let pagedRows = paging && !paging.serverSide ? sortedRows.slice((paging.number - 1) * paging.size, paging.number * paging.size) : sortedRows;
        return { rows: value, searchedRows, sortedRows, pagedRows };
    }
    //calculate style of cells and title cells
    function getCellStyle(column) {
        let width = getDynamics({ value: column.width });
        let minWidth = getDynamics({ value: column.minWidth });
        return { width: width ? width : undefined, flex: width ? undefined : 1, minWidth };
    }
    const getCellAttrs = ({ row, rowIndex, column, type }) => {
        let { cellAttrs, titleAttrs } = column;
        let attrs = getDynamics({ value: type === 'title' ? titleAttrs : cellAttrs, column, def: {}, row, rowIndex });
        let justify = getDynamics({ value: column.justify, def: false });
        let cls = `aio-input-table-${type}` + (justify ? ` aio-input-table-${type}-justify` : '');
        attrs = UT.AddToAttrs(attrs, { className: cls, style: getCellStyle(column) });
        if (type === 'title') {
            attrs.title = getDynamics({ value: column.title, def: '' });
        }
        return Object.assign({}, attrs);
    };
    function getRowAttrs(row, rowIndex) {
        let attrs = rowAttrs ? rowAttrs({ row, rowIndex }) : {};
        let obj = UT.AddToAttrs(attrs, { className: 'aio-input-table-row' });
        if (onSwap) {
            obj = Object.assign(Object.assign(Object.assign({}, obj), DragRows.getDragAttrs({ dragIndex: rowIndex })), DragRows.getDropAttrs({ dropIndex: rowIndex, rows: value }));
        }
        return obj;
    }
    function search(searchValue) {
        if (onSearch === true) {
            setSearchValue(searchValue);
        }
        else if (typeof onSearch === 'function') {
            onSearch(searchValue);
        }
    }
    let ROWS = getRows();
    let attrs = UT.AddToAttrs(rootProps.attrs, { className: ['aio-input aio-input-table', className], style: rootProps.style, attrs: { ref: dom } });
    return (_jsx(Provider, { value: {
            ROWS, rootProps, columns, sorts, setSorts, sortRows, excelColumns, getCellAttrs, getRowAttrs,
            add, remove, search, exportToExcel, getDynamics, DragColumns, getIcon
        }, children: _jsxs("div", Object.assign({}, attrs, { children: [_jsx(TableToolbar, {}), _jsxs("div", { className: 'aio-input-table-unit aio-input-scroll', children: [_jsx(TableHeader, {}), _jsx(TableRows, {})] }), !!paging && !!ROWS.rows.length ? _jsx(TablePaging, {}) : ''] })) }));
};
export default AIOTable;
const TableGap = ({ dir }) => {
    const { rootProps } = useProvider(), { rowGap, columnGap } = rootProps;
    return _jsx("div", { className: `aio-input-table-border-${dir}`, style: dir === 'h' ? { height: rowGap } : { width: columnGap } });
};
function TablePaging() {
    let { ROWS, rootProps } = useProvider();
    let [temp] = useState({ timeout: undefined, start: undefined, end: undefined, pages: 0 });
    function fix(paging) {
        if (typeof rootProps.onChangePaging !== 'function') {
            alert('aio-input error => in type table you set paging but forget to set onChangePaging function prop to aio input');
            return { number: 0, size: 0 };
        }
        let { number, size = 20, length = 0, sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100], serverSide } = paging;
        if (!serverSide) {
            length = ROWS.sortedRows.length;
        }
        if (sizes.indexOf(size) === -1) {
            size = sizes[0];
        }
        let pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        let start = number - 3, end = number + 3;
        temp.start = start;
        temp.end = end;
        temp.pages = pages;
        return Object.assign(Object.assign({}, paging), { length, number, size, sizes });
    }
    let [paging, setPaging] = useState(fix(rootProps.paging || { size: 0, number: 0 }));
    useEffect(() => {
        if (rootProps.paging) {
            setPaging(fix(rootProps.paging));
        }
    }, [(rootProps.paging || { size: 0, number: 0, length: 0 }).size, (rootProps.paging || { size: 0, number: 0, length: 0 }).number, (rootProps.paging || { size: 0, number: 0, length: 0 }).length]);
    function changePaging(obj) {
        let newPaging = fix(Object.assign(Object.assign({}, paging), obj));
        setPaging(newPaging);
        if (rootProps.onChangePaging) {
            if (newPaging.serverSide) {
                clearTimeout(temp.timeout);
                temp.timeout = setTimeout(() => {
                    //be khatere fahme payine typescript majbooram dobare in shart ro bezanam
                    if (rootProps.onChangePaging) {
                        rootProps.onChangePaging(newPaging);
                    }
                }, 800);
            }
            else {
                rootProps.onChangePaging(newPaging);
            }
        }
    }
    let { number, size, sizes } = paging;
    let buttons = [];
    let isFirst = true;
    for (let i = temp.start; i <= temp.end; i++) {
        if (i < 1 || i > temp.pages) {
            buttons.push(_jsx("button", { className: 'aio-input-table-paging-button aio-input-table-paging-button-hidden', children: i }, i));
        }
        else {
            let index;
            if (isFirst) {
                index = 1;
                isFirst = false;
            }
            else if (i === Math.min(temp.end, temp.pages)) {
                index = temp.pages;
            }
            else {
                index = i;
            }
            buttons.push(_jsx("button", { className: 'aio-input-table-paging-button' + (index === number ? ' active' : ''), onClick: () => changePaging({ number: index }), children: index }, index));
        }
    }
    function changeSizeButton() {
        if (!sizes || !sizes.length) {
            return null;
        }
        let p = {
            attrs: { className: 'aio-input-table-paging-button aio-input-table-paging-size' },
            type: 'select', value: size, options: sizes, option: { text: 'option', value: 'option' },
            onChange: (value) => changePaging({ size: value }),
            popover: { fitHorizontal: true },
        };
        return (_jsx(AIOInput, Object.assign({}, p)));
    }
    return (_jsxs("div", { className: 'aio-input-table-paging', children: [buttons, changeSizeButton()] }));
}
const TableRows = () => {
    let { ROWS, rootProps } = useProvider();
    let { rowTemplate, rowAfter = () => null, rowBefore = () => null, rowsTemplate, placeholder = 'there is not any items' } = rootProps;
    let rows = ROWS.pagedRows || [];
    let content;
    if (rowsTemplate) {
        content = rowsTemplate(rows);
    }
    else if (rows.length) {
        content = rows.map((o, i) => {
            let { id = 'ailr' + Math.round(Math.random() * 10000000) } = o;
            o._id = o._id === undefined ? id : o._id;
            let isLast = i === rows.length - 1, Row;
            if (rowTemplate) {
                Row = rowTemplate({ row: o, rowIndex: i, isLast });
            }
            else {
                Row = _jsx(TableRow, { row: o, rowIndex: i, isLast: isLast }, o._id);
            }
            return (_jsxs(Fragment, { children: [rowBefore({ row: o, rowIndex: i }), Row, rowAfter({ row: o, rowIndex: i })] }, o._id));
        });
    }
    else if (placeholder) {
        content = _jsx("div", { style: { width: '100%', textAlign: 'center', padding: 12, boxSizing: 'border-box' }, children: placeholder });
    }
    else {
        return null;
    }
    return _jsx("div", { className: 'aio-input-table-rows', children: content });
};
const TableToolbar = () => {
    let { add, exportToExcel, sorts, sortRows, setSorts, search, rootProps, excelColumns, getIcon } = useProvider();
    let { toolbarAttrs, toolbar, onAdd, onSearch, onChangeSort, onChange = () => { }, value, addText } = rootProps;
    toolbarAttrs = UT.AddToAttrs(toolbarAttrs, { className: 'aio-input-table-toolbar' });
    if (!onAdd && !toolbar && !onSearch && !sorts.length && !excelColumns.length) {
        return null;
    }
    function changeSort(sortId, changeObject) {
        let newSorts = sorts.map((sort) => {
            if (sort.sortId === sortId) {
                let newSort = Object.assign(Object.assign({}, sort), changeObject);
                return newSort;
            }
            return sort;
        });
        changeSorts(newSorts);
    }
    function changeSorts(sorts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (onChangeSort) {
                let res = yield onChangeSort(sorts);
                if (res !== false) {
                    setSorts(sorts);
                }
            }
            else {
                setSorts(sorts);
                let activeSorts = sorts.filter((sort) => sort.active !== false);
                if (activeSorts.length) {
                    onChange(sortRows(value, activeSorts));
                }
            }
        });
    }
    function button() {
        if (!sorts.length) {
            return null;
        }
        let p = {
            popover: {
                header: { title: 'Sort', onClose: false },
                setAttrs: (key) => { if (key === 'header') {
                    return { className: 'aio-input-table-toolbar-popover-header' };
                } },
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
                    return (_jsx("div", { onClick: (e) => {
                            e.stopPropagation();
                            changeSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' });
                        }, children: getIcon(dir === 'dec' ? 'mdiArrowDown' : 'mdiArrowUp', 0.8) }));
                }
            },
            attrs: { className: 'aio-input-table-toolbar-button' },
            text: getIcon('mdiSort', 0.7),
            onSwap: (newSorts, from, to) => changeSorts(newSorts),
            onChange: (value, option) => changeSort(value, { active: !option.checked })
        };
        return (_createElement(AIOInput, Object.assign({}, p, { key: 'sortbutton' })));
    }
    function getAddText() {
        let { addText } = rootProps;
        if (!rootProps.addText) {
            return getIcon('mdiPlusThick', 0.8);
        }
        return typeof addText === 'function' ? addText(value) : addText;
    }
    return (_jsxs(_Fragment, { children: [_jsxs("div", Object.assign({}, toolbarAttrs, { children: [toolbar && _jsx("div", { className: 'aio-input-table-toolbar-content', children: typeof toolbar === 'function' ? toolbar() : toolbar }), _jsx("div", { className: 'aio-input-table-search', children: !!onSearch && _jsx(AIOInput, { type: 'text', onChange: (value) => search(value), after: getIcon('mdiMagnify', 0.7) }) }), button(), !!excelColumns.length && _jsx("div", { className: 'aio-input-table-toolbar-button', onClick: () => exportToExcel(), children: getIcon('mdiFileExcel', 0.8) }), !!onAdd && _jsx("div", { className: 'aio-input-table-toolbar-button', onClick: () => add(), children: getAddText() })] })), _jsx(TableGap, { dir: 'h' })] }));
};
const TableHeader = () => {
    let { rootProps, columns } = useProvider();
    let { headerAttrs, onRemove } = rootProps;
    headerAttrs = UT.AddToAttrs(headerAttrs, { className: 'aio-input-table-header' });
    let Titles = columns.map((o, i) => _jsx(TableTitle, { column: o, isLast: i === columns.length - 1, colIndex: i }, o._id));
    let RemoveTitle = !onRemove ? null : _jsxs(_Fragment, { children: [_jsx(TableGap, { dir: 'v' }), _jsx("div", { className: 'aio-input-table-remove-title' })] });
    return _jsxs("div", Object.assign({}, headerAttrs, { children: [Titles, RemoveTitle, _jsx(TableGap, { dir: 'h' })] }));
};
const TableTitle = (p) => {
    const { column, isLast, colIndex } = p;
    let { getCellAttrs, DragColumns } = useProvider();
    const attrs = Object.assign(Object.assign(Object.assign({}, getCellAttrs({ column, type: 'title', row: undefined, rowIndex: 0 })), DragColumns.getDragAttrs(colIndex)), DragColumns.getDropAttrs(colIndex));
    return (_jsxs(_Fragment, { children: [_jsx("div", Object.assign({}, attrs, { children: attrs.title })), !isLast && _jsx(TableGap, { dir: 'v' })] }));
};
const TableRow = (p) => {
    const { row, isLast, rowIndex } = p;
    let { remove, rootProps, columns, getRowAttrs, getIcon } = useProvider();
    function getCells() {
        return columns.map((column, i) => {
            let key = row._id + ' ' + column._id;
            let isLast = i === columns.length - 1;
            return (_jsx(TableCell, { isLast: isLast, row: row, rowIndex: rowIndex, column: column }, key));
        });
    }
    let { onRemove } = rootProps;
    return (_jsxs(_Fragment, { children: [_jsxs("div", Object.assign({}, getRowAttrs(row, rowIndex), { children: [getCells(), onRemove ? _jsxs(_Fragment, { children: [_jsx(TableGap, { dir: 'v' }), _jsx("button", { className: 'aio-input-table-remove', onClick: () => remove(row, rowIndex), children: getIcon('mdiClose', 0.8) })] }) : null] }), row._id), _jsx(TableGap, { dir: 'h' })] }));
};
const TableCell = (p) => {
    let { row, rowIndex, column, isLast } = p;
    let { getCellAttrs, rootProps } = useProvider();
    let { onChange = () => { }, value = [] } = rootProps;
    //cellNewValue is used to eval please dont remove it
    function setCell(row, column, cellNewValue) {
        row = JSON.parse(JSON.stringify(row));
        eval(`${column.value} = cellNewValue`);
        onChange(value.map((o) => o._id !== row._id ? o : row));
    }
    return (_jsxs(Fragment, { children: [_jsx("div", Object.assign({}, getCellAttrs({ row, rowIndex, column, type: 'cell' }), { children: _jsx(TableCellContent, { row: row, rowIndex: rowIndex, column: column, onChange: (value) => setCell(row, column, value) }, row._id + ' ' + column._id) })), !isLast && _jsx(TableGap, { dir: 'v' })] }, row._id + ' ' + column._id));
};
const TableCellContent = (props) => {
    let { row, column, rowIndex, onChange } = props;
    let { getDynamics, rootProps } = useProvider();
    const { getValue = {} } = rootProps;
    if (column.template !== undefined) {
        const p = { row, column, rowIndex, change: (newRow) => (onChange || (() => { }))(newRow) };
        if (typeof column.template === 'string' && getValue[column.template]) {
            return getValue[column.template](p);
        }
        if (typeof column.template === 'function') {
            return column.template(p);
        }
    }
    return getDynamics({ value: column.value, row, rowIndex, column });
};
