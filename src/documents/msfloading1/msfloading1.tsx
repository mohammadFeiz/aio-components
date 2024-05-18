import React, { useState } from 'react';
import RVD from '../../npm/react-virtual-dom/index.tsx';
import AIOInput from '../../npm/aio-input/index.tsx';
import AIOPopup from '../../npm/aio-popup/index.tsx';
import { FileToBase64 } from '../../npm/aio-utils';
import { Icon } from '@mdi/react';
import { mdiContentCopy, mdiEye, mdiEyeOff } from '@mdi/js';
import './index.css';
import $ from 'jquery';
import { I_RVD_node } from '../../npm/react-virtual-dom/index.tsx';
type I_MSFL = {
    count: number,
    rtl: boolean,
    duration: number,
    loop: boolean,
    offset: number,
    size: number,
    loopDelay: number,
    className: string,
    sizes: number[],
    border: boolean,
    containerSize: number,
    activeSize: false | number,
    width:number
}
export default function DOC_MSFLoading1(props:any) {
    let { goToHome } = props;
    let [popup] = useState(new AIOPopup())
    let [file,setFile] = useState();
    let [model, setModel] = useState<I_MSFL>({
        count: 9,
        rtl: true,
        duration: 1,
        loop: false,
        offset: 4,
        size: 36,
        loopDelay: 0.7,
        className: 'msfloading1',
        sizes: [20, 36, 52, 68, 84, 100, 116, 132, 148],
        border: true,
        containerSize: 300,
        width:148,
        activeSize: false
    })
    function getCss() {
        let { count, duration, loop, offset, size, className, loopDelay, sizes } = model;
        let str = '';
        let start = 0;
        let delay = loopDelay / (duration + loopDelay) * 100
        let step = (100 - offset - delay) / count;
        for (let i = 0; i < count; i++) {
            let unitSize = sizes[i];
            str += `
.${className} .${className}item:nth-child(${i + 1}) {
    animation-name: ${className}${i + 1};
    animation-duration:${duration + loopDelay}s;
    height:${size}px;
    object-fit:cover;
    object-position:top 0px ${model.rtl?'right':'left'} ${-unitSize}px;
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
    function codes_node():I_RVD_node {
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
    function code_layout(type:string, code:string) {
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
                        popup.addSnackebar({ type: 'success', time: 2, attrs: {style:{ opacity: 0.5 }}, text: `${type} codes is copied in clipboard` })
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
                    node={{
                        dir:'v',
                        childs: [
                            {
                                dir:'h',
                                childs: [
                                    { input: { type: 'number' }, label: 'Count', field: 'value.count' },
                                    { input: { type: 'number' }, label: 'Size', field: 'value.size' },
                                    { input: { type: 'number' }, label: 'Container Width', field: 'value.containerSize' },
                                    { input: { type: 'number' }, label: 'Offset', field: 'value.offset' },
                                    { input: { type: 'number' }, label: 'Loop Delay', field: 'value.loopDelay' },

                                ]
                            },
                            {
                                dir:'h',
                                childs: [
                                    { size:240,input: { type: 'slider',start:0.1,end:4,step:0.1,size:28 }, label: 'Duration', field: 'value.duration' },
                                    { input: { type: 'checkbox', text: 'Border' }, label: 'Border', field: 'value.border' },
                                    { input: { type: 'checkbox', text: 'Loop' }, label: 'Loop', field: 'value.loop' },
                                    { input: { type: 'checkbox', text: 'RTL' }, label: 'RTL', field: 'value.rtl' },
                                    { input: { type: 'text',filter:[' ', '.','_','1','2','3','4','5','6','7','8','9','0'] }, label: 'ClassName', field: 'value.className' },
                                    { input: { type: 'number',min:model.sizes[model.sizes.length - 1]}, label: 'Width', field: 'value.width' },

                                ]
                            },
                            {
                                dir:'h',
                                childs: [
                                    { html: 'sizes', className:'align-v' },
                                    {
                                        flex:1,
                                        dir:'h',
                                        childs: [
                                            {
                                                flex:1,className:'ofx-auto',
                                                dir:'h',
                                                childs: new Array(model.count).fill(0).map((s, i) => {
                                                    let active = model.activeSize === i;
                                                    return {
                                                        style: { border: '1px solid #ddd' },
                                                        className: 'p-3 br-6',
                                                        dir:'v',
                                                        childs: [
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
                            },
                            {
                                dir:'h',
                                childs: [
                                    { html: 'sizes', className:'align-v' },
                                    {
                                        flex:1,
                                        input:{
                                            type:'slider',
                                            reverse:!!model.rtl,
                                            multiple:true,
                                            start:0,
                                            end:model.width
                                        },
                                        field:'value.sizes'
                                    }
                                ]
                            }

                        ]
                    }}
                />
            )
        }
    }
    function getBorder(index:number) {
        if (model.activeSize === index) { return `1px solid red` }
        if (model.border) { return `1px solid #dddddd` }
    }
    console.log(model)
    return (
        <>
            <RVD
                rootNode={{
                    className: 'fullscreen',
                    column: [
                        {style: { border: '3px solid dodgerblue' },className: 'br-12 m-12 m-b-0',row: [form_layout(),codes_node()]},
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
