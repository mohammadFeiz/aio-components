import { FC, useEffect, useRef, useState } from 'react';
import DOC from '../../resuse-components/Doc/index.tsx';
import {Code} from './../../npm/aio-component-utils';
import { AISelect, AITabs } from '../../npm/aio-input';
import AIMap from '../../npm/aio-map/index.tsx';
type I_show_item = 'preview' | 'code' | 'both'
type I_Map = React.ComponentProps<typeof AIMap>;
const Show: FC<{ onChange: (v: I_show_item) => void }> = ({ onChange }) => {
    const options: I_show_item[] = ['preview', 'code', 'both']
    const [value, setValue] = useState<I_show_item>('both')
    function change(v: I_show_item) {
        setValue(v)
        onChange(v)
    }
    return (
        <AISelect
            value={value} onChange={(value) => change(value)} options={options}
            option={{ text: (option) => option, value: (option) => option }}
        />
    )
}
export default function DOC_Map(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            items={[
                { text: 'Basic', value: 'Basic', render: () => <Basic /> },
                { text: 'onChange', value: 'onChange', render: () => <OnChange /> },
                { text: 'onSubmit', value: 'onSubmit', render: () => <OnSubmit /> },
                { text: 'change by parent', value: 'changebyparent', render: () => <ChangeByParent /> },
                { text: 'dragging', value: 'dragging', render: () => <Dragging /> },
                { text: 'marker', value: 'marker', render: () => <Marker /> },
                { text: 'markers', value: 'markers', render: () => <Markers /> },
                { text: 'onClick', value: 'onclick', render: () => <OnClick /> },
                { text: 'shapes', value: 'shapes', render: () => <Shapes /> },
                { text: 'layers', value: 'layers', render: () => <Layers /> },
                { text: 'zoom', value: 'zoom', render: () => <Zoom /> },
                { text: 'footer', value: 'footer', render: () => <Footer /> },
                { text: 'flyTo', value: 'flyTo', render: () => <FlyTo /> },
            ]}
        />
    )
}

