import { FC, useRef, useState } from "react";
import { I_AddEmployeeContext, I_addEmployeeModel,  } from "../types";
import { AddEmployeeContext } from "../context";
import NoeHamkari from "./noe-hamkari";
import EslahKonandeyeAddress from "./eslah-konandeye-address";
import Freelancer from "./freelancer";

const AddForm: FC<{onSubmit:(v:I_addEmployeeModel)=>void,onClose:()=>void}> = ({onSubmit,onClose}) => {
    const [addEmployeeModel, setAddEmployeeModel] = useState<I_addEmployeeModel>(getDefaultModel)
    function getDefaultModel(){
        return {
            noeHamkari: 0,
            eslahKonandeyeAddress: {
                tab: 0,
                ettelaateFardi: {
                    isActive: true,
                },
                shahrHayeMontasab: {
    
                }
            },
            freelancer: {
                tab: 0,
                ettelaateFardi: {
                    isActive: true,
                },
                ettelaateKhodro: {
    
                },
                tasvireMadarek: {
    
                }
    
            }
        }
    }
    const resetEmployeeModel = ()=>{
        setAddEmployeeModel(getDefaultModel())
    }
    const addEmployeeModelRef = useRef<I_addEmployeeModel>(addEmployeeModel)
    addEmployeeModelRef.current = addEmployeeModel
    const getAddEmployeeModel = ()=>addEmployeeModelRef.current
    const submit = ()=>{
        onSubmit(addEmployeeModelRef.current);
        onClose()
    }
    const getContext = ():I_AddEmployeeContext=>{
        return {getAddEmployeeModel,setAddEmployeeModel,submit,resetEmployeeModel}
    }
    return (
        <AddEmployeeContext.Provider value={getContext()}>
            <div className="p-12-">
                <NoeHamkari/>
                {addEmployeeModel.noeHamkari === 1 && <EslahKonandeyeAddress/>}
                {addEmployeeModel.noeHamkari === 0 && <Freelancer/>} 
            </div>
        </AddEmployeeContext.Provider>
    )
}
export default AddForm


