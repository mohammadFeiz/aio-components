import React, { Component } from 'react';
import DOC from '../../resuse-components/doc';
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import AIOPopup from '../../npm/aio-popup/aio-popup';
import AIOInput from '../../npm/aio-input/aio-input';
import content from './content';
import {Icon} from '@mdi/react';
import { mdiAttachment, mdiContentSave } from '@mdi/js';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import './index.css';
export default class DOC_AIOForm extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='instance'
                navs={[
                    { text: 'aio-popup documentation', id: 'instance', COMPONENT: () => <Instance /> },
                    { text: 'modal', id: 'modal', COMPONENT: () => <Modal /> },
                    { text: 'modal type', id: 'modaltype', COMPONENT: () => <ModalType /> },
                    { text: 'confirm', id: 'confirm', COMPONENT: () => <Confirm /> },
                    { text: 'prompt', id: 'prompt', COMPONENT: () => <Prompt /> },
                    { text: 'alert', id: 'alert', COMPONENT: () => <Alert /> },
                    { text: 'snakebar', id: 'snakebar', COMPONENT: () => <Snakebar /> },
                ]}
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
    //title property => (string) (optional) (title of modal)
    title:'my modal title',
    //subtitle property (string) (optional) (subtitle of modal)
    subtitle:'my modal subtitle', 
    //type property ('fullscreen' | 'top' | 'right' | 'left' | 'bottom') (optional) (set position of modal)
    type:'fullscreen', 
    //attrs property (object) (optional) (set custom attributes on modal like style,classname,...)
    attrs:{
        className:'my-modal'
    },
    //backClose property (boolean) (default is true) (set true for close modal after click on backdrop of modal)
    backClose:true, 
    //backdropAttrs property (object) (optional) (set custom attributes on modal backdrop like style,classname,...)
    backdropAttrs:{
        style:{background:'rgba(0,0,0,0.4)'}
    }, 
    //body property (function) (required) 
    //(returns jsx or html for render body of modal and get some functons as parameter object, 
    //like close to handle close modal manualy by call it)
    body:({close})=><MyForm onClose={close}/>, 
    //headerButtons property (array of [<buttontext(string)>,<button attrs(object)>]) (optional) (set some custom buttons in modal header)
    headerButtons:[
        ['save',{onClick:()=>this.save(),className:'save-button'}]
    ]
    //footerButtons property (array of [<buttontext(string)>,<button attrs(object)>]) (optional) (set some custom buttons in modal footer)
    footerButtons:[
        ['Save',{onClick:()=>this.save(),className:'save-button'}],
        ['Cansel',{onClick:()=>this.cansel(),className:'cansel-button'}],
    ],
    //id property (any) (optional) (use for handle prevent open a uniq popup more than one time)
    //If a popup with a specific id is open and you request to open a popup with the same id, 
    //the popup will be closed first and then it will be opened again on the top of list of popups.
    id:'my-register-form',
    //animate property (boolean) (default is true) (if true, The opening of the popup will be accompanied by animation )
    animate:true,
    //onClose property (function callback) (optional) (set onClose top prevent close popup automatically and you can close it manually) 
    onClose:()=>this.closePopup()
})
`)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>instance.addConfirm()</h3>
                <h5>
                    user instance.addConfirm() to show confirm box in your page. you can add more than one confirm and dont need to handle any state of that 
                </h5>
                {
                    AIODoc().Code(`
