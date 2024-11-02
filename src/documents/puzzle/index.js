import React,{Component} from 'react';
import Puzzle from './puzzle';
import './index.css';
export default class App extends Component{
  constructor(props){
    var srcs = [];
    super(props);
    this.state = {srcs,srcIndex:0,browseSrc:false,x:8,y:12,menu:true};
  }
  render(){
    var {browseSrc,x,y,menu,srcs,srcIndex} = this.state;
    return (
      <div className='App'>
        {menu && <Menu {...this.state} SetState={(obj)=>this.setState(obj)}/>}
        {!menu && <Puzzle src={browseSrc || srcs[srcIndex]} x={x} y={y} onExit={()=>this.setState({menu:true})}/>}
      </div>
    )
  }
}
App.defaultProps = {zoom:1,size:120}


class Menu extends Component{
  setFile(files){
    var {SetState} = this.props;
    var fr = new FileReader();
    fr.onload = function () {
      SetState({browseSrc:fr.result})
    }
    fr.readAsDataURL(files[0]); 
  }
  changeImage(){
    var {SetState,srcs,srcIndex} = this.props;
    let newSrcIndex = srcIndex + 1;
    if(newSrcIndex >= srcs.length - 1){newSrcIndex = 0}
    SetState({srcIndex:newSrcIndex,browseSrc:false});
  }
  render(){
    var {x,y,browseSrc,SetState,srcs,srcIndex} = this.props;
    return (
      <div className='menu'>
          <div className='app-name'>Puzzle Game</div>
          <div className='menu-body'>
            <div className='menu-slice'>
              <input type='number' max={30} min={2} value={x} onChange={(e)=>SetState({x:parseInt(e.target.value)})}/>
              <div className='x'>X</div>
              <input type='number' max={30} min={2}value={y} onChange={(e)=>SetState({y:parseInt(e.target.value)})}/>
            </div>
            <div style={{display:'flex',alignItems:'center',height:48}}>
              <label className='menu-button' onClick={()=>this.changeImage()}>Change Image</label>
              <div style={{width:24}}></div>
              <label htmlFor='file' className='menu-button'>Browse Image</label><input type='file' id='file' onChange={(e)=>{this.setFile(e.target.files)}}/>
            </div>
            <div className='menu-image'>
              <div className='select-image'>
                <div className='preview' style={{backgroundImage:`url(${browseSrc || srcs[srcIndex]})`}}></div>
              </div>
            </div>
            <div className='menu-start'>
              <div onClick={()=>SetState({menu:false})}>Start</div>
            </div>
            <div className='menu-about'>
              <p>Powered By ReactJS. Autor : Mohammad Sharif Feiz.</p>
              <p>G-Mail : feiz.ms@gmail.com - Whatsup : +98-912-353-4314</p>
            </div>  
          </div>
        </div>
    )
  }
}
