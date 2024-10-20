import { FC, useEffect, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import Code from '../../code/index.js';
import {CssGenerator} from './../../npm/aio-css/generator.tsx';
export default function DOC_Validation(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'try it', id: 'try it', render: () => <Generator /> }
                ]
            }}
        />
    )
}

const Generator: FC = () => {
    const [css,setCss] = useState<string>('')
    useEffect(()=>{
        setCss(CssGenerator())
    },[])
    return (
        <div className="example">
            {Code(css)}
        </div>
    )
}
