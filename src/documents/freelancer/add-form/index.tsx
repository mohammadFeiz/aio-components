import { FC, useContext, useRef, useState } from "react";
import { I_addEmployeeModel, } from "../types";
import { AddEmployeeContext } from "../context";
import EslahKonandeyeAddress from "./eslah-konandeye-address";
import Freelancer from "./freelancer";
import Apis from "../apis";
import { useForm } from "./../../../npm/aio-input";

const AddForm: FC<{ onClose: () => void, apis: Apis,id?:number,onSuccess:()=>void }> = ({ onClose, apis,id,onSuccess }) => {
    const [noeHamkari,setNoeHamkari] = useState<0 | 1>(1)
    const type = id !== undefined?'edit':'add'
    return (
        <div className="p-12-">
            <NoeHamkari value={noeHamkari} onChange={(noeHamkari)=>setNoeHamkari(noeHamkari)} disabled={type === 'edit'}/>
            {noeHamkari === 1 && <EslahKonandeyeAddress id={id}/>}
            {noeHamkari === 0 && <Freelancer id={id}/>}
        </div>
    )
}
export default AddForm


const NoeHamkari: FC<{value:0 | 1,onChange:(v:0  | 1)=>void,disabled:boolean}> = ({value,onChange,disabled}) => {
    const noeHamkari_form = useForm<{ value: 0 | 1 }>({
        initData: { value },
        onChange: (data) => onChange(data.value),
        getLayout: (context) => {
            return {
                v: [
                    {
                        className: 'fs-12- m-b-12-', html: 'نوع همکاری را انتخاب کنید'
                    },
                    {
                        input: {
                            type: 'buttons', field: 'value', label: '', required: true,
                            options: [
                                { text: 'اصلاح کننده آدرس', value: 1 ,disabled},
                                { text: 'راننده فریلنسر', value: 0 ,disabled},
                            ],
                            option: {
                                justify: () => true,
                                className: (option, { active }) => {
                                    return `br-24- flex-1- bg-d-3- ${active ? 'op-100- c-2- brd-c-1-' : 'op-50- c-4-'}`
                                }
                            }
                        }
                    },

                ]
            }
        }
    })
    return <>{noeHamkari_form.renderLayout}</>
}