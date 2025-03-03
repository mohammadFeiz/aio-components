import { FC, useContext, useEffect, useRef, useState } from "react";
import { I_filter, I_hub, I_row } from "./types";
import './index.css';
import { AI_switch, AITable } from "../../npm/aio-input";
import Header from "./header";
import { CTX, I_CTX } from "./context";
import usePopup from "../../npm/aio-popup";
import AddForm from "./add-form";
import Apis from "./apis";
//http://192.168.78.243:8090/swagger-ui/index.html#/public-api/commonObjects
//http://192.168.78.243:20000/swagger-ui/index.html#/employee-api/create_2
const Provider: FC = () => {
    const base_url = 'http://boxi:40000'
    const token = 'eyJraWQiOiIwY2Y0OTI5ZS1hYTAzLTRkOTQtYTQ2MC1mMjIyMTMzM2U2NzQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJoLmJhcmF0aSIsInJvbGUiOlsiMTcwODE4NDY5ODg3MjI5MyJdLCJpc3MiOiJodHRwOlwvXC9ib3hpOjIwMDAwIiwibW9iaWxlIjoiMDk5MTc2MjI3NDUiLCJwbGF0Zm9ybSI6IlBMQVRGT1JNX0FETUlOIiwic3VwIjoieWVzIiwiYXVkIjoiZ2F0ZXdheS1jbGllbnQtaWQiLCJuYmYiOjE3NDEwODMwNTUsInNjb3BlIjpbInByb2ZpbGUiXSwiaWQiOiI1NjEiLCJleHAiOjE3NDExNjk0NTUsImlhdCI6MTc0MTA4MzA1NSwidXNlcm5hbWUiOiJoLmJhcmF0aSIsInN0YXR1cyI6IkVOQUJMRSJ9.BUFdWGoPQtHTch1Cdk00gXlZcLEcgDPwPeQX_jlpwbe7zYbpR9nNKWJuga6MpX3DhxgdXbKKIBWGbBN-IJoH2gHNwIllYHeS92G1lAvj1xmpwcDDw9e3Oqq_KYR1irgwPOuvR_Wp4GQxxvudFTMj3VMUjIeUHCT6_Z18Yr5V8zagFR0vN1nqk1T6hahztszHHo56ApfBMUezmqZ7VVPJOgFtYBhHm14Lw_wKoF7CY_ca3kX1BxwdgU62NNO3LDustQgrp1zLdT0Q9usQSD3Ygesa6BIkIaZlriFLQv-kusz0CwFF9PHHsieVYOjcx5nbdGHFeVqJVSiyJ2tue6WxYg'
    const currenthub: I_hub = {
        "id": 2,
        "text": "هاب تهران",
    }
    const apisRef = useRef<Apis>(new Apis({ base_url, token }))
    const apis = apisRef.current
    const [options, setOptions] = useState<any>({})
    const fetchOptions = async () => {
        const res = await apis.enums()
        if (res) {
            debugger
            setOptions(res)
        }
    }
    useEffect(() => {
        fetchOptions()
    }, [])
    if (!options) { return null }
    return <App apis={apis} options={options} currenthub={currenthub} />
}
export default Provider

const App: FC<{ apis: Apis, options: any, currenthub: I_hub }> = ({ apis, options, currenthub }) => {
    const [filter, setFilter] = useState<I_filter>({
        hubId: currenthub.id,
        advanced: {}
    })
    const popup = usePopup()
    const [grid, setGrid] = useState<I_row[]>([])
    const fetchGrid = async () => {
        const res = await apis.grid(filter)
    }
    useEffect(() => {
        fetchGrid()
    }, [])
    const [data, setData] = useState<I_row[]>([
        {
            selectRoles: [{ id: 0, text: 'فریلنسر' }],
            name: 'محمد شریف',
            nationalCode: '0386481784',
            mobile: '09123534314',
            email: 'feiz.ms@gmail.com',
            createDate: {
                day: 4,
                month: 4,
                year: 1364,
                hour: '',
                minute: ''
            },
            username: 'msf1364',
            isActive: true
        }
    ])
    const openAddModal = () => {
        popup.addModal({
            header: {
                title: 'ثبت نام راننده',
            },
            body: <AddForm />
        })
    }
    const switchConfig: AI_switch = { borderSize: 1, colors: ['#aaa', '#EF5644'] }
    const getContext = (): I_CTX => {
        return {
            filter, switchConfig, options,
            changeFilter: (v: I_filter) => setFilter(v),
            resetFilter: () => setFilter({ hubId: 0, advanced: {} }),
            data, openAddModal
        }
    }
    return (
        <CTX.Provider value={getContext()}>
            <div className="freelancer-grid fullscreen- flex-col- rtl- p-12- fs-12-">
                <div className="h-48- flex-row- align-v- p-h-12-">مدیریت پرسنل / پرسنل خارج از سازمان</div>
                <Header />
                <div className="h-12-"></div>
                <Table />
                {popup.render()}
            </div>
        </CTX.Provider>
    )
}


