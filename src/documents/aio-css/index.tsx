import { FC, useEffect, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import Code from '../../code/index.js';
import { CssGenerator } from './../../npm/aio-css/generator.tsx';
import { Copy } from '../../npm/aio-utils/index.tsx';
import AIOPopup from '../../npm/aio-popup/index.tsx';
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
    const [css, setCss] = useState<string>('')
    const [popup] = useState<AIOPopup>(new AIOPopup())
    const copyStyle:any = { position: 'absolute', top: 22, right: 25, border: 'none', background: '#0069ff', color: '#fff', borderRadius: 4 }
    useEffect(() => {
        setCss(CssGenerator())
    }, [])
    function copy(css: string) {
        Copy(css);
        popup.addSnackebar({
            text: 'css code is copied to clipboard',
            type: 'success',
            verticalAlign:"start",
            horizontalAlign:'end'
        })
    }
    return (
        <div className="example">
            {Code(css)}
            <button style={copyStyle} onClick={() => copy(css)}>Copy</button>
            {popup.render()}
        </div>
    )
}
