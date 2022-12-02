import React,{Component} from 'react';
import Floater from './../../npm/aio-floater/aio-floater';
import Slider from './../../npm/aio-slider/aio-slider';
import $ from 'jquery';
import './index.css';
export default class Puzzle extends Component{
  constructor(props){
    super(props);
    var {zoom} = this.props;
    this.state = {zoom,screen:[0,0],items:[],coords:false,puzzleItems:[]};
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  }
  change(changes,itemsDictionary){
    this.setedIds = {};
    for(let id in itemsDictionary){
      this.setGroup(id,itemsDictionary)
    }
    this.setState({items:this.state.items});
  }
  setGroup(id,itemsDictionary){
    let item = itemsDictionary[id];
    if(this.setedIds[id]){return;}
    this.setedIds[id] = true;
    item.group = item.group || Math.random().toString();
    let Left = itemsDictionary[item.leftId];
    let Right = itemsDictionary[item.rightId];
    let Up = itemsDictionary[item.upId];
    let Down = itemsDictionary[item.downId];
    if(Left && Left.top === item.top && Left.left + this.sliceWidth === item.left){
      Left.group = item.group;
      this.setGroup(Left.id,itemsDictionary);
    }
    if(Right && Right.top === item.top && Right.left - this.sliceWidth === item.left){
      Right.group = item.group;
      this.setGroup(Right.id,itemsDictionary);
    }
    if(Up && Up.left === item.left && Up.top + this.sliceHeight === item.top){
      Up.group = item.group;
      this.setGroup(Up.id,itemsDictionary);
    }
    if(Down && Down.left === item.left && Down.top - this.sliceHeight === item.top){
      Down.group = item.group;
      this.setGroup(Down.id,itemsDictionary);
    }
  }
  listItemClick(item){item.show = true; this.setState({items:this.state.items})}
  getItems(){
    var {x,y,src} = this.props;
    var result = [];
    let {imageWidth:iw,imageHeight:ih,sliceWidth:sw,sliceHeight:sh,listItemWidth:liw,listItemHeight:lih} = this;
    for(let i = 0; i < y; i++){
      for(let j = 0; j < x; j++){
        let item = {
          show:false,
          j,i,
          id:j + '-' + i,
          leftId:(j - 1) + '-' + i,rightId:(j + 1) + '-' + i,upId:j + '-' + (i - 1),downId:j + '-' + (i + 1),
          template:'slice',
          listItem:(
            <div 
              draggable={false} 
              onDragStart={(e)=>e.preventDefault()} 
              style={{
                width:this.listItemWidth,
                height:this.listItemHeight,
                backgroundImage:`url(${src})`,
                backgroundSize:`${(liw / sw) * iw}px ${(lih / sh) * ih}px`,
                backgroundPosition:`${-j * Math.floor(((liw / sw) * iw) / x)}px ${-i * Math.floor((lih / sh) * ih / y)}px`
              }} 
              onClick={()=>this.listItemClick(item)}
            ></div>
          )
        };
        result.splice(Math.floor(Math.random() * result.length),0,item);
      }  
    }
    return result;
  }
  componentDidMount(){
    var {x,y,size} = this.props;
    var img = document.getElementById("msf");
    this.imageWidth = img.width;
    this.imageHeight = img.height;
    this.sliceWidth = Math.floor(this.imageWidth / x);
    this.sliceHeight = Math.floor(this.imageHeight / y);
    this.listItemWidth = size * this.sliceWidth / this.sliceHeight;
    this.listItemHeight = size;
    var items = this.getItems();
    this.mounted = true;
    this.setState({items});
  }
  SetState(obj){this.setState(obj)}
  render(){
    var {onExit,src} = this.props;
    if(!this.mounted){return <img id='msf' src={src} alt={''} style={{display:'none'}}/>}
    var {items} = this.state;
    return (
      <div className="puzzle">
        <div className='list'>
          {
            items.filter((item)=>item.show === false).map((item,i)=>{
              return <div 
                key={i} className='list-item' draggable={true}
                style={{width:this.listItemWidth,height:this.listItemHeight}}
                onDragStart={(e)=>{this.item = item; $(e.target).css({pointsEvents:'none'})}}
              >{item.listItem}</div>
            })
          }
        </div>
        {
          items.length > 0 &&
          <Floater
            templates={{
                slice:({j,i})=>{
                    let {src} = this.props;
                    return (
                        <div 
                            className='img' draggable={false} 
                            onDragStart={(e)=>e.preventDefault()} 
                            style={{
                                width:this.sliceWidth,height:this.sliceHeight,
                                backgroundImage:`url(${src})`,
                                backgroundPosition:`${-j * this.sliceWidth}px ${-i * this.sliceHeight}px`
                            }}
                        ></div>
                    )
                }
            }}
            onChange={this.change.bind(this)}
            items={items}
            getMousePosition={(mousePosition)=>this.mousePosition = mousePosition}
            snap={[this.sliceWidth,this.sliceHeight]}
            moveHandleClassName='img'
            onDragOver={(e)=>e.preventDefault()}
            onDrop={(e,[x,y],obj)=>{
              let left = Math.floor(x / this.sliceWidth) * this.sliceWidth;
              let top = Math.floor(y / this.sliceHeight) * this.sliceHeight;
              this.item.show = true;
              this.item.left = left;
              this.item.top = top;
              obj[this.item.id] = this.item;
              this.change([this.item],obj);
              //this.setState({items:this.state.items})
            }}
          />
        } 
        <Toolbar SetState={this.SetState.bind(this)} onExit={onExit}/>
      </div>
    )
  }
}
Puzzle.defaultProps = {zoom:1,size:120}

class Toolbar extends Component{
  render(){
    var {SetState,onExit,zoom} = this.props;
    return (
      <div className='toolbar'>
        <div className='toolbar-item' onClick={()=>onExit()}>Main Menu</div>  
      </div>
    )
  }
}