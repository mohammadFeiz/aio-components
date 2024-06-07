import { FC, createContext, useContext, useState } from "react";
import AIOInput, { AI_Sidemenu_option, SideMenu } from "../../../npm/aio-input";
import './theme1.css';
import { mdiAccessPointNetworkOff, mdiAlphaBBox, mdiArrowRight, mdiCakeVariant, mdiCamera, mdiDatabaseArrowLeftOutline, mdiEarthBoxRemove, mdiFaceRecognition, mdiFileDocument, mdiInformation, mdiMicrophone, mdiStar, mdiVideo } from "@mdi/js";
import {Icon} from "@mdi/react";
import AIOPopup from "../../../npm/aio-popup";
import AIODoc from "../../../npm/aio-doc/aio-doc";
const CTX = createContext({} as any);
type I_ctx = {
    sideItems:AI_Sidemenu_option[],
    popup:AIOPopup
}
const Theme1:FC = ()=>{
    const [popup] = useState<AIOPopup>(new AIOPopup())
    const [activeSide,setActiveSide] = useState<string>('selectiveInputs')
    const sideItems:AI_Sidemenu_option[] = [
        {
            text:'Inputs',value:'inputs',
            options:[
                {
                    text:'Selective Inputs',value:'selectiveInputs'
                }
            ]
        },
        {
            text:'Boxes',value:'boxes',
            icon:<Icon path={mdiAlphaBBox} size={0.8}/>,
            options:[
                {
                    text:'Box1',value:'box1'
                }
            ]
        }
    ]
    function getContext():I_ctx{
        return {sideItems,popup}
    }
    function getContent(){
        if(activeSide === 'selectiveInputs'){return <SelectiveInputs/>}
        else if(activeSide === 'box1'){return <Boxes1/>}
        
    }
    console.log(activeSide)
    return (
        <CTX.Provider value={getContext()}>
            <div className='ai ai-layout1'>
            <AINavbar/>
            <div className='ai-body'>
                <div className='ai-side'>
                    <SideMenu
                        options={sideItems}
                        onChange={(activeSide)=>setActiveSide(activeSide)}
                    /> 
                </div>
                <div className='ai-border-v'></div>
                <div className='ai-content'>{getContent()}</div>        
            </div>
        </div>
        {popup.render()}
        </CTX.Provider>
    )
}
export default Theme1
const AINavbar:FC = ()=>{
    return (
        <div className='ai-navbar'>
            <div className='ai-logo'>

            </div>
            <div className='ai-title'>
                My App Title
            </div>
            <div className='ai-profile'>
                My App Title
            </div>
        </div>
    )
}
const SelectiveInputs:FC = ()=>{
    const options = [
        'Option1',
        'Option2',
        'Option3',
        'Option4',
        'Option5'
    ]
    const icons = [
        mdiAccessPointNetworkOff,mdiCakeVariant,mdiDatabaseArrowLeftOutline,mdiEarthBoxRemove,mdiFaceRecognition
    ]
    const [value,setValue] = useState<{
        select?:string,
        multiselect?:string[]
    }>({})
    const [tab,setTab] = useState<string>('Tab 1');
    return (
        <div className='ai-keyboard-inputs'>
            <AIOInput
                type='tabs' options={['Tab 1','Tab 2','Tab 3']}
                option={{
                    text:'option',value:'option',
                    style:()=>({minWidth:120}),
                    before:(option,details)=><Icon path={icons[details.index]} size={0.7}/>
                }}
                value={tab} onChange={(newTab)=>setTab(newTab)}
            />
            <AIOInput
                type='form'
                className='p-12'
                value={{...value}}
                onChange={(newValue)=>setValue({...newValue})}
                node={{
                    dir:'v',
                    childs:[
                        {
                            label:'Select',
                            field:'value.select',
                            input:{
                                type:'select',
                                placeholder:'Not Selected',
                                deSelect:{text:'Not Selected',value:undefined},
                                options,
                                option:{
                                    text:'option',
                                    value:'option'
                                },
                                popover:{
                                    fitHorizontal:true,
                                }
                            }
                        },
                        {
                            label:'Multi Select',
                            field:'value.multiselect',
                            input:{
                                type:'select',
                                onChange:()=>{
                                    return true
                                },
                                options,
                                multiple:true,
                                option:{
                                    text:'option',
                                    value:'option'
                                },
                                popover:{
                                    fitHorizontal:true,
                                }
                            }
                        },
                        {
                            label:'Radio',
                            field:'value.radio',
                            input:{
                                type:'radio',
                                onChange:()=>{
                                    return true
                                },
                                options,
                                option:{
                                    text:'option',
                                    value:'option'
                                },
                                popover:{
                                    fitHorizontal:true,
                                }
                            }
                        },
                        {
                            label:'Check List',
                            field:'value.checklist',
                            input:{
                                type:'radio',
                                onChange:()=>{
                                    return true
                                },
                                multiple:true,
                                options,
                                option:{
                                    text:'option',
                                    value:'option'
                                },
                                popover:{
                                    fitHorizontal:true,
                                }
                            }
                        },
                        {
                            label:'Buttons',
                            field:'value.buttons',
                            input:{
                                type:'buttons',
                                onChange:()=>{
                                    return true
                                },
                                multiple:true,
                                options,
                                option:{
                                    text:'option',
                                    value:'option'
                                },
                                popover:{
                                    fitHorizontal:true,
                                }
                            }
                        }
                    ]
                }}
            />
        </div>
    )
}

