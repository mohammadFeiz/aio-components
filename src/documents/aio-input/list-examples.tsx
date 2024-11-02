import { FC, useState } from "react"
import AIOInput,{ AI, AIList, AISlider } from "../../npm/aio-input"
import Code from '../../npm/code/index';
import RVD from './../../npm/react-virtual-dom/index.tsx';
import { mdiMinusThick, mdiPlusThick } from "@mdi/js"
import { Storage } from "../../npm/aio-utils/index.tsx";
import Icon from '@mdi/react';
import Example from "./example.tsx";
const ListExamples:FC = ()=>{
    let [examples] = useState<any>([
        ['Basic',Basic],
    ])
    return (<Example type={'list'} examples={examples}/>)
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
    function changeModel(key:string,value:any){
        setModel({...model,[key]:value})
    }
    function renderSetting(){
        return (
            <div className="flex-row gap-3">
                <AISlider className='flex-1' start={24} end={72} before='size' value={model.size} onChange={(size)=>changeModel('size',size)}/>
                <AISlider className='flex-1' start={0} end={40} before='decay' value={model.decay} onChange={(decay)=>changeModel('decay',decay)}/>
                <AISlider className='flex-1' start={0} end={9} before='stop' value={model.stop} onChange={(stop)=>changeModel('stop',stop)}/>
            </div>
        )
    }
    function renderList(){
        return (
            <AIList
                attrs={{className:'my-list'}}
                value={value}
                options={options}
                size={model.size}
                listOptions={{decay:model.decay,stop:model.stop}}
                onChange={(newValue:number)=>setValue(newValue)}
            />
        )
    }
    console.log('1',model)
        
    return (
        <div className='example'>
            {renderSetting()}
            {renderList()}    
            <div style={{marginTop:24,fontSize:12}}>{`changed value is : ${value}`}</div>            
            {
                Code(`
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