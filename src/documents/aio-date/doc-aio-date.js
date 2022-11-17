import React,{Component} from 'react';
import AIODate from './../../npm/aio-date/aio-date';
import AIOButton from './../../npm/aio-button/aio-button';
import AIODatepicker from './../../npm/aio-datepicker/aio-datepicker';
import DOC from '../../resuse-components/doc';
{/* <div className="aio-component-label">label</div>
<div className='aio-component-splitter'></div> */}
export default class DOC_AIODate extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='isMatch'
                navs={[
                    {text:'gregorianToJalali',id:'gregorianToJalali',COMPONENT:()=><GregorianToJalali/>},
                    {text:'jalaliToGregorian',id:'jalaliToGregorian',COMPONENT:()=><JalaliToGregorian/>},
                    {text:'isMatch',id:'isMatch',COMPONENT:()=><IsMatch/>},
                ]}
            />
        )
    }
}

class GregorianToJalali extends Component{
    constructor(props){
        super(props);
        this.state = {value:'2022/4/4'}
    }
    render(){
        let {value} = this.state;
        let res = AIODate().gregorianToJalali(value);
        return (
            <div className='example'>
                <div className="aio-component-label">Inter Gregorian Date</div>
                <input type='text' value={value} onChange={(e)=>this.setState({value:e.target.value})}/>
                <div className="aio-component-label" style={{background:'dodgerblue',color:'#fff',marginTop:12}}>{`Jalali Date is : ${res}`}</div>
                <pre>
                    {`
let res = AIODate().gregorianToJalali('${value}');
let text = "Jalali Date is :" + res 
                    `}
                </pre>
            </div>
        )
    }
}

class JalaliToGregorian extends Component{
    constructor(props){
        super(props);
        this.state = {value:'1400/2/2'}
    }
    render(){
        let {value} = this.state;
        let res = AIODate().jalaliToGregorian(value);
        return (
            <div className='example'>
                <div className="aio-component-label">Inter Jalali Date</div>
                <input type='text' value={value} onChange={(e)=>this.setState({value:e.target.value})}/>
                <div className="aio-component-label" style={{background:'dodgerblue',color:'#fff',marginTop:12}}>{`Gregorian Date is : ${res}`}</div>
                <pre>
                    {`
let res = AIODate().jalaliToGregorian('${value}');
let text = "Gregorian Date is :" + res 
                    `}
                </pre>
            </div>
        )
    }
}


class IsMatch extends Component{
    constructor(props){
        super(props);
        this.state = {date:'2022/11/5',matcher:'6',operator:'w'}
    }
    render(){
        let {date,matcher,operator} = this.state;
        let res = AIODate().isMatch(date,[`${operator},${matcher}`]);
        return (
            <div className='example'>
                <div className="aio-component-label">Inter Date</div>
                <AIODatepicker
                    value={date}
                    onChange={({dateString})=>this.setState({date:dateString})}
                />
                <br/>
                <div className="aio-component-label">Inter operator</div>
                <AIOButton
                    type='select'
                    options={[
                        {text:'equal (=)',value:'='},
                        {text:'not equal (!=)',value:'!='},
                        {text:'less than (<)',value:'<'},
                        {text:'greater than (>)',value:'>'},
                        {text:'less equal than (<=)',value:'<='},
                        {text:'greater equal than (>=)',value:'>='},
                        {text:'between (<>)',value:'<>'},
                        {text:'not between (!<>)',value:'!<>'},
                        {text:'between equal (<=>)',value:'<=>'},
                        {text:'not between equal (!<=>)',value:'!<=>'},
                        {text:'weekday equal (w)',value:'w'},
                        {text:'weekday not equal (!w)',value:'!w'} 
                    ]}
                    value={operator}
                    onChange={(operator)=>this.setState({operator})}
                />
                <br/>
                <div className="aio-component-label">Inter Matcher</div>
                <input type='text' value={matcher} onChange={(e)=>this.setState({matcher:e.target.value})}/>
                
                <div className="aio-component-label" style={{background:'dodgerblue',color:'#fff',marginTop:12}}>{`result is : ${res}`}</div>
                <pre>
                    {`
let result = AIODate().isMatch('${date}',['${operator},${matcher}']);
                    `}
                </pre>
                
            </div>
        )
    }
}