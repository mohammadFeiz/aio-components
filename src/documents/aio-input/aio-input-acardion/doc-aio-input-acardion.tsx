import React from "react"
import DOC from "../../../resuse-components/doc"
import AIOInput from "../../../npm/aio-input"
import { AI } from "../../../npm/aio-input/types"
import { mdiAccount } from "@mdi/js"
import Icon from '@mdi/react';
export default function DOC_Acardion(props) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items:()=>[
                    { text: 'Basic', id: 'basic', render: () => <Basic /> },
                    { text: 'vertical', id: 'vertical', render: () => <Vertical /> },
                    { text: 'multiple', id: 'multiple', render: () => <Multiple /> },
                ]
            }}
        />
    )
}

function Basic(){
    let p:AI = {
        type:'acardion',
        body:(value)=>{
            return {
                html:`f sdfs duifgwo uygqwoeiur wgopiufgwp ieurg wepuirfg pwiurgpwi uerpeu rpeur ieurgfi pweugr iowugt piufwpeuo rh3;4ouierpfgweuior ;owighf[o wieghrto [eighrto [iehrt [owieghr [owieghr [oieght woieghrt weoight eroihyt[ rjyh ${value}`
            }
        },
        options:[
            {text:'acardion1',value:'0'},
            {text:'acardion2',value:'1'},
            {text:'acardion3',value:'2'},
            {text:'acardion4',value:'3'}
        ],
        option:{
            after:()=><Icon path={mdiAccount} size={0.7}/>,
            before:(option)=><div className='align-vh fs-16 bold w-30 h-30 bg-32 br-6' style={{color:'dodgerblue'}}>{option.renderIndex + 1}</div>,
            subtext:()=>'this is my subtext',

        }

    }
    return (
        <div className='example'>
            <AIOInput {...p}/>
        </div>
    )
}
function Vertical(){
    let p:AI = {
        type:'acardion',
        vertical:false,
        body:(value)=>{
            return {
                html:`f sdfs duifgwo uygqwoeiur wgopiufgwp ieurg wepuirfg pwiurgpwi uerpeu rpeur ieurgfi pweugr iowugt piufwpeuo rh3;4ouierpfgweuior ;owighf[o wieghrto [eighrto [iehrt [owieghr [owieghr [oieght woieghrt weoight eroihyt[ rjyh ${value}`
            }
        },
        options:[
            {text:'acardion1',value:'0'},
            {text:'acardion2',value:'1'},
            {text:'acardion3',value:'2'},
            {text:'acardion4',value:'3'}
        ],
        option:{
            after:()=><Icon path={mdiAccount} size={0.7}/>,
            before:(option)=><div className='align-vh fs-16 bold w-30 h-30 bg-32 br-6' style={{color:'dodgerblue'}}>{option.renderIndex + 1}</div>,
            subtext:()=>'this is my subtext',
        }

    }
    return (
        <div className='example'>
            <AIOInput {...p}/>
        </div>
    )
}
function Multiple(){
    let p:AI = {
        type:'acardion',
        multiple:true,
        body:(value)=>{
            return {
                html:`f sdfs duifgwo uygqwoeiur wgopiufgwp ieurg wepuirfg pwiurgpwi uerpeu rpeur ieurgfi pweugr iowugt piufwpeuo rh3;4ouierpfgweuior ;owighf[o wieghrto [eighrto [iehrt [owieghr [owieghr [oieght woieghrt weoight eroihyt[ rjyh ${value}`
            }
        },
        options:[
            {text:'acardion1',value:'0'},
            {text:'acardion2',value:'1'},
            {text:'acardion3',value:'2'},
            {text:'acardion4',value:'3'}
        ],
        option:{
            after:()=><Icon path={mdiAccount} size={0.7}/>,
            before:(option)=><div className='align-vh fs-16 bold w-30 h-30 bg-32 br-6' style={{color:'dodgerblue'}}>{option.renderIndex + 1}</div>,
            subtext:()=>'this is my subtext',
        }

    }
    return (
        <div className='example'>
            <AIOInput {...p}/>
        </div>
    )
}