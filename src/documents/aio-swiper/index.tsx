import { FC, useState } from "react"
import DOC from "../../resuse-components/Doc/index"
import AIOSwiper from "../../npm/aio-swiper"
import './index.css';
import src1 from './images/1.jpg'
import src2 from './images/2.jpg'
import src3 from './images/3.jpg'
import src4 from './images/4.jpg'
import src5 from './images/5.jpg'
import src6 from './images/6.jpg'
import src7 from './images/7.jpg'
import src8 from './images/8.jpg'
import src9 from './images/9.jpg'
import src10 from './images/10.jpg'
import defaultData from "./data";
const DOC_AIOSwiper: FC<{ goToHome: () => void, name: string }> = ({ name, goToHome }) => {
    return (
        <DOC
            name={name} goToHome={goToHome}
            items={[
                { text: 'Basic', value: 'basic', render: () => <Basic /> },
                { text: 'time', value: 'time', render: () => <Time /> },
                { text: 'aspect', value: 'aspect', render: () => <Aspect /> },
            ]}
        />
    )
}
export default DOC_AIOSwiper
const Card: FC<{ title: string, subtitle: string, description: string, index: number }> = ({ title, subtitle, description, index }) => {
    const images:{[key:string]:string} = {src1,src2,src3,src4,src5,src6,src7,src8,src9,src10}
    return (
        <div className="das-card-container">
            <img className='das-card-image'
                src={images[`src${index + 1}`]}
                alt="card alt image"
                width={246}
                height={480}
            />
            <div className="das-card-title">{title}</div>
            <div className="das-card-subtitle">{subtitle}</div>
            <div className="das-card-description">{description}</div>
            <button className='das-card-button'>Start</button>
        </div>
    )
}
export type I_card = {
    title:string,
    subtitle:string,
    description:string
}
const Basic: FC = () => {
    const [data] = useState<I_card[]>(defaultData)
    return (
        <AIOSwiper
            time={3000}
            items={data.map((o,i)=>{
                return {
                    html:<Card title={o.title} subtitle={o.subtitle} description={o.description} index={i}/>
                }
            })}
        />
    )
}
const Time: FC = () => {
    const [data] = useState<I_card[]>(defaultData)
    return (
        <AIOSwiper
            time={6000}
            items={data.map((o,i)=>{
                return {
                    html:<Card title={o.title} subtitle={o.subtitle} description={o.description} index={i}/>
                }
            })}
        />
    )
}
const Aspect: FC = () => {
    const [data] = useState<I_card[]>(defaultData)
    return (
        <AIOSwiper
            time={1000}
            aspect={25}
            items={data.map((o,i)=>{
                return {
                    html:<Card title={o.title} subtitle={o.subtitle} description={o.description} index={i}/>
                }
            })}
        />
    )
}