import { FC, ReactNode, useEffect, useRef, useState } from "react";
import './index.css';
type I_AIOSwiper_item = { html: ReactNode }
type I_AIOSwiper = { items: I_AIOSwiper_item[], time: number, aspect?: number }
const AIOSwiper: FC<I_AIOSwiper> = (props) => {
    let { aspect = 100 } = props;
    aspect = aspect < 0 ? 0 : aspect;
    aspect = aspect > 100 ? 100 : aspect;
    const cls = 'aio-swiper'
    const [data] = useState<I_AIOSwiper_item[]>(props.items);
    let time = useRef(props.time || 3000)
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [transition, setTransition] = useState<boolean>(true)
    const timer = useRef<any>(0);
    useEffect(() => {
        update();
        return () => clearTimeout(timer.current);
    }, []);
    const msf = (dir:1 | -1) => {
        setSelectedIndex((prevIndex) => {
            let newIndex = prevIndex + dir;
            if(newIndex < 0){time.current = 0;}
            else if (newIndex === data.length) {time.current = 0;}
            else {time.current = props.time}
            if(newIndex < 0){
                newIndex = data.length - 1;
                setTransition(false);
            }
            else if (newIndex > data.length) {
                newIndex = 0;
                setTransition(false);
            }
            else {
                setTransition(true)
            }
            return newIndex
        });
    }
    const update = () => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            msf(1)
            update();
        }, time.current);
    };
    const buttonClick = (dir: 1 | -1) => {
        clearTimeout(timer.current);
        update();
        msf(dir)
    };
    return (
        <div className={`${cls}-out`}>
            <div className={`${cls}-in`}>
                {
                    data.concat(data,data).map((item, index) => {
                        const delta = ((50 / aspect) - 0.5) * 100;
                        let tx = delta + (-(selectedIndex + data.length) * 100)
                        return (
                            <div
                                className={`${cls}-slider-container${index === selectedIndex ? ' active' : ''}`}
                                key={index} style={{ width: `${aspect}%`, transform: `translateX(${tx}%)`, transition: transition ? `transform 0.5s ease-in-out, opacity 0.5s` : 'unset' }}
                            >{item.html}</div>
                        )
                    })
                }
            </div>
            <button className={`${cls}-button ${cls}-prev-button`} onClick={() => buttonClick(-1)}>
                <svg viewBox="0 0 24 24" style={{ height: 36, width: 36 }}>
                    <path fill="currentColor" d="M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M15.4,16.6L10.8,12L15.4,7.4L14,6L8,12L14,18L15.4,16.6Z"></path>
                </svg>
            </button>
            <button className={`${cls}-button ${cls}-next-button`} onClick={() => buttonClick(1)}>
                <svg viewBox="0 0 24 24" style={{ height: 36, width: 36 }}>
                    <path fill="currentColor" d="M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,18L16,12L10,6L8.6,7.4L13.2,12L8.6,16.6L10,18Z"></path>
                </svg>
            </button>
        </div>
    );
}
export default AIOSwiper