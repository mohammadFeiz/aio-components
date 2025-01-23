import { FC, ReactNode } from "react";
import './index.css';
type AI_Indent = {
    level: number;
    width: number;
    height: number;
    rtl: boolean;
    isLastChild: boolean;
    isParentLastChild: boolean;
    row: any;
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
    onClick: () => void;
    before?: ReactNode;
    after?: ReactNode;
};
export declare const AICard: FC<I_AICard>;
type I_AIApp = {
    attrs?: any;
    bottomMenu: {
        options: AI_bottomMenuOption[];
        onChange: (v: string) => void;
    };
    body: () => ReactNode;
    header?: () => ReactNode | false;
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
export type I_MonthCells = {
    year: number;
    month: number;
    cellContent: (date: number[], weekDayIndex: number) => ReactNode;
    weekDayContent?: (v: number) => ReactNode;
    changeMonth: (month: number) => void;
};
export declare const MonthCells: FC<I_MonthCells>;
export declare function Code(code: string, language?: 'js' | 'css', style?: any): JSX.Element;
export {};
