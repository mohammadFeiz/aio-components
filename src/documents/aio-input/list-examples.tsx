import React, { FC, useEffect, useState } from "react"
import AIOInput,{ AI } from "../../npm/aio-input"
import AIODoc from '../../npm/aio-doc/aio-doc.tsx';
import RVD from './../../npm/react-virtual-dom/index.tsx';
import { mdiMinusThick, mdiPlusThick } from "@mdi/js"
import { Storage } from "../../npm/aio-utils/index.tsx";
import Icon from '@mdi/react';
const ListExamples:FC = ()=>{
    let [examples] = useState<any>([
        ['Basic',Basic],
    ])
    let [numbers] = useState<number[]>(new Array(examples.length).fill(0).map((o,i)=>i))
    let [setting,SetSetting] = useState<any>(new Storage(`treeexamplessetting`).load('setting',{
        show:0
    }))
    function setSetting(setting:any){
        new Storage('treeexamplessetting').save('setting',setting)
        SetSetting(setting)
    }
    function changeShow(dir: 1 | -1 ){
        let newShow:number = setting.show + dir;
        if(newShow < -1){newShow = examples.length - 1 }
        if(newShow > examples.length - 1){newShow = -1}
        setSetting({...setting,show:newShow})
    }
    function setting_node(){
        let btnstyle = {background:'none',border:'none'}
        return {
            className:'p-12',
            html:(
                <AIOInput
                    type='form'
                    value={{...setting}}
                    onChange={(newSetting)=>setSetting({...newSetting})}
                    node={{
                        dir:'h',
                        childs:[
                                {flex:1},
                            {
                                input:{
                                    type:'select',options:numbers,before:'Show:',
                                    option:{
                                        text:(option:any)=>option === -1?"all":examples[option][0],
                                        value:'option'
                                    },
                                    popover:{
                                        maxHeight:'100vh'
                                    }
                                },
                                field:'value.show'
                            },
                            {className:'align-vh',html:<button type='button' style={btnstyle} onClick={()=>changeShow(-1)}><Icon path={mdiMinusThick} size={1}/></button>},
                            {className:'align-vh',html:<button type='button' style={btnstyle} onClick={()=>changeShow(1)}><Icon path={mdiPlusThick} size={1}/></button>}
                        ]
                    }}
                />
            )
        }
    }
    function render_node(){
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
        return {
            key:JSON.stringify(setting),
            className:'ofy-auto flex-1 p-12',
            column:examples.map((o:any,i:number)=>{
                let [title,COMP,cond] = o;
                if(cond === false){return {}}
                if(setting.show !== -1 && setting.show !== i){return {}}
                return {
                    html:(
                        <div className='w-100'>
                            <h3>{`${i} - ${title}`}</h3>
                            <COMP rows={rows} rowsCode={rowsCode}/>
                        </div>
                    )
                }
            })
        }
    }
    return (<RVD rootNode={{className:'h-100',column:[setting_node(),render_node()]}}/>)   
}
export default ListExamples
function Basic() {
    let [model,setModel] = useState({size:36,decay:8,stop:3})
    let [value,setValue] = useState<number>(12)
    let [options] = useState(getOptions())
    function getOptions(){
        let options = [];
        for (let i = 0; i < 100; i++){
            options.push({text:`text example ${i}`,value:i})
        }
        return options;
    }
    function renderSetting(){
        let p:AI = {
            type:'form',
            value:{...model},
            labelAttrs:{style:{marginRight:12}},
            node:{
                className:'gap-3',
                dir:'h',
                childs:[
                    {flex:1,input:{type:'range',start:24,end:72,before:'size'},field:'value.size'},
                    {flex:1,input:{type:'range',start:0,end:40,before:'decay'},field:'value.decay'},
                    {flex:1,input:{type:'range',start:0,end:9,before:'stop'},field:'value.stop'}
                ]
            },
            onChange:(model:any)=>{
                setModel({...model})
            }
        }
        return <AIOInput {...p}/>
    }
    function renderList(){
        let p:AI = {
            attrs:{className:'my-list'},
            type:'list',
            value,
            options,
            size:model.size,
            decay:model.decay,
            stop:model.stop,
            onChange:(newValue:number)=>setValue(newValue)
        }
        return <AIOInput {...p}/>
    }
    console.log('1',model)
        
    return (
        <div className='example'>
            {renderSetting()}
            {renderList()}    
            <div style={{marginTop:24,fontSize:12}}>{`changed value is : ${value}`}</div>            
            {
                new AIODoc().Code(`
function App(){
let [value,setValue] = useState(12);
let [options] = useState(getOptions())
let value = 12;
function getOptions(){
    let options = [];
    for (let i = 0; i < 100; i++){
        options.push({text:\`text example ${'${i}'}\`,value:i})
    }
    return options
}
return (
    <>
        <AIOInput
            type='list'
            attrs={{className:'my-list'}}
            value={value}
            options={options}
            size={${model.size}}
            decay={${model.decay}}
            stop={${model.stop}}
            onChange={(newValue)=>setValue(newValue)}
        />
        <div style={{marginTop:24,fontSize:12}}>{\`changed value is : ${'${value}'}\`}</div>            
    </>
)
}
                `)
            }
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </div>
    )
}