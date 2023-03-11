import React,{Component} from 'react';
import AIODate from './../../npm/aio-date/aio-date';
import AIOButton from './../../npm/aio-button/aio-button';
import AIODatepicker from './../../npm/aio-datepicker/aio-datepicker';
import Form from './../../npm/aio-form-react/aio-form-react';
import DOC from '../../resuse-components/doc';
{/* <div className="aio-component-label">label</div>
<div className='aio-component-splitter'></div> */}
export default class DOC_AIODate extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='getDatesBetween'
                navs={[
                    {text:'toJalali',id:'toJalali',COMPONENT:()=><ToJalali/>},
                    {text:'toGregorian',id:'toGregorian',COMPONENT:()=><ToGregorian/>},
                    {text:'isMatch',id:'isMatch',COMPONENT:()=><IsMatch/>},
                    {text:'getToday',id:'getToday',COMPONENT:()=><GetToday/>},
                    {text:'getWeekDay',id:'getWeekDay',COMPONENT:()=><GetWeekDay/>},
                    {text:'getDateByPattern',id:'getDateByPattern',COMPONENT:()=><GetDateByPattern/>},
                    {text:'getDelta',id:'getDelta',COMPONENT:()=><GetDelta/>},
                    {text:'getNextTime',id:'getNextTime',COMPONENT:()=><GetNextTime/>},
                    {text:'compaire',id:'compaire',COMPONENT:()=><Compaire/>},
                    {text:'getTime',id:'getTime',COMPONENT:()=><GetTime/>},
                    {text:'getMonthDaysLength',id:'getMonthDaysLength',COMPONENT:()=><GetMonthDaysLength/>},
                    {text:'getMonths',id:'getMonths',COMPONENT:()=><GetMonths/>},
                    {text:'getWeekDays',id:'getWeekDays',COMPONENT:()=><GetWeekDays/>},
                    {text:'convertToArray',id:'convertToArray',COMPONENT:()=><ConvertToArray/>},
                    {text:'getDatesBetween',id:'getDatesBetween',COMPONENT:()=><GetDatesBetween/>},
                ]}
            />
        )
    }
}

class ToJalali extends Component{
    constructor(props){
        super(props);
        this.state = {value:'2022/4/4'}
    }
    render(){
        let {value} = this.state;
        let result = AIODate().toJalali({date:value});
        return (
            <div className='example'>
                <div className="aio-component-label">Inter Gregorian Date</div>
                <input type='text' value={value} onChange={(e)=>this.setState({value:e.target.value})}/>
                <pre>
                    {`
let result = AIODate().toJalali({date:'${value}'});
//result is ${JSON.stringify(result)}

let result = AIODate().toJalali({date:'${value}',pattern:'{year}/{month}/{day}'});
//result is '${AIODate().toJalali({date:value,pattern:'{year}/{month}/{day}'})}'
                    `}
                </pre>
            </div>
        )
    }
}

class ToGregorian extends Component{
    constructor(props){
        super(props);
        this.state = {value:'1400/2/2'}
    }
    render(){
        let {value} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">Inter Jalali Date</div>
                <input type='text' value={value} onChange={(e)=>this.setState({value:e.target.value})}/>
                <pre>
                    {`
let result = AIODate().toGregorian({date:'${value}'});
//result is ${AIODate().toGregorian({date:value})} 

let result = AIODate().toGregorian({date:'${value}',pattern:'{year}/{month}/{day}'});
//result is ${AIODate().toGregorian({date:value,pattern:'{year}/{month}/{day}'})} 
                    `}
                </pre>
            </div>
        )
    }
}


