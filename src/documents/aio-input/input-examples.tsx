import React, { FC, useState } from "react"
import { mdiAccount, mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiChevronDoubleDown, mdiMinusThick, mdiPlusThick } from "@mdi/js"
import {Icon} from "@mdi/react"
import AIOInput from "../../npm/aio-input";
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import { Storage } from "../../npm/aio-utils";
import RVD from '../../npm/react-virtual-dom/index';
type I_exampleType = 'text' | 'number' | 'textarea' | 'password' | 'checkbox' | 'date' | 'image' | 'time' | 'file'
const textOptions = [
    {name:'john',id:'1',gender:'male',color:'#ff0000'},
    {name:'stephan',id:'2',gender:'male',color:'#ffa500'},
    {name:'edvard',id:'3',gender:'male',color:'#ffff00'},
    {name:'luis',id:'4',gender:'male',color:'#9acd32'},
    {name:'carlos',id:'5',gender:'male',color:'#90ee90'},
    {name:'kate',id:'6',gender:'female',color:'#008000'},
    {name:'fernando',id:'7',gender:'male',color:'#add8e6'},
    {name:'mark',id:'8',gender:'male',color:'#1e90ff'},
    {name:'nicol',id:'9',gender:'female',color:'#0000ff'},
    {name:'lisa',id:'10',gender:'female',color:'#a52a2a'},
    {name:'lucas',id:'11',gender:'male',color:'#000000'},
    {name:'maria',id:'12',gender:'female',color:'#ffc0cb'}
]
const numberOptions = [
    '4234534534','3453463453','345345345345','345346456345','345343647','45645345','423434646','3456354567','75645463','534645457','345345345'
]
const numberOptionsCode = `[
    '4234534534','3453463453','345345345345','345346456345','345343647','45645345','423434646','3456354567','75645463','534645457','345345345'
]`
const textOptionsCode = `[
    {name:'john',id:'1',gender:'male',color:'#ff0000'},
    {name:'stephan',id:'2',gender:'male',color:'#ffa500'},
    {name:'edvard',id:'3',gender:'male',color:'#ffff00'},
    {name:'luis',id:'4',gender:'male',color:'#9acd32'},
    {name:'carlos',id:'5',gender:'male',color:'#90ee90'},
    {name:'kate',id:'6',gender:'female',color:'#008000'},
    {name:'fernando',id:'7',gender:'male',color:'#add8e6'},
    {name:'mark',id:'8',gender:'male',color:'#1e90ff'},
    {name:'nicol',id:'9',gender:'female',color:'#0000ff'},
    {name:'lisa',id:'10',gender:'female',color:'#a52a2a'},
    {name:'lucas',id:'11',gender:'male',color:'#000000'},
    {name:'maria',id:'12',gender:'female',color:'#ffc0cb'}
]`
const TextExamples:FC<{type:I_exampleType}> = ({type}) => {
    let [examples] = useState<any>([
        ['placeholder',()=><Placeholder type={type}/>],
        ['before',()=><Before type={type}/>],
        ['after',()=><After type={type}/>],
        ['subtext',()=><Subtext type={type}/>],
        ['disabled',()=><Disabled type={type}/>],
        ['loading',()=><Loading type={type}/>],
        ['justify',()=><Justify type={type}/>],
        ['inputAttrs',()=><InputAttrs type={type}/>,['text','number','textarea','password','file'].indexOf(type) !== -1],
        ['justNumber (boolean)',()=><JustNumber type={type}/>,['text','textarea','password'].indexOf(type) !== -1],
        ['justNumber (array)',()=><JustNumberArray type={type}/>,['text','textarea','password'].indexOf(type) !== -1],
        ['filter',()=><Filter type={type}/>,['text','textarea','password'].indexOf(type) !== -1],
        ['maxLength',()=><MaxLength type={type}/>,['text','number','textarea','password','file'].indexOf(type) !== -1],
        ['min',()=><Min type={type}/>,['number'].indexOf(type) !== -1],
        ['max',()=><Max type={type}/>,['number'].indexOf(type) !== -1],
        ['swip',()=><Swip type={type}/>,['number'].indexOf(type) !== -1],
        ['spin',()=><Spin type={type}/>,['number'].indexOf(type) !== -1],
        ['unit (month)',()=><Unit type={type} props={{unit:'month'}} propsCode={`unit='month'`}/>,['date'].indexOf(type) !== -1],
        ['unit (hour)',()=><Unit type={type} props={{unit:'hour'}} propsCode={`unit='hour'`}/>,['date'].indexOf(type) !== -1],
        ['unit (year month day)',()=><Unit type={type} props={{unit:{year:true,month:true,day:true}}} propsCode={`unit={{year:true,month:true,day:true}}`}/>,['date','time'].indexOf(type) !== -1],
        ['unit (hour minute second)',()=><Unit type={type} props={{unit:{hour:true,minute:true,second:true}}} propsCode={`unit={{hour:true,minute:true,second:true}}`}/>,['date','time'].indexOf(type) !== -1],
        ['size',()=><Size type={type}/>,['date'].indexOf(type) !== -1],
        ['theme',()=><Theme type={type}/>,['date'].indexOf(type) !== -1],
        ['caret (false)',()=><CaretFalse type={type}/>,['date','time'].indexOf(type) !== -1],
        ['caret (html)',()=><CaretHtml type={type}/>,['date','time'].indexOf(type) !== -1],
        ...getDateAttrsExamples(type),
        ['jalali',()=><Jalali type={type}/>,['date','time'].indexOf(type) !== -1],
        ['option.close',()=><DateOptionClose type={type}/>,['date'].indexOf(type) !== -1],
        ['image value',()=><Image type={type}/>,['image'].indexOf(type) !== -1],
        ['width',()=><Width type={type}/>,['image'].indexOf(type) !== -1],
        ['height',()=><Height type={type}/>,['image'].indexOf(type) !== -1],
        ['width and height',()=><WidthHeight type={type}/>,['image'].indexOf(type) !== -1],
        ['deSelect (true)',()=><DeSelectTrue type={type}/>,['date','image'].indexOf(type) !== -1],
        ['deSelect (function)',()=><DeSelectFunction type={type}/>,['date','image'].indexOf(type) !== -1],
        ['preview',()=><Preview type={type}/>,['password','image','file'].indexOf(type) !== -1],
        ['text',()=><Text type={type}/>,['checkbox','date','time','file'].indexOf(type) !== -1],
        ['pattern',()=><Pattern type={type}/>,['date','time'].indexOf(type) !== -1],
        ['checkIcon (array)',()=><CheckIconArray type={type}/>,['checkbox'].indexOf(type) !== -1],
        ['checkIcon (css object)',()=><CheckIconObject type={type}/>,['checkbox'].indexOf(type) !== -1],
        ['options',()=><Options type={type}/>,['text','number'].indexOf(type) !== -1],
        [
            'caret (false)',
            ()=>(
                <Options 
                    type={type} 
                    props={{caret:false}}
                    propsCode={
    `caret={false}`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'caret (html)',
            ()=>(
                <Options 
                    type={type} 
                    props={{caret:<Icon path={mdiChevronDoubleDown} size={.7}/>}}
                    propsCode={
    `caret={<Icon path={mdiChevronDoubleDown} size={.7}/>}`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'option.before',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        before:()=><Icon path={mdiAccount} size={0.8}/>
                    }}
                    optionCode={
`before:()=><Icon path={mdiAccount} size={0.8}/>`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'option.after',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        after:()=><div className='badge'>12</div>
                    }}
                    optionCode={
`after:()=><div className='badge'>12</div>`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'option.subtext',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        subtext:()=>'this is my subtext'
                    }}
                    optionCode={
`subtext:()=>'this is my subtext'`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'option.close',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        close:()=>false
                    }}
                    optionCode={
`close:()=>false`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'option.attrs',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        attrs:()=>{
                            return {
                                style:{background:'lightblue'}
                            }
                        }
                    }}
                    optionCode={
`attrs:()=>{
    return {
        style:{background:'lightblue'}
    }
}`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'option.className',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        className:()=>'my-option'
                    }}
                    optionCode={
`className:()=>'my-option'`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'option.style',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        style:()=>{
                            return {
                                background:'lightblue'
                            }
                        }
                    }}
                    optionCode={
`style:()=>{
    return {
        background:'lightblue'
    }
}`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'option.show',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        show:(option:any)=>option.gender !== 'male'
                    }}
                    optionCode={
`show:(option:any)=>option.gender !== 'male'`
                    }
                />
            ),
            ['text'].indexOf(type) !== -1
        ],
        [
            'option.show',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        show:(option:any)=>option !== '3453463453'
                    }}
                    optionCode={
`show:(option:any)=>option !== '3453463453'`
                    }
                />
            ),
            ['number'].indexOf(type) !== -1
        ],
        [
            'option.checked',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        checked:(option:any,details:any)=>(type === 'text'?option.name:+option) === details.value,
                        checkIcon:()=>[
                            <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd'/>,
                            <Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff'/>
                        ]
                    }}
                    optionCode={
        `checked:(option:any,details:any)=>${type === 'number'?'+':''}option${type === 'text'?'.name':''} === details.value
        checkIcon:()=>[
            <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd'/>,
            <Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff'/>
        ]`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'option.disabled',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        disabled:(option:any)=>type === 'text'?option.gender === 'male':+option < 100000000
                    }}
                    optionCode={
        `disabled:(option:any)=>${type === 'text'?"option.gender === 'male'":"+option < 100000000"}`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'option.onClick',
            ()=>(
                <Options 
                    type={type} 
                    option={{
                        onClick:(option:any)=>alert(JSON.stringify(option))
                    }}
                    optionCode={
        `onClick:(option:any)=>alert(JSON.stringify(option))`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'popover',
            ()=>(
                <Options 
                    type={type} 
                    props={{
                        popover:{
                            position:'center',
                            attrs:{
                                style:{
                                    background:'#f2f2f2',
                                    minWidth:240
                                }
                            },
                            backdrop:{
                                attrs:{
                                    style:{
                                        background:'rgba(0,0,0,0.8)'
                                    }
                                }
                            }
                        }
                    }}
                    propsCode={
            `popover={{
                position:'center',
                attrs:{
                    style:{
                        background:'#f2f2f2',
                        minWidth:240
                    }
                },
                backdrop:{
                    attrs:{
                        style:{
                            background:'rgba(0,0,0,0.8)'
                        }
                    }
                }
            }}`
                    }
                />
            ),
            ['text','number'].indexOf(type) !== -1
        ],
        [
            'popover',
            ()=>(<DateAndTimePopover type={type}/>),
            ['date','time'].indexOf(type) !== -1
        ],
        
    ])



    let [titles] = useState<string[]>(getTitles)
    function getTitles(){
        let res = ['all'];
        for(let i = 0; i < examples.length; i++){
            let ex = examples[i];
            if(ex[2] !== false){res.push(ex[0])}
        }
        return res
    }
    let [setting,SetSetting] = useState<any>(new Storage(`${type}examplessetting`).load('setting',{
        show:-1
    }))
    function setSetting(setting:any){
        new Storage(`${type}examplessetting`).save('setting',setting)
        SetSetting(setting)
    }
    function changeShow(dir: 1 | -1 ){
        let index = titles.indexOf(setting.show) + dir
        if(index < 0){index = titles.length - 1 }
        if(index > titles.length - 1){index = 0}
        setSetting({...setting,show:titles[index]})
    }
    function setting_node(){
        let btnstyle = {background:'none',border:'none'}
        return {
            className:'p-12',
            html:(
                <AIOInput
                    type='form'
                    value={{...setting}}
                    onChange={(newSetting)=>setSetting({...newSetting})}
                    inputs={{
                        row:[
                            {flex:1},
                            {
                                input:{
                                    type:'select',options:titles,before:'Show:',
                                    option:{
                                        text:'option',
                                        value:'option'
                                    },
                                    popover:{
                                        maxHeight:'100vh'
                                    }
                                },
                                field:'value.show'
                            },
                            {className:'align-vh',html:<button type='button' style={btnstyle} onClick={()=>changeShow(-1)}><Icon path={mdiMinusThick} size={1}/></button>},
                            {className:'align-vh',html:<button type='button' style={btnstyle} onClick={()=>changeShow(1)}><Icon path={mdiPlusThick} size={1}/></button>}
                        ]
                    }}
                />
            )
        }
    }
    function render_node(){
        return {
            key:JSON.stringify(setting),
            className:'ofy-auto flex-1 p-12',
            column:examples.map((o:any,i:number)=>{
                let [title,COMP,cond,description] = o;
                if(cond === false){return {}}
                if(setting.show !== 'all' && setting.show !== title){return {}}
                return {
                    html:(
                        <div className='w-100'>
                            <h3>{`${i} - ${title}`}</h3>
                            {description && <h5>{description}</h5>}
                            {COMP()}
                        </div>
                    )
                }
            })
        }
    }
    return (<RVD rootNode={{className:'h-100',column:[setting_node(),render_node()]}}/>)   
}
export default TextExamples
const Placeholder:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                key={type}
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                placeholder='my placeholder'
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    placeholder='my placeholder'
/>
        `)}
        </div> 
    )
}
const Before:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                key={type}
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                before={<Icon path={mdiAccount} size={0.8}/>}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    before={<Icon path={mdiAccount} size={0.8}/>}
/>
        `)}
        </div> 
    )
}
const After:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                key={type}
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                after={<div className='badge'>{12}</div>}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    after={<div className='badge'>{12}</div>}
/>
        `)}
        </div> 
    )
}
const Subtext:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                key={type}
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                style={type === 'textarea'?undefined:{height:60}}
                subtext='My subtext'
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    ${type !== 'textarea'?'style={{height:60}}':''}
    subtext='My subtext'
/>
        `)}
        </div> 
    )
}
const Disabled:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                disabled={true} 
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    disabled={true}
/>
        `)}
        </div> 
    )
}
const Loading:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                loading={true}  
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    loading={true}
/>
        `)}
        </div> 
    )
}
const Justify:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                justify={true}  
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    justify={true}  
/>
        `)}
        </div> 
    )
}
const InputAttrs:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            {
                type === 'file' &&
                <ul>
                    <li>A valid case-insensitive filename extension, starting with a period (".") character. For example: .jpg, .pdf, or .doc.</li>
                    <li>A valid MIME type string, with no extensions.</li>
                    <li>The string audio/* meaning "any audio file".</li>
                    <li>The string video/* meaning "any video file".</li>
                    <li>The string image/* meaning "any image file".</li>
                </ul>
            }
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                inputAttrs={
                    type === 'file'?{accept:'.jpg'}:{style:{letterSpacing:16}}   
                }
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    inputAttrs={{${type === 'file'?"accept:'.jpg'":"style:{letterSpacing:16}"}}}
/>
        `)}
        </div> 
    )
}
const JustNumber:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                justNumber={true}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    justNumber={true}
/>
        `)}
        </div> 
    )
}
const JustNumberArray:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                justNumber={['-']}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    justNumber={['-']}
/>
        `)}
        </div> 
    )
}
const Filter:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                filter={['a','b','c']}   
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    filter={['a','b','c']}
/>
        `)}
        </div> 
    )
}
const MaxLength:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                multiple={type === 'file'}
                maxLength={6}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    maxLength={6}
    ${type === 'file'?'multiple={true}':''}
/>
        `)}
        </div> 
    )
}
const Min:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                min={8}      
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}

