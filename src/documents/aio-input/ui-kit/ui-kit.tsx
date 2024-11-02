import React, { FC, useState } from "react"
import DOC from "./../../../resuse-components/doc"
import { AI_Sidemenu_item, SideMenu } from "../../../npm/aio-input";
import { mdiDiamond, mdiEmoticonHappyOutline, mdiFile, mdiGauge, mdiHeart } from "@mdi/js"
import Icon from '@mdi/react';
import Code from "../../../npm/code";

export default function DOC_Tree(props:any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items:()=>[
                    { text: 'Side Menu', id: 'sidemenu', render: () => <EXSideMenu/> },
                    
                    
                ]
            }}
        />
    )
}
const EXSideMenu:FC = ()=> {
    const [items] = useState<AI_Sidemenu_item[]>([
        {
            text:'Dashboard',
            icon:<Icon path={mdiGauge} size={0.6}/>,
            badge:{text:'New',color:'red'},
            onClick:()=>alert('Dashboad')
        },
        {
            text:'Components',
            icon:<Icon path={mdiDiamond} size={0.6}/>,
            onClick:()=>alert('Components')
        },
        {
            text:'With Suffix',
            icon:<Icon path={mdiEmoticonHappyOutline} size={0.6}/>,
            badge:{text:'3',color:'yellow',circle:true},
            items:[
                {
                    text:'Submenu 1',
                    icon:<Icon path={mdiFile} size={0.6}/>,
                    onClick:()=>alert('Submenu 1')
                },
                {
                    text:'Submenu 2',
                    badge:{text:'Success',color:'green'},
                    icon:<Icon path={mdiFile} size={0.6}/>,
                    onClick:()=>alert('Submenu 2')
                },
                {
                    text:'Submenu 3',
                    badge:{text:'Message',color:'white'},
                    icon:<Icon path={mdiFile} size={0.6}/>,
                    onClick:()=>alert('Submenu 3')
                }
            ]
        },
        {
            text:'With Prefix',
            icon:<Icon path={mdiHeart} size={0.6}/>,
            badge:{text:'3',color:'grey',circle:true},
            items:[
                {
                    text:'Submenu 4',
                    badge:{text:'Warning',color:'orange'},
                    icon:<Icon path={mdiFile} size={0.6}/>,
                    onClick:()=>alert('Submenu 4')
                },
                {
                    text:'Submenu 5',
                    icon:<Icon path={mdiFile} size={0.6}/>,
                    onClick:()=>alert('Submenu 5')
                },
                {
                    text:'Submenu 6',
                    badge:{text:'Info',color:'blue'},
                    icon:<Icon path={mdiFile} size={0.6}/>,
                    onClick:()=>alert('Submenu 6')
                }
            ]
        }
    ])
    return (
        <div className='example'>
            <SideMenu items={items}/>
        {Code(`
import { SideMenu } from "aio-input";

const items = [
    {
        text:'Dashboard',
        icon:<Icon path={mdiGauge} size={0.6}/>,
        badge:{text:'New',color:'red'},
        onClick:()=>alert('Dashboad')
    },
    {
        text:'Components',
        icon:<Icon path={mdiDiamond} size={0.6}/>,
        onClick:()=>alert('Components')
    },
    {
        text:'With Suffix',
        icon:<Icon path={mdiEmoticonHappyOutline} size={0.6}/>,
        badge:{text:'3',color:'yellow',circle:true},
        items:[
            {
                text:'Submenu 1',
                icon:<Icon path={mdiFile} size={0.6}/>,
                onClick:()=>alert('Submenu 1')
            },
            {
                text:'Submenu 2',
                badge:{text:'Success',color:'green'},
                icon:<Icon path={mdiFile} size={0.6}/>,
                onClick:()=>alert('Submenu 2')
            },
            {
                text:'Submenu 3',
                badge:{text:'Message',color:'white'},
                icon:<Icon path={mdiFile} size={0.6}/>,
                onClick:()=>alert('Submenu 3')
            }
        ]
    },
    {
        text:'With Prefix',
        icon:<Icon path={mdiHeart} size={0.6}/>,
        badge:{text:'3',color:'grey',circle:true},
        items:[
            {
                text:'Submenu 4',
                badge:{text:'Warning',color:'orange'},
                icon:<Icon path={mdiFile} size={0.6}/>,
                onClick:()=>alert('Submenu 4')
            },
            {
                text:'Submenu 5',
                icon:<Icon path={mdiFile} size={0.6}/>,
                onClick:()=>alert('Submenu 5')
            },
            {
                text:'Submenu 6',
                badge:{text:'Info',color:'blue'},
                icon:<Icon path={mdiFile} size={0.6}/>,
                onClick:()=>alert('Submenu 6')
            }
        ]
    }
]
return <SideMenu items={items}/>
        `)}
        </div> 
    )
}