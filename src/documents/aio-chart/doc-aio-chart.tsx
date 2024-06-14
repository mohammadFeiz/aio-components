import React, { Component, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import Code from '../../npm/code/index';
import Chart, { getFakeData } from '../../npm/aio-chart/index.tsx';
import AIOInput from '../../npm/aio-input/index.tsx';
import './index.css';
export default function DOC_AIOForm(props) {
  let points = [
    { x: 'January', y: 10 },
    { x: 'February', y: 20 },
    { x: 'March', y: 40 },
    { x: 'April', y: 55 },
    { x: 'May', y: 50 },
    { x: 'June', y: 60 },
    { x: 'July', y: 65 },
    { x: 'August', y: 50 },
    { x: 'September', y: 45 },
    { x: 'October', y: 35 },
  ]
  let keys = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October']
  return (
    <DOC
      name={props.name} goToHome={props.goToHome}
      nav={{
        id: 'performance',
        items: () => [
          { text: 'performance', id: 'performance', render: () => <Performance /> },
          { text: 'data', id: 'data', render: () => <Data points={points} keys={keys} /> },
          { text: 'MultiData', id: 'MultiData', render: () => <MultiData points={points} keys={keys} /> },
          { text: 'data.color', id: 'data.color', render: () => <Data_color points={points} keys={keys} /> },
          { text: 'data.title', id: 'data.title', render: () => <Data_title points={points} keys={keys} /> },
          { text: 'data.pointRadius', id: 'data.pointRadius', render: () => <Data_pointRadius points={points} keys={keys} /> },
          { text: 'data.pointStrokeWidth', id: 'data.pointStrokeWidth', render: () => <Data_pointStrokeWidth points={points} keys={keys} /> },
          { text: 'data.pointStroke', id: 'data.pointStroke', render: () => <Data_pointStroke points={points} keys={keys} /> },
          { text: 'data.pointFill', id: 'data.pointFill', render: () => <Data_pointFill points={points} keys={keys} /> },
          { text: 'data.pointDash', id: 'data.pointDash', render: () => <Data_pointDash points={points} keys={keys} /> },
          { text: 'data.pointText', id: 'data.pointText', render: () => <Data_pointText points={points} keys={keys} /> },
          { text: 'data.pointTextStyle', id: 'data.pointTextStyle', render: () => <Data_pointTextStyle points={points} keys={keys} /> },
          { text: 'data.lineWidth', id: 'data.lineWidth', render: () => <Data_lineWidth keys={keys} /> },
          { text: 'data.lineDash', id: 'data.lineDash', render: () => <Data_lineDash points={points} keys={keys} /> },
          { text: 'data.areaColor', id: 'data.areaColor', render: () => <Data_areaColor points={points} keys={keys} /> },
          { text: 'valueAxis', id: 'valueAxis', render: () => <ValueAxis points={points} keys={keys} /> },
          { text: 'lines', id: 'lines', render: () => <Lines points={points} keys={keys} /> },
          { text: 'bar chart', id: 'bar chart', render: () => <BarChart points={points} keys={keys} /> },
          { text: 'barWidth', id: 'barWidth', render: () => <BarWidth points={points} keys={keys} /> },
          { text: 'labelRotate', id: 'labelRotate', render: () => <LabelRotate points={points} keys={keys} /> },
          { text: 'editLabel', id: 'editLabel', render: () => <EditLabel points={points} keys={keys} /> },
        ]
      }}
    />
  )
}

function Performance() {
  let [data, setData] = useState(getData())
  function getData() {
    let { keys, points } = getFakeData(10000, 100)
    return { keys, points }
  }
  let { keys, points } = data;
  return (
    <div className='example'>
      <Chart
        data={[
          {
            type: 'line',
            title: 'my data',
            points,
          }
        ]}
        keyAxis={{
          zoom: true
        }}
        keys={keys}
      />
      {Code(
        `<Chart
  data={[
    {points}
  ]}
  keyAxis={{
    zoom: true
  }}
  keys={keys}
/>`
      )}
    </div>
  )
}



function Data({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          { points }
        ]}
        keys={keys}
      />
      {
        Code(
          `<Chart
  data={[
    {
      points,
    }
  ]}
  keys={keys}
/>`
        )
      }
    </div>
  )
}
function MultiData({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          {
            points,
          },
          {
            color: 'dodgerblue',
            points: [
              { x: 'January', y: 10 + (Math.round(Math.random() * 100)) },
              { x: 'February', y: 20 + (Math.round(Math.random() * 100)) },
              { x: 'March', y: 40 + (Math.round(Math.random() * 100)) },
              { x: 'April', y: 55 + (Math.round(Math.random() * 100)) },
              { x: 'May', y: 50 + (Math.round(Math.random() * 100)) },
              { x: 'June', y: 60 + (Math.round(Math.random() * 100)) },
              { x: 'July', y: 65 + (Math.round(Math.random() * 100)) },
              { x: 'August', y: 50 + (Math.round(Math.random() * 100)) },
              { x: 'September', y: 45 + (Math.round(Math.random() * 100)) },
              { x: 'October', y: 35 + (Math.round(Math.random() * 100)) },
            ]
          }
        ]}
        keys={keys}
      />
      {
        Code(
          `<Chart
  data={[
    {
      points,
    },
    {
      color: 'dodgerblue',
      points: [
        { x: 'January', y: 10 + (Math.round(Math.random() * 100)) },
        { x: 'February', y: 20 + (Math.round(Math.random() * 100)) },
        { x: 'March', y: 40 + (Math.round(Math.random() * 100)) },
        { x: 'April', y: 55 + (Math.round(Math.random() * 100)) },
        { x: 'May', y: 50 + (Math.round(Math.random() * 100)) },
        { x: 'June', y: 60 + (Math.round(Math.random() * 100)) },
        { x: 'July', y: 65 + (Math.round(Math.random() * 100)) },
        { x: 'August', y: 50 + (Math.round(Math.random() * 100)) },
        { x: 'September', y: 45 + (Math.round(Math.random() * 100)) },
        { x: 'October', y: 35 + (Math.round(Math.random() * 100)) },
      ]
    }
  ]}
  keys={keys}
/>`
        )
      }
    </div>
  )
}
function Data_color({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          { points, color: 'red' }
        ]}
        keys={keys}
      />
      {
        Code(
          `<Chart
  data={[
    {points,color: '#0094D4'}
  ]}
  keys={keys}
/>`
        )
      }
    </div>
  )
}
function Data_title({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          { points, color: '#0094D4', title: 'Sale' }
        ]}
        keys={keys}
      />
      {
        Code(
          `<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
    }
  ]}
  keys={keys}
/>`
        )
      }
    </div>
  )
}
function Data_pointRadius({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          { points, color: '#0094D4', title: 'Sale', pointRadius: 6 }
        ]}
        keys={keys}
      />
      {
        Code(
          `<Chart
  data={[
    {points,color: '#0094D4',title: 'Sale',pointRadius: 6}
  ]}
  keys={keys}
/>`
        )
      }
    </div>
  )
}
function Data_pointStrokeWidth({ points, keys }) {
    return (
      <div className='example'>
        <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
            pointRadius: 6,
            pointStrokeWidth: 3
          }
        ]}
        keys={keys}
      />
      {
        Code(
`<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
      pointRadius: 6,
      pointStrokeWidth: 3
    }
  ]}
  keys={keys}
/>`
        )
      }
      </div>
    )
}
function Data_pointStroke({ points, keys }) {
    return (
      <div className='example'>
        <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
            pointRadius: 6,
            pointStrokeWidth: 3,
            pointStroke: 'orange'
          }
        ]}
        keys={keys}
      />
      {
        Code(
`<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
      pointRadius: 6,
      pointStrokeWidth: 3,
      pointStroke: 'orange'
    }
  ]}
  keys={keys}
/>`
        )
      }
      </div>
    )
}
function Data_pointFill({ points, keys }) {
    return (
      <div className='example'>
        <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
            pointRadius: 6,
            pointStrokeWidth: 3,
            pointStroke: 'orange',
            pointFill: 'lightgreen'
          }
        ]}
        keys={keys}
      />
      {
        Code(
`<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
      pointRadius: 6,
      pointStrokeWidth: 3,
      pointStroke: 'orange',
      pointFill: 'lightgreen'
    }
  ]}
  keys={keys}
/>`
        )
      }
      </div>
    )
}
function Data_pointDash({ points, keys }) {
    return (
      <div className='example'>
        <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
            pointStrokeWidth: 2,
            pointRadius: 6,
            pointStroke: 'orange',
            pointFill: 'lightgreen',
            pointDash: [3, 2]
          }
        ]}
        keys={keys}
      />
      {
        Code(
`<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
      pointStrokeWidth: 2,
      pointRadius: 6,
      pointStroke: 'orange',
      pointFill: 'lightgreen',
      pointDash: [3, 2]
    }
  ]}
  keys={keys}
/>`
        )
      }
      </div>
    )
}
function Data_pointText({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
            pointRadius: 6,
            pointStrokeWidth: 3,
            pointStroke: 'orange',
            pointFill: 'lightgreen',
            pointText: 'point.x + " , " + point.y'
          }
        ]}
        keys={keys}
      />
      {
        Code(
          `<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
      pointRadius: 6,
      pointStrokeWidth: 3,
      pointStroke: 'orange',
      pointFill: 'lightgreen',
      pointText: 'point.x + " , " + point.y'
    }
  ]}
  keys={keys}
/>`
        )
      }
    </div>
  )
}
function Data_pointTextStyle({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
            pointRadius: 6,
            pointStrokeWidth: 3,
            pointStroke: 'orange',
            pointFill: 'lightgreen',
            pointText: 'point.x + " , " + point.y',
            pointTextStyle: { fontSize: 10, color: 'red', top: 16 }
          }
        ]}
        keys={keys}
      />
      {
        Code(
          `<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
      pointRadius: 6,
      pointStrokeWidth: 3,
      pointStroke: 'orange',
      pointFill: 'lightgreen',
      pointText: 'point.x + " , " + point.y',
      pointTextStyle: { fontSize: 10, color: 'red', top: 16 }
    }
  ]}
  keys={keys}
/>`
        )
      }
    </div>
  )
}
function Data_lineWidth({ keys }) {
  let [points] = useState([
    { x: 'p1', y: 10 },
    { x: 'p2', y: 20 },
    { x: 'p3', y: 40 },
    { x: 'p4', y: 10 },
    { x: 'p5', y: 50 },
    { x: 'p6', y: 20 },
    { x: 'p7', y: 90 },
    { x: 'p8', y: 70 },
    { x: 'p9', y: 30 },
    { x: 'p10', y: 70 },
  ])
  return (
    <div className='example'>
      <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
            pointRadius: 6,
            pointStrokeWidth: 3,
            lineWidth: 3
          }
        ]}
        keys={keys}
      />
      {
        Code(
          `<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
      pointRadius: 6,
      pointStrokeWidth: 3,
      lineWidth: 3
    }
  ]}
  keys={keys}
/>`
        )
      }
    </div>
  )
}
function Data_lineDash({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
            pointRadius: 6,
            lineDash: [4, 3],
          }
        ]}
        keys={keys}
      />
      {
        Code(
`<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
      pointRadius: 6,
      lineDash: [4, 3],
    }
  ]}
  keys={keys}
/>`
        )
      }
    </div>
  )
}

