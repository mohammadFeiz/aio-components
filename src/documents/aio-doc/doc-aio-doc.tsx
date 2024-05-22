import React, { Component, useEffect, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import AIOHighlighter from '../../npm/aio-highlighter/index.tsx';
import AIODoc from '../../npm/aio-doc/aio-doc.tsx';
import AIOPopup from '../../npm/aio-popup/index.tsx';
import $ from 'jquery';
export default function DOC_AIOForm(props:any) {
    return (
        <DOC
            name={props.name}
            goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'Ul', id: 'ul', render: () => <Ul /> },
                    { text: 'h1 h2 h3 h4 h5 h6', id: 'h', render: () => <H /> },
                    { text: 'String Tags', id: 'string tags', render: () => <StringTags /> },
                    { text: 'Table', id: 'table', render: () => <Table /> },
                    { text: 'Line', id: 'line', render: () => <Line /> },
                    { text: 'Code', id: 'code', render: () => <Code /> },
                    { text: 'List', id: 'list', render: () => <List /> },
                    
                ]
            }}
        />
    )
}
function Ul() {
    let [doc] = useState<AIODoc>(new AIODoc())
    return (
        <div className='example aio-doc-container'>
            {
                doc.Ul([
                    {html:'lorem'},
                    {
                        html:'lorem',
                        childs:[
                            {html:'lorem'},
                            {html:'lorem'},
                            {html:'lorem'},
                            {html:'lorem'}
                        ]
                    },
                    {html:'lorem'},
                    {html:'lorem'}
                ])
            }
            {doc.Code(
`doc.Ul([
    {html:'lorem'},
    {
        html:'lorem',
        childs:[
            {html:'lorem'},
            {html:'lorem'},
            {html:'lorem'},
            {html:'lorem'}
        ]
    },
    {html:'lorem'},
    {html:'lorem'}
])`
            )}
        </div>
    )
}


function H() {
    let [doc] = useState<AIODoc>(new AIODoc())
    return (
        <div className='example aio-doc-container'>
            {doc.Tag('h6','My Title')}
            {doc.Tag('h5','My Title')}
            {doc.Tag('h4','My Title')}
            {doc.Tag('h3','My Title')}
            {doc.Tag('h2','My Title')}
            {doc.Tag('h1','My Title')}
            {doc.Code(
`doc.Tag('h3','My Title')`
)}
            
        </div>
    )
}

function StringTags() {
    let [doc] = useState<AIODoc>(new AIODoc())
    let tbody = ['mark','sup','sub','em','b','strong','i','small','del'].map((o:any)=>{
        return [o,doc.Tag(o,'lorem'),doc.Code(`doc.Tag('${o}','lorem')`)]
    })
    return (
        <div className='example aio-doc-container'>
            {
                doc.Tag(
                    'p',
                    <>
                        Lorem ipsum, dolor sit amet {doc.Tag('em','lorem')} adipisicing elit. Quos a.<br/>
                        Adipisci beatae, accusamus iure {doc.Tag('mark','lorem')}, autem, doloribus nesciunt {doc.Tag('ins','lorem')} aperiam architecto laborum eaque velit vero corrupti.
                        Nulla {doc.Tag('b','lorem')} quis ab, {doc.Tag('small','lorem')} ipsa autem.
                        Placeat reiciendis, necessitatibus quos animi veritatis ad laboriosam sapiente odit aperiam repellat,
                        Tempora nemo {doc.Tag('strong','lorem')}, sapiente {doc.Tag('del','lorem')} dolor {doc.Tag('sub','lorem')} quam quos quis {doc.Tag('sup','lorem')} quae! Mollitia dolore temporibus, sunt, corrupti cupiditate at numquam quo facere dignissimos, sequi aliquam maiores et. Libero, mollitia earum.
                    </>
                )
            }
            {
                doc.Code(
`doc.Tag(
    'p',
    <>
        Lorem ipsum, dolor sit amet {doc.Tag('em','lorem')} adipisicing elit. Quos a.<br/>
        Adipisci beatae, accusamus iure {doc.Tag('mark','lorem')}, autem, doloribus nesciunt {doc.Tag('ins','lorem')} aperiam architecto laborum eaque velit vero corrupti.
        Nulla {doc.Tag('b','lorem')} quis ab, {doc.Tag('small','lorem')} ipsa autem.
        Placeat reiciendis, necessitatibus quos animi veritatis ad laboriosam sapiente odit aperiam repellat,
        Tempora nemo {doc.Tag('strong','lorem')}, sapiente {doc.Tag('del','lorem')} dolor {doc.Tag('sub','lorem')} quam quos quis {doc.Tag('sup','lorem')} quae! Mollitia dolore temporibus, sunt, corrupti cupiditate at numquam quo facere dignissimos, sequi aliquam maiores et. Libero, mollitia earum.
    </>
)`
                )
            }
            {doc.Table(['tag','Preview','Code'],tbody)}
        </div>
    )
}