instance.addConfirm({
    //title property => (string) (optional) (title of confirm)
    title:'my confirm title',
    //attrs property (object) (optional) (set custom attributes on confirm box like style,classname,...)
    attrs:{
        className:'my-confirm'
    },
    //backClose property (boolean) (default is true) (set true for close confirm after click on backdrop of confirm)
    backClose:true, 
    //backdropAttrs property (object) (optional) (set custom attributes on confirm box backdrop like style,classname,...)
    backdropAttrs:{
        style:{background:'rgba(0,0,0,0.4)'}
    }, 
    //text property (string) (required) (text of confirm) 
    text:'are you sure to remove?', 
    //footerButtons property (array of [<buttontext(string)>,<button attrs(object)>]) (optional) (set some custom buttons in copnfirm box footer)
    footerButtons:[
        ['Approve',{onClick:()=>this.approve(),className:'approve-button'}],
        ['Cansel',{onClick:()=>this.cansel(),className:'cansel-button'}],
    ],
    //id property (any) (optional) (use for handle prevent open a uniq confirm more than one time)
    //If a confirm box with a specific id is open and you request to open a confirm box with the same id, 
    //the confirm box will be closed first and then it will be opened again on the top of list of popups.
    id:'my-register-form',
    //animate property (boolean) (default is true) (if true, The opening of the confirm box will be accompanied by animation )
    animate:true,
    //onClose property (function callback) (optional) (set onClose top prevent close confirm box automatically and you can close it manually) 
    onClose:()=>this.closePopup()
})
`)
                }
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
class Modal extends Component {
    constructor(props){
        super(props);
        this.popup = new AIOPopup()
    }
    modal1(){
        this.popup.addModal({title:'my modal',body:()=>content})
    }
    modal2(){
        this.popup.addModal({title:'my modal',body:()=><div style={{height:'100%',overflowY:'auto'}}>{content}</div>})
    }
    modal3(){
        this.popup.addModal({title:'my modal',subtitle:'my modal subtitle',body:()=>content})
    }
    modal4(){
        this.popup.addModal({title:'my modal',subtitle:'my modal subtitle',headerButtons:[
            [<Icon path={mdiContentSave} size={1}/>,{onClick:()=>alert()}],
            [<Icon path={mdiAttachment} size={1}/>,{onClick:()=>alert()}],
            ['My Button']
        ],body:()=>content})
    }
    backClose(){
        this.popup.addModal({
            type:'top',
            backClose:true,
            body:({close})=>(
                <RVD
                    layout={{
                        row:[
                            {
                                flex:1,
                                style:{maxHeight:400,overflowY:'auto'},
                                html:'this is my sample text in modal',
                                align:'v'},
                            {
                                gap:6,
                                column:[
                                    {html:(<button className='btn-123'>Approve</button>)},
                                    {html:(<button className='btn-123' onClick={close}>Close</button>)}
                                ]   
                            }
                        ]
                    }}
                />
            )
        })
    }
    remove(){
        this.popup.addModal({
            type:'top',
            id:'one',
            body:({close})=>(
                <RVD
                    layout={{
                        row:[
                            {
                                flex:1,
                                style:{maxHeight:400,overflowY:'auto'},
                                html:'this is my sample text in modal',
                                align:'v'},
                            {
                                gap:6,
                                column:[
                                    {html:(<button className='btn-123'>Approve</button>)},
                                    {html:(<button className='btn-123' onClick={close}>Close</button>)}
                                ]   
                            }
                        ]
                    }}
                />
            )
        })
        this.popup.addModal({
            type:'bottom',
            id:'two',
            backClose:true,
            body:({close})=>(
                <RVD
                    layout={{
                        row:[
                            {
                                flex:1,
                                style:{maxHeight:400,overflowY:'auto'},
                                html:'this is my sample text in modal',
                                align:'v'},
                            {
                                gap:6,
                                column:[
                                    {html:(<button className='btn-123'>Approve</button>)},
                                    {html:(<button className='btn-123' onClick={()=>this.popup.remove()}>Close</button>)}
                                ]   
                            }
                        ]
                    }}
                />
            )
        })
    }
    preview() {
        return (
            <div className='example'>
                <h3>Basic Modal</h3>
                {
                    AIODoc().Code(`
