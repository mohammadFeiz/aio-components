import { FC, ReactNode, useContext } from "react"
import { I_ENCTX, I_pair } from "./types"
import ENCTX from "./context"

const H3H5H5: FC<{ title: string, pairId?: string, desc?: ReactNode }> = ({ title, pairId, desc }) => {
    const { getPair, pairs }: I_ENCTX = useContext(ENCTX)
    const pairIds = pairId ? pairId.split(',') : []
    const pairsResult = pairIds.map((pairId) => getPair(pairId))
    return (
        <div className="en-panel fafont">
            <div className='en-header'>{title}</div>
            <div className="en-body">
                {!!desc && <div className="rtl">{desc}</div>}
                <div className="flex-col">
                    {
                        pairsResult.map((pair: I_pair) => {
                            return (
                                <div className='flex-col m-v-12'>
                                    <div>{pair.en}</div>
                                    <div>{pair.fa}</div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}
export default H3H5H5