import React, { Component,createRef } from 'react';
import DOC from '../../resuse-components/doc';
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOMap from './../../npm/aio-map/aio-map';
import './index.css';
import {Icon} from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight,mdiOfficeBuilding,mdiGift } from '@mdi/js';
export default class DOC_AIOMap extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='markers'
                navs={[
                    { text: 'apiKeys', id: 'apiKeys', COMPONENT: () => <APIKeys /> },
                    { text: 'latitude , longitude , zoom', id: 'latlngzoom', COMPONENT: () => <LatLngZoom /> },
                    { text: 'onChange', id: 'onChange', COMPONENT: () => <OnChange /> },
                    { text: 'area', id: 'area', COMPONENT: () => <Area /> },
                    { text: 'markers', id: 'markers', COMPONENT: () => <Markers /> },
                    { text: 'search', id: 'search', COMPONENT: () => <Search /> },
                ]}
            />
        )
    }
}
class APIKeys extends Component {
    preview() {
        return (
            <div className='example'>
                <AIOMap
                    apiKeys={{
                        map:'web.bfb13683318840ad840923a88043ceba',
                        service:'service.f84df93b4aa94b609e2d30b7c765a719',
                    }}
                />
                {
                    AIODoc().Code(`
<AIOMap
    apiKeys={{
        map:'web.bfb13683318840ad840923a88043ceba',
        service:'service.f84df93b4aa94b609e2d30b7c765a719',
    }}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class LatLngZoom extends Component {
    state = {latitude:35.694739,longitude:51.394097,zoom:14}
    change(dir,field,fixed){
        let result = this.state[field] + dir;
        result = +result.toFixed(fixed)
        this.setState({[field]:result})
    }
    preview() {
        let {latitude,longitude,zoom} = this.state;
        return (
            <div className='example'>
                <RVD
                    layout={{
                        row:[
                            {
                                style:{border:'1px solid #ddd',padding:12},
                                row:[
                                    {html:'latitude',align:'v',className:'bold'},
                                    {size:12},
                                    {
                                        row:[
                                            {html:<button onClick={()=>this.change(-0.001,'latitude',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:latitude,size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(0.001,'latitude',6)}><Icon size={1} path={mdiChevronRight}/></button>}
                                        ]
                                    }
                                ]
                            },
                            {size:36},
                            {
                                style:{border:'1px solid #ddd',padding:12},
                                row:[
                                    {html:'longitude',align:'v',className:'bold'},
                                    {size:12},
                                    {
                                        row:[
                                            {html:<button onClick={()=>this.change(-0.001,'longitude',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:longitude,size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(0.001,'longitude',6)}><Icon size={1} path={mdiChevronRight}/></button>}
                                        ]
                                    }
                                ]
                            },
                            {size:36},
                            {
                                style:{border:'1px solid #ddd',padding:12},
                                row:[
                                    {html:'zoom',align:'v',className:'bold'},
                                    {size:12},
                                    {
                                        row:[
                                            {html:<button onClick={()=>this.change(-1,'zoom')}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:zoom,size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(1,'zoom')}><Icon size={1} path={mdiChevronRight}/></button>}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }}
                />
                <AIOMap
                    apiKeys={{
                        map:'web.bfb13683318840ad840923a88043ceba',
                        service:'service.f84df93b4aa94b609e2d30b7c765a719',
                    }}
                    latitude={latitude}
                    longitude={longitude}
                    zoom={zoom}
                />
                {
                    AIODoc().Code(`
<AIOMap
    apiKeys={{
        map:'web.bfb13683318840ad840923a88043ceba',
        service:'service.f84df93b4aa94b609e2d30b7c765a719',
    }}
    latitude={${latitude}}
    longitude={${longitude}}
    zoom={${zoom}}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnChange extends Component {
    state = {latitude:35.694739,longitude:51.394097}
    preview() {
        let {latitude,longitude} = this.state;
        return (
            <div className='example'>
                <span>{`latitude = ${latitude}`}</span>
                <span>{`longitude = ${longitude}`}</span>
                <AIOMap
                    apiKeys={{
                        map:'web.bfb13683318840ad840923a88043ceba',
                        service:'service.f84df93b4aa94b609e2d30b7c765a719',
                    }}
                    latitude={latitude}
                    longitude={longitude}
                    onChange={(latitude,longitude)=>{
                        this.setState({latitude,longitude})
                    }}
                />
                {
                    AIODoc().Code(`
<AIOMap
    apiKeys={{
        map:'web.bfb13683318840ad840923a88043ceba',
        service:'service.f84df93b4aa94b609e2d30b7c765a719',
    }}
    latitude={latitude}
    longitude={longitude}
    onChange={(latitude,longitude)=>{
        this.setState({latitude,longitude})
    }}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Area extends Component {
    state = {area:{latitude:35.694739,longitude:51.394097,radius:2000,color:'orange',opacity:0.2}}
    change(dir,field,fixed){
        let result = this.state.area[field] + dir;
        result = +result.toFixed(fixed)
        this.setState({area:{...this.state.area,[field]:result}})
    }
    preview() {
        let {area} = this.state; 
        return (
            <div className='example'>
                <RVD
                    layout={{
                        row:[
                            {
                                style:{border:'1px solid #ddd',padding:12},
                                row:[
                                    {html:'latitude',align:'v',className:'bold'},
                                    {size:12},
                                    {
                                        row:[
                                            {html:<button onClick={()=>this.change(-0.001,'latitude',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:area.latitude,size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(0.001,'latitude',6)}><Icon size={1} path={mdiChevronRight}/></button>}
                                        ]
                                    }
                                ]
                            },
                            {size:36},
                            {
                                style:{border:'1px solid #ddd',padding:12},
                                row:[
                                    {html:'longitude',align:'v',className:'bold'},
                                    {size:12},
                                    {
                                        row:[
                                            {html:<button onClick={()=>this.change(-0.001,'longitude',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:area.longitude,size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(0.001,'longitude',6)}><Icon size={1} path={mdiChevronRight}/></button>}
                                        ]
                                    }
                                ]
                            },
                            {size:36},
                            {
                                style:{border:'1px solid #ddd',padding:12},
                                row:[
                                    {html:'radius',align:'v',className:'bold'},
                                    {size:12},
                                    {
                                        row:[
                                            {html:<button onClick={()=>this.change(-100,'radius',0)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:area.radius,size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(100,'radius',0)}><Icon size={1} path={mdiChevronRight}/></button>}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }}
                />
                <AIOMap
                    apiKeys={{
                        map:'web.bfb13683318840ad840923a88043ceba',
                        service:'service.f84df93b4aa94b609e2d30b7c765a719',
                    }}
                    latitude={35.694739}
                    longitude={51.394097}
                    area={area}
                />
                {
                    AIODoc().Code(`
<AIOMap
    apiKeys={{
        map:'web.bfb13683318840ad840923a88043ceba',
        service:'service.f84df93b4aa94b609e2d30b7c765a719',
    }}
    latitude={35.694739}
    longitude={51.394097}
    area={{
        latitude:${area.latitude},
        longitude:${area.longitude},
        radius:${area.radius},
        color:'orange',
        opacity:0.2
    }}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Markers extends Component {
    state = {
        markers:[
            {latitude:35.76025388385241,longitude:51.40858858823776,size:30,color:'orange',html:<Icon path={mdiOfficeBuilding} size={1}/>},
            {latitude:35.76920327411297,longitude:51.40546649694443,size:30,color:'red',html:<Icon path={mdiOfficeBuilding} size={1}/>},
            {latitude:35.78097175634515,longitude:51.39394909143448,size:30,color:'red',html:<Icon path={mdiGift} size={1}/>,text:<div style={{color:'#fff',background:'red',padding:'0 12px'}}>this is my text</div>}
        ]
    }
    change(dir,field,fixed){
        let {markers} = this.state;
        let result = markers[0][field] + dir;
        result = +result.toFixed(fixed)
        this.setState({markers:markers.map((o,i)=>i === 0?{...markers[i],[field]:result}:o)})
    }
    preview() {
        let {markers} = this.state; 
        return (
            <div className='example'>
                <RVD
                    layout={{
                        row:[
                            {
                                style:{border:'1px solid #ddd',padding:12},
                                row:[
                                    {html:'latitude',align:'v',className:'bold'},
                                    {size:12},
                                    {
                                        row:[
                                            {html:<button onClick={()=>this.change(-0.001,'latitude',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:markers[0].latitude,size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(0.001,'latitude',6)}><Icon size={1} path={mdiChevronRight}/></button>}
                                        ]
                                    }
                                ]
                            },
                            {size:36},
                            {
                                style:{border:'1px solid #ddd',padding:12},
                                row:[
                                    {html:'longitude',align:'v',className:'bold'},
                                    {size:12},
                                    {
                                        row:[
                                            {html:<button onClick={()=>this.change(-0.001,'longitude',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:markers[0].longitude,size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(0.001,'longitude',6)}><Icon size={1} path={mdiChevronRight}/></button>}
                                        ]
                                    }
                                ]
                            },
                            {size:36},
                            {
                                style:{border:'1px solid #ddd',padding:12},
                                row:[
                                    {html:'radius',align:'v',className:'bold'},
                                    {size:12},
                                    {
                                        row:[
                                            {html:<button onClick={()=>this.change(-1,'size',0)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:markers[0].size,size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(1,'size',0)}><Icon size={1} path={mdiChevronRight}/></button>}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }}
                />
                <AIOMap
                    apiKeys={{
                        map:'web.bfb13683318840ad840923a88043ceba',
                        service:'service.f84df93b4aa94b609e2d30b7c765a719',
                    }}
                    zoom={13}
                    latitude={35.76920327411297}
                    longitude={51.40546649694443}
                    markers={markers}
                />
                {
                    AIODoc().Code(`
<AIOMap
    apiKeys={{
        map:'web.bfb13683318840ad840923a88043ceba',
        service:'service.f84df93b4aa94b609e2d30b7c765a719',
    }}
    zoom={13}
    latitude={35.76920327411297}
    longitude={51.40546649694443}
    markers={[
        {
            latitude:${markers[0].latitude},
            longitude:${markers[0].longitude},
            size:${markers[0].size},
            color:'orange',
            html:<Icon path={mdiOfficeBuilding} size={1}/>
        },
        {
            latitude:35.76920327411297,
            longitude:51.40546649694443,
            size:30,
            color:'red',
            html:<Icon path={mdiOfficeBuilding} size={1}/>
        },
        {
            latitude:35.78097175634515,
            longitude:51.39394909143448,
            size:30,
            color:'red',
            html:<Icon path={mdiGift} size={1}/>,
            text:<div style={{color:'#fff',background:'red',padding:'0 12px'}}>this is my text</div>
        }
    ]}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Search extends Component {
    state = {latitude:35.694739,longitude:51.394097}
    preview() {
        let {latitude,longitude} = this.state;
        return (
            <div className='example'>
                <span>{`latitude = ${latitude}`}</span>
                <span>{`longitude = ${longitude}`}</span>
                <AIOMap
                    apiKeys={{
                        map:'web.bfb13683318840ad840923a88043ceba',
                        service:'service.f84df93b4aa94b609e2d30b7c765a719',
                    }}
                    search={true}
                    latitude={latitude}
                    longitude={longitude}
                    onChange={(latitude,longitude)=>{
                        this.setState({latitude,longitude})
                    }}
                />
                {
                    AIODoc().Code(`
<AIOMap
    apiKeys={{
        map:'web.bfb13683318840ad840923a88043ceba',
        service:'service.f84df93b4aa94b609e2d30b7c765a719',
    }}
    search={true}
    latitude={latitude}
    longitude={longitude}
    onChange={(latitude,longitude)=>{
        this.setState({latitude,longitude})
    }}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'preview',
            tabs: [
                { text: 'Preview', value: 'preview' },
                { text: 'Code', value: 'code' }
            ]
        }
    }
    body_layout() {
        let { tab } = this.state;
        return tab === 'preview' ? this.preview_layout() : this.code_layout()
    }
    preview_layout() {
        let { preview } = this.props;
        return {
            flex: 1,
            className: 'p-12',
            html: preview()
        }
    }
    code_layout() {
        let { code, rtl = false } = this.props;
        return {
            flex: 1,
            html: (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'auto' }}>
                    <pre style={{ padding: 12 }}>{AIODoc().Code(code())}</pre>
                </div>
            )
        }
    }
    toolbar_layout() {
        let { toolbar } = this.props;
        if (!toolbar) { return false }
        return {
            html: toolbar()
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    column: [
                        this.toolbar_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}




