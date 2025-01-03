import { createContext, FC, ReactNode, useContext, useRef, useState } from "react";
import { AIButtons, AICheckbox, AIDate, AINumber, AIPassword, AIRadio, AISelect, AITabs, AIText, AITextarea, AITime, FormContainer, FormItem } from "../../npm/aio-input";
import AIOPopup from "../../npm/aio-popup";
const CTX = createContext({} as any)
type I_CTX = {
    popup: AIOPopup,
    getItems: () => I_item[],
    addItem: I_addItem,
    editItem:I_editItem,
    removeItem:I_removeItem,
    getTypes: I_getTypes
}
type I_type = 'Text' | 'Number' | 'Textarea' | 'Password' | 'Select' | 'Radio' | 'Tabs' | 'Buttons' | 'Checkbox' | 'Date' | 'Time'
type I_addItem = (type: I_type) => void
type I_editItem = (index:number)=>void
type I_removeItem = (index:number)=>void
type I_getTypes = (type: I_type) => I_types
type I_types = { hasOption: boolean, hasText: boolean, isDate: boolean }
type I_option = { text: string, value: string }
type I_item = {
    type: I_type,
    text: string,
    field: string,
    options: I_option[],
    placeholder: string,
    jalali: boolean,
    label:string
}
const FG: FC = () => {
    const [items, setItems] = useState<I_item[]>([])
    const itemsRef = useRef(items)
    itemsRef.current = items
    const getItems = () => itemsRef.current
    const [popup] = useState<AIOPopup>(new AIOPopup())
    const getTypes: I_getTypes = (type) => {
        const hasOption = ['Select', 'Tabs', 'Radio', 'Buttons'].indexOf(type) !== -1;
        const hasText = ['Select', 'Date', 'Time', 'Checkbox'].indexOf(type) !== -1
        const isDate = ['Date', 'Time'].indexOf(type) !== -1
        return { hasOption, hasText, isDate }
    }
    const addItem: I_addItem = (type) => {
        popup.addModal({
            header: { title: 'Add Item', subtitle: type },
            body: () => {
                return (
                    <SettingModal
                        type={type}
                        onSubmit={(newItem) => {
                            setItems([...itemsRef.current, newItem]);
                            popup.removeModal()
                        }}
                    />
                )
            }
        })
    }
    const editItem = (index:number)=>{
        const item = items[index]
        popup.addModal({
            header: { title: 'Add Item', subtitle: item.type },
            body: () => {
                return (
                    <SettingModal
                        type={item.type}
                        item={item}
                        index={index}
                        onSubmit={(newItem) => {
                            setItems(itemsRef.current.map((o,i)=>i === index?newItem:o));
                            popup.removeModal()
                        }}
                    />
                )
            }
        })
    }
    const removeItem = (index:number)=>{
        const item = items[index]
        popup.addConfirm({
            title:'remove item',
            subtitle:item.type,
            onSubmit:async ()=>{
                setItems(itemsRef.current.filter((o,i)=>i !== index))
                return true
            }
        })
    }
    const getContext = (): I_CTX => {
        return { getItems, addItem,editItem,removeItem, getTypes, popup }
    }

    return (
        <CTX.Provider value={getContext()}>
            <div className="fullscreen- flex-col- of-hidden-">
                <Header />
                <div className="flex-row- flex-1-">
                    <Side />
                    <Preview />
                </div>
                {popup.render()}
            </div>
        </CTX.Provider>
    )

}
const SettingModal: FC<{ item?: I_item, type: I_type, onSubmit: (newItem: I_item) => void, index?: number }> = (props) => {
    const { getTypes, getItems, popup }: I_CTX = useContext(CTX)
    const [item, setItem] = useState<I_item>(getItem)
    const itemRef = useRef(item)
    itemRef.current = item
    const [types] = useState<I_types>(getTypes(props.type))
    const changeItem = (key: string, value: any) => {
        setItem({ ...item, [key]: value })
    }
    function getItem(): I_item {
        if (props.item) { return JSON.parse(JSON.stringify(props.item)) }
        return {
            field: '',
            type: props.type,
            options: [],
            text: '',
            placeholder: '',
            jalali: false,
            label:'',
        }
    }

    const input = (field: keyof I_item,required?:boolean) => {
        return (
            <FormItem 
                label={field} 
                input={<AIText value={item[field]} onChange={(value) => changeItem(field, value)} />} 
                error={required?()=>{
                    if(!item[field]){return `${field} is required`}
                }:undefined}
            />
        )
    }
    const openAddOptionModal = () => {
        popup.addModal({
            header: { title: 'Add Option' }, position: 'center',
            body: () => {
                return (
                    <AddOptionModal onSubmit={(option) => {
                        const options = itemRef.current.options;
                        const newOptions = [...options, option]
                        changeItem('options', newOptions)
                    }} />
                )
            }
        })
    }
    const input_options = () => {
        return (
            <FormItem
                label='options'
                input={<SettingOptions options={item.options} onChange={(newOptions) => changeItem('options', newOptions)} />}
                action={{text: <PlusIcon />,fn: () => openAddOptionModal()}}
            />
        )
    }
    const input_boolean = (field: keyof I_item) => {
        return (
            <AIRadio
                options={[{ text: 'true', value: true }, { text: 'false', value: false }]}
                value={item[field]} onChange={(v) => changeItem(field, v)}
            />
        )
    }
    const getError = (): string | undefined => {
        if (!item.field) { return 'item field is required' }
        if (props.item && props.index !== undefined) {
            const existField = getItems().find((o, i) => {
                if (i === props.index) { return false }
                return o.field === item.field
            })
            if (existField) { return 'this field is exist' }
        }
    }
    const error = getError()
    const isChange = ()=>{
        if(!props.item){return false}
        for (let prop in props.item){
            const propsItemValue = (props.item as any)[prop];
            const stateItemValue = (item as any)[prop]
            if(propsItemValue !== stateItemValue){return true}
        }
        return false
    }
    const isDisabled = ()=>{
        if(!props.item){return !!error}
        return !!error || !isChange()
    }
    return (
        <FormContainer
            body={(
                <div className="flex-col- gap-12- h-100-">
                    {input('label',true)}
                    {input('field')}
                    {types.hasText && input('text')}
                    {input('placeholder')}
                    {types.hasOption && input_options()}
                    {types.isDate && <FormItem label='jalali' input={input_boolean('jalali')} />}
                    <div className="flex-1-"></div>
                </div>
            )}
            buttons={[
                { text: 'Submit', onClick: () => props.onSubmit(item), active: true, disabled: isDisabled() }
            ]}
        />
    )
}
const AddOptionModal: FC<{ onSubmit: (v: { text: ReactNode, value: string }) => void }> = ({ onSubmit }) => {
    const [option, setOption] = useState<I_option>({ text: '', value: '' })
    return (
        <FormContainer
            body={(
                <div className="flex-col-">
                    <FormItem
                        label='text'
                        input={<AIText value={option.text} onChange={(text) => setOption({ ...option, text })} />}
                        error={() => !option.text ? 'text is required' : ''}
                    />
                    <FormItem
                        label='value'
                        input={<AIText value={option.value} onChange={(value) => setOption({ ...option, value })} />}
                        error={() => !option.value ? 'value is required' : ''}
                    />
                </div>
            )}
            buttons={[
                { text: 'Submit', onClick: () => onSubmit(option), disabled: !option.text || !option.value }
            ]}
        />
    )
}
const SettingOptions: FC<{ options: I_option[], onChange: (options: I_option[]) => void }> = ({ options, onChange }) => {
    function changeOption(index: number, field: 'text' | 'value', value: string) {
        const newOptions: I_option[] = options.map((o, i) => i === index ? { ...o, [field]: value } : o)
        onChange(newOptions)
    }
    function removeOption(index:number){
        onChange(options.filter((o,i)=>i !== index))
    }
    function input_layout(option:I_option,field:'text'|'value',index:number){
        const p:any = {className:'w-100- brd-none-',value:option[field],onChange:(value:any)=>changeOption(index, field, value)}
        return (<FormItem input={(<AIText {...p}/>)} error={()=>!option[field]?`${field} is required`:''}/>)
    }
    function option_layout(option: I_option, index: number) {
        return (
            <tr>
                <td className="flex-1-">{input_layout(option,'text',index)}</td>
                <td className="flex-1-">{input_layout(option,'value',index)}</td>
                <td><div className="flex-row- align-vh-" onClick={()=>removeOption(index)}><DeleteIcon/></div></td>
            </tr>
        )
    }
    const th = (text:ReactNode)=><th className='h-36-'>{text}</th>
    return (
        <table border={1} className='w-100-' style={{ borderCollapse: 'collapse' }}>
            <thead>{th('text')}{th('value')}{th('')}</thead>
            <tbody>{options.map((o, i) => option_layout(o, i))}</tbody>
        </table>
    )
}
const Header: FC = () => {
    const { addItem }: I_CTX = useContext(CTX)
    const options: I_type[] = ['Text', 'Number', 'Textarea', 'Password', 'Select', 'Radio', 'Tabs', 'Buttons', 'Checkbox', 'Date', 'Time']
    return (
        <div className="flex-row- align-v-">
            <AISelect
                text='Add Item'
                options={options}
                option={{
                    text: 'option', value: 'option',
                    onClick: ({ option }) => addItem(option)
                }}
            />
        </div>
    )
}
const Side: FC = () => {
    const { getItems,editItem,removeItem }: I_CTX = useContext(CTX)
    const item_layout = (item: I_item,index:number) => {
        return (
            <div key={index} className='h-48- p-h-12- flex-row- align-v- brd-c-10- brd-b-'>
                <div className="flex-1-">{`${item.type}(${item.field})`}</div>
                <AISelect
                    className="w-fit- bg-none- brd-none-"
                    caret={false}
                    text={<DotsIcon />}
                    options={[
                        {text:'Edit',onClick:()=>editItem(index)},
                        {text:'Remove',onClick:()=>removeItem(index)},
                    ]}
                />
            </div>
        )
    }
    return (
        <div className="w-300- bg-d-20-">
            {getItems().map((o,i) => item_layout(o,i))}
        </div>
    )
}
const Preview: FC = () => {
    const {getItems}:I_CTX = useContext(CTX)
    const components = {AISelect,AIText,AINumber,AITextarea,AICheckbox,AIRadio,AITabs,AIButtons,AIDate,AITime,AIPassword}
    return (
        <div className="flex-1- p-12-">
            {
                getItems().map((item:I_item)=>{
                    const Comp = components[`AI${item.type}`]
                    const props = {...item,options:item.options.length === 0?undefined:item.options,label:undefined}
                    return (
                        <FormItem
                            label={item.label}
                            input={<Comp {...props}/>}
                        />
                    )
                })
            }
        </div>
    )
}
const DotsIcon: FC = () => {
    return (
        <svg viewBox="0 0 24 24" width={24} height={24} xmlns="http://www.w3.org/2000/svg">
            <path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
        </svg>
    )
}
const PlusIcon: FC = () => {
    return (
        <svg viewBox="0 0 24 24" width={24} height={24} xmlns="http://www.w3.org/2000/svg">
            <path d="M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z" />
        </svg>
    )
}
const DeleteIcon: FC = () => {
    return (
        <svg viewBox="0 0 24 24" width={24} height={24} xmlns="http://www.w3.org/2000/svg">
            <path d="M15,16H19V18H15V16M15,8H22V10H15V8M15,12H21V14H15V12M11,10V18H5V10H11M13,8H3V18A2,2 0 0,0 5,20H11A2,2 0 0,0 13,18V8M14,5H11L10,4H6L5,5H2V7H14V5Z" />
        </svg>
    )
}
export default FG;