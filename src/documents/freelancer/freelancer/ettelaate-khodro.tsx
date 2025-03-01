import { FC, useContext } from "react"
import { I_AddEmployeeContext, I_addEmployeeModel } from "../types"
import { AddEmployeeContext } from "../context"
import { useForm } from "../../../npm/aio-input"

const Freelancer_EttelaateKhodro: FC = () => {
    const { addEmployeeModel, options }: I_AddEmployeeContext = useContext(AddEmployeeContext)
    const form = useForm<I_addEmployeeModel["freelancer"]["ettelaateKhodro"]>({
        initData: addEmployeeModel.freelancer.ettelaateKhodro, fa: true,
        getLayout: (context) => {
            return {
                v: [
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            { flex: 1, input: { label: 'نوع وسیله نقلیه', field: 'noeVasileNaghlie', type: 'select', required: true, options: options.noeVasileNaghlie } },
                            { flex: 1, input: { label: 'مدل وسیله نقلیه', field: 'modeleVasileNaghlie', type: 'select', required: true, options: options.modeleVasileNaghlie } },
                            { flex: 1, input: { label: 'پلاک', field: 'pelak', type: 'text', required: true } },
                            { flex: 1, input: { label: 'شماره VIN', type: 'text', field: 'vin', required: true } }
                        ]
                    },
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            { flex: 1, input: { label: 'تاریخ اعتبار بیمه نامه', field: 'tarikheEtebareBimeName', type: 'text' } },
                            { flex: 1, html: '' },
                            { flex: 1, html: '' },
                            { flex: 1, html: '' },
                        ]
                    }

                ]
            }
        }
    })
    return <>{form.renderLayout}</>
}
export default Freelancer_EttelaateKhodro