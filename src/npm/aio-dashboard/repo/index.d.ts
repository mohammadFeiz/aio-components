import { FC, ReactNode } from "react";
import './index.css';
type I_chart_range = [number, string][];
type I_chart_axis = {
    start: number;
    end: number;
    size: number;
    padding?: number[];
    getLabel: (v: number) => string;
    rotate?: number;
    gridLineColor?: string;
    zoom?: boolean;
};
type I_getPointStyle = (point: any) => I_chart_point_style;
type I_getLineStyle = () => I_chart_line_style;
type I_chart_point_style = {
    lineWidth?: number;
    r?: number;
    dash?: number[];
    stroke?: string;
    fill?: string;
};
type I_chart_line_style = {
    lineWidth?: number;
    dash?: number[];
    stroke?: string;
};
type I_rangeDetail = {
    offset: number;
    height: number;
    color: string;
};
type I_chart_point_detail = {
    key: number;
    value: number;
    keyOffset: number;
    valueOffset: number;
    keyPercent: number;
    valuePercent: number;
    keyText: ReactNode;
    valueText: ReactNode;
    keyBarSize: number;
    valueBarSize: number;
    pointStyle?: I_chart_point_style;
    rangeDetails: I_rangeDetail[];
};
type I_getPointText = (point: I_chart_point_detail) => {
    text: string;
    style?: {
        fontSize?: number;
        rotate?: number;
        fill?: string;
        offset?: number;
    };
} | undefined;
type I_chart_data = {
    color?: string;
    title?: string;
    points: any[];
    getKey: (point: any) => number;
    getValue: (point: any) => number;
    getRanges?: (point: any) => I_chart_range | undefined;
    getPointStyle?: I_getPointStyle;
    getLineStyle?: I_getLineStyle;
    getPointText?: I_getPointText;
    type: 'line' | 'bar';
    areaColors?: [string, string];
};
export type I_Chart = {
    datas: I_chart_data[];
    keyAxis: I_chart_axis;
    valueAxis: I_chart_axis;
    attrs?: any;
    reverse?: boolean;
};
declare const Chart: FC<I_Chart>;
export { Chart };
type I_pieRange_style = {
    thickness?: number;
    offset?: number;
    roundCap?: boolean;
    color: string;
};
type I_pieRange = {
    value: number;
    thickness?: number;
    offset?: number;
    roundCap?: boolean;
    color: string;
};
type I_Pie = {
    start: number;
    size?: number;
    end: number;
    ranges: I_pieRange[];
    empty?: Omit<I_pieRange, 'value'>;
    thickness?: number;
    offset?: number;
    roundCap?: boolean;
    rangeStyle?: I_pieRange_style;
};
export declare const Pie: FC<I_Pie>;
