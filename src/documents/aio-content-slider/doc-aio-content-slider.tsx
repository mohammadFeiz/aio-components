import React,{Component, useState} from "react";
import DOC from '../../resuse-components/doc.tsx';
import ACS from '../../npm/aio-content-slider/index.tsx';
import AIODoc from './../../npm/aio-documentation/aio-documentation.js';
import AIOInput from './../../npm/aio-input/index.tsx';
import { AI } from "../../npm/aio-input/types.tsx";
export default function DOC_AIOContentSlider(props){
  return (
    <DOC
      name={props.name} goToHome={props.goToHome}
      nav={{
        items:()=>[
          {text:'example',id:'example',render:()=><Preview/>}
        ]
      }}
    />
  )
}

function Preview(){
    let [setting,setSetting] = useState<{speed:number,autoSlide:number}>({speed:80,autoSlide:4000});
    function setting_node(){
      let p:AI = {
        type:'form',style:{marginBottom:12},
        value:{...setting},
        onChange:(setting)=>{
          setSetting(setting)
        },
        inputs:{
          className:'gap-12',
          row:[
            {input:{type:'number',after:'between 1 and 99',swip:true,min:1,max:99},label:'speed',field:'value.speed'},
            {input:{type:'number',after:'miliseconds',swip:8},label:'autoSlide',field:'value.autoSlide'},
          ]
        }
      }
      return (<AIOInput {...p}/>)
    }
    function slide_node(){
      let p = {
        items:[
          <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
          <img src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1803636316.1701302400&semt=sph" width='100%'/>
          </div>,
          <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
          <img src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1803636316.1701302400&semt=sph" width='100%'/>
          </div>,
          <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
          <img src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1803636316.1701302400&semt=sph" width='100%'/>
          </div>,
        ],
        speed:setting.speed,
        autoSlide:setting.autoSlide
      }
      return <ACS {...p} key={'a' + setting.speed + setting.autoSlide}/>
    }
    return (
      <div className='example'>
        {setting_node()}
        {slide_node()}
      {
        AIODoc().Code(
`return (
  <ACS
    items={[
      <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
      <img src="https://media.slidesgo.com/storage/15750445/futuristic-background-infographics1640619679.jpg" width='100%'/>
      </div>,
      <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
      <img src="https://media.slidesgo.com/storage/92014/upload.png" width='100%'/>
      </div>,
      <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',}}>
      <img src="https://media.slidesgo.com/storage/23211385/cyber-futuristic-ai-technology-thesis-defense1658931324.jpg" width='100%'/>
      </div>,
    ]}
    speed={${setting.speed}}
    autoSlide={${setting.autoSlide}}
  />
)`
        )
      }
      </div>
    )
}