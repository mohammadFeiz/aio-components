import React,{useState} from 'react';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from './../../npm/aio-input/aio-input';
import AIOPopup from './../../npm/aio-popup/aio-popup';
import {Icon} from '@mdi/react';
import { mdiContentCopy, mdiEye,mdiEyeOff } from '@mdi/js';
import './index.css';
import $ from 'jquery';
import file from './image.png'
export default function DOC_MSFLoading1({goToHome}) {
    let [popup] = useState(new AIOPopup())
    let [model,setModel] = useState({
        count:9,
        rtl:true,
        duration:1,
        loop:false,
        offset:4,
        size:36,
        loopDelay:0.7,
        className:'bmloading',
        sizes:[20, 16, 16, 16, 16, 16, 16, 16, 16],
        border:true,
        containerSize:300,
        activeSize:false
    })
    function getCss() {
        let {count, duration, loop, offset, size, className, loopDelay, sizes, border} = model;
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
    ${border ? `border:1px solid ${model.activeSize === i?'red':'#00000030'};` : ''}
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
        let {count, className, sizes,containerSize} = model;
        let str = `
import lodingsrc from './image.png';
export default function Loading(){
    return (
        <div className="${className}" style={{display:"flex",width:${containerSize}}}>`
for(let i = 0; i < count; i++){
    str+=(`
            <img src={loadingsrc} className="bmloadingitem" style={{width: ${sizes[i]}}}/>`)
}
        str += `
        </div>`
        str += `
    )` 
        str += `
}`      
        return str
    }
    function code_layout(){
        let css = getCss()
        let js = getJs();
        return {
            size:240,
            style:{direction:'ltr',border:'1px solid #ddd'},
            row:[
                {flex:1,html:(<pre className='of-auto w-100'>{css}</pre>)},
                {
                    style:{background:'dodgerblue',color:'#fff',padding:6},
                    align:'vh',html:<Icon path={mdiContentCopy} size={2}/>,
                    onClick:()=>{
                        window.navigator.clipboard.writeText(css);
                        popup.addSnakebar({
                            type:'success',time:2,rtl:true,style:{opacity:0.5},
                            text:'کد های سی اس اس در کلیپ بورد ذخیره شد'
                        })
                    }
                },
                {flex:1,html:(<pre className='of-auto w-100 fs-10'>{js}</pre>)},
                {
                    style:{background:'dodgerblue',color:'#fff',padding:6},
                    align:'vh',html:<Icon path={mdiContentCopy} size={2}/>,
                    onClick:()=>{
                        window.navigator.clipboard.writeText(js);
                        popup.addSnakebar({
                            type:'success',time:2,rtl:true,style:{opacity:0.5},
                            text:'کد های جاوا اسکریپت در کلیپ بورد ذخیره شد'
                        })
                    }
                }
            ]
        }       
    }
    function changeSizes(n){
        let newSizes = model.sizes.map((o)=>o + n)
        setModel({...model,sizes:newSizes})
    }
    function form_layout(){
        return {
            style:{direction:'ltr'},size:240,
            html:(
                <AIOInput
                    type='form'
                    onChange={(model)=>setModel(model)}
                    value={{...model}}
                    inputs={{
                        props:{gap:12},
                        column:[
                            {
                                row:[
                                    {input:{type:'number'},label:'Count',field:'value.count'},
                                    {input:{type:'number'},label:'Size',field:'value.size'},
                                    {input:{type:'number'},label:'Container Width',field:'value.containerSize'},
                                    {input:{type:'number'},label:'Offset',field:'value.offset'},
                                    {input:{type:'number'},label:'Loop Delay',field:'value.loopDelay'},
                                    
                                ]
                            },
                            {
                                row:[
                                    {input:{type:'number'},label:'Duration',field:'value.duration'},
                                    {input:{type:'checkbox',text:'Border'},label:'Border',field:'value.border'},
                                    {input:{type:'checkbox',text:'Loop'},label:'Loop',field:'value.loop'},
                                    {input:{type:'checkbox',text:'RTL'},label:'RTL',field:'value.rtl'},
                                    {input:{type:'text'},label:'ClassName',field:'value.className'},
                                    
                                ]
                            },
                            {
                                row:[
                                    {html:'sizes',align:'v'},
                                    {
                                        row:[
                                            {
                                                row:model.sizes.map((s,i)=>{
                                                    let active = model.activeSize === i;
                                                    return {
                                                        column:[
                                                            {
                                                                style:{color:active?'dodgerblue':'#ddd'},
                                                                html:<Icon path={active?mdiEye:mdiEyeOff} size={.8}/>,align:'vh',
                                                                onClick:()=>setModel({...model,activeSize:i})
                                                            },
                                                            {input:{type:'number',style:{width:60}},field:`value.sizes[${i}]`}
                                                        ]
                                                    }
                                                })
                                            },
                                            {
                                                align:'vh',size:48,style:{border:'1px solid #ddd',background:'dodgerblue',color:'#fff',border:'none',borderRadius:12},
                                                html:'-1',onClick:()=>changeSizes(-1)
                                            },
                                            {
                                                align:'vh',size:48,style:{border:'1px solid #ddd',background:'dodgerblue',color:'#fff',border:'none',borderRadius:12},
                                                html:'+1',onClick:()=>changeSizes(1)
                                            },

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
    return (
        <>
            <RVD
            layout={{
                className:'fullscreen',
                column:[
                    form_layout(),
                    code_layout(),
                    {
                        style:{direction:model.rtl?'rtl':'ltr'},
                        flex:1,align:'vh',
                        html:(
                            <div className={model.className} style={{display:'flex',width:model.containerSize,border:'1px solid'}}>
                                {new Array(model.count).fill(0).map((o, i) => {
                                    let width = model.sizes[i]
                                    return (
                                        <img src={file} className={`${model.className}item`} style={{ width }} />
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
