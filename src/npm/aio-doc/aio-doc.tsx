import React, { Component, FC, useEffect } from "react";
import Prism from 'prismjs';
import './index.css';
export default class AIODoc {
    Code:(code:string, language?:'js' | 'css', style?:any)=>React.ReactNode;
    Ul:(list:[string,string][])=>React.ReactNode;
    H:(text:string,num:number)=>React.ReactNode;
    Line:(text?:string)=>React.ReactNode;
    Mark:(text:string,color?:number)=>React.ReactNode;
    constructor(){
        this.Code = (code, language, style)=>{
            return <PrismCode code={code} language={language} style={style} />
        }
        this.Ul = (list) => {
            return (
                <ul className='aio-doc-list'>
                    {
                        list.map(([desc,title]) => {
                            return (
                                <li>
                                    {!!title && this.Mark(title)} {desc}
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }
        this.Mark = (text,color = 0)=>{
            return <mark className={`aio-doc-mark aio-doc-mark${color}`}>{text}</mark>
        }
        this.H = (text,num = 3) => {
            const Element = `h${num}` as keyof JSX.IntrinsicElements; 
            return <Element className='aio-doc-titr'>{text}</Element>
        }
        this.Line = (text)=>{
            return (
                <div className='aio-doc-splitter'>
                    {!!text && <div className='aio-doc-splitter-text'>{text}</div>}
                </div>
            )
        }
    }
}
const PrismCode:FC<{code:string, language?:'js' | 'css', style?:any}> = ({code,language = 'javascript',style = {}}) => {
    useEffect(()=>{
        Prism.highlightAll();
    },[])
    return (
        <div className="aio-doc-code" style={style}>
            <pre style={{ height: '100%', overflow: 'auto' }}>
                <code className={`language-${language}`}>{code}</code>
            </pre>
        </div>
    );
}
