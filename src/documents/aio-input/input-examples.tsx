import { FC, ReactNode,  useContext,useState } from "react"
import { mdiAccount, mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiChevronDoubleDown } from "@mdi/js"
import { Icon } from "@mdi/react"
import AIOInput,{ AI, AI_date_cell_param, AI_type, AIFile, AINumber, AIText, AITYPE, Mask } from "../../npm/aio-input";
import Example, { ExampleContext, I_ExampleContext } from "./example";
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
const InputExamples: FC<{ type: AI_type }> = ({ type }) => {
    let [examples] = useState<[string,()=>ReactNode,boolean?][]>([
        ['placeholder', () => <Placeholder />],
        ['msk', () => <MaskExample />],
        ['before', () => <Before />],
        ['after', () => <After />],
        ['subtext', () => <Subtext />],
        ['disabled', () => <Disabled />],
        ['loading', () => <Loading />],
        ['justify', () => <Justify />],
        ['inputAttrs', () => <InputAttrs />, ['text', 'number', 'textarea', 'password', 'file'].indexOf(type) !== -1],
        ['filter', () => <Filter />, ['text', 'textarea', 'password'].indexOf(type) !== -1],
        ['maxLength', () => <MaxLength />, ['text', 'number', 'textarea', 'password'].indexOf(type) !== -1],
        ['min', () => <Min />, ['number'].indexOf(type) !== -1],
        ['max', () => <Max />, ['number'].indexOf(type) !== -1],
        ['swip', () => <Swip />, ['number'].indexOf(type) !== -1],
        ['spin', () => <Spin />, ['number'].indexOf(type) !== -1],
        ['unit (month)', () => <Unit props={{ unit: 'month' }} propsCode={`unit='month'`} />, ['date'].indexOf(type) !== -1],
        ['unit (hour)', () => <Unit props={{ unit: 'hour' }} propsCode={`unit='hour'`} />, ['date'].indexOf(type) !== -1],
        ['unit (year month day)', () => <Unit props={{ unit: { year: true, month: true, day: true } }} propsCode={`unit={{year:true,month:true,day:true}}`} />, ['date', 'time'].indexOf(type) !== -1],
        ['unit (hour minute second)', () => <Unit props={{ unit: { hour: true, minute: true, second: true } }} propsCode={`unit={{hour:true,minute:true,second:true}}`} />, ['date', 'time'].indexOf(type) !== -1],
        ['size', () => <Size />, ['date','time'].indexOf(type) !== -1],
        ['theme', () => <Theme />, ['date'].indexOf(type) !== -1],
        ['caret (false)', () => <CaretFalse />, ['date', 'time'].indexOf(type) !== -1],
        ['caret (html)', () => <CaretHtml />, ['date', 'time'].indexOf(type) !== -1],
        ...getDateAttrsExamples(type) as any,
        ['jalali', () => <Jalali />, ['date', 'time'].indexOf(type) !== -1],
        ['option.close', () => <DateOptionClose />, ['date'].indexOf(type) !== -1],
        ['image value', () => <Image />, ['image'].indexOf(type) !== -1],
        ['image size', () => <ImageSize />, ['image'].indexOf(type) !== -1],
        ['deSelect (true)', () => <DeSelectTrue />, ['date', 'image'].indexOf(type) !== -1],
        ['deSelect (function)', () => <DeSelectFunction />, ['date', 'image'].indexOf(type) !== -1],
        ['preview', () => <Preview />, ['password', 'image', 'file'].indexOf(type) !== -1],
        ['text', () => <Text />, ['checkbox', 'date', 'time', 'file'].indexOf(type) !== -1],
        ['pattern', () => <Pattern />, ['date', 'time'].indexOf(type) !== -1],
        ['multiple', () => <Multiple />, ['date', 'file'].indexOf(type) !== -1],
        ['multiple (number)', () => <MultipleNumber />, ['date', 'file'].indexOf(type) !== -1],
        ['checkIcon', () => <CheckIcon />, ['checkbox'].indexOf(type) !== -1],
        ['file value', () => <FileValue />, ['file'].indexOf(type) !== -1],
        ['file onRemove', () => <FileOnremove />, ['file'].indexOf(type) !== -1],
        ['voice', () => <Voice />, ['text','textarea'].indexOf(type) !== -1],
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
            'option.text',
            () => (
                <Options
                    option={{
                        text: () => 'file sample text'
                    }}
                    optionCode={
                        `text: () => 'file sample text'`
                    }
                />
            ),
            ['file'].indexOf(type) !== -1
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
                        show: (option) => option.gender !== 'male'
                    }}
                    optionCode={
                        `show:(option)=>option.gender !== 'male'`
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
                        show: (option) => option !== '3453463453'
                    }}
                    optionCode={
                        `show:(option)=>option !== '3453463453'`
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
                        checked: (option,{rootProps}) => (type === 'text' ? option.name : +option) === rootProps.value,
                    }}
                    optionCode={
                        `checked:(option,{rootProps})=>${type === 'number' ? '+' : ''}option${type === 'text' ? '.name' : ''} === rootProps.value`
                    }
                />
            ),
            ['text', 'number','buttons'].indexOf(type) !== -1
        ],
        [
            'option.disabled',
            () => (
                <Options
                    option={{
                        disabled: (option) => type === 'text' ? option.gender === 'male' : +option < 100000000
                    }}
                    optionCode={
                        `disabled:(option)=>${type === 'text' ? "option.gender === 'male'" : "+option < 100000000"}`
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
                        onClick: (option) => alert(JSON.stringify(option))
                    }}
                    optionCode={
                        `onClick:(option)=>alert(JSON.stringify(option))`
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
                            setAttrs:(key:string)=>{
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
    return (<Example examples={examples} type={type}/>)
}
export default InputExamples


const Placeholder: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
const MaskExample:FC = (props) => {
    const [value,setValue] = useState<string>('')
    return (
        <Mask pattern={[
            ['number',2],
            ['-',1],
            ['select',1,['الف','ب','ج','د']],
            ['-',1],
            ['number',3],
            ['ایران',5],
            ['number',2]
        ]} value={value} onChange={(value)=>setValue(value)}/>
    )
}
const After: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                key={type}
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                text='My Text'
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
const Voice: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                voice='fa'
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    voice={true}
    lang='fa'
/>
        `)}
        </div>
    )
}
const Justify: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
const Filter: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                filter={['string','!a', '!b', '!c']}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    filter={['string','!a', '!b', '!c']}
/>
        `)}
        </div>
    )
}
const MaxLength: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
const MultipleNumber: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any[]>()
    return (
        <div className='example'>
            <AIOInput
                key={type}
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                multiple={4}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    multiple={4}
/>
        `)}
        </div>
    )
}
const DateOptionClose: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
const ImageSize: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<string>('https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg')
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                placeholder='Select Image'
                attrs={{style:{height:120}}}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    placeholder='Select Image'
    attrs={{style:{height:120}}}
/>
        `)}
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                placeholder='Select Image'
                attrs={{style:{width:120}}}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    placeholder='Select Image'
    attrs={{style:{width:120}}}
