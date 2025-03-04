import { FC, useState } from "react";
import { I_AddEmployeeContext, I_addEmployeeModel,  } from "../types";
import { AddEmployeeContext } from "../context";
import NoeHamkari from "./noe-hamkari";
import EslahKonandeyeAddress from "./eslah-konandeye-address";
import Freelancer from "./freelancer";

const AddForm: FC = () => {
    const options: any = {
        shahr: [
            { text: 'تهران - تهران', value: 0 },
            { text: 'تهران - ورامین', value: 1 },
            { text: 'تهران - اندیشه', value: 2 }
        ],
        ostan: [
            { text: 'تهران', value: '0' },
            { text: 'اصفهان', value: '1' }
        ],
        noeHamkari: [
            { text: 'اصلاح کننده آدرس', value: 0 },
            { text: 'راننده فریلنسر', value: 1 },
        ],
        eslahKonandeyeAddressTab: [
            { text: 'اطلاعات فردی', value: 0 },
            { text: 'شهر های منتسب', value: 1 }
        ],
        freelancerTab: [
            { text: 'اطلاعات فردی', value: 0 },
            { text: 'اطلاعات خودرو', value: 1 },
            { text: 'تصویر مدارک', value: 2 }
        ],
        jensiat: [
            { text: 'مرد', value: 0 },
            { text: 'زن', value: 1 },
        ],
        hub: [
            { text: 'تهران', value: '0' },
            { text: 'اصغهان', value: '1' }
        ],

    }
    
    const [addEmployeeModel, setAddEmployeeModel] = useState<I_addEmployeeModel>({
        noeHamkari: 0,
        eslahKonandeyeAddress: {
            tab: 0,
            ettelaateFardi: {
                faal: true,
            },
            shahrHayeMontasab: {

            }
        },
        freelancer: {
            tab: 0,
            ettelaateFardi: {
                faal: true
            },
            ettelaateKhodro: {

            },
            tasvireMadarek: {

            }

        }
    })
    const changeAddEmployeeModel = (addEmployeeModel:I_addEmployeeModel)=>{
        setAddEmployeeModel(addEmployeeModel)
    }
    const getContext = ():I_AddEmployeeContext=>{
        return {options,addEmployeeModel,changeAddEmployeeModel}
    }
    return (
        <AddEmployeeContext.Provider value={getContext()}>
            <div className="p-12-">
                <NoeHamkari/>
                {addEmployeeModel.noeHamkari === 0 && <EslahKonandeyeAddress/>}
                {addEmployeeModel.noeHamkari === 1 && <Freelancer/>} 
            </div>
        </AddEmployeeContext.Provider>
    )
}
export default AddForm