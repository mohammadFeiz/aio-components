import { FC, ReactNode, useEffect, useState } from "react"
import { SideMenu } from "../../npm/aio-input"
import Icon from "@mdi/react"
import { mdiAccount, mdiAttachment, mdiFile, mdiMenu, mdiStar } from "@mdi/js"
import { Route, Router, Routes, useLocation, useNavigate } from "react-router-dom"
import './index.css';
import './../../documents/aio-input/ui-kit/theme1.css';
import { AddToAttrs } from "../../npm/aio-utils"
import AIOPopup from "../../npm/aio-popup"
type I_nav = {
    items:I_navItem[],
    type:'hover' | 'icon' | 'normal',
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
type I_navItem = {text:ReactNode,icon:ReactNode,value:string,path?:string,element?:()=>ReactNode,items?:I_navItem[],show?:()=>boolean,attrs?:any}
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
            items:[
                {text:'Side menu 0-0',icon:<Icon path={mdiFile} size={1}/>,value:'part0_0',element:()=><Part0_0/>},
                {text:'Side menu 0-1',icon:<Icon path={mdiFile} size={1}/>,value:'part0_1',element:()=><Part0_1/>},
                {text:'Side menu 0-2',icon:<Icon path={mdiFile} size={1}/>,value:'part0_2',element:()=><Part0_2/>},
                {text:'Side menu 0-3',icon:<Icon path={mdiFile} size={1}/>,value:'part0_3',element:()=><Part0_3/>},
                {text:'Side menu 0-4',icon:<Icon path={mdiFile} size={1}/>,value:'part0_4',element:()=><Part0_4/>}, 
            ]
        },
        {
            text:'Side menu 1',icon:<Icon path={mdiFile} size={1}/>,value:'1',
            items:[
                {text:'Side menu 1-0',icon:<Icon path={mdiFile} size={1}/>,value:'part1_0',element:()=><Part1_0/>},
                {text:'Side menu 1-1',icon:<Icon path={mdiFile} size={1}/>,value:'part1_1',element:()=><Part1_1/>},
                {text:'Side menu 1-2',icon:<Icon path={mdiFile} size={1}/>,value:'part1_2',element:()=><Part1_2/>},
                {text:'Side menu 1-3',icon:<Icon path={mdiFile} size={1}/>,value:'part1_3',element:()=><Part1_3/>},
                {text:'Side menu 1-4',icon:<Icon path={mdiFile} size={1}/>,value:'part1_4',element:()=><Part1_4/>}, 
            ]
        },
        {
            text:'Side menu 2',icon:<Icon path={mdiFile} size={1}/>,value:'2',
            items:[
                {text:'Side menu 2-0',icon:<Icon path={mdiFile} size={1}/>,value:'part2_0',element:()=><Part2_0/>},
                {text:'Side menu 2-1',icon:<Icon path={mdiFile} size={1}/>,value:'part2_1',element:()=><Part2_1/>},
                {text:'Side menu 2-2',icon:<Icon path={mdiFile} size={1}/>,value:'part2_2',element:()=><Part2_2/>},
                {text:'Side menu 2-3',icon:<Icon path={mdiFile} size={1}/>,value:'part2_3',element:()=><Part2_3/>},
                {text:'Side menu 2-4',icon:<Icon path={mdiFile} size={1}/>,value:'part2_4',element:()=><Part2_4/>}, 
            ]
        },
        {
            text:'Side menu 3',icon:<Icon path={mdiFile} size={1}/>,value:'3',
            items:[
                {text:'Side menu 3-0',icon:<Icon path={mdiFile} size={1}/>,value:'part3_0',element:()=><Part3_0/>},
                {text:'Side menu 3-1',icon:<Icon path={mdiFile} size={1}/>,value:'part3_1',element:()=><Part3_1/>},
                {text:'Side menu 3-2',icon:<Icon path={mdiFile} size={1}/>,value:'part3_2',element:()=><Part3_2/>},
                {text:'Side menu 3-3',icon:<Icon path={mdiFile} size={1}/>,value:'part3_3',element:()=><Part3_3/>},
                {text:'Side menu 3-4',icon:<Icon path={mdiFile} size={1}/>,value:'part3_4',element:()=><Part3_4/>}, 
            ]
        },
        {
            text:'Side menu 4',icon:<Icon path={mdiFile} size={1}/>,value:'4',
            items:[
                {text:'Side menu 4-0',icon:<Icon path={mdiFile} size={1}/>,value:'part4_0',element:()=><Part4_0/>},
                {text:'Side menu 4-1',icon:<Icon path={mdiFile} size={1}/>,value:'part4_1',element:()=><Part4_1/>},
                {text:'Side menu 4-2',icon:<Icon path={mdiFile} size={1}/>,value:'part4_2',element:()=><Part4_2/>},
                {text:'Side menu 4-3',icon:<Icon path={mdiFile} size={1}/>,value:'part4_3',element:()=><Part4_3/>},
                {text:'Side menu 4-4',icon:<Icon path={mdiFile} size={1}/>,value:'part4_4',element:()=><Part4_4/>}, 
            ]
        },
        {
            text:'Side menu 5',icon:<Icon path={mdiFile} size={1}/>,value:'5',
            items:[
                {text:'Side menu 5-0',icon:<Icon path={mdiFile} size={1}/>,value:'part5_0',element:()=><Part5_0/>},
                {text:'Side menu 5-1',icon:<Icon path={mdiFile} size={1}/>,value:'part5_1',element:()=><Part5_1/>},
                {text:'Side menu 5-2',icon:<Icon path={mdiFile} size={1}/>,value:'part5_2',element:()=><Part5_2/>},
                {text:'Side menu 5-3',icon:<Icon path={mdiFile} size={1}/>,value:'part5_3',element:()=><Part5_3/>},
                {text:'Side menu 5-4',icon:<Icon path={mdiFile} size={1}/>,value:'part5_4',element:()=><Part5_4/>}, 
            ]
        },
        {
            text:'Side menu 6',icon:<Icon path={mdiFile} size={1}/>,value:'6',
            items:[
                {text:'Side menu 6-0',icon:<Icon path={mdiFile} size={1}/>,value:'part6_0',element:()=><Part6_0/>},
                {text:'Side menu 6-1',icon:<Icon path={mdiFile} size={1}/>,value:'part6_1',element:()=><Part6_1/>},
                {text:'Side menu 6-2',icon:<Icon path={mdiFile} size={1}/>,value:'part6_2',element:()=><Part6_2/>},
                {text:'Side menu 6-3',icon:<Icon path={mdiFile} size={1}/>,value:'part6_3',element:()=><Part6_3/>},
                {text:'Side menu 6-4',icon:<Icon path={mdiFile} size={1}/>,value:'part6_4',element:()=><Part6_4/>}, 
            ]
        },
        {
            text:'Side menu 7',icon:<Icon path={mdiFile} size={1}/>,value:'7',
            items:[
                {text:'Side menu 7-0',icon:<Icon path={mdiFile} size={1}/>,value:'part7_0',element:()=><Part7_0/>},
                {text:'Side menu 7-1',icon:<Icon path={mdiFile} size={1}/>,value:'part7_1',element:()=><Part7_1/>},
                {text:'Side menu 7-2',icon:<Icon path={mdiFile} size={1}/>,value:'part7_2',element:()=><Part7_2/>},
                {text:'Side menu 7-3',icon:<Icon path={mdiFile} size={1}/>,value:'part7_3',element:()=><Part7_3/>},
                {text:'Side menu 7-4',icon:<Icon path={mdiFile} size={1}/>,value:'part7_4',element:()=><Part7_4/>}, 
            ]
        },
        {
            text:'Side menu 8',icon:<Icon path={mdiFile} size={1}/>,value:'8',
            items:[
                {text:'Side menu 8-0',icon:<Icon path={mdiFile} size={1}/>,value:'part8_0',element:()=><Part8_0/>},
                {text:'Side menu 8-1',icon:<Icon path={mdiFile} size={1}/>,value:'part8_1',element:()=><Part8_1/>},
                {text:'Side menu 8-2',icon:<Icon path={mdiFile} size={1}/>,value:'part8_2',element:()=><Part8_2/>},
                {text:'Side menu 8-3',icon:<Icon path={mdiFile} size={1}/>,value:'part8_3',element:()=><Part8_3/>},
                {text:'Side menu 8-4',icon:<Icon path={mdiFile} size={1}/>,value:'part8_4',element:()=><Part8_4/>}, 
            ]
        },
    ]
    const side:I_side = {
        items:[
            {text:'Side menu 0',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('0')},
            {text:'Side menu 1',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('1')},
            {text:'Side menu 2',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('2')},
            {text:'Side menu 3',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('3')},
            {text:'Side menu 4',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('4')}, 
            {text:'Side menu 5',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('5')},
            {text:'Side menu 6',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('6')},
            {text:'Side menu 7',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('7')},
            {text:'Side menu 8',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('8')},
            {text:'Side menu 9',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('9')}, 
            {text:'Side menu 10',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('10')},
            {text:'Side menu 11',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('11')},
            {text:'Side menu 12',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('12')},
            {text:'Side menu 13',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('13')},
            {text:'Side menu 14',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('14')}, 
            {text:'Side menu 15',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('15')},
            {text:'Side menu 16',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('16')},
            {text:'Side menu 17',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('17')},
            {text:'Side menu 18',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('18')},
            {text:'Side menu 19',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('19')}, 
            {text:'Side menu 20',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('20')},
            {text:'Side menu 21',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('21')},
            {text:'Side menu 22',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('22')},
            {text:'Side menu 23',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('23')},
            {text:'Side menu 24',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('24')}, 
            {text:'Side menu 25',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('25')},
            {text:'Side menu 26',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('26')},
            {text:'Side menu 27',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('27')},
            {text:'Side menu 28',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('28')},
            {text:'Side menu 29',icon:<Icon path={mdiFile} size={1}/>,onClick:()=>alert('29')}, 
        ],
        header:(
            <div className="flex-row align-v p-h-12 gap-12 h-36 bg-14">
                <Icon path={mdiAccount} size={0.8}/>
                <Icon path={mdiAttachment} size={0.8}/>
                <Icon path={mdiStar} size={0.8}/>
            </div>
        ),
        footer:(
            <div className="flex-row align-v p-h-12 gap-12 h-36 bg-14">
                <Icon path={mdiAccount} size={0.8}/>
                <Icon path={mdiAttachment} size={0.8}/>
                <Icon path={mdiStar} size={0.8}/>
            </div>
        )
    }
    const bottomMenu:I_navItem[] = [
        {text:'Side menu 0-0',icon:<Icon path={mdiFile} size={1}/>,value:'part0_0',element:()=><Part0_0/>},
        {text:'Side menu 0-1',icon:<Icon path={mdiFile} size={1}/>,value:'part0_1',element:()=><Part0_1/>},
        {text:'Side menu 0-2',icon:<Icon path={mdiFile} size={1}/>,value:'part0_2',element:()=><Part0_2/>},
        {text:'Side menu 0-3',icon:<Icon path={mdiFile} size={1}/>,value:'part0_3',element:()=><Part0_3/>},
        {text:'Side menu 0-4',icon:<Icon path={mdiFile} size={1}/>,value:'part0_4',element:()=><Part0_4/>},
    ]
    return (
        <AIOLayout 
            // nav={{items:navItems,type:'hover'}} 
            // bottomMenu={{items:bottomMenu}}
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
            side={side}
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
            body:()=><Sidebar context={context}/>,
            setAttrs:(key)=>{
                if(key === 'body'){return {style:{overflow:'hidden',maxHeight:'100vh'}}}
            }
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
            if(item.items && item.items.length){
                const res:I_navItem | undefined = findNavItem_req(item.items)
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
            <div className="aio-layout-container ai-layout1">
                <div className="aio-layout">
                    <AIOLayoutHeader context={context}/>
                    <AIOLayoutBody context={context}/>
                    <AIOLayoutFooter context={context}/>
                    {popup.render()}
                </div>
                
            </div>
            
        </>
    )
}
const AIOLayoutHeader:FC<{context:I_context}> = ({context})=>{
    const {rootProps,activeNav,openSide} = context;
    const {side,header = {}} = rootProps;
    const {title = ()=>'',after,before} = header;
    const Title = title(activeNav) || activeNav?.text
    return (
        <div className="aio-layout-header">
            {!!side && <div className='aio-layout-sidebar-toggle' onClick={()=>openSide()}><Icon path={mdiMenu} size={1}/></div>}
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
            const {element,value,items = [],show = ()=>true} = list[i];
            if(show() === false){continue}
            const key = `${parentKey || 'root'}-${i}`;
            if(element){routes.push(<Route key={key} path={`/${value}`} element={element()}/>)}
            if(items.length){getRoutes_req(items,routes,key)}
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
    const {rootProps,onNav,activeNav} = context;
    const {bottomMenu} = rootProps;
    if(!bottomMenu){return null}
    const {items = []} = bottomMenu;
    const cls = 'aio-layout-bottom-menu'
    return (
        <div className={cls}>
            {
                items.map((o:I_navItem,i:number)=>{
                    const {icon,text,value,attrs = {}} = o;
                    const active = value === activeNav?.value;
                    const Attrs = AddToAttrs(attrs,{className:`${cls}-item${active?` ${cls}-item-active`:''}`,attrs:{onClick:()=>onNav(o)}})
                    return (
                        <div {...Attrs} key={i}>
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
    const {rootProps,onNav,activeNav} = context;
    const {nav} = rootProps;
    if(!nav){return null}
    return (
        <div className='aio-layout-nav'>
            {!!nav.header && <div className="aio-layout-nav-header">{nav.header}</div>}
            <SideMenu
                items={nav.items}
                type={nav.type}
                onChange={(option:I_navItem)=>onNav(option)}   
                option={{
                    attrs:(option:I_navItem)=>option.attrs,
                    className:(option:I_navItem)=>{
                        const res = option.value === activeNav?.value
                        return res?'aio-layout-nav-item-active':undefined
                    }
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
        <div className="aio-layout-sidebar-body">
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




