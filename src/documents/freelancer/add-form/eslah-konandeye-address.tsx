import { FC, useContext } from "react";
import { AITabs, useForm } from "../../../npm/aio-input";
import { I_AddEmployeeContext, I_addEmployeeModel } from "../types";
import { AddEmployeeContext, useFreelancer } from "../context";

const EslahKonandeyeAddress: FC = () => {
    const {switchConfig} = useFreelancer()
    const { addEmployeeModel, options, changeAddEmployeeModel }: I_AddEmployeeContext = useContext(AddEmployeeContext)
    const form = useForm<I_addEmployeeModel["eslahKonandeyeAddress"]>({
        initData: addEmployeeModel.eslahKonandeyeAddress, fa: true,inlineLabel:true,
        onSubmit: (eslahKonandeyeAddress) => changeAddEmployeeModel({ ...addEmployeeModel, eslahKonandeyeAddress }),
        liveSubmit: true,
        getLayout: (context) => {
            const rowCls = 'p-v-12- gap-16-'
            return {
                className: 'gap-16-',
                v:[
                    {
                        show:addEmployeeModel.eslahKonandeyeAddress.tab === 0,
                        v:[
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'نام و نام خانوادگی', field: 'ettelaateFardi.name', type: 'text', required: true } },
                                    { flex: 1, input: { label: 'کد ملی', field: 'ettelaateFardi.codeMelli', type: 'text', required: true, validateType: "irNationalCode", filter: ['number'] } },
                                    { flex: 1, input: { label: 'شماره موبایل', field: 'ettelaateFardi.mobile', type: 'text', required: true, validateType: "irMobile", filter: ['number'] } },
                                    { flex: 1, input: { label: 'نام پدر', field: 'ettelaateFardi.namePedar', type: 'text', required: true } }
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'پست الکترونیکی', field: 'ettelaateFardi.email', type: 'text', validateType: 'email' } },
                                    { flex: 1, input: { label: 'تاریخ تولد', field: 'ettelaateFardi.tarikheTavallod', type: 'text' } },
                                    {
                                        flex: 1,
                                        input: {
                                            label: 'جنسیت', field: 'ettelaateFardi.jensiat', type: 'select', required: true,
                                            options: options.jensiat
                                        }
                                    },
                                    { flex: 1, input: { label: 'شماره تلفن ثابت', field: 'ettelaateFardi.phone', type: 'text', required: true, filter: ['number'] } },
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'شماره ضروری', field: 'ettelaateFardi.shomareZarori', type: 'text', required: true, filter: ['number'] } },
                                    { flex: 1, input: { label: 'شهر', field: 'ettelaateFardi.shahr', type: 'select', options: options.shahr, popover: { fitHorizontal: true } } },
                                    {
                                        flex: 2,
                                        input: {
                                            field: 'ettelaateFardi.faal', label: '', type: 'checkbox', required: false,
                                            switch: switchConfig,
                                            text: 'فعال'
                                        }
                                    },
                                    { flx: 1, html: '' }
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'آدرس محل سکونت', field: 'ettelaateFardi.address', type: 'text', required: true } }
                                ]
                            }
                        ]
                    },
                    {
                        show:addEmployeeModel.eslahKonandeyeAddress.tab === 1,
                        v:[
                            {
                                className: rowCls,
                                h: [
                                    {
                                        flex: 1,
                                        input: {
                                            label: 'استان', field: 'shahrHayeMontasab.ostan', type: 'select', multiple: true, required: true,
                                            options: options.ostan, text: 'انتخاب استان'
                                        }
                                    },
                                    {
                                        flex: 1,
                                        input: {
                                            label: 'شهر', field: 'shahrHayeMontasab.shahr', type: 'select', multiple: true, required: true,
                                            options: options.shahr, text: 'انتخاب شهر'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="flex-col- gap-16-">
            <AITabs
                style={{ height: 36 }} options={options.eslahKonandeyeAddressTab} value={addEmployeeModel.eslahKonandeyeAddress.tab}
                option={{ justify: () => true, style: () => ({ flex: 1 }) }}
                onChange={(tab) => changeAddEmployeeModel({ ...addEmployeeModel, eslahKonandeyeAddress: { ...addEmployeeModel.eslahKonandeyeAddress, tab } })}
            />
            {form.renderLayout}
        </div>
    )
}
export default EslahKonandeyeAddress