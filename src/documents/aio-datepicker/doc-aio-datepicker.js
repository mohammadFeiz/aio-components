import React,{Component} from 'react';
import DatePicker from './../../npm/aio-datepicker/aio-datepicker';
import AIOButton from './../../npm/aio-button/aio-button';
import Slider from './../../npm/aio-slider/aio-slider';
import DOC from '../../resuse-components/doc';
export default class DOC_AIOForm extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='justCalendar'
                navs={[
                    {text:'calendarType',id:'calendarType',COMPONENT:()=><CalendarType/>},
                    {text:'unit',id:'unit',COMPONENT:()=><Unit/>},
                    {text:'theme',id:'theme',COMPONENT:()=><Theme/>},
                    {text:'size',id:'size',COMPONENT:()=><Size/>},
                    {text:'justCalendar',id:'justCalendar',COMPONENT:()=><JustCalendar/>},
                ]}
            />
        )
    }
}

class CalendarType extends Component{
    constructor(props){
        super(props);
        this.state = {date_j:'',date_g:''}
    }
    render(){
        let {date_j,date_g} = this.state;
        return (
            <div className='example'>
                
                <div className="aio-component-label">calendarType='gregorian'</div>
                
                <DatePicker
                    calendarType='gregorian'
                    value={date_g}
                    onChange={({dateString})=>this.setState({date_g:dateString})}
                />
                <pre>
                {`
class App extends Component{
    constructor(props){
        super(props);
        this.state = {date:''}
    }
    render(){
        let {date} = this.state;
        return (
            <DatePicker
                calendarType='gregorian'
                value={date}
                onChange={({dateString})=>this.setState({date:dateString})}
            />
        )
    }
}
                `}
                </pre>

                <div className='aio-component-splitter'></div>

                <div className="aio-component-label">calendarType='jalali'</div>

                <DatePicker
                    calendarType='jalali'
                    value={date_j}
                    onChange={({dateString})=>this.setState({date_j:dateString})}
                />
                <pre>
                {`
class App extends Component{
    constructor(props){
        super(props);
        this.state = {date:''}
    }
    render(){
        let {date} = this.state;
        return (
            <DatePicker
                calendarType='jalali'
                value={date}
                onChange={({dateString})=>this.setState({date:dateString})}
            />
        )
    }
}
                `}
                </pre>
            </div>
        )
    }
}


class Unit extends Component{
    constructor(props){
        super(props);
        this.state = {
            date_jalali_month:'',
            date_jalali_day:'',
            date_jalali_hour:'',
            date_gregorian_month:'',
            date_gregorian_day:'',
            date_gregorian_hour:'',
            calendarType:'gregorian'
        }
    }
    render(){
        let {calendarType} = this.state;
        return (
            <div className='example'>

                <AIOButton
                    type='radio'
                    value={calendarType}
                    options={[{text:'gregorian',value:'gregorian'},{text:'jalali',value:'jalali'}]}
                    onChange={(calendarType)=>{
                        this.setState({
                            calendarType,
                            date_jalali_month:'',
                            date_jalali_day:'',
                            date_jalali_hour:'',
                            date_gregorian_month:'',
                            date_gregorian_day:'',
                            date_gregorian_hour:''
                        })
                    }}
                />

                <div className="aio-component-label">unit='month'</div>
                
                <DatePicker
                    calendarType={calendarType}
                    value={this.state[`date_${calendarType}_month`]}
                    unit='month'
                    onChange={({dateString})=>this.setState({[`date_${calendarType}_month`]:dateString})}
                />
                <pre>
                {`
class App extends Component{
    constructor(props){
        super(props);
        this.state = {date:'${this.state[`date_${calendarType}_month`]}'}
    }
    render(){
        let {date} = this.state;
        return (
            <DatePicker
                calendarType='${calendarType}'
                value={date}
                unit='month'
                onChange={({dateString})=>this.setState({date:dateString})}
            />
        )
    }
}
                `}
                </pre>

                <div className='aio-component-splitter'></div>

                <div className="aio-component-label">unit='day'</div>
                
                <DatePicker
                    calendarType={calendarType}
                    value={this.state[`date_${calendarType}_day`]}
                    unit='day'
                    onChange={({dateString})=>this.setState({[`date_${calendarType}_day`]:dateString})}
                />
                <pre>
                {`
class App extends Component{
    constructor(props){
        super(props);
        this.state = {date:'${this.state[`date_${calendarType}_day`]}'}
    }
    render(){
        let {date} = this.state;
        return (
            <DatePicker
                calendarType='${calendarType}'
                value={date}
                unit='day'
                onChange={({dateString})=>this.setState({date:dateString})}
            />
        )
    }
}
                `}
                </pre>

                <div className='aio-component-splitter'></div>

                <div className="aio-component-label">unit='hour'</div>
                
                <DatePicker
                    calendarType={calendarType}
                    value={this.state[`date_${calendarType}_hour`]}
                    unit='hour'
                    onChange={({dateString})=>this.setState({[`date_${calendarType}_hour`]:dateString})}
                />
                <pre>
                {`
class App extends Component{
    constructor(props){
        super(props);
        this.state = {date:'${this.state[`date_${calendarType}_hour`]}'}
    }
    render(){
        let {date} = this.state;
        return (
            <DatePicker
                calendarType='${calendarType}'
                value={date}
                unit='hour'
                onChange={({dateString})=>this.setState({date:dateString})}
            />
        )
    }
}
                `}
                </pre>

                <div className='aio-component-splitter'></div>






            </div>
        )
    }
}


