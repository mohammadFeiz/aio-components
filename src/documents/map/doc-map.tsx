import { FC, useEffect, useRef, useState } from 'react';
import Map from '../../npm/map/index.tsx';
import DOC from '../../resuse-components/doc.tsx';
import Code from '../../npm/code/index';
export default function DOC_Map(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'Basic', id: 'Basic', render: () => <Basic /> },
                    { text: 'onChange', id: 'onChange', render: () => <OnChange /> },
                    { text: 'onSubmit', id: 'onSubmit', render: () => <OnSubmit /> },
                    { text: 'change by parent', id: 'changebyparent', render: () => <ChangeByParent /> },
                    { text: 'dragging', id: 'dragging', render: () => <Dragging /> },
                    { text: 'marker', id: 'marker', render: () => <Marker /> },
                    { text: 'markers', id: 'markers', render: () => <Markers /> },
                    { text: 'onClick', id: 'onclick', render: () => <OnClick /> },
                    { text: 'shapes', id: 'shapes', render: () => <Shapes /> },
                    { text: 'layers', id: 'layers', render: () => <Layers /> },
                    { text: 'zoom.control', id: 'zoomControl', render: () => <ZoomControl /> },
                    { text: 'footer', id: 'footer', render: () => <Footer /> },
                ]
            }}
        />
    )
}

const Basic: FC = () => {
    return (
        <div className="example">
            <Map />
        </div>
    )
}
const ZoomControl: FC = () => {
    return (
        <div className="example">
            <Map zoom={{control:false}}/>
        </div>
    )
}
const OnChange: FC = () => {
    const [value, setValue] = useState<[number, number]>([35.699939, 51.338497])
    return (
        <div className="example">
            <Map value={value} onChange={(newValue: [number, number]) => setValue(newValue)} />
            <p>{`lat:${value[0]} - lng:${value[1]}`}</p>
            {
                Code(
                    `function Example(){
    const [value,setValue] = useState([35.699939, 51.338497])
    return (
        <Map value={value} onChange={(newValue)=>setValue(newValue)}/>
        <p>{${'`lat:${value[0]} - lng:${value[1]}`'}}</p>
    )
}`
                )
            }
        </div>
    )
}
const OnSubmit: FC = () => {
    const [value, setValue] = useState<[number, number]>([35.699939, 51.338497])
    return (
        <div className="example">
            <Map
                value={value}
                onSubmit={(newValue: [number, number]) => setValue(newValue)}
                submitText='Submit Location'
            />
            <p>{`lat:${value[0]} - lng:${value[1]}`}</p>
            {
                Code(
                    `function Example(){
    const [value,setValue] = useState([35.699939, 51.338497])
    return (
        <>
            <Map 
                value={value} 
                onSubmit={(newValue: [number, number]) => setValue(newValue)} 
                submitText='Submit Location'
            />
            <p>{${'`lat:${value[0]} - lng:${value[1]}`'}}</p>
        </>
    )
}`
                )
            }
        </div>
    )
}
const ChangeByParent: FC = () => {
    const [value, setValue] = useState<[number, number]>([35.699939, 51.338497])
    const valueRef = useRef(value);
    valueRef.current = value
    useEffect(() => {
        setInterval(() => {
            const value = valueRef.current
            const newValue: [number, number] = [value[0], value[1] + 0.0005]
            setValue([...newValue])
        }, 1000)
    }, [])
    return (
        <div className="example">
            <Map value={value} />
        </div>
    )
}
const Dragging: FC = () => {
    return (
        <div className="example">
            <Map dragging={false} />
            {
                Code(
                    `<Map dragging={false}/>`
                )
            }
        </div>
    )
}
const Marker: FC = () => {
    return (
        <div className="example">
            <Map marker={false} />
            {
                Code(
                    `<Map marker={false} />`
                )
            }
            <div className="h-60"></div>
            <Map
                marker={(
                    <div className='flex-col fd-column align-h w-24'>
                        <div className='w-10 h-10 br-100' style={{ background: '#4AA45D' }}></div>
                        <div className='w-2 h-16 bg-0'></div>
                    </div>
                )}
            />
            {
                Code(
                    `<Map
    marker={{
        active: true,
        html: (
            <div className='flex-col fd-column align-h w-24'>
                <div className='w-10 h-10 br-100' style={{ background: '#4AA45D' }}></div>
                <div className='w-2 h-16 bg-0'></div>
            </div>
        )
    }}
/>`
                )
            }
        </div>
    )
}
const Markers: FC = () => {
    return (
        <div className="example">
            <Map
                markers={[
                    {
                        pos: [35.699, 51.338],
                        html: (
                            <div className='flex-col fd-column align-h w-24'>
                                <div className='w-10 h-10 br-100' style={{ background: '#4AA45D' }}></div>
                                <div className='w-2 h-16 bg-0'></div>
                            </div>
                        )
                    },
                    {
                        pos: [35.700, 51.341]
                    },
                ]}
            />
            {
                Code(
                    `<Map
    markers={[
        {
            pos: [35.699, 51.338],
            html: (
                <div className='flex-col fd-column align-h w-24'>
                    <div className='w-10 h-10 br-100' style={{ background: '#4AA45D' }}></div>
                    <div className='w-2 h-16 bg-0'></div>
                </div>
            )
        },
        {
            pos: [35.712, 51.370]
        },
    ]}
/>`
                )
            }
        </div>
    )
}
const OnClick: FC = () => {
    return (
        <div className="example">
            <Map onClick={() => alert('map click')} />
        </div>
    )
}