const Table: FC = () => {
    const { data }: I_CTX = useContext(CTX)
    return (
        <AITable
            value={data}
            headerAttrs={{
                style: {
                    background: '#FFEAE9'
                }
            }}
            rowAttrs={({ rowIndex }) => ({
                style: {
                    height: 48,
                    background: rowIndex % 2 !== 0 ? '#f8f8f8' : '#fff'
                }
            })}
            getValue={{
                date: ({ row }) => {
                    const { year, month, day } = row.createDate;
                    return <>{`${year}/${month}/${day}`}</>
                },
                actions: ({ row }) => {
                    return (
                        <div className="flex-row- align-v- gap-6-">
                            <div className="msf"><SVG3 /></div>
                            <div className="msf"><SVG2 /></div>
                            <div className="msf"><SVG1 /></div>
                        </div>
                    )
                }
            }}
            columns={[
                { title: 'نوع همکاری', value: 'row.selectRoles[0].text', width: 100, justify: true },
                { title: 'نام و نام خانوادگی', value: 'row.name', minWidth: 160, justify: true },
                { title: 'کد ملی', value: 'row.nationalCode', width: 100, justify: true },
                { title: 'موبایل', value: 'row.mobile', width: 100, justify: true },
                { title: 'پست الکترونیک', value: 'row.email', width: 160 },
                { title: 'تاریخ ایجاد', value: 'date', width: 100, justify: true },
                { title: 'نام کاربری', value: 'row.username', width: 100 },
                { title: 'وضعیت', value: `row.isActive ? 'فعال' : 'غیر فعال'`, width: 100, justify: true },
                { title: 'عملیات', value: 'actions', width: 100, justify: true },
            ]}
        />
    )
}

const SVG1: FC = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 20.5V5.99998H4.5V4.49998H9V3.61548H15V4.49998H19.5V5.99998H18.5V20.5H5.5ZM7 19H17V5.99998H7V19ZM9.404 17H10.9037V7.99998H9.404V17ZM13.0962 17H14.596V7.99998H13.0962V17Z" fill="#666666" />
        </svg>
    )
}
const SVG2: FC = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2467_875)">
                <path d="M2 24V21H22V24H2ZM6 16.4135H7.2365L15.5365 8.12875L14.9078 7.4905L14.2848 6.877L6 15.177V16.4135ZM4.5 17.9135V14.5385L16.7885 2.2655L20.1327 5.65575L7.875 17.9135H4.5ZM15.5365 8.12875L14.9078 7.4905L14.2848 6.877L15.5365 8.12875Z" fill="#666666" />
            </g>
            <defs>
                <clipPath id="clip0_2467_875">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}
const SVG3: FC = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.25 16.75H12.75V11H11.25V16.75ZM12 9.2885C12.2288 9.2885 12.4207 9.21108 12.5755 9.05625C12.7303 8.90142 12.8077 8.70958 12.8077 8.48075C12.8077 8.25192 12.7303 8.06008 12.5755 7.90525C12.4207 7.75058 12.2288 7.67325 12 7.67325C11.7712 7.67325 11.5793 7.75058 11.4245 7.90525C11.2697 8.06008 11.1923 8.25192 11.1923 8.48075C11.1923 8.70958 11.2697 8.90142 11.4245 9.05625C11.5793 9.21108 11.7712 9.2885 12 9.2885ZM12.0017 21.5C10.6877 21.5 9.45267 21.2507 8.2965 20.752C7.14033 20.2533 6.13467 19.5766 5.2795 18.7218C4.42433 17.8669 3.74725 16.8617 3.24825 15.706C2.74942 14.5503 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74933 9.45267 3.248 8.2965C3.74667 7.14033 4.42342 6.13467 5.27825 5.2795C6.13308 4.42433 7.13833 3.74725 8.294 3.24825C9.44967 2.74942 10.6844 2.5 11.9983 2.5C13.3123 2.5 14.5473 2.74933 15.7035 3.248C16.8597 3.74667 17.8653 4.42342 18.7205 5.27825C19.5757 6.13308 20.2528 7.13833 20.7518 8.294C21.2506 9.44967 21.5 10.6844 21.5 11.9983C21.5 13.3123 21.2507 14.5473 20.752 15.7035C20.2533 16.8597 19.5766 17.8653 18.7218 18.7205C17.8669 19.5757 16.8617 20.2528 15.706 20.7518C14.5503 21.2506 13.3156 21.5 12.0017 21.5ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#666666" />
        </svg>
    )
}