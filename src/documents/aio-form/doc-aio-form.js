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
        return (
            <Form
                model={model}
                onChange={(model)=>this.setState({model})}
                inputs={[
                    {type:'text',field:'model.date',label:'Date'},
                    {type:'radio',options:[{text:'jalali',value:'jalali'},{text:'gregorian',value:'gregorian'}],field:'model.calendarType',label:'Calendar Type'},
                    {type:'radio',options:[{text:'month',value:'month'},{text:'day',value:'day'},{text:'hour',value:'hour'}],field:'model.unit',label:'Calendar Unit'},
                    {type:'datepicker',field:'model.date',calendarType:model.calendarType,unit:model.unit},
                ]}
            
            />            
        )
    }
}