const Shapes: FC = () => {
    return (
        <div className="example">
            <Map
                shapes={[
                    {
                        type: 'circle',
                        center: [35.699939, 51.338497],
                        radius: 600,
                        style:{
                            stroke:{
                                width:2,
                                color:'red',
                                dash:'4,8'
                            },
                            fill:{
                                color:'red',
                                opacity:0.2
                            }
                        }
                    }
                ]}
            />
            {
                Code(
                    `<Map 
    shapes={[
        {
            type:'circle',
            center:[35.699939, 51.338497],
            radius:600,
            style:{
                stroke:{
                    width:2,
                    color:'red',
                    dash:'4,8'
                },
                fill:{
                    color:'red',
                    opacity:0.2
                }
            }
        }
    ]}
/>`
                )
            }
            <Map
                shapes={[
                    {
                        type: 'rect',
                        points: [
                            [35.699939, 51.338497],
                            [35.692, 51.35],
                        ],
                        style: {
                            stroke: {
                                width: 2,
                                color: 'red',
                                dash: '4,8'
                            },
                            fill: {
                                color: 'red',
                                opacity: 0.2
                            }
                        }
                    }
                ]}
            />
            {
                Code(
                    `<Map 
    shapes={[
        {
            type:'rect',
            points:[
                [35.699939, 51.338497],
                [35.692, 51.35],
            ],
            style:{
                stroke:{
                    width:2,
                    color:'red',
                    dash:'4,8'
                },
                fill:{
                    color:'red',
                    opacity:0.2
                }
            }
        }
    ]}
/>`
                )
            }
            <Map
                shapes={[
                    {
                        type: 'polyline',
                        points: [
                            [35.699939, 51.338497],
                            [35.6992, 51.34],
                            [35.6999, 51.345],
                            [35.695, 51.35],
                            [35.695, 51.36],
                        ],
                        style: {
                            stroke: {
                                width: 4,
                                color: 'purple',
                                
                            }
                        }
                    }
                ]}
            />
        </div>
    )
}
const Layers: FC = () => {
    return (
        <div className="example">
            <Map
                layers={{
                    position:'topright',
                    items:[
                        {
                            name:'circles',
                            shapes:[
                                {
                                    type: 'circle',
                                    center: [35.699939, 51.338497],
                                    radius: 600,
                                    style:{
                                        stroke:{
                                            width:2,
                                            color:'red',
                                            dash:'4,8'
                                        },
                                        fill:{
                                            color:'red',
                                            opacity:0.2
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name:'rects',
                            shapes:[
                                {
                                    type: 'rect',
                                    points: [
                                        [35.699939, 51.338497],
                                        [35.692, 51.35],
                                    ],
                                    style: {
                                        stroke: {
                                            width: 2,
                                            color: 'red',
                                            dash: '4,8'
                                        },
                                        fill: {
                                            color: 'red',
                                            opacity: 0.2
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name:'polylines',
                            shapes:[
                                {
                                    type: 'polyline',
                                    points: [
                                        [35.699939, 51.338497],
                                        [35.6992, 51.34],
                                        [35.6999, 51.345],
                                        [35.695, 51.35],
                                        [35.695, 51.36],
                                    ],
                                    style: {
                                        stroke: {
                                            width: 4,
                                            color: 'purple',
                                            
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }}
            />
        </div>
    )
}

const Footer: FC = () => {
    const [value, setValue] = useState<[number, number]>([35.699939, 51.338497])
    return (
        <div className="example">
            <Map 
                value={value} 
                onChange={(newValue: [number, number]) => setValue(newValue)} 
                footer={<p>{`lat:${value[0]} - lng:${value[1]}`}</p>}
            />
            
            {
                Code(
`function Example(){
    const [value,setValue] = useState([35.699939, 51.338497])
    return (
        <Map 
            value={value} 
            onChange={(newValue: [number, number]) => setValue(newValue)} 
            footer={<p>{${'`lat:${value[0]} - lng:${value[1]}`'}}</p>}
        />
    )
}`
                )
            }
        </div>
    )
}