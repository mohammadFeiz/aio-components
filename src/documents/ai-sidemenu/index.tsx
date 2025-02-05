import { FC, useState } from "react";
import DOC from "../../resuse-components/doc";
import { SideMenu } from "../../npm/aio-components";
import Icon from "@mdi/react";
import { mdiFile } from "@mdi/js";
import './index.css';
const DOC_Sidemenu: FC = (props: any) => {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => {
                    return [
                        { text: 'Basic', id: 'basic', render: () => <Basic /> },
                        { text: 'example1', id: 'e1', render: () => <Example1 /> }
                    ]
                }
            }}
        />
    )
}
export default DOC_Sidemenu
const Basic: FC = () => {
    const [value,setValue] = useState<string>('item1')
    return (
        <div className="example">
            <SideMenu
                value={value}
                header={(
                    <div className='flex-row- align-vh-'>My Application</div>
                )}
                items={[
                    { text: 'item0', value: 'item0', icon: <Icon path={mdiFile} size={0.8} /> },
                    {
                        text: 'item1', value: 'item1', icon: <Icon path={mdiFile} size={0.8} />,
                        after: <div style={{ background: 'red', color: '#fff' }} className='p-h-6- br-6-'>New</div>
                    },
                    {
                        text: 'item2', value: 'item2', icon: <Icon path={mdiFile} size={0.8} />,
                        items: [
                            { text: 'item2-0', value: 'item2-0' },
                            { text: 'item2-1', value: 'item2-1' },
                            { text: 'item2-2', value: 'item2-2' },


                        ]
                    },
                    { text: 'item3', value: 'item3', icon: <Icon path={mdiFile} size={0.8} /> },

                ]}
                onChange={(v) => setValue(v.value)}
            />
        </div>
    )
}
const Example1: FC = () => {
    const [value,setValue] = useState<string>('item1')
    return (
        <div className="example">
            <SideMenu
                value={value}
                className="sidemenu-1"
                header={(
                    <div className='flex-row- align-vh-'>My Application</div>
                )}
                items={[
                    { text: 'item0', value: 'item0', icon: <Icon path={mdiFile} size={0.8} /> },
                    {
                        text: 'item1', value: 'item1', icon: <Icon path={mdiFile} size={0.8} />,
                        after: <div style={{ background: 'red', color: '#fff' }} className='p-h-6- br-6-'>New</div>
                    },
                    {
                        text: 'item2', value: 'item2', icon: <Icon path={mdiFile} size={0.8} />,
                        items: [
                            { text: 'item2-0', value: 'item2-0' },
                            { text: 'item2-1', value: 'item2-1' },
                            { text: 'item2-3', value: 'item2-2' },


                        ]
                    },
                    { text: 'item3', value: 'item3', icon: <Icon path={mdiFile} size={0.8} /> },

                ]}
                onChange={(v) => setValue(v.value)}
            />
        </div>
    )
}