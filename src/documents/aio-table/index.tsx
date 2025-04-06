import { FC, useEffect, useState } from "react";
import DOC from "../../resuse-components/Doc";
import AIOTable, { I_table_column, I_table_filter, I_table_filter_item, I_table_filter_saved_item, I_table_paging } from "../../npm/aio-table";
import { Code, I_filter_saved_item } from "../../npm/aio-component-utils";
import model, { I_table_row } from './table-model.ts';
import Icon from "@mdi/react";
import { mdiFile, mdiHumanFemale, mdiHumanMale } from "@mdi/js";
import { AICheckbox, AIDate, AINumber, AISelect, AIText } from "../../npm/aio-input/index.tsx";
import { GetRandomNumber } from "../../npm/aio-utils/index.tsx";

export default function DOC_AIOForm(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            items={[
                { text: 'performance', value: 'performance', render: () => <Performance /> },
                { text: 'placeholder', value: 'placeholder', render: () => <Placeholder /> },
                { text: 'attrs', value: 'attrs', render: () => <Attrs /> },
                { text: 'onSwap', value: 'onSwap', render: () => <OnSwap /> },
                { text: 'excel', value: 'excel', render: () => <Excel /> },
                { text: 'toolbar', value: 'toolbar', render: () => <Toolbar /> },
                { text: 'toolbarAttrs', value: 'toolbarAttrs', render: () => <ToolbarAttrs /> },
                { text: 'rowGap columnGap', value: 'rowGapcolumnGap', render: () => <RowGapColumnGap /> },
                { text: 'onAdd', value: 'onAdd', render: () => <OnAdd /> },
                { text: 'onRemove', value: 'onRemove', render: () => <OnRemove /> },
                { text: 'onSearch', value: 'onSearch', render: () => <OnSearch /> },
                { text: 'rowAttrs', value: 'rowAttrs', render: () => <RowAttrs /> },
                { text: 'headerAttrs', value: 'headerAttrs', render: () => <HeaderAttrs /> },
                { text: 'paging', value: 'paging', render: () => <Paging /> },
                { text: 'paging serverSide:true', value: 'paging serverSide:true', render: () => <Paging_ServerSide /> },
                { text: 'rowTemplate', value: 'rowTemplate', render: () => <RowTemplate /> },
                { text: 'rowsTemplate', value: 'rowsTemplate', render: () => <RowsTemplate /> },
                { text: 'rowAfter', value: 'rowAfter', render: () => <RowAfter /> },
                { text: 'rowBefore', value: 'rowBefore', render: () => <RowBefore /> },
                { text: 'column.title', value: 'column.title', render: () => <Column_Title /> },
                { text: 'column.titleAttrs', value: 'column.titleAttrs', render: () => <Column_TitleAttrs /> },
                { text: 'column.width', value: 'column.width', render: () => <Column_Width /> },
                { text: 'column.minWidth', value: 'column.minWidth', render: () => <Column_MinWidth /> },
                { text: 'column.justify', value: 'column.justify', render: () => <Column_Justify /> },
                { text: 'column set input', value: 'column set input', render: () => <Column_Input /> },
                { text: 'column.cellAttrs', value: 'column.cellAttrs', render: () => <Column_CellAttrs /> },
                { text: 'column {subtext,before,after}', value: 'column {subtext,before,after}', render: () => <Column_SubtextBeforeAfter /> },
                { text: 'column.template', value: 'column.template', render: () => <Column_Template /> },
                { text: 'column.sort', value: 'column.sort', render: () => <Column_Sort /> },
                { text: 'column.filter', value: 'column.filter', render: () => <Column_Filter /> },
                { text: 'onChangeSort', value: 'onChangeSort', render: () => <OnChangeSort /> },
            ]}
        />
    )
}

