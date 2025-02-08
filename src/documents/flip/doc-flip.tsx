import { useEffect, useState } from 'react';
import Flip from './index.tsx';
import DOC from '../../resuse-components/Doc/index.tsx';
import {Code} from './../../npm/aio-components';
export default function DOC_Flip(props:any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            items={[
                { text: 'Basic', value: 'Basic', render: () => <Basic/> },
            ]}
        />
    )
}

function Basic() {
    const [hour,setHour] = useState<number>(12)
    const [minute,setMinute] = useState<number>(0)
    const [second,setSecond] = useState<number>(0)
    useEffect(()=>{
        setTimeout(()=>{
            const d = new Date();
            const hour = d.getHours()
            const minute = d.getMinutes();
            const second = d.getSeconds()
            setHour(hour)
            setMinute(minute)
            setSecond(second)
        },1000)
    })
    return (
        <>
            <div className='p-12- flex-row-'>
                <Flip value={hour} fontSize={36} double={true}/>
                <div className="w-16- fs-18- align-vh-">:</div>
                <Flip value={minute} fontSize={36} double={true}/>
                <div className="w-16- fs-18- align-vh-">:</div>
                <Flip value={second} fontSize={30} double={true}/>
            </div>
            {
                Code(
`import Flip from './index.tsx';
function Example(){
    const [hour,setHour] = useState<number>(12)
    const [minute,setMinute] = useState<number>(0)
    const [second,setSecond] = useState<number>(0)
    useEffect(()=>{
        setTimeout(()=>{
            const d = new Date();
            const hour = d.getHours()
            const minute = d.getMinutes();
            const second = d.getSeconds()
            setHour(hour)
            setMinute(minute)
            setSecond(second)
        },1000)
    })
    return (
        <div className='p-12 flex-row-'>
            <Flip value={hour} fontSize={36} double={true}/>
            <div className="w-16- fs-18- align-vh-">:</div>
            <Flip value={minute} fontSize={36} double={true}/>
            <div className="w-16- fs-18- align-vh-">:</div>
            <Flip value={second} fontSize={30} double={true}/>
        </div>
    )
}
`
                )
            }
        </>
    )
}
