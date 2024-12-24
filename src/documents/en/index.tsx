import { createContext, FC, ReactNode, useContext, useState } from "react";
import './index.css';
import { GetRandomNumber, Storage } from "../../npm/aio-utils";
import allPairs from "./pairs";
import { I_ENCTX, I_pair, I_tab, I_topic } from "./types";
import getAllTopics from "./getAllTopics";
import { AITabs } from "../../npm/aio-input";
import AIOPopup from "../../npm/aio-popup";
const ENCTX = createContext({} as any)
const EN: FC = () => {
    const [tab,setTab] = useState<I_tab>('topics')
    const [popup] = useState<AIOPopup>(new AIOPopup())
    const [storage] = useState<Storage>(new Storage('enlearning'))
    
    const [pairs] = useState<I_pair[]>(allPairs)
    const getPair = (id:string) => {
        return pairs.find((o)=>o.id === id) as I_pair
    }
    const [topics, setTopics] = useState<I_topic[]>(getAllTopics(getPair))
    const getContext = ():I_ENCTX=>{
        return {tab,setTab,topics,openTopic}
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