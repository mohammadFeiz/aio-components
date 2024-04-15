import React, { Component,createRef, useEffect, useState } from 'react';
import DOC, { I_DOC } from '../../../resuse-components/doc.tsx';
import AIODoc from '../../../npm/aio-documentation/aio-documentation.js';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom.js';
import AIOInput from '../../../npm/aio-input/index.tsx';
import './doc-aio-input-table.css';
import {Icon} from '@mdi/react';
import model from './model.js';
import { mdiHumanMale,mdiHumanFemale, mdiAbTesting, mdiFile} from '@mdi/js';
import { AI, AI_table_column, AI_table_paging } from '../../../npm/aio-input/types.tsx';
export default function DOC_AIOInput_Table(props) {
    let rows = [
        {name:'mohammad',family:'feiz',age:38,id:0},
        {name:'john',family:'doe',age:30,id:1},
    ]
    let rowsCode = `
let [rows,setRows] = useState([
    {name:'mohammad',family:'feiz',age:38,id:0},
    {name:'john',family:'doe',age:30,id:1},
])
    `
    let p:I_DOC = {
        name:props.name,
        goToHome:props.goToHome,
        nav:{
            items:()=>[
                { text: 'performance', id: 'performance', render: () => <Performance /> },
                { text: 'type ,placeholder', id: 'type', render: () => <TypePlaceholder /> },
                { text: 'row,columns', id: 'rowscolumns', render: () => <RowsAndColumns /> },
                { text: 'attrs', id: 'attrs', render: () => <Attrs /> },
                { text: 'onSwap', id: 'onSwap', render: () => <OnSwap rows={rows} rowsCode={rowsCode}/> },
                { 
                    text: 'column properties', id: 'columnproperties',
                    items:[
                        { text: 'column.title', id: 'column.title', render: () => <Column_Title rows={rows} rowsCode={rowsCode}/> },
                        { text: 'column.titleAttrs', id: 'column.titleAttrs', render: () => <Column_TitleAttrs rows={rows} rowsCode={rowsCode}/> },
                        { text: 'column.value', id: 'column.value', render: () => <Column_Value rows={rows} rowsCode={rowsCode} /> },
                        { text: 'column.width', id: 'column.width', render: () => <Column_Width rows={rows} rowsCode={rowsCode} /> },
                        { text: 'column.minWidth', id: 'column.minWidth', render: () => <Column_MinWidth rows={rows} rowsCode={rowsCode} /> },
                        { text: 'column.justify', id: 'column.justify', render: () => <Column_Justify rows={rows} rowsCode={rowsCode} /> },
                        { text: 'column.type', id: 'column.type', render: () => <Column_Type /> },
                        { text: 'column.onChange', id: 'column.onChange', render: () => <Column_OnChange rows={rows} rowsCode={rowsCode} /> },
                        { text: 'column.sort', id: 'columnsort', render: () => <Column_Sort /> },
                        { text: 'column.cellAttrs', id: 'column.cellAttrs', render: () => <Column_CellAttrs rows={rows} rowsCode={rowsCode}/> },
                        { text: 'column {subtext,before,after}', id: 'columnsubtextbeforeafter', render: () => <Column_SubtextBeforeAfter rows={rows} rowsCode={rowsCode} /> },
                        { text: 'column.template', id: 'column.template', render: () => <Column_Template rows={rows} rowsCode={rowsCode} /> }
                    ]
                },
                { text: 'onChange', id: 'onChange', render: () => <OnChange rows={rows} rowsCode={rowsCode} /> },
                { text: 'excel', id: 'excel', render: () => <Excel rows={rows} rowsCode={rowsCode} /> },
                { text: 'toolbar', id: 'toolbar', render: () => <Toolbar rows={rows} rowsCode={rowsCode} /> },
                { text: 'toolbarAttrs', id: 'toolbarAttrs', render: () => <ToolbarAttrs rows={rows} rowsCode={rowsCode} /> },
                { text: 'rowGap columnGap', id: 'rowGapcolumnGap', render: () => <RowGapColumnGap rows={rows} rowsCode={rowsCode} /> },
                { text: 'onAdd', id: 'onAdd', render: () => <OnAdd rows={rows} rowsCode={rowsCode} /> },
                { text: 'onRemove', id: 'onRemove', render: () => <OnRemove rows={rows} rowsCode={rowsCode} /> },
                { text: 'onSearch', id: 'onSearch', render: () => <OnSearch /> },
                { text: 'rowAttrs', id: 'rowAttrs', render: () => <RowAttrs /> },
                { text: 'headerAttrs', id: 'headerAttrs', render: () => <HeaderAttrs rows={rows} rowsCode={rowsCode} /> },
                { text: 'paging', id: 'paging', render: () => <Paging /> },
                { text: 'paging serverSide:true', id: 'pagingserverside', render: () => <Paging_ServerSide /> },
                { text: 'rowTemplate', id: 'rowTemplate', render: () => <RowTemplate /> },
                { text: 'rowsTemplate', id: 'rowsTemplate', render: () => <RowsTemplate /> },
                { text: 'rowAfter', id: 'rowAfter', render: () => <RowAfter /> },
                { text: 'rowBefore', id: 'rowBefore', render: () => <RowBefore /> },
                { text: 'onChangeSort', id: 'onChangeSort', render: () => <OnChangeSort /> },
            ]
        }
    }
    return (<DOC {...p} />)
}
function Performance () {
    let [rows,setRows] = useState(getRows())
    function getRows(){
        let rows = []
        for(let i = 0; i < 10000; i++){
            rows.push({
                name:`name_${i + 1}`,family:`family_${i + 1}`,age:Math.round(Math.random() * 70) + 5,id:i + 1
            })
        }
        return rows
    }
    let [columns] = useState<AI_table_column[]>([
        {title:'#',value:({rowIndex})=>rowIndex + 1,width:68},
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Family',value:'row.family',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    let [paging,setPaging] = useState<AI_table_paging>({size:100,number:1,sizes:[100,200,300]})
    function renderTable(){
        let p:AI = {type:'table',style:{height:400},value:rows,columns,onChange:(value)=>setRows(value),paging,onChangePaging:(paging)=>setPaging(paging)}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text',onChange:({row,column,value})=>this.change(row,'name',value)}},
    {title:'Family',value:'row.family',input:{type:'text',onChange:({row,column,value})=>this.change(row,'family',value)}},
    {title:'Age',value:'row.age',input:{type:'number',onChange:({row,column,value})=>this.change(row,'age',value)}},
]
function change(){
    let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
    setRows(newRows)
}
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
    />
)
                `)
            }
            
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}

function TypePlaceholder() {
    function getTable(){
        let p:AI = {type:'table',placeholder:'موردی وجود ندارد'}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {getTable()}                
            {
                AIODoc().Code(`
<AIOInput
type='table'
placeholder='موردی وجود ندارد'
/>
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
    
}
function RowsAndColumns() {
    let [rows] = useState([
        {name:'mohammad',family:'feiz',age:38},
        {name:'john',family:'doe',age:30},
    ])
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name'},
        {title:'Family',value:'row.family'},
        {title:'Age',value:'row.age'},
    ])
    function getTable(){
        let p:AI = {type:'table',value:rows,columns}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {getTable()}                
            {
                AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name'},
    {title:'Family',value:'row.family'},
    {title:'Age',value:'row.age'}
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_Title({rows,rowsCode}) {
    let [columns] = useState<AI_table_column[]>([
        {title:()=>'Name',value:'row.name'},
        {title:<div style={{width:24,height:24,borderRadius:'100%',background:'yellow'}}></div>,value:'row.family'},
        {title:'Age',value:'row.age'},
    ])
    function getTable(){
        let p:AI = {type:'table',value:rows,columns}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {getTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:()=>'Name',value:'row.name'},
    {title:<div style={{width:24,height:24,borderRadius:'100%',background:'yellow'}}></div>,value:'row.family'},
    {title:'Age',value:'row.age'},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Attrs() {
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Gender',value:'row.gender',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    let rows = model;
    return (
        <div className='example'>
            <AIOInput
                type='table'
                attrs={{style:{height:360,border:'4px solid #ddd'}}}
                value={rows}
                columns={columns}
            />                
            {
                AIODoc().Code(`

let rows = model;
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Gender',value:'row.gender',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        attrs={{style:{height:360,border:'4px solid #ddd'}}}
        value={rows}
        columns={columns}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_TitleAttrs({rows,rowsCode}) {
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',titleAttrs:{style:{background:'yellow'}}},
        {title:'Family',value:'row.family'},
        {title:'Age',value:'row.age'},
    ])
    function getTable(){
        let p:AI = {type:'table',value:rows,columns}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {getTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',titleAttrs:{style:{background:'yellow'}}},
    {title:'Family',value:'row.family'},
    {title:'Age',value:'row.age'},
]
return (<AIOInput type='table' value={rows} columns={columns}/>)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_Value({rows,rowsCode}) {
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'abc'},
        {title:'Family',value:'row.family'},
        {title:'Age',value:'get_age'},
    ])
    function renderTable(){
        let p:AI = {
            type:'table',value:rows,columns,
            getValue:{
                get_age:({row,column})=>row.age
            }
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    //static value
    {title:'Name',value:'abc'},
    //dynamic string
    {title:'Family',value:'row.family'},
    //refrence to getValue prop
    {title:'Age',value:'get_age'}
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        getValue={{
            get_age:({row,column})=>row.age
        }}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_Width({rows,rowsCode}) {
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',width:120},
        {title:'Family',value:'row.family',width:'family_column_width'},
        {title:'Age',value:'row.age'},
    ])
    function renderTable(){
        let p:AI = {
            type:'table',value:rows,columns,
            getValue:{
                family_column_width:({row,column})=>260
            }
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',width:120},
    {title:'Family',value:'row.family',width:'family_column_width'},
    {title:'Age',value:'row.age'},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        getValue={{
            family_column_width:({row,column})=>260
        }}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_MinWidth({rows,rowsCode}) {
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',width:120},
        {title:'Family',value:'row.family',minWidth:160},
        {title:'Age',value:'row.age'},
    ])
    function renderTable(){
        let p:AI = {type:'table',value:rows,columns}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',width:120},
    {title:'Family',value:'row.family',minWidth:160},
    {title:'Age',value:'row.age'}
]
return (<AIOInput type='table' value={rows} columns={columns}/>)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_Justify({rows,rowsCode}) {
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name'},
        {title:'Family',value:'row.family'},
        {title:'Age',value:'row.age',justify:true},
    ])
    function renderTable(){
        let p:AI = {type:'table',value:rows,columns}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name'},
    {title:'Family',value:'row.family'},
    {title:'Age',value:'row.age',justify:true},
]
return (<AIOInput type='table' value={rows} columns={columns}/>)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_Type() {
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {
            title:'Gender',value:'row.gender',
            input:{
                type:'select',
                options:[
                    {text:'Male',value:'male'},
                    {text:'Female',value:'female'}
                ]
            }
        },
        {title:'Age',value:'row.age',input:{type:'number'}},
        {title:'Date',value:'row.date',input:{type:'date',unit:'month'}},
        {title:'Active',value:'row.active',input:{type:'checkbox'}},
    ])
    let [rows,setRows] = useState(model);
    function renderTable(){
        let p:AI = {type:'table',attrs:{style:{height:500}},value:rows,columns,onChange:(rows)=>setRows(rows)}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`

let rows = model;
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {
        title:'Gender',value:'row.gender',
        input:{
            type:'select',
            options:[
                {text:'Male',value:'male'},
                {text:'Female',value:'female'}
            ]
        }
    },
    {title:'Age',value:'row.age',input:{type:'number'}},
    {title:'Date',value:'row.date',input:{type:'date',unit:'month'}},
    {title:'Active',value:'row.active',input:{type:'checkbox'}},
]
return (
    <AIOInput
        type='table'
        attrs={{style:{height:700}}}
        value={rows}
        columns={columns}
        onChange={(rows)=>this.setState({rows})}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_OnChange({rows:Rows,rowsCode}) {
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text',onChange:({row,column,value})=>change(row,'name',value)}},
        {title:'Family',value:'row.family',input:{type:'text',onChange:({row,column,value})=>change(row,'family',value)}},
        {title:'Age',value:'row.age',input:{type:'number',onChange:({row,column,value})=>change(row,'age',value)}},
    ])
    let [rows,setRows] = useState(Rows);
    function change(row,key,value){
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        setRows(newRows)
    }
    function renderTable(){
        let p:AI = {type:'table',value:rows,columns}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`

${rowsCode}
let [columns] = useState<AI_table_column[]>([
    {title:'Name',value:'row.name',input:{type:'text',onChange:({row,column,value})=>change(row,'name',value)}},
    {title:'Family',value:'row.family',input:{type:'text',onChange:({row,column,value})=>change(row,'family',value)}},
    {title:'Age',value:'row.age',input:{type:'number',onChange:({row,column,value})=>change(row,'age',value)}},
])
function change(row,key,value){
    let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
    setRows(newRows)
}
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
    />
)
                `)
            }
            <h3>rows</h3>
            {
                AIODoc().Code(JSON.stringify(rows,null,4))
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function OnChange({rows:Rows,rowsCode}) {
    let [rows,setRows] = useState(Rows)
    let [columns,setColumn] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Family',value:'row.family',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows)
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function OnSwap({rows:Rows,rowsCode}) {
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Family',value:'row.family',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    let [rows,setRows] = useState(Rows);
    function renderTable(type:'true'|'function'){
        let p:AI = {type:'table',value:rows,columns,onChange:(newRows)=>setRows(newRows)}
        if(type === 'true'){p.onSwap = true}
        else if(type === 'function'){p.onSwap = (newRows,startRow,endRow)=>setRows(newRows)}
        return <AIOInput {...p}/>
    }
    function getCode(type:'true'|'function'){
        return (`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        ${type === 'true'?'onSwap={true}':'onSwap={(newRows,startRow,endRow)=>setRows(newRows)}'}
    />
)
`)
    }
    return (
        <div className='example'>
            <h3>{`onSwap={true}`}</h3>
            {renderTable('true')}                
            {AIODoc().Code(getCode('true'))}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
            <h3>{`onSwap={Function}`}</h3>
            {renderTable('function')}                
            {AIODoc().Code(getCode('function'))}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Excel({rows:Rows,rowsCode}){
    let [rows,setRows] = useState(Rows)
    let [columns,setColumn] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'},excel:'name'},
        {title:'Family',value:'row.family',input:{type:'text'},excel:'family'},
        {title:'Age',value:'row.age',input:{type:'number'},excel:'age'},
    ])
    function renderTable(){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows),
            excel:'please inter excel file name'
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'},excel:'name'},
    {title:'Family',value:'row.family',input:{type:'text'},excel:'family'},
    {title:'Age',value:'row.age',input:{type:'number'},excel:'age'},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        excel={'please inter excel file name'}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_CellAttrs({rows:Rows,rowsCode}) {
    let [rows,setRows] = useState(Rows)
    let [columns,setColumns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'},cellAttrs:{style:{background:'pink'}}},
        {title:'Family',value:'row.family',input:{type:'text'},cellAttrs:'family_column_attrs'},
        {title:'Age',value:'row.age',input:{type:'number'},cellAttrs:({row,column})=>{
            if(row.age < 35){return {style:{background:'red',color:'#fff'}}}
            return {style:{background:'green',color:'#fff'}}
        }},
    ])
    function renderTable(){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows),
            getValue:{
                family_column_attrs:({row,column})=>{
                    return {style:{background:'lightblue'}}
                }
            }
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {
        title:'Name',
        value:'row.name',
        input:{type:'text'},
        //use direct value
        cellAttrs:{
            style:{background:'pink'}
        }
    },
    {
        title:'Family',
        value:'row.family',
        input:{type:'text'},
        //reference to getValue props
        cellAttrs:'family_column_attrs'
    },
    {
        title:'Age',
        value:'row.age',
        input:{type:'number'},
        //use function to call per row
        cellAttrs:({row,column,rowIndex})=>{
            if(row.age < 35){
                return {
                    style:{background:'red',color:'#fff'}
                }
            }
            return {
                style:{background:'green',color:'#fff'}
            }
        }
    }
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        getValue={{
            family_column_attrs:({row,column})=>{
                return {style:{background:'lightblue'}}
            }
        }}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_SubtextBeforeAfter({rows:Rows,rowsCode}) {
    let [rows,setRows] = useState(Rows);
    let [columns,setColumns] = useState<AI_table_column[]>([
        {
            title:'Name',
            value:'row.name',
            input:{
                type:'text',
                subtext:'row.age + " years old"',
                before:({row,column})=>{
                    return <Icon path={row.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>
                },
                after:'name_column_after'
            }
        }
    ])
    function renderTable(){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows),
            getValue:{
                name_column_before:({row,column,rowIndex})=>{
                    return <Icon path={row.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>
                },
                name_column_after:({row,column})=>{
                    return (
                        <div style={{color:'#fff',background:'orange',borderRadius:6,padding:3}}>{row.age}</div>
                    )
                }
            },
            rowAttrs:(row)=>{
                return {style:{height:48}}
            }
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`

${rowsCode}
let columns = [
    {
        title:'Name',
        value:'row.name',
        input:{
            type:'text',
            subtext:'row.age + " years old"',
            before:({row,column,rowIndex})=>{
                return <Icon path={row.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>
            },
            after:'name_column_after'
        }
    }
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        getValue={{
            name_column_before:({row,column})=>{
                return <Icon path={row.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>
            },
            name_column_after:({row,column})=>{
                return (
                    <div 
                        style={{color:'#fff',background:'orange',borderRadius:6,padding:3}}
                    >{row.age}</div>
                )
            }
        }}
        rowAttrs={(row)=>{
            return {style:{height:48}}
        }}
    />
)
                `)
            }
            <h3>rows</h3>
            {
                AIODoc().Code(JSON.stringify(rows,null,4))
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function OnAdd({rows:Rows,rowsCode}) {
    let [rows,setRows] = useState(Rows)
    let [columns,setColumn] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Family',value:'row.family',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(type:'object' | 'function'){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows)
        }
        if(type === 'function'){
            p.onAdd = ()=>{setRows([{name:'',family:'',age:0},...rows])}
        }
        else {
            p.onAdd = {name:'',family:'',age:0}
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            <h3>{`onAdd={function}`}</h3>
            {renderTable('function')}                
            {
                AIODoc().Code(`

${rowsCode}
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        onAdd={()=>{
            this.setState({rows:[{name:'',family:'',age:0},...rows]})
        }}
    />
)
                `)
            }
            <h3>{`onAdd={object}`}</h3>
            {renderTable('object')}                
            {
                AIODoc().Code(`

${rowsCode}
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        onAdd={{name:'',family:'',age:0}}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function OnRemove({rows:Rows,rowsCode}) {
    let [rows,setRows] = useState<any[]>(Rows)
    let [columns,setColumn] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Family',value:'row.family',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(type:'true' | 'function'){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows)
        }
        if(type === 'function'){p.onRemove = (row:any)=>setRows(rows.filter((o)=>o.id !== row.id))}
        else {p.onRemove = true}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            <h3>{`onRemove={function}`}</h3>
            {renderTable('function')}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        onRemove={(row)=>{
            this.setState({rows:rows.filter((o)=>o.id !== row.id)})
        }}
    />
)
                `)
            }
            <h3>{`onRemove={true}`}</h3>
            {renderTable('true')}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        onRemove={true}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function OnSearch() {
    let [rows,setRows] = useState(model)
    let [columns,setColumn] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'},search:true},
        {title:'Gender',value:'row.gender',input:{type:'text'},search:true},
        {title:'Age',value:'row.age',input:{type:'number'},search:true}
    ])
    function renderTable(type:'true' | 'function'){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows),
        }
        if(type === 'function'){p.onSearch = (text)=>{debugger;}}
        else {p.onSearch = true}
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable('function')}                
            {
                AIODoc().Code(`

let rows = model;
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Gender',value:'row.gender',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        onSearch={(text)=>{
            debugger
        }}
    />
)
                `)
            }
            {renderTable('true')}                
            {
                AIODoc().Code(`

let rows = model;
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Gender',value:'row.gender',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        onSearch={true}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Toolbar({rows:Rows,rowsCode}) {
    let [rows,setRows] = useState(Rows)
    let [columns,setColumn] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Family',value:'row.family',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows),
            toolbar:(
                <>
                    <Icon path={mdiFile} size={0.7}/>                            
                    <div style={{width:6}}></div>
                    this is my title
                </>
            )
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        toolbar={(
            <>
                <Icon path={mdiFile} size={0.7}/>                            
                <div style={{width:6}}></div>
                this is my title
            </>
        )}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function ToolbarAttrs({rows:Rows,rowsCode}){
    let [rows,setRows] = useState(Rows)
    let [columns,setColumn] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Family',value:'row.family',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows),
            toolbar:(
                <>
                    <Icon path={mdiFile} size={0.7}/>                            
                    <div style={{width:6}}></div>
                    this is my title
                </>
            ),
            toolbarAttrs:{
                style:{background:'orange',color:'#fff'}
            }
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
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
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function RowGapColumnGap({rows:Rows,rowsCode}) {
    let [rows,setRows] = useState(Rows)
    let [columns,setColumn] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Family',value:'row.family',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows),
            rowGap:6,
            columnGap:6
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        rowGap={6}
        columnGap={6}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_Template({rows:Rows,rowsCode}) {
    let [rows,setRows] = useState(Rows)
    let [columns,setColumns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Family',value:'row.family',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'},template:'age_template'}
    ])
    function renderTable(){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows),
            getValue:{
                age_template:({row,column})=>{
                    return row.age + ' years old'
                }
            }
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`

let rows = [
{name:'mohammad',family:'feiz',age:38},
{name:'john',family:'doe',age:30},
]
let columns = [
{title:'Name',value:'row.name',input:{type:'text'}},
{title:'Family',value:'row.family',input:{type:'text'}},
{title:'Age',value:'row.age',input:{type:'number'},template:'age_template'}
]
function setRows(newRows){
//update state
}
return (
type='table'
value={rows}
columns={columns}
onChange={(newRows)=>this.setState({rows:newRows})}
getValue={{
    age_template:({row,column})=>{
        return row.age + ' years old'
    }
}}
)
                `)
            }
            <h3>rows</h3>
            {
                AIODoc().Code(JSON.stringify(rows,null,4))
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function RowAttrs() {
    let [rows,setRows] = useState(model)
    let [columns,setColumns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Gender',value:'row.gender',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(){
        let p:AI = {
            type:'table',
            attrs:{style:{height:700}},
            value:rows,
            columns,
            onChange:(newRows)=>this.setState({rows:newRows}),
            rowAttrs:({row,rowIndex})=>{
                let style:any = {height:48};
                if(rowIndex % 2 === 0){style.background = '#eee'}
                return {style}
            }
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`

let [rows,setRows] = useState(...)
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Gender',value:'row.gender',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        attrs={{style:{height:700}}}
        value={rows}
        columns={columns}
        onChange={(newRows)=>this.setState({rows:newRows})}
        rowAttrs={({row,rowIndex})=>{
            let style = {height:48};
            if(rowIndex % 2 === 0){style.background = '#eee'}
            return {style}
        }}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function HeaderAttrs({rows:Rows,rowsCode}) {
    let [rows,setRows] = useState(Rows)
    let [columns,setColumns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Family',value:'row.family',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(){
        let p:AI = {
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>this.setState({rows:newRows}),
            headerAttrs:{
                style:{background:'pink'}
            }
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
${rowsCode}
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>this.setState({rows:newRows})}
        headerAttrs={{
            style:{background:'pink'}
        }}
    />
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Paging() {
    let [rows,setRows] = useState(model)
    let [columns,setColumns] = useState<AI_table_column[]>([
        {
            title:'',width:42,justify:true,
            template:({rowIndex})=>rowIndex + 1
        },
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Gender',value:'row.gender',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    let [paging,setPaging] = useState<AI_table_paging>({
        number:1,
        size:15,
        sizes:[15,30,50]
    })

    function renderTable(){
        let p:AI = {
            attrs:{style:{height:600}},
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows),
            paging,
            onChangePaging:(paging)=>setPaging(paging)
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`

class Paging extends Component {
constructor(props){
    super(props);
    this.state = {
        rows:model,
        columns:[
            {
                title:'',size:42,justify:true,
                {
                    title:'',width:42,justify:true,
                    template:({rowIndex})=>rowIndex + 1
                }
            },
            {title:'Name',value:'row.name',input:{type:'text'}},
            {title:'Gender',value:'row.gender',input:{type:'text'}},
            {title:'Age',value:'row.age',input:{type:'number'}},
        ],
        paging:{
            number:1,
            size:15,
            sizes:[15,30,50],
            length:model.length,
            onChange:(paging)=>this.setState({paging})
        }
    }
}
render() {
    let {rows,columns,paging} = this.state;
    return (
        <AIOInput
            attrs={{style:{height:600}}}
            type='table'
            value={rows}
            columns={columns}
            onChange={(newRows)=>this.setState({rows:newRows})}
            paging={paging}
        />                
    )
}
}
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Paging_ServerSide() {
    let [rows,setRows] = useState([])
    let [columns,setColumns] = useState<AI_table_column[]>([
        {
            title:'',width:42,justify:true,
            template:({rowIndex})=>rowIndex + 1
        },
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Gender',value:'row.gender',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    let [paging,setPaging] = useState<AI_table_paging>({
        serverSide:true,
        number:1,
        size:15,
        sizes:[15,30,50],
        length:model.length,
    })
    useEffect(()=>{
        setRows(getRowsByPaging(paging))
    },[])
    function getRowsByPaging(paging){
        let {size,number} = paging;
        return model.slice((number - 1) * size,number * size)
    }
    function renderTable(){
        let p:AI = {
            attrs:{style:{height:600}},
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>this.setState({rows:newRows}),
            onChangePaging:(paging)=>{
                setPaging(paging);
                setRows(getRowsByPaging(paging))
            },
            paging
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`

class Paging extends Component {
constructor(props){
    super(props);
    this.state = {
        rows:[],
        columns:[
            {
                title:'',width:42,justify:true,
                template:({rowIndex})=>rowIndex + 1
            },
            {title:'Name',value:'row.name',input:{type:'text'}},
            {title:'Gender',value:'row.gender',input:{type:'text'}},
            {title:'Age',value:'row.age',input:{type:'number'}},
        ],
        paging:{
            serverSide:true,
            number:1,
            size:15,
            sizes:[15,30,50],
            length:model.length,
            onChange:(paging)=>{
                this.setState({paging},()=>{
                    this.setState({rows:this.getRowsByPaging()})
                })
            }
        }
    }
}
componentDidMount(){
    this.setState({rows:this.getRowsByPaging()})
}
getRowsByPaging(){
    let {paging} = this.state;
    let {size,number} = paging;
    return model.slice((number - 1) * size,number * size)
}
render() {
    let {rows,columns,paging} = this.state;
    return (
        <AIOInput
            attrs={{style:{height:600}}}
            type='table'
            value={rows}
            columns={columns}
            onChange={(newRows)=>this.setState({rows:newRows})}
            paging={paging}
        />                
    )
}
}
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function RowTemplate() {
    let [rows,setRows] = useState(model)
    function renderTable(){
        let p:AI = {
            attrs:{style:{height:600}},
            type:'table',
            value:rows,
            rowTemplate:({row})=><div className='custom-row'>{row.name}</div>,
            onChange:(newRows)=>this.setState({rows:newRows})
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
let [rows,setRows] = useState(...)
return (
    <AIOInput
        attrs={{style:{height:600}}}
        type='table'
        value={rows}
        rowTemplate={({row})=><div className='custom-row'>{row.name}</div>}
        onChange={(newRows)=>this.setState({rows:newRows})}
    />                
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function RowsTemplate() {
    let [rows,setRows] = useState(model)
    let [paging,setPaging] = useState<AI_table_paging>({
        size:10,
        number:1,
    })
    let [columns,setColumns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Gender',value:'row.gender',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(){
        let p:AI = {
            attrs:{style:{height:600}},
            type:'table',
            value:rows,
            columns,
            headerAttrs:{style:{display:'none'}},
            rowsTemplate:(rows)=>{
                return (
                    <div className='custom-rows'>
                        {
                            rows.map((row,i)=>{
                                return (
                                    <Card key={row._id} row={row}/>
                                )
                            })
                        }
                    </div>
                )
            },
            onChange:(newRows)=>setRows(newRows),
            paging,
            onChangePaging:(paging)=>setPaging(paging),
            onSearch:true
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`
let [rows,setRows] = useState(model)
let [paging,setPaging] = useState<AI_table_paging>({
    size:10,
    number:1,
})
let [columns,setColumns] = useState<AI_table_column[]>([
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Gender',value:'row.gender',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
])              
return (
    <AIOInput
        attrs={{style:{height:600}}}
        type='table'
        value={rows}
        columns={columns}
        headerAttrs={{style:{display:'none'}}}
        rowsTemplate={(rows)=>{
            return (
                <div className='custom-rows'>
                    {
                        rows.map((row,i)=>{
                            return (
                                <Card key={row._id} row={row}/>
                            )
                        })
                    }
                </div>
            )
        }}
        onChange={(newRows)=>this.setState({rows:newRows})}
        paging={paging}
        onSearch={true}
    />          
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Card({row}){
    return (
        <RVD
            rootNode={{
                style:{width:'50%',maxWidth:160,minWidth:120,border:'1px solid #ddd',height:240,padding:12},
                column:[{html:row.name},{html:row.gender},{html:row.age,className:'align-vh fs-24 flex-1'}]
            }}
        />
    )
}
function RowAfter() {
    let [rows,setRows] = useState(model)
    let [columns,setColumns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Gender',value:'row.gender',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(){
        let p:AI = {
            attrs:{style:{height:600}},
            type:'table',
            value:rows,
            rowAfter:({row})=>{
                return <div style={{padding:'0 12px',background:'orange',color:'#fff'}}>this is my row after</div>
            },
            columns,
            onChange:(newRows)=>this.setState({rows:newRows})
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`

let [rows,setRows] = useState(model)
let [columns,setColumns] = useState<AI_table_column[]>([
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Gender',value:'row.gender',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
])              
return (
    <AIOInput
        attrs={{style:{height:600}}}
        type='table'
        value={rows}
        rowAfter={({row})=>{
            return <div style={{padding:'0 12px',background:'orange',color:'#fff'}}>this is my row after</div>
        }}
        columns={columns}
        onChange={(newRows)=>this.setState({rows:newRows})}
    />                
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function RowBefore() {
    let [rows,setRows] = useState(model);
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'}},
        {title:'Gender',value:'row.gender',input:{type:'text'}},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(){
        let p:AI = {
            attrs:{style:{height:600}},
            type:'table',
            value:rows,
            rowBefore:({row})=>{
                return <div style={{padding:'0 12px',background:'orange',color:'#fff',marginTop:12}}>this is my row before</div>
            },
            columns,
            onChange:(newRows)=>setRows(newRows)
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`

class Paging extends Component {
constructor(props){
    super(props);
    this.state = {
        rows:[],
        columns:[
            {title:'Name',value:'row.name',input:{type:'text'}},
            {title:'Gender',value:'row.gender',input:{type:'text'}},
            {title:'Age',value:'row.age',input:{type:'number'}},
        ]
    }
}
render() {
    let {rows,columns} = this.state;
    return (
        <AIOInput
            attrs={{style:{height:600}}}
            type='table'
            value={rows}
            rowBefore={({row})=>{
                return <div style={{padding:'0 12px',background:'orange',color:'#fff',marginTop:12}}>this is my row before</div>
            }}
            columns={columns}
            onChange={(newRows)=>this.setState({rows:newRows})}
        />                
    )
}
                    `)
            }
            <h3>rows</h3>
            {
                AIODoc().Code(JSON.stringify(rows,null,4))
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function Column_Sort() {
    let [rows,setRows] = useState((model))
    let [columns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'},sort:true},
        {title:'Gender',value:'row.gender',input:{type:'text'},sort:true},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(){
        let p:AI = {
            attrs:{style:{height:600}},
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows)
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            {renderTable()}                
            {
                AIODoc().Code(`

class Paging extends Component {
constructor(props){
    super(props);
    this.state = {
        rows:[],
        columns:[
            {title:'Name',value:'row.name',input:{type:'text'},sort:true},
            {title:'Gender',value:'row.gender',input:{type:'text'},sort:true},
            {title:'Age',value:'row.age',input:{type:'number'}},
        ]
    }
}
render() {
    let {rows,columns} = this.state;
    return (
        <AIOInput
            attrs={{style:{height:600}}}
            type='table'
            value={rows}
            columns={columns}
            onChange={(newRows)=>this.setState({rows:newRows})}
        />                
    )
}
}
                `)
            }
            <h3>rows</h3>
            {
                AIODoc().Code(JSON.stringify(rows,null,4))
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}
function OnChangeSort() {
    let [rows,setRows] = useState(model)
    let [columns,setColumns] = useState<AI_table_column[]>([
        {title:'Name',value:'row.name',input:{type:'text'},sort:true},
        {title:'Gender',value:'row.gender',input:{type:'text'},sort:true},
        {title:'Age',value:'row.age',input:{type:'number'}},
    ])
    function renderTable(){
        let p:AI = {
            attrs:{style:{height:600}},
            type:'table',
            value:rows,
            columns,
            onChange:(newRows)=>setRows(newRows),
            onChangeSort:async (sorts)=>{
                return false
            }
        }
        return <AIOInput {...p}/>
    }
    return (
        <div className='example'>
            <h5>
                for server side sorting and prevent auto client side sorting use onChangeSort props.
                onChangeSort props is a function that get list of sorts.
                this function can returns false to prevent change sort control of table if any error occured
            </h5>
            {renderTable()}                
            {
                AIODoc().Code(`

let [rows,setRows] = useState(model)
let [columns,setColumns] = useState<AI_table_column[]>([
    {title:'Name',value:'row.name',input:{type:'text'},sort:true},
    {title:'Gender',value:'row.gender',input:{type:'text'},sort:true},
    {title:'Age',value:'row.age',input:{type:'number'}},
])
return (
    <AIOInput
        attrs={{style:{height:600}}}
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        onChangeSort={(sorts)=>{
            debugger
        }}
    />               
)
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}