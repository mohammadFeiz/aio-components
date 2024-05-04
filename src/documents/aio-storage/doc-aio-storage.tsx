import React,{Component, useState} from "react";
import {Storage} from '../../npm/aio-utils/index.tsx';
import RVD,{animate} from '../../npm/react-virtual-dom/index.tsx';
import AIOInput from '../../npm/aio-input/index.tsx';
import './index.css';
type I_item = {id:string,name:string,age:number|string};
export default function DOC_AIOStorage(props:any){
    let {goToHome} = props;
    let [storage] = useState<Storage>(new Storage('my storage'));
    let [list,setList] = useState<I_item[]>(storage.load('list',[]))
    let [name,setName] = useState<string>('')
    let [age,setAge] = useState<number|string>('')
    function item_layout(item:I_item){
        let {name,age,id} = item;
        return {
            style:{background:'lightblue',padding:12,borderRadius:6},
            attrs:{id,key:id},
            row:[
                {
                    column:[
                        {flex:1,html:`name:${name}`},
                        {flex:1,html:`age:${age}`},
                    ]
                },
                {flex:1},
                {size:48,html:'X',onClick:()=>remove(id),className:'align-vh'}
            ]
        }
    }
    function add(){
        let newItem:I_item = {name,age,id:'a' + Math.round(Math.random() * 1000000)}
        let newList:I_item[] = [newItem,...list];
        storage.save('list',newList);
        setList(newList)
    }
    function remove(id:string){
        animate('removeV','#' + id,()=>{
            let newList:I_item[] = list.filter((o)=>o.id !== id);
            storage.save('list',newList);
            setList(newList);
        })
    }
    function removeAll(){
        storage.remove('list')
        setList(storage.load('list',[]))
    }
    return (
        <RVD
            rootNode={{
                style:{width:'50%',marginLeft:'25%',border:'1px solid',padding:12},
                column:[
                    {html:'exit',className:'align-v',size:48,onClick:()=>goToHome()},
                    {html:'Add Member',className:'align-v',size:48},
                    {html:'name',className:'align-v'},               
                    {
                        row:[{html:<input type='text' value={name} onChange={(e)=>setName(e.target.value)}/>,className:'align-v'}]
                    },
                    {html:'age',className:'align-v'},               
                    {row:[{html:<input type='text' value={age} onChange={(e)=>setAge(e.target.value)}/>}]},
                    {size:12},
                    {html:<button onClick={()=>add()}>Add</button>},
                    {html:<button onClick={()=>removeAll()}>Remove All</button>},
                    {html:<button onClick={()=>storage.export()}>Export</button>},
                    {html:<AIOInput text='Import' type='file' onChange={(files)=>{
                        storage.import(files[0],()=>{
                            setList(storage.load('list',[]))
                            setName('');
                            setAge(undefined)
                        });
                    }}/>},
                    {size:12},
                    {html:'Members',className:'align-v',size:48},
                    {gap:{size:12},column:list.map((o)=>item_layout(o))}
                ]
            }}
        />
    )
}