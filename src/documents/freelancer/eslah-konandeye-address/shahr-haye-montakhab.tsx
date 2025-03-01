import { FC, useContext } from "react"
import { useForm } from "../../../npm/aio-input"
import { I_AddEmployeeContext, I_addEmployeeModel } from "../types"
import { AddEmployeeContext } from "../context"

const EslahKonadeyeAddress_ShahrHayeMontasab: FC = () => {
    const { addEmployeeModel, options }: I_AddEmployeeContext = useContext(AddEmployeeContext)
    const form = useForm<I_addEmployeeModel["eslahKonandeyeAddress"]["shahrHayeMontasab"]>({
        initData: addEmployeeModel.eslahKonandeyeAddress.shahrHayeMontasab, fa: true,
        getLayout: (context) => {
            return {
                v: [
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            {
                                flex: 1,
                                input: {
                                    label: 'استان', field: 'ostan', type: 'select', multiple: true, required: true,
                                    options: options.ostan, text: 'انتخاب استان'
                                }
                            },
                            {
                                flex: 1,
                                input: {
                                    label: 'شهر', field: 'shahr', type: 'select', multiple: true, required: true,
                                    options: options.shahr, text: 'انتخاب شهر'
                                }
                            }
                        ]
                    }
                ]
            }
        }
    })
    return <>{form.renderLayout}</>
}
export default EslahKonadeyeAddress_ShahrHayeMontasab