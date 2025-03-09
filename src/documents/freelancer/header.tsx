import { FC } from "react"
import { I_gridFilter } from "./types"
import { useFreelancer } from "./context"
import { useForm } from "./../../npm/aio-input"
import usePopup, { I_usePopup } from "./../../npm/aio-popup"

const Header: FC = () => {
    const { gridHook, options } = useFreelancer()
    const popup = usePopup()
    const reset = ()=>{
        form.changeData({ hubId: 0, advanced: {},pageSize:10,pageNumber:1,rowsLength:0 })
        gridHook.resetGridFilter()
    }
    const form = useForm<I_gridFilter>({
        initData: gridHook.gridFilter,
        inlineLabel:true,
        onSubmit: (data) => gridHook.changeGridFilter({ ...gridHook.gridFilter, ...data }),
        liveSubmit: true,
        getLayout: () => {
            return {
                v: [
                    {
                        align: 'v',
                        className: 'gap-16- p-v-6-',
                        h: [
                            {
                                size: 160,
                                input: { 
                                    type: 'select', label: 'هاب', field: 'hubId',required:false,
                                    options:options.hubs,
                                    option:{
                                        text:'option.name',
                                        value:'option.id'
                                    }
                                }
                            },
                            {
                                size: 160,
                                input: { 
                                    type: 'select', label: 'نوع همکاری', field: 'noeHamkari',required:false,
                                    options:[
                                        {text:'انتخاب نشده',value:undefined},
                                        {text:'راننده فریلنسر',value:0},
                                        {text:'اصلاح کننده آدرس',value:1}
                                    ]
                                }
                            },
                            {
                                size: 160,
                                input: { type: 'text', label: 'نام و نام خانوادگی', field: 'name',required:false }
                            },
                            {
                                size: 120,
                                input: {
                                    type: 'checkbox', label: '', field: 'isActive', text: 'فعال', className:'brd-none-',required:false,
                                    switch: { borderSize: 1, colors: ['#aaa', '#EF5644'] },
                                }
                            },
                            { html: '', flex: 1 },
                            { html: <AdvancedSearchButton popup={popup}/> }
                        ]
                    },
                    { html: '', size: 12 },
                    {
                        html: (
                            <div className="flex-row- align-v- gap-16- w-100-">
                                <AddButton />
                                <ExcelButton />
                                <div className="flex-1-"></div>
                                <ResetButton onClick={reset}/>
                                <SearchButton />
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


const ResetButton: FC<{onClick:()=>void}> = ({onClick}) => {
    return (
        <button type='button' className="brd-none- bg-none- flex-row- align-v-" style={{ color: '#EF5644' }} onClick={onClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.40141 18.6538L5.34766 17.6L10.9477 12L5.34766 6.4L6.40141 5.34625L12.0014 10.9463L17.6014 5.34625L18.6552 6.4L13.0552 12L18.6552 17.6L17.6014 18.6538L12.0014 13.0538L6.40141 18.6538Z" fill="#EF5644" />
            </svg>
            حذف جستجو
        </button>
    )
}
const ExcelButton: FC = () => {
    return (
        <div className="flex-row- align-v-">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.9805 15.7885L8.71122 11.5192L9.76522 10.4348L12.2305 12.9V4.5H13.7305V12.9L16.1957 10.4348L17.2497 11.5192L12.9805 15.7885ZM5.48047 19.5V14.9808H6.98047V18H18.9805V14.9808H20.4805V19.5H5.48047Z" fill="#666666" />
            </svg>
            خروجی اکسل
        </div>
    )
}

const SearchButton: FC = () => {
    return (
        <button type='button' style={{ background: '#EF5644', color: '#fff' }} className="fl-button-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5406 20.577L13.2598 14.296C12.7598 14.7088 12.1848 15.0319 11.5348 15.2653C10.8848 15.4986 10.2124 15.6153 9.51759 15.6153C7.80843 15.6153 6.36193 15.0235 5.17809 13.84C3.99426 12.6565 3.40234 11.2103 3.40234 9.50152C3.40234 7.79285 3.99409 6.34618 5.17759 5.16152C6.36109 3.97702 7.80726 3.38477 9.51609 3.38477C11.2248 3.38477 12.6714 3.97668 13.8561 5.16051C15.0406 6.34435 15.6328 7.79085 15.6328 9.50002C15.6328 10.2142 15.513 10.8963 15.2733 11.5463C15.0335 12.1963 14.7136 12.7616 14.3136 13.2423L20.5943 19.523L19.5406 20.577ZM9.51759 14.1155C10.8061 14.1155 11.8974 13.6683 12.7916 12.774C13.6859 11.8798 14.1331 10.7885 14.1331 9.50002C14.1331 8.21152 13.6859 7.12018 12.7916 6.22601C11.8974 5.33168 10.8061 4.88452 9.51759 4.88452C8.22909 4.88452 7.13776 5.33168 6.24359 6.22601C5.34926 7.12018 4.90209 8.21152 4.90209 9.50002C4.90209 10.7885 5.34926 11.8798 6.24359 12.774C7.13776 13.6683 8.22909 14.1155 9.51759 14.1155Z" fill="white" />
            </svg>
            جستجو
        </button>
    )
}
const AddButton: FC = () => {
    const { openAddModal } = useFreelancer()
    return (
        <button
            className="fl-button-1"
            style={{ background: '#EF5644', color: '#fff' }}
            type='button'
            onClick={() => {
                openAddModal()
            }}
        > + افزودن</button>
    )
}
const AdvancedSearchButton: FC<{popup:I_usePopup}> = ({popup}) => {
    const click = () => {
        popup.addModal({
            position: 'center',
            header: { title: 'جستجوی پیشرفته' },
            setAttrs: (key) => {
                if (key === 'modal') {
                    return {
                        style: {
                            minWidth: 300,
                            borderRadius: 12,
                            overflow: 'hidden'
                        }
                    }
                }
            },
            body: <AdvancedSearchModal />
        })
    }
    return (
        <button type='button' className="flex-row- align-v- gap-6- brd-none- bg-none- pointer-" onClick={click}>
            جستجوی پیشرفته <SVG1 />
        </button>
    )
}
const AdvancedSearchModal: FC = () => {
    const { gridHook } = useFreelancer()
    const form = useForm<I_gridFilter["advanced"]>({
        initData: gridHook.gridFilter.advanced,fa:true,inlineLabel:true,
        onSubmit: (data) => gridHook.changeGridFilter({ ...gridHook.gridFilter, advanced: data }),
        liveSubmit: true,
        getLayout: () => {
            return {
                className:'p-12- gap-16-',
                v: [
                    { input: { label: 'شماره موبایل', field: 'mobile', type: 'text', validateType: "irMobile",maxLength:11, filter: ['number'],required:false } },
                    { input: { label: 'کد ملی', field: 'nationalCode', type: 'text', validateType: "irNationalCode",maxLength:10, filter: ['number'],required:false } },
                ]
            }
        }
    })
    return <>{form.renderLayout}</>
}

const SVG1: FC = () => {
    return (
        <svg className='w-36- h-36- br-4- p-6- bg-d-10-' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.25 20.75V15.25H12.75V17.25H20.75V18.75H12.75V20.75H11.25ZM3.25 18.75V17.25H8.75V18.75H3.25ZM7.25 14.75V12.75H3.25V11.25H7.25V9.25H8.75V14.75H7.25ZM11.25 12.75V11.25H20.75V12.75H11.25ZM15.25 8.75V3.25H16.75V5.25H20.75V6.75H16.75V8.75H15.25ZM3.25 6.75V5.25H12.75V6.75H3.25Z" fill="#5F6368" />
        </svg>
    )
}