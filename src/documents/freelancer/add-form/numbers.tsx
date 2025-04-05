



import { FC, useEffect } from "react";
import { useForm } from "./../../../npm/aio-input";
import { I_freelancer_numbers } from "../types";

const FreelancerNumbers: FC<{
    data: I_freelancer_numbers,
    onChange: (v: I_freelancer_numbers) => void,
    setDisabled: (v: boolean) => void
}> = (props) => {
    const form = useForm<I_freelancer_numbers>({
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
                        className: rowCls,
                        h: [
                            { flex: 1, input: { field: 'shomareGavahiname', label: 'شماره گواهینامه', required: true, type: 'text' } },
                            {
                                flex: 1,
                                input: {
                                    field: 'shomareSheba',
                                    label: 'شماره شبا',
                                    required: true,
                                    type: 'text',
                                    before: 'IR',
                                    filter: ['number'],
                                    style: { direction: 'ltr' },
                                    maxLength: 24,
                                    validate: ({ value }) => {
                                        if (value && value.length < 24) {
                                            return `شماره شبا باید 24 رقم باشد`
                                        }
                                    }
                                }
                            },
                            { flex: 1, input: { field: 'shomareSafte', label: 'شماره سفته', required: true, type: 'text' } },
                            { flex: 1, input: { field: 'shomareGharardad', label: 'شماره قرارداد', required: true, type: 'text' } }
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
export default FreelancerNumbers










