/>
        `)}
        </div> 
    )
}
const Max:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                max={12}      
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}

/>
        `)}
        </div> 
    )
}
const Swip:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                swip={1}     
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    swip={true}
/>
        `)}
        </div> 
    )
}
const Spin:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                spin={false}     
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    spin={false}     
/>
        `)}
        </div> 
    )
}
const Unit:FC<{type:I_exampleType,props:any,propsCode:string}> = ({type,props,propsCode})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                {...props}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    ${propsCode}
/>
        `)}
        </div> 
    )
}
const Jalali:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                unit={type === 'date'?'day':{year:true,month:true,day:true}}
                jalali={true}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    unit={${type === 'date'?'"day"':'{year:true,month:true,day:true}'}}
    jalali={true}
/>
        `)}
        </div> 
    )
}
const DateOptionClose:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                option={{close:()=>true}}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    unit={${type === 'date'?'"day"':'{year:true,month:true,day:true}'}}
    jalali={true}
/>
        `)}
        </div> 
    )
}
const Image:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<string>('https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg')
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
/>
        `)}
        </div> 
    )
}
const Width:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                width={120}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    width={120}
/>
        `)}
        </div> 
    )
}
const Height:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                height={200}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    height={200}
/>
        `)}
        </div> 
    )
}
const WidthHeight:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                width={200}
                height={200}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    width={200}
    height={200}
