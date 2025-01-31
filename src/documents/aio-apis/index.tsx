import DOC from '../../resuse-components/doc.tsx';
import './index.css';
import Example1 from './example1.tsx';
import CacheExpiredIn from './cache-expiredin.tsx';
import CacheInterval from './cache-interval.tsx';
import EditCache from './edit-cache.tsx';
export default function DOC_AIOApis(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'Example1', id: 'e1', render: () => <Example1 /> },
                    { text: 'cache expiredIn', id: 'e2', render: () => <CacheExpiredIn /> },
                    { text: 'cache interval', id: 'e3', render: () => <CacheInterval /> },
                    { text: 'edit cache', id: 'e4', render: () => <EditCache /> },
                    
                ]
            }}
        />
    )
}

