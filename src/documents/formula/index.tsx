import { FC, ReactNode, useState } from "react";
import './index.css';
import AIOInput, { AITabs, AIText } from "../../npm/aio-input";
import Icon from "@mdi/react";
import { mdiCog, mdiDotsVertical } from "@mdi/js";
type I_leftItem = {text:string}
type I_model = {
    name?:string,
    price?:string,
    code?:string
}
type I_tab = 'statements' | 'lists'
type I_row = {indent:number,parts:ReactNode[]}
const Formula:FC = ()=>{
    const [tab,setTab] = useState<I_tab>('statements')
    const [statements,setStatements] = useState<string[]>(getStatements)
    const [lists,setLists] = useState<string[]>(getLists)
    const [model,setModel] = useState<I_model>({})
    function getStatements(){
        return [
            'perferendis',
            'adipisicing',
            'laudantium',
            'voluptates',
            'necessitatibus',
            'consequuntur',
            'consectetur',
            'assumenda',
            'architecto',
            'voluptatibus'
        ]
    }
    function getLists(){
        return [
            'voluptatibus',
            'delectus',
            'deserunt',
            'praesentium',
            'deserunt',
            'laborum',
            'magni',
            'vero',
            'magnam',
            'molestiae',
            'minima',
            'eveniet'
        ]
    }
    function left_side_layout(){
        const items = tab === 'statements'?statements:lists;
        return (
            <div className="w-168 flex-col">
                <AITabs
                    value={tab}
                    onChange={(tab)=>setTab(tab)}
                    options={[
                        {text:'lists',value:'lists'},
                        {text:'statements',value:'statements'},
                    ]}
                />
                <div className="flex-col gap-3 brd-c-14 p-3 flex-1">
                    {items.map((o:string)=>left_side_item_layout(o))}
                </div>
            </div>
        )
    }
    function left_side_item_layout(item:string){
        return (
            <div className="msf p-6 brd-c-14 flex-row align-v">
                {item}
            </div>
        )
    }
    function changeModelByField(field:keyof I_model,value:string){
        setModel({...model,[field]:value})
    }
    function getInput(field:keyof I_model){
        const charLength = (model[field] || '').length
        const charSize = 7;
        const size = charLength * charSize + 16;
        return (
            <AIText
                value={model[field]} onChange={(v)=>changeModelByField(field,v)}
                className='h-24' style={{width:size,minWidth:36}}
            />
        )
    }
    function body_layout(){
        const lines:I_row[] = [
            {indent:0,parts:['import com.boxi.ruleEngine.dto.RuleFact;']},
            {indent:0,parts:['rule  "',getInput('name'),'"']},
            {indent:1,parts:['no-loop true']},
            {indent:1,parts:['lock-on-active true']},
            {indent:1,parts:['when']},
            {indent:2,parts:['ruleFact : RuleFact($c: company != null && company == "tapin", $w: w!=null , $w <=']},
            {indent:2,parts:['1.0 , $cdt: cdt!=null && cdt =="INNER" , $cct: cct!=null , $cct =="DOCUMENT" , $f : effectiveFormula ,$prices : prices);']},
            {indent:2,parts:['then']},
            {indent:1,parts:[getInput('code')]},
            {indent:3,parts:['$prices.put("tapin", 350000);']},
            {indent:3,parts:['ruleFact.setPrice(',getInput('price'),')']},
            {indent:3,parts:['ruleFact.setEffectiveFormula($f + ", $w <= 1.0 & cdt ==INNER & $cct == DOCUMENT then price= 350000");']},
            {indent:3,parts:['update(ruleFact);']},
            {indent:0,parts:['end;']}
        ]
        return (
            <div className="flex-col flex-1 p-12">
                {lines.map((o,i)=>row_layout(o,i))}
            </div>
        )
    }
    function row_layout(o:I_row,index:number){
        const indentSize = 16;
        const {indent,parts} = o;
        return (
            <div className="flex-row align-v brd-c-15" style={{paddingLeft:indentSize * indent}}>
                {cell_layout(parts)}
                {options_layout(index)}
            </div>
        )
    }
    function options_layout(index:number){
        return (
            <div className="flex-row align-vh">
                <Icon path={mdiDotsVertical} size={0.8}/>
            </div>
        )
    }
    function cell_layout(parts:ReactNode[]){
        return (
            <div className="flex-row flex-1">
                {parts.map((cell)=><div className="flex-row">{cell}</div>)}
            </div>
        )
    }
    return (
        <div className="fullscreen flex-row">
            {left_side_layout()}
            {body_layout()}
        </div>
    )
}
export default Formula