function Table() {
    let [doc] = useState<AIODoc>(new AIODoc())
    return (
        <div className='example aio-doc-container'>
            {
                doc.Table(
                    ['Props','Type','Default','Description'],
                    [
                        ['text','string','undefined','Set text of element'],
                        ['text','string','undefined',<>accusamus iure {doc.Tag('mark','lorem')}, autem, doloribus nesciunt nulla</>],
                        ['text','string','undefined','Set text of element'],
                        ['text','string','undefined','Set text of element'],
                        ['text','string','undefined','Set text of element']
                    ]
                )
            }
            {
                doc.Code(
`doc.Table({
    thead:['Props','Type','Default','Description'],
    tbody:[
        ['text','string','undefined','Set text of element'],
        ['text','string','undefined',<>accusamus iure {doc.Tag('mark','lorem')}, autem, doloribus nesciunt nulla</>],
        ['text','string','undefined','Set text of element'],
        ['text','string','undefined','Set text of element'],
        ['text','string','undefined','Set text of element']
    ]
})`
                )
            }
        </div>
    )
}

function Line() {
    let [doc] = useState<AIODoc>(new AIODoc())
    return (
        <div className='example aio-doc-container'>
            {doc.Line('','1px dashed')}
            {
                doc.Code(
`doc.Line('','1px dashed')`
                )
            }
            {doc.Line('','2px dashed')}
            {
                doc.Code(
`doc.Line('','2px dashed')`
                )
            }
            {doc.Line('','1px dotted')}
            {
                doc.Code(
`doc.Line('','1px dotted')`
                )
            }
            {doc.Line('','2px dotted')}
            {
                doc.Code(
`doc.Line('','2px dotted')`
                )
            }
            {doc.Line('','1px solid')}
            {
                doc.Code(
`doc.Line('','1px solid')`
                )
            }
            {doc.Line('','2px solid')}
            {
                doc.Code(
`doc.Line('','2px solid')`
                )
            }
            {doc.Line('','1px solid','red')}
            {
                doc.Code(
`doc.Line('','1px solid','red')`
                )
            }
            {doc.Line('','3px solid','dodgerblue')}
            {
                doc.Code(
`doc.Line('','3px solid','dodgerblue')`
                )
            }
            {doc.Line('My Text')}
            {
                doc.Code(
`doc.Line('My Text')`
                )
            }
            {doc.Line('My Text','2px solid','dodgerblue')}
            {
                doc.Code(
`doc.Line('My Text','2px solid','dodgerblue')`
                )
            }
        </div>
    )
}

function Code() {
    let [doc] = useState<AIODoc>(new AIODoc())
    return (
        <div className='example aio-doc-container'>
            {
                doc.Code(
`function Example(){
    return (
        <div>
            some text
        </div>
    )
}`
                )
            }
            {
                doc.Code(
`doc.Code(
    function Example(){
        return (
            <div>
                some text
            </div>
        )
    }
)`
                )
            }
        </div>
    )
}


function List() {
    let [doc] = useState<AIODoc>(new AIODoc())
    return (
        <div className='example aio-doc-container'>
            {doc.List([
                ['Tag','h3','My Title'],
                [
                    'Ul',
                    `[
                        {"html":"lorem"},
                        {
                            "html":"lorem",
                            "childs":[
                                {"html":"lorem"},
                                {"html":"lorem"},
                                {"html":"lorem"},
                                {"html":"lorem"}
                            ]
                        },
                        {"html":"lorem"},
                        {"html":"lorem"}
                    ]`
                ],
                [
                    'Tag',
                    'p',
                    `<>
                        Lorem ipsum, dolor sit amet {doc.Tag('em','lorem')} adipisicing elit. Quos a.<br/>
                        Adipisci beatae, accusamus iure {doc.Tag('mark','lorem')}, autem, doloribus nesciunt {doc.Tag('ins','lorem')} aperiam architecto laborum eaque velit vero corrupti.
                        Nulla {doc.Tag('b','lorem')} quis ab, {doc.Tag('small','lorem')} ipsa autem.
                        Placeat reiciendis, necessitatibus quos animi veritatis ad laboriosam sapiente odit aperiam repellat,
                        Tempora nemo {doc.Tag('strong','lorem')}, sapiente {doc.Tag('del','lorem')} dolor {doc.Tag('sub','lorem')} quam quos quis {doc.Tag('sup','lorem')} quae! Mollitia dolore temporibus, sunt, corrupti cupiditate at numquam quo facere dignissimos, sequi aliquam maiores et. Libero, mollitia earum.
                    </>`
                ]
            ])}
            
            
        </div>
    )
}