class IsMatch extends Component{
    constructor(props){
        super(props);
        this.state = {date:'',matcher:'6',operator:'w',calendarType:'gregorian'}
    }
    render(){
        let {date,matcher,operator,calendarType} = this.state;
        let res = AIODate().isMatch({date,matchers:[`${operator},${matcher}`]});
        return (
            <div className='example'>
                <div className="aio-component-label">calendarType</div>
                <AIOButton
                    type='radio'
                    options={[
                        {text:'gregorian',value:'gregorian'},
                        {text:'jalali',value:'jalali'}
                    ]}
                    value={calendarType}
                    onChange={(calendarType)=>this.setState({calendarType,date:''})}
                />
                <div className="aio-component-label">Inter Date</div>
                <AIODatepicker
                    key={calendarType}
                    value={date}
                    calendarType={calendarType}
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
                
                <pre>
                    {`
let result = AIODate().isMatch({
    date:'${date}',
    matchers:['${operator},${matcher}']
});
                    `}
                </pre>
                <div className="aio-component-label" style={{background:'dodgerblue',color:'#fff',marginTop:12}}>{`result is : ${res}`}</div>
                
            </div>
        )
    }
}


class GetToday extends Component{
    render(){        
        return (
            <div className='example'>
                <div className="aio-component-label">calendarType (required)</div>
                <ul>
                    <li>string ('gregorian' or 'jalali')</li>
                </ul>
                <div className="aio-component-label">pattern (optional)</div>
                <ul>
                    <li>{`string ('{year} {month} {day} {hour} {minute} {second} {tenthsecond} {monthString} {weekDay}' )`}</li>
                </ul>
                <pre>
                    {`
let res = AIODate().getToday({calendarType:'gregorian'});
//res is ${AIODate().getToday({calendarType:'gregorian'})}

let res = AIODate().getToday({calendarType:'gregorian',pattern:'{year}/{month}/{day} {hour}:{minute}'});
//res is ${AIODate().getToday({calendarType:'gregorian',pattern:'{year}/{month}/{day} {hour}:{minute}'})}

let res = AIODate().getToday({calendarType:'jalali'});
//res is ${AIODate().getToday({calendarType:'jalali'})}

let res = AIODate().getToday({calendarType:'jalali',pattern:'{year}/{month}/{day} {hour}:{minute}'});
//res is ${AIODate().getToday({calendarType:'jalali',pattern:'{year}/{month}/{day} {hour}:{minute}'})}
                    `}
                </pre>
            </div>
        )
    }
}

class GetWeekDay extends Component{
    
