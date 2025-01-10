import { FC, useContext, useRef, useState } from "react"
import { mdiAccount, mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiDotsHorizontal, mdiHumanFemale, mdiHumanMale, mdiMinusThick, mdiPlusThick, mdiStar } from "@mdi/js"
import { Icon } from "@mdi/react"
import AIOInput, { AI, AI_type, AITYPE } from "../../npm/aio-input";
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
const optionsCode = `[
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
const optionCode =
    `option={{
    text:'option.name',
    value:'option.id'
}}`
const SelectExamples: FC<{ type: AI_type }> = ({ type }) => {
    let [examples] = useState<any>([
        ['before', () => <Before type={type} />],
        ['after', () => <After type={type} />],
        ['subtext', () => <Subtext type={type} />],
        ['disabled', () => <Disabled type={type} />],
        ['deSelect', () => <DeSelect_true type={type} />],
        ['deSelect', () => <DeSelect_Object type={type} />],
        ['search', () => <Search type={type} />],
        ['loading', () => <Loading type={type} />],
        ['text', () => <Text type={type} />, ['select'].indexOf(type) !== -1],
        ['multiple', () => <Multiple type={type} />, ['radio', 'buttons', 'select'].indexOf(type) !== -1],
        ['multiple (number)', () => <MultipleNumber type={type} />, ['radio', 'buttons', 'select'].indexOf(type) !== -1],
        ['checkIcon', () => <CheckIcon type={type} />, ['radio', 'select'].indexOf(type) !== -1],
        [
            'option.before',
            () => (
                <Options
                    type={type}
                    option={{
                        before: () => <Icon path={mdiAccount} size={0.8} />
                    }}
                    optionCode={
                        `before:()=><Icon path={mdiAccount} size={0.8}/>`
                    }
                />
            ),
            ['radio', 'select', 'tabs', 'buttons'].indexOf(type) !== -1
        ],
        [
            'option.after',
            () => (
                <Options
                    type={type}
                    option={{
                        after: () => <div className='badge'>12</div>
                    }}
                    optionCode={
                        `after:()=><div className='badge'>12</div>`
                    }
                />
            ),
            ['radio', 'select', 'tabs', 'buttons'].indexOf(type) !== -1
        ],
        [
            'option.subtext',
            () => (
                <Options
                    type={type}
                    option={{
                        subtext: () => 'this is my subtext'
                    }}
                    optionCode={
                        `subtext:()=>'this is my subtext'`
                    }
                />
            ),
            ['radio', 'select', 'tabs', 'buttons'].indexOf(type) !== -1
        ],
        [
            'option.checked',
            () => (
                <Options
                    type={type}
                    option={{
                        checked: ({option,rootProps}) => option.id === rootProps.value
                    }}
                    optionCode={
                        `checked: ({option,rootProps}) => option.id === rootProps.value`
                    }
                />
            ),
            ['buttons'].indexOf(type) !== -1
        ],
        [
            'option.close',
            () => (
                <Options
                    type={type}
                    option={{
                        close: () => true
                    }}
                    optionCode={
                        `close:()=>true`
                    }
                />
            ),
            ['select'].indexOf(type) !== -1
        ],
        [
            'option.justify',
            () => (
                <Options
                    type={type}
                    option={{
                        justify: () => true
                    }}
                    optionCode={
                        `justify:()=>true`
                    }
                />
            ),
            ['radio', 'select', 'tabs', 'buttons'].indexOf(type) !== -1
        ],
        [
            'option.attrs',
            () => (
                <Options
                    type={type}
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
            ['radio', 'select', 'tabs', 'buttons'].indexOf(type) !== -1
        ],
        [
            'option.className',
            () => (
                <Options
                    type={type}
                    option={{
                        className: () => 'my-option'
                    }}
                    optionCode={
                        `className:()=>'my-option'`
                    }
                />
            ),
            ['radio', 'select', 'tabs', 'buttons'].indexOf(type) !== -1
        ],
        [
            'option.style',
            () => (
                <Options
                    type={type}
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
            ['radio', 'select', 'tabs', 'buttons'].indexOf(type) !== -1
        ],
        [
            'option.show',
            () => (
                <Options
                    type={type}
                    option={{
                        show: (option: any) => option.gender !== 'male'
                    }}
                    optionCode={
                        `show:(option:any)=>option.gender !== 'male'`
                    }
                />
            )
        ],
        [
            'option.disabled',
            () => (
                <Options
                    type={type}
                    option={{
                        disabled: (option: any) => option.gender === 'male'
                    }}
                    optionCode={
                        `disabled:(option:any)=>option.gender === 'male'`
                    }
                />
            )
        ],
        [
            'option.onClick',
            () => (
                <Options
                    type={type}
                    option={{
                        onClick: ({option}) => alert(option.name)
                    }}
                    optionCode={
                        `onClick:(option:any)=>alert(JSON.stringify(option))`
                    }
                />
            ),
            ['radio', 'select', 'tabs', 'buttons'].indexOf(type) !== -1
        ],
        [
            'popover',
            () => (
                <Options
                    type={type}
                    props={{
                        type,
                        popover: {
                            fitHorizontal: true,
                            setAttrs: (key: string) => {
                                if (key === 'backdrop') {
                                    return {
                                        style: {
                                            background: 'rgba(0,0,0,0.8)'
                                        }
                                    }
                                }
                                if (key === 'modal') {
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
                        `popover:{
                fitHorizontal:true,
                setAttrs:(key)=>{
                    if(key === 'backdrop'){
                        return {
                            style:{
                                background:'rgba(0,0,0,0.8)'
                            }
                        }
                    }
                    if(key === 'modal'){
                        return {
                            style:{
                                background:'#f2f2f2',
                                minWidth:240
                            }
                        }
                    }
                }
            }`
                    }
                />
            ),
            ['select'].indexOf(type) !== -1
        ],
        [
            'option.tagAttrs',
            () => (
                <Options
                    type={type}
                    props={{
                        type,
                        multiple: true
                    }}
                    propsCode={
                        `multiple={true}`
                    }
                    option={{
                        tagAttrs: (option: any) => {
                            return {
                                style: {
                                    background: option.gender === 'male' ? 'dodgerblue' : 'pink'
                                }
                            }
                        }
                    }}
                    optionCode={
                        `tagAttrs:(option:any)=>{
            return {
                style:{
                    background:option.gender === 'male'?'dodgerblue':'pink'
                }
            }
        }`
                    }
                />
            ),
            ['tags', 'select'].indexOf(type) !== -1
        ],
        [
            'option.tagBefore',
            () => (
                <Options
                    type={type}
                    props={{
                        type,
                        multiple: true
                    }}
                    propsCode={
                        `multiple={true}`
                    }

                    option={{
                        tagBefore: (option: any) => {
                            return <Icon path={option.gender === 'male' ? mdiHumanMale : mdiHumanFemale} size={0.8} />
                        }
                    }}
                    optionCode={
                        `tagBefore:(option:any)=>{
            return <Icon path={option.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={0.8}/>
        }`
                    }
                />
            ),
            ['tags', 'select'].indexOf(type) !== -1
        ],
        [
            'option.tagAfter',
            () => (
                <Options
                    type={type}
                    props={{
                        type,
                        multiple: true
                    }}
                    propsCode={
                        `multiple={true}`
                    }

                    option={{
                        tagAfter: (option: any) => {
                            return option.gender
                        }
                    }}
                    optionCode={
                        `tagAfter:(option:any)=>{
            return option.gender
        }`
                    }
                />
            ),
            ['tags', 'select'].indexOf(type) !== -1
        ],
        ['hideTags', () => <HideTags />, ['select'].indexOf(type) !== -1],
        ['tags popover', () => <TagsPopover />, ['tags'].indexOf(type) !== -1],

    ])
    return (<Example type={type} examples={examples}/>)
}
export default SelectExamples
const Before: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div>
            <AIOInput
                type={type}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                before={<Icon path={mdiAccount} size={0.8} />}
            />
            {code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    before={<Icon path={mdiAccount} size={0.8}/>}
/>
        `)}
        </div>
    )
}
const After: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div>
            <AIOInput
                type={type}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                after={<div className='badge'>{12}</div>}
            />
            {code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    after={<div className='badge'>{12}</div>}
/>
        `)}
        </div>
    )
}
const Subtext: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div>
            <AIOInput
                type={type}
                value={value}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                onChange={(newValue) => setValue(newValue)}
                subtext='My subtext'
            />
            {code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    subtext='My subtext'
/>
        `)}
        </div>
    )
}
const Disabled: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div>
            <AIOInput
                type={type}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                disabled={true}
            />
            {code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    disabled={true}
/>
        `)}
        </div>
    )
}
const DeSelect_true: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div>
            <AIOInput
                type={type}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                deSelect={true}
            />
            {code(`
<AIOInput
    type={type}
    options={textOptions}
    option={{
        text: 'option.name',
        value: 'option.id'
    }}
    value={value}
    onChange={(newValue) => setValue(newValue)}
    deSelect={true}
/>
        `)}
        </div>
    )
}
const DeSelect_Object: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div>
            <AIOInput
                type={type}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                deSelect={{id:false,text:'Not Selected'}}
            />
            {code(`
<AIOInput
    type={type}
    options={textOptions}
    option={{
        text: 'option.name',
        value: 'option.id'
    }}
    value={value}
    onChange={(newValue) => setValue(newValue)}
    deSelect={{id:false,text:'Not Selected'}}
/>
        `)}
        </div>
    )
}
const Search: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div>
            <AIOInput
                type={type}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                search={'search here'}
            />
            {code(`
<AIOInput
    type={type}
    options={textOptions}
    option={{
        text: 'option.name',
        value: 'option.id'
    }}
    value={value}
    onChange={(newValue) => setValue(newValue)}
    deSelect={{id:false,text:'Not Selected'}}
/>
        `)}
        </div>
    )
}
const Loading: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div>
            <AIOInput
                type={type}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                loading={true}
            />
            {code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    loading={true}
/>
        `)}
        </div>
    )
}
const Text: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div>
            <AIOInput
                type={type}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                text='My Text'
            />
            {code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    text='My Text'      
/>
        `)}
        </div>
    )
}
const Multiple: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number>()
    return (
        <div>
            <AIOInput
                type={type}
                multiple={true}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
            />
            {code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    multiple={true}
/>
        `)}
        </div>
    )
}
const MultipleNumber: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number[]>([])
    return (
        <div>
            <AIOInput
                type={type}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                multiple={6}
            />
            {code(`
<AIOInput
    type='${type}' 
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    multiple={true}
    maxLength={6}
/>
        `)}
        </div>
    )
}

