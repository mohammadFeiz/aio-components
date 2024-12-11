import React, { Component, FC, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import Code from '../../npm/code/index';
import { Chart, Pie } from '../../npm/aio-dashboard';
import AIODate from './../../npm/aio-date';
import { GetRandomNumber } from '../../npm/aio-utils/index.tsx';
import './index.css';
import { AISlider } from '../../npm/aio-input/index.tsx';
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
                    { text: 'areaColors', id: 'areaColors', render: () => <AreaColors /> },
                    { text: 'ranges', id: 'bar chart range', render: () => <GetRanges /> },
                    { text: 'padding', id: 'axispadding', render: () => <AxisPadding /> },
                    { text: 'getLabel', id: 'axisgtlabel', render: () => <AxisGetLabel /> },
                    { text: 'rotate', id: 'axisrotate', render: () => <AxisRotate /> },
                    { text: 'rotate rtl', id: 'axisrotatertl', render: () => <AxisRotateRTL /> },
                    { text: 'gridLineColor', id: 'axisgridlinecolor', render: () => <AxisGridLineColor /> },
                    { text: 'zoom', id: 'axiszoom', render: () => <AxisZoom /> },
                    { text: 'point style', id: 'pointstyle', render: () => <PointStyle /> },
                    { text: 'line style', id: 'linestyle', render: () => <LineStyle /> },
                    { text: 'point text', id: 'pointtext', render: () => <PointText /> },
                    { text: 'sample 1', id: 'sample1', render: () => <Sample1 /> },
                    { text: 'Basic Pie Chart', id: 'basicpie', render: () => <BasicPie /> },
                    { text: 'Pie Empty', id: 'pieempty', render: () => <PieEmpty /> },
                    { text: 'Pie Size', id: 'piesize', render: () => <PieSize /> },
                    { text: 'Pie Thickness', id: 'piethickness', render: () => <PieThickness /> },
                    { text: 'Pie Generator', id: 'piegenerator', render: () => <PieGenerator /> },
                ]
            }}
        />
    )
}

const LineChart: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
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
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
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
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getPointStyle: (point: any) => {
                        return {
                            fill: 'red'
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
                            fill: 'blue'
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
                            fill: 'orange'
                        }
                    },
                    type: 'bar'
                }
            ]}
        />
    )
}
const GetRanges: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
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
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getRanges: (point: any) => point.ranges,
                    getPointStyle: (point: any) => {
                        return {
                            fill: 'red'
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
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
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
const AreaColors: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getLineStyle: () => {
                        return {
                            stroke: '#ffa500'
                        }
                    },
                    type: 'line',
                    areaColors: ['transparent', '#ffa500']
                }
            ]}
        />
    )
}
const AxisPadding: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString(), padding: [24, 48] }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), padding: [12, 24] }}
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

const AxisGetLabel: FC = () => {
    const DATE = new AIODate();
    const monthes = DATE.getMonths()
    return (
        <Chart
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => monthes[v] }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
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
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => monthes[v], rotate: 45 }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
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
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => monthes[v], rotate: -45 }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString() }}
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
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), gridLineColor: '#ddd' }}
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
    const points = []
    for (let i = 0; i < 100; i++) {
        points.push({ a: i, b: GetRandomNumber(60, 70) })
    }
    return (
        <Chart
            xAxis={{ start: 0, end: 100, size: 36, getLabel: (v) => v.toString(), zoom: true }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), gridLineColor: '#ddd' }}
            datas={[
                {
                    points,
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    type: 'line'
                }
            ]}
        />
    )
}
const PointStyle: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), gridLineColor: '#ddd' }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getPointStyle: (point) => {
                        return {
                            r: 12, lineWidth: 6, dash: [6, 3], fill: 'orange', stroke: '#0069ff'
                        }
                    },
                    type: 'line'
                }
            ]}
        />
    )
}
const LineStyle: FC = () => {
    return (
        <Chart
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), gridLineColor: '#ddd' }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getLineStyle: () => {
                        return {
                            lineWidth: 3, dash: [6, 3], stroke: 'orange'
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
            xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString() }}
            yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), gridLineColor: '#ddd' }}
            datas={[
                {
                    points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                    getX: (point: any) => point.a,
                    getY: (point: any) => point.b,
                    getPointText: (point: any) => {
                        return {
                            text: point.y.value.toString(),
                            style: { offset: 12, fill: '#0069ff', fontSize: 20, rotate: 0 }
                        }
                    },
                    type: 'line'
                }
            ]}
        />
    )
}

const Sample1: FC = () => {
    return (
        <div className="msf">
            <Chart
                attrs={{ className: 'chart-sample-1' }}
                xAxis={{ start: 0, end: 11, size: 36, getLabel: (v) => v.toString() }}
                yAxis={{ start: 0, end: 100, size: 60, getLabel: (v) => v.toString(), gridLineColor: '#8ae7df' }}
                datas={[
                    {
                        points: [{ a: 0, b: 24 }, { a: 1, b: 27 }, { a: 2, b: 78 }, { a: 3, b: 24 }, { a: 4, b: 0 }, { a: 5, b: 90 }, { a: 6, b: 87 }, { a: 7, b: 34 }, { a: 8, b: 42 }, { a: 9, b: 70 }, { a: 10, b: 55 }, { a: 11, b: 13 }],
                        getX: (point: any) => point.a,
                        getY: (point: any) => point.b,
                        getPointStyle: (point: any) => {
                            return {
                                fill: '#fff'
                            }
                        },
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
            end={100}
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
            end={100}
            ranges={[
                { value: 20, color: 'red' },
                { value: 40, color: 'orange' },
                { value: 50, color: 'yellow' },
                { value: 90, color: 'green' },
            ]}
            empty={{ color: '#eee' }}
        />
    )
}
const PieSize: FC = () => {
    return (
        <Pie
            start={0}
            end={100}
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
            end={100}
            thickness={120}
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
const PieGenerator: FC = () => {
    const [config, setConfig] = useState<any>({
        thickness: 10,
        offset: 0,
        size: 120,
    })
    return (
        <div className='p-24'>
            <div className="msf">
                <AISlider
                    label='thickness' start={1} end={150} value={config.thickness} onChange={(thickness)=>setConfig({...config,thickness})}
                />
                <AISlider
                    label='offset' start={-120} end={120} value={config.offset} onChange={(offset)=>setConfig({...config,offset})}
                />
                <AISlider
                    label='size' start={36} end={300} value={config.size} onChange={(size)=>setConfig({...config,size})}
                />
            </div>
            <Pie
                start={0}
                end={100}
                thickness={config.thickness}
                offset={config.offset}
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