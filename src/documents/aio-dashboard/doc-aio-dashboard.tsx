import React, { Component, FC, useState } from 'react';
import DOC from '../../resuse-components/Doc/index';
import { Code } from './../../npm/aio-component-utils';
import { Chart, Pie } from '../../npm/aio-dashboard';
import AIODate from './../../npm/aio-date';
import { GetRandomNumber } from '../../npm/aio-utils/index.tsx';
import './index.css';
import { AIFormInput, AISlider } from '../../npm/aio-input/index.tsx';
export default function DOC_AIODashboard(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            items={[
                { text: 'line chart', value: 'linechart', render: () => <LineChart /> },
                { text: 'bar chart', value: 'barchart', render: () => <BarChart /> },
                { text: 'reverse', value: 'reverse', render: () => <Reverse /> },
                { text: 'multi bar chart', value: 'multibarchart', render: () => <MultiBarChart /> },
                { text: 'combo chart', value: 'combochart', render: () => <ComboChart /> },
                { text: 'areaColors', value: 'areaColors', render: () => <AreaColors /> },
                { text: 'ranges', value: 'bar chart range', render: () => <GetRanges /> },
                { text: 'padding', value: 'axispadding', render: () => <AxisPadding /> },
                { text: 'getLabel', value: 'axisgtlabel', render: () => <AxisGetLabel /> },
                { text: 'rotate', value: 'axisrotate', render: () => <AxisRotate /> },
                { text: 'rotate rtl', value: 'axisrotatertl', render: () => <AxisRotateRTL /> },
                { text: 'gridLineColor', value: 'axisgridlinecolor', render: () => <AxisGridLineColor /> },
                { text: 'zoom', value: 'axiszoom', render: () => <AxisZoom /> },
                { text: 'point style', value: 'pointstyle', render: () => <PointStyle /> },
                { text: 'line style', value: 'linestyle', render: () => <LineStyle /> },
                { text: 'point text', value: 'pointtext', render: () => <PointText /> },
                { text: 'onPointClick', value: 'onPointClick', render: () => <OnPointClick /> },
                { text: 'sample 1', value: 'sample1', render: () => <Sample1 /> },
                { text: 'Basic Pie Chart', value: 'basicpie', render: () => <BasicPie /> },
                { text: 'Pie Empty', value: 'pieempty', render: () => <PieEmpty /> },
                { text: 'Pie Size', value: 'piesize', render: () => <PieSize /> },
                { text: 'Pie Thickness', value: 'piethickness', render: () => <PieThickness /> },
                { text: 'Pie Range Thickness', value: 'pieRangethickness', render: () => <PieRangeThickness /> },
                { text: 'Pie circles', value: 'pieCircles', render: () => <PieCircles /> },
                { text: 'Pie Generator', value: 'piegenerator', render: () => <PieGenerator /> },
            ]}
        />
    )
}