const Basic: FC = () => {
    return (
        <div className="example">
            <AIMap />
        </div>
    )
}
type I_Zoom_tab = 'value' | 'control' | 'wheel'
const Zoom: FC = () => {
    const [tabs] = useState<I_Zoom_tab[]>(['value', 'control', 'wheel'])
    const [tab, setTab] = useState<I_Zoom_tab>('value')
    return (
        <div className="example">
            <AITabs options={tabs} option={{ text: (option) => option, value: (option) => option }} value={tab} onChange={(tab) => setTab(tab)} className='c-0' />
            {
                tab === 'control' &&
                <>
                    <AIMap zoom={{ control: false }} />
                    {Code(`<Map zoom={{ control: false }} />`)}
                </>
            }
            {
                tab === 'wheel' &&
                <>
                    <AIMap zoom={{ wheel: true }} />
                    {Code(`<Map zoom={{ wheel: true }} />`)}
                </>
            }
            {
                tab === 'value' &&
                <>
                    <AIMap zoom={{ value: 10 }} />
                    {Code(`<Map zoom={{ value: 10 }} />`)}
                </>
            }

        </div>
    )
}
const OnChange: FC = () => {
    const [value, setValue] = useState<[number, number]>([35.699939, 51.338497])
    return (
        <div className="example">
            <AIMap value={value} onChange={(newValue: [number, number]) => setValue(newValue)} />
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
            <AIMap
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
            <AIMap value={value} />
        </div>
    )
}
const Dragging: FC = () => {
    return (
        <div className="example">
            <AIMap dragging={false} />
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
        <Comp
            tabs={{
                'false': {
                    preview: { marker: false },
                    code: '{marker:false}'
                },
                'html': {
                    preview: {
                        marker: (
                            <div className='flex-col- align-h- w-24-'>
                                <div className='w-10- h-10- br-100-' style={{ background: '#4AA45D' }}></div>
                                <div className='w-2- h-16- bg-0-'></div>
                            </div>
                        )
                    },
                    code: (
                        `
marker: (
    <div className='flex-col- align-h- w-24-'>
        <div className='w-10- h-10- br-100-' style={{ background: '#4AA45D' }}></div>
        <div className='w-2- h-16- bg-0-'></div>
    </div>
)
                        `
                    )
                }
            }}
        />
    )
}
const Markers: FC = () => {
    return (
        <Comp
            tabs={{
                basic: {
                    preview: {
                        markers: [
                            {
                                pos: [35.699, 51.338],
                                html: (
                                    <div className='flex-col- align-h- w-24-' onClick={() => alert()}>
                                        <div className='w-10- h-10- br-100-' style={{ background: '#4AA45D' }}></div>
                                        <div className='w-2- h-16- bg-0-'></div>
                                    </div>
                                )
                            },
                            {
                                pos: [35.700, 51.341]
                            },
                        ]
                    },
                    code: (
                        `
markers:[
    {
        pos: [35.699, 51.338],
        html: (
            <div className='flex-col- fd-column- align-h- w-24-'>
                <div className='w-10- h-10- br-100-' style={{ background: '#4AA45D' }}></div>
                <div className='w-2- h-16- bg-0-'></div>
            </div>
        )
    },
    {
        pos: [35.700, 51.341]
    },
]
                        `
                    )
                }
            }}
        />
    )
}
const OnClick: FC = () => {
    return (
        <div className="example">
            <AIMap onClick={() => alert('map click')} />
        </div>
    )
}
const Shapes: FC = () => {
    return (
        <Comp
            tabs={{
                'circle': {
                    preview: {
                        shapes: [
                            {
                                type: 'circle', center: [35.699939, 51.338497], radius: 600,
                                style: {
                                    stroke: { width: 2, color: 'red', dash: '4,8' },
                                    fill: { color: 'red', opacity: 0.2 }
                                }
                            }
                        ]
                    },
                    code: `
{
    shapes: [
        {
            type: 'circle',center: [35.699939, 51.338497],radius: 600,
            style: {
                stroke: {width: 2,color: 'red',dash: '4,8'},
                fill: {color: 'red',opacity: 0.2}
            }
        }
    ]
}
                    `
                },
                rect: {
                    preview: {
                        shapes: [
                            {
                                type: 'rect', points: [[35.699939, 51.338497], [35.692, 51.35]],
                                style: {
                                    stroke: { width: 2, color: 'red', dash: '4,8' },
                                    fill: { color: 'red', opacity: 0.2 }
                                }
                            }
                        ]
                    },
                    code: `
{
    shapes: [
        {
            type: 'rect',points: [[35.699939, 51.338497],[35.692, 51.35]],
            style: {
                stroke: {width: 2,color: 'red',dash: '4,8'},
                fill: {color: 'red',opacity: 0.2}
            }
        }
    ]
}
                    `
                },
                polyline: {
                    preview: {
                        shapes: [
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
                                    stroke: { width: 4, color: 'purple' }
                                }
                            }
                        ]
                    },
                    code: `
{
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
                stroke: {width: 4,color: 'purple'}
            }
        }
    ]
}
                    `
                }
            }}
        />
    )
}
const Layers: FC = () => {
    return (
        <div className="example">
            <AIMap
                layers={{
                    position: 'topright',
                    items: [
                        {
                            name: 'circles',
                            shapes: [
                                {
                                    type: 'circle',
                                    center: [35.699939, 51.338497],
                                    radius: 600,
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
                            name: 'rects',
                            shapes: [
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
                            name: 'polylines',
                            shapes: [
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
            {
                Code(
                    `<Map
    layers={{
        position: 'topright',
        items: [
            {
                name: 'circles',
                shapes: [
                    {
                        type: 'circle',
                        center: [35.699939, 51.338497],
                        radius: 600,
                        style: {
                            stroke: {width: 2,color: 'red',dash: '4,8'},
                            fill: {color: 'red',opacity: 0.2}
                        }
                    }
                ]
            },
            {
                name: 'rects',
                shapes: [
                    {
                        type: 'rect',
                        points: [
                            [35.699939, 51.338497],
                            [35.692, 51.35],
                        ],
                        style: {
                            stroke: {width: 2,color: 'red',dash: '4,8'},
                            fill: {color: 'red',opacity: 0.2}
                        }
                    }
                ]
            },
            {
                name: 'polylines',
                shapes: [
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
                            stroke: {width: 4,color: 'purple'}
                        }
                    }
                ]
            }
        ]
    }}
/>`
                )
            }
        </div>
    )
}
const Footer: FC = () => {
    const [value, setValue] = useState<[number, number]>([35.699939, 51.338497])
    return (
        <div className="example">
            <AIMap
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
type I_tabs = {
    [key: string]: {
        preview: I_Map,
        code: string
    }
}
const Comp: FC<{ tabs: I_tabs }> = (props) => {
    const [tabs] = useState<string[]>(Object.keys(props.tabs))
    const [tab, setTab] = useState<string>(tabs[0])
    const [show, setShow] = useState<I_show_item>('both')
    function preview(Tab: string, props: I_Map) {
        if (Tab !== tab) { return null }
        return show === 'code' ? null : <AIMap {...props} />
    }
    function code(Tab: string, code: string) {
        if (Tab !== tab) { return null }
        return show === 'preview' ? null : Code(code)
    }
    return (
        <div className="example">
            <AITabs
                options={tabs} option={{ text: (option) => option, value: (option) => option }} value={tab} onChange={(tab) => setTab(tab)} className='c-0'
                after={(<Show onChange={(v) => setShow(v)} />)}
            />
            {
                tabs.map((t) => {
                    return (
                        <>
                            {preview(t, props.tabs[t].preview)}
                            {code(t, props.tabs[t].code)}
                        </>
                    )
                })
            }
        </div>
    )
}
const FlyTo: FC = () => {
    const [value, setValue] = useState<[number, number]>([35.699939, 51.338497])
    const actionsRef = useRef<any>()
    return (
        <div className="example">
            <AIMap
                value={value}
                zoom={{ wheel: true }}
                onChange={(newValue: [number, number]) => setValue(newValue)}
                actionsRef={actionsRef}
            />
            <button onClick={() => {
                const newZoom = 18;
                const newLat = 35.69;
                const newLng = 51.33;
                actionsRef.current.flyTo({
                    lat: newLat, lng: newLng, zoom: newZoom,
                    callback: () => {
                        setValue([newLat, newLng])
                    }
                })
            }}>Fly To 35.69,51.33</button>
            {
                Code(`
const FlyTo: FC = () => {
    const [value, setValue] = useState<[number, number]>([35.699939, 51.338497])
    const [zoom, setZoom] = useState<number>(14)
    const actionsRef = useRef<any>()
    return (
        <div className="example">
            <AIMap
                value={value}
                zoom={{ value: zoom, wheel: true }}
                onChange={(newValue: [number, number]) => setValue(newValue)}
                actionsRef={actionsRef}
            />
            <button onClick={() => {
                const newZoom = 18;
                const newLat = 35.69;
                const newLng = 51.33;
                actionsRef.current.flyTo({
                    lat: newLat, lng: newLng, zoom: newZoom,
                    callback: () => {
                        setValue([newLat, newLng])
                        setZoom(newZoom)
                    }
                })
            }}>Fly To 35.69,51.33</button>
        </div>
    )
}`
                )
            }
        </div>
    )
}