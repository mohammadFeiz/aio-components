import { FC, useEffect } from "react";
import Prism from 'prismjs';
import './index.css';
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
export default function Code(code:string, language?:'js' | 'css', style?:any){
    return <PrismCode code={code} language={language} style={style} />
}