class Theme extends Component{
    constructor(props){
        super(props);
        this.state = {
            date:'',
            color1:'#add8e6',
            color2:'#777'
        }
    }
    render(){
        let {date,color1,color2} = this.state;
        return (
            <div className='example'>

                <input type='color' value={color1} onChange={(e)=>this.setState({color1:e.target.value})}/>
                <input type='color' value={color2} onChange={(e)=>this.setState({color2:e.target.value})}/>
                <div className="aio-component-label">{`theme=['${color1}','${color2}']`}</div>
                
                <DatePicker
                    value={date}
                    justCalendar={true}
                    theme={[color1,color2]}
                    onChange={({dateString})=>this.setState({date:dateString})}
                />
                <pre>
                {`
class App extends Component{
    constructor(props){
        super(props);
        this.state = {date:'${date}'}
    }
    render(){
        let {date} = this.state;
        return (
            <DatePicker
                value={date}
                theme={['${color1}','${color2}']}
                onChange={({dateString})=>this.setState({date:dateString})}
            />
        )
    }
}
                `}
                </pre>
            </div>
        )
    }
}


class Size extends Component{
    constructor(props){
        super(props);
        this.state = {
            date:'',
            size:220
        }
    }
    render(){
        let {date,size} = this.state;
        return (
            <div className='example'>
                {'Change Size'}
                <Slider points={[size]} start={100} end={400} onChange={(points)=>this.setState({size:points[0]})} showValue={true}
                    fillStyle={{height:8,background:'dodgerblue'}}
                    lineStyle={{height:12}}
                />
                <div className="aio-component-label">{`size={${size}}`}</div>
                
                <DatePicker
                    value={date}
                    justCalendar={true}
                    size={size}
                    onChange={({dateString})=>this.setState({date:dateString})}
                />
                <pre>
                {`
class App extends Component{
    constructor(props){
        super(props);
        this.state = {date:'${date}'}
    }
    render(){
        let {date} = this.state;
        return (
            <DatePicker
                value={date}
                size={${size}}
                onChange={({dateString})=>this.setState({date:dateString})}
            />
        )
    }
}
                `}
                </pre>
            </div>
        )
    }
}


class JustCalendar extends Component{
    constructor(props){
        super(props);
        this.state = {
            date:'',
            justCalendar:true
        }
    }
    render(){
        let {date,justCalendar} = this.state;
        return (
            <div className='example'>
                <button onClick={()=>this.setState({justCalendar:!justCalendar})}>{`justCalnder:${justCalendar}`}</button>
                <div className="aio-component-label">{`justCalendar={${justCalendar}}`}</div>
                
                <DatePicker
                    value={date}
                    justCalendar={justCalendar}
                    onChange={({dateString})=>this.setState({date:dateString})}
                />
                <pre>
                {`
class App extends Component{
    constructor(props){
        super(props);
        this.state = {date:'${date}'}
    }
    render(){
        let {date} = this.state;
        return (
            <DatePicker
                value={${date}}
                justCalendar={${justCalendar}}
                onChange={({dateString})=>this.setState({date:dateString})}
            />
        )
    }
}
                `}
                </pre>
            </div>
        )
    }
}