import { FC, ReactNode } from "react"
import { I_pair } from "./types"

const H3H5H5: FC<{ title: string,pair?:I_pair,desc?:ReactNode }> = ({ title,pair,desc }) => {
    return (
        <div className="en-panel fafont">
            <div className='en-header'>{title}</div>
            <div className="en-body">
                {!!desc && <div className="rtl">{desc}</div>}
                {!!pair && <div>{pair.en}</div>}
                {!!pair && <div>{pair.fa}</div>}
            </div>
        </div>
    )
}
export default H3H5H5