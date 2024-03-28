import React, { Component,createRef } from 'react';
import DOC from '../../../resuse-components/doc.tsx';
import AIODoc from '../../../npm/aio-documentation/aio-documentation';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from '../../../npm/aio-input/aio-input';
import './doc-aio-input-list.css';
import {Icon} from '@mdi/react';
import { mdiHumanMale,mdiHumanFemale, mdiAbTesting, mdiFile} from '@mdi/js';
export default class DOC_AIOInput_Table extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='rowsTemplate'
                nav={{
                    items:[
                        { text: 'Basic', id: 'basic', render: () => <Basic /> }
                    ]
                }}
            />
        )
    }
}
class Basic extends Component {
    constructor(props){
        super(props);
        let options = [];
        for (let i = 0; i < 100; i++){
            options.push({text:`text example ${i}`,value:i})
        }
        this.state = {model:{size:36,width:120,decay:8,stop:3},options,value:12}
    }
    preview() {
        let {model,options,value} = this.state;
        return (
            <div className='example'>
                <AIOInput
                    type='form'
                    value={model}
                    labelAttrs={{style:{marginRight:12}}}
                    inputs={{
                        row:[
                            {input:{type:'slider',start:24,end:72,before:'size'},field:'value.size'},
                            {input:{type:'slider',start:80,end:400,before:'width'},field:'value.width'},
                            {input:{type:'slider',start:0,end:40,before:'decay'},field:'value.decay'},
                            {input:{type:'slider',start:0,end:9,before:'stop'},field:'value.stop'}
                        ]
                    }}
                    onChange={(model)=>this.setState({model})}
                />
                <AIOInput
                    attrs={{className:'my-list'}}
                    type='list'
                    value={value}
                    options={options}
                    size={model.size}
                    width={model.width}
                    decay={model.decay}
                    stop={model.stop}
                    onChange={(newValue)=>this.setState({value:newValue})}
                />    
                <div style={{marginTop:24,fontSize:12}}>{`changed value is : ${value}`}</div>            
                {
                    AIODoc().Code(`
function App(){
    let [value,setValue] = useState(12);
    let [options] = useState(getOptions())
    let value = 12;
    function getOptions(){
        let options = [];
        for (let i = 0; i < 100; i++){
            options.push({text:\`text example ${'${i}'}\`,value:i})
        }
        return options
    }
    return (
        <>
            <AIOInput
                type='list'
                attrs={{className:'my-list'}}
                value={value}
                options={options}
                size={${model.size}}
                width={${model.width}}
                decay={${model.decay}}
                stop={${model.stop}}
                onChange={(newValue)=>setValue(newValue)}
            />
            <div style={{marginTop:24,fontSize:12}}>{\`changed value is : ${'${value}'}\`}</div>            
        </>
    )
}
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
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
                rootNode={{
                    column: [
                        this.toolbar_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}




