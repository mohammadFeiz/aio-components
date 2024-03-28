import React, { Component,createRef } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import AIOPopup from '../../npm/aio-popup/aio-popup';
import AIOInput from '../../npm/aio-input/aio-input';
import content from './content';
import {Icon} from '@mdi/react';
import { mdiAttachment, mdiContentSave } from '@mdi/js';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import $ from 'jquery';
import './index.css';
export default class DOC_AIOForm extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='popover'
                nav={{
                    items:[
                        { text: 'aio-popup documentation', id: 'instance', render: () => <Instance /> },
                        { text: 'addModal', id: 'addModal', render: () => <AddModal /> },
                        { text: 'modal position', id: 'modalposition', render: () => <ModalPosition /> },
                        { text: 'alert', id: 'alert', render: () => <Alert /> },
                        { text: 'snakebar', id: 'snakebar', render: () => <Snakebar /> },
                        { text: 'popover', id: 'popover', render: () => <Popover /> },
                    ]
                }}
            />
        )
    }
}
class Instance extends Component {
    constructor(props){
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
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
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
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
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
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>instance.addAlert()</h3>
                <h5>
                    user instance.addAlert() to show alert box in your page. you can add more than one alert and dont need to handle any state of that 
                </h5>
                {
                    AIODoc().Code(`
instance.addAlert(props)
`)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>instance.addSnakebar()</h3>
                <h5>
                    user instance.addSnakebar() to show snakebar box in your page. you can add more than one snakebar and dont need to handle any state of that 
                </h5>
                {
                    AIODoc().Code(`
instance.addSnakebar(props)
`)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                {this.popup.render()}
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class AddModal extends Component {
    constructor(props){
        super(props);
        this.popup = new AIOPopup()
    }
    modal1(){
        this.popup.addModal({
            header:{title:'my modal'},
            body:{render:()=>content}
        })
    }
    modal2(){
        this.popup.addModal({
            header:{title:'my modal'},
            body:{render:()=><div style={{height:'100%',overflowY:'auto'}}>{content}</div>}
        })
    }
    modal3(){
        this.popup.addModal({
            header:{title:'my modal',subtitle:'my modal subtitle'},
            body:{render:()=>content}
        })
    }
    modal4(){
        this.popup.addModal({
            header:{
                title:'my modal',
                subtitle:'my modal subtitle',
                buttons:[
                    [<Icon path={mdiContentSave} size={1}/>,{onClick:()=>alert()}],
                    [<Icon path={mdiAttachment} size={1}/>,{onClick:()=>alert()}],
                    ['My Button']
                ]
            },
            body:{
                render:()=>content
            }
        })

    }
    backClose(){
        this.popup.addModal({
            position:'top',
            backdrop:{
                close:false
            },
            body:{
                render:({close})=>(
                    <RVD
                        rootNode={{
                            row:[
                                {
                                    style:{maxHeight:400},
                                    html:'this is my sample text in modal',
                                    className:'align-v flex-1 ofy-auto'
                                },
                                {
                                    gap:{size:6},
                                    column:[
                                        {html:(<button className='btn-123'>Approve</button>)},
                                        {html:(<button className='btn-123' onClick={close}>Close</button>)}
                                    ]   
                                }
                            ]
                        }}
                    />
                )
            }
        })
    }
    removeModal(){
        this.popup.addModal({
            position:'top',
            id:'one',
            body:{
                render:({close})=>(
                    <RVD
                        rootNode={{
                            row:[
                                {
                                    style:{maxHeight:400,overflowY:'auto'},
                                    html:'this is my sample text in modal',
                                    className:'align-v flex-1'
                                },
                                {
                                    gap:{size:6},
                                    column:[
                                        {html:(<button className='btn-123'>Approve</button>)},
                                        {html:(<button className='btn-123' onClick={close}>Close</button>)}
                                    ]   
                                }
                            ]
                        }}
                    />
                )
            }
        })
        this.popup.addModal({
            position:'bottom',
            id:'two',
            backClose:true,
            body:{
                render:({close})=>(
                    <RVD
                        rootNode={{
                            row:[
                                {
                                    style:{maxHeight:400,overflowY:'auto'},
                                    html:'this is my sample text in modal',
                                    className:'align-v flex-1'
                                },
                                {
                                    className:'gap-6',
                                    column:[
                                        {html:(<button className='btn-123'>Approve</button>)},
                                        {html:(<button className='btn-123' onClick={()=>this.popup.removeModal()}>Close</button>)}
                                    ]   
                                }
                            ]
                        }}
                    />
                )
            }
        })
    }
    addConfirm(){
        this.popup.addModal({
            position:'center',
            header:{title:'my confirm title'},
            body:{render:()=>'my confirm text my confirm text my confirm text my confirm text my confirm text my confirm text my confirm text my confirm text '},
            footer:{
                buttons:[
                    ['yes',{onClick:({close})=>{console.log('yes'); close()}}],
                    ['no',{onClick:({close})=>{console.log('no'); close()},style:{background:'#999'}}]
                ]
            }
        })
    }
    addPrompt(obj = {}){
        this.popup.addModal({
            position:'center',
            header:{title:'my prompt title'},
            state:{temp:''},
            body:{
                render:({state,setState})=>{
                    return (
                        <textarea
                            value={state.temp} onChange={(e)=>setState({...state,temp:e.target.value})}
                            style={{resize:'vertical',border:'none',outline:'none',background:'rgba(0,0,0,0.05)',width:'100%'}}
                        />
                    )
                }},
            footer:{
                buttons:[
                    [
                        'yes',
                        {
                            onClick:({close,state,setState})=>{
                                console.log(state.temp); 
                                close();
                            }
                        }
                    ],
                    [
                        'no',
                        {
                            onClick:({close,state,setState})=>{
                                close()
                            },
                            style:{background:'#999'}
                        }
                    ]
                ]
            },
        })
    }
    preview() {
        return (
            <div className='example'>
                <h3>Basic Modal</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    header:{title:'my modal'},
    body:{render:()=>content}
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.modal1()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Set Scroll On Modal Content</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    header:{title:'my modal'},
    body:{render:()=><div style={{height:'100%',overflowY:'auto'}}>{content}</div>}
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.modal2()}>Open Modal</button>
                <h3>Modal header.subtitle</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    header:{title:'my modal',subtitle:'my modal subtitle'},
    body:{render:()=>content}
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.modal3()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Modal header.buttons</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    header:{
        title:'my modal',
        subtitle:'my modal subtitle',
        buttons:[
            [<Icon path={mdiContentSave} size={1}/>,{onClick:()=>alert()}],
            [<Icon path={mdiAttachment} size={1}/>,{onClick:()=>alert()}],
            ['My Button']
        ]
    },
    body:{
        render:()=>content
    }
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.modal4()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Modal backdrop.close</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    position:'top',
    backdrop:{
        close:false
    },
    body:{
        render:({close})=><MyComponent onClose={close}/>
    }
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.backClose()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Modal removeModal</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    position:'top',
    id:'one',
    body:{
        render:({close})=><MyComponent onClose={close}/>
    }
})
instance.addModal({
    position:'bottom',
    id:'two',
    backClose:true,
    body:{
        render:({close})=><MyComponent onClose={close}/>
    }
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.removeModal()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>use as confirm</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    position:'center',
    header:{title:'my confirm title'},
    body:{render:()=>'my confirm text'},
    footer:{
        buttons:[
            ['yes',{onClick:({close})=>{console.log('yes'); close()}}],
            ['no',{onClick:({close})=>{console.log('no'); close()},style:{background:'#999'}}]
        ]
    }
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addConfirm()}>Open confirm</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>use as prompt</h3>
                {
                    AIODoc().Code(`
instance.addModal({
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
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addPrompt()}>Open prompt</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                
                {this.popup.render()}
            </div>
        )
    }
    render() {
        return (
            <Example
                preview={() => this.preview()}
            />
        )
    }
}

class ModalPosition extends Component {
    constructor(props){
        super(props);
        this.popup = new AIOPopup()
    }
    v_layout(close){
        return (
            <RVD
                rootNode={{
                    row:[
                        {style:{maxHeight:400,overflowY:'auto'},html:'this is my sample text in modal',className:'align-v flex-1'},
                        {gap:{size:6},column:[{html:(<button className='btn-123'>Approve</button>)},{html:(<button className='btn-123' onClick={close}>Close</button>)}]}
                    ]
                }}
            />
        )
    }
    h_layout(close){
        return (
            <RVD
                rootNode={{
                    style:{height:'100%'},
                    column:[
                        {
                            flex:1,className:'ofy-auto',
                            html:'this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal '
                        },
                        {
                            gap:{size:6},
                            row:[
                                {html:(<button className='btn-123 w-100'>Approve</button>),className:'align-vh flex-1'},
                                {html:(<button className='btn-123 w-100' onClick={close}>Close</button>),className:'align-vh flex-1'}
                            ]   
                        }
                    ]
                }}
            />
        )
    }
    openModal(position){
        let body,attrs = {},header;
        if(position === 'top' || position === 'bottom'){body = {render:({close})=>this.v_layout(close)}}
        else if(position === 'left' || position === 'right'){body = {render:({close})=>this.h_layout(close)}; attrs.style = {width:360}}
        else if(position === 'center'){body = {render:()=>content}; attrs.style = {maxHeight:'90vh'}; header = {title:'My Modal'}}
        else if(position === 'fullscreen'){body = {render:()=>content}; header = {title:'My Modal'}}
        this.popup.addModal({position,body,attrs,header})
    }
    getCode(position){
        let body;
        if(position === 'top' || position === 'bottom'){
            body = 
    `body:{
        render:({close})=>(
            <RVD
                rootNode={{
                    row:[
                        {
                            style:{maxHeight:400,overflowY:'auto'},
                            html:'this is my sample text in modal',
                            className:'align-v flex-1'
                        },
                        {
                            gap:{size:6},
                            column:[
                                {html:(<button className='btn-123'>Approve</button>)},
                                {html:(<button className='btn-123' onClick={close}>Close</button>)}
                            ]   
                        }
                    ]
                }}
            />
        )
    }`
        }
        else if(position === 'left' || position === 'right'){
            body = 
    `body:{
        render:({close})=>(
            <RVD
                rootNode={{
                    style:{height:'100%'},
                    column:[
                        {
                            flex:1,className:'ofy-auto',
                            html:'this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal '
                        },
                        {
                            gap:{size:6},
                            row:[
                                {html:(<button className='btn-123 w-100'>Approve</button>),className:'align-vh flex-1'},
                                {html:(<button className='btn-123 w-100' onClick={close}>Close</button>),className:'align-vh flex-1'}
                            ]   
                        }
                    ]
                }}
            />
        )
    }`
        }
        else if(position === 'center'){
            body = `
    title:'My Modal',
    body:{render:()=>content}
`            
        }
        else if(position === 'fullscreen'){
            body = `
    title:'My Modal',
    body:{render:()=>content} 
`            
        }
return AIODoc().Code(`
instance.addModal({
    position:'${position}',
    ${body}
})
`)
    }
    getItem(position){
        return (
            <>
                <h3>{`Modal position ${position}`}</h3>
                {this.getCode(position)}
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.openModal(position)}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
        )
    }
    preview() {
        return (
            <div className='example'>
                {this.getItem('top')}
                {this.getItem('bottom')}
                {this.getItem('right')}
                {this.getItem('left')}
                {this.getItem('center')}
                {this.getItem('fullscreen')}
                {this.popup.render()}
            </div>
        )
    }
    code() {
        return (`

      `)
    }
    toolbar() {
        return ('')
    }
    render() {
        return (
            <Example
                preview={() => this.preview()}
                code={() => this.code()}
                toolbar={() => this.toolbar()}
            />
        )
    }
}

class Alert extends Component {
    constructor(props){
        super(props);
        this.popup = new AIOPopup()
    }
    addAlert(type){
        this.popup.addAlert({
            text:'my alert text',
            time:10,
            subtext:'this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert this is the subtext of my alert ',
            type,
            closeText:'بستن'
        })
    }
    preview() {
        return (
            <div className='example'>
                <h3>addAlert</h3>
                {
                    AIODoc().Code(`
instance.addAlert({
    text:'my alert text',
    subtext:'this is the subtext of my alert',
    time:10,
    type:'error',
    closeText:'بستن'
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addAlert('error')}>Open Alert</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>alert type error</h3>
                {
                    AIODoc().Code(`
instance.addAlert({
    text:'my alert text',
    subtext:'this is the subtext of my alert',
    time:10,
    type:'warning',
    closeText:'بستن'
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addAlert('error')}>Open Alert</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>alert type warning</h3>
                {
                    AIODoc().Code(`
instance.addAlert({
    text:'my alert text',
    subtext:'this is the subtext of my alert',
    time:10,
    type:'warning',
    closeText:'بستن'
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addAlert('warning')}>Open Alert</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>alert type success</h3>
                {
                    AIODoc().Code(`
instance.addAlert({
    text:'my alert text',
    subtext:'this is the subtext of my alert',
    time:10,
    type:'success',
    closeText:'بستن'
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addAlert('success')}>Open Alert</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>alert type info</h3>
                {
                    AIODoc().Code(`
instance.addAlert({
    text:'my alert text',
    subtext:'this is the subtext of my alert',
    time:10,
    type:'info',
    closeText:'بستن'
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addAlert('info')}>Open Alert</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                {this.popup.render()}
            </div>
        )
    }
    render() {
        return (
            <Example
                preview={() => this.preview()}
            />
        )
    }
}
class Snakebar extends Component {
    constructor(props){
        super(props);
        this.popup = new AIOPopup()
    }
    addSnakebar(obj = {}){
        let {
            text = 'my snakebar title',
            subtext ='this is the subtext of my snakebar . please click on action',
            time = 12,
            type = 'error',
            rtl = false
        } = obj
        this.popup.addSnakebar({text,subtext,time,type,rtl})
    }
    preview() {
        return (
            <div className='example'>
                <h3>addSnakebar</h3>
                {
                    AIODoc().Code(`
instance.addSnakebar({
    text:'my snakebar title',
    subtext:'this is the subtext of my snakebar . please click on action',
    time:12,
    type:'error'
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addSnakebar()}>Open snakebar</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>rtl</h3>
                {
                    AIODoc().Code(`
instance.addSnakebar({
    text:'my snakebar title',
    subtext:'this is the subtext of my snakebar . please click on action',
    time:12,
    type:'error'
    rtl:true
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addSnakebar({rtl:true})}>Open snakebar</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>time</h3>
                {
                    AIODoc().Code(`
instance.addSnakebar({
    text:'my snakebar title',
    subtext:'this is the subtext of my snakebar . please click on action',
    time:360,
    type:'error'
})
`)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addSnakebar({time:360})}>Open snakebar</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>

                <h3>type info</h3>
                {
                    AIODoc().Code(`
instance.addSnakebar({
    text:'my snakebar title',
    subtext:'this is the subtext of my snakebar . please click on action',
    time:12,
    type:'info'
})
`)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addSnakebar({type:'info'})}>Open snakebar</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>type error</h3>
                {
                    AIODoc().Code(`
instance.addSnakebar({
    text:'my snakebar title',
    subtext:'this is the subtext of my snakebar . please click on action',
    time:12,
    type:'error'
})
`)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addSnakebar({type:'error'})}>Open snakebar</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>type warning</h3>
                {
                    AIODoc().Code(`
instance.addSnakebar({
    text:'my snakebar title',
    subtext:'this is the subtext of my snakebar . please click on action',
    time:12,
    type:'warning'
})
`)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addSnakebar({type:'warning'})}>Open snakebar</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>type success</h3>
                {
                    AIODoc().Code(`
instance.addSnakebar({
    text:'my snakebar title',
    subtext:'this is the subtext of my snakebar . please click on action',
    time:12,
    type:'success'
})
`)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addSnakebar({type:'success'})}>Open snakebar</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                {this.popup.render()}
            </div>
        )
    }
    render() {
        return (
            <Example
                preview={() => this.preview()}
            />
        )
    }
}
class Popover extends Component {
    constructor(props){
        super(props);
        this.dom1 = createRef()
        this.dom2= createRef()
        this.dom3 = createRef()
        this.dom4 = createRef()
        this.dom5 = createRef()
        this.popup = new AIOPopup()
    }
    v_layout(close){
        return (
            <RVD
                rootNode={{
                    className:'p-6',
                    row:[
                        {style:{maxHeight:400,overflowY:'auto'},html:'this is my sample text in modal',className:'align-v flex-1'},
                        {size:12},
                        {gap:{size:6},column:[{html:(<button className='btn-123'>Approve</button>)},{html:(<button className='btn-123' onClick={close}>Close</button>)}]}
                    ]
                }}
            />
        )
    }
    addPopover(type){
        this.popup.addModal({
            position:'popover',
            popover:{
                getTarget:()=>$(this.dom1.current),
            },
            body:{render:({close})=>this.v_layout(close)}

        })
    }
    fixStyle(){
        this.popup.addModal({
            position:'popover',
            popover:{
                getTarget:()=>$(this.dom2.current),
                fixStyle:(a,b)=>{
                    return {...a,top:a.top + 36}
                }
            },
            body:{render:()=>this.v_layout()},
        })
    }
    fitHorizontal(){
        this.popup.addModal({
            position:'popover',
            popover:{
                getTarget:()=>$(this.dom3.current),
                fitHorizontal:true
            },
            body:{render:()=>this.v_layout()},

        })
    }
    styling(){
        this.popup.addModal({
            position:'popover',
            popover:{
                getTarget:()=>$(this.dom4.current),
            },
            body:{render:()=>content},
            attrs:{
                style:{
                    height:360,
                    width:400
                }
            }
        })
    }
    without_backdrop(){
        this.popup.addModal({
            backdrop:false,
            popover:{
                getTarget:()=>$(this.dom5.current),
                fitHorizontal:true,
            },
            position:'popover',
            body:{render:()=>content},
            attrs:{
                onClick:()=>{
                    this.popup.removeModal()
                },
                style:{
                    height:360
                }
            }
        })
    }
    preview() {
        return (
            <div className='example'>
                <h3>popover</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    position:'popover',
    popover:{
        getTarget:()=>$(this.dom1.current),
    },
    body:{render:({close})=>this.v_layout(close)}
})
                    `)
                }
                <button ref={this.dom1} style={{ height: 36, padding: '0 24px' }} onClick={() => this.addPopover()}>Open Popover</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>popover fixStyle</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    position:'popover',
    popover:{
        getTarget:()=>$(this.dom2.current),
        fixStyle:(a,b)=>{
            return {...a,top:a.top + 36}
        }
    },
    body:{render:()=>this.v_layout()},
})
                    `)
                }
                <button ref={this.dom2} style={{ height: 36, padding: '0 24px' }} onClick={() => this.fixStyle()}>Open Popover</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>fitHorizontal</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    popover:{
        getTarget:()=>$(this.dom3.current),
        fitHorizontal:true
    },
    position:'popover',
    body:{render:()=>this.v_layout()},

})
                    `)
                }
                <button ref={this.dom3} style={{ height: 36, padding: '0 24px',width:'100%' }} onClick={() => this.fitHorizontal()}>Open Popover</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>styling popover</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    position:'popover',
    popover:{
        getTarget:()=>$(this.dom4.current),
        fitHorizontal:true,
    },
    body:{render:()=>content},
    attrs:{
        style:{
            height:360,
            width:400
        }
    }
})
                    `)
                }
                <button ref={this.dom4} style={{ height: 36, padding: '0 24px',width:'100%' }} onClick={() => this.styling()}>test long</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>popover without backdrop</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    backdrop:false,
    popover:{
        getTarget:()=>$(this.dom5.current),
        fitHorizontal:true,
    },
    position:'popover',
    body:{render:()=>content},
    attrs:{
        onClick:()=>{
            instance.removeModal()
        },
        style:{
            height:360
        }
    }
})
                    `)
                }
                <button ref={this.dom5} style={{ height: 36, padding: '0 24px',width:'100%' }} onClick={() => this.without_backdrop()}>test long</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                {this.popup.render()}
            </div>
        )
    }
    render() {
        return (
            <Example
                preview={() => this.preview()}
            />
        )
    }
}
class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'preview',
            tabs: [
                { text: 'Preview', value: 'preview' },
                { text: 'Code', value: 'code' }
            ]
        }
    }
    tabs_layout() {
        if(!this.props.code){return false}
        let { tab, tabs } = this.state;
        return {
            html: (
                <AIOInput type='tabs' options={tabs} value={tab} onChange={(tab) => this.setState({ tab })} />
            )
        }
    }
    body_layout() {
        let { tab } = this.state;
        return tab === 'preview' ? this.preview_layout() : this.code_layout()
    }
    preview_layout() {
        let { preview } = this.props;
        return {
            flex: 1,
            className: 'p-12',
            html: preview()
        }
    }
    code_layout() {
        let { code, rtl = false } = this.props;
        return {
            flex: 1,
            html: (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'auto' }}>
                    <pre style={{ padding: 12 }}>{AIODoc().Code(code())}</pre>
                </div>
            )
        }
    }
    toolbar_layout() {
        let { toolbar } = this.props;
        if (!toolbar) { return false }
        return {
            html: toolbar()
        }
    }
    render() {
        return (
            <RVD
                rootNode={{
                    column: [
                        this.tabs_layout(),
                        this.toolbar_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}




