import { FC, useContext } from "react"
import { I_AddEmployeeContext, I_addEmployeeModel } from "../types"
import {AddEmployeeContext} from "../context"
import { useForm } from "../../../npm/aio-input"

const Freelancer_EttelaateFardi: FC = () => {
    const { addEmployeeModel ,options }: I_AddEmployeeContext = useContext(AddEmployeeContext)
    const form = useForm<I_addEmployeeModel["freelancer"]["ettelaateFardi"]>({
        initData: addEmployeeModel.freelancer.ettelaateFardi, fa: true,
        getLayout: (context) => {
            return {
                v: [
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            { flex: 1, input: { label: 'نام و نام خانوادگی', field: 'name', type: 'text', required: true } },
                            { flex: 1, input: { label: 'کد ملی', field: 'codeMelli', type: 'text', required: true, validateType: "irNationalCode" } },
                            { flex: 1, input: { label: 'شماره موبایل', field: 'mobile', type: 'text', required: true, validateType: "irMobile", filter: ['number'] } },
                            { flex: 1, input: { label: 'نام پدر', field: 'namePedar', type: 'text', required: true } }
                        ]
                    },
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            { flex: 1, input: { label: 'پست الکترونیکی', field: 'email', type: 'text', validateType: 'email' } },
                            { flex: 1, input: { label: 'تاریخ تولد', field: 'tarikheTavallod', type: 'text' } },
                            {
                                flex: 1,
                                input: {
                                    label: 'جنسیت', field: 'jensiat.id' as any, type: 'select', required: true,
                                    options: options.jensiat, option: { text: 'option.text', value: 'option.id' }
                                }
                            },
                            { flex: 1, input: { label: 'شماره تلفن ثابت', field: 'telefoneSabet', type: 'text', required: true } },
                        ]
                    },
                    {
                        className: 'p-v-12- gap-16-', h: [
                            { flex: 1, input: { label: 'شماره ضروری', field: 'telefoneZaroori', type: 'text', required: true } },
                            { flex: 1, input: { label: 'شهر', field: 'shahr', type: 'select', options: options.shahr, option: { text: 'option.text', value: 'option.id' } } },
                            { flex: 1, input: { label: 'هاب', field: "hub.id" as any, type: 'select', options: options.hub, option: { text: 'option.text', value: 'option.id' } } },
                            { flex: 1, input: { label: 'فعال', field: 'faal', type: 'checkbox', required: true } },

                        ]
                    },
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            { flex: 1, input: { label: 'آدرس محل سکونت', field: 'address', type: 'text', required: true } }
                        ]
                    },
                    {
                        h: [
                            { flex: 1, input: { field: 'shomareGavahiname', label: 'شماره گواهینامه', required: true, type: 'text' } },
                            { flex: 1, input: { field: 'shomareSheba', label: 'شماره شبا', required: true, type: 'text' } },
                            { flex: 1, input: { field: 'shomareSafte', label: 'شماره سفته', required: true, type: 'text' } },
                            { flex: 1, input: { field: 'shomareGharardad', label: 'شماره قرارداد', required: true, type: 'text' } }
                        ]
                    },

                ]
            }
        }
    })
    return <>{form.renderLayout}</>
}
export default Freelancer_EttelaateFardi