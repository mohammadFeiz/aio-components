import { createContext, FC, ReactNode, useContext, useRef, useState } from "react"
import { mdiAccount, mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiDotsHorizontal, mdiHumanFemale, mdiHumanMale, mdiMinusThick, mdiPlusThick, mdiStar } from "@mdi/js"
import { Icon } from "@mdi/react"
import AIOInput, { AI, AITYPE } from "../../npm/aio-input";
import Code from '../../npm/code';
import { Storage } from "../../npm/aio-utils";
type I_exampleType = 'select' | 'radio' | 'tabs' | 'buttons' | 'tags'
type I_setting = { show: string, showCode: boolean }
type I_CTX = { setting: I_setting, type: I_exampleType, code: (code: string) => React.ReactNode }
const CTX = createContext({} as any);

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
const SelectExamples: FC<{ type: I_exampleType }> = ({ type }) => {
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
        ['checkIcon (array)', () => <CheckIconArray type={type} />, ['radio', 'select'].indexOf(type) !== -1],
        ['checkIcon (css object)', () => <CheckIconObject type={type} />, ['radio'].indexOf(type) !== -1],
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
                        onClick: (option: any) => alert(JSON.stringify(option))
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
    function setSetting(value: any, field?: keyof I_setting) {
        let newSetting = { ...setting };
        if (field) { newSetting = { ...setting, [field]: value } }
        else { newSetting = { ...value } }
        new Storage('treeexamplessetting').save('setting', newSetting)
        SetSetting(newSetting)
    }
    function changeShow(dir: 1 | -1) {
        let index = titles.indexOf(setting.show) + dir
        if (index < 0) { index = titles.length - 1 }
        if (index > titles.length - 1) { index = 0 }
        setSetting({ ...setting, show: titles[index] })
    }
    function setting_node(): ReactNode {
        let btnstyle = { background: 'none', border: 'none' }
        return (
            <div className="p-12">
                <div className="flex-row">
                    <div className="flex-1"></div>
                    <AIOInput type='checkbox' text='Show Code' value={!!setting.showCode} onChange={(showCode) => setSetting(showCode, 'showCode')} />
                    <AIOInput
                        type='select' options={titles} before='Show' option={{ text: 'option', value: 'option' }} popover={{ maxHeight: '100vh' }}
                        value={setting.show} onChange={(show) => setSetting(show, 'show')} className="w-fit"
                    />
                    <div className="flex-row align-v">
                        <button type='button' style={btnstyle} onClick={() => changeShow(-1)}><Icon path={mdiMinusThick} size={1} /></button>
                        <button type='button' style={btnstyle} onClick={() => changeShow(1)}><Icon path={mdiPlusThick} size={1} /></button>
                    </div>
                </div>
            </div>
        )
    }
    function code(code: string) {
        if (setting.showCode === false) { return null }
        return Code(code)
    }
    function render_node(): ReactNode {
        return (
            <div key={JSON.stringify(setting)} className="flex-col ofy-auto flex-1 p-12">
                {
                    examples.map((o: any, i: number): ReactNode => {
                        let [title, COMP, cond, description] = o;
                        if (cond === false) { return null }
                        if (setting.show !== 'all' && setting.show !== title) { return null }
                        return (
                            <div className='w-100' style={{ fontFamily: 'Arial' }}>
                                <h3>{`${i} - ${title}`}</h3>
                                {description && <h5>{description}</h5>}
                                {COMP()}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    function getContext():I_CTX {return { setting, type, code }}
    return (
        <CTX.Provider value={getContext()}>
            <div className="flex-col h-100">{setting_node()} {render_node()}</div>
        </CTX.Provider>
    )
}
export default SelectExamples
const Before: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div className='example'>
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
const After: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div className='example'>
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
const Subtext: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div className='example'>
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
const Disabled: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div className='example'>
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
const DeSelect_true: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div className='example'>
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
const DeSelect_Object: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div className='example'>
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
const Search: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div className='example'>
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
const Loading: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div className='example'>
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
const Text: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
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
const Multiple: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<number>()
    return (
        <div className='example'>
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
const MultipleNumber: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<number[]>([])
    return (
        <div className='example'>
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

const CheckIconArray: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<number[]>([])
    return (
        <div className='example'>
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
                checkIcon={[
                    <Icon path={mdiCheckboxBlankOutline} size={0.7} color='#ddd' />,
                    <Icon path={mdiCheckboxMarked} size={0.7} color='#5400ff' />
                ]}
            />
            {code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
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
const CheckIconObject: FC<{ type: I_exampleType }> = ({ type }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<number[]>([])
    return (
        <div className='example'>
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
                checkIcon={{ background: 'orange', border: '1px solid orange', width: 16, height: 16, padding: 4 }}
            />
            {code(`
<AIOInput
    type='${type}'
    options={${optionsCode}} 
    option={${optionCode}}
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    checkIcon={{background:'orange',border:'1px solid orange',width:16,height:16,padding:4}}
/>
        `)}
        </div>
    )
}

const Options: FC<{ type: I_exampleType, option?: AITYPE['option'], optionCode?: string, props?: AITYPE, propsCode?: string }> = ({ type, option = {}, optionCode, props = {}, propsCode }) => {
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<any>(getValue)
    function getValue() {
        if (type === 'tags') {
            return ['2', '3', '6', '8']
        }
    }
    return (
        <div className='example'>
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
    const {code}:I_CTX = useContext(CTX);
    const [value, setValue] = useState<number[]>([])
    return (
        <div className='example'>
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
    const {code}:I_CTX = useContext(CTX);
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
        <div className='example'>
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