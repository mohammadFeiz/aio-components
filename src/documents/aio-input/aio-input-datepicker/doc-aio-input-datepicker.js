import React,{Component} from 'react';
import AIOInput from './../../../npm/aio-input/aio-input';
import Slider from './../../../npm/aio-slider/aio-slider';
import DOC from '../../../resuse-components/doc';
export default class DOC_AIOForm extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='calendarType'
                navs={[
                    {text:'calendarType',id:'calendarType',COMPONENT:()=><CalendarType/>},
                    {text:'unit',id:'unit',COMPONENT:()=><Unit/>},
                    {text:'theme',id:'theme',COMPONENT:()=><Theme/>},
                    {text:'size',id:'size',COMPONENT:()=><Size/>},
                    {text:'startYear,endYear',id:'startYear-endYear',COMPONENT:()=><StartYearEndYear/>},
                    {text:'disabled',id:'disabled',COMPONENT:()=><Disabled/>},
                    {text:'dateAttrs',id:'dateAttrs',COMPONENT:()=><DateAttrs/>},
                    {text:'onClear',id:'onClear',COMPONENT:()=><OnClear/>},
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
                <AIOInput
                    type='datepicker'
                    calendarType='gregorian'
                    value={date_g}
                    onChange={(dateString)=>this.setState({date_g:dateString})}
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
            <AIOInput
                type='datepicker'
                calendarType='gregorian'
                value={date_g}
                onChange={(dateString)=>this.setState({date_g:dateString})}
            />
        )
    }
}
                `}
                </pre>

                <div className='aio-component-splitter'></div>

                <div className="aio-component-label">calendarType='jalali'</div>

                <AIOInput
                    type='datepicker'
                    calendarType='jalali'
                    value={date_j}
                    onChange={(dateString)=>this.setState({date_j:dateString})}
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
            <AIOInput
                type='datepicker'
                calendarType='jalali'
                value={date_j}
                onChange={(dateString)=>this.setState({date_j:dateString})}
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

                <AIOInput
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
                
                <AIOInput
                    type='datepicker'
                    calendarType={calendarType}
                    value={this.state[`date_${calendarType}_month`]}
                    unit='month'
                    onChange={(dateString)=>this.setState({[`date_${calendarType}_month`]:dateString})}
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
            <AIOInput
                type='datepicker'
                calendarType='${calendarType}'
                value={date}
                unit='month'
                onChange={(dateString)=>this.setState({date:dateString})}
            />
        )
    }
}
                `}
                </pre>

                <div className='aio-component-splitter'></div>

                <div className="aio-component-label">unit='day'</div>
                
                <AIOInput
                    type='datepicker'
                    calendarType={calendarType}
                    value={this.state[`date_${calendarType}_day`]}
                    unit='day'
                    onChange={(dateString)=>this.setState({[`date_${calendarType}_day`]:dateString})}
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
            <AIOInput
                type='datepicker'
                calendarType='${calendarType}'
                value={date}
                unit='day'
                onChange={(dateString)=>this.setState({date:dateString})}
            />
        )
    }
}
                `}
                </pre>

                <div className='aio-component-splitter'></div>

                <div className="aio-component-label">unit='hour'</div>
                
                <AIOInput
                    type='datepicker'
                    calendarType={calendarType}
                    value={this.state[`date_${calendarType}_hour`]}
                    unit='hour'
                    onChange={(dateString)=>this.setState({[`date_${calendarType}_hour`]:dateString})}
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
            <AIOInput
                type='datepicker'
                calendarType={calendarType}
                value={date}
                unit='hour'
                onChange={(dateString)=>this.setState({date:dateString})}
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
                
                <AIOInput
                    type='datepicker'
                    value={date}
                    justCalendar={true}
                    theme={[color1,color2]}
                    onChange={(dateString)=>this.setState({date:dateString})}
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
            <AIOInput
                type='datepicker'
                value={date}
                theme={['${color1}','${color2}']}
                onChange={(dateString)=>this.setState({date:dateString})}
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
                
                <AIOInput
                    type='datepicker'
                    value={date}
                    justCalendar={true}
                    size={size}
                    onChange={(dateString)=>this.setState({date:dateString})}
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
            <AIOInput
                type='datepicker'
                value={date}
                size={${size}}
                onChange={(dateString)=>this.setState({date:dateString})}
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




class StartYearEndYear extends Component{
    constructor(props){
        super(props);
        this.state = {
            date1:'',date2:''
        }
    }
    render(){
        let {date1,date2} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">{'exact years'}</div>
                
                <AIOInput
                    type='datepicker'
                    value={date1}
                    startYear='2012'
                    endYear='2030'
                    onChange={(dateString)=>this.setState({date1:dateString})}
                />
                <pre>
                {`
