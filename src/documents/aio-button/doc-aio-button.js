import React,{Component} from "react";
import RSA from './../../npm/react-super-app/react-super-app';
import AIOButton from './../../npm/aio-button/aio-button';
import PropsList from '../../resuse-components/props-list';
import {Icon} from '@mdi/react';
import {mdiAccount} from '@mdi/js';
export default class DOC_AIOButton extends Component{
    constructor(props){
        super(props);
        this.propsList = [
            {
                props:'type',type:'"button" | "select" | "multiselect" | "radio" | "checkbox" | "checklist" | "tabs"',
                description:'button type'
            },
            {
                props:'text',type:'string',description:'use in types("button","select","multiselect","checkbox")'
            },
            {
                props:'before',type:'html',description:'before html'
            },
            {
                props:'after',type:'html',description:'after html'
            },
            {
                props:'subtext',type:'string',description:'button subtext'
            },
            {
                props:'options',type:'array',description:'selectable options'
            },
            {
                props:'optionText',type:'string or function',description:'set option text'
            },
            {
                props:'optionValue',type:'string or function',description:'set option value'
            },
            {
                props:'optionSubtext',type:'string or function',description:'set option subtext'
            },
            {
                props:'optionBefore',type:'string or function',description:'set option before'
            },
            {
                props:'optionAfter',type:'string or function',description:'set option after'
            }
        ]
        this.state = {}

    }
    
    render(){
        return (
            <RSA
                navs={[
                    {text:'Props',id:'props'},
                    {text:'text',id:'text'},
                    {text:'before',id:'before'},
                    {text:'after',id:'after'},
                    {text:'subtext',id:'subtext'},
                    
                    {text:'options',id:'options'},
                    {text:'option property(subtext)',id:'option property(subtext)'},
                    {text:'option property(bfore)',id:'option property(before)'},
                    {text:'option property(after)',id:'option property(after)'},
                    {text:'option property(style)',id:'option property(style)'},
                    
                    {text:'optionText optionValue',id:'optionText-optionValue'},
                    {text:'optionSubtext',id:'optionSubtext'},
                    {text:'optionBefore',id:'optionBefore'},
                    {text:'optionAfter',id:'optionAfter'},
                    {text:'optionStyle',id:'optionStyle'},
                    
                ]}
                navId='props'
                body={({navId})=>{
                    if(navId === 'props'){return <PropsList props={this.propsList}/>}
                    if(navId === 'text'){return <Text/>}
                    if(navId === 'before'){return <Before/>}
                    if(navId === 'after'){return <After/>}
                    if(navId === 'subtext'){return <Subtext/>}
                    if(navId === 'options'){return <Options/>}
                    
                    if(navId === 'option property(subtext)'){return <OptionProperty_subtext/>}
                    if(navId === 'option property(before)'){return <OptionProperty_before/>}
                    if(navId === 'option property(after)'){return <OptionProperty_after/>}
                    if(navId === 'option property(style)'){return <OptionProperty_style/>}
                    
                    if(navId === 'optionText-optionValue'){return <OptionTextOptionValue/>}
                    if(navId === 'optionSubtext'){return <OptionSubtext/>}
                    if(navId === 'optionBefore'){return <OptionBefore/>}
                    if(navId === 'optionAfter'){return <OptionAfter/>}
                    if(navId === 'optionStyle'){return <OptionStyle/>}
                }}
                navHeader={()=><div className='part-title'>{'aio-button'}</div>}
                getActions={(obj)=>this.setState(obj)}
                header={()=><button onClick={()=>this.props.goToHome()}>Home</button>}
            />
        )
    }
}

