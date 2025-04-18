import AIOApis from "../../npm/aio-apis";
import { FakeName, GetRandomNumber } from "../../npm/aio-utils";
import { I_broker, I_tag, I_tagRow, I_user } from "./types";
import {Storage} from './../../npm/aio-utils';

export default class Apis extends AIOApis {
    base_url: string
    storage: Storage
    getFakeUsers = (): I_user[] => {
        const length = 30;
        const res: I_user[] = []
        for (let i = 0; i < length; i++) {
            const name = FakeName({ type: "fullname", lang: 'fa' })
            res.push({ name , id: GetRandomNumber(1111111,9999999), tagRows: [] })
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
        if(!this.storage.load('users')){this.storage.save('users', this.getFakeUsers())} 
    }
    private getUsers_temp = (): I_user[] | false => this.storage.load('users', [])
    private getTags = (): I_tag[] => this.storage.load('tags', [])
    private setUsers = (newUsers: I_user[]) => this.storage.save('users', newUsers)
    private setTags = (newTags: I_tag[]) => this.storage.save('tags', newTags)
    private getUserById = (userId: number): I_user | undefined => {
        const users = this.getUsers_temp();
        if(!users){return }
        return users.find((o) => o.id === userId)
    }
    private updateUser = (userId: number, obj: { [key in keyof I_user]?: any }) => {
        const user = this.getUserById(userId);
        if (!user) { return false }
        const newUser = { ...user, ...obj }
        const users = this.getUsers_temp()
        if(!users){return}
        const newUsers = users.map((o) => o.id === userId ? newUser : o)
        this.setUsers(newUsers)
    }
    private hasUserTagId = (userId: number, tagId: number): boolean => {
        const user = this.getUserById(userId);
        return !!user?.tagRows.find((o) => o.tag.id === tagId)
    }
    private getTagById = (tagId: number) => {
        const tags = this.getTags();
        return tags.find((o) => o.id === tagId)
    }
    private removeTag_temp = (tagId: number): boolean => {
        const newTags = this.getTags().filter((o) => o.id !== tagId)
        this.setTags(newTags)
        const users = this.getUsers_temp();
        if(!users){return false}
        const newUsers = users.map((user) => {
            const newTagRows = user.tagRows.filter((o) => o.tag.id !== tagId)
            const newUser: I_user = { ...user, tagRows: newTagRows }
            return newUser
        })
        this.setUsers(newUsers)
        return true
    }
    private addTag_temp = (tagName: string): false | I_tag => {
        const tags = this.getTags();
        if (tags.find((o) => o.name === tagName)) { return false }
        const tagId = GetRandomNumber(444444, 999999)
        const newTags = [...tags, { name: tagName, id: tagId }]
        this.setTags(newTags);
        return { name: tagName, id: tagId }
    }
    private getTagRows_temp = (tagId: number): I_tagRow[] | false => {
        const users = this.getUsers_temp();
        if(!users){return false}
        const fixUsers = users.filter((o) => this.hasUserTagId(o.id, tagId))
        return fixUsers.map((user) => {
            const { tag, broker1, broker2 } = user.tagRows.find((o) => o.tag.id === tagId) as I_tagRow;
            return { tag, broker1, broker2, user }
        })
    }
    private addTagIdToUserId_temp = (tagId: number, userId: number, broker1: I_broker, broker2: I_broker): boolean => {
        debugger
        const tag = this.getTagById(tagId)
        if (!tag || this.hasUserTagId(userId,tagId)) { return false }
        const user = this.getUserById(userId);
        if (!user) { return false }
        const newTagRows: I_tagRow[] = [...user.tagRows, { tag, broker1, broker2, user }]
        this.updateUser(userId, { tagRows: newTagRows })
        return true
    }
    private removeTagFromUserIds_temp = (tagId: number, userIds: number[]): boolean => {
        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i]
            const hasTag = this.hasUserTagId(userId,tagId)
            if (hasTag) {
                const user = this.getUserById(userId);
                if (!user) { continue }
                const newTagRows: I_tagRow[] = user.tagRows.filter((o) => o.tag.id !== tagId)
                this.updateUser(userId, { tagRows: newTagRows })
            }
        }
        return true
    }
    getAllTags = async (): Promise<I_tag[] | false> => {
        return this.getTags()
    }
    getAllBrokers = async () => {
        const res: I_broker[] = this.storage.load('brokers', [
            { name: 'کارگزاری 0', id: 330 },
            { name: 'کارگزاری 1', id: 331 },
            { name: 'کارگزاری 2', id: 332 },
            { name: 'کارگزاری 3', id: 333 },
            { name: 'کارگزاری 4', id: 334 },
            { name: 'کارگزاری 5', id: 335 },
            { name: 'کارگزاری 6', id: 336 },
            { name: 'کارگزاری 7', id: 337 },
            { name: 'کارگزاری 8', id: 338 },
            { name: 'کارگزاری 9', id: 339 },
            { name: 'کارگزاری 10', id: 3310 },
            { name: 'کارگزاری 11', id: 3311 },
            { name: 'کارگزاری 12', id: 3312 },
            { name: 'کارگزاری 13', id: 3313 },
            { name: 'کارگزاری 14', id: 3314 },
        ])
        return res
    }
    getTagRows = async (tagId: number) => {
        return this.getTagRows_temp(tagId)
    }
    addTag = async (tagName: string) => {
        return this.addTag_temp(tagName)
    }
    removeTag = async (tagId: number) => {
        return this.removeTag_temp(tagId)
    }
    addTagIdToUserId = async (tagId: number, userId: number, broker1: I_broker, broker2: I_broker) => {
        return this.addTagIdToUserId_temp(tagId, userId, broker1, broker2)
    }
    removeTagFromUserIds = async (tagId: number, userIds: number[]) => {
        return this.removeTagFromUserIds_temp(tagId, userIds)
    }
    getUsers = async ()=>{
        return this.getUsers_temp()
    }

}