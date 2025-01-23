import { Component, createRef, FC, useRef, useState } from 'react';

import DOC from '../../resuse-components/doc.tsx';
import { Code } from './../../npm/aio-components';
import { AP_modal, AP_snackebar } from '../../npm/aio-popup/index.tsx';
import content from './content.js';
import { Icon } from '@mdi/react';
import { mdiAttachment, mdiContentSave, mdiStar } from '@mdi/js';
import $ from 'jquery';
import './index.css';
import usePopup from '../../npm/aio-popup/index.tsx';
//import './../../npm/aio-popup/alert1.css';
export default function DOC_AIOForm(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                nested: true,
                items: () => [
                    { text: 'addModal', id: 'addModal', render: () => <AddModal /> },
                    { text: 'modal position', id: 'modalposition', render: () => <ModalPosition /> },
                    { text: 'alert', id: 'alert', render: () => <Alert /> },
                    { text: 'snackebar', id: 'snackebar', render: () => <SnackebarExample /> },
                    //{ text: 'snackebar to body', id: 'snackebartobody', render: () => <SnackebarToBody /> },
                    { text: 'confirm', id: 'confirm', render: () => <Confirm /> },
                    { text: 'prompt', id: 'prompt', render: () => <Prompt /> },
                    { text: 'popover', id: 'popover', render: () => <Popover /> },
                    {
                        text: 'highlight', id: 'highlight',
                        items: [
                            { text: 'Basic Highlight', id: 'basichighlight', render: () => <BasicHighlight /> },
                            { text: 'mouseAccess', id: 'mouseAccess', render: () => <MouseAccess /> },
                            { text: 'Scroll Focus', id: 'testfocus', render: () => <TestFocus /> },
                        ]
                    },
                    { text: 'theme1', id: 'theme1', render: () => <Theme1 /> },
                ]
            }}
        />
    )
}
const Sample: FC<{ removeModal: any }> = ({ removeModal }) => {
    return (
        <div className="flex-row- p-12- align-v-" style={{ background: '#264065', color: '#fff' }}>
            <div className="align-v- flex-1- ofy-auto-" style={{ maxHeight: 400 }}>my sample text in modal</div>
            <div className="gap-6-">
                <button className='btn-123'>Approve</button>
                <button className='btn-123' onClick={removeModal}>Close</button>
            </div>
        </div>
    )
}
const Sample2:FC<{removeModal:any}> = ({removeModal})=>{
    return (
        <div className="flex-col- h-100-">
            <div className="flex-row- h-72- align-v- p-h-24- fs-18-" style={{ background: '#264065', color: '#fff' }}>My Titles</div>
            <div className="align-v- flex-1- ofy-auto- p-12-">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil reprehenderit ab temporibus consequuntur consectetur velit, at natus numquam a, impedit eos voluptatum iusto, minus ea molestias dicta deserunt! Sequi, maxime.
                Maxime numquam doloribus labore nostrum tempora aliquid, temporibus voluptatibus. Unde itaque eum atque laudantium ea, suscipit ad quae, eius rerum quas exercitationem doloribus placeat optio maxime non reiciendis deleniti aperiam.
                Quos cupiditate consectetur eaque, velit ipsam quibusdam est reprehenderit repellendus ea autem enim culpa eum temporibus et voluptate! Excepturi rem et temporibus ratione voluptates blanditiis eum repellat vel atque rerum.
                Provident, modi reprehenderit. Inventore asperiores quidem sunt officiis, repellat vel amet, reprehenderit numquam sequi quo quas temporibus. Nulla praesentium id quisquam at et? Alias quisquam repellat, blanditiis dicta doloribus quam.
                Est totam laboriosam ullam earum eligendi a aliquam asperiores impedit necessitatibus atque, optio quo dignissimos, corporis aut dolor accusantium sed reiciendis quas magnam nam, voluptates ratione et sequi? Voluptas, laboriosam?
                Aspernatur optio quisquam quis, sequi aliquid laboriosam id voluptatum ad doloremque saepe eum rem vitae nobis ea animi, molestias dolorem assumenda fugiat officia? Aliquam at dolore commodi. Doloribus, esse quae!
                Ut quam labore, nostrum dolorem nam sed, quo non, soluta iure at accusamus fuga quae! Magnam, rem ullam? Veniam nemo soluta modi reiciendis obcaecati praesentium! Cupiditate pariatur quo debitis delectus!
                Sunt obcaecati numquam laborum dolores error quis doloremque laboriosam. Officiis voluptatum corrupti tempore alias libero mollitia blanditiis deleniti. Atque suscipit aspernatur quidem porro quaerat nulla beatae dignissimos neque reprehenderit perferendis.
                Corrupti ex consequatur laboriosam magnam accusamus quidem voluptatum reiciendis, amet placeat incidunt natus atque quisquam inventore excepturi ipsa doloribus error odit saepe aut delectus consequuntur eligendi, deleniti officiis deserunt? Maxime?
                Incidunt impedit a aliquam itaque, voluptate ipsam assumenda ea labore voluptatum molestias fuga. Eius atque pariatur, ut minus at dolorem, praesentium temporibus placeat optio distinctio nobis nisi architecto fugiat quis.
            </div>
            <div className="flex-row- gap-24- h-60- align-vh-">
                <button className='btn-123' style={{ background: '#264065', color: '#fff' }}>Approve</button>
                <button className='btn-123' onClick={removeModal}>Close</button>
            </div>
        </div>
    )
}
const SampleCode = `
    <div className="flex-row- p-12- align-v-" style={{ background: '#264065', color: '#fff' }}>
        <div className="align-v- flex-1- ofy-auto-" style={{ maxHeight: 400 }}>my sample text in modal</div>
        <div className="gap-6-">
            <button className='btn-123'>Approve</button>
            <button className='btn-123' onClick={removeModal}>Close</button>
        </div>
    </div>
`
const AddModal: FC = () => {
    let popup = usePopup()
    function click(props: AP_modal) {
        popup.addModal(props)
    }
    return (
        <div className="example">
            <h3>Add Modal</h3>
            {Code(
                `popup.addModal({
    header:{title:'my modal'},
    body: () => <div style={{padding:12}}>{content}</div>
})`
            )}
            <button className='add-modal-button' onClick={() => click({
                header: { title: 'my modal' },
                body: () => <div style={{ padding: 12 }}>{content}</div>
            })}>OpenModal</button>

            <h3>Modal header</h3>
            {Code(
                `poppup.addModal({
    header: {
        title: 'my modal',
        subtitle: 'my modal subtitle',
        before: <Icon path={mdiStar} size={1} />,
        after:(
            <div className='modal-header-after'>
                <button className='align-vh-' onClick={() => alert()}><Icon path={mdiContentSave} size={1} /></button>
                <button className='align-vh-' onClick={() => alert()}><Icon path={mdiAttachment} size={1} /></button>
                <button className='align-vh-' onClick={() => alert()}>My Button</button> 
            </div>
        )
    },
    body: () => <div style={{padding:12}}>{content}</div>
})`
            )}
            <button className='add-modal-button' onClick={() => click({
                header: {
                    title: 'my modal',
                    subtitle: 'my modal subtitle',
                    before: <Icon path={mdiStar} size={1} />,
                    after: (
                        <div className='modal-header-after'>
                            <button className='align-vh-' onClick={() => alert()}><Icon path={mdiContentSave} size={1} /></button>
                            <button className='align-vh-' onClick={() => alert()}><Icon path={mdiAttachment} size={1} /></button>
                            <button className='align-vh-' onClick={() => alert()}>My Button</button>
                        </div>
                    )
                },
                body: () => <div style={{ padding: 12 }}>{content}</div>
            })}>OpenModal</button>

            <h3>Modal header (onClose:false)</h3>
            {Code(
                `instance.addModal({
    header: {
        title: 'my modal',
        onClose: false
    },
    body: () => <div style={{padding:12}}>{content}</div>
})`
            )}
            <button className='add-modal-button' onClick={() => click({
                header: {
                    title: 'my modal',
                    onClose: false
                },
                body: () => <div style={{ padding: 12 }}>{content}</div>
            })}>OpenModal</button>

            <h3>Modal header (onClose:custom function)</h3>
            {Code(
                `instance.addModal({
    header: {
        title: 'my modal',
        onClose: () => {
            alert('close popup');
            popup.removeModal()
        }
    },
    body: () => <div style={{padding:12}}>{content}</div>
})`
            )}
            <button className='add-modal-button' onClick={() => click({
                header: {
                    title: 'my modal',
                    onClose: () => {
                        alert('close popup');
                        popup.removeModal()
                    }
                },
                body: () => <div style={{ padding: 12 }}>{content}</div>
            })}>OpenModal</button>

            <h3>Modal header (function returns ReactNode)</h3>
            {Code(
                `instance.addModal({
    header: ({removeModal})=>{
        return (
            ${SampleCode}
        )
    },
    body: () => <div style={{ padding: 12 }}>{content}</div>
})`
            )}
            <button className='add-modal-button' onClick={() => click({
                header: ({ removeModal }) => {
                    return <Sample removeModal={removeModal} />
                },
                body: () => <div style={{ padding: 12 }}>{content}</div>
            })}>OpenModal</button>

            <h3>Modal prevent backdrop close</h3>
            {Code(
                `popup.addModal({
    position: 'top',
    body: ({ removeModal }) => (
        <div className="flex-row- p-12- align-v-" style={{background:'#264065',color:'#fff'}}>
            <div className="align-v- flex-1- ofy-auto-" style={{ maxHeight: 400 }}>my sample text in modal</div>
            <div className="gap-6-">
                <button className='btn-123'>Approve</button>
                <button className='btn-123' onClick={removeModal}>Close</button>
            </div>
        </div>
    ),
    setAttrs: (key) => {
        if (key === 'backdrop') {
            return {
                onClick: () => false
            }
        }
    }
})`
            )}
            <button className='add-modal-button' onClick={() => click({
                position: 'top',
                body: ({ removeModal }) => (
                    <div className="flex-row- p-12- align-v-" style={{ background: '#264065', color: '#fff' }}>
                        <div className="align-v- flex-1- ofy-auto-" style={{ maxHeight: 400 }}>my sample text in modal</div>
                        <div className="gap-6-">
                            <button className='btn-123'>Approve</button>
                            <button className='btn-123' onClick={removeModal}>Close</button>
                        </div>
                    </div>
                ),
                setAttrs: (key) => {
                    if (key === 'backdrop') {
                        return {
                            onClick: () => false
                        }
                    }
                }
            })}>OpenModal</button>
            <h3>open multiple modal</h3>
            {Code(
                `instance.addModal({
    position:'top',
    id:'one',
    body:({removeModal})=><MyComponent onClose={removeModal}/>
})
instance.addModal({
    position:'bottom',
    id:'two',
    body:({removeModal})=><MyComponent onClose={removeModal}/>
})`
            )}
            <button className='add-modal-button' onClick={() => {
                popup.addModal({
                    position: 'top',
                    id: 'one',
                    body: ({ removeModal }) => <Sample removeModal={removeModal} />
                })
                popup.addModal({
                    position: 'bottom',
                    id: 'two',
                    body: ({ removeModal }) => <Sample removeModal={removeModal} />
                })
            }}>OpenModal</button>
            <h3>Modal footer</h3>
            {Code(
                `popup.addModal({
    position: 'center',
    header: { title: 'my confirm title' },
    body: () => (
        <div style={{ padding: 12, width: 300 }}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque dolorem suscipit enim alias repudiandae dolores fugiat nobis ad tenetur! Iste ex numquam non optio impedit voluptatum cumque rerum deleniti id?
        </div>
    ),
    footer: ({ removeModal }) => {
        return (
            <>
                <button className='ex-button-1' onClick={() => { console.log('yes'); removeModal() }}>No</button>
                <button className='ex-button-2' onClick={() => { console.log('no'); removeModal() }}>Yes</button>
            </>
        )
    }
})`
            )}
            <button className='add-modal-button' onClick={() => click({
                position: 'center',
                header: { title: 'my confirm title' },
                body: () => (
                    <div style={{ padding: 12, width: 300 }}>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque dolorem suscipit enim alias repudiandae dolores fugiat nobis ad tenetur! Iste ex numquam non optio impedit voluptatum cumque rerum deleniti id?
                    </div>
                ),
                footer: ({ removeModal }) => {
                    return (
                        <>
                            <button className='ex-button-1' onClick={() => { console.log('yes'); removeModal() }}>No</button>
                            <button className='ex-button-2' onClick={() => { console.log('no'); removeModal() }}>Yes</button>
                        </>
                    )
                }
            })}>OpenModal</button>
            <h3>Modal state</h3>
            {Code(
                `popup.addModal({
    position: 'center',
    header: { title: 'my confirm title' },
    body: () => (
        <div style={{ padding: 12, width: 300 }}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque dolorem suscipit enim alias repudiandae dolores fugiat nobis ad tenetur! Iste ex numquam non optio impedit voluptatum cumque rerum deleniti id?
        </div>
    ),
    footer: ({ removeModal }) => {
        return (
            <>
                <button className='ex-button-1' onClick={() => { console.log('yes'); removeModal() }}>No</button>
                <button className='ex-button-2' onClick={() => { console.log('no'); removeModal() }}>Yes</button>
            </>
        )
    }
})`
            )}
            <button className='add-modal-button' onClick={() => click({
                position: 'center',
                header: { title: 'my prompt title' },
                state: { temp: '' },
                body: ({state,setState})=>{
                    return (
                        <textarea
                            value={state.temp} onChange={(e) => setState({ temp: e.target.value })}
                            style={{ resize: 'vertical', border: 'none', outline: 'none', background: 'rgba(0,0,0,0.05)', width: '100%' }}
                        />
                    )
                },
                footer: ({ removeModal,state }) => {
                    return (
                        <>
                            <button className='ex-button-1' onClick={() => { removeModal() }}>Cansel</button>
                            <button className='ex-button-2' onClick={() => { alert(state.temp); removeModal() }}>Submit</button>
                        </>
                    )
                }
            })}>OpenModal</button>
            {popup.render()}
        </div>
    )
}
function ModalPosition() {
    let popup = usePopup()
    function openModal(position: 'top' | 'bottom' | 'right' | 'left' | 'center' | 'fullscreen') {
        let p: AP_modal = {
            body: () => null,
            header: undefined,
            position
        }
        if (position === 'top' || position === 'bottom') {
            p.body = ({ removeModal }) => <Sample removeModal={removeModal}/>
        }
        else if (position === 'left' || position === 'right') {
            p.body = ({ removeModal }) => <Sample2 removeModal={removeModal}/>
            p.setAttrs = (key) => {
                if (key === 'modal') {
                    return { style: { width: 360 } }
                }
            }
        }
        else if (position === 'center') {
            p.body = () => content;
            p.setAttrs = (key) => {
                if (key === 'modal') {
                    return { style: { maxHeight: '90vh' } }
                }
            }
            p.header = { title: 'My Modal' }
        }
        else if (position === 'fullscreen') {
            p.body = () => content;
            p.header = { title: 'My Modal' }
        }
        popup.addModal(p)
    }
    function getCode(position: 'top' | 'bottom' | 'right' | 'left' | 'center' | 'fullscreen') {
        let body;
        if (position === 'top' || position === 'bottom') {
            body =
                `body:{
        render:({removeModal})=><MyComponent onClose={removeModal}/>
    }`
        }
        else if (position === 'left' || position === 'right') {
            body =
                `body:{
        render:({removeModal})=><MyComponent onClose={removeModal}/>
    }`
        }
        else if (position === 'center') {
            body = `
    title:'My Modal',
    body:{render:({removeModal})=><MyComponent onClose={removeModal}/>}
`
        }
        else if (position === 'fullscreen') {
            body = `
    title:'My Modal',
    body:{render:({removeModal})=><MyComponent onClose={removeModal}/>} 
`
        }
        return Code(`
instance.addModal({
    position:'${position}',
    ${body}
})
`)
    }
    function getItem(position: 'top' | 'bottom' | 'right' | 'left' | 'center' | 'fullscreen') {
        return (
            <>
                <h3>{`Modal position ${position}`}</h3>
                {getCode(position)}
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => openModal(position)}>Open Modal</button>
                <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            </>
        )
    }
    return (
        <div className='example'>
            {getItem('top')}
            {getItem('bottom')}
            {getItem('right')}
            {getItem('left')}
            {getItem('center')}
            {getItem('fullscreen')}
            {popup.render()}
        </div>
    )
}

