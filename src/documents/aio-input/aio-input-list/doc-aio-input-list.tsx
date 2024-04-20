import React, { useState } from 'react';
import DOC from '../../../resuse-components/doc.tsx';
import AIODoc from '../../../npm/aio-documentation/aio-documentation.js';
import AIOInput from '../../../npm/aio-input/index.tsx';
import './doc-aio-input-list.css';
import { AI } from '../../../npm/aio-input/types.tsx';
export default function DOC_AIOInput_Table(props) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items:()=>[
                    { text: 'Basic', id: 'basic', render: () => <Basic /> }
                ]
            }}
        />
    )
}
function Basic() {
    let [model,setModel] = useState({size:36,width:120,decay:8,stop:3})
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
            inputs:{
                className:'gap-3',
                row:[
                    {input:{type:'slider',start:24,end:72,before:'size'},field:'value.size'},
                    {input:{type:'slider',start:80,end:400,before:'width'},field:'value.width'},
                    {input:{type:'slider',start:0,end:40,before:'decay'},field:'value.decay'},
                    {input:{type:'slider',start:0,end:9,before:'stop'},field:'value.stop'}
                ]
            },
            onChange:(model)=>{
                console.log('2',model)
                setModel(model)
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
            width:model.width,
            decay:model.decay,
            stop:model.stop,
            onChange:(newValue)=>setValue(newValue)
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
                AIODoc().Code(`
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
            width={${model.width}}
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