/>
        `)}
        </div> 
    )
}
const DeSelectTrue:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                deSelect={true}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    width={200}
    deSelect={true}
/>
        `)}
        </div> 
    )
}
const DeSelectFunction:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                deSelect={()=>setValue(undefined)}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    deSelect={()=>setValue(undefined)}
/>
        `)}
        </div> 
    )
}
const Size:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                size={120}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    size={120}
/>
        `)}
        </div> 
    )
}
const Theme:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                theme={['lightblue','#666']}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    theme={['lightblue','#666']}
/>
        `)}
        </div> 
    )
}
const CaretFalse:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                caret={false}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    caret={false}
/>
        `)}
        </div> 
    )
}
const CaretHtml:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                caret={<Icon path={mdiChevronDoubleDown} size={.7}/>}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    caret={<Icon path={mdiChevronDoubleDown} size={.7}/>}
/>
        `)}
        </div> 
    )
}
const Preview:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                preview={true}   
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    preview={true}
/>
        `)}
        </div> 
    )
}
const Text:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                text='My Text'
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    text='My Text'
/>
        `)}
        </div> 
    )
}
const Pattern:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                pattern='{weekDay} {day} {monthString} {year}'
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    pattern='{weekDay} {day} {monthString} {year}'
/>
        `)}
        </div> 
    )
}
const CheckIconArray:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                checkIcon={[
                    <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd'/>,
                    <Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff'/>
                ]}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    checkIcon={[
        <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd'/>,
        <Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff'/>
    ]}