instance.addModal({title:'my modal',body:()=>content})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.modal1()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Set Scroll On Modal Content</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    title:'my modal',
    body:()=><div style={{height:'100%',overflowY:'auto'}}>{content}</div>
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.modal2()}>Open Modal</button>
                <h3>Modal subtitle</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    title:'my modal',
    subtitle:'my modal subtitle',
    body:()=><div style={{height:'100%',overflowY:'auto'}}>{content}</div>
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.modal3()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Modal headerButtons</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    title:'my modal',
    subtitle:'my modal subtitle',
    body:()=><div style={{height:'100%',overflowY:'auto'}}>{content}</div>,
    headerButtons:[
        [<Icon path={mdiContentSave} size={1}/>,{onClick:()=>alert()}],
        [<Icon path={mdiAttachment} size={1}/>,{onClick:()=>alert()}],
        ['My Button']
    ]
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.modal4()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Modal backClose</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    type:'top',
    backClose:true,
    body:({close})=>(
        <RVD
            layout={{
                row:[
                    {
                        flex:1,
                        style:{maxHeight:400,overflowY:'auto'},
                        html:'this is my sample text in modal',
                        align:'v'},
                    {
                        gap:6,
                        column:[
                            {html:(<button className='btn-123'>Approve</button>)},
                            {html:(<button className='btn-123' onClick={close}>Close</button>)}
                        ]   
                    }
                ]
            }}
        />
    )
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.backClose()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Modal remove</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    type:'top',
    id:'one',
    body:({close})=>(
        <RVD
            layout={{
                row:[
                    {
                        flex:1,
                        style:{maxHeight:400,overflowY:'auto'},
                        html:'this is my sample text in modal',
                        align:'v'},
                    {
                        gap:6,
                        column:[
                            {html:(<button className='btn-123'>Approve</button>)},
                            {html:(<button className='btn-123' onClick={close}>Close</button>)}
                        ]   
                    }
                ]
            }}
        />
    )
})
instance.addModal({
    type:'bottom',
    id:'two',
    backClose:true,
    body:({close})=>(
        <RVD
            layout={{
                row:[
                    {
                        flex:1,
                        style:{maxHeight:400,overflowY:'auto'},
                        html:'this is my sample text in modal',
                        align:'v'},
                    {
                        gap:6,
                        column:[
                            {html:(<button className='btn-123'>Approve</button>)},
                            {html:(<button className='btn-123' onClick={()=>this.popup.remove()}>Close</button>)}
                        ]   
                    }
                ]
            }}
        />
    )
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.remove()}>Open Modal</button>
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

class ModalType extends Component {
    constructor(props){
        super(props);
        this.popup = new AIOPopup()
    }
    type_top(){
        this.popup.addModal({
            type:'top',
            body:({close})=>(
                <RVD
                    layout={{
                        row:[
                            {
                                flex:1,
                                style:{maxHeight:400,overflowY:'auto'},
                                html:'this is my sample text in modal',
                                align:'v'},
                            {
                                gap:6,
                                column:[
                                    {html:(<button className='btn-123'>Approve</button>)},
                                    {html:(<button className='btn-123' onClick={close}>Close</button>)}
                                ]   
                            }
                        ]
                    }}
                />
            )
        })
    }
    type_bottom(){
        this.popup.addModal({
            type:'bottom',
            body:({close})=>(
                <RVD
                    layout={{
                        row:[
                            {
                                flex:1,
                                style:{maxHeight:400,overflowY:'auto'},
                                html:'this is my sample text in modal',
                                align:'v'},
                            {
                                gap:6,
                                column:[
                                    {html:(<button className='btn-123'>Approve</button>)},
                                    {html:(<button className='btn-123' onClick={close}>Close</button>)}
                                ]   
                            }
                        ]
                    }}
                />
            )
        })
    }
    type_right(){
        this.popup.addModal({
            type:'right',
            attrs:{style:{width:300}},
            body:({close})=>(
                <RVD
                    layout={{
                        style:{height:'100%'},
                        column:[
                            {
                                flex:1,className:'ofy-auto',
                                html:'this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal '
                            },
                            {
                                gap:6,
                                row:[
                                    {html:(<button className='btn-123 w-100'>Approve</button>),flex:1,align:'vh'},
                                    {html:(<button className='btn-123 w-100' onClick={close}>Close</button>),flex:1,align:'vh'}
                                ]   
                            }
                        ]
                    }}
                />
            )
        })
    }
    type_left(){
        this.popup.addModal({
            type:'left',
            attrs:{style:{width:300}},
            body:({close})=>(
                <RVD
                    layout={{
                        style:{height:'100%'},
                        column:[
                            {
                                flex:1,className:'ofy-auto',
                                html:'this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal '
                            },
                            {
                                gap:6,
                                row:[
                                    {html:(<button className='btn-123 w-100'>Approve</button>),flex:1,align:'vh'},
                                    {html:(<button className='btn-123 w-100' onClick={close}>Close</button>),flex:1,align:'vh'}
                                ]   
                            }
                        ]
                    }}
                />
            )
        })
    }
    center(){
        this.popup.addModal({
            title:'my modal',body:()=>content,
            attrs:{
                style:{
                    width:'calc(100% - 48px)',
                    height:'calc(100% - 48px)',
                    maxWidth:400,
                    maxHeight:600

                }
            }
        })
    }
    preview() {
        return (
            <div className='example'>
                <h3>Modal type top</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    type:'top',
    body:({close})=>(
        <RVD
            layout={{
                row:[
                    {
                        flex:1,
                        style:{maxHeight:400,overflowY:'auto'},
                        html:'this is my sample text in modal',
                        align:'v'},
                    {
                        gap:6,
                        column:[
                            {html:(<button className='btn-123'>Approve</button>)},
                            {html:(<button className='btn-123' onClick={close}>Close</button>)}
                        ]   
                    }
                ]
            }}
        />
    )
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.type_top()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Modal type bottom</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    type:'bottom',
    body:({close})=>(
        <RVD
            layout={{
                row:[
                    {
                        flex:1,
                        style:{maxHeight:400,overflowY:'auto'},
                        html:'this is my sample text in modal',
                        align:'v'},
                    {
                        gap:6,
                        column:[
                            {html:(<button className='btn-123'>Approve</button>)},
                            {html:(<button className='btn-123' onClick={close}>Close</button>)}
                        ]   
                    }
                ]
            }}
        />
    )
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.type_bottom()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Modal type right</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    type:'right',
    attrs:{style:{width:300}},
    body:({close})=>(
        <RVD
            layout={{
                style:{height:'100%'},
                column:[
                    {
                        flex:1,className:'ofy-auto',
                        html:'this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal '
                    },
                    {
                        gap:6,
                        row:[
                            {html:(<button className='btn-123 w-100'>Approve</button>),flex:1,align:'vh'},
                            {html:(<button className='btn-123 w-100' onClick={close}>Close</button>),flex:1,align:'vh'}
                        ]   
                    }
                ]
            }}
        />
    )
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.type_right()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Modal type left</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    type:'left',
    attrs:{style:{width:300}},
    body:({close})=>(
        <RVD
            layout={{
                style:{height:'100%'},
                column:[
                    {
                        flex:1,className:'ofy-auto',
                        html:'this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal this is my sample text in modal '
                    },
                    {
                        gap:6,
                        row:[
                            {html:(<button className='btn-123 w-100'>Approve</button>),flex:1,align:'vh'},
                            {html:(<button className='btn-123 w-100' onClick={close}>Close</button>),flex:1,align:'vh'}
                        ]   
                    }
                ]
            }}
        />
    )
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.type_left()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>Modal set to center</h3>
                {
                    AIODoc().Code(`
instance.addModal({
    title:'my modal',body:()=>content,
    attrs:{
        style:{
            width:'calc(100% - 48px)',
            height:'calc(100% - 48px)',
            maxWidth:400,
            maxHeight:600

        }
    }
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.center()}>Open Modal</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
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

class Confirm extends Component {
    constructor(props){
        super(props);
        this.popup = new AIOPopup()
    }
    addConfirm(obj = {}){
        let {
            title = 'my confirm title',
            text = 'this is the text of my confirm . please select your action by footer buttons',
            footerButtons = [
                ['yes',{onClick:({close})=>{console.log('yes'); close()}}],
                ['no',{onClick:({close})=>{console.log('no'); close()},style:{background:'#999'}}]
            ]
        } = obj
        this.popup.addConfirm({...obj,title,text,footerButtons})
    }
    preview() {
        return (
            <div className='example'>
                <h3>addConfirm</h3>
                {
                    AIODoc().Code(`
this.popup.confirm({
    title:'my confirm title',
    text:'this is the text of my confirm . please select your action by footer buttons',
    footerButtons:[
        ['yes',{onClick:({close})=>{console.log('yes'); close()}}],
        ['no',{onClick:({close})=>{console.log('no'); close()},style:{background:'#999'}}]
    ]
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addConfirm()}>Open confirm</button>
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <h3>confirm top</h3>
                {
                    AIODoc().Code(`
this.popup.confirm({
    type:'top',
    text:'this is the text of my confirm . please select your action by footer buttons',
    footerButtons:[
        ['yes',{onClick:({close})=>{console.log('yes'); close()}}],
        ['no',{onClick:({close})=>{console.log('no'); close()},style:{background:'#999'}}]
    ]
})
                    `)
                }
                <button style={{ height: 36, padding: '0 24px' }} onClick={() => this.addConfirm({type:'top',title:''})}>Open confirm</button>
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

class Prompt extends Component {
    constructor(props){
        super(props);
        this.popup = new AIOPopup()
    }
    addPrompt(){
        this.popup.addPrompt({
            title:'my propmpt title',
            text:'this is the text of my prompt . please select your action by footer buttons',
            onSubmit:(value)=>console.log('you intered' , value)
        })
    }
    preview() {
        return (
            <div className='example'>
                <h3>addPrompt</h3>
                {
                    AIODoc().Code(`
instance.confirm({
    title:'my confirm title',
    text:'this is the text of my confirm . please select your action by footer buttons',
    onSubmit:(value)=>console.log('you intered' , value)
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
                layout={{
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




