import React, { Component, FC, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import Code from '../../npm/code/index';
import { Chart } from '../../npm/aio-dashboard';
import { AIODate } from '../../npm/aio-utils/index.tsx';
export default function DOC_AIODashboard(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                id: 'performance',
                items: () => [
                    { text: 'line chart', id: 'linechart', render: () => <LineChart /> },
                    { text: 'bar chart', id: 'barchart', render: () => <BarChart /> },
                    { text: 'combo chart', id: 'combochart', render: () => <ComboChart /> },
                    { text: 'axis getLabel', id: 'xaxisgtlabel', render: () => <XAxisGetLabel /> },
                    { text: 'axis getLabel rtl', id: 'xaxisgtlabelrtl', render: () => <XAxisGetLabelRtl /> },
                    { text: 'axis gridLineColor', id: 'axisgridlinecolor', render: () => <AxisGridLineColor /> },
                ]
            }}
        />
    )
}

const LineChart: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString() }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    // getLineStyle:()=>{
                    //     return {dash:[3,3],lineWidth:2}
                    // },
                    getPointStyle: (point: any) => {
                        return {

                        }
                    },
                    type: 'line'
                }
            ]}
        />
    )
}
const BarChart: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString() }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    // getLineStyle:()=>{
                    //     return {dash:[3,3],lineWidth:2}
                    // },
                    getPointStyle: (point: any) => {
                        return {

                        }
                    },
                    type: 'bar'
                }
            ]}
        />
    )
}
const ComboChart: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString() }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    // getLineStyle:()=>{
                    //     return {dash:[3,3],lineWidth:2}
                    // },
                    getPointStyle: (point: any) => {
                        return {

                        }
                    },
                    type: 'bar'
                },
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    // getLineStyle:()=>{
                    //     return {dash:[3,3],lineWidth:2}
                    // },
                    getPointStyle: (point: any) => {
                        return {

                        }
                    },
                    type: 'line'
                }
            ]}
        />
    )
}

const XAxisGetLabel: FC = () => {
    const DATE = new AIODate();
    const monthes = DATE.getMonths()
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => monthes[v],rotate:45 }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString() }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    // getLineStyle:()=>{
                    //     return {dash:[3,3],lineWidth:2}
                    // },
                    getPointStyle: (point: any) => {
                        return {

                        }
                    },
                    type: 'line'
                }
            ]}
        />
    )
}
const XAxisGetLabelRtl: FC = () => {
    const DATE = new AIODate();
    const monthes = DATE.getMonths(true)
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => monthes[v],rotate:-45 }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString() }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    // getLineStyle:()=>{
                    //     return {dash:[3,3],lineWidth:2}
                    // },
                    getPointStyle: (point: any) => {
                        return {

                        }
                    },
                    type: 'line'
                }
            ]}
        />
    )
}

const AxisGridLineColor: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString(),gridLineColor:'#ddd' }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    // getLineStyle:()=>{
                    //     return {dash:[3,3],lineWidth:2}
                    // },
                    getPointStyle: (point: any) => {
                        return {

                        }
                    },
                    type: 'line'
                }
            ]}
        />
    )
}