/>
        `)}
        </div> 
    )
}
const CheckIconObject:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                checkIcon={{background:'orange',borderRadius:4,border:'1px solid orange',width:16,height:16,padding:2}}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    checkIcon={{background:'orange',borderRadius:4,border:'1px solid orange',width:16,height:16,padding:2}}
/>
        `)}
        </div> 
    )
}
const Options:FC<{type:I_exampleType,option?:any,optionCode?:string,props?:any,propsCode?:string}> = ({type,option = {},optionCode,props = {},propsCode})=>{
    if(type === 'text'){return <OptionsText option={option} optionCode={optionCode} props={props} propsCode={propsCode}/>}
    if(type === 'number'){return <OptionsNumber option={option} optionCode={optionCode} props={props} propsCode={propsCode}/>}
    return null
}
const OptionsText:FC<{option?:any,optionCode?:string,props?:any,propsCode?:string}> = ({option = {},optionCode,props,propsCode})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='text' value={value}
                onChange={(newValue)=>setValue(newValue)}
                options={textOptions}   
                option={{
                    text:'option.name',
                    value:'option.id',
                    onClick:(option:any)=>setValue(option.name),
                    ...option
                }}
                {...props}

            />
        {AIODoc().Code(`
<AIOInput
    type='text' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    ${textOptionsCode}
    option={{
        text:'option.name',
        value:'option.id',
        onClick:(option:any)=>setValue(option.name),
        ${optionCode || ''}
    }}
    ${propsCode || ''}
/>
        `)}
        </div> 
    )
}
 
