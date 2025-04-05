import { FC, useEffect } from "react";
import { Plate, useForm } from "./../../../npm/aio-input";
import { I_ettelaateKhodro } from "../types";
import { useFreelancer } from "../context";

const EttelaateKhodro: FC<{
    data: I_ettelaateKhodro,
    onChange: (v: I_ettelaateKhodro) => void,
    setDisabled: (v: boolean) => void
}> = (props) => {
    const { options } = useFreelancer()
    const form = useForm<I_ettelaateKhodro>({
        initData: props.data, fa: true, inlineLabel: true,
        onChange: (data) => {
            props.onChange(data);
            props.setDisabled(form.isSubmitDisabled())
        },
        getLayout: (context) => {
            const rowCls = 'p-v-12- gap-16-'
            return {
                className: 'gap-16-',
                v: [
                    {
                        className: rowCls,
                        h: [
                            {
                                flex: 1,
                                input: {
                                    label: 'نوع وسیله نقلیه', field: 'noeVasileNaghlie', type: 'select', required: true,
                                    options: options.vehicleTypes.map((o: any) => ({ text: o.value, value: o.key })),
                                    popover: { fitHorizontal: true }
                                }
                            },
                            {
                                flex: 1,
                                input: {
                                    label: 'مدل وسیله نقلیه', field: 'modeleVasileNaghlie', type: 'select', required: true,
                                    options: options.vehicleMakes.map((o: any) => ({ text: o.value, value: o.key })), search: 'جستجو',
                                    popover: { fitHorizontal: true }
                                }
                            },
                            {
                                flex: 1, html: (
                                    <div className="msf">
                                        <Plate type='car' label={'پلاک *'} value={context.getData().pelak || []} onChange={(pelak) => context.changeData({ ...context.getData(), pelak })} />
                                    </div>
                                )
                            },
                            { flex: 1, input: { label: 'شماره VIN', type: 'text', field: 'vin', required: true } }
                        ]
                    },
                    {
                        className: rowCls,
                        h: [
                            { flex: 1, input: { label: 'تاریخ اعتبار بیمه نامه', field: 'tarikheEtebareBimeName', type: 'date', jalali: true } },
                            { flex: 1, html: '' },
                            { flex: 1, html: '' },
                            { flex: 1, html: '' },
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
export default EttelaateKhodro


