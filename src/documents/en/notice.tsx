import { FC, ReactNode } from "react"
import { I_pair } from "./types"

const Notice: FC<{ text: ReactNode }> = ({ text }) => {
    return (
        <div className="en-notice fafont">
            {text}
        </div>
    )
}
export default Notice