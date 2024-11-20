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
                    { text: 'multi bar chart', id: 'multibarchart', render: () => <MultiBarChart /> },
                    { text: 'combo chart', id: 'combochart', render: () => <ComboChart /> },
                    { text: 'axis getLabel', id: 'axisgtlabel', render: () => <AxisGetLabel /> },
                    { text: 'axis rotate', id: 'axisrotate', render: () => <AxisRotate /> },
                    { text: 'axis rotate rtl', id: 'axisrotatertl', render: () => <AxisRotateRTL /> },
                    { text: 'axis gridLineColor', id: 'axisgridlinecolor', render: () => <AxisGridLineColor /> },
                    { text: 'axis zoom', id: 'axiszoom', render: () => <AxisZoom /> },
                    { text: 'point style', id: 'pointstyle', render: () => <PointStyle /> },
                    { text: 'line style', id: 'linestyle', render: () => <LineStyle /> },
                    { text: 'point text', id: 'pointtext', render: () => <PointText /> },
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
const MultiBarChart: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => v.toString(),zoom:true }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString() }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getPointStyle: (point: any) => {
                        return {
                            fill:'red'
                        }
                    },
                    type: 'bar'
                },
                {
                    points: [{ a: 0, b: 12 }, { a: 1, b: 67 }, { a: 2, b: 78 }, { a: 3, b: 32 }, { a: 4, b: 12 }, { a: 5, b: 0 }, { a: 6, b: 90 }, { a: 7, b: 41 }, { a: 8, b: 45 }, { a: 9, b: 45 }, { a: 10, b: 22 }, { a: 11, b: 78 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getPointStyle: (point: any) => {
                        return {
                            fill:'blue'
                        }
                    },
                    type: 'bar'
                },
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 41 }, { a: 2, b: 12 }, { a: 3, b: 55 }, { a: 4, b: 70 }, { a: 5, b: 21 }, { a: 6, b: 45 }, { a: 7, b: 70 }, { a: 8, b: 21 }, { a: 9, b: 88 }, { a: 10, b: 44 }, { a: 11, b: 12 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getPointStyle: (point: any) => {
                        return {
                            fill:'orange'
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

const AxisGetLabel: FC = () => {
    const DATE = new AIODate();
    const monthes = DATE.getMonths()
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => monthes[v] }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString() }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
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
const AxisRotate: FC = () => {
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
const AxisRotateRTL: FC = () => {
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

const AxisZoom: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => v.toString(),zoom:true }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString(),gridLineColor:'#ddd' }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
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
const PointStyle: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString(),gridLineColor:'#ddd' }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getPointStyle:(point)=>{
                        return {
                            r:12,lineWidth:6,dash:[6,3],fill:'orange',stroke:'#0069ff'
                        }
                    },
                    type: 'line'
                }
            ]}
        />
    )
}
const LineStyle: FC = () => {
    const DATE = new AIODate();
    const monthes = DATE.getMonths(true)
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString(),gridLineColor:'#ddd' }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getLineStyle:()=>{
                        return {
                            lineWidth:3,dash:[6,3],stroke:'orange'    
                        }
                    },
                    type: 'line'
                }
            ]}
        />
    )
}

const PointText: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, step: 1, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, step: 1, end: 100, size: 60, getLabel: (v) => v.toString(),gridLineColor:'#ddd' }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getPointText:(point:any)=>{
                        return {
                            text:point.y.value.toString(),
                            style:{offset:12,fill:'#0069ff',fontSize:20,rotate:0}
                        }
                    },
                    type: 'line'
                }
            ]}
        />
    )
}
