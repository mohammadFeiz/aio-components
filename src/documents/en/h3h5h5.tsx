import { FC } from "react"
import { I_pair } from "./types"

const H3H5H5: FC<{ title: string,pair:I_pair }> = ({ title,pair }) => {
    return (
        <div className="en-panel">
            <div className='en-header'>{title}</div>
            <div className="en-body">
                <div>{pair.en}</div>
                <div>{pair.fa}</div>
            </div>
        </div>
    )
}
export default H3H5H5