import { FC, useEffect, useRef, useState } from "react";
import AIOApis from "../../npm/aio-apis";
import { FakeName, GetRandomNumber, Storage } from "../../npm/aio-utils";
import { GroupByProvider, useGroupByContext } from "./context";
import { I_broker, I_selectedTag, I_tag, I_tagRow, I_tagsHook, I_user } from "./types";
import { AISelect } from "../../npm/aio-input";
import usePopup from "../../npm/aio-popup";
import Icon from "@mdi/react";
import { mdiAccount, mdiClose, mdiOfficeBuilding } from "@mdi/js";
import Apis from "./apis";
import AIOTable from './../../npm/aio-table'; 
const GroupBy: FC = () => {
    const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZDc0YTgwYi1jNDlhLTQ3MDEtOWM5ZS00NjM4M2QwYzgwZGEiLCJpYXQiOjE3NDUxMjYwMTIsImV4cCI6MTc0NTE1NDgxMn0.zkJhgXVhTEubjDNqfy5NEa6xrbKqTHjsQf6UmbXzy2zIKFL8sTRvHsO_9gGOfdMBnH03Pu7QXX1GU5KxoIeLmw';
    const base_url = 'https://dev.altc.ir/api'
    const apisRef = useRef<Apis>(new Apis({ token, base_url }))
    const apis = apisRef.current;
    const tagsHook = useTags(apis)
    const popup = usePopup({ rtl: true })
    const openAddTagModal = () => {
        popup.addPrompt({ title: 'افزودن گروه', text: 'نام گروه را وارد کنید', onSubmit: (name) => tagsHook.addTag(name) })
    }
    const openRemoveTagModal = () => {
        popup.addConfirm({ title: 'حذف گروه', text: 'از حذف این گروه اطمینان دارید', onSubmit: () => tagsHook.removeTag() })
    }
    const openRemoveUserModal = (tagId: string, userId: number,callback:()=>void) => {
        popup.addConfirm({ title: 'حذف گروه', text: 'از حذف این کاربر از گروه اطمینان دارید', onSubmit: async () => {
            const res = await tagsHook.removeTagFromUser(tagId, userId)
            if(res){callback(); return true}
            return false
        } })
    }
    const openAddUserModal = () => {
        if (!tagsHook.selectedTag) { return }
        popup.addModal({
            header: { title: 'افزودن فرد به گروه', subtitle: tagsHook.selectedTag.tag.name },
            body: <AddUserModal />
        })
    }
    return (
        <GroupByProvider value={{
            tagsHook, openAddTagModal, openRemoveTagModal, openAddUserModal,openRemoveUserModal, apis, popup
        }}>
            <div className="flex-col- p-12- rtl- fullscreen-">
                <GroupByHeader />
                <GroupByBody />
            </div>
            {popup.render()}
        </GroupByProvider>
    )
}
export default GroupBy;
const GroupByHeader: FC = () => {
    const { tagsHook, openAddTagModal, openRemoveTagModal, openAddUserModal } = useGroupByContext()
    return (
        <div className="h-48- flex-row- align-v- gap-12- brd-c-12- brd-b-">
            <div className="msf">انتخاب گروه</div>
            {
                !!tagsHook.tags.length &&
                <AISelect
                    className='w-240-' popover={{ fitHorizontal: true }}
                    options={tagsHook.tags}
                    option={{
                        text: (tag) => tag.name,
                        value: (tag) => tag.id
                    }}
                    value={tagsHook.selectedTag?.tag.id}
                    onChange={(v) => tagsHook.changeSelectedTag(v)}
                />
            }
            {
                !tagsHook.tags.length &&
                <div className="fs-12- bg-d-10- p-6- br-6-">هنوز گروهی ایجاد نشده است</div>
            }
            <div className="flex-1-"></div>
            <button className='gb-button-1' onClick={() => openAddUserModal()}>افزودن فرد به گروه</button>
            <button className='gb-button-1' onClick={() => openAddTagModal()}>افزودن گروه</button>
            {
                !!tagsHook.selectedTag &&
                <button className='gb-button-2' onClick={() => openRemoveTagModal()}>حذف گروه</button>
            }
        </div>
    )
}
const GroupByBody: FC = () => {
    const { tagsHook } = useGroupByContext()
    if (!tagsHook.selectedTag) {
        return (
            <div className="flex-1- flex-row- h-100- align-vh-">گروهی انتخاب نشده است</div>
        )
    }
    if (!tagsHook.selectedTag.tagRows.length) {
        return (
            <div className="flex-1- flex-row- h-100- align-vh-">هنوز فردی به این گروه اختصاص نیافته است</div>
        )
    }

    return <TagRowsTable tagRows={tagsHook.selectedTag.tagRows}/>
}
const TagRowsTable: FC<{ tagRows: I_tagRow[] }> = (props) => {
    const [tagRows,setTagRows] = useState<I_tagRow[]>(props.tagRows)
    const { openRemoveUserModal } = useGroupByContext()
    const openRemoveUserModal_current = (tagId:string,userId:number)=>{
        openRemoveUserModal(tagId,userId,()=>{
            setTagRows(tagRows.filter((o)=>{
                if(o.tag.id !== tagId){return true}
                if(o.user.id !== userId){return true}
                return false
            }))
        })
    }
    return (
        <div className="flex-1-">
            <AIOTable
                value={tagRows}
                columns={[
                    {
                        title: '', width: 48,
                        template: ({ row }) => {
                            return (
                                <div className='w-24- h-24- br-6- flex-row- align-vh-' style={{background:'red',color:'#fff'}} onClick={() => openRemoveUserModal_current(row.tag.id, row.user.id)}>
                                    <Icon path={mdiClose} size={0.8} />
                                </div>
                            )
                        }
                    },
                    { title: 'نام کاربر', value: 'row.user.name' },
                    { title: 'نام گروه', value: 'row.tag.name' },
                    { title: 'کارگزاری اول', value: 'row.broker1.name' },
                    { title: 'کارگزاری دوم', value: 'row.broker2.name' },
                ]}
            />
        </div>
    )
}
const AddUserModal: FC = () => {
    const { apis, popup, tagsHook } = useGroupByContext()
    const [users, setUsers] = useState<I_user[]>([])
    const [brokers, setBrokers] = useState<I_broker[]>([])
    const [selectedUser, setSelectedUser] = useState<I_user>()
    const [selectedBroker, setSelectedBroker] = useState<{ broker1: I_broker | undefined, broker2: I_broker | undefined }>({ broker1: undefined, broker2: undefined })
    const dic = {
        broker1: 'اول',
        broker2: 'دوم'
    }
    const fetchUsers = async () => {
        const res = await apis.getUsers()
        //if (res) { setUsers(res) }
    }
    const fetchBrokers = async () => {
        const res = await apis.getAllBrokers()
        if (res) { setBrokers(res) }
    }
    useEffect(() => {
        fetchUsers()
        fetchBrokers()
    }, [])
    const getBrokerLayout = (type: 'broker1' | 'broker2') => {
        const id = selectedBroker[type]?.id
        return (
            <div className="flex-row- align-vh- gap-6- p-12- flex-1-">
                <div className="nowrap-">{`انتخاب کار گزاری ${dic[type]}`}</div>
                <AISelect
                    options={brokers}
                    className='w-228-'
                    option={{
                        text: (user: I_user) => user.name,
                        subtext: (user: I_user) => user.id,
                        value: (user: I_user) => user.id,
                        before: (user: I_user) => <Icon path={mdiOfficeBuilding} size={0.8} />
                    }}
                    value={id}
                    onChange={(id, { index }) => setSelectedBroker({ ...selectedBroker, [type]: brokers[index] })}
                />
            </div>
        )
    }
    const isDisabled = () => {
        if (!selectedUser) { return true }
        if (!selectedBroker.broker1) { return true }
        if (!selectedBroker.broker2) { return true }
        return false
    }
    const submit = async () => {
        if (!selectedUser) { return }
        const tagId = tagsHook.selectedTag?.tag.id
        if (!tagId) { return }
        const userId = selectedUser.id
        const { broker1, broker2 } = selectedBroker;
        if (!broker1 || !broker2) { return }
        const res = await apis.addTagIdToUserId(tagId, userId, broker1, broker2)
        if (res) {
            tagsHook.changeSelectedTag(tagsHook.selectedTag?.tag.id)
            popup.removeModal()
        }
    }
    return (
        <div className="flex-col-">
            <div className="flex-row- align-v- gap-12- p-12- flex-1-">
                <div className="nowrap-">انتخاب فرد</div>
                <AISelect
                    className="w-240-" popover={{ fitHorizontal: true }}
                    options={users}
                    option={{
                        text: (user: I_user) => user.name,
                        subtext: (user: I_user) => user.id,
                        value: (user: I_user) => user.id,
                        before: (user: I_user) => <Icon path={mdiAccount} size={0.8} />
                    }}
                    value={selectedUser?.id}
                    onChange={(id, o) => setSelectedUser(users[o.index])}
                />
            </div>
            {
                !!selectedUser &&
                <div className="msf">
                    <UserTags user={selectedUser} />
                </div>
            }
            {
                !!selectedUser &&
                <div className="flex-row- align-v- w-100-">
                    {getBrokerLayout('broker1')}
                    {getBrokerLayout('broker2')}
                </div>
            }
            <div className="flex-row- align-v- p-12- gap-12-">
                <button className="gb-button-3" onClick={() => popup.removeModal()}>بستن</button>
                <button className="gb-button-1" onClick={submit} disabled={isDisabled()}>افزودن</button>
            </div>
        </div>
    )
}
const UserTags: FC<{ user: I_user }> = ({ user }) => {
    const { tagRows } = user
    if (!tagRows.length) {
        return (
            <div className="p-12- w-100- flex-row- align-vh- bg-d-10-">این کاربر در هیچ گروهی عضو نیست</div>
        )
    }
    return (
        <TagRowsTable tagRows={tagRows}/>
    )
}
const useTags = (apis: Apis): I_tagsHook => {
    const [tags, setTags] = useState<I_tag[]>([])
    const [selectedTag, setSelectedTag] = useState<I_selectedTag | undefined>()
    const changeSelectedTag = async (tagId: string | undefined) => {
        if (tagId === undefined) { setSelectedTag(undefined) }
        else {
            const tag = tags.find((o) => o.id === tagId);
            if (!tag) { setSelectedTag(undefined); return }
            const tagRows = await apis.getTagRows(tagId);
            if (tagRows) { setSelectedTag({ tag, tagRows }) }
        }
    }
    const fetchTags = async () => {
        const res = await apis.getAllTags();
        if (res) { setTags(res) }
    }
    const addTag = async (tagName: string) => {
        const tag = await apis.addTag(tagName)
        if (tag) {
            setTags([...tags, tag]);
            const newSelectedTag: I_selectedTag = { tag, tagRows: [] }
            setSelectedTag(newSelectedTag)
            return true
        }
        return false
    }
    const removeTag = async () => {
        if (!selectedTag) { return true }
        const tagId = selectedTag.tag.id;
        const res = await apis.removeTag(tagId)
        if (res) {
            setTags(tags.filter((o) => o.id !== tagId));
            setSelectedTag(undefined)
            return true
        }
        return false
    }
    const removeTagFromUser = async (tagId: string, userId: number): Promise<boolean> => {
        const res = await apis.removeTagFromUserIds(tagId, [userId])
        if (res) { return true }
        else { return false }
    }
    useEffect(() => {
        fetchTags()
    }, [])
    return { tags, selectedTag, changeSelectedTag, addTag, removeTag, removeTagFromUser }
}