class App extends Component{
    constructor(props){
        super(props);
        this.state = {date:'${date1}'}
    }
    render(){
        let {date} = this.state;
        return (
            <AIOInput
                type='datepicker'
                value={${date1}}
                startYear='2012'
                endYear='2030'
                onChange={(dateString)=>this.setState({date:dateString})}
            />
        )
    }
}
                `}
                </pre>
                <div className='aio-component-splitter'></div>


                <div className="aio-component-label">{'offset years from this year'}</div>
                
                <AIOInput
                    type='datepicker'
                    value={date2}
                    startYear='-10'
                    endYear='+5'
                    onChange={(dateString)=>this.setState({date2:dateString})}
                />
                <pre>
                {`
class App extends Component{
    constructor(props){
        super(props);
        this.state = {date:'${date2}'}
    }
    render(){
        let {date} = this.state;
        return (
            <AIOInput
                type='datepicker'
                value={${date2}}
                startYear='-10'
                endYear='+5'
                onChange={(dateString)=>this.setState({date:dateString})}
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

class Disabled extends Component{
    constructor(props){
        super(props);
        this.state = {
            date:''
        }
    }
    render(){
        let {date} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">{`between ( <> )`}</div>
                
                <AIOInput
                    type='datepicker'
                    value={date}
                    justCalendar={true}
                    disabled={['<>,2022,2024']}
                    onChange={(dateString)=>this.setState({date:dateString})}
                />
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['<>,2022,2024']}
    ...
/>

                `}
                </pre>
                <div className='aio-component-splitter'></div>

                <div className="aio-component-label">{`between equal ( <=> )`}</div>
                
                <AIOInput
                    type='datepicker'
                    value={date}
                    justCalendar={true}
                    disabled={['<=>,2022,2024']}
                    onChange={(dateString)=>this.setState({date:dateString})}
                />
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['<=>,2022,2024']}
    ...
/>

                `}
                </pre>
                <div className='aio-component-splitter'></div>

                <div className="aio-component-label">{`not between ( !<> )`}</div>
                
                <AIOInput
                    type='datepicker'
                    value={date}
                    justCalendar={true}
                    disabled={['!<>,2022,2024']}
                    onChange={(dateString)=>this.setState({date:dateString})}
                />
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['!<>,2022,2024']}
    ...
/>

                `}
                </pre>
                <div className='aio-component-splitter'></div>

                <div className="aio-component-label">{`not between equal ( !<=> )`}</div>
                
                <AIOInput
                    type='datepicker'
                    value={date}
                    justCalendar={true}
                    disabled={['!<=>,2022,2024']}
                    onChange={(dateString)=>this.setState({date:dateString})}
                />
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['!<=>,2022,2024']}
    ...
/>

                `}
                </pre>
                <div className='aio-component-splitter'></div>

                <div className="aio-component-label">{`equal ( = )`}</div>
                
                <AIOInput
                    type='datepicker'
                    value={date}
                    justCalendar={true}
                    disabled={['=,2022/4/5,2022/6/7,2022/8/12']}
                    onChange={(dateString)=>this.setState({date:dateString})}
                />
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['=,2022/4/5,2022/6/7,2022/8/12']}
    ...