function Alert() {
    let popup = usePopup()
    function addAlert(obj: any) {
        popup.addAlert({
            text: 'my alert text',
            time: 40,
            subtext: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum consectetur, enim cum similique aperiam maiores! Natus, sapiente vero molestiae ad tenetur amet eligendi exercitationem eveniet, repellat deserunt aut! Tenetur corporis officia, obcaecati excepturi architecto maxime asperiores assumenda sit maiores esse fugit',
            closeText: 'بستن',
            ...obj
        })
    }
    return (
        <div className='example'>
            <h3>addAlert</h3>
            {
                Code(`
instance.addAlert({
text:'my alert text',
subtext:'my subtext of my alert',
time:10,
type:'error',
closeText:'بستن'
})
                `)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addAlert({ type: 'error' })}>Open Alert</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>position:'top'</h3>
            {
                Code(`
instance.addAlert({
text:'my alert text',
subtext:'my subtext of my alert',
time:10,
type:'error',
closeText:'بستن',
position:'top'
})
                `)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addAlert({ type: 'error', position: 'top' })}>Open Alert</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>position:'bottom'</h3>
            {
                Code(`
instance.addAlert({
text:'my alert text',
subtext:'my subtext of my alert',
time:10,
type:'error',
closeText:'بستن',
position:'bottom'
})
                `)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addAlert({ type: 'error', position: 'bottom' })}>Open Alert</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>alert type error</h3>
            {
                Code(`
instance.addAlert({
text:'my alert text',
subtext:'my subtext of my alert',
time:10,
type:'warning',
closeText:'بستن'
})
                `)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addAlert({ type: 'error' })}>Open Alert</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>

            <h3>alert type warning</h3>
            {
                Code(`
instance.addAlert({
text:'my alert text',
subtext:'my subtext of my alert',
time:10,
type:'warning',
closeText:'بستن'
})
                `)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addAlert({ type: 'warning' })}>Open Alert</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>alert type success</h3>
            {
                Code(`
instance.addAlert({
text:'my alert text',
subtext:'my subtext of my alert',
time:10,
type:'success',
closeText:'بستن'
})
                `)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addAlert({ type: 'success' })}>Open Alert</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>alert type info</h3>
            {
                Code(`
instance.addAlert({
text:'my alert text',
subtext:'my subtext of my alert',
time:10,
type:'info',
closeText:'بستن'
})
                `)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addAlert({ type: 'info' })}>Open Alert</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            {popup.render()}
        </div>
    )
}
function Confirm() {
    let popup = usePopup()
    function addConfirm() {
        popup.addConfirm({
            text: 'Confirm text',
            title: 'My Title',
            onSubmit: async () => {
                alert('yes')
                return true
            },
            onCansel: async () => {
                alert('no')
                return true
            },
        })
    }
    return (
        <div className='example'>
            <h3>addAlert</h3>
            {
                Code(`
instance.addAlert({
text:'my alert text',
subtext:'my subtext of my alert',
time:10,
type:'error',
closeText:'بستن'
})
                `)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addConfirm()}>Open Confirm</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            {popup.render()}
        </div>
    )
}
function Prompt() {
    let popup = usePopup()
    function addPrompt() {
        popup.addPrompt({
            text: 'Confirm text',
            title: 'My Title',
            onSubmit: async () => {
                alert('yes')
                return true
            },
            onCansel: async () => {
                alert('no')
                return true
            },
        })
    }
    return (
        <div className='example'>
            <h3>addAlert</h3>
            {
                Code(`
instance.addAlert({
text:'my alert text',
subtext:'my subtext of my alert',
time:10,
type:'error',
closeText:'بستن'
})
                `)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addPrompt()}>Open Prompt</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            {popup.render()}
        </div>
    )
}
function SnackebarExample() {
    let popup = usePopup()
    let rtlPopup = usePopup({ rtl: true })
    function addSnackebar(obj?: { [key in keyof AP_snackebar]?: any }, rtl?: boolean) {
        let {
            text = 'my snackebar title',
            subtext = 'my subtext of my snackebar . please click on action',
            time = 10,
            type = 'error',
            align = ['right','top'],
            icon,
            attrs
        } = obj || {}
        if (rtl) {
            rtlPopup.addSnackebar({ text, subtext, time, type, align, icon, attrs })
        }
        else {
            popup.addSnackebar({ text, subtext, time, type, align, icon, attrs })
        }

    }
    return (
        <div className='example'>
            <h3>import</h3>
            {
                Code(`
import usePopup from 'aio-popup';
                `)
            }
            <h3>call hook</h3>
            {
                Code(`
const popup = usePopup()
                `)
            }
            <h3>snackebar type</h3>
            {
                Code(`
type I_config = {
    id?:string, //uniq id (optional)
    text:string, //main text
    subtext?:string, //subtext (optional)
    icon?:React.ReactNode,
    time?:number,
    action?:{text:string,onClick:()=>void},
    type:'success'|'error'|'warning'|'info',
    verticalAlign?:'start' | 'end',
    horizontalAlign?:'start' | 'center' | 'end',
    onClose?:false
    attrs?:any
}
                `)
            }
            <h3>show snackebar</h3>
            {
                Code(`
popup.addSnackebar(config:I_config)
                `)
            }
            <h3>Basic Example</h3>
            {
                Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const popup = usePopup()
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar.',
            type:'error'
        })
    }
    return (
        <>
            <button onClick={() => addSnackebar()}>Add Snackebar</button>
            {popup.render()}
        </>
    )
}


                `)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar()}>Add Snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>rtl</h3>
            {
                Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const [popup] = useState(new AIOPopup({rtl:true}))
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'error'
        })
    }
    return (
        <>
            <button onClick={() => addSnackebar()}>Add Snackebar</button>
            {popup.render()}
        </>
    )
}
                `)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar({}, true)}>Add Snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>time</h3>
            {
                Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const popup = usePopup()
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            time:3,
            type:'error'
        })
    }
    return (
        <>
            <button onClick={() => addSnackebar()}>Add Snackebar</button>
            {popup.render()}
        </>
    )
}
`)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar({ time: 3 })}>Add Snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>

            <h3>type info</h3>
            {
                Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const popup = usePopup()
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'info'
        })
    }
    return (
        <>
            <button onClick={() => addSnackebar()}>Add Snackebar</button>
            {popup.render()}
        </>
    )
}
`)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar({ type: 'info' })}>Add Snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>type error</h3>
            {
                Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const popup = usePopup()
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'error'
        })
    }
    return (
        <>
            <button onClick={() => addSnackebar()}>Add Snackebar</button>
            {popup.render()}
        </>
    )
}
`)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar({ type: 'error' })}>Add Snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>type warning</h3>
            {
                Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const popup = usePopup()
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'warning'
        })
    }
    return (
        <>
            <button onClick={() => addSnackebar()}>Add Snackebar</button>
            {popup.render()}
        </>
    )
}
`)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar({ type: 'warning' })}>Add Snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>type success</h3>
            {
                Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const popup = usePopup()
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'success'
        })
    }
    return (
        <>
            <button onClick={() => addSnackebar()}>Add Snackebar</button>
            {popup.render()}
        </>
    )
}
`)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar({ type: 'success' })}>Add Snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>

            <h3>verticalAlign</h3>
            {
                Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const popup = usePopup()
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'error'
            align: ['right','bottom']
        })
    }
    return (
        <>
            <button onClick={() => addSnackebar()}>Add Snackebar</button>
            {popup.render()}
        </>
    )
}
`)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar({ align: ['right','bottom'] })}>Add Snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>icon</h3>
            {
                Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const popup = usePopup()
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'success',
            align:['right','top'],
            icon:(
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#36CB8C"/>
                    <g clip-path="url(#clip0_1364_21722)">
                        <path d="M20.0007 10.834C14.9462 10.834 10.834 14.9462 10.834 20.0007C10.834 25.0552 14.9462 29.1673 20.0007 29.1673C25.0552 29.1673 29.1673 25.0552 29.1673 20.0007C29.1673 14.9462 25.0552 10.834 20.0007 10.834ZM23.9244 18.4244L19.3411 23.0078C19.2068 23.1421 19.0308 23.209 18.8548 23.209C18.6788 23.209 18.5028 23.1421 18.3685 23.0078L16.0769 20.7161C15.8083 20.4475 15.8083 20.0126 16.0769 19.744C16.3454 19.4754 16.7804 19.4754 17.049 19.744L18.8544 21.5494L22.9514 17.4523C23.22 17.1837 23.6549 17.1837 23.9235 17.4523C24.1921 17.7209 24.1926 18.1559 23.9244 18.4244Z" fill="white"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_1364_21722">
                        <rect width="22" height="22" fill="white" transform="translate(9 9)"/>
                    </clipPath>
                    </defs>
                </svg>
            )
        })
    }
    return (
        <>
            <button onClick={() => addSnackebar()}>Add Snackebar</button>
            {popup.render()}
        </>
    )
}
`)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar({
                align: ['right','top'], type: 'success',
                icon: (
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="20" fill="#36CB8C" />
                        <g clip-path="url(#clip0_1364_21722)">
                            <path d="M20.0007 10.834C14.9462 10.834 10.834 14.9462 10.834 20.0007C10.834 25.0552 14.9462 29.1673 20.0007 29.1673C25.0552 29.1673 29.1673 25.0552 29.1673 20.0007C29.1673 14.9462 25.0552 10.834 20.0007 10.834ZM23.9244 18.4244L19.3411 23.0078C19.2068 23.1421 19.0308 23.209 18.8548 23.209C18.6788 23.209 18.5028 23.1421 18.3685 23.0078L16.0769 20.7161C15.8083 20.4475 15.8083 20.0126 16.0769 19.744C16.3454 19.4754 16.7804 19.4754 17.049 19.744L18.8544 21.5494L22.9514 17.4523C23.22 17.1837 23.6549 17.1837 23.9235 17.4523C24.1921 17.7209 24.1926 18.1559 23.9244 18.4244Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1364_21722">
                                <rect width="22" height="22" fill="white" transform="translate(9 9)" />
                            </clipPath>
                        </defs>
                    </svg>
                )
            })}>Open snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>attrs</h3>
            {
                Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const popup = usePopup()
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'success'
            align: ['right','top'],
            icon:(
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#36CB8C"/>
                    <g clip-path="url(#clip0_1364_21722)">
                        <path d="M20.0007 10.834C14.9462 10.834 10.834 14.9462 10.834 20.0007C10.834 25.0552 14.9462 29.1673 20.0007 29.1673C25.0552 29.1673 29.1673 25.0552 29.1673 20.0007C29.1673 14.9462 25.0552 10.834 20.0007 10.834ZM23.9244 18.4244L19.3411 23.0078C19.2068 23.1421 19.0308 23.209 18.8548 23.209C18.6788 23.209 18.5028 23.1421 18.3685 23.0078L16.0769 20.7161C15.8083 20.4475 15.8083 20.0126 16.0769 19.744C16.3454 19.4754 16.7804 19.4754 17.049 19.744L18.8544 21.5494L22.9514 17.4523C23.22 17.1837 23.6549 17.1837 23.9235 17.4523C24.1921 17.7209 24.1926 18.1559 23.9244 18.4244Z" fill="white"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_1364_21722">
                        <rect width="22" height="22" fill="white" transform="translate(9 9)"/>
                    </clipPath>
                    </defs>
                </svg>
            ),
            attrs:{
                className:'my-snackebar'
            }
        })
    }
    return (
        <>
            <button onClick={() => addSnackebar()}>Add Snackebar</button>
            {popup.render()}
        </>
    )
}
`)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar({
                align: ['right','top'], type: 'success',
                icon: (
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="20" fill="#36CB8C" />
                        <g clip-path="url(#clip0_1364_21722)">
                            <path d="M20.0007 10.834C14.9462 10.834 10.834 14.9462 10.834 20.0007C10.834 25.0552 14.9462 29.1673 20.0007 29.1673C25.0552 29.1673 29.1673 25.0552 29.1673 20.0007C29.1673 14.9462 25.0552 10.834 20.0007 10.834ZM23.9244 18.4244L19.3411 23.0078C19.2068 23.1421 19.0308 23.209 18.8548 23.209C18.6788 23.209 18.5028 23.1421 18.3685 23.0078L16.0769 20.7161C15.8083 20.4475 15.8083 20.0126 16.0769 19.744C16.3454 19.4754 16.7804 19.4754 17.049 19.744L18.8544 21.5494L22.9514 17.4523C23.22 17.1837 23.6549 17.1837 23.9235 17.4523C24.1921 17.7209 24.1926 18.1559 23.9244 18.4244Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1364_21722">
                                <rect width="22" height="22" fill="white" transform="translate(9 9)" />
                            </clipPath>
                        </defs>
                    </svg>
                ),
                attrs: {
                    className: 'my-snackebar'
                }
            })}>Open snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>horizontalAlign</h3>
            {
                Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const popup = usePopup()
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'success'
            align: ['right','top'],
            icon:(
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#36CB8C"/>
                    <g clip-path="url(#clip0_1364_21722)">
                        <path d="M20.0007 10.834C14.9462 10.834 10.834 14.9462 10.834 20.0007C10.834 25.0552 14.9462 29.1673 20.0007 29.1673C25.0552 29.1673 29.1673 25.0552 29.1673 20.0007C29.1673 14.9462 25.0552 10.834 20.0007 10.834ZM23.9244 18.4244L19.3411 23.0078C19.2068 23.1421 19.0308 23.209 18.8548 23.209C18.6788 23.209 18.5028 23.1421 18.3685 23.0078L16.0769 20.7161C15.8083 20.4475 15.8083 20.0126 16.0769 19.744C16.3454 19.4754 16.7804 19.4754 17.049 19.744L18.8544 21.5494L22.9514 17.4523C23.22 17.1837 23.6549 17.1837 23.9235 17.4523C24.1921 17.7209 24.1926 18.1559 23.9244 18.4244Z" fill="white"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_1364_21722">
                        <rect width="22" height="22" fill="white" transform="translate(9 9)"/>
                    </clipPath>
                    </defs>
                </svg>
            ),
            attrs:{
                className:'my-snackebar'
            }
        })
    }
    return (
        <>
            <button onClick={() => addSnackebar()}>Add Snackebar</button>
            {popup.render()}
        </>
    )
}
`)
            }
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar({
                align: ['right','top'], type: 'success',
                icon: (
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="20" fill="#36CB8C" />
                        <g clip-path="url(#clip0_1364_21722)">
                            <path d="M20.0007 10.834C14.9462 10.834 10.834 14.9462 10.834 20.0007C10.834 25.0552 14.9462 29.1673 20.0007 29.1673C25.0552 29.1673 29.1673 25.0552 29.1673 20.0007C29.1673 14.9462 25.0552 10.834 20.0007 10.834ZM23.9244 18.4244L19.3411 23.0078C19.2068 23.1421 19.0308 23.209 18.8548 23.209C18.6788 23.209 18.5028 23.1421 18.3685 23.0078L16.0769 20.7161C15.8083 20.4475 15.8083 20.0126 16.0769 19.744C16.3454 19.4754 16.7804 19.4754 17.049 19.744L18.8544 21.5494L22.9514 17.4523C23.22 17.1837 23.6549 17.1837 23.9235 17.4523C24.1921 17.7209 24.1926 18.1559 23.9244 18.4244Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1364_21722">
                                <rect width="22" height="22" fill="white" transform="translate(9 9)" />
                            </clipPath>
                        </defs>
                    </svg>
                ),
                attrs: {
                    className: 'my-snackebar'
                }
            })}>Open snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>

            {popup.render()}
            {rtlPopup.render()}
        </div>
    )
}
function Popover() {
    let [temp] = useState({
        dom1: createRef(),
        dom2: createRef(),
        dom3: createRef(),
        dom4: createRef(),
        dom5: createRef()
    })
    let popup = usePopup()
    function v_layout(removeModal?: any) {
        return (
            <div className="flex-row-">
                <div className="align-v- flex-1- ofy-auto-" style={{ maxHeight: 400 }}>my sample text in modal</div>
                <div className="gap-6-">
                    <button className='btn-123'>Approve</button>
                    <button className='btn-123' onClick={removeModal}>Close</button>
                </div>
            </div>
        )
    }
    function addPopover() {
        popup.addModal({
            position: 'popover',
            getTarget: () => $(temp.dom1.current as any),
            body: ({ removeModal }) => v_layout(removeModal)
        })
    }
    function fitHorizontal() {
        popup.addModal({
            position: 'popover',
            getTarget: () => $(temp.dom3.current as any),
            fitHorizontal: true,
            body: () => v_layout()
        })
    }
    function styling() {
        popup.addModal({
            position: 'popover',
            getTarget: () => $(temp.dom4.current as any),
            body: () => content,
            setAttrs: (key) => {
                if (key === 'modal') {
                    return {
                        style: {
                            height: 360,
                            width: 400
                        }
                    }
                }
            }
        })
    }
    function without_backdrop() {
        popup.addModal({
            getTarget: () => $(temp.dom5.current as any),
            fitHorizontal: true,
            position: 'popover',
            body: () => content,
            setAttrs: (key) => {
                if (key === 'backdrop') {
                    return {
                        style: { pointerEvents: 'none' }
                    }
                }
                if (key === 'modal') {
                    return {
                        onClick: () => {
                            popup.removeModal()
                        },
                        style: {
                            height: 360
                        }
                    }
                }
            }
        })
    }
    return (
        <div className='example'>
            <h3>popover</h3>
            {
                Code(`
