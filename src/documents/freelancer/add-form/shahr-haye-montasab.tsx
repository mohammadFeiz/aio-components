import { FC, useEffect } from "react";
import { useForm } from "./../../../npm/aio-input";
import { I_shahrHayeMontasab } from "../types";
import { useFreelancer } from "../context";

const ShahrHayeMontasab: FC<{
    data: I_shahrHayeMontasab,
    onChange: (v: I_shahrHayeMontasab) => void,
    setDisabled: (v: boolean) => void
}> = (props) => {
    const { options, cities } = useFreelancer()
    const form = useForm<I_shahrHayeMontasab>({
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
                                    label: 'استان', field: 'ostan', type: 'select', multiple: true, required: true,
                                    options: options.provinces, text: 'انتخاب استان',option:{text:'option.value',value:'option.key'}
                                }
                            },
                            {
                                flex: 1,
                                input: {
                                    label: 'شهر', field: 'shahr', type: 'select', multiple: true, required: true,
                                    search: 'جستجو',options: cities, text: 'انتخاب شهر',option:{text:'option.text',value:'option.id'}
                                }
                            }
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
export default ShahrHayeMontasab