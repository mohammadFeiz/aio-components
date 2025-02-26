import { FC } from "react";
import { useForm } from "../../npm/aio-input";
import './index.css';
type I_noeHamkari = '0' | '1'
type I_jensiat = '0' | '1'
const App: FC = () => {
    const dic: {
        noeHamkari: { [key in I_noeHamkari]: string },
        jensiat: { [key in I_jensiat]: string }
    } = {
        noeHamkari: {
            '0': 'اصلاح کننده آدرس',
            '1': 'راننده فریلنسر'
        },
        jensiat: {
            '0': 'مرد',
            '1': 'زن'
        }
    }
    const options: {
        noeHamkari: I_noeHamkari[],
        tab_pinKoneAdres: I_tab_pinKoneAdres[],
        jensiat: I_jensiat[]
    } = {
        noeHamkari: ['0', '1'],
        tab_pinKoneAdres: ['اطلاعات فردی', 'شهر های منتسب'],
        jensiat: ['0', '1']
    }
    const noeHamkari_form = useForm<{ noeHamkari: I_noeHamkari }>({
        initData: {},
        getLayout: (context) => {
            return {
                v: [
                    {
                        className: 'fs-12- m-b-12-', html: 'نوع همکاری را انتخاب کنید'
                    },
                    {
                        input: {
                            type: 'buttons', field: 'noeHamkari', label: '', required: true,
                            options: options.noeHamkari,
                            option: {
                                text: (option: I_noeHamkari) => dic.noeHamkari[option],
                                value: (option) => option
                            }
                        }
                    },

                ]
            }
        }
    })
    return (
        <div className="fullscreen- flex-col- rtl- p-24- boxit-freelancer">
            <div className="fs-16- bold- m-b-24-">افزودن پرسنل خارج از سازمان</div>
            {noeHamkari_form.renderLayout}
            <EslahKonadeyeAddressEttelaateFardi />

        </div>
    )
}
export default App
type I_tab_pinKoneAdres = 'اطلاعات فردی' | 'شهر های منتسب'

type I_eslahKonandeyeAddress_ettelaateFardi = {
    name?: string,
    codeMelli?: string,
    mobile?: string,
    namePedar?: string,
    email?: string,
    tarikheTavallod?: string,
    jensiat?: I_jensiat,
    phone?: string,
    shomareZarori?: string,
    shahr?: string,
    faal?: boolean,
    address?: string,
}