popupInstance.addModal({
    position: 'popover',
    getTarget: () => $(temp.dom1.current as any),
    body: ({ removeModal }) => v_layout(removeModal)
})
                `)
            }
            <button ref={temp.dom1 as any} style={{ height: 36, padding: '0 24px' }} onClick={() => addPopover()}>Open Popover</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>fitHorizontal</h3>
            {
                Code(`
popupInstance.addModal({
    position: 'popover',
    getTarget: () => $(temp.dom3.current as any),
    fitHorizontal: true,
    body: () => v_layout()
})
                `)
            }
            <button ref={temp.dom3 as any} style={{ height: 36, padding: '0 24px', width: '100%' }} onClick={() => fitHorizontal()}>Open Popover</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>styling popover</h3>
            {
                Code(`
popupInstance.addModal({
    position: 'popover',
    getTarget: () => $(temp.dom4.current as any),
    body: () => content ,
    setAttrs:(key)=>{
        if(key === 'modal'){
            return {
                style: {
                    height: 360,
                    width: 400
                }
            }
        }
    }
})
                `)
            }
            <button ref={temp.dom4 as any} style={{ height: 36, padding: '0 24px', width: '100%' }} onClick={() => styling()}>test long</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>popover without backdrop</h3>
            {
                Code(`