    render(){
        return (
            <div className='example'>
                <div className="aio-component-label">date (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <pre>
                    {`
let {weekDay,index} = AIODate().getWeekDay({date:'1401/5/7'});
//weekday is ${AIODate().getWeekDay({date:'1401/5/7'}).weekDay}
//index is ${AIODate().getWeekDay({date:'1401/5/7'}).index}

let {weekDay,index} = AIODate().getWeekDay({date:'2023/6/6'});
//weekday is ${AIODate().getWeekDay({date:'2023/6/6'}).weekDay}
//index is ${AIODate().getWeekDay({date:'2023/6/6'}).index}
                    `}
                </pre>
            </div>
        )
    }
}

class GetDateByPattern extends Component{
    render(){
        return (
            <div className='example'>
                <div className="aio-component-label">date (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <div className="aio-component-label">pattern (optional)</div>
                <ul>
                    <li>{`string ('{year} {month} {day} {hour} {minute} {second} {tenthsecond} {monthString} {weekDay}' )`}</li>
                </ul>
                <pre>
                    {`
let res = AIODate().getDateByPattern({
    {date:'2023/4/5',pattern:'{year}/{month}/{day} {weekDay}'}
});
//res is '${AIODate().getDateByPattern({date:'2023/4/5',pattern:'{year}/{month}/{day} {weekDay}'})}'

let res = AIODate().getDateByPattern({
    date:'2023/4/5',pattern:'{day} {monthString} {year} {weekDay}'
});
//res is '${AIODate().getDateByPattern({date:'2023/4/5',pattern:'{day} {monthString} {year} {weekDay}'})}'

let res = AIODate().getDateByPattern({
    date:'2023/4/5/10/30',pattern:'{year}/{month}/{day} {hour}:{minute}'
});
//res is '${AIODate().getDateByPattern({date:'2023/4/5/10/30',pattern:'{year}/{month}/{day} {hour}:{minute}'})}'

let res = AIODate().getDateByPattern({
    date:[2023,4,5,10,30],pattern:'{year}/{month}/{day} {hour}:{minute}'
});
//res is '${AIODate().getDateByPattern({date:[2023,4,5,10,30],pattern:'{year}/{month}/{day} {hour}:{minute}'})}'

                    `}
                </pre>
            </div>
        )
    }
}


class GetDelta extends Component{
    render(){
        let offset1 = AIODate().getDelta({date:'2023/4/5'});
        let offset2 = AIODate().getDelta({date:'2023/4/5',pattern:'{day} : {hour} : {minute} : {second}'});
        let offset3 = AIODate().getDelta({date:new Date().getTime() + 23000});
        let offset4 = AIODate().getDelta({date:new Date().getTime() - 23000});
        let offset5 = AIODate().getDelta({date:'1401/12/12'});
        return (
            <div className='example'>
                <ul>
                <li>
                {`AIODate().getDelta({ date , otherDate , pattern });`}
                </li>
                <li>
                    this function get 2 dates (date and otherDate) and calculate times between those.
                </li>
                <li>
                    otherDate default value is now.
                </li>
                <li>
                    also can get pattern to generate dynamic string date.
                </li>    
                </ul>
                
                <div className="aio-component-label">date (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <div className="aio-component-label">otherDate (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <div className="aio-component-label">pattern (optional)</div>
                <ul>
                    <li>{`string ('{year} {month} {day} {hour} {minute} {second} {tenthsecond} {monthString} {weekDay}' )`}</li>
                </ul>
                <pre>
                    {`
let res = AIODate().getDelta({date:'2023/4/5'});
//res is ${JSON.stringify(offset1,null,3)}

let res = AIODate().getDelta({
    date:'2023/4/5',
    pattern:'{day}: {hour} : {minute} : {second}'
});
//res is ${JSON.stringify(offset2,null,3)}

let res = AIODate().getDelta({date:new Date().getTime() + 23000});
//res is ${JSON.stringify(offset3,null,3)}

let res = AIODate().getDelta({date:new Date().getTime() - 23000});
//res is ${JSON.stringify(offset4,null,3)}

let res = AIODate().getDelta({date:'1401/12/12'});
//res is ${JSON.stringify(offset5,null,3)}
                    `}
                </pre>
            </div>
        )
    }
}


class GetNextTime extends Component{
    constructor(props){
        super(props);
        this.state = {model:{date:'1401/12/14/22/30',offset:100 * 60 * 60 * 1000,jalali:false,pattern:''}}
    }
    render(){
        let {model} = this.state;
        let {date,jalali,offset,pattern} = model;
        let result;
        try{
            result = AIODate().getNextTime({date,offset:+offset,pattern,jalali});
        }
        catch{
            result = false
        }
        return (
            <div className='example'>
                <ul>
                    <li>
                    {`AIODate().getNextTime({ date , offset , pattern , jalali });`}
                    </li>
                    <li>
                    this function get a date and miliseconds and returns calculated date (array or string pattern).
                    </li>
                    <li>
                    also can get pattern to generate dynamic string date.
                    </li>
                    <li>
                    also can get jalali (boolean) to generate jalali result date.        
                    </li>
                </ul>
                
                
                <div className="aio-component-label">date (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <div className="aio-component-label">offset (required)</div>
                <ul>
                    <li>number (miliseconds)</li>
                </ul>
                <div className="aio-component-label">pattern (optional)</div>
                <ul>
                    <li>{`string ('{year} {month} {day} {hour} {minute} {second} {tenthsecond} {monthString} {weekDay}' )`}</li>
                </ul>
                <div className="aio-component-label">jalali (optional)</div>
                <ul>
                    <li>boolean</li>
                </ul>
                <Form
                    onChange={(model)=>this.setState({model})}
                    model={model}
                    theme={{inlineLabel:true,labelStyle:{width:90}}}
                    inputs={[
                        {type:'text',label:'date',field:'model.date'},
                        {type:'number',label:'offset (12 digit)',field:'model.offset'},
                        {type:'text',label:'pattern',field:'model.pattern'},
                        {type:'checkbox',label:'jalali',field:'model.jalali'},
                    ]}
                />
                <pre>
                    {result === false?'error':`
let result = AIODate().getNextTime({
    date:'${date}',
    offset:${offset},
    pattern:'${pattern}',
    jalali:${JSON.stringify(jalali)}
});
//result is ${JSON.stringify(result)}
                    `}
                </pre>
            </div>
        )
    }
}

class Compaire extends Component{
    render(){
        return (
            <div className='example'>
                <ul>
                    <li>
                    {`AIODate().compaire({date,otherDate});`}
                    </li>
                    <li>
                    this function get an object contain date and otherDate. then returns 'less' or 'greater' or 'equal'.
                    </li>
                </ul>
                <div className="aio-component-label">date (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <div className="aio-component-label">otherDate (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <pre>
                    {`
let result = AIODate().compaire({date:'2022/4/4',otherDate:'2022/7/10'});       
//result is '${AIODate().compaire({date:'2022/4/4',otherDate:'2022/7/10'})}'

let result = AIODate().compaire({date:'2022/4/4',otherDate:'2022/2/10'})       
//result is '${AIODate().compaire({date:'2022/4/4',otherDate:'2022/2/10'})}'
                    
let result = AIODate().compaire({date:'2022/4/4',otherDate:'2022/4/4'})       
//result is '${AIODate().compaire({date:'2022/4/4',otherDate:'2022/4/4'})}'

let result = AIODate().compaire({date:'2022/4/4',otherDate:1700000000000})       
//result is '${AIODate().compaire({date:'2022/4/4',otherDate:1700000000000})}'

let result = AIODate().compaire({date:'2022/4/4',otherDate:[2022,2,10]})       
//result is '${AIODate().compaire({date:'2022/4/4',otherDate:[2022,2,10]})}'
                    `}
                </pre>
            </div>
        )
    }
}

class GetTime extends Component{
    render(){
        return (
            <div className='example'>
                <ul>
                    <li>
                    {`AIODate().getTime({date});`}
                    </li>
                    <li>
                    this function get an object contain date and returns miliseconds date.
                    </li>
                </ul>
                
                
                <div className="aio-component-label">date (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <pre>
                    {`
let result = AIODate().getTime({date:'2022/4/5'});
//result is ${AIODate().getTime({date:'2022/4/5'})}

let result = AIODate().getTime({date:'2022/4/5/10/30'});
//result is ${AIODate().getTime({date:'2022/4/5/10/30'})}

let result = AIODate().getTime({date:[2022,4,5,10,30]});
//result is ${AIODate().getTime({date:[2022,4,5,10,30]})}

let result = AIODate().getTime({date:'2015-03-25T12:00:00Z'});
//result is ${AIODate().getTime({date:'2015-03-25T12:00:00Z'})}

let result = AIODate().getTime({date:1755555656665});
//result is ${AIODate().getTime({date:1755555656665})}

let result = AIODate().getTime({date:'1402/3/3'});
//result is ${AIODate().getTime({date:'1402/3/3'})}
                    `}
                </pre>
            </div>
        )
    }
}

class GetMonthDaysLength extends Component{
    render(){
        return (
            <div className='example'>
                <ul>
                    <li>
                    {`AIODate().getMonthDaysLength({date});`}
                    </li>
                    <li>
                    this function get an object contain date and returns miliseconds date.
                    </li>
                </ul>
                
                
                <div className="aio-component-label">date (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <pre>
                    {`
let result = AIODate().getMonthDaysLength({date:'2022/4'});
//result is ${AIODate().getMonthDaysLength({date:'2022/4'})}

let result = AIODate().getMonthDaysLength({date:'2022/7/5'});
//result is ${AIODate().getMonthDaysLength({date:'2022/7/5'})}

let result = AIODate().getMonthDaysLength({date:'1400/12'});
//result is ${AIODate().getMonthDaysLength({date:'1400/12'})}

let result = AIODate().getMonthDaysLength({date:'1399/12'});
//result is ${AIODate().getMonthDaysLength({date:'1399/12'})}
                    `}
                </pre>
            </div>
        )
    }
}

class GetMonths extends Component{
    render(){
        return (
            <div className='example'>
                <ul>
                    <li>
                    {`AIODate().getMonths({calendarType:'gregorian'});`}
                    </li>
                    <li>
                    this function get an object contain calendarType and returns month names.
                    </li>
                </ul>
                
                
                <div className="aio-component-label">calendarType (required)</div>
                <ul>
                    <li>string ('gregorian' or 'jalali')</li>
                </ul>
                <pre>
                    {`
let result = AIODate().getMonths({calendarType:'gregorian'});
//result is ${JSON.stringify(AIODate().getMonths({calendarType:'gregorian'}))}

let result = AIODate().getMonths({calendarType:'jalali'});
//result is ${JSON.stringify(AIODate().getMonths({calendarType:'jalali'}))}

                    `}
                </pre>
            </div>
        )
    }
}

class GetWeekDays extends Component{
    render(){
        return (
            <div className='example'>
                <ul>
                    <li>
                    {`AIODate().getMonths({calendarType:'gregorian'});`}
                    </li>
                    <li>
                    this function get an object contain calendarType and returns week days names.
                    </li>
                </ul>
                
                
                <div className="aio-component-label">calendarType (required)</div>
                <ul>
                    <li>string ('gregorian' or 'jalali')</li>
                </ul>
                <pre>
                    {`
let result = AIODate().getWeekDays({calendarType:'gregorian'});
//result is ${JSON.stringify(AIODate().getWeekDays({calendarType:'gregorian'}))}

let result = AIODate().getWeekDays({calendarType:'jalali'});
//result is ${JSON.stringify(AIODate().getWeekDays({calendarType:'jalali'}))}

                    `}
                </pre>
            </div>
        )
    }
}

class ConvertToArray extends Component{
    render(){
        return (
            <div className='example'>
                <ul>
                    <li>
                    {`AIODate().convertToArray({date});`}
                    </li>
                    <li>
                    this function get an object contain date and returns date array.
                    </li>
                </ul>
                
                
                <div className="aio-component-label">date (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <pre>
                    {`
let result = AIODate().convertToArray({date:'2022/4/4'});
//result is ${JSON.stringify(AIODate().convertToArray({date:'2022/4/4'}))}

let result = AIODate().convertToArray({date:1432445566787});
//result is ${JSON.stringify(AIODate().convertToArray({date:1432445566787}))}

                    `}
                </pre>
            </div>
        )
    }
}

class GetDatesBetween extends Component{
    render(){
        return (
            <div className='example'>
                <ul>
                    <li>
                    {`AIODate().getDatesBetween({date,otherDate,step});`}
                    </li>
                    <li>
                    this function get an object contain date and otherDate and offset. then returns date strings between date and otherDate by step.
                    </li>
                </ul>
                <div className="aio-component-label">date (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <div className="aio-component-label">otherDate (required)</div>
                <ul>
                    <li>number (miliseconds date)</li>
                    <li>string ('2022/3/4/12/30/30/3') (from year to tenthsecond)</li>
                    <li>string ('2015-03-25T12:00:00Z') (iso date)</li>
                    <li>Array ([2022,3,4,12,30,30,3]) (from year to tenthsecond)</li>
                    <li>gregorian or jalali</li>
                </ul>
                <div className="aio-component-label">step (required. default is 24 hours)</div>
                <ul>
                    <li>number (miliseconds)</li>
                </ul>
                <div className="aio-component-label">pattern (optional)</div>
                <ul>
                    <li>{`string ('{year} {month} {day} {hour} {minute} {second} {tenthsecond} {monthString} {weekDay}' )`}</li>
                </ul>
                <pre>
                    {`
let result = AIODate().getdatesBetween({
    date:'2022/4/4',
    otherDate:'2022/7/10',
    step:48 * 60 * 60 * 1000,
    pattern:'{day} {monthString} {year}'
});       
//result is ${JSON.stringify(AIODate().getDatesBetween({date:'2022/4/4',otherDate:'2022/7/10',step:48 * 60 * 60 * 1000,pattern:'{day} {monthString} {year}'}),null,4)}
                    `}
                </pre>
            </div>
        )
    }
}