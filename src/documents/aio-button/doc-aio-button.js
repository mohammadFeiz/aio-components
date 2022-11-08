import React,{Component} from "react";
import DOC from './../../resuse-components/doc';
import AIOButton from './../../npm/aio-button/aio-button';
import {Icon} from '@mdi/react';
import {mdiAccount,mdiAccountBox,mdiCheckboxBlankOutline } from '@mdi/js';
export default class DOC_AIOButton extends Component{
    render(){
        let {goToHome} = this.props;
        return (
            <DOC
                goToHome={goToHome}
                title='aio-button'
                navId='optionStyle'
                propsList={[
                    {
                        props:'type',type:'"button" | "select" | "multiselect" | "radio" | "checkbox" | "checklist" | "tabs"',
                        description:'button type'
                    },
                    {props:'text',type:'string',description:'use in types("button","select","multiselect","checkbox")'},
                    {props:'before',type:'html',description:'before html'},
                    {props:'after',type:'html',description:'after html'},
                    {props:'subtext',type:'string',description:'button subtext'},
                    {props:'options',type:'array',description:'selectable options'},
                    {props:'optionText',type:'string or function',description:'set option text'},
                    {props:'optionValue',type:'string or function',description:'set option value'},
                    {props:'optionSubtext',type:'string or function',description:'set option subtext'},
                    {props:'optionBefore',type:'string or function',description:'set option before'},
                    {props:'optionAfter',type:'string or function',description:'set option after'},
                    {props:'popOver',type:'function',description:'open popover under button(use in button type)'},
                ]}
                navs={[
                    {text:'Props',id:'props'},
                    {text:'text',id:'text',COMPONENT:()=><Text/>},
                    {text:'before',id:'before',COMPONENT:()=><Before/>},
                    {text:'after',id:'after',COMPONENT:()=><After/>},
                    {text:'subtext',id:'subtext',COMPONENT:()=><Subtext/>},
                    
                    {text:'options',id:'options',COMPONENT:()=><Options/>},
                    //{text:'option properties',id:'option properties',COMPONENT:()=><OptionProperties/>},
                    {
                        text:'option properties',id:'option properties',
                        navs:[
                            {text:'subtext',id:'option property(subtext)',COMPONENT:()=><OptionProperty_subtext/>},
                            {text:'before',id:'option property(before)',COMPONENT:()=><OptionProperty_before/>},
                            {text:'after',id:'option property(after)',COMPONENT:()=><OptionProperty_after/>},
                            {text:'style',id:'option property(style)',COMPONENT:()=><OptionProperty_style/>},
                            {text:'onClick',id:'option property(onClick)',COMPONENT:()=><OptionProperty_onClick/>},
                            {text:'tagBefore',id:'option property(tagBefore)',COMPONENT:()=><OptionProperty_tagBefore/>},
                            {text:'tagAttrs',id:'option property(tagAttrs)',COMPONENT:()=><OptionProperty_tagAttrs/>},
                            {text:'close',id:'option property(close)',COMPONENT:()=><OptionProperty_close/>},
                            {text:'checked',id:'option property(checked)',COMPONENT:()=><OptionProperty_checked/>},
                            {text:'checkIcon',id:'option property(checkIcon)',COMPONENT:()=><OptionProperty_checkIcon/>}
                        ]
                    },
                    {
                        text:'options mapping props',id:'options mapping props',
                        navs:[
                            {text:'optionText optionValue',id:'optionText-optionValue',COMPONENT:()=><OptionTextOptionValue/>},
                            {text:'optionSubtext',id:'optionSubtext',COMPONENT:()=><OptionSubtext/>},
                            {text:'optionBefore',id:'optionBefore',COMPONENT:()=><OptionBefore/>},
                            {text:'optionAfter',id:'optionAfter',COMPONENT:()=><OptionAfter/>},
                            {text:'optionStyle',id:'optionStyle',COMPONENT:()=><OptionStyle/>},
                            {text:'optionTagBefore',id:'optionTagBefore',COMPONENT:()=><OptionTagBefore/>},
                            {text:'optionTagAttrs',id:'optionTagAttrs',COMPONENT:()=><OptionTagAttrs/>},
                            {text:'optionClose',id:'optionClose',COMPONENT:()=><OptionClose/>},
                            {text:'optionChecked',id:'optionChecked',COMPONENT:()=><OptionChecked/>},
                            {text:'optionCheckIcon',id:'optionCheckIcon',COMPONENT:()=><OptionCheckIcon/>},
                        ]
                    },
                    {text:'popOver',id:'popOver',COMPONENT:()=><PopOver/>},
                    {text:'animate',id:'animate',COMPONENT:()=><Animate/>}
                    
                ]}

            />
        )
    }
}
class MSF extends Component{
    state = {value:'2',values:['1','2'],bool:false}
    getOptions(){
        let {prop} = this.props;
        let options = [
            {text:'option1',value:'1'},
            {text:'option2',value:'2'},
            {text:'option3',value:'3'},
        ]
        return options.map((o,i)=>{
            let res = {...o};
            if(prop === 'option.subtext'){
                res.subtext = 'my subtext ' + (i + 1) 
            }
            else if(prop === 'optionSubtext'){
                res.type = 'type ' + (i + 1) 
            }
            else if(prop === 'option.before'){
                res.before = <Icon path={mdiAccount} size={1}/> 
            }
            else if(prop === 'option.after'){
                res.after = <div style={{background:'#999',color:'#fff',padding:'0 3px',borderRadius:24,fontSize:10,minWidth:8,textAlign:'center'}}>{[3,6,24][i]}</div> 
            }
            else if(prop === 'option.style' && i === 0){
                res.style = {background:'pink'}
            }
            else if(prop === 'option.onClick' && i === 2){
                res.onClick = ()=>alert()
            }
            else if(prop === 'optionAfter'){
                res.number = [3,6,24][i] 
            }
            return res
        })
    }
    getOptionsStr(){
        let {type,prop} = this.props;
        let options = this.getOptions();
        let def = `options={[
                    ${JSON.stringify(options[0])},
                    ${JSON.stringify(options[1])},
                    ${JSON.stringify(options[2])}
                ]}`
        if(prop === 'option.subtext' || prop === 'option.style' || prop === 'options'){
            return (
                `${def}`
            )
        }
        if(prop === 'optionSubtext'){
            return (
                `${def}
                optionSubtext='option.type'`
            )
        }
        if(prop === 'optionBefore'){
            return (
                `${def}
                optionBefore={<Icon path={mdiAccount} size={1}/>}`
            )
        }
        if(prop === 'optionStyle'){
            return (
                `${def}
                optionStyle={{color:'red'}}`
            )
        }
        if(prop === 'optionAfter'){
            return (
                `${def}
                optionAfter={(option)=><div className='number-box'>{option.number}</div>}`
            )
        }
        if(prop === 'option.before'){
            return (
                `options={[
                    {text:'option1',value:'1',before:<Icon path={mdiAccount} size={1}/>},
                    {text:'option2',value:'2',before:<Icon path={mdiAccount} size={1}/>},
                    {text:'option3',value:'3',before:<Icon path={mdiAccount} size={1}/>},
                ]}`
            )
        }
        if(prop === 'option.after'){
            return (
                `options={[
                    {
                        text:'option1',
                        value:'1',
                        after:(<div className='number-box'>{3}</div>)
                    },
                    {
                        text:'option2',
                        value:'2',
                        after:(after:(<div className='number-box'>{6}</div>))
                    },
                    {
                        text:'option3',
                        value:'3',
                        after:(after:(<div className='number-box'>{24}</div>))
                    }
                ]}`
            )
        }
        if(prop === 'option.onClick'){
            return (
                `options={[
                    {text:'option1',value:'1',onClick:()=>alert()},
                    {text:'option2',value:'2'},
                    {text:'option3',value:'3'}
                ]}`
            )
        }
    }
    render(){
        let {type,prop} = this.props;
        let value;
        if(type === 'tabs' || type === 'select' || type === 'radio'){value = this.state.value}
        else if(type === 'checkbox'){value = this.state.bool}
        else if(type === 'multiselect'){value = this.state.values}
        
        let initValue;
        if(type === 'tabs' || type === 'select' || type === 'radio'){initValue = '"2"'}
        else if(type === 'multiselect'){initValue = '["1","2"]'}
        else if(type === 'checkbox'){initValue = 'false'}
        return (
            <>
                <div className="aio-component-label">{type}</div>
                <AIOButton 
                    type={type} 
                    text={type === 'multiselect' || type === 'checkbox' || type === 'button'?'text example':undefined} 
                    options={this.getOptions()} 
                    value={value}
                    onChange={(value)=>{
                        if(type === 'tabs' || type === 'select' || type === 'radio'){this.setState({value})}
                        else if(type === 'multiselect'){this.setState({values:value})}
                        else if(type === 'checkbox'){this.setState({value:!value})}
                    }}
                    optionSubtext={prop === 'optionSubtext'?'option.type':undefined}
                    optionBefore={prop === 'optionBefore'?<Icon path={mdiAccount} size={1}/>:undefined}
                    optionAfter={prop === 'optionAfter'?(option)=><div style={{background:'#999',color:'#fff',padding:'0 3px',borderRadius:24,fontSize:10,minWidth:8,textAlign:'center'}}>{option.number}</div>:undefined}
                    optionStyle={prop === 'optionStyle'?{color:'red'}:undefined}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            ${type}:${initValue}
        }
    }
    render(){
        let {${type}} = this.state;
        return (
            <AIOButton 
                type='${type}' 
                ${this.getOptionsStr()} 
                value={${type}}
                onChange={(${type})=>this.setState({${type}})}
            />
        )
    }
}
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
            </>
        )
    }
}

