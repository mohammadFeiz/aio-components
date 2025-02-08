import { FC } from 'react';
import DOC from '../../resuse-components/Doc/index.tsx';
import { RichText } from '../../npm/aio-input/index.tsx';
export default function DOC_Validation(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            items={[
                { text: 'try it', value: 'try it', render: () => <Basic /> }
            ]}
        />
    )
}
const Basic:FC = ()=>{
    return (
        <RichText />
    )
}
