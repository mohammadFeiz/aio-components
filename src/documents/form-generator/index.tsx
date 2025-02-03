import { createContext, FC, ReactNode, useContext, useRef, useState } from "react";
import { AIButtons, AICheckbox, AIDate, AINumber, AIPassword, AIRadio, AISelect, AITabs, AIText, AITextarea, AITime, AIFormInput } from "../../npm/aio-input";
import usePopup, { I_usePopup } from "../../npm/aio-popup";
import './index.css';
import { Code } from './../../npm/aio-components';
const CTX = createContext({} as any)
type I_CTX = {
    popup: I_usePopup,
    getItems: () => I_item[],
    addItem: I_addItem,
    editItem: I_editItem,
    removeItem: I_removeItem,
    propDic: I_propDic,
    propFnDic: I_propFnDic,
    componentDic: I_componentDic
}
type I_type = 'Text' | 'Number' | 'Textarea' | 'Password' | 'Select' | 'Radio' | 'Tabs' | 'Buttons' | 'Checkbox' | 'Date' | 'Time'
type I_prop = 'field' | 'label' | 'placeholder' | 'options' | 'jalali' | 'text' | 'disabled' | 'justNumber' | 'maxLength' | 'multiple' | 'rowGroup'
type I_3 = 0 | 1 | 2
type I_propDic = { [key in I_type]: { [key in I_prop]: I_3 } }
type I_propFn = 'text' | 'number' | 'options' | 'boolean'
type I_propFnDic = { [key in I_prop]: I_propFn }
type I_componentDic = { [key in I_type]: any }
type I_addItem = (type: I_type) => void
type I_editItem = (index: number) => void
type I_removeItem = (index: number) => void
type I_option = { text: string, value: string }
type I_item = {
    type: I_type,
    text?: string,
    field: string,
    options?: I_option[],
    placeholder?: string,
    jalali?: string | boolean,
    label: string,
    disabled?: string,
    rowGroup?: string
}
const FG: FC = () => {
    const [items, setItems] = useState<I_item[]>([])
    const [propDic] = useState<I_propDic>({
        Text: { field: 2, label: 2, placeholder: 1, options: 1, jalali: 0, text: 0, disabled: 1, justNumber: 1, maxLength: 1, multiple: 0, rowGroup: 1 },
        Number: { field: 2, label: 2, placeholder: 1, options: 1, jalali: 0, text: 0, disabled: 1, justNumber: 0, maxLength: 1, multiple: 0, rowGroup: 1 },
        Textarea: { field: 2, label: 2, placeholder: 1, options: 1, jalali: 0, text: 0, disabled: 1, justNumber: 1, maxLength: 1, multiple: 0, rowGroup: 1 },
        Password: { field: 2, label: 2, placeholder: 1, options: 0, jalali: 0, text: 0, disabled: 1, justNumber: 1, maxLength: 1, multiple: 0, rowGroup: 1 },
        Select: { field: 2, label: 2, placeholder: 1, options: 2, jalali: 0, text: 1, disabled: 1, justNumber: 0, maxLength: 1, multiple: 1, rowGroup: 1 },
        Radio: { field: 2, label: 2, placeholder: 0, options: 2, jalali: 0, text: 0, disabled: 1, justNumber: 0, maxLength: 1, multiple: 1, rowGroup: 1 },
        Tabs: { field: 2, label: 2, placeholder: 0, options: 2, jalali: 0, text: 0, disabled: 1, justNumber: 0, maxLength: 0, multiple: 0, rowGroup: 1 },
        Buttons: { field: 2, label: 2, placeholder: 0, options: 2, jalali: 0, text: 0, disabled: 1, justNumber: 0, maxLength: 1, multiple: 1, rowGroup: 1 },
        Checkbox: { field: 2, label: 2, placeholder: 0, options: 0, jalali: 0, text: 1, disabled: 1, justNumber: 0, maxLength: 0, multiple: 0, rowGroup: 1 },
        Date: { field: 2, label: 2, placeholder: 1, options: 0, jalali: 1, text: 1, disabled: 1, justNumber: 0, maxLength: 0, multiple: 1, rowGroup: 1 },
        Time: { field: 2, label: 2, placeholder: 1, options: 0, jalali: 1, text: 1, disabled: 1, justNumber: 0, maxLength: 0, multiple: 0, rowGroup: 1 }
    })
    const [propFnDic] = useState<I_propFnDic>({
        field: 'text',
        label: 'text',
        options: 'options',
        jalali: 'boolean',
        text: 'text',
        placeholder: 'text',
        disabled: 'text',
        justNumber: 'text',
        maxLength: 'number',
        multiple: 'boolean',
        rowGroup: 'text'
    })
    const [componentDic] = useState<I_componentDic>({ Select: AISelect, Text: AIText, Number: AINumber, Textarea: AITextarea, Checkbox: AICheckbox, Radio: AIRadio, Tabs: AITabs, Buttons: AIButtons, Date: AIDate, Time: AITime, Password: AIPassword })
    const itemsRef = useRef(items)
    itemsRef.current = items
    const getItems = () => itemsRef.current
    const popup = usePopup()
    const addItem: I_addItem = (type) => {
        popup.addModal({
            header: { title: 'Add Item', subtitle: type },
            body: (
                <SettingModal
                    type={type}
                    onSubmit={(newItem) => {
                        setItems([...itemsRef.current, newItem]);
                        popup.removeModal()
                    }}
                />
            )
        })
    }
    const editItem = (index: number) => {
        const item = items[index]
        popup.addModal({
            header: { title: 'Add Item', subtitle: item.type },
            body: (
                <SettingModal
                    type={item.type}
                    item={item}
                    index={index}
                    onSubmit={(newItem) => {
                        setItems(itemsRef.current.map((o, i) => i === index ? newItem : o));
                        popup.removeModal()
                    }}
                />
            )
        })
    }
    const removeItem = (index: number) => {
        const item = items[index]
        popup.addConfirm({
            title: 'remove item',
            subtitle: item.type,
            onSubmit: async () => {
                setItems(itemsRef.current.filter((o, i) => i !== index))
                return true
            }
        })
    }
    const getContext = (): I_CTX => {
        return { getItems, addItem, editItem, removeItem, propDic, popup, propFnDic, componentDic }
    }

    return (
        <CTX.Provider value={getContext()}>
            <div className="fullscreen- flex-col- of-hidden- form-generator">
                <Header />
                <div className="h-1- fg-bg-4"></div>
                <div className="flex-row- flex-1-">
                    <Side />
                    <div className="w-1- fg-bg-4"></div>
                    <Preview />
                </div>
                {popup.render()}
            </div>
        </CTX.Provider>
    )

}
const SettingModal: FC<{ item?: I_item, type: I_type, onSubmit: (newItem: I_item) => void, index?: number }> = (props) => {
    const { propDic, getItems, popup, propFnDic }: I_CTX = useContext(CTX)
    const [item, setItem] = useState<I_item>(getItem)
    const itemRef = useRef(item)
    itemRef.current = item
    const changeItem = (key: string, value: any) => {
        setItem({ ...item, [key]: value })
    }
    function getItem(): I_item {
        if (props.item) { return JSON.parse(JSON.stringify(props.item)) }
        return {
            field: '',
            label: '',
            type: props.type,
            options: propDic[props.type].options === 2 ? [] : undefined,
            text: propDic[props.type].text !== 0 ? '' : undefined,
            placeholder: propDic[props.type].placeholder !== 0 ? '' : undefined,
            jalali: propDic[props.type].jalali !== 0 ? false : undefined,

        }
    }

    const input_text = (field: keyof I_item, required: boolean) => {
        return (
            <AIFormInput
                label={field}
                input={<AIText value={item[field]} onChange={(value) => changeItem(field, value)} filter={field === 'field' ? [' '] : undefined} />}
                error={required && !item[field] ? `${field} is required` : undefined}
            />
        )
    }
    const input_number = (field: keyof I_item, required: boolean) => {
        return (
            <AIFormInput
                label={field}
                input={<AINumber value={item[field]} onChange={(value) => changeItem(field, value)} />}
                error={required && !item[field] ? `${field} is required` : undefined}
            />
        )
    }
    const openAddOptionModal = () => {
        popup.addModal({
            header: { title: 'Add Option' }, position: 'center',
            body: (
                <AddOptionModal onSubmit={(option) => {
                    const options = itemRef.current.options || [];
                    const newOptions = [...options, option]
                    changeItem('options', newOptions)
                }} />
            )
        })
    }
    const input_options = (field: I_prop, required: boolean) => {
        return (
            <>
                <AIFormInput
                    label='options'
                    input={(
                        <AIRadio
                            options={[
                                { text: 'off', value: 'off' },
                                { text: 'static', value: 'static' },
                            ]}
                            value={!item.options ? 'off' : 'static'}
                            onChange={(v) => changeItem('options', v === 'off' ? undefined : [])}
                        />
                    )}
                    action={{ text: <PlusIcon />, fn: () => openAddOptionModal() }}
                />
                {
                    !!item.options &&
                    <AIFormInput
                        label='options'
                        input={<SettingOptions options={item.options} onChange={(newOptions) => changeItem('options', newOptions)} />}
                        action={{ text: <PlusIcon />, fn: () => openAddOptionModal() }}
                    />
                }
            </>
        )
    }
    const input_boolean = (field: keyof I_item, required: boolean) => {
        return (
            <AIFormInput
                label={field}
                input={(
                    <AIRadio
                        options={[{ text: 'true', value: true }, { text: 'false', value: false }]}
                        value={item[field]} onChange={(v) => changeItem(field, v)}
                    />
                )}
                error={required && !item[field] ? `${field} is required` : undefined}
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
    const isChange = () => {
        if (!props.item) { return false }
        for (let prop in props.item) {
            const propsItemValue = (props.item as any)[prop];
            const stateItemValue = (item as any)[prop]
            if (propsItemValue !== stateItemValue) { return true }
        }
        return false
    }
    const isDisabled = () => {
        if (!props.item) { return !!error }
        return !!error || !isChange()
    }
    const propKeys: I_prop[] = Object.keys(propFnDic) as I_prop[]
    return null
    // return (
    //     <FormContainer
    //         body={(
    //             <div className="flex-col- h-100-">
    //                 {
    //                     propKeys.map((prop) => {
    //                         if (propDic[props.type][prop] === 0) { return null }
    //                         const fns: { [key in I_propFn]: any } = { text: input_text, options: input_options, boolean: input_boolean, number: input_number }
    //                         return fns[propFnDic[prop]](prop, propDic[props.type][prop] === 2)
    //                     })
    //                 }
    //                 <div className="flex-1-"></div>
    //             </div>
    //         )}
    //         buttons={[
    //             { text: 'Submit', onClick: () => props.onSubmit(item), active: true, disabled: isDisabled() }
    //         ]}
    //     />
    // )
}
const AddOptionModal: FC<{ onSubmit: (v: { text: ReactNode, value: string }) => void }> = ({ onSubmit }) => {
    const [option, setOption] = useState<I_option>({ text: '', value: '' })
    return null
    // return (
    //     <FormContainer
    //         body={(
    //             <div className="flex-col-">
    //                 <AIFormInput
    //                     label='text'
    //                     input={<AIText value={option.text} onChange={(text) => setOption({ ...option, text })} />}
    //                     error={!option.text ? 'text is required' : ''}
    //                 />
    //                 <AIFormInput
    //                     label='value'
    //                     input={<AIText value={option.value} onChange={(value) => setOption({ ...option, value })} />}
    //                     error={!option.value ? 'value is required' : ''}
    //                 />
    //             </div>
    //         )}
    //         buttons={[
    //             { text: 'Submit', onClick: () => onSubmit(option), disabled: !option.text || !option.value }
    //         ]}
    //     />
    // )
}
const SettingOptions: FC<{ options: I_option[], onChange: (options: I_option[]) => void }> = ({ options, onChange }) => {
    function changeOption(index: number, field: 'text' | 'value', value: string) {
        const newOptions: I_option[] = options.map((o, i) => i === index ? { ...o, [field]: value } : o)
        onChange(newOptions)
    }
    function removeOption(index: number) {
        onChange(options.filter((o, i) => i !== index))
    }
    function input_layout(option: I_option, field: 'text' | 'value', index: number) {
        const p: any = { className: 'w-100- brd-none-', value: option[field], onChange: (value: any) => changeOption(index, field, value) }
        return (<AIFormInput input={(<AIText {...p} />)} error={!option[field] ? `${field} is required` : ''} />)
    }
    function option_layout(option: I_option, index: number) {
        return (
            <tr>
                <td className="flex-1-">{input_layout(option, 'text', index)}</td>
                <td className="flex-1-">{input_layout(option, 'value', index)}</td>
                <td><div className="flex-row- align-vh-" onClick={() => removeOption(index)}><DeleteIcon /></div></td>
            </tr>
        )
    }
    const th = (text: ReactNode) => <th className='h-36-'>{text}</th>
    return (
        <table border={1} className='w-100-' style={{ borderCollapse: 'collapse' }}>
            <thead>{th('text')}{th('value')}{th('')}</thead>
            <tbody>{options.map((o, i) => option_layout(o, i))}</tbody>
        </table>
    )
}
const Header: FC = () => {
    return (
        <div className="flex-row- align-v- p-12- fg-bg-2 h-48-">

        </div>
    )
}
const Side: FC = () => {
    const { addItem, getItems, editItem, removeItem, propDic }: I_CTX = useContext(CTX)

    const item_layout = (item: I_item, index: number) => {
        return (
            <div key={index} className='h-48- p-h-12- flex-row- align-v- fg-side-item'>
                <div className="flex-1-">{`${item.type}(${item.field})`}</div>
                <AISelect
                    className="w-fit- bg-none- brd-none- br-0-"
                    caret={false}
                    text={<DotsIcon />}
                    options={[
                        { text: 'Edit', onClick: () => editItem(index) },
                        { text: 'Remove', onClick: () => removeItem(index) },
                    ]}
                />
            </div>
        )
    }
    return (
        <div className="w-300- h-100-">
            <AISelect
                text='Add Item'
                className='fg-bg-2 brd-none- br-0-'
                style={{ height: 40 }}
                options={Object.keys(propDic)}
                option={{
                    text: 'option', value: 'option',
                    onClick: (option) => addItem(option)
                }}
                popover={{ fitHorizontal: true }}
            />
            <div className="flex-col-">
                {getItems().map((o, i) => item_layout(o, i))}
            </div>
        </div>
    )
}
type I_preview_tab = 'preview' | 'code'
const Preview: FC = () => {
    const { getItems, componentDic }: I_CTX = useContext(CTX)
    const [tabs] = useState<I_preview_tab[]>(['preview', 'code'])
    const [tab, setTab] = useState<I_preview_tab>('preview')
    function getDic() {
        const rows = getItems();
        const dic: { [key: string]: I_item[] } = {}
        let index = 0;
        for (let row of rows) {
            let { rowGroup } = row;
            if (!rowGroup) { rowGroup = index + 'order'; index++ }
            dic[rowGroup] = dic[rowGroup] || []
            dic[rowGroup].push(row)
        }
        return dic
    }
    const item_layout = (item: I_item) => {
        const Comp = componentDic[item.type]
        const props = { ...item, options: !item.options ? undefined : item.options, label: undefined }
        return (
            <AIFormInput
                label={item.label}
                input={<Comp {...props} />}
            />
        )
    }
    const row_layout = (items: I_item[]) => {
        return (
            <div className="flex-row- gap-12-">
                {items.map((o) => item_layout(o))}
            </div>
        )
    }
    const dic: { [key: string]: I_item[] } = getDic()
    const keys = Object.keys(dic)
    return (
        <div className="flex-1-">
            <AITabs
                className="fg-bg-2 br-0-"
                options={tabs}
                option={{
                    text: (option) => {
                        return option[0].toUpperCase() + option.slice(1)
                    },
                    value: 'option'
                }}
                value={tab}
                onChange={(v) => setTab(v)}
            />
            <div className={`flex-1- p-${tab === 'preview' ? '12' : '0'}-`}>
                {tab === 'preview' && keys.map((key) => row_layout(dic[key]))}
                {tab === 'code' && Code(JSON.stringify(getItems(), null, 4))}
            </div>
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