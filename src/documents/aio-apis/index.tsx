import DOC from '../../resuse-components/Doc/index.tsx';
import './index.css';
import Example1 from './example1.tsx';
import CacheExpiredIn from './cache-expiredin.tsx';
import CacheInterval from './cache-interval.tsx';
import EditCache from './edit-cache.tsx';
export default function DOC_AIOApis(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            items={[
                { text: 'Example1', value: 'e1', render: () => <Example1 /> },
                { text: 'cache expiredIn', value: 'e2', render: () => <CacheExpiredIn /> },
                { text: 'cache interval', value: 'e3', render: () => <CacheInterval /> },
                { text: 'edit cache', value: 'e4', render: () => <EditCache /> },    
            ]}
        />
    )
}

