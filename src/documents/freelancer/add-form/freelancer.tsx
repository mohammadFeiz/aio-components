import { FC, useContext } from "react";
import { AITabs, I_formNode, useForm } from "../../../npm/aio-input";
import { I_AddEmployeeContext, I_addEmployeeModel } from "../types";
import { AddEmployeeContext, useFreelancer } from "../context";

const Freelancer: FC = () => {
    const { switchConfig } = useFreelancer()
    const { options, addEmployeeModel, changeAddEmployeeModel }: I_AddEmployeeContext = useContext(AddEmployeeContext)
    const getImageLayout = (label: string, field: any): I_formNode<I_addEmployeeModel["freelancer"]> => {
        return {
            className: 'gap-16- flex-1-',
            v: [
                { html: label, align: 'vh', className: 'fs-12-' },
                {
                    flex: 1, align: 'vh',
                    input: {
                        field, label: '', type: 'image', style: { width: '100%', border: '1px dashed #aaa' }, imageAttrs: { style: { width: '100%' } },
                        placeholder: (
                            <div className="flex-col- align-vh- c-8-">
                                <div className="msf">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.6654 19.768V24.0013C14.6654 24.3791 14.7931 24.6957 15.0487 24.9513C15.3043 25.2069 15.6209 25.3346 15.9987 25.3346C16.3765 25.3346 16.6931 25.2069 16.9487 24.9513C17.2043 24.6957 17.332 24.3791 17.332 24.0013V19.768L18.532 20.968C18.6654 21.1013 18.8154 21.2013 18.982 21.268C19.1487 21.3346 19.3154 21.3624 19.482 21.3513C19.6487 21.3402 19.8098 21.3013 19.9654 21.2346C20.1209 21.168 20.2654 21.068 20.3987 20.9346C20.6431 20.668 20.7709 20.3569 20.782 20.0013C20.7931 19.6457 20.6654 19.3346 20.3987 19.068L16.932 15.6013C16.7987 15.468 16.6543 15.3735 16.4987 15.318C16.3431 15.2624 16.1765 15.2346 15.9987 15.2346C15.8209 15.2346 15.6543 15.2624 15.4987 15.318C15.3431 15.3735 15.1987 15.468 15.0654 15.6013L11.5987 19.068C11.332 19.3346 11.2043 19.6457 11.2154 20.0013C11.2265 20.3569 11.3654 20.668 11.632 20.9346C11.8987 21.1791 12.2098 21.3069 12.5654 21.318C12.9209 21.3291 13.232 21.2013 13.4987 20.9346L14.6654 19.768ZM7.9987 29.3346C7.26536 29.3346 6.63759 29.0735 6.11536 28.5513C5.59314 28.0291 5.33203 27.4013 5.33203 26.668V5.33464C5.33203 4.6013 5.59314 3.97352 6.11536 3.4513C6.63759 2.92908 7.26536 2.66797 7.9987 2.66797H17.5654C17.9209 2.66797 18.2598 2.73464 18.582 2.86797C18.9043 3.0013 19.1876 3.19019 19.432 3.43464L25.8987 9.9013C26.1431 10.1457 26.332 10.4291 26.4654 10.7513C26.5987 11.0735 26.6654 11.4124 26.6654 11.768V26.668C26.6654 27.4013 26.4043 28.0291 25.882 28.5513C25.3598 29.0735 24.732 29.3346 23.9987 29.3346H7.9987ZM17.332 10.668V5.33464H7.9987V26.668H23.9987V12.0013H18.6654C18.2876 12.0013 17.9709 11.8735 17.7154 11.618C17.4598 11.3624 17.332 11.0457 17.332 10.668Z" fill="#999999" />
                                    </svg>
                                </div>
                                <div className="msf">انتخاب تصویر</div>
                            </div>
                        )
                    }
                }
            ]
        }
    }
    const form = useForm<I_addEmployeeModel["freelancer"]>({
        initData: addEmployeeModel.freelancer, fa: true,inlineLabel:true,
        getLayout: (context) => {
            const rowCls = 'p-v-12- gap-16-'
            return {
                className: 'gap-16-',
                v: [
                    {
                        show: addEmployeeModel.freelancer.tab === 0,
                        v: [
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'نام و نام خانوادگی', field: 'ettelaateFardi.name', type: 'text', required: true } },
                                    { flex: 1, input: { label: 'کد ملی', field: 'ettelaateFardi.codeMelli', type: 'text', required: true, validateType: "irNationalCode" } },
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
                                            label: 'جنسیت', field: 'ettelaateFardi.jensiat.id' as any, type: 'select', required: true,
                                            options: options.jensiat, option: { text: 'option.text', value: 'option.id' }
                                        }
                                    },
                                    { flex: 1, input: { label: 'شماره تلفن ثابت', field: 'ettelaateFardi.telefoneSabet', type: 'text', required: true } },
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'شماره ضروری', field: 'ettelaateFardi.telefoneZaroori', type: 'text', required: true } },
                                    { flex: 1, input: { label: 'شهر', field: 'ettelaateFardi.shahr', type: 'select', options: options.shahr, option: { text: 'option.text', value: 'option.id' } } },
                                    { flex: 1, input: { label: 'هاب', field: "ettelaateFardi.hub.id" as any, type: 'select', options: options.hub, option: { text: 'option.text', value: 'option.id' } } },
                                    { flex: 1, input: { field: 'ettelaateFardi.faal', label: '', type: 'checkbox', required: true, switch: switchConfig, text: 'فعال' } },

                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'آدرس محل سکونت', field: 'ettelaateFardi.address', type: 'text', required: true } }
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { field: 'ettelaateFardi.shomareGavahiname', label: 'شماره گواهینامه', required: true, type: 'text' } },
                                    { flex: 1, input: { field: 'ettelaateFardi.shomareSheba', label: 'شماره شبا', required: true, type: 'text' } },
                                    { flex: 1, input: { field: 'ettelaateFardi.shomareSafte', label: 'شماره سفته', required: true, type: 'text' } },
                                    { flex: 1, input: { field: 'ettelaateFardi.shomareGharardad', label: 'شماره قرارداد', required: true, type: 'text' } }
                                ]
                            },
                        ]
                    },
                    {
                        show: addEmployeeModel.freelancer.tab === 1,
                        v: [
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'نوع وسیله نقلیه', field: 'ettelaateKhodro.noeVasileNaghlie', type: 'select', required: true, options: options.noeVasileNaghlie } },
                                    { flex: 1, input: { label: 'مدل وسیله نقلیه', field: 'ettelaateKhodro.modeleVasileNaghlie', type: 'select', required: true, options: options.modeleVasileNaghlie } },
                                    { flex: 1, input: { label: 'پلاک', field: 'ettelaateKhodro.pelak', type: 'text', required: true } },
                                    { flex: 1, input: { label: 'شماره VIN', type: 'text', field: 'ettelaateKhodro.vin', required: true } }
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    { flex: 1, input: { label: 'تاریخ اعتبار بیمه نامه', field: 'ettelaateKhodro.tarikheEtebareBimeName', type: 'text' } },
                                    { flex: 1, html: '' },
                                    { flex: 1, html: '' },
                                    { flex: 1, html: '' },
                                ]
                            },
                        ]
                    },
                    {
                        show: addEmployeeModel.freelancer.tab === 2,
                        v: [
                            {
                                className: rowCls,
                                h: [
                                    getImageLayout('تصویر روی کارت ملی', 'rooyeCarteMelli'),
                                    getImageLayout('تصویر پشت کارت ملی', "poshteCarteMelli"),
                                    getImageLayout('تصویر روی گواهینامه', 'rooyeGavahiname'),
                                    getImageLayout('تصویر پشت گواهینامه', 'poshteGavahiname')
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    getImageLayout('تصویر روی کارت وسیله نقلیه', 'rooyeCarteVasileNaghlie'),
                                    getImageLayout('تصویر پشت کارت وسیله نقلیه', 'poshteCarteVasileNaghlie'),
                                    getImageLayout('تصویر بیمه نامه', 'bimename'),
                                    getImageLayout('تصویر سفته', 'safte')
                                ]
                            },
                            {
                                className: rowCls,
                                h: [
                                    getImageLayout('تصویر قرارداد', 'gharardad'),
                                    { flex: 1, html: '' },
                                    { flex: 1, html: '' },
                                    { flex: 1, html: '' },
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
                style={{ height: 36 }} options={options.freelancerTab} value={addEmployeeModel.freelancer.tab}
                option={{ justify: () => true, style: () => ({ flex: 1 }) }}
                onChange={(tab) => changeAddEmployeeModel({ ...addEmployeeModel, freelancer: { ...addEmployeeModel.freelancer, tab } })}
            />
            {form.renderLayout}
        </div>
    )
}
export default Freelancer