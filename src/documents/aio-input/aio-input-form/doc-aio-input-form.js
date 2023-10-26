import React, { Component,createRef } from 'react';
import DOC from '../../../resuse-components/doc';
import AIODoc from '../../../npm/aio-documentation/aio-documentation';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from '../../../npm/aio-input/aio-input';
import './doc-aio-input-form.css';
import {Icon} from '@mdi/react';
import { mdiHumanMale,mdiHumanFemale, mdiAbTesting, mdiFile, mdiAccount, mdiAccountAlert} from '@mdi/js';
export default class DOC_AIOInput_Form extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                nav={{
                    items:[
                        { text: 'basic', id: 'basic', render: () => <Basic /> },
                        { text: 'type text', id: 'type text', render: () => <TypeText /> },
                    ]
                }}
            />
        )
    }
}
class Basic extends Component {
    constructor(props){
        super(props);
        this.state = {model:{}}
    }
    preview() {
        let {model} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='form'
                    inputs={{
                        column:[
                            {input:{type:'text'},label:'name',field:'value.name'},
                            {input:{type:'textarea'},label:'description',field:'value.description'},
                            {input:{type:'number'},label:'price',field:'value.price'},
                            {input:{type:'checkbox',text:model.active?'active':'not active'},label:'active',field:'value.active'},
                            {input:{type:'radio',options:[{text:'Male',value:'m'},{text:'Female',value:'f'}]},label:'In Stock',field:'value.inStock'},
                            {input:{type:'select',options:[{text:'Male',value:'m'},{text:'Female',value:'f'}]},label:'In Stock',field:'value.inStock'},
                            {
                                input:{
                                    type:'multiselect',
                                    options:[
                                        {text:'Tag1',value:'1'},
                                        {text:'Tag2',value:'2'},
                                        {text:'Tag3',value:'3'}
                                    ],
                                    text:'Select Tags'
                                },
                                label:'Tags',
                                field:'value.tags'
                            },
                            {input:{type:'file',text:'select file'},label:'file',field:'value.file'},
                            {input:{type:'file',text:'select files',multiple:true},label:'files',field:'value.files'},
                                
                        ]
                    }}
                    value={model}
                    onChange={(newModel)=>this.setState({model:newModel})}
                />
                {
                    AIODoc().Code(`
<AIOInput type='slider' value={[50]}/>
                    `)
                }
                {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class TypeText extends Component {
    constructor(props){
        super(props);
        this.state = {model:{}}
    }
    preview() {
        let {model} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='form'
                    inputs={{
                        column:[
                            {input:{type:'text'},label:'text',field:'value.text'},
                            {input:{type:'text',before:<Icon path={mdiAccount} size={.8}/>},label:'text before:...',field:'value.text'},
                            {input:{type:'text',after:<div className='after'>after</div>},label:'text after:...',field:'value.text'},
                            {
                                input:{
                                    type:'text',
                                    options:[
                                        {text:'john'},
                                        {text:'stephan'},
                                        {text:'maria'}
                                    ]
                                },
                                label:'text options:[...]',field:'value.text'
                            },
                            {input:{type:'text',justNumber:true},label:'text justNumber:true',field:'value.text'},
                            {input:{type:'text',justNumber:['-']},label:'text justNumber:[ "-" ]',field:'value.text'},
                            {input:{type:'text',maxLength:5},label:'text maxLength:5',field:'value.text'},
                            {input:{type:'text',filter:['a','b','c']},label:'text filter:["a","b","c"]',field:'value.text'},
                            {input:{type:'text',inputAttrs:{disabled:true}},label:'text inputAttrs:{disabled:true}',field:'value.text'},
                            {input:{type:'text',inputAttrs:{placeholder:'inter some text'}},label:'text inputAttrs:{placeholder:"inter some text"}',field:'value.text'},
                            {input:{type:'text',inputAttrs:{style:{textAlign:"center"}}},label:'text inputAttrs:{style:{textAlign:"center"}}',field:'value.text'},
                            {input:{type:'text',style:{borderColor:'red'}},label:'text style:{borderColor:"red"}',field:'value.text'},
                            {input:{type:'text',className:"my-textbox"},label:'text className:"my-textbox"',field:'value.text'},
                            {input:{type:'text',justify:true},label:'text justify:true',field:'value.text'},
                            {input:{type:'text',loading:true},label:'text loading:true',field:'value.text'},
                                
                        ]
                    }}
                    value={model}
                    onChange={(newModel)=>this.setState({model:newModel})}
                />
                {
                    AIODoc().Code(`
<AIOInput type='slider' value={[50]}/>
                    `)
                }
                {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
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




