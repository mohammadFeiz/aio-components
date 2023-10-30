import React, { Component, useState } from 'react';
import DOC from '../../../resuse-components/doc';
import AIODoc from '../../../npm/aio-documentation/aio-documentation';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from '../../../npm/aio-input/aio-input';
import './doc-aio-input-form.css';
import { Icon } from '@mdi/react';
import { mdiHumanMale, mdiHumanFemale, mdiAbTesting, mdiFile, mdiAccount, mdiAccountAlert, mdiChevronDown, mdiChevronDoubleDown } from '@mdi/js';
const DOC_options = [
    {name:'john',id:'1'},
    {name:'stephan',id:'2'},
    {name:'edvard',id:'3'},
    {name:'luis',id:'4'},
    {name:'carlos',id:'5'},
    {name:'paul',id:'6'},
    {name:'fernando',id:'7'},
    {name:'mark',id:'8'},
    {name:'antonio',id:'9'},
    {name:'fred',id:'10'},
    {name:'lucas',id:'11'},
    {name:'maria',id:'12'}
]
const DOC_options_code = 
`
options:[
    {name:'john',id:'1'},
    {name:'stephan',id:'2'},
    {name:'edvard',id:'3'},
    {name:'luis',id:'4'},
    {name:'carlos',id:'5'},
    {name:'paul',id:'6'},
    {name:'fernando',id:'7'},
    {name:'mark',id:'8'},
    {name:'antonio',id:'9'},
    {name:'fred',id:'10'},
    {name:'lucas',id:'11'},
    {name:'maria',id:'12'}
],
optionText:'option.name',
optionValue:'option.id'`
export default class DOC_AIOInput_Form extends Component {
    render() {
        let items = [
            { type: 'text' },
            { type: 'number' },
            { type: 'textarea' },
            { type: 'password' },
            { type: 'color' },
            { 
                type: 'file',
                model: {
                    value__multiple_file___:[
                        {
                            name:'this is my file name',
                            size:12334443,
                            url:'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg'
                        }
                    ],
                    value__single_file___:{
                        name:'this is my file name',
                        size:12334443,
                        url:'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg'
                    }
                }
            },
            { 
                type:'select',
                allInputProps:{
                    options:DOC_options,
                    optionText:'option.name',
                    optionValue:'option.id'
                },
                allInputFooters:DOC_options_code
                
            },
            { 
                type:'multiselect',
                allInputProps:{
                    options:DOC_options,
                    optionText:'option.name',
                    optionValue:'option.id'
                },
                allInputFooters:DOC_options_code
                
            },
            { prop:'after'}
        ]
        return (<DOC {...this.props} nav={{items:getNavItems(items)}}/>)
    }
}
function e_exist(type, prop) {
    let dic = {
        text: {
            before: true,after: true,subtext: true, 
            disabled: true,
            placeholder: true,
            inputAttrs_style: true,
            justify: true, 
            loading: true, 
            justNumber_true: true, justNumber_array: true,maxLength: true, filter: true,
            caret_false: true,caret_html:true,
            options:true,
            optionText_optionValue: true, 
            optionAttrs__object___: true, optionAttrs__function___: true,
            attrs:true,
            popover:true
        },
        number: { 
            before: true, after: true,subtext: true,
            placeholder: true, 
            inputAttrs_style: true,
            disabled: true, 
            justify: true, 
            loading: true, 
            swip:true,
            caret_false: true,caret_html:true,
            options__number___:true,
            optionText_optionValue__number___: true, 
            optionAttrs__object___: true,optionAttrs__function___: true,
            attrs:true,
            popover:true

        },
        textarea: { 
            before: true,after: true,subtext: true, 
            placeholder: true,
            inputAttrs_style: true,
            disabled: true,
            loading: true, 
            maxLength: true,
            caret_false: true,caret_html:true,
            options:true,
            optionText_optionValue: true, 
            optionAttrs__object___: true, optionAttrs__function___: true,
            attrs:true,
            popover:true

        },
        password: {
            before: true,after: true,subtext: true, 
            placeholder: true,
            inputAttrs_style: true,
            disabled: true,
            justify: true, 
            loading: true, 
            justNumber_true: true, justNumber_array: true,maxLength: true, filter: true,
            visible:true,
            attrs:true,
        },
        color: {
            before: true,after: true,subtext: true, 
            disabled: true,
            loading: true, 
            options__type_color___:true,
            attrs:true,
        },
        file: {
            text:true,
            before: true,after: true,subtext: true, 
            disabled: true,
            loading: true, 
            attrs:true,
            multiple__file___:true,
            value__single_file___:true,
            value__multiple_file___:true
            
        },
        select: {
            text:true,
            before: true,
            after: true,subtext: true, 
            disabled: true,
            loading: true, 
            caret_false: true,caret_html:true,
            options:true,
            optionText_optionValue: true, 
            optionAttrs__object___: true, optionAttrs__function___: true,
            attrs:true,
            popover:true,
            popover__fitHorizontal___:true,
            placeholder:true
        },
        multiselect: {
            text:true,
            before: true,
            after: true,subtext: true, 
            disabled: true,
            loading: true, 
            caret_false: true,caret_html:true,
            options:true,
            optionText_optionValue: true, 
            optionAttrs__object___: true, optionAttrs__function___: true,
            attrs:true,
            popover:true,
            popover__fitHorizontal___:true,
        },
        
        datepicker: { before: true, },
        time: {},
        list: {},
        checkbox: { before: true, },
        radio: { before: true, },
        tabs: { before: true, },
        table: {},
        form: {},
        slider: { before: true, }
    }
    if(!type && !prop){return dic}
    if(!prop){return dic[type]}
    return !!dic[type][prop]
}
function getPropDetails(prop,type) {
    if (prop === 'before') {//////////////////////////////////////////////////////////////////////////////// before
        return [
            { before: <Icon path={mdiAccount} size={.8} /> },
            `
before:<Icon path={mdiAccount} size={.8}/>
            `,
        ]
    }
    if (prop === 'after') {//////////////////////////////////////////////////////////////////////////////// after
        return [
            { after: <div className='after'>after</div> },
            `
after:<div className='after'>after</div>
            `,
        ]
    }
    if (prop === 'justNumber_true') {////////////////////////////////////////////////////////////////////// justNumber_true
        return [
            { justNumber: true },
            `
justNumber:true
            `
        ]
    }
    if (prop === 'justNumber_array') {////////////////////////////////////////////////////////////////////// justNumber_array
        return [
            { justNumber: ['-'] },
            `
justNumber:['-']
            `
        ]
    }
    if (prop === 'text') {/////////////////////////////////////////////////////////////////////////////// text
        return [
            { text: 'this is my text' },
            `
text: 'this is my text'
            `
        ]
    }
    if (prop === 'subtext') {/////////////////////////////////////////////////////////////////////////////// subtext
        return [
            { subtext: 'my subtext' },
            `
subtext:'my subtext'
            `
        ]
    }
    if (prop === 'maxLength') {//////////////////////////////////////////////////////////////////////////// maxLength
        return [
            { maxLength: 5 },
            `
maxLength:5
            `
        ]
    }
    if (prop === 'filter') {/////////////////////////////////////////////////////////////////////////////// filter
        return [
            { filter: ['a', 'b', 'c'] },
            `
filter:['a','b','c']
            `
        ]
    }
    if (prop === 'placeholder') {////////////////////////////////////////////////////////////////////////// placeholder
        return [
            { placeholder: 'my placeholder' },
            `
placeholder : 'my placeholder'
            `
        ]
    }
    if (prop === 'disabled') {////////////////////////////////////////////////////////////////////////////// disabled
        return [
            { disabled: true },
            `
disabled:true
            `
        ]
    }
    if (prop === 'inputAttrs_style') {//////////////////////////////////////////////////////////////////// inputAttrs_style
        return [
            { inputAttrs: { style: { letterSpacing: 16 } } },
            `
inputAttrs:{style:{letterSpacing: 16}}
            `
        ]
    }
    if (prop === 'justify') {///////////////////////////////////////////////////////////////////////////// justify
        return [
            { justify: true },
            `
justify:true
            `
        ]
    }
    if (prop === 'loading') {///////////////////////////////////////////////////////////////////////////// loading
        return [
            { loading: true },
            `
loading:true
            `
        ]
    }
    if (prop === 'options') {///////////////////////////////////////////////////////////////////////////// options
        return [
            { 
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id' 
            },
            DOC_options_code
        ]
    }
    if (prop === 'optionText_optionValue') {////////////////////////////////////////////////////////////// optionText_optionValue
        return [
            { options: DOC_options, optionText: 'option.name',optionValue:'option.id' },
            DOC_options_code
        ]
    }
    if (prop === 'options__number___') {///////////////////////////////////////////////////////////////////////////// options
        return [
            { 
                options: [
                    {Value:1235,id:'1235'},
                    {Value:13454,id:'13454'},
                    {Value:112433,id:'112433'},
                    {Value:112223,id:'112223'},
                    {Value:12223,id:'12223'}
                ],
                optionText:'option.Value',
                optionValue:'option.id',
            },
            `
options: [
    {Value:1235,id:'1235'},
    {Value:13454,id:'13454'},
    {Value:112433,id:'112433'},
    {Value:112223,id:'112223'},
    {Value:12223,id:'12223'}
],
optionText:'option.Value',
optionValue:'option.id',
            `
        ]
    }
    if (prop === 'optionText_optionValue__number___') {////////////////////////////////////////////////////////////// optionText_optionValue
        return [
            { 
                options: [
                    {Value:1235,id:'1235'},
                    {Value:13454,id:'13454'},
                    {Value:112433,id:'112433'},
                    {Value:112223,id:'112223'},
                    {Value:12223,id:'12223'}
                ],
                optionText:'option.Value',
                optionValue:'option.id',
            },
            `
options: [
    {Value:1235,id:'1235'},
    {Value:13454,id:'13454'},
    {Value:112433,id:'112433'},
    {Value:112223,id:'112223'},
    {Value:12223,id:'12223'}
],
optionText:'option.Value',
optionValue:'option.id',
            `
        ]
    }
    if (prop === 'optionAttrs__object___') {
        return [
            {
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id',
                optionAttrs: { style: { background: 'pink' } }
            },
            `
${DOC_options_code}
optionAttrs:{style:{background:'pink'}}
            `
        ]
    }
    if (prop === 'optionAttrs__function___') {
        return [
            {
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id',
                optionAttrs: (option) => {
                    if (option.name === 'stephan') {
                        return { style: { background: 'pink' } }
                    }
                }
            },
            `
${DOC_options_code}
optionText:'option.name',
optionAttrs:(option)=>{
    if(option.name === 'stephan'){
        return {style:{background:'pink'}}
    }
}
            `
        ]
    }
    if (prop === 'caret_false') {
        return [
            {
                options: DOC_options,
                caret: false
            },
            `
${DOC_options_code}
caret:false
        `
        ]
    }
    if (prop === 'caret_html') {
        return [
            {
                options: DOC_options,
                caret: <Icon path={mdiChevronDoubleDown} size={.7} />
            },
            `
${DOC_options_code}
caret:<Icon path={mdiChevronDoubleDown} size={.7}/>
        `
        ]
    }
    if (prop === 'swip') {
        return [
            {swip:true},
            `
swip:true
            `
        ]
    }
    if (prop === 'visible') {
        return [
            {visible:true},
            `
visible:true
            `
        ]
    }
    if (prop === 'options__type_color___') {
        return [
            {options:['#ff0000','#00ff00','#0000ff','#ffff00','#00ffff','#ffffff','#000000']},
            `
options:['#ff0000','#00ff00','#0000ff','#ffff00','#00ffff','#ffffff','#000000']
            `
        ]
    }
    if (prop === 'attrs') {
        return [
            {attrs:{style:{boxShadow:'0 0 12px 2px lightblue'}}},
            `
attrs:{style:{boxShadow:'0 0 12px 2px lightblue'}}
            `
        ]
    }
    if (prop === 'popover') {///////////////////////////////////////////////////////////////////////////////////// popover
        return [
            { 
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id',
                popover:{
                    position:'center',
                    backdrop:{
                        attrs:{
                            style:{
                                background:'rgba(0,0,0,0.8)'
                            }
                        }
                    },
                }
            },
            `
${type === 'select'?'':DOC_options_code}
popover:{
    position:'center',
    backdrop:{
        attrs:{
            style:{
                background:'rgba(0,0,0,0.8)'
            }
        }
    },
}
            `
        ]
    }
    if (prop === 'popover__fitHorizontal___') {///////////////////////////////////////////////////////////////////////////////////// popover__fitHorizontal___
        return [
            { 
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id',
                popover:{
                    fitHorizontal:true
                }
            },
            `
${DOC_options_code}
popover:{
    fitHorizontal:true
}
            `
        ]
    }
    if (prop === 'multiple__file___') {
        return [
            {multiple:true},
            `
multiple:true
            `
        ]
    }
    if (prop === 'value__multiple_file___') {
        return [
            {
                multiple:true,
            },
            `
value:[
    {
        name:'this is my file name',
        size:12334443,
        url:'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg'
    }
],
multiple:true
            `
        ]
    }
    if (prop === 'value__single_file___') {
        return [
            {},
            `
value : {
    name:'this is my file name',
    size:12334443,
    url:'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg'
}
            `
        ]
    }
    if (prop === '') {
        return [
            {},
            `

            `
        ]
    }
    if (prop === '') {
        return [
            {},
            `

            `
        ]
    }
    if (prop === '') {
        return [
            {},
            `

            `
        ]
    }
}

