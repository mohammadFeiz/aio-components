import { FC, useEffect, useRef, useState } from "react";
import { I_addEmployeeModel, I_city, I_hub } from "./types";
import { AI_switch } from "./../../npm/aio-input";
import Header from "./header";
import { CTX, FreelancerProvider, I_CTX } from "./context";
import usePopup from "./../../npm/aio-popup";
import AddForm from "./add-form";
import Apis from "./apis";
import { Table } from "./table";
import { useGrid } from "./grid-filter-hook";
import './style.css';
import './index.css';
//http://192.168.78.243:8090/swagger-ui/index.html#/public-api/commonObjects
//http://192.168.78.243:20000/swagger-ui/index.html#/employee-api/create_2
const BoxitFreelancer: FC<{token:string}> = ({token}) => {
    const base_url = 'http://boxi:40000'
    const currenthub: I_hub = {
        "id": 2,
        "text": "هاب تهران",
    }
    const apisRef = useRef<Apis>(new Apis({ base_url, token }))
    const apis = apisRef.current
    const [options, setOptions] = useState<any>({})
    const [cities,setCities] = useState<I_city[]>([])
    const fetchOptions = async () => {
        const res = await apis.enums()
        if (res) { setOptions(res) }
    }
    const fetchCities = async ()=>{
        const res = await apis.cities()
        if(res){setCities(res)}
    }
    useEffect(() => { 
        fetchOptions();
        fetchCities()
    }, [])
    if (!options) { return null }
    return <App apis={apis} options={options} cities={cities} currenthub={currenthub} />
}
export default BoxitFreelancer
const App: FC<{ apis: Apis, options: any, currenthub: I_hub,cities:I_city[] }> = ({ apis, options, currenthub,cities }) => {
    const popup = usePopup()
    const gridHook = useGrid({ currenthub, apis })
    const openAddModal = () => {
        popup.addModal({
            header: {title: 'ثبت نام راننده'},
            body: (
                <AddForm onClose={() => popup.removeModal()} apis={apis} onSuccess={()=>gridHook.updateGrid()}/>
            )
        })
    }
    const openEditModal = async (id:number) => {
        popup.addModal({
            header: {title: 'ویرایش راننده'},
            body: (
                <AddForm 
                    onClose={() => popup.removeModal()} apis={apis} id={id} 
                    onSuccess={()=>gridHook.updateGrid(()=>popup.removeModal())}
                />
            )
        })
    }
    const openRemoveModal = async (id:number)=>{
        popup.addConfirm({
            title:'حذف راننده',
            text:'آیا از حذف راننده اطمینان دارید؟',
            onSubmit:async ()=>{
                const res = await apis.remove(id)
                if(res){
                    gridHook.updateGrid()
                }
                return res
            },
            submitText:'تایید',
            canselText:'لغو'
        })
    }
    const switchConfig: AI_switch = { borderSize: 1, colors: ['#aaa', '#EF5644'] }
    return (
        <FreelancerProvider value={{
            gridHook, switchConfig, options, openAddModal,popup,cities,openEditModal,openRemoveModal,apis
        }}>
            <div className="freelancer-grid flex-col- rtl- p-12- fs-12-">
                <div className="h-48- flex-row- align-v- p-h-12-">مدیریت پرسنل / پرسنل خارج از سازمان</div>
                <Header />
                <div className="h-12-"></div>
                <Table />
                {popup.render()}
            </div>
        </FreelancerProvider>
    )
}


