import React, { FC, createContext, useContext, useState } from "react"
import { mdiMinusThick, mdiPlusThick } from "@mdi/js"
import { Icon } from "@mdi/react"
import AIOInput from "../../npm/aio-input";
import Code from '../../npm/code';
import { Storage } from "../../npm/aio-utils";
import RVD from '../../npm/react-virtual-dom/index';
const textOptions = [
    { name: 'john', id: '1', gender: 'male', color: '#ff0000' },
    { name: 'stephan', id: '2', gender: 'male', color: '#ffa500' },
    { name: 'edvard', id: '3', gender: 'male', color: '#ffff00' },
    { name: 'luis', id: '4', gender: 'male', color: '#9acd32' },
    { name: 'carlos', id: '5', gender: 'male', color: '#90ee90' },
    { name: 'kate', id: '6', gender: 'female', color: '#008000' },
    { name: 'fernando', id: '7', gender: 'male', color: '#add8e6' },
    { name: 'mark', id: '8', gender: 'male', color: '#1e90ff' },
    { name: 'nicol', id: '9', gender: 'female', color: '#0000ff' },
    { name: 'lisa', id: '10', gender: 'female', color: '#a52a2a' },
    { name: 'lucas', id: '11', gender: 'male', color: '#000000' },
    { name: 'maria', id: '12', gender: 'female', color: '#ffc0cb' }
]
const numberOptions = [
    '4234534534', '3453463453', '345345345345', '345346456345', '345343647', '45645345', '423434646', '3456354567', '75645463', '534645457', '345345345'
]
const numberOptionsCode = `[
    '4234534534','3453463453','345345345345','345346456345','345343647','45645345','423434646','3456354567','75645463','534645457','345345345'
]`
const textOptionsCode = `[
    {name:'john',id:'1',gender:'male',color:'#ff0000'},
    {name:'stephan',id:'2',gender:'male',color:'#ffa500'},
    {name:'edvard',id:'3',gender:'male',color:'#ffff00'},
    {name:'luis',id:'4',gender:'male',color:'#9acd32'},
    {name:'carlos',id:'5',gender:'male',color:'#90ee90'},
    {name:'kate',id:'6',gender:'female',color:'#008000'},
    {name:'fernando',id:'7',gender:'male',color:'#add8e6'},
    {name:'mark',id:'8',gender:'male',color:'#1e90ff'},
    {name:'nicol',id:'9',gender:'female',color:'#0000ff'},
    {name:'lisa',id:'10',gender:'female',color:'#a52a2a'},
    {name:'lucas',id:'11',gender:'male',color:'#000000'},
    {name:'maria',id:'12',gender:'female',color:'#ffc0cb'}
]`
type I_setting = { show: number, showCode: boolean }
type I_CTX = { setting: I_setting, code: (code: string) => React.ReactNode }
const CTX = createContext({} as any);
const FormExamples: FC = () => {
    let [examples] = useState<any>([
        ['Example 1', () => <Example1 />],
        ['Example 2', () => <Example2 />],
        ['validations', () => <Validations />],
        ['showErrors', () => <ShowErrors />],
        ['test1', () => <Exampletest1 />],
        ['test2', () => <Exampletest2 />],
        ['test3', () => <Exampletest3 />],
        ['test4', () => <Exampletest4 />],
        ['test5', () => <Exampletest5 />],
    ])
    let [titles] = useState<string[]>(getTitles)
    function getTitles() {
        let res = ['all'];
        for (let i = 0; i < examples.length; i++) {
            let ex = examples[i];
            if (ex[2] !== false) { res.push(ex[0]) }
        }
        return res
    }
    let [setting, SetSetting] = useState<any>(new Storage(`formexamplessetting`).load('setting', {
        show: 'all', showCode: true
    }))
    function setSetting(setting: any) {
        new Storage(`formexamplessetting`).save('setting', setting)
        SetSetting(setting)
    }
    function changeShow(dir: 1 | -1) {
        let index = titles.indexOf(setting.show) + dir
        if (index < 0) { index = titles.length - 1 }
        if (index > titles.length - 1) { index = 0 }
        setSetting({ ...setting, show: titles[index] })
    }
    function setting_node() {
        let btnstyle = { background: 'none', border: 'none' }
        return {
            className: 'p-12',
            html: (
                <AIOInput
                    type='form'
                    value={{ ...setting }}
                    onChange={(newSetting) => setSetting({ ...newSetting })}
                    node={{
                        dir:'h',
                        childs: [
                            { flex: 1 },
                            {
                                input: {
                                    type: 'checkbox', text: 'Show Code'
                                },
                                field: 'value.showCode'
                            },
                            {
                                input: {
                                    type: 'select', options: titles, before: 'Show:',
                                    option: {
                                        text: 'option',
                                        value: 'option'
                                    },
                                    popover: {
                                        maxHeight: '100vh'
                                    }
                                },
                                field: 'value.show'
                            },
                            { className: 'align-vh', html: <button type='button' style={btnstyle} onClick={() => changeShow(-1)}><Icon path={mdiMinusThick} size={1} /></button> },
                            { className: 'align-vh', html: <button type='button' style={btnstyle} onClick={() => changeShow(1)}><Icon path={mdiPlusThick} size={1} /></button> }
                        ]
                    }}
                />
            )
        }
    }
    function code(code: string) {
        if (setting.showCode === false) { return null }
        return Code(code)
    }
    function render_node() {
        return {
            key: JSON.stringify(setting),
            className: 'ofy-auto flex-1 p-12',
            column: examples.map((o: any, i: number) => {
                let [title, COMP, cond, description] = o;
                if (cond === false) { return {} }
                if (setting.show !== 'all' && setting.show !== title) { return {} }
                return {
                    html: (
                        <div className='w-100' style={{ fontFamily: 'Arial' }}>
                            <h3>{`${i + 1} - ${title}`}</h3>
                            {description && <h5>{description}</h5>}
                            {COMP()}
                        </div>
                    )
                }
            })
        }
    }
    function getContext() {
        let context: I_CTX = { setting, code }
        return context;
    }
    return (
        <CTX.Provider value={getContext()}>
            <RVD rootNode={{ className: 'h-100', column: [setting_node(), render_node()] }} />
        </CTX.Provider>
    )
}
export default FormExamples