/>

                `}
                </pre>

                <div className='aio-component-splitter'></div>

                <div className="aio-component-label">{`not equal ( != )`}</div>
                <AIOInput
                    value={'2022/4/1'}
                    justCalendar={true}
                    disabled={['!=,2022/4/5']}
                />
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['!=,2022/4/5']}
    ...
/>
                `}
                </pre>


                <div className="aio-component-label">{`greater ( > )`}</div>
                
                <AIOInput
                    value={'2022/4/1'}
                    justCalendar={true}
                    disabled={['>,2022/4/5']}
                />
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['>,2022/4/5']}
    ...
/>

                `}
                </pre>
                
                <div className='aio-component-splitter'></div>
                <div className="aio-component-label">{`greater equal ( >= )`}</div>
                <AIOInput value={'2022/4/1'} justCalendar={true} disabled={['>=,2022/4/5']}/>
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['>=,2022/4/5']}
    ...
/>
                `}
                </pre>

                <div className="aio-component-label">{`less ( < )`}</div>
                
                <AIOInput
                    value={'2022/4/1'}
                    justCalendar={true}
                    disabled={['<,2022/4/5']}
                />
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['<,2022/4/5']}
    ...
/>

                `}
                </pre>
                
                <div className='aio-component-splitter'></div>
                <div className="aio-component-label">{`less equal ( <= )`}</div>
                <AIOInput value={'2022/4/1'} justCalendar={true} disabled={['<=,2022/4/5']}/>
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['<=,2022/4/5']}
    ...
/>
                `}
                </pre>


                <div className="aio-component-label">{`weekday is ( w )`}</div>
                <AIOInput value={'2022/4/1'} justCalendar={true} disabled={['w,6,4']}/>
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['w,6,4']}
    ...
/>
                `}
                </pre>


                <div className="aio-component-label">{`weekday is not ( !w )`}</div>
                <AIOInput value={'2022/4/1'} justCalendar={true} disabled={['!w,6']}/>
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    disabled={['!w,6']}
    ...
/>
                `}
                </pre>

            </div>
        )
    }
}

class DateAttrs extends Component{
    render(){
        return (
            <div className='example'>
                <div className="aio-component-label">example 1</div>
                <AIOInput
                    type='datepicker'
                    value={'2022/4/14'}
                    justCalendar={true}
                    dateAttrs={({isMatch,isActive,isToday})=>{
                        if(isActive){
                            return {
                                style:{
                                    background:'dodgerblue',
                                    color:'#fff' 
                                }
                            }
                        }
                        if(isToday){
                            return {
                                style:{
                                    color:'red',fontSize:14,fontWeight:'bold',border:'1px solid',borderRadius:'100%'
                                }
                            }
                        }
                        let matchers = [
                            '<>,2022/4/5,2022/4/18'
                        ];
                        if(isMatch(matchers)){
                            return {
                                style:{
                                    background:'orange'
                                }
                            }
                        }
                    }}
                />
                <pre>
                {`
<AIOInput
    ...
    type='datepicker'
    dateAttrs={({isMatch,isActive,isToday})=>{
        if(isActive){
            return {
                style:{
                    background:'dodgerblue',
                    color:'#fff' 
                }
            }
        }
        if(isToday){
            return {
                style:{
                    color:'red',fontSize:14,fontWeight:'bold',border:'1px solid',borderRadius:'100%'
                }
            }
        }
        let matchers = [
            '<>,2022/4/5,2022/4/18'
        ];
        if(isMatch(matchers)){
            return {
                style:{
                    background:'orange'
                }
            }
        }
    }}
    ...
/>

                `}
                </pre>
                <div className='aio-component-splitter'></div>
            </div>
        )
    }
}

class OnClear extends Component{
    constructor(props){
        super(props);
        this.state = {
            date:'2022/5/5'
        }
    }
    render(){
        let {date} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">example 1</div>
                <AIOInput
                    type='datepicker'
                    value={date}
                    onClear={()=>this.setState({date:''})}
                    onChange={(dateString)=>this.setState({date:dateString})}
                />
                <pre>
                {`
class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            date:''
        }
    }
    render(){
        let {date} = this.state;
        return (
            <AIOInput
                type='datepicker'
                value={date}
                onClear={()=>this.setState({date:''})}
                onChange={(dateString)=>this.setState({date:dateString})}
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