import React, { Component,createRef } from 'react';
import DOC from '../../../resuse-components/doc';
import AIODoc from '../../../npm/aio-documentation/aio-documentation';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from '../../../npm/aio-input/aio-input';
import './doc-aio-input-table.css';
import {Icon} from '@mdi/react';
import model from './model';
import { mdiHumanMale,mdiHumanFemale, mdiAbTesting, mdiFile} from '@mdi/js';
export default class DOC_AIOInput_Table extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='rowsTemplate'
                nav={{
                    items:[
                        { text: 'type ,placeholder', id: 'type', render: () => <TypePlaceholder /> },
                        { text: 'row,columns', id: 'rowscolumns', render: () => <RowsAndColumns /> },
                        { text: 'attrs', id: 'attrs', render: () => <Attrs /> },
                        { text: 'onSwap (true)', id: 'onSwapTrue', render: () => <OnSwapTrue /> },
                        { text: 'onSwap (function)', id: 'onSwapFunction', render: () => <OnSwapFunction /> },
                        { 
                            text: 'column properties', id: 'columnproperties',
                            items:[
                                { text: 'column.title', id: 'column.title', render: () => <Column_Title /> },
                                { text: 'column.titleAttrs', id: 'column.titleAttrs', render: () => <Column_TitleAttrs /> },
                                { text: 'column.value', id: 'column.value', render: () => <Column_Value /> },
                                { text: 'column.width', id: 'column.width', render: () => <Column_Width /> },
                                { text: 'column.minWidth', id: 'column.minWidth', render: () => <Column_MinWidth /> },
                                { text: 'column.justify', id: 'column.justify', render: () => <Column_Justify /> },
                                { text: 'column.type', id: 'column.type', render: () => <Column_Type /> },
                                { text: 'column.onChange', id: 'column.onChange', render: () => <Column_OnChange /> },
                                { text: 'column.sort', id: 'columnsort', render: () => <Column_Sort /> },
                                { text: 'column.cellAttrs', id: 'column.cellAttrs', render: () => <Column_CellAttrs /> },
                                { text: 'column {subtext,before,after}', id: 'columnsubtextbeforeafter', render: () => <Column_SubtextBeforeAfter /> },
                                { text: 'column.template', id: 'column.template', render: () => <Column_Template /> }
                            ]
                        },
                        { text: 'onChange', id: 'onChange', render: () => <OnChange /> },
                        { text: 'excel', id: 'excel', render: () => <Excel /> },
                        { text: 'toolbar', id: 'toolbar', render: () => <Toolbar /> },
                        { text: 'toolbarAttrs', id: 'toolbarAttrs', render: () => <ToolbarAttrs /> },
                        { text: 'rowGap columnGap', id: 'rowGapcolumnGap', render: () => <RowGapColumnGap /> },
                        { text: 'onAdd (function)', id: 'onAddobject', render: () => <OnAddFunction /> },
                        { text: 'onAdd (object)', id: 'onAddfunction', render: () => <OnAddObject /> },
                        { text: 'onRemove (function)', id: 'onRemoveFunction', render: () => <OnRemoveFunction /> },
                        { text: 'onRemove (true)', id: 'onRemoveTrue', render: () => <OnRemoveTrue /> },
                        { text: 'onSearch function', id: 'onSearchfunction', render: () => <OnSearchFunction /> },
                        { text: 'onSearch true', id: 'onSearchTrue', render: () => <OnSearchTrue /> },
                        { text: 'rowAttrs', id: 'rowAttrs', render: () => <RowAttrs /> },
                        { text: 'headerAttrs', id: 'headerAttrs', render: () => <HeaderAttrs /> },
                        { text: 'paging', id: 'paging', render: () => <Paging /> },
                        { text: 'paging serverSide:true', id: 'pagingserverside', render: () => <Paging_ServerSide /> },
                        { text: 'rowTemplate', id: 'rowTemplate', render: () => <RowTemplate /> },
                        { text: 'rowsTemplate', id: 'rowsTemplate', render: () => <RowsTemplate /> },
                        { text: 'rowAfter', id: 'rowAfter', render: () => <RowAfter /> },
                        { text: 'rowBefore', id: 'rowBefore', render: () => <RowBefore /> },
                        { text: 'onChangeSort', id: 'onChangeSort', render: () => <OnChangeSort /> },
                    ]
                }}
            />
        )
    }
}
class TypePlaceholder extends Component {
    preview() {
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    placeholder='موردی وجود ندارد'
                />                
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class RowsAndColumns extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ],
            columns:[
                {title:'Name',value:'row.name'},
                {title:'Family',value:'row.family'},
                {title:'Age',value:'row.age'},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                />                
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_Title extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ],
            columns:[
                {title:()=>'Name',value:'row.name'},
                {title:<div style={{width:24,height:24,borderRadius:'100%',background:'yellow'}}></div>,value:'row.family'},
                {title:'Age',value:'row.age'},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Attrs extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Gender',value:'row.gender',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_TitleAttrs extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ],
            columns:[
                {title:'Name',value:'row.name',titleAttrs:{style:{background:'yellow'}}},
                {title:'Family',value:'row.family'},
                {title:'Age',value:'row.age'},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',titleAttrs:{style:{background:'yellow'}}},
    {title:'Family',value:'row.family'},
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_Value extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ],
            columns:[
                {title:'Name',value:'abc'},
                {title:'Family',value:'row.family'},
                {title:'Age',value:'get_age'},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    getValue={{
                        get_age:({row,column})=>row.age
                    }}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_Width extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ],
            columns:[
                {title:'Name',value:'row.name',width:120},
                {title:'Family',value:'row.family',width:'family_column_width'},
                {title:'Age',value:'row.age'},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    getValue={{
                        family_column_width:({row,column})=>260
                    }}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_MinWidth extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ],
            columns:[
                {title:'Name',value:'row.name',width:120},
                {title:'Family',value:'row.family',minWidth:160},
                {title:'Age',value:'row.age'},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',width:120},
    {title:'Family',value:'row.family',minWidth:160},
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_Justify extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ],
            columns:[
                {title:'Name',value:'row.name'},
                {title:'Family',value:'row.family'},
                {title:'Age',value:'row.age',justify:true},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name'},
    {title:'Family',value:'row.family'},
    {title:'Age',value:'row.age',justify:true},
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_Type extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
            columns:[
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
                {title:'Date',value:'row.date',input:{type:'datepicker',unit:'month'}},
                {title:'Active',value:'row.active',input:{type:'checkbox'}},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    attrs={{style:{height:500}}}
                    value={rows}
                    columns={columns}
                    onChange={(rows)=>this.setState({rows})}
                />                
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
    {title:'Date',value:'row.date',input:{type:'datepicker',unit:'month'}},
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_OnChange extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text',onChange:({row,column,value})=>this.change(row,'name',value)}},
                {title:'Family',value:'row.family',input:{type:'text',onChange:({row,column,value})=>this.change(row,'family',value)}},
                {title:'Age',value:'row.age',input:{type:'number',onChange:({row,column,value})=>this.change(row,'age',value)}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                />                
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnChange extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnSwapTrue extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    onSwap={true}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        onSwap={true}
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnSwapFunction extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    onSwap={({newRows,from,to})=>{
                        this.setState({rows:newRows})
                    }}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        onSwap={({newRows,from,to})=>{
            this.setState({rows:newRows})
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Excel extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'},excel:'name'},
                {title:'Family',value:'row.family',input:{type:'text'},excel:'family'},
                {title:'Age',value:'row.age',input:{type:'number'},excel:'age'},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    excel={'please inter excel file name'}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'},excel:'name'},
    {title:'Family',value:'row.family',input:{type:'text'},excel:'family'},
    {title:'Age',value:'row.age',input:{type:'number'},excel:'age'},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_CellAttrs extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'},cellAttrs:{style:{background:'pink'}}},
                {title:'Family',value:'row.family',input:{type:'text'},cellAttrs:'family_column_attrs'},
                {title:'Age',value:'row.age',input:{type:'number'},cellAttrs:({row,column})=>{
                    if(row.age < 35){return {style:{background:'red',color:'#fff'}}}
                    return {style:{background:'green',color:'#fff'}}
                }},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    getValue={{
                        family_column_attrs:({row,column})=>{
                            return {style:{background:'lightblue'}}
                        }
                    }}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'},cellAttrs:{style:{background:'pink'}}},
    {title:'Family',value:'row.family',input:{type:'text'},cellAttrs:'family_column_attrs'},
    {title:'Age',value:'row.age',input:{type:'number'},cellAttrs:({row,column})=>{
        if(row.age < 35){return {style:{background:'red',color:'#fff'}}}
        return {style:{background:'green',color:'#fff'}}
    }},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_SubtextBeforeAfter extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad feiz',age:38,id:0,gender:'male'},
                {name:'john doe',age:30,id:1,gender:'female'},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text',subtext:'name_column_subtext',before:'name_column_before',after:'name_column_after'}}
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    getValue={{
                        name_column_subtext:({row,column})=>{
                            return `${row.age} years old`
                        },
                        name_column_before:({row,column})=>{
                            return <Icon path={row.gender === 'male'?mdiHumanMale:mdiHumanFemale} size={1}/>
                        },
                        name_column_after:({row,column})=>{
                            return (
                                <div style={{color:'#fff',background:'orange',borderRadius:6,padding:3}}>{row.age}</div>
                            )
                        }
                    }}
                    rowAttrs={(row)=>{
                        return {style:{height:48}}
                    }}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text',subtext:'name_column_subtext',before:'name_column_before',after:'name_column_after'}}
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        value={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        getValue={{
            name_column_subtext:({row,column})=>{
                return row.age + ' years old'
            },
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnAddFunction extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    onAdd={()=>{
                        this.setState({rows:[{name:'',family:'',age:0},...rows]})
                    }}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnAddObject extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    onAdd={{name:'',family:'',age:0}}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnRemoveFunction extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    onRemove={(row)=>{
                        this.setState({rows:rows.filter((o)=>o.id !== row.id)})
                    }}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnRemoveTrue extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    onRemove={true}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnSearchFunction extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Gender',value:'row.gender',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    excel={true}
                    onSearch={(text)=>{
                        debugger
                    }}
                />                
                {
                    AIODoc().Code(`

let rows = model;
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Gender',value:'row.gender',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnSearchTrue extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'},search:true},
                {title:'Gender',value:'row.gender',input:{type:'text'},search:true},
                {title:'Age',value:'row.age',input:{type:'number'},search:true},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    attrs={{style:{height:700}}}
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    onSearch={true}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'},search:true},
    {title:'Gender',value:'row.gender',input:{type:'text'},search:true},
    {title:'Age',value:'row.age',input:{type:'number'},search:true},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        attrs={{style:{height:700}}}
        value={rows}
        columns={columns}
        onChange={(newRows)=>this.setState({rows:newRows})}
        onSearch={true}
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Toolbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    toolbar={(
                        <>
                            <Icon path={mdiFile} size={0.7}/>                            
                            <div style={{width:6}}></div>
                            this is my title
                        </>
                    )}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class ToolbarAttrs extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
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
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class RowGapColumnGap extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    rowGap={6}
                    columnGap={6}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_Template extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'},template:'age_template'}
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    getValue={{
                        age_template:({row,column})=>{
                            return row.age + ' years old'
                        }
                    }}
                />                
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class RowAttrs extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Gender',value:'row.gender',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
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
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Gender',value:'row.gender',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class HeaderAttrs extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Family',value:'row.family',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    change(row,key,value){
        let {rows} = this.state;
        let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
        this.setState({rows:newRows})
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    headerAttrs={{
                        style:{background:'pink'}
                    }}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',input:{type:'text'}},
    {title:'Family',value:'row.family',input:{type:'text'}},
    {title:'Age',value:'row.age',input:{type:'number'}},
]
function setRows(newRows){
    //update state
}
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Paging extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
            columns:[
                {
                    title:'',size:42,justify:true,
                    template:({rowIndex})=>{
                        let {paging} = this.state;
                        let {size,number} = paging;
                        return rowIndex + 1 + (size * (number - 1))
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
                onChange:(paging)=>this.setState({paging})
            }
        }
    }
    preview() {
        let {rows,columns,paging} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    attrs={{style:{height:600}}}
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    paging={paging}
                    
                />                
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
                    template:({rowIndex})=>{
                        let {paging} = this.state;
                        let {size,number} = paging;
                        return rowIndex + 1 + (size * (number - 1))
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
                <h3>model</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Paging_ServerSide extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[],
            columns:[
                {
                    title:'',size:42,justify:true,
                    template:({rowIndex})=>{
                        let {paging} = this.state;
                        let {size,number} = paging;
                        return rowIndex + 1 + (size * (number - 1))
                    }
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
    preview() {
        let {rows,columns,paging} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    attrs={{style:{height:600}}}
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    paging={paging}
                />                
                {
                    AIODoc().Code(`

class Paging extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[],
            columns:[
                {
                    title:'',size:42,justify:true,
                    template:({rowIndex})=>{
                        let {paging} = this.state;
                        let {size,number} = paging;
                        return rowIndex + 1 + (size * (number - 1))
                    }
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
                <h3>rows</h3>
                {
                    AIODoc().Code(JSON.stringify(rows,null,4))
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class RowTemplate extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
        }
    }
    preview() {
        let {rows} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    attrs={{style:{height:600}}}
                    type='table'
                    value={rows}
                    rowTemplate={({row})=><div className='custom-row'>{row.name}</div>}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                />                
                {
                    AIODoc().Code(`

class Paging extends Component {
    ...
    render() {
        let {rows,columns,paging} = this.state;
        return (
            <AIOInput
                attrs={{style:{height:600}}}
                type='table'
                value={rows}
                rowTemplate={({row})=><div className='custom-row'>{row.name}</div>}
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class RowsTemplate extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
            paging:{
                size:10,
                number:1,
                onChange:(paging)=>this.setState({paging})
            },
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Gender',value:'row.gender',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    preview() {
        let {rows,columns,paging} = this.state;
        return (
            <div className='example'>
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
                {
                    AIODoc().Code(`

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[],
            columns:[
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
function Card({row}){
    return (
        <RVD
            layout={{
                style:{width:'50%',maxWidth:160,minWidth:120,border:'1px solid #ddd',height:240,padding:12},
                column:[
                    {html:row.name},
                    {html:row.gender},
                    {html:row.age,flex:1,align:'vh',className:'fs-24'},
                ]
            }}
        />
    )
}
class RowAfter extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Gender',value:'row.gender',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
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
                {
                    AIODoc().Code(`

class App extends Component {
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
                rowAfter={({row})=>{
                    return <div style={{padding:'0 12px',background:'orange',color:'#fff'}}>this is my row after</div>
                }}
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class RowBefore extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'}},
                {title:'Gender',value:'row.gender',input:{type:'text'}},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Column_Sort extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'},sort:true},
                {title:'Gender',value:'row.gender',input:{type:'text'},sort:true},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    attrs={{style:{height:600}}}
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                />                
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnChangeSort extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:model,
            columns:[
                {title:'Name',value:'row.name',input:{type:'text'},sort:true},
                {title:'Gender',value:'row.gender',input:{type:'text'},sort:true},
                {title:'Age',value:'row.age',input:{type:'number'}},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <h5>
                    for server side sorting and prevent auto client side sorting use onChangeSort props.
                    onChangeSort props is a function that get list of sorts.
                    this function can returns false to prevent change sort control of table if any error occured
                </h5>
                <AIOInput
                    attrs={{style:{height:600}}}
                    type='table'
                    value={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    onChangeSort={(sorts)=>{
                        debugger
                    }}
                />                
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
                onChangeSort={(sorts)=>{
                    debugger
                }}
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
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'preview',
            tabs: [
                { text: 'Preview', value: 'preview' },
                { text: 'Code', value: 'code' }
            ]
        }
    }
    body_layout() {
        let { tab } = this.state;
        return tab === 'preview' ? this.preview_layout() : this.code_layout()
    }
    preview_layout() {
        let { preview } = this.props;
        return {
            flex: 1,
            className: 'p-12',
            html: preview()
        }
    }
    code_layout() {
        let { code, rtl = false } = this.props;
        return {
            flex: 1,
            html: (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'auto' }}>
                    <pre style={{ padding: 12 }}>{AIODoc().Code(code())}</pre>
                </div>
            )
        }
    }
    toolbar_layout() {
        let { toolbar } = this.props;
        if (!toolbar) { return false }
        return {
            html: toolbar()
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    column: [
                        this.toolbar_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}




