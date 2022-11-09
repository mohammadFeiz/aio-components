import React,{Component} from "react";
import PropsList from "./props-list";
import RSA from './../npm/react-super-app/react-super-app';
export default class DOC extends Component{
    constructor(props){
        super(props);
        this.propsList = props.propsList;
        this.state = {}
    }
    getNavById(id){
        let {navs} = this.props;
        this.res = false;
        this.getNavById_req(navs,id);
        return this.res;
    }
    getNavById_req(navs,id){
        if(this.res){return;}
        for(let i = 0; i < navs.length; i++){
            if(this.res){return;}
            let nav = navs[i];
            if(nav.id === id){this.res = nav; break;}
            if(nav.navs){this.getNavById_req(nav.navs,id);}
        }
    }
    render(){
        let {name,navs,goToHome,navId} = this.props;
        return (
            <RSA
                navs={navs}
                navId={navId}
                body={({navId})=>{
                    if(navId === 'props'){return <PropsList props={this.propsList}/>}
                    let nav = this.getNavById(navId);
                    return nav.COMPONENT()
                }}
                navHeader={()=><div className='part-title'>{name}</div>}
                getActions={(obj)=>this.setState(obj)}
                header={()=><button onClick={()=>goToHome()}>Home</button>}
            />
        )
    }
}