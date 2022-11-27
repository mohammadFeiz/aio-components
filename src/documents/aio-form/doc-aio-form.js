import React,{Component} from 'react';
import Form from './../../npm/aio-form-react/aio-form-react';
import DOC from '../../resuse-components/doc';
import AIOJson from './../../npm/aio-json/aio-json';
import {Icon} from '@mdi/react';
import { mdiDelete ,mdiPlusThick} from '@mdi/js';
import RVD from '../../npm/react-virtual-dom/react-virtual-dom';
import AIOButton from './../../npm/aio-button/aio-button';
import './index.css';
export default class DOC_AIOForm extends Component{
    render(){
        return (
            <Input {...this.props}/>
        )
    }
}
class Input extends Component{
    state = {
        input:false,model:{},
        inputs:[
            {
                "type": "select",
                "name": "input1448",
                "id": "a85279",
                "_index": 0,
                "field": "model.gender",
                "label": "gender",
                "options": [
                    {
                        "text": "Male",
                        "value": "1",
                        "_id": "row0.7765310038338205"
                    },
                    {
                        "text": "Female",
                        "value": "2",
                        "_id": "row0.6515422090064036"
                    }
                ]
            }
        ],
        mode:'preview'
    }
    show(type,field){
        if(field === 'text'){
            return ['checkbox','multiselect'].indexOf(type) !== -1
        }
        if(field === 'placeholder'){
            return ['datepicker','text','number','textarea'].indexOf(type) !== -1
        }
        if(field === 'options'){
            return ['select','multiselect','radio','text','number','color'].indexOf(type) !== -1
        }
    }
    getInputs(type){
        let calendarTypeOptions = [{text:'jalali',value:'jalali'},{text:'gregorian',value:'gregorian'}];
        let unitOptions = [{text:'month',value:'month'},{text:'day',value:'day'},{text:'hour',value:'hour'}];
        return [
            {type:'text',field:'model.name',label:'name'},
            {type:'text',field:'model.field',label:'field'},
            {type:'text',field:'model.label',label:'label'},
            {type:'checkbox',field:'model.inlineLabel',label:'inlineLabel'},
            //{type:'textarea',autoHeight:true,field:'model.labelStyle',label:'labelStyle'},
            //{type:'textarea',autoHeight:true,field:'model.inputStyle',label:'inputStyle'},
            {type:'text',field:'model.rowKey',label:'rowKey'},
            {type:'number',field:'model.rowWidth',label:'rowWidth'},
            {type:'text',field:'model.prefix',label:'prefix'},
            {type:'text',field:'model.affix',label:'affix'},
            {type:'checkbox',field:'model.autoHeight',label:'autoHeight',show:type === 'textarea'},
            {
                type:'group',id:'datepicker',show:type === 'datepicker',
                inputs:[
                    {type:'select',options:calendarTypeOptions,field:'model.calendarType',label:'calendarType'},
                    {type:'select',options:unitOptions,field:'model.unit',label:'unit'},
                    {type:'text',field:'model.startYear',label:'startYear'},
                    {type:'text',field:'model.endYear',label:'endYear'},
                    {type:'html',html:()=><div style={{justifyContent:'end',width:'100%',display:'flex',padding:'0 6px'}}>colors</div>,rowKey:'datepicker theme',rowWidth:86},
                    {type:'color',field:'model.colors[0]',rowKey:'datepicker theme'},
                    {type:'color',field:'model.colors[1]',rowKey:'datepicker theme'},
                ]
            },
            {type:'text',field:'model.placeholder',label:'placeholder',show:this.show(type,'placeholder')},
            {type:'text',field:'model.text',label:'text',show:this.show(type,'text')},
            {
                inlineLabel:false,type:'table',field:'model.options',label:'options',show:this.show(type,'options'),
                columns:[{title:'text',field:'text',type:'text'},{title:'value',field:'value',type:'text'}]
            },
            {
                type:'table',field:'model.Validations',label:'Validations',inlineLabel:false,
                onChange:(value)=>{
                    let {input} = this.state;
                    input.validations = value.map(({operator,target = ''})=>{
                        let Target;
                        try{Target = JSON.parse(target)}
                        catch{Target = undefined}
                        return [operator,Target]
                    })
                    input.Validations = value;
                    this.setState({input})
                },
                columns:[
                    {
                        title:'Operator',type:'select',field:'operator',
                        options:[
                            {text:'required',value:'required'},
                            {value:'=',text:'equal'},
                            {value:'!=',text:'not equal'},
                            {value:'<',text:'less than'},
                            {value:'<=',text:'less equal than'},
                            {value:'>',text:'greater than'},
                            {value:'>=',text:'greater equal than'},
                            {value:'length=',text:'lenght equal'},
                            {value:'length!=',text:'length not equal'},
                            {value:'length<',text:'length less than'},
                            {value:'length>',text:'length greater than'},
                            {value:'date<',text:'date before'},
                            {value:'date<=',text:'date before equal'},
                            {value:'date>',text:'date after'},
                            {value:'date>=',text:'date after equal'},
                            {value:'contain',text:'contain'},
                            {value:'!contain',text:'not contain'}
                        ]
                    },
                    {title:'Target',type:'text',field:'target'}
                ]
              }
                    
        ]
    }
    activeInputForm_layout(){
        let {input} = this.state;
        if(!input){return false}
        return {
            html:(
                <Form
                    header={{
                        onClose:()=>this.setState({input:false}),
                        style:{background:'none',height:36,borderBottom:'1px solid #2c3d37'},
                        title:`${input.name} (${input.type})`
                    }}
                    key={input.id}
                    inlineLabel={true}
                    rowStyle={{marginBottom:2}}
                    inputStyle={{height:24,background:'rgba(138, 166, 216, 0.1)',border:'none',color:'#fff',borderRadius:0,fontSize:10}}
                    labelStyle={{width:80,justifyContent:'end'}}
                    bodyStyle={{padding:12}}
                    model={input}
                    style={{width:280,height:'100%',background:'none',color:'#8f9b9d'}}
                    inputs={this.getInputs(input.type)}
                    onChange={(input)=>this.setState({input})}
                />
            )
        }
    }
    preview_layout(){
        let {mode} = this.state;
        return {
            flex:1,
            html:this['preview_' + mode]()
        }
    }
    preview_preview(){
        let {model,inputs} = this.state;
        return (
            <Form
                model={model} inputs={inputs}
                onChange={(model)=>this.setState({model})}
            />
        )
    }
    preview_model(){
        let {model} = this.state;
        return (
            <AIOJson json={model} onChange={(model)=>this.setState({model})}/>
        )
    }
    preview_inputs(){
        let {inputs} = this.state;
        return (
            <AIOJson json={inputs} onChange={(inputs)=>this.setState({inputs})}/>
        )
    }
    preview_selectedInput(){
        let {input} = this.state;
        if(!input){return null}
        return (
            <AIOJson json={input} onChange={(input)=>this.setState({input})}/>
        )
    }
    inputs_layout(){
        let {inputs} = this.state;
        return {
            size:240,
            column:inputs.map((input,i)=>{
                let {type,name} = input;
                let active = this.state.input && input.id === this.state.input.id;
                return {
                    align:'v',swapId:i,
                    style:{
                        height:36,padding:'0 12px',
                        background:active?'#2e577f':'rgb(138 166 216 / 10%)',
                        color:'#fff',
                        fontSize:12,
                        marginBottom:1
                    },
                    row:[
                        {
                            flex:1,align:'v',style:{height:'100%'},
                            html:`${name} (${type})`,
                            attrs:{
                                onClick:()=>{
                                    if(active){this.setState({input:false})}
                                    else {this.setState({input})}
                                }
                            }      
                        },
                        {html:<Icon path={mdiDelete} size={0.7} />,align:'vh',attrs:{onClick:()=>{
                            this.setState({inputs:inputs.filter((o)=>input.id !== o.id)})
                        }}}
                    ]
                }
            })
        }
    }
    toolbar_layout(){
        let {inputs,mode} = this.state;
        return {
            size:48,align:'v',gap:1,
            row:[
                {
                    size:240,
                    html:(
                        <AIOButton 
                            before={<Icon path={mdiPlusThick} size={0.7}/>}
                            caretAttrs={{style:{width:24}}}
                            text='Add Input'
                            style={{background:'#2a59545c',color:'#fff',width:'100%',height:48}}
                            type='select'
                            popupWidth='fit'
                            options={[
                                {text:'text',value:'text'},
                                {text:'number',value:'number'},
                                {text:'textarea',value:'textarea'},
                                {text:'color',value:'color'},
                                {text:'select',value:'select'},
                                {text:'datepicker',value:'datepicker'}
                            ]}
                            onChange={(type)=>{
                                this.setState({inputs:inputs.concat({type,name:'input' + Math.round(Math.random() * 100000),id:'a' + Math.round(Math.random() * 100000)})})
                            }}
                        />
                    )
                },
                {
                    flex:1,
                    html:(
                        <AIOButton 
                            style={{background:'#2a59545c',color:'#fff',height:48}}
                            type='tabs'
                            value={mode}
                            options={[
                                {text:'Preview',value:'preview'},
                                {text:'Model',value:'model'},
                                {text:'Inputs',value:'inputs'},
                                {text:'Selected Input',value:'selectedInput'},
                            ]}
                            onChange={(mode)=>{
                                this.setState({mode})
                            }}
                        />
                    )
                },
                {
                    html:(
                        <AIOButton
                            style={{background:'#2a59545c',color:'#fff',height:48}}
                            type='button'
                            text='Exit'
                            onClick={()=>this.props.goToHome()}
                        />
                    )
                }
            ]
        }
    }
    render(){
        return (
            <RVD
                onSwap={(from,to)=>{
                    let {inputs} = this.state;
                    let a = {...inputs[from]};
                    inputs[from] = false;
                    inputs.splice(to,0,a);
                    inputs = inputs.filter((o)=>o !== false)
                    this.setState({inputs})
                }}
                layout={{
                    style:{position:'fixed',height:'100%',flex:'none',width:'100%',left:0,top:0,background:'#1d292c'},
                    column:[
                        this.toolbar_layout(),
                        {
                            flex:1,
                            row:[
                                this.inputs_layout(),
                                this.preview_layout(),
                                this.activeInputForm_layout()
                            ]
                        }
                    ]
                }}
            />
        )
    }
}
