import React, { Component, FC, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import Code from '../../npm/code/index';
import { Chart } from '../../npm/aio-dashboard';
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
                ]
            }}
        />
    )
}

const LineChart: FC = () => {
    return (
        <Chart
            xAxis={{start:0,end:9,size:36}}
            yAxis={{start:0,end:100,size:60}}
            keys={{start:0,step:1,end:9}}
            getKeyLabel={(x)=>x.toString()}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }],
                    xAxis: { getValue: (point: any) => point.a, getLabel: (x: number) => x },
                    yAxis: { getValue: (point: any) => point.b, getLabel: (y: number) => y },
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
            xAxis={{start:0,end:9,size:36}}
            yAxis={{start:0,end:100,size:60}}
            keys={{start:0,step:1,end:9}}
            getKeyLabel={(x)=>x.toString()}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }],
                    xAxis: { getValue: (point: any) => point.a, getLabel: (x: number) => x },
                    yAxis: { getValue: (point: any) => point.b, getLabel: (y: number) => y },
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
            xAxis={{start:0,end:9,size:36}}
            yAxis={{start:0,end:100,size:60}}
            keys={{start:0,step:1,end:9}}
            getKeyLabel={(x)=>x.toString()}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }],
                    xAxis: { getValue: (point: any) => point.a, getLabel: (x: number) => x },
                    yAxis: { getValue: (point: any) => point.b, getLabel: (y: number) => y},
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
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }],
                    xAxis: { getValue: (point: any) => point.a, getLabel: (x: number) => x },
                    yAxis: { getValue: (point: any) => point.b, getLabel: (y: number) => y },
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

