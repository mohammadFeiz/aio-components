import DOC from '../../resuse-components/doc.tsx';
import './index.css';
import Example1 from './example1.tsx';
import Example2 from './example2.tsx';
export default function DOC_AIOApis(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'Example1', id: 'e1', render: () => <Example1 /> },
                    { text: 'Example2', id: 'e2', render: () => <Example2 /> },
                    

                ]
            }}
        />
    )
}

