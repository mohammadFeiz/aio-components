import { FC, ReactNode, useState } from "react";
import './index.css';
import AIOInput, { AITabs, AIText } from "../../npm/aio-input";
import Icon from "@mdi/react";
import { mdiCog, mdiDotsVertical } from "@mdi/js";
type I_leftItem = { text: string }
type I_model = any
type I_tab = 'statements' | 'lists'
type I_block = { rows: I_row[] }
type I_statement = { text: string, rows: I_row[] }
type I_row = { cells?: I_cell[], rows?: I_row[] }
type I_cell = string
const Formula: FC = () => {
    const [tab, setTab] = useState<I_tab>('statements')
    const [statements, setStatements] = useState<I_statement[]>(getStatements)
    const [lists, setLists] = useState<any[]>(getLists);
    const [blocks, setBlocks] = useState<I_block[]>(
        [
            {
                rows: [
                    { cells: ['import com.boxi.ruleEngine.dto.RuleFact;'] },
                    { cells: ['rule', 'text(ruleName)'] },
                    {
                        rows: [
                            { cells: ['no-loop', 'select(boolean)'] },
                            { cells: ['lock-on-active', 'select(boolean)'] },
                            { cells: ['when'] },
                            { cells: ['indent','textarea(when)'] },
                            { cells: ['then'] },
                            { cells: ['indent','textarea(then)'] },
                        ]
                    },
                    { cells: ['end'] }
                ]
            }
        ]
    )
    const [model, setModel] = useState<I_model>({})
    function getStatements(): I_statement[] {
        return [
            {
                text: 'when then',
                rows: [
                    { cells: ['no-loop', 'select(boolean)'] },
                    { cells: ['lock-on-active', 'select(boolean)'] },
                    { cells: ['when'] },
                    { cells: ['textarea(when)'] },
                    { cells: ['then'] },
                    { cells: ['textarea(then)'] },
                ]
            }
        ]
    }
    function getLists() {
        return [
            { text: 'boolean', options: [{ text: 'true', value: true }, { text: 'false', value: false }] },
        ]
    }
    function left_side_layout() {
        const items = tab === 'statements' ? statements : lists;
        return (
            <div className="w-204 flex-col">
                <AITabs
                    value={tab}
                    className='bg-l-5'
                    onChange={(tab) => setTab(tab)}
                    options={[
                        { text: 'lists', value: 'lists' },
                        { text: 'statements', value: 'statements' },
                    ]}
                />
                <div className="flex-col gap-3 brd-c-5 p-3 flex-1">
                    {items.map((o: I_statement) => left_side_item_layout(o))}
                </div>
            </div>
        )
    }
    function left_side_item_layout(item: I_statement) {
        return (
            <div className="msf p-6 brd-c-5 flex-row align-v">
                {item.text}
            </div>
        )
    }
    function changeModelByField(field: string, value: any) {
        setModel({ ...model, [field]: value })
    }
    function body_layout() {
        return (
            <div className="flex-col flex-1 p-12 gap-3">
                {blocks.map((o, i) => rows_layout(o.rows, i, 0))}
            </div>
        )
    }
    function rows_layout(rows: I_row[], blockIndex: number, level: number): ReactNode[] {
        return rows.map((o: I_row, rowIndex: number) => {
            if (o.rows) {
                return rows_layout(o.rows, blockIndex, level + 1)
            }
            else if (o.cells) {
                return row_layout(o, blockIndex, rowIndex, level)
            }
            else { return null }
        })
    }
    function row_layout(o: I_row, blockIndex: number, rowIndex: number, level: number) {
        const indentSize = 16;
        const { cells = [] } = o;
        if (!cells.length) { return null }
        return (
            <div className="flex-row align-v" style={{ paddingLeft: indentSize * level }}>
                {cells_layout(cells, blockIndex, rowIndex)}
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
    function cells_layout(cells: I_cell[], blockIndex: number, rowIndex: number) {
        return (
            <div className="flex-row flex-1 align-v gap-6">
                {cells.map((cell, cellIndex) => cell_layout(cell, blockIndex, rowIndex, cellIndex))}
            </div>
        )
    }
    function cell_layout(cell: string, blockIndex: number, rowIndex: number, cellIndex: number) {
        const field = `block-${blockIndex}-row-${rowIndex}-cell-${cellIndex}`
        if (cell.indexOf('select(') === 0) {
            const listName = cell.slice(7, cell.length - 1);
            return select_layout(field, listName)
        }
        if (cell.indexOf('text(') === 0) {
            return text_layout(field)
        }
        if (cell.indexOf('textarea(') === 0) {
            return textarea_layout(field)
        }
        if(cell === 'indent'){
            return (<div className="w-12 shrink-0"></div>)
        }
        return (
            <div className="flex-row">{cell}</div>
        )
    }
    function select_layout(selectfield: string, listName: string) {
        const list = lists.find((o) => o.text === listName)
        const { options } = list
        let value = model[selectfield]
        if (value === undefined) { value = options[0].value }
        return (
            <AIOInput
                type='select' className='w-fit bg-l-5 brd-none' options={options} value={value}
                onChange={(newValue) => changeModelByField(selectfield, newValue)}
            />
        )
    }
    function text_layout(field: string) {
        return (
            <AIOInput
                type='text' className='w-fit bg-l-5 brd-none' value={model[field] || ''}
                onChange={(newValue) => changeModelByField(field, newValue)}
            />
        )
    }
    function textarea_layout(field: string) {
        return (
            <AIOInput
                type='textarea' className='flex-1 bg-l-5 brd-none' inputAttrs={{className:'resize-v'}} value={model[field] || ''}
                onChange={(newValue) => changeModelByField(field, newValue)}
            />
        )
    }
    return (
        <div className="rule-engine fullscreen flex-row">
            {left_side_layout()}
            {body_layout()}
        </div>
    )
}
export default Formula