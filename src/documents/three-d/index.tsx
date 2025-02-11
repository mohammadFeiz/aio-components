import { FC, useState } from "react";
import DOC from "../../resuse-components/Doc/index";
import './three-d-1.css';
import './theme.css';
import { AITabs, JoyStick, useForm } from "../../npm/aio-input";
import { Code } from "../../npm/aio-components";
const ThreeD: FC<{ goToHome: () => void, name: string }> = ({ name, goToHome }) => {
    return (
        <DOC
            name={name} goToHome={goToHome}
            items={[
                { text: 'sample 1', value: 's1', render: () => <S1 /> },
                { text: 'sample 2', value: 's2', render: () => <S2 /> },
            ]}
        />
    )
}
export default ThreeD
type I_s1 = {
    containerBg: string, width: number, height: number, borderRadius: number,
    shadowPos: [number, number], darkContrast: number, lightContrast: number, darkShadow: number, lightShadow: number, shadowInset: boolean,
    center?: { width: number, height: number, borderRadius: number, shadowInset: boolean, },
}
const S1: FC = () => {
    const [defaultCenter] = useState<I_s1["center"]>({ width: 120, height: 120, borderRadius: 120, shadowInset: false })
    const [tab, setTab] = useState<'main' | 'center' | 'css'>('main')
    const form = useForm<I_s1>({
        initData: {
            containerBg: '#f1f1f1', width: 200, height: 200, borderRadius: 120, shadowPos: [10, 10],
            darkShadow: 10, lightShadow: 15, darkContrast: 0.1, lightContrast: 1, shadowInset: true
        },
        getLayout: (context) => {
            const { getData } = context
            const { changeData } = context
            const data = getData();
            return {
                className: 'brd-c-14- br-12- of-hidden- p-12-',
                v: [
                    {
                        html: (
                            <AITabs
                                className='bg-d-5-' options={['main', 'center', 'css']} value={tab}
                                option={{
                                    text: 'option',
                                    value: 'option',
                                    onClick: (option) => setTab(option), className: () => 'fs-16- bold-'
                                }}
                            />
                        )
                    },
                    { 
                        className: 'p-h-12- p-b-12-', 
                        v: [
                            {
                                show: tab === 'main',
                                h: [
                                    {
                                        v: [
                                            { input: { required: false, field: 'width', label: 'width', type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
                                            { input: { required: false, field: 'darkContrast', label: 'dark contrast', type: 'slider', start: 0, end: 1, step: 0.01, size: 24 } }
                                        ]
                                    },
                                    {
                                        v: [
                                            { input: { required: false, field: 'height', label: 'height', type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
                                            { input: { required: false, field: 'lightContrast', label: 'light contrast', type: 'slider', start: 0, end: 1, step: 0.01, size: 24 } }
                                        ]
                                    },
                                    {
                                        v: [
                                            { input: { required: false, field: 'borderRadius', label: 'round', type: 'slider', start: 0, end: 120, step: 1, size: 24 } },
                                            {
                                                h: [
                                                    { input: { required: false, field: 'containerBg', label: 'background', type: 'color' } },
                                                    { input: { required: false, field: 'shadowInset', label: 'inset', type: 'checkbox' } }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        html: (
                                            <JoyStick
                                                x={data.shadowPos[0]} y={data.shadowPos[1]}
                                                size={72} scale={1}
                                                onChange={(p) => changeData({ ...getData(), shadowPos: [p.x, p.y] })}
                                            />
                                        ),
                                        size: 84
                                    }
                                ]
                            }, 
                            {
                                show: tab === 'center',
                                h: [
                                    {
                                        style: { width: 160 },
                                        h: [
                                            {
                                                input: {
                                                    required: false, type: 'checkbox', value: !!data.center, field: 'none', label: 'center',
                                                    onChange: (v: any) => changeData({ ...getData(), center: v ? defaultCenter : undefined }),
                                                }
                                            },
                                            { input: { required: false, field: 'center.shadowInset', label: 'inset', type: 'checkbox' } }
                                        ]
                                    },
                                    {
                                        show: !!data.center, flex: 1,
                                        h: [
                                            { input: { required: false, field: 'center.width', label: 'width', type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
                                            { input: { required: false, field: 'center.height', label: 'height', type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
                                            { input: { required: false, field: 'center.borderRadius', label: 'round', type: 'slider', start: 0, end: 120, step: 1, size: 24 } }
                                        ]
                                    }
                                ]
                            }, 
                            { show: tab === 'css', html: Code(generateStyle(getData)) }, 
                            {
                                show: tab !== 'css', key: tab,
                                html: (
                                    <div className='three-d-1-container' style={getContainerStyle(getData)}>
                                        <div className="three-d-1" style={getOutStyle(getData)}>
                                            {
                                                !!data.center &&
                                                <div className="three-d-1-center" style={getOutStyle(getData, true)}></div>
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        ] 
                    }
                ]
            }
        }
    })

    function getContainerStyle(getData: () => I_s1): any {
        const { containerBg } = getData();
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: containerBg,
            height: 500,
            width: '100%'
        }
    }
    function getOutStyle(getData: () => I_s1, isCenter?: boolean): any {
        const data = getData()
        const obj: I_s1 = isCenter ? data.center as I_s1 : data
        const { lightShadow: ls, darkShadow: ds } = data;
        const { lightContrast: lc, darkContrast: dc } = data;
        const {shadowInset: si} = obj;
        const sp = data.shadowPos;
        const res = {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: obj.height,
            width: obj.width,
            borderRadius: obj.borderRadius,
            boxShadow: `${si ? 'inset ' : ''}${-sp[0]}px ${-sp[1]}px ${ls}px rgba(255, 255, 255, ${lc}),${si ? 'inset ' : ''}${sp[0]}px ${sp[1]}px ${ds}px rgba(0, 0, 0, ${dc})`
        }
        return res
    }
    return (
        <div className="msf">
            {form.renderLayout}
        </div>
    )
}

function generateStyle(getData: () => I_s1) {
    const { lightShadow: ls, darkShadow: ds, shadowPos: sp, darkContrast: dc, lightContrast: lc, containerBg: cb, width, height, shadowInset: si } = getData();
    return (
        `
.three-d-1-container {
display: flex;
align-items: center;
justify-content: center;
background-color: ${cb};
height:500px;
width:100%;
}
.three-d-1 {
position: relative;
display: flex;
align-items: center;
justify-content: center;
height: ${height}px;
width: ${width}px;
border-radius: 50%;
box-shadow: ${si ? 'inset ' : ''}${-sp[0]}px ${-sp[1]}px ${ls}px rgba(255, 255, 255, ${lc}),
${si ? 'inset ' : ''}${sp[0]}px ${sp[1]}px ${ds}px rgba(0, 0, 0, ${dc});
}
${generateCenterStyle(getData)}
        `
    )
}
function generateCenterStyle(getData: () => I_s1) {
    const data = getData()
    if (!data.center) { return '' }
    const { lightShadow: ls, darkShadow: ds, shadowPos: sp, darkContrast: dc, lightContrast: lc, center } = data;
    const { shadowInset: si, width, height, borderRadius } = center || {};
    return (
        `
.three-d-1:before {
content:'',
position: absolute;
height: ${height}px;
width: ${width}px;
border-radius: ${borderRadius};
box-shadow: ${si ? 'inset ' : ''}${-sp[0]}px ${-sp[1]}px ${ls}px rgba(255, 255, 255, ${lc}),
${si ? 'inset ' : ''}${sp[0]}px ${sp[1]}px ${ds}px rgba(0, 0, 0, ${dc});
}
        `
    )
}



const S2:FC = ()=>{
    return (
        <div className="example spanel-container gap-12- flex-col-">
            <div className="spanel-double">
                my text
            </div>
            <div className="spanel-double1">
                <div className="z-10-">my text</div>
            </div>
            <div className="spanel-out">
                my text
            </div>
            <div className="spanel-in">
                my text
            </div>
        </div>
    )
}