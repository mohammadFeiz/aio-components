import React,{Component} from "react";
import Prism from 'prismjs';
import './index.css';
export default function Code(code,language = 'javascript'){
    return <PrismCode code={code} language={language}/>
}
class PrismCode extends Component{
    componentDidMount(){
      Prism.highlightAll();
    }
    render(){
      let { code, language } = this.props;
      return (
        <div className="Code" style={{overflowY:'auto',width:'100%'}}>
          <pre>
            <code className={`language-${language}`}>{code}</code>
          </pre>
        </div>
      );  
    }
  }
  