import { FC, useContext } from "react"
import { I_AddEmployeeContext, I_addEmployeeModel } from "../types"
import { AddEmployeeContext } from "../context"
import { useForm } from "../../../npm/aio-input"

const EslahKonadeyeAddress_EttelaateFardi: FC = () => {
    const { addEmployeeModel, changeAddEmployeeModel, options }: I_AddEmployeeContext = useContext(AddEmployeeContext)
    const form = useForm<I_addEmployeeModel["eslahKonandeyeAddress"]["ettelaateFardi"]>({
        initData: addEmployeeModel.eslahKonandeyeAddress.ettelaateFardi, fa: true,
        onSubmit: (ettelaateFardi) => changeAddEmployeeModel({ ...addEmployeeModel, eslahKonandeyeAddress: { ...addEmployeeModel.eslahKonandeyeAddress, ettelaateFardi } }),
        liveSubmit: true,
        getLayout: (context) => {
            return {
                v: [
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            { flex: 1, input: { label: 'نام و نام خانوادگی', field: 'name', type: 'text', required: true } },
                            { flex: 1, input: { label: 'کد ملی', field: 'codeMelli', type: 'text', required: true, validateType: "irNationalCode", filter: ['number'] } },
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
                                    label: 'جنسیت', field: 'jensiat', type: 'select', required: true,
                                    options: options.jensiat
                                }
                            },
                            { flex: 1, input: { label: 'شماره تلفن ثابت', field: 'phone', type: 'text', required: true, filter: ['number'] } },
                        ]
                    },
                    {
                        className: 'p-v-12- gap-16-', h: [
                            { flex: 1, input: { label: 'شماره ضروری', field: 'shomareZarori', type: 'text', required: true, filter: ['number'] } },
                            { flex: 1, input: { label: 'شهر', field: 'shahr', type: 'select', options: options.shahr, popover: { fitHorizontal: true } } },
                            {
                                flex: 2, attrs: { style: { paddingTop: 6 } },
                                input: {
                                    field: 'faal', label: '', type: 'checkbox', required: false,
                                    switch: { borderSize: 1, colors: ['#aaa', '#EF5644'] },
                                    text: 'فعال'
                                }
                            },
                            { flx: 1, html: '' }
                        ]
                    },
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            { flex: 1, input: { label: 'آدرس محل سکونت', field: 'address', type: 'text', required: true } }
                        ]
                    }
                ]
            }
        }
    })
    return <>{form.renderLayout}</>
}
export default EslahKonadeyeAddress_EttelaateFardi