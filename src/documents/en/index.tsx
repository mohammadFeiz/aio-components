import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import './index.css';
import { GetRandomNumber, SortArray, Storage } from "../../npm/aio-utils";
import allPairs from "./pairs";
import { I_ENCTX, I_pair, I_tab, I_topic } from "./types";
import getAllTopics from "./getAllTopics";
import { AITabs, AIText } from "../../npm/aio-input";
import AIOPopup from "../../npm/aio-popup";
import ENCTX from "./context";
const EN: FC = () => {
    const [tab,setTab] = useState<I_tab>('topics')
    const [popup] = useState<AIOPopup>(new AIOPopup())
    const [storage] = useState<Storage>(new Storage('enlearning'))
    
    const [pairs,setPairs] = useState<I_pair[]>(allPairs)
    const getPair = (id:string) => {
        return pairs.find((o)=>o.id === id) as I_pair
    }
    const getSortedPairs = ()=>{
        let sortedPairs = SortArray(pairs,[
            {getValue:(o)=>o.lastTime || 0,inc:true},
            {getValue:(o)=>o.score,inc:true}, 
        ])
        sortedPairs[0].lastTime = new Date().getTime()
        setPairs(sortedPairs)
        return sortedPairs
    }
    const [topics, setTopics] = useState<I_topic[]>(getAllTopics(getPair))
    const getContext = ():I_ENCTX=>{
        return {tab,setTab,topics,openTopic,getPair,pairs,getSortedPairs}
    }
    const openTopic = (topic:I_topic)=>{
        popup.addModal({
            header:{title:topic.title},
            body:()=>topic.content
        })
    }
    return (
        <ENCTX.Provider value={getContext()}>
            <Home/>
            {popup.render()}
        </ENCTX.Provider>
    )
}
export default EN

const Home:FC = ()=>{
    const {tab,setTab}:I_ENCTX = useContext(ENCTX)
    const tabs_layout = () => {
        return (
            <AITabs
                value={tab} onChange={(tab)=>setTab(tab)}
                options={[
                    {text:'تاپیک ها',value:'topics'},
                    {text:'سوالات',value:'questions'},
                ]}
            />
        )
    }
    const content_layout = ()=>{
        if(tab === 'topics'){
            return <TopicButtons/>
        }
        if(tab === "questions"){
            return <Question/>
        }
    }
    return (
        <div className="en-home">
            {tabs_layout()}
            {content_layout()}
        </div>
    )
}
const TopicButtons:FC = ()=>{
    const {topics,openTopic}:I_ENCTX = useContext(ENCTX)
    const topicButton_layout = (topic:I_topic)=>{
        return (<div className="topic-button" onClick={()=>openTopic(topic)}>{topic.title}</div>)
    }
    return (<div className="topic-buttons">{topics.map((o)=>topicButton_layout(o))}</div>)
}
const TitleContent: FC<{ title: string, content: ReactNode }> = ({ title, content }) => {
    return (
        <div className="flex-col p-24">
            <h1>{title}</h1>
            {content}
        </div>
    )
}

const Question:FC = ()=>{
    const {getSortedPairs}:I_ENCTX = useContext(ENCTX);
    const [pair,setPair] = useState<I_pair>()
    const [en,setEn] = useState<string>('')
    const [success,setSuccess] = useState<boolean>()
    useEffect(()=>{
        const sortedPairs = getSortedPairs();
        setPair(sortedPairs[0])
    },[])
    if(!pair){return null}
    const change = (value:string)=>{
        setEn(value);
        setSuccess(value === pair.en)
    }
    const getResult = ()=>{
        if(success){return (<div className="en-result en-success">جواب صحیح است</div>)}
        if(!en){return (<div className="en-result en-warning">جواب را وارد کنید</div>)}
        return (<div className="en-result en-error">جواب صحیح نیست</div>)
    }
    return (
        <div className="en-question">
            <div className="en-question-en">{pair.fa}</div>
            <div className="msf">
                <AIText
                    value={en}
                    onChange={(value)=>change(value)}
                />
            </div>
            {getResult()}
        </div>
    )
}