popupInstance.addModal({
    getTarget: () => $(temp.dom5.current as any),
    fitHorizontal: true,
    position: 'popover',
    body: () => content,
    setAttrs:(key)=>{
        if(key === 'backdrop'){
            return {
                style:{pointerEvents:'none'}
            }
        }
        if(key === 'modal'){
            return {
                onClick: () => {
                    popup.removeModal()
                },
                style: {
                    height: 360
                }
            }
        }
    }
})
                `)
            }
            <button ref={temp.dom5 as any} style={{ height: 36, padding: '0 24px', width: '100%' }} onClick={() => without_backdrop()}>test long</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            {popup.render()}
        </div>
    )
}
function BasicHighlight() {
    let popup = usePopup()
    function start(index: number) {
        let dom, html;
        if (index === 0) {
            dom = $('.rsa-navigation-item').eq(0);
            html = 'this tab show basic usage of aio-highlighter component'
        }
        else if (index === 1) {
            dom = $('.rsa-navigation-item').eq(1);
            html = 'this tab show usage of aio-highlighter mouseAccess Props';
        }
        else if (index === 2) {
            dom = $('.rsa-header-title');
            html = 'this is title of page';
        }
        else if (index === 3) {
            dom = $('#go-to-home');
            html = 'this button is for exit to home page';
        }
        else {
            popup.removeHighlight();
            return;
        }
        popup.addHighlight({ dom, html, onClick: () => start(index + 1) })
    }
    function showCode() {
        popup.addModal({
            id: 'code',
            header: { title: 'code' },
            body: () => {
                return Code(
                    `import AIOPopup from 'aio-popup';
