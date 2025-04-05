import { FC, useEffect } from "react";
import { useForm } from "./../../../npm/aio-input";
import { I_ettelaateFardi } from "../types";
import { useFreelancer } from "../context";

const EttelaateFardi: FC<{
    data:Partial<I_ettelaateFardi>,
    onChange:(v:I_ettelaateFardi)=>void,
    setDisabled:(v:boolean)=>void
}> = (props) => {
    const { switchConfig } = useFreelancer()
    const { options, popup,cities } = useFreelancer()
    const form = useForm<I_ettelaateFardi>({
        initData: props.data, fa: true, inlineLabel: true,
        onChange: (data) => {
            props.onChange(data);
            const disabled = form.isSubmitDisabled()
            props.setDisabled(disabled)
        },
        getLayout: (context) => {
            const rowCls = 'p-v-12- gap-16-'
            return {
                className: 'gap-16-',
                v: [
                    {
                        v: [
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'نام و نام خانوادگی', field: 'name', type: 'text', required: true } },
                                    { flex: 1, input: { label: 'کد ملی', field: 'nationalCode', type: 'text', required: true, validateType: "irNationalCode" } },
                                    { flex: 1, input: { label: 'شماره موبایل', field: 'mobile', type: 'text', required: true, validateType: "irMobile", filter: ['number'] } },
                                    { flex: 1, input: { label: 'نام پدر', field: 'fatherName', type: 'text', required: true } }
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'پست الکترونیکی', field: 'email', type: 'text', validateType: 'email' } },
                                    { flex: 1, input: { label: 'تاریخ تولد', field: 'birthDate', type: 'date',jalali:true,size:18 } },
                                    {
                                        flex: 1,
                                        input: {
                                            label: 'جنسیت', field: 'gender' as any, type: 'select', required: true,
                                            options: options.sexTypes.map((o:any)=>({text:o.value,value:o.key})),
                                            popover: { fitHorizontal: true }
                                        }
                                    },
                                    { flex: 1, input: { label: 'شماره تلفن ثابت', field: 'phone', type: 'text', required: true } },
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'شماره ضروری', field: 'essentialPhone', type: 'text', required: true } },
                                    {
                                        flex: 1,
                                        input: {
                                            label: 'شهر', field: 'shahr', type: 'select', search: 'جستجو',
                                            options: cities.map((o:any)=>({text:o.text,value:o.id}))
                                        }
                                    },
                                    { flex: 1, input: { label: 'هاب', field: "hub" as any,search:'جستجو', type: 'select', options: options.hubs.map((o:any)=>({text:o.name,value:o.id}))}},
                                    { flex: 1, input: { field: 'isActive', label: '', type: 'checkbox', required: true, switch: switchConfig, text: 'فعال' } },

                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'آدرس محل سکونت', field: 'address', type: 'text', required: true } }
                                ]
                            },
                            
                        ]
                    }
                ]
            }
        }
    })
    useEffect(()=>{
        const res = form.errors.getErrorsList()
        props.setDisabled(!!res.length)
    },[])
    return <>{form.renderLayout}</>
}
export default EttelaateFardi