const Example1: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log, setLog] = useState<any>()
    function submit() {
        setLog(JSON.stringify(setting, null, 3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData) => setSetting({ ...newFormData })}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                node={{
                    dir:'v',
                    childs: [
                        {
                            flex: 1,
                            input: {
                                type: 'checkbox',
                                text: 'Is Active'
                            },
                            label: 'Is Active',
                            field: 'value.active'
                        },
                        {
                            flex: 1,
                            input: {
                                type: 'text'
                            },
                            label: 'First Name',
                            field: 'value.firstname'
                        },
                        {
                            input: {
                                type: 'textarea'
                            },
                            label: 'Description',
                            field: 'value.description'
                        },
                        {
                            input: {
                                type: 'date'
                            },
                            label: 'Date',
                            field: 'value.date'
                        }
                    ]
                }}
            />
            {
                !!log &&
                <pre>
                    <code>
                        {log}
                    </code>
                </pre>
            }
            {code(
`const Example1: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log,setLog] = useState<any>()
    function submit(){
        setLog(JSON.stringify(setting,null,3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData) => setSetting({ ...newFormData })}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                node={{
                    dir:'v',
                    childs: [
                        {
                            flex: 1,
                            input: {
                                type: 'checkbox',
                                text: 'Is Active'
                            },
                            label: 'Is Active',
                            field: 'value.active'
                        },
                        {
                            flex: 1,
                            input: {
                                type: 'text'
                            },
                            label: 'First Name',
                            field: 'value.firstname'
                        },
                        {
                            input: {
                                type: 'textarea'
                            },
                            label: 'Description',
                            field: 'value.description'
                        },
                        {
                            input: {
                                type: 'date'
                            },
                            label: 'Date',
                            field: 'value.date'
                        }
                    ]
                }}
            />
        </div>
    )
}
`
            )}

        </div>
    )
}
const Example2: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log, setLog] = useState<any>()
    function submit() {
        setLog(JSON.stringify(setting, null, 3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData) => setSetting({ ...newFormData })}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                node={{
                    dir:'v',
                    childs: [
                        {
                            dir:'h',
                            childs: [
                                {
                                    flex: 1,
                                    input: {
                                        type: 'checkbox',
                                        text: 'Is Active'
                                    },
                                    label: 'Is Active',
                                    field: 'value.active'
                                },
                                {
                                    flex: 1,
                                    input: {
                                        type: 'text'
                                    },
                                    label: 'First Name',
                                    field: 'value.firstname'
                                }
                            ]
                        },
                        {
                            dir:'v',
                            childs: [
                                {
                                    input: {
                                        type: 'textarea'
                                    },
                                    label: 'Description',
                                    field: 'value.description'
                                },
                                {
                                    input: {
                                        type: 'date'
                                    },
                                    label: 'Date',
                                    field: 'value.date'
                                }
                            ]
                        }
                    ]
                }}
            />
            {
                !!log &&
                <pre>
                    <code>
                        {log}
                    </code>
                </pre>
            }
            {code(
`const Example1: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log,setLog] = useState<any>()
    function submit(){
        setLog(JSON.stringify(setting,null,3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData) => setSetting({ ...newFormData })}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                inputs={{
                    dir:'v',
                    childs: [
                        {
                            dir:'h',
                            childs: [
                                {
                                    flex:1,
                                    input: {
                                        type: 'checkbox',
                                        text: 'Is Active'
                                    },
                                    label: 'Is Active',
                                    field: 'value.active'
                                },
                                {
                                    flex:1,
                                    input: {
                                        type: 'text'
                                    },
                                    label: 'First Name',
                                    field: 'value.firstname'
                                }
                            ]
                        },
                        {
                            dir:'v',
                            childs: [
                                {
                                    input: {
                                        type: 'textarea'
                                    },
                                    label: 'Description',
                                    field: 'value.description'
                                },
                                {
                                    input: {
                                        type: 'date'
                                    },
                                    label: 'Date',
                                    field: 'value.date'
                                }
                            ]
                        }
                    ]
                }}
            />
        </div>
    )
}
`
            )}

        </div>
    )
}
const Validations: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log, setLog] = useState<any>()
    function submit() {
        setLog(JSON.stringify(setting, null, 3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData,errors) => {
                    setSetting({ ...newFormData })
                }}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                node={{
                    dir:'v',
                    childs: [
                        {
                            flex: 1,
                            input: {
                                type: 'checkbox',
                                text: 'Is Active'
                            },
                            label: 'Is Active',
                            field: 'value.active'
                        },
                        {
                            flex: 1,
                            input: {
                                type: 'text'
                            },
                            label: 'First Name',
                            field: 'value.firstname',
                            validations:[
                                'required',
                            ]
                        },
                        {
                            input: {
                                type: 'textarea'
                            },
                            label: 'Description',
                            field: 'value.description',
                            validations:[
                                'required',
                                '>,10',
                                '<,30'
                            ]
                        },
                        {
                            input: {
                                type: 'date'
                            },
                            label: 'Date',
                            field: 'value.date',
                            validations:[
                                'required',
                                '<,2024',
                                '>,2022'
                            ]
                        }
                    ]
                }}
            />
            {
                !!log &&
                <pre>
                    <code>
                        {log}
                    </code>
                </pre>
            }
            {code(
`const Example1: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log,setLog] = useState<any>()
    function submit(){
        setLog(JSON.stringify(setting,null,3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData,errors) => {
                    setSetting({ ...newFormData })
                }}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                node={{
                    dir:'v',
                    childs: [
                        {
                            flex: 1,
                            input: {
                                type: 'checkbox',
                                text: 'Is Active'
                            },
                            label: 'Is Active',
                            field: 'value.active'
                        },
                        {
                            flex: 1,
                            input: {
                                type: 'text'
                            },
                            label: 'First Name',
                            field: 'value.firstname',
                            validations:[
                                'required',
                            ]
                        },
                        {
                            input: {
                                type: 'textarea'
                            },
                            label: 'Description',
                            field: 'value.description',
                            validations:[
                                'required',
                                '>,10',
                                '<,30'
                            ]
                        },
                        {
                            input: {
                                type: 'date'
                            },
                            label: 'Date',
                            field: 'value.date',
                            validations:[
                                'required',
                                '<,2024',
                                '>,2022'
                            ]
                        }
                    ]
                }}
            />
        </div>
    )
}
`
            )}

        </div>
    )
}
const ShowErrors: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log, setLog] = useState<any>()
    function submit() {
        setLog(JSON.stringify(setting, null, 3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData,errors) => {
                    setSetting({ ...newFormData })
                }}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                showErrors={'.my-form-errors'}
                node={{
                    dir:'v',
                    childs: [
                        {
                            flex: 1,
                            input: {
                                type: 'checkbox',
                                text: 'Is Active'
                            },
                            label: 'Is Active',
                            field: 'value.active'
                        },
                        {
                            flex: 1,
                            input: {
                                type: 'text'
                            },
                            label: 'First Name',
                            field: 'value.firstname',
                            validations:[
                                'required',
                            ]
                        },
                        {
                            input: {
                                type: 'textarea'
                            },
                            label: 'Description',
                            field: 'value.description',
                            validations:[
                                'required',
                                '>,10',
                                '<,30'
                            ]
                        },
                        {
                            input: {
                                type: 'date'
                            },
                            label: 'Date',
                            field: 'value.date',
                            validations:[
                                'required',
                                '<,2024',
                                '>,2022'
                            ]
                        },
                        {html:<div className='my-form-errors'></div>}
                    ]
                }}
            />
            {
                !!log &&
                <pre>
                    <code>
                        {log}
                    </code>
                </pre>
            }
            {code(
`const Example1: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log,setLog] = useState<any>()
    function submit(){
        setLog(JSON.stringify(setting,null,3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData,errors) => {
                    setSetting({ ...newFormData })
                }}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                showErrors={'.my-form-errors'}
                node={{
                    dir:'v',
                    childs: [
                        {
                            flex: 1,
                            input: {
                                type: 'checkbox',
                                text: 'Is Active'
                            },
                            label: 'Is Active',
                            field: 'value.active'
                        },
                        {
                            flex: 1,
                            input: {
                                type: 'text'
                            },
                            label: 'First Name',
                            field: 'value.firstname',
                            validations:[
                                'required',
                            ]
                        },
                        {
                            input: {
                                type: 'textarea'
                            },
                            label: 'Description',
                            field: 'value.description',
                            validations:[
                                'required',
                                '>,10',
                                '<,30'
                            ]
                        },
                        {
                            input: {
                                type: 'date'
                            },
                            label: 'Date',
                            field: 'value.date',
                            validations:[
                                'required',
                                '<,2024',
                                '>,2022'
                            ]
                        },
                        {html:<div className='my-form-errors'></div>}
                    ]
                }}
            />
        </div>
    )
}
`
            )}

        </div>
    )
}