function getNavItems(items){
    return items.map(({type,prop,model,allInputProps,allInputFooters})=>{
        return { 
            text: `${!!type?`type:${type}`:''} ${!!prop?`prop:${prop}`:''}`, 
            id: type + prop, 
            render: () => <AIOINPUT key={type+prop} type={type} prop={prop} initModel={model} allInputProps={allInputProps} allInputFooters={allInputFooters}/> 
        }
    })
}
function getInputObjects(type, prop,allInputProps,allInputFooters) {
    let types = Object.keys(e_exist());
    let res = []
    for (let i = 0; i < types.length; i++) {
        let t = types[i];
        if (type && t !== type) { continue }
        let props = Object.keys(e_exist(t))
        for (let j = 0; j < props.length; j++) {
            let p = props[j];
            if (prop && p !== prop) { continue }
            if (!e_exist(t, p)) { continue }
            res.push(getInput(t, p,!type?t:undefined,allInputProps,allInputFooters));
        }
    }
    return res;
}
function Code({code}){
    let [show,setShow] = useState(false);
    return (
        <RVD
            layout={{
                column:[
                    {size:6},
                    {html:<div>{show?'hide code':'show code'}</div>,className:'fs-10 bold',style:{color:show?'red':'blue'},onClick:()=>setShow(!show)},
                    {show:!!show,html:()=>AIODoc().Code(code),className:'m-b-12'},
                    {size:12}
                ]
            }}
        />
    )
} 