const OptionsNumber:FC<{option?:any,optionCode?:string,props?:any,propsCode?:string}> = ({option = {},optionCode,props,propsCode})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='number' value={value}
                onChange={(newValue)=>setValue(newValue)}
                options={numberOptions}   
                option={{
                    text:'option',
                    value:'option',
                    onClick:(option:any)=>setValue(+option),
                    ...option
                }}
                {...props}
            />
        {AIODoc().Code(`
<AIOInput
    type='number' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    ${numberOptionsCode}
    option={{
        text:'option',
        value:'option',
        onClick:(option:any)=>setValue(+option),
        ${optionCode || ''}
    }}
    ${propsCode || ''}
/>
        `)}
        </div> 
    )
}
const DateAndTimePopover:FC<{type:I_exampleType}> = ({type})=> {
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue)=>setValue(newValue)}
                popover={{
                    position:'center',
                    attrs:{
                        style:{
                            background:'#f2f2f2',
                            minWidth:240
                        }
                    },
                    backdrop:{
                        attrs:{
                            style:{
                                background:'rgba(0,0,0,0.8)'
                            }
                        }
                    }
                }}
            />
        {AIODoc().Code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    popover={{
        position:'center',
        attrs:{
            style:{
                background:'#f2f2f2',
                minWidth:240
            }
        },
        backdrop:{
            attrs:{
                style:{
                    background:'rgba(0,0,0,0.8)'
                }
            }
        }
    }}
/>
        `)}
        </div> 
    )
}
function getDateAttrsExamples(type:I_exampleType){
    if(type !== 'date'){return []}
    let list = [
        ["<>,2022,2024",'disabled all dates between 2022 and 2024'],
        ["<=>,2022,2024",'disabled all dates between and equal 2022 and 2024'],
        ["!<>,2022,2024",'disabled all dates that is not between 2022 and 2024'],
        ["!<=>,2022,2024",'disabled all dates that is not between and equal 2022 and 2024'],
        ["=,2022/4/5,2022/6/7,2022/8/12",'disabled this dates => 2022/4/5,2022/6/7,2022/8/12'],
        ["!=,2022/4/5",'disabled all dates exept 2022/4/5'],
        [">,2022/4/5",'disabled all dates after 2022/4/5'],
        [">=,2022/4/5",'disabled 2022/4/5 and all dates after 2022/4/5'],
        ["<,2022/4/5",'disabled all dates before 2022/4/5'],
        ["<=,2022/4/5",'disabled 2022/4/5 and all dates before 2022/4/5'],
        ["w,6,4",'disabled all 4th and 6th weekdays (index from 0)'],
        ["!w,6",'disabled all days that is not 6th weekdays (index from 0)'],
    ];
    let res = list.map(([selector,description])=>[`dateAttrs (selector:'${selector}')`,()=><DateAttrs selector={selector}/>,true,description])
    return [
        [
            'dateAttrs (isToday)',
            ()=><DateAttrsIsToday/>,
            true,
            'set background of today element'
        ],
        [
            'dateAttrs (isActive)',
            ()=><DateAttrsIsActive/>,
            true,
            'set background of active element'
        ],

        ...res
    ]
}

const DateAttrs:FC<{selector:string}> = ({selector})=>{
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='date' value={value}
                onChange={(newValue)=>setValue(newValue)}
                dateAttrs={({dateArray,isMatch})=>{
                    if(isMatch([selector])){
                        return {disabled:true}
                    }
                }}
            />
        {AIODoc().Code(`
<AIOInput
    type='date' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    dateAttrs={({isMatch})=>{
        if(isMatch([${selector}])){
            return {disabled:true}
        }
    }}
/>
        `)}
        </div> 
    )
}
const DateAttrsIsToday:FC = ()=>{
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='date' value={value}
                onChange={(newValue)=>setValue(newValue)}
                dateAttrs={({isToday})=>{
                    if(isToday){
                        return {
                            style:{background:'orange'}
                        }
                    }
                }}
            />
        {AIODoc().Code(`
<AIOInput
    type='date' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    dateAttrs={({isToday})=>{
        if(isToday){
            return {
                style:{background:'orange'}
            }
        }
    }}
/>
        `)}
        </div> 
    )
}
const DateAttrsIsActive:FC = ()=>{
    const [value,setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='date' value={value}
                onChange={(newValue)=>setValue(newValue)}
                dateAttrs={({isActive})=>{
                    if(isActive){
                        return {
                            style:{background:'orange'}
                        }
                    }
                }}
            />
        {AIODoc().Code(`
<AIOInput
    type='date' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    dateAttrs={({isActive})=>{
        if(isActive){
            return {
                style:{background:'orange'}
            }
        }
    }}
/>
        `)}
        </div> 
    )
}