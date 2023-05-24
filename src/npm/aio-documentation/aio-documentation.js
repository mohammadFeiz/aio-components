import React,{Component} from "react";
import Prism from 'prismjs';
import './aio-documentation.css';
export default function AIODoc(){
    let $$ = {
        Code(code,language){
            return <PrismCode code={code} language={language}/>
        },
        DescList(list){
            return <DescList list={list}/>
        },
        Titr(text){
            return <div className='titr'>{text}</div>
        },
        Desc(text){
            return <p className='aio-doc-description'>{text}</p>
        }
    }
    return {
        Code:$$.Code.bind($$),
        DescList:$$.DescList.bind($$),
        Titr:$$.Titr.bind($$),
        Desc:$$.Desc.bind($$)
    }
}
class PrismCode extends Component{
    componentDidMount(){
      Prism.highlightAll();
    }
    render(){
      let { code, language = 'javascript' } = this.props;
      return (
        <div className="Code" style={{overflowY:'auto',width:'100%',height:'100%'}}>
          <pre>
            <code className={`language-${language}`}>{code}</code>
          </pre>
        </div>
      );  
    }
  }
  class DescList extends Component{
    render(){
        let {list} = this.props;
        return (
            <ul className='desc-list'>
                {
                    list.map(([title,desc])=>{
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
  }