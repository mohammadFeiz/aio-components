import { createContext, FC, ReactNode, useContext, useRef, useState } from "react";
import './index.css';
import './style.css';
import AIOInput, { AISelect, AITable, AITabs, AIText } from "../../npm/aio-input";
import Icon from "@mdi/react";
import { mdiArrowExpandHorizontal, mdiCheckBold, mdiClose, mdiContentSave, mdiDelete, mdiDotsHorizontal, mdiDotsVertical, 
    mdiFileCode, mdiHistory, mdiHome, mdiPlusCircleOutline, mdiPlusThick } from "@mdi/js";
import { AIODate, DragClass, GetRandomNumber } from "../../npm/aio-utils";
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
    templates: I_template[],
    changeTemplates:(newTemplates:I_template[])=>void,
    trans:(v:string)=>string,
    removeRule:(id:number)=>void,
    removeTemplate:(id:number)=>void,
    addRule:(name:string,templateId:number)=>boolean,
    selectedVariables:I_variable[],
    changeSelectedVariables:(newVariables:I_variable[])=>void,
    submitRuleChange:()=>void
}

const CTX = createContext({} as any)
const RuleEngine: FC = () => {
    const [rules, setRules] = useState<I_rule[]>(getRules);
    const [templates, setTemplates] = useState<I_template[]>(getTemplates)
    const [selectedRule, setSelectedRule] = useState<I_rule>()
    const [selectedVariables,setSelectedVariables] = useState<I_variable[]>([])
    const [popup] = useState<AIOPopup>(new AIOPopup())
    const [model, setModel] = useState<I_model>({})
    const [history, setHistory] = useState<I_rule[]>(getHistory)
    function getTemplates(): I_template[] {
        return [mockTemplate]
    }
    function trans(v:string){
        const dic:{[key:string]:string} = {

        }
        return dic[v] || v
    }
    function getRules(): I_rule[] {
        return [
            {
                model: {},
                text: 'text', name: 'Rule1', id: 0, date: '1403/3/3', templateId: 1235565, variables: [{ text: '$c' }, { text: '$w' }]
            },
            {
                model: {},
                text: 'text', name: 'Rule2', id: 1, date: '1403/3/3', templateId: 1235565, variables: [{ text: '$c' }, { text: '$w' }]
            },
            {
                model: {},
                text: 'text', name: 'Rule3', id: 2, date: '1403/3/3', templateId: 1235565, variables: [{ text: '$c' }, { text: '$w' }]
            }
        ]
    }
    function selectRule(rule: I_rule | undefined) {
        if (rule) { 
            changeModel(rule.model) 
            changeSelectedVariables(rule.variables || [])
        }
        setSelectedRule(rule)
    }
    function addRule(name:string,templateId:number){
        const DATE = new AIODate();
        const newRule:I_rule = {variables:[],text:'',templateId,name,model:{},id:GetRandomNumber(100000,900000),date:DATE.getDateByPattern(DATE.getToday(),'{year}/{month}/{day} {hour}:{minute}')}
        setRules([...rules,newRule])
        return true
    }
    function removeRule(id:number){
        const rule:I_rule | undefined = rules.find((o)=>o.id === id);
        if(!rule){return}
        popup.addConfirm({
            title:'Remove Rule',
            subtitle:rule.name,
            text:'َAre You Sure Want To Remove This Rule?',
            onSubmit:async ()=>{
                setRules(rules.filter((o)=>o.id !== id));
                return true
            },
            onCansel:()=>{
                popup.removeModal()
            }
        })
    }
    function submitRuleChange(){
        const DATE = new AIODate();
        if(!selectedRule){return}
        const newRule:I_rule = {
            ...selectedRule,
            variables:selectedVariablesRef.current,
            model:modelRef.current,
            date:DATE.getDateByPattern(DATE.getToday(),'{year}/{month}/{day} {hour}:{minute}')
        }
        setRules(rules.map((o)=>o.id === selectedRule.id?newRule:o));
        setSelectedRule(undefined)
    }
    function removeTemplate(id:number){
        const template:I_template | undefined = templates.find((o)=>o.id === id);
        if(!template){return}
        popup.addConfirm({
            title:'Remove Template',
            subtitle:template.name,
            text:'َAre You Sure Want To Remove This Template?',
            onSubmit:async ()=>{
                const ruleWithThisTemplate:I_rule | undefined = rules.find((o)=>o.templateId === id);
                if(!!ruleWithThisTemplate){
                    popup.addSnackebar({
                        type:'error',
                        text:'you cannot remove this template',
                        subtext:'There is some rules that use this template',
                        verticalAlign:'start',
                        horizontalAlign:'end',
                        attrs:{style:{maxWidth:360,background:'#111',borderRadius:12,border:'2px solid #555',fontSize:16}}
                    })
                    return false;
                }
                setTemplates(templates.filter((o)=>o.id !== id));
                return true
            },
            onCansel:()=>{
                popup.removeModal()
            }
        })
    }
    function getHistory(): I_rule[] {
        return [
            {
                model: {},
                date: '1403/2/3 12:00', text: 'text', name: 'Rule1', id: 0, templateId: 0, variables: [{ text: '$c' }, { text: '$w' }]
            },
            {
                model: {},
                date: '1403/3/3 12:00', text: 'text', name: 'Rule1', id: 0, templateId: 0, variables: [{ text: '$c' }, { text: '$w' }]
            },
            {
                model: {},
                date: '1403/3/4 12:00', text: 'text', name: 'Rule1', id: 0, templateId: 0, variables: [{ text: '$c' }, { text: '$w' }]
            }
        ]
    }
    const modelRef = useRef(model);
    modelRef.current = model;
    const selectedVariablesRef = useRef(selectedVariables);
    selectedVariablesRef.current = selectedVariables
    const [Drag] = useState<DragClass>(new DragClass({ callback: onDrag }))
    function changeTemplates(newTemplates:I_template[]){
        setTemplates([...newTemplates]);
    }
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
    function changeSelectedVariables(newVariables: I_variable[]) {
        setSelectedVariables([...newVariables])
    }
    function changeModelByField(field: string, value: any) {
        const model = modelRef.current
        changeModel({ ...model, [field]: value })
    }

    function getContext(): I_CTX { 
        return { 
            rules, selectRule, selectedRule, popup, Drag, model: modelRef.current, changeModelByField, history, templates,
            changeTemplates,trans,removeRule,removeTemplate,addRule,submitRuleChange,
            selectedVariables:selectedVariablesRef.current,changeSelectedVariables
        } 
    }
    return (
        <CTX.Provider value={getContext()}>
            <div className="rule-engine jfullscreen jflex-col">
                <Nav />
                {!!selectedRule ? <RulePage /> : <Home />}
                {popup.render()}
            </div>
        </CTX.Provider>
    )
}
export default RuleEngine
const AddRule:FC<{onSubmit:(name:string,templateId:number)=>void}> = ({onSubmit})=>{
    const {templates}:I_CTX = useContext(CTX);
    const [name,setName] = useState<string>('')
    const [templateId,setTemplateId] = useState<number>();
    const [errors,setErrors] = useState<any>({})
    return (
        <div className="add-rule">
            <div className="add-rule-label">Rule Name</div>
            <AIText 
                value={name} onChange={(v:string)=>setName(v)} validations={['required']} lang='en'
                reportError={(error)=>setErrors({...errors,name:error})}
            />
            <div className="add-rule-label">Rule Template</div>
            <AISelect
                options={templates}
                subtext={templateId !== undefined?templateId:undefined}
                validations={['required']}
                value={templateId}
                option={{
                    text:'option.name',
                    value:'option.id',
                    subtext:(option:any)=>option.id
                }}
                popover={{fitHorizontal:true}}
                onChange={(templateId)=>setTemplateId(templateId)}
                reportError={(error)=>setErrors({...errors,template:error})}
            />
            <div className="msf"></div>
            <button type='button' disabled={!!errors.name || !!errors.template} onClick={()=>onSubmit(name,templateId as number)}>Add Rule</button>
        </div>
    )
}
type I_tab = 'variables' | 'lists'
const RulePage: FC = () => {
    const [tab, setTab] = useState<I_tab>('variables')

    function left_side_layout() {
        return (
            <div className="jw-204 jflex-col jshrink-0 rule-engine-border-right">
                <AITabs
                    value={tab} onChange={(tab) => setTab(tab)}
                    options={[{ text: 'lists', value: 'lists' }, { text: 'variables', value: 'variables' }]}
                />
                {tab === 'variables' && <Variables />}
            </div>
        )
    }

    return (
        <div className=" jflex-row jflex-1">
            {left_side_layout()}
            <RuleCode />
            <History />
        </div>
    )
}
const Nav: FC = () => {
    const { selectedRule, selectRule,trans }: I_CTX = useContext(CTX)
    return (
        <nav className='rule-engine-nav'>
            <div className='rule-engine-app-title'>RULE ENGINE</div>
            {
                !!selectedRule &&
                <>
                    <div className="rule-engine-rule-name">{selectedRule.name}</div>
                    <div className="jflex-row jw-144 jalign-vh">
                        <button type='button' className='jflex-row jalign-v jgap-6' onClick={() => selectRule(undefined)}>
                            <Icon path={mdiHome} size={0.9} />{trans('Home')}
                        </button>
                    </div>
                </>
            }
        </nav>
    )
}
const Variables: FC = () => {
    const { popup,selectedRule, Drag,selectedVariables,changeSelectedVariables }: I_CTX = useContext(CTX);
    function removeVariable(index:number){
        popup.addConfirm({
            title:'Remove Variable',
            text:'Are you sure want to remove this variable?',
            subtitle:selectedVariables[index].text,
            onSubmit:async ()=>{
                changeSelectedVariables(selectedVariables.filter((o,i)=>i !== index))
                return true
            }
        })
    }
    function addVariableModal(){
        popup.addPrompt({
            title:'Add Variable',
            text:'inter variable',
            onSubmit:async (text)=>{
                changeSelectedVariables([...selectedVariables,{text}])
                return true
            }
        })
    }
    function item_layout(item: I_variable,index:number) {
        return (
            <div key={item.text} className="jflex-row jp-6 jbrd-c-5 jflex-row jalign-v" {...Drag.getDragAttrs({ item })}>
                <div className="jflex-1">{item.text}</div>
                <div className="jw-24 jh-24 jflex-row jalign-vh" onClick={()=>removeVariable(index)}>
                    <Icon path={mdiClose} size={0.7}/>
                </div>
            </div>
        )
    }
    function hedaer_layout() {
        return (
            <div className="msf jflex-row jalign-v jp-6 jalign-vh">
                <button type='button' className='jflex-row jalign-v' style={{ color: 'orange', background: 'none' }} onClick={()=>addVariableModal()}>
                    <Icon path={mdiPlusThick} size={0.7} />Add Variable
                </button>
            </div>
        )
    }
    function body_layout() {
        if (!selectedRule) { return null }
        return (
            <div className="jflex-col jgap-3 jp-3 jflex-1 jofy-auto">
                {selectedVariables.map((o: I_variable,i:number) => item_layout(o,i))}
            </div>
        )
    }
    return (<>{hedaer_layout()} {body_layout()}</>)
}
type I_mode = 'editor' | 'preview'
const RuleCode: FC = () => {
    const { selectedRule, templates,trans,submitRuleChange }: I_CTX = useContext(CTX)
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
            <div className="jflex-row jalign-v">
                {template_cells_layout(cells, rowIndex)}
                {options_layout()}
            </div>
        )
    }
    function options_layout() {
        return (<div className="jflex-row jalign-vh"><Icon path={mdiDotsVertical} size={0.8} /></div>)
    }
    function template_cells_layout(cells: I_template_cell[], rowIndex: number) {
        return (
            <div className="jflex-row jflex-1 jalign-v jgap-6 jh-100">
                {cells.map((cell, cellIndex) => <CodeCell cell={cell} rowIndex={rowIndex} cellIndex={cellIndex} />)}
            </div>
        )
    }
    return (
        <div className="jflex-col jw-100 rule-engine-border-left rule-engine-border-right">
            <AITabs
                value={mode} onChange={(mode) => setMode(mode)} options={[{ text: 'Editor', value: 'editor' }, { text: 'Preview', value: 'preview' }]}
                before={(
                    <button className='rule-engine-save jalign-v jflex-row jgap-6 jfs-14 jbold' onClick={submitRuleChange}>
                        <Icon path={mdiContentSave} size={1} />{trans('Save')}
                    </button>
                )}
            />
            <div className="jflex-col jflex-1 jp-12 jgap-3 jofy-auto jw-100">
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
                type='select' className='jw-fit jbg-l-5 jbrd-none' options={options} value={value}
                onChange={(newValue) => changeModelByField(selectfield, newValue)}
                option={{text:'option',value:'option'}}
                validations={['required']} lang='en' showErrors={false}
            />
        )
    }
    function text_layout(field: string) {
        return (
            <AIOInput
                type='text' className='jw-fit jbg-l-5 jbrd-none' value={model[field] || ''}
                onChange={(newValue) => changeModelByField(field, newValue)}
                validations={['required']} lang='en' showErrors={false}
            />
        )
    }
    function textarea_layout(field: string) {
        const dragAttrs = Drag.getDropAttrs({ field });
        return (
            <AIOInput
                attrs={{ ...dragAttrs }} type='textarea' className='jflex-1 jbg-l-5 jbrd-none' inputAttrs={{ className: 'resize-v' }} value={model[field] || ''}
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
    return (<div className="jflex-row">{cell}</div>)
}

const History: FC = () => {
    const { history,trans }: I_CTX = useContext(CTX);
    function header_layout() {
        return (
            <div className="msf jflex-row jalign-v jp-6 jalign-vh jbg-d-20 jfs-14 jgap-6" style={{ color: 'orange' }}>
                <Icon path={mdiHistory} size={0.8} /> {trans('History')}
            </div>
        )
    }
    function item_layout(historyItems: I_rule) {
        return (
            <div key={historyItems.date} className="jflex-row jp-6 jbrd-c-5 jflex-row jalign-v">
                <div className="jflex-1 jflex-row jalign-v">
                    <div className="jw-36 jh-24 jflex-row jalign-vh" style={{ color: 'orange' }}><Icon path={mdiFileCode} size={0.7} /></div>
                    <div className="jfs-12">{historyItems.date}</div>
                </div>
            </div>
        )
    }
    function items_layout() {
        return (
            <div className="jflex-col jgap-3 jp-3 jflex-1 jofy-auto">
                {history.reverse().map((o: I_rule) => item_layout(o))}
            </div>
        )
    }
    return (<div className="jw-204 jflex-col jshrink-0 rule-engine-border-left">{header_layout()} {items_layout()}</div>)
}
const Home: FC = () => {
    const { popup,rules, templates, selectRule,changeTemplates,removeTemplate,removeRule,addRule }: I_CTX = useContext(CTX);
    const [templateToEdit, setTemplateToEdit] = useState<I_template | undefined>()
    const [templateToAdd, setTemplateToAdd] = useState<boolean>(false)
    function addRuleModal(){
        popup.addModal({
            header:{title:'AddRule'},
            position:'center',
            body:()=><AddRule onSubmit={async (name,templateId)=>{
                const res = await addRule(name,templateId);
                if(res){popup.removeModal()}
            }}/>
        })
    }
    function part_header_layout(label: string, onAdd: () => void) {
        return (
            <div className="jfs-24 jm-b-12 jflex-row jalign-between jalign-v jw-100 jp-h-12 jh-48" style={{ color: 'orange', background: 'rgba(255,255,255,0.2)' }}>
                <div className="msf">{label}</div>
                <div className="jflex-row jalign-vh pointer" onClick={onAdd}><Icon path={mdiPlusCircleOutline} size={1.4} /></div>
            </div>
        )
    }
    function part_body_layout(items: any[]) {
        return (<div className="jflex-1 jofy-auto jflex-col jgap-12 jw-100 jalign-h jp-12">{items}</div>)
    }
    function part_layout(label: string, items: any[],onAdd:()=>void) {
        return (
            <div className="jflex-col jalign-h jh-100 jp-12 jbr-12 jw-100">
                {part_header_layout(label, onAdd)} {part_body_layout(items)}
            </div>
        )
    }
    function rules_layout() {
        const items = rules.map((rule) => {
            return part_item_layout({ 
                id: rule.id, 
                text: rule.name, 
                subtext: rule.date, 
                onClick: () => selectRule(rule),
                onRemove:()=>removeRule(rule.id) 
            })
        })
        return part_layout('Rules',items,()=>addRuleModal())
    }
    function templates_layout() {
        const items = templates.map((template: I_template) => {
            return part_item_layout({ 
                id: template.id, 
                text: template.name, 
                onClick: () => setTemplateToEdit(template),
                onRemove:()=>removeTemplate(template.id)
            })
        })
        return part_layout('Templates',items,()=>setTemplateToAdd(true))
    }
    function part_item_layout(p: { text: string, id: number, subtext?: string, onClick: () => void,onRemove:()=>void }) {
        const { id, text, subtext, onClick,onRemove } = p;
        return (
            <div key={id} className="part-button">
                <div className="part-button-body" onClick={onClick}>
                    <div className="">{text}</div>
                    {subtext !== undefined && <div className="jop-60 jfs-p70">{subtext}</div>}
                </div>
                <div className="part-button-remove" onClick={()=>onRemove()}><Icon path={mdiClose} size={0.7}/></div>
            </div>
        )
    }
    if (templateToAdd) {
        return (
            <Template 
                onClose={()=>setTemplateToAdd(false)}
                mode='add' onSubmit={(newTemplate)=>{
                changeTemplates([...templates,newTemplate]);
                setTemplateToAdd(false)
                
            }}/>
        )
    }
    if (templateToEdit) {
        return (
            <Template 
                onClose={()=>setTemplateToEdit(undefined)}
                mode='edit' template={templateToEdit} onSubmit={(newTemplate)=>{
                changeTemplates(templates.map((o)=>o.id === templateToEdit.id?newTemplate:o))
                setTemplateToEdit(undefined)
            }}/>
        )
    }
    return (<div className="jflex-row jalign-h jflex-1 jp-12">{rules_layout()} {templates_layout()}</div>)
}
type I_templateContext = {
    popup:AIOPopup,
    removeCell:(rowIndex:number)=>void,
    addCell:(type: 'static_text' | 'select' | 'textbox' | 'code_block' | 'indent', rowIndex: number, isEmptyRow: boolean)=>void,
    changeCell:(value:string,rowIndex:number,cellIndex:number)=>void
}
const TemplateContext = createContext({} as any);
const Template: FC<{ mode: 'add' | 'edit', template?: I_template,onSubmit:(newTemplate:I_template)=>void,onClose:()=>void }> = (props) => {
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
        let title = '',submitText = ''
        if (mode === 'edit') { title = `Edit Template (${template.name})`; submitText = 'Edit'; }
        else if (mode === 'add') { title = 'Add Template'; submitText = 'Add'; }
        return (
            <div className="jbg-d-20 jp-h-24 jfs-14 jbold jflex-row jh-36 jalign-v gap-6">
                {title}
                <div className="jflex-1"></div>
                <button onClick={()=>props.onClose()} style={{color:'orange',border:'1px solid'}} className='jbr-4 jh-30 jw-72 bg-none'>Close</button>
                <button onClick={()=>props.onSubmit(template)} style={{background:'orange',border:'none'}} className='jbr-4 jh-30 jw-72'>{submitText}</button>
            </div>
        )
    }
    function addFirstCell(type:any){
        setTemplate({ ...template, rows: [{ cells: [getNewCellByType(type)] }] })

        
    }
    function body_layout() {
        return (
            <div className="jflex-col jp-24">
                {!template.rows.length && <AISelect
                    className='jw-24 jh-24 jp-0 jm-l-6 jbrd-none jp-0' caret={false}
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
                    onChange={(v) => addFirstCell(v)}
                />}
                {!!template.rows.length && template.rows.map((o, rowIndex) => <TemplateRow key={rowIndex} row={o} rowIndex={rowIndex}/>)}
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
    function getNewCellByType(type: 'static_text' | 'select' | 'textbox' | 'code_block' | 'indent'){
        let newCell = '';
        if (type === 'static_text') { newCell = 'text' }
        else if (type === 'textbox') { newCell = 'text()' }
        else if (type === 'code_block') { newCell = 'textarea()' }
        else if (type === 'indent') { newCell = 'indent' }
        else { newCell = 'select([])' }
        return newCell
    }
    function addCell(type: 'static_text' | 'select' | 'textbox' | 'code_block' | 'indent', rowIndex: number, isEmptyRow: boolean) {
        let newRows: I_template_row[] = []
        const newCell = getNewCellByType(type)
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
            <div className="jh-100 jw-100 jofy-auto">{header_layout()} {body_layout()}</div>
        </TemplateContext.Provider>
    )
}
const TemplateRow:FC<{row:I_template_row,rowIndex:number}> = ({row,rowIndex})=>{
    const {removeCell,addCell}:I_templateContext = useContext(TemplateContext);
    function addCell_layout(rowIndex: number, isEmptyRow: boolean) {
        return (
            <div className="jflex-row jalign-v" key={`addRojw-${rowIndex}-${isEmptyRow}`}>
                <button
                    type='button' className='jbg-none jbrd-none jw-24 jh-24 jflex-row jalign-vh jp-0'
                    style={{ color: 'orange', opacity: isEmptyRow ? 0 : 1 }}
                    onClick={() => removeCell(rowIndex)}
                >
                    <Icon path={mdiDelete} size={0.7} />
                </button>
                <AISelect
                    className='jw-24 jh-24 jp-0 jm-l-6 jbrd-none jp-0' caret={false}
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
            <div key={rowIndex} className="jflex-row jalign-v jgap-12">
                {addCell_layout(rowIndex, false)}
                {row.cells.map((o, cellIndex) => <TemplateCell key={cellIndex} cell={o} rowIndex={rowIndex} cellIndex={cellIndex}/>)}
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
        if (cell === 'indent') {return (<div className="jw-16 jh-24 jflex-row jalign-vh jm-2 jop-15"><Icon path={mdiArrowExpandHorizontal} size={0.8} /></div>)}
        if (cell.indexOf('text(') === 0) {return <div className="jp-h-6 jbr-4" style={{ background: '#0069ff' }}>TextBox</div>}
        if (cell.indexOf('textarea(') === 0) {return <div className="jp-h-6 jbr-4" style={{ background: '#0069ff' }}>Code Block</div>}
        if (cell.indexOf('select(') === 0) {return select_layout(cell,rowIndex,cellIndex)}
        return static_text_layout(cell,rowIndex,cellIndex)
    }
    function select_layout(cell:I_template_cell,rowIndex:number,cellIndex:number){
        const options:string[] = JSON.parse(cell.slice(7, cell.length - 1))
        return (
            <div 
                className="jp-h-6 jbr-4 jrelative jpointer jflex-row jalign-v" style={{ background: '#0069ff' }} 
                onClick={() => openOptionsModal(options,rowIndex,cellIndex)}
            >
                Select
                <div className="jfs-p70 jop-70 jm-l-6">{` ( ${options.length} options )`}</div> 
                {select_cell_icon()}
            </div>
        )
    }
    function select_cell_icon(){
        return (
            <div 
                className="jabsolute jw-16 jh-16 jflex-row jalign-vh jbr-100" 
                style={{ background: 'orange', top: -8, right: -8 }}
            ><Icon path={mdiDotsHorizontal} size={0.6} /></div>
        )
    }
    function static_text_layout(cell:I_template_cell,rowIndex:number,cellIndex:number){
        const width = cell.length * 6.2 + 12
        return (
            <AIText
                value={cell} style={{ width }} autoHighlight={false} className="jbg-0 jp-h-0 jbr-4 jm-l-6 jbrd-none jh-24"
                onChange={(newValue) => changeCell(newValue,rowIndex,cellIndex)}
            />
        )
    }
    return (<div key={`rowIndex-${rowIndex}-cellIndex-${cellIndex}`} className="jflex-row jalign-v">{getContent()}</div>)
}
const Indent: FC = () => <div className="jw-12 jh-100 jshrink-0 jflex-row jalign-v jshrink-0"><div className="jw-1 jh-100 jbg-l-20"></div></div>
type I_option = { text: string };
const CellOptions: FC<{ options: string[],onChange:(newOptions:I_option[])=>void }> = (props) => {
    const [options, setOptions] = useState<I_option[]>(JSON.parse(JSON.stringify(props.options)).map((text: string) => ({ text })))
    return (
        <div className="jp-12">
            <AITable
                value={options} rowGap={1} className='rule-engine-options-table' headerAttrs={{ style: { display: 'none' } }}
                columns={[{ title: 'Option', value: 'row.text', input: { type: 'text',delay:50 }, justify: true }]}
                onAdd={() => setOptions([...options, { text: ''}])}
                addText={(
                    <div className="jflex-row jalign-v jp-h-12 jh-24 jbr-4 jm-jh-6 jbold jm-3" style={{ color: 'orange' }}>
                        <Icon path={mdiPlusThick} size={0.7} /> Add Option
                    </div>
                )}
                onRemove={true} onChange={(newOptions: I_option[]) => setOptions(newOptions)}
            />
            <div className="jh-36 jflex-row jalign-v jp-v-6">
                <button 
                    type='button' className='jbrd-none jbr-4 jp-v-3 jp-h-12 jbold jfs-14 jc-4 jflex-row jalign-v jgap-6' style={{ background: 'orange' }}
                    onClick={()=>props.onChange(options)}
                ><Icon path={mdiCheckBold} size={0.7}/>Submit</button>
            </div>
        </div>
    )
}