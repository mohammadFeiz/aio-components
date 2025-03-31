import { ReactNode } from "react";
import * as UT from 'aio-utils';
import "./index.css";
type I_rows<T> = {
    rows: T[];
    searchedRows: T[];
    sortedRows: T[];
    pagedRows: T[];
};
export type AI_table_param<T> = {
    row: T;
    column: I_column<T>;
    rowIndex: number;
};
export type I_column<T> = {
    title?: any;
    value?: any;
    sort?: true | I_sort<T>;
    search?: boolean;
    id?: string;
    _id?: string;
    width?: any;
    minWidth?: any;
    titleAttrs?: {
        [key: string]: any;
    } | string;
    template?: string | ((p: {
        row: T;
        column: I_column<T>;
        rowIndex: number;
        change: (newRow: T) => void;
    }) => ReactNode);
    excel?: string | boolean;
    justify?: boolean;
    cellAttrs?: {
        [key: string]: any;
    } | ((p: {
        row: T;
        rowIndex: number;
        column: I_column<T>;
    }) => any) | string;
};
export type I_sort<T> = {
    active?: boolean;
    dir?: 'dec' | 'inc';
    title?: ReactNode;
    type?: 'string' | 'number';
    sortId?: string;
    getValue?: (row: T) => any;
};
export type I_context<T> = {
    rootProps: I_AIOTable<T>;
    columns: I_column<T>[];
    ROWS: I_rows<T>;
    add: () => void;
    remove: (row: T, index: number) => void;
    search: (searchValue: string) => void;
    exportToExcel: () => void;
    sorts: I_sort<T>[];
    setSorts: (newSorts: I_sort<T>[]) => void;
    sortRows: (rows: T[], sorts: I_sort<T>[]) => T[];
    excelColumns: I_column<T>[];
    getRowAttrs: (row: T, rowIndex: number) => any;
    getCellAttrs: I_getCellAttrs<T>;
    getDynamics: any;
    DragColumns: UT.I_useDrag;
    getIcon: UT.GetSvg["getIcon"];
};
export type I_getCellAttrs<T> = (p: {
    row: T;
    rowIndex: number;
    column: I_column<T>;
    type: 'title' | 'cell';
}) => any;
export type AI_table_paging = {
    serverSide?: boolean;
    number: number;
    size: number;
    length?: number;
    sizes?: number[];
};
export type I_AIOTable<T> = {
    addText?: ReactNode | ((value: any) => ReactNode);
    columnGap?: number;
    columns?: I_column<T>[];
    excel?: string | ((value: any[]) => any[]);
    getValue?: {
        [key: string]: (p: {
            row: T;
            column: I_column<T>;
            rowIndex: number;
            change: (newRow: T) => void;
        }) => any;
    };
    headerAttrs?: any;
    onAdd?: () => Promise<T | undefined>;
    onChangePaging?: (newPaging: AI_table_paging) => void;
    onChangeSort?: (sorts: I_sort<T>[]) => Promise<boolean>;
    onSwap?: true | ((newValue: T[], startRow: T, endRow: T) => void);
    onSearch?: true | ((searchValue: string) => void);
    paging?: AI_table_paging;
    removeText?: string;
    rowAfter?: (p: {
        row: T;
        rowIndex: number;
    }) => ReactNode;
    rowAttrs?: (p: {
        row: T;
        rowIndex: number;
    }) => any;
    rowBefore?: (p: {
        row: T;
        rowIndex: number;
    }) => ReactNode;
    rowGap?: number;
    rowsTemplate?: (rows: T[]) => ReactNode;
    rowTemplate?: (p: {
        row: T;
        rowIndex: number;
        isLast: boolean;
    }) => ReactNode;
    toolbar?: ReactNode | (() => ReactNode);
    toolbarAttrs?: any;
    tabIndex?: number;
    value: T[];
    onChange?: (v: T[]) => void;
    className?: string;
    style?: any;
    attrs?: any;
    onRemove?: true | ((p: {
        row: T;
        action?: Function;
        rowIndex?: number;
        parent?: T;
    }) => Promise<boolean | void>);
    placeholder?: ReactNode;
};
declare const AIOTable: <T>(rootProps: I_AIOTable<T>) => JSX.Element;
export default AIOTable;
