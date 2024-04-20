import React, { Component } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import AIOHighlighter from './../../npm/aio-highlighter/aio-highlighter';
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import { mdiHumanFemale, mdiHumanMale } from '@mdi/js';
import { Icon } from '@mdi/react';
import AIOInput from './../../npm/aio-input/index.tsx';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import $ from 'jquery';
import './index.css';
export default class DOC_AIOForm extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='testFocus'
                nav={{
                    items:[
                        { text: 'basic', id: 'basic', render: () => <Basic /> },
                        { text: 'mouse access', id: 'mouseAccess', render: () => <MouseAccess /> },
                        { text: 'test focus', id: 'testFocus', render: () => <TestFocus /> }
                    ]
                }}
            />
        )
    }
}


class Basic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }
    preview() {
        let { show } = this.state;
        return (
            <>
                {
                    show &&
                    <AIOHighlighter
                        onClose={()=>this.setState({show:false})}
                        padding={12}
                        targets={[
                            ()=>$('.rsa-navigation-item').eq(0),
                            ()=>$('.rsa-navigation-item').eq(1),
                            ()=>$('.rsa-header-title'),
                            ()=>$('#go-to-home')
                        ]}
                        htmls={[
                            ()=>'this tab show basic usage of aio-highlighter component',
                            ()=>'this tab show usage of aio-highlighter mouseAccess Props',
                            ()=>'this is title of page',
                            ()=>'this button is for exit to home page'
                        ]}
                    />
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.setState({show:true})}>start</button>
            </>
        )
    }
    code() {
        return (`
class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }
    render() {
        let { show } = this.state;
        if(!show){return false}
        return (
            <AIOHighlighter
                onClose={()=>this.setState({show:false})}
                padding={12}
                targets={[
                    ()=>$('.rsa-navigation-item').eq(0),
                    ()=>$('.rsa-navigation-item').eq(1),
                    ()=>$('.rsa-header-title'),
                    ()=>$('#go-to-home')
                ]}
                htmls={[
                    ()=>'this tab show basic usage of aio-highlighter component',
                    ()=>'this tab show usage of aio-highlighter mouseAccess Props',
                    ()=>'this is title of page',
                    ()=>'this button is for exit to home page'
                ]}
            />
        )
    }
}
      `)
    }
    toolbar() {
        return ('')
    }
    render() {
        return (
            <Example
                preview={() => this.preview()}
                code={() => this.code()}
                toolbar={() => this.toolbar()}
            />
        )
    }
}


class MouseAccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }
    componentDidMount(){
        $('.aio-input-tabs-option').eq(1).on('click',()=>{
            let {highlightByIndex} = this.state;
            highlightByIndex(1)
        })
        $('.aio-input-tabs-option').eq(0).on('click',()=>{
            this.setState({show:false})
        })
    }
    preview() {
        return (
            <>
                
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.setState({show:true})}>start</button>
            </>
        )
    }
    code() {
        return (`
class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }
    componentDidMount(){
        $('.aio-input-tabs-option').eq(1).on('click',()=>{
            let {highlightByIndex} = this.state;
            highlightByIndex(1)
        })
        $('.aio-input-tabs-option').eq(0).on('click',()=>{
            this.setState({show:false})
        })
    }
    render() {
        let { show } = this.state;
        if(!show){return false}
        return (
            <AIOHighlighter
                getActions={({highlightByIndex})=>this.setState({highlightByIndex})}
                targets={[
                    ()=>$('.aio-input-tabs-option').eq(1),
                    ()=>$('.aio-input-tabs-option').eq(0)
                ]}
                htmls={[
                    ()=>'click here to show code',
                    ()=><div style={{background:'dodgerblue'}}>click here to show preview</div>
                ]}
                mouseAccess={true}
            />
        )
    }
}
      `)
    }
    toolbar() {
        return ('')
    }
    render() {
        let {show} = this.state
        return (
            <>
                <Example
                    preview={() => this.preview()}
                    code={() => this.code()}
                    toolbar={() => this.toolbar()}
                />
                {
                    show !== false &&
                    <AIOHighlighter
                        getActions={({highlightByIndex})=>this.setState({highlightByIndex})}
                        targets={[
                            ()=>$('.aio-input-tabs-option').eq(1),
                            ()=>$('.aio-input-tabs-option').eq(0)
                        ]}
                        htmls={[
                            ()=>'click here to show code',
                            ()=><div style={{background:'dodgerblue'}}>click here to show preview</div>
                        ]}
                        mouseAccess={true}
                    />
                }
            </>
            
        )
    }
}


class TestFocus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }
    preview() {
        let { show } = this.state;
        return (
            <>
                {
                    show &&
                    <AIOHighlighter
                        onClose={()=>this.setState({show:false})}
                        padding={12}
                        targets={[
                            ()=>$('.my-test').eq(0),
                            ()=>$('.my-test').eq(11)
                        ]}
                        htmls={[
                            ()=>'test0',
                            ()=>'test11',
                            
                        ]}
                    />
                }
                <div className='h-100 ofy-auto w-100'>
                {
                    new Array(12).fill(0).map((o,i)=>{
                        return (
                            <div className='my-test' style={{width:'100%',padding:48,fontSize:20}}>{`this is my text ${i}`}</div>
                        )
                    })
                }
                </div>
            </>
        )
    }
    code() {
        return (`
class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }
    render() {
        let { show } = this.state;
        if(!show){return false}
        return (
            <AIOHighlighter
                onClose={()=>this.setState({show:false})}
                padding={12}
                targets={[
                    ()=>$('.rsa-navigation-item').eq(0),
                    ()=>$('.rsa-navigation-item').eq(1),
                    ()=>$('.rsa-header-title'),
                    ()=>$('#go-to-home')
                ]}
                htmls={[
                    ()=>'this tab show basic usage of aio-highlighter component',
                    ()=>'this tab show usage of aio-highlighter mouseAccess Props',
                    ()=>'this is title of page',
                    ()=>'this button is for exit to home page'
                ]}
            />
        )
    }
}
      `)
    }
    toolbar() {
        return ('')
    }
    render() {
        return (
            <Example
                preview={() => this.preview()}
                code={() => this.code()}
                toolbar={() => this.toolbar()}
            />
        )
    }
}


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
    tabs_layout() {
        let { tab, tabs } = this.state;
        return {
            html: (
                <AIOInput type='tabs' options={tabs} value={tab} onChange={(tab) => this.setState({ tab })} />
            )
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
                rootNode={{
                    column: [
                        this.tabs_layout(),
                        this.toolbar_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}