class Text extends Component{
    render(){
        let options = [
            {text:'option1',value:'1'},
            {text:'option2',value:'2'},
            {text:'option3',value:'3'},
        ]
        return (
            <div style={{padding:12,width:'100%'}}>
                <AIOButton type='button' text='text example'/>
                <pre>
                    {"<AIOButton type='button' text='text example'/>"}    
                </pre>
                <div className='aio-component-splitter'></div>
                <AIOButton type='select' text='text example' options={options}/>
                <pre>
                    {`
<AIOButton 
    type='select' 
    text='text example' 
    options={[
        {text:'option1',value:'1'},
        {text:'option2',value:'2'},
        {text:'option3',value:'3'}
    ]}
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']}/>
                <pre>
                    {"<AIOButton type='multiselect' text='text example' options={options} value={['1','3']}/>"}    
                </pre>
                <div className='aio-component-splitter'></div>
                <AIOButton type='checkbox' text='text example'/>
                <pre>
                    {"<AIOButton type='checkbox' text='text example'/>"}    
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
            <div style={{padding:12,width:'100%'}}>
                <pre>
                    {`
let options = [
    {text:'option1',value:'1'},
    {text:'option2',value:'2'},
    {text:'option3',value:'3'},
]
let before = <Icon path={mdiAccount} size={0.7} />
                    `}
                </pre>
                <AIOButton type='button' text='text example' before={before}/>
                <pre>
                    {"<AIOButton type='button' text='text example' before={before}/>"}    
                </pre>
                <div className='aio-component-splitter'></div>
                <AIOButton type='select' value='2' options={options} before={before}/>
                <pre>
                    {`<AIOButton type='select' value='2' options={options} before={before}/>`}    
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
    render(){
        let options = [
            {text:'option1',value:'1'},
            {text:'option2',value:'2'},
            {text:'option3',value:'3'},
        ]
        let after = <Icon path={mdiAccount} size={0.7} />
        return (
            <div style={{padding:12,width:'100%'}}>
                <pre>
                    {`
let options = [
    {text:'option1',value:'1'},
    {text:'option2',value:'2'},
    {text:'option3',value:'3'},
]
let after = <Icon path={mdiAccount} size={0.7} />
                    `}
                </pre>
                <div className="aio-component-label">button</div>
                <AIOButton type='button' text='text example' after={after}/>
                <pre>
                    {"<AIOButton type='button' text='text example' after={after}/>"}    
                </pre>
                <div className='aio-component-splitter'></div>
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options} after={after}/>
                <pre>
                    {`<AIOButton type='select' value='2' options={options} after={after}/>`}    
                </pre>
                <div className='aio-component-splitter'></div>
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']} after={after}/>
                <pre>
                    {`<AIOButton type='multiselect' text='text example' options={options} value={['1','3']} after={after}/>`}    
                </pre>
                <div className='aio-component-splitter'></div>
                <div className="aio-component-label">checkbox</div>
                <AIOButton type='checkbox' text='text example' after={after}/>
                <pre>
                    {"<AIOButton type='checkbox' text='text example' after={after}/>"}    
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
                    {"<AIOButton type='button' text='text example' subtext={subtext}/>"}    
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
        let options = [
            {text:'option1',value:'1'},
            {text:'option2',value:'2'},
            {text:'option3',value:'3'},
        ]
        return (
            <div style={{padding:12,width:'100%',overflowY:'auto'}}>
                <pre>
                    {`
let options = [
    {text:'option1',value:'1'},
    {text:'option2',value:'2'},
    {text:'option3',value:'3'},
];
                    `}
                </pre>
                <div className="aio-component-label">tabs</div>
                <AIOButton type='tabs' text='text example' options={options} value={'1'}/>
                <pre>
                    {"<AIOButton type='tabs' text='text example' options={options} value={'1'}/>"}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options}/>
                <pre>
                    {`<AIOButton type='select' value='2' options={options}/>`}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']}/>
                <pre>
                    {`<AIOButton type='multiselect' text='text example' options={options} value={['1','3']}/>`}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">radio</div>
                <AIOButton type='radio' text='text example' options={options} value={'2'}/>
                <pre>
                    {"<AIOButton type='radio' text='text example' options={options}/>"}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">checklist</div>
                <AIOButton type='checklist' options={options} value={'2'}/>
                <pre>
                    {"<AIOButton type='checklist' text='text example' options={options}/>"}    
                </pre>
                
            </div>
        )
    }
}

class OptionProperty_subtext extends Component{
    render(){
        let options = [
            {text:'option1',value:'1',subtext:'subtext1'},
            {text:'option2',value:'2',subtext:'subtext2'},
            {text:'option3',value:'3',subtext:'subtext3'}
        ]
        return (
            <div style={{padding:12,width:'100%',overflowY:'auto'}}>
                <div className="aio-component-label">tabs</div>
                <AIOButton type='tabs' text='text example' options={options} value={'1'}/>
                <pre>
                    {`
<AIOButton 
    type='tabs' 
    text='text example' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1'},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]} 
    value={'1'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options}/>
                <pre>
                    {`
<AIOButton 
    type='select' 
    value='2' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1'},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]}
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']}/>
                <pre>
                    {`
<AIOButton 
    type='multiselect' 
    text='text example' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1'},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]} 
    value={['1','3']} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">radio</div>
                <AIOButton type='radio' text='text example' options={options} value={'2'}/>
                <pre>
                    {`
<AIOButton 
    type='radio' 
    text='text example' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1'},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]} 
    value={'2'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">checklist</div>
                <AIOButton type='checklist' options={options} value={'2'}/>
                <pre>
                    {`
<AIOButton 
    type='checklist' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1'},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]} 
    value={'2'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
    
                <div className="aio-component-label">checklist</div>
                <AIOButton type='checklist' options={options} value={'2'}/>
                <pre>
                    {`
<AIOButton 
    type='checklist' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1'},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]}
    value={'2'} 
/>
                    `}    
                </pre>
                
            </div>
        )
    }
}

class OptionProperty_before extends Component{
    render(){
        let options = [
            {text:'option1',value:'1',before:<Icon path={mdiAccount} size={0.7} />},
            {text:'option2',value:'2',before:<Icon path={mdiAccount} size={0.7} />},
            {text:'option3',value:'3',before:<Icon path={mdiAccount} size={0.7} />}
        ]
        return (
            <div style={{padding:12,width:'100%',overflowY:'auto'}}>
                
                <div className="aio-component-label">tabs</div>
                <AIOButton type='tabs' text='text example' options={options} value={'1'}/>
                <pre>
                    {`
<AIOButton 
    type='tabs' 
    text='text example' 
    options={[
        {text:'option1',value:'1',before:<Icon path={mdiAccount} size={0.7} />},
        {text:'option2',value:'2',before:<Icon path={mdiAccount} size={0.7} />},
        {text:'option3',value:'3',before:<Icon path={mdiAccount} size={0.7} />}
    ]} 
    value={'1'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options}/>
                <pre>
                    {`
<AIOButton 
    type='select' 
    value='2' 
    options={[
        {text:'option1',value:'1',before:<Icon path={mdiAccount} size={0.7} />},
        {text:'option2',value:'2',before:<Icon path={mdiAccount} size={0.7} />},
        {text:'option3',value:'3',before:<Icon path={mdiAccount} size={0.7} />}
    ]} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']}/>
                <pre>
                    {`
<AIOButton 
    type='multiselect' 
    text='text example' 
    options={[
        {text:'option1',value:'1',before:<Icon path={mdiAccount} size={0.7} />},
        {text:'option2',value:'2',before:<Icon path={mdiAccount} size={0.7} />},
        {text:'option3',value:'3',before:<Icon path={mdiAccount} size={0.7} />}
    ]} 
    value={['1','3']} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>                
            </div>
        )
    }
}

class OptionProperty_after extends Component{
    render(){
        let options = [
            {text:'option1',value:'1',after:<Icon path={mdiAccount} size={0.7} />},
            {text:'option2',value:'2',after:<Icon path={mdiAccount} size={0.7} />},
            {text:'option3',value:'3',after:<Icon path={mdiAccount} size={0.7} />}
        ]
        return (
            <div style={{padding:12,width:'100%',overflowY:'auto'}}>

                <div className="aio-component-label">tabs</div>
                <AIOButton type='tabs' text='text example' options={options} value={'1'}/>
                <pre>
                    {`
<AIOButton 
    type='tabs' 
    text='text example' 
    options={[
        {text:'option1',value:'1',after:<Icon path={mdiAccount} size={0.7} />},
        {text:'option2',value:'2',after:<Icon path={mdiAccount} size={0.7} />},
        {text:'option3',value:'3',after:<Icon path={mdiAccount} size={0.7} />}
    ]} 
    value={'1'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options}/>
                <pre>
                    {`
<AIOButton 
    type='select' 
    value='2' 
    options={[
        {text:'option1',value:'1',after:<Icon path={mdiAccount} size={0.7} />},
        {text:'option2',value:'2',after:<Icon path={mdiAccount} size={0.7} />},
        {text:'option3',value:'3',after:<Icon path={mdiAccount} size={0.7} />}
    ]}
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']}/>
                <pre>
                    {`
<AIOButton 
    type='multiselect' 
    text='text example' 
    options={[
        {text:'option1',value:'1',after:<Icon path={mdiAccount} size={0.7} />},
        {text:'option2',value:'2',after:<Icon path={mdiAccount} size={0.7} />},
        {text:'option3',value:'3',after:<Icon path={mdiAccount} size={0.7} />}
    ]}
    value={['1','3']} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>                

                <div className="aio-component-label">radio</div>
                <AIOButton type='radio' text='text example' options={options} value={'2'}/>
                <pre>
                    {`
<AIOButton 
    type='radio' 
    text='text example' 
    options={[
        {text:'option1',value:'1',after:<Icon path={mdiAccount} size={0.7} />},
        {text:'option2',value:'2',after:<Icon path={mdiAccount} size={0.7} />},
        {text:'option3',value:'3',after:<Icon path={mdiAccount} size={0.7} />}
    ]}
    value={'2'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
            
            </div>
        )
    }
}

class OptionProperty_style extends Component{
    render(){
        let options = [
            {text:'option1',value:'1',style:{background:'#ff000020'}},
            {text:'option2',value:'2'},
            {text:'option3',value:'3'}
        ]
        return (
            <div style={{padding:12,width:'100%',overflowY:'auto'}}>
                <div className="aio-component-label">tabs</div>
                <AIOButton type='tabs' text='text example' options={options} value={'1'}/>
                <pre>
                    {`
<AIOButton 
    type='tabs' 
    text='text example' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1',style:{background:'#ff00020'}},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]} 
    value={'1'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options}/>
                <pre>
                    {`
<AIOButton 
    type='select' 
    value='2' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1',style:{background:'#ff00020'}},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]}
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']}/>
                <pre>
                    {`
<AIOButton 
    type='multiselect' 
    text='text example' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1',style:{background:'#ff00020'}},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]} 
    value={['1','3']} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">radio</div>
                <AIOButton type='radio' text='text example' options={options} value={'2'}/>
                <pre>
                    {`
<AIOButton 
    type='radio' 
    text='text example' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1',style:{background:'#ff00020'}},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]} 
    value={'2'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">checklist</div>
                <AIOButton type='checklist' options={options} value={'2'}/>
                <pre>
                    {`
<AIOButton 
    type='checklist' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1',style:{background:'#ff00020'}},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]} 
    value={'2'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
    
                <div className="aio-component-label">checklist</div>
                <AIOButton type='checklist' options={options} value={'2'}/>
                <pre>
                    {`
<AIOButton 
    type='checklist' 
    options={[
        {text:'option1',value:'1',subtext:'subtext1',style:{background:'#ff00020'}},
        {text:'option2',value:'2',subtext:'subtext2'},
        {text:'option3',value:'3',subtext:'subtext3'}
    ]}
    value={'2'} 
/>
                    `}    
                </pre>
                
            </div>
        )
    }
}

class OptionTextOptionValue extends Component{
    render(){
        let options = [
            {presentation:'option1',id:'1'},
            {presentation:'option2',id:'2'},
            {presentation:'option3',id:'3'},
        ]
        return (
            <div style={{padding:12,width:'100%',overflowY:'auto'}}>
                <pre>
                    {`
let options = [
    {presentation:'option1',id:'1'},
    {presentation:'option2',id:'2'},
    {presentation:'option3',id:'3'},
];
                    `}
                </pre>
                <div className="aio-component-label">tabs</div>
                <AIOButton type='tabs' text='text example' options={options} value={'1'} optionText='option.presentation' optionValue='option.id'/>
                <pre>
                    {`
<AIOButton 
    type='tabs' 
    text='text example' 
    options={options} 
    value={'1'} 
    optionText='option.presentation' 
    optionValue='option.id'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options} optionText='option.presentation' optionValue='option.id'/>
                <pre>
                    {`
<AIOButton 
    type='select' 
    value='2' 
    options={options} 
    optionText='option.presentation' 
    optionValue='option.id'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']} optionText='option.presentation' optionValue='option.id'/>
                <pre>
                    {`
<AIOButton 
    type='multiselect' 
    text='text example' 
    options={options} 
    value={['1','3']} 
    optionText='option.presentation' 
    optionValue='option.id'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">radio</div>
                <AIOButton type='radio' text='text example' options={options} value={'2'} optionText='option.presentation' optionValue='option.id'/>
                <pre>
                    {`
<AIOButton 
    type='radio' 
    text='text example' 
    options={options} 
    value={'2'} 
    optionText='option.presentation' 
    optionValue='option.id'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">checklist</div>
                <AIOButton type='checklist' options={options} value={'2'} optionText='option.presentation' optionValue='option.id'/>
                <pre>
                    {`
<AIOButton 
    type='checklist' 
    options={options} 
    value={'2'} 
    optionText='option.presentation' 
    optionValue='option.id'
/>
                    `}    
                </pre>
                
            </div>
        )
    }
}

class OptionSubtext extends Component{
    render(){
        let options = [
            {text:'option1',value:'1',type:'type1'},
            {text:'option2',value:'2',type:'type2'},
            {text:'option3',value:'3',type:'type3'},
        ]
        return (
            <div style={{padding:12,width:'100%',overflowY:'auto'}}>
                <pre>
                    {`
let options = [
    {text:'option1',value:'1',type:'type1'},
    {text:'option2',value:'2',type:'type2'},
    {text:'option3',value:'3',type:'type3'},
];
                    `}
                </pre>
                <div className="aio-component-label">tabs</div>
                <AIOButton type='tabs' text='text example' options={options} value={'1'} optionSubtext='option.type'/>
                <pre>
                    {`
<AIOButton 
    type='tabs' 
    text='text example' 
    options={options} 
    value={'1'} 
    optionSubtext='option.type'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options} optionSubtext='option.type'/>
                <pre>
                    {`
<AIOButton 
    type='select' 
    value='2' 
    options={options} 
    optionSubtext='option.type'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']} optionSubtext='option.type'/>
                <pre>
                    {`
<AIOButton 
    type='multiselect' 
    text='text example' 
    options={options} 
    value={['1','3']} 
    optionSubtext='option.type'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">radio</div>
                <AIOButton type='radio' text='text example' options={options} value={'2'} optionSubtext='option.type'/>
                <pre>
                    {`
<AIOButton 
    type='radio' 
    text='text example' 
    options={options} 
    value={'2'} 
    optionSubtext='option.type'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">checklist</div>
                <AIOButton type='checklist' options={options} value={'2'} optionSubtext='option.type'/>
                <pre>
                    {`
<AIOButton 
    type='checklist' 
    options={options} 
    value={'2'} 
    optionSubtext='option.type'
/>
                    `}    
                </pre>
                
            </div>
        )
    }
}

class OptionBefore extends Component{
    render(){
        let options = [
            {text:'option1',value:'1',type:'type1',icon:<Icon path={mdiAccount} size={0.7}/>},
            {text:'option2',value:'2',type:'type2',icon:<Icon path={mdiAccount} size={0.7}/>},
            {text:'option3',value:'3',type:'type3',icon:<Icon path={mdiAccount} size={0.7}/>},
        ]
        return (
            <div style={{padding:12,width:'100%',overflowY:'auto'}}>
                <pre>
                    {`
let options = [
    {text:'option1',value:'1',type:'type1',icon:<Icon path={mdiAccount} size={0.7}/>},
    {text:'option2',value:'2',type:'type2',icon:<Icon path={mdiAccount} size={0.7}/>},
    {text:'option3',value:'3',type:'type3',icon:<Icon path={mdiAccount} size={0.7}/>}
];
                    `}
                </pre>
                <div className="aio-component-label">tabs</div>
                <AIOButton type='tabs' text='text example' options={options} value={'1'} optionBefore='option.icon'/>
                <pre>
                    {`
<AIOButton 
    type='tabs' 
    text='text example' 
    options={options} 
    value={'1'} 
    optionBefore='option.icon'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options} optionBefore='option.icon'/>
                <pre>
                    {`
<AIOButton 
    type='select' 
    value='2' 
    options={options} 
    optionBefore='option.icon'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']} optionBefore='option.icon'/>
                <pre>
                    {`
<AIOButton 
    type='multiselect' 
    text='text example' 
    options={options} 
    value={['1','3']} 
    optionBefore='option.icon'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
            </div>
        )
    }
}

class OptionAfter extends Component{
    render(){
        let options = [
            {text:'option1',value:'1',type:'type1',icon:<Icon path={mdiAccount} size={0.7}/>},
            {text:'option2',value:'2',type:'type2',icon:<Icon path={mdiAccount} size={0.7}/>},
            {text:'option3',value:'3',type:'type3',icon:<Icon path={mdiAccount} size={0.7}/>}
        ]
        return (
            <div style={{padding:12,width:'100%',overflowY:'auto'}}>
                <pre>
                    {`
let options = [
    {text:'option1',value:'1',type:'type1',icon:<Icon path={mdiAccount} size={0.7}/>},
    {text:'option2',value:'2',type:'type2',icon:<Icon path={mdiAccount} size={0.7}/>},
    {text:'option3',value:'3',type:'type3',icon:<Icon path={mdiAccount} size={0.7}/>},
];
                    `}
                </pre>
                <div className="aio-component-label">tabs</div>
                <AIOButton type='tabs' text='text example' options={options} value={'1'} optionAfter='option.icon'/>
                <pre>
                    {`
<AIOButton 
    type='tabs' 
    text='text example' 
    options={options} 
    value={'1'} 
    optionSubtext='option.icon'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options} optionAfter='option.icon'/>
                <pre>
                    {`
<AIOButton 
    type='select' 
    value='2' 
    options={options} 
    optionSubtext='option.icon'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']} optionAfter='option.icon'/>
                <pre>
                    {`
<AIOButton 
    type='multiselect' 
    text='text example' 
    options={options} 
    value={['1','3']} 
    optionSubtext='option.icon'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">radio</div>
                <AIOButton type='radio' text='text example' options={options} value={'2'} optionAfter='option.icon'/>
                <pre>
                    {`
<AIOButton 
    type='radio' 
    text='text example' 
    options={options} 
    value={'2'} 
    optionSubtext='option.icon'
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
            </div>
        )
    }
}

class OptionStyle extends Component{
    render(){
        let options = [
            {text:'option1',value:'1'},
            {text:'option2',value:'2'},
            {text:'option3',value:'3'}
        ]
        return (
            <div style={{padding:12,width:'100%',overflowY:'auto'}}>
                <div className="aio-component-label">tabs</div>
                <AIOButton type='tabs' text='text example' options={options} value={'1'} optionStyle={{color:'red'}}/>
                <pre>
                    {`
<AIOButton 
    type='tabs' 
    text='text example' 
    options={[
        {text:'option1',value:'1'},
        {text:'option2',value:'2'},
        {text:'option3',value:'3'}
    ]} 
    value={'1'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">select</div>
                <AIOButton type='select' value='2' options={options} optionStyle={{color:'red'}}/>
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
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">multiselect</div>
                <AIOButton type='multiselect' text='text example' options={options} value={['1','3']} optionStyle={{color:'red'}}/>
                <pre>
                    {`
<AIOButton 
    type='multiselect' 
    text='text example' 
    options={[
        {text:'option1',value:'1'},
        {text:'option2',value:'2'},
        {text:'option3',value:'3'}
    ]} 
    value={['1','3']} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">radio</div>
                <AIOButton type='radio' text='text example' options={options} value={'2'} optionStyle={{color:'red'}}/>
                <pre>
                    {`
<AIOButton 
    type='radio' 
    text='text example' 
    options={[
        {text:'option1',value:'1'},
        {text:'option2',value:'2'},
        {text:'option3',value:'3'}
    ]} 
    value={'2'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
                
                <div className="aio-component-label">checklist</div>
                <AIOButton type='checklist' options={options} value={'2'} optionStyle={{color:'red'}}/>
                <pre>
                    {`
<AIOButton 
    type='checklist' 
    options={[
        {text:'option1',value:'1'},
        {text:'option2',value:'2'},
        {text:'option3',value:'3'}
    ]} 
    value={'2'} 
/>
                    `}    
                </pre>
                <div className='aio-component-splitter'></div>
    
                <div className="aio-component-label">checklist</div>
                <AIOButton type='checklist' options={options} value={'2'} optionStyle={{color:'red'}}/>
                <pre>
                    {`
<AIOButton 
    type='checklist' 
    options={[
        {text:'option1',value:'1'},
        {text:'option2',value:'2'},
        {text:'option3',value:'3'}
    ]}
    value={'2'} 
    optionStyle={{color:'red'}}
/>
                    `}    
                </pre>
                
            </div>
        )
    }
}