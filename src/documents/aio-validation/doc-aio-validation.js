import React,{Component} from 'react';
import AIOInput,{AIOValidation} from './../../npm/aio-input/aio-input';
import DOC from '../../resuse-components/doc';
export default class DOC_AIOValidation extends Component{
    constructor(props){
        super(props);
        this.state = {operator:'date<',value:'1401/4/6',label:'value',lang:'fa',target:'1401/4/4'}
    }
    
    render(){
        return (
            <DOC
                {...this.props}
                navId='!='
                navs={[
                    {text:'try it',id:'try it',COMPONENT:()=><TryIt/>},
                    {text:'=',id:'=',COMPONENT:()=><Equal/>},
                    {text:'!=',id:'!=',COMPONENT:()=><NotEqual/>}
                ]}
            />
        )
    }
}

class TryIt extends Component{
    constructor(props){
        super(props);
        this.state = {operator:'date<',value:'1401/4/6',label:'value',lang:'fa',target:'1401/4/4'}
    }
    getValue(value){
        try{
            if(value === ''){return ''}
            if(!isNaN(+value)){return +value}
            if(value.indexOf('[') !== -1 ){return JSON.parse(value)}
        }
        catch{return value}
        return value
    }
    render(){
        let {operator,value,label,lang,target} = this.state;

        return (
            <div className='example' style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                label is :
                <input type='text' value={label} onChange={(e)=>this.setState({label:e.target.value})}/>
                <AIOInput 
                    type='select' 
                    before='Language is : '
                    value={lang}
                    onChange={(lang)=>this.setState({lang})}
                    options={[
                        {text:'en',value:'en'},
                        {text:'fa',value:'fa'}, 
                    ]}

                />
                
                
                
                value is :
                <input type='text' value={value} onChange={(e)=>this.setState({value:e.target.value})}/>
                <AIOInput 
                    type='select' 
                    before='Operator is : '
                    value={operator}
                    onChange={(operator)=>this.setState({operator})}
                    options={[
                        {text:'required',value:'required'},
                        {text:'contain',value:'contain'},
                        {text:'!contain',value:'!contain'},
                        {text:'length',value:'length'},
                        {text:'!length',value:'!length'},
                        {text:'length<',value:'length<'},
                        {text:'length<=',value:'length<='},
                        {text:'length>',value:'length>'},
                        {text:'length>=',value:'length>='},
                        {text:'=',value:'='},
                        {text:'!=',value:'!='},
                        {text:'<',value:'<='},
                        {text:'>',value:'>'},
                        {text:'>=',value:'>='},
                        {text:'date<',value:'date<'},
                        {text:'date<=',value:'date<='},
                        {text:'date>',value:'date>'},
                        {text:'date>=',value:'date>='}
                    ]}

                />
                target is :
                <input type='text' value={target} onChange={(e)=>this.setState({target:e.target.value})}/>
                
                code is :
                <pre>
                    {
                        JSON.stringify({
                            title:label,
                            lang,
                            validations:[
                                [operator,this.getValue(target)]
                            ],
                            value:this.getValue(value)
                        },null,4)
                    }
                </pre>
                <br/>
                result is :
                <br/>
                <textarea 
                    style={{width:400,height:200,direction:lang === 'fa'?'rtl':'ltr'}} 
                    type='text' 
                    value={
                        AIOValidation({
                            title:label,
                            lang,
                            validations:[
                                [operator,this.getValue(target)]
                            ],
                            value:this.getValue(value)
                        })
                    } 
                    disabled
                />
            </div>
        )
    }
}
class Equal extends Component{
    render(){
        return (
            <div className='example'>
                <pre>{`
let res = AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['=',10]
    ],
    value:10
})
// res is ${AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['=',10]
    ],
    value:10
})}

let res = AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['=',11]
    ],
    value:10
})
// res is '${AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['=',11]
    ],
    value:10
})}'

let res = AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['=',11,{message:'مقدار وارد شده صحیح نیست'}]
    ],
    value:10
})
// res is '${AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['=',11,{message:'مقدار وارد شده صحیح نیست'}]
    ],
    value:10
})}'
                `}</pre>
            </div>
        )
    }
}

class NotEqual extends Component{
    render(){
        return (
            <div className='example'>
                <pre>{`
let res = AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['!=',10]
    ],
    value:10
})
// res is ${AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['!=',10]
    ],
    value:10
})}

let res = AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['!=',11]
    ],
    value:10
})
// res is '${AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['!=',11]
    ],
    value:10
})}'

let res = AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['!=',10,{message:'مقدار وارد شده صحیح نیست'}]
    ],
    value:10
})
// res is '${AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['!=',10,{message:'مقدار وارد شده صحیح نیست'}]
    ],
    value:10
})}'

let res = AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['!=',10,{target:'عدد قبلی'}]
    ],
    value:10
})
// res is '${AIOValidation({
    lang:'fa',
    title:'مقدار',
    validations:[
        ['!=',10,{target:'عدد قبلی'}]
    ],
    value:10
})}'
                `}</pre>
            </div>
        )
    }
}