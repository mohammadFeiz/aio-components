import React, { FC, createContext, useContext, useRef, useState } from "react"
import { mdiAccount, mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiChevronDoubleDown, mdiMinusThick, mdiPlusThick } from "@mdi/js"
import { Icon } from "@mdi/react"
import AIOInput from "../../npm/aio-input";
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import { Storage } from "../../npm/aio-utils";
import RVD from '../../npm/react-virtual-dom/index';
import { AI } from "../../npm/aio-input/types";
type I_exampleType = 'text' | 'number' | 'textarea' | 'password' | 'checkbox' | 'date' | 'image' | 'time' | 'file'
const textOptions = [
    { name: 'john', id: '1', gender: 'male', color: '#ff0000' },
    { name: 'stephan', id: '2', gender: 'male', color: '#ffa500' },
    { name: 'edvard', id: '3', gender: 'male', color: '#ffff00' },
    { name: 'luis', id: '4', gender: 'male', color: '#9acd32' },
    { name: 'carlos', id: '5', gender: 'male', color: '#90ee90' },
    { name: 'kate', id: '6', gender: 'female', color: '#008000' },
    { name: 'fernando', id: '7', gender: 'male', color: '#add8e6' },
    { name: 'mark', id: '8', gender: 'male', color: '#1e90ff' },
    { name: 'nicol', id: '9', gender: 'female', color: '#0000ff' },
    { name: 'lisa', id: '10', gender: 'female', color: '#a52a2a' },
    { name: 'lucas', id: '11', gender: 'male', color: '#000000' },
    { name: 'maria', id: '12', gender: 'female', color: '#ffc0cb' }
]
const numberOptions = [
    '4234534534', '3453463453', '345345345345', '345346456345', '345343647', '45645345', '423434646', '3456354567', '75645463', '534645457', '345345345'
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
type I_setting = { show: string, showCode: boolean }
type I_CTX = { setting: I_setting, type: I_exampleType, code: (code: string) => React.ReactNode }
const CTX = createContext({} as any);
const InputExamples: FC<{ type: I_exampleType }> = ({ type }) => {
    let [examples] = useState<any>([
        ['placeholder', () => <Placeholder />],
        ['msk', () => <Mask />],
        ['before', () => <Before />],
        ['after', () => <After />],
        ['subtext', () => <Subtext />],
        ['disabled', () => <Disabled />],
        ['loading', () => <Loading />],
        ['justify', () => <Justify />],
        ['inputAttrs', () => <InputAttrs />, ['text', 'number', 'textarea', 'password', 'file'].indexOf(type) !== -1],
        ['justNumber (boolean)', () => <JustNumber />, ['text', 'textarea', 'password'].indexOf(type) !== -1],
        ['justNumber (array)', () => <JustNumberArray />, ['text', 'textarea', 'password'].indexOf(type) !== -1],
        ['filter', () => <Filter />, ['text', 'textarea', 'password'].indexOf(type) !== -1],
        ['maxLength', () => <MaxLength />, ['text', 'number', 'textarea', 'password', 'file'].indexOf(type) !== -1],
        ['min', () => <Min />, ['number'].indexOf(type) !== -1],
        ['max', () => <Max />, ['number'].indexOf(type) !== -1],
        ['swip', () => <Swip />, ['number'].indexOf(type) !== -1],
        ['spin', () => <Spin />, ['number'].indexOf(type) !== -1],
        ['unit (month)', () => <Unit props={{ unit: 'month' }} propsCode={`unit='month'`} />, ['date'].indexOf(type) !== -1],
        ['unit (hour)', () => <Unit props={{ unit: 'hour' }} propsCode={`unit='hour'`} />, ['date'].indexOf(type) !== -1],
        ['unit (year month day)', () => <Unit props={{ unit: { year: true, month: true, day: true } }} propsCode={`unit={{year:true,month:true,day:true}}`} />, ['date', 'time'].indexOf(type) !== -1],
        ['unit (hour minute second)', () => <Unit props={{ unit: { hour: true, minute: true, second: true } }} propsCode={`unit={{hour:true,minute:true,second:true}}`} />, ['date', 'time'].indexOf(type) !== -1],
        ['size', () => <Size />, ['date'].indexOf(type) !== -1],
        ['theme', () => <Theme />, ['date'].indexOf(type) !== -1],
        ['caret (false)', () => <CaretFalse />, ['date', 'time'].indexOf(type) !== -1],
        ['caret (html)', () => <CaretHtml />, ['date', 'time'].indexOf(type) !== -1],
        ...getDateAttrsExamples(type),
        ['jalali', () => <Jalali />, ['date', 'time'].indexOf(type) !== -1],
        ['option.close', () => <DateOptionClose />, ['date'].indexOf(type) !== -1],
        ['image value', () => <Image />, ['image'].indexOf(type) !== -1],
        ['width', () => <Width />, ['image'].indexOf(type) !== -1],
        ['height', () => <Height />, ['image'].indexOf(type) !== -1],
        ['width and height', () => <WidthHeight />, ['image'].indexOf(type) !== -1],
        ['deSelect (true)', () => <DeSelectTrue />, ['date', 'image'].indexOf(type) !== -1],
        ['deSelect (function)', () => <DeSelectFunction />, ['date', 'image'].indexOf(type) !== -1],
        ['preview', () => <Preview />, ['password', 'image', 'file'].indexOf(type) !== -1],
        ['text', () => <Text />, ['checkbox', 'date', 'time', 'file'].indexOf(type) !== -1],
        ['pattern', () => <Pattern />, ['date', 'time'].indexOf(type) !== -1],
        ['multiple', () => <Multiple />, ['date', 'file'].indexOf(type) !== -1],
        ['checkIcon (array)', () => <CheckIconArray />, ['checkbox'].indexOf(type) !== -1],
        ['checkIcon (css object)', () => <CheckIconObject />, ['checkbox'].indexOf(type) !== -1],
        ['options', () => <Options />, ['text', 'number'].indexOf(type) !== -1],
        [
            'caret (false)',
            () => (
                <Options
                    props={{ type,caret: false }}
                    propsCode={
                        `caret={false}`
                    }
                />
            ),
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'caret (html)',
            () => (
                <Options
                    props={{ type,caret: <Icon path={mdiChevronDoubleDown} size={.7} /> }}
                    propsCode={
                        `caret={<Icon path={mdiChevronDoubleDown} size={.7}/>}`
                    }
                />
            ),
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'option.before',
            () => (
                <Options
                    option={{
                        before: () => <Icon path={mdiAccount} size={0.8} />
                    }}
                    optionCode={
                        `before:()=><Icon path={mdiAccount} size={0.8}/>`
                    }
                />
            ),
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'option.after',
            () => (
                <Options
                    option={{
                        after: () => <div className='badge'>12</div>
                    }}
                    optionCode={
                        `after:()=><div className='badge'>12</div>`
                    }
                />
            ),
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'option.subtext',
            () => (
                <Options
                    option={{
                        subtext: () => 'this is my subtext'
                    }}
                    optionCode={
                        `subtext:()=>'this is my subtext'`
                    }
                />
            ),
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'option.close',
            () => (
                <Options
                    option={{
                        close: () => false
                    }}
                    optionCode={
                        `close:()=>false`
                    }
                />
            ),
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'option.attrs',
            () => (
                <Options
                    option={{
                        attrs: () => {
                            return {
                                style: { background: 'lightblue' }
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
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'option.className',
            () => (
                <Options
                    option={{
                        className: () => 'my-option'
                    }}
                    optionCode={
                        `className:()=>'my-option'`
                    }
                />
            ),
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'option.style',
            () => (
                <Options
                    option={{
                        style: () => {
                            return {
                                background: 'lightblue'
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
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'option.show',
            () => (
                <Options
                    option={{
                        show: (option: any) => option.gender !== 'male'
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
            () => (
                <Options
                    option={{
                        show: (option: any) => option !== '3453463453'
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
            () => (
                <Options
                    option={{
                        checked: (option: any, details: any) => (type === 'text' ? option.name : +option) === details.value,
                        checkIcon: () => [
                            <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd' />,
                            <Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff' />
                        ]
                    }}
                    optionCode={
                        `checked:(option:any,details:any)=>${type === 'number' ? '+' : ''}option${type === 'text' ? '.name' : ''} === details.value
        checkIcon:()=>[
            <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd'/>,
            <Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff'/>
        ]`
                    }
                />
            ),
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'option.disabled',
            () => (
                <Options
                    option={{
                        disabled: (option: any) => type === 'text' ? option.gender === 'male' : +option < 100000000
                    }}
                    optionCode={
                        `disabled:(option:any)=>${type === 'text' ? "option.gender === 'male'" : "+option < 100000000"}`
                    }
                />
            ),
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'option.onClick',
            () => (
                <Options
                    option={{
                        onClick: (option: any) => alert(JSON.stringify(option))
                    }}
                    optionCode={
                        `onClick:(option:any)=>alert(JSON.stringify(option))`
                    }
                />
            ),
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'popover',
            () => (
                <Options
                    props={{
                        type,
                        popover: {
                            position: 'center',
                            setAttrs:(key)=>{
                                if(key === 'backdrop'){
                                    return {
                                        attrs: {
                                            style: {
                                                background: 'rgba(0,0,0,0.8)'
                                            }
                                        }
                                    }
                                }
                                if(key === 'modal'){
                                    return {
                                        style: {
                                            background: '#f2f2f2',
                                            minWidth: 240
                                        }
                                    }
                                }
                            }
                        }
                    }}
                    propsCode={
            `popover: {
                position: 'center',
                setAttrs:(key)=>{
                    if(key === 'backdrop'){
                        return {
                            attrs: {
                                style: {
                                    background: 'rgba(0,0,0,0.8)'
                                }
                            }
                        }
                    }
                    if(key === 'modal'){
                        return {
                            style: {
                                background: '#f2f2f2',
                                minWidth: 240
                            }
                        }
                    }
                }
            }`
                    }
                />
            ),
            ['text', 'number'].indexOf(type) !== -1
        ],
        [
            'popover',
            () => (<DateAndTimePopover />),
            ['date', 'time'].indexOf(type) !== -1
        ],

    ])
    let [titles] = useState<string[]>(getTitles)
    function getTitles() {
        let res = ['all'];
        for (let i = 0; i < examples.length; i++) {
            let ex = examples[i];
            if (ex[2] !== false) { res.push(ex[0]) }
        }
        return res
    }
    let [setting, SetSetting] = useState<I_setting>(new Storage(`${type}examplessetting`).load('setting', {
        show: 'all', showCode: true
    }))
    function setSetting(setting: any) {
        new Storage(`${type}examplessetting`).save('setting', setting)
        SetSetting(setting)
    }
    function changeShow(dir: 1 | -1) {
        let index = titles.indexOf(setting.show) + dir
        if (index < 0) { index = titles.length - 1 }
        if (index > titles.length - 1) { index = 0 }
        setSetting({ ...setting, show: titles[index] })
    }
    function setting_node() {
        let btnstyle = { background: 'none', border: 'none' }
        return {
            className: 'p-12',
            html: (
                <AIOInput
                    type='form'
                    value={{ ...setting }}
                    onChange={(newSetting) => setSetting({ ...newSetting })}
                    node={{
                        dir:'h',
                        childs:[
                            { flex: 1 },
                            {
                                input: {
                                    type: 'checkbox', text: 'Show Code'
                                },
                                field: 'value.showCode'
                            },
                            {
                                input: {
                                    type: 'select', options: titles, before: 'Show:',
                                    option: {
                                        text: 'option',
                                        value: 'option'
                                    },
                                    popover: {
                                        maxHeight: '100vh'
                                    }
                                },
                                field: 'value.show'
                            },
                            { className: 'align-vh', html: <button type='button' style={btnstyle} onClick={() => changeShow(-1)}><Icon path={mdiMinusThick} size={1} /></button> },
                            { className: 'align-vh', html: <button type='button' style={btnstyle} onClick={() => changeShow(1)}><Icon path={mdiPlusThick} size={1} /></button> }
                        ]
                    }}
                />
            )
        }
    }
    function code(code: string) {
        if (setting.showCode === false) { return null }
        return AIODoc().Code(code)
    }
    function render_node() {
        return {
            key: JSON.stringify(setting),
            className: 'ofy-auto flex-1 p-12',
            column: examples.map((o: any, i: number) => {
                let [title, COMP, cond, description] = o;
                if (cond === false) { return {} }
                if (setting.show !== 'all' && setting.show !== title) { return {} }
                return {
                    html: (
                        <div className='w-100' style={{ fontFamily: 'Arial' }}>
                            <h3>{`${i} - ${title}`}</h3>
                            {description && <h5>{description}</h5>}
                            {COMP()}
                        </div>
                    )
                }
            })
        }
    }
    function getContext() {
        let context: I_CTX = { setting, type, code }
        return context;
    }
    return (
        <CTX.Provider value={getContext()}>
            <RVD rootNode={{ className: 'h-100', column: [setting_node(), render_node()] }} />
        </CTX.Provider>
    )
}
export default InputExamples
const Placeholder: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                key={type}
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                placeholder='my placeholder'
            />
            {code(`
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
const Before: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                key={type}
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                before={<Icon path={mdiAccount} size={0.8} />}
            />
            {code(`
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
const Mask: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    let pattern = [
        ['number',4],
        '-',
        ['number',4],
        '-',
        ['number',4],
        '-',
        ['number',4],
        '-',
        ['select',1,['a','b','c','d','e','f']]
    ]
    const [value,setValue] = useState<string>('6219-8610-3353-8751-d')
    const [values, setValues] = useState<string[]>(getValues)
    const valuesRef = useRef(values)
    valuesRef.current = values
    function getValues(){
        let values = [];
        let temp = value
        for (let o of pattern) {
            if(Array.isArray(o)){
                let type = o[0];
                if(type === 'text' || type === 'number'){
                    let length:number = +o[1];
                    values.push(temp.slice(0,length));
                    temp = temp.slice(length,temp.length)
                }
                else if(type === 'select'){
                    let length:number = +o[1];
                    values.push(temp.slice(0,length));
                    temp = temp.slice(length,temp.length)
                }
            }
            else {
                let length = o.length;
                temp = temp.slice(length,temp.length)
            }
        }
        return values

    }
    function SetValue(values:any){
        let temp = ''
        let inputIndex = 0;
        for (let o of pattern) {
            if(Array.isArray(o)){
                let length:number = +o[1];
                let res = values[inputIndex]
                let delta = length - res.length;
                for (let i = 0; i < delta; i++){
                    res = '0' + res
                }
                temp += res;
                inputIndex++
            }
            else {
                temp += o
            }
        }
        setValue(temp)
    }
    function changeValue(value:any,index:number){
        let newValues = valuesRef.current.map((o,j)=>index === j?value:o);
        setValues(newValues);
        SetValue(newValues)

    }
    function getList(){
        let inputIndex = 0;
        return pattern.map((o:any,i)=>{
            let type = o[0];
            let index = inputIndex;
            if(type === 'text' || type === 'number'){
                let length = +o[1];
                let p:AI = {
                    style:{width:length * 10},
                    placeholder:new Array(length).fill('x').join(''),
                    maxLength:length,
                    type:'text',
                    justNumber:type === 'number',
                    value:valuesRef.current[index],
                    onChange:(v:string)=>changeValue(v,index)   
                }
                inputIndex++;
                return <AIOInput {...p}/>
            }
            else if(type === 'select'){
                let options = o[2] as any[];
                let p:AI = {
                    type:'select',
                    style:{width:'fit-content'},
                    options,
                    option:{
                        text:'option',
                        value:'option'
                    },
                    value:valuesRef.current[index],
                    onChange:(v:string)=>changeValue(v,index)    
                }
                inputIndex++;
                return <AIOInput {...p}/>
            }
            else {
                return <div className='aio-input-mask-gap'>{o}</div>
            }
        })
    }
    return (
        <div className='example'>
            <div className='aio-input-mask'>
                {getList()}
            </div>
        </div>
    )
}
const After: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                key={type}
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                after={<div className='badge'>{12}</div>}
            />
            {code(`
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
const Subtext: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                key={type}
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                style={type === 'textarea' ? undefined : { height: 60 }}
                subtext='My subtext'
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    ${type !== 'textarea' ? 'style={{height:60}}' : ''}
    subtext='My subtext'
/>
        `)}
        </div>
    )
}
const Disabled: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                disabled={true}
            />
            {code(`
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
const Loading: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                loading={true}
            />
            {code(`
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
const Justify: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                justify={true}
            />
            {code(`
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
const InputAttrs: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
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
                onChange={(newValue) => setValue(newValue)}
                inputAttrs={
                    type === 'file' ? { accept: '.jpg' } : { style: { letterSpacing: 16 } }
                }
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    inputAttrs={{${type === 'file' ? "accept:'.jpg'" : "style:{letterSpacing:16}"}}}
/>
        `)}
        </div>
    )
}
const JustNumber: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                justNumber={true}
            />
            {code(`
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
const JustNumberArray: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                justNumber={['-']}
            />
            {code(`
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
const Filter: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                filter={['a', 'b', 'c']}
            />
            {code(`
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
const MaxLength: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                multiple={type === 'file'}
                maxLength={6}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    maxLength={6}
    ${type === 'file' ? 'multiple={true}' : ''}
/>
        `)}
        </div>
    )
}
const Min: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                min={8}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}

/>
        `)}
        </div>
    )
}
const Max: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                max={12}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}

/>
        `)}
        </div>
    )
}
const Swip: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                swip={1}
            />
            {code(`
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
const Spin: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                spin={false}
            />
            {code(`
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
const Unit: FC<{ props: any, propsCode: string }> = ({ props, propsCode }) => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                {...props}
            />
            {code(`
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
const Jalali: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example' style={{ fontFamily: 'IRANSans-Light' }}>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                unit={type === 'date' ? 'day' : { year: true, month: true, day: true }}
                jalali={true}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    unit={${type === 'date' ? '"day"' : '{year:true,month:true,day:true}'}}
    jalali={true}
/>
        `)}
        </div>
    )
}
const Multiple: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<any[]>()
    return (
        <div className='example'>
            <AIOInput
                key={type}
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                multiple={true}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    multiple={true}
/>
        `)}
        </div>
    )
}
const DateOptionClose: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                option={{ close: () => true }}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    unit={${type === 'date' ? '"day"' : '{year:true,month:true,day:true}'}}
    jalali={true}
/>
        `)}
        </div>
    )
}
const Image: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<string>('https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg')
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
/>
        `)}
        </div>
    )
}
const Width: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                width={120}
            />
            {code(`
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
const Height: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                height={200}
            />
            {code(`
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
const WidthHeight: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                width={200}
                height={200}
            />
            {code(`
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
const DeSelectTrue: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                deSelect={true}
            />
            {code(`
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
const DeSelectFunction: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                deSelect={() => setValue(undefined)}
            />
            {code(`
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
const Size: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                size={120}
            />
            {code(`
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
const Theme: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                theme={['lightblue', '#666']}
            />
            {code(`
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
const CaretFalse: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                caret={false}
            />
            {code(`
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
const CaretHtml: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                caret={<Icon path={mdiChevronDoubleDown} size={.7} />}
            />
            {code(`
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
const Preview: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                preview={true}
            />
            {code(`
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
const Text: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                text='My Text'
            />
            {code(`
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
const Pattern: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                pattern='{weekDay} {day} {monthString} {year}'
            />
            {code(`
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
const CheckIconArray: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                checkIcon={[
                    <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd' />,
                    <Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff' />
                ]}
            />
            {code(`
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
const CheckIconObject: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                checkIcon={{ background: 'orange', borderRadius: 4, border: '1px solid orange', width: 16, height: 16, padding: 2 }}
            />
            {code(`
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
const Options: FC<{ option?: any, optionCode?: string, props?: AI, propsCode?: string }> = ({ option = {}, optionCode, props = {}, propsCode }) => {
    const { type }: I_CTX = useContext(CTX);
    if (type === 'text') { return <OptionsText option={option} optionCode={optionCode} props={props} propsCode={propsCode} /> }
    if (type === 'number') { return <OptionsNumber option={option} optionCode={optionCode} props={props} propsCode={propsCode} /> }
    return null
}
const OptionsText: FC<{ option?: any, optionCode?: string, props?: any, propsCode?: string }> = ({ option = {}, optionCode, props, propsCode }) => {
    const { code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='text' value={value}
                onChange={(newValue) => setValue(newValue)}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id',
                    onClick: (option: any) => setValue(option.name),
                    ...option
                }}
                {...props}

            />
            {code(`
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

const OptionsNumber: FC<{ option?: any, optionCode?: string, props?: any, propsCode?: string }> = ({ option = {}, optionCode, props, propsCode }) => {
    const { code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='number' value={value}
                onChange={(newValue) => setValue(newValue)}
                options={numberOptions}
                option={{
                    text: 'option',
                    value: 'option',
                    onClick: (option: any) => setValue(+option),
                    ...option
                }}
                {...props}
            />
            {code(`
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
const DateAndTimePopover: FC = () => {
    const { type, code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                popover={{
                    position: 'center',
                    setAttrs:(key)=> {
                        if(key === 'backdrop'){
                            return {
                                style: {background: 'rgba(0,0,0,0.8)'}
                            }
                        }
                        if(key === 'modal'){
                            return {
                                style: {
                                    background: '#f2f2f2',
                                    minWidth: 240
                                }
                            }
                        }
                    }
                }}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    popover={{
        position: 'center',
        setAttrs:(key)=> {
            if(key === 'backdrop'){
                return {
                    style: {background: 'rgba(0,0,0,0.8)'}
                }
            }
            if(key === 'modal'){
                return {
                    style: {
                        background: '#f2f2f2',
                        minWidth: 240
                    }
                }
            }
        }
    }}
/>
        `)}
        </div>
    )
}
function getDateAttrsExamples(type: I_exampleType) {
    if (type !== 'date') { return [] }
    let list = [
        ["<>,2022,2024", 'disabled all dates between 2022 and 2024'],
        ["<=>,2022,2024", 'disabled all dates between and equal 2022 and 2024'],
        ["!<>,2022,2024", 'disabled all dates that is not between 2022 and 2024'],
        ["!<=>,2022,2024", 'disabled all dates that is not between and equal 2022 and 2024'],
        ["=,2022/4/5,2022/6/7,2022/8/12", 'disabled this dates => 2022/4/5,2022/6/7,2022/8/12'],
        ["!=,2022/4/5", 'disabled all dates exept 2022/4/5'],
        [">,2022/4/5", 'disabled all dates after 2022/4/5'],
        [">=,2022/4/5", 'disabled 2022/4/5 and all dates after 2022/4/5'],
        ["<,2022/4/5", 'disabled all dates before 2022/4/5'],
        ["<=,2022/4/5", 'disabled 2022/4/5 and all dates before 2022/4/5'],
        ["w,6,4", 'disabled all 4th and 6th weekdays (index from 0)'],
        ["!w,6", 'disabled all days that is not 6th weekdays (index from 0)'],
    ];
    let res = list.map(([selector, description]) => [`dateAttrs (selector:'${selector}')`, () => <DateAttrs selector={selector} />, true, description])
    return [
        [
            'dateAttrs (isToday)',
            () => <DateAttrsIsToday />,
            true,
            'set background of today element'
        ],
        [
            'dateAttrs (isActive)',
            () => <DateAttrsIsActive />,
            true,
            'set background of active element'
        ],

        ...res
    ]
}

const DateAttrs: FC<{ selector: string }> = ({ selector }) => {
    const { code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='date' value={value}
                onChange={(newValue) => setValue(newValue)}
                dateAttrs={({ dateArray, isMatch }) => {
                    if (isMatch([selector])) {
                        return { disabled: true }
                    }
                }}
            />
            {code(`
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
const DateAttrsIsToday: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='date' value={value}
                onChange={(newValue) => setValue(newValue)}
                dateAttrs={({ isToday }) => {
                    if (isToday) {
                        return {
                            style: { background: 'orange' }
                        }
                    }
                }}
            />
            {code(`
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
const DateAttrsIsActive: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='date' value={value}
                onChange={(newValue) => setValue(newValue)}
                dateAttrs={({ isActive }) => {
                    if (isActive) {
                        return {
                            style: { background: 'orange' }
                        }
                    }
                }}
            />
            {code(`
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