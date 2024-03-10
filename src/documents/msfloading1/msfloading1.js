import React, { useState } from 'react';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from './../../npm/aio-input/aio-input';
import AIOPopup from './../../npm/aio-popup/aio-popup';
import { FileToBase64 } from '../../npm/aio-utils';
import { Icon } from '@mdi/react';
import { mdiContentCopy, mdiEye, mdiEyeOff } from '@mdi/js';
import './index.css';
import $ from 'jquery';
export default function DOC_MSFLoading1({ goToHome }) {
    let [popup] = useState(new AIOPopup())
    let [file,setFile] = useState();
    let [model, setModel] = useState({
        count: 9,
        rtl: true,
        duration: 1,
        loop: false,
        offset: 4,
        size: 36,
        loopDelay: 0.7,
        className: '',
        sizes: [20, 16, 16, 16, 16, 16, 16, 16, 16],
        border: true,
        containerSize: 300,
        activeSize: false
    })
    function getCss() {
        let { count, duration, loop, offset, size, className, loopDelay, sizes } = model;
        let str = '';
        let start = 0;
        let delay = loopDelay / (duration + loopDelay) * 100
        let step = (100 - offset - delay) / count;
        let unitSizes = 0;
        for (let i = 0; i < count; i++) {
            let unitSize = sizes[i];
            str += `
.${className} .${className}item:nth-child(${i + 1}) {
    animation-name: ${className}${i + 1};
    animation-duration:${duration + loopDelay}s;
    height:${size}px;
    object-fit:cover;
    object-position:top 0px right ${-unitSizes}px;
    ${loop ? 'animation-iteration-count:infinite;' : ''}
}
@keyframes ${className}${i + 1} {
    0% {
        transform: scale(3);
        opacity: 0;
    }
    ${start}% {
        transform: scale(3);
        opacity: 0;
    }
    ${start + step + offset}% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
      `
            start += step;
            unitSizes += unitSize;

        }
        $('#msf-loading1-css').html(str)
        return str
    }
    function getJs() {
        let { count, className, sizes, containerSize } = model;
        let str = `
import imagesrc from './image.png';
import './loading.css';
export default function Loading(){
    return (
        <div className="${className}" style={{display:"flex",width:${containerSize}}}>`
        for (let i = 0; i < count; i++) {
            str += (`
            <img src={imagesrc} className="${className}item" style={{width: ${sizes[i]}}}/>`)
        }
        str += `
        </div>`
        str += `
    )`
        str += `
}`
        return str
    }
    function codes_layout() {
        return {
            column: [
                {className:'p-3 p-b-0',html: <AIOInput type='button' text={'Exit To Home'} onClick={()=>goToHome()} className='ai-style-4 fs-14 m-0'/>},
                {className:'p-3 p-b-0',html: <AIOInput type='file' text={'Select Image'} onChange={(file)=>FileToBase64(file,(file)=>setFile(file))} className='ai-style-4 fs-14 m-0'/>},
                { className:'p-3',flex: 1, row: [code_layout('JS', getJs()), { size: 3 }, code_layout('CSS', getCss())] },
                
            ]
        }
    }
    function isThereError(){
        if(!model.className){return 'please set className'}
    }
    function code_layout(type, code) {
        let error = isThereError();
        return {
            size: 72, className: 'fs-18 br-6 m-0',
            style: { background: !!error?'#ddd':'dodgerblue', color: '#fff', padding: 6 },
            column: [
                { html: 'COPY', className:'align-h' }, { html: type, className:'align-h' },
                {
                    flex: 1, className:'align-vh', html: <Icon path={mdiContentCopy} size={1.8} />,
                    onClick: () => {
                        if(error){alert(error); return}
                        window.navigator.clipboard.writeText(code);
                        popup.addSnakebar({ type: 'success', time: 2, rtl: true, style: { opacity: 0.5 }, text: `${type} codes is copied in clipboard` })
                    }
                }
            ]
        }
    }
    function form_layout() {
        return {
            flex: 1, style: { direction: 'ltr' },
            html: (
                <AIOInput
                    type='form'
                    onChange={(model) => setModel(model)}
                    value={{ ...model }}
                    inputs={{
                        column: [
                            {
                                row: [
                                    { input: { type: 'number' }, label: 'Count', field: 'value.count' },
                                    { input: { type: 'number' }, label: 'Size', field: 'value.size' },
                                    { input: { type: 'number' }, label: 'Container Width', field: 'value.containerSize' },
                                    { input: { type: 'number' }, label: 'Offset', field: 'value.offset' },
                                    { input: { type: 'number' }, label: 'Loop Delay', field: 'value.loopDelay' },

                                ]
                            },
                            {
                                row: [
                                    { input: { type: 'number' }, label: 'Duration', field: 'value.duration' },
                                    { input: { type: 'checkbox', text: 'Border' }, label: 'Border', field: 'value.border' },
                                    { input: { type: 'checkbox', text: 'Loop' }, label: 'Loop', field: 'value.loop' },
                                    { input: { type: 'checkbox', text: 'RTL' }, label: 'RTL', field: 'value.rtl' },
                                    { input: { type: 'text',filter:[' ', '.','_','1','2','3','4','5','6','7','8','9','0'] }, label: 'ClassName', field: 'value.className' },

                                ]
                            },
                            {
                                row: [
                                    { html: 'sizes', className:'align-v' },
                                    {
                                        flex:1,
                                        row: [
                                            {
                                                flex:1,className:'ofx-auto',
                                                row: new Array(model.count).fill(0).map((s, i) => {
                                                    let active = model.activeSize === i;
                                                    return {
                                                        style: { border: '1px solid #ddd' },
                                                        className: 'p-3 br-6',
                                                        column: [
                                                            {
                                                                style: { color: active ? 'dodgerblue' : '#ddd' },
                                                                html: <Icon path={active ? mdiEye : mdiEyeOff} size={.8} />, className:'align-vh',
                                                                onClick: () => setModel({ ...model, activeSize: model.activeSize === i ? false : i })
                                                            },
                                                            { input: { type: 'number', style: { width: 60 } }, field: `value.sizes[${i}]` }
                                                        ]
                                                    }
                                                })
                                            }
                                        ]
                                    }
                                ]
                            }

                        ]
                    }}
                />
            )
        }
    }
    function getBorder(index) {
        if (model.activeSize === index) { return `1px solid red` }
        if (model.border) { return `1px solid #dddddd` }
    }
    return (
        <>
            <RVD
                rootNode={{
                    className: 'fullscreen',
                    column: [
                        {
                            style: { border: '3px solid dodgerblue' },
                            className: 'br-12 m-12 m-b-0',
                            row: [
                                form_layout(),
                                codes_layout()
                            ]
                        },
                        {
                            style: { border: '3px solid dodgerblue', background: 'dodgerblue', direction: model.rtl ? 'rtl' : 'ltr' },
                            className: 'br-12 m-12 p-12 align-vh flex-1',
                            html: (
                                <div className={model.className} id='doc-msfloading1-container' style={{ width: model.containerSize }}>
                                    {new Array(model.count).fill(0).map((o, i) => {
                                        let width = model.sizes[i]
                                        return (
                                            <img src={file} className={`${model.className}item`} style={{ width, border: getBorder(i) }} />
                                        )
                                    })}
                                </div>
                            )
                        }
                    ]
                }}
            />
            {popup.render()}
        </>
    )
}