const EslahKonadeyeAddressEttelaateFardi: FC = () => {
    const options = {
        tab: ['اطلاعات فردی', 'شهر های منتسب'],
        shahr: [
            { text: 'تهران - تهران', id: '0' },
            { text: 'تهران - ورامین', id: '1' },
            { text: 'تهران - اندیشه', id: '2' }
        ],
        jensiat: [
            { text: 'مرد', id: '0' },
            { text: 'زن', id: '1' }
        ]
    }
    const option = { text: 'option.text', value: 'option.id' }
    const form = useForm<I_eslahKonandeyeAddress_ettelaateFardi>({
        initData: { faal: false }, fa: true,
        getLayout: (context) => {
            return {
                v: [
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            { flex: 1, input: { label: 'نام و نام خانوادگی', field: 'name', type: 'text', required: true } },
                            { flex: 1, input: { label: 'کد ملی', field: 'codeMelli', type: 'text', required: true, validateType: "irNationalCode" } },
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
                                    options: options.jensiat, option: { text: 'option.text', value: 'option.id' }
                                }
                            },
                            { flex: 1, input: { label: 'شماره تلفن ثابت', field: 'phone', type: 'text', required: true } },
                        ]
                    },
                    {
                        className: 'p-v-12- gap-16-', h: [
                            { flex: 1, input: { label: 'شماره ضروری', field: 'shomareZarori', type: 'text', required: true } },
                            { input: { label: 'شهر', field: 'shahr', type: 'select', options: options.shahr, option } },
                            { flex: 1, input: { label: 'فعال', field: 'faal', type: 'checkbox', required: true } },
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
type I_eslahKonandeyeAddress_shahrHayeMontasab = {
    ostan?: string,
    shahr?: string
}

const EslahKonadeyeAddressShahrHayeMontasab: FC = () => {
    const options = {
        tab: ['اطلاعات فردی', 'شهر های منتسب'],
        shahr: [
            { text: 'تهران - تهران', id: '0' },
            { text: 'تهران - ورامین', id: '1' },
            { text: 'تهران - اندیشه', id: '2' }
        ],
        ostan: [
            { text: 'تهران', id: '0' },
            { text: 'اصفهان', id: '1' }
        ]
    }
    const form = useForm<I_eslahKonandeyeAddress_shahrHayeMontasab>({
        initData: {}, fa: true,
        getLayout: (context) => {
            return {
                v: [
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            {
                                flex: 1,
                                input: {
                                    label: 'نام و نام خانوادگی', field: 'ostan', type: 'select', multiple: true, required: true,
                                    options: options.ostan, option: { text: 'option.text', value: 'option.id' }
                                }
                            },
                            {
                                flex: 1,
                                input: {
                                    label: 'شهر', field: 'shahr', type: 'select', multiple: true, required: true,
                                    options: options.shahr, option: { text: 'option.text', value: 'option.id' }
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
type I_freelancer_ettelaate_fardi = {
    name?: string,
    codeMelli?: string,
    mobile?: string,
    namePedar?: string,
    email?: string,
    tarikheTavallod?: string,
    jensiat?: { id: string },
    telefoneSabet?: string,
    telefoneZaroori?: string,
    shahr?: { id: string },
    hub?: {
        id: string
    },
    faal: boolean,
    address?: string,
    shomareGavahiname?: string,
    shomareSheba?: string,
    shomareSafte?: string,
    shomareGharardad?: string
}

const Freelancer_Ettelaate_Fardi: FC = () => {
    const options = {
        tab: ['اطلاعات فردی', 'شهر های منتسب'],
        shahr: [
            { text: 'تهران - تهران', id: '0' },
            { text: 'تهران - ورامین', id: '1' },
            { text: 'تهران - اندیشه', id: '2' }
        ],
        hub: [
            { text: 'تهران', id: '0' },
            { text: 'اصغهان', id: '1' }
        ],
        jensiat: [
            { text: 'مرد', id: '0' },
            { text: 'زن', id: '1' }
        ]
    }
    const form = useForm<I_freelancer_ettelaate_fardi>({
        initData: { faal: true, jensiat: { id: '0' } }, fa: true,
        getLayout: (context) => {
            return {
                v: [
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            { flex: 1, input: { label: 'نام و نام خانوادگی', field: 'name', type: 'text', required: true } },
                            { flex: 1, input: { label: 'کد ملی', field: 'codeMelli', type: 'text', required: true, validateType: "irNationalCode" } },
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
                                    label: 'جنسیت', field: 'jensiat.id' as any, type: 'select', required: true,
                                    options: options.jensiat, option: { text: 'option.text', value: 'option.id' }
                                }
                            },
                            { flex: 1, input: { label: 'شماره تلفن ثابت', field: 'telefoneSabet', type: 'text', required: true } },
                        ]
                    },
                    {
                        className: 'p-v-12- gap-16-', h: [
                            { flex: 1, input: { label: 'شماره ضروری', field: 'telefoneZaroori', type: 'text', required: true } },
                            { flex: 1, input: { label: 'شهر', field: 'shahr', type: 'select', options: options.shahr, option: { text: 'option.text', value: 'option.id' } } },
                            { flex: 1, input: { label: 'هاب', field: "hub.id" as any, type: 'select', options: options.hub, option: { text: 'option.text', value: 'option.id' } } },
                            { flex: 1, input: { label: 'فعال', field: 'faal', type: 'checkbox', required: true } },

                        ]
                    },
                    {
                        className: 'p-v-12- gap-16-',
                        h: [
                            { flex: 1, input: { label: 'آدرس محل سکونت', field: 'address', type: 'text', required: true } }
                        ]
                    },
                    {
                        h: [
                            { flex: 1, input: { field: 'shomareGavahiname', label: 'شماره گواهینامه', required: true, type: 'text' } },
                            { flex: 1, input: { field: 'shomareSheba', label: 'شماره شبا', required: true, type: 'text' } },
                            { flex: 1, input: { field: 'shomareSafte', label: 'شماره سفته', required: true, type: 'text' } },
                            { flex: 1, input: { field: 'shomareGharardad', label: 'شماره قرارداد', required: true, type: 'text' } }
                        ]
                    },

                ]
            }
        }
    })
    return <>{form.renderLayout}</>
}
type I_freelancer_ettelaate_khodro = {
    noeVasileNaghlie?: { id: number },
    modeleVasileNaghlie?: { id: number },
    pelak?: string,
    vin?: string,
    tarikheEtebareBimeName?: string
}
const Freelancer_Ettelaate_Khodro: FC = () => {
    const options = {
        noeVasileNaghlie: [
            { text: 'ماشین', id: '0' },
            { text: 'موتور', id: '1' },
        ],
        modeleVasileNaghlie: [
            { text: 'پراید', id: '0' },
            { text: 'پژو', id: '1' },
        ]
    }
    const option = { text: 'option.text', value: 'option.id' }
    const form = useForm<I_freelancer_ettelaate_khodro>({
        initData: {}, fa: true,
        getLayout: (context) => {
            return {
                v: [
                    {
                        h: [
                            { input: { label: 'نوع وسیله نقلیه', field: 'noeVasileNaghlie.id' as any, type: 'select', required: true, options: options.noeVasileNaghlie, option } },
                            { input: { label: 'مدل وسیله نقلیه', field: 'modeleVasileNaghlie.id' as any, type: 'select', required: true, options: options.modeleVasileNaghlie, option } },
                            { flex: 1, input: { label: 'پلاک', field: 'pelak', type: 'text', required: true } },
                            { flex: 1, input: { label: 'شماره VIN', type: 'text', field: 'vin', required: true } }
                        ]
                    },
                    {
                        h: [
                            { flex: 1, input: { label: 'تاریخ اعتبار بیمه نامه', field: 'tarikheEtebareBimeName', type: 'text' } },
                            { flex: 3, html: '' }
                        ]
                    }

                ]
            }
        }
    })
    return <>{form.renderLayout}</>
}
type I_freelancer_tasvire_madarek = {
    rooyeCarteMelli: any,
    poshteCarteMelli: any,
    rooyeGavahiname: any,
    poshteGavahiname: any,
    rooyeCarteVasileNaghlie: any,
    poshteCarteVasileNaghlie: any,
    bimename: any,
    safte: any,
    gharardad: any,
}
const Freelancer_Tasvire_Madarek: FC = () => {
    const options = {
        noeVasileNaghlie: [
            { text: 'ماشین', id: '0' },
            { text: 'موتور', id: '1' },
        ],
        modeleVasileNaghlie: [
            { text: 'پراید', id: '0' },
            { text: 'پژو', id: '1' },
        ]
    }
    const option = { text: 'option.text', value: 'option.id' }
    const form = useForm<I_freelancer_tasvire_madarek>({
        initData: {}, fa: true,
        getLayout: (context) => {
            return {
                v: [
                    {
                        h: [
                            { flex: 1, input: { label: 'تصویر روی کارت ملی', field: 'rooyeCarteMelli', type: 'image' } },
                            { flex: 1, input: { label: 'تصویر پشت کارت ملی', field: 'rooyeCarteMelli', type: 'image' } },
                            { flex: 1, input: { label: 'تصویر روی گواهینامه', field: 'rooyeCarteMelli', type: 'image' } },
                            { flex: 1, input: { label: 'تصویر پشت گواهینامه', field: 'rooyeCarteMelli', type: 'image' } },
                        ]
                    },
                    {
                        h: [
                            { flex: 1, input: { label: 'تصویر روی کارت وسیله نقلیه', field: 'rooyeCarteMelli', type: 'image' } },
                            { flex: 1, input: { label: 'تصویر پشت کارت وسیله نقلیه', field: 'rooyeCarteMelli', type: 'image' } },
                            { flex: 1, input: { label: 'تصویر بیمه نامه', field: 'rooyeCarteMelli', type: 'image' } },
                            { flex: 1, input: { label: 'تصویر سفته', field: 'rooyeCarteMelli', type: 'image' } },
                        ]
                    },
                    {
                        h: [
                            { flex: 1, input: { label: 'تصویر قرارداد', field: 'rooyeCarteMelli', type: 'image' } },
                            { flex: 1, input: { label: 'تصویر راننده', field: 'rooyeCarteMelli', type: 'image' } },
                            { flex: 2, html: '' }
                        ]
                    }

                ]
            }
        }
    })
    return <>{form.renderLayout}</>
}