const Boxes1:FC = ()=>{
    const {popup}:I_ctx = useContext(CTX);
    let boxes1:I_Box1[] = [
        {
            classes:{
                container:'w-108',
                text:'bold'
            },
            icon:<Icon path={mdiCamera} size={0.6}/>,text:'Picture',subtext:'100 files',color:'#6663FF'
        },
        {
            classes:{
                container:'w-108',
                text:'bold'
            },
            icon:<Icon path={mdiFileDocument} size={0.6}/>,text:'Documents',subtext:'100 files',color:'#00A1B4'
        },
        {
            classes:{
                container:'w-108',
                text:'bold'
            },
            icon:<Icon path={mdiVideo} size={0.6}/>,text:'Videos',subtext:'100 files',color:'#E06D9F'
        },
        {
            classes:{
                container:'w-108',
                text:'bold'
            },
            icon:<Icon path={mdiMicrophone} size={0.6}/>,text:'Audio',subtext:'100 files',color:'#276FD5'
        },
        {
            classes:{
                container:'w-108 h-84',
                text:'bold'
            },
            outline:true,icon:<Icon path={mdiCamera} size={0.6}/>,text:'Picture',subtext:'100 files',color:'#6663FF'
        },
        {
            classes:{
                container:'w-108 h-84',
                text:'bold'
            },
            outline:true,icon:<Icon path={mdiFileDocument} size={0.6}/>,text:'Documents',subtext:'100 files',color:'#00A1B4'
        },
        {
            classes:{
                container:'w-108 h-84',
                text:'bold'
            },
            outline:true,icon:<Icon path={mdiVideo} size={0.6}/>,text:'Videos',subtext:'100 files',color:'#E06D9F'
        },
        {
            classes:{
                container:'w-108 h-84',
                text:'bold'
            },
            outline:true,icon:<Icon path={mdiMicrophone} size={0.6}/>,text:'Audio',subtext:'100 files',color:'#276FD5'
        },
        {
            classes:{
                container:'w-168'
            },
            color:'#6663FF',
            text:'Lorem, sit amet adipisicing elit.',
            subtext:'aut fuga, maiores voluptatem ad repellat harum?',
            after:<Icon path={mdiInformation} size={0.6}/>,
            footer:<div className='flex-row gap-6 fs-12 bold align-v'>LearnMore <Icon path={mdiArrowRight} size={0.6}/></div>
        },
        {
            classes:{
                container:'w-168 ai-bg-2'
            },
            className:'ai-second-bg',
            text:'Lorem, ipsum sit amet constur adipisicing elit.',
            subtext:'aut fuga, maiores ad repellat harum?',
            after:<Icon path={mdiInformation} size={0.6}/>,
            footer:<div className='flex-row gap-6 fs-12 bold align-v'>LearnMore <Icon path={mdiArrowRight} size={0.6}/></div>
        },
        {
            classes:{
                container:'w-168 ai-bg-3'
            },
            className:'ai-second-bg',
            text:'Lorem, sit amet adipisicing elit.',
            subtext:'aut fuga, maiores voluptatem ad repellat harum?',
            after:<Icon path={mdiInformation} size={0.6}/>,
            footer:<div className='flex-row gap-6 fs-12 bold align-v'>LearnMore <Icon path={mdiArrowRight} size={0.6}/></div>
        },
        {
            classes:{
                container:'w-168 ai-bg-4'
            },
            className:'ai-second-bg',
            text:'Lorem, sit amet adipisicing elit.',
            subtext:'aut fuga, maiores voluptatem ad repellat harum?',
            after:<Icon path={mdiInformation} size={0.6}/>,
            footer:<div className='flex-row gap-6 fs-12 bold align-v'>LearnMore <Icon path={mdiArrowRight} size={0.6}/></div>
        },
        {
            classes:{
                container:'w-168 ai-border'
            },
            className:'ai-border',
            text:'Lorem, ipsum sit amet constur adipisicing elit.',
            subtext:'aut fuga, maiores ad repellat harum?',
            after:<Icon path={mdiInformation} size={0.6}/>,
            footer:<div className='flex-row gap-6 fs-12 bold align-v'>LearnMore <Icon path={mdiArrowRight} size={0.6}/></div>
        },
        {
            classes:{
                container:'w-168 ai-dark-glass'
            },
            className:'ai-border',
            text:'Lorem, sit amet adipisicing elit.',
            subtext:'aut fuga, maiores voluptatem ad repellat harum?',
            after:<Icon path={mdiInformation} size={0.6}/>,
            footer:<div className='flex-row gap-6 fs-12 bold align-v'>LearnMore <Icon path={mdiArrowRight} size={0.6}/></div>
        },
        {
            classes:{
                container:'w-168 ai-light-glass'
            },
            className:'ai-border',
            text:'Lorem, sit amet adipisicing elit.',
            subtext:'aut fuga, maiores voluptatem ad repellat harum?',
            after:<Icon path={mdiInformation} size={0.6}/>,
            footer:<div className='flex-row gap-6 fs-12 bold align-v'>LearnMore <Icon path={mdiArrowRight} size={0.6}/></div>
        }
    ]
    function box1Code(){
        popup.addModal({
            position:'center',
            header:{title:'Code',subtitle:'Box1',onClose:true},
            body:()=>{
                return (
                    new AIODoc().Code(
`type I_Box1 = {
    icon:React.ReactNode,
    text:string,
    subtext:string,
    color:string,
    size:number,
    onClick?:()=>void
}
<Box1
    size={100}
    icon={<Icon path={mdiCamera} size={0.6}/>}
    text='Picture'
    subtext='100 files'
    color='#6663FF'
    onClick={()=>{alert()}}
/>`
                    )
                )
            }
        })
    }
    function box2Code(){
        popup.addModal({
            position:'center',
            header:{title:'Code',subtitle:'Box2',onClose:true},
            body:()=>{
                return (
                    new AIODoc().Code(
`type I_Box1 = {
    icon:React.ReactNode,
    text:string,
    subtext:string,
    color:string,
    size:number,
    onClick?:()=>void
}
<Box1
    size={100}
    icon={<Icon path={mdiCamera} size={0.6}/>}
    text='Picture'
    subtext='100 files'
    color='#6663FF'
    onClick={()=>{alert()}}
/>`
                    )
                )
            }
        })
    }
    return (
        <div className='flex-row gap-8 p-12 flex-col'>
            <div className='flex-row gap-12 wrap'>
                {boxes1.map((o)=><Box1 {...o} onClick={()=>box1Code()}/>)}
            </div>
            <div className='flex-row'>
            </div>
        </div>
    )
}
type I_Box1 = {
    icon?:React.ReactNode,
    text:string,
    subtext:string,
    color?:string,
    onClick?:()=>void,
    after?:React.ReactNode,
    outline?:boolean,
    footer?:React.ReactNode,
    bold?:boolean,
    className?:string,
    classes?:{
        [key in 'container'|'text'|'subtext']?:string
    }
}
const Box1:FC<I_Box1> = ({classes = {},color,icon,text,onClick,subtext,outline,footer,bold,after})=>{
    let cls = `flex-col ${outline?'bg':'c'}-15 p-8 br-8 fs-14 gap-8${classes.container?' ' + classes.container:''}`
    return (
        <div onClick={onClick} className={cls} style={{background:!outline?color:undefined}}>
            {!!icon && <div className="bg-16 w-24 h-24 align-vh br-100" style={{color}}>{icon}</div>}
            <div className='flex-row'>
                <div className={`flex-1${bold?" bold":''}${classes.text?' ' + classes.text:''}`}>{text}</div>
                {!!after && <div className='p-6'>{after}</div>}
            </div>
            <div className={`op-70 fsp-80${classes.subtext?' ' + classes.subtext:''}`}>{subtext}</div>
            {!!footer && footer}
        </div>
    )
}
