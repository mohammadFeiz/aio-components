import React, { Component, FC, useEffect } from "react";
import Prism from 'prismjs';
import './index.css';
export default class AIODoc {
    Code:(code:string, language?:'js' | 'css', style?:any)=>React.ReactNode;
    Ul:(list:[string,string][])=>React.ReactNode;
    H:(text:string)=>React.ReactNode;
    constructor(){
        this.Code = (code, language, style)=>{
            return <PrismCode code={code} language={language} style={style} />
        }
        this.Ul = (list) => {
            return (
                <ul className='aio-doc-list'>
                    {
                        list.map(([title, desc]) => {
                            return (
                                <li>
                                    <mark>{title}</mark> {desc}
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }
        this.H = (text,num = 3) => {
            const Element = `h${num}` as keyof JSX.IntrinsicElements; 
            return <Element className='aio-doc-titr'>{text}</Element>
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