const Performance: FC = () => {
    let [rows, setRows] = useState(getRows())
    function getRows() {
        let rows = []
        for (let i = 0; i < 10000; i++) {
            rows.push({
                name: `name_${i + 1}`, gender: 'male', age: Math.round(Math.random() * 70) + 5, id: i + 1
            })
        }
        return rows
    }
    let [columns] = useState<I_table_column<any>[]>([
        { title: '#', template: ({rowIndex}) => rowIndex + 1, width: 68 },
        { title: 'Name', value: 'row.name' },
        { title: 'Gender', value: 'row.gender' },
        { title: 'Age', value: 'row.age' },
    ])
    let [paging, setPaging] = useState<I_table_paging>({ size: 100, number: 1, sizes: [100, 200, 300] })
    return (
        <div className='example'>
            <AIOTable<any>
                style={{ height: 400 }}
                value={rows}
                columns={columns}
                onChange={(value) => setRows(value)}
                paging={paging}
                onChangePaging={(paging) => setPaging(paging)}
            />
        </div>
    )
}
const Placeholder: FC = () => {
    return (
        <div className='example'>
            <AIOTable value={[]} placeholder='موردی وجود ندارد' />
            {
                Code(`
<AIOTable 
    value={[]}
    placeholder='موردی وجود ندارد'
/>
                `)
            }
        </div>
    )
}
const Attrs: FC = () => {
    return (
        <div className='example'>
            <AIOTable
                columns={[
                    { title: 'Name', value: 'row.name' },
                    { title: 'Gender', value: 'row.gender' },
                    { title: 'Age', value: 'row.age' },
                ]}
                attrs={{ style: { height: 360, border: '4px solid #ddd' } }}
                value={model}
            />
            {
                Code(`
<AIOTable
    columns={[
        {title:'Name',value:'row.name'},
        {title:'Gender',value:'row.gender'},
        {title:'Age',value:'row.age'},
    ]}
    attrs={{style:{height:360,border:'4px solid #ddd'}}}
    value={model}
/>
                `)
            }
        </div>
    )
}
const OnSwap: FC = () => {
    let [rows, setRows] = useState<I_table_row[]>(model);
    function renderTable(type: 'true' | 'function') {
        return (
            <AIOTable
                value={rows}
                columns={[
                    { title: 'Name', value: 'row.name' },
                    { title: 'Gender', value: 'row.gender' },
                    { title: 'Age', value: 'row.age' },
                ]}
                onChange={(newRows) => setRows(newRows)}
                onSwap={type === 'true' ? true : (newRows, startRow, endRow) => setRows(newRows)}
            />
        )
    }
    function getCode(type: 'true' | 'function') {
        return (`
return (
    <AIOTable
        value={rows}
        columns={[
            {title:'Name',value:'row.name',input:{type:'text'}},
            {title:'Gender',value:'row.gender',input:{type:'text'}},
            {title:'Age',value:'row.age',input:{type:'number'}},
        ]}
        onChange={(newRows)=>setRows(newRows)}
        ${type === 'true' ? 'onSwap={true}' : 'onSwap={(newRows,startRow,endRow)=>setRows(newRows)}'}
    />
)
`)
    }
    return (
        <div className='example'>
            <h3>{`onSwap={true}`}</h3>
            {renderTable('true')}
            {Code(getCode('true'))}
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>{`onSwap={Function}`}</h3>
            {renderTable('function')}
            {Code(getCode('function'))}
        </div>
    )
}
const Excel: FC = () => {
    const [rows, setRows] = useState<I_table_row[]>(model)
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    { title: 'Name', value: 'row.name', excel: 'name' },
                    { title: 'Gender', value: 'row.gender', excel: 'gender' },
                    { title: 'Age', value: 'row.age', excel: 'age' },
                ]}
                onChange={(newRows) => setRows(newRows)}
                excel='please inter excel file name'
            />
            {
                Code(`
const [rows,setRows] = useState<I_table_row[]>(model)
    
return (
    <AIOTable
        value={rows}
        columns={[
            {title:'Name',value:'row.name',excel:'name'},
            {title:'Gender',value:'row.gender',excel:'gender'},
            {title:'Age',value:'row.age',excel:'age'},
        ]}
        onChange={(newRows)=>setRows(newRows)}
        excel='please inter excel file name'
    />
)
                `)
            }
        </div>
    )
}
const Toolbar: FC = () => {
    const [rows, setRows] = useState<I_table_row[]>(model)
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    { title: 'Name', value: 'row.name' },
                    { title: 'Gender', value: 'row.gender' },
                    { title: 'Age', value: 'row.age' },
                ]}
                onChange={(newRows) => setRows(newRows)}
                toolbar={(
                    <>
                        <Icon path={mdiFile} size={0.7} />
                        <div style={{ width: 6 }}></div>
                        this is my title
                    </>
                )}
            />
            {
                Code(`
const [rows,setRows] = useState<I_table_row[]>(model)
<AIOTable
    value={rows}
    columns={[
        {title:'Name',value:'row.name'},
        {title:'Gender',value:'row.gender'},
        {title:'Age',value:'row.age'},
    ]}
    onChange={(newRows)=>setRows(newRows)}
    toolbar={(
        <>
            <Icon path={mdiFile} size={0.7}/>                            
            <div style={{width:6}}></div>
            this is my title
        </>
    )}
/>
                `)
            }
        </div>
    )
}
const ToolbarAttrs: FC = (p: any) => {
    let [rows, setRows] = useState<I_table_row[]>(model)
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    { title: 'Name', value: 'row.name' },
                    { title: 'Gender', value: 'row.gender' },
                    { title: 'Age', value: 'row.age' },
                ]}
                onChange={(newRows) => setRows(newRows)}
                toolbar={(
                    <>
                        <Icon path={mdiFile} size={0.7} />
                        <div style={{ width: 6 }}></div>
                        this is my title
                    </>
                )}
                toolbarAttrs={{
                    style: { background: 'orange', color: '#fff' }
                }}
            />
            {
                Code(`
let [rows,setRows] = useState<I_table_row[]>(model)
    
return (
    <AIOTable
        value={rows}
        columns={[
            {title:'Name',value:'row.name'},
            {title:'Gender',value:'row.gender'},
            {title:'Age',value:'row.age'},
        ]}
        onChange={(newRows)=>setRows(newRows)}
        toolbar={(
            <>
                <Icon path={mdiFile} size={0.7}/>                            
                <div style={{width:6}}></div>
                this is my title
            </>
        )}
        toolbarAttrs={{
            style:{background:'orange',color:'#fff'}
        }}
    />
)
                `)
            }
        </div>
    )
}
const RowGapColumnGap: FC = () => {
    let [rows, setRows] = useState<I_table_row[]>(model)
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    { title: 'Name', value: 'row.name' },
                    { title: 'Gender', value: 'row.gender' },
                    { title: 'Age', value: 'row.age' },
                ]}
                onChange={(newRows) => setRows(newRows)}
                gap={[6,6]}
                style={{padding:6}}
            />
            {
                Code(`
let [rows, setRows] = useState<I_table_row[]>(model)
<AIOTable
    value={rows}
    columns={[
        { title: 'Name', value: 'row.name' },
        { title: 'Gender', value: 'row.gender' },
        { title: 'Age', value: 'row.age' },
    ]}
    onChange={(newRows) => setRows(newRows)}
    gap={[6,6]}
    style={{padding:6}}
/>
                `)
            }
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
        </div>
    )
}
const OnAdd:FC = () => {
    const [rows,setRows] = useState(model)    
    return (
        <div className='example'>
            <h3>{`onAdd={function}`}</h3>
            <AIOTable<I_table_row>
                columns={[
                    {
                        title:'Name',value:'row.name',
                        template:({row,change})=>{
                            return (
                                <AIText
                                    value={row.name}
                                    onChange={(v:any)=>change(v)}
                                />
                            )
                        }
                    },
                    {
                        title:'Gender',value:'row.gender',
                        template:({row,change})=>{
                            return (
                                <AISelect
                                    value={row.gender}
                                    options={[
                                        {text:'Male',value:'male'},
                                        {text:'Female',value:'female'} 
                                    ]}
                                    onChange={(v:any)=>change(v)}
                                />
                            )
                        }
                    },
                    {
                        title:'Age',value:'row.age',
                        template:({row,change})=>{
                            return (
                                <AINumber
                                    value={row.age}
                                    onChange={(v:any)=>change(v)}
                                />
                            )
                        }
                    },
                ]}
                value={rows}
                onChange={(newRows)=>setRows(newRows)}
                onAdd={async ()=>{
                    return {name:'',gender:'',age:0,date:''}
                    //also can return undefined form prevent call onChange by new rows
                }}
            />
            {
                Code(`

<AIOTable<I_table_row>
    columns={[
        {
            title:'Name',value:'row.name',
            template:({row,change})=>{
                return (
                    <AIText
                        value={row.name}
                        onChange={(v:any)=>change(v)}
                    />
                )
            }
        },
        {
            title:'Gender',value:'row.gender',
            template:({row,change})=>{
                return (
                    <AISelect
                        value={row.gender}
                        options={[
                            {text:'Male',value:'male'},
                            {text:'Female',value:'female'} 
                        ]}
                        onChange={(v:any)=>change(v)}
                    />
                )
            }
        },
        {
            title:'Age',value:'row.age',
            template:({row,change})=>{
                return (
                    <AINumber
                        value={row.age}
                        onChange={(v:any)=>change(v)}
                    />
                )
            }
        },
    ]}
    value={rows}
    onChange={(newRows)=>setRows(newRows)}
    onAdd={async ()=>setRows([{name:'',gender:'',age:0,date:''},...rows])}
/>
                `)
            }
        </div>
    )
}
const OnRemove:FC = () => {
    const [rows,setRows] = useState<I_table_row[]>(model)    
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[{
                    title:'Name',value:'row.name',
                    template:({row,change})=>{
                        return (
                            <AIText
                                value={row.name}
                                onChange={(v:any)=>change(v)}
                            />
                        )
                    }
                },
                {
                    title:'Gender',value:'row.gender',
                    template:({row,change})=>{
                        return (
                            <AISelect
                                value={row.gender}
                                options={[
                                    {text:'Male',value:'male'},
                                    {text:'Female',value:'female'} 
                                ]}
                                onChange={(v:any)=>change(v)}
                            />
                        )
                    }
                },
                {
                    title:'Age',value:'row.age',
                    template:({row,change})=>{
                        return (
                            <AINumber
                                value={row.age}
                                onChange={(v:any)=>change(v)}
                            />
                        )
                    }
                }]}
                onRemove={async (row)=>{
                    return true
                    //also can return false for prevent call onChange by new rows
                }}
                onChange={(newRows)=>setRows(newRows)}
            />
            {
                Code(`
<AIOTable
    value={rows}
    columns={[{
        title:'Name',value:'row.name',
        template:({row,change})=>{
            return (
                <AIText
                    value={row.name}
                    onChange={(v:any)=>change(v)}
                />
            )
        }
    },
    {
        title:'Gender',value:'row.gender',
        template:({row,change})=>{
            return (
                <AISelect
                    value={row.gender}
                    options={[
                        {text:'Male',value:'male'},
                        {text:'Female',value:'female'} 
                    ]}
                    onChange={(v:any)=>change(v)}
                />
            )
        }
    },
    {
        title:'Age',value:'row.age',
        template:({row,change})=>{
            return (
                <AINumber
                    value={row.age}
                    onChange={(v:any)=>change(v)}
                />
            )
        }
    }]}
    onRemove={async (row)=>{
        return true
        //also can return false for prevent call onChange by new rows
    }}
    onChange={(newRows)=>setRows(newRows)}
/>
                `)
            }
        </div>
    )
}
const OnSearch:FC = () => {
    let [rows,setRows] = useState<I_table_row[]>(model)
    return (
        <div className='example'>
            <h3>{`onSearch={function}`}</h3>
            <AIOTable
                value={rows}
                columns={[
                    {title:'Name',value:'row.name',search:true},
                    {title:'Gender',value:'row.gender',search:true},
                    {title:'Age',value:'row.age',search:true}
                ]}
                onSearch={(searchValue)=>{
                    //change rows manually
                }}
                onChange={(newRows)=>setRows(newRows)}
            />
            {
                Code(`

<AIOTable
    value={rows}
    columns={[
        {title:'Name',value:'row.name',search:true},
        {title:'Gender',value:'row.gender',search:true},
        {title:'Age',value:'row.age',search:true}
    ]}
    onSearch={(searchValue)=>{
        //change rows manually
    }}
    onChange={(newRows)=>setRows(newRows)}
/>
                `)
            }
            <h3>{`onSearch={true}`}</h3>
            <AIOTable
                value={rows}
                columns={[
                    {title:'Name',value:'row.name',search:true},
                    {title:'Gender',value:'row.gender',search:true},
                    {title:'Age',value:'row.age',search:true}
                ]}
                onSearch={true}
                onChange={(newRows)=>setRows(newRows)}
            />   
            {
                Code(`

<AIOTable
    value={rows}
    columns={[
        {title:'Name',value:'row.name',search:true},
        {title:'Gender',value:'row.gender',search:true},
        {title:'Age',value:'row.age',search:true}
    ]}
    onSearch={true}
    onChange={(newRows)=>setRows(newRows)}
/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
const RowAttrs:FC = () => {
    let [rows,setRows] = useState<I_table_row[]>(model)
    return (
        <div className='example'>
            <AIOTable
                attrs={{style:{height:700}}}
                value={rows}
                columns={[
                    {title:'Name',value:'row.name'},
                    {title:'Gender',value:'row.gender'},
                    {title:'Age',value:'row.age'},
                ]}
                onChange={(newRows)=>setRows(newRows)}
                rowOption={{
                    attrs:({rowIndex})=>{
                        let style:any = {height:48};
                        if(rowIndex % 2 === 0){style.background = '#eee'}
                        return {style}
                    }
                }}
            />
            {
                Code(`

<AIOTable
    attrs={{style:{height:700}}}
    value={rows}
    columns={[
        {title:'Name',value:'row.name'},
        {title:'Gender',value:'row.gender'},
        {title:'Age',value:'row.age'},
    ]}
    onChange={(newRows)=>setRows(newRows)}
    rowOption={{
        attrs:({rowIndex})=>{
            let style:any = {height:48};
            if(rowIndex % 2 === 0){style.background = '#eee'}
            return {style}
        }
    }}
/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
const HeaderAttrs:FC = () => {
    const [rows,setRows] = useState(model)    
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    {title:'Name',value:'row.name'},
                    {title:'Gender',value:'row.gender'},
                    {title:'Age',value:'row.age'},
                ]}
                onChange={(newRows)=>setRows(newRows)}
                headerAttrs={{
                    style:{background:'pink'}
                }}
            />
            {
                Code(`
<AIOTable
    value={rows}
    columns={[
        {title:'Name',value:'row.name'},
        {title:'Gender',value:'row.gender'},
        {title:'Age',value:'row.age'},
    ]}
    onChange={(newRows)=>setRows(newRows)}
    headerAttrs={{
        style:{background:'pink'}
    }}
/>
                `)
            }
        </div>
    )
}
const Paging:FC = () => {
    let [rows,setRows] = useState<I_table_row[]>(model)
    let [paging,setPaging] = useState<I_table_paging>({
        number:1,
        size:15,
        sizes:[15,30,50]
    })
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    {
                        title:'',width:42,justify:true,
                        template:({rowIndex})=>rowIndex + 1
                    },
                    {title:'Name',value:'row.name'},
                    {title:'Gender',value:'row.gender'},
                    {title:'Age',value:'row.age'},
                ]}
                attrs={{style:{height:600}}}
                onChange={(newRows)=>setRows(newRows)}
                paging={paging}
                onChangePaging={(paging)=>setPaging(paging)}
            />
            {
                Code(`

const [rows,setRows] = useState<I_table_row[]>(model)
const [paging,setPaging] = useState<I_table_paging>({
    number:1,
    size:15,
    sizes:[15,30,50]
})
return (
    <AIOTable
        value={rows}
        columns={[
            {
                title:'',width:42,justify:true,
                template:({rowIndex})=>rowIndex + 1
            },
            {title:'Name',value:'row.name'},
            {title:'Gender',value:'row.gender'},
            {title:'Age',value:'row.age'},
        ]}
        attrs={{style:{height:600}}}
        onChange={(newRows)=>setRows(newRows)}
        paging={paging}
        onChangePaging={(paging)=>setPaging(paging)}
    />
)
                `)
            }
        </div>
    )
}
const Paging_ServerSide:FC = () => {
    let [rows,setRows] = useState<any[]>([])
    let [paging,setPaging] = useState<I_table_paging>({
        serverSide:true,
        number:1,
        size:15,
        sizes:[15,30,50],
        length:0,
    })
    function getRowsByPaging(paging:any):any[]{
        let {size,number} = paging;
        return model.slice((number - 1) * size,number * size)
    }
    useEffect(()=>{
        const rows = getRowsByPaging(paging);
        setRows(rows);
        setPaging({...paging,length:model.length})
    },[])
    return (
        <div className='example'>
            <AIOTable
                attrs={{style:{height:600}}}
                value={rows}
                columns={[
                    {
                        title:'',width:42,justify:true,
                        template:({rowIndex})=>rowIndex + 1
                    },
                    {title:'Name',value:'row.name'},
                    {title:'Gender',value:'row.gender'},
                    {title:'Age',value:'row.age'},
                ]}
                onChange={(newRows)=>setRows(newRows)}
                onChangePaging={(paging)=>{
                    setPaging(paging);
                    setRows(getRowsByPaging(paging))
                }}
                paging={paging}
            />
            {
                Code(`
const [rows,setRows] = useState<any[]>([])
const [paging,setPaging] = useState<I_table_paging>({
    serverSide:true,
    number:1,
    size:15,
    sizes:[15,30,50],
    length:model.length,
})
function getRowsByPaging(paging:any):any[]{
    let {size,number} = paging;
    return model.slice((number - 1) * size,number * size)
}
useEffect(()=>{
    setRows(getRowsByPaging(paging))
},[])
return (
    <AIOTable
        attrs={{style:{height:600}}}
        value={rows}
        columns={[
            {
                title:'',width:42,justify:true,
                template:({rowIndex})=>rowIndex + 1
            },
            {title:'Name',value:'row.name'},
            {title:'Gender',value:'row.gender'},
            {title:'Age',value:'row.age'},
        ]}
        onChange={(newRows)=>setRows(newRows)}
        onChangePaging={(paging)=>{
            setPaging(paging);
            setRows(getRowsByPaging(paging))
        }}
        paging={paging}
    />
)
                `)
            }
        </div>
    )
}
const RowTemplate:FC = () => {
    let [rows,setRows] = useState<I_table_row[]>(model)
    return (
        <div className='example'>
            <AIOTable
                attrs={{style:{height:600}}}
                value={rows}
                rowOption={{
                    template:({row})=><div className='custom-row'>{row.name}</div>
                }}
                onChange={(newRows)=>setRows(newRows)}
            />
            {
                Code(`
let [rows,setRows] = useState(...)
return (
    <AIOTable
        attrs={{style:{height:600}}}
        value={rows}
        rowOption={{
            template:({row})=><div className='custom-row'>{row.name}</div>
        }}
        onChange={(newRows)=>setRows(newRows)}
    />
)
                `)
            }
        </div>
    )
}
const RowsTemplate:FC = () => {
    let [rows,setRows] = useState<I_table_row[]>(model)
    let [paging,setPaging] = useState<I_table_paging>({
        size:10,
        number:1,
    })
    return (
        <div className='example'>
            <AIOTable
                attrs={{style:{height:600}}}
                value={rows}
                columns={[
                    {title:'Name',value:'row.name'},
                    {title:'Gender',value:'row.gender'},
                    {title:'Age',value:'row.age'},
                ]}
                headerAttrs={{style:{display:'none'}}}
                rowsTemplate={(rows)=>{
                    return (
                        <div className='custom-rows'>
                            {
                                rows.map((row,i)=>{
                                    return (
                                        <Card key={(row as any)._id} row={row}/>
                                    )
                                })
                            }
                        </div>
                    )
                }}
                onChange={(newRows)=>setRows(newRows)}
                paging={paging}
                onChangePaging={(paging)=>setPaging(paging)}
                onSearch={true}
            />          
            {
                Code(`
let [rows,setRows] = useState<I_table_row[]>(model)
let [paging,setPaging] = useState<AI_table_paging>({
    size:10,
    number:1,
})
return (
    <AIOTable
        attrs={{style:{height:600}}}
        value={rows}
        columns={[
            {title:'Name',value:'row.name'},
            {title:'Gender',value:'row.gender'},
            {title:'Age',value:'row.age'},
        ]}
        headerAttrs={{style:{display:'none'}}}
        rowsTemplate={(rows)=>{
            return (
                <div className='custom-rows'>
                    {
                        rows.map((row,i)=>{
                            return (
                                <Card key={(row as any)._id} row={row}/>
                            )
                        })
                    }
                </div>
            )
        }}
        onChange={(newRows)=>setRows(newRows)}
        paging={paging}
        onChangePaging={(paging)=>setPaging(paging)}
        onSearch={true}
    />
)
                `)
            }
        </div>
    )
}
function Card(p:any){
    let {row} = p;
    return (
        <div className="flex-col-" style={{width:'50%',maxWidth:160,minWidth:120,border:'1px solid #ddd',height:240,padding:12}}>
            <div className="msf">{row.name}</div>
            <div className="msf">{row.gender}</div>
            <div className="align-vh- fs-24- flex-1-">{row.age}</div>
        </div>
    )
}
const RowAfter:FC = () => {
    let [rows,setRows] = useState<I_table_row[]>(model)
    return (
        <div className='example'>
            <AIOTable
                attrs={{style:{height:600}}}
                value={rows}
                columns={[
                    {title:'Name',value:'row.name'},
                    {title:'Gender',value:'row.gender'},
                    {title:'Age',value:'row.age'},
                ]}
                onChange={(newRows)=>setRows(newRows)}
                rowOption={{
                    after:({row})=>{
                        return <div style={{padding:'0 12px',background:'orange',color:'#fff'}}>this is my row after</div>
                    }
                }}
            />
            {
                Code(`
<AIOTable
    attrs={{style:{height:600}}}
    value={rows}
    columns={[
        {title:'Name',value:'row.name'},
        {title:'Gender',value:'row.gender'},
        {title:'Age',value:'row.age'},
    ]}
    onChange={(newRows)=>setRows(newRows)}
    rowOption={{
        after:({row})=>{
            return <div style={{padding:'0 12px',background:'orange',color:'#fff'}}>this is my row after</div>
        }
    }}
/>
                `)
            }
        </div>
    )
}
const RowBefore:FC = () => {
    let [rows,setRows] = useState<I_table_row[]>(model);
    return (
        <div className='example'>
            <AIOTable
                attrs={{style:{height:600}}}
                value={rows}
                rowOption={{
                    before:({row})=>{
                        return <div style={{padding:'0 12px',background:'orange',color:'#fff',marginTop:12}}>this is my row before</div>
                    }
                }}
                columns={[
                    {title:'Name',value:'row.name'},
                    {title:'Gender',value:'row.gender'},
                    {title:'Age',value:'row.age'},
                ]}
                onChange={(newRows)=>setRows(newRows)}
            />         
            {
                Code(`
<AIOTable
    attrs={{style:{height:600}}}
    value={rows}
    rowOption={{
        before:({row})=>{
            return <div style={{padding:'0 12px',background:'orange',color:'#fff',marginTop:12}}>this is my row before</div>
        }
    }}
    columns={[
        {title:'Name',value:'row.name'},
        {title:'Gender',value:'row.gender'},
        {title:'Age',value:'row.age'},
    ]}
    onChange={(newRows)=>setRows(newRows)}
/>
                    `)
            }
            <h3>rows</h3>
            {Code(JSON.stringify(rows,null,4))}
        </div>
    )
}
const Column_Title:FC = () => {
    const [rows,setRows] = useState(model)
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    {title:()=>'Name',value:'row.name'},
                    {title:<div style={{width:24,height:24,borderRadius:'100%',background:'yellow'}}></div>,value:'row.gender'},
                    {title:'Age',value:'row.age'},
                ]}
            />         
            {
                Code(`
<AIOTable
    value={rows}
    columns={[
        {title:()=>'Name',value:'row.name'},
        {title:<div style={{width:24,height:24,borderRadius:'100%',background:'yellow'}}></div>,value:'row.gender'},
        {title:'Age',value:'row.age'},
    ]}
/>
                `)
            }
        </div>
    )
}
const Column_TitleAttrs:FC = () => {
    const [rows,setRows] = useState(model)
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    {title:'Name',value:'row.name',titleAttrs:{style:{background:'yellow'}}},
                    {title:'Gender',value:'row.gender'},
                    {title:'Age',value:'row.age'},
                ]}
            />
            {
                Code(`
<AIOTable
    value={rows}
    columns={[
        {title:'Name',value:'row.name',titleAttrs:{style:{background:'yellow'}}},
        {title:'Gender',value:'row.gender'},
        {title:'Age',value:'row.age'},
    ]}
/>
                `)
            }
        </div>
    )
}
const Column_Width:FC = ()=> {
    const [rows,setRows] = useState(model)    
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    {title:'Name',value:'row.name',width:120},
                    {title:'Gender',value:'row.gender',width:'gender_column_width'},
                    {title:'Age',value:'row.age'},
                ]}
                getValue={{
                    gender_column_width:({row,column})=>260
                }}
            />
            {
                Code(`
<AIOTable
    value={rows}
    columns={[
        {title:'Name',value:'row.name',width:120},
        {title:'Gender',value:'row.gender',width:'gender_column_width'},
        {title:'Age',value:'row.age'},
    ]}
    getValue={{
        gender_column_width:({row,column})=>260
    }}
/>
                `)
            }
        </div>
    )
}
const Column_MinWidth:FC = () => {
    const [rows,setRows] = useState(model)    
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    {title:'Name',value:'row.name',width:120},
                    {title:'Gender',value:'row.gender',minWidth:160},
                    {title:'Age',value:'row.age'},
                ]}
            />
            {
                Code(`
<AIOTable
    value={rows}
    columns={[
        {title:'Name',value:'row.name',width:120},
        {title:'Gender',value:'row.gender',minWidth:160},
        {title:'Age',value:'row.age'},
    ]}
/>
                `)
            }
        </div>
    )
}
const Column_Justify:FC = () => {
    const [rows,setRows] = useState(model)    
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    {title:'Name',value:'row.name'},
                    {title:'Gender',value:'row.gender'},
                    {title:'Age',value:'row.age',justify:true},
                ]}
            />
            {
                Code(`
<AIOTable
    value={rows}
    columns={[
        {title:'Name',value:'row.name'},
        {title:'Gender',value:'row.gender'},
        {title:'Age',value:'row.age',justify:true},
    ]}
/>
                `)
            }
        </div>
    )
}
const Column_Input:FC = () => {
    let [rows,setRows] = useState<I_table_row[]>(model);
    return (
        <div className='example'>
            <AIOTable<I_table_row>
                attrs={{style:{height:500}}}
                value={rows}
                onChange={(newRows)=>setRows(newRows)}
                columns={[
                    {
                        title:'Name',value:'row.name',
                        template:({row,change})=>{
                            return (
                                <AIText
                                    value={row.name}
                                    onChange={(name)=>change({...row,name})}
                                />
                            )
                        }
                    },
                    {
                        title:'Gender',value:'row.gender',
                        template:({row,change})=>{
                            return (
                                <AISelect
                                    options={[
                                        {text:'Male',value:'male'},
                                        {text:'Female',value:'female'}
                                    ]}
                                    value={row.gender}
                                    onChange={(gender)=>change({...row,gender})}
                                />
                            )
                        }
                    },
                    {
                        title:'Age',value:'row.age',
                        template:({row,change})=>{
                            return (
                                <AINumber
                                    value={row.age}
                                    onChange={(age)=>change({...row,age:age as number})}
                                />
                            )
                        }
                    },
                    {
                        title:'Date',value:'row.date',
                        template:({row,change})=>{
                            return (
                                <AIDate
                                    value={row.date}
                                    onChange={(date)=>change({...row,date})}
                                />
                            )
                        }
                    },
                    {
                        title:'Active',value:'row.active',
                        template:({row,change})=>{
                            return (
                                <AICheckbox
                                    value={row.active}
                                    onChange={(active)=>change({...row,active})}
                                />
                            )
                        }
                    }
                ]}
            />
            {
                Code(`

let [rows,setRows] = useState<I_table_row[]>(model);
<AIOTable<I_table_row>
    attrs={{style:{height:500}}}
    value={rows}
    onChange={(newRows)=>setRows(newRows)}
    columns={[
        {
            title:'Name',value:'row.name',
            template:({row,change})=>{
                return (
                    <AIText
                        value={row.name}
                        onChange={(name)=>change({...row,name})}
                    />
                )
            }
        },
        {
            title:'Gender',value:'row.gender',
            template:({row,change})=>{
                return (
                    <AISelect
                        options={[
                            {text:'Male',value:'male'},
                            {text:'Female',value:'female'}
                        ]}
                        value={row.gender}
                        onChange={(gender)=>change({...row,gender})}
                    />
                )
            }
        },
        {
            title:'Age',value:'row.age',
            template:({row,change})=>{
                return (
                    <AINumber
                        value={row.age}
                        onChange={(age)=>change({...row,age:age as number})}
                    />
                )
            }
        },
        {
            title:'Date',value:'row.date',
            template:({row,change})=>{
                return (
                    <AIDate
                        value={row.date}
                        onChange={(date)=>change({...row,date})}
                    />
                )
            }
        },
        {
            title:'Active',value:'row.active',
            template:({row,change})=>{
                return (
                    <AICheckbox
                        value={row.active}
                        onChange={(active)=>change({...row,active})}
                    />
                )
            }
        }
    ]}
/>
                `)
            }
        </div>
    )
}
const Column_CellAttrs:FC = () => {
    const [rows,setRows] = useState(model)    
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    {title:'Name',value:'row.name'},
                    {title:'Gender',value:'row.gender'},
                    {title:'Age',value:'row.age'}
                ]}
                onChange={(newRows)=>setRows(newRows)}
                getValue={{
                    gender_column_attrs:({row,column})=>{
                        return {style:{background:'lightblue'}}
                    }
                }}
                cellAttrs={({row,column})=>{
                    if(column.title === 'Name'){
                        return {style:{background:'pink'}}
                    }
                    if(column.title === 'Gender'){
                        return {style:{background:'lightblue'}}
                    }
                    if(column.title === 'Age'){
                        if(row.age < 35){return {style:{background:'red',color:'#fff'}}}
                        return {style:{background:'green',color:'#fff'}}
                    }
                }}
            />             
            {
                Code(`
<AIOTable
    value={rows}
    columns={[
        {
            title:'Name',value:'row.name',
            cellAttrs:{style:{background:'pink'}}
        },
        {
            title:'Gender',value:'row.gender',
            cellAttrs:'gender_column_attrs'
        },
        {
            title:'Age',value:'row.age',
            cellAttrs:({row,column})=>{
                if(row.age < 35){
                    return {style:{background:'red',color:'#fff'}}
                }
                return {style:{background:'green',color:'#fff'}}
            }
        }
    ]}
    onChange={(newRows)=>setRows(newRows)}
    getValue={{
        gender_column_attrs:({row,column})=>{
            return {style:{background:'lightblue'}}
        }
    }}
/>
                `)
            }
        </div>
    )
}
const Column_SubtextBeforeAfter:FC = () => {
    const [rows,setRows] = useState(model)    
    return (
        <div className='example'>
            <AIOTable
                value={rows}
                columns={[
                    {
                        title:'Name',value:'row.name',
                        before:({row})=><Icon path={row.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>,
                        after:({row})=><div style={{color:'#fff',background:'orange',borderRadius:6,padding:3}}>{row.age}</div>,
                        subtext:({row})=>row.date
                    }
                ]}
                onChange={(newRows)=>setRows(newRows)}
                rowOption={{
                    attrs:({row})=>{
                        return {style:{height:48}}
                    }
                }}
            />
            {
                Code(`

<AIOTable
    value={rows}
    columns={[
        {
            title:'Name',value:'row.name',
            before:({row})=><Icon path={row.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>,
            after:({row})=><div style={{color:'#fff',background:'orange',borderRadius:6,padding:3}}>{row.age}</div>,
            subtext:({row})=>row.date
        }
    ]}
    onChange={(newRows)=>setRows(newRows)}
    rowOption={{
        attrs:({row})=>{
            return {style:{height:48}}
        }
    }}
/>
                `)
            }
            <h3>rows</h3>
            {Code(JSON.stringify(rows,null,4))}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
const Column_Template:FC = () => {
    let [rows,setRows] = useState<I_table_row[]>(model);
    return (
        <div className='example'>
            <AIOTable<any>
                value={rows}
                columns={[
                    {title:'Name',value:'row.name'},
                    {title:'Gender',value:'row.gender'},
                    {title:'Age',value:'row.age',template:'age_template'}
                ]}
                getValue={{
                    age_template:({row,column})=>{
                        return row.age + ' years old'
                    }
                }}
                onChange={(newRows)=>setRows(newRows)}
            />
            {
                Code(`

<AIOTable<any>
    value={rows}
    columns={[
        {title:'Name',value:'row.name'},
        {title:'Gender',value:'row.gender'},
        {title:'Age',value:'row.age',template:'age_template'}
    ]}
    getValue={{
        age_template:({row,column})=>{
            return row.age + ' years old'
        }
    }}
    onChange={(newRows)=>setRows(newRows)}
/>
                `)
            }
            <h3>rows</h3>
            {Code(JSON.stringify(rows,null,4))}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
const Column_Sort:FC = () => {
    let [rows,setRows] = useState((model))
    return (
        <div className='example'>
            <AIOTable
                attrs={{style:{height:600}}}
                value={rows}
                columns={[
                    {title:'Name',value:'row.name',sort:true},
                    {title:'Gender',value:'row.gender',sort:true},
                    {title:'Age',value:'row.age'},
                ]}
                onChange={(newRows)=>setRows(newRows)}
            />
            {
                Code(`

<AIOTable
    attrs={{style:{height:600}}}
    value={rows}
    columns={[
        {title:'Name',value:'row.name',sort:true},
        {title:'Gender',value:'row.gender',sort:true},
        {title:'Age',value:'row.age'},
    ]}
    onChange={(newRows)=>setRows(newRows)}
/>
                `)
            }
            <h3>rows</h3>
            {Code(JSON.stringify(rows,null,4))}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
const Column_Filter:FC = () => {
    let [rows,setRows] = useState((model))
    const [filterRows,setFilterRows] = useState<I_table_filter_item[]>([])
    const [savedItems,setSavedItems] = useState<I_table_filter_saved_item[]>([])
    return (
        <div className='example'>
            <AIOTable
                attrs={{style:{height:600}}}
                value={rows}
                columns={[
                    {title:'Name',value:'row.name',filterId:'name'},
                    {title:'Gender',value:'row.gender',filterId:'gender'},
                    {title:'Age',value:'row.age'},
                ]}
                onChange={(newRows)=>setRows(newRows)}
                filter={{
                    items:filterRows,
                    onChange:(newFilters)=>{
                        setFilterRows(newFilters)
                    },
                    savedItems:savedItems,
                    changeSavedItems:(newSavedItems)=>setSavedItems(newSavedItems),
                    activeSavedItem:(saveItem)=>setFilterRows(saveItem.items)
                }}
            />
            {
                Code(`

<AIOTable
    attrs={{style:{height:600}}}
    value={rows}
    columns={[
        {title:'Name',value:'row.name',filterId:'name'},
        {title:'Gender',value:'row.gender',filterId:'gender'},
        {title:'Age',value:'row.age'},
    ]}
    onChange={(newRows)=>setRows(newRows)}
    filters={filters}
    onChangeFilter={(newFilters)=>{
        setFilters(newFilters)
    }}
/>
                `)
            }
            <h3>rows</h3>
            {Code(JSON.stringify(rows,null,4))}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
const OnChangeSort:FC = () => {
    let [rows,setRows] = useState<I_table_row[]>(model)
    return (
        <div className='example'>
            <h5>
                for server side sorting and prevent auto client side sorting use onChangeSort props.
                onChangeSort props is a function that get list of sorts.
                this function can returns false to prevent change sort control of table if any error occured
            </h5>
            <AIOTable
                attrs={{style:{height:600}}}
                value={rows}
                columns={[
                    {title:'Name',value:'row.name',sort:true},
                    {title:'Gender',value:'row.gender',sort:true},
                    {title:'Age',value:'row.age'},
                ]}
                onChange={(newRows)=>setRows(newRows)}
                onChangeSort={async (sorts)=>{
                    return false
                }}
            />          
            {
                Code(`

<AIOTable
    attrs={{style:{height:600}}}
    value={rows}
    columns={[
        {title:'Name',value:'row.name',sort:true},
        {title:'Gender',value:'row.gender',sort:true},
        {title:'Age',value:'row.age'},
    ]}
    onChange={(newRows)=>setRows(newRows)}
    onChangeSort={async (sorts)=>{
        return false
    }}
/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}