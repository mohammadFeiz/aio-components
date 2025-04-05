import { FC } from "react"

const Footer: FC<{ onSubmit: () => void, onClose: () => void, isDisabled: () => boolean }> = ({ onSubmit, onClose, isDisabled }) => {
    return (
        <div className="flex-row- align-v- gap-12-">
            <div className="flex-1-"></div>
            <button className="fl-button-2" onClick={onClose}>لغو</button>
            <button className="fl-button-1" disabled={isDisabled()} onClick={onSubmit}>ذخیره</button>
        </div>
    )
}

export default Footer