function BasicHighlight() {
    let [popup] = useState<AIOPopup>(new AIOPopup())
    function start(index:number){
        let dom,html;
        if(index === 0){
            dom = $('.rsa-navigation-item').eq(0);
            html = 'this tab show basic usage of aio-highlighter component'
        }
        else if(index === 1){
            dom = $('.rsa-navigation-item').eq(1);
            html = 'this tab show usage of aio-highlighter mouseAccess Props';
        }
        else if(index === 2){
            dom = $('.rsa-header-title');
            html = 'this is title of page';
        }
        else if(index === 3){
            dom = $('#go-to-home');
            html = 'this button is for exit to home page';
        }
        else {
            popup.removeHighlight();
            return;
        }
        popup.addHighlight({dom,html,onClick:()=>start(index + 1)})
    }
    
    return (
        <div className='example'>
            <div style={{ padding: 12, display: 'flex', gap: 12 }}>
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => start(0)}>start</button>
            </div>
            {popup.render()}
        </div>
    )
}`
                )

            }
        })
    }
    return (
        <div className='example'>
            <div style={{ padding: 12, display: 'flex', gap: 12 }}>
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => start(0)}>start</button>
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => showCode()}>Code</button>
            </div>
            {popup.render()}
        </div>
    )
}
function MouseAccess() {
    let popup = usePopup()
    function start() {
        popup.addHighlight({
            dom: $('#button1'),
            html: 'click here to show code',
            mouseAccess: true
        })
    }
    function button1() {
        popup.addHighlight({
            dom: $('#button2'),
            html: (
                <div
                    style={{ background: 'dodgerblue', padding: 12, color: '#fff' }}
                >click here to show preview</div>
            ),
            mouseAccess: true
        })
    }
    function button2() {
        popup.removeHighlight()
    }
    function showCode() {
        popup.addModal({
            id: 'code',
            header: { title: 'code' },
            body: () => {
                return Code(
                    `import AIOPopup from 'aio-popup';
