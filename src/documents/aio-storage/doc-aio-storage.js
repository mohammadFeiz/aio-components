import React,{Component} from "react";
import AIOStorage from './../../npm/aio-storage/aio-storage';
import './index.css';
export default class DOC_AIOStorage extends Component{
    constructor(props){
        super(props);
        let Storage = AIOStorage('aiostorageexample');
        let name = Storage.load('name','');
        let age = Storage.load('age','');
        let phone = Storage.load('phone','');
        this.state = {Storage,name,age,phone}
    }
    render(){
        let {goToHome} = this.props;
        let {Storage,name,age,phone} = this.state;
        return (
            <div className='example'>
                <button className='button'
                    onClick={()=>goToHome()}
                >Go To Home</button>
                <div className="aio-components-label">Name</div>
                <input type='text' value={name} onChange={(e)=>this.setState({name:e.target.value})}/>
                <div className="aio-components-label">Age</div>
                <input type='text' value={age} onChange={(e)=>this.setState({age:e.target.value})}/>
                <div className="aio-components-label">Phone</div>
                <input type='text' value={phone} onChange={(e)=>this.setState({phone:e.target.value})}/>
                <br/>
                <button className='button' 
                    onClick={()=>{
                        Storage.save(name,'name');
                        Storage.save(age,'age');
                        Storage.save(phone,'phone');
                    }}
                >Save</button>
                <button className='button'
                    onClick={()=>Storage.export()}
                >export</button>
                <label className='button'>
                    import
                    <input style={{display:'none'}} type='file' onChange={(e)=>{
                        Storage.import(e.target.files[0],()=>{
                            let name = Storage.load('name');
                            let age = Storage.load('age');
                            let phone = Storage.load('phone');
                            this.setState({name,age,phone})
                        })
                    }}/>
                </label>
                <pre>{`
import React,{Component} from "react";
import AIOStorage from 'aio-storage';
import './index.css';
export default class App extends Component{
    constructor(props){
        super(props);
        let Storage = AIOStorage('aiostorageexample');
        let name = Storage.load('name','');
        let age = Storage.load('age','');
        let phone = Storage.load('phone','');
        this.state = {Storage,name,age,phone}
    }
    render(){
        let {Storage,name,age,phone} = this.state;
        return (
            <div className='example'>
                <div className="aio-components-label">Name</div>
                <input type='text' value={name} onChange={(e)=>this.setState({name:e.target.value})}/>
                <div className="aio-components-label">Age</div>
                <input type='text' value={age} onChange={(e)=>this.setState({age:e.target.value})}/>
                <div className="aio-components-label">Phone</div>
                <input type='text' value={phone} onChange={(e)=>this.setState({phone:e.target.value})}/>
                <br/>
                <button className='button' 
                    onClick={()=>{
                        Storage.save(name,'name');
                        Storage.save(age,'age');
                        Storage.save(phone,'phone');
                    }}
                >Save</button>
                <button className='button'
                    onClick={()=>Storage.export()}
                >export</button>
                <label className='button'>
                    import
                    <input style={{display:'none'}} type='file' onChange={(e)=>{
                        Storage.import(e.target.files[0],()=>{
                            let name = Storage.load('name');
                            let age = Storage.load('age');
                            let phone = Storage.load('phone');
                            this.setState({name,age,phone})
                        })
                    }}/>
                </label>
            </div>
        )
    }
}
                `}</pre>
            </div>
        )
    }
}