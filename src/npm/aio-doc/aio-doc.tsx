import React, { Component, FC, useEffect } from "react";
import Prism from 'prismjs';
import './index.css';
import AIOInput from "../aio-input";
type I_li = {html:React.ReactNode,childs?:I_li[]}
type rn = React.ReactNode
type I_tag = 'b'|'strong'|'i'|'em'|'mark'|'small'|'del'|'ins'|'sub'|'sup'|'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p'
export default class AIODoc {
    Code:(code:string, language?:'js' | 'css', style?:any)=>rn;
    Ul:(list:I_li[])=>rn;
    Line:(text:rn,style?:string,color?:string)=>rn;
    Table:(thead:string[],tbody:rn[][],attrs?:any)=>rn;
    Tag:(tag:I_tag,text:rn,attrs?:{[key:string]:any})=>rn;
    // Acardion:(title:string,html:rn)=>rn;
    List:(p:['Code'|'Ul'|'Table'|'Tag'|'Line',any?,any?,any?][])=>rn
    constructor(){
        this.Code = (code, language, style)=>{
            return <PrismCode code={code} language={language} style={style} />
        }
        this.Ul = (childs) => {
            return (
                <ul className='aio-doc-element aio-doc-ul'>
                    {
                        childs.map((o) => {
                            let {childs = []} = o;
                            let Childs:any[] = Array.isArray(childs)?childs:[childs]
                            return (<li>{o.html}{!!(childs as any[]).length && this.Ul(Childs)}</li>)
                        })
                    }
                </ul>
            )
        }
        this.List = (list)=>{
            return (
                <>
                    {list.map(([fn,p1,p2,p3])=>{
                        let P1,P2,P3;
                        try{P1 = JSON.parse(p1)}catch{P1 = p1}
                        try{P2 = JSON.parse(p2)}catch{P2 = p2}
                        try{P3 = JSON.parse(p3)}catch{P2 = p2}
                        return this[fn](P1,P2,P3)
                    })}
                </>
            )
        }
        this.Tag = (tag,html,attrs = {})=>{
            const Tag = tag
            return <Tag {...attrs}>{html}</Tag>
        }
        this.Line = (text = '',style = '1px solid',color = '#ddd')=>{
            return (
                <div className={`aio-doc-splitter`} style={{borderBottom:style,color}}>
                    {!!text && <div className='aio-doc-splitter-text'>{text}</div>}
                </div>
            )
        }
        this.Table = (thead,tbody,attrs)=>{
            return (
                <table border={1} {...attrs}>
                    <thead>{thead.map((th)=><th>{th}</th>)}</thead>
                    <tbody>{tbody.map((tr,i)=><tr key={i}>{tr.map((td,i)=><td key={i}>{td}</td>)}</tr>)}</tbody>
                </table>
            )
        }
        // this.Acardion = (title,html = <div></div>)=>{
        //     return (
        //         <AIOInput
        //             type='acardion'
        //             options={[{title}]}
        //             option={{
        //                 text:'option.title',
        //                 value:'option.title'
        //             }}
        //             body={()=>({html})}
        //         />
        //     )
        // }
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