function MouseAccess() {
    let [popup] = useState<AIOPopup>(new AIOPopup())
    function start(){
        popup.addHighlight({
            dom:$('#button1'),
            html:'click here to show code',
            mouseAccess:true
        })
    }
    function button1(){
        popup.addHighlight({
            dom:$('#button2'),
            html:(
                <div 
                    style={{ background: 'dodgerblue', padding: 12, color: '#fff' }}
                >click here to show preview</div>
            ),
            mouseAccess:true
        })
    }
    function button2(){
        popup.removeHighlight()
    }
    
    return (
        <div className='example'>
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => start()}>start</button>
            <div style={{ display: 'flex', gap: 12, padding: 12 }}>
                <button type='button' id='button1' onClick={(e)=>button1()}>Button 1</button>
                <button type='button' id='button2' onClick={(e)=>button2()}>Button 2</button>
            </div>
            {popup.render()}
        </div>
    )
}`
                )
            }
        })
    }
    return (
        <div className='example'>
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => start()}>start</button>
            <div style={{ display: 'flex', gap: 12, padding: 12 }}>
                <button type='button' id='button1' onClick={(e) => button1()}>Button 1</button>
                <button type='button' id='button2' onClick={(e) => button2()}>Button 2</button>
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => showCode()}>Code</button>
            </div>
            {popup.render()}
        </div>
    )
}
function TestFocus() {
    let popup = usePopup()
    function start(index: number) {
        if (index === 0) {
            popup.addHighlight({
                dom: $('.my-test').eq(0),
                html: 'test0',
                onClick: () => start(1)
            })
        }
        else if (index === 1) {
            popup.addHighlight({
                dom: $('.my-test').eq(11),
                html: 'test11',
                onClick: () => popup.removeHighlight()
            })
        }

    }
    return (
        <div className='example'>
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => start(0)}>start</button>
            <div className='ofy-auto- w-100-'>
                {
                    new Array(12).fill(0).map((o, i) => {
                        return (
                            <div className='my-test' style={{ width: '100%', padding: 48, fontSize: 20 }}>{`this is my text ${i}`}</div>
                        )
                    })
                }
            </div>
            {popup.render()}
        </div>
    )
}
function Theme1() {
    let popup = usePopup()

    return (
        <div className='example'>
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => {
                popup.addModal({
                    position: 'center',
                    setAttrs: (key) => {
                        if (key === 'modal') {
                            return { className: 'aio-popup-theme1' }
                        }
                    },
                    header: {
                        title: 'Theme1',

                    },
                    body: () => {
                        return (
                            <div className='h-300- p-12-' style={{ width: 320 }}>
                                <div className="flex-row- gap-6-">
                                    <button className='active'>My Active Button</button>
                                    <button>My Button</button>
                                </div>
                                <p>
                                    this is my sample text
                                </p>
                            </div>
                        )
                    }
                })
            }}>Open Modal</button>
            {popup.render()}
        </div>
    )
}




// const SnackebarToBody: FC = () => {
//     const addRef = useRef<any>()
//     return (
//         <>
//             <div className="msf">
//                 <button onClick={() => addRef.current({ type: 'error', text: 'my text', subtext: 'my subtext' })}>Add Snackebar</button>
//             </div>
//             {ReactDOM.createPortal(<Snackebar
//                 getActions={({ add }) => addRef.current = add}
//                 rtl={false}
//             />, document.body)}

//         </>
//     )
// }