import { FC, useEffect, useRef, useState } from "react";
import { I_gridFilter, I_hub, I_row } from "./types";
import './index.css';
import { AI_switch, AISelect, AITable, AIText } from "../../npm/aio-input";
import Header from "./header";
import { CTX, FreelancerProvider, I_CTX } from "./context";
import usePopup from "../../npm/aio-popup";
import AddForm from "./add-form";
import Apis from "./apis";
import { Table } from "./table";
import { useGrid } from "./grid-filter-hook";
//http://192.168.78.243:8090/swagger-ui/index.html#/public-api/commonObjects
//http://192.168.78.243:20000/swagger-ui/index.html#/employee-api/create_2
const Provider: FC = () => {
    const base_url = 'http://boxi:40000'
    const token = 'eyJraWQiOiI2NmIzOTk1NC02YjFjLTQwNWYtOTIwOS1kYzQ4ZTNlMTM4MDQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJoLmJhcmF0aSIsInJvbGUiOlsiMTcwODE4NDY5ODg3MjI5MyJdLCJpc3MiOiJodHRwOlwvXC9ib3hpOjIwMDAwIiwibW9iaWxlIjoiMDk5MTc2MjI3NDUiLCJwbGF0Zm9ybSI6IlBMQVRGT1JNX0FETUlOIiwic3VwIjoieWVzIiwiYXVkIjoiZ2F0ZXdheS1jbGllbnQtaWQiLCJuYmYiOjE3NDE0MDc3NDYsInNjb3BlIjpbInByb2ZpbGUiXSwiaWQiOiI1NjEiLCJleHAiOjE3NDE0OTQxNDYsImlhdCI6MTc0MTQwNzc0NiwidXNlcm5hbWUiOiJoLmJhcmF0aSIsInN0YXR1cyI6IkVOQUJMRSJ9.nkv4gaAb7qBA1tizd7jBOTU0nxegKdcr3mI6y7j5QVCyd0YKVs9hC2xpo_JoMJjmy1DMp0Vksw25A3_9xoCMeigdyk4Lwxiunq8qiDQ-6zJRpafznnWnMXzxWXm8Se2Gn65Rct55x_ZvP89HQ1Llinwwg-g2hfeo0rozw1uNSkNmNC7sxbbCQcs0hoEdJwEaQyCG3jgv8SfU_YEtRVPajOEliBLNzkqiAvrSQbr5XhTpmhGSSmFh72JCrc1u-3xMzGxeLuemePrJ0MycQc1CalRNKwy8LAZ0DFsERuwhrp3RNgHiiWPLNMBJXgHU_zxuM82wsf90rEeIcbFcGfHQXw'
    const currenthub: I_hub = {
        "id": 2,
        "text": "هاب تهران",
    }
    const apisRef = useRef<Apis>(new Apis({ base_url, token }))
    const apis = apisRef.current
    const [options, setOptions] = useState<any>({})
    const fetchOptions = async () => {
        const res = await apis.enums()
        if (res) { setOptions(res) }
    }
    useEffect(() => { fetchOptions() }, [])
    if (!options) { return null }
    return <App apis={apis} options={options} currenthub={currenthub} />
}
export default Provider

const App: FC<{ apis: Apis, options: any, currenthub: I_hub }> = ({ apis, options, currenthub }) => {
    const popup = usePopup()
    const gridHook = useGrid({ currenthub, apis })
    const openAddModal = () => {
        popup.addModal({
            header: {
                title: 'ثبت نام راننده',
            },
            body: (
                <AddForm
                    onSubmit={() => {
                        popup.removeModal()
                    }}
                    onClose={() => popup.removeModal()}
                />
            )
        })
    }

    const switchConfig: AI_switch = { borderSize: 1, colors: ['#aaa', '#EF5644'] }
    return (
        <FreelancerProvider value={{
            gridHook, switchConfig, options, openAddModal
        }}>
            <div className="freelancer-grid fullscreen- flex-col- rtl- p-12- fs-12-">
                <div className="h-48- flex-row- align-v- p-h-12-">مدیریت پرسنل / پرسنل خارج از سازمان</div>
                <Header />
                <div className="h-12-"></div>
                <Table />
                {popup.render()}
            </div>
        </FreelancerProvider>
    )
}


const Plate: FC<{ type: 'motor_cycle' | 'car', value: string[], onChange: (v: string[]) => void }> = ({ type, value, onChange }) => {
    const change = (v: string, index: number) => onChange(value.map((str,i)=>i === index ? v:str))
    return (
        <div className="msf">
            {
                type === 'car' &&
                <>
                    <div className="msf">
                        <AIText maxLength={2} filter={['number']} value={value[0]} onChange={(v)=>change(v,0)}/>
                    </div>
                    <div className="msf">
                        <AISelect
                            options={['الف', 'ب', 'ت', 'ج', 'ح', 'د', 'ر', 'ز', 'ژ', 'س', 'ص', 'ط', 'ع', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه']}
                            option={{text: 'option',value: 'option'}} value={value[1]} onChange={(v)=>change(v,1)}
                        />
                    </div>
                    <div className="msf">
                        <AIText maxLength={3} filter={['number']} value={value[2]} onChange={(v)=>change(v,2)}/>
                    </div>
                    <div className="msf">
                        <div className="msf">
                            <AIText maxLength={2} filter={['number']} value={value[3]} onChange={(v)=>change(v,3)}/>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}