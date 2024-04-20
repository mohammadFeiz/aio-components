import React,{Component} from "react";
import AIOStorage from './../../npm/aio-storage/aio-storage';
import RVD,{animate} from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from './../../npm/aio-input/index.tsx';
import './index.css';
export default class DOC_AIOStorage extends Component{
    constructor(props){
        super(props);
        let Storage = AIOStorage('my storage');
        this.Storage = Storage;
        let list = Storage.load({name:'list',def:[],time: 6000 * 1000});
        this.state = {list,name:'',age:''}
    }
    componentDidMount(){
        //$('.msf').animate({height:0},1000)
    }
    item_layout({name,age,id}){
        return {
            style:{background:'lightblue',padding:12,borderRadius:6},
            attrs:{id:'a' + id,key:id},
            row:[
                {
                    column:[
                        {flex:1,html:`name:${name}`},
                        {flex:1,html:`age:${age}`},
                    ]
                },
                {flex:1},
                {size:48,html:'X',onClick:()=>this.remove(id),className:'align-vh'}
            ]
        }
    }
    add(){
        let {list,name,age} = this.state;
        list.push({name,age,id:Math.round(Math.random() * 1000000)});
        this.Storage.save({name:'list',value:list});
        this.setState({list})
    }
    remove(id){
        animate('removeV','#a' + id,()=>{
            let {list} = this.state;
            let newList = list.filter((o)=>o.id !== id);
            this.Storage.save({name:'list',value:newList});
            this.setState({list:newList});
        })
    }
    removeAll(){
        this.Storage.remove({name:'list'})
        this.setState({list:this.Storage.load({name:'list',def:[]})})
    }
    render(){
        let {list,name,age} = this.state;
        let {goToHome} = this.props;
        return (
            <RVD
                rootNode={{
                    style:{width:'50%',marginLeft:'25%',border:'1px solid',padding:12},
                    column:[
                        {html:'exit',className:'align-v',size:48,onClick:()=>goToHome()},
                        {html:'Add Member',className:'align-v',size:48},
                        {html:'name',className:'align-v'},               
                        {
                            row:[
                                {html:<input type='text' value={name} onChange={(e)=>this.setState({name:e.target.value})}/>,className:'align-v'},
                            ]
                        },
                        {html:'age',className:'align-v'},               
                        {
                            row:[
                                {html:<input type='text' value={age} onChange={(e)=>this.setState({age:e.target.value})}/>},
                            ]
                        },
                        {size:12},
                        {html:<button onClick={()=>this.add()}>Add</button>},
                        {html:<button onClick={()=>this.removeAll()}>Remove All</button>},
                        {html:<button onClick={()=>this.Storage.export()}>Export</button>},
                        {html:<AIOInput text='Import' type='file' onChange={(files)=>{
                            this.Storage.import({file:files[0],callback:()=>{
                                let list = this.Storage.load({name:'list',def:[]});
                                this.setState({list,name:'',age:''})
                            }});
                        }}/>},
                        {size:12},
                        {html:'Members',className:'align-v',size:48},
                        {gap:{size:12},column:list.map((o)=>this.item_layout(o))}
                    ]
                }}
            />
        )
    }
}