import { ReactNode } from "react";
import "./index.css";
import { I_filter, I_filter_item, I_filter_saved_item, I_paging, I_sort } from "aio-component-utils";
type I_rowOption<T, R> = (p: I_rowDetail<T>) => R;
type I_cellOption<T, R> = ((p: I_cellDetail<T>) => R) | string;
type I_rowDetail<T> = {
    row: T;
    rowIndex: number;
    isFirst: boolean;
    isLast: boolean;
};
type I_cellDetail<T> = I_rowDetail<T> & {
    column: I_table_column<T>;
    change: (newRow: T) => void;
    isDate: boolean;
};
export type I_table_paging = I_paging;
export type I_table_sort<T> = I_sort<T>;
export type I_table_filter = I_filter;
export type I_table_filter_item = I_filter_item;
export type I_table_filter_saved_item = I_filter_saved_item;
export type I_table_column<T> = {
    title?: any;
    sort?: true | I_table_sort<T>;
    filterId?: string;
    search?: boolean;
    id?: string;
    _id?: string;
    width?: any;
    minWidth?: any;
    excel?: string | boolean;
    justify?: boolean;
    value?: string;
    attrs?: I_cellOption<T, {
        [attrs: string]: any;
    }>;
    before?: I_cellOption<T, ReactNode>;
    after?: I_cellOption<T, ReactNode>;
    subtext?: I_cellOption<T, ReactNode>;
    template?: I_cellOption<T, ReactNode>;
    titleAttrs?: {
        [attrs: string]: any;
    };
    type?: 'text' | 'number' | 'month' | 'day' | 'hour' | 'minute';
};
export type I_table<T> = {
    fa?: boolean;
    addText?: ReactNode | ((value: any) => ReactNode);
    columns?: I_table_column<T>[];
    excel?: string | ((value: any[]) => any[]);
    getValue?: {
        [key: string]: (p: {
            row: T;
            column: I_table_column<T>;
            rowIndex: number;
            change: (newRow: T) => void;
        }) => any;
    };
    headerAttrs?: any;
    onAdd?: () => Promise<T | undefined>;
    onRemove?: (p: {
        row: T;
        rowIndex?: number;
    }) => Promise<boolean>;
    onChangePaging?: (newPaging: I_table_paging) => void;
    onChangeSort?: (sorts: I_table_sort<T>[]) => Promise<boolean>;
    onSwap?: true | ((newValue: T[], startRow: T, endRow: T) => void);
    onSearch?: true | ((searchValue: string) => void);
    paging?: I_table_paging;
    removeText?: string;
    rowOption?: {
        before?: I_rowOption<T, ReactNode>;
        after?: I_rowOption<T, ReactNode>;
        attrs?: I_rowOption<T, {
            [attrs: string]: any;
        }>;
        template?: I_rowOption<T, ReactNode>;
    };
    cellAttrs?: string | ((p: {
        row: T;
        column: I_table_column<T>;
        rowIndex: number;
    }) => any);
    rowsTemplate?: (rows: T[]) => ReactNode;
    toolbar?: ReactNode | (() => ReactNode);
    toolbarAttrs?: any;
    tabIndex?: number;
    value: T[];
    onChange?: (v: T[]) => void;
    className?: string;
    style?: any;
    attrs?: any;
    placeholder?: ReactNode;
    filter?: I_table_filter;
    gap?: [number, number];
    striped?: [string, string];
};
declare const AIOTable: <T>(props: I_table<T>) => JSX.Element;
export default AIOTable;
