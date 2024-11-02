import { createContext, FC, ReactNode, useState } from "react"
import { AI_type, AICheckbox, AISelect } from "../../npm/aio-input"
import { Storage } from "../../npm/aio-utils"
import Code from "../../code"
import { mdiMinusThick, mdiPlusThick } from "@mdi/js"
import {Icon} from "@mdi/react"
export type I_setting = { show: string, showCode: boolean }
export type I_ExampleContext = { setting: I_setting, type: AI_type, code: (code: string) => React.ReactNode }
export const ExampleContext = createContext({} as any);

const Example:FC<{ type: AI_type,examples:[string,()=>ReactNode,boolean?][] }> = (props)=>{
    let {type} = props
    let [examples] = useState<[string,()=>ReactNode,boolean?][]>(props.examples)
    let [setting, SetSetting] = useState<I_setting>(new Storage(`${type}examplessetting`).load('setting', {
        show: 'all', showCode: true
    }))
    let [titles] = useState<string[]>(getTitles)
    function getTitles() {
        let res = ['all'];
        for (let i = 0; i < examples.length; i++) {
            let ex = examples[i];
            if (ex[2] !== false) { res.push(ex[0]) }
        }
        return res
    }
    function changeShow(dir: 1 | -1) {
        let index = titles.indexOf(setting.show) + dir
        if (index < 0) { index = titles.length - 1 }
        if (index > titles.length - 1) { index = 0 }
        setSetting({ ...setting, show: titles[index] })
    }
    function setSetting(value:any,field?:keyof I_setting){
        let newSetting = {...setting};
        if(field){newSetting = {...setting,[field]:value}}
        else{newSetting = {...value}}
        new Storage('treeexamplessetting').save('setting',newSetting)
        SetSetting(newSetting)
    }
    function setting_node() {
        let btnstyle = { background: 'none', border: 'none' }
        return (
            <div className="p-12">
                <div className="flex-row">
                    <div className="flex-1"></div>
                    <AICheckbox text='Show Code' value={!!setting.showCode} onChange={(showCode)=>setSetting(showCode,'showCode')}/>
                    <AISelect
                        options={titles} before='Show' option={{text: 'option',value: 'option'}}
                        value={setting.show} onChange={(show)=>setSetting(show,'show')} className="w-fit"
                    />
                    <div className="flex-row align-v">
                        <button type='button' style={btnstyle} onClick={()=>changeShow(-1)}><Icon path={mdiMinusThick} size={1}/></button>
                        <button type='button' style={btnstyle} onClick={()=>changeShow(1)}><Icon path={mdiPlusThick} size={1}/></button>
                    </div>
                </div>
            </div>
        )
    }
    function render_node():ReactNode {
        return (
            <div key={JSON.stringify(setting)} className="flex-col ofy-auto flex-1 p-12">
                {
                    examples.map((o: any, i: number):ReactNode => {
                        let [title, COMP, cond, description] = o;
                        if (cond === false) { return null }
                        if (setting.show !== 'all' && setting.show !== title) { return null }
                        return (
                            <div className='w-100' style={{ fontFamily: 'Arial' }}>
                                <h3>{`${i} - ${title}`}</h3>
                                {description && <h5>{description}</h5>}
                                {COMP()}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    function code(code: string) {
        if (setting.showCode === false) { return null }
        return Code(code)
    }
    function getContext():I_ExampleContext {return { setting, type, code }}
    return (
        <ExampleContext.Provider value={getContext()}>
            <div className="flex-col h-100">{setting_node()} {render_node()}</div>
        </ExampleContext.Provider>
    )
}
export default Example