import React,{Component} from "react";
import PropsList from "./props-list";
import RSA from './../npm/react-super-app/react-super-app';
export default class DOC extends Component{
    constructor(props){
        super(props);
        this.propsList = props.propsList;
        this.state = {
            rsa:new RSA({
                id:props.id,
                nav:{...props.nav,cache:true,header:()=><div className='part-title'>{props.name}</div>},
                body:({navId,render})=>{
                    if(navId === 'props'){return <PropsList props={this.propsList}/>}
                    return render()
                },
                headerContent:()=><button id='go-to-home' onClick={()=>props.goToHome()}>Home</button>
            })}
    }
    render(){
        let {rsa} = this.state;
        return rsa.render()
    }
}