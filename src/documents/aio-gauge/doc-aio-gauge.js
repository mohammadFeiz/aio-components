import React, { Component } from 'react';
import AIOInput from './../../npm/aio-input/aio-input';
import {Gauge} from './../../npm/aio-chart/aio-chart';
import AIOStorage from './../../npm/aio-storage/aio-storage';
import AIOJson from './../../npm/aio-json/aio-json';
import { Icon } from '@mdi/react';
import { mdiDelete, mdiPlusThick, mdiClose } from '@mdi/js';
import RVD from '../../npm/react-virtual-dom/react-virtual-dom';
import './index.css';
export default class DOC_AIOGauge extends Component {
    render() {
        return (
            <Input {...this.props} />
        )
    }
}

class Input extends Component {
    constructor(props) {
        super(props);
        let Storage = AIOStorage('gaugegenerator')
        this.state = {
            mode: 'preview',
            Storage,
            gauges: this.getGaugesFromStorage(Storage),
            fileName: '',
            gauge: {
                circles: [{ lineWidth: 1, stroke: '#555555', radius: 50, slice: true }],
                dynamic: true,
                style: { width: 150, height: 150, background: '#eeeeee' },
                radius: 60, angle: 220, position: [0, 0], rotate: 0, thickness: 10, direction: 'clock',
                text: { value: 'My Gauge', fontSize: 10, top: 10, left: 0, color: '#000000', rotate: 0 },
                start: 0, end: 100,
                ranges: [
                    { value: 50, color: '#ff0000' },
                    { value: 100, color: '#00ff00' }
                ],
                scale: [],
                label: [],
                handle: { value: 50, width: 3, height: 50, radius: 3, offset: 0, color: '#000000' }
            }
        }
    }
    getGaugesFromStorage(Storage) {
        let model = Storage.getModel()
        return Object.keys(model).map((key) => key)
    }
    addRange(e) {
        e.stopPropagation()
        var { gauge } = this.state;
        var { ranges, end } = gauge;
        if (ranges.length) {
            var lastRange = ranges[ranges.length - 1];
            if (lastRange.value >= end) { return; }
        }
        ranges.push({ value: end, color: '#aaaaaa' })
        this.setState({ gauge })
    }
    addCircle(e) {
        e.stopPropagation()
        var { gauge } = this.state;
        var { circles } = gauge;
        circles.push({ radius: 50, color: '#555555', lineWidth: 1, slice: false });
        this.setState({ gauge })
    }
    addLabel(e) {
        e.stopPropagation()
        var { gauge } = this.state;
        var { label } = gauge;
        label.push({ step: 10, color: '#000000', fontSize: 10, offset: 0 });
        this.setState({ gauge })
    }
    removeLabel(index) {
        let { gauge } = this.state;
        gauge.label.splice(index, 1);
        this.setState({ gauge })
    }
    addScale(e) {
        e.stopPropagation()
        var { gauge } = this.state;
        var { scale } = gauge;
        scale.push({ step: 10, color: '#000', width: 1, height: 6, offset: 0 });
        this.setState({ gauge })
    }
    removeCircle(index) {
        let { gauge } = this.state;
        gauge.circles.splice(index, 1);
        this.setState({ gauge })
    }
    removeScale(index) {
        let { gauge } = this.state;
        gauge.scale.splice(index, 1);
        this.setState({ gauge })
    }
    removeRange(index) {
        let { gauge } = this.state;
        gauge.ranges.splice(index, 1);
        this.setState({ gauge })
    }
    form_ranges() {
        var { gauge } = this.state;
        var { start, end, ranges } = gauge;
        return {
            column: [
                {
                    size: 36, style: { marginTop: 12 },
                    row: [
                        { html: <Icon path={mdiPlusThick} size={0.8} />, onClick: (e) => this.addRange(e), className:'align-vh', size: 30 },
                        { html: 'Gaguge Ranges', className:'align-v', flex: 1 },

                    ]
                },
                {
                    column: ranges.map((o, i) => {
                        let beforeValue = i === 0 ? start : ranges[i - 1].value;
                        let afterValue = i === ranges.length - 1 ? end : ranges[i + 1].value;
                        return {
                            className:'align-v gap-2',
                            row: [
                                this.getInlineLabel('range ' + i),
                                { input: { type: 'slider', start: beforeValue, end: afterValue }, field: `value.ranges[${i}].value` },
                                { input: { type: 'number' }, field: `value.ranges[${i}].value`, size: 70 },
                                { input: { type: 'color' }, field: `value.ranges[${i}].color`, size: 46 },
                                { html: () => <Icon path={mdiClose} size={0.8} onClick={() => this.removeRange(i)} />, size: 20, className:'align-vh' },
                            ]
                        }
                    })
                }
            ]
        }
    }
    form_circles() {
        var { gauge } = this.state;
        var { circles } = gauge;
        return {
            column: [
                {
                    size: 36, style: { marginTop: 12 },
                    row: [
                        { html: <Icon path={mdiPlusThick} size={0.8} />, onClick: (e) => this.addCircle(e), className:'align-vh', size: 30 },
                        { html: 'Gaguge Circles', className:'align-v', flex: 1 },

                    ]
                },
                {
                    column: circles.map((o, i) => {
                        return {
                            row: [
                                this.getInlineLabel('circle ' + i),
                                { input: { type: 'number' }, field: `value.circles[${i}].radius` },
                                { input: { type: 'number' }, field: `value.circles[${i}].lineWidth` },
                                { input: { type: 'color' }, field: `value.circles[${i}].stroke` },
                                { input: { type: 'checkbox', center: true }, field: `value.circles[${i}].slice`, size: 24 },
                                { html: () => <Icon path={mdiClose} size={0.8} />, size: 20, className:'align-vh', onClick: () => this.removeCircle(i) }
                            ]
                        }
                    })
                }
            ]
        }
    }
    getInlineLabel(html) { return { html, className:'align-v fs-10', size: 70 } }
    form_style() {
        return {
            column: [
                { html: 'Gauge Styling', size: 36, className:'align-v m-t-12' },
                {
                    row: [
                        this.getInlineLabel('start-end'),
                        { input: { type: 'number' }, field: 'value.start' },
                        { input: { type: 'number' }, field: 'value.end' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('size'),
                        { input: { type: 'slider', start: 30, end: 260 }, field: 'value.style.width' },
                        { input: { type: 'slider', start: 30, end: 260 }, field: 'value.style.height' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('position'),
                        { input: { type: 'slider', start: 0, end: 100 }, field: 'value.position[0]' },
                        { input: { type: 'slider', start: 0, end: 100 }, field: 'value.position[1]' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('direction'),
                        { input: { type: 'radio', options: [{ value: 'clock', text: 'clock' }, { value: 'clockwise', text: 'clockwise' }], optionStyle: { width: "50%" } }, field: 'value.direction' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('radius'),
                        { input: { type: 'slider', start: 20, end: 130 }, field: 'value.radius' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('angle'),
                        { input: { type: 'slider', start: 0, end: 360 }, field: 'value.angle' },
                        { input: { type: 'slider', start: 0, end: 360 }, field: 'value.rotate' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('thickness'),
                        { input: { type: 'slider', start: 0, end: 70 }, field: 'value.thickness' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('background'),
                        { input: { type: 'color' }, field: 'value.style.background' },
                    ]
                }
            ]
        }
    }
    form_label() {
        var { gauge } = this.state;
        var { label } = gauge;
        return {
            column: [
                {
                    size: 36, style: { marginTop: 12 },
                    row: [
                        { html: <Icon path={mdiPlusThick} size={0.8} />, onClick: (e) => this.addLabel(e), className:'align-vh', size: 30 },
                        { html: 'Gaguge Labels', className:'align-v', flex: 1 },

                    ]
                },
                {
                    column: label.map((o, i) => {
                        return {
                            row: [
                                { input: { type: 'number' }, label: 'step', field: `value.label[${i}].step` },
                                { input: { type: 'number' }, label: 'start', field: `value.label[${i}].start` },
                                { input: { type: 'number', attrs: { min: 2, max: 20 } }, label: 'fontSize', field: `value.label[${i}].fontSize` },
                                { input: { type: 'number', attrs: { min: 0, max: 200 } }, label: 'offset', field: `value.label[${i}].offset` },
                                { input: { type: 'color' }, label: 'color', field: `value.label[${i}].color` },
                                { html: <Icon path={mdiClose} size={0.8} onClick={() => this.removeLabel(i)} />, size: 20, style: { paddingTop: 24 } }
                            ]
                        }
                    })
                }
            ]
        }
    }
    form_scale() {
        let { gauge } = this.state;
        let { scale } = gauge;
        return {
            column: [
                {
                    size: 36, style: { marginTop: 12 },
                    row: [
                        { html: <Icon path={mdiPlusThick} size={0.8} />, onClick: (e) => this.addScale(e), className:'align-vh', size: 30 },
                        { html: 'Gaguge Scales', className:'align-v', flex: 1 },

                    ]
                },
                {
                    column: scale.map((o, i) => {
                        return {
                            row: [
                                { input: { type: 'number' }, label: 'step', field: `value.scale[${i}].step` },
                                { input: { type: 'number', attrs: { min: 0, max: 20 } }, label: 'width', field: `value.scale[${i}].width` },
                                { input: { type: 'number', attrs: { min: 0, max: 30 } }, label: 'height', field: `value.scale[${i}].height` },
                                { input: { type: 'number', attrs: { min: 0, max: 200 } }, label: 'offset', field: `value.scale[${i}].offset` },
                                { input: { type: 'number', attrs: { min: 0, max: 200 } }, label: 'min', field: `value.scale[${i}].min` },
                                { input: { type: 'number', attrs: { min: 0, max: 200 } }, label: 'max', field: `value.scale[${i}].max` },
                                { input: { type: 'color' }, label: 'c', field: `value.scale[${i}].color`,size:24 },
                                { html: <Icon path={mdiClose} size={0.8} onClick={() => this.removeScale(i)} />, size: 20, style: { paddingTop: 24 } }
                            ]
                        }
                    })
                }
            ]
        }
    }
    form_handle() {
        return {
            column: [
                {
                    size: 36, style: { marginTop: 12 },
                    row: [
                        { html: 'Gaguge Handle', className:'align-v', flex: 1 },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('value'),
                        { input: { type: 'slider', start: 'value.start', end: 'value.end' }, field: 'value.handle.value' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('width'),
                        { input: { type: 'slider', start: 0, end: 50 }, field: 'value.handle.width' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('height'),
                        { input: { type: 'slider', start: -100, end: 100 }, field: 'value.handle.height' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('offset'),
                        { input: { type: 'slider', start: 0, end: 120 }, field: 'value.handle.offset' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('radius'),
                        { input: { type: 'slider', start: 0, end: 60 }, field: 'value.handle.radius' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('color'),
                        { input: { type: 'color' }, field: 'value.handle.color' },
                    ]
                }
            ]
        }
    }
    form_text() {
        return {
            column: [
                {
                    size: 36, style: { marginTop: 12 },
                    row: [
                        { html: 'Gaguge Text', className:'align-v flex-1' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('value'),
                        { input: { type: 'text' }, field: 'value.text.value' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('top'),
                        { input: { type: 'slider', start: -100, end: 100 }, field: 'value.text.top' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('left'),
                        { input: { type: 'slider', start: -100, end: 100 }, field: 'value.text.left' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('fontSize'),
                        { input: { type: 'slider', start: 2, end: 40 }, field: 'value.text.fontSize' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('rotate'),
                        { input: { type: 'slider', start: 0, end: 360 }, field: 'value.text.rotate' },
                    ]
                },
                {
                    row: [
                        this.getInlineLabel('color'),
                        { input: { type: 'color' }, field: 'value.text.color' },
                    ]
                }
            ]
        }
    }
    activeGauge_layout() {
        let { fileName, Storage, gauge } = this.state;
        if (!fileName) { return false }
        gauge.start = gauge.start || 0;
        let inputs = {
            props:{gap:2},
            column: [
                this.form_ranges(),
                this.form_circles(),
                this.form_style(),
                this.form_label(),
                this.form_scale(),
                this.form_handle(),
                this.form_text()
            ]
        }
        return {
            size: 480,
            html: (
                <AIOInput
                    type='form'
                    onChange={(gauge) => {
                        let { fileName } = this.state;
                        console.log(gauge.position)
                        Storage.save({ value: gauge, name: fileName })
                        this.setState({ gauge })
                    }}
                    defaults={{
                        slider: {
                            thickness: 3, emptyColor: '#1d292c', fillColor: '#105e57',
                            buttonStyle: { background: '#4c525a', height: 16, fontSize: 10 }
                        }
                    }}
                    style={{ padding: 6, color: '#fff', background: '#1d292c' }}
                    theme={{ checkIconSize: [12, 10, 1], checkIconColor: ['#ff6600'] }}
                    inputStyle={{ height: 20, borderRadius: 0, background: 'rgba(138, 166, 216, 0.1)', color: '#fff', border: 'none', fontSize: 10 }}
                    rowStyle={{ height: 38, margin: 0 }}
                    bodyStyle={{ padding: 0 }}
                    value={gauge}
                    inputs={inputs}
                />
            )
        }
    }
    preview_layout() {
        let { mode } = this.state;
        return {className:'align-vh ofy-auto bg-32 flex-1',html: this['preview_' + mode]()}
    }
    preview_preview() {
        // let {fileName} = this.state;
        // if(!fileName){return false}
        return (
            <Gauge {...this.state.gauge} position={[this.state.gauge.position[0] + '%', this.state.gauge.position[1] + '%']} />
        )
    }
    preview_model() {
        let { gauge } = this.state;
        return (
            <AIOJson style={{ height: '100%' }} json={gauge} onChange={(gauge) => this.setState({ gauge })} />
        )
    }
    gauges_layout() {
        let { gauges, fileName, Storage } = this.state;
        return {
            size: 240,
            column: gauges.map((name) => {
                let active = fileName === name;
                return {
                    className:'align-v h-36 p-h-12 color-32 fs-12 m-b-1',
                    style: {background: active ? '#2e577f' : 'rgb(138 166 216 / 10%)'},
                    row: [
                        {
                            className:'align-v h-100 flex-1',
                            html: name,
                            attrs: {
                                onClick: () => {
                                    let res = Storage.load({ name });
                                    this.setState({ gauge: res, fileName: name })
                                }
                            }
                        },
                        {
                            html: <Icon path={mdiDelete} size={0.7} />, className:'align-vh', attrs: {
                                onClick: () => {
                                    let { fileName } = this.state;
                                    if (name === fileName) { fileName = false; }
                                    Storage.remove({ name });
                                    this.setState({ fileName, gauges: this.getGaugesFromStorage(Storage) })
                                }
                            }
                        }
                    ]
                }
            })
        }
    }
    toolbar_layout() {
        let { gauge, Storage, mode } = this.state;
        return {
            size: 48, className:'align-v gap-1',
            row: [
                {
                    size: 240,
                    html: (
                        <AIOInput
                            before={<Icon path={mdiPlusThick} size={0.7} />}
                            text='Add Gauge'
                            style={{ background: '#2a59545c', color: '#fff', width: '100%', height: 48 }}
                            type='button'
                            onClick={() => {
                                let name = window.prompt('inter gauge name')
                                if (!name || name === null) { return }
                                Storage.save({ value: gauge, name });
                                this.setState({ gauges: this.getGaugesFromStorage(Storage) })
                            }}
                        />
                    )
                },
                {
                    flex: 1,
                    html: (
                        <AIOInput
                            style={{ background: '#2a59545c', color: '#fff', height: 48 }}
                            type='tabs'
                            value={mode}
                            options={[
                                { text: 'Preview', value: 'preview' },
                                { text: 'Model', value: 'model' }
                            ]}
                            onChange={(mode) => {
                                this.setState({ mode })
                            }}
                        />
                    )
                },
                {
                    html: (
                        <AIOInput
                            style={{ background: '#2a59545c', color: '#fff', height: 48 }}
                            type='button'
                            text='Exit'
                            onClick={() => this.props.goToHome()}
                        />
                    )
                }
            ]
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    style: { position: 'fixed', height: '100%', flex: 'none', width: '100%', left: 0, top: 0, background: '#1d292c' },
                    column: [
                        this.toolbar_layout(),
                        {
                            flex: 1,
                            row: [
                                this.gauges_layout(),
                                this.preview_layout(),
                                this.activeGauge_layout()
                            ]
                        }
                    ]
                }}
            />
        )
    }
}
