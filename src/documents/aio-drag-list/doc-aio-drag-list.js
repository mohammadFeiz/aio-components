import React,{Component} from 'react';
import Form from './../../npm/aio-form-react/aio-form-react';
import AIODragList from './../../npm/aio-drag-list/aio-drag-list';
import DOC from '../../resuse-components/doc';
export default class DOC_AIOForm extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='basic'
                navs={[
                    {text:'basic',id:'basic',COMPONENT:()=><Basic/>},
                ]}
            />
        )
    }
}


class Basic extends Component{
    constructor(props){
        super(props);
        let items = [];
        for (let i = 0; i < 100; i++){
            items.push({text:`text example ${i}`})
        }
        this.state = {model:{size:36,width:120,decay:8,stop:3},items}
    }
    render(){
        let {model,items} = this.state;
        return (
            <div className='example'>
                <Form
                    inlineLabel={true}
                    model={model}
                    inputs={[
                        {type:'slider',field:'model.size',label:'size',rowKey:'1',start:24,end:72},
                        {type:'html',rowWidth:12,rowKey:'1'},
                        {type:'slider',field:'model.width',label:'width',rowKey:'1',start:80,end:400},
                        {type:'html',rowWidth:12,rowKey:'1'},
                        {type:'slider',field:'model.decay',label:'decay',rowKey:'1',start:0,end:40},
                        {type:'html',rowWidth:12,rowKey:'1'},
                        {type:'slider',field:'model.stop',label:'stop',rowKey:'1',start:0,end:9}
                    ]}
                    onChange={(model)=>this.setState({model})}
                />
                <AIODragList
                    style={{fontSize:12}}
                    items={items}
                    size={model.size}
                    width={model.width}
                    decay={model.decay}
                    stop={model.stop}
                />
            </div>
        )
    }
}