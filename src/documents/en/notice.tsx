import { FC, ReactNode } from "react"

const Notice: FC<{ text: ReactNode }> = ({ text }) => {
    return (
        <div className="en-notice fafont">
            {text}
        </div>
    )
}
export default Notice