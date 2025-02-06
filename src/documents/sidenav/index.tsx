import { FC, useState } from "react";
import DOC from "../../resuse-components/Doc/index";
import { Code, Sidenav } from "../../npm/aio-components";
import Icon from "@mdi/react";
import { mdiFile } from "@mdi/js";
import './index.css';
const DOC_Sidenav: FC = (props: any) => {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            items={[
                { text: 'Basic', value: 'basic', render: () => <Basic /> },
                { text: 'example1', value: 'e1', render: () => <Example1 /> }
            ]}
        />
    )
}
export default DOC_Sidenav
const Basic: FC = () => {
    const [value, setValue] = useState<string>('item1')
    return (
        <div className="example">
            <Sidenav
                value={value}
                header={(
                    <div className='flex-row- align-vh- h-60-'>My Application</div>
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
            {
                Code(
                    `
<Sidenav
    value={value}
    header={(
        <div className='flex-row- align-vh- h-60-'>My Application</div>
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
                    `
                )
            }
        </div>
    )
}
const Example1: FC = () => {
    const [value, setValue] = useState<string>('item1')
    return (
        <div className="example">
            <Sidenav
                value={value}
                className="sidenav-1"
                header={(
                    <div className='flex-row- align-vh- h-60-'>My Application</div>
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
            
                {
                    Code(
                        `
<Sidenav
    value={value}
    className="sidenav-1"
    header={(
        <div className='flex-row- align-vh- h-60-'>My Application</div>
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
                    `
                    )
                }
                <h3>CSS</h3>
                {
                    Code(
                        `
.sidenav-1{
    background-image: url(./../../../public//dist/bg.jpg);
    background-size: 360px 480px;
    position: relative;
}
.sidenav-1:after{
    background:linear-gradient(0deg, #123f6e, #2b548352);
    backdrop-filter: blur(2px);
}
.sidenav-1 .ai-sidenav-header{
    border-bottom:1px solid #2f3b53;
}
.sidenav-1 .aio-input-tree-body .aio-input-tree-body{
    background:rgba(0,0,0,0.3);
    backdrop-filter: blur(3px);
    padding:12px 0;
}
.sidenav-1 .ai-sidenav-item.active{
    background:#3c8fff96;
}
.sidenav-1 .ai-sidenav-sub-item.active{
    background:#3c8fff96;
}



                    `
                    )
                }
          
        </div>
    )
}