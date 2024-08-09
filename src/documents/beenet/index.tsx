import { FC } from 'react';
import Beenet from './../../npm/beenet';
import Icon from '@mdi/react';
import { mdiAccessPointOff, mdiBabyBuggyOff, mdiDatabase, mdiRacingHelmet, mdiValveOpen } from '@mdi/js';
const BeenetDoc: FC<{goToHome:()=>void}> = ({goToHome}) => {
    return (
        <Beenet
            gap={1}
            rowCount={5}
            colCount={7}
            getHtml={(className,size) => {
                console.log(size)
                if (className === 'beenet-item-0-0') {
                    return <Icon path={mdiAccessPointOff} size={size/36} color="#fff" />;
                }
                if (className === 'beenet-item-0-1') {
                    return <Icon path={mdiValveOpen} size={size/36} color="#fff" />;
                }
                if (className === 'beenet-item-1-1') {
                    return <Icon path={mdiBabyBuggyOff} size={size/36} color="#fff" />;
                }
                if (className === 'beenet-item-1-0') {
                    return <Icon path={mdiDatabase} size={size/36} color="#fff" />;
                }
                if (className === 'beenet-item-1-2') {
                    return <Icon path={mdiRacingHelmet} size={size/36} color="#fff" />;
                }
                if (className === 'beenet-item-6-1') {
                    return (
                        <button className='brd-none w-72 h-48 fs-36 bg-none c-16' onClick={()=>goToHome()}>Exit</button>
                    )
                }
            }}
            onClick={(className) => {
                alert(className)
            }}
            className='my-beenet'
        />
    )
}
export default BeenetDoc