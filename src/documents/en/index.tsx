import { createContext, FC, ReactNode, useContext, useEffect, useRef, useState } from "react";
import './index.css';
import { GetRandomNumber, SortArray, Storage } from "../../npm/aio-utils";
import allPairs from "./pairs";
import { I_ENCTX, I_pair, I_save, I_tab, I_topic, I_word, I_words } from "./types";
import getAllTopics from "./getAllTopics";
import { AITabs, AIText } from "../../npm/aio-input";
import AIOPopup from "../../npm/aio-popup";
import ENCTX from "./context";
import allWords from './words';
import { SQL } from "../../npm/aio-cordova";
const App: FC = () => {
    const [appMode] = useState<'pc' | 'mobile'>('pc')
    const [storage] = useState<Storage>(new Storage('enlearning'))
    const [sql] = useState<SQL | undefined>(getSql)
    function getSql(){
        if(appMode !== 'mobile'){return}
        return new SQL({
            dbName: 'ile',
            onError: (err) => alert(err),
            tables: [
                {
                    name: 'words',
                    primaryKey: 'id',
                    columns: {
                        str: "TEXT",
                        id: "TEXT"
                    }
    
                },
                {
                    name: 'pairs',
                    primaryKey: 'id',
                    columns: {
                        id: "TEXT",
                        str: "TEXT"
                    }
                }
            ]
        })
    }
    const [pairs, setPairs] = useState<I_pair[]>()
    const [words, setWords] = useState<I_words>()
    function load(type:'pairs' | 'words') {
        const def = type === 'pairs'?allPairs:allWords;
        const setState = (data:I_pair[] | I_words)=>{
            if(type === 'pairs'){setPairs(data as I_pair[])}
            else {setWords(data as I_words)}
        }
        if (appMode === 'pc') {setState(storage.load(type, def))}
        else if(sql){
            sql.getRow({
                tableName: type,
                searchObj: { id: '1' },
                errorCallback: (err) => alert(err),
                successCallback: (row) => {
                    if (row === null) {
                        sql.addRow({
                            tableName: type,
                            row: { id: '1',str:JSON.stringify(def) },
                            errorCallback: (err) => alert(err),
                            successCallback: () => setState(def)
                        })
                    }
                    else {
                        setState(JSON.parse(row.str))
                    }
                }
            })
        }
    }
    function save(type:'pairs' | 'words',data:I_pair[] | I_words){
        if(appMode === 'pc'){storage.save(type,data)}
        else if(sql){
            sql.editRow({
                tableName:type,
                row:{id:'1',str:JSON.stringify(data)},
                errorCallback:(err)=>alert(err),
                successCallback:()=>{}
            })
        }
    }
    useEffect(()=>{load('pairs'); load('words');})
    return !pairs || !words?null:<EN pairs={pairs} words={words} save={save}/>
}
export default App