/>
        `)}
        <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                placeholder='Select Image'
                attrs={{style:{width:200,height:200}}}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    placeholder='Select Image'
    attrs={{style:{width:200,height:200}}}
/>
        `)}
        </div>
    )
}
const DeSelectTrue: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
const CheckIcon: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type={type} value={value}
                onChange={(newValue) => setValue(newValue)}
                checkIcon={({checked})=>{
                    return !checked?<Icon path={mdiCheckboxMarked} size={0.7} color='#ddd' />:
                    <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#5400ff' />
                }}
            />
            {code(`
<AIOInput
    type='${type}' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    checkIcon={({checked})=>{
        return !checked?<Icon path={mdiCheckboxMarked} size={0.7} color='#ddd' />:
        <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#5400ff' />
    }}
/>
        `)}
        </div>
    )
}
const Options: FC<{ option?: AI<AI_type>['option'], optionCode?: string, props?: AITYPE, propsCode?: string }> = ({ option = {}, optionCode, props = {}, propsCode }) => {
    const { type }: I_ExampleContext = useContext(ExampleContext);
    if (type === 'text') { return <OptionsText option={option} optionCode={optionCode} props={props} propsCode={propsCode} /> }
    if (type === 'number') { return <OptionsNumber option={option} optionCode={optionCode} props={props} propsCode={propsCode} /> }
    if (type === 'file') { return <OptionsFile option={option} optionCode={optionCode} props={props} propsCode={propsCode} /> }
    return null
}
const OptionsText: FC<{ option?: any, optionCode?: string, props?: any, propsCode?: string }> = ({ option = {}, optionCode, props, propsCode }) => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<string>()
    return (
        <div className='example'>
            <AIText
                value={value}
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
<AIText
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    ${textOptionsCode}
    option={{
        text:'option.name',
        value:'option.id',
        onClick:(option)=>setValue(option.name),
        ${optionCode || ''}
    }}
    ${propsCode || ''}
/>
        `)}
        </div>
    )
}

const OptionsNumber: FC<{ option?: any, optionCode?: string, props?: any, propsCode?: string }> = ({ option = {}, optionCode, props, propsCode }) => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AINumber
                value={value}
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
<AINumber
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    ${numberOptionsCode}
    option={{
        text:'option',
        value:'option',
        onClick:(option)=>setValue(+option),
        ${optionCode || ''}
    }}
    ${propsCode || ''}
/>
        `)}
        </div>
    )
}
const OptionsFile: FC<{ option?: any, optionCode?: string, props?: any, propsCode?: string }> = ({ option = {}, optionCode, props, propsCode }) => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIFile
                value={value}
                onChange={(newValue) => setValue(newValue)}
                options={textOptions}
                option={{
                    ...option
                }}
                {...props}

            />
            {code(`
<AIOInput
    type='file' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    ${textOptionsCode}
    option={{
        ${optionCode || ''}
    }}
    ${propsCode || ''}
/>
        `)}
        </div>
    )
}
const DateAndTimePopover: FC = () => {
    const { type, code }: I_ExampleContext = useContext(ExampleContext);
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
type I_dalist = [
    (p:AI_date_cell_param)=>any,
    string,string
]
function getDateAttrsExamples(type: AI_type) {
    if (type !== 'date') { return [] }
    let list:I_dalist[] = [
        [
            (p)=>{
                const [year,month,day] = p.dateArray;
                let disabled = false;
                if(year < 2022){disabled = true}
                else if(year === 2022){
                    if(month < 4){disabled = true}
                    else if(month === 4){
                        if(day < 5){disabled = true}
                    }
                }
                if(disabled){
                    return {disabled:true}
                }
            },
`(p)=>{
    const [year,month,day] = p.dateArray;
    let disabled = false;
    if(year < 2022){disabled = true}
    else if(year === 2022){
        if(month < 4){disabled = true}
        else if(month === 4){
            if(day < 5){disabled = true}
        }
    }
    if(disabled){
        return {disabled:true}
    }
}`, 
            'disabled all dates before 2022/4/5'
        ],
        [
            (p)=>{
                if(p.weekDayIndex === 3 || p.weekDayIndex === 5){
                    return {disabled:true}
                }
            },
            "w,6,4", 
            'disabled all 4th and 6th weekdays (index from 0)'
        ],
    ];
    let res = list.map(([fn, fnCode,description]) => [`dateAttrs`, () => <DateAttrs fn={fn} fnCode={fnCode}/>, true, description])
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

const DateAttrs: FC<{ fn: any,fnCode:string }> = ({ fn,fnCode }) => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
            <AIOInput
                type='date' value={value}
                onChange={(newValue) => setValue(newValue)}
                dateAttrs={(p) => fn(p)}
            />
            {code(`
<AIOInput
    type='date' 
    value='${value}'
    onChange={(newValue)=>setValue(newValue)}
    dateAttrs={(p)=>{
        ${fnCode}
    }}
/>
        `)}
        </div>
    )
}
const DateAttrsIsToday: FC = () => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
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
    const { code }: I_ExampleContext = useContext(ExampleContext);
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
const FileValue: FC = () => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any>({
        url:'https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340',
        name:'my file',
        size:1235000
    })
    return (
        <div className='example'>
            <AIOInput
                type='file' value={value}
                onChange={(newValue) => setValue(newValue)}
            />
            {code(`

        `)}
        </div>
    )
}
const FileOnremove: FC = () => {
    const { code }: I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any>({
        url:'https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340',
        name:'my file',
        size:1235000
    })
    return (
        <div className='example'>
            <AIOInput
                type='file' value={value}
                onRemove={async ({row,rowIndex})=>{
                    const res = window.confirm('remove file?');
                    return res === true
                }}
                onChange={(newValue) => setValue(newValue)}
            />
            {code(`
<AIOInput
    type='file' value={value}
    onRemove={async ({row,rowIndex})=>{
        const res = window.confirm('remove file?');
        return res === true
    }}
    onChange={(newValue) => setValue(newValue)}
/>
        `)}
        </div>
    )
}