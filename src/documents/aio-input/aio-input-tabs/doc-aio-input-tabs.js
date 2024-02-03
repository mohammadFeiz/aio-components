import React, { Component, useState } from 'react';
import DOC from '../../../resuse-components/doc';
import AIODoc from '../../../npm/aio-documentation/aio-documentation';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom';
import AIOStorage from './../../../npm/aio-storage/aio-storage';
import AIOInput from '../../../npm/aio-input/aio-input';
import './doc-aio-input-tabs.css';
import {Icon} from '@mdi/react';
import { mdiAccount } from '@mdi/js';
export default class DOC_AIOInput_Tabs extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='apiKeys'
                nav={{
                    items:[
                        { text: 'Basic', id: 'basic', render: () => <Basic/> },
                        //{ text: 'before', id: 'before', render: () => <Before/> }
                    ]
                }}
            />
        )
    }
}
function Base({props = {}}){
    let [tab,setTab] = useState('1')
    return (
        <AIOInput
            type='tabs' value={tab} onChange={(tab)=>setTab(tab)}
            options={[
                {text:'my option 1',value:'1'},
                {text:'my option 2',value:'2'},
                {text:'my option 3',value:'3'},
                {text:'my option 4',value:'4'},
                {text:'my option 5',value:'5'}
            ]}
            {...props}
        />
    )
}
function Code({id,text}){
    let [show,setShow] = useState(AIOStorage('docaioinputtabs').load({name:'showCode',def:{}}))
    function changeShow(){
        let all = AIOStorage('docaioinputtabs').load({name:'showCode',def:{}})
        let newAll = {...show,[id]:!}
        AIOStorage('docaioinputtabs').save({name:'showCode',value:{}})
    }
    function getCode(){
        return AIODoc().Code(`
import React,{useState} from 'react';
import AIOInput from 'aio-input';
export default function App(){
    let [tab,setTab] = useState('1')
    return (
        <AIOInput
            type='tabs'
            value={tab}
            onChange={(tab)=>setTab(tab)}
            options={[
                {text:'my option 1',value:'1'},
                {text:'my option 2',value:'2'},
                {text:'my option 3',value:'3'},
                {text:'my option 4',value:'4'},
                {text:'my option 5',value:'5'}
            ]}
            ${text?text:''}
        />
    )
}
    `)
    }
    function code_layout(){
        if(!show){return false}
        return {html:getCode()}
    }
    function button_layout(){
        return {
            html:show?'Hide Code':'Show Code',style:{fontSize:10,color:'blue'},
            onClick:()=>setShow(!show)
        }
    }
    return (
        <RVD
            layout={{
                column:[
                    code_layout(),
                    button_layout()
                ]
            }}
        />
    )
}
function Basic(){
    function preview() {
        return (
            <div className='example'>
                <Base/>
                {Code()}
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    return (<Example preview={() => preview()}/>)
}
// function Before(){
//     function preview() {
//         return (
//             <div className='example'>
//                 <Base props={{
//                     before:<Icon path={mdiAccount} size={1}/>
//                 }}/>
//                 {Code(`
//                 before:<Icon path={mdiAccount} size={1}/>
//                 `)}
//                 <div style={{marginTop:24}} className='aio-component-splitter'></div>
//             </div>
//         )
//     }
//     return (<Example preview={() => preview()}/>)
// }

class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'preview',
            tabs: [
                { text: 'Preview', value: 'preview' },
                { text: 'Code', value: 'code' }
            ]
        }
    }
    body_layout() {
        let { tab } = this.state;
        return tab === 'preview' ? this.preview_layout() : this.code_layout()
    }
    preview_layout() {
        let { preview } = this.props;
        return {
            flex: 1,
            className: 'p-12',
            html: preview()
        }
    }
    code_layout() {
        let { code, rtl = false } = this.props;
        return {
            flex: 1,
            html: (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'auto' }}>
                    <pre style={{ padding: 12 }}>{AIODoc().Code(code())}</pre>
                </div>
            )
        }
    }
    toolbar_layout() {
        let { toolbar } = this.props;
        if (!toolbar) { return false }
        return {
            html: toolbar()
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    column: [
                        this.toolbar_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}




