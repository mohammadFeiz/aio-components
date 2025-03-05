import { FC, useEffect, useRef, useState } from "react";
import { I_gridFilter, I_hub, I_row } from "./types";
import './index.css';
import { AI_switch, AITable } from "../../npm/aio-input";
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
    const token = 'eyJraWQiOiI2NmIzOTk1NC02YjFjLTQwNWYtOTIwOS1kYzQ4ZTNlMTM4MDQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJoLmJhcmF0aSIsInJvbGUiOlsiMTcwODE4NDY5ODg3MjI5MyJdLCJpc3MiOiJodHRwOlwvXC9ib3hpOjIwMDAwIiwibW9iaWxlIjoiMDk5MTc2MjI3NDUiLCJwbGF0Zm9ybSI6IlBMQVRGT1JNX0FETUlOIiwic3VwIjoieWVzIiwiYXVkIjoiZ2F0ZXdheS1jbGllbnQtaWQiLCJuYmYiOjE3NDExNTkxNTksInNjb3BlIjpbInByb2ZpbGUiXSwiaWQiOiI1NjEiLCJleHAiOjE3NDEyNDU1NTksImlhdCI6MTc0MTE1OTE1OSwidXNlcm5hbWUiOiJoLmJhcmF0aSIsInN0YXR1cyI6IkVOQUJMRSJ9.MUJoRTM5t_IGFrlRYNp64H-Ndii5pPgph-KEIHFadXFjkv3GyZEBddpKBgP1BzI6I3tBDbMLcBkuhbVpWcp0vNo8nX6xkcIDoWinvlOUVgw-NJz2hSh14P0dGsNJwMiDjkhunNTMatWb0K1Q392fueHCdh7KKa8kCyrn4bTX80ceayL7mhlpbx9Ef_yEnVe2CKcTq1TO5-BcHYlo7PvB17vljOuW9jvdomJNX2OgulV9vjwYJE6Np7hUaMIHaFYUd254ZkbJ_jKuFSXop2Bo_fJ1XNE_3REdnFxXyl7FnzXlXvCMa-y_7CHUGSN6GT5ypKVqUIuGSmFvNSFofodjdA'
    const currenthub: I_hub = {
        "id": 2,
        "text": "هاب تهران",
    }
    const apisRef = useRef<Apis>(new Apis({ base_url, token }))
    const apis = apisRef.current
    const [options, setOptions] = useState<any>({})
    const fetchOptions = async () => {
        const res = await apis.enums()
        if (res) {setOptions(res)}
    }
    useEffect(() => {fetchOptions()}, [])
    if (!options) { return null }
    return <App apis={apis} options={options} currenthub={currenthub} />
}
export default Provider

const App: FC<{ apis: Apis, options: any, currenthub: I_hub }> = ({ apis, options, currenthub }) => {
    const popup = usePopup()
    const gridHook = useGrid({currenthub,apis})
    const openAddModal = () => {
        popup.addModal({
            header: {
                title: 'ثبت نام راننده',
            },
            body: (
                <AddForm 
                    onSubmit={()=>{
                        popup.removeModal()
                    }}
                    onClose={()=>popup.removeModal()}
                />
            )
        })
    }
    
    const switchConfig: AI_switch = { borderSize: 1, colors: ['#aaa', '#EF5644'] }
    return (
        <FreelancerProvider value={{
            gridHook, switchConfig, options,openAddModal
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


