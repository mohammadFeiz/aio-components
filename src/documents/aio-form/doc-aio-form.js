import React,{Component} from 'react';
import Form from './../../npm/aio-form-react/aio-form-react';
import DOC from '../../resuse-components/doc';
export default class DOC_AIOForm extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navs={[
                    {text:'input-datepicker',id:'input-datepicker',COMPONENT:()=><InputDatepicker/>}
                ]}
            />
        )
    }
}

class InputDatepicker extends Component{
    constructor(props){
        super(props);
        this.state = {model:{calendarType:'gregorian',unit:'day',date:''}}
    }
    render(){
        let {model} = this.state;
        let input = {
            type:'datepicker',field:'model.date',calendarType:model.calendarType,unit:model.unit,prefix:model.prefix,affix:model.affix,startYear:model.startYear,
            endYear:model.endYear
        }
        return (
            <Form
                model={model}
                inlineLabel={true}
                labelStyle={{justifyContent:'flex-end'}}
                onChange={(model)=>this.setState({model})}
                inputs={[
                    {type:'radio',options:[{text:'jalali',value:'jalali'},{text:'gregorian',value:'gregorian'}],field:'model.calendarType',optionStyle:{width:'fit-content'},rowKey:'1'},
                    {type:'radio',options:[{text:'month',value:'month'},{text:'day',value:'day'},{text:'hour',value:'hour'}],field:'model.unit',optionStyle:{width:'fit-content'},rowKey:'1'},
                    {type:'text',field:'model.date',label:'Date',rowKey:'2'},
                    {type:'text',field:'model.prefix',label:'prefix',rowKey:'2'},
                    {type:'text',field:'model.affix',label:'affix',rowKey:'2'},
                    {type:'text',field:'model.startYear',label:'startYear',rowKey:'2'},
                    {type:'text',field:'model.endYear',label:'endYear',rowKey:'2'},
                    {...input},
                    {type:'html',html:()=>{
                        return (
                            <pre>
                                {JSON.stringify(input,null,4)}
                            </pre>
                        )
                    }}
                ]}
            
            />            
        )
    }
}