import { createContext, FC, ReactNode, useState } from "react"
import { AI_type, AICheckbox, AIRadio, AISelect } from "../../npm/aio-input"
import { Code } from './../../npm/aio-component-utils';
import { Storage } from "../../npm/aio-utils"
import { mdiMinusThick, mdiPlusThick } from "@mdi/js"
import { Icon } from "@mdi/react"
export type I_setting = { show: string,reverse:boolean,vertical:boolean,round:number }
export type I_ExampleContext = { setting: I_setting, type: AI_type, code: (code: string) => React.ReactNode }
export const ExampleContext = createContext({} as any);

const Example: FC<{ type: AI_type, examples: [string, () => ReactNode, boolean?][] }> = (props) => {
    let { type } = props
    let [examples] = useState<[string, () => ReactNode, boolean?][]>(props.examples)
    let [setting, SetSetting] = useState<I_setting>(new Storage(`${type}examplessetting`).load('setting', {
        show: 'all'
    }))
    let [titles] = useState<string[]>(getTitles)
    function getTitles() {
        let res = [];
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
    function setSetting(value: any, field?: keyof I_setting) {
        let newSetting = { ...setting };
        if (field) { newSetting = { ...setting, [field]: value } }
        else { newSetting = { ...value } }
        new Storage('treeexamplessetting').save('setting', newSetting)
        SetSetting(newSetting)
    }
    function setting_node() {
        let btnstyle = { background: 'none', border: 'none' }
        return (
            <div className="p-12-">
                <div className="flex-row- align-v-">
                    {
                        type === 'spinner' &&
                        <AIRadio
                            options={[0.25, 0.75, 1]} className="w-fit-"
                            option={{ text: 'option', value: 'option' }}
                            value={setting.round}
                            onChange={(round) => setSetting({ ...setting, round })}
                        />
                    }
                    {
                        (type === 'slider' || type === 'spinner') &&
                        <AICheckbox
                            text='reverse'
                            value={setting.reverse}
                            onChange={(reverse) => setSetting({ ...setting, reverse })}
                        />
                    }
                    {
                        type === 'slider' &&
                        <AICheckbox
                            text='vertical'
                            value={setting.vertical}
                            onChange={(vertical) => setSetting({ ...setting, vertical })}
                        />
                    }
                    <AISelect
                        options={titles} option={{ text: 'option', value: 'option' }} popover={{fitHorizontal:true}}
                        value={setting.show} onChange={(show) => setSetting(show, 'show')} className="flex-1-"
                    />
                    <div className="flex-row- align-v-">
                        <button type='button' style={btnstyle} onClick={() => changeShow(-1)}><Icon path={mdiMinusThick} size={1} /></button>
                        <button type='button' style={btnstyle} onClick={() => changeShow(1)}><Icon path={mdiPlusThick} size={1} /></button>
                    </div>
                </div>
            </div>
        )
    }
    function render_node(): ReactNode {
        return (
            <div key={JSON.stringify(setting)} className="flex-col- ofy-auto- flex-1- p-12-">
                {
                    examples.map((o: any, i: number): ReactNode => {
                        let [title, COMP, cond, description] = o;
                        if (cond === false) { return null }
                        if (setting.show !== title) { return null }
                        return (
                            <div className='w-100-' style={{ fontFamily: 'Arial' }}>
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
        return Code(code)
    }
    function getContext(): I_ExampleContext { return { setting, type, code } }
    return (
        <ExampleContext.Provider value={getContext()}>
            <div className="flex-col- h-100-">{setting_node()} {render_node()}</div>
        </ExampleContext.Provider>
    )
}
export default Example