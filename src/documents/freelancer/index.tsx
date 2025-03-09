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
    const token = 'eyJraWQiOiJhMGNiNDE2NS03M2VjLTRjMDgtODRhMS0yNGUyMDI3M2I2YzciLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJoLmJhcmF0aSIsInJvbGUiOlsiMTcwODE4NDY5ODg3MjI5MyJdLCJpc3MiOiJodHRwOlwvXC9ib3hpOjIwMDAwIiwibW9iaWxlIjoiMDk5MTc2MjI3NDUiLCJwbGF0Zm9ybSI6IlBMQVRGT1JNX0FETUlOIiwic3VwIjoieWVzIiwiYXVkIjoiZ2F0ZXdheS1jbGllbnQtaWQiLCJuYmYiOjE3NDE1MjY2NDEsInNjb3BlIjpbInByb2ZpbGUiXSwiaWQiOiI1NjEiLCJleHAiOjE3NDE2MTMwNDEsImlhdCI6MTc0MTUyNjY0MSwidXNlcm5hbWUiOiJoLmJhcmF0aSIsInN0YXR1cyI6IkVOQUJMRSJ9.aGtzeFMimNQXmbnqZsHwLpaCfzcfa3WHmdVtUqv_cVqmj7gWja1qP2eWJa583FjN3hTT2Sq1oMohdG1JswA-27PN2cJp0GRjrkaTEAqJr4CIrK7fpoE59cURqyZo9fjRq3UZpHvbfQhnkMIM3XyEgjmSrJvbYsucHyDSQ6doXB4y71R2BKAnoPvneVTvA4R1VOwQSM6hkZcfTJ2jx2UOE6xpxW5mdqQBV2wqIp58GojVqFbagZniFun1-DJg7oyhBgQd9CYlL2UWkS_qlQpdrIJDxhsm46W3tx9Omwiz9GwNhblFNvyM8bqm4qkaEwD2XPxzgeKnEm778Gp8yCuLMA'
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