const EN: FC<{ pairs: I_pair[], words: I_words, save: I_save}> = (props) => {
    const [tab, setTab] = useState<I_tab>('topics')
    const [popup] = useState<AIOPopup>(new AIOPopup())
    const [pairs, setPairs] = useState<I_pair[]>(props.pairs)
    const [words, setWords] = useState<I_words>(props.words)
    const pairsRef = useRef(pairs)
    pairsRef.current = pairs
    const wordsRef = useRef(words)
    wordsRef.current = words
    const [wordsScore, setWordsScore] = useState<number>(0)
    const [pairsScore, setPairsScore] = useState<number>(0)
    const getWordsScore = (WORDS = words) => {
        let length = 0;
        let total = 0;
        for (let prop in WORDS) {
            length++;
            const { score } = WORDS[prop]
            total += Math.min(score, 1);
        }
        return +(100 * total / length).toFixed(1)
    }
    const getPairsScore = (PAIRS = pairs) => {
        let length = PAIRS.length * 5;
        let total = 0;
        for (let pair of PAIRS) {
            const { score } = pair
            total += Math.min(score, 5);
        }
        return +(100 * total / length).toFixed(1)
    }
    useEffect(() => {
        updateWordsScore()
        updatePairsScore()
    }, [])
    const updateWordsScore = (words?: I_words) => {
        setWordsScore(getWordsScore(words))
    }
    const updatePairsScore = (pairs?: I_pair[]) => {
        setPairsScore(getPairsScore(pairs))
    }
    const getPair = (id: string) => {
        return pairs.find((o) => o.id === id) as I_pair
    }
    const getPairByPriority = (): I_pair => {
        const pairs = pairsRef.current;
        let sortedPairs = SortArray(pairs, [{ getValue: (o) => (o.lastTime || 0), inc: true }])
        setPairs(sortedPairs);
        let res: I_pair = sortedPairs[0], min = Infinity;
        const a = Math.floor(pairs.length / 2);
        for (let i = 0; i < a; i++) {
            const p = sortedPairs[i];
            if (p.score < min) {
                min = p.score;
                res = p
            }
        }
        return res
    }
    const getWordByPriority = (): { word: I_word, en: string } => {
        const words = wordsRef.current;
        const list: { word: I_word, en: string }[] = []
        for (let en in words) {
            list.push({ word: words[en], en })
        }
        let sortedList: { word: I_word, en: string }[] = SortArray(list, [{ getValue: (o) => o.word.lastTime, inc: true }])
        const lastTime = new Date().getTime();
        let res: { word: I_word, en: string } = sortedList[0], min = Infinity;
        const a = Math.floor(list.length / 2);
        for (let i = 0; i < a; i++) {
            const w = sortedList[i];
            if (w.word.score < min) {
                min = w.word.score;
                res = w
            }
        }
        setWords({ ...words, [res.en]: { ...words[res.en], lastTime } })
        return res
    }
    const changePair = (pairId: string, deltaScore: number) => {
        const pairs = pairsRef.current;
        const newPairs = pairs.map((o) => {
            if (o.id !== pairId) { return o }
            let newScore = o.score + deltaScore;
            return { ...o, score: newScore, lastTime: new Date().getTime() }
        })
        updatePairsScore(newPairs)
        props.save('pairs',newPairs)
        setPairs(newPairs)
    }
    const changeWords = (en: string, deltaScore: number) => {
        const words = wordsRef.current;
        let newScore = words[en].score + deltaScore;
        const newWord = { ...words[en], score: newScore, lastTime: new Date().getTime() };
        const newWords = { ...words, [en]: newWord }
        updateWordsScore(newWords)
        props.save('words',newWords)
        setWords(newWords)
    }
    const [topics, setTopics] = useState<I_topic[]>(getAllTopics())
    const getContext = (): I_ENCTX => {
        return {
            tab, setTab, topics, openTopic, getPair, pairs, getPairByPriority, changePair, popup,
            getWordByPriority, changeWords, words, pairsScore, wordsScore
        }
    }
    const openTopic = (topic: I_topic) => {
        popup.addModal({
            header: { title: topic.title },
            body: () => topic.content
        })
    }
    return (
        <ENCTX.Provider value={getContext()}>
            <div className="en-app fafont">
                <Home />
                {popup.render()}
            </div>
        </ENCTX.Provider>
    )
}

