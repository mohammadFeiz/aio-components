import { ReactNode } from "react"
import AIOPopup from "../../npm/aio-popup"

export type I_pair = {
    en: string,
    fa: string,
    id:string,
    topicIds?:string[],
    score:number,
    lastTime?:number,
    hints?:string[]
}
export type I_topic = {
    title: string,
    id: string,
    content: ReactNode
}
export type I_tab = 'topics' | 'questions' | 'words'
export type I_ENCTX = {
    tab:I_tab,setTab:(tab:I_tab)=>void,
    topics:I_topic[],openTopic:(topic:I_topic)=>void,
    getPair:(id:string)=>I_pair,pairs:I_pair[],
    getPairByPriority:()=>I_pair,
    changePair:(pairId:string,deltaScore:number)=>void,
    words:I_words,
    getWordByPriority:()=>{word:I_word,en:string},
    changeWords:(en:string,deltaScore:number)=>void,
    popup:AIOPopup,
    wordsScore:number,
    pairsScore:number
}
export type I_word = {fa:string,score:number,lastTime:number}
export type I_words = {[en:string]:I_word}
export type I_save = (type:'pairs' | 'words',data:I_pair[] | I_words)=>void;