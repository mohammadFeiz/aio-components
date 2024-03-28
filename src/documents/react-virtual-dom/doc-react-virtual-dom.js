import React, { Component, Fragment, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import AIODoc from '../../npm/aio-documentation/aio-documentation.js';
import AIOPopup from '../../npm/aio-popup/index.js';
import RVD,{animate,reOrder} from '../../npm/react-virtual-dom/index.tsx';
import AIOInput from './../../npm/aio-input/aio-input.js';
import AIOStorage from './../../npm/aio-storage/aio-storage.js'
import { Icon } from '@mdi/react';
import { mdiAccount, mdiAccountGroup, mdiArchive, mdiBookEducation, mdiCamera, mdiCarSettings, mdiClose, mdiCloudUpload, mdiDotsHorizontal, mdiFileDocument, mdiListBox, mdiMicrophone, mdiMonitor, mdiShare, mdiStar } from '@mdi/js';
import './index.css';
import $ from 'jquery';
export default function DOC_AIOShop(props) {
    return (
        <DOC
            {...props}
            nav={{
                nested: true,
                items: [
                    { text: 'html node object', id: 'hno', render: () => <Node /> },
                    { text: 'align', id: 'align', render: () => <Align /> },
                    { text: 'spacing', id: 'spacing', render: () => <Spacing /> },
                    { text: 'size', id: 'size', render: () => <Size /> },
                    { text: 'flex', id: 'flex', render: () => <Flex /> },
                    { text: 'sizing', id: 'sizing', render: () => <Sizing /> },
                    {
                        text: 'layout', id: 'layout',
                        items: [
                            { text: 'example 1', id: 'example1', render: () => <Layout1 /> },
                            { text: 'example 2', id: 'example2', render: () => <Layout2 /> },
                            { text: 'example 3', id: 'example3', render: () => <Layout3 /> },
                            { text: 'example 6', id: 'example6', render: () => <Layout6 /> }
                        ]
                    },
                    { text: 'loading', id: 'loading', render: () => <Loading /> },
                    { text: 'gap', id: 'gap', render: () => <Gap /> },
                    { text: 'Css Classes', id: 'css classes', render: () => <CssClasses /> },
                    { text: 'nodeClass', id: 'node class', render: () => <NodeClass /> },
                    { text: 'animate', id: 'animate', render: () => <Animate /> },
                    { text: 'resize', id: 'resize', render: () => <Resize /> },
                    { text: 'state setState', id: 'statesetstate', render: () => <StateSetState /> },
                    { text: 'reOrder', id: 'reOrder', render: () => <ReOrder /> },
                    { text: 'longTouch', id: 'longTouch', render: () => <LongTouch /> },
                    { text: 'Style Generator', id: 'stylegenerator', render: () => <StyleGenerator /> },
                    
                ]
            }}
        />
    )
}
function Part(p) {
    let { content, code,title } = p;
    if (!content) { return null }
    if(typeof content === 'function'){content = content()}
    return (
        <>
            {title && <h3>{title}</h3>}
            <div>{content}</div>
            {AIODoc().Code(code)}
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
        </>
    )
}
function Node() {
    
    return (
        <div className='example'>
            <Part
                title='html'
                content={()=>{
                    let node_A = {html:'A',style:{border:'1px solid'},className:'p-12'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',style:{border:'1px solid'},className:'p-12'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='row'
                content={()=>{
                    let node_A = {html:'A',style:{border:'1px solid'},className:'p-12'};
                    let node_A_row = {
                        className:'gap-12',
                        row:[node_A,node_A,node_A,node_A]
                    }
                    return <RVD rootNode={node_A_row}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',style:{border:'1px solid'},className:'p-12'};
    let node_A_row = {
        className:'gap-12',
        row:[node_A,node_A,node_A,node_A]
    }
    return <RVD rootNode={node_A_row}/>
}
                `}
            />
            <Part
                title='column'
                content={()=>{
                    let node_A = {html:'A',style:{border:'1px solid'},className:'p-12'};
                    let node_A_row = {
                        className:'gap-12',
                        row:[node_A,node_A,node_A,node_A]
                    }
                    let node_A_table = {
                        className:'gap-12',
                        column:[node_A_row,node_A_row,node_A_row,node_A_row]
                    }
                    return <RVD rootNode={node_A_table}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',style:{border:'1px solid'},className:'p-12'};
    let node_A_row = {
        className:'gap-12',
        row:[node_A,node_A,node_A,node_A]
    }
    let node_A_table = {
        className:'gap-12',
        column:[node_A_row,node_A_row,node_A_row,node_A_row]
    }
    return <RVD rootNode={node_A_table}/>
}
                `}
            />
            <Part
                content={()=>{
                    return (
                        <RVD
                            rootNode={{
                                className:'h-96 brd-c16',
                                row:[
                                    {
                                        html:'A',className:'bg12 flex-1 align-vh c32'
                                    },
                                    {
                                        flex:1,
                                        column:[
                                            {html:'A',className:'bg16 flex-1 align-vh'},
                                            {html:'A',className:'bg20 flex-1 align-vh'}
                                        ]
                                    },
                                    {
                                        className:'flex-1',
                                        column:[
                                            {html:'A',className:'bg24 flex-1 align-vh'},
                                            {html:'A',className:'bg28 flex-1 align-vh'},
                                            {html:'A',className:'bg32 flex-1 align-vh'},
                                        ]
                                    }
                                ]
                            }}
                        />
                    )
                }}
                code={`
function Layout(){
    return (
        <RVD
            rootNode={{
                className:'h-96 brd-c16',
                row:[
                    {
                        html:'A',className:'bg12 flex-1 align-vh c32'
                    },
                    {
                        flex:1,
                        column:[
                            {html:'A',className:'bg16 flex-1 align-vh'},
                            {html:'A',className:'bg20 flex-1 align-vh'}
                        ]
                    },
                    {
                        className:'flex-1',
                        column:[
                            {html:'A',className:'bg24 flex-1 align-vh'},
                            {html:'A',className:'bg28 flex-1 align-vh'},
                            {html:'A',className:'bg32 flex-1 align-vh'},
                        ]
                    }
                ]
            }}
        />
    )
}
                `}
            />
        </div>
    )
}
function Align() { 
    return (
        <div className='example'>
            <Part
                title='without align'
                content={()=>{
                    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-v as className'
                content={()=>{
                    let node_A = {html:'A',className:'brd-c12 w-72 h-72 align-v'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72 align-v'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-v as property'
                content={()=>{
                    let node_A = {html:'A',align:'v',className:'brd-c12 w-72 h-72'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',align:'v',className:'brd-c12 w-72 h-72'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-h as className'
                content={()=>{
                    let node_A = {html:'A',className:'brd-c12 w-72 h-72 align-h'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72 align-h'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-h as property'
                content={()=>{
                    let node_A = {html:'A',align:'h',className:'brd-c12 w-72 h-72'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',align:'h',className:'brd-c12 w-72 h-72'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-vh as className'
                content={()=>{
                    let node_A = {html:'A',className:'brd-c12 w-72 h-72 align-vh'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72 align-vh'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-vh as property'
                content={()=>{
                    let node_A = {html:'A',align:'vh',className:'brd-c12 w-72 h-72'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72 align-vh'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-v in column'
                content={()=>{
                    let node_A = {html:'A',className:'brd-c12 w-72 h-72 align-vh'};
                    return (
                        <RVD 
                            rootNode={{
                                className:'h-300 w-fit brd-c12 align-v p-12',
                                column:[node_A,node_A]
                            }}
                        />
                    )
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72 align-vh'};
    return (
        <RVD 
            rootNode={{
                className:'h-300 w-fit brd-c12 align-v p-12',
                column:[node_A,node_A]
            }}
        />
    )
}
                `}
            />
            <Part
                title='align-h in column'
                content={()=>{
                    let node_A = {html:'A',className:'brd-c12 w-72 h-72 align-vh'};
                    return (
                        <RVD 
                            rootNode={{
                                className:'w-300 h-fit brd-c12 align-h p-12',
                                row:[node_A,node_A]
                            }}
                        />
                    )
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72 align-vh'};
    return (
        <RVD 
            rootNode={{
                className:'w-300 h-fit brd-c12 align-h p-12',
                row:[node_A,node_A]
            }}
        />
    )
}
                `}
            />
        </div>
    )
}
function Spacing() { 
    return (
        <div className='example'>
            <Part
                title='spacing by nodes'
                content={()=>{
                    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
                    return (
                        <RVD 
                            rootNode={{
                                className:'w-300 brd-c12 p-12',
                                row:[
                                    node_A,
                                    {className:'flex-1'},
                                    node_A
                                ]
                            }}
                        />
                    )
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
    return (
        <RVD 
            rootNode={{
                className:'w-300 brd-c12 p-12',
                row:[
                    node_A,
                    {className:'flex-1'},
                    node_A
                ]
            }}
        />
    )
}
                `}
            />
            <Part
                title='spacing by nodes'
                content={()=>{
                    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
                    return (
                        <RVD 
                            rootNode={{
                                className:'brd-c12 p-12',
                                row:[
                                    node_A,
                                    {className:'flex-1'},
                                    node_A,
                                    {className:'flex-3'},
                                    node_A
                                ]
                            }}
                        />
                    )
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
    return (
        <RVD 
            rootNode={{
                className:'brd-c12 p-12',
                row:[
                    node_A,
                    {className:'flex-1'},
                    node_A,
                    {className:'flex-3'},
                    node_A
                ]
            }}
        />
    )
}
                `}
            />
            <Part
                title='spacing by nodes'
                content={()=>{
                    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
                    return (
                        <RVD 
                            rootNode={{
                                className:'brd-c12 p-12',
                                row:[
                                    node_A,
                                    {size:60,html:'size:60',className:'align-vh op-20'},
                                    node_A,
                                    {html:'flex:1',className:'flex-1 align-vh op-20'},
                                    node_A,
                                    {html:'flex:3',className:'flex-3 align-vh op-20'},
                                    node_A,
                                ]
                            }}
                        />
                    )
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
    return (
        <RVD 
            rootNode={{
                className:'brd-c12 p-12',
                row:[
                    node_A,
                    {size:60},
                    node_A,
                    {className:'flex-1'},
                    node_A,
                    {className:'flex-3'},
                    node_A,
                ]
            }}
        />
    )
}
                `}
            />
            <Part
                title='spacing by gap className'
                content={()=>{
                    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
                    return (
                        <RVD 
                            rootNode={{
                                className:'brd-c12 p-12 gap-24',
                                row:[node_A,node_A,node_A,node_A]
                            }}
                        />
                    )
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
    return (
        <RVD 
            rootNode={{
                className:'brd-c12 p-12 gap-24',
                row:[node_A,node_A,node_A,node_A]
            }}
        />
    )
}
                `}
            />
            <Part
                title='spacing by gap property'
                content={()=>{
                    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
                    return (
                        <RVD 
                            rootNode={{
                                className:'brd-c12 p-12',
                                gap:{flex:1},
                                row:[node_A,node_A,node_A,node_A]
                            }}
                        />
                    )
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c12 w-72 h-72'};
    return (
        <RVD 
            rootNode={{
                className:'brd-c12 p-12',
                gap:{flex:1},
                row:[node_A,node_A,node_A,node_A]
            }}
        />
    )
}
                `}
            />
            
        </div>
    )
}

function Size() { 
    return (
        <div className='example'>
            <Part
                title='without align'
                content={()=>{
                    let row = {
                        row:[
                            {html:'A',className:'brd-c16',size:24},
                            {html:'A',className:'brd-c16',size:48},
                            {html:'A',className:'brd-c16',size:60}
                        ]
                    }
                    return <RVD rootNode={row}/>
                }}
                code={`
function Layout(){
    let row = {
        row:[
            {html:'A',className:'brd-c16',size:24},
            {html:'A',className:'brd-c16',size:48},
            {html:'A',className:'brd-c16',size:60}
        ]
    }
    return <RVD rootNode={row}/>
}
                `}
            />
            <Part
                title='without align'
                content={()=>{
                    let table = {
                        column:[
                            {
                                size:24,
                                row:[
                                    {html:'A',className:'brd-c16',size:24},
                                    {html:'A',className:'brd-c16',size:48},
                                    {html:'A',className:'brd-c16',size:60}
                                ]
                            },
                            {
                                size:48,
                                row:[
                                    {html:'A',className:'brd-c16',size:24},
                                    {html:'A',className:'brd-c16',size:48},
                                    {html:'A',className:'brd-c16',size:60}
                                ]
                            },
                            {
                                size:60,
                                row:[
                                    {html:'A',className:'brd-c16',size:24},
                                    {html:'A',className:'brd-c16',size:48},
                                    {html:'A',className:'brd-c16',size:60}
                                ]
                            }   
                        ]
                    }
                    return <RVD rootNode={table}/>
                }}
                code={`
function Layout(){
    let table = {
        column:[
            {
                size:24,
                row:[
                    {html:'A',className:'brd-c16',size:24},
                    {html:'A',className:'brd-c16',size:48},
                    {html:'A',className:'brd-c16',size:60}
                ]
            },
            {
                size:48,
                row:[
                    {html:'A',className:'brd-c16',size:24},
                    {html:'A',className:'brd-c16',size:48},
                    {html:'A',className:'brd-c16',size:60}
                ]
            },
            {
                size:60,
                row:[
                    {html:'A',className:'brd-c16',size:24},
                    {html:'A',className:'brd-c16',size:48},
                    {html:'A',className:'brd-c16',size:60}
                ]
            }   
        ]
    }
    return <RVD rootNode={table}/>
}
                `}
            />
        </div>
    )
}
function Flex() { 
    return (
        <div className='example'>
            <Part
                title='without align'
                content={()=>{
                    let table = {
                        className:'w-120 h-120',
                        column:[
                            {
                                className:'flex-1',
                                row:[
                                    {html:'A',className:'brd-c16 flex-1'},
                                    {html:'A',className:'brd-c16 flex-2'},
                                    {html:'A',className:'brd-c16 flex-3'}
                                ]
                            },
                            {
                                className:'flex-2',
                                row:[
                                    {html:'A',className:'brd-c16 flex-1'},
                                    {html:'A',className:'brd-c16 flex-2'},
                                    {html:'A',className:'brd-c16 flex-3'}
                                ]
                            },
                            {
                                className:'flex-3',
                                row:[
                                    {html:'A',className:'brd-c16 flex-1'},
                                    {html:'A',className:'brd-c16 flex-2'},
                                    {html:'A',className:'brd-c16 flex-3'}
                                ]
                            }
                        ]
                    }
                    return <RVD rootNode={table}/>
                }}
                code={`
function Layout(){
    let table = {
        className:'w-120 h-120',
        column:[
            {
                className:'flex-1',
                row:[
                    {html:'A',className:'brd-c16 flex-1'},
                    {html:'A',className:'brd-c16 flex-2'},
                    {html:'A',className:'brd-c16 flex-3'}
                ]
            },
            {
                className:'flex-2',
                row:[
                    {html:'A',className:'brd-c16 flex-1'},
                    {html:'A',className:'brd-c16 flex-2'},
                    {html:'A',className:'brd-c16 flex-3'}
                ]
            },
            {
                className:'flex-3',
                row:[
                    {html:'A',className:'brd-c16 flex-1'},
                    {html:'A',className:'brd-c16 flex-2'},
                    {html:'A',className:'brd-c16 flex-3'}
                ]
            }
        ]
    }
    return <RVD rootNode={table}/>
}
                `}
            />
        </div>
    )
}
function Layout1() {
    function files_layout(files){
        return {
            column:[
                label_layout('Files'),
                {className: 'gap-12',row: files.map((o) => card_layout(o))}
            ],
        }
    }
    function label_layout(text){
        return {html:text,className:'bold fs-14',style:{color:'#174484'}}
    }
    function card_layout({text,path,color,filesLength}){
        return {
            style: { background: '#fff', color: '#666' },
            className: 'p-6 fs-12 br-8 w-84',
            column: [
                {
                    html:<Icon path={path} size={0.8}/>,
                    className:'w-24 h-24 br-100 m-b-6 align-vh',
                    style:{ background: '#fff', color }
                },
                { 
                    html: text,
                    className:'bold' 
                },
                { 
                    html: filesLength + ' files', 
                    style: { fontSize: '85%' }, 
                    className: 'op-80' 
                }
            ]
        }
    }
    let files = [
        { path: mdiListBox, text: 'Work', length: 620, color: '#6663fe',outline:true },
        { path: mdiAccount, text: 'Personal', length: 115, color: '#00a0b6',outline:true },
        { path: mdiBookEducation, text: 'School', length: 65, color: '#e06c9f',outline:true },
        { path: mdiArchive, text: 'Archive', length: 21, color: '#266fd5',outline:true },
    ]
    return (
        <div className='example' style={{background:'#f2f2f2'}}>
            <Part
                title='Generate a card width react virtual dom'
                content={(
                    <RVD 
                        rootNode={{
                            style: { background: '#fff', color: '#666' },
                            className: 'p-6 fs-12 br-8 w-84',
                            column: [
                                {
                                    html:<Icon path={mdiCamera} size={0.8}/>,
                                    className:'w-24 h-24 br-100 m-b-6 align-vh',
                                    style:{ background: '#fff', color:'pink' }
                                },
                                { 
                                    html: 'My Text',
                                    className:'bold' 
                                },
                                { 
                                    html: '10 files', 
                                    style: { fontSize: '85%' }, 
                                    className: 'op-80' 
                                }
                            ]
                        }} 
                    />
                )}
                code={`
function Layout(){
    return (
        <RVD 
            rootNode={{
                style: { background: '#fff', color: '#666' },
                className: 'p-6 fs-12 br-8 w-84', //{padding:6px; font-size:12px; border-radius:8px; width:84px;}
                column: [
                    {
                        html:<Icon path={mdiCamera} size={0.8}/>,
                        className:'w-24 h-24 br-100 m-b-6 align-vh', //{width:24px; height:24px; border-radius:100%; margin-bottom:6px; ...}
                        style:{ background: '#fff', color:'pink' }
                    },
                    { 
                        html: 'My Text',
                        className:'bold' 
                    },
                    { 
                        html: '10 files', 
                        style: { fontSize: '85%' }, 
                        className: 'op-80' //{opacity: 0.8;}
                    }
                ]
            }} 
        />
    )
}
                `}
            />
            <Part
                title='Creating a function (card_layout) that produces this card'
                content={(
                    <RVD 
                        rootNode={card_layout({text:'My Text',path:mdiCamera,color:'pink',filesLength:10})} 
                    />
                )}
                code={`
function Layout(){
    function card_layout({text,path,color,filesLength}){
        return {
            style: { background: '#fff', color: '#666' },
            className: 'p-6 fs-12 br-8 w-84',
            column: [
                {
                    html:<Icon path={path} size={0.8}/>,
                    className:'w-24 h-24 br-100 m-b-6 align-vh',
                    style:{ background: '#fff', color }
                },
                { 
                    html: text,
                    className:'bold' 
                },
                { 
                    html: filesLength + ' files', 
                    style: { fontSize: '85%' }, 
                    className: 'op-80' 
                }
            ]
        }
    }
    return (
        <RVD 
            rootNode={card_layout({text:'My Text',path:mdiCamera,color:'pink',filesLength:10})} 
        />
    )
}
                `}
            />
            <Part
                title='generate files_layout'
                content={(
                    <RVD rootNode={files_layout(files)}/>
                )}
                code={`
function Layout(){
    function files_layout(files){
        return {
            column:[
                label_layout('Files'),
                {className: 'gap-12',row: files.map((o) => card_layout(o))}
            ],
        }
    }
    function label_layout(text){
        return {html:text,className:'bold fs-14',style:{color:'#174484'}}
    }
    function card_layout({text,path,color,filesLength}){
        return {
            style: { background: '#fff', color: '#666' },
            className: 'p-6 fs-12 br-8 w-84',
            column: [
                {
                    html:<Icon path={path} size={0.8}/>,
                    className:'w-24 h-24 br-100 m-b-6 align-vh',
                    style:{ background: '#fff', color }
                },
                { 
                    html: text,
                    className:'bold' 
                },
                { 
                    html: filesLength + ' files', 
                    style: { fontSize: '85%' }, 
                    className: 'op-80' 
                }
            ]
        }
    }
    let files = [
        { path: mdiListBox, text: 'Work', length: 620, color: '#6663fe',outline:true },
        { path: mdiAccount, text: 'Personal', length: 115, color: '#00a0b6',outline:true },
        { path: mdiBookEducation, text: 'School', length: 65, color: '#e06c9f',outline:true },
        { path: mdiArchive, text: 'Archive', length: 21, color: '#266fd5',outline:true },
    ]
    return (
        <RVD rootNode={files_layout(files)}/>
    )
}
                `}
            />
        </div>
    )
}
function Layout2() {
    function recentFiles_layout(recentFiles){
        return {
            className:'gap-6',
            column:recentFiles.map((o)=>row_layout(o))
        }
    }
    function row_layout({path,text,format,size,color}){
        return {
            style:{background:'#fff'},className:'p-6 br-8 fs-12 gap-12 align-v',
            row:[
                icon_layout(path,{size:24,style:{color:'#fff',background:color}}),
                text_layout(text),
                format_layout(format),
                size_layout(size),
                icon_layout(mdiShare,{flex:1}),
                icon_layout(mdiDotsHorizontal,{flex:1}),
            ]
        }
    }
    function icon_layout(path,props){
        return {html:<Icon path={path} size={0.6}/>,className:'br-6 h-24 align-vh',...props}
    }
    function text_layout(text){
        return {html:text,size:200,className:'bold fs-14',style:{color:'#174484'}}
    }
    function format_layout(format){
        return {html:format + ' file',flex:1,className:'align-vh'}
    }
    function size_layout(size){
        return {html:size,flex:1,className:'align-vh'}
    }
    let recentFiles = [
        { path: mdiCamera, text: 'IMG_100000', format: 'PNG',size:'10 MB', color: '#6663fe' },
        { path: mdiFileDocument, text: 'Startup pitch', format: 'AVI',size:'23 MB', color: '#00a0b6' },
        { path: mdiMonitor, text: 'freestyle beat', format: 'MP3',size:'50 MB', color: '#e06c9f' },
        { path: mdiListBox, text: 'Work proposal', format: 'DOCx',size:'30 KB', color: '#266fd5' },
    ]
    return (
        <div className='example' style={{background:'#f2f2f2'}}>
            <Part
                content={(
                    <RVD
                        rootNode={{
                            style:{background:'#fff'},className:'p-6 br-8 fs-12 gap-12 align-v',
                            row:[
                                icon_layout(mdiCamera,{size:24,style:{color:'#fff',background:'pink'}}),
                                text_layout('IMG_100000'),
                                format_layout('PNG'),
                                size_layout('10 MB'),
                                icon_layout(mdiShare,{flex:1}),
                                icon_layout(mdiDotsHorizontal,{flex:1}),
                            ]
                        }}
                    />
                )}
                code={`
function Layout(){
    function icon_layout(path,props){
        return {html:<Icon path={path} size={0.6}/>,className:'br-6 h-24 align-vh',...props}
    }
    function text_layout(text){
        return {html:text,size:200,className:'bold fs-14',style:{color:'#174484'}}
    }
    function format_layout(format){
        return {html:format + ' file',flex:1,className:'align-vh'}
    }
    function size_layout(size){
        return {html:size,flex:1,className:'align-vh'}
    }
    return (
        <RVD
            rootNode={{
                style:{background:'#fff'},className:'p-6 br-8 fs-12 gap-12 align-v',
                row:[
                    icon_layout(mdiCamera,{size:24,style:{color:'#fff',background:'pink'}}),
                    text_layout('IMG_100000'),
                    format_layout('PNG'),
                    size_layout('10 MB'),
                    icon_layout(mdiShare,{flex:1}),
                    icon_layout(mdiDotsHorizontal,{flex:1}),
                ]
            }}
        />
    )
}
                `}
            />
            <Part
                content={(
                    <RVD
                        rootNode={recentFiles_layout(recentFiles)}
                    />
                )}
                code={`
function Layout(){
    ...
    function recentFiles_layout(recentFiles){
        return {
            className:'gap-6',
            column:recentFiles.map((o)=>row_layout(o))
        }
    }
    function row_layout({path,text,format,size,color}){
        return {
            style:{background:'#fff'},className:'p-6 br-8 fs-12 gap-12 align-v',
            row:[
                icon_layout(path,{size:24,style:{color:'#fff',background:color}}),
                text_layout(text),
                format_layout(format),
                size_layout(size),
                icon_layout(mdiShare,{flex:1}),
                icon_layout(mdiDotsHorizontal,{flex:1}),
            ]
        }
    }
    let recentFiles = [
        { path: mdiCamera, text: 'IMG_100000', format: 'PNG',size:'10 MB', color: '#6663fe' },
        { path: mdiFileDocument, text: 'Startup pitch', format: 'AVI',size:'23 MB', color: '#00a0b6' },
        { path: mdiMonitor, text: 'freestyle beat', format: 'MP3',size:'50 MB', color: '#e06c9f' },
        { path: mdiListBox, text: 'Work proposal', format: 'DOCx',size:'30 KB', color: '#266fd5' },
    ]
    return (<RVD rootNode={recentFiles_layout(recentFiles)} />)
}
                `}
            />
        </div>
    )
}
function Layout3() {
    function side_layout(sideItems){
        return {
            style: { background: 'rgb(10, 38, 116)', color: '#fff', width: 200 },
            column: [
                {size: 100, className: 'align-vh',html: <Icon path={mdiAccount} size={2} />},
                {column: sideItems.map((sideItem) => sideItem_layout(sideItem))}
            ],
        }
    }
    function sideItem_layout(sideItem){
        return {
            className: 'p-h-24 gap-12 fs-12 align-v', size: 36,
            row: [
                icon_layout(sideItem.path),
                { html: sideItem.text}
            ]
        }
    }
    function icon_layout(path){
        return {html:<Icon path={path} size={0.6}/>,className:'br-6 h-24 align-vh'}
    }
    let sideItems = [
        { path: mdiAccount, text: 'My Cloud' },
        { path: mdiAccountGroup, text: 'Shared Files' },
        { path: mdiStar, text: 'Favorites' },
        { path: mdiCloudUpload, text: 'Upload Files' },
        { path: mdiCarSettings, text: 'Settings' },
        { path: mdiCloudUpload, text: 'Upload Files' }
    ]
    return (
        <div className='example'>
            <Part
                content={(
                    <RVD rootNode={side_layout(sideItems)}/>
                )}
                code={`
function Layout(){
    function side_layout(sideItems){
        return {
            style: { background: 'rgb(10, 38, 116)', color: '#fff', width: 200 },
            column: [
                {size: 100, className: 'align-vh',html: <Icon path={mdiAccount} size={2} />},
                {column: sideItems.map((sideItem) => sideItem_layout(sideItem))}
            ],
        }
    }
    function sideItem_layout(sideItem){
        return {
            className: 'p-h-24 gap-12 fs-12 align-v', size: 36,
            row: [
                icon_layout(sideItem.path),
                { html: sideItem.text}
            ]
        }
    }
    function icon_layout(path){
        return {html:<Icon path={path} size={0.6}/>,className:'br-6 h-24 align-vh'}
    }
    let sideItems = [
        { path: mdiAccount, text: 'My Cloud' },
        { path: mdiAccountGroup, text: 'Shared Files' },
        { path: mdiStar, text: 'Favorites' },
        { path: mdiCloudUpload, text: 'Upload Files' },
        { path: mdiCarSettings, text: 'Settings' },
        { path: mdiCloudUpload, text: 'Upload Files' }
    ]
    return (
        <RVD rootNode={side_layout(sideItems)}/>
    )
}
                `}
            />
        </div>
    )
}

function Layout6() {
    let sideItems = [
        { path: mdiAccount, text: 'My Cloud' },
        { path: mdiAccountGroup, text: 'Shared Files' },
        { path: mdiStar, text: 'Favorites' },
        { path: mdiCloudUpload, text: 'Upload Files' },
        { path: mdiCarSettings, text: 'Settings' },
        { path: mdiCloudUpload, text: 'Upload Files' }
    ]
    let categories = [
        { path: mdiCamera, text: 'Pictures', length: 480, color: '#6663fe' },
        { path: mdiFileDocument, text: 'Doscuments', length: 190, color: '#00a0b6' },
        { path: mdiMonitor, text: 'Videos', length: 30, color: '#e06c9f' },
        { path: mdiMicrophone, text: 'Audio', length: 80, color: '#266fd5' },
    ]
    let files = [
        { path: mdiListBox, text: 'Work', length: 620, color: '#6663fe',outline:true },
        { path: mdiAccount, text: 'Personal', length: 115, color: '#00a0b6',outline:true },
        { path: mdiBookEducation, text: 'School', length: 65, color: '#e06c9f',outline:true },
        { path: mdiArchive, text: 'Archive', length: 21, color: '#266fd5',outline:true },
    ]
    let recentFiles = [
        { path: mdiCamera, text: 'IMG_100000', type: 'PNG',size:'10 MB', color: '#6663fe' },
        { path: mdiFileDocument, text: 'Startup pitch', type: 'AVI',size:'23 MB', color: '#00a0b6' },
        { path: mdiMonitor, text: 'freestyle beat', type: 'MP3',size:'50 MB', color: '#e06c9f' },
        { path: mdiListBox, text: 'Work proposal', type: 'DOCx',size:'30 KB', color: '#266fd5' },
    ]
    let layout = new Layout(()=>{return {sideItems,categories,files,recentFiles}});

    return (
        <div className='example'>
            <Part
                content={(
                    <RVD
                        rootNode={layout.root()}
                    />
                )}
                code={`
function App(){
    let sideItems = [
        { path: mdiAccount, text: 'My Cloud' },
        { path: mdiAccountGroup, text: 'Shared Files' },
        { path: mdiStar, text: 'Favorites' },
        { path: mdiCloudUpload, text: 'Upload Files' },
        { path: mdiCarSettings, text: 'Settings' },
        { path: mdiCloudUpload, text: 'Upload Files' }
    ]
    let categories = [
        { path: mdiCamera, text: 'Pictures', length: 480, color: '#6663fe' },
        { path: mdiFileDocument, text: 'Doscuments', length: 190, color: '#00a0b6' },
        { path: mdiMonitor, text: 'Videos', length: 30, color: '#e06c9f' },
        { path: mdiMicrophone, text: 'Audio', length: 80, color: '#266fd5' },
    ]
    let files = [
        { path: mdiListBox, text: 'Work', length: 620, color: '#6663fe',outline:true },
        { path: mdiAccount, text: 'Personal', length: 115, color: '#00a0b6',outline:true },
        { path: mdiBookEducation, text: 'School', length: 65, color: '#e06c9f',outline:true },
        { path: mdiArchive, text: 'Archive', length: 21, color: '#266fd5',outline:true },
    ]
    let recentFiles = [
        { path: mdiCamera, text: 'IMG_100000', type: 'PNG', color: '#6663fe' },
        { path: mdiFileDocument, text: 'Startup pitch', type: 'AVI', color: '#00a0b6' },
        { path: mdiMonitor, text: 'freestyle beat', type: 'MP3', color: '#e06c9f' },
        { path: mdiListBox, text: 'Work proposal', type: 'DOCx', color: '#266fd5' },
    ]
    let layout = new Layout(()=>{return {sideItems,categories,files,recentFiles}});    
    return (<RVD rootNode={layout.root()}/>)
}
class Layout{
    constructor(getProps){
        this.getProps = getProps;
    }
    root = (props)=>{
        return {
            className:'bg30',row:[this.side(),this.body()],...props
        }
    }
    side = (props) => {
        return {
            style: { background: 'rgb(10, 38, 116)', color: '#fff', width: 200 },
            column: [this.sideHeader(),this.sideItems()],
            ...props
        }
    }
    body = (props) => {
        return {
            className:'p-24 gap-12',flex:1,
            column:[this.categories(),this.files(),this.recentFiles()],
            ...props
        }
    }
    sideHeader = (props) => {
        return {size: 100, classNAme: 'align-vh',html: <Icon path={mdiAccount} size={2} />,...props}
    }
    sideItems = (props) => {
        let {sideItems} = this.getProps()
        return {column: sideItems.map((sideItem) => this.sideItem(sideItem)),...props}
    }
    sideItem = (sideItem,props) => {
        return {
            className: 'p-h-24 gap-12 fs-12 align-v', size: 36,
            row: [this.icon(sideItem.path,0.6),this.sideText(sideItem.text)],
            ...props
        }
    }
    sideText = (text,props) => {
        return { html: text ,...props}
    }
    icon = (path,size,props) => {
        return {html:<Icon path={path} size={size}/>,className:'align-vh',...props}
    }
    label = (text,props) => {
        return {html:text,className:'bold fs-14',style:{color:'#174484'},...props}
    }
    categories = (props) => {
        let {categories} = this.getProps();
        return {
            column:[
                this.label('Categories'),
                {className: 'gap-12',row: categories.map((o) => this.card(o))}
            ],
            ...props
        }
    }
    card = ({ path, text, length, color, outline },props) => {
        let cardStyle = { background: outline ? '#fff' : color, color: outline ? '#666' : '#fff' }
        let iconStyle = { background: '#fff', color, width: 24, height: 24,borderRadius:'100%',marginBottom:6 };
        return {
            style: cardStyle,
            className: 'p-6 fs-12 br-8 w-84',
            column: [
                this.icon(path,0.6,{style:iconStyle}),
                { html: text,className:'bold' },
                { html: length + ' files', style: { fontSize: '85%' }, className: 'op-80' }
            ],
            ...props
        }
    }
    row = ({path,text,type,size,color},props)=>{
        return {
            style:{background:'#fff'},className:'p-6 br-8 fs-12 gap-12',
            row:[
                this.icon(path,0.6,{className:'w-24 h-24 br-4 align-vh',style:{color:'#fff',background:color}}),
                this.row_text(text),
                this.row_type(type),
                this.row_size(size),
                this.icon(mdiShare,0.8,{flex:1}),
                this.icon(mdiDotsHorizontal,0.8,{flex:1}),
            ],
            ...props
        }
    }
    row_text = (text,props) =>{
        return {html:text,size:120,className:'bold align-v',...props}
    }
    row_type = (type,props)=>{
        return {html:type + ' file',flex:1,className:'align-vh',...props}
    }
    row_size = (size,props)=>{
        return {html:size,flex:1,className:'align-vh',...props}
    }
    files = (props) =>{
        let {files} = this.getProps()
        return {
            column:[
                this.label('Files'),
                {gap: 12,row: files.map((o) => this.card(o))}
            ],
            ...props
        }
    }
    recentFiles = (props)=>{
        let {recentFiles} = this.getProps();
        return {
            column:[
                this.label('Recent Files'),
                {className:'gap-6',column:recentFiles.map((o)=>this.row(o))}
            ],
            ...props
        }
    }
}
                `}
            />
        </div>
    )
}
function Loading() {
    let recentFile = { path: mdiCamera, text: 'IMG_100000', type: 'PNG',size:'10 MB', color: '#6663fe' }
    let recentFileLoading = { path: mdiCamera, text: 'loading text', type: 'any',size:'any size', color: 'any color' }
    let layout = new Layout();

    return (
        <div className='example' style={{background:'#eee'}}>
            <Part
                content={(
                    <RVD
                        rootNode={{
                            className:'gap-12',
                            column:[
                                layout.row(recentFile),
                                layout.row(recentFileLoading,{loading:true})
                            ]
                        }}
                    />
                )}
                code={`
function App(){
    let recentFile = { path: mdiCamera, text: 'IMG_100000', type: 'PNG',size:'10 MB', color: '#6663fe' }
    let recentFileLoading = { path: mdiCamera, text: 'loading text', type: 'any',size:'any size', color: 'any color' }
    let layout = new Layout();

    return (
        <RVD
            rootNode={{
                className:'gap-12',
                column:[
                    layout.row(recentFile),
                    layout.row(recentFileLoading,{loading:true})
                ]
            }}
        />
    )
}

class Layout{
    ... 
    row = ({path,text,type,size,color},props)=>{
        return {
            style:{background:'#fff'},className:'p-6 br-8 fs-12 gap-12',
            row:[
                this.icon(path,0.6,{className:'w-24 h-24 br-4',style:{color:'#fff',background:color}}),
                this.row_text(text),
                this.row_type(type),
                this.row_size(size),
                this.icon(mdiShare,0.8,{flex:1}),
                this.icon(mdiDotsHorizontal,0.8,{flex:1}),
            ],
            ...props
        }
    }
    ...
}
                `}
            />
        </div>
    )
}
function Gap() {
    let texts = ['text1','text2','text3','text4']
    return (
        <div className='example' style={{background:'#eee'}}>
            <Part
                content={(
                    <RVD
                        rootNode={{
                            className:'align-v',
                            gap:{
                                html:'&',
                                size:16,
                                style:{background:'dodgerblue',color:'#fff'},
                                className:'m-h-6 br-4 fs-12 h-fit'
                            },
                            row:texts.map((t)=>{
                                return {html:t}
                            })
                        }}
                    />
                )}
                code={`
function App(){
    let texts = ['text1','text2','text3','text4']
    
    return (
        <RVD
            rootNode={{
                classNAme:'align-v',
                gap:{
                    html:'&',
                    size:16,
                    style:{background:'dodgerblue',color:'#fff'},
                    className:'m-h-6 br-4 fs-12 h-fit'
                },
                row:texts.map((t)=>{
                    return {html:t}
                })
            }}
        />
    )
}

                `}
            />
        </div>
    )
}
function Sizing() {
    let style = {background:'#ddd',height:60}
    return (
        <div className='example'>
            <Part
                content={(
                    <RVD 
                        rootNode={{
                            className:'gap-12',
                            row:[
                                {html:'size:60',className:'align-vh',size:60,style},
                                {html:'size:120',className:'align-vh',size:120,style},
                                {html:'flex:1',className:'align-vh flex-1',style},
                                {html:'flex:2',className:'align-vh flex-2',style},
                                {html:'no size no flex',className:'align-vh',style},
                            ]
                        }}
                    />
                )}
                code={`
function Layout(){
    let style = {background:'#ddd',height:60}
    return (
        <RVD 
            rootNode={{
                className:'gap-12',
                row:[
                    {html:'size:60',className:'align-vh',size:60,style},
                    {html:'size:120',className:'align-vh',size:120,style},
                    {html:'flex:1',className:'align-vh flex-1',style},
                    {html:'flex:2',className:'align-vh flex-2',style},
                    {html:'no size no flex',className:'align-vh',style},
                ]
            }}
        />
    )
}
                `}
            />
        </div>
    )
}
function CssClasses() {
    function rows_layout(rows){
        return {
            column:[
                {
                    html:'Css Classes',className:'bold'
                },
                {
                    column:rows.map((v)=>{
                        if(v[0] === '.'){
                            return {html:AIODoc().Code(v),flex:1}
                        }
                        return {html:v,flex:1,className:'bold m-t-24'}
                    })
                }
            ]
        }
    }
    let rows = [
    'flex',
`.flex-1 {flex:1;}`
,
`.flex-2 {flex:2;}`
,
`.flex-3 {flex:3;}`
,
'... +1 to 12',
`.flex-12 {flex:1;}`
,
'align',
`.align-vh {
    display:flex;
    align-items:center;
    justify-content:center;
}`
,
`.align-v {
    display:flex;
    align-items:center;
}`
,
`.align-h {
    display:flex;
    justify-content:center;
}`,
'width',
`.w-100 {width:100%;}`,
`.w-fit {width:fit-content;}`,
`.w-1 {width:1px;}`,
`.w-2 {width:2px;}`,
`.w-3 {width:3px;}`,
`.w-4 {width:4px;}`,
`.w-5 {width:5px;}`,
`.w-6 {width:6px;}`,
`.w-8 {width:8px;}`,
`.w-10 {width:10px;}`,
`.w-12 {width:12px;}`,
`.w-16 {width:16px;}`,
`.w-24 {width:24px;}`,
`.w-30 {width:30px;}`,
`.w-36 {width:36px;}`,
`.w-40 {width:40px;}`,
`.w-48 {width:48px;}`,
`.w-60 {width:60px;}`,
`.w-72 {width:72px;}`,
'... +12 to 300',
`.w-300 {width:300px;}`,
'height',
`.h-100 {height:100%;}`,
`.h-fit {height:fit-content;}`,
`.h-1 {height:1px;}`,
`.h-2 {height:2px;}`,
`.h-3 {height:3px;}`,
`.h-4 {height:4px;}`,
`.h-5 {height:5px;}`,
`.h-6 {height:6px;}`,
`.h-8 {height:8px;}`,
`.h-10 {height:10px;}`,
`.h-12 {height:12px;}`,
`.h-16 {height:16px;}`,
`.h-24 {height:24px;}`,
`.h-30 {height:30px;}`,
`.h-36 {height:36px;}`,
`.h-40 {height:40px;}`,
`.h-48 {height:48px;}`,
`.h-60 {height:60px;}`,
`.h-72 {height:72px;}`,
'... +12 to 300',
`.h-300 {width:300px;}`,
'font-size',
`.fs-8{font-size:8px;}`,
`.fs-9{font-size:9px;}`,
`.fs-10{font-size:10px;}`,
`.fs-11{font-size:10px;}`,
`.fs-12{font-size:12px;}`,
`.fs-14{font-size:14px;}`,
`.fs-16{font-size:16px;}`,
`.fs-18{font-size:18px;}`,
`.fs-20{font-size:20px;}`,
`.fs-24{font-size:24px;}`,
`.fs-28{font-size:28px;}`,
`.fs-32{font-size:32px;}`,
`.fs-36{font-size:36px;}`,
`.fs-40{font-size:40px;}`,
`.fs-48{font-size:48px;}`,
`.fs-60{font-size:60px;}`,
'top left right bottom',
`.t-0{top:0 !important;}`,
`.t-100{top:100%;}`,
`.b-0{bottom:0;}`,
`.b-100{bottom:100%;}`,
`.l-0{left:0;}`,
`.l-100{left:100%;}`,
`.r-0{right:0;}`,
`.r-100{right:100%;}`,
'background (black to white)',
'.bg<i>{background:rgb(i * 8,i * 8,i * 8)} (0 to 32)',
`.bg0{background:rgb(0,0,0);}`,
`.bg1{background:rgb(8,8,8);}`,
`...`,
`.bg31{background:rgb(248,248,248);}`,
`.bg32{background:rgb(255,255,255);}`,
'color (black to white)',
'.c<i>{color:rgb(i * 8,i * 8,i * 8)} (0 to 32)',
`.c0{color:rgb(0,0,0);}`,
`.c1{color:rgb(8,8,8);}`,
`...`,
`.c31{color:rgb(248,248,248);}`,
`.c32{color:rgb(255,255,255);}`,
'border color',
`.brd-c<i>{border:1px solid rgb(i * 8,i * 8,i * 8)} (0 to 32)`,
`.brd-c0{border:1px solid rgb(0,0,0);}`,
`.brd-c1{border:1px solid rgb(8,8,8);}`,
'...',
`.brd-c31{border:1px solid rgb(248,248,248);}`,
`.brd-c32{border:1px solid rgb(255,255,255);}`,
'border-width',
`.brd-w<i>{border-width:<i>px} (0 to 12)`,
`.brd-w0{border-width:0px;}`,
`.brd-w1{border-width:1px;}`,
'...',
`.brd-w11{border-width:11px;}`,
`.brd-w12{border-width:12px;}`,
'border side',
`.brd-l-0{border-left:none}`,
`.brd-r-0{border-right:none}`,
`.brd-t-0{border-top:none}`,
`.brd-b-0{border-bottom:none}`,
`.brd-l{border-top:none; border-right:none; border-bottom:none;}`,
`.brd-r{border-left:none; border-top:none; border-bottom:none;}`,
`.brd-t{border-left:none; border-right:none; border-bottom:none;}`,
`.brd-b{border-left:none; border-top:none; border-right:none;}`,
'border-style',
`.brd-dashed{border-style: dashed;}`,
`.brd-dotted{border-style: dotted;}`,
'overflow',
`.of-visible{overflow:visible;}`,
`.of-hidden{overflow:hidden;}`,
`.of-auto{overflow:auto;}`,
`.ofy-visible{overflow-y:visible;}`,
`.ofy-hidden{overflow-y:hidden;}`,
`.ofy-auto{overflow-y:auto;}`,
`.ofx-visible{overflow-x:visible;}`,
`.ofx-hidden{overflow-x:hidden;}`,
`.ofx-auto{overflow-x:auto;}`,
'opacity',
`.op-<i>{opacity:i / 100;} (0 to 100 +5)`,
`.op-0{opacity:0;}`,
`.op-5{opacity:0.05;}`,
'...',
`.op-95{opacity:0.95;}`,
`.op-100{opacity:1;}`,
'gap',
`.gap-1 {gap:1px;}`,
`.gap-2 {gap:2px;}`,
`.gap-3 {gap:3px;}`,
`.gap-4 {gap:4px;}`,
`.gap-5 {gap:5px;}`,
`.gap-6 {gap:6px;}`,
`.gap-8 {gap:8px;}`,
`.gap-10 {gap:10px;}`,
`.gap-12 {gap:12px;}`,
`.gap-16 {gap:16px;}`,
`.gap-24 {gap:24px;}`,
`.gap-30 {gap:30px;}`,
`.gap-36 {gap:36px;}`,
`.gap-40 {gap:40px;}`,
`.gap-48 {gap:48px;}`,
`.gap-60 {gap:60px;}`,
`.gap-72 {gap:72px;}`,
'... +12 to 300',
`.gap-300 {width:300px;}`,
'text-align',
`.t-a-right{text-align:right;}`,
`.t-a-left{text-align:left;}`,
`.t-a-center{text-align:center;}`,
'backdrop-filter blur',
`.bf-1{backdrop-filter: blur(1px);}`,
`.bf-2{backdrop-filter: blur(2px);}`,
`.bf-3{backdrop-filter: blur(3px);}`,
`.bf-4{backdrop-filter: blur(4px);}`,
`.bf-5{backdrop-filter: blur(6px);}`,
`.bf-6{backdrop-filter: blur(8px);}`,
`.bf-7{backdrop-filter: blur(12px);}`,
`.bf-8{backdrop-filter: blur(16px);}`,
`.bf-9{backdrop-filter: blur(24px);}`,
`.bf-10{backdrop-filter: blur(36px);}`,
`.bf-11{backdrop-filter: blur(48px);}`,
`.bf-12{backdrop-filter: blur(60px);}`,
'padding margin',
'i => 0,3,6,8,12,16,24,36,48,60,72',
'.p-<i>{padding:ipx}',
'.p-l-<i>{padding-left:ipx}',
'.p-r-<i>{padding-right:ipx}',
'.p-t-<i>{padding-top:ipx}',
'.p-b-<i>{padding-bottom:ipx}',
'.p-h-<i>{padding-left:ipx; padding-right:ipx;}',
'.p-v-<i>{padding-top:ipx; padding-bottom:ipx;}',
'.m-<i>{margin:ipx}',
'.m-l-<i>{margin-left:ipx}',
'.m-r-<i>{margin-right:ipx}',
'.m-t-<i>{margin-top:ipx}',
'.m-b-<i>{margin-bottom:ipx}',
'.m-h-<i>{margin-left:ipx; margin-right:ipx;}',
'.m-v-<i>{margin-top:ipx; margin-bottom:ipx;}',
'other',
`.fd-column{flex-direction: column !important;}`,
`.fullscreen{position:fixed; left:0; top:0; width:100%; height:100%;}`,
`.relative{position:relative;}`,
`.absolute{position:absolute;}`,
`.dir-rtl{direction:rtl}`,
`.dir-ltr{direction:ltr}`,
`.bold{font-weight:bold;}`,
`.hide-scroll::-webkit-scrollbar {width: 0px; height: 0px;}`,

    ]
    return (
        <div className='example'>
            <Part
                content={(
                    <RVD 
                        rootNode={rows_layout(rows)}
                    />
                )}
                
            />
        </div>
    )
}
function NodeClass() {
    return (
        <div className='example'>
            <Part
                content={(
                    <RVD 
                        rootNode={{
                            nodeClass:'table',
                            row:[
                                {
                                    nodeClass:'row1',
                                    flex:1,
                                    column:[
                                        {html:'a',nodeClass:'col1'},
                                        {html:'b',nodeClass:'col2'}
                                    ]
                                },
                                {
                                    nodeClass:'row2',
                                    flex:1,
                                    column:[
                                        {html:'a',nodeClass:'col1'},
                                        {html:'b',nodeClass:'col2'}
                                    ]
                                }
                            ]
                        }}
                    />
                )}
                code={`
css
.table-row1{
    border:3px solid pink;
}
.table-row2{
    border:3px solid yellow;
}
.table-row1-col1{
    background:red;
}
.table-row1-col2{
    background:orange;
}
.table-row2-col1{
    background:blue;
}
.table-row2-col2{
    background:green;
}

js
function Layout(){
    return (
        <RVD 
            rootNode={{
                nodeClass:'table',
                row:[
                    {
                        nodeClass:'row1',
                        flex:1,
                        column:[
                            {html:'a',nodeClass:'col1'},
                            {html:'b',nodeClass:'col2'}
                        ]
                    },
                    {
                        nodeClass:'row2',
                        flex:1,
                        column:[
                            {html:'a',nodeClass:'col1'},
                            {html:'b',nodeClass:'col2'}
                        ]
                    }
                ]
            }}
        />
    )
}
                `}
            />
        </div>
    )
}
class Layout{
    constructor(getProps){
        this.getProps = getProps;
    }
    root = (props)=>{
        return {
            className:'bg30',row:[this.side(),this.body()],...props
        }
    }
    side = (props) => {
        return {
            style: { background: 'rgb(10, 38, 116)', color: '#fff', width: 200 },
            column: [this.sideHeader(),this.sideItems()],
            ...props
        }
    }
    body = (props) => {
        return {
            className:'p-24 gap-12',flex:1,
            column:[this.categories(),this.files(),this.recentFiles()],
            ...props
        }
    }
    sideHeader = (props) => {
        return {size: 100, className: 'align-vh',html: <Icon path={mdiAccount} size={2} />,...props}
    }
    sideItems = (props) => {
        let {sideItems} = this.getProps()
        return {column: sideItems.map((sideItem) => this.sideItem(sideItem)),...props}
    }
    sideItem = (sideItem,props) => {
        return {
            className: 'p-h-24 gap-12 fs-12 align-v', size: 36,
            row: [this.icon(sideItem.path,0.6),this.sideText(sideItem.text)],
            ...props
        }
    }
    sideText = (text,props) => {
        return { html: text ,...props}
    }
    icon = (path,size,props) => {
        return {html:<Icon path={path} size={size}/>,className:'align-vh',...props}
    }
    label = (text,props) => {
        return {html:text,className:'bold fs-14',style:{color:'#174484'},...props}
    }
    categories = (props) => {
        let {categories} = this.getProps();
        return {
            column:[
                this.label('Categories'),
                {className: 'gap-12',row: categories.map((o) => this.card(o))}
            ],
            ...props
        }
    }
    card = ({ path, text, length, color, outline },props) => {
        let cardStyle = { background: outline ? '#fff' : color, color: outline ? '#666' : '#fff' }
        let iconStyle = { background: '#fff', color, width: 24, height: 24,borderRadius:'100%',marginBottom:6 };
        return {
            style: cardStyle,
            className: 'p-6 fs-12 br-8 w-84',
            column: [
                this.icon(path,0.6,{style:iconStyle}),
                { html: text,className:'bold' },
                { html: length + ' files', style: { fontSize: '85%' }, className: 'op-80' }
            ],
            ...props
        }
    }
    row = ({path,text,type,size,color},props)=>{
        return {
            style:{background:'#fff'},className:'p-6 br-8 fs-12 gap-12 align-v',
            row:[
                this.icon(path,0.6,{className:'w-24 h-24 br-4 align-vh',style:{color:'#fff',background:color}}),
                this.row_text(text),
                this.row_type(type),
                this.row_size(size),
                this.icon(mdiShare,0.8,{flex:1}),
                this.icon(mdiDotsHorizontal,0.8,{flex:1}),
            ],
            ...props
        }
    }
    row_text = (text,props) =>{
        return {html:text,size:120,className:'bold align-v',...props}
    }
    row_type = (type,props)=>{
        return {html:type + ' file',flex:1,className:'aling-vh',...props}
    }
    row_size = (size,props)=>{
        return {html:size,flex:1,classNAme:'align-vh',...props}
    }
    files = (props) =>{
        let {files} = this.getProps()
        return {
            column:[
                this.label('Files'),
                {className: 'gap-12',row: files.map((o) => this.card(o))}
            ],
            ...props
        }
    }
    recentFiles = (props)=>{
        let {recentFiles} = this.getProps();
        return {
            column:[
                this.label('Recent Files'),
                {className:'gap-6',column:recentFiles.map((o)=>this.row(o))}
            ],
            ...props
        }
    }
}

function Animate() {
    let [recentFiles,setRecentFiles] = useState([
        { id:'0',path: mdiCamera, text: 'IMG_100000', type: 'PNG',size:'10 MB', color: '#6663fe' },
        { id:'1',path: mdiFileDocument, text: 'Startup pitch', type: 'AVI',size:'23 MB', color: '#00a0b6' },
        { id:'2',path: mdiMonitor, text: 'freestyle beat', type: 'MP3',size:'50 MB', color: '#e06c9f' },
        { id:'3',path: mdiListBox, text: 'Work proposal', type: 'DOCx',size:'30 KB', color: '#266fd5' },
    ])
    let [files,setFiles] = useState([
        { id:'0',path: mdiListBox, text: 'Work', length: 620, color: '#6663fe',outline:true },
        { id:'1',path: mdiAccount, text: 'Personal', length: 115, color: '#00a0b6',outline:true },
        { id:'2',path: mdiBookEducation, text: 'School', length: 65, color: '#e06c9f',outline:true },
        { id:'3',path: mdiArchive, text: 'Archive', length: 21, color: '#266fd5',outline:true },
    ])
    function card_layout({ id,path, text, length, color }){
        return {
            key:id,
            style: { background: color, color: '#fff' },
            className: 'p-6 fs-12 br-8 m-r-12 w-120 h-84 of-hidden',
            onClick:(e)=>removeH(e,id),
            column: [
                {
                    html:<Icon path={path} size={0.6}/>,
                    className:'align-vh bg32 w-24 h-24 br-100 m-b-6',
                    style:{color},
                },
                { 
                    html: text,
                    className:'bold' 
                },
                { 
                    html: length + ' files', 
                    className: 'op-80 fs-p85' 
                }
            ]
        }
    }
    function removeV(e,id){
        animate('removeV',$(e.currentTarget),()=>{
            setRecentFiles(recentFiles.filter((o,i)=>o.id !== id))
        })
    }
    function removeL(e,id){
        animate('removeL',$(e.currentTarget),()=>{
            setRecentFiles(recentFiles.filter((o,i)=>o.id !== id))
        })
    }
    function removeH(e,id){
        animate('removeH',$(e.currentTarget),()=>{
            setFiles(files.filter((o,i)=>o.id !== id))
        })
    }

    return (
        <div className='example' style={{background:'#eee'}}>
            <Part
                title='removeV'
                content={(
                    <RVD
                        rootNode={{
                            column:recentFiles.map((o,i)=>{
                                let {id,path,text,type,size,color} = o;
                                return {
                                    key:id,
                                    className:'p-6 br-8 fs-12 gap-12 h-60 bg32 m-b-12 align-v',
                                    onClick:(e)=>removeV(e,o.id),
                                    row:[
                                        {
                                            html:<Icon path={path} size={0.6}/>,
                                            className:'w-24 h-24 br-4 c32 align-vh',
                                            style:{background:color}
                                        },
                                        {
                                            html:text,size:120,
                                            className:'bold align-v'
                                        },
                                        {
                                            html:type + ' file',
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:size,
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:<Icon path={mdiShare} size={0.6}/>,
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:<Icon path={mdiDotsHorizontal} size={0.6}/>,
                                            className:'flex-1 align-vh'
                                        }
                                    ]
                                }
                            })
                        }}
                    />
                )}
                code={`
                
import RVD,{animate} from 'react-virtual-dom';
function App(){
    let [recentFiles,setRecentFiles] = useState([
        { id:'0',path: mdiCamera, text: 'IMG_100000', type: 'PNG',size:'10 MB', color: '#6663fe' },
        { id:'1',path: mdiFileDocument, text: 'Startup pitch', type: 'AVI',size:'23 MB', color: '#00a0b6' },
        { id:'2',path: mdiMonitor, text: 'freestyle beat', type: 'MP3',size:'50 MB', color: '#e06c9f' },
        { id:'3',path: mdiListBox, text: 'Work proposal', type: 'DOCx',size:'30 KB', color: '#266fd5' },
    ])
    function removeV(e,id){
        animate('removeV',$(e.currentTarget),()=>{
            setRecentFiles(recentFiles.filter((o,i)=>o.id !== id))
        })
    }
    return (
        <RVD
            rootNode={{
                column:recentFiles.map((o,i)=>{
                    let {id,path,text,type,size,color} = o;
                    return {
                        key:id,
                        className:'p-6 br-8 fs-12 gap-12 h-60 bg32 m-b-12 align-v',
                        onClick:(e)=>removeV(e,o.id),
                        row:[
                            {
                                html:<Icon path={path} size={0.6}/>,
                                className:'w-24 h-24 br-4 c32 align-vh',
                                style:{background:color}
                            },
                            {
                                html:text,size:120,
                                className:'bold align-v'
                            },
                            {
                                html:type + ' file',
                                className:'flex-1 align-vh'
                            },
                            {
                                html:size,
                                className:'flex-1 align-vh'
                            },
                            {
                                html:<Icon path={mdiShare} size={0.6}/>,
                                className:'flex-1 align-vh'
                            },
                            {
                                html:<Icon path={mdiDotsHorizontal} size={0.6}/>,
                                className:'flex-1 align-vh'
                            }
                        ]
                    }
                })
            }}
        />
    )
}
                `}
            />
            <Part
                title='removeL'
                content={(
                    <RVD
                        rootNode={{row: files.map((o) => card_layout(o))}}
                    />
                )}
                code={`
import RVD,{animate} from 'react-virtual-dom';
function App(){
    let [files,setFiles] = useState([
        { id:'0',path: mdiListBox, text: 'Work', length: 620, color: '#6663fe',outline:true },
        { id:'1',path: mdiAccount, text: 'Personal', length: 115, color: '#00a0b6',outline:true },
        { id:'2',path: mdiBookEducation, text: 'School', length: 65, color: '#e06c9f',outline:true },
        { id:'3',path: mdiArchive, text: 'Archive', length: 21, color: '#266fd5',outline:true },
    ])
    function removeL(e,id){
        animate('removeL',$(e.currentTarget),()=>{
            setFiles(files.filter((o,i)=>o.id !== id))
        })
    }
    function card_layout({ id,path, text, length, color }){
        return {
            key:id,
            style: { background: color, color: '#fff' },
            className: 'p-6 fs-12 br-8 m-r-12 w-120 h-84 of-hidden',
            onClick:(e)=>removeH(e,id),
            column: [
                {
                    html:<Icon path={path} size={0.6}/>,
                    className:'align-vh bg32 w-24 h-24 br-100 m-b-6',
                    style:{color},
                },
                { 
                    html: text,
                    className:'bold' 
                },
                { 
                    html: length + ' files', 
                    className: 'op-80 fs-p85' 
                }
            ]
        }
    }
    return (
        <RVD
            rootNode={{row: files.map((o) => card_layout(o))}}
        />
    )
}
                `}
            />
            <Part
                title='removeV'
                content={(
                    <RVD
                        rootNode={{
                            column:recentFiles.map((o,i)=>{
                                let {id,path,text,type,size,color} = o;
                                return {
                                    key:id,
                                    className:'p-6 br-8 fs-12 gap-12 h-60 bg32 m-b-12 align-v',
                                    onClick:(e)=>removeL(e,o.id),
                                    row:[
                                        {
                                            html:<Icon path={path} size={0.6}/>,
                                            className:'w-24 h-24 br-4 c32 align-vh',
                                            style:{background:color}
                                        },
                                        {
                                            html:text,size:120,
                                            className:'bold align-v'
                                        },
                                        {
                                            html:type + ' file',
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:size,
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:<Icon path={mdiShare} size={0.6}/>,
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:<Icon path={mdiDotsHorizontal} size={0.6}/>,
                                            className:'flex-1 align-vh'
                                        }
                                    ]
                                }
                            })
                        }}
                    />
                )}
                code={`
                
import RVD,{animate} from 'react-virtual-dom';
function App(){
    let [recentFiles,setRecentFiles] = useState([
        { id:'0',path: mdiCamera, text: 'IMG_100000', type: 'PNG',size:'10 MB', color: '#6663fe' },
        { id:'1',path: mdiFileDocument, text: 'Startup pitch', type: 'AVI',size:'23 MB', color: '#00a0b6' },
        { id:'2',path: mdiMonitor, text: 'freestyle beat', type: 'MP3',size:'50 MB', color: '#e06c9f' },
        { id:'3',path: mdiListBox, text: 'Work proposal', type: 'DOCx',size:'30 KB', color: '#266fd5' },
    ])
    function removeV(e,id){
        animate('removeV',$(e.currentTarget),()=>{
            setRecentFiles(recentFiles.filter((o,i)=>o.id !== id))
        })
    }
    return (
        <RVD
            rootNode={{
                column:recentFiles.map((o,i)=>{
                    let {id,path,text,type,size,color} = o;
                    return {
                        key:id,
                        className:'p-6 br-8 fs-12 gap-12 h-60 bg32 m-b-12 align-v',
                        onClick:(e)=>removeV(e,o.id),
                        row:[
                            {
                                html:<Icon path={path} size={0.6}/>,
                                className:'w-24 h-24 br-4 c32 align-vh',
                                style:{background:color}
                            },
                            {
                                html:text,size:120,
                                className:'bold align-v'
                            },
                            {
                                html:type + ' file',
                                className:'flex-1 align-vh'
                            },
                            {
                                html:size,
                                className:'flex-1 align-vh'
                            },
                            {
                                html:<Icon path={mdiShare} size={0.6}/>,
                                className:'flex-1 align-vh'
                            },
                            {
                                html:<Icon path={mdiDotsHorizontal} size={0.6}/>,
                                className:'flex-1 align-vh'
                            }
                        ]
                    }
                })
            }}
        />
    )
}
                `}
            />
            
        </div>
    )
}
function Resize() {
    let [aSize,setASize] = useState(200)
    let [bSize,setBSize] = useState(200)
    return (
        <div className='example' style={{background:'#eee'}}>
            <Part
                content={(
                    <RVD
                        rootNode={{
                            className:'h-120',gap:{size:12},
                            row:[
                                {size:aSize,html:'A',className:'align-vh brd-c12',onResize:(newSize)=>setASize(newSize)},
                                {size:bSize,html:'B',className:'align-vh brd-c12',onResize:(newSize)=>setBSize(newSize)},
                                {html:'C',className:'align-vh brd-c12 flex-1'},
                            ]
                        }}
                    />
                )}
                code={`
                
function App(){
    let [aSize,setASize] = useState(200)
    let [bSize,setBSize] = useState(200)
    return (
        <RVD
            rootNode={{
                className:'h-120',gap:{size:12},
                row:[
                    {size:aSize,html:'A',className:'align-vh brd-c12',onResize:(newSize)=>setASize(newSize)},
                    {size:bSize,html:'B',className:'align-vh brd-c12',onResize:(newSize)=>setBSize(newSize)},
                    {html:'C',className:'align-vh brd-c12 flex-1'},
                ]
            }}
        />
    )
}
                `}
            />
            <Part
                content={(
                    <RVD
                        state={{aSize:200,bSize:200}}
                        rootNode={{
                            className:'h-120',gap:{size:12},
                            row:({state,setState})=>{
                                let {aSize,bSize} = state;
                                return [
                                    {size:aSize,html:'A',className:'align-vh brd-c12',onResize:(newSize)=>setState('aSize',newSize)},
                                    {size:bSize,html:'B',className:'align-vh brd-c12',onResize:(newSize)=>setState('bSize',newSize)},
                                    {html:'C',className:'align-vh brd-c12 flex-1'},
                                ]
                            }
                        }}
                    />
                )}
                code={`
                
function App(){
    let [aSize,setASize] = useState(200)
    let [bSize,setBSize] = useState(200)
    return (
        <RVD
            state={{aSize:200,bSize:200}}
            rootNode={{
                className:'h-120',gap:{size:12},
                row:({state,setState})=>{
                    let {aSize,bSize} = state;
                    return [
                        {size:aSize,html:'A',className:'align-vh brd-c12',onResize:(newSize)=>setState('aSize',newSize)},
                        {size:bSize,html:'B',className:'align-vh brd-c12',onResize:(newSize)=>setState('bSize',newSize)},
                        {html:'C',className:'align-vh brd-c12 flex-1'},
                    ]
                }
            }}
        />
    )
}
                `}
            />
        </div>
    )
}
function StateSetState() {
    return (
        <div className='example' style={{background:'#eee'}}>
            <Part
                content={(
                    <RVD
                        state={{a:0,b:0,c:0}}
                        rootNode={{
                            className:'h-120 gap-12',
                            row:({state,setState})=>{
                                let {a,b,c} = state;
                                let className = 'align-vh brd-c12 sel-off';
                                return [
                                    {size:120,html:a,className,onClick:()=>setState({...state,a:a + 1})},
                                    {size:120,html:b,className,onClick:()=>setState('b',b + 1)},
                                    {size:120,html:c,className,onClick:()=>setState({...state,c:c + 1})},
                                ]
                            }
                        }}
                    />
                )}
                code={`
                
function App(){
    return (
        <RVD
            state={{a:0,b:0,c:0}}
            rootNode={{
                className:'h-120 gap-12',
                row:({state,setState})=>{
                    let {a,b,c} = state;
                    let className = 'align-vh brd-c12 sel-off';
                    return [
                        {size:120,html:a,className,onClick:()=>setState({...state,a:a + 1})},
                        {size:120,html:b,className,onClick:()=>setState('b',b + 1)},
                        {size:120,html:c,className,onClick:()=>setState({...state,c:c + 1})},
                    ]
                }
            }}
        />
    )
}
                `}
            />
        </div>
    )
}

function ReOrder() {
    let [recentFiles,setRecentFiles] = useState([
        { id:'0',path: mdiCamera, text: 'IMG_100000', type: 'PNG',size:'10 MB', color: '#6663fe' },
        { id:'1',path: mdiFileDocument, text: 'Startup pitch', type: 'AVI',size:'23 MB', color: '#00a0b6' },
        { id:'2',path: mdiMonitor, text: 'freestyle beat', type: 'MP3',size:'50 MB', color: '#e06c9f' },
        { id:'3',path: mdiListBox, text: 'Work proposal', type: 'DOCx',size:'30 KB', color: '#266fd5' },
    ])
    return (
        <div className='example' style={{background:'#eee'}}>
            <Part
                title='reOrder'
                content={(
                    <RVD
                        rootNode={{
                            data:recentFiles,
                            reOrder:(newData,fromIndex,toIndex)=>setRecentFiles(newData),
                            column:recentFiles.map((o,i)=>{
                                let {id,path,text,type,size,color} = o;
                                return {
                                    key:id,
                                    className:'p-6 br-8 fs-12 gap-12 h-60 bg32 m-b-12 align-v',
                                    row:[
                                        {
                                            html:<Icon path={path} size={0.6}/>,
                                            className:'w-24 h-24 br-4 c32 align-vh',
                                            style:{background:color}
                                        },
                                        {
                                            html:text,size:120,
                                            className:'bold align-v'
                                        },
                                        {
                                            html:type + ' file',
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:size,
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:<Icon path={mdiShare} size={0.6}/>,
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:<Icon path={mdiDotsHorizontal} size={0.6}/>,
                                            className:'flex-1 align-vh'
                                        }
                                    ]
                                }
                            })
                        }}
                    />
                )}
                code={`
                
import RVD,{animate} from 'react-virtual-dom';
function App(){
    let [recentFiles,setRecentFiles] = useState([
        { id:'0',path: mdiCamera, text: 'IMG_100000', type: 'PNG',size:'10 MB', color: '#6663fe' },
        { id:'1',path: mdiFileDocument, text: 'Startup pitch', type: 'AVI',size:'23 MB', color: '#00a0b6' },
        { id:'2',path: mdiMonitor, text: 'freestyle beat', type: 'MP3',size:'50 MB', color: '#e06c9f' },
        { id:'3',path: mdiListBox, text: 'Work proposal', type: 'DOCx',size:'30 KB', color: '#266fd5' },
    ])
    function removeV(e,id){
        animate('removeV',$(e.currentTarget),()=>{
            setRecentFiles(recentFiles.filter((o,i)=>o.id !== id))
        })
    }
    return (
        <RVD
            rootNode={{
                data:recentFiles,
                reOrder:(newData,fromIndex,toIndex)=>setRecentFiles(newData),
                column:recentFiles.map((o,i)=>{
                    let {id,path,text,type,size,color} = o;
                    return {
                        key:id,
                        className:'p-6 br-8 fs-12 gap-12 h-60 bg32 m-b-12 align-v',
                        row:[
                            {
                                html:<Icon path={path} size={0.6}/>,
                                className:'w-24 h-24 br-4 c32 align-vh',
                                style:{background:color}
                            },
                            {
                                html:text,size:120,
                                className:'bold align-v'
                            },
                            {
                                html:type + ' file',
                                className:'flex-1 align-vh'
                            },
                            {
                                html:size,
                                className:'flex-1 align-vh'
                            },
                            {
                                html:<Icon path={mdiShare} size={0.6}/>,
                                className:'flex-1 align-vh'
                            },
                            {
                                html:<Icon path={mdiDotsHorizontal} size={0.6}/>,
                                className:'flex-1 align-vh'
                            }
                        ]
                    }
                })
            }}
        />
    )
}
                `}
            />
        </div>
    )
}

function LongTouch() {
    let [recentFiles,setRecentFiles] = useState([
        { id:'0',path: mdiCamera, text: 'IMG_100000', type: 'PNG',size:'10 MB', color: '#6663fe' },
        { id:'1',path: mdiFileDocument, text: 'Startup pitch', type: 'AVI',size:'23 MB', color: '#00a0b6' },
        { id:'2',path: mdiMonitor, text: 'freestyle beat', type: 'MP3',size:'50 MB', color: '#e06c9f' },
        { id:'3',path: mdiListBox, text: 'Work proposal', type: 'DOCx',size:'30 KB', color: '#266fd5' },
    ])
    return (
        <div className='example' style={{background:'#eee'}}>
            <Part
                title='reOrder'
                content={(
                    <RVD
                        rootNode={{
                            column:recentFiles.map((o,i)=>{
                                let {id,path,text,type,size,color} = o;
                                return {
                                    key:id,
                                    longTouch:()=>{
                                        alert(text)
                                    },
                                    className:'p-6 br-8 fs-12 gap-12 h-60 bg32 m-b-12 align-v',
                                    row:[
                                        {
                                            html:<Icon path={path} size={0.6}/>,
                                            className:'w-24 h-24 br-4 c32 align-vh',
                                            style:{background:color}
                                        },
                                        {
                                            html:text,size:120,
                                            className:'bold align-v'
                                        },
                                        {
                                            html:type + ' file',
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:size,
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:<Icon path={mdiShare} size={0.6}/>,
                                            className:'flex-1 align-vh'
                                        },
                                        {
                                            html:<Icon path={mdiDotsHorizontal} size={0.6}/>,
                                            className:'flex-1 align-vh'
                                        }
                                    ]
                                }
                            })
                        }}
                    />
                )}
                code={`
                
import RVD,{animate} from 'react-virtual-dom';
function App(){
    let [recentFiles,setRecentFiles] = useState([
        { id:'0',path: mdiCamera, text: 'IMG_100000', type: 'PNG',size:'10 MB', color: '#6663fe' },
        { id:'1',path: mdiFileDocument, text: 'Startup pitch', type: 'AVI',size:'23 MB', color: '#00a0b6' },
        { id:'2',path: mdiMonitor, text: 'freestyle beat', type: 'MP3',size:'50 MB', color: '#e06c9f' },
        { id:'3',path: mdiListBox, text: 'Work proposal', type: 'DOCx',size:'30 KB', color: '#266fd5' },
    ])
    function removeV(e,id){
        animate('removeV',$(e.currentTarget),()=>{
            setRecentFiles(recentFiles.filter((o,i)=>o.id !== id))
        })
    }
    return (
        <RVD
            rootNode={{
                data:recentFiles,
                reOrder:(newData,fromIndex,toIndex)=>setRecentFiles(newData),
                column:recentFiles.map((o,i)=>{
                    let {id,path,text,type,size,color} = o;
                    return {
                        key:id,
                        className:'p-6 br-8 fs-12 gap-12 h-60 bg32 m-b-12 align-v',
                        row:[
                            {
                                html:<Icon path={path} size={0.6}/>,
                                className:'w-24 h-24 br-4 c32 align-vh',
                                style:{background:color}
                            },
                            {
                                html:text,size:120,
                                className:'bold align-v'
                            },
                            {
                                html:type + ' file',
                                className:'flex-1 align-vh'
                            },
                            {
                                html:size,
                                className:'flex-1 align-vh'
                            },
                            {
                                html:<Icon path={mdiShare} size={0.6}/>,
                                className:'flex-1 align-vh'
                            },
                            {
                                html:<Icon path={mdiDotsHorizontal} size={0.6}/>,
                                className:'flex-1 align-vh'
                            }
                        ]
                    }
                })
            }}
        />
    )
}
                `}
            />
        </div>
    )
}
//linear-gradient(180deg, #000, #666);

function StyleGenerator(){
    let storage = AIOStorage('grdgenerator')
    let [popup] = useState(new AIOPopup())
    function to_array(c){
        if(Array.isArray(c)){return c}
        if(c.indexOf('rgb(') === 0){
          return c.slice(c.indexOf('(') + 1,c.indexOf(')')).split(',').map((o)=>+o);
        }
        c = c.substr(1);
        let values = c.split(''),r,g,b;
        if (c.length === 3) {
            r = parseInt(values[0] + values[0], 16);
            g = parseInt(values[1] + values[1], 16);
            b = parseInt(values[2] + values[2], 16);
        } 
        else if (c.length === 6) {
            r = parseInt(values[0] + values[1], 16);
            g = parseInt(values[2] + values[3], 16);
            b = parseInt(values[4] + values[5], 16);
        } 
        return [r,g,b];
      }
    function to_dark(c,percent){
        let [r,g,b] = to_array(c);
        r = Math.round(r - (r * (percent / 100)))
        g = Math.round(g - (g * (percent / 100)))
        b = Math.round(b - (b * (percent / 100)))
        return `rgb(${r},${g},${b})`
    }
    function between(c1,c2,count){
        var [r1,g1,b1] = to_array(c1);
        var [r2,g2,b2] = to_array(c2);
        var rDelta = (r2 - r1) / (count - 1);
        var gDelta = (g2 - g1) / (count - 1);
        var bDelta = (b2 - b1) / (count - 1);
        var colors = [];
        for(var i = 0; i < count; i++){
          let color = `rgb(${Math.round(r1 + rDelta * i)},${Math.round(g1 + gDelta * i)},${Math.round(b1 + bDelta * i)})`;
          colors.push(color)
        }
        return colors;
    }
    function change(key,value){
        setGrd({...grd,[key]:value})
    }
    function changeSelected(newSelected){
        setSelected(newSelected)
        storage.save({name:'selected',value:newSelected})
    }
    function addSelected(){
        changeSelected([...selected,{style:{...style},containerBG:grd.containerBG,grd:{...grd}}])
    }
    function removeSelected(i){
        changeSelected(selected.filter((o,index)=>index !== i))
    }
    let [grd,setGrd] = useState({
        light:'#999999',width:120,height:60,borderColor:'#999999',color:'#fff',
        borderWidth:1,contrast:50,borderRadius:6,bold:true,fontSize:14,
        containerBG:'#fff',p:50
    })
    let [selected,setSelected] = useState(storage.load({name:'selected',def:[]}))
    let dark = to_dark(grd.light,grd.contrast);
    let medium = between(grd.light,dark,3)[1];
    let style = {
        background:`linear-gradient(180deg, ${grd.light} 0%,${medium} ${grd.p}%, ${dark} 100%)`,
        width:grd.width,height:grd.height,
        border:`${grd.borderWidth}px solid ${grd.borderColor}`,
        borderRadius:grd.borderRadius,fontWeight:grd.bold?'bold':undefined,
        fontSize:grd.fontSize,color:grd.color

    }
    function color_node(key){
        return {
            size:36,className:'w-240',html:<AIOInput type='color' value={grd[key]} onChange={(v)=>change(key,v)} className='w-36 h-36 brd-c12'/>
        }
    }
    function slider_node(key,start,end){
        return {
            size:180,html:<AIOInput type='slider' showValue='inline' value={grd[key]} onChange={(v)=>change(key,v)} start={start} end={end}/>
        }
    }
    function checkbox_node(key){
        return {
            align:'v',
            flex:1,className:'w-240',html:<AIOInput type='checkbox' text={key} value={grd[key]} onChange={(v)=>change(key,v)}/>
        }
    }
    function log(i){
        let grd = selected[i].grd;
        let style = `
{
    background:linear-gradient(180deg, ${grd.light} 0%,${medium} ${grd.p}%, ${dark} 100%);
    width:${grd.width}px;
    height:${grd.height}px;
    border:${grd.borderWidth}px solid ${grd.borderColor};
    border-radius:${grd.borderRadius}px;
    font-weight:${grd.bold?'bold':'unset'};
    font-size:${grd.fontSize}px;
    color:${grd.color};
}
        
        `
        popup.addModal({
            position:'center',
            header:{title:'generated style'},
            body:{
                render:()=>{
                    return AIODoc().Code(style)
                }
            }
        })
    }
    return (
        <>
            <RVD
                rootNode={{
                    className:'h-fit align-v p-24',
                    column:[
                        {
                            row:[
                                {
                                    className:'p-12',
                                    column:[
                                        {
                                            className:'align-v gap-12',
                                            row:[
                                                {html:'Geadient'},color_node('light'),slider_node('contrast',0,100),slider_node('p',0,100)
                                            ]
                                        },
                                        {
                                            row:[
                                                {align:'v',row:[{html:'Width'},slider_node('width',0,300)]},
                                                {align:'v',row:[{html:'Height'},slider_node('height',0,300)]},
                                            ]
                                        },
                                        {
                                            className:'gap-12',
                                            row:[
                                                {className:'align-v gap-12',row:[{html:'Color'},color_node('color')]},
                                                {className:'align-v gap-12',row:[{html:'Border Color'},color_node('borderColor')]},
                                                {className:'align-v gap-12',row:[{html:'Container BG'},color_node('containerBG')]}
                                            ]
                                        },
                                        {
                                            row:[
                                                {align:'v',row:[{html:'Border Width'},slider_node('borderWidth',0,24)]},
                                                {align:'v',row:[{html:'Border Radius'},slider_node('borderRadius',0,36)]}
                                            ]
                                        },
                                        {align:'v',row:[{html:'Font Size'},slider_node('fontSize',10,36),checkbox_node('bold')]},
                                        {html:<button onClick={()=>addSelected()}>Add To Selected</button>}
                                    ]
                                },
                                {
                                    flex:1,className:'p-12 align-vh',style:{background:grd.containerBG},
                                    column:[
                                        {html:'Sample Text',style,className:'align-vh'}
                                    ]
                                },

                                
                            ]
                        },
                        {
                            className:'gap-12 p-24 brd-c12',style:{flexWrap:'wrap'},
                            row:selected.map((o,i)=>{
                                let {style,containerBG,grd} = o;
                                return {
                                    className:'p-12 of-visible brd-c16',
                                    onClick:()=>setGrd(grd),
                                    style:{background:containerBG},
                                    column:[
                                        {
                                            html:<div className='align-vh' style={style}>Sample Text</div>
                                        },
                                        {
                                            className:'of-visible br-100 absolute rvd-pointer',
                                            html:<Icon path={mdiClose} size={0.7}/>,
                                            onClick:(e)=>{e.stopPropagation(); removeSelected(i)},
                                            style:{left:-6,top:-6,background:'dodgerblue',color:'#fff'},
                                        },
                                        {
                                            className:'of-visible br-6 absolute fs-10 w-fit p-h-6 rvd-pointer',
                                            html:'CSS',
                                            onClick:(e)=>{e.stopPropagation(); log(i)},
                                            style:{right:-6,top:-6,background:'dodgerblue',color:'#fff'},
                                        }
                                    ]
                                }
                            })
                            
                        }
                    ]
                }}
            />
            {popup.render()}
        </>
    )
}