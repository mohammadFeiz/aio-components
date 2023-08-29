import React, { Component,createRef } from 'react';
import DOC from '../../resuse-components/doc';
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import RVD from '../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from '../../npm/aio-input/aio-input';
import './index.css';
import {Icon} from '@mdi/react';
import { mdiHumanMale,mdiHumanFemale} from '@mdi/js';
export default class DOC_AIOInput_Table extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='paging'
                navs={[
                    { text: 'type ,placeholder', id: 'type', COMPONENT: () => <TypePlaceholder /> },
                    { text: 'rows', id: 'rows', COMPONENT: () => <Rows /> },
                    { text: 'columns', id: 'columns', COMPONENT: () => <Columns /> },
                    { text: 'onSwap (true)', id: 'onSwapTrue', COMPONENT: () => <OnSwapTrue /> },
                    { text: 'onSwap (function)', id: 'onSwapFunction', COMPONENT: () => <OnSwapFunction /> },
                    { text: 'column.title', id: 'column.title', COMPONENT: () => <Column_Title /> },
                    { text: 'column.titleAttrs', id: 'column.titleAttrs', COMPONENT: () => <Column_TitleAttrs /> },
                    { text: 'column.value', id: 'column.value', COMPONENT: () => <Column_Value /> },
                    { text: 'column.size', id: 'column.size', COMPONENT: () => <Column_Size /> },
                    { text: 'column.minSize', id: 'column.minSize', COMPONENT: () => <Column_MinSize /> },
                    { text: 'column.justify', id: 'column.justify', COMPONENT: () => <Column_Justify /> },
                    { text: 'column.type', id: 'column.type', COMPONENT: () => <Column_Type /> },
                    { text: 'column.onChange', id: 'column.onChange', COMPONENT: () => <Column_OnChange /> },
                    { text: 'onChange', id: 'onChange', COMPONENT: () => <OnChange /> },
                    { text: 'excel', id: 'excel', COMPONENT: () => <Excel /> },
                    { text: 'column.cellAttrs', id: 'column.cellAttrs', COMPONENT: () => <Column_CellAttrs /> },
                    { text: 'column {subtext,before,after}', id: 'columnsubtextbeforeafter', COMPONENT: () => <Column_SubtextBeforeAfter /> },
                    { text: 'column.template', id: 'column.template', COMPONENT: () => <Column_Template /> },
                    { text: 'toolbar', id: 'toolbar', COMPONENT: () => <Toolbar /> },
                    { text: 'onAdd (function)', id: 'onAddobject', COMPONENT: () => <OnAddFunction /> },
                    { text: 'onAdd (object)', id: 'onAddfunction', COMPONENT: () => <OnAddObject /> },
                    { text: 'onRemove (function)', id: 'onRemoveFunction', COMPONENT: () => <OnRemoveFunction /> },
                    { text: 'onRemove (true)', id: 'onRemoveTrue', COMPONENT: () => <OnRemoveTrue /> },
                    { text: 'onSearch', id: 'onSearch', COMPONENT: () => <OnSearch /> },
                    { text: 'rowAttrs', id: 'rowAttrs', COMPONENT: () => <RowAttrs /> },
                    { text: 'headerAttrs', id: 'headerAttrs', COMPONENT: () => <HeaderAttrs /> },
                    { text: 'paging', id: 'paging', COMPONENT: () => <Paging /> },
                ]}
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
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Rows extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ]
        }
    }
    preview() {
        let {rows} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    rows={rows}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
return (
    <AIOInput
        type='table'
        rows={rows}
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
class Columns extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ],
            columns:[
                {title:'Name'},
                {title:'Family'},
                {title:'Age'},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    rows={rows}
                    columns={columns}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name'},
    {title:'Family'},
    {title:'Age'},
]
return (
    <AIOInput
        type='table'
        rows={rows}
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
                    rows={rows}
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
        rows={rows}
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
                    rows={rows}
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
        rows={rows}
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
                    rows={rows}
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
        rows={rows}
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
class Column_Size extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ],
            columns:[
                {title:'Name',value:'row.name',size:120},
                {title:'Family',value:'row.family',size:'family_column_size'},
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
                    rows={rows}
                    columns={columns}
                    getValue={{
                        family_column_size:({row,column})=>260
                    }}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',size:120},
    {title:'Family',value:'row.family',size:'family_column_size'},
    {title:'Age',value:'row.age'},
]
return (
    <AIOInput
        type='table'
        rows={rows}
        columns={columns}
        getValue={{
            family_column_size:({row,column})=>260
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
class Column_MinSize extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ],
            columns:[
                {title:'Name',value:'row.name',size:120},
                {title:'Family',value:'row.family',minSize:160},
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
                    rows={rows}
                    columns={columns}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',size:120},
    {title:'Family',value:'row.family',minSize:160},
    {title:'Age',value:'row.age'},
]
return (
    <AIOInput
        type='table'
        rows={rows}
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
                {title:'Name',value:'row.name',size:120},
                {title:'Family',value:'row.family',minSize:160},
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
                    rows={rows}
                    columns={columns}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',size:120},
    {title:'Family',value:'row.family',minSize:160},
    {title:'Age',value:'row.age',justify:true},
]
return (
    <AIOInput
        type='table'
        rows={rows}
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
            rows:[
                {name:'mohammad',family:'feiz',age:38},
                {name:'john',family:'doe',age:30},
            ],
            columns:[
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    rows={rows}
                    columns={columns}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
return (
    <AIOInput
        type='table'
        rows={rows}
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
class Column_OnChange extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',type:'text',onChange:({row,column,value})=>this.change(row,'name',value)},
                {title:'Family',value:'row.family',type:'text',onChange:({row,column,value})=>this.change(row,'family',value)},
                {title:'Age',value:'row.age',type:'number',onChange:({row,column,value})=>this.change(row,'age',value)},
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
                    rows={rows}
                    columns={columns}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',type:'text',onChange:({row,column,value})=>change(row,'name',value)},
    {title:'Family',value:'row.family',type:'text',onChange:({row,column,value})=>change(row,'family',value)},
    {title:'Age',value:'row.age',type:'number',onChange:({row,column,value})=>change(row,'age',value)},
]
function change(){
    let newRows = rows.map( (o) => o.id !== row.id ? o :{...o,[key]:value})
    setRows(newRows)
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
                {title:'Name',value:'row.name',type:'text',excel:'name'},
                {title:'Family',value:'row.family',type:'text',excel:'family'},
                {title:'Age',value:'row.age',type:'number',excel:'age'},
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text',excel:'name'},
    {title:'Family',value:'row.family',type:'text',excel:'family'},
    {title:'Age',value:'row.age',type:'number',excel:'age'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
                {title:'Name',value:'row.name',type:'text',cellAttrs:{style:{background:'pink'}}},
                {title:'Family',value:'row.family',type:'text',cellAttrs:'family_column_attrs'},
                {title:'Age',value:'row.age',type:'number',cellAttrs:({row,column})=>{
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text',cellAttrs:{style:{background:'pink'}}},
    {title:'Family',value:'row.family',type:'text',cellAttrs:'family_column_attrs'},
    {title:'Age',value:'row.age',type:'number',cellAttrs:({row,column})=>{
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
        rows={rows}
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
                {title:'Name',value:'row.name',type:'text',subtext:'name_column_subtext',before:'name_column_before',after:'name_column_after'}
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text',subtext:'name_column_subtext',before:'name_column_before',after:'name_column_after'}
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
class OnSearch extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
            ]
        }
    }
    preview() {
        let {rows,columns} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    rows={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    excel={true}
                    onSearch={(text)=>{
                        debugger
                    }}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
class Toolbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
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
                    rows={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    toolbar='Title Of My Table'
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
        toolbar='Title Of My Table'
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
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number',template:'age_template'},
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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
class RowAttrs extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
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
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
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
                    rows={rows}
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
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
        columns={columns}
        onChange={(newRows)=>setRows(newRows)}
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
class Paging extends Component {
    constructor(props){
        super(props);
        this.state = {
            rows:[
                {name:'mohammad',family:'feiz',age:38,id:0},
                {name:'john',family:'doe',age:30,id:1},
            ],
            columns:[
                {title:'Name',value:'row.name',type:'text'},
                {title:'Family',value:'row.family',type:'text'},
                {title:'Age',value:'row.age',type:'number'},
            ],
            paging:{
                number:1,
                size:20,
                sizes:[20,50,100],
                length:4,
                rtl:false
            }
        }
    }
    preview() {
        let {rows,columns,paging} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='table'
                    rows={rows}
                    columns={columns}
                    onChange={(newRows)=>this.setState({rows:newRows})}
                    paging={paging}
                    onChangePaging={(paging)=>this.setState({paging})}
                />                
                {
                    AIODoc().Code(`

let rows = [
    {name:'mohammad',family:'feiz',age:38},
    {name:'john',family:'doe',age:30},
]
let columns = [
    {title:'Name',value:'row.name',type:'text'},
    {title:'Family',value:'row.family',type:'text'},
    {title:'Age',value:'row.age',type:'number'},
]
function setRows(newRows){
    //update state
}
return (
    <AIOInput
        type='table'
        rows={rows}
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




