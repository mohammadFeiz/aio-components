import $ from 'jquery';
export default function AIOSwip({dom,start = ()=>{},move = ()=>{},end = ()=>{},speedX = 1,speedY = 1,stepX = 1,stepY = 1,parameter}){
  let a = {
    init(){
      this.eventHandler(dom,'mousedown',$.proxy(this.mouseDown,this))
    },
    getClient(e){
      let touch = 'ontouchstart' in document.documentElement;
      return touch?{x: e.changedTouches[0].clientX,y:e.changedTouches[0].clientY }:{x:e.clientX,y:e.clientY}
    },
    eventHandler(selector, event, action,type = 'bind'){
      var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" }; 
      event = 'ontouchstart' in document.documentElement ? me[event] : event;
      var element = typeof selector === "string"?(selector === "window"?$(window):$(selector)):selector; 
      element.unbind(event, action); 
      if(type === 'bind'){element.bind(event, action)}
    },
    mouseDown(e){
      this.so = {
        client:this.getClient(e)
      };
      let res = start({mousePosition:{x:this.so.client.x,y:this.so.client.y,parameter}});
      if(res === false){return}
      if(Array.isArray(res)){
        let x = res[0];
        let y = res[1]
        this.so.x = x;
        this.so.y = y;
      }
      this.eventHandler('window','mousemove',$.proxy(this.mouseMove,this));
      this.eventHandler('window','mouseup',$.proxy(this.mouseUp,this))
    },
    mouseMove(e){
      let client = this.getClient(e);
      let dx = client.x - this.so.client.x;
      let dy = client.y - this.so.client.y;
      dx = Math.round(dx * speedX)
      dy = Math.round(dy * speedY)
      dx = Math.floor(dx / stepX) * stepX;
      dy = Math.floor(dy / stepY) * stepY;
      if(dx === this.dx && dy === this.dy){return}
      this.dx = dx;
      this.dy = dy;
      let dist = Math.round(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)))
      this.dist = dist;
      let x,y;
      if(this.so.x !== undefined && this.so.y !== undefined){
        x = this.so.x + dx;
        y = this.so.y + dy;
      }
      move({dx,dy,dist,x,y,parameter});
    },
    mouseUp(){
      this.eventHandler('window','mousemove',this.mouseMove,'unbind');
      this.eventHandler('window','mouseup',this.mouseUp,'unbind');
      end({dx:this.dx,dy:this.dy,dist:this.dist,parameter})
    }
  }
  a.init();
}