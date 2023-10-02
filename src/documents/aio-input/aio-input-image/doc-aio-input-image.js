import React, { Component,createRef } from 'react';
import DOC from '../../../resuse-components/doc';
import AIODoc from '../../../npm/aio-documentation/aio-documentation';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from '../../../npm/aio-input/aio-input';
import './doc-aio-input-image.css';
import {Icon} from '@mdi/react';
import { mdiHumanMale,mdiHumanFemale, mdiAbTesting, mdiFile, mdiAccount} from '@mdi/js';
export default class DOC_AIOInput_Slider extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='drop'
                navs={[
                    { text: 'basic', id: 'basic', COMPONENT: () => <Basic /> },
                    { text: 'width height', id: 'widthheight', COMPONENT: () => <WidthHeight /> },
                    { text: 'placeholder', id: 'placeholder', COMPONENT: () => <PlaceHolder /> },
                    { text: 'onChange', id: 'onChange', COMPONENT: () => <OnChange /> },
                    { text: 'onRemove', id: 'onRemove', COMPONENT: () => <OnRemove /> },
                    { text: 'preview', id: 'preview', COMPONENT: () => <Preview /> },
                    { text: 'before after subtext', id: 'beforeafter', COMPONENT: () => <BeforeAfter /> },
                    { text: 'drop', id: 'drop', COMPONENT: () => <Drop /> },
                    
                ]}
            />
        )
    }
}


class Drop extends Component {
    constructor(props){
        super(props);
        this.state = {image:undefined}
    }
    preview() {
        let {image} = this.state
        return (
            <div className='example'>
                <AIOInput 
                    type='image' 
                    value={image}
                    placeholder='select an image'
                    style={{border:'1px solid',height:100}}
                    height='100px'
                    onChange={({file,url})=>this.setState({image:file})}
                />
                {
                    AIODoc().Code(`
<AIOInput 
    type='image' 
    value={image}
    placeholder='select an image'
    style={{border:'1px solid',height:100}}
    height='100px'
    onChange={(image)=>this.setState({image})}
/>
                    `)
                }
                {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}


class Basic extends Component {
    preview() {
        return (
            <div className='example'>
                <AIOInput 
                    type='image' 
                    value={'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'}
                />
                {
                    AIODoc().Code(`
<AIOInput 
    type='image' 
    value={'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'}
/>
                    `)
                }
                {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class WidthHeight extends Component {
    preview() {
        return (
            <div className='example'>
                <AIOInput 
                    type='image' 
                    value={'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'}
                    width={100}
                    height={100}
                />
                {
                    AIODoc().Code(`
<AIOInput 
    type='image' 
    value={'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'}
    width={100}
    height={100}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <AIOInput 
                    type='image' 
                    value={'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'}
                    height={100}
                />
                {
                    AIODoc().Code(`
<AIOInput 
    type='image' 
    value={'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'}
    height={100}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
                <AIOInput 
                    type='image' 
                    value={'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'}
                    width={100}
                />
                {
                    AIODoc().Code(`
<AIOInput 
    type='image' 
    value={'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'}
    width={100}
/>
                    `)
                }
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}

class PlaceHolder extends Component {
    preview() {
        return (
            <div className='example'>
                <AIOInput 
                    type='image' 
                    placeholder='select an image'
                    style={{border:'1px solid',height:100}}
                />
                {
                    AIODoc().Code(`
<AIOInput 
    type='image' 
    placeholder='select an image'
    style={{border:'1px solid',height:100}}
/>
                    `)
                }
                {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}

class OnChange extends Component {
    constructor(props){
        super(props);
        this.state = {image:undefined}
    }
    preview() {
        let {image} = this.state
        return (
            <div className='example'>
                <AIOInput 
                    type='image' 
                    value={image}
                    placeholder='select an image'
                    style={{border:'1px solid',height:100}}
                    height='100px'
                    onChange={({file,url})=>this.setState({image:file})}
                />
                {
                    AIODoc().Code(`
<AIOInput 
    type='image' 
    value={image}
    placeholder='select an image'
    style={{border:'1px solid',height:100}}
    height='100px'
    onChange={(image)=>this.setState({image})}
/>
                    `)
                }
                {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}

class OnRemove extends Component {
    constructor(props){
        super(props);
        this.state = {image:undefined}
    }
    preview() {
        let {image} = this.state
        return (
            <div className='example'>
                <AIOInput 
                    type='image' 
                    value={image}
                    placeholder='select an image'
                    style={{border:'1px solid',height:100}}
                    height='100px'
                    onChange={({file,url})=>this.setState({image:file})}
                    onRemove={()=>{
                        debugger
                        this.setState({image:false})
                    }}
                />
                {
                    AIODoc().Code(`
<AIOInput 
    type='image' 
    value={image}
    placeholder='select an image'
    style={{border:'1px solid',height:100}}
    height='100px'
    onChange={(image)=>this.setState({image})}
    onRemove={()=>this.setState({image:false})}
/>
                    `)
                }
                {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}

class Preview extends Component {
    constructor(props){
        super(props);
        this.state = {image:undefined}
    }
    preview() {
        let {image} = this.state
        return (
            <div className='example'>
                <AIOInput 
                    type='image' 
                    value={image}
                    placeholder='select an image'
                    style={{border:'1px solid',height:100}}
                    height='100px'
                    onChange={({file,url})=>this.setState({image:file})}
                    onRemove={()=>this.setState({image:false})}
                    preview={true}
                />
                {
                    AIODoc().Code(`
<AIOInput 
    type='image' 
    value={image}
    placeholder='select an image'
    style={{border:'1px solid',height:100}}
    height='100px'
    onChange={(image)=>this.setState({image})}
    onRemove={()=>this.setState({image:false})}
/>
                    `)
                }
                {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}

class BeforeAfter extends Component {
    constructor(props){
        super(props);
        this.state = {image:undefined}
    }
    preview() {
        let {image} = this.state
        return (
            <div className='example'>
                <AIOInput 
                    type='image' 
                    before={<Icon path={mdiAccount} size={1}/>}
                    after={<Icon path={mdiAccount} size={1}/>}
                    subtext='this is my image'
                    value={image}
                    placeholder='select an image'
                    style={{border:'1px solid',height:124}}
                    height='100px'
                    onChange={({file,url})=>this.setState({image:file})}
                    onRemove={()=>this.setState({image:false})}
                />
                {
                    AIODoc().Code(`
<AIOInput 
    type='image' 
    value={image}
    placeholder='select an image'
    style={{border:'1px solid',height:100}}
    height='100px'
    onChange={(image)=>this.setState({image})}
    onRemove={()=>this.setState({image:false})}
/>
                    `)
                }
                {/* <div style={{marginTop:24}} className='aio-component-splitter'></div> */}
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
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
                        this.toolbar_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}



