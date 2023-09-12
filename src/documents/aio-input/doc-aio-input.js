import React, { Component } from "react";
import AIOInput from './../../npm/aio-input/aio-input';
import AIOStorage from './../../npm/aio-storage/aio-storage';
import { Icon } from '@mdi/react';
import { mdiAccount, mdiMagnify, mdiCheckCircle, mdiArrowLeftRight, mdiNumeric6Circle } from '@mdi/js';
import AIODoc from './../../npm/aio-documentation/aio-documentation';
import './index.css';
export default class DOC_AIOInput extends Component {
    constructor(props) {
        super(props);
        this.Storage = AIOStorage('aitest');
        this.state = {
            props:{
                'loading':{
                    value:true,code:`loading={true}`,
                    types:['button', 'file', 'select', 'multiselect', 'radio', 'tabs', 'checkbox', 'datepicker','text','number','form','textarea','color','password','slider'],
                },
                'center':{
                    value:true,code:`center={true}`,
                    types:['button', 'file', 'select', 'multiselect', 'radio', 'tabs', 'checkbox', 'datepicker','text','number','form','textarea','color','password'],
                },
                'start':{
                    value:0,code:`start={0}`,
                    types:['slider'],
                },
                'end':{
                    value:100,code:`start={100}`,
                    types:['slider'],
                },
                'step':{
                    value:5,code:`step={5}`,
                    types:['slider'],
                },
                'rtl':{
                    value:true,code:`rtl={true}`,
                    types:['button', 'file', 'select', 'multiselect', 'radio', 'tabs', 'checkbox', 'datepicker','text','number','form','textarea','color','password','slider'],
                },
                'lang':{
                    value:'fa',code:`lang="fa"`,types:['form']
                },
                'onSubmit':{
                    value:(value,errors)=>{debugger; this.setState({value,errors})},code:`onSubmit={(value,errors)=>this.setState({value,errors})}`,types:['form']
                },
                'onClose':{
                    value:()=>{debugger;},code:`onClose={()=>{}}`,types:['form']
                },
                'title':{
                    value:'My Title',code:`title="My Title"`,types:['form']
                },
                'subtitle':{
                    value:'My subTitle',code:`subtitle="My Subtitle"`,types:['form']
                },
                'className':{
                    value:"aio-input-button-style-1",code:`className="aio-input-button-style-1"`,
                    types:['button', 'file', 'select', 'multiselect', 'radio', 'tabs', 'checkbox', 'datepicker','text','number','textarea','color','password','slider']
                },
                'style':{
                    value:{ background: 'orange' },code:`style={{background:"orange"}}`,
                    types:['button', 'file', 'select', 'multiselect', 'radio', 'tabs', 'checkbox', 'datepicker','table','text','number','textarea','color','password','slider']
                },
                'optionText':{
                    value:'option.text',code:`optionText='option.text'`,
                    types:['select', 'multiselect','radio','tabs','text','number','textarea']
                },
                'optionValue':{
                    value:'option.value',code:`optionValue='option.value'`,
                    types:['select', 'multiselect','radio','tabs','text','number','textarea']
                },
                'optionClose':{value:true,code:`optionClose={true}`,types:['select', 'multiselect']},
                'optionChecked':{value:'props.value === option.value',code:`optionChecked="props.value === option.value"`,types:['select', 'tabs']},
                'optionBefore':{
                    value:<Icon path={mdiAccount} size={0.8} />,
                    code:`optionBefore={<Icon path={mdiAccount} size={0.8} />}`,
                    types:['select', 'multiselect', 'radio', 'tabs']
                },
                'optionAfter':{
                    value:<Icon path={mdiArrowLeftRight} size={0.8} />,
                    code:`optionAfter={<Icon path={mdiArrowLeftRight} size={0.8} />}`,
                    types:['select', 'multiselect', 'radio', 'tabs']
                },
                'optionSubtext':{value:'my subtext',code:`optionSubtext="my subtext"`,types:['select', 'multiselect', 'radio', 'tabs']},
                'optionTagBefore':{value:<Icon path={mdiAccount} size={0.5} />,code:`optionTagBefore={<Icon path={mdiAccount} size={0.5} />}`,types:['multiselect']},
                'optionTagAfter':{
                    value:<Icon path={mdiNumeric6Circle} size={0.7} />,
                    code:`optionTagAfter={<Icon path={mdiNumeric6Circle} size={0.7} />}`,
                    types:['multiselect']
                },
                'optionTagAttrs':{
                    value:{ style: { background: 'orange' } },
                    code:`optionTagAttrs={{ style: { background: 'orange' } }}`,
                    types:['multiselect']
                },

                'hideTags':{value:true,code:`hideTags={true}`,types:['multiselect']},
                'optionShow':{
                    value:'option.id !== "2" && option.value !== "2"',
                    code:`optionShow='option.id !== "2" && option.value !== "2"'`,
                    types:['select', 'multiselect', 'radio', 'tabs']
                },
                'optionStyle':{
                    value:'option.value ==="3"?{background:"orange"}:undefined',
                    code:`optionStyle='option.value ==="3"?{background:"orange"}:undefined'`,
                    types:['select', 'multiselect', 'radio', 'tabs']
                },
                'header':{value:'this is my header',code:`header='this is my header'`,types:['table','form']},
                'filter':{
                    value:['!','@','#','$','%','^','&','*','(',',',')','_','+','-','='],
                    code:`filter={['!','@','#','$','%','^','&','*','(',',',')','_','+','-','=']}`,
                    types:['text','password']
                },
                'options':{
                    value:[{text:'mohammad'},{text:'ali'},{text:'mohsen'}],
                    code:`options={[{text:'mohammad'},{text:'ali'},{text:'mohsen'}]}`,
                    types:['text','textarea','number','password']
                },
                'justNumber':{value:true,code:`justNumber={true}`,types:['text','password']},
                'spin':{value:false,code:`spin={false}`,types:['number']},
                'swip':{value:true,code:`swip={true}`,types:['number']},
                'multiple':{value:true,code:`multiple={true}`,types:['file', 'radio', 'tabs']},
                'text':{value:'my text',code:`text='my text'`,types:['button', 'file', 'select', 'multiselect', 'checkbox', 'datepicker']},
                'before':{
                    value:<Icon path={mdiAccount} size={0.8} />,
                    code:`before={<Icon path={mdiAccount} size={0.8} />}`,
                    types:['button', 'file', 'select', 'multiselect', 'radio', 'tabs', 'checkbox', 'datepicker','text','number','textarea','color','password','slider']
                },
                'after':{
                    value:<Icon path={mdiArrowLeftRight} size={0.8} />,
                    code:`after={<Icon path={mdiArrowLeftRight} size={0.8} />}`,
                    types:['button', 'file', 'select', 'multiselect', 'radio', 'tabs', 'checkbox', 'datepicker','text','number','textarea','color','password','slider']
                },
                'subtext':{
                    value:'my subtext',code:`subtext='my subtext'`,
                    types:['button', 'file', 'select', 'multiselect', 'radio', 'tabs', 'checkbox', 'datepicker','text','number','textarea','color','password','slider']
                },
                'label':{
                    value:'my label',code:`label='my label'`,
                    types:['button', 'file', 'select', 'multiselect', 'radio', 'tabs', 'checkbox', 'datepicker','text','number','textarea','color','password','slider']
                },
                'disabled':{
                    value:true,code:`disabled={true}`,
                    types:['button', 'file', 'select', 'multiselect', 'radio', 'tabs', 'checkbox', 'datepicker','text','number','textarea','color','password','slider']
                },
                'popover':{
                    value:{
                        render:({close}) => {
                            return (
                                <div style={{ padding: 12 }}>
                                    this is my popover. you can place html here
                                    <br />
                                    <button onClick={() => close()}>click here to close</button>
                                </div>
                            )
                        },
                        fitHorizontal:true,
                        position:'bottom',
                        attrs:{
                            style:{maxWidth:500}
                        }
                    },
                    code:`popOver={(toggle) => {
            return (
                <div style={{ padding: 12 }}>
                    this is my popOver. you can place html here
                    <br />
                    <button onClick={() => toggle()}>click here to close</button>
                </div>
            )
        }}`,
                    types:['button']
                },
                'inputs':{
                    value:{
                        props:{gap:12},
                        column:[
                            {
                                row:[
                                    {
                                        field:'value.firstname',label:'first name',validations:[['required']],
                                        input:{type:'text'}
                                    },
                                    {
                                        field:'value.lastname',label:'last name',size:120,
                                        input:{type:'text'}
                                    },
                                    {
                                        field:'value.age',label:'age',size:60,
                                        input:{type:'number'}
                                    }, 
                                ]
                            },
                            {
                                row:[
                                    {
                                        field:'value.range',label:'range',
                                        input:{type:'slider',start:50,end:100}
                                    },
                                    {
                                        field:'value.color',label:'color',
                                        input:{type:'color'}
                                    }
                                ]
                            },
                            {
                                field:'value.gender',label:'Gender',
                                input:{
                                    type:'radio',
                                    options:[
                                        {text:'Male',value:'male'},
                                        {text:'Female',value:'female'}
                                    ]
                                }
                            },
                            {
                                show:'value.gender === "male"',
                                field:'value.militaryService',
                                label:'Military Service',
                                input:{
                                    type:'select',
                                    options:[
                                        {text:'Exempt',value:'exm'},
                                        {text:'End Of Service',value:'eos'}
                                    ]
                                }
                            },
                            {
                                row:[
                                    {input:{type:'datepicker'},label:'start date',field:'value.startdate'},
                                    {input:{type:'datepicker'},label:'end date',field:'value.enddate'}
                                ]
                            },
                            {
                                props:{
                                    inlineLabelAttrs:{
                                        style:{width:120,justifyContent:'end',padding:'0 12px'}
                                    }
                                },
                                column:[
                                    {
                                        row:[
                                            {
                                                field:'value.firstname',inlineLabel:'first name',validations:[['required']],
                                                input:{type:'text'}
                                            },
                                            {
                                                field:'value.lastname',inlineLabel:'last name',
                                                input:{type:'text'}
                                            },
                                        ]
                                    },
                                    {
                                        row:[
                                            {
                                                field:'value.age',inlineLabel:'age',
                                                input:{type:'number'}
                                            }, 
                                            {
                                                inlineLabel:'Gender',field:'value.gender',
                                                input:{
                                                    type:'radio',optionStyle:{width:"100%"},
                                                    options:[
                                                        {text:'Male',value:'male'},
                                                        {text:'Female',value:'female'}
                                                    ]
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        field:'value.address',inlineLabel:'address',
                                        input:{type:'textarea'}
                                    },
                                    {
                                        show:'value.gender === "male"',
                                        field:'value.militaryService',
                                        inlineLabel:'Military Service',
                                        input:{
                                            type:'select',
                                            options:[
                                                {text:'Exempt',value:'exm'},
                                                {text:'End Of Service',value:'eos'}
                                            ]
                                        }
                                    },
                                    {input:{type:'datepicker'},inlineLabel:'start date',field:'value.startdate'},
                                    {input:{type:'datepicker'},inlineLabel:'end date',field:'value.enddate'}   
                                ]
                            }
                        ]
                    },
                    code:`inputs={{
            gap:12,
            column:[
                {
                    gap:12,
                    row:[
                        {input:{type:'text',field:'firstname'},label:'first name'},
                        {input:{type:'text',field:'lastname'},label:'last name',size:120},
                        {input:{type:'number',field:'age'},label:'age',size:60}, 
                    ]
                },
                {
                    gap:12,
                    row:[
                        {input:{type:'datepicker',field:'startdate'},label:'start date'},
                        {input:{type:'datepicker',field:'enddate'},label:'end date'}
                    ]
                }
            ]
        }}
                    `,
                    types:['form']
                }
            },
            type: this.Storage.load({ name: 'type', def: 'button' }),
            rows: [
                {
                    firstname: 'john', lastname: 'doe', age: 18, gender: 'male', salary: 14000,
                },
                {
                    firstname: 'martin', lastname: 'graham', age: 26, gender: 'male', salary: 2500000,
                },
                {
                    firstname: 'alexa', lastname: 'mills', age: 32, gender: 'female', salary: 3600000,
                },
            ],
            columns:[
                {title:'Name',value:'row.firstname',size:100},
                {title:'Family',value:'row.lastname'},
                {
                    title:'Gender',value:'row.gender',type:'select',size:100,
                    options:[{text:'Male',value:'male'},{text:'Female',value:'female'}]
                },
                {title:'Age',value:'row.age',size:68,justify:true,type:'number'},
                {title:'Salary',size:96,value:'row.salary'}
            ],
            options: [
                { text: 'option 1', value: '1' },
                { text: 'option 2', value: '2' },
                { text: 'option 3', value: '3' },
                { text: 'option 4', value: '4' },
                { text: 'option 5', value: '5' },
                { text: 'option 6', value: '6' },
                { text: 'option 7', value: '7' },
                { text: 'option 8', value: '8' },
                { text: 'option 9', value: '9' },
                { text: 'option 10', value: '10' },
                { text: 'option 11', value: '11' },
                { text: 'option 12', value: '12' },

            ],
        }
        let keys = Object.keys(this.state.props)
        for (let i = 0; i < keys.length; i++) {
            let prop = keys[i];
            this.state.props[prop].active = this.Storage.load({ name: prop, def: false })
        }
    }
    changeToolbar(key, value) {
        this.Storage.save({ name: key, value })
        let {props} = this.state;
        props[key].active = value;
        this.setState({ props })
    }
    changeType(e) {
        let type = e.target.value;
        this.Storage.save({ name: 'type', value: type })
        this.setState({ type,value:undefined })
    }
    renderToolbar() {
        let { type,props } = this.state;
        let keys = Object.keys(props);
        return (
            <>
                <div>type</div>
                <select value={type} onChange={(e) => this.changeType(e)} style={{ width: 90 }}>
                    <option value={'button'}>button</option>
                    <option value={'file'}>file</option>
                    <option value={'select'}>select</option>
                    <option value={'multiselect'}>multiselect</option>
                    <option value={'radio'}>radio</option>
                    <option value={'tabs'}>tabs</option>
                    <option value={'checkbox'}>checkbox</option>
                    <option value={'datepicker'}>datepicker</option>
                    <option value={'text'}>text</option>
                    <option value={'number'}>number</option>
                    <option value={'textarea'}>textarea</option>
                    <option value={'password'}>password</option>
                    <option value={'color'}>color</option>
                    <option value={'slider'}>slider</option>
                    <option value={'form'}>form</option>
                    <option value={'table'}>table</option>
                </select>
                <div style={{ display: 'inline-block', border: '1px solid', width: '100%', padding: 12, boxSizing: 'border-box' }}>
                    {
                        keys.map((prop, i) => {
                            let types = props[prop].types
                            if (types.indexOf(type) === -1) { return null }
                            return (
                                <AIOInput
                                    style={{ float: 'left', width: 'fit-content' }}
                                    text={prop}
                                    type='checkbox' value={props[prop].active}
                                    onChange={(value) => this.changeToolbar(prop, value)} />
                            )

                        })
                    }
                </div>
            </>

        )
    }
    getProps() {
        let {type,options,props,value} = this.state;
        let Props = { type};
        for(let prop in props){
            if(props[prop].active && props[prop].types.indexOf(type) !== -1){
                Props[prop] = props[prop].value;
            }
        }
        if (type === 'select' || type === 'multiselect' || type === 'radio' || type === 'tabs') {
            Props.options = options;
        }
        if(type !== 'button'){
            Props.value = value;
            Props.onChange = (value)=>this.setState({value})
        }
        return Props
    }
    render() {
        let {goToHome} = this.props;
        let { type,props} = this.state;
        return (
            <>
                <button onClick={()=>goToHome()}>Back To Home</button>
                <div className='example'>
                    {this.renderToolbar()}
                    <div style={{ height: 36 }}></div>
                    <AIOInput key={type} {...this.getProps()} />
                    {type !== 'table' && renderCode(type,props)}
                    {type === 'table' && TableCode(this.state)}
                </div>
            </>
        );
    }
}
function renderCode(type,props){
    let { Titr, Code } = AIODoc();
    let rows = [`type="${type}"`];
    if(type !== 'button'){
        rows.push('value={value}')
        rows.push('onChange={(value)=>this.setState({value})')
    }
    let keys = Object.keys(props);
    for(let i = 0; i < keys.length; i++){
        let key = keys[i]; 
        let {types,code,active} = props[key];
        if(active && types.indexOf(type) !== -1){
            rows.push(code)
        }
    }
    
    let str = ''
    for(let i = 0; i < rows.length; i++){
        str += '\n';
        str += `        `;
        str += rows[i]
    }
    return Code(
        `${type !== 'button'?`let {value} = this.state;`:''}
return (
    <AIOInput
        ${str}
    />
)
            `)
}

function TableCode({a_getValue,a_header,a_style}){
    let { Titr, Code } = AIODoc();
        
    return Code(`
<AIOInput
    type="table"
    ${a_header?`header='this is my header'`:''}
    ${a_style?`style={{background:"orange"}}`:''}
    ${a_getValue?
    `columns={[
        {template:'avatar',size:60},
        {title:'Name',value:'row.firstname',size:100,cellAttrs:'cellAttrs'},
        {title:'Family',value:'row.lastname',after:'after',before:'before',subtext:'this is your subtext'},
        {title:'Age',value:'row.age',size:68,justify:true},
        {title:'Salary',size:96,value:'row.salary',template:'salary'}
    ]}
    getValue={{
        after:()=><Icon path={mdiAccount} size={.9}/>,
        before:()=><Icon path={mdiAccount} size={.9}/>,
        cellAttrs:(row)=>{
            let style = {background:row.gender === 'male'?'lightblue':'pink'}
            return {style}
        },
        salary:(row)=>{
            return row.salary + ' $'
        },
        avatar:(row)=>{
            let src;
            if(row.gender === 'male'){
                src = 'https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg'
            }
            else if(row.gender === 'female'){
                src = 'https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png'
            }
            return (
                <img src={src} width={36} height={36} alt=''/>
            )
        }
    }}`:''
    }
    onChange={(rows)=>this.setState({rows})}
/>
                        `)
}