const Exampletest1: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log, setLog] = useState<any>()
    function submit() {
        setLog(JSON.stringify(setting, null, 3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData) => setSetting({ ...newFormData })}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                node={{
                    dir:'v',
                    childs:[
                        {
                            input:{type:'text'},label:'Name',field:'value.name',flex:1
                        },
                        {
                            input:{type:'number'},label:'Age',field:'value.age',flex:1
                        },
                        {
                            input:{type:'text'},label:'Email',field:'value.email',flex:1
                        },
                        {
                            input:{type:'checkbox'},label:'IsActive?',field:'value.active',flex:1
                        },
                        {
                            input:{type:'date'},label:'Date?',field:'value.date',flex:1
                        },

                    ]
                }}
            />
            {
                !!log &&
                <pre>
                    <code>
                        {log}
                    </code>
                </pre>
            }
        </div>
    )
}
const Exampletest2: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log, setLog] = useState<any>()
    function submit() {
        setLog(JSON.stringify(setting, null, 3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData) => setSetting({ ...newFormData })}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                node={{
                    dir:'v',
                    childs:[
                        {
                            dir:'h',
                            childs:[
                                {
                                    input:{type:'text'},label:'Name',field:'value.name',flex:1
                                },
                                {
                                    input:{type:'number'},label:'Age',field:'value.age',flex:1
                                }
                            ]
                        },
                        {
                            dir:'h',
                            childs:[
                                {
                                    input:{type:'text'},label:'Email',field:'value.email',flex:1
                                },
                                {
                                    input:{type:'checkbox'},label:'IsActive?',field:'value.active',flex:1
                                },
                                {
                                    input:{type:'date'},label:'Date?',field:'value.date',flex:1
                                }
                            ]
                        }
                    ]
                }}
            />
            {
                !!log &&
                <pre>
                    <code>
                        {log}
                    </code>
                </pre>
            }
        </div>
    )
}
const Exampletest3: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log, setLog] = useState<any>()
    function submit() {
        setLog(JSON.stringify(setting, null, 3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData) => setSetting({ ...newFormData })}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                node={{
                    dir:'v',
                    childs:[
                        {
                            dir:'h',
                            childs:[
                                {
                                    input:{type:'text'},label:'Name',field:'value.name',flex:1
                                },
                                {
                                    input:{type:'number'},label:'Age',field:'value.age',flex:1
                                }
                            ]
                        },
                        {
                            dir:'h',
                            childs:[
                                {
                                    input:{type:'text'},label:'Email',field:'value.email',flex:1
                                },
                                {
                                    input:{type:'checkbox'},label:'IsActive?',field:'value.active',flex:1
                                }
                            ]
                        },
                        {
                            input:{type:'date'},label:'Date?',field:'value.date',flex:1
                        }
                    ]
                }}
            />
            {
                !!log &&
                <pre>
                    <code>
                        {log}
                    </code>
                </pre>
            }
        </div>
    )
}


