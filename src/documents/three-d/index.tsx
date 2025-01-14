import { FC, useState } from "react";
import DOC from "../../resuse-components/doc";
import './three-d-1.css';
import { useForm } from "../../npm/aio-input";
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
type I_shadow = {
    left: number,
    top: number,
    contrast: number,
    value: number
}
type I_s1 = {
    containerBg: string,
    width: number,
    height: number,
    borderRadius: number,
    darkShadow: I_shadow,
    lightShadow: I_shadow
}
const S1: FC = () => {
    const form = useForm<I_s1>({
        initData: {
            containerBg: '#f1f1f1',
            width: 200,
            height: 200,
            borderRadius: 120,
            darkShadow: {
                left: 10,
                top: 10,
                contrast: 0.1,
                value: 10
            },
            lightShadow: {
                left: -10,
                top: -10,
                contrast: 1,
                value: 15
            }
        },
        inputs: {
            'width': { field: 'width', label: 'width', input: { type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
            'height': { field: 'height', label: 'height', input: { type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
            'borderRadius': { field: 'borderRadius', label: 'round', input: { type: 'slider', start: 0, end: 120, step: 1, size: 24 } },
            'darkShadow.contrast': { field: 'darkShadow.contrast', label: 'dark contrast', input: { type: 'slider', start: 0, end: 1, step: 0.01, size: 24 } },
            'lightShadow.contrast': { field: 'lightShadow.contrast', label: 'light contrast', input: { type: 'slider', start: 0, end: 1, step: 0.01, size: 24 } },
            'containerBg': { field: 'containerBg', label: 'background', input: { type: 'color' } },
        },

    })
    const generateStyle = () => {
        const { data } = form
        const { lightShadow: ls, darkShadow: ds } = data;
        return (
            `
.three-d-1-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${data.containerBg};
    height:500px;
    width:100%;
}
.three-d-1 {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${data.height}px;
    width: ${data.width}px;
    border-radius: 50%;
    box-shadow: inset ${ls.left}px ${ls.top}px ${ls.value}px rgba(255, 255, 255, ${ls.contrast}),
        inset ${ds.left}px ${ds.top}px ${ds.value}px rgba(0, 0, 0, ${ds.contrast});
}
            `
        )
    }
    const getContainerStyle = ():any => {
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
    const getOutStyle = (): any => {
        const { data } = form
        const { lightShadow: ls, darkShadow: ds } = data;
        return {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: data.height,
            width: data.width,
            borderRadius: data.borderRadius,
            boxShadow: `inset ${ls.left}px ${ls.top}px ${ls.value}px rgba(255, 255, 255, ${ls.contrast}),
                inset ${ds.left}px ${ds.top}px ${ds.value}px rgba(0, 0, 0, ${ds.contrast})`
        }
    }
    return (
        <div className="msf">
            {
                form.renderInputs({
                    names: [
                        ['width', 'height'],
                        ['borderRadius','containerBg'],
                        ['darkShadow.contrast','lightShadow.contrast']
                    ]
                })
            }
            <div className='three-d-1-container' style={getContainerStyle()}>
                <div className="three-d-1" style={getOutStyle()}>
                    <span></span>
                </div>
            </div>
        </div>
    )
}