import { createRef, FC, useEffect, useState } from "react";
import DOC from "../../resuse-components/doc";
import './three-d-1.css';
import { useForm } from "../../npm/aio-input";
import Swip, { I_Swip_mousePosition } from "../../npm/aio-swip";
import { I_Swip_parameter } from "../../npm/aio-swip";
import Geo from "../../npm/aio-geo";
import { I_line, I_point } from "../../npm/aio-utils";
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
            'width': { label: 'width', input: { type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
            'height': { label: 'height', input: { type: 'slider', start: 6, end: 480, step: 6, size: 24 } },
            'borderRadius': { label: 'round', input: { type: 'slider', start: 0, end: 120, step: 1, size: 24 } },
            'darkShadow.contrast': { label: 'dark contrast', input: { type: 'slider', start: 0, end: 1, step: 0.01, size: 24 } },
            'lightShadow.contrast': { label: 'light contrast', input: { type: 'slider', start: 0, end: 1, step: 0.01, size: 24 } },
            'containerBg': { label: 'background', input: { type: 'color' } },
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
    const change = (p:I_dir_data)=>form.change([{field:'darkShadow.left',value:p.x},{field:'darkShadow.top',value:p.y}])
    const {data} = form;
    return (
        <div className="msf">
            {
                form.renderInputs({
                    names: [
                        [
                            ['width', 'borderRadius', 'darkShadow.contrast'],
                            ['height', 'containerBg', 'lightShadow.contrast'],
                            () => <DirWrapper x={data.darkShadow.left} y={data.darkShadow.top} width={200} height={200} onChange={(p)=>change(p)}/>
                        ]
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

type I_dir_data = {
    length: number,
    angle: number,
    x: number,
    y: number
}
const DirWrapper: FC<{ x?: number, y?: number, angle?: number, length?: number, width: number, height: number,onChange:(v:I_dir_data)=>void }> = (props) => {
    const [geo] = useState<Geo>(new Geo())
    const [data, setData] = useState<{ x: number, y: number }>()
    function getLeftAndTopByAngleAndLength(angle: number, length: number): { left: number, top: number } {
        const center: I_point = [props.width / 2, props.height / 2]
        const line: I_line = geo.getLineBySLA(center, length, angle);
        const [left, top] = line[1]
        return { left, top }
    }
    // function getAngleAndLengthByLeftAndTop(left: number, top: number): { angle: number, length: number } {
    //     const center: I_point = [props.width / 2, props.height / 2]
    //     const line: I_line = [center, [left, top]]
    //     const angle = geo.getAngle(line);
    //     const length = geo.getLength(line)
    //     return { angle, length }
    // }
    useEffect(() => {
        const {x,y,angle,length} = props;
        if (x !== undefined && y !== undefined) {setData({ x, y })}
        if (angle !== undefined && length !== undefined) {
            const { left, top } = getLeftAndTopByAngleAndLength(angle, length);
            setData({ x:left, y:top })
        }
    }, [])
    if (!data) { return null }
    return <Dir x={data.x} y={data.y} width={props.width} height={props.height} onChange={props.onChange}/>
}
const Dir: FC<{ x: number, y: number, width: number, height: number,onChange:(v:I_dir_data)=>void }> = (props) => {
    const dom = createRef()
    const [swip] = useState<Swip>(
        new Swip({
            dom: () => dom,
            move
        })
    )
    function move(p: I_Swip_parameter) {
        const { x, y, centerAngle, centerDistance }: I_Swip_mousePosition = p.mousePosition;
        props.onChange({ x, y, length: centerDistance, angle: centerAngle })
    }
    const style2: any = { width: 0, height: 0, position: 'absolute', left: props.x, top: props.y, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    return (
        <div style={{ width: props.width, height: props.height, border: '1px solid #ddd', position: 'relative' }} ref={dom as any}>
            <div style={style2}>
                <div style={{ width: 24, height: 24, borderRadius: '100%', background: '#0069ff', position: 'absolute' }}></div>
            </div>
        </div>
    )
}