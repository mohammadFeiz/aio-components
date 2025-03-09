import { FC, useContext } from "react";
import { AITabs, useForm } from "./../../../npm/aio-input";
import { I_AddEmployeeContext, I_addEmployeeModel } from "../types";
import { AddEmployeeContext, useFreelancer } from "../context";

const EslahKonandeyeAddress: FC = () => {
    const { switchConfig } = useFreelancer()
    const { getAddEmployeeModel,setAddEmployeeModel,submit }: I_AddEmployeeContext = useContext(AddEmployeeContext)
    const { options,popup } = useFreelancer()
    const submit_eslahKonande = ()=>{
        submit()
    }
    const addEmployeeModel = getAddEmployeeModel()
    console.log(1,addEmployeeModel.eslahKonandeyeAddress.tab)
    const form = useForm<I_addEmployeeModel["eslahKonandeyeAddress"]>({
        initData: getAddEmployeeModel().eslahKonandeyeAddress, fa: true, inlineLabel: true,
        onSubmit: (newData) => {
            const addEmployeeModel = getAddEmployeeModel()
            const tab = addEmployeeModel.eslahKonandeyeAddress.tab
            const newEslahKonandeyeAddress = {...addEmployeeModel.eslahKonandeyeAddress,...newData}
            const newModel:I_addEmployeeModel = { ...addEmployeeModel, eslahKonandeyeAddress:{...newEslahKonandeyeAddress,tab} }
            setAddEmployeeModel(newModel)
        },
        liveSubmit: true,
        getLayout: (context) => {
            const rowCls = 'p-v-12- gap-16-'
            return {
                className: 'gap-16-',
                v: [
                    {
                        style:{display:addEmployeeModel.eslahKonandeyeAddress.tab !== 0?'none':undefined},
                        v: [
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'نام و نام خانوادگی', field: 'ettelaateFardi.name', type: 'text', required: true } },
                                    { flex: 1, input: { label: 'کد ملی', field: 'ettelaateFardi.nationalCode', type: 'text', required: true, validateType: "irNationalCode", filter: ['number'],maxLength:10 } },
                                    { flex: 1, input: { label: 'شماره موبایل', field: 'ettelaateFardi.mobile', type: 'text', required: true, validateType: "irMobile", filter: ['number'] },maxLength:11 },
                                    { flex: 1, input: { label: 'نام پدر', field: 'ettelaateFardi.fatherName', type: 'text', required: true } }
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'پست الکترونیکی', field: 'ettelaateFardi.email', type: 'text', validateType: 'email' } },
                                    { flex: 1, input: { label: 'تاریخ تولد', field: 'ettelaateFardi.birthDate', type: 'text' } },
                                    {
                                        flex: 1,
                                        input: {
                                            label: 'جنسیت', field: 'ettelaateFardi.gender', type: 'select', required: true,
                                            popover: { fitHorizontal: true },
                                            options: options.sexTypes.map((o:any)=>({text:o.value,value:o.key})),
                                        }
                                    },
                                    { flex: 1, input: { label: 'شماره تلفن ثابت', field: 'ettelaateFardi.phone', type: 'text', required: true, filter: ['number'] } },
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'شماره ضروری', field: 'ettelaateFardi.essentialPhone', type: 'text', required: true, filter: ['number'] } },
                                    {
                                        flex: 1,
                                        input: {
                                            label: 'شهر',
                                            search: 'جستجو',
                                            field: 'ettelaateFardi.shahr', type: 'select', options: options.cities.map((o:any)=>({text:o.value,value:o.key})), popover: { fitHorizontal: true },
                                        }
                                    },
                                    { flex: 1, input: { label: 'هاب', field: "ettelaateFardi.hub" as any, type: 'select', options: options.hubs.map((o:any)=>({text:o.name,value:o.id}))}},
                                    {
                                        flex: 1,
                                        input: {
                                            field: 'ettelaateFardi.isActive', label: '', type: 'checkbox', required: false,
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
                        style:{display:addEmployeeModel.eslahKonandeyeAddress.tab !== 1?'none':undefined},
                        v: [
                            {
                                className: rowCls,
                                h: [
                                    {
                                        flex: 1,
                                        input: {
                                            label: 'استان', field: 'shahrHayeMontasab.ostan', type: 'select', multiple: true, required: true,
                                            options: options.provinces.map((o:any)=>({text:o.value,value:o.key})), text: 'انتخاب استان',
                                        }
                                    },
                                    {
                                        flex: 1,
                                        input: {
                                            label: 'شهر', field: 'shahrHayeMontasab.shahr', type: 'select', multiple: true, required: true,
                                            search: 'جستجو',
                                            options: options.cities.map((o:any)=>({text:o.value,value:o.key})), text: 'انتخاب شهر'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        h:[
                            {html:'',flex:1},
                            {
                                html:(
                                    <button className="fl-button-2" onClick={()=>popup.removeModal()}>لغو</button>
                                )
                            },
                            {
                                html:(
                                    <button className="fl-button-1" onClick={submit_eslahKonande} disabled={context.isSubmitDisabled()}>افزودن و تایید</button>
                                )
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
                style={{ height: 36 }}
                options={[
                    { text: 'اطلاعات فردی', value: 0 },
                    { text: 'شهر های منتسب', value: 1 }
                ]}
                value={addEmployeeModel.eslahKonandeyeAddress.tab}
                option={{ justify: () => true, style: () => ({ flex: 1 }) }}
                onChange={(tab) => {
                    const addEmployeeModel = getAddEmployeeModel()
                    const newModel:I_addEmployeeModel = { ...addEmployeeModel, eslahKonandeyeAddress: { ...addEmployeeModel.eslahKonandeyeAddress, tab } }
                    setAddEmployeeModel(newModel)
                }}
            />
            {form.renderLayout}
        </div>
    )
}
export default EslahKonandeyeAddress