import AIOApis from "../../npm/aio-apis";
import { FakeName, GetRandomNumber } from "../../npm/aio-utils";
import { I_broker, I_tag, I_tagRow, I_user } from "./types";
import { Storage } from './../../npm/aio-utils';

export default class Apis extends AIOApis {
    base_url: string
    storage: Storage
    getFakeUsers = (): I_user[] => {
        const length = 30;
        const res: I_user[] = []
        for (let i = 0; i < length; i++) {
            const name = FakeName({ type: "fullname", lang: 'fa' })
            res.push({ name, id: GetRandomNumber(1111111, 9999999), brokers: [] })
        }
        debugger
        return res
    }
    constructor(p: { token: string, base_url: string }) {
        super({
            id: 'altcoregroupby',
            token: p.token,
            handleErrorMessage: () => 'error',
            lang: 'fa'
        })
        this.base_url = p.base_url
        this.storage = new Storage('altcoregroupbymockstorage')
        if (!this.storage.load('users')) { this.storage.save('users', this.getFakeUsers()) }
    }
    private getUsers_temp = (): I_user[] | false => this.storage.load('users', [])
    private getTags = (): I_tag[] => this.storage.load('tags', [])
    private setUsers = (newUsers: I_user[]) => this.storage.save('users', newUsers)
    private setTags = (newTags: I_tag[]) => this.storage.save('tags', newTags)
    private getUserById = (userId: number): I_user | undefined => {
        const users = this.getUsers_temp();
        if (!users) { return }
        return users.find((o) => o.id === userId)
    }
    private updateUser = (userId: number, obj: { [key in keyof I_user]?: any }) => {
        const user = this.getUserById(userId);
        if (!user) { return false }
        const newUser = { ...user, ...obj }
        const users = this.getUsers_temp()
        if (!users) { return }
        const newUsers = users.map((o) => o.id === userId ? newUser : o)
        this.setUsers(newUsers)
    }
    // private hasUserTagId = (userId: number, tagId: string): boolean => {
    //     const user = this.getUserById(userId);
    //     return !!user?.tagRows.find((o) => o.tag.id === tagId)
    // }
    private getTagById = (tagId: string) => {
        const tags = this.getTags();
        return tags.find((o) => o.id === tagId)
    }
    // private removeTag_temp = (tagId: string): boolean => {
    //     const newTags = this.getTags().filter((o) => o.id !== tagId)
    //     this.setTags(newTags)
    //     const users = this.getUsers_temp();
    //     if (!users) { return false }
    //     const newUsers = users.map((user) => {
    //         const newTagRows = user.tagRows.filter((o) => o.tag.id !== tagId)
    //         const newUser: I_user = { ...user, tagRows: newTagRows }
    //         return newUser
    //     })
    //     this.setUsers(newUsers)
    //     return true
    // }
    private addTag_temp = (tagName: string): false | I_tag => {
        const tags = this.getTags();
        if (tags.find((o) => o.name === tagName)) { return false }
        const tagId = GetRandomNumber(444444, 999999).toString()
        const newTags = [...tags, { name: tagName, id: tagId }]
        this.setTags(newTags);
        return { name: tagName, id: tagId }
    }
    // private getTagRows_temp = (tagId: string): I_tagRow[] | false => {
    //     const users = this.getUsers_temp();
    //     if(!users){return false}
    //     const fixUsers = users.filter((o) => this.hasUserTagId(o.id, tagId))
    //     return fixUsers.map((user) => {
    //         const { tag, broker1, broker2 } = user.tagRows.find((o) => o.tag.id === tagId) as I_tagRow;
    //         return { tag, broker1, broker2, user }
    //     })
    // }
    // private addTagIdToUserId_temp = (tagId: string, userId: number, broker1: I_broker, broker2: I_broker): boolean => {
    //     debugger
    //     const tag = this.getTagById(tagId)
    //     if (!tag || this.hasUserTagId(userId, tagId)) { return false }
    //     const user = this.getUserById(userId);
    //     if (!user) { return false }
    //     const newTagRows: I_tagRow[] = [...user.tagRows, { tag, broker1, broker2, userId: user.id, userName: user.name }]
    //     this.updateUser(userId, { tagRows: newTagRows })
    //     return true
    // }
    // private removeTagFromUserIds_temp = (tagId: string, userIds: number[]): boolean => {
    //     for (let i = 0; i < userIds.length; i++) {
    //         const userId = userIds[i]
    //         const hasTag = this.hasUserTagId(userId, tagId)
    //         if (hasTag) {
    //             const user = this.getUserById(userId);
    //             if (!user) { continue }
    //             const newTagRows: I_tagRow[] = user.tagRows.filter((o) => o.tag.id !== tagId)
    //             this.updateUser(userId, { tagRows: newTagRows })
    //         }
    //     }
    //     return true
    // }
    getAllTags = async (tagId?: string) => {
        //return this.getTags()
        const { success, response } = await this.request<{
            data: {
                content: {
                    active: boolean,
                    createByName: string,
                    groupCode: string,
                    groupName: string,
                    id: string
                }[]
            }
        }>({
            name: 'getAllTags',
            description: 'دریافت لیست گروه ها',
            method: 'get',
            url: `${this.base_url}/v1/subscriber-group${tagId !== undefined ? `?search=id:${tagId}` : ''}`
        })
        if (success) {
            const res: I_tag[] = response.data.content.map((o) => {
                return {
                    name: o.groupName,
                    id: o.id
                }
            })
            return res
        }
        else {
            return false
        }
    }
    getTagRows = async (tagId: string) => {
        //return this.getTagRows_temp(tagId)
        const { response, success } = await this.request<{
            data: {
                content: {
                    active: boolean,
                    createdByName: string,
                    id: number,
                    optionBrokerAccount: {
                        brokerName: string,
                        brokerNameFa: string,
                        id: number,
                        tokenExpireTime: string,
                        tokenValid: boolean,
                        username: string
                    },
                    priority: number,
                    stockBrokerAccount: {
                        brokerName: string,
                        brokerNameFa: string,
                        id: number,
                        tokenExpireTime: string,
                        tokenValid: boolean,
                        username: string,
                    },
                    subscriber: {
                        firstName: string,
                        id: number,
                        lastName: string
                    },
                    subscriberGroup: {
                        groupCode: string,
                        groupName: string,
                        id: string
                    }
                }[]
            }
        }>({
            name: 'getTagRows',
            description: 'نمیدونم',
            method: 'get',
            url: `${this.base_url}/v1/subscriber-group-member?search=subscriberGroup.id:${tagId}&page=0&size=400`
        })
        if (success) {
            const res: I_tagRow[] = response.data.content.map((o) => {
                return {
                    userId: o.subscriber.id,
                    userName: `${o.subscriber.firstName} ${o.subscriber.lastName}`,
                    tag: {
                        id: o.subscriberGroup.id,
                        name: o.subscriberGroup.groupName
                    },
                    broker1: {
                        name: o.stockBrokerAccount.brokerNameFa,
                        id: o.stockBrokerAccount.id
                    },
                    broker2: {
                        name: o.optionBrokerAccount.brokerNameFa,
                        id: o.optionBrokerAccount.id
                    }
                }
            });
            return res
        }
        else {
            return false
        }
    }
    addTag = async (tagName: string) => {
        //return this.addTag_temp(tagName)
        const body = {
            "groupName": tagName
        }
        const { response, success } = await this.request<{ data: string }>({
            name: '',
            method: 'post',
            description: 'ایجاد گروه',
            url: `${this.base_url}/v1/subscriber-group`,
            body
        })
        if (success) {
            const tagId = response.data;
            const list: any = await this.getAllTags(tagId);
            const res: I_tag = { id: tagId, name: list[0].name }
            return res
        }
        else {
            return false
        }

    }
    removeTag = async (tagId: string) => {
        //return this.removeTag_temp(tagId)
        const { response, success } = await this.request<any>({
            name: 'removeTag',
            description: 'حذف گروه',
            method: 'delete',
            url: `${this.base_url}/v1/subscriber-group/${tagId}`
        })
        if (success) { return true }
        else { return false }
    }
    addTagIdToUserId = async (tagId: string, userId: number, broker1: I_broker, broker2: I_broker) => {
        //return this.addTagIdToUserId_temp(tagId, userId, broker1, broker2)
        const body = [{
            "subscriberGroupId": tagId,
            "subscriberId": userId,
            "stockBrokerAccountId": broker1.id,
            "optionBrokerAccountId": broker2.id,
        }]
        const {response,success} = await this.request<any>({
            name:'addTagIdToUserId',
            description:'افزودن مشترک به گروه',
            method:'post',
            url:`${this.base_url}/v1/subscriber-group-members`,
            body
        })
        if(success){
            debugger
            return true
        }
        else {
            debugger
            return false
        }
    }
    removeTagFromUserIds = async (tagId: string, userIds: number[]) => {
        const {response,success} = await this.request<any>({
            name:'removeTagFromUserIds',
            description:'حذف مشترک از گروه',
            method:'delete',
            url:`${this.base_url}/v1/subscriber-group-member/${userIds[0]}`
        })
        if(success){
            debugger
            return true
        }
        else {
            debugger
            return false
        }
    }
    getUsers = async () => {
        //return this.getUsers_temp()
        debugger
        const { response, success } = await this.request<{
            data: {
                content: {
                    active: boolean,
                    firstName: string,
                    lastName: string,
                    id: number,
                    userId: number,
                    mobileNumber: string,
                    nationalCode: "0942254687",
                    brokerAccount: {
                        brokerName: string,
                        brokerNameFa: string,//name vaghei
                        id: number,
                        tokenExpireTime: string,
                        tokenValid: boolean,
                        username: string //mobile
                    }[]
                }[]
            }
        }>({
            name: '',
            description: '',
            method: 'get',
            url: `${this.base_url}/v1/subscriber?page=0&size=400`
        })
        if (success) {
            debugger
            const res: I_user[] = response.data.content.map((o) => {
                return {
                    brokers: o.brokerAccount.map((b) => ({ name: b.brokerNameFa, id: b.id })),
                    name: o.firstName + ' ' + o.lastName,
                    id: o.id,
                    tagRows: []
                }
            })
            return res
        }
        else {
            debugger
        }
    }

}