function getPropLabel(prop){
    return `${prop.replaceAll('___',' ) ').replaceAll('__',' ( ').replaceAll('_',' ')}`;
}
function getInput(type, prop,Label,allInputProps,allInputFooters) {
    let input = { type }
    let footer = `type:"${type}",`
    if(allInputFooters){footer += allInputFooters;}
    let [propValue, footerValue] = getPropDetails(prop,type)
    for (let p in propValue) {input[p] = propValue[p];}
    for (let p in allInputProps) {input[p] = allInputProps[p];}
    let label = Label?Label:getPropLabel(prop,type);
    if(footer.indexOf(footerValue) === -1){footer += footerValue;}
    return { input, field: `value.${prop}`, footer: <Code code={footer}/>,label }
}
function AIOINPUT({type,prop,initModel = {},allInputProps,allInputFooters}) {
    let [model,setModel] = useState(initModel);
    let [inputs,setInputs] = useState(getInputObjects(type,prop,allInputProps,allInputFooters))
    function preview() {
        return (
            <div className='example'>
                <AIOInput 
                    type='form' 
                    inputs={{ column: inputs }} 
                    value={{...model}} 
                    onChange={(newModel) => setModel(newModel)} 
                    labelAttrs={{style:{fontSize:14,fontWeight:'bold'}}}
                />
            </div>
        )
    }
    return (<Example preview={() => preview()} />)
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