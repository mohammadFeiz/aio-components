import React, { Component } from 'react';
import DOC from '../../resuse-components/doc';
import AIOHighlighter from './../../npm/aio-highlighter/aio-highlighter';
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import { mdiHumanFemale, mdiHumanMale } from '@mdi/js';
import { Icon } from '@mdi/react';
import AIOInput from './../../npm/aio-input/aio-input';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import $ from 'jquery';
import './index.css';
export default class DOC_AIOForm extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='basic'
                navs={[
                    { text: 'basic', id: 'basic', COMPONENT: () => <Basic /> },
                    { text: 'mouse access', id: 'mouseAccess', COMPONENT: () => <MouseAccess /> },
                    { text: 'padding', id: 'padding', COMPONENT: () => <Padding /> },


                ]}
            />
        )
    }
}


class Basic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: false
        }
    }
    getDom() {
        let { index } = this.state;
        if (index === 0) { return $('.rsa-navigation-item').eq(0) }
        if (index === 1) { return $('.rsa-navigation-item').eq(1) }
        if (index === 2) { return $('.rsa-header-title') }
        if (index === 3) { return $('#go-to-home') }
    }
    changeIndex() {
        let { index } = this.state;
        let newIndex;
        if (index === false) { newIndex = 0 }
        else if (index === 3) { newIndex = false }
        else { newIndex = index + 1 }
        this.setState({ index: newIndex })
    }
    getHTML() {
        let { index } = this.state;
        if (index === 0) { return 'this tab show basic usage of aio-highlighter component' }
        if (index === 1) { return 'this tab show usage of aio-highlighter mouseAccess Props' }
        if (index === 2) { return 'this is title of page' }
        if (index === 3) { return 'this button is for exit to home page' }
    }
    preview() {
        let { index } = this.state;
        return (
            <>
                {
                    index !== false &&
                    <AIOHighlighter
                        target={this.getDom()}
                        onClick={() => this.changeIndex()}
                        html={this.getHTML.bind(this)}
                    />
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.changeIndex()}>start</button>
            </>
        )
    }
    code() {
        return (`
class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: false
        }
    }
    getDom() {
        let { index } = this.state;
        if (index === 0) { return $('.rsa-navigation-item').eq(0) }
        if (index === 1) { return $('.rsa-navigation-item').eq(1) }
        if (index === 2) { return $('.rsa-header-title') }
        if (index === 3) { return $('#go-to-home') }
    }
    changeIndex() {
        let { index } = this.state;
        let newIndex;
        if (index === false) { newIndex = 0 }
        else if (index === 3) { newIndex = false }
        else { newIndex = index + 1 }
        this.setState({ index: newIndex })
    }
    getHTML() {
        let { index } = this.state;
        if (index === 0) { return 'this tab show usage of aio-highlighter component width target props with string type' }
        if (index === 1) { return 'this tab show usage of aio-highlighter component width target props with array type' }
        if (index === 2) { return 'this is title of page' }
        if (index === 3) { return 'this button is for exit to home page' }

    }
    render() {
        let { index } = this.state;
        return (
            <>
                {
                    index !== false &&
                    <AIOHighlighter
                        target={this.getDom()}
                        onClick={() => this.changeIndex()}
                        html={this.getHTML.bind(this)}
                    />
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.changeIndex()}>start</button>
            </>
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
            index: false
        }
    }
    getDom() {
        let { index } = this.state;
        if (index === 0) { return $('.rsa-navigation-item').eq(0) }
        if (index === 1) { return $('.rsa-navigation-item').eq(1) }
        if (index === 2) { return $('.rsa-header-title') }
        if (index === 3) { return $('#go-to-home') }
    }
    changeIndex() {
        let { index } = this.state;
        let newIndex;
        if (index === false) { newIndex = 0 }
        else if (index === 3) { newIndex = false }
        else { newIndex = index + 1 }
        this.setState({ index: newIndex })
    }
    getHTML() {
        let { index } = this.state;
        if (index === 0) { return 'this tab show basic usage of aio-highlighter component' }
        if (index === 1) { return 'this tab show usage of aio-highlighter mouseAccess Props' }
        if (index === 2) { return 'this is title of page' }
        if (index === 3) { return 'this button is for exit to home page' }
    }
    preview() {
        let { index } = this.state;
        return (
            <>
                {
                    index !== false &&
                    <AIOHighlighter
                        target={this.getDom()}
                        onClick={() => this.changeIndex()}
                        html={this.getHTML.bind(this)}
                        mouseAccess={true}
                    />
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.changeIndex()}>start</button>
            </>
        )
    }
    code() {
        return (`
class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: false
        }
    }
    getDom() {
        let { index } = this.state;
        if (index === 0) { return $('.rsa-navigation-item').eq(0) }
        if (index === 1) { return $('.rsa-navigation-item').eq(1) }
        if (index === 2) { return $('.rsa-header-title') }
        if (index === 3) { return $('#go-to-home') }
    }
    changeIndex() {
        let { index } = this.state;
        let newIndex;
        if (index === false) { newIndex = 0 }
        else if (index === 3) { newIndex = false }
        else { newIndex = index + 1 }
        this.setState({ index: newIndex })
    }
    getHTML() {
        let { index } = this.state;
        if (index === 0) { return 'this tab show usage of aio-highlighter component width target props with string type' }
        if (index === 1) { return 'this tab show usage of aio-highlighter component width target props with array type' }
        if (index === 2) { return 'this is title of page' }
        if (index === 3) { return 'this button is for exit to home page' }

    }
    render() {
        let { index } = this.state;
        return (
            <>
                {
                    index !== false &&
                    <AIOHighlighter
                        target={this.getDom()}
                        onClick={() => this.changeIndex()}
                        html={this.getHTML.bind(this)}
                        mouseAccess={true}
                    />
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.changeIndex()}>start</button>
            </>
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

class Padding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: false
        }
    }
    getDom() {
        let { index } = this.state;
        if (index === 0) { return $('.rsa-navigation-item').eq(0) }
        if (index === 1) { return $('.rsa-navigation-item').eq(1) }
        if (index === 2) { return $('.rsa-header-title') }
        if (index === 3) { return $('#go-to-home') }
    }
    changeIndex() {
        let { index } = this.state;
        let newIndex;
        if (index === false) { newIndex = 0 }
        else if (index === 3) { newIndex = false }
        else { newIndex = index + 1 }
        this.setState({ index: newIndex })
    }
    getHTML() {
        let { index } = this.state;
        if (index === 0) { return 'this tab show basic usage of aio-highlighter component' }
        if (index === 1) { return 'this tab show usage of aio-highlighter mouseAccess Props' }
        if (index === 2) { return 'this is title of page' }
        if (index === 3) { return 'this button is for exit to home page' }
    }
    preview() {
        let { index } = this.state;
        return (
            <>
                {
                    index !== false &&
                    <AIOHighlighter
                        target={this.getDom()}
                        onClick={() => this.changeIndex()}
                        html={this.getHTML.bind(this)}
                        padding={0}
                    />
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.changeIndex()}>start</button>
            </>
        )
    }
    code() {
        return (`
class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: false
        }
    }
    getDom() {
        let { index } = this.state;
        if (index === 0) { return $('.rsa-navigation-item').eq(0) }
        if (index === 1) { return $('.rsa-navigation-item').eq(1) }
        if (index === 2) { return $('.rsa-header-title') }
        if (index === 3) { return $('#go-to-home') }
    }
    changeIndex() {
        let { index } = this.state;
        let newIndex;
        if (index === false) { newIndex = 0 }
        else if (index === 3) { newIndex = false }
        else { newIndex = index + 1 }
        this.setState({ index: newIndex })
    }
    getHTML() {
        let { index } = this.state;
        if (index === 0) { return 'this tab show usage of aio-highlighter component width target props with string type' }
        if (index === 1) { return 'this tab show usage of aio-highlighter component width target props with array type' }
        if (index === 2) { return 'this is title of page' }
        if (index === 3) { return 'this button is for exit to home page' }

    }
    render() {
        let { index } = this.state;
        return (
            <>
                {
                    index !== false &&
                    <AIOHighlighter
                        target={this.getDom()}
                        onClick={() => this.changeIndex()}
                        html={this.getHTML.bind(this)}
                        padding={0}
                    />
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.changeIndex()}>start</button>
            </>
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
                layout={{
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




