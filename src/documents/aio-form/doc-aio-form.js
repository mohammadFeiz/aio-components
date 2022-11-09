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
        this.state = {model:{}}
    }
    render(){
        let {model} = this.state;
        return (
            <Form
                model={model}
                onChange={(model)=>this.setState({model})}
                inputs={[
                    {type:'datepicker',field:'model.date',calendarType:'jalali',unit:'hour'}
                ]}
            
            />            
        )
    }
}