import { FC, useEffect, useState } from 'react';
import DOC from '../../resuse-components/Doc/index';
import {Code} from './../../npm/aio-components';
import { CssGenerator } from './../../npm/aio-css/generator.tsx';
import { Copy } from '../../npm/aio-utils/index.tsx';
import usePopup from '../../npm/aio-popup/index.tsx';
export default function DOC_Validation(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            items={[
                { text: 'try it', value: 'try it', render: () => <Generator /> }
            ]}
        />
    )
}

const Generator: FC = () => {
    const [css, setCss] = useState<string>('')
    const popup = usePopup()
    const copyStyle:any = { position: 'absolute', top: 22, right: 25, border: 'none', background: '#0069ff', color: '#fff', borderRadius: 4 }
    useEffect(() => {
        setCss(CssGenerator())
    }, [])
    function copy(css: string) {
        Copy(css);
        popup.addSnackebar({
            text: 'css code is copied to clipboard',
            type: 'success',
            align:['left','bottom'] 
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
