import React, { useState, useRef, FC } from "react";
import './index.css';
import { DragList } from "../../npm/aio-component-utils";
type I_card = {title:string}
const DragAndDrop: FC<{goToHome:any}> = ({goToHome}) => {
    const [list, setList] = useState<I_card[]>([
        { title: 'dasdas' },
        { title: 'tgryrthy' },
        { title: 'rtyrtuyrty' },
        { title: 'jyuthfgh' },
        { title: 'ghjghjfgbf' },
        { title: 'bfhfgbc' },
        { title: 'mjhgnn' },
        { title: 'ghnfvxff' },
        { title: 'bfsdvdf' },
    ]);

    return (
        <>
        <button className="msf" onClick={goToHome}>Go To Home</button>
        <DragList<I_card>
            data={list}
            onChange={(newList)=>setList(newList)}
            renderItem={(item, index) => ({
                inner: item.title,
                attrs: {
                    className: 'drag-card'
                }
            })}
        />
        </>
    );
}

export default DragAndDrop;