const CheckIcon: FC<{ type: AI_type }> = ({ type }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number[]>([])
    return (
        <div>
            <AIOInput
                type={type}
                multiple={type === 'select'}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                checkIcon={({checked})=>{
                    return checked?<Icon path={mdiCheckboxMarked} size={0.9} color='#5400ff'/>:
                    <Icon path={mdiCheckboxBlankOutline} size={0.9} color='#5400ff'/>
                }}
            />
            {code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    checkIcon={({checked})=>{
        return checked?<Icon path={mdiCheckboxMarked} size={0.7} color='#ddd'/>:
        <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#5400ff'/>
    }}
/>
        `)}
        </div>
    )
}

const Options: FC<{ type: AI_type, option?: AITYPE['option'], optionCode?: string, props?: AITYPE, propsCode?: string }> = ({ type, option = {}, optionCode, props = {}, propsCode }) => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div>
            <AIOInput
                value={value}
                onChange={(newValue) => setValue(newValue)}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id',
                    ...option
                }}
                {...props}
                type={type}
            />
            {code(`
<AIOInput
    type='${type}' 
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    ${optionsCode}
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

const HideTags: FC = () => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const [value, setValue] = useState<number[]>([])
    return (
        <div>
            <AIOInput
                type='select'
                multiple={true}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                hideTags={true}
            />
            {code(`
<AIOInput
    type='select'
    multiple={true} 
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    hideTags={true}
/>
        `)}
        </div>
    )
}

const TagsPopover: FC = () => {
    const {code}:I_ExampleContext = useContext(ExampleContext);
    const type = 'tags';
    const [value, setValue] = useState<any>(getValue)
    const valueRef = useRef(value);
    valueRef.current = value;
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div>
            <AIOInput
                type={type}
                options={textOptions}
                option={{
                    text: 'option.name',
                    value: 'option.id'
                }}
                className='my-tags'
                value={value}
                onChange={(newValue) => setValue(newValue)}
                after={
                    <AIOInput
                        type='button' style={{ padding: 0 }}
                        text={<Icon path={mdiDotsHorizontal} size={1} />}
                        popover={{
                            header: {
                                onClose: true,
                                title: 'Select Items',
                                subtitle: 'Some subtitle',
                                before: <Icon path={mdiStar} size={1.5} color='orange' />
                            },
                            position: 'center',
                            body: () => {
                                return (
                                    <div style={{ whiteSpace: 'break-spaces', maxWidth: 600, paddingBottom: 12 }}>
                                        <AIOInput
                                            type='radio'
                                            multiple={true}
                                            options={textOptions}
                                            option={{
                                                text: 'option.name',
                                                value: 'option.id',
                                                style: () => ({ width: '32%' })
                                            }}
                                            value={[...valueRef.current]}
                                            onChange={(newValue) => setValue([...newValue])}
                                            subtext='Please Select Some Items'

                                        />
                                    </div>
                                )
                            }
                        }}
                    />
                }
            />
            {code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    before={<Icon path={mdiAccount} size={0.8}/>}
/>
        `)}
        </div>
    )
}