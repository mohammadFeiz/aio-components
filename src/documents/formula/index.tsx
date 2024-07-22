import { createContext, FC, ReactNode, useContext, useRef, useState } from "react";
import './index.css';
import AIOInput, { AISelect, AITable, AITabs, AIText } from "../../npm/aio-input";
import Icon from "@mdi/react";
import { mdiArrowExpandHorizontal, mdiCheck, mdiCheckBold, mdiClose, mdiCog, mdiContentSave, mdiDelete, mdiDotsHorizontal, mdiDotsVertical, mdiFileCode, mdiHistory, mdiHome, mdiPlusCircleOutline, mdiPlusThick } from "@mdi/js";
import { DragClass, GetRandomNumber } from "../../npm/aio-utils";
import AIOPopup from "../../npm/aio-popup";
type I_template = { id: number, rows: I_template_row[], name: string };
type I_template_row = { cells: I_template_cell[] }
type I_template_cell = string

const mockTemplate: I_template = {
    name: 'template1',
    id: 1235565,
    rows: [
        { cells: ['import com.boxi.ruleEngine.dto.RuleFact;'] },
        { cells: ['rule', 'text()'] },
        {
            cells: [
                'indent',
                'no-loop',
                'select(["true","false"])'
            ]
        },
        {
            cells: [
                'indent',
                'lock-on-active',
                'select(["true","false"])'
            ]
        },
        { cells: ['indent', 'when'] },
        { cells: ['indent', 'indent', 'ruleFact:RuleFact('] },
        { cells: ['indent', 'indent', 'indent', 'textarea()'] },
        { cells: ['indent', 'indent', ')'] },
        { cells: ['indent', 'then'] },
        { cells: ['indent', 'indent', 'textarea()'] },
        { cells: ['end'] }
    ]
}
type I_model = any
type I_row = { cells?: I_cell[], rows?: I_row[] }
type I_cell = string
type I_rule = {
    date: string,
    model: I_model,
    text: string,
    name: string,
    id: number,
    templateId: number,
    variables: I_variable[]
}
type I_variable = any
type I_CTX = {
    selectedRule?: I_rule,
    Drag: DragClass,
    model: I_model,
    changeModelByField: (field: string, value: any) => void,
    history: I_rule[],
    rules: I_rule[],
    selectRule: (rule: I_rule | undefined) => void,
    popup: AIOPopup,
    templates: I_template[]
}
const CTX = createContext({} as any)
const Formula: FC = () => {
    const [rules, setRules] = useState<I_rule[]>(getRules);
    const [templates, setTemplates] = useState<I_template[]>(getTemplates)
    const [selectedRule, setSelectedRule] = useState<I_rule>()
    const [popup] = useState<AIOPopup>(new AIOPopup())
    const [model, setModel] = useState<I_model>({})
    const [history, setHistory] = useState<I_rule[]>(getHistory)
    function getTemplates(): I_template[] {
        return [mockTemplate]
    }
    function getRules(): I_rule[] {
        return [
            {
                model: { "field0-1-1": "rule1", "field0-2-4-3": "text1", "field0-2-7-2": "text2", "field0-2-0-2": true, "field0-2-1-2": true },
                text: 'text', name: 'Rule1', id: 0, date: '1403/3/3', templateId: 0, variables: [{ text: '$c' }, { text: '$w' }]
            },
            {
                model: { "field0-1-1": "rule1", "field0-2-4-3": "text1", "field0-2-7-2": "text2", "field0-2-0-2": true, "field0-2-1-2": true },
                text: 'text', name: 'Rule2', id: 1, date: '1403/3/3', templateId: 0, variables: [{ text: '$c' }, { text: '$w' }]
            },
            {
                model: { "field0-1-1": "rule1", "field0-2-4-3": "text1", "field0-2-7-2": "text2", "field0-2-0-2": true, "field0-2-1-2": true },
                text: 'text', name: 'Rule3', id: 2, date: '1403/3/3', templateId: 0, variables: [{ text: '$c' }, { text: '$w' }]
            }
        ]
    }
    function selectRule(rule: I_rule | undefined) {
        if (rule) { changeModel(rule.model) }
        setSelectedRule(rule)
    }
    function getHistory(): I_rule[] {
        return [
            {
                model: { "field0-1-1": "rule1", "field0-2-4-3": "text1", "field0-2-7-2": "text2", "field0-2-0-2": true, "field0-2-1-2": true },
                date: '1403/2/3 12:00', text: 'text', name: 'Rule1', id: 0, templateId: 0, variables: [{ text: '$c' }, { text: '$w' }]
            },
            {
                model: { "field0-1-1": "rule1", "field0-2-4-3": "text1", "field0-2-7-2": "text2", "field0-2-0-2": true, "field0-2-1-2": true },
                date: '1403/3/3 12:00', text: 'text', name: 'Rule1', id: 0, templateId: 0, variables: [{ text: '$c' }, { text: '$w' }]
            },
            {
                model: { "field0-1-1": "rule1", "field0-2-4-3": "text1", "field0-2-7-2": "text2", "field0-2-0-2": true, "field0-2-1-2": true },
                date: '1403/3/4 12:00', text: 'text', name: 'Rule1', id: 0, templateId: 0, variables: [{ text: '$c' }, { text: '$w' }]
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

    function changeModel(newModel: I_model) {
        setModel({ ...newModel })
    }
    function changeModelByField(field: string, value: any) {
        const model = modelRef.current
        changeModel({ ...model, [field]: value })
    }

    function getContext(): I_CTX { return { rules, selectRule, selectedRule, popup, Drag, model: modelRef.current, changeModelByField, history, templates } }
    return (
        <CTX.Provider value={getContext()}>
            <div className="rule-engine fullscreen flex-col">
                <Nav />
                {!!selectedRule ? <RulePage /> : <Home />}
                {popup.render()}
            </div>
        </CTX.Provider>
    )
}
export default Formula

type I_tab = 'variables' | 'lists'
const RulePage: FC = () => {
    const [tab, setTab] = useState<I_tab>('variables')

    function left_side_layout() {
        return (
            <div className="w-204 flex-col shrink-0 rule-engine-border-right">
                <AITabs
                    value={tab} onChange={(tab) => setTab(tab)}
                    options={[{ text: 'lists', value: 'lists' }, { text: 'variables', value: 'variables' }]}
                />
                {tab === 'variables' && <Variables />}
            </div>
        )
    }

    return (
        <div className=" flex-row flex-1">
            {left_side_layout()}
            <RuleCode />
            <History />
        </div>
    )
}
const Nav: FC = () => {
    const { selectedRule, selectRule }: I_CTX = useContext(CTX)
    return (
        <nav className='rule-engine-nav'>
            <div className='rule-engine-app-title'>RULE ENGINE</div>
            {
                !!selectedRule &&
                <>
                    <div className="rule-engine-rule-name">{selectedRule.name}</div>
                    <div className="flex-row w-144 align-vh">
                        <button type='button' className='flex-row align-v gap-6' onClick={() => selectRule(undefined)}>
                            <Icon path={mdiHome} size={0.9} />
                            Home
                        </button>
                    </div>
                </>
            }
        </nav>
    )
}
const Variables: FC = () => {
    const { selectedRule, Drag }: I_CTX = useContext(CTX);
    function item_layout(item: any) {
        return (
            <div key={item.text} className="flex-row p-6 brd-c-5 flex-row align-v" {...Drag.getDragAttrs({ item })}>
                <div className="flex-1">{item.text}</div>
            </div>
        )
    }
    function hedaer_layout() {
        return (
            <div className="msf flex-row align-v p-6 align-vh">
                <button type='button' className='flex-row align-v' style={{ color: 'orange', background: 'none' }}>
                    <Icon path={mdiPlusThick} size={0.7} />Add Variable
                </button>
            </div>
        )
    }
    function body_layout() {
        if (!selectedRule) { return null }
        return (
            <div className="flex-col gap-3 p-3 flex-1 ofy-auto">
                {selectedRule.variables.map((o: any) => item_layout(o))}
            </div>
        )
    }
    return (<>{hedaer_layout()} {body_layout()}</>)
}
type I_mode = 'editor' | 'preview'
const RuleCode: FC = () => {
    const { selectedRule, templates }: I_CTX = useContext(CTX)
    const [template] = useState<I_template>(getTemplate)
    function getTemplate(): I_template {
        return templates.find((o: I_template) => o.id === selectedRule?.templateId) as I_template
    }
    const [mode, setMode] = useState<I_mode>('editor')
    if (!selectedRule) { return null }
    function template_rows_layout(): ReactNode[] {
        const { rows } = template;
        return rows.map((row: I_template_row, rowIndex: number) => template_row_layout(row, rowIndex))
    }
    function template_row_layout(row: I_template_row, rowIndex: number) {
        const { cells = [] } = row;
        if (!cells.length) { return null }
        return (
            <div className="flex-row align-v">
                {template_cells_layout(cells, rowIndex)}
                {options_layout()}
            </div>
        )
    }
    function options_layout() {
        return (<div className="flex-row align-vh"><Icon path={mdiDotsVertical} size={0.8} /></div>)
    }
    function template_cells_layout(cells: I_template_cell[], rowIndex: number) {
        return (
            <div className="flex-row flex-1 align-v gap-6 h-100">
                {cells.map((cell, cellIndex) => <CodeCell cell={cell} rowIndex={rowIndex} cellIndex={cellIndex} />)}
            </div>
        )
    }
    return (
        <div className="flex-col w-100 rule-engine-border-left rule-engine-border-right">
            <AITabs
                value={mode} onChange={(mode) => setMode(mode)} options={[{ text: 'Editor', value: 'editor' }, { text: 'Preview', value: 'preview' }]}
                before={(
                    <button className='rule-engine-save align-v flex-row gap-6 fs-14 bold'>
                        <Icon path={mdiContentSave} size={1} />Save
                    </button>
                )}
            />
            <div className="flex-col flex-1 p-12 gap-3 ofy-auto w-100">
                {template_rows_layout()}
            </div>
        </div>
    )
}

const CodeCell: FC<{ cell: string, rowIndex: number, cellIndex: number }> = ({ cell, rowIndex, cellIndex }) => {
    const { Drag, model, changeModelByField }: I_CTX = useContext(CTX);
    function select_layout(selectfield: string, options: { text: string, value: any }[]) {
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
        return (
            <AIOInput
                attrs={{ ...dragAttrs }} type='textarea' className='flex-1 bg-l-5 brd-none' inputAttrs={{ className: 'resize-v' }} value={model[field] || ''}
                onChange={(newValue) => changeModelByField(field, newValue)} autoHighlight={false}
                validations={['required']} lang='en' showErrors={false}
            />
        )
    }
    const field = `field-${rowIndex}-${cellIndex}`
    if (cell.indexOf('select(') === 0) {
        const optionsString = cell.slice(7, cell.length - 1);
        const options = JSON.parse(optionsString)
        return select_layout(field, options)
    }
    if (cell.indexOf('text(') === 0) { return text_layout(field) }
    if (cell.indexOf('textarea(') === 0) { return textarea_layout(field) }
    if (cell === 'indent') { return <Indent /> }
    return (<div className="flex-row">{cell}</div>)
}

const History: FC = () => {
    const { history }: I_CTX = useContext(CTX);
    function header_layout() {
        return (
            <div className="msf flex-row align-v p-6 align-vh bg-d-20 fs-14 gap-6" style={{ color: 'orange' }}>
                <Icon path={mdiHistory} size={0.8} />
                History
            </div>
        )
    }
    function item_layout(historyItems: I_rule) {
        return (
            <div key={historyItems.date} className="flex-row p-6 brd-c-5 flex-row align-v">
                <div className="flex-1 flex-row align-v">
                    <div className="w-36 h-24 flex-row align-vh" style={{ color: 'orange' }}><Icon path={mdiFileCode} size={0.7} /></div>
                    <div className="fs-12">{historyItems.date}</div>
                </div>
            </div>
        )
    }
    function items_layout() {
        return (
            <div className="flex-col gap-3 p-3 flex-1 ofy-auto">
                {history.reverse().map((o: I_rule) => item_layout(o))}
            </div>
        )
    }
    return (<div className="w-204 flex-col shrink-0 rule-engine-border-left">{header_layout()} {items_layout()}</div>)
}


const Home: FC = () => {
    const { rules, templates, selectRule }: I_CTX = useContext(CTX);
    const [selectedTemplate, setSelectedTemplate] = useState<I_template>(templates[0])
    function part_header_layout(label: string, onAdd: () => void) {
        return (
            <div className="fs-24 m-b-12 flex-row align-between align-v w-100 p-h-12 h-48" style={{ color: 'orange', background: 'rgba(255,255,255,0.2)' }}>
                <div className="msf">{label}</div>
                <div className="flex-row align-vh" onClick={onAdd}><Icon path={mdiPlusCircleOutline} size={1.4} /></div>
            </div>
        )
    }
    function part_body_layout(items: any[]) {
        return (
            <div className="flex-1 ofy-auto flex-col gap-12 w-100 align-h p-12">{items}</div>
        )
    }
    function part_layout(label: string, items: any[]) {
        return (
            <div className="flex-col align-h h-100 p-12 br-12 w-100">
                {part_header_layout(label, () => { })}
                {part_body_layout(items)}
            </div>
        )
    }
    function rules_layout() {
        return part_layout(
            'Rules',
            rules.map((o) => part_item_layout({ id: o.id, text: o.name, subtext: o.date, onClick: () => selectRule(o) }))
        )
    }
    function templates_layout() {
        return part_layout(
            'Templates',
            templates.map((template: I_template) => part_item_layout({ id: template.id, text: template.name, onClick: () => setSelectedTemplate(template) }))
        )
    }
    function part_item_layout(p: { text: string, id: number, subtext?: string, onClick: () => void }) {
        const { id, text, subtext, onClick } = p;
        return (
            <div key={id} className="rule-button" onClick={onClick}>
                <div className="">{text}</div>
                {subtext !== undefined && <div className="op-60 fs-p70">{subtext}</div>}
            </div>
        )
    }
    if (selectedTemplate) {
        return <Template mode='edit' template={selectedTemplate} />
    }
    return (
        <div className="flex-row align-h flex-1 p-12">
            {rules_layout()}
            {templates_layout()}
        </div>
    )
}
type I_templateContext = {
    popup:AIOPopup,
    removeCell:(rowIndex:number)=>void,
    addCell:(type: 'static_text' | 'select' | 'textbox' | 'code_block' | 'indent', rowIndex: number, isEmptyRow: boolean)=>void,
    changeCell:(value:string,rowIndex:number,cellIndex:number)=>void
}
const TemplateContext = createContext({} as any);
const Template: FC<{ mode: 'add' | 'edit', template?: I_template }> = (props) => {
    const { popup }: I_CTX = useContext(CTX)
    const { mode } = props;
    const [template, setTemplate] = useState<I_template>(getTemplate)
    function getTemplate(): I_template {
        if (mode === 'edit') {
            return JSON.parse(JSON.stringify(props.template))
        }
        return { id: GetRandomNumber(100000, 900000), name: '', rows: [] }
    }
    function header_layout() {
        let title = ''
        if (mode === 'edit') { title = `Edit Template (${template.name})` }
        else if (mode === 'add') { title = 'Add Template' }
        return (<div className="bg-d-20 p-h-24 fs-14 bold flex-row h-36 align-v">{title}</div>)
    }
    function body_layout() {
        return (
            <div className="flex-col p-24">
                {template.rows.map((o, rowIndex) => <TemplateRow key={rowIndex} row={o} rowIndex={rowIndex}/>)}
            </div>
        )
    }
    function changeCell(value:string,rowIndex:number,cellIndex:number){
        const row:I_template_row = template.rows[rowIndex]
        const newCells:I_template_cell[] = row.cells.map((cell,i)=>i !== cellIndex?cell:value)
        const newRow:I_template_row = {...row,cells:newCells}
        const newRows:I_template_row[] = template.rows.map((row,i)=>i !== rowIndex?row:newRow)
        setTemplate({...template,rows:newRows})
    }
    function addCell(type: 'static_text' | 'select' | 'textbox' | 'code_block' | 'indent', rowIndex: number, isEmptyRow: boolean) {
        let newRows: I_template_row[] = []
        let newCell = '';
        if (type === 'static_text') { newCell = 'text' }
        else if (type === 'textbox') { newCell = 'text()' }
        else if (type === 'code_block') { newCell = 'textarea()' }
        else if (type === 'indent') { newCell = 'indent' }
        else { newCell = 'select([])' }
        if (isEmptyRow) {
            let tempRows:I_template_row[] = []
            for (let i = 0; i < template.rows.length; i++) {
                if (i === rowIndex) {tempRows.push(template.rows[i],{ cells: [newCell] })}
                else {tempRows.push(template.rows[i])}
            }
            newRows = tempRows
        }
        else {newRows = template.rows.map((row, i) => i !== rowIndex?row:{...row,cells: [...row.cells, newCell]})}
        setTemplate({ ...template, rows: newRows })
    }
    function removeCell(rowIndex: number) {
        const row = template.rows[rowIndex];
        const newRow: I_template_row = { ...row, cells: row.cells.filter((cell, i) => i !== row.cells.length - 1) }
        let newRows: I_template_row[] = []
        if (!newRow.cells.length) { newRows = template.rows.filter((o, i) => i !== rowIndex) }
        else { newRows = template.rows.map((row, i) => i !== rowIndex ? row : newRow) }
        setTemplate({ ...template, rows: newRows })
    }
    function getContext():I_templateContext{return {popup,removeCell,addCell,changeCell}}
    return (
        <TemplateContext.Provider value={getContext()}>
            <div className="h-100 w-100 ofy-auto">{header_layout()} {body_layout()}</div>
        </TemplateContext.Provider>
    )
}
const TemplateRow:FC<{row:I_template_row,rowIndex:number}> = ({row,rowIndex})=>{
    const {removeCell,addCell}:I_templateContext = useContext(TemplateContext);
    function addCell_layout(rowIndex: number, isEmptyRow: boolean) {
        return (
            <div className="flex-row align-v" key={`addRow-${rowIndex}-${isEmptyRow}`}>
                <button
                    type='button' className='bg-none brd-none w-24 h-24 flex-row align-vh p-0'
                    style={{ color: 'orange', opacity: isEmptyRow ? 0 : 1 }}
                    onClick={() => removeCell(rowIndex)}
                >
                    <Icon path={mdiDelete} size={0.7} />
                </button>
                <AISelect
                    className='w-24 h-24 p-0 m-l-6 brd-none p-0' caret={false}
                    style={{ color: 'lightgreen', background: 'none' }}
                    text={<Icon path={mdiPlusThick} size={0.7} />}
                    option={{
                        before: () => <Icon path={mdiPlusThick} size={0.7} />
                    }}
                    options={[
                        { text: 'Static Text', value: 'static_text' },
                        { text: 'Select', value: 'select' },
                        { text: 'Textbox', value: 'textbox' },
                        { text: 'Code Block', value: 'code_block' },
                        { text: 'Indent', value: 'indent' },
                    ]}
                    onChange={(v) => addCell(v, rowIndex, isEmptyRow)}
                />
            </div>
        )
    }
    return (
        <>
            <div key={rowIndex} className="flex-row align-v gap-12">
                {addCell_layout(rowIndex, false)}
                {row.cells.map((o, cellIndex) => <TemplateCell cell={o} rowIndex={rowIndex} cellIndex={cellIndex}/>)}
            </div>
            {addCell_layout(rowIndex, true)}
        </>
    )
}
const TemplateCell:FC<{cell:I_template_cell,rowIndex:number,cellIndex:number}> = ({cell,rowIndex,cellIndex})=>{
    const {popup,changeCell}:I_templateContext = useContext(TemplateContext)
    function openOptionsModal(options:string[],rowIndex:number,cellIndex:number) {
        popup.addModal({
            position: 'center',header: { title: 'Edit Options' },
            body: () => {
                return (
                    <CellOptions 
                        options={options} 
                        onChange={(newOptions)=>{
                            const options = newOptions.map((o)=>o.text)
                            const newCell:I_template_cell = `select(${JSON.stringify(options)})`
                            changeCell(newCell,rowIndex,cellIndex)
                            popup.removeModal()
                        }}
                    />
                )
            }
        })
    }
    function getContent(){
        if (cell === 'indent') {return (<div className="w-16 h-24 flex-row align-vh m-2 op-15"><Icon path={mdiArrowExpandHorizontal} size={0.8} /></div>)}
        if (cell.indexOf('text(') === 0) {return <div className="p-h-6 br-4" style={{ background: '#0069ff' }}>TextBox</div>}
        if (cell.indexOf('textarea(') === 0) {return <div className="p-h-6 br-4" style={{ background: '#0069ff' }}>Code Block</div>}
        if (cell.indexOf('select(') === 0) {return select_layout(cell,rowIndex,cellIndex)}
        return static_text_layout(cell,rowIndex,cellIndex)
    }
    function select_layout(cell:I_template_cell,rowIndex:number,cellIndex:number){
        const options:string[] = JSON.parse(cell.slice(7, cell.length - 1))
        return (
            <div 
                className="p-h-6 br-4 relative pointer flex-row align-v" style={{ background: '#0069ff' }} 
                onClick={() => openOptionsModal(options,rowIndex,cellIndex)}
            >
                Select
                <div className="fs-p70 op-70 m-l-6">{` ( ${options.length} options )`}</div> 
                {select_cell_icon()}
            </div>
        )
    }
    function select_cell_icon(){
        return (
            <div 
                className="absolute w-16 h-16 flex-row align-vh br-100" 
                style={{ background: 'orange', top: -8, right: -8 }}
            ><Icon path={mdiDotsHorizontal} size={0.6} /></div>
        )
    }
    function static_text_layout(cell:I_template_cell,rowIndex:number,cellIndex:number){
        const width = cell.length * 6.2 + 12
        return (
            <AIText
                value={cell} style={{ width }} autoHighlight={false} className="bg-0 p-h-0 br-4 m-l-6 brd-none h-24"
                onChange={(newValue) => changeCell(newValue,rowIndex,cellIndex)}
            />
        )
    }
    return (<div key={`rowIndex-${rowIndex}-cellIndex-${cellIndex}`} className="flex-row align-v">{getContent()}</div>)
}
const Indent: FC = () => <div className="w-12 h-100 shrink-0 flex-row align-v shrink-0"><div className="w-1 h-100 bg-l-20"></div></div>
type I_option = { text: string };
const CellOptions: FC<{ options: string[],onChange:(newOptions:I_option[])=>void }> = (props) => {
    const [options, setOptions] = useState<I_option[]>(JSON.parse(JSON.stringify(props.options)).map((text: string) => ({ text })))
    return (
        <div className="p-12">
            <AITable
                value={options} rowGap={1} className='rule-engine-options-table' headerAttrs={{ style: { display: 'none' } }}
                columns={[{ title: 'Option', value: 'row.text', input: { type: 'text',delay:50 }, justify: true }]}
                onAdd={() => setOptions([...options, { text: ''}])}
                addText={(
                    <div className="flex-row align-v p-h-12 h-24 br-4 m-h-6 bold m-3" style={{ color: 'orange' }}>
                        <Icon path={mdiPlusThick} size={0.7} /> Add Option
                    </div>
                )}
                onRemove={true} onChange={(newOptions: I_option[]) => setOptions(newOptions)}
            />
            <div className="h-36 flex-row align-v p-v-6">
                <button 
                    type='button' className='brd-none br-4 p-v-3 p-h-12 bold fs-14 c-4 flex-row align-v gap-6' style={{ background: 'orange' }}
                    onClick={()=>props.onChange(options)}
                ><Icon path={mdiCheckBold} size={0.7}/>Submit</button>
            </div>
        </div>
    )
}