import { ReactNode } from "react"

export type I_pair = {
    en: string,
    fa: string,
    id:string,
    topicIds?:string[],
    score:number,
    lastTime?:number
}
export type I_topic = {
    title: string,
    id: string,
    content: ReactNode
}
export type I_tab = 'topics' | 'questions'
export type I_ENCTX = {
    tab:I_tab,setTab:(tab:I_tab)=>void,
    topics:I_topic[],openTopic:(topic:I_topic)=>void,
    getPair:(id:string)=>I_pair,pairs:I_pair[],
    getSortedPairs:()=>I_pair[]
}
