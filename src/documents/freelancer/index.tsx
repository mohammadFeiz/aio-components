import { FC } from "react";
import { I_formNode, useForm } from "../../npm/aio-input";
import './index.css';
type I_noeHamkari = '0' | '1' | '2'

const App: FC = () => {
    const dic: {
        noeHamkari: { [key in I_noeHamkari]: string },

    } = {
        noeHamkari: {
            '0': 'پین کن آدرس',
            '1': 'راننده فریلنسر',
            '2': 'راننده استخدامی',
        },
    }
    const options: {
        noeHamkari: I_noeHamkari[],
        tab_pinKoneAdres: I_tab_pinKoneAdres[]
    } = {
        noeHamkari: ['0', '1', '2'],
        tab_pinKoneAdres: ['اطلاعات فردی', 'شهر های منتسب']
    }
    const noeHamkari_form = useForm<{ noeHamkari: I_noeHamkari }>({
        initData: {},
        getLayout: (context) => {
            return {
                v: [
                    {
                        className:'fs-12- m-b-12-',html:'نوع همکاری را انتخاب کنید'
                    },
                    {
                        input: {
                            type: 'radio', field: 'noeHamkari', label: '', required: true,
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
            <PinKoneAddress/>

        </div>
    )
}
export default App
type I_tab_pinKoneAdres = 'اطلاعات فردی' | 'شهر های منتسب'

type I_data_pinKoneAddress = {
    tab: I_tab_pinKoneAdres,
    ettelaateFardi: {
        name?: string,
        codeMelli?: string,
        mobile?: string,
        namePedar?: string,
        email?:string,
        nameKarbari?: string,
        password?: string,
        repassword?: string,
        faal?: boolean
    },
    city: number
}

const PinKoneAddress: FC = () => {
    const options = {
        tab: ['اطلاعات فردی', 'شهر های منتسب'],
        shahr: [
            { text: 'تهران - تهران', id: 0 },
            { text: 'تهران - ورامین', id: 1 },
            { text: 'تهران - اندیشه', id: 2 }
        ]
    }
    const option = { text: 'option.text', value: 'option.id' }
    const form = useForm<I_data_pinKoneAddress>({
        initData: {tab:'اطلاعات فردی',ettelaateFardi:{faal:false}},fa:true,
        getLayout: (context) => {
            return {
                v: [
                    {
                        input: {
                            type: 'tabs', label: '', field: 'tab',
                            options: options.tab,
                            option: { text: 'option', value: 'option',justify:()=>true,style:()=>({flex:1}) }
                        }
                    },
                    {
                        show: context.getData().tab === 'اطلاعات فردی',
                        v: [
                            {
                                className:'p-v-12- gap-16-',
                                h: [
                                    { flex: 1, input: { label: 'نام و نام خانوادگی', field: 'ettelaateFardi.name', type: 'text', required: true } },
                                    { flex: 1, input: { label: 'کد ملی', field: 'ettelaateFardi.codeMelli', type: 'text', required: true, validateType: "irNationalCode" } },
                                    { flex: 1, input: { label: 'شماره موبایل', field: 'ettelaateFardi.mobile', type: 'text', required: true, validateType: "irMobile",filter:['number'] } },
                                    { flex: 1, input: { label: 'نام پدر', field: 'ettelaateFardi.namePedar', type: 'text', required: true } }
                                ]
                            },
                            {
                                className:'p-v-12- gap-16-',
                                h: [
                                    { flex: 1, input: { label: 'پست الکترونیکی', field: 'ettelaateFardi.email', type: 'text', validateType: 'email' } },
                                    { flex: 1, input: { label: 'نام کاربری', field: 'ettelaateFardi.nameKarbari', type: 'text' } },
                                    { flex: 1, input: { label: 'گذر واژه', field: 'ettelaateFardi.password', type: 'password', preview: true, required: true } },
                                    {
                                        flex: 1, input: {
                                            label: 'تایید گذر واژه', field: 'ettelaateFardi.repassword', type: 'password', preview: true,
                                            validate: ({ data, value }) => {
                                                if (data.ettelaateFardi && data.ettelaateFardi.password !== value) {
                                                    return 'گذرواژه با تایید آن مطابقت ندارد'
                                                }

                                            }
                                        }
                                    },
                                ]
                            },
                            { input: { type: 'checkbox', field: 'ettelaateFardi.faal', label: '',required:false,text:'فعال' } }
                        ]
                    },
                    {
                        className:'p-v-12- gap-16-',
                        show: context.getData().tab === "شهر های منتسب",
                        v: [
                            {input: {label: 'شهر', field: 'city', type: 'select', multiple: true,options: options.shahr,option}}
                        ]
                    }
                ]
            }
        }
    })
    return <>{form.renderLayout}</>
}


type I_data_freelancer = {
    tab: 'اطلاعات فردی' | 'اطلاعات خودرو' | 'تصویر مدارک',
    userInfo: {
        name: string,
        codeMelli: string,
        mobile: string,
        namePedar: string,
        nameKarbari: string,
        password: string,
        repassword: string,
        faal: boolean,
        tarikheTavallod: string,
        jensiat: { id: number },
        telefoneSabet: string,
        telefoneZaroori: string,
        shahr: { id: number },
        address: string,
        shomareGavahiname: string,
        shomareSheba: string,
        shomareSafte: string,
        shomareGharardad: string
    },
    carInfo: {
        noeVasileNaghlie: { id: number },
        modeleVasileNaghlie: { id: number },
        pelak: string,
        tarikheEtebareBimeName: string
    },
    docImages:{
        rooyeCarteMelli:any,
        poshteCarteMelli:any,
        rooyeGavahiname:any,
        poshteGavahiname:any,
        rooyeCarteVasileNaghlie:any,
        poshteCarteVasileNaghlie:any,
        bimename:any,
        safte:any,
        gharardad:any,
        ranande:any
    }
    city: number
}
const Freelancer: FC = () => {
    const options = {
        tab: ['اطلاعات فردی', 'اطلاعات خودرو', 'تصویر مدارک'],
        jensiat: [{ text: 'مرد', id: 0 }, { text: 'زن', id: 1 }],
        shahr: [
            { text: 'تهران - تهران', id: 0 },
            { text: 'تهران - ورامین', id: 1 },
        ],
        noeVasileNaghlie: [
            { text: 'موتور', id: 0 },
            { text: 'ماشین', id: 1 },
            { text: 'وانت', id: 2 },
        ],
        modeleVasileNaghlie: [
            { text: 'پراید', id: 0 },
            { text: 'پژو', id: 1 }
        ]
    }
    const option = { text: 'option.text', value: 'option.id' }
    const form = useForm<I_data_freelancer>({
        initData: {},
        getLayout: (context) => {
            return {
                v: [
                    {
                        input: {
                            type: 'tabs', label: '', field: 'tab',
                            options: options.tab,
                            option: { text: 'option', value: 'option' }
                        }
                    },
                    {
                        show: context.getData().tab === 'اطلاعات فردی',
                        v: [
                            {
                                h: [
                                    { flex: 1, input: { label: 'نام و نام خانوادگی', field: 'userInfo.name', type: 'text', required: true } },
                                    { flex: 1, input: { label: 'کد ملی', field: 'userInfo.codeMelli', type: 'text', required: true, validateType: "irNationalCode" } },
                                    { flex: 1, input: { label: 'شماره موبایل', field: 'userInfo.mobile', type: 'text', required: true, validateType: "irMobile" } },
                                    { flex: 1, input: { label: 'نام پدر', field: 'userInfo.namePedar', type: 'text', required: true } }
                                ]
                            },
                            {
                                h: [
                                    { flex: 1, input: { label: 'پست الکترونیکی', field: 'userInfo.name', type: 'text', validateType: 'email' } },
                                    { flex: 1, input: { label: 'نام کاربری', field: 'userInfo.nameKarbari', type: 'text' } },
                                    { flex: 1, input: { label: 'گذر واژه', field: 'userInfo.password', type: 'password', preview: true, required: true } },
                                    {
                                        flex: 1, input: {
                                            label: 'تایید گذر واژه', field: 'userInfo.repassword', type: 'password', preview: true,
                                            validate: ({ data, value }) => {
                                                if (data.userInfo && data.userInfo.password !== value) { return 'گذرواژه با تایید آن مطابقت ندارد' }
                                            }
                                        }
                                    },
                                ]
                            },
                            {
                                h: [
                                    { flex: 1, input: { label: 'تاریخ تولد', field: 'userInfo.tarikheTavallod', required: true, type: 'date', jalali: true } },
                                    { flex: 1, input: { label: 'جنسیت', field: 'userInfo.jensiat', required: true, type: 'select', options: options.jensiat, option } },
                                    {
                                        flex: 1, input: {
                                            label: 'شماره تلفن ثابت', field: 'userInfo.telefoneSabet', required: true, type: 'text',
                                            validate: ({ value }) => {
                                                if (typeof value === 'string' && value[0] !== '0') { return 'شماره تلفن باید با صفر شروع شود' }
                                            }
                                        }
                                    },
                                    {
                                        flex: 1, input: {
                                            label: 'شماره ضروری', field: 'userInfo.telefoneZaroori', required: true, type: 'text',
                                            validate: ({ value }) => {
                                                if (value[0] !== '0') { return 'شماره تلفن باید با صفر شروع شود' }
                                            }
                                        }
                                    },
                                ]
                            },
                            {
                                h: [
                                    { flex: 1, input: { field: 'userInfo.shahr.id', label: 'شهر', required: true, type: 'select', options: options.shahr, option } },
                                    { flex: 2, input: { field: 'userInfo.address', label: 'آدرس محل سکونت', required: true, type: 'text' } }
                                ]
                            },
                            {
                                h: [
                                    { flex: 1, input: { field: 'userInfo.shomareGavahiname', label: 'شماره گواهینامه', required: true, type: 'text' } },
                                    { flex: 1, input: { field: 'userInfo.shomareSheba', label: 'شماره شبا', required: true, type: 'text' } },
                                    { flex: 1, input: { field: 'userInfo.shomareSafte', label: 'شماره سفته', required: true, type: 'text' } },
                                    { flex: 1, input: { field: 'userInfo.shomareGharardad', label: 'شماره قرارداد', required: true, type: 'text' } }
                                ]
                            },
                            { input: { type: 'checkbox', field: 'userInfo.faal', label: '' } }
                        ]
                    },
                    {
                        show: context.getData().tab === "اطلاعات خودرو",
                        v: [
                            {
                                h: [
                                    { input: { label: 'نوع وسیله نقلیه', field: 'carInfo.noeVasileNaghlie', type: 'select', required: true, option } },
                                    { input: { label: 'مدل وسیله نقلیه', field: 'carInfo.modeleVasileNaghlie.id', type: 'select', required: true, option } },
                                    { flex: 1, input: { label: 'پلاک', field: 'carInfo.pelak', type: 'text', required: true } },
                                    { flex: 1, input: { label: 'شماره VIN', type: 'text', field: 'carInfo.pelak', required: true } }
                                ]
                            },
                            {
                                h: [
                                    { flex: 1, input: { label: 'تاریخ اعتبار بیمه نامه', field: 'carInfo.tarikheEtebareBimeName', type: 'text' } },
                                    { flex: 3, html: '' }
                                ]
                            }
                        ]
                    },
                    {
                        show:context.getData().tab === "تصویر مدارک",
                        v:[
                            {
                                h:[
                                    {flex:1,input:{label:'تصویر روی کارت ملی',field:'docImages.rooyeCarteMelli',type:'image'}},
                                    {flex:1,input:{label:'تصویر پشت کارت ملی',field:'docImages.rooyeCarteMelli',type:'image'}},
                                    {flex:1,input:{label:'تصویر روی گواهینامه',field:'docImages.rooyeCarteMelli',type:'image'}},
                                    {flex:1,input:{label:'تصویر پشت گواهینامه',field:'docImages.rooyeCarteMelli',type:'image'}},
                                ]
                            },
                            {
                                h:[
                                    {flex:1,input:{label:'تصویر روی کارت وسیله نقلیه',field:'docImages.rooyeCarteMelli',type:'image'}},
                                    {flex:1,input:{label:'تصویر پشت کارت وسیله نقلیه',field:'docImages.rooyeCarteMelli',type:'image'}},
                                    {flex:1,input:{label:'تصویر بیمه نامه',field:'docImages.rooyeCarteMelli',type:'image'}},
                                    {flex:1,input:{label:'تصویر سفته',field:'docImages.rooyeCarteMelli',type:'image'}},
                                ]
                            },
                            {
                                h:[
                                    {flex:1,input:{label:'تصویر قرارداد',field:'docImages.rooyeCarteMelli',type:'image'}},
                                    {flex:1,input:{label:'تصویر راننده',field:'docImages.rooyeCarteMelli',type:'image'}},
                                    {flex:2,html:''}
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    })
    return <>{form.renderLayout}</>
}