const Home: FC = () => {
    const { tab, setTab, wordsScore, pairsScore }: I_ENCTX = useContext(ENCTX)
    const scores_layout = () => {
        return (
            <div className="flex-row gap-12 align-v p-h-6 en-score">
                {score_layout('سوالات', pairsScore)}
                {score_layout('لغات', wordsScore)}
            </div>
        )
    }
    const score_layout = (key: string, value: number) => {
        return (
            <div className="flex-row gap-6 align-v en-score-item">
                <div className="en-score-item-key">{key}</div>
                <div className="en-score-item-value">{`${value}%`}</div>
            </div>
        )
    }
    const tabs_layout = () => {
        const options: { text: string, value: I_tab }[] = [
            { text: 'تاپیک ها', value: 'topics' },
            { text: 'سوالات', value: 'questions' },
            { text: 'لغات', value: 'words' },
        ]
        return (
            <AITabs
                value={tab}
                onChange={(tab) => setTab(tab)} options={options}
                after={scores_layout()}
            />
        )
    }
    const content_layout = () => {
        if (tab === 'topics') {
            return <TopicButtons />
        }
        if (tab === "questions") {
            return (<div className="flex-row align-vh h-100"><QuestionButton /></div>)
        }
        if (tab === "words") {
            return (<div className="flex-row align-vh h-100"><WordsButton /></div>)
        }
    }
    return (
        <div className="en-home">
            {tabs_layout()}
            {content_layout()}
        </div>
    )
}
const TopicButtons: FC = () => {
    const { topics, openTopic }: I_ENCTX = useContext(ENCTX)
    const topicButton_layout = (topic: I_topic) => {
        return (<div className="topic-button" onClick={() => openTopic(topic)}>{topic.title}</div>)
    }
    return (<div className="topic-buttons">{topics.map((o) => topicButton_layout(o))}</div>)
}
const TitleContent: FC<{ title: string, content: ReactNode }> = ({ title, content }) => {
    return (
        <div className="flex-col p-24">
            <h1>{title}</h1>
            {content}
        </div>
    )
}
const QuestionButton: FC = () => {
    const { popup, changePair, getPairByPriority }: I_ENCTX = useContext(ENCTX)
    const showQuestion = () => {
        const pair = getPairByPriority()
        changePair(pair.id, -5);
        const words: string[] = pair.en.split(' ');
        popup.addModal({
            body: ({ close }) => (
                <Question
                    onClose={(deltaScore: number) => {
                        changePair(pair.id, deltaScore + 5);
                        close()
                    }}
                    pair={pair} words={words}
                />
            )
        })
    }
    return (<button className='en-show-question-button' onClick={showQuestion}>نمایش سوال</button>)
}
const WordsButton: FC = () => {
    const { popup, changeWords, getWordByPriority }: I_ENCTX = useContext(ENCTX)
    const showQuestion = () => {
        const word = getWordByPriority();
        changeWords(word.en, -1);
        popup.addModal({
            body: ({ close }) => (
                <Word
                    onClose={(deltaScore: number) => {
                        changeWords(word.en, deltaScore + 1);
                        close()
                    }}
                    fa={word.word.fa} en={word.en}
                />
            )
        })
    }
    return (<button className='en-show-question-button' onClick={showQuestion}>نمایش لغت</button>)
}
type I_answerWord = { success: boolean, value: string, done: boolean, hint: boolean };
type I_Question = {
    onClose: (deltaScore: number) => void,
    pair: I_pair,
    words: string[]
}
const Question: FC<I_Question> = ({ onClose, words, pair }) => {
    const [questionWords] = useState<string[]>(words)
    const [answerWords, setAnswerWords] = useState<I_answerWord[]>(getAnswerWords)
    function getAnswerWords(): I_answerWord[] {
        return words.map(() => ({ success: false, value: '', done: false, hint: false }))
    }
    const [hintCount, setHintCount] = useState<number>(0)
    if (!questionWords || !answerWords) { return null }
    const change = (index: number, value: string) => {
        value = value.toLowerCase()
        const newAnswerWords: I_answerWord[] = answerWords.map((o, i) => {
            if (i !== index) { return answerWords[i] }
            const success = value === questionWords[i].toLowerCase();
            return { ...answerWords[i], value, success, done: !!success }
        })
        setAnswerWords(newAnswerWords)
    }
    const getHintIndex = (hints: string[]): number => {
        let index = -1;
        for (let i = 0; i < questionWords.length; i++) {
            const qw = questionWords[i];
            if (qw !== hints[hintCount]) { continue }
            if (answerWords[i].done) { continue }
            index = i;
            break;
        }
        return index
    }
    const addHint = () => {
        if (!pair) { return }
        const { hints = [] } = pair;
        if (!hints.length || !hints[hintCount]) { return }
        const index = getHintIndex(hints);
        if (index === -1 || index > hints.length - 1) { return }
        const newAnserWords: I_answerWord[] = answerWords.map((o, i) => {
            return i !== index ? o : { ...o, success: true, value: questionWords[index], done: true, hint: true }
        })
        setAnswerWords(newAnserWords);
        setHintCount(hintCount + 1);
    }
    const successLength = answerWords.filter((aw) => !!aw.success).length;
    const doneLength = answerWords.filter((aw) => !!aw.done).length;
    const length = questionWords.length
    const setGiveUp = () => {
        const { hints = [] } = pair;
        const newAnswerWords: I_answerWord[] = answerWords.map((o, i) => {
            return o.success ? o : { ...o, value: questionWords[i], success: false, done: true }
        })
        setAnswerWords(newAnswerWords);
        setHintCount(hints.length)
    }
    const buttons_layout = () => {
        return (
            <div className="w-100 flex-row align-vh gap-12 p-12">
                {giveup_button_layout()}
                {hint_button_layout()}
                {exit_button_layout()}
            </div>
        )
    }
    const hint_button_layout = () => {
        const { hints = [] } = pair;
        if (doneLength === length || !hints[hintCount]) { return null }
        return <button className='en-button en-warning' onClick={addHint}>راهنمایی کن</button>
    }
    const giveup_button_layout = () => {
        if (doneLength === length) { return null }
        return <button className='en-button en-danger' onClick={setGiveUp}>بلد نیستم</button>
    }
    const exit_button_layout = () => {
        if (length !== doneLength) { return null }
        const isSuccess = length === successLength
        let score = -hintCount + (isSuccess ? 5 : -5);
        score = score < -5 ? -5 : score;
        const text = `خروج با ${Math.abs(score)} امتیاز ${score < 0 ? 'منفی' : 'مثبت'}`
        let scoreClass = '';
        if (score < 0) { scoreClass = 'en-danger' }
        else if (score === 5) { scoreClass = 'en-success' }
        else if (score > 0) { scoreClass = 'en-info' }
        else { scoreClass = 'en-danger' }
        return (<button className={`en-button ${scoreClass}`} onClick={() => onClose(score)}>{text}</button>)
    }
    const getInputStyle = (answerWord: I_answerWord) => {
        let color = '#ff0000';
        if (answerWord.hint) { color = '#ffa500' }
        else if (answerWord.success) { color = '#008000' }
        return { border: `1px solid ${color}`, background: color + '30' }
    }
    const inputs_layout = () => {
        return (
            <div className="flex-row ltr">
                {answerWords.map((aw, i) => input_layout(aw, i))}
            </div>
        )
    }
    const input_layout = (answerWord: I_answerWord, index: number) => {
        const { success, value } = answerWord;
        return (
            <AIText key={index}
                value={value} justify={true}
                onChange={(newValue) => change(index, newValue)}
                disabled={!!success}
                className={`flex-${questionWords[index].length} c-0 op-100`}
                style={getInputStyle(answerWord)}
            />
        )
    }
    return (
        <div className="en-question">
            <div className="rtl fs-12 m-b-6">{pair.fa}</div>
            {inputs_layout()}
            {buttons_layout()}
        </div>
    )
}


