import React,{Component} from 'react';
import AIOInput from './../../npm/aio-input/aio-input';
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
                <AIOInput
                    type='form'
                    value={model}
                    inputs={{
                        row:[
                            {input:{type:'slider',start:24,end:72},field:'value.size',inlineLabel:'size'},
                            {input:{type:'slider',start:80,end:400},field:'value.width',inlineLabel:'width'},
                            {input:{type:'slider',start:0,end:40},field:'value.decay',inlineLabel:'decay'},
                            {input:{type:'slider',start:0,end:9},field:'value.stop',inlineLabel:'stop'}
                        ]
                    }}
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