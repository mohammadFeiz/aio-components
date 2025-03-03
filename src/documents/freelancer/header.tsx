import { FC, useContext } from "react"
import { I_CTX, I_filter } from "./types"
import { CTX } from "./context"
import { useForm } from "../../npm/aio-input"
import usePopup from "../../npm/aio-popup"

const Header: FC = () => {
    const { filter, openAddModal,changeFilter }: I_CTX = useContext(CTX)
    const popup = usePopup()
    const form = useForm<I_filter>({
        initData: filter,
        onSubmit:(data)=>changeFilter({...filter,...data}),
        liveSubmit:true,
        getLayout: () => {
            return {
                v: [
                    {
                        align: 'v',
                        className: 'gap-16-',
                        h: [
                            {
                                style: { width: 240 },
                                input: { type: 'text', label: 'نوع همکاری', field: 'noeHamkari' }
                            },
                            {
                                style: { width: 240 },
                                input: { type: 'text', label: 'نام و نام خانوادگی', field: 'name' }
                            },
                            {
                                input: {
                                    className: 'p-t-24-',
                                    type: 'checkbox', label: '', field: 'faal', text: 'فعال',
                                    switch: { borderSize: 1, colors: ['#aaa', '#EF5644'] },
                                }
                            },
                            { html: '', flex: 1 },
                            {
                                size:300,align:'v',
                                attrs:{
                                    onClick:()=>{
                                        popup.addModal({
                                            position:'center',
                                            header:{title:'جستجوی پیشرفته'},
                                            setAttrs:(key)=>{
                                                if(key === 'modal'){
                                                    return {
                                                        style:{
                                                            minWidth:300,
                                                            borderRadius:12,
                                                            overflow:'hidden'
                                                        }
                                                    }
                                                }
                                            },
                                            body:<AdvancedSearch/>
                                        })
                                    }
                                },
                                h: [
                                    { html: <div className="nowrap-">جستجوی پیشرفته</div>, },
                                    {
                                        html: (
                                            <div className="w-36- h-36- br-6- bg-14- flex-row- align-vh-">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.25 20.75V15.25H12.75V17.25H20.75V18.75H12.75V20.75H11.25ZM3.25 18.75V17.25H8.75V18.75H3.25ZM7.25 14.75V12.75H3.25V11.25H7.25V9.25H8.75V14.75H7.25ZM11.25 12.75V11.25H20.75V12.75H11.25ZM15.25 8.75V3.25H16.75V5.25H20.75V6.75H16.75V8.75H15.25ZM3.25 6.75V5.25H12.75V6.75H3.25Z" fill="#5F6368" />
                                                </svg>
                                            </div>
                                        )
                                    }
                                ]
                            }
                        ]
                    },
                    { html: '', size: 12 },
                    {
                        html: (
                            <div className="flex-row- align-v- gap-16- w-100-">
                                <button
                                    className="br-6- brd-none- p-h-24- p-v-6- flex-row- align-v-"
                                    style={{ background: '#EF5644', color: '#fff' }}
                                    type='button'
                                    onClick={() => {
                                        openAddModal()
                                    }}
                                > + افزودن</button>
                                <div className="flex-row- align-v-">
                                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.9805 15.7885L8.71122 11.5192L9.76522 10.4348L12.2305 12.9V4.5H13.7305V12.9L16.1957 10.4348L17.2497 11.5192L12.9805 15.7885ZM5.48047 19.5V14.9808H6.98047V18H18.9805V14.9808H20.4805V19.5H5.48047Z" fill="#666666" />
                                    </svg>
                                    خروجی اکسل
                                </div>
                                <div className="flex-1-"></div>
                                <button type='button' className="brd-none- bg-none- flex-row- align-v-" style={{ color: '#EF5644' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.40141 18.6538L5.34766 17.6L10.9477 12L5.34766 6.4L6.40141 5.34625L12.0014 10.9463L17.6014 5.34625L18.6552 6.4L13.0552 12L18.6552 17.6L17.6014 18.6538L12.0014 13.0538L6.40141 18.6538Z" fill="#EF5644" />
                                    </svg>
                                    حذف جستجو
                                </button>
                                <button type='button' style={{ background: '#EF5644', color: '#fff' }} className="brd-none- flex-row- align-v- h-36- br-6- p-h-24-">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19.5406 20.577L13.2598 14.296C12.7598 14.7088 12.1848 15.0319 11.5348 15.2653C10.8848 15.4986 10.2124 15.6153 9.51759 15.6153C7.80843 15.6153 6.36193 15.0235 5.17809 13.84C3.99426 12.6565 3.40234 11.2103 3.40234 9.50152C3.40234 7.79285 3.99409 6.34618 5.17759 5.16152C6.36109 3.97702 7.80726 3.38477 9.51609 3.38477C11.2248 3.38477 12.6714 3.97668 13.8561 5.16051C15.0406 6.34435 15.6328 7.79085 15.6328 9.50002C15.6328 10.2142 15.513 10.8963 15.2733 11.5463C15.0335 12.1963 14.7136 12.7616 14.3136 13.2423L20.5943 19.523L19.5406 20.577ZM9.51759 14.1155C10.8061 14.1155 11.8974 13.6683 12.7916 12.774C13.6859 11.8798 14.1331 10.7885 14.1331 9.50002C14.1331 8.21152 13.6859 7.12018 12.7916 6.22601C11.8974 5.33168 10.8061 4.88452 9.51759 4.88452C8.22909 4.88452 7.13776 5.33168 6.24359 6.22601C5.34926 7.12018 4.90209 8.21152 4.90209 9.50002C4.90209 10.7885 5.34926 11.8798 6.24359 12.774C7.13776 13.6683 8.22909 14.1155 9.51759 14.1155Z" fill="white" />
                                    </svg>
                                    جستجو
                                </button>
                            </div>
                        )
                    }
                ]
            }
        }
    })
    return (<>
        {form.renderLayout}
        {popup.render()}
    </>)
}
export default Header






const AdvancedSearch:FC = ()=>{
    const {filter,changeFilter}:I_CTX = useContext(CTX)
    const form = useForm<I_filter["advanced"]>({
        initData:filter.advanced,
        onSubmit:(data)=>changeFilter({...filter,advanced:data}),
        liveSubmit:true,
        getLayout:()=>{
            return {
                style:{padding:12},
                v:[
                    {input:{label:'شماره موبایل',field:'mobile',type:'text',validateType:"irMobile",filter:['number']}},
                    {input:{label:'کد ملی',field:'codeMelli',type:'text',validateType:"irNationalCode",filter:['number']}},
                ]
            }
        }
    })
    return <>{form.renderLayout}</>
}