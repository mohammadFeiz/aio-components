import { FC, ReactNode } from "react";
import { I_rangeConfig } from "aio-input";
import './index.css';
export type I_Chart = {
    datas: I_chart_data[];
    keyAxis: I_chart_key_axis;
    valueAxis: I_chart_value_axis;
    attrs?: any;
    reverse?: boolean;
    dataOption?: (data: I_chart_data, dataIndex: number) => {
        lineStyle?: I_chart_line_style;
        areaColors?: string[];
        title?: string;
        color?: string;
        pointStyle?: (point: any, pointIndex: number) => I_chart_point_style;
        pointTextStyle?: (point: any, pointIndex: number) => I_chart_point_text_style;
        pointText?: (point: any, pointIndex: number) => string;
        pointValue?: (point: any, pointIndex: number) => number;
        pointRanges?: (point: any, pointIndex: number) => [number, string][];
    };
    onPointClick?: (p: {
        data: I_chart_data;
        point: any;
        dataIndex: number;
        pointIndex: number;
    }) => void;
};
export type I_chart_data = {
    type: 'line' | 'bar';
    points: any[];
    lineStyle?: I_chart_line_style;
    areaColors?: string[];
    title?: string;
    color?: string;
    pointStyle?: (point: any, pointIndex: number) => I_chart_point_style;
    pointTextStyle?: (point: any, pointIndex: number) => I_chart_point_text_style;
    pointText?: (point: any, pointIndex: number) => string;
    pointValue?: (point: any, pointIndex: number) => number;
    pointRanges?: (point: any, pointIndex: number) => [number, string][];
};
export type I_chart_label = {
    offset: number;
    text: ReactNode;
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
    dataOption: Required<I_chart_data>;
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
    dataOption: I_chart_data;
    data: I_chart_data;
    dataIndex: number;
    point: any;
    pointIndex: number;
    pointStyle: I_chart_point_style;
    pointText: string;
    pointTextStyle: I_chart_point_text_style;
};
export type I_chart_point_text_style = {
    fontSize?: number;
    rotate?: number;
    fill?: string;
    offset?: number;
};
export type I_axis_point_detail = {
    percent: number;
    offset: number;
    label: ReactNode;
    barSize: number;
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
    thickness?: number;
    offset?: number;
    roundCap?: boolean;
    rangeStyle?: I_pieRange_style;
    attrs?: any;
    style?: any;
    className?: string;
    circles?: I_rangeConfig[];
}>;
