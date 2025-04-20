import React, { FC, ReactNode } from "react";
import "@pqina/flip/dist/flip.min.css";
import './repo/index.css';
type AI_Indent = {
    level: number;
    width: number;
    height: number;
    rtl: boolean;
    isLastChild: boolean;
    isParentLastChild: boolean;
    row: any;
    isLeaf: boolean;
    open?: boolean;
    onToggle?: () => void;
    toggleIcon?: false | ((p: {
        row: any;
        open?: boolean;
        level: number;
    }) => ReactNode);
};
export declare const Indent: FC<AI_Indent>;
export declare class GetSvg {
    getStyle: (color?: string) => {
        fill: string;
        stroke: string;
    };
    getSvgStyle: (size?: number) => {
        width: string;
        height: string;
    };
    fixSvgContent: (content: ReactNode, size?: number, p?: {
        spin?: number;
        color?: string;
    }) => JSX.Element;
    getIcon: (path: string, size?: number, p?: {
        spin?: number;
        color?: string;
    }) => JSX.Element;
    mdiMenu: (color?: string) => JSX.Element;
    mdiClose: (color?: string) => JSX.Element;
    mdiLoading: (color?: string) => JSX.Element;
    mdiAttachment: (color?: string) => JSX.Element;
    mdiCircleMedium: (color?: string) => JSX.Element;
    mdiMagnify: (color?: string) => JSX.Element;
    mdiPlusThick: (color?: string) => JSX.Element;
    mdiImage: (color?: string) => JSX.Element;
    mdiEye: (color?: string) => JSX.Element;
    mdiEyeOff: (color?: string) => JSX.Element;
    mdiDotsHorizontal: (color?: string) => JSX.Element;
    mdiChevronDown: (color?: string) => JSX.Element;
    mdiChevronRight: (color?: string) => JSX.Element;
    mdiCircleSmall: (color?: string) => JSX.Element;
    mdiChevronLeft: (color?: string) => JSX.Element;
    mdiArrowDown: (color?: string) => JSX.Element;
    mdiArrowUp: (color?: string) => JSX.Element;
    mdiFileExcel: (color?: string) => JSX.Element;
    mdiSort: (color?: string) => JSX.Element;
    mdiDelete: (color?: string) => JSX.Element;
    mdiMicrophoneOutline: (color?: string) => JSX.Element;
}
type I_AIPanel = {
    text: string;
    subtext?: ReactNode;
    before?: ReactNode;
    after?: ReactNode;
    body: ReactNode;
};
export declare const AIPanel: FC<I_AIPanel>;
type I_AICard = {
    text: ReactNode;
    subtext?: ReactNode;
    onClick?: () => void;
    before?: ReactNode;
    after?: ReactNode;
    attrs?: any;
    className?: string;
    style?: any;
};
export declare const AICard: FC<I_AICard>;
type I_AIApp = {
    appName?: string;
    appId: string;
    attrs?: any;
    rtl?: boolean;
    bottomMenu?: {
        options: any[];
        option: {
            value?: (option: any) => string;
            text?: (option: any) => ReactNode;
            uptext?: (option: any) => ReactNode;
            subtext?: (option: any) => ReactNode;
            before?: (option: any) => ReactNode;
            after?: (option: any) => ReactNode;
            show?: (option: any) => boolean;
            active?: (option: any) => boolean;
            onClick?: (option: any) => void;
            attrs?: (option: any) => any;
            className?: (option: any) => string | undefined;
            style?: (option: any) => any;
        };
    };
    sidenav?: {
        items: AI_sidenavItem[];
        header?: (minimize: boolean) => ReactNode;
        value?: string;
        cache?: boolean;
        attrs?: any;
    };
    body?: ReactNode;
    header?: (sidenavitem?: AI_sidenavItem) => ReactNode | false;
    children?: ReactNode;
};
export declare const AIApp: FC<I_AIApp>;
export type AI_Sidenav = {
    items: AI_sidenavItem[];
    onChange: (item: AI_sidenavItem) => void;
    className?: string;
    style?: any;
    attrs?: any;
    rtl?: boolean;
    indent?: number;
    header?: (minimize: boolean) => ReactNode;
    value?: string;
    minimize?: boolean;
};
export type AI_sidenavItem = {
    text: ReactNode;
    subtext?: ReactNode;
    value: string;
    icon?: ReactNode;
    items?: AI_sidenavItem[];
    onClick?: () => void;
    after?: ReactNode;
    show?: boolean;
    render?: () => ReactNode;
};
export declare const Sidenav: FC<AI_Sidenav>;
export type I_MonthCells = {
    year: number;
    month: number;
    cellContent: (date: number[], weekDayIndex: number) => ReactNode;
    weekDayContent?: (v: number) => ReactNode;
    changeMonth: (month: number) => void;
};
export declare const MonthCells: FC<I_MonthCells>;
export declare function Code(code: string, language?: 'js' | 'css', style?: any): JSX.Element;
export type I_node = {
    v?: I_node[];
    h?: I_node[];
    html?: ReactNode;
    content?: any;
    attrs?: any;
    className?: string;
    style?: any;
    show?: boolean;
    flex?: number;
    size?: number;
    scroll?: boolean;
    tag?: 'fieldset' | 'section' | 'div' | 'p' | 'form';
    legend?: ReactNode;
    id?: string;
    isStatic?: boolean;
    align?: 'v' | 'h' | 'vh' | 'hv';
    hide_xs?: boolean;
    hide_sm?: boolean;
    hide_md?: boolean;
    hide_lg?: boolean;
    show_xs?: boolean;
    show_sm?: boolean;
    show_md?: boolean;
    show_lg?: boolean;
};
export declare const NodeAttrs: (p: {
    node: I_node;
    parentNode?: I_node;
    isRoot?: boolean;
}) => any;
export declare const Node: FC<{
    node: I_node;
    parentNode?: I_node;
    level: number;
    index: number;
    updateNode?: (p: {
        node: I_node;
        level: number;
        parentNode?: I_node;
    }) => I_node;
}>;
type I_Flip = {
    value: string | number;
    double?: boolean;
    fontSize?: number;
};
export declare class Flip extends React.Component<I_Flip> {
    ref: React.RefObject<any>;
    inst: any;
    constructor(props: I_Flip);
    getValue(): any;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
type I_filter_operator = 'less' | 'more' | 'equal' | 'notEqual' | 'contain' | 'notContain';
export type I_filter_saved_item = {
    name: string;
    items: I_filter_item[];
};
export type I_filter = {
    items: I_filter_item[];
    onChange: (newFilters: I_filter_item[]) => undefined | void | I_filter_item[] | true | false;
    savedItems?: {
        name: string;
        items: I_filter_item[];
    }[];
    changeSavedItems?: (newSavedItems: {
        name: string;
        items: I_filter_item[];
    }[]) => void;
    activeSavedItem?: (v: {
        name: string;
        items: I_filter_item[];
    }) => void;
};
export type I_filter_item = {
    columnId: string;
    operator: I_filter_operator;
    value: any;
    type: 'text' | 'number' | 'month' | 'day' | 'hour' | 'minute';
};
type I_filterType = 'text' | 'number' | 'month' | 'day' | 'hour' | 'minute';
type I_Filterbar<T> = {
    fa?: boolean;
    columns: T[];
    columnOption: {
        text: (column: T) => string;
        id: (column: T) => string;
        type: (column: T) => I_filterType;
    };
    filter: I_filter;
};
export declare const Filterbar: <T>(props: I_Filterbar<T>) => JSX.Element;
export type I_paging = {
    serverSide?: boolean;
    number: number;
    size: number;
    length?: number;
    sizes?: number[];
};
export type I_pagingHook<T> = {
    render: () => ReactNode;
    getPagedRows: (rows: T[]) => T[];
    changePaging: (obj: Partial<I_paging>) => void;
};
export declare const usePaging: <T>(p: {
    rows: T[];
    paging?: I_paging;
    onChange?: (newPaging: I_paging) => void;
}) => I_pagingHook<T>;
export type I_sort<T> = {
    active?: boolean;
    dir?: 'dec' | 'inc';
    title?: ReactNode;
    sortId: string;
    getValue?: (row: T) => any;
};
export type I_sortHook<T> = {
    sorts: I_sort<T>[];
    setSorts: (v: I_sort<T>[]) => void;
    renderSortButton: () => ReactNode;
    getSortedRows: (rows: T[]) => T[];
    changeSort: (sortId: string, changeObject: Partial<I_sort<T>>) => void;
    changeSorts: (sorts: I_sort<T>[]) => Promise<void>;
};
export declare const useSort: <T>(p: {
    sorts: I_sort<any>[];
    rows: any[];
    onChangeRows?: (rows: any) => void;
    onChangeSort?: (sorts: I_sort<T>[]) => Promise<boolean | undefined>;
}) => I_sortHook<T>;
export declare function DragList<T>({ data, onChange, renderItem, listAttrs }: {
    data: T[];
    listAttrs?: any;
    onChange: (newList: T[]) => void;
    renderItem: (item: T, index: number) => {
        inner: React.ReactNode;
        attrs: any;
    };
}): JSX.Element;
export declare const Signature: React.FC<{
    attrs?: React.HTMLAttributes<HTMLCanvasElement>;
    onSave?: (file: any) => void;
}>;
export {};
