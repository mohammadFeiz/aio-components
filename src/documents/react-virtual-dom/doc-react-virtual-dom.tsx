import { useRef, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import Code from '../../npm/code/index';
import AIOPopup from '../../npm/aio-popup/index.tsx';
import RVD,{animate,I_RVD_node } from '../../npm/react-virtual-dom/index.tsx';
import AIOInput,{ AI, AI_labelItem, AI_range_handle_config } from '../../npm/aio-input/index.tsx';
import {Swip,Geo,Storage} from './../../npm/aio-utils';
import { Icon } from '@mdi/react';
import { mdiAccount, mdiAccountGroup, mdiArchive, mdiBookEducation, mdiCamera, mdiCarSettings, mdiClose, mdiCloudUpload, mdiDotsHorizontal, mdiFileDocument, mdiListBox, mdiMicrophone, mdiMonitor, mdiShare, mdiStar } from '@mdi/js';
import './index.css';
import $ from 'jquery';
export default function DOC_AIOShop(props:any) {
    return (
        <DOC
            {...props}
            nav={{
                nested: true,
                items: ()=>[
                    { text: 'html node object', id: 'hno', render: () => <Node /> },
                    { text: 'align', id: 'align', render: () => <Align /> },
                    { text: 'spacing', id: 'spacing', render: () => <Spacing /> },
                    { text: 'size', id: 'size', render: () => <Size /> },
                    { text: 'flex', id: 'flex', render: () => <Flex /> },
                    { text: 'sizing', id: 'sizing', render: () => <Sizing /> },
                    {text: 'layout', id: 'layout', render: () => <Layout />},
                    { text: 'loading', id: 'loading', render: () => <Loading /> },
                    { text: 'gap', id: 'gap', render: () => <Gap /> },
                    { text: 'Css Classes', id: 'css classes', render: () => <CssClasses /> },
                    { text: 'className', id: 'className', render: () => <ClassName /> },
                    { text: 'mountAfter', id: 'mountAfter', render: () => <MountAfter /> },
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
function Part(p:any) {
    let { content, code,title } = p;
    if (!content) { return null }
    if(typeof content === 'function'){content = content()}
    return (
        <>
            {title && <h3>{title}</h3>}
            <div>{content}</div>
            {Code(code)}
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
        </>
    )
}
function Node() {
    function Cell(){
        let cell:I_RVD_node = {html:'A',className:'p-12 brd-c-24'};
        return cell
    }
    function Row(){
        let row:I_RVD_node = {
            className:'gap-12',
            row:[Cell(),Cell(),Cell(),Cell()]
        }
        return row
    }
    function Table(){
        let table:I_RVD_node = {
            className:'gap-12',
            column:[Row(),Row(),Row(),Row()]
        }
        return table
    }
    let CellCode = 
`function Cell(){
    let cell:I_RVD_node = {html:'A',className:'p-12 brd-c-24'};
    return cell
}`
    let RowCode = 
`function Row(){
    let row:I_RVD_node = {
        className:'gap-12',
        row:[Cell(),Cell(),Cell(),Cell()]
    }
    return row
}`
    let TableCode = 
`function Table(){
    let table:I_RVD_node = {
        className:'gap-12',
        column:[Row(),Row(),Row(),Row()]
    }
    return table
}`
    return (
        <div className='example'>
            <Part
                title='html'
                content={()=><RVD rootNode={Cell()}/>}
                code={
`${CellCode}
return <RVD rootNode={Cell()}/>`
                }
            />
            <Part
                title='row'
                content={()=><RVD rootNode={Row()}/>}
                code={
`${CellCode}
${RowCode}
return <RVD rootNode={Row()}/>`
                }
            />
            <Part
                title='column'
                content={()=><RVD rootNode={Table()}/>}
                code={
`${CellCode}
${RowCode}
${TableCode}
return (
    <RVD rootNode={Table()}/>
)`
                }
            />
            <Part
                content={()=>{
                    let rootNode:I_RVD_node = {
                        className:'h-96 brd-c-16',
                        row:[
                            {
                                html:'A',className:'bg-12 flex-1 align-vh c-15'
                            },
                            {
                                flex:1,
                                column:[
                                    {html:'A',className:'bg-16 flex-1 align-vh'},
                                    {html:'A',className:'bg-20 flex-1 align-vh'}
                                ]
                            },
                            {
                                className:'flex-1',
                                column:[
                                    {html:'A',className:'bg-24 flex-1 align-vh'},
                                    {html:'A',className:'bg-28 flex-1 align-vh'},
                                    {html:'A',className:'bg-32 flex-1 align-vh'},
                                ]
                            }
                        ]
                    }
                    return (<RVD rootNode={rootNode}/>)
                }}
                code={`
function Layout(){
    return (
        <RVD
            rootNode={{
                className:'h-96 brd-c-16',
                row:[
                    {
                        html:'A',className:'bg-12 flex-1 align-vh c-32'
                    },
                    {
                        flex:1,
                        column:[
                            {html:'A',className:'bg-16 flex-1 align-vh'},
                            {html:'A',className:'bg-20 flex-1 align-vh'}
                        ]
                    },
                    {
                        className:'flex-1',
                        column:[
                            {html:'A',className:'bg-24 flex-1 align-vh'},
                            {html:'A',className:'bg-28 flex-1 align-vh'},
                            {html:'A',className:'bg-32 flex-1 align-vh'},
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
                    let node_A = {html:'A',className:'brd-c-12 w-72 h-72'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c-12 w-72 h-72'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-v as className'
                content={()=>{
                    let node_A:I_RVD_node = {html:'A',className:'brd-c-12 w-72 h-72 align-v'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c-12 w-72 h-72 align-v'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-v as property'
                content={()=>{
                    let node_A:I_RVD_node = {html:'A',align:'v',className:'brd-c-12 w-72 h-72'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',align:'v',className:'brd-c-12 w-72 h-72'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-h as className'
                content={()=>{
                    let node_A:I_RVD_node = {html:'A',className:'brd-c-12 w-72 h-72 align-h'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c-12 w-72 h-72 align-h'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-h as property'
                content={()=>{
                    let node_A:I_RVD_node = {html:'A',align:'h',className:'brd-c-12 w-72 h-72'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',align:'h',className:'brd-c-12 w-72 h-72'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-vh as className'
                content={()=>{
                    let node_A:I_RVD_node = {html:'A',className:'brd-c-12 w-72 h-72 align-vh'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c-12 w-72 h-72 align-vh'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-vh as property'
                content={()=>{
                    let node_A:I_RVD_node = {html:'A',align:'vh',className:'brd-c-12 w-72 h-72'};
                    return <RVD rootNode={node_A}/>
                }}
                code={`
function Layout(){
    let node_A = {html:'A',align:'vh',className:'brd-c-12 w-72 h-72'};
    return <RVD rootNode={node_A}/>
}
                `}
            />
            <Part
                title='align-v in column'
                content={()=>{
                    let node_A:I_RVD_node = {html:'A',className:'brd-c-12 w-72 h-72 align-vh'};
                    let rootNode:I_RVD_node = {
                        className:'h-300 w-fit brd-c-12 align-v p-12',
                        column:[node_A,node_A]
                    }
                    return (<RVD rootNode={rootNode}/>)
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c-12 w-72 h-72 align-vh'};
    return (
        <RVD 
            rootNode={{
                className:'h-300 w-fit brd-c-12 align-v p-12',
                column:[node_A,node_A]
            }}
        />
    )
}
                `}
            />
            <Part
                title='align-h in row'
                content={()=>{
                    let node_A:I_RVD_node = {html:'A',className:'brd-c-12 w-72 h-72 align-vh'};
                    let rootNode:I_RVD_node = {className:'w-300 h-fit brd-c-12 align-h p-12',row:[node_A,node_A]}
                    return (<RVD rootNode={rootNode}/>)
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c-12 w-72 h-72 align-vh'};
    return (
        <RVD 
            rootNode={{
                className:'w-300 h-fit brd-c-12 align-h p-12',
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
                    let node_A = {html:'A',className:'brd-c-12 w-72 h-72'};
                    let rootNode:I_RVD_node = {className:'w-300 brd-c-12 p-12',row:[node_A,{className:'flex-1'},node_A]}
                    return (<RVD rootNode={rootNode}/>)
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c-12 w-72 h-72'};
    return (
        <RVD 
            rootNode={{
                className:'w-300 brd-c-12 p-12',
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
                    let node_A:I_RVD_node = {html:'A',className:'brd-c-12 w-72 h-72'};
                    let rootNode:I_RVD_node = {className:'brd-c-12 p-12',row:[node_A,{className:'flex-1'},node_A,{className:'flex-3'},node_A]}
                    return (<RVD rootNode={rootNode}/>)
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c-12 w-72 h-72'};
    return (
        <RVD 
            rootNode={{
                className:'brd-c-12 p-12',
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
                    let node_A = {html:'A',className:'brd-c-12 w-72 h-72'};
                    return (
                        <RVD 
                            rootNode={{
                                className:'brd-c-12 p-12',
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
    let node_A = {html:'A',className:'brd-c-12 w-72 h-72'};
    return (
        <RVD 
            rootNode={{
                className:'brd-c-12 p-12',
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
                    let node_A = {html:'A',className:'brd-c-12 w-72 h-72'};
                    return (
                        <RVD 
                            rootNode={{
                                className:'brd-c-12 p-12 gap-24',
                                row:[node_A,node_A,node_A,node_A]
                            }}
                        />
                    )
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c-12 w-72 h-72'};
    return (
        <RVD 
            rootNode={{
                className:'brd-c-12 p-12 gap-24',
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
                    let node_A = {html:'A',className:'brd-c-12 w-72 h-72'};
                    return (
                        <RVD 
                            rootNode={{
                                className:'brd-c-12 p-12',
                                gap:{flex:1},
                                row:[node_A,node_A,node_A,node_A]
                            }}
                        />
                    )
                }}
                code={`
function Layout(){
    let node_A = {html:'A',className:'brd-c-12 w-72 h-72'};
    return (
        <RVD 
            rootNode={{
                className:'brd-c-12 p-12',
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
                title='row of nodes'
                content={()=>{
                    let row = {
                        row:[
                            {html:'A',className:'brd-c-16',size:24},
                            {html:'A',className:'brd-c-16',size:48},
                            {html:'A',className:'brd-c-16',size:60}
                        ]
                    }
                    return <RVD rootNode={row}/>
                }}
                code={`
function Layout(){
    let row = {
        row:[
            {html:'A',className:'brd-c-16',size:24},
            {html:'A',className:'brd-c-16',size:48},
            {html:'A',className:'brd-c-16',size:60}
        ]
    }
    return <RVD rootNode={row}/>
}
                `}
            />
            <Part
                title='column of rows'
                content={()=>{
                    let table = {
                        column:[
                            {
                                size:24,
                                row:[
                                    {html:'A',className:'brd-c-16',size:24},
                                    {html:'A',className:'brd-c-16',size:48},
                                    {html:'A',className:'brd-c-16',size:60}
                                ]
                            },
                            {
                                size:48,
                                row:[
                                    {html:'A',className:'brd-c-16',size:24},
                                    {html:'A',className:'brd-c-16',size:48},
                                    {html:'A',className:'brd-c-16',size:60}
                                ]
                            },
                            {
                                size:60,
                                row:[
                                    {html:'A',className:'brd-c-16',size:24},
                                    {html:'A',className:'brd-c-16',size:48},
                                    {html:'A',className:'brd-c-16',size:60}
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
                    {html:'A',className:'brd-c-16',size:24},
                    {html:'A',className:'brd-c-16',size:48},
                    {html:'A',className:'brd-c-16',size:60}
                ]
            },
            {
                size:48,
                row:[
                    {html:'A',className:'brd-c-16',size:24},
                    {html:'A',className:'brd-c-16',size:48},
                    {html:'A',className:'brd-c-16',size:60}
                ]
            },
            {
                size:60,
                row:[
                    {html:'A',className:'brd-c-16',size:24},
                    {html:'A',className:'brd-c-16',size:48},
                    {html:'A',className:'brd-c-16',size:60}
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
                title='flex by className'
                content={()=>{
                    let table = {
                        className:'w-120 h-120',
                        column:[
                            {
                                className:'flex-1',
                                row:[
                                    {html:'A',className:'brd-c-16 flex-1'},
                                    {html:'A',className:'brd-c-16 flex-2'},
                                    {html:'A',className:'brd-c-16 flex-3'}
                                ]
                            },
                            {
                                className:'flex-2',
                                row:[
                                    {html:'A',className:'brd-c-16 flex-1'},
                                    {html:'A',className:'brd-c-16 flex-2'},
                                    {html:'A',className:'brd-c-16 flex-3'}
                                ]
                            },
                            {
                                className:'flex-3',
                                row:[
                                    {html:'A',className:'brd-c-16 flex-1'},
                                    {html:'A',className:'brd-c-16 flex-2'},
                                    {html:'A',className:'brd-c-16 flex-3'}
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
                    {html:'A',className:'brd-c-16 flex-1'},
                    {html:'A',className:'brd-c-16 flex-2'},
                    {html:'A',className:'brd-c-16 flex-3'}
                ]
            },
            {
                className:'flex-2',
                row:[
                    {html:'A',className:'brd-c-16 flex-1'},
                    {html:'A',className:'brd-c-16 flex-2'},
                    {html:'A',className:'brd-c-16 flex-3'}
                ]
            },
            {
                className:'flex-3',
                row:[
                    {html:'A',className:'brd-c-16 flex-1'},
                    {html:'A',className:'brd-c-16 flex-2'},
                    {html:'A',className:'brd-c-16 flex-3'}
                ]
            }
        ]
    }
    return <RVD rootNode={table}/>
}
                `}
            />
            <Part
                title='flex by property'
                content={()=>{
                    let table = {
                        className:'w-120 h-120',
                        column:[
                            {
                                flex:1,
                                row:[
                                    {html:'A',flex:1,className:'brd-c-16'},
                                    {html:'A',flex:2,className:'brd-c-16'},
                                    {html:'A',flex:3,className:'brd-c-16'}
                                ]
                            },
                            {
                                flex:2,
                                row:[
                                    {html:'A',flex:1,className:'brd-c-16'},
                                    {html:'A',flex:2,className:'brd-c-16'},
                                    {html:'A',flex:3,className:'brd-c-16'}
                                ]
                            },
                            {
                                flex:3,
                                row:[
                                    {html:'A',flex:1,className:'brd-c-16'},
                                    {html:'A',flex:2,className:'brd-c-16'},
                                    {html:'A',flex:3,className:'brd-c-16'}
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
                flex:1,
                row:[
                    {html:'A',flex:1,className:'brd-c-16'},
                    {html:'A',flex:2,className:'brd-c-16'},
                    {html:'A',flex:3,className:'brd-c-16'}
                ]
            },
            {
                flex:2,
                row:[
                    {html:'A',flex:1,className:'brd-c-16'},
                    {html:'A',flex:2,className:'brd-c-16'},
                    {html:'A',flex:3,className:'brd-c-16'}
                ]
            },
            {
                flex:3,
                row:[
                    {html:'A',flex:1,className:'brd-c-16'},
                    {html:'A',flex:2,className:'brd-c-16'},
                    {html:'A',flex:3,className:'brd-c-16'}
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
function Layout() {
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
    function CategoryCard(category:any){
        return {
            style: {background:category.color,color:'#fff'},
            className: 'p-6 fs-12 br-8 w-84',
            column: [
                { html:<Icon path={category.path} size={0.6}/>,className:'p-v-6'},
                { html: category.text,className:'bold' },
                { html: category.length + ' files', style: { fontSize: '85%' }, className: 'op-80' }
            ],
        }
    }
    function FileCard(file:any){
        return {
            style: {background:'#fff',color:file.color},
            className: 'p-6 fs-12 br-8 w-84',
            column: [
                { html:<Icon path={file.path} size={0.6}/>,className:'p-v-6'},
                { html: file.text,className:'bold' },
                { html: file.length + ' files', style: { fontSize: '85%' }, className: 'op-80' }
            ],
        }
    }
    function RecentFileCard(recentFile:any){
        return {
            style:{background:'#fff'},className:'p-6 br-8 fs-12 gap-12 align-v',
            row:[
                {
                    html:<Icon path={recentFile.path} size={0.6}/>,
                    className:'w-24 h-24 br-4 align-vh',
                    style:{color:'#fff',background:recentFile.color}
                },
                {html:recentFile.text,size:120,className:'bold align-v'},
                {html:recentFile.type + ' file',flex:1,className:'aling-vh'},
                {html:recentFile.size,flex:1,classNAme:'align-vh'},
                {html:<Icon path={mdiShare} size={0.8}/>,className:'flex-1'},
                {html:<Icon path={mdiDotsHorizontal} size={0.8}/>,className:'flex-1'},
            ]
        }
    }
    function Categories(categories:any){
        return {
            column:[
                {html:'Categories',className:'bold fs-14',style:{color:'#174484'}},
                {className: 'gap-12',row: categories.map((o:any) => CategoryCard(o))}
            ],
        }
    }
    function Files(files:any){
        return {
            column:[
                {html:'Files',className:'bold fs-14',style:{color:'#174484'}},
                {className: 'gap-12',row: files.map((o:any) => FileCard(o))}
            ],
        }
    }
    function RecentFiles(recentFiles:any){
        return {
            column:[
                {html:'Recent Files',className:'bold fs-14',style:{color:'#174484'}},
                {className:'gap-6',column:recentFiles.map((o:any)=>RecentFileCard(o))}
            ]
        }
    }
    function Body(){
        return {
            className:'gap-24 p-12 flex-1',
            column:[
                Categories(categories),
                Files(files),
                RecentFiles(recentFiles),
            ]
        }
    }
    function SideItem(sideItem:any){
        return {
            className: 'p-h-24 gap-12 fs-12 align-v', size: 36,
            row: [
                { html:<Icon path={sideItem.path} size={0.6}/>},
                { html: sideItem.text}
            ]
        }
    }
    function Side(sideItems:any){
        return {
            style: { background: 'rgb(10, 38, 116)', color: '#fff', width: 200 },
            column: [
                {size: 100, className: 'align-vh',html: <Icon path={mdiAccount} size={2} />},
                {column: sideItems.map((sideItem:any) => SideItem(sideItem))}
            ]
        }
    }
    function Page(){
        return {
            className:'bg-30',
            row:[
                Side(sideItems),
                Body()
            ]
        }
    } 
    let CategoryCardCode = 
`function CategoryCard(category){
    return {
        style: {background:category.color,color:'#fff'},
        className: 'p-6 fs-12 br-8 w-84',
        column: [
            { html:<Icon path={category.path} size={0.6}/>,className:'p-v-6'},
            { html: category.text,className:'bold' },
            { html: category.length + ' files', style: { fontSize: '85%' }, className: 'op-80' }
        ],
    }
}`
let FileCardCode = 
`function FileCard(file){
    return {
        style: {background:'#fff',color:file.color},
        className: 'p-6 fs-12 br-8 w-84',
        column: [
            { html:<Icon path={file.path} size={0.6}/>,className:'p-v-6'},
            { html: file.text,className:'bold' },
            { html: file.length + ' files', style: { fontSize: '85%' }, className: 'op-80' }
        ],
    }
}`
let RecentFileCardCode = 
`function RecentFileCard(recentFile){
    return {
        style:{background:'#fff'},className:'p-6 br-8 fs-12 gap-12 align-v',
        row:[
            {
                html:<Icon path={recentFile.path} size={0.6}/>,
                className:'w-24 h-24 br-4 align-vh',
                style:{color:'#fff',background:recentFile.color}
            },
            {html:recentFile.text,size:120,className:'bold align-v'},
            {html:recentFile.type + ' file',flex:1,className:'aling-vh'},
            {html:recentFile.size,flex:1,classNAme:'align-vh'},
            {html:<Icon path={mdiShare} size={0.8}/>,className:'flex-1'},
            {html:<Icon path={mdiDotsHorizontal} size={0.8}/>,className:'flex-1'},
        ]
    }
}`
let CategoriesCode = 
`function Categories(categories){
    return {
        column:[
            {html:'Categories',className:'bold fs-14',style:{color:'#174484'}},
            {className: 'gap-12',row: categories.map((o) => CategoryCard(o))}
        ],
    }
}`
let FilesCode = 
`function Files(files){
    return {
        column:[
            {html:'Files',className:'bold fs-14',style:{color:'#174484'}},
            {className: 'gap-12',row: files.map((o) => FileCard(o))}
        ],
    }
}`
let RecentFilesCode = 
`function RecentFiles(recentFiles){
    return {
        column:[
            {html:'Recent Files',className:'bold fs-14',style:{color:'#174484'}},
            {className:'gap-6',column:recentFiles.map((o)=>RecentFileCard(o))}
        ]
    }
}`
let BodyCode = 
`function Body(){
    return {
        className:'gap-12 p-12 flex-1',
        column:[
            Categories(categories),
            Files(files),
            RecentFiles(recentFiles),
        ]
    }
}`
let SideItemCode = 
`function SideItem(sideItem){
    return {
        className: 'p-h-24 gap-12 fs-12 align-v', size: 36,
        row: [
            { html:<Icon path={sideItem.path} size={0.6}/>},
            { html: sideItem.text}
        ]
    }
}`
let SideCode = 
`function Side(sideItems){
    return {
        style: { background: 'rgb(10, 38, 116)', color: '#fff', width: 200 },
        column: [
            {size: 100, className: 'align-vh',html: <Icon path={mdiAccount} size={2} />},
            {column: sideItems.map((sideItem) => SideItem(sideItem))}
        ]
    }
}`
let PageCode = 
`function Page(){
    return {
        className:'bg-30',
        row:[
            Side(sideItems),
            Body()
        ]
    }
}`
    return (
        <div className='example' style={{background:'#f8f8f8'}}>
            <h3>App Data</h3>
            {Code(
`let sideItems = [
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
]`
            )}
            <h3>Render Category Card</h3>
            <RVD rootNode={CategoryCard(categories[0])}/>
            {Code(
`${CategoryCardCode}
return <RVD rootNode={CategoryCard(categories[0])}/>`
            )}
            <h3>Render Categories</h3>
            <RVD rootNode={Categories(categories)}/>
            {Code(
`${CategoriesCode}
return <RVD rootNode={Categories(categories)}/>`
            )}
            <h3>Render File Card</h3>
            <RVD rootNode={FileCard(files[0])}/>
            {Code(
`${FileCardCode}
return <RVD rootNode={FileCard(files[0])}/>`
            )}
            <h3>Render Files</h3>
            <RVD rootNode={Files(files)}/>
            {Code(
`${FilesCode}
return <RVD rootNode={Files(files)}/>`
            )}
            <h3>Render Recent File Card</h3>
            <RVD rootNode={RecentFileCard(recentFiles[0])}/>
            {Code(
`${RecentFileCardCode}
return <RVD rootNode={RecentFileCard(files[0])}/>`
            )}
            <h3>Render Recent Files</h3>
            <RVD rootNode={RecentFiles(recentFiles)}/>
            {Code(
`${RecentFilesCode}
return <RVD rootNode={RecentFiles(recentFiles)}/>`
            )}
            <h3>Render Side Item</h3>
            <RVD rootNode={SideItem(sideItems[0])}/>
            {Code(
`${SideItemCode}
return <RVD rootNode={SideItem(sideItems[0])}/>`
            )}
            <h3>Render App Side</h3>
            <RVD rootNode={Side(sideItems)}/>
            {Code(
`${SideCode}
return <RVD rootNode={Side(sideItems)}/>`
            )}
            <h3>Render App Body</h3>
            <RVD rootNode={Body()}/>
            {Code(
`${BodyCode}
return <RVD rootNode={Body()}/>`
            )}
            <h3>Render App Page</h3>
            <RVD rootNode={Page()}/>
            {Code(
`${PageCode}
return <RVD rootNode={Page()}/>`
            )}
        </div>
    )
}
function Loading() {
    let recentFile = { path: mdiCamera, text: 'IMG_100000', type: 'PNG',size:'10 MB', color: '#6663fe' }
    let recentFileLoading = { path: mdiCamera, text: 'loading text', type: 'any',size:'any size', color: 'any color' }
    function RecentFileCard(recentFile:any,loading?:boolean){
        return {
            loading,
            style:{background:'#fff'},className:'p-6 br-8 fs-12 gap-12 align-v',
            row:[
                {
                    html:<Icon path={recentFile.path} size={0.6}/>,
                    className:'w-24 h-24 br-4 align-vh',
                    style:{color:'#fff',background:recentFile.color}
                },
                {html:recentFile.text,size:120,className:'bold align-v'},
                {html:recentFile.type + ' file',flex:1,className:'aling-vh'},
                {html:recentFile.size,flex:1,classNAme:'align-vh'},
                {html:<Icon path={mdiShare} size={0.8}/>,className:'flex-1'},
                {html:<Icon path={mdiDotsHorizontal} size={0.8}/>,className:'flex-1'},
            ]
        }
    }
    return (
        <div className='example' style={{background:'#eee'}}>
            <Part
                content={(
                    <RVD
                        rootNode={{
                            className:'gap-12',
                            column:[
                                RecentFileCard(recentFile),
                                RecentFileCard(recentFileLoading,true)
                            ]
                        }}
                    />
                )}
                code={`
function App(){
    function RecentFileCard(recentFile,loading){
        return {
            loading,
            style:{background:'#fff'},className:'p-6 br-8 fs-12 gap-12 align-v',
            row:[
                {
                    html:<Icon path={recentFile.path} size={0.6}/>,
                    className:'w-24 h-24 br-4 align-vh',
                    style:{color:'#fff',background:recentFile.color}
                },
                {html:recentFile.text,size:120,className:'bold align-v'},
                {html:recentFile.type + ' file',flex:1,className:'aling-vh'},
                {html:recentFile.size,flex:1,classNAme:'align-vh'},
                {html:<Icon path={mdiShare} size={0.8}/>,className:'flex-1'},
                {html:<Icon path={mdiDotsHorizontal} size={0.8}/>,className:'flex-1'},
            ]
        }
    }
    let recentFile = { 
        path: mdiCamera, 
        text: 'IMG_100000', 
        type: 'PNG',
        size:'10 MB', 
        color: '#6663fe' 
    }
    let recentFileLoading = { 
        path: mdiCamera, 
        text: 'any text', 
        type: 'any',
        size:'any size', 
        color: 'any color' 
    }
    return (
        <RVD
            rootNode={{
                className:'gap-12',
                column:[
                    RecentFileCard(recentFile),
                    RecentFileCard(recentFileLoading,true)
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
    function rows_layout(rows:any){
        return {
            column:[
                {
                    html:'Css Classes',className:'bold'
                },
                {
                    column:rows.map((v:any)=>{
                        if(v[0] === '.'){
                            return {html:Code(v),flex:1}
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
'.bg-<i>{background:rgb(i * 8,i * 8,i * 8)} (0 to 32)',
`.bg-0{background:rgb(0,0,0);}`,
`.bg-1{background:rgb(8,8,8);}`,
`...`,
`.bg-31{background:rgb(248,248,248);}`,
`.bg-32{background:rgb(255,255,255);}`,
'color (black to white)',
'.c-<i>{color:rgb(i * 8,i * 8,i * 8)} (0 to 32)',
`.c-0{color:rgb(0,0,0);}`,
`.c-1{color:rgb(8,8,8);}`,
`...`,
`.c-31{color:rgb(248,248,248);}`,
`.c-32{color:rgb(255,255,255);}`,
'border color',
`.brd-c-<i>{border:1px solid rgb(i * 8,i * 8,i * 8)} (0 to 32)`,
`.brd-c-0{border:1px solid rgb(0,0,0);}`,
`.brd-c-1{border:1px solid rgb(8,8,8);}`,
'...',
`.brd-c-31{border:1px solid rgb(248,248,248);}`,
`.brd-c-32{border:1px solid rgb(255,255,255);}`,
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
function ClassName() {
    let [round,setRound] = useState(false);

    return (
        <div className='example'>
            <RVD 
                rootNode={{
                    className:'gap-12',
                    row:[
                        {
                            className:'flex-1 brd-c-0 p-12',html:'box1'
                        },
                        {
                            className:[
                                'flex-1 brd-c-0 p-12 sel-off',
                                round?'br-12':false,
                            ],
                            html:'click here to set br-12 className',
                            onClick:()=>setRound(!round)
                        }
                    ]
                }}
            />
            {Code(
`let [round,setRound] = useState(false);
return (
    <RVD 
        rootNode={{
            className:'gap-12',
            row:[
                {
                    className:'flex-1 brd-c-0 p-12',html:'box1'
                },
                {
                    className:[
                        'flex-1 brd-c-0 p-12 sel-off',
                        round?'br-12':false,
                    ],
                    html:'click here to set br-12 className',
                    onClick:()=>setRound(!round)
                }
            ]
        }}
    />
)`
            )}
                
        </div>
    )
}
function MountAfter() {
    let [clicked,setClicked] = useState(false)
    return (
        <div className='example'>
            <button onClick={()=>setClicked(true)} className='m-b-24'>click here to set not-mounted className</button>
            <RVD 
                rootNode={{
                    className:'gap-12',
                    row:new Array(6).fill(0).map((o,i)=>{
                        return {
                            className:[
                                'w-48 c-32 p-12 y-effect align-vh br-6',
                                clicked?'not-mounted':false
                            ],html:'box1',
                            style:{background:'dodgerblue'},
                            mountAfter:i * 100,
                        }
                    })
                }}
            />
            {
                Code(
`<RVD 
    rootNode={{
        className:'gap-12',
        row:new Array(12).fill(0).map((o,i)=>{
            return {
                className:'w-48 c-32 p-12 y-effect align-vh br-6',html:'box1',
                mountAfter:i * 100,
            }
        })
    }}
/>`
                )
            }
            {
                Code(
`.y-effect.not-mounted{
    transform:translateX(100vw);
    opacity:0;
    transition:1s;
}
.y-effect{
    transform:translateX(0vw);
    opacity:1;
    transition:1s;
}`
                )
            }
            <RVD 
                rootNode={{
                    className:'gap-12',
                    column:new Array(6).fill(0).map((o,i)=>{
                        return {
                            className:[
                                'w-100 c-32 p-12 x-effect align-vh br-6',
                                clicked?'not-mounted':false
                            ],
                            html:'box1',
                            style:{background:'dodgerblue'},
                            mountAfter:i * 160,
                        }
                    })
                }}
            />
             {
                Code(
`<RVD 
    rootNode={{
        className:'gap-12',
        column:new Array(6).fill(0).map((o,i)=>{
            return {
                className:'w-100 c-32 p-12 x-effect align-vh br-6',html:'box1',
                mountAfter:i * 160,
            }
        })
    }}
/>`
                )
            }
            {
                Code(
`.x-effect.not-mounted{
    transform:rotateX(90deg);
    transition:1s;
}
.x-effect{
    transform:rotateX(0deg);
    transition:1s;
}`
                )
            }   
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
    function card_layout(p:any){
        let { id,path, text, length, color } = p
        return {
            key:id,style: { background: color, color: '#fff' },className: 'p-6 fs-12 br-8 m-r-12 w-120 h-84 of-hidden',onClick:(e:Event)=>removeH(e,id),
            column: [
                {html:<Icon path={path} size={0.6}/>,className:'align-vh bg-32 w-24 h-24 br-100 m-b-6',style:{color}},
                {html: text,className:'bold'},
                {html: length + ' files', className: 'op-80 fs-p85'}
            ]
        }
    }
    function recentFile_node(o:any,p:any){
        let {id,path,text,type,size,color} = o;
        return {
            key:id,className:'p-6 br-8 fs-12 gap-12 h-60 bg-32 m-b-12 align-v',
            row:[
                {html:<Icon path={path} size={0.6}/>,className:'w-24 h-24 br-4 c-32 align-vh',style:{background:color}},
                {html:text,size:120,className:'bold align-v'},
                {html:type + ' file',className:'flex-1 align-vh'},
                {html:size,className:'flex-1 align-vh'},
                {html:<Icon path={mdiShare} size={0.6}/>,className:'flex-1 align-vh'},
                {html:<Icon path={mdiDotsHorizontal} size={0.6}/>,className:'flex-1 align-vh'}
            ],
            ...p
        }
    }
    function removeV(e:any,id:any){animate('removeV',$(e.currentTarget),()=>{setRecentFiles(recentFiles.filter((o,i)=>o.id !== id))})}
    function removeL(e:any,id:any){animate('removeL',$(e.currentTarget),()=>{setRecentFiles(recentFiles.filter((o,i)=>o.id !== id))})}
    function removeH(e:any,id:any){animate('removeH',$(e.currentTarget),()=>{setFiles(files.filter((o,i)=>o.id !== id))})}
    function removeR(e:any,id:any){animate('removeR',$(e.currentTarget),()=>{setRecentFiles(recentFiles.filter((o,i)=>o.id !== id))})}
    return (
        <div className='example' style={{background:'#eee'}}>
            <Part
                title='removeV'
                content={(<RVD rootNode={{column:recentFiles.map((o,i)=>recentFile_node(o,{onClick:(e:Event)=>removeV(e,o.id)}))}}/>)}
                code={`
                
import RVD,{animate} from 'react-virtual-dom';
function App(){
    let [recentFiles,setRecentFiles] = useState(...)
    return (
        <RVD
            rootNode={{
                column:recentFiles.map((o,i)=>{
                    return {
                        ...
                        onClick:(e)=>{
                            animate('removeV',$(e.currentTarget),()=>{
                                setRecentFiles(recentFiles.filter((o,i)=>o.id !== id))
                            })
                        },
                        ...
                    }
                })
            }}
        />
    )
}
                `}
            />
            <Part
                title='removeH'
                content={(<RVD rootNode={{row: files.map((o) => card_layout(o))}}/>)}
                code={`
import RVD,{animate} from 'react-virtual-dom';
function App(){
    let [files,setFiles] = useState(...)
    function card_layout({ id,path, text, length, color }){
        return {
            ...
            onClick:(e)=>removeH(e,id),
            ...
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
                title='removeL'
                content={(<RVD rootNode={{column:recentFiles.map((o,i)=>recentFile_node(o,{onClick:(e:Event)=>removeL(e,o.id)}))}}/>)}
                code={`
                
import RVD,{animate} from 'react-virtual-dom';
function App(){
    let [recentFiles,setRecentFiles] = useState(...)
    return (
        <RVD
            rootNode={{
                column:recentFiles.map((o,i)=>{
                    let {id,path,text,type,size,color} = o;
                    return {
                        ...
                        onClick:(e)=>removeL(e,o.id),
                        ...
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
                content={(<RVD rootNode={{column:recentFiles.map((o,i)=>recentFile_node(o,{onClick:(e:Event)=>removeR(e,o.id)}))}}/>)}
                code={`
                
import RVD,{animate} from 'react-virtual-dom';
function App(){
    let [recentFiles,setRecentFiles] = useState(...)
    return (
        <RVD
            rootNode={{
                column:recentFiles.map((o,i)=>{
                    let {id,path,text,type,size,color} = o;
                    return {
                        ...
                        onClick:(e)=>removeR(e,o.id),
                        ...
                    }
                })
            }}
        />
    )
}
                `}
            />
            <Part
                title='custom(array)'
                content={(
                    <RVD 
                        rootNode={{
                            column:recentFiles.map((o,i)=>{
                                return recentFile_node(o,{
                                    onClick:(e:Event)=>{
                                        animate(
                                            [[{ height: 100,padding:12 }, 260],[{ height: 0,padding:0,margin:0 }, 260]],
                                            $(e.currentTarget),
                                            ()=>setRecentFiles(recentFiles.filter((rf,i)=>o.id !== rf.id)
                                        ))
                                    }
                                })
                            })
                        }}
                    />
                )}
                code={`
                
import RVD,{animate} from 'react-virtual-dom';
function App(){
    let [recentFiles,setRecentFiles] = useState(...)
    return (
        <RVD 
            rootNode={{
                column:recentFiles.map((o,i)=>{
                    return recentFile_node(o,{
                        onClick:(e)=>{
                            animate(
                                [
                                    [{ height: 100,padding:12 }, 260],
                                    [{ height: 0,padding:0,margin:0 }, 260],
                                ],
                                $(e.currentTarget),
                                ()=>setRecentFiles(recentFiles.filter((rf,i)=>o.id !== rf.id)
                            ))
                        }
                    })
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
                                {size:aSize,html:'A',className:'align-vh brd-c-12 bg-32',onResize:(newSize)=>setASize(newSize)},
                                {size:bSize,html:'B',className:'align-vh brd-c-12 bg-32',onResize:(newSize)=>setBSize(newSize)},
                                {html:'C',className:'align-vh brd-c-12 flex-1 bg-32'},
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
                    {size:aSize,html:'A',className:'align-vh brd-c-12 bg-32',onResize:(newSize)=>setASize(newSize)},
                    {size:bSize,html:'B',className:'align-vh brd-c-12 bg-32',onResize:(newSize)=>setBSize(newSize)},
                    {html:'C',className:'align-vh brd-c-12 flex-1 bg-32'},
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
                                    {size:aSize,html:'A',className:'align-vh brd-c-12 bg-32',onResize:(newSize)=>setState('aSize',newSize)},
                                    {size:bSize,html:'B',className:'align-vh brd-c-12 bg-32',onResize:(newSize)=>setState('bSize',newSize)},
                                    {html:'C',className:'align-vh brd-c-12 flex-1 bg-32'},
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
                        {size:aSize,html:'A',className:'align-vh brd-c-12 bg-32',onResize:(newSize)=>setState('aSize',newSize)},
                        {size:bSize,html:'B',className:'align-vh brd-c-12 bg-32',onResize:(newSize)=>setState('bSize',newSize)},
                        {html:'C',className:'align-vh brd-c-12 flex-1 bg-32'},
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
                                let className = 'align-vh brd-c-12 sel-off bg-32';
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
                    let className = 'align-vh brd-c-12 sel-off bg-32';
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
    function card_node(o:any):I_RVD_node{
        let {id,path,text,type,size,color} = o;
        return {
            key:id,
            className:'p-6 br-8 fs-12 gap-12 h-60 bg-32 m-b-12 align-v',
            row:[
                {html:<Icon path={path} size={0.6}/>,className:'w-24 h-24 br-4 c-32 align-vh',style:{background:color}},
                {html:text,size:120,className:'bold align-v'},
                {html:type + ' file',className:'flex-1 align-vh'},
                {html:size,className:'flex-1 align-vh'},
                {html:<Icon path={mdiShare} size={0.6}/>,className:'flex-1 align-vh'},
                {html:<Icon path={mdiDotsHorizontal} size={0.6}/>,className:'flex-1 align-vh'}
            ]
        }
    }
    return (
        <div className='example' style={{background:'#eee'}}>
            <Part
                title='reOrder'
                content={(
                    <RVD
                        rootNode={{
                            data:recentFiles,
                            reOrder:(newData,fromIndex,toIndex)=>setRecentFiles(newData),
                            column:recentFiles.map((o,i)=>card_node(o))
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
    function card_node(o){
        ...
    }
    return (
        <RVD
            rootNode={{
                data:recentFiles,
                reOrder:(newData,fromIndex,toIndex)=>setRecentFiles(newData),
                column:recentFiles.map((o,i)=>card_node(o))
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
                                    className:'p-6 br-8 fs-12 gap-12 h-60 bg-32 m-b-12 align-v',
                                    row:[
                                        {
                                            html:<Icon path={path} size={0.6}/>,
                                            className:'w-24 h-24 br-4 c-32 align-vh',
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
    function card_node(o){
        return {
            ...
            key:o.id,
            longTouch:()=>{
                alert(text)
            },
        }
    }
    return (
        <RVD
            rootNode={{
                column:recentFiles.map((o,i)=>card_node(o))
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
type I_grd = {
    light:string,width:number,height:number,borderColor:string,color:string,active:boolean,className:string,
    borderWidth:number,contrast:number,borderRadius:number,bold:boolean,fontSize:number,
    containerBG:string,p:number,angle:number,bsx:number,bsy:number,bsc:string,bsb:number,bss:number,pointer:boolean
}
function StyleGenerator(){
    let storage:Storage = new Storage('grdgenerator')
    let [popup] = useState(new AIOPopup())
    let [isDown,setIsDown] = useState(false)
    function to_array(c:any){
        if(Array.isArray(c)){return c}
        if(c.indexOf('rgb(') === 0){
          return c.slice(c.indexOf('(') + 1,c.indexOf(')')).split(',').map((o:any)=>+o);
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
    function to_dark(c:any,percent:number){
        let [r,g,b] = to_array(c);
        r = Math.round(r - (r * (percent / 100)))
        g = Math.round(g - (g * (percent / 100)))
        b = Math.round(b - (b * (percent / 100)))
        return `rgb(${r},${g},${b})`
    }
    function between(c1:any,c2:any,count:number){
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
    function change(key:string,value:any){
        let grd = grdRef.current;
        let newGrd = {...grd,[key]:value}
        setGrd(newGrd)
    }
    function changeSelected(newSelected:any){
        setSelected(newSelected)
        storage.save('selected',newSelected)
    }
    function addSelected(){
        changeSelected([...selected,{style:{...getStyle()},containerBG:grd.containerBG,grd:{...grd}}])
    }
    function removeSelected(i:number){
        changeSelected(selected.filter((o:any,index:number)=>index !== i))
    }
    let [grd,setGrd] = useState<I_grd>({
        light:'#999999',width:120,height:60,borderColor:'#999999',color:'#fff',active:false,className:'my-class',
        borderWidth:1,contrast:50,borderRadius:6,bold:true,fontSize:14,
        containerBG:'#fff',p:50,angle:180,bsx:0,bsy:0,bsc:'#000000',bsb:0,bss:0,pointer:false
    })
    let grdRef = useRef(grd);
    grdRef.current = grd;
    let [selected,setSelected] = useState<{style:any,containerBG:string,grd:I_grd}[]>(storage.load('selected',[]))
    let dark = to_dark(grd.light,grd.contrast);
    let medium = between(grd.light,dark,3)[1];
    
    function getStyle(){
        return {
            background:getGradient(grd.active && isDown),
            boxShadow:getBoxShadow(),
            width:grd.width,height:grd.height,
            border:`${grd.borderWidth}px solid ${grd.borderColor}`,
            borderRadius:grd.borderRadius,fontWeight:grd.bold?'bold':undefined,
            fontSize:grd.fontSize,color:grd.color,
            cursor:grd.pointer?'pointer':undefined
    
        }
    }
    function color_node(key:keyof I_grd):I_RVD_node{
        return {
            size:36,className:'w-240',html:<AIOInput type='color' value={grd[key]} onChange={(v)=>change(key,v)} className='w-36 h-36 brd-c-12'/>
        }
    }
    function slider_node(key:keyof I_grd,start:number,end:number,size = 180):I_RVD_node{
        let p:AI = {type:'range',point:(value)=>{return {html:value}},value:grd[key],onChange:(v)=>change(key,v),start,end}
        return {size,html:<AIOInput {...p}/>}
    }
    function number_node(key:keyof I_grd,start:number,end:number):I_RVD_node{
        return {
            size:82,html:<AIOInput key={key} type='number' style={{border:'1px solid #ddd',width:80}} min={start} max={end} after={'px'} value={grd[key]} onChange={(v)=>change(key,v)}/>
        }
    }
    function text_node(key:keyof I_grd):I_RVD_node{
        return {
            size:200,html:<AIOInput key={key} type='text' style={{border:'1px solid #ddd'}} value={grd[key]} onChange={(v)=>change(key,v)}/>
        }
    }
    function checkbox_node(key:keyof I_grd):I_RVD_node{
        return {
            align:'v',
            flex:1,
            html:<AIOInput type='checkbox' text={key} value={grd[key]} onChange={(v)=>change(key,v)}/>
        }
    }
    function range_node(key:keyof I_grd,start:number,end:number):I_RVD_node{
        let p:AI = {
            type:'range',
            attrs:{
                style:{border:'2px solid dodgerblue'}
            },
            handle:()=>{
                let res:AI_range_handle_config = {
                    sharp:false,
                    thickness:2,
                    color:'dodgerblue'
                }
                return res 
            },
            labels:[
                {
                    step:45,
                    setting:(value)=>({
                        offset:0,
                        fixAngle:true,
                        html:value
                    })
                }
            ],
            rotate:-90,size:36,round:1,start,end,value:grd[key],onChange:(v)=>change(key,v),
            point:(v,angle)=>{
                console.log(angle)
                return {
                    html:<div style={{transform:`rotate(-${angle}deg)`,color:'dodgerblue'}}>{v}</div>,
                    attrs:{
                        style:{width:16,height:16,fontSize:10,left:12,background:'#fff',border:'1px solid dodgerblue'}
                    }
                }
            }
        } 
        return {
            align:'vh',
            html:<AIOInput {...p}/>
        }
    }
    function getGradient(reverse?:boolean){
        return `linear-gradient(${grd.angle}deg, ${reverse?dark:grd.light} 0%,${medium} ${grd.p}%, ${reverse?grd.light:dark} 100%)`
    }
    function getBoxShadow(){
        return `${grd.bsx}px ${grd.bsy}px ${grd.bsb}px ${grd.bss}px ${grd.bsc}`
    }
    function label_node(text:string){
        return {html:text,size:100}
    }
    function log(i:number){
        let grd = selected[i].grd;
        let style = `
.${grd.className}{
    background:${getGradient()};
    box-shadow:${getBoxShadow()},
    width:${grd.width}px;
    height:${grd.height}px;
    border:${grd.borderWidth}px solid ${grd.borderColor};
    border-radius:${grd.borderRadius}px;
    font-weight:${grd.bold?'bold':'unset'};
    font-size:${grd.fontSize}px;
    color:${grd.color};
}
.${grd.className}:active{
    background:${getGradient(true)};
}

        
        `
        popup.addModal({
            position:'center',
            header:{title:'generated style'},
            body:()=>{
                return Code(style)
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
                                    className:'p-12 gap-12',
                                    column:[
                                        {
                                            className:'align-v gap-12',
                                            row:[
                                                label_node('className'),text_node('className')
                                            ]
                                        },
                                        {
                                            className:'align-v gap-12',
                                            row:[
                                                label_node('Geadient'),color_node('light'),slider_node('contrast',0,100),slider_node('p',0,100),range_node('angle',0,360)
                                            ]
                                        },
                                        {
                                            className:'align-v gap-12',
                                            row:[
                                                label_node('box shadow'),number_node('bsx',0,12),number_node('bsy',0,12),number_node('bsb',0,24),number_node('bss',0,24),color_node('bsc')
                                            ]
                                        },
                                        {
                                            row:[
                                                {align:'v',row:[label_node('Width'),slider_node('width',0,300)]},
                                                {align:'v',row:[label_node('Height'),slider_node('height',0,300)]},
                                            ]
                                        },
                                        {
                                            className:'gap-12',
                                            row:[
                                                {className:'align-v gap-12',row:[label_node('Color'),color_node('color')]},
                                                {className:'align-v gap-12',row:[label_node('Border Color'),color_node('borderColor')]},
                                                {className:'align-v gap-12',row:[label_node('Container BG'),color_node('containerBG')]}
                                            ]
                                        },
                                        {
                                            row:[
                                                {align:'v',row:[label_node('Border Width'),slider_node('borderWidth',0,24)]},
                                                {align:'v',row:[label_node('Border Radius'),slider_node('borderRadius',0,36)]}
                                            ]
                                        },
                                        {
                                            align:'v',
                                            row:[
                                                label_node('Font Size'),
                                                slider_node('fontSize',10,36),
                                                checkbox_node('bold'),
                                                checkbox_node('active'),
                                                checkbox_node('pointer'),
                                            ]

                                        },
                                        {html:<button onClick={()=>addSelected()}>Add To Selected</button>}
                                    ]
                                },
                                {
                                    flex:1,className:'p-12 align-vh',style:{background:grd.containerBG},
                                    column:[
                                        {html:'Sample Text',style:getStyle(),className:'align-vh',attrs:{onMouseDown:()=>setIsDown(true),onMouseUp:()=>setIsDown(false)}}
                                    ]
                                }
                            ]
                        },
                        {
                            className:'gap-12 p-24 brd-c-12',style:{flexWrap:'wrap'},
                            row:selected.map((o,i)=>{
                                let {style,containerBG,grd} = o;
                                return {
                                    className:'p-12 of-visible brd-c-16',
                                    onClick:()=>setGrd(grd),
                                    style:{background:containerBG},
                                    column:[
                                        {
                                            className:'of-visible',html:<div className='align-vh' style={style}>Sample Text</div>
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
