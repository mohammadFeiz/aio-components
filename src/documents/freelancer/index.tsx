import { FC, useEffect, useRef, useState } from "react";
import { I_hub } from "./types";
import './index.css';
import { AI_switch } from "./../../npm/aio-input";
import Header from "./header";
import { CTX, FreelancerProvider, I_CTX } from "./context";
import usePopup from "./../../npm/aio-popup";
import AddForm from "./add-form";
import Apis from "./apis";
import { Table } from "./table";
import { useGrid } from "./grid-filter-hook";
//http://192.168.78.243:8090/swagger-ui/index.html#/public-api/commonObjects
//http://192.168.78.243:20000/swagger-ui/index.html#/employee-api/create_2
const BoxitFreelancer: FC = () => {
    const base_url = 'http://boxi:40000'
    const token = 'eyJraWQiOiIxYTA5NWVmYy1lMmRjLTQzYWMtOGE3Ny05NGM4Y2QzMWU3MzciLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJoLmJhcmF0aSIsInJvbGUiOlsiMTcwODE4NDY5ODg3MjI5MyJdLCJpc3MiOiJodHRwOlwvXC9ib3hpOjIwMDAwIiwibW9iaWxlIjoiMDk5MTc2MjI3NDUiLCJwbGF0Zm9ybSI6IlBMQVRGT1JNX0FETUlOIiwic3VwIjoieWVzIiwiYXVkIjoiZ2F0ZXdheS1jbGllbnQtaWQiLCJuYmYiOjE3NDE1MjIxMjQsInNjb3BlIjpbInByb2ZpbGUiXSwiaWQiOiI1NjEiLCJleHAiOjE3NDE2MDg1MjQsImlhdCI6MTc0MTUyMjEyNCwidXNlcm5hbWUiOiJoLmJhcmF0aSIsInN0YXR1cyI6IkVOQUJMRSJ9.bcyn9u8y8K4SuRE4TC6rC7ud2A3ZnvWbJjTUNSFOGcIXCWnmg-kXCkuBUwXtSofp9l0pOJ9qsS5I8NqtYVVPdGxueywER_ucdLqc2tsqIxJk9-QIexrnq_k2aXvb_EIMUMHdGTL8FjFnQlL8LxaCBMDp3yfjJY8-brNQXbYWh5_Z6lffMgZm_bwyaDODUL01wTLgy1k6lFK_nx2wUZ73_MGOCzGTbE2Ko2I02MnUTto4PJ0DMmW_gi_ur8WSO94ftIYYbfBA5d6t2yvcwjY5mRnRLLq709DhK-a5JOX679e6iWwbZr3HScZ2v1VF5A5-edQxUyCebH-85euqeWeCeg'
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
export default BoxitFreelancer
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
                    onSubmit={async (model) => {
                        const res = await apis.add(model)
                        if(res){popup.removeModal()} 
                    }}
                    onClose={() => popup.removeModal()}
                />
            )
        })
    }

    const switchConfig: AI_switch = { borderSize: 1, colors: ['#aaa', '#EF5644'] }
    return (
        <FreelancerProvider value={{
            gridHook, switchConfig, options, openAddModal,popup
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


