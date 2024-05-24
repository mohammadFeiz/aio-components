import React, { useState } from "react";
import Canvas from "./npm/aio-canvas";
import { I_canvas_item } from "./npm/aio-canvas/types";
import { Link, Navigate } from "react-router-dom";
function Test(props:any) {
    let [CTX] = useState(new Canvas())
    let [remote] = useState(new Remote())
    return (
        <>
        <button style={{position:'absolute',top:30}} onClick={props.goToHome}>Home</button>
        {
            CTX.render({
                attrs:{
                    style:{width:1000,height:1000}
                },
                items:[
                    remote.container()
                ]
            })
        }
        </>
        
    );
}

export default Test;

class Remote{
    container = ():I_canvas_item=>{
        return {
            type:'Group',
            items:[
                {type:'Rectangle',width:220,height:300,x:-6,y:-260,corner:6,fill:'#666'},
                this.header(),
                this.buttonRow('P.Mode','S.Mode','ASPECT',{y:-50}),
                this.buttonRow('AUDIO','FREEZE','SUBTITLE',{y:-84}),
                this.numbers()
            ]
        }
    }
    numbers = ():I_canvas_item=>{
        return {
            type:'Group',
            items:new Array(3).fill(0).map((o,row)=>{
                return {
                    type:'Group',
                    items:new Array(3).fill(0).map((o,col)=>{
                        return this.button1((row * 3) + col + 1,{x:col*76})
                    }),
                    y:-134 - (row * 50)
                }
            })
        }
    }
    header = ():I_canvas_item=>{
        return {
            type:'Group',
            items:[
                this.button('SOURCE'),
                this.power({x:106,y:10}),
                this.button('MUTE',{x:150}),
                
            ]
        }
    }
    button = (text:string,p?:any):I_canvas_item=>{
        return {
            type:'Group',
            items:[
                {type:'Rectangle',height:20,width:60,fill:'#444',corner:4},
                {type:'Text',text,x:30,y:10,fill:'#fff',fontSize:10}
            ],
            ...p
        }
    }
    button1 = (text:any,p?:any):I_canvas_item=>{
        return {
            type:'Group',fill:'transparent',events:{onClick:()=>alert(text)},
            items:[
                {type:'Rectangle',height:36,width:56,fill:'#444',corner:4},
                {type:'Text',text,x:30,y:17,fill:'#fff',fontSize:28}
            ],
            ...p
        }
    }
    buttonRow = (text1:any,text2:any,text3:any,p?:any):I_canvas_item=>{
        return {
            type:'Group',
            items:[
                this.button(text1),
                this.button(text2,{x:75}),
                this.button(text3,{x:150}), 
            ],
            ...p
        }
    }
    power = (p?:any):I_canvas_item=>{
        return {
            type:'Group',
            items:[
                {type:'Arc',r:22,fill:'#aaa'},
                {type:'Arc',r:20,fill:'#444'},
                {type:'Arc',r:10,stroke:'red',slice:[20,340],rotate:90,lineWidth:2},
                {type:'Rectangle',width:2,height:14,fill:'red',x:-1}
            ],
            ...p
        }
    }
}