const LineChart: FC = () => {
    return (
        <Chart
            keyAxis={{ count:12, size: 36, getLabel: (v) => v.toString() }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            dataOption={()=>{
                return {
                    title:'data',
                    color:'lightblue',
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'line'
                }
            ]}
        />
    )
}
const BarChart: FC = () => {
    return (
        <Chart
            keyAxis={{ count: 12, size: 36, getLabel: (v) => v.toString() }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            dataOption={()=>{
                return {
                    title:'data',
                    color:'lightblue',
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'bar'
                }
            ]}
        />
    )
}
const Reverse: FC = () => {
    return (
        <Chart
            reverse={true}
            keyAxis={{ count: 12, size: 36, getLabel: (v) => v.toString() }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            dataOption={()=>{
                return {
                    title:'data',
                    color:'lightblue',
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'bar'
                }
            ]}
        />
    )
}
const MultiBarChart: FC = () => {
    return (
        <Chart
            keyAxis={{ count: 12, size: 36, getLabel: (v) => v.toString() }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            dataOption={()=>{
                return {
                    title:'data',
                    color:'lightblue',
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'bar'
                },
                {
                    points: [{ a: 0, b: 12 }, { a: 1, b: 67 }, { a: 2, b: 78 }, { a: 3, b: 32 }, { a: 4, b: 12 }, { a: 5, b: 0 }, { a: 6, b: 90 }, { a: 7, b: 41 }, { a: 8, b: 45 }, { a: 9, b: 45 }, { a: 10, b: 22 }, { a: 11, b: 78 }],
                    type: 'bar'
                },
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 41 }, { a: 2, b: 12 }, { a: 3, b: 55 }, { a: 4, b: 70 }, { a: 5, b: 21 }, { a: 6, b: 45 }, { a: 7, b: 70 }, { a: 8, b: 21 }, { a: 9, b: 88 }, { a: 10, b: 44 }, { a: 11, b: 12 }],
                    type: 'bar'
                }
            ]}
        />
    )
}
const GetRanges: FC = () => {
    return (
        <Chart
            keyAxis={{ count: 12, size: 36, getLabel: (v) => v.toString() }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            dataOption={()=>{
                return {
                    title:'data',
                    color:'lightblue',
                    pointValue:(point)=>point.b,
                    pointRanges:(point)=>point.ranges
                }
            }}
            datas={[
                {
                    points: [
                        { a: 0, b: 24, ranges: [[8, 'red'], [14, 'orange'], [24, 'yellow']] },
                        { a: 1, b: 27, ranges: [[4, 'red'], [18, 'orange'], [27, 'yellow']] },
                        { a: 2, b: 78, ranges: [[28, 'red'], [50, 'orange'], [78, 'yellow']] },
                        { a: 3, b: 24, ranges: [[5, 'red'], [10, 'orange'], [24, 'yellow']] },
                        { a: 4, b: 0, ranges: [] },
                        { a: 5, b: 90, ranges: [[80, 'red'], [85, 'orange'], [90, 'yellow']] },
                        { a: 6, b: 87, ranges: [[34, 'red'], [60, 'orange'], [87, 'yellow']] },
                        { a: 7, b: 34, ranges: [[6, 'red'], [24, 'orange'], [34, 'yellow']] },
                        { a: 8, b: 42, ranges: [[20, 'red'], [30, 'orange'], [42, 'yellow']] },
                        { a: 9, b: 70, ranges: [[45, 'red'], [55, 'orange'], [70, 'yellow']] },
                        { a: 10, b: 55, ranges: [[15, 'red'], [30, 'orange'], [55, 'yellow']] },
                        { a: 11, b: 13, ranges: [[8, 'red'], [10, 'orange'], [13, 'yellow']] }
                    ],
                    type: 'bar'
                }
            ]}
        />
    )
}
const ComboChart: FC = () => {
    return (
        <Chart
            keyAxis={{ count: 12, size: 36, getLabel: (v) => v.toString() }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            dataOption={()=>{
                return {
                    pointValue:(point)=>point.b,
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'bar',
                    title:'data1'
                },
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'line',
                    title:'data2'
                }
            ]}
        />
    )
}
const AreaColors: FC = () => {
    return (
        <Chart
            keyAxis={{ count: 12, size: 36, getLabel: (v) => v.toString() }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            dataOption={()=>{
                return {
                    areaColors: ['transparent', '#ffa500'],
                    style:{stroke:'#ffa500'},
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type:'line'
                }
            ]}
        />
    )
}
const AxisPadding: FC = () => {
    return (
        <Chart
            keyAxis={{ count: 12, size: 36, getLabel: (v) => v.toString(), padding: [24, 48] }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), padding: [12, 24] }}
            dataOption={()=>{
                return {
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
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
            keyAxis={{ count: 12, size: 36, getLabel: (v) => monthes[v] }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            dataOption={()=>{
                return {
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
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
            keyAxis={{ count: 12, size: 36, getLabel: (v) => monthes[v], rotate: 45 }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            dataOption={()=>{
                return {
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
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
            keyAxis={{ count: 12, size: 36, getLabel: (v) => monthes[v], rotate: -45 }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            dataOption={()=>{
                return {
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'line'
                }
            ]}
        />
    )
}

const AxisGridLineColor: FC = () => {
    return (
        <Chart
            keyAxis={{ count: 12, size: 36, getLabel: (v) => v.toString() }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), gridLineColor: '#ddd' }}
            dataOption={()=>{
                return {
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'line'
                }
            ]}
        />
    )
}

const AxisZoom: FC = () => {
    const points = []
    for (let i = 0; i < 100; i++) {
        points.push({ a: i, b: GetRandomNumber(60, 70) })
    }
    return (
        <Chart
            keyAxis={{ count: 100, size: 36, getLabel: (v) => v.toString(), zoom: true }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), gridLineColor: '#ddd' }}
            dataOption={()=>{
                return {
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points,
                    type: 'line'
                }
            ]}
        />
    )
}
const PointStyle: FC = () => {
    return (
        <Chart
            keyAxis={{ count: 12, size: 36, getLabel: (v) => v.toString() }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), gridLineColor: '#ddd' }}
            dataOption={()=>{
                return {
                    pointValue:(point)=>point.b,
                    pointStyle:(point)=>({r: 12, lineWidth: 6, dash: [6, 3], fill: 'orange', stroke: '#0069ff'})
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'line'
                }
            ]}
        />
    )
}
const LineStyle: FC = () => {
    return (
        <Chart
            keyAxis={{ count: 12, size: 36, getLabel: (v) => v.toString() }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), gridLineColor: '#ddd' }}
            dataOption={()=>{
                return {
                    lineStyle:{lineWidth: 3, dash: [6, 3], stroke: 'orange'},
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'line'
                }
            ]}
        />
    )
}

const PointText: FC = () => {
    return (
        <Chart
            keyAxis={{ count: 12, size: 36, getLabel: (v) => v.toString() }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), gridLineColor: '#ddd' }}
            dataOption={()=>{
                return {
                    pointValue:(point)=>point.b,
                    pointText:(point)=>point.b,
                    pointTextStyle:()=>({ offset: 12, fill: '#0069ff', fontSize: 20, rotate: 0 })
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'line'
                }
            ]}
        />
    )
}
const OnPointClick: FC = () => {
    const DATE = new AIODate();
    const monthes = DATE.getMonths()
    return (
        <Chart
            onPointClick={(p)=>{
                alert(`dataIndex:${p.dataIndex},pointIndex:${p.pointIndex}`)
            }}
            keyAxis={{ count: 12, size: 36, getLabel: (v) => monthes[v] }}
            valueAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            dataOption={()=>{
                return {
                    pointValue:(point)=>point.b
                }
            }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    type: 'line'
                }
            ]}
        />
    )
}
const Sample1: FC = () => {
    return (
        <div className='chart-sample-1-container'>
            <Chart
                attrs={{ className: 'chart-sample-1' }}
                keyAxis={{ count: 12, size: 16, getLabel: (v) => v.toString() }}
                valueAxis={{ start: 0, end: 100, size: 20, getLabel: (v) => v.toString(), gridLineColor: '#8ae7df' }}
                dataOption={()=>{
                    return {
                        pointValue:(point)=>point.b,
                        pointStyle:()=>({fill:'#fff'})
                    }
                }}
                datas={[
                    {
                        points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                        color: '#fff',
                        type: 'bar'
                    }
                ]}
            />
        </div>
    )
}
const BasicPie: FC = () => {
    return (
        <Pie
            start={0}
            end={200}
            ranges={[
                { value: 20, color: 'red' },
                { value: 40, color: 'orange' },
                { value: 50, color: 'yellow' },
                { value: 90, color: 'green' },
            ]}
        />
    )
}
const PieEmpty: FC = () => {
    return (
        <Pie
            start={0}
            end={200}
            ranges={[
                { value: 20, color: 'red' },
                { value: 40, color: 'orange' },
                { value: 50, color: 'yellow' },
                { value: 90, color: '#eee' },
            ]}
            
        />
    )
}
const PieSize: FC = () => {
    return (
        <Pie
            start={0}
            end={200}
            ranges={[
                { value: 20, color: 'red' },
                { value: 40, color: 'orange' },
                { value: 50, color: 'yellow' },
                { value: 90, color: 'green' },
            ]}
            size={120}
        />
    )
}
const PieThickness: FC = () => {
    return (
        <Pie
            start={0}
            end={300}
            thickness={80}
            roundCap={true}
            ranges={[
                { value: 20, color: 'red' },
                { value: 40, color: 'orange' },
                { value: 50, color: 'yellow', roundCap: true },
                { value: 90, color: 'green' },
                { value: 100, color: 'blue' },
            ]}
            size={240}
        />
    )
}
const PieRangeThickness: FC = () => {
    return (
        <Pie
            start={0}
            end={300}
            thickness={20}
            roundCap={true}
            ranges={[
                { value: 20, color: 'red',thickness:30,offset:40 },
                { value: 40, color: 'orange',thickness:40,offset:30 },
                { value: 50, color: 'yellow',thickness:50, roundCap: true,offset:20 },
                { value: 90, color: 'green',thickness:60,offset:10 },
                { value: 100, color: 'blue',thickness:70 },
            ]}
            size={300}
        />
    )
}
const PieCircles: FC = () => {
    return (
        <Pie
            start={0}
            end={300}
            thickness={20}
            roundCap={true}
            circles={[
                {thickness:10,color:'rgba(0,0,0,0.2)',offset:10}
            ]}
            ranges={[
                { value: 20, color: 'red',thickness:30 },
                { value: 40, color: 'orange',thickness:40 },
                { value: 50, color: 'yellow',thickness:50, roundCap: true },
                { value: 90, color: 'green',thickness:60 },
                { value: 100, color: 'blue',thickness:70 },
            ]}
            size={300}
        />
    )
}
const PieGenerator: FC = () => {
    const [config, setConfig] = useState<any>({
        thickness: 10,
        size: 120,
    })
    return (
        <div className='p-24-'>
            <div className="msf">
                <AIFormInput
                    label='thickness'
                    input={
                        <AISlider
                            start={1} end={150} value={config.thickness} onChange={(thickness) => setConfig({ ...config, thickness })}
                        />
                    }
                />
                <AIFormInput
                    label='size'
                    input={
                        <AISlider
                            start={36} end={300} value={config.size} onChange={(size) => setConfig({ ...config, size })}
                        />
                    }
                />
            </div>
            <Pie
                start={0}
                end={100}
                thickness={config.thickness}
                roundCap={true}
                ranges={[
                    { value: 20, color: 'red' },
                    { value: 40, color: 'orange' },
                    { value: 50, color: 'yellow', roundCap: true },
                    { value: 90, color: 'green' },
                    { value: 100, color: 'blue' },
                ]}
                size={config.size}
            />
        </div>
    )
}