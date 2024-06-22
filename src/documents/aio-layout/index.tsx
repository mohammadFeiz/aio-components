import { FC, ReactNode, useState } from "react"
import { SideMenu } from "../../npm/aio-input"
import Icon from "@mdi/react"
import { mdiFile, mdiMenu } from "@mdi/js"
import { Route, Router, Routes, useNavigate } from "react-router-dom"
import './index.css';
type I_nav = {text:string,icon:ReactNode,value:string,path?:string,element?:()=>ReactNode,childs?:I_nav[]}
type I_context = {rootProps:I_AIOLayout,activeNav?:string,setActiveNav:(navId:string)=>void}
const Example:FC = ()=>{
    const navs:I_nav[] = [
        {
            text:'Side menu 0',icon:<Icon path={mdiFile} size={1}/>,value:'0',
            childs:[
                {text:'Side menu 0-0',icon:<Icon path={mdiFile} size={1}/>,value:'part0_0',element:()=><Part0_0/>},
                {text:'Side menu 0-1',icon:<Icon path={mdiFile} size={1}/>,value:'part0_1',element:()=><Part0_1/>},
                {text:'Side menu 0-2',icon:<Icon path={mdiFile} size={1}/>,value:'part0_2',element:()=><Part0_2/>},
                {text:'Side menu 0-3',icon:<Icon path={mdiFile} size={1}/>,value:'part0_3',element:()=><Part0_3/>},
                {text:'Side menu 0-4',icon:<Icon path={mdiFile} size={1}/>,value:'part0_4',element:()=><Part0_4/>}, 
            ]
        },
        {
            text:'Side menu 1',icon:<Icon path={mdiFile} size={1}/>,value:'1',
            childs:[
                {text:'Side menu 1-0',icon:<Icon path={mdiFile} size={1}/>,value:'part1_0',element:()=><Part1_0/>},
                {text:'Side menu 1-1',icon:<Icon path={mdiFile} size={1}/>,value:'part1_1',element:()=><Part1_1/>},
                {text:'Side menu 1-2',icon:<Icon path={mdiFile} size={1}/>,value:'part1_2',element:()=><Part1_2/>},
                {text:'Side menu 1-3',icon:<Icon path={mdiFile} size={1}/>,value:'part1_3',element:()=><Part1_3/>},
                {text:'Side menu 1-4',icon:<Icon path={mdiFile} size={1}/>,value:'part1_4',element:()=><Part1_4/>}, 
            ]
        },
        {
            text:'Side menu 2',icon:<Icon path={mdiFile} size={1}/>,value:'2',
            childs:[
                {text:'Side menu 2-0',icon:<Icon path={mdiFile} size={1}/>,value:'part2_0',element:()=><Part2_0/>},
                {text:'Side menu 2-1',icon:<Icon path={mdiFile} size={1}/>,value:'part2_1',element:()=><Part2_1/>},
                {text:'Side menu 2-2',icon:<Icon path={mdiFile} size={1}/>,value:'part2_2',element:()=><Part2_2/>},
                {text:'Side menu 2-3',icon:<Icon path={mdiFile} size={1}/>,value:'part2_3',element:()=><Part2_3/>},
                {text:'Side menu 2-4',icon:<Icon path={mdiFile} size={1}/>,value:'part2_4',element:()=><Part2_4/>}, 
            ]
        },
        {
            text:'Side menu 3',icon:<Icon path={mdiFile} size={1}/>,value:'3',
            childs:[
                {text:'Side menu 3-0',icon:<Icon path={mdiFile} size={1}/>,value:'part3_0',element:()=><Part3_0/>},
                {text:'Side menu 3-1',icon:<Icon path={mdiFile} size={1}/>,value:'part3_1',element:()=><Part3_1/>},
                {text:'Side menu 3-2',icon:<Icon path={mdiFile} size={1}/>,value:'part3_2',element:()=><Part3_2/>},
                {text:'Side menu 3-3',icon:<Icon path={mdiFile} size={1}/>,value:'part3_3',element:()=><Part3_3/>},
                {text:'Side menu 3-4',icon:<Icon path={mdiFile} size={1}/>,value:'part3_4',element:()=><Part3_4/>}, 
            ]
        },
        {
            text:'Side menu 4',icon:<Icon path={mdiFile} size={1}/>,value:'4',
            childs:[
                {text:'Side menu 4-0',icon:<Icon path={mdiFile} size={1}/>,value:'part4_0',element:()=><Part4_0/>},
                {text:'Side menu 4-1',icon:<Icon path={mdiFile} size={1}/>,value:'part4_1',element:()=><Part4_1/>},
                {text:'Side menu 4-2',icon:<Icon path={mdiFile} size={1}/>,value:'part4_2',element:()=><Part4_2/>},
                {text:'Side menu 4-3',icon:<Icon path={mdiFile} size={1}/>,value:'part4_3',element:()=><Part4_3/>},
                {text:'Side menu 4-4',icon:<Icon path={mdiFile} size={1}/>,value:'part4_4',element:()=><Part4_4/>}, 
            ]
        },
        {
            text:'Side menu 5',icon:<Icon path={mdiFile} size={1}/>,value:'5',
            childs:[
                {text:'Side menu 5-0',icon:<Icon path={mdiFile} size={1}/>,value:'part5_0',element:()=><Part5_0/>},
                {text:'Side menu 5-1',icon:<Icon path={mdiFile} size={1}/>,value:'part5_1',element:()=><Part5_1/>},
                {text:'Side menu 5-2',icon:<Icon path={mdiFile} size={1}/>,value:'part5_2',element:()=><Part5_2/>},
                {text:'Side menu 5-3',icon:<Icon path={mdiFile} size={1}/>,value:'part5_3',element:()=><Part5_3/>},
                {text:'Side menu 5-4',icon:<Icon path={mdiFile} size={1}/>,value:'part5_4',element:()=><Part5_4/>}, 
            ]
        },
        {
            text:'Side menu 6',icon:<Icon path={mdiFile} size={1}/>,value:'6',
            childs:[
                {text:'Side menu 6-0',icon:<Icon path={mdiFile} size={1}/>,value:'part6_0',element:()=><Part6_0/>},
                {text:'Side menu 6-1',icon:<Icon path={mdiFile} size={1}/>,value:'part6_1',element:()=><Part6_1/>},
                {text:'Side menu 6-2',icon:<Icon path={mdiFile} size={1}/>,value:'part6_2',element:()=><Part6_2/>},
                {text:'Side menu 6-3',icon:<Icon path={mdiFile} size={1}/>,value:'part6_3',element:()=><Part6_3/>},
                {text:'Side menu 6-4',icon:<Icon path={mdiFile} size={1}/>,value:'part6_4',element:()=><Part6_4/>}, 
            ]
        },
        {
            text:'Side menu 7',icon:<Icon path={mdiFile} size={1}/>,value:'7',
            childs:[
                {text:'Side menu 7-0',icon:<Icon path={mdiFile} size={1}/>,value:'part7_0',element:()=><Part7_0/>},
                {text:'Side menu 7-1',icon:<Icon path={mdiFile} size={1}/>,value:'part7_1',element:()=><Part7_1/>},
                {text:'Side menu 7-2',icon:<Icon path={mdiFile} size={1}/>,value:'part7_2',element:()=><Part7_2/>},
                {text:'Side menu 7-3',icon:<Icon path={mdiFile} size={1}/>,value:'part7_3',element:()=><Part7_3/>},
                {text:'Side menu 7-4',icon:<Icon path={mdiFile} size={1}/>,value:'part7_4',element:()=><Part7_4/>}, 
            ]
        },
        {
            text:'Side menu 8',icon:<Icon path={mdiFile} size={1}/>,value:'8',
            childs:[
                {text:'Side menu 8-0',icon:<Icon path={mdiFile} size={1}/>,value:'part8_0',element:()=><Part8_0/>},
                {text:'Side menu 8-1',icon:<Icon path={mdiFile} size={1}/>,value:'part8_1',element:()=><Part8_1/>},
                {text:'Side menu 8-2',icon:<Icon path={mdiFile} size={1}/>,value:'part8_2',element:()=><Part8_2/>},
                {text:'Side menu 8-3',icon:<Icon path={mdiFile} size={1}/>,value:'part8_3',element:()=><Part8_3/>},
                {text:'Side menu 8-4',icon:<Icon path={mdiFile} size={1}/>,value:'part8_4',element:()=><Part8_4/>}, 
            ]
        },
    ]
    return <AIOLayout navs={navs}/>
}
export default Example;
type I_AIOLayout = {navs:I_nav[]}
const AIOLayout:FC<I_AIOLayout> = (props)=>{
    const {navs} = props;
    const [activeNav,setActiveNav] = useState<string>()
    function getRoutes(){
        let routes:ReactNode[] = []
        getRoutes_req(navs,routes)
        return routes
    }
    function getRoutes_req(list:I_nav[],routes:ReactNode[],parentKey?:string){
        for(let i = 0; i < list.length; i++){
            const {element,value,childs = []} = list[i];
            const key = `${parentKey || 'root'}-${i}`;
            if(element){routes.push(<Route key={key} path={`/${value}`} element={element()}/>)}
            if(childs.length){getRoutes_req(childs,routes,key)}
        }
    }
    const context:I_context = {rootProps:props,activeNav,setActiveNav}
    return (
        <div className="aio-layout-container">
            <div className="aio-layout">
            <AIOLayoutHeader context={context}/>
            <div className="aio-layout-body">
                <AIOLayoutSideNav context={context}/>
                <div className="aio-layout-content">
                    <Routes>{getRoutes()}</Routes>
                </div>
            </div>
        </div>
        </div>
    )
}
const AIOLayoutHeader:FC<{context:I_context}> = ({context})=>{
    const side = {
        
    }
    return (
        <div className="aio-layout-header">
            {!!side && <div className='aio-layout-side-button'><Icon path={mdiMenu} size={1}/></div>}
        </div>
    )
}
const AIOLayoutSideNav:FC<{context:I_context}> = ({context})=>{
    const {rootProps} = context;
    const {navs} = rootProps;
    const navigate = useNavigate();
    return (
        <div className="aio-layout-side">
            <SideMenu
                items={navs}
                onChange={(option:I_nav)=>navigate(option.value)}       
            />
            
        </div>
    )
}
const Part0_0:FC = ()=>{
    return (
        <div className=''>0-0</div>
    )
}
const Part0_1:FC = ()=>{
    return (
        <div className=''>0-1</div>
    )
}
const Part0_2:FC = ()=>{
    return (
        <div className=''>0-2</div>
    )
}
const Part0_3:FC = ()=>{
    return (
        <div className=''>0-3</div>
    )
}
const Part0_4:FC = ()=>{
    return (
        <div className=''>0-4</div>
    )
}
const Part1_0:FC = ()=>{
    return (
        <div className=''>1-0</div>
    )
}
const Part1_1:FC = ()=>{
    return (
        <div className=''>1-1</div>
    )
}
const Part1_2:FC = ()=>{
    return (
        <div className=''>1-2</div>
    )
}
const Part1_3:FC = ()=>{
    return (
        <div className=''>1-3</div>
    )
}
const Part1_4:FC = ()=>{
    return (
        <div className=''>1-4</div>
    )
}
const Part2_0:FC = ()=>{
    return (
        <div className=''>2-0</div>
    )
}
const Part2_1:FC = ()=>{
    return (
        <div className=''>2-1</div>
    )
}
const Part2_2:FC = ()=>{
    return (
        <div className=''>2-2</div>
    )
}
const Part2_3:FC = ()=>{
    return (
        <div className=''>2-3</div>
    )
}
const Part2_4:FC = ()=>{
    return (
        <div className=''>2-4</div>
    )
}
const Part3_0:FC = ()=>{
    return (
        <div className=''>3-0</div>
    )
}
const Part3_1:FC = ()=>{
    return (
        <div className=''>3-1</div>
    )
}
const Part3_2:FC = ()=>{
    return (
        <div className=''>3-2</div>
    )
}
const Part3_3:FC = ()=>{
    return (
        <div className=''>3-3</div>
    )
}
const Part3_4:FC = ()=>{
    return (
        <div className=''>3-4</div>
    )
}
const Part4_0:FC = ()=>{
    return (
        <div className=''>4-0</div>
    )
}
const Part4_1:FC = ()=>{
    return (
        <div className=''>4-1</div>
    )
}
const Part4_2:FC = ()=>{
    return (
        <div className=''>4-2</div>
    )
}
const Part4_3:FC = ()=>{
    return (
        <div className=''>4-3</div>
    )
}
const Part4_4:FC = ()=>{
    return (
        <div className=''>4-4</div>
    )
}
const Part5_0:FC = ()=>{
    return (
        <div className=''>5-0</div>
    )
}
const Part5_1:FC = ()=>{
    return (
        <div className=''>5-1</div>
    )
}
const Part5_2:FC = ()=>{
    return (
        <div className=''>5-2</div>
    )
}
const Part5_3:FC = ()=>{
    return (
        <div className=''>5-3</div>
    )
}
const Part5_4:FC = ()=>{
    return (
        <div className=''>5-4</div>
    )
}
const Part6_0:FC = ()=>{
    return (
        <div className=''>6-0</div>
    )
}
const Part6_1:FC = ()=>{
    return (
        <div className=''>6-1</div>
    )
}
const Part6_2:FC = ()=>{
    return (
        <div className=''>6-2</div>
    )
}
const Part6_3:FC = ()=>{
    return (
        <div className=''>6-3</div>
    )
}
const Part6_4:FC = ()=>{
    return (
        <div className=''>6-4</div>
    )
}
const Part7_0:FC = ()=>{
    return (
        <div className=''>7-0</div>
    )
}
const Part7_1:FC = ()=>{
    return (
        <div className=''>7-1</div>
    )
}
const Part7_2:FC = ()=>{
    return (
        <div className=''>7-2</div>
    )
}
const Part7_3:FC = ()=>{
    return (
        <div className=''>7-3</div>
    )
}
const Part7_4:FC = ()=>{
    return (
        <div className=''>7-4</div>
    )
}
const Part8_0:FC = ()=>{
    return (
        <div className=''>8-0</div>
    )
}
const Part8_1:FC = ()=>{
    return (
        <div className=''>8-1</div>
    )
}
const Part8_2:FC = ()=>{
    return (
        <div className=''>8-2</div>
    )
}
const Part8_3:FC = ()=>{
    return (
        <div className=''>8-3</div>
    )
}
const Part8_4:FC = ()=>{
    return (
        <div className=''>8-4</div>
    )
}




