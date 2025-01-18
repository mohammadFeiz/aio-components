import { FC, useState } from "react";
import DOC from "../../resuse-components/doc";
import './three-d-1.css';
import { JoyStick, useForm } from "../../npm/aio-input";
import { Code } from "../../npm/aio-components";
const ThreeD: FC<{ goToHome: () => void, name: string }> = ({ name, goToHome }) => {
    return (
        <DOC
            name={name} goToHome={goToHome}
            nav={{
                items: () => [
                    { text: 'sample 1', id: 's1', render: () => <S1 /> },

                ]
            }}
        />
    )
}
export default ThreeD
type I_s1 = {
    containerBg: string,width: number,height: number,borderRadius: number,
    shadowPos: [number, number],darkContrast: number,lightContrast: number,darkShadow: number,lightShadow: number,shadowInset: boolean,
    center?: {width: number,height: number,borderRadius: number,shadowInset: boolean,},
}
const S1: FC = () => {
    const [defaultCenter] = useState<I_s1["center"]>({width: 120, height: 120, borderRadius: 120,shadowInset: false})
    const [tab, setTab] = useState<'main' | 'center' | 'css'>('main')
    const form = useForm<I_s1>({
        initData: {
            containerBg: '#f1f1f1', width: 200, height: 200, borderRadius: 120, shadowPos: [10, 10],
            darkShadow: 10, lightShadow: 15, darkContrast: 0.1, lightContrast: 1, shadowInset: true
        },
        customTypes: {
            'joystick': (value: [number, number], onChange: (v: [number, number]) => void, customProps: { scale: number, size: number }) => {
                return <JoyStick x={value[0]} y={value[1]} size={customProps.size} scale={customProps.scale} onChange={(p) => onChange([p.x, p.y])} />
            }
        },
        inputs: {
            'tabs': {
                input: {
                    type: 'tabs',className:'bg-d-5-',options: ['main', 'center', 'css'],
                    option: { text: 'option', value: 'option', onClick: ({ option }) => setTab(option), className: () => 'fs-16- bold-' },
                },
                value: (data) => tab,
                onChange: (v) => form.change([{ field: 'center', value: v ? defaultCenter : undefined }])
            },
            'width': { field: 'width', label: 'width', input: { type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
            'height': { field: 'height', label: 'height', input: { type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
            'borderRadius': { field: 'borderRadius', label: 'round', input: { type: 'slider', start: 0, end: 120, step: 1, size: 24 } },
            'shadowPos': { field: 'shadowPos', input: 'joystick', customProps: { size: 72, scale: 1 } },
            'darkContrast': { field: 'darkContrast', label: 'dark contrast', input: { type: 'slider', start: 0, end: 1, step: 0.01, size: 24 } },
            'lightContrast': { field: 'lightContrast', label: 'light contrast', input: { type: 'slider', start: 0, end: 1, step: 0.01, size: 24 } },
            'containerBg': { field: 'containerBg', label: 'background', input: { type: 'color' } },
            'shadowInset': { field: 'shadowInset', label: 'inset', input: { type: 'checkbox' } },
            'activeCenter': {
                label: 'center', input: { type: 'checkbox' },
                value: (data) => !!data.center,
                onChange: (v) => form.change([{ field: 'center', value: v ? defaultCenter : undefined }]),
            },
            'center.width': { field: 'center.width', label: 'width', input: { type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
            'center.height': { field: 'center.height', label: 'height', input: { type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
            'center.borderRadius': { field: 'center.borderRadius', label: 'round', input: { type: 'slider', start: 0, end: 120, step: 1, size: 24 } },
            'center.shadowInset': { field: 'center.shadowInset', label: 'inset', input: { type: 'checkbox' } },
        },


    })
    const generateStyle = () => {
        const { lightShadow: ls, darkShadow: ds, shadowPos: sp, darkContrast: dc, lightContrast: lc, containerBg: cb, width, height, shadowInset: si, center } = form.data;
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
${generateCenterStyle()}
            `
        )
    }
    const generateCenterStyle = () => {
        if (!form.data.center) { return '' }
        const { lightShadow: ls, darkShadow: ds, shadowPos: sp, darkContrast: dc, lightContrast: lc, center } = form.data;
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
    const getContainerStyle = (): any => {
        const { data } = form
        const { containerBg } = data;
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: containerBg,
            height: 500,
            width: '100%'
        }
    }
    const getOutStyle = (data: I_s1, isCenter?: boolean): any => {
        const obj: I_s1 = isCenter ? data.center as I_s1 : data
        const { lightShadow: ls, darkShadow: ds, shadowInset: si } = obj;
        const { lightContrast: lc, darkContrast: dc } = data;
        const sp = data.shadowPos;
        return {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: obj.height,
            width: obj.width,
            borderRadius: obj.borderRadius,
            boxShadow: `${si ? 'inset ' : ''}${-sp[0]}px ${-sp[1]}px ${ls}px rgba(255, 255, 255, ${lc}),
            ${si ? 'inset ' : ''}${sp[0]}px ${sp[1]}px ${ds}px rgba(0, 0, 0, ${dc})`
        }
    }
    const mainConfig = ()=>{
        return {
            show: tab === 'main',
            h: [
                { v: [{ input: 'width' }, { input: 'darkContrast' }] },
                { v: [{ input: 'height' }, { input: 'lightContrast' }] },
                { v: [{ input: 'borderRadius' }, { h: [{ input: 'containerBg' }, { input: 'shadowInset' }] }] },
                { input: 'shadowPos', size: 84 }
            ]
        }
    }
    const centerConfig = ()=>{
        return {
            show: tab === 'center',
            h: [
                { style: { width: 160 }, h: [{ input: 'activeCenter' }, { input: 'center.shadowInset' }] },
                { show: !!form.data.center, h: [{ input: 'center.width' }, { input: 'center.height' }, { input: 'center.borderRadius' }] }
            ]
        }
    }
    const cssConfig = ()=>({show: tab === 'css',html: Code(generateStyle())})
    const previewConfig = ()=>{
        return {
            show: tab !== 'css',
            html: (
                <div className='three-d-1-container' style={getContainerStyle()}>
                    <div className="three-d-1" style={getOutStyle(form.data)}>
                        {
                            !!form.data.center &&
                            <div className="three-d-1-center" style={getOutStyle(form.data, true)}></div>
                        }
                    </div>
                </div>
            )
        }
    }
    return (
        <div className="msf">
            <form className="p-12-">
                {
                    form.renderInputs({
                        node: {
                            className: 'brd-c-14- br-12- of-hidden-',
                            v: [
                                { input: 'tabs' },
                                {className: 'p-h-12- p-b-12-',v: [mainConfig(),centerConfig(),cssConfig(),previewConfig()]}
                            ]
                        }
                    })
                }
            </form>
        </div>
    )
}

