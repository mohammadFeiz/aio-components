import React, { Component,createRef } from 'react';
import DOC from '../../../resuse-components/doc';
import AIODoc from '../../../npm/aio-documentation/aio-documentation';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from '../../../npm/aio-input/aio-input';
import './doc-aio-input-map.css';
import {Icon} from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight,mdiOfficeBuilding,mdiGift } from '@mdi/js';
AIOInput.defaults.mapApiKeys = {
    map:'web.0a2aa5f83d314a8c9916473aa0e01438',
    service:'service.09a2234e299a4ff585007b2894df9fca',
}
AIOInput.defaults.validate = true
export default class DOC_AIOInput_map extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='apiKeys'
                nav={{
                    items:[
                        { text: 'apiKeys', id: 'apiKeys', render: () => <APIKeys /> },
                        { text: 'zoomable', id: 'zoomable', render: () => <Zoomable /> },
                        { text: 'traffic', id: 'traffic', render: () => <Traffic /> },
                        { text: 'onClick', id: 'onClick', render: () => <OnClick /> },
                        { text: 'title', id: 'title', render: () => <Title /> },
                        { text: 'marker', id: 'showMarker', render: () => <Marker /> },
                        { text: 'value zoom', id: 'valuezoom', render: () => <ValueZoom /> },
                        { text: 'onChange', id: 'onChange', render: () => <OnChange /> },
                        { text: 'area', id: 'area', render: () => <Area /> },
                        { text: 'markers', id: 'markers', render: () => <Markers /> },
                        { text: 'search', id: 'search', render: () => <Search /> },
                        { text: 'popup', id: 'popup', render: () => <Popup /> },
                    ]
                }}
            />
        )
    }
}
class APIKeys extends Component {
    preview() {
        return (
            <div className='example'>
                {
                    AIODoc().Code(`
AIOInput.defaults.mapApiKeys = {
    map:'web.0a2aa5f83d314a8c9916473aa0e01438',
    service:'service.09a2234e299a4ff585007b2894df9fca',
}
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Zoomable extends Component {
    constructor(props){
        super(props);
    }
    preview() {
        return (
            <div className='example'>
                <AIOInput type='map' mapConfig={{zoomable:false}}/>
                {
                    AIODoc().Code(`
<AIOInput type='map' mapConfig={{zoomable:false}}/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Traffic extends Component {
    preview() {
        return (
            <div className='example'>
                <AIOInput type='map' mapConfig={{traffic:true}}/>
                {
                    AIODoc().Code(`
<AIOInput type='map' mapConfig={{traffic:true}}/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnClick extends Component {
    preview() {
        return (
            <div className='example'>
                <AIOInput type='map' attrs={{onClick:()=>alert('you clicked map')}}/>
                {
                    AIODoc().Code(`
<AIOInput type='map' attrs={{onClick:()=>alert('you clicked map')}}/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Title extends Component {
    preview() {
        return (
            <div className='example'>
                <AIOInput type='map' mapConfig={{title:'نمایش موقعیت'}}/>
                {
                    AIODoc().Code(`
<AIOInput type='map' mapConfig={{title:'نمایش موقعیت'}}/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Marker extends Component {
    preview() {
        return (
            <div className='example'>
                <AIOInput type='map' mapConfig={{marker:false}}/>
                {
                    AIODoc().Code(`
<AIOInput type='map' mapConfig={{marker:false}}/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class ValueZoom extends Component {
    constructor(props){
        super(props);
        this.state = {lat:35.694739,lng:51.394097,zoom:14}
    
    }
    change(dir,field,fixed){
        let result = this.state[field] + dir;
        result = +result.toFixed(fixed)
        this.setState({[field]:result})
    }
    preview() {
        let {lat,lng,zoom} = this.state;
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
                                            {html:<button onClick={()=>this.change(-0.001,'lat',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:lat,size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(0.001,'lat',6)}><Icon size={1} path={mdiChevronRight}/></button>}
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
                                            {html:<button onClick={()=>this.change(-0.001,'lng',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:lng,size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(0.001,'lng',6)}><Icon size={1} path={mdiChevronRight}/></button>}
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
                <AIOInput type='map' mapConfig={{zoom}} value={{lat,lng}}/>
                {
                    AIODoc().Code(`
<AIOInput type='map' mapConfig={{zoom:${zoom}}} value={{${lat},${lng}}}/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnChange extends Component {
    constructor(props){
        super(props);
        this.state = {lat:35.694739,lng:51.394097}
    }
    preview() {
        let {lat,lng} = this.state;
        return (
            <div className='example'>
                <span>{`latitude = ${lat}`}</span>
                <span>{`longitude = ${lng}`}</span>
                <AIOInput type='map' value={{lat,lng}} onChange={({lat,lng})=>this.setState({lat,lng})}/>
                {
                    AIODoc().Code(`
<AIOInput type='map' value={{lat,lng}} onChange={({lat,lng})=>this.setState({lat,lng})}/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Area extends Component {
    constructor(props){
        super(props);
        this.state = {area:{lat:35.694739,lng:51.394097,radius:2000,color:'orange',opacity:0.2}}
    }
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
                        column:[
                            {
                                row:[
                                    {
                                        style:{border:'1px solid #ddd',padding:12},
                                        row:[
                                            {html:'latitude',align:'v',className:'bold'},
                                            {size:12},
                                            {
                                                row:[
                                                    {html:<button onClick={()=>this.change(-0.001,'lat',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                                    {html:area.lat,size:120,align:'vh'},
                                                    {html:<button onClick={()=>this.change(0.001,'lng',6)}><Icon size={1} path={mdiChevronRight}/></button>}
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
                                                    {html:<button onClick={()=>this.change(-0.001,'lng',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                                    {html:area.lng,size:120,align:'vh'},
                                                    {html:<button onClick={()=>this.change(0.001,'lng',6)}><Icon size={1} path={mdiChevronRight}/></button>}
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
                            },
                            {
                                row:[
                                    {
                                        flex:1,
                                        style:{border:'1px solid #ddd',padding:12},
                                        row:[
                                            {html:'opacity',align:'v',className:'bold'},
                                            {
                                                flex:1,
                                                html:(
                                                    <AIOInput
                                                        type='slider' showValue='inline' attrs={{style:{width:'100%'}}} value={area.opacity} step={0.1} start={0} end={1}
                                                        onChange={(opacity)=>this.setState({area:{...area,opacity}})}
                                                    />
                                                )
                                            }
                                        ]
                                    },
                                    {size:24},
                                    {
                                        flex:1,
                                        style:{border:'1px solid #ddd',padding:12},
                                        row:[
                                            {html:'color',align:'v',className:'bold'},
                                            {size:12},
                                            {
                                                flex:1,
                                                html:(
                                                    <AIOInput
                                                        type='color' attrs={{style:{width:'100%'}}} value={area.color}
                                                        onChange={(color)=>this.setState({area:{...area,color}})}
                                                    />
                                                )
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    }}
                />
                <AIOInput type='map' mapConfig={{area}}/>
                {
                    AIODoc().Code(`
....
let = area:{
    latitude:${area.latitude},
    longitude:${area.longitude},
    radius:${area.radius},
    color:${area.color},
    opacity:${area.opacity}
}
<AIOInput type='map'mapConfig={{area}}/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Markers extends Component {
    constructor(props){
        super(props);
        this.state = {
            lat:35.76025287,lng:51.40858757,
            markers:[
                {
                    lat:35.76025388385241,lng:51.40858858823776,size:30,color:'orange',
                    html:<Icon path={mdiOfficeBuilding} size={1}/>,
                    popup:({lat,lng})=>lat
                },
                {
                    lat:35.76920327411297,lng:51.40546649694443,size:30,color:'red',
                    html:<Icon path={mdiOfficeBuilding} size={1}/>,
                    popup:({lat,lng})=>lat
                },
                {
                    lat:35.78097175634515,lng:51.39394909143448,size:30,color:'red',
                    html:<Icon path={mdiGift} size={1}/>,text:<div style={{color:'#fff',background:'red',padding:'0 12px'}}>this is my text</div>,
                    popup:({lat,lng})=>lat
                }
            ]
        }
    }
    change(dir,field,fixed){
        let {markers} = this.state;
        let result = markers[0][field] + dir;
        result = +result.toFixed(fixed)
        this.setState({markers:markers.map((o,i)=>i === 0?{...markers[i],[field]:result}:o)})
    }
    preview() {
        let {markers,lat,lng} = this.state; 
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
                                            {html:<button onClick={()=>this.change(-0.001,'lat',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:markers[0].lat.toFixed(6),size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(0.001,'lat',6)}><Icon size={1} path={mdiChevronRight}/></button>}
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
                                            {html:<button onClick={()=>this.change(-0.001,'lng',6)}><Icon size={1} path={mdiChevronLeft}/></button>},
                                            {html:markers[0].lng.toFixed(6),size:120,align:'vh'},
                                            {html:<button onClick={()=>this.change(0.001,'lng',6)}><Icon size={1} path={mdiChevronRight}/></button>}
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
                <AIOInput type='map' value={{lat,lng}} mapConfig={{markers}}/>
                {
                    AIODoc().Code(`
let lat = ${lat},lng = ${lng};
ler markers = [
    {
        lat:${markers[0].lat},
        lng:${markers[0].lng},
        size:30,
        color:'orange',
        html:<Icon path={mdiOfficeBuilding} size={1}/>,
        popup:(marker)=>marker.latitude
    },
    {
        lat:35.76920327411297,
        lng:51.40546649694443,
        size:30,
        color:'red',
        html:<Icon path={mdiOfficeBuilding} size={1}/>,
        popup:(marker)=>marker.latitude
    },
    {
        lat:35.78097175634515,
        lng:51.39394909143448,
        size:30,
        color:'red',
        html:<Icon path={mdiGift} size={1}/>,
        text:<div style={{color:'#fff',background:'red',padding:'0 12px'}}>this is my text</div>,
        popup:(marker)=>marker.latitude
    }
]
<AIOInput type='map' value={{lat,lng}} mapConfig={{markers}}/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Search extends Component {
    constructor(props){
        super(props);
        this.state = {
            lat:35.694739,lng:51.394097
        }
    }
    preview() {
        let {lat,lng} = this.state;
        return (
            <div className='example'>
                <span>{`latitude = ${lat}`}</span>
                <span>{`longitude = ${lng}`}</span>
                <AIOInput type='map' value={{lat,lng}} onChange={({lat,lng})=>this.setState({lat,lng})} mapConfig={{search:true}}/>
                {
                    AIODoc().Code(`
let lat=${lat},lng=${lng};
<AIOInput 
    type='map'
    value={{lat,lng}} 
    onChange={({lat,lng})=>this.setState({lat,lng})}
    mapConfig={{search:true}}
/>
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Popup extends Component {
    constructor(props){
        super(props);
        this.state = {
            lat:35.694739,lng:51.394097
        }
    }
    preview() {
        let {lat,lng} = this.state;
        return (
            <div className='example'>
                <span>{`latitude = ${lat}`}</span>
                <span>{`longitude = ${lng}`}</span>
                <AIOInput type='map' value={{lat,lng}} onChange={({lat,lng})=>this.setState({lat,lng})} popup={{title:'انتخاب موقعیت'}}/>
                {
                    AIODoc().Code(`
<AIOInput 
    type='map' 
    value={{lat,lng}} 
    onChange={({lat,lng})=>this.setState({lat,lng})} 
    popup={{title:'انتخاب موقعیت'}}
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




