import React, { FC, ReactNode } from "react";
import "@pqina/flip/dist/flip.min.css";
import './index.css';
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
        options: AI_bottomMenuOption[];
        onChange: (v: string) => void;
    };
    sidenav?: {
        items: AI_sidenavItem[];
        indent?: number;
        header?: (minimize: boolean) => ReactNode;
        value?: string;
        render?: () => ReactNode;
        cache?: boolean;
        attrs?: any;
    };
    body: (sidenavitem?: AI_sidenavItem) => ReactNode;
    header?: (sidenavitem?: AI_sidenavItem) => ReactNode | false;
    children?: ReactNode;
};
type AI_bottomMenuOption = {
    text?: ReactNode;
    uptext?: ReactNode;
    subtext?: ReactNode;
    value: string;
    before?: ReactNode;
    after?: ReactNode;
    show?: boolean;
    active?: boolean;
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
export {};
