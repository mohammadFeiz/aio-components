import React, { Component, createRef, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import AIODoc from '../../npm/aio-documentation/aio-documentation.js';
import AIOPopup, { AP_modal, AP_snackebar } from '../../npm/aio-popup/index.tsx';
import content from './content.js';
import { Icon } from '@mdi/react';
import { mdiAttachment, mdiContentSave } from '@mdi/js';
import RVD from '../../npm/react-virtual-dom/index.tsx';
import $ from 'jquery';
import './index.css';
export default function DOC_AIOForm(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'aio-popup documentation', id: 'instance', render: () => <Instance /> },
                    { text: 'addModal', id: 'addModal', render: () => <AddModal /> },
                    { text: 'modal position', id: 'modalposition', render: () => <ModalPosition /> },
                    { text: 'alert', id: 'alert', render: () => <Alert /> },
                    { text: 'snackebar', id: 'snackebar', render: () => <Snackebar /> },
                    { text: 'popover', id: 'popover', render: () => <Popover /> },
                ]
            }}
        />
    )
}
class Instance extends Component {
    popup: any;
    constructor(props: any) {
        super(props);
        this.popup = new AIOPopup()
    }
    preview() {
        return (
            <div className='example'>
                <h3>create aio-popup instance</h3>
                {
                    AIODoc().Code(`
let instance = new AIOPopup()
                    `)
                }
                <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
                <h3>instance.render()</h3>
                <h5>use instance.render() for rendering aio-popup in render method of parent component</h5>

                {
                    AIODoc().Code(`
function MyCompoennt(){
    //some codes...
    return (
        <>
            {/*component content*/}
            {instance.render()}
        </>
    )
}
`)
                }
                <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
                <h3>instance.addModal()</h3>
                <h5>
                    user instance.addModal() to show modal in your page. you can add more than one modal and dont need to handle any state of that
                </h5>
                {
                    AIODoc().Code(`
instance.addModal({
    header:{
        attrs:{className:'my-modal-header'},
        title:'My Modal Title',
        subtitle:'My Modal Subtitle',
        onClose:undefined,
        buttons:[
            ['save',{onClick:()=>this.save(),className:'save-button'}]
        ]
    },
    body:{
        attrs:{className:'my-modal-body'},
        render:({close})=><MyForm onClose={close}/>
    }, 
    footer:{
        attrs:{className:'my-modal-footer'},
        buttons:[
            ['Save',{onClick:()=>this.save(),className:'save-button'}],
            ['Cansel',{onClick:()=>this.cansel(),className:'cansel-button'}]
        ],
    }
    backdrop:{
        attrs:{style:{background:'rgba(0,0,0,0.4)'}},
        close:true
    },
    id:'my-register-form',
    position:'fullscreen', 
    attrs:{
        className:'my-modal'
    },
    animate:true
})
`)
                }
                <h5>header</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>object</td>
                            <td>---</td>
                            <td>configure modal header</td>
                        </tr>
                    </tbody>
                </table>
                <h5>header properties</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Property</th><th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>attrs</td>
                            <td>object</td>
                            <td>---</td>
                            <td>set modal header attributes</td>
                        </tr>
                        <tr>
                            <td>title</td>
                            <td>string</td>
                            <td>---</td>
                            <td>title of modal</td>
                        </tr>
                        <tr>
                            <td>subtitle</td>
                            <td>string</td>
                            <td>---</td>
                            <td>subtitle of modal</td>
                        </tr>
                        <tr>
                            <td>onClose</td>
                            <td>undefined | false | function</td>
                            <td>undefined</td>
                            <td>
                                set false to prevent show close button in header.
                                set function to prevent close popup automatically and you can close it manually.
                                and if undefined, the close button will appear and it will automatically close the modal
                            </td>
                        </tr>
                        <tr>
                            <td>buttons</td>
                            <td>array</td>
                            <td>---</td>
                            <td>use custom buttons in modal header. each member of buttons is an array width 2 members,first is button text and second is button attributes object</td>
                        </tr>
                    </tbody>
                </table>
                <h5>body</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>object</td>
                            <td>---</td>
                            <td>configure modal body</td>
                        </tr>
                    </tbody>
                </table>
                <h5>body properties</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Property</th><th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>attrs</td>
                            <td>object</td>
                            <td>---</td>
                            <td>set modal body attributes</td>
                        </tr>
                        <tr>
                            <td>render</td>
                            <td>function</td>
                            <td>---</td>
                            <td>
                                returns jsx or html for render content of modal body and get some functions as parameter object like close to handle close modal manualy by call it
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h5>footer</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>object</td>
                            <td>---</td>
                            <td>configure modal footer</td>
                        </tr>
                    </tbody>
                </table>
                <h5>footer properties</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Property</th><th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr><td>attrs</td><td>object</td><td>---</td><td>set modal footer attributes</td></tr>
                        <tr>
                            <td>buttons</td><td>array</td><td>---</td>
                            <td>use custom buttons in modal footer. each member of buttons is an array width 2 members,first is button text and second is button attributes object</td>
                        </tr>
                    </tbody>
                </table>
                <h5>backdrop</h5>
                <table className='aio-component-table'>
                    <thead><th>Type</th><th>Default</th><th>Description</th></thead>
                    <tbody><tr><td>object</td><td>---</td><td>configure modal backdrop</td></tr></tbody>
                </table>
                <h5>backdrop properties</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Property</th><th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>attrs</td>
                            <td>object</td>
                            <td>---</td>
                            <td>set modal backdrop attributes</td>
                        </tr>
                        <tr>
                            <td>close</td>
                            <td>boolean</td>
                            <td>true</td>
                            <td>set true for handle close modal after click on backdrop</td>
                        </tr>
                    </tbody>
                </table>
                <h5>id</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>number or string</td>
                            <td>---</td>
                            <td>
                                use for handle prevent open a uniq popup more than one time.
                                if a popup with a specific id is open and you request to open a popup with the same id,
                                the popup will be closed first and then it will be opened again on the top of list of popups.
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h5>position</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>'fullscreen' | 'top' | 'right' | 'left' | 'bottom' | 'center' | 'popover'</td>
                            <td>fullscreen</td>
                            <td>set position of modal</td>
                        </tr>
                    </tbody>
                </table>
                <h5>popover (use in 'popover' position)</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>object</td>
                            <td>---</td>
                            <td>set modal as popover near of any html target</td>
                        </tr>
                    </tbody>
                </table>
                <h5>popover properties</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>property</th><th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>getTarget</td>
                            <td>function</td>
                            <td>---</td>
                            <td>a function that returns an html tag for render modal as popover near it</td>
                        </tr>
                        <tr>
                            <td>fixStyle</td>
                            <td>function</td>
                            <td>---</td>
                            <td>a function that get computed style of popover and returns fixed style of computed popover style</td>
                        </tr>
                        <tr>
                            <td>fitHorizontal</td>
                            <td>boolean</td>
                            <td>false</td>
                            <td>set true for set width of modal equal to width of target html</td>
                        </tr>
                    </tbody>
                </table>

                <h5>attrs</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>object</td>
                            <td>---</td>
                            <td>set custom attributes on modal</td>
                        </tr>
                    </tbody>
                </table>
                <h5>animate</h5>
                <table className='aio-component-table'>
                    <thead>
                        <th>Type</th><th>Default</th><th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>boolean</td>
                            <td>true</td>
                            <td>if true, The opening of the popup will be accompanied by animation</td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
                <h3>instance.addAlert()</h3>
                <h5>
                    user instance.addAlert() to show alert box in your page. you can add more than one alert and dont need to handle any state of that
                </h5>
                {
                    AIODoc().Code(`
instance.addAlert(props)
`)
                }
                <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
                <h3>instance.addSnackebar()</h3>
                <h5>
                    user instance.addSnackebar() to show snackebar box in your page. you can add more than one snackebar and dont need to handle any state of that
                </h5>
                {
                    AIODoc().Code(`
instance.addSnackebar(props)
`)
                }
                <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
                {this.popup.render()}
            </div>
        )
    }
    render() { return this.preview() }
}
function AddModal() {
    let [popup] = useState(new AIOPopup())
    function example(p: { title: string, code: string, props: AP_modal | (AP_modal[]) }) {
        let { title, code, props } = p;
        return (
            <>
                <h3>{title}</h3>
                {AIODoc().Code(code)}
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => {
                    if (!Array.isArray(props)) { props = [props] }
                    for (let i = 0; i < props.length; i++) {
                        popup.addModal(props[i])
                    }
                }}>Open Modal</button>
                <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            </>
        )
    }
    return (
        <div className='example'>
            {
                example({
                    title: 'Basic Modal',
                    code:
                        `instance.addModal({
    header:{title:'my modal'},
    body:()=>content,
    setAttrs:(key)=>{
        if(key === 'body'){
            return {
                style:{padding:12}
            }
        }
    }
})`,
                    props: { 
                        header: { title: 'my modal' }, body: () => content,
                        setAttrs:(key)=>{if(key === 'body'){return {style:{padding:12}}}} 
                    }
                })
            }
            {
                example({
                    title: 'Modal header',
                    code:
`instance.addModal({
    header: {
        title: 'my modal',
        subtitle: 'my modal subtitle',
        after:(
            <div className='modal-header-after'>
                <button onClick={() => alert()}><Icon path={mdiContentSave} size={1} /></button>
                <button onClick={() => alert()}><Icon path={mdiAttachment} size={1} /></button>
                <button onClick={() => alert()}>My Button</button> 
            </div>
        )
    },
    body: () => content
})`
                    ,
                    props: {
                        header: {
                            title: 'my modal',
                            subtitle: 'my modal subtitle',
                            after:(
                                <div className='modal-header-after'>
                                    <button onClick={() => alert()}><Icon path={mdiContentSave} size={1} /></button>
                                    <button onClick={() => alert()}><Icon path={mdiAttachment} size={1} /></button>
                                    <button onClick={() => alert()}>My Button</button> 
                                </div>
                            )
                        },
                        body: () => content
                    }
                })
            }
            {
                example({
                    title: 'Modal header (onClose:false)',
                    code:
`instance.addModal({
    header: {
        title: 'my modal',
        onClose: false
    },
    body: ()=>content
})`
                    ,
                    props: {
                        header: {
                            title: 'my modal',
                            onClose: false
                        },
                        body: ()=>content
                    }
                })
            }
            {
                example({
                    title: 'Modal header (onClose:custom function)',
                    code:
`instance.addModal({
    header: {
        title: 'my modal',
        onClose: () => {
            alert('close popup');
            popup.removeModal()
        }
    },
    body: () => content
})`
                    ,
                    props: {
                        header: {
                            title: 'my modal',
                            onClose: () => {
                                alert('close popup');
                                popup.removeModal()
                            }
                        },
                        body: () => content
                    }
                })
            }
            {
                example({
                    title: 'Modal prevent backdrop close',
                    code:
`instance.addModal({
    position: 'top',
    body: ({ close }) => (
        <RVD
            rootNode={{
                row: [
                    { style: { maxHeight: 400 }, html: 'my sample text in modal', className: 'align-v flex-1 ofy-auto' },
                    {
                        gap: { size: 6 },
                        column: [{ html: (<button className='btn-123'>Approve</button>) }, { html: (<button className='btn-123' onClick={close}>Close</button>) }]
                    }
                ]
            }}
        />
    ),
    setAttrs:(key)=>{
        if(key === 'backdrop'){
            return {
                onClick:()=>false
            }
        }
    }
})`
                    ,
                    props: {
                        position: 'top',
                        body: ({ close }) => (
                            <RVD
                                rootNode={{
                                    row: [
                                        { style: { maxHeight: 400 }, html: 'my sample text in modal', className: 'align-v flex-1 ofy-auto' },
                                        {
                                            gap: { size: 6 },
                                            column: [{ html: (<button className='btn-123'>Approve</button>) }, { html: (<button className='btn-123' onClick={close}>Close</button>) }]
                                        }
                                    ]
                                }}
                            />
                        ),
                        setAttrs:(key)=>{
                            if(key === 'backdrop'){
                                return {
                                    onClick:()=>false
                                }
                            }
                        }
                    }
                })
            }
            {
                example({
                    title: 'open many modal',
                    code:
`instance.addModal({
    position:'top',
    id:'one',
    body:({close})=><MyComponent onClose={close}/>
})
instance.addModal({
    position:'bottom',
    id:'two',
    body:({close})=><MyComponent onClose={close}/>
})`
                    ,
                    props: [
                        { position: 'top', id: 'one', body: ({ close }) => <Popup1 close={close} />  },
                        { position: 'bottom', id: 'two', body: ({ close }) => <Popup1 />  }
                    ]
                })
            }
            {
                example({
                    title: 'use as confirm',
                    code:
`instance.addModal({
    position: 'center',
    header: { title: 'my confirm title' },
    body: () => (
        <div style={{ padding: 12, width: 300 }}>
            my confirm text my confirm text my confirm text my confirm text my confirm text my confirm text my confirm text my confirm text
        </div>
    ),
    footer: ({ close }) => {
        return (
            <>
                <button className='ex-button-1' onClick={() => { console.log('yes'); close() }}>No</button>
                <button className='ex-button-2' onClick={() => { console.log('no'); close() }}>Yes</button>
            </>
        )
    }
})`
                    ,
                    props: {
                        position: 'center',
                        header: { title: 'my confirm title' },
                        body: () => (
                            <div style={{ padding: 12, width: 300 }}>
                                my confirm text my confirm text my confirm text my confirm text my confirm text my confirm text my confirm text my confirm text
                            </div>
                        ),
                        footer: ({ close }) => {
                            return (
                                <>
                                    <button className='ex-button-1' onClick={() => { console.log('yes'); close() }}>No</button>
                                    <button className='ex-button-2' onClick={() => { console.log('no'); close() }}>Yes</button>
                                </>
                            )
                        }
                    }
                })
            }
            {
                example({
                    title: 'use as prompt',
                    code:
                        `instance.addModal({
    position:'center',
    header:{title:'my prompt title'},
    state:{temp:''},
    body:{
        render:({state,setState})=>{
            return (
                <textarea
                    value={state.temp} onChange={(e)=>setState({temp:e.target.value})}
                    style={{resize:'vertical',border:'none',outline:'none',background:'rgba(0,0,0,0.05)',width:'100%'}}
                />
            )
        }},
    footer:{
        buttons:[
            [
                'yes',
                {
                    onClick:({close,state})=>{
                        console.log(state.temp); 
                        close();
                    }
                }
            ],
            [
                'no',
                {
                    onClick:({close})=>{
                        close()
                    },
                    style:{background:'#999'}
                }
            ]
        ]
    },
})`
                    ,
                    props: {
                        position: 'center',
                        header: { title: 'my prompt title' },
                        state: { temp: '' },
                        body: ({ state, setState }: any) => {
                            return (
                                <textarea
                                    value={state.temp} onChange={(e) => setState({ ...state, temp: e.target.value })}
                                    style={{ resize: 'vertical', border: 'none', outline: 'none', background: 'rgba(0,0,0,0.05)', width: '100%' }}
                                />
                            )
                        },
                        footer:({close,state})=>{
                            return (
                                <>
                                    <button className='ex-button-1' onClick={()=>{close()}}>No</button>
                                    <button className='ex-button-2' onClick={()=>{console.log(state.temp); close()}}>Yes</button>
                                </>
                            )
                        }
                    }
                })
            }
            {popup.render()}
        </div>
    )
}
function Popup1(props: any) {
    let { close } = props || {};
    return (
        <RVD
            rootNode={{
                row: [
                    {
                        style: { maxHeight: 400, overflowY: 'auto' },
                        html: 'my sample text in modal',
                        className: 'align-v flex-1'
                    },
                    {
                        gap: { size: 6 },
                        column: [
                            { html: (<button className='btn-123'>Approve</button>) },
                            { html: (<button className='btn-123' onClick={close}>Close</button>) }
                        ]
                    }
                ]
            }}
        />
    )
}
function ModalPosition() {
    let [popup] = useState(new AIOPopup())
    function v_layout(close:()=>void) {
        return (
            <RVD
                rootNode={{
                    row: [
                        { style: { maxHeight: 400, overflowY: 'auto' }, html: 'my sample text in modal', className: 'align-v flex-1' },
                        { gap: { size: 6 }, column: [{ html: (<button className='btn-123'>Approve</button>) }, { html: (<button className='btn-123' onClick={close}>Close</button>) }] }
                    ]
                }}
            />
        )
    }
    function h_layout(close:()=>void) {
        return (
            <RVD
                rootNode={{
                    style: { height: '100%' },
                    column: [
                        {
                            flex: 1, className: 'ofy-auto',
                            html: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum consectetur, enim cum similique aperiam maiores! Natus, sapiente vero molestiae ad tenetur amet eligendi exercitationem eveniet, repellat deserunt aut! Tenetur corporis officia, obcaecati excepturi architecto maxime asperiores assumenda sit maiores esse fugit soluta magnam, iure nobis pariatur dignissimos provident dicta ipsum perferendis! Sunt ea illum numquam cumque, eaque inventore dolore amet? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum consectetur, enim cum similique aperiam maiores! Natus, sapiente vero molestiae ad tenetur amet eligendi exercitationem eveniet, repellat deserunt aut! Tenetur corporis officia, obcaecati excepturi architecto maxime asperiores assumenda sit maiores esse fugit soluta magnam, iure nobis pariatur dignissimos provident dicta ipsum perferendis! Sunt ea illum numquam cumque, eaque inventore dolore amet? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum consectetur, enim cum similique aperiam maiores! Natus, sapiente vero molestiae ad tenetur amet eligendi exercitationem eveniet, repellat deserunt aut! Tenetur corporis officia, obcaecati excepturi architecto maxime asperiores assumenda sit maiores esse fugit soluta magnam, iure nobis pariatur dignissimos provident dicta ipsum perferendis! Sunt ea illum numquam cumque, eaque inventore dolore amet? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum consectetur, enim cum similique aperiam maiores! Natus, sapiente vero molestiae ad tenetur amet eligendi exercitationem eveniet, repellat deserunt aut! Tenetur corporis officia, obcaecati excepturi architecto maxime asperiores assumenda sit maiores esse fugit soluta magnam, iure nobis pariatur dignissimos provident dicta ipsum perferendis! Sunt ea illum numquam cumque, eaque inventore dolore amet? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum consectetur, enim cum similique aperiam maiores! Natus, sapiente vero molestiae ad tenetur amet eligendi exercitationem eveniet, repellat deserunt aut! Tenetur corporis officia, obcaecati excepturi architecto maxime asperiores assumenda sit maiores esse fugit soluta magnam, iure nobis pariatur dignissimos provident dicta ipsum perferendis! Sunt ea illum numquam cumque, eaque inventore dolore amet?'
                        },
                        {
                            gap: { size: 6 },
                            row: [
                                { html: (<button className='btn-123 w-100'>Approve</button>), className: 'align-vh flex-1' },
                                { html: (<button className='btn-123 w-100' onClick={close}>Close</button>), className: 'align-vh flex-1' }
                            ]
                        }
                    ]
                }}
            />
        )
    }
    function openModal(position:'top'|'bottom'|'right'|'left'|'center'|'fullscreen') {
        let p:AP_modal = {
            body:()=>null,
            header:undefined,
            position
        }
        if (position === 'top' || position === 'bottom') { 
            p.body = ({ close }) => v_layout(close) 
        }
        else if (position === 'left' || position === 'right') { 
            p.body = ({ close }) => h_layout(close); 
            p.setAttrs = (key)=>{
                if(key==='modal'){
                    return {style:{ width: 360 }}
                }
            } 
        }
        else if (position === 'center') { 
            p.body = () => content; 
            p.setAttrs = (key)=>{
                if(key === 'modal'){
                    return {style:{ maxHeight: '90vh' }}
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
    function getCode(position:'top'|'bottom'|'right'|'left'|'center'|'fullscreen') {
        let body;
        if (position === 'top' || position === 'bottom') {
            body =
                `body:{
        render:({close})=><MyComponent onClose={close}/>
    }`
        }
        else if (position === 'left' || position === 'right') {
            body =
                `body:{
        render:({close})=><MyComponent onClose={close}/>
    }`
        }
        else if (position === 'center') {
            body = `
    title:'My Modal',
    body:{render:({close})=><MyComponent onClose={close}/>}
`
        }
        else if (position === 'fullscreen') {
            body = `
    title:'My Modal',
    body:{render:({close})=><MyComponent onClose={close}/>} 
`
        }
        return AIODoc().Code(`
instance.addModal({
    position:'${position}',
    ${body}
})
`)
    }
    function getItem(position:'top'|'bottom'|'right'|'left'|'center'|'fullscreen') {
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
    let [popup] = useState(new AIOPopup())
    function addAlert(obj:any) {
        popup.addAlert({
            text: 'my alert text',
            time: 10,
            subtext: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum consectetur, enim cum similique aperiam maiores! Natus, sapiente vero molestiae ad tenetur amet eligendi exercitationem eveniet, repellat deserunt aut! Tenetur corporis officia, obcaecati excepturi architecto maxime asperiores assumenda sit maiores esse fugit',
            closeText: 'بستن',
            ...obj
        })
    }
    return (
        <div className='example'>
            <h3>addAlert</h3>
            {
                AIODoc().Code(`
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
                AIODoc().Code(`
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
                AIODoc().Code(`
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
                AIODoc().Code(`
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

            <h3>alert type error</h3>
            {
                AIODoc().Code(`
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
                AIODoc().Code(`
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
                AIODoc().Code(`
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
                AIODoc().Code(`
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
function Snackebar() {
    let [popup] = useState(new AIOPopup())
    let [rtlPopup] = useState(new AIOPopup({ rtl: true }))
    function addSnackebar(obj?: { [key in keyof AP_snackebar]?: any }, rtl?: boolean) {
        let {
            text = 'my snackebar title',
            subtext = 'my subtext of my snackebar . please click on action',
            time,
            type = 'error',
            verticalAlign = 'end',
            horizontalAlign = 'center',
            icon,
            attrs
        } = obj || {}
        if (rtl) {
            rtlPopup.addSnackebar({ text, subtext, time, type, verticalAlign, horizontalAlign, icon, attrs })
        }
        else {
            popup.addSnackebar({ text, subtext, time, type, verticalAlign, horizontalAlign, icon, attrs })
        }

    }
    return (
        <div className='example'>
            <h3>import</h3>
            {
                AIODoc().Code(`
import AIOPopup from 'aio-popup';
                `)
            }
            <h3>create instance</h3>
            {
                AIODoc().Code(`
const [popup] = useState(new AIOPopup())
                `)
            }
            <h3>snackebar type</h3>
            {
                AIODoc().Code(`
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
                AIODoc().Code(`
popup.addSnackebar(config:I_config)
                `)
            }
            <h3>Basic Example</h3>
            {
                AIODoc().Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const [popup] = useState(new AIOPopup())
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
                AIODoc().Code(`
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
                AIODoc().Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const [popup] = useState(new AIOPopup())
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
                AIODoc().Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const [popup] = useState(new AIOPopup())
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
                AIODoc().Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const [popup] = useState(new AIOPopup())
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
                AIODoc().Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const [popup] = useState(new AIOPopup())
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
                AIODoc().Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const [popup] = useState(new AIOPopup())
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
                AIODoc().Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const [popup] = useState(new AIOPopup())
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'error'
            verticalAlign:'start'
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
            <button style={{ height: 36, padding: '0 24px' }} onClick={() => addSnackebar({ verticalAlign: 'start' })}>Add Snackebar</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>icon</h3>
            {
                AIODoc().Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const [popup] = useState(new AIOPopup())
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'success'
            verticalAlign:'start',
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
                verticalAlign: 'start', type: 'success',
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
                AIODoc().Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const [popup] = useState(new AIOPopup())
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'success'
            verticalAlign:'start',
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
                verticalAlign: 'start', type: 'success',
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
                AIODoc().Code(`
import AIOPopup from 'aio-popup';
const example = () => {
    const [popup] = useState(new AIOPopup())
    function addSnackebar(){
        popup.addSnackebar({
            text:'my snackebar title',
            subtext:'my subtext of my snackebar . please click on action',
            type:'success'
            verticalAlign:'start',
            horizontalAlign:'end',
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
                verticalAlign: 'start', type: 'success',
                horizontalAlign: 'end',
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
    let [popup] = useState(new AIOPopup())
    function v_layout(close?: any) {
        return (
            <RVD
                rootNode={{
                    className: 'p-6',
                    row: [
                        { style: { maxHeight: 400, overflowY: 'auto' }, html: 'my sample text in modal', className: 'align-v flex-1' },
                        { size: 12 },
                        { gap: { size: 6 }, column: [{ html: (<button className='btn-123'>Approve</button>) }, { html: (<button className='btn-123' onClick={close}>Close</button>) }] }
                    ]
                }}
            />
        )
    }
    function addPopover() {
        popup.addModal({
            position: 'popover',
            getTarget: () => $(temp.dom1.current as any),
            body: ({ close }) => v_layout(close)
        })
    }
    function fixStyle() {
        popup.addModal({
            position: 'popover',
            getTarget: () => $(temp.dom2.current as any),
            fixStyle: (a, b) => { return { ...a, top: a.top + 36 } },
            body: () => v_layout()
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
    }
    function without_backdrop() {
        popup.addModal({
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
    }
    return (
        <div className='example'>
            <h3>popover</h3>
            {
                AIODoc().Code(`
popupInstance.addModal({
    position: 'popover',
    getTarget: () => $(temp.dom1.current as any),
    body: ({ close }) => v_layout(close)
})
                `)
            }
            <button ref={temp.dom1 as any} style={{ height: 36, padding: '0 24px' }} onClick={() => addPopover()}>Open Popover</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>popover fixStyle</h3>
            {
                AIODoc().Code(`
popupInstance.addModal({
    position: 'popover',
    getTarget: () => $(temp.dom2.current as any),
    fixStyle: (a, b) => { return { ...a, top: a.top + 36 } },
    body: () => v_layout()
})
                `)
            }
            <button ref={temp.dom2 as any} style={{ height: 36, padding: '0 24px' }} onClick={() => fixStyle()}>Open Popover</button>
            <div style={{ marginTop: 24 }} className='aio-component-splitter'></div>
            <h3>fitHorizontal</h3>
            {
                AIODoc().Code(`
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
                AIODoc().Code(`
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
                AIODoc().Code(`
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




