import { FC, ReactNode, useRef, useState } from "react";
import './index.css';
import AIOInput, { AITabs, AIText } from "../../npm/aio-input";
import Icon from "@mdi/react";
import { mdiClose, mdiCog, mdiContentSave, mdiDotsVertical, mdiFileCode, mdiPlusThick } from "@mdi/js";
import { DragClass } from "../../npm/aio-utils";
import AIOPopup from "../../npm/aio-popup";
type I_model = any
type I_tab = 'variables' | 'lists'
type I_block = { rows: I_row[] }
type I_row = { cells?: I_cell[], rows?: I_row[] }
type I_cell = string
type I_mode = 'editor' | 'preview'
type I_rule = {
    date: string,
    model: I_model,
    text: string,
    name: string,
    id: number
}
const Formula: FC = () => {
    const [rules, setRules] = useState<I_rule[]>(getRules)
    const [selectedRule, setSelectedRule] = useState<I_rule>()
    const [tab, setTab] = useState<I_tab>('variables')
    const [popup] = useState<AIOPopup>(new AIOPopup())
    const [variables, setVariables] = useState<any[]>(getVariables)
    const [lists, setLists] = useState<any[]>(getLists);
    const [mode, setMode] = useState<I_mode>('editor')
    const [model, setModel] = useState<I_model>({})
    const [history, setHistory] = useState<I_rule[]>(getHistory)
    function getRules(): I_rule[] {
        return [
            { 
                
                model: {"field0-1-1": "rule1","field0-2-4-3": "text1","field0-2-7-2": "text2","field0-2-0-2": true,"field0-2-1-2": true}, 
                text: 'text', name: 'Rule1', id: 0, date: '1403/3/3' 
            },
            { 
                model: {"field0-1-1": "rule1","field0-2-4-3": "text1","field0-2-7-2": "text2","field0-2-0-2": true,"field0-2-1-2": true}, 
                text: 'text', name: 'Rule2', id: 1, date: '1403/3/3' 
            },
            { 
                model: {"field0-1-1": "rule1","field0-2-4-3": "text1","field0-2-7-2": "text2","field0-2-0-2": true,"field0-2-1-2": true}, 
                text: 'text', name: 'Rule3', id: 2, date: '1403/3/3' 
            }
        ]
    }
    function selectRule(rule:I_rule){
        changeModel(rule.model)
        setSelectedRule(rule)
    }
    function getHistory(): I_rule[] {
        return [
            { 
                model: {"field0-1-1": "rule1","field0-2-4-3": "text1","field0-2-7-2": "text2","field0-2-0-2": true,"field0-2-1-2": true}, 
                date: '1403/2/3 12:00', text: 'text', name: 'Rule1', id: 0,
            },
            { 
                model: {"field0-1-1": "rule1","field0-2-4-3": "text1","field0-2-7-2": "text2","field0-2-0-2": true,"field0-2-1-2": true}, 
                date: '1403/3/3 12:00', text: 'text', name: 'Rule1', id: 0 
            },
            { 
                model: {"field0-1-1": "rule1","field0-2-4-3": "text1","field0-2-7-2": "text2","field0-2-0-2": true,"field0-2-1-2": true}, 
                date: '1403/3/4 12:00', text: 'text', name: 'Rule1', id: 0 
            }
        ]
    }
    const modelRef = useRef(model);
    modelRef.current = model;
    const [Drag] = useState<DragClass>(new DragClass({ callback: onDrag }))
    function onDrag(dragData: any, dropData: any) {
        const model = modelRef.current
        const { item } = dragData;
        const { field } = dropData;
        const newValue = (model[field] || '') + item.text;
        changeModel({ ...model, [field]: newValue })
    }
    const [blocks, setBlocks] = useState<I_block[]>(
        [
            {
                rows: [
                    { cells: ['import com.boxi.ruleEngine.dto.RuleFact;'] },
                    { cells: ['rule', 'text(ruleName)'] },
                    {
                        rows: [
                            { cells: ['indent','no-loop', 'select(boolean)'] },
                            { cells: ['indent','lock-on-active', 'select(boolean)'] },
                            { cells: ['indent','when'] },
                            { cells: ['indent','indent', 'ruleFact:RuleFact('] },
                            { cells: ['indent','indent', 'indent', 'textarea(then)'] },
                            { cells: ['indent','indent', ')'] },
                            { cells: ['indent','then'] },
                            { cells: ['indent','indent', 'textarea(then)'] },
                        ]
                    },
                    { cells: ['end'] }
                ]
            }
        ]
    )
    function getVariables(): any[] {
        return [
            { text: '$c' },
            { text: '$w' }
        ]
    }
    function getLists() {
        return [
            { text: 'boolean', options: [{ text: 'true', value: true }, { text: 'false', value: false }] },
        ]
    }
    function nav_layout() {
        return (
            <nav className='rule-engine-nav'>
                <div className='rule-engine-app-title'>RULE ENGINE</div>
                {
                    !!selectedRule &&
                    <>
                        <div className="rule-engine-rule-name">{selectedRule.name}</div>
                        <div className="flex-row w-144 align-vh"><button type='button' onClick={() => setSelectedRule(undefined)}>Go To Rules</button></div>
                    </>
                }
            </nav>
        )
    }
    function left_side_layout() {
        const items = tab === 'variables' ? variables : lists;
        return (
            <div className="w-204 flex-col">
                <AITabs
                    value={tab}
                    onChange={(tab) => setTab(tab)}
                    options={[
                        { text: 'lists', value: 'lists' },
                        { text: 'variables', value: 'variables' },
                    ]}
                />
                <div className="msf flex-row align-v p-6 align-vh">
                    <button type='button' className='flex-row align-v' style={{ color: 'orange', background: 'none' }}><Icon path={mdiPlusThick} size={0.7} />Add Variable</button>
                </div>
                <div className="flex-col gap-3 brd-c-5 p-3 flex-1 ofy-auto">
                    {items.map((o: any) => left_side_item_layout(o))}
                </div>
            </div>
        )
    }
    function history_layout() {

        return (
            <div className="w-204 flex-col">
                <div className="msf flex-row align-v p-6 align-vh">
                    History
                </div>
                <div className="flex-col gap-3 brd-c-5 p-3 flex-1 ofy-auto">
                    {history.reverse().map((o: I_rule) => historyItem_layout(o))}
                </div>
            </div>
        )
    }
    function historyItem_layout(historyItems: I_rule) {
        return (
            <div key={historyItems.date} className="flex-row p-6 brd-c-5 flex-row align-v">
                <div className="flex-1 flex-row align-v">
                    <div className="w-36 h-24 flex-row align-vh" style={{ color: 'orange' }}><Icon path={mdiFileCode} size={0.7} /></div>
                    <div className="fs-12">{historyItems.date}</div>
                </div>
            </div>
        )
    }
    function removeVariable(item: { text: string }) {
        popup.addConfirm({
            text: 'Are you sure you want to delete this item',
            onSubmit: async () => {
                const newVariables = variables.filter((o) => o.text !== item.text)
                setVariables(newVariables);
                return true
            },
            submitText: 'Yes',
            canselText: 'No',
            title: 'Remove Variable',
            subtitle: item.text
        })
    }
    function left_side_item_layout(item: any) {
        return (
            <div key={item.text} className="flex-row p-6 brd-c-5 flex-row align-v" {...Drag.getDragAttrs({ tab, item })}>
                <div className="flex-1">{item.text}</div>
                <div className="flex-row align-vh" onClick={() => removeVariable(item)}><Icon path={mdiClose} size={0.7} /></div>
            </div>
        )
    }
    function changeModel(newModel:I_model){
        console.log(newModel)
        setModel({...newModel})
    }
    function changeModelByField(field: string, value: any) {
        const model = modelRef.current
        changeModel({ ...model, [field]: value })
    }
    function body_layout() {
        return (
            <div className="flex-col w-100">
                <AITabs
                    value={mode} onChange={(mode) => setMode(mode)} options={[{ text: 'Editor', value: 'editor' }, { text: 'Preview', value: 'preview' }]}
                    before={(
                        <button className='rule-engine-save align-v flex-row gap-6 fs-14 bold'>
                            <Icon path={mdiContentSave} size={1} />
                            Save
                        </button>
                    )}
                />
                <div className="flex-col flex-1 p-12 gap-3 ofy-auto w-100">
                    {blocks.map((o, i) => rows_layout(o.rows, [i]))}
                </div>
            </div>
        )
    }
    function rows_layout(rows: I_row[], nestedIndex: number[]): ReactNode[] {
        return rows.map((o: I_row, rowIndex: number) => {
            const newNestedIndex = [...nestedIndex, rowIndex]
            if (o.rows) {
                return rows_layout(o.rows, newNestedIndex)
            }
            else if (o.cells) {
                return row_layout(o, newNestedIndex)
            }
            else { return null }
        })
    }
    function row_layout(o: I_row, nestedIndex: number[]) {
        const { cells = [] } = o;
        if (!cells.length) { return null }
        return (
            <div className="flex-row align-v">
                {cells_layout(cells, nestedIndex)}
                {options_layout()}
            </div>
        )
    }
    function options_layout() {
        return (
            <div className="flex-row align-vh">
                <Icon path={mdiDotsVertical} size={0.8} />
            </div>
        )
    }
    function cells_layout(cells: I_cell[], nestedIndex: number[]) {
        return (
            <div className="flex-row flex-1 align-v gap-6">
                {cells.map((cell, cellIndex) => cell_layout(cell, [...nestedIndex, cellIndex]))}
            </div>
        )
    }
    function cell_layout(cell: string, nestedIndex: number[]) {
        const field = 'field' + nestedIndex.join('-')
        if (cell.indexOf('select(') === 0) {
            const listName = cell.slice(7, cell.length - 1);
            console.log(field, 'select')
            return select_layout(field, listName)
        }
        if (cell.indexOf('text(') === 0) {
            console.log(field, 'text')
            return text_layout(field)
        }
        if (cell.indexOf('textarea(') === 0) {
            console.log(field, 'textarea')
            return textarea_layout(field)
        }
        if (cell === 'indent') {
            return (
                <div className="w-12 shrink-0 flex-row align-vh">
                    <div className="w-1 h-100 bg-d-60"></div>
                </div>
            )
        }
        return (
            <div className="flex-row">{cell}</div>
        )
    }
    function select_layout(selectfield: string, listName: string) {
        const list = lists.find((o) => o.text === listName)
        const { options } = list
        const model = modelRef.current
        let value = model[selectfield]
        return (
            <AIOInput
                type='select' className='w-fit bg-l-5 brd-none' options={options} value={value}
                onChange={(newValue) => changeModelByField(selectfield, newValue)}
                validations={['required']} lang='en' showErrors={false}
            />
        )
    }
    function text_layout(field: string) {
        const model = modelRef.current
        return (
            <AIOInput
                type='text' className='w-fit bg-l-5 brd-none' value={model[field] || ''}
                onChange={(newValue) => changeModelByField(field, newValue)}
                validations={['required']} lang='en' showErrors={false}
            />
        )
    }
    function textarea_layout(field: string) {
        const dragAttrs = Drag.getDropAttrs({ field });
        const model = modelRef.current
        return (
            <AIOInput
                attrs={{ ...dragAttrs }} type='textarea' className='flex-1 bg-l-5 brd-none' inputAttrs={{ className: 'resize-v' }} value={model[field] || ''}
                onChange={(newValue) => changeModelByField(field, newValue)} autoHighlight={false}
                validations={['required']} lang='en' showErrors={false}
            />
        )
    }
    return (
        <div className="rule-engine fullscreen flex-col">
            {nav_layout()}
            {
                !!selectedRule &&
                <div className=" flex-row flex-1">
                    {left_side_layout()}
                    {body_layout()}
                    {popup.render()}
                    {history_layout()}
                </div>
            }
            {
                !selectedRule &&
                <div className="flex-col align-h flex-1 p-12">
                    <div className="flex-col align-h h-100 p-12 br-12 w-100">
                        <div className="fs-24 m-b-12" style={{ color: 'orange' }}>Rules</div>
                        <div className="flex-1 ofy-auto flex-col gap-12 w-100 align-h p-12">
                            {
                                rules.map((o) => {
                                    return (
                                        <div className="rule-button" onClick={()=>selectRule(o)}>
                                            <div className="">{o.name}</div>
                                            <div className="op-60 fs-p70">{o.date}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Formula