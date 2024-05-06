import React, { useRef, useState } from "react";
import AIOInput from "../../../npm/aio-input";
import { AI } from "../../../npm/aio-input/types";
export default function DateExamples(type){
    return [
        {
            property:'theme',title:'theme',props:{theme:['lightblue','#666']},
            code:`theme={['lightblue','#666']}`
        },
        {
            property:'unit',show:()=>type === 'date',title:'unit ("month")',props:{unit:'month'},
            code:`unit='month'`
        },
        {
            property:'unit',show:()=>type === 'date',title:'unit ("hour")',props:{unit:'hour'},
            code:`unit='hour'`
        },
        {
            property:'unit',show:()=>type === 'time',title:'unit ({hour:true,minute:true,second:true})',
            props:{unit:{hour:true,minute:true,second:true}},
            code:`unit={hour:true,minute:true,second:true}`
        },
        {
            property:'unit',show:()=>type === 'time',title:'unit ({month:true,day:true})',props:{unit:{month:true,day:true}},
            code:`unit={month:true,day:true}`
        },
        {
            property:'unit',show:()=>type !== 'time',title:'unit ({hour:true,minute:true})',props:{unit:{hour:true,minute:true}},
            code:`unit={hour:true,minute:true}`
        },
        {
            property:'jalali',title:'jalali',props:{jalali:true},
            code:`jalali={true}`
        },
        {
            property:'size',title:'size',props:{size:120},
            code:`size={120}`
        },
        {
            property:'dateDisabled',render:()=><DateDisabled/>
        },
        {
            property:'dateAttrs',title:'dateAttrs (function) (isToday)',
            props:{
                dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
                    if(isToday){
                        return {
                            style:{background:'orange'}
                        }
                    }
                }
            },
            code:
`dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
    if(isToday){
        return {
            style:{background:'orange'}
        }
    }
}`
        },
        {
            property:'dateAttrs',title:'dateAttrs (function) (isActive)',
            props:{
                dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
                    if(isActive){
                        return {
                            style:{background:'orange'}
                        }
                    }
                }
            },
            code:
`dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
    if(isToday){
        return {
            style:{background:'orange'}
        }
    }
}`
        },
        {
            property:'dateAttrs',title:'dateAttrs (function) (isDisabled)',
            props:{
                dateDisabled:['w,6'],
                dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
                    if(isDisabled){
                        return {
                            style:{border:'1px solid orange'}
                        }
                    }
                }
            },
            code:
`dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
    if(isToday){
        return {
            style:{background:'orange'}
        }
    }
}`
        },
        {
            property:'dateAttrs',title:'dateAttrs (function) (isMatch)',
            props:{
                dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
                    if(isMatch(['w,6','w,4'])){
                        return {
                            style:{border:'1px solid orange'}
                        }
                    }
                }
            },
            code:
`dateAttrs:({dateArray,isToday,isDisabled,isActive,isMatch})=>{
    if(isMatch(['w,6','w,4'])){
        return {
            style:{border:'1px solid orange'}
        }
    }
}`
        },
    ]
}

function DateDisabled(){
    let [value,setValue] = useState()
    let ref = useRef(value);
    ref.current = value;
    let p:AI = {
        type:'table',
        columns:[
            {
                title:'Operator',value:'row.op',width:240,
                cellAttrs:({column})=>{
                    return {style:{padding:0,letterSpacing:column.title === 'Operator'?1:undefined}} 
                }
            },
            {title:'Description',value:'row.des'},
            {
                width:120,template:({row})=>{
                    return <AIOInput type='date' value={ref.current} onChange={(value)=>setValue(value)} disabled={JSON.parse(row.op)}/>
                }
            }
            
        ],
        value:[
            {op:'["<>,2022,2024"]',des:'disabled all dates between 2022 and 2024'},
            {op:'["<=>,2022,2024"]',des:'disabled all dates between and equal 2022 and 2024'},
            {op:'["!<>,2022,2024"]',des:'disabled all dates that is not between 2022 and 2024'},
            {op:'["!<=>,2022,2024"]',des:'disabled all dates that is not between and equal 2022 and 2024'},
            {op:'["=,2022/4/5,2022/6/7,2022/8/12"]',des:'disabled this dates => 2022/4/5,2022/6/7,2022/8/12'},
            {op:'["!=,2022/4/5"]',des:'disabled all dates exept 2022/4/5'},
            {op:'[">,2022/4/5"]',des:'disabled all dates after 2022/4/5'},
            {op:'[">=,2022/4/5"]',des:'disabled 2022/4/5 and all dates after 2022/4/5'},
            {op:'["<,2022/4/5"]',des:'disabled all dates before 2022/4/5'},
            {op:'["<=,2022/4/5"]',des:'disabled 2022/4/5 and all dates before 2022/4/5'},
            {op:'["w,6,4"]',des:'disabled all 4th and 6th weekdays (index from 0)'},
            {op:'["!w,6"]',des:'disabled all days that is not 6th weekdays (index from 0)'},
        ]
    }
    return (
        <>
            <h3>dateDisabled</h3>
            <AIOInput {...p}/>
        </>
    )
}