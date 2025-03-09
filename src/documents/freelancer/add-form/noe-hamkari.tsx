import { FC, useContext } from "react";
import { useForm } from "./../../../npm/aio-input";
import { I_AddEmployeeContext } from "./../types";
import { AddEmployeeContext } from "./../context";

const NoeHamkari: FC = () => {
    const { getAddEmployeeModel, setAddEmployeeModel }: I_AddEmployeeContext = useContext(AddEmployeeContext)
    const noeHamkari_form = useForm<{ noeHamkari: number }>({
        initData: { noeHamkari: 0 },
        onSubmit: (data) => { 
            const addEmployeeModel = getAddEmployeeModel()
            const newModel = { ...addEmployeeModel, noeHamkari: data.noeHamkari }
            setAddEmployeeModel(newModel) 
        },
        liveSubmit: true,
        getLayout: (context) => {
            return {
                v: [
                    {
                        className: 'fs-12- m-b-12-', html: 'نوع همکاری را انتخاب کنید'
                    },
                    {
                        input: {
                            type: 'buttons', field: 'noeHamkari', label: '', required: true,
                            options: [
                                { text: 'اصلاح کننده آدرس', value: 1 },
                                { text: 'راننده فریلنسر', value: 0 },
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
export default NoeHamkari