function Data_areaColor({ points, keys }) {
    return (
      <div className='example'>
        <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
            areaColor: 'transparent'
          }
        ]}
        keys={keys}
      />
      {
        Code(
`<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
      areaColor: 'transparent'
    }
  ]}
  keys={keys}
/>`
        )
      }
      </div>
    )
}
function ValueAxis({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
          }
        ]}
        keys={keys}
        valueAxis={{
          gridColor: '#eee',
          title: 'amount',
          size: 120,
          zoom: true
        }}
      />
      {
        Code(
          `<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
    }
  ]}
  keys={keys}
  valueAxis={{
    gridColor: '#eee',
    title: 'amount',
    size: 120,
    zoom: true
  }}
/>`
        )
      }
    </div>
  )
}
function Lines({ points, keys }) {
    return (
      <div className='example'>
        <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
          }
        ]}
        keys={keys}
        lines={[
          { key: keys[6], color: 'red', dash: [3, 3] },
          { key: [keys[2], keys[4]], value: 40, color: 'blue', dash: [3, 3] },
          { key: [keys[1], keys[4]], value: [40, 60], color: 'orange', dash: [3, 3] },
          { value: 20, color: 'yellow', dash: [3, 3] },
        ]}
      />
      {
        Code(
`<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
    }
  ]}
  keys={keys}
  lines={[
    { key: keys[6], color: 'red', dash: [3, 3] },
    { key: [keys[2], keys[4]], value: 40, color: 'blue', dash: [3, 3] },
    { key: [keys[1], keys[4]], value: [40, 60], color: 'orange', dash: [3, 3] },
    { value: 20, color: 'yellow', dash: [3, 3] },
  ]}
/>`
        )
      }
      </div>
    )
}
function BarChart({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          {
            type: 'bar',
            points,
            color: '#0094D4',
            title: 'Sale',
          }
        ]}
        keys={keys}
      />
      {
        Code(
          `<Chart
  data={[
    {
      type: 'bar',
      points,
      color: '#0094D4',
      title: 'Sale',
    }
  ]}
  keys={keys}
/>`
        )
      }
    </div>
  )
}
function BarWidth({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          {
            type: 'bar',
            points,
            color: '#0094D4',
            title: 'Sale',
          }
        ]}
        keys={keys}
        barWidth={50}
      />
      {
        Code(
          `<Chart
  data={[
    {
      type: 'bar',
      points,
      color: '#0094D4',
      title: 'Sale',
    }
  ]}
  keys={keys}
  barWidth={50}
/>`
        )
      }
    </div>
  )
}
function LabelRotate({ points, keys }) {
  return (
    <div className='example'>
      <Chart
        data={[
          {
            type: 'bar',
            points,
            color: '#0094D4',
            title: 'Sale',
          }
        ]}
        keys={keys}
        labelRotate={45}
      />
      {
        Code(
          `<Chart
  data={[
    {
      type: 'bar',
      points,
      color: '#0094D4',
      title: 'Sale',
    }
  ]}
  keys={keys}
  labelRotate={45}
/>`
        )
      }
    </div>
  )
}
function EditLabel({ points, keys }) {
    return (
      <div className='example'>
        <Chart
        data={[
          {
            points,
            color: '#0094D4',
            title: 'Sale',
          }
        ]}
        keys={keys}
        keyAxis={{
          edit: (label) => label.slice(0, 3)
        }}
        valueAxis={{
          edit: (label) => label + '%'
        }}
      />
      {
        Code(
`<Chart
  data={[
    {
      points,
      color: '#0094D4',
      title: 'Sale',
    }
  ]}
  keys={keys}
  keyAxis={{
    edit: (label) => label.slice(0, 3)
  }}
  valueAxis={{
    edit: (label) => label + '%'
  }}
/>`
        )
      }
      </div>
    )
}