type I_Word = {
    onClose: (deltaScore: number) => void,
    en: string,
    fa: string
}
const Word: FC<I_Word> = ({ onClose, en, fa }) => {
    const [answer, setAnswer] = useState<string>('')
    const [isGiveUp, setIsGiveUp] = useState<boolean>(false)
    const change = (value: string) => {
        setAnswer(value)
    }
    const buttons_layout = () => {
        return (
            <div className="w-100 flex-row align-vh gap-12 p-12">
                {giveup_button_layout()}
                {exit_button_layout()}
            </div>
        )
    }
    const exit_button_layout = () => {
        const isSuccess = fa === answer
        if (!isSuccess) { return null }
        let score = isGiveUp ? -1 : 1;
        const text = `خروج با یک امتیاز ${score < 0 ? 'منفی' : 'مثبت'}`
        let scoreClass = '';
        if (score < 0) { scoreClass = 'en-danger' }
        else { scoreClass = 'en-success' }
        return (<button className={`en-button ${scoreClass}`} onClick={() => onClose(score)}>{text}</button>)
    }
    const setGiveUp = () => {
        setIsGiveUp(true);
        setAnswer(fa)
    }
    const giveup_button_layout = () => {
        const isSuccess = fa === answer
        if (isSuccess) { return null }
        return <button className='en-button en-danger' onClick={setGiveUp}>بلد نیستم</button>
    }
    const getInputStyle = () => {
        const isSuccess = fa === answer
        let color = '#ff0000';
        if (isGiveUp) { color = '#ffa500' }
        else if (isSuccess) { color = '#008000' }
        return { border: `1px solid ${color}`, background: color + '30' }
    }
    const input_layout = () => {
        return (
            <AIText
                value={answer} justify={true}
                onChange={(newAnswer) => change(newAnswer)}
                style={getInputStyle()}
            />
        )
    }
    return (
        <div className="en-question">
            <div className="rtl fs-12 m-b-6">{en}</div>
            {input_layout()}
            {buttons_layout()}
        </div>
    )
}