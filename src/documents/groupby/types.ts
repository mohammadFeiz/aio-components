export type I_tag = {name:string,id:number}
export type I_broker = {name:string,id:number}
export type I_tagRow = {broker1:I_broker,broker2:I_broker,tag:I_tag,user:I_user}
export type I_user = {name:string,id:number,tagRows:I_tagRow[]}
export type I_selectedTag = {tag:I_tag,tagRows:I_tagRow[]}
export type I_tagsHook = {
    tags:I_tag[],
    selectedTag:I_selectedTag | undefined,
    changeSelectedTag:(v:number | undefined)=>void,
    addTag:(tagName:string)=>Promise<boolean>,
    removeTag:()=>Promise<boolean>,
    removeTagFromUser:(tagId:number,userId:number)=>Promise<boolean>
}