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
                    { text: 'basic', id: 'basic', render: () => <Basic /> },
                    
                ]
            }}
        />
    )
}
function Basic() {
    let [popup] = useState<AIOPopup>(new AIOPopup())
    let [doc] = useState<AIODoc>(new AIODoc())
    function showCode() {
        popup.addModal({
            id: 'code',
            header: { title: 'code' },
            body: () => {
                return new AIODoc().Code(
                    `import AIOHighlighter from 'aio-highlighter';
                    function Basic() {
                        let [show, setShow] = useState<boolean>(true)
                        let [ah] = useState<AIOHighlighter>(
                            new AIOHighlighter({
                                padding:12,
                                items:(index)=>{
                                    if(index === 0){
                                        return {
                                            dom:$('.rsa-navigation-item').eq(0),
                                            html:'this tab show basic usage of aio-highlighter component'
                                        }
                                    }
                                    if(index === 1){
                                        return {
                                            dom:$('.rsa-navigation-item').eq(1),
                                            html:'this tab show usage of aio-highlighter mouseAccess Props'
                                        }
                                    }
                                    if(index === 2){
                                        return {
                                            dom:$('.rsa-header-title'),
                                            html:'this is title of page'
                                        }
                                    }
                                    if(index === 3){
                                        return {
                                            dom:$('#go-to-home'),
                                            html:'this button is for exit to home page'
                                        }
                                    }
                                    setShow(false)
                                }
                            })
                        )
                        return (
                            <div className='example'>
                                {show && ah.render()}
                            </div>
                        )
                    }`
                        )
                
            }
        })
    }
    return (
        <div className='example'>
            {doc.H('My Title',3)}
            {
                doc.Ul([
                    ['lorem','inpsum'],
                    ['lorem','inpsum'],
                    ['lorem','inpsum'],
                    ['lorem','inpsum']
                ])
            }
            {doc.Mark('lorem',0)}
            {popup.render()}
        </div>
    )
}
