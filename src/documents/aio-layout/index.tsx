import { FC, ReactNode, useEffect, useState } from "react"
import { SideMenu } from "../../npm/aio-input"
import Icon from "@mdi/react"
import { mdiAccount, mdiAttachment, mdiFile, mdiMenu, mdiStar } from "@mdi/js"
import { Route, Router, Routes, useLocation, useNavigate } from "react-router-dom"
import './index.css';
import { AddToAttrs } from "../../npm/aio-utils"
import AIOPopup from "../../npm/aio-popup"
type I_nav = {
    items:I_navItem[],
    hover:boolean,
    header?:ReactNode,
    footer?:ReactNode,
}
type I_side = {
    items:I_sideItem[],
    header?:ReactNode,
    footer?:ReactNode,
    attrs?:any
}
type I_header = {title?:(activeNav:I_navItem | undefined)=>React.ReactNode,before?:ReactNode,after?:ReactNode}
type I_sideItem = {text:ReactNode,icon:ReactNode,onClick?:()=>void,show?:()=>boolean,attrs?:any}
type I_bottomMenu = {items:I_navItem[]}
type I_navItem = {text:ReactNode,icon:ReactNode,value:string,path?:string,element?:()=>ReactNode,childs?:I_navItem[],show?:()=>boolean,attrs?:any}
type I_context = {
    rootProps:I_AIOLayout,
    activeNav?:I_navItem,
    popup:AIOPopup,
    openSide:()=>void,
    onNav:(navItem:I_navItem)=>void
}
const Example:FC = ()=>{
    const navItems:I_navItem[] = [
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
    const bottomMenu:I_navItem[] = [
        {text:'Side menu 0-0',icon:<Icon path={mdiFile} size={1}/>,value:'part0_0',element:()=><Part0_0/>},
        {text:'Side menu 0-1',icon:<Icon path={mdiFile} size={1}/>,value:'part0_1',element:()=><Part0_1/>},
        {text:'Side menu 0-2',icon:<Icon path={mdiFile} size={1}/>,value:'part0_2',element:()=><Part0_2/>},
        {text:'Side menu 0-3',icon:<Icon path={mdiFile} size={1}/>,value:'part0_3',element:()=><Part0_3/>},
        {text:'Side menu 0-4',icon:<Icon path={mdiFile} size={1}/>,value:'part0_4',element:()=><Part0_4/>},
    ]
    return (
        <AIOLayout 
            nav={{items:navItems,hover:true}} 
            bottomMenu={{items:bottomMenu}}
            header={{
                after:(
                    <div className="flex-row align-v p-h-12 gap-12">
                        <Icon path={mdiAccount} size={0.8}/>
                        <Icon path={mdiAttachment} size={0.8}/>
                        <Icon path={mdiStar} size={0.8}/>
                    </div>
                ),
                before:<Icon path={mdiAccount} size={1}/>
            }}
        />
    )
}
export default Example;
type I_AIOLayout = {nav?:I_nav,bottomMenu?:I_bottomMenu,side?:I_side,header?:I_header,rtl?:boolean}
const AIOLayout:FC<I_AIOLayout> = (props)=>{
    const [activeNav,SetActiveNav] = useState<I_navItem>();
    const [popup] = useState<AIOPopup>(new AIOPopup({rtl:props.rtl}));
    const location = useLocation()
    const navigate = useNavigate();
    function openSide(){
        popup.addModal({
            position:props.rtl?'right':'left',
            body:()=><Sidebar context={context}/>
        })
    }
    function onNav(navItem:I_navItem){
        navigate(navItem.value); 
        SetActiveNav(navItem);
    }
    function setActiveNav(){
        const activeNav = findNavItem();
        SetActiveNav(activeNav === false?undefined:activeNav)
    }
    function findNavItem():I_navItem | false{
        const {nav} = props;
        if(!nav){return false}
        const {items = []} = nav;
        const res:I_navItem | undefined = findNavItem_req(items)
        if(res === undefined){return false}
        return res
    }
    function findNavItem_req(items:I_navItem[]):I_navItem | undefined{
        for(let i = 0; i < items.length; i++){
            const item = items[i]
            const pathnames = location.pathname.split('/');
            if(pathnames.includes(item.value)){
                return item
            }
            if(item.childs && item.childs.length){
                const res:I_navItem | undefined = findNavItem_req(item.childs)
                if(res){return res}
            }
        }
    }
    const context:I_context = {rootProps:props,activeNav,popup,openSide,onNav}
    
    useEffect(()=>{
        setActiveNav()
    },[location,props.nav?.items])
    return (
        <>
            <div className="aio-layout-container">
                <div className="aio-layout">
                    <AIOLayoutHeader context={context}/>
                    <AIOLayoutBody context={context}/>
                    <AIOLayoutFooter context={context}/>
                </div>
            </div>
            {popup.render()}
        </>
    )
}
const AIOLayoutHeader:FC<{context:I_context}> = ({context})=>{
    const {rootProps,activeNav} = context;
    const {side,header = {}} = rootProps;
    const {title = ()=>'',after,before} = header;
    const Title = title(activeNav) || activeNav?.text
    return (
        <div className="aio-layout-header">
            {!!side && <div className='aio-layout-side-button'><Icon path={mdiMenu} size={1}/></div>}
            {!side && <div></div>}
            {!!before && before}
            <div className="aio-layout-header-title">{Title || ''}</div>
            {!!after && after}
        </div>
    )
}
const AIOLayoutBody:FC<{context:I_context}> = ({context})=>{
    const {rootProps} = context;
    const {nav,bottomMenu} = rootProps
    function getRoutes(items:I_navItem[] = []){
        if(!items.length){return []}
        let routes:ReactNode[] = []
        getRoutes_req(items,routes)
        return routes
    }
    function getRoutes_req(list:I_navItem[],routes:ReactNode[],parentKey?:string){
        for(let i = 0; i < list.length; i++){
            const {element,value,childs = [],show = ()=>true} = list[i];
            if(show() === false){continue}
            const key = `${parentKey || 'root'}-${i}`;
            if(element){routes.push(<Route key={key} path={`/${value}`} element={element()}/>)}
            if(childs.length){getRoutes_req(childs,routes,key)}
        }
    }
    return (
        <div className="aio-layout-body">
            <AIOLayoutSideNav context={context}/>
            <div className="aio-layout-content">
                <Routes>{getRoutes(nav?.items)}{getRoutes(bottomMenu?.items)}</Routes>
            </div>
        </div>
    )
}
const AIOLayoutFooter:FC<{context:I_context}> = ({context})=>{
    const {rootProps,onNav} = context;
    const {bottomMenu} = rootProps;
    if(!bottomMenu){return null}
    const {items = []} = bottomMenu;
    const cls = 'aio-layout-bottom-menu'
    return (
        <div className={cls}>
            {
                items.map((o:I_navItem)=>{
                    const {icon,text,value,attrs = {}} = o;
                    const Attrs = AddToAttrs(attrs,{className:`${cls}-item`,attrs:{onClick:()=>onNav(o)}})
                    return (
                        <div {...Attrs}>
                            <div className={`${cls}-item-icon`}>{icon}</div>
                            <div className={`${cls}-item-text`}>{text}</div>
                        </div>
                    )
                })
            }
            
        </div>
    )
}
const AIOLayoutSideNav:FC<{context:I_context}> = ({context})=>{
    const {rootProps,onNav} = context;
    const {nav} = rootProps;
    if(!nav){return null}
    return (
        <div className='aio-layout-side'>
            {!!nav.header && <div className="aio-layout-nav-header">{nav.header}</div>}
            <SideMenu
                items={nav.items}
                hover={nav.hover}
                onChange={(option:I_navItem)=>onNav(option)}   
                option={{
                    attrs:(option:any)=>option.attrs
                }}    
            />
            {!!nav.footer && <div className="aio-layout-nav-footer">{nav.footer}</div>}
        </div>
    )
}
const Sidebar:FC<{context:I_context}> = ({context}) => {
    const {rootProps} = context;
    const {side} = rootProps;
    if(!side){return null}
    let { attrs = {},header,items,footer } = side;
    function header_node():ReactNode {
      if (!header) { return null }
      return (<div className="aio-layout-sidebar-header">{header}</div>)
    }
    function items_node():ReactNode {
      return (
        <div className="aio-layout-sidebar-items">
          {
            items.map((o, i) => {
              let { icon = () => <div style={{ width: 12 }}></div>, text, attrs = {}, onClick = () => { }, show = () => true } = o;
              let Show = show();
              if(Show === false){return null}
              return (
                <div className={'aio-layout-sidebar-item' + (attrs.className ? ' ' + attrs.className : '')} style={attrs.style} onClick={()=>{onClick()}}>
                  <div className="aio-layout-sidebar-item-icon">{typeof icon === 'function'?icon():icon}</div>
                  <div className="aio-layout-sidebar-item-text">{text}</div>
                </div>
              )
            })
          }
        </div>
      )
    }
    function footer_node():ReactNode {
      if (!footer) { return null }
      return (
        <div className="aio-layout-sidebar-footer">{footer}</div>
      )
    }
    return (
      <div {...attrs} className={'aio-layout-sidebar' + (attrs.className ? ' ' + attrs.className : '')}>
        {header_node()} {items_node()} {footer_node()}
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




