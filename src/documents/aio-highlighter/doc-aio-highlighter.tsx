import { useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import Code from '../../npm/code/index';
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
                    { text: 'mouse access', id: 'mouseAccess', render: () => <MouseAccess /> },
                    { text: 'test focus', id: 'testFocus', render: () => <TestFocus /> }
                ]
            }}
        />
    )
}
function Basic() {
    let [popup] = useState<AIOPopup>(new AIOPopup())
    function start(index:number){
        let dom,html;
        if(index === 0){
            dom = $('.rsa-navigation-item').eq(0);
            html = 'this tab show basic usage of aio-highlighter component'
        }
        else if(index === 1){
            dom = $('.rsa-navigation-item').eq(1);
            html = 'this tab show usage of aio-highlighter mouseAccess Props';
        }
        else if(index === 2){
            dom = $('.rsa-header-title');
            html = 'this is title of page';
        }
        else if(index === 3){
            dom = $('#go-to-home');
            html = 'this button is for exit to home page';
        }
        else {
            popup.removeHighlight();
            return;
        }
        popup.addHighlight({dom,html,onClick:()=>start(index + 1)})
    }
    function showCode() {
        popup.addModal({
            id: 'code',
            header: { title: 'code' },
            body: () => {
                return Code(
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
            <div style={{ padding: 12, display: 'flex', gap: 12 }}>
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => start(0)}>start</button>
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => showCode()}>Code</button>
            </div>
            {popup.render()}
        </div>
    )
}


function MouseAccess() {
    let [popup] = useState<AIOPopup>(new AIOPopup())
    function start(){
        popup.addHighlight({
            dom:$('#button1'),
            html:'click here to show code',
            mouseAccess:true
        })
    }
    function button1(){
        popup.addHighlight({
            dom:$('#button2'),
            html:(
                <div 
                    style={{ background: 'dodgerblue', padding: 12, color: '#fff' }}
                >click here to show preview</div>
            ),
            mouseAccess:true
        })
    }
    function button2(){
        popup.removeHighlight()
    }
    function showCode() {
        popup.addModal({
            id: 'code',
            header: { title: 'code' },
            body: ()=>{
                return Code(
                    `import AIOHighlighter from 'aio-highlighter';
                    function MouseAccess() {
                        let [show, setShow] = useState<boolean>(true)
                        let [ah] = useState<AIOHighlighter>(new AIOHighlighter({
                            mouseAccess: true,
                            items: (index) => {
                                if (index === 0) {
                                    return {
                                        dom: $('.my-button-1'),
                                        html: 'click here to show code'
                                    }
                                }
                                if (index === 1) {
                                    return {
                                        dom: $('.my-button-2'),
                                        html: <div style={{ background: 'dodgerblue', padding: 12, color: '#fff' }}>click here to show preview</div>
                                    }
                                }
                                setShow(false)
                            }
                        }))
                        useEffect(() => {
                            $('.my-button').on('click', () => {
                                ah.update()
                            })
                        }, [])
                        return (
                            <div className='example'>
                                <button style={{ height: 36, padding: '0 24px' }} onClick={() => setShow(true)}>start</button>
                                <div style={{ display: 'flex', gap: 12, padding: 12 }}>
                                    <button type='button' className='my-button my-button-1'>Button 1</button>
                                    <button type='button' className='my-button my-button-2'>Button 2</button>
                                </div>
                                {show !== false && ah.render()}
                            </div>
                        )
                    }`
                                        )
            }
        })
    }
    return (
        <div className='example'>
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => start()}>start</button>
            <div style={{ display: 'flex', gap: 12, padding: 12 }}>
                <button type='button' id='button1' onClick={(e)=>button1()}>Button 1</button>
                <button type='button' id='button2' onClick={(e)=>button2()}>Button 2</button>
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => showCode()}>Code</button>
            </div>
            {popup.render()}
        </div>
    )
}


function TestFocus() {
    let [popup] = useState<AIOPopup>(new AIOPopup())
    function start(index:number){
        if(index === 0){
            popup.addHighlight({
                dom:$('.my-test').eq(0),
                html:'test0',
                onClick:()=>start(1)
            })
        }
        else if(index === 1){
            popup.addHighlight({
                dom:$('.my-test').eq(11),
                html:'test11',
                onClick:()=>popup.removeHighlight()
            })
        }

    }
    return (
        <div className='example'>
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => start(0)}>start</button>
            <div className='ofy-auto w-100'>
                {
                    new Array(12).fill(0).map((o, i) => {
                        return (
                            <div className='my-test' style={{ width: '100%', padding: 48, fontSize: 20 }}>{`this is my text ${i}`}</div>
                        )
                    })
                }
            </div>
            {popup.render()}
        </div>
    )
}