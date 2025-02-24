import { FC, ReactNode } from "react";
import './index.css';
export type I_chart_range = [number, string];
export type I_chart_label = {
    offset: number;
    text: ReactNode;
};
export type I_chart_size = {
    x: number;
    y: number;
};
export type I_chart_axis = {
    size: number;
    padding?: number[];
    getLabel: (v: number) => string;
    rotate?: number;
    gridLineColor?: string;
    zoom?: boolean;
};
export type I_chart_key_axis = I_chart_axis & {
    count: number;
};
export type I_chart_value_axis = I_chart_axis & {
    start: number;
    end: number;
};
export type I_chart_label_detail = {
    text: ReactNode;
    offset: number;
};
export type I_chart_point_style = {
    lineWidth?: number;
    r?: number;
    dash?: number[];
    stroke?: string;
    fill?: string;
};
export type I_chart_line_style = {
    lineWidth?: number;
    dash?: number[];
    stroke?: string;
};
export type I_chart_data_detail = {
    dataOption: Required<I_chart_data_option>;
    type: 'line' | 'bar';
    points: I_chart_point_detail[];
    barCount: number;
    barIndex: number;
    areaPoints: number[][];
    areaColors: string[];
};
export type I_rangeDetail = {
    offset: number;
    height: number;
    color: string;
    value: number;
};
export type I_chart_point_detail = {
    keyOffset: number;
    valueOffset: number;
    keyPercent: number;
    valuePercent: number;
    keyLabel: ReactNode;
    valueLabel: ReactNode;
    keyBarSize: number;
    valueBarSize: number;
    rangeDetails: I_rangeDetail[];
    dataOption: I_chart_data_option;
    pointOption: I_chart_point_option;
    data: I_chart_data;
    dataIndex: number;
    point: any;
    pointIndex: number;
};
export type I_chart_point_text_style = {
    fontSize?: number;
    rotate?: number;
    fill?: string;
    offset?: number;
};
export type I_chart_data_option = {
    style?: I_chart_line_style;
    areaColors?: string[];
    title?: string;
    color?: string;
};
export type I_chart_point_option = {
    value: number;
    ranges?: I_chart_range[];
    style?: I_chart_point_style;
    text?: string;
    textStyle?: I_chart_point_text_style;
};
export type I_chart_data = {
    type: 'line' | 'bar';
    points: any[];
    title?: string;
    color?: string;
};
export type I_axis_point_detail = {
    percent: number;
    offset: number;
    label: ReactNode;
    barSize: number;
};
export type I_Chart = {
    datas: I_chart_data[];
    keyAxis: I_chart_key_axis;
    valueAxis: I_chart_value_axis;
    attrs?: any;
    reverse?: boolean;
    dataOption?: (p: {
        data: I_chart_data;
        dataIndex: number;
    }) => {
        style?: I_chart_line_style;
        areaColors?: string[];
        title?: string;
        color?: string;
    };
    pointOption: (p: {
        data: I_chart_data;
        dataIndex: number;
        point: any;
        pointIndex: number;
    }) => (Omit<I_chart_point_option, 'point'> | undefined);
    onPointClick?: (p: {
        data: I_chart_data;
        point: any;
        dataIndex: number;
        pointIndex: number;
    }) => void;
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
export declare const Pie: FC<{
    start: number;
    size?: number;
    end: number;
    ranges: I_pieRange[];
    empty?: Omit<I_pieRange, 'value'>;
    thickness?: number;
    offset?: number;
    roundCap?: boolean;
    rangeStyle?: I_pieRange_style;
}>;