const Exampletest4: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>()
    const [log, setLog] = useState<any>()
    function submit() {
        setLog(JSON.stringify(setting, null, 3))
    }
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData) => setSetting({ ...newFormData })}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                node={{
                    dir:'v',
                    childs:[
                        {
                            dir:'h',
                            childs:[
                                {
                                    input:{type:'text'},label:'Name',field:'value.name',flex:1
                                },
                                {
                                    input:{type:'number'},label:'Age',field:'value.age',flex:1
                                },
                                {
                                    input:{type:'text'},label:'Email',field:'value.email',flex:1
                                },
                            ]
                        },
                        {
                            input:{type:'checkbox'},label:'IsActive?',field:'value.active',flex:1
                        },
                        {
                            input:{type:'date'},label:'Date?',field:'value.date',flex:1
                        }
                    ]
                }}
            />
            {
                !!log &&
                <pre>
                    <code>
                        {log}
                    </code>
                </pre>
            }
        </div>
    )
}

const Exampletest5: FC = () => {
    const { code }: I_CTX = useContext(CTX);
    const [setting, setSetting] = useState<any>({})
    const [log, setLog] = useState<any>()
    function submit() {
        setLog(JSON.stringify(setting, null, 3))
    }
    function change(newSetting:any){
        //console.log(newSetting)
        setSetting({ ...newSetting })
    }
    console.log(setting)
    return (
        <div className='example'>
            <AIOInput
                type='form'
                value={{ ...setting }}
                onChange={(newFormData) => change(newFormData)}
                footer={(
                    <button type='button' className='submit-button' onClick={submit}>Submit</button>
                )}
                node={{
                    dir:'v',
                    childs:[
                        
                        {
                            input:{type:'slider',multiple:false,start:0,end:30},label:'Age',field:'value.age',flex:1
                        },
                        {
                            input:{type:'date'},label:'Date?',field:'value.date',flex:1
                        }
                        
                    ]
                }}
            />
            {
                !!log &&
                <pre>
                    <code>
                        {log}
                    </code>
                </pre>
            }
        </div>
    )
}

