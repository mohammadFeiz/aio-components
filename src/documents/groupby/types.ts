export type I_tag = {name:string,id:string}
export type I_broker = {name:string,id:number}
export type I_tagRow = {broker1:I_broker,broker2:I_broker,tag:I_tag,userId:number,userName:string}
export type I_user = {name:string,id:number,brokers:I_broker[]}
export type I_selectedTag = {tag:I_tag,tagRows:I_tagRow[]}
export type I_tagsHook = {
    tags:I_tag[],
    selectedTag:I_selectedTag | undefined,
    changeSelectedTag:(v:string | undefined)=>void,
    addTag:(tagName:string)=>Promise<boolean>,
    removeTag:()=>Promise<boolean>,
    removeTagFromUser:(tagId:string,userId:number)=>Promise<boolean>
}