class Text extends Component{
    state = {select:'2',multiselect:['1','2'],checkbox:false}
    render(){
        let {select,multiselect,checkbox} = this.state;
        let options = [
            {text:'option1',value:'1'},
            {text:'option2',value:'2'},
            {text:'option3',value:'3'},
        ]
        return (
            <div className='example'>
                <AIOButton 
                    type='button' 
                    text='text example' 
                    onClick={()=>alert()}
                />
                <pre>
                    {`
class App extends React.Component{
    render(){
        return (
            <AIOButton 
                type='button' 
                text='text example'
                onClick={()=>alert()}
            />
        )
    }
}
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                <AIOButton 
                    type='select' 
                    value={select} 
                    text='text example' 
                    options={[
                        {text:'option1',value:'1'},
                        {text:'option2',value:'2'},
                        {text:'option3',value:'3'}
                    ]} 
                    onChange={(value)=>this.setState({value})}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            select:'2'
        }
    }
    render(){
        let {select} = this.state;

        return (
            <AIOButton 
                type='select' 
                text='text example'
                value={select}
                options={[
                    {text:'option1',value:'1'},
                    {text:'option2',value:'2'},
                    {text:'option3',value:'3'}
                ]}
                onChange={(select)=>this.setState({select})}
            />
        )
    }
}
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                <AIOButton 
                    type='multiselect' 
                    text='text example' 
                    options={[
                        {text:'option1',value:'1'},
                        {text:'option2',value:'2'},
                        {text:'option3',value:'3'}
                    ]} 
                    value={multiselect} 
                    onChange={(multiselect)=>this.setState({multiselect})}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            multiselect:['1','2']
        }
    }
    render(){
        let {multiselect} = this.state;

        return (
            <AIOButton 
                type='multiselect' 
                text='text example' 
                options={[
                    {text:'option1',value:'1'},
                    {text:'option2',value:'2'},
                    {text:'option3',value:'3'}
                ]} 
                value={multiselect}
                onChange={(multiselect)=>this.setState({multiselect})}
            />
        )
    }
}

                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                <AIOButton type='checkbox' text='text example' value={checkbox} onChange={(checkbox)=>this.setState({checkbox:!checkbox})}/>
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value:false
        }
    }
    render(){
        let {value} = this.state;

        return (
            <AIOButton 
                type='checkbox'
                value={value} 
                text='text example'
                onChange={(value)=>this.setState({!value})}
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

class Before extends Component{
    render(){
        let options = [
            {text:'option1',value:'1'},
            {text:'option2',value:'2'},
            {text:'option3',value:'3'},
        ]
        let before = <Icon path={mdiAccount} size={0.7} />
        return (
            <div className='example'>
                <AIOButton type='button' text='text example' before={before}/>
                <pre>
                    {`
class App extends React.Component{
    render(){
        return (
            <AIOButton 
                type='button' 
                text='text example'
                onClick={()=>alert()}
                before={<Icon path={mdiAccount} size={0.7} />}
            />
        )
    }
}
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                <AIOButton type='select' value='2' options={options} before={before}/>
                <pre>
                    {`
<AIOButton 
    type='select' 
    value='2' 
    options={[
        {text:'option1',value:'1'},
        {text:'option2',value:'2'},
        {text:'option3',value:'3'}
    ]} 
    before={before}
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']} before={before}/>
                <pre>
                    {`<AIOButton type='multiselect' text='text example' options={options} value={['1','3']} before={before}/>`}    
                </pre>
                <div className='aio-component-splitter'></div>
                <AIOButton type='checkbox' text='text example' before={before}/>
                <pre>
                    {"<AIOButton type='checkbox' text='text example' before={before}/>"}    
                </pre>
            </div>
        )
    }
}

class After extends Component{
    state = {select:'2',multiselect:['1','2'],radio:'2',checkbox:false}
    render(){
        let {select,multiselect,radio,checkbox} = this.state;
        let options = [
            {text:'option1',value:'1'},
            {text:'option2',value:'2'},
            {text:'option3',value:'3'},
        ]
        let after = <div style={{background:'dodgerblue',color:'#fff',borderRadius:'100%',padding:'0 3px'}}>3</div>
        let afterText = `<div style={{background:'dodgerblue',color:'#fff',borderRadius:'100%',padding:'0 3px'}}>3</div>`
        return (
            <div className='example'>
                <div className="aio-component-label">button</div>
                <AIOButton 
                    type='button' 
                    text='text example' 
                    after={after}
                />
                <pre>
                    {`
class App extends React.Component{
    render(){
        return (
            <AIOButton 
                type='button' 
                text='text example'
                after={${afterText}}
            />
        )
    }
}
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                <div className="aio-component-label">select</div>
                <AIOButton 
                    type='select' 
                    value={select}
                    onChange={()=>this.setState({select})}
                    options={[
                        {text:'option1',value:'1'},
                        {text:'option2',value:'2'},
                        {text:'option3',value:'3'}
                    ]} 
                    after={after}
                />
                <pre>
                    {`
<AIOButton 
    type='select' 
    value={select}
    onChange={()=>this.setState({select})}
    options={[
        {text:'option1',value:'1'},
        {text:'option2',value:'2'},
        {text:'option3',value:'3'}
    ]} 
    after={${afterText}}
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']} after={after}/>
                <pre>
                    {`<AIOButton type='multiselect' text='text example' options={options} value={['1','3']} after={<div style={{background:'dodgerblue',color:'#fff',borderRadius:'100%',padding:'0 3px'}}>3</div>}/>`}    
                </pre>
                <div className='aio-component-splitter'></div>
                <div className="aio-component-label">checkbox</div>
                <AIOButton type='checkbox' text='text example' after={after}/>
                <pre>
                    {"<AIOButton type='checkbox' text='text example' after={<div style={{background:'dodgerblue',color:'#fff',borderRadius:'100%',padding:'0 3px'}}>3</div>}/>"}    
                </pre>
            </div>
        )
    }
}

class Subtext extends Component{
    render(){
        let options = [
            {text:'option1',value:'1'},
            {text:'option2',value:'2'},
            {text:'option3',value:'3'},
        ]
        let subtext = 'my subtext';
        return (
            <div style={{padding:12,width:'100%'}}>
                <pre>
                    {`
let options = [
    {text:'option1',value:'1'},
    {text:'option2',value:'2'},
    {text:'option3',value:'3'},
];
let subtext = 'my subtext';
                    `}
                </pre>
                <div className="aio-component-label">button</div>
                <AIOButton type='button' text='text example' subtext={subtext}/>
                <pre>
                    {`
class App extends React.Component{
    render(){
        return (
            <AIOButton 
                type='button' 
                text='text example'
                onClick={()=>alert()}
                subtext='my subtext'
            />
        )
    }
}
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options} subtext={subtext}/>
                <pre>
                    {`<AIOButton type='select' value='2' options={options} subtext={subtext}/>`}    
                </pre>
                <div className='aio-component-splitter'></div>
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']} subtext={subtext}/>
                <pre>
                    {`<AIOButton type='multiselect' text='text example' options={options} value={['1','3']} subtext={subtext}/>`}    
                </pre>
                <div className='aio-component-splitter'></div>
                <div className="aio-component-label">checkbox</div>
                <AIOButton type='checkbox' text='text example' subtext={subtext}/>
                <pre>
                    {"<AIOButton type='checkbox' text='text example' subtext={subtext}/>"}    
                </pre>
            </div>
        )
    }
}

class Options extends Component{
    render(){
        return (
            <div className='example'>
                <MSF prop='options' type='tabs'/>
                <MSF prop='options' type='select'/>
                <MSF prop='options' type='multiselect'/>
                <MSF prop='options' type='radio'/>
            </div>
        )
    }
}

// class OptionProperties extends Component{
//     state = {
//         tab:'2',select:'2',multiselect:['1','3'],radio:'2',checklist1:false,checklist2:false,checklist3:false,
//         setting:{
//             subtext:false,before:false,after:false,style:false,onClick:false
//         }
//     }
//     render(){
//         let {tab,select,multiselect,radio,checklist1,checklist2,checklist3,setting} = this.state;
//         let options = [
//             {text:'option1',value:'1'},
//             {text:'option2',value:'2'},
//             {text:'option3',value:'3'}
//         ]
//         options = options.map((o,i)=>{
//             let res = {...o};
//             if(setting.subtext){res.subtext = 'my subtext'}
//             if(setting.before){res.before = <Icon path={mdiAccount} size={1}/>}
//             if(setting.after){res.after = <div style={{background:'dodgerblue',fontSize:10,padding:'0 3px',color:'#fff',borderRadius:'100%',minWidth:10,textAlign:'center'}}>5</div>}
//             if(setting.style && i === 0){res.style = {background:'pink'}}
//             if(setting.onClick && i === 0){res.onClick = ()=>alert()}
//             return res
//         })
//         return (
//             <div className='example'>
//                 <AIOButton 
//                     before={'set option properties'}
//                     type='radio'
//                     style={{background:'lightblue'}}
//                     value={true}
//                     options={[
//                         {text:'subtext',value:setting.subtext,id:'subtext'},
//                         {text:'before',value:setting.before,id:'before'},
//                         {text:'after',value:setting.after,id:'after'},
//                         {text:'style',value:setting.style,id:'style'},
//                         {text:'onClick',value:setting.onClick,id:'onClick'},
//                     ]}
//                     optionIconRound={false}
//                     optionIconColor={['#444']}
//                     onChange={(value,{option})=>{
//                         setting[option.id] = !setting[option.id];
//                         this.setState({setting})
//                     }}
//                 />

//                 <div className="aio-component-label">tabs</div>
//                 <AIOButton 
//                     type='tabs' 
//                     text='text example' 
//                     options={options} 
//                     value={tab}
//                     onChange={(tab)=>this.setState({tab})}
//                 />
//                 <pre>
//                     {`
// class App extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             tab:'2'
//         }
//     }
//     render(){
//         let {tab} = this.state;
//         return (
//             <AIOButton 
//                 type='tabs' 
//                 text='text example' 
//                 options={[
//                     {text:'option1',value:'1',subtext:'subtext1'},
//                     {text:'option2',value:'2',subtext:'subtext2'},
//                     {text:'option3',value:'3',subtext:'subtext3'}
//                 ]} 
//                 value={tab}
//                 onChange={(tab)=>this.setState({tab})}
//             />
//         )
//     }
// }
//                     `}    
//                 </pre>
//                 <div className='aio-component-splitter'></div>
                
//                 <div className="aio-component-label">select</div>
//                 <AIOButton 
//                     type='select' 
//                     options={options}
//                     value={select} 
//                     onChange={(select)=>this.setState({select})}
//                 />
//                 <pre>
//                     {`
// class App extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             select:'2'
//         }
//     }
//     render(){
//         let {select} = this.state;
//         return (
//             <AIOButton 
//                 type='select' 
//                 options={[
//                     {text:'option1',value:'1',subtext:'subtext1'},
//                     {text:'option2',value:'2',subtext:'subtext2'},
//                     {text:'option3',value:'3',subtext:'subtext3'}
//                 ]}
//                 value={select} 
//                 onChange={(select)=>this.setState({select})}
//             />
//         )
//     }
// }
//                     `}    
//                 </pre>
//                 <div className='aio-component-splitter'></div>
                
//                 <div className="aio-component-label">multiselect</div>
//                 <AIOButton 
//                     type='multiselect' 
//                     text='text example' 
//                     options={options} 
//                     value={multiselect}
//                     onChange={(multiselect)=>this.setState({multiselect})}
//                 />
//                 <pre>
//                     {`
// class App extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             multiselect:['1','3']
//         }
//     }
//     render(){
//         let {multiselect} = this.state;
//         return (
//             <AIOButton 
//                 type='multiselect' 
//                 text='text example' 
//                 options={[
//                     {text:'option1',value:'1',subtext:'subtext1'},
//                     {text:'option2',value:'2',subtext:'subtext2'},
//                     {text:'option3',value:'3',subtext:'subtext3'}
//                 ]} 
//                 value={multiselect}
//                 onChange={(multiselect)=>this.setState({multiselect})}
//             />
//         )
//     }
// }
//                     `}    
//                 </pre>
//                 <div className='aio-component-splitter'></div>
                
//                 <div className="aio-component-label">radio</div>
//                 <AIOButton 
//                     type='radio' 
//                     text='text example' 
//                     options={options} 
//                     value={radio}
//                     onChange={(radio)=>this.setState({radio})}
//                 />
//                 <pre>
//                     {`
// class App extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             radio:'2'
//         }
//     }
//     render(){
//         let {radio} = this.state;
//         return (
//             <AIOButton 
//                 type='radio' 
//                 text='text example' 
//                 options={[
//                     {text:'option1',value:'1',subtext:'subtext1'},
//                     {text:'option2',value:'2',subtext:'subtext2'},
//                     {text:'option3',value:'3',subtext:'subtext3'}
//                 ]} 
//                 value={radio}
//                 onChange={(radio)=>this.setState({radio})}
//             />
//         )
//     }
// }
//                     `}    
//                 </pre>
//                 <div className='aio-component-splitter'></div>
                
//                 <div className="aio-component-label">checklist</div>
//                 <AIOButton 
//                     type='radio' 
//                     text='text example' 
//                     options={[
//                         {text:'option1',value:checklist1,id:'checklist1',subtext:'subtext1'},
//                         {text:'option2',value:checklist2,id:'checklist2',subtext:'subtext2'},
//                         {text:'option3',value:checklist3,id:'checklist3',subtext:'subtext3'},
//                     ]}
//                     optionIconRound={false}
//                     value={true}
//                     onChange={(value,{option})=>{
//                         this.setState({[option.id]:!this.state[option.id]})
//                     }}
//                 />
//                 <pre>
//                     {`
// class App extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             checklist1:false,
//             checklist2:true,
//             checklist3:false
//         }
//     }
//     render(){
//         let {checklist1,checklist2,checklist3} = this.state;
//         return (
//             <AIOButton 
//                 type='radio' 
//                 text='text example' 
//                 options={[
//                     {text:'option1',value:checklist1,id:'checklist1',subtext:'subtext1'},
//                     {text:'option2',value:checklist2,id:'checklist2',subtext:'subtext2'},
//                     {text:'option3',value:checklist3,id:'checklist3',subtext:'subtext3'},
//                 ]}
//                 optionIconRound={false}
//                 value={true}
//                 onChange={(value,{option})=>{
//                     this.setState({[option.id]:!this.state[option.id]})
//                 }}
//             />
//         )
//     }
// }
//                     `}    
//                 </pre>
                
                
//             </div>
//         )
//     }
// }

class OptionProperty_subtext extends Component{
    render(){
        return (
            <div className='example'>
                <MSF prop='option.subtext' type='tabs'/>
                <MSF prop='option.subtext' type='select'/>
                <MSF prop='option.subtext' type='multiselect'/>
                <MSF prop='option.subtext' type='radio'/>
            </div>
        )
    }
}

class OptionProperty_before extends Component{
    render(){
        return (
            <div className='example'>
                <MSF prop='option.before' type='tabs'/>
                <MSF prop='option.before' type='select'/>
                <MSF prop='option.before' type='multiselect'/>
                <MSF prop='option.before' type='radio'/>
            </div>
        )
    }
}

class OptionProperty_after extends Component{
    render(){
        return (
            <div className='example'>
                <MSF prop='option.after' type='tabs'/>
                <MSF prop='option.after' type='select'/>
                <MSF prop='option.after' type='multiselect'/>
                <MSF prop='option.after' type='radio'/>
            </div>
        )
    }
}
class OptionProperty_style extends Component{
    render(){
        return (
            <div className='example'>
                <MSF prop='option.style' type='tabs'/>
                <MSF prop='option.style' type='select'/>
                <MSF prop='option.style' type='multiselect'/>
                <MSF prop='option.style' type='radio'/>
            </div>
        )
    }
}

class OptionProperty_onClick extends Component{
    render(){
        return (
            <div className='example'>
                <MSF prop='option.onClick' type='tabs'/>
                <MSF prop='option.onClick' type='select'/>
                <MSF prop='option.onClick' type='multiselect'/>
                <MSF prop='option.onClick' type='radio'/>
            </div>
        )
    }
}
class OptionProperty_tagBefore extends Component{
    state = {multiselect:['1','3']}
    render(){
        let {multiselect} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">multiselect</div>
                <AIOButton 
                    type='multiselect' 
                    text='text example' 
                    options={[
                        {text:'option1',value:'1',tagBefore:<Icon path={mdiAccount} size={0.6}/>},
                        {text:'option2',value:'2',tagBefore:<Icon path={mdiAccount} size={0.6}/>},
                        {text:'option3',value:'3',tagBefore:<Icon path={mdiAccount} size={0.6}/>}
                    ]} 
                    value={multiselect}
                    onChange={(multiselect)=>this.setState({multiselect})}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            multiselect:['1','3']
        }
    }
    render(){
        let {multiselect} = this.state;
        return (
            <AIOButton 
                type='multiselect' 
                text='text example' 
                options={[
                    {text:'option1',value:'1',tagBefore:<Icon path={mdiAccount} size={0.6}/>},
                    {text:'option2',value:'2',tagBefore:<Icon path={mdiAccount} size={0.6}/>},
                    {text:'option3',value:'3',tagBefore:<Icon path={mdiAccount} size={0.6}/>}
                ]} 
                value={multiselect}
                onChange={(multiselect)=>this.setState({multiselect})}
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
class OptionProperty_tagAttrs extends Component{
    state = {multiselect:['1','3']}
    render(){
        let {multiselect} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">multiselect</div>
                <AIOButton
                    type='multiselect' 
                    text='sample text' 
                    value={multiselect}
                    options={[
                        {text:'option1',value:'1',tagAttrs:{style:{background:'pink',color:'#000'}}},
                        {text:'option2',value:'2',tagAttrs:{style:{background:'red',color:'#fff'}}},
                        {text:'option3',value:'3',tagAttrs:{style:{background:'orange',color:'#fff'}}}
                    ]} 
                    before={<div className='fas fa-file' style={{marginRight:8}}></div>}
                    onChange={(multiselect)=>this.setState({multiselect})}
                />  
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            multiselect:['1','3']
        }
    }
    render(){
        let {multiselect} = this.state;
        return (
            <AIOButton
                type='multiselect' 
                text='sample text' 
                value={multiselect}
                options={[
                    {text:'option1',value:'1',tagAttrs:{style:{background:'pink',color:'#000'}}},
                    {text:'option2',value:'2',tagAttrs:{style:{background:'red',color:'#fff'}}},
                    {text:'option3',value:'3',tagAttrs:{style:{background:'orange',color:'#fff'}}}
                ]} 
                before={<div className='fas fa-file' style={{marginRight:8}}></div>}
                onChange={(multiselect)=>this.setState({multiselect})}
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


class OptionProperty_checkIcon extends Component{
    state = {multiselect:['1','3'],radio:'2'}
    render(){
        let {multiselect,radio} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">multiselect option.checkIcon (array of 2 html)</div>
                <AIOButton
                    type='multiselect' 
                    text='sample text' 
                    value={multiselect}
                    options={[
                        {text:'option1',value:'1',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]},
                        {text:'option2',value:'2',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]},
                        {text:'option3',value:'3',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]}
                    ]} 
                    onChange={(multiselect)=>this.setState({multiselect})}
                />  
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            multiselect:['1','3']
        }
    }
    render(){
        let {multiselect} = this.state;
        return (
            <AIOButton
                type='multiselect' 
                text='sample text' 
                value={multiselect}
                options={[
                    {text:'option1',value:'1',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]},
                    {text:'option2',value:'2',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]},
                    {text:'option3',value:'3',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]}
                ]} 
                onChange={(multiselect)=>this.setState({multiselect})}
            />  
        )
    }
}
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect option.checkIcon (object)</div>
                <AIOButton
                    type='multiselect' 
                    text='sample text' 
                    value={multiselect}
                    options={[
                        {text:'option1',value:'1',checkIcon:{size:[12,10,1],color:['#333','orange'],round:false}},
                        {text:'option2',value:'2',checkIcon:{size:[12,10,1],color:['#333','green'],round:false}},
                        {text:'option3',value:'3',checkIcon:{size:[12,10,1],color:['#333','blue'],round:false}}
                    ]} 
                    onChange={(multiselect)=>this.setState({multiselect})}
                />  
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            multiselect:['1','3']
        }
    }
    render(){
        let {multiselect} = this.state;
        return (
            <AIOButton
                    type='multiselect' 
                    text='sample text' 
                    value={multiselect}
                    options={[
                        {text:'option1',value:'1',checkIcon:{size:[12,10,1],color:['#333','orange'],round:false}},
                        {text:'option2',value:'2',checkIcon:{size:[12,10,1],color:['#333','green'],round:false}},
                        {text:'option3',value:'3',checkIcon:{size:[12,10,1],color:['#333','blue'],round:false}}
                    ]} 
                    onChange={(multiselect)=>this.setState({multiselect})}
                />  
        )
    }
}
                    `}    
                </pre>


                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">radio option.checkIcon (array of 2 html)</div>
                <AIOButton
                    type='radio' 
                    value={radio}
                    options={[
                        {text:'option1',value:'1',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]},
                        {text:'option2',value:'2',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]},
                        {text:'option3',value:'3',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]}
                    ]} 
                    onChange={(radio)=>this.setState({radio})}
                />  
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            radio:'2'
        }
    }
    render(){
        let {radio} = this.state;
        return (
            <AIOButton
                type='radio' 
                value={radio}
                options={[
                    {text:'option1',value:'1',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]},
                    {text:'option2',value:'2',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]},
                    {text:'option3',value:'3',checkIcon:[<Icon path={mdiCheckboxBlankOutline } size={1}/>,<Icon path={mdiAccountBox} size={1}/>]}
                ]} 
                onChange={(radio)=>this.setState({radio})}
            />    
        )
    }
}
                    `}    
                </pre>

                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">radio option.checkIcon (object)</div>
                <AIOButton
                    type='radio' 
                    text='sample text' 
                    value={radio}
                    options={[
                        {text:'option1',value:'1',checkIcon:{size:[12,10,1],color:['#333','orange'],round:false}},
                        {text:'option2',value:'2',checkIcon:{size:[12,10,1],color:['#333','green'],round:false}},
                        {text:'option3',value:'3',checkIcon:{size:[12,10,1],color:['#333','blue'],round:false}}
                    ]} 
                    onChange={(radio)=>this.setState({radio})}
                />  
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            radio:'2'
        }
    }
    render(){
        let {multiselect} = this.state;
        return (
            <AIOButton
                type='radio' 
                text='sample text' 
                value={multiselect}
                options={[
                    {text:'option1',value:'1',checkIcon:{size:[12,10,1],color:['#333','orange'],round:false}},
                    {text:'option2',value:'2',checkIcon:{size:[12,10,1],color:['#333','green'],round:false}},
                    {text:'option3',value:'3',checkIcon:{size:[12,10,1],color:['#333','blue'],round:false}}
                ]} 
                onChange={(multiselect)=>this.setState({multiselect})}
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




class OptionProperty_close extends Component{
    state = {tab:'2',select:'2',multiselect:['1','3'],radio:'2',checklist1:false,checklist2:false,checklist3:false}
    render(){
        let {tab,select,multiselect,radio,checklist1,checklist2,checklist3} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">select</div>
                <AIOButton 
                    type='select' 
                    options={[
                        {text:'option1',value:'1',close:false},
                        {text:'option2',value:'2',close:false},
                        {text:'option3',value:'3',close:false}
                    ]}
                    value={select} 
                    onChange={(select)=>this.setState({select})}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            select:'2'
        }
    }
    render(){
        let {select} = this.state;
        return (
            <AIOButton 
                type='select' 
                options={[
                    {text:'option1',value:'1',close:false},
                    {text:'option2',value:'2',close:false},
                    {text:'option3',value:'3',close:false}
                ]}
                value={select} 
                onChange={(select)=>this.setState({select})}
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
class OptionProperty_checked extends Component{
    state = {
        options:[
            {text:'option1',value:'1',checked:false},
            {text:'option2',value:'2',checked:true},
            {text:'option3',value:'3',checked:false}
        ]
    }
    render(){
        let {options} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">select</div>
                <AIOButton 
                    type='select' 
                    options={options}
                    text='check items'
                    onChange={(value,{option})=>{
                        option.checked = !option.checked;
                        this.setState({options})
                    }}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            options:[
                {text:'option1',value:'1',checked:false},
                {text:'option2',value:'2',checked:true},
                {text:'option3',value:'3',checked:false}
            ]
        }
    }
    render(){
        let {options} = this.state;
        return (
            <AIOButton 
                type='select' 
                options={options}
                text='check items'
                onChange={(value,{option})=>{
                    option.checked = !option.checked;
                    this.setState({options})
                }}
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

class OptionTextOptionValue extends Component{
    state = {tab:'2',select:'2',multiselect:['1','3'],radio:'2',checklist1:false,checklist2:true,checklist3:false}
    render(){
        let {tab,select,multiselect,radio,checklist1,checklist2,checklist3} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">tabs</div>
                <AIOButton 
                    type='tabs' 
                    text='text example' 
                    options={[
                        {presentation:'option1',id:'1'},
                        {presentation:'option2',id:'2'},
                        {presentation:'option3',id:'3'},
                    ]} 
                    optionText='option.presentation' 
                    optionValue='option.id'
                    value={tab}
                    onChange={(tab)=>this.setState({tab})}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tab:'2'
        }
    }
    render(){
        let {tab} = this.state;
        return (
            <AIOButton 
                type='tabs' 
                text='text example' 
                options={[
                    {presentation:'option1',id:'1'},
                    {presentation:'option2',id:'2'},
                    {presentation:'option3',id:'3'},
                ]} 
                optionText='option.presentation' 
                optionValue='option.id'
                value={tab}
                onChange={(tab)=>this.setState({tab})}
            />
        )
    }
}
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">select</div>
                <AIOButton 
                    type='select' 
                    options={[
                        {presentation:'option1',id:'1'},
                        {presentation:'option2',id:'2'},
                        {presentation:'option3',id:'3'},
                    ]}
                    optionText='option.presentation' 
                    optionValue='option.id'
                    value={select} 
                    onChange={(select)=>this.setState({select})}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            select:'2'
        }
    }
    render(){
        let {select} = this.state;
        return (
            <AIOButton 
                type='select' 
                options={[
                    {presentation:'option1',id:'1'},
                    {presentation:'option2',id:'2'},
                    {presentation:'option3',id:'3'},
                ]}
                optionText='option.presentation' 
                optionValue='option.id'
                value={select} 
                onChange={(select)=>this.setState({select})}
            />
        )
    }
}
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect</div>
                <AIOButton 
                    type='multiselect' 
                    text='text example' 
                    options={[
                        {presentation:'option1',id:'1'},
                        {presentation:'option2',id:'2'},
                        {presentation:'option3',id:'3'},
                    ]} 
                    optionText='option.presentation' 
                    optionValue='option.id'
                    value={multiselect}
                    onChange={(multiselect)=>this.setState({multiselect})}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            multiselect:['1','3']
        }
    }
    render(){
        let {multiselect} = this.state;
        return (
            <AIOButton 
                type='multiselect' 
                text='text example' 
                options={[
                    {presentation:'option1',id:'1'},
                    {presentation:'option2',id:'2'},
                    {presentation:'option3',id:'3'},
                ]} 
                optionText='option.presentation' 
                optionValue='option.id'
                value={multiselect}
                onChange={(multiselect)=>this.setState({multiselect})}
            />
        )
    }
}
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">radio</div>
                <AIOButton 
                    type='radio' 
                    text='text example' 
                    options={[
                        {presentation:'option1',id:'1'},
                        {presentation:'option2',id:'2'},
                        {presentation:'option3',id:'3'},
                    ]}
                    optionText='option.presentation' 
                    optionValue='option.id' 
                    value={radio}
                    onChange={(radio)=>this.setState({radio})}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            radio:'2'
        }
    }
    render(){
        let {radio} = this.state;
        return (
            <AIOButton 
                type='radio' 
                text='text example' 
                options={[
                    {presentation:'option1',id:'1'},
                    {presentation:'option2',id:'2'},
                    {presentation:'option3',id:'3'},
                ]}
                optionText='option.presentation' 
                optionValue='option.id'
                value={radio}
                onChange={(radio)=>this.setState({radio})}
            />
        )
    }
}
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">checklist</div>
                <AIOButton 
                    type='radio' 
                    text='text example' 
                    options={[
                        {presentation:'option1',state:checklist1,id:'checklist1'},
                        {presentation:'option2',state:checklist2,id:'checklist2'},
                        {presentation:'option3',state:checklist3,id:'checklist3'},
                    ]}
                    optionText='option.presentation' 
                    optionValue='option.state' 
                    optionIconRound={false}
                    value={true}
                    onChange={(value,{option})=>{
                        this.setState({[option.id]:!this.state[option.id]})
                    }}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checklist1:false,
            checklist2:true,
            checklist3:false
        }
    }
    render(){
        let {radio} = this.state;
        return (
            <AIOButton 
                type='radio' 
                text='text example' 
                options={[
                    {presentation:'option1',state:checklist1,id:'checklist1'},
                    {presentation:'option2',state:checklist2,id:'checklist2'},
                    {presentation:'option3',state:checklist3,id:'checklist3'},
                ]}
                optionText='option.presentation' 
                optionValue='option.state' 
                optionIconRound={false}
                value={true}
                onChange={(value,{option})=>{
                    this.setState({[option.id]:!this.state[option.id]})
                }}
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


class OptionSubtext extends Component{
    render(){
        return (
            <div className='example'>
                <MSF prop='optionSubtext' type='tabs'/>
                <MSF prop='optionSubtext' type='select'/>
                <MSF prop='optionSubtext' type='multiselect'/>
                <MSF prop='optionSubtext' type='radio'/>
            </div>
        )
    }
}

class OptionBefore extends Component{
    render(){
        return (
            <div className='example'>
                <MSF prop='optionBefore' type='tabs'/>
                <MSF prop='optionBefore' type='select'/>
                <MSF prop='optionBefore' type='multiselect'/>
                <MSF prop='optionBefore' type='radio'/>
            </div>
        )
    }
}
class OptionAfter extends Component{
    render(){
        return (
            <div className='example'>
                <MSF prop='optionAfter' type='tabs'/>
                <MSF prop='optionAfter' type='select'/>
                <MSF prop='optionAfter' type='multiselect'/>
                <MSF prop='optionAfter' type='radio'/>
            </div>
        )
    }
}

class OptionStyle extends Component{
    render(){
        return (
            <div className='example'>
                <MSF prop='optionStyle' type='tabs'/>
                <MSF prop='optionStyle' type='select'/>
                <MSF prop='optionStyle' type='multiselect'/>
                <MSF prop='optionStyle' type='radio'/>
            </div>
        )
    }
}
class OptionTagBefore extends Component{
    state = {multiselect:['1','3']}
    render(){
        let {multiselect} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">multiselect</div>
                <AIOButton 
                    type='multiselect' 
                    text='text example' 
                    options={[
                        {text:'option1',value:'1'},
                        {text:'option2',value:'2'},
                        {text:'option3',value:'3'}
                    ]} 
                    optionTagBefore={<Icon path={mdiAccount} size={0.6}/>}
                    value={multiselect}
                    onChange={(multiselect)=>this.setState({multiselect})}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            multiselect:['1','3']
        }
    }
    render(){
        let {multiselect} = this.state;
        return (
            <AIOButton 
                type='multiselect' 
                text='text example' 
                options={[
                    {text:'option1',value:'1',tagBefore:<Icon path={mdiAccount} size={0.6}/>},
                    {text:'option2',value:'2',tagBefore:<Icon path={mdiAccount} size={0.6}/>},
                    {text:'option3',value:'3',tagBefore:<Icon path={mdiAccount} size={0.6}/>}
                ]} 
                value={multiselect}
                onChange={(multiselect)=>this.setState({multiselect})}
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

class OptionTagAttrs extends Component{
    state = {multiselect:['1','3']}
    render(){
        let {multiselect} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">multiselect</div>
                <AIOButton
                    type='multiselect' 
                    text='sample text' 
                    value={multiselect}
                    optionTagAttrs={(option,index)=>{
                        let backgrounds = ['pink','red','orange'];
                        let colors = ['#000','#fff','#fff'];
                        return {
                            style:{color:colors[index],background:backgrounds[index]}}
                        }
                    }
                    options={[
                        {text:'option1',value:'1'},
                        {text:'option2',value:'2'},
                        {text:'option3',value:'3'}
                    ]} 
                    before={<div className='fas fa-file' style={{marginRight:8}}></div>}
                    onChange={(multiselect)=>this.setState({multiselect})}
                />  
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            multiselect:['1','3']
        }
    }
    render(){
        let {multiselect} = this.state;
        return (
            <AIOButton
                type='multiselect' 
                text='sample text' 
                value={multiselect}
                optionTagAttrs={(option,index)=>{
                    let backgrounds = ['pink','red','orange'];
                    let colors = ['#000','#fff','#fff'];
                    return {
                        style:{color:colors[index],background:backgrounds[index]}}
                    }
                }
                options={[
                    {text:'option1',value:'1'},
                    {text:'option2',value:'2'},
                    {text:'option3',value:'3'}
                ]} 
                before={<div className='fas fa-file' style={{marginRight:8}}></div>}
                onChange={(multiselect)=>this.setState({multiselect})}
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

class OptionClose extends Component{
    state = {select:'2'}
    render(){
        let {select} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">select</div>
                <AIOButton 
                    type='select' 
                    options={[
                        {text:'option1',value:'1'},
                        {text:'option2',value:'2'},
                        {text:'option3',value:'3'}
                    ]}
                    optionClose={false}
                    value={select} 
                    onChange={(select)=>this.setState({select})}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            select:'2'
        }
    }
    render(){
        let {select} = this.state;
        return (
            <AIOButton 
                type='select' 
                options={[
                    {text:'option1',value:'1'},
                    {text:'option2',value:'2'},
                    {text:'option3',value:'3'}
                ]}
                optionClose={false}
                value={select} 
                onChange={(select)=>this.setState({select})}
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

class OptionChecked extends Component{
    state = {
        options:[
            {text:'option1',value:'1',isActive:false},
            {text:'option2',value:'2',isActive:true},
            {text:'option3',value:'3',isActive:false}
        ]
    }
    render(){
        let {options} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">select</div>
                <AIOButton 
                    type='select' 
                    options={options}
                    text='check items'
                    optionChecked='option.isActive'
                    onChange={(value,{option})=>{
                        option.isActive = !option.isActive;
                        this.setState({options})
                    }}
                />
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            options:[
                {text:'option1',value:'1',isActive:false},
                {text:'option2',value:'2',isActive:true},
                {text:'option3',value:'3',isActive:false}
            ]
        }
    }
    render(){
        let {options} = this.state;
        return (
            <AIOButton 
                type='select' 
                options={options}
                text='check items'
                optionChecked='option.isActive'
                onChange={(value,{option})=>{
                    option.isActive = !option.isActive;
                    this.setState({options})
                }}
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
class OptionCheckIcon extends Component{
    state = {multiselect:['1','3']}
    render(){
        let {multiselect} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">multiselect</div>
                <AIOButton
                    type='multiselect' 
                    text='sample text' 
                    value={multiselect}
                    options={[
                        {text:'option1',value:'1'},
                        {text:'option2',value:'2'},
                        {text:'option3',value:'3'}
                    ]} 
                    optionCheckIcon={[<Icon path={mdiAccountBox} size={1}/>,<Icon path={mdiCheckboxBlankOutline } size={1}/>]}
                    onChange={(multiselect)=>this.setState({multiselect})}
                />  
                <pre>
                    {`
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            multiselect:['1','3']
        }
    }
    render(){
        let {multiselect} = this.state;
        return (
            <AIOButton
                type='multiselect' 
                text='sample text' 
                value={multiselect}
                options={[
                    {text:'option1',value:'1'},
                    {text:'option2',value:'2'},
                    {text:'option3',value:'3'}
                ]} 
                optionCheckIcon={[<Icon path={mdiAccountBox} size={1}/>,<Icon path={mdiCheckboxBlankOutline } size={1}/>]}
                onChange={(multiselect)=>this.setState({multiselect})}
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

class PopOver extends Component{
    render(){
        return (
            <div className='example'>
                <AIOButton
                    type='button'
                    text='open popOver'
                    popOver={()=>{
                        return (
                            <div style={{padding:12,background:'dodgerblue',color:'#fff'}}>
                                this is my popover
                            </div>
                        )
                    }}
                />
                <pre>
                    {`
<AIOButton
    type='button'
    text='open popOver'
    popOver={()=>{
        return (
            <div style={{padding:12,background:'dodgerblue',color:'#fff'}}>
                this is my popover
            </div>
        )
    }}
/>
                    `}    
                </pre>
            </div>
        )
    }
}


class Animate extends Component{
    constructor(props){
        super(props);
        this.state = {select:'2'}
    }
    render(){
        let {select} = this.state;
        return (
            <div className='example'>
                <div className="aio-component-label">{`animate={true}`}</div>
                <AIOButton
                    type='select'
                    options={[
                        {text:'Option 1',value:'1'},
                        {text:'Option 2',value:'2'},
                        {text:'Option 3',value:'3'}
                    ]}
                    value={select}
                    onChange={(select)=>this.setState({select})}
                    animate={true}
                />
                <pre>
                    {`
<AIOButton
    type='select'
    options={[
        {text:'Option 1',value:'1'},
        {text:'Option 2',value:'2'},
        {text:'Option 3',value:'3'}
    ]}
    value={select}
    onChange={(select)=>this.setState({select})}
    animate={true}
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
    
                <div className="aio-component-label">{`animate={{left:0}}`}</div>
                <AIOButton
                    type='select' 
                    animate={{left:0}} 
                    className='button' 
                    value={select} 
                    options={[
                        {text:'Option 1',value:'1'},
                        {text:'Option 2',value:'2'},
                        {text:'Option 3',value:'3'}
                    ]}
                    popupAttrs={{
                        style:{
                        left:-200,
                        position:'fixed',
                        height:'100%',
                        top:0,
                        width:200
                    }}}
                    onChange={(select)=>this.setState({select})}
                />    
                <pre>
                    {`
<AIOButton
    type='select' 
    animate={{left:0}} 
    className='button' 
    value={select} 
    options={[
        {text:'Option 1',value:'1'},
        {text:'Option 2',value:'2'},
        {text:'Option 3',value:'3'}
    ]}
    popupAttrs={{
        style:{
        left:-200,
        position:'fixed',
        height:'100%',
        top:0,
        width:200
    }}}
    onChange={(select)=>this.setState({select})}
/>    
                    `}    
                </pre>

                <div className='aio-component-splitter'></div>
    
                <div className="aio-component-label">{`animate={{left:0}}`}</div>
                <AIOButton
                    type='button' 
                    text='click to open popOver'
                    popOver={()=>{
                        return (
                            <div style={{background:'#333',color:'#fff',fontSize:16,padding:12,height:86}}>
                               Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.
                            </div>
                        )
                    }}
                    animate={{bottom:0}}
                    popupAttrs={{
                        style:{
                            bottom:-86,
                            top:'unset',
                            position:'fixed',
                            width:'100%',
                            height:86
                        }
                    }}
                />    
                <pre>
                    {`
<AIOButton
    type='select' 
    animate={{left:0}} 
    className='button' 
    value={select} 
    options={[
        {text:'Option 1',value:'1'},
        {text:'Option 2',value:'2'},
        {text:'Option 3',value:'3'}
    ]}
    popupAttrs={{
        style:{
        left:-200,
        position:'fixed',
        height:'100%',
        top:0,
        width:200
    }}}
    onChange={(select)=>this.setState({select})}
/>    
                    `}    
                </pre>
            </div>
            
        )
    }
}