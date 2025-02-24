import DOC from '../../resuse-components/Doc/index.tsx';
import './index.css';
import CacheExpiredIn from './cache-expiredin.tsx';
import EditCache from './edit-cache.tsx';
import HandleErrorMessage from './handleErrorMessage.tsx';
import OnSuccess from './onSuccess.tsx';
import ShowSuccessMessage from './show-success-message.tsx';
import PreventErrorMessage from './prevent-error-message.tsx';
import SendErrorMessageToComponent from './SendErrorMessageToComponent.tsx';
import Retries from './retries.tsx';
export default function DOC_AIOApis(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            items={[
                { text: 'handleErrorMessage', value: 'ham', render: () => <HandleErrorMessage/> },
                { text: 'onSuccess', value: 'onSuccess', render: () => <OnSuccess/> },
                { text: 'show success message', value: 'ssm', render: () => <ShowSuccessMessage/> },
                { text: 'prevent error message', value: 'pem', render: () => <PreventErrorMessage/> },
                { text: 'send error message to component', value: 'semtc', render: () => <SendErrorMessageToComponent/> },
                { text: 'cache expiredIn', value: 'e2', render: () => <CacheExpiredIn /> },
                { text: 'edit cache', value: 'e4', render: () => <EditCache /> },
                { text: 'retries', value: 'retries', render: () => <Retries /> },
            ]}
        />
    )
}
